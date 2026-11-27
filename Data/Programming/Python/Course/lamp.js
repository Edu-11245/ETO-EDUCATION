/* ===== الأباجورة (SVG ثابت + حبل بندول) =====
   EtoLamp.mount(stage, { on, onToggle(on) }) => { set(on), destroy() }
   - مفيش canvas ولا WebGL ولا حلقة رسم شغالة طول الوقت.
   - الإضاءة والوميض: CSS opacity بس (auth.css).
   - الـ JS بيحرّك الحبل (سحب + ارتداد + أرجحة يمين وشمال) وبعدين بيقف لوحده. */
(function (root) {
  var CX = 150, TOP = 96, BOT = 240, RX = 112, RY = 14;
  var BODY = 'M104 ' + TOP + 'L196 ' + TOP + 'L262 ' + BOT + 'A' + RX + ' ' + RY + ' 0 0 0 38 ' + BOT + 'Z';

  function pleats() {
    var dk = '', lt = '', i, t, bx, by, tx;
    for (i = 1; i < 20; i++) {
      t = i / 20; bx = 38 + 224 * t; tx = 104 + 92 * t;
      by = BOT - RY * Math.sqrt(Math.max(0, 1 - Math.pow((bx - CX) / RX, 2)));
      dk += 'M' + tx.toFixed(1) + ' ' + TOP + 'L' + bx.toFixed(1) + ' ' + by.toFixed(1);
      lt += 'M' + (tx + 1.6).toFixed(1) + ' ' + TOP + 'L' + (bx + 3.4).toFixed(1) + ' ' + (by + .2).toFixed(1);
    }
    return '<path d="' + dk + '" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1"/>' +
           '<path d="' + lt + '" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="1"/>';
  }

  function svg() {
    return '<svg viewBox="0 0 300 500" width="100%" height="100%" aria-hidden="true"><defs>' +
      '<linearGradient id="lpSteel" x1="0" x2="1"><stop offset="0" stop-color="#2f3a60"/><stop offset=".3" stop-color="#a9b8e0"/><stop offset=".5" stop-color="#f1f5ff"/><stop offset=".72" stop-color="#6677a6"/><stop offset="1" stop-color="#262f52"/></linearGradient>' +
      '<linearGradient id="lpBase" x1="0" x2="1"><stop offset="0" stop-color="#0a1126"/><stop offset=".2" stop-color="#1f2d5e"/><stop offset=".38" stop-color="#4d69b4"/><stop offset=".55" stop-color="#293a76"/><stop offset=".8" stop-color="#121b3a"/><stop offset="1" stop-color="#080d1d"/></linearGradient>' +
      '<linearGradient id="lpBaseV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
      '<linearGradient id="lpShOff" x1="0" x2="1"><stop offset="0" stop-color="#1a2240"/><stop offset=".3" stop-color="#3c4a78"/><stop offset=".5" stop-color="#52639a"/><stop offset=".72" stop-color="#34416b"/><stop offset="1" stop-color="#151c35"/></linearGradient>' +
      '<linearGradient id="lpShOn" x1="0" x2="1"><stop offset="0" stop-color="#d49a58"/><stop offset=".26" stop-color="#f9d596"/><stop offset=".5" stop-color="#fff6e0"/><stop offset=".76" stop-color="#f7cd88"/><stop offset="1" stop-color="#c98b45"/></linearGradient>' +
      '<linearGradient id="lpShV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>' +
      '<radialGradient id="lpIn" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8e4"/><stop offset=".55" stop-color="#ffd98f"/><stop offset="1" stop-color="#e59a3a"/></radialGradient>' +
      '<radialGradient id="lpBulbOff" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#7584ad"/><stop offset="1" stop-color="#1f2640"/></radialGradient>' +
      '<radialGradient id="lpBulbOn" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff1c8"/><stop offset="1" stop-color="#ffbd55"/></radialGradient>' +
      '<radialGradient id="lpHalo"><stop offset="0" stop-color="#ffe0a0" stop-opacity=".8"/><stop offset=".4" stop-color="#ffc070" stop-opacity=".22"/><stop offset="1" stop-color="#ffc070" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="lpCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0a0" stop-opacity=".34"/><stop offset="1" stop-color="#ffe0a0" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="lpFloor"><stop offset="0" stop-color="#ffd590" stop-opacity=".4"/><stop offset="1" stop-color="#ffd590" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lpShadow"><stop offset="0" stop-color="#000" stop-opacity=".65"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lpKnob" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#aebce3"/><stop offset="1" stop-color="#36416a"/></radialGradient>' +
      '</defs>' +

      '<ellipse cx="150" cy="487" rx="96" ry="11" fill="url(#lpShadow)"/>' +
      '<g class="L"><ellipse cx="150" cy="485" rx="190" ry="24" fill="url(#lpFloor)"/><polygon points="50,246 250,246 335,482 -35,482" fill="url(#lpCone)"/></g>' +

      '<g class="body">' +
      /* القاعدة: فازة زجاجية لامعة */
      '<path d="M104 482C78 470 68 430 82 392C92 364 118 350 128 342L172 342C182 350 208 364 218 392C232 430 222 470 196 482C180 490 120 490 104 482Z" fill="url(#lpBase)"/>' +
      '<path d="M104 482C78 470 68 430 82 392C92 364 118 350 128 342L172 342C182 350 208 364 218 392C232 430 222 470 196 482C180 490 120 490 104 482Z" fill="url(#lpBaseV)"/>' +
      '<path d="M120 346C96 380 92 440 112 484M150 344C142 390 142 440 150 488M180 346C204 380 208 440 188 484" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/>' +
      '<path d="M92 412C90 392 98 376 114 360" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="96" cy="424" r="3" fill="#fff" fill-opacity=".5"/>' +
      '<path d="M215 404C217 424 211 450 196 472" fill="none" stroke="#8fb0ff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse class="L" cx="150" cy="352" rx="46" ry="9" fill="#ffdca0" fill-opacity=".28"/>' +
      '<ellipse cx="150" cy="486" rx="46" ry="5" fill="#05080f" fill-opacity=".7"/>' +

      /* العمود والمقبس */
      '<rect x="144" y="268" width="12" height="76" fill="url(#lpSteel)"/>' +
      '<rect x="139" y="326" width="22" height="9" rx="4" fill="url(#lpSteel)"/><rect x="141" y="296" width="18" height="6" rx="3" fill="url(#lpSteel)"/>' +
      '<rect x="124" y="336" width="52" height="11" rx="5" fill="url(#lpSteel)"/>' +

      /* داخل الأباجورة + اللمبة */
      '<ellipse cx="150" cy="' + BOT + '" rx="' + RX + '" ry="' + RY + '" fill="#080c18"/><ellipse class="L" cx="150" cy="' + BOT + '" rx="' + RX + '" ry="' + RY + '" fill="url(#lpIn)"/>' +
      '<circle cx="150" cy="233" r="22" fill="url(#lpBulbOff)"/><circle class="L" cx="150" cy="233" r="22" fill="url(#lpBulbOn)"/>' +
      '<path class="L" d="M142 241L146 232L150 241L154 232L158 241" fill="none" stroke="#ff9d2e" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M138 236C139 244 145 249 152 250" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="134" y="253" width="32" height="17" rx="4" fill="url(#lpSteel)"/><path d="M135 258H165M135 263H165" stroke="#000" stroke-opacity=".25"/>' +
      '<circle class="L halo" cx="150" cy="236" r="96" fill="url(#lpHalo)"/>' +

      /* جسم الأباجورة (قماش مطوي) */
      '<path d="' + BODY + '" fill="url(#lpShOff)"/><path class="L" d="' + BODY + '" fill="url(#lpShOn)"/><path d="' + BODY + '" fill="url(#lpShV)"/>' +
      pleats() +
      '<path d="M262 ' + BOT + 'A' + RX + ' ' + RY + ' 0 0 0 38 ' + BOT + '" fill="none" stroke="url(#lpSteel)" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="150" cy="' + TOP + '" rx="46" ry="5" fill="#131a2e" stroke="url(#lpSteel)" stroke-width="2.4"/><ellipse class="L" cx="150" cy="' + TOP + '" rx="40" ry="3.6" fill="#ffe6b0"/>' +

      /* الحبل */
      '<g transform="translate(226 250)">' +
      '<path class="rope" d="M0 0Q0 32 0 64" fill="none" stroke="#c7d1ee" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0 5.2"/>' +
      '<g class="hnd" transform="translate(0 64)">' +
      '<circle class="ring" cx="0" cy="16" r="10" fill="none" stroke="#9db8ff" stroke-width="1.5"/>' +
      '<rect x="-2.5" y="-1" width="5" height="8" rx="2" fill="url(#lpSteel)"/>' +
      '<path d="M0 6C-8 16-7 26 0 28C7 26 8 16 0 6Z" fill="url(#lpKnob)"/><ellipse cx="-2.4" cy="15" rx="1.6" ry="4.2" fill="#fff" opacity=".6"/>' +
      '<circle class="hit" cx="0" cy="16" r="26" fill="rgba(0,0,0,0)" pointer-events="all"/></g></g>' +
      '</g></svg>';
  }

  function mount(stage, o) {
    o = o || {};
    var el = document.createElement('div');
    el.className = 'au-lamp'; el.tabIndex = 0;
    el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'الأباجورة. اسحب الحبل لتحت');
    el.innerHTML = svg();
    stage.insertBefore(el, stage.querySelector('.au-stat'));

    var on = !!o.on;
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) el.classList.add('lit');

    var svgEl = el.querySelector('svg'), rope = el.querySelector('.rope'), hnd = el.querySelector('.hnd'),
        hit = el.querySelector('.hit'), body = el.querySelector('.body');
    var LEN = 64, MAX = 34, TH = 19;
    var Y = 0, VY = 0, T = 0, W = 0;          /* Y: شدّ الحبل، T: زاوية الأرجحة، W: سرعتها */
    var raf = 0, lastT = 0, drag = false, x0 = 0, y0 = 0, k = 1, moved = false, fired = false, dead = false, flT = 0, side = 1, mvT = 0;

    function paint() {
      var L = LEN + Y, hx = L * Math.sin(T), hy = L * Math.cos(T);
      var cx = hx * 0.5 - Math.max(-12, Math.min(12, W * 2.4)), cy = hy * 0.5;
      rope.setAttribute('d', 'M0 0Q' + cx.toFixed(2) + ' ' + cy.toFixed(2) + ' ' + hx.toFixed(2) + ' ' + hy.toFixed(2));
      hnd.setAttribute('transform', 'translate(' + hx.toFixed(2) + ' ' + hy.toFixed(2) + ') rotate(' + (-Math.atan2(hx - cx, hy - cy) * 57.3).toFixed(1) + ')');
      body.setAttribute('transform', 'rotate(' + (Y * 0.03 + T * 0.5).toFixed(3) + ' 150 484)');
    }
    function setFl(v) {
      el.classList.toggle('fl', v); stage.classList.toggle('fl', v);
    }
    function flip() {
      on = !on;
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      el.classList.toggle('lit', on);
      clearTimeout(flT); setFl(false);
      if (on) { void el.offsetWidth; setFl(true); flT = setTimeout(function () { setFl(false); }, 900); }
    }
    function notify() { if (o.onToggle) o.onToggle(on); }

    function loop(t) {
      if (dead || drag) { raf = 0; return; }
      if (!el.isConnected) { destroy(); return; }
      var dt = Math.min(0.032, (t - lastT) / 1000 || 0.016); lastT = t;
      VY += (-240 * Y - 10 * VY) * dt; Y += VY * dt;
      W += (-26 * Math.sin(T) - 1.25 * W) * dt; T += W * dt;
      if (Math.abs(Y) < 0.04 && Math.abs(VY) < 0.6 && Math.abs(T) < 0.002 && Math.abs(W) < 0.02) { Y = 0; VY = 0; T = 0; W = 0; paint(); raf = 0; return; }
      paint(); raf = requestAnimationFrame(loop);
    }
    function spring() { if (raf) return; lastT = performance.now(); raf = requestAnimationFrame(loop); }
    function kick(vy, w) { side = -side; Y = 0; VY = vy; W += side * w; spring(); }
    function pull() { flip(); notify(); kick(380, 2.6); }

    hit.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      e.preventDefault();
      drag = true; moved = false; fired = false; x0 = e.clientX; y0 = e.clientY; mvT = performance.now();
      k = (svgEl.getBoundingClientRect().width / 300) || 1;
      cancelAnimationFrame(raf); raf = 0; VY = 0; W = 0;
      try { hit.setPointerCapture(e.pointerId); } catch (er) {}
      el.classList.add('dg');
    });
    hit.addEventListener('pointermove', function (e) {
      if (!drag) {
        /* لمسة الماوس الخفيفة: الحبل بيتهز بحسب اتجاه الماوس */
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
