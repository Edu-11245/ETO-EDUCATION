/* =====================================================================
   ETO.Edu  |  PowerPoint <-> PDF
   - PPTX -> PDF : قارئ PPTX مكتوب من الصفر (بدون سيرفر) بيرسم السلايدات
                   بنفس الخطوط والألوان والأشكال والصور والجداول والرسومات البيانية
   - PDF -> PPTX : كل صفحة بتتحول لسلايد بنفس مقاس الصفحة
   كل حاجة بتحصل على جهاز المستخدم.
   ===================================================================== */
(function () {
'use strict';
if (window.__etoPptPdf) return;
window.__etoPptPdf = true;

const $ = id => document.getElementById(id);
const PX = 1 / 9525;            // EMU -> px (96dpi)
const PT = 96 / 72;             // pt  -> px
const NS_R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
let uid = 0;
const nextId = p => (p || 'pp') + (++uid);

/* ------------------------------ XML helpers ------------------------------ */
const kids = (el, n) => el ? Array.from(el.children).filter(c => c.localName === n) : [];
const kid = (el, n) => el ? (Array.from(el.children).find(c => c.localName === n) || null) : null;
const dig = (el, ...names) => { let c = el; for (const n of names) { c = kid(c, n); if (!c) return null; } return c; };
const attr = (el, n, d) => (el && el.hasAttribute(n)) ? el.getAttribute(n) : d;
const numAttr = (el, n, d) => { const v = attr(el, n); if (v == null || v === '') return d; const f = parseFloat(v); return isNaN(f) ? d : f; };
const relId = (el, n) => el ? (el.getAttributeNS(NS_R, n || 'id') || el.getAttribute('r:' + (n || 'id'))) : null;
const findAll = (root, n) => root ? Array.from(root.getElementsByTagNameNS('*', n)) : [];
const findOne = (root, n) => root ? (root.getElementsByTagNameNS('*', n)[0] || null) : null;
const parseXml = txt => new DOMParser().parseFromString(txt, 'application/xml');

/* ------------------------------ ZIP reader ------------------------------ */
async function readZip(buf) {
  const u8 = new Uint8Array(buf), dv = new DataView(buf), dec = new TextDecoder();
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65600); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('NOT_ZIP');
  const count = dv.getUint16(eocd + 10, true);
  let off = dv.getUint32(eocd + 16, true);
  const files = new Map();
  for (let n = 0; n < count; n++) {
    if (dv.getUint32(off, true) !== 0x02014b50) break;
    const method = dv.getUint16(off + 10, true), csize = dv.getUint32(off + 20, true);
    const nlen = dv.getUint16(off + 28, true), elen = dv.getUint16(off + 30, true), clen = dv.getUint16(off + 32, true);
    const lho = dv.getUint32(off + 42, true);
    const name = dec.decode(u8.subarray(off + 46, off + 46 + nlen));
    files.set(name, { method, csize, lho });
    off += 46 + nlen + elen + clen;
  }
  const cache = new Map();
  async function get(name) {
    const f = files.get(name);
    if (!f) return null;
    const lnlen = dv.getUint16(f.lho + 26, true), lelen = dv.getUint16(f.lho + 28, true);
    const start = f.lho + 30 + lnlen + lelen;
    const data = u8.subarray(start, start + f.csize);
    if (f.method === 0) return data.slice();
    if (f.method === 8) {
      if (typeof DecompressionStream !== 'undefined') {
        const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return new Uint8Array(await new Response(stream).arrayBuffer());
      }
      throw new Error('NO_INFLATE');
    }
    throw new Error('BAD_METHOD');
  }
  return {
    has: n => files.has(n),
    names: () => Array.from(files.keys()),
    bytes: get,
    async xml(n) {
      if (cache.has(n)) return cache.get(n);
      const d = await get(n);
      const doc = d ? parseXml(dec.decode(d)) : null;
      cache.set(n, doc);
      return doc;
    },
    // قراءة نص خام (أول max حرف) من غير parse ومن غير كاش — للفحص الخفيف
    async text(n, max) { const d = await get(n); return d ? dec.decode(max ? d.subarray(0, max) : d) : null; },
    drop(n) { cache.delete(n); }
  };
}
// لو المتصفح قديم ومعندوش DecompressionStream بنستخدم JSZip لو موجودة
async function openPackage(buf) {
  if (typeof DecompressionStream === 'undefined' && window.JSZip) {
    const z = await window.JSZip.loadAsync(buf), cache = new Map(), dec = new TextDecoder();
    return {
      has: n => !!z.file(n), names: () => Object.keys(z.files),
      bytes: async n => { const f = z.file(n); return f ? new Uint8Array(await f.async('uint8array')) : null; },
      async xml(n) { if (cache.has(n)) return cache.get(n); const f = z.file(n); const d = f ? parseXml(await f.async('string')) : null; cache.set(n, d); return d; },
      text: async (n, max) => { const f = z.file(n); if (!f) return null; const t = await f.async('string'); return max ? t.slice(0, max) : t; },
      drop: n => cache.delete(n)
    };
  }
  return readZip(buf);
}

function resolvePath(base, target) {
  if (!target) return null;
  if (/^[a-z]+:/i.test(target)) return null;
  if (target.startsWith('/')) return target.slice(1);
  const parts = base.split('/'); parts.pop();
  for (const seg of target.split('/')) {
    if (seg === '..') parts.pop(); else if (seg !== '.' && seg !== '') parts.push(seg);
  }
  return parts.join('/');
}
async function readRels(pkg, partPath) {
  const dir = partPath.substring(0, partPath.lastIndexOf('/') + 1);
  const name = partPath.substring(partPath.lastIndexOf('/') + 1);
  const doc = await pkg.xml(dir + '_rels/' + name + '.rels');
  const map = {};
  if (doc) findAll(doc, 'Relationship').forEach(r => {
    const mode = r.getAttribute('TargetMode');
    map[r.getAttribute('Id')] = {
      type: (r.getAttribute('Type') || '').split('/').pop(),
      target: mode === 'External' ? r.getAttribute('Target') : resolvePath(partPath, r.getAttribute('Target')),
      external: mode === 'External'
    };
  });
  return map;
}

/* ------------------------------ Colors ------------------------------ */
const PRST = { black: '000000', white: 'ffffff', red: 'ff0000', green: '008000', blue: '0000ff', yellow: 'ffff00', gray: '808080', grey: '808080', orange: 'ffa500', purple: '800080', pink: 'ffc0cb', brown: 'a52a2a', cyan: '00ffff', magenta: 'ff00ff', darkBlue: '00008b', darkRed: '8b0000', darkGreen: '006400', lightGray: 'd3d3d3', dkGray: 'a9a9a9', ltGray: 'd3d3d3' };
const hex2rgb = h => { h = (h || '000000').replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return { r: parseInt(h.substr(0, 2), 16) || 0, g: parseInt(h.substr(2, 2), 16) || 0, b: parseInt(h.substr(4, 2), 16) || 0, a: 1 }; };
function rgb2hsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6;
  }
  return { h, s, l };
}
function hsl2rgb({ h, s, l }) {
  const f = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < .5) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  return { r: Math.round(f(p, q, h + 1 / 3) * 255), g: Math.round(f(p, q, h) * 255), b: Math.round(f(p, q, h - 1 / 3) * 255) };
}
function cssColor(c) {
  if (!c) return 'transparent';
  const a = c.a == null ? 1 : c.a;
  return a >= 0.999 ? `rgb(${c.r},${c.g},${c.b})` : `rgba(${c.r},${c.g},${c.b},${+a.toFixed(3)})`;
}
const COLOR_TAGS = ['srgbClr', 'schemeClr', 'sysClr', 'prstClr', 'hslClr', 'scrgbClr'];
function colorChild(parent) { return parent ? Array.from(parent.children).find(c => COLOR_TAGS.includes(c.localName)) || null : null; }

function resolveColor(el, ctx) {
  if (!el) return null;
  let c;
  switch (el.localName) {
    case 'srgbClr': c = hex2rgb(attr(el, 'val', '000000')); break;
    case 'sysClr': c = hex2rgb(attr(el, 'lastClr', attr(el, 'val') === 'window' ? 'ffffff' : '000000')); break;
    case 'prstClr': c = hex2rgb(PRST[attr(el, 'val')] || '000000'); break;
    case 'scrgbClr': c = { r: Math.round(numAttr(el, 'r', 0) / 1000 * 2.55), g: Math.round(numAttr(el, 'g', 0) / 1000 * 2.55), b: Math.round(numAttr(el, 'b', 0) / 1000 * 2.55), a: 1 }; break;
    case 'hslClr': c = Object.assign(hsl2rgb({ h: numAttr(el, 'hue', 0) / 21600000, s: numAttr(el, 'sat', 0) / 100000, l: numAttr(el, 'lum', 0) / 100000 }), { a: 1 }); break;
    case 'schemeClr': {
      const v = attr(el, 'val', 'tx1');
      if (v === 'phClr') c = ctx && ctx.phClr ? Object.assign({}, ctx.phClr) : hex2rgb('000000');
      else {
        const mapped = (ctx && ctx.clrMap && ctx.clrMap[v]) || v;
        const th = ctx && ctx.theme && ctx.theme.colors[mapped];
        c = th ? Object.assign({}, th) : hex2rgb(mapped === 'lt1' ? 'ffffff' : '000000');
      }
      break;
    }
    default: c = hex2rgb('000000');
  }
  c.a = c.a == null ? 1 : c.a;
  for (const t of Array.from(el.children)) {
    const v = numAttr(t, 'val', 0);
    switch (t.localName) {
      case 'alpha': c.a = v / 100000; break;
      case 'lumMod': case 'lumOff': case 'satMod': case 'satOff': case 'hueOff': case 'hueMod': {
        const hsl = rgb2hsl(c);
        if (t.localName === 'lumMod') hsl.l *= v / 100000;
        if (t.localName === 'lumOff') hsl.l += v / 100000;
        if (t.localName === 'satMod') hsl.s *= v / 100000;
        if (t.localName === 'satOff') hsl.s += v / 100000;
        if (t.localName === 'hueOff') hsl.h = (hsl.h + v / 21600000 + 1) % 1;
        if (t.localName === 'hueMod') hsl.h = (hsl.h * v / 100000) % 1;
        hsl.l = clamp(hsl.l, 0, 1); hsl.s = clamp(hsl.s, 0, 1);
        const n = hsl2rgb(hsl); c.r = n.r; c.g = n.g; c.b = n.b; break;
      }
      case 'tint': { const k = v / 100000; c.r = Math.round(c.r * k + 255 * (1 - k)); c.g = Math.round(c.g * k + 255 * (1 - k)); c.b = Math.round(c.b * k + 255 * (1 - k)); break; }
      case 'shade': { const k = v / 100000; c.r = Math.round(c.r * k); c.g = Math.round(c.g * k); c.b = Math.round(c.b * k); break; }
      case 'comp': { const hsl = rgb2hsl(c); hsl.h = (hsl.h + .5) % 1; const n = hsl2rgb(hsl); c.r = n.r; c.g = n.g; c.b = n.b; break; }
      case 'inv': c.r = 255 - c.r; c.g = 255 - c.g; c.b = 255 - c.b; break;
      case 'gray': { const g = Math.round(.299 * c.r + .587 * c.g + .114 * c.b); c.r = c.g = c.b = g; break; }
    }
  }
  return c;
}

/* ------------------------------ Theme ------------------------------ */
function parseTheme(doc) {
  const th = { colors: {}, fonts: { major: {}, minor: {} }, fill: [], bgFill: [], ln: [] };
  if (!doc) return th;
  const cs = findOne(doc, 'clrScheme');
  if (cs) Array.from(cs.children).forEach(c => {
    const inner = c.firstElementChild;
    if (!inner) return;
    th.colors[c.localName] = inner.localName === 'sysClr' ? hex2rgb(attr(inner, 'lastClr', '000000')) : hex2rgb(attr(inner, 'val', '000000'));
  });
  const fs = findOne(doc, 'fontScheme');
  if (fs) ['major', 'minor'].forEach(k => {
    const f = kid(fs, k + 'Font');
    th.fonts[k] = { latin: attr(kid(f, 'latin'), 'typeface'), ea: attr(kid(f, 'ea'), 'typeface'), cs: attr(kid(f, 'cs'), 'typeface') };
  });
  const fm = findOne(doc, 'fmtScheme');
  if (fm) {
    th.fill = kid(fm, 'fillStyleLst') ? Array.from(kid(fm, 'fillStyleLst').children) : [];
    th.bgFill = kid(fm, 'bgFillStyleLst') ? Array.from(kid(fm, 'bgFillStyleLst').children) : [];
    th.ln = kid(fm, 'lnStyleLst') ? Array.from(kid(fm, 'lnStyleLst').children) : [];
  }
  return th;
}

/* ------------------------------ Fills ------------------------------ */
// بيرجع: {type:'none'|'solid'|'grad'|'blip'} أو null لو مفيش تحديد
function readFill(parent, ctx) {
  if (!parent) return null;
  for (const ch of Array.from(parent.children)) {
    switch (ch.localName) {
      case 'noFill': return { type: 'none' };
      case 'solidFill': return { type: 'solid', color: resolveColor(colorChild(ch), ctx) };
      case 'gradFill': {
        const stops = kids(dig(ch, 'gsLst'), 'gs').map(gs => ({ pos: numAttr(gs, 'pos', 0) / 100000, color: resolveColor(colorChild(gs), ctx) }));
        const lin = kid(ch, 'lin'), path = kid(ch, 'path');
        return { type: 'grad', stops, angle: lin ? numAttr(lin, 'ang', 0) / 60000 : 90, path: path ? attr(path, 'path', 'circle') : null };
      }
      case 'blipFill': {
        const blip = kid(ch, 'blip');
        return { type: 'blip', rid: relId(blip, 'embed'), tile: !!kid(ch, 'tile'), src: kid(ch, 'srcRect'), alpha: numAttr(findOne(blip, 'alphaModFix'), 'amt', 100000) / 100000 };
      }
      case 'pattFill': return { type: 'solid', color: resolveColor(colorChild(kid(ch, 'fgClr')), ctx), patt: true };
      case 'grpFill': return { type: 'group' };
    }
  }
  return null;
}
// ستايل مرجعي (fillRef) من الثيم
function themeFill(idx, color, ctx, isBg) {
  const lst = isBg ? ctx.theme.bgFill : ctx.theme.fill;
  const i = isBg ? idx - 1001 : idx - 1;
  const el = lst[i];
  if (!el) return color ? { type: 'solid', color } : null;
  const c2 = Object.assign({}, ctx, { phClr: color });
  const holder = document.createElementNS('urn:x', 'h'); holder.appendChild(el.cloneNode(true));
  const f = readFill(holder, c2);
  return f;
}

/* ------------------------------ Text property bags ------------------------------ */
const BU_KEYS = ['buNone', 'buChar', 'buAutoNum', 'buBlip'];
function readRPr(el, ctx) {
  const b = {};
  if (!el) return b;
  if (el.hasAttribute('sz')) b.sz = numAttr(el, 'sz', 1800) / 100;
  if (el.hasAttribute('b')) b.b = /^(1|true)$/.test(attr(el, 'b'));
  if (el.hasAttribute('i')) b.i = /^(1|true)$/.test(attr(el, 'i'));
  if (el.hasAttribute('u')) b.u = attr(el, 'u') !== 'none';
  if (el.hasAttribute('strike')) b.strike = attr(el, 'strike') !== 'noStrike';
  if (el.hasAttribute('baseline')) b.baseline = numAttr(el, 'baseline', 0);
  if (el.hasAttribute('cap')) b.cap = attr(el, 'cap');
  if (el.hasAttribute('spc')) b.spc = numAttr(el, 'spc', 0) / 100;
  const f = readFill(el, ctx);
  if (f && f.type === 'solid') b.color = f.color;
  else if (f && f.type === 'grad' && f.stops[0]) b.color = f.stops[0].color;
  const l = kid(el, 'latin'), e = kid(el, 'ea'), c = kid(el, 'cs');
  if (l) b.latin = attr(l, 'typeface'); if (e) b.ea = attr(e, 'typeface'); if (c) b.cs = attr(c, 'typeface');
  const hl = kid(el, 'highlight'); if (hl) b.highlight = resolveColor(colorChild(hl), ctx);
  if (kid(el, 'hlinkClick')) b.hlink = true;
  return b;
}
function readSpc(el) {
  if (!el) return undefined;
  const p = kid(el, 'spcPct'), s = kid(el, 'spcPts');
  if (p) return { pct: numAttr(p, 'val', 100000) / 100000 };
  if (s) return { pts: numAttr(s, 'val', 0) / 100 };
  return undefined;
}
function readPPr(el, ctx) {
  const b = {};
  if (!el) return b;
  ['algn', 'rtl'].forEach(k => { if (el.hasAttribute(k)) b[k] = attr(el, k); });
  ['marL', 'marR', 'indent'].forEach(k => { if (el.hasAttribute(k)) b[k] = numAttr(el, k, 0); });
  const ln = readSpc(kid(el, 'lnSpc')), sb = readSpc(kid(el, 'spcBef')), sa = readSpc(kid(el, 'spcAft'));
  if (ln) b.lnSpc = ln; if (sb) b.spcBef = sb; if (sa) b.spcAft = sa;
  if (kid(el, 'buNone')) b.buNone = true;
  const bc = kid(el, 'buChar'); if (bc) b.buChar = attr(bc, 'char', '•');
  const ba = kid(el, 'buAutoNum'); if (ba) b.buAutoNum = { type: attr(ba, 'type', 'arabicPeriod'), startAt: numAttr(ba, 'startAt', 1) };
  if (kid(el, 'buBlip')) b.buChar = '•';
  const bf = kid(el, 'buFont'); if (bf) b.buFont = attr(bf, 'typeface');
  const bcl = kid(el, 'buClr'); if (bcl) b.buClr = resolveColor(colorChild(bcl), ctx);
  const bsz = kid(el, 'buSzPct'); if (bsz) b.buSzPct = numAttr(bsz, 'val', 100000) / 100000;
  const d = kid(el, 'defRPr'); if (d) b.defRPr = readRPr(d, ctx);
  return b;
}
function mergeP(a, b) {
  if (!a) return Object.assign({}, b);
  if (!b) return Object.assign({}, a);
  const out = Object.assign({}, a);
  if (BU_KEYS.some(k => k in b)) BU_KEYS.forEach(k => delete out[k]);
  Object.keys(b).forEach(k => { if (k !== 'defRPr') out[k] = b[k]; });
  out.defRPr = Object.assign({}, a.defRPr || {}, b.defRPr || {});
  return out;
}
// lstStyle أو txStyles/titleStyle ... => مصفوفة [lvl0..lvl8]
function readListStyle(el, ctx) {
  const out = new Array(9).fill(null);
  if (!el) return out;
  const def = kid(el, 'defPPr');
  for (let i = 0; i < 9; i++) {
    const l = kid(el, 'lvl' + (i + 1) + 'pPr');
    if (l || def) out[i] = mergeP(def ? readPPr(def, ctx) : null, l ? readPPr(l, ctx) : null);
  }
  return out;
}

/* ------------------------------ Fonts ------------------------------ */
const SERIF_RE = /times|georgia|garamond|cambria|palatino|book antiqua|bookman|century|minion|serif(?!.*sans)|naskh|amiri|traditional arabic|simplified arabic|scheherazade|noto naskh/i;
const MONO_RE = /courier|consolas|mono|lucida console|menlo/i;
function fontStack(run, ctx, kindAr) {
  const th = ctx.theme.fonts;
  const resolve = f => {
    if (!f) return null;
    if (f === '+mj-lt') return th.major.latin; if (f === '+mn-lt') return th.minor.latin;
    if (f === '+mj-ea') return th.major.ea; if (f === '+mn-ea') return th.minor.ea;
    if (f === '+mj-cs') return th.major.cs; if (f === '+mn-cs') return th.minor.cs;
    return f;
  };
  const names = [];
  const push = f => { f = resolve(f); if (f && !names.includes(f)) names.push(f); };
  if (kindAr) { push(run.cs); push(run.latin); } else { push(run.latin); push(run.cs); }
  push(run.ea);
  if (!names.length) push(th.minor.latin || 'Calibri');
  const first = names[0] || '';
  const generic = MONO_RE.test(first) ? 'monospace' : SERIF_RE.test(first) ? 'serif' : 'sans-serif';
  const mapped = names.map(n => {
    const q = "'" + n.replace(/['"]/g, '') + "'";
    if (/^calibri$/i.test(n)) return q + ",'Carlito'";
    if (/^cambria$/i.test(n)) return q + ",'Caladea'";
    if (/^arial$/i.test(n)) return q + ",'Liberation Sans','Helvetica'";
    if (/^times new roman$/i.test(n)) return q + ",'Liberation Serif','Times'";
    if (/^courier new$/i.test(n)) return q + ",'Liberation Mono'";
    return q;
  });
  const arFallback = generic === 'serif' ? "'Amiri','Cairo'" : "'Cairo','Tajawal'";
  return mapped.join(',') + ',' + arFallback + ',' + generic;
}
const AR_RE = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

/* ------------------------------ Numbering ------------------------------ */
function toRoman(n) { const m = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; m.forEach(([v, r]) => { while (n >= v) { s += r; n -= v; } }); return s; }
function toAlpha(n) { let s = ''; while (n > 0) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; }
function formatAutoNum(type, n) {
  const t = type || 'arabicPeriod';
  let core;
  if (/^roman/.test(t)) core = toRoman(n); else if (/^alpha/.test(t)) core = toAlpha(n); else core = String(n);
  if (/^(roman|alpha)Lc/.test(t)) core = core.toLowerCase();
  if (/ParenBoth$/.test(t)) return '(' + core + ')';
  if (/ParenR$/.test(t)) return core + ')';
  if (/Plain$/.test(t)) return core;
  return core + '.';
}

/* ------------------------------ Text body -> DOM ------------------------------ */
function spacingPx(sp, fontPx) {
  if (!sp) return 0;
  if (sp.pts != null) return sp.pts * PT;
  if (sp.pct != null) return sp.pct * fontPx * 1.2;
  return 0;
}
// opts: {chain:[listStyle...], bodyPr:{...}, ctx, defColor, slideNo, isFirstFit}
function buildTextBox(txBody, w, h, opts) {
  const ctx = opts.ctx;
  const bp = opts.bodyPr || {};
  const box = document.createElement('div');
  box.className = 'pp-text';
  const lIns = numAttr(bp.el, 'lIns', 91440) * PX, rIns = numAttr(bp.el, 'rIns', 91440) * PX;
  const tIns = numAttr(bp.el, 'tIns', 45720) * PX, bIns = numAttr(bp.el, 'bIns', 45720) * PX;
  const anchor = attr(bp.el, 'anchor', 't');
  const wrapNone = attr(bp.el, 'wrap', 'square') === 'none';
  const vert = attr(bp.el, 'vert', 'horz');
  let bw = w, bh = h, tf = '';
  if (vert === 'vert' || vert === 'eaVert') { bw = h; bh = w; tf = `left:${w}px;top:0;transform-origin:0 0;transform:rotate(90deg);`; }
  else if (vert === 'vert270') { bw = h; bh = w; tf = `left:0;top:${h}px;transform-origin:0 0;transform:rotate(-90deg);`; }
  const just = anchor === 'ctr' ? 'center' : anchor === 'b' ? 'flex-end' : 'flex-start';
  if (opts.inline) box.style.cssText = 'display:block;';
  else box.style.cssText = `position:absolute;${tf || `left:${opts.ox || 0}px;top:${opts.oy || 0}px;`}width:${bw}px;height:${bh}px;box-sizing:border-box;padding:${tIns}px ${rIns}px ${bIns}px ${lIns}px;display:flex;flex-direction:column;justify-content:${just};overflow:visible;`;
  const fontScale = bp.fontScale || 1;
  const lnRed = bp.lnSpcReduction || 0;
  box.style.setProperty('--fs', fontScale);
  if (bp.autofit) box.setAttribute('data-autofit', '1');

  const counters = new Array(9).fill(0);
  let prevAuto = new Array(9).fill(false);
  let first = true;
  const paras = kids(txBody, 'p');
  paras.forEach(p => {
    const pPrEl = kid(p, 'pPr');
    const lvl = clamp(numAttr(pPrEl, 'lvl', 0), 0, 8);
    let bag = null;
    (opts.chain || []).forEach(ls => { const l = ls && ls[lvl]; if (l) bag = mergeP(bag, l); });
    bag = mergeP(bag, readPPr(pPrEl, ctx)) || {};
    const defR = bag.defRPr || {};
    const rtl = bag.rtl === '1' || bag.rtl === 'true';
    const algn = bag.algn || (rtl ? 'r' : 'l');
    const textAlign = { l: 'left', r: 'right', ctr: 'center', just: 'justify', justLow: 'justify', dist: 'justify', thaiDist: 'justify' }[algn] || 'left';
    const endRPr = readRPr(kid(p, 'endParaRPr'), ctx);
    const baseSz = (endRPr.sz || defR.sz || 18);
    const basePx = baseSz * PT;

    // runs
    let html = '';
    let hasText = false, firstRunStyle = null, firstRunPx = basePx;
    const kidsEls = Array.from(p.children);
    kidsEls.forEach(r => {
      const name = r.localName;
      if (name === 'br') { html += '<br>'; return; }
      if (name !== 'r' && name !== 'fld') return;
      let text = (kid(r, 't') ? kid(r, 't').textContent : '');
      if (name === 'fld' && /slidenum/i.test(attr(r, 'type', ''))) text = String(opts.slideNo || '');
      if (text === '') return;
      const rb = Object.assign({}, defR, readRPr(kid(r, 'rPr'), ctx));
      const hl = kid(kid(r, 'rPr'), 'hlinkClick');
      let href = null;
      if (hl) { const rid = relId(hl); const rel = rid && opts.rels && opts.rels[rid]; href = rel ? rel.target : null; }
      const sz = (rb.sz || 18) * (rb.baseline ? 0.7 : 1);
      const px = sz * PT;
      const isAr = AR_RE.test(text);
      let color = rb.color || opts.defColor || { r: 0, g: 0, b: 0, a: 1 };
      let deco = [];
      if (rb.u || href) deco.push('underline'); if (rb.strike) deco.push('line-through');
      if (href && !rb.color) { const hc = ctx.theme.colors.hlink; if (hc) color = hc; }
      let st = `font-family:${fontStack(rb, ctx, isAr)};font-size:calc(${px.toFixed(2)}px * var(--fs,1));color:${cssColor(color)};`;
      if (rb.b) st += 'font-weight:700;'; if (rb.i) st += 'font-style:italic;';
      if (deco.length) st += `text-decoration:${deco.join(' ')};`;
      if (rb.baseline) st += `vertical-align:${rb.baseline > 0 ? 'super' : 'sub'};`;
      if (rb.cap === 'all') st += 'text-transform:uppercase;'; else if (rb.cap === 'small') st += 'font-variant:small-caps;';
      if (rb.spc) st += `letter-spacing:${(rb.spc * PT).toFixed(2)}px;`;
      if (rb.highlight) st += `background:${cssColor(rb.highlight)};`;
      if (!hasText) { firstRunStyle = rb; firstRunPx = px; }
      hasText = true;
      html += `<span style="${st}"${href ? ` data-href="${esc(href)}"` : ''}>${esc(text)}</span>`;
    });

    // bullet
    let bullet = '';
    const marL = (bag.marL || 0) * PX, indent = (bag.indent || 0) * PX;
    let showBullet = hasText && !bag.buNone && (bag.buChar || bag.buAutoNum);
    if (showBullet) {
      let sym = bag.buChar;
      if (bag.buAutoNum) {
        counters[lvl] = prevAuto[lvl] ? counters[lvl] + 1 : (bag.buAutoNum.startAt || 1);
        sym = formatAutoNum(bag.buAutoNum.type, counters[lvl]);
        prevAuto[lvl] = true;
      } else prevAuto[lvl] = false;
      for (let k = lvl + 1; k < 9; k++) { prevAuto[k] = false; counters[k] = 0; }
      const rb = Object.assign({}, defR, firstRunStyle || {});
      const bcol = bag.buClr || rb.color || opts.defColor || { r: 0, g: 0, b: 0, a: 1 };
      const bsz = (bag.buSzPct || 1) * firstRunPx;
      let bfont = bag.buFont ? `'${bag.buFont.replace(/['"]/g, '')}',` : '';
      if (/^(wingdings|symbol)/i.test(bag.buFont || '')) { sym = '•'; bfont = ''; }
      const bwidth = indent < 0 ? -indent : 0;
      bullet = `<span style="display:inline-block;${bwidth ? `width:${bwidth}px;` : 'margin-inline-end:.35em;'}text-indent:0;white-space:nowrap;font-family:${bfont}${fontStack(rb, ctx, false)};font-size:calc(${bsz.toFixed(2)}px * var(--fs,1));color:${cssColor(bcol)}">${esc(sym)}</span>`;
    } else {
      if (hasText) prevAuto[lvl] = false;
      for (let k = lvl; k < 9; k++) { prevAuto[k] = false; counters[k] = 0; }
    }

    // spacing
    let lh = 1.2;
    if (bag.lnSpc) {
      if (bag.lnSpc.pct != null) lh = Math.max(0.5, bag.lnSpc.pct * 1.2 - lnRed);
      else if (bag.lnSpc.pts != null) lh = (bag.lnSpc.pts * PT) / basePx;
    } else lh = Math.max(0.6, 1.2 - lnRed);
    const mt = first ? 0 : spacingPx(bag.spcBef, firstRunPx);
    const mb = spacingPx(bag.spcAft, firstRunPx);
    const marR = (bag.marR || 0) * PX;
    const div = document.createElement('div');
    div.dir = rtl ? 'rtl' : 'ltr';
    let pst = `text-align:${textAlign};line-height:${lh.toFixed(3)};margin-top:calc(${mt.toFixed(2)}px * var(--fs,1));margin-bottom:calc(${mb.toFixed(2)}px * var(--fs,1));`;
    pst += `margin-inline-start:${marL}px;margin-inline-end:${marR}px;text-indent:${indent}px;`;
    pst += wrapNone ? 'white-space:pre;' : 'white-space:pre-wrap;overflow-wrap:break-word;';
    if (textAlign === 'justify') pst += 'text-align-last:auto;';
    div.style.cssText = pst;
    if (!hasText) {
      div.innerHTML = `<span style="font-size:calc(${basePx.toFixed(2)}px * var(--fs,1));line-height:${lh};">&#8203;</span>`;
    } else div.innerHTML = bullet + html;
    box.appendChild(div);
    first = false;
  });
  return box;
}
function hasRealText(txBody) {
  return !!txBody && findAll(txBody, 't').some(t => t.textContent.trim() !== '');
}

/* ------------------------------ Geometry presets ------------------------------ */
function adjMap(geom) {
  const m = {};
  kids(kid(geom, 'avLst'), 'gd').forEach(g => {
    const mm = /val\s+(-?\d+)/.exec(attr(g, 'fmla', '')); if (mm) m[attr(g, 'name')] = parseInt(mm[1], 10);
  });
  return m;
}
const f2 = n => (+n).toFixed(2);
function rrPath(w, h, tl, tr, br, bl) {
  return `M${f2(tl)} 0H${f2(w - tr)}${tr ? `A${f2(tr)} ${f2(tr)} 0 0 1 ${f2(w)} ${f2(tr)}` : ''}V${f2(h - br)}${br ? `A${f2(br)} ${f2(br)} 0 0 1 ${f2(w - br)} ${f2(h)}` : ''}H${f2(bl)}${bl ? `A${f2(bl)} ${f2(bl)} 0 0 1 0 ${f2(h - bl)}` : ''}V${f2(tl)}${tl ? `A${f2(tl)} ${f2(tl)} 0 0 1 ${f2(tl)} 0` : ''}Z`;
}
function ellipsePath(w, h, ox, oy) {
  ox = ox || 0; oy = oy || 0;
  return `M${f2(ox)} ${f2(oy + h / 2)}A${f2(w / 2)} ${f2(h / 2)} 0 1 1 ${f2(ox + w)} ${f2(oy + h / 2)}A${f2(w / 2)} ${f2(h / 2)} 0 1 1 ${f2(ox)} ${f2(oy + h / 2)}Z`;
}
function starPath(n, ratio, w, h) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? ratio : 1;
    d += (i ? 'L' : 'M') + f2(w / 2 + w / 2 * r * Math.cos(a)) + ' ' + f2(h / 2 + h / 2 * r * Math.sin(a));
  }
  return d + 'Z';
}
const poly = pts => 'M' + pts.map(p => f2(p[0]) + ' ' + f2(p[1])).join('L') + 'Z';

// بيرجع {paths:[{d, noFill, noStroke, evenodd}], line:boolean}
function presetPaths(prst, w, h, adj) {
  const ss = Math.min(w, h);
  const A = (k, d) => (adj[k] != null ? adj[k] : d);
  const P = (d, o) => Object.assign({ d }, o || {});
  switch (prst) {
    case 'rect': case 'flowChartProcess': case 'flowChartPredefinedProcess': case 'flowChartDocument': case 'flowChartManualInput': case 'flowChartInternalStorage':
      return { paths: [P(`M0 0H${f2(w)}V${f2(h)}H0Z`)] };
    case 'roundRect': case 'flowChartAlternateProcess': {
      const r = ss * A('adj', 16667) / 100000; return { paths: [P(rrPath(w, h, r, r, r, r))] };
    }
    case 'flowChartTerminator': { const r = ss / 2; return { paths: [P(rrPath(w, h, r, r, r, r))] }; }
    case 'round2SameRect': {
      const a = ss * A('adj1', 16667) / 100000, b = ss * A('adj2', 0) / 100000; return { paths: [P(rrPath(w, h, a, a, b, b))] };
    }
    case 'round1Rect': { const a = ss * A('adj', 16667) / 100000; return { paths: [P(rrPath(w, h, 0, a, 0, 0))] }; }
    case 'round2DiagRect': { const a = ss * A('adj1', 16667) / 100000, b = ss * A('adj2', 0) / 100000; return { paths: [P(rrPath(w, h, a, b, a, b))] }; }
    case 'snip1Rect': { const a = ss * A('adj', 16667) / 100000; return { paths: [P(poly([[0, 0], [w - a, 0], [w, a], [w, h], [0, h]]))] }; }
    case 'snip2SameRect': { const a = ss * A('adj1', 16667) / 100000; return { paths: [P(poly([[a, 0], [w - a, 0], [w, a], [w, h], [0, h], [0, a]]))] }; }
    case 'ellipse': case 'flowChartConnector': case 'flowChartSummingJunction': return { paths: [P(ellipsePath(w, h))] };
    case 'triangle': case 'flowChartExtract': return { paths: [P(poly([[0, h], [w * A('adj', 50000) / 100000, 0], [w, h]]))] };
    case 'rtTriangle': return { paths: [P(poly([[0, 0], [0, h], [w, h]]))] };
    case 'diamond': case 'flowChartDecision': return { paths: [P(poly([[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2]]))] };
    case 'parallelogram': case 'flowChartData': { const o = ss * A('adj', 25000) / 100000; return { paths: [P(poly([[o, 0], [w, 0], [w - o, h], [0, h]]))] }; }
    case 'trapezoid': { const o = ss * A('adj', 25000) / 100000; return { paths: [P(poly([[0, h], [o, 0], [w - o, 0], [w, h]]))] }; }
    case 'pentagon': return { paths: [P(poly([[w / 2, 0], [w, h * .38], [w * .81, h], [w * .19, h], [0, h * .38]]))] };
    case 'hexagon': { const o = ss * A('adj', 25000) / 100000; return { paths: [P(poly([[0, h / 2], [o, 0], [w - o, 0], [w, h / 2], [w - o, h], [o, h]]))] }; }
    case 'octagon': { const o = ss * A('adj', 29289) / 100000; return { paths: [P(poly([[o, 0], [w - o, 0], [w, o], [w, h - o], [w - o, h], [o, h], [0, h - o], [0, o]]))] }; }
    case 'homePlate': { const x = w - ss * A('adj', 50000) / 100000; return { paths: [P(poly([[0, 0], [x, 0], [w, h / 2], [x, h], [0, h]]))] }; }
    case 'chevron': { const o = ss * A('adj', 50000) / 100000; return { paths: [P(poly([[0, 0], [w - o, 0], [w, h / 2], [w - o, h], [0, h], [o, h / 2]]))] }; }
    case 'rightArrow': case 'leftArrow': {
      const sh = h * A('adj1', 50000) / 200000, hl = ss * A('adj2', 50000) / 100000, x = w - hl, c = h / 2;
      const pts = [[0, c - sh], [x, c - sh], [x, 0], [w, c], [x, h], [x, c + sh], [0, c + sh]];
      return { paths: [P(poly(prst === 'leftArrow' ? pts.map(p => [w - p[0], p[1]]) : pts))] };
    }
    case 'upArrow': case 'downArrow': {
      const sw = w * A('adj1', 50000) / 200000, hl = ss * A('adj2', 50000) / 100000, y = h - hl, c = w / 2;
      const pts = [[c - sw, h], [c - sw, hl], [0, hl], [c, 0], [w, hl], [c + sw, hl], [c + sw, h]];
      return { paths: [P(poly(prst === 'downArrow' ? pts.map(p => [p[0], h - p[1]]) : pts))] };
    }
    case 'leftRightArrow': {
      const sh = h * A('adj1', 50000) / 200000, hl = ss * A('adj2', 50000) / 100000, c = h / 2;
      return { paths: [P(poly([[0, c], [hl, 0], [hl, c - sh], [w - hl, c - sh], [w - hl, 0], [w, c], [w - hl, h], [w - hl, c + sh], [hl, c + sh], [hl, h]]))] };
    }
    case 'plus': { const o = ss * A('adj', 25000) / 100000; return { paths: [P(poly([[o, 0], [w - o, 0], [w - o, o], [w, o], [w, h - o], [w - o, h - o], [w - o, h], [o, h], [o, h - o], [0, h - o], [0, o], [o, o]]))] }; }
    case 'star4': return { paths: [P(starPath(4, A('adj', 12500) / 50000, w, h))] };
    case 'star5': return { paths: [P(starPath(5, A('adj', 19098) / 50000, w, h))] };
    case 'star6': return { paths: [P(starPath(6, A('adj', 28868) / 50000, w, h))] };
    case 'star8': return { paths: [P(starPath(8, A('adj', 37500) / 50000, w, h))] };
    case 'star10': return { paths: [P(starPath(10, A('adj', 42533) / 50000, w, h))] };
    case 'star12': return { paths: [P(starPath(12, A('adj', 37500) / 50000, w, h))] };
    case 'heart': return { paths: [P(`M${f2(w / 2)} ${f2(h)}C${f2(-w * .15)} ${f2(h * .4)} ${f2(w * .1)} ${f2(-h * .2)} ${f2(w / 2)} ${f2(h * .25)}C${f2(w * .9)} ${f2(-h * .2)} ${f2(w * 1.15)} ${f2(h * .4)} ${f2(w / 2)} ${f2(h)}Z`)] };
    case 'cloud': return { paths: [P(`M${f2(w * .2)} ${f2(h * .8)}C${f2(-w * .05)} ${f2(h * .8)} ${f2(-w * .05)} ${f2(h * .45)} ${f2(w * .2)} ${f2(h * .45)}C${f2(w * .15)} ${f2(h * .15)} ${f2(w * .5)} ${f2(h * .1)} ${f2(w * .55)} ${f2(h * .3)}C${f2(w * .7)} ${f2(h * .05)} ${f2(w)} ${f2(h * .25)} ${f2(w * .85)} ${f2(h * .5)}C${f2(w * 1.1)} ${f2(h * .55)} ${f2(w * 1.05)} ${f2(h * .85)} ${f2(w * .8)} ${f2(h * .8)}Z`)] };
    case 'donut': {
      const t = ss * A('adj', 25000) / 100000;
      return { paths: [P(ellipsePath(w, h) + ellipsePath(w - 2 * t, h - 2 * t, t, t), { evenodd: true })] };
    }
    case 'can': {
      const ry = ss * A('adj', 25000) / 200000;
      return { paths: [P(`M0 ${f2(ry)}A${f2(w / 2)} ${f2(ry)} 0 0 1 ${f2(w)} ${f2(ry)}V${f2(h - ry)}A${f2(w / 2)} ${f2(ry)} 0 0 1 0 ${f2(h - ry)}Z`), P(`M0 ${f2(ry)}A${f2(w / 2)} ${f2(ry)} 0 0 0 ${f2(w)} ${f2(ry)}`, { noFill: true })] };
    }
    case 'wedgeRectCallout': case 'wedgeRoundRectCallout': case 'wedgeEllipseCallout': {
      const tx = w / 2 + w * A('adj1', -20833) / 100000, ty = h / 2 + h * A('adj2', 62500) / 100000;
      const base = prst === 'wedgeEllipseCallout' ? ellipsePath(w, h) : prst === 'wedgeRoundRectCallout' ? rrPath(w, h, ss * .1667, ss * .1667, ss * .1667, ss * .1667) : `M0 0H${f2(w)}V${f2(h)}H0Z`;
      const side = Math.abs(ty - h / 2) / h > Math.abs(tx - w / 2) / w;
      const tail = side ? poly([[w * .3, ty > h / 2 ? h : 0], [tx, ty], [w * .5, ty > h / 2 ? h : 0]]) : poly([[tx > w / 2 ? w : 0, h * .3], [tx, ty], [tx > w / 2 ? w : 0, h * .5]]);
      return { paths: [P(base + tail)] };
    }
    case 'leftBracket': return { paths: [P(`M${f2(w)} 0H${f2(w * .45)}Q0 0 0 ${f2(Math.min(w, h / 2))}V${f2(h - Math.min(w, h / 2))}Q0 ${f2(h)} ${f2(w * .45)} ${f2(h)}H${f2(w)}`, { noFill: true })], stroke: true };
    case 'rightBracket': return { paths: [P(`M0 0H${f2(w * .55)}Q${f2(w)} 0 ${f2(w)} ${f2(Math.min(w, h / 2))}V${f2(h - Math.min(w, h / 2))}Q${f2(w)} ${f2(h)} ${f2(w * .55)} ${f2(h)}H0`, { noFill: true })], stroke: true };
    case 'leftBrace': return { paths: [P(`M${f2(w)} 0Q${f2(w / 2)} 0 ${f2(w / 2)} ${f2(h * .25)}Q${f2(w / 2)} ${f2(h / 2)} 0 ${f2(h / 2)}Q${f2(w / 2)} ${f2(h / 2)} ${f2(w / 2)} ${f2(h * .75)}Q${f2(w / 2)} ${f2(h)} ${f2(w)} ${f2(h)}`, { noFill: true })], stroke: true };
    case 'rightBrace': return { paths: [P(`M0 0Q${f2(w / 2)} 0 ${f2(w / 2)} ${f2(h * .25)}Q${f2(w / 2)} ${f2(h / 2)} ${f2(w)} ${f2(h / 2)}Q${f2(w / 2)} ${f2(h / 2)} ${f2(w / 2)} ${f2(h * .75)}Q${f2(w / 2)} ${f2(h)} 0 ${f2(h)}`, { noFill: true })], stroke: true };
    case 'line': case 'straightConnector1': case 'lineInv':
      return { paths: [P(`M0 0L${f2(w)} ${f2(h)}`, { noFill: true })], line: true };
    case 'bentConnector2': return { paths: [P(`M0 0H${f2(w)}V${f2(h)}`, { noFill: true })], line: true };
    case 'bentConnector3': case 'bentConnector4': case 'bentConnector5': {
      const x = w * A('adj1', 50000) / 100000; return { paths: [P(`M0 0H${f2(x)}V${f2(h)}H${f2(w)}`, { noFill: true })], line: true };
    }
    case 'curvedConnector2': return { paths: [P(`M0 0C${f2(w / 2)} 0 ${f2(w)} ${f2(h / 2)} ${f2(w)} ${f2(h)}`, { noFill: true })], line: true };
    case 'curvedConnector3': case 'curvedConnector4': case 'curvedConnector5': {
      const x = w * A('adj1', 50000) / 100000; return { paths: [P(`M0 0C${f2(x)} 0 ${f2(x)} ${f2(h)} ${f2(w)} ${f2(h)}`, { noFill: true })], line: true };
    }
    case 'arc': case 'chord': case 'pie': return { paths: [P(ellipsePath(w, h), { noFill: true })], stroke: true };
    case 'blockArc': return { paths: [P(ellipsePath(w, h))] };
    default: return { paths: [P(`M0 0H${f2(w)}V${f2(h)}H0Z`)] };
  }
}

// custGeom -> مسارات
function custPaths(geom, w, h) {
  const out = [];
  kids(kid(geom, 'pathLst'), 'path').forEach(pe => {
    const pw = numAttr(pe, 'w', 0) || w, ph = numAttr(pe, 'h', 0) || h;
    const sx = w / pw, sy = h / ph;
    const pt = e => { const p = kid(e, 'pt'); return [numAttr(p, 'x', 0) * sx, numAttr(p, 'y', 0) * sy]; };
    let d = '', cur = [0, 0];
    Array.from(pe.children).forEach(c => {
      switch (c.localName) {
        case 'moveTo': { cur = pt(c); d += `M${f2(cur[0])} ${f2(cur[1])}`; break; }
        case 'lnTo': { cur = pt(c); d += `L${f2(cur[0])} ${f2(cur[1])}`; break; }
        case 'cubicBezTo': { const p = kids(c, 'pt').map(q => [numAttr(q, 'x', 0) * sx, numAttr(q, 'y', 0) * sy]); d += `C${p.map(q => f2(q[0]) + ' ' + f2(q[1])).join(' ')}`; cur = p[2]; break; }
        case 'quadBezTo': { const p = kids(c, 'pt').map(q => [numAttr(q, 'x', 0) * sx, numAttr(q, 'y', 0) * sy]); d += `Q${p.map(q => f2(q[0]) + ' ' + f2(q[1])).join(' ')}`; cur = p[1]; break; }
        case 'arcTo': {
          const wR = numAttr(c, 'wR', 0) * sx, hR = numAttr(c, 'hR', 0) * sy;
          const st = numAttr(c, 'stAng', 0) / 60000 * Math.PI / 180, sw = numAttr(c, 'swAng', 0) / 60000 * Math.PI / 180;
          const cx = cur[0] - wR * Math.cos(st), cy = cur[1] - hR * Math.sin(st);
          const ex = cx + wR * Math.cos(st + sw), ey = cy + hR * Math.sin(st + sw);
          d += `A${f2(wR)} ${f2(hR)} 0 ${Math.abs(sw) > Math.PI ? 1 : 0} ${sw > 0 ? 1 : 0} ${f2(ex)} ${f2(ey)}`; cur = [ex, ey]; break;
        }
        case 'close': d += 'Z'; break;
      }
    });
    out.push({ d, noFill: attr(pe, 'fill') === 'none', noStroke: attr(pe, 'stroke') === '0' || attr(pe, 'stroke') === 'false' });
  });
  return { paths: out };
}

/* ------------------------------ SVG paint helpers ------------------------------ */
const DASH = { dash: [4, 3], sysDash: [3, 1], dot: [1, 2], sysDot: [1, 1], lgDash: [8, 3], dashDot: [4, 3, 1, 3], sysDashDot: [3, 1, 1, 1], lgDashDot: [8, 3, 1, 3], lgDashDotDot: [8, 3, 1, 3, 1, 3], sysDashDotDot: [3, 1, 1, 1, 1, 1] };
function paintAttr(fill, defs, w, h, L, kind) { // kind: 'fill' | 'stroke'
  if (!fill || fill.type === 'none' || fill.type === 'group') return `${kind}="none"`;
  if (fill.type === 'solid') {
    const c = fill.color || { r: 0, g: 0, b: 0, a: 1 };
    return `${kind}="rgb(${c.r},${c.g},${c.b})"${c.a < 1 ? ` ${kind}-opacity="${+c.a.toFixed(3)}"` : ''}`;
  }
  if (fill.type === 'grad') {
    const id = nextId('g');
    const stops = fill.stops.map(s => `<stop offset="${(s.pos * 100).toFixed(1)}%" stop-color="rgb(${s.color.r},${s.color.g},${s.color.b})" stop-opacity="${s.color.a}"/>`).join('');
    if (fill.path) defs.push(`<radialGradient id="${id}" cx="50%" cy="50%" r="70%">${stops}</radialGradient>`);
    else {
      const a = fill.angle * Math.PI / 180, cx = Math.cos(a), cy = Math.sin(a);
      defs.push(`<linearGradient id="${id}" x1="${(50 - cx * 50).toFixed(1)}%" y1="${(50 - cy * 50).toFixed(1)}%" x2="${(50 + cx * 50).toFixed(1)}%" y2="${(50 + cy * 50).toFixed(1)}%">${stops}</linearGradient>`);
    }
    return `${kind}="url(#${id})"`;
  }
  if (fill.type === 'blip') {
    const url = fill.rid && L.ctx.media[fill.rid];
    if (!url) return `${kind}="rgb(200,200,200)"`;
    const id = nextId('p');
    defs.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${f2(w)}" height="${f2(h)}"><image href="${url}" width="${f2(w)}" height="${f2(h)}" preserveAspectRatio="none"/></pattern>`);
    return `${kind}="url(#${id})"`;
  }
  return `${kind}="none"`;
}
function fillCss(fill, L) {
  if (!fill || fill.type === 'none' || fill.type === 'group') return null;
  if (fill.type === 'solid') return cssColor(fill.color);
  if (fill.type === 'grad') {
    const stops = fill.stops.map(s => `${cssColor(s.color)} ${(s.pos * 100).toFixed(1)}%`).join(',');
    return fill.path ? `radial-gradient(circle at 50% 50%,${stops})` : `linear-gradient(${(fill.angle + 90).toFixed(1)}deg,${stops})`;
  }
  if (fill.type === 'blip') { const u = fill.rid && L.ctx.media[fill.rid]; return u ? `url("${u}") center/100% 100% no-repeat` : null; }
  return null;
}

/* ------------------------------ Shapes ------------------------------ */
function readXfrm(spPr) {
  const x = kid(spPr, 'xfrm') || kid(spPr, 'xfrm');
  if (!x) return null;
  const off = kid(x, 'off'), ext = kid(x, 'ext');
  if (!off || !ext) return null;
  const co = kid(x, 'chOff'), ce = kid(x, 'chExt');
  return {
    x: numAttr(off, 'x', 0), y: numAttr(off, 'y', 0), w: numAttr(ext, 'cx', 0), h: numAttr(ext, 'cy', 0),
    rot: numAttr(x, 'rot', 0) / 60000, fh: attr(x, 'flipH') === '1' || attr(x, 'flipH') === 'true', fv: attr(x, 'flipV') === '1' || attr(x, 'flipV') === 'true',
    chX: co ? numAttr(co, 'x', 0) : 0, chY: co ? numAttr(co, 'y', 0) : 0, chW: ce ? numAttr(ce, 'cx', 0) : 0, chH: ce ? numAttr(ce, 'cy', 0) : 0
  };
}
function toBox(xf, info) {
  let x = (xf.x - info.ox) * info.sx * PX, y = (xf.y - info.oy) * info.sy * PX;
  const w = xf.w * info.sx * PX, h = xf.h * info.sy * PX;
  let rot = xf.rot, fh = xf.fh, fv = xf.fv;
  if (info.fh) { x = info.gw - x - w; fh = !fh; rot = -rot; }
  if (info.fv) { y = info.gh - y - h; fv = !fv; rot = -rot; }
  return { x, y, w, h, rot, fh, fv };
}
function boxStyle(b) {
  return `left:${f2(b.x)}px;top:${f2(b.y)}px;width:${f2(b.w)}px;height:${f2(b.h)}px;` + (b.rot ? `transform:rotate(${f2(b.rot)}deg);transform-origin:50% 50%;` : '');
}

function resolveLine(spPr, style, ctx, phLn) {
  let ln = kid(spPr, 'ln') || phLn || null;
  let w = ln && ln.hasAttribute('w') ? numAttr(ln, 'w', 12700) : null;
  let fill = ln ? readFill(ln, ctx) : null;
  let dash = ln ? attr(kid(ln, 'prstDash'), 'val') : null;
  const head = ln ? attr(kid(ln, 'headEnd'), 'type') : null, tail = ln ? attr(kid(ln, 'tailEnd'), 'type') : null;
  if (style) {
    const lr = kid(style, 'lnRef'), idx = numAttr(lr, 'idx', 0);
    if (idx > 0) {
      const tl = ctx.theme.ln[idx - 1];
      if (w == null) w = tl ? numAttr(tl, 'w', 12700) : 12700;
      if (!fill) fill = { type: 'solid', color: resolveColor(colorChild(lr), ctx) };
      if (!dash && tl) dash = attr(kid(tl, 'prstDash'), 'val');
    }
  }
  if (!fill || fill.type === 'none') return null;
  return { w: Math.max((w == null ? 12700 : w) * PX, 0.75), fill, dash, head: head && head !== 'none' ? head : null, tail: tail && tail !== 'none' ? tail : null };
}

function shadowCss(spPr, ctx) {
  const eff = kid(spPr, 'effectLst'), sh = kid(eff, 'outerShdw');
  if (!sh) return '';
  const c = resolveColor(colorChild(sh), ctx) || { r: 0, g: 0, b: 0, a: .4 };
  const dist = numAttr(sh, 'dist', 0) * PX, dir = numAttr(sh, 'dir', 0) / 60000 * Math.PI / 180, blur = numAttr(sh, 'blurRad', 0) * PX;
  return `box-shadow:${f2(Math.cos(dir) * dist)}px ${f2(Math.sin(dir) * dist)}px ${f2(blur)}px ${cssColor(c)};`;
}

function bodyPrChain(list) {
  // list: عناصر bodyPr من الأقل أولوية للأعلى
  const merged = { el: null, fontScale: 1, lnSpcReduction: 0, autofit: false };
  const attrs = {};
  let autofitSet = false;
  list.forEach(el => {
    if (!el) return;
    Array.from(el.attributes).forEach(a => { attrs[a.name] = a.value; });
    const n = kid(el, 'normAutofit'), s = kid(el, 'spAutoFit'), o = kid(el, 'noAutofit');
    if (n) { merged.autofit = true; merged.fontScale = numAttr(n, 'fontScale', 100000) / 100000; merged.lnSpcReduction = numAttr(n, 'lnSpcReduction', 0) / 100000; autofitSet = true; }
    else if (s || o) { merged.autofit = false; merged.fontScale = 1; merged.lnSpcReduction = 0; autofitSet = true; }
  });
  const fake = { hasAttribute: k => k in attrs, getAttribute: k => attrs[k] };
  merged.el = fake;
  return merged;
}

function renderSp(parent, sp, L, info) {
  const ctx = L.ctx;
  const cNvPr = dig(sp, 'nvSpPr', 'cNvPr') || dig(sp, 'nvCxnSpPr', 'cNvPr') || findOne(sp, 'cNvPr');
  if (attr(cNvPr, 'hidden') === '1') return;
  const nvPr = dig(sp, 'nvSpPr', 'nvPr');
  const ph = nvPr ? kid(nvPr, 'ph') : null;
  const spPr = kid(sp, 'spPr'), txBody = kid(sp, 'txBody'), style = kid(sp, 'style');
  let inh = null;
  if (ph) {
    if (!L.isSlide) return;                      // الـplaceholders في الـlayout/master مش بتتعرض
    inh = L.findPh(ph);
  }
  const phSps = inh ? [inh.master, inh.layout].filter(Boolean) : [];   // من الأقل للأعلى
  const phSpPrs = phSps.map(s => kid(s, 'spPr'));
  let xf = readXfrm(spPr);
  if (!xf) for (let i = phSpPrs.length - 1; i >= 0 && !xf; i--) xf = readXfrm(phSpPrs[i]);
  if (!xf) return;
  const b = toBox(xf, info);
  if (b.w < 0.01 && b.h < 0.01 && !(L.isSlide)) return;

  // geometry
  let geom = kid(spPr, 'prstGeom') || kid(spPr, 'custGeom');
  for (let i = phSpPrs.length - 1; i >= 0 && !geom; i--) geom = kid(phSpPrs[i], 'prstGeom') || kid(phSpPrs[i], 'custGeom');
  const isCxn = sp.localName === 'cxnSp';
  let prst = geom && geom.localName === 'prstGeom' ? attr(geom, 'prst', 'rect') : (geom ? 'cust' : (isCxn ? 'line' : 'rect'));
  const geo = geom && geom.localName === 'custGeom' ? custPaths(geom, b.w, b.h) : presetPaths(prst, b.w, b.h, adjMap(geom));

  // fill
  let fill = readFill(spPr, ctx);
  for (let i = phSpPrs.length - 1; i >= 0 && !fill; i--) fill = readFill(phSpPrs[i], ctx);
  if (!fill && style) {
    const fr = kid(style, 'fillRef'), idx = numAttr(fr, 'idx', 0);
    if (idx > 0) fill = themeFill(idx, resolveColor(colorChild(fr), ctx), ctx, idx >= 1001);
  }
  if (fill && fill.type === 'group') fill = null;
  // line
  let phLn = null;
  for (let i = phSpPrs.length - 1; i >= 0 && !phLn; i--) phLn = kid(phSpPrs[i], 'ln');
  const line = resolveLine(spPr, style, ctx, phLn);

  const wrap = document.createElement('div');
  wrap.className = 'pp-sh';
  wrap.style.cssText = 'position:absolute;' + boxStyle(b);

  // shape drawing
  const isLineGeo = !!geo.line;
  const needSvg = (fill && fill.type !== 'none' && !isLineGeo) || line;
  if (needSvg && b.w >= 0 && b.h >= 0) {
    const sh = L.isSlide || true ? shadowCss(spPr, ctx) : '';
    if (sh && !isLineGeo && /^(rect|roundRect|ellipse)$/.test(prst) && fill && fill.type !== 'none') {
      const under = document.createElement('div');
      const rad = prst === 'ellipse' ? 'border-radius:50%;' : prst === 'roundRect' ? `border-radius:${f2(Math.min(b.w, b.h) * (adjMap(geom).adj != null ? adjMap(geom).adj : 16667) / 100000)}px;` : '';
      under.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${rad}${sh}`;
      wrap.appendChild(under);
    }
    const defs = [];
    const fl = (isLineGeo || geo.stroke) ? 'fill="none"' : paintAttr(fill, defs, b.w, b.h, L, 'fill');
    let strokeAttr = 'stroke="none"';
    let markers = '';
    if (line) {
      const lc = line.fill.type === 'solid' ? line.fill.color : (line.fill.stops && line.fill.stops[0] ? line.fill.stops[0].color : { r: 0, g: 0, b: 0, a: 1 });
      strokeAttr = `stroke="rgb(${lc.r},${lc.g},${lc.b})"${lc.a < 1 ? ` stroke-opacity="${lc.a}"` : ''} stroke-width="${f2(line.w)}" stroke-linejoin="round"`;
      if (line.dash && DASH[line.dash]) strokeAttr += ` stroke-dasharray="${DASH[line.dash].map(v => f2(v * Math.max(line.w, 1))).join(' ')}"`;
      const mk = (type, id, start) => {
        if (!type) return '';
        const s = Math.max(5, line.w * 3.2);
        let shape = '';
        if (type === 'oval') shape = `<circle cx="5" cy="5" r="4" fill="rgb(${lc.r},${lc.g},${lc.b})"/>`;
        else if (type === 'diamond') shape = `<path d="M5 0L10 5L5 10L0 5Z" fill="rgb(${lc.r},${lc.g},${lc.b})"/>`;
        else shape = `<path d="M0 0L10 5L0 10Z" fill="rgb(${lc.r},${lc.g},${lc.b})"/>`;
        defs.push(`<marker id="${id}" viewBox="0 0 10 10" refX="${type === 'oval' ? 5 : 8}" refY="5" markerUnits="userSpaceOnUse" markerWidth="${f2(s)}" markerHeight="${f2(s)}" orient="${start ? 'auto-start-reverse' : 'auto'}">${shape}</marker>`);
        return ` marker-${start ? 'start' : 'end'}="url(#${id})"`;
      };
      if (isLineGeo) markers = mk(line.head, nextId('mh'), true) + mk(line.tail, nextId('mt'), false);
    }
    const flip = `${b.fh ? `translate(${f2(b.w)} 0) scale(-1 1)` : ''} ${b.fv ? `translate(0 ${f2(b.h)}) scale(1 -1)` : ''}`.trim();
    const pathsSvg = geo.paths.map(p => {
      const f = p.noFill || isLineGeo || geo.stroke ? 'fill="none"' : fl;
      const s = p.noStroke ? 'stroke="none"' : strokeAttr;
      return `<path d="${p.d}" ${f} ${s}${p.evenodd ? ' fill-rule="evenodd"' : ''}${markers}/>`;
    }).join('');
    const pad = Math.ceil((line ? line.w : 0) + 4);
    wrap.insertAdjacentHTML('beforeend',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${f2(b.w + pad * 2)}" height="${f2(b.h + pad * 2)}" viewBox="${-pad} ${-pad} ${f2(b.w + pad * 2)} ${f2(b.h + pad * 2)}" style="position:absolute;left:${-pad}px;top:${-pad}px;overflow:visible">` +
      (defs.length ? `<defs>${defs.join('')}</defs>` : '') + `<g${flip ? ` transform="${flip}"` : ''}>${pathsSvg}</g></svg>`);
  }

  // text
  if (txBody && hasRealText(txBody)) {
    const styleKey = !ph ? 'other' : (/title/i.test(attr(ph, 'type', '')) ? 'title' : (/^(dt|ftr|sldNum)$/.test(attr(ph, 'type', '')) ? 'other' : 'body'));
    const chain = [L.pres.defaultTextStyle];
    if (ph) chain.push(L.master.txStyles[styleKey]);
    phSps.forEach(s => chain.push(readListStyle(kid(kid(s, 'txBody'), 'lstStyle'), ctx)));
    chain.push(readListStyle(kid(txBody, 'lstStyle'), ctx));
    const bps = phSps.map(s => kid(kid(s, 'txBody'), 'bodyPr')); bps.push(kid(txBody, 'bodyPr'));
    const bp = bodyPrChain(bps);
    let defColor = null;
    if (style) { const fr = kid(style, 'fontRef'); const cc = colorChild(fr); if (cc) defColor = resolveColor(cc, ctx); }
    const styleColor = defColor;
    if (!defColor) defColor = resolveColor({ localName: 'schemeClr', getAttribute: () => 'tx1', hasAttribute: () => true, children: [] }, ctx);
    if (styleColor && !ph) chain.splice(1, 0, new Array(9).fill({ defRPr: { color: styleColor } }));   // لون الـfontRef أقوى من الافتراضي
    // مستطيل النص الداخلي للأشكال غير المستطيلة
    let ti = [0, 0, 0, 0];
    if (prst === 'ellipse' || prst === 'flowChartConnector') ti = [b.w * .1464, b.h * .1464, b.w * .1464, b.h * .1464];
    else if (prst === 'diamond' || prst === 'flowChartDecision') ti = [b.w / 4, b.h / 4, b.w / 4, b.h / 4];
    else if (prst === 'roundRect') { const r = Math.min(b.w, b.h) * (adjMap(geom).adj != null ? adjMap(geom).adj : 16667) / 100000 * .29; ti = [r, r, r, r]; }
    else if (prst === 'triangle') ti = [b.w / 4, b.h / 2, b.w / 4, 0];
    const tb = buildTextBox(txBody, Math.max(0, b.w - ti[0] - ti[2]), Math.max(0, b.h - ti[1] - ti[3]), { chain, bodyPr: bp, ctx, defColor, slideNo: L.slideNo, rels: ctx.rels, ox: ti[0], oy: ti[1] });
    wrap.appendChild(tb);
  }
  if (wrap.childNodes.length) parent.appendChild(wrap);
  if (ph && L.onTitle && /title/i.test(attr(ph, 'type', '')) && txBody) L.onTitle(txBody.textContent.trim());
}

function renderPic(parent, pic, L, info) {
  const ctx = L.ctx;
  const spPr = kid(pic, 'spPr'), bf = kid(pic, 'blipFill');
  const xf = readXfrm(spPr); if (!xf) return;
  const b = toBox(xf, info);
  const blip = kid(bf, 'blip');
  const rid = relId(blip, 'embed');
  const url = rid && ctx.media[rid];
  const wrap = document.createElement('div');
  wrap.className = 'pp-pic';
  const geom = kid(spPr, 'prstGeom'); const prst = geom ? attr(geom, 'prst', 'rect') : 'rect';
  let rad = '';
  if (prst === 'ellipse') rad = 'border-radius:50%;';
  else if (prst === 'roundRect') rad = `border-radius:${f2(Math.min(b.w, b.h) * (adjMap(geom).adj != null ? adjMap(geom).adj : 16667) / 100000)}px;`;
  const line = resolveLine(spPr, kid(pic, 'style'), ctx, null);
  let st = `position:absolute;${boxStyle(b)}overflow:hidden;${rad}`;
  if (line) { const lc = line.fill.color || { r: 0, g: 0, b: 0, a: 1 }; st += `box-shadow:inset 0 0 0 ${f2(line.w)}px ${cssColor(lc)};`; }
  wrap.style.cssText = st;
  if (!url) {
    L.stats.unsupported.add('صورة بصيغة غير مدعومة (EMF/WMF)');
    wrap.style.background = 'rgba(148,163,184,.18)';
    parent.appendChild(wrap); return;
  }
  const sr = kid(bf, 'srcRect');
  const l = sr ? numAttr(sr, 'l', 0) / 100000 : 0, t = sr ? numAttr(sr, 't', 0) / 100000 : 0, r = sr ? numAttr(sr, 'r', 0) / 100000 : 0, bt = sr ? numAttr(sr, 'b', 0) / 100000 : 0;
  const iw = b.w / Math.max(0.01, 1 - l - r), ih = b.h / Math.max(0.01, 1 - t - bt);
  const img = document.createElement('img');
  img.src = url;
  img.alt = '';
  let ist = `position:absolute;left:${f2(-l * iw)}px;top:${f2(-t * ih)}px;width:${f2(iw)}px;height:${f2(ih)}px;display:block;`;
  const am = findOne(blip, 'alphaModFix'); if (am) ist += `opacity:${numAttr(am, 'amt', 100000) / 100000};`;
  if (b.fh || b.fv) ist += `transform:scale(${b.fh ? -1 : 1},${b.fv ? -1 : 1});`;
  img.style.cssText = ist;
  wrap.appendChild(img);
  parent.appendChild(wrap);
}

function renderGroup(parent, grp, L, info) {
  const grpSpPr = kid(grp, 'grpSpPr');
  const xf = readXfrm(grpSpPr); if (!xf) return;
  const b = toBox(xf, info);
  const wrap = document.createElement('div');
  wrap.className = 'pp-grp';
  wrap.style.cssText = 'position:absolute;' + boxStyle(b);
  const sx = xf.chW ? xf.w / xf.chW : 1, sy = xf.chH ? xf.h / xf.chH : 1;
  const inner = { ox: xf.chX, oy: xf.chY, sx, sy, fh: b.fh, fv: b.fv, gw: b.w, gh: b.h };
  renderChildren(wrap, grp, L, inner);
  parent.appendChild(wrap);
}

/* ------------------------------ Tables ------------------------------ */
const TBL_ACCENT = { '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}': 'accent1', '{21E4AEA4-8DFA-4A89-87EB-49C32662AFE0}': 'accent2', '{F5AB1C69-6EDB-4FF4-983F-18BD219EF322}': 'accent3', '{00A15C55-8517-42AA-B614-E9B94910E393}': 'accent4', '{7DF18680-E054-41AD-8BC1-D1AEF772440D}': 'accent5', '{93296810-A885-4BE3-A3E7-6D5BEEA58F35}': 'accent6' };
function mix(c, t, k) { return { r: Math.round(c.r * k + t * (1 - k)), g: Math.round(c.g * k + t * (1 - k)), b: Math.round(c.b * k + t * (1 - k)), a: 1 }; }
// ستايل جاهز لو الملف مفيهوش تعريف الستايل
function builtinTableStyle(id, ctx) {
  if (id === '{2D5ABB26-0587-4C30-8999-92F81FD0307C}') return { whole: {}, };
  if (id === '{5940675A-B579-460E-94D1-54222C63F5DA}') { const k = { r: 0, g: 0, b: 0, a: 1 }; return { whole: { bL: k, bR: k, bT: k, bB: k, bIH: k, bIV: k } }; }
  const acc = TBL_ACCENT[id] || 'accent1';
  const a = ctx.theme.colors[acc] || { r: 68, g: 114, b: 196, a: 1 };
  const white = { r: 255, g: 255, b: 255, a: 1 };
  return {
    whole: { fill: mix(a, 255, .2), bL: white, bR: white, bT: white, bB: white, bIH: white, bIV: white, bw: 1 },
    band1H: { fill: mix(a, 255, .4) }, band2H: {}, band1V: { fill: mix(a, 255, .4) },
    firstRow: { fill: a, color: white, bold: true, bB: white, bBw: 3 },
    lastRow: { fill: a, color: white, bold: true }, firstCol: { fill: a, color: white, bold: true }, lastCol: { fill: a, color: white, bold: true }
  };
}
function parseTableStyle(el, ctx) {
  const st = {};
  const part = (name, key) => {
    const p = kid(el, name); if (!p) return;
    const o = {};
    const tx = kid(p, 'tcTxStyle');
    if (tx) { if (attr(tx, 'b') === 'on') o.bold = true; const cc = colorChild(tx); if (cc) o.color = resolveColor(cc, ctx); const fr = kid(tx, 'fontRef'); if (fr && colorChild(fr)) o.color = resolveColor(colorChild(fr), ctx); }
    const tc = kid(p, 'tcStyle');
    if (tc) {
      const fillEl = kid(tc, 'fill'); if (fillEl) { const f = readFill(fillEl, ctx); if (f && f.type === 'solid') o.fill = f.color; else if (f && f.type === 'none') o.fill = null; }
      const fr = kid(tc, 'fillRef'); if (fr && colorChild(fr)) o.fill = resolveColor(colorChild(fr), ctx);
      const bd = kid(tc, 'tcBdr');
      if (bd) [['left', 'bL'], ['right', 'bR'], ['top', 'bT'], ['bottom', 'bB'], ['insideH', 'bIH'], ['insideV', 'bIV']].forEach(([n, k]) => {
        const e = kid(bd, n); const ln = kid(e, 'ln');
        if (ln) { const f = readFill(ln, ctx); if (f && f.type === 'solid') { o[k] = f.color; o[k + 'w'] = numAttr(ln, 'w', 12700) * PX; } else if (f && f.type === 'none') o[k] = null; }
        const lr = kid(e, 'lnRef'); if (lr && colorChild(lr)) { o[k] = resolveColor(colorChild(lr), ctx); }
      });
    }
    st[key] = o;
  };
  part('wholeTbl', 'whole'); part('band1H', 'band1H'); part('band2H', 'band2H'); part('band1V', 'band1V'); part('band2V', 'band2V');
  part('firstRow', 'firstRow'); part('lastRow', 'lastRow'); part('firstCol', 'firstCol'); part('lastCol', 'lastCol');
  return st;
}
function renderTable(parent, tbl, b, L) {
  const ctx = L.ctx;
  const pr = kid(tbl, 'tblPr');
  const flag = n => attr(pr, n) === '1' || attr(pr, n) === 'true';
  const sid = kid(pr, 'tableStyleId') ? kid(pr, 'tableStyleId').textContent.trim() : '';
  let style = (sid && L.pres.tableStyles[sid]) ? parseTableStyle(L.pres.tableStyles[sid], ctx) : builtinTableStyle(sid, ctx);
  if (!style.whole) style.whole = {};
  const cols = kids(kid(tbl, 'tblGrid'), 'gridCol').map(g => numAttr(g, 'w', 914400) * PX);
  const rows = kids(tbl, 'tr');
  const totalW = cols.reduce((a, c) => a + c, 0);
  const t = document.createElement('table');
  t.style.cssText = `position:absolute;left:${f2(b.x)}px;top:${f2(b.y)}px;width:${f2(totalW)}px;table-layout:fixed;border-collapse:collapse;border-spacing:0;`;
  t.innerHTML = '<colgroup>' + cols.map(c => `<col style="width:${f2(c)}px">`).join('') + '</colgroup>';
  const tbody = document.createElement('tbody');
  const nR = rows.length;
  const rtlTable = attr(pr, 'rtl') === '1';
  if (rtlTable) t.dir = 'rtl';
  rows.forEach((tr, ri) => {
    const rowEl = document.createElement('tr');
    rowEl.style.height = f2(numAttr(tr, 'h', 370840) * PX) + 'px';
    const cells = kids(tr, 'tc');
    cells.forEach((tc, ci) => {
      if (attr(tc, 'hMerge') === '1' || attr(tc, 'vMerge') === '1') return;
      const nC = cols.length;
      const isFirstRow = flag('firstRow') && ri === 0, isLastRow = flag('lastRow') && ri === nR - 1;
      const isFirstCol = flag('firstCol') && ci === 0, isLastCol = flag('lastCol') && ci === nC - 1;
      const bandIdx = ri - (flag('firstRow') ? 1 : 0);
      // دمج خصائص الستايل
      let sp = Object.assign({}, style.whole);
      if (flag('bandRow') && !isFirstRow && !isLastRow) Object.assign(sp, bandIdx % 2 === 0 ? style.band1H : style.band2H);
      if (flag('bandCol') && !isFirstCol) Object.assign(sp, ci % 2 === 0 ? style.band1V : style.band2V);
      if (isFirstCol && style.firstCol) Object.assign(sp, style.firstCol);
      if (isLastCol && style.lastCol) Object.assign(sp, style.lastCol);
      if (isFirstRow && style.firstRow) Object.assign(sp, style.firstRow);
      if (isLastRow && style.lastRow) Object.assign(sp, style.lastRow);
      const tcPr = kid(tc, 'tcPr');
      let fill = readFill(tcPr, ctx);
      let bg = fill ? (fill.type === 'none' ? null : fillCss(fill, L)) : (sp.fill ? cssColor(sp.fill) : null);
      const td = document.createElement('td');
      const gs = numAttr(tc, 'gridSpan', 1), rs = numAttr(tc, 'rowSpan', 1);
      if (gs > 1) td.colSpan = gs; if (rs > 1) td.rowSpan = rs;
      const padL = numAttr(tcPr, 'marL', 91440) * PX, padR = numAttr(tcPr, 'marR', 91440) * PX, padT = numAttr(tcPr, 'marT', 45720) * PX, padB = numAttr(tcPr, 'marB', 45720) * PX;
      const anchor = attr(tcPr, 'anchor', 't');
      let st = `padding:${f2(padT)}px ${f2(padR)}px ${f2(padB)}px ${f2(padL)}px;vertical-align:${anchor === 'ctr' ? 'middle' : anchor === 'b' ? 'bottom' : 'top'};overflow:hidden;`;
      if (bg) st += `background:${bg};`;
      // borders
      const edge = (tag, key, insideKey, isEdge) => {
        const ln = kid(tcPr, tag);
        if (ln) { const f = readFill(ln, ctx); if (f && f.type === 'solid') return `${f2(Math.max(numAttr(ln, 'w', 12700) * PX, .75))}px solid ${cssColor(f.color)}`; if (f && f.type === 'none') return 'none'; }
        const c = sp[key] !== undefined ? sp[key] : (!isEdge ? sp[insideKey] : undefined);
        if (c) return `${f2(Math.max(sp[key + 'w'] || sp.bw || 1, .75))}px solid ${cssColor(c)}`;
        return 'none';
      };
      const eL = ci === 0, eR = ci + gs >= nC, eT = ri === 0, eB = ri + rs >= nR;
      st += `border-left:${edge('lnL', 'bL', 'bIV', eL)};border-right:${edge('lnR', 'bR', 'bIV', eR)};border-top:${edge('lnT', 'bT', 'bIH', eT)};border-bottom:${edge('lnB', 'bB', 'bIH', eB)};`;
      td.style.cssText = st;
      const txBody = kid(tc, 'txBody');
      if (txBody) {
        const defColor = sp.color || resolveColor({ localName: 'schemeClr', getAttribute: () => 'tx1', hasAttribute: () => true, children: [] }, ctx);
        const chain = [L.pres.defaultTextStyle, readListStyle(kid(txBody, 'lstStyle'), ctx)];
        if (sp.bold) chain.push(new Array(9).fill({ defRPr: { b: true } }));
        const tb = buildTextBox(txBody, 0, 0, { chain, bodyPr: bodyPrChain([kid(txBody, 'bodyPr')]), ctx, defColor, slideNo: L.slideNo, rels: ctx.rels, inline: true });
        td.appendChild(tb);
      }
      rowEl.appendChild(td);
    });
    tbody.appendChild(rowEl);
  });
  t.appendChild(tbody);
  parent.appendChild(t);
}

/* ------------------------------ Charts ------------------------------ */
function cacheVals(el) { return findAll(el, 'pt').sort((a, b) => numAttr(a, 'idx', 0) - numAttr(b, 'idx', 0)).map(p => (kid(p, 'v') || {}).textContent); }
function niceMax(v) { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
function fmtNum(n) { if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'; if (Math.abs(n) >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'; return String(Math.round(n * 100) / 100); }
function renderChart(parent, cdoc, b, L) {
  const ctx = L.ctx;
  const plot = findOne(cdoc, 'plotArea');
  const TYPES = ['barChart', 'bar3DChart', 'lineChart', 'line3DChart', 'areaChart', 'area3DChart', 'pieChart', 'pie3DChart', 'doughnutChart', 'scatterChart', 'radarChart'];
  const ch = plot ? Array.from(plot.children).find(c => TYPES.includes(c.localName)) : null;
  const box = document.createElement('div');
  box.style.cssText = `position:absolute;left:${f2(b.x)}px;top:${f2(b.y)}px;width:${f2(b.w)}px;height:${f2(b.h)}px;`;
  parent.appendChild(box);
  if (!ch) { L.stats.unsupported.add('رسم بياني غير مدعوم'); box.style.cssText += 'background:rgba(148,163,184,.12);border:1px dashed #94a3b8;'; return; }
  const type = ch.localName.replace('3D', '');
  const palette = ['accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6'].map(k => ctx.theme.colors[k] || { r: 91, g: 155, b: 213, a: 1 });
  const series = kids(ch, 'ser').map((s, i) => {
    const name = cacheVals(kid(s, 'tx'))[0] || ('Series ' + (i + 1));
    const cats = cacheVals(kid(s, 'cat') || kid(s, 'xVal'));
    const vals = cacheVals(kid(s, 'val') || kid(s, 'yVal')).map(v => parseFloat(v));
    const f = readFill(kid(s, 'spPr'), ctx);
    let color = f && f.type === 'solid' ? f.color : null;
    if (!color) { const ln = kid(kid(s, 'spPr'), 'ln'); const lf = ln ? readFill(ln, ctx) : null; if (lf && lf.type === 'solid') color = lf.color; }
    if (!color) { const base = palette[i % 6]; const k = Math.floor(i / 6); color = k ? mix(base, k % 2 ? 255 : 0, .7) : base; }
    const dpts = {}; kids(s, 'dPt').forEach(d => { const ff = readFill(kid(d, 'spPr'), ctx); if (ff && ff.type === 'solid') dpts[numAttr(kid(d, 'idx'), 'val', 0)] = ff.color; });
    const dl = kid(s, 'dLbls') || kid(ch, 'dLbls');
    const showVal = dl && attr(kid(dl, 'showVal'), 'val') === '1', showPct = dl && attr(kid(dl, 'showPercent'), 'val') === '1';
    const smooth = attr(kid(s, 'smooth'), 'val') === '1';
    const mk = kid(s, 'marker'); const noMarker = mk && attr(kid(mk, 'symbol'), 'val') === 'none';
    return { name, cats, vals, color, dpts, showVal, showPct, smooth, noMarker };
  });
  if (!series.length) return;
  const titleEl = kid(cdoc.documentElement, 'chart') ? kid(kid(cdoc.documentElement, 'chart'), 'title') : null;
  const title = titleEl ? findAll(titleEl, 't').map(t => t.textContent).join('') : '';
  const legendEl = kid(kid(cdoc.documentElement, 'chart'), 'legend');
  const legendPos = legendEl ? attr(kid(legendEl, 'legendPos'), 'val', 'r') : null;
  const txPr = findOne(cdoc.documentElement, 'txPr'); const baseFs = (txPr && findOne(txPr, 'defRPr') && numAttr(findOne(txPr, 'defRPr'), 'sz', 1000) / 100 * PT) || 12;
  const labs = [];
  const lab = (x, y, text, o) => {
    o = o || {};
    labs.push(`<div style="position:absolute;left:${f2(x)}px;top:${f2(y)}px;${o.w ? `width:${f2(o.w)}px;` : ''}transform:translate(${o.ax === 'c' ? '-50%' : o.ax === 'r' ? '-100%' : '0'},${o.ay === 'm' ? '-50%' : o.ay === 'b' ? '-100%' : '0'});font:${o.bold ? '700 ' : ''}${o.fs || baseFs}px Calibri,Carlito,Cairo,Arial,sans-serif;color:${o.color || '#595959'};white-space:nowrap;line-height:1.1">${esc(text)}</div>`);
  };
  let top = 6, bottom = 6, left = 6, right = 6;
  if (title) { lab(b.w / 2, 8, title, { ax: 'c', bold: true, fs: baseFs * 1.4, color: '#404040' }); top = baseFs * 1.4 + 18; }
  if (legendPos) {
    const names = type === 'pieChart' || type === 'doughnutChart' ? (series[0].cats.length ? series[0].cats : []) : series.map(s => s.name);
    const cols = type === 'pieChart' || type === 'doughnutChart' ? names.map((n, i) => series[0].dpts[i] || palette[i % 6]) : series.map(s => s.color);
    if (legendPos === 'b' || legendPos === 't') {
      const itemW = Math.min(b.w / Math.max(names.length, 1), 150); let x0 = (b.w - itemW * names.length) / 2; const y0 = legendPos === 'b' ? b.h - baseFs - 10 : top;
      names.forEach((n, i) => { labs.push(`<div style="position:absolute;left:${f2(x0 + i * itemW)}px;top:${f2(y0)}px;width:10px;height:10px;background:${cssColor(cols[i])}"></div>`); lab(x0 + i * itemW + 14, y0 - 1, n, { fs: baseFs }); });
      if (legendPos === 'b') bottom += baseFs + 16; else top += baseFs + 14;
    } else {
      const lw = 110; const x0 = legendPos === 'l' ? 8 : b.w - lw; const y0 = b.h / 2 - names.length * (baseFs + 8) / 2;
      names.forEach((n, i) => { labs.push(`<div style="position:absolute;left:${f2(x0)}px;top:${f2(y0 + i * (baseFs + 8) + 2)}px;width:10px;height:10px;background:${cssColor(cols[i])}"></div>`); lab(x0 + 14, y0 + i * (baseFs + 8), n, { fs: baseFs }); });
      if (legendPos === 'l') left += lw; else right += lw;
    }
  }
  let svg = '';
  const pw = b.w - left - right, ph = b.h - top - bottom;
  if (type === 'pieChart' || type === 'doughnutChart') {
    const s = series[0]; const total = s.vals.reduce((a, v) => a + (v > 0 ? v : 0), 0) || 1;
    const cx = left + pw / 2, cy = top + ph / 2, r = Math.max(10, Math.min(pw, ph) / 2 - 6);
    const hole = type === 'doughnutChart' ? numAttr(kid(ch, 'holeSize'), 'val', 50) / 100 : 0;
    let a0 = (numAttr(kid(ch, 'firstSliceAng'), 'val', 0) - 90) * Math.PI / 180;
    s.vals.forEach((v, i) => {
      if (!(v > 0)) return;
      const a1 = a0 + v / total * Math.PI * 2, col = cssColor(s.dpts[i] || palette[i % 6]);
      const P = (rr, a) => `${f2(cx + rr * Math.cos(a))} ${f2(cy + rr * Math.sin(a))}`;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      let d;
      if (v / total > .9999) d = `M${P(r, 0)}A${r} ${r} 0 1 1 ${P(r, Math.PI)}A${r} ${r} 0 1 1 ${P(r, 0)}Z`;
      else d = hole ? `M${P(r, a0)}A${r} ${r} 0 ${large} 1 ${P(r, a1)}L${P(r * hole, a1)}A${r * hole} ${r * hole} 0 ${large} 0 ${P(r * hole, a0)}Z` : `M${f2(cx)} ${f2(cy)}L${P(r, a0)}A${r} ${r} 0 ${large} 1 ${P(r, a1)}Z`;
      svg += `<path d="${d}" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
      if (s.showVal || s.showPct) { const am = (a0 + a1) / 2, rr = hole ? r * (1 + hole) / 2 : r * .65; lab(cx + rr * Math.cos(am), cy + rr * Math.sin(am), s.showPct ? Math.round(v / total * 100) + '%' : fmtNum(v), { ax: 'c', ay: 'm', color: '#fff', bold: true }); }
      a0 = a1;
    });
  } else {
    const nCat = Math.max(...series.map(s => s.vals.length), 1);
    const cats = (series.find(s => s.cats.length) || { cats: [] }).cats;
    const grouping = attr(kid(ch, 'grouping'), 'val', 'clustered');
    const stacked = /stacked/i.test(grouping), pct = grouping === 'percentStacked';
    const horiz = type === 'barChart' && attr(kid(ch, 'barDir'), 'val', 'col') === 'bar';
    let mn = 0, mx = 0;
    if (stacked) { for (let i = 0; i < nCat; i++) { let pos = 0, neg = 0; series.forEach(s => { const v = s.vals[i] || 0; if (v >= 0) pos += v; else neg += v; }); mx = Math.max(mx, pos); mn = Math.min(mn, neg); } if (pct) { mx = 1; mn = 0; } }
    else series.forEach(s => s.vals.forEach(v => { if (!isNaN(v)) { mx = Math.max(mx, v); mn = Math.min(mn, v); } }));
    if (type === 'scatterChart') { mn = Math.min(0, ...series.flatMap(s => s.vals.filter(v => !isNaN(v)))); }
    const hi = niceMax(mx), lo = mn < 0 ? -niceMax(-mn) : 0;
    const axPad = 34 + (horiz ? 24 : 0), axBot = 24;
    const x0 = left + axPad, x1 = b.w - right - 6, y0 = top + 8, y1 = b.h - bottom - axBot;
    const ticks = 5;
    const valPos = v => horiz ? x0 + (v - lo) / (hi - lo) * (x1 - x0) : y1 - (v - lo) / (hi - lo) * (y1 - y0);
    for (let i = 0; i <= ticks; i++) {
      const v = lo + (hi - lo) * i / ticks, p = valPos(v);
      if (horiz) { svg += `<line x1="${f2(p)}" y1="${f2(y0)}" x2="${f2(p)}" y2="${f2(y1)}" stroke="#d9d9d9" stroke-width="1"/>`; lab(p, y1 + 6, pct ? Math.round(v * 100) + '%' : fmtNum(v), { ax: 'c' }); }
      else { svg += `<line x1="${f2(x0)}" y1="${f2(p)}" x2="${f2(x1)}" y2="${f2(p)}" stroke="#d9d9d9" stroke-width="1"/>`; lab(x0 - 6, p, pct ? Math.round(v * 100) + '%' : fmtNum(v), { ax: 'r', ay: 'm' }); }
    }
    const band = horiz ? (y1 - y0) / nCat : (x1 - x0) / nCat;
    const zero = valPos(0);
    for (let i = 0; i < nCat; i++) { const c = band * (i + .5) + (horiz ? y0 : x0); if (horiz) lab(x0 - 6, c, cats[i] || '', { ax: 'r', ay: 'm' }); else lab(c, y1 + 6, cats[i] || '', { ax: 'c' }); }
    svg += horiz ? `<line x1="${f2(zero)}" y1="${f2(y0)}" x2="${f2(zero)}" y2="${f2(y1)}" stroke="#bfbfbf"/>` : `<line x1="${f2(x0)}" y1="${f2(zero)}" x2="${f2(x1)}" y2="${f2(zero)}" stroke="#bfbfbf"/>`;
    if (type === 'barChart') {
      const gap = numAttr(kid(ch, 'gapWidth'), 'val', 150) / 100, ov = stacked ? 1 : numAttr(kid(ch, 'overlap'), 'val', 0) / 100;
      const m = series.length, bw = band / (gap + m - (m - 1) * ov);
      for (let i = 0; i < nCat; i++) {
        let accP = 0, accN = 0; const tot = pct ? series.reduce((a, s) => a + Math.abs(s.vals[i] || 0), 0) || 1 : 1;
        series.forEach((s, si) => {
          let v = s.vals[i]; if (isNaN(v) || v == null) return; if (pct) v = v / tot;
          const off = stacked ? band * (1 - 1 / (1 + gap)) / 2 : (si * bw * (1 - ov)) + (band - bw * (m - (m - 1) * ov)) / 2;
          let a, c;
          if (stacked) { a = v >= 0 ? accP : accN; c = a + v; if (v >= 0) accP = c; else accN = c; } else { a = 0; c = v; }
          const bandStart = (horiz ? y0 : x0) + band * i;
          const pos = stacked ? bandStart + band / (2 * (1 + gap)) * gap : bandStart + off;
          const w2 = stacked ? band / (1 + gap) : bw;
          const col = cssColor(s.dpts[i] || s.color);
          if (horiz) { const xa = valPos(a), xc = valPos(c); svg += `<rect x="${f2(Math.min(xa, xc))}" y="${f2(pos)}" width="${f2(Math.abs(xc - xa))}" height="${f2(w2)}" fill="${col}"/>`; if (s.showVal) lab(Math.max(xa, xc) + 4, pos + w2 / 2, fmtNum(v), { ay: 'm' }); }
          else { const ya = valPos(a), yc = valPos(c); svg += `<rect x="${f2(pos)}" y="${f2(Math.min(ya, yc))}" width="${f2(w2)}" height="${f2(Math.abs(yc - ya))}" fill="${col}"/>`; if (s.showVal) lab(pos + w2 / 2, Math.min(ya, yc) - 3, fmtNum(v), { ax: 'c', ay: 'b' }); }
        });
      }
    } else if (type === 'lineChart' || type === 'areaChart' || type === 'scatterChart' || type === 'radarChart') {
      series.forEach(s => {
        const pts = s.vals.map((v, i) => isNaN(v) ? null : [x0 + band * (i + .5), valPos(v)]).filter(Boolean);
        if (!pts.length) return;
        const col = cssColor(s.color);
        const d = pts.map((p, i) => (i ? 'L' : 'M') + f2(p[0]) + ' ' + f2(p[1])).join('');
        if (type === 'areaChart') svg += `<path d="${d}L${f2(pts[pts.length - 1][0])} ${f2(zero)}L${f2(pts[0][0])} ${f2(zero)}Z" fill="${col}" fill-opacity=".6"/>`;
        else if (type !== 'scatterChart') svg += `<path d="${d}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
        if (type !== 'areaChart' && !s.noMarker) pts.forEach(p => { svg += `<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="${type === 'scatterChart' ? 4.5 : 3.5}" fill="${col}"/>`; });
        if (s.showVal) pts.forEach((p, i) => lab(p[0], p[1] - 6, fmtNum(s.vals[i]), { ax: 'c', ay: 'b' }));
      });
    }
  }
  box.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${f2(b.w)}" height="${f2(b.h)}" viewBox="0 0 ${f2(b.w)} ${f2(b.h)}" style="position:absolute;left:0;top:0">${svg}</svg>` + labs.join('');
}

/* ------------------------------ Frames (table / chart / diagram) ------------------------------ */
function renderFrame(parent, gf, L, info) {
  // graphicFrame بيحط xfrm مباشرة (p:xfrm)
  const xEl = kid(gf, 'xfrm');
  if (!xEl) return;
  const off = kid(xEl, 'off'), ext = kid(xEl, 'ext');
  const fx = { x: numAttr(off, 'x', 0), y: numAttr(off, 'y', 0), w: numAttr(ext, 'cx', 0), h: numAttr(ext, 'cy', 0), rot: 0, fh: false, fv: false };
  const b = toBox(fx, info);
  const gd = findOne(gf, 'graphicData'); if (!gd) return;
  const uri = attr(gd, 'uri', '');
  if (/table/.test(uri)) { const tbl = kid(gd, 'tbl'); if (tbl) renderTable(parent, tbl, b, L); }
  else if (/chart/.test(uri)) {
    const ce = kid(gd, 'chart'); const rid = relId(ce);
    const rel = rid && L.ctx.rels[rid];
    const cdoc = rel && L.chartDocs[rel.target];
    if (cdoc) renderChart(parent, cdoc, b, L); else L.stats.unsupported.add('رسم بياني');
  } else if (/diagram/.test(uri)) {
    const dm = findOne(gd, 'relIds');
    const dmRel = dm && L.ctx.rels[relId(dm, 'dm')];
    const drawing = L.diagramDocs && dmRel && L.diagramDocs[dmRel.target];
    if (drawing) {
      const tree = findOne(drawing, 'spTree');
      const wrap = document.createElement('div');
      wrap.style.cssText = `position:absolute;${boxStyle(b)}`;
      renderChildren(wrap, tree, L, { ox: 0, oy: 0, sx: 1, sy: 1 });
      parent.appendChild(wrap);
    } else L.stats.unsupported.add('SmartArt');
  } else L.stats.unsupported.add('عنصر مدمج (فيديو/OLE)');
}

function renderChildren(parent, tree, L, info) {
  if (!tree) return;
  for (const el of Array.from(tree.children)) {
    try {
      switch (el.localName) {
        case 'sp': case 'cxnSp': renderSp(parent, el, L, info); break;
        case 'pic': renderPic(parent, el, L, info); break;
        case 'grpSp': renderGroup(parent, el, L, info); break;
        case 'graphicFrame': renderFrame(parent, el, L, info); break;
        case 'AlternateContent': { const fb = kid(el, 'Fallback') || kid(el, 'Choice'); if (fb) renderChildren(parent, fb, L, info); break; }
      }
    } catch (e) { console.warn('[ppt-pdf] shape skipped', e); L.stats.unsupported.add('عنصر معقد'); }
  }
}

/* ------------------------------ تحميل الملف ------------------------------ */
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', bmp: 'image/bmp', webp: 'image/webp' };
function bytesToDataUrl(bytes, mime) {
  let bin = ''; const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  return `data:${mime};base64,` + btoa(bin);
}
async function shrinkJpeg(bytes) {
  try {
    const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }));
    const max = 2400, k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (k >= 1) return null;
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.88);
  } catch (e) { return null; }
}
async function loadMedia(pres, rels) {
  const out = {};
  for (const [id, r] of Object.entries(rels)) {
    if (r.type !== 'image' || !r.target || r.external) continue;
    if (pres.mediaCache[r.target] !== undefined) { out[id] = pres.mediaCache[r.target]; continue; }
    const ext = r.target.split('.').pop().toLowerCase();
    let url = null;
    if (MIME[ext]) {
      const bytes = await pres.pkg.bytes(r.target);
      if (bytes) {
        if (ext.startsWith('jp') && bytes.length > 1.5e6) url = await shrinkJpeg(bytes);
        if (!url) url = bytesToDataUrl(bytes, MIME[ext]);
      }
    }
    if (Object.keys(pres.mediaCache).length > 40) pres.mediaCache = {};   // نمنع تراكم الصور في الرامات
    pres.mediaCache[r.target] = url;
    out[id] = url;
  }
  return out;
}

const normT = t => ({ ctrTitle: 'title', subTitle: 'body', obj: 'body', tbl: 'body', chart: 'body', media: 'body', pic: 'body', clipArt: 'body', dgm: 'body' })[t] || t || 'body';
function collectPh(tree) {
  const out = [];
  kids(tree, 'sp').forEach(sp => {
    const nv = dig(sp, 'nvSpPr', 'nvPr'); const ph = nv && kid(nv, 'ph');
    if (ph) out.push({ sp, type: attr(ph, 'type', 'obj'), idx: ph.hasAttribute('idx') ? parseInt(attr(ph, 'idx'), 10) : null });
  });
  return out;
}
function matchPh(list, type, idx, useIdx) {
  let m = null;
  if (useIdx && idx != null && idx > 0) m = list.find(p => p.idx === idx);
  if (!m) m = list.find(p => normT(p.type) === normT(type));
  return m;
}

async function loadMaster(pres, path) {
  if (pres.masters[path]) return pres.masters[path];
  const doc = await pres.pkg.xml(path);
  const rels = await readRels(pres.pkg, path);
  const themeRel = Object.values(rels).find(r => r.type === 'theme');
  const theme = parseTheme(themeRel ? await pres.pkg.xml(themeRel.target) : null);
  const root = doc.documentElement;
  const clrMap = {};
  const cm = kid(root, 'clrMap'); if (cm) Array.from(cm.attributes).forEach(a => { clrMap[a.name] = a.value; });
  const ctx = { pkg: pres.pkg, theme, clrMap, rels, media: await loadMedia(pres, rels), phClr: null };
  const ts = kid(root, 'txStyles');
  const m = {
    path, doc, ctx, theme, clrMap,
    txStyles: { title: readListStyle(kid(ts, 'titleStyle'), ctx), body: readListStyle(kid(ts, 'bodyStyle'), ctx), other: readListStyle(kid(ts, 'otherStyle'), ctx) },
    tree: dig(root, 'cSld', 'spTree'), bg: dig(root, 'cSld', 'bg'), phList: null
  };
  m.phList = collectPh(m.tree);
  pres.masters[path] = m;
  return m;
}
async function loadLayout(pres, path) {
  if (pres.layouts[path]) return pres.layouts[path];
  const doc = await pres.pkg.xml(path);
  const rels = await readRels(pres.pkg, path);
  const mRel = Object.values(rels).find(r => r.type === 'slideMaster');
  const master = await loadMaster(pres, mRel.target);
  const root = doc.documentElement;
  const ctx = { pkg: pres.pkg, theme: master.theme, clrMap: master.clrMap, rels, media: await loadMedia(pres, rels), phClr: null };
  const l = { path, doc, master, ctx, tree: dig(root, 'cSld', 'spTree'), bg: dig(root, 'cSld', 'bg'), showMasterSp: attr(root, 'showMasterSp', '1') !== '0' };
  l.phList = collectPh(l.tree);
  pres.layouts[path] = l;
  return l;
}

async function loadPresentation(file) {
  let pkg;
  try { pkg = await openPackage(await file.arrayBuffer()); } catch (e) { throw new Error('NOT_PPTX'); }
  const pdoc = await pkg.xml('ppt/presentation.xml');
  if (!pdoc) throw new Error('NOT_PPTX');
  const root = pdoc.documentElement;
  const sz = findOne(pdoc, 'sldSz');
  const pres = {
    pkg, W: numAttr(sz, 'cx', 9144000), H: numAttr(sz, 'cy', 6858000),
    masters: {}, layouts: {}, mediaCache: {}, tableStyles: {}, slides: [], defaultTextStyle: new Array(9).fill(null), name: file.name.replace(/\.[^.]+$/, '')
  };
  const prels = await readRels(pkg, 'ppt/presentation.xml');
  const paths = kids(kid(root, 'sldIdLst'), 'sldId').map(s => prels[relId(s)] && prels[relId(s)].target).filter(Boolean);
  if (!paths.length) throw new Error('NO_SLIDES');
  // الستايلات الافتراضية للنص
  const firstMaster = Object.values(prels).find(r => r.type === 'slideMaster');
  const baseMaster = firstMaster ? await loadMaster(pres, firstMaster.target) : null;
  if (baseMaster) pres.defaultTextStyle = readListStyle(kid(root, 'defaultTextStyle'), baseMaster.ctx);
  // ستايلات الجداول
  const tsDoc = await pkg.xml('ppt/tableStyles.xml');
  if (tsDoc) findAll(tsDoc, 'tblStyle').forEach(s => { pres.tableStyles[attr(s, 'styleId')] = s; });
  paths.forEach(p => pres.slides.push({ path: p, hidden: false }));   // المخفي بنكتشفه بعدين على مهل
  return pres;
}

/* ------------------------------ بناء سلايد واحد ------------------------------ */
function applyBackground(root, bgEl, ctx, L) {
  if (!bgEl) return false;
  const pr = kid(bgEl, 'bgPr'), ref = kid(bgEl, 'bgRef');
  let fill = null;
  if (pr) fill = readFill(pr, ctx);
  else if (ref) {
    const idx = numAttr(ref, 'idx', 1001);
    fill = themeFill(idx, resolveColor(colorChild(ref), ctx), ctx, idx >= 1001);
  }
  const css = fillCss(fill, { ctx });
  if (!css) return fill && fill.type === 'none';
  root.style.background = css;
  return true;
}

async function buildSlide(pres, index) {
  const sInfo = pres.slides[index];
  const pkg = pres.pkg;
  const sdoc = await pkg.xml(sInfo.path);
  const rels = await readRels(pkg, sInfo.path);
  const lRel = Object.values(rels).find(r => r.type === 'slideLayout');
  const layout = await loadLayout(pres, lRel.target);
  const master = layout.master;
  const sroot = sdoc.documentElement;
  // clrMap override
  const clrMap = Object.assign({}, master.clrMap);
  const ov = dig(sroot, 'clrMapOvr', 'overrideClrMapping');
  if (ov) Array.from(ov.attributes).forEach(a => { clrMap[a.name] = a.value; });
  const ctx = { pkg, theme: master.theme, clrMap, rels, media: await loadMedia(pres, rels), phClr: null };
  // charts + diagrams
  const chartDocs = {}, diagramDocs = {};
  for (const r of Object.values(rels)) {
    if (r.type === 'chart' && r.target) chartDocs[r.target] = await pkg.xml(r.target);
    if (r.type === 'diagramData' && r.target) {
      const dd = await pkg.xml(r.target);
      const ext = dd && findOne(dd, 'dataModelExt');
      const rid = ext && attr(ext, 'relId');
      const dr = rid && rels[rid];
      if (dr && dr.target) diagramDocs[r.target] = await pkg.xml(dr.target);
    }
  }
  const stats = { unsupported: new Set() };
  const w = pres.W * PX, h = pres.H * PX;
  const root = document.createElement('div');
  root.className = 'pp-slide';
  root.style.cssText = `position:relative;width:${f2(w)}px;height:${f2(h)}px;overflow:hidden;background:#fff;direction:ltr;`;
  // الخلفية: slide -> layout -> master
  const sbg = dig(sroot, 'cSld', 'bg');
  if (!(applyBackground(root, sbg, ctx) || applyBackground(root, layout.bg, layout.ctx) || applyBackground(root, master.bg, master.ctx))) { /* أبيض */ }
  const idMap = { ox: 0, oy: 0, sx: 1, sy: 1 };
  const base = { pres, master, stats, chartDocs, diagramDocs, slideNo: index + 1 };
  const showMaster = attr(sroot, 'showMasterSp', '1') !== '0';
  let title = '';
  if (showMaster && layout.showMasterSp) renderChildren(root, master.tree, Object.assign({}, base, { ctx: master.ctx, isSlide: false }), idMap);
  if (showMaster) renderChildren(root, layout.tree, Object.assign({}, base, { ctx: layout.ctx, isSlide: false }), idMap);
  const findPh = ph => {
    const type = attr(ph, 'type', 'obj'), idx = ph.hasAttribute('idx') ? parseInt(attr(ph, 'idx'), 10) : null;
    const lm = matchPh(layout.phList, type, idx, true);
    const mm = matchPh(master.phList, lm ? lm.type : type, null, false);
    return { layout: lm ? lm.sp : null, master: mm ? mm.sp : null };
  };
  renderChildren(root, dig(sroot, 'cSld', 'spTree'), Object.assign({}, base, { ctx, isSlide: true, findPh, onTitle: t => { if (!title) title = t; } }), idMap);
  return { root, title: title.replace(/\s+/g, ' ').trim(), stats };
}

/* ------------------------------ تحويل السلايد لصورة ------------------------------ */
let stage = null;
function getStage() {
  if (stage && stage.isConnected) return stage;
  stage = document.createElement('div');
  stage.id = 'pp-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.style.cssText = 'position:fixed;left:-40000px;top:0;pointer-events:none;';
  document.body.appendChild(stage);
  return stage;
}
let fontsReady = null;
function ensureFonts() {
  if (fontsReady) return fontsReady;
  const tasks = [];
  try {
    ['400', '700'].forEach(wt => ['Cairo', 'Tajawal', 'Amiri'].forEach(f => tasks.push(document.fonts.load(`${wt} 20px "${f}"`, 'أبجد abc'))));
  } catch (e) { }
  fontsReady = Promise.race([Promise.allSettled(tasks).then(() => document.fonts.ready), new Promise(r => setTimeout(r, 6000))]);
  return fontsReady;
}
function fitTexts(root) {
  root.querySelectorAll('.pp-text[data-autofit]').forEach(box => {
    if (box.style.getPropertyValue('--fs') !== '1') return;       // الـfontScale محسوب من PowerPoint نفسه
    const avail = box.clientHeight - parseFloat(getComputedStyle(box).paddingTop) - parseFloat(getComputedStyle(box).paddingBottom);
    if (!(avail > 0)) return;
    const prev = box.style.justifyContent; box.style.justifyContent = 'flex-start';
    let s = 1, guard = 0;
    while (box.scrollHeight - parseFloat(getComputedStyle(box).paddingBottom) > box.clientHeight + 1 && s > .45 && guard++ < 14) { s -= .05; box.style.setProperty('--fs', s.toFixed(2)); }
    box.style.justifyContent = prev;
  });
}
function collectLinks(root) {
  const rr = root.getBoundingClientRect(), out = [];
  root.querySelectorAll('[data-href]').forEach(el => {
    const url = el.getAttribute('data-href'); if (!/^(https?:|mailto:)/i.test(url)) return;
    Array.from(el.getClientRects()).forEach(r => { if (r.width > 1 && r.height > 1) out.push({ url, x: r.left - rr.left, y: r.top - rr.top, w: r.width, h: r.height }); });
  });
  return out;
}
async function waitImages(root) {
  await Promise.all(Array.from(root.querySelectorAll('img')).map(i => (i.decode ? i.decode().catch(() => { }) : Promise.resolve())));
}
function dropSlideCache(pres, index) {
  try {
    const p = pres.slides[index].path, pkg = pres.pkg;
    if (!pkg.drop) return;
    pkg.drop(p);
    pkg.drop(p.substring(0, p.lastIndexOf('/') + 1) + '_rels/' + p.substring(p.lastIndexOf('/') + 1) + '.rels');
  } catch (e) { }
}
/* التقاط السلايد بمحرّك المتصفح نفسه (SVG foreignObject) — النص والهايلايت بيطلعوا بنفس مكانهم بالظبط.
   html2canvas بيعيد رسم النص بحساباته هو فكان بيزحزح الأسطر ويكسّر الهايلايت. */
const CAPTURE_BASE_CSS = '*,*::before,*::after{box-sizing:border-box;border:0 solid}img,svg,video,canvas{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}';
async function foreignCapture(root, wPx, hPx, scale, quality) {
  const cs = getComputedStyle(root);
  const clone = root.cloneNode(true);
  ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'color', 'letterSpacing', 'wordSpacing', 'fontKerning', 'textRendering'].forEach(k => { try { clone.style[k] = cs[k]; } catch (e) { } });
  clone.style.position = 'relative'; clone.style.left = '0'; clone.style.top = '0'; clone.style.margin = '0';
  let xml = new XMLSerializer().serializeToString(clone);
  xml = xml.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '');
  const W = Math.round(wPx), H = Math.round(hPx);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><style>${CAPTURE_BASE_CSS}</style><foreignObject x="0" y="0" width="${W}" height="${H}">${xml}</foreignObject></svg>`;
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  try {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('SVG_LOAD')); img.src = url; });
    try { if (img.decode) await img.decode(); } catch (e) { }
    const cw = Math.max(1, Math.round(W * scale)), ch = Math.max(1, Math.round(H * scale));
    const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch;
    const g = canvas.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, cw, ch);
    g.drawImage(img, 0, 0, cw, ch);
    const blob = await new Promise((r, rej) => { try { canvas.toBlob(r, 'image/jpeg', quality || 0.92); } catch (e) { rej(e); } });
    canvas.width = canvas.height = 0;
    if (!blob) throw new Error('CAPTURE_EMPTY');
    return blob;
  } finally { /* data URL: مفيش حاجة تتفضّى */ }
}
let useForeign = true;   // لو المتصفح مش بيدعمها بنرجع لـ html2canvas تلقائي
async function renderSlide(pres, index, scale, quality) {
  await ensureFonts();
  const { root, title, stats } = await buildSlide(pres, index);
  const st = getStage();
  st.appendChild(root);
  let blob, links = [];
  const wPx = pres.W * PX, hPx = pres.H * PX;
  try {
    await waitImages(root);
    await new Promise(r => requestAnimationFrame(() => r()));
    fitTexts(root);
    links = collectLinks(root);
    if (useForeign) {
      try { blob = await foreignCapture(root, wPx, hPx, scale, quality || 0.92); }
      catch (e) { console.warn('foreignObject capture failed, falling back to html2canvas', e); useForeign = false; blob = null; }
    }
    if (!blob) {
    const canvas = await window.html2canvas(root, { scale, backgroundColor: '#ffffff', useCORS: true, logging: false, width: Math.round(wPx), height: Math.round(hPx), windowWidth: Math.round(wPx), windowHeight: Math.round(hPx),
      // مننسخش باقي صفحة الموقع (ده كان بيبطّأ كل سلايد)
      ignoreElements: el => document.body.contains(el) && el !== root && !root.contains(el) && !el.contains(root) });
    blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality || 0.92));
    }
  } finally { root.remove(); dropSlideCache(pres, index); }
  return { blob, title, links, w: wPx, h: hPx, unsupported: Array.from(stats.unsupported) };
}

/* ------------------------------ بناء الـPDF ------------------------------ */
async function buildPdf(items, pres, opts) {
  const jsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  const per = opts.per || 1;
  const bytes = async b => new Uint8Array(await b.arrayBuffer());
  let doc;
  if (per === 1) {
    const wPt = pres.W / 12700, hPt = pres.H / 12700, o = wPt >= hPt ? 'l' : 'p';
    doc = new jsPDF({ orientation: o, unit: 'pt', format: [wPt, hPt], compress: true });
    for (let k = 0; k < items.length; k++) {
      if (k) doc.addPage([wPt, hPt], o);
      const it = opts.render ? Object.assign({ i: items[k].i }, await opts.render(items[k])) : items[k];
      doc.addImage(await bytes(it.blob), 'JPEG', 0, 0, wPt, hPt, 's' + it.i, 'FAST');
      const sx = wPt / it.w, sy = hPt / it.h;
      it.links.forEach(l => { try { doc.link(l.x * sx, l.y * sy, l.w * sx, l.h * sy, { url: l.url }); } catch (e) { } });
      try { if (doc.outline) doc.outline.add(null, it.title || ('Slide ' + (it.i + 1)), { pageNumber: k + 1 }); } catch (e) { }
      if (opts.onProgress) await opts.onProgress(k + 1, items.length);
    }
  } else {
    const PW = 595.28, PH = 841.89, M = 36, GAP = 16;
    const cols = per === 2 ? 1 : 2, rows = per === 2 ? 2 : per === 4 ? 2 : 3;
    doc = new jsPDF({ orientation: 'p', unit: 'pt', format: [PW, PH], compress: true });
    const cw = (PW - 2 * M - GAP * (cols - 1)) / cols, ch = (PH - 2 * M - GAP * (rows - 1)) / rows;
    const ar = pres.W / pres.H;
    for (let k = 0; k < items.length; k++) {
      const slot = k % per;
      if (k && slot === 0) doc.addPage([PW, PH], 'p');
      const col = slot % cols, row = Math.floor(slot / cols);
      let w = cw, h = cw / ar; if (h > ch - 12) { h = ch - 12; w = h * ar; }
      const x = M + col * (cw + GAP) + (cw - w) / 2, y = M + row * (ch + GAP);
      const it = opts.render ? Object.assign({ i: items[k].i }, await opts.render(items[k])) : items[k];
      doc.addImage(await bytes(it.blob), 'JPEG', x, y, w, h, 's' + it.i, 'FAST');
      doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.6); doc.rect(x, y, w, h);
      doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.text(String(it.i + 1), x + w, y + h + 10, { align: 'right' });
      if (opts.onProgress) await opts.onProgress(k + 1, items.length);
    }
  }
  try { doc.setProperties({ title: opts.title || 'Presentation', creator: 'ETO.Edu' }); } catch (e) { }
  return doc.output('blob');
}

/* ------------------------------ PDF -> PPTX ------------------------------ */
async function pdfPageToJpeg(page, scale, q) {
  const vp = page.getViewport({ scale });
  const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: g, viewport: vp }).promise;
  return { url: c.toDataURL('image/jpeg', q || .92), w: vp.width, h: vp.height, canvas: c };
}
async function pageText(page) {
  try {
    const tc = await page.getTextContent();
    let s = '';
    tc.items.forEach(it => { s += it.str; s += it.hasEOL ? '\n' : (it.str && !/\s$/.test(it.str) ? ' ' : ''); });
    return s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  } catch (e) { return ''; }
}
async function buildPptx(pdf, pageNums, opts) {
  const P = new window.PptxGenJS();
  const first = await pdf.getPage(pageNums[0]);
  const v1 = first.getViewport({ scale: 1 });
  let wIn = v1.width / 72, hIn = v1.height / 72;
  const big = Math.max(wIn, hIn); if (big > 50) { wIn *= 50 / big; hIn *= 50 / big; }
  P.defineLayout({ name: 'ETO_PDF', width: +wIn.toFixed(3), height: +hIn.toFixed(3) });
  P.layout = 'ETO_PDF';
  P.title = opts.title || 'Presentation';
  for (let k = 0; k < pageNums.length; k++) {
    const page = await pdf.getPage(pageNums[k]);
    const v = page.getViewport({ scale: 1 });
    // نفس نسبة الصفحة جوه السلايد (في حالة اختلاف المقاسات بنوسّط)
    const sc = opts.px / Math.max(v.width, v.height) ;
    const img = await pdfPageToJpeg(page, sc, opts.q);
    let w = wIn, h = (v.height / v.width) * wIn;
    if (h > hIn) { h = hIn; w = (v.width / v.height) * hIn; }
    const slide = P.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addImage({ data: img.url, x: (wIn - w) / 2, y: (hIn - h) / 2, w, h });
    if (opts.notes) { const t = await pageText(page); if (t) slide.addNotes(t); }
    img.canvas.width = img.canvas.height = 0;
    if (opts.onProgress) await opts.onProgress(k + 1, pageNums.length);
    if (opts.cancelled && opts.cancelled()) throw new Error('CANCELLED');
  }
  let out = await P.write({ outputType: 'blob' });
  if (!(out instanceof Blob)) { try { out = await P.write('blob'); } catch (e) { } }
  if (!(out instanceof Blob)) throw new Error('PPTX_WRITE');
  return out;
}

/* ------------------------------ الواجهة ------------------------------ */
function initUI() {
  if (!$('pp-file') || !$('pp-drop')) return;
  const S = { mode: 'ppt', file: null, pres: null, pdf: null, items: [], run: 0, busy: false, cancel: false, outUrl: null, warn: new Set() };
  const TQ = { q: [], on: false, io: null, lastScroll: 0 };   // طابور المعاينات الكسولة
  const MODES = {
    ppt: { accept: '.pptx,.ppsx,.potx,.pptm', title: 'اختر ملف PowerPoint', hint: 'اضغط هنا أو اسحب الملف (pptx / ppsx)', btn: 'حوّل إلى PDF', icon: 'fa-file-pdf', res: 'ملف الـPDF جاهز', ext: 'pdf', unit: 'سلايد', thumbs: 'السلايدات', badFrom: 'fa-file-powerpoint', badTo: 'fa-file-pdf' },
    pdf: { accept: '.pdf,application/pdf', title: 'اختر ملف PDF', hint: 'اضغط هنا أو اسحب الملف (pdf)', btn: 'حوّل إلى PowerPoint', icon: 'fa-file-powerpoint', res: 'ملف الـPowerPoint جاهز', ext: 'pptx', unit: 'صفحة', thumbs: 'الصفحات', badFrom: 'fa-file-pdf', badTo: 'fa-file-powerpoint' }
  };
  const QUAL = {
    ppt: [['1.5', 'متوازنة (حجم أصغر)'], ['2', 'عالية (مُوصى بيها)', true], ['3', 'أعلى جودة (حجم أكبر)']],
    pdf: [['1600', 'متوازنة (حجم أصغر)'], ['2200', 'عالية (مُوصى بيها)', true], ['3000', 'أعلى جودة (حجم أكبر)']]
  };
  const show = (id, on) => { const e = $(id); if (e) e.classList.toggle('hidden', !on); };
  const toast = (m, t) => { if (typeof showToast === 'function') showToast(m, t); };
  const fmtSize = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

  function setProgress(p, text) {
    show('pp-progress', true);
    $('pp-progress-bar').style.width = clamp(p, 0, 100) + '%';
    $('pp-progress-text').textContent = text || '';
  }
  const tick = () => new Promise(r => setTimeout(r, 0));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const whenIdle = () => new Promise(r => (window.requestIdleCallback ? window.requestIdleCallback(() => r(), { timeout: 600 }) : setTimeout(r, 80)));

  function clearOut() { if (S.outUrl) { URL.revokeObjectURL(S.outUrl); S.outUrl = null; } show('pp-result', false); }
  function resetAll() {
    S.run++; S.cancel = true;
    if (TQ.io) { TQ.io.disconnect(); TQ.io = null; } TQ.q = [];
    S.items.forEach(it => { if (it.thumb) URL.revokeObjectURL(it.thumb); });
    S.file = null; S.pres = null; S.pdf = null; S.items = []; S.warn = new Set(); S.busy = false;
    clearOut();
    $('pp-file').value = '';
    $('pp-thumbs').innerHTML = '';
    ['pp-fileinfo', 'pp-thumbs-wrap', 'pp-progress', 'pp-warn', 'pp-cancel'].forEach(id => show(id, false));
    show('pp-drop', true);
    $('pp-convert').disabled = true;
    $('pp-convert').classList.add('is-disabled');
  }
  function setMode(m) {
    if (S.busy && !confirm('فيه عملية شغالة، متأكد إنك عايز تغير الأداة؟')) return;
    S.mode = m;
    resetAll();
    const M = MODES[m];
    $('pp-file').accept = M.accept;
    $('pp-drop-title').textContent = M.title;
    $('pp-drop-hint').textContent = M.hint;
    $('pp-convert-label').textContent = M.btn;
    $('pp-convert-icon').className = 'fa-solid ' + M.icon + ' ml-2';
    $('pp-thumbs-title').textContent = M.thumbs;
    $('pp-hero-from').className = 'fa-solid ' + M.badFrom;
    $('pp-hero-to').className = 'fa-solid ' + M.badTo;
    $('pp-hero-from-lbl').textContent = m === 'ppt' ? 'PowerPoint' : 'PDF';
    $('pp-hero-to-lbl').textContent = m === 'ppt' ? 'PDF' : 'PowerPoint';
    $('page-ppt-pdf').setAttribute('data-mode', m);
    document.querySelectorAll('#page-ppt-pdf .pp-tab').forEach(t => t.classList.toggle('is-active', t.dataset.mode === m));
    const q = $('pp-quality'); q.innerHTML = QUAL[m].map(o => `<option value="${o[0]}"${o[2] ? ' selected' : ''}>${o[1]}</option>`).join('');
    show('pp-opt-per-wrap', m === 'ppt'); show('pp-opt-hidden-wrap', m === 'ppt'); show('pp-opt-notes-wrap', m === 'pdf');
    $('pp-how').innerHTML = m === 'ppt'
      ? '<li>الأداة بتقرا ملف الـPPTX وترسم كل سلايد بخطوطه وألوانه وأشكاله وصوره وجداوله.</li><li>الصفحات بتتحفظ كصور عالية الجودة جوه الـPDF، فالشكل بيطلع ثابت على أي جهاز.</li><li>الروابط والعناوين بتفضل شغالة داخل الـPDF.</li>'
      : '<li>كل صفحة PDF بتتحول لسلايد بنفس مقاس الصفحة وبنفس شكلها بالظبط.</li><li>نص الصفحة ممكن يتحط في ملاحظات السلايد عشان تنسخه وتدور فيه.</li><li>السلايدات بتفتح في PowerPoint وGoogle Slides وKeynote.</li>';
  }

  /* ---------- كروت المعاينة ---------- */
  function buildThumbs() {
    const g = $('pp-thumbs'); g.innerHTML = '';
    const ar = S.mode === 'ppt' ? S.pres.W / S.pres.H : (S.thumbAr || 1.414);
    S.items.forEach((it, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pp-thumb' + (it.selected ? ' is-on' : ''); b.dataset.i = i;
      b.innerHTML = `<div class="pp-thumb-img" style="aspect-ratio:${ar.toFixed(4)}"><div class="pp-spin"><i class="fa-solid fa-image"></i></div></div>` +
        `<span class="pp-thumb-num">${i + 1}</span><span class="pp-thumb-check"><i class="fa-solid fa-check"></i></span>` +
        (it.hidden ? '<span class="pp-thumb-tag">مخفي</span>' : '') + `<span class="pp-thumb-title"></span>`;
      b.onclick = () => { it.touched = true; it.selected = !it.selected; b.classList.toggle('is-on', it.selected); updateCount(); };
      g.appendChild(b); it.el = b;
    });
    updateCount();
  }
  function setThumb(it) {
    const src = it.tblob || it.blob;
    if (!it.el || !src) return;
    const box = it.el.querySelector('.pp-thumb-img');
    if (it.thumb) URL.revokeObjectURL(it.thumb);
    it.thumb = URL.createObjectURL(src);
    box.innerHTML = `<img src="${it.thumb}" alt="">`;
    const t = it.el.querySelector('.pp-thumb-title'); if (t) t.textContent = it.title || '';
  }
  function updateCount() {
    const n = S.items.filter(x => x.selected).length;
    $('pp-sel-count').textContent = `${n} من ${S.items.length}`;
    const ok = n > 0 && !S.busy && S.ready;
    $('pp-convert').disabled = !ok; $('pp-convert').classList.toggle('is-disabled', !ok);
  }
  /* ---------- معاينات كسولة: بنرسم بس السلايدات اللي ظاهرة على الشاشة، واحد واحد ---------- */
  function setupLazyThumbs(run) {
    if (TQ.io) TQ.io.disconnect();
    TQ.q = []; TQ.lastScroll = Date.now() + 700;   // نبدأ المعاينات بعد ما الصفحة تهدا
    TQ.io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        const it = S.items[+en.target.dataset.i];
        if (!it || it.tdone) return;
        if (en.isIntersecting) { if (!TQ.q.includes(it)) TQ.q.push(it); }
        else TQ.q = TQ.q.filter(x => x !== it);   // لو اتعدّى بسرعة في السكرول منرسمهوش
      });
      pumpThumbs(run);
    }, { root: $('pp-thumbs'), rootMargin: '250px' });
    S.items.forEach(it => it.el && TQ.io.observe(it.el));
  }
  async function pumpThumbs(run) {
    if (TQ.on) return;
    TQ.on = true;
    try {
      while (TQ.q.length && run === S.run && !S.busy) {
        // مستنيين المستخدم يبطّل سكرول، وبعدين المتصفح يبقى فاضي
        while (run === S.run && Date.now() - TQ.lastScroll < 250) await wait(100);
        await whenIdle();
        if (run !== S.run || S.busy) break;
        TQ.q.sort((x, y) => x.i - y.i);
        const it = TQ.q.shift();
        if (!it || it.tdone) continue;
        const sp = it.el && it.el.querySelector('.pp-spin i'); if (sp) sp.className = 'fa-solid fa-circle-notch fa-spin';
        try {
          const r = await renderSlide(S.pres, it.i, 0.35, .7);
          if (run !== S.run) break;
          it.tblob = r.blob; it.title = r.title;
        } catch (e) { it.tblob = await blankSlide(S.pres, it.i + 1); }
        it.tdone = true;
        setThumb(it);
        await wait(120);   // راحة بين كل معاينة والتانية
      }
    } finally { TQ.on = false; }
  }
  $('pp-sel-all').onclick = () => { S.items.forEach(it => { it.selected = true; it.el && it.el.classList.add('is-on'); }); updateCount(); };
  $('pp-sel-none').onclick = () => { S.items.forEach(it => { it.selected = false; it.el && it.el.classList.remove('is-on'); }); updateCount(); };

  /* ---------- اختيار الملف ---------- */
  async function handleFile(file) {
    if (!file) return;
    const name = file.name || '';
    const isPdf = /\.pdf$/i.test(name) || file.type === 'application/pdf';
    if (S.mode === 'ppt') {
      if (/\.ppt$/i.test(name)) { toast('صيغة .ppt القديمة مش مدعومة، افتحه في PowerPoint واحفظه كـ .pptx', 'error'); return; }
      if (!/\.(pptx|ppsx|potx|pptm)$/i.test(name)) { toast(isPdf ? 'ده ملف PDF، اختار "PDF إلى PowerPoint" من فوق' : 'اختار ملف PowerPoint بصيغة .pptx', 'error'); return; }
      if (!window.html2canvas || !window.jspdf) { toast('مكتبات التصدير لسه بتتحمل، جرّب بعد ثواني', 'error'); return; }
    } else {
      if (!isPdf) { toast(/\.pptx?$/i.test(name) ? 'ده ملف PowerPoint، اختار "PowerPoint إلى PDF" من فوق' : 'اختار ملف PDF', 'error'); return; }
      if (!window.pdfjsLib || !window.PptxGenJS) { toast('مكتبات التحويل لسه بتتحمل، جرّب بعد ثواني', 'error'); return; }
    }
    resetAll();
    const run = ++S.run; S.cancel = false;
    S.file = file; S.ready = false;
    $('pp-file-name').textContent = name;
    $('pp-file-meta').textContent = fmtSize(file.size) + ' · جاري القراءة...';
    show('pp-drop', false); show('pp-fileinfo', true);
    try {
      if (S.mode === 'ppt') await prepPpt(file, run); else await prepPdf(file, run);
    } catch (e) {
      if (run !== S.run) return;
      console.error(e);
      const m = String(e && e.message);
      toast(m === 'NOT_PPTX' ? 'الملف ده مش PowerPoint صالح أو تالف' : m === 'NO_SLIDES' ? 'الملف مفيهوش سلايدات' : m === 'NO_INFLATE' ? 'المتصفح قديم، حدّثه وجرّب تاني' : 'حصل خطأ وإحنا بنقرا الملف', 'error');
      resetAll();
    }
  }

  // فحص السلايدات المخفية على دفعات صغيرة من غير ما نعمل parse للسلايدات كلها
  async function scanHidden(run) {
    const list = S.pres.slides, n = list.length;
    for (let k = 0; k < n; k++) {
      if (run !== S.run) return;
      try {
        const t = await S.pres.pkg.text(list[k].path, 4000);
        if (t && /<(?:\w+:)?sld\b[^>]*\sshow="0"/.test(t)) {
          list[k].hidden = true;
          const it = S.items[k];
          if (it) {
            it.hidden = true;
            if (!it.touched) { it.selected = false; if (it.el) it.el.classList.remove('is-on'); }
            if (it.el && !it.el.querySelector('.pp-thumb-tag')) { const tg = document.createElement('span'); tg.className = 'pp-thumb-tag'; tg.textContent = 'مخفي'; it.el.appendChild(tg); }
          }
        }
      } catch (e) { }
      if (k % 5 === 4) { setProgress(Math.round((k + 1) / n * 100), `بنقرا السلايدات ${k + 1} من ${n}`); await wait(30); }
    }
    show('pp-progress', false);
    updateCount();
  }
  async function prepPpt(file, run) {
    await wait(50);   // نسيب الشاشة تتحدّث قبل القراءة
    const pres = await loadPresentation(file);
    if (run !== S.run) return;
    S.pres = pres;
    S.items = pres.slides.map((s, i) => ({ i, hidden: false, selected: true }));
    const inch = (pres.W / 914400).toFixed(1), inchH = (pres.H / 914400).toFixed(1);
    $('pp-file-meta').textContent = `${fmtSize(file.size)} · ${pres.slides.length} سلايد · ${inch}×${inchH} بوصة`;
    show('pp-thumbs-wrap', true);
    buildThumbs();
    await scanHidden(run);
    if (run !== S.run) return;
    S.ready = true; updateCount();
    setupLazyThumbs(run);   // المعاينات بتتحمّل واحدة واحدة على مهل
  }
  async function blankSlide(pres, n) {
    const c = document.createElement('canvas'); c.width = 1280; c.height = Math.round(1280 * pres.H / pres.W);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#94a3b8'; g.font = '32px sans-serif'; g.textAlign = 'center'; g.fillText('Slide ' + n, c.width / 2, c.height / 2);
    return new Promise(r => c.toBlob(r, 'image/jpeg', .9));
  }

  async function prepPdf(file, run) {
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await window.pdfjsLib.getDocument({ data }).promise;
    if (run !== S.run) return;
    S.pdf = pdf;
    const p1 = await pdf.getPage(1), v = p1.getViewport({ scale: 1 });
    S.thumbAr = v.width / v.height;
    S.items = Array.from({ length: pdf.numPages }, (_, i) => ({ i, selected: true }));
    $('pp-file-meta').textContent = `${fmtSize(file.size)} · ${pdf.numPages} صفحة · ${(v.width / 72).toFixed(1)}×${(v.height / 72).toFixed(1)} بوصة`;
    show('pp-thumbs-wrap', true);
    buildThumbs();
    S.ready = true; updateCount();
    // معاينات خفيفة في الخلفية
    for (const it of S.items) {
      if (run !== S.run) return;
      try {
        const page = await pdf.getPage(it.i + 1);
        const r = await pdfPageToJpeg(page, 360 / page.getViewport({ scale: 1 }).width, .8);
        const blob = await new Promise(res => r.canvas.toBlob(res, 'image/jpeg', .8));
        it.blob = blob; setThumb(it); r.canvas.width = r.canvas.height = 0;
      } catch (e) { /* مش مشكلة */ }
      if (it.i % 3 === 2) await tick();
    }
  }

  /* ---------- التحويل ---------- */
  async function convert() {
    if (S.busy || !S.ready) return;
    const run = S.run;
    const sel = S.items.filter(x => x.selected);
    if (!sel.length) { toast('اختار سلايد واحد على الأقل', 'error'); return; }
    clearOut(); S.busy = true; S.cancel = false; show('pp-cancel', true); updateCount();
    const t0 = Date.now();
    try {
      let blob, ext = MODES[S.mode].ext;
      if (S.mode === 'ppt') {
        const scale = parseFloat($('pp-quality').value) || 2;
        const per = parseInt($('pp-opt-per').value, 10) || 1;
        const list = S.items.filter(x => x.selected);
        S.warn = new Set(); show('pp-warn', false);
        setProgress(0, `جاري تحويل السلايد 1 من ${list.length}`);
        blob = await buildPdf(list, S.pres, {
          per, title: S.pres.name,
          // كل سلايد بيتحوّل ساعتها ويتحط في الـPDF مباشرة (مفيش تخزين لكل الصور مرة واحدة)
          render: async it => {
            if (S.cancel || run !== S.run) throw new Error('CANCELLED');
            try {
              const r = await renderSlide(S.pres, it.i, scale, .92);
              r.unsupported.forEach(u => S.warn.add(u));
              return r;
            } catch (e) {
              console.error('slide', it.i + 1, e);
              S.warn.add('سلايد ' + (it.i + 1) + ' معقد وظهر مبسّط');
              return { blob: await blankSlide(S.pres, it.i + 1), title: '', links: [], w: S.pres.W * PX, h: S.pres.H * PX };
            }
          },
          onProgress: async (k, n) => { setProgress(Math.round(k / n * 100), `تم تحويل ${k} من ${n}`); await tick(); if (S.cancel) throw new Error('CANCELLED'); }
        });
        if (S.warn.size) { $('pp-warn-list').textContent = Array.from(S.warn).join(' • '); show('pp-warn', true); }
      } else {
        const px = parseInt($('pp-quality').value, 10) || 2200;
        const pages = sel.map(x => x.i + 1);
        blob = await buildPptx(S.pdf, pages, { px, q: .92, notes: $('pp-opt-notes').checked, title: S.file.name.replace(/\.[^.]+$/, ''), cancelled: () => S.cancel || run !== S.run, onProgress: async (k, n) => { setProgress(Math.round(k / n * 100), `تحويل الصفحة ${k} من ${n}`); await tick(); } });
      }
      if (run !== S.run) return;
      const base = S.file.name.replace(/\.[^.]+$/, '');
      S.outUrl = URL.createObjectURL(blob);
      const a = $('pp-download'); a.href = S.outUrl; a.download = base + '.' + ext;
      $('pp-result-title').textContent = MODES[S.mode].res;
      $('pp-result-info').textContent = `${sel.length} ${MODES[S.mode].unit} · ${fmtSize(blob.size)} · ${Math.max(1, Math.round((Date.now() - t0) / 1000))} ثانية`;
      show('pp-result', true); show('pp-progress', false);
      a.click();
      toast('تم التحويل بنجاح');
      $('pp-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
      if (String(e && e.message) !== 'CANCELLED') { console.error(e); toast('حصل خطأ أثناء التحويل', 'error'); }
      show('pp-progress', false);
    } finally {
      if (run === S.run) { S.busy = false; show('pp-cancel', false); updateCount(); pumpThumbs(run); }
    }
  }

  /* ---------- ربط الأحداث ---------- */
  $('pp-file').addEventListener('change', e => handleFile(e.target.files && e.target.files[0]));
  const drop = $('pp-drop');
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', e => handleFile(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]));
  $('pp-thumbs').addEventListener('scroll', () => { TQ.lastScroll = Date.now(); }, { passive: true });
  $('pp-convert').addEventListener('click', convert);
  $('pp-cancel').addEventListener('click', () => { S.cancel = true; S.busy = false; show('pp-cancel', false); show('pp-progress', false); S.ready = !!S.file; updateCount(); pumpThumbs(S.run); toast('تم إلغاء العملية', 'error'); });
  $('pp-clear').addEventListener('click', () => { resetAll(); });
  $('pp-again').addEventListener('click', () => { resetAll(); });
  document.querySelectorAll('#page-ppt-pdf .pp-tab').forEach(t => t.addEventListener('click', () => { if (t.dataset.mode !== S.mode) setMode(t.dataset.mode); }));
  window.EtoPptPdf = { setMode, loadPresentation, buildSlide, renderSlide, buildPdf, buildPptx };
  setMode('ppt');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initUI); else initUI();
window.__EtoPptPdfCore = { loadPresentation, buildSlide, readZip, fitTexts, foreignCapture, renderSlide };
})();
