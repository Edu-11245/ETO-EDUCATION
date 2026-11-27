/* ===== الأباجورة v4 =====
   EtoLamp.mount(stage, { on, onToggle(on), sound }) => { set(on), destroy() }

   الأداء: كل حاجة ثابتة (SVG بيترسم مرة واحدة) وبتتحرك كطبقات:
   - طبقة "مطفية" (بفلتر تعتيم ثابت) + طبقة "منوّرة" فوقها، والفرق بينهم opacity بس.
   - الوميض والتوهج والغبار والبخار: opacity/transform على طبقات (GPU) من غير ما أي SVG يتعاد رسمه.
   - الحبل SVG صغير لوحده، وهو الوحيد اللي بيتحدّث وقت الحركة، وبعدها الحلقة بتقف. */
(function (root) {
  var CX = 150, TOP = 96, BOT = 240, RX = 112, RY = 14, VB = '0 0 430 500';
  var BODY = 'M104 ' + TOP + 'L196 ' + TOP + 'L262 ' + BOT + 'A' + RX + ' ' + RY + ' 0 0 0 38 ' + BOT + 'Z';
  var VASE = 'M104 482C78 470 68 430 82 392C92 364 118 350 128 342L172 342C182 350 208 364 218 392C232 430 222 470 196 482C180 490 120 490 104 482Z';

  function defs() {
    return '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
      '<linearGradient id="lpSteel" x1="0" x2="1"><stop offset="0" stop-color="#5a667f"/><stop offset=".3" stop-color="#c3cde2"/><stop offset=".5" stop-color="#f5f8ff"/><stop offset=".72" stop-color="#8c98b4"/><stop offset="1" stop-color="#4b566e"/></linearGradient>' +
      '<linearGradient id="lpBase" x1="0" x2="1"><stop offset="0" stop-color="#97a4be"/><stop offset=".2" stop-color="#dde5f1"/><stop offset=".38" stop-color="#fff"/><stop offset=".58" stop-color="#d0d9e9"/><stop offset=".82" stop-color="#97a4be"/><stop offset="1" stop-color="#6f7b96"/></linearGradient>' +
      '<linearGradient id="lpBaseV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1b2540" stop-opacity=".42"/></linearGradient>' +
      '<linearGradient id="lpShOff" x1="0" x2="1"><stop offset="0" stop-color="#56627e"/><stop offset=".3" stop-color="#8592af"/><stop offset=".5" stop-color="#a0abc6"/><stop offset=".72" stop-color="#77839f"/><stop offset="1" stop-color="#525d78"/></linearGradient>' +
      '<linearGradient id="lpShOn" x1="0" x2="1"><stop offset="0" stop-color="#dfae68"/><stop offset=".26" stop-color="#fadb9e"/><stop offset=".5" stop-color="#fff8e6"/><stop offset=".76" stop-color="#f8d595"/><stop offset="1" stop-color="#d49b55"/></linearGradient>' +
      '<linearGradient id="lpShV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>' +
      '<radialGradient id="lpIn" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8e4"/><stop offset=".55" stop-color="#ffd98f"/><stop offset="1" stop-color="#e59a3a"/></radialGradient>' +
      '<radialGradient id="lpBulbOff" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#9aa6c4"/><stop offset="1" stop-color="#3a4462"/></radialGradient>' +
      '<radialGradient id="lpBulbOn" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff1c8"/><stop offset="1" stop-color="#ffbd55"/></radialGradient>' +
      '<linearGradient id="lpCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3a8" stop-opacity=".36"/><stop offset="1" stop-color="#ffe3a8" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lpConeU" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffe3a8" stop-opacity=".26"/><stop offset="1" stop-color="#ffe3a8" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="lpPool"><stop offset="0" stop-color="#ffd993" stop-opacity=".5"/><stop offset="1" stop-color="#ffd993" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lpShadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="lpDesk" x1="0" x2="1"><stop offset="0" stop-color="#1c2846" stop-opacity="0"/><stop offset=".22" stop-color="#1c2846" stop-opacity=".95"/><stop offset=".78" stop-color="#1c2846" stop-opacity=".95"/><stop offset="1" stop-color="#1c2846" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lpDeskT" x1="0" x2="1"><stop offset="0" stop-color="#7f93c2" stop-opacity="0"/><stop offset=".5" stop-color="#7f93c2" stop-opacity=".5"/><stop offset="1" stop-color="#7f93c2" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lpDeskTo" x1="0" x2="1"><stop offset="0" stop-color="#ffdfa6" stop-opacity="0"/><stop offset=".34" stop-color="#ffdfa6" stop-opacity=".85"/><stop offset="1" stop-color="#ffdfa6" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lpMug" x1="0" x2="1"><stop offset="0" stop-color="#aeb9d0"/><stop offset=".35" stop-color="#fff"/><stop offset="1" stop-color="#9ba7c0"/></linearGradient>' +
      '<linearGradient id="lpPot" x1="0" x2="1"><stop offset="0" stop-color="#8b97b1"/><stop offset=".4" stop-color="#e6ecf6"/><stop offset="1" stop-color="#7d89a4"/></linearGradient>' +
      '<radialGradient id="lpKnob" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#b9c6e6"/><stop offset="1" stop-color="#445076"/></radialGradient>' +
      '</defs></svg>';
  }

  function pleats() {
    var dk = '', lt = '', i, t, bx, by, tx;
    for (i = 1; i < 20; i++) {
      t = i / 20; bx = 38 + 224 * t; tx = 104 + 92 * t;
      by = BOT - RY * Math.sqrt(Math.max(0, 1 - Math.pow((bx - CX) / RX, 2)));
      dk += 'M' + tx.toFixed(1) + ' ' + TOP + 'L' + bx.toFixed(1) + ' ' + by.toFixed(1);
      lt += 'M' + (tx + 1.6).toFixed(1) + ' ' + TOP + 'L' + (bx + 3.4).toFixed(1) + ' ' + (by + .2).toFixed(1);
    }
    return '<path d="' + dk + '" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="1"/><path d="' + lt + '" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>';
  }

  function book(x, y, w, h, c, d) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="' + c + '"/>' +
      '<rect x="' + (x + 7) + '" y="' + (y + 3) + '" width="' + (w - 10) + '" height="' + (h - 6) + '" rx="1" fill="#e4e9f3"/>' +
      '<path d="M' + (x + 7) + ' ' + (y + h / 2) + 'H' + (x + w - 3) + '" stroke="#98a5c2" stroke-width=".8"/>' +
      '<rect x="' + x + '" y="' + y + '" width="7" height="' + h + '" rx="2" fill="' + d + '"/>';
  }

  /* مكتب + حاجات صغيرة (كتب، كوباية، نبتة) */
  function scene(on) {
    return '<ellipse cx="150" cy="488" rx="100" ry="11" fill="url(#lpShadow)"/>' +
      '<rect x="-220" y="486" width="870" height="80" fill="url(#lpDesk)"/><rect x="-220" y="485.4" width="870" height="1.8" fill="url(#' + (on ? 'lpDeskTo' : 'lpDeskT') + ')"/>' +
      book(282, 466, 92, 20, '#2563eb', '#1d4ed8') + book(288, 450, 80, 16, '#51607e', '#3f4b66') + book(284, 436, 84, 14, '#b9772f', '#96601f') +
      '<path d="M339 413C353 413 353 429 338 429" fill="none" stroke="#d5deee" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="305" y="404" width="34" height="32" rx="7" fill="url(#lpMug)"/><ellipse cx="322" cy="405" rx="16" ry="4" fill="#59391f" stroke="#e6ecf7" stroke-width="1.6"/>' +
      '<path d="M386 462H416L412 486H390Z" fill="url(#lpPot)"/><rect x="384" y="458" width="34" height="7" rx="3" fill="url(#lpPot)"/>' +
      '<path d="M401 460C390 450 388 434 396 424C404 434 406 450 401 460Z" fill="#2d8656"/><path d="M401 460C412 452 418 438 414 426C404 436 400 450 401 460Z" fill="#38a068"/><path d="M401 460C397 446 400 430 401 416C405 432 406 448 401 460Z" fill="#267548"/>' +
      (on ? '<path d="M283 436H366M305 404.5H339" stroke="#ffe7b8" stroke-opacity=".7" stroke-width="1.3" stroke-linecap="round"/>' : '');
  }

  function lamp(on) {
    return '<svg viewBox="' + VB + '" width="100%" height="100%" aria-hidden="true">' + scene(on) +
      /* القاعدة: سيراميك أبيض لامع */
      '<path d="' + VASE + '" fill="url(#lpBase)"/><path d="' + VASE + '" fill="url(#lpBaseV)"/>' +
      '<path d="M120 346C96 380 92 440 112 484M150 344C142 390 142 440 150 488M180 346C204 380 208 440 188 484" fill="none" stroke="#1b2540" stroke-opacity=".1"/>' +
      '<path d="M93 412C91 392 99 376 115 360" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="6" stroke-linecap="round"/><circle cx="97" cy="424" r="3" fill="#fff"/>' +
      '<path d="M215 404C217 424 211 450 196 472" fill="none" stroke="#a9c1ff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="150" cy="486" rx="46" ry="5" fill="#1b2540" fill-opacity=".45"/>' +
      (on ? '<ellipse cx="150" cy="352" rx="44" ry="8" fill="#ffdca0" fill-opacity=".38"/>' : '') +
      /* العمود والمقبس */
      '<rect x="144" y="268" width="12" height="76" fill="url(#lpSteel)"/><rect x="139" y="326" width="22" height="9" rx="4" fill="url(#lpSteel)"/><rect x="141" y="296" width="18" height="6" rx="3" fill="url(#lpSteel)"/><rect x="124" y="336" width="52" height="11" rx="5" fill="url(#lpSteel)"/>' +
      /* داخل الأباجورة + اللمبة */
      '<ellipse cx="150" cy="' + BOT + '" rx="' + RX + '" ry="' + RY + '" fill="' + (on ? 'url(#lpIn)' : '#0a1020') + '"/>' +
      '<circle cx="150" cy="233" r="22" fill="url(#' + (on ? 'lpBulbOn' : 'lpBulbOff') + ')"/>' +
      (on ? '<path d="M142 241L146 232L150 241L154 232L158 241" fill="none" stroke="#ff9d2e" stroke-width="1.6" stroke-linejoin="round"/>' : '') +
      '<path d="M138 236C139 244 145 249 152 250" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="134" y="253" width="32" height="17" rx="4" fill="url(#lpSteel)"/><path d="M135 258H165M135 263H165" stroke="#000" stroke-opacity=".22"/>' +
      /* الشيد */
      '<path d="' + BODY + '" fill="url(#' + (on ? 'lpShOn' : 'lpShOff') + ')"/><path d="' + BODY + '" fill="url(#lpShV)"/>' + pleats() +
      '<path d="M262 ' + BOT + 'A' + RX + ' ' + RY + ' 0 0 0 38 ' + BOT + '" fill="none" stroke="url(#lpSteel)" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="150" cy="' + TOP + '" rx="46" ry="5" fill="' + (on ? '#ffe6b0' : '#171f34') + '" stroke="url(#lpSteel)" stroke-width="2.4"/></svg>';
  }

  function back() {
    return '<svg viewBox="' + VB + '" width="100%" height="100%" aria-hidden="true">' +
      '<ellipse cx="150" cy="486" rx="200" ry="26" fill="url(#lpPool)"/>' +
      '<polygon points="50,246 250,246 335,484 -35,484" fill="url(#lpCone)"/><polygon points="108,96 192,96 236,-60 64,-60" fill="url(#lpConeU)"/></svg>';
  }

  function ropeSvg() {
    return '<svg class="rp" viewBox="' + VB + '" width="100%" height="100%" aria-hidden="true"><g transform="translate(226 250)">' +
      '<path class="rope" d="M0 0Q0 32 0 64" fill="none" stroke="#cfd8ef" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0 5.2"/>' +
      '<g class="hnd" transform="translate(0 64)"><circle class="ring" cx="0" cy="16" r="10" fill="none" stroke="#9db8ff" stroke-width="1.5"/>' +
      '<rect x="-2.5" y="-1" width="5" height="8" rx="2" fill="url(#lpSteel)"/><path d="M0 6C-8 16-7 26 0 28C7 26 8 16 0 6Z" fill="url(#lpKnob)"/>' +
      '<ellipse cx="-2.4" cy="15" rx="1.6" ry="4.2" fill="#fff" opacity=".7"/><circle class="hit" cx="0" cy="16" r="26" fill="rgba(0,0,0,0)" pointer-events="all"/></g></g></svg>';
  }

  /* غبار نور + بخار الكوباية: عناصر HTML صغيرة بتتحرك على الـ GPU */
  function extras() {
    var M = [[27, 64, 14, 6.5, 0], [35, 72, -16, 8, 1.4], [44, 60, 12, 7.2, 2.6], [22, 80, 10, 9, .8], [52, 76, -12, 6.8, 3.4], [32, 88, 16, 8.4, 2], [40, 68, -9, 7.6, 4.2]], h = '', i;
    for (i = 0; i < M.length; i++) h += '<i class="mote" style="left:' + M[i][0] + '%;top:' + M[i][1] + '%;--dx:' + M[i][2] + 'px;--d:' + M[i][3] + 's;--dl:' + M[i][4] + 's"></i>';
    return h + '<i class="steam" style="left:73.4%"></i><i class="steam s2" style="left:75.6%"></i>';
  }

  var AC = null;
  function click() {
    try {
      AC = AC || new (root.AudioContext || root.webkitAudioContext)();
      var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(260, t + .05);
      g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.0008, t + .07);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .08);
    } catch (e) {}
  }

  function mount(stage, o) {
    o = o || {};
    var el = document.createElement('div');
    el.className = 'au-lamp'; el.tabIndex = 0;
    el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'الأباجورة. اسحب الحبل لتحت');
    el.innerHTML = defs() + '<div class="lb">' + back() + '</div><div class="rot"><div class="lo">' + lamp(false) + '</div><div class="lf">' + lamp(true) + '</div><div class="au-halo"></div>' + ropeSvg() + '</div>' + extras();
    (stage.querySelector('.au-scene') || stage).appendChild(el);

    var on = !!o.on;
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) el.classList.add('lit');

    var svgEl = el.querySelector('.rp'), rope = el.querySelector('.rope'), hnd = el.querySelector('.hnd'), hit = el.querySelector('.hit'), rot = el.querySelector('.rot');
    var LEN = 64, MAX = 34, TH = 19;
    var Y = 0, VY = 0, T = 0, W = 0;
    var raf = 0, lastT = 0, drag = false, x0 = 0, y0 = 0, k = 1, moved = false, fired = false, dead = false, flT = 0, side = 1, mvT = 0;

    function paint() {
      var L = LEN + Y, hx = L * Math.sin(T), hy = L * Math.cos(T);
      var cx = hx * 0.5 - Math.max(-12, Math.min(12, W * 2.4)), cy = hy * 0.5;
      rope.setAttribute('d', 'M0 0Q' + cx.toFixed(2) + ' ' + cy.toFixed(2) + ' ' + hx.toFixed(2) + ' ' + hy.toFixed(2));
      hnd.setAttribute('transform', 'translate(' + hx.toFixed(2) + ' ' + hy.toFixed(2) + ') rotate(' + (-Math.atan2(hx - cx, hy - cy) * 57.3).toFixed(1) + ')');
      rot.style.transform = 'rotate(' + (Y * 0.03 + T * 0.5).toFixed(3) + 'deg)';
    }
    function setFl(v) { el.classList.toggle('fl', v); stage.classList.toggle('fl', v); }
    function flip() {
      on = !on;
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      el.classList.toggle('lit', on);
      clearTimeout(flT); setFl(false);
      if (on) { void el.offsetWidth; setFl(true); flT = setTimeout(function () { setFl(false); }, 900); }
      if (o.sound !== false) click();
    }
    function notify() { if (o.onToggle) o.onToggle(on); }

    function loop(t) {
      if (dead || drag) { raf = 0; return; }
      if (!el.isConnected) { destroy(); return; }
      var dt = Math.min(0.032, (t - lastT) / 1000 || 0.016); lastT = t;
      VY += (-240 * Y - 10 * VY) * dt; Y += VY * dt;
      W += (-26 * Math.sin(T) - 1.25 * W) * dt; T += W * dt;
      if (Math.abs(Y) < 0.04 && Math.abs(VY) < 0.6 && Math.abs(T) < 0.002 && Math.abs(W) < 0.02) { Y = 0; VY = 0; T = 0; W = 0; paint(); el.classList.remove('mv'); raf = 0; return; }
      paint(); raf = requestAnimationFrame(loop);
    }
    function spring() { if (raf) return; el.classList.add('mv'); lastT = performance.now(); raf = requestAnimationFrame(loop); }
    function kick(vy, w) { side = -side; Y = 0; VY = vy; W += side * w; spring(); }
    function pull() { flip(); notify(); kick(380, 2.6); }

    hit.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      e.preventDefault();
      drag = true; moved = false; fired = false; x0 = e.clientX; y0 = e.clientY; mvT = performance.now();
      k = (svgEl.getBoundingClientRect().width / 430) || 1;
      cancelAnimationFrame(raf); raf = 0; VY = 0; W = 0;
      try { hit.setPointerCapture(e.pointerId); } catch (er) {}
      el.classList.add('dg', 'mv');
    });
    hit.addEventListener('pointermove', function (e) {
      if (!drag) {
        if (e.movementX) { W = Math.max(-1.6, Math.min(1.6, W + e.movementX * 0.012)); spring(); }
        return;
      }
      var dx = (e.clientX - x0) / k, raw = Math.max(0, (e.clientY - y0) / k), now = performance.now();
      if (raw > 3 || Math.abs(dx) > 3) moved = true;
      Y = MAX * Math.tanh(raw / (MAX * 0.9));
      var nt = Math.max(-0.75, Math.min(0.75, Math.atan2(dx * 0.9, LEN + Y))), dt = Math.max(0.008, (now - mvT) / 1000);
      W = W * 0.6 + ((nt - T) / dt) * 0.4; T = nt; mvT = now;
      if (!fired && Y >= TH) { fired = true; flip(); notify(); }
      paint();
    });
    function up() {
      if (!drag) return;
      drag = false; el.classList.remove('dg');
      if (!moved && !fired) { pull(); return; }
      W = Math.max(-6, Math.min(6, W)); VY = 0;
      if (fired) { side = W >= 0 ? 1 : -1; W += side * 1.2; }
      spring();
    }
    hit.addEventListener('pointerup', up);
    hit.addEventListener('pointercancel', function () { moved = true; up(); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pull(); }
    });

    function destroy() {
      if (dead) return;
      dead = true; cancelAnimationFrame(raf); clearTimeout(flT);
      stage.classList.remove('fl');
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    paint();
    return {
      set: function (v) { v = !!v; if (v === on) return; flip(); kick(300, 2); },
      destroy: destroy
    };
  }
  root.EtoLamp = { mount: mount };
})(window);
