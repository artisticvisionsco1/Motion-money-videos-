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
  // moves: [{t, d, x, y, z, cut?, focus?}]
  //  glide (default): eased move to (x,y,z) over d
  //  focus: push in + defocus-blur the old shot, swap at the midpoint, settle into the new shot
  //  cut: dip to black and swap at the midpoint
  // Between moves the camera keeps slowly pushing in (E.DRIFT per second) so a frame is never frozen.
  E.DRIFT = 0.024;
  const moveEnd = m => m.t + (m.d || 0.7);
  E.camera = (moves, t) => {
    let c = { x: moves[0].x, y: moves[0].y, z: moves[0].z };
    let settle = 0;
    for (let i = 1; i < moves.length; i++) {
      const m = moves[i];
      if (t <= m.t) break;
      c.z *= 1 + E.DRIFT * Math.max(0, m.t - settle); // bake drift so there is no jump
      const d = m.d || 0.7;
      if (m.cut || m.focus) {
        const mid = m.t + d / 2;
        if (t < mid) {
          if (m.focus) c = { ...c, z: c.z * (1 + 0.28 * inOut(clamp((t - m.t) / (d / 2)))) };
          return c;
        }
        const k = clamp((t - mid) / (d / 2));
        c = { x: m.x, y: m.y, z: m.focus ? m.z * (0.82 + 0.18 * out(k)) : m.z };
      } else {
        const p = inOut(clamp((t - m.t) / d));
        c = { x: lerp(c.x, m.x, p), y: lerp(c.y, m.y, p), z: lerp(c.z, m.z ?? c.z, p) };
      }
      settle = moveEnd(m);
    }
    c.z *= 1 + E.DRIFT * Math.max(0, t - settle);
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
  // defocus amount 0..1 of focus transitions at time t
  E.defocus = (moves, t) => {
    let d = 0;
    for (const m of moves) if (m.focus) {
      const h = (m.d || 0.9) / 2, k = 1 - Math.abs(t - (m.t + h)) / h;
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
    stars(g, cam, t);
    g.setTransform(cam.z, 0, 0, cam.z, W / 2 - cam.x * cam.z, H / 2 - cam.y * cam.z);
    E.cam = cam;
    dotGrid(g, cam);
    g.lineCap = 'round'; g.lineJoin = 'round';
    scene.draw(g, t, cam);
    // bloom: downsample, blur, add (tight glow, deep blacks)
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.globalCompositeOperation = 'source-over';
    bctx.fillStyle = '#000'; bctx.fillRect(0, 0, bl.width, bl.height);
    bctx.filter = 'blur(3px)'; bctx.drawImage(sc, 0, 0, bl.width, bl.height); bctx.filter = 'none';
    const fd = E.defocus(scene.camera, t);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    if (fd > 0) ctx.filter = `blur(${(fd * 16).toFixed(1)}px) brightness(${(1 - 0.55 * fd).toFixed(3)})`;
    ctx.drawImage(sc, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.55 * (1 - 0.5 * fd); ctx.drawImage(bl, 0, 0, W, H);
    ctx.filter = 'blur(30px)'; ctx.globalAlpha = 0.14; ctx.drawImage(bl, 0, 0, W, H); ctx.filter = 'none';
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // vignette
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    const dk = E.dip(scene.camera, t);
    if (dk > 0) { ctx.fillStyle = `rgba(0,0,0,${dk})`; ctx.fillRect(0, 0, W, H); }
    if (scene.fade) { const f = scene.fade(t); if (f < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - f})`; ctx.fillRect(0, 0, W, H); } }
  };

  // drifting, twinkling star particles in screen space with slight parallax
  const STARS = (() => { let s = 1234567; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: 220 }, () => ({ x: r() * W, y: r() * H, z: 0.05 + r() * 0.25, s: 0.6 + r() * 1.6, ph: r() * 6.28, sp: 0.4 + r() * 1.2, vx: (r() - 0.5) * 6, vy: -2 - r() * 5 })); })();
  function stars(g, cam, t) {
    for (const p of STARS) {
      let x = (p.x + p.vx * t - cam.x * p.z * 0.4) % W; if (x < 0) x += W;
      let y = (p.y + p.vy * t - cam.y * p.z * 0.4) % H; if (y < 0) y += H;
      const a = 0.12 + 0.28 * (0.5 + 0.5 * Math.sin(t * p.sp + p.ph));
      g.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      g.beginPath(); g.arc(x, y, p.s * (0.8 + cam.z * 0.2), 0, 7); g.fill();
    }
  }

  function dotGrid(g, cam) {
    const s = 36, hw = W / 2 / cam.z, hh = H / 2 / cam.z;
    const x0 = Math.floor((cam.x - hw) / s) * s, x1 = cam.x + hw;
    const y0 = Math.floor((cam.y - hh) / s) * s, y1 = cam.y + hh;
    g.fillStyle = 'rgba(255,255,255,0.055)';
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
    gr.addColorStop(0, col(0.26 * a)); gr.addColorStop(0.35, col(0.07 * a)); gr.addColorStop(1, col(0));
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
    if (filled) E.halo(g, 0, -70, 120, a * 0.7);
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
    if (text) { g.rotate(Math.PI / 2); E.label(g, text, 100, 0, a, text.length > 6 ? 11 : 14, { track: 0.08, weight: 800 }); }
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
  // ---------- builds ----------
  // seeded random from a number
  const rnd = seed => { let s = Math.floor(Math.abs(seed * 9301 + 49297)) % 233280 || 1; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  E.rnd = rnd;
  // "assemble": particles converge from around (x,y) then the element pops in (scale outBack) with a ripple.
  // fn(g, alpha) draws the element at its own coordinates. Returns alpha used.
  E.build = (g, t, t0, x, y, size, fn, d = 0.7) => {
    if (t < t0) return 0;
    const k = clamp((t - t0) / d);
    const r = rnd(t0 * 1000 + x);
    if (k < 1) {
      for (let i = 0; i < 18; i++) {
        const an = r() * 6.283, dist = size * (1.2 + r() * 1.6), delay = r() * 0.35;
        const q = clamp((k - delay) / 0.55); if (q <= 0) continue;
        const e = out(q), sp = (1 - e) * 1.2;
        const px = x + Math.cos(an + sp) * dist * (1 - e) + (r() - 0.5) * size * 0.8 * e;
        const py = y + Math.sin(an + sp) * dist * (1 - e) + (r() - 0.5) * size * 0.8 * e;
        const a = Math.sin(Math.PI * q) * 0.9;
        g.fillStyle = col(a); g.beginPath(); g.arc(px, py, 2.6, 0, 7); g.fill();
      }
    }
    const q = clamp((k - 0.35) / 0.65);
    if (q <= 0) return 0;
    const sc = 0.6 + 0.4 * outBack(q);
    g.save(); g.translate(x, y); g.scale(sc, sc); g.translate(-x, -y);
    fn(g, Math.min(1, q * 1.6));
    g.restore();
    E.ripple(g, x, y, t, t0 + d * 0.75, size * 0.4, size * 1.6, 0.8);
    return Math.min(1, q * 1.6);
  };
  // walk in: returns {x, bob} moving from x0 to x1 over d seconds starting t0
  E.walk = (t, t0, x0, x1, d = 1.0) => {
    const k = clamp((t - t0) / d), e = inOut(k);
    return { x: lerp(x0, x1, e), bob: k > 0 && k < 1 ? -Math.abs(Math.sin(k * d * 9)) * 8 : 0 };
  };
  // constellation: points connected in order, revealed by p (0..1)
  E.constellation = (g, pts, p, a = 1) => {
    if (p <= 0) return;
    const n = pts.length, shown = p * n;
    for (let i = 0; i < n; i++) {
      const q = clamp(shown - i); if (q <= 0) break;
      E.halo(g, pts[i][0], pts[i][1], 18, a * q); E.fill(g, a * q); g.beginPath(); g.arc(pts[i][0], pts[i][1], 4, 0, 7); g.fill();
      if (i > 0) { E.stroke(g, a * 0.7, 1.6); g.beginPath(); g.moveTo(...pts[i - 1]); g.lineTo(lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)); g.stroke(); }
    }
  };

  // ---------- more icons (v3) ----------
  // subscription / pricing card centred at (x,y). opts: {title, price, sub, hot (0..1 highlight), cross (0..1)}
  E.card = (g, x, y, a, o = {}) => {
    if (a <= 0) return;
    const w = o.w || 260, h = o.h || 330, hot = o.hot || 0;
    if (hot > 0) E.halo(g, x, y, w * 1.1, hot * a);
    E.rr(g, x - w / 2, y - h / 2, w, h, 22);
    E.fill(g, (0.05 + 0.85 * hot) * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    const v = hot > 0.5 ? 0 : 255;
    g.save(); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 22px Inter'; g.letterSpacing = '5px'; g.fillStyle = col(a, v); g.fillText(o.title || '', x + 2, y - h / 2 + 55);
    g.font = '800 64px Inter'; g.letterSpacing = '0px'; g.fillText(o.price || '', x, y + 5);
    g.font = '600 18px Inter'; g.letterSpacing = '4px'; g.fillStyle = col(a * 0.7, v); g.fillText(o.sub || '', x + 2, y + h / 2 - 50);
    g.restore();
    if (o.cross > 0) { E.stroke(g, a, 6); g.beginPath(); g.moveTo(x - w * 0.42, y - h * 0.42); g.lineTo(lerp(x - w * 0.42, x + w * 0.42, clamp(o.cross * 2)), lerp(y - h * 0.42, y + h * 0.42, clamp(o.cross * 2)));
      if (o.cross > 0.5) { g.moveTo(x + w * 0.42, y - h * 0.42); g.lineTo(lerp(x + w * 0.42, x - w * 0.42, clamp(o.cross * 2 - 1)), lerp(y - h * 0.42, y + h * 0.42, clamp(o.cross * 2 - 1))); }
      g.stroke(); }
  };
  // vertical percentage bar: bottom at (x,y), max height h, value pct 0..100 (already animated by caller)
  E.pctBar = (g, x, y, h, pct, a, label) => {
    if (a <= 0) return;
    const w = 70;
    E.stroke(g, a * 0.6, 2); E.rr(g, x - w / 2, y - h, w, h, 10); g.stroke();
    const fh = h * pct / 100;
    if (fh > 1) { E.rr(g, x - w / 2, y - fh, w, fh, 10); E.fill(g, a); g.fill(); E.halo(g, x, y - fh, 90, a * 0.5); }
    E.big(g, Math.round(pct) + '%', x, y - h - 40, a, 40);
    if (label) E.label(g, label, x, y + 36, a, 16);
  };
  E.popcorn = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(-60, -140); g.lineTo(-42, 0); g.lineTo(42, 0); g.lineTo(60, -140); g.closePath();
    if (filled) { E.fill(g, a); g.fill(); } else { E.fill(g, 0.06 * a); g.fill(); } g.stroke();
    for (const sx of [-20, 20]) { g.beginPath(); g.moveTo(sx * 1.5, -140); g.lineTo(sx, 0); g.stroke(); }
    E.fill(g, a); for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-48 + i * 16, -150 - (i % 2) * 14, 16, 0, 7); filled ? g.fill() : g.stroke(); }
    g.restore();
  };
  E.phone = (g, x, y, s, a, text) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    E.stroke(g, a, 3); E.rr(g, -60, -120, 120, 240, 18); E.fill(g, 0.06 * a); g.fill(); g.stroke();
    E.rr(g, -18, -108, 36, 8, 4); E.fill(g, a); g.fill();
    if (text) E.label(g, text, 0, 0, a, 20, { track: 0.1, weight: 700 });
    g.restore();
  };
  E.car = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(-110, -30); g.lineTo(-110, -60); g.lineTo(-70, -65); g.lineTo(-40, -105); g.lineTo(45, -105); g.lineTo(80, -65); g.lineTo(110, -58); g.lineTo(110, -30); g.closePath();
    if (filled) { E.fill(g, a); g.fill(); } else { E.fill(g, 0.06 * a); g.fill(); } g.stroke();
    for (const wx of [-62, 62]) { E.fill(g, filled ? 0 : 0); g.beginPath(); g.arc(wx, -28, 24, 0, 7); g.fill(); E.stroke(g, a, 3); g.stroke(); }
    g.restore();
  };
  E.apartment = (g, x, y, s, a, glow = 0) => { E.building(g, x, y, 200 * s, 300 * s, a, glow); };
  E.plate = (g, x, y, s, a) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    g.beginPath(); g.ellipse(0, 0, 90, 26, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(0, -2, 60, 16, 0, 0, 7); g.stroke();
    g.beginPath(); g.arc(0, -10, 60, Math.PI, 0); g.stroke(); g.beginPath(); g.arc(0, -72, 7, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(-120, -40); g.lineTo(-120, 20); g.moveTo(120, -40); g.lineTo(120, 20); g.stroke();
    g.restore();
  };
  // treadmill: belt moving with time, person optional handled by caller
  E.treadmill = (g, x, y, s, a, t, speed = 1) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(-170, 0); g.lineTo(170, 0); g.arc(170, 15, 15, -Math.PI / 2, Math.PI / 2); g.lineTo(-170, 30); g.arc(-170, 15, 15, Math.PI / 2, Math.PI * 1.5); g.stroke();
    const off = (t * 120 * speed) % 40;
    E.stroke(g, a * 0.6, 2); for (let i = -170; i < 170; i += 40) { const xx = i + off; if (xx > 168) continue; g.beginPath(); g.moveTo(xx, 4); g.lineTo(xx, 26); g.stroke(); }
    E.stroke(g, a, 3); g.beginPath(); g.moveTo(130, 0); g.lineTo(150, -190); g.lineTo(100, -190); g.stroke();
    E.rr(g, 90, -215, 70, 30, 6); g.stroke();
    g.restore();
  };
  // line chart from series [[x,y]...] (world coords), revealed by p
  E.chartLine = (g, pts, p, a = 1, w = 4, dashed = false) => {
    if (dashed) g.setLineDash([14, 12]);
    E.path(g, pts, p, a, w, true);
    g.setLineDash([]);
  };

  // ---------- icons (v4) ----------
  E.jar = (g, x, y, s, a, fill = 0) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(-60, -170); g.lineTo(-60, -150); g.quadraticCurveTo(-90, -130, -90, -90); g.lineTo(-90, -10);
    g.quadraticCurveTo(-90, 0, -78, 0); g.lineTo(78, 0); g.quadraticCurveTo(90, 0, 90, -10); g.lineTo(90, -90); g.quadraticCurveTo(90, -130, 60, -150); g.lineTo(60, -170); g.stroke();
    g.strokeRect(-68, -195, 136, 25);
    const fh = 140 * clamp(fill);
    if (fh > 0) { E.fill(g, a * 0.9); g.fillRect(-80, -8 - fh, 160, fh); }
    g.restore();
  };
  E.shield = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, 0, 160, a);
    g.beginPath(); g.moveTo(0, -90); g.lineTo(75, -60); g.quadraticCurveTo(75, 40, 0, 95); g.quadraticCurveTo(-75, 40, -75, -60); g.closePath();
    if (filled) { E.fill(g, a); g.fill(); } else { E.stroke(g, a, 3.5); g.stroke(); }
    E.stroke(g, a, 6, filled ? 0 : 255); g.beginPath(); g.moveTo(-28, 0); g.lineTo(-6, 24); g.lineTo(32, -22); g.stroke();
    g.restore();
  };
  E.dice = (g, x, y, s, a, n = 5, rot = 0) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    E.rr(g, -45, -45, 90, 90, 16); E.fill(g, 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    const P = { 1: [[0, 0]], 2: [[-20, -20], [20, 20]], 3: [[-20, -20], [0, 0], [20, 20]], 4: [[-20, -20], [20, -20], [-20, 20], [20, 20]], 5: [[-20, -20], [20, -20], [0, 0], [-20, 20], [20, 20]], 6: [[-20, -22], [20, -22], [-20, 0], [20, 0], [-20, 22], [20, 22]] }[n];
    E.fill(g, a); for (const [px, py] of P) { g.beginPath(); g.arc(px, py, 7, 0, 7); g.fill(); }
    g.restore();
  };
  E.briefcase = (g, x, y, s, a) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    E.rr(g, -80, -50, 160, 110, 14); E.fill(g, 0.06 * a); g.fill(); g.stroke();
    E.rr(g, -28, -72, 56, 24, 8); g.stroke(); g.beginPath(); g.moveTo(-80, 0); g.lineTo(80, 0); g.stroke();
    g.restore();
  };
  // monospace-ish formula text revealed char by char
  E.typeText = (g, text, x, y, p, a = 1, size = 56) => {
    if (p <= 0 || a <= 0) return;
    const n = Math.floor(text.length * clamp(p));
    E.big(g, text.slice(0, n), x, y, a, size);
  };

  // ---------- icons (v5) ----------
  // banknote centred at (x,y); value text; shrink 0..1 makes the printed value fade (inflation)
  E.bill = (g, x, y, s, a, text = '$100', filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, 0, 220, a * 0.7);
    E.rr(g, -150, -70, 300, 140, 14); E.fill(g, filled ? a : 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    E.stroke(g, a * 0.6, 2, filled ? 0 : 255); g.beginPath(); g.ellipse(0, 0, 44, 50, 0, 0, 7); g.stroke();
    E.rr(g, -134, -54, 268, 108, 8); g.stroke();
    g.font = '800 30px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col(a, filled ? 0 : 255);
    g.fillText(text, 0, 2); g.font = '700 18px Inter'; g.fillText(text.replace('$', ''), -112, -34); g.fillText(text.replace('$', ''), 112, 34);
    g.restore();
  };
  E.receipt = (g, x, y, s, a, lines = [], total = '') => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.moveTo(-110, -170); g.lineTo(110, -170); g.lineTo(110, 160);
    for (let i = 0; i < 8; i++) g.lineTo(110 - (i + 0.5) * 27.5, 160 + (i % 2 ? 0 : 12));
    g.lineTo(-110, 160); g.closePath(); E.fill(g, 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    g.font = '700 16px Inter'; g.letterSpacing = '3px'; g.textBaseline = 'middle'; g.fillStyle = col(a);
    g.textAlign = 'center'; g.fillText('RECEIPT', 0, -140);
    g.font = '600 15px Inter'; g.letterSpacing = '1px';
    lines.forEach((l, i) => { g.textAlign = 'left'; g.fillText(l[0], -90, -95 + i * 32); g.textAlign = 'right'; g.fillText(l[1], 90, -95 + i * 32); });
    E.stroke(g, a * 0.6, 2); g.beginPath(); g.moveTo(-90, 85); g.lineTo(90, 85); g.stroke();
    g.font = '800 20px Inter'; g.textAlign = 'left'; g.fillText('TOTAL', -90, 115); g.textAlign = 'right'; g.fillText(total, 90, 115);
    g.restore();
  };
  // Concorde-like delta-wing jet, nose to the right
  E.plane = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, 0, 260, a * 0.6);
    g.beginPath(); g.moveTo(230, 0); g.lineTo(150, -14); g.lineTo(-40, -18); g.lineTo(-170, -95); g.lineTo(-200, -95); g.lineTo(-150, -18); g.lineTo(-210, -14); g.lineTo(-240, -60); g.lineTo(-262, -60); g.lineTo(-245, 0);
    g.lineTo(-262, 14); g.lineTo(-200, 18); g.lineTo(-40, 40); g.lineTo(-10, 80); g.lineTo(20, 80); g.lineTo(40, 22); g.lineTo(150, 14); g.closePath();
    E.fill(g, filled ? a : 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    g.restore();
  };
  E.ticket = (g, x, y, s, a, text = 'ADMIT ONE') => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.moveTo(-130, -60); g.lineTo(130, -60); g.lineTo(130, -18); g.arc(130, 0, 18, -Math.PI / 2, Math.PI / 2, true); g.lineTo(130, 60); g.lineTo(-130, 60); g.lineTo(-130, 18); g.arc(-130, 0, 18, Math.PI / 2, -Math.PI / 2, true); g.closePath();
    E.fill(g, 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    g.setLineDash([6, 6]); g.beginPath(); g.moveTo(70, -60); g.lineTo(70, 60); g.stroke(); g.setLineDash([]);
    E.label(g, text, -30, 0, a, 18, { weight: 800 });
    g.restore();
  };
  E.flag = (g, x, y, h, a, text, lit = 0) => {
    if (a <= 0) return;
    E.stroke(g, a, 3); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h); g.stroke();
    const w = Math.max(120, (text || '').length * 16 + 40);
    g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + w, y - h); g.lineTo(x + w - 18, y - h + 30); g.lineTo(x + w, y - h + 60); g.lineTo(x, y - h + 60); g.closePath();
    E.fill(g, a * (0.1 + 0.9 * lit)); g.fill(); g.stroke(); if (lit) E.halo(g, x + w / 2, y - h + 30, w, lit * a);
    if (text) E.label(g, text, x + w / 2 - 6, y - h + 30, a, 20, { weight: 800, track: 0.05, v: lit > 0.5 ? 0 : 255 });
  };
  // tree that grows: k 0..1 (seed → sapling → tree)
  E.tree = (g, x, y, s, a, k) => {
    if (a <= 0 || k <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    const h = 60 + 260 * k;
    E.stroke(g, a, 3 + 5 * k); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -h); g.stroke();
    if (k > 0.25) { const b = clamp((k - 0.25) / 0.75); E.stroke(g, a, 2 + 3 * b); g.beginPath(); g.moveTo(0, -h * 0.5); g.lineTo(-70 * b, -h * 0.75); g.moveTo(0, -h * 0.6); g.lineTo(80 * b, -h * 0.85); g.stroke(); }
    const r = 30 + 130 * k; E.halo(g, 0, -h - r * 0.2, r * 1.8, a * 0.5 * k);
    g.beginPath(); g.arc(0, -h - r * 0.2, r, 0, 7); E.fill(g, a * (0.05 + 0.12 * k)); g.fill(); E.stroke(g, a, 3); g.stroke();
    E.stroke(g, a * 0.7, 2); for (let i = 0; i < 5; i++) { const an = -2.6 + i * 0.55, rr = r * 0.55; g.beginPath(); g.arc(Math.cos(an) * rr * 0.6, -h - r * 0.2 + Math.sin(an) * rr * 0.4, r * 0.32, 0, 7); g.stroke(); }
    g.restore();
  };
  E.cart = (g, x, y, s, a) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3.5);
    g.beginPath(); g.moveTo(-110, -120); g.lineTo(-80, -120); g.lineTo(-50, -20); g.lineTo(90, -20); g.lineTo(110, -95); g.lineTo(-68, -95); g.stroke();
    g.beginPath(); g.arc(-35, 10, 13, 0, 7); g.stroke(); g.beginPath(); g.arc(75, 10, 13, 0, 7); g.stroke();
    g.restore();
  };

  // ---------- icons (v6) ----------
  E.wheel = (g, x, y, r, a, rot, labels) => {
    if (a <= 0) return;
    const n = labels.length;
    g.save(); g.translate(x, y);
    E.halo(g, 0, 0, r * 1.5, a * 0.4);
    E.stroke(g, a, 4); g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
    for (let i = 0; i < n; i++) {
      const an = rot + i * 2 * Math.PI / n;
      E.stroke(g, a * 0.6, 2); g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * r, Math.sin(an) * r); g.stroke();
      const am = an + Math.PI / n; g.save(); g.rotate(am); E.label(g, labels[i], r * 0.68, 0, a, 22, { weight: 800, track: 0 }); g.restore();
    }
    E.fill(g, a); g.beginPath(); g.arc(0, 0, 14, 0, 7); g.fill();
    g.beginPath(); g.moveTo(r + 34, 0); g.lineTo(r - 6, -18); g.lineTo(r - 6, 18); g.closePath(); g.fill();
    g.restore();
  };
  // donut chart: segs [{f, label}], p reveals segments in order
  E.donut = (g, x, y, r, segs, p, a = 1) => {
    if (a <= 0 || p <= 0) return;
    let start = -Math.PI / 2, shown = p * segs.length;
    segs.forEach((sg, i) => {
      const k = clamp(shown - i); if (k <= 0) return;
      const end = start + sg.f * 2 * Math.PI * k;
      g.beginPath(); g.arc(x, y, r, start, end); g.arc(x, y, r * 0.58, end, start, true); g.closePath();
      E.fill(g, a * [0.95, 0.5, 0.22][i % 3]); g.fill(); E.stroke(g, a, 2.5, 0); g.stroke();
      if (k >= 1 && sg.label) { const m = start + sg.f * Math.PI; E.label(g, sg.label, x + Math.cos(m) * r * 1.32, y + Math.sin(m) * r * 1.32, a, 20, { weight: 800 }); }
      start += sg.f * 2 * Math.PI;
    });
  };
  E.sticky = (g, x, y, s, a, lines) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.rotate(-0.04); g.scale(s, s);
    E.halo(g, 0, 0, 260, a * 0.5);
    g.beginPath(); g.moveTo(-150, -150); g.lineTo(150, -150); g.lineTo(150, 100); g.lineTo(100, 150); g.lineTo(-150, 150); g.closePath();
    E.fill(g, a); g.fill();
    g.beginPath(); g.moveTo(150, 100); g.lineTo(100, 100); g.lineTo(100, 150); E.fill(g, a * 0.6, 120); g.fill();
    lines.forEach((l, i) => E.label(g, l, 0, -80 + i * 62, a, 34, { v: 0, weight: 800, track: 0.04 }));
    g.restore();
  };
  // bank cheque
  E.cheque = (g, x, y, s, a, amount, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, 0, 280, a * 0.6);
    E.rr(g, -200, -90, 400, 180, 14); E.fill(g, filled ? a : 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    const v = filled ? 0 : 255;
    E.label(g, 'PAY TO THE ORDER OF: YOU', -40, -55, a, 12, { v, align: 'center', track: 0.12 });
    E.stroke(g, a * 0.6, 2, v); g.beginPath(); g.moveTo(-170, 10); g.lineTo(60, 10); g.moveTo(-170, 55); g.lineTo(0, 55); g.stroke();
    E.rr(g, 80, -20, 100, 50, 8); g.stroke();
    E.label(g, amount, 130, 6, a, 20, { v, weight: 800, track: 0 });
    g.restore();
  };
  E.robe = (g, x, y, s, a, filled = true) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, -120, 220, a * 0.7);
    g.beginPath(); g.moveTo(-40, -250); g.lineTo(40, -250); g.lineTo(120, -190); g.lineTo(90, -150); g.lineTo(70, -165); g.lineTo(85, 0); g.lineTo(-85, 0); g.lineTo(-70, -165); g.lineTo(-90, -150); g.lineTo(-120, -190); g.closePath();
    E.fill(g, filled ? a : 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    E.stroke(g, a, 3, filled ? 0 : 255); g.beginPath(); g.moveTo(-40, -250); g.lineTo(0, -170); g.lineTo(40, -250); g.moveTo(0, -170); g.lineTo(0, 0); g.moveTo(-70, -100); g.lineTo(70, -100); g.stroke();
    g.restore();
  };
  E.chair = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    g.beginPath(); g.moveTo(-50, -230); g.lineTo(-50, 0); g.moveTo(-50, -100); g.lineTo(60, -100); g.lineTo(60, 0); g.stroke();
    E.rr(g, -60, -110, 130, 22, 6); E.fill(g, filled ? a : 0.06 * a); g.fill(); g.stroke();
    E.rr(g, -60, -235, 22, 130, 6); E.fill(g, filled ? a : 0.06 * a); g.fill(); g.stroke();
    g.restore();
  };
  E.desk = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    E.rr(g, -130, -130, 260, 24, 6); E.fill(g, filled ? a : 0.06 * a); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-115, -106); g.lineTo(-115, 0); g.moveTo(115, -106); g.lineTo(115, 0); g.stroke();
    g.strokeRect(30, -106, 70, 50);
    g.restore();
  };
  E.sofa = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s); E.stroke(g, a, 3);
    E.rr(g, -160, -130, 320, 80, 20); E.fill(g, filled ? a : 0.06 * a); g.fill(); g.stroke();
    E.rr(g, -180, -80, 360, 60, 18); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-160, -20); g.lineTo(-160, 0); g.moveTo(160, -20); g.lineTo(160, 0); g.stroke();
    g.restore();
  };

  // ---------- icons (v7) ----------
  E.mug = (g, x, y, s, a, filled = false) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, -60, 170, a * 0.7);
    g.beginPath(); g.moveTo(-60, -130); g.lineTo(60, -130); g.lineTo(52, 0); g.lineTo(-52, 0); g.closePath();
    E.fill(g, filled ? a : 0.06 * a); g.fill(); E.stroke(g, a, 3.5); g.stroke();
    g.beginPath(); g.arc(70, -70, 34, -Math.PI / 2, Math.PI / 2); g.stroke();
    for (let i = 0; i < 3; i++) { E.stroke(g, a * 0.6, 2.5); g.beginPath(); g.moveTo(-30 + i * 30, -150); g.quadraticCurveTo(-40 + i * 30, -175, -30 + i * 30, -200); g.stroke(); }
    g.restore();
  };
  E.ccard = (g, x, y, s, a, filled = false, text = '') => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    if (filled) E.halo(g, 0, 0, 260, a * 0.6);
    E.rr(g, -170, -105, 340, 210, 20); E.fill(g, filled ? a : 0.06 * a); g.fill(); E.stroke(g, a, 3); g.stroke();
    const v = filled ? 0 : 255;
    E.rr(g, -140, -55, 56, 42, 8); E.stroke(g, a, 2.5, v); g.stroke();
    E.label(g, '••••  ••••  ••••  4021', 0, 30, a, 18, { v, track: 0.05, weight: 700 });
    if (text) E.label(g, text, 80, -60, a, 16, { v, weight: 800 });
    g.restore();
  };
  E.toggle = (g, x, y, s, a, on) => {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.scale(s, s);
    E.rr(g, -70, -36, 140, 72, 36); E.fill(g, a * (0.1 + 0.85 * on)); g.fill(); E.stroke(g, a, 3); g.stroke();
    E.fill(g, a, on > 0.5 ? 0 : 255); g.beginPath(); g.arc(lerp(-34, 34, on), 0, 26, 0, 7); g.fill();
    if (on > 0.5) E.halo(g, 0, 0, 160, a * 0.5 * on);
    g.restore();
  };
})();
