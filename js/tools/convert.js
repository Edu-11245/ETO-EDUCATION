/* ===== تحويل صور <-> PDF ===== */
        let cImgs = [];
        document.getElementById('img-to-pdf-file').onchange = (e) => { cImgs = Array.from(e.target.files); if(cImgs.length) { document.getElementById('btn-img-to-pdf').classList.remove('hidden'); document.getElementById('btn-img-to-pdf').textContent = `تحميل PDF (${cImgs.length} صور)`; } };
        document.getElementById('btn-img-to-pdf').onclick = async () => {
            showLoad('جاري التحويل...');
            setTimeout(async () => {
                const { jsPDF } = window.jspdf; let doc = new jsPDF();
                for (let idx = 0; idx < cImgs.length; idx++) {
                    await updateProgress(Math.round(((idx + 1) / cImgs.length) * 100), `تحويل ${idx + 1}`);
                    if(idx > 0) doc.addPage();
                    const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(cImgs[idx]);
                    });

                    const format = cImgs[idx].type === 'image/png' ? 'PNG' : 'JPEG';
                    doc.addImage(dataUrl, format, 0, 0, 210, 297);
                }
                doc.save('Converted.pdf'); hideLoad(); showToast('تم التحويل');
            }, 100);
        };
        
        document.getElementById('pdf-to-img-file').onchange = async (e) => {
            if(!e.target.files.length) return; showLoad('استخراج الصور...');
            const buf = await e.target.files[0].arrayBuffer(); const pdf = await pdfjsLib.getDocument(new Uint8Array(buf)).promise;
            const resDiv = document.getElementById('pdf-to-img-results'); resDiv.innerHTML = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const btn = document.createElement('button');
                btn.className = "w-full bg-white border border-blue-200 text-blue-700 py-2.5 rounded-lg hover:bg-blue-50 dark:bg-slate-800/50 dark:border-slate-600 font-bold transition flex items-center justify-between px-3";
                btn.innerHTML = `<span>صفحة ${i}</span><i class="fa-solid fa-download"></i>`;
                btn.onclick = async () => {
                    const p = await pdf.getPage(i);
                    const vp = p.getViewport({ scale: 2.0 });
                    const c = document.createElement('canvas');
                    const ctx = c.getContext('2d');

                    c.width = vp.width;
                    c.height = vp.height;

                    await p.render({
                        canvasContext: ctx,
                        viewport: vp
                    }).promise;

                    const a = document.createElement('a');
                    a.href = c.toDataURL('image/jpeg', 0.92);
                    a.download = `Page_${i}.jpg`;
                    a.click();

                    showToast(`تم تحميل صفحة ${i}`);
                };
                resDiv.appendChild(btn);
            }
            hideLoad(); showToast('تم الاستخراج جاهز للتحميل');
        };
