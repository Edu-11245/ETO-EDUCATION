/* Eto.Edu - أداة تحويل MP4 إلى MP3
   كل المعالجة بتتم على جهاز المستخدم. بنفك صوت الفيديو بـ Web Audio ونرمّزه MP3 بمكتبة lamejs.
   لو المكتبة ماتحملتش (مفيش نت مثلاً) بنطلّع WAV بدل MP3. */
(function () {
    'use strict';

    /* ---------- ثوابت ---------- */
    const LAME_URL = 'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js';
    const LAME_RATES = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];
    const MAX_FILE_BYTES = 1.5 * 1024 * 1024 * 1024; // أكتر من كده المتصفح غالبًا هيقع من الذاكرة
    const CANCEL = 'cancel';
    const DECODE = 'decode';

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
        const el = $('mp4a-status');
        if (!el) return;
        el.textContent = text || '';
        el.style.color = isError ? '#dc2626' : '';
    }

    function setProgress(p) {
        p = Math.max(0, Math.min(100, p || 0));
        const bar = $('mp4a-progress-bar');
        const txt = $('mp4a-progress-text');
        if (bar) bar.style.width = p + '%';
        if (txt) txt.textContent = Math.round(p) + '%';
    }

    function fmtSize(b) {
        if (b >= 1073741824) return (b / 1073741824).toFixed(2) + ' GB';
        if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
        return Math.max(1, Math.round(b / 1024)) + ' KB';
    }

    function safeName(n) {
        return String(n || 'audio').replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]+/g, '_').trim().slice(0, 80) || 'audio';
    }

    function setBusy(b) {
        state.busy = b;
        const s = $('mp4a-start');
        if (s) {
            s.disabled = b;
            s.style.opacity = b ? '0.6' : '';
            s.style.cursor = b ? 'not-allowed' : '';
        }
        show('mp4a-cancel', b);
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

    /* ---------- معالجة الصوت ---------- */
    function toInt16(f32) {
        const out = new Int16Array(f32.length);
        for (let i = 0; i < f32.length; i++) {
            const v = Math.max(-1, Math.min(1, f32[i]));
            out[i] = Math.round(v < 0 ? v * 0x8000 : v * 0x7fff);
        }
        return out;
    }

    /* بترجّع قناة أو قناتين. لو اخترت Mono بنخلط اليسار واليمين مع بعض بدل ما نرمي القناة اليمين */
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

    /* مكتبة lamejs بتشتغل بس مع معدلات عينات معينة، لو الجهاز طلّع معدل غريب بنحوله لـ 44100 */
    async function ensureLameRate(buffer) {
        if (LAME_RATES.indexOf(buffer.sampleRate) !== -1) return buffer;
        try {
            const target = 44100;
            const off = new OfflineAudioContext(
                buffer.numberOfChannels,
                Math.ceil(buffer.duration * target),
                target
            );
            const src = off.createBufferSource();
            src.buffer = buffer;
            src.connect(off.destination);
            src.start();
            return await off.startRendering();
        } catch (e) {
            return buffer;
        }
    }

    function encodeWav(buffer, mono) {
        const chans = getChannels(buffer, mono);
        const ch = chans.length;
        const rate = buffer.sampleRate;
        const len = buffer.length;
        const pcm = new Int16Array(len * ch);
        for (let i = 0, o = 0; i < len; i++) {
            for (let k = 0; k < ch; k++) {
                const v = Math.max(-1, Math.min(1, chans[k][i]));
                pcm[o++] = Math.round(v < 0 ? v * 0x8000 : v * 0x7fff);
            }
        }

        const dataBytes = pcm.length * 2;
        const head = new DataView(new ArrayBuffer(44));
        const str = (o, s) => { for (let i = 0; i < s.length; i++) head.setUint8(o + i, s.charCodeAt(i)); };
        str(0, 'RIFF'); head.setUint32(4, 36 + dataBytes, true); str(8, 'WAVE'); str(12, 'fmt ');
        head.setUint32(16, 16, true); head.setUint16(20, 1, true); head.setUint16(22, ch, true);
        head.setUint32(24, rate, true); head.setUint32(28, rate * ch * 2, true);
        head.setUint16(32, ch * 2, true); head.setUint16(34, 16, true);
        str(36, 'data'); head.setUint32(40, dataBytes, true);

        return new Blob([head, pcm], { type: 'audio/wav' });
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
            setProgress(35 + (i / total) * 63);
            if (n % 8 === 0) await sleep(0); // نسيب المتصفح يتنفس ويحدّث الشاشة
        }

        const end = enc.flush();
        if (end.length) parts.push(new Uint8Array(end));
        return new Blob(parts, { type: 'audio/mpeg' });
    }

    /* ---------- التحويل ---------- */
    async function startConversion() {
        if (state.busy) return;
        if (!state.file) {
            toast('اختار ملف الفيديو الأول', 'error');
            setStatus('اختار ملف الفيديو الأول', true);
            return;
        }
        if (state.file.size > MAX_FILE_BYTES) {
            toast('الملف كبير أوي على المتصفح', 'error');
            setStatus('الملف أكبر من 1.5 جيجا، المتصفح مش هيقدر يفك صوته. جرّب فيديو أصغر.', true);
            return;
        }

        state.cancelled = false;
        setBusy(true);
        show('mp4a-result', false);
        show('mp4a-progress-wrap', true);
        setProgress(0);

        let ctx = null;
        try {
            setStatus('بنقرأ الملف...');
            const arr = await state.file.arrayBuffer();
            if (state.cancelled) throw new Error(CANCEL);
            setProgress(10);

            const AC = window.AudioContext || window.webkitAudioContext;
            try {
                ctx = new AC({ sampleRate: 44100 }); // معدل متوافق مع MP3
            } catch (e) {
                ctx = new AC();
            }

            setStatus('بنفك صوت الفيديو... (ممكن ياخد شوية مع الملفات الكبيرة)');
            let audio;
            try {
                audio = await ctx.decodeAudioData(arr);
            } catch (e) {
                throw new Error(DECODE);
            }
            if (state.cancelled) throw new Error(CANCEL);
            if (!audio || !audio.length) throw new Error(DECODE);
            setProgress(35);

            const kbps = Math.max(32, Math.min(320, parseInt(val('mp4a-bitrate', '192'), 10) || 192));
            const mono = val('mp4a-channels', 'stereo') === 'mono';
            let blob = null;
            let ext = 'mp3';

            setStatus('بنحمّل أداة الـMP3...');
            const ok = await loadLame();
            if (state.cancelled) throw new Error(CANCEL);

            if (ok) {
                audio = await ensureLameRate(audio);
                setStatus('بنحوّل لـMP3...');
                blob = await encodeMp3(audio, kbps, mono);
                if (!blob) throw new Error(CANCEL);
                show('mp4a-format-note', false);
            } else {
                setStatus('بنجهّز الملف...');
                await sleep(0);
                blob = encodeWav(audio, mono);
                ext = 'wav';
                show('mp4a-format-note', true);
            }

            const player = $('mp4a-preview');
            if (player) player.pause();
            if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
            state.outputUrl = URL.createObjectURL(blob);
            const name = safeName(state.file.name) + '.' + ext;

            if (player) player.src = state.outputUrl;
            const link = $('mp4a-download');
            if (link) {
                link.href = state.outputUrl;
                link.setAttribute('download', name);
            }
            const info = $('mp4a-result-info');
            if (info) info.textContent = name + ' · ' + fmtSize(blob.size);
            show('mp4a-result', true);

            setProgress(100);
            setStatus('تم التحويل بنجاح');
            toast(ext === 'mp3' ? 'تم استخراج الصوت' : 'تم استخراج الصوت (WAV لأن أداة MP3 ماتحملتش)', 'success');
        } catch (err) {
            const msg = err && err.message;
            if (msg === CANCEL) {
                setStatus('تم إلغاء التحويل');
                setProgress(0);
            } else if (msg === DECODE) {
                setStatus('المتصفح مقدرش يقرأ صوت الملف ده. ممكن يكون الفيديو من غير صوت، جرّب Chrome أو Edge، أو ملف بصيغة تانية.', true);
                toast('تعذر قراءة صوت الملف', 'error');
            } else if (err && err.name === 'RangeError') {
                setStatus('الملف كبير على ذاكرة المتصفح. جرّب فيديو أصغر.', true);
                toast('الذاكرة مش كفاية للملف ده', 'error');
            } else {
                console.error('[MP4 → MP3]', err);
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
        const okType = /^video\//.test(file.type) || /\.(mp4|m4v|mov|webm|mkv|avi|3gp)$/i.test(file.name);
        if (!okType) {
            toast('اختار ملف فيديو', 'error');
            return;
        }

        state.file = file;
        const nameEl = $('mp4a-file-name');
        if (nameEl) nameEl.textContent = file.name + ' · ' + fmtSize(file.size);
        show('mp4a-result', false);
        show('mp4a-progress-wrap', false);
        setStatus('');
        setProgress(0);

        const v = $('mp4a-source');
        if (v) {
            v.pause();
            if (state.srcUrl) URL.revokeObjectURL(state.srcUrl);
            state.srcUrl = URL.createObjectURL(file);
            v.src = state.srcUrl;
            show('mp4a-source-wrap', true);
        }
    }

    function init() {
        if (!$('mp4a-start')) return;

        const input = $('mp4a-file');
        if (input) {
            input.addEventListener('change', () => {
                onFileChosen(input.files && input.files[0]);
                input.value = '';
            });
        }

        $('mp4a-start').addEventListener('click', startConversion);

        const cancel = $('mp4a-cancel');
        if (cancel) {
            cancel.addEventListener('click', () => {
                if (!state.busy) return;
                state.cancelled = true;
                setStatus('بنلغي التحويل...');
            });
        }

        const drop = $('mp4a-drop');
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
