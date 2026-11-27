(function (root) {
  var VS = [
    'attribute vec3 aP;',
    'attribute vec3 aN;',
    'attribute vec2 aU;',
    'uniform mat4 uMVP;',
    'uniform mat4 uM;',
    'varying vec3 vW;',
    'varying vec3 vN;',
    'varying vec2 vUV;',
    'void main(){',
    'vec4 w=uM*vec4(aP,1.0);',
    'vW=w.xyz;',
    'vN=(uM*vec4(aN,0.0)).xyz;',
    'vUV=aU;',
    'gl_Position=uMVP*vec4(aP,1.0);',
    '}'
  ].join('\n');

  var FS = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'varying vec3 vW;',
    'varying vec3 vN;',
    'varying vec2 vUV;',
    'uniform vec3 uCol;',
    'uniform vec3 uCam;',
    'uniform float uOn;',
    'uniform float uMat;',
    'const vec3 LP=vec3(0.0,2.55,0.0);',
    'const vec3 WARM=vec3(1.0,0.70,0.34);',
    'void main(){',
    'vec3 N=normalize(vN);',
    'vec3 V=normalize(uCam-vW);',
    'vec3 Lv=LP-vW;',
    'float d=length(Lv);',
    'vec3 L=Lv/d;',
    'float att=uOn/(1.0+0.10*d*d);',
    'vec3 amb=vec3(0.030,0.034,0.052);',
    'vec3 M=normalize(vec3(-0.45,0.75,0.55));',
    'vec3 moonC=vec3(0.10,0.13,0.22);',
    'vec3 rgb=vec3(0.0);',
    'float a=1.0;',
    'if(uMat<0.5){',
    'float df=max(dot(N,L),0.0);',
    'float dm=max(dot(N,M),0.0);',
    'vec3 H=normalize(L+V);',
    'vec3 H2=normalize(M+V);',
    'float sp=pow(max(dot(N,H),0.0),40.0);',
    'float sp2=pow(max(dot(N,H2),0.0),36.0);',
    'rgb=uCol*(amb+moonC*dm)+uCol*WARM*df*att*2.6+WARM*sp*att*1.9+moonC*sp2*1.3;',
    '}else if(uMat<1.5){',
    'float ang=atan(vW.z,vW.x);',
    'float pleat=0.90+0.10*sin(ang*72.0);',
    'float h=clamp((vW.y-1.95)/1.45,0.0,1.0);',
    'float band=0.60+0.40*exp(-pow((h-0.32)*2.4,2.0));',
    'vec3 fab=vec3(0.95,0.86,0.70)*pleat;',
    'float fr=pow(1.0-max(dot(N,V),0.0),2.0);',
    'rgb=fab*(amb*2.0+moonC*max(dot(N,M),0.0)*0.85);',
    'rgb+=fab*WARM*uOn*band*1.30+WARM*fr*uOn*0.30;',
    '}else if(uMat<2.5){',
    'float h=clamp((vW.y-1.95)/1.45,0.0,1.0);',
    'rgb=vec3(1.0,0.82,0.55)*(0.04+uOn*(1.25-0.55*h));',
    '}else if(uMat<3.5){',
    'float core=pow(max(dot(N,V),0.0),1.5);',
    'rgb=mix(vec3(0.09,0.09,0.11)+moonC*0.4,vec3(1.0,0.94,0.76)*(1.15+core),uOn);',
    '}else if(uMat<4.5){',
    'float r=length(vW.xz);',
    'float p=exp(-r*r/6.0)*uOn;',
    'rgb=WARM*p*0.50;',
    'a=0.0;',
    '}else if(uMat<5.5){',
    'float f=pow(vUV.y,1.5)*pow(max(dot(N,V),0.0),2.6)*uOn;',
    'rgb=WARM*f*0.42;',
    'a=0.0;',
    '}else if(uMat<6.5){',
    'float f=pow(1.0-vUV.y,1.6)*pow(max(dot(N,V),0.0),2.6)*uOn;',
    'rgb=WARM*f*0.30;',
    'a=0.0;',
    '}else{',
    'float r=length(vW.xz);',
    'a=(1.0-smoothstep(0.7,1.9,r))*0.8;',
    '}',
    'if(a>0.5){rgb=1.0-exp(-rgb*1.25);}',
    'gl_FragColor=vec4(rgb,a);',
    '}'
  ].join('\n');

  function ident() { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); }
  function mul(a, b) {
    var o = new Float32Array(16), c, r, k, s;
    for (c = 0; c < 4; c++) for (r = 0; r < 4; r++) { s = 0; for (k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; }
    return o;
  }
  function persp(fov, asp, n, f) {
    var t = 1 / Math.tan(fov / 2), o = new Float32Array(16);
    o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f);
    return o;
  }
  function trans(x, y, z) { var o = ident(); o[12] = x; o[13] = y; o[14] = z; return o; }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a), o = ident(); o[0] = c; o[2] = -s; o[8] = s; o[10] = c; return o; }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a), o = ident(); o[5] = c; o[6] = s; o[9] = -s; o[10] = c; return o; }
  function scl(x, y, z) { var o = ident(); o[0] = x; o[5] = y; o[10] = z; return o; }

  function lathe(prof, seg, flip) {
    var pos = [], nor = [], uv = [], idx = [], n = prof.length, nrm = [], i, j, a, b, dr, dy, l;
    for (j = 0; j < n; j++) {
      a = prof[Math.max(0, j - 1)]; b = prof[Math.min(n - 1, j + 1)];
      dr = b[0] - a[0]; dy = b[1] - a[1]; l = Math.sqrt(dr * dr + dy * dy) || 1;
      nrm.push(flip ? [-dy / l, dr / l] : [dy / l, -dr / l]);
    }
    for (i = 0; i <= seg; i++) {
      var th = i / seg * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
      for (j = 0; j < n; j++) {
        pos.push(prof[j][0] * c, prof[j][1], prof[j][0] * s);
        nor.push(nrm[j][0] * c, nrm[j][1], nrm[j][0] * s);
        uv.push(i / seg, j / (n - 1));
      }
    }
    for (i = 0; i < seg; i++) for (j = 0; j < n - 1; j++) {
      var A = i * n + j, B = (i + 1) * n + j, C = A + 1, D = B + 1;
      if (flip) idx.push(A, B, C, B, D, C); else idx.push(A, C, B, B, C, D);
    }
    return { p: pos, n: nor, u: uv, i: idx };
  }
  function sphere(r, cy, seg) {
    var prof = [], k;
    for (k = 0; k <= 14; k++) { var ph = -Math.PI / 2 + Math.PI * k / 14; prof.push([Math.max(0.0001, r * Math.cos(ph)), cy + r * Math.sin(ph)]); }
    return lathe(prof, seg, false);
  }
  function inset(prof, d) { return prof.map(function (q) { return [Math.max(0.01, q[0] - d), q[1]]; }); }

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }
  function program(gl) {
    var v = compile(gl, gl.VERTEX_SHADER, VS), f = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!v || !f) return null;
    var p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f);
    gl.bindAttribLocation(p, 0, 'aP'); gl.bindAttribLocation(p, 1, 'aN'); gl.bindAttribLocation(p, 2, 'aU');
    gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  }
  function upload(gl, g) {
    var n = g.p.length / 3, d = new Float32Array(n * 8), i;
    for (i = 0; i < n; i++) {
      d[i * 8] = g.p[i * 3]; d[i * 8 + 1] = g.p[i * 3 + 1]; d[i * 8 + 2] = g.p[i * 3 + 2];
      d[i * 8 + 3] = g.n[i * 3]; d[i * 8 + 4] = g.n[i * 3 + 1]; d[i * 8 + 5] = g.n[i * 3 + 2];
      d[i * 8 + 6] = g.u[i * 2]; d[i * 8 + 7] = g.u[i * 2 + 1];
    }
    var vb = gl.createBuffer(), ib = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(g.i), gl.STATIC_DRAW);
    return { vb: vb, ib: ib, n: g.i.length };
  }

  var SHADE = [[1.52, 1.95], [1.47, 2.2], [1.25, 2.65], [1.0, 3.05], [0.8, 3.4]];

  function fallback(stage, o) {
    var el = document.createElement('div'), on = !!o.on;
    el.className = 'au-fb'; el.tabIndex = 0;
    el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'الأباجورة');
    el.innerHTML = '<svg viewBox="0 0 240 400" width="100%" height="100%"><defs><linearGradient id="aufs" x1="0" x2="1"><stop offset="0" stop-color="#8a7358"/><stop offset=".5" stop-color="#f3dcb4"/><stop offset="1" stop-color="#8a7358"/></linearGradient><linearGradient id="aufp" x1="0" x2="1"><stop offset="0" stop-color="#6b4a1c"/><stop offset=".5" stop-color="#d2a04a"/><stop offset="1" stop-color="#6b4a1c"/></linearGradient></defs>' +
      '<ellipse cx="120" cy="378" rx="78" ry="13" fill="#2a1d12"/><rect x="113" y="170" width="14" height="206" fill="url(#aufp)"/>' +
      '<path d="M82 60 L158 60 L206 160 L34 160 Z" fill="url(#aufs)"/><circle class="aufb" cx="120" cy="150" r="14" fill="#fff0c8"/></svg>';
    stage.insertBefore(el, stage.querySelector('.au-dust'));
    function apply() {
      el.classList.toggle('lit', on);
      stage.style.setProperty('--li', on ? 1 : 0);
      stage.style.setProperty('--lx', on ? '30%' : '50%');
      stage.style.setProperty('--ly', '42%');
    }
    function toggle() { on = !on; apply(); if (o.onToggle) o.onToggle(on); }
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    apply();
    return { set: function (v) { on = !!v; apply(); }, destroy: function () { if (el.parentNode) el.parentNode.removeChild(el); } };
  }

  function mount(stage, o) {
    o = o || {};
    var canvas = document.createElement('canvas'), gl = null, glow = stage.querySelector('.au-glow');
    canvas.className = 'au-cv'; canvas.tabIndex = 0;
    canvas.setAttribute('role', 'button'); canvas.setAttribute('aria-label', 'الأباجورة');
    try {
      var opt = { alpha: true, antialias: true, premultipliedAlpha: true };
      gl = canvas.getContext('webgl', opt) || canvas.getContext('experimental-webgl', opt);
    } catch (e) { gl = null; }
    var prog = gl ? program(gl) : null;
    if (!prog) return fallback(stage, o);
    stage.insertBefore(canvas, glow ? glow.nextSibling : stage.firstChild);
    gl.useProgram(prog);
    var U = {};
    ['uMVP', 'uM', 'uCol', 'uCam', 'uOn', 'uMat'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
    gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1); gl.enableVertexAttribArray(2);

    var G = {
      base: upload(gl, lathe([[0, 0], [1.05, 0], [1.12, 0.04], [1.12, 0.1], [1.0, 0.2], [0.8, 0.26], [0.3, 0.3], [0.13, 0.34], [0.1, 0.42]], 64, false)),
      pole: upload(gl, lathe([[0.065, 0.4], [0.065, 0.78], [0.115, 0.82], [0.115, 0.9], [0.065, 0.95], [0.065, 1.5], [0.1, 1.54], [0.1, 1.6], [0.065, 1.64], [0.065, 2.0], [0.1, 2.04], [0.1, 2.1]], 32, false)),
      sock: upload(gl, lathe([[0.1, 2.08], [0.16, 2.14], [0.16, 2.3], [0.12, 2.34]], 24, false)),
      bulb: upload(gl, sphere(0.3, 2.62, 32)),
      shO: upload(gl, lathe(SHADE, 96, false)),
      shI: upload(gl, lathe(inset(SHADE, 0.035), 96, true)),
      trim: upload(gl, lathe([[1.52, 1.93], [1.55, 1.95], [1.55, 1.99], [1.52, 2.01], [1.49, 1.99], [1.49, 1.95], [1.52, 1.93]], 96, false)),
      chain: upload(gl, lathe([[0.011, 0], [0.011, 1]], 6, false)),
      bead: upload(gl, sphere(0.05, 0, 14)),
      floor: upload(gl, lathe([[0, 0], [18, 0]], 48, true)),
      sh: upload(gl, lathe([[0, 0.003], [2.2, 0.003]], 48, true)),
      dn: upload(gl, lathe([[3.9, 0], [1.45, 1.95]], 64, false)),
      up: upload(gl, lathe([[0.82, 3.4], [2.3, 5.8]], 64, false))
    };

    var S = { on: o.on ? 1 : 0, v: 0, lit: 0, fs: -9, pt: -9, mx: 0, my: 0, sx: 0, sy: 0 };
    var dead = false, raf = 0, last = 0, rects = [], VP = ident(), cw = 0, ch = 0, ty = 1.85, fov = 28 * Math.PI / 180;

    function proj(x, y, z) {
      var m = VP, w = m[3] * x + m[7] * y + m[11] * z + m[15];
      return [((m[0] * x + m[4] * y + m[8] * z + m[12]) / w * 0.5 + 0.5) * cw, (1 - ((m[1] * x + m[5] * y + m[9] * z + m[13]) / w * 0.5 + 0.5)) * ch];
    }
    function box(x0, x1, y0, y1, z0, z1, pad) {
      var pts = [], xs = [x0, x1], ys = [y0, y1], zs = [z0, z1], a, b, c, x1_ = 1e9, y1_ = 1e9, x2_ = -1e9, y2_ = -1e9;
      for (a = 0; a < 2; a++) for (b = 0; b < 2; b++) for (c = 0; c < 2; c++) pts.push(proj(xs[a], ys[b], zs[c]));
      pts.forEach(function (p) { x1_ = Math.min(x1_, p[0]); x2_ = Math.max(x2_, p[0]); y1_ = Math.min(y1_, p[1]); y2_ = Math.max(y2_, p[1]); });
      return [x1_ - pad, y1_ - pad, x2_ + pad, y2_ + pad];
    }
    function hit(px, py) {
      for (var i = 0; i < rects.length; i++) { var r = rects[i]; if (px >= r[0] && px <= r[2] && py >= r[1] && py <= r[3]) return true; }
      return false;
    }
    function layout(on) {
      var narrow = cw < 820, tn = Math.tan(fov / 2), free, maxPx, fitH, ndcX, ndcY;
      if (on) {
        if (narrow) { free = cw; maxPx = cw * 0.72; fitH = 0.32; ndcX = 0; ndcY = 0.5; }
        else { free = Math.max(cw * 0.42, cw - 540); maxPx = free * 0.8; fitH = 0.74; ndcX = (free / 2) / cw * 2 - 1; ndcY = 0; }
      } else { maxPx = cw * (narrow ? 0.78 : 0.42); fitH = narrow ? 0.62 : 0.8; ndcX = 0; ndcY = 0; }
      var d = Math.max(3.7 / (2 * tn * fitH), 2.95 * ch / (2 * tn * maxPx));
      return { d: d, x: ndcX, y: ndcY };
    }

    function draw(g, model, mat, col, cull) {
      gl.uniformMatrix4fv(U.uM, false, model);
      gl.uniformMatrix4fv(U.uMVP, false, mul(VP, model));
      gl.uniform1f(U.uMat, mat);
      gl.uniform3fv(U.uCol, col);
      if (cull) gl.enable(gl.CULL_FACE); else gl.disable(gl.CULL_FACE);
      gl.bindBuffer(gl.ARRAY_BUFFER, g.vb);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g.ib);
      gl.drawElements(gl.TRIANGLES, g.n, gl.UNSIGNED_SHORT, 0);
    }
    function flicker(s) {
      if (s > 0.55) return 1;
      return (0.3 + 0.7 * (Math.sin(s * 92) > -0.2 ? 1 : 0)) * Math.min(1, 0.25 + s * 3);
    }

    function frame(now) {
      if (dead) return;
      if (!canvas.isConnected) { destroy(); return; }
      raf = requestAnimationFrame(frame);
      var t = now / 1000, dt = Math.min(0.05, last ? t - last : 0.016);
      last = t;
      if (document.hidden) return;
      cw = canvas.clientWidth; ch = canvas.clientHeight;
      if (!cw || !ch) return;
      var dpr = Math.min(2, root.devicePixelRatio || 1), W = Math.round(cw * dpr), H = Math.round(ch * dpr);
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      gl.viewport(0, 0, W, H);

      S.v += (S.on - S.v) * (1 - Math.exp(-dt * 2.4));
      S.lit += (S.on - S.lit) * (1 - Math.exp(-dt * (S.on ? 12 : 6)));
      S.sx += (S.mx - S.sx) * (1 - Math.exp(-dt * 4));
      S.sy += (S.my - S.sy) * (1 - Math.exp(-dt * 4));
      var fl = S.on ? flicker(t - S.fs) : 1, breath = 0.975 + 0.025 * Math.sin(t * 7.3) * Math.sin(t * 2.9 + 1);
      var lit = S.lit * fl * breath;

      var a = layout(false), b = layout(true), v = S.v;
      var d = a.d + (b.d - a.d) * v, nx = a.x + (b.x - a.x) * v + S.sx * 0.015, ny = a.y + (b.y - a.y) * v;
      var pitch = -0.12 + S.sy * 0.03;
      var P = mul(trans(nx, ny, 0), persp(fov, cw / ch, 0.5, 60));
      var view = mul(trans(0, 0, -d), mul(rotX(pitch), trans(0, -ty, 0)));
      VP = mul(P, view);
      var cam = new Float32Array([0, ty + d * Math.sin(pitch), d * Math.cos(pitch)]);
      gl.uniform3fv(U.uCam, cam);
      gl.uniform1f(U.uOn, lit);

      var sp = proj(0, 2.62, 0);
      stage.style.setProperty('--lx', (sp[0] / cw * 100).toFixed(2) + '%');
      stage.style.setProperty('--ly', (sp[1] / ch * 100).toFixed(2) + '%');
      stage.style.setProperty('--li', Math.min(1, lit).toFixed(3));
      rects = [box(-1.55, 1.55, 1.9, 3.45, -0.1, 0.1, 4), box(-0.1, 0.1, 0.3, 2.0, -0.1, 0.1, 14), box(-1.12, 1.12, 0, 0.3, -0.1, 0.1, 4)];

      var yaw = 0.5 + S.sx * 0.5, Y = rotY(yaw), I = ident();
      var pu = t - S.pt, pull = pu < 0.55 ? Math.sin(pu / 0.55 * Math.PI) * 0.3 * Math.exp(-pu * 1.6) : 0;
      var L = 0.72 + pull, cx = 0.42, cz = 0.18, top = 2.26;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.BLEND);
      draw(G.base, I, 0, [0.2, 0.14, 0.09], true);
      draw(G.pole, I, 0, [0.82, 0.58, 0.24], true);
      draw(G.sock, I, 0, [0.15, 0.13, 0.12], true);
      draw(G.trim, I, 0, [0.82, 0.58, 0.24], true);
      draw(G.chain, mul(Y, mul(trans(cx, top - L, cz), scl(1, L, 1))), 0, [0.78, 0.78, 0.82], false);
      draw(G.bead, mul(Y, trans(cx, top - L, cz)), 0, [0.88, 0.64, 0.28], true);
      draw(G.shI, I, 2, [1, 1, 1], true);
      draw(G.bulb, I, 3, [1, 1, 1], true);
      draw(G.shO, I, 1, [1, 1, 1], true);

      gl.enable(gl.BLEND); gl.depthMask(false);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      draw(G.sh, I, 7, [0, 0, 0], false);
      gl.blendFunc(gl.ONE, gl.ONE);
      draw(G.floor, I, 4, [0, 0, 0], false);
      draw(G.dn, I, 5, [0, 0, 0], true);
      draw(G.up, I, 6, [0, 0, 0], true);
      gl.depthMask(true);
    }

    function toggle() {
      var t = performance.now() / 1000;
      S.on = S.on ? 0 : 1; S.fs = t; S.pt = t;
      if (o.onToggle) o.onToggle(!!S.on);
    }
    function pos(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function onDown(e) { var p = pos(e); if (hit(p[0], p[1])) { e.preventDefault(); toggle(); } }
    function onMove(e) {
      var r = canvas.getBoundingClientRect(), p = pos(e);
      S.mx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      S.my = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      canvas.style.cursor = hit(p[0], p[1]) ? 'pointer' : 'default';
    }
    function onLeave() { S.mx = 0; S.my = 0; }
    function onKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }
    canvas.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('keydown', onKey);

    function destroy() {
      if (dead) return;
      dead = true; cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('keydown', onKey);
      var x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
    raf = requestAnimationFrame(frame);
    return {
      set: function (on) {
        on = on ? 1 : 0; if (on === S.on) return;
        var t = performance.now() / 1000; S.on = on; S.fs = t; S.pt = t;
      },
      destroy: destroy
    };
  }
  root.EtoLamp = { mount: mount };
})(window);
