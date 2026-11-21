/* ===== ضغط PDF ===== */
        let compPdfBytes = null;
        document.getElementById('compress-file').onchange = async (e) => {
            if(!e.target.files.length) return;
            document.getElementById('compress-name').textContent = e.target.files[0].name;
            document.getElementById('compress-options').classList.remove('hidden');
            compPdfBytes = await e.target.files[0].arrayBuffer(); showToast('ملف جاهز للضغط');
        };
        document.getElementById('compress-btn').onclick = async () => {
            showLoad('جاري الضغط...');
            setTimeout(async () => {
                try {
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(compPdfBytes)).promise;
                    const { jsPDF } = window.jspdf;
                    const qual = parseFloat(document.getElementById('compress-level').value);
                    let outPdf = null; const tCan = document.createElement('canvas'), tCtx = tCan.getContext('2d');
                    for (let i = 1; i <= pdf.numPages; i++) {
                        await updateProgress(Math.round((i / pdf.numPages) * 100), `ضغط صفحة ${i}`);
                        const p = await pdf.getPage(i); const originalVp = p.getViewport({ scale: 1.0 });
                        let renderScale = qual >= 0.9 ? 1.0 : (qual >= 0.7 ? 0.7 : 0.4);
                        const vp = p.getViewport({ scale: renderScale });
                        tCan.width = vp.width; tCan.height = vp.height;
                        await p.render({ canvasContext: tCtx, viewport: vp }).promise;
                        const format = originalVp.width > originalVp.height ? 'l' : 'p';
                        if (i === 1) outPdf = new jsPDF(format, 'px', [originalVp.width, originalVp.height]);
                        else outPdf.addPage([originalVp.width, originalVp.height], format);
                        outPdf.addImage(tCan.toDataURL('image/jpeg', qual), 'JPEG', 0, 0, originalVp.width, originalVp.height);
                    }
                    outPdf.save('Compressed.pdf'); showToast('تم الضغط بنجاح');
                } catch(e) { showToast('خطأ أثناء الضغط', 'error'); }
                hideLoad();
            }, 100);
        };
