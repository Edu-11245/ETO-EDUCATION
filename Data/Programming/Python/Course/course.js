/* ===== صفحة الكورس + صفحة اليوم =====
   المحرك عام: بيحمّل Day1/day.js ثم Day2/day.js ... ويقف عند أول يوم مش موجود.
   عشان تضيف يوم جديد: اعمل فولدر Day{n} فيه day.js وفولدر lessons. مفيش أي ملف تاني بيتعدّل. */
(function () {
  var BASE = 'Data/Programming/Python/Course/';
  var MAX_DAYS = 120, VER = '1';
  var STEPS = [['fa-book-open', 'شرح'], ['fa-headphones', 'شرح صوتي'], ['fa-terminal', 'تطبيق عملي'], ['fa-pen', 'تمرين'], ['fa-flag-checkered', 'كويز']];
  var currentDay = 1, daysP = null;
  var esc = function (s) { return window.PY.esc(s); };
  window.PYTHON_DAYS = window.PYTHON_DAYS || {};

  function loadDay(n) {
    return new Promise(function (res) {
      if (window.PYTHON_DAYS[n]) return res(window.PYTHON_DAYS[n]);
      var s = document.createElement('script');
      s.src = BASE + 'Day' + n + '/day.js?v=' + VER;
      s.onload = function () { res(window.PYTHON_DAYS[n] || null); };
      s.onerror = function () { s.remove(); res(null); };
      document.head.appendChild(s);
    });
  }
  /* بيجرّب الأيام ورا بعض لحد ما يلاقي يوم ناقص */
  function whenDays() {
    if (daysP) return daysP;
    daysP = new Promise(function (res) {
      (function step(n) {
        if (n > MAX_DAYS) return res();
        loadDay(n).then(function (d) { if (d) step(n + 1); else res(); });
      })(1);
    });
    return daysP;
  }
  function days() {
    return Object.keys(window.PYTHON_DAYS).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return window.PYTHON_DAYS[k]; });
  }
  function titleOf(id) { var m = window.PY.byId(id); return m ? m.title : id; }

  window.loadPythonCourse = function () {
    var root = document.getElementById('python-course-root');
    if (!root) return;
    root.innerHTML = '<div class="prg-hero py-hero py-hero-sm">' + window.PY.crumb('Python') +
      '<div class="prg-hero-top"><div class="prg-hero-icon"><i class="fa-solid fa-graduation-cap"></i></div>' +
      '<div><h1>كورس Python</h1><p>كل يوم صفحة مستقلة، وبنخلصه خطوة خطوة</p></div></div></div>' +
      '<div class="py-days" id="py-days"><div class="prg-empty">جاري التحميل...</div></div>';
    whenDays().then(function () {
      var box = document.getElementById('py-days'); if (!box) return;
      var ds = days();
      box.innerHTML = ds.map(function (d) {
        var done = d.lessons.filter(function (id) { return window.PythonCourse.isDone(id); }).length;
        return '<div class="py-day" onclick="PythonCourse.openDay(' + d.n + ')">' +
          '<div class="py-day-top"><div class="py-day-n"><small>DAY</small><b>' + d.n + '</b></div>' +
          '<span class="py-day-badge" style="' + (done === d.lessons.length && done ? 'background:#dcfce7;color:#15803d' : '') + '">' + (done ? done + ' / ' + d.lessons.length : 'متاح') + '</span></div>' +
          '<h3>' + esc(d.title) + '</h3><p>' + esc(d.desc || '') + '</p>' +
          '<div class="py-day-meta"><span>' + (d.parts ? d.parts + ' فصول' : d.lessons.length + ' دروس') + '</span><span>تطبيق عملي</span><span>كويز</span></div></div>';
      }).join('') + '<div class="py-day more"><div><i class="fa-solid fa-lock" style="font-size:22px"></i><br>باقي الأيام قريبًا</div></div>';
    });
  };

  window.loadPythonDay = function () {
    var root = document.getElementById('python-day-root');
    if (!root) return;
    whenDays().then(function () {
      var d = window.PYTHON_DAYS[currentDay] || days()[0];
      if (!d) { root.innerHTML = '<div class="prg-error">مفيش أيام لسه.</div>'; return; }
      root.innerHTML =
        '<div class="prg-hero py-hero py-hero-sm">' + window.PY.crumb('الكورس') +
          '<div class="prg-hero-top"><div class="prg-hero-icon"><b style="font-size:20px">' + d.n + '</b></div>' +
          '<div><h1>Day ' + d.n + ': ' + esc(d.title) + '</h1><p>' + esc(d.desc || '') + '</p></div></div>' +
          '<div class="py-steps">' + STEPS.map(function (s, i) { return '<span class="py-step"><i class="fa-solid ' + s[0] + '"></i>' + (i + 1) + '. ' + s[1] + '</span>'; }).join('') + '</div></div>' +
        '<div class="py-lessons">' + d.lessons.map(function (id, i) {
          return '<div class="py-lesson" onclick="PythonCourse.openLesson(\'' + esc(id) + '\')"><span class="py-lesson-n">' + (i + 1) + '</span>' +
            '<span class="py-lesson-t" dir="auto">' + esc((window.PYTHON_LESSONS[id] && window.PYTHON_LESSONS[id].title) || titleOf(id)) + '</span>' +
            '<span class="py-lesson-tag" data-lt="' + esc(id) + '">...</span></div>';
        }).join('') + '</div>';
      /* كل درس بيتحمّل: لو الملف موجود يبقى "متاح" وإلا "قريبًا" */
      d.lessons.forEach(function (id) {
        window.PythonCourse.hasLesson(id).then(function (ok) {
          var t = root.querySelector('[data-lt="' + id + '"]'); if (!t) return;
          var done = window.PythonCourse.isDone(id);
          t.textContent = done ? 'خلّصته' : ok ? 'متاح' : 'قريبًا';
          if (ok) t.style.cssText = done ? 'background:#dcfce7;color:#15803d' : 'background:#dbeafe;color:#1d4ed8';
        });
      });
    });
  };

  window.PythonCourse.base = BASE;
  window.PythonCourse.whenDays = whenDays;
  window.PythonCourse.days = days;
  window.PythonCourse.openDay = function (n) {
    currentDay = n; var d = window.PYTHON_DAYS[n];
    if (d && d.lessons.length === 1 && window.PythonCourse.openLesson) { window.PythonCourse.openLesson(d.lessons[0]); return; }
    navigate('python-day');
  };
})();
