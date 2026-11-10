// 14 — Parkinson's law for money: spending grows to fill what you earn
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  fill1: w('fill', 1), earn1: w('earn', 1), y1955: w('1955'), parkinson: w('parkinson'), work: w('work'), expands: w('expands'), completion: w('completion'),
  task: w('task'), week2: w('week', 2), money1: w('money', 1), most: w('most'), save1: w('save', 1), but1: w('but', 1), paycheck: w('paycheck'), places: w('places'),
  food: w('food'), phone: w('phone'), subscriptions: w('subscriptions'), course: w('course'), fine: w('fine'),
  but2: w('but', 2), lying: w('lying'), move: w('move'), paid: w('paid'), left: w('left'), because: w('because'), room: w('room'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000;
const OPEN = { x: 0, y: -280, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.y1955 - 0.4, B, -280, 1.15), F_(T.money1 - 0.4, C, -280, 1.15), F_(T.course - 0.4, D, -270, 1.15),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

// container = income, liquid = spending, always rising to the brim
function container(g, x, w0, h0, a, fill, label) {
  MM.rr(g, x - w0 / 2, -h0, w0, h0, 18); MM.stroke(g, a, 3.5); g.stroke();
  const fh = (h0 - 12) * clamp(fill);
  if (fh > 0) { MM.rr(g, x - w0 / 2 + 6, -6 - fh, w0 - 12, fh, 12); MM.fill(g, a * 0.85); g.fill();
    MM.stroke(g, a, 2, 0); g.beginPath(); for (let i = 0; i <= 20; i++) { const xx = x - w0 / 2 + 6 + i * (w0 - 12) / 20; g.lineTo(xx, -6 - fh + Math.sin(i * 0.9 + performanceT * 4) * 4); } g.stroke(); }
  if (label) MM.label(g, label, x, 40, a, 18);
}
let performanceT = 0;
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  const grow = end ? 1 - 0.45 * p(t, T.room - 1.4, 1.0) : 1 + 0.5 * p(t, T.earn1 - 0.4, 0.8);
  const fill = end ? 0.55 + 0.35 * clamp((t - T.because) / 3) : clamp((t + 0.3) / 1.4) * (t > T.earn1 ? 0.6 + 0.4 * clamp((t - T.earn1) / 0.8) : 1);
  MM.build(g, t, -0.4, x - 200, -200, 200, (g2, a) => container(g2, x - 200, 300 * grow, 420 * grow, a, fill, 'WHAT YOU EARN'));
  MM.label(g, 'SPENDING', x + 230, -200, p(t, 0.3, 0.4), 22, { weight: 800 });
  MM.path(g, [[x + 120, -200], [x + 0, -200]], p(t, 0.4, 0.5), 0.9, 3, true);
  MM.pill(g, 'ALWAYS FULL', x - 200, -520 * grow - 40, win(t, T.fill1, T.y1955) , 20, true);
  if (end) MM.pill(g, 'LESS ROOM', x - 200, -300, win(t, T.room - 1.2, null), 22, true);
}
function zoneB(g, t) {
  const x = B;
  MM.pill(g, '1955 · C. NORTHCOTE PARKINSON', x, -660, win(t, T.y1955 - 0.2, null), 20);
  MM.typeText(g, 'WORK EXPANDS TO FILL', x, -560, clamp((t - T.parkinson + 0.3) / 1.6), 1, 48);
  MM.typeText(g, 'THE TIME AVAILABLE', x, -490, clamp((t - T.work + 0.2) / 1.6), 1, 48);
  // week calendar with a task bar stretching across it
  const ck = p(t, T.y1955 - 0.1, 0.7);
  for (let i = 0; i < 7; i++) { MM.rr(g, x - 560 + i * 160, -360, 140, 200, 14); MM.stroke(g, ck, 2.5); g.stroke(); MM.label(g, ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i], x - 490 + i * 160, -330, ck, 14); }
  const tk = inOut(clamp((t - T.task + 0.2) / 2.0));
  MM.rr(g, x - 550, -260, 120 + (1120 - 120) * tk, 70, 14); MM.fill(g, p(t, T.task - 0.3, 0.4)); g.fill();
  MM.label(g, 'ONE TASK', x - 490, -225, p(t, T.task - 0.3, 0.4), 16, { v: 0, weight: 800 });
  MM.pill(g, 'TAKES A WEEK', x, -60, win(t, T.week2 - 0.3, null), 22, true);
}
function zoneC(g, t) {
  const x = C;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.person(g, x - 560, 0, 1.0, p(t, T.money1 - 0.1, 0.4), true);
  MM.pill(g, "I'LL SAVE ONCE I EARN MORE", x - 450, -300, win(t, T.most - 0.2, T.but1 + 0.5), 18);
  const pk = p(t, T.paycheck - 0.3, 0.5), big = 1 + 0.5 * p(t, T.paycheck, 0.6);
  MM.build(g, t, T.money1 + 0.2, x - 150, -230, 140, (g2, a) => MM.cheque(g2, x - 150, -230, 0.9 * big, a, 'PAYCHECK', pk > 0.5));
  const dests = [[x + 300, -470, 'FOOD', T.food], [x + 380, -260, 'PHONE', T.phone], [x + 300, -60, 'SUBS', T.subscriptions]];
  dests.forEach(([dx, dy, lbl, ts], i) => {
    MM.path(g, [[x + 40, -230], [dx - 90, dy]], p(t, Math.min(ts, T.places + i * 0.3) - 0.3, 0.6), 0.8, 3, true);
    if (lbl === 'FOOD') MM.build(g, t, ts - 0.4, dx, dy, 90, (g2, a) => MM.plate(g2, dx, dy + 20, 0.8, a));
    if (lbl === 'PHONE') MM.build(g, t, ts - 0.4, dx, dy, 90, (g2, a) => MM.phone(g2, dx, dy, 0.7, a, ''));
    if (lbl === 'SUBS') MM.build(g, t, ts - 0.4, dx, dy, 80, (g2, a) => { for (let k = 0; k < 4; k++) { MM.rr(g2, dx - 50 + (k % 2) * 56, dy - 50 + Math.floor(k / 2) * 56, 44, 44, 10); MM.stroke(g2, a, 2.5); g2.stroke(); } });
    MM.label(g, lbl, dx + 130, dy, p(t, ts, 0.4), 18);
  });
  MM.label(g, 'NEW PLACES TO GO', x + 150, 60, win(t, T.places - 0.2, null), 20);
}
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.pill(g, 'SOME IS FINE ✓', x - 420, -560, win(t, T.course, null), 20);
  // payday: money moves out first
  const ck = p(t, T.course + 0.1, 0.5);
  MM.rr(g, x - 600, -420, 360, 300, 20); MM.stroke(g, ck, 3); g.stroke(); MM.label(g, 'PAYDAY', x - 420, -380, ck, 20, { weight: 800 });
  MM.coin(g, x - 420, -260, 48, ck);
  MM.label(g, "DON'T LEAVE IT LYING AROUND", x - 420, -60, win(t, T.lying - 0.4, null), 16);
  const mk = clamp((t - T.move + 0.2) / 1.6);
  for (let i = 0; i < 8; i++) { const k = clamp(mk * 1.6 - i * 0.08); if (k <= 0 || k >= 1) continue; const e = inOut(k); MM.coin(g, lerp(x - 380, x + 380, e), lerp(-260, -140, e) - Math.sin(Math.PI * e) * 160, 16, 1); }
  MM.jar(g, x + 380, 0, 1.4, p(t, T.but2 + 0.3, 0.5), mk * 0.7);
  MM.label(g, 'SAVED FIRST', x + 380, 40, p(t, T.move, 0.4), 20);
  MM.pill(g, "LIVE ON WHAT'S LEFT", x, -560, win(t, T.left - 0.4, null), 22, true);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  performanceT = t;
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
