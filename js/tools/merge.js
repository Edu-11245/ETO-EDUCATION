/* ===== دمج الملفات ===== */
        let mergeFiles = [], currentMergeRenderId = 0, sortableInstance = null;
        const mInput = document.getElementById('merge-file-input'), mList = document.getElementById('merge-file-list'), mBtn = document.getElementById('merge-btn'), mWorkspace = document.getElementById('merge-workspace'), mPreview = document.getElementById('merge-preview-container');

        mInput.onchange = async function() {
            const newFiles = Array.from(this.files).filter(f => f.type === 'application/pdf');
            if(newFiles.length > 0) { mergeFiles = mergeFiles.concat(newFiles); mWorkspace.classList.remove('hidden'); await renderMergeList(); showToast('تمت الإضافة للمكتبة'); }
            this.value = ''; 
        };

        async function renderMergeList() {
            const renderId = ++currentMergeRenderId;
            mList.innerHTML = ''; mPreview.innerHTML = '';
            if(mergeFiles.length === 0) { mWorkspace.classList.add('hidden'); return; }
            mBtn.disabled = mergeFiles.length < 2;
            mBtn.className = mergeFiles.length < 2 ? "w-full bg-gray-400 text-white font-bold py-3 rounded-xl mt-6 transition flex items-center justify-center gap-2" : "w-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white font-bold py-3 rounded-xl mt-6 transition flex items-center justify-center gap-2";
            mBtn.innerHTML = mergeFiles.length < 2 ? '<i class="fa-solid fa-triangle-exclamation"></i> يرجى إضافة ملف آخر' : '<i class="fa-solid fa-object-group"></i> دمج وتحميل الملف النهائي';

            for(let i = 0; i < mergeFiles.length; i++) {
                if (renderId !== currentMergeRenderId) return;
                const f = mergeFiles[i];
                const li = document.createElement('li'); 
                li.className = "flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md cursor-move merge-drag-item";
                li.setAttribute('data-id', i);
                
                li.innerHTML = `
                    <div class="flex gap-3 items-center w-full">
                        <div class="text-gray-400 hover:text-green-600"><i class="fa-solid fa-grip-vertical"></i></div>
                        <div class="flex items-center gap-2 overflow-hidden">
                            <span class="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs badge-num">${i + 1}</span>
                            <span class="font-bold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">${f.name}</span>
                        </div>
                    </div>
                    <button class="del-btn text-red-500 hover:bg-red-50 p-2 rounded-lg transition ml-2"><i class="fa-solid fa-trash"></i></button>
                `;
                mList.appendChild(li);
                li.querySelector('.del-btn').onclick = async () => { mergeFiles.splice(i, 1); await renderMergeList(); };
                const previewItem = document.createElement('div');
                previewItem.className = "flex-shrink-0 flex flex-col items-center gap-2 bg-white p-2 rounded-lg border shadow-sm w-28 relative";
                const canvasContainer = document.createElement('div');
                canvasContainer.className = "w-full h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden skeleton";
                previewItem.innerHTML = `<div class="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md z-10">${i + 1}</div><span class="text-[10px] font-bold text-gray-600 truncate w-full text-center mt-auto">${f.name}</span>`;
                previewItem.insertBefore(canvasContainer, previewItem.firstChild);
                mPreview.appendChild(previewItem);
                
                try {
                    const buf = await f.arrayBuffer();
                    if (renderId !== currentMergeRenderId) return;
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(buf.slice(0))).promise;
                    if (renderId !== currentMergeRenderId) return;
                    const page = await pdf.getPage(1); const vp = page.getViewport({ scale: 0.5 });
                    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
                    canvas.width = vp.width; canvas.height = vp.height; canvas.className = "w-full h-full object-contain";
                    await page.render({ canvasContext: ctx, viewport: vp }).promise;
                    if (renderId !== currentMergeRenderId) return;
                    canvasContainer.classList.remove('skeleton');
                    canvasContainer.appendChild(canvas);
                } catch(e) { canvasContainer.classList.remove('skeleton'); canvasContainer.innerHTML = '<i class="fa-solid fa-file-pdf text-red-400 text-3xl"></i>'; }
            }

            if(sortableInstance) sortableInstance.destroy();
            sortableInstance = new Sortable(mList, {
                animation: 150,
                onEnd: async function (evt) {
                    const itemEl = mergeFiles.splice(evt.oldIndex, 1)[0];
                    mergeFiles.splice(evt.newIndex, 0, itemEl);
                    await renderMergeList();
                }
            });
        }

        mBtn.onclick = async () => {
            if(mergeFiles.length < 2) return;
            showLoad('جاري دمج الملفات...');
            try {
                const { PDFDocument } = PDFLib; const mergedPdf = await PDFDocument.create();
                for (let i = 0; i < mergeFiles.length; i++) {
                    await updateProgress(Math.round(((i + 1) / mergeFiles.length) * 100), `ملف ${i + 1}`);
                    const buf = await mergeFiles[i].arrayBuffer(); 
                    const pdf = await PDFDocument.load(buf);
                    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    pages.forEach(p => mergedPdf.addPage(p));
                }
                const bytes = await mergedPdf.save();
                const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'})); 
                a.download = 'Merged_By_Eto.pdf'; a.click(); showToast('اكتمل الدمج!');
            } catch (e) { showToast("خطأ أثناء الدمج", "error"); }
            hideLoad();
        };
