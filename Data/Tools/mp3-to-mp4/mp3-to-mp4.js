/* ==========================================================
   Eto.Edu — أداة تحويل MP3 إلى MP4
   المسار: Data/Tools/mp3-to-mp4/mp3-to-mp4.js

   الفكرة: بنفك تشفير الصوت، ونرسم كل فريم على Canvas (صورة غلاف
   أو خلفية ملونة + عنوان + بارات صوتية + شريط تقدم)، وبعدين
   MediaRecorder بيسجّل الصورة والصوت مع بعض في ملف فيديو.
   كله بيحصل جوه المتصفح بدون رفع أي ملف لسيرفر.

   ملاحظات:
   - التسجيل بيمشي بسرعة الصوت الحقيقية (مدة الفيديو = مدة الصوت).
   - الأفضل تسيب التبويب مفتوح وظاهر أثناء التحويل.
   - Chrome/Edge الحديثين بيطلعوا MP4 مباشرة، والمتصفحات اللي
     مش بتدعم ده بيطلع منها WebM وبننبّه المستخدم.
   ========================================================== */
(function () {
    'use strict';

    /* ---------- ثوابت ---------- */
    const FPS = 30;
    const FONT_FAMILY = 'Cairo, Tahoma, Arial, sans-serif';
    const CANCEL = 'cancel';
    const DECODE = 'decode';

    const SIZES = {
        '360': { w: 640, h: 360, bitrate: 1200000 },
        '480': { w: 854, h: 480, bitrate: 2000000 },
        '720': { w: 1280, h: 720, bitrate: 3500000 }
    };

    const state = {
        audioFile: null,
        coverImg: null,
        coverUrl: null,
        busy: false,
        cancelled: false,
        stopNow: null,
        outputUrl: null
    };

    /* ---------- أدوات صغيرة ---------- */
    const $ = (id) => document.getElementById(id);
    const val = (id, fallback) => {
        const el = $(id);
        return el && el.value ? el.value : fallback;
    };
    const on = (id, evt, fn) => {
        const el = $(id);
        if (el) el.addEventListener(evt, fn);
    };
    const show = (id, visible) => {
        const el = $(id);
        if (el) el.classList.toggle('hidden', !visible);
    };
    const toast = (msg, type) => {
        if (typeof window.showToast === 'function') window.showToast(msg, type || 'success');
    };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    function pickMime() {
        if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return null;
        const candidates = [
            'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
            'video/mp4;codecs=avc1,mp4a.40.2',
            'video/mp4;codecs=avc1.640028,mp4a.40.2',
            'video/mp4',
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm'
        ];
        return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || null;
    }

    function fmtTime(sec) {
        sec = Math.max(0, Math.floor(sec || 0));
        const m = Math.floor(sec / 60);
        const s = String(sec % 60).padStart(2, '0');
        return m + ':' + s;
    }

    function fmtSize(bytes) {
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' ميجا';
        return Math.max(1, Math.round(bytes / 1024)) + ' كيلو';
    }

    function shade(hex, amount) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
        if (!m) return '#000000';
        const mix = (v) => Math.max(0, Math.min(255, Math.round(parseInt(v, 16) * (1 + amount))));
        return 'rgb(' + mix(m[1]) + ',' + mix(m[2]) + ',' + mix(m[3]) + ')';
    }

    function hexToRgba(hex, alpha) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
        if (!m) return 'rgba(255,255,255,' + alpha + ')';
        return 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',' + alpha + ')';
    }

    function safeName(name) {
        return String(name || 'audio').replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'audio';
    }

    function setStatus(text, isError) {
        const el = $('mp3v-status');
        if (!el) return;
        el.textContent = text || '';
        el.style.color = isError ? '#dc2626' : '';
    }

    function setProgress(pct) {
        pct = Math.max(0, Math.min(100, pct || 0));
        const bar = $('mp3v-progress-bar');
        const txt = $('mp3v-progress-text');
        if (bar) bar.style.width = pct + '%';
        if (txt) txt.textContent = Math.round(pct) + '%';
    }

    function setBusy(busy) {
        state.busy = busy;
        const start = $('mp3v-start');
        if (start) {
            start.disabled = busy;
            start.classList.toggle('opacity-60', busy);
            start.classList.toggle('cursor-not-allowed', busy);
        }
        show('mp3v-cancel', busy);
    }

    /* الخط لازم يكون محمّل قبل الرسم على Canvas، وإلا العربي بيطلع بخط عادي */
    async function ensureFont() {
        try {
            if (document.fonts && document.fonts.load) {
                await Promise.race([
                    document.fonts.load('900 32px Cairo', 'عربي Abc'),
                    sleep(1500)
                ]);
            }
        } catch (e) { /* مش مشكلة، هنستخدم الخط البديل */ }
    }

    /* ---------- الرسم ---------- */
    function wrapLines(c, text, maxW) {
        const words = text.split(/\s+/).filter(Boolean);
        const lines = [];
        let cur = '';
        for (const word of words) {
            const test = cur ? cur + ' ' + word : word;
            if (!cur || c.measureText(test).width <= maxW) {
                cur = test;
            } else {
                lines.push(cur);
                cur = word;
            }
        }
        if (cur) lines.push(cur);
        return lines;
    }

    /* بنحسب شكل العنوان مرة واحدة (حجم الخط + تقسيم الأسطر) بدل ما نحسبه كل فريم */
    function layoutTitle(c, title, w, h) {
        if (!title) return null;
        const rtl = /[\u0600-\u06FF]/.test(title);
        const maxW = w * 0.84;
        const fontOf = (s) => '900 ' + s + 'px ' + FONT_FAMILY;
        c.direction = rtl ? 'rtl' : 'ltr';

        for (let size = Math.round(h * 0.085); size >= 16; size -= 2) {
            c.font = fontOf(size);
            const lines = wrapLines(c, title, maxW);
            if (lines.length <= 3 && lines.every((l) => c.measureText(l).width <= maxW)) {
                return { size: size, lines: lines, font: fontOf(size), rtl: rtl };
            }
        }
        c.font = fontOf(16);
        return { size: 16, lines: wrapLines(c, title, maxW).slice(0, 3), font: fontOf(16), rtl: rtl };
    }

    function fillRound(c, x, y, w, h, r) {
        if (typeof c.roundRect === 'function') {
            c.beginPath();
            c.roundRect(x, y, w, h, r);
            c.fill();
        } else {
            c.fillRect(x, y, w, h);
        }
    }

    function drawBackground(c, w, h, o) {
        if (o.cover) {
            const r = Math.max(w / o.cover.width, h / o.cover.height);
            const dw = o.cover.width * r;
            const dh = o.cover.height * r;
            c.drawImage(o.cover, (w - dw) / 2, (h - dh) / 2, dw, dh);
            const shadeG = c.createLinearGradient(0, 0, 0, h);
            shadeG.addColorStop(0, 'rgba(0,0,0,0.30)');
            shadeG.addColorStop(1, 'rgba(0,0,0,0.65)');
            c.fillStyle = shadeG;
            c.fillRect(0, 0, w, h);
        } else {
            const g = c.createLinearGradient(0, 0, w, h);
            g.addColorStop(0, o.bg);
            g.addColorStop(1, shade(o.bg, -0.55));
            c.fillStyle = g;
            c.fillRect(0, 0, w, h);

            // إضاءة خفيفة من فوق بلون الـ accent
            const glow = c.createRadialGradient(w / 2, h * 0.2, 0, w / 2, h * 0.2, w * 0.7);
            glow.addColorStop(0, hexToRgba(o.accent, 0.22));
            glow.addColorStop(1, hexToRgba(o.accent, 0));
            c.fillStyle = glow;
            c.fillRect(0, 0, w, h);
        }
    }

    function drawTitle(c, w, h, o) {
        const t = o.titleLayout;
        if (!t) return;
        const lineH = t.size * 1.35;
        const centerY = h * (o.viz === 'bars' ? 0.38 : 0.46);
        const startY = centerY - ((t.lines.length - 1) * lineH) / 2;

        c.font = t.font;
        c.direction = t.rtl ? 'rtl' : 'ltr';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.shadowColor = 'rgba(0,0,0,0.55)';
        c.shadowBlur = 14;
        c.shadowOffsetY = 2;
        c.fillStyle = '#ffffff';
        t.lines.forEach((line, i) => c.fillText(line, w / 2, startY + i * lineH));
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;
    }

    function drawBars(c, w, h, o) {
        if (!o.analyser) return;
        o.analyser.getByteFrequencyData(o.data);

        const n = 56;
        const slot = (w * 0.8) / n;
        const barW = slot * 0.62;
        const startX = w * 0.1 + (slot - barW) / 2;
        const baseY = h * 0.86;
        const maxH = h * 0.28;

        const g = c.createLinearGradient(0, baseY - maxH, 0, baseY);
        g.addColorStop(0, o.accent);
        g.addColorStop(1, shade(o.accent, -0.4));
        c.fillStyle = g;

        for (let i = 0; i < n; i++) {
            const idx = Math.min(o.data.length - 1, Math.floor(Math.pow(i / n, 1.3) * o.data.length * 0.8));
            const v = o.data[idx] / 255;
            const bh = v * maxH + 5;
            fillRound(c, startX + i * slot, baseY - bh, barW, bh, barW / 2);
        }
    }

    function drawProgress(c, w, h, o) {
        const thick = Math.max(4, Math.round(h * 0.012));
        const progress = o.duration > 0 ? Math.min(1, o.elapsed / o.duration) : 0;

        c.fillStyle = 'rgba(255,255,255,0.25)';
        c.fillRect(0, h - thick, w, thick);
        c.fillStyle = o.accent;
        c.fillRect(0, h - thick, w * progress, thick);

        const size = Math.max(11, Math.round(h * 0.032));
        c.font = '700 ' + size + 'px ' + FONT_FAMILY;
        c.direction = 'ltr';
        c.textAlign = 'center';
        c.textBaseline = 'alphabetic';
        c.fillStyle = 'rgba(255,255,255,0.85)';
        c.fillText(fmtTime(o.elapsed) + ' / ' + fmtTime(o.duration), w / 2, h - thick - size * 0.7);
    }

    function drawFrame(c, w, h, o) {
        c.clearRect(0, 0, w, h);
        drawBackground(c, w, h, o);
        drawTitle(c, w, h, o);
        if (o.viz === 'bars') drawBars(c, w, h, o);
        if (o.showProgress) drawProgress(c, w, h, o);
    }

    /* ---------- التحويل ---------- */
    async function startConversion() {
        if (state.busy) return;

        if (!state.audioFile) {
            toast('اختار ملف الـ MP3 الأول', 'error');
            setStatus('اختار ملف الصوت الأول', true);
            return;
        }

        const mime = pickMime();
        if (!mime) {
            toast('المتصفح ده مش بيدعم تسجيل الفيديو، جرّب Google Chrome أو Edge', 'error');
            return;
        }

        const size = SIZES[val('mp3v-quality', '480')] || SIZES['480'];
        const opts = {
            bg: val('mp3v-bg', '#1e3a8a'),
            accent: val('mp3v-accent', '#38bdf8'),
            title: val('mp3v-title', '').trim(),
            viz: val('mp3v-viz', 'bars'),
            showProgress: val('mp3v-progress-line', 'off') === 'on',
            cover: state.coverImg
        };

        state.cancelled = false;
        setBusy(true);
        show('mp3v-result', false);
        show('mp3v-progress-wrap', true);
        setProgress(0);
        setStatus('بنجهّز الصوت...');

        let actx = null;
        let timer = null;

        try {
            await ensureFont();

            const Ctx = window.AudioContext || window.webkitAudioContext;
            actx = new Ctx();

            let buffer;
            try {
                buffer = await actx.decodeAudioData(await state.audioFile.arrayBuffer());
            } catch (e) {
                throw new Error(DECODE);
            }
            if (state.cancelled) throw new Error(CANCEL);

            const duration = buffer.duration;
            if (!(duration > 0)) throw new Error(DECODE);

            const source = actx.createBufferSource();
            source.buffer = buffer;

            const analyser = actx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            const freqData = new Uint8Array(analyser.frequencyBinCount);

            const dest = actx.createMediaStreamDestination();
            source.connect(analyser);
            analyser.connect(dest);

            const canvas = document.createElement('canvas');
            canvas.width = size.w;
            canvas.height = size.h;
            const c2d = canvas.getContext('2d');
            const titleLayout = layoutTitle(c2d, opts.title, size.w, size.h);

            const stream = new MediaStream([
                ...canvas.captureStream(FPS).getVideoTracks(),
                ...dest.stream.getAudioTracks()
            ]);

            let recorder;
            try {
                recorder = new MediaRecorder(stream, {
                    mimeType: mime,
                    videoBitsPerSecond: size.bitrate,
                    audioBitsPerSecond: 192000
                });
            } catch (e) {
                recorder = new MediaRecorder(stream, { mimeType: mime });
            }

            const chunks = [];
            let recError = null;
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size) chunks.push(e.data);
            };
            recorder.onerror = (e) => {
                recError = (e && e.error) || e || new Error('recorder');
                if (state.stopNow) state.stopNow();
            };
            const stopped = new Promise((resolve) => { recorder.onstop = resolve; });

            const ended = new Promise((resolve) => { source.onended = resolve; });
            state.stopNow = () => {
                try { source.stop(); } catch (e) { /* already stopped */ }
            };

            await actx.resume();
            recorder.start(1000);
            const t0 = actx.currentTime;
            source.start();

            setStatus('بنسجّل الفيديو... سيب التبويب مفتوح وظاهر لحد ما يخلص');

            // setInterval بدل requestAnimationFrame: الأخير بيقف خالص لو التبويب اتخبّى
            let lastUi = 0;
            const render = () => {
                const elapsed = Math.min(actx.currentTime - t0, duration);
                drawFrame(c2d, size.w, size.h, {
                    bg: opts.bg,
                    accent: opts.accent,
                    title: opts.title,
                    titleLayout: titleLayout,
                    viz: opts.viz,
                    showProgress: opts.showProgress,
                    cover: opts.cover,
                    analyser: analyser,
                    data: freqData,
                    elapsed: elapsed,
                    duration: duration
                });
                const now = performance.now();
                if (now - lastUi > 250) {
                    lastUi = now;
                    setProgress((elapsed / duration) * 100);
                    setStatus('بنسجّل... ' + fmtTime(elapsed) + ' / ' + fmtTime(duration));
                }
            };
            render();
            timer = setInterval(render, 1000 / FPS);

            await ended;
            clearInterval(timer);
            timer = null;

            if (!state.cancelled && !recError) {
                drawFrame(c2d, size.w, size.h, {
                    bg: opts.bg,
                    accent: opts.accent,
                    title: opts.title,
                    titleLayout: titleLayout,
                    viz: 'none',
                    showProgress: opts.showProgress,
                    cover: opts.cover,
                    analyser: analyser,
                    data: freqData,
                    elapsed: duration,
                    duration: duration
                });
                await sleep(400);
            }

            if (recorder.state !== 'inactive') recorder.stop();
            await stopped;

            if (state.cancelled) throw new Error(CANCEL);
            if (recError) throw recError;
            if (!chunks.length) throw new Error('empty');

            const isMp4 = mime.indexOf('mp4') !== -1;
            const blob = new Blob(chunks, { type: mime.split(';')[0] });

            const video = $('mp3v-preview');
            if (video) video.pause();
            if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
            state.outputUrl = URL.createObjectURL(blob);

            const fileName = safeName(state.audioFile.name) + (isMp4 ? '.mp4' : '.webm');
            const link = $('mp3v-download');
            if (video) video.src = state.outputUrl;
            if (link) {
                link.href = state.outputUrl;
                link.download = fileName;
            }

            show('mp3v-format-note', !isMp4);
            show('mp3v-result', true);
            const res = $('mp3v-result');
            if (res && res.scrollIntoView) res.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setProgress(100);
            setStatus('خلص! حجم الملف ' + fmtSize(blob.size));
            toast(isMp4 ? 'تم تحويل الصوت إلى MP4' : 'تم التحويل (الصيغة WebM لأن المتصفح مش بيدعم MP4)');
        } catch (err) {
            const msg = err && err.message;
            if (msg === CANCEL) {
                setStatus('تم إلغاء التحويل');
                setProgress(0);
                toast('تم إلغاء التحويل', 'error');
            } else if (msg === DECODE) {
                setStatus('المتصفح مقدرش يقرأ الملف ده. اتأكد إنه ملف صوت سليم (MP3, WAV, M4A...).', true);
                toast('تعذر قراءة ملف الصوت', 'error');
            } else {
                console.error('[MP3 → MP4]', err);
                setStatus('حصلت مشكلة أثناء التحويل، جرّب تاني أو استخدم Chrome', true);
                toast('حصلت مشكلة أثناء التحويل', 'error');
            }
        } finally {
            if (timer) clearInterval(timer);
            state.stopNow = null;
            if (actx && actx.state !== 'closed') actx.close().catch(() => {});
            setBusy(false);
        }
    }

    function cancelConversion() {
        if (!state.busy) return;
        state.cancelled = true;
        setStatus('بنلغي التحويل...');
        if (state.stopNow) state.stopNow();
    }

    /* ---------- اختيار الملفات ---------- */
    function onAudioChosen(file) {
        if (!file) return;
        if (state.busy) {
            toast('استنى لحد ما التحويل الحالي يخلص', 'error');
            return;
        }
        const looksAudio = (file.type && file.type.indexOf('audio') === 0) ||
            /\.(mp3|wav|m4a|ogg|aac|flac|opus|weba)$/i.test(file.name);
        if (!looksAudio) {
            toast('اختار ملف صوت (MP3 مثلًا)', 'error');
            return;
        }
        state.audioFile = file;
        const nameEl = $('mp3v-audio-name');
        if (nameEl) nameEl.textContent = file.name + ' • ' + fmtSize(file.size);
        setStatus('جاهز للتحويل');
        show('mp3v-result', false);
        show('mp3v-progress-wrap', false);
        setProgress(0);
    }

    function onCoverChosen(file) {
        if (!file) return;
        if (!file.type || file.type.indexOf('image') !== 0) {
            toast('اختار صورة للغلاف', 'error');
            return;
        }
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            if (state.coverUrl) URL.revokeObjectURL(state.coverUrl);
            state.coverUrl = url;
            state.coverImg = img;
            const nameEl = $('mp3v-cover-name');
            if (nameEl) nameEl.textContent = file.name;
            show('mp3v-cover-remove', true);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            toast('مقدرتش أقرأ الصورة دي، جرّب صورة تانية', 'error');
        };
        img.src = url;
    }

    function removeCover() {
        state.coverImg = null;
        if (state.coverUrl) URL.revokeObjectURL(state.coverUrl);
        state.coverUrl = null;
        const input = $('mp3v-cover');
        if (input) input.value = '';
        const nameEl = $('mp3v-cover-name');
        if (nameEl) nameEl.textContent = 'من غير صورة (هنستخدم لون الخلفية)';
        show('mp3v-cover-remove', false);
    }

    /* ---------- التشغيل ---------- */
    function init() {
        if (!$('mp3v-start')) return;

        on('mp3v-audio-btn', 'click', () => { const i = $('mp3v-audio'); if (i) i.click(); });
        on('mp3v-audio', 'change', (e) => {
            onAudioChosen(e.target.files && e.target.files[0]);
            e.target.value = '';
        });

        on('mp3v-cover-btn', 'click', () => { const i = $('mp3v-cover'); if (i) i.click(); });
        on('mp3v-cover', 'change', (e) => {
            onCoverChosen(e.target.files && e.target.files[0]);
            e.target.value = '';
        });
        on('mp3v-cover-remove', 'click', removeCover);

        const drop = $('mp3v-drop');
        if (drop) {
            drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('dragover'); });
            drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
            drop.addEventListener('drop', (e) => {
                e.preventDefault();
                drop.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) onAudioChosen(e.dataTransfer.files[0]);
            });
        }

        on('mp3v-start', 'click', startConversion);
        on('mp3v-cancel', 'click', cancelConversion);

        // تنبيه لو المستخدم حاول يقفل الصفحة أو يخبّي التبويب وقت التسجيل
        window.addEventListener('beforeunload', (e) => {
            if (state.busy) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (state.busy && document.hidden) {
                toast('ارجع للتبويب عشان الفيديو يطلع بأحسن جودة', 'error');
            }
        });

        if (!pickMime()) {
            setStatus('المتصفح ده مش بيدعم تسجيل الفيديو، استخدم Chrome أو Edge', true);
        } else {
            setStatus('اختار ملف الصوت وابدأ');
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
