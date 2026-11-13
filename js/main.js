
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

        setupToolCategorySearch('teacher-tools');
        setupToolCategorySearch('student-tools');
        setupToolCategorySearch('extra-tools');
        setupToolCategorySearch('audio-tools');

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
            ['teacher-tools-grid','student-tools-grid','extra-tools-grid','audio-tools-grid'].forEach(gridId => {
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

        window.EtoUpdatesReady = window.EtoUpdatesReady || Promise.resolve(window.EtoUpdates || null);

        let currentPageId = 'portal';
        let navigationStarted = false;
        let navigationStack = ['portal'];

        function openAssistantChat() {
            let overlay = document.getElementById('eto-direct-chat');

            if (overlay) {
                overlay.style.display = 'flex';
                window.dispatchEvent(new CustomEvent('eto-robot-chat-open'));
                return;
            }

            overlay = document.createElement('div');
            overlay.id = 'eto-direct-chat';
            overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(248,250,252,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;';

            const frame = document.createElement('iframe');
            frame.src = './Robot/robot-chat.html';
            frame.title = 'مساعد Eto.Edu';
            frame.style.cssText = 'width:100%;height:100%;border:0;background:#fff;box-shadow:0 0 0 1px rgba(15,23,42,.06);';

            overlay.appendChild(frame);
            document.body.appendChild(overlay);
            window.dispatchEvent(new CustomEvent('eto-robot-chat-open'));
        }

        window.addEventListener('message', function(event) {
            if (event.data === 'eto-robot-close-chat') {
                const overlay = document.getElementById('eto-direct-chat');
                if (overlay) overlay.style.display = 'none';
            }
        });

        /* ===== الأدوات التعليمية: بتتفتح جوا السايت فل-سكرين + لينك خاص لكل أداة =====
           لينك الأداة داخل السايت:  index.html#tool/ID   (والحالة الداخلية للأداة بعد علامة ?)
           لينك المشاركة (بيطلع بريفيو): Data/Edu_tools/<folder>/  — وبيفتح السايت لما حد يدوس عليه */
        var eduToolPushed = false, eduToolPrevTitle = document.title, eduToolCurrent = null;

        function eduToolBase(t) { return 'Data/Edu_tools/' + encodeURIComponent(t.folder) + '/'; }
        function eduToolShareUrl(t) { return new URL(eduToolBase(t), location.href).href; }
        function findEduTool(id) { return (window.EDU_TOOLS || []).find(x => x.id === id); }
        function parseToolHash() {
            const m = /^#tool\/([^?]+)(?:\?(.*))?$/.exec(location.hash);
            return m ? { id: decodeURIComponent(m[1]), inner: m[2] || '' } : null;
        }

        function renderEduToolCards() {
            const grid = document.getElementById('edu-tools-grid');
            if (!grid) return;
            grid.innerHTML = (window.EDU_TOOLS || []).map(t => {
                const img = t.cardImage || (eduToolBase(t) + (t.preview || 'preview.jpg'));
                const name = t.short || t.title;
                return `<a href="#tool/${encodeURIComponent(t.id)}" onclick="openEduTool('${t.id}'); return false;" class="student-special-card block" style="background:${t.gradient || 'linear-gradient(135deg,#312e81,#6366f1 70%,#06b6d4)'}">
                    <img src="${img}" alt="${name}" loading="lazy" style="width:100%;height:200px;object-fit:cover;border-radius:10px 10px 0 0;margin-bottom:15px;">
                    <h3>${name}</h3>
                    <p>${t.desc || ''}</p>
                    <div class="student-special-link">افتح الأداة ←</div>
                </a>`;
            }).join('');
        }
        renderEduToolCards();

        // mode: 'push' = ضغطة من جوا السايت | 'pop' = رجوع/تقدم في المتصفح | 'load' = فتح لينك مباشر
        function openEduTool(id, inner, mode) {
            mode = mode || 'push';
            const t = findEduTool(id);
            if (!t) { navigate('edu-tools', false); return; }
            if (currentPageId !== 'tool-view') eduToolPrevTitle = document.title;
            eduToolCurrent = t;
            if (mode === 'push') {
                history.pushState({ page: 'tool-view', tool: id }, '', '#tool/' + encodeURIComponent(id) + (inner ? '?' + inner : ''));
            }
            eduToolPushed = (mode !== 'load');
            document.getElementById('tool-view-title').textContent = t.title;
            document.getElementById('tool-view-frame').src = eduToolBase(t) + 'index.html' + (inner ? '#' + inner : '');
            document.title = t.title + ' | ETO';
            navigate('tool-view', mode === 'push');
            document.body.style.overflow = 'hidden';
        }

        function closeEduTool() {
            if (eduToolPushed) { eduToolPushed = false; history.back(); return; }
            history.replaceState({ page: 'edu-tools' }, '', '#edu-tools');
            navigate('edu-tools', false);
        }

        function unloadEduToolFrame() {
            const f = document.getElementById('tool-view-frame');
            if (f && f.getAttribute('src') && f.getAttribute('src') !== 'about:blank') {
                f.src = 'about:blank';
                document.title = eduToolPrevTitle;
                document.body.style.overflow = '';
                eduToolPushed = false;
            }
        }

        function copyEduToolLink() {
            if (!eduToolCurrent) return;
            const url = eduToolShareUrl(eduToolCurrent);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => showToast('تم نسخ لينك الأداة'), () => prompt('انسخ اللينك:', url));
            } else { prompt('انسخ اللينك:', url); }
        }
        function shareEduTool() {
            if (!eduToolCurrent) return;
            const t = eduToolCurrent, url = eduToolShareUrl(t);
            if (navigator.share) navigator.share({ title: t.title, text: t.desc, url }).catch(() => {});
            else copyEduToolLink();
        }
        window.addEventListener('message', e => {
            if (e.origin === location.origin && e.data === 'eto-tool-close') closeEduTool();
        });

        function navigate(pageId, addHistory = true) {
            if (pageId === 'assistant') {
                openAssistantChat();
                return;
            }

            const target = document.getElementById('page-' + pageId);
            if (!target) return;
            const toolPageIds = new Set([
                'extra-tools', 'pdf-tools', 'audio-tools', 'edu-tools', 'tool-view',
                'teacher-tools', 'student-tools', 'translate', 'calculator', 'calculator-history',
                'mp4-to-mp3', 'mp3-to-mp4', 'mp3-to-wav', 'wav-to-mp3', 'mp3-to-ogg', 'ogg-to-mp3',
                'cleaner', 'image-cleaner', 'compress', 'merge', 'compare', 'extract', 'editor',
                'convert', 'text', 'pdf-to-word', 'reader', 'watermark', 'reorder', 'protect',
                'grades', 'certificate', 'templates', 'template-settings', 'answers-key',
                'exam-maker', 'percentage', 'pomodoro', 'teacher'
            ]);
            document.body.classList.toggle('eto-hide-robot', toolPageIds.has(pageId));

            if (pageId === 'portal') {
                navigationStack = ['portal'];
            } else if (addHistory && pageId !== currentPageId) {
                const last = navigationStack[navigationStack.length - 1];
                if (last !== currentPageId) navigationStack.push(currentPageId);
            }

            document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
            target.classList.remove('hidden');
            if (pageId !== 'tool-view') unloadEduToolFrame();
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll(`button[onclick="navigate('${pageId}')"]`).forEach(btn => btn.classList.add('active'));
            document.getElementById('mobile-menu').classList.add('hidden');

            const backBtn = document.getElementById('back-to-home-btn');
            if (backBtn) {
                backBtn.classList.toggle('hidden', navigationStack.length <= 1 && pageId === 'portal');
            }

            currentPageId = pageId;
            navigationStarted = pageId !== 'portal';
            if (window.EtoUpdates && typeof window.EtoUpdates.renderForPage === 'function') {
                window.EtoUpdates.renderForPage(pageId);
            }

            if (pageId !== 'tool-view' && location.hash.slice(1) !== pageId) {
                history.replaceState({ page: pageId }, '', pageId === 'portal' ? location.pathname + location.search : '#' + pageId);
            }
            if (pageId === 'schedule' && typeof fitScheduleZoom === 'function') {
                requestAnimationFrame(fitScheduleZoom);
            }
        }

        function goBackPage() {
            if (navigationStack.length > 1) {
                const previousPage = navigationStack.pop();
                navigate(previousPage, false);
                return;
            }
            if (currentPageId !== 'portal') {
                navigate('portal', false);
            }
        }

        window.addEventListener('popstate', event => {
            const toolRoute = parseToolHash();
            if (toolRoute) { navigationStack = ['portal']; openEduTool(toolRoute.id, toolRoute.inner, 'pop'); return; }
            const pageId = event.state?.page || (location.hash ? location.hash.slice(1) : 'portal');
            if (!document.getElementById('page-' + pageId)) return;
            currentPageId = pageId;
            navigationStarted = pageId !== 'portal';
            navigationStack = ['portal'];
            navigate(pageId, false);
        });

        const initialToolRoute = parseToolHash();
        if (initialToolRoute) {
            navigationStack = ['portal'];
            openEduTool(initialToolRoute.id, initialToolRoute.inner, 'load');
        } else if (location.hash && document.getElementById('page-' + location.hash.slice(1))) {
            currentPageId = location.hash.slice(1);
            navigationStarted = currentPageId !== 'portal';
            navigationStack = ['portal'];
            navigate(currentPageId, false);
        } else {
            history.replaceState({ page: 'portal' }, '', location.pathname + location.search);
            navigate('portal', false);
        }
        document.getElementById('cleaner-reset-theme').onclick = () => {
            delete cPageThemes[cPage];
            cTheme = 'original';
            const select = document.getElementById('cleaner-theme-select');
            if (select) select.value = 'original';

            applyCTheme();
            showToast('رجعنا الصفحة الحالية للشكل الأصلي');
        };

        const desktopLinks = document.querySelector('.hidden.lg\\:flex.space-x-5.space-x-reverse').innerHTML;
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.innerHTML = desktopLinks.replace(/px-2 py-4/g, 'block w-full text-right px-4 py-3 border-b hover:bg-gray-50 text-gray-700 dark:hover:bg-slate-800 dark:text-gray-200');
        document.getElementById('mobile-menu-btn').onclick = () => mobileMenu.classList.toggle('hidden');

        let globalOperationCancelled = false;
        let globalOperationId = 0;

        function showLoad(txt) {
            globalOperationCancelled = false;
            globalOperationId++;

            document.getElementById('global-loading-txt').textContent = txt;
            document.getElementById('global-loading').classList.remove('hidden');
            document.getElementById('progress-container').classList.add('hidden');
            document.getElementById('progress-text').classList.add('hidden');
            document.getElementById('progress-bar').style.width = '0%';

            const cancelBtn = document.getElementById('global-loading-cancel');
            if (cancelBtn) {
                cancelBtn.disabled = false;
                cancelBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                cancelBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> إلغاء العملية';
            }
        }

        function hideLoad() {
            document.getElementById('global-loading').classList.add('hidden');
        }

        function isOperationCancelled() {
            return globalOperationCancelled;
        }

        document.getElementById('global-loading-cancel')?.addEventListener('click', () => {
            globalOperationCancelled = true;

            const cancelBtn = document.getElementById('global-loading-cancel');
            if (cancelBtn) {
                cancelBtn.disabled = true;
                cancelBtn.classList.add('opacity-50', 'cursor-not-allowed');
                cancelBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري الإلغاء...';
            }

            hideLoad();
            showToast('تم إلغاء العملية', 'error');
        });
        async function updateProgress(percent, txt) {
            document.getElementById('progress-container').classList.remove('hidden');
            document.getElementById('progress-text').classList.remove('hidden');
            document.getElementById('progress-bar').style.width = percent + '%';
            document.getElementById('progress-text').textContent = percent + '% ' + (txt ? '- ' + txt : '');
            await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
        }

        function hexToRgb(hex) { let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : {r:0, g:0, b:0}; }
        const STYLE_BG_PALETTE = ['#ffffff','#f8fafc','#f1f5f9','#fff1f2','#fef2f2','#fff7ed','#fffbeb','#fefce8','#f7fee7','#f0fdf4','#ecfdf5','#f0fdfa','#ecfeff','#eff6ff','#eef2ff','#f5f3ff','#faf5ff','#fdf4ff','#fdf2f8','#fff1f2','#f5f5f4','#fafafa','#f8f9fa','#f4f4f5','#f0f9ff','#e0f2fe','#fef9c3','#fce7f3','#e8f5e9','#f3e5f5'];
        const STYLE_ACCENT_PALETTE = ['#f43f5e','#e11d48','#ec4899','#d946ef','#a855f7','#8b5cf6','#6366f1','#3b82f6','#0ea5e9','#06b6d4','#14b8a6','#10b981','#22c55e','#84cc16','#eab308','#f59e0b','#f97316','#ef4444','#dc2626','#78716c','#64748b','#0f172a','#7c3aed','#be185d','#0891b2','#059669','#ca8a04','#c2410c','#9333ea','#4f46e5'];
        const STYLE_BORDERS = ['solid','dashed','dotted','double'];
        const STYLE_SHAPES = [{ radius: '4px' }, { radius: '10px' }, { radius: '18px' }, { radius: '9999px' }];
        const STYLE_SHADOWS = [{ css: 'none' }, { css: '0 2px 8px rgba(0,0,0,.08)' }, { css: '0 10px 25px -5px rgba(0,0,0,.15)' }];
        const STYLE_ACCENT_SIDES = ['right', 'left', 'top', 'all'];

        function getTotalStyleCount() {
            return STYLE_BG_PALETTE.length * STYLE_ACCENT_PALETTE.length * STYLE_BORDERS.length * STYLE_SHAPES.length * STYLE_SHADOWS.length * STYLE_ACCENT_SIDES.length;
        }
        function getStyleById(id) {
            let n = Math.abs(Math.floor(Number(id) || 0));
            const bg = STYLE_BG_PALETTE[n % STYLE_BG_PALETTE.length]; n = Math.floor(n / STYLE_BG_PALETTE.length);
            const accent = STYLE_ACCENT_PALETTE[n % STYLE_ACCENT_PALETTE.length]; n = Math.floor(n / STYLE_ACCENT_PALETTE.length);
            const border = STYLE_BORDERS[n % STYLE_BORDERS.length]; n = Math.floor(n / STYLE_BORDERS.length);
            const shape = STYLE_SHAPES[n % STYLE_SHAPES.length]; n = Math.floor(n / STYLE_SHAPES.length);
            const shadow = STYLE_SHADOWS[n % STYLE_SHADOWS.length]; n = Math.floor(n / STYLE_SHADOWS.length);
            const accentSide = STYLE_ACCENT_SIDES[n % STYLE_ACCENT_SIDES.length];
            return { bg, accent, border, shape, shadow, accentSide };
        }
        function styleToQuestionCss(style) {
            let css = `background-color:${style.bg}; border-radius:${style.shape.radius}; box-shadow:${style.shadow.css}; padding:20px; margin-top:20px;`;
            if (style.accentSide === 'all') css += `border:2px ${style.border} ${style.accent};`;
            else css += `border-${style.accentSide}:5px ${style.border === 'dotted' ? 'dotted' : 'solid'} ${style.accent};`;
            return css;
        }
        function styleToBadgeColors(style) { return { bg: style.accent + '22', border: style.accent, text: style.accent }; }
        function smartSplitChoices(raw) {
            const flat = (raw || '').replace(/\r/g, '').replace(/\n+/g, ' ').trim();
            if (!flat) return [];
            const labelRe = /(?:^|\s)([a-hA-H]|[1-9]|[أ-ي])[\)\.]\s*/g;
            const matches = [...flat.matchAll(labelRe)];
            if (matches.length >= 2) {
                const parts = [];
                for (let i = 0; i < matches.length; i++) {
                    const start = matches[i].index + matches[i][0].length;
                    const end = i + 1 < matches.length ? matches[i + 1].index : flat.length;
                    const chunk = flat.slice(start, end).trim();
                    if (chunk) parts.push(chunk);
                }
                if (parts.length >= 2) return parts;
            }
            return (raw || '').split('\n').map(c => c.trim()).filter(c => c !== '');
        }

        function getCurrentTeacherStyleSettings() {
            return {
                qStyle: document.getElementById('teacher-q-style') ? document.getElementById('teacher-q-style').value : 'style-default',
                qSize: document.getElementById('teacher-q-size') ? document.getElementById('teacher-q-size').value : 'text-lg',
                qColor: document.getElementById('teacher-q-color') ? document.getElementById('teacher-q-color').value : '#000000',
                aColor: document.getElementById('teacher-a-color') ? document.getElementById('teacher-a-color').value : '#000000',
                qNumShape: document.getElementById('teacher-num-shape') ? document.getElementById('teacher-num-shape').value : 'circle',
                qNumSide: document.getElementById('teacher-num-side') ? document.getElementById('teacher-num-side').value : 'auto',
                numColor: document.getElementById('teacher-num-color') ? document.getElementById('teacher-num-color').value : '#e11d48',
                customStyleId: (document.getElementById('teacher-style-id') && document.getElementById('teacher-style-id').value.trim() !== '') ? document.getElementById('teacher-style-id').value : null
            };
        }
        function applyStyleToQuestionDiv(qDiv, settings) {
            if (!qDiv) return;
            const qLang = qDiv.getAttribute('dir') || 'rtl';
            const naturalSide = qLang === 'rtl' ? 'right' : 'left';
            const forcedReverse = settings.qNumSide !== 'auto' && settings.qNumSide !== naturalSide;

            let customStyle = null; const numColor = settings.numColor || '#e11d48'; let badgeBg = numColor + '22', badgeBorder = numColor, badgeText = numColor;
            if (settings.customStyleId !== null) {
                customStyle = getStyleById(settings.customStyleId);
                const bc = styleToBadgeColors(customStyle);
                badgeBg = bc.bg; badgeBorder = bc.border; badgeText = bc.text;
            }
            const badgeRadius = settings.qNumShape === 'circle' ? '9999px' : (settings.qNumShape === 'square' ? '10px' : '6px 6px 6px 0');

            qDiv.className = customStyle ? 'flex gap-6 items-start relative group q-block w-full q-style-custom' : `flex gap-6 items-start relative group q-block w-full ${settings.qStyle.replace('style-', 'q-style-')}`;
            let wrapperCss = customStyle ? styleToQuestionCss(customStyle) : '';
            if (qDiv.dataset.pagebreak === '1') wrapperCss += 'page-break-after: always; break-after: page;';
            qDiv.style.cssText = wrapperCss;

            const numRow = qDiv.querySelector('.q-num-row');
            if (numRow) numRow.className = 'flex gap-2 items-start q-num-row' + (forcedReverse ? ' flex-row-reverse' : '');

            const badge = qDiv.querySelector('.q-num-badge');
            if (badge) {
                badge.style.borderRadius = badgeRadius;
                badge.style.backgroundColor = badgeBg;
                badge.style.borderColor = badgeBorder;
                badge.style.color = badgeText;
                badge.className = `q-num-badge font-black ${settings.qSize}`;
                badge.style.display = 'inline-flex';
                badge.style.alignItems = 'center';
                badge.style.justifyContent = 'center';
                badge.style.boxSizing = 'border-box';
                badge.style.lineHeight = '1';
                badge.style.flexShrink = '0';
            }

            const qTextEl = qDiv.querySelector('.q-text-el');
            if (qTextEl) {
                qTextEl.style.color = settings.qColor;
                qTextEl.classList.remove('text-base', 'text-lg', 'text-xl', 'text-2xl');
                qTextEl.classList.add(settings.qSize);
            }

            qDiv.querySelectorAll('.q-answer-el').forEach(el => { el.style.color = settings.aColor; });
            qDiv.querySelectorAll('.q-choice-letter').forEach(el => { el.style.backgroundColor = badgeText + '22'; el.style.color = badgeText; });
        }

        function liveApplyToAllQuestions() {
            const preview = document.getElementById('teacher-sheet-preview');
            if (!preview) return;
            const groups = preview.querySelectorAll('.q-block');
            if (!groups.length) return;
            const settings = getCurrentTeacherStyleSettings();
            groups.forEach(qDiv => applyStyleToQuestionDiv(qDiv, settings));
        }

        let currentTitleEl = null;
        function liveUpdateTitle() {
            if (!currentTitleEl || !document.body.contains(currentTitleEl)) { currentTitleEl = null; return; }
            const titleColor = document.getElementById('teacher-title-color') ? document.getElementById('teacher-title-color').value : '#1e293b';
            const titleAccent = document.getElementById('teacher-title-accent') ? document.getElementById('teacher-title-accent').value : '#f43f5e';
            const titleStyle = document.getElementById('teacher-title-style') ? document.getElementById('teacher-title-style').value : 'underline';
            const repeatOnEveryPage = document.getElementById('teacher-title-repeat') ? document.getElementById('teacher-title-repeat').checked : false;

            let titleCss = `color:${titleColor};`;
            if (titleStyle === 'underline') titleCss += `padding-bottom:16px; border-bottom:4px solid ${titleAccent};`;
            else if (titleStyle === 'boxed') titleCss += `background-color:${titleAccent}22; border:2px solid ${titleAccent}; border-radius:12px; padding:14px;`;
            else if (titleStyle === 'pill') titleCss += `background-color:${titleAccent}; color:#fff; border-radius:9999px; padding:12px 20px;`;
            else if (titleStyle === 'ribbon') titleCss += `border-right:6px solid ${titleAccent}; border-left:6px solid ${titleAccent}; padding:12px;`;

            currentTitleEl.style.cssText = titleCss;
            currentTitleEl.classList.toggle('teacher-title-repeat-print', repeatOnEveryPage);
            const sheetPreview = document.getElementById('teacher-sheet-preview');
            if (sheetPreview) sheetPreview.classList.toggle('has-repeating-title', repeatOnEveryPage);
        }
        function onTitleRemoved() {
            currentTitleEl = null;
            const sheetPreview = document.getElementById('teacher-sheet-preview');
            if (sheetPreview) sheetPreview.classList.remove('has-repeating-title');
        }
        function getFullSheetSnapshotJSON() {
            const preview = document.getElementById('teacher-sheet-preview');
            if (!preview) return null;
            const hasContent = preview.querySelector('.q-block') || preview.querySelector('.free-text-block') || preview.querySelector('.sheet-title-el');
            if (!hasContent) return null;
            return {
                v: 1,
                html: preview.innerHTML,
                bg: preview.style.backgroundColor || '',
                hasRepeatingTitle: preview.classList.contains('has-repeating-title')
            };
        }

        async function exportTeacherSheetAsPDF() {
            const preview = document.getElementById('teacher-sheet-preview');
            if (!preview || !preview.querySelector('.q-block')) return showToast('لا يوجد أسئلة لتحميلها!', 'error');
            if (!window.html2canvas || !window.jspdf) return showToast('تعذر تحميل مكتبات التصدير، تأكد من الاتصال بالإنترنت', 'error');

            showLoad('جاري تجهيز الملف وتحميله...');
            setTimeout(async () => {
                try {
                    const bgColor = getComputedStyle(preview).backgroundColor || '#ffffff';
                    const repeatTitle = document.getElementById('teacher-title-repeat') ? document.getElementById('teacher-title-repeat').checked : false;

                    let titleCanvas = null;
                    if (currentTitleEl && document.body.contains(currentTitleEl)) {
                        titleCanvas = await html2canvas(currentTitleEl, {
                            scale: 2,
                            useCORS: true,
                            backgroundColor: bgColor
                        });
                    }

                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');

                    const pageWidthMM = pdf.internal.pageSize.getWidth();
                    const pageHeightMM = pdf.internal.pageSize.getHeight();

                    const marginMM = 10;
                    const contentWidthMM = pageWidthMM - (marginMM * 2);
                    const bottomMarginMM = 10;

                    const questionBlocks = Array.from(preview.querySelectorAll('.q-block'));

                    for (let i = 0; i < questionBlocks.length; i++) {
                        const qBlock = questionBlocks[i];

                        if (i > 0) {
                            pdf.addPage();
                        }

                        let topMM = marginMM;

                        if (titleCanvas && (i === 0 || repeatTitle)) {
                            const titleRatio = titleCanvas.height / titleCanvas.width;
                            let titleWidthMM = contentWidthMM;
                            let titleHeightMM = titleWidthMM * titleRatio;

                            if (titleHeightMM > 30) {
                                titleHeightMM = 30;
                                titleWidthMM = titleHeightMM / titleRatio;
                            }

                            pdf.addImage(
                                titleCanvas.toDataURL('image/png'),
                                'PNG',
                                marginMM + ((contentWidthMM - titleWidthMM) / 2),
                                topMM,
                                titleWidthMM,
                                titleHeightMM
                            );

                            topMM += titleHeightMM + 6;
                        }

                        const questionCanvas = await html2canvas(qBlock, {
                            scale: 2,
                            useCORS: true,
                            backgroundColor: bgColor,
                            width: qBlock.scrollWidth,
                            height: qBlock.scrollHeight,
                            windowWidth: Math.max(qBlock.scrollWidth, 1200),
                            windowHeight: Math.max(qBlock.scrollHeight, 1200)
                        });

                        const availableQuestionHeightMM = pageHeightMM - topMM - bottomMarginMM;

                        const questionRatio = questionCanvas.height / questionCanvas.width;

                        let questionWidthMM = contentWidthMM;
                        let questionHeightMM = questionWidthMM * questionRatio;

                        const minimumAnswerLinesHeightMM = 35;
                        const maxQuestionHeightMM = Math.max(
                            20,
                            availableQuestionHeightMM - minimumAnswerLinesHeightMM
                        );

                        if (questionHeightMM > maxQuestionHeightMM) {
                            questionHeightMM = maxQuestionHeightMM;
                            questionWidthMM = questionHeightMM / questionRatio;
                        }

                        const questionX = marginMM + ((contentWidthMM - questionWidthMM) / 2);

                        pdf.addImage(
                            questionCanvas.toDataURL('image/jpeg', 0.95),
                            'JPEG',
                            questionX,
                            topMM,
                            questionWidthMM,
                            questionHeightMM
                        );

                        const answerStartMM = topMM + questionHeightMM + 10;
                        const answerEndMM = pageHeightMM - bottomMarginMM;

                        pdf.setDrawColor(148, 163, 184);
                        pdf.setLineWidth(0.35);

                        let lineY = answerStartMM;

                        while (lineY <= answerEndMM) {
                            pdf.line(
                                marginMM,
                                lineY,
                                pageWidthMM - marginMM,
                                lineY
                            );

                            lineY += 9;
                        }
                    }

                    const fileTitle = (currentTitleEl && currentTitleEl.innerText ? currentTitleEl.innerText.trim() : '') || 'Sheet';
                    const safeName = fileTitle.replace(/[\\/:*?"<>|]/g, '_').slice(0, 60);

                    let embedded = false;

                    try {
                        const snapshot = getFullSheetSnapshotJSON();

                        if (snapshot) {
                            const pdfBytes = new Uint8Array(pdf.output('arraybuffer'));
                            const jsonStr = JSON.stringify(snapshot);
                            const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
                            const marker = `\n%ETO-SHEET-DATA-START%\n${b64}\n%ETO-SHEET-DATA-END%\n`;
                            const markerBytes = new TextEncoder().encode(marker);

                            const combined = new Uint8Array(pdfBytes.length + markerBytes.length);
                            combined.set(pdfBytes, 0);
                            combined.set(markerBytes, pdfBytes.length);

                            const blob = new Blob([combined], { type: 'application/pdf' });
                            const link = document.createElement('a');

                            link.href = URL.createObjectURL(blob);
                            link.download = `${safeName}.pdf`;

                            document.body.appendChild(link);
                            link.click();
                            link.remove();

                            setTimeout(() => URL.revokeObjectURL(link.href), 5000);

                            embedded = true;
                        }
                    } catch (embedErr) {
                        console.error('embed sheet data failed', embedErr);
                    }

                    if (!embedded) {
                        pdf.save(`${safeName}.pdf`);
                    }

                    showToast('تم تحميل الملف بنجاح');
                } catch (err) {
                    console.error(err);
                    showToast('حدث خطأ أثناء تجهيز الملف', 'error');
                }

                hideLoad();
            }, 50);
        }
        let teacherImgData = null;
        let teacherAnswerMode = 'text';
        let teacherChoiceImages = [];
        function setTeacherAnswerMode(mode) {
            teacherAnswerMode = mode;
            const textBtn = document.getElementById('teacher-ans-mode-text');
            const imgBtn = document.getElementById('teacher-ans-mode-image');
            const textBox = document.getElementById('teacher-q-answers');
            const imgBox = document.getElementById('teacher-q-answer-images-wrap');
            if (mode === 'image') {
                textBox.classList.add('hidden'); imgBox.classList.remove('hidden');
                imgBtn.classList.add('bg-white', 'shadow', 'text-rose-600'); imgBtn.classList.remove('text-gray-500');
                textBtn.classList.remove('bg-white', 'shadow', 'text-rose-600'); textBtn.classList.add('text-gray-500');
            } else {
                imgBox.classList.add('hidden'); textBox.classList.remove('hidden');
                textBtn.classList.add('bg-white', 'shadow', 'text-rose-600'); textBtn.classList.remove('text-gray-500');
                imgBtn.classList.remove('bg-white', 'shadow', 'text-rose-600'); imgBtn.classList.add('text-gray-500');
            }
        }
        function renderTeacherChoiceImgList() {
            const wrap = document.getElementById('teacher-ans-img-list');
            if (!wrap) return;
            wrap.innerHTML = teacherChoiceImages.map((src, i) => `
                <div class="relative">
                    <img src="${src}" class="w-16 h-16 object-cover rounded-lg border shadow-sm">
                    <span class="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl">${i + 1}</span>
                    <button type="button" onclick="teacherChoiceImages.splice(${i},1); renderTeacherChoiceImgList();" class="absolute -top-1.5 -left-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow"><i class="fa-solid fa-xmark"></i></button>
                </div>`).join('');
        }
        setTimeout(() => {
            const tDropZone = document.getElementById('teacher-img-drop');
            const tImgInput = document.getElementById('teacher-q-img');
            const tImgPreview = document.getElementById('teacher-img-preview');
            const tImgContainer = document.getElementById('teacher-img-preview-container');
            if(tDropZone) {
                tDropZone.onclick = () => tImgInput.click();
                
                tDropZone.ondragover = (e) => { e.preventDefault(); tDropZone.classList.add('bg-rose-100'); };
                tDropZone.ondragleave = () => tDropZone.classList.remove('bg-rose-100');
                tDropZone.ondrop = (e) => {
                    e.preventDefault(); tDropZone.classList.remove('bg-rose-100');
                    if(e.dataTransfer.files.length) handleTeacherImg(e.dataTransfer.files[0]);
                };
                
                tImgInput.onchange = (e) => {
                    if(e.target.files.length) handleTeacherImg(e.target.files[0]);
                };
                
                document.getElementById('teacher-img-remove').onclick = (e) => {
                    e.stopPropagation();
                    teacherImgData = null;
                    tImgContainer.classList.add('hidden');
                    tImgPreview.src = '';
                    tImgInput.value = '';
                };
                const ansImgDrop = document.getElementById('teacher-ans-img-drop');
                const ansImgInput = document.getElementById('teacher-ans-img-input');
                if (ansImgDrop) {
                    ansImgDrop.onclick = () => ansImgInput.click();
                    ansImgDrop.ondragover = (e) => { e.preventDefault(); ansImgDrop.classList.add('bg-rose-100'); };
                    ansImgDrop.ondragleave = () => ansImgDrop.classList.remove('bg-rose-100');
                    const addChoiceImageFiles = (files) => {
                        Array.from(files).forEach(file => {
                            if (!file.type.startsWith('image/')) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => { teacherChoiceImages.push(ev.target.result); renderTeacherChoiceImgList(); };
                            reader.readAsDataURL(file);
                        });
                    };
                    ansImgDrop.ondrop = (e) => {
                        e.preventDefault(); ansImgDrop.classList.remove('bg-rose-100');
                        if (e.dataTransfer.files.length) addChoiceImageFiles(e.dataTransfer.files);
                    };
                    ansImgInput.onchange = (e) => {
                        if (e.target.files.length) addChoiceImageFiles(e.target.files);
                        ansImgInput.value = '';
                    };
                    const ansImgListEl = document.getElementById('teacher-ans-img-list');
                    if (ansImgListEl && window.Sortable) {
                        new Sortable(ansImgListEl, {
                            animation: 150,
                            onEnd: () => {
                                const imgs = Array.from(ansImgListEl.querySelectorAll('img'));
                                teacherChoiceImages = imgs.map(img => img.getAttribute('src'));
                                renderTeacherChoiceImgList();
                            }
                        });
                    }
                }
                const styleIdInput = document.getElementById('teacher-style-id');
                const styleTotalEl = document.getElementById('style-total-count');
                if (styleTotalEl) styleTotalEl.textContent = getTotalStyleCount().toLocaleString('en-US');

                function refreshStylePreview() {
                    const preview = document.getElementById('style-preview');
                    const qStyleSel = document.getElementById('teacher-q-style');
                    if (styleIdInput && styleIdInput.value.trim() !== '') {
                        const s = getStyleById(styleIdInput.value);
                        preview.className = 'mt-2 p-3 text-sm transition-all rounded-lg';
                        preview.style.cssText = styleToQuestionCss(s);
                    } else if (qStyleSel) {
                        preview.style.cssText = '';
                        preview.className = 'mt-2 p-3 text-sm transition-all ' + qStyleSel.value.replace('style-', 'q-style-') + ' rounded-lg';
                    }
                }
                if (styleIdInput) styleIdInput.oninput = () => { refreshStylePreview(); liveApplyToAllQuestions(); };
                const styleRandomBtn = document.getElementById('teacher-style-random');
                if (styleRandomBtn) styleRandomBtn.onclick = () => {
                    styleIdInput.value = Math.floor(Math.random() * getTotalStyleCount());
                    refreshStylePreview();
                    liveApplyToAllQuestions();
                };
                const styleClearBtn = document.getElementById('teacher-style-clear');
                if (styleClearBtn) styleClearBtn.onclick = () => { styleIdInput.value = ''; refreshStylePreview(); liveApplyToAllQuestions(); };
                document.querySelectorAll('#teacher-bg-presets button').forEach(btn => {
                    btn.onclick = () => {
                        const color = btn.getAttribute('data-color');
                        const bgInput = document.getElementById('teacher-bg-color');
                        if (bgInput) bgInput.value = color;
                        const sheetPreview = document.getElementById('teacher-sheet-preview');
                        if (sheetPreview) sheetPreview.style.backgroundColor = color;
                    };
                });

                document.getElementById('teacher-set-title-btn').onclick = () => {
                    const titleVal = document.getElementById('teacher-sheet-title').value;
                    if(!titleVal.trim()) return showToast('يرجى كتابة العنوان أولاً', 'error');
                    const emptyState = document.getElementById('teacher-empty-state');
                    if(emptyState) emptyState.remove();

                    if (currentTitleEl && document.body.contains(currentTitleEl)) currentTitleEl.remove();

                    const titleDiv = document.createElement('h1');
                    titleDiv.className = 'sheet-title-el text-3xl font-black text-center mb-8 break-inside-avoid w-full relative group';
                    titleDiv.innerHTML = `<span contenteditable="true" class="outline-none hover:bg-black/5 p-2 rounded cursor-text block w-full transition" title="اضغط لتعديل نص العنوان">${titleVal}</span> <button onclick="this.parentElement.remove(); onTitleRemoved();" class="absolute left-0 top-0 bg-red-100 text-red-600 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition shadow flex items-center justify-center hover:bg-red-200 z-10 print:hidden text-sm"><i class="fa-solid fa-trash"></i></button>`;
                    document.getElementById('teacher-sheet-preview').prepend(titleDiv);
                    currentTitleEl = titleDiv;
                    liveUpdateTitle();
                    document.getElementById('teacher-sheet-title').value = '';
                    showToast('تمت إضافة العنوان بنجاح');
                };

                function renumberTeacherQuestions() {
                    const preview = document.getElementById('teacher-sheet-preview');
                    if (!preview) return;

                    preview.querySelectorAll('.q-block').forEach((qDiv, index) => {
                        const badgeText = qDiv.querySelector('.q-num-badge-txt');
                        if (badgeText) badgeText.textContent = index + 1;
                    });
                }

                function appendQuestionBlock(qLang, qTextHtml, choices, answersAreImages, qPageBreak, imgData) {
                    const emptyState = document.getElementById('teacher-empty-state');
                    if(emptyState) emptyState.remove();

                    const currentQNum = document.getElementById('teacher-sheet-preview').querySelectorAll('.q-block').length + 1;

                    const qDiv = document.createElement('div');
                    qDiv.className = 'group q-block relative w-full';
                    qDiv.dir = qLang;
                    qDiv.dataset.pagebreak = qPageBreak ? '1' : '0';
                    qDiv.style.breakInside = 'avoid';
                    qDiv.style.pageBreakInside = 'avoid';
                    qDiv.style.webkitColumnBreakInside = 'avoid';

                    let innerHTML = `<div class="flex-grow flex flex-col min-w-0 ${qLang === 'rtl' ? 'pr-2' : 'pl-2'}">`;

                    if((qTextHtml || '').trim()) {
                        innerHTML += `
                        <div class="flex gap-2 items-start q-num-row">
                            <div class="q-num-badge font-black"><span class="q-num-badge-txt">${currentQNum}</span></div>
                            <div class="q-text-el font-bold leading-relaxed break-words text-justify outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded p-2 transition cursor-text w-full" style="font-family: inherit;" contenteditable="true" title="اضغط لتعديل السؤال">${qTextHtml}</div>
                        </div>`;
                    }

                    if(choices && choices.length > 0) {
                        innerHTML += `<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">`;

                        const arabicLetters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'];

                        choices.forEach((choice, index) => {
                            const choiceLabel = qLang === 'rtl' ? (arabicLetters[index] || (index+1)) : String.fromCharCode(97 + index);
                            const isImg = !!answersAreImages;
                            const answerHtml = isImg
                                ? `<img src="${choice}" class="q-answer-img max-h-28 w-full rounded object-contain" />`
                                : `<span class="q-answer-el text-base font-semibold outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded px-2 py-1 transition w-full cursor-text" contenteditable="true" title="اضغط للتعديل">${choice}</span>`;
                            innerHTML += `<div class="q-choice-slot group/choice relative flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <div class="q-choice-letter w-7 h-7 rounded-full text-sm font-bold shrink-0"><span class="q-choice-letter-txt">${choiceLabel}</span></div>
                                ${answerHtml}
                                <div class="q-choice-actions print:hidden absolute -top-2 -left-2 flex gap-1 opacity-0 group-hover/choice:opacity-100 transition z-10">
                                    <button type="button" class="choice-img-btn bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-indigo-200 text-[10px]" title="${isImg ? 'غيّر الصورة' : 'ضيف صورة بدل الكتابة في الاختيار ده'}"><i class="fa-solid fa-image"></i></button>
                                    <button type="button" class="choice-text-btn bg-slate-100 text-slate-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-slate-200 text-[10px] ${isImg ? '' : 'hidden'}" title="رجّع كتابة نص بدل الصورة"><i class="fa-solid fa-font"></i></button>
                                </div>
                            </div>`;
                        });
                        innerHTML += `</div>`;
                    }

                    if (!choices || choices.length === 0) {
                        innerHTML += `<div class="q-answer-lines"></div></div>`;
                    } else {
                        innerHTML += `</div>`;
                    }

                    if(imgData) {
                        innerHTML += `<div class="q-question-img-wrap w-1/3 flex-shrink-0 pt-2 relative group/qimg">
                            <img class="q-question-img max-w-full max-h-64 rounded-lg border border-gray-300 shadow-sm object-contain" src="${imgData}" />
                            <button type="button" class="question-img-remove-btn print:hidden absolute -top-2 -left-2 bg-red-100 text-red-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-red-200 text-[10px] opacity-0 group-hover/qimg:opacity-100 transition" title="احذف صورة السؤال"><i class="fa-solid fa-xmark"></i></button>
                        </div>`;
                    }

                    innerHTML += `<div class="q-question-actions print:hidden flex flex-col gap-1 absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition z-10">
                        <button type="button" class="drag-handle bg-slate-100 text-slate-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-slate-200 cursor-move" title="اسحب لنقل السؤال لأي مكان في الشيت"><i class="fa-solid fa-up-down-left-right"></i></button>
                        <button type="button" class="question-img-btn bg-teal-100 text-teal-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-teal-200" title="أضف / غيّر صورة السؤال"><i class="fa-solid fa-file-image"></i></button>
                        <button type="button" onclick="applyStyleToQuestionDiv(this.closest('.group'), getCurrentTeacherStyleSettings()); showToast('اتطبق الاستايل الحالي على السؤال ده');" class="bg-purple-100 text-purple-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-purple-200" title="طبّق الاستايل الحالي على السؤال ده"><i class="fa-solid fa-paintbrush"></i></button>
                        <button type="button" onclick="this.closest('.group').remove(); renumberTeacherQuestions(); if(document.getElementById('teacher-sheet-preview').children.length===0) document.getElementById('teacher-sheet-preview').innerHTML='<div id=\\'teacher-empty-state\\' class=\\'text-center text-gray-400 mt-20\\'><i class=\\'fa-solid fa-clipboard-list text-6xl mb-4 opacity-50\\'></i><p class=\\'font-bold text-lg\\'>لم تقم بإضافة أي أسئلة بعد</p></div>';" class="bg-red-100 text-red-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-red-200" title="حذف السؤال"><i class="fa-solid fa-trash"></i></button>
                    </div>`;

                    qDiv.innerHTML = innerHTML;
                    document.getElementById('teacher-sheet-preview').appendChild(qDiv);
                    applyStyleToQuestionDiv(qDiv, getCurrentTeacherStyleSettings());
                }

                document.getElementById('teacher-add-btn').onclick = () => {
                    const qLang = document.getElementById('teacher-q-lang').value;
                    const qTextHtml = document.getElementById('teacher-q-text').innerHTML;
                    const qTextPlain = document.getElementById('teacher-q-text').innerText || '';
                    const qAnswersRaw = document.getElementById('teacher-q-answers').innerText || '';
                    const qPageBreak = document.getElementById('teacher-q-pagebreak').checked;

                    if(!qTextPlain.trim() && !qTextHtml.includes('<img') && !teacherImgData) return showToast('يرجى إدخال سؤال أو صورة', 'error');

                    const answersAreImages = teacherAnswerMode === 'image';
                    const choices = answersAreImages ? teacherChoiceImages.slice() : smartSplitChoices(qAnswersRaw);

                    appendQuestionBlock(qLang, qTextHtml, choices, answersAreImages, qPageBreak, teacherImgData);

                    document.getElementById('teacher-q-text').innerHTML = '';
                    document.getElementById('teacher-q-answers').innerHTML = '';
                    document.getElementById('teacher-q-pagebreak').checked = false;
                    teacherImgData = null;
                    tImgContainer.classList.add('hidden');
                    tImgPreview.src = '';
                    tImgInput.value = '';
                    teacherChoiceImages = [];
                    renderTeacherChoiceImgList();
                    showToast('تمت إضافة السؤال للشيت بنجاح');
                };
                const teacherJsonInput = document.getElementById('teacher-json-file');
                document.getElementById('teacher-import-json-btn').onclick = () => teacherJsonInput.click();
                const teacherChatgptModal = document.getElementById('teacher-chatgpt-modal');
                const teacherChatgptPrompt = document.getElementById('teacher-chatgpt-prompt');

                document.getElementById('teacher-chatgpt-json-btn')?.addEventListener('click', () => {
                    if (!teacherChatgptModal) return;
                    teacherChatgptModal.classList.remove('hidden');
                    teacherChatgptModal.classList.add('flex');
                });

                document.getElementById('teacher-chatgpt-close')?.addEventListener('click', () => {
                    teacherChatgptModal.classList.add('hidden');
                    teacherChatgptModal.classList.remove('flex');
                });

                teacherChatgptModal?.addEventListener('click', (e) => {
                    if (e.target === teacherChatgptModal) {
                        teacherChatgptModal.classList.add('hidden');
                        teacherChatgptModal.classList.remove('flex');
                    }
                });

                document.getElementById('teacher-chatgpt-copy-btn')?.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(teacherChatgptPrompt.value);
                        showToast('تم نسخ برومبت ChatGPT');
                    } catch (err) {
                        teacherChatgptPrompt.select();
                        document.execCommand('copy');
                        showToast('تم نسخ البرومبت');
                    }
                });

                document.getElementById('teacher-chatgpt-open-btn')?.addEventListener('click', () => {
                    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
                    showToast('اتفتح ChatGPT، الصق البرومبت هناك');
                });
                teacherJsonInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                        let data;
                        try {
                            data = JSON.parse(ev.target.result);
                        } catch(err) {
                            showToast('ملف الـ JSON مش سليم، اتأكد من صيغته', 'error');
                            teacherJsonInput.value = '';
                            return;
                        }
                        const list = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
                        if(!list) {
                            showToast('صيغة الملف غير مدعومة، لازم يكون فيه مصفوفة أسئلة', 'error');
                            teacherJsonInput.value = '';
                            return;
                        }
                        let added = 0;
                        showLoad(`جاري إضافة ${list.length} سؤال...`);
                        await updateProgress(0, 'بدء استيراد الأسئلة');

                        for (let i = 0; i < list.length; i++) {
                            if (isOperationCancelled()) break;

                            const item = list[i];

                            if(item && (item.text || item.image)) {
                                const qLang = item.lang === 'ltr' ? 'ltr' : 'rtl';
                                const qTextHtml = item.text || '';
                                const choices = Array.isArray(item.answers)
                                    ? item.answers.map(a => (a === null || a === undefined) ? '' : String(a)).filter(a => a.trim() !== '')
                                    : [];
                                const qPageBreak = !!item.pagebreak;
                                const imgData = item.image || null;

                                appendQuestionBlock(qLang, qTextHtml, choices, false, qPageBreak, imgData);
                                added++;
                            }

                            if ((i + 1) % 5 === 0 || i === list.length - 1) {
                                await updateProgress(
                                    Math.round(((i + 1) / list.length) * 100),
                                    `إضافة السؤال ${i + 1} من ${list.length}`
                                );
                            }
                        }

                        if (isOperationCancelled()) {
                            teacherJsonInput.value = '';
                            hideLoad();
                            showToast(`تم إلغاء الاستيراد بعد إضافة ${added} سؤال`, 'error');
                            return;
                        }

                        teacherJsonInput.value = '';
                        hideLoad();

                        if(added > 0) showToast(`تمت إضافة ${added} سؤال من ملف الـ JSON بالترتيب بنجاح`);
                        else showToast('مفيش أسئلة اتضافت، تأكد من محتوى الملف', 'error');
                    };
                    reader.readAsText(file, 'UTF-8');
                };
                const teacherReopenPdfInput = document.getElementById('teacher-reopen-pdf-file');
                const teacherReopenPdfBtn = document.getElementById('teacher-reopen-pdf-btn');
                if (teacherReopenPdfBtn && teacherReopenPdfInput) {
                    teacherReopenPdfBtn.onclick = () => teacherReopenPdfInput.click();
                    teacherReopenPdfInput.onchange = async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                            showLoad('جاري قراءة الملف...');
                            const buf = await file.arrayBuffer();
                            const bytes = new Uint8Array(buf);
                            let raw = '';
                            const chunkSize = 0x8000;
                            for (let i = 0; i < bytes.length; i += chunkSize) {
                                raw += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
                            }
                            const startTag = '%ETO-SHEET-DATA-START%';
                            const endTag = '%ETO-SHEET-DATA-END%';
                            const startIdx = raw.lastIndexOf(startTag);
                            const endIdx = raw.lastIndexOf(endTag);
                            hideLoad();

                            if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
                                showToast('الملف ده متعملش من الأداة دي، أو اتصدّر قبل إضافة الخاصية دي، مينفعش نفتحه للتعديل', 'error');
                                teacherReopenPdfInput.value = '';
                                return;
                            }

                            const b64 = raw.slice(startIdx + startTag.length, endIdx).trim();
                            let snapshot;
                            try {
                                const jsonStr = decodeURIComponent(escape(atob(b64)));
                                snapshot = JSON.parse(jsonStr);
                            } catch (parseErr) {
                                showToast('تعذر قراءة بيانات الشيت من الملف', 'error');
                                teacherReopenPdfInput.value = '';
                                return;
                            }

                            const preview = document.getElementById('teacher-sheet-preview');
                            const hasExisting = preview && (preview.querySelector('.q-block') || preview.querySelector('.free-text-block') || preview.querySelector('.sheet-title-el'));
                            if (hasExisting && !confirm('هيتم استبدال محتوى الشيت الحالي بمحتوى الملف ده، متأكد؟')) {
                                teacherReopenPdfInput.value = '';
                                return;
                            }
                            preview.innerHTML = snapshot.html || '';
                            renumberTeacherQuestions();
                            if (snapshot.bg) preview.style.backgroundColor = snapshot.bg;
                            preview.classList.toggle('has-repeating-title', !!snapshot.hasRepeatingTitle);

                            const titleEl = preview.querySelector('.sheet-title-el');
                            currentTitleEl = titleEl || null;

                            if (!preview.querySelector('.q-block') && !preview.querySelector('.free-text-block') && !titleEl) {
                                preview.innerHTML = '<div id="teacher-empty-state" class="text-center text-gray-400 mt-20"><i class="fa-solid fa-clipboard-list text-6xl mb-4 opacity-50"></i><p class="font-bold text-lg">لم تقم بإضافة أي أسئلة بعد</p></div>';
                            }

                            showToast('تم استرجاع الشيت بنجاح، كمّل تعديلك عادي 👌');
                        } catch (err) {
                            console.error(err);
                            hideLoad();
                            showToast('حدث خطأ أثناء قراءة الملف', 'error');
                        } finally {
                            teacherReopenPdfInput.value = '';
                        }
                    };
                }

                document.getElementById('teacher-add-text-btn').onclick = () => {
                    const emptyState = document.getElementById('teacher-empty-state');
                    if (emptyState) emptyState.remove();

                    const textDiv = document.createElement('div');
                    textDiv.className = 'group free-text-block q-block relative w-full mb-6';
                    textDiv.innerHTML = `
                        <div contenteditable="true" class="free-text-el outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded p-2 transition cursor-text w-full leading-relaxed font-semibold" style="font-family: inherit;" title="اضغط لتعديل النص">اكتب هنا أي نص تريده...</div>
                        <div class="print:hidden flex flex-col gap-1 absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition z-10">
                            <button type="button" class="drag-handle bg-slate-100 text-slate-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-slate-200 cursor-move" title="اسحب لنقل النص لأي مكان في الشيت"><i class="fa-solid fa-up-down-left-right"></i></button>
                        <button type="button" onclick="this.closest('.group').remove(); renumberTeacherQuestions(); if(document.getElementById('teacher-sheet-preview').children.length===0) document.getElementById('teacher-sheet-preview').innerHTML='<div id=\\'teacher-empty-state\\' class=\\'text-center text-gray-400 mt-20\\'><i class=\\'fa-solid fa-clipboard-list text-6xl mb-4 opacity-50\\'></i><p class=\\'font-bold text-lg\\'>لم تقم بإضافة أي أسئلة بعد</p></div>';" class="bg-red-100 text-red-600 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-red-200" title="حذف السؤال"><i class="fa-solid fa-trash"></i></button>
                        </div>`;
                    document.getElementById('teacher-sheet-preview').appendChild(textDiv);
                    showToast('تمت إضافة النص، اضغط عليه للكتابة واسحبه لأي مكان تحبه');
                };

                const teacherPreviewEl = document.getElementById('teacher-sheet-preview');
                if (teacherPreviewEl && window.Sortable) {
                    new Sortable(teacherPreviewEl, {
                        animation: 150,
                        handle: '.drag-handle',
                        draggable: '.q-block',
                        ghostClass: 'opacity-40'
                    });
                }
                if (teacherPreviewEl) {
                    teacherPreviewEl.addEventListener('click', (e) => {
                        const imgBtn = e.target.closest('.choice-img-btn');
                        const textBtn = e.target.closest('.choice-text-btn');
                        const qImgBtn = e.target.closest('.question-img-btn');
                        const qImgRemoveBtn = e.target.closest('.question-img-remove-btn');
                        if (!imgBtn && !textBtn && !qImgBtn && !qImgRemoveBtn) return;
                        e.preventDefault();

                        if (qImgBtn) {
                            const qDiv = qImgBtn.closest('.q-block');
                            if (!qDiv) return;
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = () => {
                                const file = input.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    let wrap = qDiv.querySelector('.q-question-img-wrap');
                                    if (!wrap) {
                                        wrap = document.createElement('div');
                                        wrap.className = 'q-question-img-wrap w-1/3 flex-shrink-0 pt-2 relative group/qimg';
                                        wrap.innerHTML = `<img class="q-question-img max-w-full max-h-64 rounded-lg border border-gray-300 shadow-sm object-contain" />
                                            <button type="button" class="question-img-remove-btn print:hidden absolute -top-2 -left-2 bg-red-100 text-red-600 w-6 h-6 rounded-full shadow flex items-center justify-center hover:bg-red-200 text-[10px] opacity-0 group-hover/qimg:opacity-100 transition" title="احذف صورة السؤال"><i class="fa-solid fa-xmark"></i></button>`;
                                        const actionsBar = qDiv.querySelector('.q-question-actions');
                                        if (actionsBar) qDiv.insertBefore(wrap, actionsBar); else qDiv.appendChild(wrap);
                                    }
                                    wrap.querySelector('.q-question-img').src = ev.target.result;
                                    showToast('اتضافت صورة السؤال بنجاح');
                                };
                                reader.readAsDataURL(file);
                            };
                            input.click();
                            return;
                        }

                        if (qImgRemoveBtn) {
                            const wrap = qImgRemoveBtn.closest('.q-question-img-wrap');
                            if (wrap) wrap.remove();
                            showToast('اتشالت صورة السؤال');
                            return;
                        }

                        const slot = (imgBtn || textBtn).closest('.q-choice-slot');
                        if (!slot) return;

                        if (imgBtn) {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = () => {
                                const file = input.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    const oldEl = slot.querySelector('.q-answer-el, .q-answer-img');
                                    const img = document.createElement('img');
                                    img.src = ev.target.result;
                                    img.className = 'q-answer-img max-h-28 w-full rounded object-contain';
                                    if (oldEl) oldEl.replaceWith(img);
                                    else slot.insertBefore(img, slot.querySelector('.q-choice-actions'));

                                    imgBtn.title = 'غيّر الصورة';
                                    const revertBtn = slot.querySelector('.choice-text-btn');
                                    if (revertBtn) revertBtn.classList.remove('hidden');

                                    const qDiv = slot.closest('.q-block');
                                    if (qDiv) applyStyleToQuestionDiv(qDiv, getCurrentTeacherStyleSettings());
                                    showToast('اتضافت الصورة بدل الكتابة في الاختيار ده');
                                };
                                reader.readAsDataURL(file);
                            };
                            input.click();
                        } else if (textBtn) {
                            const oldEl = slot.querySelector('.q-answer-img, .q-answer-el');
                            const span = document.createElement('span');
                            span.className = 'q-answer-el text-base font-semibold outline-none hover:bg-rose-50 focus:bg-rose-50 focus:ring-2 focus:ring-rose-300 rounded px-2 py-1 transition w-full cursor-text';
                            span.contentEditable = 'true';
                            span.title = 'اضغط للتعديل';
                            if (oldEl) oldEl.replaceWith(span);
                            else slot.insertBefore(span, slot.querySelector('.q-choice-actions'));

                            textBtn.classList.add('hidden');
                            const imgB = slot.querySelector('.choice-img-btn');
                            if (imgB) imgB.title = 'ضيف صورة بدل الكتابة في الاختيار ده';

                            const qDiv = slot.closest('.q-block');
                            if (qDiv) applyStyleToQuestionDiv(qDiv, getCurrentTeacherStyleSettings());
                            span.focus();
                            showToast('رجّعت الاختيار كتابة، اكتب النص براحتك');
                        }
                    });
                }

                const restyleAllBtn = document.getElementById('teacher-restyle-all-btn');
                if (restyleAllBtn) restyleAllBtn.onclick = () => {
                    const preview = document.getElementById('teacher-sheet-preview');
                    const groups = preview.querySelectorAll('.q-block');
                    if (!groups.length) return showToast('لا يوجد أسئلة في الشيت لسه', 'error');
                    const settings = getCurrentTeacherStyleSettings();
                    groups.forEach(qDiv => applyStyleToQuestionDiv(qDiv, settings));
                    showToast('اتطبق الاستايل الحالي على كل الأسئلة');
                };

                document.getElementById('teacher-print-btn').onclick = () => {
                    if(!document.getElementById('teacher-sheet-preview').querySelector('.q-block')) return showToast('لا يوجد أسئلة لتحميلها!', 'error');
                    exportTeacherSheetAsPDF();
                };
            }
            
            function handleTeacherImg(file) {
                if(!file.type.startsWith('image/')) return showToast('يرجى اختيار ملف صورة', 'error');
                const reader = new FileReader();
                reader.onload = (e) => {
                    teacherImgData = e.target.result;
                    tImgPreview.src = teacherImgData;
                    tImgContainer.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        }, 500);
        let cPdf = null, cPage = 1, cTheme = 'original', cCustom = {bg:'#fff', text:'#000'}, cZoom = 1.0, cPageThemes = {};
        const cCan = document.getElementById('cleaner-canvas'), cCtx = cCan.getContext('2d', { willReadFrequently: true });
        const oCan = document.createElement('canvas'), oCtx = oCan.getContext('2d', { willReadFrequently: true });
        let highlights = {};

        document.getElementById('cleaner-zoom-in').onclick = () => { cZoom += 0.2; document.getElementById('cleaner-zoom-val').textContent = Math.round(cZoom*100)+'%'; renderCPage(); };
        document.getElementById('cleaner-zoom-out').onclick = () => { if(cZoom>0.4){ cZoom -= 0.2; document.getElementById('cleaner-zoom-val').textContent = Math.round(cZoom*100)+'%'; renderCPage(); } };

        document.getElementById('cleaner-file').onchange = async (e) => {
            if(!e.target.files.length) return;
            document.getElementById('cleaner-filename').textContent = e.target.files[0].name;
            document.getElementById('cleaner-upload').classList.add('hidden');
            document.getElementById('cleaner-workspace').classList.remove('hidden');
            document.getElementById('cleaner-workspace').classList.add('flex');
            showLoad('جاري فتح الملف...');
            try {
                const bytes = await e.target.files[0].arrayBuffer();
                cPdf = await pdfjsLib.getDocument(new Uint8Array(bytes)).promise;
                document.getElementById('cleaner-tot').textContent = cPdf.numPages;
                highlights = {}; cPage = 1; await renderCPage(); showToast('تم الفتح بنجاح');
            } catch(er) { showToast("خطأ في القراءة", "error"); }
            hideLoad();
        };

        async function renderCPage() {
            const page = await cPdf.getPage(cPage);
            const vp = page.getViewport({ scale: 2.0 * cZoom });
            oCan.width = cCan.width = vp.width; oCan.height = cCan.height = vp.height;
            await page.render({ canvasContext: oCtx, viewport: vp }).promise;
            document.getElementById('cleaner-curr').textContent = cPage;
            applyCTheme();
        }

        document.getElementById('cleaner-prev').onclick = () => { if(cPage > 1){ cPage--; renderCPage(); } };
        document.getElementById('cleaner-next').onclick = () => { if(cPage < cPdf.numPages){ cPage++; renderCPage(); } };
        document.getElementById('cleaner-theme-select').onchange = (e) => { 
            cTheme = e.target.value; 
            showLoad('جاري تطبيق الثيم...');
            setTimeout(() => { applyCTheme(); hideLoad(); }, 50);
        };
        document.getElementById('cleaner-apply-page-theme').onclick = () => {
            cPageThemes[cPage] = cTheme;
            applyCTheme();
            showToast('تم تطبيق الثيم على الصفحة الحالية فقط');
        };
        document.getElementById('btn-add-theme').onclick = () => {
            cCustom.bg = document.getElementById('cleaner-custom-bg').value;
            cCustom.text = document.getElementById('cleaner-custom-text').value;
            let n = document.getElementById('cleaner-custom-name').value || 'مخصص';
            let sel = document.getElementById('cleaner-theme-select');
            sel.add(new Option(n, 'custom')); sel.value = 'custom'; cTheme = 'custom'; 
            showLoad('جاري تطبيق الثيم...');
            setTimeout(() => { applyCTheme(); hideLoad(); showToast('تم تطبيق الثيم المخصص'); }, 50);
        };

        function processPixels(imgData, themeId) {
            const d = imgData.data;
            if(themeId === 'bw') {
                for (let i = 0; i < d.length; i += 4) { const luma = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2]; const v = luma > 120 ? 255 : luma; d[i]=d[i+1]=d[i+2]=v; }
                return imgData;
            }
            let bg, txt;
            if(themeId === 'dark') { bg = hexToRgb('#0f172a'); txt = hexToRgb('#e2e8f0'); }
            else if(themeId === 'sepia') { bg = hexToRgb('#fdf6e3'); txt = hexToRgb('#657b83'); }
            else if(themeId === 'green') { bg = hexToRgb('#e0f8e8'); txt = hexToRgb('#114a22'); }
            else if(themeId === 'rose') { bg = hexToRgb('#ffe4e6'); txt = hexToRgb('#881337'); }
            else if(themeId === 'blue') { bg = hexToRgb('#e0f2fe'); txt = hexToRgb('#0c4a6e'); }
            else if(themeId === 'yellow') { bg = hexToRgb('#fef9c3'); txt = hexToRgb('#713f12'); }
            else if(themeId === 'gray') { bg = hexToRgb('#f1f5f9'); txt = hexToRgb('#0f172a'); }
            else if(themeId === 'custom') { bg = hexToRgb(cCustom.bg); txt = hexToRgb(cCustom.text); }
            else return imgData; 
            
            for (let i = 0; i < d.length; i += 4) {
                const luma = (0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2]) / 255;
                d[i] = txt.r + (bg.r - txt.r) * luma; d[i+1] = txt.g + (bg.g - txt.g) * luma; d[i+2] = txt.b + (bg.b - txt.b) * luma;
            }
            return imgData;
        }
        function applyCTheme() {
            const imgData = oCtx.getImageData(0, 0, oCan.width, oCan.height);
            const pageTheme = cPageThemes[cPage] || cTheme;
            cCtx.putImageData(processPixels(imgData, pageTheme), 0, 0);
            drawHighlights();
        }
        cCan.ondblclick = (e) => {
            const rect = cCan.getBoundingClientRect();
            const scaleX = cCan.width / rect.width; const scaleY = cCan.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX; const y = (e.clientY - rect.top) * scaleY;
            if(!highlights[cPage]) highlights[cPage] = [];
            const baseScale = 2.0;
            const currentScale = 2.0 * cZoom;
            const factor = baseScale / currentScale;

            highlights[cPage].push({
                x: (x - 75) * factor,
                y: (y - 20) * factor,
                w: 150 * factor,
                h: 40 * factor,
                color: '#ffeb3b'
            });
            drawHighlights();
        };
        function drawHighlights() {
            if(!highlights[cPage]) return;
            highlights[cPage].forEach(h => { cCtx.fillStyle = h.color; cCtx.globalAlpha = 0.4; cCtx.fillRect(h.x, h.y, h.w, h.h); cCtx.globalAlpha = 1.0; });
        }

        document.getElementById('cleaner-export').onclick = async () => {
            showLoad('جاري تصدير الـ PDF...');
            setTimeout(async () => {
                try {
                    const { jsPDF } = window.jspdf; let pdfExport = null;
                    for (let i = 1; i <= cPdf.numPages; i++) {
                        await updateProgress(Math.round((i / cPdf.numPages) * 100), `صفحة ${i}`);
                        const p = await cPdf.getPage(i); const vp = p.getViewport({ scale: 2.0 });
                        oCan.width = vp.width; oCan.height = vp.height;
                        await p.render({ canvasContext: oCtx, viewport: vp }).promise;
                        let imgData = oCtx.getImageData(0, 0, oCan.width, oCan.height);
                        cCtx.canvas.width = oCan.width; cCtx.canvas.height = oCan.height;
                        cCtx.putImageData(processPixels(imgData, cPageThemes[i] || cTheme), 0, 0);
                        cPage = i; drawHighlights();                         
                        const format = vp.width > vp.height ? 'l' : 'p';
                        if (i === 1) pdfExport = new jsPDF(format, 'px', [vp.width, vp.height]);
                        else pdfExport.addPage([vp.width, vp.height], format);
                        pdfExport.addImage(cCtx.canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, vp.width, vp.height);
                    }
                    pdfExport.save('Cleaned_File.pdf');
                    cPage = 1; applyCTheme(); showToast('تم التصدير بنجاح');
                } catch(e) { showToast('خطأ في التصدير', 'error'); }
                hideLoad();
            }, 50);
        };
        const iCan = document.getElementById('img-canvas'), iCtx = iCan.getContext('2d', { willReadFrequently: true });
        let rawImg = new Image();
        document.getElementById('img-cleaner-file').onchange = (e) => {
            if(!e.target.files.length) return;
            const r = new FileReader();
            r.onload = (ev) => {
                rawImg.onload = () => {
                    document.getElementById('img-cleaner-workspace').classList.remove('hidden');
                    iCan.width = rawImg.width; iCan.height = rawImg.height; applyImgTheme();
                };
                rawImg.src = ev.target.result;
            };
            r.readAsDataURL(e.target.files[0]); showToast('تم الرفع');
        };
        document.getElementById('img-theme').onchange = applyImgTheme;
        function applyImgTheme() {
            iCtx.drawImage(rawImg, 0, 0); const theme = document.getElementById('img-theme').value;
            if(theme === 'original') return;
            const imgData = iCtx.getImageData(0, 0, iCan.width, iCan.height);
            iCtx.putImageData(processPixels(imgData, theme), 0, 0);
        }
        document.getElementById('img-export').onclick = () => {
            const link = document.createElement('a'); link.download = 'Cleaned_Image.jpg'; link.href = iCan.toDataURL('image/jpeg', 0.9); link.click();
            showToast('تم تحميل الصورة');
        };
        let compPdfBytes = null;
        document.getElementById('compress-file').onchange = async (e) => {
            if(!e.target.files.length) return;
            document.getElementById('compress-name').textContent = e.target.files[0].name;
            document.getElementById('compress-options').classList.remove('hidden');
            compPdfBytes = await e.target.files[0].arrayBuffer(); showToast('ملف جاهز للضغط');
        };
        document.getElementById('compress-btn').onclick = async () => {
            showLoad('جاري الضغط...');
            setTimeout(async () => {
                try {
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(compPdfBytes)).promise;
                    const { jsPDF } = window.jspdf;
                    const qual = parseFloat(document.getElementById('compress-level').value);
                    let outPdf = null; const tCan = document.createElement('canvas'), tCtx = tCan.getContext('2d');
                    for (let i = 1; i <= pdf.numPages; i++) {
                        await updateProgress(Math.round((i / pdf.numPages) * 100), `ضغط صفحة ${i}`);
                        const p = await pdf.getPage(i); const originalVp = p.getViewport({ scale: 1.0 });
                        let renderScale = qual >= 0.9 ? 1.0 : (qual >= 0.7 ? 0.7 : 0.4);
                        const vp = p.getViewport({ scale: renderScale });
                        tCan.width = vp.width; tCan.height = vp.height;
                        await p.render({ canvasContext: tCtx, viewport: vp }).promise;
                        const format = originalVp.width > originalVp.height ? 'l' : 'p';
                        if (i === 1) outPdf = new jsPDF(format, 'px', [originalVp.width, originalVp.height]);
                        else outPdf.addPage([originalVp.width, originalVp.height], format);
                        outPdf.addImage(tCan.toDataURL('image/jpeg', qual), 'JPEG', 0, 0, originalVp.width, originalVp.height);
                    }
                    outPdf.save('Compressed.pdf'); showToast('تم الضغط بنجاح');
                } catch(e) { showToast('خطأ أثناء الضغط', 'error'); }
                hideLoad();
            }, 100);
        };
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
        let cImgs = [];
        document.getElementById('img-to-pdf-file').onchange = (e) => { cImgs = Array.from(e.target.files); if(cImgs.length) { document.getElementById('btn-img-to-pdf').classList.remove('hidden'); document.getElementById('btn-img-to-pdf').textContent = `تحميل PDF (${cImgs.length} صور)`; } };
        document.getElementById('btn-img-to-pdf').onclick = async () => {
            showLoad('جاري التحويل...');
            setTimeout(async () => {
                const { jsPDF } = window.jspdf; let doc = new jsPDF();
                for (let idx = 0; idx < cImgs.length; idx++) {
                    await updateProgress(Math.round(((idx + 1) / cImgs.length) * 100), `تحويل ${idx + 1}`);
                    if(idx > 0) doc.addPage();
                    const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(cImgs[idx]);
                    });

                    const format = cImgs[idx].type === 'image/png' ? 'PNG' : 'JPEG';
                    doc.addImage(dataUrl, format, 0, 0, 210, 297);
                }
                doc.save('Converted.pdf'); hideLoad(); showToast('تم التحويل');
            }, 100);
        };
        
        document.getElementById('pdf-to-img-file').onchange = async (e) => {
            if(!e.target.files.length) return; showLoad('استخراج الصور...');
            const buf = await e.target.files[0].arrayBuffer(); const pdf = await pdfjsLib.getDocument(new Uint8Array(buf)).promise;
            const resDiv = document.getElementById('pdf-to-img-results'); resDiv.innerHTML = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const btn = document.createElement('button');
                btn.className = "w-full bg-white border border-blue-200 text-blue-700 py-2.5 rounded-lg hover:bg-blue-50 dark:bg-slate-800/50 dark:border-slate-600 font-bold transition flex items-center justify-between px-3";
                btn.innerHTML = `<span>صفحة ${i}</span><i class="fa-solid fa-download"></i>`;
                btn.onclick = async () => {
                    const p = await pdf.getPage(i);
                    const vp = p.getViewport({ scale: 2.0 });
                    const c = document.createElement('canvas');
                    const ctx = c.getContext('2d');

                    c.width = vp.width;
                    c.height = vp.height;

                    await p.render({
                        canvasContext: ctx,
                        viewport: vp
                    }).promise;

                    const a = document.createElement('a');
                    a.href = c.toDataURL('image/jpeg', 0.92);
                    a.download = `Page_${i}.jpg`;
                    a.click();

                    showToast(`تم تحميل صفحة ${i}`);
                };
                resDiv.appendChild(btn);
            }
            hideLoad(); showToast('تم الاستخراج جاهز للتحميل');
        };

        function switchTextMode(mode) {
            document.getElementById('btn-mode-extract').className = mode === 'extract' ? 'px-4 py-1 rounded bg-white font-bold shadow-sm' : 'px-4 py-1 rounded text-gray-500 font-bold hover:text-gray-800';
            document.getElementById('btn-mode-create').className = mode === 'create' ? 'px-4 py-1 rounded bg-white font-bold shadow-sm' : 'px-4 py-1 rounded text-gray-500 font-bold hover:text-gray-800';
            document.getElementById('text-extract-ui').classList.toggle('hidden', mode === 'create');
            document.getElementById('text-export-btn').classList.toggle('hidden', mode === 'extract');
            document.getElementById('text-area').value = '';
        }
        document.getElementById('text-pdf-file').onchange = async (e) => {
            if(!e.target.files.length) return; const file = e.target.files[0]; showLoad('قراءة النص OCR...');
            try {
                let fullText = ""; const worker = await Tesseract.createWorker(); await worker.loadLanguage('ara'); await worker.initialize('ara');
                if (file.type.startsWith('image/')) {
                    await updateProgress(50, 'تحليل الصورة...');
                    const imageUrl = URL.createObjectURL(file);

                    try {
                        const { data: { text } } = await worker.recognize(imageUrl);
                        fullText = text;
                    } finally {
                        URL.revokeObjectURL(imageUrl);
                    }
                } else if (file.type === 'application/pdf') {
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(await file.arrayBuffer())).promise;
                    for (let i = 1; i <= pdf.numPages; i++) {
                        await updateProgress(Math.round((i / pdf.numPages) * 100), `صفحة ${i}`);
                        const p = await pdf.getPage(i); const vp = p.getViewport({ scale: 4.0 });
                        const c = document.createElement('canvas'), ctx = c.getContext('2d'); c.width = vp.width; c.height = vp.height;
                        await p.render({ canvasContext: ctx, viewport: vp }).promise;
                        const { data: { text } } = await worker.recognize(c); if (text.trim() !== "") fullText += text + "\n\n";
                    }
                }
                await worker.terminate(); document.getElementById('text-area').value = fullText; showToast('اكتملت القراءة');
            } catch(err) { showToast('خطأ في استخراج النص', 'error'); }
            hideLoad();
        };
        document.getElementById('text-export-btn').onclick = () => {
            showLoad('جاري إنشاء ملف PDF...');

            setTimeout(() => {
                try {
                    const text = document.getElementById('text-area').value.trim();

                    if (!text) {
                        hideLoad();
                        showToast('اكتب النص أولاً', 'error');
                        return;
                    }

                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF('p', 'pt', 'a4');

                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    const margin = 40;
                    const lineHeight = 30;
                    const maxWidth = pageWidth - (margin * 2);

                    doc.setFont('Helvetica');
                    doc.setFontSize(14);

                    const paragraphs = text.split('\n');

                    let y = margin;

                    paragraphs.forEach(paragraph => {
                        const lines = doc.splitTextToSize(paragraph || ' ', maxWidth);

                        lines.forEach(line => {
                            if (y > pageHeight - margin) {
                                doc.addPage();
                                y = margin;
                            }

                            doc.text(line, pageWidth - margin, y, {
                                align: 'right'
                            });

                            y += lineHeight;
                        });

                        y += 8;
                    });

                    doc.save('Document.pdf');
                    hideLoad();
                    showToast('تم تحميل الملف');
                } catch (e) {
                    console.error(e);
                    hideLoad();
                    showToast('حدث خطأ أثناء إنشاء PDF', 'error');
                }
            }, 100);
        };
        let readerLang = 'ar';
        let readerGender = 'male';
        let readerVoicesCache = [];
        let readerUtterance = null;
        let readerManualVoiceURI = '';
        let readerWatchdog = null;

        function setReaderStatus(state) {
            const dot = document.getElementById('reader-status-dot');
            const text = document.getElementById('reader-status-text');
            if (!dot || !text) return;
            dot.classList.remove('bg-gray-300', 'bg-green-500', 'bg-amber-500', 'animate-pulse');
            if (state === 'playing') { dot.classList.add('bg-green-500', 'animate-pulse'); text.textContent = 'بيقرأ دلوقتي...'; }
            else if (state === 'paused') { dot.classList.add('bg-amber-500'); text.textContent = 'متوقف مؤقتاً'; }
            else { dot.classList.add('bg-gray-300'); text.textContent = 'جاهز'; }
        }

        function loadReaderVoices() {
            readerVoicesCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
            renderReaderVoiceSelect();
            const playBtn = document.getElementById('reader-play-btn');
            if (playBtn) playBtn.disabled = false;
        }
        function renderReaderVoiceSelect() {
            const sel = document.getElementById('reader-voice-select');
            if (!sel) return;
            const prevValue = sel.value;
            sel.innerHTML = '<option value="">تلقائي (حسب الاختيار فوق)</option>';
            const arVoices = readerVoicesCache.filter(v => v.lang && v.lang.toLowerCase().startsWith('ar'));
            const otherVoices = readerVoicesCache.filter(v => !v.lang || !v.lang.toLowerCase().startsWith('ar'));
            const addGroup = (label, voices) => {
                if (!voices.length) return;
                const group = document.createElement('optgroup');
                group.label = label;
                voices.forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v.voiceURI;
                    const isEgypt = /eg/i.test(v.lang || '') || /egypt|مصر/i.test(v.name || '');
                    opt.textContent = v.name + ' (' + v.lang + ')' + (isEgypt ? ' 🇪🇬' : '');
                    group.appendChild(opt);
                });
                sel.appendChild(group);
            };
            addGroup('عربي', arVoices);
            addGroup('لغات تانية', otherVoices);
            if (prevValue && readerVoicesCache.some(v => v.voiceURI === prevValue)) sel.value = prevValue;
        }
        if (window.speechSynthesis) {
            loadReaderVoices();
            window.speechSynthesis.onvoiceschanged = loadReaderVoices;
            setTimeout(() => { const b = document.getElementById('reader-play-btn'); if (b) b.disabled = false; }, 3000);
        } else {
            document.addEventListener('DOMContentLoaded', () => { const b = document.getElementById('reader-play-btn'); if (b) b.disabled = false; });
        }
        (function wireReaderVoiceSelect(){
            const sel = document.getElementById('reader-voice-select');
            if (sel) sel.addEventListener('change', () => { readerManualVoiceURI = sel.value; });
        })();

        function selectReaderVoice(lang, gender, btn) {
            readerLang = lang;
            readerGender = gender;
            document.querySelectorAll('.reader-voice-btn').forEach(b => {
                b.classList.remove('bg-pink-600', 'text-white', 'border-pink-600');
                b.classList.add('border-pink-200');
                b.removeAttribute('data-selected');
            });
            if (btn) {
                btn.classList.add('bg-pink-600', 'text-white', 'border-pink-600');
                btn.classList.remove('border-pink-200');
                btn.setAttribute('data-selected', 'true');
            }
        }

        function pickReaderVoice(lang, gender) {
            if (!readerVoicesCache.length) loadReaderVoices();
            const langVoices = readerVoicesCache.filter(v => v.lang && v.lang.toLowerCase().startsWith(lang));
            if (!langVoices.length) return null;

            const maleHints = ['male', 'man', 'majed', 'tarik', 'hamed', 'david', 'mark', 'daniel', 'fred', 'alex', 'george', 'yousef'];
            const femaleHints = ['female', 'woman', 'hoda', 'laila', 'zeina', 'salma', 'zira', 'susan', 'samantha', 'victoria', 'amira', 'fatima'];
            const hints = gender === 'male' ? maleHints : femaleHints;
            const otherHints = gender === 'male' ? femaleHints : maleHints;

            let match = langVoices.find(v => hints.some(h => v.name.toLowerCase().includes(h)));
            if (match) return match;

            const neutralVoices = langVoices.filter(v => !otherHints.some(h => v.name.toLowerCase().includes(h)));
            const pool = neutralVoices.length ? neutralVoices : langVoices;

            if (pool.length > 1) {
                return gender === 'male' ? pool[0] : pool[pool.length - 1];
            }
            return pool[0];
        }

        document.getElementById('reader-pdf-file').onchange = async (e) => {
            if (!e.target.files.length) return;
            const file = e.target.files[0];
            showLoad('استخراج النص...');
            try {
                let fullText = "";
                if (file.type === 'application/pdf') {
                    const pdf = await pdfjsLib.getDocument(new Uint8Array(await file.arrayBuffer())).promise;
                    for (let i = 1; i <= pdf.numPages; i++) {
                        await updateProgress(Math.round((i / pdf.numPages) * 100), `صفحة ${i}`);
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(it => it.str).join(' ').trim();
                        if (pageText) fullText += pageText + "\n\n";
                    }
                    if (!fullText.trim()) {
                        showLoad('الملف صورة، جاري القراءة بالـ OCR...');
                        const worker = await Tesseract.createWorker();
                        await worker.loadLanguage('ara+eng');
                        await worker.initialize('ara+eng');
                        for (let i = 1; i <= pdf.numPages; i++) {
                            await updateProgress(Math.round((i / pdf.numPages) * 100), `OCR صفحة ${i}`);
                            const p = await pdf.getPage(i); const vp = p.getViewport({ scale: 4.0 });
                            const c = document.createElement('canvas'), ctx = c.getContext('2d'); c.width = vp.width; c.height = vp.height;
                            await p.render({ canvasContext: ctx, viewport: vp }).promise;
                            const { data: { text } } = await worker.recognize(c);
                            if (text.trim() !== "") fullText += text + "\n\n";
                        }
                        await worker.terminate();
                    }
                } else if (file.type.startsWith('image/')) {
                    const worker = await Tesseract.createWorker();
                    await worker.loadLanguage('ara+eng');
                    await worker.initialize('ara+eng');
                    await updateProgress(50, 'تحليل الصورة...');
                    const imageUrl = URL.createObjectURL(file);
                    try {
                        const { data: { text } } = await worker.recognize(imageUrl);
                        fullText = text;
                    } finally {
                        URL.revokeObjectURL(imageUrl);
                    }
                    await worker.terminate();
                }
                document.getElementById('reader-text-area').value = fullText.trim();
                showToast('اكتملت القراءة');
            } catch (err) {
                console.error(err);
                showToast('خطأ في استخراج النص', 'error');
            }
            hideLoad();
        };

        function startReaderWatchdog() {
            stopReaderWatchdog();
            readerWatchdog = setInterval(() => {
                if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                    window.speechSynthesis.pause();
                    window.speechSynthesis.resume();
                }
            }, 12000);
        }
        function stopReaderWatchdog() {
            if (readerWatchdog) { clearInterval(readerWatchdog); readerWatchdog = null; }
        }

        function speakReaderText(text, isRetry) {
            const utter = new SpeechSynthesisUtterance(text);
            let voice = null;
            if (readerManualVoiceURI) voice = readerVoicesCache.find(v => v.voiceURI === readerManualVoiceURI) || null;
            if (!voice) voice = pickReaderVoice(readerLang, readerGender);
            utter.lang = voice ? voice.lang : (readerLang === 'ar' ? 'ar-SA' : 'en-US');
            if (voice) utter.voice = voice;

            const basePitch = parseFloat(document.getElementById('reader-pitch').value) || 1;
            const genderPitchAdjust = (!readerManualVoiceURI && (!voice || !(voice.name || '').toLowerCase().match(/male|female|man|woman/)))
                ? (readerGender === 'male' ? -0.15 : 0.15) : 0;
            utter.pitch = Math.min(2, Math.max(0, basePitch + genderPitchAdjust));
            utter.rate = parseFloat(document.getElementById('reader-rate').value) || 1;

            utter.onerror = (ev) => {
                console.error('speechSynthesis error:', ev.error);
                stopReaderWatchdog();
                if (ev.error === 'interrupted' || ev.error === 'canceled') { setReaderStatus('ready'); return; }
                if (!isRetry) { speakReaderText(text, true); return; }
                showToast('حصلت مشكلة في تشغيل الصوت، جرب تاني أو غيّر الصوت من "اختيار الصوت بدقة"', 'error');
                setReaderStatus('ready');
            };
            utter.onstart = () => { setReaderStatus('playing'); startReaderWatchdog(); };
            utter.onend = () => { stopReaderWatchdog(); setReaderStatus('ready'); };
            readerUtterance = utter;
            window.speechSynthesis.speak(utter);
        }

        document.getElementById('reader-play-btn').onclick = () => {
            if (!window.speechSynthesis) { showToast('المتصفح ده مش بيدعم القراءة الصوتية', 'error'); return; }
            const text = document.getElementById('reader-text-area').value.trim();
            if (!text) { showToast('محتاج نص أو ملف الأول', 'error'); return; }

            if (window.speechSynthesis.paused && readerUtterance) {
                window.speechSynthesis.resume();
                setReaderStatus('playing');
                startReaderWatchdog();
                return;
            }
            window.speechSynthesis.cancel();
            stopReaderWatchdog();
            speakReaderText(text, false);
        };
        document.getElementById('reader-pause-btn').onclick = () => {
            if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                window.speechSynthesis.pause();
                stopReaderWatchdog();
                setReaderStatus('paused');
            }
        };
        document.getElementById('reader-stop-btn').onclick = () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            stopReaderWatchdog();
            setReaderStatus('ready');
        };
        (function wireReaderDropZone(){
            const dz = document.querySelector('#page-reader .drop-zone');
            const input = document.getElementById('reader-pdf-file');
            if (!dz || !input) return;
            dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
            dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
            dz.addEventListener('drop', e => {
                e.preventDefault(); dz.classList.remove('dragover');
                if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); }
            });
        })();

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
        let roBytes = null, roPdf = null;
        document.getElementById('ro-file').onchange = async (e) => {
            showLoad('تجهيز الصفحات...'); roBytes = await e.target.files[0].arrayBuffer();
            roPdf = await pdfjsLib.getDocument(new Uint8Array(roBytes.slice(0))).promise;
            const grid = document.getElementById('ro-grid'); grid.innerHTML = '';
            for(let i=1; i<=roPdf.numPages; i++) {
                const p = await roPdf.getPage(i); const vp = p.getViewport({ scale: 0.45 });
                const c = document.createElement('canvas'); const ctx = c.getContext('2d'); c.width = vp.width; c.height = vp.height;
                await p.render({ canvasContext: ctx, viewport: vp }).promise;
                const div = document.createElement('div'); div.className = "p-2 bg-white border shadow-sm cursor-move relative rounded"; div.setAttribute('data-idx', i-1);
                div.innerHTML = `<div class="absolute top-1 right-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">${i}</div>`;
                c.className = "h-32 object-contain"; div.appendChild(c); grid.appendChild(div);
            }
            new Sortable(grid, {
                animation: 150,
                onEnd: () => {
                    Array.from(grid.children).forEach((el, index) => {
                        const badge = el.querySelector('.absolute');
                        if (badge) badge.textContent = index + 1;
                    });
                }
            });

            document.getElementById('ro-workspace').classList.remove('hidden');
            hideLoad();
            showToast('رتب الصفحات بالسحب والإفلات');
        };
        document.getElementById('ro-export').onclick = async () => {
            showLoad('جاري الحفظ...');
            try {
                const { PDFDocument } = PDFLib; const srcDoc = await PDFDocument.load(roBytes); const outDoc = await PDFDocument.create();
                const newOrder = Array.from(document.getElementById('ro-grid').children).map(el => parseInt(el.getAttribute('data-idx')));
                const copied = await outDoc.copyPages(srcDoc, newOrder); copied.forEach(p => outDoc.addPage(p));
                const bytes = await outDoc.save(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bytes])); a.download = 'Reordered.pdf'; a.click(); showToast('تم الحفظ بالترتيب الجديد');
            } catch(e) { showToast('حدث خطأ', 'error'); } hideLoad();
        };

        let prFile = null;
        const prFileInput = document.getElementById('pr-file');
        const prWorkspace = document.getElementById('pr-workspace');
        
        if (prFileInput) {
            prFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    prFile = e.target.files[0];
                    prWorkspace.classList.remove('hidden');
                    showToast('تم رفع الملف بنجاح، أدخل الباسورد الآن');
                }
            });
        }

        document.getElementById('pr-toggle-pass').onclick = () => {
            const input = document.getElementById('pr-pass');
            const icon = document.querySelector('#pr-toggle-pass i');

            input.type = input.type === 'password' ? 'text' : 'password';
            icon.className = input.type === 'password'
                ? 'fa-solid fa-eye'
                : 'fa-solid fa-eye-slash';
        };

        const prExportBtn = document.getElementById('pr-export');
        if (prExportBtn) {
            prExportBtn.addEventListener('click', async () => {
                const pass = document.getElementById('pr-pass').value;
                const confirmPass = document.getElementById('pr-pass-confirm').value;

                if (pass !== confirmPass) {
                    showToast('كلمتا المرور غير متطابقتين', 'error');
                    return;
                }
                if (!pass || pass.trim() === '') {
                    showToast('الرجاء إدخال الباسورد أولاً!', 'error');
                    return;
                }
                if (!prFile) return;

                showLoad('جاري تشفير الملف بباسورد حقيقي...');
                try {
                    const arrayBuffer = await prFile.arrayBuffer();
                    const bytes = new Uint8Array(arrayBuffer);
                    
                    const Encryptor = window.PDFEncryptLite;

                    if (Encryptor && typeof Encryptor.encryptPDF === 'function') {
                        const encryptedData = await Encryptor.encryptPDF(bytes, pass);
                        const blob = new Blob([encryptedData], { type: 'application/pdf' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `Locked_${prFile.name}`;
                            link.click();
                            showToast('تم التشفير! جرب تفتحه دلوقتي هيطلب باسورد');
                    } else {
                        showToast('خطأ: مكتبة التشفير غير متاحة', 'error');
                    }
                } catch (err) {
                    console.error(err);
                    showToast('حدث خطأ أثناء تشفير الملف', 'error');
                }
                hideLoad();
            });
        }


    

/* ===== بلوك 2 (كان في index.html من سطر 6404) ===== */
;
        let deferredPrompt;
        const installBtn = document.getElementById('app-download-btn');
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) {
                installBtn.classList.remove('hidden');
                installBtn.classList.add('flex');
            }
        });
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') deferredPrompt = null;
                    installBtn.classList.add('hidden');
                    installBtn.classList.remove('flex');
                }
            });
        }
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js').catch(err => console.error('SW register failed:', err));
            });
        }
        const musicTracks = [
            { title: 'موسيقى هادئة 1', src: 'Data/audio/music_1.mp3' }
            // ,{ title: 'اسم الأغنية الجديدة', src: 'Data/audio/music_2.mp3' }
        ];

        const siteMusic = document.getElementById('site-music');
        const musicToggle = document.getElementById('music-toggle');
        const musicPanel = document.getElementById('music-panel');
        const musicClose = document.getElementById('music-close');
        const musicPlay = document.getElementById('music-play');
        const musicPrev = document.getElementById('music-prev');
        const musicNext = document.getElementById('music-next');
        const musicMute = document.getElementById('music-mute');
        const musicLoopBtn = document.getElementById('music-loop');
        const musicVolume = document.getElementById('music-volume');
        const musicSeek = document.getElementById('music-seek');
        const musicCurrentTime = document.getElementById('music-current-time');
        const musicDuration = document.getElementById('music-duration');
        const musicCurrentTitle = document.getElementById('music-current-title');
        const musicTrackList = document.getElementById('music-track-list');

        let musicIndex = 0;
        let musicLoopOne = true;
        let musicSeeking = false;

        function formatMusicTime(sec) {
            if (!isFinite(sec) || isNaN(sec)) return '0:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        function renderMusicTrackList() {
            if (!musicTracks.length) {
                musicTrackList.innerHTML = '<div class="music-empty-hint"><i class="fa-solid fa-circle-info"></i> مفيش أغاني مضافة لسه، تقدر تضيف أغانيك من كود الصفحة.</div>';
                return;
            }

            musicTrackList.innerHTML = musicTracks.map((t, i) => `
                <div class="music-track ${i === musicIndex ? 'active' : ''}" data-index="${i}">
                    <i class="fa-solid ${i === musicIndex ? 'fa-volume-high' : 'fa-music'}"></i>
                    <span>${t.title}</span>
                </div>
            `).join('');

            musicTrackList.querySelectorAll('.music-track').forEach(el => {
                el.addEventListener('click', () => loadMusicTrack(parseInt(el.dataset.index), true));
            });
        }

        function loadMusicTrack(index, autoplay) {
            if (!musicTracks.length) return;

            musicIndex = (index + musicTracks.length) % musicTracks.length;
            const track = musicTracks[musicIndex];

            siteMusic.src = track.src;
            musicCurrentTitle.textContent = track.title;
            renderMusicTrackList();

            if (autoplay) {
                siteMusic.play().then(() => {
                    musicPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
                }).catch(() => {
                    console.log('المتصفح محتاج ضغطة من المستخدم لتشغيل الصوت.');
                });
            }
        }

        siteMusic.volume = 0.5;
        siteMusic.loop = musicLoopOne;
        renderMusicTrackList();
        if (musicTracks.length) loadMusicTrack(0, false);

        musicToggle.addEventListener('click', async () => {
            musicPanel.classList.toggle('show');

            if (siteMusic.paused && siteMusic.src) {
                try {
                    await siteMusic.play();
                    musicPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
                } catch (error) {
                    console.log('المتصفح محتاج ضغطة من المستخدم لتشغيل الصوت.');
                }
            }
        });

        musicClose.addEventListener('click', () => {
            musicPanel.classList.remove('show');
        });

        musicPlay.addEventListener('click', async () => {
            if (!siteMusic.src) return;

            if (siteMusic.paused) {
                await siteMusic.play();
                musicPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
            } else {
                siteMusic.pause();
                musicPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        });

        musicPrev.addEventListener('click', () => loadMusicTrack(musicIndex - 1, true));
        musicNext.addEventListener('click', () => loadMusicTrack(musicIndex + 1, true));

        musicMute.addEventListener('click', () => {
            siteMusic.muted = !siteMusic.muted;

            musicMute.innerHTML = siteMusic.muted
                ? '<i class="fa-solid fa-volume-xmark"></i>'
                : '<i class="fa-solid fa-volume-high"></i>';
            musicMute.classList.toggle('active', siteMusic.muted);
        });

        musicLoopBtn.addEventListener('click', () => {
            musicLoopOne = !musicLoopOne;
            siteMusic.loop = musicLoopOne;
            musicLoopBtn.classList.toggle('active', musicLoopOne);
        });

        musicVolume.addEventListener('input', () => {
            siteMusic.volume = parseFloat(musicVolume.value);

            if (siteMusic.volume > 0 && siteMusic.muted) {
                siteMusic.muted = false;
                musicMute.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                musicMute.classList.remove('active');
            }
        });

        siteMusic.addEventListener('timeupdate', () => {
            if (musicSeeking) return;

            musicCurrentTime.textContent = formatMusicTime(siteMusic.currentTime);
            musicDuration.textContent = formatMusicTime(siteMusic.duration);

            if (siteMusic.duration) {
                musicSeek.value = (siteMusic.currentTime / siteMusic.duration) * 100;
            }
        });

        musicSeek.addEventListener('input', () => { musicSeeking = true; });
        musicSeek.addEventListener('change', () => {
            if (siteMusic.duration) {
                siteMusic.currentTime = (musicSeek.value / 100) * siteMusic.duration;
            }
            musicSeeking = false;
        });

        siteMusic.addEventListener('ended', () => {
            if (!musicLoopOne) loadMusicTrack(musicIndex + 1, true);
        });
        let selectedTemplateType='lined';
        const templateNames={
          lined:'ورق مسطر',grid:'ورق مربعات',planner:'Study Planner',mindmap:'خريطة ذهنية',cv:'قالب CV عصري',notes:'ورق ملاحظات',
          cornell:'Cornell Notes',weekly:'Weekly Planner',checklist:'قائمة مهام',exam:'Exam / Answer Sheet',calendar:'تقويم شهري',habit:'Habit Tracker'
        };
        const TEMPLATE_SIZES={a4:[210,297],a5:[148,210],letter:[216,279]};
        const MARGINS={compact:'8mm',normal:'12mm',wide:'17mm'};
        const DENSITIES={dense:{line:'6.5mm',grid:'4mm'},normal:{line:'8mm',grid:'5mm'},relaxed:{line:'10mm',grid:'7mm'}};
        function templateSheetSize(size,orientation){let [w,h]=TEMPLATE_SIZES[size]||TEMPLATE_SIZES.a4;return orientation==='l'?[h,w]:[w,h];}
        function escapeHtml(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}

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

const pomoOriginalTitle=document.title;
const POMO_RING_C=2*Math.PI*115;
const pomoSoundOptions=[
  {id:'synth-chime',label:'نغمة افتراضية (مولدة داخليًا)',type:'synth'},
  {id:'pixabay-bell',label:'جرس تنبيه هادئ (Pixabay)',type:'url',url:'https://cdn.pixabay.com/download/audio/2021/09/27/audio_91211934db.mp3?filename=clock-alarm-8761.mp3'},
  {id:'pixabay-digital',label:'نغمة رقمية (Pixabay)',type:'url',url:'https://cdn.pixabay.com/download/audio/2021/12/14/audio_55d1afe69d.mp3?filename=electro-sports-rock-120-bpm-logo-12147.mp3'},
  {id:'pixabay-soft',label:'نغمة ناعمة (Pixabay)',type:'url',url:'https://cdn.pixabay.com/download/audio/2023/04/17/audio_ae4d57086a.mp3?filename=futuristic-beat-146661.mp3'}
];
const pomoSettings={focus:25,short:5,long:15,roundsBeforeLong:4,autostart:false,tick:false,notify:false,sound:'synth-chime',volume:70};
const pomoState={mode:'focus',total:25*60,remaining:25*60,running:false,timerId:null,round:1};
function pomoLoadSettings(){try{const raw=localStorage.getItem('eto-pomodoro-settings');if(raw)Object.assign(pomoSettings,JSON.parse(raw));}catch(e){}}
function pomoPersistSettings(){try{localStorage.setItem('eto-pomodoro-settings',JSON.stringify(pomoSettings));}catch(e){}}
function pomoDurationFor(mode){return Math.max(1,(mode==='focus'?pomoSettings.focus:mode==='short'?pomoSettings.short:pomoSettings.long))*60;}
function pomoModeLabel(mode){return mode==='focus'?'وقت التركيز':mode==='short'?'استراحة قصيرة':'استراحة طويلة';}
function pomoPlaySynthChime(vol){try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;const ctx=window.__pomoCtx||(window.__pomoCtx=new Ctx());const notes=[880,1108.7,1318.5];notes.forEach((freq,i)=>{const t=ctx.currentTime+i*0.16;const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(Math.max(.02,vol*.5),t+0.02);gain.gain.exponentialRampToValueAtTime(0.001,t+0.55);osc.connect(gain).connect(ctx.destination);osc.start(t);osc.stop(t+0.6);});}catch(e){}}
function pomoPlayTick(){try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;const ctx=window.__pomoCtx||(window.__pomoCtx=new Ctx());const t=ctx.currentTime;const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='square';osc.frequency.value=1000;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime((pomoSettings.volume/100)*.12,t+.005);gain.gain.exponentialRampToValueAtTime(0.001,t+.08);osc.connect(gain).connect(ctx.destination);osc.start(t);osc.stop(t+.09);}catch(e){}}
function playPomoSound(idOverride,volOverride){const soundId=idOverride||pomoSettings.sound;const opt=pomoSoundOptions.find(o=>o.id===soundId)||pomoSoundOptions[0];const vol=(volOverride!=null?volOverride:pomoSettings.volume)/100;if(opt.type==='synth'){pomoPlaySynthChime(vol);return;}try{const audio=new Audio(opt.url);audio.volume=vol;audio.addEventListener('error',()=>pomoPlaySynthChime(vol));const p=audio.play();if(p&&p.catch)p.catch(()=>pomoPlaySynthChime(vol));}catch(e){pomoPlaySynthChime(vol);}}
function pomoRenderModeButtons(){document.querySelectorAll('.pomo-mode-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===pomoState.mode));const card=document.getElementById('pomo-card');if(card)card.dataset.mode=pomoState.mode;}
function pomoRenderRounds(){const wrap=document.getElementById('pomo-rounds');if(!wrap)return;const n=Math.max(1,pomoSettings.roundsBeforeLong||4);wrap.innerHTML='';for(let i=1;i<=n;i++){const dot=document.createElement('span');dot.className='pomo-round-dot'+(i<pomoState.round?' done':'')+(i===pomoState.round&&pomoState.mode==='focus'?' current':'');wrap.appendChild(dot);}const info=document.createElement('span');info.className='pomo-round-info';info.textContent=`جولة ${Math.min(pomoState.round,n)} من ${n}`;wrap.appendChild(info);}
function pomoUpdateDisplay(){const m=Math.floor(pomoState.remaining/60),s=pomoState.remaining%60;const text=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;const timeEl=document.getElementById('pomo-time');if(timeEl)timeEl.textContent=text;const labelEl=document.getElementById('pomo-mode-label');if(labelEl)labelEl.textContent=pomoModeLabel(pomoState.mode);const frac=pomoState.total>0?pomoState.remaining/pomoState.total:0;const ring=document.getElementById('pomo-ring-fg');if(ring){ring.style.strokeDasharray=`${POMO_RING_C}`;ring.style.strokeDashoffset=`${POMO_RING_C*(1-frac)}`;}document.title=pomoState.running?`${text} • ${pomoModeLabel(pomoState.mode)}`:pomoOriginalTitle;pomoRenderRounds();}
function pomoUpdateToggleUI(){const icon=document.getElementById('pomo-toggle-icon');const text=document.getElementById('pomo-toggle-text');const btn=document.getElementById('pomo-toggle-btn');if(!icon||!text)return;if(pomoState.running){icon.className='fa-solid fa-pause';text.textContent='إيقاف مؤقت';btn?.classList.add('is-running');}else{icon.className='fa-solid fa-play';text.textContent=pomoState.remaining<pomoState.total?'استكمال':'ابدأ';btn?.classList.remove('is-running');}}
function pomoPulseCard(){const card=document.getElementById('pomo-card');if(!card)return;card.classList.add('pomo-pulse');setTimeout(()=>card.classList.remove('pomo-pulse'),900);}
function pomoNotify(finishedMode){if(!pomoSettings.notify||!('Notification'in window)||Notification.permission!=='granted')return;try{new Notification('Eto.Edu • بومودورو',{body:finishedMode==='focus'?'خلصت جلسة التركيز، خد استراحة 🎉':'خلصت الاستراحة، يلا نرجع نركز 💪'});}catch(e){}}
function pomoSwitchMode(mode){clearInterval(pomoState.timerId);pomoState.timerId=null;pomoState.running=false;pomoState.mode=mode;pomoState.total=pomoDurationFor(mode);pomoState.remaining=pomoState.total;pomoRenderModeButtons();pomoUpdateDisplay();pomoUpdateToggleUI();document.title=pomoOriginalTitle;}
function pomoHandleComplete(){clearInterval(pomoState.timerId);pomoState.timerId=null;pomoState.running=false;pomoState.remaining=0;pomoUpdateDisplay();const finishedMode=pomoState.mode;playPomoSound();pomoNotify(finishedMode);pomoPulseCard();showToast(finishedMode==='focus'?'جلسة تركيز تمام، خد استراحتك 🎉':'خلصت الاستراحة، يلا نبدأ جلسة تركيز جديدة');const n=Math.max(1,pomoSettings.roundsBeforeLong||4);let nextMode;if(finishedMode==='focus'){if(pomoState.round>=n){nextMode='long';pomoState.round=1;}else{nextMode='short';pomoState.round++;}}else{nextMode='focus';}pomoSwitchMode(nextMode);if(pomoSettings.autostart){setTimeout(()=>pomoStart(),700);}}
function pomoStart(){if(pomoState.timerId)return;pomoState.running=true;pomoUpdateToggleUI();pomoState.timerId=setInterval(()=>{pomoState.remaining--;if(pomoSettings.tick&&pomoState.remaining<=10&&pomoState.remaining>0){pomoPlayTick();}if(pomoState.remaining<=0){pomoHandleComplete();return;}pomoUpdateDisplay();},1000);pomoUpdateDisplay();}
function pomoPause(){clearInterval(pomoState.timerId);pomoState.timerId=null;pomoState.running=false;pomoUpdateToggleUI();document.title=pomoOriginalTitle;}
function pomoToggle(){if(pomoState.running)pomoPause();else pomoStart();}
function pomoReset(){clearInterval(pomoState.timerId);pomoState.timerId=null;pomoState.running=false;pomoState.total=pomoDurationFor(pomoState.mode);pomoState.remaining=pomoState.total;pomoUpdateDisplay();pomoUpdateToggleUI();document.title=pomoOriginalTitle;}
function pomoSkip(){clearInterval(pomoState.timerId);pomoState.timerId=null;pomoState.running=false;const n=Math.max(1,pomoSettings.roundsBeforeLong||4);let nextMode;if(pomoState.mode==='focus'){if(pomoState.round>=n){nextMode='long';pomoState.round=1;}else{nextMode='short';pomoState.round++;}}else{nextMode='focus';}pomoSwitchMode(nextMode);showToast('اتخطينا للجلسة الجاية');}
function pomoPopulateSoundSelect(){const sel=document.getElementById('pomo-sound');if(!sel||sel.dataset.filled)return;sel.dataset.filled='1';pomoSoundOptions.forEach(o=>{const opt=document.createElement('option');opt.value=o.id;opt.textContent=o.label;sel.appendChild(opt);});}
function pomoApplySettingsToUI(){const g=id=>document.getElementById(id);if(g('pomo-dur-focus'))g('pomo-dur-focus').value=pomoSettings.focus;if(g('pomo-dur-short'))g('pomo-dur-short').value=pomoSettings.short;if(g('pomo-dur-long'))g('pomo-dur-long').value=pomoSettings.long;if(g('pomo-rounds-count'))g('pomo-rounds-count').value=pomoSettings.roundsBeforeLong;if(g('pomo-autostart'))g('pomo-autostart').checked=!!pomoSettings.autostart;if(g('pomo-tick'))g('pomo-tick').checked=!!pomoSettings.tick;if(g('pomo-notify'))g('pomo-notify').checked=!!pomoSettings.notify;if(g('pomo-sound'))g('pomo-sound').value=pomoSettings.sound;if(g('pomo-volume'))g('pomo-volume').value=pomoSettings.volume;}
function pomoReadSettingsFromUI(){const g=id=>document.getElementById(id);pomoSettings.focus=Math.max(1,parseInt(g('pomo-dur-focus')?.value)||25);pomoSettings.short=Math.max(1,parseInt(g('pomo-dur-short')?.value)||5);pomoSettings.long=Math.max(1,parseInt(g('pomo-dur-long')?.value)||15);pomoSettings.roundsBeforeLong=Math.max(1,parseInt(g('pomo-rounds-count')?.value)||4);pomoSettings.autostart=!!g('pomo-autostart')?.checked;pomoSettings.tick=!!g('pomo-tick')?.checked;pomoSettings.notify=!!g('pomo-notify')?.checked;pomoSettings.sound=g('pomo-sound')?.value||'synth-chime';pomoSettings.volume=parseInt(g('pomo-volume')?.value)||70;}
function pomoSaveSettings(){pomoReadSettingsFromUI();pomoPersistSettings();if(!pomoState.running&&pomoState.remaining===pomoState.total){pomoState.total=pomoDurationFor(pomoState.mode);pomoState.remaining=pomoState.total;pomoUpdateDisplay();}pomoRenderRounds();showToast('اتحفظت إعدادات التايمر');}
function pomoTestSound(){const sel=document.getElementById('pomo-sound');const volEl=document.getElementById('pomo-volume');playPomoSound(sel?sel.value:undefined,volEl?parseInt(volEl.value):undefined);}
function pomoKeyHandler(e){if(e.code!=='Space')return;const pg=document.getElementById('page-pomodoro');if(!pg||pg.classList.contains('hidden'))return;const tag=(document.activeElement&&document.activeElement.tagName||'').toLowerCase();if(tag==='input'||tag==='textarea'||tag==='select')return;e.preventDefault();pomoToggle();}
function wirePomodoro(){pomoLoadSettings();pomoPopulateSoundSelect();pomoApplySettingsToUI();pomoState.total=pomoDurationFor(pomoState.mode);pomoState.remaining=pomoState.total;pomoRenderModeButtons();pomoUpdateDisplay();pomoUpdateToggleUI();pomoRenderRounds();
  document.getElementById('pomo-notify')?.addEventListener('change',e=>{if(e.target.checked&&'Notification'in window&&Notification.permission==='default'){Notification.requestPermission().then(perm=>{if(perm!=='granted'){e.target.checked=false;showToast('لازم توافق على تنبيهات المتصفح الأول','error');}});}else if(e.target.checked&&'Notification'in window&&Notification.permission==='denied'){e.target.checked=false;showToast('تنبيهات المتصفح متمنوعة، فعّلها من إعدادات المتصفح الأول','error');}});
  document.addEventListener('keydown',pomoKeyHandler);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wirePomodoro);else wirePomodoro();
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
function escapeHtml(str){const d=document.createElement('div');d.textContent=str??'';return d.innerHTML;}
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
    const pdf = await pdfjsLib.getDocument(new Uint8Array(await e.target.files[0].arrayBuffer())).promise;
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

/* ===== بلوك 3 (كان في index.html من سطر 7291) ===== */
;
(function(){
const FLD = "w-full h-12 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 px-4 text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10";
document.querySelectorAll('#page-grades .fld').forEach(el => { el.className = FLD + ' ' + el.className.replace('fld','') + (el.tagName === 'TEXTAREA' ? ' h-auto py-3' : ''); });


  const $ = id => document.getElementById(id);
  function toast(m, t){ if (typeof showToast === 'function') showToast(m, t || 'success'); }
  function loading(on, txt){
    const el = document.getElementById('global-loading');
    const tx = document.getElementById('global-loading-txt');
    if (tx) tx.textContent = txt || 'جاري المعالجة...';
    if (el) el.classList.toggle('hidden', !on);
  }


/* ============ الحالة ============ */
let students = [];   // {name, score}
const STORE = 'eto-grades-v1';

const SCALE = [
  { label: 'ممتاز',    min: 85, color: '#059669', bg: 'bg-emerald-500' },
  { label: 'جيد جدًا', min: 75, color: '#0ea5e9', bg: 'bg-sky-500' },
  { label: 'جيد',      min: 65, color: '#6366f1', bg: 'bg-indigo-500' },
  { label: 'مقبول',    min: 50, color: '#f59e0b', bg: 'bg-amber-500' },
  { label: 'ضعيف',     min: 0,  color: '#ef4444', bg: 'bg-red-500' },
];
const maxMark  = () => Math.max(parseFloat($('grd-g-max').value) || 0, 0.0001);
const passPct  = () => parseFloat($('grd-g-pass').value) || 0;
const pctOf    = s => s === '' || s === null || isNaN(s) ? null : (s / maxMark()) * 100;
const gradeOf  = p => p === null ? null : SCALE.find(g => p >= g.min);
const fmt      = n => (Math.round(n * 100) / 100).toString();

function save(){
  const data = {
    school: $('grd-g-school').value, cls: $('grd-g-class').value, subject: $('grd-g-subject').value,
    max: $('grd-g-max').value, pass: $('grd-g-pass').value, date: $('grd-g-date').value, students
  };
  try { localStorage.setItem(STORE, JSON.stringify(data)); } catch(e){}
}
function load(){
  try {
    const d = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (!d) return;
    $('grd-g-school').value = d.school || ''; $('grd-g-class').value = d.cls || '';
    $('grd-g-subject').value = d.subject || ''; $('grd-g-max').value = d.max || 20;
    $('grd-g-pass').value = d.pass || 50; $('grd-g-date').value = d.date || '';
    students = Array.isArray(d.students) ? d.students : [];
  } catch(e){}
}

/* ============ الجدول ============ */
function render(){
  const tb = $('grd-g-tbody'); tb.innerHTML = '';
  $('grd-g-empty').classList.toggle('hidden', students.length > 0);

  students.forEach((s, i) => {
    const p = pctOf(s.score), g = gradeOf(p);
    const tr = document.createElement('tr');
    tr.className = 'border-t border-gray-100 dark:border-slate-700';
    tr.innerHTML = `
      <td class="p-2 text-center font-black text-slate-400">${i+1}</td>
      <td class="p-2"><input class="cellinput font-bold px-2 py-2 rounded-lg focus:bg-gray-50 dark:focus:bg-slate-900" value="${(s.name||'').replace(/"/g,'&quot;')}" data-i="${i}" data-f="name"></td>
      <td class="p-2"><input type="number" step="any" min="0" max="${maxMark()}" class="cellinput text-center font-black px-2 py-2 rounded-lg bg-gray-50 dark:bg-slate-900" value="${s.score ?? ''}" data-i="${i}" data-f="score"></td>
      <td class="p-2 text-center font-bold text-slate-500">${p===null?'—':fmt(p)+'%'}</td>
      <td class="p-2 text-center"><span class="px-2 py-1 rounded-lg text-xs font-black" style="color:${g?g.color:'#94a3b8'};background:${g?g.color+'1a':'transparent'}">${g?g.label:'—'}</span></td>
      <td class="p-2 text-center"><button data-del="${i}" class="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><i class="fa-solid fa-xmark"></i></button></td>`;
    tb.appendChild(tr);
  });

  tb.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', e => {
      const i = +e.target.dataset.i, f = e.target.dataset.f;
      if (f === 'name') students[i].name = e.target.value;
      else {
        let v = e.target.value === '' ? '' : parseFloat(e.target.value);
        if (v !== '' && v > maxMark()) { v = maxMark(); e.target.value = v; toast('الدرجة أكبر من النهاية العظمى، ظبطناها', 'error'); }
        students[i].score = v;
      }
      save(); stats();
      if (f === 'score') refreshRow(i);
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.dataset.f === 'score') {
        e.preventDefault();
        const next = tb.querySelector(`input[data-f="score"][data-i="${+e.target.dataset.i + 1}"]`);
        if (next) { next.focus(); next.select(); }
      }
    });
  });
  tb.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { students.splice(+b.dataset.del,1); save(); render(); });
  stats();
}
function refreshRow(i){
  const tds = $('grd-g-tbody').children[i]?.children; if (!tds) return;
  const p = pctOf(students[i].score), g = gradeOf(p);
  tds[3].textContent = p===null ? '—' : fmt(p)+'%';
  const span = tds[4].firstElementChild;
  span.textContent = g ? g.label : '—';
  span.style.color = g ? g.color : '#94a3b8';
  span.style.background = g ? g.color+'1a' : 'transparent';
}

/* ============ الإحصائيات ============ */
function scored(){ return students.filter(s => s.score !== '' && s.score !== null && !isNaN(s.score)); }

function stats(){
  const list = scored();
  $('grd-g-stats-wrap').classList.toggle('hidden', list.length === 0);
  if (!list.length) return;

  const scores = list.map(s => +s.score);
  const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
  const sorted = [...list].sort((a,b)=> b.score - a.score);
  const passed = list.filter(s => pctOf(s.score) >= passPct()).length;

  $('grd-st-count').textContent = students.length;
  $('grd-st-avg').textContent = fmt(avg);
  $('grd-st-max').textContent = fmt(sorted[0].score);
  $('grd-st-max-name').textContent = sorted[0].name || '';
  $('grd-st-min').textContent = fmt(sorted[sorted.length-1].score);
  $('grd-st-min-name').textContent = sorted[sorted.length-1].name || '';
  $('grd-st-pass').textContent = Math.round(passed/list.length*100) + '%';
  $('grd-st-pass-sub').textContent = `${passed} ناجح / ${list.length - passed} راسب`;

  $('grd-g-dist').innerHTML = SCALE.map(g => {
    const n = list.filter(s => gradeOf(pctOf(s.score)).label === g.label).length;
    const w = Math.round(n/list.length*100);
    return `<div>
      <div class="flex justify-between text-sm font-black mb-1"><span style="color:${g.color}">${g.label}</span><span class="text-slate-500">${n} طالب</span></div>
      <div class="h-3 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden"><div class="h-full rounded-full ${g.bg}" style="width:${w}%"></div></div>
    </div>`;
  }).join('');

  const n = +$('grd-g-topn').value;
  const medals = ['🥇','🥈','🥉'];
  $('grd-g-top').innerHTML = sorted.slice(0, n).map((s,i) => `
    <div class="flex items-center gap-3 p-3 rounded-xl ${i<3?'bg-amber-50 dark:bg-amber-900/20':'bg-gray-50 dark:bg-slate-900'}">
      <span class="w-8 text-center font-black">${medals[i] || (i+1)}</span>
      <span class="flex-1 font-black truncate">${s.name || 'بدون اسم'}</span>
      <span class="font-black text-emerald-600">${fmt(s.score)}</span>
      <span class="text-xs font-bold text-slate-400">${fmt(pctOf(s.score))}%</span>
    </div>`).join('');
}

/* ============ الأحداث ============ */
$('grd-g-add-bulk').onclick = () => {
  const names = $('grd-g-bulk').value.split('\n').map(x => x.trim()).filter(Boolean);
  if (!names.length) return toast('اكتب الأسامي الأول', 'error');
  names.forEach(n => students.push({ name: n, score: '' }));
  $('grd-g-bulk').value = ''; save(); render();
  toast(`اتضاف ${names.length} طالب`);
  const first = $('grd-g-tbody').querySelector(`input[data-f="score"][data-i="${students.length - names.length}"]`);
  if (first) first.focus();
};
$('grd-g-add-rows').onclick = () => { for(let i=0;i<5;i++) students.push({name:'',score:''}); save(); render(); };
$('grd-g-sort').onclick = () => {
  students.sort((a,b) => (b.score===''?-1:+b.score) - (a.score===''?-1:+a.score));
  save(); render(); toast('اترتبوا من الأعلى للأقل');
};
$('grd-g-clear').onclick = () => { if(confirm('هتمسح كل الطلاب والدرجات. أكيد؟')) { students = []; save(); render(); } };
['grd-g-school','grd-g-class','grd-g-subject','grd-g-max','grd-g-pass','grd-g-date'].forEach(id => $(id).addEventListener('input', () => { save(); render(); }));
$('grd-g-topn').onchange = stats;

/* ============ بناء ورقة الطباعة ============ */
function sheetHeader(title){
  const d = $('grd-g-date').value ? new Date($('grd-g-date').value).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG');
  return `<div style="text-align:center;border-bottom:3px double #0f766e;padding-bottom:14px;margin-bottom:18px">
      <div style="font-size:13px;font-weight:700;color:#475569">${$('grd-g-school').value || ''}</div>
      <div style="font-size:24px;font-weight:900;color:#0f766e;margin:6px 0">${title}</div>
      <div style="font-size:13px;font-weight:700;color:#334155">
        ${$('grd-g-subject').value ? 'المادة: ' + $('grd-g-subject').value : ''}
        ${$('grd-g-class').value ? ' &nbsp;|&nbsp; الفصل: ' + $('grd-g-class').value : ''}
        &nbsp;|&nbsp; الدرجة من: ${fmt(maxMark())} &nbsp;|&nbsp; ${d}
      </div>
    </div>`;
}
function statsBlock(){
  const list = scored(); if (!list.length) return '';
  const scores = list.map(s => +s.score);
  const avg = scores.reduce((a,b)=>a+b,0)/scores.length;
  const sorted = [...list].sort((a,b)=>b.score-a.score);
  const passed = list.filter(s => pctOf(s.score) >= passPct()).length;
  const cell = (l,v) => `<td style="border:1px solid #cbd5e1;padding:8px"><div style="font-size:11px;color:#64748b;font-weight:700">${l}</div><div style="font-size:16px;font-weight:900">${v}</div></td>`;
  const dist = SCALE.map(g => {
    const n = list.filter(s => gradeOf(pctOf(s.score)).label === g.label).length;
    return `<td style="border:1px solid #cbd5e1;padding:8px"><div style="font-size:11px;font-weight:700;color:${g.color}">${g.label}</div><div style="font-size:16px;font-weight:900">${n}</div></td>`;
  }).join('');
  return `<table style="margin-top:18px"><tr>
      ${cell('عدد الطلاب', students.length)}${cell('المتوسط', fmt(avg))}
      ${cell('أعلى درجة', fmt(sorted[0].score))}${cell('أقل درجة', fmt(sorted[sorted.length-1].score))}
      ${cell('نسبة النجاح', Math.round(passed/list.length*100)+'%')}
    </tr></table>
    <table style="margin-top:10px"><tr>${dist}</tr></table>`;
}
function rowsHtml(list, withRank){
  return list.map((s,i) => {
    const p = pctOf(s.score), g = gradeOf(p);
    return `<tr>
      <td>${withRank ? i+1 : i+1}</td>
      <td class="name">${s.name || ''}</td>
      <td>${s.score === '' || s.score === null ? '' : fmt(s.score)}</td>
      <td>${p === null ? '' : fmt(p)+'%'}</td>
      <td style="color:${g?g.color:'#000'};font-weight:900">${g ? g.label : ''}</td>
    </tr>`;
  }).join('');
}
function buildSheet(kind){
  const isTop = kind === 'top';
  const list = isTop
    ? [...scored()].sort((a,b)=>b.score-a.score).slice(0, +$('grd-g-topn').value)
    : students;
  const title = isTop ? 'كشف أوائل الطلاب' : 'كشف درجات الطلاب';
  const head = `<tr><th style="width:50px">${isTop?'الترتيب':'م'}</th><th>اسم الطالب</th><th style="width:90px">الدرجة</th><th style="width:80px">النسبة</th><th style="width:110px">التقدير</th></tr>`;
  const sign = `<div style="display:flex;justify-content:space-between;margin-top:34px;font-size:13px;font-weight:900;color:#334155">
      <div>المعلم: .............................</div><div>مدير المدرسة: .............................</div></div>`;
  return `<div class="sheet">${sheetHeader(title)}<table><thead>${head}</thead><tbody>${rowsHtml(list, isTop)}</tbody></table>${isTop ? '' : statsBlock()}${sign}
      <div style="text-align:center;margin-top:22px;font-size:10px;color:#94a3b8">اتعمل بواسطة Eto.Edu</div></div>`;
}

/* ============ PDF ============ */
async function toPdf(html, filename){
  loading(true, 'جاري إنشاء الـ PDF...');
  const stage = $('grd-print-stage');
  stage.innerHTML = html;
  await new Promise(r => setTimeout(r, 120));
  try {
    const canvas = await html2canvas(stage.firstElementChild, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw = 210, ph = 297;
    const pagePx = Math.floor(canvas.width * (ph / pw));   // ارتفاع الصفحة بالبكسل
    let y = 0, page = 0;
    while (y < canvas.height) {
      const h = Math.min(pagePx, canvas.height - y);
      const part = document.createElement('canvas');
      part.width = canvas.width; part.height = h;
      part.getContext('2d').drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (page++) pdf.addPage();
      pdf.addImage(part.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, (h / canvas.width) * pw);
      y += h;
    }
    pdf.save(filename);
    toast('اتحمّل الـ PDF');
  } catch(e){ console.error(e); toast('حصلت مشكلة في التصدير', 'error'); }
  stage.innerHTML = '';
  loading(false);
}
$('grd-exp-full').onclick = () => { if(!students.length) return toast('الكشف فاضي','error'); toPdf(buildSheet('full'), `كشف درجات ${$('grd-g-subject').value || ''}.pdf`); };
$('grd-exp-top').onclick  = () => { if(!scored().length) return toast('لسه مفيش درجات','error'); toPdf(buildSheet('top'), 'كشف الأوائل.pdf'); };
$('grd-exp-print').onclick = () => {
  const w = window.open('', '_blank');
  w.document.write(`<html dir="rtl"><head><meta charset="utf-8"><title>طباعة</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <style>body{margin:0;font-family:Cairo,sans-serif}.sheet{width:100%;padding:24px}
    table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:7px;font-size:13px;text-align:center}
    th{background:#eff6ff;font-weight:900}td.name{text-align:right;font-weight:700}</style></head>
    <body>${buildSheet('full')}</body></html>`);
  w.document.close(); setTimeout(()=> w.print(), 600);
};
$('grd-exp-xlsx').onclick = () => {
  if (!students.length) return toast('الكشف فاضي','error');
  const rows = [
    [$('grd-g-school').value || '', '', '', '', ''],
    ['المادة', $('grd-g-subject').value || '', 'الفصل', $('grd-g-class').value || '', 'الدرجة من', fmt(maxMark())],
    [],
    ['م', 'اسم الطالب', 'الدرجة', 'النسبة %', 'التقدير']
  ];
  students.forEach((s,i) => {
    const p = pctOf(s.score), g = gradeOf(p);
    rows.push([i+1, s.name || '', s.score === '' ? '' : +s.score, p===null?'':+fmt(p), g?g.label:'']);
  });
  const list = scored();
  if (list.length){
    const avg = list.reduce((a,b)=>a + +b.score,0)/list.length;
    const sorted = [...list].sort((a,b)=>b.score-a.score);
    rows.push([], ['المتوسط', fmt(avg)], ['أعلى درجة', fmt(sorted[0].score), sorted[0].name],
      ['أقل درجة', fmt(sorted[sorted.length-1].score), sorted[sorted.length-1].name],
      ['نسبة النجاح', Math.round(list.filter(s=>pctOf(s.score)>=passPct()).length/list.length*100)+'%']);
  }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{wch:6},{wch:28},{wch:10},{wch:10},{wch:14}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'كشف الدرجات');
  XLSX.writeFile(wb, `كشف درجات ${$('grd-g-subject').value || ''}.xlsx`);
  toast('اتحمّل ملف الإكسل');
};

load();
if (!$('grd-g-date').value) $('grd-g-date').value = new Date().toISOString().slice(0,10);
render();

})();
(function(){

const INP = "w-full h-12 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 px-4 mb-3 text-slate-800 dark:text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10";
const LBL = "block text-sm font-black text-slate-700 dark:text-slate-200 mb-2";
document.querySelectorAll('#page-certificate .inp').forEach(el => el.className = INP + (el.tagName === 'TEXTAREA' ? ' h-auto py-3' : ''));
document.querySelectorAll('#page-certificate .lbl').forEach(el => el.className = LBL);


  const $ = id => document.getElementById(id);
  function toast(m, t){ if (typeof showToast === 'function') showToast(m, t || 'success'); }
  function loading(on, txt){
    const el = document.getElementById('global-loading');
    const tx = document.getElementById('global-loading-txt');
    if (tx) tx.textContent = txt || 'جاري المعالجة...';
    if (el) el.classList.toggle('hidden', !on);
  }


/* ================== الخطوط ================== */
const FONTS = [
  'Cairo','Tajawal','Almarai','Amiri','Reem Kufi','El Messiri','Changa','Lalezar','Aref Ruqaa',
  'Scheherazade New','Markazi Text','Noto Kufi Arabic','Noto Naskh Arabic','Mada','Rakkas','Lemonada',
  'Harmattan','IBM Plex Sans Arabic','Baloo Bhaijaan 2','Katibeh','Jomhuria','Gulzar','Vibes','Alkalami'
];
const loaded = new Set(['Cairo','Amiri','Tajawal','Aref Ruqaa','Reem Kufi']);
function ensureFont(name){
  if (loaded.has(name)) return;
  loaded.add(name);
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=' + name.replace(/ /g,'+') + ':wght@400;700&display=swap';
  document.head.appendChild(l);
}
function fillFontSelect(sel, def){
  sel.innerHTML = FONTS.map(f => `<option value="${f}" ${f===def?'selected':''}>${f}</option>`).join('');
}
fillFontSelect($('crt-f-font-title'), 'Amiri');
fillFontSelect($('crt-f-font-body'), 'Cairo');
fillFontSelect($('crt-f-sig-font'), 'Aref Ruqaa');

/* ================== القوالب ================== */
const PALETTES = [
  { n:'ذهبي كلاسيك', bg:'#fffdf7', accent:'#b8860b', text:'#1f2937' },
  { n:'أزرق ملكي',   bg:'#f7fbff', accent:'#1d4ed8', text:'#0f172a' },
  { n:'أخضر زمردي',  bg:'#f6fdfa', accent:'#047857', text:'#0f172a' },
  { n:'نبيتي',       bg:'#fff8f8', accent:'#9f1239', text:'#1f2937' },
  { n:'بنفسجي',      bg:'#fbf8ff', accent:'#6d28d9', text:'#1f2937' },
  { n:'فيروزي',      bg:'#f5fdfe', accent:'#0e7490', text:'#0f172a' },
  { n:'رمادي أنيق',  bg:'#fafafa', accent:'#334155', text:'#111827' },
  { n:'برتقالي دافئ',bg:'#fffaf4', accent:'#c2410c', text:'#1f2937' },
  { n:'كحلي',        bg:'#f8fafc', accent:'#1e293b', text:'#0f172a' },
  { n:'وردي هادئ',   bg:'#fff7fa', accent:'#be185d', text:'#1f2937' },
];
const FRAMES = [
  { id:'classic',  n:'كلاسيك'        },
  { id:'royal',    n:'فخم مزخرف'     },
  { id:'band',     n:'شريط جانبي'    },
  { id:'wave',     n:'موجة'          },
  { id:'geometric',n:'زخرفة هندسية'  },
];
$('crt-f-frame').innerHTML = FRAMES.map(f => `<option value="${f.id}">${f.n}</option>`).join('');

function frameSVG(frame, c, bg){
  const W = 1123, H = 794, s = `width="100%" height="100%" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"`;
  const rect = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  if (frame === 'classic') {
    return `<svg ${s}>${rect}
      <rect x="26" y="26" width="${W-52}" height="${H-52}" fill="none" stroke="${c}" stroke-width="7"/>
      <rect x="44" y="44" width="${W-88}" height="${H-88}" fill="none" stroke="${c}" stroke-width="2" opacity=".65"/>
      ${[[26,26],[W-26,26],[26,H-26],[W-26,H-26]].map(([x,y])=>`<rect x="${x-13}" y="${y-13}" width="26" height="26" fill="${c}" transform="rotate(45 ${x} ${y})"/>`).join('')}
    </svg>`;
  }
  if (frame === 'royal') {
    return `<svg ${s}>${rect}
      <rect x="18" y="18" width="${W-36}" height="${H-36}" fill="none" stroke="${c}" stroke-width="20" opacity=".16"/>
      <rect x="40" y="40" width="${W-80}" height="${H-80}" fill="none" stroke="${c}" stroke-width="4"/>
      <rect x="54" y="54" width="${W-108}" height="${H-108}" fill="none" stroke="${c}" stroke-width="1.5" opacity=".7"/>
      ${[[40,40,1,1],[W-40,40,-1,1],[40,H-40,1,-1],[W-40,H-40,-1,-1]].map(([x,y,dx,dy])=>
        `<path d="M${x} ${y+dy*92} Q ${x+dx*8} ${y+dy*30} ${x+dx*92} ${y}" fill="none" stroke="${c}" stroke-width="10" opacity=".55"/>
         <circle cx="${x+dx*30}" cy="${y+dy*30}" r="7" fill="${c}"/>`).join('')}
    </svg>`;
  }
  if (frame === 'band') {
    return `<svg ${s}>${rect}
      <rect x="${W-118}" y="0" width="118" height="${H}" fill="${c}"/>
      <rect x="${W-140}" y="0" width="12" height="${H}" fill="${c}" opacity=".35"/>
      <circle cx="${W-59}" cy="120" r="34" fill="${bg}" opacity=".9"/>
      <circle cx="${W-59}" cy="120" r="24" fill="none" stroke="${c}" stroke-width="3"/>
      <rect x="60" y="48" width="${W-230}" height="${H-96}" fill="none" stroke="${c}" stroke-width="2" opacity=".45"/>
      <path d="M0 ${H} L 180 ${H} L 0 ${H-180} Z" fill="${c}" opacity=".12"/>
    </svg>`;
  }
  if (frame === 'wave') {
    return `<svg ${s}>${rect}
      <path d="M0 0 H${W} V120 C ${W*0.72} 210, ${W*0.28} 30, 0 128 Z" fill="${c}" opacity=".92"/>
      <path d="M0 0 H${W} V78 C ${W*0.7} 176, ${W*0.3} 6, 0 96 Z" fill="${c}" opacity=".35"/>
      <path d="M0 ${H} H${W} V${H-120} C ${W*0.72} ${H-210}, ${W*0.28} ${H-30}, 0 ${H-128} Z" fill="${c}" opacity=".92"/>
      <path d="M0 ${H} H${W} V${H-78} C ${W*0.7} ${H-176}, ${W*0.3} ${H-6}, 0 ${H-96} Z" fill="${c}" opacity=".35"/>
    </svg>`;
  }
  return `<svg ${s}>${rect}
    <defs><pattern id="p-${c.replace('#','')}" width="46" height="46" patternUnits="userSpaceOnUse">
      <path d="M23 3 L43 23 L23 43 L3 23 Z" fill="none" stroke="${c}" stroke-width="2.4" opacity=".85"/>
      <circle cx="23" cy="23" r="4" fill="${c}" opacity=".6"/>
    </pattern></defs>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#p-${c.replace('#','')})" opacity=".55"/>
    <rect x="58" y="58" width="${W-116}" height="${H-116}" fill="${bg}"/>
    <rect x="58" y="58" width="${W-116}" height="${H-116}" fill="none" stroke="${c}" stroke-width="3"/>
    <rect x="72" y="72" width="${W-144}" height="${H-144}" fill="none" stroke="${c}" stroke-width="1.2" opacity=".6"/>
  </svg>`;
}

/* شبكة الـ 50 قالب */
const TEMPLATES = [];
PALETTES.forEach(p => FRAMES.forEach(f => TEMPLATES.push({ name: `${p.n} — ${f.n}`, frame: f.id, ...p })));

function buildTemplateGrid(){
  $('crt-tpl-grid').innerHTML = TEMPLATES.map((t,i) => `
    <div class="cert-tpl-card overflow-hidden bg-gray-50 dark:bg-slate-900 p-1" data-i="${i}">
      <div class="cert-tpl-thumb">${frameSVG(t.frame, t.accent, t.bg)}
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
          <span style="font-family:Amiri,serif;font-size:13px;font-weight:700;color:${t.accent}">شهادة تقدير</span>
        </div>
      </div>
      <p class="text-[10px] font-black text-center mt-1 text-slate-500 truncate">${i+1}. ${t.name}</p>
    </div>`).join('');
  $('crt-tpl-grid').querySelectorAll('.cert-tpl-card').forEach(card => card.onclick = () => applyTemplate(+card.dataset.i));
}
function applyTemplate(i){
  const t = TEMPLATES[i];
  $('crt-f-bg').value = t.bg; $('crt-f-accent').value = t.accent; $('crt-f-text').value = t.text; $('crt-f-frame').value = t.frame;
  $('crt-tpl-name').textContent = `قالب ${i+1}: ${t.name}`;
  $('crt-tpl-grid').querySelectorAll('.cert-tpl-card').forEach(c => c.classList.toggle('active', +c.dataset.i === i));
  $('crt-tpl-modal').classList.add('hidden');
  render();
}
$('crt-tpl-random').onclick = () => applyTemplate(Math.floor(Math.random()*TEMPLATES.length));
$('crt-open-templates').onclick = () => $('crt-tpl-modal').classList.remove('hidden');
$('crt-tpl-close').onclick = () => $('crt-tpl-modal').classList.add('hidden');
$('crt-tpl-modal').addEventListener('click', e => { if (e.target === $('crt-tpl-modal')) $('crt-tpl-modal').classList.add('hidden'); });

/* ================== التابات ================== */
document.querySelectorAll('#page-certificate .crt-tab').forEach(btn => btn.onclick = () => {
  const tab = btn.dataset.tab;
  document.querySelectorAll('#page-certificate .crt-tab').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('#page-certificate .crt-panel').forEach(p => p.classList.toggle('hidden', p.id !== 'crt-panel-' + tab));
});

/* ================== التوقيع ================== */
let sigMode = 'text', sigImg = null, logoImg = null, sigPos = 'left';
document.querySelectorAll('#page-certificate .sig-tab').forEach(b => b.onclick = () => {
  sigMode = b.dataset.sig;
  document.querySelectorAll('#page-certificate .sig-tab').forEach(x => {
    const on = x.dataset.sig === sigMode;
    x.className = 'sig-tab h-10 rounded-xl font-black text-sm ' + (on ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-slate-700');
  });
  $('crt-sig-text-box').classList.toggle('hidden', sigMode !== 'text');
  $('crt-sig-image-box').classList.toggle('hidden', sigMode !== 'image');
  render();
});
document.querySelectorAll('#page-certificate .pos-tab').forEach(b => b.onclick = () => {
  sigPos = b.dataset.pos;
  document.querySelectorAll('#page-certificate .pos-tab').forEach(x => {
    const on = x.dataset.pos === sigPos;
    x.className = 'pos-tab h-10 rounded-xl font-black text-sm ' + (on ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-slate-700');
  });
  render();
});

function cleanWhite(dataUrl){
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = img.width; cv.height = img.height;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0,0,cv.width,cv.height), a = d.data;
      for (let i=0;i<a.length;i+=4){
        const lum = (a[i]*0.299 + a[i+1]*0.587 + a[i+2]*0.114);
        if (lum > 205) a[i+3] = 0;                        // خلفية بيضا -> شفاف
        else if (lum > 140) a[i+3] = Math.round((205-lum)/65*255);  // حواف ناعمة
        else { a[i]=Math.min(a[i],40); a[i+1]=Math.min(a[i+1],40); a[i+2]=Math.min(a[i+2],48); }
      }
      ctx.putImageData(d,0,0);
      res(cv.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}
function readFile(file){ return new Promise(r => { const fr = new FileReader(); fr.onload = e => r(e.target.result); fr.readAsDataURL(file); }); }

$('crt-f-sig-img').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  loading(true, 'جاري تجهيز التوقيع...');
  let url = await readFile(f);
  if ($('crt-f-sig-clean').checked) url = await cleanWhite(url);
  sigImg = url;
  $('crt-sig-preview').classList.remove('hidden');
  $('crt-sig-preview').innerHTML = `<img src="${url}" style="max-height:70px;margin:auto">
    <p class="text-[11px] font-bold text-slate-400 mt-2">لو التوقيع باهت أو ناقص حروف، اقفل «تفريغ الخلفية» وجرّب صورة أوضح.</p>`;
  loading(false); render();
};
$('crt-f-sig-clean').onchange = () => { if ($('crt-f-sig-img').files[0]) $('crt-f-sig-img').onchange({ target: $('crt-f-sig-img') }); };
$('crt-f-logo').onchange = async e => { const f = e.target.files[0]; if (!f) return; logoImg = await readFile(f); render(); };

/* ================== الرسم ================== */
function sigBlock(){
  const size = +$('crt-f-sig-size').value;
  const accent = $('crt-f-accent').value;
  let inner;
  if (sigMode === 'image' && sigImg) {
    inner = `<img src="${sigImg}" style="max-width:${size}px;max-height:${Math.round(size*0.55)}px;object-fit:contain;display:block;margin:0 auto 4px">`;
  } else {
    ensureFont($('crt-f-sig-font').value);
    inner = `<div style="font-family:'${$('crt-f-sig-font').value}',serif;font-size:34px;color:${accent};margin-bottom:2px">${$('crt-f-sig-text').value || ''}</div>`;
  }
  return `<div style="min-width:220px;text-align:center">
      ${inner}
      <div style="width:200px;height:2px;background:${accent};opacity:.6;margin:6px auto"></div>
      <div style="font-size:14px;font-weight:700;opacity:.75">التوقيع</div>
    </div>`;
}
function sealBlock(){
  if (!$('crt-f-seal').checked) return '<div style="min-width:220px"></div>';
  const c = $('crt-f-accent').value;
  return `<div style="min-width:220px;display:flex;justify-content:center">
    <div style="width:104px;height:104px;border-radius:50%;border:3px solid ${c};display:flex;flex-direction:column;align-items:center;justify-content:center;color:${c};transform:rotate(-8deg)">
      <div style="font-size:11px;font-weight:700;letter-spacing:1px">ETO.EDU</div>
      <div style="font-family:Amiri,serif;font-size:21px;font-weight:700;line-height:1.1">تقدير</div>
      <div style="font-size:10px;font-weight:700">${new Date($('crt-f-date').value || Date.now()).getFullYear()}</div>
    </div></div>`;
}
function dateBlock(){
  const d = $('crt-f-date').value ? new Date($('crt-f-date').value).toLocaleDateString('ar-EG') : '';
  return `<div style="min-width:220px;text-align:center">
    <div style="font-size:20px;font-weight:700;margin-bottom:8px">${d}</div>
    <div style="width:200px;height:2px;background:${$('crt-f-accent').value};opacity:.6;margin:6px auto"></div>
    <div style="font-size:14px;font-weight:700;opacity:.75">التاريخ</div></div>`;
}

function render(){
  const accent = $('crt-f-accent').value, text = $('crt-f-text').value, bg = $('crt-f-bg').value;
  const ft = $('crt-f-font-title').value, fb = $('crt-f-font-body').value;
  ensureFont(ft); ensureFont(fb);
  const frame = $('crt-f-frame').value;
  const inset = frame === 'band' ? '96px 190px 96px 110px' : '92px 130px';

  $('crt-cert-frame').innerHTML = frameSVG(frame, accent, bg);

  const bottom = sigPos === 'right'
      ? [sigBlock(), sealBlock(), dateBlock()]
      : sigPos === 'center' ? [dateBlock(), sigBlock(), sealBlock()]
      : [dateBlock(), sealBlock(), sigBlock()];

  $('crt-cert-content').style.padding = inset;
  $('crt-cert-content').style.color = text;
  $('crt-cert-content').style.fontFamily = `'${fb}', 'Cairo', sans-serif`;
  $('crt-cert-content').innerHTML = `
    ${logoImg ? `<img src="${logoImg}" style="height:66px;object-fit:contain;margin-bottom:8px">` : ''}
    <div style="font-size:16px;font-weight:700;letter-spacing:2px;opacity:.7">${$('crt-f-school').value || ''}</div>
    <div style="font-family:'${ft}',serif;font-size:56px;font-weight:700;color:${accent};margin:6px 0 4px">${$('crt-f-title').value || ''}</div>
    <div style="width:170px;height:3px;background:${accent};opacity:.7;margin-bottom:18px"></div>
    <div style="font-size:19px;opacity:.85">تشهد إدارة المدرسة بمنح هذه الشهادة إلى</div>
    <div style="font-family:'${ft}',serif;font-size:${$('crt-f-name-size').value}px;font-weight:700;color:${accent};margin:10px 0 6px;line-height:1.25">${$('crt-f-name').value || ''}</div>
    <div style="font-size:19px;line-height:2;max-width:760px;opacity:.9">${($('crt-f-phrase').value || '').replace(/\n/g,'<br>')}</div>
    <div style="display:flex;gap:26px;margin-top:14px;font-size:17px;font-weight:700;color:${accent}">
      ${$('crt-f-subject').value ? `<span>المادة: ${$('crt-f-subject').value}</span>` : ''}
      ${$('crt-f-class').value ? `<span>${$('crt-f-class').value}</span>` : ''}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;width:100%;margin-top:auto;padding-top:34px">
      ${bottom.join('')}
    </div>`;
}

/* مقاس المعاينة */
function fitStage(){
  const w = $('crt-stage-wrap').clientWidth - 24;
  const scale = Math.min(1, w / 1123);
  $('crt-cert').style.transform = `scale(${scale})`;
  $('crt-stage-wrap').style.height = (794 * scale + 24) + 'px';
}
window.addEventListener('resize', fitStage);

/* ================== التحميل ================== */
async function capture(){
  const prev = $('crt-cert').style.transform;
  $('crt-cert').style.transform = 'none';
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 150));
  const canvas = await html2canvas($('crt-cert'), { scale: 2, backgroundColor: null, useCORS: true, width: 1123, height: 794 });
  $('crt-cert').style.transform = prev;
  return canvas;
}
$('crt-dl-png').onclick = async () => {
  loading(true, 'جاري تجهيز الصورة...');
  try {
    const c = await capture();
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png'); a.download = `شهادة ${$('crt-f-name').value || ''}.png`; a.click();
    toast('اتحمّلت الصورة');
  } catch(e){ console.error(e); toast('حصلت مشكلة في التحميل','error'); }
  loading(false);
};
$('crt-dl-pdf').onclick = async () => {
  loading(true, 'جاري تجهيز الـ PDF...');
  try {
    const c = await capture();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.addImage(c.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
    pdf.save(`شهادة ${$('crt-f-name').value || ''}.pdf`);
    toast('اتحمّل الـ PDF');
  } catch(e){ console.error(e); toast('حصلت مشكلة في التحميل','error'); }
  loading(false);
};
$('crt-dl-bulk').onclick = async () => {
  const names = $('crt-f-bulk').value.split('\n').map(x => x.trim()).filter(Boolean);
  if (!names.length) return toast('اكتب أسامي الطلاب في خانة «شهادة لكل طالب»','error');
  const original = $('crt-f-name').value;
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('l', 'mm', 'a4');
  try {
    for (let i = 0; i < names.length; i++){
      loading(true, `جاري عمل شهادة ${i+1} من ${names.length}...`);
      $('crt-f-name').value = names[i]; render();
      const c = await capture();
      if (i) pdf.addPage();
      pdf.addImage(c.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);
    }
    pdf.save(`شهادات ${$('crt-f-class').value || 'الطلاب'}.pdf`);
    toast(`اتعمل ${names.length} شهادة`);
  } catch(e){ console.error(e); toast('حصلت مشكلة في التصدير','error'); }
  $('crt-f-name').value = original; render();
  loading(false);
};
['crt-f-title','crt-f-name','crt-f-phrase','crt-f-subject','crt-f-class','crt-f-school','crt-f-date','crt-f-bg','crt-f-accent','crt-f-text','crt-f-sig-text']
  .forEach(id => $(id).addEventListener('input', render));
['crt-f-frame','crt-f-font-title','crt-f-font-body','crt-f-sig-font','crt-f-seal'].forEach(id => $(id).addEventListener('change', render));
$('crt-f-phrase-preset').onchange = e => { if (e.target.value !== 'custom'){ $('crt-f-phrase').value = e.target.value; render(); } };
$('crt-f-name-size').oninput = e => { $('crt-name-size-val').textContent = e.target.value; render(); };
$('crt-f-sig-size').oninput = e => { $('crt-sig-size-val').textContent = e.target.value; render(); };

$('crt-f-date').value = new Date().toISOString().slice(0,10);
buildTemplateGrid();
applyTemplate(0);
fitStage();
  window.certFitStage = fitStage;

})();
(function(){
  const _navigate = window.navigate;
  window.navigate = function(pageId, addHistory){
    _navigate(pageId, addHistory);

    if (pageId === 'certificate' && typeof window.certFitStage === 'function') {
      requestAnimationFrame(window.certFitStage);
    }

    if (pageId === 'calculator' && typeof window.initEtoCalculator === 'function') {
      requestAnimationFrame(window.initEtoCalculator);
    }
  };
})();

/* ===== بلوك 4 (كان في index.html من سطر 7950) ===== */
;
(function(){

const TEACHER_IMAGE_LOCAL_BASE = 'Data/Teachers_images/';
const TEACHER_IMAGE_GITHUB_BASE = 'https://raw.githubusercontent.com/academicsociety2/Pdf-Manager/main/Data/Teachers_images/';
const TEACHER_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

    const TEACHER_IMAGE_INDEX = {
        'عمر رعية':'عمر رعيه.png',
        'محمد صلاح':'محمد صلاح عربي.png',
        'محمد صلاح (English)':'محمد صلاح انجليزي.png',
        'ناصر البطل':'ناصر البطل.png',
        'أحمد الجوهري':'الجوهري.png',
        'الكلياني':'الكيلاني.png',
        'دكتور جوزيف عادل':'جوزيف عادل.png',
        'خالد صقر':'خالد صقر .png',
        'رضا الفاروق':'رضا الفاروق.png',
        'شادي الشرقاوي':'شادي الشرقاوي.png',
        'عبدالجواد':'عبد الجواد.png',
        'عبد الحميد حامد':'عبد الحميد حامد.png',
        'عبد الرحمن الشامي':'عبد الرحمن الشامي.png',
        'عبدالمعبود':'عبد المعبود.png',
        'عمر الشربيني':'عمر الشربيني.png'
    };

    const SUBJECT_NAMES = {
        arabic:'عربي',
        english:'إنجليزي',
        physics:'فيزياء',
        chemistry:'كيمياء',
        math:'رياضيات',
        biology:'أحياء'
    };

    const PLATFORM_TYPES = {
        learning_platform:'منصات تعليمية',
        subject_platform:'منصات مدرسين',
        official:'جهات رسمية',
        book_store:'كتب ومتاجر',
        tool:'أدوات',
        simulation:'محاكاة',
        calculator:'حاسبات',
        reference:'مراجع',
        learning:'تعلم',
        study_tool:'مذاكرة',
        productivity:'إنتاجية',
        storage:'تخزين'
    };

    let etoData = {teachers:[],platforms:[]};
    let platformFilter = 'all';

function teacherImage(name){
    const file = TEACHER_IMAGE_INDEX[name] || 'default.png';

    const cleanFile = String(file)
        .replace(/^https?:\/\/[^/]+\/?/i, '')
        .replace(/^.*[\\/]/, '')
        .trim();

    return {
        local: `${TEACHER_IMAGE_LOCAL_BASE}${encodeURIComponent(cleanFile)}`,
        github: `${TEACHER_IMAGE_GITHUB_BASE}${encodeURIComponent(cleanFile)}`
    };
}

    function findTeacherPlatform(teacher){
        const id = teacher.platforms?.[0];
        if(!id) return null;

        return (etoData.platforms || []).find(p => {
            const a = (p.name_en || '').toLowerCase().replace(/[^a-z0-9]/g,'');
            const b = String(id).toLowerCase().replace(/[^a-z0-9]/g,'');
            return a.includes(b) || b.includes(a);
        }) || null;
    }

    function renderTeachers(){
        const grid = document.getElementById('teachers-special-grid');
        if(!grid) return;

        grid.innerHTML = (etoData.teachers || []).map(teacher => {

            const image = teacherImage(teacher.name);
            const subject = SUBJECT_NAMES[teacher.subject] || teacher.subject || 'عام';
            const platform = findTeacherPlatform(teacher);

            return `
                <article class="teacher-special-card">
                    <div class="teacher-special-photo">
                            ${
                                image
                                ? `
<img src="${image.local}"
     alt="${teacher.name}"
     loading="lazy"
     decoding="async"
     fetchpriority="low"
     data-github="${image.github}"
     style="width:100%;height:100%;object-fit:cover;image-rendering:auto"
     onerror="if(this.dataset.github && this.src !== this.dataset.github){this.src=this.dataset.github;}else{this.src='Data/icons/icon-512.png';}">
                              `
                                : `<i class="fa-solid fa-user-tie text-6xl text-blue-400"></i>`
                            }
                    </div>

                    <div class="teacher-special-body">
                        <h3 class="teacher-special-name">${teacher.name}</h3>

                        <div class="teacher-special-chips">
                            <span class="teacher-special-chip">
                                <i class="fa-solid fa-book ml-1"></i>${subject}
                            </span>

                            <span class="teacher-special-chip">
                                <i class="fa-solid fa-language ml-1"></i>${teacher.lang || 'عام'}
                            </span>
                        </div>

                        ${
                            platform?.url
                            ? `
                                <button class="teacher-special-btn"
                                    onclick='openEtoPlatform(${JSON.stringify(platform.url)},${JSON.stringify(platform.name_ar || platform.name_en)})'>
                                    <i class="fa-solid fa-display ml-1"></i>
                                    دخول منصة المدرس
                                </button>
                              `
                            : `
                                <button class="teacher-special-btn"
                                    onclick="navigate('my-platforms')">
                                    <i class="fa-solid fa-layer-group ml-1"></i>
                                    مشاهدة المنصات
                                </button>
                              `
                        }
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderPlatformFilters(){
        const wrap = document.getElementById('platform-special-filters');
        if(!wrap) return;

        const types = [
            'all',
            ...new Set(
                (etoData.platforms || [])
                .map(p => p.type)
                .filter(Boolean)
            )
        ];

        wrap.innerHTML = types.map(type => `
            <button
                onclick="setEtoPlatformFilter('${type}')"
                class="platform-special-filter ${platformFilter === type ? 'active' : ''}">
                ${type === 'all' ? 'الكل' : (PLATFORM_TYPES[type] || type)}
            </button>
        `).join('');
    }

    function renderPlatforms(){
        const grid = document.getElementById('platform-special-grid');
        if(!grid) return;

        renderPlatformFilters();

        const query =
            (document.getElementById('platform-special-search')?.value || '')
            .trim()
            .toLowerCase();

        const items = (etoData.platforms || []).filter(platform => {

            const typeMatch =
                platformFilter === 'all' ||
                platform.type === platformFilter;

            const text =
                `${platform.name_ar || ''} ${platform.name_en || ''} ${platform.field || ''}`
                .toLowerCase();

            return typeMatch && (!query || text.includes(query));
        });

        grid.innerHTML = items.length
            ? items.map(platform => `
                <article class="platform-special-card">
<div class="platform-special-icon">
    <img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(platform.url)}&sz=256"
         alt="${platform.name}"
         loading="lazy"
         decoding="async"
         style="width:42px;height:42px;object-fit:contain;border-radius:10px"
         onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
    <i class="fa-solid fa-globe" style="display:none"></i>
</div>

                    <h3>${platform.name_ar || platform.name_en}</h3>

                    <p>
                        ${PLATFORM_TYPES[platform.type] || platform.type || 'منصة'}
                        ${platform.field ? ` • ${platform.field}` : ''}
                    </p>

                    <button
                        class="platform-special-open"
                        onclick='openEtoPlatform(${JSON.stringify(platform.url)},${JSON.stringify(platform.name_ar || platform.name_en)})'>
                        <i class="fa-solid fa-display ml-1"></i>
                        فتح داخل الموقع
                    </button>
                </article>
            `).join('')
            : `
                <div class="col-span-full text-center py-16 text-slate-400 font-bold">
                    <i class="fa-solid fa-face-frown text-3xl mb-3"></i>
                    <div>مفيش منصة مطابقة للبحث</div>
                </div>
            `;
    }

    window.setEtoPlatformFilter = function(type){
        platformFilter = type;
        renderPlatforms();
    };

    window.openEtoPlatform = function(url,title){
        const viewer = document.getElementById('eto-platform-viewer');
        const frame = document.getElementById('eto-platform-frame');
        const titleEl = document.getElementById('eto-platform-title');

        if(!viewer || !frame) return;

        titleEl.textContent = title || 'المنصة';
        frame.src = url;
        viewer.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.closeEtoPlatform = function(){
        const viewer = document.getElementById('eto-platform-viewer');
        const frame = document.getElementById('eto-platform-frame');

        if(!viewer) return;

        viewer.classList.remove('show');

        if(frame){
            frame.src = 'about:blank';
        }

        document.body.style.overflow = '';
    };

    document.getElementById('platform-special-search')?.addEventListener(
        'input',
        renderPlatforms
    );

    document.getElementById('eto-platform-viewer')?.addEventListener(
        'click',
        e => {
            if(e.target.id === 'eto-platform-viewer'){
                closeEtoPlatform();
            }
        }
    );

    async function loadEtoStudentPages(){

        try{

            const DATA_URLS = [
                'Data/tools.json',
                'https://raw.githubusercontent.com/academicsociety2/Pdf-Manager/main/Data/tools.json'
            ];

            let lastError = null;

            for(const url of DATA_URLS){
                try{
                    const response = await fetch(url,{cache:'no-store'});

                    if(!response.ok){
                        throw new Error(`HTTP ${response.status}`);
                    }

                    etoData = await response.json();
                    lastError = null;
                    break;

                }catch(error){
                    lastError = error;
                }
            }

            if(lastError){
                throw new Error('تعذر تحميل tools.json محليًا أو من GitHub');
            }

            renderTeachers();
            renderPlatforms();

        }catch(error){

            console.error('Eto student pages:',error);

            const teacherGrid =
                document.getElementById('teachers-special-grid');

            const platformGrid =
                document.getElementById('platform-special-grid');

            if(teacherGrid){
                teacherGrid.innerHTML = `
                    <div class="col-span-full text-center py-16 text-red-400 font-bold">
                        تعذر تحميل بيانات المدرسين من Data/tools.json
                    </div>
                `;
            }

            if(platformGrid){
                platformGrid.innerHTML = `
                    <div class="col-span-full text-center py-16 text-red-400 font-bold">
                        تعذر تحميل بيانات المنصات من Data/tools.json
                    </div>
                `;
            }
        }
    }

    function scienceEscape(value){

        const div=document.createElement('div');

        div.textContent=value ?? '';

        return div.innerHTML;

    }


    function sciencePreviewUrl(url){

        if(!url) return '';

        const match=
            url.match(/\/file\/d\/([^/]+)/);

        if(match){

            return(
                'https://drive.google.com/file/d/' +
                match[1] +
                '/preview'
            );

        }

        return url;

    }


    window.scienceOpenPdf=function(url,title){

        const modal=
            document.getElementById(
                'dev-pdf-viewer'
            );

        const frame=
            document.getElementById(
                'dev-pdf-frame'
            );

        const titleEl=
            document.getElementById(
                'dev-pdf-title'
            );


        if(!modal || !frame) return;


        if(titleEl){

            titleEl.textContent=
                title || 'شرح المادة';

        }


        frame.src=
            sciencePreviewUrl(url);


        modal.classList.remove('hidden');

        document.body.style.overflow=
            'hidden';

    };


    function scienceClosePdf(){

        const modal=
            document.getElementById(
                'dev-pdf-viewer'
            );

        const frame=
            document.getElementById(
                'dev-pdf-frame'
            );


        if(modal){

            modal.classList.add('hidden');

        }


        if(frame){

            frame.src='about:blank';

        }


        document.body.style.overflow='';

    }


    async function loadScienceLibrary(){

        const grid=
            document.getElementById(
                'science-subjects-grid'
            );

        const empty=
            document.getElementById(
                'science-empty'
            );


        if(!grid) return;


        try{

            const response=
                await fetch(
                    SCIENCE_DATA_URL,
                    {
                        cache:'no-store'
                    }
                );


            if(!response.ok){

                grid.innerHTML='';

                if(empty){

                    empty.classList.remove(
                        'hidden'
                    );

                }

                return;

            }


            const data=
                await response.json();


            const subjects=
                Array.isArray(data.subjects)
                    ? data.subjects
                    : [];


            if(!subjects.length){

                grid.innerHTML='';

                if(empty){

                    empty.classList.remove(
                        'hidden'
                    );

                }

                return;

            }


            if(empty){

                empty.classList.add(
                    'hidden'
                );

            }


            grid.innerHTML=
                subjects
                    .filter(
                        subject =>
                            Array.isArray(
                                subject.items
                            ) &&
                            subject.items.length
                    )
                    .map(subject=>`

                        <section
                            class="science-subject-block">

                            <div
                                class="science-subject-head">

                                <div
                                    class="science-subject-title">

                                    <div
                                        class="science-subject-icon">

                                        <i class="fa-solid fa-flask"></i>

                                    </div>

                                    <div>

                                        <h3>
                                            ${scienceEscape(
                                                subject.name ||
                                                'مادة'
                                            )}
                                        </h3>

                                        <span>
                                            ${subject.items.length}
                                            ملف
                                        </span>

                                    </div>

                                </div>

                                <i
                                    class="fa-solid fa-folder-open text-slate-300">
                                </i>

                            </div>


                            <div
                                class="science-material-list">

                                ${subject.items.map(item=>{

                                    const openUrl=
                                        item.driveUrl ||
                                        item.url ||
                                        '';

                                    const downloadUrl=
                                        item.url ||
                                        item.driveUrl ||
                                        '#';


                                    return `

                                        <article
                                            class="science-material-card">

                                            <div
                                                class="science-material-icon">

                                                <i class="fa-solid fa-file-pdf"></i>

                                            </div>


                                            <div
                                                class="science-material-content">

                                                <strong>
                                                    ${scienceEscape(
                                                        item.title ||
                                                        'ملف بدون اسم'
                                                    )}
                                                </strong>

                                                <span>

                                                    ${scienceEscape(
                                                        item.type ||
                                                        'شرح'
                                                    )}

                                                    ${
                                                        item.description
                                                        ? ' • ' +
                                                          scienceEscape(
                                                              item.description
                                                          )
                                                        : ''
                                                    }

                                                </span>

                                            </div>


                                            ${
                                                openUrl
                                                ? `

                                                    <button
                                                        type="button"
                                                        class="science-material-btn"
                                                        onclick='scienceOpenPdf(
                                                            ${JSON.stringify(openUrl)},
                                                            ${JSON.stringify(item.title || "شرح المادة")}
                                                        )'>

                                                        <i class="fa-solid fa-eye"></i>
                                                        معاينة

                                                    </button>

                                                `
                                                : ''
                                            }


                                            ${
                                                downloadUrl
                                                ? `

                                                    <a
                                                        href="${scienceEscape(downloadUrl)}"
                                                        target="_blank"
                                                        rel="noopener"
                                                        class="science-material-btn">

                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>

                                                    </a>

                                                `
                                                : ''
                                            }

                                        </article>

                                    `;

                                }).join('')}

                            </div>

                        </section>

                    `)
                    .join('');


            const closeBtn=
                document.getElementById(
                    'dev-pdf-close-btn'
                );


            if(closeBtn){

                closeBtn.onclick=
                    scienceClosePdf;

            }


            const viewer=
                document.getElementById(
                    'dev-pdf-viewer'
                );


            if(viewer){

                viewer.onclick=e=>{

                    if(
                        e.target.id===
                        'dev-pdf-viewer'
                    ){

                        scienceClosePdf();

                    }

                };

            }


        }catch(error){

            console.error(
                'College Science JSON:',
                error
            );


            grid.innerHTML='';

            if(empty){

                empty.classList.remove(
                    'hidden'
                );

            }

        }

    }


    loadScienceLibrary();



    document.getElementById('dev-pdf-close-btn')?.addEventListener(
        'click',
        scienceClosePdf
    );

    document.getElementById('dev-pdf-viewer')?.addEventListener(
        'click',
        e => {
            if(e.target.id === 'dev-pdf-viewer'){
                scienceClosePdf();
            }
        }
    );


    loadEtoStudentPages();

})();

/* ===== بلوك 5 (كان في index.html من سطر 8731) ===== */
;
(function () {
    const fileInput = document.getElementById('pdf-to-word-file');
    const fileNameEl = document.getElementById('pdf-to-word-name');
    const previewEl = document.getElementById('pdf-to-word-preview');
    const convertBtn = document.getElementById('pdf-to-word-btn');
    const statusEl = document.getElementById('pdf-to-word-status');

    if (!fileInput || !fileNameEl || !convertBtn) return;

    let selectedPdfFile = null;
    let pdfDocument = null;

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        selectedPdfFile = file;
        pdfDocument = null;

        fileNameEl.textContent = file.name;

        if (previewEl) {
            previewEl.value = '';
        }

        if (statusEl) {
            statusEl.textContent = 'جاري تجهيز ملف PDF...';
        }

        convertBtn.disabled = true;

        try {
            const bytes = new Uint8Array(await file.arrayBuffer());

            pdfDocument = await pdfjsLib.getDocument({
                data: bytes
            }).promise;

            if (statusEl) {
                statusEl.textContent = `تم تجهيز الملف - ${pdfDocument.numPages} صفحة`;
            }

            convertBtn.disabled = false;
            convertBtn.classList.remove('hidden');
            document.getElementById('pdf-to-word-info')?.classList.remove('hidden');
            const pagesEl = document.getElementById('pdf-to-word-pages');
            if (pagesEl) pagesEl.textContent = `${pdfDocument.numPages} صفحة`;

            if (typeof showToast === 'function') {
                showToast(`الملف جاهز - ${pdfDocument.numPages} صفحة`);
            }
        } catch (error) {
            console.error(error);

            if (statusEl) {
                statusEl.textContent = 'حصل خطأ أثناء قراءة ملف الـ PDF';
            }

            if (typeof showToast === 'function') {
                showToast('حصل خطأ أثناء قراءة ملف الـ PDF', 'error');
            }
        }
    });

    convertBtn.addEventListener('click', async () => {
        if (!selectedPdfFile || !pdfDocument) return;

        if (!window.docx) {
            if (typeof showToast === 'function') {
                showToast('مكتبة Word لم يتم تحميلها، اعمل تحديث للصفحة', 'error');
            }
            return;
        }

        try {
            convertBtn.disabled = true;

            if (typeof showLoad === 'function') {
                showLoad('بنحول صفحات الـ PDF إلى Word...');
            }

            const {
                Document,
                Packer,
                Paragraph,
                ImageRun
            } = window.docx;

            const sections = [];

            for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex++) {
                await updateProgress(
                    Math.round((pageIndex / pdfDocument.numPages) * 100),
                    `تحويل الصفحة ${pageIndex} من ${pdfDocument.numPages}`
                );

                const page = await pdfDocument.getPage(pageIndex);

                const viewport = page.getViewport({
                    scale: 2
                });

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = Math.ceil(viewport.width);
                canvas.height = Math.ceil(viewport.height);

                await page.render({
                    canvasContext: ctx,
                    viewport: viewport
                }).promise;

                const imageBase64 = canvas.toDataURL(
                    'image/jpeg',
                    0.95
                );

                const imageData = Uint8Array.from(
                    atob(imageBase64.split(',')[1]),
                    char => char.charCodeAt(0)
                );

                const imgWidthPx = 794;
                const imgHeightPx = Math.round(
                    imgWidthPx * (viewport.height / viewport.width)
                );

                const pageWidthTwips = imgWidthPx * 15;
                const pageHeightTwips = imgHeightPx * 15 + 40;

                sections.push({
                    properties: {
                        page: {
                            size: {
                                width: pageWidthTwips,
                                height: pageHeightTwips
                            },
                            margin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0
                            }
                        }
                    },
                    children: [
                        new Paragraph({
                            spacing: {
                                before: 0,
                                after: 0
                            },
                            children: [
                                new ImageRun({
                                    data: imageData,
                                    transformation: {
                                        width: imgWidthPx,
                                        height: imgHeightPx
                                    }
                                })
                            ]
                        })
                    ]
                });

                canvas.width = 1;
                canvas.height = 1;
            }

            const doc = new Document({
                sections: sections
            });

            const blob = await Packer.toBlob(doc);

            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download =
                selectedPdfFile.name.replace(/\.pdf$/i, '') + '.docx';

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);

            if (statusEl) {
                statusEl.textContent =
                    'تم تحويل الـ PDF إلى Word بنجاح';
            }

            if (typeof showToast === 'function') {
                showToast('تم تحويل PDF إلى Word بنجاح');
            }

        } catch (error) {
            console.error(error);

            if (statusEl) {
                statusEl.textContent =
                    'حصل خطأ أثناء إنشاء ملف Word';
            }

            if (typeof showToast === 'function') {
                showToast(
                    'حصل خطأ أثناء إنشاء ملف Word',
                    'error'
                );
            }
        } finally {
            convertBtn.disabled = false;

            if (typeof hideLoad === 'function') {
                hideLoad();
            }
        }
    });
})();

/* ===== بلوك 6 (كان في index.html من سطر 8955) ===== */
;
/* ===== ملف الإجابات + تصدير أسئلة الشيت JSON ===== */
(function () {
    const AK_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'];
    let akRows = [];

    function akDownload(filename, blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function akSafeName(text, fallback) {
        const clean = String(text || '').replace(/[\\/:*?"<>|]+/g, ' ').trim();
        return clean || fallback;
    }

    function akReadJsonFile(file, onData) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            let data;
            try {
                data = JSON.parse(ev.target.result);
            } catch (err) {
                showToast('ملف الـ JSON مش سليم، اتأكد من صيغته', 'error');
                return;
            }
            onData(data);
        };
        reader.readAsText(file, 'UTF-8');
    }

    function akRender() {
        const wrap = document.getElementById('ak-table');
        const actions = document.getElementById('ak-actions');
        const summary = document.getElementById('ak-summary');
        if (!wrap) return;

        if (!akRows.length) {
            wrap.innerHTML = '';
            actions.classList.add('hidden');
            summary.classList.add('hidden');
            return;
        }

        wrap.innerHTML = akRows.map((row, i) => {
            const picks = row.opts > 0
                ? Array.from({ length: row.opts }, (_, k) => `
                    <button type="button" data-ak-pick="${i}:${k}" class="w-10 h-10 rounded-full border-2 text-sm font-bold transition ${row.correct === k ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-emerald-400'}">${AK_LETTERS[k] || (k + 1)}</button>`).join('')
                : '<span class="text-xs text-gray-400 font-bold">سؤال مقالي - مش بيتصحح تلقائي</span>';

            const pointsBox = row.opts > 0
                ? `<label class="flex items-center gap-2 text-xs font-bold text-gray-500 shrink-0">الدرجة
                        <input type="number" min="0" step="0.5" value="${row.points}" data-ak-points="${i}" class="w-20 p-2 border rounded-lg text-center dark:text-gray-800 bg-white">
                   </label>`
                : '';

            return `
                <div class="flex items-center gap-3 flex-wrap p-3 border rounded-xl bg-gray-50 dark:bg-slate-900/40 dark:border-slate-600">
                    <div class="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black shrink-0">${i + 1}</div>
                    <div class="flex gap-2 flex-wrap flex-1">${picks}</div>
                    ${pointsBox}
                </div>`;
        }).join('');

        actions.classList.remove('hidden');
        summary.classList.remove('hidden');
        akUpdateSummary();
    }

    function akUpdateSummary() {
        const summary = document.getElementById('ak-summary');
        if (!summary) return;
        const graded = akRows.filter(r => r.opts > 0);
        const done = graded.filter(r => r.correct !== null).length;
        const total = graded.reduce((sum, r) => sum + (Number(r.points) || 0), 0);
        summary.textContent = `تم تحديد ${done} من ${graded.length} إجابة • مجموع الدرجات: ${total}`;
    }

    function akBuild(force) {
        const count = Math.min(200, Math.max(1, parseInt(document.getElementById('ak-count').value, 10) || 0));
        const opts = parseInt(document.getElementById('ak-opts').value, 10) || 4;
        const points = Number(document.getElementById('ak-points').value);
        const pts = isNaN(points) || points < 0 ? 1 : points;

        if (!force && akRows.some(r => r.correct !== null) && !confirm('ده هيمسح الإجابات اللي اخترتها، متأكد؟')) return;

        document.getElementById('ak-count').value = count;
        akRows = Array.from({ length: count }, () => ({ opts: opts, correct: null, points: pts }));
        akRender();
    }

    function akCollect() {
        if (!akRows.length) {
            showToast('جهّز جدول الأسئلة الأول', 'error');
            return null;
        }

        const missing = akRows.findIndex(r => r.opts > 0 && r.correct === null);
        if (missing >= 0) {
            showToast(`حدد الإجابة الصح للسؤال رقم ${missing + 1}`, 'error');
            return null;
        }

        const answers = akRows.map((r, i) => ({
            q: i + 1,
            opts: r.opts,
            correct: r.opts > 0 ? r.correct : null,
            points: r.opts > 0 ? (Number(r.points) || 0) : 0
        }));

        return {
            type: 'eto-answers',
            v: 1,
            title: (document.getElementById('ak-title').value || '').trim(),
            total: answers.length,
            totalPoints: answers.reduce((sum, a) => sum + a.points, 0),
            answers: answers
        };
    }

    function akExportJson() {
        const data = akCollect();
        if (!data) return;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        akDownload(akSafeName(data.title, 'ملف الإجابات') + ' - إجابات.json', blob);
        showToast('تم تحميل ملف الإجابات');
    }

    async function akExportPdf() {
        const data = akCollect();
        if (!data) return;

        if (!window.html2canvas || !window.jspdf) {
            showToast('تعذر تحميل مكتبات التصدير، تأكد من الاتصال بالإنترنت', 'error');
            return;
        }

        const perPage = 24;
        const pages = Math.ceil(data.answers.length / perPage);

        showLoad('جاري تجهيز ملف الـ PDF...');

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();

            for (let p = 0; p < pages; p++) {
                const chunk = data.answers.slice(p * perPage, (p + 1) * perPage);
                const box = document.createElement('div');
                box.dir = 'rtl';
                box.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#ffffff;color:#0f172a;padding:40px;box-sizing:border-box;font-family:Cairo,Arial,sans-serif;';

                const rowsHtml = chunk.map(a => {
                    const ans = a.correct === null ? 'مقالي' : (AK_LETTERS[a.correct] || (a.correct + 1));
                    return `<tr>
                        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:800;">${a.q}</td>
                        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;font-weight:800;">${ans}</td>
                        <td style="border:1px solid #cbd5e1;padding:6px;text-align:center;">${a.points}</td>
                    </tr>`;
                }).join('');

                const footer = (p === pages - 1)
                    ? `<div style="margin-top:14px;text-align:center;font-weight:800;">عدد الأسئلة: ${data.total} • مجموع الدرجات: ${data.totalPoints}</div>`
                    : '';

                box.innerHTML = `
                    <div style="text-align:center;margin-bottom:16px;">
                        <div style="font-size:26px;font-weight:900;">${escapeHtml(data.title || 'ملف الإجابات')}</div>
                        <div style="font-size:14px;color:#64748b;font-weight:700;margin-top:4px;">نموذج الإجابة</div>
                    </div>
                    <table style="width:100%;border-collapse:collapse;font-size:15px;">
                        <thead>
                            <tr style="background:#e2e8f0;">
                                <th style="border:1px solid #cbd5e1;padding:8px;">رقم السؤال</th>
                                <th style="border:1px solid #cbd5e1;padding:8px;">الإجابة الصحيحة</th>
                                <th style="border:1px solid #cbd5e1;padding:8px;">الدرجة</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                    ${footer}`;

                document.body.appendChild(box);
                const canvas = await html2canvas(box, { scale: 2, backgroundColor: '#ffffff' });
                box.remove();

                if (p > 0) pdf.addPage();

                let imgW = pageW;
                let imgH = pageW * (canvas.height / canvas.width);
                if (imgH > pageH) {
                    imgW = imgW * (pageH / imgH);
                    imgH = pageH;
                }

                pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (pageW - imgW) / 2, 0, imgW, imgH);
            }

            pdf.save(akSafeName(data.title, 'ملف الإجابات') + ' - إجابات.pdf');
            showToast('تم تحميل الـ PDF');
        } catch (err) {
            console.error(err);
            showToast('حصل خطأ أثناء تجهيز الـ PDF', 'error');
        } finally {
            hideLoad();
        }
    }

    function akImportQuestions(data) {
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
        if (!list) {
            showToast('صيغة الملف غير مدعومة، لازم يكون فيه مصفوفة أسئلة', 'error');
            return;
        }

        const defPoints = Number(document.getElementById('ak-points').value);
        const pts = isNaN(defPoints) || defPoints < 0 ? 1 : defPoints;

        akRows = list
            .filter(item => item && (item.text || item.image))
            .map(item => ({
                opts: Array.isArray(item.answers)
                    ? item.answers.filter(a => a !== null && a !== undefined && String(a).trim() !== '').length
                    : 0,
                correct: null,
                points: pts
            }));

        if (!akRows.length) {
            showToast('مفيش أسئلة في الملف، تأكد من محتواه', 'error');
            return;
        }

        document.getElementById('ak-count').value = akRows.length;
        if (data && data.title && !document.getElementById('ak-title').value.trim()) {
            document.getElementById('ak-title').value = data.title;
        }

        akRender();
        showToast(`تم تجهيز الجدول لـ ${akRows.length} سؤال، حدد الإجابات الصح`);
    }

    function akImportAnswers(data) {
        if (!data || data.type !== 'eto-answers' || !Array.isArray(data.answers)) {
            showToast('ده مش ملف إجابات صادر من الموقع', 'error');
            return;
        }

        akRows = data.answers.map(a => ({
            opts: a.correct === null || a.correct === undefined ? 0 : Math.max(parseInt(a.opts, 10) || 0, (a.correct | 0) + 1),
            correct: a.correct === null || a.correct === undefined ? null : (a.correct | 0),
            points: Number(a.points) || 0
        }));

        document.getElementById('ak-title').value = data.title || '';
        document.getElementById('ak-count').value = akRows.length;
        akRender();
        showToast('تم فتح ملف الإجابات، عدّل وحمّله تاني');
    }

    const table = document.getElementById('ak-table');
    if (table) {
        table.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-ak-pick]');
            if (!btn) return;
            const [i, k] = btn.getAttribute('data-ak-pick').split(':').map(Number);
            akRows[i].correct = akRows[i].correct === k ? null : k;
            akRender();
        });

        table.addEventListener('input', (e) => {
            const input = e.target.closest('[data-ak-points]');
            if (!input) return;
            const i = Number(input.getAttribute('data-ak-points'));
            akRows[i].points = Number(input.value) || 0;
            akUpdateSummary();
        });
    }

    const questionsInput = document.getElementById('ak-questions-file');
    const answersInput = document.getElementById('ak-answers-file');

    document.getElementById('ak-import-questions-btn')?.addEventListener('click', () => questionsInput.click());
    document.getElementById('ak-import-answers-btn')?.addEventListener('click', () => answersInput.click());
    document.getElementById('ak-build-btn')?.addEventListener('click', () => akBuild(false));
    document.getElementById('ak-json-btn')?.addEventListener('click', akExportJson);
    document.getElementById('ak-pdf-btn')?.addEventListener('click', akExportPdf);

    questionsInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) akReadJsonFile(file, akImportQuestions);
        e.target.value = '';
    });

    answersInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) akReadJsonFile(file, akImportAnswers);
        e.target.value = '';
    });

    /* ===== تصدير أسئلة الشيت كـ JSON (من صفحة الشيتات) ===== */
    function teacherExportQuestionsJson() {
        const preview = document.getElementById('teacher-sheet-preview');
        const blocks = preview ? Array.from(preview.querySelectorAll('.q-block')) : [];

        if (!blocks.length) {
            showToast('لا يوجد أسئلة لتصديرها!', 'error');
            return;
        }

        const questions = blocks.map(block => {
            const textEl = block.querySelector('.q-text-el');
            const imgEl = block.querySelector('.q-question-img');

            const answers = Array.from(block.querySelectorAll('.q-choice-slot')).map(slot => {
                const img = slot.querySelector('.q-answer-img');
                if (img) return img.getAttribute('src') || '';
                const txt = slot.querySelector('.q-answer-el');
                return txt ? txt.innerHTML.trim() : '';
            }).filter(a => a !== '');

            const item = {
                text: textEl ? textEl.innerHTML.trim() : '',
                lang: block.dir === 'ltr' ? 'ltr' : 'rtl',
                answers: answers
            };

            if (imgEl && imgEl.getAttribute('src')) item.image = imgEl.getAttribute('src');
            if (block.dataset.pagebreak === '1') item.pagebreak = true;
            return item;
        });

        const payload = { type: 'eto-questions', v: 1, questions: questions };
        akDownload('أسئلة الشيت.json', new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
        showToast(`تم تصدير ${questions.length} سؤال`);
    }

    document.getElementById('teacher-export-json-btn')?.addEventListener('click', teacherExportQuestionsJson);
})();

/* ===== بلوك 7 (كان في index.html من سطر 9304) ===== */
;
(function () {
    const EM_ID_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
    let emQuestions = null;
    let emAnswers = null;
    let emUser = null;
    let emFbPromise = null;
    let emAuthBound = false;

    const $ = (id) => document.getElementById(id);

    function emWaitFor(check, ms) {
        return new Promise((resolve, reject) => {
            const started = Date.now();
            (function poll() {
                if (check()) return resolve();
                if (Date.now() - started > ms) return reject(new Error('firebase load timeout'));
                setTimeout(poll, 100);
            })();
        });
    }

    function emLoadFirebase() {
        if (emFbPromise) return emFbPromise;

        emFbPromise = (async () => {
            const base = 'https://www.gstatic.com/firebasejs/9.23.0/';
            const steps = [
                ['firebase-app-compat.js', () => !!window.firebase],
                ['firebase-database-compat.js', () => !!(window.firebase && window.firebase.database)],
                ['firebase-auth-compat.js', () => !!(window.firebase && window.firebase.auth)]
            ];

            for (const [file, ready] of steps) {
                if (ready()) continue;
                if (!document.querySelector('script[src="' + base + file + '"]')) {
                    const s = document.createElement('script');
                    s.src = base + file;
                    document.head.appendChild(s);
                }
                await emWaitFor(ready, 20000);
            }

            const ns = window.firebase;
            const app = ns.apps.find(a => a.name === 'eto-exam') || ns.initializeApp(SUMMARIES_FIREBASE_CONFIG, 'eto-exam');
            return { ns: ns, app: app, db: app.database(), auth: app.auth() };
        })().catch(err => {
            emFbPromise = null;
            throw err;
        });

        return emFbPromise;
    }
    window.emLoadFirebase = emLoadFirebase;
    /* ---------- تسجيل دخول المعلم ---------- */
    function emRefreshAuth(user) {
        emUser = user && !user.isAnonymous ? user : null;
        const text = $('em-auth-text');
        const loginBtn = $('em-login-btn');
        const logoutBtn = $('em-logout-btn');

        if (emUser) {
            text.textContent = 'مسجّل دخول بـ: ' + (emUser.email || emUser.displayName || 'حساب جوجل');
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            text.textContent = 'سجّل دخولك بجوجل عشان تنشر امتحانك وتشوف النتايج بعدين.';
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
        }
    }

    async function emInitAuth() {
        try {
            const fb = await window.emLoadFirebase();
            if (!emAuthBound) {
                emAuthBound = true;
                fb.auth.onAuthStateChanged(emRefreshAuth);
            }
        } catch (err) {
            console.error(err);
            $('em-auth-text').textContent = 'تعذر الاتصال بـ Firebase، تأكد من الإنترنت وحدّث الصفحة.';
        }
    }

    async function emLogin() {
        try {
            const fb = await emLoadFirebase();
            await fb.auth.signInWithPopup(new fb.ns.auth.GoogleAuthProvider());
        } catch (err) {
            console.error(err);
            const code = err && err.code;
            if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
            const msg = code === 'auth/unauthorized-domain' ? 'ضيف دومين الموقع في Authorized domains من إعدادات Firebase Authentication'
                : code === 'auth/operation-not-allowed' ? 'فعّل تسجيل الدخول بجوجل من Firebase Authentication'
                : code === 'auth/popup-blocked' ? 'المتصفح منع النافذة، اسمح بالـ popups وجرّب تاني'
                : 'مقدرناش نسجّل الدخول، جرّب تاني';
            showToast(msg, 'error');
        }
    }

    async function emLogout() {
        try {
            const fb = await emLoadFirebase();
            await fb.auth.signOut();
        } catch (err) {
            console.error(err);
        }
    }

    /* ---------- الملفات ---------- */
    function emReadJson(file, onData) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            let data;
            try {
                data = JSON.parse(ev.target.result);
            } catch (err) {
                showToast('ملف الـ JSON مش سليم، اتأكد من صيغته', 'error');
                return;
            }
            onData(data);
        };
        reader.readAsText(file, 'UTF-8');
    }

    function emCountChoices(item) {
        return Array.isArray(item.answers)
            ? item.answers.filter(a => a !== null && a !== undefined && String(a).trim() !== '').length
            : 0;
    }

    function emFillTitle(data) {
        if (data && data.title && !$('em-title').value.trim()) $('em-title').value = data.title;
    }

    function emLoadQuestions(data) {
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
        const items = list ? list.filter(it => it && (it.text || it.image)) : [];

        if (!items.length) {
            emQuestions = null;
            $('em-q-status').textContent = 'الملف مفيهوش أسئلة';
            showToast('مفيش أسئلة في الملف، تأكد من محتواه', 'error');
            return;
        }

        emQuestions = items;
        const withChoices = items.filter(it => emCountChoices(it) > 0).length;
        $('em-q-status').textContent = `${items.length} سؤال • ${withChoices} اختيار من متعدد`;
        emFillTitle(data);
    }

    function emLoadAnswers(data) {
        if (!data || data.type !== 'eto-answers' || !Array.isArray(data.answers)) {
            emAnswers = null;
            $('em-a-status').textContent = 'ده مش ملف إجابات صادر من الموقع';
            showToast('ده مش ملف إجابات صادر من الموقع', 'error');
            return;
        }

        emAnswers = data;
        $('em-a-status').textContent = `${data.answers.length} إجابة • مجموع الدرجات: ${data.totalPoints || 0}`;
        emFillTitle(data);
    }

    function emCheckMatch() {
        const answers = emAnswers.answers;

        if (answers.length !== emQuestions.length) {
            return `عدد الأسئلة (${emQuestions.length}) مختلف عن عدد الإجابات (${answers.length})، اتأكد إن الملفين لنفس الامتحان`;
        }

        for (let i = 0; i < answers.length; i++) {
            const a = answers[i];
            if (a.correct === null || a.correct === undefined) continue;
            const choices = emCountChoices(emQuestions[i]);
            if (choices === 0 || a.correct >= choices) {
                return `الإجابة الصح للسؤال رقم ${i + 1} مش متوافقة مع اختياراته`;
            }
        }

        return '';
    }

    /* ---------- الوقت والرسالة ---------- */
    function emToLocalInput(d) {
        const pad = n => String(n).padStart(2, '0');
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function emFillDefaultTimes() {
        if ($('em-start').value || $('em-end').value) return;
        const start = new Date();
        start.setHours(start.getHours() + 1, 0, 0, 0);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        $('em-start').value = emToLocalInput(start);
        $('em-end').value = emToLocalInput(end);
    }

    function emBuildMessage(teacherName, title, link, startAt, endAt, durationMin) {
        const s = new Date(startAt);
        const e = new Date(endAt);
        const dayFmt = { weekday: 'long', day: 'numeric', month: 'long' };
        const timeFmt = { hour: 'numeric', minute: '2-digit' };
        const day = s.toLocaleDateString('ar-EG', dayFmt);
        const from = s.toLocaleTimeString('ar-EG', timeFmt);
        const to = s.toDateString() === e.toDateString()
            ? e.toLocaleTimeString('ar-EG', timeFmt)
            : e.toLocaleDateString('ar-EG', dayFmt) + ' ' + e.toLocaleTimeString('ar-EG', timeFmt);

        return [
            '📝 امتحان: ' + title,
            '👨‍🏫 المعلم: ' + teacherName,
            '',
            '📅 ' + day,
            '🕗 من الساعة ' + from + ' إلى ' + to,
            '⏱ مدة الحل: ' + durationMin + ' دقيقة',
            '',
            'ادخل على الرابط، اكتب اسمك ورقم تليفونك وابدأ الامتحان:',
            link,
            '',
            '⚠️ الامتحان بيتفتح مرة واحدة بس، ولو خرجت من الصفحة مش هتقدر ترجع تاني.'
        ].join('\n');
    }

    function emGenId() {
        const bytes = new Uint8Array(8);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, b => EM_ID_CHARS[b % EM_ID_CHARS.length]).join('');
    }

    async function emCopy(text, okMsg) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;left:-10000px;top:0;';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        showToast(okMsg);
    }

    async function emPublish() {
        if (!emUser) {
            showToast('سجّل دخولك بجوجل الأول', 'error');
            return;
        }

        const teacherName = $('em-teacher-name').value.trim();
        const title = $('em-title').value.trim();

        if (!teacherName) return showToast('اكتب اسم المعلم', 'error');
        if (!title) return showToast('اكتب اسم الامتحان', 'error');
        if (!emQuestions) return showToast('ارفع ملف الأسئلة الأول', 'error');
        if (!emAnswers) return showToast('ارفع ملف الإجابات الأول', 'error');

        const mismatch = emCheckMatch();
        if (mismatch) return showToast(mismatch, 'error');

        const startAt = new Date($('em-start').value).getTime();
        const endAt = new Date($('em-end').value).getTime();
        if (isNaN(startAt) || isNaN(endAt)) return showToast('حدد بداية ونهاية الامتحان', 'error');
        if (endAt <= startAt) return showToast('وقت النهاية لازم يكون بعد وقت البداية', 'error');
        if (endAt <= Date.now()) return showToast('وقت النهاية عدّى، اختار وقت في المستقبل', 'error');

        const windowMin = Math.max(1, Math.round((endAt - startAt) / 60000));
        const durInput = parseInt($('em-duration').value, 10);
        const durationMin = durInput > 0 ? Math.min(durInput, windowMin) : windowMin;

        const questions = emQuestions.map(q => {
            const item = { text: String(q.text || ''), lang: q.lang === 'ltr' ? 'ltr' : 'rtl' };
            const choices = Array.isArray(q.answers)
                ? q.answers.filter(a => a !== null && a !== undefined && String(a).trim() !== '').map(String)
                : [];
            if (choices.length) item.answers = choices;
            if (q.image) item.image = String(q.image);
            return item;
        });

        const key = emAnswers.answers.map(a => ({
            correct: a.correct === undefined ? null : a.correct,
            points: Number(a.points) || 0
        }));

        const sizeMB = new Blob([JSON.stringify(questions)]).size / 1048576;
        if (sizeMB > 12) {
            return showToast(`حجم الأسئلة (${sizeMB.toFixed(1)} ميجا) كبير، صغّر صور الأسئلة وجرّب تاني`, 'error');
        }

        showLoad('جاري نشر الامتحان...');

        try {
            const fb = await emLoadFirebase();
            const id = emGenId();
            const totalPoints = Number(emAnswers.totalPoints) || key.reduce((sum, k) => sum + k.points, 0);

            const updates = {};
            updates['exams/' + id] = {
                title: title,
                teacherName: teacherName,
                ownerUid: emUser.uid,
                startAt: startAt,
                endAt: endAt,
                durationMin: durationMin,
                count: questions.length,
                createdAt: fb.ns.database.ServerValue.TIMESTAMP
            };
            updates['examQuestions/' + id] = { ownerUid: emUser.uid, items: questions };
            updates['examKeys/' + id] = { ownerUid: emUser.uid, totalPoints: totalPoints, answers: key };

            await fb.db.ref().update(updates);

            const link = location.origin + location.pathname + '?exam=' + id;
            $('em-link').value = link;
            $('em-message').value = emBuildMessage(teacherName, title, link, startAt, endAt, durationMin);
            $('em-result').classList.remove('hidden');
            $('em-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
            showToast('تم نشر الامتحان');
        } catch (err) {
            console.error(err);
            const denied = String((err && (err.code || err.message)) || '').includes('PERMISSION_DENIED');
            showToast(denied ? 'Firebase رفض الكتابة، اتأكد من قواعد الأمان وتسجيل الدخول' : 'حصل خطأ أثناء النشر، جرّب تاني', 'error');
        } finally {
            hideLoad();
        }
    }

    /* ---------- امتحان الطالب ---------- */
    let studentExamData = null;
    let studentExamQuestions = [];
    let studentExamTimer = null;
    let studentExamStartedAt = 0;
    let studentExamDeadline = 0;

    function studentExamFormatDate(ts) {
        const d = new Date(ts);
        return d.toLocaleDateString('ar-EG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Africa/Cairo'
        }) + ' - ' + d.toLocaleTimeString('ar-EG', {
            hour: 'numeric',
            minute: '2-digit',
            timeZone: 'Africa/Cairo'
        });
    }

    function studentExamSetMessage(text, type) {
        const box = $('student-exam-message');
        box.textContent = text;
        box.className = 'm-5 p-4 rounded-2xl font-bold text-sm leading-7';

        if (type === 'error') {
            box.classList.add('bg-red-50', 'border', 'border-red-200', 'text-red-700');
        } else if (type === 'success') {
            box.classList.add('bg-emerald-50', 'border', 'border-emerald-200', 'text-emerald-700');
        } else {
            box.classList.add('bg-sky-50', 'border', 'border-sky-200', 'text-sky-700');
        }

        box.classList.remove('hidden');
    }

    function studentExamFormatCountdown(ms) {
        ms = Math.max(0, ms);
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
    }

    function studentExamRenderQuestions() {
        const wrap = $('student-exam-questions');
        wrap.innerHTML = '';

        studentExamQuestions.forEach((q, index) => {
            const box = document.createElement('div');
            box.className = 'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm';
            box.dir = q.lang === 'ltr' ? 'ltr' : 'rtl';

            const title = document.createElement('div');
            title.className = 'flex items-start gap-3 mb-4';

            const num = document.createElement('div');
            num.className = 'shrink-0 w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black';
            num.textContent = String(index + 1);

            const textWrap = document.createElement('div');
            textWrap.className = 'flex-1';

            const qText = document.createElement('div');
            qText.className = 'font-black text-slate-800 dark:text-white leading-7 text-base';
            qText.textContent = q.text || '';

            textWrap.appendChild(qText);
            title.appendChild(num);
            title.appendChild(textWrap);
            box.appendChild(title);

            const choices = Array.isArray(q.answers) ? q.answers : [];

            if (choices.length) {
                const choicesWrap = document.createElement('div');
                choicesWrap.className = 'grid grid-cols-1 md:grid-cols-2 gap-3';

                choices.forEach((choice, choiceIndex) => {
                    const label = document.createElement('label');
                    label.className = 'flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer transition';

                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = 'student-q-' + index;
                    radio.value = String(choiceIndex);
                    radio.className = 'mt-1 accent-sky-600';

                    const letter = document.createElement('span');
                    letter.className = 'shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs';
                    letter.textContent = String.fromCharCode(65 + choiceIndex);

                    const choiceText = document.createElement('span');
                    choiceText.className = 'font-bold text-slate-700 dark:text-slate-200 leading-6';
                    choiceText.textContent = String(choice);

                    label.appendChild(radio);
                    label.appendChild(letter);
                    label.appendChild(choiceText);
                    choicesWrap.appendChild(label);
                });

                box.appendChild(choicesWrap);
            }

            wrap.appendChild(box);
        });
    }

    function studentExamUpdateLobbyTimer() {
        if (!studentExamData) return;

        const now = Date.now();
        const startAt = Number(studentExamData.startAt);
        const endAt = Number(studentExamData.endAt);
        const btn = $('student-exam-start-btn');

        if (now < startAt) {
            btn.disabled = true;
            $('student-exam-countdown-label').textContent = 'الامتحان هيبدأ بعد';
            $('student-exam-countdown').textContent = studentExamFormatCountdown(startAt - now);
            $('student-exam-start-hint').textContent = 'استنى لحد موعد البداية، وبعدها زر "ابدأ الامتحان" هيتفعل تلقائيًا.';
            return;
        }

        if (now >= endAt) {
            btn.disabled = true;
            $('student-exam-countdown-label').textContent = 'انتهى موعد الامتحان';
            $('student-exam-countdown').textContent = '00:00:00';
            $('student-exam-start-hint').textContent = 'الامتحان لم يعد متاحًا للبدء.';
            studentExamSetMessage('انتهى وقت الامتحان.', 'error');
            clearInterval(studentExamTimer);
            return;
        }

        btn.disabled = false;
        $('student-exam-countdown-label').textContent = 'الامتحان متاح الآن';
        $('student-exam-countdown').textContent = studentExamFormatCountdown(endAt - now);
        $('student-exam-start-hint').textContent = 'اكتب اسمك ورقم تليفونك واضغط "ابدأ الامتحان".';
    }

    function studentExamUpdateRunningTimer() {
        const remaining = studentExamDeadline - Date.now();

        if (remaining <= 0) {
            $('student-exam-running-timer').textContent = '00:00';
            $('student-exam-finished').classList.remove('hidden');
            clearInterval(studentExamTimer);
            return;
        }

        $('student-exam-running-timer').textContent = studentExamFormatCountdown(remaining);
    }

    async function studentExamStart() {
        if (!studentExamData) return;

        const name = $('student-exam-name').value.trim();
        const phone = $('student-exam-phone').value.trim();

        if (!name) {
            showToast('اكتب اسمك الأول', 'error');
            $('student-exam-name').focus();
            return;
        }

        if (!phone) {
            showToast('اكتب رقم التليفون', 'error');
            $('student-exam-phone').focus();
            return;
        }

        const now = Date.now();
        const startAt = Number(studentExamData.startAt);
        const endAt = Number(studentExamData.endAt);

        if (now < startAt) {
            showToast('الامتحان لسه ما بدأش', 'error');
            return;
        }

        if (now >= endAt) {
            showToast('وقت الامتحان انتهى', 'error');
            return;
        }

        try {
            showLoad('جاري تحميل أسئلة الامتحان...');

            const fb = await emLoadFirebase();
            const snap = await fb.db.ref('examQuestions/' + studentExamData.id + '/items').once('value');
            const items = snap.val();

            studentExamQuestions = Array.isArray(items) ? items : [];

            if (!studentExamQuestions.length) {
                throw new Error('NO_QUESTIONS');
            }

            studentExamStartedAt = Date.now();

            const durationMs = Math.max(1, Number(studentExamData.durationMin) || 1) * 60000;
            studentExamDeadline = Math.min(
                Number(studentExamData.endAt),
                studentExamStartedAt + durationMs
            );

            $('student-exam-lobby').classList.add('hidden');
            $('student-exam-running').classList.remove('hidden');

            $('student-exam-running-info').textContent =
                'الطالب: ' + name + ' • ' + phone;

            studentExamRenderQuestions();
            clearInterval(studentExamTimer);
            studentExamTimer = setInterval(studentExamUpdateRunningTimer, 1000);
            studentExamUpdateRunningTimer();

            showToast('بدأ الامتحان');
        } catch (err) {
            console.error(err);
            showToast(
                err && err.message === 'NO_QUESTIONS'
                    ? 'الامتحان موجود لكن مفيش أسئلة مرتبطة به'
                    : 'مقدرناش نحمل أسئلة الامتحان، جرّب تحديث الصفحة',
                'error'
            );
        } finally {
            hideLoad();
        }
    }

    async function emStudentInit() {
        const params = new URLSearchParams(window.location.search);
        const examId = params.get('exam');

        if (!examId) return;

        const app = $('student-exam-app');
        if (!app) return;

        app.classList.remove('hidden');

        try {
            showLoad('جاري تحميل بيانات الامتحان...');

            const fb = await emLoadFirebase();
            if (!fb.auth.currentUser) {
                await fb.auth.signInAnonymously();
            }
            const snap = await fb.db.ref('exams/' + examId).once('value');
            const exam = snap.val();

            if (!exam) {
                studentExamSetMessage('الامتحان غير موجود أو الرابط غير صحيح.', 'error');
                return;
            }
            studentExamData = {
                id: examId,
                title: exam.title || 'امتحان أونلاين',
                teacherName: exam.teacherName || '',
                startAt: Number(exam.startAt) || 0,
                endAt: Number(exam.endAt) || 0,
                durationMin: Number(exam.durationMin) || 1,
                count: Number(exam.count) || 0
            };

            $('student-exam-title').textContent = studentExamData.title;
            $('student-exam-teacher').textContent = studentExamData.teacherName
                ? '👨‍🏫 المعلم: ' + studentExamData.teacherName
                : '';
            $('student-exam-start-time').textContent = studentExamFormatDate(studentExamData.startAt);
            $('student-exam-end-time').textContent = studentExamFormatDate(studentExamData.endAt);
            $('student-exam-duration').textContent = studentExamData.durationMin + ' دقيقة';

            $('student-exam-start-btn').onclick = studentExamStart;

            clearInterval(studentExamTimer);
            studentExamTimer = setInterval(studentExamUpdateLobbyTimer, 1000);
            studentExamUpdateLobbyTimer();
        } catch (err) {
            console.error(err);
            studentExamSetMessage('حصل خطأ أثناء تحميل الامتحان. تأكد من الإنترنت وصحة الرابط.', 'error');
        } finally {
            hideLoad();
        }
    }
    $('student-exam-submit-btn')?.addEventListener('click', studentExamSubmit);

    $('student-exam-results-back')?.addEventListener('click', () => {
        $('student-exam-results-view').classList.add('hidden');
        $('student-exams-list').classList.remove('hidden');
        studentExamsLoad();
    });
    /* ---------- نتائج امتحان الطالب ---------- */

    function studentExamGetAnswers() {
        return studentExamQuestions.map((q, index) => {
            const selected = document.querySelector('input[name="student-q-' + index + '"]:checked');
            return selected ? Number(selected.value) : null;
        });
    }

    async function studentExamSubmit() {
        if (!studentExamData || !studentExamQuestions.length) return;

        const name = $('student-exam-name').value.trim();
        const phone = $('student-exam-phone').value.trim();

        if (!name || !phone) {
            showToast('بيانات الطالب ناقصة', 'error');
            return;
        }

        const submitBtn = $('student-exam-submit-btn');

        const answers = studentExamGetAnswers();
        const unanswered = answers.filter(a => a === null).length;

        if (unanswered > 0) {
            const ok = confirm(`لسه فيه ${unanswered} سؤال بدون إجابة. هل تريد تسليم الامتحان؟`);
            if (!ok) return;
        }

        const alreadySubmittedKey = 'eto-exam-submitted:' + studentExamData.id + ':' + phone;

        if (localStorage.getItem(alreadySubmittedKey)) {
            showToast('تم تسليم هذا الامتحان من هذا الجهاز بالفعل', 'error');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري التصحيح...';

            const fb = await emLoadFirebase();

            const keySnap = await fb.db.ref('examKeys/' + studentExamData.id).once('value');
            const keyData = keySnap.val();

            if (!keyData || !Array.isArray(keyData.answers)) {
                throw new Error('NO_KEY');
            }

            const answerKey = keyData.answers;
            const totalPoints = Number(keyData.totalPoints) || 0;

            let score = 0;
            const wrong = [];

            answerKey.forEach((item, index) => {
                const correct = item && item.correct !== undefined ? Number(item.correct) : null;
                const points = item && Number(item.points) > 0 ? Number(item.points) : 0;
                const studentAnswer = answers[index] === undefined ? null : answers[index];

                if (correct !== null && studentAnswer === correct) {
                    score += points;
                } else {
                    wrong.push({
                        q: index + 1,
                        studentAnswer: studentAnswer,
                        correctAnswer: correct,
                        points: points
                    });
                }
            });

            const percentage = totalPoints > 0
                ? Math.round((score / totalPoints) * 100)
                : 0;

            const submissionId = emGenId();

            const result = {
                examId: studentExamData.id,
                studentName: name,
                phone: phone,
                startedAt: studentExamStartedAt || Date.now(),
                submittedAt: Date.now(),
                score: score,
                totalPoints: totalPoints,
                percentage: percentage,
                answers: answers,
                wrong: wrong
            };

            await fb.db.ref('examResults/' + studentExamData.id + '/' + submissionId).set(result);

            localStorage.setItem(alreadySubmittedKey, JSON.stringify({
                submissionId: submissionId,
                score: score,
                totalPoints: totalPoints,
                percentage: percentage
            }));

            clearInterval(studentExamTimer);

            $('student-exam-submit-btn').classList.add('hidden');
            $('student-exam-result-box').classList.remove('hidden');

            $('student-exam-result-score').textContent = `${score} / ${totalPoints}`;
            $('student-exam-result-percent').textContent = `${percentage}%`;
            $('student-exam-result-note').textContent =
                `عدد الأسئلة التي لم تكن صحيحة: ${wrong.length}`;

            $('student-exam-finished').classList.remove('hidden');

            showToast('تم تسليم الامتحان وتصحيحه');

        } catch (err) {
            console.error(err);
            showToast(
                err && err.message === 'NO_KEY'
                    ? 'ملف الإجابات الخاص بالامتحان غير موجود'
                    : 'حصل خطأ أثناء تسليم الامتحان',
                'error'
            );

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane ml-2"></i> تسليم الامتحان';
        }
    }

    async function studentExamsLoad() {
        const listEl = $('student-exams-list');
        const emptyEl = $('student-exams-empty');
        const loadingEl = $('student-exams-loading');
        const authBox = $('student-exams-auth-box');

        listEl.innerHTML = '';
        emptyEl.classList.add('hidden');
        loadingEl.classList.remove('hidden');
        authBox.classList.add('hidden');

        try {
            const fb = await emLoadFirebase();
            const user = fb.auth.currentUser;

            if (!user || user.isAnonymous) {
                loadingEl.classList.add('hidden');
                authBox.innerHTML = `
                    <div class="flex flex-col md:flex-row items-center justify-between gap-3">
                        <span>سجّل دخولك بجوجل عشان تشوف الامتحانات اللي نشرتها.</span>
                        <button type="button" id="student-exams-login-btn" class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-black transition">
                            <i class="fa-brands fa-google ml-2"></i>تسجيل الدخول بجوجل
                        </button>
                    </div>
                `;
                authBox.classList.remove('hidden');
                $('student-exams-login-btn').onclick = async () => {
                    await emLogin();
                    await studentExamsLoad();
                };
                emptyEl.classList.add('hidden');
                return;
            }

            const snap = await fb.db.ref('exams').orderByChild('ownerUid').equalTo(user.uid).once('value');
            const data = snap.val() || {};

            const exams = Object.entries(data)
                .map(([id, exam]) => ({ id, ...exam }))
                .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

            loadingEl.classList.add('hidden');

            if (!exams.length) {
                emptyEl.classList.remove('hidden');
                return;
            }

            exams.forEach(exam => {
                const card = document.createElement('div');
                card.className = 'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg transition';

                card.innerHTML = `
                    <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl mb-4">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </div>

                    <h3 class="text-lg font-black text-slate-800 dark:text-white mb-2">${escapeHtml(exam.title || 'امتحان')}</h3>

                    <div class="space-y-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-5">
                        <div>👨‍🏫 ${escapeHtml(exam.teacherName || '')}</div>
                        <div>📝 ${Number(exam.count) || 0} سؤال</div>
                        <div>⏱ ${Number(exam.durationMin) || 0} دقيقة</div>
                        <div>📅 ${studentExamFormatDate(Number(exam.startAt))}</div>
                    </div>

                    <button type="button"
                        class="student-results-open-btn w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-black transition">
                        <i class="fa-solid fa-users ml-2"></i>
                        فتح نتائج الطلاب
                    </button>
                `;

                card.querySelector('.student-results-open-btn').addEventListener('click', () => {
                    studentExamsOpenResults(exam);
                });

                listEl.appendChild(card);
            });

        } catch (err) {
            console.error(err);
            loadingEl.classList.add('hidden');
            authBox.textContent = 'مقدرناش نحمل امتحاناتك. اتأكد من تسجيل الدخول والاتصال بالإنترنت.';
            authBox.classList.remove('hidden');
        }
    }

    async function studentExamsOpenResults(exam) {
        const listEl = $('student-exams-list');
        const emptyEl = $('student-exams-empty');
        const resultsView = $('student-exam-results-view');

        try {
            showLoad('جاري تحميل نتائج الطلاب...');

            const fb = await emLoadFirebase();
            const snap = await fb.db.ref('examResults/' + exam.id).once('value');
            const data = snap.val() || {};

            const results = Object.entries(data)
                .map(([id, result]) => ({ id, ...result }))
                .sort((a, b) => Number(b.submittedAt || 0) - Number(a.submittedAt || 0));

            listEl.classList.add('hidden');
            emptyEl.classList.add('hidden');
            resultsView.classList.remove('hidden');

            $('student-exam-results-title').textContent = exam.title || 'نتائج الامتحان';
            $('student-exam-results-meta').textContent =
                `المعلم: ${exam.teacherName || ''} • عدد الطلاب: ${results.length}`;

            const avg = results.length
                ? Math.round(results.reduce((sum, r) => sum + Number(r.score || 0), 0) / results.length)
                : 0;

            const passed = results.filter(r => Number(r.percentage || 0) >= 50).length;

            $('student-exam-results-summary').innerHTML = `
                <div class="rounded-2xl bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">عدد الطلاب</div>
                    <div class="text-2xl font-black text-sky-600 mt-1">${results.length}</div>
                </div>

                <div class="rounded-2xl bg-emerald-50 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">متوسط الدرجات</div>
                    <div class="text-2xl font-black text-emerald-600 mt-1">${avg}</div>
                </div>

                <div class="rounded-2xl bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">الناجحون</div>
                    <div class="text-2xl font-black text-indigo-600 mt-1">${passed}</div>
                </div>

                <div class="rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-100 dark:border-slate-700 p-4 text-center">
                    <div class="text-xs text-slate-500 font-bold">الدرجة النهائية</div>
                    <div class="text-2xl font-black text-amber-600 mt-1">${Number(results[0]?.totalPoints || 0)}</div>
                </div>
            `;

            if (!results.length) {
                $('student-exam-results-table').innerHTML = `
                    <div class="p-10 text-center text-slate-400 font-bold">
                        لسه مفيش طالب سلّم الامتحان.
                    </div>
                `;
                return;
            }

            const rows = results.map((r, index) => `
                <tr class="border-t border-slate-200 dark:border-slate-700">
                    <td class="p-3 font-black">${index + 1}</td>
                    <td class="p-3 font-black">${escapeHtml(r.studentName || '-')}</td>
                    <td class="p-3">${escapeHtml(r.phone || '-')}</td>
                    <td class="p-3 font-black">${Number(r.score || 0)} / ${Number(r.totalPoints || 0)}</td>
                    <td class="p-3 font-black">${Number(r.percentage || 0)}%</td>
                    <td class="p-3">${r.wrong?.length || 0}</td>
                    <td class="p-3">${studentExamFormatDate(Number(r.submittedAt || 0))}</td>
                    <td class="p-3">
                        <button type="button"
                            class="result-details-btn bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-black">
                            التفاصيل
                        </button>
                    </td>
                </tr>
            `).join('');

            $('student-exam-results-table').innerHTML = `
                <table class="w-full text-sm text-right">
                    <thead class="bg-slate-100 dark:bg-slate-800 font-black">
                        <tr>
                            <th class="p-3">#</th>
                            <th class="p-3">الطالب</th>
                            <th class="p-3">الهاتف</th>
                            <th class="p-3">الدرجة</th>
                            <th class="p-3">النسبة</th>
                            <th class="p-3">الغلط</th>
                            <th class="p-3">التسليم</th>
                            <th class="p-3">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;

            [...$('student-exam-results-table').querySelectorAll('.result-details-btn')].forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    studentExamsShowStudentDetails(exam, results[index]);
                });
            });

        } catch (err) {
            console.error(err);
            showToast('مقدرناش نحمل النتائج', 'error');
        } finally {
            hideLoad();
        }
    }

    async function studentExamsShowStudentDetails(exam, result) {
        try {
            const fb = await emLoadFirebase();

            const qSnap = await fb.db.ref('examQuestions/' + exam.id + '/items').once('value');
            const questions = Array.isArray(qSnap.val()) ? qSnap.val() : [];

            const kSnap = await fb.db.ref('examKeys/' + exam.id + '/answers').once('value');
            const key = Array.isArray(kSnap.val()) ? kSnap.val() : [];

            const wrong = Array.isArray(result.wrong) ? result.wrong : [];

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';

            const wrongRows = wrong.map(item => {
                const idx = Number(item.q) - 1;
                const q = questions[idx];
                const choices = Array.isArray(q?.answers) ? q.answers : [];

                const studentText =
                    item.studentAnswer === null || item.studentAnswer === undefined
                        ? 'بدون إجابة'
                        : (choices[item.studentAnswer] || `اختيار ${Number(item.studentAnswer) + 1}`);

                const correctText =
                    item.correctAnswer === null || item.correctAnswer === undefined
                        ? 'غير محددة'
                        : (choices[item.correctAnswer] || `اختيار ${Number(item.correctAnswer) + 1}`);

                return `
                    <div class="rounded-xl border border-red-200 bg-red-50 p-4">
                        <div class="font-black text-slate-800 mb-2">السؤال ${item.q}</div>
                        <div class="text-sm font-bold text-slate-600 mb-3">${escapeHtml(q?.text || '')}</div>
                        <div class="text-sm"><b>إجابة الطالب:</b> ${escapeHtml(String(studentText))}</div>
                        <div class="text-sm text-emerald-700 mt-1"><b>الإجابة الصحيحة:</b> ${escapeHtml(String(correctText))}</div>
                    </div>
                `;
            }).join('');

            modal.innerHTML = `
                <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                    <div class="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-black text-slate-800 dark:text-white">${escapeHtml(result.studentName || 'الطالب')}</h3>
                            <p class="text-xs text-slate-500 mt-1">${escapeHtml(result.phone || '')} • ${Number(result.score || 0)} / ${Number(result.totalPoints || 0)}</p>
                        </div>
                        <button type="button" class="result-modal-close w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="p-5 overflow-y-auto max-h-[75vh]">
                        ${wrongRows || '<div class="text-center p-10 text-emerald-600 font-black">الطالب جاوب كل الأسئلة صح 🎉</div>'}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.result-modal-close').onclick = () => modal.remove();
            modal.addEventListener('click', e => {
                if (e.target === modal) modal.remove();
            });

        } catch (err) {
            console.error(err);
            showToast('مقدرناش نعرض تفاصيل الطالب', 'error');
        }
    }

    $('em-login-btn').addEventListener('click', emLogin);
    $('em-logout-btn').addEventListener('click', emLogout);
    $('em-publish-btn').addEventListener('click', emPublish);
    $('em-questions-btn').addEventListener('click', () => $('em-questions-file').click());
    $('em-answers-btn').addEventListener('click', () => $('em-answers-file').click());
    $('em-copy-link').addEventListener('click', () => emCopy($('em-link').value, 'تم نسخ اللينك'));
    $('em-copy-msg').addEventListener('click', () => emCopy($('em-message').value, 'تم نسخ الرسالة'));
    $('em-wa-btn').addEventListener('click', () => {
        window.open('https://wa.me/?text=' + encodeURIComponent($('em-message').value), '_blank');
    });

    $('em-questions-file').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) emReadJson(file, emLoadQuestions);
        e.target.value = '';
    });

    $('em-answers-file').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) emReadJson(file, emLoadAnswers);
        e.target.value = '';
    });

    const _navigate = window.navigate;
    window.navigate = function (pageId, addHistory) {
        _navigate(pageId, addHistory);

        if (pageId === 'exam-maker') {
            emFillDefaultTimes();
            emInitAuth();
        }

        if (pageId === 'student-exams') {
            emInitAuth();
            studentExamsLoad();
        }
    };

    emStudentInit();
})();
    const GOOGLE_TRANSLATE_URL =
        'https://translate.googleapis.com/translate_a/single';

    function etoEgyptianizeArabic(text){

        if(!text){
            return '';
        }

        if(
            window.EtoEgyptianTranslationData &&
            typeof window.EtoEgyptianTranslationData.egyptianize === 'function'
        ){

            return window.EtoEgyptianTranslationData.egyptianize(
                String(text).trim()
            );

        }

        return String(text).trim();
    }

    async function etoTranslateText(){

        const input = document.getElementById('translate-input');
        const source = document.getElementById('translate-source');
        const target = document.getElementById('translate-target');
        const result = document.getElementById('translate-result');
        const egyptian = document.getElementById('translate-egy-result');
        const button = document.getElementById('translate-btn');

        if(!input || !result || !egyptian || !button) return;

        const text = input.value.trim();

        if(!text){

            result.textContent = 'اكتب كلمة أو نص الأول.';

            egyptian.textContent =
                'اكتب اللي عايز تترجمه وأنا هظبطهولك.';

            return;
        }

        button.disabled = true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري الترجمة...';

        result.classList.add('translate-loading');
        egyptian.classList.add('translate-loading');

        result.textContent = '';
        egyptian.textContent = '';

        try{

            const sourceLanguage =
                source.value || 'auto';

            const targetLanguage =
                target.value || 'en';

            const url =
                GOOGLE_TRANSLATE_URL +
                '?client=gtx' +
                '&sl=' + encodeURIComponent(sourceLanguage) +
                '&tl=' + encodeURIComponent(targetLanguage) +
                '&dt=t' +
                '&q=' + encodeURIComponent(text);

            const response =
                await fetch(url);

            if(!response.ok){
                throw new Error(
                    'Translation request failed'
                );
            }

            const data =
                await response.json();

            const translated =
                Array.isArray(data?.[0])
                    ? data[0]
                        .map(item => item?.[0] || '')
                        .join('')
                    : '';

            if(!translated){
                throw new Error(
                    'Empty translation'
                );
            }

            result.classList.remove(
                'translate-loading'
            );

            egyptian.classList.remove(
                'translate-loading'
            );

            result.classList.remove(
                'translate-result-pop'
            );

            egyptian.classList.remove(
                'translate-result-pop'
            );

            void result.offsetWidth;
            void egyptian.offsetWidth;

            result.classList.add(
                'translate-result-pop'
            );

            egyptian.classList.add(
                'translate-result-pop'
            );

            result.textContent =
                translated;

            if(targetLanguage === 'ar'){

                egyptian.textContent =
                    etoEgyptianizeArabic(
                        translated
                    );

            }else{

                egyptian.textContent =
                    'اختار الترجمة للعربي عشان أقدر أطلعلك المعنى بالمصري.';
            }

        }catch(error){

            console.error(
                '[Eto Translate]',
                error
            );

            result.classList.remove(
                'translate-loading'
            );

            egyptian.classList.remove(
                'translate-loading'
            );

            result.textContent =
                'حصلت مشكلة في الترجمة، جرّب تاني.';

            egyptian.textContent =
                'ممكن تكون الخدمة مش متاحة دلوقتي، جرّب بعد شوية.';

        }finally{

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-wand-magic-sparkles ml-2"></i> ترجم دلوقتي';
        }
    }

    const translateButton =
        document.getElementById('translate-btn');

    if(translateButton){

        translateButton.addEventListener(
            'click',
            etoTranslateText
        );

    }

/* ===== بلوك 8 (كان في index.html من سطر 10555) ===== */
;
        (() => {
            const images = document.querySelectorAll('.eto-module-image img[data-src]');
            if (!images.length) return;

            const loadImage = (img) => {
                const src = img.dataset.src;
                if (!src) return;

                img.src = src;
                img.removeAttribute('data-src');
            };

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach((entry, index) => {
                        if (!entry.isIntersecting) return;

                        const img = entry.target;

                        setTimeout(() => {
                            loadImage(img);
                        }, index * 70);

                        obs.unobserve(img);
                    });
                }, {
                    rootMargin: '180px 0px'
                });

                images.forEach(img => observer.observe(img));
            } else {
                images.forEach(loadImage);
            }
        })();
    

/* ===== بلوك 9 (كان في index.html من سطر 10591) ===== */
;
(function(){
    'use strict';

    const state = {
        initialized:false,
        mathReady:false,
        mathPromise:null,
        mathLivePromise:null,
        lastResult:null,
        angle:'DEG'
    };

    function $(id){
        return document.getElementById(id);
    }

    function loadMathJs(){

        if(window.math){
            state.mathReady = true;
            return Promise.resolve(window.math);
        }

        if(state.mathPromise){
            return state.mathPromise;
        }

        state.mathPromise = new Promise((resolve,reject)=>{

            const script = document.createElement('script');

            script.src =
                'Data/Lib/math.js';

            script.async = true;

            script.onload = () => {

                if(window.math){

                    state.mathReady = true;

                    resolve(
                        window.math
                    );

                }else{

                    reject(
                        new Error(
                            'math.js loaded without math global'
                        )
                    );

                }

            };

            script.onerror = () => {

                reject(
                    new Error(
                        'Failed to load math.js'
                    )
                );

            };

            document.head.appendChild(script);

        });

        return state.mathPromise;
    }

    function loadMathLive(){

        if(window.MathfieldElement){

            window.MathfieldElement.fontsDirectory =
                'Data/Lib/MathLive/fonts';

            window.MathfieldElement.soundsDirectory =
                null;

            return Promise.resolve(
                window.MathfieldElement
            );
        }

        if(state.mathLivePromise){
            return state.mathLivePromise;
        }

        state.mathLivePromise = new Promise((resolve,reject)=>{

            const script =
                document.createElement('script');

            script.src =
                'Data/Lib/MathLive/mathlive.min.js';

            script.async = true;

            script.onload = async () => {

                try{

                    await customElements.whenDefined(
                        'math-field'
                    );

                    if(window.MathfieldElement){

                        window.MathfieldElement.fontsDirectory =
                            'Data/Lib/MathLive/fonts';

                        window.MathfieldElement.soundsDirectory =
                            null;
                    }

                    resolve(
                        window.MathfieldElement || true
                    );

                }catch(error){

                    reject(error);

                }

            };

            script.onerror = () => {

                reject(
                    new Error(
                        'Failed to load MathLive'
                    )
                );

            };

            document.head.appendChild(script);

        });

        return state.mathLivePromise;
    }

    function setStatus(
        text,
        isError=false
    ){

        const status =
            $('eto-calc-status');

        if(!status) return;

        status.textContent =
            text;

        status.classList.toggle(
            'text-red-500',
            isError
        );

        status.classList.toggle(
            'text-emerald-400',
            !isError
        );
    }

    function setButtonsDisabled(
        disabled
    ){

        document
            .querySelectorAll(
                '#page-calculator .eto-calc-key'
            )
            .forEach(btn => {

                btn.disabled =
                    disabled;

                btn.style.opacity =
                    disabled
                        ? '.55'
                        : '';

            });
    }

    function getMathField(){

        return $('eto-calc-field');

    }

    function fieldLatex(){

        const mf =
            getMathField();

        return mf
            ? String(
                mf.getValue('latex') || ''
            )
            : '';

    }

    function insertLatex(
        value,
        selectionMode='after'
    ){

        const mf =
            getMathField();

        if(!mf) return;

        mf.focus();

        mf.insert(
            value,
            {
                selectionMode
            }
        );
    }

    function endsWithOperator(
        latex
    ){

        return /[+\-*/^=({[,\s]$/.test(
            latex
        );

    }

    function insertFunction(
        name
    ){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? `\\${name}(#?)`
                : `\\${name}(#@)`;

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertSqrt(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '\\sqrt{#?}'
                : '\\sqrt{#@}';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertFraction(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '\\frac{#?}{#?}'
                : '\\frac{#@}{#?}';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertSquare(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '#?^2'
                : '#@^2';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertPower(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '#?^{#?}'
                : '#@^{#?}';

        insertLatex(
            token,
            'placeholder'
        );
    }

    function insertFactorial(){

        const latex =
            fieldLatex();

        const token =
            endsWithOperator(latex) ||
            !latex
                ? '#?!'
                : '#@!';

        insertLatex(
            token,
            'after'
        );
    }

    function removeLast(){

        const mf =
            getMathField();

        if(!mf) return;

        mf.focus();

        mf.executeCommand(
            'deleteBackward'
        );
    }

    function clearAll(){

        const mf =
            getMathField();

        const result =
            $('eto-calc-result');

        if(mf){

            mf.setValue(
                ''
            );

            mf.focus();

        }

        if(result){

            result.textContent =
                '0';

        }

        setStatus(
            state.mathReady
                ? 'جاهز'
                : 'جاري تجهيز الآلة...'
        );
    }

    function angleFactor(){

        return state.angle === 'DEG'
            ? Math.PI / 180
            : 1;
    }

    function fromRadians(
        value
    ){

        return state.angle === 'DEG'
            ? value * 180 / Math.PI
            : value;
    }

    function buildScope(){

        const factor =
            angleFactor();

        const sin =
            value =>
                Math.sin(
                    Number(value) *
                    factor
                );

        const cos =
            value =>
                Math.cos(
                    Number(value) *
                    factor
                );

        const tan =
            value =>
                Math.tan(
                    Number(value) *
                    factor
                );

        return {

            ans:
                state.lastResult === null ||
                typeof state.lastResult === 'undefined'
                    ? 0
                    : state.lastResult,

            sin,

            cos,

            tan,

            csc:
                value =>
                    1 / sin(value),

            sec:
                value =>
                    1 / cos(value),

            cot:
                value =>
                    1 / tan(value),

            log10:
                value =>
                    Math.log10(
                        Number(value)
                    ),

            ln:
                value =>
                    Math.log(
                        Number(value)
                    ),

            asin:
                value =>
                    fromRadians(
                        Math.asin(
                            Number(value)
                        )
                    ),

            acos:
                value =>
                    fromRadians(
                        Math.acos(
                            Number(value)
                        )
                    ),

            atan:
                value =>
                    fromRadians(
                        Math.atan(
                            Number(value)
                        )
                    )
        };
    }

    function readGroup(
        str,
        index
    ){

        if(
            str[index] !== '{'
        ){

            return {
                value:
                    str[index] || '',

                next:
                    index + 1
            };

        }

        let depth =
            0;

        for(
            let i = index;
            i < str.length;
            i++
        ){

            if(
                str[i] === '{'
            ){

                depth++;

            }else if(
                str[i] === '}'
            ){

                depth--;

                if(depth === 0){

                    return {

                        value:
                            str.slice(
                                index + 1,
                                i
                            ),

                        next:
                            i + 1
                    };

                }

            }

        }

        throw new Error(
            'Unclosed group'
        );
    }

    function readAtom(
        str,
        index
    ){

        if(
            str[index] === '{'
        ){

            return readGroup(
                str,
                index
            );

        }

        let j =
            index;

        while(
            j < str.length &&
            /[A-Za-z0-9.]/.test(
                str[j]
            )
        ){

            j++;

        }

        if(j === index){

            return {

                value:
                    str[index] || '',

                next:
                    index + 1

            };

        }

        return {

            value:
                str.slice(
                    index,
                    j
                ),

            next:
                j
        };
    }

    function latexToMathJs(
        input
    ){

        const source =
            String(input || '')
                .replace(
                    /\\left|\\right|\\displaystyle|\\textstyle/g,
                    ''
                )
                .replace(
                    /\\!|\\,|\\;|\\:/g,
                    ''
                )
                .trim();

        const commands = {

            sin:'sin',

            cos:'cos',

            tan:'tan',

            csc:'csc',

            sec:'sec',

            cot:'cot',

            ln:'ln',

            log:'log10',

            pi:'pi',

            cdot:'*',

            times:'*',

            div:'/'
        };

        function convert(
            str
        ){

            let out =
                '';

            for(
                let i = 0;
                i < str.length;
            ){

                const ch =
                    str[i];

                if(
                    ch === '\\'
                ){

                    let j =
                        i + 1;

                    while(
                        j < str.length &&
                        /[A-Za-z]/.test(
                            str[j]
                        )
                    ){

                        j++;

                    }

                    const command =
                        str.slice(
                            i + 1,
                            j
                        );

                    if(
                        command === 'frac'
                    ){

                        const numerator =
                            readGroup(
                                str,
                                j
                            );

                        const denominator =
                            readGroup(
                                str,
                                numerator.next
                            );

                        out +=
                            '(' +
                            convert(
                                numerator.value
                            ) +
                            ')/(' +
                            convert(
                                denominator.value
                            ) +
                            ')';

                        i =
                            denominator.next;

                        continue;
                    }

                    if(
                        command === 'sqrt'
                    ){

                        let cursor =
                            j;

                        if(
                            str[cursor] === '['
                        ){

                            const end =
                                str.indexOf(
                                    ']',
                                    cursor + 1
                                );

                            cursor =
                                end >= 0
                                    ? end + 1
                                    : cursor;

                        }

                        const inside =
                            readGroup(
                                str,
                                cursor
                            );

                        out +=
                            'sqrt(' +
                            convert(
                                inside.value
                            ) +
                            ')';

                        i =
                            inside.next;

                        continue;
                    }

                    if(
                        command === 'operatorname'
                    ){

                        const inside =
                            readGroup(
                                str,
                                j
                            );

                        out +=
                            convert(
                                inside.value
                            );

                        i =
                            inside.next;

                        continue;
                    }

                    if(
                        command === 'text'
                    ){

                        const inside =
                            readGroup(
                                str,
                                j
                            );

                        out +=
                            convert(
                                inside.value
                            );

                        i =
                            inside.next;

                        continue;
                    }

                    out +=
                        commands[command] ??
                        command;

                    i =
                        j;

                    continue;
                }

                if(
                    ch === '{'
                ){

                    const group =
                        readGroup(
                            str,
                            i
                        );

                    out +=
                        '(' +
                        convert(
                            group.value
                        ) +
                        ')';

                    i =
                        group.next;

                    continue;
                }

                if(
                    ch === '^'
                ){

                    const atom =
                        readAtom(
                            str,
                            i + 1
                        );

                    out +=
                        '^(' +
                        convert(
                            atom.value
                        ) +
                        ')';

                    i =
                        atom.next;

                    continue;
                }

                if(
                    ch === '_'
                ){

                    const atom =
                        readAtom(
                            str,
                            i + 1
                        );

                    i =
                        atom.next;

                    continue;
                }

                if(
                    /\s/.test(ch)
                ){

                    i++;

                    continue;
                }

                out +=
                    ch;

                i++;
            }

            return out;
        }

        let expression =
            convert(
                source
            )
            .replace(
                /(\d|\))(?=(pi|ans|[A-Za-z]))/g,
                '$1*'
            )
            .replace(
                /(\d|\)|pi|ans)(?=\()/g,
                '$1*'
            )
            .replace(
                /(\))(?=[A-Za-z])/g,
                '$1*'
            );

        return expression;
    }

    function formatResult(
        math,
        value
    ){

        if(
            typeof value === 'number'
        ){

            if(
                Number.isNaN(value)
            ){

                return 'NaN';

            }

            if(
                !Number.isFinite(value)
            ){

                return value > 0
                    ? '∞'
                    : '-∞';

            }

            return math.format(
                value,
                {
                    precision:14
                }
            );
        }

        try{

            return math.format(
                value,
                {
                    precision:14
                }
            );

        }catch(e){

            return String(value);

        }
    }

    function escapeHtml(
        value
    ){

        return String(
            value ?? ''
        )
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        );
    }

    function getHistory(){

        try{

            const items =
                JSON.parse(
                    localStorage.getItem(
                        'eto-calculator-history'
                    ) || '[]'
                );

            return Array.isArray(items)
                ? items
                : [];

        }catch(e){

            return [];

        }
    }

    function saveHistory(
        expression,
        result
    ){

        try{

            const old =
                getHistory();

            old.unshift({

                expression,

                result,

                time:
                    new Date()
                        .toLocaleString(
                            'ar-EG'
                        )

            });

            localStorage.setItem(
                'eto-calculator-history',
                JSON.stringify(
                    old
                )
            );

        }catch(e){}

        renderHistory();
    }

    async function renderHistory(){

        const wrap =
            $('eto-calc-history-page');

        if(!wrap) return;

        const items =
            getHistory();

        if(!items.length){

            wrap.innerHTML = `
                <div class="eto-calc-empty-history">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <strong>لسه مفيش عمليات محفوظة</strong>
                    <span>كل عملية بتحسبها هتظهر هنا تلقائيًا.</span>
                </div>
            `;

            return;
        }

        try{

            await loadMathLive();

        }catch(e){}

        wrap.innerHTML =
            items.map(
                (item,index) => `

                    <div
                        class="eto-calc-history-item"
                        role="button"
                        tabindex="0"
                        data-history-index="${index}"
                    >

                        <math-field
                            class="eto-calc-history-math"
                            read-only
                            math-virtual-keyboard-policy="manual"
                        ></math-field>

                        <div class="eto-calc-history-result">
                            = ${escapeHtml(
                                item.result
                            )}
                        </div>

                        <div class="eto-calc-history-meta">
                            ${escapeHtml(
                                item.time || ''
                            )}
                        </div>

                    </div>

                `
            )
            .join('');

        wrap
            .querySelectorAll(
                '[data-history-index]'
            )
            .forEach(
                itemEl => {

                    const index =
                        Number(
                            itemEl.dataset
                                .historyIndex
                        );

                    const mathField =
                        itemEl.querySelector(
                            'math-field'
                        );

                    const item =
                        items[index];

                    if(
                        mathField &&
                        item
                    ){

                        mathField.value =
                            item.expression || '';

                    }

                    const openItem =
                        () => {

                            const selected =
                                getHistory()[index];

                            if(!selected)
                                return;

                            navigate(
                                'calculator'
                            );

                            requestAnimationFrame(
                                () => {

                                    const mf =
                                        getMathField();

                                    if(mf){

                                        mf.setValue(
                                            selected.expression ||
                                            ''
                                        );

                                        mf.focus();

                                    }

                                }
                            );
                        };

                    itemEl.addEventListener(
                        'click',
                        openItem
                    );

                    itemEl.addEventListener(
                        'keydown',
                        event => {

                            if(
                                event.key === 'Enter' ||
                                event.key === ' '
                            ){

                                event.preventDefault();

                                openItem();

                            }

                        }
                    );

                }
            );
    }

    async function calculate(){

        const resultEl =
            $('eto-calc-result');

        const mf =
            getMathField();

        if(
            !resultEl ||
            !mf
        ){

            return;
        }

        const latex =
            fieldLatex().trim();

        if(!latex){

            resultEl.textContent =
                '0';

            return;
        }

        try{

            const math =
                await loadMathJs();

            const expression =
                latexToMathJs(
                    latex
                );

            const result =
                math.evaluate(
                    expression,
                    buildScope()
                );

            state.lastResult =
                result;

            const formatted =
                formatResult(
                    math,
                    result
                );

            resultEl.textContent =
                formatted;

            saveHistory(
                latex,
                formatted
            );

            setStatus(
                'تم الحساب'
            );

        }catch(error){

            console.error(
                '[Eto Calculator]',
                error
            );

            resultEl.textContent =
                'خطأ';

            setStatus(
                'راجع العملية الحسابية',
                true
            );
        }
    }

    async function copyResult(){

        const result =
            $('eto-calc-result')
                ?.textContent ||
            '';

        if(
            !result ||
            result === '0' ||
            result === 'خطأ'
        ){

            return;

        }

        try{

            await navigator.clipboard.writeText(
                result
            );

            setStatus(
                'تم نسخ النتيجة'
            );

        }catch(e){

            setStatus(
                'النسخ مش متاح دلوقتي',
                true
            );

        }
    }

    function updateAngle(){

        const btn =
            $('eto-calc-angle');

        if(btn){

            btn.textContent =
                state.angle;

        }
    }

    function handleButton(
        btn
    ){

        const action =
            btn.dataset.action;

        const value =
            btn.dataset.value;

        const fn =
            btn.dataset.function;

        if(
            action === 'clear'
        ){

            clearAll();

            return;
        }

        if(
            action === 'delete'
        ){

            removeLast();

            return;
        }

        if(
            action === 'equals'
        ){

            calculate();

            return;
        }

        if(
            action === 'copy'
        ){

            copyResult();

            return;
        }

        if(
            action === 'history'
        ){

            navigate(
                'calculator-history'
            );

            requestAnimationFrame(
                renderHistory
            );

            return;
        }

        if(
            action === 'angle'
        ){

            state.angle =
                state.angle === 'DEG'
                    ? 'RAD'
                    : 'DEG';

            updateAngle();

            setStatus(
                `الوضع ${state.angle}`
            );

            return;
        }

        if(
            action === 'ans'
        ){

            insertLatex(
                'ans',
                'after'
            );

            return;
        }

        if(
            action === 'fraction'
        ){

            insertFraction();

            return;
        }

        if(
            action === 'sqrt'
        ){

            insertSqrt();

            return;
        }

        if(
            action === 'square'
        ){

            insertSquare();

            return;
        }

        if(
            action === 'power'
        ){

            insertPower();

            return;
        }

        if(fn){

            insertFunction(
                fn
            );

            return;
        }

        if(
            typeof value === 'string'
        ){

            if(
                value === '!'
            ){

                insertFactorial();

            }else{

                insertLatex(
                    value,
                    'after'
                );

            }
        }
    }

    function wire(){

        if(
            state.initialized
        ){

            renderHistory();

            return;
        }

        if(
            !$('page-calculator')
        ){

            return;
        }

        state.initialized =
            true;

        document
            .querySelectorAll(
                '#page-calculator .eto-calc-key'
            )
            .forEach(
                btn => {

                    btn.addEventListener(
                        'click',
                        () =>
                            handleButton(btn)
                    );

                }
            );

        $('eto-calc-history-back')
            ?.addEventListener(
                'click',
                () =>
                    navigate(
                        'calculator'
                    )
            );

        $('eto-calc-clear-history')
            ?.addEventListener(
                'click',
                () => {

                    try{

                        localStorage.removeItem(
                            'eto-calculator-history'
                        );

                    }catch(e){}

                    renderHistory();

                }
            );

        const mf =
            getMathField();

        mf?.addEventListener(
            'keydown',
            event => {

                if(
                    event.key === 'Enter'
                ){

                    event.preventDefault();

                    calculate();

                }

                if(
                    event.key === 'Escape'
                ){

                    event.preventDefault();

                    clearAll();

                }

            }
        );

        updateAngle();

        setButtonsDisabled(
            true
        );

        setStatus(
            'جاري تجهيز الآلة...'
        );

        Promise.all([
            loadMathLive(),
            loadMathJs()
        ])
        .then(
            () => {

                setButtonsDisabled(
                    false
                );

                setStatus(
                    'جاهز'
                );

            }
        )
        .catch(
            () => {

                setButtonsDisabled(
                    false
                );

                setStatus(
                    'تعذر تحميل المكتبة',
                    true
                );

            }
        );
    }

    window.initEtoCalculator =
        wire;

})();
