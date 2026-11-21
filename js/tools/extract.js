/* ===== استخراج وحذف صفحات ===== */
        let extBytes = null, extNumPages = 0, finalExtBytes = null, pagesToDelete = new Set();
        document.getElementById('ext-file').onchange = async (e) => {
            if(!e.target.files.length) return;
            showLoad('جاري التحليل...');
            extBytes = await e.target.files[0].arrayBuffer();
            const pdf = await pdfjsLib.getDocument(new Uint8Array(extBytes.slice(0))).promise;
            extNumPages = pdf.numPages;
            document.getElementById('ext-name').textContent = `${e.target.files[0].name} (${extNumPages} صفحة)`;
            document.getElementById('ext-from').value = 1; document.getElementById('ext-to').value = extNumPages; document.getElementById('ext-exclude').value = '';
            pagesToDelete.clear(); renderExtGrid();
            document.getElementById('ext-workspace').classList.remove('hidden'); document.getElementById('ext-btn-download').classList.add('hidden'); document.getElementById('ext-preview-container').classList.add('hidden'); document.getElementById('ext-btn-preview').classList.remove('hidden');
            hideLoad(); showToast('الملف جاهز للاستخراج');
        };

        function renderExtGrid() {
            const grid = document.getElementById('ext-page-grid'); grid.innerHTML = '';
            for(let i = 1; i <= extNumPages; i++) {
                const btn = document.createElement('button'); btn.textContent = i;
                btn.className = pagesToDelete.has(i) ? 'w-10 h-10 rounded bg-red-500 text-white font-bold shadow-sm transition' : 'w-10 h-10 rounded bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 shadow-sm transition';
                btn.onclick = () => { if(pagesToDelete.has(i)) pagesToDelete.delete(i); else pagesToDelete.add(i); renderExtGrid(); };
                grid.appendChild(btn);
            }
        }
        document.getElementById('ext-select-all').onclick = () => {
            pagesToDelete.clear();
            for (let i = 1; i <= extNumPages; i++) pagesToDelete.add(i);
            renderExtGrid();
        };

        document.getElementById('ext-clear-all').onclick = () => {
            pagesToDelete.clear();
            renderExtGrid();
        };
        function applyRangeLogic() {
            const from = parseInt(document.getElementById('ext-from').value) || 1, to = parseInt(document.getElementById('ext-to').value) || extNumPages;
            const excludes = document.getElementById('ext-exclude').value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            pagesToDelete.clear();
            for(let i = 1; i <= extNumPages; i++) { if (i < from || i > to || excludes.includes(i)) pagesToDelete.add(i); }
            renderExtGrid();
        }
        document.getElementById('ext-from').oninput = applyRangeLogic; document.getElementById('ext-to').oninput = applyRangeLogic; document.getElementById('ext-exclude').oninput = applyRangeLogic;

        document.getElementById('ext-btn-preview').onclick = async () => {
            showLoad('تجهيز المعاينة...');
            try {
                const { PDFDocument } = PDFLib; const srcDoc = await PDFDocument.load(extBytes); const outDoc = await PDFDocument.create();
                let indices = [];
                for(let i = 0; i < extNumPages; i++) { if(!pagesToDelete.has(i + 1)) indices.push(i); }
                if(indices.length === 0) { hideLoad(); return showToast('لقد حذفت جميع الصفحات!', 'error'); }
                const copied = await outDoc.copyPages(srcDoc, indices); copied.forEach(p => outDoc.addPage(p));
                finalExtBytes = await outDoc.save();
                document.getElementById('ext-preview-frame').src = URL.createObjectURL(new Blob([finalExtBytes], {type: 'application/pdf'}));
                document.getElementById('ext-preview-container').classList.remove('hidden'); document.getElementById('ext-btn-download').classList.remove('hidden'); showToast('المعاينة جاهزة');
            } catch(e) { showToast('خطأ أثناء المعالجة', 'error'); }
            hideLoad();
        };

        document.getElementById('ext-btn-download').onclick = () => {
            if(!finalExtBytes) return;
            let fn = prompt("اسم الملف:", "support_eto.pdf"); if (!fn) return; if (!fn.toLowerCase().endsWith('.pdf')) fn += ".pdf";
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([finalExtBytes], {type: 'application/pdf'})); a.download = fn; a.click();
        };
