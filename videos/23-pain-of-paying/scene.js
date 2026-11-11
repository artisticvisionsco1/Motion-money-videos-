// 23 — The pain of paying (Prelec & Simester, 2001)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  card1: w('card', 1), real1: w('real', 1), most: w('most'), dollar2: w('dollar', 2), however: w('however'), but1: w('but', 1), y2001: w('2001'),
  mit: w('mit'), prelik: w('prelik'), simister: w('simister'), auctioned: w('auctioned'), tickets: w('tickets'), celtics: w('celtics'),
  half1: w('half', 1), cash1: w('cash', 1), half2: w('half', 2), credit: w('credit'), twice: w('twice'), same1: w('same', 1), same2: w('same', 2),
  different: w('different'), cash2: w('cash', 2), hurts: w('hurts'), removes: w('removes'), easy: w('easy'), course: w('course'),
  but2: w('but', 2), fun: w('fun'), week: w('week'), debit: w('debit'), drops: w('drops'), because: w('because'), bill: w('bill'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -290, 1.4), F_(T.but1 - 0.4, C, -300, 1.25), { t: T.auctioned - 0.4, d: 1.2, x: C, y: -300, z: 1.25 },
  F_(T.half1 - 0.4, D, -290, 1.2), F_(T.twice - 1.0, E2, -300, 1.2), F_(T.cash2 - 0.4, F, -290, 1.3),
  F_(T.course - 0.4, G, -270, 1.4), F_(T.but2 - 0.4, H, -300, 1.2),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  const rf = end ? 1 - 0.8 * p(t, T.bill - 0.6, 0.4) : 1;
  // cash: solid and heavy. card: a fading ghost
  MM.build(g, t, -0.4, x - 330, -330, 160, (g2, a) => MM.bill(g2, x - 330, -330, 1.3, a * rf, '$100', true));
  MM.label(g, 'CASH · FEELS REAL', x - 330, -170, p(t, 0.3, 0.4), 18, { weight: 800 });
  const ghost = end ? 0.35 : 1 - 0.65 * p(t, T.real1 - 0.8, 0.8);
  MM.build(g, t, 0.0, x + 330, -330, 160, (g2, a) => MM.ccard(g2, x + 330, -330, 1.2, a * ghost * rf, false, 'TAP'));
  MM.label(g, 'CARD · FEELS LESS REAL', x + 330, -170, p(t, T.card1, 0.4), 18, { weight: 800 });
  for (let i = 0; i < 5; i++) { const k = ((t * 0.6 + i * 0.2) % 1); MM.coin(g, x + 330 + (k - 0.5) * 40, -470 - k * 160, 12, (1 - k) * 0.6 * p(t, T.card1, 0.4) * ghost); }
  if (end) {
    MM.build(g, t, T.bill - 0.4, x, -380, 130, (g2, a) => MM.receipt(g2, x, -380, 0.9, a, ['TICKETS', 'DINNER', 'APPS'], '$1,240'));
    MM.pill(g, 'THE BILL IS ALWAYS REAL', x, -60, win(t, T.bill - 0.2, null), 22, true);
  }
}
function zoneB(g, t) {
  const x = B;
  MM.build(g, t, T.most - 0.3, x - 300, -320, 140, (g2, a) => MM.bill(g2, x - 300, -320, 1.0, a, '$1', false));
  MM.big(g, '=', x, -320, p(t, T.most + 0.4, 0.4), 110);
  MM.build(g, t, T.most + 0.2, x + 300, -320, 140, (g2, a) => MM.ccard(g2, x + 300, -320, 0.8, a, false, '$1'));
  MM.big(g, 'A DOLLAR IS A DOLLAR', x, -560, p(t, T.dollar2 - 0.6, 0.4), 52);
  MM.label(g, 'HOWEVER YOU PAY?', x, -120, win(t, T.however - 0.3, null), 22, { weight: 800 });
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '2001 · MIT · DRAZEN PRELEC & DUNCAN SIMESTER', x, -660, win(t, T.but1 - 0.2, null), 20);
  MM.typeText(g, 'DRAZEN PRELEC', x - 320, -560, clamp((t - T.prelik + 0.6) / 0.8), 1, 34);
  MM.typeText(g, 'DUNCAN SIMESTER', x + 320, -560, clamp((t - T.simister + 0.5) / 0.8), 1, 34);
  MM.build(g, t, T.y2001 - 0.2, x - 320, -300, 140, (g2, a) => MM.building(g2, x - 320, -150, 260, 280, a, 0.3));
  MM.label(g, 'MIT', x - 320, -110, p(t, T.mit - 0.3, 0.4), 22, { weight: 800 });
  MM.build(g, t, T.auctioned - 0.3, x + 320, -330, 130, (g2, a) => MM.ticket(g2, x + 320, -330, 1.4, a, 'CELTICS'));
  MM.pill(g, 'SOLD OUT', x + 320, -200, win(t, T.tickets, null), 20, true);
  MM.label(g, 'REAL AUCTION · REAL TICKETS', x + 320, -110, p(t, T.celtics - 0.3, 0.4), 16, { weight: 800 });
  MM.ripple(g, x + 320, -330, t, T.tickets + 0.2, 80, 400, 0.9);
}
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  for (let i = 0; i < 4; i++) {
    const lx = x - 620 + i * 130, rx = x + 230 + i * 130;
    MM.person(g, lx, 0, 0.85, p(t, T.half1 - 0.4 + i * 0.1, 0.35), true);
    MM.build(g, t, T.cash1 - 0.6 + i * 0.1, lx, -200, 40, (g2, a) => MM.bill(g2, lx, -200, 0.3, a, '$', false));
    MM.person(g, rx, 0, 0.85, p(t, T.half1 + 0.3 + i * 0.1, 0.35), true);
    MM.build(g, t, T.credit - 0.4 + i * 0.1, rx, -200, 40, (g2, a) => MM.ccard(g2, rx, -200, 0.28, a, true));
  }
  MM.big(g, 'CASH', x - 425, -360, p(t, T.cash1 - 0.4, 0.4), 52);
  MM.big(g, 'CARD', x + 425, -360, p(t, T.credit - 0.3, 0.4), 52);
  MM.path(g, [[x, -560], [x, 20]], p(t, T.half1, 0.6), 0.5, 2, false);
  MM.label(g, 'SAME AUCTION · RANDOM HALVES', x, -620, p(t, T.half1, 0.4), 18);
}
function zoneE(g, t) {
  const x = E2;
  MM.label(g, 'AVERAGE BID FOR THE SAME TICKET', x, -680, p(t, T.twice - 1.0, 0.4), 20);
  const a1 = p(t, T.twice - 1.0, 0.4), k1 = out(clamp((t - T.twice + 0.8) / 1.0)), k2 = out(clamp((t - T.twice + 0.2) / 1.3));
  const H0 = 470, b1 = H0 * (28.51 / 60.64) * k1, b2 = H0 * k2;
  MM.rr(g, x - 470, -80 - b1, 200, b1, 16); MM.stroke(g, a1, 3); g.stroke();
  MM.big(g, '$' + (28.51 * k1).toFixed(2), x - 370, -120 - b1, a1, 50);
  MM.label(g, 'CASH', x - 370, -30, a1, 18, { weight: 800 });
  MM.rr(g, x + 270, -80 - b2, 200, b2, 16); MM.fill(g, a1); g.fill(); MM.halo(g, x + 370, -80 - b2, 120, a1 * 0.5);
  MM.big(g, '$' + (60.64 * k2).toFixed(2), x + 370, -120 - b2, a1, 50);
  MM.label(g, 'CARD', x + 370, -30, a1, 18, { weight: 800 });
  const ck = p(t, T.twice + 0.6, 0.4);
  MM.label(g, '60.64 ÷ 28.51', x - 20, -470, ck, 24, { weight: 800 });
  MM.big(g, '2.1×', x - 20, -380, ck, 96);
  MM.ripple(g, x - 20, -380, t, T.twice + 1.0, 100, 480, 1.0);
  MM.pill(g, 'SAME TICKETS', x - 20, -280, win(t, T.same1 - 0.2, null), 18);
  MM.pill(g, 'SAME GAME', x - 20, -220, win(t, T.same2 - 0.2, null), 18);
  MM.pill(g, 'DIFFERENT WAY TO PAY', x - 20, -160, win(t, T.different - 0.3, null), 18, true);
}
function zoneF(g, t) {
  const x = F;
  MM.label(g, 'PAIN OF PAYING', x, -680, p(t, T.cash2 - 0.4, 0.4), 22, { weight: 800 });
  MM.build(g, t, T.cash2 - 0.3, x - 420, -330, 120, (g2, a) => MM.bill(g2, x - 420 - 60 * p(t, T.hurts, 1.0), -330 - 40 * p(t, T.hurts, 1.0), 0.9, a, '$50', true));
  MM.pctBar(g, x - 150, -100, 420, 85 * out(clamp((t - T.hurts) / 0.9)), p(t, T.cash2 - 0.2, 0.4), 'CASH');
  MM.build(g, t, T.removes - 0.5, x + 420, -330, 120, (g2, a) => MM.ccard(g2, x + 420, -330, 0.8, a, false, 'TAP'));
  MM.pctBar(g, x + 150, -100, 420, 85 - 70 * out(clamp((t - T.removes) / 0.9)), p(t, T.removes - 0.4, 0.4), 'CARD');
  MM.label(g, 'IT HURTS A LITTLE', x - 420, -200, win(t, T.hurts, null), 16, { weight: 800 });
  MM.pill(g, 'SPENDING FEELS EASY', x + 420, -200, win(t, T.easy - 0.4, null), 18, true);
}
function zoneG(g, t) {
  const x = G;
  MM.build(g, t, T.course - 0.3, x - 250, -300, 130, (g2, a) => MM.shield(g2, x - 250, -300, 1.4, a, true));
  MM.build(g, t, T.course + 0.2, x + 280, -300, 130, (g2, a) => MM.ccard(g2, x + 280, -300, 1.0, a, false));
  MM.pill(g, 'SAFE · USEFUL ✓', x, -80, win(t, T.course, null), 22);
}
function zoneH(g, t) {
  const x = H;
  MM.pill(g, 'ONE-WEEK TEST · FUN SPENDING', x, -680, win(t, T.but2 - 0.2, null), 22, true);
  for (let i = 0; i < 7; i++) {
    const cx = x - 540 + i * 180, a = p(t, T.but2 - 0.2 + i * 0.08, 0.35);
    MM.rr(g, cx - 75, -560, 150, 180, 14); MM.stroke(g, a, 2.5); g.stroke();
    MM.label(g, ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i], cx, -530, a, 14);
    MM.build(g, t, T.week - 0.3 + i * 0.22, cx, -450, 40, (g2, aa) => MM.bill(g2, cx, -450, 0.36, aa, '$', false));
  }
  MM.label(g, 'CASH OR DEBIT ONLY', x, -330, p(t, T.debit - 0.4, 0.4), 20, { weight: 800 });
  // total: before vs after
  const tk = p(t, T.debit, 0.5);
  MM.rr(g, x - 520, -240, 1040, 50, 25); MM.stroke(g, tk, 3); g.stroke();
  const fillw = 1028 * lerp(1, 0.7, inOut(clamp((t - T.drops + 0.6) / 1.2)));
  MM.rr(g, x - 514, -234, fillw * tk, 38, 19); MM.fill(g, tk); g.fill();
  MM.label(g, 'WEEKLY TOTAL', x - 440, -150, tk, 16, { weight: 800 });
  MM.pill(g, 'SEE IF IT DROPS ↓', x + 300, -150, win(t, T.drops - 0.4, null), 20, true);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
