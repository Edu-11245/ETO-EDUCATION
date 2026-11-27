/* ===== التخزين السحابي: قرص D <-> ريبو برايفت على GitHub =====
   EtoCloud.attach({ fs, user, refresh }) => { sync, flush, remove, enable, on, status, repo, destroy }
   - لكل مستخدم ريبو برايفت اسمه (repoPrefix + uid)، بيتعمل أول مرة لوحده.
   - الشغل على الجهاز الأول (IndexedDB) وبعدين بيتزامن في الخلفية بـ commit واحد لكل دفعة (Git Data API).
   - لو الريبو اتغيّر من جهاز تاني والمحلي مفيهوش تعديلات: بيسحب. لو الاتنين اتغيّروا: المحلي بيكسب (والقديم فاضل في تاريخ git).
   - حد الطلبات: maxRequestsPerHour (الافتراضي 1000) بيتعدّ في المتصفح.
   تحذير: التوكن في config.js بيبان لأي حد يفتح DevTools. ده لمرحلة التجربة بس. */
(function (root) {
  var API = 'https://api.github.com', MAXF = 50 * 1024 * 1024, RK = 'eto_gh_reqs', SPECIAL = '.eto-drive', KEEP = '/.gitkeep';
  var TEXT = /\.(py|txt|md|json|js|ts|jsx|tsx|html?|css|csv|xml|ya?ml|ini|cfg|toml|c|h|cpp|hpp|java|sh|bat|log|sql|rs|go|php|rb|lua)$/i;
  var CFG = function () { return (root.ETO_CONFIG && root.ETO_CONFIG.github) || {}; };
  var mkErr = function (code, m) { var e = new Error(m || code); e.code = code; return e; };

  /* ---------- حد الطلبات ---------- */
  function stamps() {
    var n = Date.now(), a; try { a = JSON.parse(localStorage.getItem(RK) || '[]'); } catch (e) { a = []; }
    return a.filter(function (t) { return n - t < 3600000; });
  }
  function spend() {
    var a = stamps(), lim = CFG().maxRequestsPerHour || 1000;
    if (a.length >= lim) throw mkErr('limit', 'rate limit');
    a.push(Date.now()); try { localStorage.setItem(RK, JSON.stringify(a)); } catch (e) {}
  }
  function api(method, path, body) {
    try { spend(); } catch (e) { return Promise.reject(e); }
    var h = { Authorization: 'Bearer ' + CFG().token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (body) h['Content-Type'] = 'application/json';
    return fetch(API + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) { var e = new Error((j && j.message) || ('HTTP ' + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  function b64(buf) {
    var u = new Uint8Array(buf), s = '', i, C = 0x8000;
    for (i = 0; i < u.length; i += C) s += String.fromCharCode.apply(null, u.subarray(i, i + C));
    return btoa(s);
  }
  function unb64(t) { var s = atob(String(t).replace(/\s/g, '')), u = new Uint8Array(s.length), i; for (i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  function pool(items, n, fn) {
    var i = 0, out = [];
    function run() { if (i >= items.length) return Promise.resolve(); var k = i++; return fn(items[k], k).then(function (r) { out[k] = r; return run(); }); }
    var w = [], j; for (j = 0; j < Math.min(n, items.length); j++) w.push(run());
    return Promise.all(w).then(function () { return out; });
  }
  function classify(e) {
    if (e && e.code) return e.code;
    if (e && e.status === 401) return 'auth';
    if (e && e.status === 403 && /rate limit/i.test(e.message)) return 'limit';
    if (e && !e.status && /fetch|network|Failed/i.test(String(e.message))) return 'offline';
    return 'error';
  }

  function attach(o) {
    var fs = o.fs, user = o.user, C = CFG();
    var dead = false, quiet = false, pending = false, again = false, timer = 0, poll = 0, running = null;
    var ownerP = null, readyP = null, owner = '', branch = 'main', st = { state: 'init', msg: '', at: 0 }, listeners = [];
    var name = (C.repoPrefix || 'eto-pc-') + String(user.uid).toLowerCase().replace(/[^a-z0-9._-]/g, '-');
    var rp = function () { return '/repos/' + owner + '/' + name; };

    function S() { return fs.m.sync || (fs.m.sync = { head: null, tree: null, files: {}, at: 0 }); }
    function save() { quiet = true; try { fs.persist(); } finally { quiet = false; } }
    function set(state, msg) {
      st = { state: state, msg: msg || '', at: (fs.m.sync && fs.m.sync.at) || 0 };
      listeners.slice().forEach(function (f) { try { f(st); } catch (e) {} });
    }

    /* ---------- الريبو ---------- */
    function getOwner() {
      if (ownerP) return ownerP;
      ownerP = (C.owner ? Promise.resolve(C.owner) : api('GET', '/user').then(function (u) { return u.login; })).then(function (l) { owner = l; return l; });
      ownerP.catch(function () { ownerP = null; });
      return ownerP;
    }
    function initRepo() {
      return api('PUT', rp() + '/contents/' + SPECIAL, { message: 'init drive', content: btoa('Eto drive') }).catch(function (e) { if (e.status !== 422) throw e; });
    }
    function ready() {
      if (readyP) return readyP;
      readyP = getOwner().then(function () {
        return api('GET', rp()).catch(function (e) { if (e.status === 404) return null; throw e; });
      }).then(function (r) {
        if (r) { branch = r.default_branch || 'main'; return; }
        /* الريبو مش موجود (أول مرة أو اتمسح): نعمله من جديد وننسى حالة المزامنة القديمة */
        return api('POST', '/user/repos', { name: name, private: true, description: 'Eto PC drive', has_issues: false, has_wiki: false, has_projects: false, auto_init: false }).then(function (r2) {
          branch = r2.default_branch || 'main'; fs.m.sync = null; save();
          return new Promise(function (res) { setTimeout(res, 1200); }).then(initRepo);
        });
      });
      readyP.catch(function () { readyP = null; });
      return readyP;
    }
    function getHead() {
      var p = rp() + '/git/ref/heads/' + branch, f = function (r) { return r.object.sha; };
      return api('GET', p).then(f, function (e) {
        if (e.status === 409 || e.status === 404) return initRepo().then(function () { return api('GET', p).then(f); });
        throw e;
      });
    }
    function remoteTree(head) {
      return api('GET', rp() + '/git/commits/' + head).then(function (cm) {
        return api('GET', rp() + '/git/trees/' + cm.tree.sha + '?recursive=1').then(function (t) {
          if (t.truncated) throw mkErr('big', 'المخزن كبير أوي على المزامنة');
          var m = {}; t.tree.forEach(function (e) { if (e.type === 'blob' && e.path !== SPECIAL) m[e.path] = e.sha; });
          return { map: m, tree: cm.tree.sha };
        });
      });
    }

    /* ---------- الملفات المحلية ---------- */
    function listLocal() {
      var out = {};
      (function walk(id, pre) {
        fs.kids(id).forEach(function (n) {
          var p = pre + n.n;
          if (n.t === 'd') { if (!fs.kids(n.id).length) out[p + KEEP] = { dir: true, m: 0, s: 0 }; walk(n.id, p + '/'); }
          else out[p] = { id: n.id, s: n.s, m: n.m };
        });
      })('r', '');
      return out;
    }
    function diff(cur) {
      var f = S().files, ch = [], dl = [];
      Object.keys(cur).forEach(function (p) { var o = f[p]; if (!o || (!cur[p].dir && (o.m !== cur[p].m || o.s !== cur[p].s))) ch.push(p); });
      Object.keys(f).forEach(function (p) { if (!cur[p]) dl.push(p); });
      return { changed: ch, dels: dl };
    }
    function ensureDir(parts) {
      var cur = 'r';
      for (var i = 0; i < parts.length; i++) {
        var k = fs.find(cur, parts[i]);
        if (k && k.t === 'd') cur = k.id; else if (k) throw mkErr('exists', 'فيه ملف بنفس اسم الفولدر: ' + parts[i]); else cur = fs.mkdir(cur, parts[i]).id;
      }
      return cur;
    }

    /* ---------- رفع ---------- */
    function pushTo(head, treeSha, cur, d, extras) {
      var s = S(), emptySha = null, ups = d.changed.filter(function (p) { return cur[p].dir || cur[p].s <= MAXF; }), big = d.changed.filter(function (p) { return !cur[p].dir && cur[p].s > MAXF; });
      var entries = [], newFiles = {};
      return pool(ups, 4, function (p) {
        var c = cur[p];
        if (c.dir) {
          return (emptySha ? Promise.resolve(emptySha) : api('POST', rp() + '/git/blobs', { content: '', encoding: 'utf-8' }).then(function (r) { return (emptySha = r.sha); })).then(function (sha) { entries.push({ path: p, mode: '100644', type: 'blob', sha: sha }); newFiles[p] = { sha: sha, m: 0, s: 0 }; });
        }
        return fs.read(c.id).then(function (data) {
          if (data == null) data = '';
          if (typeof data === 'string') return api('POST', rp() + '/git/blobs', { content: data, encoding: 'utf-8' });
          return data.arrayBuffer().then(function (buf) { return api('POST', rp() + '/git/blobs', { content: b64(buf), encoding: 'base64' }); });
        }).then(function (r) { entries.push({ path: p, mode: '100644', type: 'blob', sha: r.sha }); newFiles[p] = { sha: r.sha, m: c.m, s: c.s }; });
      }).then(function () {
        d.dels.forEach(function (p) { if (s.files[p] && s.files[p].sha) entries.push({ path: p, mode: '100644', type: 'blob', sha: null }); });
        if (!entries.length) return head;
        var base = treeSha ? Promise.resolve(treeSha) : (head === s.head && s.tree ? Promise.resolve(s.tree) : api('GET', rp() + '/git/commits/' + head).then(function (c) { return c.tree.sha; }));
        return base.then(function (bt) {
          return api('POST', rp() + '/git/trees', { base_tree: bt, tree: entries }).then(function (t) {
            return api('POST', rp() + '/git/commits', { message: 'Eto sync ' + new Date().toISOString(), tree: t.sha, parents: [head] }).then(function (c) {
              return api('PATCH', rp() + '/git/refs/heads/' + branch, { sha: c.sha }).then(function () { s.head = c.sha; s.tree = t.sha; return c.sha; });
            });
          });
        });
      }).then(function (nh) {
        d.dels.forEach(function (p) { delete s.files[p]; });
        Object.keys(newFiles).forEach(function (p) { s.files[p] = newFiles[p]; });
        big.forEach(function (p) { s.files[p] = { sha: null, m: cur[p].m, s: cur[p].s, skip: 1 }; });
        s.at = Date.now(); save(); S().skipped = big.length;
        return nh;
      });
    }

    /* ---------- سحب ---------- */
    function decode(path, bytes) {
      if (TEXT.test(path)) { try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch (e) {} }
      return new Blob([bytes]);
    }
    function writePaths(paths, R) {
      return pool(paths, 4, function (p) {
        if (p.slice(-KEEP.length) === KEEP) return Promise.resolve(null);
        return api('GET', rp() + '/git/blobs/' + R[p]).then(function (b) { return decode(p, unb64(b.content)); });
      }).then(function (datas) {
        return paths.reduce(function (pr, p, i) {
          return pr.then(function () {
            var parts = p.split('/'), nm = parts.pop(), pid = ensureDir(parts);
            if (p.slice(-KEEP.length) === KEEP) return null;
            var ex = fs.find(pid, nm);
            if (ex && ex.t === 'f') return fs.write(ex.id, datas[i]);
            if (ex) throw mkErr('exists', 'فيه فولدر بنفس اسم الملف: ' + p);
            return fs.mkfile(pid, nm, datas[i]);
          });
        }, Promise.resolve());
      });
    }
    function pull(head, tr, keepLocal) {
      var s = S(), cur = listLocal(), R = tr.map, todo = [];
      quiet = true;
      /* ملفات اتمسحت من الريبو بعد ما كانت متزامنة */
      Object.keys(s.files).forEach(function (p) {
        if (!R[p] && cur[p] && !cur[p].dir && !keepLocal) { try { fs.trash(cur[p].id); } catch (e) {} }
      });
      Object.keys(R).forEach(function (p) {
        var k = s.files[p], c = cur[p];
        if (c && k && k.sha === R[p] && (c.dir || c.m === k.m)) return;
        if (p.slice(-KEEP.length) === KEEP) { try { ensureDir(p.split('/').slice(0, -1)); } catch (e) {} return; }
        todo.push(p);
      });
      return writePaths(todo, R).then(function () {
        var c2 = listLocal(), nf = {};
        Object.keys(R).forEach(function (p) { if (c2[p]) nf[p] = { sha: R[p], m: c2[p].m, s: c2[p].s }; else if (p.slice(-KEEP.length) === KEEP) nf[p] = { sha: R[p], m: 0, s: 0 }; });
        s.files = nf; s.head = head; s.tree = tr.tree; s.at = Date.now();
      }).then(function () { quiet = false; save(); if (o.refresh) o.refresh(); }, function (e) { quiet = false; throw e; });
    }

    /* ---------- الدورة الكاملة ---------- */
    function work() {
      if (fs.m.cloudOff) { set('off'); return Promise.resolve(); }
      if (!C.token) { set('noconfig'); return Promise.resolve(); }
      set('syncing');
      return ready().then(getHead).then(function (head) {
        var s = S(), cur = listLocal(), d = diff(cur), dirty = d.changed.length || d.dels.length;
        if (head === s.head) return dirty ? pushTo(head, null, cur, d) : null;
        return remoteTree(head).then(function (tr) {
          if (!s.head || !dirty) {
            return pull(head, tr, !s.head).then(function () {
              var c2 = listLocal(), d2 = diff(c2);
              return d2.changed.length || d2.dels.length ? pushTo(head, tr.tree, c2, d2) : null;
            });
          }
          /* الاتنين اتغيّروا: المحلي يكسب، وبعدها نسحب الملفات الجديدة اللي في الريبو بس */
          var old = s.files, extra = Object.keys(tr.map).filter(function (p) { return !cur[p] && !old[p] && p.slice(-KEEP.length) !== KEEP; });
          return pushTo(head, tr.tree, cur, d).then(function (nh) {
            if (!extra.length) return nh;
            quiet = true;
            return writePaths(extra, tr.map).then(function () {
              var c2 = listLocal(); extra.forEach(function (p) { if (c2[p]) S().files[p] = { sha: tr.map[p], m: c2[p].m, s: c2[p].s }; });
              quiet = false; save(); if (o.refresh) o.refresh();
            }, function (e) { quiet = false; throw e; });
          });
        });
      }).then(function () { pending = false; set('ok'); }, function (e) {
        var c = classify(e);
        if (c === 'offline') set('offline');
        else if (c === 'limit') { set('limit'); schedule(300000); }
        else if (c === 'space' || c === 'quota') set('space');
        else if (c === 'auth') set('auth');
        else { set('error', e && e.message); if (e && e.status === 422) schedule(4000); }
      });
    }
    function sync() {
      if (dead) return Promise.resolve();
      if (running) { again = true; return running; }
      running = work().then(function () { running = null; if (again && !dead) { again = false; schedule(1500); } });
      return running;
    }
    function schedule(ms) { clearTimeout(timer); timer = setTimeout(sync, ms); }

    fs.onChange = function () {
      if (quiet || dead) return;
      pending = true; if (running) again = true; else if (st.state !== 'syncing') set('pending');
      schedule(4000);
    };
    function onVis() { if (document.hidden && pending) sync(); }
    function onOnline() { sync(); }
    document.addEventListener('visibilitychange', onVis); root.addEventListener('online', onOnline); root.addEventListener('pagehide', onVis);
    poll = setInterval(function () { if (!document.hidden && !pending) sync(); }, 120000);

    var api_ = {
      sync: sync, repo: function () { return name; }, status: function () { return st; },
      on: function (f) { listeners.push(f); f(st); return function () { listeners = listeners.filter(function (x) { return x !== f; }); }; },
      flush: function () { clearTimeout(timer); return pending ? sync() : (running || Promise.resolve()); },
      /* مسح التخزين السحابي (يحتاج صلاحية delete_repo في التوكن) */
      remove: function () {
        return getOwner().then(function () { return api('DELETE', rp()); }).catch(function (e) {
          if (e.status === 404 && /Not Found/i.test(e.message)) return null;
          if (e.status === 403 || e.status === 404) throw mkErr('scope', 'التوكن مش معاه صلاحية delete_repo');
          throw e;
        }).then(function () { readyP = null; fs.m.cloudOff = true; fs.m.sync = null; pending = false; save(); set('off'); });
      },
      /* إنشاء التخزين السحابي من جديد وتحميل كل ملفات D عليه */
      enable: function () { fs.m.cloudOff = false; fs.m.sync = null; readyP = null; save(); return sync(); },
      destroy: function () {
        clearTimeout(timer); clearInterval(poll); fs.onChange = null;
        document.removeEventListener('visibilitychange', onVis); root.removeEventListener('online', onOnline); root.removeEventListener('pagehide', onVis);
        var p = pending && !dead && !fs.m.cloudOff ? (running || work()) : Promise.resolve();
        dead = true; return p;
      }
    };
    set(fs.m.cloudOff ? 'off' : 'init');
    sync();
    return api_;
  }

  root.EtoCloud = { attach: attach, _api: api };
})(typeof window !== 'undefined' ? window : globalThis);
