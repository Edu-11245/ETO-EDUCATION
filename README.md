<div align="center">

# Bio Labs | معمل العملي

**مكتبة عينات العملي بالصور والرسومات الأصلية من ملفات المحاضرات، بالعربي والإنجليزي، في صفحة مستقلة لكل عينة.**

*An illustrated practical-lab reference: 60 specimens, 7 labs, original lecture images, Arabic and English, one shareable page per specimen.*

![Specimens](https://img.shields.io/badge/specimens-60-2563eb?style=flat-square)
![Labs](https://img.shields.io/badge/labs-7-6366f1?style=flat-square)
![Languages](https://img.shields.io/badge/AR%20%7C%20EN-bilingual-06b6d4?style=flat-square)
![Stack](https://img.shields.io/badge/stack-vanilla%20JS-f7df1e?style=flat-square&logoColor=black)
![Dependencies](https://img.shields.io/badge/dependencies-0-16a34a?style=flat-square)
![RTL](https://img.shields.io/badge/RTL-supported-0b2545?style=flat-square)

[التشغيل](#التشغيل-محليًا) ·
[المميزات](#المميزات) ·
[هيكل المشروع](#هيكل-المشروع) ·
[إضافة عينة](#إضافة-عينة-جديدة) ·
[بريفيو المشاركة](#بريفيو-المشاركة-open-graph) ·
[English](#english-summary)

</div>

---

## نظرة عامة

**Bio Labs** أداة جوه منصة **ETO.Edu** بتجمع كل عينات العملي (الخلايا، الميكروسكوب، العضيات، النواة والانقسام، الأجنة، الأوليات، اللافقاريات) في مكان واحد. كل عينة ليها:

- صورة أو أكتر من المصدر الأصلي (لوحات المحاضرات وصور المجهر) من غير إعادة رسم.
- اسم عربي وإنجليزي واسم علمي.
- نقاط سريعة من المحاضرة، والأجزاء والمصطلحات المسمّاة.
- دليل فهم وتعرّف بيربط الصورة بالمعلومة عشان تعرف العينة في الامتحان العملي.
- صفحة مستقلة بلينك ثابت تتشارك على واتساب وتليجرام بصورة العينة واسمها.

المشروع **Vanilla JavaScript** بالكامل: مفيش build ولا framework ولا حزم تتثبّت.

## المميزات

| الميزة | التفاصيل |
|---|---|
| ثنائي اللغة | تبديل فوري بين العربي (RTL) والإنجليزي (LTR) والاختيار بيتحفظ في `localStorage` |
| وضع فاتح وداكن | تبديل بزرار واحد والاختيار بيتحفظ |
| بحث شامل | بيدور في الاسم، الاسم العلمي، الملخص، النقاط، الأجزاء، دليل الفهم، واسم اللاب |
| فلترة باللاب | أزرار اختيار اللاب، واللاب المختار بيتحدّث في الـ URL (`?lab=`) |
| صفحة لكل عينة | معرض صور بالحجم الكامل، ملخص، نقاط سريعة، أجزاء مسمّاة، دليل فهم مرقّم |
| تنقّل بين العينات | العينة السابقة والتالية جوه نفس اللاب |
| مشاركة | زرار مشاركة بيستخدم `navigator.share` وبيرجع لنسخ اللينك لو مش متاح |
| بريفيو غني | كل عينة ليها صفحة ثابتة فيها وسوم Open Graph وTwitter Card |
| تكامل مع بوابة ETO | بيشتغل جوه `iframe` ويبلّغ البوابة بزرار الرجوع عن طريق `postMessage` |
| بياناتك في ملف واحد | كل المحتوى في `labs-data.js`، والإضافة والتعديل من غير لمس الكود |

## اللابات

| اللاب | المعرّف (`id`) | عدد العينات |
|---|---|:-:|
| Lab 1 — عينات الخلايا | `lab1-specimens` | 4 |
| Cytology — الميكروسكوب | `cyto-microscope` | 9 |
| Cell Biology — العضيات | `cell-biology` | 12 |
| Cytology — النواة والانقسام | `nucleus-mitosis` | 12 |
| Embryology — الأجنة | `embryology` | 14 |
| Zoology Lab 3 — الأوليات | `zoology-3` | 4 |
| Zoology Lab 5 — اللافقاريات | `zoology-5` | 5 |
| **الإجمالي** | | **60** |

## التشغيل محليًا

مفيش حاجة تتثبّت. شغّل أي سيرفر ثابت جوه الفولدر:

```bash
git clone https://github.com/Edu-11245/ETO-EDUCATION.git
cd "ETO-EDUCATION/Data/Edu_tools/Bio Labs"

python3 -m http.server 8000
```

وافتح `http://localhost:8000/`.

> افتح المشروع من سيرفر وليس بدبل كليك على الملف، لأن صفحات العينات بتحمّل الملفات بمسارات نسبية.

## هيكل المشروع

```text
Bio Labs/
├── index.html                 الصفحة الرئيسية (مكتبة العينات)
├── styles.css                 كل التصميم (الوضعين الفاتح والداكن، RTL/LTR)
├── labs-data.js               كل المحتوى: window.BIO_LABS
├── bio-labs.js                المنطق: الرسم، البحث، الفلترة، المشاركة، التنقّل
├── assets/                    الصور الأصلية من المحاضرات
│   ├── zoology-3/
│   ├── microscope/
│   └── ...
├── specimen-pages/            صفحة HTML ثابتة لكل عينة (60 صفحة)
│   └── <lab-id>/<specimen-id>/index.html
└── tools/
    └── generate_share_pages.py   بيولّد صفحات specimen-pages من labs-data.js
```

## إزاي بيشتغل

1. `index.html` وصفحات العينات كلها بتحمّل نفس الملفين: `labs-data.js` ثم `bio-labs.js`.
2. `bio-labs.js` بيقرا `window.BIO_LABS` وبيحدد المسار:
   - لو الـ `<body>` فيه `data-specimen-id` (صفحات العينات) بيرسم صفحة العينة.
   - غير كده بيرسم المكتبة، وبيقرا `?lab=` من الـ URL لو موجود.
3. صفحة العينة الثابتة فيها `data-lab-id` و`data-specimen-id` على الـ `<body>`، وكل المحتوى بيتبني من البيانات.
4. وسوم المشاركة موجودة في `<head>` صفحة العينة نفسها لأن تطبيقات المشاركة مبتشغّلش JavaScript.

## شكل البيانات

كل شيء في `labs-data.js`:

```js
window.BIO_LABS = [
  {
    "id": "lab1-specimens",
    "title":  { "ar": "Lab 1 — عينات الخلايا", "en": "Lab 1 — Cell specimens" },
    "source": "اسم ملف المصدر",
    "intro":  { "ar": "...", "en": "..." },
    "specimens": [
      {
        "id": "bacteria",                                  // بيبقى جزء من اللينك، حروف إنجليزي صغيرة وشرطات
        "name":       { "ar": "البكتيريا", "en": "Bacteria" },
        "scientific": "Escherichia coli (E. coli)",
        "kind":       "مرجع عملي",                         // الشارة اللي فوق الكارت
        "summary":    { "ar": "...", "en": "..." },         // بيظهر كوصف في بريفيو المشاركة
        "facts":      { "ar": ["نقطة"], "en": ["point"] },
        "parts":      { "ar": ["جزء"],  "en": ["part"] },
        "studySections": {
          "ar": [ { "title": "عنوان القسم", "items": ["بند", "بند"] } ],
          "en": [ { "title": "Section title", "items": ["item"] } ]
        },
        "cover":      "assets/lab1/bacteria-800.jpg",       // صورة الكارت وبريفيو المشاركة
        "sourcePage": "Lab 1 p.3",
        "images": [
          { "src": "assets/lab1/bacteria.jpg", "caption": { "ar": "...", "en": "..." }, "page": "p.3" }
        ]
      }
    ]
  }
];
```

الحقول المهمة: `id` و`name` و`summary` و`images` و`cover`. لو الحقل `cover` مش موجود بيتاخد أول صورة من `images`.

## إضافة عينة جديدة

1. حط الصورة في `assets/<lab>/` (يُفضّل JPG أقل من **300KB** عشان البريفيو).
2. ضيف العينة جوه `specimens` للاب المناسب في `labs-data.js` حسب الشكل اللي فوق.
3. ولّد صفحات المشاركة:

   ```bash
   python3 tools/generate_share_pages.py
   ```

4. اعمل commit لـ `labs-data.js` و`assets/` و`specimen-pages/` وارفع.

لإضافة لاب جديد: ضيف كائن جديد في مصفوفة `window.BIO_LABS` بـ `id` جديد، وهيظهر تلقائيًا في الفلاتر وبعد توليد الصفحات هيبقى ليه صفحاته.

## بريفيو المشاركة (Open Graph)

واتساب وتليجرام وفيسبوك وX بيقروا الـ HTML الخام للينك من غير ما يشغّلوا JavaScript. عشان كده كل عينة ليها صفحة ثابتة في `specimen-pages/` فيها:

```html
<meta property="og:title"       content="البكتيريا | Bio Labs">
<meta property="og:description" content="ملخص العينة...">
<meta property="og:image"       content="https://.../assets/lab1/bacteria-800.jpg">
<meta property="og:url"         content="https://.../specimen-pages/lab1-specimens/bacteria/index.html">
<meta name="twitter:card"       content="summary_large_image">
```

السكريبت `tools/generate_share_pages.py` بيطبّق كل ده من `labs-data.js`. لو نشرت المشروع على دومين تاني:

```bash
python3 tools/generate_share_pages.py --base "https://your-domain.com/path/Bio%20Labs/"
```

### لو البريفيو مش ظاهر

| المشكلة | الحل |
|---|---|
| ظهر من غير صورة بعد التعديل | واتساب وتليجرام بيحفظوا البريفيو القديم، جرّب عينة ماتشاركتش قبل كده أو ضيف `?v=2` في آخر اللينك |
| الصورة مش بتظهر أبدًا | تأكد إن الصورة أقل من 300KB وإن `og:image` لينك كامل يبدأ بـ `https://` |
| صور Wikimedia مبتظهرش | لينكات `Special:FilePath` بتعمل redirect وبعض التطبيقات مبتتبعهوش، نزّل الصورة في `assets/` واستخدم مسارها |
| اللينك بيفتح 404 | اتأكد إن فولدر `specimen-pages` كله اترفع وإن اسم الفولدر `Bio Labs` بمسافة متكتوب `Bio%20Labs` في اللينك |
| الصفحة اتنشرت ومفيش تغيير | استنى دقيقة أو اتنين لحد ما GitHub Pages يخلّص النشر |

## التكامل مع منصة ETO.Edu

- الأداة متسجلة في `tools-registry.js` الخاص بالمنصة بـ `id: 'bio-labs'` و`folder: 'Bio Labs'`.
- بتتفتح من البوابة جوه `iframe` على المسار `#tool/bio-labs`.
- زرار "الرجوع للموقع" بيبعت `eto-tool-close` للصفحة الأم عن طريق `postMessage`، ولو الصفحة اتفتحت لوحدها بيرجع للبوابة.
- المنصة بتشارك لينك الأداة نفسها من `Data/Edu_tools/Bio Labs/`، ولينك العينة من `specimen-pages/`.

## التقنيات

- HTML5 وCSS3 (متغيرات CSS للثيمات، Grid وFlexbox)
- JavaScript بدون مكتبات (ES2018+)
- خط **Cairo** من Google Fonts
- Python 3 لسكريبت توليد الصفحات (مكتبة قياسية فقط)

## المصادر والحقوق

- الرسومات وصور المجهر مأخوذة من ملفات المحاضرات والعملي المرفوعة، والتسميات محفوظة كما هي في المصدر.
- بعض الصور (البكتيريا، خلية النبات، الخلية الحيوانية) من **Wikimedia Commons** ولكل صورة رخصتها الخاصة عند صفحتها الأصلية.
- المحتوى تعليمي للمراجعة وليس بديلًا عن المحاضرة أو دكتور المادة.

---

## English Summary

**Bio Labs** is a dependency-free, bilingual (Arabic RTL / English LTR) practical-lab reference built with vanilla JavaScript. It ships 60 specimens across 7 labs, each with original lecture images, labeled parts, quick lecture notes, a study guide, and its own shareable static page.

```bash
cd "Bio Labs"
python3 -m http.server 8000     # open http://localhost:8000/
```

- **Data-driven:** everything lives in `labs-data.js` (`window.BIO_LABS`).
- **Share previews:** `python3 tools/generate_share_pages.py` generates one static page per specimen with Open Graph and Twitter Card tags, because link-preview crawlers do not execute JavaScript.
- **Adding content:** drop the image in `assets/`, add the specimen to `labs-data.js`, rerun the generator, commit.
- **Keep preview images under about 300KB** and use absolute `https://` URLs for `og:image`.

<div align="center">

بالتوفيق يارب

</div>
