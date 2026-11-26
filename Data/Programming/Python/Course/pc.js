/* ===== صفحة الجهاز (Eto Virtual PC) =====
   صفحة مستقلة في السايت: python-pc
   - من كارت "الجهاز" في صفحة Python  => وضع حر
   - من خطوة "تطبيق عملي" في أي درس   => PythonCourse.openPC(lessonId, chapterIndex) بخطوات الدرس نفسه
   لما تسيب الصفحة، navigation.js بينادي unloadPythonPC فالجهاز بيتقفل وبيتنضف بالكامل. */
(function () {
  var BASE = (window.PythonCourse && window.PythonCourse.base) || 'Data/Programming/Python/Course/';
  var KEY = 'eto_py_pc', S = { sim: null, token: 0 }, simP = null;
  var esc = function (s) { return window.PY.esc(s); };
  var FREE = {
    intro: '', steps: [],
    done: 'الجهاز جاهز. جرّب براحتك.',
    free: { code: 'name = "Eto"\nprint("Hello", name)', say: 'ده بايثون حقيقية شغالة في المتصفح. عدّل واضغط شغّل.' }
  };

  function loadSim() {
    if (window.PySim) return Promise.resolve();
    if (simP) return simP;
    simP = new Promise(function (res) {
      var x = document.createElement('script'); x.src = BASE + 'sim.js?v=8';
      x.onload = res; x.onerror = function () { simP = null; res(); }; document.head.appendChild(x);
    });
    return simP;
  }
  function osNow() {
    try { var o = localStorage.getItem('eto_py_os'); if (o) return o; } catch (e) {}
    var u = (navigator.userAgent || '') + ' ' + (navigator.platform || '');
    return /Win/i.test(u) ? 'win' : /Mac|iPhone|iPad/i.test(u) ? 'mac' : 'linux';
  }
  function saveCtx(c) { try { if (c) sessionStorage.setItem(KEY, JSON.stringify(c)); else sessionStorage.removeItem(KEY); } catch (e) {} }
  function readCtx() { try { return JSON.parse(sessionStorage.getItem(KEY)) || null; } catch (e) { return null; } }

  function stop() {
    S.token++;
    if (S.sim && S.sim.destroy) { try { S.sim.destroy(); } catch (e) {} }
    S.sim = null;
  }
  window.unloadPythonPC = stop;

  window.PythonCourse.openPC = function (id, ci) {
    saveCtx(id ? { id: id, ci: ci || 0 } : null);
    navigate('python-pc');
  };

  window.loadPythonPC = function () {
    var root = document.getElementById('python-pc-root'); if (!root) return;
    stop(); var tok = S.token, ctx = readCtx();
    root.innerHTML = '<div id="pc-box"><div class="pc-loading">جاري تجهيز الجهاز...</div></div>';
    var lp = ctx && window.PythonCourse.getLesson ? window.PythonCourse.getLesson(ctx.id).catch(function () { return null; }) : Promise.resolve(null);
    Promise.all([lp, loadSim()]).then(function (r) {
      if (tok !== S.token) return; /* سيبت الصفحة قبل ما يخلص التحميل */
      var L = r[0], box = document.getElementById('pc-box'); if (!box) return;
      if (!window.PySim) { box.innerHTML = '<div class="pc-loading">مش قادر أحمّل الجهاز. اتأكد من الاتصال وجرّب تاني.</div>'; return; }
      var C = L ? (L.chapters ? L.chapters[ctx.ci || 0] : L) : null;
      var P = C && C.practice ? C.practice : FREE, lesson = !!(C && C.practice);
      box.innerHTML = '';
      S.sim = window.PySim.mount(box, P, { os: osNow(), page: true });
      /* شريط صغير فوق: رجوع (وضع حر لو جاي من درس) */
      var hb = box.querySelector('.sx-hb'), sm = box.querySelector('.sx-brand small');
      if (sm && lesson) sm.textContent = L.title;
      if (hb) hb.insertAdjacentHTML('afterbegin',
        (lesson ? '<button class="pc-back" onclick="PythonCourse.openPC()"><i class="fa-solid fa-unlock"></i><span>وضع حر</span></button>' : '') +
        '<button class="pc-back" onclick="goBackPage()"><i class="fa-solid fa-arrow-right"></i><span>رجوع</span></button>');
    });
  };
})();
