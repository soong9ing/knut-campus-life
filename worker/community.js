/* =============================================================
   회원(로그인)·커뮤니티·회원 등급 — Cloudflare D1 (env.DB)
   -------------------------------------------------------------
   회원
     POST   /api/auth/signup   {username, password, nickname} → {token, user}
     POST   /api/auth/login    {username, password}           → {token, user}
     POST   /api/auth/logout
     GET    /api/auth/me                                       → {user}
   커뮤니티
     GET    /api/community/posts?board=&page=                  → {posts, hasMore}
     GET    /api/community/posts/:id                           → {post, comments}
     POST   /api/community/posts            {board, title, body}
     DELETE /api/community/posts/:id        (내 글만)
     POST   /api/community/posts/:id/like   (좋아요 누르기/취소)
     POST   /api/community/posts/:id/comments  {body}
     DELETE /api/community/comments/:id     (내 댓글만)
   로그인이 필요한 요청은 헤더 Authorization: Bearer <토큰>

   회원 등급 점수 = 글 수×5 + 받은 좋아요×2 + 받은 댓글×1
   (자기 글에 단 댓글은 안 셈, 자기 글에는 좋아요 불가)
   ============================================================= */

export const BOARDS = ["숨은맛집", "꿀팁", "자유", "질문"];
export const TIERS = [
  { level: 1, name: "새내기", icon: "🌱", min: 0 },
  { level: 2, name: "재학생", icon: "📚", min: 15 },
  { level: 3, name: "선배", icon: "🎓", min: 50 },
  { level: 4, name: "캠퍼스 가이드", icon: "🧭", min: 120 },
  { level: 5, name: "교통정리 마스터", icon: "👑", min: 250 }
];
const POINTS = { post: 5, like: 2, comment: 1 };

const PAGE_SIZE = 20;
const SESSION_DAYS = 30;
const PBKDF2_ITER = 100000;           // Cloudflare Workers가 허용하는 최대치
const LIMIT = { title: 80, body: 3000, comment: 500 };

/* ---------- 등급 ---------- */
export function scoreOf(u) {
  return (u.post_count || 0) * POINTS.post + (u.likes_received || 0) * POINTS.like + (u.comments_received || 0) * POINTS.comment;
}
export function gradeOf(score) {
  let t = TIERS[0];
  for (const x of TIERS) if (score >= x.min) t = x;
  const next = TIERS.find((x) => x.min > score) || null;
  return { level: t.level, name: t.name, icon: t.icon, next: next ? { name: next.name, icon: next.icon, at: next.min } : null };
}
function publicUser(u) {
  const score = scoreOf(u);
  return {
    id: u.id, username: u.username, nickname: u.nickname, created_at: u.created_at,
    stats: { posts: u.post_count, likes: u.likes_received, comments: u.comments_received },
    score, grade: gradeOf(score), points: POINTS, tiers: TIERS
  };
}
function author(row) {
  return { nickname: row.nickname, grade: gradeOf(scoreOf(row)) };
}

/* ---------- 암호 도우미 ---------- */
const enc = new TextEncoder();
function toHex(buf) { return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
function randomHex(n) { const a = new Uint8Array(n); crypto.getRandomValues(a); return toHex(a); }
async function sha256(s) { return toHex(await crypto.subtle.digest("SHA-256", enc.encode(s))); }
async function hashPassword(password, saltHex) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  return toHex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITER }, key, 256));
}
function sameText(a, b) {   // 길이가 같으면 끝까지 비교 (시간차로 맞히기 어렵게)
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/* ---------- 요청 도우미 ---------- */
class HttpError extends Error {
  constructor(status, code, message) { super(message || code); this.status = status; this.code = code; }
}
async function readBody(req) {
  const raw = await req.text();
  if (raw.length > 20000) throw new HttpError(413, "too_big", "내용이 너무 길어요.");
  try { return JSON.parse(raw || "{}"); } catch { throw new HttpError(400, "bad_request", "요청 형식이 잘못됐어요."); }
}
function str(v) { return typeof v === "string" ? v.trim() : ""; }

async function currentUser(req, env) {
  const m = (req.headers.get("Authorization") || "").match(/^Bearer\s+([A-Za-z0-9]{20,128})$/);
  if (!m) return null;
  const h = await sha256(m[1]);
  const row = await env.DB.prepare(
    "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?"
  ).bind(h, Date.now()).first();
  return row || null;
}
async function needUser(req, env) {
  const u = await currentUser(req, env);
  if (!u) throw new HttpError(401, "login_required", "로그인이 필요해요.");
  return u;
}
async function newSession(env, userId) {
  const token = randomHex(32);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now),
    env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
      .bind(await sha256(token), userId, now + SESSION_DAYS * 86400000)
  ]);
  return token;
}

/* ---------- 회원 ---------- */
async function signup(req, env) {
  const b = await readBody(req);
  const username = str(b.username), nickname = str(b.nickname), password = typeof b.password === "string" ? b.password : "";
  if (!/^[A-Za-z0-9_]{4,20}$/.test(username)) throw new HttpError(400, "bad_username", "아이디는 영어·숫자·밑줄(_)로 4~20자예요.");
  if (password.length < 8 || password.length > 64) throw new HttpError(400, "bad_password", "비밀번호는 8~64자로 정해 주세요.");
  if (!/^[가-힣A-Za-z0-9_]{2,12}$/.test(nickname)) throw new HttpError(400, "bad_nickname", "닉네임은 한글·영어·숫자로 2~12자예요.");
  const dup = await env.DB.prepare("SELECT username, nickname FROM users WHERE username = ? OR nickname = ?").bind(username, nickname).first();
  if (dup) {
    if (dup.username.toLowerCase() === username.toLowerCase()) throw new HttpError(409, "username_taken", "이미 있는 아이디예요.");
    throw new HttpError(409, "nickname_taken", "이미 쓰고 있는 닉네임이에요.");
  }
  const salt = randomHex(16);
  const pw = await hashPassword(password, salt);
  let id;
  try {
    const r = await env.DB.prepare("INSERT INTO users (username, nickname, pw_hash, pw_salt, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(username, nickname, pw, salt, Date.now()).run();
    id = r.meta.last_row_id;
  } catch (e) {
    throw new HttpError(409, "taken", "이미 있는 아이디나 닉네임이에요.");
  }
  const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  return { token: await newSession(env, id), user: publicUser(user) };
}
async function login(req, env) {
  const b = await readBody(req);
  const username = str(b.username), password = typeof b.password === "string" ? b.password : "";
  if (!username || !password) throw new HttpError(400, "bad_request", "아이디와 비밀번호를 입력해 주세요.");
  const since = Date.now() - 10 * 60000;
  const fails = await env.DB.prepare("SELECT COUNT(*) AS n FROM login_fails WHERE username = ? AND at > ?").bind(username, since).first();
  if (fails && fails.n >= 5) throw new HttpError(429, "too_many_tries", "비밀번호를 여러 번 틀렸어요. 10분 뒤에 다시 해 주세요.");
  const u = await env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
  const ok = u && sameText(await hashPassword(password, u.pw_salt), u.pw_hash);
  if (!ok) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM login_fails WHERE at < ?").bind(since),
      env.DB.prepare("INSERT INTO login_fails (username, at) VALUES (?, ?)").bind(username, Date.now())
    ]);
    throw new HttpError(401, "wrong_login", "아이디 또는 비밀번호가 맞지 않아요.");
  }
  return { token: await newSession(env, u.id), user: publicUser(u) };
}
async function logout(req, env) {
  const m = (req.headers.get("Authorization") || "").match(/^Bearer\s+([A-Za-z0-9]{20,128})$/);
  if (m) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(m[1])).run();
  return { ok: true };
}

/* ---------- 커뮤니티 ---------- */
async function listPosts(url, env) {
  const board = url.searchParams.get("board") || "";
  const page = Math.max(1, Math.min(500, parseInt(url.searchParams.get("page") || "1", 10) || 1));
  const where = BOARDS.includes(board) ? "WHERE p.board = ?" : "";
  const sql = "SELECT p.id, p.board, p.title, substr(p.body, 1, 120) AS excerpt, p.created_at, p.like_count, p.comment_count, " +
    "u.nickname, u.post_count, u.likes_received, u.comments_received " +
    "FROM posts p JOIN users u ON u.id = p.user_id " + where + " ORDER BY p.id DESC LIMIT ? OFFSET ?";
  const st = env.DB.prepare(sql);
  const args = (where ? [board] : []).concat([PAGE_SIZE + 1, (page - 1) * PAGE_SIZE]);
  const { results } = await st.bind(...args).all();
  const posts = results.slice(0, PAGE_SIZE).map((r) => ({
    id: r.id, board: r.board, title: r.title, excerpt: r.excerpt, created_at: r.created_at,
    like_count: r.like_count, comment_count: r.comment_count, author: author(r)
  }));
  return { posts, hasMore: results.length > PAGE_SIZE, page, boards: BOARDS };
}
async function getPost(id, req, env) {
  const me = await currentUser(req, env);
  const r = await env.DB.prepare(
    "SELECT p.*, u.nickname, u.post_count, u.likes_received, u.comments_received FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?"
  ).bind(id).first();
  if (!r) throw new HttpError(404, "not_found", "글을 찾을 수 없어요. 삭제됐을 수 있어요.");
  const { results } = await env.DB.prepare(
    "SELECT c.id, c.body, c.created_at, c.user_id, u.nickname, u.post_count, u.likes_received, u.comments_received " +
    "FROM comments c JOIN users u ON u.id = c.user_id WHERE c.post_id = ? ORDER BY c.id"
  ).bind(id).all();
  let liked = false;
  if (me) liked = !!(await env.DB.prepare("SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?").bind(id, me.id).first());
  return {
    post: {
      id: r.id, board: r.board, title: r.title, body: r.body, created_at: r.created_at,
      like_count: r.like_count, comment_count: r.comment_count, author: author(r),
      mine: !!me && me.id === r.user_id, liked
    },
    comments: results.map((c) => ({ id: c.id, body: c.body, created_at: c.created_at, author: author(c), mine: !!me && me.id === c.user_id }))
  };
}
async function createPost(req, env) {
  const me = await needUser(req, env);
  const b = await readBody(req);
  const board = str(b.board), title = str(b.title), body = str(b.body);
  if (!BOARDS.includes(board)) throw new HttpError(400, "bad_board", "게시판을 골라 주세요.");
  if (title.length < 2 || title.length > LIMIT.title) throw new HttpError(400, "bad_title", `제목은 2~${LIMIT.title}자로 써 주세요.`);
  if (body.length < 2 || body.length > LIMIT.body) throw new HttpError(400, "bad_body", `내용은 2~${LIMIT.body}자로 써 주세요.`);
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM posts WHERE user_id = ? AND created_at > ?").bind(me.id, Date.now() - 10 * 60000).first();
  if (recent.n >= 5) throw new HttpError(429, "too_fast", "글을 너무 빨리 올리고 있어요. 잠시 후 다시 해 주세요.");
  const now = Date.now();
  const res = await env.DB.batch([
    env.DB.prepare("INSERT INTO posts (user_id, board, title, body, created_at) VALUES (?, ?, ?, ?, ?)").bind(me.id, board, title, body, now),
    env.DB.prepare("UPDATE users SET post_count = post_count + 1 WHERE id = ?").bind(me.id)
  ]);
  return { id: res[0].meta.last_row_id };
}
async function deletePost(id, req, env) {
  const me = await needUser(req, env);
  const p = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
  if (!p) throw new HttpError(404, "not_found", "글을 찾을 수 없어요.");
  if (p.user_id !== me.id) throw new HttpError(403, "not_mine", "내가 쓴 글만 지울 수 있어요.");
  const others = await env.DB.prepare("SELECT COUNT(*) AS n FROM comments WHERE post_id = ? AND user_id != ?").bind(id, me.id).first();
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET post_count = MAX(0, post_count - 1), likes_received = MAX(0, likes_received - ?), comments_received = MAX(0, comments_received - ?) WHERE id = ?")
      .bind(p.like_count, others.n, me.id),
    env.DB.prepare("DELETE FROM likes WHERE post_id = ?").bind(id),
    env.DB.prepare("DELETE FROM comments WHERE post_id = ?").bind(id),
    env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id)
  ]);
  return { ok: true };
}
async function toggleLike(id, req, env) {
  const me = await needUser(req, env);
  const p = await env.DB.prepare("SELECT id, user_id FROM posts WHERE id = ?").bind(id).first();
  if (!p) throw new HttpError(404, "not_found", "글을 찾을 수 없어요.");
  if (p.user_id === me.id) throw new HttpError(400, "own_post", "내 글에는 좋아요를 누를 수 없어요.");
  const had = await env.DB.prepare("SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?").bind(id, me.id).first();
  if (had) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?").bind(id, me.id),
      env.DB.prepare("UPDATE posts SET like_count = MAX(0, like_count - 1) WHERE id = ?").bind(id),
      env.DB.prepare("UPDATE users SET likes_received = MAX(0, likes_received - 1) WHERE id = ?").bind(p.user_id)
    ]);
  } else {
    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO likes (post_id, user_id, created_at) VALUES (?, ?, ?)").bind(id, me.id, Date.now()),
      env.DB.prepare("UPDATE posts SET like_count = like_count + 1 WHERE id = ?").bind(id),
      env.DB.prepare("UPDATE users SET likes_received = likes_received + 1 WHERE id = ?").bind(p.user_id)
    ]);
  }
  const now = await env.DB.prepare("SELECT like_count FROM posts WHERE id = ?").bind(id).first();
  return { liked: !had, like_count: now ? now.like_count : 0 };
}
async function addComment(id, req, env) {
  const me = await needUser(req, env);
  const b = await readBody(req);
  const body = str(b.body);
  if (body.length < 1 || body.length > LIMIT.comment) throw new HttpError(400, "bad_comment", `댓글은 1~${LIMIT.comment}자로 써 주세요.`);
  const p = await env.DB.prepare("SELECT id, user_id FROM posts WHERE id = ?").bind(id).first();
  if (!p) throw new HttpError(404, "not_found", "글을 찾을 수 없어요.");
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM comments WHERE user_id = ? AND created_at > ?").bind(me.id, Date.now() - 60000).first();
  if (recent.n >= 5) throw new HttpError(429, "too_fast", "댓글을 너무 빨리 달고 있어요. 잠시 후 다시 해 주세요.");
  const stmts = [
    env.DB.prepare("INSERT INTO comments (post_id, user_id, body, created_at) VALUES (?, ?, ?, ?)").bind(id, me.id, body, Date.now()),
    env.DB.prepare("UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?").bind(id)
  ];
  if (p.user_id !== me.id) stmts.push(env.DB.prepare("UPDATE users SET comments_received = comments_received + 1 WHERE id = ?").bind(p.user_id));
  await env.DB.batch(stmts);
  return { ok: true };
}
async function deleteComment(id, req, env) {
  const me = await needUser(req, env);
  const c = await env.DB.prepare("SELECT c.*, p.user_id AS post_owner FROM comments c LEFT JOIN posts p ON p.id = c.post_id WHERE c.id = ?").bind(id).first();
  if (!c) throw new HttpError(404, "not_found", "댓글을 찾을 수 없어요.");
  if (c.user_id !== me.id) throw new HttpError(403, "not_mine", "내가 쓴 댓글만 지울 수 있어요.");
  const stmts = [
    env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(id),
    env.DB.prepare("UPDATE posts SET comment_count = MAX(0, comment_count - 1) WHERE id = ?").bind(c.post_id)
  ];
  if (c.post_owner != null && c.post_owner !== me.id) {
    stmts.push(env.DB.prepare("UPDATE users SET comments_received = MAX(0, comments_received - 1) WHERE id = ?").bind(c.post_owner));
  }
  await env.DB.batch(stmts);
  return { ok: true };
}

/* ---------- 길 찾기 ---------- */
// 이 모듈이 맡은 주소면 Response를, 아니면 null을 돌려줘요.
export async function handleCommunity(req, env, url, reply) {
  const path = url.pathname.replace(/\/+$/, "");
  if (!path.startsWith("/api/auth/") && !path.startsWith("/api/community/")) return null;
  if (!env.DB) return reply(503, { error: "no_db", message: "커뮤니티 저장소가 연결되지 않았어요." });
  const m = req.method;
  let mm;
  try {
    let out;
    if (path === "/api/auth/signup" && m === "POST") out = await signup(req, env);
    else if (path === "/api/auth/login" && m === "POST") out = await login(req, env);
    else if (path === "/api/auth/logout" && m === "POST") out = await logout(req, env);
    else if (path === "/api/auth/me" && m === "GET") out = { user: publicUser(await needUser(req, env)) };
    else if (path === "/api/community/posts" && m === "GET") out = await listPosts(url, env);
    else if (path === "/api/community/posts" && m === "POST") out = await createPost(req, env);
    else if ((mm = path.match(/^\/api\/community\/posts\/(\d{1,12})$/)) && m === "GET") out = await getPost(+mm[1], req, env);
    else if ((mm = path.match(/^\/api\/community\/posts\/(\d{1,12})$/)) && m === "DELETE") out = await deletePost(+mm[1], req, env);
    else if ((mm = path.match(/^\/api\/community\/posts\/(\d{1,12})\/like$/)) && m === "POST") out = await toggleLike(+mm[1], req, env);
    else if ((mm = path.match(/^\/api\/community\/posts\/(\d{1,12})\/comments$/)) && m === "POST") out = await addComment(+mm[1], req, env);
    else if ((mm = path.match(/^\/api\/community\/comments\/(\d{1,12})$/)) && m === "DELETE") out = await deleteComment(+mm[1], req, env);
    else return reply(404, { error: "not_found", message: "없는 주소예요." });
    return reply(200, out);
  } catch (e) {
    if (e instanceof HttpError) return reply(e.status, { error: e.code, message: e.message });
    console.error("커뮤니티 오류:", e && (e.stack || e.message));
    return reply(500, { error: "server", message: "서버에서 문제가 생겼어요. 잠시 후 다시 해 주세요." });
  }
}
