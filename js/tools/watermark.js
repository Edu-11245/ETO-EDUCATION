/* ===== علامة مائية ===== */
        let wmBytes = null;
        let wmPdf = null;
        let wmPreviewPage = null;
        let wmPreviewScale = 1;
        let wmPosition = { x: 0.5, y: 0.5 };
        let wmDragging = false;
        let wmDragOffset = { x: 0, y: 0 };

        const wmFileInput = document.getElementById('wm-file');
        const wmWorkspace = document.getElementById('wm-workspace');
        const wmPreviewCanvas = document.getElementById('wm-preview-canvas');
        const wmPreviewStage = document.getElementById('wm-preview-stage');
        const wmPreviewWatermark = document.getElementById('wm-preview-watermark');

        function updateWatermarkPreview() {
            if (!wmPreviewWatermark) return;

            const text = document.getElementById('wm-text').value || 'PRIVATE';
            const size = parseInt(document.getElementById('wm-size').value) || 60;
            const opacity = parseFloat(document.getElementById('wm-opacity').value) || 0.3;

            wmPreviewWatermark.textContent = text;
            wmPreviewWatermark.style.fontFamily = "'Cairo', sans-serif";
            wmPreviewWatermark.style.fontSize = Math.max(14, size * wmPreviewScale) + 'px';
            wmPreviewWatermark.style.opacity = opacity;
            wmPreviewWatermark.style.transform = 'translate(-50%, -50%) rotate(45deg)';
            wmPreviewWatermark.style.left = (wmPosition.x * 100) + '%';
            wmPreviewWatermark.style.top = (wmPosition.y * 100) + '%';
        }

        async function renderWatermarkPreview() {
            if (!wmPreviewPage || !wmPreviewCanvas) return;

            const rect = wmPreviewStage.getBoundingClientRect();
            const baseViewport = wmPreviewPage.getViewport({ scale: 1 });
            const maxWidth = Math.max(260, rect.width - 24);
            const maxHeight = Math.max(400, rect.height - 24);

            const scaleX = maxWidth / baseViewport.width;
            const scaleY = maxHeight / baseViewport.height;
            wmPreviewScale = Math.min(scaleX, scaleY, 1.2);

            const viewport = wmPreviewPage.getViewport({ scale: wmPreviewScale });

            wmPreviewCanvas.width = viewport.width;
            wmPreviewCanvas.height = viewport.height;
            wmPreviewCanvas.style.width = viewport.width + 'px';
            wmPreviewCanvas.style.height = viewport.height + 'px';

            const ctx = wmPreviewCanvas.getContext('2d');

            await wmPreviewPage.render({
                canvasContext: ctx,
                viewport
            }).promise;

            updateWatermarkPreview();
        }

        async function createArabicWatermarkCanvas(text, size, opacity, rotation = 45) {
            await document.fonts.ready;
            const canvas = document.createElement('canvas');
            const scale = 3;
            const fontSize = Math.max(20, size) * scale;
            const padding = 40 * scale;
            const measureCtx = canvas.getContext('2d');
            measureCtx.font = `900 ${fontSize}px Cairo, Arial, sans-serif`;
            const metrics = measureCtx.measureText(text);
            const rawWidth = Math.ceil(metrics.width);
            const rawHeight = Math.ceil(fontSize * 1.5);
            const rad = Math.abs(rotation) * Math.PI / 180;
            const rotatedWidth = Math.abs(rawWidth * Math.cos(rad)) + Math.abs(rawHeight * Math.sin(rad));
            const rotatedHeight = Math.abs(rawWidth * Math.sin(rad)) + Math.abs(rawHeight * Math.cos(rad));
            const textWidth = Math.ceil(rotatedWidth) + padding * 2;
            const textHeight = Math.ceil(rotatedHeight) + padding * 2;
            canvas.width = textWidth;
            canvas.height = textHeight;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `900 ${fontSize}px Cairo, Arial, sans-serif`;
            ctx.fillStyle = `rgba(80,80,80,${opacity})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.direction = 'rtl';
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
            return canvas;
        }

        wmFileInput.onchange = async (e) => {
            if (!e.target.files.length) return;

            try {
                showLoad('جاري تجهيز المعاينة...');

                wmBytes = await e.target.files[0].arrayBuffer();

                wmPdf = await pdfjsLib.getDocument(
                    new Uint8Array(wmBytes.slice(0))
                ).promise;

                wmPreviewPage = await wmPdf.getPage(1);
                wmPosition = { x: 0.5, y: 0.5 };

                wmWorkspace.classList.remove('hidden');

                await renderWatermarkPreview();

                showToast('تم رفع الملف، حدد مكان العلامة بالماوس');
            } catch (e) {
                console.error(e);
                showToast('تعذر فتح ملف PDF', 'error');
            }

            hideLoad();
        };

        document.getElementById('wm-text').oninput = updateWatermarkPreview;
        document.getElementById('wm-size').oninput = updateWatermarkPreview;
        document.getElementById('wm-opacity').oninput = updateWatermarkPreview;

        window.addEventListener('resize', () => {
            if (wmPreviewPage) renderWatermarkPreview();
        });

        wmPreviewStage.addEventListener('mousedown', (e) => {
            if (!wmPreviewWatermark || !wmPreviewPage) return;

            const watermarkRect = wmPreviewWatermark.getBoundingClientRect();

            if (
                e.clientX < watermarkRect.left ||
                e.clientX > watermarkRect.right ||
                e.clientY < watermarkRect.top ||
                e.clientY > watermarkRect.bottom
            ) {
                return;
            }

            wmDragging = true;

            wmDragOffset.x = e.clientX - watermarkRect.left - watermarkRect.width / 2;
            wmDragOffset.y = e.clientY - watermarkRect.top - watermarkRect.height / 2;

            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!wmDragging) return;

            const stageRect = wmPreviewStage.getBoundingClientRect();

            wmPosition.x = Math.max(
                0.05,
                Math.min(
                    0.95,
                    (e.clientX - stageRect.left - wmDragOffset.x) / stageRect.width
                )
            );

            wmPosition.y = Math.max(
                0.05,
                Math.min(
                    0.95,
                    (e.clientY - stageRect.top - wmDragOffset.y) / stageRect.height
                )
            );

            updateWatermarkPreview();
        });

        window.addEventListener('mouseup', () => {
            wmDragging = false;
        });
        document.getElementById('wm-center').onclick = () => {
            wmPosition = { x: 0.5, y: 0.5 };
            updateWatermarkPreview();
            showToast('تم توسيط العلامة');
        };

        document.getElementById('wm-color').addEventListener('input', (e) => {
            document.getElementById('wm-preview-watermark').style.color = e.target.value;
        });

        document.getElementById('wm-export').onclick = async () => {
            if (!wmBytes) return;

            showLoad('إضافة العلامة المائية...');

            try {
                const { PDFDocument } = PDFLib;

                const doc = await PDFDocument.load(wmBytes);

                const text = document.getElementById('wm-text').value || 'PRIVATE';
                const size = parseInt(document.getElementById('wm-size').value) || 60;
                const opacity = parseFloat(document.getElementById('wm-opacity').value) || 0.3;

                const watermarkCanvas = await createArabicWatermarkCanvas(
                    text,
                    size,
                    opacity,
                    45
                );

                const watermarkPng = await doc.embedPng(
                    watermarkCanvas.toDataURL('image/png')
                );

                doc.getPages().forEach(page => {
                    const { width, height } = page.getSize();

                    const drawWidth = watermarkCanvas.width / 3;
                    const drawHeight = watermarkCanvas.height / 3;

                    const x = (width * wmPosition.x) - (drawWidth / 2);
                    const y = (height * (1 - wmPosition.y)) - (drawHeight / 2);

                    page.drawImage(watermarkPng, {
                        x,
                        y,
                        width: drawWidth,
                        height: drawHeight,
                        opacity: opacity
                    });
                });

                const bytes = await doc.save();

                const a = document.createElement('a');
                a.href = URL.createObjectURL(
                    new Blob([bytes], { type: 'application/pdf' })
                );
                a.download = 'Watermarked.pdf';
                a.click();

                showToast('تم إضافة العلامة المائية بنجاح');
            } catch (e) {
                console.error(e);
                showToast('حدث خطأ أثناء إضافة العلامة المائية', 'error');
            }

            hideLoad();
        };
