// 03 — The decoy effect (Ariely's Economist experiment)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  worst1: w('worst', 1), spend: w('spend'), most: w('most'), choose1: w('choose', 1), best: w('best'),
  but1: w('but', 1), famous: w('famous'), arielli: w('arielli'), students1: w('students', 1), three: w('three'),
  online1: w('online', 1), d59: w('$59'), print1: w('print', 1), d125a: w('$125', 1), print2: w('print', 2), d125b: w('$125', 2),
  nobody1: w('nobody', 1), p84: w('84%'), bundle1: w('bundle', 1),
  then: w('then'), removed: w('removed'), wanted: w('wanted'),
  suddenly: w('suddenly'), p68: w('68%'), cheap: w('cheap'),
  same1: w('same', 1), same2: w('same', 2),
  useless: w('useless'), revenue: w('revenue'), p43: w('43%'),
  never: w('never'), expensive: w('expensive'), deal1: w('deal', 1),
  decoy: w('decoy'), effect: w('effect'),
  brain: w('brain'), value: w('value'), comparison: w('comparison'), companies: w('companies'), design: w('design'),
  medium: w('medium'), popcorn: w('popcorn'), large: w('large'),
  phone: w('phone'), d100: w('$100'), storage: w('storage'),
  of: w('of', 1), bundle2: w('bundle', 2), deal2: w('deal', 2),
  so2: w('so', 2), cover: w('cover'), middle: w('middle'), would: w('would'), choose3: w('choose', 2),
  because: w('because'), worst2: w('worst', 2), choose4: w('choose', 3),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000, I = 40000;
const OPEN = { x: 0, y: -230, z: 1.4 };
const F_ = (t, x, y, z, d = 0.9) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  { t: T.most - 0.2, d: 0.8, x: 0, y: -60, z: 1.0 },
  F_(T.but1 - 0.3, B, -230, 1.4),
  F_(T.three - 0.5, C, -240, 1.02),
  F_(T.useless - 0.45, D, -280, 1.35),
  F_(T.never - 0.45, E2, -320, 1.35),
  F_(T.brain - 0.45, F, -280, 1.7),
  F_(T.medium - 0.5, G, -200, 1.45),
  { t: T.phone - 0.15, d: 0.7, x: G + 1090, y: -200, z: 1.6 },
  F_(T.of - 0.45, H, -230, 1.75),
  F_(T.so2 - 0.45, I, -280, 1.35),
  F_(T.because - 0.45, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.85, d: 0.8, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

const CARDS = [
  { title: 'ONLINE', price: '$59', sub: 'ONLY' },
  { title: 'PRINT', price: '$125', sub: 'ONLY' },
  { title: 'PRINT + ONLINE', price: '$125', sub: 'BUNDLE' },
];

// ---------- A: the menu (hook + ending) ----------
function zoneA(g, t) {
  const xs = [-360, 0, 360], cy = -260;
  const end = t > T.because - 0.5;
  for (let i = 0; i < 3; i++) {
    const hot = i === 2 ? p(t, T.spend - 0.2, 0.5) : 0;
    const flick = i === 1 && t > T.worst1 && t < T.worst1 + 1 ? 0.5 + 0.5 * Math.sin(t * 40) : 1;
    MM.build(g, t, -0.3 + i * 0.12, xs[i], cy, 160, (g2, a) => MM.card(g2, xs[i], cy, a * (i === 1 ? 0.65 * flick : 1),
      { title: ['SMALL', 'MEDIUM', 'LARGE'][i], price: ['$3', '$7', '$7.50'][i], sub: i === 1 ? 'DECOY' : '', hot, w: 240, h: 300 }));
  }
  MM.pill(g, 'WORST OPTION', 0, -460, win(t, T.worst1 + 0.1, T.most) + (end ? win(t, T.worst2, null) : 0), 20);
  // arrow from middle to right on "spend more"
  const ak = p(t, T.spend - 0.1, 0.6);
  MM.path(g, [[60, -440], [200, -500], [330, -440]], ak, 0.9, 3, true);
  // person + thought on "most people"
  const pk = p(t, T.most, 0.6);
  MM.person(g, -560, 120, 1.0, pk, true);
  MM.pill(g, 'BEST FOR ME?', -560, -110, win(t, T.best, T.but1), 18);
  if (end) {
    const bk = p(t, T.choose4 - 0.4, 0.7);
    MM.beam(g, [[-40, -120], [40, -120], [-500, 20], [-620, 20]], bk);
    MM.label(g, 'IT CHOOSES FOR YOU', 0, 90, win(t, T.choose4 - 0.2, null), 24);
  }
}

// ---------- B: the experiment ----------
function zoneB(g, t) {
  const x = B;
  MM.pill(g, 'FAMOUS EXPERIMENT', x, -560, win(t, T.famous, null), 20);
  MM.label(g, 'DAN ARIELY · BEHAVIORAL ECONOMIST', x, -500, win(t, T.arielli, null), 20);
  // 100 students build in a 20x5 block
  for (let i = 0; i < 100; i++) {
    const c = i % 20, r = Math.floor(i / 20);
    const px = x - 570 + c * 60, py = -330 + r * 72;
    const k = p(t, T.famous + 0.2 + (c + r * 3) * 0.035, 0.35);
    if (k <= 0) continue;
    g.save(); g.translate(px, py); g.scale(0.35 * k, 0.35 * k);
    MM.person(g, 0, 0, 1, 1, i % 7 === 0);
    g.restore();
  }
  MM.big(g, Math.round(100 * out(clamp((t - T.famous - 0.3) / 2.2))).toString(), x, 60, p(t, T.famous + 0.3, 0.4), 80);
  MM.label(g, 'STUDENTS', x, 120, p(t, T.famous + 0.5, 0.4), 20);
}

// ---------- C: the three subscriptions + live choice data ----------
const CX = [-360, 0, 360];
function zoneC(g, t) {
  const x = C, cy = -330;
  const removedK = p(t, T.wanted - 0.2, 0.8);
  const ts = [T.online1 - 0.2, T.print1 - 0.2, T.print2 - 0.2];
  for (let i = 0; i < 3; i++) {
    let hot = 0;
    if (i === 2) hot = p(t, T.p84, 0.5) * (1 - p(t, T.p68, 0.5));
    if (i === 0) hot = p(t, T.p68, 0.5);
    const fall = i === 1 ? removedK : 0;
    const cxp = x + CX[i], cyp = cy + 400 * fall * fall;
    MM.build(g, t, ts[i], cxp, cy, 160, (g2, a) => MM.card(g2, cxp, cyp, a * (1 - fall),
      { ...CARDS[i], hot, cross: i === 1 ? p(t, T.removed - 0.1, 0.8) : 0 }));
  }
  MM.pill(g, 'NOBODY', x, -540, win(t, T.nobody1, T.p84 + 1.2), 18);
  // pool of 100 dots → bars
  const s1 = T.nobody1 + 0.2, s2 = T.p68 - 0.7;
  const barY = 160, barH = 230;
  const L = { x: x + CX[0], y: barY - barH }, R = { x: x + CX[2], y: barY - barH }, P = { x: x, y: -650 };
  let left = 0, right = 0;
  for (let i = 0; i < 100; i++) {
    const px = P.x - 70 + (i % 10) * 15, py = P.y - 70 + Math.floor(i / 10) * 15;
    const d1 = s1 + i * 0.015, a1 = clamp((t - d1) / 0.55);
    const first = i < 16 ? L : R;
    let fx, fy, vis = true;
    if (t < d1) { fx = px; fy = py; vis = t > T.three; }
    else if (a1 < 1) { const e = inOut(a1); fx = lerp(px, first.x, e); fy = lerp(py, first.y, e) - Math.sin(Math.PI * e) * 120; }
    else { vis = false; if (i < 16) left++; else right++; }
    // phase 2: dots 16..67 switch from right to left
    if (i >= 16 && i < 68 && t > s2) {
      const d2 = s2 + (i - 16) * 0.02, a2 = clamp((t - d2) / 0.55);
      if (t >= d2) { right--; vis = a2 < 1; if (a2 >= 1) left++; const e = inOut(a2); fx = lerp(R.x, L.x, e); fy = lerp(R.y, L.y, e) - Math.sin(Math.PI * e) * 160; }
    }
    if (vis && t > T.three - 0.2) { MM.fill(g, 0.9 * p(t, T.three - 0.2, 0.5)); g.beginPath(); g.arc(fx, fy, 4.5, 0, 7); g.fill(); }
  }
  const ba = p(t, T.nobody1 - 0.2, 0.5);
  MM.pctBar(g, L.x, barY, barH, left, ba, 'ONLINE');
  MM.pctBar(g, x + CX[1], barY, barH, 0, ba * (1 - removedK), 'PRINT');
  MM.pctBar(g, R.x, barY, barH, right, ba, 'BUNDLE');
  MM.pill(g, 'SAME PRICES', x - 200, 290, win(t, T.same1, null), 18);
  MM.pill(g, 'SAME STUDENTS', x + 200, 290, win(t, T.same2, null), 18);
}

// ---------- D: revenue ----------
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  const a = p(t, T.useless - 0.1, 0.6), grow = out(clamp((t - T.revenue + 0.2) / 1.0));
  const h1 = 300 * a, h2 = 300 * a * (1 + 0.428 * grow), bw = 190;
  MM.stroke(g, a, 3); g.strokeRect(x - 230 - bw / 2, -h1, bw, h1); MM.fill(g, 0.12 * a); g.fillRect(x - 230 - bw / 2, -h1, bw, h1);
  MM.label(g, 'WITHOUT DECOY', x - 230, 40, a, 18);
  MM.big(g, '$8,012', x - 230, -h1 - 45, a, 46);
  MM.fill(g, a); g.fillRect(x + 230 - bw / 2, -h2, bw, h2); MM.halo(g, x + 230, -h2 / 2, 260, a * 0.5);
  MM.label(g, 'WITH DECOY', x + 230, 40, a, 18);
  MM.big(g, MM.money(8012 + 3432 * grow), x + 230, -h2 - 45, a, 46);
  MM.label(g, 'REVENUE PER 100 STUDENTS', x, 100, a, 18);
  const pk = p(t, T.p43 - 0.2, 0.4);
  MM.big(g, '+' + Math.round(43 * out(clamp((t - T.p43 + 0.2) / 0.8))) + '%', x, -640, pk, 110);
  MM.ripple(g, x, -640, t, T.p43 + 0.6, 80, 420, 1);
}

// ---------- E: decoy pushes you to the bundle ----------
function zoneE(g, t) {
  const x = E2, cy = -260;
  g.setLineDash([12, 10]);
  MM.build(g, t, T.never - 0.3, x - 260, cy, 160, (g2, a) => MM.card(g2, x - 260, cy, a * 0.7, { title: 'PRINT', price: '$125', sub: 'DECOY' }));
  g.setLineDash([]);
  const hot = p(t, T.expensive, 0.6);
  MM.build(g, t, T.never + 0.4, x + 260, cy, 160, (g2, a) => MM.card(g2, x + 260, cy, a, { title: 'PRINT + ONLINE', price: '$125', sub: 'BUNDLE', hot }));
  MM.beam(g, [[x - 130, cy - 80], [x - 130, cy + 80], [x + 130, cy + 160], [x + 130, cy - 160]], p(t, T.expensive - 0.2, 0.6));
  MM.pill(g, 'NEVER MEANT TO BE BOUGHT', x - 260, cy + 230, win(t, T.never + 0.3, null), 18);
  MM.pill(g, 'LOOKS LIKE A DEAL', x + 260, cy + 230, win(t, T.deal1 - 0.3, null), 18, true);
  // title
  const tk = p(t, T.decoy - 0.15, 0.5);
  MM.build(g, t, T.decoy - 0.3, x, -620, 260, (g2, a) => MM.big(g2, 'THE DECOY EFFECT', x, -620, a, 72), 0.8);
  MM.ripple(g, x, -620, t, T.effect, 100, 600, 1.1);
}

// ---------- F: brain judges by comparison ----------
function zoneF(g, t) {
  const x = F;
  // lone tag with "?"
  MM.build(g, t, T.brain - 0.2, x - 250, -300, 120, (g2, a) => MM.tag(g2, x - 250, -470, a, 0.1 * Math.sin(t * 2), '$ ?', 2.2));
  MM.label(g, 'VALUE ON ITS OWN ?', x - 250, -80, win(t, T.value - 0.1, null), 20);
  // comparison: second tag + scale arrows
  MM.build(g, t, T.comparison - 0.3, x + 250, -300, 120, (g2, a) => MM.tag(g2, x + 250, -470, a, -0.1 * Math.sin(t * 2), '$ $', 2.2));
  const ck = p(t, T.comparison, 0.6);
  MM.path(g, [[x - 120, -280], [x + 120, -280]], ck, 0.9, 3, true);
  MM.path(g, [[x + 120, -250], [x - 120, -250]], ck, 0.6, 2, false);
  MM.pill(g, 'COMPARISON', x, -340, win(t, T.comparison + 0.2, null), 18, true);
  MM.label(g, 'DESIGNED FOR YOU', x, 40, win(t, T.design - 0.1, null), 26);
  MM.ground(g, x - 600, x + 600, -20, 0.5 * p(t, T.brain, 0.5));
}

// ---------- G: popcorn + phone ----------
function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 600, x + 1700, 0, 0.6);
  const sizes = [0.75, 1.0, 1.15], xs = [x - 360, x, x + 380], prices = ['$5', '$8.50', '$9'];
  for (let i = 0; i < 3; i++) {
    const t0 = T.medium - 0.4 + i * 0.25;
    const hot = i === 2 && t > T.large;
    MM.build(g, t, t0, xs[i], -120, 120, (g2, a) => MM.popcorn(g2, xs[i], 0, sizes[i] * 1.3, a * (i === 1 ? 0.7 : 1), hot));
    MM.big(g, prices[i], xs[i], -330 * sizes[i] - 30, p(t, t0 + 0.4, 0.4), 40);
  }
  MM.pill(g, 'DECOY', x, 60, win(t, T.popcorn, null), 18);
  MM.pill(g, '+ 50¢ ONLY', x + 380, 60, win(t, T.large, null), 18, true);
  // phones
  const px1 = x + 920, px2 = x + 1260;
  MM.build(g, t, T.phone - 0.2, px1, -160, 120, (g2, a) => MM.phone(g2, px1, -160, 1.2, a, '128 GB'));
  MM.build(g, t, T.phone + 0.2, px2, -160, 120, (g2, a) => MM.phone(g2, px2, -160, 1.2, a, '256 GB'));
  MM.big(g, '$799', px1, -350, p(t, T.phone + 0.2, 0.4), 40);
  MM.big(g, '$899', px2, -350, p(t, T.phone + 0.5, 0.4), 40);
  MM.pill(g, '+$100', (px1 + px2) / 2, -470, win(t, T.d100 - 0.1, null), 20, true);
  MM.label(g, 'LITTLE EXTRA STORAGE', (px1 + px2) / 2, 60, win(t, T.storage - 0.3, null), 18);
}

// ---------- H: sometimes the bundle is fine ----------
function zoneH(g, t) {
  const x = H, cy = -250;
  MM.build(g, t, T.of - 0.1, x, cy, 160, (g2, a) => MM.card(g2, x, cy, a, { title: 'PRINT + ONLINE', price: '$125', sub: 'BUNDLE', hot: 0.3 }));
  const ck = p(t, T.deal2 - 0.5, 0.6);
  MM.path(g, [[x + 190, cy - 20], [x + 240, cy + 40], [x + 340, cy - 90]], ck, 1, 8, true);
  MM.label(g, 'SOMETIMES IT REALLY IS', x, cy + 240, win(t, T.bundle2 - 0.2, null), 22);
}

// ---------- I: the middle-option test ----------
function zoneI(g, t) {
  const x = I, cy = -260;
  for (let i = 0; i < 3; i++) {
    const xs = x + [-360, 0, 360][i];
    MM.build(g, t, T.so2 - 0.3 + i * 0.12, xs, cy, 160, (g2, a) => MM.card(g2, xs, cy, a, { ...CARDS[i], hot: i === 2 ? 0.25 * p(t, T.would, 0.5) : 0 }));
  }
  // cover slides down over the middle card
  const ck = inOut(clamp((t - T.cover + 0.1) / 0.6));
  if (ck > 0) {
    const top = cy - 200, hgt = 400 * ck;
    MM.rr(g, x - 150, top, 300, hgt, 22); g.fillStyle = '#000'; g.fill(); MM.stroke(g, 1, 3); g.stroke();
    if (ck > 0.8) MM.label(g, 'COVERED', x, top + hgt / 2, clamp((ck - 0.8) * 5), 22);
  }
  MM.pill(g, 'WOULD I STILL CHOOSE THIS?', x + 360, cy + 240, win(t, T.would - 0.1, null), 18, true);
  MM.label(g, 'THE MIDDLE-OPTION TEST', x, -560, win(t, T.cover - 0.4, null), 26);
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
    if (near(I)) zoneI(g, t);
  },
};
