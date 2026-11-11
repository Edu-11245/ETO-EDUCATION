/* ==========================================================
   Eto.Edu — أداة تحويل MP3 إلى WAV
   المسار: Data/Tools/mp3-to-wav/mp3-to-wav.js

   الفكرة: بنفك تشفير الـMP3 بـ Web Audio ونكتب ملف WAV غير مضغوط
   (PCM 16 أو 24 بت). كله بيحصل على جهاز المستخدم ومفيش أي رفع لسيرفر.

   - معدل العينات الأصلي للملف بيتقرا من الهيدر وبيتحافظ عليه (لو اخترت "الأصلي").
   - ممكن تغيّر معدل العينات أو تحوّل لمونو.
   ========================================================== */
(function () {
    'use strict';

    /* ---------- ثوابت ---------- */
    const MAX_FILE_BYTES = 1024 * 1024 * 1024;          // 1 جيجا للملف المصدر
    const MAX_WAV_BYTES = 4 * 1024 * 1024 * 1024 - 1048576; // حد صيغة WAV (4 جيجا)
    const CANCEL = 'cancel';
    const DECODE = 'decode';
    const TOOBIG = 'toobig';

    const state = {
        file: null,
        busy: false,
        cancelled: false,
        outputUrl: null,
        srcUrl: null
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
        const el = $('m2w-status');
        if (!el) return;
        el.textContent = text || '';
        el.style.color = isError ? '#dc2626' : '';
    }

    function setProgress(p) {
        p = Math.max(0, Math.min(100, p || 0));
        const bar = $('m2w-progress-bar');
        const txt = $('m2w-progress-text');
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
        const s = $('m2w-start');
        if (s) {
            s.disabled = b;
            s.style.opacity = b ? '0.6' : '';
            s.style.cursor = b ? 'not-allowed' : '';
        }
        show('m2w-cancel', b);
    }

    /* ---------- قراءة معدل العينات الأصلي من هيدر الـMP3 ---------- */
    async function detectMp3Rate(file) {
        try {
            const head = new Uint8Array(await file.slice(0, 10).arrayBuffer());
            let start = 0;
            if (head[0] === 0x49 && head[1] === 0x44 && head[2] === 0x33) { // وسم ID3v2
                const size = ((head[6] & 0x7f) << 21) | ((head[7] & 0x7f) << 14) | ((head[8] & 0x7f) << 7) | (head[9] & 0x7f);
                start = 10 + size;
            }
            const u8 = new Uint8Array(await file.slice(start, start + 16384).arrayBuffer());
            for (let i = 0; i + 3 < u8.length; i++) {
                if (u8[i] === 0xff && (u8[i + 1] & 0xe0) === 0xe0) {
                    const ver = (u8[i + 1] >> 3) & 3;   // 3 = MPEG1, 2 = MPEG2, 0 = MPEG2.5
                    const layer = (u8[i + 1] >> 1) & 3;
                    const sr = (u8[i + 2] >> 2) & 3;
                    if (ver === 1 || layer === 0 || sr === 3) continue;
                    const base = [44100, 48000, 32000][sr];
                    return ver === 3 ? base : ver === 2 ? base / 2 : base / 4;
                }
            }
        } catch (e) { /* مش مشكلة، هنستخدم معدل الجهاز */ }
        return 0;
    }

    function makeContext(rate) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (rate >= 8000 && rate <= 96000) {
            try { return new AC({ sampleRate: rate }); } catch (e) { /* نكمل بالافتراضي */ }
        }
        return new AC();
    }

    /* تغيير معدل العينات و/أو عدد القنوات */
    async function remix(buffer, rate, channels) {
        const off = new OfflineAudioContext(channels, Math.max(1, Math.ceil(buffer.duration * rate)), rate);
        const src = off.createBufferSource();
        src.buffer = buffer;
        src.connect(off.destination);
        src.start();
        return off.startRendering();
    }

    /* ---------- كتابة ملف WAV ---------- */
    async function encodeWav(buffer, bits, onProgress) {
        const ch = Math.min(2, buffer.numberOfChannels);
        const rate = buffer.sampleRate;
        const len = buffer.length;
        const bytesPer = bits / 8;
        const dataBytes = len * ch * bytesPer;
        if (dataBytes > MAX_WAV_BYTES) throw new Error(TOOBIG);

        const head = new DataView(new ArrayBuffer(44));
        const str = (o, s) => { for (let i = 0; i < s.length; i++) head.setUint8(o + i, s.charCodeAt(i)); };
        str(0, 'RIFF'); head.setUint32(4, 36 + dataBytes, true); str(8, 'WAVE'); str(12, 'fmt ');
        head.setUint32(16, 16, true); head.setUint16(20, 1, true); head.setUint16(22, ch, true);
        head.setUint32(24, rate, true); head.setUint32(28, rate * ch * bytesPer, true);
        head.setUint16(32, ch * bytesPer, true); head.setUint16(34, bits, true);
        str(36, 'data'); head.setUint32(40, dataBytes, true);

        const chans = [];
        for (let c = 0; c < ch; c++) chans.push(buffer.getChannelData(c));

        const parts = [head];
        const FRAMES = 32768;
        for (let i = 0, n = 0; i < len; i += FRAMES, n++) {
            if (state.cancelled) return null;
            const cnt = Math.min(FRAMES, len - i);

            if (bits === 16) {
                const pcm = new Int16Array(cnt * ch);
                for (let f = 0, o = 0; f < cnt; f++) {
                    for (let k = 0; k < ch; k++) {
                        const v = Math.max(-1, Math.min(1, chans[k][i + f]));
                        pcm[o++] = Math.round(v < 0 ? v * 0x8000 : v * 0x7fff);
                    }
                }
                parts.push(pcm);
            } else {
                const pcm = new Uint8Array(cnt * ch * 3);
                for (let f = 0, o = 0; f < cnt; f++) {
                    for (let k = 0; k < ch; k++) {
                        const v = Math.max(-1, Math.min(1, chans[k][i + f]));
                        const s = Math.round(v < 0 ? v * 0x800000 : v * 0x7fffff);
                        pcm[o++] = s & 255;
                        pcm[o++] = (s >> 8) & 255;
                        pcm[o++] = (s >> 16) & 255;
                    }
                }
                parts.push(pcm);
            }

            if (onProgress) onProgress(i / len);
            if (n % 16 === 0) await sleep(0); // نسيب المتصفح يحدّث الشاشة
        }
        return new Blob(parts, { type: 'audio/wav' });
    }

    /* ---------- التحويل ---------- */
    async function startConversion() {
        if (state.busy) return;
        if (!state.file) {
            toast('اختار ملف الصوت الأول', 'error');
            setStatus('اختار ملف الصوت الأول', true);
            return;
        }
        if (state.file.size > MAX_FILE_BYTES) {
            toast('الملف كبير أوي على المتصفح', 'error');
            setStatus('الملف أكبر من 1 جيجا، المتصفح مش هيقدر يفك تشفيره. جرّب ملف أصغر.', true);
            return;
        }

        state.cancelled = false;
        setBusy(true);
        show('m2w-result', false);
        show('m2w-progress-wrap', true);
        setProgress(0);

        let ctx = null;
        try {
            setStatus('بنقرأ الملف...');
            const srcRate = await detectMp3Rate(state.file);
            const arr = await state.file.arrayBuffer();
            if (state.cancelled) throw new Error(CANCEL);
            setProgress(10);

            ctx = makeContext(srcRate);
            setStatus('بنفك تشفير الصوت... (ممكن ياخد شوية مع الملفات الطويلة)');
            let audio;
            try {
                audio = await ctx.decodeAudioData(arr);
            } catch (e) {
                throw new Error(DECODE);
            }
            if (state.cancelled) throw new Error(CANCEL);
            if (!audio || !audio.length) throw new Error(DECODE);
            setProgress(40);

            const mono = val('m2w-channels', 'stereo') === 'mono';
            const bits = val('m2w-depth', '16') === '24' ? 24 : 16;
            const wantRate = parseInt(val('m2w-rate', 'auto'), 10) || audio.sampleRate;
            const outCh = mono ? 1 : Math.min(2, audio.numberOfChannels);

            if (wantRate !== audio.sampleRate || outCh !== audio.numberOfChannels) {
                setStatus('بنظبط معدل العينات والقنوات...');
                audio = await remix(audio, wantRate, outCh);
                if (state.cancelled) throw new Error(CANCEL);
            }
            setProgress(50);

            setStatus('بنكتب ملف الـWAV...');
            const blob = await encodeWav(audio, bits, (p) => setProgress(50 + p * 49));
            if (!blob) throw new Error(CANCEL);

            const player = $('m2w-preview');
            if (player) player.pause();
            if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
            state.outputUrl = URL.createObjectURL(blob);
            const name = safeName(state.file.name) + '.wav';

            if (player) player.src = state.outputUrl;
            const link = $('m2w-download');
            if (link) {
                link.href = state.outputUrl;
                link.setAttribute('download', name);
            }
            const info = $('m2w-result-info');
            if (info) {
                info.textContent = name + ' · ' + fmtDur(audio.duration) + ' · ' +
                    +(audio.sampleRate / 1000).toFixed(2) + ' kHz · ' +
                    (audio.numberOfChannels === 1 ? 'مونو' : 'ستيريو') + ' · ' + bits + '-bit · ' + fmtSize(blob.size);
            }
            show('m2w-result', true);

            setProgress(100);
            setStatus('تم التحويل بنجاح');
            toast('تم تحويل الملف إلى WAV');
        } catch (err) {
            const msg = err && err.message;
            if (msg === CANCEL) {
                setStatus('تم إلغاء التحويل');
                setProgress(0);
            } else if (msg === DECODE) {
                setStatus('المتصفح مقدرش يقرأ الملف ده. اتأكد إنه ملف صوت سليم، أو جرّب Chrome أو Edge.', true);
                toast('تعذر قراءة ملف الصوت', 'error');
            } else if (msg === TOOBIG) {
                setStatus('الملف الناتج هيعدّي 4 جيجا (حد صيغة WAV). جرّب مونو أو 16-bit أو معدل عينات أقل.', true);
                toast('الملف الناتج كبير أوي', 'error');
            } else if (err && err.name === 'RangeError') {
                setStatus('الملف كبير على ذاكرة المتصفح. جرّب ملف أصغر أو إعدادات أخف.', true);
                toast('الذاكرة مش كفاية للملف ده', 'error');
            } else {
                console.error('[MP3 → WAV]', err);
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
        const okType = /^audio\//.test(file.type) || /\.(mp3|mpga|m4a|aac|ogg|oga|opus|flac|wav|weba)$/i.test(file.name);
        if (!okType) {
            toast('اختار ملف صوت (MP3 مثلًا)', 'error');
            return;
        }

        state.file = file;
        const nameEl = $('m2w-file-name');
        if (nameEl) nameEl.textContent = file.name + ' · ' + fmtSize(file.size);
        show('m2w-result', false);
        show('m2w-progress-wrap', false);
        setStatus('جاهز للتحويل');
        setProgress(0);

        const a = $('m2w-source');
        if (a) {
            a.pause();
            if (state.srcUrl) URL.revokeObjectURL(state.srcUrl);
            state.srcUrl = URL.createObjectURL(file);
            a.src = state.srcUrl;
            show('m2w-source-wrap', true);
        }
    }

    function init() {
        if (!$('m2w-start')) return;

        const input = $('m2w-file');
        if (input) {
            input.addEventListener('change', () => {
                onFileChosen(input.files && input.files[0]);
                input.value = '';
            });
        }

        $('m2w-start').addEventListener('click', startConversion);

        const cancel = $('m2w-cancel');
        if (cancel) {
            cancel.addEventListener('click', () => {
                if (!state.busy) return;
                state.cancelled = true;
                setStatus('بنلغي التحويل...');
            });
        }

        const drop = $('m2w-drop');
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
