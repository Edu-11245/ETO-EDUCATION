/* ===== الأباجورة (SVG خفيف + حبل بنابض) =====
   EtoLamp.mount(stage, { on, onToggle(on) }) => { set(on), destroy() }
   - مفيش canvas ولا WebGL ولا requestAnimationFrame شغال طول الوقت.
   - النور والوميض والتوهج كلهم CSS transition/animation على opacity (في auth.css).
   - الـ JS بس بيحرّك الحبل وقت السحب والارتداد، وبعدين بيقف خالص. */
(function (root) {
  var MET = '<linearGradient id="lpMetal" x1="0" x2="1"><stop offset="0" stop-color="#3f2d0e"/><stop offset=".25" stop-color="#cf9f48"/><stop offset=".48" stop-color="#f7de9f"/><stop offset=".74" stop-color="#97691f"/><stop offset="1" stop-color="#33240a"/></linearGradient>';

  function pleats() {
    var d = '', i, t, bx, by;
    for (i = 1; i < 14; i++) {
      t = i / 14; bx = 38 + 224 * t;
      by = 258 - 14 * Math.sqrt(Math.max(0, 1 - Math.pow((bx - 150) / 112, 2)));
      d += 'M' + (104 + 92 * t).toFixed(1) + ' 112L' + bx.toFixed(1) + ' ' + by.toFixed(1);
    }
    return d;
  }

  var BODY = 'M104 112L196 112L262 258A112 14 0 0 0 38 258Z';

  function svg() {
    return '<svg viewBox="0 0 300 520" width="100%" height="100%" aria-hidden="true">' +
      '<defs>' + MET +
      '<radialGradient id="lpKnob" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff3c9"/><stop offset=".45" stop-color="#d9a94f"/><stop offset="1" stop-color="#5a3d12"/></radialGradient>' +
      '<linearGradient id="lpShOff" x1="0" x2="1"><stop offset="0" stop-color="#1f2740"/><stop offset=".34" stop-color="#4c5877"/><stop offset=".6" stop-color="#3d4766"/><stop offset="1" stop-color="#1a2034"/></linearGradient>' +
      '<linearGradient id="lpShOn" x1="0" x2="1"><stop offset="0" stop-color="#e49a3e"/><stop offset=".3" stop-color="#ffe0a0"/><stop offset=".55" stop-color="#fff4d9"/><stop offset=".8" stop-color="#ffd185"/><stop offset="1" stop-color="#d4882f"/></linearGradient>' +
      '<linearGradient id="lpShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>' +
      '<radialGradient id="lpBulbOff" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#6a7391"/><stop offset="1" stop-color="#252a3b"/></radialGradient>' +
      '<radialGradient id="lpBulbOn" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff0c4"/><stop offset="1" stop-color="#ffb84a"/></radialGradient>' +
      '<radialGradient id="lpHalo"><stop offset="0" stop-color="#ffd58a" stop-opacity=".75"/><stop offset=".45" stop-color="#ffb55a" stop-opacity=".22"/><stop offset="1" stop-color="#ffb55a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="lpConeD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd48a" stop-opacity=".42"/><stop offset="1" stop-color="#ffd48a" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lpConeU" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd48a" stop-opacity=".3"/><stop offset="1" stop-color="#ffd48a" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="lpFloor"><stop offset="0" stop-color="#ffc878" stop-opacity=".42"/><stop offset="1" stop-color="#ffc878" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lpShadow"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      '<g id="lpParts"><path d="M58 480C58 462 100 456 150 456C200 456 242 462 242 480C242 494 200 500 150 500C100 500 58 494 58 480Z"/>' +
      '<rect x="143" y="276" width="14" height="186"/><rect x="137" y="436" width="26" height="14" rx="5"/><rect x="139" y="322" width="22" height="9" rx="4"/><rect x="136" y="268" width="28" height="14" rx="4"/></g>' +
      '</defs>' +

      /* ظل الأرض + بقعة الضوء + أقماع الضوء (ظاهرة بس لما تنوّر) */
      '<ellipse cx="150" cy="494" rx="104" ry="13" fill="url(#lpShadow)"/>' +
      '<g class="L"><ellipse cx="150" cy="492" rx="200" ry="28" fill="url(#lpFloor)"/>' +
      '<polygon points="46,262 254,262 350,500 -50,500" fill="url(#lpConeD)"/>' +
      '<polygon points="108,112 192,112 236,-60 64,-60" fill="url(#lpConeU)"/></g>' +

      /* القاعدة والعمود (معدن + طبقة ليل بتختفي لما تنوّر) */
      '<use href="#lpParts" fill="url(#lpMetal)"/>' +
      '<ellipse cx="150" cy="460" rx="80" ry="8" fill="url(#lpMetal)"/><ellipse cx="132" cy="458.5" rx="38" ry="2.6" fill="#fff" opacity=".32"/>' +
      '<circle cx="150" cy="384" r="11" fill="url(#lpKnob)"/>' +
      '<g class="D"><use href="#lpParts" fill="#050914"/><ellipse cx="150" cy="460" rx="80" ry="8" fill="#050914"/><circle cx="150" cy="384" r="11" fill="#050914"/></g>' +

      /* داخل الأباجورة + اللمبة */
      '<ellipse cx="150" cy="258" rx="112" ry="14" fill="#0a0f1d"/><ellipse class="L" cx="150" cy="258" rx="112" ry="14" fill="#ffcf80"/>' +
      '<circle cx="150" cy="254" r="19" fill="url(#lpBulbOff)"/><circle class="L" cx="150" cy="254" r="19" fill="url(#lpBulbOn)"/>' +
      '<circle class="L" cx="150" cy="254" r="70" fill="url(#lpHalo)"/>' +

      /* جسم الأباجورة */
      '<path d="' + BODY + '" fill="url(#lpShOff)"/><path class="L" d="' + BODY + '" fill="url(#lpShOn)"/>' +
      '<path d="' + BODY + '" fill="url(#lpShade)"/>' +
      '<path d="' + pleats() + '" fill="none" stroke="#000" stroke-opacity=".13" stroke-width="1"/>' +
      '<path d="M262 258A112 14 0 0 0 38 258" fill="none" stroke="url(#lpMetal)" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="150" cy="112" rx="46" ry="5" fill="#141a2c" stroke="url(#lpMetal)" stroke-width="2.4"/><ellipse class="L" cx="150" cy="112" rx="40" ry="3.6" fill="#ffe3a6"/>' +

      /* الحبل + الحلقة */
      '<g transform="translate(222 269)">' +
      '<line class="chain" x1="0" y1="0" x2="0" y2="90" stroke="#cfd5e4" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0 5.4"/>' +
      '<g class="hnd" transform="translate(0 90)">' +
      '<circle class="ring" cx="0" cy="15" r="11" fill="none" stroke="#fbbf24" stroke-width="1.6"/>' +
      '<path d="M0 2C-9 14-8 26 0 28C8 26 9 14 0 2Z" fill="url(#lpKnob)"/><ellipse cx="-2.6" cy="14" rx="1.7" ry="4.4" fill="#fff" opacity=".55"/>' +
      '<circle class="hit" cx="0" cy="15" r="28" fill="rgba(0,0,0,0)" pointer-events="all"/></g></g>' +
      '</svg>';
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

    var svgEl = el.querySelector('svg'), line = el.querySelector('.chain'), hnd = el.querySelector('.hnd'), hit = el.querySelector('.hit');
    var LEN = 90, MAX = 46, TH = 26;
    var Y = 0, V = 0, raf = 0, lastT = 0, drag = false, y0 = 0, k = 1, moved = false, fired = false, dead = false, flT = 0;

    function paint() {
      line.setAttribute('y2', LEN + Y);
      hnd.setAttribute('transform', 'translate(0 ' + (LEN + Y).toFixed(2) + ')');
    }
    function flip() {
      on = !on;
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      el.classList.toggle('lit', on);
      clearTimeout(flT); el.classList.remove('fl');
      if (on) {
        void el.offsetWidth; el.classList.add('fl');
        flT = setTimeout(function () { el.classList.remove('fl'); }, 900);
      }
    }
    function notify() { if (o.onToggle) o.onToggle(on); }

    /* نابض: بيشتغل بس وقت الارتداد وبعدين بيقف */
    function loop(t) {
      if (dead || drag) { raf = 0; return; }
      if (!el.isConnected) { destroy(); return; }
      var dt = Math.min(0.032, (t - lastT) / 1000 || 0.016); lastT = t;
      V += (-260 * Y - 11 * V) * dt; Y += V * dt;
      if (Math.abs(Y) < 0.04 && Math.abs(V) < 0.6) { Y = 0; V = 0; paint(); raf = 0; return; }
      paint(); raf = requestAnimationFrame(loop);
    }
    function spring() { if (raf) return; lastT = performance.now(); raf = requestAnimationFrame(loop); }
    function pull() { flip(); notify(); Y = 0; V = 430; spring(); }

    hit.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      e.preventDefault();
      drag = true; moved = false; fired = false; y0 = e.clientY;
      k = (svgEl.getBoundingClientRect().width / 300) || 1;
      cancelAnimationFrame(raf); raf = 0; V = 0;
      try { hit.setPointerCapture(e.pointerId); } catch (er) {}
      el.classList.add('dg');
    });
    hit.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var raw = Math.max(0, (e.clientY - y0) / k);
      if (raw > 3) moved = true;
      Y = MAX * Math.tanh(raw / (MAX * 0.9));
      if (!fired && Y >= TH) { fired = true; flip(); notify(); }
      paint();
    });
    function up() {
      if (!drag) return;
      drag = false; el.classList.remove('dg');
      if (!moved && !fired) { pull(); return; }
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
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    paint();
    return {
      set: function (v) {
        v = !!v; if (v === on) return;
        flip(); Y = 0; V = 330; spring();
      },
      destroy: destroy
    };
  }
  root.EtoLamp = { mount: mount };
})(window);
