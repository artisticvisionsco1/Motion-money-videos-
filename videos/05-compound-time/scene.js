// 05 — $200 a month → almost $700,000 (compound growth, cost of waiting, rule of 72)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  d200a: w('$200', 1), k700a: w('700,000', 1), most1: w('most', 1), getting: w('getting'), rich: w('rich'), salary: w('salary'), lucky: w('lucky'),
  but1: w('but', 1), powerful: w('powerful'), boring: w('boring'), time: w('time'),
  imagine1: w('imagine', 1), d200b: w('$200', 2), age: w('age'), y65: w('65'), k96: w('$96,000'), own: w('own'),
  r8a: w('8%', 1), ret1: w('return', 1), k698: w('698,000'), seven: w('seven'),
  now: w('now'), starting: w('starting'), y35: w('35'), same: w('same'), k298: w('$298,000'), less: w('less'), half: w('half'),
  those: w('those'), k400: w('$400,000'),
  this1: w('this'), slow: w('slow'), unstoppable: w('unstoppable'), r8b: w('8%', 2), doubles: w('doubles'), nine: w('nine'),
  rule: w('rule'), divide: w('divide'), double: w('double'),
  course: w('course'), guaranteed: w('guaranteed'), markets: w('markets'), straight: w('straight'),
  but2: w('but', 2), rewards: w('rewards'), starts: w('starts'), earns: w('earns'),
  automatic: w('automatic'), transfer: w('transfer'), small1: w('small', 1),
  because: w('because'), d200d: w('$200', 4), small2: w('small', 2), k700b: w('700,000', 2), hasnt: w("hasn't"),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const r = 0.08 / 12;
const FV = months => months <= 0 ? 0 : 200 * ((1 + r) ** months - 1) / r;

const A = 0, B = 5000, C = 10000, E2 = 15000, F = 20000, G = 25000;
const OPEN = { x: 40, y: -300, z: 0.88 };
const F_ = (t, x, y, z, d = 0.9) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most1 - 0.45, B - 60, -250, 1.1),
  F_(T.imagine1 - 0.45, C + 60, -300, 0.9),
  { t: T.those - 0.2, d: 0.8, x: C + 260, y: -330, z: 1.12 },
  F_(T.this1 - 0.45, E2, -280, 1.25),
  { t: T.rule - 0.3, d: 0.8, x: E2 + 100, y: -420, z: 1.15 },
  F_(T.course - 0.45, F + 60, -260, 1.0),
  F_(T.automatic - 0.6, G, -240, 1.45),
  F_(T.because - 0.45, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

// chart mapping (age 25..65 → x, value 0..720k → y)
function chart(x0) {
  const X = age => x0 - 650 + (age - 25) / 40 * 1300;
  const Y = v => -v / 720000 * 560;
  return { X, Y };
}
function curvePts(X, Y, startAge, p) {
  const pts = []; const endAge = startAge + (65 - startAge) * p;
  for (let a = startAge; a <= endAge + 1e-6; a += 0.5) pts.push([X(a), Y(FV((a - startAge) * 12))]);
  return pts;
}

// ---------- A: hook / ending ----------
function zoneA(g, t) {
  const x = A, { X, Y } = chart(x);
  const end = t > T.because - 0.5;
  MM.build(g, t, -0.4, X(25) + 10, -60, 70, (g2, a) => MM.coin(g2, X(25) + 10, -60, 44, a));
  MM.label(g, '$200 / MONTH', X(25) + 10, 30, p(t, 0.2, 0.4), 22);
  const k = end ? 1 : out(clamp((t - 0.6) / (T.k700a - 0.4)));
  const pts = curvePts(X, Y, 25, Math.max(0.01, k));
  if (end) { g.setLineDash([16, 12]); MM.path(g, pts, 1, 0.9, 5, false); g.setLineDash([]); }
  else MM.path(g, pts, 1, 1, 5, true);
  const tip = pts[pts.length - 1];
  MM.big(g, MM.money(FV((tip ? (k * 40) : 0) * 12)), X(65) - 120, -620, 1, 84);
  MM.ripple(g, X(65), Y(FV(480)), t, T.k700a + 0.3, 40, 300, 0.9);
  MM.ground(g, X(25) - 60, X(65) + 60, 0, 0.6);
  if (end) MM.label(g, "THAT HASN'T HAPPENED YET", x, 90, win(t, T.hasnt - 0.4, null), 26);
}

// ---------- B: salary / luck vs time ----------
function zoneB(g, t) {
  const x = B;
  const dimK = p(t, T.but1, 0.6);
  // "Most people think getting rich needs…": a person thinking, fills the frame before the options appear
  MM.build(g, t, T.most1 - 0.25, x - 40, -80, 120, (g2, a) => MM.person(g2, x - 40, 0, 1.15, a * (1 - 0.6 * dimK), true), 0.7);
  for (let i = 0; i < 3; i++) { const a = p(t, T.most1 + 0.4 + i * 0.15, 0.3) * (1 - dimK); MM.stroke(g, a, 2.5); g.beginPath(); g.arc(x + 10 + i * 45, -200 - i * 38, 7 + i * 4, 0, 7); g.stroke(); }
  MM.pill(g, 'GETTING RICH NEEDS…', x - 40, -400, win(t, T.getting - 0.2, T.but1), 22);
  MM.big(g, '?', x - 40, -500, win(t, T.rich, T.salary) * (0.8 + 0.2 * Math.sin(t * 8)), 90);
  MM.ground(g, x - 650, x + 650, 0, 0.6 * p(t, T.most1 - 0.2, 0.6));
  MM.build(g, t, T.salary - 0.3, x - 420, -300, 110, (g2, a) => MM.briefcase(g2, x - 420, -300, 1.4, a * (1 - 0.7 * dimK)));
  MM.label(g, 'BIG SALARY', x - 420, -150, p(t, T.salary, 0.4) * (1 - 0.7 * dimK), 20);
  MM.build(g, t, T.lucky - 0.3, x - 420, -470 + 380, 90, (g2, a) => { MM.dice(g2, x - 470, -40, 1, a * (1 - 0.7 * dimK), 5, 0.2 + t * 0.3 * (1 - dimK)); MM.dice(g2, x - 360, -40, 1, a * (1 - 0.7 * dimK), 3, -0.3 - t * 0.2 * (1 - dimK)); });
  MM.label(g, 'ONE LUCKY BET', x - 420, 50, p(t, T.lucky, 0.4) * (1 - 0.7 * dimK), 20);
  // TIME: hourglass + clock assemble big
  MM.build(g, t, T.powerful - 0.2, x + 300, -230, 200, (g2, a) => MM.hourglass(g2, x + 300, -230, 2.6, a, clamp((t - T.powerful) / 8)), 0.9);
  MM.pill(g, 'BORING', x + 300, -460, win(t, T.boring, T.time), 20);
  MM.build(g, t, T.time - 0.3, x + 300, -460, 160, (g2, a) => MM.big(g2, 'TIME', x + 300, -460, a, 84), 0.7);
  MM.ripple(g, x + 300, -230, t, T.time + 0.3, 80, 500, 1.1);
}

// ---------- C: the live calculator chart ----------
function zoneC(g, t) {
  const x = C, { X, Y } = chart(x);
  const ak = p(t, T.imagine1 - 0.2, 0.8);
  MM.path(g, [[X(25), Y(720000)], [X(25), 0], [X(65), 0]], ak, 0.8, 2.5, false);
  for (const age of [25, 35, 45, 55, 65]) MM.label(g, String(age), X(age), 36, p(t, T.age - 0.3 + (age - 25) / 80, 0.4), 18);
  MM.label(g, 'AGE', X(65) + 70, 36, p(t, T.age, 0.4), 16);
  // contributions: straight line ($200 x months)
  const ck = clamp((t - T.d200b) / (T.k96 - T.d200b + 0.4));
  const cEnd = 25 + 40 * ck;
  if (ck > 0) {
    g.setLineDash([10, 10]); MM.path(g, [[X(25), 0], [X(cEnd), Y(200 * (cEnd - 25) * 12)]], 1, 0.7, 3, false); g.setLineDash([]);
  }
  // monthly deposits: coins drop onto the tip of the contributions line
  for (let i = 0; i < 24; i++) {
    const ts = T.d200b + i * 0.2, k = clamp((t - ts) / 0.5); if (k <= 0 || k >= 1) continue;
    const age = 25 + 40 * clamp((ts + 0.5 - T.d200b) / (T.k96 - T.d200b + 0.4));
    MM.coin(g, X(age), lerp(-520, Y(200 * (age - 25) * 12) - 20, k * k), 13, 1 - k * 0.3);
  }
  MM.big(g, MM.money(96000 * ck), X(45), -40, p(t, T.k96 - 0.3, 0.4), 40);
  MM.label(g, 'YOUR MONEY', X(45), 10, p(t, T.own, 0.4), 16);
  MM.pill(g, '8% / YEAR', X(25) + 150, Y(650000), win(t, T.r8a, null), 22, true);
  // growth curve from 25, live tip readout
  const gk = inOut(clamp((t - T.ret1 + 0.3) / (T.k698 - T.ret1 + 0.8)));
  if (gk > 0) {
    const pts = curvePts(X, Y, 25, gk); MM.path(g, pts, 1, 1, 5, gk < 1);
    const age = 25 + 40 * gk, val = FV((age - 25) * 12), tip = pts[pts.length - 1];
    if (gk < 1) { MM.label(g, `AGE ${Math.floor(age)}`, tip[0] - 10, tip[1] - 70, 1, 16); MM.big(g, MM.money(val), tip[0] - 10, tip[1] - 38, 1, 30); }
    else { MM.big(g, '$698,202', X(65) - 40, Y(698202) - 50, 1, 44); MM.label(g, 'START AT 25', X(65) - 40, Y(698202) - 100, 1, 16); }
  }
  MM.pill(g, '7.3 × WHAT YOU PUT IN', X(40), Y(520000), win(t, T.seven - 0.2, T.now), 20, true);
  // start at 35
  const lk = inOut(clamp((t - T.same + 0.2) / (T.k298 - T.same + 0.6)));
  MM.pill(g, 'START AT 35', X(35), Y(140000), win(t, T.y35 - 0.2, T.those), 20);
  if (lk > 0) {
    g.setLineDash([14, 10]);
    const pts = curvePts(X, Y, 35, lk); MM.path(g, pts, 1, 0.9, 4, false); g.setLineDash([]);
    if (lk >= 1) MM.big(g, '$298,072', X(65) - 40, Y(298072) + 50, 1, 36);
  }
  MM.pill(g, 'LESS THAN HALF', X(55), Y(330000), win(t, T.less - 0.2, T.those), 20, true);
  // the gap
  const gp = p(t, T.those - 0.1, 0.9);
  if (gp > 0) {
    const y1 = Y(298072), y2 = Y(698202), xx = X(65) + 60;
    MM.stroke(g, gp, 3); g.beginPath(); g.moveTo(xx, y1); g.lineTo(xx, lerp(y1, y2, gp)); g.stroke();
    g.beginPath(); g.moveTo(xx - 14, y1); g.lineTo(xx + 14, y1); g.moveTo(xx - 14, lerp(y1, y2, gp)); g.lineTo(xx + 14, lerp(y1, y2, gp)); g.stroke();
    MM.big(g, MM.money(400130 * out(clamp((t - T.k400 + 0.3) / 0.8))), xx + 170, (y1 + y2) / 2, p(t, T.k400 - 0.3, 0.4), 52);
    MM.label(g, 'COST OF WAITING 10 YEARS', xx + 170, (y1 + y2) / 2 + 50, p(t, T.k400 + 0.3, 0.4), 16);
  }
}

// ---------- E: slow then unstoppable, doubling, rule of 72 ----------
function zoneE(g, t) {
  const x = E2;
  // curve with a ball accelerating along it
  const X = a => x - 700 + (a - 25) / 40 * 600, Y = v => -v / 720000 * 420;
  const ck = p(t, T.this1 - 0.2, 0.9);
  const pts = curvePts(X, Y, 25, 1);
  MM.path(g, pts, ck, 0.8, 4, false);
  const bt = clamp((t - T.slow + 0.5) / (T.unstoppable - T.slow + 1.2)), bage = 25 + 40 * bt * bt;
  if (ck >= 1) { const bx = X(bage), by = Y(FV((bage - 25) * 12)); MM.halo(g, bx, by, 60, 1); MM.fill(g, 1); g.beginPath(); g.arc(bx, by - 14, 14, 0, 7); g.fill(); }
  MM.label(g, 'SLOW', X(32), -40, win(t, T.slow, null), 20);
  MM.label(g, 'UNSTOPPABLE', X(60) - 40, Y(560000), win(t, T.unstoppable, null), 20);
  MM.ground(g, x - 720, x + 760, 0, 0.5);
  // doubling blocks every 9 years
  const ys = ['9 YRS', '18 YRS', '27 YRS', '36 YRS'];
  for (let i = 0; i < 4; i++) {
    const bx = x + 120 + i * 170, h = 55 * 2 ** i;
    const k = MM.build(g, t, T.doubles - 0.4 + i * 0.35, bx, -h / 2, 70, (g2, a) => { MM.fill(g2, a * (0.25 + 0.75 * (i === 3))); g2.fillRect(bx - 50, -h, 100, h); MM.stroke(g2, a, 3); g2.strokeRect(bx - 50, -h, 100, h); });
    MM.label(g, ys[i], bx, 34, p(t, T.doubles + i * 0.35, 0.4), 16);
    MM.label(g, '×' + 2 ** i, bx, -h - 26, p(t, T.doubles + i * 0.35, 0.4), 20, { weight: 800, track: 0.05 });
  }
  MM.pill(g, 'DOUBLES EVERY ~9 YEARS', x + 375, -560, win(t, T.nine - 0.2, null), 20, true);
  // rule of 72 card
  const rk = p(t, T.rule - 0.3, 0.6);
  if (rk > 0) { MM.rr(g, x - 360, -830, 720, 170, 24); MM.fill(g, 0.05 * rk); g.fill(); MM.stroke(g, rk, 3); g.stroke(); }
  MM.label(g, 'THE RULE OF 72', x, -790, rk, 20);
  MM.typeText(g, '72 ÷ 8 = 9 YEARS', x, -720, clamp((t - T.divide + 0.1) / 1.6), 1, 58);
}

// ---------- F: not guaranteed, start first ----------
function zoneF(g, t) {
  const x = F;
  // zig-zag market line trending up
  const zz = []; for (let i = 0; i <= 16; i++) zz.push([x - 700 + i * 50, -120 - i * 18 + (i % 2 ? 50 : -30) * (i % 3 ? 1 : 0.4)]);
  MM.path(g, zz, p(t, T.course - 0.1, 1.4), 1, 4, true);
  MM.pill(g, 'NOT GUARANTEED', x - 300, -520, win(t, T.guaranteed - 0.2, null), 20);
  MM.label(g, 'NEVER A STRAIGHT LINE', x - 300, 40, win(t, T.straight - 0.3, null), 18);
  // two runners: early starter vs high earner
  MM.ground(g, x + 60, x + 760, 0, 0.6);
  const run1 = MM.walk(t, T.starts - 0.6, x + 140, x + 600, 2.2), run2 = MM.walk(t, T.earns - 0.2, x + 140, x + 380, 1.8);
  MM.person(g, run1.x, run1.bob, 0.85, p(t, T.but2, 0.4), true);
  MM.person(g, run2.x, run2.bob - 0, 0.85, p(t, T.but2 + 0.2, 0.4), false);
  MM.pill(g, 'STARTS FIRST', run1.x, -230, win(t, T.starts, null), 16, true);
  MM.coin(g, run2.x, -230, 26, p(t, T.earns, 0.4));
  MM.label(g, 'EARNS MORE', run2.x, 40, win(t, T.earns + 0.2, null), 16);
}

// ---------- G: automate it ----------
function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.build(g, t, T.automatic - 0.4, x - 300, -200, 160, (g2, a) => MM.phone(g2, x - 300, -200, 1.6, a, ''));
  const on = p(t, T.transfer, 0.4);
  MM.label(g, 'AUTO-INVEST', x - 300, -290, p(t, T.automatic, 0.4), 16);
  MM.rr(g, x - 345, -230, 90, 46, 23); MM.fill(g, 0.15 + 0.85 * on); g.fill(); MM.stroke(g, p(t, T.automatic, 0.4), 2.5); g.stroke();
  MM.fill(g, on > 0.5 ? 0 : 1); g.beginPath(); g.arc(lerp(x - 322, x - 278, on), -207, 17, 0, 7); g.fill();
  MM.label(g, '$200 / MO', x - 300, -130, p(t, T.transfer + 0.2, 0.4), 18, { weight: 800 });
  for (let i = 0; i < 10; i++) {
    const ts = T.transfer + 0.4 + i * 0.35, k = clamp((t - ts) / 0.7); if (k <= 0 || k >= 1) continue;
    const e = inOut(k); MM.coin(g, lerp(x - 220, x + 300, e), lerp(-200, -150, e) - Math.sin(Math.PI * e) * 160, 16, Math.sin(Math.PI * k));
  }
  MM.jar(g, x + 300, 0, 1.3, p(t, T.automatic, 0.5), clamp((t - T.transfer - 0.8) / 4));
  MM.pill(g, 'START SMALL', x, -520, win(t, T.small1 - 0.4, null), 22, true);
}

const SCENE = {
  duration: T.end,
  camera,
  draw(g, t, cam) {
    const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
    if (near(A)) zoneA(g, t);
    if (near(B)) zoneB(g, t);
    if (near(C)) zoneC(g, t);
    if (near(E2)) zoneE(g, t);
    if (near(F)) zoneF(g, t);
    if (near(G)) zoneG(g, t);
  },
};
