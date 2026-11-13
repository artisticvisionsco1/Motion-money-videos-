// 28 — Charm pricing: $39 beats $34 (Anderson & Simester, 2003)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  higher1: w('higher', 1), more1: w('more', 1), most1: w('most', 1), better: w('better'), but1: w('but', 1), y2003: w('2003'), anderson: w('anderson'),
  simester: w('simester'), tested: w('tested'), catalog: w('catalog'), dress: w('dress'), p34a: w('$34', 1), p39a: w('$39', 1), p44: w('$44'),
  p39b: w('$39', 2), sold: w('sold'), p34b: w('$34', 2), d5: w('$5'), ending1: w('ending', 1), deal1: w('deal', 1), brain: w('brain'), digit: w('digit'),
  course: w('course'), real: w('real'), but2: w('but', 2), ending2: w('ending', 2), round: w('round'), n39: w('39'), n40: w('40'), n999: w('999'),
  n10: w('10'), because: w('because'), ends: w('ends'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most1 - 0.4, B, -290, 1.35), F_(T.but1 - 0.4, C, -300, 1.3), F_(T.dress - 0.5, D, -300, 1.2),
  F_(T.p39b - 0.5, E2, -300, 1.2), F_(T.ending1 - 0.4, F, -300, 1.25), F_(T.course - 0.4, G, -280, 1.4),
  F_(T.but2 - 0.4, H, -300, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
function dress(g, x, y, s, a, filled = false) {
  if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s);
  if (filled) MM.halo(g, 0, -100, 160, a * 0.6);
  g.beginPath(); g.moveTo(-40, -200); g.quadraticCurveTo(0, -170, 40, -200); g.lineTo(55, -120); g.lineTo(35, -90); g.lineTo(110, 0); g.lineTo(-110, 0); g.lineTo(-35, -90); g.lineTo(-55, -120); g.closePath();
  MM.fill(g, filled ? a : 0.06 * a); g.fill(); MM.stroke(g, a, 3); g.stroke();
  MM.stroke(g, a, 3, filled ? 0 : 255); g.beginPath(); g.moveTo(-35, -90); g.lineTo(35, -90); g.stroke();
  g.restore();
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.build(g, t, -0.4, x - 320, -300, 140, (g2, a) => MM.tag(g2, x - 320, -470, a, 0.1 * Math.sin(t * 2), end ? '$39 = $40' : '$39', 2.6));
  MM.label(g, 'HIGHER PRICE', x - 320, -80, p(t, T.higher1 - 0.2, 0.4), 18, { weight: 800 });
  MM.build(g, t, 0.2, x + 320, -280, 140, (g2, a) => MM.cart(g2, x + 320, -220, 1.8, a));
  for (let i = 0; i < 3; i++) MM.build(g, t, T.more1 - 0.6 + i * 0.25, x + 270 + i * 60, -330, 40, (g2, a) => MM.box(g2, x + 270 + i * 60, -330, 0.45, a, true));
  MM.label(g, 'MORE SALES', x + 320, -80, p(t, T.more1 - 0.2, 0.4), 18, { weight: 800 });
  MM.path(g, [[x - 120, -300], [x + 120, -300]], p(t, 0.5, 0.5), 1, 3, true);
  if (end) MM.pill(g, 'ROUND IT UP IN YOUR HEAD', x, -20, win(t, T.ends - 0.6, null), 22, true);
}
function zoneB(g, t) {
  const x = B;
  MM.big(g, 'LOWER PRICE = MORE SALES?', x, -580, p(t, T.most1 - 0.1, 0.4), 50);
  const ak = p(t, T.most1, 0.5);
  MM.path(g, [[x - 500, -460], [x - 200, -160]], ak, 1, 5, true); MM.label(g, 'PRICE ↓', x - 350, -110, ak, 20, { weight: 800 });
  MM.path(g, [[x + 200, -160], [x + 500, -460]], p(t, T.most1 + 0.6, 0.5), 1, 5, true); MM.label(g, 'SALES ↑', x + 350, -110, p(t, T.most1 + 0.6, 0.4), 20, { weight: 800 });
  MM.label(g, 'ALWAYS?', x, -300, win(t, T.better - 0.6, null), 26, { weight: 800 });
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '2003 · ERIC ANDERSON & DUNCAN SIMESTER', x, -660, win(t, T.but1 - 0.2, null), 20);
  MM.typeText(g, 'ERIC ANDERSON', x - 330, -560, clamp((t - T.anderson + 0.4) / 0.8), 1, 34);
  MM.typeText(g, 'DUNCAN SIMESTER', x + 330, -560, clamp((t - T.simester + 0.4) / 0.8), 1, 34);
  // open catalog
  const ck = p(t, T.but1 + 0.3, 0.6);
  MM.rr(g, x - 420, -460, 400, 400, 18); MM.stroke(g, ck, 3); g.stroke();
  MM.rr(g, x + 20, -460, 400, 400, 18); MM.stroke(g, ck, 3); g.stroke();
  dress(g, x - 220, -120, 1.2, p(t, T.but1 + 0.8, 0.4), false);
  for (let i = 0; i < 4; i++) { MM.rr(g, x + 60, -420 + i * 90, 320, 50, 10); MM.stroke(g, p(t, T.tested - 0.4 + i * 0.12, 0.3) * 0.7, 2); g.stroke(); }
  MM.label(g, "WOMEN'S CLOTHING CATALOG", x, -20, p(t, T.catalog - 0.5, 0.4), 18, { weight: 800 });
  MM.pill(g, 'REAL PRICE TEST', x + 220, -110, win(t, T.tested - 0.2, null), 18, true);
}
const PRICES = [['$34', 'p34a', 0.75], ['$39', 'p39a', 1.0], ['$44', 'p44', 0.75]];
function zoneD(g, t) {
  const x = D;
  MM.label(g, 'THE SAME DRESS · THREE PRICES', x, -680, p(t, T.dress - 0.3, 0.4), 20);
  PRICES.forEach(([pr, key], i) => {
    const cx = x - 440 + i * 440;
    const hot = i === 1 ? p(t, T.sold - 0.3, 0.4) : 0;
    MM.build(g, t, T.dress - 0.2 + i * 0.25, cx, -260, 140, (g2, a) => dress(g2, cx, -150, 1.2, a, hot > 0.5));
    MM.build(g, t, T[key] - 0.3, cx + 130, -420, 80, (g2, a) => MM.tag(g2, cx + 130, -530, a, 0.08 * Math.sin(t * 2 + i), pr, 1.5));
    MM.label(g, 'CATALOG ' + 'ABC'[i], cx, -30, p(t, T.dress + i * 0.25, 0.4), 16, { weight: 800 });
  });
}
function zoneE(g, t) {
  const x = E2;
  MM.label(g, 'UNITS SOLD', x, -680, p(t, T.p39b - 0.4, 0.4), 20);
  PRICES.forEach(([pr, , v], i) => {
    const bx = x - 400 + i * 400, a = p(t, T.p39b - 0.4 + i * 0.1, 0.4);
    const h = 420 * v * out(clamp((t - T.p39b + 0.2 - (i === 1 ? 0.4 : 0)) / 1.2));
    MM.rr(g, bx - 100, -100 - h, 200, h, 16);
    if (i === 1) { MM.fill(g, a); g.fill(); MM.halo(g, bx, -100 - h, 120, a * 0.5); } else { MM.stroke(g, a, 3); g.stroke(); }
    MM.big(g, pr, bx, -40, a, 44);
  });
  MM.pill(g, 'SOLD THE MOST', x, -620, win(t, T.sold - 0.2, null), 22, true);
  const ck = p(t, T.d5 - 0.4, 0.4);
  MM.label(g, '+$5 PRICE', x - 200, -560, ck, 22, { weight: 800 });
  MM.label(g, '→  MORE SALES', x + 160, -560, p(t, T.d5 + 0.2, 0.4), 22, { weight: 800 });
}
function zoneF(g, t) {
  const x = F;
  MM.label(g, 'THE LEFT-DIGIT EFFECT', x, -680, p(t, T.ending1 - 0.3, 0.4), 22, { weight: 800 });
  const fk = p(t, T.digit - 0.6, 0.6);
  // $39.99 where only the first digit is read
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '800 220px Inter';
  const parts = ['$', '3', '9', '.99'], xs = [-330, -170, 0, 220];
  parts.forEach((s, i) => { const a = p(t, T.ending1 - 0.3, 0.4) * (i === 1 ? 1 : 1 - 0.75 * fk); g.fillStyle = `rgba(255,255,255,${a})`; g.font = (i === 3 ? '800 120px' : '800 220px') + ' Inter'; g.fillText(s, x + xs[i], -360 - (i === 3 ? 40 : 0)); });
  g.restore();
  MM.halo(g, x - 170, -360, 160, fk * 0.6);
  MM.pill(g, 'FEELS LIKE A DEAL', x + 330, -150, win(t, T.deal1 - 0.4, null), 20, true);
  MM.label(g, 'YOUR BRAIN READS "3…" AND MOVES ON', x - 120, -150, p(t, T.brain - 0.3, 0.4), 18, { weight: 800 });
  MM.path(g, [[x - 170, -230], [x - 170, -190]], fk, 1, 3, true);
}
function zoneG(g, t) {
  const x = G;
  MM.build(g, t, T.course - 0.3, x - 250, -300, 140, (g2, a) => MM.tag(g2, x - 250, -470, a, 0.08 * Math.sin(t * 2), 'SALE', 2.2));
  MM.build(g, t, T.real - 0.6, x + 260, -300, 130, (g2, a) => MM.shield(g2, x + 260, -300, 1.3, a, true));
  MM.pill(g, 'SOMETIMES THE DEAL IS REAL ✓', x, -80, win(t, T.course, null), 22);
}
function roller(g, x, y, from, to, k, a) {
  // rolling number: old value slides up, new slides in from below
  const e = inOut(clamp(k));
  g.save(); g.beginPath(); g.rect(x - 300, y - 90, 600, 180); g.clip();
  MM.big(g, from, x, y - 160 * e, a * (1 - e), 120);
  MM.big(g, to, x, y + 160 * (1 - e), a * e, 120);
  g.restore();
}
function zoneH(g, t) {
  const x = H;
  MM.pill(g, 'PRICE ENDS IN 9? ROUND IT UP', x, -680, win(t, T.but2 - 0.2, null), 22, true);
  const a1 = p(t, T.but2, 0.4), a2 = p(t, T.round, 0.4);
  MM.rr(g, x - 560, -560, 500, 300, 28); MM.stroke(g, a1, 3); g.stroke();
  MM.rr(g, x + 60, -560, 500, 300, 28); MM.stroke(g, a2, 3); g.stroke();
  roller(g, x - 310, -410, '$39', '$40', (t - T.n39 - 0.2) / 0.6, a1);
  roller(g, x + 310, -410, '$9.99', '$10', (t - T.n999 - 0.4) / 0.6, a2);
  MM.label(g, 'IN YOUR HEAD', x, -180, p(t, T.round - 0.2, 0.4), 22, { weight: 800 });
  MM.label(g, 'THE REAL PRICE', x, -120, p(t, T.n40, 0.4), 16);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
