/* =============================================================
   편의 기능 모음
   1) 다음 버스까지 몇 분        (data/bus.js)
   2) 학사일정 D-day              (data/calendar.js)
   3) 즐겨찾기 (내 장소)           — 이 브라우저에만 저장
   4) 오늘 뭐 먹지? 랜덤 추천
   5) 지금 영업 중 표시            — 메모 속 영업시간을 읽어 계산
   6) 휴대폰 홈 화면에 추가(PWA)   — GitHub 등 일반 웹호스팅에서 동작
   7) 정보 수정 요청(제보)
   app.js가 window.Features의 함수를 불러 화면에 넣어요.
   ============================================================= */
(function () {
  "use strict";
  var SITE = window.SITE || {}, P = window.PLACES || {}, BUS = window.BUS || { routes: [] }, CAL = window.CALENDAR || { events: [] };
  var SEC = { food: "맛집", tips: "생활꿀팁", hidden: "숨은장소", etc: "자유" };
  var BY_ID = {};
  Object.keys(SEC).forEach(function (s) { (P[s] || []).forEach(function (it) { BY_ID[it.id] = { sec: s, it: it }; }); });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function toMin(hhmm) { var m = /^(\d{1,2}):(\d{2})$/.exec(hhmm); return m ? (+m[1]) * 60 + (+m[2]) : null; }
  function fmtMin(m) { if (m === 1440) return "자정"; m = ((m % 1440) + 1440) % 1440; return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  var DAYS = "일월화수목금토";

  /* ---------- 저장 (이 브라우저에만) ---------- */
  function load(key, def) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  /* =============================================================
     1) 버스
     ============================================================= */
  function inSemester(d) { var s = BUS.semester; if (!s) return true; var t = ymd(d); return t >= s[0] && t <= s[1]; }
  function isHoliday(d) {
    var t = ymd(d);
    return (CAL.events || []).some(function (e) { return e.type === "holiday" && t >= e.start && t <= e.end; });
  }
  function runsOn(route, d) {
    if (route.days.indexOf(d.getDay()) < 0) return false;
    if (route.semesterOnly && (!inSemester(d) || isHoliday(d))) return false;
    return true;
  }
  function times(route) { return route.times.map(function (x) { return typeof x === "string" ? { t: x, note: "" } : x; }); }
  // 지금 이후 첫 차 (오늘 없으면 다음 운행일 첫 차)
  function nextBus(route, now) {
    now = now || new Date();
    var cur = now.getHours() * 60 + now.getMinutes();
    if (runsOn(route, now)) {
      var today = times(route).filter(function (x) { return toMin(x.t) >= cur; });
      if (today.length) return { t: today[0].t, note: today[0].note, wait: toMin(today[0].t) - cur, day: 0, after: today.slice(1, 3) };
    }
    for (var i = 1; i <= 14; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (runsOn(route, d)) { var f = times(route)[0]; return { t: f.t, note: f.note, wait: null, day: i, date: d }; }
    }
    return null;
  }
  function waitText(n) {
    if (!n) return "운행 정보 없음";
    if (n.day === 0) return n.wait === 0 ? "곧 출발" : n.wait < 60 ? n.wait + "분 후" : Math.floor(n.wait / 60) + "시간 " + (n.wait % 60) + "분 후";
    return (n.day === 1 ? "내일" : (n.date.getMonth() + 1) + "/" + n.date.getDate() + "(" + DAYS[n.date.getDay()] + ")") + " 첫차";
  }
    function route(id) { return BUS.routes.filter(function (r) { return r.id === id; })[0]; }
  function busWidgetHTML() {
    var sel = load("knut-bus-route", "999-out");
    if (!route(sel)) sel = "999-out";
    var r = route(sel), n = nextBus(r);
    return '<div class="fw-card fw-bus" id="fwBus">' +
      '<div class="fw-head"><h3>🚌 교내 버스</h3><a class="more-link" href="#bus">전체 시간표 →</a></div>' +
      '<label class="sr-only" for="fwBusSel">노선 고르기</label>' +
      '<select class="select fw-select" id="fwBusSel">' + BUS.routes.map(function (x) {
        return '<option value="' + x.id + '"' + (x.id === sel ? " selected" : "") + ">" + esc(x.name) + "</option>";
      }).join("") + "</select>" +
      '<p class="fw-big">' + (n ? esc(n.t) : "—") + ' <span class="fw-wait' + (n && n.day === 0 && n.wait <= 10 ? " is-soon" : "") + '">' + esc(waitText(n)) + "</span></p>" +
      '<p class="fw-sub">' + esc(n && n.note ? n.note : r.from) + (n && n.after && n.after.length ? " · 그다음 " + n.after.map(function (x) { return x.t; }).join(", ") : "") + "</p>" +
    "</div>";
  }
  function busPageHTML() {
    var now = new Date(), cur = now.getHours() * 60 + now.getMinutes();
    var groups = [];
    BUS.routes.forEach(function (r) { if (groups.indexOf(r.group) < 0) groups.push(r.group); });
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 교내 버스</div><h1>교내 버스 시간표</h1>' +
      "<p>학교 안까지 들어오는 999번·700번 시간표예요. 지금 시각 기준으로 다음 차를 표시해요. 주말·공휴일·방학에는 운행하지 않고, 교통 상황에 따라 늦어질 수 있어요.</p>" +
      '<div class="toolbar">' + (BUS.realtime ? '<a class="pill-btn" href="' + esc(BUS.realtime) + '" target="_blank" rel="noopener">실시간 버스 도착 정보' + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' : "") +
        (BUS.contact ? '<span class="hint">문의: ' + esc(BUS.contact) + "</span>" : "") + "</div></div>" +
      groups.map(function (g) {
        return '<section class="bus-group"><h2>' + esc(g) + '</h2><div class="bus-grid">' +
          BUS.routes.filter(function (r) { return r.group === g; }).map(function (r) {
            var n = nextBus(r, now), runs = runsOn(r, now);
            return '<article class="bus-card"><h3>' + esc(r.name) + '</h3><p class="meta">' + esc(r.from) + "</p>" +
              '<p class="bus-next">' + (n ? "<b>" + esc(n.t) + "</b> " + esc(waitText(n)) : "운행 정보 없음") + "</p>" +
              '<ol class="bus-times">' + times(r).map(function (x) {
                var past = runs && toMin(x.t) < cur, isNext = n && n.day === 0 && x.t === n.t;
                return '<li class="' + (past ? "is-past" : "") + (isNext ? " is-next" : "") + '"' + (x.note ? ' title="' + esc(x.note) + '"' : "") + ">" + esc(x.t) + (x.note ? "<small>*</small>" : "") + "</li>";
              }).join("") + "</ol>" +
              (times(r).some(function (x) { return x.note; }) ? '<p class="hint">* ' + times(r).filter(function (x) { return x.note; }).map(function (x) { return x.t + " " + esc(x.note); }).join(" / ") + "</p>" : "") +
              (r.info ? '<p class="hint">' + esc(r.info) + "</p>" : "") + "</article>";
          }).join("") + "</div></section>";
      }).join("") + "</div>";
  }

  /* =============================================================
     2) 학사일정 D-day
     ============================================================= */
  function dayDiff(a, b) { // b - a (일)
    var A = new Date(a + "T00:00:00"), B = new Date(b + "T00:00:00");
    return Math.round((B - A) / 86400000);
  }
  function ddayLabel(e, today) {
    if (today >= e.start && today <= e.end) return "진행 중";
    var d = dayDiff(today, e.start);
    return d === 0 ? "D-DAY" : "D-" + d;
  }
  function upcoming(n, keyOnly) {
    var today = ymd(new Date());
    return (CAL.events || []).filter(function (e) { return e.end >= today && (!keyOnly || e.key); })
      .sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; }).slice(0, n);
  }
  function range(e) { return e.start === e.end ? e.start.slice(5).replace("-", ".") : e.start.slice(5).replace("-", ".") + " ~ " + e.end.slice(5).replace("-", "."); }
  function ddayWidgetHTML() {
    var today = ymd(new Date()), list = upcoming(3, true);
    if (!list.length) list = upcoming(3, false);
    return '<div class="fw-card fw-dday">' +
      '<div class="fw-head"><h3>📅 학사일정 D-day</h3><a class="more-link" href="#events">전체 일정 →</a></div>' +
      (list.length ? '<ul class="dday-list">' + list.map(function (e) {
        return '<li class="dday--' + e.type + '"><b class="dday-badge">' + esc(ddayLabel(e, today)) + "</b><span>" + esc(e.title) + "<small>" + esc(range(e)) + "</small></span></li>";
      }).join("") + "</ul>" : '<p class="fw-sub">다가오는 일정이 없어요. data/calendar.js에 새 학기 일정을 넣어 주세요.</p>') +
    "</div>";
  }
  var TYPE = { exam: "시험", apply: "신청", class: "수업", holiday: "휴일", etc: "기타" };
  function calendarPageHTML() {
    var today = ymd(new Date());
    var months = {};
    (CAL.events || []).slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; }).forEach(function (e) {
      var k = e.start.slice(0, 7); (months[k] = months[k] || []).push(e);
    });
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 학사일정</div><h1>학사일정</h1>' +
      "<p>학교 학사일정과 학사공지에서 모은 일정이에요 (" + esc(CAL.updated) + " 확인). 날짜는 바뀔 수 있으니 학교 공지도 함께 확인하세요.</p>" +
      '<div class="toolbar"><a class="text-btn" href="' + esc(CAL.url) + '" target="_blank" rel="noopener">학교 학사일정 보기 ↗</a></div></div>' +
      Object.keys(months).map(function (k) {
        return '<section class="cal-month"><h2>' + esc(k.replace("-", "년 ") + "월") + '</h2><ul class="cal-list">' + months[k].map(function (e) {
          var done = e.end < today;
          return '<li class="dday--' + e.type + (done ? " is-done" : "") + '"><span class="cal-date">' + esc(range(e)) + '</span><span class="tag tag--sub">' + esc(TYPE[e.type] || "기타") + "</span><b>" + esc(e.title) + "</b>" +
            (done ? '<small class="cal-dd">지남</small>' : '<small class="cal-dd">' + esc(ddayLabel(e, today)) + "</small>") + "</li>";
        }).join("") + "</ul></section>";
      }).join("") + "</div>";
  }

  /* =============================================================
     3) 즐겨찾기
     ============================================================= */
  var favs = load("knut-favs", []);
  var favListeners = [];
  function isFav(id) { return favs.indexOf(id) > -1; }
  function toggleFav(id) {
    if (isFav(id)) favs = favs.filter(function (x) { return x !== id; }); else favs.unshift(id);
    save("knut-favs", favs);
    favListeners.forEach(function (fn) { fn(id); });
    return isFav(id);
  }
  function favButtonHTML(id) {
    var on = isFav(id);
    return '<button type="button" class="fav-btn" data-fav="' + esc(id) + '" aria-pressed="' + on + '" aria-label="' + (on ? "내 장소에서 빼기" : "내 장소에 저장") + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9z"/></svg><span>' + (on ? "저장됨" : "저장") + "</span></button>";
  }
  function favIds() { return favs.filter(function (id) { return BY_ID[id]; }); }

  /* =============================================================
     5) 지금 영업 중
     ============================================================= */
  function parseDays(s) {
    s = s.replace(/요일/g, "").trim();
    if (/매일|연중/.test(s)) return [0, 1, 2, 3, 4, 5, 6];
    if (/평일/.test(s)) return [1, 2, 3, 4, 5];
    if (/주말/.test(s)) return [0, 6];
    var out = [];
    s.split(/[·,\/]/).forEach(function (part) {
      var m = /([일월화수목금토])\s*~\s*([일월화수목금토])/.exec(part);
      if (m) { var a = DAYS.indexOf(m[1]), b = DAYS.indexOf(m[2]); for (var i = a; ; i = (i + 1) % 7) { out.push(i); if (i === b) break; } }
      else { for (var j = 0; j < part.length; j++) { var k = DAYS.indexOf(part[j]); if (k > -1) out.push(k); } }
    });
    return out;
  }
  var hoursCache = {};
  function parseHours(it) {
    if (hoursCache[it.id] !== undefined) return hoursCache[it.id];
    var lines = String(it.note || "").split("\n");
    var spec = { ranges: [], breaks: [], closed: [], always: false, uncertain: false };
    var found = false;
    lines.forEach(function (line) {
      if (/붐빔|대기|소요|점호|외박|출입|버스|신청|직원 근무|시험기간|열람실 0|동서울|강남|청주|수원/.test(line)) return;
      if (/^24시간/.test(line.trim()) && !/아이스크림/.test(line)) { spec.always = true; found = true; return; }
      if (/연중무휴/.test(line)) found = true;
      var off = /([일월화수목금토·~]+)\s*요?일?\s*(정기)?\s*휴무/.exec(line.replace(/매주\s*/, ""));
      if (off) { spec.closed = spec.closed.concat(parseDays(off[1])); found = true; }
      var isHours = /영업|운영|^\s*식사|^\s*매일|^\s*평일|^\s*주말|^\s*[일월화수목금토][~·일월화수목금토\s]*\d|^\s*\d{1,2}:\d{2}\s*~/.test(line);
      if (!isHours) return;
      var body = line.replace(/^[^:：]*시간\s*[:：]/, "").replace(/\([^)]*\)/g, function (m) {
        var fri = /(금)요일\s*(\d{1,2}:\d{2})까지/.exec(m); if (fri) spec.override = { day: 5, end: toMin(fri[2]) }; return "";
      });
      body.split(/,\s*/).forEach(function (seg) {
        var br = /브레이크\s*타임\s*(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/.exec(seg);
        if (br) { spec.breaks.push([toMin(br[1]), toMin(br[2])]); return; }
        var lunch = /점심시간\s*(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/.exec(seg);
        if (lunch) { spec.breaks.push([toMin(lunch[1]), toMin(lunch[2])]); return; }
        if (/라스트오더/.test(seg)) return;
        var m = /^\s*([^0-9]*?)\s*(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/.exec(seg);
        if (!m) return;
        var dayTxt = m[1].replace(/영업|운영|식사|시간|[:：]/g, "").trim();
        if (/라면|3층|열람실/.test(dayTxt)) return;
        var days = dayTxt ? parseDays(dayTxt) : [0, 1, 2, 3, 4, 5, 6];
        if (!days.length) days = [0, 1, 2, 3, 4, 5, 6];
        var s = toMin(m[2]), e = toMin(m[3]); if (e <= s) e += 1440;
        spec.ranges.push({ days: days, s: s, e: e }); found = true;
      });
      // 같은 줄의 점심시간 괄호 처리 (우체국·보건실)
      var l2 = /점심시간\s*(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/.exec(line);
      if (l2) spec.breaks.push([toMin(l2[1]), toMin(l2[2])]);
    });
    // 요일 지정이 없는데 휴무일이 있으면 그 날은 빼요
    if (!found || (!spec.ranges.length && !spec.always)) { hoursCache[it.id] = null; return null; }
    hoursCache[it.id] = spec; return spec;
  }
  function openStatus(it, now) {
    var spec = parseHours(it); if (!spec) return null;
    now = now || new Date();
    if (spec.always) return { state: "open", text: "24시간" };
    var dow = now.getDay(), cur = now.getHours() * 60 + now.getMinutes();
    function rangesFor(d) {
      if (spec.closed.indexOf(d) > -1) return [];
      return spec.ranges.filter(function (r) { return r.days.indexOf(d) > -1 && spec.closed.indexOf(d) < 0; }).map(function (r) {
        var e = spec.override && spec.override.day === d ? spec.override.end : r.e; return { s: r.s, e: e };
      });
    }
    // 어제 밤부터 이어지는 영업 (자정 넘김)
    var yest = rangesFor((dow + 6) % 7).filter(function (r) { return r.e > 1440 && cur < r.e - 1440; });
    if (yest.length) return { state: "open", text: "영업 중 · " + fmtMin(yest[0].e) + " 마감" };
    var today = rangesFor(dow);
    if (spec.closed.indexOf(dow) > -1) return { state: "closed", text: "오늘 휴무" };
    for (var i = 0; i < today.length; i++) {
      var r = today[i];
      if (cur >= r.s && cur < r.e) {
        var br = spec.breaks.filter(function (b) { return cur >= b[0] && cur < b[1]; })[0];
        if (br) return { state: "break", text: "브레이크타임 · " + fmtMin(br[1]) + " 재개" };
        if (r.e - cur <= 30) return { state: "soon", text: "곧 마감 · " + fmtMin(r.e) };
        return { state: "open", text: "영업 중 · " + fmtMin(r.e) + " 마감" };
      }
    }
    var later = today.filter(function (r) { return r.s > cur; })[0];
    if (later) return { state: "closed", text: "영업 전 · " + fmtMin(later.s) + " 오픈" };
    if (!today.length && !spec.ranges.length) return null;
    return { state: "closed", text: today.length ? "영업 종료" : "오늘 영업 안 함" };
  }
  function openBadgeHTML(it) {
    var st = openStatus(it); if (!st) return "";
    return '<span class="open-badge open-badge--' + st.state + '" title="메모 속 영업시간 기준 · 방문 전 확인 권장">' + esc(st.text) + "</span>";
  }

  /* =============================================================
     4) 오늘 뭐 먹지?
     ============================================================= */
  var pickState = load("knut-pick", { sub: "전체", area: "학교 주변 (대소원면)", solo: false, cheap: false, open: false });
  var NOTE = { solo: /혼밥|1인|혼자/, cheap: /가성비|저렴|싸고|싸다|양 많|양이 많|푸짐|무한리필|곱빼기/ };
  function pickPool() {
    return (P.food || []).filter(function (it) {
      if (it.category === "카페") return pickState.sub === "카페";
      if (pickState.sub === "카페") return false;
      if (pickState.sub !== "전체" && pickState.sub !== "술집" && it.subcategory !== pickState.sub) return false;
      if (pickState.sub === "술집" ? it.category !== "술집" : it.category === "술집") return false;
      if (pickState.area !== "전체" && it.area !== pickState.area) return false;
      if (pickState.solo && !NOTE.solo.test(it.note)) return false;
      if (pickState.cheap && !NOTE.cheap.test(it.note)) return false;
      if (pickState.open) { var st = openStatus(it); if (!st || (st.state !== "open" && st.state !== "soon")) return false; }
      return true;
    });
  }
  var lastPick = null;
  function pickOne() {
    var pool = pickPool();
    if (!pool.length) return null;
    if (pool.length > 1 && lastPick) pool = pool.filter(function (x) { return x.id !== lastPick; });
    // 추천인 수가 많을수록 조금 더 잘 뽑혀요
    var total = pool.reduce(function (s, x) { return s + Math.min(x.recommend || 1, 5) + 1; }, 0), r = Math.random() * total;
    for (var i = 0; i < pool.length; i++) { r -= Math.min(pool[i].recommend || 1, 5) + 1; if (r <= 0) { lastPick = pool[i].id; return pool[i]; } }
    lastPick = pool[0].id; return pool[0];
  }
  function pickWidgetHTML() {
    return '<div class="fw-card fw-pick">' +
      '<div class="fw-head"><h3>🍚 오늘 뭐 먹지?</h3></div>' +
      '<p class="fw-sub">조건을 고르고 뽑기를 누르면 학생들이 추천한 맛집 중 하나를 골라 줘요.</p>' +
      '<button type="button" class="pill-btn fw-pick-btn" id="fwPickOpen">메뉴 뽑기 🎲</button>' +
    "</div>";
  }
  var SUBS = ["전체", "한식", "국밥·해장국", "고기·구이", "중식", "일식·돈까스", "양식", "분식", "버거·간편식", "치킨", "카페", "술집"];
  var AREAS = ["전체", "교내", "학교 주변 (대소원면)", "충주 시내·외곽"];
  var dlg = null;
  function openPicker() {
    if (!dlg) {
      dlg = document.createElement("div"); dlg.className = "modal"; dlg.hidden = true;
      dlg.innerHTML = '<div class="modal-back" data-close></div><div class="modal-card pick-card" role="dialog" aria-modal="true" aria-labelledby="pickTitle">' +
        '<button type="button" class="modal-x" data-close aria-label="닫기">×</button><h2 id="pickTitle">오늘 뭐 먹지? 🎲</h2>' +
        '<div class="pick-opts" id="pickOpts"></div><div class="pick-result" id="pickResult" aria-live="polite"></div>' +
        '<div class="rf-row"><span class="hint" id="pickCount"></span><button type="button" class="pill-btn" id="pickGo">뽑기</button></div></div>';
      document.body.appendChild(dlg);
      dlg.addEventListener("click", function (e) {
        if (e.target.closest("[data-close]")) { dlg.hidden = true; document.body.classList.remove("no-scroll"); return; }
        var o = e.target.closest("[data-pick]");
        if (o) {
          var k = o.dataset.pick, v = o.dataset.val;
          if (k === "solo" || k === "cheap" || k === "open") pickState[k] = !pickState[k]; else pickState[k] = v;
          save("knut-pick", pickState); renderOpts();
        }
        if (e.target.closest("#pickGo")) draw();
      });
      dlg.addEventListener("keydown", function (e) { if (e.key === "Escape") { dlg.hidden = true; document.body.classList.remove("no-scroll"); } });
    }
    renderOpts(); $("pickResult").innerHTML = "";
    dlg.hidden = false; document.body.classList.add("no-scroll"); $("pickGo").focus();
  }
  function $(id) { return document.getElementById(id); }
  function chipRow(label, key, list) {
    return '<div class="pick-row"><span>' + label + "</span><div class=\"chips\">" + list.map(function (v) {
      return '<button type="button" class="chip" data-pick="' + key + '" data-val="' + esc(v) + '" aria-pressed="' + (pickState[key] === v) + '">' + esc(v.replace(" (대소원면)", "")) + "</button>";
    }).join("") + "</div></div>";
  }
  function renderOpts() {
    $("pickOpts").innerHTML = chipRow("종류", "sub", SUBS) + chipRow("위치", "area", AREAS) +
      '<div class="pick-row"><span>조건</span><div class="chips">' +
        [["solo", "혼밥 가능"], ["cheap", "가성비·양 많음"], ["open", "지금 영업 중(시간 정보 있는 곳)"]].map(function (x) {
          return '<button type="button" class="chip" data-pick="' + x[0] + '" aria-pressed="' + !!pickState[x[0]] + '">' + x[1] + "</button>";
        }).join("") + "</div></div>";
    var n = pickPool().length;
    $("pickCount").textContent = "후보 " + n + "곳";
    $("pickGo").disabled = !n;
  }
  function draw() {
    var it = pickOne(), box = $("pickResult");
    if (!it) { box.innerHTML = '<p class="hint">조건에 맞는 곳이 없어요. 조건을 줄여 보세요.</p>'; return; }
    box.innerHTML = '<div class="pick-hit"><p class="pick-meta">' + esc([it.subcategory || it.category, it.area].filter(Boolean).join(" · ")) + "</p>" +
      "<h3>" + esc(it.name) + "</h3>" + openBadgeHTML(it) +
      (it.price ? '<p class="meta"><b>가격</b> ' + esc(it.price) + "</p>" : "") +
      '<p class="pick-note">' + esc(String(it.note || "").split("\n")[0]) + "</p>" +
      '<button type="button" class="text-btn" data-review="' + esc(it.id) + '" data-close-pick>자세히 보기 →</button></div>';
    box.querySelector("[data-close-pick]").addEventListener("click", function () { dlg.hidden = true; });
  }

  /* =============================================================
     7) 정보 수정 요청
     ============================================================= */
  var db = null, me = null;
  if (window.claude && typeof window.claude.use === "function") {
    Promise.all([window.claude.use("db"), window.claude.use("user")]).then(function (r) {
      db = r[0]; return r[1] ? r[1].id() : null;
    }).then(function (id) { me = id; }).catch(function () {});
  }
  function reportAvailable() { return !!(db && me) || !!SITE.reportFormUrl; }
  function reportHTML(id) {
    return '<details class="report"><summary>정보가 틀렸나요? 수정 요청하기</summary>' +
      '<form class="report-form" data-report="' + esc(id) + '"><label class="sr-only" for="rp-' + esc(id) + '">수정 요청 내용</label>' +
      '<textarea id="rp-' + esc(id) + '" maxlength="400" rows="3" placeholder="예) 가격이 9,000원으로 올랐어요 / 폐업했어요 / 영업시간이 바뀌었어요"></textarea>' +
      '<div class="rf-row"><span class="hint report-msg" role="status"></span><button type="submit" class="pill-btn">보내기</button></div></form></details>';
  }
  function sendReport(form) {
    var id = form.dataset.report, ta = form.querySelector("textarea"), msg = form.querySelector(".report-msg");
    var text = ta.value.trim(), place = BY_ID[id];
    if (text.length < 2) { msg.textContent = "내용을 2자 이상 써 주세요."; return; }
    if (db && me) {
      var ref = db.doc("reports/" + me);
      ref.get().then(function (snap) {
        var items = snap.exists && Array.isArray(snap.data().items) ? snap.data().items.slice(-49) : [];
        items.push({ place: id, name: place ? place.it.name : "", text: text, at: Date.now() });
        return ref.set({ items: items });
      }).then(function () { ta.value = ""; msg.textContent = "보냈어요! 확인 후 반영할게요."; },
        function () { msg.textContent = "보내지 못했어요. 잠시 후 다시 해 보세요."; });
      return;
    }
    if (SITE.reportFormUrl) {
      var url = SITE.reportFormUrl.replace("{place}", encodeURIComponent(place ? place.it.name : id)).replace("{text}", encodeURIComponent(text));
      window.open(url, "_blank", "noopener"); msg.textContent = "제보 양식이 새 탭에서 열렸어요.";
      return;
    }
    msg.textContent = "제보 기능은 준비 중이에요.";
  }
  document.addEventListener("submit", function (e) {
    var f = e.target.closest && e.target.closest("[data-report]");
    if (f) { e.preventDefault(); sendReport(f); }
  });

  /* =============================================================
     6) 홈 화면에 추가 (PWA)
     ============================================================= */
  var installEvt = null;
  function inViewer() { try { return window.self !== window.top || !!window.claude; } catch (e) { return true; } }
  if (!inViewer() && "serviceWorker" in navigator && (location.protocol === "https:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); installEvt = e; });
  window.addEventListener("appinstalled", function () { installEvt = null; if (window.Toast) window.Toast("홈 화면에 추가됐어요!"); });
  // 푸터의 마스코트(#installBtn)를 누르면 홈 화면에 추가해요.
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#installBtn")) return;
    var toast = window.Toast || function () {};
    var standalone = window.navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
    if (standalone) return toast("이미 홈 화면에서 열려 있어요 😊");
    if (installEvt) { installEvt.prompt(); installEvt = null; return; }
    if (inViewer()) return toast("배포된 사이트 주소에서 누르면 홈 화면에 추가할 수 있어요.");
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return toast("Safari 아래쪽 공유 버튼 → '홈 화면에 추가'를 눌러 주세요.");
    toast("브라우저 메뉴(⋮) → '홈 화면에 추가' 또는 '앱 설치'를 눌러 주세요.");
  });

  window.Features = {
    busWidgetHTML: busWidgetHTML, busPageHTML: busPageHTML, setBusRoute: function (id) { save("knut-bus-route", id); },
    ddayWidgetHTML: ddayWidgetHTML, calendarPageHTML: calendarPageHTML,
    isFav: isFav, toggleFav: toggleFav, favButtonHTML: favButtonHTML, favIds: favIds, onFav: function (fn) { favListeners.push(fn); },
    openStatus: openStatus, openBadgeHTML: openBadgeHTML,
    pickWidgetHTML: pickWidgetHTML, openPicker: openPicker,
    reportAvailable: reportAvailable, reportHTML: reportHTML
  };
})();
