/* ===== صفحة المكتبات: كل المكتبات (Lib.json) + بحث + طريقة التسطيب ===== */
(function () {
  var LIB_URL = 'Data/Programming/Python/Data/Lib.json';
  var PAGE = 60;
  var esc = function (s) { return window.PY.esc(s); };
  var state = { all: null, list: [], shown: 0, q: '', sort: 'rank', info: {} };
  var OS_KEY = 'eto_py_os';

  function detectOS() {
    var u = (navigator.userAgent || '') + ' ' + (navigator.platform || '');
    if (/Win/i.test(u)) return 'win';
    if (/Mac|iPhone|iPad/i.test(u)) return 'mac';
    return 'linux';
  }
  function getOS() { try { return localStorage.getItem(OS_KEY) || detectOS(); } catch (e) { return detectOS(); } }
  function setOS(os) { try { localStorage.setItem(OS_KEY, os); } catch (e) {} }

  var fmt = (function () { try { return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }); } catch (e) { return { format: function (n) { return String(n); } }; } })();
  function norm(s) { return String(s).toLowerCase().replace(/[_.]/g, '-'); }

  function cmd(text, noPrompt) {
    return '<div class="lib-cmd"><code>' + (noPrompt ? '' : '<span class="pr">$ </span>') + esc(text) + '</code>' +
      '<button class="lib-copy" data-copy="' + esc(text) + '" aria-label="نسخ"><i class="fa-regular fa-copy"></i></button></div>';
  }

  function pyCmd(os) { return os === 'win' ? 'python' : 'python3'; }

  /* ---------- دليل التسطيب ---------- */
  function guideHtml(os) {
    var py = pyCmd(os), s = 1;
    function step(title, body) { return '<div class="lib-step"><div class="lib-step-n">' + (s++) + '</div><div class="lib-step-b"><h4>' + title + '</h4>' + body + '</div></div>'; }
    var h = '';
    h += step('اتأكد إن Python متسطّب',
      cmd(py + ' --version') + (os === 'win' ? '<p>لو الأمر ماشتغلش جرّب <b dir="ltr">py --version</b>. ولو لسه مش متسطّب نزّله من python.org وعلّم على <b dir="ltr">Add python.exe to PATH</b> وقت التسطيب.</p>'
        : os === 'mac' ? '<p>لو مش متسطّب نزّله من python.org أو بـ <b dir="ltr">brew install python</b>.</p>'
        : '<p>غالبًا متسطّب. ولو لأ على Ubuntu/Debian: <b dir="ltr">sudo apt install python3 python3-pip python3-venv</b></p>'));
    h += step('اتأكد إن pip شغال', cmd(py + ' -m pip --version') + (os === 'win' ? '' : '<p>لو مش موجود: <b dir="ltr">' + py + ' -m ensurepip --upgrade</b></p>'));
    h += step('سطّب أي مكتبة', cmd(py + ' -m pip install requests') + '<p>غيّر <b dir="ltr">requests</b> باسم المكتبة اللي عايزها (اتأكد من الاسم من القايمة تحت).</p>');
    h += step('الأفضل: بيئة افتراضية لكل مشروع (venv)',
      cmd(py + ' -m venv venv') +
      (os === 'win' ? cmd('venv\\Scripts\\activate') : cmd('source venv/bin/activate')) +
      '<p>بعد التفعيل هتلاقي <b dir="ltr">(venv)</b> في أول السطر، وأي مكتبة تسطّبها هتبقى جوه المشروع ده بس.</p>' +
      (os === 'win' ? '<div class="lib-warn">لو PowerShell قال إن تشغيل السكريبتات متعطل، نفّذ مرة واحدة: <b dir="ltr">Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</b> أو استخدم Command Prompt.</div>'
        : os === 'linux' ? '<div class="lib-warn">لو ظهرلك خطأ <b dir="ltr">externally-managed-environment</b> في توزيعات لينكس الحديثة، استخدم venv زي اللي فوق بدل التسطيب على السيستم.</div>' : ''));
    h += step('أوامر مفيدة',
      cmd(py + ' -m pip list') + cmd(py + ' -m pip show requests') + cmd(py + ' -m pip install --upgrade requests') +
      cmd(py + ' -m pip uninstall requests') + cmd(py + ' -m pip freeze > requirements.txt') + cmd(py + ' -m pip install -r requirements.txt'));
    if (os === 'win') h += '<div class="lib-warn">لو ظهرلك <b dir="ltr">\'pip\' is not recognized</b> استخدم <b dir="ltr">python -m pip</b> أو <b dir="ltr">py -m pip</b> بدل <b dir="ltr">pip</b> لوحدها.</div>';
    return h;
  }

  function osTabs(os, fn) {
    return '<div class="lib-os">' + [['win', 'fa-windows', 'Windows'], ['mac', 'fa-apple', 'macOS'], ['linux', 'fa-linux', 'Linux']].map(function (o) {
      return '<button class="' + (o[0] === os ? 'on' : '') + '" onclick="' + fn + '(\'' + o[0] + '\')"><i class="fa-brands ' + o[1] + '"></i> ' + o[2] + '</button>';
    }).join('') + '</div>';
  }

  window.PyLibs = {
    setOS: function (os) { setOS(os); var g = document.getElementById('lib-guide-inner'); if (g) g.innerHTML = osTabs(os, 'PyLibs.setOS') + guideHtml(os); },
    toggleGuide: function () { document.getElementById('lib-guide').classList.toggle('open'); },
    more: function () { appendChunk(); },
    open: function (name) { openModal(name); },
    close: function () { document.getElementById('lib-modal').classList.remove('show'); },
    setModalOS: function (os) { setOS(os); renderModal(state.modalName); }
  };

  /* ---------- قايمة المكتبات ---------- */
  function applyFilter() {
    var q = norm(state.q.trim()), all = state.all || [];
    var list = q ? all.filter(function (p) { return norm(p.name).indexOf(q) > -1; }) : all.slice();
    if (state.sort === 'az') list.sort(function (a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
    else if (state.sort === 'za') list.sort(function (a, b) { return a.name < b.name ? 1 : a.name > b.name ? -1 : 0; });
    else if (q) {
      var sc = function (p) { var n = norm(p.name); return n === q ? 0 : n.indexOf(q) === 0 ? 1 : 2; };
      list.sort(function (a, b) { return sc(a) - sc(b) || a.rank - b.rank; });
    }
    state.list = list; state.shown = 0;
    var grid = document.getElementById('lib-grid');
    if (grid) grid.innerHTML = '';
    appendChunk();
    var c = document.getElementById('lib-count');
    if (c) c.textContent = list.length.toLocaleString('en') + ' مكتبة' + (q ? ' مطابقة' : '');
  }

  function card(p, q) {
    var n = esc(p.name);
    if (q) {
      var i = norm(p.name).indexOf(q);
      if (i > -1) n = esc(p.name.slice(0, i)) + '<mark>' + esc(p.name.slice(i, i + q.length)) + '</mark>' + esc(p.name.slice(i + q.length));
    }
    return '<div class="lib-card" onclick="PyLibs.open(\'' + esc(p.name).replace(/'/g, '') + '\')">' +
      '<div class="lib-card-top"><span class="lib-rank">#' + p.rank + '</span><span class="lib-dl"><i class="fa-solid fa-download"></i> ' + fmt.format(p.downloads) + '</span></div>' +
      '<h4 class="lib-name">' + n + '</h4>' + cmd('pip install ' + p.name, true) + '</div>';
  }

  function appendChunk() {
    var grid = document.getElementById('lib-grid'), btn = document.getElementById('lib-more');
    if (!grid) return;
    var q = norm(state.q.trim());
    var next = state.list.slice(state.shown, state.shown + PAGE);
    grid.insertAdjacentHTML('beforeend', next.map(function (p) { return card(p, q); }).join(''));
    state.shown += next.length;
    if (btn) btn.style.display = state.shown < state.list.length ? 'block' : 'none';
    var e = document.getElementById('lib-empty');
    if (e) e.style.display = state.list.length ? 'none' : 'block';
  }

  /* ---------- تفاصيل مكتبة ---------- */
  function renderModal(name) {
    var p = (state.all || []).filter(function (x) { return x.name === name; })[0];
    if (!p) return;
    state.modalName = name;
    var os = getOS(), py = pyCmd(os), url = 'https://pypi.org/project/' + encodeURIComponent(name) + '/';
    document.getElementById('lib-sheet').innerHTML =
      '<div class="lib-sheet-head"><h3>' + esc(name) + '</h3><button onclick="PyLibs.close()" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button></div>' +
      '<div class="lib-chips"><span>الترتيب #' + p.rank + '</span><span><i class="fa-solid fa-download"></i> ' + p.downloads.toLocaleString('en') + ' تحميل</span></div>' +
      osTabs(os, 'PyLibs.setModalOS') +
      '<div class="lib-step-b"><h4>تسطيب</h4>' + cmd(py + ' -m pip install ' + name) +
      '<h4 style="margin-top:12px">تحديث</h4>' + cmd(py + ' -m pip install --upgrade ' + name) +
      '<h4 style="margin-top:12px">معلومات عن المكتبة المتسطّبة</h4>' + cmd(py + ' -m pip show ' + name) +
      '<h4 style="margin-top:12px">حذف</h4>' + cmd(py + ' -m pip uninstall ' + name) + '</div>' +
      '<div class="lib-links"><a href="' + url + '" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> صفحتها على PyPI (الشرح والتوثيق)</a></div>';
  }
  function openModal(name) { renderModal(name); document.getElementById('lib-modal').classList.add('show'); }

  /* ---------- رسم الصفحة ---------- */
  function build(root) {
    var os = getOS();
    root.innerHTML =
      '<div class="prg-hero py-hero py-hero-sm" style="background:linear-gradient(135deg,#7c2d12,#ea580c 60%,#fbbf24)">' + window.PY.crumb('Python') +
        '<div class="prg-hero-top"><div class="prg-hero-icon" style="background:#fff;color:#ea580c"><i class="fa-solid fa-cubes"></i></div>' +
        '<div><h1>مكتبات Python</h1><p>تصفّح أشهر المكتبات، دوّر بالاسم، وانسخ أمر التسطيب</p></div></div></div>' +
      '<div id="lib-guide" class="lib-guide open"><button class="lib-guide-head" onclick="PyLibs.toggleGuide()"><span class="ic"><i class="fa-solid fa-terminal"></i></span><b>إزاي أسطّب مكتبة على جهازي؟</b><i class="chev fa-solid fa-chevron-down"></i></button>' +
        '<div class="lib-guide-body"><div id="lib-guide-inner">' + osTabs(os, 'PyLibs.setOS') + guideHtml(os) + '</div></div></div>' +
      '<div class="lib-bar"><div class="prg-search"><i class="fa-solid fa-magnifying-glass"></i><input id="lib-search" type="search" placeholder="ابحث باسم المكتبة... (numpy, requests, flask)" autocomplete="off"></div>' +
        '<select id="lib-sort" class="lib-sort"><option value="rank">الأشهر أولًا</option><option value="az">A → Z</option><option value="za">Z → A</option></select></div>' +
      '<div class="lib-info"><span id="lib-count">جاري التحميل...</span><span id="lib-date"></span></div>' +
      '<div class="py-note" style="margin-top:10px">الأرقام تحميلات آخر 30 يوم تقريبًا. وبعض المكتبات في الأول (زي urllib3 وcertifi) بتتثبت تلقائيًا مع مكتبات تانية، فمش لازم تتعلمها لوحدها.</div>' +
      '<div id="lib-grid" class="lib-grid"></div>' +
      '<div id="lib-empty" class="prg-empty" style="display:none">مفيش مكتبة بالاسم ده في القايمة. ممكن تكون موجودة على PyPI بس مش من الأشهر.</div>' +
      '<button id="lib-more" class="lib-more" style="display:none" onclick="PyLibs.more()">عرض المزيد</button>' +
      '<div id="lib-modal" class="lib-modal" onclick="if(event.target===this)PyLibs.close()"><div id="lib-sheet" class="lib-sheet prg-scroll"></div></div>';

    var inp = document.getElementById('lib-search'), sel = document.getElementById('lib-sort'), t;
    inp.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = inp.value; applyFilter(); }, 120); });
    sel.addEventListener('change', function () { state.sort = sel.value; applyFilter(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { if (en[0].isIntersecting && state.list.length > state.shown) appendChunk(); }, { rootMargin: '300px' }).observe(document.getElementById('lib-more'));
    }
  }

  function fillData() {
    var d = state.info.last_update;
    var el = document.getElementById('lib-date');
    if (el && d) el.textContent = 'آخر تحديث للبيانات: ' + String(d).slice(0, 10);
    applyFilter();
  }

  window.loadPythonLibs = function () {
    var root = document.getElementById('python-libs-root');
    if (!root) return;
    build(root);
    if (state.all) { fillData(); return; }
    fetch(LIB_URL).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      state.all = j.packages || j; state.info = j; fillData();
    }).catch(function () {
      var c = document.getElementById('lib-count');
      if (c) c.innerHTML = '<span style="color:#b91c1c">مش قادر أحمّل ' + LIB_URL + ' — اتأكد من المسار وإن الموقع شغال على سيرفر (مش فتح الملف مباشر).</span>';
    });
  };
})();
