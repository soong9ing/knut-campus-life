/* =============================================================
   캠퍼스 챗봇 — "혼자 가기 좋은 맛집 알려줘"
   -------------------------------------------------------------
   두 가지 방식이 자동으로 골라져요.
   1) AI 답변: claude.ai에 게시된 페이지에서 Claude가 사이트 정보(data/places.js,
      data/floors.js)만 근거로 대답해요. 처음 쓸 때 사용 허락을 한 번 물어요.
   2) 키워드 검색: Claude를 쓸 수 없는 곳(GitHub 등)에서는 질문 속 단어로
      사이트 정보를 찾아 보여 줘요. 서버·비용이 필요 없어요.
   답에 나온 장소를 누르면 그 장소의 상세 창(후기·지도)이 열려요.
   ============================================================= */
(function () {
  "use strict";
  var P = window.PLACES || {}, FL = window.FLOORS || {};
  var SEC = { food: "맛집", tips: "생활꿀팁", hidden: "숨은장소", etc: "자유" };
  var BY_ID = {}, ALL = [];
  Object.keys(SEC).forEach(function (sec) {
    (P[sec] || []).forEach(function (it) { BY_ID[it.id] = { sec: sec, it: it }; ALL.push({ sec: sec, it: it }); });
  });

  var SUGGEST = ["혼자 가기 좋은 맛집 알려줘", "싸고 양 많은 밥집 있어?", "공강에 쉬기 좋은 곳", "프린트는 어디서 해?", "늦게까지 하는 곳", "데이트하기 좋은 산책길"];

  var mode = "keyword";        // "ai" | "keyword"
  var sample = null, turns = [], busy = null;

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
    h = h.replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>");
    h = h.replace(/\[\[([a-z]+-[0-9a-f]{8})\]\]/g, function (m, id) { return placeChip(id); });
    h = h.replace(/\[\[[^\]]*\]?\]?$/, "");  // 아직 다 안 온 칩 표시는 숨김
    return h.replace(/\n/g, "<br>");
  }
  function setSuggest(list) {
    $("chatSuggest").innerHTML = list.map(function (s) { return '<button type="button" class="chip" data-ask="' + esc(s) + '">' + esc(s) + "</button>"; }).join("");
  }
  function setMode(m) {
    mode = m;
    $("chatMode").textContent = m === "ai" ? "AI 답변 · 사이트 정보만 근거로 알려 줘요" : "키워드 검색 · 질문 속 단어로 찾아 줘요";
  }

  function open() {
    $("chatPanel").hidden = false; $("chatFab").setAttribute("aria-expanded", "true");
    if (!log.children.length) {
      bubble("bot", "안녕하세요! 교통대 캠퍼스 챗봇이에요 🐾<br>맛집, 숨은장소, 생활꿀팁 중에서 궁금한 걸 물어보세요.");
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
  function keywordAnswer(q) {
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
      .sort(function (a, b) { return b.s - a.s; }).slice(0, 5);
    if (!scored.length) {
      return "그 질문에 딱 맞는 정보를 찾지 못했어요. 이렇게 물어보면 잘 찾아요.<br>· 혼자 가기 좋은 맛집 · 싸고 양 많은 밥집 · 공강에 쉬기 좋은 곳 · 프린트는 어디서 해?";
    }
    var head = (rules.length ? rules.map(function (r) { return r.label; }).join(", ") + "가 있는 곳을" : "질문과 관련된 곳을") + " 추천인 수와 함께 골라 봤어요.";
    return head + scored.map(function (x) {
      return '<div class="chat-pick">' + placeChip(x.p.it.id) + (x.why ? '<p>"' + esc(x.why.length > 70 ? x.why.slice(0, 68) + "…" : x.why) + '"</p>' : "") + "</div>";
    }).join("") + '<p class="chat-note">장소를 누르면 자세한 정보와 후기를 볼 수 있어요.</p>';
  }

  /* ---------- AI 답변 ---------- */
  function catalog() {
    var lines = ALL.map(function (p) {
      var it = p.it;
      var note = String(it.note || "").split("\n").filter(function (l) { return !/^(참고|txt|전화|https?:)/.test(l); }).join(" / ");
      if (note.length > 260) note = note.slice(0, 258) + "…";
      return [it.id, SEC[p.sec], it.category, it.subcategory || "", it.name, it.area || "", it.location || "", it.price || "", "추천" + (it.recommend || 1), note].join(" | ");
    });
    var floors = Object.keys(FL).map(function (code) {
      return code + " " + FL[code].name + ": " + FL[code].floors.map(function (f) { return f.floor + "층 " + f.places.join(","); }).join(" / ");
    });
    return lines.join("\n") + "\n\n[건물별 층 안내]\n" + floors.join("\n");
  }
  var CATALOG = null;
  function instructions() {
    if (!CATALOG) CATALOG = catalog();
    return "너는 '한국교통대학교 캠퍼스 라이프' 홈페이지의 안내 챗봇이야. 교통대 학생들이 묻는 말에 한국어로, 친근한 반말이 아닌 부드러운 존댓말(~요)로 답해.\n" +
      "규칙:\n" +
      "1. 반드시 아래 [사이트 정보]에 있는 내용만 근거로 답해. 목록에 없는 가게·시설·시간·가격은 지어내지 마.\n" +
      "2. 장소를 추천할 때는 이름 대신 [[장소id]] 형식으로 써. 예: [[food-1a2b3c4d]] — 화면에서 누를 수 있는 버튼으로 바뀌어.\n" +
      "3. 보통 3~5곳을 고르고, 각각 왜 맞는지 비고 메모를 근거로 한 줄씩 설명해. 추천인 수가 많은 곳을 우선해.\n" +
      "4. 정보가 없거나 애매하면 솔직하게 없다고 말하고, 비슷한 대안이나 다시 물어볼 방법을 알려 줘.\n" +
      "5. 영업시간·가격은 바뀔 수 있으니 필요하면 '방문 전 확인'을 덧붙여. 답은 짧고 읽기 쉽게, 마크다운 표나 제목은 쓰지 마.\n" +
      "6. 이 홈페이지와 관계없는 요청(숙제 대신 해 주기 등)은 정중히 캠퍼스 정보 질문으로 안내해.\n\n" +
      "[사이트 정보] 형식: 장소id | 메뉴 | 분류 | 세부분류 | 이름 | 위치구분 | 위치 | 가격 | 추천인 수 | 비고\n" + CATALOG;
  }
  function aiError(e) {
    var c = e && e.code;
    if (c === "not_granted" || c === "sampling_disabled" || c === "not_declared" || c === "capability_disabled" || c === "capability_removed") {
      setMode("keyword"); sample = null;
      return "AI 답변을 쓸 수 없어서 키워드 검색으로 바꿀게요. 같은 질문을 다시 보내 주세요.";
    }
    if (c === "rate_limited") return "질문이 많아 잠시 쉬어야 해요. 조금 뒤에 다시 물어봐 주세요.";
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
    if (mode !== "ai" || !sample) {
      bubble("bot", keywordAnswer(q));
      setSuggest(SUGGEST.filter(function (s) { return s !== q; }).slice(0, 4));
      return;
    }
    var out = bubble("bot", '<span class="typing">생각하는 중이에요…</span>');
    turns.push({ role: "user", content: q });
    if (turns.length > 8) turns = turns.slice(-8);
    var input = [{ role: "user", content: instructions() }, { role: "assistant", content: "네, 사이트 정보만 근거로 안내할게요." }].concat(turns);
    busy = new AbortController(); setBusy(true);
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
  setMode("keyword");
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("sample").then(function (s) { if (s) { sample = s; setMode("ai"); } }).catch(function () {});
  }
})();
