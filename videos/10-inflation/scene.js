// 10 — Inflation: your savings shrink while the number stays the same
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  value1: w('value', 1), number1: w('number', 1), same1: w('same', 1),
  most: w('most'), bank: w('bank'), safe: w('safe'),
  but1: w('but', 1), prices1: w('prices', 1), r3: w('3%'), d100: w('$100'), d74: w('$74'), y10: w('10'), y20: w('20'), p55: w('55%'),
  bill1: w('bill', 1), wallet: w('wallet'), change: w('change'), buy2: w('buy', 2), shrinks: w('shrinks'),
  this1: w('this'), inflation: w('inflation'), hidden: w('hidden'), nobody: w('nobody'), every: w('every'), less: w('less'),
  course: w('course'), emergencies: w('emergencies'), but2: w('but', 3), touch: w('touch'), grow: w('grow'), faster: w('faster'), sit: w('sit'),
  because: w('because'), same2: w('same', 2), easy: w('easy'), miss: w('miss'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000;
const OPEN = { x: 0, y: -280, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -250, 1.4),
  F_(T.but1 - 0.4, C, -280, 1.15),
  F_(T.bill1 - 0.5, D, -280, 1.35),
  F_(T.this1 - 0.4, E2, -280, 1.3),
  F_(T.course - 0.4, F, -280, 1.2),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
const pp = yrs => 100 / 1.03 ** yrs; // purchasing power of $100

// a grid of 'things' (small boxes); n visible of 10
function goods(g, x, y, n, a, s = 1) {
  for (let i = 0; i < 10; i++) {
    const vis = clamp(n - i); if (vis <= 0) continue;
    const bx = x + ((i % 5) - 2) * 70 * s, by = y - Math.floor(i / 5) * 70 * s;
    MM.rr(g, bx - 26 * s, by - 26 * s, 52 * s, 52 * s, 10 * s); MM.stroke(g, a * vis, 2.5); g.stroke();
    MM.stroke(g, a * vis * 0.6, 2); g.beginPath(); g.moveTo(bx - 26 * s, by - 6 * s); g.lineTo(bx + 26 * s, by - 6 * s); g.stroke();
  }
}

// ---------- A: the bill vs what it buys ----------
function zoneA(g, t) {
  const x = A;
  const end = t > T.because - 0.5;
  MM.build(g, t, -0.4, x - 300, -300, 170, (g2, a) => MM.bill(g2, x - 300, -300, 1.6, a, '$100', true));
  MM.pill(g, 'SAME NUMBER', x - 300, -470, win(t, T.number1 - 0.2, T.most) + (end ? win(t, T.same2 - 0.6, null) : 0), 20);
  const shrink = end ? 1 : clamp((t - T.value1) / 2.6);
  const n = 10 - 4.5 * shrink;
  goods(g, x + 320, -230, n, p(t, 0.2, 0.5), 1.15);
  MM.label(g, 'WHAT IT BUYS', x + 320, -470, p(t, 0.4, 0.4), 18);
  MM.big(g, Math.round(100 - 45 * shrink) + '%', x + 320, -40, p(t, T.value1, 0.4), 52);
  if (end) MM.label(g, 'EASY TO MISS', x, 90, win(t, T.easy - 0.4, null), 24);
}

// ---------- B: "the bank is safe" ----------
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.build(g, t, T.most - 0.2, x - 200, -150, 200, (g2, a) => {
    MM.stroke(g2, a, 3);
    g2.beginPath(); g2.moveTo(x - 400, -280); g2.lineTo(x - 200, -380); g2.lineTo(x, -280); g2.closePath(); g2.stroke();
    for (let i = 0; i < 4; i++) { g2.strokeRect(x - 370 + i * 100, -270, 40, 250); }
    g2.strokeRect(x - 410, -20, 420, 20);
    MM.label(g2, 'BANK', x - 200, -320, a, 18);
  }, 0.8);
  MM.build(g, t, T.safe - 0.4, x + 280, -220, 120, (g2, a) => MM.shield(g2, x + 280, -220, 1.3, a, false));
  MM.pill(g, 'PERFECTLY SAFE?', x + 280, -420, win(t, T.safe - 0.2, null), 20);
}

// ---------- C: 3% a year, live purchasing power ----------
function zoneC(g, t) {
  const x = C;
  MM.pill(g, 'PRICES +3% / YEAR', x - 380, -640, win(t, T.prices1 - 0.2, null), 22, true);
  // price arrow climbing
  const ak = p(t, T.but1 - 0.3, 1.0);
  MM.path(g, [[x - 700, -380], [x - 560, -420], [x - 420, -470], [x - 280, -540]], ak, 1, 4, true);
  // bill + bar of what $100 buys
  MM.build(g, t, T.but1 - 0.45, x - 420, -170, 140, (g2, a) => MM.bill(g2, x - 420, -170, 1.3, a, '$100'));
  MM.label(g, 'TODAY', x - 420, -40, p(t, T.but1 + 0.4, 0.4), 18);
  const yrs = t < T.y20 - 0.5 ? 10 * clamp((t - T.d100 - 0.4) / (T.d74 - T.d100 + 0.4)) : 10 + 10 * clamp((t - T.y20 + 0.5) / 1.0);
  const v = pp(yrs), bx = x + 200, by = 60, H = 560;
  const ba = p(t, T.d100 + 0.2, 0.5);
  MM.rr(g, bx - 70, by - H, 140, H, 14); MM.stroke(g, ba * 0.6, 2); g.stroke();
  const fh = H * v / 100; MM.rr(g, bx - 70, by - fh, 140, fh, 14); MM.fill(g, ba); g.fill(); MM.halo(g, bx, by - fh, 140, ba * 0.5);
  MM.big(g, '$' + Math.round(v), bx, by - fh - 50, ba, 56);
  MM.label(g, 'WHAT $100 BUYS', bx, by + 40, ba, 16);
  MM.big(g, 'YEAR ' + Math.round(yrs), x + 520, -300, ba, 44);
  goods(g, x + 520, -100, 10 * v / 100, ba, 0.8);
}

// ---------- D: same bill, shrinking basket ----------
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  MM.build(g, t, T.bill1 - 0.3, x - 320, -260, 150, (g2, a) => MM.bill(g2, x - 320, -260, 1.6, a, '$100', true));
  MM.label(g, "DOESN'T CHANGE", x - 320, -90, win(t, T.change - 0.3, null), 20);
  const sk = 1 - 0.45 * out(clamp((t - T.buy2) / 1.8));
  MM.build(g, t, T.wallet - 0.3, x + 320, -80, 120, (g2, a) => { MM.cart(g2, x + 320, 0, 1.6 * sk, a); goods(g2, x + 320, -150 * sk, 8 * sk, a, 0.75 * sk); });
  MM.label(g, 'QUIETLY SHRINKS', x + 320, 40, win(t, T.shrinks - 0.3, null), 20);
}

// ---------- E: the hidden tax ----------
function zoneE(g, t) {
  const x = E2;
  MM.build(g, t, T.this1 - 0.5, x, -560, 260, (g2, a) => MM.big(g2, t < T.hidden - 0.2 ? 'INFLATION' : 'THE HIDDEN TAX', x, -560, a, 72), 0.8);
  MM.ripple(g, x, -560, t, T.hidden - 0.2, 100, 600, 1.0);
  g.setLineDash([12, 10]);
  MM.build(g, t, T.inflation, x - 300, -230, 160, (g2, a) => MM.receipt(g2, x - 300, -230, 1.2, a * 0.8, [['INFLATION TAX', '???'], ['SENT TO YOU', 'NEVER']], '—'));
  g.setLineDash([]);
  MM.label(g, 'NOBODY SENDS A BILL', x - 300, 40, win(t, T.nobody + 0.2, null), 18);
  const lk = clamp((t - T.every) / 2.0);
  MM.build(g, t, T.every - 0.4, x + 320, -100, 140, (g2, a) => MM.jar(g2, x + 320, 0, 1.4, a, 0.9 - 0.35 * lk));
  for (let i = 0; i < 16; i++) { const ts = T.every + i * 0.12, k = clamp((t - ts) / 0.9); if (k <= 0 || k >= 1) continue; MM.fill(g, 1 - k); g.beginPath(); g.arc(x + 420 + k * 220, -120 - Math.sin(i) * 40 - k * 80, 4, 0, 7); g.fill(); }
  MM.label(g, 'A LITTLE LESS EVERY YEAR', x + 320, 40, win(t, T.less - 0.4, null), 18);
}

// ---------- F: emergency cash, then grow faster than prices ----------
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.course - 0.5, x - 470, -260, 120, (g2, a) => MM.shield(g2, x - 470, -260, 1.3, a, true));
  MM.label(g, 'EMERGENCY CASH ✓', x - 470, -70, p(t, T.course, 0.4), 18);
  const X = u => x - 250 + u * 880, ak = p(t, T.but2 - 0.2, 0.6);
  MM.path(g, [[X(0), -620], [X(0), 0], [X(1), 0]], ak, 0.7, 2.5, false);
  const pk = p(t, T.touch - 0.3, 1.2), gk = p(t, T.grow - 0.2, 1.3);
  g.setLineDash([12, 10]);
  const prices = []; for (let i = 0; i <= 20; i++) prices.push([X(i / 20), -60 - 260 * ((1.03 ** (i * 1.5) - 1) / (1.03 ** 30 - 1))]);
  MM.path(g, prices, pk, 0.8, 3, false); g.setLineDash([]);
  MM.label(g, 'PRICES', X(1) + 10, prices[20][1] - 30, pk, 16);
  const grow = []; for (let i = 0; i <= 20; i++) grow.push([X(i / 20), -60 - 540 * ((1.08 ** (i * 1.5) - 1) / (1.08 ** 30 - 1))]);
  MM.path(g, grow, gk, 1, 5, true);
  MM.label(g, 'YOUR MONEY', X(1) - 60, grow[20][1] - 30, gk, 18);
  MM.pill(g, "DON'T SIT STILL", X(0.45), -560, win(t, T.sit - 0.3, null), 20, true);
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
  },
};
