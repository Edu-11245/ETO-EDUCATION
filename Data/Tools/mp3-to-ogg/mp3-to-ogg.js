/* ==========================================================
   Eto.Edu — أداة تحويل MP3 إلى OGG
   المسار: Data/Tools/mp3-to-ogg/mp3-to-ogg.js

   الفكرة: بنفك تشفير الـMP3 بـ Web Audio، ونرمّزه Opus بمشفّر المتصفح
   (WebCodecs AudioEncoder)، وبعدين بنلفّه في حاوية Ogg بنفسنا.
   الناتج ملف OGG (Opus): جودة أعلى من Vorbis في نفس الحجم.
   كله بيحصل على جهاز المستخدم ومفيش أي رفع لسيرفر ولا مكتبات خارجية.

   المتطلبات: Chrome / Edge أو Firefox حديث (بيدعموا AudioEncoder).
   ========================================================== */
(function () {
    'use strict';

    /* ---------- ثوابت ---------- */
    const MAX_FILE_BYTES = 1024 * 1024 * 1024; // 1 جيجا
    const OPUS_RATE = 48000;
    const OPUS_FRAME = 960;      // 20ms عند 48kHz
    const OPUS_PRESKIP = 312;    // تأخير المشفّر القياسي عند 48kHz
    const PACKETS_PER_PAGE = 25; // حوالي نص ثانية في كل صفحة Ogg
    const CANCEL = 'cancel';
    const DECODE = 'decode';
    const NOENC = 'noenc';

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
        const el = $('m2o-status');
        if (!el) return;
        el.textContent = text || '';
        el.style.color = isError ? '#dc2626' : '';
    }

    function setProgress(p) {
        p = Math.max(0, Math.min(100, p || 0));
        const bar = $('m2o-progress-bar');
        const txt = $('m2o-progress-text');
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
        const s = $('m2o-start');
        if (s) {
            s.disabled = b;
            s.style.opacity = b ? '0.6' : '';
            s.style.cursor = b ? 'not-allowed' : '';
        }
        show('m2o-cancel', b);
    }

    /* ---------- هل المتصفح بيدعم ترميز Opus؟ ---------- */
    async function opusSupported(channels) {
        if (typeof window.AudioEncoder === 'undefined' || typeof window.AudioData === 'undefined') return false;
        try {
            const r = await window.AudioEncoder.isConfigSupported({
                codec: 'opus',
                sampleRate: OPUS_RATE,
                numberOfChannels: channels,
                bitrate: 128000
            });
            return !!(r && r.supported);
        } catch (e) {
            return false;
        }
    }

    /* ---------- فك التشفير وتجهيز الصوت ---------- */
    function makeContext() {
        const AC = window.AudioContext || window.webkitAudioContext;
        try { return new AC({ sampleRate: OPUS_RATE }); } catch (e) { return new AC(); }
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

    /* ---------- ترميز Opus ---------- */
    async function encodeOpus(buffer, kbps, onProgress) {
        const ch = buffer.numberOfChannels;
        const total = buffer.length;
        const packets = [];
        let encError = null;

        const enc = new window.AudioEncoder({
            output: (chunk) => {
                const u = new Uint8Array(chunk.byteLength);
                chunk.copyTo(u);
                packets.push(u);
            },
            error: (e) => { encError = e; }
        });
        enc.configure({
            codec: 'opus',
            sampleRate: OPUS_RATE,
            numberOfChannels: ch,
            bitrate: kbps * 1000,
            opus: { frameDuration: 20000 }
        });

        const FR = 4800; // 100ms في كل دفعة
        for (let i = 0, n = 0; i < total; i += FR, n++) {
            if (state.cancelled) {
                try { enc.close(); } catch (e) { /* تجاهل */ }
                return null;
            }
            if (encError) throw encError;

            const cnt = Math.min(FR, total - i);
            const data = new Float32Array(cnt * ch);
            for (let k = 0; k < ch; k++) data.set(buffer.getChannelData(k).subarray(i, i + cnt), k * cnt);

            const ad = new window.AudioData({
                format: 'f32-planar',
                sampleRate: OPUS_RATE,
                numberOfFrames: cnt,
                numberOfChannels: ch,
                timestamp: Math.round((i * 1e6) / OPUS_RATE),
                data: data
            });
            enc.encode(ad);
            ad.close();

            while (enc.encodeQueueSize > 10) await sleep(4); // نسيب المشفّر يلحق
            if (onProgress) onProgress(i / total);
            if (n % 4 === 0) await sleep(0);
        }

        await enc.flush();
        try { enc.close(); } catch (e) { /* تجاهل */ }
        if (encError) throw encError;
        if (!packets.length) throw new Error('empty');
        return packets;
    }

    /* ---------- حاوية Ogg ---------- */
    const CRC_TABLE = (function () {
        const t = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let r = i << 24;
            for (let j = 0; j < 8; j++) r = (r & 0x80000000) ? ((r << 1) ^ 0x04c11db7) : (r << 1);
            t[i] = r >>> 0;
        }
        return t;
    })();

    function oggCrc(bytes) {
        let crc = 0;
        for (let i = 0; i < bytes.length; i++) {
            crc = ((crc << 8) ^ CRC_TABLE[((crc >>> 24) ^ bytes[i]) & 255]) >>> 0;
        }
        return crc >>> 0;
    }

    function makePage(serial, seq, flags, granule, packets) {
        const segs = [];
        let bodyLen = 0;
        packets.forEach((p) => {
            let left = p.length;
            while (left >= 255) { segs.push(255); left -= 255; }
            segs.push(left);
            bodyLen += p.length;
        });

        const page = new Uint8Array(27 + segs.length + bodyLen);
        const dv = new DataView(page.buffer);
        page.set([0x4f, 0x67, 0x67, 0x53], 0);                 // "OggS"
        page[4] = 0;                                           // النسخة
        page[5] = flags;                                       // 0x02 = بداية، 0x04 = نهاية
        dv.setUint32(6, granule % 4294967296, true);           // granule (أول 32 بت)
        dv.setUint32(10, Math.floor(granule / 4294967296), true);
        dv.setUint32(14, serial, true);
        dv.setUint32(18, seq, true);
        dv.setUint32(22, 0, true);                             // CRC مؤقتًا صفر
        page[26] = segs.length;
        page.set(segs, 27);

        let o = 27 + segs.length;
        packets.forEach((p) => { page.set(p, o); o += p.length; });

        dv.setUint32(22, oggCrc(page), true);
        return page;
    }

    function textBytes(s) {
        return Uint8Array.from(String(s), (c) => c.charCodeAt(0) & 255);
    }

    function buildOgg(packets, channels, totalFrames) {
        const serial = Math.floor(Math.random() * 4294967295) >>> 0;

        // OpusHead
        const head = new Uint8Array(19);
        const hv = new DataView(head.buffer);
        head.set(textBytes('OpusHead'), 0);
        head[8] = 1;                                // النسخة
        head[9] = channels;
        hv.setUint16(10, OPUS_PRESKIP, true);
        hv.setUint32(12, OPUS_RATE, true);          // معدل الإدخال الأصلي (للمعلومات فقط)
        hv.setInt16(16, 0, true);                   // output gain
        head[18] = 0;                               // mapping family 0

        // OpusTags
        const vendor = textBytes('Eto.Edu');
        const tags = new Uint8Array(8 + 4 + vendor.length + 4);
        const tv = new DataView(tags.buffer);
        tags.set(textBytes('OpusTags'), 0);
        tv.setUint32(8, vendor.length, true);
        tags.set(vendor, 12);
        tv.setUint32(12 + vendor.length, 0, true);  // مفيش تعليقات

        const pages = [
            makePage(serial, 0, 0x02, 0, [head]),
            makePage(serial, 1, 0, 0, [tags])
        ];

        let seq = 2;
        let cur = [];
        let curSegs = 0;
        let curEndIdx = -1;      // رقم آخر باكت في الصفحة الحالية
        let lastGranule = 0;

        const flush = (isLast) => {
            if (!cur.length) return;
            let granule = OPUS_PRESKIP + (curEndIdx + 1) * OPUS_FRAME;
            if (isLast) granule = Math.min(granule, OPUS_PRESKIP + totalFrames);
            granule = Math.max(granule, lastGranule);
            pages.push(makePage(serial, seq++, isLast ? 0x04 : 0, granule, cur));
            lastGranule = granule;
            cur = [];
            curSegs = 0;
        };

        for (let i = 0; i < packets.length; i++) {
            const p = packets[i];
            const segs = Math.floor(p.length / 255) + 1;
            if (cur.length && (curSegs + segs > 255 || cur.length >= PACKETS_PER_PAGE)) flush(false);
            cur.push(p);
            curSegs += segs;
            curEndIdx = i;
        }
        flush(true);

        return new Blob(pages, { type: 'audio/ogg' });
    }

    /* ---------- التحويل ---------- */
    async function startConversion() {
        if (state.busy) return;
        if (!state.file) {
            toast('اختار ملف الـMP3 الأول', 'error');
            setStatus('اختار ملف الـMP3 الأول', true);
            return;
        }
        if (state.file.size > MAX_FILE_BYTES) {
            toast('الملف كبير أوي على المتصفح', 'error');
            setStatus('الملف أكبر من 1 جيجا، المتصفح مش هيقدر يفك تشفيره. جرّب ملف أصغر.', true);
            return;
        }

        state.cancelled = false;
        setBusy(true);
        show('m2o-result', false);
        show('m2o-progress-wrap', true);
        setProgress(0);

        let ctx = null;
        try {
            const mono = val('m2o-channels', 'stereo') === 'mono';
            const kbps = Math.max(32, Math.min(256, parseInt(val('m2o-bitrate', '128'), 10) || 128));

            setStatus('بنتأكد إن المتصفح بيدعم الترميز...');
            if (!(await opusSupported(mono ? 1 : 2))) throw new Error(NOENC);
            if (state.cancelled) throw new Error(CANCEL);

            setStatus('بنقرأ الملف...');
            const arr = await state.file.arrayBuffer();
            if (state.cancelled) throw new Error(CANCEL);
            setProgress(8);

            ctx = makeContext();
            setStatus('بنفك تشفير الصوت... (ممكن ياخد شوية مع الملفات الطويلة)');
            let audio;
            try {
                audio = await ctx.decodeAudioData(arr);
            } catch (e) {
                throw new Error(DECODE);
            }
            if (state.cancelled) throw new Error(CANCEL);
            if (!audio || !audio.length) throw new Error(DECODE);
            setProgress(30);

            const outCh = mono ? 1 : Math.min(2, audio.numberOfChannels);
            if (audio.sampleRate !== OPUS_RATE || audio.numberOfChannels !== outCh) {
                setStatus('بنظبط معدل العينات والقنوات...');
                audio = await remix(audio, OPUS_RATE, outCh);
                if (state.cancelled) throw new Error(CANCEL);
            }
            setProgress(40);

            setStatus('بنحوّل لـOGG...');
            const packets = await encodeOpus(audio, kbps, (p) => setProgress(40 + p * 55));
            if (!packets) throw new Error(CANCEL);

            setProgress(96);
            const blob = buildOgg(packets, outCh, audio.length);

            const player = $('m2o-preview');
            if (player) player.pause();
            if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
            state.outputUrl = URL.createObjectURL(blob);
            const name = safeName(state.file.name) + '.ogg';

            if (player) player.src = state.outputUrl;
            const link = $('m2o-download');
            if (link) {
                link.href = state.outputUrl;
                link.setAttribute('download', name);
            }
            const info = $('m2o-result-info');
            if (info) {
                info.textContent = name + ' · ' + fmtDur(audio.duration) + ' · ' + kbps + ' kbps · ' + fmtSize(blob.size);
            }
            show('m2o-result', true);

            setProgress(100);
            setStatus('تم التحويل بنجاح');
            toast('تم تحويل الملف إلى OGG');
        } catch (err) {
            const msg = err && err.message;
            if (msg === CANCEL) {
                setStatus('تم إلغاء التحويل');
                setProgress(0);
            } else if (msg === NOENC) {
                setStatus('المتصفح ده مش بيدعم ترميز OGG. استخدم Chrome أو Edge أو Firefox حديث.', true);
                toast('المتصفح مش بيدعم الترميز', 'error');
            } else if (msg === DECODE) {
                setStatus('المتصفح مقدرش يقرأ الملف ده. اتأكد إنه ملف MP3 سليم.', true);
                toast('تعذر قراءة ملف الصوت', 'error');
            } else if (err && err.name === 'RangeError') {
                setStatus('الملف كبير على ذاكرة المتصفح. جرّب ملف أصغر.', true);
                toast('الذاكرة مش كفاية للملف ده', 'error');
            } else {
                console.error('[MP3 → OGG]', err);
                setStatus('حصل خطأ أثناء التحويل، جرّب تاني أو استخدم Chrome', true);
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
        const okType = /^audio\//.test(file.type) || /\.(mp3|mpga|wav|m4a|aac|ogg|oga|opus|flac|weba)$/i.test(file.name);
        if (!okType) {
            toast('اختار ملف صوت (MP3 مثلًا)', 'error');
            return;
        }

        state.file = file;
        const nameEl = $('m2o-file-name');
        if (nameEl) nameEl.textContent = file.name + ' · ' + fmtSize(file.size);
        show('m2o-result', false);
        show('m2o-progress-wrap', false);
        setStatus('جاهز للتحويل');
        setProgress(0);

        const a = $('m2o-source');
        if (a) {
            a.pause();
            if (state.srcUrl) URL.revokeObjectURL(state.srcUrl);
            state.srcUrl = URL.createObjectURL(file);
            a.src = state.srcUrl;
            show('m2o-source-wrap', true);
        }
    }

    function init() {
        if (!$('m2o-start')) return;

        const input = $('m2o-file');
        if (input) {
            input.addEventListener('change', () => {
                onFileChosen(input.files && input.files[0]);
                input.value = '';
            });
        }

        $('m2o-start').addEventListener('click', startConversion);

        const cancel = $('m2o-cancel');
        if (cancel) {
            cancel.addEventListener('click', () => {
                if (!state.busy) return;
                state.cancelled = true;
                setStatus('بنلغي التحويل...');
            });
        }

        const drop = $('m2o-drop');
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

        // تنبيه بدري لو المتصفح مش بيدعم الترميز
        opusSupported(2).then((ok) => {
            if (!ok) setStatus('المتصفح ده مش بيدعم ترميز OGG، استخدم Chrome أو Edge أو Firefox حديث', true);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
