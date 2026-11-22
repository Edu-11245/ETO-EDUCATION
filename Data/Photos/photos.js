
(() => {
    'use strict';

    const root = document.getElementById('page-photos');
    if (!root) return;

    const config = window.ETO_PHOTOS_CONFIG || {};
    const PIXABAY_KEY = String(config.pixabayApiKey || '').trim();
    const PIXABAY_API = 'https://pixabay.com/api/';
    const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
    const CACHE_KEY = 'eto.photos.unified.cache.v3';
    const SAVED_KEY = 'eto.photos.unified.saved.v3';
    const DOWNLOAD_KEY = 'eto.photos.download.current.v1';
    const PIXABAY_CACHE_TTL = 24 * 60 * 60 * 1000;
    const COMMONS_CACHE_TTL = 12 * 60 * 60 * 1000;
    const PIXABAY_PER_PAGE = 100;
    const COMMONS_PER_PAGE = 50;
    const PIXABAY_MAX_PAGES = 5; // Pixabay itself stops at 500 results per query; Wikimedia Commons keeps the feed going after that
    const $ = selector => root.querySelector(selector);
    const downloadPage = document.getElementById('page-photos-download');
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const grid = $('#photos-grid');
    const searchInput = $('#photos-search');
    const categoryWrap = $('#photos-categories');
    const emptyState = $('#photos-empty');
    const lightbox = $('#photos-lightbox');
    const statusBox = $('#photos-status');
    const loadMoreButton = $('#photos-load-more');
    const resultCount = $('#photos-results-count');
    const categoryLabels = {
        all: 'الكل', nature: 'طبيعة', travel: 'سفر', architecture: 'عمارة',
        science: 'علوم', study: 'تعليم', art: 'فن', animals: 'حيوانات',
        people: 'أشخاص', personalities: 'شخصيات مشهورة', characters: 'شخصيات كرتونية', food: 'طعام', technology: 'تكنولوجيا',
        sports: 'رياضة', fashion: 'موضة', history: 'تاريخ', space: 'فضاء',
        plants: 'نباتات', music: 'موسيقى', cars: 'سيارات', cities: 'مدن',
        monuments: 'معالم', religion: 'ثقافة ودين', design: 'تصميم', ocean: 'بحار',
        birds: 'طيور', insects: 'حشرات', medical: 'طب', engineering: 'هندسة'
    };
    const pixabayCategories = {
        nature: 'nature', travel: 'travel', architecture: 'buildings', science: 'science',
        study: 'education', art: 'backgrounds', animals: 'animals', people: 'people',
        food: 'food', technology: 'computer', sports: 'sports', fashion: 'fashion',
        music: 'music', religion: 'religion', design: 'backgrounds'
    };
    const categoryTerms = {
        all: '',
        nature: 'nature landscape', travel: 'travel places landmarks', architecture: 'architecture buildings',
        science: 'science research laboratory', study: 'education books school', art: 'art painting illustration',
        animals: 'animals wildlife', people: 'people portrait', personalities: 'famous people portrait', characters: 'cartoon characters illustration',
        food: 'food cuisine', technology: 'technology computers', sports: 'sports athletes',
        fashion: 'fashion clothing', history: 'historical photography history', space: 'space astronomy galaxy',
        plants: 'plants flowers botanical', music: 'musicians instruments music', cars: 'cars automobiles vehicles',
        cities: 'cities skyline urban', monuments: 'monuments landmarks', religion: 'religious culture architecture',
        design: 'graphic design patterns', ocean: 'ocean sea underwater', birds: 'birds wildlife',
        insects: 'insects butterflies', medical: 'medicine medical science', engineering: 'engineering machines'
    };
    const arabicTerms = {
        'طبيعه':'nature','طبيعة':'nature','بحر':'ocean','بحار':'ocean','محيط':'ocean','شاطئ':'beach',
        'شواطئ':'beach','جبال':'mountains','جبل':'mountain','غابه':'forest','غابة':'forest',
        'اشجار':'trees','أشجار':'trees','قطط':'cats','قطة':'cat','كلاب':'dogs','كلب':'dog',
        'حيوانات':'animals','زهور':'flowers','ورود':'flowers','ورد':'flowers','نباتات':'plants',
        'سماء':'sky','غروب':'sunset','شروق':'sunrise','فضاء':'space','نجوم':'stars','قمر':'moon',
        'مدينة':'city','مدن':'cities','عمارة':'architecture','مباني':'buildings','مبنى':'building',
        'كمبيوتر':'computer','حاسوب':'computer','تقنية':'technology','تكنولوجيا':'technology',
        'علوم':'science','دراسة':'education','تعليم':'education','كتب':'books','كتاب':'book',
        'فن':'art','سيارات':'cars','سيارة':'car','طعام':'food','اكل':'food','أكل':'food',
        'قهوة':'coffee','رياضة':'sports','كرة':'football','مصر':'egypt','اهرامات':'pyramids',
        'أهرامات':'pyramids','شخصيات':'famous people','شخص':'person','اشخاص':'people','أشخاص':'people',
        'علماء':'scientists','عالم':'scientist','ممثلين':'actors','ممثل':'actor','فنانين':'artists',
        'فنان':'artist','تاريخ':'history','لوحات':'paintings','لوحة':'painting','طيور':'birds',
        'فراشات':'butterflies','حشرات':'insects','طب':'medicine','هندسة':'engineering',
        'موسيقى':'music','موضة':'fashion',
        'ميسي':'messi','رونالدو':'ronaldo','صلاح':'salah','محمد':'mohamed','نيمار':'neymar','مبابي':'mbappe',
        'زيدان':'zidane','مارادونا':'maradona','بيليه':'pele','اينشتاين':'einstein','نيوتن':'newton',
        'تسلا':'tesla','ماسك':'musk','ايلون':'elon','برشلونه':'barcelona','مدريد':'madrid','ليفربول':'liverpool',
        'قطه':'cat','اسد':'lion','فيل':'elephant','حصان':'horse','طائره':'airplane','قلعه':'castle','مسجد':'mosque','ملابس':'fashion','معالم':'landmarks','آثار':'archaeology'
    };
    let currentItems = [];
    let savedItems = readSaved();
    let activeCategory = 'all';
    let activeView = 'all';
    let activePhotoId = null;
    let currentDownloadPhoto = null;
    let selectedVariant = null;
    let lastFocusedElement = null;
    let pixabayPage = 0;
    let pixabayTotal = 0;
    let pixabayMore = true;
    let commonsContinue = null;
    let commonsTotal = 0;
    let commonsMore = true;
    let hasMore = false;
    let requestNumber = 0;
    let abortController = null;
    let searchTimer = null;
    let loadingMore = false;
    const refreshingSaved = new Set();
    function toast(message, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        const old = document.getElementById('photos-local-toast');
        if (old) old.remove();
        const el = document.createElement('div');
        el.id = 'photos-local-toast';
        el.textContent = message;
        el.style.cssText = 'position:fixed;z-index:20000;bottom:24px;left:24px;padding:12px 17px;border-radius:12px;background:#172554;color:#fff;font:700 13px Cairo,Tahoma,sans-serif;box-shadow:0 8px 28px #0003;';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2800);
    }
    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }
    function normalize(value) {
        return String(value || '').toLocaleLowerCase('ar')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
    }
    function toSearchQuery(raw) {
        const value = String(raw || '').trim().slice(0, 100);
        if (!value) return '';
        return value.split(/\s+/).map(word => {
            const normalized = normalize(word);
            return arabicTerms[normalized] || arabicTerms[normalized.replace(/^ال/, '')] || word;
        }).join(' ').slice(0, 100);
    }
    /* ---------- relevance: the search must return what was typed, not loosely related photos ---------- */
    const STOP_TOKENS = new Set(['the','and','of','in','on','a','an','for','with','famous','people','person','photo','photos','picture','pictures','image','images']);
    function searchTokens() {
        return normalize(toSearchQuery(searchInput.value))
            .split(/\s+/)
            .map(t => t.replace(/^["'`]+|["'`]+$/g, ''))
            .filter(t => t.length >= 2 && !STOP_TOKENS.has(t))
            .map(t => (t.length > 3 && t.endsWith('s') && /^[a-z]+$/.test(t)) ? t.slice(0, -1) : t);
    }
    function hasArabicQuery() { return /[\u0600-\u06FF]/.test(toSearchQuery(searchInput.value)); }
    function hasAllTokens(text, tokens) { return tokens.every(t => text.includes(t)); }
    function filterAndRank(items, tokens) {
        if (!tokens.length) return items;
        const phrase = tokens.join(' ');
        const scored = items.map(item => {
            const titleN = normalize(`${item.title || ''} ${item.fileTitle || ''}`.replace(/[_\-.]+/g, ' '));
            const tagsN = (item.tags || []).map(normalize);
            const descN = normalize(item.description || '');
            let rel = 0;
            if (item.source === 'pixabay') {
                if (hasAllTokens(tagsN.slice(0, 5).join(' '), tokens)) rel = 2;
                else if (hasAllTokens(tagsN.join(' '), tokens)) rel = 1;
            } else {
                if (hasAllTokens(titleN, tokens)) rel = 2;
                else if (hasAllTokens(`${titleN} ${descN}`, tokens)) rel = 1;
            }
            let score = rel * 10;
            if (titleN.includes(phrase)) score += 6;
            score += tokens.filter(t => titleN.includes(t)).length * 2;
            if (item.source === 'commons' && rel === 2) score += 1;
            return { item, rel, score };
        });
        const strictPixabay = scored.filter(x => x.item.source === 'pixabay' && x.rel === 2).length;
        return scored
            .filter(x => x.rel >= 2 || (x.rel === 1 && (x.item.source === 'commons' || strictPixabay < 8)))
            .sort((a, b) => b.score - a.score)
            .map(x => x.item);
    }
    function plainHTML(value) {
        if (!value) return '';
        const template = document.createElement('template');
        template.innerHTML = String(value);
        return (template.content.textContent || '').replace(/\s+/g, ' ').trim();
    }
    function shortText(value, max = 420) {
        const text = String(value || '').trim();
        return text.length > max ? text.slice(0, max - 1).trim() + '…' : text;
    }
    function safeHttpUrl(value) {
        try {
            const url = new URL(String(value || ''));
            return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
        } catch (_) { return ''; }
    }
    function readSaved() {
        try {
            const value = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
            return Array.isArray(value) ? value.filter(item => item && item.id && item.thumb).slice(0, 350) : [];
        } catch (_) { return []; }
    }
    function writeSaved() {
        try { localStorage.setItem(SAVED_KEY, JSON.stringify(savedItems)); }
        catch (_) { toast('مساحة التخزين المحلية ممتلئة؛ تعذر حفظ المزيد', 'error'); }
        updateSavedCount();
    }
    function updateSavedCount() {
        const count = $('#photos-saved-count');
        if (count) count.textContent = savedItems.length.toLocaleString('en-US');
    }
    function readCache() {
        try {
            const value = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
            return value && typeof value === 'object' ? value : {};
        } catch (_) { return {}; }
    }
    function getCached(key, ttl) {
        const entry = readCache()[key];
        if (!entry || !entry.savedAt || Date.now() - entry.savedAt >= ttl) return null;
        return entry.data ?? null;
    }
    function putCached(key, data) {
        const cache = readCache();
        cache[key] = { savedAt: Date.now(), data };
        Object.keys(cache).forEach(k => {
            if (!cache[k]?.savedAt || Date.now() - cache[k].savedAt >= Math.max(PIXABAY_CACHE_TTL, COMMONS_CACHE_TTL)) delete cache[k];
        });
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
        catch (_) {
            const entries = Object.entries(cache).sort((a, b) => b[1].savedAt - a[1].savedAt).slice(0, 8);
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries))); } catch (_) {}
        }
    }
    function setStatus(message = '', kind = 'info') {
        if (!statusBox) return;
        statusBox.classList.toggle('hidden', !message);
        statusBox.classList.toggle('is-error', kind === 'error');
        statusBox.classList.toggle('is-loading', kind === 'loading');
        statusBox.innerHTML = message;
    }
    function categoryLabel(category) { return categoryLabels[category] || 'صور متنوعة'; }
    function categoryQuery() { return categoryTerms[activeCategory] || ''; }

    function mapPixabay(hit) {
        const tags = String(hit.tags || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 14);
        const width = Number(hit.imageWidth || hit.webformatWidth || 4);
        const height = Number(hit.imageHeight || hit.webformatHeight || 3);
        const queryTokens = searchTokens();
        const matchedTag = queryTokens.length ? tags.find(tag => queryTokens.some(t => normalize(tag).includes(t))) : '';
        const mainTag = matchedTag || tags[0];
        const title = mainTag ? mainTag.replace(/\b\w/g, ch => ch.toUpperCase()) : 'صورة ملهمة';
        const variants = [
            { label: 'معاينة صغيرة', url: hit.previewURL, width: hit.previewWidth, height: hit.previewHeight },
            { label: 'جودة متوسطة · 640px', url: hit.webformatURL, width: hit.webformatWidth, height: hit.webformatHeight },
            { label: 'جودة عالية · حتى 1280px', url: hit.largeImageURL, rank: 1280 },
            { label: 'Full HD · حتى 1920px', url: hit.fullHDURL, rank: 1920 },
            { label: 'المقاس الأصلي', url: hit.imageURL, width, height, original: true }
        ].filter(v => safeHttpUrl(v.url));
        const uniqueVariants = variants.filter((v, i, arr) => arr.findIndex(x => x.url === v.url) === i);
        return {
            id: `pix-${hit.id}`, source: 'pixabay', sourceLabel: 'Pixabay',
            title, category: activeCategory, categoryLabel: categoryLabel(activeCategory),
            description: tags.join(' • '), tags, ratio: `${Math.max(1,width)} / ${Math.max(1,height)}`,
            width, height,
            thumb: safeHttpUrl(hit.webformatURL || hit.previewURL),
            image: safeHttpUrl(hit.largeImageURL || hit.webformatURL || hit.previewURL),
            originalUrl: safeHttpUrl(hit.imageURL),
            pageURL: safeHttpUrl(hit.pageURL) || 'https://pixabay.com/',
            user: String(hit.user || ''),
            variants: uniqueVariants,
            likes: Number(hit.likes || 0),
            downloads: Number(hit.downloads || 0),
            licenseName: 'Pixabay Content License',
            licenseUrl: 'https://pixabay.com/service/license-summary/',
            author: String(hit.user || 'Pixabay contributor')
        };
    }

    function commonsMetadata(info, key) {
        const item = info?.extmetadata?.[key];
        return item ? plainHTML(item.value || '') : '';
    }
    function mapCommons(page) {
        const info = page?.imageinfo?.[0];
        if (!info || !String(info.mime || '').startsWith('image/')) return null;
        const thumb = safeHttpUrl(info.thumburl || info.url);
        const original = safeHttpUrl(info.url);
        if (!thumb || !original) return null;
        const fileTitle = String(page.title || '').replace(/^File:/i, '');
        const objectName = commonsMetadata(info, 'ObjectName');
        const description = commonsMetadata(info, 'ImageDescription');
        const artist = commonsMetadata(info, 'Artist') || commonsMetadata(info, 'Credit') || '';
        const licenseName = commonsMetadata(info, 'LicenseShortName') || 'راجع صفحة الترخيص';
        const licenseUrl = safeHttpUrl(info.extmetadata?.LicenseUrl?.value);
        const title = shortText(objectName || fileTitle.replace(/\.[^.]+$/, '').replace(/_/g, ' '), 110) || 'صورة من المكتبة';
        const width = Number(info.width || info.thumbwidth || 4);
        const height = Number(info.height || info.thumbheight || 3);
        return {
            id: `com-${page.pageid}`, source: 'commons', sourceLabel: 'Wikimedia Commons',
            fileTitle: page.title,
            title, category: activeCategory, categoryLabel: categoryLabel(activeCategory),
            description: shortText(description, 500), tags: [categoryLabel(activeCategory), 'صور', 'إلهام'],
            ratio: `${Math.max(1,width)} / ${Math.max(1,height)}`, width, height,
            thumb, image: thumb, originalUrl: original,
            pageURL: safeHttpUrl(info.descriptionurl) || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title || '')}`,
            user: artist, author: artist || 'المؤلف غير محدد في بيانات الملف',
            variants: [{ label: 'المقاس الأصلي', url: original, width, height, original: true }],
            licenseName, licenseUrl, sha1: info.sha1 || '', mime: info.mime || '', date: commonsMetadata(info, 'DateTimeOriginal'),
            credit: commonsMetadata(info, 'Credit')
        };
    }

    function buildPixabayParams(page) {
        const params = new URLSearchParams({
            image_type: 'all', safesearch: 'true', order: 'popular',
            per_page: String(PIXABAY_PER_PAGE), page: String(page), lang: 'en'
        });
        const query = toSearchQuery(searchInput.value);
        const topic = categoryQuery();
        const combined = (query || topic || '').trim();
        if (combined) params.set('q', combined);
        const supportedCategory = pixabayCategories[activeCategory];
        if (supportedCategory) params.set('category', supportedCategory);
        return params;
    }

    function buildCommonsParams() {
        const params = new URLSearchParams({
            action: 'query', format: 'json', formatversion: '2',
            generator: 'search', gsrnamespace: '6', gsrlimit: String(COMMONS_PER_PAGE),
            gsrwhat: 'text', gsrprop: 'size|timestamp|snippet',
            prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata|sha1',
            iiurlwidth: '640', iiextmetadatalanguage: 'en',
            iiextmetadatafilter: 'ObjectName|ImageDescription|Artist|Credit|LicenseShortName|LicenseUrl|DateTimeOriginal',
            origin: '*'
        });
        const query = toSearchQuery(searchInput.value);
        const topic = categoryQuery();
        const terms = (query || topic || '').trim();
        params.set('gsrsearch', (`filetype:bitmap ${terms}`).trim());
        if (commonsContinue) {
            Object.entries(commonsContinue).forEach(([key, value]) => params.set(key, String(value)));
        }
        return params;
    }

    async function fetchPixabay(page, signal) {
        if (!PIXABAY_KEY) throw new Error('مفتاح خدمة الصور غير موجود في ملف الإعدادات.');
        const params = buildPixabayParams(page);
        const key = `pix:${params.toString()}`;
        const cached = getCached(key, PIXABAY_CACHE_TTL);
        if (cached) return { data: cached, cached: true };
        params.set('key', PIXABAY_KEY);
        const response = await fetch(`${PIXABAY_API}?${params.toString()}`, {
            method: 'GET', mode: 'cors', signal, headers: { Accept: 'application/json' }
        });
        if (response.status === 400 && page > 1) return { data: { hits: [], totalHits: 0 }, cached: false };
        if (response.status === 429) throw new Error('طلبات البحث وصلت للحد المؤقت؛ جرّب بعد قليل.');
        if (!response.ok) throw new Error(`تعذر جلب الصور (${response.status}).`);
        const data = await response.json();
        if (!Array.isArray(data.hits)) throw new Error('استجابة خدمة الصور غير متوقعة.');
        putCached(key, data);
        return { data, cached: false };
    }

    async function fetchCommons(signal) {
        const params = buildCommonsParams();
        const key = `com:${params.toString()}`;
        const cached = getCached(key, COMMONS_CACHE_TTL);
        if (cached) return { data: cached, cached: true };
        const response = await fetch(`${COMMONS_API}?${params.toString()}`, {
            method: 'GET', mode: 'cors', signal, headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`تعذر جلب المزيد من الصور (${response.status}).`);
        const data = await response.json();
        if (data?.error) throw new Error(data.error.info || 'تعذر البحث في الصور.');
        putCached(key, data);
        return { data, cached: false };
    }

    function mixSources(pixabayItems, commonsItems) {
        const mixed = [];
        const max = Math.max(pixabayItems.length, commonsItems.length);
        for (let i = 0; i < max; i++) {
            if (pixabayItems[i]) mixed.push(pixabayItems[i]);
            if (commonsItems[i]) mixed.push(commonsItems[i]);
        }
        const seen = new Set();
        return mixed.filter(item => {
            const key = item.id || item.thumb;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    const seenKeys = new Set();
    function duplicateKeys(item) {
        const keys = [item.id];
        const thumbBase = String(item.thumb || '').replace(/[?#].*$/, '').replace(/_\d+(\.[a-z0-9]+)$/i, '$1');
        if (thumbBase) keys.push('t:' + thumbBase);
        if (item.sha1) keys.push('h:' + item.sha1);
        if (item.source === 'pixabay') {
            keys.push(`s:${item.user}|${item.width}x${item.height}|${(item.tags || []).slice(0, 3).join(',')}`);
        } else {
            const stem = String(item.fileTitle || item.title || '').toLowerCase()
                .replace(/^file:/, '').replace(/\.[a-z0-9]+$/, '')
                .replace(/\(.*?\)|cropped|crop|edited|edit|\b\d+px\b/g, '').replace(/[\s_\-.,]+/g, '');
            if (stem.length > 8) keys.push('n:' + stem);
        }
        return keys;
    }
    function getPhoto(id) {
        return currentItems.find(photo => photo.id === String(id)) ||
            savedItems.find(photo => photo.id === String(id)) || null;
    }
    async function refreshSavedPhoto(id) {
        const photo = savedItems.find(item => item.id === String(id));
        if (!photo || photo.source !== 'pixabay' || refreshingSaved.has(photo.id) || !PIXABAY_KEY) return;
        refreshingSaved.add(photo.id);
        try {
            const numericId = String(photo.id).replace(/^pix-/, '');
            const params = new URLSearchParams({
                key: PIXABAY_KEY, id: numericId, image_type: 'all', safesearch: 'true', lang: 'en'
            });
            const cacheKey = `pix:id:${numericId}`;
            let data = getCached(cacheKey, PIXABAY_CACHE_TTL);
            if (!data) {
                const response = await fetch(`${PIXABAY_API}?${params.toString()}`, {
                    mode: 'cors', headers: { Accept: 'application/json' }
                });
                if (!response.ok) return;
                data = await response.json();
                if (!Array.isArray(data.hits)) return;
                putCached(cacheKey, data);
            }
            const hit = (data.hits || []).find(item => String(item.id) === numericId);
            if (!hit) return;
            const fresh = mapPixabay(hit);
            fresh.category = photo.category || 'all';
            fresh.categoryLabel = categoryLabel(fresh.category);
            const index = savedItems.findIndex(item => item.id === photo.id);
            if (index >= 0) {
                savedItems[index] = { ...fresh, category: photo.category || 'all' };
                writeSaved();
                if (activeView === 'saved') render();
            }
        } catch (error) {
            console.warn('Could not refresh saved photo URL:', error);
        } finally {
            refreshingSaved.delete(photo.id);
        }
    }
    function updateResultsInfo() {
        const total = $('#photos-total-count');
        const totalPossible = searchInput.value.trim() ? 0 : Math.max(0, pixabayTotal) + Math.max(0, commonsTotal);
        if (total) total.textContent = totalPossible ? totalPossible.toLocaleString('en-US') : currentItems.length.toLocaleString('en-US');
        if (resultCount) resultCount.textContent = `${currentItems.length.toLocaleString('en-US')} صورة`;
        $('#photos-results-title').textContent = activeView === 'saved'
            ? 'صورك المحفوظة' : (searchInput.value.trim() ? 'نتائج البحث' : 'اكتشف الصور');
        $('#photos-results-subtitle').textContent = activeView === 'saved'
            ? 'المفضلة محفوظة على هذا الجهاز' : 'مجموعة كبيرة ومتجددة من الصور';
        if (loadMoreButton) loadMoreButton.classList.toggle('hidden', activeView === 'saved' || !hasMore);
    }

    function render() {
        const items = activeView === 'saved'
            ? savedItems.filter(photo => activeCategory === 'all' || photo.category === activeCategory)
            : currentItems;
        grid.innerHTML = items.map(photo => {
            const isSaved = savedItems.some(item => item.id === photo.id);
            return `<article class="photos-card" data-photo-card="${escapeHTML(photo.id)}">
                <div class="photos-card-visual">
                    <button type="button" class="photos-card-image-button" data-photo-open="${escapeHTML(photo.id)}" aria-label="عرض الصورة: ${escapeHTML(photo.title)}">
                        <img class="photos-card-image" src="${escapeHTML(photo.thumb || photo.image)}" alt="${escapeHTML(photo.title)}" loading="lazy" decoding="async" style="aspect-ratio:${escapeHTML(photo.ratio || '4 / 3')}" referrerpolicy="no-referrer">
                        <span class="photos-image-fallback"></span>
                    </button>
                    <div class="photos-card-overlay">
                        <button type="button" class="photos-card-action ${isSaved ? 'is-saved' : ''}" data-photo-save="${escapeHTML(photo.id)}" aria-label="${isSaved ? 'إزالة من المحفوظات' : 'حفظ الصورة'}"><i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i></button>
                        <button type="button" class="photos-card-action" data-photo-download="${escapeHTML(photo.id)}" aria-label="خيارات تحميل الصورة" title="تحميل"><i class="fa-solid fa-download"></i></button>
                    </div>
                </div>
                <div class="photos-card-bottom">
                    <div class="photos-card-copy">
                        <h3 class="photos-card-title">${escapeHTML(photo.title)}</h3>
                        <span class="photos-card-category">${escapeHTML([photo.category && photo.category !== 'all' ? photo.categoryLabel : '', photo.user ? shortText(photo.user, 40) : ''].filter(Boolean).join(' · '))}</span>
                    </div>
                    <button type="button" class="photos-card-download" data-photo-download="${escapeHTML(photo.id)}" aria-label="خيارات تحميل ${escapeHTML(photo.title)}" title="تحميل"><i class="fa-solid fa-download"></i></button>
                </div>
            </article>`;
        }).join('');

        $$('.photos-card-image', grid).forEach(img => img.addEventListener('error', () => {
            img.closest('.photos-card-visual')?.classList.add('is-failed');
            const photoId = img.closest('[data-photo-card]')?.dataset.photoCard;
            if (activeView === 'saved' && photoId) refreshSavedPhoto(photoId);
        }, { once: true }));

        const isLoading = statusBox && !statusBox.classList.contains('hidden') && statusBox.classList.contains('is-loading');
        emptyState.classList.toggle('hidden', items.length > 0 || isLoading);
        grid.classList.toggle('hidden', items.length === 0);
        if (items.length === 0 && activeView === 'saved') {
            $('#photos-empty h3').textContent = 'لسه مفيش صور محفوظة';
            $('#photos-empty p').textContent = 'اضغط علامة الحفظ على أي صورة عشان تلاقيها هنا.';
        } else {
            $('#photos-empty h3').textContent = 'مش لاقيين صور مطابقة';
            $('#photos-empty p').textContent = 'جرّب كلمة بحث تانية أو اختار تصنيف مختلف.';
        }
        updateResultsInfo();
        updateSavedCount();
    }

    function updateHasMore() {
        hasMore = (pixabayMore && pixabayPage < PIXABAY_MAX_PAGES) || commonsMore;
        if (loadMoreButton) loadMoreButton.classList.toggle('hidden', activeView === 'saved' || !hasMore);
    }
    function setLoadingMore(loading) {
        loadingMore = loading;
        if (!loadMoreButton) return;
        loadMoreButton.disabled = loading;
        loadMoreButton.innerHTML = loading
            ? 'جاري تحميل المزيد...'
            : 'تحميل المزيد';
    }

    async function loadResults({ append = false, depth = 0 } = {}) {
        if (activeView === 'saved') { render(); return; }
        if (loadingMore && append) return;
        const myRequest = ++requestNumber;
        if (abortController) abortController.abort();
        abortController = new AbortController();
        const signal = abortController.signal;

        if (!append) {
            setLoadingMore(false);
            currentItems = [];
            pixabayPage = 0; pixabayTotal = 0; pixabayMore = true;
            commonsContinue = null; commonsTotal = 0; commonsMore = true;
            hasMore = false;
            setStatus('جاري تحميل الصور...', 'loading');
            render();
        } else {
            setLoadingMore(true);
            setStatus('جاري تحميل المزيد...', 'loading');
        }

        const nextPixabayPage = pixabayPage < PIXABAY_MAX_PAGES && pixabayMore && !hasArabicQuery() ? pixabayPage + 1 : null;
        const shouldFetchCommons = commonsMore;
        const jobs = [];
        if (nextPixabayPage) jobs.push(fetchPixabay(nextPixabayPage, signal)
            .then(result => ({ provider: 'pixabay', ...result }))
            .catch(error => { error.provider = 'pixabay'; throw error; }));
        if (shouldFetchCommons) jobs.push(fetchCommons(signal)
            .then(result => ({ provider: 'commons', ...result }))
            .catch(error => { error.provider = 'commons'; throw error; }));

        const settled = await Promise.allSettled(jobs);
        if (myRequest !== requestNumber) return;

        let newPixabay = [];
        let newCommons = [];
        let errors = [];
        let cachedAny = false;

        for (const outcome of settled) {
            if (outcome.status === 'rejected') {
                const failedProvider = outcome.reason?.provider;
                if (failedProvider === 'pixabay') pixabayMore = false;
                if (failedProvider === 'commons') commonsMore = false;
                if (outcome.reason?.name !== 'AbortError') errors.push(outcome.reason?.message || 'تعذر تحميل جزء من الصور');
                continue;
            }
            const result = outcome.value;
            cachedAny = cachedAny || result.cached;
            if (result.provider === 'pixabay') {
                const data = result.data;
                newPixabay = (data.hits || []).map(mapPixabay).filter(item => item.thumb && item.image);
                pixabayPage = nextPixabayPage;
                pixabayTotal = Number(data.totalHits || data.total || 0);
                pixabayMore = newPixabay.length > 0 && pixabayPage < PIXABAY_MAX_PAGES && pixabayPage * PIXABAY_PER_PAGE < pixabayTotal;
            } else {
                const data = result.data;
                const pages = Array.isArray(data.query?.pages) ? data.query.pages : [];
                newCommons = pages.map(mapCommons).filter(Boolean);
                commonsTotal = Number(data.query?.searchinfo?.totalhits || commonsTotal || 0);
                commonsContinue = data.continue || null;
                commonsMore = !!commonsContinue && newCommons.length > 0;
            }
        }

        const tokens = searchTokens();
        const mixed = filterAndRank(mixSources(newPixabay, newCommons), tokens);
        if (!append) seenKeys.clear();
        const uniqueNew = [];
        for (const item of mixed) {
            const keys = duplicateKeys(item);
            if (keys.some(key => seenKeys.has(key))) continue;
            keys.forEach(key => seenKeys.add(key));
            uniqueNew.push(item);
        }
        currentItems = append ? currentItems.concat(uniqueNew) : uniqueNew;
        updateHasMore();

        if (errors.length && currentItems.length) {
            setStatus('بعض النتائج لم تكتمل، لكن تقدر تكمل تصفح الصور المتاحة.', 'info');
        } else if (errors.length && !currentItems.length) {
            setStatus(escapeHTML(errors[0]), 'error');
        } else {
            setStatus('');
        }
        if (!currentItems.length && !errors.length && !hasMore) {
            setStatus('مفيش صور مطابقة للكلمات دي. جرّب بحث مختلف.');
        }
        render();
        setLoadingMore(false);
        // A strict search can leave a batch nearly empty; keep pulling the next pages so the screen fills with real matches.
        if (tokens.length && uniqueNew.length < 6 && hasMore && depth < 4 && !errors.length && activeView === 'all') {
            return loadResults({ append: true, depth: depth + 1 });
        }
    }

    function scheduleSearch() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => loadResults(), 550);
    }

    function toggleSaved(id) {
        const photo = getPhoto(id);
        if (!photo) return;
        const index = savedItems.findIndex(item => item.id === photo.id);
        if (index >= 0) {
            savedItems.splice(index, 1);
            toast('اتشالت الصورة من المحفوظات');
        } else {
            // Save a compact record so a large Favorites list does not exhaust localStorage.
            const compact = {
                id: photo.id, source: photo.source, title: photo.title, category: photo.category,
                categoryLabel: photo.categoryLabel, thumb: photo.thumb, image: photo.image,
                originalUrl: photo.originalUrl, pageURL: photo.pageURL, ratio: photo.ratio,
                width: photo.width, height: photo.height, author: photo.author, user: photo.user,
                licenseName: photo.licenseName, licenseUrl: photo.licenseUrl, fileTitle: photo.fileTitle,
                description: shortText(photo.description, 220), tags: (photo.tags || []).slice(0, 8),
                variants: (photo.variants || []).slice(0, 5)
            };
            savedItems.unshift(compact);
            savedItems = savedItems.slice(0, 350);
            toast('اتحفظت الصورة على جهازك');
        }
        writeSaved();
        render();
        if (activePhotoId === photo.id && lightbox && !lightbox.classList.contains('hidden')) updateLightboxSaveButton();
    }

    function openPhoto(id, focusElement) {
        const photo = getPhoto(id);
        if (!photo) return;
        activePhotoId = photo.id;
        lastFocusedElement = focusElement || document.activeElement;
        $('#photos-lightbox-image').src = photo.image || photo.thumb;
        $('#photos-lightbox-image').alt = photo.title;
        $('#photos-lightbox-category').textContent = photo.categoryLabel;
        $('#photos-lightbox-title').textContent = photo.title;
        $('#photos-lightbox-description').textContent = photo.description || photo.tags?.join(' • ') || '';
        $('#photos-lightbox-tags').innerHTML = (photo.tags || []).slice(0, 8).map(tag => `<span>#${escapeHTML(tag)}</span>`).join('');
        updateLightboxSaveButton();
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        $('#photos-lightbox-close').focus();
    }
    function updateLightboxSaveButton() {
        const button = $('#photos-save-current');
        const saved = savedItems.some(item => item.id === activePhotoId);
        button.textContent = saved ? 'إزالة الحفظ' : 'حفظ';
    }
    function closePhoto() {
        if (!lightbox || lightbox.classList.contains('hidden')) return;
        lightbox.classList.add('hidden');
        $('#photos-lightbox-image').src = '';
        document.body.style.overflow = '';
        activePhotoId = null;
        if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    }

    function chooseDownloadPage(photo) {
        if (!photo || !downloadPage) return;
        currentDownloadPhoto = photo;
        try { sessionStorage.setItem(DOWNLOAD_KEY, JSON.stringify(photo)); } catch (_) {}
        if (typeof window.navigate === 'function') window.navigate('photos-download');
        else {
            populateDownloadPage(photo);
            root.classList.add('hidden');
            downloadPage.classList.remove('hidden');
        }
    }

    function buildPixabayVariants(photo) {
        const variants = (photo.variants || []).map(variant => ({ ...variant, url: safeHttpUrl(variant.url) })).filter(v => v.url);
        if (photo.originalUrl && !variants.some(v => v.url === photo.originalUrl)) {
            variants.unshift({ label: 'المقاس الأصلي', url: photo.originalUrl, width: photo.width, height: photo.height, original: true });
        }
        return variants.filter((v, i, arr) => arr.findIndex(x => x.url === v.url) === i);
    }

    async function buildCommonsVariants(photo) {
        const widths = [320, 640, 1024, 1600];
        const variants = [];
        const original = safeHttpUrl(photo.originalUrl);
        if (original) variants.push({ label: `المقاس الأصلي · ${photo.width || '?'}×${photo.height || '?'}`, url: original, width: photo.width, height: photo.height, original: true });
        const title = photo.fileTitle;
        if (!title) return variants;
        const requests = widths.map(async width => {
            const params = new URLSearchParams({
                action: 'query', format: 'json', formatversion: '2',
                titles: title, prop: 'imageinfo', iiprop: 'url|size|mime',
                iiurlwidth: String(width), origin: '*'
            });
            const response = await fetch(`${COMMONS_API}?${params.toString()}`, { mode: 'cors', headers: { Accept: 'application/json' } });
            if (!response.ok) return null;
            const data = await response.json();
            const info = data.query?.pages?.[0]?.imageinfo?.[0];
            if (!info?.thumburl) return null;
            return {
                label: `مقاس ${Math.min(Number(info.thumbwidth || width), width)}px`,
                url: safeHttpUrl(info.thumburl),
                width: Number(info.thumbwidth || width),
                height: Number(info.thumbheight || 0)
            };
        });
        const results = await Promise.allSettled(requests);
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value?.url) variants.push(result.value);
        });
        return variants.filter((v, i, arr) => v.url && arr.findIndex(x => x.url === v.url) === i)
            .sort((a, b) => Number(a.width || 0) - Number(b.width || 0));
    }

    function displayBytes(bytes) {
        const n = Number(bytes || 0);
        if (!n) return 'غير متاح';
        if (n < 1024) return `${n} بايت`;
        if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
        return `${(n / 1024 / 1024).toFixed(2)} MB`;
    }
    function fileExtension(url, mime) {
        const m = String(url || '').match(/\.([a-z0-9]{2,5})(?:[?#]|$)/i);
        if (m) return m[1].toUpperCase();
        return String(mime || '').split('/')[1]?.toUpperCase() || 'IMG';
    }

    async function populateDownloadPage(photo) {
        if (!downloadPage) return;
        const byId = id => document.getElementById(id);
        byId('photos-download-title').textContent = photo.title || 'تحميل الصورة';
        byId('photos-download-category').textContent = photo.categoryLabel || 'صورة';
        byId('photos-download-image').src = photo.image || photo.thumb;
        byId('photos-download-image').alt = photo.title || '';
        byId('photos-download-description').textContent = photo.description || 'اختار الجودة والمقاس المناسب قبل التحميل.';
        byId('photos-download-dimensions').textContent = `${Number(photo.width || 0).toLocaleString('en-US')} × ${Number(photo.height || 0).toLocaleString('en-US')} px`;
        byId('photos-download-author').textContent = photo.author || photo.user || 'غير محدد';
        byId('photos-download-license').textContent = photo.licenseName || 'راجع صفحة الصورة';
        const licenseLink = byId('photos-download-license-link');
        if (photo.licenseUrl && safeHttpUrl(photo.licenseUrl)) {
            licenseLink.href = photo.licenseUrl;
            licenseLink.classList.remove('hidden');
        } else {
            licenseLink.classList.add('hidden');
        }
        const sourceLink = byId('photos-download-source-link');
        sourceLink.href = photo.pageURL || '#';
        sourceLink.classList.remove('hidden');
        byId('photos-download-sizes').innerHTML = '<div class="photos-download-loading">بنجهّز المقاسات المتاحة...</div>';
        byId('photos-download-button').disabled = true;
        selectedVariant = null;

        let variants = [];
        try {
            variants = photo.source === 'commons' ? await buildCommonsVariants(photo) : buildPixabayVariants(photo);
        } catch (error) {
            console.warn('Could not load alternate image sizes:', error);
            variants = photo.source === 'commons' ? [{ label: 'المقاس الأصلي', url: photo.originalUrl, original: true }] : buildPixabayVariants(photo);
        }
        if (!variants.length && photo.originalUrl) variants = [{ label: 'المقاس الأصلي', url: photo.originalUrl, original: true }];
        if (!variants.length && photo.pageURL) variants = [{ label: 'صفحة الصورة', url: photo.pageURL, page: true }];

        const sizesWrap = byId('photos-download-sizes');
        let defaultIndex = variants.findIndex(variant => variant.original);
        if (defaultIndex < 0) {
            defaultIndex = variants.reduce((best, variant, index, all) =>
                Number(variant.rank || variant.width || 0) >= Number(all[best]?.rank || all[best]?.width || 0) ? index : best, 0);
        }
        sizesWrap.innerHTML = variants.map((variant, index) => {
            const detail = variant.width && variant.height
                ? `${Number(variant.width).toLocaleString('en-US')} × ${Number(variant.height).toLocaleString('en-US')} px`
                : (variant.original ? 'أعلى جودة متاحة' : 'مقاس متاح');
            return `<label class="photos-size-option ${index === 0 ? 'active' : ''}">
                <input type="radio" name="photos-download-size" value="${index}" ${index === defaultIndex ? 'checked' : ''}>
                <span class="photos-size-option-copy"><strong>${escapeHTML(variant.label || 'مقاس الصورة')}</strong><small>${escapeHTML(detail)}</small></span>
                </label>`;
        }).join('');
        selectedVariant = variants[defaultIndex] || variants[0] || null;
        sizesWrap.querySelectorAll('input[name="photos-download-size"]').forEach(input => {
            input.addEventListener('change', () => {
                selectedVariant = variants[Number(input.value)] || variants[0];
                sizesWrap.querySelectorAll('.photos-size-option').forEach(label => label.classList.toggle('active', label.contains(input)));
                if (selectedVariant?.url) byId('photos-download-image').src = selectedVariant.url;
            });
        });
        byId('photos-download-button').disabled = !selectedVariant?.url;
        byId('photos-download-button').textContent = 'تحميل المقاس المحدد';
        const licenseBlock = byId('photos-download-rights');
        const isCommons = photo.source === 'commons';
        licenseBlock.classList.toggle('hidden', !isCommons);
        if (isCommons) {
            const author = photo.author || 'المؤلف غير محدد في بيانات الملف';
            const license = photo.licenseName || 'يرجى مراجعة صفحة الملف';
            byId('photos-download-attribution').textContent = `الصورة: ${author}. الترخيص: ${license}.`;
            byId('photos-download-rights-link').href = photo.pageURL || 'https://commons.wikimedia.org/';
            byId('photos-download-license-url').href = photo.licenseUrl || photo.pageURL || 'https://commons.wikimedia.org/wiki/Commons:Licensing';
        }
    }

    async function downloadSelectedVariant() {
        if (!selectedVariant?.url || !currentDownloadPhoto) return;
        const variant = selectedVariant;
        const photo = currentDownloadPhoto;
        if (variant.page) {
            window.open(variant.url, '_blank', 'noopener,noreferrer');
            return;
        }
        const button = document.getElementById('photos-download-button');
        button.disabled = true;
        button.textContent = 'جاري تجهيز التحميل...';
        try {
            const response = await fetch(variant.url, { mode: 'cors' });
            if (!response.ok) throw new Error('download failed');
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const ext = fileExtension(variant.url, currentDownloadPhoto.mime);
            link.href = objectUrl;
            link.download = `${(photo.title || 'ETO-Photo').replace(/[\\/:*?"<>|]/g, '-').slice(0, 70)}.${ext.toLowerCase()}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(objectUrl), 12000);
            toast('بدأ تحميل الصورة');
        } catch (error) {
            window.open(variant.url, '_blank', 'noopener,noreferrer');
            toast('فتحنا الصورة في تبويب جديد؛ استخدم حفظ الصورة من المتصفح.');
        } finally {
            button.disabled = false;
            button.textContent = 'تحميل المقاس المحدد';
        }
    }

    function setCategory(category) {
        activeCategory = category;
        categoryWrap.querySelectorAll('[data-photos-category]').forEach(button => {
            button.classList.toggle('active', button.dataset.photosCategory === category);
        });
        if (activeView === 'saved') render();
        else loadResults();
    }
    function setView(view) {
        activeView = view;
        root.querySelectorAll('[data-photos-view]').forEach(button => {
            const active = button.dataset.photosView === view;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        if (view === 'saved') {
            requestNumber++;
            if (abortController) abortController.abort();
            setLoadingMore(false);
            setStatus('');
            hasMore = false;
            render();
        } else {
            loadResults();
        }
    }
    function loadEtoPhotos() {
        if (root.dataset.loaded !== '1') {
            root.dataset.loaded = '1';
            loadResults();
        }
    }
    function loadEtoPhotoDownload() {
        if (currentDownloadPhoto) return populateDownloadPage(currentDownloadPhoto);
        try {
            const saved = JSON.parse(sessionStorage.getItem(DOWNLOAD_KEY) || 'null');
            if (saved?.id) {
                currentDownloadPhoto = saved;
                return populateDownloadPage(saved);
            }
        } catch (_) {}
        if (typeof window.navigate === 'function') window.navigate('photos');
    }

    // Search and toolbar
    searchInput.addEventListener('input', () => {
        if (activeView !== 'all') {
            activeView = 'all';
            root.querySelectorAll('[data-photos-view]').forEach(button => {
                button.classList.toggle('active', button.dataset.photosView === 'all');
                button.setAttribute('aria-selected', String(button.dataset.photosView === 'all'));
            });
        }
        scheduleSearch();
    });
    searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') { event.preventDefault(); clearTimeout(searchTimer); loadResults(); searchInput.blur(); }
    });
    root.querySelectorAll('[data-photos-suggest]').forEach(button => button.addEventListener('click', () => {
        searchInput.value = button.dataset.photosSuggest;
        activeCategory = 'all';
        categoryWrap.querySelectorAll('[data-photos-category]').forEach(b => b.classList.toggle('active', b.dataset.photosCategory === 'all'));
        activeView = 'all';
        root.querySelectorAll('[data-photos-view]').forEach(b => {
            const on = b.dataset.photosView === 'all';
            b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on));
        });
        clearTimeout(searchTimer);
        loadResults();
    }));
    $('#photos-search-clear').addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        if (activeView === 'saved') setView('all'); else loadResults();
    });
    categoryWrap.addEventListener('click', event => {
        const button = event.target.closest('[data-photos-category]');
        if (button) setCategory(button.dataset.photosCategory);
    });
    root.querySelectorAll('[data-photos-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.photosView)));
    grid.addEventListener('click', event => {
        const save = event.target.closest('[data-photo-save]');
        if (save) { event.preventDefault(); event.stopPropagation(); toggleSaved(save.dataset.photoSave); return; }
        const download = event.target.closest('[data-photo-download]');
        if (download) { event.preventDefault(); event.stopPropagation(); chooseDownloadPage(getPhoto(download.dataset.photoDownload)); return; }
        const open = event.target.closest('[data-photo-open]');
        if (open) { event.preventDefault(); openPhoto(open.dataset.photoOpen, open); }
    });
    $('#photos-reset').addEventListener('click', () => {
        searchInput.value = '';
        setCategory('all');
        if (activeView !== 'all') setView('all');
    });
    loadMoreButton?.addEventListener('click', () => {
        if (hasMore && !loadMoreButton.disabled) loadResults({ append: true });
    });

    // Preview modal actions
    $('#photos-lightbox-close').addEventListener('click', closePhoto);
    $('#photos-lightbox-backdrop').addEventListener('click', closePhoto);
    $('#photos-download-current').addEventListener('click', () => {
        const photo = getPhoto(activePhotoId);
        if (photo) chooseDownloadPage(photo);
        closePhoto();
    });
    $('#photos-save-current').addEventListener('click', () => activePhotoId && toggleSaved(activePhotoId));
    $('#photos-share-current').addEventListener('click', async () => {
        const photo = getPhoto(activePhotoId);
        if (!photo) return;
        try {
            if (navigator.share) await navigator.share({ title: `${photo.title} | ETO Photos`, text: photo.description || photo.title, url: photo.pageURL });
            else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(photo.pageURL); toast('تم نسخ رابط الصورة'); }
            else window.open(photo.pageURL, '_blank', 'noopener,noreferrer');
        } catch (error) { if (error?.name !== 'AbortError') toast('تعذرت مشاركة الصورة', 'error'); }
    });

    // Download settings page
    document.getElementById('photos-download-button')?.addEventListener('click', downloadSelectedVariant);
    document.getElementById('photos-download-original')?.addEventListener('click', () => {
        const url = currentDownloadPhoto?.originalUrl || currentDownloadPhoto?.pageURL;
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    });
    document.getElementById('photos-download-back')?.addEventListener('click', () => {
        if (typeof window.goBackPage === 'function') window.goBackPage();
        else if (typeof window.navigate === 'function') window.navigate('photos');
    });

    document.addEventListener('keydown', event => {
        if (lightbox && !lightbox.classList.contains('hidden') && event.key === 'Escape') closePhoto();
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !root.classList.contains('hidden')) {
            event.preventDefault(); searchInput.focus();
        }
    });

    updateSavedCount();
    render();

    if ('IntersectionObserver' in window && loadMoreButton) {
        const moreObserver = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting) && activeView === 'all' && hasMore && !loadingMore) {
                loadResults({ append: true });
            }
        }, { rootMargin: '700px 0px' });
        moreObserver.observe(loadMoreButton);
    }

    window.loadEtoPhotos = loadEtoPhotos;
    window.loadEtoPhotoDownload = loadEtoPhotoDownload;
    window.ETO_PHOTOS = {
        refresh: () => loadResults(),
        search: value => { searchInput.value = String(value || ''); activeView = 'all'; loadResults(); },
        getSaved: () => savedItems.map(item => ({ ...item })),
        openDownload: id => chooseDownloadPage(getPhoto(id))
    };
})();