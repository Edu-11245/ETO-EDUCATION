/* ===== مشغّل الشرح المتحرك (زي منصة الماث) =====
   PyPlayer.mount(el, T, { audioBase, onEnd })
   T = { audio:'file.mp3'?, stage:'<html فيه مشاهد .pp-sc id=...>', lines:[ { say:'الجملة', t:ثواني?, ...cue } ] }
   cue (بيحصل لما الجملة تتقال):
     scene:'id'            اعرض مشهد (باقي المشاهد بتختفي)
     show:'#a,#b'  hide:'#a'  hl:'#a'  unhl:'#a'
     fx:['#a','pop'|'shake'|'pulse'|'bounce'|'flash']
     text:['#a','html']    type:['#a','نص بيتكتب حرف حرف']
   التوقيت: لو فيه ملف صوت بيمشي على t (ثواني). الجمل اللي من غير t بتتوزع تلقائي على حسب طول الكلام.
   من غير ملف صوت: بيقرا بصوت المتصفح وكل جملة بتحرّك الشاشة وقت ما تتقال. */
(function (root) {
  var CSS = null;
  function ensureCss(base) {
    if (CSS) return; CSS = document.createElement('link'); CSS.rel = 'stylesheet'; CSS.href = base + 'player.css?v=1'; document.head.appendChild(CSS);
  }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var fmtT = function (s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + pad(s % 60); };
  var IC = { play: 'fa-play', pause: 'fa-pause', prev: 'fa-backward-step', next: 'fa-forward-step', redo: 'fa-rotate-right', full: 'fa-expand', txt: 'fa-closed-captioning' };

  function arVoice() {
    if (!root.speechSynthesis) return null;
    var vs = speechSynthesis.getVoices() || [];
    return vs.filter(function (v) { return /^ar[-_]EG/i.test(v.lang); })[0] || vs.filter(function (v) { return /^ar/i.test(v.lang); })[0] || null;
  }
  /* توزيع أوقات الجمل: اللي ليها t ثابتة، والباقي بالنسبة لطول الكلام */
  function spread(lines, dur) {
    var n = lines.length, T = new Array(n), i, j;
    var w = lines.map(function (l) { return Math.max(8, (l.say || '').length); });
    for (i = 0; i < n; i++) T[i] = typeof lines[i].t === 'number' ? lines[i].t : null;
    if (T[0] == null) T[0] = 0;
    i = 0;
    while (i < n) {
      if (T[i] != null) { i++; continue; }
      var a = i - 1, b = i; while (b < n && T[b] == null) b++;
      var t0 = T[a], t1 = b < n ? T[b] : dur, sum = 0, acc = 0;
      for (j = a; j < b; j++) sum += w[j];
      for (j = a + 1; j < b; j++) { acc += w[j - 1]; T[j] = t0 + (t1 - t0) * acc / sum; }
      i = b;
    }
    return T;
  }

  function mount(el, T, opts) {
    opts = opts || {}; ensureCss(opts.cssBase || (opts.audioBase || '').replace(/audio\/$/, '').replace(/Day\d+\/$/, ''));
    var lines = T.lines || [], N = lines.length;
    var S = { k: -1, playing: false, mode: T.audio ? 'audio' : 'tts', rate: 1, times: null, dur: 0, id: 0, gone: false, raf: 0, timer: 0 };
    var A = null, tw = [];

    el.innerHTML =
      '<div class="pp" dir="rtl"><div class="pp-stage"><div class="pp-chip"></div><div class="pp-scene"><div class="pp-fit">' + (T.stage || '') + '</div></div>' +
      '<div class="pp-cap" hidden></div><button class="pp-start" aria-label="شغّل"><i class="fa-solid fa-play"></i><span>اضغط وابدأ</span></button></div>' +
      '<div class="pp-ctl" dir="ltr"><button class="pp-b" data-a="prev" title="الجملة اللي قبلها"><i class="fa-solid ' + IC.prev + '"></i></button>' +
      '<button class="pp-b big" data-a="play" title="تشغيل / إيقاف"><i class="fa-solid ' + IC.play + '"></i></button>' +
      '<button class="pp-b" data-a="next" title="الجملة اللي بعدها"><i class="fa-solid ' + IC.next + '"></i></button>' +
      '<button class="pp-b" data-a="redo" title="من الأول"><i class="fa-solid ' + IC.redo + '"></i></button>' +
      '<input class="pp-bar" type="range" min="0" max="1000" value="0" aria-label="التقدم"><span class="pp-cnt">0 / ' + N + '</span>' +
      '<select class="pp-rate" title="السرعة"><option value="0.8">0.8x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option></select>' +
      '<button class="pp-b" data-a="txt" title="النص"><i class="fa-solid ' + IC.txt + '"></i></button>' +
      '<button class="pp-b" data-a="full" title="ملء الشاشة"><i class="fa-solid ' + IC.full + '"></i></button></div></div>';

    var $ = function (q) { return el.querySelector(q); };
    var root_ = $('.pp'), stage = $('.pp-stage'), fitEl = $('.pp-fit'), cap = $('.pp-cap'), bar = $('.pp-bar'), cnt = $('.pp-cnt');
    var q = function (s) { return s ? fitEl.querySelectorAll(s) : []; };
    var scenes = function () { return fitEl.querySelectorAll('.pp-sc'); };

    /* ---- ضبط الحجم ---- */
    function fit() {
      var sc = fitEl.parentNode; if (!fitEl.offsetWidth) return;
      var k = Math.min(1.5, sc.clientWidth * .94 / fitEl.offsetWidth, sc.clientHeight * .9 / fitEl.offsetHeight);
      fitEl.style.transform = 'scale(' + k + ')';
    }
    var ro = root.ResizeObserver ? new ResizeObserver(fit) : null; if (ro) ro.observe(stage);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    /* ---- الأحداث (cues) ---- */
    function typeInto(e, txt, instant) {
      if (instant) { e.textContent = txt; return; }
      e.textContent = ''; var i = 0, id = setInterval(function () { e.textContent = txt.slice(0, ++i); if (i >= txt.length) clearInterval(id); }, 45); tw.push(id);
    }
    function cue(c, instant) {
      if (c.scene) { scenes().forEach(function (s) { s.classList.toggle('on', s.id === c.scene); }); setTimeout(fit, 0); }
      if (c.show) q(c.show).forEach(function (e) { e.classList.remove('hid'); });
      if (c.hide) q(c.hide).forEach(function (e) { e.classList.add('hid'); });
      if (c.hl) q(c.hl).forEach(function (e) { e.classList.add('hl'); });
      if (c.unhl) q(c.unhl).forEach(function (e) { e.classList.remove('hl'); });
      if (c.text) q(c.text[0]).forEach(function (e) { e.innerHTML = c.text[1]; });
      if (c.type) q(c.type[0]).forEach(function (e) { e.classList.remove('hid'); typeInto(e, c.type[1], instant); });
      if (c.fx && !instant) q(c.fx[0]).forEach(function (e) { var cl = 'fx-' + c.fx[1]; e.classList.remove(cl); void e.offsetWidth; e.classList.add(cl); });
      if (c.run) c.run(fitEl);
    }
    function reset() {
      tw.forEach(clearInterval); tw = [];
      fitEl.innerHTML = T.stage || '';
      var first = scenes()[0]; if (first) first.classList.add('on');
      fit();
    }
    /* بيبني الشاشة كأن الجمل لحد k اتقالت */
    function build(k) { reset(); for (var i = 0; i <= k; i++) cue(lines[i], true); }

    function show(k) {
      S.k = k; cap.innerHTML = k >= 0 && lines[k] ? esc(lines[k].say) : '';
      var ch = T.title || ''; $('.pp-chip').textContent = ch;
      prog();
    }
    function prog() {
      cnt.textContent = (Math.max(0, S.k + 1)) + ' / ' + N;
      if (S.mode === 'audio' && A && S.dur) { bar.value = Math.min(1000, A.currentTime / S.dur * 1000); cnt.textContent = fmtT(A.currentTime) + ' / ' + fmtT(S.dur); }
      else bar.value = N ? Math.max(0, S.k + 1) / N * 1000 : 0;
    }
    function ui() {
      var b = $('[data-a="play"] i'); b.className = 'fa-solid ' + (S.playing ? IC.pause : IC.play);
      $('.pp-start').style.display = S.k < 0 && !S.playing ? '' : 'none';
    }

    /* ---- التشغيل ---- */
    function halt() { S.id++; clearTimeout(S.timer); cancelAnimationFrame(S.raf); if (A) A.pause(); if (root.speechSynthesis) speechSynthesis.cancel(); }
    function ended() { halt(); S.playing = false; ui(); if (opts.onEnd) opts.onEnd(); }

    function playFrom(k) {
      halt(); if (k >= N) return ended();
      var id = S.id; S.playing = true; ui();
      if (S.mode === 'audio') return playAudio(k, id);
      if (S.mode === 'tts' && root.speechSynthesis) return playTts(k, id);
      playTimer(k, id);
    }
    function playTts(k, id) {
      if (id !== S.id) return; if (k >= N) return ended();
      cue(lines[k]); show(k);
      var u = new SpeechSynthesisUtterance(lines[k].say), v = arVoice(); u.lang = v ? v.lang : 'ar-EG'; if (v) u.voice = v; u.rate = S.rate;
      var done = false, nxt = function () { if (done || id !== S.id) return; done = true; playTts(k + 1, id); };
      u.onend = nxt; u.onerror = nxt;
      /* لو المتصفح مفيهوش صوت بيشتغل فعلًا نكمّل بتايمر */
      S.timer = setTimeout(function () { if (!speechSynthesis.speaking && !done) nxt(); }, 1500);
      speechSynthesis.speak(u);
    }
    function playTimer(k, id) {
      if (id !== S.id) return; if (k >= N) return ended();
      cue(lines[k]); show(k);
      S.timer = setTimeout(function () { playTimer(k + 1, id); }, Math.max(2200, lines[k].say.length * 70) / S.rate);
    }
    function playAudio(k, id) {
      var t0 = S.times ? S.times[k] : 0;
      build(k - 1 < 0 ? -1 : k - 1); show(k - 1);
      try { A.currentTime = t0; } catch (e) {}
      A.playbackRate = S.rate; A.play().catch(function () { S.mode = 'tts'; playFrom(k); });
      var nextI = k;
      (function tick() {
        if (id !== S.id) return;
        var t = A.currentTime;
        while (nextI < N && S.times[nextI] <= t + .02) { cue(lines[nextI]); show(nextI); nextI++; }
        prog();
        if (A.ended) return ended();
        S.raf = requestAnimationFrame(tick);
      })();
    }
    function jump(k) { k = Math.max(0, Math.min(N - 1, k)); var was = S.playing; halt(); S.playing = false; build(k - 1); show(k - 1); if (was || true) playFrom(k); }

    /* ---- الصوت (لو فيه ملف) ---- */
    if (T.audio && opts.audioBase) {
      A = new Audio(); A.preload = 'auto'; A.src = opts.audioBase + encodeURIComponent(T.audio);
      A.onloadedmetadata = function () { S.dur = A.duration; S.times = spread(lines, S.dur); prog(); };
      A.onerror = function () { A = null; S.mode = 'tts'; };
    } else S.mode = 'tts';
    if (!root.speechSynthesis && S.mode === 'tts') S.mode = 'timer';

    /* ---- الأزرار ---- */
    el.querySelectorAll('[data-a]').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-a');
        if (a === 'play') { if (S.playing) { halt(); S.playing = false; ui(); } else playFrom(Math.max(0, S.k)); }
        else if (a === 'prev') jump(S.k - 1);
        else if (a === 'next') jump(S.k + 1);
        else if (a === 'redo') jump(0);
        else if (a === 'txt') cap.hidden = !cap.hidden;
        else if (a === 'full') { if (document.fullscreenElement) document.exitFullscreen(); else if (root_.requestFullscreen) root_.requestFullscreen(); }
      };
    });
    $('.pp-start').onclick = function () { cap.hidden = false; playFrom(0); };
    bar.oninput = function () {
      var v = bar.value / 1000;
      if (S.mode === 'audio' && S.times) { var t = v * S.dur, k = 0; for (var i = 0; i < N; i++) if (S.times[i] <= t) k = i; jump(k); }
      else jump(Math.min(N - 1, Math.floor(v * N)));
    };
    $('.pp-rate').onchange = function (e) { S.rate = +e.target.value; if (A) A.playbackRate = S.rate; if (S.playing && S.mode !== 'audio') playFrom(Math.max(0, S.k)); };

    reset(); ui(); cap.hidden = false;
    return {
      pause: function () { if (S.playing) { halt(); S.playing = false; ui(); } },
      destroy: function () { S.gone = true; halt(); if (ro) ro.disconnect(); tw.forEach(clearInterval); el.innerHTML = ''; }
    };
  }
  root.PyPlayer = { mount: mount, spread: spread };
})(window);
