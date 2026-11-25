/* ===== محاكي الجهاز (Windows / macOS / Linux) لخطوة "تطبيق عملي" =====
   بيتفتح من lesson.js. بيانات الخطوة في ملف الدرس: practice = { intro, steps:[...], free:{code} }
   أنواع الخطوات:
     { kind:'open' }  دوس على أيقونة Terminal (أول خطوة تلقائي لو مفيش open)
     { kind:'cmd',  say, expect:'python --version' | [..], out:'..' | {win,mac,linux}, hint }
     { kind:'code', say, file:'hello.py', expect:'print("Hello")' | [..], hint }   (محرر نصوص)
   python / python3 / py بيتعاملوا كأنهم نفس الأمر. */
(function (root) {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
  var fmt = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code dir="ltr">$1</code>'); };
  var PROMPT = { win: 'C:\\Users\\you>', mac: 'you@mac ~ %', linux: 'you@ubuntu:~$' };
  var EDITOR = { win: 'Notepad', mac: 'TextEdit', linux: 'gedit' };
  var TITLE = { win: 'Windows Terminal', mac: 'Terminal — zsh', linux: 'Terminal' };
  var OS_NAMES = [['win', 'fa-windows', 'Windows'], ['mac', 'fa-apple', 'macOS'], ['linux', 'fa-linux', 'Linux']];
  var PYV = '0.26.4';

  /* ---------- مقارنات (بتتجرب بـnode كمان) ---------- */
  function normCmd(s) { var p = String(s).trim().replace(/\s+/g, ' ').split(' '); if (/^(python3?|py)$/i.test(p[0])) p[0] = 'python'; return p.join(' '); }
  function list(x) { return Array.isArray(x) ? x : [x]; }
  function cmdOk(inp, expect) { var n = normCmd(inp); return list(expect).some(function (e) { return normCmd(e) === n; }); }
  function normCode(s) { return String(s).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).filter(Boolean).join('\n').trim().replace(/'/g, '"'); }
  function codeOk(inp, expect) { var n = normCode(inp); return list(expect).some(function (e) { return normCode(e) === n; }); }
  function count(s, ch) { return s.split(ch).length - 1; }
  /* رسالة مفيدة بدل "غلط" بس */
  function explain(inp, expect) {
    var a = normCode(inp).split('\n'), b = normCode(list(expect)[0]).split('\n');
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      var x = a[i] || '', y = b[i] || '';
      if (x === y) continue;
      var msg = 'السطر ' + (i + 1) + ' مش زي المطلوب. ';
      if (!x) return msg + 'لسه ناقص سطر.';
      if (x.toLowerCase() === y.toLowerCase()) return msg + 'حروف كبيرة وصغيرة بتفرق في بايثون، راجع الحروف.';
      if (count(x, '(') !== count(x, ')')) return msg + 'فيه قوس مش مقفول.';
      if (count(x, '"') % 2) return msg + 'علامة التنصيص مش مقفولة.';
      if (x.replace(/\s/g, '') === y.replace(/\s/g, '')) return msg + 'المسافات مختلفة.';
      return msg + 'قارنه بالمطلوب حرف حرف.';
    }
    return 'مش زي المطلوب.';
  }
  function notFound(os, c) {
    var w = String(c).trim().split(' ')[0];
    return os === 'win' ? "'" + w + "' is not recognized as an internal or external command, operable program or batch file."
      : os === 'mac' ? 'zsh: command not found: ' + w : 'bash: ' + w + ': command not found';
  }
  function pick(o, os) { return o && typeof o === 'object' ? (o[os] != null ? o[os] : o.all || '') : (o || ''); }

  /* ---------- Pyodide ---------- */
  function loadPy() {
    if (root.__etoPy) return root.__etoPy;
    root.__etoPy = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/pyodide/v' + PYV + '/full/pyodide.js';
      s.onload = function () { root.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v' + PYV + '/full/' }).then(res, rej); };
      s.onerror = function () { root.__etoPy = null; rej(new Error('net')); };
      document.head.appendChild(s);
    });
    return root.__etoPy;
  }

  /* ---------- المحاكي ---------- */
  function mount(el, P, opts) {
    opts = opts || {};
    var steps = (P.steps || []).slice();
    if (!steps.length || steps[0].kind !== 'open') steps.unshift({ kind: 'open', say: 'ده سطح مكتب الجهاز. دوس على أيقونة **Terminal** عشان تفتح الشاشة اللي بنكتب فيها الأوامر.' });
    var os = opts.os || 'win', i = 0, tries = 0, history = [], files = {}, termOpen = false, edOpen = false;
    var $ = function (q) { return el.querySelector(q); };

    el.innerHTML =
      '<div class="sm">' + (P.intro ? '<div class="ls-note" style="margin-bottom:12px">' + fmt(P.intro) + '</div>' : '') +
      '<div class="lib-os sm-os">' + OS_NAMES.map(function (o) { return '<button data-os="' + o[0] + '"><i class="fa-brands ' + o[1] + '"></i> ' + o[2] + '</button>'; }).join('') + '</div>' +
      '<div class="sm-task"></div><div class="sm-screen"></div><div class="sm-free" style="display:none"></div></div>';

    function osTabs() { el.querySelectorAll('.sm-os button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-os') === os); }); }

    function screen() {
      var s = $('.sm-screen'); s.className = 'sm-screen sm-' + os;
      var bar = os === 'win' ? '' : '<div class="sm-top"><span>' + (os === 'mac' ? '<i class="fa-brands fa-apple"></i> Terminal  File  Edit' : 'Activities') + '</span><span>10:30</span></div>';
      var dock = '<div class="sm-dock"><span class="sm-ico" data-ico="term" title="Terminal"><i class="fa-solid fa-terminal"></i></span><span class="sm-ico dim"><i class="fa-solid fa-folder"></i></span><span class="sm-ico dim"><i class="fa-solid fa-globe"></i></span></div>';
      var ctrl = os === 'win' ? '<span class="sm-ctl"><i class="fa-solid fa-minus"></i><i class="fa-regular fa-square"></i><i class="fa-solid fa-xmark"></i></span>'
        : os === 'mac' ? '<span class="sm-dots"><i></i><i></i><i></i></span>' : '<span class="sm-ctl"><i class="fa-solid fa-xmark"></i></span>';
      var win = function (cls, title, body) { return '<div class="sm-win ' + cls + '" style="display:none"><div class="sm-wh">' + (os === 'mac' ? ctrl + '<b>' + title + '</b><span></span>' : '<b>' + title + '</b>' + ctrl) + '</div>' + body + '</div>'; };
      s.innerHTML = bar + '<div class="sm-desk">' + (os === 'win' ? '' : dock) +
        win('sm-term', TITLE[os], '<div class="sm-tb" dir="ltr"><div class="sm-lines"></div><div class="sm-inl"><span class="sm-p">' + esc(PROMPT[os]) + '</span><input class="sm-in" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="terminal"></div></div>') +
        win('sm-ed', '<span class="sm-fn">file.py</span> — ' + EDITOR[os], '<textarea class="sm-ta" dir="ltr" spellcheck="false" autocapitalize="off"></textarea><div class="sm-ef"><button class="ls-btn sm-save"><i class="fa-solid fa-floppy-disk"></i> حفظ</button><span>' + (os === 'mac' ? '⌘+S' : 'Ctrl+S') + '</span></div>') +
        '</div>' + (os === 'win' ? '<div class="sm-tskbar"><span class="sm-start"><i class="fa-brands fa-windows"></i></span>' + dock.replace('sm-dock', 'sm-dock2') + '<span class="sm-clock">10:30</span></div>' : '');
      $('.sm-term').style.display = termOpen ? '' : 'none';
      $('.sm-ed').style.display = edOpen ? '' : 'none';
      var inp = $('.sm-in'); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(inp.value); inp.value = ''; } });
      $('.sm-term').addEventListener('click', function () { inp.focus(); });
      $('.sm-save').addEventListener('click', save);
      $('.sm-ta').addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); } });
      el.querySelectorAll('[data-ico="term"]').forEach(function (b) { b.addEventListener('click', openTerm); });
      replay(); mark();
    }

    function line(html, cls) { var L = $('.sm-lines'); if (!L) return; var d = document.createElement('div'); d.className = 'sm-l ' + (cls || ''); d.innerHTML = html; L.appendChild(d); var b = $('.sm-tb'); b.scrollTop = b.scrollHeight; }
    function echo(c) { line('<span class="sm-p">' + esc(PROMPT[os]) + '</span> ' + esc(c)); }
    function out(t) { if (t) String(t).split('\n').forEach(function (x) { line(esc(x) || '&nbsp;', 'o'); }); }
    function replay() { history.forEach(function (h) { echo(h.c); out(h.o); }); }

    function mark() {
      var st = steps[i], ic = el.querySelectorAll('[data-ico="term"]');
      ic.forEach(function (b) { b.classList.toggle('pulse', !!st && st.kind === 'open' && !termOpen); });
    }

    function task(msg, cls) {
      var st = steps[i], t = $('.sm-task');
      if (!st) { t.innerHTML = '<div class="ls-result ok"><i class="fa-solid fa-circle-check"></i> ' + fmt(P.done || 'برافو! خلّصت كل الخطوات العملية.') + '</div>'; return; }
      var sol = st.kind === 'cmd' ? list(st.expect)[0] : st.kind === 'code' ? list(st.expect)[0] : '';
      t.innerHTML = '<div class="sm-step"><div class="sm-prog"><i style="width:' + (i / steps.length * 100) + '%"></i></div><small>خطوة ' + (i + 1) + ' من ' + steps.length + '</small>' +
        '<p>' + fmt(st.say || '') + '</p>' +
        (msg ? '<div class="ls-why ' + (cls || 'bad') + '">' + fmt(msg) + '</div>' : '') +
        '<div class="ls-actions">' + (st.hint ? '<button class="ls-btn ghost sm-hint"><i class="fa-regular fa-lightbulb"></i> تلميح</button>' : '') +
        (tries >= 2 && sol ? '<button class="ls-btn ghost sm-show"><i class="fa-solid fa-eye"></i> اعرض الحل</button>' : '') + '</div></div>';
      var h = t.querySelector('.sm-hint'); if (h) h.onclick = function () { task(st.hint, 'ok'); };
      var s = t.querySelector('.sm-show'); if (s) s.onclick = function () {
        if (st.kind === 'cmd') { $('.sm-in').value = sol; $('.sm-in').focus(); } else { $('.sm-ta').value = sol; }
      };
    }

    function next() {
      i++; tries = 0; mark();
      if (i >= steps.length) { task(); if (P.free) free(); if (opts.onDone) opts.onDone(); return; }
      var st = steps[i];
      if (st.kind === 'code') { edOpen = true; $('.sm-ed').style.display = ''; $('.sm-fn').textContent = st.file || 'file.py'; $('.sm-ta').value = ''; $('.sm-ta').focus(); }
      task();
    }

    function openTerm() {
      if (!termOpen) { termOpen = true; $('.sm-term').style.display = ''; }
      $('.sm-in').focus();
      if (steps[i] && steps[i].kind === 'open') next();
    }

    function submit(c) {
      c = c.trim(); if (!c) return;
      var st = steps[i];
      if (/^(cls|clear)$/i.test(c)) { $('.sm-lines').innerHTML = ''; history = []; return; }
      echo(c);
      if (st && st.kind === 'cmd') {
        if (cmdOk(c, st.expect)) { var o = pick(st.out, os); out(o); history.push({ c: c, o: o }); next(); return; }
        tries++; out(notFound(os, c)); history.push({ c: c, o: notFound(os, c) });
        task('الأمر ده مش اللي المطلوب في الخطوة. اقرا التعليمات فوق وجرّب تاني.', 'bad'); return;
      }
      out(notFound(os, c)); history.push({ c: c, o: notFound(os, c) });
    }

    function save() {
      var st = steps[i]; if (!st || st.kind !== 'code') return;
      var v = $('.sm-ta').value;
      if (codeOk(v, st.expect)) { files[st.file] = v; edOpen = false; $('.sm-ed').style.display = 'none'; next(); if (termOpen) $('.sm-in').focus(); return; }
      tries++; task(explain(v, st.expect), 'bad');
    }

    /* ---------- تجربة حرة (بايثون حقيقية) ---------- */
    function free() {
      var f = $('.sm-free'), code = (P.free && P.free.code) || 'print("Hello")';
      f.style.display = '';
      f.innerHTML = '<h3 class="ls-h">جرّب بنفسك</h3><p class="ls-p">' + fmt((P.free && P.free.say) || 'عدّل في الكود واضغط شغّل. ده بايثون حقيقية شغالة في المتصفح، ولا هتبوّظ حاجة.') + '</p>' +
        '<textarea class="sm-ta sm-fta" dir="ltr" spellcheck="false" autocapitalize="off">' + esc(code) + '</textarea>' +
        '<div class="ls-actions"><button class="ls-btn sm-run"><i class="fa-solid fa-play"></i> شغّل</button></div><pre class="sm-out" dir="ltr"></pre>';
      var run = f.querySelector('.sm-run'), outEl = f.querySelector('.sm-out');
      run.onclick = function () {
        outEl.textContent = 'جاري تحميل بايثون (أول مرة بس، حوالي 10 ميجا)...'; run.disabled = true;
        loadPy().then(function (py) {
          var buf = '';
          py.setStdout({ batched: function (s) { buf += s + '\n'; } }); py.setStderr({ batched: function (s) { buf += s + '\n'; } });
          py.setStdin({ stdin: function () { var v = root.prompt('input()'); return v == null ? '' : v; } });
          return py.runPythonAsync(f.querySelector('.sm-fta').value).then(function () { outEl.textContent = buf || '(مفيش ناتج)'; },
            function (e) { var m = String(e.message || e).trim().split('\n'); outEl.textContent = buf + m.slice(-3).join('\n'); });
        }, function () { outEl.textContent = 'مش قادر أحمّل بايثون. اتأكد من النت وجرّب تاني.'; }).then(function () { run.disabled = false; });
      };
    }

    el.querySelectorAll('.sm-os button').forEach(function (b) { b.addEventListener('click', function () { os = b.getAttribute('data-os'); osTabs(); screen(); }); });
    osTabs(); screen(); task();
  }

  root.PySim = { mount: mount, util: { normCmd: normCmd, cmdOk: cmdOk, codeOk: codeOk, explain: explain } };
})(typeof window !== 'undefined' ? window : globalThis);
