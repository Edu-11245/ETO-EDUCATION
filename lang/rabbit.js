
(function (w, d) {
    'use strict';

    var KEY = 'etoLangSettings';
    var SKINS = {
        classic:  { fur: '#fffaf7', accent: '#f58fac' },
        cocoa:    { fur: '#c58c66', accent: '#f4c2a1' },
        lavender: { fur: '#d9d0f3', accent: '#a88be8' },
        mint:     { fur: '#cce9df', accent: '#70bfa5' },
        midnight: { fur: '#9ca8bd', accent: '#7dd3fc' }
    };
    var DEF = { voice: 'rabbit', voiceVersion: 2, show: true, sfx: true, speed: 1, skin: 'classic', furColor: '#fffaf7', accentColor: '#f58fac', ears: 'long', bow: true, idleReminder: true, idleSeconds: 60, crack: true };
    var S = loadSettings();
    function loadSettings() {
        var s = {}, o = {}, k;
        try { s = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
        for (k in DEF) o[k] = (k in s && typeof s[k] === typeof DEF[k]) ? s[k] : DEF[k];
        if (!s.voiceVersion) o.voice = 'rabbit';
        o.voiceVersion = 2;
        if (!/^#[0-9a-f]{6}$/i.test(o.furColor)) o.furColor = DEF.furColor;
        if (!/^#[0-9a-f]{6}$/i.test(o.accentColor)) o.accentColor = DEF.accentColor;
        if (!SKINS[o.skin] && o.skin !== 'custom') o.skin = 'classic';
        return o;
    }
    function saveSettings() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

    var SETTINGS_TABS = [
        { id: 'rabbit', label: 'الأرنب', hint: 'الشكل والمعاينة' },
        { id: 'voice', label: 'الصوت', hint: 'النطق والتجربة' },
        { id: 'behavior', label: 'الحركة', hint: 'التذكير والخمول' },
        { id: 'general', label: 'عام', hint: 'الظهور والمؤثرات' }
    ];
    var CONTROLS = [
        { page: 'rabbit', id: 'skin', type: 'choice', label: 'الشكل الجاهز', opts: [['classic', 'كلاسيكي'], ['cocoa', 'كاكاو'], ['lavender', 'لافندر'], ['mint', 'نعناعي'], ['midnight', 'ليلي'], ['custom', 'مخصص']] },
        { page: 'rabbit', id: 'furColor', type: 'color', label: 'لون الفرو' },
        { page: 'rabbit', id: 'accentColor', type: 'color', label: 'لون التفاصيل' },
        { page: 'rabbit', id: 'ears', type: 'choice', label: 'طول الأذنين', opts: [['long', 'طويلة'], ['medium', 'متوسطة'], ['short', 'قصيرة']] },
        { page: 'rabbit', id: 'bow', type: 'switch', label: 'إظهار الفيونكة' },
        { page: 'voice', id: 'voice', type: 'choice', label: 'أسلوب الصوت', opts: [['normal', 'صوت الجهاز'], ['rabbit', 'نغمة الأرنب']] },
        { page: 'voice', id: 'speed', type: 'range', label: 'سرعة الكلام', min: 0.75, max: 1.2, step: 0.05, fmt: function (v) { return Math.round(v * 100) + '%'; } },
        { page: 'behavior', id: 'idleReminder', type: 'switch', label: 'تذكير عند ترك الصفحة بدون نشاط' },
        { page: 'behavior', id: 'idleSeconds', type: 'range', label: 'وقت الخمول قبل التذكير', min: 30, max: 180, step: 15, fmt: function (v) { return v + ' ثانية'; } },
        { page: 'behavior', id: 'crack', type: 'switch', label: 'تأثير شرخ الشاشة والاهتزاز' },
        { page: 'general', id: 'show', type: 'switch', label: 'إظهار الأرنب أثناء تعلم اللغات' },
        { page: 'general', id: 'sfx', type: 'switch', label: 'المؤثرات الصوتية للحركة' }
    ];
    var LW = 240, LH = 340, GX = 120, GY = 322;   
    var RM = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
    function mixHex(a, b, amount) {
        var aa = parseInt(String(a).slice(1), 16), bb = parseInt(String(b).slice(1), 16);
        var ar = (aa >> 16) & 255, ag = (aa >> 8) & 255, ab = aa & 255;
        var br = (bb >> 16) & 255, bg = (bb >> 8) & 255, bblue = bb & 255;
        var r = Math.round(ar + (br - ar) * amount), g = Math.round(ag + (bg - ag) * amount), bl = Math.round(ab + (bblue - ab) * amount);
        return '#' + [r, g, bl].map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
    }
    function hexRgba(hex, alpha) {
        var n = parseInt(String(hex).slice(1), 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
    }

    function fe(c, x, y, rx, ry, rot, stops, line) {
        c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.scale(1, ry / rx);
        var g = c.createRadialGradient(-rx * 0.28, -rx * 0.36, rx * 0.08, 0, 0, rx);
        for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
        c.beginPath(); c.arc(0, 0, rx, 0, 6.2832); c.fillStyle = g; c.fill(); c.restore();
        if (line) {
            c.save(); c.translate(x, y); if (rot) c.rotate(rot);
            c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, 6.2832);
            c.strokeStyle = line[0]; c.lineWidth = line[1]; c.stroke(); c.restore();
        }
    }
    function rr(c, x, y, wd, h, r) {
        c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + wd, y, x + wd, y + h, r); c.arcTo(x + wd, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + wd, y, r); c.closePath();
    }
    function draw(c, st) {
        var fur = S.furColor || DEF.furColor, accent = S.accentColor || DEF.accentColor;
        var FUR = [[0, mixHex(fur, '#ffffff', 0.42)], [0.55, mixHex(fur, '#ffffff', 0.12)], [1, mixHex(fur, '#000000', 0.10)]];
        var PINK = [[0, mixHex(accent, '#ffffff', 0.3)], [1, mixHex(accent, '#000000', 0.08)]];
        var EDGE = [hexRgba(mixHex(accent, '#604b57', 0.45), 0.62), 1.8];
        var t = st.t, hx = st.look * 6, hy = st.lookY * 2, i, side;
        c.clearRect(0, 0, LW, LH);
        c.save(); c.translate(GX, GY);

        var sh = Math.max(0.35, 1 - st.h / 140);
        c.save(); c.translate(0, 3); c.scale(1, 0.2);
        var sg = c.createRadialGradient(0, 0, 4, 0, 0, 66 * sh);
        sg.addColorStop(0, 'rgba(60,20,40,' + (0.34 * sh) + ')'); sg.addColorStop(1, 'rgba(60,20,40,0)');
        c.fillStyle = sg; c.beginPath(); c.arc(0, 0, 66 * sh, 0, 6.2832); c.fill(); c.restore();
        c.translate(0, -st.h); c.scale(1 + st.sq, 1 - st.sq);
        fe(c, -st.dir * 48, -26, 15, 15, 0, FUR, EDGE);
        fe(c, -st.dir * 55, -31, 8, 9, -0.4, FUR, EDGE);
        fe(c, -st.dir * 42, -34, 8, 8, 0.45, FUR, EDGE);
        for (side = -1; side <= 1; side += 2) {
            fe(c, side * 34, -10, 25, 11.5, side * 0.12, FUR, EDGE);
            c.strokeStyle = hexRgba(mixHex(accent, '#604b57', .35), .56); c.lineWidth = 1.4; c.lineCap = 'round';
            for (i = -1; i <= 1; i += 2) { c.beginPath(); c.moveTo(side * 34 + side * 13 + i * 2, -9 + i * 3); c.lineTo(side * 34 + side * 20 + i * 2, -9 + i * 3.4); c.stroke(); }
            fe(c, side * 34, -12, 8, 4.5, 0, PINK);
        }

        fe(c, 0, -44, 51, 44, 0, FUR, EDGE);
        fe(c, 0, -38, 30, 29, 0, [[0, 'rgba(255,255,255,1)'], [1, 'rgba(255,245,240,.0)']]);
        c.save(); c.strokeStyle = hexRgba(mixHex(accent, '#ffffff', .38), .34); c.lineWidth = 1.1;
        c.beginPath(); c.moveTo(-18, -67); c.quadraticCurveTo(0, -73, 18, -67); c.stroke(); c.restore();

        var pu = st.h > 2 ? -5 : 0;
        for (side = -1; side <= 1; side += 2) {
            fe(c, side * 19, -33 + pu, 11, 15, side * -0.12, FUR, EDGE);
            c.save(); c.strokeStyle = hexRgba(mixHex(accent, '#604b57', .4), .48); c.lineWidth = 1.1; c.lineCap = 'round';
            c.beginPath(); c.moveTo(side * 19 - 3, -30 + pu); c.quadraticCurveTo(side * 19 - 4, -25 + pu, side * 19 - 2, -24 + pu); c.stroke();
            c.beginPath(); c.moveTo(side * 19 + 3, -30 + pu); c.quadraticCurveTo(side * 19 + 4, -25 + pu, side * 19 + 2, -24 + pu); c.stroke(); c.restore();
        }
        function ear(sd, ang) {
            var earScale = S.ears === 'short' ? 0.66 : (S.ears === 'medium' ? 0.84 : 1);
            c.save(); c.translate(sd * 27 + hx * 0.55, -150); c.rotate(ang);
            fe(c, 0, -44 * earScale, 18.5, 53 * earScale, 0, FUR, EDGE);
            fe(c, 0, -40 * earScale, 10.5, 41 * earScale, 0, PINK);
            c.strokeStyle = hexRgba(mixHex(accent, '#ffffff', .55), .65); c.lineWidth = 1.2; c.lineCap = 'round';
            c.beginPath(); c.moveTo(-3, -13 * earScale); c.quadraticCurveTo(-7, -40 * earScale, -3, -67 * earScale); c.stroke();
            c.restore();
        }
        var sway = Math.sin(t * 1.7) * 0.035 + st.bob * 0.01;
        ear(-1, -0.16 + sway - st.lookEar * 0.05 - st.tw);
        ear(1, 0.16 + sway * 0.8 - st.lookEar * 0.05 + st.tw * 0.5);

        /* الراس */
        fe(c, hx * 0.4, -112 + st.bob * 0.4, 63, 54, 0, FUR, EDGE);
        /* خصلة فرو صغيرة أعلى الجبهة */
        c.save(); c.translate(hx * .25, -160 + st.bob * .35); c.fillStyle = mixHex(fur, '#ffffff', .35);
        c.beginPath(); c.moveTo(-16, 8); c.quadraticCurveTo(-12, -4, -4, 0); c.quadraticCurveTo(2, -13, 9, 0); c.quadraticCurveTo(17, -4, 19, 9); c.quadraticCurveTo(0, 4, -16, 8); c.fill(); c.restore();
        var fy = st.bob * 0.4;
        c.save(); c.translate(0, fy);

        /* خدود */
        for (side = -1; side <= 1; side += 2) {
            fe(c, side * 41 + hx, -87, 15, 9, 0, [[0, hexRgba(accent, .78)], [0.6, hexRgba(accent, .35)], [1, hexRgba(accent, 0)]]);
        }

        /* عيون كبيرة لامعة */
        var b = st.blink;
        for (side = -1; side <= 1; side += 2) {
            var ex = side * 27 + hx, ey = -108 + hy;
            if (b > 0.72) {
                c.strokeStyle = '#3a2540'; c.lineWidth = 2.8; c.lineCap = 'round';
                c.beginPath(); c.moveTo(ex - 9.5, ey); c.quadraticCurveTo(ex, ey + 7, ex + 9.5, ey); c.stroke();
            } else {
                var ry = 14.5 * (1 - b * 1.1);
                fe(c, ex + st.look * 2, ey + st.lookY * 1.5, 11.8, ry, 0, [[0, '#806077'], [0.42, '#37243b'], [1, '#170c1e']]);
                c.strokeStyle = hexRgba(mixHex(accent, '#503246', .55), .62); c.lineWidth = 1.25;
                c.beginPath(); c.ellipse(ex + st.look * 2, ey + st.lookY * 1.5, 11.8, ry, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
                var kk = ry / 14.5;
                c.fillStyle = 'rgba(255,255,255,.96)';
                c.beginPath(); c.arc(ex - 3.6 + st.look * 2, ey - 5.2 * kk + st.lookY, 4.7 * (0.5 + kk * 0.5), 0, 6.2832); c.fill();
                c.fillStyle = 'rgba(255,255,255,.85)';
                c.beginPath(); c.arc(ex + 4.2 + st.look * 2, ey + 5 * kk + st.lookY, 2.2, 0, 6.2832); c.fill();
                c.fillStyle = 'rgba(160,200,255,.35)';
                c.beginPath(); c.arc(ex + 1 + st.look * 2, ey + 8.5 * kk, 3, 0, 6.2832); c.fill();
            }
        }

        /* الخدود الصغيرة ونقط الشوارب */
        c.fillStyle = hexRgba(mixHex(accent, '#6b4656', .45), .55);
        for (side = -1; side <= 1; side += 2) {
            for (i = 0; i < 3; i++) { c.beginPath(); c.arc(side * (34 + (i % 2) * 5), -83 + i * 4, 1.15, 0, 6.2832); c.fill(); }
        }

        /* الأنف */
        var nx = hx;
        c.save(); c.translate(nx, -94); c.fillStyle = mixHex(accent, '#ffffff', .12); c.strokeStyle = mixHex(accent, '#57263b', .42); c.lineWidth = .9;
        c.beginPath(); c.moveTo(0, -3.8); c.bezierCurveTo(6, -5, 7.2, 1, 0, 4.2); c.bezierCurveTo(-7.2, 1, -6, -5, 0, -3.8); c.fill(); c.stroke(); c.restore();
        c.strokeStyle = mixHex(accent, '#57263b', .5); c.lineWidth = 1.9; c.lineCap = 'round'; c.lineJoin = 'round';
        var m = st.mouth, mry = 1.2 + m * 7.5, mrx = 6 + m * 3.5, my = -80;
        c.beginPath(); c.moveTo(nx, -90); c.lineTo(nx, -86.5); c.stroke();
        if (m < 0.06) {
            c.beginPath(); c.moveTo(nx, -86.5); c.quadraticCurveTo(nx - 4, -80.5, nx - 9.5, -84.5); c.stroke();
            c.beginPath(); c.moveTo(nx, -86.5); c.quadraticCurveTo(nx + 4, -80.5, nx + 9.5, -84.5); c.stroke();
        } else {
            c.save(); c.beginPath(); c.ellipse(nx, my, mrx, mry, 0, 0, 6.2832); c.fillStyle = mixHex(accent, '#3d1729', .58); c.fill(); c.clip();
            fe(c, nx, my + mry * 0.55, mrx * 0.7, mry * 0.55, 0, [[0, mixHex(accent, '#ffffff', .3)], [1, accent]]);
            c.restore();
            c.beginPath(); c.ellipse(nx, my, mrx, mry, 0, 0, 6.2832); c.stroke();
        }
        /* سنتين الأرنب */
        var ty = my - mry + 0.8;
        c.fillStyle = '#ffffff'; c.strokeStyle = 'rgba(214,160,160,.9)'; c.lineWidth = 1.1;
        rr(c, nx - 4.6, ty, 4.4, 6.2, 1.6); c.fill(); c.stroke();
        rr(c, nx + 0.2, ty, 4.4, 6.2, 1.6); c.fill(); c.stroke();

        /* شنبات */
        c.strokeStyle = hexRgba(mixHex(accent, '#604b57', .35), .55); c.lineWidth = 1.3;
        for (side = -1; side <= 1; side += 2) {
            for (i = 0; i < 3; i++) {
                var wob = Math.sin(t * 2.6 + i + side) * 1.1;
                c.beginPath(); c.moveTo(nx + side * 32, -88 + i * 3.4);
                c.quadraticCurveTo(nx + side * 58, -96 + i * 7 + wob, nx + side * (80 + i * 2), -100 + i * 11 + wob); c.stroke();
            }
        }
        c.restore();

        /* الفيونكة اختيارية من الإعدادات */
        if (S.bow) {
            c.save(); c.translate(hx * 0.2, -60);
            c.fillStyle = accent; c.strokeStyle = mixHex(accent, '#30101d', .48); c.lineWidth = 1.3; c.lineJoin = 'round';
            for (side = -1; side <= 1; side += 2) {
                c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(side * 14, -15, side * 26, -8); c.quadraticCurveTo(side * 19, 0, side * 26, 8); c.quadraticCurveTo(side * 14, 15, 0, 0);
                c.fill(); c.stroke();
            }
            fe(c, 0, 0, 6, 6, 0, [[0, mixHex(accent, '#ffffff', .35)], [1, accent]], [mixHex(accent, '#30101d', .48), 1.1]);
            c.restore();
        }

        c.restore();
    }

    /* ================= حالة الأرنب وحركته ================= */
    var R = {
        x: 0, y: 0, mode: 'idle', path: [], from: null, seg: 0, p: 0, idleT: 2.5, anchor: null, anchorT: 0,
        look: 0, lookY: 0, dir: 1, blinkT: 2, blinkP: 0, twT: 3, twP: 0, sq: 0, hopH: 0,
        mouth: 0, speaking: false, pulse: 0, t: 0, hopSfx: false, shown: false
    };
    var VW = 0, VH = 0, K = 0.65, HOP = 32;
    var wrap, cv, cx, bubble, bubT = 0, vis = false, lastEl = null, lastElT = 0, speakTok = 0, keep = null;
    var root, crack, gearBtn, settingsPage, previewWrap, previewCv, previewCx, settingsOpen = false, settingsHistoryState = false, activeTab = 'rabbit', lastActivity = Date.now(), idleScolded = false, crashTimer = null, idleTimer = null;
    var PV = { t: 0, blinkT: 2.2, blinkP: 0, twT: 3.5, twP: 0, look: 0, mouth: 0 }, PK = 0.92;

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function minY() { return 250 * K + 8; }

    function plan(tx, ty, sfx) {
        var dist = Math.hypot(tx - R.x, ty - R.y), n = Math.max(1, Math.ceil(dist / 115)), i;
        R.path = []; R.from = { x: R.x, y: R.y };
        for (i = 1; i <= n; i++) R.path.push({ x: R.x + (tx - R.x) * i / n, y: R.y + (ty - R.y) * i / n });
        R.seg = 0; R.p = 0; R.mode = 'hop'; R.hopSfx = !!sfx;
        if (Math.abs(tx - R.x) > 4) R.dir = tx > R.x ? 1 : -1;
    }

    /* ================= الصوت (مؤثرات) ================= */
    var AC = null;
    function ac() {
        if (!AC) { try { AC = new (w.AudioContext || w.webkitAudioContext)(); } catch (e) {} }
        if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
        return AC;
    }
    function tone(f0, f1, dur, vol, type, delay) {
        if (!S.sfx) return;
        var a = ac(); if (!a) return;
        try {
            var t0 = a.currentTime + (delay || 0), o = a.createOscillator(), g = a.createGain();
            o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
            g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
            o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.03);
        } catch (e) {}
    }
    function squeak() { tone(1100, 1900, 0.09, 0.05, 'triangle'); tone(1500, 2400, 0.07, 0.035, 'sine', 0.09); }
    function thump() { tone(150, 55, 0.11, 0.1, 'sine'); }

    /* ================= الربط مع النطق (بيتنادى من core.js) ================= */
    function speakEl() {
        var el = d.querySelector('#lang-root .is-speaking');
        if (el) return el;
        if (lastEl && Date.now() - lastElT < 700) return lastEl;
        return null;
    }
    function finish(tok) { if (tok === speakTok) { R.speaking = false; } }
    function tune(u, L, text) {
        var rab = S.voice === 'rabbit', tok = ++speakTok;
        var voices = [];
        try { voices = w.speechSynthesis.getVoices(); } catch (e) {}
        if (voices.length && u.lang) {
            var prefix = String(u.lang).slice(0, 2).toLowerCase();
            var matching = voices.filter(function (v) { return String(v.lang || '').slice(0, 2).toLowerCase() === prefix; });
            var light = matching.filter(function (v) { return /female|zira|jenny|samantha|aria|eva|google/i.test(v.name || ''); });
            if (rab && light.length) u.voice = light[0];
            else if (!u.voice && matching.length) u.voice = matching[0];
        }
        u.pitch = rab ? 1.52 : 1;
        u.rate = clamp((u.rate || 0.85) * (rab ? 1.06 : 1) * S.speed, 0.3, 2);
        var pe = u.onend, pr = u.onerror, last = 0;
        u.onend = function () { finish(tok); if (pe) pe.apply(this, arguments); };
        u.onerror = function () { finish(tok); if (pr) pr.apply(this, arguments); };
        u.onboundary = function () { R.pulse = 1; var n = Date.now(); if (rab && n - last > 260) { last = n; tone(1200 + Math.random() * 500, 1700 + Math.random() * 500, 0.05, 0.025, 'triangle'); } };
        keep = u;   /* مرجع عشان المتصفح ما يمسحش الحدث */
        R.speaking = true; R.pulse = 1;
        if (rab && S.sfx) squeak();
        var el = speakEl();
        if (el && vis) { R.anchor = el; R.anchorT = 4; }
        setTimeout(function () { finish(tok); }, 1800 + String(text || '').length * 170);
    }
    function stop() { speakTok++; R.speaking = false; }

    /* ================= التحديث (كل فريم) ================= */
    function update(dt) {
        var s = R, i;
        s.t += dt;
        s.blinkT -= dt; if (s.blinkT <= 0) { s.blinkP = 0.0001; s.blinkT = Math.random() < 0.25 ? 0.35 : 2 + Math.random() * 3.5; }
        if (s.blinkP > 0) { s.blinkP += dt / 0.16; if (s.blinkP >= 1) s.blinkP = 0; }
        s.twT -= dt; if (s.twT <= 0) { s.twP = 0.0001; s.twT = 3 + Math.random() * 4; }
        if (s.twP > 0) { s.twP += dt / 0.45; if (s.twP >= 1) s.twP = 0; }
        s.pulse = Math.max(0, s.pulse - dt * 4);

        var sqT = Math.sin(s.t * 2.2) * 0.012, lookT = 0;
        if (s.mode === 'hop') {
            var A = s.seg === 0 ? s.from : s.path[s.seg - 1], B = s.path[s.seg];
            s.p += dt / 0.4;
            if (s.p >= 1) {
                s.x = B.x; s.y = B.y; s.seg++; s.p = 0;
                if (s.hopSfx) thump();
                if (s.seg >= s.path.length) { s.mode = 'idle'; s.idleT = 2.5 + Math.random() * 3; }
            } else { s.x = A.x + (B.x - A.x) * s.p; s.y = A.y + (B.y - A.y) * s.p; }
            var p = s.p;
            s.hopH = 4 * HOP * p * (1 - p);
            sqT = p < 0.14 ? 0.14 * (1 - p / 0.14) : p > 0.86 ? 0.14 * ((p - 0.86) / 0.14) : -0.07 * Math.sin(p * Math.PI);
            lookT = s.dir;
        } else {
            s.hopH += (0 - s.hopH) * Math.min(1, dt * 20);
            var a = s.anchor, tx = null, ty = null;
            if (a) {
                if (!a.isConnected) { s.anchor = null; }
                else {
                    var r = a.getBoundingClientRect();
                    if (r.bottom < 0 || r.top > VH || r.width === 0) s.anchor = null;
                    else { tx = clamp(r.left + r.width / 2, 60, VW - 60); ty = Math.min(Math.max(r.top + 8, minY()), VH - 8); }
                }
            }
            if (s.anchor) {
                if (s.speaking) s.anchorT = 4; else { s.anchorT -= dt; if (s.anchorT <= 0) { s.anchor = null; s.idleT = 1.2; } }
            }
            if (s.anchor && tx !== null) {
                var dx = tx - s.x, dy = ty - s.y, dist = Math.hypot(dx, dy);
                if (dist > 150 && !RM) plan(tx, ty, true);
                else if (dist > 1.5) { var f = Math.min(1, dt * (RM ? 14 : 9)); s.x += dx * f; s.y += dy * f; if (Math.abs(dx) > 5) s.dir = dx > 0 ? 1 : -1; }
                lookT = 0;
            } else {
                s.idleT -= dt;
                if (s.idleT <= 0) {
                    if (!RM) plan(clamp(60 + Math.random() * (VW - 120), 60, VW - 60), clamp(VH * 0.55 + Math.random() * VH * 0.4, minY(), VH - 14), false);
                    else s.idleT = 4;
                }
                lookT = Math.sin(s.t * 0.5) * 0.7;
            }
        }
        s.sq += (sqT - s.sq) * Math.min(1, dt * 26);
        s.look += (lookT - s.look) * Math.min(1, dt * 6);
        s.lookY += ((s.speaking ? -0.2 : Math.sin(s.t * 0.37) * 0.4) - s.lookY) * Math.min(1, dt * 4);
        var mt = s.speaking ? (0.3 + 0.7 * Math.abs(Math.sin(s.t * 13))) * (0.7 + 0.3 * s.pulse) : 0;
        s.mouth += (mt - s.mouth) * Math.min(1, dt * 22);
        if (bubT > 0) { bubT -= dt; if (bubT <= 0 && bubble) bubble.classList.remove('on'); }
    }

    function render() {
        var s = R, dpr = Math.min(2, w.devicePixelRatio || 1);
        cx.setTransform(dpr * K, 0, 0, dpr * K, 0, 0);
        draw(cx, {
            t: s.t, h: s.hopH / K, sq: s.sq, look: s.look, lookY: s.lookY, lookEar: s.look,
            blink: s.blinkP > 0 ? Math.sin(s.blinkP * Math.PI) : 0, mouth: s.mouth,
            tw: s.twP > 0 ? Math.sin(s.twP * Math.PI * 3) * (1 - s.twP) * 0.12 : 0,
            bob: s.speaking ? Math.sin(s.t * 13) * 2 : Math.sin(s.t * 2.2) * 0.8, dir: s.dir
        });
        wrap.style.transform = 'translate3d(' + (s.x - GX * K).toFixed(1) + 'px,' + (s.y - GY * K).toFixed(1) + 'px,0)';
    }

    /* ================= واجهة: العناصر والإعدادات ================= */
    function activeLangPage() {
        var secs = d.querySelectorAll('#lang-root > .page-section');
        for (var i = 0; i < secs.length; i++) if (!secs[i].classList.contains('hidden') && secs[i].offsetParent !== null) return secs[i];
        return null;
    }
    function sizeAll() {
        VW = w.innerWidth; VH = w.innerHeight; K = VW < 520 ? 0.5 : 0.65; HOP = VW < 520 ? 26 : 32;
        var dpr = Math.min(2, w.devicePixelRatio || 1);
        cv.width = Math.round(LW * K * dpr); cv.height = Math.round(LH * K * dpr);
        cv.style.width = LW * K + 'px'; cv.style.height = LH * K + 'px';
        wrap.style.width = LW * K + 'px'; wrap.style.height = LH * K + 'px';
        bubble.style.left = GX * K + 'px'; bubble.style.top = (GY - 262) * K + 'px';
        R.x = clamp(R.x, 40, VW - 40); R.y = clamp(R.y, minY(), VH - 6);
        sizePreviewCanvas();
    }
    function sayBubble(msg, secs) { if (!bubble || !vis) return; bubble.textContent = msg; bubble.classList.add('on'); bubT = secs || 4; }

    function speakScold() {
        if (!('speechSynthesis' in w)) return;
        try {
            var ss = w.speechSynthesis;
            ss.cancel();
            var phrase = 'ما تذاكر يااااض!';
            var u = new SpeechSynthesisUtterance(phrase);
            u.lang = 'ar-EG'; u.rate = 0.96; u.pitch = 1.28;
            var voices = ss.getVoices();
            var egyptian = voices.filter(function (v) { return /^ar[-_]eg/i.test(v.lang || ''); });
            var arabic = voices.filter(function (v) { return /^ar[-_]/i.test(v.lang || ''); });
            if (egyptian.length) u.voice = egyptian[0]; else if (arabic.length) u.voice = arabic[0];
            tune(u, null, phrase);
            ss.speak(u);
        } catch (e) {}
    }

    function screenCrash() {
        if (!vis) return;
        if (S.crack && crack) {
            crack.classList.remove('on');
            void crack.offsetWidth;
            crack.classList.add('on');
            d.documentElement.classList.remove('eto-rb-hit');
            void d.documentElement.offsetWidth;
            d.documentElement.classList.add('eto-rb-hit');
            if (S.sfx) { thump(); tone(72, 34, 0.28, 0.13, 'sawtooth', 0.02); }
            if (crashTimer) clearTimeout(crashTimer);
            crashTimer = setTimeout(function () {
                crack.classList.remove('on');
                d.documentElement.classList.remove('eto-rb-hit');
            }, 2400);
        }
        sayBubble('ما تذاكر يااااض!', 5.5);
        speakScold();
    }

    function noteActivity() {
        lastActivity = Date.now();
        idleScolded = false;
        if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
        if (crack) crack.classList.remove('on');
        d.documentElement.classList.remove('eto-rb-hit');
    }

    function checkInactivity() {
        if (!vis || !S.idleReminder || RM || idleScolded || d.visibilityState === 'hidden' || settingsOpen) return;
        if (Date.now() - lastActivity < (Number(S.idleSeconds) || 60) * 1000 || R.speaking) return;
        idleScolded = true;
        R.anchor = null;
        plan(clamp(VW / 2, 76, VW - 76), clamp(VH * 0.56, minY(), VH - 22), false);
        idleTimer = setTimeout(function () { idleTimer = null; screenCrash(); }, 820);
    }

    var CSS = [
        'html.eto-lang-on #eto-robot-ground,html.eto-lang-on #eto-robot-root,html.eto-lang-on #eto-robot-thought,html.eto-lang-on #eto-robot-bubble{display:none!important}',
        '#eto-rb{position:fixed;left:0;top:0;width:0;height:0;z-index:10000;pointer-events:none}',
        '#eto-rb .rb-wrap{position:fixed;left:0;top:0;pointer-events:none;opacity:0;transition:opacity .35s ease;will-change:transform;filter:drop-shadow(0 6px 10px rgba(120,40,70,.18))}',
        '#eto-rb .rb-wrap.on{opacity:1}',
        '#eto-rb canvas{display:block}',
        '#eto-rb .rb-bub{position:absolute;transform:translate(-50%,-100%) scale(.7);transform-origin:50% 100%;background:#fff;color:#4a1d33;font-weight:700;font-size:13px;line-height:1.5;padding:8px 13px;border-radius:16px;box-shadow:0 8px 24px rgba(120,40,70,.22);white-space:nowrap;opacity:0;transition:.25s ease;direction:rtl}',
        '#eto-rb .rb-bub::after{content:"";position:absolute;left:50%;bottom:-6px;width:12px;height:12px;background:#fff;transform:translateX(-50%) rotate(45deg);border-radius:2px}',
        '#eto-rb .rb-bub.on{opacity:1;transform:translate(-50%,-100%) scale(1)}',
        '#eto-rb-ui .rb-gear{position:fixed;right:16px;top:calc(env(safe-area-inset-top) + 88px);z-index:10002;width:46px;height:46px;border:0;border-radius:15px;cursor:pointer;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#e11d48,#f97316);box-shadow:0 8px 22px rgba(225,29,72,.3);opacity:0;visibility:hidden;transform:translateX(12px) scale(.88);transition:.28s cubic-bezier(.3,1.6,.5,1)}',
        '#eto-rb-ui .rb-gear.on{opacity:1;visibility:visible;transform:translateX(0) scale(1)}',
        '#eto-rb-ui .rb-gear svg{width:26px;height:26px;transition:transform .5s ease}',
        '#eto-rb-ui .rb-gear:hover svg{transform:rotate(90deg)}',
        '#eto-rb-ui .rb-panel{position:fixed;right:16px;top:calc(env(safe-area-inset-top) + 144px);z-index:10002;width:min(340px,calc(100vw - 32px));max-height:calc(100vh - 166px);overflow:auto;background:#fff;color:#3b1f2e;border-radius:22px;box-shadow:0 18px 50px rgba(60,20,40,.3);direction:rtl;text-align:right;opacity:0;visibility:hidden;transform:translateY(-10px) scale(.96);transform-origin:top right;transition:.25s ease}',
        '#eto-rb-ui .rb-panel.on{opacity:1;visibility:visible;transform:none}',
        '#eto-rb-ui .rb-color{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:14px;font-weight:800}',
        '#eto-rb-ui .rb-color input{width:54px;height:34px;border:1px solid rgba(120,60,80,.18);border-radius:10px;padding:3px;background:#fff;cursor:pointer}',
        '#eto-rb-ui .rb-hd{display:flex;align-items:center;gap:10px;padding:16px 18px;background:linear-gradient(135deg,#e11d48,#f97316);color:#fff;border-radius:22px 22px 0 0}',
        '#eto-rb-ui .rb-hd b{font-size:16px;font-weight:900;display:block}',
        '#eto-rb-ui .rb-hd small{opacity:.85;font-size:12px}',
        '#eto-rb-ui .rb-hd span{flex:1}',
        '#eto-rb-ui .rb-x{border:0;background:rgba(255,255,255,.22);color:#fff;width:30px;height:30px;border-radius:50%;font-size:18px;cursor:pointer;line-height:1}',
        '#eto-rb-ui .rb-body{padding:8px 18px 16px}',
        '#eto-rb-ui .rb-row{display:block;padding:12px 0;border-bottom:1px solid rgba(120,60,80,.1)}',
        '#eto-rb-ui .rb-row:last-child{border-bottom:0}',
        '#eto-rb-ui .rb-row>label,#eto-rb-ui .rb-row>span{display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:800;margin-bottom:9px}',
        '#eto-rb-ui .rb-row em{font-style:normal;color:#e11d48;font-size:13px}',
        '#eto-rb-ui .rb-seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#fdf0f2;padding:5px;border-radius:14px}',
        '#eto-rb-ui .rb-seg button{border:0;background:transparent;color:inherit;font:inherit;font-size:13px;font-weight:800;padding:10px 6px;border-radius:10px;cursor:pointer;transition:.2s}',
        '#eto-rb-ui .rb-seg button.on{background:linear-gradient(135deg,#e11d48,#f97316);color:#fff;box-shadow:0 4px 12px rgba(225,29,72,.3)}',
        '#eto-rb-ui input[type=range]{width:100%;accent-color:#e11d48}',
        '#eto-rb-ui .rb-sw{display:flex!important;align-items:center;justify-content:space-between;cursor:pointer;font-size:14px;font-weight:800}',
        '#eto-rb-ui .rb-sw input{display:none}',
        '#eto-rb-ui .rb-sw i{position:relative;flex:0 0 46px;height:26px;border-radius:99px;background:#e5d3d8;transition:.25s}',
        '#eto-rb-ui .rb-sw i::after{content:"";position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.25);transition:.25s}',
        '#eto-rb-ui .rb-sw input:checked+i{background:linear-gradient(135deg,#e11d48,#f97316)}',
        '#eto-rb-ui .rb-sw input:checked+i::after{right:23px}',
        '#eto-rb-ui .rb-test{display:block;width:calc(100% - 36px);margin:0 18px 18px;border:0;border-radius:14px;padding:12px;font:inherit;font-weight:900;font-size:14px;color:#e11d48;background:#fdf0f2;cursor:pointer;transition:.2s}',
        '#eto-rb-ui .rb-test:hover{background:#fbdde3}',
        '#eto-rb-settings{position:fixed;inset:0;z-index:10005;display:none;direction:rtl;color:#241923;background:radial-gradient(circle at 12% 8%,rgba(255,222,231,.92),transparent 34%),linear-gradient(135deg,#fff9fb 0%,#f7f2ff 52%,#fff7ef 100%);font-family:inherit}',
        '#eto-rb-settings.on{display:block;animation:rbSettingsFade .28s ease both}',
        '@keyframes rbSettingsFade{from{opacity:0}to{opacity:1}}',
        '#eto-rb-settings *{box-sizing:border-box}',
        '#eto-rb-settings .rb-settings-shell{height:100%;min-height:0;display:flex;flex-direction:column;padding:clamp(14px,2.2vw,28px);overflow:auto}',
        '#eto-rb-settings .rb-settings-head{display:flex;align-items:center;justify-content:space-between;gap:14px;max-width:1440px;width:100%;margin:0 auto 18px}',
        '#eto-rb-settings .rb-settings-title{display:flex;flex-direction:column;gap:4px}',
        '#eto-rb-settings .rb-settings-title strong{font-size:clamp(20px,2.5vw,28px);font-weight:900;color:#34212e}',
        '#eto-rb-settings .rb-settings-title span{font-size:12px;font-weight:700;color:#907c8a}',
        '#eto-rb-settings .rb-back{border:1px solid #ead9e2;border-radius:14px;background:#fff;color:#6a3d52;padding:11px 16px;font:inherit;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 6px 18px rgba(80,35,60,.07);transition:.2s}',
        '#eto-rb-settings .rb-back:hover{transform:translateY(-2px);border-color:#e99ab3}',
        '#eto-rb-settings .rb-settings-grid{direction:ltr;display:grid;grid-template-columns:minmax(260px,.82fr) minmax(0,1.55fr);gap:clamp(14px,2vw,26px);max-width:1440px;width:100%;margin:0 auto;flex:1;min-height:0}',
        '#eto-rb-settings .rb-preview-card{direction:rtl;position:relative;min-height:520px;border:1px solid rgba(255,255,255,.92);border-radius:28px;background:linear-gradient(155deg,rgba(255,255,255,.94),rgba(255,238,245,.82));box-shadow:0 18px 55px rgba(80,35,60,.1);overflow:hidden;display:flex;flex-direction:column}',
        '#eto-rb-settings .rb-preview-head{padding:20px 20px 0;position:relative;z-index:2}',
        '#eto-rb-settings .rb-preview-head b{font-size:16px;font-weight:900;color:#43283a;display:block}',
        '#eto-rb-settings .rb-preview-head span{font-size:11px;color:#927b8a;font-weight:700}',
        '#eto-rb-settings .rb-preview-stage{position:relative;overflow:hidden;flex:1;min-height:365px;margin:4px 10px 8px;border-radius:22px;background:radial-gradient(ellipse at 50% 78%,rgba(236,173,198,.25),transparent 44%),linear-gradient(180deg,rgba(255,255,255,.15),rgba(255,235,242,.56))}',
        '#eto-rb-settings .rb-preview-stage:before{content:"";position:absolute;left:12%;right:12%;bottom:23px;height:24px;border-radius:50%;background:rgba(108,61,83,.09);filter:blur(12px)}',
        '#eto-rb-settings .rb-preview-rabbit{position:absolute;left:36%;bottom:16px;width:calc(240px * .92);height:calc(340px * .92);transform:translateX(-50%);filter:drop-shadow(0 12px 17px rgba(113,55,83,.17));will-change:transform}',
        '#eto-rb-settings .rb-preview-rabbit canvas{display:block;width:100%;height:100%}',
        '#eto-rb-settings .rb-preview-rabbit.enter{animation:rbRabbitFromBehind 1.15s cubic-bezier(.18,.82,.2,1.18) both}',
        '@keyframes rbRabbitFromBehind{0%{transform:translate3d(-235%,28px,0) rotate(-13deg) scale(.72);opacity:0}52%{transform:translate3d(-43%,-26px,0) rotate(5deg) scale(1.04);opacity:1}72%{transform:translate3d(-54%,7px,0) rotate(-2deg) scale(.98)}88%{transform:translate3d(-48%,-3px,0) rotate(1deg) scale(1.01)}100%{transform:translate3d(-50%,0,0) rotate(0) scale(1);opacity:1}}',
        '#eto-rb-settings .rb-preview-foot{margin:0 18px 18px;padding:11px 14px;border-radius:14px;background:rgba(255,255,255,.76);color:#806b79;text-align:center;font-size:11px;font-weight:800}',
        '#eto-rb-settings .rb-settings-main{direction:rtl;min-width:0;display:flex;flex-direction:column;min-height:0;border:1px solid rgba(255,255,255,.92);border-radius:28px;background:rgba(255,255,255,.9);box-shadow:0 18px 55px rgba(80,35,60,.1);overflow:hidden}',
        '#eto-rb-settings .rb-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;padding:14px;border-bottom:1px solid #f0e5eb;background:rgba(255,250,252,.9)}',
        '#eto-rb-settings .rb-tab{border:1px solid transparent;border-radius:15px;padding:11px 8px;background:transparent;color:#806d7b;font:inherit;cursor:pointer;text-align:center;transition:.2s;min-width:0}',
        '#eto-rb-settings .rb-tab b{display:block;font-size:13px;font-weight:900}',
        '#eto-rb-settings .rb-tab small{display:block;margin-top:3px;font-size:10px;font-weight:700;opacity:.8}',
        '#eto-rb-settings .rb-tab:hover{background:#fff5f8;color:#b83d68}',
        '#eto-rb-settings .rb-tab.active{background:linear-gradient(135deg,#e95a83,#f29a73);color:#fff;box-shadow:0 7px 18px rgba(225,85,127,.22)}',
        '#eto-rb-settings .rb-settings-pages{padding:clamp(16px,2.4vw,28px);overflow:auto;min-height:0;flex:1}',
        '#eto-rb-settings .rb-settings-page{display:none;animation:rbPageIn .24s ease both}',
        '#eto-rb-settings .rb-settings-page.active{display:block}',
        '@keyframes rbPageIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}',
        '#eto-rb-settings .rb-page-intro{margin-bottom:14px}',
        '#eto-rb-settings .rb-page-intro h2{font-size:19px;font-weight:900;color:#3d2937;margin:0 0 5px}',
        '#eto-rb-settings .rb-page-intro p{font-size:12px;line-height:1.8;color:#927e8b;margin:0;font-weight:700}',
        '#eto-rb-settings .rb-row{display:block;padding:14px 0;border-bottom:1px solid #f1e7ec}',
        '#eto-rb-settings .rb-row:last-child{border-bottom:0}',
        '#eto-rb-settings .rb-row>label,#eto-rb-settings .rb-row>span{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px;font-weight:900;color:#533c4b;margin-bottom:10px}',
        '#eto-rb-settings .rb-row em{font-style:normal;color:#d94d7a;font-size:12px}',
        '#eto-rb-settings .rb-seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding:5px;border-radius:15px;background:#fff4f7}',
        '#eto-rb-settings .rb-seg button{border:1px solid #f0e0e7;border-radius:11px;background:#fff;color:#765566;font:inherit;font-size:12px;font-weight:800;padding:10px 5px;cursor:pointer;transition:.18s}',
        '#eto-rb-settings .rb-seg button:hover{border-color:#eaa3ba;color:#bd426c}',
        '#eto-rb-settings .rb-seg button.on{border-color:transparent;background:linear-gradient(135deg,#e95a83,#f29a73);color:#fff;box-shadow:0 5px 12px rgba(225,85,127,.18)}',
        '#eto-rb-settings input[type=range]{width:100%;accent-color:#e95a83;cursor:pointer}',
        '#eto-rb-settings .rb-color{display:flex;align-items:center;justify-content:space-between;gap:14px}',
        '#eto-rb-settings .rb-color>span{margin:0}',
        '#eto-rb-settings .rb-color input{width:62px;height:38px;border:1px solid #ead7e0;border-radius:11px;padding:3px;background:#fff;cursor:pointer}',
        '#eto-rb-settings .rb-sw{display:flex!important;align-items:center;justify-content:space-between;gap:16px;cursor:pointer}',
        '#eto-rb-settings .rb-sw>span{margin:0}',
        '#eto-rb-settings .rb-sw input{display:none}',
        '#eto-rb-settings .rb-sw i{position:relative;flex:0 0 46px;height:26px;border-radius:99px;background:#e8dce2;transition:.22s}',
        '#eto-rb-settings .rb-sw i:after{content:"";position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.18);transition:.22s}',
        '#eto-rb-settings .rb-sw input:checked+i{background:linear-gradient(135deg,#e95a83,#f29a73)}',
        '#eto-rb-settings .rb-sw input:checked+i:after{right:23px}',
        '#eto-rb-settings .rb-action{border:0;border-radius:13px;padding:12px 17px;background:#fff0f5;color:#bd426c;font:inherit;font-size:13px;font-weight:900;cursor:pointer;transition:.2s}',
        '#eto-rb-settings .rb-action:hover{background:#fbe0e9;transform:translateY(-1px)}',
        '#eto-rb-settings .rb-action.primary{background:linear-gradient(135deg,#e95a83,#f29a73);color:#fff}',
        '#eto-rb-settings .rb-page-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}',
        '#eto-rb-settings .rb-note{padding:13px 15px;border:1px solid #f2e2e9;border-radius:14px;background:#fff9fb;color:#876f7d;font-size:11px;line-height:1.8;font-weight:700;margin-top:14px}',
        'html.eto-rb-settings-open #eto-rb{visibility:hidden}',
        '@media(max-width:760px){#eto-rb-settings .rb-settings-shell{padding:12px}#eto-rb-settings .rb-settings-head{margin-bottom:12px}#eto-rb-settings .rb-settings-grid{grid-template-columns:1fr;grid-template-rows:auto 1fr;gap:12px}#eto-rb-settings .rb-preview-card{min-height:270px;height:290px}#eto-rb-settings .rb-preview-stage{min-height:190px}#eto-rb-settings .rb-preview-rabbit{left:50%;bottom:-23px;transform:translateX(-50%) scale(.62);transform-origin:bottom center}#eto-rb-settings .rb-preview-rabbit.enter{animation:rbRabbitFromBehindMobile 1.05s cubic-bezier(.18,.82,.2,1.18) both}@keyframes rbRabbitFromBehindMobile{0%{transform:translate3d(-235%,18px,0) scale(.45);opacity:0}55%{transform:translate3d(-42%,-12px,0) scale(.65);opacity:1}78%{transform:translate3d(-53%,4px,0) scale(.6)}100%{transform:translate3d(-50%,0,0) scale(.62);opacity:1}}#eto-rb-settings .rb-preview-foot{margin:0 12px 10px;padding:7px}#eto-rb-settings .rb-tabs{padding:9px;gap:4px}#eto-rb-settings .rb-tab{padding:9px 4px}#eto-rb-settings .rb-tab b{font-size:11px}#eto-rb-settings .rb-tab small{font-size:9px}#eto-rb-settings .rb-settings-pages{padding:15px}}',
        '@media(max-width:420px){#eto-rb-settings .rb-settings-title span{display:none}#eto-rb-settings .rb-back{padding:9px 12px;font-size:11px}#eto-rb-settings .rb-seg{grid-template-columns:repeat(2,minmax(0,1fr))}}',
        '#eto-rb .rb-crack{position:fixed;inset:0;z-index:10001;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .22s ease;background:radial-gradient(circle at 50% 52%,rgba(255,255,255,.08),rgba(90,20,35,.06) 62%,transparent 76%)}',
        '#eto-rb .rb-crack.on{opacity:1;visibility:visible;animation:rbCrackFade 2.35s ease forwards}',
        '#eto-rb .rb-crack svg{width:100%;height:100%;display:block;filter:drop-shadow(0 0 3px rgba(20,20,30,.24))}',
        '#eto-rb .rb-crack path{fill:none;stroke:rgba(255,255,255,.9);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
        '#eto-rb .rb-crack .rb-crack-dark{stroke:rgba(35,28,45,.34);stroke-width:4}',
        '@keyframes rbCrackFade{0%,16%{opacity:1}100%{opacity:0;visibility:hidden}}',
        'html.eto-rb-hit body{animation:rbScreenShake .5s cubic-bezier(.36,.07,.19,.97)}',
        '@keyframes rbScreenShake{0%,100%{transform:translate3d(0,0,0)}15%{transform:translate3d(-7px,2px,0)}30%{transform:translate3d(6px,-3px,0)}45%{transform:translate3d(-5px,2px,0)}60%{transform:translate3d(4px,-1px,0)}75%{transform:translate3d(-2px,1px,0)}}',
        '@media(max-width:520px){#eto-rb-ui .rb-gear{right:10px;top:calc(env(safe-area-inset-top) + 82px);width:42px;height:42px}#eto-rb-ui .rb-panel{right:10px;top:calc(env(safe-area-inset-top) + 132px);max-height:calc(100vh - 148px)}}',
        '@media(prefers-reduced-motion:reduce){html.eto-rb-hit body{animation:none!important}#eto-rb .rb-crack.on{animation:none!important;opacity:1}}'
    ].join('');

    var SAMPLES = { es: ['es-ES', 'Hola, ¿cómo estás? Soy tu conejo.'], fr: ['fr-FR', 'Bonjour, je suis ton lapin.'], de: ['de-DE', 'Hallo, ich bin dein Hase.'], it: ['it-IT', 'Ciao, sono il tuo coniglio.'], en: ['en-US', 'Hello, I am your bunny.'] };
    function sample() {
        if (!('speechSynthesis' in w)) return;
        var pg = activeLangPage(), m = /^page-lang-([a-z]{2})/.exec(pg ? pg.id : ''), smp = SAMPLES[m && SAMPLES[m[1]] ? m[1] : 'en'];
        try {
            var ss = w.speechSynthesis; ss.cancel();
            var u = new SpeechSynthesisUtterance(smp[1]); u.lang = smp[0]; u.rate = 0.88;
            var re = new RegExp('^' + smp[0].slice(0, 2) + '[-_]', 'i'), v = ss.getVoices().filter(function (x) { return re.test(x.lang); })[0];
            if (v) u.voice = v;
            tune(u, null, smp[1]); ss.speak(u);
        } catch (e) {}
    }

    function controlMarkup(c) {
        if (c.type === 'choice') return '<div class="rb-row"><span>' + c.label + '</span><div class="rb-seg" data-ctl="' + c.id + '">' + c.opts.map(function (o) { return '<button type="button" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div></div>';
        if (c.type === 'range') return '<div class="rb-row"><label for="rb-' + c.id + '">' + c.label + ' <em id="rb-' + c.id + '-v"></em></label><input id="rb-' + c.id + '" data-ctl="' + c.id + '" type="range" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '"></div>';
        if (c.type === 'color') return '<label class="rb-row rb-color"><span>' + c.label + '</span><input type="color" data-ctl="' + c.id + '"></label>';
        return '<label class="rb-row rb-sw"><span>' + c.label + '</span><input type="checkbox" data-ctl="' + c.id + '"><i></i></label>';
    }

    function sizePreviewCanvas() {
        if (!previewCv) return;
        PK = 0.92;
        var dpr = Math.min(2, w.devicePixelRatio || 1);
        previewCv.width = Math.round(LW * PK * dpr);
        previewCv.height = Math.round(LH * PK * dpr);
        previewCv.style.width = (LW * PK) + 'px';
        previewCv.style.height = (LH * PK) + 'px';
        if (previewWrap) { previewWrap.style.width = (LW * PK) + 'px'; previewWrap.style.height = (LH * PK) + 'px'; }
    }

    function renderPreview(dt) {
        if (!previewCx || !settingsOpen) return;
        PV.t += dt;
        PV.blinkT -= dt;
        if (PV.blinkT <= 0) { PV.blinkP = 0.0001; PV.blinkT = 2.2 + Math.random() * 3.2; }
        if (PV.blinkP > 0) { PV.blinkP += dt / 0.16; if (PV.blinkP >= 1) PV.blinkP = 0; }
        PV.twT -= dt;
        if (PV.twT <= 0) { PV.twP = 0.0001; PV.twT = 3 + Math.random() * 3.5; }
        if (PV.twP > 0) { PV.twP += dt / 0.45; if (PV.twP >= 1) PV.twP = 0; }
        PV.look += ((Math.sin(PV.t * 0.55) * 0.25) - PV.look) * Math.min(1, dt * 3);
        var dpr = Math.min(2, w.devicePixelRatio || 1);
        previewCx.setTransform(dpr * PK, 0, 0, dpr * PK, 0, 0);
        draw(previewCx, {
            t: PV.t, h: 0, sq: Math.sin(PV.t * 2.2) * 0.01, look: PV.look, lookY: Math.sin(PV.t * 0.4) * 0.2,
            lookEar: PV.look, blink: PV.blinkP > 0 ? Math.sin(PV.blinkP * Math.PI) : 0,
            mouth: PV.mouth, tw: PV.twP > 0 ? Math.sin(PV.twP * Math.PI * 3) * (1 - PV.twP) * 0.12 : 0,
            bob: Math.sin(PV.t * 2.2) * 0.8, dir: 1
        });
    }

    function paintSettings() {
        if (!settingsPage) return;
        CONTROLS.forEach(function (c) {
            var el = settingsPage.querySelector('[data-ctl="' + c.id + '"]'); if (!el) return;
            if (c.type === 'choice') Array.prototype.forEach.call(el.querySelectorAll('button'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === S[c.id]); });
            else if (c.type === 'range') { el.value = S[c.id]; var lb = settingsPage.querySelector('#rb-' + c.id + '-v'); if (lb) lb.textContent = c.fmt ? c.fmt(S[c.id]) : S[c.id]; }
            else if (c.type === 'color') el.value = S[c.id];
            else el.checked = !!S[c.id];
        });
    }

    function setSettingsTab(id) {
        if (!SETTINGS_TABS.some(function (t) { return t.id === id; })) id = 'rabbit';
        activeTab = id;
        Array.prototype.forEach.call(settingsPage.querySelectorAll('[data-tab]'), function (b) {
            var active = b.getAttribute('data-tab') === id;
            b.classList.toggle('active', active); b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        Array.prototype.forEach.call(settingsPage.querySelectorAll('[data-settings-page]'), function (page) {
            page.classList.toggle('active', page.getAttribute('data-settings-page') === id);
        });
    }

    function openSettings() {
        if (settingsOpen || !settingsPage) return;
        settingsOpen = true; settingsPage.classList.add('on');
        d.documentElement.classList.add('eto-rb-settings-open');
        noteActivity();
        try { w.history.pushState({ etoRabbitSettings: true }, '', w.location.href); settingsHistoryState = true; } catch (e) { settingsHistoryState = false; }
        previewWrap.classList.remove('enter'); void previewWrap.offsetWidth;
        w.requestAnimationFrame(function () { if (settingsOpen) previewWrap.classList.add('enter'); });
        renderPreview(0.016);
    }

    function closeSettings(fromPop) {
        if (!settingsOpen || !settingsPage) return;
        settingsOpen = false; settingsPage.classList.remove('on');
        d.documentElement.classList.remove('eto-rb-settings-open');
        if (previewWrap) previewWrap.classList.remove('enter');
        noteActivity();
        if (!fromPop && settingsHistoryState) {
            settingsHistoryState = false;
            try { w.history.back(); } catch (e) {}
        } else settingsHistoryState = false;
    }

    function resetAppearance() {
        S.skin = DEF.skin; S.furColor = DEF.furColor; S.accentColor = DEF.accentColor;
        S.ears = DEF.ears; S.bow = DEF.bow;
        saveSettings(); paintSettings();
    }

    function resetAllSettings() {
        Object.keys(DEF).forEach(function (k) { S[k] = DEF[k]; });
        saveSettings(); paintSettings();
    }

    function buildUI() {
        var st = d.createElement('style'); st.textContent = CSS; (d.head || d.documentElement).appendChild(st);

        root = d.createElement('div'); root.id = 'eto-rb';
        wrap = d.createElement('div'); wrap.className = 'rb-wrap';
        cv = d.createElement('canvas'); cx = cv.getContext('2d');
        bubble = d.createElement('div'); bubble.className = 'rb-bub';
        wrap.appendChild(cv); wrap.appendChild(bubble); root.appendChild(wrap);
        crack = d.createElement('div'); crack.className = 'rb-crack';
        crack.innerHTML = '<svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path class="rb-crack-dark" d="M500 520 L420 420 380 300 290 220 M500 520 L600 420 650 300 760 230 M500 520 L410 570 300 650 230 790 M500 520 L600 590 710 670 790 810 M500 520 L490 390 455 300 470 180 M500 520 L550 650 535 760 570 900 M420 420 L330 390 260 330 M600 420 L690 390 760 330 M410 570 L360 670 300 720 M600 590 L650 690 720 750"/><path d="M500 520 L420 420 380 300 290 220 M500 520 L600 420 650 300 760 230 M500 520 L410 570 300 650 230 790 M500 520 L600 590 710 670 790 810 M500 520 L490 390 455 300 470 180 M500 520 L550 650 535 760 570 900 M420 420 L330 390 260 330 M600 420 L690 390 760 330 M410 570 L360 670 300 720 M600 590 L650 690 720 750"/></svg>';
        root.appendChild(crack); d.body.appendChild(root);

        var ui = d.createElement('div'); ui.id = 'eto-rb-ui';
        ui.innerHTML = '<button type="button" class="rb-gear" aria-label="إعدادات اللغات" title="إعدادات اللغات"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button>';
        d.body.appendChild(ui);
        gearBtn = ui.querySelector('.rb-gear');

        settingsPage = d.createElement('div'); settingsPage.id = 'eto-rb-settings';
        var tabButtons = SETTINGS_TABS.map(function (t) { return '<button type="button" class="rb-tab" data-tab="' + t.id + '" aria-selected="false"><b>' + t.label + '</b><small>' + t.hint + '</small></button>'; }).join('');
        var pages = SETTINGS_TABS.map(function (t) {
            var controls = CONTROLS.filter(function (c) { return c.page === t.id; }).map(controlMarkup).join('');
            var intro = t.id === 'rabbit' ? '<h2>اختار شكل الأرنب</h2><p>غيّر الألوان والتفاصيل وشوف كل تعديل مباشرة في المعاينة اللي على الشمال.</p>' :
                t.id === 'voice' ? '<h2>صوت الأرنب</h2><p>اختار أسلوب النطق وسرعته، وجرب الصوت على اللغة المفتوحة حاليًا.</p>' :
                t.id === 'behavior' ? '<h2>الحركة والتذكير</h2><p>حدد إمتى الأرنب يفكرك بالمذاكرة، وتحكم في تأثير كسر الشاشة.</p>' :
                '<h2>الإعدادات العامة</h2><p>تحكم في ظهور الأرنب والمؤثرات المصاحبة لحركته.</p>';
            var extra = t.id === 'rabbit' ? '<div class="rb-page-actions"><button type="button" class="rb-action" data-reset="appearance">استعادة شكل الأرنب الافتراضي</button></div>' :
                t.id === 'voice' ? '<div class="rb-page-actions"><button type="button" class="rb-action primary rb-test">تجربة الصوت</button></div><div class="rb-note">النغمة المعدّلة تعتمد على الأصوات المثبتة في جهازك؛ الصوت المسجّل الحقيقي يحتاج ملفًا صوتيًا مستقلًا.</div>' :
                t.id === 'behavior' ? '<div class="rb-note">التذكير يعمل أثناء عرض صفحة اللغة فقط، ويتوقف تلقائيًا عند فتح الإعدادات أو عند إخفاء الصفحة.</div>' :
                '<div class="rb-page-actions"><button type="button" class="rb-action" data-reset="all">استعادة كل الإعدادات الافتراضية</button></div>';
            return '<section class="rb-settings-page' + (t.id === 'rabbit' ? ' active' : '') + '" data-settings-page="' + t.id + '"><div class="rb-page-intro">' + intro + '</div>' + controls + extra + '</section>';
        }).join('');
        settingsPage.innerHTML = '<div class="rb-settings-shell"><header class="rb-settings-head"><div class="rb-settings-title"><strong>إعدادات اللغات</strong><span>خصص الأرنب وطريقة تفاعله معاك</span></div><button type="button" class="rb-back">العودة إلى الدرس</button></header><div class="rb-settings-grid"><aside class="rb-preview-card"><div class="rb-preview-head"><b>المعاينة</b><span>بحبك</span></div><div class="rb-preview-stage"><div class="rb-preview-rabbit"><canvas class="rb-preview-canvas"></canvas></div></div><div class="rb-preview-foot">معاينة شكل الأرنب قبل حفظ اختيارك</div></aside><main class="rb-settings-main"><nav class="rb-tabs" role="tablist" aria-label="أقسام الإعدادات">' + tabButtons + '</nav><div class="rb-settings-pages">' + pages + '</div></main></div></div>';
        d.body.appendChild(settingsPage);
        previewWrap = settingsPage.querySelector('.rb-preview-rabbit');
        previewCv = settingsPage.querySelector('.rb-preview-canvas'); previewCx = previewCv.getContext('2d');

        paintSettings(); setSettingsTab('rabbit'); sizePreviewCanvas();
        gearBtn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); openSettings(); });
        settingsPage.addEventListener('click', function (e) {
            var tab = e.target.closest('[data-tab]');
            if (tab) { setSettingsTab(tab.getAttribute('data-tab')); return; }
            if (e.target.closest('.rb-back')) { closeSettings(false); return; }
            if (e.target.closest('.rb-test')) { sample(); return; }
            var reset = e.target.closest('[data-reset]');
            if (reset) { if (reset.getAttribute('data-reset') === 'appearance') resetAppearance(); else resetAllSettings(); return; }
            var b = e.target.closest('.rb-seg button');
            if (b) {
                var id = b.parentNode.getAttribute('data-ctl'); S[id] = b.getAttribute('data-v');
                if (id === 'skin' && SKINS[S.skin]) { S.furColor = SKINS[S.skin].fur; S.accentColor = SKINS[S.skin].accent; }
                saveSettings(); paintSettings();
                if (id === 'voice') sample();
            }
        });
        settingsPage.addEventListener('input', function (e) {
            var el = e.target, id = el.getAttribute('data-ctl'); if (!id) return;
            if (el.type === 'range') { S[id] = parseFloat(el.value); saveSettings(); paintSettings(); }
            else if (el.type === 'color') { S[id] = el.value; S.skin = 'custom'; saveSettings(); paintSettings(); }
        });
        settingsPage.addEventListener('change', function (e) {
            var el = e.target, id = el.getAttribute('data-ctl'); if (el.type !== 'checkbox' || !id) return;
            S[id] = el.checked; saveSettings();
            if (id === 'sfx' && el.checked) squeak();
        });
        w.addEventListener('popstate', function () { if (settingsOpen) closeSettings(true); });
        d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && settingsOpen) closeSettings(false); });
    }

    /* ================= اللووب ================= */
    var lastT = 0, frames = 0;
    function frame(now) {
        var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016); lastT = now;
        if (frames++ % 12 === 0) {
            var on = !!activeLangPage();
            gearBtn.classList.toggle('on', on && !settingsOpen);
            d.documentElement.classList.toggle('eto-lang-on', on);   /* بيخفي الروبوت العام في صفحات اللغات */
            if (!on && settingsOpen) closeSettings(true);
            var v = on && S.show;
            if (v && !vis) {            /* دخول الأرنب من خارج الشاشة عند فتح صفحة لغة */
                R.x = VW + 140; R.y = VH - 14; R.mode = 'idle'; R.anchor = null; R.idleT = 99;
                plan(VW - 110, VH - 14, false); R.hopSfx = false;
                try { if (!localStorage.getItem('etoRabbitSeen')) { localStorage.setItem('etoRabbitSeen', '1'); setTimeout(function () { sayBubble('أهلاً! أنا أرنب إيتو. دوس على أي كلمة وأنا أنطقها.', 6); }, 1800); } } catch (e) {}
            }
            vis = v; wrap.classList.toggle('on', vis);
        }
        if (vis) { checkInactivity(); update(dt); render(); }
        if (settingsOpen) renderPreview(dt);
        if (vis || settingsOpen) w.requestAnimationFrame(frame);
        else setTimeout(function () { w.requestAnimationFrame(frame); }, 250);
    }

    function init() {
        buildUI(); sizeAll();
        w.addEventListener('resize', sizeAll);
        ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (name) {
            w.addEventListener(name, noteActivity, { passive: true, capture: true });
        });
        d.addEventListener('visibilitychange', function () { if (d.visibilityState === 'visible') noteActivity(); });
        d.addEventListener('click', function (e) {
            var el = e.target.closest && e.target.closest('#lang-root .lg-word,#lang-root .lg-line,#lang-root .lg-note,#lang-root .lg-letter,#lang-root .lg-dict-item,#lang-root .lg-opt');
            if (el) { lastEl = el; lastElT = Date.now(); }
        }, true);
        lastActivity = Date.now();
        w.requestAnimationFrame(frame);
    }

    w.EtoRabbit = { tune: tune, stop: stop, settings: S, bubble: sayBubble, _draw: draw };
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})(window, document);
