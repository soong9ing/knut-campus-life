/* =============================================================
   캠퍼스 챗봇 중간 서버 (Gemini 연결)
   -------------------------------------------------------------
   - 사이트 파일을 http://localhost:8000 으로 보여 주고,
     /api/chat 으로 들어온 질문을 Gemini에 전달해요.
   - API 키는 이 서버만 알고, 사이트(브라우저)에는 절대 보내지 않아요.

   실행:  node server/chat-server.js
   모델 목록 보기:  node server/chat-server.js --models

   설정 (server/.env 파일 또는 환경변수):
     GEMINI_API_KEY=발급받은 키          (필수)
     GEMINI_MODEL=gemini-flash-latest   (선택, 무료 한도가 막히면 다른 모델로)
     PORT=8000                          (선택)
     HOST=127.0.0.1                     (선택, 같은 와이파이 휴대폰으로 보려면 0.0.0.0)
   외부 패키지 없이 Node.js 18 이상만 있으면 돼요.
   ============================================================= */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// ---------- 설정 읽기 (.env → 환경변수) ----------
function loadEnv() {
  const file = path.join(__dirname, ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();
const KEY = process.env.GEMINI_API_KEY || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "127.0.0.1";
const API = "https://generativelanguage.googleapis.com/v1beta";

// 남용 방지: 한 번에 받는 크기와 답변 길이 제한
const MAX_BODY = 200 * 1024;      // 요청 최대 200KB
const MAX_SYSTEM = 120 * 1024;    // 사이트 정보 최대 120KB
const MAX_MSG = 600;              // 질문 한 개 최대 글자 수
const MAX_TURNS = 10;
const MAX_OUTPUT_TOKENS = 2048;

// ---------- 모델 목록 보기 ----------
if (process.argv.includes("--models")) {
  if (!KEY) { console.error("GEMINI_API_KEY가 없어요. server/.env 에 넣어 주세요."); process.exit(1); }
  fetch(`${API}/models?pageSize=200`, { headers: { "x-goog-api-key": KEY } })
    .then((r) => r.json())
    .then((j) => {
      if (j.error) { console.error("오류:", j.error.message); process.exit(1); }
      (j.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
        .forEach((m) => console.log(m.name.replace(/^models\//, "").padEnd(40), m.displayName || ""));
    })
    .catch((e) => { console.error("목록을 가져오지 못했어요:", e.message); process.exit(1); });
  return;
}

// ---------- 정적 파일 ----------
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon"
};
function serveStatic(req, res) {
  let p;
  try { p = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { res.writeHead(400).end(); return; }
  if (p.endsWith("/")) p += "index.html";
  const file = path.resolve(ROOT, "." + p);
  // 사이트 폴더 밖, server 폴더(.env 등)는 보여 주지 않아요
  if (!file.startsWith(ROOT + path.sep) || file.startsWith(path.join(ROOT, "server") + path.sep) || path.basename(file).startsWith(".")) {
    res.writeHead(404).end("Not found"); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end("Not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}

// ---------- 챗봇 API ----------
function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > MAX_BODY) { reject(Object.assign(new Error("too big"), { code: "too_big" })); req.destroy(); } else chunks.push(c); });
    req.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); } catch { reject(Object.assign(new Error("bad json"), { code: "bad_request" })); } });
    req.on("error", reject);
  });
}
function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}
// Gemini 오류 → 챗봇 화면용 코드
function errorCode(status, msg) {
  if (status === 429) return "rate_limited";
  if (status === 400 && /API key/i.test(msg)) return "bad_key";
  if (status === 401 || status === 403) return "bad_key";
  if (status === 404) return "bad_model";
  return "upstream";
}

async function handleChat(req, res) {
  if (!KEY) { sendJson(res, 503, { error: "no_key" }); return; }
  let body;
  try { body = await readJson(req); } catch (e) { sendJson(res, e.code === "too_big" ? 413 : 400, { error: e.code || "bad_request" }); return; }

  const system = String(body.system || "").slice(0, MAX_SYSTEM);
  const messages = (Array.isArray(body.messages) ? body.messages : []).slice(-MAX_TURNS)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content.slice(0, m.role === "user" ? MAX_MSG : 4000) }] }));
  if (!messages.length || messages[messages.length - 1].role !== "user") { sendJson(res, 400, { error: "bad_request" }); return; }

  const ctrl = new AbortController();
  res.on("close", () => ctrl.abort());   // 사용자가 '멈추기'를 누르거나 창을 닫으면 Gemini 요청도 끊어요

  let up;
  try {
    up = await fetch(`${API}/models/${encodeURIComponent(MODEL)}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages,
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.4 }
      }),
      signal: ctrl.signal
    });
  } catch (e) {
    if (ctrl.signal.aborted) return;
    console.error("[chat] Gemini 연결 실패:", e.message);
    sendJson(res, 502, { error: "upstream" }); return;
  }
  if (!up.ok) {
    const t = await up.text().catch(() => "");
    let msg = t; try { msg = JSON.parse(t).error.message; } catch {}
    console.error(`[chat] Gemini 오류 ${up.status}: ${String(msg).slice(0, 300)}`);
    sendJson(res, up.status === 429 ? 429 : 502, { error: errorCode(up.status, msg) }); return;
  }

  // 한 줄에 하나씩 JSON으로 흘려보내요: {"t":"글자"} … {"done":true,"truncated":false}
  res.writeHead(200, { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache" });
  const out = (o) => res.write(JSON.stringify(o) + "\n");
  let buf = "", finish = "", blocked = false;
  const dec = new TextDecoder();
  try {
    for await (const chunk of up.body) {
      buf += dec.decode(chunk, { stream: true });
      let i;
      while ((i = buf.indexOf("\n")) > -1) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith("data:")) continue;
        let j; try { j = JSON.parse(line.slice(5)); } catch { continue; }
        if (j.promptFeedback && j.promptFeedback.blockReason) blocked = true;
        const c = (j.candidates || [])[0];
        if (!c) continue;
        const text = ((c.content && c.content.parts) || []).filter((p) => !p.thought && p.text).map((p) => p.text).join("");
        if (text) out({ t: text });
        if (c.finishReason) finish = c.finishReason;
      }
    }
  } catch (e) {
    if (ctrl.signal.aborted) return;
    console.error("[chat] 답변 받는 중 끊김:", e.message);
    out({ error: "upstream" }); res.end(); return;
  }
  if (blocked || finish === "SAFETY" || finish === "PROHIBITED_CONTENT" || finish === "BLOCKLIST") out({ error: "refused" });
  else out({ done: true, truncated: finish === "MAX_TOKENS" });
  res.end();
}

// ---------- 서버 ----------
const server = http.createServer((req, res) => {
  const p = req.url.split("?")[0];
  if (p === "/api/health" && req.method === "POST") { sendJson(res, KEY ? 200 : 503, KEY ? { ok: true, model: MODEL } : { ok: false, error: "no_key" }); return; }
  if (p === "/api/chat" && req.method === "POST") { handleChat(req, res).catch((e) => { console.error(e); if (!res.headersSent) sendJson(res, 500, { error: "upstream" }); else res.end(); }); return; }
  if (req.method === "GET" || req.method === "HEAD") { serveStatic(req, res); return; }
  res.writeHead(405).end();
});
server.listen(PORT, HOST, () => {
  console.log(`캠퍼스 라이프 사이트: http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}/`);
  console.log(KEY ? `챗봇 AI 답변 켜짐 (모델: ${MODEL})` : "GEMINI_API_KEY가 없어서 챗봇은 키워드 검색으로 동작해요. server/.env 를 만들어 주세요.");
});
