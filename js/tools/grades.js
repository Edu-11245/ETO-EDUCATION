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
