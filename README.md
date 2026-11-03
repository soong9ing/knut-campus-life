# 한국교통대학교 캠퍼스 라이프

교통대 학생을 위한 캠퍼스 정보 사이트 (맛집·숨은장소·생활꿀팁·캠퍼스 지도·버스·학사일정).

## 실행
- 내 컴퓨터: `preview.html`을 브라우저로 열기 (또는 이 폴더에서 `python3 -m http.server` 후 http://localhost:8000/preview.html)
- 배포(GitHub Pages 등): 배포용 zip(campus-life-site.zip) 안의 파일을 그대로 올리기
- `index.html`은 claude.ai 게시용(본문만 있음)

## 고치는 곳
| 바꾸고 싶은 것 | 파일 |
|---|---|
| 메뉴, 문구, 로고, SNS, 제보 폼 주소(reportFormUrl) | `data/site.js` |
| 공지사항 (매주 월요일 자동 업데이트) | `data/notices.js` |
| 교내 버스 시간표 (999번·700번) | `data/bus.js` |
| 학사일정 (D-day) | `data/calendar.js` |
| 맛집·생활꿀팁·숨은장소·자유 정보 | `data/places.js` (`id`는 후기·즐겨찾기와 연결되니 바꾸지 마세요) |
| 건물 층별 안내 | `data/floors.js` |
| 그림 | `assets/img/` 같은 이름으로 덮어쓰기 |
| 색·크기 | `css/style.css` 맨 위 `:root` |

## 기능과 동작하는 곳
| 기능 | 파일 | claude.ai 게시 페이지 | GitHub 사이트 |
|---|---|---|---|
| 후기(별점)·좋아요·조회수 | `js/social.js` | 저장됨 | "준비 중" (저장소 없음) |
| 챗봇 | `js/chat.js` | AI 답변 | 키워드 검색 |
| 교내 버스(999·700)·D-day·오늘 뭐 먹지·영업 중 표시 | `js/features.js` | 동작 | 동작 |
| 즐겨찾기(내 장소) | `js/features.js` | 이 브라우저에 저장 | 이 브라우저에 저장 |
| 정보 수정 요청 | `js/features.js` | 사이트 저장소(reports)에 모임 | `reportFormUrl`에 구글 폼을 넣으면 보임 |
| 홈 화면에 추가(푸터 마스코트 클릭) | `manifest.webmanifest`, `sw.js` | 안 됨 | 동작 |

- `sw.js`는 한 번 연 화면을 저장해 둬요. 파일을 고친 뒤에는 `sw.js` 맨 위 `VERSION`의 숫자를 올려야 학생들 휴대폰에도 새 파일이 반영돼요.
- 영업 중 표시는 비고 메모에 적힌 영업시간을 읽어 계산해요. 메모에 시간이 없으면 표시되지 않아요.
- 버스는 학기 중 평일 기준이에요(공휴일·방학 미운행은 `data/calendar.js`의 휴일로 판단).
