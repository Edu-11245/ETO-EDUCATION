<div align="center">

# ETO.Edu | منصة إيتو التعليمية

**منصة عربية في ملف `index.html` واحد: أدوات الطالب والمعلم، أدوات PDF والصوت، امتحانات أونلاين، ملخصات، مواد الكليات، وكورسات لغات، وروبوت بيمشي فوق الصفحة ويرد على أسئلتك.**

*An Arabic-first education platform: student and teacher tools, PDF and audio utilities, online exams, summaries, college subjects, language courses, an assistant robot, and an installable PWA.*

[![Live](https://img.shields.io/badge/live-edu--11245.github.io%2FETO--EDUCATION-2563eb?style=flat-square)](https://edu-11245.github.io/ETO-EDUCATION/)
![PWA](https://img.shields.io/badge/PWA-installable-5a0fc8?style=flat-square)
![Stack](https://img.shields.io/badge/stack-vanilla%20JS%20%2B%20Tailwind-38bdf8?style=flat-square)
![Backend](https://img.shields.io/badge/hosting-GitHub%20Pages-0b2545?style=flat-square)
![RTL](https://img.shields.io/badge/RTL-Arabic%20first-16a34a?style=flat-square)
![UI](https://img.shields.io/badge/UI-AR%20%7C%20EN%20%7C%20ES%20%7C%20FR%20%7C%20DE-f59e0b?style=flat-square)

[الأقسام](#الأقسام-الرئيسية) ·
[الأدوات](#الأدوات) ·
[التقنيات](#التقنيات) ·
[التشغيل](#التشغيل-محليًا) ·
[هيكل المشروع](#هيكل-المشروع) ·
[إضافة أداة تعليمية](#إضافة-أداة-تعليمية-edu_tools) ·
[English](#english-summary)

</div>

---

## نظرة عامة

**ETO.Edu** موقع واحد بيجمع كل اللي الطالب والمدرس بيحتاجه: أدوات لملفات الـ PDF والصوت، شيتات وشهادات وكشف درجات للمدرسين، امتحانات أونلاين بلينك، جدول مذاكرة وتايمر وحاسبة للطالب، ملخصات وامتحانات مرتبة حسب المرحلة، وصفحات مواد للكليات، وكورسات لتعلّم اللغات.

- **الواجهة بالعربي أولًا (RTL)**، ومعاها دعم الإنجليزي والإسباني والفرنسي والألماني في صفحات اللغات.
- **أغلب الأدوات بتشتغل جوه المتصفح** من غير ما الملفات تتبعت لأي سيرفر (الدمج، الضغط، التحويل، الحماية، التنظيف).
- **قابل للتثبيت** كتطبيق على الموبايل والكمبيوتر (PWA).
- **استضافة ثابتة** على GitHub Pages، ومفيش خطوة build.

## الأقسام الرئيسية

البوابة (`#page-portal`) فيها أربع بطاقات كبيرة:

| القسم | الوصف |
|---|---|
| **EDUCATION** | الدخول للمنصة: أدوات الطالب والمعلم وملفات PDF والشيتات والامتحانات وتنظيم المذاكرة |
| **TOOLS** | أدوات سريعة للتحويل والملفات والتنظيم |
| **COLLEGE SUBJECTS** | صفحة لكل كلية ومعهد، وكل مادة فيها شرح وملفات وملخصات |
| **LANG LEARNING** | تعلّم لغة جديدة خطوة بخطوة (الصفحات بتتبني من `lang/core.js`) |

وجوه قسم الأدوات ثلاث فئات: **أدوات المعلم** و**أدوات الطالب** و**أدوات إضافية**، ومعاهم مساعد الموقع (الروبوت).

## الأدوات

### أدوات المعلم

| الأداة | بتعمل إيه |
|---|---|
| كشف الدرجات | تكتب الأسامي والدرجات وتطلع المتوسط والتقديرات وكشف الأوائل PDF أو Excel |
| إنشاء امتحان أونلاين | ترفع ملف الأسئلة وملف الإجابات (JSON)، تحدد الوقت والمدة، وتنشر بلينك للطلاب مع رسالة جاهزة للواتساب |
| نتائج الامتحانات | درجات الطلاب ونِسَب النجاح وتفاصيل الأسئلة الغلط في الامتحانات المنشورة |
| ملف الإجابات | تحدد الإجابة الصح ودرجة كل سؤال وتطلّع JSON للامتحان الأونلاين وPDF للنسخة الورقية |
| شهادة تقدير | 50 قالب جاهز، خطوط جوجل، توقيعك، وشهادة لكل طالب في الفصل مرة واحدة |
| الشيتات | تصميم شيتات وأسئلة بأستايلات مختلفة مع صور وخطوط إجابة |
| القوالب | قوالب للمذاكرة والتنظيم والكتابة والطباعة مع تخصيص الـ PDF |
| تنظيف صور المحاضرات | معالجة الصور الملتقطة بالكاميرا وتبييضها |
| مقارنة نسختين PDF | عرض الفرق بين ملفين صفحة بصفحة |

### أدوات الطالب

| الأداة | بتعمل إيه |
|---|---|
| مدرسيني ومنصاتي | المدرسين والمنصات التعليمية مترتبة حسب النوع والمجال مع بحث وفلاتر |
| ملخصات الطلاب | تصفح ملخصات معتمدة حسب المرحلة ونوع الدراسة (عام أو لغات) وإرسال ملخص جديد للمراجعة |
| الامتحانات | بنك امتحانات ومراجعات للمعاينة والتحميل مع تقييم الملف |
| جدولي | جدول مذاكرة أسبوعي قابل للتعديل ويتحمّل PDF ويتفتح تاني للتعديل |
| تايمر (بومودورو) | جلسات تركيز واستراحات بإعدادات محفوظة وتنبيه صوتي وتنبيه المتصفح |
| احسبلي كام % | نسبتك المئوية من درجتك والمجموع |
| آلة حاسبة علمية | حسابات ومعادلات ودوال مثلثية مع سجل العمليات |
| ترجملي | ترجمة بين العربي والإنجليزي والفرنسي والألماني والإسباني والتركي مع إعادة صياغة بالمصري |
| مكتبتي | أرشيف ملفات شخصي حسب المادة والترم، **محفوظ على جهازك فقط** (IndexedDB) |
| قارئ صوتي | قراءة ملف PDF بصوت ولد أو بنت، عربي أو إنجليزي |
| تلوين PDF وتظليل | ثيمات لراحة العين وتظليل الكلمات المهمة |

### أدوات PDF

دمج الملفات، استخراج وحذف صفحات، تدوير وقص الحواف، تحويل صور إلى PDF واستخراج الصور، تحويل PDF إلى Word (كل صفحة بنفس شكلها)، استخراج النصوص وتحويل النص إلى PDF، علامة مائية، إعادة ترتيب بالسحب والإفلات، حماية بكلمة مرور (تشفير حقيقي)، وضغط الملفات، وتنظيف الصور.

### أدوات الصوت

تحويل بين **MP3 / MP4 / WAV / OGG** واستخراج الصوت من الفيديو وتحويل الصوت لفيديو بصورة غلاف أو بارات صوتية متحركة، مع اختيار الجودة ومعدل العينات والقنوات.

### أدوات تعليمية

أدوات تفاعلية للمواد العلمية بتتسجل في `Data/Edu_tools/tools-registry.js`:

| الأداة | المعرّف |
|---|---|
| رسم الدوال — Maths 1 | `maths-function` |
| الجدول الدوري — Periodic Table | `periodic-table` |
| Bio Labs (عينات العملي) | `bio-labs` |

### الروبوت (مساعد الموقع)

روبوت بيمشي فوق الصفحة (`Robot/robot.js` و`Robot/robot.css`) وبيساعدك تعرف الأدوات وتوصل لها، وتفتح محادثته في نافذة مستقلة (`Robot/robot-chat.html`).

## التقنيات

| الجزء | المستخدم |
|---|---|
| الواجهة | HTML5 + JavaScript (بدون framework) + Tailwind (CDN) + CSS مخصص + وضع داكن (`dark.css`) |
| الأيقونات والخطوط | Font Awesome (محلي)، خطوط Cairo وAmiri وTajawal وAref Ruqaa وReem Kufi |
| PDF | pdf.js، jsPDF، pdf-lib، pdf-encrypt-lite، html2canvas |
| OCR | Tesseract.js 4.1.1 |
| ملفات أخرى | SheetJS (Excel)، PptxGenJS، Sortable.js |
| الصوت والنطق | Web Speech API (`speechSynthesis`) |
| الامتحانات الأونلاين | Firebase (Auth بتسجيل الدخول بجوجل + Realtime Database) |
| التثبيت والعمل أوفلاين | `manifest.json` + `service-worker.js` |
| اللغات | `lang/core.js` + `es.js` + `fr.js` + `de.js` + `boot.js` |
| الاستضافة | GitHub Pages |

## التشغيل محليًا

مفيش حاجة تتثبّت. شغّل أي سيرفر ثابت من جذر المشروع:

```bash
git clone https://github.com/Edu-11245/ETO-EDUCATION.git
cd ETO-EDUCATION

python3 -m http.server 8000
```

وافتح `http://localhost:8000/`.

> لازم يتفتح من سيرفر وليس بدبل كليك على `index.html`، لأن الـ Service Worker وتحميل الملفات بمسارات نسبية ومكتبات الـ PDF مش بتشتغل من `file://`.

## هيكل المشروع

الهيكل ده مبني على الملفات اللي `index.html` بيحمّلها، راجعه مع الفولدرات الفعلية عندك:

```text
ETO-EDUCATION/
├── index.html                  كل صفحات الموقع (sections) في ملف واحد
├── manifest.json               إعدادات التثبيت كتطبيق (PWA)
├── service-worker.js           الكاش والعمل بدون إنترنت
├── dark.css                    الوضع الداكن
├── css/
│   ├── main.css                التصميم الأساسي
│   ├── courses.css             صفحات الكورسات
│   ├── animate.min.css         الحركات
│   └── fontawesome.min.css
├── js/
│   └── main.js                 منطق الموقع: التنقّل، الأدوات، الامتحانات، المشاركة
├── lang/                       واجهة وكورسات اللغات (core, boot, es, fr, de, lang.css)
├── courses/                    courses.js و summaries.js: الكورسات والملخصات
├── Robot/                      الروبوت: robot.js, robot.css, robot-chat.html
├── Trns_Data/Data.js           بيانات صفحة الترجمة
└── Data/
    ├── Lib/                    مكتبات محلية (pdf.js, jsPDF, pdf-lib, xlsx, ...)
    ├── Tools/                  محوّلات الصوت (mp3-to-wav, wav-to-mp3, ...)
    ├── Edu/CNU/F.SCIENCE/      محتوى مواد الكلية (content.js)
    ├── Edu_tools/              الأدوات التعليمية التفاعلية
    │   ├── tools-registry.js
    │   └── <folder>/index.html لكل أداة (مثلًا Bio Labs وperiodic table)
    ├── icons/                  أيقونات التطبيق (icon-192.png, icon-512.png)
    └── Img/
```

## إزاي بيشتغل

- **صفحة واحدة بأقسام:** كل شاشة هي `<section id="page-...">`، والتنقّل بيبدّل الظاهر منها من غير تحميل صفحة جديدة، ورابط الصفحة بيتغير بـ hash عشان زرار الرجوع يشتغل.
- **الأدوات التعليمية:** بتتفتح جوه `iframe` في `#page-tool-view` على رابط بالشكل `index.html#tool/<id>`، وبتبلّغ الصفحة الأم بالإغلاق عن طريق `postMessage` (`eto-tool-close`).
- **الامتحانات الأونلاين:** المدرس بينشر الامتحان وبياخد لينك `?exam=<id>` يبعته للطلاب، وبيتعرض بكارت معاينة في واتساب. النتائج بتتجمع في صفحة "امتحانات طلابي".
- **مكتبتي:** الملفات بتتخزن في المتصفح بس (IndexedDB) ومبتتبعتش لأي مكان.
- **ملفاتك في الأدوات:** عمليات الـ PDF والصوت بتتنفذ في المتصفح باستخدام المكتبات المحلية.

## إضافة أداة تعليمية (Edu_tools)

1. اعمل فولدر جوه `Data/Edu_tools/` باسم الأداة، وحط فيه `index.html` (تتحمّل جوه `iframe`).
2. سجّلها في `Data/Edu_tools/tools-registry.js`:

   ```js
   {
     id: 'my-tool',                         // بيبقى في الرابط: #tool/my-tool
     folder: 'My Tool',                     // اسم الفولدر بالظبط (يحتمل مسافات)
     title: 'اسم الأداة — My Tool',
     short: 'اسم قصير',
     desc: 'وصف في جملة أو اتنين.',
     gradient: 'linear-gradient(135deg,#0b2545,#6366f1 70%,#06b6d4)',
     preview: 'preview.jpg',               // صورة معاينة جوه فولدر الأداة
     cardImage: 'https://...'               // اختياري: صورة الكارت
   }
   ```

3. **بريفيو المشاركة:** المنصة بتشارك لينك الأداة بالشكل `Data/Edu_tools/<folder>/`، فلازم `index.html` الخاص بالفولدر يكون فيه وسوم Open Graph (`og:title` و`og:description` و`og:image` بلينك كامل `https://`) لأن واتساب وتليجرام مبيشغّلوش JavaScript.
4. زرار الرجوع جوه الأداة بيبعت `window.parent.postMessage('eto-tool-close', window.location.origin)`.

## النشر على GitHub Pages

1. ارفع المشروع على فرع `main`.
2. من **Settings > Pages** اختار الفرع `main` والمجلد الجذر.
3. الموقع هيتنشر على `https://<user>.github.io/<repo>/`.
4. لو غيّرت `service-worker.js` غيّر اسم الكاش جواه عشان المستخدمين ياخدوا النسخة الجديدة.

## مشاكل شائعة

| المشكلة | الحل |
|---|---|
| تعديلاتي مش بتظهر بعد النشر | الـ Service Worker محتفظ بنسخة قديمة، غيّر اسم الكاش أو اعمل Hard Reload وامسح بيانات الموقع |
| أدوات الـ PDF مش بتفتح محليًا | شغّل من سيرفر (`python3 -m http.server`) مش من `file://` |
| بريفيو الواتساب مش ظاهر | واتساب بيحفظ البريفيو القديم، جرّب لينك جديد أو ضيف `?v=2`، وتأكد إن `og:image` لينك كامل وحجم الصورة أقل من 300KB |
| أداة تعليمية مش بتظهر | تأكد من تسجيلها في `tools-registry.js` وإن `folder` مطابق لاسم الفولدر بالحرف |
| الامتحان الأونلاين مش بينشر | محتاج تسجيل دخول بجوجل وملفي الأسئلة والإجابات JSON صحيحين |

## الأمان والخصوصية

- ملفات الـ PDF والصوت بتتعالج في المتصفح ومبتترفعش.
- مكتبتك الشخصية محفوظة على جهازك فقط.
- مفاتيح Firebase الخاصة بالواجهة بتبقى ظاهرة في كود أي موقع ثابت، فالحماية الفعلية تتظبط من **قواعد Firebase (Security Rules)** وليس من إخفاء المفاتيح. راجع القواعد قبل أي نشر عام.

## المساهمة

1. اعمل Fork وفرع جديد لكل تعديل.
2. حافظ على نفس الأسلوب: عربي أولًا، وبدون إيموجي في الواجهة.
3. جرّب على الموبايل والكمبيوتر، وفي الوضعين الفاتح والداكن.
4. افتح Pull Request بوصف واضح وصور قبل وبعد لو التعديل في الشكل.

## الحقوق

- مؤسس ومطوّر المنصة: **Mohammed Saad (ETO)**.
- الملخصات والامتحانات المنشورة ملك لأصحابها، ولا تُنشر مواد فيها حقوق ملكية لغيرهم.
- مكتبات الطرف الثالث (pdf.js, jsPDF, pdf-lib, Tesseract.js, SheetJS, PptxGenJS, Sortable, Tailwind, Font Awesome, Firebase) لكل منها رخصتها الخاصة.
- أضف ملف `LICENSE` يوضح رخصة المشروع نفسه.

---

## English Summary

**ETO.Edu** is a static, Arabic-first (RTL) education platform served from a single `index.html`: PDF tools (merge, split, convert, watermark, password-protect, compress), audio converters (MP3, MP4, WAV, OGG), teacher tools (grade sheets, certificates, worksheet builder, online exams with shareable links), student tools (weekly planner, Pomodoro, scientific calculator, translator, text-to-speech PDF reader, local file library), summaries and exam banks, college subject pages, language courses, interactive science tools (function plotter, periodic table, Bio Labs), and an assistant robot. It installs as a PWA and runs on GitHub Pages with no build step.

```bash
git clone https://github.com/Edu-11245/ETO-EDUCATION.git
cd ETO-EDUCATION
python3 -m http.server 8000     # open http://localhost:8000/
```

- **Adding a tool:** create `Data/Edu_tools/<folder>/index.html`, register it in `tools-registry.js`, and add Open Graph tags to the folder's `index.html` so shared links show a preview.
- **Privacy:** PDF and audio processing happens in the browser; the personal library is stored locally in IndexedDB.
- **Security:** Firebase client keys are public by design, so protect data with Firebase Security Rules.

<div align="center">

صل ع النبي. بالتوفيق يارب

</div>
