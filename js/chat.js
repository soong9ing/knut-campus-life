/* =============================================================
   캠퍼스 챗봇 — "혼자 가기 좋은 맛집 알려줘"
   -------------------------------------------------------------
   LLM 챗봇이에요. 사이트 정보(data/places.js, data/floors.js)만 근거로 대답해요.
   1) Gemini: 챗봇 서버(server/chat-server.js)를 거쳐 대답해요.
      서버 주소는 window.SITE.chatApiUrl (없으면 같은 주소의 /api)이에요.
   2) Claude: claude.ai에 게시된 페이지에서는 Claude가 대답해요.
   둘 다 쓸 수 없으면 "지금은 챗봇을 쓸 수 없어요"라고 안내해요.
   AI에게는 질문과 관련된 장소만 자세히 보내고, 나머지는 이름만 보내요(토큰 절약).
   관련 장소는 rank()가 질문 속 단어로 골라요 (화면에 보이지 않는 내부 기능).
   답에 나온 장소를 누르면 그 장소의 상세 창(후기·지도)이 열려요.
   ============================================================= */
(function () {
  "use strict";
  var P = window.PLACES || {}, FL = window.FLOORS || {};
  var SEC = { food: "맛집", tips: "생활꿀팁", hidden: "숨은장소", etc: "자유" };
  // 챗봇 서버 주소 — Cloudflare에 배포한 Worker 주소를 넣어요 (예: "https://knut-campus-chatbot.이름.workers.dev")
  var WORKER_URL = "https://knut-campus-chatbot.love-ai-worker.workers.dev";
  // WORKER_URL이 있으면 어디서 열든 Worker를 써요. 비워 두면 노트북 서버(server/chat-server.js)의 /api를 써요.
  var CHAT_API = String((window.SITE && window.SITE.chatApiUrl) ||
    (WORKER_URL ? WORKER_URL.replace(/\/+$/, "") + "/api" : "api")).replace(/\/+$/, "");
  var BY_ID = {}, ALL = [];
  Object.keys(SEC).forEach(function (sec) {
    (P[sec] || []).forEach(function (it) { BY_ID[it.id] = { sec: sec, it: it }; ALL.push({ sec: sec, it: it }); });
  });


  var SUGGEST = ["혼자 가기 좋은 맛집 알려줘", "싸고 양 많은 밥집 있어?", "공강에 쉬기 좋은 곳", "프린트는 어디서 해?", "늦게까지 하는 곳", "데이트하기 좋은 산책길"];

  var sample = null, turns = [], busy = null;
  var ready = null;            // AI 연결 확인이 끝나면 풀리는 약속

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 화면 ---------- */
  var root = document.createElement("div");
  root.className = "chatbot";
  root.innerHTML =
    '<button type="button" class="chat-fab" id="chatFab" aria-expanded="false" aria-controls="chatPanel">' +
      '<img src="assets/img/footer-mascot.png" alt=""><span>캠퍼스 챗봇</span></button>' +
    '<section class="chat-panel" id="chatPanel" role="dialog" aria-label="캠퍼스 챗봇" hidden>' +
      '<header class="chat-head"><img src="assets/img/footer-mascot.png" alt="">' +
        '<div><strong>캠퍼스 챗봇</strong><small id="chatMode">사이트에 있는 정보로 알려 줘요</small></div>' +
        '<button type="button" class="chat-x" id="chatClose" aria-label="챗봇 닫기">×</button></header>' +
      '<div class="chat-log" id="chatLog" aria-live="polite"></div>' +
      '<div class="chat-suggest" id="chatSuggest"></div>' +
      '<form class="chat-form" id="chatForm">' +
        '<label class="sr-only" for="chatInput">챗봇에게 질문</label>' +
        '<input id="chatInput" type="text" maxlength="200" autocomplete="off" placeholder="예) 혼자 가기 좋은 맛집 알려줘">' +
        '<button type="submit" id="chatSend" aria-label="보내기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>' +
      "</form>" +
    "</section>";
  document.body.appendChild(root);
  var $ = function (id) { return document.getElementById(id); };
  var log = $("chatLog");

  function bubble(who, html) {
    var el = document.createElement("div");
    el.className = "msg msg--" + who;
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }
  function placeChip(id) {
    var p = BY_ID[id];
    if (!p) return "";
    return '<button type="button" class="chat-place" data-review="' + esc(id) + '"><b>' + esc(p.it.name) + "</b><small>" +
      esc(SEC[p.sec] + " · " + (p.it.subcategory || p.it.category)) + "</small></button>";
  }
  // AI 답변: 안전하게 글자로 바꾼 뒤 **굵게**, 줄바꿈, [[장소id]] 칩만 살려요
  function renderAnswer(text) {
    var h = esc(text);
    h = h.replace(/^[ \t]*[*-][ \t]+/gm, "• ");   // 마크다운 목록 기호(* -)는 •로
    h = h.replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>");
    h = h.replace(/\[\[([a-z]+-[0-9a-f]{8})\]\]/g, function (m, id) { return placeChip(id); });
    h = h.replace(/\[\[([^\[\]\n]{1,40})\]\]/g, "$1");   // 장소id가 아닌 [[...]]는 괄호만 떼요
    // 마크다운 링크 [글자](장소id 또는 주소): 장소면 버튼, 주소면 주소만 남겨서 아래에서 링크로
    h = h.replace(/\(?\[([^\[\]\n]{1,40})\]\(([a-z]+-[0-9a-f]{8})\)\)?/g, function (m, label, id) { return BY_ID[id] ? placeChip(id) : label; });
    h = h.replace(/\[([^\[\]\n]{1,60})\]\((https?:\/\/[^\s)]+)\)/g, "$2");
    h = h.replace(/\[\[[^\]]*\]?\]?$/, "");  // 아직 다 안 온 칩 표시는 숨김
    // 주소는 '원문 보기' 링크로 (http/https만)
    h = h.replace(/https?:\/\/[^\s<>()"']+[^\s<>()"'.,!?]/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener">원문 보기 ↗</a>'; });
    return h.replace(/\n/g, "<br>");
  }
  function setSuggest(list) {
    $("chatSuggest").innerHTML = list.map(function (s) { return '<button type="button" class="chip" data-ask="' + esc(s) + '">' + esc(s) + "</button>"; }).join("");
  }
  function setMode(m) {
    $("chatMode").textContent = m === "ai" ? "AI 답변 · 사이트 정보만 근거로 알려 줘요" :
      m === "checking" ? "챗봇을 준비하는 중이에요…" : "지금은 챗봇을 쓸 수 없어요";
  }

  function open() {
    $("chatPanel").hidden = false; $("chatFab").setAttribute("aria-expanded", "true");
    if (!log.children.length) {
      bubble("bot", "안녕하세요! 교통대 캠퍼스 챗봇이에요 🐾<br>맛집, 숨은장소, 생활꿀팁은 물론 버스 시간, 학사일정, 공지도 물어보세요.");
      setSuggest(SUGGEST);
    }
    $("chatInput").focus();
  }
  function close() {
    $("chatPanel").hidden = true; $("chatFab").setAttribute("aria-expanded", "false"); $("chatFab").focus();
  }
  $("chatFab").addEventListener("click", function () { if ($("chatPanel").hidden) open(); else close(); });
  $("chatClose").addEventListener("click", close);
  $("chatPanel").addEventListener("keydown", function (e) { if (e.key === "Escape" && !document.querySelector(".modal:not([hidden])")) close(); });
  $("chatSuggest").addEventListener("click", function (e) {
    var b = e.target.closest("[data-ask]"); if (b) ask(b.getAttribute("data-ask"));
  });
  $("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) { busy.abort(); return; }
    var q = $("chatInput").value.trim(); if (q) ask(q);
  });

  /* ---------- 키워드 검색 ---------- */
  var RULES = [
    { re: /혼자|혼밥|혼술|1인|혼공/, kw: ["혼밥", "1인", "혼자", "혼술"], label: "혼자 가기 좋다는 메모" },
    { re: /싸|저렴|가성비|싼|돈 ?없|양 ?많|배부/, kw: ["가성비", "저렴", "싸", "양 많", "양이 많", "푸짐", "무한리필", "곱빼기", "배부"], label: "가성비·양 관련 메모" },
    { re: /늦게|야식|밤|새벽|24시/, kw: ["24:00", "24시", "새벽", "늦게", "밤", "23:00", "무인"], label: "늦게까지 연다는 메모" },
    { re: /데이트|연인|커플|썸/, kw: ["데이트", "커플", "썸", "분위기", "연인"], label: "데이트 관련 메모" },
    { re: /공부|과제|시험/, kw: ["공부", "과제", "열람실", "콘센트", "조모임", "독서실"], label: "공부하기 좋다는 메모" },
    { re: /쉬|휴식|공강|낮잠|잠/, kw: ["공강", "쉬", "휴식", "휴게"], label: "공강·휴식 관련 메모" },
    { re: /산책|걷|러닝|뛰/, kw: ["산책", "러닝", "걷", "둘레길"], label: "산책 관련 메모" },
    { re: /야경|노을|사진|벚꽃/, kw: ["야경", "노을", "사진", "벚꽃"], label: "풍경 관련 메모" },
    { re: /프린트|인쇄|출력|복사|제본/, kw: ["프린트", "프린터", "인쇄", "출력", "복사"], label: "프린트 관련 정보" },
    { re: /버스|통학|셔틀|터미널|택시|교통/, kw: ["버스", "통학", "셔틀", "터미널", "택시", "999"], label: "교통 정보" },
    { re: /장학|등록금|월세|지원금/, kw: ["장학", "등록금", "월세", "지원"], label: "장학·지원 정보" },
    { re: /빨래|세탁/, kw: ["세탁", "빨래"], label: "세탁 정보" },
    { re: /편의점|마트|장보/, kw: ["편의점", "마트", "장보"], label: "편의점·장보기 정보" },
    { re: /헬스|운동/, kw: ["헬스", "운동", "피트니스", "트랙"], label: "운동 정보" },
    { re: /수강|학점|졸업|재수강/, kw: ["수강", "학점", "졸업", "재수강"], label: "학사 정보" }
  ];
  var CATS = [
    { re: /카페|커피|디저트|빵/, f: function (p) { return p.it.category === "카페"; } },
    { re: /술|술집|맥주|포차|주점/, f: function (p) { return p.it.category === "술집"; } },
    { re: /학식|학생식당|교내식당/, f: function (p) { return p.it.category === "교내식당"; } },
    { re: /한식/, f: function (p) { return p.it.subcategory === "한식"; } },
    { re: /국밥|해장|순대/, f: function (p) { return p.it.subcategory === "국밥·해장국"; } },
    { re: /고기|삼겹|구이/, f: function (p) { return p.it.subcategory === "고기·구이"; } },
    { re: /중식|짜장|짬뽕|마라/, f: function (p) { return p.it.subcategory === "중식"; } },
    { re: /일식|돈까스|돈가스|초밥|우동|라멘/, f: function (p) { return p.it.subcategory === "일식·돈까스"; } },
    { re: /양식|파스타/, f: function (p) { return p.it.subcategory === "양식"; } },
    { re: /분식|떡볶이|김밥/, f: function (p) { return p.it.subcategory === "분식"; } },
    { re: /버거|부리또|도시락/, f: function (p) { return p.it.subcategory === "버거·간편식"; } },
    { re: /치킨/, f: function (p) { return p.it.subcategory === "치킨"; } },
    { re: /맛집|밥|먹|식당|점심|저녁|배고/, f: function (p) { return p.sec === "food" && p.it.category !== "카페"; } },
    { re: /숨은|장소|갈 ?곳|어디 ?가/, f: function (p) { return p.sec === "hidden"; } },
    { re: /놀|pc방|피씨|노래방|영화|볼링/i, f: function (p) { return p.sec === "etc"; } }
  ];
  var AREAS = [
    { re: /교내|학교 ?안|캠퍼스 ?안/, v: "교내" },
    { re: /학교 ?(앞|근처|주변)|대학로|가까운/, v: "학교 주변 (대소원면)" },
    { re: /시내|멀리/, v: "충주 시내·외곽" }
  ];
  // 질문과 맞는 장소를 점수순으로 골라요 (키워드 검색과 AI 답변이 같이 써요)
  function rank(q) {
    var rules = RULES.filter(function (r) { return r.re.test(q); });
    var cats = CATS.filter(function (c) { return c.re.test(q); });
    var area = AREAS.filter(function (a) { return a.re.test(q); })[0];
    // 규칙에 없는 낱말(2글자 이상)도 이름·메모에서 찾아요
    var stop = /^(알려줘|알려|추천|추천해줘|있어|있나|있어요|어디|어디서|어디에|좋은|좋아|곳|정보|해줘|하는|가기|하기|싶어|뭐|어때|좀|주세요|있는|근처|학교)$/;
    var words = q.replace(/[?!.,~]/g, " ").split(/\s+/).filter(function (w) { return w.length >= 2 && !stop.test(w); });
    var pool = ALL.filter(function (p) {
      return (!cats.length || cats.some(function (c) { return c.f(p); })) && (!area || p.it.area === area.v);
    });
    var scored = pool.map(function (p) {
      var hay = (p.it.name + " " + p.it.category + " " + (p.it.subcategory || "") + " " + p.it.note).toLowerCase();
      var s = 0, why = "";
      rules.forEach(function (r) {
        r.kw.forEach(function (k) {
          if (hay.indexOf(k.toLowerCase()) > -1) {
            s += 3;
            if (!why) why = (p.it.note.split("\n").filter(function (l) { return l.indexOf(k) > -1; })[0] || "");
          }
        });
      });
      if (!rules.length) words.forEach(function (w) { if (hay.indexOf(w.toLowerCase()) > -1) s += 2; });
      var hit = s;  // 질문과 실제로 맞은 점수
      s += Math.min(p.it.recommend || 1, 9) * 0.3;
      return { p: p, s: s, hit: hit, why: why };
    }).filter(function (x) {
      if (rules.length) return x.hit > 0;                 // "혼자", "싸" 같은 조건이 메모에 있어야
      if (cats.length || area) return words.length ? true : true; // 분류·위치만 물으면 그 안에서 추천 순
      return x.hit > 0;                                    // 그 밖의 낱말은 이름·메모에 있어야
    })
      .sort(function (a, b) { return b.s - a.s; });
    return { rules: rules, scored: scored };
  }

  /* ---------- AI 답변 ---------- */
  var DETAIL_MAX = 25;   // 자세히 보내는 장소 수
  function detailLine(p) {
    var it = p.it;
    var note = String(it.note || "").split("\n").filter(function (l) { return !/^(참고|txt|전화|https?:)/.test(l); }).join(" / ");
    if (note.length > 260) note = note.slice(0, 258) + "…";
    return [it.id, SEC[p.sec], it.category, it.subcategory || "", it.name, it.area || "", it.location || "", it.price || "", "추천" + (it.recommend || 1), note].join(" | ");
  }
  var INDEX = null, FLOORS_TEXT = null;

  /* ---------- 버스·학사일정·공지 (시간 계산은 여기서 정확히 해서 AI에게 결과만 줘요) ---------- */
  var WD = ["일", "월", "화", "수", "목", "금", "토"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  // 지금 한국 시간: { date: "YYYY-MM-DD", wd: 0~6, min: 자정부터 분, hm: "HH:MM" }
  function nowKST() {
    var k = new Date(Date.now() + 9 * 3600 * 1000);   // UTC+9 (한국은 서머타임 없음)
    var date = k.getUTCFullYear() + "-" + pad(k.getUTCMonth() + 1) + "-" + pad(k.getUTCDate());
    return { date: date, wd: k.getUTCDay(), min: k.getUTCHours() * 60 + k.getUTCMinutes(), hm: pad(k.getUTCHours()) + ":" + pad(k.getUTCMinutes()) };
  }
  function addDays(date, n) {
    var d = new Date(Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10)) + n * 86400000);
    return { date: d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()), wd: d.getUTCDay() };
  }
  function daysBetween(a, b) {
    return Math.round((Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10))) / 86400000);
  }
  function md(date) { return +date.slice(5, 7) + "/" + +date.slice(8, 10); }
  function toMin(hm) { return +hm.slice(0, 2) * 60 + +hm.slice(3, 5); }
  function busTimes(r) { return (r.times || []).map(function (x) { return typeof x === "string" ? { t: x } : x; }); }
  // 그날 이 노선이 다니는지: 요일 + 학기 기간 + 학사일정 휴일
  function busRuns(r, day) {
    var B = window.BUS || {}, CAL = (window.CALENDAR || {}).events || [];
    if (r.days && r.days.indexOf(day.wd) < 0) return { ok: false, why: WD[day.wd] + "요일 미운행" };
    if (r.semesterOnly && B.semester && (day.date < B.semester[0] || day.date > B.semester[1])) return { ok: false, why: "학기 중이 아님(방학) 미운행" };
    var hol = CAL.filter(function (e) { return e.type === "holiday" && e.start <= day.date && day.date <= e.end; })[0];
    if (hol) return { ok: false, why: hol.title + " 미운행" };
    return { ok: true };
  }
  function busText(now) {
    var B = window.BUS;
    if (!B || !B.routes) return "";
    var lines = B.routes.map(function (r) {
      var times = busTimes(r), fmt = function (x) { return x.t + (x.note ? "(" + x.note + ")" : ""); };
      var run = busRuns(r, now), state;
      if (run.ok) {
        var left = times.filter(function (x) { return toMin(x.t) >= now.min; });
        state = left.length ? "오늘 운행 중. 지금 이후 출발: " + left.slice(0, 3).map(function (x) { return fmt(x) + " (" + (toMin(x.t) - now.min) + "분 후)"; }).join(", ") +
          (left.length > 3 ? " 외 " + (left.length - 3) + "회" : "") : "오늘 운행 끝 (막차 지남)";
      } else {
        state = "오늘 " + run.why;
      }
      if (!run.ok || !times.filter(function (x) { return toMin(x.t) >= now.min; }).length) {
        for (var i = 1; i <= 120; i++) {
          var d = addDays(now.date, i);
          if (busRuns(r, d).ok) { state += ". 다음 운행일: " + md(d.date) + "(" + WD[d.wd] + ") 첫차 " + (times[0] ? times[0].t : "?"); break; }
          if (i === 120) state += ". 가까운 운행일 정보 없음 (다음 학기 시간표 확인 필요)";
        }
      }
      return "- " + r.name + "\n  경로: " + (r.from || "") + "\n  " + state +
        "\n  전체 시간표(평일): " + times.map(fmt).join(", ") + (r.info ? "\n  참고: " + r.info : "");
    });
    return "운행 기간: " + B.semester.join(" ~ ") + " 평일(공휴일 제외), 시간표 기준일 " + B.updated +
      "\n실시간 도착 정보: " + B.realtime + " / 문의: " + B.contact + "\n" + lines.join("\n");
  }
  function calendarText(now) {
    var C = window.CALENDAR;
    if (!C || !C.events) return "";
    return C.events.map(function (e) {
      var span = e.start === e.end ? e.start : e.start + " ~ " + e.end, st;
      if (now.date < e.start) st = "D-" + daysBetween(now.date, e.start);
      else if (now.date <= e.end) st = "진행 중" + (e.start === e.end ? " (오늘)" : " (끝까지 " + daysBetween(now.date, e.end) + "일)");
      else st = "지남";
      return "- " + span + " " + e.title + " [" + st + "]";
    }).join("\n") + "\n원문: " + C.url;
  }
  function noticeText() {
    var S = window.SITE || {};
    var list = (S.notices || []).map(function (n) {
      return "- [" + n.tag + "] " + n.title + " (" + n.date + ", " + (n.dept || "") + ")\n  " + (n.points || []).join(" / ") + "\n  원문: " + n.url;
    });
    var ev = (S.events || []).filter(function (e) { return !e.placeholder; }).map(function (e) { return "- " + e.date + " " + e.title + ": " + e.desc; });
    return list.join("\n") + (ev.length ? "\n[그 밖의 행사]\n" + ev.join("\n") : "") +
      (S.noticeBoards ? "\n학교 공지 게시판: " + S.noticeBoards.map(function (b) { return b.label + " " + b.url; }).join(" / ") : "");
  }
  function buildingText() {
    var b = ((window.SITE || {}).mapIntro || {}).buildings || [];
    return b.map(function (x) { return x.code + " " + x.name + (x.alias ? " (" + x.alias.join(", ") + ")" : ""); }).join(" / ");
  }

  // 질문(+최근 대화)과 관련된 장소를 골라요: 점수 높은 곳 + 직전 답변에 나온 곳, 모자라면 추천 많은 곳
  function pickRelevant(q, history) {
    var picked = [], seen = {};
    function add(p) { if (p && !seen[p.it.id] && picked.length < DETAIL_MAX) { seen[p.it.id] = 1; picked.push(p); } }
    var recentUser = history.filter(function (t) { return t.role === "user"; }).slice(-3).map(function (t) { return t.content; });
    var lastBot = history.filter(function (t) { return t.role === "assistant"; }).slice(-1)[0];
    if (lastBot) (lastBot.content.match(/\[\[([a-z]+-[0-9a-f]{8})\]\]/g) || []).forEach(function (m) { add(BY_ID[m.slice(2, -2)]); });
    rank(q).scored.forEach(function (x) { add(x.p); });
    if (recentUser.length) rank(recentUser.join(" ")).scored.forEach(function (x) { add(x.p); });
    if (picked.length < 8) ALL.slice().sort(function (a, b) { return (b.it.recommend || 1) - (a.it.recommend || 1); }).forEach(add);
    return picked;
  }
  function instructions(q, history) {
    if (!INDEX) {
      INDEX = ALL.map(function (p) { return p.it.id + " " + p.it.name + " (" + SEC[p.sec] + "·" + (p.it.subcategory || p.it.category) + ")"; }).join("\n");
      FLOORS_TEXT = Object.keys(FL).map(function (code) {
        return code + " " + FL[code].name + ": " + FL[code].floors.map(function (f) { return f.floor + "층 " + f.places.join(","); }).join(" / ");
      }).join("\n");
    }
    var details = pickRelevant(q, history || []).map(detailLine).join("\n");
    var now = nowKST();
    return "너는 '한국교통대학교 캠퍼스 라이프' 홈페이지의 안내 챗봇이야. 교통대 학생들이 묻는 말에 한국어로, 친근한 반말이 아닌 부드러운 존댓말(~요)로 답해.\n" +
      "맛집·숨은장소·생활꿀팁뿐 아니라 교내 버스(999번·700번), 학사일정, 학교 공지, 건물 위치도 안내해.\n" +
      "규칙:\n" +
      "1. 반드시 아래 [사이트 정보]에 있는 내용만 근거로 답해. 목록에 없는 가게·시설·시간·가격은 지어내지 마.\n" +
      "2. 장소를 추천할 때는 이름 대신 [[장소id]] 형식으로 써. 예: [[food-1a2b3c4d]] — 화면에서 누를 수 있는 버튼으로 바뀌어.\n" +
      "3. 보통 3~5곳을 고르고, 각각 왜 맞는지 비고 메모를 근거로 한 줄씩 설명해. 추천인 수가 많은 곳을 우선해.\n" +
      "4. 정보가 없거나 애매하면 솔직하게 없다고 말하고, 비슷한 대안이나 다시 물어볼 방법을 알려 줘.\n" +
      "5. 영업시간·가격은 바뀔 수 있으니 필요하면 '방문 전 확인'을 덧붙여. 답은 짧고 읽기 쉽게, 마크다운 표나 제목은 쓰지 마.\n" +
      "6. 이 홈페이지와 관계없는 요청(숙제 대신 해 주기 등)은 정중히 캠퍼스 정보 질문으로 안내해.\n" +
      "7. [자세한 정보]에 없는 곳은 [전체 목록]의 이름·분류만 알고 있어. 그런 곳의 시간·가격·메모는 지어내지 말고, 버튼을 눌러 확인하라고 안내해.\n" +
      "8. 버스 다음 차·남은 시간, 운행 여부, 일정의 D-day는 직접 계산하지 말고 [교내 버스]·[학사일정]에 이미 계산된 값을 그대로 써. 버스는 실시간 정보가 아니라 시간표 기준이라는 걸 짧게 덧붙이고, 실시간은 [교내 버스]의 실시간 도착 정보 주소로 안내해 (다른 앱은 언급하지 마).\n" +
      "9. 공지·일정을 안내할 때는 요약을 전하고, 맨 끝 줄에 '자세한 내용: ' 다음에 원문 주소만 적어 (주소는 화면에서 '원문 보기' 링크로 바뀌어). 주소를 괄호로 감싸지 마.\n" +
      "10. [[ ]] 표기는 장소id에만 써. 공지·일정·버스·건물에는 쓰지 마.\n" +
      "11. 출처 표시나 마크다운 링크([글자](주소))는 쓰지 마. 장소를 가리킬 때는 [[장소id]]만 쓰면 돼.\n\n" +
      "[지금] " + now.date + " (" + WD[now.wd] + ") " + now.hm + " 한국 시간\n\n" +
      "[교내 버스]\n" + busText(now) +
      "\n\n[학사일정] 형식: 날짜 일정 [오늘 기준 상태]\n" + calendarText(now) +
      "\n\n[학교 공지]\n" + noticeText() +
      "\n\n[건물 번호]\n" + buildingText() +
      "\n\n[사이트 정보]\n" +
      "[자세한 정보] 질문과 관련 있어 보이는 곳. 형식: 장소id | 메뉴 | 분류 | 세부분류 | 이름 | 위치구분 | 위치 | 가격 | 추천인 수 | 비고\n" + details +
      "\n\n[전체 목록] 형식: 장소id 이름 (메뉴·분류)\n" + INDEX +
      "\n\n[건물별 층 안내]\n" + FLOORS_TEXT;
  }
  // 챗봇 서버(Gemini)로 묻기 — claude.ai의 sample과 같은 모양으로 맞췄어요
  function serverSample(input, opts) {
    var body = { system: input[0].content, messages: input.slice(2) };
    var text = "";
    return fetch(CHAT_API + "/chat", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: opts.signal
    }).then(function (res) {
      if (!res.ok) return res.json().catch(function () { return {}; }).then(function (j) { throw { code: j.error || "upstream" }; });
      var reader = res.body.getReader(), dec = new TextDecoder(), buf = "", result = null;
      function handle(line) {
        if (!line.trim()) return;
        var j; try { j = JSON.parse(line); } catch (e) { return; }
        if (j.t) { text += j.t; if (opts.onText) opts.onText({ text: text }); }
        if (j.error) throw { code: j.error, text: text };
        if (j.done) result = { text: text, truncated: !!j.truncated };
      }
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) { handle(buf); if (!result) throw { code: "upstream", text: text }; return result; }
          buf += dec.decode(r.value, { stream: true });
          var i;
          while ((i = buf.indexOf("\n")) > -1) { handle(buf.slice(0, i)); buf = buf.slice(i + 1); }
          return pump();
        });
      }
      return pump();
    }).catch(function (e) {
      if (e && e.name === "AbortError") throw { code: "cancelled", text: text };
      if (e && e.code) throw e;
      throw { code: "network", text: text };
    });
  }
  function aiError(e) {
    var c = e && e.code;
    if (c === "not_granted" || c === "sampling_disabled" || c === "not_declared" || c === "capability_disabled" || c === "capability_removed" ||
        c === "no_key" || c === "bad_key" || c === "bad_model") {
      setMode("off"); sample = null;
      return "지금은 챗봇을 쓸 수 없어요. 나중에 다시 찾아 주세요.";
    }
    if (c === "rate_limited") return "질문이 많아 잠시 쉬어야 해요. 조금 뒤에 다시 물어봐 주세요.";
    if (c === "network") return "챗봇 서버에 연결하지 못했어요. 잠시 후 다시 보내 주세요.";
    if (c === "session_expired") return "claude.ai 로그인이 만료됐어요. 다시 로그인한 뒤 물어봐 주세요.";
    if (c === "refused") return "그 질문에는 답할 수 없어요. 캠퍼스 정보로 다시 물어봐 주세요.";
    return "답변을 가져오지 못했어요. 잠시 후 다시 보내 주세요.";
  }
  function setBusy(on) {
    $("chatSend").classList.toggle("is-stop", !!on);
    $("chatSend").setAttribute("aria-label", on ? "답변 멈추기" : "보내기");
    $("chatInput").disabled = !!on;
  }

  function ask(q) {
    $("chatInput").value = "";
    bubble("me", esc(q));
    $("chatSuggest").innerHTML = "";
    var out = bubble("bot", '<span class="typing">생각하는 중이에요…</span>');
    busy = new AbortController(); setBusy(true);
    // 연결 확인이 아직 안 끝났으면 기다렸다가 답해요
    ready.then(function () {
      if (busy && busy.signal.aborted) { out.innerHTML = '<p class="chat-note">답변을 멈췄어요.</p>'; done(); return; }
      if (!sample) {
        out.innerHTML = '<p class="chat-note">지금은 챗봇을 쓸 수 없어요. 나중에 다시 찾아 주세요.</p>';
        done(); return;
      }
      askAI(q, out);
    });
    function done() {
      busy = null; setBusy(false); $("chatInput").focus(); log.scrollTop = log.scrollHeight;
      setSuggest(SUGGEST.filter(function (s) { return s !== q; }).slice(0, 4));
    }
  }
  function askAI(q, out) {
    turns.push({ role: "user", content: q });
    if (turns.length > 8) turns = turns.slice(-8);
    var input = [{ role: "user", content: instructions(q, turns.slice(0, -1)) }, { role: "assistant", content: "네, 사이트 정보만 근거로 안내할게요." }].concat(turns);
    sample(input, {
      cache: false, modelTier: "quick", signal: busy.signal,
      onText: function (u) { out.innerHTML = renderAnswer(u.text); log.scrollTop = log.scrollHeight; }
    }).then(function (r) {
      out.innerHTML = renderAnswer(r.text) + (r.truncated ? '<p class="chat-note">답이 길어서 중간에 끊겼어요.</p>' : "");
      turns.push({ role: "assistant", content: r.text });
    }, function (e) {
      turns.pop();
      if (e && e.code === "cancelled") { out.innerHTML = (e.text ? renderAnswer(e.text) : "") + '<p class="chat-note">답변을 멈췄어요.</p>'; return; }
      out.innerHTML = (e && e.text && e.code !== "refused" ? renderAnswer(e.text) + "<br>" : "") + '<p class="chat-note">' + esc(aiError(e)) + "</p>";
    }).then(function () {
      busy = null; setBusy(false); $("chatInput").focus(); log.scrollTop = log.scrollHeight;
      setSuggest(SUGGEST.filter(function (s) { return s !== q; }).slice(0, 4));
    });
  }

  /* ---------- 방식 고르기 ---------- */
  setMode("checking");
  if (window.claude && typeof window.claude.use === "function") {
    ready = window.claude.use("sample").then(function (s) { if (s) sample = s; }, function () {});
  } else if (window.fetch && window.ReadableStream) {
    // 챗봇 서버가 켜져 있는지 확인 (POST라서 sw.js 캐시에 남지 않아요)
    ready = fetch(CHAT_API + "/health", { method: "POST" }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.ok) sample = serverSample; }, function () {});
  } else {
    ready = Promise.resolve();
  }
  ready = ready.then(function () { setMode(sample ? "ai" : "off"); });
})();
