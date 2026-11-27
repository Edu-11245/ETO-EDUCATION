/* ===== إعادة ترتيب الصفحات ===== */
        let roBytes = null, roPdf = null;
        document.getElementById('ro-file').onchange = async (e) => {
            showLoad('تجهيز الصفحات...'); roBytes = await e.target.files[0].arrayBuffer();
            const PDFJS = await window.ETO_LOADERS.loadPDFJS();
            roPdf = await PDFJS.getDocument(new Uint8Array(roBytes.slice(0))).promise;
            const grid = document.getElementById('ro-grid'); grid.innerHTML = '';
            for(let i=1; i<=roPdf.numPages; i++) {
                const p = await roPdf.getPage(i); const vp = p.getViewport({ scale: 0.45 });
                const c = document.createElement('canvas'); const ctx = c.getContext('2d'); c.width = vp.width; c.height = vp.height;
                await p.render({ canvasContext: ctx, viewport: vp }).promise;
                const div = document.createElement('div'); div.className = "p-2 bg-white border shadow-sm cursor-move relative rounded"; div.setAttribute('data-idx', i-1);
                div.innerHTML = `<div class="absolute top-1 right-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">${i}</div>`;
                c.className = "h-32 object-contain"; div.appendChild(c); grid.appendChild(div);
            }
            try {
                await window.ETO_LOADERS.loadSortable();
            } catch (error) {
                hideLoad();
                showToast('تعذر تحميل أداة السحب والإفلات', 'error');
                return;
            }
            new Sortable(grid, {
                animation: 150,
                onEnd: () => {
                    Array.from(grid.children).forEach((el, index) => {
                        const badge = el.querySelector('.absolute');
                        if (badge) badge.textContent = index + 1;
                    });
                }
            });

            document.getElementById('ro-workspace').classList.remove('hidden');
            hideLoad();
            showToast('رتب الصفحات بالسحب والإفلات');
        };
        document.getElementById('ro-export').onclick = async () => {
            showLoad('جاري الحفظ...');
            try {
                const { PDFDocument } = PDFLib; const srcDoc = await PDFDocument.load(roBytes); const outDoc = await PDFDocument.create();
                const newOrder = Array.from(document.getElementById('ro-grid').children).map(el => parseInt(el.getAttribute('data-idx')));
                const copied = await outDoc.copyPages(srcDoc, newOrder); copied.forEach(p => outDoc.addPage(p));
                const bytes = await outDoc.save(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bytes])); a.download = 'Reordered.pdf'; a.click(); showToast('تم الحفظ بالترتيب الجديد');
            } catch(e) { showToast('حدث خطأ', 'error'); } hideLoad();
        };
