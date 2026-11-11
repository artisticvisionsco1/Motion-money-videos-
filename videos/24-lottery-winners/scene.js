// 24 — Hedonic adaptation: lottery winners (Brickman, Coates & Janoff-Bulman, 1978)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  happy1: w('happy', 1), fades1: w('fades', 1), most: w('most'), money1: w('money', 1), house: w('house'), car: w('car'), good: w('good'),
  but1: w('but', 1), y1978: w('1978'), brickman: w('brickman'), coates: w('coates'), ronnie: w('ronnie'), lottery: w('lottery'), prizes: w('prizes'),
  months2: w('months', 2), winners: w('winners'), happier: w('happier'), ordinary: w('ordinary'), enjoyed: w('enjoyed'), everyday: w('everyday'),
  friend: w('friend'), less: w('less'), we: w('we'), adapt: w('adapt'), everything: w('everything'), course: w('course'), needs: w('needs'),
  but2: w('but', 2), purchase: w('purchase'), six1: w('six', 1), minutes: w('minutes'), because: w('because'), fades2: w('fades', 2),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -280, 1.3), F_(T.but1 - 0.4, C, -300, 1.25), { t: T.ronnie - 0.4, d: 1.2, x: C, y: -300, z: 1.25 },
  F_(T.months2 - 0.4, D, -300, 1.2), F_(T.enjoyed - 0.6, E2, -300, 1.2), F_(T.we - 0.4, F, -260, 1.4),
  F_(T.course - 0.4, G, -270, 1.35), F_(T.but2 - 0.4, H, -300, 1.2),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
// joy curve: spike then decay back to baseline. k = 0..1 drawing progress
function joyCurve(g, x0, x1, yb, hgt, k, a) {
  const pts = []; const n = 60;
  for (let i = 0; i <= Math.floor(n * k); i++) { const u = i / n; const v = u < 0.15 ? 0 : Math.exp(-(u - 0.15) * 6) * (u < 0.2 ? (u - 0.15) / 0.05 : 1); pts.push([lerp(x0, x1, u), yb - hgt * v]); }
  if (pts.length > 1) MM.path(g, pts, 1, a, 5, k < 1);
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.build(g, t, -0.4, x - 470, -300, 120, (g2, a) => MM.box(g2, x - 470, -300, 1.4, a, true));
  MM.label(g, 'NEW THING', x - 470, -180, p(t, 0.2, 0.4), 18, { weight: 800 });
  const ak = p(t, 0.0, 0.5);
  MM.path(g, [[x - 300, -560], [x - 300, -120], [x + 620, -120]], ak, 0.6, 2.5, false);
  MM.label(g, 'HAPPINESS', x - 300, -590, ak, 14);
  const ck = end ? 1 : clamp((t - 0.3) / (T.fades1 + 0.6));
  joyCurve(g, x - 300, x + 620, -170, 380, ck, 1);
  ['WEEK 1', 'MONTH 1', 'MONTH 3', 'MONTH 6'].forEach((m, i) => MM.label(g, m, x - 160 + i * 240, -85, p(t, 0.6 + i * 0.6, 0.4), 13));
  MM.pill(g, 'FADES IN MONTHS', x + 300, -460, win(t, T.fades1 - 0.3, T.most) + (end ? win(t, T.fades2 - 0.4, null) : 0), 22, true);
  if (end) MM.label(g, 'ASK: HOW WILL I FEEL IN 6 MONTHS?', x + 160, -20, win(t, T.because + 0.8, null), 20, { weight: 800 });
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.person(g, x - 560, 0, 1.2, p(t, T.most - 0.3, 0.4), true);
  MM.build(g, t, T.most + 0.3, x - 260, -170, 100, (g2, a) => { MM.coin(g2, x - 290, -120, 40, a); MM.coin(g2, x - 230, -170, 40, a); MM.coin(g2, x - 280, -220, 40, a); });
  MM.build(g, t, T.house - 0.4, x + 90, -150, 150, (g2, a) => MM.house(g2, x + 90, 0, 1.2, a, 0.4));
  MM.build(g, t, T.car - 0.4, x + 470, -70, 120, (g2, a) => MM.car(g2, x + 470, 0, 1.3, a, false));
  MM.big(g, 'HAPPY FOR GOOD?', x, -540, p(t, T.good - 0.7, 0.4), 60);
  MM.label(g, 'MORE MONEY · BIGGER HOUSE · NEW CAR', x, -440, p(t, T.most + 0.4, 0.4), 18);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '1978 · BRICKMAN, COATES & JANOFF-BULMAN', x, -660, win(t, T.but1 - 0.2, null), 20);
  const nm = [['PHILIP BRICKMAN', T.brickman], ['DAN COATES', T.coates], ['RONNIE JANOFF-BULMAN', T.ronnie]];
  nm.forEach(([n, ts], i) => MM.typeText(g, n, x - 420 + i * 420, -570, clamp((t - ts + 0.3) / 0.8), 1, 28));
  MM.label(g, 'PSYCHOLOGISTS', x, -500, p(t, T.y1978, 0.4), 18);
  MM.build(g, t, T.but1 + 0.3, x - 300, -280, 140, (g2, a) => MM.ticket(g2, x - 300, -280, 1.5, a, 'LOTTERY'));
  MM.ripple(g, x - 300, -280, t, T.lottery, 80, 420, 0.9);
  const pk = out(clamp((t - T.but1 - 1.0) / (T.prizes - T.but1 - 0.6)));
  MM.big(g, MM.money(50000 + 950000 * pk), x + 300, -300, p(t, T.but1 + 0.8, 0.4), 64);
  MM.label(g, 'PRIZES: $50,000 TO $1,000,000', x + 300, -220, p(t, T.prizes - 0.4, 0.4), 16, { weight: 800 });
  MM.label(g, 'WINNERS INTERVIEWED', x, -80, p(t, T.but1 + 0.8, 0.4), 20, { weight: 800 });
}
function bars(g, t, x, title, ts, vw, vo, lblW, lblO) {
  MM.label(g, title, x, -680, p(t, ts - 0.2, 0.4), 20);
  MM.label(g, 'RATED 0 – 5', x, -640, p(t, ts, 0.4), 14);
  const k = out(clamp((t - ts) / 1.2)), a = p(t, ts - 0.2, 0.4);
  const H0 = 480 / 5;
  [[x - 260, vw, lblW, true], [x + 260, vo, lblO, false]].forEach(([bx, v, lbl, fill]) => {
    const h = H0 * v * k;
    MM.rr(g, bx - 110, -80 - h, 220, h, 16);
    if (fill) { MM.fill(g, a); g.fill(); MM.halo(g, bx, -80 - h, 120, a * 0.5); } else { MM.stroke(g, a, 3); g.stroke(); }
    MM.big(g, (v * k).toFixed(1), bx, -120 - h, a, 56);
    MM.label(g, lbl, bx, -30, a, 18, { weight: 800 });
  });
}
function zoneD(g, t) {
  const x = D;
  bars(g, t, x, 'HOW HAPPY ARE YOU NOW?', T.months2, 4.0, 3.8, 'LOTTERY WINNERS', 'ORDINARY PEOPLE');
  MM.pill(g, 'NOT MUCH HAPPIER', x, -560, win(t, T.happier - 0.3, null), 22, true);
}
function zoneE(g, t) {
  const x = E2;
  bars(g, t, x, 'EVERYDAY PLEASURES', T.enjoyed - 0.2, 3.3, 3.8, 'LOTTERY WINNERS', 'ORDINARY PEOPLE');
  MM.build(g, t, T.friend - 0.4, x, -440, 90, (g2, a) => { MM.person(g2, x - 50, -380, 0.6, a, true); MM.person(g2, x + 50, -380, 0.6, a, false); });
  MM.label(g, 'TALKING WITH A FRIEND', x, -350, p(t, T.friend - 0.2, 0.4), 14, { weight: 800 });
  MM.pill(g, 'A LITTLE LESS', x, -560, win(t, T.less - 0.4, null), 22, true);
}
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.we - 0.3, x - 150, -40, 170, (g2, a) => MM.treadmill(g2, x - 150, 0, 1.6, a, t, 2));
  MM.person(g, x - 150 + Math.sin(t * 9) * 6, -6, 1.2, p(t, T.we - 0.1, 0.4), true);
  MM.big(g, 'THE HEDONIC TREADMILL', x, -560, p(t, T.adapt - 0.4, 0.4), 52);
  MM.label(g, 'WE ADAPT TO ALMOST EVERYTHING', x, -470, win(t, T.adapt, null), 20, { weight: 800 });
  for (let i = 0; i < 3; i++) MM.build(g, t, T.everything - 0.6 + i * 0.2, x + 400, -380 + i * 130, 60, (g2, a) => MM.box(g2, x + 400, -380 + i * 130, 0.7, a * (1 - i * 0.25), false));
}
function zoneG(g, t) {
  const x = G;
  MM.pill(g, 'MONEY STILL MATTERS ✓', x, -600, win(t, T.course - 0.2, null), 22);
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.build(g, t, T.course, x - 300, -150, 150, (g2, a) => MM.house(g2, x - 300, 0, 1.2, a, 0.3));
  MM.build(g, t, T.course + 0.4, x + 50, -90, 100, (g2, a) => MM.plate(g2, x + 50, -40, 1.2, a));
  MM.build(g, t, T.course + 0.8, x + 360, -200, 120, (g2, a) => MM.shield(g2, x + 360, -200, 1.1, a, false));
  MM.label(g, 'FOR REAL NEEDS', x, 50, p(t, T.needs - 0.4, 0.4), 20, { weight: 800 });
}
function zoneH(g, t) {
  const x = H;
  MM.pill(g, 'BEFORE A BIG PURCHASE', x, -680, win(t, T.but2 - 0.2, null), 22, true);
  const ak = p(t, T.but2, 0.5);
  MM.path(g, [[x - 560, -560], [x - 560, -200], [x + 580, -200]], ak, 0.6, 2.5, false);
  joyCurve(g, x - 560, x + 580, -250, 300, clamp((t - T.but2 - 0.2) / 3.2), 1);
  const m1 = p(t, T.minutes - 0.6, 0.4), m2 = p(t, T.six1 - 0.2, 0.4);
  MM.path(g, [[x - 340, -200], [x - 340, -560]], m1, 0.5, 2, false); MM.label(g, '6 MINUTES', x - 340, -170, m1, 16, { weight: 800 });
  MM.path(g, [[x + 380, -200], [x + 380, -560]], m2, 1, 3, false); MM.label(g, '6 MONTHS', x + 380, -170, m2, 18, { weight: 800 });
  MM.typeText(g, 'HOW WILL I FEEL', x, -100, clamp((t - T.purchase - 0.4) / 0.9), 1, 40);
  MM.typeText(g, 'IN 6 MONTHS?', x, -40, clamp((t - T.six1 + 0.2) / 0.9), 1, 40);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
