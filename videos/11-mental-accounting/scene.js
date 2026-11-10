// 11 — Mental accounting: your tax refund isn't free money
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  free1: w('free', 1), own: w('own'), late1: w('late', 1), most: w('most'), bonus: w('bonus'), reward: w('reward'),
  but1: w('but', 1), thaler: w('thaler'), nobel: w('nobel'), mental: w('mental'), salary1: w('salary', 1), gifts: w('gifts'), windfalls: w('windfalls'), easier: w('easier'),
  imagine1: w('imagine', 1), d250: w('$250'), withheld: w('withheld'), d3000: w('$3,000'), government: w('government'), zero: w('0%'),
  then: w('then'), check: w('check'), gift: w('gift'), disappears: w('disappears'), salary2: w('salary', 2),
  this1: w('this'), cheap: w('cheap'), precious: w('precious'), course: w('course'), forced: w('forced'),
  but2: w('but', 2), windfall2: w('windfall'), regular: w('regular'), would: w('would', 2), way: w('way'),
  because: w('because'), late2: w('late', 2),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -260, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -250, 1.4), F_(T.but1 - 0.4, C, -280, 1.1), F_(T.imagine1 - 0.4, D, -280, 1.05),
  F_(T.then - 0.4, E2, -260, 1.25), F_(T.this1 - 0.4, F, -260, 1.4), F_(T.course - 0.4, G, -250, 1.45),
  F_(T.but2 - 0.4, H, -280, 1.25), F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.build(g, t, -0.4, x - 120, -300, 220, (g2, a) => MM.cheque(g2, x - 120, -300, 1.6, a, '$3,000', true));
  // gift bow on top until "own"
  const bow = 1 - p(t, T.own - 0.2, 0.5);
  if (bow > 0) { MM.stroke(g, bow, 6, 0); g.beginPath(); g.moveTo(x - 120, -444); g.lineTo(x - 120, -156); g.moveTo(x - 440, -300); g.lineTo(x + 200, -300); g.stroke(); MM.stroke(g, bow, 4); g.beginPath(); g.ellipse(x - 150, -470, 34, 20, -0.5, 0, 7); g.ellipse(x - 90, -470, 34, 20, 0.5, 0, 7); g.stroke(); }
  MM.pill(g, 'FREE MONEY?', x - 120, -560, win(t, T.free1 - 0.2, T.own), 22);
  MM.pill(g, 'YOUR OWN MONEY', x - 120, -560, win(t, T.own, T.most) + (end ? win(t, T.because + 0.3, null) : 0), 22, true);
  MM.build(g, t, T.late1 - 0.5, x + 420, -300, 90, (g2, a) => MM.clock(g2, x + 420, -300, 80, a, t, 2, true));
  MM.label(g, 'RETURNED LATE', x + 420, -180, win(t, T.late1 - 0.2, null), 20);
  if (end) MM.label(g, 'IT ONLY FEELS FREE', x, 0, win(t, T.late2 - 1.2, null), 24);
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 250, 0, 1.15, p(t, T.most - 0.1, 0.4), true, t > T.bonus ? 'up' : 'stand');
  MM.build(g, t, T.most + 0.2, x + 200, -110, 100, (g2, a) => MM.box(g2, x + 200, -110, 1.3, a, true));
  for (let i = 0; i < 20; i++) { const k = ((t - T.bonus) * 0.6 + i / 20) % 1; if (t < T.bonus) break; MM.fill(g, (1 - k) * 0.9); g.fillRect(x + 200 + Math.cos(i * 2.4) * 220 * k, -200 - Math.sin(i * 1.7) * 160 * k - k * 80, 7, 7); }
  MM.pill(g, 'BONUS?', x + 200, -330, win(t, T.bonus - 0.2, null), 22, true);
  MM.label(g, 'A REWARD FOR DOING TAXES', x, 60, win(t, T.reward - 0.2, null), 20);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, 'RICHARD THALER · NOBEL PRIZE 2017', x, -640, win(t, T.but1, null), 20);
  MM.build(g, t, T.mental - 0.4, x, -560, 240, (g2, a) => MM.big(g2, 'MENTAL ACCOUNTS', x, -555, a, 58), 0.8);
  const bx = [x - 300, x + 300], names = ['SALARY', 'WINDFALLS'];
  for (let i = 0; i < 2; i++) {
    const a = p(t, T.but1 + 0.1 + i * 0.3, 0.6), glow = i === 1 ? p(t, T.easier - 0.3, 0.6) : 0;
    if (glow) MM.halo(g, bx[i], -200, 300, glow);
    MM.rr(g, bx[i] - 190, -400, 380, 340, 26); MM.fill(g, (0.04 + 0.25 * glow) * a); g.fill(); MM.stroke(g, a, 3); g.stroke();
    MM.label(g, names[i], bx[i], -360, a, 22, { weight: 800 });
  }
  for (let i = 0; i < 8; i++) { const ts = T.salary1 + i * 0.15; if (t > ts) MM.rr(g, bx[0] - 70, -90 - i * 14 - 8, 140, 12, 6), MM.fill(g, 0.9), g.fill(); }
  MM.build(g, t, T.gifts - 0.2, bx[1] - 90, -190, 50, (g2, a) => MM.box(g2, bx[1] - 90, -190, 0.6, a, true));
  MM.build(g, t, T.windfalls - 0.3, bx[1] + 80, -200, 60, (g2, a) => MM.cheque(g2, bx[1] + 80, -150, 0.4, a, '$$$'));
  MM.label(g, 'EASY TO SPEND', bx[1], 10, win(t, T.easier - 0.2, null), 22);
  MM.label(g, 'CAREFUL', bx[0], 10, win(t, T.easier, null), 18, { v: 160 });
}
function zoneD(g, t) {
  const x = D;
  // 12 monthly paychecks, each loses $250 to the government
  for (let i = 0; i < 12; i++) {
    const px = x - 640 + (i % 6) * 150, py = -470 + Math.floor(i / 6) * 170, ts = T.imagine1 - 0.2 + i * 0.12;
    MM.build(g, t, ts, px + 60, py + 50, 40, (g2, a) => { MM.rr(g2, px, py, 120, 100, 12); MM.stroke(g2, a, 2.5); g2.stroke(); MM.label(g2, 'PAY', px + 60, py + 30, a, 14); });
    const k = clamp((t - (T.withheld + i * 0.18)) / 0.8);
    if (k > 0 && k < 1) MM.coin(g, lerp(px + 60, x + 450, inOut(k)), lerp(py + 70, -230, inOut(k)) - Math.sin(Math.PI * k) * 120, 14, 1);
    if (t > T.withheld + i * 0.18) MM.label(g, '−$250', px + 60, py + 70, 1, 14, { weight: 800, track: 0 });
  }
  MM.build(g, t, T.d250 - 0.3, x + 450, -200, 160, (g2, a) => { MM.stroke(g2, a, 3); g2.beginPath(); g2.moveTo(x + 280, -280); g2.lineTo(x + 450, -380); g2.lineTo(x + 620, -280); g2.closePath(); g2.stroke(); for (let i = 0; i < 4; i++) g2.strokeRect(x + 305 + i * 85, -270, 35, 220); g2.strokeRect(x + 270, -50, 360, 20); });
  MM.label(g, 'GOVERNMENT', x + 450, 20, p(t, T.government - 0.3, 0.4), 18);
  MM.big(g, MM.money(3000 * clamp((t - T.withheld) / (T.d3000 - T.withheld + 0.3))), x - 270, -60, p(t, T.withheld, 0.4), 64);
  MM.label(g, 'PER YEAR', x - 270, 0, p(t, T.d3000, 0.4), 18);
  MM.pill(g, '0% INTEREST', x + 450, -460, win(t, T.zero - 0.3, null), 22, true);
}
function zoneE(g, t) {
  const x = E2;
  const ck = p(t, T.then - 0.1, 0.6);
  MM.cheque(g, x - 250, -260 - 200 * (1 - out(ck)), 1.6, ck, '$3,000', true);
  MM.pill(g, 'FEELS LIKE A GIFT', x - 250, -470, win(t, T.gift - 0.3, null), 20, true);
  const dk = p(t, T.disappears - 0.2, 1.2);
  for (let i = 0; i < 14; i++) { const k = clamp(dk * 1.6 - i * 0.04); if (k <= 0 || k >= 1) continue; MM.coin(g, lerp(x - 150, x + 420, k), -260 + Math.sin(i * 1.3) * 110 * k - Math.sin(Math.PI * k) * 80, 14, 1 - k * 0.3); }
  MM.build(g, t, T.disappears, x + 420, -200, 110, (g2, a) => MM.cart(g2, x + 420, -120, 1.5, a));
  MM.label(g, 'THINGS YOUR SALARY WOULD NEVER BUY', x, 40, win(t, T.salary2 - 1.0, null), 20);
}
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.this1 - 0.2, x - 300, -260, 150, (g2, a) => MM.bill(g2, x - 300, -260, 1.4, a * (t > T.cheap ? 0.45 : 1), '$1'));
  MM.build(g, t, T.this1 + 0.1, x + 300, -260, 150, (g2, a) => MM.bill(g2, x + 300, -260, 1.4, a, '$1', t > T.precious));
  MM.label(g, 'CHEAP', x - 300, -90, win(t, T.cheap, null), 26, { weight: 800 });
  MM.label(g, 'PRECIOUS', x + 300, -90, win(t, T.precious, null), 26, { weight: 800 });
  MM.label(g, 'SAME DOLLAR', x, -480, win(t, T.this1 + 0.4, null), 22);
}
function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.build(g, t, T.course - 0.2, x - 250, -100, 120, (g2, a) => MM.cheque(g2, x - 250, -150, 1.0, a, '$3,000'));
  MM.jar(g, x + 300, 0, 1.4, p(t, T.course, 0.5), clamp((t - T.forced + 0.6) / 1.5) * 0.8);
  MM.path(g, [[x - 40, -150], [x + 180, -150]], p(t, T.forced - 0.4, 0.6), 1, 3, true);
  MM.pill(g, 'FORCED SAVING ✓', x + 300, -330, win(t, T.forced - 0.2, null), 20, true);
  MM.label(g, "A REFUND ISN'T BAD", x, 60, win(t, T.course + 0.3, null), 20);
}
function zoneH(g, t) {
  const x = H;
  // envelope = regular paycheck
  const ea = p(t, T.but2, 0.5);
  MM.rr(g, x + 50, -420, 520, 300, 18); MM.stroke(g, ea, 3); g.stroke();
  MM.stroke(g, ea, 3); g.beginPath(); g.moveTo(x + 50, -420); g.lineTo(x + 310, -250); g.lineTo(x + 570, -420); g.stroke();
  MM.label(g, 'REGULAR PAYCHECK', x + 310, -80, p(t, T.regular - 0.3, 0.4), 18);
  const mk = inOut(clamp((t - T.regular + 0.6) / 1.2));
  MM.build(g, t, T.but2 + 0.2, x - 380, -270, 120, (g2, a) => MM.cheque(g2, lerp(x - 380, x + 310, mk), lerp(-270, -300, mk), lerp(1.1, 0.7, mk), a, 'WINDFALL'));
  MM.pill(g, 'WOULD YOU SPEND IT THE SAME WAY?', x, -560, win(t, T.would - 0.2, null), 22, true);
  MM.label(g, 'TRY THIS', x - 380, -430, win(t, T.but2 + 0.3, T.regular), 20);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
