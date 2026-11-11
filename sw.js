/* 오프라인용 캐시: 한 번 연 화면과 정보는 인터넷이 약해도 보여요.
   파일을 고친 뒤에는 VERSION 숫자를 올려 주세요. (그래야 새 파일로 바뀌어요) */
var VERSION = "campus-life-v24";
var CORE = ["./", "./index.html", "./manifest.webmanifest",
  "./css/style.css", "./js/social.js", "./js/features.js", "./js/app.js", "./js/chat.js",
  "./data/site.js", "./data/places.js", "./data/floors.js", "./data/notices.js", "./data/bus.js", "./data/calendar.js",
  "./assets/img/hero-campus.jpg", "./assets/img/logo-knut.png", "./assets/img/logo-knut-white.png", "./assets/img/icon-192.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// 사이트 파일: 인터넷 먼저(최신 정보), 안 되면 저장본 / 그림: 저장본 먼저
self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  var isImg = /\.(png|jpe?g|webp|svg)$/.test(url.pathname);
  if (isImg) {
    e.respondWith(caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); }); return res; });
    }));
    return;
  }
  // no-cache: 브라우저에 저장된 옛 파일 대신 항상 GitHub에 새 파일이 있는지 확인해요
  var req = e.request.mode === "navigate" ? e.request : new Request(e.request, { cache: "no-cache" });
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); }); return res;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }).then(function (hit) { return hit || caches.match("./index.html"); }); }));
});
