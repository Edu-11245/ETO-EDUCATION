(function (root) {
  var CFG = root.ETO_CONFIG || {}, SDK = 'https://www.gstatic.com/firebasejs/9.23.0/';
  var SAVED = 'eto_saved_login', libP = null, A = null, DB = null;
  var E = { user: null, profile: null };
  var JOBS = ['طالب مدرسة', 'طالب جامعة', 'موظف', 'مبرمج', 'صاحب شغل حر', 'مش شغال دلوقتي', 'أخرى'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };

  var loaded = {};
  function script(src) {
    if (loaded[src]) return loaded[src];
    return loaded[src] = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { s.remove(); delete loaded[src]; rej(new Error('load')); };
      document.head.appendChild(s);
    });
  }
  function css() {
    if (document.getElementById('eto-auth-css')) return;
    var l = document.createElement('link'); l.id = 'eto-auth-css'; l.rel = 'stylesheet';
    l.href = ((root.PythonCourse && root.PythonCourse.base) || 'Data/Programming/Python/Course/') + 'auth.css?v=2'; document.head.appendChild(l);
  }
  function lib() {
    if (libP) return libP;

    var p = root.firebase ? Promise.resolve() : script(SDK + 'firebase-app-compat.js');
    libP = p
      .then(function () { return Promise.all([
        root.firebase.auth ? 0 : script(SDK + 'firebase-auth-compat.js'),
        root.firebase.database ? 0 : script(SDK + 'firebase-database-compat.js')]); })
      .then(function () {
        var u = CFG.firebase && CFG.firebase.databaseURL;
        if (!/^https:\/\/[\w-]+(\.[\w-]+)*\.(firebaseio\.com|firebasedatabase\.app)\/?$/.test(u || '')) { var er = new Error('cfg'); er.code = 'eto/no-database-url'; throw er; }
        var app = root.firebase.apps.filter(function (a) { return a.name === 'eto-pc'; })[0] || root.firebase.initializeApp(CFG.firebase, 'eto-pc');
        A = app.auth(); DB = app.database();
        A.languageCode = 'ar';
      })
      .catch(function (e) { libP = null; throw e; });
    return libP;
  }
  function msg(e) {
    var c = (e && e.code) || '';
    var m = {
      'auth/invalid-email': 'الإيميل مش مكتوب صح.',
      'auth/missing-password': 'اكتب الباسورد.',
      'auth/weak-password': 'الباسورد ضعيف، لازم 6 حروف أو أرقام على الأقل.',
      'auth/email-already-in-use': 'الإيميل ده عنده حساب بالفعل. جرّب تسجيل الدخول.',
      'auth/user-not-found': 'مفيش حساب بالإيميل ده.',
      'auth/wrong-password': 'الباسورد غلط.',
      'auth/invalid-credential': 'الإيميل أو الباسورد غلط.',
      'auth/too-many-requests': 'محاولات كتير. استنى شوية وجرّب تاني.',
      'auth/network-request-failed': 'مفيش اتصال بالنت.',
      'auth/popup-closed-by-user': 'قفلت نافذة جوجل قبل ما تكمّل.',
      'auth/cancelled-popup-request': 'قفلت نافذة جوجل قبل ما تكمّل.',
      'auth/popup-blocked': 'المتصفح منع نافذة جوجل. اسمح بالنوافذ المنبثقة.',
      'auth/unauthorized-domain': 'دومين الموقع مش مضاف في Firebase (Authentication > Settings > Authorized domains).',
      'auth/operation-not-allowed': 'طريقة الدخول دي مش مفعّلة في Firebase Console.',
      'PERMISSION_DENIED': 'قواعد Realtime Database بتمنع الوصول. راجع الرولز.'
    };
    return m[c] || ('حصلت مشكلة (' + (c || 'غير معروفة') + ').');
  }

  function loadProfile(uid) { return DB.ref('users/' + uid).once('value').then(function (d) { return d.val(); }); }
  function saveProfile(u, p) {
    var T = root.firebase.database.ServerValue.TIMESTAMP, ref = DB.ref('users/' + u.uid);
    var data = {
      name: p.name, age: p.age, job: p.job, email: u.email || '', photo: p.photo || (u.photoURL || ''),
      createdAt: p.createdAt || T, updatedAt: T
    };
    return ref.update(data).then(function () { return ref.once('value'); }).then(function (d) { return d.val(); });
  }
  E.updateProfile = function (patch) {
    if (!E.user) return Promise.reject(new Error('no user'));
    var n = Object.assign({}, E.profile, patch);
    return saveProfile(E.user, n).then(function (d) { E.profile = d; return d; });
  };

  var LAMP = { on: false, api: null };

  function lampBase() { return (root.PythonCourse && root.PythonCourse.base) || 'Data/Programming/Python/Course/'; }

  function lampSet(st, on, fromLamp) {
    LAMP.on = on;
    st.classList.toggle('on', on);
    if (!fromLamp && LAMP.api) LAMP.api.set(on);
  }

  function dust(st) {
    var h = '', i;
    for (i = 0; i < 18; i++) {
      var a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 230;
      h += '<i style="--x:' + Math.round(Math.cos(a) * r) + 'px;--y:' + Math.round(Math.sin(a) * r * 0.8) + 'px;--mx:' + Math.round(Math.random() * 40 - 20) + 'px;--my:' + Math.round(-10 - Math.random() * 40) + 'px;--d:' + (5 + Math.random() * 6).toFixed(1) + 's;--b:' + (1.5 + Math.random() * 3).toFixed(1) + 's"></i>';
    }
    st.querySelector('.au-dust').innerHTML = h;
  }

  function stage(box) {
    var st = box.firstElementChild;
    if (st && st.__eto) return st;
    LAMP.on = false; LAMP.api = null;
    box.innerHTML = '<div class="au" dir="rtl"><div class="au-sky"></div><div class="au-glow"></div><div class="au-dust"></div><div class="au-hint"><b></b><span>اضغط على الأباجورة</span></div><div class="au-stat"></div><div class="au-side"></div></div>';
    st = box.firstElementChild; st.__eto = true;
    dust(st);
    script(lampBase() + 'lamp.js?v=1').then(function () {
      if (!st.isConnected || !root.EtoLamp) return;
      LAMP.api = root.EtoLamp.mount(st, { on: LAMP.on, onToggle: function (v) { lampSet(st, v, true); } });
    }, function () { lampSet(st, true, true); });
    return st;
  }

  function shell(box, inner, view) {
    var st = stage(box), side = st.querySelector('.au-side');
    side.innerHTML = '<div class="au-card' + (st.classList.contains('on') ? ' au-swap' : '') + '"><div class="au-logo"><i class="fa-solid fa-laptop-code"></i></div>' + inner + '</div>';
    st.classList.remove('chk');
    st.classList.toggle('lg', view === 'login');
    if (view !== 'login' && !LAMP.on) lampSet(st, true, false);
    return side.firstChild;
  }

  function status(box, text) {
    var st = stage(box);
    st.classList.add('chk'); st.classList.remove('lg');
    st.querySelector('.au-stat').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>' + esc(text) + '</span>';
    st.querySelector('.au-side').innerHTML = '';
  }
  function setErr(card, t) { var e = card.querySelector('.au-err'); if (e) { e.textContent = t || ''; e.style.display = t ? '' : 'none'; } }
  function busy(card, on) { card.querySelectorAll('button,input,select').forEach(function (x) { x.disabled = on; }); card.classList.toggle('au-busy', on); }

  function showLogin(box, alive, done, mode) {
    var sv = E.getSaved(), signup = mode === 'up';
    var card = shell(box,
      '<h2>' + (signup ? 'إنشاء حساب جديد' : 'أهلاً بيك') + '</h2>' +
      '<p class="au-sub">' + (signup ? 'سجّل عشان يبقى عندك جهازك وملفاتك على قرص D.' : 'سجّل دخولك عشان تفتح جهازك وملفاتك.') + '</p>' +
      (sv && !signup ? '<div class="au-saved"><i class="fa-solid fa-circle-user"></i><span>' + esc(sv.name || sv.email) + '</span></div>' : '') +
      '<button class="au-g" type="button"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/></svg><span>المتابعة بحساب جوجل</span></button>' +
      '<div class="au-or"><span>أو</span></div>' +
      '<label>الإيميل<input class="au-em" type="email" autocomplete="email" dir="ltr" value="' + esc(!signup && sv ? sv.email : '') + '"></label>' +
      '<label>الباسورد<input class="au-pw" type="password" autocomplete="' + (signup ? 'new-password' : 'current-password') + '" dir="ltr"></label>' +
      '<div class="au-err" style="display:none"></div>' +
      '<button class="au-go" type="button">' + (signup ? 'إنشاء الحساب' : 'تسجيل الدخول') + '</button>' +
      (signup ? '' : '<button class="au-lnk" data-a="reset" type="button">نسيت الباسورد؟</button>') +
      '<button class="au-lnk" data-a="sw" type="button">' + (signup ? 'عندي حساب بالفعل' : 'معنديش حساب. إنشاء حساب جديد') + '</button>', 'login');

    var em = card.querySelector('.au-em'), pw = card.querySelector('.au-pw');
    function run(p) {
      setErr(card, ''); busy(card, true);
      p.then(function (r) { if (alive()) after(box, alive, done, r.user); }, function (e) { if (!alive()) return; busy(card, false); setErr(card, msg(e)); });
    }
    card.querySelector('.au-g').onclick = function () {
      var pr = new root.firebase.auth.GoogleAuthProvider(); pr.setCustomParameters({ prompt: 'select_account' });
      run(A.signInWithPopup(pr));
    };
    card.querySelector('.au-go').onclick = function () {
      var e = em.value.trim(), p = pw.value;
      if (!e || !p) return setErr(card, 'اكتب الإيميل والباسورد.');
      run(signup ? A.createUserWithEmailAndPassword(e, p) : A.signInWithEmailAndPassword(e, p));
    };
    pw.onkeydown = em.onkeydown = function (ev) { if (ev.key === 'Enter') card.querySelector('.au-go').click(); };
    card.querySelector('[data-a="sw"]').onclick = function () { showLogin(box, alive, done, signup ? 'in' : 'up'); };
    var rs = card.querySelector('[data-a="reset"]');
    if (rs) rs.onclick = function () {
      var e = em.value.trim(); if (!e) return setErr(card, 'اكتب الإيميل الأول وبعدين اضغط "نسيت الباسورد".');
      busy(card, true);
      A.sendPasswordResetEmail(e).then(function () { busy(card, false); setErr(card, ''); var s = card.querySelector('.au-sub'); s.textContent = 'بعتنا لك رسالة على ' + e + ' لتغيير الباسورد.'; s.classList.add('ok'); },
        function (er) { busy(card, false); setErr(card, msg(er)); });
    };
  }

  function showProfile(box, alive, done, u, old) {
    var jobs = JOBS.map(function (j) { return '<option>' + j + '</option>'; }).join('');
    var card = shell(box,
      '<h2>كمّل بياناتك</h2><p class="au-sub">خطوة أخيرة عشان نعرفك.</p>' +
      '<label>الاسم<input class="pf-n" type="text" maxlength="40" value="' + esc((old && old.name) || u.displayName || '') + '"></label>' +
      '<label>السن الحقيقي<input class="pf-a" type="number" min="5" max="99" inputmode="numeric" dir="ltr" value="' + esc((old && old.age) || '') + '"></label>' +
      '<label>شغلك إيه؟<select class="pf-j"><option value="">اختار...</option>' + jobs + '</select></label>' +
      '<label class="pf-ow" style="display:none">اكتب شغلك<input class="pf-o" type="text" maxlength="40"></label>' +
      '<div class="au-err" style="display:none"></div>' +
      '<button class="au-go" type="button">حفظ وفتح الجهاز</button>' +
      '<button class="au-lnk" data-a="out" type="button">تسجيل الخروج</button>');
    var j = card.querySelector('.pf-j'), ow = card.querySelector('.pf-ow');
    if (old && old.job) { if (JOBS.indexOf(old.job) >= 0) j.value = old.job; else { j.value = 'أخرى'; ow.style.display = ''; card.querySelector('.pf-o').value = old.job; } }
    j.onchange = function () { ow.style.display = j.value === 'أخرى' ? '' : 'none'; };
    card.querySelector('[data-a="out"]').onclick = function () { A.signOut().then(function () { if (alive()) showLogin(box, alive, done, 'in'); }); };
    card.querySelector('.au-go').onclick = function () {
      var n = card.querySelector('.pf-n').value.trim(), a = parseInt(card.querySelector('.pf-a').value, 10), jb = j.value === 'أخرى' ? card.querySelector('.pf-o').value.trim() : j.value;
      if (n.length < 2) return setErr(card, 'اكتب اسمك.');
      if (!(a >= 5 && a <= 99)) return setErr(card, 'اكتب سنك الحقيقي (من 5 لـ 99).');
      if (!jb) return setErr(card, 'قولنا شغلك إيه.');
      setErr(card, ''); busy(card, true);
      saveProfile(u, { name: n, age: a, job: jb, photo: old && old.photo, createdAt: old && old.createdAt }).then(function (d) {
        if (!alive()) return; E.user = u; E.profile = d; done({ user: u, profile: d });
      }, function (e) { if (!alive()) return; busy(card, false); setErr(card, msg(e)); });
    };
  }

  function after(box, alive, done, u) {
    E.user = u;
    shell(box, '<div class="au-wait"><i class="fa-solid fa-spinner fa-spin"></i> جاري تحميل حسابك...</div>');
    loadProfile(u.uid).then(function (p) {
      if (!alive()) return;
      if (p && p.name && p.age && p.job) { E.profile = p; done({ user: u, profile: p }); } else showProfile(box, alive, done, u, p);
    }, function (e) {
      if (!alive()) return;
      var c = shell(box, '<h2>مشكلة في تحميل الحساب</h2><p class="au-sub">' + esc(msg(e)) + '</p><button class="au-go" type="button">حاول تاني</button><button class="au-lnk" data-a="out" type="button">تسجيل الخروج</button>');
      c.querySelector('.au-go').onclick = function () { after(box, alive, done, u); };
      c.querySelector('[data-a="out"]').onclick = function () { A.signOut().then(function () { if (alive()) showLogin(box, alive, done, 'in'); }); };
    });
  }

  E.gate = function (box, alive) {
    alive = alive || function () { return true; }; css();
    return new Promise(function (res, rej) {
      status(box, 'جاري التحقق من الحساب...');
      lib().then(function () {
        if (!alive()) return;
        var first = true, off = A.onAuthStateChanged(function (u) {
          if (!first) return; first = false; off();
          if (!alive()) return;
          if (u) after(box, alive, res, u); else showLogin(box, alive, res, 'in');
        });
      }, function (e) {
        if (!alive()) return;
        var cfg = e && e.code === 'eto/no-database-url';
        var c = shell(box, '<h2>' + (cfg ? 'إعدادات Firebase ناقصة' : 'مش قادر أوصل لـFirebase') + '</h2><p class="au-sub">' + (cfg ? 'حط رابط Realtime Database في <b dir="ltr">databaseURL</b> جوه config.js.' : 'اتأكد من الاتصال بالنت وجرّب تاني.') + '</p><button class="au-go" type="button">حاول تاني</button>');
        c.querySelector('.au-go').onclick = function () { E.gate(box, alive).then(res, rej); };
      });
    });
  };

  E.getSaved = function () { try { return JSON.parse(localStorage.getItem(SAVED)) || null; } catch (e) { return null; } };
  E.forget = function () { try { localStorage.removeItem(SAVED); } catch (e) {} };

  E.signOut = function (onDone) {
    var u = E.user, p = E.profile || {}, d = document.createElement('div');
    d.className = 'au-ov'; d.dir = 'rtl';
    d.innerHTML = '<div class="au-dlg"><h3>تسجيل الخروج</h3><p>تحب نحفظ بيانات تسجيل الدخول على الجهاز ده؟ ' +
      'هنحفظ الإيميل والاسم بس (من غير الباسورد) عشان تدخل أسرع، وتقدر تمسحهم أو تشوفهم في <b>الإعدادات &gt; الحساب</b>.</p>' +
      '<div class="au-row"><button class="au-go" data-v="y">احفظ وسجّل خروج</button><button class="au-sec" data-v="n">سجّل خروج من غير حفظ</button><button class="au-lnk" data-v="x">إلغاء</button></div></div>';
    document.body.appendChild(d);
    d.onclick = function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-v'); if (!v) return;
      d.remove(); if (v === 'x') return;
      try { if (v === 'y' && u) localStorage.setItem(SAVED, JSON.stringify({ email: u.email || '', name: p.name || '', photo: p.photo || '' })); else E.forget(); } catch (er) {}
      (A ? A.signOut() : Promise.resolve()).then(function () { E.user = null; E.profile = null; if (onDone) onDone(); });
    };
  };

  root.EtoAuth = E;
})(window);
