
;
(function () {
    const fileInput = document.getElementById('pdf-to-word-file');
    const fileNameEl = document.getElementById('pdf-to-word-name');
    const previewEl = document.getElementById('pdf-to-word-preview');
    const convertBtn = document.getElementById('pdf-to-word-btn');
    const statusEl = document.getElementById('pdf-to-word-status');

    if (!fileInput || !fileNameEl || !convertBtn) return;

    let selectedPdfFile = null;
    let pdfDocument = null;

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        selectedPdfFile = file;
        pdfDocument = null;

        fileNameEl.textContent = file.name;

        if (previewEl) {
            previewEl.value = '';
        }

        if (statusEl) {
            statusEl.textContent = 'جاري تجهيز ملف PDF...';
        }

        convertBtn.disabled = true;

        try {
            const bytes = new Uint8Array(await file.arrayBuffer());

            const PDFJS = await window.ETO_LOADERS.loadPDFJS();
            pdfDocument = await PDFJS.getDocument({
                data: bytes
            }).promise;

            if (statusEl) {
                statusEl.textContent = `تم تجهيز الملف - ${pdfDocument.numPages} صفحة`;
            }

            convertBtn.disabled = false;
            convertBtn.classList.remove('hidden');
            document.getElementById('pdf-to-word-info')?.classList.remove('hidden');
            const pagesEl = document.getElementById('pdf-to-word-pages');
            if (pagesEl) pagesEl.textContent = `${pdfDocument.numPages} صفحة`;

            if (typeof showToast === 'function') {
                showToast(`الملف جاهز - ${pdfDocument.numPages} صفحة`);
            }
        } catch (error) {
            console.error(error);

            if (statusEl) {
                statusEl.textContent = 'حصل خطأ أثناء قراءة ملف الـ PDF';
            }

            if (typeof showToast === 'function') {
                showToast('حصل خطأ أثناء قراءة ملف الـ PDF', 'error');
            }
        }
    });

    convertBtn.addEventListener('click', async () => {
        if (!selectedPdfFile || !pdfDocument) return;

        if (!window.docx) {
            if (typeof showToast === 'function') {
                showToast('مكتبة Word لم يتم تحميلها، اعمل تحديث للصفحة', 'error');
            }
            return;
        }

        try {
            convertBtn.disabled = true;

            if (typeof showLoad === 'function') {
                showLoad('بنحول صفحات الـ PDF إلى Word...');
            }

            const {
                Document,
                Packer,
                Paragraph,
                ImageRun
            } = window.docx;

            const sections = [];

            for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex++) {
                await updateProgress(
                    Math.round((pageIndex / pdfDocument.numPages) * 100),
                    `تحويل الصفحة ${pageIndex} من ${pdfDocument.numPages}`
                );

                const page = await pdfDocument.getPage(pageIndex);

                const viewport = page.getViewport({
                    scale: 2
                });

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = Math.ceil(viewport.width);
                canvas.height = Math.ceil(viewport.height);

                await page.render({
                    canvasContext: ctx,
                    viewport: viewport
                }).promise;

                const imageBase64 = canvas.toDataURL(
                    'image/jpeg',
                    0.95
                );

                const imageData = Uint8Array.from(
                    atob(imageBase64.split(',')[1]),
                    char => char.charCodeAt(0)
                );

                const imgWidthPx = 794;
                const imgHeightPx = Math.round(
                    imgWidthPx * (viewport.height / viewport.width)
                );

                const pageWidthTwips = imgWidthPx * 15;
                const pageHeightTwips = imgHeightPx * 15 + 40;

                sections.push({
                    properties: {
                        page: {
                            size: {
                                width: pageWidthTwips,
                                height: pageHeightTwips
                            },
                            margin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0
                            }
                        }
                    },
                    children: [
                        new Paragraph({
                            spacing: {
                                before: 0,
                                after: 0
                            },
                            children: [
                                new ImageRun({
                                    data: imageData,
                                    transformation: {
                                        width: imgWidthPx,
                                        height: imgHeightPx
                                    }
                                })
                            ]
                        })
                    ]
                });

                canvas.width = 1;
                canvas.height = 1;
            }

            const doc = new Document({
                sections: sections
            });

            const blob = await Packer.toBlob(doc);

            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download =
                selectedPdfFile.name.replace(/\.pdf$/i, '') + '.docx';

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);

            if (statusEl) {
                statusEl.textContent =
                    'تم تحويل الـ PDF إلى Word بنجاح';
            }

            if (typeof showToast === 'function') {
                showToast('تم تحويل PDF إلى Word بنجاح');
            }

        } catch (error) {
            console.error(error);

            if (statusEl) {
                statusEl.textContent =
                    'حصل خطأ أثناء إنشاء ملف Word';
            }

            if (typeof showToast === 'function') {
                showToast(
                    'حصل خطأ أثناء إنشاء ملف Word',
                    'error'
                );
            }
        } finally {
            convertBtn.disabled = false;

            if (typeof hideLoad === 'function') {
                hideLoad();
            }
        }
    });
})();
