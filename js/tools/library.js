let libDB = null, libCurrentFilter = 'الكل';
function libOpenDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('eto-library-db', 1);
    req.onupgradeneeded = () => { const db = req.result; if(!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'id' }); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function libGetAll(){
  return new Promise((resolve, reject) => {
    const tx = libDB.transaction('files', 'readonly'); const store = tx.objectStore('files');
    const req = store.getAll(); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
}
function libPut(item){
  return new Promise((resolve, reject) => {
    const tx = libDB.transaction('files', 'readwrite'); tx.objectStore('files').put(item);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  });
}
function libDelete(id){
  return new Promise((resolve, reject) => {
    const tx = libDB.transaction('files', 'readwrite'); tx.objectStore('files').delete(id);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  });
}

let libPendingFile = null;
async function libHandleFiles(files){
  for (const file of files){
    libPendingFile = file;
    document.getElementById('lib-tag-subject').value = '';
    document.getElementById('lib-tag-term').value = '';
    document.getElementById('lib-tag-modal').classList.remove('hidden');
    document.getElementById('lib-tag-modal').classList.add('flex');
    await new Promise(resolve => {
      document.getElementById('lib-tag-save').onclick = async () => {
        const subject = document.getElementById('lib-tag-subject').value.trim() || 'عام';
        const term = document.getElementById('lib-tag-term').value.trim() || 'بدون تصنيف';
        const item = { id: 'f_' + Date.now() + '_' + Math.random().toString(36).slice(2), name: file.name, subject, term, size: file.size, date: new Date().toISOString(), blob: file };
        await libPut(item);
        document.getElementById('lib-tag-modal').classList.add('hidden');
        document.getElementById('lib-tag-modal').classList.remove('flex');
        resolve();
      };
      document.getElementById('lib-tag-cancel').onclick = () => {
        document.getElementById('lib-tag-modal').classList.add('hidden');
        document.getElementById('lib-tag-modal').classList.remove('flex');
        resolve();
      };
    });
  }
  await libRender();
}

async function libRender(){
  const items = await libGetAll();
  const grid = document.getElementById('lib-grid'); const empty = document.getElementById('lib-empty');
  const tabsWrap = document.getElementById('lib-filter-tabs');
  const subjects = ['الكل', ...new Set(items.map(i => i.subject))];
  tabsWrap.innerHTML = '';
  subjects.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = s;
    btn.className = 'px-3 py-1.5 rounded-full text-xs font-bold border transition ' + (s===libCurrentFilter ? 'bg-lime-600 text-white border-lime-600' : 'bg-white text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600');
    btn.onclick = () => { libCurrentFilter = s; libRender(); };
    tabsWrap.appendChild(btn);
  });

  const filtered = libCurrentFilter==='الكل' ? items : items.filter(i => i.subject === libCurrentFilter);
  grid.innerHTML = '';
  empty.classList.toggle('hidden', filtered.length > 0);
  filtered.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-4 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-600 rounded-xl';
    const sizeKb = (item.size/1024).toFixed(0);
    card.innerHTML = `
      <div class="flex items-start gap-3 mb-3">
        <div class="w-10 h-10 bg-lime-100 text-lime-600 rounded-lg flex items-center justify-center shrink-0"><i class="fa-solid fa-file"></i></div>
        <div class="min-w-0">
          <p class="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">${escapeHtml(item.name)}</p>
          <p class="text-xs text-gray-500">${escapeHtml(item.subject)} • ${escapeHtml(item.term)} • ${sizeKb} KB</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button data-act="dl" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg"><i class="fa-solid fa-download"></i> تحميل</button>
        <button data-act="del" class="bg-red-50 text-red-600 text-xs font-bold py-2 px-3 rounded-lg hover:bg-red-100"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    card.querySelector('[data-act="dl"]').onclick = () => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(item.blob); a.download = item.name; a.click();
    };
    card.querySelector('[data-act="del"]').onclick = async () => { await libDelete(item.id); libRender(); };
    grid.appendChild(card);
  });
}

async function wireLibrary(){
  libDB = await libOpenDB();
  const dz = document.getElementById('lib-drop-zone'); const input = document.getElementById('lib-file-input');
  dz.addEventListener('click', () => input.click());
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('dragover'); if(e.dataTransfer.files.length) libHandleFiles(Array.from(e.dataTransfer.files)); });
  input.addEventListener('change', () => { if(input.files.length) libHandleFiles(Array.from(input.files)); input.value=''; });
  await libRender();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wireLibrary);else wireLibrary();
document.getElementById('pdf-to-ppt-file').onchange = async (e) => {
  if(!e.target.files.length) return;
  showLoad('بنحول لـ PowerPoint...');
  try{
    const PDFJS = await window.ETO_LOADERS.loadPDFJS();
    const pdf = await PDFJS.getDocument(new Uint8Array(await e.target.files[0].arrayBuffer())).promise;
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'A4', width: 10, height: 7.5 });
    pptx.layout = 'A4';
    for (let i = 1; i <= pdf.numPages; i++){
      await updateProgress(Math.round((i/pdf.numPages)*100), `صفحة ${i}`);
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas'); canvas.width = vp.width; canvas.height = vp.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const slide = pptx.addSlide();
      const ratio = vp.height / vp.width;
      const slideW = 10, slideH = 10 * ratio;
      slide.addImage({ data: imgData, x: 0, y: 0, w: slideW, h: Math.min(slideH, 7.5) });
    }
    await pptx.writeFile({ fileName: 'Presentation.pptx' });
    showToast('اتحمل ملف الـ PowerPoint');
  }catch(err){ console.error(err); showToast('حصل خطأ أثناء التحويل','error'); }
  hideLoad();
};
        const percentageCalcBtn = document.getElementById('percentage-calc-btn');

        if (percentageCalcBtn) {
            percentageCalcBtn.addEventListener('click', function () {
                const score = parseFloat(document.getElementById('percentage-score').value);
                const total = parseFloat(document.getElementById('percentage-total').value);

                if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0 || score < 0 || score > total) {
                    showToast('اكتب درجتك والمجموع الكلي بشكل صحيح الأول.', 'error');
                    return;
                }

                const percentage = (score / total) * 100;
                const roundedPercentage = Math.round(percentage * 100) / 100;

                const resultBox = document.getElementById('percentage-result');
                const valueEl = document.getElementById('percentage-value');
                const messageEl = document.getElementById('percentage-message');
                const adviceEl = document.getElementById('percentage-advice');
                const whatsappEl = document.getElementById('percentage-whatsapp');

                resultBox.classList.remove('hidden');
                valueEl.textContent = `${roundedPercentage}%`;
                adviceEl.classList.add('hidden');
                whatsappEl.classList.add('hidden');

                if (percentage >= 80) {
                    messageEl.textContent = 'مبرووووك! 🔥👏 نتيجة ممتازة جدًا، كمل بنفس القوة وربنا يوفقك أكتر وأكتر.';
                } else if (percentage >= 70) {
                    messageEl.textContent = 'مبرووووك 👏❤️ نتيجة حلوة جدًا، وعندك فرصة تطلع أعلى كمان المرة الجاية.';
                } else {
                    messageEl.textContent = 'متزعلش من النتيجة ❤️';
                    adviceEl.textContent = 'النتيجة دي مش النهاية خالص، ومش بتحدد مستواك ولا مستقبلك. المهم تعرف إيه اللي وقع منك وتبدأ تصلحه من دلوقتي. الفترة الجاية دوس على نفسك شوية، نظّم وقتك، راجع أخطاءك، ومتسيبش التراكم يكبر. حتى لو البداية مش أحسن حاجة، تقدر تغيّر النتيجة الجاية بالمجهود اللي هتعمله من النهارده. خليك ثابت ومتستسلمش، وربنا يوفقك ويكتبلك الخير في اللي جاي. ولو احتجت أي حاجة أو وقفت معاك حاجة، ابعتلي.';
                    adviceEl.classList.remove('hidden');

                    whatsappEl.href = `https://wa.me/${SUMMARIES_ADMIN_WHATSAPP}?text=${encodeURIComponent('محتاج مساعدة في المذاكرة من أداة احسبلي كام % في Eto.Edu')}`;
                    whatsappEl.classList.remove('hidden');
                }
            });
        }
