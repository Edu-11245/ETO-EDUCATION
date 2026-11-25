/* ===== محرك صفحة الدرس (درس واحد بفصول، كل فصل: شرح متحرك ← تطبيق ← تمرين ← كويز) =====
   بيحمّل ملف الدرس من Course/Day{n}/lessons/{id}.js ويعرضه في خطوات:
   شرح ← شرح صوتي ← (جرّب الكود) ← تمرين ← كويز
   شكل بيانات الدرس: شوف Day1/lessons/what-is-programming.js */
(function () {
  var BASE = (window.PythonCourse && window.PythonCourse.base) || 'Data/Programming/Python/Course/';
  var esc = function (s) { return window.PY.esc(s); };
  var S = { id: null, L: null, step: 0, quiz: null, order: null, speaking: false, rate: 1 };
  var STEP_META = {
    explain: ['fa-book-open', 'شرح'], audio: ['fa-headphones', 'شرح صوتي'], practice: ['fa-terminal', 'تطبيق عملي'],
    exercise: ['fa-pen', 'تمرين'], quiz: ['fa-flag-checkered', 'كويز'], talk: ['fa-film', 'شرح متحرك']
  };
  window.PYTHON_LESSONS = window.PYTHON_LESSONS || {};

  /* نص عادي ← HTML آمن: **عريض** و `كود` */
  function fmt(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code dir="ltr">$1</code>');
  }

  function dayOf(id) {
    var d = window.PYTHON_DAYS || {};
    for (var k in d) if (d[k].lessons.indexOf(id) > -1) return d[k];
    return null;
  }

  function loadLesson(id) {
    return new Promise(function (res, rej) {
      if (window.PYTHON_LESSONS[id]) return res(window.PYTHON_LESSONS[id]);
      var d = dayOf(id);
      if (!d) return rej('soon');
      var s = document.createElement('script');
      s.src = BASE + 'Day' + d.n + '/lessons/' + encodeURIComponent(id) + '.js?v=1';
      s.onload = function () { window.PYTHON_LESSONS[id] ? res(window.PYTHON_LESSONS[id]) : rej('missing'); };
      s.onerror = function () { s.remove(); rej('soon'); };
      document.head.appendChild(s);
    });
  }

  var simP = null;
  function loadSim() {
    if (window.PySim) return Promise.resolve();
    if (simP) return simP;
    simP = new Promise(function (res) {
      var x = document.createElement('script'); x.src = BASE + 'sim.js?v=1';
      x.onload = res; x.onerror = function () { simP = null; res(); }; document.head.appendChild(x);
    });
    return simP;
  }
  function osNow() {
    try { var o = localStorage.getItem('eto_py_os'); if (o) return o; } catch (e) {}
    var u = (navigator.userAgent || '') + ' ' + (navigator.platform || '');
    return /Win/i.test(u) ? 'win' : /Mac|iPhone|iPad/i.test(u) ? 'mac' : 'linux';
  }

  /* الدرس = فصول. لو الملف قديم (من غير chapters) بيتعامل كفصل واحد */
  function chaps(L) { return L.chapters || [L]; }
  function flow(L) {
    var f = [];
    chaps(L).forEach(function (C, ci) {
      var a = [];
      if (C.talk) a.push('talk'); else { if (C.explain) a.push('explain'); if (C.audio) a.push('audio'); }
      if (C.practice) a.push('practice'); if (C.exercise) a.push('exercise'); if (C.quiz) a.push('quiz');
      a.forEach(function (k) { f.push({ c: ci, k: k }); });
    });
    return f;
  }
  function curC() { var f = flow(S.L)[S.step] || { c: 0 }; return chaps(S.L)[f.c]; }
  function isLast() { return S.step >= flow(S.L).length - 1; }

  var plP = null;
  function loadPlayer() {
    if (window.PyPlayer) return Promise.resolve();
    if (plP) return plP;
    plP = new Promise(function (res) {
      var x = document.createElement('script'); x.src = BASE + 'player.js?v=1';
      x.onload = res; x.onerror = function () { plP = null; res(); }; document.head.appendChild(x);
    });
    return plP;
  }
  function stopTalk() { if (S.talk) { try { S.talk.destroy(); } catch (e) {} S.talk = null; } }

  /* ---------- الشرح ---------- */
  function block(b) {
    switch (b.t) {
      case 'h': return '<h3 class="ls-h">' + fmt(b.x) + '</h3>';
      case 'p': return '<p class="ls-p">' + fmt(b.x) + '</p>';
      case 'tip': return '<div class="ls-call tip"><i class="fa-solid fa-lightbulb"></i><div>' + fmt(b.x) + '</div></div>';
      case 'warn': return '<div class="ls-call warn"><i class="fa-solid fa-triangle-exclamation"></i><div>' + fmt(b.x) + '</div></div>';
      case 'list': return '<ul class="ls-list">' + b.items.map(function (i) { return '<li>' + fmt(i) + '</li>'; }).join('') + '</ul>';
      case 'steps': return '<ol class="ls-flow">' + b.items.map(function (i) { return '<li>' + fmt(i) + '</li>'; }).join('') + '</ol>';
      case 'code': return '<pre class="ls-code" dir="ltr"><code>' + esc(b.x) + '</code></pre>';
      case 'table': return '<div class="ls-table-wrap prg-scroll"><table class="ls-table"><thead><tr>' + b.head.map(function (h) { return '<th>' + fmt(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        b.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + fmt(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      case 'cards': return '<div class="ls-cards">' + b.items.map(function (c) {
        return '<div class="ls-card"><i class="fa-solid ' + esc(c.icon) + '"></i><b>' + fmt(c.title) + '</b><span>' + fmt(c.x) + '</span></div>'; }).join('') + '</div>';
      case 'myths': return '<div class="ls-myths">' + b.items.map(function (m) {
        return '<div class="ls-myth"><div class="bad"><i class="fa-solid fa-xmark"></i>' + fmt(m.bad) + '</div><div class="good"><i class="fa-solid fa-check"></i>' + fmt(m.good) + '</div></div>'; }).join('') + '</div>';
      case 'summary': return '<div class="ls-summary"><h4><i class="fa-solid fa-star"></i> خلاصة الدرس</h4><ul>' + b.items.map(function (i) { return '<li>' + fmt(i) + '</li>'; }).join('') + '</ul></div>';
    }
    return '';
  }
  function explainHtml(L) { return '<div class="ls-body">' + L.explain.map(block).join('') + '</div>'; }

  /* ---------- الصوت ---------- */
  function arVoice() {
    if (!window.speechSynthesis) return null;
    var vs = speechSynthesis.getVoices() || [];
    return vs.filter(function (v) { return /^ar[-_]EG/i.test(v.lang); })[0] || vs.filter(function (v) { return /^ar/i.test(v.lang); })[0] || null;
  }
  function stopSpeak() {
    if (window.speechSynthesis) speechSynthesis.cancel();
    S.speaking = false; S.queueId = (S.queueId || 0) + 1;
    var b = document.getElementById('ls-tts-btn');
    if (b) b.innerHTML = '<i class="fa-solid fa-play"></i> استمع للشرح';
  }
  function speak(text) {
    stopSpeak();
    var parts = text.match(/[^.!؟?\n]+[.!؟?]?/g) || [text], id = S.queueId, v = arVoice(), i = 0;
    S.speaking = true;
    var b = document.getElementById('ls-tts-btn');
    if (b) b.innerHTML = '<i class="fa-solid fa-stop"></i> إيقاف';
    (function next() {
      if (id !== S.queueId || i >= parts.length) { if (id === S.queueId) stopSpeak(); return; }
      var t = parts[i++].trim();
      if (!t) return next();
      var u = new SpeechSynthesisUtterance(t);
      u.lang = v ? v.lang : 'ar-EG'; if (v) u.voice = v; u.rate = S.rate;
      u.onend = next; u.onerror = next;
      speechSynthesis.speak(u);
    })();
  }

  function audioHtml(L) {
    var a = L.audio, d = dayOf(S.id), file = a.file && d ? BASE + 'Day' + d.n + '/audio/' + encodeURIComponent(a.file) : '';
    var player;
    if (file) {
      player = '<audio controls preload="none" src="' + file + '" style="width:100%"></audio>';
    } else if (window.speechSynthesis) {
      player = '<div class="ls-tts"><button id="ls-tts-btn" class="ls-btn" onclick="PyLesson.toggleSpeak()"><i class="fa-solid fa-play"></i> استمع للشرح</button>' +
        '<label class="ls-rate">السرعة <select onchange="PyLesson.setRate(this.value)"><option value="0.8">بطيء</option><option value="1" selected>عادي</option><option value="1.2">سريع</option></select></label></div>' +
        '<div class="ls-note" id="ls-voice-note" style="display:none">جهازك مفيهوش صوت عربي، فالقراءة ممكن تطلع بصوت غريب. جرّب من موبايل أو متصفح تاني، أو هنسجّل الشرح بصوتك بعدين.</div>';
    } else {
      player = '<div class="ls-note">المتصفح ده مبيدعمش القراءة الصوتية. اقرا النص تحت.</div>';
    }
    return '<div class="ls-audio"><div class="ls-audio-head"><i class="fa-solid fa-headphones"></i><div><b>الشرح الصوتي</b><span>اسمع الشرح مرة تانية بأسلوب كلام عادي</span></div></div>' + player +
      '<details class="ls-script"><summary>اقرا النص</summary>' + (a.script || '').split('\n').map(function (p) { return '<p>' + fmt(p) + '</p>'; }).join('') + '</details></div>';
  }

  /* ---------- تمرين الترتيب ---------- */
  function seeded(n, seed) {
    var idx = [], i, x = 0;
    for (i = 0; i < n; i++) idx.push(i);
    for (i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0;
    for (i = n - 1; i > 0; i--) { x = (x * 1664525 + 1013904223) >>> 0; var j = x % (i + 1); var t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    var same = idx.every(function (v, k) { return v === k; });
    if (same) idx.push(idx.shift());
    return idx;
  }
  function orderHtml(L) {
    var e = L.exercise;
    if (!S.order) S.order = { list: seeded(e.items.length, String(S.id) + S.step), checked: false, ok: false };
    var o = S.order;
    return '<div class="ls-ex"><h3 class="ls-h">' + fmt(e.title || 'تمرين') + '</h3><p class="ls-p">' + fmt(e.prompt) + '</p><div class="ls-order">' +
      o.list.map(function (it, pos) {
        var cls = o.checked ? (it === pos ? ' right' : ' wrong') : '';
        return '<div class="ls-ord' + cls + '"><span class="n">' + (pos + 1) + '</span><span class="t">' + fmt(e.items[it]) + '</span>' +
          '<span class="mv"><button ' + (pos === 0 || o.ok ? 'disabled' : '') + ' onclick="PyLesson.move(' + pos + ',-1)" aria-label="فوق"><i class="fa-solid fa-chevron-up"></i></button>' +
          '<button ' + (pos === o.list.length - 1 || o.ok ? 'disabled' : '') + ' onclick="PyLesson.move(' + pos + ',1)" aria-label="تحت"><i class="fa-solid fa-chevron-down"></i></button></span></div>';
      }).join('') + '</div>' +
      (o.checked ? (o.ok ? '<div class="ls-result ok"><i class="fa-solid fa-circle-check"></i> برافو! الترتيب صح. ' + fmt(e.insight || '') + '</div>'
        : '<div class="ls-result bad"><i class="fa-solid fa-circle-xmark"></i> فيه خطوات مش في مكانها (الحمرا). فكّر في الترتيب المنطقي وجرّب تاني.</div>') : '') +
      '<div class="ls-actions">' + (o.ok ? '' : '<button class="ls-btn" onclick="PyLesson.checkOrder()"><i class="fa-solid fa-check"></i> تحقق</button>' +
        '<button class="ls-btn ghost" onclick="PyLesson.showOrder()">اعرض الحل</button>') + '</div></div>';
  }

  /* ---------- الكويز ---------- */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newQuiz(L) {
    return { qi: 0, score: 0, picked: null, done: false,
      qs: L.quiz.questions.map(function (q) {
        var opts = q.options.map(function (t, i) { return { t: t, ok: i === q.answer }; });
        return { q: q.q, why: q.why, opts: shuffle(opts) };
      }) };
  }
  function quizHtml(L) {
    if (!S.quiz) S.quiz = newQuiz(L);
    var z = S.quiz, total = z.qs.length, pass = L.quiz.pass || 60;
    if (z.done) {
      var pct = Math.round(z.score / total * 100), ok = pct >= pass;
      return '<div class="ls-final ' + (ok ? 'ok' : 'bad') + '"><div class="ls-final-ic"><i class="fa-solid ' + (ok ? 'fa-trophy' : 'fa-rotate-right') + '"></i></div>' +
        '<h3>' + (ok ? 'ممتاز! خلّصت الدرس' : 'قريب جدًا') + '</h3><p>نتيجتك: <b>' + z.score + ' / ' + total + '</b> (' + pct + '%)</p>' +
        '<p>' + (ok ? 'اتسجّل إن الدرس ده خلص عندك.' : 'محتاج ' + pass + '% على الأقل. راجع الشرح وجرّب تاني.') + '</p>' +
        '<div class="ls-actions"><button class="ls-btn ghost" onclick="PyLesson.retry()"><i class="fa-solid fa-rotate-right"></i> إعادة الكويز</button>' +
        (ok ? '<button class="ls-btn" onclick="PyLesson.nextLesson()">' + nextLabel() + '</button>' : '<button class="ls-btn" onclick="PyLesson.goStep(0)">راجع الشرح</button>') + '</div></div>';
    }
    var q = z.qs[z.qi];
    return '<div class="ls-quiz"><div class="ls-q-head"><span>سؤال ' + (z.qi + 1) + ' من ' + total + '</span><div class="ls-q-bar"><i style="width:' + (z.qi / total * 100) + '%"></i></div></div>' +
      '<h3 class="ls-q">' + fmt(q.q) + '</h3><div class="ls-opts">' +
      q.opts.map(function (o, i) {
        var cls = z.picked === null ? '' : (o.ok ? ' right' : (z.picked === i ? ' wrong' : ' dim'));
        return '<button class="ls-opt' + cls + '" ' + (z.picked !== null ? 'disabled' : '') + ' onclick="PyLesson.pick(' + i + ')"><span class="k">' + 'أبجد'.charAt(i) + '</span><span>' + fmt(o.t) + '</span></button>';
      }).join('') + '</div>' +
      (z.picked !== null ? '<div class="ls-why ' + (q.opts[z.picked].ok ? 'ok' : 'bad') + '"><b>' + (q.opts[z.picked].ok ? 'إجابة صحيحة' : 'مش دي') + '.</b> ' + fmt(q.why) + '</div>' +
        '<div class="ls-actions"><button class="ls-btn" onclick="PyLesson.nextQ()">' + (z.qi === total - 1 ? 'شوف النتيجة' : 'السؤال التالي') + '</button></div>' : '') + '</div>';
  }

  /* ---------- التنقل بين الدروس ---------- */
  function nextId() {
    var d = dayOf(S.id); if (!d) return null;
    var i = d.lessons.indexOf(S.id);
    return i > -1 && i < d.lessons.length - 1 ? d.lessons[i + 1] : null;
  }
  function nextLabel() { return !isLast() ? 'الفصل التالي <i class="fa-solid fa-arrow-left"></i>' : nextId() ? 'الدرس التالي <i class="fa-solid fa-arrow-left"></i>' : 'رجوع لصفحة اليوم'; }

  /* ---------- رسم الصفحة ---------- */
  function renderPanel() {
    var f = flow(S.L), cu = f[S.step], C = chaps(S.L)[cu.c], k = cu.k, el = document.getElementById('ls-panel');
    if (!el) return;
    stopTalk();
    if (k === 'talk') {
      var d = dayOf(S.id);
      el.innerHTML = '<div id="ls-talk"></div>'; syncNav();
      loadPlayer().then(function () {
        var box = document.getElementById('ls-talk'); if (!box || !window.PyPlayer) return;
        var mine = S.step;
        S.talk = window.PyPlayer.mount(box, C.talk, { cssBase: BASE, audioBase: d ? BASE + 'Day' + d.n + '/audio/' : '',
          onEnd: function () { if (S.step === mine && flow(S.L)[mine + 1]) { var n = document.getElementById('ls-next-hint'); if (n) n.style.display = ''; } } });
      });
      return;
    }
    if (k === 'practice') {
      el.innerHTML = '<div id="ls-sim"></div>'; syncNav();
      loadSim().then(function () { window.PySim.mount(document.getElementById('ls-sim'), C.practice, { os: osNow() }); });
      return;
    }
    var html = k === 'explain' ? explainHtml(C) : k === 'audio' ? audioHtml(C) : k === 'exercise' ? orderHtml(C) : k === 'quiz' ? quizHtml(C) : '';
    el.innerHTML = html; syncNav();
  }
  function syncNav() {
    var f = flow(S.L), cu = f[S.step], C = chaps(S.L);
    document.querySelectorAll('#ls-steps .ls-tab').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-c') === cu.c); });
    var dp = document.getElementById('ls-dp'); if (dp) dp.style.width = (S.step / Math.max(1, f.length - 1) * 100) + '%';
    var kd = document.getElementById('ls-kind');
    if (kd) kd.innerHTML = 'الفصل ' + (cu.c + 1) + ' من ' + C.length + ' · <i class="fa-solid ' + STEP_META[cu.k][0] + '"></i> ' + STEP_META[cu.k][1];
    var nav = document.getElementById('ls-nav');
    if (nav) nav.innerHTML =
      (S.step > 0 ? '<button class="ls-btn ghost" onclick="PyLesson.goStep(' + (S.step - 1) + ')"><i class="fa-solid fa-arrow-right"></i> السابق</button>' : '<span></span>') +
      (S.step < f.length - 1 ? '<button class="ls-btn" onclick="PyLesson.goStep(' + (S.step + 1) + ')">التالي <i class="fa-solid fa-arrow-left"></i></button>' : '<span></span>');
  }

  function render() {
    var root = document.getElementById('python-lesson-root');
    if (!root || !S.L) return;
    var L = S.L, d = dayOf(L.id), done = window.PythonCourse.isDone(L.id);
    root.innerHTML =
      '<div class="prg-hero py-hero py-hero-sm">' + window.PY.crumb(d ? 'Day ' + d.n : 'الكورس') +
        '<div class="prg-hero-top"><div class="prg-hero-icon"><i class="fa-solid fa-book-open"></i></div>' +
        '<div><h1>' + esc(L.title) + '</h1><p>' + fmt(L.goal || '') + '</p></div></div>' +
        '<div class="py-steps"><span class="py-step"><i class="fa-regular fa-clock"></i>حوالي ' + (L.minutes || 10) + ' دقيقة</span>' +
        (done ? '<span class="py-step"><i class="fa-solid fa-check"></i>خلّصت الدرس ده</span>' : '') + '</div></div>' +
      '<div id="ls-steps" class="ls-steps prg-scroll">' + chaps(L).map(function (C, ci) {
        return '<button class="ls-tab" data-c="' + ci + '" onclick="PyLesson.goChapter(' + ci + ')"><b class="ls-tn">' + (ci + 1) + '</b><span>' + esc(C.title || ('فصل ' + (ci + 1))) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="ls-day-prog"><i id="ls-dp"></i></div><div id="ls-kind" class="ls-kind"></div>' +
      '<div id="ls-panel" class="ls-panel"></div><div id="ls-nav" class="ls-nav"></div>';
    renderPanel();
  }

  function open(id) {
    return window.PythonCourse.whenDays().then(function () { return loadLesson(id); }).then(function (L) {
      stopSpeak(); stopTalk();
      S.id = id; S.L = L; S.step = 0; S.quiz = null; S.order = null;
      try { sessionStorage.setItem('eto_py_lesson', id); } catch (e) {}
      navigate('python-lesson');
    }).catch(function (why) {
      if (typeof showToast === 'function') showToast(why === 'soon' ? 'الدرس ده لسه بيتكتب، قريبًا إن شاء الله' : 'مش لاقي ملف الدرس، اتأكد من مكانه في فولدر lessons', 'error');
    });
  }

  window.PythonCourse.openLesson = function (id) { open(id); };
  window.PythonCourse.hasLesson = function (id) {
    return window.PythonCourse.whenDays().then(function () { return loadLesson(id); }).then(function () { return true; }, function () { return false; });
  };

  window.loadPythonLesson = function () {
    if (S.L) { render(); return; }
    var id; try { id = sessionStorage.getItem('eto_py_lesson'); } catch (e) {}
    if (!id) { setTimeout(function () { navigate('python-course', false); }, 0); return; }
    window.PythonCourse.whenDays().then(function () { return loadLesson(id); }).then(function (L) { S.id = id; S.L = L; render(); }).catch(function () { navigate('python-course', false); });
  };

  /* لو الصفحة اتقفلت والصوت شغال نوقفه */
  setInterval(function () {
    if (S.talk) { var p = document.getElementById('page-python-lesson'); if (!p || p.classList.contains('hidden')) S.talk.pause(); }
    if (!S.speaking) return;
    var sec = document.getElementById('page-python-lesson');
    if (!sec || sec.classList.contains('hidden')) stopSpeak();
  }, 600);
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = function () {};

  window.PyLesson = {
    goStep: function (i) {
      stopSpeak(); stopTalk(); S.step = i; S.quiz = null; S.order = null; renderPanel();
      var el = document.getElementById('ls-steps'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    goChapter: function (c) { var f = flow(S.L); for (var i = 0; i < f.length; i++) if (f[i].c === c) { window.PyLesson.goStep(i); return; } },
    toggleSpeak: function () {
      if (S.speaking) { stopSpeak(); return; }
      var note = document.getElementById('ls-voice-note');
      if (note && !arVoice()) note.style.display = 'block';
      speak(curC().audio.script || '');
    },
    setRate: function (v) { S.rate = parseFloat(v) || 1; if (S.speaking) speak(curC().audio.script || ''); },
    move: function (pos, dir) {
      var o = S.order, to = pos + dir; if (to < 0 || to >= o.list.length) return;
      var t = o.list[pos]; o.list[pos] = o.list[to]; o.list[to] = t; o.checked = false; renderPanel();
    },
    checkOrder: function () {
      var o = S.order; o.checked = true; o.ok = o.list.every(function (v, i) { return v === i; }); renderPanel();
    },
    showOrder: function () {
      var o = S.order; o.list = o.list.map(function (_, i) { return i; }); o.checked = true; o.ok = true; renderPanel();
    },
    pick: function (i) {
      var z = S.quiz; if (z.picked !== null) return;
      z.picked = i; if (z.qs[z.qi].opts[i].ok) z.score++; renderPanel();
    },
    nextQ: function () {
      var z = S.quiz; z.picked = null;
      if (z.qi >= z.qs.length - 1) {
        z.done = true;
        if (isLast() && Math.round(z.score / z.qs.length * 100) >= (curC().quiz.pass || 60)) window.PythonCourse.markDone(S.id);
      } else z.qi++;
      renderPanel();
    },
    retry: function () { S.quiz = null; renderPanel(); },
    nextLesson: function () {
      if (!isLast()) { window.PyLesson.goStep(S.step + 1); return; }
      var n = nextId();
      if (n) open(n).then(function () { render(); }); else navigate('python-day');
    }
  };
})();
