        window.EtoUpdatesReady = window.EtoUpdatesReady || Promise.resolve(window.EtoUpdates || null);

        let currentPageId = 'portal';
        let hookPageId = 'portal'; // آخر صفحة اتعرضت فعلًا (عشان نعرف نقفل الجهاز لما نسيبه)
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
                'extra-tools', 'pdf-tools', 'audio-tools', 'edu-tools', 'exam-tools', 'study-tools', 'calc-tools', 'tool-view',
                'translate', 'calculator', 'calculator-history',
                'mp4-to-mp3', 'mp3-to-mp4', 'mp3-to-wav', 'wav-to-mp3', 'mp3-to-ogg', 'ogg-to-mp3',
                'cleaner', 'image-cleaner', 'compress', 'merge', 'compare', 'extract', 'editor',
                'convert', 'text', 'pdf-to-word', 'ppt-pdf', 'reader', 'watermark', 'reorder', 'protect',
                'grades', 'certificate', 'templates', 'template-settings', 'answers-key',
                'exam-maker', 'percentage', 'pomodoro', 'teacher', 'photos', 'photos-download',
                'islamic', 'programming', 'python', 'python-course', 'python-day', 'python-lesson', 'python-libs', 'python-mindmap', 'python-pc'
            ]);
            document.body.classList.toggle('eto-hide-robot', toolPageIds.has(pageId));

            if (pageId === 'portal') {
                navigationStack = ['portal'];
            } else if (addHistory && pageId !== currentPageId) {
                const last = navigationStack[navigationStack.length - 1];
                if (last !== currentPageId) navigationStack.push(currentPageId);
            }

            if (hookPageId === 'python-pc' && pageId !== 'python-pc' && typeof window.unloadPythonPC === 'function') window.unloadPythonPC();
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
            hookPageId = pageId;
            navigationStarted = pageId !== 'portal';
            if (window.EtoUpdates && typeof window.EtoUpdates.renderForPage === 'function') {
                window.EtoUpdates.renderForPage(pageId);
            }

            if (pageId !== 'tool-view' && location.hash.slice(1) !== pageId) {
                history.replaceState({ page: pageId }, '', pageId === 'portal' ? location.pathname + location.search : '#' + pageId);
            }
            runPageHooks(pageId);
        }

        // دوال بتتنفذ لما صفحة معينة تتفتح (الدوال دي في ملفات تانية، فبنتأكد إنها موجودة الأول)
        const PAGE_HOOKS = {
            photos: 'loadEtoPhotos',
            'photos-download': 'loadEtoPhotoDownload',
            schedule: 'fitScheduleZoom',
            certificate: 'certFitStage',
            calculator: 'initEtoCalculator',
            programming: 'loadProgrammingPage',
            python: 'loadPythonPage',
            'python-course': 'loadPythonCourse',
            'python-day': 'loadPythonDay',
            'python-lesson': 'loadPythonLesson',
            'python-libs': 'loadPythonLibs',
            'python-mindmap': 'loadPythonMindmap',
            'python-pc': 'loadPythonPC'
        };
        function runPageHooks(pageId) {
            const fn = window[PAGE_HOOKS[pageId]];
            if (typeof fn === 'function') requestAnimationFrame(fn);
        }

        // صفحات الأقسام الفرعية للأدوات: الرجوع منها يروح لصفحة الأدوات (حتى لو اتفتحت من لينك مباشر أو Refresh)
        const TOOLS_SUBPAGES = new Set(['pdf-tools', 'audio-tools', 'edu-tools', 'exam-tools', 'study-tools', 'calc-tools']);
        function baseStackFor(pageId) {
            if (pageId === 'python') return ['portal', 'programming'];
            if (pageId === 'python-day') return ['portal', 'programming', 'python', 'python-course'];
            if (pageId === 'python-lesson') return ['portal', 'programming', 'python', 'python-course', 'python-day'];
            if (/^python-/.test(pageId)) return ['portal', 'programming', 'python'];
            return TOOLS_SUBPAGES.has(pageId) ? ['portal', 'extra-tools'] : ['portal'];
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
            navigationStack = baseStackFor(pageId);
            navigate(pageId, false);
        });

        const initialToolRoute = parseToolHash();
        if (initialToolRoute) {
            navigationStack = ['portal'];
            openEduTool(initialToolRoute.id, initialToolRoute.inner, 'load');
        } else if (location.hash && document.getElementById('page-' + location.hash.slice(1))) {
            currentPageId = location.hash.slice(1);
            navigationStarted = currentPageId !== 'portal';
            navigationStack = baseStackFor(currentPageId);
            navigate(currentPageId, false);
        } else {
            history.replaceState({ page: 'portal' }, '', location.pathname + location.search);
            navigate('portal', false);
        }

        // لو الصفحة اتفتحت من لينك مباشر (#certificate مثلاً) الملفات التانية لسه ماتحملتش، فنعيد الـhook بعد التحميل
        window.addEventListener('load', () => runPageHooks(currentPageId));
