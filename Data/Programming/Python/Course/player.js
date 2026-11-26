/* ===== مشغّل الشرح المتحرك (حصة واحدة بفصول زي الفيديو) =====
   PyPlayer.mount(el, T, { cssBase, audioBase, onEnd })
   T = { audio?:'day1.mp3', chapters:[ { title, scenes:[ { l:'col|row|grid2|grid3', d:1(خلفية داكنة), a:0(عدد عناصر ظاهرة من الأول),
        e:['html', ...]  (بتظهر بالترتيب؛ أول حرف * = ياخد الصف كله),
        lines:[ [ 'الجملة', n(كام عنصر يظهروا مع الجملة، الافتراضي 1), 'pop|shake|pulse'(حركة), t(ثانية في تسجيلك) ] ] } ] } ] }
   من غير ملف صوت: بيقرا الجمل بصوت المتصفح. ومعاه ملف صوت: الجمل اللي من غير t بتتوزع حسب طول الكلام. */
(function (root) {
  var linked = false;
  function css(base) { if (linked) return; linked = true; var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'player.css?v=2'; document.head.appendChild(l); }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
  var tm = function (s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); };

  function flat(T) {
    var scenes = [], lines = [], chs = [];
    T.chapters.forEach(function (c, ci) {
      chs.push({ title: c.title, first: lines.length });
      c.scenes.forEach(function (s) {
        var si = scenes.length; scenes.push(s);
        s.lines.forEach(function (l, li) { lines.push({ say: l[0], n: l[1] == null ? 1 : l[1], fx: l[2], t: l[3], sc: li === 0 ? si : -1, ch: ci }); });
      });
    });
    return { scenes: scenes, lines: lines, chs: chs };
  }
  function spread(lines, dur) {
    var n = lines.length, T = [], i, j, w = lines.map(function (l) { return Math.max(8, l.say.length); });
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
  function arVoice() {
    if (!root.speechSynthesis) return null;
    var vs = speechSynthesis.getVoices() || [];
    return vs.filter(function (v) { return /^ar[-_]EG/i.test(v.lang); })[0] || vs.filter(function (v) { return /^ar/i.test(v.lang); })[0] || null;
  }

  function mount(el, T, opts) {
    opts = opts || {}; css(opts.cssBase || '');
    var F = flat(T), lines = F.lines, scenes = F.scenes, chs = F.chs, N = lines.length;
    var S = { k: -1, playing: false, mode: T.audio && opts.audioBase ? 'audio' : (root.speechSynthesis ? 'tts' : 'timer'), rate: 1, times: null, dur: 0, id: 0, raf: 0, timer: 0, rv: 0, cur: 0 };
    var A = null, tw = [];

    var stageHtml = scenes.map(function (s, i) {
      return '<div class="pp-sc L-' + (s.l || 'col') + '" id="sc' + i + '">' + s.e.map(function (e, j) {
        var sp = e.charAt(0) === '*'; if (sp) e = e.slice(1);
        return '<div class="el' + (sp ? ' span' : '') + (j < (s.a || 0) ? '' : ' hid') + '" data-r>' + e + '</div>';
      }).join('') + '</div>';
    }).join('');
    var I = function (n) { return '<i class="fa-solid fa-' + n + '"></i>'; };

    el.innerHTML =
      '<div class="pp" dir="rtl"><div class="pp-main"><div class="pp-stage"><div class="pp-scene"><div class="pp-fit">' + stageHtml + '</div></div>' +
      '<div class="pp-cap" hidden></div><button class="pp-start" aria-label="ابدأ"><span class="pp-sbtn">' + I('play') + '</span><b>ابدأ الحصة</b></button></div>' +
      '<div class="pp-ctl" dir="ltr"><button class="pp-b big" data-a="play" aria-label="تشغيل">' + I('play') + '</button>' +
      '<button class="pp-b" data-a="prev" aria-label="السابق">' + I('backward-step') + '</button><button class="pp-b" data-a="next" aria-label="التالي">' + I('forward-step') + '</button>' +
      '<input class="pp-bar" type="range" min="0" max="1000" value="0" aria-label="التقدم"><span class="pp-cnt">0 / ' + N + '</span>' +
      '<select class="pp-rate" aria-label="السرعة"><option value="0.8">0.8x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option></select>' +
      '<button class="pp-b" data-a="txt" aria-label="الترجمة">' + I('closed-captioning') + '</button><button class="pp-b" data-a="full" aria-label="ملء الشاشة">' + I('expand') + '</button></div></div>' +
      '<div class="pp-chs"><div class="pp-chh">فصول الحصة</div>' + chs.map(function (c, i) {
        return '<button class="pp-ch" data-c="' + i + '"><span class="pp-cn">' + (i + 1) + '</span><span class="pp-ct">' + esc(c.title) + '</span><span class="pp-cm"></span></button>';
      }).join('') + '</div></div>';

    var $ = function (q) { return el.querySelector(q); };
    var main = $('.pp-main'), stage = $('.pp-stage'), fitEl = $('.pp-fit'), cap = $('.pp-cap'), bar = $('.pp-bar'), cnt = $('.pp-cnt');
    var sceneEl = function (i) { return fitEl.querySelector('#sc' + i); };

    function fit() {
      var sc = fitEl.parentNode; if (!fitEl.offsetWidth || !fitEl.offsetHeight) return;
      fitEl.style.transform = 'scale(' + Math.min(1.5, sc.clientWidth * .92 / fitEl.offsetWidth, sc.clientHeight * .86 / fitEl.offsetHeight) + ')';
    }
    var ro = root.ResizeObserver ? new ResizeObserver(fit) : null; if (ro) ro.observe(stage);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    function typeInto(e, txt, instant) {
      if (instant) { e.textContent = txt; return; }
      e.textContent = ''; var i = 0, id = setInterval(function () { e.textContent = txt.slice(0, ++i); if (i >= txt.length) clearInterval(id); }, 55); tw.push(id);
    }
    function cue(l, instant) {
      if (l.sc >= 0) {
        S.cur = l.sc; S.rv = scenes[l.sc].a || 0;
        fitEl.querySelectorAll('.pp-sc').forEach(function (s) { s.classList.toggle('on', s.id === 'sc' + l.sc); });
        stage.classList.toggle('dk', !!scenes[l.sc].d); fit();
      }
      var els = sceneEl(S.cur) ? sceneEl(S.cur).querySelectorAll('[data-r]') : [], last = null;
      for (var i = 0; i < l.n && S.rv < els.length; i++) {
        last = els[S.rv++]; last.classList.remove('hid');
        var t = last.querySelector('[data-type]'); if (t) typeInto(t, t.getAttribute('data-type'), instant);
      }
      if (last && l.fx && !instant) { var c = 'fx-' + l.fx; last.classList.remove(c); void last.offsetWidth; last.classList.add(c); }
    }
    function reset() { tw.forEach(clearInterval); tw = []; fitEl.innerHTML = stageHtml; S.rv = 0; S.cur = 0; stage.classList.remove('dk'); }
    function build(k) { reset(); for (var i = 0; i <= k; i++) cue(lines[i], true); if (k < 0) { var f = sceneEl(0); if (f) f.classList.add('on'); fit(); } }

    function show(k) {
      S.k = k; cap.textContent = k >= 0 ? lines[k].say : '';
      var ch = k >= 0 ? lines[k].ch : 0;
      el.querySelectorAll('.pp-ch').forEach(function (b, i) { b.classList.toggle('on', i === ch); b.classList.toggle('done', i < ch); });
      prog();
    }
    function prog() {
      if (S.mode === 'audio' && A && S.dur) { bar.value = Math.min(1000, A.currentTime / S.dur * 1000); cnt.textContent = tm(A.currentTime) + ' / ' + tm(S.dur); }
      else { bar.value = N ? Math.max(0, S.k + 1) / N * 1000 : 0; cnt.textContent = Math.max(0, S.k + 1) + ' / ' + N; }
    }
    function ui() {
      $('[data-a="play"] i').className = 'fa-solid fa-' + (S.playing ? 'pause' : 'play');
      $('.pp-start').style.display = S.k < 0 && !S.playing ? '' : 'none';
    }
    function halt() { S.id++; clearTimeout(S.timer); cancelAnimationFrame(S.raf); if (A) A.pause(); if (root.speechSynthesis) speechSynthesis.cancel(); }
    function ended() { halt(); S.playing = false; ui(); if (opts.onEnd) opts.onEnd(); }

    function playFrom(k) {
      halt(); if (k >= N) return ended();
      var id = S.id; S.playing = true; ui();
      if (S.mode === 'audio') return playAudio(k, id);
      if (S.mode === 'tts') return playTts(k, id);
      playTimer(k, id);
    }
    function playTts(k, id) {
      if (id !== S.id) return; if (k >= N) return ended();
      cue(lines[k]); show(k);
      var u = new SpeechSynthesisUtterance(lines[k].say), v = arVoice(), done = false;
      u.lang = v ? v.lang : 'ar-EG'; if (v) u.voice = v; u.rate = S.rate;
      var nxt = function () { if (done || id !== S.id) return; done = true; playTts(k + 1, id); };
      u.onend = nxt; u.onerror = nxt;
      S.timer = setTimeout(function () { if (!speechSynthesis.speaking && !done) nxt(); }, 1500);
      speechSynthesis.speak(u);
    }
    function playTimer(k, id) {
      if (id !== S.id) return; if (k >= N) return ended();
      cue(lines[k]); show(k);
      S.timer = setTimeout(function () { playTimer(k + 1, id); }, Math.max(2200, lines[k].say.length * 70) / S.rate);
    }
    function playAudio(k, id) {
      build(k - 1); show(k - 1);
      try { A.currentTime = S.times ? S.times[k] : 0; } catch (e) {}
      A.playbackRate = S.rate; A.play().catch(function () { S.mode = 'tts'; playFrom(k); });
      var i = k;
      (function tick() {
        if (id !== S.id) return;
        while (S.times && i < N && S.times[i] <= A.currentTime + .02) { cue(lines[i], false); show(i); i++; }
        prog(); if (A.ended) return ended();
        S.raf = requestAnimationFrame(tick);
      })();
    }
    function jump(k) { k = Math.max(0, Math.min(N - 1, k)); halt(); S.playing = false; build(k - 1); show(k - 1); playFrom(k); }

    if (S.mode === 'audio') {
      A = new Audio(); A.preload = 'auto'; A.src = opts.audioBase + encodeURIComponent(T.audio);
      A.onloadedmetadata = function () {
        S.dur = A.duration; S.times = spread(lines, S.dur);
        el.querySelectorAll('.pp-cm').forEach(function (m, i) { m.textContent = tm(S.times[chs[i].first]); });
        prog();
      };
      A.onerror = function () { A = null; S.mode = root.speechSynthesis ? 'tts' : 'timer'; };
    }

    el.querySelectorAll('[data-a]').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-a');
        if (a === 'play') { if (S.playing) { halt(); S.playing = false; ui(); } else playFrom(Math.max(0, S.k)); }
        else if (a === 'prev') jump(S.k - 1);
        else if (a === 'next') jump(S.k + 1);
        else if (a === 'txt') cap.hidden = !cap.hidden;
        else if (a === 'full') { if (document.fullscreenElement) document.exitFullscreen(); else if (main.requestFullscreen) main.requestFullscreen(); }
      };
    });
    el.querySelectorAll('.pp-ch').forEach(function (b) { b.onclick = function () { jump(chs[+b.getAttribute('data-c')].first); }; });
    $('.pp-start').onclick = function () { playFrom(0); };
    bar.oninput = function () {
      var v = bar.value / 1000;
      if (S.mode === 'audio' && S.times) { var t = v * S.dur, k = 0; for (var i = 0; i < N; i++) if (S.times[i] <= t) k = i; jump(k); }
      else jump(Math.min(N - 1, Math.floor(v * N)));
    };
    $('.pp-rate').onchange = function (e) { S.rate = +e.target.value; if (A) A.playbackRate = S.rate; if (S.playing && S.mode !== 'audio') playFrom(Math.max(0, S.k)); };

    build(-1); show(-1); ui();
    return {
      pause: function () { if (S.playing) { halt(); S.playing = false; ui(); } },
      destroy: function () { halt(); if (ro) ro.disconnect(); tw.forEach(clearInterval); el.innerHTML = ''; }
    };
  }
  root.PyPlayer = { mount: mount, spread: spread };
})(window);
