/* ===== Python: الـJS الرئيسي (صفحة Python + أدوات مشتركة) =====
   الصفحات: python (الرئيسية 3 كروت) | python-course | python-day | python-libs | python-mindmap
   الخريطة بتتقري من window.COURSE_MAPS.python (Data/map.js) */
(function () {
  var KEY = 'eto_py_progress_v1';
  var cache = null, index = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function pick(o) { for (var i = 1; i < arguments.length; i++) { var v = o[arguments[i]]; if (v != null && v !== '') return v; } return ''; }

  /* بيقبل شكل map.js: levels[].lessons[] وكل عنصر {id,t,type,n} (وأشكال تانية قريبة منه) */
  function normalize(map) {
    if (!map) return null;
    var levels = Array.isArray(map) ? map : (map.levels || map.stages || []);
    var counter = 0;
    var out = levels.map(function (lv, li) {
      var raw = lv.lessons || lv.items || lv.topics || lv.children || [];
      var items = raw.map(function (it, ii) {
        if (typeof it === 'string') it = { t: it };
        var type = String(it.type || it.kind || 'lesson').toLowerCase();
        if (type === 'exam' || type === 'test') type = 'quiz';
        if (type !== 'project' && type !== 'quiz') type = 'lesson';
        counter++;
        return { id: String(pick(it, 'id', 'slug', 'key') || ('l' + li + '-' + ii)), title: String(pick(it, 't', 'title', 'name', 'ar', 'label')), type: type, n: it.n || counter };
      });
      var full = String(pick(lv, 'title', 'name', 'ar', 'label'));
      var m = /^\s*(?:المستوى|Level)\s*(\d+)\s*[:：\-]\s*(.*)$/i.exec(full);
      return { id: String(pick(lv, 'id', 'slug') || ('lv' + li)), num: m ? +m[1] : li, name: m ? m[2] : full, full: full, items: items };
    });
    return { title: Array.isArray(map) ? 'Python' : (map.title || 'Python'), levels: out };
  }

  function getMap() {
    if (cache) return cache;
    var m = (window.COURSE_MAPS || {}).python;
    cache = normalize(typeof m === 'function' ? m() : m);
    if (cache) { index = {}; cache.levels.forEach(function (lv) { lv.items.forEach(function (it) { index[it.id] = it; }); }); }
    return cache;
  }
  function byId(id) { getMap(); return index ? index[id] : null; }

  function loadProgress() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveProgress(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }

  function stats() {
    var m = getMap(); if (!m) return null;
    var p = loadProgress(), total = 0, done = 0, lessons = 0, projects = 0, quizzes = 0;
    m.levels.forEach(function (lv) { lv.items.forEach(function (it) {
      total++; if (p[it.id]) done++;
      if (it.type === 'lesson') lessons++; else if (it.type === 'project') projects++; else quizzes++;
    }); });
    return { total: total, done: done, levels: m.levels.length, lessons: lessons, projects: projects, quizzes: quizzes };
  }

  function copyText(text, btn) {
    function ok() {
      if (!btn) return;
      var old = btn.innerHTML; btn.classList.add('ok'); btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(function () { btn.classList.remove('ok'); btn.innerHTML = old; }, 1200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { fallback(); });
    } else fallback();
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); ok(); } catch (e) {}
      document.body.removeChild(t);
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.lib-copy') : null;
    if (!b) return;
    e.stopPropagation();
    copyText(b.getAttribute('data-copy') || '', b);
  });

  function crumb(label) { return '<button class="prg-crumb" onclick="goBackPage()"><i class="fa-solid fa-arrow-right"></i> ' + label + '</button>'; }

  window.PY = { esc: esc, getMap: getMap, byId: byId, copy: copyText, crumb: crumb, progress: loadProgress };

  window.PythonCourse = {
    stats: stats,
    normalize: normalize,
    isDone: function (id) { return !!loadProgress()[id]; },
    markDone: function (id, v) { var p = loadProgress(); if (v === false) delete p[id]; else p[id] = 1; saveProgress(p); },
    openLesson: function (id) {
      if (window.PYTHON_LESSONS && window.PYTHON_LESSONS[id] && typeof window.PythonCourse.viewLesson === 'function') { window.PythonCourse.viewLesson(id); return; }
      if (typeof showToast === 'function') showToast('الدرس ده لسه بيتكتب، قريبًا إن شاء الله', 'error');
    }
  };

  /* ===== الصفحة الرئيسية لبايثون: 3 كروت ===== */
  function hubCard(cls, icon, big, title, desc, go, page) {
    return '<div class="py-hub-card ' + cls + '" onclick="' + (/\(/.test(page) ? page : 'navigate(\'' + page + '\')') + '">' +
      '<i class="big fa-solid ' + big + '"></i>' +
      '<div class="py-hub-ico"><i class="fa-solid ' + icon + '"></i></div>' +
      '<h3>' + title + '</h3><p>' + desc + '</p>' +
      '<span class="py-hub-go">' + go + ' <i class="fa-solid fa-arrow-left"></i></span></div>';
  }

  window.loadPythonPage = function () {
    var root = document.getElementById('python-root');
    if (!root) return;
    root.innerHTML =
      '<div class="prg-hero py-hero">' + crumb('كل اللغات') +
        '<div class="prg-hero-top"><div class="prg-hero-icon"><i class="fa-brands fa-python"></i></div>' +
        '<div><h1>Python</h1><p>اتعلم بايثون خطوة خطوة: كورس يومي، مكتبات، وخريطة طريق واضحة</p></div></div>' +
      '</div>' +
      '<div class="py-hub">' +
        hubCard('py-hub-1', 'fa-graduation-cap', 'fa-graduation-cap', 'الكورس', 'كل يوم (Day) ليه صفحته: شرح، شرح صوتي، تطبيق، تمارين وامتحان.', 'ابدأ الكورس', 'python-course') +
        hubCard('py-hub-2', 'fa-cubes', 'fa-cubes', 'المكتبات', 'كل مكتبات بايثون المشهورة مع بحث وطريقة التسطيب على جهازك.', 'تصفّح المكتبات', 'python-libs') +
        hubCard('py-hub-3', 'fa-sitemap', 'fa-sitemap', 'Mind Map', 'خريطة الطريق كاملة: إيه اللي هتتعلمه ومن فين لفين.', 'شوف الخريطة', 'python-mindmap') +
        hubCard('py-hub-4', 'fa-desktop', 'fa-desktop', 'الجهاز', 'جهاز وهمي جوه الموقع: Terminal وملفات وبايثون حقيقية تجرّب عليها بحرية.', 'افتح الجهاز', 'PythonCourse.openPC()') +
      '</div>';
  };
})();
