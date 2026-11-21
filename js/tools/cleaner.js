/* ===== تلوين PDF وتظليل (Cleaner) ===== */
        let cPdf = null, cPage = 1, cTheme = 'original', cCustom = {bg:'#fff', text:'#000'}, cZoom = 1.0, cPageThemes = {};
        const cCan = document.getElementById('cleaner-canvas'), cCtx = cCan.getContext('2d', { willReadFrequently: true });
        const oCan = document.createElement('canvas'), oCtx = oCan.getContext('2d', { willReadFrequently: true });
        let highlights = {};

        document.getElementById('cleaner-zoom-in').onclick = () => { cZoom += 0.2; document.getElementById('cleaner-zoom-val').textContent = Math.round(cZoom*100)+'%'; renderCPage(); };
        document.getElementById('cleaner-zoom-out').onclick = () => { if(cZoom>0.4){ cZoom -= 0.2; document.getElementById('cleaner-zoom-val').textContent = Math.round(cZoom*100)+'%'; renderCPage(); } };

        document.getElementById('cleaner-file').onchange = async (e) => {
            if(!e.target.files.length) return;
            document.getElementById('cleaner-filename').textContent = e.target.files[0].name;
            document.getElementById('cleaner-upload').classList.add('hidden');
            document.getElementById('cleaner-workspace').classList.remove('hidden');
            document.getElementById('cleaner-workspace').classList.add('flex');
            showLoad('جاري فتح الملف...');
            try {
                const bytes = await e.target.files[0].arrayBuffer();
                cPdf = await pdfjsLib.getDocument(new Uint8Array(bytes)).promise;
                document.getElementById('cleaner-tot').textContent = cPdf.numPages;
                highlights = {}; cPage = 1; await renderCPage(); showToast('تم الفتح بنجاح');
            } catch(er) { showToast("خطأ في القراءة", "error"); }
            hideLoad();
        };

        async function renderCPage() {
            const page = await cPdf.getPage(cPage);
            const vp = page.getViewport({ scale: 2.0 * cZoom });
            oCan.width = cCan.width = vp.width; oCan.height = cCan.height = vp.height;
            await page.render({ canvasContext: oCtx, viewport: vp }).promise;
            document.getElementById('cleaner-curr').textContent = cPage;
            applyCTheme();
        }

        document.getElementById('cleaner-prev').onclick = () => { if(cPage > 1){ cPage--; renderCPage(); } };
        document.getElementById('cleaner-next').onclick = () => { if(cPage < cPdf.numPages){ cPage++; renderCPage(); } };
        document.getElementById('cleaner-theme-select').onchange = (e) => { 
            cTheme = e.target.value; 
            showLoad('جاري تطبيق الثيم...');
            setTimeout(() => { applyCTheme(); hideLoad(); }, 50);
        };
        document.getElementById('cleaner-apply-page-theme').onclick = () => {
            cPageThemes[cPage] = cTheme;
            applyCTheme();
            showToast('تم تطبيق الثيم على الصفحة الحالية فقط');
        };
        document.getElementById('btn-add-theme').onclick = () => {
            cCustom.bg = document.getElementById('cleaner-custom-bg').value;
            cCustom.text = document.getElementById('cleaner-custom-text').value;
            let n = document.getElementById('cleaner-custom-name').value || 'مخصص';
            let sel = document.getElementById('cleaner-theme-select');
            sel.add(new Option(n, 'custom')); sel.value = 'custom'; cTheme = 'custom'; 
            showLoad('جاري تطبيق الثيم...');
            setTimeout(() => { applyCTheme(); hideLoad(); showToast('تم تطبيق الثيم المخصص'); }, 50);
        };

        function processPixels(imgData, themeId) {
            const d = imgData.data;
            if(themeId === 'bw') {
                for (let i = 0; i < d.length; i += 4) { const luma = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2]; const v = luma > 120 ? 255 : luma; d[i]=d[i+1]=d[i+2]=v; }
                return imgData;
            }
            let bg, txt;
            if(themeId === 'dark') { bg = hexToRgb('#0f172a'); txt = hexToRgb('#e2e8f0'); }
            else if(themeId === 'sepia') { bg = hexToRgb('#fdf6e3'); txt = hexToRgb('#657b83'); }
            else if(themeId === 'green') { bg = hexToRgb('#e0f8e8'); txt = hexToRgb('#114a22'); }
            else if(themeId === 'rose') { bg = hexToRgb('#ffe4e6'); txt = hexToRgb('#881337'); }
            else if(themeId === 'blue') { bg = hexToRgb('#e0f2fe'); txt = hexToRgb('#0c4a6e'); }
            else if(themeId === 'yellow') { bg = hexToRgb('#fef9c3'); txt = hexToRgb('#713f12'); }
            else if(themeId === 'gray') { bg = hexToRgb('#f1f5f9'); txt = hexToRgb('#0f172a'); }
            else if(themeId === 'custom') { bg = hexToRgb(cCustom.bg); txt = hexToRgb(cCustom.text); }
            else return imgData; 
            
            for (let i = 0; i < d.length; i += 4) {
                const luma = (0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2]) / 255;
                d[i] = txt.r + (bg.r - txt.r) * luma; d[i+1] = txt.g + (bg.g - txt.g) * luma; d[i+2] = txt.b + (bg.b - txt.b) * luma;
            }
            return imgData;
        }
        function applyCTheme() {
            const imgData = oCtx.getImageData(0, 0, oCan.width, oCan.height);
            const pageTheme = cPageThemes[cPage] || cTheme;
            cCtx.putImageData(processPixels(imgData, pageTheme), 0, 0);
            drawHighlights();
        }
        cCan.ondblclick = (e) => {
            const rect = cCan.getBoundingClientRect();
            const scaleX = cCan.width / rect.width; const scaleY = cCan.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX; const y = (e.clientY - rect.top) * scaleY;
            if(!highlights[cPage]) highlights[cPage] = [];
            const baseScale = 2.0;
            const currentScale = 2.0 * cZoom;
            const factor = baseScale / currentScale;

            highlights[cPage].push({
                x: (x - 75) * factor,
                y: (y - 20) * factor,
                w: 150 * factor,
                h: 40 * factor,
                color: '#ffeb3b'
            });
            drawHighlights();
        };
        function drawHighlights() {
            if(!highlights[cPage]) return;
            highlights[cPage].forEach(h => { cCtx.fillStyle = h.color; cCtx.globalAlpha = 0.4; cCtx.fillRect(h.x, h.y, h.w, h.h); cCtx.globalAlpha = 1.0; });
        }

        document.getElementById('cleaner-export').onclick = async () => {
            showLoad('جاري تصدير الـ PDF...');
            setTimeout(async () => {
                try {
                    const { jsPDF } = window.jspdf; let pdfExport = null;
                    for (let i = 1; i <= cPdf.numPages; i++) {
                        await updateProgress(Math.round((i / cPdf.numPages) * 100), `صفحة ${i}`);
                        const p = await cPdf.getPage(i); const vp = p.getViewport({ scale: 2.0 });
                        oCan.width = vp.width; oCan.height = vp.height;
                        await p.render({ canvasContext: oCtx, viewport: vp }).promise;
                        let imgData = oCtx.getImageData(0, 0, oCan.width, oCan.height);
                        cCtx.canvas.width = oCan.width; cCtx.canvas.height = oCan.height;
                        cCtx.putImageData(processPixels(imgData, cPageThemes[i] || cTheme), 0, 0);
                        cPage = i; drawHighlights();                         
                        const format = vp.width > vp.height ? 'l' : 'p';
                        if (i === 1) pdfExport = new jsPDF(format, 'px', [vp.width, vp.height]);
                        else pdfExport.addPage([vp.width, vp.height], format);
                        pdfExport.addImage(cCtx.canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, vp.width, vp.height);
                    }
                    pdfExport.save('Cleaned_File.pdf');
                    cPage = 1; applyCTheme(); showToast('تم التصدير بنجاح');
                } catch(e) { showToast('خطأ في التصدير', 'error'); }
                hideLoad();
            }, 50);
        };

        document.getElementById('cleaner-reset-theme').onclick = () => {
            delete cPageThemes[cPage];
            cTheme = 'original';
            const select = document.getElementById('cleaner-theme-select');
            if (select) select.value = 'original';

            applyCTheme();
            showToast('رجعنا الصفحة الحالية للشكل الأصلي');
        };
