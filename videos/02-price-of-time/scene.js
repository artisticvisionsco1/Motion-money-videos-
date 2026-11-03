// 02 — Your salary is the price of your time
const { p, pl, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

// key times (verified against words.json)
const T = {
  value1: w('value', 1),      // not the value of it
  most: w('most'),
  paycheck: w('paycheck'),
  really: w('really'),
  but1: w('but', 1),
  company1: w('company', 1),
  so: w('so'),
  stay: w('stay.'),
  imagine1: w('imagine', 1),
  d25: w('$25'),
  work2: w('work', 2),        // "Work 40 hours"
  forty: w('40'),
  full: w('full'),
  k52: w('$52,000.'),
  now: w('now'),
  three: w('three'),
  your4: w('your', 4),        // "Your value didn't change"
  value2: w('value', 2),
  only1: w('only', 1),
  price2: w('price', 2),
  this1: w('this'),
  one: w('one'),
  hours1: w('hours', 2),
  other: w('other'),
  results: w('results.'),
  and3: w('and', 3),          // "And hours have a ceiling"
  ceiling: w('ceiling.'),
  there: w('there'),
  k2: w('2,000'),
  sell1: w('sell', 1),
  hour: w('hour', 2),
  twice: w('twice.'),
  of: w('of', 4),             // "Of course"
  pays: w('pays'),
  buys: w('buys'),
  but3: w('but', 2),          // "But the moment"
  difference: w('difference'),
  value3: w('value', 3),
  not2: w('not', 2),          // "Not how many"
  sell2: w('sell', 2),
  but4: w('but', 3),          // "but what result"
  result: w('result'),
  because: w('because'),
  your9: w('your', 10),        // "Your value is what you build"
  build: w('build'),
  end: 68.9,
};

// world zones
const A = 0, B = 2300, C = 4500, D = 6700, E2 = 9100, F = 11500, G = 14000, H = 16300, I = 18600, J = 20800;
const OPEN = { x: -40, y: -175, z: 1.89 };

const camera = [
  { ...OPEN },
  { t: T.value1 - 0.3, d: 0.8, x: 120, y: -260, z: 1.12 },
  { t: T.most - 0.2, d: 0.75, x: B, y: -250, z: 1.28 },
  { t: T.but1 - 0.15, d: 0.7, x: C, y: -230, z: 1.34 },
  { t: T.imagine1 - 0.2, d: 0.7, x: D - 150, y: -250, z: 1.34 },
  { t: T.work2 - 0.1, d: 0.7, x: D + 260, y: -260, z: 1.12 },
  { t: T.now - 0.2, d: 0.75, x: E2, y: -260, z: 1.22 },
  { t: T.your4 - 0.3, d: 0.5, cut: true, x: 120, y: -260, z: 1.12 },
  { t: T.only1 - 0.1, d: 0.6, x: 20, y: -170, z: 1.65 },
  { t: T.this1 - 0.2, d: 0.8, x: F, y: -250, z: 1.22 },
  { t: T.and3 - 0.05, d: 0.6, x: F - 60, y: -420, z: 1.1 },
  { t: T.there - 0.15, d: 0.7, x: G, y: -230, z: 1.16 },
  { t: T.of - 0.2, d: 0.7, x: H, y: -230, z: 1.28 },
  { t: T.but3 - 0.15, d: 0.75, x: I, y: -260, z: 1.16 },
  { t: T.not2 - 0.2, d: 0.7, x: J, y: -230, z: 1.34 },
  { t: T.because - 0.3, d: 0.5, cut: true, x: OPEN.x, y: OPEN.y, z: OPEN.z },
  { t: T.your9 - 0.15, d: 0.7, x: 120, y: -260, z: 1.12 },
  { t: T.end - 0.85, d: 0.8, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

// falling coin: spawn at time ts at (x,y0) falls to y1
function dropCoin(g, t, ts, x, y0, y1, r = 16) {
  if (t < ts) return;
  const k = clamp((t - ts) / 0.45);
  const y = lerp(y0, y1, k * k);
  if (k < 1) { MM.coin(g, x, y, r, Math.min(1, (t - ts) * 6)); return; }
  // landed: coin seen from the side (a slab in a stack)
  MM.rr(g, x - r * 1.35, y1 - 5, r * 2.7, 10, 5); MM.fill(g, 0.95); g.fill();
  MM.ripple(g, x, y1, t, ts + 0.45, 10, 50, 0.5);
}

function zoneA(g, t) {
  // ground
  MM.ground(g, -700, 900, 0, 0.7);
  // building (value) behind
  const bA = p(t, T.value1 - 0.1, 0.6);
  let glow = 0.35 + 0.25 * p(t, T.value2, 0.5) + 0.4 * p(t, T.build, 0.6);
  MM.building(g, 340, 0, 330, 560, bA, glow * bA);
  MM.pill(g, 'VALUE', 340, -620, Math.max(win(t, T.value1, T.most), win(t, T.value2, T.this1)) * bA, 20);
  MM.ripple(g, 340, -280, t, T.value2, 60, 420, 1.1);
  // beam from building to person
  MM.beam(g, [[175, -380], [175, -120], [-260, -10], [-260, -320]], bA * glow);
  // hero holding clock
  const pose = t > T.build ? 'up' : 'stand';
  MM.person(g, -140, 0, 1.15, 1, true, pose);
  const cx = 30, cy = -190;
  MM.clock(g, cx, cy, 56, 1, t, 0.6, true);
  // price tag swing
  let swing = 0.25 * Math.sin(t * 2.2) * Math.exp(-0.25 * (t % 30));
  const kick = clamp((t - T.only1) / 2.5);
  if (t > T.only1) swing += 0.55 * Math.sin((t - T.only1) * 7) * (1 - kick);
  let price = '$25 / HR';
  if (t > T.price2 && t < T.price2 + 1.6) price = ['$25 / HR', '$31 / HR', '$19 / HR', '$27 / HR'][Math.floor((t - T.price2) * 6) % 4];
  MM.tag(g, cx, cy + 56, 1, swing, price, 1);
  MM.pill(g, 'PRICE', -150, -360, Math.max(win(t, 0.4, T.value1 + 0.6), win(t, T.price2, T.this1)), 20);
  MM.label(g, 'YOUR VALUE IS WHAT YOU BUILD', 120, 80, win(t, T.build - 0.1, null, 0.5), 22);
}

function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.7);
  // scale
  MM.stroke(g, 1, 3);
  g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -330); g.moveTo(x - 70, 0); g.lineTo(x + 70, 0); g.stroke();
  const land = T.paycheck + 0.35;
  let ang = 0.18;
  if (t > land) ang = 0.18 * Math.cos((t - land) * 9) * Math.exp(-(t - land) * 3);
  if (t > T.but1) ang = lerp(ang, -0.22, p(t, T.but1, 0.8));
  const L = 230;
  const lx = x - Math.cos(ang) * L, ly = -330 - Math.sin(ang) * L * -1;
  const rx = x + Math.cos(ang) * L, ry = -330 - Math.sin(ang) * L;
  g.beginPath(); g.moveTo(lx, ly); g.lineTo(rx, ry); g.stroke();
  MM.fill(g, 1); g.beginPath(); g.arc(x, -330, 9, 0, 7); g.fill();
  for (const [px, py] of [[lx, ly], [rx, ry]]) {
    g.beginPath(); g.moveTo(px, py); g.lineTo(px - 70, py + 130); g.moveTo(px, py); g.lineTo(px + 70, py + 130); g.stroke();
    g.beginPath(); g.moveTo(px - 90, py + 130); g.quadraticCurveTo(px, py + 175, px + 90, py + 130); g.closePath(); g.stroke();
  }
  // paycheck lands on left pan
  const pa = p(t, T.paycheck - 0.2, 0.3);
  const py = lerp(ly - 400, ly + 95, out(clamp((t - T.paycheck + 0.2) / 0.55)));
  if (pa > 0) {
    MM.rr(g, lx - 70, py - 38, 140, 76, 8); MM.fill(g, 0.1 * pa); g.fill(); MM.stroke(g, pa, 3); g.stroke();
    MM.coin(g, lx - 38, py, 16, pa); MM.stroke(g, pa * 0.7, 3);
    g.beginPath(); g.moveTo(lx - 12, py - 10); g.lineTo(lx + 50, py - 10); g.moveTo(lx - 12, py + 10); g.lineTo(lx + 30, py + 10); g.stroke();
  }
  MM.label(g, 'PAYCHECK', lx, ly + 205, pa, 18);
  // worth weight on right pan
  const wa = p(t, T.most + 0.3, 0.5);
  if (wa > 0) {
    g.beginPath(); g.moveTo(rx - 55, ry + 128); g.lineTo(rx - 38, ry + 40); g.lineTo(rx + 38, ry + 40); g.lineTo(rx + 55, ry + 128); g.closePath();
    MM.fill(g, wa); g.fill(); MM.halo(g, rx, ry + 90, 150, wa * 0.7);
    MM.stroke(g, wa, 3); g.beginPath(); g.arc(rx, ry + 30, 12, 0, 7); g.stroke();
  }
  MM.label(g, 'WORTH', rx, ry + 205, wa, 18);
  MM.pill(g, 'PAYCHECK = WORTH ?', x, -520, win(t, T.really - 0.2, T.but1 + 0.3), 22);
}

function zoneC(g, t) {
  const x = C;
  MM.ground(g, x - 600, x + 600, 0, 0.7);
  const a = p(t, T.but1 - 0.3, 0.5);
  // office door
  MM.stroke(g, a, 3); g.strokeRect(x + 120, -300, 170, 300);
  MM.fill(g, 0.15 * a); g.beginPath(); g.moveTo(x + 120, -300); g.lineTo(x + 200, -280); g.lineTo(x + 200, 12); g.lineTo(x + 120, 0); g.closePath(); g.fill();
  MM.stroke(g, a, 3); g.stroke();
  MM.beam(g, [[x + 290, -300], [x + 290, 0], [x + 560, 0], [x + 600, -40]], a * 0.8);
  MM.pill(g, 'COMPANY', x + 205, -360, win(t, T.company1 - 0.1, null), 18);
  MM.person(g, x - 170, 0, 1.1, a, true);
  // paycheck card hovering, tether to ankle
  const k = p(t, T.so - 0.1, 0.9);
  MM.path(g, [[x + 120, -40], [x + 20, -14], [x - 60, -6], [x - 140, -8]], k, 0.9, 2.5);
  if (k > 0) {
    for (let i = 0; i < 6; i++) { const f = i / 6; if (f > k) break; const xx = lerp(x + 110, x - 130, f); MM.stroke(g, 0.7, 2); g.beginPath(); g.ellipse(xx, lerp(-38, -10, f), 12, 7, 0, 0, 7); g.stroke(); }
  }
  MM.label(g, 'SO YOU STAY', x, -420, win(t, T.stay - 0.25, null, 0.4), 26);
  MM.coin(g, x - 170, -330 + Math.sin(t * 3) * 6, 26, p(t, T.but1 + 0.4, 0.4));
}

function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 700, x + 1100, 0, 0.7);
  const a = p(t, T.imagine1 - 0.3, 0.5);
  const cx = x - 300, cy = -300;
  MM.clock(g, cx, cy, 110, a, t, t > T.d25 ? 4 : 0.5, true);
  MM.label(g, '$25 / HOUR', cx, cy + 165, win(t, T.d25, null), 28, { weight: 700 });
  // coins drop each "tick"
  for (let i = 0; i < 14; i++) dropCoin(g, t, T.d25 + 0.25 + i * 0.32, cx + 230, cy - 60, -8 - i * 12, 18);
  // calendar: 13 x 4 = 52 weeks
  const gx = x + 200, gy = -520, cs = 46;
  const ga = p(t, T.work2 - 0.2, 0.5);
  MM.stroke(g, ga, 2.5); MM.rr(g, gx - 20, gy - 60, 13 * cs + 40, 4 * cs + 80, 14); g.stroke();
  for (let i = 0; i < 52; i++) {
    const c = i % 13, r = Math.floor(i / 13), fx = gx + c * cs, fy = gy + r * cs;
    const on = t > T.forty + (i / 52) * (T.k52 - T.forty - 0.3);
    if (on) { MM.fill(g, ga); g.fillRect(fx + 6, fy + 6, cs - 12, cs - 12); }
    else { MM.stroke(g, ga * 0.5, 2); g.strokeRect(fx + 6, fy + 6, cs - 12, cs - 12); }
  }
  MM.label(g, '40 HOURS  ×  52 WEEKS', gx + 13 * cs / 2, gy - 100, win(t, T.forty, null), 22);
  // counter
  const ca = p(t, T.k52 - 0.1, 0.3);
  const n = 52000 * out(clamp((t - T.k52) / 1.0));
  MM.big(g, MM.money(n), gx + 13 * cs / 2, gy + 4 * cs + 150, ca, 96);
  MM.ripple(g, gx + 13 * cs / 2, gy + 4 * cs + 150, t, T.k52 + 1.0, 80, 360, 1);
  MM.label(g, 'PER YEAR', gx + 13 * cs / 2, gy + 4 * cs + 225, ca, 20);
}

function zoneE(g, t) {
  const x = E2;
  MM.ground(g, x - 600, x + 600, 0, 0.7);
  const a = p(t, T.now - 0.3, 0.5);
  const bw = 150;
  const h1 = 170 * a;
  const grow = out(clamp((t - T.three) / 1.1));
  const h2 = 170 * a * (1 + 2 * grow);
  // you bar
  MM.stroke(g, a, 3); g.strokeRect(x - 200 - bw / 2, -h1, bw, h1);
  MM.fill(g, 0.12 * a); g.fillRect(x - 200 - bw / 2, -h1, bw, h1);
  MM.label(g, 'YOU', x - 200, 40, a, 20);
  MM.label(g, '$52,000', x - 200, -h1 - 40, a, 22, { weight: 700 });
  // company bar
  MM.fill(g, a); g.fillRect(x + 200 - bw / 2, -h2, bw, h2);
  MM.halo(g, x + 200, -h2 / 2, 260, a * 0.6 * (0.4 + grow));
  MM.label(g, 'COMPANY', x + 200, 40, a, 20);
  MM.big(g, MM.money(52000 * (1 + 2 * grow)), x + 200, -h2 - 50, a, 44);
  MM.pill(g, '3 ×', x, -560, win(t, T.three, null), 22, true);
}

function zoneF(g, t) {
  const x = F;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  const a = p(t, T.this1 - 0.3, 0.5);
  const lx = x - 250, rx = x + 250;
  const lf = t > T.one, rf = t > T.other;
  MM.person(g, lx, 0, 1.3, a, lf);
  MM.person(g, rx, 0, 1.3, a, rf);
  // sweat lines
  for (const px of [lx, rx]) for (let i = 0; i < 3; i++) {
    const k = (t * 1.5 + i / 3) % 1; MM.stroke(g, a * (1 - k) * 0.8, 2.5);
    g.beginPath(); g.moveTo(px + 60 + i * 12, -170 - k * 30); g.lineTo(px + 70 + i * 12, -185 - k * 30); g.stroke();
  }
  // left: clock + slow trickle
  const la = p(t, T.one, 0.4);
  MM.clock(g, lx, -300, 40, la, t, 2, true);
  MM.label(g, 'HOURS', lx, 50, la, 22);
  const cap = 9;
  for (let i = 0; i < 12; i++) {
    const ts = T.one + 0.4 + i * 0.75; const k = Math.min(i, cap - 1);
    if (i < cap) dropCoin(g, t, ts, lx - 140, -420, -8 - k * 12, 16);
  }
  // right: box + pour
  const ra = p(t, T.other, 0.4);
  MM.box(g, rx, -305, 0.55, ra, true);
  MM.label(g, 'RESULTS', rx, 50, ra, 22);
  for (let i = 0; i < 40; i++) {
    const ts = T.other + 0.3 + i * 0.12;
    const col = i % 3, k = Math.floor(i / 3);
    dropCoin(g, t, ts, rx + 120 + col * 36, -560, -8 - k * 12, 16);
  }
  // ceiling over left stack
  const ck = p(t, T.ceiling - 0.2, 0.6);
  MM.path(g, [[lx - 230, -18 - cap * 12 - 4], [lx - 50, -18 - cap * 12 - 4]], ck, 1, 5, true);
  MM.label(g, 'CEILING', lx - 140, -18 - cap * 12 - 44, win(t, T.ceiling, null), 20);
}

function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  const a = p(t, T.there - 0.3, 0.5);
  for (let i = 0; i < 9; i++) {
    const hx = x - 480 + i * 120;
    const ai = p(t, T.there + i * 0.08, 0.4);
    let hy = -70, fade = 1;
    if (i === 4) { const s = p(t, T.sell1, 0.6); hy -= 120 * s; fade = 1 - 0.75 * p(t, T.twice, 0.6); }
    MM.hourglass(g, hx, hy, 0.95, ai * fade * a, 0.3 + 0.4 * ((i * 37) % 10) / 10);
  }
  MM.big(g, '≈ 2,000', x, -420, p(t, T.k2 - 0.1, 0.4), 84);
  MM.label(g, 'WORKING HOURS A YEAR', x, -350, p(t, T.k2 + 0.2, 0.4), 22);
  MM.pill(g, 'SOLD ONCE', x, -320 + 40, win(t, T.twice, null), 20, true);
}

function zoneH(g, t) {
  const x = H;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  const a = p(t, T.of - 0.3, 0.5);
  MM.house(g, x - 120, 0, 1.25, a, 0.6 + 0.2 * Math.sin(t * 2));
  MM.pill(g, 'PAYS THE BILLS', x - 120, -330, win(t, T.pays, null), 20);
  const ba = p(t, T.buys + 0.2, 0.5);
  MM.book(g, x + 300, -110, 1.1, ba);
  MM.pill(g, 'TIME TO LEARN', x + 300, -230, win(t, T.buys + 0.4, null), 20);
}

function zoneI(g, t) {
  const x = I;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  const a = p(t, T.but3 - 0.3, 0.5);
  MM.tag(g, x - 300, -330, a, 0.08 * Math.sin(t * 2), '$25 / HR', 1.3);
  MM.label(g, 'YOUR PRICE', x - 300, 40, a, 20);
  MM.building(g, x + 280, 0, 300, 520, a, 0.7);
  MM.label(g, 'YOUR VALUE', x + 280, 40, a, 20);
  const k = p(t, T.difference, 0.8);
  MM.stroke(g, 0.9 * k, 2.5); g.setLineDash([10, 12]);
  g.beginPath(); g.moveTo(x - 210, -150); g.lineTo(x - 210 + 290 * k, -150); g.stroke(); g.setLineDash([]);
  MM.pill(g, 'THE GAP', x - 70, -220, win(t, T.difference + 0.3, null), 20, true);
  MM.label(g, 'A DIFFERENT QUESTION', x, -640, win(t, T.but3 + 3.6, null), 22);
}

function zoneJ(g, t) {
  const x = J;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  const dim = 1 - 0.7 * p(t, T.sell2, 0.6);
  MM.clock(g, x - 230, -230, 90, p(t, T.not2 - 0.3, 0.5) * dim, t, 1.5, dim > 0.6);
  MM.label(g, 'HOURS ?', x - 230, -90, win(t, T.not2 + 0.3, null) * dim, 22);
  const on = p(t, T.result - 0.05, 0.35);
  MM.box(g, x + 230, -230, outBack(clamp((t - T.result + 0.05) / 0.5)) * 0.95 + 0.05, on, true);
  MM.ripple(g, x + 230, -230, t, T.result, 70, 380, 1.0);
  MM.label(g, 'RESULT', x + 230, -90, win(t, T.result + 0.1, null), 22);
}

const SCENE = {
  duration: T.end,
  camera,
  draw(g, t, cam) {
    // only draw zones near camera
    const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
    if (near(A)) zoneA(g, t);
    if (near(B)) zoneB(g, t);
    if (near(C)) zoneC(g, t);
    if (near(D)) zoneD(g, t);
    if (near(E2)) zoneE(g, t);
    if (near(F)) zoneF(g, t);
    if (near(G)) zoneG(g, t);
    if (near(H)) zoneH(g, t);
    if (near(I)) zoneI(g, t);
    if (near(J)) zoneJ(g, t);
  },
};
