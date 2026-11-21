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
