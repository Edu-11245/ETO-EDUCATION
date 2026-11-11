/* ETO Lang Learning — engine (shared by every language file)
   Each language lives in its own file (lang/es.js, lang/fr.js ...) and calls EtoLang.register({...}).
   Page ids:  lang | lang-es | lang-es-alphabet | lang-es-u1 | lang-es-u1-vocab | -dialog | -notes | -quiz */
(function (w, d) {
    'use strict';
    var LANGS = {}, ORDER = [], root = null, warned = false, seq = 0, QZ = {};

    var SECS = [
        { id: 'vocab',  ico: 'fa-spell-check',      ar: 'المفردات', en: 'VOCABULARY',    a: '#e11d48', b: '#fb7185', d: 'كلمات أساسية بنطقها. دوس على أي كارت تسمعه.' },
        { id: 'dialog', ico: 'fa-comments',         ar: 'الحوار',   en: 'DIALOGUE',      a: '#ea580c', b: '#fdba74', d: 'محادثة قصيرة بتتسمع جملة جملة.' },
        { id: 'notes',  ico: 'fa-book-open',         ar: 'القواعد والنطق', en: 'GRAMMAR & USE', a: '#7c3aed', b: '#c4b5fd', d: 'قواعد اللغة وملاحظات النطق والاستعمال.' },
        { id: 'quiz',   ico: 'fa-trophy',           ar: 'الاختبار', en: 'QUIZ',          a: '#059669', b: '#6ee7b7', d: 'اختبار سريع تثبّت بيه الوحدة.' }
    ];

    /* CEFR level look & feel (used by the level cards + level pages) */
    var LEVELS = {
        A1: { ar: 'مبتدئ',        en: 'BEGINNER',           ico: 'fa-seedling', a: '#e11d48', b: '#fb7185' },
        A2: { ar: 'أساسي',        en: 'ELEMENTARY',         ico: 'fa-leaf',     a: '#ea580c', b: '#fdba74' },
        B1: { ar: 'متوسط',        en: 'INTERMEDIATE',       ico: 'fa-tree',     a: '#d97706', b: '#fcd34d' },
        B2: { ar: 'فوق المتوسط',  en: 'UPPER-INTERMEDIATE', ico: 'fa-mountain', a: '#059669', b: '#6ee7b7' },
        C1: { ar: 'متقدم',        en: 'ADVANCED',           ico: 'fa-rocket',   a: '#0284c7', b: '#7dd3fc' },
        C2: { ar: 'إتقان',        en: 'MASTERY',            ico: 'fa-crown',    a: '#7c3aed', b: '#c4b5fd' }
    };

    /* ---------- helpers ---------- */
    function $(s) { return d.querySelector(s); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function toast(m, t) { if (typeof w.showToast === 'function') w.showToast(m, t || 'success'); }
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function isLtr(t) { return /^[A-Za-z0-9¿¡]/.test(t); }
    function pid(L, u, s) { return 'lang-' + L.id + (u ? '-' + (u.id || u) : '') + (s ? '-' + s : ''); }
    function ready(u) { return !!(u.vocab && u.vocab.length); }
    function secsOf(u) {
        return SECS.filter(function (s) {
            if (s.id === 'vocab') return u.vocab && u.vocab.length;
            if (s.id === 'dialog') return u.dialog && u.dialog.lines && u.dialog.lines.length;
            if (s.id === 'notes') return u.notes && u.notes.length;
            return u.quiz && u.quiz.length;
        });
    }
    function unitOf(L, id) { return L.units.filter(function (u) { return u.id === id; })[0]; }
    function levelUnitNo(L, u) { var level = u.level || L.level; return L.units.filter(function (x) { return (x.level || L.level) === level; }).indexOf(u) + 1; }
    function secOf(id) { return SECS.filter(function (s) { return s.id === id; })[0]; }
    function sty(a, b) { return '--a:' + a + ';--b:' + b; }
    /* animate.css helper: returns the classes for one entrance animation (css/animate.min.css) */
    function an(name) { return ' animate__animated animate__' + name; }

    /* ---------- progress (saved per language in localStorage) ---------- */
    function load(L) {
        var s = null;
        try { s = JSON.parse(localStorage.getItem('etoLang.' + L.id) || 'null'); } catch (e) {}
        if (!s || typeof s !== 'object' || Array.isArray(s)) {
            s = { v: {}, d: {}, n: {}, q: {} };
            if (L.id === 'es') { /* migrate progress saved by the old single-page version */
                try { var old = JSON.parse(localStorage.getItem('etoLangEs') || '{}'); if (old.heard && old.heard.length) s.v.u1 = old.heard.slice(); if (old.best) s.q.u1 = old.best; } catch (e) {}
            }
        }
        ['v', 'd', 'n', 'q'].forEach(function (bag) {
            if (!s[bag] || typeof s[bag] !== 'object' || Array.isArray(s[bag])) s[bag] = {};
        });
        return s;
    }
    function save(L) { try { localStorage.setItem('etoLang.' + L.id, JSON.stringify(L.st)); } catch (e) {} }
    function pct(n, t) { return t ? Math.min(100, Math.round(n / t * 100)) : 0; }
    function got(L, bag, u) { return (L.st[bag][u.id] || []).length; }
    function secPct(L, u, sid) {
        if (sid === 'vocab') return pct(got(L, 'v', u), u.vocab.length);
        if (sid === 'dialog') return pct(got(L, 'd', u), u.dialog.lines.length);
        if (sid === 'notes') return pct(got(L, 'n', u), u.notes.length);
        return pct(L.st.q[u.id] || 0, u.quiz.length);
    }
    function unitPct(L, u) { var s = secsOf(u); return s.length ? Math.round(s.reduce(function (a, x) { return a + secPct(L, u, x.id); }, 0) / s.length) : 0; }
    function readyUnits(L) { return L.units.filter(ready); }
    function coursePct(L) { var r = readyUnits(L); return r.length ? Math.round(r.reduce(function (a, u) { return a + unitPct(L, u); }, 0) / r.length) : 0; }
    function groupsOf(L) {
        var groups = [];
        L.units.forEach(function (u) {
            var level = u.level || L.level || 'A1', last = groups[groups.length - 1];
            if (!last || last.level !== level) { last = { level: level, units: [] }; groups.push(last); }
            last.units.push(u);
        });
        return groups;
    }
    function multiLevel(L) { return groupsOf(L).length > 1; } /* a one-level language skips the level layer */
    function lvlMeta(level) { return LEVELS[level] || { ar: level, en: 'LEVEL', ico: 'fa-layer-group', a: '#e11d48', b: '#f97316' }; }
    function lvlPid(L, level) { return pid(L, 'level-' + String(level).toLowerCase()); }
    function lvlPct(L, g) { var r = g.units.filter(ready); return r.length ? Math.round(r.reduce(function (a, u) { return a + unitPct(L, u); }, 0) / r.length) : 0; }
    function unitsWord(n) { return n === 1 ? 'وحدة' : n === 2 ? 'وحدتين' : n <= 10 ? n + ' وحدات' : n + ' وحدة'; }
    /* breadcrumb items between the course and a unit: adds the level step only for multi-level courses */
    function lvlCrumb(L, u) { var lv = u.level || L.level; return multiLevel(L) ? [['المستوى ' + lv, lvlPid(L, lv)]] : []; }
    function nextStep(L) {
        var r = readyUnits(L);
        for (var i = 0; i < r.length; i++) { var s = secsOf(r[i]); for (var j = 0; j < s.length; j++) if (secPct(L, r[i], s[j].id) < 100) return { u: r[i], s: s[j] }; }
        return null;
    }
    function cntText(L, u, sid) {
        if (sid === 'vocab') return got(L, 'v', u) + ' / ' + u.vocab.length + ' كلمة اتسمعت';
        if (sid === 'dialog') return got(L, 'd', u) + ' / ' + u.dialog.lines.length + ' جملة اتسمعت';
        if (sid === 'notes') return got(L, 'n', u) + ' / ' + u.notes.length + ' ملحوظة اتراجعت';
        return 'أعلى درجة: ' + (L.st.q[u.id] || 0) + ' / ' + u.quiz.length;
    }

    /* ---------- speech ---------- */
    function say(L, text, cb) {
        if (!('speechSynthesis' in w)) { toast('جهازك مش بيدعم النطق الصوتي', 'error'); if (cb) cb(); return; }
        try {
            var ss = w.speechSynthesis; ss.cancel();
            var u = new SpeechSynthesisUtterance(text); u.lang = L.speech; u.rate = L.rate || 0.85;
            var re = new RegExp('^' + L.speech.slice(0, 2) + '[-_]', 'i'), vs = ss.getVoices();
            var v = vs.filter(function (x) { return re.test(x.lang); })[0];
            if (v) u.voice = v; else if (vs.length && !warned) { warned = true; toast('مفيش صوت ' + L.nameAr + ' متسطب على جهازك، هيتنطق بصوت افتراضي', 'error'); }
            if (cb) { u.onend = cb; u.onerror = cb; }
            ss.speak(u);
        } catch (e) { if (cb) cb(); }
    }
    function speak(L, text) { seq++; say(L, text); }
    function stopAll() { seq++; try { w.speechSynthesis.cancel(); } catch (e) {} }

    /* ---------- marking progress ---------- */
    function mark(L, u, bag, val) {
        var a = L.st[bag][u.id] || (L.st[bag][u.id] = []);
        if (a.indexOf(val) > -1) return false;
        a.push(val); save(L); return true;
    }
    function setCnt(L, u, sid) { var el = $('#lgc-' + L.id + '-' + u.id + '-' + sid); if (el) el.textContent = cntText(L, u, sid); }
    function done(L, u, bag, val, sid, el) {
        if (mark(L, u, bag, val)) { if (el) el.classList.add('is-heard'); setCnt(L, u, sid); refresh(L); }
    }

    /* ---------- renderers ---------- */
    function ring(p, cls) {
        var r = 34, c = 2 * Math.PI * r;
        return '<div class="lg-ringbox ' + (cls || '') + '"><svg class="lg-ring" viewBox="0 0 80 80"><circle class="trk" cx="40" cy="40" r="' + r + '"/><circle class="val" cx="40" cy="40" r="' + r + '" transform="rotate(-90 40 40)" style="--c:' + c.toFixed(1) + ';stroke-dasharray:' + c.toFixed(1) + ';stroke-dashoffset:' + (c * (1 - p / 100)).toFixed(1) + '"/></svg><b>' + p + '%</b></div>';
    }
    function crumbs(items) {
        return '<nav class="lg-crumbs lg-in' + an('fadeInDown') + '">' + items.map(function (c, i) {
            return c[1] ? '<button type="button" data-go="' + c[1] + '">' + esc(c[0]) + '</button><i class="fa-solid fa-chevron-left"></i>' : '<span>' + esc(c[0]) + '</span>';
        }).join('') + '</nav>';
    }
    function hero(o) {
        return '<div class="lg-hero lg-in' + an('fadeInDown') + '"><div class="lg-hero-row"><div class="lg-hero-txt"><span class="lg-kicker"><i class="fa-solid ' + o.ico + '"></i> ' + esc(o.kicker) + '</span><h1>' + esc(o.title) + '</h1><p>' + esc(o.text) + '</p>' + (o.extra || '') + '</div>' + (o.side ? '<div class="lg-hero-side' + an('zoomIn') + '" style="animation-delay:.3s">' + o.side + '</div>' : '') + '</div></div>';
    }
    function head(k, t, i) { return '<div class="lg-head lg-in' + an('fadeInRight') + '" style="--i:' + (i || 0) + '"><span>' + esc(k) + '</span><h2>' + esc(t) + '</h2></div>'; }
    function mk(id, style) {
        var s = d.getElementById('page-' + id);
        if (!s) { s = d.createElement('section'); s.id = 'page-' + id; s.className = 'page-section hidden lg-page p-4 max-w-5xl mx-auto'; root.appendChild(s); }
        if (style) s.setAttribute('style', style);
        return s;
    }
    function theme(L) { return sty(L.theme.a, L.theme.b); }

    /* Keep the Spanish word, audio control and heard mark in separate layout slots.
       This is injected here so the fix works even when the host page has older card CSS. */
    function ensureWordCardStyles() {
        if (d.getElementById('eto-lang-word-card-fix')) return;
        var style = d.createElement('style');
        style.id = 'eto-lang-word-card-fix';
        style.textContent = [
            '#lang-root .lg-vocab .lg-word{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:9px!important;min-width:0!important;overflow:hidden!important;padding:16px!important;text-align:right!important;}',
            '#lang-root .lg-vocab .lg-word .lg-word-top{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;width:100%!important;min-width:0!important;direction:rtl!important;}',
            '#lang-root .lg-vocab .lg-word .lg-word-term{display:block!important;position:static!important;flex:1 1 auto!important;min-width:0!important;max-width:100%!important;direction:ltr!important;text-align:right!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;line-height:1.35!important;}',
            '#lang-root .lg-vocab .lg-word .lg-word-controls{display:flex!important;flex:0 0 auto!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:6px!important;position:static!important;inset:auto!important;transform:none!important;}',
            '#lang-root .lg-vocab .lg-word .lg-sp{display:grid!important;position:static!important;inset:auto!important;transform:none!important;flex:0 0 36px!important;width:36px!important;height:36px!important;place-items:center!important;border-radius:50%!important;margin:0!important;line-height:1!important;}',
            '#lang-root .lg-vocab .lg-word .lg-chk{display:grid!important;position:static!important;inset:auto!important;transform:none!important;flex:0 0 18px!important;width:18px!important;height:18px!important;place-items:center!important;margin:0!important;}',
            '#lang-root .lg-vocab .lg-word:not(.is-heard) .lg-chk{visibility:hidden!important;opacity:0!important;}',
            '#lang-root .lg-vocab .lg-word.is-heard .lg-chk{visibility:visible!important;opacity:1!important;}',
            '#lang-root .lg-vocab .lg-word>em{display:block!important;position:static!important;min-width:0!important;margin:0!important;line-height:1.5!important;}',
            '#lang-root .lg-vocab .lg-word>.ar{display:block!important;position:static!important;min-width:0!important;margin:0!important;line-height:1.5!important;}',
            '@media(max-width:420px){#lang-root .lg-vocab .lg-word{padding:13px!important;}#lang-root .lg-vocab .lg-word .lg-sp{flex-basis:32px!important;width:32px!important;height:32px!important;}}',
            '#lang-root .lg-dictionary{--dict-line:rgba(148,163,184,.24);}',
            '#lang-root .lg-dict-tools{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;margin:18px 0 14px;}',
            '#lang-root .lg-dict-search{width:100%;min-width:0;border:1px solid var(--dict-line);border-radius:14px;padding:13px 15px;background:var(--card,transparent);color:inherit;outline:none;font:inherit;}',
            '#lang-root .lg-dict-search:focus{border-color:var(--a);box-shadow:0 0 0 3px color-mix(in srgb,var(--a) 15%,transparent);}',
            '#lang-root .lg-dict-count{font-size:13px;opacity:.75;white-space:nowrap;}',
            '#lang-root .lg-dict-filters{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px;}',
            '#lang-root .lg-dict-filter{border:1px solid var(--dict-line);border-radius:999px;padding:8px 13px;background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer;transition:.2s ease;}',
            '#lang-root .lg-dict-filter[aria-pressed=true]{background:var(--a);border-color:var(--a);color:#fff;}',
            '#lang-root .lg-dict-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}',
            '#lang-root .lg-dict-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center;min-width:0;border:1px solid var(--dict-line);border-radius:15px;padding:13px 14px;background:var(--card,transparent);}',
            '#lang-root .lg-dict-item[hidden]{display:none!important;}',
            '#lang-root .lg-dict-main{min-width:0;}',
            '#lang-root .lg-dict-term{display:block;direction:ltr;text-align:left;font-size:17px;font-weight:800;line-height:1.45;overflow-wrap:anywhere;}',
            '#lang-root .lg-dict-pr{display:block;margin-top:3px;font-size:12px;opacity:.72;}',
            '#lang-root .lg-dict-meaning{grid-column:1/-1;font-size:14px;line-height:1.6;}',
            '#lang-root .lg-dict-meta{display:flex;flex-wrap:wrap;gap:6px;grid-column:1/-1;align-items:center;}',
            '#lang-root .lg-dict-tag{font-size:11px;border-radius:999px;padding:4px 8px;background:color-mix(in srgb,var(--a) 10%,transparent);color:var(--a);}',
            '#lang-root .lg-dict-audio{display:grid;place-items:center;flex:0 0 38px;width:38px;height:38px;border:0;border-radius:50%;background:color-mix(in srgb,var(--a) 12%,transparent);color:var(--a);cursor:pointer;}',
            '#lang-root .lg-dict-unit{border:0;background:transparent;color:inherit;text-decoration:underline;text-decoration-color:var(--a);text-underline-offset:3px;font:inherit;font-size:11px;cursor:pointer;padding:0;}',
            '#lang-root .lg-dict-empty{display:none;text-align:center;border:1px dashed var(--dict-line);border-radius:14px;padding:28px 12px;opacity:.75;}',
            '@media(max-width:620px){#lang-root .lg-dict-list{grid-template-columns:1fr;}#lang-root .lg-dict-tools{grid-template-columns:1fr;gap:7px;}#lang-root .lg-dict-count{white-space:normal;}}'
        ].join('');
        (d.head || d.documentElement).appendChild(style);
    }

    function renderHub() {
        var chips = ORDER.map(function (id, i) { return '<span class="lg-float" style="--i:' + i + '">' + esc(LANGS[id].hello) + '</span>'; }).join('');
        var cards = ORDER.map(function (id, i) {
            var L = LANGS[id], on = L.status === 'ready';
            return '<div class="lg-card lg-in' + an('fadeInUp') + (on ? '' : ' soon') + '" style="' + theme(L) + ';--i:' + (i + 2) + '"' + (on ? ' role="button" tabindex="0" data-go="' + pid(L) + '"' : '') + '>' +
                '<div class="lg-flag" style="background:' + L.flag + '"></div>' +
                '<span class="lg-chip">' + (on ? 'كورس متاح • ' + esc(L.level) : 'قريبًا') + '</span>' +
                '<h3>' + esc(L.name) + ' <small>' + esc(L.nameAr) + '</small></h3>' +
                '<p>' + esc(L.desc) + '</p>' +
                (on ? '<div class="lg-mini"><i style="width:' + coursePct(L) + '%"></i></div>' : '') +
                '<div class="lg-go"><span>' + (on ? 'ابدأ الكورس' : 'Coming Soon') + '</span><i class="fa-solid ' + (on ? 'fa-arrow-left' : 'fa-lock') + '"></i></div></div>';
        }).join('');
        mk('lang', '--a:#e11d48;--b:#f97316').innerHTML =
            hero({ ico: 'fa-language', kicker: 'ETO.EDU • LANG LEARNING', title: 'Lang Learning', text: 'اتعلم لغة جديدة خطوة بخطوة، بنطق صوتي وجمل حقيقية وتمارين سريعة بعد كل درس. اختار اللغة وابدأ من الصفر.', side: '<div class="animate__animated animate__bounceIn">' + chips + '</div>' }) +
            head('الكورسات', 'اختار اللغة', 1) + '<div class="lg-grid">' + cards + '</div>';
    }

    /* ---------- course dictionary ---------- */
    function dictionaryKey(value) {
        return String(value || '').toLocaleLowerCase().replace(/[¿?¡!.,;:…،؛"'“”()\[\]]/g, '').replace(/\s+/g, ' ').trim();
    }
    function buildDictionary(L) {
        var map = {}, entries = [];
        function add(term, pronunciation, meaning, level, unitTitle, unitId) {
            if (!term || !meaning) return;
            var key = dictionaryKey(term), item = map[key];
            if (!key) return;
            if (!item) {
                item = map[key] = { t: String(term), pr: String(pronunciation || ''), meanings: [], sources: [], levels: [], level: level || 'A1', unitTitle: unitTitle || 'الأبجدية', unitId: unitId || 'alphabet' };
                entries.push(item);
            }
            if (item.meanings.indexOf(String(meaning)) < 0) item.meanings.push(String(meaning));
            var source = { level: level || 'A1', unitTitle: unitTitle || 'الأبجدية', unitId: unitId || 'alphabet' };
            if (!item.sources.some(function (x) { return x.unitId === source.unitId; })) item.sources.push(source);
            if (item.levels.indexOf(source.level) < 0) item.levels.push(source.level);
            if (!item.pr && pronunciation) item.pr = String(pronunciation);
        }
        (L.units || []).forEach(function (u) {
            (u.vocab || []).forEach(function (x) { add(x.t, x.pr, x.ar, u.level || L.level, u.title, u.id); });
        });
        if (L.alphabet && L.alphabet.items) {
            L.alphabet.items.forEach(function (x) { add(x.w, '', x.m, 'A1', 'الأبجدية', 'alphabet'); });
        }
        entries.sort(function (a, b) { return a.t.localeCompare(b.t, 'es'); });
        L.dictionaryEntries = entries;
        return entries;
    }
    function renderDictionary(L) {
        var entries = L.dictionaryEntries || buildDictionary(L), levels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        var filters = levels.map(function (level) {
            var label = level === 'ALL' ? 'كل المستويات' : level;
            return '<button type="button" class="lg-dict-filter" data-dict-level="' + level + '" aria-pressed="' + (level === 'ALL' ? 'true' : 'false') + '">' + label + '</button>';
        }).join('');
        var cards = entries.map(function (x, i) {
            var search = [x.t, x.pr, x.meanings.join(' '), x.sources.map(function (s) { return s.unitTitle + ' ' + s.level; }).join(' ')].join(' ');
            var source = x.sources[0];
            var sourceBtn = source && source.unitId !== 'alphabet'
                ? '<button type="button" class="lg-dict-unit" data-go="' + pid(L, source.unitId, 'vocab') + '">افتح درس الكلمة</button>'
                : '<span class="lg-dict-unit">الأبجدية</span>';
            return '<article class="lg-dict-item" data-dict-item data-levels="' + esc(x.levels.join(',')) + '" data-search="' + esc(search.toLocaleLowerCase()) + '">' +
                '<div class="lg-dict-main"><b class="lg-dict-term" dir="ltr">' + esc(x.t) + '</b>' + (x.pr ? '<span class="lg-dict-pr">النطق: ' + esc(x.pr) + '</span>' : '') + '</div>' +
                '<button type="button" class="lg-dict-audio" data-l="' + L.id + '" data-dict-index="' + i + '" aria-label="اسمع ' + esc(x.t) + '"><i class="fa-solid fa-volume-high"></i></button>' +
                '<div class="lg-dict-meaning">' + esc(x.meanings.join(' • ')) + '</div>' +
                '<div class="lg-dict-meta">' + x.levels.map(function (level) { return '<span class="lg-dict-tag">' + esc(level) + '</span>'; }).join('') + '<span class="lg-dict-tag">' + x.sources.length + ' درس</span>' + sourceBtn + '</div></article>';
        }).join('');
        mk(pid(L, 'dictionary'), theme(L)).innerHTML = crumbs([['Lang Learning', 'lang'], [L.name, pid(L)], ['القاموس الإسباني', '']]) +
            hero({ ico: 'fa-book-atlas', kicker: 'ESPAÑOL • DICTIONARY', title: 'القاموس الإسباني', text: 'كل مفردات الكورس في مكان واحد، من A1 لحد C2. دور بالكلمة الإسباني أو معناها بالعربي، واسمع نطقها من نفس القاموس.' }) +
            '<section class="lg-dictionary" data-dictionary-root data-l="' + L.id + '" data-active-level="ALL" style="margin-top:20px">' +
            '<div class="lg-stats"><div class="lg-stat"><b>' + entries.length + '</b>مدخل في القاموس</div><div class="lg-stat"><b>' + L.units.length + '</b>وحدة تعليمية</div><div class="lg-stat"><b>6</b>مستويات</div></div>' +
            '<div class="lg-dict-tools"><input class="lg-dict-search" id="lg-dict-search-' + L.id + '" type="search" placeholder="ابحث بالإسباني أو بالعربي أو بالنطق..." autocomplete="off" aria-label="ابحث في القاموس الإسباني"><span class="lg-dict-count" id="lg-dict-count-' + L.id + '">عرض ' + entries.length + ' كلمة</span></div>' +
            '<div class="lg-dict-filters" aria-label="تصفية حسب المستوى">' + filters + '</div>' +
            '<div class="lg-dict-list" id="lg-dict-list-' + L.id + '">' + cards + '</div>' +
            '<div class="lg-dict-empty" id="lg-dict-empty-' + L.id + '">ملقيناش كلمة مطابقة. جرّب كتابة مختلفة.</div>' +
            '</section>' +
            '<div class="lg-pager"><button type="button" class="lg-pg" data-go="' + pid(L) + '"><i class="fa-solid fa-arrow-right"></i><span><small>رجوع</small><strong>خريطة الكورس</strong></span></button></div>';
    }
    function filterDictionary(L) {
        var page = d.getElementById('page-' + pid(L, 'dictionary'));
        if (!page) return;
        var box = page.querySelector('[data-dictionary-root]'); if (!box) return;
        var input = page.querySelector('#lg-dict-search-' + L.id), term = dictionaryKey(input ? input.value : '');
        var active = box.getAttribute('data-active-level') || 'ALL', rows = page.querySelectorAll('[data-dict-item]'), shown = 0;
        Array.prototype.forEach.call(rows, function (row) {
            var levelOk = active === 'ALL' || (row.getAttribute('data-levels') || '').split(',').indexOf(active) > -1;
            var textOk = !term || dictionaryKey(row.getAttribute('data-search')).indexOf(term) > -1;
            var visible = levelOk && textOk;
            row.hidden = !visible; if (visible) shown++;
        });
        var count = page.querySelector('#lg-dict-count-' + L.id), empty = page.querySelector('#lg-dict-empty-' + L.id);
        if (count) count.textContent = 'عرض ' + shown + ' من ' + rows.length + ' مدخل';
        if (empty) empty.style.display = shown ? 'none' : 'block';
    }

    function unitCard(L, u, no, i) {
        var on = ready(u);
        return '<' + (on ? 'button type="button" data-go="' + pid(L, u) + '"' : 'div') + ' class="lg-unit lg-in' + an(on ? 'fadeInUp' : 'fadeIn') + ' ' + (on ? 'open' : 'lock') + (on && unitPct(L, u) >= 100 ? ' full' : '') + '" style="--i:' + (Math.min(i, 12) + 3) + '">' +
            '<div class="lg-unit-top"><b class="n">' + no + '</b><span><strong>' + esc(u.title) + '</strong><small>' + esc(u.sub) + '</small></span>' + (on ? '<span class="pc">' + unitPct(L, u) + '%</span>' : '<i class="fa-solid fa-lock lk"></i>') + '</div>' +
            (on ? '<div class="lg-mini"><i style="width:' + unitPct(L, u) + '%"></i></div>' : '') + '</' + (on ? 'button' : 'div') + '>';
    }

    function renderHome(L) {
        var p = coursePct(L), nx = nextStep(L), ru = readyUnits(L), words = 0, heard = 0, full = 0;
        ru.forEach(function (u) { words += u.vocab.length; heard += got(L, 'v', u); if (u.quiz && u.quiz.length && (L.st.q[u.id] || 0) >= u.quiz.length) full++; });
        var cta = nx ? '<button type="button" class="lg-btn cta" data-go="' + pid(L, nx.u, nx.s.id) + '"><i class="fa-solid fa-play"></i> كمّل: ' + esc(nx.u.title) + ' • ' + nx.s.ar + '</button>'
                     : '<button type="button" class="lg-btn cta" data-go="' + pid(L, ru[0]) + '"><i class="fa-solid fa-rotate-right"></i> راجع من الأول</button>';
        var stats = '<div class="lg-stats"><div class="lg-stat"><b>' + heard + ' / ' + words + '</b>كلمة اتسمعت</div><div class="lg-stat"><b>' + ru.length + ' / ' + L.units.length + '</b>وحدة متاحة</div><div class="lg-stat"><b>' + full + '</b>اختبار بدرجة كاملة</div></div>';
        var groups = groupsOf(L), multi = groups.length > 1;

        /* tools sit right under the hero now, not at the bottom of the page */
        var toolCards = [];
        if (L.alphabet) toolCards.push('<button type="button" class="lg-tool lg-in animate__animated animate__fadeInUp" style="--i:2" data-go="' + pid(L, 'alphabet') + '"><i class="fa-solid fa-font"></i><span><strong>' + esc(L.alphabet.title) + '</strong><small>' + L.alphabet.items.length + ' حرف بنطقه</small></span></button>');
        if (L.dictionary) toolCards.push('<button type="button" class="lg-tool lg-in animate__animated animate__fadeInUp" style="--i:3" data-go="' + pid(L, 'dictionary') + '"><i class="fa-solid fa-book-atlas"></i><span><strong>القاموس الإسباني</strong><small>' + (L.dictionaryEntries || []).length + ' كلمة وتعبير بالترجمة والنطق</small></span></button>');
        var tools = toolCards.length ? head('أدوات الكورس', 'مكتبة اللغة ' + L.nameAr, 1) + '<div class="lg-tools">' + toolCards.join('') + '</div>' : '';

        var body;
        if (multi) {
            /* one card per CEFR level (A1, A2 ...) — each opens its own page with that level's units */
            var lvls = groups.map(function (g, gi) {
                var m = lvlMeta(g.level), av = g.units.filter(ready).length, on = av > 0, pc = lvlPct(L, g);
                return '<div class="lg-lvl lg-in' + an('fadeInUp') + (on ? '' : ' soon') + (on && pc >= 100 ? ' full' : '') + '" style="' + sty(m.a, m.b) + ';--i:' + (gi + 3) + '" data-code="' + esc(g.level) + '"' + (on ? ' role="button" tabindex="0" data-go="' + lvlPid(L, g.level) + '"' : '') + '>' +
                    '<div class="lg-lvl-top"><span class="lg-lvl-code">' + esc(g.level) + '</span><span class="lg-lvl-ttl"><strong>' + esc(m.ar) + '</strong><small>' + esc(m.en) + '</small></span>' + (on ? '<span class="lg-lvl-pc">' + pc + '%</span>' : '<i class="fa-solid fa-lock lk"></i>') + '</div>' +
                    '<p>' + esc((L.levelDescriptions && L.levelDescriptions[g.level]) || 'تابع الوحدات بالترتيب لتحقيق أهداف المستوى.') + '</p>' +
                    '<div class="lg-lvl-meta"><span><i class="fa-solid fa-layer-group"></i> ' + unitsWord(g.units.length) + '</span><span><i class="fa-solid fa-lock-open"></i> ' + av + ' متاحة</span></div>' +
                    (on ? '<div class="lg-mini"><i style="width:' + pc + '%"></i></div>' : '') +
                    '<div class="lg-go"><span>' + (on ? 'افتح المستوى' : 'قريبًا') + '</span><i class="fa-solid ' + (on ? 'fa-arrow-left' : 'fa-lock') + '"></i></div></div>';
            }).join('');
            body = head('مستويات الكورس', groups.length + ' مستويات • ' + L.units.length + ' وحدة', 2) + '<div class="lg-lvls">' + lvls + '</div>';
        } else {
            body = head('خريطة الكورس', L.units.length + ' وحدة', 2) + '<div class="lg-road">' + L.units.map(function (u, i) { return unitCard(L, u, i + 1, i); }).join('') + '</div>';
        }
        mk(pid(L), theme(L)).innerHTML = crumbs([['Lang Learning', 'lang'], [L.name, '']]) +
            hero({ ico: 'fa-book-open', kicker: 'COURSE • ' + L.name.toUpperCase() + ' ' + L.level, title: L.title, text: L.intro, extra: stats + cta, side: ring(p) }) +
            tools + body;
    }

    /* one page per level: hero + that level's unit cards + prev/next level */
    function renderLevel(L, g) {
        var groups = groupsOf(L), gi = groups.map(function (x) { return x.level; }).indexOf(g.level), m = lvlMeta(g.level), ru = g.units.filter(ready), p = lvlPct(L, g), words = 0, heard = 0, full = 0;
        ru.forEach(function (u) { words += u.vocab.length; heard += got(L, 'v', u); if (u.quiz && u.quiz.length && (L.st.q[u.id] || 0) >= u.quiz.length) full++; });
        var stats = '<div class="lg-stats"><div class="lg-stat"><b>' + ru.length + ' / ' + g.units.length + '</b>وحدة متاحة</div><div class="lg-stat"><b>' + heard + ' / ' + words + '</b>كلمة اتسمعت</div><div class="lg-stat"><b>' + full + '</b>اختبار بدرجة كاملة</div></div>';
        var cards = g.units.map(function (u, k) { return unitCard(L, u, k + 1, k); }).join('');
        var pv = groups[gi - 1], nv = groups[gi + 1];
        function lvlBtn(x, cls, arrow, label) {
            var mm = lvlMeta(x.level);
            return '<button type="button" class="lg-pg' + cls + '" data-go="' + lvlPid(L, x.level) + '"><i class="fa-solid ' + arrow + '"></i><span><small>' + label + '</small><strong>' + esc(x.level) + ' • ' + esc(mm.ar) + '</strong></span></button>';
        }
        var left = pv && pv.units.some(ready) ? lvlBtn(pv, '', 'fa-arrow-right', 'المستوى السابق')
                 : '<button type="button" class="lg-pg" data-go="' + pid(L) + '"><i class="fa-solid fa-arrow-right"></i><span><small>رجوع</small><strong>كل المستويات</strong></span></button>';
        var right = nv && nv.units.some(ready) ? lvlBtn(nv, ' nx', 'fa-arrow-left', 'المستوى الجاي')
                  : '<button type="button" class="lg-pg nx" data-go="' + pid(L) + '"><i class="fa-solid fa-flag-checkered"></i><span><small>خلصت</small><strong>كل المستويات</strong></span></button>';
        mk(lvlPid(L, g.level), sty(m.a, m.b)).innerHTML = crumbs([['Lang Learning', 'lang'], [L.name, pid(L)], ['المستوى ' + g.level, '']]) +
            hero({ ico: m.ico, kicker: 'LEVEL ' + g.level + ' • ' + L.name.toUpperCase(), title: 'المستوى ' + g.level + ' — ' + m.ar, text: (L.levelDescriptions && L.levelDescriptions[g.level]) || 'تابع الوحدات بالترتيب لتحقيق أهداف المستوى.', extra: stats, side: ring(p) }) +
            head('وحدات المستوى ' + g.level, unitsWord(g.units.length) + ' • امشي بالترتيب', 1) + '<div class="lg-road">' + cards + '</div>' +
            '<div class="lg-pager">' + left + right + '</div>';
    }

    function renderAlphabet(L) {
        var A = L.alphabet;
        mk(pid(L, 'alphabet'), theme(L)).innerHTML = crumbs([['Lang Learning', 'lang'], [L.name, pid(L)], ['الأبجدية', '']]) +
            hero({ ico: 'fa-font', kicker: 'ALPHABET', title: A.title, text: 'دوس على أي حرف تسمع كلمة بتبدأ بيه.' }) +
            head('الحروف', A.items.length + ' حرف', 1) +
            '<div class="lg-alpha">' + A.items.map(function (x, i) {
                return '<button type="button" class="lg-letter lg-in animate__animated animate__zoomIn" style="--i:' + (i % 12) + '" data-alpha="' + i + '" data-l="' + L.id + '"><b>' + esc(x.l) + '</b><em>' + esc(x.ar) + '</em><small>' + esc(x.w) + ' • ' + esc(x.m) + '</small></button>';
            }).join('') + '</div>';
    }

    function renderUnit(L, u) {
        var ui = L.units.indexOf(u), secs = secsOf(u), p = unitPct(L, u);
        var tiles = secs.map(function (s, i) {
            var sp = secPct(L, u, s.id);
            return '<button type="button" class="lg-sec lg-in' + an('fadeInUp') + (sp >= 100 ? ' full' : '') + '" style="' + sty(s.a, s.b) + ';--i:' + (i + 3) + '" data-go="' + pid(L, u, s.id) + '"><span class="done"><i class="fa-solid fa-check"></i></span>' +
                '<span class="ic"><i class="fa-solid ' + s.ico + '"></i></span><em>' + s.en + '</em><strong>' + s.ar + '</strong><p>' + s.d + '</p>' +
                '<div class="lg-mini"><i style="width:' + sp + '%"></i></div></button>';
        }).join('');
        var goals = (u.goals || []).map(function (g) { return '<li><i class="fa-solid fa-circle-check"></i> ' + esc(g) + '</li>'; }).join('');
        var prev = L.units[ui - 1], next = L.units[ui + 1];
        var pager = '<div class="lg-pager">' +
            (prev && ready(prev) ? '<button type="button" class="lg-pg" data-go="' + pid(L, prev) + '"><i class="fa-solid fa-arrow-right"></i><span><small>الوحدة السابقة</small><strong>' + esc(prev.title) + '</strong></span></button>' : '<span></span>') +
            (next && ready(next) ? '<button type="button" class="lg-pg nx" data-go="' + pid(L, next) + '"><i class="fa-solid fa-arrow-left"></i><span><small>الوحدة الجاية</small><strong>' + esc(next.title) + '</strong></span></button>' : '') + '</div>';
        mk(pid(L, u), theme(L)).innerHTML = crumbs([['Lang Learning', 'lang'], [L.name, pid(L)]].concat(lvlCrumb(L, u), [['الوحدة ' + levelUnitNo(L, u), '']])) +
            hero({ ico: u.icon || 'fa-book', kicker: (u.level ? 'LEVEL ' + u.level + ' • ' : '') + 'UNIT ' + levelUnitNo(L, u) + ' • ' + L.name.toUpperCase(), title: u.title, text: u.sub, side: ring(p, 'sm') }) +
            (goals ? head('هدف الوحدة', 'هتبقى تقدر…', 1) + '<ul class="lg-goals lg-in' + an('fadeInUp') + '" style="--i:2">' + goals + '</ul>' : '') +
            head('محتوى الوحدة', 'كل جزء في صفحة لوحده', 2) + '<div class="lg-secs">' + tiles + '</div>' + pager;
    }

    function secPager(L, u, secs, i) {
        var p = secs[i - 1], n = secs[i + 1], ui = L.units.indexOf(u), nu = L.units[ui + 1];
        var left = p ? '<button type="button" class="lg-pg" data-go="' + pid(L, u, p.id) + '"><i class="fa-solid fa-arrow-right"></i><span><small>السابق</small><strong>' + p.ar + '</strong></span></button>'
                     : '<button type="button" class="lg-pg" data-go="' + pid(L, u) + '"><i class="fa-solid fa-arrow-right"></i><span><small>رجوع</small><strong>للوحدة</strong></span></button>';
        var right = n ? '<button type="button" class="lg-pg nx" data-go="' + pid(L, u, n.id) + '"><i class="fa-solid fa-arrow-left"></i><span><small>الجاي</small><strong>' + n.ar + '</strong></span></button>'
                      : (nu && ready(nu) ? '<button type="button" class="lg-pg nx" data-go="' + pid(L, nu) + '"><i class="fa-solid fa-arrow-left"></i><span><small>الوحدة الجاية</small><strong>' + esc(nu.title) + '</strong></span></button>'
                                         : '<button type="button" class="lg-pg nx" data-go="' + pid(L) + '"><i class="fa-solid fa-flag-checkered"></i><span><small>خلصت</small><strong>خريطة الكورس</strong></span></button>');
        return '<div class="lg-pager">' + left + right + '</div>';
    }

    function renderSec(L, u, s, i, secs) {
        var ui = L.units.indexOf(u), body = '', play = '', uno = levelUnitNo(L, u);
        var ref = 'data-l="' + L.id + '" data-u="' + u.id + '"';
        if (s.id === 'vocab') {
            var hv = L.st.v[u.id] || [];
            play = '<button type="button" class="lg-btn" data-play="vocab" ' + ref + '><i class="fa-solid fa-play"></i> سمّعني الكل</button>';
            body = '<div class="lg-vocab">' + u.vocab.map(function (x, k) {
                return '<button type="button" class="lg-word lg-in' + an('zoomIn') + (hv.indexOf(x.k) > -1 ? ' is-heard' : '') + '" ' + ref + ' data-k="' + x.k + '" style="--i:' + (k % 12) + '"><span class="lg-word-top"><b class="lg-word-term" dir="ltr">' + esc(x.t) + '</b><span class="lg-word-controls"><i class="fa-solid fa-volume-high lg-sp" aria-hidden="true"></i><span class="lg-chk"><i class="fa-solid fa-check"></i></span></span></span><em>' + esc(x.pr) + '</em><span class="ar">' + esc(x.ar) + '</span></button>';
            }).join('') + '</div>';
        } else if (s.id === 'dialog') {
            var hd = L.st.d[u.id] || [], nm = u.dialog.names || { A: 'A', B: 'B' };
            play = '<button type="button" class="lg-btn" data-play="dialog" ' + ref + '><i class="fa-solid fa-play"></i> شغّل الحوار كله</button>';
            body = '<div class="lg-dialog">' + u.dialog.lines.map(function (l, k) {
                return '<div class="lg-line lg-in' + an(l.w === 'B' ? 'fadeInLeft' : 'fadeInRight') + ' ' + (l.w === 'B' ? 'b' : 'a') + (hd.indexOf(k) > -1 ? ' is-heard' : '') + '" ' + ref + ' data-k="' + k + '" style="--i:' + k + '"><span class="lg-av">' + esc(nm[l.w][0]) + '</span><div class="lg-bub"><small>' + esc(nm[l.w]) + ' <span class="lg-wave"><i></i><i></i><i></i></span></small><b>' + esc(l.t) + '</b><span>' + esc(l.ar) + '</span></div><button type="button" class="lg-spk" aria-label="استمع"><i class="fa-solid fa-volume-high"></i></button></div>';
            }).join('') + '</div>';
        } else if (s.id === 'notes') {
            var hn = L.st.n[u.id] || [];
            body = '<div class="lg-notes">' + u.notes.map(function (n, k) {
                return '<button type="button" class="lg-note lg-in' + an('fadeInUp') + (hn.indexOf(k) > -1 ? ' is-heard' : '') + '" ' + ref + ' data-k="' + k + '" style="--i:' + k + '"><span class="bd">' + esc(n[0]) + '</span><span><p>' + esc(n[1]) + '</p><span class="lg-ex"><i class="fa-solid fa-volume-high"></i> ' + esc(n[2]) + '</span></span></button>';
            }).join('') + '</div>';
        } else {
            body = '<div class="lg-quiz lg-in' + an('fadeInUp') + '" id="lgq-' + L.id + '-' + u.id + '" ' + ref + '></div>';
        }
        mk(pid(L, u, s.id), sty(s.a, s.b)).innerHTML = crumbs([['Lang Learning', 'lang'], [L.name, pid(L)]].concat(lvlCrumb(L, u), [['الوحدة ' + uno, pid(L, u)], [s.ar, '']])) +
            hero({ ico: s.ico, kicker: (u.level ? 'LEVEL ' + u.level + ' • ' : '') + 'UNIT ' + uno + ' • ' + s.en, title: s.ar + ' — ' + u.title, text: s.d, extra: '<span class="lg-cnt" id="lgc-' + L.id + '-' + u.id + '-' + s.id + '">' + cntText(L, u, s.id) + '</span><br>' + play }) +
            '<div style="margin-top:22px">' + body + '</div>' + secPager(L, u, secs, i);
        if (s.id === 'quiz') quizStart(L, u);
    }

    /* ---------- quiz ---------- */
    function qk(L, u) { return L.id + '/' + u.id; }
    function quizStart(L, u) {
        QZ[qk(L, u)] = { qi: 0, score: 0, locked: false, log: [], order: shuffle(u.quiz.map(function (x) { return { q: x.q, o: shuffle(x.a.map(function (t, i) { return { t: t, ok: i === x.c }; })) }; })) };
        quizPaint(L, u);
    }
    function quizPaint(L, u) {
        var z = QZ[qk(L, u)], box = $('#lgq-' + L.id + '-' + u.id), total = z.order.length;
        var dots = '<div class="lg-dots">' + z.order.map(function (_, i) { return '<i class="' + (z.log[i] || (i === z.qi ? 'cur' : '')) + '"></i>'; }).join('') + '</div>';
        if (z.qi >= total) {
            if (z.score > (L.st.q[u.id] || 0)) { L.st.q[u.id] = z.score; save(L); setCnt(L, u, 'quiz'); refresh(L); }
            var r = z.score / total, msg = r === 1 ? 'ممتاز! درجة كاملة، الوحدة دي خلصانة.' : r >= 0.7 ? 'كويس جدًا، قريب من الدرجة النهائية.' : 'محتاج مراجعة بسيطة. اسمع الكلمات تاني وحاول تاني.';
            box.innerHTML = dots + '<div class="lg-res"><div class="tr animate__animated animate__tada"><i class="fa-solid fa-trophy"></i></div><strong class="animate__animated animate__bounceIn">' + z.score + ' / ' + total + '</strong><p>' + msg + '</p>' +
                '<button type="button" class="lg-btn" data-qr="1"><i class="fa-solid fa-rotate-right"></i> أعد الاختبار</button>' +
                '<button type="button" class="lg-btn solid" data-go="' + pid(L, u) + '">رجوع للوحدة <i class="fa-solid fa-arrow-left"></i></button></div>';
            return;
        }
        var cur = z.order[z.qi]; z.locked = false;
        box.innerHTML = dots + '<div class="lg-q-top"><span>سؤال ' + (z.qi + 1) + ' / ' + total + '</span><span>الدرجة: ' + z.score + '</span></div><div class="lg-q-text' + an('fadeInRight') + '">' + esc(cur.q) + '</div>' +
            '<div class="lg-opts">' + cur.o.map(function (o, i) { return '<button type="button" class="lg-opt lg-in' + an('fadeInUp') + '" style="--i:' + i + '" data-qo="' + i + '"' + (isLtr(o.t) ? ' dir="ltr"' : '') + '>' + esc(o.t) + '</button>'; }).join('') + '</div><div class="lg-fb"></div>';
    }
    function flash(el, cls) { el.className = el.className.replace(/\banimate__\S+/g, '').replace(/\s+/g, ' ').trim(); el.style.setProperty('--i', '0'); void el.offsetWidth; el.classList.add('animate__animated', cls); el.addEventListener('animationend', function h() { el.classList.remove('animate__animated', cls); el.removeEventListener('animationend', h); }); }
    function quizClick(e, L, u, box) {
        var z = QZ[qk(L, u)];
        if (e.target.closest('[data-qr]')) { quizStart(L, u); return true; }
        if (e.target.closest('[data-qn]')) { z.qi++; quizPaint(L, u); return true; }
        var b = e.target.closest('.lg-opt'); if (!b || z.locked) return !!b;
        z.locked = true;
        var cur = z.order[z.qi], pick = cur.o[+b.getAttribute('data-qo')], fb = box.querySelector('.lg-fb');
        box.querySelectorAll('.lg-opt').forEach(function (x, i) { x.disabled = true; if (cur.o[i].ok) x.classList.add('ok'); });
        if (pick.ok) { z.score++; z.log[z.qi] = 'ok'; flash(b, 'animate__pulse'); fb.style.color = '#059669'; fb.textContent = 'إجابة صح، كمّل كده.'; }
        else { z.log[z.qi] = 'no'; b.classList.add('no'); flash(b, 'animate__shakeX'); fb.style.color = '#dc2626'; fb.textContent = 'إجابة غلط. الإجابة الصح متعلّم عليها بالأخضر.'; }
        box.querySelectorAll('.lg-dots i')[z.qi].className = z.log[z.qi];
        fb.insertAdjacentHTML('afterend', '<button type="button" class="lg-btn solid animate__animated animate__fadeInUp animate__faster" data-qn="1">' + (z.qi + 1 >= z.order.length ? 'شوف النتيجة' : 'السؤال الجاي') + ' <i class="fa-solid fa-arrow-left"></i></button>');
        return true;
    }

    /* ---------- play-all (sequence with highlight) ---------- */
    function playAll(L, u, kind, btn) {
        var label = kind === 'vocab' ? 'سمّعني الكل' : 'شغّل الحوار كله';
        function reset() { btn.classList.remove('on'); btn.innerHTML = '<i class="fa-solid fa-play"></i> ' + label; }
        if (btn.classList.contains('on')) { stopAll(); reset(); return; }
        var items = kind === 'vocab' ? u.vocab.map(function (x) { return { t: x.t, k: x.k }; }) : u.dialog.lines.map(function (x, i) { return { t: x.t, k: i }; });
        var page = $('#page-' + pid(L, u, kind)), tok = ++seq;
        btn.classList.add('on'); btn.innerHTML = '<i class="fa-solid fa-stop"></i> إيقاف';
        (function next(i) {
            if (tok !== seq || i >= items.length) { reset(); return; }
            var el = page.querySelector('[data-k="' + items[i].k + '"]');
            if (el) { el.classList.add('is-speaking'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
            say(L, items[i].t, function () {
                if (el) el.classList.remove('is-speaking');
                if (tok !== seq) { reset(); return; }
                if (kind === 'vocab') done(L, u, 'v', items[i].k, 'vocab', el); else done(L, u, 'd', items[i].k, 'dialog', el);
                setTimeout(function () { next(i + 1); }, 350);
            });
        })(0);
    }

    /* ---------- events (one delegated listener) ---------- */
    function onClick(e) {
        var dictFilter = e.target.closest('[data-dict-level]');
        if (dictFilter) {
            var dictPage = dictFilter.closest('[data-dictionary-root]');
            var dictHost = dictFilter.closest('.lg-page');
            if (dictPage && dictHost) {
                dictPage.setAttribute('data-active-level', dictFilter.getAttribute('data-dict-level'));
                dictHost.querySelectorAll('[data-dict-level]').forEach(function (b) { b.setAttribute('aria-pressed', b === dictFilter ? 'true' : 'false'); });
                var dictLangId = dictPage.getAttribute('data-l') || dictHost.id.replace(/^page-lang-/, '').split('-')[0];
                filterDictionary(LANGS[dictLangId]);
            }
            return;
        }
        var go = e.target.closest('[data-go]');
        if (go) { stopAll(); if (typeof w.navigate === 'function') w.navigate(go.getAttribute('data-go')); w.scrollTo(0, 0); return; }
        var t = e.target.closest('[data-l]'); if (!t) { var q0 = e.target.closest('.lg-quiz'); if (!q0) return; t = q0; }
        var L = LANGS[t.getAttribute('data-l')]; if (!L) return;
        if (t.hasAttribute('data-dict-index')) { var entry = (L.dictionaryEntries || [])[+t.getAttribute('data-dict-index')]; if (entry) speak(L, entry.t); return; }
        if (t.hasAttribute('data-alpha')) { speak(L, L.alphabet.items[+t.getAttribute('data-alpha')].w); return; }
        var u = unitOf(L, t.getAttribute('data-u')); if (!u) return;
        if (t.classList.contains('lg-quiz')) { quizClick(e, L, u, t); return; }
        var pl = e.target.closest('[data-play]'); if (pl) { playAll(L, u, pl.getAttribute('data-play'), pl); return; }
        var k = t.getAttribute('data-k');
        if (t.classList.contains('lg-word')) { var w1 = u.vocab.filter(function (x) { return x.k === k; })[0]; speak(L, w1.t); done(L, u, 'v', k, 'vocab', t); }
        else if (t.classList.contains('lg-line')) { speak(L, u.dialog.lines[+k].t); done(L, u, 'd', +k, 'dialog', t); }
        else if (t.classList.contains('lg-note')) { speak(L, u.notes[+k][2]); done(L, u, 'n', +k, 'notes', t); }
    }
    function onInput(e) {
        var input = e.target; if (!input || !input.id || input.id.indexOf('lg-dict-search-') !== 0) return;
        var id = input.id.slice('lg-dict-search-'.length), L = LANGS[id]; if (L) filterDictionary(L);
    }
    function onKey(e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.lg-card[data-go],.lg-lvl[data-go]')) { e.preventDefault(); e.target.click(); } }

    /* ---------- public API ---------- */
    function refresh(L) {
        renderHub(); renderHome(L); if (L.dictionary) renderDictionary(L);
        if (multiLevel(L)) groupsOf(L).forEach(function (g) { renderLevel(L, g); });
        L.units.forEach(function (u) { if (ready(u)) renderUnit(L, u); });
    }
    function register(L) {
        L.status = L.status || 'ready'; L.units = L.units || []; L.theme = L.theme || { a: '#e11d48', b: '#f97316' };
        if (L.dictionary) buildDictionary(L);
        LANGS[L.id] = L; ORDER.push(L.id);
    }
    function start() {
        root = d.getElementById('lang-root'); if (!root) return;
        ensureWordCardStyles();
        ORDER.forEach(function (id) { var L = LANGS[id]; if (L.status === 'ready') L.st = load(L); });
        renderHub();
        ORDER.forEach(function (id) {
            var L = LANGS[id]; if (L.status !== 'ready') return;
            renderHome(L); if (L.alphabet) renderAlphabet(L); if (L.dictionary) renderDictionary(L);
            if (multiLevel(L)) groupsOf(L).forEach(function (g) { renderLevel(L, g); });
            L.units.forEach(function (u) { if (!ready(u)) return; renderUnit(L, u); var secs = secsOf(u); secs.forEach(function (s, i) { renderSec(L, u, s, i, secs); }); });
        });
        root.addEventListener('click', onClick);
        root.addEventListener('input', onInput);
        root.addEventListener('keydown', onKey);
    }
    w.EtoLang = { register: register, start: start };
})(window, document);
