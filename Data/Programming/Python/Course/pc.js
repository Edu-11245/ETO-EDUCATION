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
      var x = document.createElement('script'); x.src = BASE + 'sim.js?v=12';
      x.onload = res; x.onerror = function () { simP = null; res(); }; document.head.appendChild(x);
    });
    return simP;
  }
  var authP = null;
  function loadAuth() {
    if (window.EtoAuth) return Promise.resolve();
    if (authP) return authP;
    function sc(src) { return new Promise(function (res) { var x = document.createElement('script'); x.src = src; x.onload = res; x.onerror = function () { x.remove(); res(); }; document.head.appendChild(x); }); }
    authP = sc(BASE + 'config.js?v=1').then(function () { return sc(BASE + 'auth.js?v=4'); }).then(function () { if (!window.EtoAuth) authP = null; });
    return authP;
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
      /* الوضع الحر (قرص D) محتاج تسجيل دخول. وضع الدرس من غير تسجيل */
      if (!lesson) {
        loadAuth().then(function () {
          if (tok !== S.token) return;
          if (!window.EtoAuth) { box.innerHTML = '<div class="pc-loading">مش قادر أحمّل نظام الحساب. جرّب تاني.</div>'; return; }
          window.EtoAuth.gate(box, function () { return tok === S.token && document.body.contains(box); }).then(function (a) {
            if (tok !== S.token) return; start(a);
          });
        });
        return;
      }
      start(null);
      function start(acc) {
      box.innerHTML = '';
      /* لما الطالب يخلّص كل خطوات الدرس: إشعار للكورس + زرار رجوع للدرس */
      var onDone = lesson ? function () {
        try { if (window.PythonCourse.onPracticeDone) window.PythonCourse.onPracticeDone(ctx.id, ctx.ci || 0); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('eto:practice-done', { detail: { id: ctx.id, ci: ctx.ci || 0 } })); } catch (e) {}
        var t = box.querySelector('.sx-task');
        if (t && !t.querySelector('.pc-finish')) t.insertAdjacentHTML('beforeend', '<div class="ls-actions pc-finish" style="margin-top:10px"><button class="ls-btn" onclick="goBackPage()"><i class="fa-solid fa-arrow-right"></i> رجوع للدرس</button></div>');
      } : null;
      S.sim = window.PySim.mount(box, P, { os: osNow(), page: true, onDone: onDone });
      /* شريط صغير فوق: رجوع (وضع حر لو جاي من درس) */
      var hb = box.querySelector('.sx-hb'), sm = box.querySelector('.sx-brand small');
      if (sm && lesson) sm.textContent = L.title;
      if (hb && acc) {
        var pr = acc.profile, ini = esc((pr.name || '?').trim().charAt(0));
        hb.insertAdjacentHTML('afterbegin', '<button class="pc-acc" title="تسجيل الخروج"><b>' + (pr.photo ? '<img src="' + esc(pr.photo) + '" alt="">' : ini) + '</b><span>' + esc(pr.name) + '</span><i class="fa-solid fa-right-from-bracket"></i></button>');
        hb.querySelector('.pc-acc').onclick = function () { window.EtoAuth.signOut(function () { window.loadPythonPC(); }); };
      }
      if (hb) hb.insertAdjacentHTML('afterbegin',
        (lesson ? '<button class="pc-back" onclick="PythonCourse.openPC()"><i class="fa-solid fa-unlock"></i><span>وضع حر</span></button>' : '') +
        '<button class="pc-back" onclick="goBackPage()"><i class="fa-solid fa-arrow-right"></i><span>رجوع</span></button>');
      }
    });
  };
})();
