/* =====================================================================
   Religion/religion.js — بيرسم كروت الركن الديني ويفتح كل صفحة فل-سكرين.
   بيتحمّل بسطر واحد في index.html:  <script src="./Religion/religion.js" defer></script>
   ===================================================================== */
(function () {
  'use strict';
  var script = document.currentScript;
  var BASE = script && script.src ? script.src.replace(/[^\/]*$/, '') : './Religion/';
  var PAGES = [];
  var overlay = null, frame = null, openId = null;

  var CSS = '\
.rl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:18px}\
.rl-card{position:relative;display:flex;flex-direction:column;overflow:hidden;border-radius:24px;color:#fff;cursor:pointer;text-decoration:none;box-shadow:0 16px 35px rgba(15,23,42,.14);transition:transform .25s ease,box-shadow .25s ease}\
.rl-card:hover{transform:translateY(-7px);box-shadow:0 28px 55px rgba(15,23,42,.2)}\
.rl-img{height:190px;overflow:hidden;background:rgba(0,0,0,.15)}\
.rl-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}\
.rl-card:hover .rl-img img{transform:scale(1.06)}\
.rl-body{padding:18px 22px 22px;position:relative}\
.rl-body h3{font-size:20px;font-weight:900;margin:0 0 6px;line-height:1.5}\
.rl-body p{font-size:12px;line-height:1.9;margin:0;color:rgba(255,255,255,.88)}\
.rl-go{margin-top:14px;font-size:11px;font-weight:900}\
#rl-overlay{position:fixed;inset:0;z-index:2147483000;display:none;background:#0b1411}\
#rl-overlay iframe{width:100%;height:100%;border:0;display:block;background:#fff}\
';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pageUrl(p) { return p.url || (BASE + encodeURIComponent(p.folder) + '/index.html'); }
  function coverUrl(p) {
    var c = p.cover || 'cover.svg';
    return /^(https?:|\/|data:)/.test(c) ? c : BASE + encodeURIComponent(p.folder) + '/' + c;
  }

  function injectCss() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function render() {
    var grid = document.getElementById('islamic-grid');
    if (!grid || !PAGES.length) return;
    grid.innerHTML = '<div class="rl-grid">' + PAGES.map(function (p) {
      return '<a class="rl-card" data-rl="' + esc(p.id) + '" style="background:' + esc(p.gradient || 'linear-gradient(135deg,#064e3b,#059669)') + '">' +
        '<div class="rl-img"><img src="' + esc(coverUrl(p)) + '" alt="' + esc(p.title) + '" loading="lazy"></div>' +
        '<div class="rl-body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.desc || '') + '</p>' +
        '<div class="rl-go">افتح الصفحة ←</div></div></a>';
    }).join('') + '</div>';
    grid.onclick = function (e) {
      var card = e.target.closest ? e.target.closest('.rl-card') : null;
      if (!card) return;
      e.preventDefault();
      open(card.getAttribute('data-rl'));
    };
  }

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'rl-overlay';
    frame = document.createElement('iframe');
    frame.title = 'الركن الديني';
    frame.setAttribute('allow', 'geolocation; clipboard-write; fullscreen');
    overlay.appendChild(frame);
    document.body.appendChild(overlay);
  }

  function open(id) {
    var p = PAGES.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    ensureOverlay();
    frame.src = pageUrl(p);
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    openId = id;
    try { history.pushState({ religion: id }, '', location.href); } catch (e) {}
  }

  function close(fromPop) {
    if (!overlay || openId === null) return;
    overlay.style.display = 'none';
    frame.src = 'about:blank';
    document.body.style.overflow = '';
    openId = null;
    if (!fromPop) { try { history.back(); } catch (e) {} }
  }

  window.addEventListener('message', function (e) {
    if (e.data === 'eto-religion-close') close(false);
  });
  window.addEventListener('popstate', function () { if (openId !== null) close(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openId !== null) close(false); });

  function init() {
    injectCss();
    var s = document.createElement('script');
    s.src = BASE + 'pages.js?v=' + Date.now();
    s.onload = function () {
      PAGES = window.ETO_RELIGION_PAGES || []; render();
      /* لينك مباشر للصفحة: ?religion=ID  — بيفتحها تلقائي ويشيل الباراميتر من اللينك */
      try {
        var q = new URLSearchParams(location.search), want = q.get('religion');
        if (want) { q.delete('religion'); history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash); open(want); }
      } catch (e) {}
    };
    s.onerror = function () { console.error('[Religion] pages.js not found'); };
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.EtoReligion = { open: open, close: function () { close(false); } };
})();
