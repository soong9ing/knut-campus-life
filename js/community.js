/* =============================================================
   로그인 · 커뮤니티 · 회원 등급 (화면)
   -------------------------------------------------------------
   - 서버: Cloudflare Worker (worker/community.js), 저장소: Cloudflare D1
   - 헤더 사람 아이콘 → 로그인 / 회원가입 / 내 정보(등급) 창
   - #community            글 목록 (분류 없이 질문·글만 올리는 게시판)
   - #community?post=12    글 보기 (좋아요 · 댓글)
   - 로그인 토큰은 이 브라우저(localStorage)에만 저장해요.
   - 서버 주소: window.SITE.apiUrl 이 있으면 그걸, 없으면 아래 기본 주소를 써요.
   ============================================================= */
(function () {
  "use strict";
  // 서버 주소 (챗봇과 같은 Cloudflare Worker). 어디서 열든 실제 서버를 써요.
  var API = String(window.COMMUNITY_API || (window.SITE && window.SITE.apiUrl) ||
    "https://knut-campus-chatbot.love-ai-worker.workers.dev").replace(/\/+$/, "");
  var BOARD = "질문";   // 분류 없이 모든 글을 한 게시판에 (서버에는 "질문"으로 저장)
  var TOKEN_KEY = "kc_token";

  var me = { token: readToken(), user: null };
  var view = { page: 1 };
  var host = null;   // 커뮤니티 화면이 그려진 #app

  /* ---------- 도우미 ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(m) { if (window.Toast) window.Toast(m); }
  function readToken() { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } }
  function saveToken(t) { me.token = t || ""; try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch (e) {} }
  function when(ms) {
    var d = Date.now() - ms, m = Math.floor(d / 60000);
    if (m < 1) return "방금";
    if (m < 60) return m + "분 전";
    if (m < 1440) return Math.floor(m / 60) + "시간 전";
    if (m < 10080) return Math.floor(m / 1440) + "일 전";
    var t = new Date(ms);
    return (t.getFullYear() !== new Date().getFullYear() ? t.getFullYear() + "." : "") + (t.getMonth() + 1) + "." + t.getDate();
  }
  function gradeBadge(g, big) {
    if (!g) return "";
    return '<span class="grade grade--l' + g.level + (big ? " grade--big" : "") + '" title="회원 등급 ' + g.level + '단계">' +
      '<span aria-hidden="true">' + esc(g.icon) + "</span> " + esc(g.name) + "</span>";
  }
  function who(a) { return '<span class="cm-who">' + gradeBadge(a.grade) + " <b>" + esc(a.nickname) + "</b></span>"; }
  function hashParam(name) {
    var q = (location.hash.split("?")[1] || "");
    var m = q.match(new RegExp("(?:^|&)" + name + "=([^&]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  }

  // 서버 요청. 실패하면 {status, code, message}로 거절해요.
  function api(method, path, body) {
    var h = {};
    if (body) h["Content-Type"] = "application/json";
    if (me.token) h.Authorization = "Bearer " + me.token;
    return fetch(API + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok) return j;
          if (r.status === 401 && me.token && j.error === "login_required") { saveToken(""); me.user = null; paintUserBtn(); }
          throw { status: r.status, code: j.error || "error", message: j.message || "요청을 처리하지 못했어요." };
        });
      }, function () {
        throw { status: 0, code: "network", message: "커뮤니티 서버에 연결할 수 없어요. 인터넷 연결을 확인하고 다시 해 주세요." };
      });
  }

  /* ---------- 로그인 상태 ---------- */
  function paintUserBtn() {
    var b = document.getElementById("userBtn");
    if (!b) return;
    b.classList.toggle("is-in", !!me.user);
    var label = me.user ? me.user.nickname + "님 · 내 정보" : "로그인";
    b.setAttribute("aria-label", label); b.title = label;
  }
  function loadMe() {
    if (!me.token) { me.user = null; paintUserBtn(); return Promise.resolve(null); }
    return api("GET", "/api/auth/me").then(function (j) { me.user = j.user; paintUserBtn(); return me.user; },
      function () { paintUserBtn(); return null; });
  }
  function setLogin(j) { saveToken(j.token); me.user = j.user; paintUserBtn(); refresh(); }

  /* ---------- 로그인 · 내 정보 창 ---------- */
  var modal = null, lastFocus = null, tab = "login";
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "modal cm-modal"; modal.hidden = true;
    modal.innerHTML = '<div class="modal-back" data-close></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="cmTitle">' +
      '<button type="button" class="modal-x" data-close aria-label="닫기">×</button><div id="cmModalBody"></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeAccount();
      var t = e.target.closest("[data-tab]");
      if (t) { tab = t.dataset.tab; paintModal(); }
      if (e.target.closest("[data-logout]")) {
        api("POST", "/api/auth/logout").catch(function () {}).then(function () {
          saveToken(""); me.user = null; paintUserBtn(); closeAccount(); refresh(); toast("로그아웃했어요.");
        });
      }
      if (e.target.closest("[data-go]")) closeAccount();
    });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAccount();
      if (e.key === "Tab") {
        var f = modal.querySelectorAll("button:not([disabled]), input, a[href]");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    modal.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, msg = f.querySelector(".cm-msg"), btn = f.querySelector("button[type=submit]");
      var v = function (n) { return (f.elements[n] && f.elements[n].value || "").trim(); };
      msg.textContent = ""; btn.disabled = true;
      var req;
      if (f.id === "cmSignup") {
        if (f.elements.password.value !== f.elements.password2.value) { msg.textContent = "비밀번호 확인이 달라요."; btn.disabled = false; return; }
        req = api("POST", "/api/auth/signup", { username: v("username"), nickname: v("nickname"), password: f.elements.password.value });
      } else {
        req = api("POST", "/api/auth/login", { username: v("username"), password: f.elements.password.value });
      }
      req.then(function (j) {
        setLogin(j);
        toast(f.id === "cmSignup" ? j.user.nickname + "님, 가입을 환영해요! 🌱" : j.user.nickname + "님, 반가워요!");
        paintModal();
      }, function (err) { msg.textContent = err.message; btn.disabled = false; });
    });
    return modal;
  }
  function field(name, label, type, extra) {
    return '<label class="cm-field"><span>' + label + '</span><input name="' + name + '" type="' + type + '" ' + (extra || "") + " required></label>";
  }
  function accountHTML() {
    if (!me.user) {
      return '<p class="modal-sec">교통정리 회원</p><h2 id="cmTitle">' + (tab === "signup" ? "회원가입" : "로그인") + "</h2>" +
        '<div class="cm-tabs" role="tablist">' +
          '<button type="button" role="tab" data-tab="login" aria-selected="' + (tab === "login") + '">로그인</button>' +
          '<button type="button" role="tab" data-tab="signup" aria-selected="' + (tab === "signup") + '">회원가입</button></div>' +
        (tab === "signup"
          ? '<form class="cm-form" id="cmSignup" novalidate>' +
              field("username", "아이디 <small>영어·숫자·_ 4~20자</small>", "text", 'autocomplete="username" maxlength="20" pattern="[A-Za-z0-9_]{4,20}"') +
              field("nickname", "닉네임 <small>한글·영어·숫자 2~12자, 게시판에 보여요</small>", "text", 'autocomplete="nickname" maxlength="12"') +
              field("password", "비밀번호 <small>8자 이상</small>", "password", 'autocomplete="new-password" minlength="8" maxlength="64"') +
              field("password2", "비밀번호 확인", "password", 'autocomplete="new-password" maxlength="64"') +
              '<p class="cm-msg" role="alert"></p><button type="submit" class="pill-btn">가입하기</button>' +
              '<p class="hint">이메일·실명은 받지 않아요. 비밀번호는 암호화해서 저장해요. 비밀번호를 잊으면 찾을 수 없으니 꼭 기억해 주세요.</p></form>'
          : '<form class="cm-form" id="cmLogin" novalidate>' +
              field("username", "아이디", "text", 'autocomplete="username" maxlength="20"') +
              field("password", "비밀번호", "password", 'autocomplete="current-password" maxlength="64"') +
              '<p class="cm-msg" role="alert"></p><button type="submit" class="pill-btn">로그인</button>' +
              '<p class="hint">아직 회원이 아니면 위의 <b>회원가입</b>을 눌러 주세요.</p></form>') +
        // 로그인하지 않아도 저장한 장소(이 브라우저에 저장됨)는 볼 수 있게
        '<div class="cm-actions"><a class="text-btn" href="#favorites" data-go>☆ 내 장소 보기 (로그인 없이)</a></div>';
    }
    var u = me.user, g = u.grade, tiers = u.tiers || [];
    var cur = tiers.filter(function (t) { return t.level === g.level; })[0] || { min: 0 };
    var pct = g.next ? Math.max(0, Math.min(100, Math.round((u.score - cur.min) / (g.next.at - cur.min) * 100))) : 100;
    var pt = u.points || { post: 5, like: 2, comment: 1 };
    return '<p class="modal-sec">내 정보</p><h2 id="cmTitle">' + esc(u.nickname) + ' <small class="cm-id">@' + esc(u.username) + "</small></h2>" +
      '<div class="cm-me">' + gradeBadge(g, true) +
        '<p class="cm-score"><b>' + u.score + "</b>점" + (g.next ? " · " + esc(g.next.icon + " " + g.next.name) + "까지 <b>" + (g.next.at - u.score) + "</b>점" : " · 최고 등급이에요!") + "</p>" +
        '<div class="cm-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="다음 등급까지 진행률"><span style="width:' + pct + '%"></span></div></div>' +
      '<ul class="cm-stats">' +
        "<li><b>" + u.stats.posts + "</b><span>쓴 글</span></li>" +
        "<li><b>" + u.stats.likes + "</b><span>받은 좋아요</span></li>" +
        "<li><b>" + u.stats.comments + "</b><span>받은 댓글</span></li></ul>" +
      '<details class="cm-tiers"><summary>등급은 어떻게 올라가요?</summary>' +
        "<p>글 1개 <b>" + pt.post + "점</b> · 받은 좋아요 1개 <b>" + pt.like + "점</b> · 받은 댓글 1개 <b>" + pt.comment + "점</b> (내 글에 단 내 댓글은 빼고 세요)</p>" +
        "<ol>" + tiers.map(function (t) {
          return '<li class="' + (t.level === g.level ? "is-now" : "") + '">' + gradeBadge(t) + " <small>" + t.min + "점부터</small></li>";
        }).join("") + "</ol></details>" +
      '<div class="cm-actions"><a class="text-btn" href="#favorites" data-go>☆ 내 장소 보기</a>' +
        '<a class="text-btn" href="#community" data-go>커뮤니티 가기</a>' +
        '<button type="button" class="chip" data-logout>로그아웃</button></div>';
  }
  function paintModal() {
    ensureModal().querySelector("#cmModalBody").innerHTML = accountHTML();
    var first = modal.querySelector("form input");
    if (first) first.focus(); else modal.querySelector(".modal-x").focus();
  }
  function openAccount(startTab) {
    lastFocus = document.activeElement;
    if (startTab) tab = startTab;
    ensureModal().hidden = false;
    document.body.style.overflow = "hidden";
    paintModal();
    if (me.user) loadMe().then(function () { if (!modal.hidden) { modal.querySelector("#cmModalBody").innerHTML = accountHTML(); } });
  }
  function closeAccount() {
    if (!modal) return;
    modal.hidden = true; document.body.style.overflow = "";
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  /* ---------- 커뮤니티 화면 ---------- */
  function html() {
    var postId = hashParam("post");
    var head = '<div class="page-head"><div class="crumb"><a href="#home">홈</a> › <a href="#community">커뮤니티</a>' + (postId ? " › 글 보기" : "") + "</div>" +
      "<h1>커뮤니티</h1><p>교통대 생활, 궁금한 건 선배들에게 물어보세요. 글과 좋아요·댓글로 회원 등급도 올라가요.</p></div>";
    return '<div class="wrap sub-page cm-page">' + head + '<div id="cmBody" aria-live="polite"><p class="cm-loading">불러오는 중이에요…</p></div></div>';
  }
  function bind(app) {
    host = app;
    var body = app.querySelector("#cmBody");
    if (!body) return;
    var postId = hashParam("post");
    loadMe().then(function () { if (postId) showPost(body, +postId); else showList(body); });
    body.addEventListener("click", onClick);
    body.addEventListener("submit", onSubmit);
  }
  function refresh() {
    if (!host || document.body.getAttribute("data-route") !== "community") return;
    host.innerHTML = html(); bind(host);
  }
  function errorBox(err) {
    return '<div class="empty">' + esc(err.message) + '<br><br><button type="button" class="pill-btn" data-retry>다시 불러오기</button></div>';
  }

  function writeBox() {
    if (!me.user) {
      return '<div class="write-box cm-login-box"><p><b>글을 쓰려면 로그인해 주세요.</b><br><span class="hint">글·좋아요·댓글이 쌓이면 회원 등급이 올라가요. 🌱 → 👑</span></p>' +
        '<div class="row"><button type="button" class="pill-btn" data-login="login">로그인</button><button type="button" class="chip" data-login="signup">회원가입</button></div></div>';
    }
    return '<form class="write-box cm-write" id="cmWrite">' +
      '<label for="cmTitleIn">새 글 쓰기 <span class="cm-as">' + gradeBadge(me.user.grade) + " " + esc(me.user.nickname) + "</span></label>" +
      '<div class="row"><input id="cmTitleIn" name="title" type="text" maxlength="80" placeholder="제목 (2~80자)" required></div>' +
      '<textarea name="body" rows="4" maxlength="3000" placeholder="궁금한 점이나 나누고 싶은 이야기를 써 주세요." required></textarea>' +
      '<div class="row cm-write-foot"><p class="cm-msg" role="alert"></p><button class="pill-btn" type="submit">올리기</button></div></form>';
  }
  function showList(body, append) {
    if (!append) view.page = 1;
    var q = "/api/community/posts?page=" + view.page;
    if (!append) body.innerHTML = '<p class="cm-loading">불러오는 중이에요…</p>';
    api("GET", q).then(function (j) {
      var rows = j.posts.map(rowHTML).join("");
      if (append) {
        var board = body.querySelector(".board"), more = body.querySelector("[data-more]");
        if (board) board.insertAdjacentHTML("beforeend", rows);
        if (more) more.parentNode.removeChild(more);
        if (j.hasMore) body.insertAdjacentHTML("beforeend", moreBtn());
        return;
      }
      body.innerHTML =
        writeBox() +
        (j.posts.length ? '<div class="board cm-list">' + rows + "</div>" + (j.hasMore ? moreBtn() : "")
          : '<div class="empty">아직 글이 없어요. 첫 글을 남겨 보세요!</div>');
    }, function (err) { if (!append) body.innerHTML = errorBox(err); else toast(err.message); });
  }
  function moreBtn() { return '<p class="cm-more"><button type="button" class="chip" data-more>글 더 보기</button></p>'; }
  function rowHTML(p) {
    return '<a class="board-row cm-row" href="#community?post=' + p.id + '">' +
      '<span class="cm-row-main"><strong>' + esc(p.title) + (p.comment_count ? ' <em class="cm-cc">[' + p.comment_count + "]</em>" : "") + "</strong>" +
        '<span class="cm-row-meta">' + who(p.author) + " · " + when(p.created_at) + "</span></span>" +
      '<small class="cm-like-n" aria-label="좋아요 ' + p.like_count + '개">♥ ' + p.like_count + "</small></a>";
  }
  function showPost(body, id) {
    body.innerHTML = '<p class="cm-loading">불러오는 중이에요…</p>';
    api("GET", "/api/community/posts/" + id).then(function (j) {
      var p = j.post;
      body.innerHTML =
        '<article class="cm-post" data-id="' + p.id + '">' +
          '<p class="cm-back"><a class="text-btn" href="#community">← 목록으로</a></p>' +
          "<h2>" + esc(p.title) + "</h2>" +
          '<p class="cm-post-meta">' + who(p.author) + " · " + when(p.created_at) + "</p>" +
          '<div class="cm-post-body">' + esc(p.body) + "</div>" +
          '<div class="cm-post-tools">' +
            (p.mine ? '<span class="cm-like-n">♥ 좋아요 ' + p.like_count + "</span>"
              : '<button type="button" class="cm-like' + (p.liked ? " is-on" : "") + '" data-like aria-pressed="' + p.liked + '">♥ 좋아요 <b>' + p.like_count + "</b></button>") +
            (p.mine ? '<button type="button" class="text-btn cm-del" data-del-post>글 삭제</button>' : "") +
          "</div>" +
        "</article>" +
        '<section class="cm-comments" aria-label="댓글"><h3>댓글 <span class="count">' + j.comments.length + "</span></h3>" +
          (j.comments.length ? '<ul class="board">' + j.comments.map(function (c) {
            return '<li class="board-row cm-comment"><div><p class="cm-row-meta">' + who(c.author) + " · " + when(c.created_at) +
              (c.mine ? ' <button type="button" class="text-btn cm-del" data-del-comment="' + c.id + '">삭제</button>' : "") + "</p>" +
              '<p class="cm-comment-body">' + esc(c.body) + "</p></div></li>";
          }).join("") + "</ul>" : '<p class="hint">첫 댓글을 남겨 보세요.</p>') +
          (me.user
            ? '<form class="write-box cm-cform" id="cmComment"><label for="cmCommentIn">댓글 쓰기</label>' +
                '<textarea id="cmCommentIn" name="body" rows="2" maxlength="500" placeholder="따뜻한 댓글은 글쓴이의 등급을 올려 줘요 (500자까지)" required></textarea>' +
                '<div class="row cm-write-foot"><p class="cm-msg" role="alert"></p><button class="pill-btn" type="submit">댓글 달기</button></div></form>'
            : '<div class="write-box cm-login-box"><p>댓글을 달려면 로그인해 주세요.</p><div class="row"><button type="button" class="pill-btn" data-login="login">로그인</button></div></div>') +
        "</section>";
    }, function (err) {
      body.innerHTML = err.status === 404
        ? '<div class="empty">' + esc(err.message) + '<br><br><a class="pill-btn" href="#community">목록으로</a></div>'
        : errorBox(err);
    });
  }

  function onClick(e) {
    var body = e.currentTarget, t;
    if (e.target.closest("[data-more]")) { view.page++; showList(body, true); return; }
    if ((t = e.target.closest("[data-login]"))) { openAccount(t.dataset.login); return; }
    if (e.target.closest("[data-retry]")) { refresh(); return; }
    var art = body.querySelector(".cm-post"), id = art && art.dataset.id;
    if ((t = e.target.closest("[data-like]"))) {
      if (!me.user) { openAccount("login"); return; }
      t.disabled = true;
      api("POST", "/api/community/posts/" + id + "/like").then(function (j) {
        t.classList.toggle("is-on", j.liked); t.setAttribute("aria-pressed", j.liked);
        t.querySelector("b").textContent = j.like_count; t.disabled = false;
      }, function (err) { toast(err.message); t.disabled = false; });
      return;
    }
    if (e.target.closest("[data-del-post]")) {
      if (!confirm("이 글을 삭제할까요? 댓글과 좋아요도 함께 지워지고, 등급 점수에서도 빠져요.")) return;
      api("DELETE", "/api/community/posts/" + id).then(function () { toast("글을 삭제했어요."); location.hash = "#community"; loadMe(); },
        function (err) { toast(err.message); });
      return;
    }
    if ((t = e.target.closest("[data-del-comment]"))) {
      if (!confirm("댓글을 삭제할까요?")) return;
      api("DELETE", "/api/community/comments/" + t.dataset.delComment).then(function () { toast("댓글을 삭제했어요."); showPost(body, +id); },
        function (err) { toast(err.message); });
    }
  }
  function onSubmit(e) {
    e.preventDefault();
    var f = e.target, body = e.currentTarget, msg = f.querySelector(".cm-msg"), btn = f.querySelector("button[type=submit]");
    msg.textContent = ""; btn.disabled = true;
    if (f.id === "cmWrite") {
      api("POST", "/api/community/posts", { board: BOARD, title: f.elements.title.value, body: f.elements.body.value })
        .then(function (j) { toast("글을 올렸어요! +5점"); loadMe(); location.hash = "#community?post=" + j.id; },
          function (err) { msg.textContent = err.message; btn.disabled = false; });
    } else if (f.id === "cmComment") {
      var id = body.querySelector(".cm-post").dataset.id;
      api("POST", "/api/community/posts/" + id + "/comments", { body: f.elements.body.value })
        .then(function () { showPost(body, +id); }, function (err) { msg.textContent = err.message; btn.disabled = false; });
    }
  }

  window.Community = { html: html, bind: bind, openAccount: openAccount, me: function () { return me.user; } };
  loadMe();
})();
