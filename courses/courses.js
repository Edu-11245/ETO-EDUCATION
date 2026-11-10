/* =====================================================================
   ETO | المواد الدراسية  (courses/courses.js)
   - بيانات الكليات والمواد + بناء كل الصفحات أوتوماتيك
   - بيتحمّل قبل السكريبت الأساسي، فالروابط (#fac-sci-cnu مثلًا) بتشتغل من أول فتحة
   ---------------------------------------------------------------------
   إزاي تضيف حاجة:
   * مادة جديدة  -> ضيف object جوه subjects في السنة المناسبة
   * ملف/ملخص    -> ضيف في files أو summaries:
        { title:'Lecture 1', url:'https://...', kind:'pdf', note:'اختياري' }
     kind = pdf | ppt | doc | img | link
   * فيديو       -> ضيف في videos بنفس الشكل { title, url }
   * واجبات/مسائل -> ضيف في assignments (واسم الكرت من assignmentsLabel في content.js، مثلًا "مسائل" للماث)، وكل واجب في فولدر بنفس group:
        { url:'...', kind:'pdf', group:'Assignment 1', note:'الواجب' }
        { url:'...', kind:'pdf', group:'Assignment 1', note:'الحل' }
   * كلية جديدة  -> ضيف object جديد في FACULTIES (وليها لينك #fac-<id> أوتوماتيك)
   ===================================================================== */
(function () {
  'use strict';

  var FACULTIES = [
    {
      id: 'sci-cnu',
      name: 'كلية العلوم',
      uni: 'جامعة القاهرة الأهلية',
      icon: 'fa-atom',
      color: '#2563eb', color2: '#1e3a8a',
      term: 'الفصل الدراسي الأول 2026/2027',
      years: [
        {
          id: 'y1', label: 'السنة الأولى', program: 'السنة الدراسية الأولى',
          subjects: [
            { code: 'ZOO101', en: 'Zoology',          ar: 'علم الحيوان',        icon: 'fa-frog',      color: '#16a34a', color2: '#14532d', day: 'السبت' },
            { code: 'MAT101', en: 'Mathematics',      ar: 'الرياضيات',          icon: 'fa-infinity',  color: '#2563eb', color2: '#1e3a8a', day: 'الأحد' },
            { code: 'GEO101', en: 'Geology',          ar: 'الجيولوجيا',         icon: 'fa-mountain',  color: '#b45309', color2: '#78350f', day: 'الاثنين' },
            { code: 'URC101', en: 'Critical Thinking',ar: 'التفكير النقدي',     icon: 'fa-lightbulb', color: '#d97706', color2: '#92400e', day: 'الاثنين' },
            { code: 'PHY101', en: 'Physics',          ar: 'الفيزياء',           icon: 'fa-atom',      color: '#7c3aed', color2: '#4c1d95', day: 'الأربعاء' },
            { code: 'CHE101', en: 'Chemistry',        ar: 'الكيمياء',           icon: 'fa-flask',     color: '#e11d48', color2: '#881337', day: 'الخميس' }
          ]
        },
        {
          id: 'y2', label: 'السنة الثانية', program: 'الفيزياء الحيوية الطبية',
          subjects: [
            { code: 'MAT211', en: 'Biostatistics',      ar: 'الإحصاء الحيوي',            icon: 'fa-chart-line', color: '#2563eb', color2: '#1e3a8a', day: 'السبت' },
            { code: 'BPH213', en: 'Radiobiology',       ar: 'البيولوجيا الإشعاعية',      icon: 'fa-radiation',  color: '#ca8a04', color2: '#713f12', day: 'السبت' },
            { code: 'PHY219', en: 'Electromagnetism',   ar: 'الكهرومغناطيسية',           icon: 'fa-magnet',     color: '#dc2626', color2: '#7f1d1d', day: 'الأحد' },
            { code: 'BPH221', en: 'Laser in Medicine',  ar: 'الليزر في الطب',            icon: 'fa-bullseye',   color: '#e11d48', color2: '#881337', day: 'الأحد' },
            { code: 'PHY217', en: 'Quantum Mechanics',  ar: 'ميكانيكا الكم',             icon: 'fa-wave-square',color: '#7c3aed', color2: '#4c1d95', day: 'الأحد' },
            { code: 'ANT215', en: 'Human Anatomy',      ar: 'تشريح الإنسان',             icon: 'fa-bone',       color: '#0d9488', color2: '#134e4a', day: 'الثلاثاء' },
            { code: 'URC201', en: 'Business',           ar: 'الأعمال',                   icon: 'fa-briefcase',  color: '#475569', color2: '#1e293b', day: 'الثلاثاء' },
            { code: 'BPH223', en: 'Medical Biophysics (Lab)', ar: 'الفيزياء الحيوية الطبية (عملي)', icon: 'fa-microscope', color: '#0891b2', color2: '#164e63', day: 'الخميس' }
          ]
        }
      ]
    }
  ];

  /* ---------- أدوات صغيرة ---------- */
  var main = document.querySelector('main');
  if (!main) return;
  var backBtn = document.getElementById('back-to-home-btn');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- أسماء الملفات من Google Drive أوتوماتيك ----------
     - لو حطيت DRIVE_API_KEY، اسم كل ملف بيتسحب من درايف زي ما هو، وبيتخزن في المتصفح.
     - من غير مفتاح: بيستخدم title اللي في content.js (لو موجود) كاسم احتياطي.
     - STRIP_EXT = true بيشيل .pdf / .pptx من آخر الاسم. */
  var DRIVE_API_KEY = 'AIzaSyAW-1NjuH9vEf9eB0a_TM8kJEaGOiC86gc';
  var STRIP_EXT = false;
  var NAME_CACHE_KEY = 'eto_drive_names_v1';
  var nameCache = {};
  try { nameCache = JSON.parse(localStorage.getItem(NAME_CACHE_KEY) || '{}') || {}; } catch (e) { nameCache = {}; }
  function driveId(url) {
    var m = String(url || '').match(/drive\.google\.com\/file\/d\/([\w-]+)/) ||
            String(url || '').match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([\w-]+)/) ||
            String(url || '').match(/docs\.google\.com\/(?:document|presentation|spreadsheets)\/d\/([\w-]+)/);
    return m ? m[1] : '';
  }
  function cleanName(n) {
    n = String(n || '').trim();
    return STRIP_EXT ? n.replace(/\.(pdf|pptx?|docx?|xlsx?|png|jpe?g)$/i, '') : n;
  }
  function applyDriveName(id, name) {
    name = cleanName(name);
    if (!name) return;
    var sel = '[data-drive-id="' + id + '"]';
    document.querySelectorAll('b' + sel).forEach(function (b) { b.textContent = name; });
    document.querySelectorAll('a' + sel).forEach(function (a) { a.setAttribute('data-title', name); });
  }
  function resolveDriveNames() {
    var ids = {};
    document.querySelectorAll('[data-drive-id]').forEach(function (el) { ids[el.getAttribute('data-drive-id')] = 1; });
    Object.keys(ids).forEach(function (id) {
      if (nameCache[id]) { applyDriveName(id, nameCache[id]); return; }
      if (!DRIVE_API_KEY) return;
      fetch('https://www.googleapis.com/drive/v3/files/' + id + '?fields=name&supportsAllDrives=true&key=' + encodeURIComponent(DRIVE_API_KEY))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.name) return;
          nameCache[id] = d.name;
          try { localStorage.setItem(NAME_CACHE_KEY, JSON.stringify(nameCache)); } catch (e) {}
          applyDriveName(id, d.name);
        })
        .catch(function () {});
    });
  }
  function rgba(hex, a) {
    var h = hex.replace('#', '');
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function theme(c, c2) {
    return '--c:' + c + ';--c2:' + c2 + ';--cs:' + rgba(c, 0.14);
  }
  function delay(i) { return 'animation-delay:' + (i * 70) + 'ms'; }
  function link(id, cls, style, inner) {
    return '<a href="#' + id + '" data-go="' + id + '" class="' + cls + '" style="' + style + '">' + inner + '</a>';
  }
  function addPage(id, html) {
    var s = document.createElement('section');
    s.id = 'page-' + id;
    s.className = 'page-section hidden cs-page';
    s.innerHTML = html;
    main.insertBefore(s, backBtn || null);
    watchPage(s);
    return s;
  }

  /* الروبوت مايظهرش في أي صفحة من صفحات المواد */
  function syncRobot() {
    document.body.classList.toggle('eto-no-robot', !!document.querySelector('.cs-page:not(.hidden)'));
  }
  var robotObs = new MutationObserver(syncRobot);
  function watchPage(el) { robotObs.observe(el, { attributes: true, attributeFilter: ['class'] }); }
  function crumbs(list) {
    var out = '<nav class="cs-crumbs" aria-label="مسار الصفحة">';
    list.forEach(function (c, i) {
      if (i) out += '<i class="fa-solid fa-chevron-left"></i>';
      out += c.go
        ? '<a href="#' + c.go + '" data-go="' + c.go + '">' + esc(c.label) + '</a>'
        : '<span class="cs-crumb-now">' + esc(c.label) + '</span>';
    });
    return out + '</nav>';
  }
  function hero(o) {
    return '<header class="cs-hero animate__animated animate__fadeIn" style="' + theme(o.c, o.c2) + '">' +
      '<div class="cs-hero-dots"></div><div class="cs-hero-inner">' +
      crumbs(o.crumbs) +
      '<div class="cs-hero-icon animate__animated animate__zoomIn"><i class="fa-solid ' + o.icon + '"></i></div>' +
      (o.kicker ? '<span class="cs-kicker">' + esc(o.kicker) + '</span>' : '') +
      '<h1 class="animate__animated animate__fadeInUp">' + esc(o.title) + '</h1>' +
      (o.text ? '<p class="animate__animated animate__fadeInUp" style="animation-delay:.1s">' + esc(o.text) + '</p>' : '') +
      (o.chips ? '<div class="cs-chips animate__animated animate__fadeInUp" style="animation-delay:.2s">' + o.chips + '</div>' : '') +
      '</div></header>';
  }
  function chip(icon, text, extra) {
    return '<span class="cs-chip ' + (extra || '') + '"><i class="fa-solid ' + icon + '"></i>' + text + '</span>';
  }

  /* ---------- فتح الملفات جوه الموقع (Google Drive / YouTube) ---------- */
  function viewInfo(url) {
    url = String(url || '');
    var m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) ||
            url.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([\w-]+)/) ||
            url.match(/docs\.google\.com\/(?:document|presentation|spreadsheets)\/d\/([\w-]+)/);
    if (m) {
      var kind = /docs\.google\.com\/(document|presentation|spreadsheets)/.exec(url);
      if (kind) return { embed: 'https://docs.google.com/' + kind[1] + '/d/' + m[1] + '/preview', open: url };
      return {
        embed: 'https://drive.google.com/file/d/' + m[1] + '/preview',
        open: 'https://drive.google.com/file/d/' + m[1] + '/view',
        dl: 'https://drive.google.com/uc?export=download&id=' + m[1]
      };
    }
    var y = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/))([\w-]{11})/);
    if (y) return { embed: 'https://www.youtube.com/embed/' + y[1], open: url };
    return null;
  }
  /* شبكة الـ4 كروت في هب المادة */
  (function () {
    var st = document.createElement('style');
    st.textContent = '.cs-grid.cs-grid-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}' +
      '@media(max-width:1100px){.cs-grid.cs-grid-4{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
      '@media(max-width:600px){.cs-grid.cs-grid-4{grid-template-columns:1fr}}';
    document.head.appendChild(st);
  })();
  var viewer = null;
  function openViewer(a) {
    if (!viewer) {
      viewer = document.createElement('div');
      viewer.className = 'cs-viewer hidden';
      viewer.innerHTML =
        '<div class="cs-viewer-box animate__animated animate__zoomIn" style="--animate-duration:.35s">' +
          '<div class="cs-viewer-bar"><b class="cs-viewer-title"></b>' +
            '<a class="cs-viewer-btn" data-v-open target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i><span>فتح في تاب</span></a>' +
            '<a class="cs-viewer-btn" data-v-dl target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-download"></i><span>تحميل</span></a>' +
            '<button type="button" class="cs-viewer-btn cs-viewer-x" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button></div>' +
          '<div class="cs-viewer-frame"><div class="cs-viewer-load"><i class="fa-solid fa-circle-notch fa-spin"></i></div><iframe allow="autoplay; fullscreen" allowfullscreen referrerpolicy="no-referrer"></iframe></div>' +
        '</div>';
      document.body.appendChild(viewer);
      viewer.addEventListener('click', function (e) {
        if (e.target === viewer || e.target.closest('.cs-viewer-x')) closeViewer();
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeViewer(); });
    }
    var dl = a.getAttribute('data-dl');
    viewer.querySelector('.cs-viewer-title').textContent = a.getAttribute('data-title') || '';
    viewer.querySelector('[data-v-open]').href = a.getAttribute('data-open');
    var d = viewer.querySelector('[data-v-dl]');
    d.style.display = dl ? '' : 'none'; if (dl) d.href = dl;
    viewer.querySelector('iframe').src = a.getAttribute('data-view');
    viewer.classList.remove('hidden');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeViewer() {
    if (!viewer || viewer.classList.contains('hidden')) return;
    viewer.classList.add('hidden');
    viewer.querySelector('iframe').src = 'about:blank';
    document.documentElement.style.overflow = '';
  }

  /* ---------- الإحصائيات ---------- */
  function countSubjects(f) {
    return f.years.reduce(function (n, y) { return n + y.subjects.length; }, 0);
  }
  var totalSubjects = FACULTIES.reduce(function (n, f) { return n + countSubjects(f); }, 0);

  /* ---------- صفحة: كل الكليات ---------- */
  (function buildHub() {
    var cards = FACULTIES.map(function (f, i) {
      return link('fac-' + f.id, 'cs-card animate__animated animate__fadeInUp', theme(f.color, f.color2) + ';' + delay(i),
        '<div class="cs-card-icon"><i class="fa-solid ' + f.icon + '"></i></div>' +
        '<h3>' + esc(f.name) + '</h3>' +
        '<p>' + esc(f.uni) + '<br>' + esc(f.term) + '</p>' +
        '<div class="cs-meta">' +
          '<span class="cs-tag"><i class="fa-solid fa-book"></i>' + countSubjects(f) + ' مادة</span>' +
          '<span class="cs-tag cs-tag-muted"><i class="fa-solid fa-layer-group"></i>' + f.years.length + ' سنين</span>' +
        '</div>' +
        '<div class="cs-card-go"><span>افتح صفحة الكلية</span><i class="fa-solid fa-arrow-left"></i></div>');
    });
    cards.push(
      '<div class="cs-card is-soon animate__animated animate__fadeInUp" style="' + theme('#64748b', '#334155') + ';' + delay(FACULTIES.length) + '">' +
        '<div class="cs-card-icon"><i class="fa-solid fa-building-columns"></i></div>' +
        '<h3>كليات ومعاهد تانية</h3>' +
        '<p>كل كلية أو معهد هيكون ليه صفحة ولينك خاص بيه. بنضيفهم واحدة واحدة.</p>' +
        '<div class="cs-meta"><span class="cs-tag cs-tag-soon"><i class="fa-solid fa-hourglass-half"></i>قريبًا</span></div>' +
      '</div>');

    addPage('courses',
      hero({
        c: '#6d28d9', c2: '#3730a3', icon: 'fa-book-open', kicker: 'STUDY SUBJECTS',
        title: 'المواد الدراسية',
        text: 'اختار كليتك وادخل على موادها: شرح، ملفات المادة، وملخصات لكل مادة في مكان واحد.',
        crumbs: [{ label: 'الرئيسية', go: 'portal' }, { label: 'المواد الدراسية' }],
        chips: chip('fa-building-columns', FACULTIES.length + ' كلية') + chip('fa-book', totalSubjects + ' مادة')
      }) +
      '<div class="cs-wrap">' +
        '<div class="cs-section-title"><div><h2>الكليات والمعاهد</h2><p>كل كلية ليها صفحة ولينك مخصوص.</p></div></div>' +
        '<div class="cs-grid">' + cards.join('') + '</div>' +
      '</div>');
  })();

  /* ---------- صفحة كل كلية + صفحات المواد ---------- */
  FACULTIES.forEach(function (f) {
    var fid = 'fac-' + f.id;
    var fTheme = theme(f.color, f.color2);

    function subjectCard(s, i) {
      var sid = 'sub-' + s.code.toLowerCase();
      return link(sid, 'cs-card animate__animated animate__fadeInUp', theme(s.color, s.color2) + ';' + delay(i),
        '<div class="cs-card-icon"><i class="fa-solid ' + s.icon + '"></i></div>' +
        '<h3>' + esc(s.ar) + '</h3>' +
        '<p class="cs-en">' + esc(s.en) + '</p>' +
        '<div class="cs-meta">' +
          '<span class="cs-tag cs-code"><i class="fa-solid fa-hashtag"></i>' + esc(s.code) + '</span>' +
          '<span class="cs-tag cs-tag-muted"><i class="fa-solid fa-calendar-day"></i>' + esc(s.day) + '</span>' +
        '</div>' +
        '<div class="cs-card-go"><span>ادخل على المادة</span><i class="fa-solid fa-arrow-left"></i></div>');
    }

    var tabs = f.years.map(function (y, i) {
      return '<button type="button" class="cs-tab' + (i === 0 ? ' is-on' : '') + '" data-year="' + y.id + '">' + esc(y.label) + '</button>';
    }).join('');

    var page = addPage(fid,
      hero({
        c: f.color, c2: f.color2, icon: f.icon, kicker: f.uni,
        title: f.name,
        text: 'مواد ' + f.name + ' - ' + f.uni + '. اختار السنة وادخل على المادة اللي عايزها.',
        crumbs: [{ label: 'الرئيسية', go: 'portal' }, { label: 'المواد الدراسية', go: 'courses' }, { label: f.name }],
        chips: chip('fa-calendar-check', esc(f.term)) + chip('fa-book', countSubjects(f) + ' مادة') +
               '<button type="button" class="cs-chip cs-chip-btn" data-copy="' + fid + '"><i class="fa-solid fa-link"></i>نسخ لينك الكلية</button>'
      }) +
      '<div class="cs-wrap" style="' + fTheme + '">' +
        '<div class="cs-section-title"><div><h2 data-year-title></h2><p data-year-sub></p></div><div class="cs-tabs" role="tablist">' + tabs + '</div></div>' +
        '<div class="cs-grid" data-subjects></div>' +
      '</div>');

    function showYear(yid) {
      var y = f.years.filter(function (x) { return x.id === yid; })[0] || f.years[0];
      page.querySelectorAll('.cs-tab').forEach(function (t) { t.classList.toggle('is-on', t.getAttribute('data-year') === y.id); });
      page.querySelector('[data-year-title]').textContent = y.label + (y.id === 'y2' ? ' - ' + y.program : '');
      page.querySelector('[data-year-sub]').textContent = y.subjects.length + ' مواد - ' + f.term;
      page.querySelector('[data-subjects]').innerHTML = y.subjects.map(subjectCard).join('');
    }
    page.querySelectorAll('.cs-tab').forEach(function (t) {
      t.addEventListener('click', function () { showYear(t.getAttribute('data-year')); });
    });
    showYear(f.years[0].id);

    /* ---- صفحات كل مادة ---- */
    f.years.forEach(function (y) {
      y.subjects.forEach(function (s) {
        var ext = ((window.ETO_CONTENT || {})[f.id] || {}).subjects || {};
        var ex = ext[s.code] || {};
        s.files = ex.files || s.files || []; s.summaries = ex.summaries || s.summaries || []; s.videos = ex.videos || s.videos || []; s.assignments = ex.assignments || s.assignments || [];
        var aLabel = ex.assignmentsLabel || 'واجبات';
        var aIcon = ex.assignmentsIcon || (aLabel === 'واجبات' ? 'fa-clipboard-list' : 'fa-calculator');
        var aText = ex.assignmentsText || (aLabel === 'واجبات' ? 'الواجبات وحلولها، كل واجب في فولدر.' : 'شيتات ' + aLabel + ' ' + s.ar + '.');
        var sid = 'sub-' + s.code.toLowerCase();
        var t = theme(s.color, s.color2);
        var baseCrumbs = [
          { label: 'الرئيسية', go: 'portal' }, { label: 'المواد الدراسية', go: 'courses' },
          { label: f.name, go: fid }
        ];

        /* هب المادة: 3 كروت */
        function big(kind, icon, title, text, count, soon, i) {
          var tag = soon
            ? '<span class="cs-tag cs-tag-soon"><i class="fa-solid fa-hourglass-half"></i>قريبًا</span>'
            : '<span class="cs-tag"><i class="fa-solid fa-circle-check"></i>متاح</span>';
          return link(sid + '-' + kind, 'cs-card animate__animated animate__fadeInUp', delay(i),
            (count ? '<span class="cs-count">' + count + '</span>' : '') +
            '<div class="cs-card-icon"><i class="fa-solid ' + icon + '"></i></div>' +
            '<h3>' + title + '</h3><p>' + text + '</p>' +
            '<div class="cs-meta">' + tag + '</div>' +
            '<div class="cs-card-go"><span>افتح</span><i class="fa-solid fa-arrow-left"></i></div>');
        }
        addPage(sid,
          hero({
            c: s.color, c2: s.color2, icon: s.icon, kicker: s.code,
            title: s.ar, text: s.en,
            crumbs: baseCrumbs.concat([{ label: s.ar }]),
            chips: chip('fa-hashtag', '<span class="cs-code">' + esc(s.code) + '</span>') + chip('fa-calendar-day', esc(s.day)) + chip('fa-building-columns', esc(f.name))
          }) +
          '<div class="cs-wrap cs-big" style="' + t + '">' +
            '<div class="cs-section-title"><div><h2>محتوى المادة</h2><p>اختار اللي محتاجه.</p></div></div>' +
            '<div class="cs-grid cs-grid-4">' +
              big('videos', 'fa-circle-play', 'شرح', 'فيديوهات شرح المادة محاضرة بمحاضرة.', s.videos.length, !s.videos.length, 0) +
              big('files', 'fa-folder-open', 'ملفات المادة', 'السلايدات والمحاضرات والتمارين وكل ملفات المادة.', s.files.length, !s.files.length, 1) +
              big('summaries', 'fa-book-open', 'ملخصات', 'ملخصات ومراجعات سريعة قبل الامتحان.', s.summaries.length, !s.summaries.length, 2) +
              big('assignments', aIcon, aLabel, aText, s.assignments.length, !s.assignments.length, 3) +
            '</div>' +
          '</div>');

        /* الصفحات الفرعية */
        var KIND = { pdf: 'fa-file-pdf', ppt: 'fa-file-powerpoint', doc: 'fa-file-word', img: 'fa-file-image', link: 'fa-link' };
        function itemHtml(it, i, defKind) {
          var k = it.kind || defKind;
          var v = viewInfo(it.url);
          var did = driveId(it.url);
          var shown = (did && nameCache[did]) ? cleanName(nameCache[did]) : (it.title || 'ملف');
          return '<a class="cs-item animate__animated animate__fadeInUp" style="' + delay(i) + '" href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer"' +
            (v ? ' data-view="' + esc(v.embed) + '" data-open="' + esc(v.open) + '" data-dl="' + esc(v.dl || '') + '" data-title="' + esc(shown) + '"' : '') + (did ? ' data-drive-id="' + did + '"' : '') + '>' +
            '<span class="cs-item-ico"><i class="fa-solid ' + (KIND[k] || KIND.link) + '"></i></span>' +
            '<span><b' + (did ? ' data-drive-id="' + did + '"' : '') + '>' + esc(shown) + '</b>' + (it.note ? '<small>' + esc(it.note) + '</small>' : '') + '</span>' +
            '<i class="fa-solid ' + (v ? 'fa-eye' : 'fa-arrow-up-right-from-square') + ' cs-open"></i></a>';
        }
        /* لو العناصر ليها group بنعرضها كمجلدات، والكليك على المجلد بيفتح محتواه */
        var FOLDER_COLORS = [['#2563eb', '#1e3a8a'], ['#16a34a', '#14532d'], ['#7c3aed', '#4c1d95'], ['#e11d48', '#881337'], ['#d97706', '#92400e'], ['#0891b2', '#164e63']];
        function itemsHtml(list, defKind) {
          var order = [], map = {}, loose = [];
          list.forEach(function (it) {
            var g = it.group || '';
            if (!g) { loose.push(it); return; }
            if (!map[g]) { map[g] = []; order.push(g); }
            map[g].push(it);
          });
          if (!order.length) return '<div class="cs-list">' + loose.map(function (it, i) { return itemHtml(it, i, defKind); }).join('') + '</div>';
          var folders = order.map(function (g, i) {
            var c = FOLDER_COLORS[i % FOLDER_COLORS.length];
            return '<button type="button" data-folder="' + i + '" class="cs-card cs-folder animate__animated animate__fadeInUp" style="' + theme(c[0], c[1]) + ';' + delay(i) + '">' +
              '<div class="cs-card-icon"><i class="fa-solid fa-folder-open"></i></div>' +
              '<h3>' + esc(g) + '</h3>' +
              '<div class="cs-meta"><span class="cs-tag"><i class="fa-solid fa-file"></i>' + map[g].length + ' ملف</span></div>' +
              '<div class="cs-card-go"><span>افتح المجلد</span><i class="fa-solid fa-arrow-left"></i></div></button>';
          }).join('');
          var looseHtml = loose.length
            ? '<div class="cs-group-title" style="margin-top:44px"><h3>ملفات أخرى</h3><span class="cs-tag">' + loose.length + '</span></div><div class="cs-list">' +
              loose.map(function (it, i) { return itemHtml(it, i, defKind); }).join('') + '</div>'
            : '';
          var panels = order.map(function (g, i) {
            var c = FOLDER_COLORS[i % FOLDER_COLORS.length];
            return '<div class="cs-panel cs-hide" data-panel="' + i + '" style="' + theme(c[0], c[1]) + '">' +
              '<div class="cs-panel-head"><button type="button" class="cs-btn" data-folder-back><i class="fa-solid fa-arrow-right"></i>كل المجلدات</button>' +
              '<h3><i class="fa-solid fa-folder-open"></i>' + esc(g) + '</h3><span class="cs-tag">' + map[g].length + '</span></div>' +
              '<div class="cs-list">' + map[g].map(function (it, j) { return itemHtml(it, j, defKind); }).join('') + '</div></div>';
          }).join('');
          return '<div data-folders-view><div class="cs-grid">' + folders + '</div>' + looseHtml + '</div>' + panels;
        }
        function emptyHtml(icon, title, text, pulse) {
          return '<div class="cs-empty animate__animated animate__fadeInUp">' +
            '<div class="cs-empty-icon' + (pulse ? ' animate__animated animate__pulse animate__infinite' : '') + '" style="--animate-duration:2.6s"><i class="fa-solid ' + icon + '"></i></div>' +
            '<h3>' + title + '</h3><p>' + text + '</p>' +
            '<a href="#' + sid + '" data-go="' + sid + '" class="cs-btn"><i class="fa-solid fa-arrow-right"></i>رجوع للمادة</a></div>';
        }
        function sub(kind, icon, label, kicker, text, list, defKind, emptyTitle, emptyText, pulse) {
          addPage(sid + '-' + kind,
            hero({
              c: s.color, c2: s.color2, icon: icon, kicker: kicker + ' • ' + s.code,
              title: label + ' - ' + s.ar, text: text,
              crumbs: baseCrumbs.concat([{ label: s.ar, go: sid }, { label: label }]),
              chips: chip('fa-hashtag', '<span class="cs-code">' + esc(s.code) + '</span>') +
                     (list.length ? chip('fa-circle-check', list.length + ' عنصر') : chip('fa-hourglass-half', 'قريبًا'))
            }) +
            '<div class="cs-wrap" style="' + t + '">' +
              (list.length ? itemsHtml(list, defKind) : emptyHtml(icon, emptyTitle, emptyText, pulse)) +
            '</div>');
        }
        sub('videos', 'fa-circle-play', 'شرح', 'VIDEOS', 'فيديوهات شرح ' + s.ar + '.', s.videos, 'link',
            'الفيديوهات قريبًا', 'بنجهز شرح المادة فيديو بفيديو. أول ما يجهز هيظهر هنا.', true);
        sub('files', 'fa-folder-open', 'ملفات المادة', 'FILES', 'كل ملفات ' + s.ar + ' في مكان واحد.', s.files, 'pdf',
            'لسه مفيش ملفات', 'بنرتب ملفات المادة. هتلاقيها هنا أول ما تتضاف.', false);
        sub('assignments', aIcon, aLabel, 'PRACTICE', aText, s.assignments, 'pdf',
            'لسه مفيش ' + aLabel, 'ال' + aLabel + ' هتتضاف هنا أول ما تجهز.', false);
        sub('summaries', 'fa-book-open', 'ملخصات', 'SUMMARIES', 'ملخصات ومراجعات ' + s.ar + '.', s.summaries, 'pdf',
            'لسه مفيش ملخصات', 'الملخصات جاية قريب. تابع الصفحة دي.', false);
      });
    });

    /* نسخ لينك الكلية */
    page.addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      var url = location.origin + location.pathname + '#' + b.getAttribute('data-copy');
      var done = function () { if (typeof showToast === 'function') showToast('اتنسخ لينك الكلية'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else { var ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (_) {} ta.remove(); done(); }
    });
  });

  /* ---------- تنقل بالكليك (روابط حقيقية + navigate) ---------- */
  document.addEventListener('click', function (e) {
    var fb = e.target.closest('[data-folder]');
    if (fb) {
      var w = fb.closest('.cs-wrap');
      w.querySelector('[data-folders-view]').classList.add('cs-hide');
      w.querySelector('[data-panel="' + fb.getAttribute('data-folder') + '"]').classList.remove('cs-hide');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    var bk = e.target.closest('[data-folder-back]');
    if (bk) {
      var w2 = bk.closest('.cs-wrap');
      w2.querySelectorAll('.cs-panel').forEach(function (p) { p.classList.add('cs-hide'); });
      w2.querySelector('[data-folders-view]').classList.remove('cs-hide');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    var vw = e.target.closest('a[data-view]');
    if (vw && e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) { e.preventDefault(); openViewer(vw); return; }
    var a = e.target.closest('a[data-go]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (typeof navigate === 'function') {
      navigate(a.getAttribute('data-go'));
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  });

  resolveDriveNames();
  syncRobot();
  window.EtoCourses = { faculties: FACULTIES };
})();
