// 26 — The rule of 72 (Luca Pacioli, 1494)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  doubles1: w('doubles', 1), most: w('most'), badly: w('badly'), but1: w('but', 1), y1494: w('1494'), pacioli: w('pacioli'), today: w('today'),
  rule: w('rule'), r72a: w('72', 1), divide: w('divide'), rate1: w('rate', 1), double1: w('double', 1), p8: w('8%'), n9: w('9'), p2: w('2%'),
  n36: w('36'), credit: w('credit'), p24: w('24%'), debt1: w('debt', 1), n3: w('3'), course: w('course'), estimate: w('estimate'),
  but2: w('but', 2), save: w('save'), numbers: w('numbers'), divided: w('divided'), because: w('because'), works: w('works'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -290, 1.4), F_(T.but1 - 0.4, C, -300, 1.25), { t: T.today - 0.4, d: 1.2, x: C, y: -300, z: 1.25 },
  F_(T.divide - 0.4, D, -300, 1.25), F_(T.p8 - 0.5, E2, -300, 1.15), F_(T.credit - 0.4, F, -300, 1.25),
  F_(T.course - 0.4, G, -290, 1.3), F_(T.but2 - 0.4, H, -300, 1.2),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
// money doubling path: x0..x1 over yrs years, from v0 at rate r
function growth(g, x0, y0, wpx, hpx, yrs, r, k, a, maxV, dashed = false) {
  const pts = [], n = 60;
  for (let i = 0; i <= Math.floor(n * k); i++) { const yr = yrs * i / n; pts.push([x0 + wpx * i / n, y0 - hpx * (Math.pow(1 + r, yr) - 1) / (maxV - 1)]); }
  if (dashed) g.setLineDash([12, 8]);
  if (pts.length > 1) MM.path(g, pts, 1, a, 5, k < 1);
  g.setLineDash([]);
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  // coins doubling: 1 -> 2 -> 4 -> 8
  const stage = end ? 3 : Math.min(3, Math.floor(clamp((t + 0.2) / 0.8)));
  const n = Math.pow(2, stage);
  for (let i = 0; i < n; i++) {
    const c = i % 4, r = Math.floor(i / 4);
    MM.build(g, t, -0.4 + Math.floor(Math.log2(i + 1)) * 0.8, x - 560 + c * 135, -390 + r * 135, 50, (g2, a) => MM.coin(g2, x - 560 + c * 135, -390 + r * 135, 54, a));
  }
  MM.label(g, '× 2  × 2  × 2', x - 360, -170, p(t, 0.6, 0.4), 22, { weight: 800 });
  MM.big(g, 'HOW FAST', x + 330, -420, p(t, 0.2, 0.4), 64);
  MM.big(g, 'DOES IT DOUBLE?', x + 330, -340, p(t, T.doubles1 - 0.6, 0.4), 48);
  MM.build(g, t, T.doubles1 - 0.2, x + 330, -190, 80, (g2, a) => MM.clock(g2, x + 330, -190, 60, a * (end ? 1 - p(t, T.works - 0.8, 0.4) : 1), t, 2, false));
  if (end) {
    MM.build(g, t, T.works - 0.6, x + 330, -190, 120, (g2, a) => MM.ccard(g2, x + 330, -190, 0.6, a, true));
    MM.pill(g, 'WORKS ON DEBT TOO', x, -40, win(t, T.works - 0.4, null), 22, true);
  }
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 420, 0, 1.3, p(t, T.most - 0.3, 0.4), true);
  ['5 YEARS?', '20 YEARS?', '50 YEARS?'].forEach((s, i) => {
    MM.build(g, t, T.most + 0.1 + i * 0.3, x - 40 + i * 260, -330, 80, (g2, a) => { MM.rr(g2, x - 150 + i * 260, -390, 220, 120, 18); MM.stroke(g2, a, 3); g2.stroke(); MM.label(g2, s, x - 40 + i * 260, -330, a, 22, { weight: 800 }); });
  });
  MM.big(g, 'MOST PEOPLE GUESS', x + 220, -560, p(t, T.most, 0.4), 48);
  MM.pill(g, 'AND GUESS BADLY ✗', x + 220, -180, win(t, T.badly - 0.4, null), 22, true);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '1494 · LUCA PACIOLI · ITALIAN MATHEMATICIAN', x, -660, win(t, T.but1 - 0.2, null), 20);
  MM.build(g, t, T.but1 + 0.2, x - 330, -340, 140, (g2, a) => MM.book(g2, x - 330, -340, 1.8, a));
  MM.label(g, 'SUMMA DE ARITHMETICA', x - 330, -170, p(t, T.y1494 + 0.4, 0.4), 16, { weight: 800 });
  MM.typeText(g, 'LUCA PACIOLI', x + 300, -500, clamp((t - T.pacioli + 0.4) / 0.8), 1, 40);
  MM.label(g, 'A SHORTCUT STILL USED TODAY', x + 300, -440, p(t, T.today - 0.6, 0.4), 18);
  MM.build(g, t, T.rule - 0.4, x + 300, -300, 240, (g2, a) => MM.big(g2, 'RULE OF 72', x + 300, -300, a, 88), 0.8);
  MM.ripple(g, x + 300, -300, t, T.r72a, 80, 380, 0.9);
}
function zoneD(g, t) {
  const x = D;
  MM.label(g, 'THE WHOLE RULE', x, -660, p(t, T.divide - 0.3, 0.4), 20);
  const box = (bx, txt, ts, hot) => { const a = p(t, ts, 0.4); MM.rr(g, bx - 170, -430, 340, 180, 24); MM.fill(g, a * (hot ? 0.9 : 0.05)); g.fill(); MM.stroke(g, a, 3); g.stroke(); MM.big(g, txt, bx, -340, a * (hot ? 0 : 1), 64); if (hot) MM.label(g, txt, bx, -340, a, 44, { weight: 800, v: 0 }); };
  box(x - 470, '72', T.divide - 0.3, false);
  MM.big(g, '÷', x - 235, -340, p(t, T.divide, 0.4), 80);
  box(x, 'RATE %', T.rate1 - 0.5, false);
  MM.big(g, '=', x + 235, -340, p(t, T.rate1, 0.4), 80);
  box(x + 470, 'YEARS', T.double1 - 0.6, true);
  MM.label(g, 'YEARLY RATE', x, -200, p(t, T.rate1 - 0.3, 0.4), 16, { weight: 800 });
  MM.label(g, 'TO DOUBLE', x + 470, -200, p(t, T.double1 - 0.4, 0.4), 16, { weight: 800 });
}
function zoneE(g, t) {
  const x = E2;
  const X0 = x - 640, W0 = 1000, Y0 = -100, H0 = 480;
  const ak = p(t, T.p8 - 0.4, 0.5);
  MM.path(g, [[X0, Y0 - H0 - 30], [X0, Y0], [X0 + W0 + 30, Y0]], ak, 0.6, 2.5, false);
  for (const yr of [0, 9, 18, 27, 36]) MM.label(g, yr + ' YR', X0 + W0 * yr / 36, Y0 + 30, ak, 13);
  MM.label(g, '$1,000 → $2,000', X0 - 10, Y0 - H0 - 60, ak, 16, { align: 'left', weight: 800 });
  // 8%: doubles at year 9
  const k8 = clamp((t - T.p8) / 2.2);
  growth(g, X0, Y0, W0 * 9 / 36 * 1.0, H0, 9, 0.08, k8, 1, 2);
  MM.big(g, '72 ÷ 8 = 9 YRS', x + 400, -560, p(t, T.p8 - 0.2, 0.4), 52);
  MM.coin(g, X0 + W0 * 9 / 36, Y0 - H0, 18, p(t, T.n9, 0.3)); MM.ripple(g, X0 + W0 * 9 / 36, Y0 - H0, t, T.n9, 20, 160, 0.8);
  // 2%: doubles at year 36
  const k2 = clamp((t - T.p2) / 2.0);
  growth(g, X0, Y0, W0, H0, 36, 0.02, k2, 0.8, 2, true);
  MM.big(g, '72 ÷ 2 = 36 YRS', x + 400, -470, p(t, T.p2 - 0.2, 0.4), 52);
  MM.label(g, '8%', X0 + W0 * 9 / 36 + 50, Y0 - H0 + 10, p(t, T.n9, 0.4), 18, { weight: 800 });
  MM.label(g, '2%', X0 + W0 - 40, Y0 - H0 + 50, p(t, T.n36, 0.4), 18, { weight: 800 });
}
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.credit - 0.3, x - 360, -330, 150, (g2, a) => MM.ccard(g2, x - 360, -330, 1.2, a, true, '24% APR'));
  MM.big(g, '72 ÷ 24 = 3 YRS', x + 300, -500, p(t, T.p24 - 0.3, 0.4), 60);
  const dk = out(clamp((t - T.debt1 + 0.2) / (T.n3 - T.debt1 + 0.4)));
  MM.big(g, MM.money(5000 + 5000 * dk), x + 300, -340, p(t, T.debt1 - 0.4, 0.4), 80);
  MM.label(g, 'DEBT', x + 300, -260, p(t, T.debt1 - 0.4, 0.4), 18, { weight: 800 });
  MM.pill(g, 'DOUBLED IN JUST 3 YEARS', x + 300, -170, win(t, T.n3 - 0.2, null), 22, true);
  MM.label(g, 'IF YOU PAY NOTHING', x - 360, -150, p(t, T.debt1, 0.4), 16);
}
function zoneG(g, t) {
  const x = G;
  MM.pill(g, 'AN ESTIMATE, NOT EXACT', x, -640, win(t, T.course - 0.2, null), 22);
  const rows = [['RATE', 'RULE OF 72', 'EXACT'], ['8%', '9.0 YRS', '9.0 YRS'], ['2%', '36 YRS', '35 YRS'], ['24%', '3.0 YRS', '3.2 YRS']];
  rows.forEach((r, i) => {
    const a = p(t, T.course - 0.2 + i * 0.25, 0.4), y = -520 + i * 110;
    if (i) { MM.rr(g, x - 480, y - 42, 960, 84, 16); MM.stroke(g, a * 0.6, 2); g.stroke(); }
    r.forEach((c, j) => MM.label(g, c, x - 320 + j * 320, y, a, i ? 24 : 16, { weight: 800 }));
  });
  MM.label(g, 'CLOSE ENOUGH TO DECIDE', x, -60, p(t, T.estimate, 0.4), 18);
}
function zoneH(g, t) {
  const x = H;
  MM.pill(g, 'BEFORE YOU SAVE · INVEST · BORROW', x, -660, win(t, T.but2 - 0.2, null), 22, true);
  ['SAVE', 'INVEST', 'BORROW'].forEach((s, i) => {
    const a = p(t, T.save - 0.3 + i * 0.35, 0.4);
    MM.card(g, x - 400 + i * 400, -470, a, { w: 280, h: 110, title: s, hot: i === 2 ? 0.0 : 0 });
  });
  // live calculator cycling rates
  const rates = [4, 6, 10, 12];
  const ri = Math.floor(clamp((t - T.numbers) / 3.2) * 3.99), rt = rates[ri];
  const ck = p(t, T.numbers - 0.3, 0.4);
  MM.rr(g, x - 420, -320, 840, 180, 26); MM.fill(g, 0.05 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke();
  MM.big(g, '72 ÷ ' + rt + '% = ' + (72 / rt).toFixed(1) + ' YRS', x, -230, ck, 64);
  MM.label(g, 'RUN THE NUMBERS', x, -80, p(t, T.divided - 0.3, 0.4), 20, { weight: 800 });
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
