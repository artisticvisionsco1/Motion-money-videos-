// 07 — The first $10,000 is harder than the next $100,000
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  k10a: w('$10,000', 1), k100a: w('$100,000', 1), most1: w('most', 1), straight1: w('straight', 1), every: w('every', 1),
  but1: w('but', 1), straight2: w('straight', 2), imagine: w('imagine'), d300: w('$300'), three: w('three'), k10b: w('10,000', 1),
  painfully: w('painfully'), slow: w('slow'), invested: w('invested'), r8a: w('8%', 1), k10c: w('$10,000', 2), d800: w('$800'), barely: w('barely'),
  but2: w('but', 2), k100b: w('$100,000', 2), k8: w('$8,000'), lifting: w('lifting'), money2: w('money', 2), work: w('work'),
  interest: w('interest'), earn: w('earn'), save: w('save'), no: w('no'), habits: w('habits'), step: w('step'),
  this1: w('this'), quit: w('quit'), journey: w('journey'), slowest: w('slowest'),
  course: w('course'), risk: w('risk'), guaranteed: w('guaranteed'),
  but3: w('but', 3), middle: w('middle'), beginning: w('beginning'),
  because: w('because'), money3: w('money', 3), proof1: w('proof', 1), proof2: w('proof', 2), possible: w('possible'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000;
const OPEN = { x: -20, y: -280, z: 1.22 };
const F_ = (t, x, y, z, d = 0.9) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most1 - 0.45, B, -260, 1.05),
  F_(T.imagine - 0.45, C, -260, 1.3),
  F_(T.invested - 0.45, D - 330, -260, 1.4),
  { t: T.but2 - 0.1, d: 0.8, x: D + 260, y: -300, z: 1.15 },
  F_(T.interest - 0.45, E2, -300, 1.15),
  F_(T.this1 - 0.45, F, -280, 1.1),
  F_(T.course - 0.45, G, -260, 1.25),
  F_(T.but3 - 0.45, -380, -200, 1.7),
  { t: T.because - 0.2, d: 0.8, x: -300, y: -230, z: 1.45 },
  { t: T.possible - 1.0, d: 1.0, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

// mountain profile shared by A and F
const HILL = (x0) => [[x0 - 700, 0], [x0 - 260, -430], [x0 + 650, -540]];
function hill(g, x0, k, a = 1) { MM.path(g, HILL(x0), k, a, 4, k < 1); }
function onHill(x0, u) { // u 0..1 along the steep part
  const [p0, p1] = HILL(x0); return [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u)];
}

// ---------- A: the climb (hook, beginning, ending) ----------
function zoneA(g, t) {
  const x = A;
  hill(g, x, p(t, -0.5, 1.2));
  const late = t > T.but3 - 0.5;
  // flags
  MM.build(g, t, T.k10a - 0.3, x - 260, -500, 80, (g2, a) => MM.flag(g2, x - 260, -430, 150, a, '$10K', late && t > T.proof1 ? 0 : 0.8));
  MM.build(g, t, T.k100a - 0.3, x + 640, -620, 80, (g2, a) => MM.flag(g2, x + 640, -540, 150, a, '$100K', p(t, T.possible - 0.3, 0.8)));
  MM.label(g, 'STEEP', x - 520, -150, win(t, 1.6, T.most1), 18);
  MM.label(g, 'GENTLE', x + 200, -540, win(t, T.k100a, T.most1), 18);
  // climber: slow on the steep part
  const u = late ? 0.04 : clamp((t - 0.2) / 30) * 0.3;
  const [px, py] = onHill(x, u);
  MM.person(g, px, py, 0.9, 1, true, t > T.proof1 ? 'up' : 'stand');
  if (late) {
    const bk = p(t, T.beginning - 0.3, 0.7);
    MM.beam(g, [[px - 60, -900], [px + 60, -900], [px + 180, py + 20], [px - 180, py + 20]], bk);
    MM.pill(g, 'THE BEGINNING', px + 40, py - 260, win(t, T.beginning, T.because + 0.5), 20, true);
    MM.pill(g, 'NOT THE MIDDLE', x + 200, -640, win(t, T.middle - 0.2, T.beginning), 18);
    // proof badge
    MM.build(g, t, T.proof1 - 0.2, px, py - 80, 40, (g2, a) => { MM.halo(g2, px, py - 80, 80, a); MM.label(g2, 'PROOF', px, py - 230, a, 22, { weight: 800 }); });
  }
}

// ---------- B: straight line vs curve ----------
function zoneB(g, t) {
  const x = B;
  MM.path(g, [[x - 700, 60], [x - 700, -620]], p(t, T.most1 - 0.2, 0.6), 0.7, 2.5, false);
  MM.path(g, [[x - 700, 60], [x + 700, 60]], p(t, T.most1 - 0.2, 0.6), 0.7, 2.5, false);
  const bend = inOut(clamp((t - T.but1 + 0.1) / 1.4));
  const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; const lin = u, ex = (Math.pow(12, u) - 1) / 11; pts.push([x - 700 + u * 1400, 60 - lerp(lin, ex, bend) * 680]); }
  MM.path(g, pts, p(t, T.most1 - 0.1, 2.0), 1, 5, true);
  // identical steps under the straight line
  for (let i = 0; i < 6; i++) { const a = p(t, T.every + i * 0.12, 0.3) * (1 - bend); const sx = x - 650 + i * 230; MM.stroke(g, a, 2.5); g.strokeRect(sx, 60 - (i + 1) * 100, 60, 30); }
  MM.pill(g, 'STRAIGHT LINE?', x - 300, -500, win(t, T.most1 + 0.3, T.but1), 20);
  MM.person(g, x - 760, 60, 0.9, p(t, T.most1, 0.4) * (1 - p(t, T.but1, 0.5)), true);
  MM.label(g, 'SAME EFFORT PER DOLLAR', x - 300, -440, win(t, T.every, T.but1), 18);
  MM.pill(g, 'IT CURVES', x + 380, -640, win(t, T.straight2, null), 22, true);
  MM.ripple(g, x + 700, -620, t, T.straight2 + 0.3, 40, 300, 0.9);
}

// ---------- C: $300 a month, painfully slow ----------
function zoneC(g, t) {
  const x = C;
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  const fill = clamp((t - T.d300) / (T.k10b - T.d300 + 0.3));
  MM.build(g, t, T.imagine - 0.2, x - 280, -120, 140, (g2, a) => MM.jar(g2, x - 280, 0, 1.6, a, fill));
  MM.label(g, '$300 / MONTH', x - 280, 50, p(t, T.d300, 0.4), 22, { weight: 800 });
  for (let i = 0; i < 18; i++) { const ts = T.d300 + 0.3 + i * 0.27, k = clamp((t - ts) / 0.45); if (k <= 0 || k >= 1) continue; MM.coin(g, x - 280, lerp(-560, -160, k * k), 16, 1); }
  // month counter + big total
  const months = Math.min(33, Math.floor(33 * fill));
  MM.big(g, String(months), x + 300, -420, p(t, T.d300 + 0.2, 0.4), 120);
  MM.label(g, 'MONTHS', x + 300, -330, p(t, T.d300 + 0.3, 0.4), 22);
  MM.big(g, MM.money(9900 * fill), x + 300, -200, p(t, T.d300 + 0.3, 0.4), 60);
  MM.pill(g, '≈ 3 YEARS', x + 300, -560, win(t, T.three, null), 20, true);
  // painfully slow loading bar
  const lk = p(t, T.painfully - 0.3, 0.4);
  if (lk > 0) { MM.rr(g, x + 80, -90, 440, 30, 15); MM.stroke(g, lk, 2.5); g.stroke(); const f = 0.12 + 0.04 * Math.sin(t * 2); MM.rr(g, x + 84, -86, 432 * f, 22, 11); MM.fill(g, lk); g.fill(); }
  MM.label(g, 'PAINFULLY SLOW', x + 300, -30, win(t, T.slow - 0.1, null), 20);
}

// ---------- D: seed vs tree ----------
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 750, x + 800, 0, 0.6);
  const lx = x - 330, rx = x + 330;
  MM.tree(g, lx, 0, 1, p(t, T.invested - 0.2, 0.5), 0.12 + 0.03 * Math.sin(t * 2));
  MM.big(g, '$10,000', lx, 90, p(t, T.k10c - 0.2, 0.4), 40);
  MM.pill(g, '+$800 / YEAR', lx, -230, win(t, T.d800 - 0.2, null), 20, true);
  MM.label(g, 'BARELY NOTICEABLE', lx, -300, win(t, T.barely, null), 18);
  const tk = out(clamp((t - T.k100b + 0.3) / 1.6));
  MM.tree(g, rx, 0, 1.25, p(t, T.but2, 0.4), tk);
  MM.big(g, '$100,000', rx, 90, p(t, T.k100b, 0.4), 40);
  MM.pill(g, '+$8,000 / YEAR', rx, -620, win(t, T.k8 - 0.2, null), 22, true);
  for (let i = 0; i < 14; i++) { const ts = T.k8 + 0.2 + i * 0.28, k = clamp((t - ts) / 1.2); if (k <= 0 || k >= 1) continue; MM.coin(g, rx - 160 + ((i * 53) % 320), lerp(-480, -10, k), 13, Math.sin(Math.PI * k)); }
  MM.person(g, rx + 230, 0, 0.9, p(t, T.lifting - 0.3, 0.4), true, 'rest');
  MM.pill(g, 'YOUR MONEY WORKS', rx + 60, 160, win(t, T.money2, null), 18);
}

// ---------- E: habits make steps easier ----------
function zoneE(g, t) {
  const x = E2;
  // 'not only interest': % builds then makes way for the habits
  MM.build(g, t, T.interest - 0.6, x, -330, 220, (g2, a) => MM.big(g2, '%', x, -330, a * (1 - p(t, T.earn - 0.4, 0.5)), 260), 0.8);
  MM.pill(g, 'NOT ONLY INTEREST', x, -120, win(t, T.interest - 0.2, T.earn - 0.3), 22);
  const words = ['EARN', 'SAVE', 'SAY NO'], ts = [T.earn, T.save, T.no];
  for (let i = 0; i < 3; i++) MM.build(g, t, ts[i] - 0.3, x - 420 + i * 420, -620, 70, (g2, a) => MM.pill(g2, words[i], x - 420 + i * 420, -620, a, 26, true), 0.6);
  // stairs: steps get lower as habits build
  const sk = p(t, T.habits - 0.3, 0.9);
  const pts = [[x - 650, 0]]; let y = 0, sx = x - 650;
  for (let i = 0; i < 6; i++) { const h = 150 - i * 22; y -= h; pts.push([sx, y]); sx += 210; pts.push([sx, y]); }
  MM.path(g, pts, sk, 0.9, 3, true);
  const climb = clamp((t - T.step + 0.6) / 2.5), e = climb * climb;
  const idx = Math.min(5, Math.floor(e * 6)), frac = e * 6 - idx;
  const hy = -[150, 128, 106, 84, 62, 40].slice(0, idx + 1).reduce((s, v) => s + v, 0);
  MM.person(g, x - 545 + idx * 210 + frac * 120, hy - Math.sin(Math.PI * frac) * 30, 0.8, sk, true);
  MM.label(g, 'EACH STEP GETS EASIER', x + 420, 60, win(t, T.step - 0.2, null), 20);
}

// ---------- F: most people quit early ----------
function zoneF(g, t) {
  const x = F;
  hill(g, x, p(t, T.this1 - 0.2, 0.9), 0.9);
  for (let i = 0; i < 12; i++) {
    const quitter = i % 4 !== 0;
    const bx = x - 660 + (i % 6) * 62 + Math.floor(i / 6) * 30, by = -Math.floor(i / 6) * 0;
    const q = quitter ? p(t, T.quit + i * 0.06, 0.8) : 0;
    const wx = bx - 260 * q;
    g.save(); g.translate(wx, by - 2); g.scale(0.62, 0.62); MM.person(g, 0, 0, 1, (1 - q) * p(t, T.this1 + i * 0.04, 0.4), !quitter); g.restore();
  }
  MM.pill(g, 'MOST QUIT HERE', x - 560, -230, win(t, T.quit, null), 18, true);
  // magnifier on the steep part
  const mk = p(t, T.slowest - 0.3, 0.6);
  if (mk > 0) { const [mx, my] = onHill(x, 0.4); MM.stroke(g, mk, 4); g.beginPath(); g.arc(mx, my, 110, 0, 7); g.stroke(); g.beginPath(); g.moveTo(mx + 78, my + 78); g.lineTo(mx + 160, my + 160); g.stroke(); }
  MM.label(g, 'JUDGED BY ITS SLOWEST PART', x + 150, -650, win(t, T.journey, null), 22);
}

// ---------- G: risk ----------
function zoneG(g, t) {
  const x = G;
  const dip = p(t, T.risk, 0.6);
  const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([x - 650 + u * 1300, -60 - 480 * ((Math.pow(10, u) - 1) / 9) + Math.sin(u * 30) * 18 * dip + (u > 0.55 && u < 0.7 ? 120 * dip * Math.sin((u - 0.55) / 0.15 * Math.PI) : 0)]); }
  MM.path(g, pts, p(t, T.course - 0.2, 1.2), 1, 4, true);
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  MM.pill(g, 'RISK', x + 50, -280, win(t, T.risk, null), 22);
  MM.pill(g, 'NOT GUARANTEED', x - 300, -560, win(t, T.guaranteed - 0.3, null), 20, true);
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
    if (near(G)) zoneG(g, t);
  },
};
