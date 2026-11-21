/* ===== الشيتات (Teacher Sheets) + ستايل الأسئلة ===== */

        const STYLE_BG_PALETTE = ['#ffffff','#f8fafc','#f1f5f9','#fff1f2','#fef2f2','#fff7ed','#fffbeb','#fefce8','#f7fee7','#f0fdf4','#ecfdf5','#f0fdfa','#ecfeff','#eff6ff','#eef2ff','#f5f3ff','#faf5ff','#fdf4ff','#fdf2f8','#fff1f2','#f5f5f4','#fafafa','#f8f9fa','#f4f4f5','#f0f9ff','#e0f2fe','#fef9c3','#fce7f3','#e8f5e9','#f3e5f5'];
        const STYLE_ACCENT_PALETTE = ['#f43f5e','#e11d48','#ec4899','#d946ef','#a855f7','#8b5cf6','#6366f1','#3b82f6','#0ea5e9','#06b6d4','#14b8a6','#10b981','#22c55e','#84cc16','#eab308','#f59e0b','#f97316','#ef4444','#dc2626','#78716c','#64748b','#0f172a','#7c3aed','#be185d','#0891b2','#059669','#ca8a04','#c2410c','#9333ea','#4f46e5'];
        const STYLE_BORDERS = ['solid','dashed','dotted','double'];
        const STYLE_SHAPES = [{ radius: '4px' }, { radius: '10px' }, { radius: '18px' }, { radius: '9999px' }];
        const STYLE_SHADOWS = [{ css: 'none' }, { css: '0 2px 8px rgba(0,0,0,.08)' }, { css: '0 10px 25px -5px rgba(0,0,0,.15)' }];
        const STYLE_ACCENT_SIDES = ['right', 'left', 'top', 'all'];

        function getTotalStyleCount() {
            return STYLE_BG_PALETTE.length * STYLE_ACCENT_PALETTE.length * STYLE_BORDERS.length * STYLE_SHAPES.length * STYLE_SHADOWS.length * STYLE_ACCENT_SIDES.length;
        }
        function getStyleById(id) {
            let n = Math.abs(Math.floor(Number(id) || 0));
            const bg = STYLE_BG_PALETTE[n % STYLE_BG_PALETTE.length]; n = Math.floor(n / STYLE_BG_PALETTE.length);
            const accent = STYLE_ACCENT_PALETTE[n % STYLE_ACCENT_PALETTE.length]; n = Math.floor(n / STYLE_ACCENT_PALETTE.length);
            const border = STYLE_BORDERS[n % STYLE_BORDERS.length]; n = Math.floor(n / STYLE_BORDERS.length);
            const shape = STYLE_SHAPES[n % STYLE_SHAPES.length]; n = Math.floor(n / STYLE_SHAPES.length);
            const shadow = STYLE_SHADOWS[n % STYLE_SHADOWS.length]; n = Math.floor(n / STYLE_SHADOWS.length);
            const accentSide = STYLE_ACCENT_SIDES[n % STYLE_ACCENT_SIDES.length];
            return { bg, accent, border, shape, shadow, accentSide };
        }
        function styleToQuestionCss(style) {
            let css = `background-color:${style.bg}; border-radius:${style.shape.radius}; box-shadow:${style.shadow.css}; padding:20px; margin-top:20px;`;
            if (style.accentSide === 'all') css += `border:2px ${style.border} ${style.accent};`;
            else css += `border-${style.accentSide}:5px ${style.border === 'dotted' ? 'dotted' : 'solid'} ${style.accent};`;
            return css;
        }
        function styleToBadgeColors(style) { return { bg: style.accent + '22', border: style.accent, text: style.accent }; }
        function smartSplitChoices(raw) {
            const flat = (raw || '').replace(/\r/g, '').replace(/\n+/g, ' ').trim();
            if (!flat) return [];
            const labelRe = /(?:^|\s)([a-hA-H]|[1-9]|[أ-ي])[\)\.]\s*/g;
            const matches = [...flat.matchAll(labelRe)];
            if (matches.length >= 2) {
                const parts = [];
                for (let i = 0; i < matches.length; i++) {
                    const start = matches[i].index + matches[i][0].length;
                    const end = i + 1 < matches.length ? matches[i + 1].index : flat.length;
                    const chunk = flat.slice(start, end).trim();
                    if (chunk) parts.push(chunk);
                }
                if (parts.length >= 2) return parts;
            }
            return (raw || '').split('\n').map(c => c.trim()).filter(c => c !== '');
        }

        function getCurrentTeacherStyleSettings() {
            return {
                qStyle: document.getElementById('teacher-q-style') ? document.getElementById('teacher-q-style').value : 'style-default',
                qSize: document.getElementById('teacher-q-size') ? document.getElementById('teacher-q-size').value : 'text-lg',
                qColor: document.getElementById('teacher-q-color') ? document.getElementById('teacher-q-color').value : '#000000',
                aColor: document.getElementById('teacher-a-color') ? document.getElementById('teacher-a-color').value : '#000000',
                qNumShape: document.getElementById('teacher-num-shape') ? document.getElementById('teacher-num-shape').value : 'circle',
                qNumSide: document.getElementById('teacher-num-side') ? document.getElementById('teacher-num-side').value : 'auto',
                numColor: document.getElementById('teacher-num-color') ? document.getElementById('teacher-num-color').value : '#e11d48',
                customStyleId: (document.getElementById('teacher-style-id') && document.getElementById('teacher-style-id').value.trim() !== '') ? document.getElementById('teacher-style-id').value : null
            };
        }
        function applyStyleToQuestionDiv(qDiv, settings) {
            if (!qDiv) return;
            const qLang = qDiv.getAttribute('dir') || 'rtl';
            const naturalSide = qLang === 'rtl' ? 'right' : 'left';
            const forcedReverse = settings.qNumSide !== 'auto' && settings.qNumSide !== naturalSide;

            let customStyle = null; const numColor = settings.numColor || '#e11d48'; let badgeBg = numColor + '22', badgeBorder = numColor, badgeText = numColor;
            if (settings.customStyleId !== null) {
                customStyle = getStyleById(settings.customStyleId);
                const bc = styleToBadgeColors(customStyle);
                badgeBg = bc.bg; badgeBorder = bc.border; badgeText = bc.text;
            }
            const badgeRadius = settings.qNumShape === 'circle' ? '9999px' : (settings.qNumShape === 'square' ? '10px' : '6px 6px 6px 0');

            qDiv.className = customStyle ? 'flex gap-6 items-start relative group q-block w-full q-style-custom' : `flex gap-6 items-start relative group q-block w-full ${settings.qStyle.replace('style-', 'q-style-')}`;
            let wrapperCss = customStyle ? styleToQuestionCss(customStyle) : '';
            if (qDiv.dataset.pagebreak === '1') wrapperCss += 'page-break-after: always; break-after: page;';
            qDiv.style.cssText = wrapperCss;

            const numRow = qDiv.querySelector('.q-num-row');
            if (numRow) numRow.className = 'flex gap-2 items-start q-num-row' + (forcedReverse ? ' flex-row-reverse' : '');

            const badge = qDiv.querySelector('.q-num-badge');
            if (badge) {
                badge.style.borderRadius = badgeRadius;
                badge.style.backgroundColor = badgeBg;
                badge.style.borderColor = badgeBorder;
                badge.style.color = badgeText;
                badge.className = `q-num-badge font-black ${settings.qSize}`;
                badge.style.display = 'inline-flex';
                badge.style.alignItems = 'center';
                badge.style.justifyContent = 'center';
                badge.style.boxSizing = 'border-box';
                badge.style.lineHeight = '1';
                badge.style.flexShrink = '0';
            }

            const qTextEl = qDiv.querySelector('.q-text-el');
            if (qTextEl) {
                qTextEl.style.color = settings.qColor;
                qTextEl.classList.remove('text-base', 'text-lg', 'text-xl', 'text-2xl');
                qTextEl.classList.add(settings.qSize);
            }

            qDiv.querySelectorAll('.q-answer-el').forEach(el => { el.style.color = settings.aColor; });
            qDiv.querySelectorAll('.q-choice-letter').forEach(el => { el.style.backgroundColor = badgeText + '22'; el.style.color = badgeText; });
        }

        function liveApplyToAllQuestions() {
            const preview = document.getElementById('teacher-sheet-preview');
            if (!preview) return;
            const groups = preview.querySelectorAll('.q-block');
            if (!groups.length) return;
            const settings = getCurrentTeacherStyleSettings();
            groups.forEach(qDiv => applyStyleToQuestionDiv(qDiv, settings));
        }

        let currentTitleEl = null;
        function liveUpdateTitle() {
            if (!currentTitleEl || !document.body.contains(currentTitleEl)) { currentTitleEl = null; return; }
            const titleColor = document.getElementById('teacher-title-color') ? document.getElementById('teacher-title-color').value : '#1e293b';
            const titleAccent = document.getElementById('teacher-title-accent') ? document.getElementById('teacher-title-accent').value : '#f43f5e';
            const titleStyle = document.getElementById('teacher-title-style') ? document.getElementById('teacher-title-style').value : 'underline';
            const repeatOnEveryPage = document.getElementById('teacher-title-repeat') ? document.getElementById('teacher-title-repeat').checked : false;

            let titleCss = `color:${titleColor};`;
            if (titleStyle === 'underline') titleCss += `padding-bottom:16px; border-bottom:4px solid ${titleAccent};`;
            else if (titleStyle === 'boxed') titleCss += `background-color:${titleAccent}22; border:2px solid ${titleAccent}; border-radius:12px; padding:14px;`;
            else if (titleStyle === 'pill') titleCss += `background-color:${titleAccent}; color:#fff; border-radius:9999px; padding:12px 20px;`;
            else if (titleStyle === 'ribbon') titleCss += `border-right:6px solid ${titleAccent}; border-left:6px solid ${titleAccent}; padding:12px;`;

            currentTitleEl.style.cssText = titleCss;
            currentTitleEl.classList.toggle('teacher-title-repeat-print', repeatOnEveryPage);
            const sheetPreview = document.getElementById('teacher-sheet-preview');
            if (sheetPreview) sheetPreview.classList.toggle('has-repeating-title', repeatOnEveryPage);
        }
        function onTitleRemoved() {
            currentTitleEl = null;
            const sheetPreview = document.getElementById('teacher-sheet-preview');
            if (sheetPreview) sheetPreview.classList.remove('has-repeating-title');
        }
        function getFullSheetSnapshotJSON() {
            const preview = document.getElementById('teacher-sheet-preview');
            if (!preview) return null;
            const hasContent = preview.querySelector('.q-block') || preview.querySelector('.free-text-block') || preview.querySelector('.sheet-title-el');
            if (!hasContent) return null;
            return {
                v: 1,
                html: preview.innerHTML,
                bg: preview.style.backgroundColor || '',
                hasRepeatingTitle: preview.classList.contains('has-repeating-title')
            };
        }

        async function exportTeacherSheetAsPDF() {
            const preview = document.getElementById('teacher-sheet-preview');
            if (!preview || !preview.querySelector('.q-block')) return showToast('لا يوجد أسئلة لتحميلها!', 'error');
            if (!window.html2canvas || !window.jspdf) return showToast('تعذر تحميل مكتبات التصدير، تأكد من الاتصال بالإنترنت', 'error');

            showLoad('جاري تجهيز الملف وتحميله...');
            setTimeout(async () => {
                try {
                    const bgColor = getComputedStyle(preview).backgroundColor || '#ffffff';
                    const repeatTitle = document.getElementById('teacher-title-repeat') ? document.getElementById('teacher-title-repeat').checked : false;

                    let titleCanvas = null;
                    if (currentTitleEl && document.body.contains(currentTitleEl)) {
                        titleCanvas = await html2canvas(currentTitleEl, {
                            scale: 2,
                            useCORS: true,
                            backgroundColor: bgColor
                        });
                    }

                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');

                    const pageWidthMM = pdf.internal.pageSize.getWidth();
                    const pageHeightMM = pdf.internal.pageSize.getHeight();

                    const marginMM = 10;
                    const contentWidthMM = pageWidthMM - (marginMM * 2);
                    const bottomMarginMM = 10;

                    const questionBlocks = Array.from(preview.querySelectorAll('.q-block'));

                    for (let i = 0; i < questionBlocks.length; i++) {
                        const qBlock = questionBlocks[i];

                        if (i > 0) {
                            pdf.addPage();
                        }

                        let topMM = marginMM;

                        if (titleCanvas && (i === 0 || repeatTitle)) {
                            const titleRatio = titleCanvas.height / titleCanvas.width;
                            let titleWidthMM = contentWidthMM;
                            let titleHeightMM = titleWidthMM * titleRatio;

                            if (titleHeightMM > 30) {
                                titleHeightMM = 30;
                                titleWidthMM = titleHeightMM / titleRatio;
                            }

                            pdf.addImage(
                                titleCanvas.toDataURL('image/png'),
                                'PNG',
                                marginMM + ((contentWidthMM - titleWidthMM) / 2),
                                topMM,
                                titleWidthMM,
                                titleHeightMM
                            );

                            topMM += titleHeightMM + 6;
                        }

                        const questionCanvas = await html2canvas(qBlock, {
                            scale: 2,
                            useCORS: true,
                            backgroundColor: bgColor,
                            width: qBlock.scrollWidth,
                            height: qBlock.scrollHeight,
                            windowWidth: Math.max(qBlock.scrollWidth, 1200),
                            windowHeight: Math.max(qBlock.scrollHeight, 1200)
                        });

                        const availableQuestionHeightMM = pageHeightMM - topMM - bottomMarginMM;

                        const questionRatio = questionCanvas.height / questionCanvas.width;

                        let questionWidthMM = contentWidthMM;
                        let questionHeightMM = questionWidthMM * questionRatio;

                        const minimumAnswerLinesHeightMM = 35;
                        const maxQuestionHeightMM = Math.max(
                            20,
                            availableQuestionHeightMM - minimumAnswerLinesHeightMM
                        );

                        if (questionHeightMM > maxQuestionHeightMM) {
                            questionHeightMM = maxQuestionHeightMM;
                            questionWidthMM = questionHeightMM / questionRatio;
                        }

                        const questionX = marginMM + ((contentWidthMM - questionWidthMM) / 2);

                        pdf.addImage(
                            questionCanvas.toDataURL('image/jpeg', 0.95),
                            'JPEG',
                            questionX,
                            topMM,
                            questionWidthMM,
                            questionHeightMM
                        );

                        const answerStartMM = topMM + questionHeightMM + 10;
                        const answerEndMM = pageHeightMM - bottomMarginMM;

                        pdf.setDrawColor(148, 163, 184);
                        pdf.setLineWidth(0.35);

                        let lineY = answerStartMM;

                        while (lineY <= answerEndMM) {
                            pdf.line(
                                marginMM,
                                lineY,
                                pageWidthMM - marginMM,
                                lineY
                            );

                            lineY += 9;
                        }
                    }

                    const fileTitle = (currentTitleEl && currentTitleEl.innerText ? currentTitleEl.innerText.trim() : '') || 'Sheet';
                    const safeName = fileTitle.replace(/[\\/:*?"<>|]/g, '_').slice(0, 60);

                    let embedded = false;

                    try {
                        const snapshot = getFullSheetSnapshotJSON();

                        if (snapshot) {
                            const pdfBytes = new Uint8Array(pdf.output('arraybuffer'));
                            const jsonStr = JSON.stringify(snapshot);
                            const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
                            const marker = `\n%ETO-SHEET-DATA-START%\n${b64}\n%ETO-SHEET-DATA-END%\n`;
                            const markerBytes = new TextEncoder().encode(marker);

                            const combined = new Uint8Array(pdfBytes.length + markerBytes.length);
                            combined.set(pdfBytes, 0);
                            combined.set(markerBytes, pdfBytes.length);

                            const blob = new Blob([combined], { type: 'application/pdf' });
                            const link = document.createElement('a');

                            link.href = URL.createObjectURL(blob);
                            link.download = `${safeName}.pdf`;

                            document.body.appendChild(link);
                            link.click();
                            link.remove();

                            setTimeout(() => URL.revokeObjectURL(link.href), 5000);

                            embedded = true;
                        }
                    } catch (embedErr) {
                        console.error('embed sheet data failed', embedErr);
                    }

                    if (!embedded) {
                        pdf.save(`${safeName}.pdf`);
                    }

                    showToast('تم تحميل الملف بنجاح');
                } catch (err) {
                    console.error(err);
                    showToast('حدث خطأ أثناء تجهيز الملف', 'error');
                }

                hideLoad();
            }, 50);
        }
        let teacherImgData = null;
        let teacherAnswerMode = 'text';
        let teacherChoiceImages = [];
        function setTeacherAnswerMode(mode) {
            teacherAnswerMode = mode;
            const textBtn = document.getElementById('teacher-ans-mode-text');
            const imgBtn = document.getElementById('teacher-ans-mode-image');
            const textBox = document.getElementById('teacher-q-answers');
            const imgBox = document.getElementById('teacher-q-answer-images-wrap');
            if (mode === 'image') {
                textBox.classList.add('hidden'); imgBox.classList.remove('hidden');
                imgBtn.classList.add('bg-white', 'shadow', 'text-rose-600'); imgBtn.classList.remove('text-gray-500');
                textBtn.classList.remove('bg-white', 'shadow', 'text-rose-600'); textBtn.classList.add('text-gray-500');
            } else {
                imgBox.classList.add('hidden'); textBox.classList.remove('hidden');
                textBtn.classList.add('bg-white', 'shadow', 'text-rose-600'); textBtn.classList.remove('text-gray-500');
                imgBtn.classList.remove('bg-white', 'shadow', 'text-rose-600'); imgBtn.classList.add('text-gray-500');
            }
        }
        function renderTeacherChoiceImgList() {
            const wrap = document.getElementById('teacher-ans-img-list');
            if (!wrap) return;
            wrap.innerHTML = teacherChoiceImages.map((src, i) => `
                <div class="relative">
                    <img src="${src}" class="w-16 h-16 object-cover rounded-lg border shadow-sm">
                    <span class="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl">${i + 1}</span>
                    <button type="button" onclick="teacherChoiceImages.splice(${i},1); renderTeacherChoiceImgList();" class="absolute -top-1.5 -left-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow"><i class="fa-solid fa-xmark"></i></button>
                </div>`).join('');
        }
        setTimeout(() => {
            const tDropZone = document.getElementById('teacher-img-drop');
            const tImgInput = document.getElementById('teacher-q-img');
            const tImgPreview = document.getElementById('teacher-img-preview');
            const tImgContainer = document.getElementById('teacher-img-preview-container');
            if(tDropZone) {
                tDropZone.onclick = () => tImgInput.click();
                
                tDropZone.ondragover = (e) => { e.preventDefault(); tDropZone.classList.add('bg-rose-100'); };
                tDropZone.ondragleave = () => tDropZone.classList.remove('bg-rose-100');
                tDropZone.ondrop = (e) => {
                    e.preventDefault(); tDropZone.classList.remove('bg-rose-100');
                    if(e.dataTransfer.files.length) handleTeacherImg(e.dataTransfer.files[0]);
                };
                
                tImgInput.onchange = (e) => {
                    if(e.target.files.length) handleTeacherImg(e.target.files[0]);
                };
                
                document.getElementById('teacher-img-remove').onclick = (e) => {
                    e.stopPropagation();
                    teacherImgData = null;
                    tImgContainer.classList.add('hidden');
                    tImgPreview.src = '';
                    tImgInput.value = '';
                };
                const ansImgDrop = document.getElementById('teacher-ans-img-drop');
                const ansImgInput = document.getElementById('teacher-ans-img-input');
                if (ansImgDrop) {
                    ansImgDrop.onclick = () => ansImgInput.click();
                    ansImgDrop.ondragover = (e) => { e.preventDefault(); ansImgDrop.classList.add('bg-rose-100'); };
                    ansImgDrop.ondragleave = () => ansImgDrop.classList.remove('bg-rose-100');
                    const addChoiceImageFiles = (files) => {
                        Array.from(files).forEach(file => {
                            if (!file.type.startsWith('image/')) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => { teacherChoiceImages.push(ev.target.result); renderTeacherChoiceImgList(); };
                            reader.readAsDataURL(file);
                        });
                    };
                    ansImgDrop.ondrop = (e) => {
                        e.preventDefault(); ansImgDrop.classList.remove('bg-rose-100');
                        if (e.dataTransfer.files.length) addChoiceImageFiles(e.dataTransfer.files);
                    };
                    ansImgInput.onchange = (e) => {
                        if (e.target.files.length) addChoiceImageFiles(e.target.files);
                        ansImgInput.value = '';
                    };
                    const ansImgListEl = document.getElementById('teacher-ans-img-list');
                    if (ansImgListEl && window.Sortable) {
                        new Sortable(ansImgListEl, {
                            animation: 150,
                            onEnd: () => {
                                const imgs = Array.from(ansImgListEl.querySelectorAll('img'));
                                teacherChoiceImages = imgs.map(img => img.getAttribute('src'));
                                renderTeacherChoiceImgList();
                            }
                        });
                    }
                }
                const styleIdInput = document.getElementById('teacher-style-id');
                const styleTotalEl = document.getElementById('style-total-count');
                if (styleTotalEl) styleTotalEl.textContent = getTotalStyleCount().toLocaleString('en-US');

                function refreshStylePreview() {
                    const preview = document.getElementById('style-preview');
                    const qStyleSel = document.getElementById('teacher-q-style');
                    if (styleIdInput && styleIdInput.value.trim() !== '') {
                        const s = getStyleById(styleIdInput.value);
                        preview.className = 'mt-2 p-3 text-sm transition-all rounded-lg';
                        preview.style.cssText = styleToQuestionCss(s);
                    } else if (qStyleSel) {
                        preview.style.cssText = '';
                        preview.className = 'mt-2 p-3 text-sm transition-all ' + qStyleSel.value.replace('style-', 'q-style-') + ' rounded-lg';
                    }
                }
                if (styleIdInput) styleIdInput.oninput = () => { refreshStylePreview(); liveApplyToAllQuestions(); };
                const styleRandomBtn = document.getElementById('teacher-style-random');
                if (styleRandomBtn) styleRandomBtn.onclick = () => {
                    styleIdInput.value = Math.floor(Math.random() * getTotalStyleCount());
                    refreshStylePreview();
                    liveApplyToAllQuestions();
                };
                const styleClearBtn = document.getElementById('teacher-style-clear');
                if (styleClearBtn) styleClearBtn.onclick = () => { styleIdInput.value = ''; refreshStylePreview(); liveApplyToAllQuestions(); };
                document.querySelectorAll('#teacher-bg-presets button').forEach(btn => {
                    btn.onclick = () => {
                        const color = btn.getAttribute('data-color');
                        const bgInput = document.getElementById('teacher-bg-color');
                        if (bgInput) bgInput.value = color;
                        const sheetPreview = document.getElementById('teacher-sheet-preview');
                        if (sheetPreview) sheetPreview.style.backgroundColor = color;
                    };
                });

                document.getElementById('teacher-set-title-btn').onclick = () => {
                    const titleVal = document.getElementById('teacher-sheet-title').value;
                    if(!titleVal.trim()) return showToast('يرجى كتابة العنوان أولاً', 'error');
                    const emptyState = document.getElementById('teacher-empty-state');
                    if(emptyState) emptyState.remove();

                    if (currentTitleEl && document.body.contains(currentTitleEl)) currentTitleEl.remove();

                    const titleDiv = document.createElement('h1');
                    titleDiv.className = 'sheet-title-el text-3xl font-black text-center mb-8 break-inside-avoid w-full relative group';
                    titleDiv.innerHTML = `<span contenteditable="true" class="outline-none hover:bg-black/5 p-2 rounded cursor-text block w-full transition" title="اضغط لتعديل نص العنوان">${titleVal}</span> <button onclick="this.parentElement.remove(); onTitleRemoved();" class="absolute left-0 top-0 bg-red-100 text-red-600 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition shadow flex items-center justify-center hover:bg-red-200 z-10 print:hidden text-sm"><i class="fa-solid fa-trash"></i></button>`;
                    document.getElementById('teacher-sheet-preview').prepend(titleDiv);
                    currentTitleEl = titleDiv;
                    liveUpdateTitle();
                    document.getElementById('teacher-sheet-title').value = '';
                    showToast('تمت إضافة العنوان بنجاح');
                };

                function renumberTeacherQuestions() {
                    const preview = document.getElementById('teacher-sheet-preview');
                    if (!preview) return;

                    preview.querySelectorAll('.q-block').forEach((qDiv, index) => {
                        const badgeText = qDiv.querySelector('.q-num-badge-txt');
                        if (badgeText) badgeText.textContent = index + 1;
                    });
                }

                function appendQuestionBlock(qLang, qTextHtml, choices, answersAreImages, qPageBreak, imgData) {
                    const emptyState = document.getElementById('teacher-empty-state');
                    if(emptyState) emptyState.remove();

                    const currentQNum = document.getElementById('teacher-sheet-preview').querySelectorAll('.q-block').length + 1;

                    const qDiv = document.createElement('div');
                    qDiv.className = 'group q-block relative w-full';
                    qDiv.dir = qLang;
                    qDiv.dataset.pagebreak = qPageBreak ? '1' : '0';
                    qDiv.style.breakInside = 'avoid';
                    qDiv.style.pageBreakInside = 'avoid';
                    qDiv.style.webkitColumnBreakInside = 'avoid';

                    let innerHTML = `<div class="flex-grow flex flex-col min-w-0 ${qLang === 'rtl' ? 'pr-2' : 'pl-2'}">`;

                    if((qTextHtml || '').trim()) {
                        innerHTML += `
                        <div class="flex gap-2 items-start q-num-row">
                            <div class="q-num-badge font-black"><span class="q-num-badge-txt">${currentQNum}</span></div>
                            <div class="q-text-el font-bold leading-relaxed break-words text-justify outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded p-2 transition cursor-text w-full" style="font-family: inherit;" contenteditable="true" title="اضغط لتعديل السؤال">${qTextHtml}</div>
                        </div>`;
                    }

                    if(choices && choices.length > 0) {
                        innerHTML += `<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">`;

                        const arabicLetters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'];

                        choices.forEach((choice, index) => {
                            const choiceLabel = qLang === 'rtl' ? (arabicLetters[index] || (index+1)) : String.fromCharCode(97 + index);
                            const isImg = !!answersAreImages;
                            const answerHtml = isImg
                                ? `<img src="${choice}" class="q-answer-img max-h-28 w-full rounded object-contain" />`
                                : `<span class="q-answer-el text-base font-semibold outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded px-2 py-1 transition w-full cursor-text" contenteditable="true" title="اضغط للتعديل">${choice}</span>`;
                            innerHTML += `<div class="q-choice-slot group/choice relative flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <div class="q-choice-letter w-7 h-7 rounded-full text-sm font-bold shrink-0"><span class="q-choice-letter-txt">${choiceLabel}</span></div>
                                ${answerHtml}
                                <div class="q-choice-actions print:hidden absolute -top-2 -left-2 flex gap-1 opacity-0 group-hover/choice:opacity-100 transition z-10">
                                    <button type="button" class="choice-img-btn bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-indigo-200 text-[10px]" title="${isImg ? 'غيّر الصورة' : 'ضيف صورة بدل الكتابة في الاختيار ده'}"><i class="fa-solid fa-image"></i></button>
                                    <button type="button" class="choice-text-btn bg-slate-100 text-slate-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-slate-200 text-[10px] ${isImg ? '' : 'hidden'}" title="رجّع كتابة نص بدل الصورة"><i class="fa-solid fa-font"></i></button>
                                </div>
                            </div>`;
                        });
                        innerHTML += `</div>`;
                    }

                    if (!choices || choices.length === 0) {
                        innerHTML += `<div class="q-answer-lines"></div></div>`;
                    } else {
                        innerHTML += `</div>`;
                    }

                    if(imgData) {
                        innerHTML += `<div class="q-question-img-wrap w-1/3 flex-shrink-0 pt-2 relative group/qimg">
                            <img class="q-question-img max-w-full max-h-64 rounded-lg border border-gray-300 shadow-sm object-contain" src="${imgData}" />
                            <button type="button" class="question-img-remove-btn print:hidden absolute -top-2 -left-2 bg-red-100 text-red-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-red-200 text-[10px] opacity-0 group-hover/qimg:opacity-100 transition" title="احذف صورة السؤال"><i class="fa-solid fa-xmark"></i></button>
                        </div>`;
                    }

                    innerHTML += `<div class="q-question-actions print:hidden flex flex-col gap-1 absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition z-10">
                        <button type="button" class="drag-handle bg-slate-100 text-slate-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-slate-200 cursor-move" title="اسحب لنقل السؤال لأي مكان في الشيت"><i class="fa-solid fa-up-down-left-right"></i></button>
                        <button type="button" class="question-img-btn bg-teal-100 text-teal-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-teal-200" title="أضف / غيّر صورة السؤال"><i class="fa-solid fa-file-image"></i></button>
                        <button type="button" onclick="applyStyleToQuestionDiv(this.closest('.group'), getCurrentTeacherStyleSettings()); showToast('اتطبق الاستايل الحالي على السؤال ده');" class="bg-purple-100 text-purple-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-purple-200" title="طبّق الاستايل الحالي على السؤال ده"><i class="fa-solid fa-paintbrush"></i></button>
                        <button type="button" onclick="this.closest('.group').remove(); renumberTeacherQuestions(); if(document.getElementById('teacher-sheet-preview').children.length===0) document.getElementById('teacher-sheet-preview').innerHTML='<div id=\\'teacher-empty-state\\' class=\\'text-center text-gray-400 mt-20\\'><i class=\\'fa-solid fa-clipboard-list text-6xl mb-4 opacity-50\\'></i><p class=\\'font-bold text-lg\\'>لم تقم بإضافة أي أسئلة بعد</p></div>';" class="bg-red-100 text-red-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-red-200" title="حذف السؤال"><i class="fa-solid fa-trash"></i></button>
                    </div>`;

                    qDiv.innerHTML = innerHTML;
                    document.getElementById('teacher-sheet-preview').appendChild(qDiv);
                    applyStyleToQuestionDiv(qDiv, getCurrentTeacherStyleSettings());
                }

                document.getElementById('teacher-add-btn').onclick = () => {
                    const qLang = document.getElementById('teacher-q-lang').value;
                    const qTextHtml = document.getElementById('teacher-q-text').innerHTML;
                    const qTextPlain = document.getElementById('teacher-q-text').innerText || '';
                    const qAnswersRaw = document.getElementById('teacher-q-answers').innerText || '';
                    const qPageBreak = document.getElementById('teacher-q-pagebreak').checked;

                    if(!qTextPlain.trim() && !qTextHtml.includes('<img') && !teacherImgData) return showToast('يرجى إدخال سؤال أو صورة', 'error');

                    const answersAreImages = teacherAnswerMode === 'image';
                    const choices = answersAreImages ? teacherChoiceImages.slice() : smartSplitChoices(qAnswersRaw);

                    appendQuestionBlock(qLang, qTextHtml, choices, answersAreImages, qPageBreak, teacherImgData);

                    document.getElementById('teacher-q-text').innerHTML = '';
                    document.getElementById('teacher-q-answers').innerHTML = '';
                    document.getElementById('teacher-q-pagebreak').checked = false;
                    teacherImgData = null;
                    tImgContainer.classList.add('hidden');
                    tImgPreview.src = '';
                    tImgInput.value = '';
                    teacherChoiceImages = [];
                    renderTeacherChoiceImgList();
                    showToast('تمت إضافة السؤال للشيت بنجاح');
                };
                const teacherJsonInput = document.getElementById('teacher-json-file');
                document.getElementById('teacher-import-json-btn').onclick = () => teacherJsonInput.click();
                const teacherChatgptModal = document.getElementById('teacher-chatgpt-modal');
                const teacherChatgptPrompt = document.getElementById('teacher-chatgpt-prompt');

                document.getElementById('teacher-chatgpt-json-btn')?.addEventListener('click', () => {
                    if (!teacherChatgptModal) return;
                    teacherChatgptModal.classList.remove('hidden');
                    teacherChatgptModal.classList.add('flex');
                });

                document.getElementById('teacher-chatgpt-close')?.addEventListener('click', () => {
                    teacherChatgptModal.classList.add('hidden');
                    teacherChatgptModal.classList.remove('flex');
                });

                teacherChatgptModal?.addEventListener('click', (e) => {
                    if (e.target === teacherChatgptModal) {
                        teacherChatgptModal.classList.add('hidden');
                        teacherChatgptModal.classList.remove('flex');
                    }
                });

                document.getElementById('teacher-chatgpt-copy-btn')?.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(teacherChatgptPrompt.value);
                        showToast('تم نسخ برومبت ChatGPT');
                    } catch (err) {
                        teacherChatgptPrompt.select();
                        document.execCommand('copy');
                        showToast('تم نسخ البرومبت');
                    }
                });

                document.getElementById('teacher-chatgpt-open-btn')?.addEventListener('click', () => {
                    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
                    showToast('اتفتح ChatGPT، الصق البرومبت هناك');
                });
                teacherJsonInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                        let data;
                        try {
                            data = JSON.parse(ev.target.result);
                        } catch(err) {
                            showToast('ملف الـ JSON مش سليم، اتأكد من صيغته', 'error');
                            teacherJsonInput.value = '';
                            return;
                        }
                        const list = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
                        if(!list) {
                            showToast('صيغة الملف غير مدعومة، لازم يكون فيه مصفوفة أسئلة', 'error');
                            teacherJsonInput.value = '';
                            return;
                        }
                        let added = 0;
                        showLoad(`جاري إضافة ${list.length} سؤال...`);
                        await updateProgress(0, 'بدء استيراد الأسئلة');

                        for (let i = 0; i < list.length; i++) {
                            if (isOperationCancelled()) break;

                            const item = list[i];

                            if(item && (item.text || item.image)) {
                                const qLang = item.lang === 'ltr' ? 'ltr' : 'rtl';
                                const qTextHtml = item.text || '';
                                const choices = Array.isArray(item.answers)
                                    ? item.answers.map(a => (a === null || a === undefined) ? '' : String(a)).filter(a => a.trim() !== '')
                                    : [];
                                const qPageBreak = !!item.pagebreak;
                                const imgData = item.image || null;

                                appendQuestionBlock(qLang, qTextHtml, choices, false, qPageBreak, imgData);
                                added++;
                            }

                            if ((i + 1) % 5 === 0 || i === list.length - 1) {
                                await updateProgress(
                                    Math.round(((i + 1) / list.length) * 100),
                                    `إضافة السؤال ${i + 1} من ${list.length}`
                                );
                            }
                        }

                        if (isOperationCancelled()) {
                            teacherJsonInput.value = '';
                            hideLoad();
                            showToast(`تم إلغاء الاستيراد بعد إضافة ${added} سؤال`, 'error');
                            return;
                        }

                        teacherJsonInput.value = '';
                        hideLoad();

                        if(added > 0) showToast(`تمت إضافة ${added} سؤال من ملف الـ JSON بالترتيب بنجاح`);
                        else showToast('مفيش أسئلة اتضافت، تأكد من محتوى الملف', 'error');
                    };
                    reader.readAsText(file, 'UTF-8');
                };
                const teacherReopenPdfInput = document.getElementById('teacher-reopen-pdf-file');
                const teacherReopenPdfBtn = document.getElementById('teacher-reopen-pdf-btn');
                if (teacherReopenPdfBtn && teacherReopenPdfInput) {
                    teacherReopenPdfBtn.onclick = () => teacherReopenPdfInput.click();
                    teacherReopenPdfInput.onchange = async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                            showLoad('جاري قراءة الملف...');
                            const buf = await file.arrayBuffer();
                            const bytes = new Uint8Array(buf);
                            let raw = '';
                            const chunkSize = 0x8000;
                            for (let i = 0; i < bytes.length; i += chunkSize) {
                                raw += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
                            }
                            const startTag = '%ETO-SHEET-DATA-START%';
                            const endTag = '%ETO-SHEET-DATA-END%';
                            const startIdx = raw.lastIndexOf(startTag);
                            const endIdx = raw.lastIndexOf(endTag);
                            hideLoad();

                            if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
                                showToast('الملف ده متعملش من الأداة دي، أو اتصدّر قبل إضافة الخاصية دي، مينفعش نفتحه للتعديل', 'error');
                                teacherReopenPdfInput.value = '';
                                return;
                            }

                            const b64 = raw.slice(startIdx + startTag.length, endIdx).trim();
                            let snapshot;
                            try {
                                const jsonStr = decodeURIComponent(escape(atob(b64)));
                                snapshot = JSON.parse(jsonStr);
                            } catch (parseErr) {
                                showToast('تعذر قراءة بيانات الشيت من الملف', 'error');
                                teacherReopenPdfInput.value = '';
                                return;
                            }

                            const preview = document.getElementById('teacher-sheet-preview');
                            const hasExisting = preview && (preview.querySelector('.q-block') || preview.querySelector('.free-text-block') || preview.querySelector('.sheet-title-el'));
                            if (hasExisting && !confirm('هيتم استبدال محتوى الشيت الحالي بمحتوى الملف ده، متأكد؟')) {
                                teacherReopenPdfInput.value = '';
                                return;
                            }
                            preview.innerHTML = snapshot.html || '';
                            renumberTeacherQuestions();
                            if (snapshot.bg) preview.style.backgroundColor = snapshot.bg;
                            preview.classList.toggle('has-repeating-title', !!snapshot.hasRepeatingTitle);

                            const titleEl = preview.querySelector('.sheet-title-el');
                            currentTitleEl = titleEl || null;

                            if (!preview.querySelector('.q-block') && !preview.querySelector('.free-text-block') && !titleEl) {
                                preview.innerHTML = '<div id="teacher-empty-state" class="text-center text-gray-400 mt-20"><i class="fa-solid fa-clipboard-list text-6xl mb-4 opacity-50"></i><p class="font-bold text-lg">لم تقم بإضافة أي أسئلة بعد</p></div>';
                            }

                            showToast('تم استرجاع الشيت بنجاح، كمّل تعديلك عادي 👌');
                        } catch (err) {
                            console.error(err);
                            hideLoad();
                            showToast('حدث خطأ أثناء قراءة الملف', 'error');
                        } finally {
                            teacherReopenPdfInput.value = '';
                        }
                    };
                }

                document.getElementById('teacher-add-text-btn').onclick = () => {
                    const emptyState = document.getElementById('teacher-empty-state');
                    if (emptyState) emptyState.remove();

                    const textDiv = document.createElement('div');
                    textDiv.className = 'group free-text-block q-block relative w-full mb-6';
                    textDiv.innerHTML = `
                        <div contenteditable="true" class="free-text-el outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded p-2 transition cursor-text w-full leading-relaxed font-semibold" style="font-family: inherit;" title="اضغط لتعديل النص">اكتب هنا أي نص تريده...</div>
                        <div class="print:hidden flex flex-col gap-1 absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition z-10">
                            <button type="button" class="drag-handle bg-slate-100 text-slate-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-slate-200 cursor-move" title="اسحب لنقل النص لأي مكان في الشيت"><i class="fa-solid fa-up-down-left-right"></i></button>
                        <button type="button" onclick="this.closest('.group').remove(); renumberTeacherQuestions(); if(document.getElementById('teacher-sheet-preview').children.length===0) document.getElementById('teacher-sheet-preview').innerHTML='<div id=\\'teacher-empty-state\\' class=\\'text-center text-gray-400 mt-20\\'><i class=\\'fa-solid fa-clipboard-list text-6xl mb-4 opacity-50\\'></i><p class=\\'font-bold text-lg\\'>لم تقم بإضافة أي أسئلة بعد</p></div>';" class="bg-red-100 text-red-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-red-200" title="حذف السؤال"><i class="fa-solid fa-trash"></i></button>
                        </div>`;
                    document.getElementById('teacher-sheet-preview').appendChild(textDiv);
                    showToast('تمت إضافة النص، اضغط عليه للكتابة واسحبه لأي مكان تحبه');
                };

                const teacherPreviewEl = document.getElementById('teacher-sheet-preview');
                if (teacherPreviewEl && window.Sortable) {
                    new Sortable(teacherPreviewEl, {
                        animation: 150,
                        handle: '.drag-handle',
                        draggable: '.q-block',
                        ghostClass: 'opacity-40'
                    });
                }
                if (teacherPreviewEl) {
                    teacherPreviewEl.addEventListener('click', (e) => {
                        const imgBtn = e.target.closest('.choice-img-btn');
                        const textBtn = e.target.closest('.choice-text-btn');
                        const qImgBtn = e.target.closest('.question-img-btn');
                        const qImgRemoveBtn = e.target.closest('.question-img-remove-btn');
                        if (!imgBtn && !textBtn && !qImgBtn && !qImgRemoveBtn) return;
                        e.preventDefault();

                        if (qImgBtn) {
                            const qDiv = qImgBtn.closest('.q-block');
                            if (!qDiv) return;
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = () => {
                                const file = input.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    let wrap = qDiv.querySelector('.q-question-img-wrap');
                                    if (!wrap) {
                                        wrap = document.createElement('div');
                                        wrap.className = 'q-question-img-wrap w-1/3 flex-shrink-0 pt-2 relative group/qimg';
                                        wrap.innerHTML = `<img class="q-question-img max-w-full max-h-64 rounded-lg border border-gray-300 shadow-sm object-contain" />
                                            <button type="button" class="question-img-remove-btn print:hidden absolute -top-2 -left-2 bg-red-100 text-red-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-red-200 text-[10px] opacity-0 group-hover/qimg:opacity-100 transition" title="احذف صورة السؤال"><i class="fa-solid fa-xmark"></i></button>`;
                                        const actionsBar = qDiv.querySelector('.q-question-actions');
                                        if (actionsBar) qDiv.insertBefore(wrap, actionsBar); else qDiv.appendChild(wrap);
                                    }
                                    wrap.querySelector('.q-question-img').src = ev.target.result;
                                    showToast('اتضافت صورة السؤال بنجاح');
                                };
                                reader.readAsDataURL(file);
                            };
                            input.click();
                            return;
                        }

                        if (qImgRemoveBtn) {
                            const wrap = qImgRemoveBtn.closest('.q-question-img-wrap');
                            if (wrap) wrap.remove();
                            showToast('اتشالت صورة السؤال');
                            return;
                        }

                        const slot = (imgBtn || textBtn).closest('.q-choice-slot');
                        if (!slot) return;

                        if (imgBtn) {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = () => {
                                const file = input.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    const oldEl = slot.querySelector('.q-answer-el, .q-answer-img');
                                    const img = document.createElement('img');
                                    img.src = ev.target.result;
                                    img.className = 'q-answer-img max-h-28 w-full rounded object-contain';
                                    if (oldEl) oldEl.replaceWith(img);
                                    else slot.insertBefore(img, slot.querySelector('.q-choice-actions'));

                                    imgBtn.title = 'غيّر الصورة';
                                    const revertBtn = slot.querySelector('.choice-text-btn');
                                    if (revertBtn) revertBtn.classList.remove('hidden');

                                    const qDiv = slot.closest('.q-block');
                                    if (qDiv) applyStyleToQuestionDiv(qDiv, getCurrentTeacherStyleSettings());
                                    showToast('اتضافت الصورة بدل الكتابة في الاختيار ده');
                                };
                                reader.readAsDataURL(file);
                            };
                            input.click();
                        } else if (textBtn) {
                            const oldEl = slot.querySelector('.q-answer-img, .q-answer-el');
                            const span = document.createElement('span');
                            span.className = 'q-answer-el text-base font-semibold outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded px-2 py-1 transition w-full cursor-text';
                            span.contentEditable = 'true';
                            span.title = 'اضغط للتعديل';
                            if (oldEl) oldEl.replaceWith(span);
                            else slot.insertBefore(span, slot.querySelector('.q-choice-actions'));

                            textBtn.classList.add('hidden');
                            const imgB = slot.querySelector('.choice-img-btn');
                            if (imgB) imgB.title = 'ضيف صورة بدل الكتابة في الاختيار ده';

                            const qDiv = slot.closest('.q-block');
                            if (qDiv) applyStyleToQuestionDiv(qDiv, getCurrentTeacherStyleSettings());
                            span.focus();
                            showToast('رجّعت الاختيار كتابة، اكتب النص براحتك');
                        }
                    });
                }

                const restyleAllBtn = document.getElementById('teacher-restyle-all-btn');
                if (restyleAllBtn) restyleAllBtn.onclick = () => {
                    const preview = document.getElementById('teacher-sheet-preview');
                    const groups = preview.querySelectorAll('.q-block');
                    if (!groups.length) return showToast('لا يوجد أسئلة في الشيت لسه', 'error');
                    const settings = getCurrentTeacherStyleSettings();
                    groups.forEach(qDiv => applyStyleToQuestionDiv(qDiv, settings));
                    showToast('اتطبق الاستايل الحالي على كل الأسئلة');
                };

                document.getElementById('teacher-print-btn').onclick = () => {
                    if(!document.getElementById('teacher-sheet-preview').querySelector('.q-block')) return showToast('لا يوجد أسئلة لتحميلها!', 'error');
                    exportTeacherSheetAsPDF();
                };
            }
            
            function handleTeacherImg(file) {
                if(!file.type.startsWith('image/')) return showToast('يرجى اختيار ملف صورة', 'error');
                const reader = new FileReader();
                reader.onload = (e) => {
                    teacherImgData = e.target.result;
                    tImgPreview.src = teacherImgData;
                    tImgContainer.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        }, 500);
