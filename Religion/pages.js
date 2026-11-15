/* =====================================================================
   قايمة صفحات الركن الديني
   علشان تضيف صفحة جديدة:
   1) اعمل فولدر جديد جوا Religion (مثلاً: azkar) وحط فيه index.html و cover.svg (أو cover.jpg)
   2) ضيف سطر جديد هنا في القايمة — ومش هتلمس index.html ولا main.js تاني
   ===================================================================== */
window.ETO_RELIGION_PAGES = [
  {
    id: 'prayer-times',
    folder: 'prayer-times',
    cover: 'cover.svg',
    title: 'مواقيت الصلاة وسجل اليوم',
    desc: 'مواعيد الصلاة بالدقيقة حسب مدينتك، سجّل كل صلاة صليتها طول اليوم، وفي الآخر اطبع جدول يومك بشكل شيك.',
    gradient: 'linear-gradient(135deg,#064e3b,#059669 70%,#0d9488)'
  }
  // مثال لصفحة جاية:
  // { id:'azkar', folder:'azkar', cover:'cover.svg', title:'أذكار الصباح والمساء', desc:'...', gradient:'linear-gradient(135deg,#1e3a8a,#3b82f6)' }
];
