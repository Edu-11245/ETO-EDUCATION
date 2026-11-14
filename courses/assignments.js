
(function () {
  'use strict';

  var main = document.querySelector('main');
  if (!main) return;
  var backBtn = document.getElementById('back-to-home-btn');

  var PALETTE = [['#2563eb', '#1e3a8a'], ['#16a34a', '#14532d'], ['#7c3aed', '#4c1d95'],
                 ['#e11d48', '#881337'], ['#d97706', '#92400e'], ['#0891b2', '#164e63']];
  var BTN = 'flex-none rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rgba(hex, a) {
    var n = parseInt(hex.replace('#', ''), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function theme(c, c2) { return '--c:' + c + ';--c2:' + c2 + ';--cs:' + rgba(c, 0.14); }
  function isHtml(it) {
    if (!it || !it.url) return false;
    if (it.kind === 'html' || it.kind === 'page') return true;
    return /^(?:https?:\/\/(?!.*google\.com)|\.{0,2}\/)?[^?#]+\.html?([?#].*)?$/i.test(it.url);
  }
  function rawUrl(u) {
    var m = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|raw)\/([^\/]+)\/(.+?)(?:\?.*)?$/i.exec(u);
    return m ? 'https://raw.githubusercontent.com/' + m[1] + '/' + m[2] + '/' + m[3] + '/' + m[4] : u;
  }
  var usedIds = {};
  function makeId(url) {
    var name = decodeURIComponent(String(url).split('#')[0].split('?')[0].split('/').pop() || 'assignment')
      .replace(/\.html?$/i, '').toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, '-').replace(/^-+|-+$/g, '') || 'assignment';
    var id = 'asg-' + name, n = 2;
    while (usedIds[id]) id = 'asg-' + name + '-' + (n++);
    usedIds[id] = 1;
    return id;
  }
  function toast(msg) { if (typeof showToast === 'function') showToast(msg); }
  function copyLink(pid, msg) {
    var url = location.origin + location.pathname + '#' + pid;
    var done = function () { toast(msg || 'اتنسخ لينك الحل'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
    else {
      var ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (_) {} ta.remove(); done();
    }
  }
  var THEME_KEY = 'eto-bank-theme';
  function getTheme() {
    try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch (_) { return 'light'; }
  }
  function setTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch (_) {} }
  /* بيحقن سكريبت جوه ملف البنك: يبدأ بالوضع المحفوظ (light افتراضيًا) ويسمع لرسايل التبديل */
  function injectTheme(html, theme) {
    var js = '<script>(function(){var d=document.documentElement;d.setAttribute("data-theme",' + JSON.stringify(theme) +
      ');addEventListener("message",function(e){var t=e.data&&e.data.etoTheme;if(t==="light"||t==="dark")d.setAttribute("data-theme",t)})})()<\/script>';
    var m = /<head[^>]*>/i.exec(html);
    if (m) return html.slice(0, m.index + m[0].length) + js + html.slice(m.index + m[0].length);
    m = /<html[^>]*>/i.exec(html);
    if (m) return html.slice(0, m.index + m[0].length) + js + html.slice(m.index + m[0].length);
    return html.replace(/^(\s*<!doctype[^>]*>)?/i, function (x) { return (x || '') + js; });
  }
  function addSummaryPage(pid, it, backId) {
    var bank = !!it.bank, noun = bank ? 'بنك الأسئلة' : 'الحل';
    var ttl = bank ? (it.title || 'بنك أسئلة') : 'حل: ' + (it.title || 'واجب');
    var sec = document.createElement('section');
    sec.id = 'page-' + pid;
    sec.className = 'page-section hidden cs-page';
    sec.style.cssText = 'position:fixed;inset:0;z-index:60;animation:none';
    sec.innerHTML =
      '<div class="flex flex-col w-full h-full bg-white dark:bg-slate-900">' +
        '<div class="flex items-center gap-2 px-3 pb-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900" style="padding-top:max(8px,env(safe-area-inset-top))">' +
          '<a href="#' + backId + '" data-go="' + backId + '" aria-label="رجوع" class="w-10 h-10 ' + BTN + '"><i class="fa-solid fa-arrow-right"></i></a>' +
          '<h2 class="flex-1 min-w-0 truncate font-black text-sm md:text-base text-slate-800 dark:text-slate-100">' + esc(ttl) + '</h2>' +
          (bank ? '<button type="button" data-sum-theme aria-label="تبديل الوضع الليلي" class="w-10 h-10 ' + BTN + '"><i class="fa-solid fa-moon"></i></button>' : '') +
          '<button type="button" data-sum-copy aria-label="نسخ اللينك" class="h-10 px-3 ' + BTN + ' gap-2 text-sm font-bold"><i class="fa-solid fa-link"></i><span class="hidden sm:inline">نسخ اللينك</span></button>' +
          '<a href="#portal" data-go="portal" aria-label="الرئيسية" class="w-10 h-10 ' + BTN + '"><i class="fa-solid fa-house"></i></a>' +
        '</div>' +
        '<div class="relative flex-1 min-h-0">' +
          '<div data-sum-load class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-300 font-bold"><i class="fa-solid fa-circle-notch fa-spin text-3xl"></i><span>جاري تحميل ' + noun + '...</span></div>' +
          '<div data-sum-err class="absolute inset-0 hidden flex-col items-center justify-center gap-3 p-6 text-center text-slate-600 dark:text-slate-200 font-bold">' +
            '<i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500"></i>' +
            '<span>مقدرناش نحمّل ' + noun + '. اتأكد إن الريبو Public واللينك صح.</span>' +
            '<div class="flex gap-2"><button type="button" data-sum-retry class="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold">حاول تاني</button>' +
            '<a href="' + esc(it.solution) + '" target="_blank" rel="noopener noreferrer" class="h-10 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold flex items-center">افتح الصفحة الأصلية</a></div>' +
          '</div>' +
          '<iframe title="' + esc(ttl) + '" class="absolute inset-0 w-full h-full border-0 bg-white" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads"></iframe>' +
        '</div>' +
      '</div>';
    main.insertBefore(sec, backBtn || null);

    var frame = sec.querySelector('iframe');
    var loadEl = sec.querySelector('[data-sum-load]');
    var errEl = sec.querySelector('[data-sum-err]');
    var state = 0; /* 0 مش محمل، 1 بيحمل، 2 جاهز */

    function load() {
      if (state) return;
      state = 1;
      errEl.classList.add('hidden'); errEl.classList.remove('flex');
      loadEl.classList.remove('hidden');
      fetch(rawUrl(it.solution), { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (html) {
          frame.srcdoc = bank ? injectTheme(html, getTheme()) : html;
          loadEl.classList.add('hidden');
          state = 2;
        })
        .catch(function () {
          state = 0;
          loadEl.classList.add('hidden');
          errEl.classList.remove('hidden'); errEl.classList.add('flex');
        });
    }
    var thBtn = sec.querySelector('[data-sum-theme]');
    if (thBtn) {
      var paint = function () { thBtn.querySelector('i').className = 'fa-solid ' + (getTheme() === 'dark' ? 'fa-sun' : 'fa-moon'); };
      paint();
      thBtn.addEventListener('click', function () {
        var t = getTheme() === 'dark' ? 'light' : 'dark';
        setTheme(t); paint();
        try { frame.contentWindow.postMessage({ etoTheme: t }, '*'); } catch (_) {}
      });
    }
    sec.querySelector('[data-sum-copy]').addEventListener('click', function () { copyLink(pid, bank ? 'اتنسخ لينك بنك الأسئلة' : null); });
    sec.querySelector('[data-sum-retry]').addEventListener('click', load);

    function onToggle() {
      var shown = !sec.classList.contains('hidden');
      document.documentElement.style.overflow = shown ? 'hidden' : '';
      if (shown) { document.body.classList.add('eto-no-robot'); load(); }
    }
    new MutationObserver(onToggle).observe(sec, { attributes: true, attributeFilter: ['class'] });
    if (!sec.classList.contains('hidden')) onToggle();
  }

  var pages = {}, created = {};
  function isSol(it) { return it && it.kind === 'html' && it.url; }
  function build() {
    var all = window.ETO_CONTENT || {};
    Object.keys(all).forEach(function (fid) {
      var subs = (all[fid] || {}).subjects || {};
      Object.keys(subs).forEach(function (code) {
        var qs = subs[code].questions || [];
        (subs[code].assignments || []).concat(qs).filter(isSol).forEach(function (it) {
          var isBank = qs.indexOf(it) > -1;
          document.querySelectorAll('a.cs-item').forEach(function (a) {
            if (a.getAttribute('href') !== it.url || a.getAttribute('data-asg-done')) return;
            a.setAttribute('data-asg-done', '1');
            var host = a.closest('.page-section');
            var backId = host && host.id ? host.id.replace(/^page-/, '') : 'portal';
            var pid = pages[it.url] || (pages[it.url] = makeId(it.url));
            if (!created[pid]) { created[pid] = 1; addSummaryPage(pid, { title: it.title, solution: it.url, bank: isBank }, backId); }
            ['target', 'rel', 'data-view', 'data-open', 'data-dl', 'data-title'].forEach(function (k) { a.removeAttribute(k); });
            a.setAttribute('href', '#' + pid);
            a.setAttribute('data-go', pid);
            var ico = a.querySelector('.cs-item-ico i'); if (ico) ico.className = isBank ? 'fa-solid fa-circle-question' : 'fa-solid fa-lightbulb';
            var op = a.querySelector('i.cs-open'); if (op) op.className = 'fa-solid fa-arrow-left cs-open';
          });
        });
      });
    });
  }

  build();
  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(build, 250); }).observe(main, { childList: true, subtree: true });
})();
