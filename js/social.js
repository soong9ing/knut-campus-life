/* =============================================================
   후기(별점 5점 만점)와 좋아요
   -------------------------------------------------------------
   저장소: Claude 아티팩트 공유 저장소(db)
     people/<사용자 id>  = { reviews: { 장소id: {rating, text, anon, at} },
                             likes:   { 장소id: true } }
   - 모두 읽고, 각자 자기 문서만 써요 (규칙은 게시할 때 설정).
   - 다른 서버(Firebase 등)로 옮길 때는 아래 "저장소 연결" 부분만 바꾸면 돼요.
   ============================================================= */
(function () {
  "use strict";

  var listeners = [];
  var S = {
    status: "loading",    // loading | ready | off (저장소를 쓸 수 없는 화면) | readonly
    me: null,             // 내 사용자 id
    isOwner: false,
    myDoc: { reviews: {}, likes: {} },
    people: {},           // uid → 문서
    agg: {}               // 장소id → {sum, n, likes, reviews:[...]}
  };
  var db = null, user = null, writing = Promise.resolve();

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function emit() { listeners.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function clean(doc) {
    var d = doc && typeof doc === "object" ? doc : {};
    return {
      reviews: d.reviews && typeof d.reviews === "object" ? d.reviews : {},
      likes: d.likes && typeof d.likes === "object" ? d.likes : {}
    };
  }
  function aggregate() {
    var agg = {};
    function slot(pid) { return agg[pid] || (agg[pid] = { sum: 0, n: 0, likes: 0, reviews: [] }); }
    Object.keys(S.people).forEach(function (uid) {
      var d = S.people[uid];
      Object.keys(d.likes).forEach(function (pid) { if (d.likes[pid] === true) slot(pid).likes++; });
      Object.keys(d.reviews).forEach(function (pid) {
        var r = d.reviews[pid];
        var rating = Math.round(Number(r && r.rating));
        if (!(rating >= 1 && rating <= 5)) return;
        var a = slot(pid);
        a.sum += rating; a.n++;
        a.reviews.push({ uid: uid, rating: rating, text: String(r.text || "").slice(0, 500), anon: r.anon !== false, at: Number(r.at) || 0 });
      });
    });
    Object.keys(agg).forEach(function (pid) { agg[pid].reviews.sort(function (a, b) { return b.at - a.at; }); });
    S.agg = agg;
  }

  /* ---------- 저장소 연결 ---------- */
  function init() {
    if (!window.claude || typeof window.claude.use !== "function") { S.status = "nohost"; emit(); return; }
    Promise.all([window.claude.use("db"), window.claude.use("user")]).then(function (res) {
      db = res[0]; user = res[1];
      if (!db || !user) { S.status = "off"; emit(); return; }
      return Promise.all([user.id(), user.isOwner(), user.can("data.write")]).then(function (v) {
        S.me = v[0]; S.isOwner = v[1];
        S.status = !S.me || v[2] === false ? "readonly" : "ready";
        db.collection("people").onSnapshot(function (snap) {
          var people = {};
          snap.docs.forEach(function (d) { if (d.exists) people[d.id] = clean(d.data()); });
          S.people = people;
          if (S.me && people[S.me]) S.myDoc = JSON.parse(JSON.stringify(people[S.me]));
          aggregate(); emit();
        }, function (e) {
          console.warn("후기 불러오기 실패", e && e.code);
          S.status = "off"; emit();
        });
      });
    }).catch(function () { S.status = "off"; emit(); });
  }
  // 내 문서 저장: 한 번에 하나씩 차례대로
  function saveMine() {
    var body = JSON.parse(JSON.stringify(S.myDoc));
    writing = writing.then(function () {
      return db.doc("people/" + S.me).set(body);
    }).catch(function (e) {
      if (e && e.code === "invalid_argument") { S.status = "readonly"; emit(); }
      throw e;
    });
    return writing;
  }
  function saveOther(uid, body) {
    writing = writing.then(function () { return db.doc("people/" + uid).set(body); });
    return writing;
  }

  /* ---------- 공개 함수 ---------- */
  var Social = {
    onChange: function (fn) { listeners.push(fn); },
    status: function () { return S.status; },
    stats: function (pid) {
      var a = S.agg[pid] || { sum: 0, n: 0, likes: 0, reviews: [] };
      return { avg: a.n ? a.sum / a.n : 0, n: a.n, likes: a.likes, reviews: a.reviews };
    },
    liked: function (pid) { return S.myDoc.likes[pid] === true; },
    myReview: function (pid) { return S.myDoc.reviews[pid] || null; },
    canWrite: function () { return S.status === "ready"; },
    toggleLike: function (pid) {
      if (!Social.canWrite()) return Promise.reject({ code: S.status });
      if (S.myDoc.likes[pid]) delete S.myDoc.likes[pid]; else S.myDoc.likes[pid] = true;
      S.people[S.me] = JSON.parse(JSON.stringify(S.myDoc)); aggregate(); emit();
      return saveMine();
    },
    saveReview: function (pid, rating, text, anon) {
      if (!Social.canWrite()) return Promise.reject({ code: S.status });
      S.myDoc.reviews[pid] = { rating: rating, text: text, anon: !!anon, at: Date.now() };
      S.people[S.me] = JSON.parse(JSON.stringify(S.myDoc)); aggregate(); emit();
      return saveMine();
    },
    deleteReview: function (pid, uid) {
      if (!uid || uid === S.me) {
        delete S.myDoc.reviews[pid];
        S.people[S.me] = JSON.parse(JSON.stringify(S.myDoc)); aggregate(); emit();
        return saveMine();
      }
      // 관리자(소유자)가 다른 사람 후기 삭제
      var body = JSON.parse(JSON.stringify(S.people[uid] || { reviews: {}, likes: {} }));
      delete body.reviews[pid];
      S.people[uid] = body; aggregate(); emit();
      return saveOther(uid, body);
    },
    isMe: function (uid) { return uid === S.me; },
    isOwner: function () { return S.isOwner; },
    names: function (uids) {
      if (!user || !uids.length) return Promise.resolve({});
      return user.profiles(uids);
    },
    esc: esc
  };
  window.Social = Social;
  init();
})();
