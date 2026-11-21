/* ===== نصوص PDF (استخراج / إنشاء) ===== */
        function switchTextMode(mode) {
            document.getElementById('btn-mode-extract').className = mode === 'extract' ? 'px-4 py-1 rounded bg-white font-bold shadow-sm' : 'px-4 py-1 rounded text-gray-500 font-bold hover:text-gray-800';
            document.getElementById('btn-mode-create').className = mode === 'create' ? 'px-4 py-1 rounded bg-white font-bold shadow-sm' : 'px-4 py-1 rounded text-gray-500 font-bold hover:text-gray-800';
            document.getElementById('text-extract-ui').classList.toggle('hidden', mode === 'create');
            document.getElementById('text-export-btn').classList.toggle('hidden', mode === 'extract');
            document.getElementById('text-area').value = '';
        }
        document.getElementById('text-pdf-file').onchange = async (e) => {
            if(!e.target.files.length) return; const file = e.target.files[0]; showLoad('قراءة النص OCR...');
            try {
                let fullText = ""; const worker = await Tesseract.createWorker(); await worker.loadLanguage('ara'); await worker.initialize('ara');
                if (file.type.startsWith('image/')) {
                    await updateProgress(50, 'تحليل الصورة...');
                    const imageUrl = URL.createObjectURL(file);

                    try {
                        const { data: { text } } = await worker.recognize(imageUrl);
                        fullText = text;
                    } finally {
                        URL.revokeObjectURL(imageUrl);
                    }
                } else if (file.type === 'application/pdf') {
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(await file.arrayBuffer())).promise;
                    for (let i = 1; i <= pdf.numPages; i++) {
                        await updateProgress(Math.round((i / pdf.numPages) * 100), `صفحة ${i}`);
                        const p = await pdf.getPage(i); const vp = p.getViewport({ scale: 4.0 });
                        const c = document.createElement('canvas'), ctx = c.getContext('2d'); c.width = vp.width; c.height = vp.height;
                        await p.render({ canvasContext: ctx, viewport: vp }).promise;
                        const { data: { text } } = await worker.recognize(c); if (text.trim() !== "") fullText += text + "\n\n";
                    }
                }
                await worker.terminate(); document.getElementById('text-area').value = fullText; showToast('اكتملت القراءة');
            } catch(err) { showToast('خطأ في استخراج النص', 'error'); }
            hideLoad();
        };
        document.getElementById('text-export-btn').onclick = () => {
            showLoad('جاري إنشاء ملف PDF...');

            setTimeout(() => {
                try {
                    const text = document.getElementById('text-area').value.trim();

                    if (!text) {
                        hideLoad();
                        showToast('اكتب النص أولاً', 'error');
                        return;
                    }

                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF('p', 'pt', 'a4');

                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    const margin = 40;
                    const lineHeight = 30;
                    const maxWidth = pageWidth - (margin * 2);

                    doc.setFont('Helvetica');
                    doc.setFontSize(14);

                    const paragraphs = text.split('\n');

                    let y = margin;

                    paragraphs.forEach(paragraph => {
                        const lines = doc.splitTextToSize(paragraph || ' ', maxWidth);

                        lines.forEach(line => {
                            if (y > pageHeight - margin) {
                                doc.addPage();
                                y = margin;
                            }

                            doc.text(line, pageWidth - margin, y, {
                                align: 'right'
                            });

                            y += lineHeight;
                        });

                        y += 8;
                    });

                    doc.save('Document.pdf');
                    hideLoad();
                    showToast('تم تحميل الملف');
                } catch (e) {
                    console.error(e);
                    hideLoad();
                    showToast('حدث خطأ أثناء إنشاء PDF', 'error');
                }
            }, 100);
        };
