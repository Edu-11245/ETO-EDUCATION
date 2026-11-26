/* ===== محاكي الجهاز Eto.Edu PC (Windows 11 / macOS / Ubuntu) لخطوة "تطبيق عملي" =====
   PySim.mount(el, practice, { os, onDone })   practice = { intro, steps:[...], free:{code,say}, done }
   خطوات: { kind:'open' } | { kind:'cmd', say, expect, out:'..'|{win,mac,linux}, hint } | { kind:'code', say, file, expect, hint }
   الرحلة: Open Computer ← فولسكرين ← اختيار النظام ← تحميل ← صوت فتح ← سطح مكتب (This PC / Recycle Bin / About Dev / Terminal)
   v4: تحميل مسبق حقيقي في الكاش وقت البوت | Light/Dark من الإعدادات | خلفيات صور ثابتة (wallpapers/) | تطبيق Eto Search
   تخصيص: window.ETO_SIM.google = { key, cx } (اختياري، عشان نتايج جوجل تظهر جوه Eto Search) | window.ETO_ME = { photo:'..', ... }  |  window.ETO_SIM = { sounds:{ win:'url', mac:'url', linux:'url' } } */
(function (root) {
  var BASE = (function () { var s = document.currentScript; return s && s.src ? s.src.replace(/[^\/]*$/, '') : ''; })();
  if (!document.getElementById('sx-css')) { var lk = document.createElement('link'); lk.id = 'sx-css'; lk.rel = 'stylesheet'; lk.href = BASE + 'sim.css?v=7'; document.head.appendChild(lk); }
  var W = 1000, H = 625, PYV = '0.26.4';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
  var fmt = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code dir="ltr">$1</code>'); };
  var OS_NAMES = [['win', 'b:windows', 'Windows 11', 'Microsoft'], ['mac', 'b:apple', 'macOS', 'Apple · Sonoma'], ['linux', 'b:linux', 'Ubuntu', 'Linux · 24.04 LTS']];
  var ic = function (n) { return n.indexOf('b:') === 0 ? '<i class="fa-brands fa-' + n.slice(2) + '"></i>' : '<i class="fa-solid fa-' + n + '"></i>'; };
  var AR = { KeyQ: 'ض', KeyW: 'ص', KeyE: 'ث', KeyR: 'ق', KeyT: 'ف', KeyY: 'غ', KeyU: 'ع', KeyI: 'ه', KeyO: 'خ', KeyP: 'ح', BracketLeft: 'ج', BracketRight: 'د', KeyA: 'ش', KeyS: 'س', KeyD: 'ي', KeyF: 'ب', KeyG: 'ل', KeyH: 'ا', KeyJ: 'ت', KeyK: 'ن', KeyL: 'م', Semicolon: 'ك', Quote: 'ط', KeyZ: 'ئ', KeyX: 'ء', KeyC: 'ؤ', KeyV: 'ر', KeyB: 'لا', KeyN: 'ى', KeyM: 'ة', Comma: 'و', Period: 'ز', Slash: 'ظ' };
  var WINLOGO = '<svg viewBox="0 0 16 16" width="20" height="20"><path fill="#4cc2ff" d="M0 2.3l6.5-.9v6.3H0zM7.3 1.3L16 0v7.7H7.3zM0 8.4h6.5v6.3L0 13.8zM7.3 8.4H16V16l-8.7-1.2z"/></svg>';
  var ARROW = '<svg viewBox="0 0 20 28" width="22" height="30"><path d="M2 1.5v21l5.2-4.6 3.4 8 3.2-1.4-3.4-7.8 7.2-.4z" fill="#fff" stroke="#0f172a" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  var IBEAM = '<svg viewBox="0 0 12 28" width="12" height="26"><path d="M2 2h8M2 26h8M6 2v24" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M2 2h8M2 26h8M6 2v24" stroke="#0f172a" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var HAND = '<svg viewBox="0 0 24 28" width="24" height="28"><path d="M8 2.5c1.2 0 2 .9 2 2V12h.4V9.8c0-1.1.8-1.9 1.8-1.9s1.8.8 1.8 1.9V11h.4v-.4c0-1 .8-1.8 1.7-1.8 1 0 1.8.8 1.8 1.8V12h.3c.8 0 1.6.8 1.6 1.7V19c0 4-2.6 7-6.6 7h-1.6c-2.4 0-3.8-1-5-2.6L3.4 17.6c-.6-.9-.3-2 .6-2.5.8-.4 1.7-.2 2.3.5L6 16.3V4.5c0-1.1.9-2 2-2z" fill="#fff" stroke="#0f172a" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="etoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset=".55" stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs></svg>';
  var logo = function (s) { return '<svg class="sx-logo" viewBox="0 0 64 64" width="' + s + '" height="' + s + '"><rect x=".5" y=".5" width="63" height="63" rx="17" fill="url(#etoG)" stroke="#fff" stroke-opacity=".28"/><rect x="16" y="14" width="9" height="36" rx="4.5" fill="#fff"/><rect x="16" y="14" width="30" height="9" rx="4.5" fill="#fff"/><rect x="16" y="27.5" width="23" height="9" rx="4.5" fill="#fff" opacity=".92"/><rect x="16" y="41" width="30" height="9" rx="4.5" fill="#fff"/><circle cx="50" cy="15" r="5" fill="#fde047"/><circle cx="50" cy="15" r="8" fill="#fde047" opacity=".25"/></svg>'; };
  var wmark = function (cls) { return '<div class="sx-bn ' + (cls || '') + '">Eto<span>.Edu</span></div>'; };

  var ME = { name: 'محمد سعد عثمان ابراهيم', nick: 'ايتو · Eto', role: 'مبرمج', study: 'طالب بكلية العلوم، جامعة القاهرة الأهلية', photo: BASE + 'me.png', skills: ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'HTML'] };
  if (root.ETO_ME) for (var mk in root.ETO_ME) ME[mk] = root.ETO_ME[mk];
  var LINKS = [
    ['Discord', 'b:discord', '#5865F2', 'https://discord.com/users/1175292134094536725'], ['YouTube', 'b:youtube', '#ff3b3b', 'https://www.youtube.com/@Eto-Edu'],
    ['Instagram', 'b:instagram', '#E1306C', 'https://www.instagram.com/msaadm.07'], ['WhatsApp', 'b:whatsapp', '#25D366', 'https://wa.me/201096925903'],
    ['TikTok', 'b:tiktok', 'var(--lkw)', 'https://www.tiktok.com/@eng.mohammedsaad1'], ['Facebook', 'b:facebook', '#4c8dff', 'https://www.facebook.com/share/1T3XmCBPvR/'],
    ['GitHub', 'b:github', 'var(--lkw)', 'https://github.com/MohammedEto'], ['Steam', 'b:steam', '#66c0f4', 'https://steamcommunity.com/id/Mohammed_Eto/'],
    ['itch.io', 'b:itch-io', '#FA5C5C', 'https://mohammed-eto.itch.io/']];
  var PIC_API = 'https://api.github.com/repos/Edu-11245/ETO-ASSETS/contents/img?ref=main';
  var PICS = null;
  var PIC_EXT = /\.(?:avif|gif|jpe?g|png|webp)$/i;
  var NAMES = { win: { pc: 'This PC', bin: 'Recycle Bin', set: 'Settings' }, mac: { pc: 'Macintosh HD', bin: 'Trash', set: 'System Settings' }, linux: { pc: 'Home', bin: 'Trash', set: 'Settings' } };
  var CLICKABLE = 'button,a,[data-app],[data-lang],[data-sm],[data-act],[data-wp],[data-up],.sx-ico,.sx-di,.sx-lk,.sx-cm li,.sx-oc,.sx-wh i,.sx-dots i,.sx-f,.sx-drv';
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; };
  function normCmd(s) { var p = String(s).trim().replace(/\s+/g, ' ').split(' '); if (/^(python3?|py)$/i.test(p[0])) p[0] = 'python'; return p.join(' '); }
  function list(x) { return Array.isArray(x) ? x : [x]; }
  function cmdOk(inp, expect) { var n = normCmd(inp); return list(expect).some(function (e) { return normCmd(e) === n; }); }
  function normCode(s) { return String(s).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).filter(Boolean).join('\n').trim().replace(/'/g, '"'); }
  function codeOk(inp, expect) { var n = normCode(inp); return list(expect).some(function (e) { return normCode(e) === n; }); }
  function count(s, ch) { return s.split(ch).length - 1; }
  function explain(inp, expect) {
    var a = normCode(inp).split('\n'), b = normCode(list(expect)[0]).split('\n');
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      var x = a[i] || '', y = b[i] || ''; if (x === y) continue;
      var m = 'السطر ' + (i + 1) + ' مش زي المطلوب. ';
      if (!x) return m + 'لسه ناقص سطر.';
      if (/[\u0600-\u06FF]/.test(x) && !/[\u0600-\u06FF]/.test(y)) return m + 'فيه حروف عربي! اللغة اتغيّرت. دوس Alt+Shift أو اضغط على ENG/ع في الشريط.';
      if (x.toLowerCase() === y.toLowerCase()) return m + 'حروف كبيرة وصغيرة بتفرق في بايثون، راجع الحروف.';
      if (count(x, '(') !== count(x, ')')) return m + 'فيه قوس مش مقفول.';
      if (count(x, '"') % 2) return m + 'علامة التنصيص مش مقفولة.';
      if (x.replace(/\s/g, '') === y.replace(/\s/g, '')) return m + 'المسافات مختلفة.';
      return m + 'قارنه بالمطلوب حرف حرف.';
    }
    return 'مش زي المطلوب.';
  }
  function pick(o, os) { return o && typeof o === 'object' ? (o[os] != null ? o[os] : o.all || '') : (o || ''); }
  function runPy(code) {
    var out = [];
    String(code).split('\n').forEach(function (l) { var m = /^\s*print\(\s*(["'])(.*)\1\s*\)\s*$/.exec(l); if (m) out.push(m[2]); });
    return out.join('\n');
  }
  function loadPy() {
    if (root.__etoPy) return root.__etoPy;
    root.__etoPy = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v' + PYV + '/full/pyodide.js';
      s.onload = function () { root.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v' + PYV + '/full/' }).then(res, rej); };
      s.onerror = function () { root.__etoPy = null; rej(new Error('net')); };
      document.head.appendChild(s);
    });
    return root.__etoPy;
  }
  function warm() {
    if (root.__etoWarm) return root.__etoWarm;
    var o = {
      progress: function () { return 1; },
      labelAt: function () { return 'Starting'; },
      done: Promise.resolve()
    };
    root.__etoWarm = o;
    return o;
  }
  var ES_SRC = [['all', 'Everything', 'globe'], ['wiki', 'Wikipedia', 'b:wikipedia-w'], ['so', 'Stack Overflow', 'b:stack-overflow'], ['gh', 'GitHub', 'b:github'], ['mdn', 'MDN', 'book'], ['g', 'Google', 'b:google']];
  var ES_EXT = [['g', 'b:google', 'https://www.google.com/', 'Google'], ['bing', 'globe', 'https://www.bing.com/', 'Bing'], ['ddg', 'globe', 'https://duckduckgo.com/', 'DuckDuckGo'], ['yt', 'b:youtube', 'https://www.youtube.com/', 'YouTube']];
  var ES_Q = { g: 'https://www.google.com/search?q=', bing: 'https://www.bing.com/search?q=', ddg: 'https://duckduckgo.com/?q=', yt: 'https://www.youtube.com/results?search_query=' };
  var APPK = { term: 'terminal cmd powershell shell command python', set: 'settings theme dark light mode wallpaper background personalization', about: 'about developer contact social links eto mohammed', pc: 'computer files drive folder documents disk', bin: 'recycle trash bin delete' };
  var dec = function (s) { var t = document.createElement('textarea'); t.innerHTML = String(s == null ? '' : s); return t.value; };
  function jget(url, ms) {
    return new Promise(function (res, rej) {
      var ctl = root.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (ctl) ctl.abort(); rej(new Error('timeout')); }, ms || 9000);
      fetch(url, ctl ? { signal: ctl.signal } : undefined).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
        .then(function (j) { clearTimeout(tm); res(j); }, function (e) { clearTimeout(tm); rej(e); });
    });
  }
  var SRCF = {
    wiki: function (q, n) {
      var l = /[\u0600-\u06FF]/.test(q) ? 'ar' : 'en';
      return jget('https://' + l + '.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrlimit=' + n + '&gsrsearch=' + encodeURIComponent(q) + '&prop=extracts%7Cpageimages&exintro=1&explaintext=1&exsentences=3&exlimit=max&piprop=thumbnail&pithumbsize=96').then(function (j) {
        var p = (j.query && j.query.pages) || {};
        return Object.keys(p).map(function (k) { return p[k]; }).sort(function (a, b) { return a.index - b.index; }).map(function (x) {
          return { t: x.title, u: 'https://' + l + '.wikipedia.org/?curid=' + x.pageid, s: x.extract || '', img: x.thumbnail && x.thumbnail.source, m: 'Wikipedia (' + l + ')' };
        });
      });
    },
    so: function (q, n) {
      return jget('https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&site=stackoverflow&pagesize=' + n + '&q=' + encodeURIComponent(q)).then(function (j) {
        return (j.items || []).map(function (x) { return { t: dec(x.title), u: x.link, s: (x.tags || []).slice(0, 5).join(', '), m: x.score + ' votes, ' + x.answer_count + ' answers' + (x.is_answered ? ', answered' : '') }; });
      });
    },
    gh: function (q, n) {
      return jget('https://api.github.com/search/repositories?per_page=' + n + '&q=' + encodeURIComponent(q)).then(function (j) {
        return (j.items || []).map(function (x) { return { t: x.full_name, u: x.html_url, s: x.description || '', m: (x.language ? x.language + ', ' : '') + x.stargazers_count + ' stars' }; });
      });
    },
    mdn: function (q, n) {
      return jget('https://developer.mozilla.org/api/v1/search?locale=en-US&size=' + n + '&q=' + encodeURIComponent(q)).then(function (j) {
        return (j.documents || []).map(function (x) { return { t: x.title, u: 'https://developer.mozilla.org' + x.mdn_url, s: x.summary || '', m: 'MDN Web Docs' }; });
      });
    },
    /* جوجل مش بيسمح بعرض نتايجه جوه صفحة تانية. لو حطيت مفتاح Programmable Search في window.ETO_SIM.google = { key, cx } النتايج هتظهر هنا */
    g: function (q, n) {
      var g = root.ETO_SIM && root.ETO_SIM.google; if (!g || !g.key || !g.cx) return Promise.resolve(null);
      return jget('https://www.googleapis.com/customsearch/v1?key=' + encodeURIComponent(g.key) + '&cx=' + encodeURIComponent(g.cx) + '&num=' + Math.min(10, n) + '&q=' + encodeURIComponent(q)).then(function (j) {
        return (j.items || []).map(function (x) { return { t: x.title, u: x.link, s: x.snippet || '', m: x.displayLink || '' }; });
      });
    }
  };

  /* ---------- صوت الفتح (مُولَّد بالكود: مفيش ملفات) ---------- */
  var AC = null;
  function audio() {
    if (!AC) { var C = root.AudioContext || root.webkitAudioContext; if (C) { try { AC = new C(); } catch (e) {} } }
    if (AC && AC.state === 'suspended') AC.resume();
    return AC;
  }
  function tone(f, t0, dur, type, g, lp) {
    var a = AC, o = a.createOscillator(), n = a.createGain(), fl = a.createBiquadFilter(), at = type === 'sine' ? .35 : .02;
    o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = lp || 3000;
    n.gain.setValueAtTime(0.0001, t0); n.gain.linearRampToValueAtTime(g, t0 + at); n.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(fl); fl.connect(n); n.connect(a.destination); o.start(t0); o.stop(t0 + dur + .05);
  }
  function chime(os, vol) {
    if (!vol) return; var v = vol / 100, cs = root.ETO_SIM && root.ETO_SIM.sounds && root.ETO_SIM.sounds[os];
    if (cs) { try { var au = new Audio(cs); au.volume = v; au.play(); return; } catch (e) {} }
    var a = audio(); if (!a) return; var t = a.currentTime + .05;
    if (os === 'win') [277.2, 415.3, 554.4, 698.5, 830.6, 1108.7].forEach(function (f, j) { tone(f, t + j * .16, 3.4, 'sine', .09 * v, 2600); tone(f * 2, t + j * .16 + .05, 2.2, 'triangle', .02 * v, 3000); });
    else if (os === 'mac') [92.5, 185, 277.2, 370, 466.2, 554.4].forEach(function (f) { tone(f, t, 2.8, 'triangle', .12 * v, 1500); });
    else [392, 523.3, 659.3, 784, 1046.5, 784, 659.3].forEach(function (f, j) { tone(f, t + j * .13, .9, 'sine', .12 * v, 3500); });
  }

  /* ---------- المحاكي ---------- */
  function mount(el, P, opts) {
    opts = opts || {};
    var steps = (P.steps || []).slice();
    var pureFree = !(P.steps || []).length; /* من غير خطوات = استخدام حر */
    if (pureFree) steps = []; else if (steps[0].kind !== 'open') steps.unshift({ kind: 'open', say: 'ده سطح مكتب الجهاز. دوس على أيقونة **Terminal** عشان تفتحها.' });
    var os = opts.os || 'win', lang = 'en', i = 0, tries = 0, tr = [], cmdH = [], hp = 0, files = {}, wopen = {}, dirty = false, phase = 'off', sel = '';
    var W = 1000, H = 625; /* مقاس الشاشة الوهمية: ثابت في الدرس، وفي وضع الصفحة بيتحسب على مقاس شاشة المستخدم */
    var freeMode = pureFree, edName = '', metaDown = false, metaUsed = false;
    var busy = false, pending = null, headDone = false, wifi = true, vol = 60, k = 1, z = 10, timers = [], gt = 0, lastClk = '';
    var theme = ls('eto_sim_theme') || (el.closest && el.closest('.dark') ? 'dark' : 'light'), wpCustom = ls('eto_sim_wpc'), coarse = !!(root.matchMedia && root.matchMedia('(pointer:coarse)').matches);
    var activePicUrl = '', currentPicIndex = 0, picLoadId = 0, loadingPicIndex = -1;
    var $ = function (q) { return el.querySelector(q); };
    var tmo = function (f, ms) { var t = setTimeout(f, ms); timers.push(t); return t; };
    var clearT = function () { timers.forEach(clearTimeout); timers = []; };
    var dead = false, alive = function () { return !dead && document.body.contains(el); };
    var off = [], on = function (t, ev, fn, o) { t.addEventListener(ev, fn, o); off.push(function () { t.removeEventListener(ev, fn, o); }); };

    el.innerHTML = '<div class="sx">' + DEFS + (P.intro ? '<div class="ls-note" style="margin-bottom:10px">' + fmt(P.intro) + '</div>' : '') +
      '<div class="sx-head"><div class="sx-brand">' + logo(24) + '<b>Eto<span>.Edu</span></b><small>Virtual PC</small></div><div class="sx-hb">' +
      '<button class="sx-pw" style="display:none" title="إيقاف الجهاز"><i class="fa-solid fa-power-off"></i><span>إيقاف</span></button>' +
      '<button class="sx-fs" title="ملء الشاشة"><i class="fa-solid fa-expand"></i><span>ملء الشاشة</span></button></div></div>' +
      '<div class="sx-task"></div><div class="sx-vp"><div class="sx-screen"><div class="sx-ui"></div></div></div></div>';
    var root_ = $('.sx'), vp = $('.sx-vp'), sc = $('.sx-screen'), ui = $('.sx-ui');
    if (opts.page) root_.classList.add('sx-page'); /* وضع الصفحة: بيملا الصفحة من غير ملء شاشة إجباري */

    /* ---- الحجم وملء الشاشة ---- */
    function fit() {
      var w = vp.clientWidth, h = vp.clientHeight; if (!w || !h) return;
      if (opts.page) {
        /* بنختار تكبير يناسب الشاشة، وبعدها نخلّي الجهاز الوهمي نفسه ياخد العرض والطول كاملين (من غير شريط أسود) */
        k = Math.max(.6, Math.min(w / 1000, h / 625)); W = Math.round(w / k); H = Math.round(h / k); srect = null;
        sc.style.width = W + 'px'; sc.style.height = H + 'px';
        sc.style.setProperty('--sw', W + 'px'); sc.style.setProperty('--sh', H + 'px');
        sc.style.transform = 'scale(' + k + ')';
        return;
      }
      k = Math.min(w / W, h / H); srect = null;
      sc.style.transform = 'translate(' + ((w - W * k) / 2) + 'px,' + ((h - H * k) / 2) + 'px) scale(' + k + ')';
    }
    var ro = root.ResizeObserver ? new ResizeObserver(fit) : null; if (ro) ro.observe(vp);
    function kbLock(v) { try { var kb = navigator.keyboard; if (!kb) return; if (v && kb.lock) kb.lock(['MetaLeft', 'MetaRight']); else if (kb.unlock) kb.unlock(); } catch (e) {} }
    function isFs() { return document.fullscreenElement === root_ || document.webkitFullscreenElement === root_ || root_.classList.contains('fake-fs'); }
    function fsEnter() {
      if (isFs()) return; var f = root_.requestFullscreen || root_.webkitRequestFullscreen;
      if (f) { try { var p = f.call(root_); if (p && p.catch) p.catch(function () { root_.classList.add('fake-fs'); setTimeout(fit, 80); }); } catch (e) { root_.classList.add('fake-fs'); } } else root_.classList.add('fake-fs');
      setTimeout(fit, 150);
    }
    function fsToggle() {
      if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else if (root_.classList.contains('fake-fs')) root_.classList.remove('fake-fs'); else fsEnter();
      setTimeout(fit, 100);
    }
    on(document, 'fullscreenchange', function () { if (!alive()) return; var f = document.fullscreenElement === root_; root_.classList.toggle('is-fs', f); kbLock(f); setTimeout(fit, 80); });
    on(document, 'keydown', function (e) { if (alive() && e.key === 'Escape' && root_.classList.contains('fake-fs')) { root_.classList.remove('fake-fs'); setTimeout(fit, 80); } });
    $('.sx-fs').onclick = fsToggle;
    $('.sx-pw').onclick = function () { shutdown(); };

    /* ---- الوقت ---- */
    function clockParts() {
      var d = new Date(), a = false, loc = 'en-US';
      if (os === 'win') return [d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit' }), d.toLocaleDateString(loc)];
      if (os === 'mac') return [d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + '\u2002' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })];
      return [d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '\u2002' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })];
    }
    function updClock() {
      var p = clockParts(), key = p.join('|'); if (key === lastClk) return; lastClk = key;
      el.querySelectorAll('[data-clk]').forEach(function (b) { b.innerHTML = p.length > 1 ? '<span>' + p[0] + '</span><span>' + p[1] + '</span>' : p[0]; });
    }
    var tick = setInterval(function () { if (!alive()) { clearInterval(tick); off.forEach(function (f) { f(); }); return; } if (phase === 'on') updClock(); }, 4000);

    /* ---- مرحلة 0: Open Computer ---- */
    function renderOff() {
      phase = 'off'; clearT(); sc.className = 'sx-screen sx-x';
      ui.innerHTML = '<div class="sx-off"><div class="sx-fl">' + logo(104) + '</div>' + wmark('big') + '<p>Virtual PC · جهاز تجريبي جوه المتصفح</p>' +
        '<button class="sx-open"><i class="fa-solid fa-power-off"></i> Open Computer</button><small>هيفتح بملء الشاشة</small></div>';
      $('.sx-open').onclick = powerOn; $('.sx-pw').style.display = 'none'; task();
    }
    function powerOn() { audio(); fsEnter(); warm(); renderPick(); }
    /* ---- مرحلة 1: اختيار النظام ---- */
    function renderPick() {
      phase = 'pick'; sc.className = 'sx-screen sx-x';
      ui.innerHTML = '<div class="sx-pick">' + logo(54) + '<h2>اختار نظام التشغيل</h2><p>Choose your operating system</p><div class="sx-cards">' +
        OS_NAMES.map(function (o) { return '<button class="sx-oc sx-o-' + o[0] + (o[0] === os ? ' on' : '') + '" data-os="' + o[0] + '"><span class="sx-oi">' + ic(o[1]) + '</span><b>' + o[2] + '</b><small>' + o[3] + '</small></button>'; }).join('') + '</div></div>';
      el.querySelectorAll('.sx-oc').forEach(function (b) { b.onclick = function () { os = b.getAttribute('data-os'); ls('eto_py_os', os); boot(); }; });
      task();
    }
    /* ---- مرحلة 2: تحميل النظام بستايل الموقع ---- */
    function bootUi(p, l) { var b = $('.sx-ldb i'), t = $('.sx-ld'); if (b) b.style.transform = 'scaleX(' + Math.max(.03, p) + ')'; if (t) t.textContent = l + '  ' + Math.round(p * 100) + '%'; }
    var bootId = 0;
    function boot() {
      phase = 'boot'; sc.className = 'sx-screen sx-' + os; task();
      var spin = os === 'win' ? '<div class="sx-spin"><i></i><i></i><i></i><i></i><i></i></div>' : os === 'mac' ? '' : '<div class="sx-d5"><i></i><i></i><i></i><i></i><i></i></div>';
      ui.innerHTML = '<div class="sx-boot b-' + os + '">' + logo(os === 'win' ? 112 : 92) + wmark() + spin + '<div class="sx-ldb"><i></i></div><em class="sx-ld">Preparing</em><small>' + (os === 'win' ? 'Starting Windows' : os === 'mac' ? 'Starting up' : 'Ubuntu 24.04 LTS') + '</small></div>';
      var id = ++bootId, t0 = Date.now(), W = warm(), min = ls('eto_sim_warm') === '4' ? 600 : 1000, fin = false;
      /* التقدم المعروض = التقدم الحقيقي للتحميل، بس مش أسرع من الحد الأدنى للعرض. وبعد 15 ثانية بنكمل والباقي بيخلص في الخلفية */
      var real = false; W.done.then(function () { real = true; });
      (function loop() {
        if (id !== bootId || phase !== 'boot') return;
        var el_ = Date.now() - t0, shown = Math.min(W.progress(), el_ / min);
        bootUi(shown, W.labelAt(shown));
        if ((real && el_ >= min) || el_ >= 15000) {
          bootUi(1, 'Starting'); tmo(function () { if (id !== bootId || phase !== 'boot') return; chime(os, vol); if (os === 'win') welcome(); else renderDesktop(); }, 300);
          return;
        }
        tmo(loop, 90);
      })();
    }
    function welcome() {
      phase = 'boot';
      ui.innerHTML = '<div class="sx-welcome"><div class="sx-wall"></div><div class="sx-wc">' + logo(78) + '<h2>Welcome</h2><div class="sx-spin sm"><i></i><i></i><i></i><i></i><i></i></div></div></div>'; applyWall();
      tmo(renderDesktop, 500);
    }
    function shutdown() { clearT(); busy = false; pending = null; wopen = {}; tr = []; headDone = false; cmdH = []; sel = ''; i = 0; tries = 0; files = {}; dirty = false; renderOff(); }

    /* ---- مرحلة 3: سطح المكتب ---- */
    var PROMPT = function () { return os === 'win' ? 'PS C:\\Users\\you&gt; ' : os === 'mac' ? 'you@MacBook ~ % ' : '<span class="g">you@ubuntu</span>:<span class="b">~</span>$ '; };
    var EDNAME = { win: 'Notepad', mac: 'TextEdit', linux: 'gedit' };
    function nm(a) { return a === 'ed' ? EDNAME[os] : a === 'about' ? 'About Dev' : a === 'term' ? 'Terminal' : a === 'search' ? 'Eto Search' : NAMES[os][a]; }
    function aic(a) { return a === 'ed' ? ['file-pen', 'var(--ic-set)'] : a === 'term' ? ['terminal', 'var(--ic-term)'] : a === 'search' ? ['magnifying-glass', 'var(--ic-search)'] : a === 'pc' ? [os === 'win' ? 'desktop' : os === 'mac' ? 'hard-drive' : 'house', 'var(--ic-pc)'] : a === 'about' ? ['folder-open', 'var(--ic-about)'] : a === 'bin' ? ['trash-can', 'var(--ic-bin)'] : ['gear', 'var(--ic-set)']; }
    function langTxt() { return os === 'win' ? (lang === 'en' ? '<span>ENG</span><span>US</span>' : '<span>ARA</span><span>EG</span>') : os === 'mac' ? (lang === 'en' ? 'ABC' : 'ع') : (lang === 'en' ? 'en' : 'ar'); }
    function volIc() { return vol === 0 ? 'volume-xmark' : vol < 50 ? 'volume-low' : 'volume-high'; }
    function tray() {
      return '<button class="sx-lang" data-lang title="Alt+Shift">' + langTxt() + '</button><button class="sx-tray" data-qs><i class="fa-solid fa-' + (wifi ? 'wifi' : 'globe') + '" data-wifi></i><i class="fa-solid fa-' + volIc() + '" data-vi></i><i class="fa-solid fa-battery-full"></i></button>';
    }
    function appIco(a, cls) { var c = aic(a); return '<span class="sx-ico ' + (cls || '') + '" data-app="' + a + '"' + (a === 'term' ? ' data-ico="term"' : '') + ' title="' + nm(a) + '"><i class="fa-solid fa-' + c[0] + '" style="color:' + c[1] + '"></i></span>'; }
    function head(title, isTerm) {
      var ctl = os === 'win' ? '<span class="sx-ctl"><i class="fa-solid fa-minus" data-close></i><i class="fa-regular fa-square" data-max></i><i class="fa-solid fa-xmark" data-close></i></span>' : os === 'linux' ? '<span class="sx-ctl"><i class="fa-solid fa-xmark" data-close></i></span>' : '';
      if (os === 'mac') return '<div class="sx-wh"><span class="sx-dots"><i data-close></i><i data-close></i><i></i></span><b class="sx-wt">' + title + '</b><span></span></div>';
      if (os === 'win' && isTerm) return '<div class="sx-wh"><span class="sx-tab">' + ic('terminal') + ' Windows PowerShell <i class="fa-solid fa-xmark"></i></span><span class="sx-plus"><i class="fa-solid fa-plus"></i><i class="fa-solid fa-chevron-down"></i></span><span class="sx-sp"></span>' + ctl + '</div>';
      return '<div class="sx-wh"><b class="sx-wt">' + title + '</b>' + ctl + '</div>';
    }
    function xp(crumb, inner, status) {
      return '<div class="sx-xp"><div class="sx-xt"><i class="fa-solid fa-arrow-left"></i><i class="fa-solid fa-arrow-right"></i><i class="fa-solid fa-arrow-up"></i><span class="sx-ad">' + ic('folder') + '<em>' + crumb + '</em></span><span class="sx-sr">' + ic('magnifying-glass') + ' Search</span></div>' + inner +
        '<div class="sx-xs"><span>' + status + '</span><span>' + ic('table-cells-large') + ' ' + ic('list') + '</span></div></div>';
    }
    function aboutBody() {
      var links = LINKS.map(function (l) { return '<a class="sx-lk" href="' + l[3] + '" target="_blank" rel="noopener noreferrer" style="--c:' + l[2] + '" title="' + l[3] + '"><b>' + ic(l[1]) + '</b><span>' + l[0] + '</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a>'; }).join('');
      return xp(nm('pc') + ' › Desktop › About Dev', '<div class="sx-abd"><div class="sx-me"><div class="sx-ph"><img src="' + esc(ME.photo) + '" alt="' + esc(ME.nick) + '"></div>' +
        '<h3>' + esc(ME.name) + '</h3><span class="sx-nick">' + esc(ME.nick) + '</span><p>' + esc(ME.role) + '<br>' + esc(ME.study) + '</p><div class="sx-sk">' + ME.skills.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div></div>' +
        '<div class="sx-lks">' + links + '</div></div>', LINKS.length + ' items');
    }
    function pcBody() {
      var fol = [['Desktop', 'desktop', '#60a5fa'], ['Documents', 'file-lines', '#cbd5e1'], ['Downloads', 'download', '#4ade80'], ['Pictures', 'image', '#c084fc'], ['Music', 'music', '#fb7185'], ['Videos', 'film', '#f472b6']];
      var drv = [['Local Disk (C:)', 62, '48 GB free of 128 GB'], ['Eto.Edu (D:)', 24, '152 GB free of 200 GB']];
      return xp(nm('pc'), '<div class="sx-xb"><h4>Folders (6)</h4><div class="sx-fg">' + fol.map(function (f) { return '<div class="sx-f"><span style="color:' + f[2] + '">' + ic(f[1]) + '</span>' + f[0] + '</div>'; }).join('') +
        '</div><h4>Devices and drives (2)</h4><div class="sx-dg">' + drv.map(function (d) { return '<div class="sx-drv">' + ic('hard-drive') + '<div><b>' + d[0] + '</b><div class="bar"><i style="width:' + d[1] + '%"></i></div><small>' + d[2] + '</small></div></div>'; }).join('') + '</div></div>', '8 items');
    }
    function binBody() { return xp(nm('bin'), '<div class="sx-xb sx-empty">' + ic('trash-can') + '<p>This folder is empty</p></div>', '0 items'); }
    function setBody() { return '<div class="sx-sb"><div class="sx-sl"><div class="sx-prev"></div><b>Personalization</b><small>Mode and background</small><div class="sx-th"><small>Choose your mode</small><div class="sx-seg"><button data-th="light">' + ic('sun') + ' Light</button><button data-th="dark">' + ic('moon') + ' Dark</button></div></div></div><div class="sx-sg"></div><input type="file" accept="image/*" hidden class="sx-file"></div>'; }

    function renderDesktop() {
      phase = 'on'; clearT(); lastClk = ''; sc.className = 'sx-screen sx-' + os + (theme === 'light' ? ' sx-light' : '');
      var top = os === 'mac' ? '<div class="sx-top"><span class="sx-l"><button class="sx-tray" data-sm>' + ic('b:apple') + '</button><b>Terminal</b><span>Shell</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></span><span class="sx-r">' + tray() + '<span class="sx-clk" data-clk></span></span></div>'
        : os === 'linux' ? '<div class="sx-top"><span class="sx-l"><button class="sx-tray" data-sm><b>Activities</b></button></span><span class="sx-clk sx-c" data-clk></span><span class="sx-r">' + tray() + '</span></div>' : '';
      var dock = os === 'win' ? '<div class="sx-bar"><span class="sx-bc"><span class="sx-st" data-sm>' + WINLOGO + '</span>' + appIco('search') + appIco('term') + appIco('pc') + appIco('set') + '</span>' +
          '<span class="sx-br"><i class="fa-solid fa-chevron-up sx-chev"></i>' + tray() + '<button class="sx-clk" data-clk></button></span></div>'
        : '<div class="sx-dock">' + appIco('pc') + appIco('term') + appIco('search') + appIco('about') + appIco('set') + '</div>';
      var win = function (c, a, t, body, isT) { return '<div class="sx-w sx-' + c + '" data-w="' + a + '">' + head(t, isT) + body + '</div>'; };
      var icons = ['pc', 'bin', 'about', 'search'].map(function (a) { var c = aic(a); return '<div class="sx-di" data-app="' + a + '"><span class="sx-dic" style="color:' + c[1] + '">' + '<i class="fa-solid fa-' + c[0] + '"></i></span>' + nm(a) + '</div>'; }).join('');
      var apps = ['term', 'ed', 'search', 'pc', 'about', 'set', 'bin'].map(function (a) { var c = aic(a); return '<button class="sx-ap" data-app="' + a + '"><span style="color:' + c[1] + '"><i class="fa-solid fa-' + c[0] + '"></i></span><em>' + nm(a) + '</em></button>'; }).join('');
      ui.innerHTML = '<div class="sx-wall"></div>' + top + '<div class="sx-desk"><div class="sx-dis">' + icons + '</div>' +
        win('term', 'term', os === 'mac' ? 'you — -zsh — 80×24' : os === 'linux' ? 'you@ubuntu: ~' : '', '<div class="sx-tb" dir="ltr"><div class="sx-lines"></div><div class="sx-inl"><span class="sx-p">' + PROMPT() + '</span><input class="sx-in" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="terminal"></div></div>', 1) +
        win('ed', 'ed', '<span class="sx-fn">file.py</span>' + (os === 'mac' ? '' : ' - ' + EDNAME[os]), '<div class="sx-menu"><span>File</span><span>Edit</span><span>View</span></div><textarea class="sx-ta" dir="ltr" spellcheck="false" autocapitalize="off"></textarea><div class="sx-ef"><span class="sx-pos">Ln 1, Col 1</span><span>UTF-8</span><button class="ls-btn sx-save"><i class="fa-solid fa-floppy-disk"></i> Save</button></div>') +
        win('about', 'about', ic('folder-open') + ' About Dev', aboutBody()) + win('pc', 'pc', ic('folder') + ' ' + nm('pc'), pcBody()) + win('bin', 'bin', ic('trash-can') + ' ' + nm('bin'), binBody()) + win('set', 'set', ic('gear') + ' ' + nm('set'), setBody()) + win('search', 'search', ic('magnifying-glass') + ' Eto Search', searchBody()) +
        '</div>' + dock +
        '<div class="sx-sm"><div class="sx-smh">' + logo(26) + '<b>Eto<span>.Edu</span></b><small>Pinned</small></div><div class="sx-smg">' + apps + '</div>' +
        '<div class="sx-smf"><span class="sx-usr"><i>E</i> Eto</span><button class="sx-pwr" data-act="off" title="Shut down"><i class="fa-solid fa-power-off"></i></button></div></div>' +
        '<div class="sx-cm"><ul><li data-app="search">' + ic('magnifying-glass') + ' Eto Search</li><li data-app="set">' + ic('image') + ' Personalize</li><li data-app="term">' + ic('terminal') + ' Open Terminal</li><li data-app="about">' + ic('folder-open') + ' About Dev</li></ul></div>' +
        '<div class="sx-fly"><div class="sx-tiles"><button data-tile="wifi" class="' + (wifi ? 'on' : '') + '"><i class="fa-solid fa-wifi"></i><span>Wi-Fi</span></button><button class="on"><i class="fa-brands fa-bluetooth-b"></i><span>Bluetooth</span></button><button><i class="fa-solid fa-plane"></i><span>Airplane</span></button></div>' +
        '<div class="sx-vrow"><i class="fa-solid fa-' + volIc() + '" data-vi2></i><input type="range" min="0" max="100" value="' + vol + '" class="sx-vr"></div></div>';
      $('.sx-pw').style.display = '';
      bind(); replay(); updClock(); applyWall(); mark(); task(); ghost();
      loadPicList().then(function (pics) {
        if (!alive() || phase !== 'on') return;
        var saved = ls('eto_sim_img');
        var pick = saved === 'custom' && wpCustom ? 'custom' : (saved == null || saved === '' ? 0 : Number(saved));
        if (pick !== 'custom' && (!isFinite(pick) || pick < 0 || pick >= pics.length)) pick = 0;
        setWp(pick);
      }).catch(function () { applyWall(); });
    }

    /* ---- صور سطح المكتب: تحميل عند الطلب ---- */
    function loadPicList() {
      if (PICS) return Promise.resolve(PICS);
      if (root.__etoSimPicList) return root.__etoSimPicList;

      root.__etoSimPicList = fetch(PIC_API, {
        headers: { Accept: 'application/vnd.github+json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('images');
        return r.json();
      }).then(function (items) {
        if (!Array.isArray(items)) throw new Error('images');

        PICS = items.filter(function (f) {
          return f.type === 'file' && f.download_url && PIC_EXT.test(f.name);
        }).sort(function (a, b) {
          return a.name.localeCompare(b.name);
        }).slice(0, 20).map(function (f) {
          return { name: f.name, url: f.download_url };
        });

        if (!PICS.length) throw new Error('no-images');
        return PICS;
      }).catch(function (e) {
        root.__etoSimPicList = null;
        throw e;
      });

      return root.__etoSimPicList;
    }

    function wallCss() {
      return activePicUrl
        ? 'url(' + JSON.stringify(activePicUrl) + ') center/cover no-repeat #000'
        : 'linear-gradient(160deg,#06122e,#1d4ed8)';
    }

    function applyWall() {
      var c = wallCss();
      el.querySelectorAll('.sx-wall').forEach(function (w) {
        w.style.background = c;
      });
      var p = $('.sx-prev');
      if (p) p.style.background = c;
    }

    function flip() {
      el.querySelectorAll('.sx-wall').forEach(function (w) {
        w.style.animation = 'none';
        void w.offsetWidth;
        w.style.animation = '';
      });
    }

    function wpGrid() {
      var g = $('.sx-sg'); if (!g) return;

      if (!PICS) {
        g.innerHTML = '<div class="sx-img-state">جاري تجهيز قائمة الصور...</div>';
        loadPicList().then(function () {
          wpGrid();
        }, function () {
          g.innerHTML = '<div class="sx-img-state">تعذر تحميل قائمة الصور. اتأكد من الإنترنت وجرب تاني.</div>';
        });
        return;
      }

      g.innerHTML = PICS.map(function (p, i) {
        var on = currentPicIndex === i && !!activePicUrl;
        var style = on
          ? ' style="background-image:url(&quot;' + esc(activePicUrl) + '&quot;);background-position:center;background-size:cover"'
          : '';

        return '<button class="sx-wth' + (on ? ' on' : '') + (loadingPicIndex === i ? ' loading' : '') + '" data-wp="' + i + '"' + style + '>' +
          '<span>' + esc(p.name) + '</span>' +
          '<small>' + (loadingPicIndex === i ? 'بيتم التحميل...' : on ? 'الخلفية الحالية' : 'اضغط للتحميل') + '</small></button>';
      }).join('') +

        (wpCustom ? '<button class="sx-wth' + (currentPicIndex === -1 ? ' on' : '') + '" data-wp="custom" style="background-image:url(&quot;' + esc(wpCustom) + '&quot;);background-size:cover;background-position:center"><span>My photo</span><small>صورة شخصية</small></button>' : '') +
        '<button class="sx-wth up" data-up>' + ic('plus') + '<span>Browse photo</span></button>';

      el.querySelectorAll('[data-th]').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-th') === theme);
      });

      applyWall();
    }

    function setWp(id) {
      if (id === 'custom' && wpCustom) {
        picLoadId++;
        loadingPicIndex = -1;
        activePicUrl = wpCustom;
        currentPicIndex = -1;
        ls('eto_sim_img', 'custom');
        applyWall();
        wpGrid();
        return;
      }

      var index = Number(id), p = PICS && PICS[index];
      if (!p || !p.url) return;
      if (currentPicIndex === index && activePicUrl) return;

      var req = ++picLoadId;
      loadingPicIndex = index;
      wpGrid();
      shrink(p.url, function (u) {
        if (req !== picLoadId) return;
        if (!u) {
          loadingPicIndex = -1;
          var g = $('.sx-sg'), b = g && g.querySelector('[data-wp="' + index + '"]'), small = b && b.querySelector('small');
          if (small) small.textContent = 'تعذر التحميل';
          if (b) b.classList.remove('loading');
          return;
        }
        activePicUrl = u; currentPicIndex = index; loadingPicIndex = -1;
        ls('eto_sim_img', String(index));
        applyWall(); wpGrid();
      });
    }
    /* الصور الكبيرة بتتصغّر مرة واحدة (1280px) عشان الجهاز مايتقلش في رسمها */
    function shrink(url, cb) {
      var im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = function () {
        try {
          var sc_ = Math.min(1, 1280 / im.naturalWidth);
          if (sc_ < 1) {
            var cv = document.createElement('canvas'); cv.width = Math.round(im.naturalWidth * sc_); cv.height = Math.round(im.naturalHeight * sc_);
            cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
            cv.toBlob(function (b) { cb(b ? URL.createObjectURL(b) : url); }, 'image/jpeg', .85); return;
          }
        } catch (e) {}
        cb(url);
      };
      im.onerror = function () { var r = new Image(); r.onload = function () { cb(url); }; r.onerror = function () { cb(null); }; r.src = url; };
      im.src = url;
    }

    function setTheme(t) {
      ls('eto_sim_theme', t);
      if (t === theme) return;
      theme = t;
      sc.classList.toggle('sx-light', t === 'light');
      wpGrid();
    }
    function loadCustom(file) {
      if (!file) return; var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          var s = Math.min(1, 1280 / im.width), cv = document.createElement('canvas'); cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s);
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); wpCustom = cv.toDataURL('image/jpeg', .82); ls('eto_sim_wpc', wpCustom); setWp('custom');
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    }

    /* ---- النوافذ ---- */
    function front(w) { w.style.zIndex = ++z; }
    function openWin(a) {
      var w = $('.sx-' + a); if (!w) return; closeMenus(); wopen[a] = true; w.classList.add('show'); front(w); mark(); if (a === 'set') wpGrid(); if (a === 'search') tmo(function () { var i = $('.es-in'); if (i) i.focus(); }, 40);
    }
    function closeWin(w) { var a = w.getAttribute('data-w'); w.classList.remove('show', 'max'); wopen[a] = false; mark(); ghost(); }
    function openApp(a) { if (a === 'term') openTerm(); else if (a === 'ed') { var n = edName || 'untitled.py'; closeMenus(); openEd(n, files[n]); } else openWin(a); }
    function closeMenus() { ['.sx-fly', '.sx-sm', '.sx-cm'].forEach(function (q) { var n = $(q); if (n) n.classList.remove('open'); }); }

    /* ---- لغة ---- */
    var EN = { Backquote: ['`', '~'], Digit1: ['1', '!'], Digit2: ['2', '@'], Digit3: ['3', '#'], Digit4: ['4', '$'], Digit5: ['5', '%'], Digit6: ['6', '^'], Digit7: ['7', '&'], Digit8: ['8', '*'], Digit9: ['9', '('], Digit0: ['0', ')'], Minus: ['-', '_'], Equal: ['=', '+'], BracketLeft: ['[', '{'], BracketRight: [']', '}'], Backslash: ['\\', '|'], Semicolon: [';', ':'], Quote: ["'", '"'], Comma: [',', '<'], Period: ['.', '>'], Slash: ['/', '?'] };
    var ARS = { KeyH: 'أ', KeyY: 'إ', KeyN: 'آ', KeyG: 'لأ', KeyT: 'لإ', KeyB: 'لآ' };
    /* الحرف بيتحدد من مكان الزرار ولغة الجهاز الوهمي، فلغة كيبورد جهازك الحقيقي ملهاش تأثير */
    function vk(e) {
      var c = e.code, sh = e.shiftKey;
      if (/^Key[A-Z]$/.test(c)) {
        if (lang === 'ar') return (sh && ARS[c]) || AR[c];
        var ch = c.charAt(3).toLowerCase(); return sh !== !!(e.getModifierState && e.getModifierState('CapsLock')) ? ch.toUpperCase() : ch;
      }
      if (lang === 'ar' && AR[c]) return AR[c];
      var m = EN[c]; return m ? (sh ? m[1] : m[0]) : null;
    }
    function typeKey(e) {
      var t = e.target; if (!t || (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') || t.type === 'range' || t.type === 'file') return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      var c = vk(e); if (c == null) return;
      e.preventDefault(); e.stopPropagation(); t.setRangeText(c, t.selectionStart, t.selectionEnd, 'end'); t.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function arKey() { return false; }
    function setLang(l) { lang = l; el.querySelectorAll('[data-lang]').forEach(function (b) { b.innerHTML = langTxt(); }); }

    /* ---- ربط الأحداث ---- */
    function bind() {
      var inp = $('.sx-in'), ta = $('.sx-ta'), term = $('.sx-term'), ed = $('.sx-ed'), desk = $('.sx-desk'); bindSearch();
      inp.addEventListener('keydown', function (e) {
        if (arKey(e, inp)) return;
        if (e.key === 'Enter') { e.preventDefault(); var v = inp.value; inp.value = ''; submit(v); }
        else if (e.key === 'ArrowUp' && cmdH.length) { e.preventDefault(); hp = Math.max(0, hp - 1); inp.value = cmdH[hp] || ''; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); hp = Math.min(cmdH.length, hp + 1); inp.value = cmdH[hp] || ''; }
        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); clearTerm(); }
      });
      term.addEventListener('mousedown', function (e) { front(term); if (!e.target.closest('.sx-wh')) tmo(function () { inp.focus(); }, 0); });
      ed.addEventListener('mousedown', function () { front(ed); });
      el.querySelectorAll('.sx-about,.sx-pc,.sx-bin,.sx-set,.sx-search').forEach(function (w) { w.addEventListener('mousedown', function () { front(w); }); });
      ta.addEventListener('keydown', function (e) { if (arKey(e, ta)) return; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); } });
      ta.addEventListener('input', function () { dirty = true; title(); });
      ['keyup', 'click', 'input'].forEach(function (ev) { ta.addEventListener(ev, function () { var v = ta.value.slice(0, ta.selectionStart).split('\n'); $('.sx-pos').textContent = 'Ln ' + v.length + ', Col ' + (v[v.length - 1].length + 1); }); });
      $('.sx-save').addEventListener('click', save);
      /* أيقونات التاسك بار والدوك والقوائم */
      el.querySelectorAll('.sx-ico[data-app],.sx-ap,.sx-cm li').forEach(function (b) {
        b.addEventListener('click', function () { var a = b.getAttribute('data-app'), w = $('.sx-' + a); if (b.classList.contains('sx-ico') && wopen[a] && w) { front(w); closeMenus(); } else openApp(a); });
      });
      /* أيقونات سطح المكتب: كليك يحدد، دبل كليك يفتح */
      el.querySelectorAll('.sx-di').forEach(function (d) {
        d.addEventListener('click', function (e) { e.stopPropagation(); el.querySelectorAll('.sx-di').forEach(function (x) { x.classList.toggle('sel', x === d); }); if (coarse) openApp(d.getAttribute('data-app')); });
        d.addEventListener('dblclick', function () { openApp(d.getAttribute('data-app')); });
      });
      desk.addEventListener('click', function () { el.querySelectorAll('.sx-di.sel').forEach(function (x) { x.classList.remove('sel'); }); });
      desk.addEventListener('contextmenu', function (e) {
        e.preventDefault(); var m = $('.sx-cm'), r = sc.getBoundingClientRect(); closeMenus();
        m.style.left = Math.min(W - 190, (e.clientX - r.left) / k) + 'px'; m.style.top = Math.min(H - 130, (e.clientY - r.top) / k) + 'px'; m.classList.add('open');
      });
      el.querySelectorAll('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(lang === 'en' ? 'ar' : 'en'); }); });
      el.querySelectorAll('[data-qs]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); var f = $('.sx-fly'), o = !f.classList.contains('open'); closeMenus(); f.classList.toggle('open', o); }); });
      el.querySelectorAll('[data-sm]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); var f = $('.sx-sm'), o = !f.classList.contains('open'); closeMenus(); f.classList.toggle('open', o); }); });
      $('.sx-pwr').addEventListener('click', shutdown);
      var wt = $('[data-tile="wifi"]'); wt.addEventListener('click', function () { wifi = !wifi; wt.classList.toggle('on', wifi); el.querySelectorAll('[data-wifi]').forEach(function (x) { x.className = 'fa-solid fa-' + (wifi ? 'wifi' : 'globe'); }); });
      $('.sx-vr').addEventListener('input', function (e) { vol = +e.target.value; el.querySelectorAll('[data-vi],[data-vi2]').forEach(function (x) { x.className = 'fa-solid fa-' + volIc(); }); });
      /* الإعدادات */
      var set = $('.sx-set');
      set.addEventListener('click', function (e) { var b = e.target.closest('[data-wp],[data-up],[data-th]'); if (!b) return; if (b.hasAttribute('data-th')) setTheme(b.getAttribute('data-th')); else if (b.hasAttribute('data-up')) $('.sx-file').click(); else setWp(b.getAttribute('data-wp')); });
      $('.sx-file').addEventListener('change', function (e) { loadCustom(e.target.files[0]); e.target.value = ''; });
      /* صورة الشخصية: لو مش موجودة يطلع حرف E */
      var im = $('.sx-ph img'); if (im) im.addEventListener('error', function () { var m = document.createElement('b'); m.className = 'sx-mono'; m.textContent = 'E'; im.replaceWith(m); });
      /* إغلاق/تكبير/سحب */
      el.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { closeWin(b.closest('.sx-w')); }); });
      el.querySelectorAll('[data-max]').forEach(function (b) { b.addEventListener('click', function () { b.closest('.sx-w').classList.toggle('max'); }); });
      el.querySelectorAll('.sx-wh').forEach(function (h) {
        h.addEventListener('pointerdown', function (e) {
          if (e.target.closest('[data-close],[data-max],.sx-dots i')) return;
          var w = h.parentNode; if (w.classList.contains('max')) return;
          var sx = e.clientX, sy = e.clientY, ox = w.__x || 0, oy = w.__y || 0, bl = w.offsetLeft, bt = w.offsetTop; front(w); try { h.setPointerCapture(e.pointerId); } catch (x) {}
          function mv(ev) {
            var nx = Math.max(-bl - w.offsetWidth + 90, Math.min(W - bl - 90, ox + (ev.clientX - sx) / k)), ny = Math.max(-bt, Math.min(H - bt - 60, oy + (ev.clientY - sy) / k));
            w.__x = nx; w.__y = ny; w.style.translate = nx + 'px ' + ny + 'px';
          }
          function up() { h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up); }
          h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up); e.preventDefault();
        });
      });
    }

    /* ---- الماوس والكيبورد: من غير أي مؤثرات مستمرة ---- */
    var craf = 0, srect = null;
    function ghost() {}
    function toggleSm() { var f = $('.sx-sm'); if (!f) return; var o = !f.classList.contains('open'); closeMenus(); f.classList.toggle('open', o); }
    sc.addEventListener('keydown', typeKey, true);
    sc.addEventListener('mousedown', function (e) {
      var t = e.target;
      if (!t.closest('.sx-fly,[data-qs]')) { var f = $('.sx-fly'); if (f) f.classList.remove('open'); }
      if (!t.closest('.sx-sm,[data-sm]')) { var s = $('.sx-sm'); if (s) s.classList.remove('open'); }
      if (!t.closest('.sx-cm')) { var m = $('.sx-cm'); if (m) m.classList.remove('open'); }
    });
    function isMeta(e) { return e.key === 'Meta' || e.code === 'MetaLeft' || e.code === 'MetaRight'; }
    function active() { return opts.page || sc.contains(document.activeElement) || isFs(); }
    on(document, 'keydown', function (e) {
      if (!alive() || phase !== 'on' || !active()) return;
      if (isMeta(e)) { e.preventDefault(); if (!e.repeat) { metaDown = true; metaUsed = false; } return; }
      if (e.key === 'Escape') { closeMenus(); return; }
      if (!e.repeat && ((e.key === 'Shift' && (e.altKey || e.ctrlKey)) || ((e.key === 'Alt' || e.key === 'Control') && e.shiftKey))) { setLang(lang === 'en' ? 'ar' : 'en'); return; }
      if (metaDown) {
        var c = e.code, h = true;
        if (c === 'Space') setLang(lang === 'en' ? 'ar' : 'en');
        else if (c === 'KeyD') el.querySelectorAll('.sx-w.show').forEach(closeWin);
        else if (c === 'KeyE') openApp('pc');
        else if (c === 'KeyS' || c === 'KeyQ') openApp('search');
        else if (c === 'KeyI') openApp('set');
        else h = false;
        if (h) { e.preventDefault(); metaUsed = true; }
      } else if (os === 'linux' && e.ctrlKey && e.altKey && e.code === 'KeyT') { e.preventDefault(); openApp('term'); }
    }, true);
    on(document, 'keyup', function (e) {
      if (!alive() || !isMeta(e)) return;
      e.preventDefault();
      if (metaDown && !metaUsed && phase === 'on' && os !== 'mac') toggleSm();
      metaDown = false;
    }, true);
    on(window, 'blur', function () { metaDown = false; });

    /* ---- Eto Search ---- */
    var esCur = 'all', esId = 0;
    function searchBody() {
      return '<div class="es"><div class="es-bar"><div class="es-box">' + ic('magnifying-glass') + '<input class="es-in" dir="auto" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Search anything" aria-label="Eto Search"><button class="es-go es-do">Search</button></div></div>' +
        '<div class="es-chips">' + ES_SRC.map(function (s) { return '<button class="es-chip' + (s[0] === esCur ? ' on' : '') + '" data-src="' + s[0] + '">' + ic(s[2]) + s[1] + '</button>'; }).join('') + '</div>' +
        '<div class="es-res"></div>' +
        '<div class="es-ext"><span>Open with</span>' + ES_EXT.map(function (x) { return '<a data-e="' + x[0] + '" data-h="' + x[2] + '" href="' + x[2] + '" target="_blank" rel="noopener noreferrer">' + ic(x[1]) + x[3] + '</a>'; }).join('') + '</div></div>';
    }
    function esHist() { try { return JSON.parse(ls('eto_sim_sh') || '[]'); } catch (e) { return []; } }
    function esSave(q) { var h = esHist().filter(function (x) { return x !== q; }); h.unshift(q); ls('eto_sim_sh', JSON.stringify(h.slice(0, 6))); }
    function esChip(s) { return '<button data-q="' + esc(s) + '">' + esc(s) + '</button>'; }
    function esChips() { el.querySelectorAll('.es-chip').forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-src') === esCur); }); }
    function esExt(q) { el.querySelectorAll('.es-ext a[data-e]').forEach(function (a) { a.href = q ? ES_Q[a.getAttribute('data-e')] + encodeURIComponent(q) : a.getAttribute('data-h'); }); }
    function esEmpty() {
      var h = esHist(), box = $('.es-res'); if (!box) return;
      box.innerHTML = '<div class="es-empty">' + logo(54) + '<h3>Eto Search</h3><p>Search Wikipedia, Stack Overflow, GitHub and MDN from inside your PC, or open Google, Bing and more in a new tab.</p>' +
        (h.length ? '<small>Recent</small><div class="es-sug">' + h.map(esChip).join('') + '</div>' : '') +
        '<small>Try</small><div class="es-sug">' + ['python variables', 'list comprehension', 'ما هي لغة بايثون', 'what is an algorithm'].map(esChip).join('') + '</div></div>';
    }
    function esApps(q) {
      var ws = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 2; });
      return Object.keys(APPK).filter(function (a) { var hw = (nm(a) + ' ' + APPK[a]).toLowerCase().split(/\s+/); return ws.some(function (w) { return hw.some(function (h) { return h.indexOf(w) === 0; }); }); }).slice(0, 4);
    }
    function esSection(s, more) {
      var S = ES_SRC.filter(function (x) { return x[0] === s; })[0];
      return '<section class="es-sec" data-s="' + s + '"><h5>' + ic(S[2]) + '<span>' + S[1] + '</span>' + (more ? '<button data-more="' + s + '">See all</button>' : '') + '</h5><div class="es-body">' +
        new Array(4).join('<div class="es-sk"><span></span><div><i></i><i></i><i></i></div></div>') + '</div></section>';
    }
    function esHost(u) { return String(u).replace(/^https?:\/\/(www\.)?/, '').split('/')[0]; }
    function esCard(r) {
      var u = /^https?:\/\//i.test(r.u) ? r.u : '#';
      return '<a class="es-c" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + (r.img ? '<img src="' + esc(r.img) + '" alt="">' : '') +
        '<div><b dir="auto">' + esc(r.t) + '</b><em>' + esc(esHost(u)) + '</em>' + (r.s ? '<p dir="auto">' + esc(r.s) + '</p>' : '') + (r.m ? '<small>' + esc(r.m) + '</small>' : '') + '</div></a>';
    }
    function esBody(s) { return el.querySelector('.es-sec[data-s="' + s + '"] .es-body'); }
    function esFill(s, rows, q) {
      var b = esBody(s); if (!b) return;
      if (rows === null) { b.innerHTML = '<div class="es-g"><b>Google does not allow its results to be shown inside another page.</b><p>Open this search on Google, or add a Google Programmable Search key to see results here.</p><a class="es-gb" href="' + esc(ES_Q.g + encodeURIComponent(q)) + '" target="_blank" rel="noopener noreferrer">' + ic('b:google') + ' Search on Google</a></div>'; return; }
      b.innerHTML = rows.length ? rows.map(esCard).join('') : '<div class="es-note">No results from this source.</div>';
    }
    function esFail(s, e) {
      var b = esBody(s); if (!b) return;
      b.innerHTML = '<div class="es-note bad">' + (/http (403|429)/.test(String(e && e.message)) ? 'Rate limit reached for this source. Try again in a minute.' : 'Could not reach this source right now.') + '</div>';
    }
    function esSearch(q) {
      q = String(q || '').trim(); var box = $('.es-res'); if (!box) return;
      if (!q) { esEmpty(); esExt(''); return; }
      var id = ++esId, all = esCur === 'all', list = all ? ['wiki', 'so', 'mdn', 'gh'] : [esCur], n = all ? 4 : 10;
      esSave(q); esExt(q);
      if (!wifi) {
        box.innerHTML = '<div class="es-empty"><i class="fa-solid fa-globe es-big"></i><h3>No internet</h3><p>Wi-Fi is turned off on this PC.</p><button class="es-go es-wifi">Turn Wi-Fi on</button></div>';
        box.querySelector('.es-wifi').onclick = function () { var t = $('[data-tile="wifi"]'); if (t) t.click(); esSearch(q); };
        return;
      }
      var apps = all ? esApps(q) : [];
      box.innerHTML = (apps.length ? '<section class="es-sec"><h5><i class="fa-solid fa-desktop"></i><span>On this PC</span></h5><div class="es-apps">' + apps.map(function (a) { var c = aic(a); return '<button class="es-app" data-app="' + a + '"><i class="fa-solid fa-' + c[0] + '" style="color:' + c[1] + '"></i>' + nm(a) + '</button>'; }).join('') + '</div></section>' : '') +
        list.map(function (s) { return esSection(s, all); }).join('');
      box.scrollTop = 0;
      list.forEach(function (s) { SRCF[s](q, n).then(function (r) { if (id === esId) esFill(s, r, q); }, function (e) { if (id === esId) esFail(s, e); }); });
    }
    function bindSearch() {
      var w = $('.sx-search'), inp = $('.es-in'), res = $('.es-res');
      inp.addEventListener('keydown', function (e) { if (arKey(e, inp)) return; if (e.key === 'Enter') { e.preventDefault(); esSearch(inp.value); } });
      $('.es-do').addEventListener('click', function () { esSearch(inp.value); });
      w.addEventListener('click', function (e) {
        var c = e.target.closest('[data-src]'); if (c) { esCur = c.getAttribute('data-src'); esChips(); if (inp.value.trim()) esSearch(inp.value); return; }
        var m = e.target.closest('[data-more]'); if (m) { esCur = m.getAttribute('data-more'); esChips(); esSearch(inp.value); return; }
        var q = e.target.closest('[data-q]'); if (q) { inp.value = q.getAttribute('data-q'); esSearch(inp.value); return; }
        var a = e.target.closest('.es-app'); if (a) openApp(a.getAttribute('data-app'));
      });
      res.addEventListener('error', function (e) { if (e.target.tagName === 'IMG') e.target.style.display = 'none'; }, true);
      esEmpty();
    }

    /* ---- الترمنال ---- */
    function line(html, cls) { tr.push([html, cls]); addLine(html, cls); }
    function addLine(html, cls) { var L = $('.sx-lines'); if (!L) return; var d = document.createElement('div'); d.className = 'sx-l ' + (cls || ''); d.innerHTML = html || '&nbsp;'; L.appendChild(d); while (L.childNodes.length > 400) L.removeChild(L.firstChild); var b = $('.sx-tb'); b.scrollTop = b.scrollHeight; }
    function replay() { tr.forEach(function (t) { addLine(t[0], t[1]); }); }
    function clearTerm() { tr = []; var L = $('.sx-lines'); if (L) L.innerHTML = ''; }
    function hideIn() { var n = $('.sx-inl'); if (n) n.style.visibility = 'hidden'; }
    function showIn() { var n = $('.sx-inl'); if (n) { n.style.visibility = ''; var inp = $('.sx-in'); if (inp && wopen.term) inp.focus(); $('.sx-tb').scrollTop = 1e6; } }
    function emit(lines, done, delay, gap) {
      busy = true; hideIn(); pending = done; var j = 0;
      tmo(function nx() {
        if (j >= lines.length) { busy = false; pending = null; showIn(); if (done) done(); return; }
        line(esc(lines[j++]), 'o'); tmo(nx, gap || 55);
      }, delay || 0);
    }
    function header() {
      if (headDone) return; headDone = true;
      var d = new Date(), lg = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB');
      emit(os === 'win' ? ['Windows PowerShell', 'Copyright (C) Microsoft Corporation. All rights reserved.', '', 'Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows', ''] : os === 'mac' ? ['Last login: ' + lg + ' on ttys000'] : [], null, 350, 90);
    }
    function openTerm() {
      var t = $('.sx-term'); closeMenus(); front(t);
      if (!wopen.term) { wopen.term = true; t.classList.add('show'); mark(); ghost(); header(); }
      tmo(function () { var inp = $('.sx-in'); if (inp && !busy) inp.focus(); }, 40);
      if (steps[i] && steps[i].kind === 'open') tmo(next, 300);
    }
    function notFound(c) {
      var w = String(c).trim().split(' ')[0];
      return os === 'win' ? w + " : The term '" + w + "' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again."
        : os === 'mac' ? 'zsh: command not found: ' + w : 'Command \'' + w + '\' not found, but can be installed with: sudo apt install ' + w;
    }
    function generic(c) {
      var n = normCmd(c), p = n.split(' ');
      if (/^(ls|dir)$/i.test(n)) return Object.keys(files).join(os === 'win' ? '\n' : '  ');
      if (/^(cd|cd ~|cd \.|pwd)$/i.test(n)) return /^pwd$/.test(n) ? '/home/you' : '';
      if (/^whoami$/i.test(n)) return os === 'win' ? 'desktop-pc\\you' : 'you';
      if (n === 'python --version' || n === 'python -V') return 'Python 3.12.4';
      if (p[0] === 'python' && /\.py$/.test(p[1] || '')) return files[p[1]] != null ? runPy(files[p[1]]) : "python: can't open file '" + (os === 'win' ? 'C:\\Users\\you\\' : '/home/you/') + p[1] + "': [Errno 2] No such file or directory";
      return null;
    }
    function submit(c) {
      c = c.trim(); if (!c || busy) return;
      cmdH.push(c); hp = cmdH.length;
      if (/^(cls|clear)$/i.test(c)) { clearTerm(); return; }
      line('<span class="sx-p">' + PROMPT() + '</span>' + esc(c));
      var st = steps[i], run = /^python/.test(normCmd(c));
      if (st && st.kind === 'cmd' && cmdOk(c, st.expect)) { emit(String(pick(st.out, os)).split('\n').filter(function (x, j, a) { return x !== '' || a.length > 1; }), next, run ? 420 : 120); return; }
      if (freeMode && freeCmd(c)) return;
      var g = generic(c);
      if (g != null) { emit(g === '' ? [] : g.split('\n'), null, run ? 420 : 120); if (st && st.kind === 'cmd') { tries++; task('الأمر ده اشتغل، بس مش هو المطلوب في الخطوة. اقرا التعليمات فوق.', 'bad'); } return; }
      tries++; emit([notFound(c)], null, 120);
      task(lang === 'ar' || /[\u0600-\u06FF]/.test(c) ? 'اللغة عربي! بدّلها لـENG (Alt+Shift أو دوس على الزرار في الشريط) وجرّب تاني.' : 'الأمر ده مش المطلوب في الخطوة. اقرا التعليمات فوق وجرّب تاني.', 'bad');
    }

    /* ---- المحرر ---- */
    function title() { var n = edName || (steps[i] && steps[i].file) || 'file.py', f = $('.sx-fn'); if (f) f.textContent = (dirty ? '*' : '') + n; }
    function openEd(name, content) {
      var e = $('.sx-ed'); if (!e) return; closeMenus(); edName = name; wopen.ed = true; dirty = false; front(e); $('.sx-fn').textContent = name; $('.sx-ta').value = content || ''; $('.sx-pos').textContent = 'Ln 1, Col 1';
      e.classList.add('show'); mark(); tmo(function () { $('.sx-ta').focus(); }, 40);
    }
    function save() {
      if (freeMode) {
        if (!wopen.ed) return;
        var nme = edName; if (!nme || nme === 'untitled.py') { var r = root.prompt('File name', 'hello.py'); if (!r) return; nme = r.trim().replace(/[\\/]/g, ''); if (!nme) return; edName = nme; }
        files[nme] = $('.sx-ta').value; dirty = false; title(); var ed = $('.sx-ed'); ed.classList.add('saved'); tmo(function () { ed.classList.remove('saved'); }, 500); return;
      }
      var st = steps[i]; if (!st || st.kind !== 'code' || !wopen.ed) return;
      var v = $('.sx-ta').value, e = $('.sx-ed');
      if (codeOk(v, st.expect)) {
        files[st.file] = v; dirty = false; title(); e.classList.add('saved');
        tmo(function () { e.classList.remove('saved'); e.classList.remove('show'); wopen.ed = false; next(); tmo(function () { var inp = $('.sx-in'); if (inp && wopen.term) inp.focus(); }, 300); }, 650);
        return;
      }
      tries++; e.classList.remove('bad'); void e.offsetWidth; e.classList.add('bad'); task(explain(v, st.expect), 'bad');
    }

    /* ---- لوحة المهمة ---- */
    function mark() {
      el.querySelectorAll('.sx-ico[data-app]').forEach(function (b) { b.classList.toggle('on', !!wopen[b.getAttribute('data-app')]); });
      var st = steps[i]; el.querySelectorAll('[data-ico="term"]').forEach(function (b) { b.classList.toggle('pulse', phase === 'on' && !!st && st.kind === 'open' && !wopen.term); });
    }
    function task(msg, cls) {
      var st = steps[i], t = $('.sx-task');
      if (!st) { if (pureFree) { t.innerHTML = ''; return; } t.innerHTML = '<div class="ls-result ok sx-pop"><i class="fa-solid fa-circle-check"></i> ' + fmt(P.done || 'برافو! خلّصت كل الخطوات العملية.') + '</div>'; return; }
      if (phase !== 'on') {
        var m = phase === 'pick' ? 'اختار نظام التشغيل اللي عايز تجرّب عليه.' : phase === 'boot' ? 'الجهاز بيفتح... ثواني.' : 'دوس على **Open Computer** عشان تشغّل الجهاز. هيفتح بملء الشاشة.';
        t.innerHTML = '<div class="sx-step sx-in-anim"><div class="sx-prog"><i style="width:0"></i></div><small>قبل ما تبدأ</small><p>' + fmt(m) + '</p></div>'; return;
      }
      var sol = st.kind === 'cmd' || st.kind === 'code' ? list(st.expect)[0] : '';
      t.innerHTML = '<div class="sx-step' + (msg ? '' : ' sx-in-anim') + '"><div class="sx-prog"><i style="width:' + (i / steps.length * 100) + '%"></i></div><small>خطوة ' + (i + 1) + ' من ' + steps.length + '</small>' +
        '<p>' + fmt(st.say || '') + '</p>' + (msg ? '<div class="ls-why ' + (cls || 'bad') + ' sx-pop">' + fmt(msg) + '</div>' : '') +
        '<div class="ls-actions">' + (st.hint ? '<button class="ls-btn ghost sx-hint"><i class="fa-regular fa-lightbulb"></i> تلميح</button>' : '') +
        (tries >= 2 && sol ? '<button class="ls-btn ghost sx-show"><i class="fa-solid fa-eye"></i> اعرض الحل</button>' : '') + '</div></div>';
      var h = t.querySelector('.sx-hint'); if (h) h.onclick = function () { task(st.hint, 'ok'); };
      var s = t.querySelector('.sx-show'); if (s) s.onclick = function () { if (st.kind === 'cmd') { $('.sx-in').value = sol; $('.sx-in').focus(); } else { $('.sx-ta').value = sol; } };
    }
    function next() {
      i++; tries = 0; mark(); ghost();
      if (i >= steps.length) { task(); free(); if (opts.onDone) opts.onDone(); return; }
      var st = steps[i]; if (st.kind === 'code') openEd(st.file || 'file.py');
      task();
    }

    /* ---- الاستخدام الحر: بايثون حقيقية جوه الـTerminal نفسه ---- */
    function free() { freeMode = true; }
    function pyExec(code) {
      busy = true; hideIn();
      if (!root.__etoPy) line('Loading Python (first run only, about 10 MB)...', 'o');
      loadPy().then(function (py) {
        var buf = [];
        py.setStdout({ batched: function (x) { buf.push(x); } }); py.setStderr({ batched: function (x) { buf.push(x); } });
        py.setStdin({ stdin: function () { var v = root.prompt('input()'); return v == null ? '' : v; } });
        return py.runPythonAsync(code).then(function () { return buf; }, function (e) { return buf.concat(String(e.message || e).trim().split('\n').slice(-4)); });
      }).then(function (out) { if (dead) return; emit(out, null, 0); }, function () { if (dead) return; emit(['Could not load Python. Check your internet connection.'], null, 0); });
    }
    function freeCmd(c) {
      var n = normCmd(c), p = n.split(' '), cmd = p[0].toLowerCase(), a = p.slice(1).join(' ');
      if (cmd === 'python') {
        if (p[1] === '-c') { pyExec(c.replace(/^\s*\S+\s+-c\s+/, '').replace(/^(["'])([\s\S]*)\1$/, '$2')); return true; }
        if (/\.py$/.test(p[1] || '')) {
          if (files[p[1]] == null) emit(["python: can't open file '" + p[1] + "': [Errno 2] No such file or directory"], null, 0); else pyExec(files[p[1]]);
          return true;
        }
        return false;
      }
      if (/^(notepad|nano|gedit|code|edit|open)$/.test(cmd) && p[1]) { openEd(p[1], files[p[1]]); return true; }
      if (cmd === 'cat' || cmd === 'type') { emit(files[a] != null ? String(files[a]).split('\n') : [cmd + ': ' + a + ': No such file'], null, 0); return true; }
      if (cmd === 'echo') { emit([a], null, 0); return true; }
      if (/^(rm|del)$/.test(cmd)) { if (files[a] != null) delete files[a]; else emit([cmd + ': ' + a + ': No such file'], null, 0); return true; }
      if (cmd === 'help') { emit(['python file.py   run a file (real Python)', 'python -c "print(1+1)"', 'notepad file.py  create or edit a file', 'ls / dir, cat file, echo text, rm file, clear'], null, 0); return true; }
      return false;
    }

    renderOff(); fit();
    /* إيقاف كامل: بيفصل كل المستمعين والمؤقتات ويفضّي الجهاز */
    function destroy() {
      if (dead) return; dead = true; clearT(); clearInterval(tick);
      off.forEach(function (f) { f(); }); off = [];
      if (ro) ro.disconnect(); if (craf) cancelAnimationFrame(craf);
      try { if (document.fullscreenElement === root_ && document.exitFullscreen) document.exitFullscreen(); } catch (e) {}
      kbLock(false); el.innerHTML = '';
    }
    return { destroy: destroy };
  }

  root.PySim = { mount: mount, util: { normCmd: normCmd, cmdOk: cmdOk, codeOk: codeOk, explain: explain, runPy: runPy } };
})(typeof window !== 'undefined' ? window : globalThis);
