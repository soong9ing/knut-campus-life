/* =============================================================
   한국교통대학교 캠퍼스 라이프 — 화면 렌더링
   데이터: data/site.js (문구·메뉴), data/places.js (엑셀 정보)
   화면 이동: 주소 끝 #home, #map, #hidden, #food, #tips, #community, #etc, #notice, #events, #search
   ============================================================= */
(function () {
  "use strict";
  var S = window.SITE || {};
  var P = window.PLACES || { food: [], tips: [], hidden: [], etc: [] };
  var app = document.getElementById("app");
  var ROUTES = ["home", "map", "hidden", "food", "tips", "community", "etc", "notice", "events", "search", "bus", "favorites"];
  var SECTION_LABEL = { food: "맛집", tips: "생활꿀팁", hidden: "숨은장소", etc: "자유" };

  // 화면별 필터 상태 (페이지 안에서만 기억)
  var state = {
    list: {
      food: { cat: "전체", sub: "전체", area: "전체", q: "", sort: "recommend", open: {}, openNow: false },
      tips: { cat: "전체", q: "", sort: "recommend", open: {} },
      hidden: { cat: "전체", q: "", sort: "recommend", open: {} },
      etc: { cat: "전체", q: "", sort: "recommend", open: {} }
    },
    query: "",
    sel: { type: "pin", idx: 1 },
    posts: (S.community || []).slice(),
    openNotice: -1
  };

  /* ---------- 공통 도우미 ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function linkify(s) {
    return esc(s).replace(/https?:\/\/[^\s<)]+/g, function (u) {
      return '<a href="' + u + '" target="_blank" rel="noopener">' + (u.length > 48 ? u.slice(0, 45) + "…" : u) + "</a>";
    });
  }
  function lines(arr) { return (arr || []).map(function (l) { return "<span>" + esc(l) + "</span>"; }).join(""); }
  function tmp(on) { return on ? ' <span class="tmp-flag" title="임시 콘텐츠: data/site.js에서 실제 내용으로 바꿔 주세요">임시</span>' : ""; }
  var ICON = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C6.5 5 2.7 9.2 1.5 12c1.2 2.8 5 7 10.5 7s9.3-4.2 10.5-7C21.3 9.2 17.5 5 12 5zm0 11.2a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4zm0-6.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"/></svg>',
    pin: '<svg class="pin-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8a7.6 7.6 0 0 0-7.6 7.6c0 5.6 7.6 12.8 7.6 12.8s7.6-7.2 7.6-12.8A7.6 7.6 0 0 0 12 1.8z"/><circle class="hole" cx="12" cy="9.4" r="3"/></svg>',
    ribbonPin: '<svg class="pin-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path class="hole" d="M12 5.2a4.7 4.7 0 0 0-4.7 4.7c0 3.5 4.7 8 4.7 8s4.7-4.5 4.7-8A4.7 4.7 0 0 0 12 5.2z"/><circle cx="12" cy="9.9" r="1.8"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="#fff" stroke="none"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="4.5" width="21" height="15" rx="4.5" fill="#fff"/><path d="M10 8.8v6.4l5.6-3.2z" fill="#752432"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.6 1.6 4.9 4 6.4L5.2 21l4.1-2.4c.9.2 1.8.3 2.7.3 5.5 0 10-3.6 10-8S17.5 3 12 3z" fill="#fff"/><text x="12" y="13.2" text-anchor="middle" font-size="5.4" font-weight="700" font-family="sans-serif" fill="#752432">chat</text></svg>',
    blog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.4 2 10.6c0 2.5 1.6 4.7 4 6.1L5.3 20.5l4-2.4c.9.2 1.8.3 2.7.3 5.5 0 10-3.4 10-7.6S17.5 3 12 3z" fill="#fff"/><text x="12" y="12.6" text-anchor="middle" font-size="5.6" font-weight="700" font-family="sans-serif" fill="#752432">blog</text></svg>',
    kakao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5C6.8 3.5 2.6 6.8 2.6 10.9c0 2.6 1.7 4.9 4.3 6.2l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.4 0 .9.1 1.3.1 5.2 0 9.4-3.3 9.4-7.5S17.2 3.5 12 3.5z" fill="#fff"/><text x="12" y="12.8" text-anchor="middle" font-size="5.4" font-weight="800" font-family="sans-serif" fill="#752432">TALK</text></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M13.2 19v-6h2l.3-2.4h-2.3V9.2c0-.7.2-1.1 1.2-1.1h1.2V6c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.6h-2V13h2v6z" fill="#752432"/></svg>'
  };
  var NAV_ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 2.9 1.4-1.7 2.9-2.9 5-2.9 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
    bow: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 10.5 4 5v14l8-5.5 8 5.5V5z"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',
    bowFill: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 10.5 4.5 5.2C3.4 4.5 2 5.3 2 6.6v10.8c0 1.3 1.4 2.1 2.5 1.4l7.5-5.3 7.5 5.3c1.1.7 2.5-.1 2.5-1.4V6.6c0-1.3-1.4-2.1-2.5-1.4z"/><circle cx="12" cy="12" r="2.4"/></svg>'
  };
  function arrowDot() { return '<span class="arrow-dot" aria-hidden="true">' + ICON.arrow + "</span>"; }
  window.Toast = function (m) { toast(m); };
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function go(route) {
    if (location.hash === "#" + route) render();
    else location.hash = route;
  }
  function currentRoute() {
    var h = (location.hash || "").replace("#", "");
    return ROUTES.indexOf(h) > -1 ? h : "home";
  }
  function logoHTML() {
    return S.logo && S.logo.src
      ? '<img src="' + esc(S.logo.src) + '" alt="' + esc(S.logo.alt) + '">'
      : '<span class="logo-ph" title="공식 로고로 교체할 자리">LOGO</span>';
  }
  function mapUrl(item) {
    if (item.map && item.map.length) return item.map[0];
    if (item.location) return "https://map.naver.com/p/search/" + encodeURIComponent(item.location);
    return "";
  }

  /* ---------- 고정 영역 (헤더·푸터) ---------- */
  function initChrome() {
    if (S.logo && (S.logo.srcOnDark || S.logo.src)) {
      // 공식 시그니처: 엠블럼과 글자가 한 이미지라 따로 넣은 학교명 글자는 숨겨요
      // 밝은 헤더에는 원래 색 로고, 버건디 푸터에는 흰색 로고
      var sigLight = '<img class="brand-sig" src="' + esc(S.logo.src || S.logo.srcOnDark) + '" alt="' + esc(S.logo.alt) + '">';
      var sigDark = '<img class="brand-sig" src="' + esc(S.logo.srcOnDark || S.logo.src) + '" alt="' + esc(S.logo.alt) + '">';
      // 휴대폰에서는 버건디 헤더라 흰색 로고(brand-sig--dark)를 보여 줘요 (CSS에서 전환)
      document.querySelector(".brand").innerHTML = sigLight + sigDark.replace('class="brand-sig"', 'class="brand-sig brand-sig--dark"') + (S.subtitle ? '<span class="brand-sub">' + esc(S.subtitle) + "</span>" : "");
      document.querySelector(".footer-brand").innerHTML = sigDark;
    } else {
      document.getElementById("brandLogo").innerHTML = logoHTML();
      document.getElementById("footLogo").innerHTML = logoHTML();
    }
    ["brandKo", "footKo"].forEach(function (id) { var e = document.getElementById(id); if (e) e.textContent = S.school.ko; });
    ["brandEn", "footEn"].forEach(function (id) { var e = document.getElementById(id); if (e) e.textContent = S.school.en; });
    // 휴대폰(760px 이하)에서는 위 작은 검색창에 다 들어가는 짧은 안내 문구
    var navInput = document.getElementById("navSearchInput");
    var mq = window.matchMedia("(max-width: 760px)");
    function setPh() { navInput.placeholder = S.searchPlaceholder; }
    setPh(); if (mq.addEventListener) mq.addEventListener("change", setPh);
    // 휴대폰 화면 위쪽(헤더 안) 고정 바로가기: 첫 화면에서 안 보이는 기능 바로가기 (CSS에서 760px 이하일 때만 보여요)
    var TAB_ICON = {
      home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11 12 4l8.5 7v9h-5.5v-6h-6v6H3.5z"/></svg>',
      bus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3.5" width="16" height="14" rx="3"/><path d="M4 11h16M8 17.5V20M16 17.5V20"/><circle cx="8" cy="14.3" r=".9"/><circle cx="16" cy="14.3" r=".9"/></svg>',
      events: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
      pick: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16a8 8 0 0 1-16 0z"/><path d="M9 4c0 2 2 2 2 4M14 4c0 2 2 2 2 4"/></svg>',
      notice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9a4 4 0 0 1 0 6"/></svg>',
      favorites: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17l-6-4-6 4z"/></svg>'
    };
    var TABS = [["home", "홈"], ["events", "학사일정"], ["notice", "공지사항"], ["favorites", "내 장소"]];
    var tabBar = document.createElement("nav");
    tabBar.className = "tab-bar"; tabBar.setAttribute("aria-label", "바로가기");
    tabBar.innerHTML = TABS.map(function (t) {
      if (t[0] === "pick") return '<button type="button" data-tab-pick>' + TAB_ICON.pick + "<span>" + t[1] + "</span></button>";
      return '<a href="#' + t[0] + '" data-nav="' + t[0] + '">' + TAB_ICON[t[0]] + "<span>" + t[1] + "</span></a>";
    }).join("");
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-home-pick]") && window.Features && Features.openPicker) Features.openPicker();
    });
    tabBar.addEventListener("click", function (e) {
      if (e.target.closest("[data-tab-pick]") && window.Features && Features.openPicker) Features.openPicker();
    });
    document.querySelector(".site-header").appendChild(tabBar);
    // 휴대폰: 위 검색창을 누르면(아직 아무것도 안 썼을 때) 인기 콘텐츠 목록이 아래로 쭉 펼쳐져요
    var searchPop = document.createElement("div");
    searchPop.className = "search-pop"; searchPop.hidden = true;
    document.querySelector(".site-header").appendChild(searchPop);
    function showSearchPop() {
      if (!mq.matches || navInput.value.trim()) { searchPop.hidden = true; return; }
      searchPop.innerHTML = '<p class="search-pop-title">지금 가장 인기있는 콘텐츠</p><ol>' +
        popularItems(10).map(function (p, i) {
          return '<li><button type="button" data-review="' + esc(p.it.id) + '"><b>' + (i + 1) + "</b>" +
            '<span class="badge badge--' + SEC_BADGE[p.sec] + '">' + esc(SECTION_LABEL[p.sec]) + "</span>" +
            '<span class="sp-name">' + esc(p.it.name) + "</span></button></li>";
        }).join("") + "</ol>";
      searchPop.hidden = false;
    }
    navInput.addEventListener("focus", showSearchPop);
    navInput.addEventListener("input", showSearchPop);
    navInput.addEventListener("blur", function () { setTimeout(function () { searchPop.hidden = true; }, 200); });
    searchPop.addEventListener("mousedown", function (e) { e.preventDefault(); });
    searchPop.addEventListener("click", function (e) { if (e.target.closest("[data-review]")) { searchPop.hidden = true; navInput.blur(); } });
    // 휴대폰: 챗봇 버튼 위에 동그란 "오늘 뭐 먹지" 주사위 버튼 (누르면 뽑기 창)
    var pickFab = document.createElement("button");
    pickFab.type = "button"; pickFab.className = "pick-fab"; pickFab.setAttribute("data-tab-pick", "");
    pickFab.setAttribute("aria-label", "오늘 뭐 먹지? 맛집 뽑기"); pickFab.title = "오늘 뭐 먹지?";
    pickFab.innerHTML = '<span aria-hidden="true">🎲</span>';
    pickFab.addEventListener("click", function () { if (window.Features && Features.openPicker) Features.openPicker(); });
    document.body.appendChild(pickFab);
    document.getElementById("navList").innerHTML = S.nav.map(function (n) {
      return '<li><a href="#' + n.route + '" data-nav="' + n.route + '">' + (n.icon && NAV_ICON[n.icon] ? NAV_ICON[n.icon] : "") + esc(n.label) + "</a></li>";
    }).join("");
    document.getElementById("footSlogan").innerHTML = lines(S.footer.lines);
    document.getElementById("footMascot").src = S.footer.mascot;
    document.getElementById("socials").innerHTML = S.footer.socials.map(function (s, i) {
      var href = s.url || "#";
      return '<li><a href="' + esc(href) + '" ' + (s.url ? 'target="_blank" rel="noopener"' : 'data-social="' + i + '"') + ' aria-label="' + esc(s.label) + '">' + ICON[s.type] + "</a></li>";
    }).join("");

    document.getElementById("navSearch").addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch(document.getElementById("navSearchInput").value);
    });
    // 사람 아이콘: 내가 저장한 장소(즐겨찾기)
    var ub = document.getElementById("userBtn");
    ub.setAttribute("aria-label", "내 장소 (저장한 곳)"); ub.title = "내 장소";
    ub.addEventListener("click", function () { go("favorites"); });
    document.getElementById("toTop").addEventListener("click", function () { window.scrollTo(0, 0); });
    document.getElementById("socials").addEventListener("click", function (e) {
      var a = e.target.closest("[data-social]");
      if (!a) return;
      e.preventDefault();
      toast(S.footer.socials[+a.dataset.social].label + " 링크는 준비 중이에요.");
    });
  }
  function runSearch(q) {
    state.query = (q || "").trim();
    go("search");
  }

  /* ---------- 홈 ---------- */
  function homeHTML() {
    var h = S.hero, m = S.mapIntro, pop = S.popular, b = S.banner;
    return (
      // ② 히어로
      '<section class="hero" aria-label="소개">' +
        '<div class="hero-stage">' +
          // 계절 배경 그림 (봄·여름·가을·겨울이 저절로 바뀜, data/site.js의 hero.seasons)
          '<img class="hero-bg hero-bg--' + heroSeason() + '" src="' + esc(heroImage()) + '" alt="' + esc(SEASON_LABEL[heroSeason()]) + ' 교통대 정문 일러스트">' +
          '<div class="hero-content hero-content--text">' +
            '<div class="hero-card">' +
              '<p class="hero-tag">' + esc(h.tag) + ' <span aria-hidden="true">♡</span></p>' +
              '<h1 class="hero-title">' + h.titleLines.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</h1>" +
              '<p class="hero-desc">' + h.descLines.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>" +
            '<form class="hero-search" id="heroSearch" role="search">' + ICON.search +
              '<label class="sr-only" for="heroSearchInput">정보 검색</label>' +
              '<input id="heroSearchInput" type="search" autocomplete="off" placeholder="' + esc(h.searchPlaceholder) + '">' +
              '<button type="submit" aria-label="검색">' + ICON.search + "</button>" +
            "</form>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<div class="wrap">' +
        // ③ 주요 메뉴 카드
        '<section class="menu-cards" aria-label="주요 메뉴">' +
          S.menuCards.map(function (c) {
            return '<a class="menu-card" href="#' + c.route + '">' +
              '<img src="' + esc(c.img) + '" alt="">' +
              "<h3>" + esc(c.title) + "</h3>" +
              "<p>" + lines(c.desc) + "</p>" + arrowDot() + "</a>";
          }).join("") +
          // 휴대폰에서만 보이는 "교내 버스" 메뉴 (버스 시간표 화면으로)
          '<a class="menu-card menu-card--pick" href="#bus"><img src="assets/img/menu-bus.svg" alt=""><h3>교내 버스</h3><p><span>999·700번</span><span>실시간 도착 보기</span></p>' + arrowDot() + '</a>' +
        "</section>" +

        // 오늘의 캠퍼스: 학사일정 D-day · 교내 버스(지도·실시간) · 오늘 뭐 먹지
        // (지도 카드·공지사항·배너 줄은 위 메뉴 카드와 겹쳐서 뺐어요. 공지사항은 '공지사항' 화면(#notice)에 그대로 있어요.)
        (window.Features ? '<section class="fw-row" aria-label="오늘의 캠퍼스">' + Features.ddayWidgetHTML() + Features.busWidgetHTML() + Features.pickWidgetHTML() + "</section>" : "") +

        // ⑤ 인기 콘텐츠
        '<section class="popular" aria-labelledby="popTitle">' +
          '<div class="section-head">' +
            '<h2 class="section-title" id="popTitle"><img src="assets/img/icon-bulb.png" alt="">' + esc(pop.title) + "</h2>" +
            ((pop.noteLines || []).length ? '<div class="pop-note" aria-hidden="true"><span class="marks"><span>➚</span><span>–</span></span><p>' + lines(pop.noteLines) + '</p><img src="assets/img/doodle-cloud.png" alt=""></div>' : "") +
          "</div>" +
          '<div class="pop-cards" id="popCards">' + popularCardsHTML() + "</div>" +
          '<p class="pop-hint" id="popHint">' + esc(popularHint()) + "</p>" +
        "</section>" +

      "</div>" +
      '<div class="page-end" aria-hidden="true"></div>'
    );
  }
  /* ---------- 계절 배경: 방문자 기기의 오늘 날짜로 봄·여름·가을·겨울을 골라요 ---------- */
  var SEASON_LABEL = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" };
  function heroSeason() {
    var q = (location.search.match(/[?&]season=(spring|summer|autumn|winter)/) || [])[1];
    if (q) return q;  // 미리보기용: 주소 끝에 ?season=winter
    var m = new Date().getMonth() + 1;
    return m >= 3 && m <= 5 ? "spring" : m >= 6 && m <= 8 ? "summer" : m >= 9 && m <= 11 ? "autumn" : "winter";
  }
  function heroImage() {
    var s = S.hero.seasons || {};
    return s[heroSeason()] || S.hero.image;
  }
  function noticeCardHTML() {
    return '<div class="notice-card">' +
      '<div class="notice-head"><h2><img src="assets/img/icon-megaphone.png" alt="">공지사항</h2>' +
        '<a class="more-link" href="#notice">전체보기' + ICON.arrow + "</a></div>" +
      '<ul class="notice-list">' +
        S.notices.slice(0, 3).map(function (n, i) {
          return '<li><a href="#notice" data-notice="' + i + '"><span>' + (n.tag ? '<b class="notice-tag">[' + esc(n.tag) + "]</b> " : "") + esc(n.title) + "</span><time>" + esc(n.date) + "</time></a></li>";
        }).join("") +
      "</ul>" +
    "</div>";
  }
  function mapFigureHTML(interactive) {
    var m = S.mapIntro;
    return '<div class="map-figure">' +
      '<img src="' + esc(m.image) + '" alt="캠퍼스 지도 일러스트">' +
      '<div class="map-ribbon">' + ICON.ribbonPin + "<span>" + esc(m.ribbon[0]) + "<b>" + esc(m.ribbon[1]) + "</b></span></div>" +
      m.pins.map(function (p, i) {
        var cls = "map-pin" + (p.flip ? " map-pin--flip" : "") + (interactive && state.sel.type === "pin" && state.sel.idx === i ? " is-active" : "");
        return '<a class="' + cls + '" href="#map" data-pin="' + i + '" style="left:' + p.x + "%;top:" + p.y + '%">' + ICON.pin + esc(p.label) + "</a>";
      }).join("") +
      "</div>";
  }

  /* ---------- 인기 콘텐츠: 조회수 많은 정보 ---------- */
  var SEC_BADGE = { hidden: "green", food: "burgundy", tips: "orange", etc: "pink" };
  function popularItems(nWant) {
    var Soc = window.Social, n = nWant || (S.popular && S.popular.count) || 5, ids = [], seenIds = {};
    if (Soc) Soc.topViewed(n).forEach(function (id) { if (PLACE_BY_ID[id]) { ids.push(id); seenIds[id] = true; } });
    // 조회 기록이 모자라면 추천인 수가 많은 순으로 채워요
    if (ids.length < n) {
      Object.keys(PLACE_BY_ID).map(function (id) { return PLACE_BY_ID[id]; })
        .sort(function (a, b) { return (b.it.recommend || 0) - (a.it.recommend || 0) || a.it.name.localeCompare(b.it.name, "ko"); })
        .forEach(function (p) { if (ids.length < n && !seenIds[p.it.id]) { ids.push(p.it.id); seenIds[p.it.id] = true; } });
    }
    return ids.map(function (id) { return PLACE_BY_ID[id]; });
  }
  function popularHint() {
    var Soc = window.Social;
    var viewed = Soc ? Soc.topViewed(1).length : 0;
    return viewed ? "학생들이 많이 열어 본 정보 순서예요. 카드를 누르면 자세한 내용과 후기를 볼 수 있어요."
                  : "아직 조회 기록이 적어서 추천인 수가 많은 정보를 먼저 보여 줘요.";
  }
  function firstLine(note) {
    var l = String(note || "").split("\n").filter(function (x) { return x && !/^https?:|^참고|^txt|^전화/.test(x); })[0] || "";
    return l.length > 40 ? l.slice(0, 38) + "…" : l;
  }
  function popularCardsHTML() {
    var Soc = window.Social;
    return popularItems().map(function (p, i) {
      var it = p.it, st = Soc ? Soc.stats(it.id) : { views: 0, avg: 0, n: 0 };
      var meta = [it.subcategory || it.category, it.area].filter(Boolean).join(" · ");
      return '<button type="button" class="pop-card" data-review="' + esc(it.id) + '">' +
        '<div class="pop-top"><span class="pop-rank">' + (i + 1) + '</span><span class="badge badge--' + SEC_BADGE[p.sec] + '">' + esc(SECTION_LABEL[p.sec]) + "</span></div>" +
        '<div class="pop-body"><h3>' + esc(it.name) + "</h3>" +
          '<p class="pop-meta">' + esc(meta) + "</p>" +
          '<p class="pop-desc">' + esc(firstLine(it.note)) + "</p>" +
          '<div class="pop-foot"><span class="views">' + ICON.eye + "조회수 " + (st.views || 0).toLocaleString("ko-KR") +
            (st.n ? ' <span class="pop-star">★ ' + st.avg.toFixed(1) + "</span>" : "") + "</span>" + arrowDot() + "</div>" +
        "</div></button>";
    }).join("");
  }

  /* ---------- 후기·좋아요 ---------- */
  var PLACE_BY_ID = {};
  ["food", "tips", "hidden", "etc"].forEach(function (sec) {
    (P[sec] || []).forEach(function (it) { PLACE_BY_ID[it.id] = { sec: sec, it: it }; });
  });
  function starsHTML(v, cls) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += '<span class="' + (v >= i - 0.25 ? "on" : v >= i - 0.75 ? "half" : "") + '">★</span>';
    return '<span class="stars ' + (cls || "") + '" aria-hidden="true">' + out + "</span>";
  }
  function socialHTML(pid) {
    var Soc = window.Social;
    if (!Soc) return "";
    var s = Soc.stats(pid), liked = Soc.liked(pid);
    return '<button type="button" class="rate-btn" data-review="' + esc(pid) + '" aria-label="후기 ' + s.n + '개 보기 및 쓰기">' +
        starsHTML(s.avg) + (s.n ? "<b>" + s.avg.toFixed(1) + "</b><span>후기 " + s.n + "</span>" : "<span>첫 후기 쓰기</span>") + "</button>" +
      '<button type="button" class="like-btn" data-like="' + esc(pid) + '" aria-pressed="' + liked + '" aria-label="좋아요' + (liked ? " 취소" : "") + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 2.9 1.4-1.7 2.9-2.9 5-2.9 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>' +
        "<span>" + s.likes + "</span></button>";
  }
  function refreshSocial() {
    document.querySelectorAll("[data-stat]").forEach(function (el) { el.innerHTML = socialHTML(el.dataset.stat); });
    var pc = document.getElementById("popCards");
    if (pc) {
      var focused = pc.contains(document.activeElement) ? document.activeElement.getAttribute("data-review") : null;
      var html = popularCardsHTML();
      if (pc.innerHTML !== html) {
        pc.innerHTML = html;
        if (focused) { var again = pc.querySelector('[data-review="' + focused + '"]'); if (again) again.focus(); }
        if (modal.lastFocus && !document.body.contains(modal.lastFocus) && focused) modal.lastFocus = pc.querySelector('[data-review="' + focused + '"]');
      }
      document.getElementById("popHint").textContent = popularHint();
    }
    if (modal.pid) renderModalList();
  }
  function blockedMsg(code) {
    if (code === "nohost") return "후기와 좋아요 기능은 준비 중이에요.";
    return code === "readonly"
      ? "보기 권한만 있어서 쓸 수 없어요. 페이지 주인에게 '참여자' 이상 권한을 요청해 주세요."
      : "후기와 좋아요는 claude.ai에 로그인한 상태에서 이 페이지를 열면 쓸 수 있어요.";
  }

  var modal = { el: null, pid: null, rating: 0, lastFocus: null };
  function ensureModal() {
    if (modal.el) return modal.el;
    var el = document.createElement("div");
    el.className = "modal"; el.hidden = true;
    el.innerHTML =
      '<div class="modal-back" data-close></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="mTitle">' +
        '<button type="button" class="modal-x" data-close aria-label="닫기">×</button>' +
        '<p class="modal-sec" id="mSec"></p><h2 id="mTitle"></h2>' +
        '<div class="modal-info" id="mInfo"></div>' +
        '<div class="modal-sum" id="mSum"></div>' +
        '<form class="review-form" id="mForm">' +
          '<p class="rf-title" id="mFormTitle">후기 쓰기</p>' +
          '<div class="star-pick" role="radiogroup" aria-label="별점">' +
            [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" role="radio" data-star="' + n + '" aria-label="' + n + '점">★</button>'; }).join("") +
            '<span class="star-label" id="mStarLabel">별점을 골라 주세요</span></div>' +
          '<label class="sr-only" for="mText">후기 내용</label>' +
          '<textarea id="mText" maxlength="500" rows="3" placeholder="다녀온 느낌을 남겨 주세요 (2자 이상, 500자까지)"></textarea>' +
          '<div class="rf-row"><label class="anon"><input type="checkbox" id="mAnon" checked> 익명으로 남기기</label>' +
            '<span class="rf-count" id="mCount">0/500</span></div>' +
          '<div class="rf-row"><button type="button" class="text-btn" id="mDelete" hidden>내 후기 삭제</button>' +
            '<button type="submit" class="pill-btn" id="mSubmit">후기 등록</button></div>' +
          '<p class="hint" id="mMsg" role="status"></p>' +
        "</form>" +
        '<ul class="review-list" id="mList"></ul>' +
      "</div>";
    document.body.appendChild(el);
    modal.el = el;
    el.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal();
      var star = e.target.closest("[data-star]");
      if (star) setRating(+star.dataset.star);
      var del = e.target.closest("[data-del]");
      if (del) {
        window.Social.deleteReview(modal.pid, del.dataset.del).then(function () { toast("후기를 삭제했어요."); }, function () { toast("삭제하지 못했어요. 잠시 후 다시 해 보세요."); });
      }
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {  // 창 안에서만 포커스 이동
        var f = el.querySelectorAll("button:not([hidden]), textarea, input, a[href]");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      var star = e.target.closest && e.target.closest("[data-star]");
      if (star && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault(); setRating(Math.min(5, Math.max(1, (modal.rating || 0) + (e.key === "ArrowRight" ? 1 : -1))));
        el.querySelector('[data-star="' + modal.rating + '"]').focus();
      }
    });
    el.querySelector("#mText").addEventListener("input", function (e) {
      el.querySelector("#mCount").textContent = e.target.value.length + "/500";
    });
    el.querySelector("#mDelete").addEventListener("click", function () {
      window.Social.deleteReview(modal.pid).then(function () { toast("내 후기를 삭제했어요."); fillForm(); }, function () { toast("삭제하지 못했어요."); });
    });
    el.querySelector("#mForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var Soc = window.Social, msg = el.querySelector("#mMsg");
      if (!Soc.canWrite()) { msg.textContent = blockedMsg(Soc.status()); return; }
      var text = el.querySelector("#mText").value.trim();
      if (!modal.rating) { msg.textContent = "별점을 1~5개 중에서 골라 주세요."; return; }
      if (text.length < 2) { msg.textContent = "후기 내용을 2자 이상 써 주세요."; el.querySelector("#mText").focus(); return; }
      var btn = el.querySelector("#mSubmit"); btn.disabled = true;
      Soc.saveReview(modal.pid, modal.rating, text, el.querySelector("#mAnon").checked).then(function () {
        msg.textContent = ""; toast("후기를 등록했어요."); fillForm();
      }, function (err) {
        msg.textContent = err && err.code === "quota_exceeded" ? "저장 공간이 가득 찼어요. 페이지 주인에게 알려 주세요." : (err && (err.code === "readonly" || err.code === "invalid_argument")) ? blockedMsg("readonly") : "등록하지 못했어요. 잠시 후 다시 해 보세요.";
      }).then(function () { btn.disabled = false; });
    });
    return el;
  }
  function setRating(n) {
    modal.rating = n;
    modal.el.querySelectorAll("[data-star]").forEach(function (b) {
      var v = +b.dataset.star; b.classList.toggle("on", v <= n); b.setAttribute("aria-checked", String(v === n)); b.tabIndex = v === (n || 1) ? 0 : -1;
    });
    modal.el.querySelector("#mStarLabel").textContent = n ? ["", "별로예요", "아쉬워요", "괜찮아요", "좋아요", "최고예요"][n] + " (" + n + "점)" : "별점을 골라 주세요";
  }
  function fillForm() {
    var Soc = window.Social, el = modal.el, mine = Soc.myReview(modal.pid);
    el.querySelector("#mFormTitle").textContent = mine ? "내 후기 고치기" : "후기 쓰기";
    el.querySelector("#mSubmit").textContent = mine ? "후기 수정" : "후기 등록";
    el.querySelector("#mDelete").hidden = !mine;
    el.querySelector("#mText").value = mine ? mine.text : "";
    el.querySelector("#mAnon").checked = mine ? mine.anon !== false : true;
    el.querySelector("#mCount").textContent = (mine ? mine.text.length : 0) + "/500";
    setRating(mine ? mine.rating : 0);
    var can = Soc.canWrite();
    el.querySelector("#mForm").classList.toggle("is-blocked", !can);
    el.querySelector("#mMsg").textContent = can ? "" : blockedMsg(Soc.status());
  }
  function renderModalList() {
    var Soc = window.Social, el = modal.el, s = Soc.stats(modal.pid);
    el.querySelector("#mSum").innerHTML = s.n
      ? starsHTML(s.avg, "lg") + "<b>" + s.avg.toFixed(1) + "</b><span>/ 5 · 후기 " + s.n + "개 · 좋아요 " + s.likes + " · 조회 " + s.views + "</span>"
      : "<span>아직 후기가 없어요. 첫 후기를 남겨 주세요!</span>" + (s.likes ? "<span> · 좋아요 " + s.likes + "</span>" : "");
    var list = el.querySelector("#mList"), pid = modal.pid;
    var ids = s.reviews.filter(function (r) { return !r.anon; }).map(function (r) { return r.uid; });
    Soc.names(ids).then(function (ps) {
      if (modal.pid !== pid) return;
      list.innerHTML = s.reviews.map(function (r, i) {
        var mine = Soc.isMe(r.uid);
        return '<li><div class="rv-head">' + starsHTML(r.rating) + '<span class="rv-who" data-who="' + i + '"></span>' +
          '<time>' + (r.at ? new Date(r.at).toLocaleDateString("ko-KR") : "") + "</time>" +
          (!mine && Soc.isOwner() ? '<button type="button" class="text-btn" data-del="' + esc(r.uid) + '">삭제(관리)</button>' : "") +
          '</div><p class="rv-text"></p></li>';
      }).join("");
      // 남이 쓴 글·이름은 글자로만 넣어요
      s.reviews.forEach(function (r, i) {
        var li = list.children[i];
        var who = Soc.isMe(r.uid) ? "나" + (r.anon ? " (익명)" : "") : r.anon ? "익명 학생" : ((ps[r.uid] && ps[r.uid].name) || "학생");
        li.querySelector(".rv-who").textContent = who;
        li.querySelector(".rv-text").textContent = r.text;
      });
    });
  }
  function openModal(pid) {
    var place = PLACE_BY_ID[pid];
    if (!place) return;
    ensureModal();
    modal.pid = pid; modal.lastFocus = document.activeElement;
    modal.el.querySelector("#mSec").textContent = SECTION_LABEL[place.sec] + " · " + place.it.category;
    modal.el.querySelector("#mTitle").textContent = place.it.name;
    var it = place.it, url = mapUrl(it), info = modal.el.querySelector("#mInfo");
    info.innerHTML =
      (window.Features ? '<div class="modal-tools">' + Features.openBadgeHTML(it) + Features.favButtonHTML(it.id) + "</div>" : "") +
      (it.location ? '<p class="meta">📍 ' + esc(it.location) + "</p>" : "") +
      (it.price ? '<p class="meta"><b>가격</b> ' + esc(it.price) + "</p>" : "") +
      (it.note ? '<p class="note">' + linkify(it.note) + "</p>" : "") +
      (url ? '<a class="map-link" href="' + esc(url) + '" target="_blank" rel="noopener">지도에서 보기 ↗</a>' : "") +
      (window.Features && Features.reportAvailable() ? Features.reportHTML(it.id) : "");
    fillForm(); renderModalList();
    if (window.Social) window.Social.recordView(pid);
    modal.el.hidden = false; document.body.classList.add("no-scroll");
    var first = modal.el.querySelector('[data-star="1"]'); if (first) first.focus();
  }
  function closeModal() {
    if (!modal.el) return;
    modal.el.hidden = true; modal.pid = null; document.body.classList.remove("no-scroll");
    if (modal.lastFocus && !document.body.contains(modal.lastFocus) && modal.lastFocus.getAttribute) {
      var again = document.querySelector('[data-review="' + modal.lastFocus.getAttribute("data-review") + '"]');
      if (again) modal.lastFocus = again;
    }
    if (modal.lastFocus && modal.lastFocus.focus) modal.lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var r = e.target.closest("[data-review]");
    if (r) { e.preventDefault(); openModal(r.dataset.review); return; }
    var fv = e.target.closest("[data-fav]");
    if (fv && window.Features) {
      e.preventDefault();
      var on = Features.toggleFav(fv.dataset.fav);
      document.querySelectorAll('[data-fav="' + fv.dataset.fav + '"]').forEach(function (b) { b.outerHTML = Features.favButtonHTML(fv.dataset.fav); });
      toast(on ? "내 장소에 저장했어요. 오른쪽 위 사람 아이콘에서 볼 수 있어요." : "내 장소에서 뺐어요.");
      if (currentRoute() === "favorites" && !on) render(true);
      return;
    }
    var l = e.target.closest("[data-like]");
    if (l) {
      e.preventDefault();
      var Soc = window.Social;
      if (!Soc || !Soc.canWrite()) { toast(blockedMsg(Soc ? Soc.status() : "off")); return; }
      Soc.toggleLike(l.dataset.like).catch(function () { toast("좋아요를 저장하지 못했어요."); });
    }
  });
  if (window.Social) window.Social.onChange(refreshSocial);
  window.openPlaceModal = openModal;  // 맛집 지도(js/foodmap.js)에서 핀을 누르면 이 상세 창을 열어요

  /* ---------- 목록 화면 (맛집·생활꿀팁·숨은장소·자유) ---------- */
  function uniq(arr) { var o = []; arr.forEach(function (v) { if (v && o.indexOf(v) < 0) o.push(v); }); return o; }
  function matches(item, q) {
    if (!q) return true;
    var hay = [item.name, item.location, item.note, item.category, item.subcategory, item.area, item.price].join(" ").toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
  }
  function sortItems(items, sort) {
    var Soc = window.Social;
    return items.slice().sort(function (a, b) {
      if (sort === "name") return a.name.localeCompare(b.name, "ko");
      if (sort === "likes" && Soc) return Soc.stats(b.id).likes - Soc.stats(a.id).likes || (b.recommend || 0) - (a.recommend || 0);
      if (sort === "rating" && Soc) { var A = Soc.stats(a.id), B = Soc.stats(b.id); return B.avg - A.avg || B.n - A.n || (b.recommend || 0) - (a.recommend || 0); }
      return (b.recommend || 0) - (a.recommend || 0) || a.name.localeCompare(b.name, "ko");
    });
  }
  function itemHTML(item, sec, idx, open) {
    var url = mapUrl(item);
    var noteLong = (item.note || "").split("\n").length > 4 || (item.note || "").length > 160;
    return '<article class="item">' +
      '<div class="item-top">' +
        (sec !== "food" || !item.subcategory ? '<span class="tag tag--cat">' + esc(item.category) + "</span>" : '<span class="tag tag--cat">' + esc(item.category) + '</span><span class="tag tag--sub">' + esc(item.subcategory) + "</span>") +
        (item.area ? '<span class="tag tag--area">' + esc(item.area) + "</span>" : "") +
        '<span class="rec">추천 ' + (item.recommend || 1) + "명</span>" +
      "</div>" +
      (window.Features ? Features.openBadgeHTML(item) : "") +
      '<h3><button type="button" class="item-title" data-review="' + esc(item.id) + '">' + esc(item.name) + "</button></h3>" +
      '<div class="social-row"><div class="social" data-stat="' + esc(item.id) + '">' + socialHTML(item.id) + "</div>" + (window.Features ? Features.favButtonHTML(item.id) : "") + "</div>" +
      (item.location ? '<p class="meta">📍 ' + esc(item.location) + "</p>" : "") +
      (item.price ? '<p class="meta"><b>가격</b> ' + esc(item.price) + "</p>" : "") +
      (item.note ? '<p class="note' + (noteLong && !open ? " clamp" : "") + '">' + linkify(item.note) + "</p>" : "") +
      '<div class="item-actions">' +
        (noteLong ? '<button class="text-btn" type="button" data-toggle="' + idx + '">' + (open ? "접기" : "더보기") + "</button>" : "") +
        (url ? '<a class="map-link" href="' + esc(url) + '" target="_blank" rel="noopener">지도에서 보기 ↗</a>' : "") +
        (item.checkedAt ? '<small class="views" style="margin-left:auto">확인 ' + esc(item.checkedAt) + "</small>" : "") +
      "</div></article>";
  }
  function listHTML(sec) {
    var st = state.list[sec], data = P[sec] || [], info = S.sections[sec];
    var cats = uniq(data.map(function (d) { return d.category; }));
    var pool = data.filter(function (d) {
      return (st.cat === "전체" || d.category === st.cat) &&
        (sec !== "food" || st.sub === "전체" || d.subcategory === st.sub) &&
        (sec !== "food" || st.area === "전체" || d.area === st.area) &&
        (!st.openNow || !window.Features || (function (s) { return s && (s.state === "open" || s.state === "soon"); })(Features.openStatus(d))) &&
        matches(d, st.q);
    });
    pool = sortItems(pool, st.sort);
    var subChips = "";
    if (sec === "food" && st.cat !== "전체") {
      var subs = uniq(data.filter(function (d) { return d.category === st.cat; }).map(function (d) { return d.subcategory; }));
      if (subs.length > 1) {
        subChips = '<div class="chips chips--sub" role="group" aria-label="세부 분류">' +
          ["전체"].concat(subs).map(function (s) {
            return '<button class="chip" type="button" data-sub="' + esc(s) + '" aria-pressed="' + (st.sub === s) + '">' + esc(s) + "</button>";
          }).join("") + "</div>";
      }
    }
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › ' + esc(info.title) + "</div>" +
        "<h1>" + esc(info.title) + "</h1><p>" + esc(info.desc) + ' · <span class="count">' + pool.length + "곳</span></p></div>" +
      '<div class="toolbar">' +
        '<div class="chips" role="group" aria-label="분류">' +
          ["전체"].concat(cats).map(function (c) {
            var n = c === "전체" ? data.length : data.filter(function (d) { return d.category === c; }).length;
            return '<button class="chip" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (st.cat === c) + '">' + esc(c) + " <small>" + n + "</small></button>";
          }).join("") +
        "</div>" + subChips +
        '<div class="filter-row">' +
          '<label class="mini-search">' + ICON.search + '<span class="sr-only">이 목록에서 찾기</span><input id="listQ-' + sec + '" type="search" placeholder="이 목록에서 찾기" value="' + esc(st.q) + '" autocomplete="off"></label>' +
          (sec === "food" ? '<label class="sr-only" for="areaSel">위치</label><select class="select" id="areaSel"><option>전체</option>' +
            ["교내", "학교 주변 (대소원면)", "충주 시내·외곽"].map(function (a) { return "<option" + (st.area === a ? " selected" : "") + ">" + a + "</option>"; }).join("") + "</select>" : "") +
          (sec === "food" && window.Features ? '<label class="check"><input type="checkbox" id="openNow"' + (st.openNow ? " checked" : "") + '> 지금 영업 중만 <small>(시간 정보 있는 곳)</small></label>' : "") +
          '<label class="sr-only" for="sortSel">정렬</label><select class="select" id="sortSel"><option value="recommend"' + (st.sort === "recommend" ? " selected" : "") + '>추천 많은 순</option><option value="likes"' + (st.sort === "likes" ? " selected" : "") + '>좋아요 많은 순</option><option value="rating"' + (st.sort === "rating" ? " selected" : "") + '>별점 높은 순</option><option value="name"' + (st.sort === "name" ? " selected" : "") + ">이름순</option></select>" +
        "</div>" +
      "</div>" +
      (pool.length ? '<div class="item-grid">' + pool.map(function (it) {
        var idx = data.indexOf(it);
        return itemHTML(it, sec, idx, !!st.open[idx]);
      }).join("") + "</div>" : '<div class="empty">조건에 맞는 정보가 없어요. 분류나 검색어를 바꿔 보세요.</div>') +
      "</div>";
  }
  function bindList(sec) {
    var st = state.list[sec];
    app.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () { st.cat = b.dataset.cat; st.sub = "전체"; render(true); });
    });
    app.querySelectorAll("[data-sub]").forEach(function (b) {
      b.addEventListener("click", function () { st.sub = b.dataset.sub; render(true); });
    });
    var q = document.getElementById("listQ-" + sec);
    q.addEventListener("input", function () {
      st.q = q.value; render(true);
      var n = document.getElementById("listQ-" + sec); n.focus(); n.setSelectionRange(n.value.length, n.value.length);
    });
    var area = document.getElementById("areaSel");
    if (area) area.addEventListener("change", function () { st.area = area.value; render(true); });
    var on = document.getElementById("openNow");
    if (on) on.addEventListener("change", function () { st.openNow = on.checked; render(true); });
    document.getElementById("sortSel").addEventListener("change", function (e) { st.sort = e.target.value; render(true); });
    app.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.addEventListener("click", function () { var i = b.dataset.toggle; st.open[i] = !st.open[i]; render(true); });
    });
  }

  /* ---------- 캠퍼스 지도 화면 ---------- */
  // 건물 코드(E8, W20…)와 이름·별칭으로 관련 정보를 찾아요
  function terms(sel) {
    var t = [];
    if (sel.keyword) t.push(sel.keyword);
    String(sel.name || "").split(/[\/,]/).forEach(function (n) { if (n.trim().length > 1) t.push(n.trim()); });
    (sel.alias || []).forEach(function (n) { t.push(n); });
    return t;
  }
  function related(sel) {
    var codeRe = sel.code ? new RegExp("(^|[^A-Za-z0-9])" + sel.code.replace("-", "\\-") + "(?![0-9-])") : null;
    var words = terms(sel), out = [];
    ["hidden", "tips", "food"].forEach(function (sec) {
      (P[sec] || []).forEach(function (it) {
        var hay = it.name + " " + it.location;
        var hit = (codeRe && codeRe.test(hay)) || words.some(function (w) { return hay.indexOf(w) > -1; });
        if (hit) out.push({ sec: sec, it: it });
      });
    });
    return out;
  }
  function selected() {
    var m = S.mapIntro;
    if (state.sel.type === "bld") {
      var bd = m.buildings[state.sel.idx];
      return { label: bd.name, code: bd.code, name: bd.name, alias: bd.alias, desc: (FL[bd.code] && FL[bd.code].name !== bd.name ? "공식 지도 표기: " + FL[bd.code].name : "충주캠퍼스 건물 " + bd.code) };
    }
    var p = m.pins[state.sel.idx];
    var match = m.buildings.filter(function (x) { return x.code === p.code; })[0];
    return { label: p.label, code: p.code, keyword: p.keyword, name: match ? match.name : "", alias: match ? match.alias : [], desc: p.desc };
  }
  /* ---------- 층 안내 (data/floors.js) ---------- */
  var FL = window.FLOORS || {};
  function floorSummary(code) {
    var f = FL[code];
    if (!f || !f.floors.length) return "";
    var all = [];
    f.floors.forEach(function (x) { all = all.concat(x.places); });
    if (f.floors.length === 1 && all.length === 1 && all[0] === f.name) return f.floors[0].floor + "층";
    return f.floors.length + "개 층 안내";
  }
  function floorsHTML(code) {
    var f = FL[code];
    if (!f || !f.floors.length) return "";
    // 위층부터 아래로 (건물 단면처럼)
    var rows = f.floors.slice().reverse().map(function (x) {
      var only = x.places.length === 1 && x.places[0] === f.name;
      return '<li><span class="fl-no">' + esc(x.floor) + '<small>층</small></span><div class="fl-places">' +
        (only ? '<span class="fl-chip fl-chip--plain">건물 전체</span>' : x.places.map(function (p) { return '<span class="fl-chip' + (/식당|카페|Caffee|편의점|마트|북카페|음료/.test(p) ? " fl-chip--food" : /헬스|휘트니스|보건|농협|우편|복사|안경|열람|자료실|서점|상담/.test(p) ? " fl-chip--use" : "") + '">' + esc(p) + "</span>"; }).join("")) +
        "</div></li>";
    }).join("");
    return '<section class="floors" aria-label="' + esc(f.name) + ' 층별 안내"><h3 class="panel-sub">층별 안내 <small>학교 공식 지도 기준</small></h3><ol class="fl-list">' + rows + "</ol>" +
      '<p class="fl-legend"><span class="fl-chip fl-chip--food">먹을 곳</span><span class="fl-chip fl-chip--use">생활 시설</span><span class="fl-chip">학과·사무실</span></p></section>';
  }
  function bldIndex(code) {
    var bs = S.mapIntro.buildings;
    for (var i = 0; i < bs.length; i++) if (bs[i].code === code) return i;
    return -1;
  }
  function campusMapHTML(sel, relCount) {
    var cm = S.mapIntro.campusMap;
    if (!cm) return mapFigureHTML(true);
    var pop = "";
    var lab = cm.labels.filter(function (l) { return l.code === sel.code; })[0];
    if (lab) {
      var right = lab.x > 70;
      pop = '<div class="cm-pop' + (right ? " cm-pop--left" : "") + '" style="left:' + lab.x + "%;top:" + lab.y + '%" role="status">' +
        "<b>" + esc(sel.code) + "</b><strong>" + esc(sel.label) + "</strong>" +
        "<span>" + (floorSummary(sel.code) ? floorSummary(sel.code) + " · " : "") + "관련 정보 " + relCount + "건</span>" +
        '<a href="#map" class="text-btn" data-scroll="pinPanel">자세히 보기 ↓</a></div>';
    }
    return '<section class="campus-map" aria-label="캠퍼스 지도 그림">' +
      '<div class="cm-scroll"><div class="cm-stage">' +
        '<img src="' + esc(cm.image) + '" alt="한국교통대학교 충주캠퍼스 손그림 지도">' +
        '<h1 class="sr-only">캠퍼스 지도</h1>' +
        cm.labels.map(function (l) {
          var i = bldIndex(l.code), bd = S.mapIntro.buildings[i];
          var on = sel.code === l.code;
          // 그림에 그려진 번호 위에는 투명 버튼, 그림에 없는 번호는 라벨을 그려 넣어요
          var cls = (l.drawn === false ? "cm-label" : "cm-hot") + (on ? " is-on" : "");
          var size = l.drawn === false ? "" : "width:" + l.w + "%;height:" + l.h + "%;";
          return '<button type="button" class="' + cls + '" data-bld="' + i + '" style="left:' + l.x + "%;top:" + l.y + "%;" + size + '" aria-pressed="' + on + '" aria-label="' + esc(l.code + " " + (bd ? bd.name : "")) + '">' + esc(l.code) + "</button>";
        }).join("") + pop +
      "</div></div>" +
      '<p class="cm-hint wrap">좌우로 밀어서 지도를 볼 수 있어요.</p>' +
    "</section>";
  }
  function mapHTML() {
    var m = S.mapIntro, sel = selected(), rel = related(sel);
    var zones = [["E", "E 구역"], ["W", "W 구역"]];
    var onMap = m.campusMap && m.campusMap.labels.some(function (l) { return l.code === sel.code; });
    // 왼쪽: 그림 지도 + 선택한 건물 정보 / 오른쪽: 건물 목록 (휴대폰에서는 지도 → 정보 → 목록 순서)
    return '<div class="wrap sub-page map-sub">' +
      '<div class="page-head map-head"><div class="crumb"><a href="#home">홈</a> › 캠퍼스 지도</div></div>' +
      '<div class="toolbar"><a class="pill-btn" href="' + esc(m.officialMap) + '" target="_blank" rel="noopener">학교 공식 캠퍼스 지도' + ICON.arrow + "</a>" +
        '<a class="text-btn" href="' + esc(m.naverMap) + '" target="_blank" rel="noopener">네이버 지도에서 보기 ↗</a>' +
        '<span class="hint">' + esc((m.campusMap && m.campusMap.descLines ? m.campusMap.descLines.join(" ") + " " : "")) + '그림 지도는 실제 축척과 달라요. 정확한 위치는 공식 지도에서 확인하세요.</span></div>' +
      '<div class="map-page map-page--side">' +
        '<div class="map-main">' + campusMapHTML(sel, rel.length) +
        '<aside class="pin-panel" id="pinPanel" aria-live="polite"><h2>' + esc(sel.label) + (sel.code ? ' <small class="code">' + esc(sel.code) + "</small>" : "") + "</h2><p>" + esc(sel.desc) + "</p>" +
          (sel.code && !onMap && m.campusMap ? '<p class="hint" style="margin-top:6px">그림 지도에는 이 건물 표시가 없어요. 공식 지도에서 위치를 확인하세요.</p>' : "") +
          floorsHTML(sel.code) +
          (rel.length ? '<h3 class="panel-sub">근처 꿀팁·장소 <small>' + rel.length + "건</small></h3>" + '<ul class="pin-list">' + rel.slice(0, 12).map(function (r) {
            return "<li><b>" + esc(r.it.name) + "</b><small>" + SECTION_LABEL[r.sec] + " · " + esc(r.it.category) + (r.it.location ? " · " + esc(r.it.location) : "") + "</small>" +
              '<a class="text-btn" href="#' + r.sec + '" data-jump="' + r.sec + '" data-name="' + esc(r.it.name) + '">자세히 보기 →</a></li>';
          }).join("") + "</ul>" : '<p class="hint" style="margin-top:12px">아직 이 건물과 연결된 정보가 없어요.</p>') +
        "</aside></div>" +
          '<section class="bld-dir" aria-label="건물 목록"><h2>건물 목록 <small>충주캠퍼스 · 공식 지도 기준</small></h2>' +
            zones.map(function (z) {
              return '<h3>' + z[1] + '</h3><div class="bld-grid">' + m.buildings.map(function (bd, i) {
                if (bd.code.charAt(0) !== z[0]) return "";
                var on = sel.code === bd.code;
                return '<button type="button" class="bld" data-bld="' + i + '" aria-pressed="' + on + '"><b>' + esc(bd.code) + "</b>" + esc(bd.name) + "</button>";
              }).join("") + "</div>";
            }).join("") +
          "</section>" +
      "</div></div>";
  }

  /* ---------- 검색 ---------- */
  function searchHTML() {
    var q = state.query;
    var groups = ["food", "hidden", "tips", "etc"].map(function (sec) {
      return { sec: sec, items: q ? sortItems((P[sec] || []).filter(function (d) { return matches(d, q); }), "recommend") : [] };
    });
    var total = groups.reduce(function (n, g) { return n + g.items.length; }, 0);
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 검색</div><h1>검색 결과</h1>' +
        "<p>" + (q ? "‘" + esc(q) + "’ 검색 결과 " + '<span class="count">' + total + "건</span>" : "검색어를 입력해 주세요.") + "</p></div>" +
      '<form class="toolbar" id="searchAgain" role="search"><label class="mini-search" style="max-width:420px">' + ICON.search +
        '<span class="sr-only">다시 검색</span><input id="searchAgainInput" type="search" value="' + esc(q) + '" placeholder="맛집, 프린터, 산책길…" autocomplete="off"></label>' +
        '<button class="pill-btn" type="submit" style="height:36px;font-size:14px">검색</button></form>' +
      (q && !total ? '<div class="empty" style="margin-top:20px">‘' + esc(q) + "’에 맞는 정보가 없어요. 다른 단어로 찾아보세요.</div>" : "") +
      groups.filter(function (g) { return g.items.length; }).map(function (g) {
        return '<section class="result-group"><h2>' + SECTION_LABEL[g.sec] + ' <a href="#' + g.sec + '">' + g.items.length + "건 · 목록 보기 →</a></h2>" +
          '<div class="item-grid">' + g.items.slice(0, 9).map(function (it) { return itemHTML(it, g.sec, -1, false); }).join("") + "</div></section>";
      }).join("") +
      "</div>";
  }

  /* ---------- 커뮤니티·공지·행사 ---------- */
  function communityHTML() {
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 커뮤니티</div><h1>커뮤니티</h1><p>함께 나누는 캠퍼스 이야기</p></div>' +
      '<form class="write-box" id="writeForm">' +
        '<label for="postTitle">새 글 쓰기</label>' +
        '<div class="row"><select id="postCat" aria-label="말머리"><option>자유</option><option>질문</option><option>후기</option><option>정보</option></select>' +
        '<input id="postTitle" type="text" maxlength="80" placeholder="제목을 입력하세요" required>' +
        '<button class="pill-btn" type="submit">올리기</button></div>' +
        '<p class="hint">게시판 서버를 연결하기 전이라 새로 쓴 글은 지금 보고 있는 화면에만 보여요.</p>' +
      "</form>" +
      '<div class="board">' + state.posts.map(function (p) {
        return '<div class="board-row"><span class="tag tag--sub">' + esc(p.cat) + "</span><strong>" + esc(p.title) + "</strong><small>" + esc(p.meta) + "</small>" + tmp(p.placeholder) + "</div>";
      }).join("") + "</div></div>";
  }
  function noticeHTML() {
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 공지사항</div><h1>공지사항</h1>' +
        "<p>학교 홈페이지에 올라온 공지 중 학생들이 꼭 알아야 할 것을 모았어요. 제목을 누르면 요약이 펼쳐져요.</p>" +
        '<div class="toolbar">' + (S.noticeBoards || []).map(function (bd) {
          return '<a class="text-btn" href="' + esc(bd.url) + '" target="_blank" rel="noopener">학교 ' + esc(bd.label) + " 전체 보기 ↗</a>";
        }).join("") + "</div></div>" +
      '<div class="board">' + S.notices.map(function (n, i) {
        return '<div class="board-row notice-row"><details' + (state.openNotice === i ? " open" : "") + "><summary>" +
          (n.tag ? '<span class="tag tag--sub">' + esc(n.tag) + "</span> " : "") + esc(n.title) + tmp(n.placeholder) + "</summary>" +
          '<div class="notice-body"><p class="meta">' + esc(n.dept || "") + " · " + esc(n.date) + "</p>" +
          (n.points ? "<ul>" + n.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "<p>" + esc(n.body || "") + "</p>") +
          (n.url ? '<a class="pill-btn" href="' + esc(n.url) + '" target="_blank" rel="noopener">학교 공지 원문 보기' + ICON.arrow + "</a>" : "") +
          "</div></details><small>" + esc(n.date) + "</small></div>";
      }).join("") + "</div></div>";
  }
  function eventsHTML() {
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 교내 행사 캘린더</div><h1>교내 행사 캘린더</h1><p>놓치지 말아야 할 주요 행사</p></div>' +
      '<div class="board">' + S.events.map(function (e) {
        return '<div class="board-row"><span class="tag tag--area">' + esc(e.date) + "</span><strong>" + esc(e.title) + '<br><small style="white-space:normal">' + esc(e.desc) + "</small></strong>" + tmp(e.placeholder) + "</div>";
      }).join("") + "</div></div>";
  }

  function favoritesHTML() {
    var ids = window.Features ? Features.favIds() : [];
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 내 장소</div><h1>내 장소</h1>' +
      "<p>☆ 저장을 누른 곳이 모여요. 이 기기의 이 브라우저에만 저장돼요." + (ids.length ? ' · <span class="count">' + ids.length + "곳</span>" : "") + "</p></div>" +
      (ids.length ? '<div class="item-grid">' + ids.map(function (id) { var p = PLACE_BY_ID[id]; return itemHTML(p.it, p.sec, -1, false); }).join("") + "</div>"
        : '<div class="empty">아직 저장한 곳이 없어요. 맛집·숨은장소·생활꿀팁에서 ☆ 저장을 눌러 보세요.<br><br><a class="pill-btn" href="#food">맛집 보러 가기' + ICON.arrow + "</a></div>") +
      "</div>";
  }

  /* ---------- 렌더링 ---------- */
  function render(keepScroll) {
    var route = currentRoute();
    var y = window.scrollY;
    var html = route === "home" ? homeHTML()
      : route === "map" ? mapHTML()
      : route === "search" ? searchHTML()
      : route === "community" ? communityHTML()
      : route === "notice" ? noticeHTML()
      : route === "events" ? (window.Features ? Features.calendarPageHTML() : eventsHTML())
      : route === "bus" && window.Features ? Features.busPageHTML()
      : route === "favorites" ? favoritesHTML()
      : route === "food" && window.FoodMap ? FoodMap.html()  // 맛집: 지도 화면 (js/foodmap.js)
      : listHTML(route);
    app.innerHTML = html;
    document.body.setAttribute("data-route", route);
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.dataset.nav === route) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    bind(route);
    if (keepScroll === true) window.scrollTo(0, y); else window.scrollTo(0, 0);
  }
  function bind(route) {
    if (route === "home") {
      var po = document.getElementById("fwPickOpen");
      if (po) po.addEventListener("click", function () { Features.openPicker(); });
      document.getElementById("heroSearch").addEventListener("submit", function (e) {
        e.preventDefault(); runSearch(document.getElementById("heroSearchInput").value);
      });
      app.querySelectorAll("[data-notice]").forEach(function (a) {
        a.addEventListener("click", function () { state.openNotice = +a.dataset.notice; });
      });
      app.querySelectorAll("[data-pin]").forEach(function (a) {
        a.addEventListener("click", function () { var p = S.mapIntro.pins[+a.dataset.pin], bi = bldIndex(p.code); state.sel = bi > -1 ? { type: "bld", idx: bi } : { type: "pin", idx: +a.dataset.pin }; });
      });
      app.querySelectorAll(".menu-card").forEach(function (a) {
        a.addEventListener("click", function () {
          var st = state.list[a.getAttribute("href").slice(1)];
          if (st) { st.cat = "전체"; st.sub = "전체"; st.area = "전체"; st.q = ""; }
        });
      });
    } else if (route === "food" && window.FoodMap) {
      FoodMap.bind(app);
    } else if (state.list[route]) {
      bindList(route);
    } else if (route === "map") {
      app.querySelectorAll("[data-pin]").forEach(function (a) {
        a.addEventListener("click", function (e) { e.preventDefault(); state.sel = { type: "pin", idx: +a.dataset.pin }; render(true); });
      });
      app.querySelectorAll("[data-bld]").forEach(function (b) {
        b.addEventListener("click", function () {
          var fromList = b.classList.contains("bld");
          state.sel = { type: "bld", idx: +b.dataset.bld }; render(true);
          if (fromList) {  // 목록에서 고르면 지도 위 라벨로 올라가 보여줘요
            var on = app.querySelector(".cm-label.is-on");
            if (on) on.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
          }
        });
      });
      app.querySelectorAll("[data-scroll]").forEach(function (a) {
        a.addEventListener("click", function (e) { e.preventDefault(); var t = document.getElementById(a.dataset.scroll); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); });
      });
      app.querySelectorAll("[data-jump]").forEach(function (a) {
        a.addEventListener("click", function () {
          var st = state.list[a.dataset.jump];
          st.cat = "전체"; st.sub = "전체"; st.area = "전체"; st.q = a.dataset.name;
        });
      });
    } else if (route === "bus") {
      if (window.Features) Features.initBusPage();
    } else if (route === "search") {
      document.getElementById("searchAgain").addEventListener("submit", function (e) {
        e.preventDefault(); state.query = document.getElementById("searchAgainInput").value.trim(); render(true);
      });
    } else if (route === "community") {
      document.getElementById("writeForm").addEventListener("submit", function (e) {
        e.preventDefault();
        var t = document.getElementById("postTitle").value.trim();
        if (!t) return;
        state.posts.unshift({ cat: document.getElementById("postCat").value, title: t, meta: "나 · 방금", placeholder: false });
        render(true); toast("글을 올렸어요.");
      });
    }
  }

  initChrome();
  window.addEventListener("hashchange", function () { render(); });
  render(true);
})();
