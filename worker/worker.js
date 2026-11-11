/* =============================================================
   캠퍼스 챗봇 서버 — Cloudflare Workers 버전
   -------------------------------------------------------------
   노트북이 꺼져 있어도 방문자들이 챗봇을 쓸 수 있게, Cloudflare에서 돌아가요.
   - POST /api/health : 챗봇을 쓸 수 있는지 확인
   - POST /api/chat   : 질문을 Gemini에 전달하고 답을 한 줄씩(NDJSON) 흘려보냄
   API 키는 Cloudflare 비밀 값(GEMINI_API_KEY)에만 있어요. 이 파일에는 없어요.

   설정 (wrangler.toml 의 [vars] / 비밀 값):
     GEMINI_API_KEY   (비밀 값, 필수)  npx wrangler secret put GEMINI_API_KEY
     GEMINI_MODEL     (선택) 기본 gemini-flash-latest
     ALLOWED_ORIGINS  (선택) 챗봇을 쓸 수 있는 사이트 주소, 쉼표로 구분
   ============================================================= */
const DEFAULT_API = "https://generativelanguage.googleapis.com/v1beta";
const MAX_BODY = 200 * 1024;      // 요청 최대 200KB
const MAX_SYSTEM = 120 * 1024;    // 사이트 정보 최대 120KB
const MAX_MSG = 600;              // 질문 한 개 최대 글자 수
const MAX_TURNS = 10;
const MAX_OUTPUT_TOKENS = 2048;
const FIRST_BYTE_TIMEOUT = 15000; // 모델이 이 시간(ms) 안에 응답을 시작하지 않으면 다음 모델로

function allowedOrigin(req, env) {
  const origin = req.headers.get("Origin") || "";
  const list = String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return list.includes(origin) ? origin : "";
}
function cors(origin) {
  return origin ? {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  } : {};
}
function json(status, obj, origin) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin) } });
}
function errorCode(status, msg) {
  if (status === 429) return "rate_limited";
  if (status === 400 && /API key/i.test(msg)) return "bad_key";
  if (status === 401 || status === 403) return "bad_key";
  if (status === 404) return "bad_model";
  return "upstream";
}

async function handleChat(req, env, origin) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json(413, { error: "too_big" }, origin);
  let body;
  try { body = JSON.parse(raw || "{}"); } catch { return json(400, { error: "bad_request" }, origin); }

  const system = String(body.system || "").slice(0, MAX_SYSTEM);
  const messages = (Array.isArray(body.messages) ? body.messages : []).slice(-MAX_TURNS)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content.slice(0, m.role === "user" ? MAX_MSG : 4000) }] }));
  if (!messages.length || messages[messages.length - 1].role !== "user") return json(400, { error: "bad_request" }, origin);

  // 모델을 쉼표로 여러 개 적으면, 앞 모델이 혼잡(503)·한도 초과(429)·없음(404)일 때 다음 모델로 넘어가요
  const models = String(env.GEMINI_MODEL || "gemini-flash-latest").split(",").map((s) => s.trim()).filter(Boolean);
  const api = env.GEMINI_API_BASE || DEFAULT_API;   // 시험할 때만 바꿔요
  const payload = JSON.stringify({
    system_instruction: { parts: [{ text: system }] },
    contents: messages,
    generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.4 }
  });
  let up = null, lastStatus = 502, lastMsg = "";
  for (const model of models) {
    if (req.signal && req.signal.aborted) return json(499, { error: "cancelled" }, origin);
    // 혼잡한 모델은 오류 없이 몇 분씩 멈춰 있기도 해서, 응답이 늦으면 다음 모델로 넘어가요
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FIRST_BYTE_TIMEOUT);
    const onCancel = () => ctrl.abort();
    if (req.signal) req.signal.addEventListener("abort", onCancel);
    try {
      up = await fetch(`${api}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
        body: payload,
        signal: ctrl.signal
      });
    } catch (e) {
      console.error(`Gemini 연결 실패 (${model}):`, ctrl.signal.aborted ? `${FIRST_BYTE_TIMEOUT / 1000}초 안에 응답 없음` : e && e.message);
      up = null; lastStatus = 503; lastMsg = ""; continue;
    } finally {
      clearTimeout(timer);
    }
    if (up.ok) break;
    const t = await up.text().catch(() => "");
    lastStatus = up.status; lastMsg = t; try { lastMsg = JSON.parse(t).error.message; } catch {}
    console.error(`Gemini 오류 ${up.status} (${model}): ${String(lastMsg).slice(0, 300)}`);
    up = null;
    if (!(lastStatus === 429 || lastStatus === 404 || lastStatus >= 500)) break;   // 키 오류 등은 다른 모델로 해도 똑같아요
  }
  if (!up) {
    const code = lastStatus >= 500 ? "rate_limited" : errorCode(lastStatus, lastMsg);
    return json(code === "rate_limited" ? 429 : 502, { error: code }, origin);
  }

  // Gemini의 SSE를 읽어서 {"t":"글자"} … {"done":true} 줄로 바꿔 흘려보내요
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const out = (o) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      const reader = up.body.getReader();
      const dec = new TextDecoder();
      let buf = "", finish = "", blocked = false;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
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
        if (blocked || finish === "SAFETY" || finish === "PROHIBITED_CONTENT" || finish === "BLOCKLIST") out({ error: "refused" });
        else out({ done: true, truncated: finish === "MAX_TOKENS" });
      } catch (e) {
        console.error("답변 받는 중 끊김:", e && e.message);
        try { out({ error: "upstream" }); } catch {}
      }
      try { controller.close(); } catch {}
    },
    cancel() { up.body.cancel().catch(() => {}); }   // 방문자가 '멈추기'를 누르면 Gemini 요청도 끊어요
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache", ...cors(origin) } });
}

export default {
  async fetch(req, env) {
    const path = new URL(req.url).pathname.replace(/\/+$/, "");
    const origin = allowedOrigin(req, env);
    if (req.method === "OPTIONS") return new Response(null, { status: origin ? 204 : 403, headers: cors(origin) });
    // 허락한 사이트에서 온 요청만 받아요 (다른 사이트가 우리 키를 쓰지 못하게)
    if (!origin) return json(403, { error: "forbidden_origin" }, "");
    if (req.method !== "POST") return json(405, { error: "method" }, origin);
    if (path === "/api/health") return env.GEMINI_API_KEY ? json(200, { ok: true }, origin) : json(503, { ok: false, error: "no_key" }, origin);
    if (path === "/api/chat") {
      if (!env.GEMINI_API_KEY) return json(503, { error: "no_key" }, origin);
      return handleChat(req, env, origin);
    }
    return json(404, { error: "not_found" }, origin);
  }
};
