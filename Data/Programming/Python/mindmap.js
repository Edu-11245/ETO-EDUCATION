/* ===== صفحة Mind Map: خريطة الطريق (من map.js) ===== */
(function () {
  var COLORS = ['#10b981', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#ef4444', '#f97316', '#22c55e', '#06b6d4', '#a855f7'];
  var VISIBLE = 8;
  var esc = function (s) { return window.PY.esc(s); };

  function chip(it) {
    var icon = it.type === 'project' ? '<i class="fa-solid fa-hammer"></i>' : it.type === 'quiz' ? '<i class="fa-solid fa-flag-checkered"></i>' : '<em>' + it.n + '</em>';
    return icon + '<span dir="auto">' + esc(it.title) + '</span>';
  }

  window.PyMind = {
    go: function (i) { var el = document.getElementById('pm-lv-' + i); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    toggle: function (i, btn) {
      var c = document.getElementById('pm-lv-' + i), on = c.classList.toggle('expanded');
      btn.textContent = on ? 'عرض أقل' : btn.getAttribute('data-more');
    }
  };

  window.loadPythonMindmap = function () {
    var root = document.getElementById('python-mindmap-root');
    if (!root) return;
    var m = window.PY.getMap(), s = window.PythonCourse.stats();
    var head = '<div class="prg-hero py-hero py-hero-sm" style="background:linear-gradient(135deg,#312e81,#6d28d9 60%,#ec4899)">' + window.PY.crumb('Python') +
      '<div class="prg-hero-top"><div class="prg-hero-icon" style="background:#fff;color:#7c3aed"><i class="fa-solid fa-sitemap"></i></div>' +
      '<div><h1>Mind Map</h1><p>خريطة الطريق كاملة من أول print لحد المشاريع الحقيقية</p></div></div></div>';
    if (!m || !m.levels.length) {
      root.innerHTML = head + '<div class="prg-error"><i class="fa-solid fa-triangle-exclamation"></i> مش قادر أقرا الخريطة. اتأكد إن Data/Programming/Python/Data/map.js موجود ومتحمّل.</div>';
      return;
    }
    root.innerHTML = head +
      '<div class="pm-pills">' + m.levels.map(function (lv, i) {
        return '<button class="pm-pill" style="background:' + COLORS[i % COLORS.length] + '" title="' + esc(lv.name) + '" onclick="PyMind.go(' + i + ')">' + esc(lv.num) + '</button>';
      }).join('') + '</div>' +
      '<div class="pm-legend"><span><i class="fa-solid fa-book-open" style="color:#2563eb"></i>درس</span><span><i class="fa-solid fa-hammer" style="color:#d97706"></i>مشروع</span><span><i class="fa-solid fa-flag-checkered" style="color:#db2777"></i>اختبار المستوى</span></div>' +
      '<div class="pm-root"><div class="pm-root-node"><i class="fa-brands fa-python"></i><b>Python</b><span>' + s.levels + ' مستوى • ' + s.lessons + ' درس • ' + s.projects + ' مشروع</span></div></div>' +
      '<div class="pm-tree">' + m.levels.map(function (lv, i) {
        var c = COLORS[i % COLORS.length], c2 = COLORS[(i + 1) % COLORS.length];
        var l = lv.items.filter(function (x) { return x.type === 'lesson'; }).length;
        var p = lv.items.filter(function (x) { return x.type === 'project'; }).length;
        var extra = Math.max(0, lv.items.length - VISIBLE);
        return '<div class="pm-row" style="--c:' + c + ';--c2:' + c2 + '">' +
          '<div class="pm-mid"><div class="pm-dot">' + esc(lv.num) + '</div></div>' +
          '<div class="pm-card" id="pm-lv-' + i + '">' +
            '<h3><small>LEVEL ' + esc(lv.num) + '</small>' + esc(lv.name) + '</h3>' +
            '<div class="pm-count"><span>' + l + ' درس</span>' + (p ? '<span>' + p + ' مشروع</span>' : '') + '</div>' +
            '<div class="pm-chips">' + lv.items.map(function (it, k) { return '<span class="pm-chip ' + it.type + (k >= VISIBLE ? ' extra' : '') + '">' + chip(it) + '</span>'; }).join('') + '</div>' +
            (extra ? '<button class="pm-toggle" data-more="عرض كل العناصر (+' + extra + ')" onclick="PyMind.toggle(' + i + ',this)">عرض كل العناصر (+' + extra + ')</button>' : '') +
          '</div></div>';
      }).join('') + '</div>' +
      '<div class="pm-end"><i class="fa-solid fa-flag-checkered"></i> وبعدها بتبني مشاريعك بنفسك!</div>';
  };
})();
