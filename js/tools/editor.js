/* ===== تعديل وقص PDF ===== */
        let edBytes = null, edPdf = null, edPage = 1, edRotations = {}, edCrops = {}, edZoom = 1.0;
        const edCan = document.getElementById('edit-canvas'), edCtx = edCan.getContext('2d'), cropBox = document.getElementById('crop-overlay');
        let isDrawing = false, startX, startY;

        document.getElementById('edit-zoom-in').onclick = () => { edZoom += 0.2; document.getElementById('edit-zoom-val').textContent = Math.round(edZoom*100)+'%'; renderEdPage(); };
        document.getElementById('edit-zoom-out').onclick = () => { if(edZoom>0.4){ edZoom -= 0.2; document.getElementById('edit-zoom-val').textContent = Math.round(edZoom*100)+'%'; renderEdPage(); } };

        document.getElementById('edit-file').onchange = async (e) => {
            if(!e.target.files.length) return;
            document.getElementById('edit-upload-btn').classList.add('hidden'); document.getElementById('edit-workspace').classList.remove('hidden'); document.getElementById('edit-workspace').classList.add('flex');
            showLoad('جاري الفتح...');
            edBytes = await e.target.files[0].arrayBuffer(); edPdf = await pdfjsLib.getDocument(new Uint8Array(edBytes.slice(0))).promise;
            edPage = 1; edRotations = {}; edCrops = {}; await renderEdPage(); hideLoad(); showToast('جاهز للتعديل');
        };

        async function renderEdPage() {
            const page = await edPdf.getPage(edPage);
            const vp = page.getViewport({ scale: 1.5 * edZoom, rotation: edRotations[edPage] || 0 });
            edCan.width = vp.width; edCan.height = vp.height; await page.render({ canvasContext: edCtx, viewport: vp }).promise;
            document.getElementById('edit-curr').textContent = edPage; cropBox.classList.add('hidden');
        }

        document.getElementById('edit-prev').onclick = () => { if(edPage > 1){ edPage--; renderEdPage(); } };
        document.getElementById('edit-next').onclick = () => { if(edPage < edPdf.numPages){ edPage++; renderEdPage(); } };
        document.getElementById('edit-rotate').onclick = () => { edRotations[edPage] = ((edRotations[edPage] || 0) + 90) % 360; renderEdPage(); };
        
        document.getElementById('edit-crop-start').onclick = () => { cropBox.classList.remove('hidden'); cropBox.style.width = '0'; cropBox.style.height = '0'; showToast('حدد مكان القص بالماوس'); };
        document.getElementById('edit-canvas-container').onmousedown = (e) => {
            if(cropBox.classList.contains('hidden')) return;
            isDrawing = true; const rect = edCan.getBoundingClientRect(); startX = e.clientX - rect.left; startY = e.clientY - rect.top;
            cropBox.style.left = startX + 'px'; cropBox.style.top = startY + 'px';
        };
        document.getElementById('edit-canvas-container').onmousemove = (e) => {
            if(!isDrawing) return;
            const rect = edCan.getBoundingClientRect(); const currX = e.clientX - rect.left, currY = e.clientY - rect.top;
            const w = currX - startX, h = currY - startY;
            cropBox.style.width = Math.abs(w) + 'px'; cropBox.style.height = Math.abs(h) + 'px';
            cropBox.style.left = (w < 0 ? currX : startX) + 'px'; cropBox.style.top = (h < 0 ? currY : startY) + 'px';
        };
        document.getElementById('edit-canvas-container').onmouseup = () => {
            if(!isDrawing) return; isDrawing = false;
            const w = parseFloat(cropBox.style.width), h = parseFloat(cropBox.style.height);
            if(w > 10 && h > 10) {
                const l = parseFloat(cropBox.style.left), t = parseFloat(cropBox.style.top);
                edCrops[edPage] = { rx: l/edCan.width, ry: t/edCan.height, rw: w/edCan.width, rh: h/edCan.height };
                showToast('تم تحديد القص للصفحة الحالية');
            }
        };

        document.getElementById('edit-export').onclick = async () => {
            showLoad('حفظ التعديلات...');
            try {
                const { PDFDocument, degrees } = PDFLib; const doc = await PDFDocument.load(edBytes); const pages = doc.getPages();
                for (let i = 0; i < pages.length; i++) {
                    const pgNum = i + 1;
                    if(edRotations[pgNum]) pages[i].setRotation(degrees(edRotations[pgNum]));
                    if(edCrops[pgNum]) {
                        const { width, height } = pages[i].getSize(); const c = edCrops[pgNum];
                        pages[i].setCropBox(c.rx * width, height - (c.ry * height) - (c.rh * height), c.rw * width, c.rh * height);
                    }
                }
                const bytes = await doc.save();
                const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bytes])); a.download = 'Edited.pdf'; a.click(); showToast('تم الحفظ');
            } catch(e) { showToast('حدث خطأ', 'error'); }
            hideLoad();
        };
