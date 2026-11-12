/* =====================================================================
   ETO | الملخصات (courses/summaries.js)
   - لازم يتحمّل بعد courses.js مباشرة (وقبل السكريبت الأساسي).
   - الملخص PDF  -> زي ما هو (بيتفتح في الفيوور).
   - الملخص HTML -> الكود بيقرا الملف كامل من جيتهاب ويعمل منه صفحة
                    جوه السايت أوتوماتيك، بلينك خاص بيها (#sum-اسم-الملف).
                    من غير GitHub Pages ومن غير ما تحوّل أي لينك.
   ---------------------------------------------------------------------
   إزاي تضيف ملخص: في content.js جوه summaries بتاعت المادة، الزق لينك
   الملف من جيتهاب زي ما هو:
     { "title": "Cell Biology - Lecture 1",
       "url": "https://github.com/USER/REPO/blob/main/Summary/Biology/file.html" }
   - أي لينك بينتهي بـ .html (غير درايف) بيتعرف كملخص HTML.
   - الريبو لازم يكون Public.
   - ماتحطش group للملخصات الـHTML.
   ===================================================================== */
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

  /* أي لينك بينتهي بـ .html (غير جوجل/درايف) = ملخص HTML */
  function isHtml(it) {
    if (!it || !it.url) return false;
    if (it.kind === 'html' || it.kind === 'page') return true;
    return /^(?:https?:\/\/(?!.*google\.com)|\.{0,2}\/)?[^?#]+\.html?([?#].*)?$/i.test(it.url);
  }

  /* لينك جيتهاب العادي -> لينك الملف الخام اللي المتصفح يقدر يقراه */
  function rawUrl(u) {
    var m = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|raw)\/([^\/]+)\/(.+?)(?:\?.*)?$/i.exec(u);
    return m ? 'https://raw.githubusercontent.com/' + m[1] + '/' + m[2] + '/' + m[3] + '/' + m[4] : u;
  }

  var usedIds = {};
  function makeId(url) {
    var name = decodeURIComponent(String(url).split('#')[0].split('?')[0].split('/').pop() || 'summary')
      .replace(/\.html?$/i, '').toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, '-').replace(/^-+|-+$/g, '') || 'summary';
    var id = 'sum-' + name, n = 2;
    while (usedIds[id]) id = 'sum-' + name + '-' + (n++);
    usedIds[id] = 1;
    return id;
  }

  function toast(msg) { if (typeof showToast === 'function') showToast(msg); }
  function copyLink(pid) {
    var url = location.origin + location.pathname + '#' + pid;
    var done = function () { toast('اتنسخ لينك الملخص'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
    else {
      var ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (_) {} ta.remove(); done();
    }
  }

  /* ---------- صفحة الملخص الكاملة ---------- */
  function addSummaryPage(pid, it, backId) {
    var sec = document.createElement('section');
    sec.id = 'page-' + pid;
    sec.className = 'page-section hidden cs-page';
    sec.style.cssText = 'position:fixed;inset:0;z-index:60;animation:none';
    sec.innerHTML =
      '<div class="flex flex-col w-full h-full bg-white dark:bg-slate-900">' +
        '<div class="flex items-center gap-2 px-3 pb-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900" style="padding-top:max(8px,env(safe-area-inset-top))">' +
          '<a href="#' + backId + '" data-go="' + backId + '" aria-label="رجوع" class="w-10 h-10 ' + BTN + '"><i class="fa-solid fa-arrow-right"></i></a>' +
          '<h2 class="flex-1 min-w-0 truncate font-black text-sm md:text-base text-slate-800 dark:text-slate-100">' + esc(it.title || 'ملخص') + '</h2>' +
          '<button type="button" data-sum-copy aria-label="نسخ لينك الملخص" class="h-10 px-3 ' + BTN + ' gap-2 text-sm font-bold"><i class="fa-solid fa-link"></i><span class="hidden sm:inline">نسخ اللينك</span></button>' +
          '<a href="#portal" data-go="portal" aria-label="الرئيسية" class="w-10 h-10 ' + BTN + '"><i class="fa-solid fa-house"></i></a>' +
        '</div>' +
        '<div class="relative flex-1 min-h-0">' +
          '<div data-sum-load class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-300 font-bold"><i class="fa-solid fa-circle-notch fa-spin text-3xl"></i><span>جاري تحميل الملخص...</span></div>' +
          '<div data-sum-err class="absolute inset-0 hidden flex-col items-center justify-center gap-3 p-6 text-center text-slate-600 dark:text-slate-200 font-bold">' +
            '<i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500"></i>' +
            '<span>مقدرناش نحمّل الملخص. اتأكد إن الريبو Public واللينك صح.</span>' +
            '<div class="flex gap-2"><button type="button" data-sum-retry class="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold">حاول تاني</button>' +
            '<a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer" class="h-10 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold flex items-center">افتح الملف الأصلي</a></div>' +
          '</div>' +
          '<iframe title="' + esc(it.title || 'ملخص') + '" class="absolute inset-0 w-full h-full border-0 bg-white" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads"></iframe>' +
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
      fetch(rawUrl(it.url), { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (html) {
          frame.srcdoc = html;
          loadEl.classList.add('hidden');
          state = 2;
        })
        .catch(function () {
          state = 0;
          loadEl.classList.add('hidden');
          errEl.classList.remove('hidden'); errEl.classList.add('flex');
        });
    }
    sec.querySelector('[data-sum-copy]').addEventListener('click', function () { copyLink(pid); });
    sec.querySelector('[data-sum-retry]').addEventListener('click', load);

    function onToggle() {
      var shown = !sec.classList.contains('hidden');
      document.documentElement.style.overflow = shown ? 'hidden' : '';
      if (shown) { document.body.classList.add('eto-no-robot'); load(); }
    }
    new MutationObserver(onToggle).observe(sec, { attributes: true, attributeFilter: ['class'] });
    if (!sec.classList.contains('hidden')) onToggle();
  }

  /* ---------- كروت الملخصات في صفحة ملخصات المادة ---------- */
  function card(pid, it, i) {
    var c = PALETTE[i % PALETTE.length];
    return '<a class="cs-card animate__animated animate__fadeInUp" href="#' + pid + '" data-go="' + pid + '"' +
      ' style="' + theme(c[0], c[1]) + ';animation-delay:' + (i * 70) + 'ms">' +
      '<div class="cs-card-icon"><i class="fa-solid fa-folder-open"></i></div>' +
      '<h3>' + esc(it.title || 'ملخص') + '</h3>' +
      (it.note ? '<p>' + esc(it.note) + '</p>' : '') +
      '<div class="cs-meta"><span class="cs-tag"><i class="fa-solid fa-file-lines"></i>ملخص</span></div>' +
      '<div class="cs-card-go"><span>افتح الملخص</span><i class="fa-solid fa-arrow-left"></i></div></a>';
  }
  function title(text, n) {
    return '<div class="cs-group-title"><h3>' + text + '</h3>' + (n ? '<span class="cs-tag">' + n + '</span>' : '') + '</div>';
  }

  function build() {
    var all = window.ETO_CONTENT || {};
    Object.keys(all).forEach(function (fid) {
      var subs = (all[fid] || {}).subjects || {};
      Object.keys(subs).forEach(function (code) {
        var list = (subs[code].summaries || []).filter(isHtml);
        if (!list.length) return;
        var listId = 'sub-' + code.toLowerCase() + '-summaries';
        var page = document.getElementById('page-' + listId);
        if (!page) return;
        var wrap = page.querySelector('.cs-wrap');
        if (!wrap || wrap.getAttribute('data-sum-done')) return;
        wrap.setAttribute('data-sum-done', '1');

        /* شيل الصفوف العادية اللي courses.js عملتها للملخصات دي */
        var urls = list.map(function (it) { return it.url; });
        wrap.querySelectorAll('a.cs-item').forEach(function (a) {
          if (urls.indexOf(a.getAttribute('href')) > -1) a.remove();
        });
        wrap.querySelectorAll('.cs-list').forEach(function (l) { if (!l.children.length) l.remove(); });

        var ids = list.map(function (it) { var pid = makeId(it.url); addSummaryPage(pid, it, listId); return pid; });
        var hasOthers = wrap.children.length > 0;
        var html = '';
        if (hasOthers) html += title('ملخصات HTML', list.length);
        html += '<div class="cs-grid">' + list.map(function (it, i) { return card(ids[i], it, i); }).join('') + '</div>';
        if (hasOthers) html += '<div style="height:36px"></div>' + title('ملفات الملخصات');
        wrap.insertAdjacentHTML('afterbegin', html);
      });
    });
  }

  build();
})();
