/* ===== ملخصات الطلاب + الامتحانات + تقييم ===== */
const SUMMARIES_ADMIN_WHATSAPP = '201096925903';
const SUMMARIES_DATA_URL = 'Data/summaries.json';
const EXAMS_DATA_URL = 'Data/exams.json';
const SCIENCE_DATA_URL = 'Data/college-science.json';
const SUMMARIES_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAvehyyCZVacKFZAg3lGRY3NZ7cAz7FWfU",
  authDomain: "eto-edu.firebaseapp.com",
  databaseURL: "https://eto-edu-default-rtdb.firebaseio.com",
  projectId: "eto-edu",
  storageBucket: "eto-edu.firebasestorage.app",
  messagingSenderId: "144894599719",
  appId: "1:144894599719:web:7a49f0710c0afd9a7e6402"
};
const SUMMARY_YEARS = [
  'الصف الأول الابتدائي','الصف الثاني الابتدائي','الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي','الصف الخامس الابتدائي','الصف السادس الابتدائي',
  'الصف الأول الإعدادي','الصف الثاني الإعدادي','الصف الثالث الإعدادي',
  'الصف الأول الثانوي','الصف الثاني الثانوي','الصف الثالث الثانوي',
  'الأولى بكالوريا','الثانية بكالوريا','الثالثة بكالوريا'
];
const SUMMARY_GROUPS = SUMMARY_YEARS.flatMap(year => [
  {year, track:'عام'},
  {year, track:'لغات'}
]);
let sumCurrentGroup={year:'الكل',track:'الكل'}, sumSearchQuery='', sumAllApproved=[], sumRatingsCache={}, sumFirebaseDB=null;
let examCurrentGroup={year:'الكل',track:'الكل'}, examSearchQuery='', examAllApproved=[], examRatingsCache={};
function isPdfUrl(url){return /\.pdf(\?|#|$)/i.test(url||'');}
function sumFormatDate(iso){if(!iso)return '';try{const d=new Date(iso);if(isNaN(d))return '';return d.toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric'});}catch(e){return '';}}
function sumRatingKey(it){const raw=it.url||(it.year+'|'+it.subject+'|'+(it.lesson||it.exam||''));return raw.replace(/[.#$\[\]\/:]/g,'_');}
function examRatingKey(it){const raw='exam|'+(it.url||(it.year+'|'+it.subject+'|'+(it.exam||it.lesson||'')));return raw.replace(/[.#$\[\]\/:]/g,'_');}
function examRatingDisplay(it){const r=examRatingsCache[examRatingKey(it)];if(!r||!r.count)return '<span class="text-[10px] text-gray-300">لسه مفيش تقييم</span>';const avg=r.sum/r.count;let stars='';for(let i=1;i<=5;i++)stars+=`<i class="fa-solid fa-star text-[11px] ${i<=Math.round(avg)?'text-amber-400':'text-gray-200'}"></i>`;return `<span class="flex items-center gap-1">${stars}<span class="text-[10px] text-gray-400 mr-1">(${r.count})</span></span>`;}
function examSubmitRating(it,value){const key=examRatingKey(it);localStorage.setItem('examRated:'+key,'1');if(sumFirebaseDB){try{const ref=sumFirebaseDB.ref('ratings/'+key);ref.transaction(cur=>{cur=cur||{sum:0,count:0};cur.sum+=value;cur.count+=1;return cur;}).then(result=>{examRatingsCache[key]=result.snapshot.val();renderExamsList();});}catch(err){console.error(err);}}else{const cur=examRatingsCache[key]||{sum:0,count:0};cur.sum+=value;cur.count+=1;examRatingsCache[key]=cur;renderExamsList();}}
function examMaybePromptRate(it){if(localStorage.getItem('examRated:'+examRatingKey(it)))return;setTimeout(()=>{const modal=document.getElementById('summary-rate-modal'),starsWrap=document.getElementById('summary-rate-stars');if(!modal||!starsWrap)return;starsWrap.innerHTML='';for(let i=1;i<=5;i++){const b=document.createElement('button');b.type='button';b.className='text-gray-300 hover:text-amber-400 transition';b.innerHTML='<i class="fa-solid fa-star"></i>';b.onclick=()=>{examSubmitRating(it,i);modal.classList.add('hidden');modal.classList.remove('flex');showToast('شكرًا لتقييمك! 🌟');};starsWrap.appendChild(b);}modal.classList.remove('hidden');modal.classList.add('flex');},1200);}
function sumInitFirebase(){
  if(!SUMMARIES_FIREBASE_CONFIG||sumFirebaseDB)return;
  const s1=document.createElement('script');s1.src='https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
  s1.onload=()=>{const s2=document.createElement('script');s2.src='https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js';s2.onload=()=>{try{firebase.initializeApp(SUMMARIES_FIREBASE_CONFIG);sumFirebaseDB=firebase.database();sumLoadAllRatings();}catch(err){console.error(err);}};document.head.appendChild(s2);};
  document.head.appendChild(s1);
}
async function sumLoadAllRatings(){if(!sumFirebaseDB)return;try{const snap=await sumFirebaseDB.ref('ratings').once('value');sumRatingsCache=snap.val()||{};renderSummariesList();}catch(err){console.error(err);}}
async function sumSubmitRating(it,value){const key=sumRatingKey(it);localStorage.setItem('sumRated:'+key,'1');if(sumFirebaseDB){try{const ref=sumFirebaseDB.ref('ratings/'+key);const result=await ref.transaction(cur=>{cur=cur||{sum:0,count:0};cur.sum+=value;cur.count+=1;return cur;});sumRatingsCache[key]=result.snapshot.val();}catch(err){console.error(err);}}else{const cur=sumRatingsCache[key]||{sum:0,count:0};cur.sum+=value;cur.count+=1;sumRatingsCache[key]=cur;}renderSummariesList();}
function sumRatingDisplay(it){const r=sumRatingsCache[sumRatingKey(it)];if(!r||!r.count)return '<span class="text-[10px] text-gray-300">لسه مفيش تقييم</span>';const avg=r.sum/r.count;let stars='';for(let i=1;i<=5;i++)stars+=`<i class="fa-solid fa-star text-[11px] ${i<=Math.round(avg)?'text-amber-400':'text-gray-200'}"></i>`;return `<span class="flex items-center gap-1">${stars}<span class="text-[10px] text-gray-400 mr-1">(${r.count})</span></span>`;}
function sumMaybePromptRate(it){if(localStorage.getItem('sumRated:'+sumRatingKey(it)))return;setTimeout(()=>sumOpenRateModal(it),1200);}
function sumOpenRateModal(it){const modal=document.getElementById('summary-rate-modal'),starsWrap=document.getElementById('summary-rate-stars');if(!modal||!starsWrap)return;starsWrap.innerHTML='';for(let i=1;i<=5;i++){const b=document.createElement('button');b.type='button';b.className='text-gray-300 hover:text-amber-400 transition';b.innerHTML='<i class="fa-solid fa-star"></i>';b.onclick=()=>{sumSubmitRating(it,i);modal.classList.add('hidden');modal.classList.remove('flex');showToast('شكرًا لتقييمك! 🌟');};starsWrap.appendChild(b);}modal.classList.remove('hidden');modal.classList.add('flex');}
function sumCloseRateModal(){const modal=document.getElementById('summary-rate-modal');if(!modal)return;modal.classList.add('hidden');modal.classList.remove('flex');}
function gradeIcon(track){return track==='لغات'?'fa-solid fa-language':'fa-solid fa-school';}
function buildGradeFilters(selectId,current,onChoose){
  const sel=document.getElementById(selectId);
  if(!sel)return;
  sel.innerHTML='';
  const all=document.createElement('option');
  all.value='__all__';
  all.textContent='كل الملفات — كل الصفوف / عام + لغات';
  sel.appendChild(all);
  SUMMARY_GROUPS.forEach(g=>{
    const opt=document.createElement('option');
    opt.value=g.year+'||'+g.track;
    opt.textContent=g.year+' — '+g.track;
    sel.appendChild(opt);
  });
  const currentValue=current.year==='الكل'?'__all__':current.year+'||'+current.track;
  sel.value=currentValue;
  sel.onchange=()=>{
    if(sel.value==='__all__'){onChoose({year:'الكل',track:'الكل'});return;}
    const parts=sel.value.split('||');
    onChoose({year:parts[0],track:parts[1]});
  };
  syncGradeKeyboard(selectId,current);
}
function syncStageDatalist(){
  const list=document.getElementById('education-stage-list');
  if(!list)return;
  list.innerHTML='';
  const values=SUMMARY_GROUPS.map(g=>g.year+' — '+g.track);
  values.forEach(v=>{const o=document.createElement('option');o.value=v;list.appendChild(o);});
}
function normalizeStageText(v){return (v||'').replace(/\s+/g,' ').trim().toLowerCase().replace(/^اولى|^اول/,'الأولى').replace(/^ثانية|^تانية|^ثانى/,'الثانية').replace(/^ثالثة|^تالتة|^ثالث/,'الثالثة');}
function applyKeyboardStage(inputId,selectId,current){
  const input=document.getElementById(inputId),sel=document.getElementById(selectId);
  if(!input||!sel)return;
  input.value=current.year==='الكل'?'':(current.year+' — '+current.track);
  const chooseFromText=()=>{
    const typed=normalizeStageText(input.value);
    if(!typed){
      sel.value='__all__';
      sel.dispatchEvent(new Event('change'));
      return;
    }
    const options=[...sel.options];
    const exact=options.find(o=>normalizeStageText(o.textContent)===typed);
    if(exact){
      sel.value=exact.value;
      sel.dispatchEvent(new Event('change'));
      return;
    }
    const close=options.filter(o=>o.value!=='__all__').find(o=>normalizeStageText(o.textContent).startsWith(typed));
    if(close){
      input.value=close.textContent;
      sel.value=close.value;
      sel.dispatchEvent(new Event('change'));
    }
  };
  input.oninput=()=>{
    const typed=normalizeStageText(input.value);
    if(!typed)return;
    const exact=[...sel.options].find(o=>normalizeStageText(o.textContent)===typed);
    if(exact){
      sel.value=exact.value;
      sel.dispatchEvent(new Event('change'));
    }
  };
  input.onkeydown=(e)=>{
    if(e.key==='Enter'){e.preventDefault();chooseFromText();}
  };
  input.onblur=()=>{if(input.value.trim())chooseFromText();};
}
function syncGradeKeyboard(selectId,current){
  if(selectId==='summaries-grade-select')applyKeyboardStage('summaries-grade-keyboard',selectId,current);
  if(selectId==='exams-grade-select')applyKeyboardStage('exams-grade-keyboard',selectId,current);
}
function renderSummaryGradeFilters(){buildGradeFilters('summaries-grade-select',sumCurrentGroup,g=>{sumCurrentGroup=g;renderSummaryGradeFilters();renderSummariesList();});}
function renderExamGradeFilters(){buildGradeFilters('exams-grade-select',examCurrentGroup,g=>{examCurrentGroup=g;renderExamGradeFilters();renderExamsList();});}
function summaryFilteredItems(){const q=sumSearchQuery.trim().toLowerCase();return sumAllApproved.filter(it=>{if(sumCurrentGroup.year!=='الكل'&&(it.year!==sumCurrentGroup.year||(it.track||'عام')!==sumCurrentGroup.track))return false;if(q&&!((it.subject||'').toLowerCase().includes(q)||(it.lesson||'').toLowerCase().includes(q)||(it.title||'').toLowerCase().includes(q)))return false;return true;});}
function renderSummariesList(){const listEl=document.getElementById('summaries-list'),emptyEl=document.getElementById('summaries-empty');if(!listEl)return;const items=summaryFilteredItems();const counter=document.getElementById('summary-visible-count');if(counter)counter.textContent=items.length;listEl.innerHTML='';if(emptyEl)emptyEl.classList.toggle('hidden',items.length>0);items.forEach(it=>{const card=document.createElement('div');card.className='summary-card';const canPreview=isPdfUrl(it.url)||!!it.driveUrl;const dateStr=sumFormatDate(it.date);const cover=it.image?`<div class="summary-card-cover"><img src="${escapeHtml(it.image)}" loading="lazy" alt=""><span class="summary-card-track">${escapeHtml(it.track||'عام')}</span></div>`:`<div class="summary-card-cover"><div class="w-full h-full flex items-center justify-center text-white text-4xl"><i class="fa-solid fa-file-lines"></i></div><span class="summary-card-track">${escapeHtml(it.track||'عام')}</span></div>`;card.innerHTML=`${cover}<div class="summary-card-body"><div class="summary-card-title">${escapeHtml(it.lesson||it.title||'ملخص بدون اسم')}</div><div class="summary-card-meta"><i class="fa-solid fa-book"></i>${escapeHtml(it.subject||'غير محدد')}</div><div class="summary-card-meta"><i class="fa-solid fa-graduation-cap"></i>${escapeHtml(it.year||'')}</div><div class="summary-card-rating" data-rating-row><div data-rating></div>${dateStr?`<span class="text-[10px] text-gray-400 shrink-0"><i class="fa-solid fa-calendar-day"></i> ${escapeHtml(dateStr)}</span>`:''}</div><div class="summary-card-actions">${canPreview?'<button data-act="preview" class="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition"><i class="fa-solid fa-eye"></i> معاينة</button>':''}<a href="${escapeHtml(it.url||it.driveUrl||'#')}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition"><i class="fa-solid fa-download"></i> تحميل</a></div></div>`;const ratingEl=card.querySelector('[data-rating]');if(ratingEl)ratingEl.innerHTML=sumRatingDisplay(it);const pBtn=card.querySelector('[data-act="preview"]');if(pBtn)pBtn.onclick=()=>openSummaryPreview(it);const dBtn=card.querySelector('a');if(dBtn)dBtn.addEventListener('click',()=>sumMaybePromptRate(it));listEl.appendChild(card);});}
async function fetchApprovedSummaries(){const loadingEl=document.getElementById('summaries-loading');if(loadingEl)loadingEl.classList.remove('hidden');try{const res=await fetch(SUMMARIES_DATA_URL,{cache:'no-store'});if(res.status===404){sumAllApproved=[];renderSummariesList();return;}if(!res.ok)throw new Error('bad status '+res.status);const data=await res.json();sumAllApproved=Array.isArray(data)?data:(data.items||[]);renderSummariesList();sumLoadAllRatings();}catch(err){console.error(err);showToast('مشكلة في جلب الملخصات، حاول تاني لاحقاً','error');}finally{if(loadingEl)loadingEl.classList.add('hidden');}}
function openSummaryAddModal(){const m=document.getElementById('summary-add-modal');if(!m)return;m.classList.remove('hidden');m.classList.add('flex');}
function closeSummaryAddModal(){const m=document.getElementById('summary-add-modal');if(!m)return;m.classList.add('hidden');m.classList.remove('flex');}
function submitSummary(){const name=document.getElementById('sum-name').value.trim(),phone=document.getElementById('sum-phone').value.trim(),year=document.getElementById('sum-year').value,track=document.getElementById('sum-track').value,subject=document.getElementById('sum-subject').value.trim(),lesson=document.getElementById('sum-lesson').value.trim(),terms=document.getElementById('sum-terms').checked;if(!name||!phone||!subject||!lesson){showToast('من فضلك املأ كل البيانات الأول','error');return;}if(!terms){showToast('لازم توافق على الشروط الأول','error');return;}if(!SUMMARIES_ADMIN_WHATSAPP||SUMMARIES_ADMIN_WHATSAPP.includes('000000')){showToast('لسه محطتش رقم الواتساب في الكود (SUMMARIES_ADMIN_WHATSAPP)','error');return;}const msg=`ملخص جديد لمراجعته:\nالاسم: ${name}\nالموبايل: ${phone}\nالمرحلة: ${year}\nنوع الدراسة: ${track}\nالمادة: ${subject}\nالدرس/الملخص: ${lesson}\n\n(هبعت الملف في نفس المحادثة دلوقتي)`;window.open(`https://wa.me/${SUMMARIES_ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank');showToast('افتحلك واتساب، ابعت الرسالة وارفق الملف 📎');closeSummaryAddModal();}
let sumPreviewPdfDoc=null,sumPreviewPageNum=1;
function sumToDriveEmbedUrl(url){const m=(url||'').match(/[-\w]{20,}/);return m?`https://drive.google.com/file/d/${m[0]}/preview`:url;}
async function openSummaryPreview(it){const modal=document.getElementById('summary-preview-modal');if(!modal)return;const canvas=document.getElementById('summary-preview-canvas'),iframe=document.getElementById('summary-preview-iframe'),nav=document.getElementById('summary-preview-nav'),loadingEl=document.getElementById('summary-preview-loading');modal.classList.remove('hidden');modal.classList.add('flex');document.getElementById('summary-preview-title').textContent=it.lesson||it.exam||it.title||it.subject||'معاينة';document.getElementById('summary-preview-download').href=it.url||it.driveUrl||'#';document.getElementById('summary-preview-page').textContent='-- / --';sumPreviewPdfDoc=null;sumPreviewPageNum=1;if(it.driveUrl){canvas.classList.add('hidden');nav.classList.add('hidden');iframe.classList.remove('hidden');loadingEl.classList.remove('hidden');iframe.onload=()=>loadingEl.classList.add('hidden');iframe.src=sumToDriveEmbedUrl(it.driveUrl);return;}iframe.classList.add('hidden');iframe.src='about:blank';canvas.classList.remove('hidden');nav.classList.remove('hidden');loadingEl.classList.remove('hidden');try{const res=await fetch(it.url,{cache:'no-store'});if(!res.ok)throw new Error('bad status '+res.status);const buf=await res.arrayBuffer();sumPreviewPdfDoc=await pdfjsLib.getDocument({data:buf}).promise;await sumRenderPreviewPage();}catch(err){console.error(err);showToast('اتعذرت معاينة الملف من هنا، ضيف رابط جوجل درايف من لوحة التحكم أو حمّله مباشرة','error');closeSummaryPreview();}finally{loadingEl.classList.add('hidden');}}
async function sumRenderPreviewPage(){if(!sumPreviewPdfDoc)return;const page=await sumPreviewPdfDoc.getPage(sumPreviewPageNum),canvas=document.getElementById('summary-preview-canvas'),bodyEl=document.getElementById('summary-preview-body'),baseVp=page.getViewport({scale:1}),scale=Math.min((bodyEl.clientWidth-20)/baseVp.width,(bodyEl.clientHeight-20)/baseVp.height,2),vp=page.getViewport({scale:scale>0?scale:1});canvas.width=vp.width;canvas.height=vp.height;await page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;document.getElementById('summary-preview-page').textContent=sumPreviewPageNum+' / '+sumPreviewPdfDoc.numPages;}
function closeSummaryPreview(){const modal=document.getElementById('summary-preview-modal');if(!modal)return;modal.classList.add('hidden');modal.classList.remove('flex');sumPreviewPdfDoc=null;const iframe=document.getElementById('summary-preview-iframe');if(iframe)iframe.src='about:blank';}
function renderExamsList(){const listEl=document.getElementById('exams-list'),emptyEl=document.getElementById('exams-empty');if(!listEl)return;const q=examSearchQuery.trim().toLowerCase(),items=examAllApproved.filter(it=>{if(examCurrentGroup.year!=='الكل'&&(it.year!==examCurrentGroup.year||(it.track||'عام')!==examCurrentGroup.track))return false;if(q&&!((it.subject||'').toLowerCase().includes(q)||(it.exam||it.lesson||it.title||'').toLowerCase().includes(q)))return false;return true;});listEl.innerHTML='';if(emptyEl)emptyEl.classList.toggle('hidden',items.length>0);items.forEach(it=>{const card=document.createElement('div');card.className='summary-card';const cover=it.image?`<div class="summary-card-cover"><img src="${escapeHtml(it.image)}" loading="lazy" alt=""><span class="summary-card-track">${escapeHtml(it.track||'عام')}</span></div>`:`<div class="summary-card-cover"><div class="w-full h-full flex items-center justify-center text-white text-4xl"><i class="fa-solid fa-book-open"></i></div><span class="summary-card-track">${escapeHtml(it.track||'عام')}</span></div>`;const canPreview=isPdfUrl(it.url)||!!it.driveUrl;card.innerHTML=`${cover}<div class="summary-card-body"><div class="summary-card-title">${escapeHtml(it.exam||it.lesson||it.title||'امتحان بدون اسم')}</div><div class="summary-card-meta"><i class="fa-solid fa-book"></i>${escapeHtml(it.subject||'غير محدد')}</div><div class="summary-card-meta"><i class="fa-solid fa-graduation-cap"></i>${escapeHtml(it.year||'')}</div><div class="summary-card-rating">${examRatingDisplay(it)}</div><div class="summary-card-actions">${canPreview?'<button data-act="preview" class="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition"><i class="fa-solid fa-eye"></i> معاينة</button>':''}<a href="${escapeHtml(it.url||it.driveUrl||'#')}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition"><i class="fa-solid fa-download"></i> تحميل</a></div></div>`;const pBtn=card.querySelector('[data-act="preview"]');if(pBtn)pBtn.onclick=()=>openSummaryPreview(it);const dBtn=card.querySelector('a');if(dBtn)dBtn.addEventListener('click',()=>examMaybePromptRate(it));listEl.appendChild(card);});}
async function fetchApprovedExams(){const loadingEl=document.getElementById('exams-loading');if(loadingEl)loadingEl.classList.remove('hidden');try{const res=await fetch(EXAMS_DATA_URL,{cache:'no-store'});if(res.status===404){examAllApproved=[];renderExamsList();return;}if(!res.ok)throw new Error('bad status '+res.status);const data=await res.json();examAllApproved=Array.isArray(data)?data:(data.items||[]);renderExamsList();}catch(err){console.error(err);showToast('مشكلة في جلب الامتحانات، تأكد من Data/exams.json','error');}finally{if(loadingEl)loadingEl.classList.add('hidden');}}
function wireSummaries(){sumInitFirebase();syncStageDatalist();renderSummaryGradeFilters();fetchApprovedSummaries();const btn=document.getElementById('sum-submit-btn');if(btn)btn.addEventListener('click',submitSummary);const rateSkip=document.getElementById('summary-rate-skip');if(rateSkip)rateSkip.addEventListener('click',sumCloseRateModal);const rateModal=document.getElementById('summary-rate-modal');if(rateModal)rateModal.addEventListener('click',e=>{if(e.target===rateModal)sumCloseRateModal();});const openBtn=document.getElementById('summaries-open-add-btn');if(openBtn)openBtn.addEventListener('click',openSummaryAddModal);const closeBtn=document.getElementById('summary-add-close-btn');if(closeBtn)closeBtn.addEventListener('click',closeSummaryAddModal);const addModal=document.getElementById('summary-add-modal');if(addModal)addModal.addEventListener('click',e=>{if(e.target===addModal)closeSummaryAddModal();});const searchInput=document.getElementById('summaries-search');if(searchInput)searchInput.addEventListener('input',()=>{sumSearchQuery=searchInput.value;renderSummariesList();});const pClose=document.getElementById('summary-preview-close-btn');if(pClose)pClose.addEventListener('click',closeSummaryPreview);const pModal=document.getElementById('summary-preview-modal');if(pModal)pModal.addEventListener('click',e=>{if(e.target===pModal)closeSummaryPreview();});const pPrev=document.getElementById('summary-preview-prev');if(pPrev)pPrev.addEventListener('click',()=>{if(sumPreviewPdfDoc&&sumPreviewPageNum>1){sumPreviewPageNum--;sumRenderPreviewPage();}});const pNext=document.getElementById('summary-preview-next');if(pNext)pNext.addEventListener('click',()=>{if(sumPreviewPdfDoc&&sumPreviewPageNum<sumPreviewPdfDoc.numPages){sumPreviewPageNum++;sumRenderPreviewPage();}});}
function wireExams(){syncStageDatalist();renderExamGradeFilters();fetchApprovedExams();sumInitFirebase();const searchInput=document.getElementById('exams-search');if(searchInput)searchInput.addEventListener('input',()=>{examSearchQuery=searchInput.value;renderExamsList();});}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',wireSummaries);document.addEventListener('DOMContentLoaded',wireExams);}else{wireSummaries();wireExams();}
