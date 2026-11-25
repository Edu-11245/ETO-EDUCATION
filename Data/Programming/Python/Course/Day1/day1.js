/* ===== Day 1: نبدأ من الصفر (درس واحد بفصول) =====
   كل فصل: talk (شرح متحرك مع الصوت) ← practice (محاكي) ← exercise ← quiz. أي حقل مش محتاجه شيله.
   talk.audio: ملف الصوت في Day1/audio/ (لحد ما تسجّل، الصفحة بتقرا الجمل بصوت المتصفح وتحرّك الشاشة).
   كل سطر في lines: say = الجملة، t = ثانية ظهورها في تسجيلك (اختياري)، والباقي أحداث الشاشة (شوف أول player.js). */
(window.PYTHON_LESSONS = window.PYTHON_LESSONS || {})['day1'] = {
  id: 'day1',
  title: 'Day 1: نبدأ من الصفر',
  goal: 'تفهم يعني إيه برمجة، والكمبيوتر بيفكر إزاي، وتكتب أول كود ليك.',
  minutes: 45,
  chapters: [
    {
      title: 'يعني إيه برمجة؟',
      talk: {
        title: 'يعني إيه برمجة؟',
        /* audio: 'what-is-programming.mp3', */
        stage: `
<div class="pp-sc" id="s1"><div class="emo hid" id="h1">👋</div><div class="big hid" id="h2">يعني إيه برمجة؟</div><div class="pill p2 hid" id="h3">أول فصل · Day 1</div><div class="cap2 hid" id="h4">من الصفر.. ومن غير أي خلفية</div></div>

<div class="pp-sc" id="s2"><div class="row"><div class="card hid" id="t1"><div class="emo">🧑</div>«هاتلي كوباية شاي»</div><div class="emo hid" id="t2">☕</div></div>
<div class="row"><span class="pill p2 hid" id="t3">يسخّن الماية</span><span class="pill p2 hid" id="t4">يحط الشاي والسكر</span><span class="pill p2 hid" id="t5">يجيبها لك</span></div>
<div class="card hid" id="t6">إنسان.. بيفهم قصدك ويتصرف</div></div>

<div class="pp-sc" id="s3"><div class="row"><div class="emo hid" id="c1">💻</div><span class="pill p1 hid" id="c2">⚡ سريع جدًا</span><span class="pill p3 hid" id="c3">❓ مبيفهمش من نفسه</span></div>
<div class="card hid" id="c4">«هاتلي شاي» ← 🤷 مستغرب</div>
<div class="row"><span class="pill p2 hid" id="c5">1. روح عند الحنفية</span><span class="pill p2 hid" id="c6">2. افتحها</span><span class="pill p2 hid" id="c7">3. املا الكاتل</span></div>
<div class="card hid" id="c8">💡 موظف سريع جدًا.. بينفّذ المكتوب في الورقة بالحرف</div></div>

<div class="pp-sc" id="s4"><div class="pill p1 hid" id="d0" style="font-size:1.1em">البرمجة = تعليمات مرتبة وواضحة للكمبيوتر</div>
<div class="row"><div class="card hid" id="d1"><div class="emo">📋</div><b>البرنامج</b><br>كل التعليمات</div><div class="card hid" id="d2"><div class="emo">⌨️</div><b>الكود</b><br>اللي بنكتبه</div><div class="card hid" id="d3"><div class="emo">🗣️</div><b>لغة البرمجة</b><br>زي Python</div><div class="card hid" id="d4"><div class="emo">🧑‍💻</div><b>المبرمج</b><br>إنت بعد شوية</div></div>
<div class="code hid" id="d5">&nbsp;</div></div>

<div class="pp-sc" id="s5"><div class="pill p3 hid" id="r0">تشبيه الوصفة 🍳</div>
<div class="card"><div style="display:flex;flex-direction:column;gap:.5em">
<div class="rowc hid" id="r1"><span class="l">الوصفة كلها</span><span>⟷</span><span class="r">البرنامج</span></div>
<div class="rowc hid" id="r2"><span class="l">المكونات (أرز، ملح، زيت)</span><span>⟷</span><span class="r">البيانات</span></div>
<div class="rowc hid" id="r3"><span class="l">خطوات التحضير</span><span>⟷</span><span class="r">الكود</span></div>
<div class="rowc hid" id="r4"><span class="l">الطباخ</span><span>⟷</span><span class="r">الكمبيوتر</span></div>
<div class="rowc hid" id="r5"><span class="l">الأكلة اللي طلعت</span><span>⟷</span><span class="r">النتيجة</span></div></div></div>
<div class="pill p1 hid" id="r6">ترتيب غلط ← 🐞 Bug (خطأ)</div></div>

<div class="pp-sc" id="s6"><div class="grid3">
<div class="card hid" id="a1"><span class="emo">📱</span>تطبيقات الموبايل</div><div class="card hid" id="a2"><span class="emo">🎮</span>الألعاب</div><div class="card hid" id="a3"><span class="emo">🏧</span>ماكينة الصراف</div>
<div class="card hid" id="a4"><span class="emo">🔍</span>جوجل</div><div class="card hid" id="a5"><span class="emo">🚗</span>العربيات الحديثة</div><div class="card hid" id="a6"><span class="emo">🌐</span>المنصة اللي بتذاكر عليها</div></div></div>

<div class="pp-sc" id="s7"><div class="vst">
<span class="pill p1 hid" id="v1">1. يفهم المشكلة 🧠</span><span class="pill p2 hid" id="v2">2. يقسّمها لخطوات صغيرة ✂️</span><span class="pill p3 hid" id="v3">3. يكتبها كود ⌨️</span><span class="pill p1 hid" id="v4">4. يجرّب ويصلّح 🔧</span></div>
<div class="card hid" id="v5">الأخطاء طبيعية جدًا.. مفيش مبرمج مبيغلطش</div></div>

<div class="pp-sc" id="s8"><div class="pill p3">3 أفكار غلط 🚫</div><div class="myth">
<div class="bad hid" id="b1">لازم أكون عبقري في الرياضة</div><div class="good hid" id="g1">محتاج تفكير مرتب بس</div>
<div class="bad hid" id="b2">لازم أحفظ كل حاجة</div><div class="good hid" id="g2">المهم تفهم، والباقي تدوّر عليه</div>
<div class="bad hid" id="b3">البرمجة لخريجي كليات معينة</div><div class="good hid" id="g3">أي حد يقدر لو مشى خطوة خطوة</div></div></div>

<div class="pp-sc" id="s9"><div class="emo hid" id="z0">🎉</div>
<div class="pill p3 hid" id="z1">البرمجة = تعليمات مرتبة للكمبيوتر</div><div class="pill p2 hid" id="z2">سريع.. بس بينفّذ بالحرف</div><div class="pill p1 hid" id="z3">افهم ← قسّم ← اكتب ← جرّب</div>
<div class="card hid" id="z4">الخطوة الجاية: تمرين ترتيب + كويز سهل</div></div>
`,
        lines: [
      { say: 'أهلاً بيك في أول درس في الكورس. بجد مبسوط إنك هنا.', scene:'s1', show:'#h1', fx:['#h1','bounce'] },
      { say: 'النهارده هنعرف يعني إيه برمجة، وهتشوف إنها أبسط بكتير من اللي في دماغك.', show:'#h2,#h3', fx:['#h2','pop'] },
      { say: 'ومن غير ما تعرف أي حاجة قبل كده. هنبدأ من الصفر خالص.', show:'#h4' },
      { say: 'تخيل إنك قلت لصاحبك: هاتلي كوباية شاي.', scene:'s2', show:'#t1', fx:['#t1','pop'] },
      { say: 'هو هيقوم من غير ما تشرحله حاجة. هيسخّن الماية.', show:'#t2,#t3' },
      { say: 'ويحط الشاي والسكر.', show:'#t4' },
      { say: 'ويجيبها لك.', show:'#t5', fx:['#t2','bounce'] },
      { say: 'إنت مقلتلوش ولا خطوة من دول، ومع ذلك فهم. ليه؟ لأنه إنسان، وبيفهم قصدك ويتصرف.', show:'#t6', fx:['#t6','pulse'] },
      { say: 'الكمبيوتر بقى مش كده خالص.', scene:'s3', show:'#c1', fx:['#c1','shake'] },
      { say: 'الكمبيوتر سريع جدًا، أسرع منك ومني بملايين المرات.', show:'#c2', fx:['#c2','pop'] },
      { say: 'لكنه مش ذكي زي ما الناس فاكرة. هو مبيفهمش حاجة من نفسه.', show:'#c3' },
      { say: 'لو قلتله هاتلي شاي، هيقف مكانه مستغرب، ومش هيعرف حتى يعني إيه شاي أصلًا.', show:'#c4', fx:['#c4','shake'] },
      { say: 'لازم تقوله كل خطوة، بالترتيب وبوضوح. روح عند الحنفية.', show:'#c5' },
      { say: 'افتحها.', show:'#c6' },
      { say: 'املا الكاتل. وهو هينفّذ بالحرف.', show:'#c7' },
      { say: 'تخيله موظف سريع جدًا، بس حرفي لدرجة إنه بينفّذ اللي مكتوب في الورقة، مش اللي في دماغك.', show:'#c8', fx:['#c8','pop'] },
      { say: 'ولو كتبتله خطوة غلط، هينفّذها غلط ومش هيسألك.', fx:['#c7','shake'] },
      { say: 'والكلام ده بالظبط هو البرمجة.', scene:'s4', show:'#d0', fx:['#d0','pop'] },
      { say: 'البرمجة إنك تكتب للكمبيوتر تعليمات مرتبة وواضحة، بلغة يفهمها، عشان ينفّذ مهمة معينة. وبس. مفيش سحر.', hl:'#d0' },
      { say: 'عايزك تفهم أربع كلمات هنقولهم كتير. الأولى: البرنامج. ده كل التعليمات مع بعض.', show:'#d1', fx:['#d1','pop'] },
      { say: 'التانية: الكود. ده الكلام اللي بنكتبه نفسه.', show:'#d2', fx:['#d2','pop'], type:['#d5','print("Hello")'] },
      { say: 'التالتة: لغة البرمجة. دي اللغة اللي بنكتب بيها، زي بايثون اللي هنتعلمها.', show:'#d3', fx:['#d3','pop'] },
      { say: 'والرابعة: المبرمج. ده الشخص اللي بيكتب التعليمات، وهو إنت بعد شوية.', show:'#d4', fx:['#d4','bounce'] },
      { say: 'وعشان الفكرة تثبت، فكّر في وصفة الأكل.', scene:'s5', show:'#r0' },
      { say: 'الوصفة كلها هي البرنامج.', show:'#r1', fx:['#r1','pop'] },
      { say: 'المكونات، زي الأرز والملح والزيت، هي البيانات.', show:'#r2', fx:['#r2','pop'] },
      { say: 'خطوات التحضير هي الكود.', show:'#r3', fx:['#r3','pop'] },
      { say: 'الطباخ اللي بينفّذ هو الكمبيوتر.', show:'#r4', fx:['#r4','pop'] },
      { say: 'والأكلة اللي طلعت هي النتيجة.', show:'#r5', fx:['#r5','pop'] },
      { say: 'ولو الخطوات اتكتبت بترتيب غلط، الأكلة هتبوظ. وكمان في البرمجة، هيطلع في البرنامج خطأ، والخطأ ده اسمه باج.', show:'#r6', fx:['#r6','shake'] },
      { say: 'ولو سألتني فايدة الكلام ده في حياتك، هقولك: البرمجة حواليك في كل مكان.', scene:'s6' },
      { say: 'في تطبيقات الموبايل، زي واتساب ويوتيوب.', show:'#a1', fx:['#a1','pop'] },
      { say: 'وفي الألعاب اللي بتلعبها.', show:'#a2', fx:['#a2','pop'] },
      { say: 'وفي ماكينة الصراف، اللي بتتأكد من الرقم السري وتطلّعلك الفلوس.', show:'#a3', fx:['#a3','pop'] },
      { say: 'وفي جوجل، اللي بيدوّر في مليارات الصفحات في ثواني.', show:'#a4', fx:['#a4','pop'] },
      { say: 'وفي العربيات الحديثة.', show:'#a5', fx:['#a5','pop'] },
      { say: 'وحتى الموقع اللي إنت بتذاكر عليه دلوقتي، متكتب بالبرمجة.', show:'#a6', fx:['#a6','bounce'] },
      { say: 'طيب المبرمج بيعمل إيه بالظبط؟ أربع حاجات.', scene:'s7' },
      { say: 'أولًا، يفهم المشكلة كويس.', show:'#v1', fx:['#v1','pop'] },
      { say: 'ثانيًا، يقسّمها لخطوات صغيرة.', show:'#v2', fx:['#v2','pop'] },
      { say: 'ثالثًا، يكتب الخطوات دي كود.', show:'#v3', fx:['#v3','pop'] },
      { say: 'ورابعًا، يجرّب، ولو لقى غلطة يصلّحها.', show:'#v4', fx:['#v4','pop'] },
      { say: 'والأخطاء حاجة طبيعية جدًا. مفيش مبرمج في الدنيا مبيغلطش، الفرق إنه بيعرف يلاقي الغلطة ويصلّحها من غير ما يزعل.', show:'#v5', fx:['#v5','pulse'] },
      { say: 'وفي ثلاث أفكار غلط، عايزك تشيلهم من دماغك دلوقتي.', scene:'s8' },
      { say: 'الأولى: إن لازم تكون عبقري في الرياضة. لأ، محتاج بس تفكير مرتب.', show:'#b1,#g1', fx:['#b1','shake'] },
      { say: 'التانية: إن لازم تحفظ كل حاجة. لأ، المبرمجين بيدوّروا كل يوم، المهم إنك تفهم.', show:'#b2,#g2' },
      { say: 'والتالتة: إن البرمجة لخريجي كليات معينة بس. لأ، أي حد يقدر يتعلمها لو مشى خطوة خطوة.', show:'#b3,#g3' },
      { say: 'خلّينا نراجع بسرعة. البرمجة يعني تعليمات مرتبة للكمبيوتر.', scene:'s9', show:'#z0,#z1', fx:['#z0','bounce'] },
      { say: 'هو سريع، بس بينفّذ بالحرف.', show:'#z2' },
      { say: 'والمبرمج بيفهم، ويقسّم، ويكتب، ويجرّب.', show:'#z3' },
      { say: 'في الخطوة الجاية هتجرب تمرين بسيط فيه ترتيب خطوات، وبعده كويز سهل. مفيش ضغط خالص. يلا بينا!', show:'#z4', fx:['#z4','pop'] }
        ]
      },

      exercise: {
        type: 'order',
        title: 'رتّب الخطوات',
        prompt: 'عايز تكلم صاحبك من الموبايل. رتّب الخطوات دي بالترتيب الصح. ده بالظبط تفكير المبرمج: ترتيب الخطوات.',
        items: [
          'فك قفل الموبايل',
          'افتح تطبيق الاتصال',
          'اكتب رقم صاحبك أو اختاره من جهات الاتصال',
          'دوس على زرار الاتصال',
          'اتكلم بعد ما يرد'
        ],
        insight: 'لو بدّلت خطوتين في الترتيب المكالمة مش هتتم. والكمبيوتر كمان: ترتيب الأوامر هو اللي بيفرق.'
      },

      quiz: {
        pass: 60,
        questions: [
          { q: 'البرمجة هي:',
            options: ['كتابة تعليمات مرتبة وواضحة للكمبيوتر عشان ينفّذها', 'استخدام الإنترنت', 'إصلاح الأجهزة', 'تصميم الصور'],
            answer: 0, why: 'البرمجة معناها إنك تكتب للكمبيوتر خطوات واضحة بترتيب معين وهو ينفّذها.' },
          { q: 'الكمبيوتر بينفّذ الأوامر:',
            options: ['بيفهم قصدك لوحده', 'بالحرف زي ما اتكتبت', 'بيخمّن اللي إنت عايزه', 'بيتجاهل الأوامر الغلط'],
            answer: 1, why: 'الكمبيوتر سريع بس مبيخمّنش. بينفّذ اللي مكتوب بالظبط.' },
          { q: 'في تشبيه الوصفة، الكود بيقابل:',
            options: ['المكونات', 'الطباخ', 'خطوات التحضير', 'الأكلة اللي طلعت'],
            answer: 2, why: 'الخطوات هي الكود، والمكونات هي البيانات، والطباخ هو الكمبيوتر، والأكلة هي النتيجة.' },
          { q: 'لو البرنامج طلّع نتيجة غلط، السبب غالبًا:',
            options: ['الأوامر اتكتبت غلط أو بترتيب غلط', 'الشاشة صغيرة', 'الكمبيوتر زعلان', 'النت بطيء'],
            answer: 0, why: 'الأخطاء بتيجي غالبًا من أوامر غلط أو ترتيب غلط، وإصلاحها جزء عادي من الشغل.' },
          { q: 'أول خطوة المبرمج بيعملها لما يحل مشكلة:',
            options: ['يكتب الكود على طول', 'يفهم المشكلة كويس', 'يحمّل برنامج جديد', 'يشوف حد حلها'],
            answer: 1, why: 'من غير فهم المشكلة هتكتب كود غلط. الفهم أول خطوة.' }
        ]
      }
    }
  ]
};
