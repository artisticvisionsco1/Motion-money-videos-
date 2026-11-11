// 19 — The credit card minimum payment trap
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  triple1: w('triple', 1), most: w('most'), fine: w('fine'), but1: w('but', 1), k5a: w('$5,000', 1), r22: w('22%'), d100: w('$100'), y11: w('11'),
  k87: w('$8,700'), k137: w('$13,700'), k5b: w('$5,000', 2), raise: w('raise'), d250: w('$250'), gone: w('gone'), k13: w('$1,300'),
  difference: w('difference'), speed: w('speed'), this1: w('this'), invisible: w('invisible'), small: w('small'), total: w('total'), grows: w('grows'),
  course: w('course'), manage: w('manage'), missing: w('missing'), but2: w('but', 2), attack: w('attack'), highest: w('highest'),
  because: w('because'), bank: w('bank'), wait: w('wait'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, E2 = 15000, F = 20000, G = 25000, H = 30000;
const OPEN = { x: 0, y: -280, z: 1.25 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -260, 1.4), F_(T.but1 - 0.4, C, -300, 1.0),
  { t: T.y11, d: 1.2, x: C, y: -300, z: 1.0 }, { t: T.raise - 0.5, d: 1.2, x: C, y: -300, z: 1.0 },
  F_(T.difference - 0.4, E2, -270, 1.3), F_(T.this1 - 0.4, F, -280, 1.25), F_(T.course - 0.4, G, -260, 1.35),
  F_(T.but2 - 0.4, H, -280, 1.2), F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
const r = 0.22 / 12;
function sim(pay) { const out_ = [5000]; let b = 5000, paid = 0; while (b > 0 && out_.length < 400) { b = b * (1 + r); const pm = Math.min(pay, b); b -= pm; paid += pm; out_.push(Math.max(0, b)); } return { bal: out_, paid }; }
const S100 = sim(100), S250 = sim(250);
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.build(g, t, -0.4, x - 330, -300, 200, (g2, a) => MM.ccard(g2, x - 330, -300, 1.5, a, true, 'MIN. DUE $100'));
  const k = end ? 1 : out(clamp((t - 0.4) / 2.6));
  MM.big(g, MM.money(5000 + 8678 * k), x + 360, -340, p(t, 0.1, 0.4), 84);
  MM.label(g, 'WHAT YOU REALLY PAY', x + 360, -260, p(t, 0.5, 0.4), 18);
  MM.pill(g, '≈ 2.7 ×', x + 360, -470, win(t, T.triple1 - 0.2, T.most) + (end ? win(t, T.because + 1.2, null) : 0), 26, true);
  if (end) MM.label(g, 'THE BANK IS HAPPY TO WAIT', x, 40, win(t, T.bank - 0.5, null), 24);
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 280, 0, 1.15, p(t, T.most - 0.1, 0.4), true);
  for (let i = 0; i < 6; i++) { const ts = T.most + 0.3 + i * 0.5, k = clamp((t - ts) / 0.6); if (k <= 0 || k >= 1) continue; const e = inOut(k); MM.coin(g, lerp(x - 200, x + 260, e), -200 - Math.sin(Math.PI * e) * 120, 16, 1); }
  MM.build(g, t, T.most + 0.1, x + 300, -220, 150, (g2, a) => MM.ccard(g2, x + 300, -220, 1.0, a, false));
  MM.pill(g, 'PAID SOMETHING ✓', x, -440, win(t, T.most + 1.0, null), 20);
  MM.label(g, "I'M FINE?", x, -360, win(t, T.fine - 0.3, null), 22, { weight: 800 });
}
function zoneC(g, t) {
  const x = C;
  const X = m => x - 620 + m / 140 * 1240, Y = v => -60 - v / 5200 * 560;
  const ak = p(t, T.but1 - 0.1, 0.6);
  MM.path(g, [[X(0), Y(5300)], [X(0), -60], [X(140), -60]], ak, 0.7, 2.5, false);
  for (const yr of [0, 2, 4, 6, 8, 10]) MM.label(g, yr + ' YR', X(yr * 12), -25, ak, 13);
  MM.big(g, '$5,000 · 22%', x - 300, -660, p(t, T.k5a - 0.3, 0.4), 46);
  { const fo = 1 - p(t, T.d100 + 0.2, 0.4);
    MM.build(g, t, T.k5a - 0.3, x + 330, -400, 150, (g2, a) => MM.ccard(g2, x + 330, -400, 1.3, a * fo, true, '$5,000'));
    MM.label(g, '22% A YEAR = INTEREST EVERY MONTH', x + 330, -230, p(t, T.r22 - 0.2, 0.4) * fo, 16, { weight: 800 });
    MM.big(g, '+$' + Math.round(92 * out(clamp((t - T.r22) / 1.0))) + ' / MO', x + 330, -150, p(t, T.r22, 0.4) * fo, 52);
    MM.coin(g, X(0), Y(5000), 14, p(t, T.k5a, 0.4)); MM.ripple(g, X(0), Y(5000), t, T.k5a + 0.2, 20, 160, 0.8); }
  // $100 / month path
  const k1 = clamp((t - T.d100 + 0.2) / (T.k87 - T.d100 + 0.3));
  const n1 = Math.floor(k1 * (S100.bal.length - 1)), pts = [];
  for (let m = 0; m <= n1; m += 2) pts.push([X(m), Y(S100.bal[m])]);
  if (pts.length > 1) MM.path(g, pts, 1, 1, 5, k1 < 1);
  MM.label(g, '$100 / MONTH', X(70), Y(4300), p(t, T.d100, 0.4), 18, { weight: 800 });
  MM.big(g, Math.floor(n1 / 12) + ' YRS ' + (n1 % 12) + ' MO', x + 330, -640, p(t, T.d100 + 0.3, 0.4) * (1 - p(t, T.raise, 0.4)), 40);
  MM.label(g, 'INTEREST PAID: ' + MM.money(8678 * k1), x + 330, -580, p(t, T.y11, 0.4) * (1 - p(t, T.raise, 0.4)), 20, { weight: 800 });
  MM.pill(g, 'TOTAL ' + MM.money(13678), X(100), Y(2600), win(t, T.k137 - 0.3, null), 22, true);
  // $250 / month path
  const k2 = clamp((t - T.d250 + 0.2) / (T.gone - T.d250 + 0.9));
  const n2 = Math.floor(k2 * (S250.bal.length - 1)), pts2 = [];
  for (let m = 0; m <= n2; m++) pts2.push([X(m), Y(S250.bal[m])]);
  g.setLineDash([12, 8]); if (pts2.length > 1) MM.path(g, pts2, 1, 1, 5, k2 < 1); g.setLineDash([]);
  MM.label(g, '$250 / MONTH', X(26) + 70, Y(600), p(t, T.d250, 0.4), 18, { weight: 800 });
  MM.big(g, '26 MONTHS', x + 330, -640, p(t, T.gone - 0.2, 0.4), 40);
  MM.label(g, 'INTEREST: $1,286', x + 330, -580, p(t, T.k13 - 0.3, 0.4), 20, { weight: 800 });
}
function zoneE(g, t) {
  const x = E2;
  MM.build(g, t, T.difference - 0.2, x - 300, -280, 150, (g2, a) => MM.clock(g2, x - 300, -280, 130, a, t, 8, true));
  MM.label(g, "NOT YOUR INCOME", x + 280, -340, win(t, T.difference, null), 26, { weight: 800, v: 160 });
  MM.big(g, "IT'S THE SPEED", x + 280, -250, p(t, T.speed - 0.3, 0.4), 56);
  // two bars of interest
  const ia = p(t, T.difference + 0.3, 0.5);
  MM.rr(g, x + 60, -120, 440 * ia, 40, 12); MM.fill(g, ia); g.fill(); MM.label(g, '$8,678', x + 560, -100, ia, 18, { weight: 800 });
  MM.rr(g, x + 60, -60, 65 * ia, 40, 12); MM.stroke(g, ia, 2.5); g.stroke(); MM.label(g, '$1,286', x + 200, -40, ia, 18, { weight: 800 });
}
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.this1 - 0.2, x - 330, -260, 120, (g2, a) => MM.tag(g2, x - 330, -420, a, 0.1 * Math.sin(t * 2), '$100', 2.0));
  MM.label(g, 'LOOKS SMALL', x - 330, -60, win(t, T.small - 0.4, null), 20);
  const gk = clamp((t - T.invisible) / 4);
  g.setLineDash([12, 10]);
  MM.rr(g, x + 120, -60 - 480 * (0.3 + 0.7 * gk), 380, 480 * (0.3 + 0.7 * gk), 18); MM.stroke(g, p(t, T.invisible - 0.4, 0.5) * 0.8, 3); g.stroke();
  g.setLineDash([]);
  MM.big(g, MM.money(5000 + 8678 * gk), x + 310, -100 - 480 * (0.3 + 0.7 * gk) / 2, p(t, T.invisible - 0.3, 0.4), 44);
  MM.label(g, 'THE TOTAL QUIETLY GROWS', x + 310, 0, win(t, T.total - 0.3, null), 18);
  MM.pill(g, 'INVISIBLE INTEREST', x, -640, win(t, T.invisible - 0.4, null), 22, true);
}
function zoneG(g, t) {
  const x = G;
  MM.build(g, t, T.course - 0.2, x - 300, -260, 120, (g2, a) => MM.shield(g2, x - 300, -260, 1.4, a, true));
  MM.label(g, 'MINIMUM > MISSING ✓', x - 300, -60, win(t, T.manage - 0.3, null), 20);
  MM.build(g, t, T.missing - 0.5, x + 300, -260, 120, (g2, a) => { MM.ccard(g2, x + 300, -260, 1.0, a, false, 'LATE FEE'); MM.stroke(g2, a, 7); g2.beginPath(); g2.moveTo(x + 150, -360); g2.lineTo(x + 450, -160); g2.moveTo(x + 450, -360); g2.lineTo(x + 150, -160); g2.stroke(); });
  MM.label(g, 'MISSED PAYMENT', x + 300, -60, win(t, T.missing, null), 20);
}
function zoneH(g, t) {
  const x = H;
  MM.pill(g, 'PAY MORE THAN THE MINIMUM', x, -660, win(t, T.but2, null), 22, true);
  const cards = [['29%', 0], ['22%', 1], ['15%', 2]];
  cards.forEach(([rate, i]) => {
    const cx = x - 420 + i * 420, hit = i === 0 ? p(t, T.attack - 0.1, 0.6) : 0;
    MM.build(g, t, T.but2 + 0.3 + i * 0.2, cx, -330, 150, (g2, a) => MM.ccard(g2, cx, -330, 1.0, a, hit > 0.5, rate + ' APR'));
    if (hit) MM.ripple(g, cx, -330, t, T.attack + 0.2, 80, 400, 0.9);
  });
  MM.path(g, [[x - 420, -100], [x - 420, -200]], p(t, T.highest - 0.2, 0.5), 1, 5, true);
  MM.label(g, 'HIGHEST INTEREST FIRST', x - 420, -40, win(t, T.highest - 0.3, null), 20, { weight: 800 });
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
