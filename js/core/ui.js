
;
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast'), msg = document.getElementById('toast-msg'), icon = document.getElementById('toast-icon');
            msg.textContent = message;
            icon.className = type === 'success' ? 'fa-solid fa-circle-check text-green-400' : 'fa-solid fa-triangle-exclamation text-red-400';
            toast.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => toast.classList.add('opacity-0', 'pointer-events-none'), 3000);
        }

        const body = document.body;
        const darkIcon = document.getElementById('dark-icon');
        document.getElementById('dark-toggle-btn').onclick = () => {
            body.classList.toggle('dark');
            darkIcon.className = body.classList.contains('dark') ? 'fa-solid fa-sun text-xl text-yellow-400' : 'fa-solid fa-moon text-xl';
            if (typeof renderSchedule === 'function') renderSchedule();
        };
        const GLOBAL_TOOLS = [
            {id:'mp3-to-mp4', title:'تحويل MP3 إلى MP4', desc:'حوّل ملف صوت لفيديو MP4', icon:'fa-file-video'},
            {id:'mp4-to-mp3', title:'تحويل MP4 إلى MP3', desc:'استخراج الصوت من أي فيديو', icon:'fa-file-audio'},
            {id:'mp3-to-wav', title:'تحويل MP3 إلى WAV', desc:'تحويل الـMP3 لملف WAV غير مضغوط', icon:'fa-wave-square'},
            {id:'wav-to-mp3', title:'تحويل WAV إلى MP3', desc:'تصغير ملفات الـWAV وتحويلها MP3', icon:'fa-music'},
            {id:'mp3-to-ogg', title:'تحويل MP3 إلى OGG', desc:'تحويل الـMP3 لملف OGG بجودة أعلى', icon:'fa-compact-disc'},
            {id:'ogg-to-mp3', title:'تحويل OGG إلى MP3', desc:'تحويل ملفات الـOGG لـMP3', icon:'fa-record-vinyl'},
            {id:'audio-tools', title:'أدوات الصوت', desc:'كل أدوات ملفات الصوت', icon:'fa-headphones'},
            {id:'pdf-tools', title:'أدوات الـPDF', desc:'كل أدوات ملفات الـPDF', icon:'fa-file-pdf'},
            {id:'teacher', title:'الشيتات', desc:'إنشاء شيتات وأسئلة PDF', icon:'fa-chalkboard-user'},
            {id:'templates', title:'القوالب', desc:'قوالب جاهزة للطباعة والمذاكرة', icon:'fa-layer-group'},
            {id:'grades', title:'كشف الدرجات', desc:'حساب النسب والتقديرات وترتيب الطلاب', icon:'fa-list-check'},
            {id:'certificate', title:'شهادة تقدير', desc:'إنشاء شهادات جاهزة للطباعة', icon:'fa-award'},
            {id:'answers-key', title:'ملف الإجابات', desc:'اعمل ملف إجابات JSON وPDF للامتحان', icon:'fa-key'},
            {id:'exam-maker', title:'إنشاء امتحان أونلاين', desc:'انشر امتحان لطلابك بلينك ووقت محدد', icon:'fa-clipboard-check'},
            {id:'image-cleaner', title:'تنظيف صور المحاضرات', desc:'تحسين وتبييض صور المحاضرات', icon:'fa-image'},
            {id:'compare', title:'مقارنة نسختين PDF', desc:'مقارنة ملفين صفحة بصفحة', icon:'fa-code-compare'},
            {id:'cleaner', title:'تلوين PDF وتظليل', desc:'ثيمات وتظليل للمذاكرة', icon:'fa-palette'},
            {id:'summaries', title:'ملخصات الطلاب', desc:'معاينة وتحميل الملخصات', icon:'fa-book-open'},
            {id:'exams', title:'الامتحانات', desc:'امتحانات ومراجعات جاهزة', icon:'fa-clipboard'},
            {id:'schedule', title:'جدولي', desc:'إنشاء جدول مذاكرة أسبوعي', icon:'fa-calendar-check'},
            {id:'pomodoro', title:'بومودورو', desc:'تايمر للتركيز والمذاكرة', icon:'fa-clock'},
            {id:'library', title:'مكتبتي', desc:'أرشيف ملفاتك الشخصي', icon:'fa-box-archive'},
            {id:'editor', title:'تعديل وقص PDF', desc:'تعديل الصفحات والملفات', icon:'fa-pen-to-square'},
            {id:'protect', title:'حماية PDF', desc:'حماية الملفات بكلمة مرور', icon:'fa-lock'},
            {id:'merge', title:'دمج الملفات', desc:'دمج أكثر من PDF في ملف واحد', icon:'fa-object-group'},
            {id:'watermark', title:'علامة مائية', desc:'إضافة علامة مائية للملفات', icon:'fa-stamp'},
            {id:'extract', title:'استخراج وحذف صفحات', desc:'استخراج أو حذف صفحات PDF', icon:'fa-scissors'},
            {id:'reorder', title:'إعادة ترتيب الصفحات', desc:'ترتيب صفحات الملف', icon:'fa-arrow-down-wide-short'},
            {id:'convert', title:'تحويل PDF لصورة', desc:'تحويل الصفحات إلى صور', icon:'fa-image'},
            {id:'ppt-pdf', title:'تحويل PowerPoint و PDF', desc:'باوربوينت إلى PDF والعكس بنفس الشكل', icon:'fa-file-powerpoint'},
            {id:'edu-tools', title:'أدوات تعليمية', desc:'رسم الدوال وأدوات تفاعلية', icon:'fa-flask'}
        ];

        function openGlobalSearch(){
            const modal=document.getElementById('global-search-modal');
            const input=document.getElementById('global-search-input');
            if(!modal)return;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(()=>input?.focus(),50);
            renderGlobalSearch('');
        }

        function closeGlobalSearch(){
            const modal=document.getElementById('global-search-modal');
            if(!modal)return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function renderGlobalSearch(query){
            const results=document.getElementById('global-search-results');
            if(!results)return;

            const q=(query||'').trim().toLowerCase();
            const items=GLOBAL_TOOLS.filter(t=>!q || (t.title+' '+t.desc).toLowerCase().includes(q));

            results.innerHTML=items.length ? items.map(t=>`
                <button onclick="closeGlobalSearch();navigate('${t.id}')"
                    class="w-full flex items-center gap-3 p-3 rounded-xl text-right hover:bg-blue-50 dark:hover:bg-slate-800 transition group">
                    <div class="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <i class="fa-solid ${t.icon}"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="font-black text-sm text-slate-800 dark:text-white">${t.title}</div>
                        <div class="text-[11px] text-slate-400 truncate">${t.desc}</div>
                    </div>
                    <i class="fa-solid fa-arrow-left text-gray-300 group-hover:text-blue-500 transition"></i>
                </button>
            `).join('') : `
                <div class="text-center py-12 text-gray-400">
                    <i class="fa-solid fa-face-frown text-3xl mb-3"></i>
                    <div class="font-bold">مش لاقي أداة بالاسم ده</div>
                </div>
            `;
        }

        document.getElementById('global-search-input')?.addEventListener('input',e=>{
            renderGlobalSearch(e.target.value);
        });

        document.addEventListener('keydown',e=>{
            if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
                e.preventDefault();
                openGlobalSearch();
            }
            if(e.key==='Escape'){
                closeGlobalSearch();
            }
        });
        function setupToolCategorySearch(pageId) {
            const section = document.getElementById('page-' + pageId);
            if (!section) return;
            const input = document.getElementById(pageId + '-search');
            const grid = document.getElementById(pageId + '-grid');
            const empty = document.getElementById(pageId + '-empty');
            if (!input || !grid) return;

            input.addEventListener('input', () => {
                const query = input.value.trim().toLowerCase();
                let visible = 0;
                grid.querySelectorAll('.tool-card').forEach(card => {
                    const match = !query || card.textContent.toLowerCase().includes(query);
                    card.classList.toggle('hidden', !match);
                    if (match) visible++;
                });
                if (empty) empty.classList.toggle('hidden', visible !== 0);
            });
        }

        ['pdf-tools','audio-tools','exam-tools','study-tools','calc-tools'].forEach(setupToolCategorySearch);

        const TOOL_CARD_IMAGES = {
            'mp3-to-mp4': ['Data/Img/ادوات الصوت/mp3-to-mp4.svg'],
            'mp4-to-mp3': ['Data/Img/ادوات الصوت/mp4-to-mp3.svg'],
            'mp3-to-wav': ['Data/Img/ادوات الصوت/mp3-to-wav.svg'],
            'wav-to-mp3': ['Data/Img/ادوات الصوت/wav-to-mp3.svg'],
            'mp3-to-ogg': ['Data/Img/ادوات الصوت/mp3-to-ogg.svg'],
            'ogg-to-mp3': ['Data/Img/ادوات الصوت/ogg-to-mp3.svg'],
            teacher: ['Data/Img/ادوات المعلم/شيتس.jpg'],
            templates: ['Data/Img/ادوات المعلم/قوالب.jpg'],
            'image-cleaner': ['Data/Img/ادوات المعلم/تنضيف صورة المحاضرة.jpg'],
            compare: ['Data/Img/ادوات المعلم/مقارنة البي دي اف.jpg'],
            cleaner: ['Data/Img/ادوات الطالب/تلوين ملف بي دي اف.jpg'],
            'answers-key': ['Data/Img/ادوات المعلم/ورقه اجابات.png'],
            'exam-maker': ['Data/Img/ادوات المعلم/انشاء امتحان.png'],
            reader: ['Data/Img/ادوات الطالب/قارئ_الصور.png'],
            summaries: ['Data/Img/ادوات الطالب/ملخصات الطالب.jpg'],
            exams: ['Data/Img/ادوات الطالب/امتحانات.png'],
            schedule: ['Data/Img/ادوات الطالب/جدولي.png'],
            pomodoro: ['Data/Img/ادوات الطالب/تايمر.png'],
            library: ['Data/Img/ادوات الطالب/مكتبتي.png'],
            percentage: ['Data/Img/ادوات الطالب/student-tools.jpg'],
            calculator: ['Data/Img/ادوات الطالب/calc.jpg'],
            translate: ['Data/Img/ادوات الطالب/translate.png'],
            editor: ['Data/Img/أدوات اضافيه/تعديل وقص.png'],
            protect: ['Data/Img/أدوات اضافيه/حماية ملف.jpg'],
            merge: ['Data/Img/أدوات اضافيه/دمج الملفات.png'],
            watermark: ['Data/Img/أدوات اضافيه/علامة مائية.jpg'],
            text: ['Data/Img/أدوات اضافيه/نصوص.jpg'],
            extract: ['Data/Img/أدوات اضافيه/استخراج وحذف.png'],
            reorder: ['Data/Img/أدوات اضافيه/اعادة ترتيب.png'],
            convert: ['Data/Img/أدوات اضافيه/تحويل بي دي اف لصورة.jpg'],
            'pdf-to-word': ['Data/Img/أدوات اضافيه/بي دي اف ل وورد.png'],
            'ppt-pdf': ['Data/Img/أدوات اضافيه/باوربوينت وبي دي اف.png'],
            grades: ['Data/Img/ادوات المعلم/grades.jpg'],
            certificate: ['Data/Img/ادوات المعلم/certificate.jpg']
        };

        const TOOL_IMAGE_EXTENSIONS = ['png','jpg','jpeg','webp','gif','jfif','bmp','svg'];

        function encodeToolImagePath(path) {
            return encodeURI(path).replace(/#/g, '%23').replace(/\?/g, '%3F');
        }

        function buildToolImageCandidates(path) {
            const clean = path.replace(/\.(png|jpg|jpeg|webp|gif|jfif|bmp|svg)$/i, '');
            const originalExt = (path.match(/\.([a-z0-9]+)$/i) || [,''])[1].toLowerCase();
            const exts = [originalExt, ...TOOL_IMAGE_EXTENSIONS.filter(ext => ext !== originalExt)];
            return [...new Set(exts)].map(ext => `${clean}.${ext}`);
        }

        function applyToolCardImages() {
            ['pdf-tools-grid','audio-tools-grid','exam-tools-grid','study-tools-grid','calc-tools-grid'].forEach(gridId => {
                const grid = document.getElementById(gridId);
                if (!grid) return;
                grid.querySelectorAll('.tool-card').forEach(card => {
                    const onclick = card.getAttribute('onclick') || '';
                    const match = onclick.match(/navigate\('([^']+)'/);
                    const toolId = match ? match[1] : '';
                    const imageList = TOOL_CARD_IMAGES[toolId];
                    if (!imageList?.length || card.querySelector('.tool-card-image-wrap')) return;

                    const wrap = document.createElement('div');
                    wrap.className = 'tool-card-image-wrap';
                    const img = document.createElement('img');
                    img.className = 'tool-card-image';
                    img.alt = card.querySelector('h3')?.textContent?.trim() || 'أداة';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    img.referrerPolicy = 'no-referrer';

                    const candidates = imageList.flatMap(buildToolImageCandidates);
                    let candidateIndex = 0;
                    const loadNextImage = () => {
                        if (candidateIndex >= candidates.length) {
                            wrap.innerHTML = '<div class="tool-card-image-fallback"><i class="fa-solid fa-image"></i></div>';
                            return;
                        }
                        img.src = encodeToolImagePath(candidates[candidateIndex++]);
                    };

                    img.onerror = loadNextImage;
                    wrap.appendChild(img);
                    card.insertBefore(wrap, card.firstChild);
                    loadNextImage();
                });
            });
        }

        applyToolCardImages();

