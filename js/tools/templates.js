/* ===== القوالب ===== */
        let selectedTemplateType='lined';
        const templateNames={
          lined:'ورق مسطر',grid:'ورق مربعات',planner:'Study Planner',mindmap:'خريطة ذهنية',cv:'قالب CV عصري',notes:'ورق ملاحظات',
          cornell:'Cornell Notes',weekly:'Weekly Planner',checklist:'قائمة مهام',exam:'Exam / Answer Sheet',calendar:'تقويم شهري',habit:'Habit Tracker'
        };
        const TEMPLATE_SIZES={a4:[210,297],a5:[148,210],letter:[216,279]};
        const MARGINS={compact:'8mm',normal:'12mm',wide:'17mm'};
        const DENSITIES={dense:{line:'6.5mm',grid:'4mm'},normal:{line:'8mm',grid:'5mm'},relaxed:{line:'10mm',grid:'7mm'}};
        function templateSheetSize(size,orientation){let [w,h]=TEMPLATE_SIZES[size]||TEMPLATE_SIZES.a4;return orientation==='l'?[h,w]:[w,h];}

        function templateControls(){
          return {
            pages:Math.max(1,Math.min(50,parseInt(document.getElementById('template-pages')?.value)||1)),
            size:document.getElementById('template-size')?.value||'a4',
            orientation:document.getElementById('template-orientation')?.value||'p',
            margin:document.getElementById('template-margin')?.value||'normal',
            density:document.getElementById('template-density')?.value||'normal',
            bg:document.getElementById('template-bg')?.value||'#fff'
          };
        }
        function openTemplateSettings(type){
          selectedTemplateType=type;
          const title=document.getElementById('template-settings-title'); if(title)title.textContent=templateNames[type]||'إعداد القالب';
          const defaults={pages:1,size:'a4',orientation:'p',margin:'normal',density:'normal',bg:'#ffffff'};
          Object.entries(defaults).forEach(([k,v])=>{const id='template-'+k,el=document.getElementById(id);if(el)el.value=v;});
          navigate('template-settings');
          updateTemplatePreview();
        }

        function sheetStyleVars(c){
          const d=DENSITIES[c.density]||DENSITIES.normal;
          return `--sheet-pad:${MARGINS[c.margin]||MARGINS.normal};--line-gap:${d.line};--grid-size:${d.grid};--sheet-bg:${c.bg}`;
        }
        function sheetShell(inner,c,extra=''){
          const [w,h]=templateSheetSize(c.size,c.orientation);
          return `<div class="pdf-template-sheet" data-mm-w="${w}" data-mm-h="${h}" style="width:${w}mm;height:${h}mm;${sheetStyleVars(c)};background:${c.bg};${extra}">${inner}<div class="tpl-copyright">© 2026 <b>Eto.Edu By ETO</b> • جميع الحقوق محفوظة</div></div>`;
        }

        function notebookHeader(label='عنوان الصفحة'){return `<div class="tpl-notebook-header"><div class="tpl-notebook-title">${label}: <span></span></div><div class="tpl-notebook-date">التاريخ: <span></span></div></div>`;}
        function templatePageTitle(label){return `<div class="tpl-page-title">${label}</div>`;}

        function buildTemplateMarkup(type,c){
          if(type==='lined') return `<div class="sheet-padding">${notebookHeader('عنوان المذكرة')}<div style="position:absolute;left:var(--sheet-pad);right:var(--sheet-pad);top:28mm;bottom:var(--sheet-pad);background-image:repeating-linear-gradient(to bottom,transparent 0,transparent var(--line-gap),#cbd5e1 calc(var(--line-gap) + .25mm),transparent calc(var(--line-gap) + .55mm))"></div></div><div class="tpl-border" style="inset:var(--sheet-pad)"></div>`;
          if(type==='grid') return `<div class="sheet-padding">${notebookHeader('عنوان الدرس')}<div style="position:absolute;left:var(--sheet-pad);right:var(--sheet-pad);top:28mm;bottom:var(--sheet-pad);background-image:linear-gradient(#d7dee8 .25mm,transparent .25mm),linear-gradient(90deg,#d7dee8 .25mm,transparent .25mm);background-size:var(--grid-size) var(--grid-size)"></div></div><div class="tpl-border" style="inset:var(--sheet-pad)"></div>`;
          if(type==='notes') return `<div class="sheet-padding">${notebookHeader('ملاحظات المحاضرة')}<div style="height:calc(100% - 20mm);border-top:.35mm solid #94a3b8;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent var(--line-gap),#cbd5e1 calc(var(--line-gap) + .2mm),transparent calc(var(--line-gap) + .5mm))"></div></div>`;
          if(type==='planner') return `<div class="sheet-padding">${notebookHeader('خطة المذاكرة')}<div class="tpl-title-band" style="font-size:6mm">STUDY PLANNER</div><div class="tpl-planner-head"><div>الوقت</div><div>المادة</div><div>المهمة</div><div>تم</div></div>${['الصباح','الظهر','العصر','المساء','الليل'].map(x=>`<div class="tpl-planner-row"><div style="font-weight:900">${x}</div><div></div><div></div><div class="check"></div></div>`).join('')}</div>`;
          if(type==='mindmap') return `<div class="sheet-padding">${notebookHeader('الخريطة الذهنية')}<div class="tpl-mindmap" style="position:absolute;inset:0"><div class="branch" style="left:48%;top:49%;width:34%;transform:rotate(-28deg)"></div><div class="branch" style="left:52%;top:49%;width:34%;transform:rotate(28deg)"></div><div class="branch" style="left:48%;top:53%;width:34%;transform:rotate(28deg)"></div><div class="branch" style="left:52%;top:53%;width:34%;transform:rotate(-28deg)"></div><div class="node center">الفكرة الرئيسية</div><div class="node n1">فرع 1</div><div class="node n2">فرع 2</div><div class="node n3">فرع 3</div><div class="node n4">فرع 4</div></div></div>`;
          if(type==='cv') return `<div class="tpl-cv"><div class="side"><div class="avatar"></div><div class="side-line"></div><div class="side-line" style="width:78%"></div><div class="side-line" style="width:90%"></div><div class="side-line" style="width:62%"></div></div><div class="main"><div class="name">YOUR NAME</div><div class="contact">Email • Phone • Address • City</div><div class="section">PROFILE</div><div class="line"></div><div class="line" style="width:84%"></div><div class="section">EDUCATION</div><div class="line"></div><div class="line" style="width:72%"></div><div class="section">EXPERIENCE</div><div class="line"></div><div class="line" style="width:88%"></div><div class="section">SKILLS</div><div class="line" style="width:65%"></div></div></div>`;
          if(type==='cornell') return `<div class="sheet-padding" style="height:100%">${notebookHeader('Cornell Notes')}<div class="tpl-title-band" style="font-size:6mm;margin-bottom:5mm">CORNELL NOTES</div><div class="tpl-cornell" style="height:calc(100% - 14mm)"><div class="cue"><h4>أسئلة / كلمات مفتاحية</h4></div><div class="notes"><h4>الملاحظات</h4></div><div class="summary"><h4 style="font-size:4mm;font-weight:900;margin:0 0 2mm">الملخص</h4><p>اكتب هنا أهم النقاط بعد انتهاء المذاكرة.</p></div></div></div>`;
          if(type==='weekly') return `<div class="sheet-padding">${notebookHeader('الخطة الأسبوعية')}<div class="tpl-title-band" style="font-size:6mm;margin-bottom:5mm">WEEKLY PLANNER</div><div class="tpl-week">${['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'].map(d=>`<div class="tpl-week-col"><div class="tpl-week-head">${d}</div><div class="tpl-week-body"></div></div>`).join('')}</div></div>`;
          if(type==='checklist') return `<div class="sheet-padding tpl-checklist">${notebookHeader('قائمة المهام')}<div class="tpl-title-band" style="font-size:6mm;margin-bottom:5mm">CHECKLIST / قائمة مهام</div><div class="check-head"><b style="font-size:4mm">أهم مهام اليوم</b><span style="font-size:3mm;color:#64748b">التاريخ: ____ / ____ / ____</span></div><div class="rows">${Array.from({length:13},(_,i)=>`<div class="row"><span class="box"></span><span>${i<3?['مهمة أساسية','مراجعة درس','حل الأسئلة'][i]:''}</span><span style="color:#94a3b8">الأولوية</span></div>`).join('')}</div></div>`;
          if(type==='exam') return `<div class="sheet-padding tpl-exam"><div class="tpl-title-band" style="font-size:6mm;margin-bottom:5mm">EXAM / ورقة امتحان</div><div class="exam-head"><div class="fields"><div class="field">الاسم: __________________</div><div class="field">الفصل: __________</div><div class="field">الدرجة: __________</div></div></div><div class="questions">${[1,2,3,4,5].map(n=>`<div class="q"><div class="q-head"><span class="qnum">${n}</span><span>السؤال ${n} — اكتب إجابتك هنا</span></div><div class="answer-lines"></div></div>`).join('')}</div></div>`;
          if(type==='calendar') return `<div class="sheet-padding"><div class="tpl-title-band" style="font-size:6mm;margin-bottom:5mm">MONTHLY CALENDAR</div><div class="tpl-calendar-head">${['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'].map(d=>`<div>${d}</div>`).join('')}</div><div class="tpl-calendar">${Array.from({length:35},(_,i)=>`<div class="tpl-calendar-cell"><b>${i+1<=31?i+1:''}</b></div>`).join('')}</div></div>`;
          if(type==='habit') return `<div class="sheet-padding tpl-habit"><div class="tpl-title-band" style="font-size:6mm;margin-bottom:5mm">HABIT TRACKER</div><div class="habit-grid"><div class="hhead">العادة</div>${['س','ح','ن','ث','ر','خ','ج'].map(d=>`<div class="hhead">${d}</div>`).join('')}${Array.from({length:10},(_,r)=>`<div style="text-align:right">${r<4?['مذاكرة','قراءة','رياضة','نوم منتظم'][r]:''}</div>${Array.from({length:7},()=>`<div><div class="circle"></div></div>`).join('')}`).join('')}</div></div>`;
          return '<div class="sheet-padding"></div>';
        }

        function buildTemplateSheet(type,c,extraClass=''){
          return sheetShell(buildTemplateMarkup(type,c),c,extraClass);
        }

        function updateTemplatePreview(){
          const stage=document.getElementById('template-preview-stage'); if(!stage)return;
          const c=templateControls();
          const [w,h]=templateSheetSize(c.size,c.orientation);
          const maxW=Math.min(stage.clientWidth-24,430), maxH=Math.max(280,stage.clientHeight-22);
          const scale=Math.min(maxW/(w/25.4*96),maxH/(h/25.4*96));
          stage.innerHTML=`<div id="template-preview-scale" class="tpl-preview-scale" style="transform:scale(${scale});width:${w}mm;height:${h}mm">${buildTemplateSheet(selectedTemplateType,c,'tpl-preview-sheet')}</div>`;
          const meta=document.getElementById('template-preview-size');
          const s=c.size==='a5'?'A5':c.size==='letter'?'Letter':'A4',o=c.orientation==='l'?'أفقي':'عمودي';
          if(meta)meta.textContent=`${s} • ${o} • ${c.pages} ${c.pages===1?'صفحة':'صفحات'} • هامش ${c.margin==='compact'?'ضيق':c.margin==='wide'?'واسع':'متوسط'}`;
        }

        ['template-pages','template-size','template-orientation','template-margin','template-density','template-bg'].forEach(id=>{const e=document.getElementById(id);if(e)e.addEventListener(id==='template-pages'||id==='template-bg'?'input':'change',updateTemplatePreview);});
        document.querySelectorAll('.tpl-preset').forEach(b=>b.addEventListener('click',()=>{const e=document.getElementById('template-bg');if(e){e.value=b.dataset.bg;updateTemplatePreview();}}));
        window.addEventListener('resize',()=>{if(!document.getElementById('page-template-settings')?.classList.contains('hidden'))updateTemplatePreview();});

        function filterTemplates(){
          const q=(document.getElementById('template-search')?.value||'').trim().toLowerCase();
          const f=document.querySelector('.tpl-filter.active')?.dataset.filter||'all';
          let n=0;
          document.querySelectorAll('.tpl-card').forEach(card=>{
            const okQ=!q||(card.dataset.search||'').toLowerCase().includes(q);
            const okF=f==='all'||(card.dataset.category||'').split(/\s+/).includes(f);
            const show=okQ&&okF; card.classList.toggle('hidden-card',!show);
            if(show){n++;card.style.animationDelay=`${Math.min(n,8)*30}ms`;}
          });
          document.getElementById('templates-empty')?.classList.toggle('show',n===0);
        }
        document.getElementById('template-search')?.addEventListener('input',filterTemplates);
        document.querySelectorAll('.tpl-filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tpl-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');filterTemplates();}));

        async function waitForFonts(){try{if(document.fonts?.ready)await document.fonts.ready;}catch(_){} }
        async function buildExportCanvas(type,c){
          const host=document.getElementById('template-export-host')||(()=>{const x=document.createElement('div');x.id='template-export-host';document.body.appendChild(x);return x;})();
          const [w,h]=templateSheetSize(c.size,c.orientation);
          host.innerHTML=buildTemplateSheet(type,c,'tpl-export-sheet');
          const sheet=host.firstElementChild;
          await waitForFonts();
          await new Promise(requestAnimationFrame);
          const canvas=await html2canvas(sheet,{scale:2,useCORS:true,backgroundColor:null,logging:false,imageTimeout:15000,removeContainer:true});
          host.innerHTML='';
          return {canvas,w,h};
        }

        async function generateSelectedTemplate(){
          const {jsPDF}=window.jspdf||{}; if(!jsPDF){showToast('مكتبة إنشاء الـPDF لسه محملتش','error');return;}
          const c=templateControls();
          try{
            showLoad('جاري تجهيز القالب بنفس شكل البريفيو...');
            const {canvas,w,h}=await buildExportCanvas(selectedTemplateType,c);
            const data=canvas.toDataURL('image/png');
            const doc=new jsPDF(c.orientation,'mm',c.size);
            const pw=doc.internal.pageSize.getWidth(),ph=doc.internal.pageSize.getHeight();
            for(let i=0;i<c.pages;i++){if(i>0)doc.addPage(c.size,c.orientation);doc.addImage(data,'PNG',0,0,pw,ph,undefined,'FAST');if(i===0)await updateProgress(100,'تم مطابقة البريفيو');}
            const filename=(templateNames[selectedTemplateType]||'template').replace(/[^\w\u0600-\u06FF -]/g,'').replace(/\s+/g,'-')+'.pdf';
            hideLoad();doc.save(filename);showToast(`تم تحميل ${templateNames[selectedTemplateType]||'القالب'} بنفس شكل البريفيو`);
          }catch(err){hideLoad();console.error(err);showToast('حصلت مشكلة أثناء تجهيز الـPDF','error');}
        }
