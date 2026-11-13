(function () {
  'use strict';

  const root = document.getElementById('app');
  const appBase = new URL('.', document.currentScript.src);
  const labs = Array.isArray(window.BIO_LABS) ? window.BIO_LABS : [];
  const state = {
    lang: localStorage.getItem('bl-lang') || 'ar',
    theme: localStorage.getItem('bl-theme') || 'light',
    lab: 'all',
    query: ''
  };

  const labels = {
    ar: {
      title: 'معمل العملي',
      subtitle: 'كل العينات والرسومات والصور الأصلية في مكان واحد — افتح أي عينة في صفحة مستقلة وواضحة.',
      collection: 'مكتبة العينات',
      collectionHint: 'اختار اللاب أو ابحث باسم العينة أو المصطلح العلمي.',
      search: 'ابحث عن عينة أو مصطلح علمي...',
      all: 'كل اللابات',
      specimens: 'عينة',
      labs: 'لابات',
      open: 'افتح العينة',
      noResults: 'مفيش نتائج مطابقة',
      noResultsHint: 'جرّب كلمة بحث مختلفة أو اختار لاب تاني.',
      back: 'الرجوع للموقع',
      gallery: 'صور ورسومات المصدر',
      imageHint: 'اضغط على الصورة لفتحها بالحجم الكامل في تبويب مستقل.',
      summary: 'خلاصة العينة',
      study: 'دليل الفهم والتعرّف',
      facts: 'نقاط سريعة من المحاضرة',
      parts: 'الأجزاء والمصطلحات المسمّاة',
      source: 'المصدر',
      page: 'صفحة المصدر',
      previous: 'العينة السابقة',
      next: 'العينة التالية',
      light: 'الوضع الفاتح',
      dark: 'الوضع الداكن',
      category: 'نوع المحتوى',
      sourceNote: 'الرسومات والتسميات من المصدر كما هي',
      missing: 'الصورة غير متاحة'
    },
    en: {
      title: 'Practical Lab Collection',
      subtitle: 'All specimens, original diagrams and microscope images in one place. Open each specimen on its own full page.',
      collection: 'Specimen library',
      collectionHint: 'Choose a lab or search by specimen name or scientific term.',
      search: 'Search specimen or scientific term...',
      all: 'All labs',
      specimens: 'specimens',
      labs: 'labs',
      open: 'Open specimen',
      noResults: 'No matching results',
      noResultsHint: 'Try another search term or select a different lab.',
      back: 'Back to Site',
      gallery: 'Original source images',
      imageHint: 'Click an image to open it at full size in a separate tab.',
      summary: 'Specimen overview',
      study: 'Understanding & identification guide',
      facts: 'Quick lecture notes',
      parts: 'Labeled parts & terms',
      source: 'Source file',
      page: 'Source page',
      previous: 'Previous specimen',
      next: 'Next specimen',
      light: 'Light appearance',
      dark: 'Dark appearance',
      category: 'Content type',
      sourceNote: 'Original source drawings and labels preserved',
      missing: 'Image unavailable'
    }
  };

  const tr = (value) => {
    if (value && typeof value === 'object') return value[state.lang] || value.en || value.ar || '';
    return value == null ? '' : String(value);
  };
  const txt = (key) => labels[state.lang][key] || labels.en[key] || key;
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
  const getLab = (id) => labs.find(item => item.id === id);
  const getSpecimens = (lab) => lab && Array.isArray(lab.specimens) ? lab.specimens : [];
  const totalSpecimens = labs.reduce((sum, lab) => sum + getSpecimens(lab).length, 0);

  function setAppearance() {
    document.body.dataset.theme = state.theme;
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    const langButton = document.querySelector('[data-action="lang"]');
    const themeButton = document.querySelector('[data-action="theme"]');
    if (langButton) langButton.textContent = state.lang === 'ar' ? 'English' : 'عربي';
    if (themeButton) {
      const label = themeButton.querySelector('[data-theme-label]');
      if (label) label.textContent = state.theme === 'light' ? txt('light') : txt('dark');
      const icon = themeButton.querySelector('.theme-icon');
      if (icon) icon.textContent = state.theme === 'light' ? '☾' : '☀';
    }
  }

  function urlFor(labId, specimenId) {
    return new URL(`specimen-pages/${encodeURIComponent(labId)}/${encodeURIComponent(specimenId)}/index.html`, appBase).href;
  }

  function urlForLab(labId) {
    const url = new URL('index.html', appBase);
    if (labId && labId !== 'all') url.searchParams.set('lab', labId);
    return url.href;
  }

  function getRoute() {
    const params = new URLSearchParams(window.location.search);
    return {
      labId: document.body.dataset.labId || params.get('lab') || 'all',
      specimenId: document.body.dataset.specimenId || params.get('spec') || ''
    };
  }

  function flattenSpecimens() {
    return labs.flatMap(lab => getSpecimens(lab).map(specimen => ({ lab, specimen })));
  }

  function renderHome(selectedLabId) {
    state.lab = getLab(selectedLabId) ? selectedLabId : 'all';
    const labButtons = [
      `<button type="button" class="filter-chip ${state.lab === 'all' ? 'active' : ''}" data-lab="all">${esc(txt('all'))}</button>`,
      ...labs.map(lab => `<button type="button" class="filter-chip ${state.lab === lab.id ? 'active' : ''}" data-lab="${esc(lab.id)}">${esc(tr(lab.title))}</button>`)
    ].join('');

    root.innerHTML = `
      <section class="hero">
        <div class="hero-content">
          <span class="hero-kicker">✦ ${state.lang === 'ar' ? 'مكتبة العملي' : 'Practical reference'}</span>
          <h1>${esc(txt('title'))}</h1>
          <p>${esc(txt('subtitle'))}</p>
          <div class="hero-stats">
            <div class="stat"><strong>${totalSpecimens}</strong><span>${esc(txt('specimens'))}</span></div>
            <div class="stat"><strong>${labs.length}</strong><span>${esc(txt('labs'))}</span></div>
            <div class="stat"><strong>AR · EN</strong><span>${state.lang === 'ar' ? 'لغتان' : 'Two languages'}</span></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="collection-title">
        <div class="section-heading">
          <div><h2 id="collection-title">${esc(txt('collection'))}</h2><p>${esc(txt('collectionHint'))}</p></div>
        </div>
        <div class="toolbar">
          <label class="search-wrap">
            <span class="search-icon" aria-hidden="true">⌕</span>
            <input id="specimen-search" class="search-input" type="search" placeholder="${esc(txt('search'))}" value="${esc(state.query)}" autocomplete="off">
          </label>
        </div>
        <nav class="filter-row" aria-label="Lab filters">${labButtons}</nav>
        <p class="results-line" id="results-count"></p>
        <div class="specimen-grid" id="specimen-grid"></div>
      </section>`;

    const search = root.querySelector('#specimen-search');
    search.addEventListener('input', () => {
      state.query = search.value;
      renderCards();
    });
    root.querySelectorAll('[data-lab]').forEach(button => {
      button.addEventListener('click', () => {
        state.lab = button.dataset.lab;
        const nextUrl = urlForLab(state.lab);
        window.history.replaceState({}, '', nextUrl);
        root.querySelectorAll('[data-lab]').forEach(chip => chip.classList.toggle('active', chip.dataset.lab === state.lab));
        renderCards();
      });
    });
    renderCards();
  }

  function renderCards() {
    const grid = root.querySelector('#specimen-grid');
    const counter = root.querySelector('#results-count');
    if (!grid || !counter) return;
    const query = state.query.trim().toLocaleLowerCase();
    const items = flattenSpecimens().filter(({lab, specimen}) => {
      if (state.lab !== 'all' && lab.id !== state.lab) return false;
      const bilingualText = value => value && typeof value === 'object' ? Object.values(value).join(' ') : (value || '');
      const studyText = Object.values(specimen.studySections || {}).flat().map(section => [section.title, ...(section.items || [])].join(' ')).join(' ');
      const factText = Object.values(specimen.facts || {}).flat().join(' ');
      const partText = Object.values(specimen.parts || {}).flat().join(' ');
      const searchable = [
        bilingualText(specimen.name), specimen.scientific, bilingualText(specimen.summary),
        bilingualText(lab.title), specimen.id, specimen.kind, studyText, factText, partText
      ].join(' ').toLocaleLowerCase();
      return !query || searchable.includes(query);
    });
    counter.textContent = `${items.length} ${txt('specimens')}`;
    if (!items.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><strong>${esc(txt('noResults'))}</strong>${esc(txt('noResultsHint'))}</div>`;
      return;
    }
    grid.innerHTML = items.map(({lab, specimen}) => {
      const cover = specimen.cover || (specimen.images && specimen.images[0] && specimen.images[0].src) || '';
      return `
        <a class="specimen-card" href="${esc(urlFor(lab.id, specimen.id))}" target="_blank" rel="noopener">
          <div class="card-image">
            <span class="card-badge">${esc(specimen.kind || txt('specimens'))}</span>
            <img src="${esc(cover)}" alt="${esc(tr(specimen.name))}" loading="lazy" onerror="this.alt='${esc(txt('missing'))}';this.style.opacity='.15'">
          </div>
          <div class="card-body">
            <div class="card-lab">${esc(tr(lab.title))}</div>
            <h3>${esc(tr(specimen.name))}</h3>
            <p>${esc(tr(specimen.summary) || specimen.scientific || '')}</p>
            <div class="card-foot"><span>${esc(specimen.sourcePage || '')}</span><span class="card-open">${esc(txt('open'))} ←</span></div>
          </div>
        </a>`;
    }).join('');
  }

  function renderDetail(labId, specimenId) {
    const lab = getLab(labId);
    const specimens = getSpecimens(lab);
    const index = specimens.findIndex(item => item.id === specimenId);
    if (!lab || index < 0) {
      renderHome(lab ? lab.id : 'all');
      return;
    }
    const specimen = specimens[index];
    document.title = `${tr(specimen.name)} | Bio Labs`;
    const images = Array.isArray(specimen.images) ? specimen.images : [];
    const facts = (specimen.facts && specimen.facts[state.lang]) || (specimen.facts && specimen.facts.en) || [];
    const parts = (specimen.parts && (specimen.parts[state.lang] || specimen.parts.en)) || [];
    const sections = (specimen.studySections && (specimen.studySections[state.lang] || specimen.studySections.en)) || [];
    const gallery = images.map((image, imageIndex) => `
      <figure class="source-figure">
        <a href="${esc(image.src)}" target="_blank" rel="noopener" aria-label="${esc(tr(image.caption) || tr(specimen.name))}">
          <img src="${esc(image.src)}" alt="${esc(tr(image.caption) || tr(specimen.name))}" ${imageIndex === 0 ? 'fetchpriority="high"' : 'loading="lazy"' }>
        </a>
        <figcaption><span>${esc(tr(image.caption) || tr(specimen.name))}</span><small>${esc(image.page || specimen.sourcePage || '')}</small></figcaption>
      </figure>`).join('');

    const previous = specimens[(index - 1 + specimens.length) % specimens.length];
    const next = specimens[(index + 1) % specimens.length];
    const scientific = specimen.scientific ? `<div class="detail-scientific">${esc(specimen.scientific)}</div>` : '';
    const summary = tr(specimen.summary);
    const studyBlocks = sections.map((section, sectionIndex) => {
      const items = Array.isArray(section.items) ? section.items : [];
      return `
        <article class="study-card">
          <div class="study-card-top"><span class="study-number">${String(sectionIndex + 1).padStart(2, '0')}</span><h3>${esc(section.title || txt('study'))}</h3></div>
          ${items.length ? `<ul class="study-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
        </article>`;
    }).join('');
    const factList = facts.length ? `<ul class="facts-list">${facts.map(fact => `<li>${esc(fact)}</li>`).join('')}</ul>` : '';
    const partsBlock = parts.length ? `<section class="parts-card"><h2>${esc(txt('parts'))}</h2><div class="parts-tags">${parts.map(part => `<span class="part-tag">${esc(part)}</span>`).join('')}</div></section>` : '';

    root.innerHTML = `
      <div class="detail-top">
        <div class="detail-actions">
          <button class="back-link" type="button" data-action="site-back">← ${esc(txt('back'))}</button>
          <button class="nav-link share-link" type="button" data-action="share-specimen" data-url="${esc(urlFor(lab.id, specimen.id))}" data-title="${esc(tr(specimen.name))}" data-description="${esc(summary || '')}">${state.lang === 'ar' ? 'مشاركة العينة' : 'Share specimen'} ↗</button>
        </div>
        <header class="detail-heading">
          <span class="detail-kicker">${esc(tr(lab.title))} · ${esc(specimen.kind || '')}</span>
          <h1>${esc(tr(specimen.name))}</h1>
          ${scientific}
          <div class="detail-description"><span aria-hidden="true">✦</span><p>${esc(summary || '—')}</p></div>
        </header>
      </div>
      <div class="detail-layout">
        <section class="gallery-panel">
          <div class="gallery-heading"><h2>${esc(txt('gallery'))}</h2><span>${esc(txt('imageHint'))}</span></div>
          <div class="source-gallery ${images.length > 1 ? 'multi' : ''}">${gallery}</div>
        </section>
        <aside class="info-panel">
          <div class="info-panel-heading"><span class="info-symbol" aria-hidden="true">✧</span><div><h2>${esc(txt('facts'))}</h2><small>${esc(specimen.kind || '')}</small></div></div>
          ${factList || `<p class="summary-text">${esc(summary || '—')}</p>`}
          ${partsBlock}
          <div class="info-divider"></div>
          <div class="source-box"><strong>${esc(txt('source'))}</strong><span>${esc(lab.source || '')}</span><strong style="margin-top:9px">${esc(txt('page'))}</strong><span>${esc(specimen.sourcePage || '')}</span></div>
          <div class="detail-navigation">
            <a class="nav-link" href="${esc(urlFor(lab.id, previous.id))}">→ ${esc(txt('previous'))}</a>
            <a class="nav-link primary" href="${esc(urlFor(lab.id, next.id))}">${esc(txt('next'))} ←</a>
          </div>
        </aside>
      </div>
      ${studyBlocks ? `<section class="study-section" aria-labelledby="study-heading"><div class="study-heading"><span class="study-kicker">${state.lang === 'ar' ? 'افهم العينة' : 'STUDY GUIDE'}</span><h2 id="study-heading">${esc(txt('study'))}</h2><p>${state.lang === 'ar' ? 'شرح مركز يساعدك تربط الصورة بالمعلومة وتتعرف على العينة في العملي.' : 'A focused guide to connect the image with the key facts and identify the specimen in practical work.'}</p></div><div class="study-grid">${studyBlocks}</div></section>` : ''}`;
  }

  function render() {
    setAppearance();
    state.query = '';
    const route = getRoute();
    if (route.specimenId) renderDetail(route.labId, route.specimenId);
    else renderHome(route.labId);
  }

  document.addEventListener('click', event => {
    const control = event.target.closest('[data-action]');
    if (!control) return;
    if (control.dataset.action === 'lang') {
      state.lang = state.lang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('bl-lang', state.lang);
      render();
    } else if (control.dataset.action === 'theme') {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('bl-theme', state.theme);
      setAppearance();
    } else if (control.dataset.action === 'site-back') {
      if (window.parent !== window) {
        window.parent.postMessage('eto-tool-close', window.location.origin);
      } else {
        const referrerUrl = document.referrer ? new URL(document.referrer) : null;
        const isEtoPage = referrerUrl &&
          referrerUrl.origin === window.location.origin &&
          !referrerUrl.pathname.includes('/Data/Edu_tools/');
        window.location.href = isEtoPage
          ? referrerUrl.href
          : 'https://edu-11245.github.io/ETO-EDUCATION/#tool/bio-labs';
      }
    } else if (control.dataset.action === 'share-specimen') {
      const url = control.dataset.url || window.location.href;
      const shareData = {
        title: control.dataset.title || document.title,
        text: control.dataset.description || '',
        url
      };
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          control.textContent = state.lang === 'ar' ? 'تم نسخ الرابط' : 'Link copied';
        }).catch(() => window.prompt(state.lang === 'ar' ? 'انسخ رابط العينة:' : 'Copy specimen link:', url));
      } else {
        window.prompt(state.lang === 'ar' ? 'انسخ رابط العينة:' : 'Copy specimen link:', url);
      }
    }
  });

  render();
})();
