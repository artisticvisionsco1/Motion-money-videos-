// Motion-money 2D engine: monochrome line-art on black, bloom, dot grid,
// eased camera glides on one continuous canvas. Deterministic: draw(t).
(function () {
  const W = 1920, H = 1080;
  const E = {};
  window.MM = E;

  // ---------- easing ----------
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const inOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const out = p => 1 - Math.pow(1 - p, 3);
  const outBack = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  Object.assign(E, { W, H, clamp, lerp, inOut, out, outBack });

  // progress of an event starting at t0 lasting d (0..1, eased out)
  E.p = (t, t0, d = 0.45) => out(clamp((t - t0) / d));
  E.pl = (t, t0, d = 0.45) => clamp((t - t0) / d); // linear
  // visible window: fades in at a, out at b
  E.win = (t, a, b, fi = 0.35, fo = 0.35) => Math.min(E.p(t, a, fi), b == null ? 1 : 1 - E.p(t, b, fo));

  // ---------- words ----------
  // word(w, n): start time of nth (1-based) occurrence of word w (case/punct-insensitive)
  E.words = [];
  const norm = s => s.toLowerCase().replace(/[^a-z0-9$']/g, '');
  E.word = (w, n = 1) => {
    let k = 0;
    for (const x of E.words) if (norm(x.w) === norm(w) && ++k === n) return x.s;
    throw new Error('word not found: ' + w + ' #' + n);
  };

  // ---------- camera ----------
  // moves: [{t, d, x, y, z}] — at time t start gliding (duration d) to (x,y,z)
  E.camera = (moves, t) => {
    let c = { x: moves[0].x, y: moves[0].y, z: moves[0].z };
    for (let i = 1; i < moves.length; i++) {
      const m = moves[i];
      if (t <= m.t) break;
      // cut: dip to black, jump at the midpoint (see E.dip)
      const p = m.cut ? (t >= m.t + (m.d || 0.5) / 2 ? 1 : 0) : inOut(clamp((t - m.t) / (m.d || 0.7)));
      c = { x: lerp(c.x, m.x, p), y: lerp(c.y, m.y, p), z: lerp(c.z, m.z ?? c.z, p) };
    }
    return c;
  };

  // darkness 0..1 of dip-to-black cuts at time t
  E.dip = (moves, t) => {
    let d = 0;
    for (const m of moves) if (m.cut) {
      const h = (m.d || 0.5) / 2, k = 1 - Math.abs(t - (m.t + h)) / h;
      if (k > 0) d = Math.max(d, inOut(clamp(k)));
    }
    return d;
  };

  // ---------- canvases ----------
  let out_, sc, bl, ctx, sctx, bctx;
  E.init = () => {
    out_ = document.createElement('canvas'); out_.width = W; out_.height = H; out_.id = 'out';
    document.body.appendChild(out_);
    sc = document.createElement('canvas'); sc.width = W; sc.height = H;
    bl = document.createElement('canvas'); bl.width = W / 4; bl.height = H / 4;
    ctx = out_.getContext('2d'); sctx = sc.getContext('2d'); bctx = bl.getContext('2d');
    E.canvas = out_;
  };

  // ---------- frame ----------
  // scene: {camera:[moves], draw(g, t)}  g = world-space context helpers
  E.frame = (scene, t) => {
    const cam = E.camera(scene.camera, t);
    const g = sctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    g.setTransform(cam.z, 0, 0, cam.z, W / 2 - cam.x * cam.z, H / 2 - cam.y * cam.z);
    E.cam = cam;
    dotGrid(g, cam);
    g.lineCap = 'round'; g.lineJoin = 'round';
    scene.draw(g, t, cam);
    // bloom: downsample, blur, add
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.globalCompositeOperation = 'source-over';
    bctx.fillStyle = '#000'; bctx.fillRect(0, 0, bl.width, bl.height);
    bctx.filter = 'blur(6px)'; bctx.drawImage(sc, 0, 0, bl.width, bl.height); bctx.filter = 'none';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.drawImage(sc, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.6; ctx.drawImage(bl, 0, 0, W, H);
    ctx.filter = 'blur(40px)'; ctx.globalAlpha = 0.32; ctx.drawImage(bl, 0, 0, W, H); ctx.filter = 'none';
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // vignette
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    const dk = E.dip(scene.camera, t);
    if (dk > 0) { ctx.fillStyle = `rgba(0,0,0,${dk})`; ctx.fillRect(0, 0, W, H); }
    // global fade (scene.fade(t) 0..1)
    if (scene.fade) { const f = scene.fade(t); if (f < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - f})`; ctx.fillRect(0, 0, W, H); } }
  };

  function dotGrid(g, cam) {
    const s = 36, hw = W / 2 / cam.z, hh = H / 2 / cam.z;
    const x0 = Math.floor((cam.x - hw) / s) * s, x1 = cam.x + hw;
    const y0 = Math.floor((cam.y - hh) / s) * s, y1 = cam.y + hh;
    g.fillStyle = 'rgba(255,255,255,0.09)';
    const r = 1.3 / Math.max(cam.z, 0.5);
    for (let x = x0; x <= x1; x += s) for (let y = y0; y <= y1; y += s) g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }

  // ---------- drawing helpers (world space) ----------
  const col = (a, v = 255) => `rgba(${v},${v},${v},${clamp(a)})`;
  E.col = col;
  E.stroke = (g, a = 1, w = 3, v = 255) => { g.strokeStyle = col(a, v); g.lineWidth = w; };
  E.fill = (g, a = 1, v = 255) => { g.fillStyle = col(a, v); };

  // soft radial halo
  E.halo = (g, x, y, r, a) => {
    if (a <= 0) return;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, col(0.35 * a)); gr.addColorStop(0.4, col(0.12 * a)); gr.addColorStop(1, col(0));
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  };

  // light beam polygon from (x0,y0,w0) to (x1,y1,w1)  — volumetric trapezoid
  E.beam = (g, pts, a) => {
    if (a <= 0) return;
    const [p0, p1, p2, p3] = pts;
    const gr = g.createLinearGradient((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2);
    gr.addColorStop(0, col(0.22 * a)); gr.addColorStop(1, col(0));
    g.fillStyle = gr; g.beginPath(); g.moveTo(...p0); g.lineTo(...p1); g.lineTo(...p2); g.lineTo(...p3); g.closePath(); g.fill();
  };

  E.rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

  // polyline draw-on with glowing tip
  E.path = (g, pts, p, a = 1, w = 3, tip = true) => {
    if (p <= 0 || a <= 0) return;
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let left = L * clamp(p);
    E.stroke(g, a, w); g.beginPath(); g.moveTo(...pts[0]);
    let end = pts[0];
    for (let i = 1; i < pts.length; i++) {
      if (left >= seg[i - 1]) { g.lineTo(...pts[i]); left -= seg[i - 1]; end = pts[i]; }
      else { const f = left / seg[i - 1]; end = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; g.lineTo(...end); break; }
    }
    g.stroke();
    if (tip && p < 1) { E.halo(g, end[0], end[1], 40, a); E.fill(g, a); g.beginPath(); g.arc(end[0], end[1], 5, 0, 7); g.fill(); }
  };

  // ---------- text ----------
  E.label = (g, text, x, y, a, size = 24, opts = {}) => {
    if (a <= 0) return;
    g.save();
    g.font = `${opts.weight || 600} ${size}px Inter`;
    g.letterSpacing = (opts.track ?? 0.28) * size + 'px';
    g.textAlign = opts.align || 'center'; g.textBaseline = 'middle';
    E.fill(g, a, opts.v ?? 235);
    g.fillText(text, x, y + (1 - a) * 8);
    g.restore();
  };
  E.pill = (g, text, x, y, a, size = 20, filled = false) => {
    if (a <= 0) return;
    g.save();
    g.font = `700 ${size}px Inter`; g.letterSpacing = 0.25 * size + 'px';
    const w = g.measureText(text).width + size * 1.6, h = size * 2;
    const yy = y + (1 - a) * 8;
    E.rr(g, x - w / 2, yy - h / 2, w, h, h / 2);
    if (filled) { E.fill(g, a); g.fill(); } else { E.stroke(g, a, 2.5); g.stroke(); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    E.fill(g, a, filled ? 0 : 245); g.fillText(text, x + 0.12 * size, yy + 1);
    g.restore();
  };
  E.money = n => '$' + Math.round(n).toLocaleString('en-US');
  E.big = (g, text, x, y, a, size = 72) => {
    if (a <= 0) return;
    g.save(); g.font = `700 ${size}px Inter`; g.letterSpacing = '1px';
    g.textAlign = 'center'; g.textBaseline = 'middle'; E.fill(g, a); g.fillText(text, x, y); g.restore();
  };

  // ---------- icons ----------
  // person: feet at (x,y). filled = hero white. pose: 'stand'|'up'|'rest'
  E.person = (g, x, y, s, a, filled = true, pose = 'stand') => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, -70, 170, a * 0.8);
    E.fill(g, a); E.stroke(g, a, 3);
    // head
    g.beginPath(); g.arc(0, -128, 26, 0, 7); filled ? g.fill() : g.stroke();
    // body (arch)
    g.beginPath(); g.moveTo(-40, 0); g.lineTo(-40, -50); g.arc(0, -50, 40, Math.PI, 0); g.lineTo(40, 0); g.closePath();
    filled ? g.fill() : g.stroke();
    if (pose === 'up') { E.stroke(g, a, 14); g.beginPath(); g.moveTo(-30, -70); g.lineTo(-62, -130); g.moveTo(30, -70); g.lineTo(62, -130); g.stroke(); }
    if (pose === 'rest') { E.stroke(g, a, 12); g.beginPath(); g.moveTo(-30, -78); g.lineTo(-48, -140); g.lineTo(-10, -150); g.moveTo(30, -78); g.lineTo(48, -140); g.lineTo(10, -150); g.stroke(); }
    g.restore();
  };
  E.clock = (g, x, y, r, a, t, speed = 1, filled = false) => {
    if (a <= 0) return;
    if (filled) E.halo(g, x, y, r * 2.4, a);
    E.stroke(g, a, 3); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; g.beginPath(); g.moveTo(x + Math.cos(an) * r * 0.82, y + Math.sin(an) * r * 0.82); g.lineTo(x + Math.cos(an) * r * 0.92, y + Math.sin(an) * r * 0.92); g.stroke(); }
    const m = t * speed * 2 * Math.PI / 6, h = m / 12;
    E.stroke(g, a, 4); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(m) * r * 0.75, y - Math.cos(m) * r * 0.75); g.stroke();
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(h + 2) * r * 0.5, y - Math.cos(h + 2) * r * 0.5); g.stroke();
    E.fill(g, a); g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
  };
  // price tag hanging from (x,y), swing angle
  E.tag = (g, x, y, a, ang, text, s = 1) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
    E.stroke(g, a, 2); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 40); g.stroke();
    g.beginPath(); g.moveTo(-34, 60); g.lineTo(0, 40); g.lineTo(34, 60); g.lineTo(34, 130); g.lineTo(-34, 130); g.closePath();
    E.fill(g, a * 0.12); g.fill(); E.stroke(g, a, 3); g.stroke();
    g.beginPath(); g.arc(0, 56, 5, 0, 7); g.stroke();
    if (text) { g.rotate(Math.PI / 2); E.label(g, text, 95, 0, a, 15, { track: 0.15, weight: 700 }); }
    g.restore();
  };
  E.building = (g, x, y, w, h, a, glow = 0) => {
    if (a <= 0) return;
    if (glow > 0) E.halo(g, x, y - h / 2, Math.max(w, h) * 1.1, glow * a);
    E.fill(g, 0.04 * a + 0.1 * glow * a); g.fillRect(x - w / 2, y - h, w, h);
    E.stroke(g, a, 3); g.strokeRect(x - w / 2, y - h, w, h);
    const cols = Math.max(2, Math.round(w / 70)), rows = Math.max(2, Math.round(h / 80));
    const cw = w / cols, rh = (h - 90) / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const lit = ((i * 7 + j * 3) % 5) < 2 + glow * 3;
      const bx = x - w / 2 + i * cw + cw * 0.28, by = y - h + 30 + j * rh + rh * 0.2;
      if (lit) { E.fill(g, a * (0.35 + 0.65 * glow)); g.fillRect(bx, by, cw * 0.44, rh * 0.5); }
      else { E.stroke(g, a * 0.6, 2); g.strokeRect(bx, by, cw * 0.44, rh * 0.5); }
    }
    E.stroke(g, a, 3); g.strokeRect(x - 22, y - 60, 44, 60);
  };
  E.coin = (g, x, y, r, a, filled = true) => {
    if (a <= 0) return;
    if (filled) { E.halo(g, x, y, r * 3, a * 0.7); E.fill(g, a); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    E.stroke(g, a, 2.5); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    g.save(); g.font = `800 ${r * 1.2}px Inter`; g.textAlign = 'center'; g.textBaseline = 'middle';
    E.fill(g, a, filled ? 0 : 255); g.fillText('$', x, y + 1); g.restore();
  };
  E.star = (g, x, y, r, a, filled = true) => {
    if (a <= 0) return;
    if (filled) E.halo(g, x, y, r * 3, a);
    g.beginPath();
    for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
    g.closePath(); if (filled) { E.fill(g, a); g.fill(); } else { E.stroke(g, a, 3); g.stroke(); }
  };
  E.hourglass = (g, x, y, s, a, sand = 0.5) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(-30, -50); g.lineTo(30, -50); g.moveTo(-30, 50); g.lineTo(30, 50); g.stroke();
    g.beginPath(); g.moveTo(-24, -50); g.quadraticCurveTo(-24, -8, 0, 0); g.quadraticCurveTo(-24, 8, -24, 50);
    g.moveTo(24, -50); g.quadraticCurveTo(24, -8, 0, 0); g.quadraticCurveTo(24, 8, 24, 50); g.stroke();
    E.fill(g, a * 0.9);
    const top = 40 * (1 - sand), bot = 40 * sand;
    g.beginPath(); g.moveTo(-18 * (top / 40), -6 - top); g.lineTo(18 * (top / 40), -6 - top); g.lineTo(0, -4); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-20, 46); g.lineTo(20, 46); g.lineTo(20 * (1 - bot / 60), 46 - bot); g.lineTo(-20 * (1 - bot / 60), 46 - bot); g.closePath(); g.fill();
    g.restore();
  };
  E.house = (g, x, y, s, a, glow = 0) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (glow) E.halo(g, 0, -70, 260, glow * a);
    E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(-110, 0); g.lineTo(-110, -110); g.lineTo(0, -190); g.lineTo(110, -110); g.lineTo(110, 0); g.closePath();
    E.fill(g, 0.05 * a); g.fill(); g.stroke();
    g.strokeRect(-30, -80, 60, 80);
    E.fill(g, a * (0.4 + 0.6 * glow)); g.fillRect(55, -90, 34, 34); g.fillRect(-89, -90, 34, 34);
    g.restore();
  };
  E.book = (g, x, y, s, a) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(0, -50); g.quadraticCurveTo(-30, -62, -70, -55); g.lineTo(-70, 30); g.quadraticCurveTo(-30, 22, 0, 36);
    g.quadraticCurveTo(30, 22, 70, 30); g.lineTo(70, -55); g.quadraticCurveTo(30, -62, 0, -50); g.lineTo(0, 36); g.stroke();
    for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-55, -30 + i * 18); g.lineTo(-15, -26 + i * 18); g.moveTo(15, -26 + i * 18); g.lineTo(55, -30 + i * 18); g.stroke(); }
    g.restore();
  };
  E.box = (g, x, y, s, a, filled = true) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, 0, 170, a);
    E.rr(g, -55, -55, 110, 110, 22); if (filled) { E.fill(g, a); g.fill(); } else { E.stroke(g, a, 3); g.stroke(); }
    const v = filled ? 0 : 255; g.strokeStyle = col(a, v); g.lineWidth = 4;
    g.beginPath(); g.moveTo(0, -30); g.lineTo(28, -15); g.lineTo(28, 17); g.lineTo(0, 32); g.lineTo(-28, 17); g.lineTo(-28, -15); g.closePath();
    g.moveTo(-28, -15); g.lineTo(0, 0); g.lineTo(28, -15); g.moveTo(0, 0); g.lineTo(0, 32); g.stroke();
    g.restore();
  };
  E.ground = (g, x0, x1, y, a = 0.8) => { E.stroke(g, a, 2.5); g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); };
  // expanding ripple ring
  E.ripple = (g, x, y, t, t0, r0 = 40, r1 = 220, d = 0.9) => {
    const p = clamp((t - t0) / d); if (p <= 0 || p >= 1) return;
    E.stroke(g, (1 - p) * 0.8, 2.5); g.beginPath(); g.arc(x, y, lerp(r0, r1, out(p)), 0, 7); g.stroke();
  };
})();
