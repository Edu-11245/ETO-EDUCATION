/* ===== محاكي الجهاز Eto.Edu PC (Windows 11 / macOS / Ubuntu) لخطوة "تطبيق عملي" =====
   PySim.mount(el, practice, { os, onDone })   practice = { intro, steps:[...], free:{code,say}, done }
   خطوات: { kind:'open' } | { kind:'cmd', say, expect, out:'..'|{win,mac,linux}, hint } | { kind:'code', say, file, expect, hint }
   الرحلة: Open Computer ← فولسكرين ← اختيار النظام ← تحميل ← صوت فتح ← سطح مكتب (This PC / Recycle Bin / About Dev / Terminal)
   v4: تحميل مسبق حقيقي في الكاش وقت البوت | Light/Dark من الإعدادات | خلفيات صور ثابتة (wallpapers/) | تطبيق Eto Search
   v5: ملفات حقيقية (C: نظام للقراءة فقط، D: بحد 1 جيجا محفوظ في المتصفح) + كليك يمين زي الويندوز + محرر Eto Code بتلوين وتشغيل
   تخصيص: window.ETO_SIM.google = { key, cx } (اختياري، عشان نتايج جوجل تظهر جوه Eto Search) | window.ETO_ME = { photo:'..', ... }  |  window.ETO_SIM = { sounds:{ win:'url', mac:'url', linux:'url' } } */
(function (root) {
  var BASE = (function () { var s = document.currentScript; return s && s.src ? s.src.replace(/[^\/]*$/, '') : ''; })();
  if (!document.getElementById('sx-css')) { var lk = document.createElement('link'); lk.id = 'sx-css'; lk.rel = 'stylesheet'; lk.href = BASE + 'sim.css?v=10'; document.head.appendChild(lk); }
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
  /* Python الحقيقية (Pyodide) بتشتغل جوه Web Worker: Stop / Ctrl+C بيقتلوا الـWorker فالتاب مش بيتجمد أبداً.
     input() شغال جوه الترمنال: الكود بيتحول (AST) لـawait على سؤال بيظهر في الترمنال، حتى جوه الدوال. */
  function workerMain() {
    var py = null, inRes = null;
    var PYSRC = [
    "import ast, sys, traceback, inspect, js",
    "",
    "def _own(fn):",
    "    st = list(fn.body)",
    "    while st:",
    "        n = st.pop()",
    "        if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda, ast.ClassDef)):",
    "            continue",
    "        yield n",
    "        st.extend(ast.iter_child_nodes(n))",
    "",
    "def _prep(tree):",
    "    fns = [n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef) and not (n.name.startswith('__') and n.name.endswith('__'))]",
    "    names, mk = set(), set()",
    "    def hit(f):",
    "        if isinstance(f, ast.Name):",
    "            return f.id == 'input' or f.id in names",
    "        if isinstance(f, ast.Attribute):",
    "            return f.attr in names",
    "        return False",
    "    ch = True",
    "    while ch:",
    "        ch = False",
    "        for fn in fns:",
    "            if fn in mk:",
    "                continue",
    "            for n in _own(fn):",
    "                if isinstance(n, ast.Call) and hit(n.func):",
    "                    mk.add(fn); names.add(fn.name); ch = True",
    "                    break",
    "    class T(ast.NodeTransformer):",
    "        def visit_Call(self, n):",
    "            self.generic_visit(n)",
    "            if hit(n.func):",
    "                if isinstance(n.func, ast.Name) and n.func.id == 'input':",
    "                    n.func = ast.Name('__ainput', ast.Load())",
    "                return ast.copy_location(ast.Await(n), n)",
    "            return n",
    "        def visit_FunctionDef(self, n):",
    "            self.generic_visit(n)",
    "            if n in mk:",
    "                return ast.copy_location(ast.AsyncFunctionDef(**{k: getattr(n, k) for k in n._fields}), n)",
    "            return n",
    "    return T().visit(tree)",
    "",
    "_HM = '@@HINT@@ '",
    "",
    "_SYN = [",
    "    (\"was never closed\", \"\u0641\u064a\u0647 \u0642\u0648\u0633 \u0623\u0648 \u0639\u0644\u0627\u0645\u0629 \u0627\u062a\u0641\u062a\u062d\u062a \u0648\u0645\u0627 \u0627\u062a\u0642\u0641\u0644\u062a\u0634. \u0631\u0627\u062c\u0639 \u0627\u0644\u0623\u0642\u0648\u0627\u0633 ( ) [ ] { } \u0641\u064a \u0627\u0644\u0633\u0637\u0631 \u062f\u0647 \u0648\u0627\u0644\u0644\u064a \u0642\u0628\u0644\u0647.\"),",
    "    (\"unterminated string literal\", \"\u0627\u0644\u0646\u0635 \u0645\u0627 \u0627\u062a\u0642\u0641\u0644\u0634. \u0644\u0627\u0632\u0645 \u064a\u0628\u062f\u0623 \u0648\u064a\u0646\u062a\u0647\u064a \u0628\u0646\u0641\u0633 \u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062a\u0646\u0635\u064a\u0635 (\\\" \u0623\u0648 ').\"),",
    "    (\"expected ':'\", \"\u0646\u0627\u0642\u0635 \u0646\u0642\u0637\u062a\u064a\u0646 : \u0641\u064a \u0622\u062e\u0631 \u0627\u0644\u0633\u0637\u0631. \u0628\u0639\u062f if \u0648 for \u0648 while \u0648 def \u0644\u0627\u0632\u0645 \u062a\u0643\u062a\u0628 :\"),",
    "    (\"Missing parentheses in call to 'print'\", \"\u0641\u064a \u0628\u0627\u064a\u062b\u0648\u0646 3 \u0644\u0627\u0632\u0645 print \u0628\u0623\u0642\u0648\u0627\u0633\u060c \u0632\u064a print(\\\"Hello\\\").\"),",
    "    (\"instead of '='\", \"\u0641\u064a \u0627\u0644\u0634\u0631\u0637 \u0627\u0633\u062a\u062e\u062f\u0645 == \u0644\u0644\u0645\u0642\u0627\u0631\u0646\u0629. \u0639\u0644\u0627\u0645\u0629 = \u0628\u062a\u062d\u0637 \u0642\u064a\u0645\u0629 \u0641\u064a \u0645\u062a\u063a\u064a\u0631 \u0628\u0633.\"),",
    "    (\"unmatched ')'\", \"\u0641\u064a\u0647 \u0642\u0648\u0633 \u0642\u0641\u0644 \u0632\u064a\u0627\u062f\u0629 \u0645\u0646 \u063a\u064a\u0631 \u0642\u0648\u0633 \u0641\u062a\u062d.\"),",
    "    (\"cannot assign to\", \"\u0645\u0634 \u064a\u0646\u0641\u0639 \u062a\u062d\u0637 \u0642\u064a\u0645\u0629 \u0641\u064a \u0627\u0644\u062d\u0627\u062c\u0629 \u062f\u064a. \u0639\u0644\u0649 \u0627\u0644\u0634\u0645\u0627\u0644 \u0645\u0646 = \u0644\u0627\u0632\u0645 \u064a\u0628\u0642\u0649 \u0627\u0633\u0645 \u0645\u062a\u063a\u064a\u0631.\"),",
    "    (\"invalid decimal literal\", \"\u0627\u0633\u0645 \u0627\u0644\u0645\u062a\u063a\u064a\u0631 \u0645\u0627 \u064a\u0646\u0641\u0639\u0634 \u064a\u0628\u062f\u0623 \u0628\u0631\u0642\u0645\u060c \u0648\u0645\u0627 \u064a\u0646\u0641\u0639\u0634 \u0641\u064a\u0647 \u0645\u0633\u0627\u0641\u0627\u062a.\"),",
    "]",
    "",
    "def _hint(e):",
    "    m = str(e)",
    "    if isinstance(e, IndentationError):",
    "        if 'expected an indented block' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0628\u0639\u062f \u0627\u0644\u0646\u0642\u0637\u062a\u064a\u0646 : \u0644\u0627\u0632\u0645 \u0627\u0644\u0633\u0637\u0631 \u0627\u0644\u0644\u064a \u0628\u0639\u062f\u0647 \u064a\u0628\u0642\u0649 \u0645\u062a\u0632\u0627\u062d (4 \u0645\u0633\u0627\u0641\u0627\u062a \u0641\u064a \u0623\u0648\u0644\u0647).\"",
    "        if 'unindent' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0645\u0633\u0627\u0641\u0627\u062a \u0641\u064a \u0623\u0648\u0644 \u0627\u0644\u0633\u0637\u0631 \u0645\u0634 \u0645\u062a\u0633\u0627\u0648\u064a\u0629 \u0645\u0639 \u0628\u0627\u0642\u064a \u0627\u0644\u0643\u062a\u0644\u0629. \u062e\u0644\u0651\u064a \u0643\u0644 \u0633\u0637\u0648\u0631 \u0627\u0644\u0643\u062a\u0644\u0629 \u0628\u0646\u0641\u0633 \u0627\u0644\u0625\u0632\u0627\u062d\u0629.\"",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0633\u0637\u0631 \u062f\u0647 \u0645\u062a\u0632\u0627\u062d \u0632\u064a\u0627\u062f\u0629 \u0645\u0646 \u063a\u064a\u0631 \u0633\u0628\u0628. \u0634\u064a\u0644 \u0627\u0644\u0645\u0633\u0627\u0641\u0627\u062a \u0645\u0646 \u0623\u0648\u0644\u0647.\"",
    "    if isinstance(e, SyntaxError):",
    "        msg = getattr(e, 'msg', None) or m",
    "        for k, v in _SYN:",
    "            if k in msg:",
    "                return \"\u062a\u0644\u0645\u064a\u062d: \" + v",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u062c\u0645\u0644\u0629 \u0645\u0643\u062a\u0648\u0628\u0629 \u063a\u0644\u0637. \u0631\u0627\u062c\u0639 \u0627\u0644\u0623\u0642\u0648\u0627\u0633 \u0648\u0639\u0644\u0627\u0645\u0627\u062a \u0627\u0644\u062a\u0646\u0635\u064a\u0635 \u0648\u0627\u0644\u0646\u0642\u0637\u062a\u064a\u0646 \u0648\u0627\u0644\u0645\u0633\u0627\u0641\u0627\u062a \u0641\u064a \u0627\u0644\u0633\u0637\u0631 \u062f\u0647 (\u0648\u0641\u064a \u0627\u0644\u0644\u064a \u0642\u0628\u0644\u0647).\"",
    "    if isinstance(e, UnboundLocalError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0645\u062a\u063a\u064a\u0631 \u062f\u0647 \u0627\u062a\u0633\u062a\u062e\u062f\u0645 \u062c\u0648\u0647 \u0627\u0644\u062f\u0627\u0644\u0629 \u0642\u0628\u0644 \u0645\u0627 \u064a\u0627\u062e\u062f \u0642\u064a\u0645\u0629. \u0625\u062f\u0651\u064a\u0644\u0647 \u0642\u064a\u0645\u0629 \u0627\u0644\u0623\u0648\u0644\u060c \u0623\u0648 \u0644\u0648 \u0639\u0627\u064a\u0632 \u062a\u0639\u062f\u0651\u0644 \u0645\u062a\u063a\u064a\u0631 \u0628\u0631\u0651\u0647 \u0627\u0644\u062f\u0627\u0644\u0629 \u0627\u0643\u062a\u0628 global \u0642\u0628\u0644\u0647.\"",
    "    if isinstance(e, NameError):",
    "        n = getattr(e, 'name', None)",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0627\u0633\u0645\" + (\" '\" + n + \"'\" if n else \"\") + \" \u0645\u0634 \u0645\u0639\u0631\u0651\u0641. \u064a\u0627 \u0625\u0645\u0627 \u0643\u062a\u0628\u062a\u0647 \u063a\u0644\u0637 (\u0628\u0627\u064a\u062b\u0648\u0646 \u0628\u062a\u0641\u0631\u0651\u0642 \u0628\u064a\u0646 \u0627\u0644\u062d\u0631\u0648\u0641 \u0627\u0644\u0643\u0628\u064a\u0631\u0629 \u0648\u0627\u0644\u0635\u063a\u064a\u0631\u0629)\u060c \u064a\u0627 \u0625\u0645\u0627 \u0644\u0627\u0632\u0645 \u062a\u0639\u0631\u0651\u0641\u0647 \u0627\u0644\u0623\u0648\u0644 \u0642\u0628\u0644 \u0645\u0627 \u062a\u0633\u062a\u062e\u062f\u0645\u0647.\"",
    "    if isinstance(e, ZeroDivisionError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0645\u0641\u064a\u0634 \u0642\u0633\u0645\u0629 \u0639\u0644\u0649 \u0635\u0641\u0631. \u0627\u062a\u0623\u0643\u062f \u0625\u0646 \u0627\u0644\u0645\u0642\u0633\u0648\u0645 \u0639\u0644\u064a\u0647 \u0645\u0634 0.\"",
    "    if isinstance(e, IndexError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0641\u0647\u0631\u0633 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0622\u062e\u0631 \u0639\u0646\u0635\u0631. \u0627\u0644\u0639\u062f \u0628\u064a\u0628\u062f\u0623 \u0645\u0646 0\u060c \u0641\u0622\u062e\u0631 \u0639\u0646\u0635\u0631 \u0631\u0642\u0645\u0647 len(\u0627\u0644\u0642\u0627\u0626\u0645\u0629) - 1.\"",
    "    if isinstance(e, KeyError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0645\u0641\u062a\u0627\u062d \u062f\u0647 \u0645\u0634 \u0645\u0648\u062c\u0648\u062f \u0641\u064a \u0627\u0644\u0640dict. \u0627\u062a\u0623\u0643\u062f \u0645\u0646 \u0643\u062a\u0627\u0628\u062a\u0647\u060c \u0623\u0648 \u0627\u0633\u062a\u062e\u062f\u0645 .get() \u0639\u0634\u0627\u0646 \u0645\u0627 \u064a\u0636\u0631\u0628\u0634 \u062e\u0637\u0623.\"",
    "    if isinstance(e, ModuleNotFoundError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0645\u0643\u062a\u0628\u0629 \u062f\u064a \u0645\u0634 \u0645\u0648\u062c\u0648\u062f\u0629 \u0647\u0646\u0627. \u0627\u062a\u0623\u0643\u062f \u0645\u0646 \u0627\u0633\u0645\u0647\u0627\u060c \u0623\u0648 \u0625\u0646\u0647\u0627 \u0645\u0646 \u0627\u0644\u0645\u0643\u062a\u0628\u0627\u062a \u0627\u0644\u0645\u062f\u0645\u062c\u0629 \u0641\u064a \u0628\u0627\u064a\u062b\u0648\u0646.\"",
    "    if isinstance(e, ImportError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0627\u0633\u0645 \u062f\u0647 \u0645\u0634 \u0645\u0648\u062c\u0648\u062f \u062c\u0648\u0647 \u0627\u0644\u0645\u0643\u062a\u0628\u0629. \u0631\u0627\u062c\u0639 \u0643\u062a\u0627\u0628\u062a\u0647.\"",
    "    if isinstance(e, FileNotFoundError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0645\u0644\u0641 \u0645\u0634 \u0645\u0648\u062c\u0648\u062f. \u0627\u062a\u0623\u0643\u062f \u0645\u0646 \u0627\u0644\u0627\u0633\u0645 \u0648\u0645\u0646 \u0625\u0646\u0647 \u0641\u064a \u0646\u0641\u0633 \u0627\u0644\u0645\u0643\u0627\u0646.\"",
    "    if isinstance(e, RecursionError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u062f\u0627\u0644\u0629 \u0628\u062a\u0646\u0627\u062f\u064a \u0646\u0641\u0633\u0647\u0627 \u0645\u0646 \u063a\u064a\u0631 \u0634\u0631\u0637 \u0648\u0642\u0641. \u0644\u0627\u0632\u0645 \u064a\u0628\u0642\u0649 \u0641\u064a\u0647 \u062d\u0627\u0644\u0629 \u0628\u062a\u0648\u0642\u0641 \u0639\u0646\u062f\u0647\u0627.\"",
    "    if isinstance(e, AttributeError):",
    "        return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0643\u0627\u0626\u0646 \u062f\u0647 \u0645\u0639\u0646\u062f\u0648\u0634 \u0627\u0644\u062f\u0627\u0644\u0629 \u0623\u0648 \u0627\u0644\u062e\u0627\u0635\u064a\u0629 \u062f\u064a. \u0627\u062a\u0623\u0643\u062f \u0645\u0646 \u0627\u0644\u0627\u0633\u0645 \u0648\u0645\u0646 \u0646\u0648\u0639 \u0627\u0644\u0643\u0627\u0626\u0646 (str, list, dict ...).\"",
    "    if isinstance(e, ValueError):",
    "        if 'invalid literal for int()' in m or 'could not convert string to float' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0646\u0635 \u0627\u0644\u0644\u064a \u0628\u062a\u062d\u0648\u0651\u0644\u0647 \u0644\u0631\u0642\u0645 \u0645\u0634 \u0631\u0642\u0645 \u0635\u062d\u064a\u062d (\u0645\u0645\u0643\u0646 \u0641\u064a\u0647 \u062d\u0631\u0648\u0641 \u0623\u0648 \u0645\u0633\u0627\u0641\u0627\u062a \u0623\u0648 \u0641\u0627\u0636\u064a).\"",
    "        if 'unpack' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0639\u062f\u062f \u0627\u0644\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0639\u0644\u0649 \u0627\u0644\u0634\u0645\u0627\u0644 \u0645\u0634 \u0632\u064a \u0639\u062f\u062f \u0627\u0644\u0642\u064a\u0645 \u0639\u0644\u0649 \u0627\u0644\u064a\u0645\u064a\u0646.\"",
    "        if 'math domain error' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0642\u064a\u0645\u0629 \u062f\u064a \u062e\u0627\u0631\u062c \u0627\u0644\u0645\u0633\u0645\u0648\u062d \u0644\u0644\u062f\u0627\u0644\u0629 \u0627\u0644\u0631\u064a\u0627\u0636\u064a\u0629 (\u0632\u064a \u0627\u0644\u062c\u0630\u0631 \u0644\u0631\u0642\u0645 \u0633\u0627\u0644\u0628).\"",
    "        return None",
    "    if isinstance(e, TypeError):",
    "        if 'can only concatenate str' in m or ('must be str' in m and 'not int' in m):",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0645\u0634 \u064a\u0646\u0641\u0639 \u062a\u062c\u0645\u0639 \u0646\u0635 \u0645\u0639 \u0631\u0642\u0645. \u062d\u0648\u0651\u0644 \u0627\u0644\u0631\u0642\u0645 \u0628\u0640 str() \u0623\u0648 \u0627\u0633\u062a\u062e\u062f\u0645 f-string.\"",
    "        if 'unsupported operand' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0639\u0645\u0644\u064a\u0629 \u062f\u064a \u0645\u0634 \u0645\u0645\u0643\u0646\u0629 \u0628\u064a\u0646 \u0627\u0644\u0646\u0648\u0639\u064a\u0646 \u062f\u0648\u0644. \u0627\u062a\u0623\u0643\u062f \u0645\u0646 \u0646\u0648\u0639 \u0643\u0644 \u0642\u064a\u0645\u0629 (\u0645\u0645\u0643\u0646 \u062a\u062d\u062a\u0627\u062c int() \u0623\u0648 float()).\"",
    "        if 'object is not callable' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0628\u062a\u062d\u0627\u0648\u0644 \u062a\u0646\u0627\u062f\u064a \u062d\u0627\u062c\u0629 \u0645\u0634 \u062f\u0627\u0644\u0629 \u0628\u0623\u0642\u0648\u0627\u0633 (). \u063a\u0627\u0644\u0628\u0627\u064b \u0633\u0645\u0651\u064a\u062a \u0645\u062a\u063a\u064a\u0631 \u0628\u0627\u0633\u0645 \u062f\u0627\u0644\u0629\u060c \u0623\u0648 \u0646\u0633\u064a\u062a \u0639\u0644\u0627\u0645\u0629 \u0628\u064a\u0646 \u062d\u0627\u062c\u062a\u064a\u0646.\"",
    "        if 'positional argument' in m or 'required argument' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0639\u062f\u062f \u0627\u0644\u0642\u064a\u0645 \u0627\u0644\u0644\u064a \u0628\u0639\u062a\u0651\u0647\u0627 \u0644\u0644\u062f\u0627\u0644\u0629 \u0645\u0634 \u0645\u0637\u0627\u0628\u0642 \u0644\u0644\u064a \u0647\u064a \u0645\u0633\u062a\u0646\u064a\u0627\u0647. \u0631\u0627\u062c\u0639 \u062a\u0639\u0631\u064a\u0641 \u0627\u0644\u062f\u0627\u0644\u0629.\"",
    "        if 'does not support item assignment' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0646\u0635 (str) \u0648\u0627\u0644\u0640tuple \u062b\u0627\u0628\u062a\u064a\u0646\u060c \u0645\u0627 \u064a\u0646\u0641\u0639\u0634 \u062a\u063a\u064a\u0651\u0631 \u0639\u0646\u0635\u0631 \u062c\u0648\u0627\u0647\u0645. \u0627\u0639\u0645\u0644 \u0646\u0633\u062e\u0629 \u062c\u062f\u064a\u062f\u0629.\"",
    "        if 'not subscriptable' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: \u0627\u0644\u0646\u0648\u0639 \u062f\u0647 \u0645\u0627 \u064a\u0646\u0641\u0639\u0634 \u062a\u0633\u062a\u062e\u062f\u0645 \u0639\u0644\u064a\u0647 [ ]. \u0627\u062a\u0623\u0643\u062f \u0625\u0646\u0647 \u0642\u0627\u0626\u0645\u0629 \u0623\u0648 \u0646\u0635 \u0623\u0648 dict.\"",
    "        if 'not iterable' in m:",
    "            return \"\u062a\u0644\u0645\u064a\u062d: for \u0628\u062a\u0644\u0641 \u0639\u0644\u0649 \u0642\u0627\u0626\u0645\u0629 \u0623\u0648 \u0646\u0635 \u0623\u0648 range \u0628\u0633. \u0627\u0644\u0631\u0642\u0645 \u0644\u0648\u062d\u062f\u0647 \u0645\u0627 \u064a\u0646\u0641\u0639\u0634\u060c \u062c\u0631\u0651\u0628 range(\u0627\u0644\u0631\u0642\u0645).\"",
    "        return None",
    "    return None",
    "",
    "async def __eto_run(src, fname):",
    "    g = {'__name__': '__main__', '__file__': fname}",
    "    async def _ai(p=''):",
    "        sys.stdout.flush()",
    "        return await js.etoAsk(str(p))",
    "    g['__ainput'] = _ai",
    "    try:",
    "        tree = ast.parse(src, fname)",
    "        if 'input' in src:",
    "            tree = _prep(tree)",
    "        ast.fix_missing_locations(tree)",
    "        code = compile(tree, fname, 'exec', flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)",
    "        r = eval(code, g)",
    "        if inspect.iscoroutine(r):",
    "            await r",
    "    except SystemExit:",
    "        pass",
    "    except BaseException as e:",
    "        tb = e.__traceback__",
    "        while tb is not None and tb.tb_frame.f_code.co_filename != fname:",
    "            tb = tb.tb_next",
    "        sys.stdout.flush()",
    "        sys.stderr.write(''.join(traceback.format_exception(type(e), e, tb)))",
    "        sys.stderr.flush()",
    "        hh = _hint(e)",
    "        if hh:",
    "            sys.stderr.write(_HM + hh + '\\n'); sys.stderr.flush()",
    "    sys.stdout.flush()",
    "",
    "import code",
    "",
    "class _Ex:",
    "    def __repr__(self):",
    "        return 'Use exit() or Ctrl-D (i.e. EOF) to exit'",
    "    def __call__(self, *a):",
    "        raise SystemExit",
    "",
    "class _Con(code.InteractiveConsole):",
    "    def _h(self):",
    "        hh = _hint(sys.exc_info()[1])",
    "        if hh:",
    "            sys.stderr.write(_HM + hh + '\\n')",
    "    def showtraceback(self):",
    "        super().showtraceback(); self._h()",
    "    def showsyntaxerror(self, *a, **k):",
    "        super().showsyntaxerror(*a, **k); self._h()",
    "",
    "_con = None",
    "",
    "def __eto_repl_start():",
    "    global _con",
    "    g = {'__name__': '__main__', '__doc__': None}",
    "    def _noin(*a):",
    "        raise EOFError('input() is not supported in the shell yet - run it from a file: python file.py')",
    "    g['input'] = _noin",
    "    g['exit'] = g['quit'] = _Ex()",
    "    _con = _Con(g)",
    "",
    "def __eto_repl(line):",
    "    try:",
    "        more = _con.push(line)",
    "    except SystemExit:",
    "        return 'exit'",
    "    sys.stdout.flush(); sys.stderr.flush()",
    "    return 'more' if more else 'ok'",
    "",
    "def __eto_repl_reset():",
    "    _con.resetbuffer()"
    ].join('\n');
    self.etoAsk = function (p) { return new Promise(function (r) { inRes = r; postMessage({ t: 'in', s: String(p) }); }); };
    function fail(er) { postMessage({ t: 'fatal', s: String(er && er.message || er) }); }
    self.onmessage = function (e) {
      var m = e.data;
      if (m.t === 'init') {
        try {
          importScripts(m.base + 'pyodide.js');
          loadPyodide({ indexURL: m.base }).then(function (p) {
            py = p;
            py.setStdout({ batched: function (x) { postMessage({ t: 'out', s: x }); } });
            py.setStderr({ batched: function (x) { postMessage({ t: 'err', s: x }); } });
            py.setStdin({ stdin: function () { return null; } });
            py.runPython(PYSRC);
            postMessage({ t: 'ready' });
          }).catch(fail);
        } catch (er) { fail(er); }
      } else if (m.t === 'run') {
        var done = function () { postMessage({ t: 'done' }); };
        try {
          py.globals.get('__eto_run')(m.code, m.name).then(done, function (er) { postMessage({ t: 'err', s: String(er && er.message || er) }); done(); });
        } catch (er) { postMessage({ t: 'err', s: String(er) }); done(); }
      } else if (m.t === 'repl-init') {
        py.globals.get('__eto_repl_start')();
      } else if (m.t === 'repl') {
        var rr; try { rr = py.globals.get('__eto_repl')(m.s); } catch (er) { postMessage({ t: 'err', s: String(er && er.message || er) }); rr = 'ok'; }
        postMessage({ t: 'done', r: rr });
      } else if (m.t === 'repl-reset') {
        py.globals.get('__eto_repl_reset')();
      } else if (m.t === 'ans') {
        if (inRes) { var r = inRes; inRes = null; r(m.s); }
      }
    };
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

  /* ---------- اللغات (محرر Eto Code): كل لغة جديدة بتتضاف هنا بس ----------
     run:'py' = بتتشغّل فعلاً. باقي اللغات: تلوين + حفظ، والتشغيل بيتفعّل لما كورسها ينزل. */
  var LANG_ORDER = ['py', 'js', 'html', 'css', 'java', 'cpp', 'c', 'cs', 'txt'];
  var setOf = function (s) { var o = {}; s.split(' ').forEach(function (w) { if (w) o[w] = 1; }); return o; };
  var LANGS = {
    py: { name: 'Python', label: 'Python File', def: 'main.py', exts: ['py', 'pyw'], ic: 'b:python', col: '#60a5fa', run: 'py', hash: 1, py: 1,
      kw: setOf('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case'),
      bi: setOf('print input len range int str float list dict set tuple bool type open sum min max abs sorted enumerate zip map filter isinstance round self cls super object') },
    js: { name: 'JavaScript', label: 'JavaScript File', def: 'script.js', exts: ['js', 'mjs', 'json'], ic: 'b:js', col: '#facc15', bt: 1,
      kw: setOf('break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return super switch this throw try typeof var void while with yield async await null true false undefined'),
      bi: setOf('console document window Math JSON Array Object String Number Promise Date parseInt parseFloat setTimeout fetch') },
    html: { name: 'HTML', label: 'HTML File', def: 'index.html', exts: ['html', 'htm'], ic: 'b:html5', col: '#fb923c', markup: 1, kw: {}, bi: {} },
    css: { name: 'CSS', label: 'CSS File', def: 'style.css', exts: ['css'], ic: 'b:css3-alt', col: '#38bdf8', css: 1,
      kw: setOf('important auto none block flex grid inline absolute relative fixed solid bold normal center'), bi: {} },
    java: { name: 'Java', label: 'Java File', def: 'Main.java', exts: ['java'], ic: 'b:java', col: '#f87171',
      kw: setOf('abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new null package private protected public return short static super switch this throw throws true false try void while'),
      bi: setOf('String System Math Integer List ArrayList Scanner Object') },
    cpp: { name: 'C++', label: 'C++ File', def: 'main.cpp', exts: ['cpp', 'cc', 'hpp'], ic: 'file-code', col: '#a78bfa',
      kw: setOf('auto bool break case catch char class const continue default delete do double else enum explicit extern false float for friend goto if inline int long namespace new nullptr operator private protected public return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while'),
      bi: setOf('std cout cin endl string vector map printf scanf include define') },
    c: { name: 'C', label: 'C File', def: 'main.c', exts: ['c', 'h'], ic: 'file-code', col: '#94a3b8',
      kw: setOf('auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while'),
      bi: setOf('printf scanf malloc free include define NULL') },
    cs: { name: 'C#', label: 'C# File', def: 'Program.cs', exts: ['cs'], ic: 'file-code', col: '#c084fc',
      kw: setOf('abstract bool break byte case catch char class const continue decimal default do double else enum false finally float for foreach if int interface long namespace new null object override private protected public readonly return static string struct switch this throw true try using var virtual void while'),
      bi: setOf('Console Math List String Main') },
    txt: { name: 'Plain Text', label: 'Text Document', def: 'notes.txt', exts: ['txt', 'md', 'log', 'csv'], ic: 'file-lines', col: '#cbd5e1', kw: {}, bi: {} }
  };
  var TEXTX = /\.(py|pyw|js|mjs|json|html?|css|java|c|h|cpp|cc|hpp|cs|txt|md|csv|log|xml|ya?ml|ini|sh|bat|ts|sql)$/i;
  function langOf(name) {
    var e = String(name || '').toLowerCase().split('.').pop();
    for (var j = 0; j < LANG_ORDER.length; j++) if (LANGS[LANG_ORDER[j]].exts.indexOf(e) >= 0) return LANGS[LANG_ORDER[j]];
    return LANGS.txt;
  }
  function fileIc(name, dir) {
    if (dir) return ['folder', '#fbbf24'];
    var L = langOf(name), e = String(name).toLowerCase().split('.').pop();
    if (L !== LANGS.txt || /^(txt|md|log|csv)$/.test(e)) return [L.ic, L.col];
    if (/^(png|jpe?g|gif|webp|svg|bmp|avif)$/.test(e)) return ['file-image', '#c084fc'];
    if (/^(mp3|wav|ogg)$/.test(e)) return ['file-audio', '#fb7185'];
    if (/^(mp4|webm|mkv)$/.test(e)) return ['file-video', '#f472b6'];
    if (/^(zip|rar|7z|gz)$/.test(e)) return ['file-zipper', '#fbbf24'];
    if (e === 'pdf') return ['file-pdf', '#f87171'];
    return ['file', '#9ca3af'];
  }
  var R_CM_H = /#[^\n]*/, R_CM_C = /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/, R_CM_CSS = /\/\*[\s\S]*?(?:\*\/|$)/, R_CM_HT = /<!--[\s\S]*?(?:-->|$)/;
  var R_ST_PY = /"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/;
  var R_ST_C = /"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/, R_ST_JS = /`(?:\\[\s\S]|[^`\\])*`?|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/;
  var R_NUM = /\b(?:0x[\da-fA-F]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/, R_WORD = /[A-Za-z_$][\w$]*/;
  function mkRe(L) {
    var cm = L.hash ? R_CM_H : L.markup ? R_CM_HT : L.css ? R_CM_CSS : R_CM_C, st = L.py ? R_ST_PY : L.bt ? R_ST_JS : R_ST_C;
    var sp = L.py ? /@[A-Za-z_][\w.]*/ : L.markup ? /<\/?[A-Za-z][\w:-]*|\/?>/ : /(?!)/;
    return new RegExp('(' + cm.source + ')|(' + st.source + ')|(' + sp.source + ')|(' + R_NUM.source + ')|(' + R_WORD.source + ')', 'g');
  }
  function hl(code, L) {
    if (!L || code.length > 150000) return esc(code);
    var re = L.re || (L.re = mkRe(L)), out = '', last = 0, m, t;
    re.lastIndex = 0;
    while ((m = re.exec(code))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += esc(code.slice(last, m.index));
      t = m[1] != null ? 'c' : m[2] != null ? 's' : m[3] != null ? 'd' : m[4] != null ? 'n' : L.kw[m[5]] ? 'k' : L.bi[m[5]] ? 'b' : code.charAt(re.lastIndex) === '(' ? 'f' : '';
      out += t ? '<span class="tk-' + t + '">' + esc(m[0]) + '</span>' : esc(m[0]);
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  /* ---------- نظام الملفات: C: للنظام بس (قراءة فقط) و D: قرص حقيقي 1 جيجا ----------
     D: بيتخزن في IndexedDB بتاع المتصفح (ملفات حقيقية ومحفوظة)، وأي كتابة بتتحسب بالبايت وبتتمنع لما توصل 1 جيجا. */
  var D_CAP = 1073741824;
  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    var u = ['KB', 'MB', 'GB'], i = -1;
    do { b /= 1024; i++; } while (b >= 1024 && i < 2);
    return (b < 10 ? b.toFixed(1) : Math.round(b)) + ' ' + u[i];
  }
  function idb() {
    if (root.__etoIdb) return root.__etoIdb;
    root.__etoIdb = new Promise(function (res) {
      try {
        var q = indexedDB.open('eto_sim_fs', 1);
        q.onupgradeneeded = function () { var d = q.result; d.createObjectStore('meta'); d.createObjectStore('blob'); };
        q.onsuccess = function () { res(q.result); };
        q.onerror = q.onblocked = function () { res(null); };
      } catch (e) { res(null); }
    });
    return root.__etoIdb;
  }
  function idbReq(db, store, mode, fn) {
    return new Promise(function (res, rej) {
      var tx = db.transaction(store, mode), r = fn(tx.objectStore(store));
      tx.oncomplete = function () { res(r && r.result); };
      tx.onerror = tx.onabort = function () { rej(tx.error || new Error('idb')); };
    });
  }
  function sizeOf(c) { return typeof c === 'string' ? (root.TextEncoder ? new TextEncoder().encode(c).length : c.length) : (c && c.size) || 0; }
  function makeFS(persist) {
    var F = { m: { nodes: {}, nid: 1, used: 0 }, mem: {}, db: null, vol: !persist, tmr: 0 }, inited = null;
    var err = function (code) { var e = new Error(code); e.code = code; return e; };
    F.err = err;
    function saveMeta() {
      if (!F.db) return; clearTimeout(F.tmr);
      F.tmr = setTimeout(function () { idbReq(F.db, 'meta', 'readwrite', function (s) { return s.put(F.m, 'm'); }).catch(function () {}); }, 80);
    }
    function bPut(id, v) {
      if (!F.db) { F.mem[id] = v; return Promise.resolve(); }
      return idbReq(F.db, 'blob', 'readwrite', function (s) { return s.put(v, id); }).catch(function () { throw err('quota'); });
    }
    function bGet(id) { return F.db ? idbReq(F.db, 'blob', 'readonly', function (s) { return s.get(id); }) : Promise.resolve(F.mem[id]); }
    function bDel(id) { if (!F.db) { delete F.mem[id]; return Promise.resolve(); } return idbReq(F.db, 'blob', 'readwrite', function (s) { return s.delete(id); }).catch(function () {}); }
    function vn(n) {
      n = String(n == null ? '' : n).trim();
      if (!n || n === '.' || n === '..' || n.length > 120 || /[\\\/:*?"<>|]/.test(n) || /[. ]$/.test(n)) throw err('name');
      return n;
    }
    function reg(pid, name, t, size) {
      var id = 'n' + (F.m.nid++), x = Date.now();
      return (F.m.nodes[id] = { id: id, n: name, t: t, p: pid, s: size || 0, m: x, c: x });
    }
    F.get = function (id) { return F.m.nodes[id] || null; };
    F.kids = function (pid) {
      var o = [], a = F.m.nodes;
      for (var k in a) if (a[k].p === pid && !a[k].del) o.push(a[k]);
      return o.sort(function (x, y) { return x.t !== y.t ? (x.t === 'd' ? -1 : 1) : x.n.localeCompare(y.n, undefined, { numeric: true, sensitivity: 'base' }); });
    };
    F.bin = function () { var o = []; for (var k in F.m.nodes) if (F.m.nodes[k].del) o.push(F.m.nodes[k]); return o.sort(function (a, b) { return b.del - a.del; }); };
    F.find = function (pid, name) {
      var l = String(name).toLowerCase(), a = F.kids(pid);
      for (var j = 0; j < a.length; j++) if (a[j].n.toLowerCase() === l) return a[j];
      return null;
    };
    F.has = function (pid, name, skip) { var n = F.find(pid, name); return !!n && n.id !== skip; };
    F.uniq = function (pid, name) {
      var base = name, ext = '', i = name.lastIndexOf('.'), n = name, c = 2;
      if (i > 0) { base = name.slice(0, i); ext = name.slice(i); }
      while (F.has(pid, n)) n = base + ' (' + (c++) + ')' + ext;
      return n;
    };
    F.live = function (id) { while (id) { var n = F.m.nodes[id]; if (!n || n.del) return false; id = n.p; } return true; };
    F.under = function (id, anc) { while (id) { if (id === anc) return true; var n = F.m.nodes[id]; id = n && n.p; } return false; };
    F.parts = function (id) { var o = []; while (id && id !== 'r') { var n = F.m.nodes[id]; if (!n) break; o.unshift(n.n); id = n.p; } return o; };
    F.path = function (id) { return 'D:/' + F.parts(id).join('/'); };
    F.desk = function () {
      var d = F.find('r', 'Desktop');
      if (!d || d.t !== 'd') { d = reg('r', F.uniq('r', 'Desktop'), 'd'); saveMeta(); }
      return d.id;
    };
    F.free = function () { return Math.max(0, D_CAP - F.m.used); };
    F.mkdir = function (pid, name) {
      name = vn(name); if (!F.m.nodes[pid]) throw err('nf'); if (F.has(pid, name)) throw err('exists');
      var n = reg(pid, name, 'd'); saveMeta(); return n;
    };
    F.mkfile = function (pid, name, content) {
      try { name = vn(name); } catch (e) { return Promise.reject(e); }
      if (!F.m.nodes[pid]) return Promise.reject(err('nf'));
      if (F.has(pid, name)) return Promise.reject(err('exists'));
      var sz = sizeOf(content); if (F.m.used + sz > D_CAP) return Promise.reject(err('space'));
      var id = 'n' + (F.m.nid++);
      return bPut(id, content).then(function () {
        var x = Date.now(), n = F.m.nodes[id] = { id: id, n: name, t: 'f', p: pid, s: sz, m: x, c: x, b: typeof content === 'string' ? 0 : 1 };
        F.m.used += sz; saveMeta(); return n;
      });
    };
    F.write = function (id, content) {
      var n = F.m.nodes[id]; if (!n || n.t !== 'f') return Promise.reject(err('nf'));
      var sz = sizeOf(content); if (F.m.used - n.s + sz > D_CAP) return Promise.reject(err('space'));
      return bPut(id, content).then(function () { F.m.used += sz - n.s; n.s = sz; n.m = Date.now(); saveMeta(); return n; });
    };
    F.read = function (id) { return bGet(id); };
    F.readText = function (id) {
      return bGet(id).then(function (c) { return c == null ? '' : typeof c === 'string' ? c : c.text ? c.text() : ''; });
    };
    F.rename = function (id, name) {
      var n = F.m.nodes[id]; if (!n) throw err('nf'); name = vn(name);
      if (F.has(n.p, name, id)) throw err('exists'); n.n = name; n.m = Date.now(); saveMeta(); return n;
    };
    F.move = function (id, pid, name) {
      var n = F.m.nodes[id]; if (!n || !F.m.nodes[pid]) throw err('nf');
      if (n.t === 'd' && F.under(pid, id)) throw err('self');
      var nm = name == null ? n.n : vn(name);
      if (name != null ? F.has(pid, nm, id) : (n.p !== pid && F.has(pid, nm))) { if (name != null) throw err('exists'); nm = F.uniq(pid, nm); }
      n.p = pid; n.n = nm; n.m = Date.now(); saveMeta(); return n;
    };
    F.copy = function (id, pid, name) {
      var n = F.m.nodes[id]; if (!n) return Promise.reject(err('nf'));
      var nm = name == null ? F.uniq(pid, n.n) : name;
      if (n.t === 'f') return F.read(id).then(function (c) { return F.mkfile(pid, nm, c == null ? '' : c); });
      if (F.under(pid, id)) return Promise.reject(err('self'));
      var d; try { d = F.mkdir(pid, nm); } catch (e) { return Promise.reject(e); }
      return F.kids(id).reduce(function (p, k) { return p.then(function () { return F.copy(k.id, d.id); }); }, Promise.resolve()).then(function () { return d; });
    };
    F.trash = function (id) { var n = F.m.nodes[id]; if (!n || id === 'r') throw err('nf'); n.del = Date.now(); saveMeta(); };
    F.restore = function (id) {
      var n = F.m.nodes[id]; if (!n) throw err('nf');
      if (!F.live(n.p)) n.p = 'r';
      n.n = F.uniq(n.p, n.n); delete n.del; saveMeta(); return n;
    };
    F.purge = function (id) {
      var a = F.m.nodes, ids = [id], j = 0, k, freed = 0;
      while (j < ids.length) { for (k in a) if (a[k].p === ids[j]) ids.push(k); j++; }
      return Promise.all(ids.map(function (x) { var n = a[x]; if (n && n.t === 'f') { freed += n.s; return bDel(x); } return null; })).then(function () {
        ids.forEach(function (x) { delete a[x]; }); F.m.used = Math.max(0, F.m.used - freed); saveMeta();
      });
    };
    F.empty = function () { return F.bin().reduce(function (p, n) { return p.then(function () { return F.purge(n.id); }); }, Promise.resolve()); };
    F.size = function (id) { var n = F.m.nodes[id]; if (!n) return 0; if (n.t === 'f') return n.s; return F.kids(id).reduce(function (s, k) { return s + F.size(k.id); }, 0); };
    F.count = function (id) { var c = { f: 0, d: 0 }; F.kids(id).forEach(function (k) { if (k.t === 'f') c.f++; else { c.d++; var q = F.count(k.id); c.f += q.f; c.d += q.d; } }); return c; };
    /* مسار → id. بيقبل D:\a\b و /a/b و a/b و .. و مسارات لينكس/ماك الوهمية */
    F.resolve = function (str, cwd, osn) {
      var s = String(str == null ? '' : str).trim().replace(/\\/g, '/'), cur = cwd || 'r', abs = false;
      if (/^[A-Za-z]:/.test(s)) { if (s.charAt(0).toUpperCase() !== 'D') return 'denied'; s = s.slice(2); abs = true; }
      var pre = osn === 'mac' ? /^\/Volumes\/Eto\.Edu(?=\/|$)/i : osn === 'linux' ? /^\/mnt\/eto(?=\/|$)/i : null;
      if (pre && pre.test(s)) { s = s.replace(pre, ''); abs = true; } else if (s.charAt(0) === '/') { if (osn !== 'win') return 'denied'; abs = true; }
      if (abs) cur = 'r';
      var ps = s.split('/');
      for (var j = 0; j < ps.length; j++) {
        var p = ps[j]; if (!p || p === '.') continue;
        if (p === '..') { var n = F.m.nodes[cur]; cur = (n && n.p) || 'r'; continue; }
        var c = F.find(cur, p); if (!c) return null; cur = c.id;
      }
      return cur;
    };
    F.init = function () {
      if (inited) return inited;
      inited = (persist ? idb() : Promise.resolve(null)).then(function (db) {
        F.db = db; F.vol = !db;
        return db ? idbReq(db, 'meta', 'readonly', function (s) { return s.get('m'); }).catch(function () { return null; }) : null;
      }).then(function (m) {
        if (m && m.nodes) F.m = m;
        if (!F.m.nodes.r) { var x = Date.now(); F.m.nodes.r = { id: 'r', n: 'D:', t: 'd', p: null, s: 0, m: x, c: x }; }
        var u = 0; for (var k in F.m.nodes) if (F.m.nodes[k].t === 'f') u += F.m.nodes[k].s;
        F.m.used = u; F.desk();
        try { if (persist && navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
        /* ملفات النسخة القديمة (كانت في localStorage) بتتنقل لـ D: مرة واحدة */
        if (!persist) return;
        var old; try { old = JSON.parse(localStorage.getItem('eto_sim_files') || '{}'); } catch (e) { old = {}; }
        var ks = Object.keys(old || {}).filter(function (n) { return typeof old[n] === 'string'; });
        if (!ks.length) return;
        return ks.reduce(function (p, n) { return p.then(function () { return F.has('r', n) ? null : F.mkfile('r', n, old[n]).catch(function () {}); }); }, Promise.resolve())
          .then(function () { try { localStorage.removeItem('eto_sim_files'); } catch (e) {} });
      }).then(function () { return F; });
      return inited;
    };
    return F;
  }
  /* شجرة C: (للقراءة بس). النص = حجم ملف، الأوبجكت = فولدر */
  var CT = {
    win: { 'Windows': { 'System32': { 'kernel32.dll': '740 KB', 'ntdll.dll': '2.1 MB', 'cmd.exe': '289 KB', 'drivers': {}, 'config': {} }, 'Fonts': {}, 'Boot': {}, 'Temp': {} },
      'Program Files': { 'Eto.Edu': { 'EtoSim.exe': '38 MB' }, 'Python312': { 'python.exe': '103 KB', 'pythonw.exe': '101 KB' } }, 'Program Files (x86)': {}, 'ProgramData': {},
      'Users': { 'you': { 'Desktop': {}, 'Documents': {}, 'Downloads': {}, 'Pictures': {} }, 'Public': {} }, 'bootmgr': '414 KB', 'pagefile.sys': '4 GB' },
    mac: { 'System': { 'Library': {}, 'Applications': {} }, 'Library': {}, 'Applications': { 'Terminal.app': {}, 'Safari.app': {}, 'Eto Code.app': {} }, 'Users': { 'you': { 'Desktop': {}, 'Documents': {}, 'Downloads': {} } }, 'usr': { 'bin': {}, 'lib': {} }, 'bin': {}, 'private': {} },
    linux: { 'bin': {}, 'boot': { 'vmlinuz': '14 MB', 'grub': {} }, 'etc': { 'hostname': '7 B', 'passwd': '2 KB', 'fstab': '1 KB' }, 'home': { 'you': {} }, 'lib': {}, 'usr': { 'bin': {}, 'lib': {}, 'share': {} }, 'var': { 'log': {} }, 'mnt': {} }
  };
  var DRV = { win: ['Local Disk (C:)', 'Eto.Edu (D:)'], mac: ['Macintosh HD', 'Eto.Edu'], linux: ['Filesystem Root', 'Eto.Edu'] };
  function errMsg(e) {
    var c = e && e.code;
    return c === 'space' ? 'There is not enough space on Eto.Edu (D:). The drive size is 1 GB.'
      : c === 'quota' ? 'The browser refused to store more data. Free some browser storage and try again.'
      : c === 'exists' ? 'An item with that name already exists in this location.'
      : c === 'name' ? 'That name is not valid. A name can\'t be empty or contain  \\ / : * ? " < > |'
      : c === 'self' ? 'You can\'t copy or move a folder into itself.'
      : c === 'bin' ? 'This type of file can\'t be opened in Eto Code.'
      : 'The item could not be found.';
  }

  /* ---------- المحاكي ---------- */
  function mount(el, P, opts) {
    opts = opts || {};
    var steps = (P.steps || []).slice();
    var pureFree = !(P.steps || []).length; /* من غير خطوات = استخدام حر */
    if (pureFree) steps = []; else if (steps[0].kind !== 'open') steps.unshift({ kind: 'open', say: 'ده سطح مكتب الجهاز. دوس على أيقونة **Terminal** عشان تفتحها.' });
    var os = opts.os || 'win', lang = 'en', i = 0, tries = 0, tr = [], cmdH = [], hp = 0, files = {}, wopen = {}, dirty = false, phase = 'off', sel = '';
    var W = 1000, H = 625; /* مقاس الشاشة الوهمية: ثابت في الدرس، وفي وضع الصفحة بيتحسب على مقاس شاشة المستخدم */
    var freeMode = pureFree, metaDown = false, metaUsed = false;
    var wk = null, wkReady = null, wkUrl = null, running = false, asking = false, askP = '', pyLoaded = false, repl = false, replP = '>>> ';
    /* وضع حر: D: قرص حقيقي محفوظ في المتصفح. وضع الدرس: نفس الشكل بس في الذاكرة */
    var vfs = makeFS(pureFree), vfsOn = pureFree, vfsReady = false, cwd = 'r', clip = null, edId = null, edDir = null, edName = '', edL = LANGS.py, cmReg = [], deskSel = [], upPid = 'r';
    var EX = { pc: { loc: 'pc', h: ['pc'], hi: 0, sel: [], q: '', items: [] }, bin: { loc: 'bin', h: ['bin'], hi: 0, sel: [], q: '', items: [] } };
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
    function shutdown() { clearT(); busy = false; pending = null; wopen = {}; tr = []; headDone = false; cmdH = []; sel = ''; i = 0; tries = 0; stopRun(true); files = {}; dirty = false; cwd = 'r'; clip = null; deskSel = []; edId = null; edDir = null; edName = ''; EX.pc.loc = 'pc'; EX.pc.h = ['pc']; EX.pc.hi = 0; EX.pc.sel = []; EX.bin.sel = []; renderOff(); }

    /* ---- مرحلة 3: سطح المكتب ---- */
    var PROMPT = function () {
      if (vfsOn && vfsReady) { var p = shPath(cwd); return os === 'win' ? 'PS ' + esc(p) + '&gt; ' : os === 'mac' ? 'you@MacBook ' + esc(cwd === 'r' ? 'Eto.Edu' : vfs.get(cwd).n) + ' % ' : '<span class="g">you@ubuntu</span>:<span class="b">' + esc(p) + '</span>$ '; }
      return os === 'win' ? 'PS C:\\Users\\you&gt; ' : os === 'mac' ? 'you@MacBook ~ % ' : '<span class="g">you@ubuntu</span>:<span class="b">~</span>$ ';
    };
    var EDNAME = { win: 'Eto Code', mac: 'Eto Code', linux: 'Eto Code' };
    function nm(a) { return a === 'ed' ? EDNAME[os] : a === 'about' ? 'About Dev' : a === 'term' ? 'Terminal' : a === 'search' ? 'Eto Search' : NAMES[os][a]; }
    function aic(a) { return a === 'ed' ? ['code', '#a78bfa'] : a === 'term' ? ['terminal', 'var(--ic-term)'] : a === 'search' ? ['magnifying-glass', 'var(--ic-search)'] : a === 'pc' ? [os === 'win' ? 'desktop' : os === 'mac' ? 'hard-drive' : 'house', 'var(--ic-pc)'] : a === 'about' ? ['folder-open', 'var(--ic-about)'] : a === 'bin' ? ['trash-can', 'var(--ic-bin)'] : ['gear', 'var(--ic-set)']; }
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
      return xp(nm('pc'), '<div class="sx-xb"><div class="sx-myf"></div><h4>Folders (6)</h4><div class="sx-fg">' + fol.map(function (f) { return '<div class="sx-f"><span style="color:' + f[2] + '">' + ic(f[1]) + '</span>' + f[0] + '</div>'; }).join('') +
        '</div><h4>Devices and drives (2)</h4><div class="sx-dg">' + drv.map(function (d) { return '<div class="sx-drv">' + ic('hard-drive') + '<div><b>' + d[0] + '</b><div class="bar"><i style="width:' + d[1] + '%"></i></div><small>' + d[2] + '</small></div></div>'; }).join('') + '</div></div>', '8 items');
    }
    function binBody() { return xp(nm('bin'), '<div class="sx-xb sx-empty">' + ic('trash-can') + '<p>This folder is empty</p></div>', '0 items'); }
    function setBody() { return '<div class="sx-sb"><div class="sx-sl"><div class="sx-prev"></div><b>Personalization</b><small>Mode and background</small><div class="sx-th"><small>Choose your mode</small><div class="sx-seg"><button data-th="light">' + ic('sun') + ' Light</button><button data-th="dark">' + ic('moon') + ' Dark</button></div></div></div><div class="sx-sg"></div><input type="file" accept="image/*" hidden class="sx-file"></div>'; }

    function renderDesktop() {
      phase = 'on'; clearT(); lastClk = ''; sc.className = 'sx-screen sx-' + os + (theme === 'light' ? ' sx-light' : '');
      var top = os === 'mac' ? '<div class="sx-top"><span class="sx-l"><button class="sx-tray" data-sm>' + ic('b:apple') + '</button><b>Terminal</b><span>Shell</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></span><span class="sx-r">' + tray() + '<span class="sx-clk" data-clk></span></span></div>'
        : os === 'linux' ? '<div class="sx-top"><span class="sx-l"><button class="sx-tray" data-sm><b>Activities</b></button></span><span class="sx-clk sx-c" data-clk></span><span class="sx-r">' + tray() + '</span></div>' : '';
      var dock = os === 'win' ? '<div class="sx-bar"><span class="sx-bc"><span class="sx-st" data-sm>' + WINLOGO + '</span>' + appIco('search') + appIco('term') + appIco('ed') + appIco('pc') + appIco('set') + '</span>' +
          '<span class="sx-br"><i class="fa-solid fa-chevron-up sx-chev"></i>' + tray() + '<button class="sx-clk" data-clk></button></span></div>'
        : '<div class="sx-dock">' + appIco('pc') + appIco('term') + appIco('ed') + appIco('search') + appIco('about') + appIco('set') + '</div>';
      var win = function (c, a, t, body, isT) { return '<div class="sx-w sx-' + c + '" data-w="' + a + '">' + head(t, isT) + body + '</div>'; };
      var icons = deskIcons();
      var apps = ['term', 'ed', 'search', 'pc', 'about', 'set', 'bin'].map(function (a) { var c = aic(a); return '<button class="sx-ap" data-app="' + a + '"><span style="color:' + c[1] + '"><i class="fa-solid fa-' + c[0] + '"></i></span><em>' + nm(a) + '</em></button>'; }).join('');
      ui.innerHTML = '<div class="sx-wall"></div>' + top + '<div class="sx-desk"><div class="sx-dis">' + icons + '</div>' +
        win('term', 'term', os === 'mac' ? 'you — -zsh — 80×24' : os === 'linux' ? 'you@ubuntu: ~' : '', '<div class="sx-tb" dir="ltr"><div class="sx-stw"><button class="sx-stop" type="button" title="Ctrl+C"><i class="fa-solid fa-stop"></i> Stop</button></div><div class="sx-lines"></div><div class="sx-inl"><span class="sx-p">' + PROMPT() + '</span><input class="sx-in" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="terminal"></div></div>', 1) +
        win('ed', 'ed', '<span class="sx-fn">untitled.py</span>' + ' - ' + EDNAME[os], edBody()) +
        win('about', 'about', ic('folder-open') + ' About Dev', aboutBody()) + win('pc', 'pc', ic('folder') + ' ' + nm('pc'), exSkel('pc')) + win('bin', 'bin', ic('trash-can') + ' ' + nm('bin'), exSkel('bin')) + win('set', 'set', ic('gear') + ' ' + nm('set'), setBody()) + win('search', 'search', ic('magnifying-glass') + ' Eto Search', searchBody()) +
        '</div>' + dock +
        '<div class="sx-sm"><div class="sx-smh">' + logo(26) + '<b>Eto<span>.Edu</span></b><small>Pinned</small></div><div class="sx-smg">' + apps + '</div>' +
        '<div class="sx-smf"><span class="sx-usr"><i>E</i> Eto</span><button class="sx-pwr" data-act="off" title="Shut down"><i class="fa-solid fa-power-off"></i></button></div></div>' +
        '<div class="sx-cm"></div><input type="file" multiple hidden class="sx-up">' +
        '<div class="sx-fly"><div class="sx-tiles"><button data-tile="wifi" class="' + (wifi ? 'on' : '') + '"><i class="fa-solid fa-wifi"></i><span>Wi-Fi</span></button><button class="on"><i class="fa-brands fa-bluetooth-b"></i><span>Bluetooth</span></button><button><i class="fa-solid fa-plane"></i><span>Airplane</span></button></div>' +
        '<div class="sx-vrow"><i class="fa-solid fa-' + volIc() + '" data-vi2></i><input type="range" min="0" max="100" value="' + vol + '" class="sx-vr"></div></div>';
      $('.sx-pw').style.display = '';
      bind(); exInit(); replay(); updClock(); applyWall(); mark(); task(); ghost();
      vfs.init().then(function () { vfsReady = true; if (!alive() || phase !== 'on') return; refreshPrompt(); refreshAll(); });
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
      var w = $('.sx-' + a); if (!w) return; closeMenus(); wopen[a] = true; w.classList.add('show'); front(w); mark(); if (a === 'set') wpGrid(); if (a === 'pc' || a === 'bin') exDraw(a); if (a === 'search') tmo(function () { var i = $('.es-in'); if (i) i.focus(); }, 40);
    }
    function closeWin(w, force) {
      var a = w.getAttribute('data-w');
      if (a === 'ed' && dirty && vfsOn && force !== true) { edAsk().then(function (r) { if (r === 'y') saveVfs().then(function (ok) { if (ok) closeWin(w, true); }); else if (r === 'n') closeWin(w, true); }); return; }
      w.classList.remove('show', 'max'); wopen[a] = false; mark(); ghost();
    }
    function openApp(a) { if (a === 'term') openTerm(); else if (a === 'ed') { closeMenus(); if (wopen.ed) front($('.sx-ed')); else if (vfsOn) edNew(); else { var n = edName || 'untitled.py'; openEd(n, files[n]); } } else openWin(a); }
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
      var inp = $('.sx-in'), term = $('.sx-term'), ed = $('.sx-ed'), desk = $('.sx-desk'); bindSearch();
      inp.addEventListener('keydown', function (e) {
        if (arKey(e, inp)) return;
        if (e.key === 'Enter') { e.preventDefault(); var v = inp.value; inp.value = ''; if (asking) answer(v); else if (repl) replLine(v); else submit(v); }
        else if (repl && !running && e.ctrlKey && (e.key || '').toLowerCase() === 'd') { e.preventDefault(); line(esc(replP), 'o'); replEnd(); }
        else if (repl && !running && e.ctrlKey && (e.key || '').toLowerCase() === 'c' && !String(window.getSelection())) { e.preventDefault(); line(esc(replP + inp.value), 'o'); line('KeyboardInterrupt', 'o'); inp.value = ''; if (wk) wk.postMessage({ t: 'repl-reset' }); setPrompt('>>> '); }
        else if (e.key === 'ArrowUp' && cmdH.length && !asking) { e.preventDefault(); hp = Math.max(0, hp - 1); inp.value = cmdH[hp] || ''; }
        else if (e.key === 'ArrowDown' && !asking) { e.preventDefault(); hp = Math.min(cmdH.length, hp + 1); inp.value = cmdH[hp] || ''; }
        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); clearTerm(); }
      });
      term.addEventListener('mousedown', function (e) { front(term); if (!e.target.closest('.sx-wh')) tmo(function () { inp.focus(); }, 0); });
      ed.addEventListener('mousedown', function () { front(ed); });
      el.querySelectorAll('.sx-about,.sx-pc,.sx-bin,.sx-set,.sx-search').forEach(function (w) { w.addEventListener('mousedown', function () { front(w); }); });
      edBind();
      $('.sx-stop').addEventListener('click', function (e) { e.stopPropagation(); stopRun(); });
      /* أيقونات التاسك بار والدوك والقوائم */
      el.querySelectorAll('.sx-ico[data-app],.sx-ap').forEach(function (b) {
        b.addEventListener('click', function () { var a = b.getAttribute('data-app'), w = $('.sx-' + a); if (b.classList.contains('sx-ico') && wopen[a] && w) { front(w); closeMenus(); } else openApp(a); });
      });
      /* أيقونات سطح المكتب (بتشمل ملفات فولدر Desktop): كليك يحدد، دبل كليك يفتح، كليك يمين قايمة */
      var dis = $('.sx-dis');
      dis.addEventListener('click', function (e) { var d = e.target.closest('.sx-di'); if (!d) return; e.stopPropagation(); selDesk(d, e.ctrlKey || e.metaKey); if (coarse) openDesk(d); });
      dis.addEventListener('dblclick', function (e) { var d = e.target.closest('.sx-di'); if (d) openDesk(d); });
      dis.addEventListener('contextmenu', function (e) {
        var d = e.target.closest('.sx-di'); if (!d) return; e.preventDefault(); e.stopPropagation();
        if (!d.hasAttribute('data-did')) { selDesk(d); cmOpen(e, [{ ic: 'folder-open', l: 'Open', a: function () { openDesk(d); } }]); return; }
        if (!d.classList.contains('sel')) selDesk(d);
        cmOpen(e, nodeMenu(deskSel.slice()));
      });
      desk.addEventListener('click', function () { el.querySelectorAll('.sx-di.sel').forEach(function (x) { x.classList.remove('sel'); }); deskSel = []; });
      desk.addEventListener('contextmenu', function (e) {
        if (e.target.closest('.sx-w')) return; e.preventDefault();
        el.querySelectorAll('.sx-di.sel').forEach(function (x) { x.classList.remove('sel'); }); deskSel = [];
        cmOpen(e, deskBlank());
      });
      desk.addEventListener('dragover', function (e) { if (e.dataTransfer && [].indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) e.preventDefault(); });
      desk.addEventListener('drop', function (e) { if (!e.dataTransfer || !e.dataTransfer.files.length) return; e.preventDefault(); if (vfsReady) upFiles(e.dataTransfer.files, vfs.desk()); });
      $('.sx-cm').addEventListener('click', function (e) {
        var li = e.target.closest('li[data-ci]'); if (!li || li.classList.contains('dis')) return;
        var it = cmReg[+li.getAttribute('data-ci')]; if (!it || it.sub) return; closeMenus(); if (it.a) it.a();
      });
      $('.sx-up').addEventListener('change', function (e) { upFiles(e.target.files, upPid); e.target.value = ''; });
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
        else if (c === 'KeyD') el.querySelectorAll('.sx-w.show').forEach(function (w) { closeWin(w); });
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
    on(document, 'keydown', function (e) {
      if (!running || !alive() || phase !== 'on' || !active() || !e.ctrlKey || e.altKey || e.shiftKey || (e.key || '').toLowerCase() !== 'c') return;
      var sl = ''; try { sl = String(window.getSelection()); } catch (x) {}
      if (sl) return; /* فيه نص متحدد: سيبه للنسخ العادي */
      e.preventDefault(); e.stopPropagation(); stopRun();
    }, true);

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
      if (freeMode && (vfsOn ? vfsCmd(c) : freeCmd(c))) return;
      var g = generic(c);
      if (g != null) { emit(g === '' ? [] : g.split('\n'), null, run ? 420 : 120); if (st && st.kind === 'cmd') { tries++; task('الأمر ده اشتغل، بس مش هو المطلوب في الخطوة. اقرا التعليمات فوق.', 'bad'); } return; }
      tries++; emit([notFound(c)], null, 120);
      task(lang === 'ar' || /[\u0600-\u06FF]/.test(c) ? 'اللغة عربي! بدّلها لـENG (Alt+Shift أو دوس على الزرار في الشريط) وجرّب تاني.' : 'الأمر ده مش المطلوب في الخطوة. اقرا التعليمات فوق وجرّب تاني.', 'bad');
    }

    /* ---- المحرر ---- */
    function title() { var n = edName || (steps[i] && steps[i].file) || 'file.py', f = $('.sx-fn'); if (f) f.textContent = (dirty ? '\u25CF ' : '') + n; }
    function save() {
      if (!wopen.ed) return;
      if (vfsOn) { saveVfs(); return; }
      if (freeMode) {
        var nme = edName; if (!nme || nme === 'untitled.py') { var r = root.prompt('File name', 'hello.py'); if (!r) return; nme = r.trim().replace(/[\\/]/g, ''); if (!nme) return; edName = nme; }
        files[nme] = $('.ce-ta').value; vfsPutLegacy(nme, files[nme]); dirty = false; title(); flash(); return;
      }
      var st = steps[i]; if (!st || st.kind !== 'code') return;
      var v = $('.ce-ta').value, e = $('.sx-ed');
      if (codeOk(v, st.expect)) {
        files[st.file] = v; vfsPutLegacy(st.file, v); dirty = false; title(); e.classList.add('saved');
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
      var s = t.querySelector('.sx-show'); if (s) s.onclick = function () { if (st.kind === 'cmd') { $('.sx-in').value = sol; $('.sx-in').focus(); } else { $('.ce-ta').value = sol; dirty = true; edSync(); } };
    }
    function next() {
      i++; tries = 0; mark(); ghost();
      if (i >= steps.length) { task(); free(); if (opts.onDone) opts.onDone(); return; }
      var st = steps[i]; if (st.kind === 'code') openEd(st.file || 'file.py');
      task();
    }

    /* ---- الاستخدام الحر: بايثون حقيقية جوه الـTerminal نفسه ---- */
    function free() { freeMode = true; edInfo(); }
    function setRun(b) { running = b; var tb = $('.sx-tb'); if (tb) tb.classList.toggle('sx-running', b); }
    function wkKill() {
      if (wk) { wk.onmessage = null; wk.onerror = null; try { wk.terminate(); } catch (e) {} }
      if (wkUrl) { try { URL.revokeObjectURL(wkUrl); } catch (e) {} }
      wk = null; wkReady = null; wkUrl = null;
    }
    function wkStart() {
      if (wkReady) return wkReady;
      var p = new Promise(function (res, rej) {
        var w;
        try { wkUrl = URL.createObjectURL(new Blob(['(' + workerMain.toString() + ')()'], { type: 'text/javascript' })); w = wk = new Worker(wkUrl); } catch (e) { rej(e); return; }
        w.onmessage = function (ev) {
          var m = ev.data || {};
          if (m.t === 'ready') res(); else if (m.t === 'fatal') rej(new Error(m.s)); else wkMsg(m);
        };
        w.onerror = function () { rej(new Error('worker')); };
        w.postMessage({ t: 'init', base: 'https://cdn.jsdelivr.net/pyodide/v' + PYV + '/full/' });
      });
      wkReady = p;
      p.catch(function () { if (wkReady === p) wkKill(); });
      return p;
    }
    function wkMsg(m) {
      if (dead || !running) return;
      if (m.t === 'out' || m.t === 'err') { if (m.s.indexOf('@@HINT@@') === 0) line(esc(m.s.slice(8).trim()), 'o sx-ht'); else line(esc(m.s), 'o'); }
      else if (m.t === 'in') ask(m.s);
      else if (m.t === 'done') { setRun(false); busy = false; if (repl) { if (m.r === 'exit') replEnd(); else setPrompt(m.r === 'more' ? '... ' : '>>> '); } showIn(); }
    }
    /* input() جوه الترمنال: السؤال بيظهر مكان البرومبت، والإجابة بتترجع للبرنامج */
    function ask(p) { asking = true; askP = p; var pl = $('.sx-inl .sx-p'); if (pl) pl.textContent = p; showIn(); }
    function answer(v) {
      asking = false; line(esc(askP + v), 'o');
      var pl = $('.sx-inl .sx-p'); if (pl) pl.innerHTML = PROMPT();
      hideIn(); if (wk) wk.postMessage({ t: 'ans', s: v });
    }
    function stopRun(silent) {
      if (!running && !wk) return;
      var was = running;
      if (asking) { asking = false; var pl = $('.sx-inl .sx-p'); if (pl) pl.innerHTML = PROMPT(); }
      wkKill(); setRun(false);
      if (repl) { repl = false; var pl2 = $('.sx-inl .sx-p'); if (pl2) pl2.innerHTML = PROMPT(); }
      if (was && !silent) { line('^C', 'o'); line('KeyboardInterrupt', 'o'); busy = false; showIn(); }
    }
    /* ---- python لوحده = shell تفاعلي (>>> / ...) بنفس الـWorker ---- */
    function setPrompt(t) { replP = t; var pl = $('.sx-inl .sx-p'); if (pl) pl.textContent = t; }
    function replEnd() { repl = false; var pl = $('.sx-inl .sx-p'); if (pl) pl.innerHTML = PROMPT(); }
    function startRepl() {
      busy = true; hideIn(); setRun(true);
      line(pyLoaded ? 'Starting Python...' : 'Loading Python (first run only, about 10 MB)...', 'o');
      wkStart().then(function () {
        pyLoaded = true;
        if (dead || !running || !wk) return;
        wk.postMessage({ t: 'repl-init' });
        repl = true; setRun(false); busy = false;
        line('Python 3.12.4 (main) on ' + (os === 'win' ? 'win32' : os === 'mac' ? 'darwin' : 'linux'), 'o');
        line('Type "help", "copyright", "credits" or "license" for more information.', 'o');
        setPrompt('>>> '); showIn();
      }, function () {
        if (dead) return; setRun(false);
        emit(['Could not load Python. Check your internet connection.'], null, 0);
      });
    }
    function replLine(v) {
      if (busy || !wk) return;
      line(esc(replP + v), 'o'); if (v.trim()) { cmdH.push(v); hp = cmdH.length; }
      busy = true; hideIn(); setRun(true); wk.postMessage({ t: 'repl', s: v });
    }
    function pyExec(code, name) {
      busy = true; hideIn(); setRun(true);
      line(pyLoaded ? 'Starting Python...' : 'Loading Python (first run only, about 10 MB)...', 'o');
      wkStart().then(function () {
        pyLoaded = true;
        if (dead || !running || !wk) return;
        wk.postMessage({ t: 'run', code: String(code), name: name || 'main.py' });
      }, function () {
        if (dead) return; setRun(false);
        emit(['Could not load Python. Check your internet connection.'], null, 0);
      });
    }
    /* ---- ملفاتي: حفظ دائم في وضع الاستخدام الحر ---- */
    function loadFiles() { try { var o = JSON.parse(ls('eto_sim_files') || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } }
    function saveFiles() { if (pureFree) ls('eto_sim_files', JSON.stringify(files)); }
    function fillFiles() {
      var m = $('.sx-myf'); if (!m) return; var ks = Object.keys(files);
      m.innerHTML = ks.length ? '<h4>My files (' + ks.length + ')</h4><div class="sx-fg">' + ks.map(function (n) { return '<div class="sx-f" data-file="' + esc(n) + '" title="' + esc(n) + '"><span style="color:#fbbf24">' + ic('file-code') + '</span>' + esc(n) + '</div>'; }).join('') + '</div>' : '';
    }
    function freeCmd(c) {
      var n = normCmd(c), p = n.split(' '), cmd = p[0].toLowerCase(), a = p.slice(1).join(' ');
      if (cmd === 'python') {
        if (p[1] === '-c') { pyExec(c.replace(/^\s*\S+\s+-c\s+/, '').replace(/^(["'])([\s\S]*)\1$/, '$2'), '<string>'); return true; }
        if (/\.py$/.test(p[1] || '')) {
          if (files[p[1]] == null) emit(["python: can't open file '" + p[1] + "': [Errno 2] No such file or directory"], null, 0); else pyExec(files[p[1]], p[1]);
          return true;
        }
        if (p.length === 1) { startRepl(); return true; }
        return false;
      }
      if (/^(notepad|nano|gedit|code|edit|open)$/.test(cmd) && p[1]) { openEd(p[1], files[p[1]]); return true; }
      if (cmd === 'cat' || cmd === 'type') { emit(files[a] != null ? String(files[a]).split('\n') : [cmd + ': ' + a + ': No such file'], null, 0); return true; }
      if (cmd === 'echo') { emit([a], null, 0); return true; }
      if (/^(rm|del)$/.test(cmd)) { if (files[a] != null) { delete files[a]; saveFiles(); } else emit([cmd + ': ' + a + ': No such file'], null, 0); return true; }
      if (cmd === 'help') { emit(['python file.py   run a file (real Python)', 'python           (alone) open the interactive shell, exit() to leave', 'python -c "print(1+1)"', 'notepad file.py  create or edit a file', 'ls / dir, cat file, echo text, rm file, clear', 'Ctrl+C (or the Stop button) stops a running program'], null, 0); return true; }
      return false;
    }

    /* =====================================================================
       v5: ملفات حقيقية (C: نظام للقراءة فقط / D: بحد 1 جيجا) + كليك يمين + محرر Eto Code
       ===================================================================== */
    var ROOTL = os === 'win' ? 'This PC' : 'Computer';
    function shPath(id) {
      var ps = vfs.parts(id);
      if (os === 'win') return 'D:\\' + ps.join('\\');
      return (os === 'mac' ? '/Volumes/Eto.Edu' : '/mnt/eto') + (ps.length ? '/' + ps.join('/') : '');
    }
    function refreshPrompt() { if (asking || repl) return; var pl = $('.sx-inl .sx-p'); if (pl) pl.innerHTML = PROMPT(); }
    function refreshAll() {
      if (!alive() || phase !== 'on') return;
      deskDraw(); exDraw('pc'); exDraw('bin');
    }
    /* أي عملية على الملفات: بتتنفذ، بتحدّث الشاشة، وأي خطأ بيظهر في رسالة */
    function op(fn) {
      var p; try { p = Promise.resolve(fn()); } catch (e) { p = Promise.reject(e); }
      return p.then(function (r) { refreshAll(); return r; }, function (e) { refreshAll(); showErr(e); return null; });
    }

    /* ---- رسائل وحوارات جوه الجهاز ---- */
    function dlg(o) {
      return new Promise(function (res) {
        var d = document.createElement('div'), bs = o.b || [['OK', 'ok', 1]], pv = 'ok', done = false;
        bs.forEach(function (b) { if (b[2]) pv = b[1]; });
        d.className = 'sx-dlg';
        d.innerHTML = '<div class="dl-card"><div class="dl-h">' + esc(o.t || 'Eto.Edu') + '</div><div class="dl-b">' + (o.m || '') +
          (o.input ? '<input class="dl-in" dir="ltr" spellcheck="false" autocomplete="off" autocapitalize="off" value="' + esc(o.input.v || '') + '">' : '') + '</div><div class="dl-f">' +
          bs.map(function (b) { return '<button class="dl-btn' + (b[2] ? ' pri' : '') + '" data-v="' + esc(b[1]) + '">' + esc(b[0]) + '</button>'; }).join('') + '</div></div>';
        ui.appendChild(d);
        var inp = d.querySelector('.dl-in');
        function fin(v) { if (done) return; done = true; var val = inp ? inp.value : null; d.remove(); res(inp ? (v === pv ? val : null) : v); }
        d.addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) fin(b.getAttribute('data-v')); });
        d.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        d.addEventListener('contextmenu', function (e) { if (!e.target.closest('.dl-in')) e.preventDefault(); e.stopPropagation(); });
        d.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { e.stopPropagation(); fin(null); }
          else if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); fin(pv); }
        });
        if (inp) { inp.focus(); var s = o.input.sel; inp.setSelectionRange(s ? s[0] : 0, s ? s[1] : inp.value.length); }
        else { var pb = d.querySelector('.dl-btn.pri') || d.querySelector('.dl-btn'); if (pb) pb.focus(); }
      });
    }
    function showErr(e, t) { return dlg({ t: t || 'Eto.Edu', m: '<p>' + esc(errMsg(e)) + '</p>' }); }
    function denyC() {
      return dlg({ t: 'Destination Folder Access Denied', m: '<p>You can\'t create or change items on this drive.</p><p><b>' + esc(DRV[os][0]) + '</b> is reserved for system files and is read-only. Use <b>' + esc(DRV[os][1]) + '</b> for your files and projects.</p>',
        b: [['Open ' + DRV[os][1], 'd', 1], ['Close', 'x']] }).then(function (v) { if (v === 'd') exOpenAt('pc', 'd/r'); });
    }
    function propDlg(t, rows) {
      return dlg({ t: t, m: '<table class="dl-tb">' + rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>' });
    }
    /* اختيار ملف/مكان حفظ (Open / Save As) */
    function fileDlg(o) {
      return new Promise(function (res) {
        var cur = o.dir && vfs.get(o.dir) && vfs.live(o.dir) ? o.dir : 'r', pick = null, d = document.createElement('div'), sv = o.mode === 'save';
        d.className = 'sx-dlg';
        d.innerHTML = '<div class="dl-card dl-wide"><div class="dl-h">' + (sv ? 'Save As' : 'Open') + '</div><div class="dl-pa"></div><div class="dl-ls"></div>' +
          (sv ? '<div class="dl-nm"><span>File name</span><input class="dl-in" dir="ltr" spellcheck="false" autocomplete="off" value="' + esc(o.name || '') + '"></div>' : '') +
          '<div class="dl-f"><button class="dl-btn pri" data-v="ok">' + (sv ? 'Save' : 'Open') + '</button><button class="dl-btn" data-v="x">Cancel</button></div></div>';
        ui.appendChild(d);
        var inp = d.querySelector('.dl-in'), ls_ = d.querySelector('.dl-ls'), done = false;
        function draw() {
          d.querySelector('.dl-pa').textContent = shPath(cur);
          var h = cur !== 'r' ? '<div class="dl-r" data-up="1">' + ic('folder-open') + '<span>..</span></div>' : '';
          vfs.kids(cur).forEach(function (n) {
            var v = fileIc(n.n, n.t === 'd');
            h += '<div class="dl-r' + (pick === n.id ? ' on' : '') + (n.t === 'f' && sv ? ' dim' : '') + '" data-id="' + n.id + '"><i style="color:' + v[1] + '"></i>' + ic(v[0]).replace('<i ', '<i style="color:' + v[1] + '" ') + '<span>' + esc(n.n) + '</span><small>' + (n.t === 'f' ? fmtSize(n.s) : '') + '</small></div>';
          });
          ls_.innerHTML = h || '<div class="dl-e">This folder is empty</div>';
        }
        function fin(v) {
          if (done) return;
          if (v === 'ok') {
            if (sv) { var nmv = inp.value.trim(); if (!nmv) return; done = true; d.remove(); res({ pid: cur, name: nmv }); return; }
            var n = pick && vfs.get(pick); if (!n || n.t !== 'f') return;
            done = true; d.remove(); res({ id: n.id }); return;
          }
          done = true; d.remove(); res(null);
        }
        d.addEventListener('click', function (e) {
          var b = e.target.closest('[data-v]'); if (b) { fin(b.getAttribute('data-v')); return; }
          var r = e.target.closest('.dl-r'); if (!r) return;
          if (r.hasAttribute('data-up')) { var cn = vfs.get(cur); cur = (cn && cn.p) || 'r'; pick = null; draw(); return; }
          var n = vfs.get(r.getAttribute('data-id'));
          if (n.t === 'd') { cur = n.id; pick = null; draw(); } else { pick = n.id; if (sv) inp.value = n.n; draw(); }
        });
        d.addEventListener('dblclick', function (e) { var r = e.target.closest('.dl-r[data-id]'); if (r && !sv && vfs.get(r.getAttribute('data-id')).t === 'f') { pick = r.getAttribute('data-id'); fin('ok'); } });
        d.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        d.addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); });
        d.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { e.stopPropagation(); fin('x'); } else if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); fin('ok'); }
        });
        draw(); if (inp) { inp.focus(); var dt = inp.value.lastIndexOf('.'); inp.setSelectionRange(0, dt > 0 ? dt : inp.value.length); }
      });
    }

    /* ---- قوايم الكليك يمين (زي الويندوز) ---- */
    function cmHtml(items) {
      return '<ul>' + items.map(function (m) {
        if (m === '-') return '<li class="sep"></li>';
        var idx = cmReg.push(m) - 1;
        return '<li class="' + (m.dis ? 'dis ' : '') + (m.sub ? 'has' : '') + '" data-ci="' + idx + '">' + (m.ic ? ic(m.ic) : '<i></i>') + '<span>' + esc(m.l) + '</span>' +
          (m.k ? '<kbd>' + esc(m.k) + '</kbd>' : '') + (m.sub ? '<b class="fa-solid fa-chevron-right sub"></b>' + cmHtml(m.sub).replace('<ul>', '<ul class="sx-sub">') : '') + '</li>';
      }).join('') + '</ul>';
    }
    function cmOpen(e, items) {
      var m = $('.sx-cm'), r = sc.getBoundingClientRect(); closeMenus(); cmReg = [];
      m.innerHTML = cmHtml(items); m.classList.add('open');
      var x = (e.clientX - r.left) / k, y = (e.clientY - r.top) / k, w = m.offsetWidth, h = m.offsetHeight;
      m.style.left = Math.max(0, Math.min(W - w - 4, x)) + 'px'; m.style.top = Math.max(0, Math.min(H - h - 52, y)) + 'px';
      m.classList.toggle('flip', x + w + 230 > W);
    }
    function newMenu(pid) {
      var go = function (f) { return function () { if (!pid) denyC(); else f(); }; };
      var a = [{ ic: 'folder', l: 'Folder', a: go(function () { mkNew('dir', pid); }) }, '-'];
      LANG_ORDER.forEach(function (id) { a.push({ ic: LANGS[id].ic, l: LANGS[id].label, a: go(function () { mkNew(id, pid); }) }); });
      return a;
    }
    function mkNew(kind, pid) {
      var L = kind === 'dir' ? null : LANGS[kind], def = vfs.uniq(pid, kind === 'dir' ? 'New folder' : L.def), dot = def.lastIndexOf('.');
      dlg({ t: kind === 'dir' ? 'New Folder' : 'New ' + L.label, m: '<p>Name</p>', input: { v: def, sel: [0, kind === 'dir' || dot < 1 ? def.length : dot] }, b: [['Create', 'ok', 1], ['Cancel', 'x']] }).then(function (v) {
        if (v == null) return;
        v = v.trim(); if (kind !== 'dir' && !/\.[^.\s]+$/.test(v)) v += '.' + L.exts[0];
        return op(function () { return kind === 'dir' ? vfs.mkdir(pid, v) : vfs.mkfile(pid, v, ''); }).then(function (n) { if (n) selectNew(pid, n.id); });
      });
    }
    function selectNew(pid, id) {
      if (pid === vfs.desk()) { deskSel = [id]; deskDraw(); }
      if (EX.pc.loc === 'd/' + pid) { EX.pc.sel = [id]; exDraw('pc'); }
    }
    function actPaste(pid) {
      if (!clip) return; var c = clip;
      op(function () {
        return c.ids.reduce(function (p, id) {
          return p.then(function () {
            var n = vfs.get(id); if (!n || !vfs.live(id)) return;
            if (c.mode === 'cut') { vfs.move(id, pid); return; }
            return vfs.copy(id, pid);
          });
        }, Promise.resolve()).then(function () { if (c.mode === 'cut') clip = null; });
      });
    }
    function actDel(ids) { op(function () { ids.forEach(function (id) { vfs.trash(id); }); deskSel = []; EX.pc.sel = []; }); }
    function actRename(id) {
      var n = vfs.get(id); if (!n) return; var dot = n.t === 'f' ? n.n.lastIndexOf('.') : -1;
      dlg({ t: 'Rename', m: '<p>New name</p>', input: { v: n.n, sel: [0, dot > 0 ? dot : n.n.length] }, b: [['Rename', 'ok', 1], ['Cancel', 'x']] }).then(function (v) {
        if (v != null) op(function () { vfs.rename(id, v); });
      });
    }
    function actProps(ids) {
      var dt = function (x) { return new Date(x).toLocaleString('en-US'); };
      if (ids.length > 1) {
        var sz = 0, f = 0, dd = 0; ids.forEach(function (id) { var n = vfs.get(id); if (!n) return; sz += vfs.size(id); if (n.t === 'f') f++; else { dd++; var q = vfs.count(id); f += q.f; dd += q.d; } });
        return propDlg(ids.length + ' items', [['Contains', f + ' files, ' + dd + ' folders'], ['Size', fmtSize(sz)]]);
      }
      var n = vfs.get(ids[0]); if (!n) return;
      var s = vfs.size(n.id), rows = [['Type', n.t === 'd' ? 'File folder' : langOf(n.n).name + ' file'], ['Location', shPath(n.p)], ['Size', fmtSize(s) + ' (' + s.toLocaleString('en-US') + ' bytes)']];
      if (n.t === 'd') { var c = vfs.count(n.id); rows.push(['Contains', c.f + ' files, ' + c.d + ' folders']); }
      rows.push(['Created', dt(n.c)], ['Modified', dt(n.m)]);
      return propDlg(n.n, rows);
    }
    function actUpload(pid) { upPid = pid; var u = $('.sx-up'); if (u) u.click(); }
    function upFiles(list, pid) {
      var fl = [].slice.call(list || []); if (!fl.length) return;
      var p = Promise.resolve(), bad = null;
      fl.forEach(function (f) {
        p = p.then(function () {
          var nmv = vfs.uniq(pid, f.name.replace(/[\\\/:*?"<>|]/g, '_')), txt = TEXTX.test(f.name) && f.size < 5e6;
          return (txt ? f.text() : Promise.resolve(f)).then(function (c) { return vfs.mkfile(pid, nmv, c); });
        }).catch(function (e) { bad = bad || e; });
      });
      p.then(function () { refreshAll(); if (bad) showErr(bad); });
    }
    function openNode(n) { if (!n) return; if (n.t === 'd') exOpenAt('pc', 'd/' + n.id); else edOpenNode(n); }
    function nodeMenu(ids) {
      var one = ids.length === 1 ? vfs.get(ids[0]) : null, dir = one && one.t === 'd', prot = ids.indexOf(vfs.desk()) >= 0, m = [];
      if (one) {
        m.push({ ic: dir ? 'folder-open' : 'file-pen', l: dir ? 'Open' : 'Open with Eto Code', a: function () { openNode(one); } });
        if (!dir && langOf(one.n).run) m.push({ ic: 'play', l: 'Run with Python', a: function () { runNode(one); } });
        if (dir) m.push({ ic: 'terminal', l: 'Open in Terminal', a: function () { termAt(one.id); } });
        m.push('-');
      }
      m.push({ ic: 'scissors', l: 'Cut', k: 'Ctrl+X', dis: prot, a: function () { clip = { mode: 'cut', ids: ids.slice() }; refreshAll(); } },
        { ic: 'copy', l: 'Copy', k: 'Ctrl+C', a: function () { clip = { mode: 'copy', ids: ids.slice() }; refreshAll(); } });
      if (dir) m.push({ ic: 'paste', l: 'Paste', k: 'Ctrl+V', dis: !clip, a: function () { actPaste(one.id); } });
      m.push('-', { ic: 'trash-can', l: 'Delete', k: 'Del', dis: prot, a: function () { actDel(ids); } });
      if (one) m.push({ ic: 'pen', l: 'Rename', k: 'F2', dis: prot, a: function () { actRename(one.id); } });
      m.push('-', { ic: 'circle-info', l: 'Properties', a: function () { actProps(ids); } });
      return m;
    }

    /* ---- سطح المكتب: أيقونات النظام + محتوى فولدر Desktop (اللي على D:) ---- */
    function deskIcons() {
      var s = ['pc', 'bin', 'about', 'search'].map(function (a) { var c = aic(a); return '<div class="sx-di" data-app="' + a + '"><span class="sx-dic" style="color:' + c[1] + '"><i class="fa-solid fa-' + c[0] + '"></i></span>' + nm(a) + '</div>'; }).join('');
      if (!vfsReady) return s;
      return s + vfs.kids(vfs.desk()).map(function (n) {
        var v = fileIc(n.n, n.t === 'd');
        return '<div class="sx-di' + (deskSel.indexOf(n.id) >= 0 ? ' sel' : '') + (clip && clip.mode === 'cut' && clip.ids.indexOf(n.id) >= 0 ? ' cut' : '') + '" data-did="' + n.id + '" title="' + esc(n.n) + '"><span class="sx-dic" style="color:' + v[1] + '">' + ic(v[0]) + '</span><em>' + esc(n.n) + '</em></div>';
      }).join('');
    }
    function deskDraw() { var d = $('.sx-dis'); if (d) d.innerHTML = deskIcons(); }
    function selDesk(d, add) {
      el.querySelectorAll('.sx-di').forEach(function (x) { x.classList.toggle('sel', x === d || (add && x.classList.contains('sel'))); });
      deskSel = [].map.call(el.querySelectorAll('.sx-di.sel[data-did]'), function (x) { return x.getAttribute('data-did'); });
    }
    function openDesk(d) { var a = d.getAttribute('data-app'); if (a) openApp(a); else openNode(vfs.get(d.getAttribute('data-did'))); }
    function deskBlank() {
      var pid = vfsReady ? vfs.desk() : null;
      return [{ ic: 'plus', l: 'New', sub: newMenu(pid) }, '-',
        { ic: 'paste', l: 'Paste', k: 'Ctrl+V', dis: !clip || !pid, a: function () { actPaste(pid); } },
        { ic: 'upload', l: 'Upload files here...', dis: !pid, a: function () { actUpload(pid); } }, '-',
        { ic: 'terminal', l: 'Open in Terminal', a: function () { termAt(pid || 'r'); } },
        { ic: 'folder-open', l: 'Open File Explorer', a: function () { openApp('pc'); } }, '-',
        { ic: 'image', l: 'Personalize', a: function () { openWin('set'); } },
        { ic: 'rotate', l: 'Refresh', k: 'F5', a: refreshAll }];
    }

    /* ---- مستكشف الملفات (This PC + الفولدرات + Recycle Bin) ---- */
    function exSkel(w) {
      var cb = w === 'bin'
        ? '<button data-xa="empty">' + ic('broom') + ' Empty Recycle Bin</button><button data-xa="restore">' + ic('rotate-left') + ' Restore</button>'
        : '<button data-xa="new">' + ic('plus') + ' New <i class="fa-solid fa-chevron-down"></i></button><button data-xa="upload">' + ic('upload') + ' Upload</button><span class="sp"></span>' +
          ['cut|scissors|Cut', 'copy|copy|Copy', 'paste|paste|Paste', 'ren|pen|Rename', 'del|trash-can|Delete'].map(function (b) { b = b.split('|'); return '<button data-xa="' + b[0] + '" title="' + b[2] + '">' + ic(b[1]) + '</button>'; }).join('');
      return '<div class="sx-xp xe" data-ex="' + w + '"><div class="sx-xt"><i class="fa-solid fa-arrow-left" data-x="back"></i><i class="fa-solid fa-arrow-right" data-x="fwd"></i><i class="fa-solid fa-arrow-up" data-x="up"></i>' +
        '<span class="sx-ad"></span><span class="sx-sr">' + ic('magnifying-glass') + '<input class="xe-q" dir="auto" placeholder="Search" spellcheck="false" autocomplete="off"></span></div>' +
        '<div class="xe-cb">' + cb + '</div><div class="sx-xb xe-body" tabindex="0"></div><div class="sx-xs"><span class="xe-st"></span><span class="xe-sp"></span></div></div>';
    }
    function dItem(n) {
      return { key: n.id, src: 'd', k: n.t === 'd' ? 'dir' : 'file', id: n.id, loc: 'd/' + n.id, name: n.n, size: n.t === 'f' ? fmtSize(n.s) : '', ico: fileIc(n.n, n.t === 'd') };
    }
    function cNode(parts) {
      var t = CT[os]; for (var j = 0; j < parts.length; j++) { t = t && typeof t === 'object' ? t[parts[j]] : null; } return t;
    }
    function exList(w) {
      var s = EX[w], L = s.loc.split('/'), out = [];
      if (w === 'bin') { vfs.bin().forEach(function (n) { var it = dItem(n); it.size = fmtSize(vfs.size(n.id)); out.push(it); }); }
      else if (L[0] === 'pc') {
        var u = vfs.m.used;
        out = [{ key: 'drv:c', src: 'c', k: 'drive', loc: 'c', name: DRV[os][0], pct: 62, info: '48 GB free of 128 GB · System (read-only)', ro: 1 },
          { key: 'drv:d', src: 'd', k: 'drive', loc: 'd/r', name: DRV[os][1], pct: Math.max(u ? 1 : 0, Math.round(u / D_CAP * 100)), info: fmtSize(vfs.free()) + ' free of 1 GB' }];
        return out;
      } else if (L[0] === 'c') {
        var t = cNode(L.slice(1));
        if (t && typeof t === 'object') Object.keys(t).sort(function (a, b) {
          var da = typeof t[a] === 'object', db = typeof t[b] === 'object'; return da !== db ? (da ? -1 : 1) : a.localeCompare(b);
        }).forEach(function (kk) { var dir = typeof t[kk] === 'object'; out.push({ key: s.loc + '/' + kk, src: 'c', k: dir ? 'dir' : 'file', loc: s.loc + '/' + kk, name: kk, size: dir ? '' : t[kk], ico: fileIc(kk, dir), ro: 1 }); });
      } else {
        if (!vfs.get(L[1]) || !vfs.live(L[1])) { s.loc = 'pc'; s.h = ['pc']; s.hi = 0; return exList(w); }
        vfs.kids(L[1]).forEach(function (n) { out.push(dItem(n)); });
      }
      if (s.q) out = out.filter(function (it) { return it.name.toLowerCase().indexOf(s.q) >= 0; });
      return out;
    }
    function exCrumbs(w) {
      var s = EX[w], L = s.loc.split('/'), c = [];
      if (w === 'bin') return [{ l: nm('bin') }];
      c.push({ l: ROOTL, loc: 'pc' });
      if (L[0] === 'pc') return c;
      if (L[0] === 'c') { c.push({ l: DRV[os][0], loc: 'c' }); for (var j = 1; j < L.length; j++) c.push({ l: L[j], loc: L.slice(0, j + 1).join('/') }); return c; }
      c.push({ l: DRV[os][1], loc: 'd/r' });
      var ch = [], id = L[1]; while (id && id !== 'r') { var n = vfs.get(id); if (!n) break; ch.unshift({ l: n.n, loc: 'd/' + n.id }); id = n.p; }
      return c.concat(ch);
    }
    function exDraw(w) {
      var s = EX[w], win = $('.sx-' + w), xp = win && win.querySelector('.xe'); if (!xp) return;
      var items = exList(w), body = xp.querySelector('.xe-body'), L = s.loc.split('/'), cutIds = clip && clip.mode === 'cut' ? clip.ids : [];
      s.items = items; s.sel = s.sel.filter(function (kk) { return items.some(function (it) { return it.key === kk; }); });
      xp.querySelector('.sx-ad').innerHTML = ic(w === 'bin' ? 'trash-can' : 'folder') + exCrumbs(w).map(function (c) { return '<em' + (c.loc ? ' data-go="' + c.loc + '"' : '') + '>' + esc(c.l) + '</em>'; }).join('<span class="sp">›</span>');
      var sl = function (it) { return s.sel.indexOf(it.key) >= 0 ? ' sel' : ''; };
      if (s.loc === 'pc') {
        body.innerHTML = '<h4>Devices and drives (2)</h4><div class="sx-dg">' + items.map(function (it, j) {
          return '<div class="sx-drv' + sl(it) + '" data-i="' + j + '">' + ic('hard-drive') + '<div><b>' + esc(it.name) + (it.ro ? ' ' + ic('lock') : '') + '</b><div class="bar"><i style="width:' + it.pct + '%"></i></div><small>' + esc(it.info) + '</small></div></div>';
        }).join('') + '</div>';
      } else if (items.length) {
        body.innerHTML = '<div class="xe-g">' + items.map(function (it, j) {
          return '<div class="xf' + sl(it) + (cutIds.indexOf(it.id) >= 0 ? ' cut' : '') + '" data-i="' + j + '" title="' + esc(it.name) + '"><span class="xi" style="color:' + it.ico[1] + '">' + ic(it.ico[0]) + '</span><span class="xn"><b>' + esc(it.name) + '</b><small>' + esc(it.size || '') + '</small></span></div>';
        }).join('') + '</div>';
      } else body.innerHTML = '<div class="sx-empty">' + ic(w === 'bin' ? 'trash-can' : 'folder-open') + '<p>' + (s.q ? 'No items match your search' : w === 'bin' ? 'Recycle Bin is empty' : 'This folder is empty') + '</p></div>';
      xp.querySelector('.xe-sp').textContent = L[0] === 'd' ? fmtSize(vfs.free()) + ' free of 1 GB' + (vfs.vol ? ' · not saved (private mode)' : '') : L[0] === 'c' ? 'Read-only system drive' : '';
      xp.querySelector('[data-x="back"]').classList.toggle('off', s.hi <= 0); xp.querySelector('[data-x="fwd"]').classList.toggle('off', s.hi >= s.h.length - 1); xp.querySelector('[data-x="up"]').classList.toggle('off', s.loc === 'pc' || w === 'bin');
      var pb = xp.querySelector('[data-xa="paste"]'); if (pb) pb.classList.toggle('off', !clip);
      exMark(w);
    }
    function exMark(w) {
      var s = EX[w], xp = $('.sx-' + w + ' .xe'); if (!xp) return;
      xp.querySelectorAll('[data-i]').forEach(function (x) { var it = s.items[+x.getAttribute('data-i')]; x.classList.toggle('sel', !!it && s.sel.indexOf(it.key) >= 0); });
      xp.querySelector('.xe-st').textContent = s.items.length + (s.items.length === 1 ? ' item' : ' items') + (s.sel.length ? ' · ' + s.sel.length + ' selected' : '');
    }
    function exGo(w, loc, keep) {
      var s = EX[w];
      if (!keep) { s.h = s.h.slice(0, s.hi + 1); if (s.h[s.hi] !== loc) { s.h.push(loc); s.hi = s.h.length - 1; } }
      s.loc = loc; s.sel = []; s.q = ''; var q = $('.sx-' + w + ' .xe-q'); if (q) q.value = '';
      exDraw(w);
    }
    function exHist(w, d) { var s = EX[w], n = s.hi + d; if (n < 0 || n >= s.h.length) return; s.hi = n; exGo(w, s.h[n], true); }
    function exUp(w) {
      var s = EX[w], L = s.loc.split('/');
      if (L[0] === 'd') { var n = vfs.get(L[1]); exGo(w, n && n.p ? 'd/' + n.p : 'pc'); }
      else if (L[0] === 'c') { if (L.length === 1) exGo(w, 'pc'); else { L.pop(); exGo(w, L.join('/')); } }
    }
    function exOpenAt(w, loc) { openWin(w); exGo(w, loc); }
    function exOpen(w, it) {
      if (w === 'bin') { dlg({ t: 'Recycle Bin', m: '<p>You can\'t open items in the Recycle Bin. Restore the item first.</p>' }); return; }
      if (it.k !== 'file') return exGo(w, it.loc);
      if (it.src === 'c') { dlg({ t: 'Access denied', m: '<p><b>' + esc(it.name) + '</b> is a protected system file and can\'t be opened.</p>' }); return; }
      edOpenNode(vfs.get(it.id));
    }
    function exSel(w) { var s = EX[w]; return s.items.filter(function (it) { return s.sel.indexOf(it.key) >= 0; }); }
    function exIds(w) { return exSel(w).filter(function (it) { return it.src === 'd' && it.id; }).map(function (it) { return it.id; }); }
    function exMenu(w, its) {
      var it = its[0];
      if (w === 'bin') {
        var ids = its.map(function (x) { return x.id; });
        return [{ ic: 'rotate-left', l: 'Restore', a: function () { exRestore(ids); } }, { ic: 'trash-can', l: 'Delete permanently', a: function () { exPurge(ids); } }, '-', { ic: 'circle-info', l: 'Properties', a: function () { actProps(ids); } }];
      }
      if (it.src === 'c' || it.k === 'drive') {
        var m = [{ ic: it.k === 'file' ? 'lock' : 'folder-open', l: 'Open', a: function () { exOpen(w, it); } }, '-'];
        if (it.k !== 'drive') m.push({ ic: 'scissors', l: 'Cut', k: 'Ctrl+X', dis: 1 }, { ic: 'copy', l: 'Copy', k: 'Ctrl+C', dis: 1 }, '-', { ic: 'trash-can', l: 'Delete', k: 'Del', dis: 1 }, { ic: 'pen', l: 'Rename', k: 'F2', dis: 1 }, '-');
        m.push({ ic: 'circle-info', l: 'Properties', a: function () { propsStatic(it); } });
        return m;
      }
      return nodeMenu(its.map(function (x) { return x.id; }));
    }
    function propsStatic(it) {
      if (it.k === 'drive') {
        return it.src === 'c' ? propDlg(it.name, [['Type', 'System drive'], ['Access', 'Read-only'], ['Capacity', '128 GB'], ['Free space', '48 GB'], ['Used for', 'System files only']])
          : propDlg(it.name, [['Type', 'Local Disk'], ['Capacity', '1 GB'], ['Used', fmtSize(vfs.m.used)], ['Free space', fmtSize(vfs.free())], ['Stored', vfs.vol ? 'In memory only (not saved)' : 'In this browser (real files)']]);
      }
      return propDlg(it.name, [['Type', it.k === 'dir' ? 'System folder' : 'System file'], ['Access', 'Read-only'], ['Size', it.size || '-']]);
    }
    function exBlank(w) {
      var s = EX[w], L = s.loc.split('/'), r = { ic: 'rotate', l: 'Refresh', k: 'F5', a: refreshAll };
      if (w === 'bin') return [{ ic: 'broom', l: 'Empty Recycle Bin', dis: !vfs.bin().length, a: exEmpty }, '-', r];
      if (L[0] === 'pc') return [r];
      var pid = L[0] === 'd' ? L[1] : null, m = [{ ic: 'plus', l: 'New', sub: newMenu(pid) }, '-',
        { ic: 'paste', l: 'Paste', k: 'Ctrl+V', dis: !clip, a: function () { if (pid) actPaste(pid); else denyC(); } },
        { ic: 'upload', l: 'Upload files here...', a: function () { if (pid) actUpload(pid); else denyC(); } }, '-'];
      if (pid) m.push({ ic: 'terminal', l: 'Open in Terminal', a: function () { termAt(pid); } });
      m.push(r);
      if (pid) m.push('-', { ic: 'circle-info', l: 'Properties', a: function () { actProps([pid]); } });
      return m;
    }
    function exRestore(ids) { op(function () { ids.forEach(function (id) { vfs.restore(id); }); }); }
    function exPurge(ids) {
      dlg({ t: 'Delete permanently', m: '<p>Delete ' + (ids.length > 1 ? ids.length + ' items' : '<b>' + esc((vfs.get(ids[0]) || {}).n || '') + '</b>') + ' permanently? This can\'t be undone.</p>', b: [['Delete', 'y', 1], ['Cancel', 'x']] }).then(function (v) {
        if (v === 'y') op(function () { return ids.reduce(function (p, id) { return p.then(function () { return vfs.purge(id); }); }, Promise.resolve()); });
      });
    }
    function exEmpty() {
      if (!vfs.bin().length) return;
      dlg({ t: 'Delete Multiple Items', m: '<p>Are you sure you want to permanently delete all items in the Recycle Bin?</p>', b: [['Yes', 'y', 1], ['No', 'x']] }).then(function (v) { if (v === 'y') op(function () { return vfs.empty(); }); });
    }
    function exCmd(w, a, btn) {
      var s = EX[w], L = s.loc.split('/'), pid = L[0] === 'd' ? L[1] : null, ids = exIds(w);
      if (a === 'new') {
        if (L[0] === 'pc') { dlg({ t: 'New', m: '<p>Open a drive first, then create a folder or file inside it.</p>' }); return; }
        var r = btn.getBoundingClientRect(); cmOpen({ clientX: r.left, clientY: r.bottom + 2 }, newMenu(pid));
      }
      else if (a === 'upload') { if (pid) actUpload(pid); else if (L[0] === 'c') denyC(); }
      else if (a === 'cut' && ids.length) clip = { mode: 'cut', ids: ids }, refreshAll();
      else if (a === 'copy' && ids.length) clip = { mode: 'copy', ids: ids }, refreshAll();
      else if (a === 'paste') { if (!clip) return; if (pid) actPaste(pid); else if (L[0] === 'c') denyC(); }
      else if (a === 'ren' && ids.length === 1) actRename(ids[0]);
      else if (a === 'del' && ids.length) actDel(ids);
      else if (a === 'empty') exEmpty();
      else if (a === 'restore') { var bi = exSel('bin').map(function (x) { return x.id; }); if (bi.length) exRestore(bi); }
    }
    function exKey(w, e) {
      if (e.target.tagName === 'INPUT') return;
      var c = e.ctrlKey || e.metaKey, kk = (e.key || '').toLowerCase(), s = EX[w], ids = exIds(w), L = s.loc.split('/'), pid = L[0] === 'd' ? L[1] : null, h = true;
      if (kk === 'delete' && w !== 'bin' && ids.length) actDel(ids);
      else if (kk === 'delete' && w === 'bin' && s.sel.length) exPurge(exSel('bin').map(function (x) { return x.id; }));
      else if (kk === 'f2' && ids.length === 1) actRename(ids[0]);
      else if (kk === 'f5') refreshAll();
      else if (c && kk === 'c' && ids.length) { clip = { mode: 'copy', ids: ids }; refreshAll(); }
      else if (c && kk === 'x' && ids.length) { clip = { mode: 'cut', ids: ids }; refreshAll(); }
      else if (c && kk === 'v') { if (pid) actPaste(pid); else if (L[0] === 'c') denyC(); }
      else if (c && kk === 'a') { s.sel = s.items.map(function (it) { return it.key; }); exMark(w); }
      else if (kk === 'backspace') exUp(w);
      else if (kk === 'enter' && s.sel.length === 1) exOpen(w, exSel(w)[0]);
      else h = false;
      if (h) { e.preventDefault(); e.stopPropagation(); }
    }
    function exInit() {
      ['pc', 'bin'].forEach(function (w) {
        var win = $('.sx-' + w), xp = win.querySelector('.xe'), body = xp.querySelector('.xe-body'), s = EX[w];
        xp.addEventListener('click', function (e) {
          var g = e.target.closest('[data-go]'); if (g) { exGo(w, g.getAttribute('data-go')); return; }
          var xb = e.target.closest('[data-x]'); if (xb) { var a = xb.getAttribute('data-x'); if (a === 'back') exHist(w, -1); else if (a === 'fwd') exHist(w, 1); else exUp(w); return; }
          var ca = e.target.closest('[data-xa]'); if (ca) exCmd(w, ca.getAttribute('data-xa'), ca);
        });
        xp.querySelector('.xe-q').addEventListener('input', function (e) { s.q = e.target.value.toLowerCase(); exDraw(w); });
        body.addEventListener('click', function (e) {
          body.focus({ preventScroll: true });
          var x = e.target.closest('[data-i]'), it = x && s.items[+x.getAttribute('data-i')];
          if (!it) { s.sel = []; exMark(w); return; }
          if (e.ctrlKey || e.metaKey) { var j = s.sel.indexOf(it.key); if (j >= 0) s.sel.splice(j, 1); else s.sel.push(it.key); } else s.sel = [it.key];
          exMark(w); if (coarse) exOpen(w, it);
        });
        body.addEventListener('dblclick', function (e) { var x = e.target.closest('[data-i]'), it = x && s.items[+x.getAttribute('data-i')]; if (it) exOpen(w, it); });
        body.addEventListener('contextmenu', function (e) {
          e.preventDefault(); e.stopPropagation(); body.focus({ preventScroll: true });
          var x = e.target.closest('[data-i]'), it = x && s.items[+x.getAttribute('data-i')];
          if (it) { if (s.sel.indexOf(it.key) < 0) { s.sel = [it.key]; exMark(w); } cmOpen(e, exMenu(w, exSel(w))); }
          else { s.sel = []; exMark(w); cmOpen(e, exBlank(w)); }
        });
        body.addEventListener('keydown', function (e) { exKey(w, e); });
        body.addEventListener('dragover', function (e) { if (w === 'pc' && e.dataTransfer && [].indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) { e.preventDefault(); e.stopPropagation(); } });
        body.addEventListener('drop', function (e) {
          if (w !== 'pc' || !e.dataTransfer || !e.dataTransfer.files.length) return; e.preventDefault(); e.stopPropagation();
          var L = s.loc.split('/'); if (L[0] === 'd') upFiles(e.dataTransfer.files, L[1]); else if (L[0] === 'c') denyC();
        });
      });
    }

    /* ---- محرر Eto Code ---- */
    function edBody() {
      return '<div class="ce"><div class="ce-bar">' + (vfsOn ? '<button data-e="new" title="New file">' + ic('file-circle-plus') + '</button><button data-e="open" title="Open (Ctrl+O)">' + ic('folder-open') + '</button>' : '') +
        '<button data-e="save" title="Save (Ctrl+S)">' + ic('floppy-disk') + '<span>Save</span></button><span class="ce-sp"></span><span class="ce-lg"></span>' +
        '<button class="ce-run" data-e="run" title="Run (F5)">' + ic('play') + '<span>Run</span></button></div>' +
        '<div class="ce-main"><div class="ce-gut" aria-hidden="true"></div><div class="ce-wrap"><pre class="ce-hl" aria-hidden="true"></pre><textarea class="ce-ta" dir="ltr" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off"></textarea></div></div>' +
        '<div class="ce-st"><span class="sx-pos">Ln 1, Col 1</span><span>Spaces: 4</span><span>UTF-8</span><span class="ce-ln"></span><span class="ce-path"></span></div></div>';
    }
    function edSync() {
      var ta = $('.ce-ta'); if (!ta) return;
      var v = ta.value, n = v.split('\n').length, g = $('.ce-gut');
      $('.ce-hl').innerHTML = hl(v, edL) + '\n';
      if (g.__n !== n) { g.__n = n; var s = ''; for (var j = 1; j <= n; j++) s += j + '\n'; g.textContent = s; g.style.width = (String(n).length * 9 + 24) + 'px'; }
      edScroll();
    }
    function edScroll() { var ta = $('.ce-ta'), h = $('.ce-hl'), g = $('.ce-gut'); if (!ta || !h) return; h.scrollTop = ta.scrollTop; h.scrollLeft = ta.scrollLeft; g.scrollTop = ta.scrollTop; }
    function edInfo() {
      var a = $('.ce-ln'), p = $('.ce-path'), r = $('.ce-run'), l = $('.ce-lg');
      if (a) a.textContent = edL.name; if (l) l.textContent = edL.name;
      if (p) p.textContent = edId && vfs.get(edId) ? shPath(vfs.get(edId).p) : vfsOn ? 'Not saved yet' : '';
      if (r) r.style.display = freeMode ? '' : 'none';
    }
    function edSet(text, name, id, dir) {
      var e = $('.sx-ed'); if (!e) return; closeMenus(); edId = id || null; edDir = dir || null; edName = name; dirty = false; edL = langOf(name);
      front(e); $('.ce-ta').value = text || ''; edSync(); title(); edInfo(); $('.sx-pos').textContent = 'Ln 1, Col 1';
      wopen.ed = true; e.classList.add('show'); mark(); tmo(function () { var t = $('.ce-ta'); if (t) t.focus(); }, 40);
    }
    function openEd(name, content) { edSet(content || '', name, null, null); }
    function edAsk() { return dlg({ t: 'Eto Code', m: '<p>Do you want to save changes to <b>' + esc(edName || 'untitled') + '</b>?</p>', b: [['Save', 'y', 1], ['Don\'t save', 'n'], ['Cancel', 'x']] }); }
    function edGuard(next) {
      if (vfsOn && dirty && wopen.ed) edAsk().then(function (r) { if (r === 'y') saveVfs(false).then(function (ok) { if (ok) next(); }); else if (r === 'n') next(); });
      else next();
    }
    function edNew() { edGuard(function () { edSet('', 'untitled.py', null, vfs.desk()); }); }
    function edOpenNode(n) {
      if (!n) return; if (n.t === 'd') return openNode(n);
      if (n.b) { showErr({ code: 'bin' }); return; }
      edGuard(function () { vfs.readText(n.id).then(function (t) { edSet(t, n.n, n.id, n.p); }); });
    }
    function edOpenDlg() { edGuard(function () { fileDlg({ mode: 'open', dir: edDir || vfs.desk() }).then(function (r) { if (r) { var n = vfs.get(r.id); if (n && n.b) showErr({ code: 'bin' }); else if (n) vfs.readText(n.id).then(function (t) { edSet(t, n.n, n.id, n.p); }); } }); }); }
    function edOpenPath(arg) {
      var id = vfs.resolve(arg, cwd, os);
      if (id && id !== 'denied' && vfs.get(id)) return edOpenNode(vfs.get(id));
      var s = splitPath(arg); edGuard(function () { edSet('', s.name || arg, null, s.pid || cwd); });
    }
    function flash() { var e = $('.sx-ed'); if (!e) return; e.classList.add('saved'); tmo(function () { e.classList.remove('saved'); }, 500); }
    function saveVfs() {
      var text = $('.ce-ta').value, cur = edId && vfs.get(edId);
      if (cur && !cur.del) {
        return vfs.write(edId, text).then(function () { dirty = false; title(); flash(); refreshAll(); return true; }, function (e) { showErr(e); return false; });
      }
      return fileDlg({ mode: 'save', name: edName || 'untitled.py', dir: edDir || vfs.desk() }).then(function (r) {
        if (!r) return false;
        var fnm = /\.[^.\s]+$/.test(r.name) ? r.name : r.name + '.' + edL.exts[0], ex = vfs.find(r.pid, fnm), go;
        if (ex && ex.t === 'd') go = Promise.reject(vfs.err('exists'));
        else if (ex) go = dlg({ t: 'Confirm Save As', m: '<p><b>' + esc(fnm) + '</b> already exists.</p><p>Do you want to replace it?</p>', b: [['Replace', 'y', 1], ['Cancel', 'x']] }).then(function (v) { return v === 'y' ? vfs.write(ex.id, text) : null; });
        else go = vfs.mkfile(r.pid, fnm, text);
        return go.then(function (n) {
          if (!n) return false;
          edId = n.id; edDir = n.p; edName = n.n; edL = langOf(n.n); dirty = false; title(); edInfo(); edSync(); flash(); refreshAll(); return true;
        }, function (e) { showErr(e); return false; });
      });
    }
    function vfsPutLegacy(name, text) {
      if (!vfsReady) return;
      try { var ex = vfs.find('r', name); (ex ? vfs.write(ex.id, text) : vfs.mkfile('r', name, text)).then(refreshAll, function () {}); } catch (e) {}
    }
    function edRun() {
      if (!freeMode) return;
      if (!edL.run) {
        dlg({ t: 'Eto Code', m: '<p><b>' + esc(edL.name) + '</b> can\'t be run here yet.</p><p>Running ' + esc(edL.name) + ' will be available with its course. You can still write and save your code.</p>' }); return;
      }
      if (!vfsOn) { if (!wopen.term) openTerm(); line('<span class="sx-p">' + PROMPT() + '</span>' + esc('python ' + (edName || 'main.py'))); pyExec($('.ce-ta').value, edName || 'main.py'); return; }
      (dirty || !edId ? saveVfs() : Promise.resolve(true)).then(function (ok) { var n = ok && edId && vfs.get(edId); if (n) runNode(n); });
    }
    function headLines() {
      var d = new Date(), lg = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB');
      return os === 'win' ? ['Windows PowerShell', 'Copyright (C) Microsoft Corporation. All rights reserved.', '', 'Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows', ''] : os === 'mac' ? ['Last login: ' + lg + ' on ttys000'] : [];
    }
    function runNode(n) {
      if (running) stopRun(true);
      if (!headDone) { headDone = true; headLines().forEach(function (l) { line(esc(l), 'o'); }); }
      cwd = n.p; refreshPrompt();
      if (!wopen.term) { var t = $('.sx-term'); wopen.term = true; t.classList.add('show'); mark(); }
      front($('.sx-term')); closeMenus();
      line('<span class="sx-p">' + PROMPT() + '</span>' + esc('python ' + n.n));
      busy = true; hideIn();
      vfs.readText(n.id).then(function (t) { pyExec(t, n.n); }, function () { busy = false; showIn(); });
    }
    function termAt(pid) { cwd = pid || 'r'; openTerm(); refreshPrompt(); }
    function ed_in(ta) { ta.dispatchEvent(new Event('input', { bubbles: true })); }
    function lineSpan(v, s, e) { if (e > s && v.charAt(e - 1) === '\n') e--; var a = v.lastIndexOf('\n', s - 1) + 1, b = v.indexOf('\n', e); return [a, b < 0 ? v.length : b]; }
    function tabKey(ta, sh) {
      var v = ta.value, s = ta.selectionStart, e = ta.selectionEnd;
      if (!sh && s === e) { ta.setRangeText('    ', s, e, 'end'); ed_in(ta); return; }
      var r = lineSpan(v, s, e), ls_ = v.slice(r[0], r[1]).split('\n'), d0 = 0, dl = 0;
      ls_ = ls_.map(function (l, j) {
        if (!sh) return '    ' + l;
        var m = /^( {1,4}|\t)/.exec(l); if (!m) return l; if (j === 0) d0 = m[0].length; dl += m[0].length; return l.slice(m[0].length);
      });
      ta.setRangeText(ls_.join('\n'), r[0], r[1], 'end');
      ta.setSelectionRange(sh ? Math.max(r[0], s - d0) : s + 4, sh ? Math.max(r[0], e - dl) : e + 4 * ls_.length); ed_in(ta);
    }
    function toggleCm(ta) {
      var cm = edL.hash ? '#' : edL.css || edL.markup || edL === LANGS.txt ? '' : '//'; if (!cm) return;
      var v = ta.value, r = lineSpan(v, ta.selectionStart, ta.selectionEnd), ls_ = v.slice(r[0], r[1]).split('\n');
      var all = ls_.every(function (l) { return !l.trim() || l.replace(/^\s*/, '').indexOf(cm) === 0; });
      var out = ls_.map(function (l) {
        if (!l.trim()) return l;
        return all ? l.replace(cm + ' ', '').replace(cm, '') : l.replace(/^(\s*)/, '$1' + cm + ' ');
      }).join('\n');
      ta.setRangeText(out, r[0], r[1], 'end'); ta.setSelectionRange(r[0], r[0] + out.length); ed_in(ta);
    }
    function edKey(e) {
      var ta = e.target, kk = e.key, c = e.ctrlKey || e.metaKey, lk = (kk || '').toLowerCase();
      if (c && lk === 's') { e.preventDefault(); save(); return; }
      if (c && lk === 'o' && vfsOn) { e.preventDefault(); edOpenDlg(); return; }
      if (kk === 'F5' || (c && kk === 'Enter')) { e.preventDefault(); edRun(); return; }
      if (c && kk === '/') { e.preventDefault(); toggleCm(ta); return; }
      if (kk === 'Tab') { e.preventDefault(); tabKey(ta, e.shiftKey); return; }
      if (kk === 'Enter' && !c && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        var v = ta.value, s = ta.selectionStart, a = v.lastIndexOf('\n', s - 1) + 1, ln = v.slice(a, s), ind = /^[ \t]*/.exec(ln)[0], t = ln.replace(/\s+$/, '');
        if (edL.hash ? /:$/.test(t) : /[{(\[]$/.test(t)) ind += '    ';
        ta.setRangeText('\n' + ind, s, ta.selectionEnd, 'end'); ed_in(ta);
      }
    }
    function edBind() {
      var ta = $('.ce-ta');
      ta.addEventListener('keydown', edKey);
      ta.addEventListener('input', function () { dirty = true; title(); edSync(); });
      ta.addEventListener('scroll', edScroll);
      ['keyup', 'click', 'input'].forEach(function (ev) { ta.addEventListener(ev, function () { var v = ta.value.slice(0, ta.selectionStart).split('\n'); $('.sx-pos').textContent = 'Ln ' + v.length + ', Col ' + (v[v.length - 1].length + 1); }); });
      $('.ce-bar').addEventListener('click', function (e) {
        var b = e.target.closest('[data-e]'); if (!b) return; var a = b.getAttribute('data-e');
        if (a === 'save') save(); else if (a === 'run') edRun(); else if (a === 'new') edNew(); else if (a === 'open') edOpenDlg();
      });
      edInfo();
    }

    /* ---- أوامر الترمنال على الملفات الحقيقية ---- */
    function argv(s) { var o = [], re = /"([^"]*)"|'([^']*)'|(\S+)/g, m; while ((m = re.exec(s))) o.push(m[1] != null ? m[1] : m[2] != null ? m[2] : m[3]); return o; }
    function uq(s) { s = String(s).trim(); var m = /^(["'])([\s\S]*)\1$/.exec(s); return m ? m[2] : s; }
    function protMsg() { return 'Access denied: the C: drive is a protected system drive (read-only). Your files live on D:'; }
    function nfMsg(cmd, arg) {
      return os === 'win' ? cmd + " : Cannot find path '" + arg + "' because it does not exist." : os === 'mac' ? cmd + ': ' + arg + ': No such file or directory' : cmd + ": cannot access '" + arg + "': No such file or directory";
    }
    function rsv(cmd, arg) {
      var id = vfs.resolve(arg, cwd, os);
      if (id === 'denied') return { err: protMsg() };
      var n = id && vfs.get(id); return n ? { n: n } : { err: nfMsg(cmd, arg) };
    }
    function splitPath(arg) {
      var s = String(arg).replace(/\\/g, '/'), j = s.lastIndexOf('/'), pp = j >= 0 ? s.slice(0, j) || '/' : '.', nn = s.slice(j + 1);
      var r = vfs.resolve(pp, cwd, os);
      if (r === 'denied') return { err: protMsg() };
      var n = r && vfs.get(r); if (!n || n.t !== 'd') return { err: nfMsg('path', arg) };
      return { pid: n.id, name: nn };
    }
    function aEmit(p) {
      busy = true; hideIn();
      p.then(function (l) { refreshAll(); emit(l || [], null, 0); }, function (e) { refreshAll(); emit([errMsg(e)], null, 0); });
    }
    function vfsCmd(c) {
      if (!vfsReady) return false;
      var raw = c.trim(), mm = /^(\S+)\s*([\s\S]*)$/.exec(raw), cmd = mm[1].toLowerCase(), rest = mm[2].trim(), av = argv(rest), np = normCmd(c).split(' ');
      var ar = av.filter(function (x) { return !/^-/.test(x) && !/^\/[a-z]$/i.test(x); }), rec = av.some(function (x) { return /^-[a-z]*r/i.test(x) || /^\/s$/i.test(x); });
      var say = function (l) { emit(l, null, 0); return true; }, T = Promise.resolve();
      if (np[0] === 'python') {
        if (np[1] === '-c') { pyExec(c.replace(/^\s*\S+\s+-c\s+/, '').replace(/^([\"'])([\s\S]*)\1$/, '$2'), '<string>'); return true; }
        if (np.length === 1) { startRepl(); return true; }
        var pf = uq(rest);
        if (/\.py$/i.test(pf)) {
          var id = vfs.resolve(pf, cwd, os), n = id && id !== 'denied' && vfs.get(id);
          if (id === 'denied') return say([protMsg()]);
          if (!n) return say(["python: can't open file '" + pf + "': [Errno 2] No such file or directory"]);
          if (n.t === 'd') return say(["python: can't open file '" + pf + "': [Errno 13] Permission denied"]);
          busy = true; hideIn(); vfs.readText(n.id).then(function (t) { pyExec(t, n.n); }); return true;
        }
        return false;
      }
      var r, s;
      switch (cmd) {
        case 'ls': case 'dir': case 'll': case 'gci': case 'get-childitem':
          r = rsv(cmd, ar[0] || '.'); if (r.err) return say([r.err]);
          if (r.n.t === 'f') return say([r.n.n]);
          var ks = vfs.kids(r.n.id).map(function (x) { return x.n + (x.t === 'd' ? (os === 'win' ? '\\' : '/') : ''); });
          return say(os === 'win' ? ks : ks.length ? [ks.join('  ')] : []);
        case 'cd': case 'chdir': case 'set-location': case 'sl':
          if (!ar.length) { cwd = 'r'; refreshPrompt(); return true; }
          r = rsv('cd', ar[0]); if (r.err) return say([r.err]);
          if (r.n.t !== 'd') return say([os === 'win' ? "cd : '" + ar[0] + "' is not a directory." : 'cd: not a directory: ' + ar[0]]);
          cwd = r.n.id; refreshPrompt(); return true;
        case 'pwd': return say([shPath(cwd)]);
        case 'mkdir': case 'md': case 'new-folder':
          if (!ar.length) return say([cmd + ': missing operand']);
          return aEmit(T.then(function () {
            ar.forEach(function (a) {
              if (av.indexOf('-p') >= 0 && !/^([A-Za-z]:|\/)/.test(a)) {
                var cur = cwd; a.replace(/\\/g, '/').split('/').filter(Boolean).forEach(function (pt) { var f = vfs.find(cur, pt); cur = f ? f.id : vfs.mkdir(cur, pt).id; });
              } else { var sp = splitPath(a); if (sp.err) throw { code: 'x', msg: sp.err }; vfs.mkdir(sp.pid, sp.name); }
            }); return [];
          }).catch(function (e) { if (e && e.msg) return [e.msg]; throw e; })), true;
        case 'touch': case 'ni':
          if (!ar.length) return say([cmd + ': missing file operand']);
          return aEmit(ar.reduce(function (p, a) {
            return p.then(function (o) {
              var sp = splitPath(a); if (sp.err) { o.push(sp.err); return o; }
              var ex = vfs.find(sp.pid, sp.name); if (ex) { ex.m = Date.now(); return o; }
              return vfs.mkfile(sp.pid, sp.name, '').then(function () { return o; });
            });
          }, Promise.resolve([]))), true;
        case 'cat': case 'type': case 'gc': case 'get-content':
          if (!ar.length) return say([cmd + ': missing file operand']);
          r = rsv(cmd, ar[0]); if (r.err) return say([r.err]);
          if (r.n.t === 'd') return say([cmd + ': ' + ar[0] + ': Is a directory']);
          if (r.n.b) return say([cmd + ': ' + ar[0] + ': binary file']);
          return aEmit(vfs.readText(r.n.id).then(function (t) { return t === '' ? [] : t.replace(/\n$/, '').split('\n'); })), true;
        case 'rm': case 'del': case 'erase': case 'rmdir': case 'rd': case 'remove-item': case 'ri':
          if (!ar.length) return say([cmd + ': missing operand']);
          var out = [];
          ar.forEach(function (a) {
            var q = rsv(cmd, a); if (q.err) { out.push(q.err); return; }
            if (q.n.id === vfs.desk()) { out.push(cmd + ': cannot remove the Desktop folder'); return; }
            if (q.n.t === 'd' && !rec && !/^(rmdir|rd)$/.test(cmd)) { out.push(os === 'win' ? cmd + " : The item '" + a + "' is a directory. Use -Recurse." : cmd + ": cannot remove '" + a + "': Is a directory (use -r)"); return; }
            if (q.n.t === 'd' && !rec && vfs.kids(q.n.id).length) { out.push(cmd + ": failed to remove '" + a + "': Directory not empty"); return; }
            vfs.trash(q.n.id);
          });
          refreshAll(); return say(out);
        case 'mv': case 'move': case 'ren': case 'rename': case 'mi': case 'move-item': case 'rni': case 'rename-item':
          if (ar.length < 2) return say([cmd + ': missing destination file operand']);
          s = rsv(cmd, ar[0]); if (s.err) return say([s.err]);
          return aEmit(T.then(function () {
            var did = vfs.resolve(ar[1], cwd, os); if (did === 'denied') return [protMsg()];
            var dn = did && vfs.get(did);
            if (dn && dn.t === 'd' && dn.id !== s.n.id) { if (vfs.has(dn.id, s.n.n, s.n.id)) throw vfs.err('exists'); vfs.move(s.n.id, dn.id, s.n.n); return []; }
            var sp = splitPath(ar[1]); if (sp.err) return [sp.err];
            vfs.move(s.n.id, sp.pid, sp.name); return [];
          })), true;
        case 'cp': case 'copy': case 'copy-item': case 'cpi':
          if (ar.length < 2) return say([cmd + ': missing destination file operand']);
          s = rsv(cmd, ar[0]); if (s.err) return say([s.err]);
          if (s.n.t === 'd' && !rec) return say([cmd + ": -r not specified; omitting directory '" + ar[0] + "'"]);
          return aEmit(T.then(function () {
            var did = vfs.resolve(ar[1], cwd, os); if (did === 'denied') return [protMsg()];
            var dn = did && vfs.get(did);
            if (dn && dn.t === 'd') { if (vfs.has(dn.id, s.n.n)) throw vfs.err('exists'); return vfs.copy(s.n.id, dn.id, s.n.n).then(function () { return []; }); }
            var sp = splitPath(ar[1]); if (sp.err) return [sp.err];
            return vfs.copy(s.n.id, sp.pid, sp.name).then(function () { return []; });
          })), true;
        case 'echo': case 'write-output': {
          var m = /^([\s\S]*?)\s*(>>?)\s*("[^"]+"|'[^']+'|\S+)\s*$/.exec(rest);
          if (!m) return say([uq(rest)]);
          var txt = uq(m[1]), sp = splitPath(uq(m[3])), app = m[2] === '>>';
          if (sp.err) return say([sp.err]);
          return aEmit(T.then(function () {
            var ex = vfs.find(sp.pid, sp.name);
            if (ex && ex.t === 'd') return [cmd + ': ' + sp.name + ': Is a directory'];
            if (!ex) return vfs.mkfile(sp.pid, sp.name, txt + '\n').then(function () { return []; });
            return (app ? vfs.readText(ex.id) : Promise.resolve('')).then(function (old) { return vfs.write(ex.id, (app && old && !/\n$/.test(old) ? old + '\n' : old) + txt + '\n'); }).then(function () { return []; });
          })), true;
        }
        case 'explorer': case 'explorer.exe': case 'start': case 'open': case 'xdg-open': case 'ii': case 'nautilus':
          r = rsv(cmd, ar[0] || '.'); if (r.err) return say([r.err]);
          openNode(r.n); return true;
        case 'notepad': case 'nano': case 'gedit': case 'code': case 'edit': case 'vim': case 'vi': case 'subl':
          if (!ar.length) { edNew(); return true; }
          if (ar[0] === '.') { openNode(vfs.get(cwd)); return true; }
          edOpenPath(ar[0]); return true;
        case 'help':
          return say(['python file.py        run a Python file (real Python)', 'python               interactive shell, exit() to leave', 'ls / dir             list files          cd <folder>   change folder', 'mkdir <name>         new folder          touch <file>  new empty file',
            'cat <file>           show a file         echo text > file', 'cp / mv / rm         copy, move, delete (rm sends to the Recycle Bin)', 'code <file>          open in Eto Code    explorer .    open this folder', 'Ctrl+C or Stop       stops a running program', 'Your files live on D: (1 GB). C: is for the system only.']);
        default: return false;
      }
    }

    renderOff(); fit();
    /* إيقاف كامل: بيفصل كل المستمعين والمؤقتات ويفضّي الجهاز */
    function destroy() {
      if (dead) return; dead = true; wkKill(); clearT(); clearInterval(tick);
      off.forEach(function (f) { f(); }); off = [];
      if (ro) ro.disconnect(); if (craf) cancelAnimationFrame(craf);
      try { if (document.fullscreenElement === root_ && document.exitFullscreen) document.exitFullscreen(); } catch (e) {}
      kbLock(false); el.innerHTML = '';
    }
    return { destroy: destroy };
  }

  root.PySim = { mount: mount, util: { normCmd: normCmd, cmdOk: cmdOk, codeOk: codeOk, explain: explain, runPy: runPy } };
})(typeof window !== 'undefined' ? window : globalThis);
