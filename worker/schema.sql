-- 커뮤니티·회원 데이터베이스 (Cloudflare D1)
-- 처음 한 번:  npx wrangler d1 execute knut-community --remote --file=schema.sql
-- 이미 있는 표는 건드리지 않아요 (IF NOT EXISTS).

-- 회원. 비밀번호는 원문 대신 PBKDF2 해시와 소금값만 저장해요.
-- post_count·likes_received·comments_received 는 등급 점수 계산용 누적 숫자예요.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  nickname TEXT NOT NULL UNIQUE COLLATE NOCASE,
  pw_hash TEXT NOT NULL,
  pw_salt TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  post_count INTEGER NOT NULL DEFAULT 0,
  likes_received INTEGER NOT NULL DEFAULT 0,
  comments_received INTEGER NOT NULL DEFAULT 0
);

-- 로그인 상태. 토큰 원문은 브라우저에만 있고, 여기엔 SHA-256 해시만 저장해요.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- 로그인 실패 기록 (같은 아이디로 10분에 5번 틀리면 잠시 막음)
CREATE TABLE IF NOT EXISTS login_fails (
  username TEXT NOT NULL COLLATE NOCASE,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_fails ON login_fails(username, at);

-- 게시글. board: 숨은맛집 · 꿀팁 · 자유 · 질문
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  board TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_posts_board ON posts(board, id DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id, created_at);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id, created_at);

-- 좋아요 (한 사람이 한 글에 한 번)
CREATE TABLE IF NOT EXISTS likes (
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (post_id, user_id)
);
