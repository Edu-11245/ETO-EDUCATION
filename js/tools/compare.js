let cmpFileA = null, cmpFileB = null;
function cmpUpdateRunBtn(){ const btn=document.getElementById('cmp-run-btn'); if(btn) btn.disabled = !(cmpFileA && cmpFileB); }
document.getElementById('cmp-file-a').onchange = (e) => {
  if(!e.target.files.length) return; cmpFileA = e.target.files[0];
  document.getElementById('cmp-file-a-label').textContent = cmpFileA.name; cmpUpdateRunBtn();
};
document.getElementById('cmp-file-b').onchange = (e) => {
  if(!e.target.files.length) return; cmpFileB = e.target.files[0];
  document.getElementById('cmp-file-b-label').textContent = cmpFileB.name; cmpUpdateRunBtn();
};

async function cmpRenderPageToCanvas(pdf, pageNum, scale){
  if(pageNum > pdf.numPages) return null;
  const page = await pdf.getPage(pageNum);
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = vp.width; canvas.height = vp.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  return canvas;
}

function cmpDiffCanvases(canvasA, canvasB){
  const w = Math.max(canvasA ? canvasA.width : 0, canvasB ? canvasB.width : 0);
  const h = Math.max(canvasA ? canvasA.height : 0, canvasB ? canvasB.height : 0);
  const out = document.createElement('canvas'); out.width = w; out.height = h;
  const outCtx = out.getContext('2d');
  outCtx.fillStyle = '#ffffff'; outCtx.fillRect(0,0,w,h);
  if (canvasA) outCtx.drawImage(canvasA, 0, 0);
  outCtx.fillStyle = 'rgba(255,255,255,0.55)'; outCtx.fillRect(0,0,w,h);

  const getData = (c) => { if(!c) return null; return c.getContext('2d').getImageData(0,0,c.width,c.height); };
  const dataA = getData(canvasA), dataB = getData(canvasB);
  const outImg = outCtx.getImageData(0,0,w,h);
  let diffCount = 0;
  for (let y = 0; y < h; y++){
    for (let x = 0; x < w; x++){
      const outIdx = (y*w+x)*4;
      const getPixel = (data, cw, ch) => {
        if(!data || x>=cw || y>=ch) return [255,255,255];
        const idx=(y*cw+x)*4;
        return [data.data[idx], data.data[idx+1], data.data[idx+2]];
      };
      const [ar,ag,ab] = getPixel(dataA, canvasA?canvasA.width:0, canvasA?canvasA.height:0);
      const [br,bg,bb] = getPixel(dataB, canvasB?canvasB.width:0, canvasB?canvasB.height:0);
      const delta = Math.abs(ar-br)+Math.abs(ag-bg)+Math.abs(ab-bb);
      if (delta > 45){
        outImg.data[outIdx]=239; outImg.data[outIdx+1]=68; outImg.data[outIdx+2]=68; outImg.data[outIdx+3]=255;
        diffCount++;
      }
    }
  }
  outCtx.putImageData(outImg,0,0);
  return { canvas: out, diffCount, totalPixels: w*h };
}

document.getElementById('cmp-run-btn').onclick = async () => {
  if(!cmpFileA || !cmpFileB) return;
  const resultsEl = document.getElementById('cmp-results'); resultsEl.innerHTML='';
  const summaryEl = document.getElementById('cmp-summary'); summaryEl.classList.add('hidden');
  showLoad('بنقارن الملفين...');
  try{
    const pdfA = await pdfjsLib.getDocument(new Uint8Array(await cmpFileA.arrayBuffer())).promise;
    const pdfB = await pdfjsLib.getDocument(new Uint8Array(await cmpFileB.arrayBuffer())).promise;
    const maxPages = Math.min(60, Math.max(pdfA.numPages, pdfB.numPages));
    const scale = 1.1;
    let pagesWithDiff = 0;

    for (let i=1; i<=maxPages; i++){
      await updateProgress(Math.round((i/maxPages)*100), `صفحة ${i}`);
      const canvasA = await cmpRenderPageToCanvas(pdfA, i, scale);
      const canvasB = await cmpRenderPageToCanvas(pdfB, i, scale);
      const { canvas, diffCount, totalPixels } = cmpDiffCanvases(canvasA, canvasB);
      const diffPercent = totalPixels ? ((diffCount/totalPixels)*100) : 0;
      if (diffPercent > 0.3) pagesWithDiff++;

      const wrap = document.createElement('div');
      wrap.className = 'border rounded-xl p-3 dark:border-slate-600';
      const label = diffPercent > 0.3
        ? `<span class="text-red-600 font-bold text-xs"><i class="fa-solid fa-triangle-exclamation"></i> فيه اختلاف (${diffPercent.toFixed(1)}%)</span>`
        : `<span class="text-green-600 font-bold text-xs"><i class="fa-solid fa-circle-check"></i> متطابقة</span>`;
      wrap.innerHTML = `<div class="flex items-center justify-between mb-2"><p class="font-bold text-sm">صفحة ${i}</p>${label}</div>`;
      canvas.className = 'w-full rounded-lg border';
      wrap.appendChild(canvas);
      resultsEl.appendChild(wrap);
    }

    summaryEl.textContent = maxPages > 0
      ? `${pagesWithDiff} صفحة فيها اختلاف من أصل ${maxPages}${(pdfA.numPages!==pdfB.numPages)?' (عدد الصفحات مختلف بين الملفين برضو)':''}`
      : '';
    summaryEl.className = 'text-center text-sm font-bold mb-4 ' + (pagesWithDiff>0 ? 'text-red-600' : 'text-green-600');
    summaryEl.classList.remove('hidden');
    showToast('اكتملت المقارنة');
  }catch(err){
    console.error(err);
    showToast('حصل خطأ أثناء المقارنة','error');
  }
  hideLoad();
};
