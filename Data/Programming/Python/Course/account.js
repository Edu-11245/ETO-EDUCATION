/* ===== قسم "الحساب" جوه الإعدادات =====
   EtoAcct.mount(el, { fs, cloud, onProfile(profile), onSignOut() }) => { destroy }
   بيعرض: الصورة والبيانات وتعديلهم، التخزين السحابي (مزامنة/مسح/إنشاء)، بيانات الدخول المحفوظة، تسجيل الخروج. */
(function (root) {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var JOBS = ['طالب مدرسة', 'طالب جامعة', 'موظف', 'مبرمج', 'صاحب شغل حر', 'مش شغال دلوقتي', 'أخرى'];
  var CAP = (root.ETO_CONFIG && root.ETO_CONFIG.limits && root.ETO_CONFIG.limits.freeBytes) || 1073741824;

  function fmt(b) { if (b < 1024) return b + ' B'; var u = ['KB', 'MB', 'GB'], i = -1; do { b /= 1024; i++; } while (b >= 1024 && i < 2); return (b < 10 ? b.toFixed(1) : Math.round(b)) + ' ' + u[i]; }
  function ago(t) {
    if (!t) return ''; var s = Math.max(0, Math.round((Date.now() - t) / 1000));
    return s < 60 ? 'من شوية' : s < 3600 ? 'من ' + Math.round(s / 60) + ' دقيقة' : s < 86400 ? 'من ' + Math.round(s / 3600) + ' ساعة' : 'من ' + Math.round(s / 86400) + ' يوم';
  }
  var STATE = {
    init: ['جاري التجهيز...', 'sy'], syncing: ['جاري المزامنة...', 'sy'], pending: ['فيه تعديلات هتتحفظ حالاً...', 'sy'],
    ok: ['محفوظ على السحابة', 'ok'], offline: ['مفيش نت. هتتزامن لما يرجع.', 'er'], limit: ['وصلت حد الطلبات في الساعة. هتكمل بعد شوية.', 'er'],
    space: ['مساحة قرص D مش كفاية لتنزيل ملفات السحابة.', 'er'], noconfig: ['التخزين السحابي مش متظبط (التوكن ناقص).', 'er'],
    auth: ['توكن GitHub غلط أو منتهي.', 'er'], off: ['التخزين السحابي متقفل. ملفاتك على الجهاز ده بس.', 'of'], error: ['حصلت مشكلة في المزامنة.', 'er']
  };
  function resize(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onerror = function () { rej(new Error('read')); };
      r.onload = function () {
        var im = new Image(); im.onerror = function () { rej(new Error('img')); };
        im.onload = function () {
          var c = document.createElement('canvas'), S = 128, m = Math.min(im.width, im.height);
          c.width = c.height = S; c.getContext('2d').drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, S, S);
          res(c.toDataURL('image/jpeg', 0.82));
        };
        im.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }
  function ask(title, msg, ok) {
    return new Promise(function (res) {
      var d = document.createElement('div'); d.className = 'au-ov'; d.dir = 'rtl';
      d.innerHTML = '<div class="au-dlg"><h3>' + esc(title) + '</h3><p>' + msg + '</p><div class="au-row"><button class="au-go" data-v="y" style="background:#dc2626">' + esc(ok) + '</button><button class="au-lnk" data-v="x">إلغاء</button></div></div>';
      d.onclick = function (e) { var v = e.target.getAttribute && e.target.getAttribute('data-v'); if (!v) return; d.remove(); res(v === 'y'); };
      document.body.appendChild(d);
    });
  }

  function mount(el, o) {
    var A = root.EtoAuth, fs = o.fs, cloud = o.cloud, off = null, dead = false, editing = false, note = '';
    if (!el || !A || !A.user) return { destroy: function () {} };

    function draw() {
      if (dead || !el.isConnected) return;
      var p = A.profile || {}, sv = A.getSaved(), st = cloud ? cloud.status() : { state: 'off' }, S = STATE[st.state] || STATE.error;
      var used = fs ? fs.m.used : 0, pct = Math.min(100, Math.max(used ? 1 : 0, Math.round(used / CAP * 100)));
      var jobOpts = JOBS.map(function (j) { return '<option' + (j === p.job ? ' selected' : '') + '>' + j + '</option>'; }).join('');
      var other = p.job && JOBS.indexOf(p.job) < 0;
      el.innerHTML = '<div class="ac" dir="rtl">' +
        '<div class="ac-h"><label class="ac-av" title="تغيير الصورة"><b>' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : esc((p.name || '?').trim().charAt(0))) + '</b><i class="fa-solid fa-camera"></i><input type="file" accept="image/*" hidden data-f="photo"></label>' +
        '<div class="ac-id"><strong>' + esc(p.name) + '</strong><small dir="ltr">' + esc(A.user.email || '') + '</small></div></div>' +
        (editing
          ? '<div class="ac-form"><input data-f="name" maxlength="40" value="' + esc(p.name) + '" placeholder="الاسم"><input data-f="age" type="number" min="5" max="99" dir="ltr" value="' + esc(p.age) + '" placeholder="السن">' +
            '<select data-f="job">' + jobOpts + (other ? '<option selected>' + esc(p.job) + '</option>' : '') + '</select>' +
            '<input data-f="job2" maxlength="40" placeholder="اكتب شغلك" style="display:none"><div class="ac-row"><button data-a="save" class="ac-b p">حفظ</button><button data-a="cancel" class="ac-b">إلغاء</button></div></div>'
          : '<div class="ac-meta">' + esc(p.age) + ' سنة • ' + esc(p.job) + '</div><button data-a="edit" class="ac-b">تعديل بياناتي</button>') +
        (note ? '<div class="ac-note">' + esc(note) + '</div>' : '') +
        '<div class="ac-sec"><h5><i class="fa-solid fa-cloud"></i> التخزين السحابي</h5>' +
        '<div class="ac-bar"><i style="width:' + pct + '%"></i></div><small>' + fmt(used) + ' من ' + fmt(CAP) + '</small>' +
        '<div class="ac-st ' + S[1] + '">' + esc(st.state === 'error' && st.msg ? S[0] + ' (' + st.msg + ')' : S[0]) + (st.state === 'ok' && st.at ? ' ' + ago(st.at) : '') + '</div>' +
        (cloud ? (st.state === 'off'
          ? '<button data-a="enable" class="ac-b p">إنشاء التخزين السحابي</button>'
          : '<div class="ac-row"><button data-a="sync" class="ac-b p">مزامنة الآن</button><button data-a="remove" class="ac-b d">مسح السحابة</button></div>') : '') + '</div>' +
        '<div class="ac-sec"><h5><i class="fa-solid fa-key"></i> بيانات الدخول المحفوظة</h5>' +
        (sv ? '<small dir="ltr">' + esc(sv.email) + '</small><button data-a="forget" class="ac-b">مسح المحفوظ</button>' : '<small>مفيش بيانات محفوظة. بتتحفظ لما تسجّل خروج وتختار "احفظ".</small>') + '</div>' +
        '<button data-a="out" class="ac-b d out"><i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج</button></div>';
      var j = el.querySelector('[data-f="job"]'), j2 = el.querySelector('[data-f="job2"]');
      if (j) { var up = function () { j2.style.display = j.value === 'أخرى' ? '' : 'none'; }; j.onchange = up; up(); }
    }
    function say(t) { note = t; draw(); setTimeout(function () { if (note === t) { note = ''; draw(); } }, 4000); }

    el.onchange = function (e) {
      var t = e.target; if (t.getAttribute('data-f') !== 'photo' || !t.files[0]) return;
      resize(t.files[0]).then(function (d) { return A.updateProfile({ photo: d }); }).then(function () { if (o.onProfile) o.onProfile(A.profile); say('اتغيّرت الصورة.'); }, function () { say('مش قادر أغيّر الصورة. جرّب صورة تانية.'); });
    };
    el.onclick = function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return; var a = b.getAttribute('data-a');
      if (a === 'edit') { editing = true; draw(); }
      else if (a === 'cancel') { editing = false; draw(); }
      else if (a === 'save') {
        var n = el.querySelector('[data-f="name"]').value.trim(), g = parseInt(el.querySelector('[data-f="age"]').value, 10), jv = el.querySelector('[data-f="job"]').value;
        if (jv === 'أخرى') jv = el.querySelector('[data-f="job2"]').value.trim();
        if (n.length < 2 || !(g >= 5 && g <= 99) || !jv) return say('راجع البيانات: الاسم والسن (5 لـ 99) والشغل.');
        A.updateProfile({ name: n, age: g, job: jv }).then(function () { editing = false; if (o.onProfile) o.onProfile(A.profile); say('اتحفظت بياناتك.'); }, function () { say('مش قادر أحفظ. اتأكد من الاتصال.'); });
      }
      else if (a === 'sync') { cloud.sync(); }
      else if (a === 'enable') { cloud.enable(); }
      else if (a === 'remove') {
        ask('مسح التخزين السحابي', 'هيتمسح الريبو بتاعك على GitHub بكل تاريخه. <b>ملفات قرص D اللي على الجهاز ده هتفضل.</b> تقدر تعمل التخزين السحابي من جديد في أي وقت.', 'امسح السحابة').then(function (y) {
          if (!y) return; say('جاري المسح...');
          cloud.remove().then(function () { say('اتمسحت السحابة.'); }, function (er) { say(er && er.code === 'scope' ? 'التوكن مش معاه صلاحية delete_repo.' : 'مقدرتش أمسح: ' + (er && er.message || '')); });
        });
      }
      else if (a === 'forget') { A.forget(); say('اتمسحت بيانات الدخول المحفوظة.'); }
      else if (a === 'out') { if (o.onSignOut) o.onSignOut(); }
    };
    if (cloud) off = cloud.on(function () { if (!editing) draw(); });
    draw();
    var iv = setInterval(function () { if (dead || !el.isConnected) return clearInterval(iv); if (!editing) draw(); }, 30000);
    return { destroy: function () { dead = true; clearInterval(iv); if (off) off(); el.onclick = el.onchange = null; } };
  }
  root.EtoAcct = { mount: mount };
})(window);
