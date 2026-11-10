// 12 — The 80/20 rule (Pareto)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  effort1: w('effort', 1), r80a: w('80%', 1), results1: w('results', 1), y1890: w('1890s'), pareto: w('pareto'), r20b: w('20%', 2), italy: w('italy'), r80b: w('80%', 2), land: w('land'),
  later: w('later'), everywhere: w('everywhere'), customers: w('customers'), revenue: w('revenue'), habits: w('habits'), health: w('health'), tasks: w('tasks'), income: w('income'),
  most4: w('most', 4), every: w('every'), but1: w('but', 1), rarely1: w('rarely', 1), imagine: w('imagine'), h50: w('50'), h10a: w('10', 1), value: w('value'), h40: w('40'), busy: w('busy'),
  double: w('double'), grow: w('grow'), longer: w('longer'),
  this1: w('this'), harder: w('harder'), right: w('right'), course: w('course'), law: w('law'), neat: w('neat'),
  but2: w('but', 2), list: w('list'), circle: w('circle'), money: w('money'), because: w('because'), which: w('which'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000;
const OPEN = { x: 0, y: -280, z: 1.25 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.y1890 - 0.6, B, -280, 1.2), F_(T.later - 0.4, C, -290, 1.15), F_(T.most4 - 0.4, D, -290, 1.1),
  F_(T.this1 - 0.4, E2, -260, 1.35), F_(T.course - 0.4, F, -280, 1.4), F_(T.but2 - 0.4, G, -280, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

// two stacked bars with a flow band: 20% of effort -> 80% of results
function zoneA(g, t) {
  const x = A, W = 1100, y1 = -520, y2 = -120, H = 70;
  const ak = p(t, -0.4, 0.6), bk = p(t, T.r80a - 0.4, 0.6);
  MM.rr(g, x - W / 2, y1, W, H, 14); MM.stroke(g, ak, 3); g.stroke();
  MM.rr(g, x - W / 2, y1, W * 0.2, H, 14); MM.fill(g, ak); g.fill();
  MM.label(g, 'EFFORT', x - W / 2 - 110, y1 + H / 2, ak, 20); MM.label(g, '20%', x - W / 2 + W * 0.1, y1 + H / 2, ak, 22, { v: 0, weight: 800, track: 0 });
  MM.rr(g, x - W / 2, y2, W, H, 14); MM.stroke(g, bk, 3); g.stroke();
  MM.rr(g, x - W / 2, y2, W * 0.8, H, 14); MM.fill(g, bk); g.fill();
  MM.label(g, 'RESULTS', x - W / 2 - 120, y2 + H / 2, bk, 20); MM.label(g, '80%', x - W / 2 + W * 0.4, y2 + H / 2, bk, 22, { v: 0, weight: 800, track: 0 });
  // flow band
  const fk = p(t, T.r80a - 0.2, 0.9);
  if (fk > 0) { const gr = g.createLinearGradient(0, y1 + H, 0, y2); gr.addColorStop(0, MM.col(0.35 * fk)); gr.addColorStop(1, MM.col(0.12 * fk)); g.fillStyle = gr;
    g.beginPath(); g.moveTo(x - W / 2, y1 + H); g.lineTo(x - W / 2 + W * 0.2, y1 + H); g.bezierCurveTo(x - W / 2 + W * 0.2, y1 + 220, x - W / 2 + W * 0.8, y2 - 150, x - W / 2 + W * 0.8, y2); g.lineTo(x - W / 2, y2); g.closePath(); g.fill(); }
  if (t > T.because - 0.5) MM.pill(g, 'WHICH 20%?', x, 40, win(t, T.which - 0.6, null), 26, true);
}
// Pareto's Italy: 10 people, 2 own most of the land
function zoneB(g, t) {
  const x = B;
  MM.pill(g, '1890s · VILFREDO PARETO', x, -660, win(t, T.y1890 - 0.2, null), 20);
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  for (let i = 0; i < 10; i++) { const rich = i < 2; MM.person(g, x - 560 + i * 125, 0, 0.85, p(t, T.y1890 + i * 0.08, 0.4), rich && t > T.r20b); }
  // land bar
  const lk = p(t, T.y1890 + 0.5, 0.8), W = 1200;
  MM.rr(g, x - W / 2, -440, W, 120, 16); MM.stroke(g, lk, 3); g.stroke();
  const share = 0.8 * p(t, T.r80b - 0.2, 0.8);
  MM.rr(g, x - W / 2, -440, W * Math.max(0.01, share), 120, 16); MM.fill(g, lk); g.fill();
  MM.label(g, 'LAND', x - W / 2 - 80, -380, lk, 20);
  MM.label(g, '80% OF THE LAND', x - W / 2 + W * 0.4, -380, p(t, T.r80b, 0.4), 22, { v: 0, weight: 800 });
  MM.label(g, '20% OF THE PEOPLE', x - 500, 60, p(t, T.r20b, 0.4), 18);
  MM.path(g, [[x - 500, -110], [x - 500, -320]], p(t, T.land - 0.3, 0.5), 0.8, 2.5, true);
}
// everywhere: customers, habits, tasks
function zoneC(g, t) {
  const x = C;
  MM.label(g, 'THE SAME PATTERN, EVERYWHERE', x, -680, win(t, T.later, null), 22);
  const rows = [['CUSTOMERS', 'REVENUE', T.customers], ['HABITS', 'HEALTH', T.habits], ['TASKS', 'INCOME', T.tasks]];
  rows.forEach(([a1, b1, ts], i) => {
    const y = -520 + i * 190, a = p(t, Math.min(ts, T.later + 0.3 + i * 0.4) - 0.2, 0.5);
    MM.label(g, a1, x - 560, y, a, 20, { weight: 800 });
    for (let j = 0; j < 10; j++) { MM.fill(g, a * (j < 2 ? 1 : 0.25)); g.beginPath(); g.arc(x - 420 + j * 34, y, 11, 0, 7); g.fill(); }
    const bk = p(t, ts + 0.3, 0.7);
    MM.path(g, [[x - 40, y], [x + 60, y]], bk, 0.9, 3, true);
    MM.rr(g, x + 100, y - 24, 420, 48, 12); MM.stroke(g, a, 2.5); g.stroke();
    MM.rr(g, x + 100, y - 24, 420 * 0.8 * bk, 48, 12); MM.fill(g, a); g.fill();
    MM.label(g, b1, x + 590, y, bk, 18);
  });
}
// 50 hours: 10 make the value
function zoneD(g, t) {
  const x = D;
  for (let i = 0; i < 50; i++) {
    const c = i % 10, r = Math.floor(i / 10), bx = x - 650 + c * 80, by = -560 + r * 80;
    const a = p(t, T.most4 - 0.3 + i * 0.02, 0.3);
    const valuable = [2, 7, 13, 18, 24, 31, 36, 39, 44, 47].includes(i);
    const lit = valuable ? p(t, T.value - 0.3, 0.5) : 0, dim = valuable ? 0 : p(t, T.busy - 0.3, 0.5);
    MM.rr(g, bx, by, 64, 64, 10); MM.fill(g, a * (0.05 + 0.9 * lit)); g.fill(); MM.stroke(g, a * (1 - 0.6 * dim), 2.5); g.stroke();
    if (lit > 0.5) MM.halo(g, bx + 32, by + 32, 60, lit * 0.6);
  }
  MM.label(g, '50 HOURS A WEEK', x - 290, -620, p(t, T.h50 - 0.3, 0.4), 22);
  MM.pill(g, 'SAME WORTH?', x - 290, -700, win(t, T.every - 0.2, T.but1 + 0.4), 20);
  MM.pill(g, '10 HOURS = MOST OF THE VALUE', x - 290, -700, win(t, T.value - 0.2, T.double), 20, true);
  MM.label(g, '40 HOURS OF BUSY WORK', x - 290, -120, win(t, T.busy - 0.2, null), 20);
  // results comparison
  const rk = p(t, T.double - 0.2, 0.6);
  const bx = x + 380, H = 520, hDouble = H * out(clamp((t - T.double) / 1.4)), hLonger = H * 0.28 * out(clamp((t - T.longer + 0.4) / 1.2));
  MM.rr(g, bx - 110, -60 - hDouble, 90, hDouble, 10); MM.fill(g, rk); g.fill();
  MM.rr(g, bx + 40, -60 - hLonger, 90, hLonger, 10); MM.stroke(g, rk, 3); g.stroke();
  MM.label(g, 'DOUBLE THE 10', bx - 65, -20, rk, 14); MM.label(g, 'WORK LONGER', bx + 85, -20, p(t, T.longer - 0.3, 0.4), 14);
}
function zoneE(g, t) {
  const x = E2;
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  MM.build(g, t, T.this1 - 0.2, x - 380, -20, 200, (g2, a) => MM.treadmill(g2, x - 380, 0, 1.1, a, t, 2));
  MM.person(g, x - 420, -2 - Math.abs(Math.sin(t * 9)) * 10, 0.95, p(t, T.this1, 0.4), false);
  MM.label(g, 'HARDER', x - 380, 70, win(t, T.harder - 0.2, null), 22, { weight: 800 });
  MM.build(g, t, T.right - 0.5, x + 330, -260, 170, (g2, a) => { for (let i = 3; i >= 1; i--) { MM.stroke(g2, a, 3); g2.beginPath(); g2.arc(x + 330, -260, i * 60, 0, 7); g2.stroke(); } MM.fill(g2, a); g2.beginPath(); g2.arc(x + 330, -260, 26, 0, 7); g2.fill(); MM.halo(g2, x + 330, -260, 220, a); });
  MM.label(g, 'THE RIGHT 20%', x + 330, 70, win(t, T.right, null), 22, { weight: 800 });
  MM.path(g, [[x + 80, -520], [x + 300, -280]], p(t, T.right + 0.2, 0.5), 1, 4, true);
}
function zoneF(g, t) {
  const x = F;
  const labels = ['80 / 20', '70 / 30', '90 / 10', '95 / 5', '80 / 20'];
  const k = t < T.law ? 0 : Math.min(4, Math.floor((t - T.law) * 2.5));
  MM.build(g, t, T.course - 0.2, x, -330, 260, (g2, a) => MM.big(g2, labels[k], x + Math.sin(t * 20) * (k % 4 ? 4 : 0), -330, a, 150), 0.7);
  MM.pill(g, 'NOT AN EXACT LAW', x, -120, win(t, T.law - 0.3, null), 22, true);
  MM.label(g, 'REAL NUMBERS ARE RARELY NEAT', x, -40, win(t, T.neat - 0.4, null), 18);
}
function zoneG(g, t) {
  const x = G;
  const ck = p(t, T.but2, 0.6);
  MM.rr(g, x - 360, -620, 720, 600, 24); MM.fill(g, 0.04 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke();
  MM.label(g, 'LAST WEEK', x, -570, ck, 20);
  for (let i = 0; i < 8; i++) { const ly = -500 + i * 60, lk = p(t, T.list - 0.4 + i * 0.12, 0.3); MM.stroke(g, lk, 2.5); g.strokeRect(x - 300, ly - 14, 28, 28); MM.path(g, [[x - 250, ly], [x - 250 + 380 + (i * 37) % 120, ly]], lk, 0.7, 3, false); }
  for (const i of [2, 5]) { const ly = -500 + i * 60, k = p(t, T.circle - 0.1 + (i === 5) * 0.3, 0.6); if (k > 0) { MM.stroke(g, 1, 4); g.beginPath(); g.ellipse(x, ly, 330, 34, 0, 0, 6.3 * k); g.stroke(); } MM.coin(g, x + 420, ly, 22, p(t, T.money - 0.3 + (i === 5) * 0.2, 0.4)); }
  MM.label(g, 'CIRCLE WHAT MADE MONEY', x, 20, win(t, T.circle, null), 20);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
