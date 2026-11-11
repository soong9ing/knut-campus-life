/* =============================================================
   맛집 지도 화면 (#food)
   - 가게 정보: 주희님 사이트(캠퍼스.zip) → data/foodmap.js (tools/build_foodmap.py로 만듦)
     핀을 누르면 수경님 데이터(data/places.js)의 자세한 정보(메모·영업 중·저장·후기)를 보여 줘요.
   - 지도: OpenStreetMap + Leaflet (무료, 키 필요 없음) — 성림님 사이트(knut-guide) 지도 화면을 옮겨 옴
   - 핀 모양: 음식점 / 카페 / 술집을 아이콘과 색으로 구별
   - 아래 탭: 지도 · 메뉴(음식 종류로 찾기) · 뭐 먹지(조건 고르고 한 곳 뽑기)
   app.js가 '맛집' 화면을 그릴 때 FoodMap.html()과 FoodMap.bind()를 불러요.
   ============================================================= */
(function () {
  "use strict";
  var D = window.FOODMAP || { places: [] };
  var CAMPUS = [36.9699969, 127.8726008]; // 대학본부 (학생식당)
  var data = D.places.map(function (p, i) { p.id = i; return p; });

  // 핀 종류: 색과 아이콘
  var TYPES = {
    food: { label: "음식점", color: "#e0623a",
      icon: '<path d="M8 3v7M5.5 3v4.5a2.5 2.5 0 0 0 5 0V3M8 10v11M17.5 3c-2.2 1.8-3.3 4.6-3.3 8h3.3v10"/>' },
    cafe: { label: "카페", color: "#8a5a3b",
      icon: '<path d="M4.5 10h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M15.5 11.5h1.3a2.6 2.6 0 0 1 0 5.2h-1.6"/><path d="M8 3.5c-.8 1 .8 2 0 3M11.5 3.5c-.8 1 .8 2 0 3"/>' },
    bar: { label: "술집", color: "#6a4bb5",
      icon: '<path d="M5.5 8.5h9V19a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2z"/><path d="M14.5 11h2a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-2"/><path d="M5.5 8.5a2.3 2.3 0 0 1 2.2-3 2.8 2.8 0 0 1 4.6 0 2.3 2.3 0 0 1 2.2 3"/><path d="M8.5 12v5.5M11.5 12v5.5"/>' }
  };
  var ZONES = [["all", "전체"], ["대학로", "대학로"], ["교내", "교내"], ["대소원(기타)", "대소원"], ["충주 시내", "시내"], ["충주 외곽(읍·면)", "외곽"]];
  var KIND_EMOJI = { "학식": "🍱", "한식": "🍚","고기·구이": "🥩", "중식": "🥢", "일식": "🍣", "양식": "🍝", "분식": "🍢", "간편식": "🌯",
    "아시안": "🍜", "치킨": "🍗", "카페·디저트": "☕", "술집": "🍺" };
  var KINDS = Object.keys(KIND_EMOJI).filter(function (k) { return data.some(function (p) { return p.kind === k; }); });
  var PANELS = ["fmList", "fmDetail", "fmMenu", "fmRoulette"];

  // 화면을 다시 그려도 기억하는 값
  var st = { type: "all", zone: "all", kind: "all", solo: false, q: "", panel: null, selected: null };
  var map = null, layer = null, markers = {}, me = null, meMarker = null, meCircle = null, watchId = null, firstFix = false;
  var root = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(m) { if (window.Toast) window.Toast(m); }
  function $(sel) { return root.querySelector(sel); }
  function won(n) { return n.toLocaleString("ko-KR") + "원"; }
  function svgIcon(t, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (TYPES[t] || TYPES.food).icon + "</svg>";
  }

  /* ---------- 핀 ---------- */
  // 같은 건물에 있는 가게는 핀이 겹치므로 둘레에 조금씩 벌려 놓는다
  (function spread() {
    var groups = {};
    data.forEach(function (p) {
      if (p.lat == null) return;
      var k = p.lat.toFixed(5) + "," + p.lng.toFixed(5);
      (groups[k] = groups[k] || []).push(p);
    });
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      g.forEach(function (p, i) {
        var a = (2 * Math.PI * i) / g.length, r = g.length > 1 ? 0.00008 : 0;
        p.pos = [p.lat + r * Math.sin(a), p.lng + r * Math.cos(a) * 1.25];
      });
    });
  })();

  function pinIcon(p, sel) {
    var t = TYPES[p.type] || TYPES.food, w = sel ? 42 : 34, h = Math.round(w * 1.25);
    return L.divIcon({
      className: "", iconSize: [w, h], iconAnchor: [w / 2, h - 1],
      html: '<div class="fm-pin' + (sel ? " is-sel" : "") + '" style="--pin:' + t.color + '">' +
        '<svg class="fm-pin-shape" viewBox="0 0 40 50" aria-hidden="true"><path d="M20 49s17-17.3 17-29A17 17 0 0 0 3 20c0 11.7 17 29 17 29z"/></svg>' +
        '<span class="fm-pin-ico">' + svgIcon(p.type, sel ? 20 : 16) + "</span></div>"
    });
  }

  /* ---------- 거리 ---------- */
  function distance(p) { return me && p.pos ? map.distance(me, p.pos) : null; }
  function distText(m) {
    if (m == null) return "";
    var walk = Math.max(1, Math.round(m / 67)); // 걷는 속도 약 4km/h
    return (m < 1000 ? Math.round(m / 10) * 10 + "m" : (m / 1000).toFixed(1) + "km") + (m < 3000 ? " · 걸어서 약 " + walk + "분" : "");
  }

  /* ---------- 걸러 보기 ---------- */
  function visible() {
    var q = st.q.trim().toLowerCase();
    return data.filter(function (p) {
      if (st.type !== "all" && p.type !== st.type) return false;
      if (st.zone !== "all" && p.zone !== st.zone) return false;
      if (st.kind !== "all" && p.kind !== st.kind) return false;
      if (st.solo && p.solo !== "O") return false;
      if (!q) return true;
      return [p.name, p.kind, p.desc, p.tags, p.address, p.where].join(" ").toLowerCase().indexOf(q) > -1;
    }).sort(function (a, b) {
      if (me) {
        var da = distance(a), db = distance(b);
        if (da == null || db == null) return (da == null) - (db == null) || b.rec - a.rec;
        return da - db;
      }
      return b.rec - a.rec || a.name.localeCompare(b.name, "ko");
    });
  }

  /* ---------- 화면 틀 ---------- */
  function chip(key, val, label, cur, extra) {
    return '<button type="button" class="chip' + (extra || "") + '" data-fm="' + key + '" data-val="' + esc(val) + '" aria-pressed="' + (String(cur) === String(val)) + '">' + label + "</button>";
  }
  var TAB_ICON = {
    map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3M7 10v11M17 3c-2.2 1.8-3.3 4.6-3.3 8H17v10"/></svg>',
    // 뭐 먹지: 주사위
    roulette: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" stroke="none"/></svg>'
  };
  function html() {
    var count = function (t) { return data.filter(function (p) { return t === "all" || p.type === t; }).length; };
    return '<section class="fm" id="fm" aria-label="맛집 지도">' +
      '<div class="fm-map" id="fmMap"></div>' +
      '<div class="fm-top" id="fmTop">' +
        '<div class="fm-search-row">' +
          '<label class="fm-search">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20"/></svg>' +
            '<span class="sr-only">가게 이름, 메뉴로 찾기</span>' +
            '<input id="fmQ" type="search" placeholder="가게 이름, 메뉴로 찾기" autocomplete="off" value="' + esc(st.q) + '">' +
          "</label>" +
        "</div>" +
        '<div class="fm-chips" role="group" aria-label="가게 종류">' +
          '<button type="button" class="chip fm-kind-chip" id="fmKindChip" hidden></button>' +
          chip("type", "all", "전체 <small>" + count("all") + "</small>", st.type) +
          ["food", "cafe", "bar"].map(function (t) {
            return chip("type", t, '<span class="fm-dot" style="--pin:' + TYPES[t].color + '">' + svgIcon(t, 13) + "</span>" + TYPES[t].label + " <small>" + count(t) + "</small>", st.type, " fm-chip-type");
          }).join("") +
          '<span class="fm-sep" aria-hidden="true"></span>' +
          '<button type="button" class="chip" data-fm="solo" data-val="toggle" aria-pressed="' + st.solo + '">혼밥 OK</button>' +
        "</div>" +
        '<div class="fm-chips fm-zones" role="group" aria-label="구역">' +
          ZONES.map(function (z) { return chip("zone", z[0], z[1], st.zone); }).join("") +
        "</div>" +
      "</div>" +
      // 오른쪽 세로 버튼 (아래는 챗봇 자리)
      '<div class="fm-fabs">' +
        '<button type="button" class="fm-fab" id="fmLocate" aria-label="내 위치 보기">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/></svg>내 위치</button>' +
        '<button type="button" class="fm-fab" id="fmCampus">학교 주변</button>' +
        '<button type="button" class="fm-fab" id="fmAll">전체 보기</button>' +
        '<button type="button" class="fm-fab fm-fab--main" id="fmListBtn">목록 <b id="fmCount"></b></button>' +
      "</div>" +
      // 목록
      '<aside class="fm-sheet" id="fmList" hidden aria-label="맛집 목록">' +
        '<div class="fm-grab" aria-hidden="true"></div>' +
        '<div class="fm-sheet-head"><strong>맛집 목록</strong><span id="fmSummary"></span><button type="button" class="fm-x" data-fm-close aria-label="닫기">✕</button></div>' +
        '<ol class="fm-list" id="fmItems"></ol>' +
      "</aside>" +
      // 가게 정보
      '<aside class="fm-sheet" id="fmDetail" hidden aria-label="가게 정보"></aside>' +
      // 메뉴로 찾기
      '<aside class="fm-sheet" id="fmMenu" hidden aria-label="메뉴로 찾기">' +
        '<div class="fm-grab" aria-hidden="true"></div>' +
        '<div class="fm-sheet-head"><strong>메뉴로 찾기</strong><span>먹고 싶은 종류를 골라 보세요</span><button type="button" class="fm-x" data-fm-close aria-label="닫기">✕</button></div>' +
        '<div class="fm-food-grid" id="fmFoodGrid"></div>' +
      "</aside>" +
      // 오늘 뭐 먹지? (조건 고르고 뽑기)
      '<aside class="fm-sheet" id="fmRoulette" hidden aria-label="오늘 뭐 먹지">' +
        '<div class="fm-grab" aria-hidden="true"></div>' +
        '<div class="fm-sheet-head"><strong>오늘 뭐 먹지? 🎲</strong><span></span><button type="button" class="fm-x" data-fm-close aria-label="닫기">✕</button></div>' +
        '<div class="fm-pick">' +
          '<div class="fm-pick-group"><b>종류</b><div class="fm-chips fm-wrap" id="fmPKinds"></div></div>' +
          '<div class="fm-pick-group"><b>위치</b><div class="fm-chips fm-wrap" id="fmPZones"></div></div>' +
          '<div class="fm-pick-group"><b>조건</b><div class="fm-chips fm-wrap" id="fmPConds"></div></div>' +
          '<div id="fmPResult" aria-live="polite"></div>' +
          '<div class="fm-pick-foot"><span id="fmPCount"></span><button type="button" class="fm-btn fm-btn--main fm-pick-go" id="fmPGo">뽑기</button></div>' +
        "</div>" +
      "</aside>" +
      // 아래 탭
      '<nav class="fm-tabbar" aria-label="맛집 메뉴">' +
        '<button type="button" class="fm-tab" data-fm-tab="map">' + TAB_ICON.map + "지도</button>" +
        '<button type="button" class="fm-tab" data-fm-tab="menu">' + TAB_ICON.menu + "메뉴</button>" +
        '<button type="button" class="fm-tab" data-fm-tab="roulette">' + TAB_ICON.roulette + "뭐 먹지</button>" +
      "</nav>" +
    "</section>";
  }

  /* ---------- 그리기 ---------- */
  function draw() {
    var list = visible();
    layer.clearLayers();
    markers = {};
    list.forEach(function (p) {
      if (!p.pos) return;
      var sel = st.selected === p.id;
      markers[p.id] = L.marker(p.pos, { icon: pinIcon(p, sel), riseOnHover: true, title: p.name, zIndexOffset: sel ? 1000 : 0 })
        .bindTooltip(esc(p.name), { direction: "top", offset: [0, -38], className: "fm-tip" })
        .on("click", function (e) { L.DomEvent.stopPropagation(e); openDetail(p.id, false); })
        .addTo(layer);
    });
    var onMap = list.filter(function (p) { return p.pos; }).length;
    $("#fmCount").textContent = list.length;
    $("#fmSummary").textContent = list.length + "곳 · " + (me ? "가까운 순" : "추천 많은 순") + (onMap < list.length ? " · 지도에 없는 곳 " + (list.length - onMap) : "");
    $("#fmItems").innerHTML = list.length ? list.map(function (p) {
      var t = TYPES[p.type] || TYPES.food;
      return '<li><button type="button" data-fm-id="' + p.id + '">' +
        '<span class="fm-dot fm-dot--lg" style="--pin:' + t.color + '">' + svgIcon(p.type, 15) + "</span>" +
        '<span class="fm-li-body"><span class="fm-li-name">' + esc(p.name) + "</span>" +
        '<span class="fm-li-sub">' + esc(p.kind || t.label) + (p.zone ? " · " + esc(p.zone.replace(/\(.*\)/, "")) : "") +
          (typeof p.price === "number" ? " · " + won(p.price) + "~" : "") +
          (me && p.pos ? ' · <b class="fm-dist">' + distText(distance(p)).split(" · ")[0] + "</b>" : "") + "</span>" +
        (p.pos ? "" : '<span class="fm-nomap">지도 위치 정보 없음</span>') + "</span>" +
        '<span class="fm-rec">추천 ' + p.rec + "</span></button></li>";
    }).join("") : '<li class="fm-empty">조건에 맞는 가게가 없어요. 필터를 바꿔 보세요.</li>';
    var kc = $("#fmKindChip");
    kc.hidden = st.kind === "all";
    kc.textContent = st.kind === "all" ? "" : (KIND_EMOJI[st.kind] || "") + " " + st.kind + " ✕";
  }

  function panel(id) { // 아래(옆) 창은 한 번에 하나만
    PANELS.forEach(function (x) { $("#" + x).hidden = x !== id; });
    st.panel = id;
    document.body.classList.toggle("fm-sheet-open", !!id);
    $("#fmListBtn").classList.toggle("is-on", id === "fmList");
    var tab = id === "fmMenu" ? "menu" : id === "fmRoulette" ? "roulette" : "map";
    root.querySelectorAll("[data-fm-tab]").forEach(function (b) { b.classList.toggle("on", b.dataset.fmTab === tab); });
  }

  /* ---------- 가게 정보 ---------- */
  function openDetail(id, fly) {
    var p = data[id], t = TYPES[p.type] || TYPES.food;
    var prev = st.selected;
    st.selected = id;
    if (prev != null && markers[prev]) markers[prev].setIcon(pinIcon(data[prev], false)).setZIndexOffset(0);
    $("#fmDetail").innerHTML = detailHTML(p, t);
    $("#fmDetail").scrollTop = 0;
    panel("fmDetail");
    if (markers[id]) {
      markers[id].setIcon(pinIcon(p, true)).setZIndexOffset(1000);
      // 정보 창에 핀이 가리지 않게: 넓은 화면은 핀을 오른쪽에, 휴대폰은 위쪽 빈 곳에 둔다
      var z = fly ? Math.max(map.getZoom(), 17) : map.getZoom();
      var fm = $("#fm"), wide = fm.clientWidth >= 760;
      var shift = wide ? [-200, 0] : [0, ($("#fmDetail").offsetHeight - (fm.clientHeight - topH() - 60)) / 2 + 20];
      map.flyTo(map.unproject(map.project(p.pos, z).add(shift), z), z, { duration: 0.5 });
    }
  }

  // 수경님 맛집 목록(window.PLACES.food)에서 같은 가게 찾기
  // (수경님 데이터에 없던 가게도 data/foodmap.js가 목록에 더해 둬서 모두 찾아져요)
  function skItem(p) {
    if (!p.skId || !window.PLACES) return null;
    var list = window.PLACES.food || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === p.skId) return list[i];
    return null;
  }
  function linkify(s) {
    return esc(s).replace(/https?:\/\/[^\s<)]+/g, function (u) {
      return '<a href="' + u + '" target="_blank" rel="noopener">' + (u.length > 40 ? u.slice(0, 37) + "…" : u) + "</a>";
    });
  }
  // 모든 가게가 똑같은 모양·버튼: [지도에서 보기][전화하기] / [저장][후기 쓰기][주소 복사]
  function detailHTML(p, t) {
    var F = window.Features, Soc = window.Social, it = skItem(p) || {};
    var url = (it.map && it.map[0]) || p.link;
    var tel = ((it.note || "").match(/0\d{1,2}-\d{3,4}-\d{4}/) || [])[0];
    var addr = p.address || it.location;
    var rv = it.id && Soc && Soc.stats ? Soc.stats(it.id) : null;
    var rows = [
      ["분류", [it.category || t.label, it.subcategory || p.kind].filter(function (x) { return x && x !== "-"; }).join(" · ")],
      ["위치", it.location || addr],
      ["가격", it.price || (typeof p.price === "number" ? "1인 " + won(p.price) + "부터" : "")],
      ["내 위치에서", me && p.pos ? distText(distance(p)) + " (직선거리)" : ""],
      ["확인한 날", it.checkedAt || p.date]
    ].filter(function (r) { return r[1]; });
    var notes = (it.note || "").split("\n").filter(function (l) { return l.trim(); });
    if (!notes.length && p.desc && p.desc !== "-") notes = [p.desc];
    var off = function (label) { return '<span class="fm-btn is-off">' + label + "</span>"; };
    return '<div class="fm-grab" aria-hidden="true"></div>' +
      '<div class="fm-sheet-head"><span class="fm-dot fm-dot--lg" style="--pin:' + t.color + '">' + svgIcon(p.type, 15) + "</span>" +
        "<h2>" + esc(p.name) + '</h2><button type="button" class="fm-x" data-fm-close aria-label="닫기">✕</button></div>' +
      '<div class="fm-badges">' +
        '<span class="fm-badge fm-badge--soft">👍 ' + (it.recommend || p.rec || 1) + "명 추천</span>" +
        (F && it.id ? F.openBadgeHTML(it) : "") +
        (it.area ? '<span class="fm-badge fm-badge--gray">' + esc(it.area) + "</span>" : "") +
        (p.solo === "O" ? '<span class="fm-badge fm-badge--green">혼밥 OK</span>' : "") +
        (rv && rv.n ? '<span class="fm-badge fm-badge--star">★ ' + rv.avg.toFixed(1) + " · 후기 " + rv.n + "</span>" : "") +
      "</div>" +
      '<dl class="fm-rows">' + rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
      (notes.length ? '<div class="fm-memo"><b>선배들의 메모</b><ul>' + notes.map(function (l) { return "<li>" + linkify(l) + "</li>"; }).join("") + "</ul></div>" : "") +
      '<div class="fm-actions">' +
        (url ? '<a class="fm-btn fm-btn--main" href="' + esc(url) + '" target="_blank" rel="noopener">🗺 ' + (/kakao/.test(url) ? "카카오맵" : "네이버 지도") + "에서 보기</a>" : off("🗺 지도 링크 없음")) +
        (tel ? '<a class="fm-btn" href="tel:' + tel.replace(/-/g, "") + '">📞 전화하기</a>' : off("📞 번호 없음")) +
      "</div>" +
      '<div class="fm-actions fm-actions--sub">' +
        (F && it.id ? F.favButtonHTML(it.id) : off("☆ 저장")) +
        (window.openPlaceModal && it.id ? '<button type="button" class="fm-btn" data-fm-review="' + esc(it.id) + '">✏️ 후기 작성</button>' : off("✏️ 후기 작성")) +
        (addr ? '<button type="button" class="fm-btn" data-fm-copy="' + esc(addr) + '">📋 주소 복사</button>' : off("📋 주소 없음")) +
      "</div>" +
      '<p class="fm-note">' +
        (p.coordSource.indexOf("같은 건물") === 0 ? "📍 핀은 같은 건물에 있는 다른 가게 위치에 찍었어요. 정확한 위치는 지도 링크로 확인하세요.<br>" : "") +
        (p.coordSource.indexOf("대략") > -1 ? "📍 핀은 주소의 길 위치로 찍은 대략적인 위치예요. 정확한 위치는 지도 링크로 확인하세요.<br>" : "") +
        (!p.pos ? "📍 위치 정보가 없어 지도에 표시하지 못했어요.<br>" : "") +
        "학생들이 직접 모은 정보예요. 영업시간·가격은 바뀔 수 있으니 방문 전에 확인하세요.</p>";
  }
  function closeDetail() {
    if (st.selected != null && markers[st.selected]) markers[st.selected].setIcon(pinIcon(data[st.selected], false)).setZIndexOffset(0);
    st.selected = null;
    if (st.panel === "fmDetail") panel(null);
  }
  // 보이는 핀에 맞춰 지도 옮기기. 구역이 '전체'면 멀리 떨어진 외곽(읍·면) 가게는 빼고 맞춰서
  // 지도가 충주 전체로 너무 넓어지지 않게 해요. (외곽 가게는 '외곽' 구역을 누르면 모아 보여요)
  function fitVisible(animate) {
    var list = visible().filter(function (p) { return p.pos; });
    if (st.zone === "all") {
      var core = list.filter(function (p) { return p.zone !== "충주 외곽(읍·면)"; });
      if (core.length) list = core;
    }
    var pts = list.map(function (p) { return p.pos; });
    if (!pts.length) return;
    var b = L.latLngBounds(pts), opt = { paddingTopLeft: [30, topH() + 30], paddingBottomRight: [130, 90], maxZoom: 17 };
    if (animate) map.flyToBounds(b, Object.assign({ duration: 0.5 }, opt)); else map.fitBounds(b, opt);
  }

  // 학교 주변(대학로 가게들)을 보여 주는 기본 화면. 구역 '전체'를 누를 때도 여기로 돌아와요.
  function campusView(animate) {
    var near = data.filter(function (p) { return p.zone === "대학로" && p.pos; }).map(function (p) { return p.pos; });
    if (!near.length) { map.setView(CAMPUS, 16); return; }
    var b = L.latLngBounds(near), pad = L.point(150, topH() + 100);
    var z = Math.min(16, map.getBoundsZoom(b, false, pad) - 1); // 한 단계 넓게 (교내·대소원 쪽도 함께 보이게)
    if (animate) map.flyTo(b.getCenter(), z, { duration: 0.5 }); else map.setView(b.getCenter(), z);
  }

  // 가게 종류·혼밥·메뉴 종류를 바꿀 때: 지금 보는 화면에 맞는 핀이 하나도 없을 때만 지도를 옮긴다
  function fitIfNoneShown() {
    var b = map.getBounds();
    var shown = visible().some(function (p) { return p.pos && b.contains(p.pos); });
    if (!shown) fitVisible(true);
  }

  /* ---------- 메뉴로 찾기 ---------- */
  function renderFoodGrid() {
    $("#fmFoodGrid").innerHTML = KINDS.map(function (k) {
      var n = data.filter(function (p) { return p.kind === k; }).length;
      return '<button type="button" class="fm-food-btn' + (st.kind === k ? " on" : "") + '" data-fm-kind="' + esc(k) + '">' +
        '<span class="e">' + KIND_EMOJI[k] + '</span><span class="n">' + esc(k) + '</span><span class="c">' + n + "곳</span></button>";
    }).join("");
  }
  function setKind(k, openList) {
    st.kind = k;
    if (k !== "all" && st.type !== "all") { // 종류를 고르면 음식점/카페/술집 필터는 풀어서 결과가 0이 되지 않게
      st.type = "all";
      root.querySelectorAll('[data-fm="type"]').forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.val === "all")); });
    }
    closeDetail(); draw();
    if (k !== "all") fitIfNoneShown();
    if (openList && k !== "all") panel("fmList"); else if (st.panel === "fmMenu") renderFoodGrid();
  }

  /* ---------- 오늘 뭐 먹지? (조건 고르고 한 곳 뽑기) ---------- */
  var pk = { kind: "all", zone: "대학로", solo: false, cheap: false, open: false, cur: null, rolling: false };
  var PK_CONDS = [["solo", "혼밥 가능"], ["cheap", "1만 원 이하"], ["open", "지금 영업 중 <small>(시간 정보 있는 곳)</small>"]];
  function isOpenNow(p) {
    var it = skItem(p), F = window.Features;
    if (!it || !F || !F.openStatus) return false;
    var s = F.openStatus(it);
    return !!s && (s.state === "open" || s.state === "soon");
  }
  function pickPool() {
    return data.filter(function (p) {
      return (pk.kind === "all" || p.kind === pk.kind) && (pk.zone === "all" || p.zone === pk.zone) &&
        (!pk.solo || p.solo === "O") && (!pk.cheap || (typeof p.price === "number" && p.price <= 10000)) && (!pk.open || isOpenNow(p));
    });
  }
  function pkChip(key, val, label, on) {
    return '<button type="button" class="chip" data-fm-pk="' + key + '" data-val="' + esc(val) + '" aria-pressed="' + on + '">' + label + "</button>";
  }
  function renderPick() {
    $("#fmPKinds").innerHTML = ["all"].concat(KINDS).map(function (k) { return pkChip("kind", k, k === "all" ? "전체" : esc(k), pk.kind === k); }).join("");
    $("#fmPZones").innerHTML = ZONES.map(function (z) { return pkChip("zone", z[0], z[1], pk.zone === z[0]); }).join("");
    $("#fmPConds").innerHTML = PK_CONDS.map(function (c) { return pkChip(c[0], "toggle", c[1], pk[c[0]]); }).join("");
    var n = pickPool().length;
    $("#fmPCount").textContent = "후보 " + n + "곳";
    $("#fmPGo").disabled = !n || pk.rolling;
    if (!n) $("#fmPResult").innerHTML = '<p class="fm-pick-empty">조건에 맞는 곳이 없어요. 조건을 끄거나 위치를 넓혀 보세요.</p>';
    else if (pk.cur == null) $("#fmPResult").innerHTML = "";
  }
  function pickResultHTML(p) {
    return '<div class="fm-pick-res"><span class="muted">오늘은 여기 어때요?</span><div class="big">' + esc(p.name) + "</div>" +
      '<div class="muted">' + [p.kind && p.kind !== "-" ? esc(p.kind) : "", typeof p.price === "number" ? won(p.price) + "부터" : "", "👍 " + p.rec + "명 추천", p.solo === "O" ? "혼밥 OK" : ""].filter(Boolean).join(" · ") + "</div>" +
      '<div class="fm-actions"><button type="button" class="fm-btn fm-btn--main" data-fm-id="' + p.id + '">🗺 지도에서 보기</button>' +
      '<button type="button" class="fm-btn" id="fmPAgain">🔄 다시 뽑기</button></div></div>';
  }
  function pickOne() { // 이름이 잠깐 휙휙 바뀌다가 한 곳에서 멈춰요 (같은 곳이 연달아 나오지 않게)
    var pool = pickPool();
    if (!pool.length || pk.rolling) return;
    var next;
    do { next = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && pk.cur === next.id);
    pk.rolling = true; $("#fmPGo").disabled = true;
    var box = $("#fmPResult"), ticks = 0;
    var timer = setInterval(function () {
      var r = pool[Math.floor(Math.random() * pool.length)];
      box.innerHTML = '<div class="fm-pick-res is-rolling"><span class="muted">고르는 중…</span><div class="big">' + esc(r.name) + "</div></div>";
      if (++ticks >= 10) {
        clearInterval(timer);
        pk.rolling = false; pk.cur = next.id;
        if (!root || !root.querySelector("#fmPResult")) return;
        box.innerHTML = pickResultHTML(next);
        $("#fmPGo").disabled = false;
      }
    }, 80);
  }

  /* ---------- 지도 높이·여백 ---------- */
  function topH() { var t = root && root.querySelector("#fmTop"); return t ? t.offsetHeight + 12 : 140; }
  function fit() {
    var el = root && root.querySelector("#fm");
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY;
    el.style.height = Math.max(460, window.innerHeight - top) + "px";
    el.style.setProperty("--fm-top", topH() + 10 + "px"); // 패널이 검색창·필터 아래에서 시작
    if (map) map.invalidateSize();
  }

  /* ---------- 내 위치 (GPS) ---------- */
  function stopLocate() {
    if (watchId != null) navigator.geolocation.clearWatch(watchId);
    watchId = null; me = null;
    if (meMarker && map) { map.removeLayer(meMarker); map.removeLayer(meCircle); }
    meMarker = meCircle = null;
    if (root && root.querySelector("#fmLocate")) { $("#fmLocate").classList.remove("is-on"); draw(); }
  }
  function locate() {
    if (watchId != null) {
      if (me && !map.getBounds().contains(me)) { map.flyTo(me, 17, { duration: 0.5 }); return; }
      stopLocate(); toast("내 위치 표시를 껐어요."); return;
    }
    if (!navigator.geolocation) { toast("이 브라우저는 위치 기능을 지원하지 않아요."); return; }
    if (!window.isSecureContext) { toast("위치 기능은 https 주소에서만 쓸 수 있어요."); return; }
    $("#fmLocate").classList.add("is-on");
    toast("내 위치를 찾는 중이에요…");
    firstFix = true;
    watchId = navigator.geolocation.watchPosition(function (pos) {
      me = L.latLng(pos.coords.latitude, pos.coords.longitude);
      var acc = pos.coords.accuracy;
      if (!meMarker) {
        meCircle = L.circle(me, { radius: acc, color: "#1a73e8", weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
        meMarker = L.marker(me, { interactive: false, keyboard: false, zIndexOffset: 2000,
          icon: L.divIcon({ className: "", iconSize: [18, 18], iconAnchor: [9, 9], html: '<div class="fm-me"></div>' }) }).addTo(map);
      } else { meMarker.setLatLng(me); meCircle.setLatLng(me).setRadius(acc); }
      if (firstFix) {
        firstFix = false;
        map.flyTo(me, 17, { duration: 0.5 });
        toast(acc > 300 ? "위치 정확도가 낮아요(약 " + Math.round(acc) + "m). 실제 위치와 다를 수 있어요." : "목록이 가까운 순으로 바뀌었어요.");
      }
      draw();
      if (st.selected != null && st.panel === "fmDetail") $("#fmDetail").innerHTML = detailHTML(data[st.selected], TYPES[data[st.selected].type] || TYPES.food);
    }, function (err) {
      stopLocate();
      toast(err.code === 1 ? "위치 권한이 꺼져 있어요. 브라우저 설정에서 위치를 허용해 주세요." : "위치를 찾지 못했어요. 잠시 후 다시 눌러 주세요.");
    }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
  }

  /* ---------- 연결 ---------- */
  // 지도는 처음 한 번만 만들고, 화면을 다시 그릴 때는 같은 지도 판을 새 화면에 옮겨 끼운다
  // (지울 때마다 새로 만들면 움직이는 중에 지워져 오류가 날 수 있어요)
  var mapEl = null;
  function bind(appEl) {
    root = appEl;
    document.body.classList.add("fm-on"); // 챗봇 버튼을 아래 탭 위로 올리기 (css/foodmap.css)
    var slot = root.querySelector("#fmMap");
    if (!window.L) { slot.innerHTML = '<p class="fm-empty">지도를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.</p>'; return; }
    var first = !mapEl;
    if (first) { mapEl = document.createElement("div"); mapEl.className = "fm-map"; mapEl.id = "fmMap"; }
    slot.replaceWith(mapEl);
    fit();
    if (first) {
      map = L.map(mapEl, { zoomControl: false }).setView(CAMPUS, 16);
      L.control.zoom({ position: "topright" }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      L.marker(CAMPUS, { interactive: false, keyboard: false,
        icon: L.divIcon({ className: "", iconSize: null, html: '<div class="fm-campus">🎓 교통대</div>' }) }).addTo(map);
      layer = L.layerGroup().addTo(map);
      map.on("click", closeDetail);
    }
    map.invalidateSize();
    draw();
    if (first) campusView(false); // 처음엔 학교 주변(대학로)을 보여 준다
    if (st.panel === "fmDetail" && st.selected != null) openDetail(st.selected, false);
    else if (st.panel === "fmMenu") { renderFoodGrid(); panel("fmMenu"); }
    else if (st.panel === "fmRoulette") { renderPick(); if (pk.cur != null) $("#fmPResult").innerHTML = pickResultHTML(data[pk.cur]); panel("fmRoulette"); }
    else panel(st.panel);

    $("#fm").addEventListener("click", function (e) {
      var c = e.target.closest("[data-fm-close]");
      if (c) { if (st.panel === "fmDetail") closeDetail(); else panel(null); return; }
      var tab = e.target.closest("[data-fm-tab]");
      if (tab) {
        var tb = tab.dataset.fmTab;
        closeDetail();
        if (tb === "menu") { renderFoodGrid(); panel(st.panel === "fmMenu" ? null : "fmMenu"); }
        else if (tb === "roulette") { renderPick(); panel(st.panel === "fmRoulette" ? null : "fmRoulette"); }
        else panel(null);
        return;
      }
      var rvb = e.target.closest("[data-fm-review]");
      if (rvb) { window.openPlaceModal(rvb.dataset.fmReview); return; } // 후기 작성: 수경님 사이트의 후기 창
      var item = e.target.closest("[data-fm-id]");
      if (item) { openDetail(+item.dataset.fmId, true); return; }
      var cp = e.target.closest("[data-fm-copy]");
      if (cp) {
        var txt = cp.dataset.fmCopy;
        try { navigator.clipboard.writeText(txt).then(function () { toast("주소를 복사했어요."); }, function () { toast(txt); }); } catch (err) { toast(txt); }
        return;
      }
      var fk = e.target.closest("[data-fm-kind]");
      if (fk) { setKind(fk.dataset.fmKind === st.kind ? "all" : fk.dataset.fmKind, true); return; }
      if (e.target.closest("#fmKindChip")) { setKind("all", false); return; }
      var pc = e.target.closest("[data-fm-pk]");
      if (pc && !pk.rolling) {
        var pkey = pc.dataset.fmPk;
        if (pc.dataset.val === "toggle") pk[pkey] = !pk[pkey]; else pk[pkey] = pc.dataset.val;
        pk.cur = null; renderPick(); return;
      }
      if (e.target.closest("#fmPGo, #fmPAgain")) { pickOne(); return; }
      var f = e.target.closest("[data-fm]");
      if (f) {
        var key = f.dataset.fm, v = f.dataset.val;
        if (v === "toggle") st[key] = !st[key]; else st[key] = v;
        if (key === "type" && st.kind !== "all") st.kind = "all"; // 음식점/카페/술집을 바꾸면 메뉴 종류 선택은 풀기
        root.querySelectorAll('[data-fm="' + key + '"]').forEach(function (b) {
          b.setAttribute("aria-pressed", String(key === "solo" ? st.solo : b.dataset.val === st[key]));
        });
        closeDetail(); draw();
        if (key === "zone") { if (st.zone === "all") campusView(true); else fitVisible(true); } else fitIfNoneShown();
      }
    });
    $("#fmQ").addEventListener("input", function (e) { st.q = e.target.value; closeDetail(); draw(); });
    $("#fmQ").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.target.blur(); closeDetail(); panel("fmList"); } });
    $("#fmListBtn").addEventListener("click", function () { closeDetail(); panel(st.panel === "fmList" ? null : "fmList"); });
    $("#fmLocate").addEventListener("click", locate);
    if (watchId != null) $("#fmLocate").classList.add("is-on");
    $("#fmCampus").addEventListener("click", function () { map.flyTo(CAMPUS, 16, { duration: 0.5 }); });
    $("#fmAll").addEventListener("click", function () { fitVisible(true); });
  }

  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", function () {
    if (location.hash === "#food") return;
    document.body.classList.remove("fm-on", "fm-sheet-open");
    if (watchId != null) stopLocate();
    if (map) map.stop();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && map && document.body.contains(mapEl) && st.panel) { if (st.panel === "fmDetail") closeDetail(); else panel(null); }
  });

  window.FoodMap = { html: html, bind: bind, count: data.length };
})();
