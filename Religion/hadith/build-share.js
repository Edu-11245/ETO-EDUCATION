/* يبني لكل حديث: share/<id>/index.html (OG meta + تحويل للسايت) و share/<id>/preview.png (1200x630)
   تشغيل عادي (من غير متصفح):  node build-share.js https://YOUR-DOMAIN/Data/Hadith/
   لإعادة رسم الصور (محتاج playwright):  node build-share.js https://YOUR-DOMAIN/Data/Hadith/ --png */
const fs=require('fs'),path=require('path'),vm=require('vm');
const BASE=(process.argv[2]||'https://example.com/Data/Hadith/').replace(/\/?$/,'/');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'ahadith.js'),'utf8'),ctx);
const L=ctx.window.ETO_HADITH;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const card=h=>`<!doctype html><meta charset=utf-8><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;font-family:'Amiri','Noto Naskh Arabic','DejaVu Sans',serif;color:#fff;direction:rtl;background:${h.g};position:relative}
.pat{position:absolute;inset:0;opacity:.12;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23fff' stroke-width='2'%3E%3Crect x='15' y='15' width='30' height='30'/%3E%3Crect x='15' y='15' width='30' height='30' transform='rotate(45 30 30)'/%3E%3C/g%3E%3C/svg%3E")}
.frame{position:absolute;inset:22px;border:3px solid #fde68a;border-radius:34px}.frame:after{content:"";position:absolute;inset:10px;border:1.5px solid rgba(253,230,138,.5);border-radius:26px}
.glow{position:absolute;left:50%;top:230px;width:760px;height:760px;margin:-380px 0 0 -380px;background:radial-gradient(circle,rgba(253,230,138,.38),transparent 65%)}
.site{position:absolute;top:56px;width:100%;text-align:center;font-size:40px;font-weight:700;color:#fde68a}
.no{position:absolute;left:50%;top:120px;margin-left:-62px;width:124px;height:124px;border-radius:50%;background:#fde68a;color:#052e2b;border:6px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-weight:700;text-align:center;flex-direction:column}
.no small{font-size:20px;display:block}.no b{font-size:58px;line-height:1}
.t{position:absolute;top:268px;width:100%;text-align:center;font-size:104px;font-weight:700;line-height:1.25;text-shadow:0 6px 24px rgba(0,0,0,.4)}
.n{position:absolute;top:410px;width:100%;text-align:center;font-size:46px;font-weight:700;color:#fde68a}
.b{position:absolute;bottom:62px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.28);border:2px solid rgba(253,230,138,.7);border-radius:99px;padding:10px 40px;font-size:34px;white-space:nowrap}
</style><div class=pat></div><div class=glow></div><div class=frame></div>
<div class=site>✦ نور الحديث · Eto.Edu ✦</div>
<div class=no><small>حديث رقم</small><b>${h.no}</b></div>
<div class=t>${esc(h.title)}</div><div class=n>${esc(h.who)}</div>
<div class=b>${esc(h.book)}</div>`;
const page=h=>{const url=BASE+'share/'+encodeURIComponent(h.id)+'/',img=url+'preview.png',
 t=`حديث رقم ${h.no}: ${h.title} | نور الحديث`,d=`${h.book} — ${h.desc}`,go=BASE+'index.html?standalone#'+encodeURIComponent(h.id);
 return `<!doctype html><html lang=ar dir=rtl><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>${esc(t)}</title><meta name=description content="${esc(d)}">
<meta property=og:type content=article><meta property=og:site_name content="Eto.Edu — نور الحديث"><meta property=og:locale content=ar_AR>
<meta property=og:title content="${esc(t)}"><meta property=og:description content="${esc(d)}"><meta property=og:url content="${url}">
<meta property=og:image content="${img}"><meta property=og:image:width content=1200><meta property=og:image:height content=630>
<meta name=twitter:card content=summary_large_image><meta name=twitter:title content="${esc(t)}"><meta name=twitter:description content="${esc(d)}"><meta name=twitter:image content="${img}">
<meta http-equiv=refresh content="0;url=${go}"><script>location.replace(${JSON.stringify(go)})</script></head>
<body style="font-family:sans-serif;text-align:center;padding:40px"><a href="${go}">افتح ${esc(h.title)}</a></body></html>`};
(async()=>{const force=process.argv.includes('--png');let b,p;
for(const h of L){const dir=path.join(__dirname,'share',h.id),png=path.join(dir,'preview.png');fs.mkdirSync(dir,{recursive:true});
 if(force||!fs.existsSync(png)){if(!b){const {chromium}=require('playwright');b=await chromium.launch();p=await b.newPage({viewport:{width:1200,height:630}})}
  await p.setContent(card(h));await p.screenshot({path:png})}
 fs.writeFileSync(path.join(dir,'index.html'),page(h));console.log('✓',h.id,'(حديث رقم '+h.no+')')}
if(b)await b.close()})();
