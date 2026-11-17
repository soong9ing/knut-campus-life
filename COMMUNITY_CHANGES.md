# 로그인 · 커뮤니티 · 회원 등급 변경 내역 (합치기용)

기준 원본: GitHub `soong9ing/knut-campus-life` 커밋 `6aa5bf6` (v30, 맛집 지도·챗봇 합친 버전)

## 요약
- 헤더 사람 아이콘 → **로그인 / 회원가입 / 내 정보(등급)** 창
- **커뮤니티가 실제로 동작**: 글쓰기, 글 보기, 좋아요, 댓글, 내 글·댓글 삭제
- 게시판은 **분류 없이 하나**: 제목·내용만 쓰는 질문·글 게시판 (서버에는 모두 "질문"으로 저장)
- **회원 등급**: 점수 = 글 1개 5점 + 받은 좋아요 1개 2점 + 받은 댓글 1개 1점
  🌱 새내기(0) → 📚 재학생(15) → 🎓 선배(50) → 🧭 캠퍼스 가이드(120) → 👑 교통정리 마스터(250)
  - 자기 글에 단 자기 댓글은 점수에 안 들어감, 자기 글에는 좋아요 불가
  - 글을 지우면 그 글로 받은 좋아요·댓글 점수도 빠짐
- 저장소: 챗봇과 같은 Cloudflare Worker + **Cloudflare D1**(무료 데이터베이스)

## 바뀐 파일
| 파일 | 상태 | 내용 |
|---|---|---|
| `js/community.js` | 새 파일 | 로그인 창, 커뮤니티 화면, 등급 표시 |
| `css/community.css` | 새 파일 | 위 화면 스타일 (style.css의 색·글꼴 변수 사용) |
| `index.html` | 2줄 추가 | `css/community.css`, `js/community.js` 연결 (community.js는 app.js **앞**에) |
| `js/app.js` | 3곳 수정 | 사람 아이콘 → `Community.openAccount()`, 커뮤니티 화면 → `Community.html()/bind()` (community.js가 없으면 예전대로 동작) |
| `worker/community.js` | 새 파일 | 회원·커뮤니티 서버 코드 |
| `worker/worker.js` | 수정 | community.js 연결, CORS에 GET·DELETE·Authorization 허용 |
| `worker/wrangler.toml` | 수정 | D1 데이터베이스(`DB`) 연결 |
| `worker/schema.sql` | 새 파일 | 데이터베이스 표 (회원, 로그인, 글, 댓글, 좋아요) |

※ 서버 코드에는 분류(board) 기능이 남아 있지만 화면에서 쓰지 않아요. 나중에 분류를 다시 쓰고 싶으면 화면만 고치면 돼요.

다른 파일(`style.css`, `data/`, `foodmap`, `chat.js`, `sw.js` 등)은 건드리지 않았어요.

## 합치는 방법 (수경님께)
**새 파일 4개는 그대로 복사**하면 돼요: `js/community.js`, `css/community.css`, `worker/community.js`, `worker/schema.sql`
(`worker/` 폴더는 서버 코드 보관용이에요. 서버는 이미 Cloudflare에 올라가 있어요.)

`index.html`과 `js/app.js`는 다른 조원도 고칠 수 있으니, 파일을 통째로 덮어쓰지 말고 아래 부분만 넣어 주세요.

**index.html** — 2줄 추가
```html
<!-- css/foodmap.css 줄 바로 아래 -->
<link rel="stylesheet" href="css/community.css?v=30">

<!-- js/app.js 줄 바로 위 (꼭 app.js보다 먼저!) -->
<script src="js/community.js?v=30"></script>
```

**js/app.js** — 3곳
1. `// 사람 아이콘` 부분 (`ub.addEventListener("click", function () { go("favorites"); });` 있는 곳)을 이렇게:
```js
    // 사람 아이콘: 로그인·내 정보 (js/community.js). 없으면 내가 저장한 장소(즐겨찾기)
    var ub = document.getElementById("userBtn");
    if (window.Community) {
      ub.addEventListener("click", function () { window.Community.openAccount(); });
    } else {
      ub.setAttribute("aria-label", "내 장소 (저장한 곳)"); ub.title = "내 장소";
      ub.addEventListener("click", function () { go("favorites"); });
    }
```
2. `render()` 안의 `: route === "community" ? communityHTML()` 줄을:
```js
      : route === "community" ? (window.Community ? window.Community.html() : communityHTML())  // 커뮤니티: js/community.js
```
3. `bind()` 안의 `} else if (route === "community") {` 줄 **바로 위**에 2줄 추가:
```js
    } else if (route === "community" && window.Community) {
      window.Community.bind(app);
```

## 합친 뒤 확인
1. 사람 아이콘 → 로그인 창이 뜨는지
2. 회원가입 → 등급 창(🌱 새내기 0점)이 뜨는지
3. 커뮤니티 → 글쓰기 → 글 화면으로 넘어가는지
확인할 때 만든 회원·글은 실제 서버에 저장돼요. 다 보고 나서 지워 달라고 하면 서버에서 비울 수 있어요.

## 보안
- 비밀번호는 원문 대신 PBKDF2 해시로 저장, 로그인 토큰도 서버엔 해시만 저장
- 이메일·실명은 받지 않음
- 같은 아이디로 10분에 5번 틀리면 10분간 로그인 막힘
- 도배 방지: 글 10분에 5개, 댓글 1분에 5개까지
- 글·댓글은 화면에 글자로만 표시 (HTML·스크립트 실행 안 됨)
- 허락한 사이트 주소(`ALLOWED_ORIGINS`)에서만 요청 받음

## GitHub에 올릴 때
- `sw.js`의 `VERSION`과 `index.html`의 `?v=30`을 올리기 (예: v31) → 방문자 휴대폰에 새 파일 반영
- 서버(`worker/`)는 GitHub와 상관없이 Cloudflare에 따로 배포돼 있어요

## 서버 (Cloudflare) — 2026-11-17 배포 완료
- 주소: https://knut-campus-chatbot.love-ai-worker.workers.dev (챗봇과 같은 서버)
- 데이터베이스: D1 `knut-community` (표 만들고 시험 데이터는 비워 둠)
- 요청을 받는 사이트 주소: `soong9ing.github.io`, `localhost:8000`, `127.0.0.1:8000`, `localhost:5500`, `127.0.0.1:5500` (Live Server)
  → 파일을 더블클릭(file://)해서 열면 로그인·커뮤니티·챗봇이 연결 안 돼요. Live Server나 GitHub 주소로 열어 주세요.
- 서버를 고쳐서 다시 올릴 때 (서버 담당자 계정): `cd worker` → `npx wrangler deploy`

## 알려진 한계
- 비밀번호 찾기 없음 (이메일을 안 받아서)
- 글 수정 없음 (삭제 후 다시 쓰기)
- 신고·관리자 기능 없음
