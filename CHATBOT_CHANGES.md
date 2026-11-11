# 챗봇 담당 변경 내역 (합치기용)

기준 원본: GitHub `soong9ing/knut-campus-life` 커밋 `d308f83` (2026-11-10, 고양이 삭제본)

## 요약
- 챗봇을 **Gemini LLM 챗봇**으로 바꿈. 키워드 검색 답변은 없앰.
- 챗봇 서버는 **Cloudflare Workers**에서 돌아감 → 노트북이 꺼져 있어도 방문자가 사용 가능.
- Gemini API 키는 Cloudflare 비밀 값에만 있고, 사이트 파일에는 없음.

## 바뀐 파일
| 파일 | 상태 | 내용 |
|---|---|---|
| `js/chat.js` | 수정 | Gemini 서버 연결, 키워드 답변 삭제, 관련 장소만 골라 보내기 |
| `worker/worker.js` | 새 파일 | Cloudflare Workers용 챗봇 서버 (실제 서비스용) |
| `worker/wrangler.toml` | 새 파일 | Worker 설정 (모델, 허용 사이트 주소) |
| `server/chat-server.js` | 새 파일 | 노트북에서 시험할 때 쓰는 서버 (사이트 + 챗봇) |
| `server/.env.example` | 새 파일 | 노트북 서버 설정 예시 |
| `.gitignore` | 새 파일 | `server/.env`(API 키)가 GitHub에 올라가지 않게 |

다른 파일(`index.html`, `css/`, `data/`, `app.js`, `sw.js` 등)은 건드리지 않았어요.

## chat.js에서 바뀐 부분
- 맨 위 `WORKER_URL`: 배포한 Worker 주소. GitHub 사이트는 이 주소로, 노트북(localhost)에서는 노트북 서버로 연결.
- `keywordAnswer()` 삭제. 점수 계산은 `rank()`로 남겨서 AI에게 보낼 관련 장소를 고르는 데만 씀.
- `catalog()` → `pickRelevant()`, `detailLine()`, `instructions(q, history)`:
  관련 25곳은 자세히 + 나머지는 이름만 보냄 (약 7만 자 → 약 1.8만 자).
- `serverSample()`: 서버 답을 한 글자씩 받아 표시.
- 시작할 때 `/api/health` 확인 → 안 되면 "지금은 챗봇을 쓸 수 없어요" 안내.
- 챗봇이 **버스·학사일정·공지·건물 번호**도 답함 (`busText`, `calendarText`, `noticeText`, `buildingText`).
  다음 버스·운행 여부(주말·휴일·방학)·D-day는 코드에서 한국 시간 기준으로 계산해서 AI에게 결과만 줌 (AI의 시간 계산 실수 방지).
  `data/bus.js`, `data/calendar.js`, `data/notices.js`를 읽기만 하고 고치지 않음 → 이 파일들을 갱신하면 챗봇도 자동 반영.
- 답변 표시: 주소는 "원문 보기" 링크로, 마크다운 링크·잘못된 `[[ ]]`는 정리.

## 배포 정보
- Worker 주소: https://knut-campus-chatbot.love-ai-worker.workers.dev
- API 키: Cloudflare 대시보드 → knut-campus-chatbot → 설정 → 변수 및 비밀 → `GEMINI_API_KEY` (비밀)
- 모델 자동 전환: `wrangler.toml`의 `GEMINI_MODEL`에 쉼표로 여러 모델. 앞 모델이 혼잡·한도 초과·15초 무응답이면 다음 모델로.
- 다시 배포: `worker` 폴더에서 `npx wrangler deploy` (키는 그대로 유지됨)

## GitHub에 올릴 때 (합친 뒤 마지막에 한 번)
- `sw.js` 맨 위 `VERSION`을 올리기 (예: `campus-life-v5` → `campus-life-v6`).
  안 올리면 예전에 접속했던 방문자 휴대폰에는 옛 chat.js가 남아서 새 챗봇이 안 보여요.
- `soong9ing` 계정의 GitHub Pages에 올리면 챗봇이 바로 동작해요 (이미 허락된 주소).

## 사이트 주소가 바뀌면
`worker/wrangler.toml`의 `ALLOWED_ORIGINS`에 새 주소를 넣고 다시 배포해야 챗봇이 동작해요.
(다른 사이트가 우리 키를 쓰지 못하게 허락한 주소에서만 받음)

## 노트북에서 시험
1. `server/.env.example` → `server/.env` 로 복사하고 키 넣기
2. `node server/chat-server.js` → http://localhost:8000

## 주의
- 키 하나를 방문자 모두가 같이 써서, Gemini 무료 한도를 넘으면 그날은 "잠시 후 다시" 안내가 나옴.
- 무료 등급(결제 정보 미등록)이면 요금은 나오지 않음.
