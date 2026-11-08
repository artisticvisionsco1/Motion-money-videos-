// 08 — Every purchase costs more than its price (opportunity cost)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  purchase1: w('purchase', 1), price1: w('price', 1), most: w('most'), question1: w('question', 1), afford: w('afford'),
  but1: w('but', 1), second: w('second'), receipt: w('receipt'), economists: w('economists'), opportunity: w('opportunity'), become1: w('become', 1),
  imagine: w('imagine'), k1a: w('$1,000', 1), forget: w('forget'), invested1: w('invested', 1), r8: w('8%'), k10a: w('$10,000', 1), y30a: w('30', 1),
  real: w('real'), k1b: w('$1,000', 2), k10b: w('$10,000', 2),
  small: w('small'), repeat: w('repeat'), d150: w('$150'), subscriptions: w('subscriptions'), takeout: w('takeout'), apps: w('apps'),
  invested2: w('invested', 2), k223: w('$223,000'),
  this1: w('this'), wealthy: w('wealthy'), tag2: w('tag', 2), times: w('times'), time: w('time'),
  course: w('course'), enjoying: w('enjoying'), invested3: w('invested', 3),
  but2: w('but', 2), try1: w('try'), multiply: w('multiply'), ten: w('10'), worth1: w('worth', 1), guilt: w('guilt'),
  because: w('because'), worth2: w('worth', 2), become2: w('become', 2),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const A = 0, B = 5000, C = 10000, D = 15000, F = 20000, G = 25000, H = 30000, I = 35000;
const OPEN = { x: 0, y: -260, z: 1.25 };
const F_ = (t, x, y, z, d = 0.9) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.45, B, -250, 1.35),
  F_(T.but1 - 0.4, C, -260, 1.3),
  F_(T.imagine - 0.45, D - 250, -260, 1.3),
  { t: T.invested1 - 0.1, d: 0.8, x: D + 120, y: -300, z: 1.05 },
  F_(T.small - 0.45, F, -280, 1.12),
  F_(T.this1 - 0.45, G, -280, 1.35),
  F_(T.course - 0.45, H, -260, 1.4),
  F_(T.but2 - 0.45, I, -280, 1.3),
  F_(T.because - 0.45, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
const FV1 = years => 1000 * 1.08 ** years;
const r = 0.08 / 12, FVm = months => 150 * ((1 + r) ** months - 1) / r;

// ---------- A: the price and its shadow ----------
function zoneA(g, t) {
  const x = A;
  const end = t > T.because - 0.5;
  MM.build(g, t, -0.4, x - 300, -260, 150, (g2, a) => MM.tag(g2, x - 300, -520, a, 0.12 * Math.sin(t * 2), '$1,000', 3.0));
  MM.label(g, 'THE PRICE', x - 300, -10, p(t, 0.2, 0.4), 22);
  // the shadow price grows behind
  const gk = end ? 1 : out(clamp((t - T.price1 + 0.4) / 1.6));
  const sc = 1.9 + 1.7 * gk;
  g.setLineDash([12, 10]);
  MM.build(g, t, T.price1 - 0.5, x + 320, -300, 200, (g2, a) => MM.tag(g2, x + 320, -300 - 75 * sc, a * 0.9, -0.08 * Math.sin(t * 1.7), MM.money(1000 + 9063 * gk), sc));
  g.setLineDash([]);
  MM.label(g, 'THE REAL COST', x + 320, -10, p(t, T.price1, 0.4), 22);
  if (end) MM.label(g, 'WHAT IT COULD HAVE BECOME', x, 90, win(t, T.become2 - 0.5, null), 24);
}

// ---------- B: can I afford it? ----------
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  const wk = MM.walk(t, T.most - 0.4, x - 650, x - 330, 1.2);
  MM.person(g, wk.x, wk.bob, 1.15, 1, true);
  MM.build(g, t, T.most + 0.3, wk.x + 170, -70, 90, (g2, a) => MM.cart(g2, wk.x + 170, 0, 1.2, a));
  MM.build(g, t, T.question1 - 0.3, x + 260, -330, 200, (g2, a) => { MM.rr(g2, x + 20, -420, 480, 180, 26); MM.stroke(g2, a, 3); g2.stroke(); MM.big(g2, 'CAN I AFFORD IT?', x + 260, -330, a, 38); }, 0.8);
  const ck = p(t, T.afford + 0.3, 0.5);
  MM.path(g, [[x + 200, -180], [x + 250, -130], [x + 340, -230]], ck, 1, 8, true);
  MM.pill(g, 'THE ONLY QUESTION?', x + 260, -500, win(t, T.question1, null), 18);
}

// ---------- C: the second price on the receipt ----------
function zoneC(g, t) {
  const x = C;
  const rk = p(t, T.but1 - 0.1, 0.6);
  MM.build(g, t, T.but1 - 0.2, x - 320, -260, 200, (g2, a) => MM.receipt(g2, x - 320, -260, 1.5, a, [['NEW GADGET', '$1,000'], ['TAX', 'INCL.'], ['', '']], '$1,000'), 0.8);
  // the hidden line
  const hk = p(t, T.second, 0.8);
  g.setLineDash([10, 8]); MM.path(g, [[x - 470, -40], [x - 170, -40]], hk, 0.9, 2.5, false); g.setLineDash([]);
  MM.label(g, 'SECOND PRICE: ???', x - 320, -10, win(t, T.second + 0.2, null), 16);
  MM.pill(g, 'NOT ON THE RECEIPT', x - 320, 40, win(t, T.receipt - 0.3, null), 18, true);
  MM.build(g, t, T.opportunity - 0.4, x + 330, -380, 260, (g2, a) => { MM.big(g2, 'OPPORTUNITY', x + 330, -420, a, 64); MM.big(g2, 'COST', x + 330, -340, a, 64); }, 0.8);
  MM.label(g, 'WHAT THAT MONEY COULD HAVE BECOME', x + 330, -240, win(t, T.become1 - 0.6, null), 18);
  MM.ripple(g, x + 330, -380, t, T.opportunity + 0.5, 100, 520, 1.1);
}

// ---------- D: $1,000 → $10,063 live ----------
function zoneD(g, t) {
  const x = D;
  // the forgotten purchase
  const fg = p(t, T.forget, 0.8);
  MM.build(g, t, T.imagine - 0.2, x - 520, -160, 120, (g2, a) => { MM.box(g2, x - 520, -170, 1.1, a * (1 - 0.65 * fg), fg < 0.5); });
  MM.big(g, '$1,000', x - 520, -330, p(t, T.k1a - 0.2, 0.4) * (1 - 0.5 * fg), 46);
  MM.pill(g, 'FORGOTTEN IN A MONTH', x - 520, -20, win(t, T.forget + 0.2, null), 16);
  // calculator curve 0..30 years
  const X = yr => x - 260 + yr / 30 * 900, Y = v => -40 - v / 10500 * 520;
  const ak = p(t, T.invested1 - 0.2, 0.6);
  MM.path(g, [[X(0), Y(10500)], [X(0), -40], [X(30), -40]], ak, 0.7, 2.5, false);
  for (const yr of [0, 10, 20, 30]) MM.label(g, yr + ' YRS', X(yr), -10, ak, 14);
  MM.pill(g, '8% / YEAR', X(5), Y(9500), win(t, T.r8, null), 18, true);
  const gk = inOut(clamp((t - T.r8 + 0.2) / (T.y30a - T.r8 + 0.6)));
  if (gk > 0) {
    const pts = []; for (let i = 0; i <= 60 * gk; i++) { const yr = i / 2; pts.push([X(yr), Y(FV1(yr))]); }
    MM.path(g, pts, 1, 1, 5, gk < 1);
    const yr = 30 * gk, tip = pts[pts.length - 1] || [X(0), Y(1000)];
    MM.big(g, MM.money(FV1(yr)), tip[0] - (gk > 0.8 ? 90 : 0), tip[1] - 46, 1, 40);
    MM.label(g, `YEAR ${Math.round(yr)}`, tip[0] - (gk > 0.8 ? 90 : 0), tip[1] - 90, 1, 14);
  }
  // real price swap
  const rk = p(t, T.real - 0.2, 0.5);
  if (rk > 0) {
    MM.rr(g, X(4) - 20, Y(7000) - 70, 380, 150, 20); MM.fill(g, 0.05 * rk); g.fill(); MM.stroke(g, rk, 3); g.stroke();
    MM.label(g, 'REAL PRICE', X(4) + 170, Y(7000) - 40, rk, 16);
    const swap = p(t, T.k10b - 0.2, 0.4);
    MM.big(g, swap > 0.5 ? '$10,063' : '$1,000', X(4) + 170, Y(7000) + 20, rk, 52);
    if (t > T.k1b && t < T.k10b) { MM.stroke(g, 1, 5); g.beginPath(); g.moveTo(X(4) + 60, Y(7000) + 20); g.lineTo(X(4) + 280, Y(7000) + 20); g.stroke(); }
  }
}

// ---------- F: small things that repeat ----------
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.small - 0.1, x - 560, -380, 90, (g2, a) => MM.phone(g2, x - 560, -380, 0.9, a, 'SUBS'));
  MM.build(g, t, T.small + 0.4, x - 560, -170, 90, (g2, a) => MM.plate(g2, x - 560, -150, 0.9, a));
  MM.build(g, t, T.repeat, x - 560, 0, 70, (g2, a) => { for (let i = 0; i < 4; i++) { MM.rr(g2, x - 610 + (i % 2) * 60, -40 + Math.floor(i / 2) * 60 - 30, 44, 44, 10); MM.stroke(g2, a, 2.5); g2.stroke(); } });
  MM.big(g, '$150 / MONTH', x - 560, -560, p(t, T.d150 - 0.2, 0.4), 40);
  MM.label(g, 'THINGS THAT REPEAT', x - 560, -640, p(t, T.repeat - 0.2, 0.4), 16);
  // money leaking out every month while the items repeat
  for (let i = 0; i < 20; i++) { const ts = T.small + 0.6 + i * 0.3, k = clamp((t - ts) / 0.8); if (k <= 0 || k >= 1 || t > T.invested2) continue; MM.coin(g, lerp(x - 480, x + 200, k), -200 - Math.sin(Math.PI * k) * 160 + (i % 3) * 40, 13, Math.sin(Math.PI * k)); }
  MM.pill(g, 'EVERY MONTH', x + 150, -480, win(t, T.d150, T.invested2), 18);
  // 30-year curve
  const X = m => x - 300 + m / 360 * 950, Y = v => 40 - v / 240000 * 640;
  const ak = p(t, T.invested2 - 0.4, 0.6);
  MM.path(g, [[X(0), Y(240000)], [X(0), 40], [X(360), 40]], ak, 0.7, 2.5, false);
  const gk = inOut(clamp((t - T.invested2 + 0.1) / (T.k223 - T.invested2 + 0.6)));
  if (gk > 0) {
    const pts = []; for (let m = 0; m <= 360 * gk; m += 6) pts.push([X(m), Y(FVm(m))]);
    MM.path(g, pts, 1, 1, 5, gk < 1);
    const tip = pts[pts.length - 1] || [X(0), 40];
    MM.big(g, MM.money(FVm(360 * gk)), tip[0] - (gk > 0.8 ? 140 : 0), tip[1] - 46, 1, 46);
  }
  MM.label(g, '30 YEARS', X(360), 70, ak, 16);
  MM.ripple(g, X(360), Y(FVm(360)), t, T.k223 + 0.6, 40, 300, 0.9);
}

// ---------- G: price tag × time ----------
function zoneG(g, t) {
  const x = G;
  MM.build(g, t, T.this1 - 0.4, x - 380, -280, 140, (g2, a) => MM.tag(g2, x - 380, -460, a, 0.1 * Math.sin(t * 2), 'PRICE', 2));
  MM.big(g, '×', x, -280, p(t, T.times - 0.2, 0.4), 120);
  MM.build(g, t, T.time - 0.3, x + 380, -280, 150, (g2, a) => MM.hourglass(g2, x + 380, -280, 2.2, a, clamp((t - T.time) / 4)));
  MM.label(g, 'WHAT WEALTHY PEOPLE READ', x, 40, win(t, T.tag2 - 0.5, null), 22);
}

// ---------- H: enjoy life ----------
function zoneH(g, t) {
  const x = H;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 300, 0, 1.15, p(t, T.course - 0.2, 0.4), true, t > T.enjoying ? 'up' : 'stand');
  MM.build(g, t, T.enjoying - 0.2, x + 200, -80, 110, (g2, a) => MM.plate(g2, x + 200, -60, 1.3, a));
  MM.pill(g, 'ENJOY YOUR LIFE ✓', x - 50, -420, win(t, T.enjoying, null), 22);
  MM.pill(g, 'NOT EVERY DOLLAR', x - 50, -340, win(t, T.invested3 - 0.8, null), 18, true);
}

// ---------- I: the ×10 rule ----------
function zoneI(g, t) {
  const x = I;
  MM.build(g, t, T.but2 - 0.2, x - 450, -260, 120, (g2, a) => MM.tag(g2, x - 450, -440, a, 0.1 * Math.sin(t * 2), '$50', 1.9));
  MM.big(g, '× 10', x - 120, -280, p(t, T.multiply, 0.4), 90);
  const tk = p(t, T.ten - 0.1, 0.5);
  MM.big(g, '= $500', x + 230, -280, tk, 90);
  MM.label(g, 'IN 30 YEARS', x + 230, -200, tk, 18);
  MM.pill(g, 'STILL WORTH IT?', x + 230, -460, win(t, T.worth1 - 0.3, null), 22);
  const ck = p(t, T.guilt - 0.4, 0.6);
  MM.path(g, [[x + 420, -480], [x + 460, -440], [x + 530, -520]], ck, 1, 7, true);
  MM.label(g, 'THEN BUY IT WITHOUT GUILT', x, 0, win(t, T.guilt - 0.3, null), 24);
  MM.label(g, 'THE ×10 RULE', x, -640, win(t, T.but2 + 0.2, null), 26);
  MM.label(g, 'BEFORE YOUR NEXT PURCHASE', x - 450, -40, win(t, T.but2 + 0.4, T.multiply), 18);
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
    if (near(F)) zoneF(g, t);
    if (near(G)) zoneG(g, t);
    if (near(H)) zoneH(g, t);
    if (near(I)) zoneI(g, t);
  },
};
