/* ===== قارئ الصور والنصوص (TTS) ===== */
        let readerLang = 'ar';
        let readerGender = 'male';
        let readerVoicesCache = [];
        let readerUtterance = null;
        let readerManualVoiceURI = '';
        let readerWatchdog = null;

        function setReaderStatus(state) {
            const dot = document.getElementById('reader-status-dot');
            const text = document.getElementById('reader-status-text');
            if (!dot || !text) return;
            dot.classList.remove('bg-gray-300', 'bg-green-500', 'bg-amber-500', 'animate-pulse');
            if (state === 'playing') { dot.classList.add('bg-green-500', 'animate-pulse'); text.textContent = 'بيقرأ دلوقتي...'; }
            else if (state === 'paused') { dot.classList.add('bg-amber-500'); text.textContent = 'متوقف مؤقتاً'; }
            else { dot.classList.add('bg-gray-300'); text.textContent = 'جاهز'; }
        }

        function loadReaderVoices() {
            readerVoicesCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
            renderReaderVoiceSelect();
            const playBtn = document.getElementById('reader-play-btn');
            if (playBtn) playBtn.disabled = false;
        }
        function renderReaderVoiceSelect() {
            const sel = document.getElementById('reader-voice-select');
            if (!sel) return;
            const prevValue = sel.value;
            sel.innerHTML = '<option value="">تلقائي (حسب الاختيار فوق)</option>';
            const arVoices = readerVoicesCache.filter(v => v.lang && v.lang.toLowerCase().startsWith('ar'));
            const otherVoices = readerVoicesCache.filter(v => !v.lang || !v.lang.toLowerCase().startsWith('ar'));
            const addGroup = (label, voices) => {
                if (!voices.length) return;
                const group = document.createElement('optgroup');
                group.label = label;
                voices.forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v.voiceURI;
                    const isEgypt = /eg/i.test(v.lang || '') || /egypt|مصر/i.test(v.name || '');
                    opt.textContent = v.name + ' (' + v.lang + ')' + (isEgypt ? ' 🇪🇬' : '');
                    group.appendChild(opt);
                });
                sel.appendChild(group);
            };
            addGroup('عربي', arVoices);
            addGroup('لغات تانية', otherVoices);
            if (prevValue && readerVoicesCache.some(v => v.voiceURI === prevValue)) sel.value = prevValue;
        }
        if (window.speechSynthesis) {
            loadReaderVoices();
            window.speechSynthesis.onvoiceschanged = loadReaderVoices;
            setTimeout(() => { const b = document.getElementById('reader-play-btn'); if (b) b.disabled = false; }, 3000);
        } else {
            document.addEventListener('DOMContentLoaded', () => { const b = document.getElementById('reader-play-btn'); if (b) b.disabled = false; });
        }
        (function wireReaderVoiceSelect(){
            const sel = document.getElementById('reader-voice-select');
            if (sel) sel.addEventListener('change', () => { readerManualVoiceURI = sel.value; });
        })();

        function selectReaderVoice(lang, gender, btn) {
            readerLang = lang;
            readerGender = gender;
            document.querySelectorAll('.reader-voice-btn').forEach(b => {
                b.classList.remove('bg-pink-600', 'text-white', 'border-pink-600');
                b.classList.add('border-pink-200');
                b.removeAttribute('data-selected');
            });
            if (btn) {
                btn.classList.add('bg-pink-600', 'text-white', 'border-pink-600');
                btn.classList.remove('border-pink-200');
                btn.setAttribute('data-selected', 'true');
            }
        }

        function pickReaderVoice(lang, gender) {
            if (!readerVoicesCache.length) loadReaderVoices();
            const langVoices = readerVoicesCache.filter(v => v.lang && v.lang.toLowerCase().startsWith(lang));
            if (!langVoices.length) return null;

            const maleHints = ['male', 'man', 'majed', 'tarik', 'hamed', 'david', 'mark', 'daniel', 'fred', 'alex', 'george', 'yousef'];
            const femaleHints = ['female', 'woman', 'hoda', 'laila', 'zeina', 'salma', 'zira', 'susan', 'samantha', 'victoria', 'amira', 'fatima'];
            const hints = gender === 'male' ? maleHints : femaleHints;
            const otherHints = gender === 'male' ? femaleHints : maleHints;

            let match = langVoices.find(v => hints.some(h => v.name.toLowerCase().includes(h)));
            if (match) return match;

            const neutralVoices = langVoices.filter(v => !otherHints.some(h => v.name.toLowerCase().includes(h)));
            const pool = neutralVoices.length ? neutralVoices : langVoices;

            if (pool.length > 1) {
                return gender === 'male' ? pool[0] : pool[pool.length - 1];
            }
            return pool[0];
        }

        document.getElementById('reader-pdf-file').onchange = async (e) => {
            if (!e.target.files.length) return;
            const file = e.target.files[0];
            showLoad('استخراج النص...');
            try {
                let fullText = "";
                if (file.type === 'application/pdf') {
                    const PDFJS = await window.ETO_LOADERS.loadPDFJS();
                    const pdf = await PDFJS.getDocument(new Uint8Array(await file.arrayBuffer())).promise;
                    for (let i = 1; i <= pdf.numPages; i++) {
                        await updateProgress(Math.round((i / pdf.numPages) * 100), `صفحة ${i}`);
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(it => it.str).join(' ').trim();
                        if (pageText) fullText += pageText + "\n\n";
                    }
                    if (!fullText.trim()) {
                        showLoad('الملف صورة، جاري القراءة بالـ OCR...');
                        const TesseractLib = await window.ETO_LOADERS.loadTesseract();
                        const worker = await TesseractLib.createWorker();
                        await worker.loadLanguage('ara+eng');
                        await worker.initialize('ara+eng');
                        for (let i = 1; i <= pdf.numPages; i++) {
                            await updateProgress(Math.round((i / pdf.numPages) * 100), `OCR صفحة ${i}`);
                            const p = await pdf.getPage(i); const vp = p.getViewport({ scale: 4.0 });
                            const c = document.createElement('canvas'), ctx = c.getContext('2d'); c.width = vp.width; c.height = vp.height;
                            await p.render({ canvasContext: ctx, viewport: vp }).promise;
                            const { data: { text } } = await worker.recognize(c);
                            if (text.trim() !== "") fullText += text + "\n\n";
                        }
                        await worker.terminate();
                    }
                } else if (file.type.startsWith('image/')) {
                    const TesseractLib = await window.ETO_LOADERS.loadTesseract();
                    const worker = await TesseractLib.createWorker();
                    await worker.loadLanguage('ara+eng');
                    await worker.initialize('ara+eng');
                    await updateProgress(50, 'تحليل الصورة...');
                    const imageUrl = URL.createObjectURL(file);
                    try {
                        const { data: { text } } = await worker.recognize(imageUrl);
                        fullText = text;
                    } finally {
                        URL.revokeObjectURL(imageUrl);
                    }
                    await worker.terminate();
                }
                document.getElementById('reader-text-area').value = fullText.trim();
                showToast('اكتملت القراءة');
            } catch (err) {
                console.error(err);
                showToast('خطأ في استخراج النص', 'error');
            }
            hideLoad();
        };

        function startReaderWatchdog() {
            stopReaderWatchdog();
            readerWatchdog = setInterval(() => {
                if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                    window.speechSynthesis.pause();
                    window.speechSynthesis.resume();
                }
            }, 12000);
        }
        function stopReaderWatchdog() {
            if (readerWatchdog) { clearInterval(readerWatchdog); readerWatchdog = null; }
        }

        function speakReaderText(text, isRetry) {
            const utter = new SpeechSynthesisUtterance(text);
            let voice = null;
            if (readerManualVoiceURI) voice = readerVoicesCache.find(v => v.voiceURI === readerManualVoiceURI) || null;
            if (!voice) voice = pickReaderVoice(readerLang, readerGender);
            utter.lang = voice ? voice.lang : (readerLang === 'ar' ? 'ar-SA' : 'en-US');
            if (voice) utter.voice = voice;

            const basePitch = parseFloat(document.getElementById('reader-pitch').value) || 1;
            const genderPitchAdjust = (!readerManualVoiceURI && (!voice || !(voice.name || '').toLowerCase().match(/male|female|man|woman/)))
                ? (readerGender === 'male' ? -0.15 : 0.15) : 0;
            utter.pitch = Math.min(2, Math.max(0, basePitch + genderPitchAdjust));
            utter.rate = parseFloat(document.getElementById('reader-rate').value) || 1;

            utter.onerror = (ev) => {
                console.error('speechSynthesis error:', ev.error);
                stopReaderWatchdog();
                if (ev.error === 'interrupted' || ev.error === 'canceled') { setReaderStatus('ready'); return; }
                if (!isRetry) { speakReaderText(text, true); return; }
                showToast('حصلت مشكلة في تشغيل الصوت، جرب تاني أو غيّر الصوت من "اختيار الصوت بدقة"', 'error');
                setReaderStatus('ready');
            };
            utter.onstart = () => { setReaderStatus('playing'); startReaderWatchdog(); };
            utter.onend = () => { stopReaderWatchdog(); setReaderStatus('ready'); };
            readerUtterance = utter;
            window.speechSynthesis.speak(utter);
        }

        document.getElementById('reader-play-btn').onclick = () => {
            if (!window.speechSynthesis) { showToast('المتصفح ده مش بيدعم القراءة الصوتية', 'error'); return; }
            const text = document.getElementById('reader-text-area').value.trim();
            if (!text) { showToast('محتاج نص أو ملف الأول', 'error'); return; }

            if (window.speechSynthesis.paused && readerUtterance) {
                window.speechSynthesis.resume();
                setReaderStatus('playing');
                startReaderWatchdog();
                return;
            }
            window.speechSynthesis.cancel();
            stopReaderWatchdog();
            speakReaderText(text, false);
        };
        document.getElementById('reader-pause-btn').onclick = () => {
            if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                window.speechSynthesis.pause();
                stopReaderWatchdog();
                setReaderStatus('paused');
            }
        };
        document.getElementById('reader-stop-btn').onclick = () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            stopReaderWatchdog();
            setReaderStatus('ready');
        };
        (function wireReaderDropZone(){
            const dz = document.querySelector('#page-reader .drop-zone');
            const input = document.getElementById('reader-pdf-file');
            if (!dz || !input) return;
            dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
            dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
            dz.addEventListener('drop', e => {
                e.preventDefault(); dz.classList.remove('dragover');
                if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); }
            });
        })();
