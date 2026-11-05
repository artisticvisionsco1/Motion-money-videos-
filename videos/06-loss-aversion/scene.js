// 06 — Loss aversion (Kahneman & Tversky)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  d100a: w('$100', 1), hurts1: w('hurts', 1), twice1: w('twice', 1), winning: w('winning'), good: w('good'),
  most: w('most'), logic: w('logic'), but1: w('but', 1), y1970: w('1970s'), psych: w('psychologists'), kahneman: w('kahneman'),
  showed: w('showed'), losses: w('losses'), twice2: w('twice', 2), gains: w('gains'), loss1: w('loss', 1),
  hold: w('hold'), stocks: w('stocks'), breakw: w('break'),
  why2: w('why', 2), cash: w('cash'), inflation: w('inflation'), eats: w('eats'),
  why3: w('why', 3), skip: w('skip'), opportunities: w('opportunities'), loss2: w('loss', 2), possible: w('possible'),
  course: w('course'), caution: w('caution'), protect: w('protect'), fear: w('fear'), risk: w('risk'), protection: w('protection'),
  so: w('so'), ask: w('ask'), avoiding: w('avoiding'), feeling: w('feeling'),
  because: w('because', 2), hurts2: w('hurts', 2), twice4: w('twice', 4), likely: w('likely'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -250, z: 1.08 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -260, 1.3),
  F_(T.but1 - 0.4, C, -160, 1.0),
  F_(T.hold - 0.6, D, -260, 1.25),
  F_(T.why2 - 0.4, E2, -250, 1.35),
  F_(T.why3 - 0.4, F, -250, 1.3),
  F_(T.course - 0.5, G, -260, 1.3),
  F_(T.so - 0.4, H, -280, 1.2),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

// ---------- A: asymmetric scale ----------
function zoneA(g, t) {
  const x = A, top = -470, L = 330;
  const ang = -0.32 * (0.85 + 0.15 * Math.sin(t * 1.3));      // loss side down
  const lx = x - Math.cos(ang) * L, ly = top - Math.sin(ang) * L * -1;
  const rx = x + Math.cos(ang) * L, ry = top - Math.sin(ang) * L;
  MM.stroke(g, 1, 3);
  g.beginPath(); g.moveTo(x, 0); g.lineTo(x, top); g.moveTo(x - 90, 0); g.lineTo(x + 90, 0); g.moveTo(lx, ly); g.lineTo(rx, ry); g.stroke();
  MM.fill(g, 1); g.beginPath(); g.arc(x, top, 10, 0, 7); g.fill();
  for (const [px, py] of [[lx, ly], [rx, ry]]) {
    MM.stroke(g, 1, 3); g.beginPath(); g.moveTo(px, py); g.lineTo(px - 90, py + 160); g.moveTo(px, py); g.lineTo(px + 90, py + 160); g.stroke();
    g.beginPath(); g.moveTo(px - 115, py + 160); g.quadraticCurveTo(px, py + 215, px + 115, py + 160); g.closePath(); g.stroke();
  }
  // weights: LOSS is a big filled block, GAIN a light outline block of the same $100
  MM.build(g, t, -0.3, lx, ly + 110, 90, (g2, a) => { MM.rr(g2, lx - 70, ly + 70, 140, 88, 10); MM.fill(g2, a); g2.fill(); MM.label(g2, '−$100', lx, ly + 114, a, 26, { v: 0, weight: 800, track: 0.02 }); });
  MM.build(g, t, T.winning - 0.3, rx, ry + 110, 90, (g2, a) => { MM.rr(g2, rx - 70, ry + 70, 140, 88, 10); MM.stroke(g2, a, 3); g2.stroke(); MM.label(g2, '+$100', rx, ry + 114, a, 26, { weight: 800, track: 0.02 }); });
  MM.label(g, 'LOSS', lx, ly + 250, p(t, 0.3, 0.4), 20);
  MM.label(g, 'GAIN', rx, ry + 250, p(t, T.winning, 0.4), 20);
  // feeling meters
  const pa = p(t, T.hurts1 - 0.2, 0.5), ja = p(t, T.good - 0.3, 0.5);
  MM.pctBar(g, x - 610, 0, 340, 100 * out(clamp((t - T.hurts1) / 0.8)), pa, 'PAIN');
  MM.pctBar(g, x + 610, 0, 340, 50 * out(clamp((t - T.good + 0.2) / 0.8)), ja, 'JOY');
  MM.pill(g, '2 ×', x, -640, win(t, T.twice1, T.most) + win(t, T.twice4, null), 26, true);
  MM.pill(g, 'PAIN ≠ PROBABILITY', x, 90, win(t, T.likely - 0.5, null), 22, true);
}

// ---------- B: "logic" ----------
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 280, 0, 1.2, p(t, T.most, 0.4), true);
  MM.build(g, t, T.most + 0.4, x + 150, -300, 200, (g2, a) => {
    MM.rr(g2, x - 80, -400, 460, 200, 26); MM.stroke(g2, a, 3); g2.stroke();
    MM.big(g2, '−100  =  +100', x + 150, -300, a, 52);
  }, 0.8);
  // bubble dots to head
  for (let i = 0; i < 3; i++) { const a = p(t, T.most + 0.3 + i * 0.12, 0.3); MM.stroke(g, a, 2.5); g.beginPath(); g.arc(x - 220 + i * 60, -200 - i * 40, 8 + i * 4, 0, 7); g.stroke(); }
  MM.pill(g, 'LOGIC?', x + 150, -450, win(t, T.logic - 0.2, null), 22);
}

// ---------- C: the value function (prospect theory) ----------
function zoneC(g, t) {
  const x = C, Y0 = -250, ak = p(t, T.but1, 0.8);
  MM.path(g, [[x - 700, Y0], [x + 700, Y0]], ak, 0.7, 2.5, false);
  MM.path(g, [[x, 260], [x, -560]], ak, 0.7, 2.5, false);
  MM.label(g, 'GAINS →', x + 600, -250, ak, 16);
  MM.label(g, '← LOSSES', x - 600, -250, ak, 16);
  MM.label(g, 'FEELING', x + 70, -540, ak, 16);
  MM.pill(g, '1979 · KAHNEMAN & TVERSKY', x, -640, win(t, T.y1970, null), 20);
  // curve: gains concave (gentle), losses convex and ~2.25x steeper
  const v = u => u >= 0 ? Math.pow(u, 0.88) : -2.25 * Math.pow(-u, 0.88);
  const pts = []; for (let u = -1; u <= 1.0001; u += 0.02) pts.push([x + u * 650, Y0 - v(u) * 200]);
  const ck = inOut(clamp((t - T.psych + 0.2) / 3.0));
  // draw from centre outward: gains then losses
  const half = Math.floor(pts.length / 2);
  MM.path(g, pts.slice(half), ck, 1, 5, ck < 1);
  MM.path(g, pts.slice(0, half + 1).reverse(), ck, 1, 5, ck < 1);
  // ±100 markers
  const mk = p(t, T.losses, 0.6);
  const gy = Y0 - v(0.4) * 200, ly = Y0 - v(-0.4) * 200;
  MM.stroke(g, mk * 0.8, 2); g.setLineDash([8, 8]);
  g.beginPath(); g.moveTo(x + 260, Y0); g.lineTo(x + 260, gy); g.lineTo(x, gy); g.moveTo(x - 260, Y0); g.lineTo(x - 260, ly); g.lineTo(x, ly); g.stroke(); g.setLineDash([]);
  MM.label(g, '+$100', x + 260, -250, mk, 16); MM.label(g, '−$100', x - 260, -310, mk, 16);
  MM.pill(g, '≈ 2× STRONGER', x - 330, ly + 60, win(t, T.twice2, null), 20, true);
  MM.build(g, t, T.loss1 - 0.3, x + 360, -470, 260, (g2, a) => MM.big(g2, 'LOSS AVERSION', x + 360, -470, a, 60), 0.8);
}

// ---------- D: holding losing stocks ----------
function zoneD(g, t) {
  const x = D;
  const pts = []; for (let i = 0; i <= 14; i++) pts.push([x - 600 + i * 80, -460 + i * 24 + (i % 2 ? 30 : -20)]);
  MM.path(g, pts, p(t, T.hold - 0.3, 1.6), 1, 4, true);
  g.setLineDash([12, 10]); MM.path(g, [[x - 640, -480], [x + 640, -480]], p(t, T.stocks, 0.6), 0.7, 2.5, false); g.setLineDash([]);
  MM.label(g, 'BUY PRICE', x + 560, -510, p(t, T.stocks, 0.4), 16);
  MM.person(g, x + 300, 0, 1.0, p(t, T.hold - 0.2, 0.4), true);
  MM.ground(g, x - 640, x + 640, 0, 0.6);
  MM.pill(g, 'WAITING TO BREAK EVEN', x + 300, -230, win(t, T.breakw - 0.2, null), 18, true);
  // calendar pages flipping: years passing
  const yrs = Math.min(5, Math.floor(Math.max(0, t - T.stocks) * 2.5));
  MM.label(g, `${yrs} YEARS`, x - 300, 40, p(t, T.stocks + 0.3, 0.4), 20);
}

// ---------- E: cash melting to inflation ----------
function zoneE(g, t) {
  const x = E2;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  const melt = clamp((t - T.inflation) / 2.2);
  MM.build(g, t, T.cash - 0.4, x - 150, -100, 140, (g2, a) => MM.jar(g2, x - 150, 0, 1.6, a, 0.95 - 0.45 * melt));
  MM.label(g, 'SAVINGS', x - 150, 40, p(t, T.cash, 0.4), 20);
  MM.big(g, MM.money(10000 * (1 - 0.3 * melt)), x - 150, -380, p(t, T.cash, 0.4), 48);
  MM.label(g, 'WHAT IT CAN BUY', x - 150, -330, p(t, T.inflation, 0.4), 14);
  // inflation "bites": small particles leaking away
  for (let i = 0; i < 24; i++) {
    const ts = T.inflation + i * 0.09, k = clamp((t - ts) / 1.0); if (k <= 0 || k >= 1) continue;
    MM.fill(g, 1 - k); g.beginPath(); g.arc(x - 60 + k * 420, -180 - Math.sin(i) * 60 - k * 120, 4, 0, 7); g.fill();
  }
  MM.pill(g, 'INFLATION', x + 330, -260, win(t, T.inflation, null), 22, true);
}

// ---------- F: skipping good opportunities ----------
function zoneF(g, t) {
  const x = F;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  const dk = p(t, T.skip - 0.2, 0.7);
  if (dk > 0) {
    MM.halo(g, x + 260, -170, 260, dk);
    MM.rr(g, x + 170, -340, 180, 340, 6); MM.fill(g, dk * 0.85); g.fill(); MM.stroke(g, dk, 3); g.stroke();
    MM.label(g, '+', x + 260, -180, dk, 72, { v: 0, weight: 800, track: 0 });
  }
  MM.label(g, 'GOOD ODDS', x + 260, 40, p(t, T.opportunities, 0.4), 18);
  // person turns away and walks off
  const wk = MM.walk(t, T.loss2 - 0.4, x - 60, x - 420, 1.4);
  MM.person(g, wk.x, wk.bob, 1.1, p(t, T.why3, 0.4), true);
  MM.pill(g, 'A LOSS IS POSSIBLE', x - 200, -330, win(t, T.loss2, null), 18);
}

// ---------- G: caution vs fear ----------
function zoneG(g, t) {
  const x = G;
  MM.build(g, t, T.caution - 0.3, x - 420, -250, 140, (g2, a) => MM.shield(g2, x - 420, -250, 1.4, a, true));
  MM.label(g, 'CAUTION ✓', x - 420, -60, p(t, T.protect, 0.4), 20);
  const ra = p(t, T.risk - 0.3, 0.5), fa = p(t, T.fear - 0.2, 0.6);
  MM.stroke(g, ra, 3); g.beginPath(); g.arc(x + 80, -250, 70, 0, 7); g.stroke(); MM.label(g, 'RISK', x + 80, -250, ra, 18);
  const fr = 140 * (0.5 + 0.5 * out(clamp((t - T.fear) / 0.8)));
  MM.fill(g, fa * 0.9); g.beginPath(); g.arc(x + 400, -250, fr, 0, 7); g.fill(); MM.halo(g, x + 400, -250, fr * 1.6, fa * 0.6);
  MM.label(g, 'FEAR', x + 400, -250, fa, 22, { v: 0, weight: 800 });
  MM.pill(g, '2 × THE SIZE', x + 400, -460, win(t, T.fear + 0.3, null), 18, true);
  MM.label(g, "ISN'T PROTECTION", x + 240, 0, win(t, T.protection - 0.3, null), 22);
}

// ---------- H: the question ----------
function zoneH(g, t) {
  const x = H;
  const ck = p(t, T.so - 0.1, 0.6);
  if (ck > 0) { MM.rr(g, x - 620, -560, 1240, 420, 30); MM.fill(g, 0.04 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke(); }
  MM.label(g, 'BEFORE YOU SAY NO, ASK:', x, -500, p(t, T.ask - 0.2, 0.4), 20);
  MM.typeText(g, 'AM I AVOIDING THE LOSS', x, -400, clamp((t - T.avoiding + 0.4) / 1.0), 1, 52);
  MM.typeText(g, 'OR THE FEELING OF IT?', x, -300, clamp((t - T.feeling + 0.3) / 0.9), 1, 52);
  MM.ripple(g, x, -350, t, T.feeling + 0.8, 120, 700, 1.0);
}

const SCENE = {
  duration: T.end,
  camera,
  draw(g, t, cam) {
    const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
    if (near(A)) zoneA(g, t);
    if (near(B)) zoneB(g, t);
    if (near(C)) zoneC(g, t);
    if (near(D)) zoneD(g, t);
    if (near(E2)) zoneE(g, t);
    if (near(F)) zoneF(g, t);
    if (near(G)) zoneG(g, t);
    if (near(H)) zoneH(g, t);
  },
};
