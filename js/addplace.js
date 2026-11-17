/* =============================================================
   장소 추가 신청 (2026-11-17, 주희)
   - 숨은장소·맛집·생활꿀팁 화면 오른쪽 위 ＋ 버튼 → 신청 창
   - 신청하면 구글 폼으로 보내져 응답 시트에 쌓여요. (학생 눈엔 구글 폼이 안 보여요)
   - 관리자가 시트의 '승인' 칸에 O를 쓰면, 사이트가 시트를 읽어서 그 장소만 목록에 보여 줘요.
   - 설정: data/site.js 의 addPlace (formAction · entries · sheetCsv)
   app.js가 AddPlace.buttonHTML(sec)로 버튼을 그리고, AddPlace.load()로 승인된 장소를 받아 목록에 더해요.
   ============================================================= */
(function () {
  "use strict";
  var CFG = (window.SITE && window.SITE.addPlace) || { entries: {} };
  var P = window.PLACES || {};
  var SECS = {
    hidden: { label: "숨은장소", btn: "장소 추가", mapRequired: true, addrRequired: true },
    food: { label: "맛집", btn: "맛집 추가", mapRequired: true, addrRequired: true },
    tips: { label: "생활꿀팁", btn: "꿀팁 추가", mapRequired: false, addrRequired: false }
  };
  var CUSTOM = "__custom";   // 분류: 기타 (직접 쓰기)
  var AREAS = ["교내", "학교 주변 (대소원면)", "충주 시내·외곽"];
  var NAVER_RE = /https?:\/\/(?:naver\.me|(?:m\.)?map\.naver\.com|(?:m\.)?place\.map\.naver\.com|m\.place\.naver\.com|pcmap\.place\.naver\.com)\/[^\s"'<>]*/i;
  var ADDR_RE = /(시|군|구|읍|면)\s.*(로|길|리|동)\s*\d/;   // 예: 충북 충주시 대소원면 대학로 50

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(m) { if (window.Toast) window.Toast(m); }
  function ready() { return !!CFG.formAction; }
  function today() {
    var d = new Date(Date.now() + 9 * 3600e3); // 한국 시간
    return d.toISOString().slice(0, 10);
  }
  function uniq(a) { var s = {}; return a.filter(function (x) { if (!x || s[x]) return false; s[x] = 1; return true; }); }
  function norm(s) { return String(s || "").replace(/\s|\(.*?\)|점$/g, "").toLowerCase(); }

  /* ---------- ＋ 버튼 ---------- */
  function buttonHTML(sec) {
    if (!SECS[sec]) return "";
    return '<button type="button" class="add-btn" data-add="' + sec + '" aria-label="' + SECS[sec].label + ' 추가 신청">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>' + SECS[sec].btn + "</span></button>";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]");
    if (b) { e.preventDefault(); open(b.dataset.add); }
  });

  /* ---------- 신청 창 ---------- */
  var box = null, cur = null, lastFocus = null;
  function field(id, label, input, help, req) {
    return '<div class="ap-field" data-f="' + id + '"><label for="ap-' + id + '">' + label +
      (req ? ' <em class="ap-req">필수</em>' : ' <em class="ap-opt">선택</em>') + "</label>" + input +
      (help ? '<p class="ap-help">' + help + "</p>" : "") + '<p class="ap-err" role="alert"></p></div>';
  }
  function formHTML(sec) {
    var c = SECS[sec], data = P[sec] || [];
    var cats = uniq(data.map(function (d) { return d.category; }));
    var html =
      '<p class="modal-sec">' + c.label + " · 추가 신청</p><h2 id=\"apTitle\">" + c.label + "에 새로 추가하기</h2>" +
      '<p class="ap-lead">목록에 없는 ' + (sec === "tips" ? "꿀팁" : "곳") + "을 알려 주세요. 관리자가 확인한 뒤 목록에 올라가요.</p>" +
      (ready() ? "" : '<p class="ap-warn">⚠️ 지금은 신청을 받을 준비 중이에요. 써 볼 수는 있지만 아직 보내지지는 않아요.</p>') +
      '<form class="ap-form" id="apForm" novalidate>' +
        field("category", "분류", '<select class="select" id="ap-category"><option value="">골라 주세요</option>' +
          cats.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("") +
          '<option value="' + CUSTOM + '">기타 (직접 쓰기)</option></select>' +
          '<input id="ap-categoryCustom" type="text" maxlength="20" autocomplete="off" placeholder="분류를 직접 써 주세요 (예: 디저트 가게)" hidden>', "", true) +
        (sec === "food" ? field("subcategory", "세부 종류", '<select class="select" id="ap-subcategory" disabled><option value="">분류를 먼저 골라 주세요</option></select>', "", false) +
          field("area", "구역", '<select class="select" id="ap-area"><option value="">골라 주세요</option>' +
            AREAS.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("") + "</select>", "", true) : "") +
        field("name", "이름", '<input id="ap-name" type="text" maxlength="60" autocomplete="off" placeholder="' +
          (sec === "tips" ? "예: 종합강의관 1층 무인 프린터" : sec === "food" ? "예: 핵밥 교통대점 (네이버 지도에 나오는 이름)" : "예: 해오름관 뒤 벤치") + '">', "", true) +
        field("map", "네이버 지도 링크",
          '<div class="ap-row"><input id="ap-map" type="url" inputmode="url" autocomplete="off" placeholder="https://naver.me/…">' +
          '<a class="ap-find" id="apFind" href="https://map.naver.com" target="_blank" rel="noopener">네이버 지도 열기 ↗</a></div>',
          "네이버 지도에서 장소를 찾아 <b>공유 → 링크 복사</b>한 걸 붙여 넣어 주세요. 공유 글을 통째로 붙여 넣으면 주소도 자동으로 채워져요.", c.mapRequired) +
        field("address", "주소", '<input id="ap-address" type="text" maxlength="120" autocomplete="off" placeholder="예: 충북 충주시 대소원면 대학로 50">',
          "네이버 지도에 나오는 주소를 그대로 써 주세요.", c.addrRequired) +
        (sec !== "food" ? field("detail", "자세한 위치", '<input id="ap-detail" type="text" maxlength="80" autocomplete="off" placeholder="예: 해오름관 4층 엘리베이터 옆">', "건물·층·방향처럼 주소만으로 찾기 어려운 부분", false) : "") +
        field("checkedAt", "확인한 날", '<input id="ap-checkedAt" type="date" value="' + today() + '" max="' + today() + '">', "마지막으로 직접 가 보거나 확인한 날", true) +
        (sec === "food" ? '<div class="ap-two">' +
          field("menu", "대표메뉴", '<input id="ap-menu" type="text" maxlength="60" autocomplete="off" placeholder="예: 스테이크 덮밥">', "", false) +
          field("price", "가격", '<input id="ap-price" type="text" maxlength="40" autocomplete="off" placeholder="예: 1인 9,000원">', "", false) +
          "</div>" : "") +
        field("note", "메모", '<textarea id="ap-note" rows="4" maxlength="500" placeholder="' +
          (sec === "food" ? "예: 혼밥 가능, 점심엔 줄 있음, 영업시간 11:00~21:00" : sec === "tips" ? "예: 학생증 찍고 1장 50원, 컬러 가능" : "예: 오후엔 사람 거의 없음, 노을 잘 보임") + '"></textarea>' +
          '<p class="ap-count"><span id="apCount">0</span>/500</p>', "다른 학생들이 알면 좋은 점을 자유롭게 적어 주세요.", false) +
        '<input type="text" name="website" id="ap-website" class="ap-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<div class="ap-foot"><button type="button" class="text-btn" data-close>취소</button>' +
          '<button type="submit" class="pill-btn" id="apSubmit">신청하기</button></div>' +
      "</form>";
    return html;
  }
  function open(sec) {
    if (!SECS[sec]) return;
    cur = sec; lastFocus = document.activeElement;
    if (!box) {
      box = document.createElement("div");
      box.className = "modal ap-modal"; box.hidden = true;
      box.innerHTML = '<div class="modal-back" data-close></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="apTitle">' +
        '<button type="button" class="modal-x" data-close aria-label="닫기">×</button><div id="apBody"></div></div>';
      document.body.appendChild(box);
      box.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
      box.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }
    box.querySelector("#apBody").innerHTML = formHTML(sec);
    box.hidden = false; document.body.classList.add("no-scroll");
    bindForm();
    setTimeout(function () { var f = box.querySelector("#ap-category"); if (f) f.focus(); }, 30);
  }
  window.addEventListener("hashchange", function () { if (box && !box.hidden) close(); });
  function close() {
    if (!box) return;
    box.hidden = true; document.body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) lastFocus.focus();
  }
  function $(id) { return box.querySelector("#ap-" + id); }
  function val(id) {
    if (id === "category" && $("category") && $("category").value === CUSTOM) return $("categoryCustom").value.trim();
    var e = $(id); return e ? e.value.trim() : "";
  }
  function setErr(id, msg) {
    var f = box.querySelector('[data-f="' + id + '"]');
    if (!f) return;
    f.classList.toggle("is-err", !!msg);
    f.querySelector(".ap-err").textContent = msg || "";
  }
  // 네이버 지도 '공유' 글: [네이버 지도]\n이름\n주소\nhttps://naver.me/…
  function fromShareText(text) {
    var url = (text.match(NAVER_RE) || [])[0] || "";
    var lines = text.split(/\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    var addr = lines.filter(function (l) { return !NAVER_RE.test(l) && ADDR_RE.test(l); })[0] || "";
    var name = "";
    if (/^\[?네이버\s?지도\]?$/.test(lines[0] || "") && lines[1] && lines[1] !== addr && !NAVER_RE.test(lines[1])) name = lines[1];
    return { url: url, addr: addr, name: name };
  }
  function bindForm() {
    var sec = cur, form = box.querySelector("#apForm");
    var cat = $("category"), sub = $("subcategory"), custom = $("categoryCustom");
    cat.addEventListener("change", function () {
      custom.hidden = cat.value !== CUSTOM;
      if (!custom.hidden) custom.focus();
    });
    custom.addEventListener("input", function () { setErr("category", ""); });
    if (sub) cat.addEventListener("change", function () {
      var subs = uniq((P.food || []).filter(function (d) { return d.category === cat.value; }).map(function (d) { return d.subcategory; }));
      sub.innerHTML = subs.length ? '<option value="">골라 주세요</option>' + subs.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("")
        : '<option value="">' + (cat.value ? "세부 종류 없음" : "분류를 먼저 골라 주세요") + "</option>";
      sub.disabled = !subs.length;
    });
    // 이름을 쓰면 '네이버 지도 열기'가 그 이름으로 검색돼요
    var find = box.querySelector("#apFind");
    $("name").addEventListener("input", function () {
      var q = val("name");
      find.href = q ? "https://map.naver.com/p/search/" + encodeURIComponent(q + " 충주") : "https://map.naver.com";
      setErr("name", "");
    });
    $("name").addEventListener("blur", function () {
      var n = norm(val("name"));
      var dup = n && (P[sec] || []).filter(function (d) { return norm(d.name) === n; })[0];
      var f = box.querySelector('[data-f="name"] .ap-err');
      if (dup && !f.textContent) { f.textContent = "‘" + dup.name + "’은(는) 이미 목록에 있어요. 다른 곳이면 그대로 신청해도 돼요."; f.classList.add("is-soft"); }
    });
    $("map").addEventListener("paste", function (e) {
      var text = (e.clipboardData || window.clipboardData).getData("text");
      if (!text || !/\n/.test(text) && !/네이버/.test(text)) return;
      var s = fromShareText(text);
      if (!s.url) return;
      e.preventDefault();
      $("map").value = s.url;
      if (s.addr && !val("address")) $("address").value = s.addr;
      if (s.name && !val("name")) $("name").value = s.name;
      setErr("map", ""); setErr("address", "");
      toast(s.addr ? "지도 링크와 주소를 채웠어요." : "지도 링크를 채웠어요.");
    });
    ["category", "area", "map", "address", "checkedAt"].forEach(function (id) {
      var e = $(id); if (e) e.addEventListener("input", function () { setErr(id, ""); });
      if (e) e.addEventListener("change", function () { setErr(id, ""); });
    });
    var note = $("note");
    note.addEventListener("input", function () { box.querySelector("#apCount").textContent = note.value.length; });
    form.addEventListener("submit", function (e) { e.preventDefault(); submit(); });
  }
  function validate() {
    var c = SECS[cur], ok = true, first = null;
    function bad(id, msg) { setErr(id, msg); ok = false; if (!first) first = id; }
    if (!val("category")) bad("category", $("category").value === CUSTOM ? "분류를 직접 써 주세요." : "분류를 골라 주세요.");
    if (cur === "food" && !val("area")) bad("area", "구역을 골라 주세요.");
    if (val("name").length < 2) bad("name", "이름을 2자 이상 써 주세요.");
    var m = val("map");
    if (m) {
      var u = (m.match(NAVER_RE) || [])[0];
      if (!u) bad("map", "네이버 지도 링크(naver.me 또는 map.naver.com)를 붙여 넣어 주세요.");
      else $("map").value = u;
    } else if (c.mapRequired) bad("map", "네이버 지도 링크를 붙여 넣어 주세요.");
    var a = val("address");
    if (a) { if (!ADDR_RE.test(a)) bad("address", "네이버 지도에 나오는 주소처럼 써 주세요. (예: 충북 충주시 대소원면 대학로 50)"); }
    else if (c.addrRequired) bad("address", "주소를 써 주세요.");
    var d = val("checkedAt");
    if (!d) bad("checkedAt", "확인한 날을 골라 주세요.");
    else if (d > today()) bad("checkedAt", "오늘 이후 날짜는 고를 수 없어요.");
    if (!ok && first) { var el = $(first); if (el) { el.focus(); el.scrollIntoView({ block: "center", behavior: "smooth" }); } }
    return ok;
  }
  function submit() {
    if (!validate()) return;
    var btn = box.querySelector("#apSubmit");
    if ($("website").value) return done(); // 자동 입력 프로그램(스팸)은 조용히 무시
    if (!ready()) { toast("아직 신청을 받을 준비 중이에요. 조금만 기다려 주세요!"); return; }
    var last = 0; try { last = +localStorage.getItem("ap-last") || 0; } catch (e) {}
    if (Date.now() - last < 20000) { toast("조금 전에 신청했어요. 잠시 후 다시 해 주세요."); return; }
    var E = CFG.entries || {}, body = new URLSearchParams();
    var vals = {
      section: SECS[cur].label, category: val("category"), subcategory: val("subcategory"), name: val("name"),
      address: val("address"), detail: val("detail"), map: val("map"), checkedAt: val("checkedAt"),
      area: val("area"), menu: val("menu"), price: val("price"), note: val("note")
    };
    Object.keys(vals).forEach(function (k) { if (E[k] && vals[k]) body.append(E[k], vals[k]); });
    btn.disabled = true; btn.textContent = "보내는 중…";
    fetch(CFG.formAction, { method: "POST", mode: "no-cors", body: body })
      .then(function () { try { localStorage.setItem("ap-last", String(Date.now())); } catch (e) {} done(); })
      .catch(function () { btn.disabled = false; btn.textContent = "신청하기"; toast("보내지 못했어요. 인터넷 연결을 확인해 주세요."); });
  }
  function done() {
    box.querySelector("#apBody").innerHTML =
      '<div class="ap-done"><div class="ap-done-ic" aria-hidden="true">🙌</div><h2 id="apTitle">신청했어요!</h2>' +
      "<p>관리자가 확인한 뒤 " + SECS[cur].label + " 목록에 올라가요.<br>알려 줘서 고마워요.</p>" +
      '<button type="button" class="pill-btn" data-close>확인</button></div>';
    box.querySelector(".ap-done .pill-btn").focus();
  }

  /* ---------- 승인된 장소 읽기 (구글 시트 CSV) ---------- */
  function parseCSV(text) {
    var rows = [], row = [], f = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(f); f = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(f); rows.push(row); row = []; f = "";
      } else f += ch;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  // 시트 맨 윗줄(질문 제목)으로 열을 찾아요. 순서가 바뀌어도 괜찮아요.
  var COLS = [
    ["time", /^(타임스탬프|timestamp)/i], ["section", /^(게시판|섹션)/], ["subcategory", /세부/], ["category", /^분류/],
    ["name", /^이름/], ["address", /^주소/], ["detail", /^자세한/], ["map", /지도/], ["checkedAt", /^확인/],
    ["area", /^구역/], ["menu", /^대표/], ["price", /^가격/], ["note", /^(메모|추가|설명)/],
    ["approve", /^승인/], ["lat", /^위도/], ["lng", /^경도/]
  ];
  var SEC_BY_LABEL = { "숨은장소": "hidden", "맛집": "food", "생활꿀팁": "tips", hidden: "hidden", food: "food", tips: "tips" };
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }
  function toItems(rows) {
    var head = rows[0] || [], idx = {};
    head.forEach(function (h, i) {
      h = String(h).trim();
      for (var k = 0; k < COLS.length; k++) if (idx[COLS[k][0]] == null && COLS[k][1].test(h)) { idx[COLS[k][0]] = i; break; }
    });
    var out = { hidden: [], food: [], tips: [] };
    rows.slice(1).forEach(function (r) {
      function g(k) { return idx[k] == null ? "" : String(r[idx[k]] || "").trim(); }
      if (!/^(o|ㅇ|○|◯|승인|yes|y|true|v|✓|✔)$/i.test(g("approve"))) return;
      var sec = SEC_BY_LABEL[g("section")], name = g("name");
      if (!sec || !name) return;
      var loc = [g("address"), g("detail") ? "(" + g("detail") + ")" : ""].filter(Boolean).join(" ");
      var note = [g("menu") ? "대표메뉴: " + g("menu") : "", g("note")].filter(Boolean).join("\n");
      var it = {
        id: sec + "-u" + hash(g("time") + "|" + name), category: g("category") || "기타", subcategory: g("subcategory"),
        name: name, area: g("area"), location: loc, map: g("map") ? [g("map")] : [], checkedAt: g("checkedAt").replace(/\./g, "-").replace(/\s/g, ""),
        price: g("price"), recommend: 1, note: note, userAdded: true
      };
      var lat = parseFloat(g("lat")), lng = parseFloat(g("lng"));
      if (isFinite(lat) && isFinite(lng)) { it.lat = lat; it.lng = lng; }
      out[sec].push(it);
    });
    return out;
  }
  function load() {
    if (!CFG.sheetCsv || !window.fetch) return Promise.resolve(null);
    return fetch(CFG.sheetCsv, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { return toItems(parseCSV(t)); })
      .catch(function () { return null; });
  }

  window.AddPlace = { buttonHTML: buttonHTML, open: open, load: load, sections: Object.keys(SECS), _toItems: toItems, _parseCSV: parseCSV };
})();
