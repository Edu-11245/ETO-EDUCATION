/* ===== صفحة Programming: كروت اللغات =====
   عشان تضيف لغة جديدة: ضيف عنصر في LANGS (ready:true لما كورسها يجهز، و page = id الصفحة اللي هتتفتح) */
(function () {
  var LANGS = [
    { id: 'python', title: 'Python', desc: 'أسهل لغة تبدأ بيها: من أول print لحد مشاريع حقيقية وألعاب.', img: 'Data/Programming/img/Python.jpg', icon: 'fa-brands fa-python', color: '#2563eb', grad: 'linear-gradient(135deg,#1e3a8a,#2563eb 55%,#facc15)', ready: true, page: 'python' },
    { id: 'javascript', title: 'JavaScript', desc: 'لغة المواقع والتفاعل في المتصفح.', img: 'Data/Programming/img/JavaScript.jpg', icon: 'fa-brands fa-js', color: '#ca8a04', grad: 'linear-gradient(135deg,#713f12,#eab308)' },
    { id: 'html-css', title: 'HTML & CSS', desc: 'أساس بناء وتصميم صفحات الويب.', img: 'Data/Programming/img/HTML-CSS.jpg', icon: 'fa-brands fa-html5', color: '#ea580c', grad: 'linear-gradient(135deg,#7c2d12,#f97316)' },
    { id: 'cpp', title: 'C++', desc: 'لغة السرعة والألعاب والخوارزميات.', img: 'Data/Programming/img/Cpp.jpg', icon: 'fa-solid fa-microchip', color: '#0369a1', grad: 'linear-gradient(135deg,#0c4a6e,#0ea5e9)' },
    { id: 'java', title: 'Java', desc: 'لغة التطبيقات الكبيرة وأندرويد.', img: 'Data/Programming/img/Java.jpg', icon: 'fa-brands fa-java', color: '#dc2626', grad: 'linear-gradient(135deg,#7f1d1d,#ef4444)' },
    { id: 'sql', title: 'SQL', desc: 'التعامل مع قواعد البيانات.', img: 'Data/Programming/img/SQL.jpg', icon: 'fa-solid fa-database', color: '#0f766e', grad: 'linear-gradient(135deg,#134e4a,#14b8a6)' }
  ];
  window.PROGRAMMING_LANGS = LANGS;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }

  function progressHtml(l) {
    if (l.id === 'python' && window.PythonCourse) {
      var s = window.PythonCourse.stats();
      if (s && s.total && s.done) {
        var pct = Math.round(s.done / s.total * 100);
        return '<div class="prg-mini-bar"><i style="width:' + pct + '%"></i></div>' +
               '<p style="margin-top:6px;font-size:11.5px;font-weight:800;color:#64748b">' + s.done + ' / ' + s.total + ' درس (' + pct + '%)</p>';
      }
    }
    return '';
  }

  function cardHtml(l) {
    var open = l.ready ? 'onclick="navigate(\'' + l.page + '\')"' : '';
    return '<div class="prg-card ' + (l.ready ? '' : 'is-soon') + '" ' + open + '>' +
      '<div class="prg-card-img" style="background:' + l.grad + '">' +
        '<img src="' + esc(l.img) + '" alt="' + esc(l.title) + '" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">' +
        '<span class="prg-badge ' + (l.ready ? '' : 'soon') + '">' + (l.ready ? 'متاح' : 'قريبًا') + '</span>' +
        '<div class="prg-card-icon" style="color:' + l.color + '"><i class="' + l.icon + '"></i></div>' +
      '</div>' +
      '<div class="prg-card-body"><h3>' + esc(l.title) + '</h3><p>' + esc(l.desc) + '</p>' + progressHtml(l) + '</div>' +
      '<div class="prg-card-foot"><span>' + (l.ready ? 'ابدأ الكورس' : 'هنضيفه قريب') + '</span>' +
      (l.ready ? '<i class="fa-solid fa-arrow-left"></i>' : '<i class="fa-solid fa-lock"></i>') + '</div>' +
    '</div>';
  }

  window.loadProgrammingPage = function () {
    var grid = document.getElementById('programming-grid');
    if (grid) grid.innerHTML = LANGS.map(cardHtml).join('');
  };
})();
