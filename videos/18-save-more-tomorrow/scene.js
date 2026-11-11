// 18 — Save More Tomorrow (Thaler & Benartzi, 2004)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  promise1: w('promise', 1), later1: w('later', 1), most: w('most'), tight: w('tight'), y2004: w('2004'), benarzi: w('benarzi'), tomorrow: w('tomorrow'),
  workers: w('workers'), today1: w('today', 1), instead: w('instead'), future1: w('future', 1), automatically: w('automatically'), results: w('results'),
  company: w('company'), p35: w('3.5%'), p14: w('14%'), years: w('years'), nobody: w('nobody'), paycheck: w('paycheck'), extra: w('extra'),
  this1: w('this'), willpower: w('willpower'), future2: w('future', 2), commit: w('commit'), course: w('course'), automatic: w('automatic'), cancel: w('cancel'),
  so: w('so'), decide: w('decide'), next: w('next'), reaches: w('reaches'), because: w('because', 2), system: w('system'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -280, z: 1.25 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -260, 1.4), F_(T.y2004 - 0.5, C, -280, 1.35), F_(T.workers - 0.4, D, -290, 1.1),
  F_(T.results - 0.5, E2, -290, 1.1), F_(T.this1 - 0.4, F, -270, 1.25), F_(T.course - 0.4, G, -260, 1.35),
  F_(T.so - 0.4, H, -280, 1.2), F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  const cards = [['TODAY', x - 340], ['LATER', x + 340]];
  cards.forEach(([lbl, cx], i) => MM.build(g, t, -0.3 + i * 0.4, cx, -300, 150, (g2, a) => { MM.rr(g2, cx - 160, -480, 320, 360, 22); MM.fill(g2, a * (i === 1 ? 0.15 + 0.6 * p(t, T.later1 - 0.2, 0.5) : 0.04)); g2.fill(); MM.stroke(g2, a, 3); g2.stroke(); MM.label(g2, lbl, cx, -440, a, 22, { weight: 800, v: i === 1 && t > T.later1 ? 0 : 255 }); }));
  MM.label(g, 'SAVE MORE', x - 340, -300, p(t, 0.3, 0.4), 28, { weight: 800 });
  MM.label(g, '✗  TOO HARD', x - 340, -220, p(t, 1.2, 0.4), 18);
  MM.label(g, 'PROMISE', x + 340, -300, p(t, T.promise1 - 0.2, 0.4), 28, { weight: 800, v: t > T.later1 ? 0 : 255 });
  MM.path(g, [[x - 160, -300], [x + 170, -300]], p(t, T.promise1, 0.6), 1, 3, true);
  if (end) MM.label(g, 'LET THE SYSTEM KEEP IT', x, 0, win(t, T.system - 0.6, null), 24);
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 250, 0, 1.2, p(t, T.most - 0.1, 0.4), true);
  MM.build(g, t, T.most + 0.3, x + 220, -220, 120, (g2, a) => { const sq = 1 - 0.25 * p(t, T.tight - 0.4, 0.5); g2.save(); g2.translate(x + 220, -220); g2.scale(1, sq); MM.rr(g2, -150, -90, 300, 180, 26); MM.stroke(g2, a, 3); g2.stroke(); MM.coin(g2, 0, 0, 30, a); g2.restore(); });
  MM.pill(g, 'TOO TIGHT TODAY', x + 220, -400, win(t, T.tight - 0.4, null), 20, true);
  MM.label(g, 'I SHOULD SAVE MORE…', x - 250, -310, win(t, T.most + 0.2, null), 18);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '2004 · RICHARD THALER & SHLOMO BENARTZI', x, -640, win(t, T.y2004 - 0.2, null), 20);
  MM.build(g, t, T.y2004 - 0.4, x, -380, 300, (g2, a) => { MM.big(g2, 'SAVE MORE', x, -420, a, 92); MM.big(g2, 'TOMORROW', x, -320, a, 92); }, 0.9);
  MM.ripple(g, x, -370, t, T.tomorrow, 120, 700, 1.1);
  MM.typeText(g, 'RICHARD THALER', x - 330, -170, clamp((t - T.y2004 - 1.6) / 0.8), 1, 34);
  MM.typeText(g, 'SHLOMO BENARTZI', x + 330, -170, clamp((t - T.benarzi + 0.3) / 0.8), 1, 34);
  MM.label(g, 'ECONOMISTS · A SIMPLE IDEA', x, -80, p(t, T.y2004 + 1.2, 0.4), 18);
}
function zoneD(g, t) {
  const x = D;
  // salary staircase: each raise splits, part goes to savings
  const steps = 4, sw = 280, sh = 110;
  const sk = p(t, T.workers - 0.2, 1.0);
  const pts = [[x - 650, 0]];
  for (let i = 0; i < steps; i++) { pts.push([x - 650 + i * sw, -i * sh - 60]); pts.push([x - 650 + (i + 1) * sw, -i * sh - 60]); }
  MM.path(g, pts, sk, 1, 5, true);
  MM.label(g, 'PAY', x - 690, -40, sk, 16);
  { const cl = clamp((t - T.workers) / (T.automatically - T.workers + 0.5)) * (steps - 0.5), si = Math.floor(cl);
    MM.person(g, x - 650 + cl * sw + 40, -si * sh - 60, 0.8, p(t, T.workers - 0.3, 0.4), true); }
  MM.label(g, 'SAVINGS TODAY: +0%', x - 400, -480, win(t, T.today1 - 0.6, T.future1), 22, { weight: 800 });
  MM.label(g, 'NOT TODAY', x - 520, 40, win(t, T.today1 - 0.3, T.instead + 0.5), 18);
  for (let i = 1; i < steps; i++) {
    const ts = T.instead - 0.2 + i * 0.8, k = p(t, ts, 0.6);
    const sx = x - 650 + i * sw + 40, sy = -i * sh - 60;
    MM.path(g, [[sx, sy], [sx, sy - 160], [sx + 120, sy - 160]], k, 0.8, 3, true);
    MM.coin(g, sx + 150, sy - 160, 20, k);
    MM.label(g, 'RAISE', sx + 80, sy + 30, k, 14);
  }
  MM.jar(g, x + 520, -10, 1.1, p(t, T.workers, 0.5), clamp((t - T.automatically + 0.5) / 2.0) * 0.7);
  MM.pill(g, 'PART OF EVERY RAISE → SAVINGS', x, -600, win(t, T.future1 - 0.2, null), 20, true);
  MM.label(g, 'AUTOMATICALLY', x + 520, 40, p(t, T.automatically - 0.2, 0.4), 18, { weight: 800 });
}
function zoneE(g, t) {
  const x = E2;
  MM.label(g, 'SAVINGS RATE · ONE COMPANY', x, -700, p(t, T.results - 0.2, 0.4), 20);
  const X = yr => x - 560 + yr / 4 * 1100, Y = v => -60 - v / 15 * 560;
  const ak = p(t, T.results - 0.2, 0.6);
  MM.path(g, [[X(0), Y(15)], [X(0), -60], [X(4), -60]], ak, 0.7, 2.5, false);
  for (let yr = 0; yr <= 4; yr++) MM.label(g, yr + ' YR', X(yr), -25, ak, 14);
  const vals = [3.5, 6.5, 9.4, 11.6, 13.6];
  const gk = inOut(clamp((t - T.results + 0.2) / (T.p14 - T.results + 0.4)));
  const n = gk * 4, pts = [];
  for (let i = 0; i <= Math.floor(n); i++) pts.push([X(i), Y(vals[i])]);
  if (n % 1 > 0 && n < 4) { const i = Math.floor(n), f = n - i; pts.push([X(i + f), Y(lerp(vals[i], vals[i + 1], f))]); }
  if (pts.length > 1) MM.path(g, pts, 1, 1, 5, gk < 1);
  const cur = pts.length ? lerp(3.5, 13.6, gk) : 3.5;
  MM.big(g, cur.toFixed(1) + '%', X(Math.min(4, n)) - (gk > 0.8 ? 110 : 0), Y(cur) - 60, p(t, T.results - 0.3, 0.4), 56);
  MM.build(g, t, T.company - 0.4, x - 450, -530, 110, (g2, a) => MM.building(g2, x - 450, -430, 140, 200, a, 0.3));
  MM.label(g, 'ONE COMPANY', x - 450, -400, p(t, T.company, 0.4), 16, { weight: 800 });
  MM.pill(g, '3.5% → 13.6%', x - 200, -520, win(t, T.p14 - 0.2, null), 24, true);
}
function zoneF(g, t) {
  const x = F;
  MM.label(g, 'NOBODY FELT POORER', x - 340, -620, win(t, T.nobody - 0.2, null), 22);
  // paycheck line never goes down
  const X = i => x - 640 + i * 110, pk = p(t, T.nobody - 0.4, 1.2);
  const pts = []; for (let i = 0; i <= 6; i++) pts.push([X(i), -200 - Math.floor(i / 2) * 50]);
  MM.path(g, pts, pk, 1, 4, true);
  MM.label(g, 'TAKE-HOME PAY', X(3), -60, pk, 16);
  MM.pill(g, 'NEVER WENT DOWN', X(3), -420, win(t, T.down - 0.4 || T.paycheck, null), 18);
  // willpower vs system
  MM.build(g, t, T.willpower - 0.3, x + 260, -200, 100, (g2, a) => { MM.person(g2, x + 260, -40, 0.9, a, false); MM.label(g2, 'WILLPOWER  ✗', x + 260, 10, a, 18, { weight: 800 }); });
  MM.build(g, t, T.future2 - 0.2, x + 560, -200, 100, (g2, a) => { MM.toggle(g2, x + 560, -170, 1.1, a, p(t, T.commit - 0.3, 0.4)); MM.label(g2, 'FUTURE YOU  ✓', x + 560, 10, a, 18, { weight: 800 }); });
}
function zoneG(g, t) {
  const x = G;
  MM.build(g, t, T.course - 0.2, x - 200, -260, 140, (g2, a) => MM.toggle(g2, x - 200, -260, 2.2, a, 1));
  MM.label(g, 'AUTO-ESCALATE', x - 200, -120, p(t, T.automatic - 0.4, 0.4), 22, { weight: 800 });
  MM.build(g, t, T.cancel - 0.3, x + 330, -260, 120, (g2, a) => { MM.rr(g2, x + 190, -320, 280, 110, 20); MM.stroke(g2, a, 3); g2.stroke(); MM.label(g2, 'CANCEL', x + 330, -265, a, 26, { weight: 800 }); MM.stroke(g2, a, 6); g2.beginPath(); g2.moveTo(x + 200, -330); g2.lineTo(x + 460, -200); g2.stroke(); });
  MM.label(g, "DON'T CANCEL IT", x + 330, -120, win(t, T.cancel, null), 20);
}
function zoneH(g, t) {
  const x = H;
  MM.label(g, 'YOUR NEXT RAISE', x, -660, p(t, T.so, 0.4), 22);
  const ak = p(t, T.so + 0.1, 0.5);
  MM.rr(g, x - 520, -500, 1040, 60, 30); MM.stroke(g, ak, 3); g.stroke();
  const share = 0.5 * out(clamp((t - T.decide + 0.2) / 1.0));
  MM.rr(g, x - 514, -494, 1028 * Math.max(0.01, share), 48, 24); MM.fill(g, ak); g.fill();
  MM.big(g, Math.round(share * 100) + '% → SAVINGS', x, -360, p(t, T.decide, 0.4), 52);
  MM.build(g, t, T.next + 0.4, x - 260, -140, 90, (g2, a) => MM.coin(g2, x - 260, -140, 40, a));
  MM.path(g, [[x - 200, -140], [x + 200, -140]], p(t, T.reaches - 1.6, 0.8), 1, 3, true);
  MM.jar(g, x + 300, -40, 1.0, p(t, T.next + 0.6, 0.4), clamp((t - T.reaches + 1.0) / 1.5) * 0.6);
  MM.label(g, 'BEFORE IT REACHES YOU', x, 40, win(t, T.reaches - 0.6, null), 20);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
