// 02 — Your salary is the price of your time  (v2: focus transitions, builds, drift)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  salary1: w('salary', 1), price1: w('price', 1), value1: w('value', 1),
  most: w('most'), believe: w('believe'), paycheck: w('paycheck'), really: w('really'),
  but1: w('but', 1), company1: w('company', 1), so: w('so'), stay: w('stay'),
  imagine1: w('imagine', 1), earning: w('earning'), d25: w('$25'), work2: w('work', 2), forty: w('40'),
  week: w('week'), full: w('full'), k52: w('$52,000'),
  now: w('now'), helps: w('helps'), three: w('three'),
  your4: w('your', 4), value2: w('value', 2), only1: w('only', 1), price2: w('price', 2),
  this1: w('this'), two1: w('two'), equally: w('equally'), different1: w('different', 1),
  one: w('one'), hours1: w('hours', 2), other: w('other'), results: w('results'),
  and3: w('and', 3), ceiling: w('ceiling'),
  there: w('there'), k2: w('2,000'), working: w('working'), sell1: w('sell', 1), twice: w('twice'),
  of: w('of', 4), steady: w('steady'), pays: w('pays'), bills: w('bills'), buys: w('buys'), learn: w('learn'),
  but3: w('but', 2), difference: w('difference'), price3: w('price', 3), value3: w('value', 3),
  question: w('question'),
  not2: w('not', 2), sell2: w('sell', 2), but4: w('but', 3), result: w('result'), create: w('create'),
  because: w('because'), your9: w('your', 10), build: w('build'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

// zones (far apart; we travel with focus transitions, never long pans)
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000, I = 40000, J = 45000;
const OPEN = { x: -60, y: -190, z: 1.75 };
const F_ = (t, x, y, z, d = 0.9) => ({ t, d, x, y, z, focus: true });

const camera = [
  { ...OPEN },
  { t: T.value1 - 0.35, d: 0.8, x: 160, y: -280, z: 1.18 },
  F_(T.most - 0.45, B, -260, 1.45),
  F_(T.company1 - 0.55, C, -230, 1.55),
  F_(T.imagine1 - 0.45, D - 260, -260, 1.6),
  { t: T.work2 - 0.15, d: 0.7, x: D + 230, y: -280, z: 1.3 },
  F_(T.now - 0.45, E2, -330, 1.12),
  F_(T.your4 - 0.45, 160, -280, 1.18),
  { t: T.only1 - 0.1, d: 0.6, x: 0, y: -190, z: 1.8 },
  F_(T.this1 - 0.45, F, -250, 1.4),
  { t: T.and3 - 0.05, d: 0.6, x: F - 120, y: -330, z: 1.55 },
  F_(T.there - 0.45, G, -230, 1.45),
  F_(T.of - 0.45, H, -230, 1.5),
  F_(T.but3 - 0.45, I, -280, 1.3),
  F_(T.not2 - 0.45, J, -230, 1.55),
  F_(T.because - 0.45, OPEN.x, OPEN.y, OPEN.z),
  { t: T.your9 - 0.15, d: 0.75, x: 160, y: -280, z: 1.18 },
  { t: T.end - 0.85, d: 0.8, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

function dropCoin(g, t, ts, x, y0, y1, r = 16) {
  if (t < ts) return;
  const k = clamp((t - ts) / 0.45);
  if (k < 1) { MM.coin(g, x, lerp(y0, y1, k * k), r, Math.min(1, (t - ts) * 6)); return; }
  MM.rr(g, x - r * 1.35, y1 - 5, r * 2.7, 10, 5); MM.fill(g, 0.95); g.fill();
  MM.ripple(g, x, y1, t, ts + 0.45, 10, 50, 0.5);
}
// draw-on rectangle outline
function rectOn(g, x, y, w_, h, k, a = 1, lw = 3) {
  MM.path(g, [[x, y + h], [x, y], [x + w_, y], [x + w_, y + h], [x, y + h]], k, a, lw, true);
}

function zoneA(g, t) {
  MM.ground(g, -900, 900, 0, 0.7);
  // building constructs: outline draws, then windows light one by one
  const bk = p(t, T.value1 - 0.15, 0.9);
  const glow = 0.3 + 0.3 * p(t, T.value2, 0.5) + 0.4 * p(t, T.build, 0.6);
  if (bk > 0) {
    if (bk < 1) rectOn(g, 175, -560, 330, 560, bk, 1, 3);
    else MM.building(g, 340, 0, 330, 560, 1, glow);
  }
  MM.pill(g, 'VALUE', 340, -620, Math.max(win(t, T.value1 + 0.2, T.most), win(t, T.value2, T.this1)), 20);
  MM.ripple(g, 340, -280, t, T.value2, 60, 420, 1.1);
  MM.beam(g, [[175, -380], [175, -120], [-300, -10], [-300, -320]], bk >= 1 ? glow : 0);
  // hero
  const pose = t > T.build ? 'up' : 'stand';
  MM.person(g, -180, 0, 1.15, 1, true, pose);
  // clock assembles on "salary", tag on "price"
  const cx = 0, cy = -205;
  MM.build(g, t, T.salary1 - 0.2, cx, cy, 70, (g2, a) => MM.clock(g2, cx, cy, 56, a, t, 0.6, true));
  let swing = 0.22 * Math.sin(t * 2.2);
  if (t > T.only1) swing += 0.55 * Math.sin((t - T.only1) * 7) * (1 - clamp((t - T.only1) / 2.5));
  let price = '$25 / HR';
  if (t > T.price2 && t < T.price2 + 1.6) price = ['$25 / HR', '$31 / HR', '$19 / HR', '$27 / HR'][Math.floor((t - T.price2) * 6) % 4];
  MM.build(g, t, T.price1 - 0.3, cx, cy + 120, 60, (g2, a) => MM.tag(g2, cx, cy + 56, a, swing, price, 1));
  MM.pill(g, 'PRICE', -180, -380, Math.max(win(t, T.price1, T.value1 + 0.6), win(t, T.price2, T.this1)), 20);
  MM.label(g, 'YOUR VALUE IS WHAT YOU BUILD', 160, 80, win(t, T.build - 0.1, null, 0.5), 22);
}

function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  const land = T.paycheck + 0.35;
  let ang = 0.18;
  if (t > land) ang = 0.18 * Math.cos((t - land) * 9) * Math.exp(-(t - land) * 3);
  if (t > T.but1) ang = lerp(ang, -0.24, p(t, T.but1, 0.8));
  const L = 260, top = -360;
  const lx = x - Math.cos(ang) * L, ly = top + Math.sin(ang) * L;
  const rx = x + Math.cos(ang) * L, ry = top - Math.sin(ang) * L;
  const sk = p(t, T.most - 0.1, 0.8);
  MM.path(g, [[x - 80, 0], [x + 80, 0]], sk, 1, 3, false);
  MM.path(g, [[x, 0], [x, top]], sk, 1, 3, true);
  if (sk >= 1) {
    MM.stroke(g, 1, 3); g.beginPath(); g.moveTo(lx, ly); g.lineTo(rx, ry); g.stroke();
    MM.fill(g, 1); g.beginPath(); g.arc(x, top, 9, 0, 7); g.fill();
    for (const [px, py] of [[lx, ly], [rx, ry]]) {
      g.beginPath(); g.moveTo(px, py); g.lineTo(px - 75, py + 140); g.moveTo(px, py); g.lineTo(px + 75, py + 140); g.stroke();
      g.beginPath(); g.moveTo(px - 95, py + 140); g.quadraticCurveTo(px, py + 188, px + 95, py + 140); g.closePath(); g.stroke();
    }
  }
  // worth weight builds on "believe"
  MM.build(g, t, T.believe, rx, ry + 95, 80, (g2, a) => {
    g2.beginPath(); g2.moveTo(rx - 58, ry + 138); g2.lineTo(rx - 40, ry + 45); g2.lineTo(rx + 40, ry + 45); g2.lineTo(rx + 58, ry + 138); g2.closePath();
    MM.fill(g2, a); g2.fill(); MM.stroke(g2, a, 3); g2.beginPath(); g2.arc(rx, ry + 34, 12, 0, 7); g2.stroke();
  });
  MM.label(g, 'WORTH', rx, ry + 220, p(t, T.believe + 0.4, 0.4), 18);
  // paycheck drops in
  const pa = p(t, T.paycheck - 0.2, 0.3);
  const py = lerp(ly - 420, ly + 100, out(clamp((t - T.paycheck + 0.2) / 0.55)));
  if (pa > 0) {
    MM.rr(g, lx - 72, py - 40, 144, 80, 8); MM.fill(g, 0.1 * pa); g.fill(); MM.stroke(g, pa, 3); g.stroke();
    MM.coin(g, lx - 38, py, 16, pa); MM.stroke(g, pa * 0.7, 3);
    g.beginPath(); g.moveTo(lx - 12, py - 10); g.lineTo(lx + 50, py - 10); g.moveTo(lx - 12, py + 10); g.lineTo(lx + 30, py + 10); g.stroke();
  }
  MM.label(g, 'PAYCHECK', lx, ly + 220, pa, 18);
  const eq = t > T.but1 + 0.2 ? 'PAYCHECK ≠ WORTH' : 'PAYCHECK = WORTH ?';
  MM.pill(g, eq, x, -560, win(t, T.really - 0.2, null), 22, t > T.but1 + 0.2);
  MM.ripple(g, x, -560, t, T.but1 + 0.2, 60, 300, 0.8);
}

function zoneC(g, t) {
  const x = C;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  // office door builds
  const dk = p(t, T.company1 - 0.25, 0.8);
  if (dk < 1) rectOn(g, x + 120, -300, 170, 300, dk);
  else {
    MM.stroke(g, 1, 3); g.strokeRect(x + 120, -300, 170, 300);
    MM.fill(g, 0.15); g.beginPath(); g.moveTo(x + 120, -300); g.lineTo(x + 200, -280); g.lineTo(x + 200, 12); g.lineTo(x + 120, 0); g.closePath(); g.fill();
    MM.stroke(g, 1, 3); g.stroke();
    MM.beam(g, [[x + 290, -300], [x + 290, 0], [x + 600, 0], [x + 640, -40]], 0.8);
  }
  MM.pill(g, 'COMPANY', x + 205, -360, win(t, T.company1 + 0.1, null), 18);
  // person walks toward the door
  const wk = MM.walk(t, T.company1 - 0.3, x - 520, x - 170, 1.2);
  MM.person(g, wk.x, wk.bob, 1.15, 1, true);
  // paycheck hovering above, tether to ankle
  MM.build(g, t, T.company1 + 0.6, wk.x, -340, 40, (g2, a) => MM.coin(g2, wk.x, -340 + Math.sin(t * 3) * 6, 26, a));
  const k = p(t, T.so - 0.1, 0.9);
  MM.path(g, [[x + 120, -40], [x + 20, -14], [x - 60, -6], [x - 140, -8]], k, 0.9, 2.5);
  for (let i = 0; i < 6; i++) { const f = i / 6; if (f > k) break; MM.stroke(g, 0.7, 2); g.beginPath(); g.ellipse(lerp(x + 110, x - 130, f), lerp(-38, -10, f), 12, 7, 0, 0, 7); g.stroke(); }
  MM.label(g, 'SO YOU STAY', x, -440, win(t, T.stay - 0.25, null, 0.4), 28);
}

function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 800, x + 1100, 0, 0.7);
  const cx = x - 300, cy = -300;
  MM.build(g, t, T.earning - 0.4, cx, cy, 130, (g2, a) => MM.clock(g2, cx, cy, 110, a, t, t > T.d25 ? 4 : 0.5, true), 0.8);
  MM.label(g, '$25 / HOUR', cx, cy + 165, win(t, T.d25, null), 30, { weight: 700 });
  for (let i = 0; i < 14; i++) dropCoin(g, t, T.d25 + 0.25 + i * 0.32, cx + 230, cy - 60, -8 - i * 12, 18);
  // calendar 13x4 = 52 weeks: frame draws on, cells fill
  const gx = x + 200, gy = -520, cs = 46;
  const fk = p(t, T.work2 - 0.2, 0.8);
  rectOn(g, gx - 20, gy - 60, 13 * cs + 40, 4 * cs + 80, fk, 1, 2.5);
  for (let i = 0; i < 52; i++) {
    const c = i % 13, r = Math.floor(i / 13), fx = gx + c * cs, fy = gy + r * cs;
    const ton = T.week + (i / 52) * (T.k52 - T.week - 0.3);
    const on = p(t, ton, 0.15);
    if (fk < 0.6) continue;
    MM.stroke(g, 0.45, 2); g.strokeRect(fx + 6, fy + 6, cs - 12, cs - 12);
    if (on > 0) { MM.fill(g, on); g.fillRect(fx + 6, fy + 6, cs - 12, cs - 12); }
  }
  MM.label(g, '40 HOURS', gx + 3 * cs, gy - 100, win(t, T.forty, null), 22);
  MM.label(g, '×  52 WEEKS', gx + 9 * cs, gy - 100, win(t, T.full, null), 22);
  const ca = p(t, T.k52 - 0.1, 0.3);
  MM.big(g, MM.money(52000 * out(clamp((t - T.k52) / 1.1))), gx + 13 * cs / 2, gy + 4 * cs + 150, ca, 104);
  MM.ripple(g, gx + 13 * cs / 2, gy + 4 * cs + 150, t, T.k52 + 1.1, 80, 380, 1);
  MM.label(g, 'PER YEAR', gx + 13 * cs / 2, gy + 4 * cs + 228, ca, 20);
}

function zoneE(g, t) {
  const x = E2;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  const a = p(t, T.now - 0.1, 0.6), bw = 170;
  const h1 = 190 * a, grow = out(clamp((t - T.three) / 1.1)), h2 = 190 * a * (1 + 2 * grow);
  MM.stroke(g, a, 3); g.strokeRect(x - 220 - bw / 2, -h1, bw, h1); MM.fill(g, 0.12 * a); g.fillRect(x - 220 - bw / 2, -h1, bw, h1);
  MM.label(g, 'YOU', x - 220, 40, a, 20);
  MM.label(g, '$52,000', x - 220, -h1 - 40, a, 22, { weight: 700 });
  const ca = p(t, T.helps - 0.2, 0.6), hc = 190 * ca * (1 + 2 * grow);
  MM.fill(g, ca); g.fillRect(x + 220 - bw / 2, -hc, bw, hc);
  MM.halo(g, x + 220, -hc / 2, 240, ca * 0.6 * (0.4 + grow));
  MM.label(g, 'COMPANY', x + 220, 40, ca, 20);
  MM.big(g, MM.money(52000 * (1 + 2 * grow)), x + 220, -hc - 50, ca, 48);
  MM.pill(g, '3 ×', x, -620, win(t, T.three, null), 24, true);
  MM.ripple(g, x + 220, -hc, t, T.three + 1.1, 40, 260, 0.9);
}

function zoneF(g, t) {
  const x = F;
  MM.ground(g, x - 800, x + 800, 0, 0.7);
  const lx = x - 260, rx = x + 260;
  const wl = MM.walk(t, T.two1 - 0.5, x - 900, lx, 1.1), wr = MM.walk(t, T.two1 - 0.3, x + 900, rx, 1.1);
  MM.person(g, wl.x, wl.bob, 1.3, 1, t > T.one);
  MM.person(g, wr.x, wr.bob, 1.3, 1, t > T.other);
  if (t > T.equally) for (const px of [lx, rx]) for (let i = 0; i < 3; i++) {
    const k = (t * 1.5 + i / 3) % 1; MM.stroke(g, (1 - k) * 0.8, 2.5);
    g.beginPath(); g.moveTo(px + 70 + i * 12, -200 - k * 30); g.lineTo(px + 80 + i * 12, -215 - k * 30); g.stroke();
  }
  MM.pill(g, 'SAME EFFORT', x, -520, win(t, T.equally, T.one), 20);
  MM.build(g, t, T.one, lx, -310, 50, (g2, a) => MM.clock(g2, lx, -310, 40, a, t, 2, true));
  MM.label(g, 'HOURS', lx, 50, p(t, T.hours1, 0.4), 22);
  const cap = 9;
  for (let i = 0; i < cap; i++) dropCoin(g, t, T.hours1 + 0.2 + i * 0.75, lx - 150, -440, -8 - i * 12, 16);
  MM.build(g, t, T.other, rx, -315, 60, (g2, a) => MM.box(g2, rx, -315, 0.55, a, true));
  MM.label(g, 'RESULTS', rx, 50, p(t, T.results, 0.4), 22);
  for (let i = 0; i < 42; i++) { const c = i % 3, k = Math.floor(i / 3); dropCoin(g, t, T.results + 0.1 + i * 0.11, rx + 130 + c * 36, -600, -8 - k * 12, 16); }
  const ck = p(t, T.ceiling - 0.2, 0.6);
  MM.path(g, [[lx - 250, -8 - cap * 12 - 8], [lx - 50, -8 - cap * 12 - 8]], ck, 1, 5, true);
  MM.label(g, 'CEILING', lx - 150, -8 - cap * 12 - 48, win(t, T.ceiling, null), 20);
}

function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 800, x + 800, 0, 0.7);
  for (let i = 0; i < 9; i++) {
    const hx = x - 480 + i * 120;
    let hy = -70, fade = 1;
    if (i === 4) { hy -= 140 * p(t, T.sell1, 0.6); fade = 1 - 0.75 * p(t, T.twice, 0.6); }
    MM.build(g, t, T.there + i * 0.12, hx, -70, 50, (g2, a) => MM.hourglass(g2, hx, hy, 0.95, a * fade, 0.3 + 0.4 * ((i * 37) % 10) / 10), 0.6);
  }
  const ka = p(t, T.k2 - 0.1, 0.4);
  MM.big(g, '≈ ' + Math.round(2000 * out(clamp((t - T.k2) / 0.9))).toLocaleString('en-US'), x, -440, ka, 92);
  MM.label(g, 'WORKING HOURS A YEAR', x, -366, p(t, T.working, 0.4), 22);
  MM.pill(g, 'SOLD ONCE', x, -300, win(t, T.twice, null), 20, true);
}

function zoneH(g, t) {
  const x = H;
  MM.ground(g, x - 800, x + 800, 0, 0.7);
  MM.build(g, t, T.steady - 0.3, x - 160, -120, 170, (g2, a) => MM.house(g2, x - 160, 0, 1.35, a, 0.5 + 0.2 * Math.sin(t * 2)), 0.8);
  MM.pill(g, 'PAYS THE BILLS', x - 160, -350, win(t, T.pays, null), 20);
  for (let i = 0; i < 5; i++) { const ts = T.bills + i * 0.18; if (t > ts && t < ts + 0.9) { const k = (t - ts) / 0.9; MM.coin(g, lerp(x - 160, x - 160 + (i - 2) * 40, k), lerp(-420, -150, k * k), 14, Math.sin(Math.PI * k)); } }
  MM.build(g, t, T.buys + 0.1, x + 320, -120, 90, (g2, a) => MM.book(g2, x + 320, -120, 1.2, a));
  MM.pill(g, 'TIME TO LEARN', x + 320, -250, win(t, T.learn - 0.2, null), 20);
}

function zoneI(g, t) {
  const x = I;
  MM.ground(g, x - 800, x + 800, 0, 0.7);
  MM.build(g, t, T.but3 + 0.1, x - 320, -250, 90, (g2, a) => MM.tag(g2, x - 320, -360, a, 0.08 * Math.sin(t * 2), '$25 / HR', 1.4));
  MM.label(g, 'YOUR PRICE', x - 320, 40, p(t, T.price3, 0.4), 20);
  const bk = p(t, T.price3 + 0.1, 0.9);
  if (bk < 1) rectOn(g, x + 130, -560, 320, 560, bk); else MM.building(g, x + 290, 0, 320, 560, 1, 0.75);
  MM.label(g, 'YOUR VALUE', x + 290, 40, p(t, T.value3, 0.4), 20);
  const k = p(t, T.difference, 0.8);
  MM.stroke(g, 0.9 * k, 2.5); g.setLineDash([10, 12]);
  g.beginPath(); g.moveTo(x - 220, -170); g.lineTo(x - 220 + 330 * k, -170); g.stroke(); g.setLineDash([]);
  MM.pill(g, 'THE GAP', x - 55, -240, win(t, T.difference + 0.3, null), 20, true);
  MM.label(g, 'A DIFFERENT QUESTION', x, -660, win(t, T.question - 0.3, null), 24);
}

function zoneJ(g, t) {
  const x = J;
  MM.ground(g, x - 800, x + 800, 0, 0.7);
  const dim = 1 - 0.7 * p(t, T.sell2, 0.6);
  MM.build(g, t, T.not2 - 0.1, x - 250, -240, 110, (g2, a) => MM.clock(g2, x - 250, -240, 95, a * dim, t, 1.5, dim > 0.6));
  MM.label(g, 'HOURS ?', x - 250, -90, win(t, T.not2 + 0.4, null) * dim, 22);
  MM.build(g, t, T.result - 0.15, x + 250, -240, 110, (g2, a) => MM.box(g2, x + 250, -240, 1.05, a, true));
  MM.label(g, 'RESULT', x + 250, -90, win(t, T.result + 0.2, null), 22);
  MM.ripple(g, x + 250, -240, t, T.create, 80, 420, 1.0);
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
    if (near(H)) zoneH(g, t);
    if (near(I)) zoneI(g, t);
    if (near(J)) zoneJ(g, t);
  },
};
