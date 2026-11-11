/* ==========================================================
   Eto.Edu — أداة تحويل OGG إلى MP3
   المسار: Data/Tools/ogg-to-mp3/ogg-to-mp3.js

   الفكرة: بنفك ملف الـOGG (Vorbis أو Opus) بـ Web Audio ونرمّزه MP3
   بمكتبة lamejs. كله بيحصل على جهاز المستخدم ومفيش أي رفع لسيرفر.

   - معدل العينات الأصلي بيتقرا من هيدر الـOGG وبيتحافظ عليه (لو مدعوم في MP3).
   - Safari القديم مش بيفك OGG، فبنقول للمستخدم يجرّب Chrome أو Edge أو Firefox.
   - لو مكتبة MP3 ماتحملتش (مفيش نت) بنقول للمستخدم، لأن مفيش بديل نطلّع بيه MP3.
   ========================================================== */
(function () {
    'use strict';

    /* ---------- ثوابت ---------- */
    const LAME_URL = 'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js';
    const LAME_RATES = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];
    const MAX_FILE_BYTES = 1024 * 1024 * 1024; // 1 جيجا
    const CANCEL = 'cancel';
    const DECODE = 'decode';
    const NOLAME = 'nolame';

    const state = {
        file: null,
        busy: false,
        cancelled: false,
        outputUrl: null,
        srcUrl: null,
        lamePromise: null
    };

    /* ---------- أدوات صغيرة ---------- */
    const $ = (id) => document.getElementById(id);
    const val = (id, fallback) => {
        const el = $(id);
        return el && el.value ? el.value : fallback;
    };
    const show = (id, visible) => {
        const el = $(id);
        if (el) el.classList.toggle('hidden', !visible);
    };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const toast = (m, t) => {
        if (typeof window.showToast === 'function') window.showToast(m, t || 'success');
    };

    function setStatus(text, isError) {
        const el = $('o2m-status');
        if (!el) return;
        el.textContent = text || '';
        el.style.color = isError ? '#dc2626' : '';
    }

    function setProgress(p) {
        p = Math.max(0, Math.min(100, p || 0));
        const bar = $('o2m-progress-bar');
        const txt = $('o2m-progress-text');
        if (bar) bar.style.width = p + '%';
        if (txt) txt.textContent = Math.round(p) + '%';
    }

    function fmtSize(b) {
        if (b >= 1073741824) return (b / 1073741824).toFixed(2) + ' GB';
        if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
        return Math.max(1, Math.round(b / 1024)) + ' KB';
    }

    function fmtDur(sec) {
        sec = Math.max(0, Math.round(sec || 0));
        return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
    }

    function safeName(n) {
        return String(n || 'audio').replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]+/g, '_').trim().slice(0, 80) || 'audio';
    }

    function setBusy(b) {
        state.busy = b;
        const s = $('o2m-start');
        if (s) {
            s.disabled = b;
            s.style.opacity = b ? '0.6' : '';
            s.style.cursor = b ? 'not-allowed' : '';
        }
        show('o2m-cancel', b);
    }

    /* ---------- تحميل مكتبة MP3 ---------- */
    function loadLame() {
        if (window.lamejs) return Promise.resolve(true);
        if (state.lamePromise) return state.lamePromise;
        state.lamePromise = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = LAME_URL;
            s.async = true;
            s.onload = () => resolve(!!window.lamejs);
            s.onerror = () => {
                state.lamePromise = null; // نسمح بمحاولة تانية بعدين
                s.remove();
                resolve(false);
            };
            document.head.appendChild(s);
        });
        return state.lamePromise;
    }

    /* ---------- قراءة معدل العينات من هيدر الـOGG ---------- */
    async function detectOggRate(file) {
        try {
            const u8 = new Uint8Array(await file.slice(0, 512).arrayBuffer());
            if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== 'OggS') return 0;
            let bin = '';
            for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);

            if (bin.indexOf('OpusHead') !== -1) return 48000; // Opus بيتفك دايمًا على 48kHz

            const i = bin.indexOf('\x01vorbis'); // هيدر Vorbis: المعدل بعد النسخة وعدد القنوات
            if (i !== -1 && i + 16 <= u8.length) {
                return new DataView(u8.buffer).getUint32(i + 12, true);
            }
        } catch (e) { /* مش مشكلة */ }
        return 0;
    }

    function makeContext(rate) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (rate >= 8000 && rate <= 96000) {
            try { return new AC({ sampleRate: rate }); } catch (e) { /* نكمل بالافتراضي */ }
        }
        return new AC();
    }

    /* تغيير معدل العينات */
    async function resample(buffer, rate) {
        const off = new OfflineAudioContext(
            buffer.numberOfChannels,
            Math.max(1, Math.ceil(buffer.duration * rate)),
            rate
        );
        const src = off.createBufferSource();
        src.buffer = buffer;
        src.connect(off.destination);
        src.start();
        return off.startRendering();
    }

    /* ---------- الترميز ---------- */
    function toInt16(f32) {
        const out = new Int16Array(f32.length);
        for (let i = 0; i < f32.length; i++) {
            const v = Math.max(-1, Math.min(1, f32[i]));
            out[i] = Math.round(v < 0 ? v * 0x8000 : v * 0x7fff);
        }
        return out;
    }

    /* لو اخترت Mono بنخلط اليسار واليمين مع بعض بدل ما نرمي قناة */
    function getChannels(buffer, mono) {
        const n = buffer.numberOfChannels;
        if (mono && n > 1) {
            const a = buffer.getChannelData(0);
            const b = buffer.getChannelData(1);
            const m = new Float32Array(a.length);
            for (let i = 0; i < m.length; i++) m[i] = (a[i] + b[i]) / 2;
            return [m];
        }
        const out = [buffer.getChannelData(0)];
        if (!mono && n > 1) out.push(buffer.getChannelData(1));
        return out;
    }

    async function encodeMp3(buffer, kbps, mono) {
        const chans = getChannels(buffer, mono).map(toInt16);
        const ch = chans.length;
        const enc = new window.lamejs.Mp3Encoder(ch, buffer.sampleRate, kbps);
        const left = chans[0];
        const right = ch === 2 ? chans[1] : null;
        const block = 1152 * 20;
        const total = left.length;
        const parts = [];

        for (let i = 0, n = 0; i < total; i += block, n++) {
            if (state.cancelled) return null;
            const l = left.subarray(i, i + block);
            const buf = ch === 2
                ? enc.encodeBuffer(l, right.subarray(i, i + block))
                : enc.encodeBuffer(l);
            if (buf.length) parts.push(new Uint8Array(buf));
            setProgress(40 + (i / total) * 59);
            if (n % 8 === 0) await sleep(0); // نسيب المتصفح يحدّث الشاشة
        }

        const end = enc.flush();
        if (end.length) parts.push(new Uint8Array(end));
        return new Blob(parts, { type: 'audio/mpeg' });
    }

    /* ---------- التحويل ---------- */
    async function startConversion() {
        if (state.busy) return;
        if (!state.file) {
            toast('اختار ملف الـOGG الأول', 'error');
            setStatus('اختار ملف الـOGG الأول', true);
            return;
        }
        if (state.file.size > MAX_FILE_BYTES) {
            toast('الملف كبير أوي على المتصفح', 'error');
            setStatus('الملف أكبر من 1 جيجا، المتصفح مش هيقدر يفك تشفيره. جرّب ملف أصغر.', true);
            return;
        }

        state.cancelled = false;
        setBusy(true);
        show('o2m-result', false);
        show('o2m-progress-wrap', true);
        setProgress(0);

        let ctx = null;
        try {
            setStatus('بنحمّل أداة الـMP3...');
            const lameOk = await loadLame();
            if (!lameOk) throw new Error(NOLAME);
            if (state.cancelled) throw new Error(CANCEL);
            setProgress(5);

            setStatus('بنقرأ الملف...');
            const srcRate = await detectOggRate(state.file);
            const arr = await state.file.arrayBuffer();
            if (state.cancelled) throw new Error(CANCEL);
            setProgress(15);

            ctx = makeContext(srcRate);
            setStatus('بنفك الملف... (ممكن ياخد شوية مع الملفات الطويلة)');
            let audio;
            try {
                audio = await ctx.decodeAudioData(arr);
            } catch (e) {
                throw new Error(DECODE);
            }
            if (state.cancelled) throw new Error(CANCEL);
            if (!audio || !audio.length) throw new Error(DECODE);
            setProgress(30);

            // مكتبة lamejs بتشتغل بس مع معدلات معينة، وممكن المستخدم يختار معدل بنفسه
            const chosen = parseInt(val('o2m-rate', 'auto'), 10) || 0;
            let target = chosen || audio.sampleRate;
            if (LAME_RATES.indexOf(target) === -1) target = 44100;
            if (target !== audio.sampleRate) {
                setStatus('بنظبط معدل العينات...');
                audio = await resample(audio, target);
                if (state.cancelled) throw new Error(CANCEL);
            }
            setProgress(40);

            const kbps = Math.max(32, Math.min(320, parseInt(val('o2m-bitrate', '192'), 10) || 192));
            const mono = val('o2m-channels', 'stereo') === 'mono';

            setStatus('بنحوّل لـMP3...');
            const blob = await encodeMp3(audio, kbps, mono);
            if (!blob) throw new Error(CANCEL);

            const player = $('o2m-preview');
            if (player) player.pause();
            if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
            state.outputUrl = URL.createObjectURL(blob);
            const name = safeName(state.file.name) + '.mp3';

            if (player) player.src = state.outputUrl;
            const link = $('o2m-download');
            if (link) {
                link.href = state.outputUrl;
                link.setAttribute('download', name);
            }
            const info = $('o2m-result-info');
            if (info) {
                const saved = state.file.size > 0 ? Math.max(0, Math.round((1 - blob.size / state.file.size) * 100)) : 0;
                info.textContent = name + ' · ' + fmtDur(audio.duration) + ' · ' + kbps + ' kbps · ' +
                    fmtSize(blob.size) + (saved ? ' (أصغر بحوالي ' + saved + '%)' : '');
            }
            show('o2m-result', true);

            setProgress(100);
            setStatus('تم التحويل بنجاح');
            toast('تم تحويل الملف إلى MP3');
        } catch (err) {
            const msg = err && err.message;
            if (msg === CANCEL) {
                setStatus('تم إلغاء التحويل');
                setProgress(0);
            } else if (msg === NOLAME) {
                setStatus('أداة الـMP3 ماتحمّلتش. اتأكد من النت وجرّب تاني.', true);
                toast('تعذر تحميل أداة MP3', 'error');
            } else if (msg === DECODE) {
                setStatus('المتصفح مقدرش يقرأ الملف ده. اتأكد إنه ملف OGG سليم، أو جرّب Chrome أو Edge أو Firefox (سفاري ممكن ما يفكّش OGG).', true);
                toast('تعذر قراءة ملف الصوت', 'error');
            } else if (err && err.name === 'RangeError') {
                setStatus('الملف كبير على ذاكرة المتصفح. جرّب ملف أصغر.', true);
                toast('الذاكرة مش كفاية للملف ده', 'error');
            } else {
                console.error('[OGG → MP3]', err);
                setStatus('حصل خطأ أثناء التحويل', true);
                toast('حصل خطأ أثناء التحويل', 'error');
            }
        } finally {
            if (ctx && ctx.state !== 'closed' && ctx.close) {
                try { ctx.close().catch(() => {}); } catch (e) { /* تجاهل */ }
            }
            setBusy(false);
        }
    }

    /* ---------- اختيار الملف ---------- */
    function onFileChosen(file) {
        if (!file) return;
        if (state.busy) {
            toast('استنى لحد ما التحويل الحالي يخلص', 'error');
            return;
        }
        const okType = /^audio\//.test(file.type) || /\.(ogg|oga|opus|wav|flac|m4a|aac|weba)$/i.test(file.name);
        if (!okType) {
            toast('اختار ملف صوت (OGG مثلًا)', 'error');
            return;
        }

        state.file = file;
        const nameEl = $('o2m-file-name');
        if (nameEl) nameEl.textContent = file.name + ' · ' + fmtSize(file.size);
        show('o2m-result', false);
        show('o2m-progress-wrap', false);
        setStatus('جاهز للتحويل');
        setProgress(0);

        const a = $('o2m-source');
        if (a) {
            a.pause();
            if (state.srcUrl) URL.revokeObjectURL(state.srcUrl);
            state.srcUrl = URL.createObjectURL(file);
            a.src = state.srcUrl;
            show('o2m-source-wrap', true);
        }
    }

    function init() {
        if (!$('o2m-start')) return;

        const input = $('o2m-file');
        if (input) {
            input.addEventListener('change', () => {
                onFileChosen(input.files && input.files[0]);
                input.value = '';
            });
        }

        $('o2m-start').addEventListener('click', startConversion);

        const cancel = $('o2m-cancel');
        if (cancel) {
            cancel.addEventListener('click', () => {
                if (!state.busy) return;
                state.cancelled = true;
                setStatus('بنلغي التحويل...');
            });
        }

        const drop = $('o2m-drop');
        if (drop) {
            drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('dragover'); });
            drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
            drop.addEventListener('drop', (e) => {
                e.preventDefault();
                drop.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) onFileChosen(e.dataTransfer.files[0]);
            });
        }

        window.addEventListener('beforeunload', (e) => {
            if (state.busy) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
