let scheduleDays=['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
let scheduleTimes=['7:00 - 9:00','9:30 - 11:30','12:00 - 2:00','4:00 - 6:00','7:00 - 9:00'];
const scheduleBaseThemes=[
{id:'indigo',label:'أزرق هادئ',accent:'#4f46e5'},{id:'emerald',label:'أخضر مذاكرة',accent:'#059669'},{id:'rose',label:'وردي هادئ',accent:'#e11d48'},{id:'slate',label:'رمادي بسيط',accent:'#334155'},{id:'royalblue',label:'أزرق ملكي',accent:'#2563eb'},{id:'skyblue',label:'أزرق سماوي',accent:'#0ea5e9'},{id:'petrol',label:'أزرق بترولي',accent:'#0891b2'},{id:'turquoise',label:'تركواز',accent:'#06b6d4'},{id:'mint',label:'أخضر نعناع',accent:'#10b981'},{id:'forest',label:'أخضر غابة',accent:'#16a34a'},
{id:'lime',label:'أخضر ليموني',accent:'#65a30d'},{id:'mustard',label:'أصفر خردل',accent:'#ca8a04'},{id:'gold',label:'أصفر ذهبي',accent:'#eab308'},{id:'orange',label:'برتقالي دافئ',accent:'#f97316'},{id:'burnt',label:'برتقالي محروق',accent:'#ea580c'},{id:'tomato',label:'أحمر طماطم',accent:'#dc2626'},{id:'red',label:'أحمر كلاسيكي',accent:'#ef4444'},{id:'pink',label:'وردي فاتح',accent:'#ec4899'},{id:'fuchsia',label:'وردي فوشيا',accent:'#db2777'},{id:'violet',label:'بنفسجي ملكي',accent:'#7c3aed'},
{id:'purple',label:'بنفسجي فاتح',accent:'#8b5cf6'},{id:'nile',label:'نيلي',accent:'#4338ca'},{id:'navy',label:'كحلي',accent:'#1e3a8a'},{id:'graphite',label:'رمادي أنيق',accent:'#1f2937'},{id:'silver',label:'رمادي فضي',accent:'#64748b'},{id:'blackclassic',label:'أسود كلاسيك',accent:'#0f172a'},{id:'coffee',label:'بني قهوة',accent:'#92400e'},{id:'lightbrown',label:'بني فاتح',accent:'#b45309'},{id:'chestnut',label:'كستنائي',accent:'#78350f'},{id:'olive',label:'زيتوني',accent:'#4d7c0f'},
{id:'darkgreen',label:'أخضر داكن',accent:'#166534'},{id:'seagreen',label:'أخضر بحري',accent:'#0d9488'},{id:'lightsky',label:'سماوي فاتح',accent:'#38bdf8'},{id:'steelblue',label:'أزرق فولاذي',accent:'#1d4ed8'},{id:'midnight',label:'أزرق منتصف الليل',accent:'#0b1220'},{id:'pastelpink',label:'وردي باستيل',accent:'#f472b6'},{id:'peach',label:'خوخي',accent:'#fb923c'},{id:'cherry',label:'كرزي',accent:'#be123c'},{id:'maroon',label:'عنابي',accent:'#9f1239'},{id:'mauve',label:'موف',accent:'#a855f7'},
{id:'lavender',label:'لافندر',accent:'#c084fc'},{id:'ruby',label:'ياقوتي',accent:'#9d174d'},{id:'coral',label:'مرجاني',accent:'#f43f5e'},{id:'aqua',label:'فيروزي',accent:'#2dd4bf'},{id:'seafoam',label:'أخضر مائي',accent:'#34d399'},{id:'neonyellow',label:'أصفر نيون',accent:'#facc15'},{id:'amber',label:'كهرماني',accent:'#f59e0b'},{id:'bronze',label:'برونزي',accent:'#a16207'},{id:'bluegray',label:'رمادي أزرق',accent:'#475569'},{id:'denim',label:'أزرق جينز',accent:'#3b82f6'}
];
function scheduleTintHex(hex,amount){const h=hex.replace('#','');const r=parseInt(h.substring(0,2),16),g=parseInt(h.substring(2,4),16),b=parseInt(h.substring(4,6),16);const nr=Math.round(r+(255-r)*amount),ng=Math.round(g+(255-g)*amount),nb=Math.round(b+(255-b)*amount);return '#'+[nr,ng,nb].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('');}
const scheduleThemeMap={};scheduleBaseThemes.forEach(t=>{scheduleThemeMap[t.id]={head:scheduleTintHex(t.accent,.88),accent:t.accent};});
function scheduleMixHex(hex,target,amount){const h=hex.replace('#',''),t=target.replace('#','');const r=parseInt(h.substring(0,2),16),g=parseInt(h.substring(2,4),16),b=parseInt(h.substring(4,6),16);const tr=parseInt(t.substring(0,2),16),tg=parseInt(t.substring(2,4),16),tb=parseInt(t.substring(4,6),16);const nr=Math.round(r+(tr-r)*amount),ng=Math.round(g+(tg-g)*amount),nb=Math.round(b+(tb-b)*amount);return '#'+[nr,ng,nb].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('');}
function scheduleComputePalette(theme,isDark){return{accent:theme.accent,headBg:isDark?scheduleMixHex(theme.accent,'#0f172a',.78):theme.head,headText:isDark?'#f8fafc':scheduleMixHex(theme.accent,'#000000',.45),timeBg:isDark?scheduleMixHex(theme.accent,'#0f172a',.88):scheduleTintHex(theme.accent,.94),timeText:isDark?scheduleTintHex(theme.accent,.55):scheduleMixHex(theme.accent,'#000000',.2),slotBorder:isDark?scheduleMixHex(theme.accent,'#0f172a',.55):scheduleTintHex(theme.accent,.78),headBorder:isDark?scheduleMixHex(theme.accent,'#0f172a',.4):scheduleTintHex(theme.accent,.55)};}
function applySchedulePaletteToNode(node,pal){node.querySelectorAll('.schedule-head').forEach(el=>{el.style.background=pal.headBg;el.style.color=pal.headText;el.style.borderColor=pal.headBorder;});node.querySelectorAll('.schedule-time').forEach(el=>{el.style.background=pal.timeBg;el.style.color=pal.timeText;el.style.borderColor=pal.slotBorder;});node.querySelectorAll('.schedule-slot').forEach(el=>{el.style.borderColor=pal.slotBorder;});node.style.borderTopColor=pal.accent;node.style.borderLeftColor=pal.accent;node.style.borderTopWidth='2px';node.style.borderLeftWidth='2px';}
function populateScheduleThemeSelect(){const sel=document.getElementById('schedule-theme');if(!sel||sel.dataset.filled)return;sel.dataset.filled='1';scheduleBaseThemes.forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.label;sel.appendChild(o);});const c=document.createElement('option');c.value='custom';c.textContent='🎨 لون مخصص';sel.appendChild(c);}
function toggleScheduleCustomColors(){const sel=document.getElementById('schedule-theme')?.value;document.getElementById('schedule-custom-colors')?.classList.toggle('show',sel==='custom');}
function getActiveScheduleTheme(){const sel=document.getElementById('schedule-theme')?.value||'indigo';if(sel==='custom'){const accent=document.getElementById('schedule-custom-accent')?.value||'#4f46e5';const head=document.getElementById('schedule-custom-head')?.value||scheduleTintHex(accent,.88);return{head,accent};}return scheduleThemeMap[sel]||scheduleThemeMap.indigo;}
function ensureScheduleData(){if(!window.scheduleData)window.scheduleData=scheduleTimes.map(()=>scheduleDays.map(()=>''));}
function renderSchedule(){const board=document.getElementById('schedule-preview-sheet');if(!board)return; ensureScheduleData(); const title=document.getElementById('schedule-title')?.value||'خطة مذاكرتي الأسبوعية'; const range=document.getElementById('schedule-range')?.value||''; const theme=getActiveScheduleTheme(); const isDark=document.body.classList.contains('dark'); const pal=scheduleComputePalette(theme,isDark); board.innerHTML='';
  const frag=document.createDocumentFragment();
  const corner=document.createElement('div');corner.className='schedule-cell schedule-head';corner.textContent=title;corner.style.gridColumn='1';corner.style.background=pal.headBg;corner.style.color=pal.headText;corner.style.borderColor=pal.headBorder;frag.appendChild(corner);
  scheduleDays.forEach((d,c)=>{const el=document.createElement('div');el.className='schedule-cell schedule-head';el.style.background=pal.headBg;el.style.color=pal.headText;el.style.borderColor=pal.headBorder;
    const inp=document.createElement('input');inp.className='schedule-head-input';inp.value=d;inp.dataset.c=c;inp.title='اضغط لتغيير اسم اليوم';
    inp.addEventListener('input',e=>{scheduleDays[c]=e.target.value;});
    el.appendChild(inp);frag.appendChild(el);});
  scheduleTimes.forEach((time,r)=>{const tm=document.createElement('div');tm.className='schedule-cell schedule-time';tm.style.background=pal.timeBg;tm.style.color=pal.timeText;tm.style.borderColor=pal.slotBorder;
    const timeInp=document.createElement('input');timeInp.className='schedule-time-input';timeInp.value=time;timeInp.dataset.r=r;timeInp.title='اضغط لتغيير الميعاد';
    timeInp.addEventListener('input',e=>{scheduleTimes[r]=e.target.value;});
    const delBtn=document.createElement('span');delBtn.className='schedule-time-del';delBtn.innerHTML='<i class="fa-solid fa-xmark"></i>';delBtn.title='حذف الموعد ده';
    delBtn.addEventListener('click',()=>removeScheduleRow(r));
    tm.appendChild(timeInp);tm.appendChild(delBtn);frag.appendChild(tm);
    scheduleDays.forEach((_,c)=>{const cell=document.createElement('div');cell.className='schedule-cell schedule-slot';cell.dataset.r=r;cell.dataset.c=c;cell.title='اضغط واكتب المادة والمطلوب في الخانة دي';cell.style.borderColor=pal.slotBorder;const ta=document.createElement('textarea');ta.className='schedule-editable';ta.placeholder='المادة • المطلوب';ta.value=window.scheduleData?.[r]?.[c]||'';ta.dataset.r=r;ta.dataset.c=c;ta.addEventListener('input',e=>{ensureScheduleData();window.scheduleData[r][c]=e.target.value;});cell.appendChild(ta);frag.appendChild(cell)})});board.appendChild(frag);
  board.style.setProperty('--schedule-accent',theme.accent); board.style.setProperty('--schedule-range',JSON.stringify(range));
  board.style.borderTopColor=theme.accent;board.style.borderLeftColor=theme.accent;board.style.borderTopWidth='2px';board.style.borderLeftWidth='2px';
  const wrap=board.closest('.schedule-board-wrap');if(wrap){wrap.style.boxShadow=`0 12px 30px -10px ${theme.accent}66`;wrap.style.borderColor=scheduleTintHex(theme.accent,.7);}
  requestAnimationFrame(fitScheduleZoom);
}
window.scheduleData=scheduleTimes.map(()=>scheduleDays.map(()=>''));
function addScheduleRow(){ensureScheduleData();scheduleTimes.push('00:00 - 00:00');window.scheduleData.push(scheduleDays.map(()=>''));renderSchedule();showToast('اتضاف موعد جديد، عدّل الوقت زي ما تحب');}
function removeScheduleRow(r){if(scheduleTimes.length<=1){showToast('لازم يفضل موعد واحد على الأقل في الجدول','error');return;}scheduleTimes.splice(r,1);window.scheduleData.splice(r,1);renderSchedule();}
function scheduleExample(){scheduleDays=['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];scheduleTimes=['7:00 - 9:00','9:30 - 11:30','12:00 - 2:00','4:00 - 6:00','7:00 - 9:00'];window.scheduleData=scheduleTimes.map(()=>scheduleDays.map(()=>''));window.scheduleData[0][0]='رياضيات\nمراجعة الدرس';window.scheduleData[1][1]='فيزياء\nحل 30 سؤال';window.scheduleData[2][2]='عربي\nالنحو';window.scheduleData[3][3]='كيمياء\nالفصل 2';window.scheduleData[4][4]='إنجليزي\nVocabulary';window.scheduleData[1][5]='مراجعة سريعة';window.scheduleData[3][6]='اختبار قصير';renderSchedule();}
function clearSchedule(){window.scheduleData=scheduleTimes.map(()=>scheduleDays.map(()=>''));renderSchedule();}
function collectScheduleState(){ensureScheduleData();return{type:'eto-schedule',version:2,title:document.getElementById('schedule-title')?.value||'',range:document.getElementById('schedule-range')?.value||'',theme:document.getElementById('schedule-theme')?.value||'indigo',customHead:document.getElementById('schedule-custom-head')?.value||'',customAccent:document.getElementById('schedule-custom-accent')?.value||'',goal:document.getElementById('schedule-goal')?.value||'',hours:document.getElementById('schedule-hours')?.value||'',days:scheduleDays,times:scheduleTimes,data:window.scheduleData};}
function applyScheduleState(state){
  if(!state||!Array.isArray(state.days)||!Array.isArray(state.times)||!Array.isArray(state.data)||!state.days.length||!state.times.length){showToast('الملف ده مش ملف جدول متعرف عليه','error');return false;}
  scheduleDays=state.days.slice();scheduleTimes=state.times.slice();
  window.scheduleData=scheduleTimes.map((_,r)=>scheduleDays.map((_,c)=>(state.data[r]&&typeof state.data[r][c]==='string')?state.data[r][c]:''));
  if(document.getElementById('schedule-title'))document.getElementById('schedule-title').value=state.title||'خطة مذاكرتي الأسبوعية';
  if(document.getElementById('schedule-range'))document.getElementById('schedule-range').value=state.range||'';
  if(document.getElementById('schedule-goal'))document.getElementById('schedule-goal').value=state.goal||'';
  if(document.getElementById('schedule-hours'))document.getElementById('schedule-hours').value=state.hours||'6';
  if(document.getElementById('schedule-custom-head')&&state.customHead)document.getElementById('schedule-custom-head').value=state.customHead;
  if(document.getElementById('schedule-custom-accent')&&state.customAccent)document.getElementById('schedule-custom-accent').value=state.customAccent;
  const themeSel=document.getElementById('schedule-theme');
  if(themeSel){populateScheduleThemeSelect();const wanted=state.theme||'indigo';themeSel.value=[...themeSel.options].some(o=>o.value===wanted)?wanted:'indigo';}
  toggleScheduleCustomColors();
  renderSchedule();
  return true;
}
function loadScheduleFile(file){
  if(!file)return;
  const isPdf=/\.pdf$/i.test(file.name)||file.type==='application/pdf';
  const reader=new FileReader();
  if(isPdf){
    reader.onload=e=>{try{
      const bytes=new Uint8Array(e.target.result);let binStr='';const chunk=0x8000;
      for(let i=0;i<bytes.length;i+=chunk){binStr+=String.fromCharCode.apply(null,bytes.subarray(i,i+chunk));}
      const startTag='%ETO-SCHEDULE-DATA-START%',endTag='%ETO-SCHEDULE-DATA-END%';
      const si=binStr.indexOf(startTag),ei=binStr.indexOf(endTag);
      if(si===-1||ei===-1||ei<=si){showToast('الملف ده PDF عادي مش متعمل من صفحة الجدول، مينفعش نفتحه للتعديل هنا','error');return;}
      const b64=binStr.substring(si+startTag.length,ei).trim();
      const jsonStr=decodeURIComponent(escape(atob(b64)));
      const state=JSON.parse(jsonStr);
      if(applyScheduleState(state))showToast('اتفتح الجدول من ملف الـPDF بنجاح، كمّل عليه زي ما تحب');
    }catch(err){console.error(err);showToast('مش قادر أقرأ بيانات الجدول من ملف الـPDF ده','error');}};
    reader.readAsArrayBuffer(file);
  }else{
    reader.onload=e=>{try{
      const state=JSON.parse(e.target.result);
      if(applyScheduleState(state))showToast('اتفتح الجدول بنجاح، كمّل عليه زي ما تحب');
    }catch(err){console.error(err);showToast('مش قادر أقرأ الملف ده، اتأكد إنه ملف جدول صحيح','error');}};
    reader.readAsText(file,'UTF-8');
  }
}
async function exportSchedulePDF(){const sheet=document.getElementById('schedule-preview-sheet');if(!sheet||!window.html2canvas||!window.jspdf){showToast('مكتبات الـPDF لسه محملتش','error');return;} try{showLoad('جاري تجهيز جدولك كـPDF...'); const wrapper=document.createElement('div');wrapper.className='schedule-print-preview'; const title=document.getElementById('schedule-title')?.value||'خطة مذاكرتي الأسبوعية'; const range=document.getElementById('schedule-range')?.value||''; const goal=document.getElementById('schedule-goal')?.value||''; const hours=document.getElementById('schedule-hours')?.value||''; wrapper.style.width='210mm'; wrapper.style.background='#fff'; wrapper.style.padding='10mm'; wrapper.style.fontFamily="'Cairo',Arial,sans-serif"; wrapper.innerHTML=`<div style="font-weight:900;font-size:7mm;text-align:center;margin-bottom:2mm">${escapeHtml(title)}</div><div style="display:flex;justify-content:space-between;gap:6mm;font-size:3mm;font-weight:800;color:#64748b;margin-bottom:4mm"><span>الفترة: ${escapeHtml(range||'________________')}</span><span>الساعات المستهدفة: ${escapeHtml(hours)}</span></div><div style="font-size:3.2mm;font-weight:800;border-bottom:.3mm solid #cbd5e1;padding-bottom:3mm;margin-bottom:4mm">الهدف: ${escapeHtml(goal||'______________________________________________')}</div>`; const clone=sheet.cloneNode(true); applySchedulePaletteToNode(clone,scheduleComputePalette(getActiveScheduleTheme(),false)); clone.querySelectorAll('.schedule-time-del').forEach(x=>x.remove()); clone.querySelectorAll('input.schedule-head-input, input.schedule-time-input').forEach(inp=>{const s=document.createElement('span');s.textContent=inp.value;s.style.fontWeight='900';s.style.textAlign='center';s.style.width='100%';s.style.display='block';s.style.fontFamily="'Cairo',Arial,sans-serif";inp.replaceWith(s)}); clone.querySelectorAll('textarea').forEach(t=>{const v=t.value;const d=document.createElement('div');d.style.whiteSpace='pre-wrap';d.style.fontFamily="'Cairo',Arial,sans-serif";d.style.fontSize='3mm';d.style.fontWeight='700';d.style.lineHeight='1.55';d.textContent=v;d.style.minHeight='64px';t.replaceWith(d)}); clone.style.minWidth='0';clone.style.width='100%';clone.style.gridTemplateColumns='18mm repeat(7,1fr)';clone.querySelectorAll('.schedule-cell').forEach(x=>x.style.minHeight='20mm');clone.querySelectorAll('.schedule-head').forEach(x=>x.style.minHeight='12mm');wrapper.appendChild(clone);const foot=document.createElement('div');foot.textContent='© 2026 Eto.Edu By ETO • جميع الحقوق محفوظة';foot.style.cssText='text-align:center;font-size:2.5mm;font-weight:900;color:#94a3b8;margin-top:3mm';wrapper.appendChild(foot);document.body.appendChild(wrapper);await (document.fonts?.ready||Promise.resolve());await new Promise(requestAnimationFrame);const canvas=await html2canvas(wrapper,{scale:2,useCORS:true,backgroundColor:'#fff',logging:false});const {jsPDF}=window.jspdf;const doc=new jsPDF('p','mm','a4');doc.addImage(canvas.toDataURL('image/png'),'PNG',0,0,210,297,undefined,'FAST');wrapper.remove();
  const pdfArrayBuffer=doc.output('arraybuffer');
  const state=collectScheduleState();
  const jsonStr=JSON.stringify(state);
  const b64=btoa(unescape(encodeURIComponent(jsonStr)));
  const marker='\n%ETO-SCHEDULE-DATA-START%\n'+b64+'\n%ETO-SCHEDULE-DATA-END%\n';
  const markerBytes=new TextEncoder().encode(marker);
  const pdfBytes=new Uint8Array(pdfArrayBuffer);
  const combined=new Uint8Array(pdfBytes.length+markerBytes.length);
  combined.set(pdfBytes,0);combined.set(markerBytes,pdfBytes.length);
  const blob=new Blob([combined],{type:'application/pdf'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=(title||'جدولي').replace(/[^\w\u0600-\u06FF -]/g,'').replace(/\s+/g,'-')+'.pdf';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  hideLoad();showToast('تم تحميل جدولك PDF، وارفعه تاني من هنا في أي وقت عشان تكمل التعديل عليه');}catch(e){console.error(e);hideLoad();showToast('حصلت مشكلة أثناء تصدير الجدول','error');}}
function printSchedule(){const sheet=document.getElementById('schedule-preview-sheet');if(!sheet)return; const w=window.open('','_blank','width=1200,height=900'); if(!w)return; const title=document.getElementById('schedule-title')?.value||'خطة مذاكرتي الأسبوعية'; const range=document.getElementById('schedule-range')?.value||''; const goal=document.getElementById('schedule-goal')?.value||''; const hrs=document.getElementById('schedule-hours')?.value||''; const clone=sheet.cloneNode(true);applySchedulePaletteToNode(clone,scheduleComputePalette(getActiveScheduleTheme(),false));clone.querySelectorAll('.schedule-time-del').forEach(x=>x.remove());clone.querySelectorAll('input.schedule-head-input, input.schedule-time-input').forEach(inp=>{const s=document.createElement('span');s.textContent=inp.value;s.style.fontWeight='900';s.style.textAlign='center';s.style.width='100%';s.style.display='block';inp.replaceWith(s)});clone.querySelectorAll('textarea').forEach(t=>{const d=document.createElement('div');d.textContent=t.value;d.style.whiteSpace='pre-wrap';d.style.fontFamily="'Cairo',Arial,sans-serif";d.style.fontWeight='700';d.style.fontSize='11px';d.style.lineHeight='1.6';d.style.minHeight='74px';t.replaceWith(d)}); w.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"><style>*{box-sizing:border-box}body{font-family:Cairo,Arial;margin:0;padding:12mm;color:#0f172a}.head{text-align:center;margin-bottom:8px}.head h1{font-size:25px;margin:0 0 5px}.meta{display:flex;justify-content:space-between;font-size:11px;font-weight:800;color:#64748b;margin-bottom:9px}.goal{font-size:11px;font-weight:800;padding-bottom:9px;border-bottom:1px solid #cbd5e1;margin-bottom:10px}.schedule-board{display:grid;grid-template-columns:18mm repeat(7,1fr);min-width:0!important;width:100%!important}.schedule-cell{min-height:78px!important;border-right:1px solid #cbd5e1;border-bottom:1px solid #cbd5e1;padding:2.5mm;position:relative;box-sizing:border-box}.schedule-head{min-height:48px!important;text-align:center;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center}.schedule-time{text-align:center;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center}.copyright{text-align:center;font-size:9px;font-weight:900;color:#94a3b8;margin-top:10px}@page{size:A4;margin:0}</style></head><body><div class="head"><h1>${escapeHtml(title)}</h1><div class="meta"><span>الفترة: ${escapeHtml(range||'________________')}</span><span>الساعات المستهدفة: ${escapeHtml(hrs)}</span></div><div class="goal">الهدف: ${escapeHtml(goal||'____________________________')}</div></div>${clone.outerHTML}<div class="copyright">© 2026 Eto.Edu By ETO • جميع الحقوق محفوظة</div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();}
window.scheduleZoomPct=100;window.scheduleAutoFitScale=1;
function fitScheduleZoom(){const outer=document.getElementById('schedule-board-scale-outer');const inner=document.getElementById('schedule-board-scale-inner');const board=document.getElementById('schedule-preview-sheet');if(!outer||!inner||!board)return;inner.style.transform='none';const naturalWidth=board.scrollWidth||930;const availWidth=outer.clientWidth||naturalWidth;window.scheduleAutoFitScale=Math.min(1,availWidth/naturalWidth)||1;applyScheduleZoom();}
function applyScheduleZoom(){const outer=document.getElementById('schedule-board-scale-outer');const inner=document.getElementById('schedule-board-scale-inner');const board=document.getElementById('schedule-preview-sheet');const label=document.getElementById('schedule-zoom-level');if(!outer||!inner||!board)return;const userZoom=(window.scheduleZoomPct||100)/100;const scale=(window.scheduleAutoFitScale||1)*userZoom;inner.style.transform=`scale(${scale})`;outer.style.height=Math.ceil((board.scrollHeight||0)*scale)+'px';if(label)label.textContent=Math.round(userZoom*100)+'%';}
function scheduleZoomIn(){window.scheduleZoomPct=Math.min(200,(window.scheduleZoomPct||100)+10);applyScheduleZoom();}
function scheduleZoomOut(){window.scheduleZoomPct=Math.max(50,(window.scheduleZoomPct||100)-10);applyScheduleZoom();}
function scheduleZoomResetFn(){window.scheduleZoomPct=100;fitScheduleZoom();}
function wireSchedule(){
  populateScheduleThemeSelect();
  ['schedule-title','schedule-range','schedule-goal','schedule-hours'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderSchedule));
  document.getElementById('schedule-theme')?.addEventListener('change',()=>{toggleScheduleCustomColors();renderSchedule();});
  document.getElementById('schedule-custom-head')?.addEventListener('input',renderSchedule);
  document.getElementById('schedule-custom-accent')?.addEventListener('input',renderSchedule);
  document.getElementById('schedule-clear')?.addEventListener('click',clearSchedule);
  document.getElementById('schedule-fill-example')?.addEventListener('click',scheduleExample);
  document.getElementById('schedule-download')?.addEventListener('click',exportSchedulePDF);
  document.getElementById('schedule-print')?.addEventListener('click',printSchedule);
  document.getElementById('schedule-add-row')?.addEventListener('click',addScheduleRow);
  document.getElementById('schedule-open-file')?.addEventListener('click',()=>document.getElementById('schedule-file-input')?.click());
  document.getElementById('schedule-file-input')?.addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];loadScheduleFile(f);e.target.value='';});
  document.getElementById('schedule-zoom-in')?.addEventListener('click',scheduleZoomIn);
  document.getElementById('schedule-zoom-out')?.addEventListener('click',scheduleZoomOut);
  document.getElementById('schedule-zoom-reset')?.addEventListener('click',scheduleZoomResetFn);
  const scaleOuter=document.getElementById('schedule-board-scale-outer');
  scaleOuter?.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();if(e.deltaY<0)scheduleZoomIn();else scheduleZoomOut();}},{passive:false});
  let scheduleResizeTimer=null;
  window.addEventListener('resize',()=>{clearTimeout(scheduleResizeTimer);scheduleResizeTimer=setTimeout(fitScheduleZoom,150);});
  toggleScheduleCustomColors();
  renderSchedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wireSchedule);else wireSchedule();
