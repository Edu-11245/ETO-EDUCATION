(function () {
    'use strict';

    const WHATSAPP_URL = 'https://wa.me/201096925903';

    const ETO_UPDATES = [
        {
            id: 'science-library-2026-09-28',
            version: '2026-09-28-science-library-v1',
            date: '28 سبتمبر 2026',
            time: '10:30 م',
            timestamp: '2026-09-28T22:30:00+03:00',
            type: 'ميزة جديدة',
            targetPage: 'كلية العلوم',
            icon: 'fa-flask',
            iconClass: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400',
            title: 'إضافة مكتبة كلية العلوم',
            short: 'اتضافت مكتبة جديدة لطلاب كلية العلوم فيها الشروحات والمحاضرات والملخصات والملفات، وكل مادة بقت منظمة لوحدها.',
            why: 'عشان طالب كلية العلوم يلاقي المحتوى الدراسي بتاعه في مكان واحد ويدخل على المادة اللي محتاجها بسرعة.',
            details: 'المكتبة بتجمع محتوى المواد في مكان واحد، وتقدر من خلالها تتصفح كل مادة وتشوف الملفات المتاحة وتفتحها أو تحملها بسهولة.',
            features: [
                'قسم مخصص لطلاب كلية العلوم',
                'المواد متقسمة بشكل واضح',
                'عرض الشروحات والمحاضرات والملخصات',
                'فتح الملفات من داخل الموقع',
                'تحميل الملفات بسهولة'
            ],
            status: 'متاح الآن'
        },
        {
            id: 'developer-profile-2026-09-28',
            version: '2026-09-28-developer-profile-v1',
            date: '28 سبتمبر 2026',
            time: '10:00 م',
            timestamp: '2026-09-28T22:00:00+03:00',
            type: 'تطوير',
            targetPage: 'Developer',
            icon: 'fa-code',
            iconClass: 'text-blue-600 bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400',
            title: 'تطوير قسم Developer',
            short: 'اتطور قسم Developer وبقى فيه تعريف أوضح بالمطور، ومعاه قسم مخصص لمحتوى كلية العلوم.',
            why: 'عشان يبقى فيه مكان واضح للتعريف بمطور المنصة، وفي نفس الوقت الوصول لمحتوى كلية العلوم يبقى أسهل.',
            details: 'اتضافت بطاقة تعريف بالمطور داخل القسم، وبعدها مكتبة خاصة بكلية العلوم فيها المحتوى التعليمي مرتب حسب المادة.',
            features: [
                'بطاقة تعريف بالمطور',
                'عرض صورة وهوية مطور المنصة',
                'قسم خاص بمحتوى كلية العلوم',
                'تنظيم المحتوى حسب المادة',
                'تصميم موحد مع Eto.Edu'
            ],
            status: 'متاح الآن'
        },
        {
            id: 'assistant-bot-2026-09-25',
            version: '2026-09-25-bot-v1',
            date: '25 سبتمبر 2026',
            time: '08:00 ص',
            timestamp: '2026-09-25T08:00:00+03:00',
            type: 'ميزة جديدة',
            targetPage: 'مساعد الموقع',
            icon: 'fa-robot',
            iconClass: 'text-blue-600 bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400',
            title: 'إضافة بوت مساعد الموقع',
            short: 'ضيفنا بوت مساعد للموقع يقدر يوجّه المستخدم للأداة المناسبة ويتكلم معاه بطريقة بسيطة وطبيعية.',
            why: 'الهدف إن المستخدم ميحتاجش يدوّر بين الأدوات؛ يقدر يسأل البوت بشكل عادي وهو يساعده يوصل للأداة أو المعلومة المناسبة.',
            details: 'المساعد مصمم بطابع مصري بسيط، وبيعتمد على قاعدة بيانات للمحادثات والكلمات المفتاحية عشان يفهم الأسئلة المرتبطة بأدوات Eto.Edu ويرد بشكل مناسب. البوت ظاهر كعنصر تفاعلي فوق الصفحة، والضغط عليه بيفتح واجهة المساعد مباشرة.',
            features: [
                'مساعد ظاهر وتفاعلي داخل الموقع',
                'اقتراح الأداة المناسبة حسب سؤال المستخدم',
                'ردود عربية مصرية بسيطة وطبيعية',
                'قاعدة بيانات قابلة للتوسعة بسهولة',
                'واجهة شات مستقلة داخل الموقع'
            ],
            status: 'متاح الآن'
        },
        {
            id: 'pdf-to-word-2026-09-24',
            version: '2026-09-24-pdf-word-v1',
            date: '24 سبتمبر 2026',
            time: '09:00 م',
            timestamp: '2026-09-24T21:00:00+03:00',
            type: 'أداة جديدة',
            targetPage: 'أدوات إضافية',
            icon: 'fa-file-word',
            iconClass: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400',
            title: 'إضافة تحويل PDF إلى Word',
            short: 'اتضافت أداة لتحويل ملفات PDF إلى Word عشان تقدر تعدّل النص بدل ما تفضل شغال على الملف كصورة أو PDF ثابت.',
            why: 'بدل ما تعيد كتابة المحتوى من البداية، الأداة بتساعدك تحول الملف لصيغة Word قابلة للتحرير حسب محتوى الملف.',
            details: 'الأداة موجودة ضمن أدوات الملفات الإضافية في Eto.Edu، وهدفها تسهيل التعامل مع المستندات اللي محتاج تعدّل محتواها بعد استخراجها من PDF.',
            features: [
                'تحويل ملف PDF إلى مستند Word',
                'الوصول إليها من قسم أدوات إضافية',
                'مناسبة للمستندات اللي محتاجة تعديل',
                'جزء من مجموعة أدوات الملفات في المنصة'
            ],
            status: 'متاح الآن'
        },
    {
        id: 'translate-tool-2026-09-25',
        version: '2026-09-25-translate-v1',
        date: '25 سبتمبر 2026',
        time: '08:30 م',
        timestamp: '2026-09-25T20:30:00+03:00',
        type: 'أداة جديدة',
        targetPage: 'أدوات الطالب',
        icon: 'fa-language',
        iconClass: 'text-violet-600 bg-violet-100 dark:bg-violet-950/40 dark:text-violet-400',
        title: 'إضافة أداة ترجملي',
        short: 'اتضافت أداة ترجملي للطلاب عشان تكتب أي كلمة أو نص وتاخد الترجمة بسرعة، ومعاها معنى مبسط بالمصري.',
        why: 'بدل ما الطالب يخرج من Eto.Edu ويفتح مترجم خارجي، يقدر يترجم النص مباشرة من المنصة.',
        details: 'ترجملي بتسمح بكتابة نص واختيار اللغة أو استخدام الاكتشاف التلقائي، ثم عرض الترجمة في مكان واضح، ومع الترجمة للعربي يظهر شرح بصياغة مصرية أبسط لفهم المعنى.',
        features: [
            'اكتشاف اللغة تلقائيًا',
            'ترجمة النصوص والكلمات',
            'اختيار لغة الترجمة',
            'نسخ الترجمة بضغطة',
            'شرح مبسط بالمصري عند الترجمة للعربي'
        ],
        status: 'متاح الآن'
    }
    ];

    function sortUpdates(items) {
        return [...items].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function updateSeenKey(update) {
        return `eto-update-seen:${update.id}:${update.version}`;
    }

    function isSeen(update) {
        try {
            return localStorage.getItem(updateSeenKey(update)) === '1';
        } catch (e) {
            return false;
        }
    }

    function markSeen(update) {
        try {
            localStorage.setItem(updateSeenKey(update), '1');
        } catch (e) {}
    }

    function latest() {
        return sortUpdates(ETO_UPDATES)[0] || null;
    }

    function updateFeaturesHtml(update) {
        return (update.features || []).map(feature => `
            <span class="page-update-feature">
                <i class="fa-solid fa-circle-check"></i>
                ${escapeHtml(feature)}
            </span>
        `).join('');
    }

    function renderHomeUpdate() {
        const target = document.getElementById('page-home');
        if (!target) return;

        const update = latest();
        if (!update || isSeen(update)) return;

        let host = target.querySelector('.page-update-host');
        if (!host) {
            host = document.createElement('div');
            host.className = 'page-update-host';
            const hero = target.querySelector('.home-hero');
            if (hero) hero.insertAdjacentElement('afterend', host);
            else target.insertBefore(host, target.firstChild);
        }

        host.innerHTML = `
            <div class="page-update-wrap">
                <div class="page-update-card">
                    <div class="page-update-top">
                        <div class="min-w-0">
                            <span class="page-update-badge">
                                <i class="fa-solid ${escapeHtml(update.icon)}"></i>
                                ${escapeHtml(update.type)}
                            </span>
                            <h3>${escapeHtml(update.title)}</h3>
                            <p>${escapeHtml(update.short)}</p>
                        </div>
                        <div class="page-update-meta">
                            <span class="page-update-date">${escapeHtml(update.date)} • ${escapeHtml(update.time)}</span>
                            <button type="button" class="page-update-close" aria-label="إغلاق التحديث">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="page-update-features">${updateFeaturesHtml(update)}</div>
                    <div class="page-update-actions">
                        <a class="page-update-details" href="updates.html#${encodeURIComponent(update.id)}">
                            عرض تفاصيل التحديث
                            <i class="fa-solid fa-arrow-left"></i>
                        </a>
                        <span class="page-update-target">
                            ${escapeHtml(update.targetPage)}
                        </span>
                    </div>
                </div>
            </div>
        `;

        host.querySelector('.page-update-close')?.addEventListener('click', () => {
            markSeen(update);
            host.innerHTML = '';
        });
    }

    function renderForPage(pageId) {
        if (pageId === 'home') renderHomeUpdate();
    }

    function updatePageCss() {
        if (document.getElementById('eto-updates-runtime-style')) return;

        const style = document.createElement('style');
        style.id = 'eto-updates-runtime-style';
        style.textContent = `
            .page-update-meta{display:flex;align-items:center;gap:8px;flex:none}
            .page-update-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px dashed #bfdbfe;position:relative;z-index:1}
            .page-update-details{display:inline-flex;align-items:center;gap:7px;color:#2563eb;font-size:10px;font-weight:900;text-decoration:none}
            .page-update-details:hover{text-decoration:underline}
            .page-update-target{font-size:9px;font-weight:900;color:#64748b}
            .page-update-card .page-update-badge i{font-size:9px}
            .page-update-feature i{color:#2563eb}
            .dark .page-update-actions{border-color:#1e3a8a}
            .dark .page-update-target{color:#94a3b8}
            @media(max-width:640px){
                .page-update-meta{align-items:flex-end;gap:6px}
                .page-update-actions{align-items:flex-start;flex-direction:column}
                .page-update-target{font-size:8.5px}
            }
        `;
        document.head.appendChild(style);
    }

    function renderUpdatesPage() {
        const root = document.getElementById('eto-updates-page');
        if (!root) return;

        updatePageCss();

        const updates = sortUpdates(ETO_UPDATES);
        const hashId = decodeURIComponent(location.hash.replace(/^#/, ''));
        const selected = updates.find(update => update.id === hashId) || updates[0];

        root.innerHTML = `
            <main class="updates-shell">
                <section class="updates-hero">
                    <div class="updates-hero-glow one"></div>
                    <div class="updates-hero-glow two"></div>
                    <div class="updates-hero-inner">
                        <span class="updates-kicker"><i class="fa-solid fa-sparkles"></i> Eto.Edu Updates</span>
                        <h1>آخر تحديثات المنصة</h1>
                        <p>كل ميزة جديدة أو تطوير مهم في Eto.Edu هتلاقيه هنا بالتاريخ، وقت الإضافة، والفايدة منه بالتفصيل.</p>
                        <div class="updates-hero-actions">
                            <a href="index.html" class="updates-back"><i class="fa-solid fa-arrow-right"></i> الرجوع للموقع</a>
                            ${WHATSAPP_URL.includes('XXXXXXXXXX') ? '' : `<a href="${escapeHtml(WHATSAPP_URL)}" target="_blank" rel="noopener" class="updates-whatsapp"><i class="fa-brands fa-whatsapp"></i> ابعتلي فكرة</a>`}
                        </div>
                    </div>
                </section>

                <section class="updates-section">
                    <div class="updates-section-head">
                        <div>
                            <span class="updates-section-kicker">بالتفصيل</span>
                            <h2>${escapeHtml(selected?.title || 'تحديثات المنصة')}</h2>
                            <p>التحديث المختار بالتفصيل، وبعده كل التحديثات السابقة.</p>
                        </div>
                    </div>

                    ${selected ? renderDetailCard(selected) : ''}

                    <div class="updates-list-head">
                        <h3>سجل التحديثات</h3>
                        <span>${updates.length} تحديثات</span>
                    </div>

                    <div class="updates-grid">
                        ${updates.map(renderListCard).join('')}
                    </div>
                </section>
            </main>
        `;
    }

    function renderDetailCard(update) {
        return `
            <article class="update-detail-card" id="detail-${escapeHtml(update.id)}">
                <div class="update-detail-top">
                    <div class="update-detail-icon ${escapeHtml(update.iconClass)}">
                        <i class="fa-solid ${escapeHtml(update.icon)}"></i>
                    </div>
                    <div class="update-detail-meta">
                        <span>${escapeHtml(update.type)}</span>
                        <b>${escapeHtml(update.date)} • ${escapeHtml(update.time)}</b>
                    </div>
                </div>
                <h3>${escapeHtml(update.title)}</h3>
                <p class="update-detail-short">${escapeHtml(update.short)}</p>
                <div class="update-detail-columns">
                    <div class="update-info-box">
                        <span>إيه الإضافة؟</span>
                        <p>${escapeHtml(update.details)}</p>
                    </div>
                    <div class="update-info-box">
                        <span>إيه لازمتها؟</span>
                        <p>${escapeHtml(update.why)}</p>
                    </div>
                </div>
                <div class="update-feature-list">
                    ${(update.features || []).map(feature => `
                        <div><i class="fa-solid fa-check"></i><span>${escapeHtml(feature)}</span></div>
                    `).join('')}
                </div>
                <div class="update-detail-footer">
                    <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(update.targetPage)}</span>
                    <span class="update-status">${escapeHtml(update.status)}</span>
                </div>
            </article>
        `;
    }

    function renderListCard(update) {
        return `
            <a class="update-list-card" href="updates.html#${encodeURIComponent(update.id)}">
                <div class="update-list-card-top">
                    <div class="update-list-icon ${escapeHtml(update.iconClass)}"><i class="fa-solid ${escapeHtml(update.icon)}"></i></div>
                    <span class="update-list-type">${escapeHtml(update.type)}</span>
                </div>
                <h3>${escapeHtml(update.title)}</h3>
                <p>${escapeHtml(update.short)}</p>
                <div class="update-list-footer">
                    <span>${escapeHtml(update.date)}</span>
                    <span>${escapeHtml(update.time)}</span>
                </div>
            </a>
        `;
    }

    window.EtoUpdates = {
        data: ETO_UPDATES,
        whatsappUrl: WHATSAPP_URL,
        latest,
        renderForPage,
        renderUpdatesPage
    };

    updatePageCss();

    if (!window.__ETO_MODERN_UPDATES_PAGE) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                renderUpdatesPage();
            }, { once: true });
        } else {
            renderUpdatesPage();
        }
    }
})();
