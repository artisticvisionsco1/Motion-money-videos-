// 15 — The 50/30/20 budget
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  fail1: w('fail', 1), complicated1: w('complicated', 1), most2: w('most', 2), coffee: w('coffee'), week: w('week'), give: w('give'),
  but1: w('but', 1), simpler: w('simpler'), warren: w('warren'), daughter: w('daughter'), worth: w('worth'),
  p50: w('50%'), needs1: w('needs', 1), rent: w('rent'), food: w('food'), bills: w('bills'), p30: w('30%'), wants1: w('wants', 1), p20: w('20%'), savings: w('savings'), debt: w('debt'),
  k4: w('$4,000'), k2: w('$2,000'), k12: w('$1,200'), d800: w('$800'), future: w('future'),
  course: w('course'), split: w('split'), but2: w('but', 2), decide: w('decide'), leaves: w('leaves'), because2: w('because', 2), sticky: w('sticky'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000;
const OPEN = { x: 0, y: -280, z: 1.25 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most2 - 0.4, B, -280, 1.35), F_(T.but1 - 0.4, C, -280, 1.4), F_(T.p50 - 0.5, D, -280, 1.1),
  F_(T.k4 - 0.6, E2, -280, 1.15), F_(T.course - 0.4, F, -280, 1.15),
  F_(T.because2 - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

function zoneA(g, t) {
  const x = A, end = t > T.because2 - 0.5;
  if (!end) {
    // a giant, messy spreadsheet
    for (let r = 0; r < 9; r++) for (let c = 0; c < 14; c++) {
      const a = p(t, -0.3 + (r + c) * 0.02, 0.3), jit = p(t, T.complicated1 - 0.4, 0.6) * Math.sin(r * 7 + c * 3 + t * 6) * 6;
      MM.stroke(g, a * (0.35 + ((r * c) % 3) * 0.2), 1.5); g.strokeRect(x - 560 + c * 80 + jit, -560 + r * 54 - jit, 76, 50);
      if ((r * 13 + c * 7) % 5 === 0) MM.label(g, '$' + ((r * 37 + c * 11) % 90 + 3), x - 522 + c * 80 + jit, -535 + r * 54 - jit, a * 0.8, 12, { track: 0 });
    }
    MM.pill(g, 'TOO COMPLICATED', x, -20, win(t, T.complicated1 - 0.4, null), 24, true);
    MM.label(g, 'MOST BUDGETS FAIL', x, -630, win(t, T.fail1 - 0.4, null), 22);
  } else {
    MM.build(g, t, T.because2 - 0.3, x, -290, 260, (g2, a) => MM.sticky(g2, x, -290, 1.25, a, ['50  NEEDS', '30  WANTS', '20  FUTURE']), 0.9);
    MM.label(g, 'FITS ON A STICKY NOTE', x, 0, win(t, T.sticky - 0.6, null), 24);
  }
}
function zoneB(g, t) {
  const x = B;
  const n = Math.min(11, Math.floor(Math.max(0, t - T.most2 + 0.2) * 3.2));
  const fallK = p(t, T.give - 0.1, 0.8);
  g.save(); g.translate(x - 150, -300 + fallK * 300); g.rotate(fallK * 0.5);
  MM.receipt(g, 0, 0, 1.6, 1 - 0.7 * fallK, Array.from({ length: Math.min(6, n) }, (_, i) => ['COFFEE', '$4.50']), MM.money(4.5 * n));
  g.restore();
  MM.big(g, 'DAY ' + Math.min(7, 1 + Math.floor(Math.max(0, t - T.most2) * 1.4)), x + 330, -380, p(t, T.coffee - 0.5, 0.4) * (1 - fallK), 64);
  MM.label(g, 'TRACKING EVERY COFFEE', x + 330, -300, p(t, T.coffee - 0.3, 0.4), 18);
  MM.pill(g, 'GIVE UP', x + 330, -170, win(t, T.give, null), 24, true);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, 'A SIMPLER RULE', x, -620, win(t, T.but1 + 0.1, null), 22, true);
  MM.build(g, t, T.but1 + 0.2, x - 260, -300, 120, (g2, a) => MM.book(g2, x - 260, -300, 2.0, a));
  MM.label(g, 'ALL YOUR WORTH', x - 260, -130, p(t, T.worth - 0.5, 0.4), 22, { weight: 800 });
  MM.label(g, 'ELIZABETH WARREN', x + 270, -360, p(t, T.warren - 0.2, 0.4), 22, { weight: 800 });
  MM.label(g, '& AMELIA WARREN TYAGI', x + 270, -310, p(t, T.daughter - 0.2, 0.4), 18);
  MM.label(g, '2005', x + 270, -250, p(t, T.daughter + 0.3, 0.4), 18);
}
function zoneD(g, t) {
  const x = D;
  const segs = [{ f: 0.5, label: '50%' }, { f: 0.3, label: '30%' }, { f: 0.2, label: '20%' }];
  const prog = t < T.p30 ? clamp((t - T.p50 + 0.3) / 0.9) / 3 : t < T.p20 ? 1 / 3 + clamp((t - T.p30 + 0.3) / 0.9) / 3 : 2 / 3 + clamp((t - T.p20 + 0.3) / 0.9) / 3;
  MM.donut(g, x - 330, -300, 250, segs, prog, 1);
  const rows = [['NEEDS', 'RENT · FOOD · BILLS', T.p50, T.rent], ['WANTS', 'FUN · EXTRAS', T.p30, T.wants1], ['SAVE', 'SAVINGS · DEBT', T.p20, T.savings]];
  rows.forEach(([h, sub, t1, t2], i) => {
    const y = -440 + i * 140, a = p(t, t1 - 0.1, 0.4);
    MM.fill(g, a * [0.95, 0.5, 0.22][i]); g.fillRect(x + 80, y - 22, 44, 44);
    MM.label(g, h, x + 260, y - 8, a, 26, { weight: 800, align: 'left' });
    MM.label(g, sub, x + 150, y + 30, p(t, t2 - 0.2, 0.4), 14, { align: 'left' });
  });
  MM.label(g, 'OF AFTER-TAX INCOME', x - 330, 30, p(t, T.p50 + 0.6, 0.4), 18);
}
function zoneE(g, t) {
  const x = E2;
  MM.big(g, MM.money(4000 * out(clamp((t - T.k4 + 0.3) / 0.8))) + ' / MONTH', x, -640, p(t, T.k4 - 0.4, 0.4), 60);
  const cols = [[x - 400, 2000, 'NEEDS', T.k2, 0.95], [x, 1200, 'WANTS', T.k12, 0.5], [x + 400, 800, 'FUTURE', T.d800, 0.22]];
  cols.forEach(([cx, v, lbl, ts, sh]) => {
    const k = out(clamp((t - ts + 0.4) / 0.8)), h = 440 * v / 2000 * k;
    const oa = p(t, T.k4 - 0.1, 0.5); MM.rr(g, cx - 100, -40 - 440 * v / 2000, 200, 440 * v / 2000, 16); MM.stroke(g, oa * 0.45, 2); g.setLineDash([10, 8]); g.stroke(); g.setLineDash([]);
    MM.rr(g, cx - 100, -40 - h, 200, h, 16); MM.fill(g, sh + 0.05); g.fill(); MM.stroke(g, k, 3); g.stroke();
    MM.big(g, MM.money(v * k), cx, -80 - h, p(t, ts - 0.3, 0.4), 44);
    MM.label(g, lbl, cx, 10, p(t, ts - 0.3, 0.4), 20, { weight: 800 });
  });
  MM.ripple(g, x + 400, -150, t, T.future, 60, 300, 0.9);
}
function zoneF(g, t) {
  const x = F;
  const wob = p(t, T.split - 0.3, 0.6) * (1 - p(t, T.but2, 0.6));
  const segs = [{ f: 0.5 + 0.08 * Math.sin(t * 3) * wob, label: '' }, { f: 0.3 - 0.05 * Math.sin(t * 3) * wob, label: '' }, { f: 0.2 - 0.03 * Math.sin(t * 3) * wob, label: '' }];
  MM.donut(g, x - 400, -300, 200, segs, p(t, T.course - 0.3, 0.6), 1);
  MM.label(g, 'YOUR SPLIT CAN CHANGE', x - 400, -40, win(t, T.split - 0.3, null), 18);
  // decide before it leaves: coins split into 3 jars
  const dk = clamp((t - T.decide + 0.2) / 1.8);
  [[x + 120, 0.5], [x + 360, 0.3], [x + 600, 0.2]].forEach(([jx, f], i) => MM.jar(g, jx, 0, 0.9, p(t, T.but2 + i * 0.1, 0.4), dk * f * 1.4));
  for (let i = 0; i < 10; i++) { const k = clamp(dk * 1.5 - i * 0.05); if (k <= 0 || k >= 1) continue; const jx = [x + 120, x + 120, x + 120, x + 120, x + 120, x + 360, x + 360, x + 360, x + 600, x + 600][i]; MM.coin(g, lerp(x + 360, jx, k), lerp(-560, -150, k * k), 14, 1); }
  MM.pill(g, 'DECIDE BEFORE IT LEAVES', x + 360, -520, win(t, T.decide - 0.2, null), 22, true);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
