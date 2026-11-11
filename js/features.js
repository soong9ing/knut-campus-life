/* =============================================================
   편의 기능 모음
   1) 교내 버스 지도·실시간 도착 (data/bus.js)
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
  var SITE = window.SITE || {}, P = window.PLACES || {}, BUS = window.BUS || {}, CAL = window.CALENDAR || { events: [] };
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
     1) 버스 — 충주캠퍼스 정류장 지도 + 실시간 도착 (TAGO API)
     ============================================================= */
  var TAGO = "https://apis.data.go.kr/1613000/";
  var busMap = null, busTimer = null, busTick = null, busSel = null, busStops = [], busMarkers = {};
  var STOP_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="14" rx="3"/><path d="M5 11h14M8.5 17.5v2.5M15.5 17.5v2.5"/><circle cx="8.5" cy="14.3" r=".9"/><circle cx="15.5" cy="14.3" r=".9"/></svg>';

  function tagoURL(path, params) {
    var q = "serviceKey=" + encodeURIComponent(BUS.serviceKey) + "&_type=json&numOfRows=100&pageNo=1";
    Object.keys(params).forEach(function (k) { q += "&" + k + "=" + encodeURIComponent(params[k]); });
    var url = TAGO + path + "?" + q;
    return BUS.proxy ? BUS.proxy + encodeURIComponent(url) : url;
  }
  // TAGO 응답의 item은 배열·객체 하나·빈 문자열 중 하나라서 항상 배열로 바꿔요
  function tagoItems(json) {
    var h = json && json.response && json.response.header;
    if (h && h.resultCode && h.resultCode !== "00") throw new Error(h.resultMsg || "API 오류");
    var items = json && json.response && json.response.body && json.response.body.items;
    var it = items && items.item;
    return !it ? [] : Array.isArray(it) ? it : [it];
  }
  function tago(path, params) {
    return fetch(tagoURL(path, params)).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    }).then(function (t) {
      try { return tagoItems(JSON.parse(t)); }
      catch (e) {
        if (/SERVICE_KEY|SERVICE KEY|인증/i.test(t)) throw new Error("인증키 오류");
        throw e;
      }
    });
  }
  function distM(a, b) {
    var R = 6371000, toR = Math.PI / 180;
    var dLa = (b[0] - a[0]) * toR, dLo = (b[1] - a[1]) * toR;
    var x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function stopName(s) { return (BUS.names && BUS.names[s.nodeid]) || s.nodenm; }

  // 캠퍼스가 넓어서 가운데 + 동서남북 다섯 곳 주변 정류장을 모아요 (하루 동안 이 브라우저에 저장)
  function loadStops() {
    var key = "knut-bus-stops-v1", cached = load(key, null), c = BUS.center;
    if (cached && cached.day === ymd(new Date()) && cached.center === c.join(",") && cached.stops.length) return Promise.resolve(cached.stops);
    var d = 0.0036, pts = [c, [c[0] + d, c[1]], [c[0] - d, c[1]], [c[0], c[1] + d * 1.25], [c[0], c[1] - d * 1.25]];
    return Promise.all(pts.map(function (p) {
      return tago("BusSttnInfoInqireService/getCrdntPrxmtSttnList", { gpsLati: p[0], gpsLong: p[1] }).catch(function (e) { return e; });
    })).then(function (res) {
      var seen = {}, out = [], err = null;
      res.forEach(function (list) {
        if (list instanceof Error) { err = list; return; }
        list.forEach(function (s) {
          if (seen[s.nodeid]) return; seen[s.nodeid] = 1;
          var pos = [+s.gpslati, +s.gpslong];
          if (distM(c, pos) <= (BUS.radius || 900)) out.push({ nodeid: s.nodeid, nodenm: s.nodenm, nodeno: s.nodeno, citycode: s.citycode, pos: pos });
        });
      });
      if (!out.length && err) throw err;
      save(key, { day: ymd(new Date()), center: c.join(","), stops: out });
      return out;
    });
  }

  /* ---------- 지도 불러오기 ----------
     1순위: MapLibre + OpenFreeMap (키 없음) — 색을 직접 칠하고 건물·가게 이름을 숨길 수 있어요
     2순위: 그게 안 되는 기기면 Leaflet + OpenStreetMap 그림 지도 */
  function loadAsset(tag, url) {
    return new Promise(function (ok, no) {
      var el = document.createElement(tag);
      if (tag === "link") { el.rel = "stylesheet"; el.href = url; ok(); } else { el.src = url; el.onload = ok; el.onerror = no; }
      document.head.appendChild(el);
    });
  }
  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    loadAsset("link", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css");
    return loadAsset("script", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js").then(function () { return window.L; });
  }
  function loadMapLibre() {
    if (window.maplibregl) return Promise.resolve(window.maplibregl);
    loadAsset("link", "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css");
    return loadAsset("script", "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js").then(function () {
      if (!window.maplibregl || (maplibregl.supported && !maplibregl.supported())) throw new Error("no webgl");
      return window.maplibregl;
    });
  }
  // 카카오맵 느낌으로 다시 칠하기: 캠퍼스 연파랑 · 강 하늘색 · 건물/가게 이름 숨김
  function restyle(map) {
    var C = BUS.mapColors || {};
    var layers = map.getStyle().layers || [];
    var HIDE = ["housenumber", "aerodrome_label", "mountain_peak"];
    // 장소 이름 중 가게·식당·편의점 같은 것만 숨기고, 학교 건물 이름은 남겨요
    var SHOPS = BUS.hidePlaceTypes || ["shop", "grocery", "convenience", "supermarket", "restaurant", "fast_food", "cafe", "bar", "beer", "pub",
      "ice_cream", "bakery", "alcohol_shop", "clothing_store", "hardware", "furniture", "jewelry", "mobile_phone", "music", "shoes",
      "toys", "florist", "gift", "laundry", "hairdresser", "beauty", "bank", "atm", "fuel", "car", "car_rental", "bicycle",
      "lodging", "pharmacy", "dentist", "doctors", "veterinary", "cinema", "theatre", "attraction", "marketplace", "optician",
      "stationery", "books", "art_gallery", "dog_park", "golf", "post", "bus", "railway"];
    var isShop = ["in", ["coalesce", ["get", "class"], ""], ["literal", SHOPS]];
    var firstAbove = null;
    layers.forEach(function (l) {
      var sl = l["source-layer"];
      try {
        if (l.type === "symbol" && HIDE.indexOf(sl) > -1) map.setLayoutProperty(l.id, "visibility", "none");
        if (l.type === "fill-extrusion") map.setLayoutProperty(l.id, "visibility", "none");
        if (sl === "water" && l.type === "fill") map.setPaintProperty(l.id, "fill-color", C.water || "#a8d8f0");
        if (sl === "waterway" && l.type === "line") map.setPaintProperty(l.id, "line-color", C.water || "#a8d8f0");
        if (sl === "building" && l.type === "fill") { map.setPaintProperty(l.id, "fill-color", C.building || "#f4f6f8"); map.setPaintProperty(l.id, "fill-outline-color", "#d9dee4"); }
        if (l.type === "symbol" && sl === "poi") {
          map.setPaintProperty(l.id, "text-opacity", ["case", isShop, 0, 1]);
          map.setPaintProperty(l.id, "icon-opacity", ["case", isShop, 0, 1]);
          map.setLayoutProperty(l.id, "text-field", ["coalesce", ["get", "name:ko"], ["get", "name"]]);
        }
        if (l.type === "symbol" && ["transportation_name", "place", "water_name"].indexOf(sl) > -1)
          map.setLayoutProperty(l.id, "text-field", ["coalesce", ["get", "name:ko"], ["get", "name"]]);
      } catch (e) {}
      if (!firstAbove && (sl === "building" || sl === "transportation")) firstAbove = l.id;
    });
    try {
      map.addLayer({
        id: "knut-campus", type: "fill", source: "openmaptiles", "source-layer": "landuse",
        filter: ["in", ["get", "class"], ["literal", ["university", "college", "school"]]],
        paint: { "fill-color": C.campus || "#d3e5f6", "fill-opacity": 0.85 }
      }, firstAbove || undefined);
    } catch (e) {}
  }
  function makeMap(el) {
    return loadMapLibre().then(function (ml) {
      return new Promise(function (ok, no) {
        var map = new ml.Map({
          container: el, style: BUS.mapStyle || "https://tiles.openfreemap.org/styles/liberty",
          center: [BUS.center[1], BUS.center[0]], zoom: (BUS.zoom || 16) - 0.5,
          attributionControl: { compact: true }, dragRotate: false, pitchWithRotate: false
        });
        if (map.touchZoomRotate) map.touchZoomRotate.disableRotation();
        map.addControl(new ml.NavigationControl({ showCompass: false }), "top-left");
        var done = false;
        map.on("load", function () { done = true; restyle(map); ok(map); });
        map.on("error", function (e) { if (!done) { done = true; try { map.remove(); } catch (x) {} no(e.error || e); } });
        setTimeout(function () { if (!done) { done = true; try { map.remove(); } catch (x) {} no(new Error("timeout")); } }, 12000);
      }).then(function (map) {
        return {
          remove: function () { map.remove(); },
          add: function (pos, node, z) {
            // 지도 라이브러리가 바깥 상자의 위치를 움직이고, 안쪽 핀은 우리 CSS(확대 효과 등)를 그대로 써요
            var box = document.createElement("div");
            box.className = "map-mark"; box.style.zIndex = z || 1; box.appendChild(node);
            new ml.Marker({ element: box, anchor: "center" }).setLngLat([pos[1], pos[0]]).addTo(map);
            return { setTop: function (on) { box.style.zIndex = on ? 1000 : (z || 1); } };
          },
          fit: function (pts) {
            var b = new ml.LngLatBounds();
            pts.forEach(function (p) { b.extend([p[1], p[0]]); });
            map.fitBounds(b, { padding: 50, maxZoom: 16.8, duration: 0 });
          },
          panTo: function (pos) { map.easeTo({ center: [pos[1], pos[0]], duration: 400 }); }
        };
      });
    }).catch(function () {
      // 예비: Leaflet + OpenStreetMap
      el.innerHTML = "";
      return loadLeaflet().then(function (L) {
        var map = L.map(el, { scrollWheelZoom: false }).setView(BUS.center, BUS.zoom || 16);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return {
          remove: function () { map.remove(); },
          add: function (pos, node, z) {
            var m = L.marker(pos, { icon: L.divIcon({ className: "", html: "", iconSize: null }), zIndexOffset: z || 0, keyboard: false }).addTo(map);
            var holder = m.getElement ? m.getElement() : null;
            var box = document.createElement("div");
            box.className = "map-mark map-mark--leaflet"; box.appendChild(node);
            if (holder) holder.appendChild(box);
            return { setTop: function (on) { m.setZIndexOffset(on ? 1000 : (z || 0)); } };
          },
          fit: function (pts) { map.fitBounds(pts, { padding: [30, 30], maxZoom: 17 }); },
          panTo: function (pos) { map.panTo(pos); }
        };
      });
    });
  }

  // 남은 초 → "4분 12초" (1초마다 줄어들어요)
  function arrText(sec) {
    sec = Math.max(0, Math.round(sec));
    if (sec <= 30) return "곧 도착";
    var m = Math.floor(sec / 60), r = sec % 60;
    return (m ? m + "분 " : "") + r + "초";
  }
  function tickArr() {
    document.querySelectorAll(".arr-time[data-due]").forEach(function (el) {
      var left = (+el.dataset.due - Date.now()) / 1000;
      el.textContent = arrText(left);
      el.classList.toggle("is-soon", left < 180);
    });
  }
  function panelHTML(s, list, err) {
    var main = BUS.mainBuses || [];
    var body;
    if (err) body = '<p class="arr-empty">도착 정보를 불러오지 못했어요. 잠시 후 다시 눌러 주세요.<br><small>' + esc(err) + "</small></p>";
    else if (!list) body = '<p class="arr-empty">불러오는 중…</p>';
    else if (!list.length) body = '<p class="arr-empty">지금 이 정류장으로 오고 있는 버스가 없어요.<br><small>주말·공휴일·방학이거나 운행 시간이 끝났을 수 있어요.</small></p>';
    else {
      list = list.slice().sort(function (a, b) { return (+a.arrtime) - (+b.arrtime); });
      body = '<ul class="arr-list">' + list.map(function (a) {
        var no = String(a.routeno), hot = main.indexOf(no) > -1, soon = +a.arrtime < 180, due = Date.now() + (+a.arrtime) * 1000;
        return '<li class="' + (hot ? "is-main" : "") + '"><span class="arr-no">' + esc(no) + "</span>" +
          '<span class="arr-where">' + esc(a.arrprevstationcnt) + "정거장 전" + (a.vehicletp && /저상/.test(a.vehicletp) ? " · 저상" : "") + "</span>" +
          '<b class="arr-time' + (soon ? " is-soon" : "") + '" data-due="' + due + '">' + esc(arrText(+a.arrtime)) + "</b></li>";
      }).join("") + "</ul>";
    }
    var t = new Date();
    return '<div class="arr-head"><div><h3>' + esc(stopName(s)) + "</h3>" +
      '<p class="arr-meta">' + (s.nodeno ? "정류장 번호 " + esc(s.nodeno) + " · " : "") + (list ? pad(t.getHours()) + ":" + pad(t.getMinutes()) + " 기준" : "") + "</p></div>" +
      '<button type="button" class="arr-btn" id="arrRefresh" aria-label="새로고침">↻</button>' +
      '<button type="button" class="arr-btn" id="arrClose" aria-label="닫기">✕</button></div>' + body +
      '<p class="arr-id">ID ' + esc(s.nodeid) + " · " + (BUS.refreshSec || 30) + "초마다 자동으로 새로고침해요</p>";
  }
  function showStop(s) {
    busSel = s;
    var panel = document.getElementById("busPanel");
    if (!panel) return;
    panel.hidden = false;
    var render = function (list, err) {
      if (busSel !== s || !document.getElementById("busPanel")) return;
      panel.innerHTML = panelHTML(s, list, err);
      document.getElementById("arrRefresh").onclick = function () { fetchArr(); };
      document.getElementById("arrClose").onclick = function () { closeStop(); };
    };
    var fetchArr = function () {
      tago("ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList", { cityCode: s.citycode, nodeId: s.nodeid })
        .then(function (list) { render(list); }, function (e) { render(null, e.message); });
    };
    render(null);
    fetchArr();
    clearInterval(busTimer); clearInterval(busTick);
    busTick = setInterval(function () {
      if (!document.getElementById("busPanel") || busSel !== s) return clearInterval(busTick);
      tickArr();
    }, 1000);
    busTimer = setInterval(function () {
      if (!document.getElementById("busPanel") || busSel !== s) return clearInterval(busTimer);
      if (!document.hidden) fetchArr();
    }, (BUS.refreshSec || 30) * 1000);
    document.querySelectorAll(".stop-pin").forEach(function (el) { el.classList.toggle("is-on", el.dataset.id === s.nodeid); });
    Object.keys(busMarkers).forEach(function (id) { busMarkers[id].setTop(id === s.nodeid); });
    document.querySelectorAll("[data-stop]").forEach(function (el) { el.setAttribute("aria-pressed", el.dataset.stop === s.nodeid ? "true" : "false"); });
    if (busMap) busMap.panTo(s.pos);
  }
  function closeStop() {
    busSel = null; clearInterval(busTimer); clearInterval(busTick);
    var p = document.getElementById("busPanel"); if (p) { p.hidden = true; p.innerHTML = ""; }
    document.querySelectorAll(".stop-pin.is-on").forEach(function (el) { el.classList.remove("is-on"); });
    document.querySelectorAll('[data-stop][aria-pressed="true"]').forEach(function (el) { el.setAttribute("aria-pressed", "false"); });
  }

  function busWidgetHTML() {
    return '<a class="fw-card fw-bus" id="fwBus" href="#bus" aria-label="실시간 버스 지도 열기">' +
      '<span class="fw-bus-map" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.3"/></svg>실시간 버스 지도</span>' +
      '<p class="fw-sub">충주캠퍼스 정류장을 지도에서 눌러 보세요. 버스가 몇 정거장 전인지, 몇 분 뒤 오는지 바로 보여요.</p>' +
    "</a>";
  }
  function busPageHTML() {
    return '<div class="wrap sub-page">' +
      '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › 교내 버스</div><h1>교내 버스 실시간</h1>' +
      "<p>충주캠퍼스 주변 정류장이에요. 지도에서 정류장을 누르면 그 정류장에 올 버스가 몇 정거장 전에 있는지, 몇 분 뒤 도착하는지 보여요. 같은 이름의 정류장이 길 양쪽에 있으니 <b>정류장 번호</b>와 위치를 꼭 확인하세요.</p>" +
      (BUS.notice ? '<p class="hint">' + esc(BUS.notice) + "</p>" : "") + "</div>" +
      '<div class="bus-layout">' +
        '<div class="bus-map-wrap"><div id="busMap" class="bus-map" role="application" aria-label="충주캠퍼스 버스 정류장 지도"></div>' +
          '<div id="busPanel" class="arr-panel" hidden aria-live="polite"></div></div>' +
        '<aside class="bus-side"><h2>정류장</h2><div id="busList" class="stop-list"><p class="hint">정류장을 불러오는 중…</p></div></aside>' +
      "</div>" +
      (BUS.contact ? '<p class="hint bus-contact">버스 문의: ' + esc(BUS.contact) + " · 실시간 정보: 국토교통부 TAGO</p>" : "") +
    "</div>";
  }
  function initBusPage() {
    busSel = null; clearInterval(busTimer); clearInterval(busTick);
    var listEl = document.getElementById("busList");
    var el = document.getElementById("busMap");
    if (busMap) { try { busMap.remove(); } catch (e) {} busMap = null; }
    makeMap(el).then(function (map) {
      if (!document.getElementById("busMap")) return map.remove();
      busMap = map; busMarkers = {};
      var campus = document.createElement("div");
      campus.className = "campus-pin"; campus.innerHTML = "<span>한국교통대 충주캠퍼스</span>";
      map.add(BUS.center, campus, 0);
      if (!BUS.serviceKey) {
        listEl.innerHTML = '<p class="hint"><b>실시간 정보를 켜려면 인증키가 필요해요.</b><br>data/bus.js 맨 위 설명대로 공공데이터포털 인증키를 serviceKey에 넣어 주세요.</p>';
        return;
      }
      loadStops().then(function (stops) {
        if (!document.getElementById("busMap")) return;
        var norm = function (x) { return String(x || "").replace(/\s+/g, ""); };
        var hideN = (BUS.hideNames || []).map(norm);
        stops = stops.filter(function (s) { return (BUS.hide || []).indexOf(s.nodeid) < 0 && hideN.indexOf(norm(s.nodenm)) < 0; })
          .sort(function (a, b) { return distM(BUS.center, a.pos) - distM(BUS.center, b.pos); });
        busStops = stops;
        if (!stops.length) { listEl.innerHTML = '<p class="hint">주변 정류장을 찾지 못했어요.</p>'; return; }
        stops.forEach(function (s) {
          var pin = document.createElement("span");
          pin.className = "stop-pin"; pin.dataset.id = s.nodeid; pin.title = stopName(s);
          pin.setAttribute("role", "button"); pin.setAttribute("aria-label", stopName(s));
          pin.innerHTML = STOP_SVG + "<em>" + esc(stopName(s)) + "</em>";
          pin.addEventListener("click", function (e) { e.stopPropagation(); showStop(s); });
          busMarkers[s.nodeid] = map.add(s.pos, pin, 2);
        });
        map.fit(stops.map(function (s) { return s.pos; }));
        listEl.innerHTML = '<ul>' + stops.map(function (s) {
          return '<li><button type="button" class="stop-item" data-stop="' + esc(s.nodeid) + '" aria-pressed="false">' +
            '<span>' + esc(stopName(s)) + "</span><small>" + (s.nodeno ? "번호 " + esc(s.nodeno) + " · " : "") + Math.round(distM(BUS.center, s.pos)) + "m</small></button></li>";
        }).join("") + "</ul>";
        listEl.querySelectorAll("[data-stop]").forEach(function (b) {
          b.addEventListener("click", function () {
            var s = busStops.filter(function (x) { return x.nodeid === b.dataset.stop; })[0];
            if (s) { showStop(s); document.getElementById("busMap").scrollIntoView({ behavior: "smooth", block: "start" }); }
          });
        });
      }).catch(function (e) {
        listEl.innerHTML = '<p class="hint">정류장 정보를 불러오지 못했어요. (' + esc(e.message) + ")<br>인증키가 맞는지, 승인된 지 1~2시간이 지났는지 확인해 주세요.</p>";
      });
    }).catch(function () {
      var el2 = document.getElementById("busMap");
      if (el2) el2.innerHTML = '<p class="hint" style="padding:16px">지도를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.</p>';
    });
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
    // 새 버전이 올라오면 한 번만 자동으로 새로고침해서 새 화면을 보여 줘요
    var hadSW = !!navigator.serviceWorker.controller, reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (hadSW && !reloaded) { reloaded = true; location.reload(); }
    });
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
    busWidgetHTML: busWidgetHTML, busPageHTML: busPageHTML, initBusPage: initBusPage,
    ddayWidgetHTML: ddayWidgetHTML, calendarPageHTML: calendarPageHTML,
    isFav: isFav, toggleFav: toggleFav, favButtonHTML: favButtonHTML, favIds: favIds, onFav: function (fn) { favListeners.push(fn); },
    openStatus: openStatus, openBadgeHTML: openBadgeHTML,
    pickWidgetHTML: pickWidgetHTML, openPicker: openPicker,
    reportAvailable: reportAvailable, reportHTML: reportHTML
  };
})();
