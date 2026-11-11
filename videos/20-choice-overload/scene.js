// 20 — Choice overload (Iyengar & Lepper, 2000)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  choice1: w('choice', 1), nothing1: w('nothing', 1), y2000: w('2000'), iyengar: w('iyengar'), leper: w('leper'), jam: w('jam'), store: w('store'),
  some: w('some'), n24: w('24'), six1: w('six', 1), display: w('display'), but1: w('but', 1), p3: w('3%'), jar: w('jar'), six2: w('six', 2), p30: w('30%'),
  ten: w('10'), options1: w('options', 1), too1: w('too', 1), choices: w('choices'), risky: w('risky'), delay: w('delay'), course: w('course'),
  but2: w('but', 2), overwhelming: w('overwhelming'), three: w('three'), pick: w('pick'), because: w('because'), doing: w('doing'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000;
const OPEN = { x: 0, y: -300, z: 1.25 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.y2000 - 0.4, B, -300, 1.25), F_(T.some - 0.4, C, -300, 1.15), { t: T.six1, d: 1.2, x: C, y: -300, z: 1.15 }, F_(T.but1 - 0.4, D, -300, 1.2),
  F_(T.too1 - 0.4, E2, -280, 1.3), F_(T.course - 0.4, F, -300, 1.3), F_(T.but2 - 0.4, G, -290, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
// grid of jars; returns nothing. n jars, cols, origin centre, scale, per-jar start time
function jars(g, t, n, cols, cx, cy, s, t0, gap, fade = 1) {
  const rows = Math.ceil(n / cols), dx = 200 * s, dy = 210 * s;
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const jx = cx + (c - (cols - 1) / 2) * dx, jy = cy + (r - (rows - 1) / 2) * dy + 85 * s;
    const a = p(t, t0 + i * gap, 0.35) * fade;
    MM.jar(g, jx, jy, s, a, 0.55 + 0.3 * ((i * 7) % 3) / 2);
  }
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.pill(g, 'TOO MANY CHOICES', x - 320, -640, p(t, 0.2, 0.4), 22, true);
  jars(g, t, 24, 6, x - 320, -340, 0.36, -0.4, 0.04);
  MM.path(g, [[x + 20, -340], [x + 160, -340]], p(t, 0.9, 0.5), 0.9, 3, true);
  MM.build(g, t, -0.2, x + 360, -360, 130, (g2, a) => MM.cart(g2, x + 360, -340, 1.8, a));
  const k = end ? 1 : p(t, T.nothing1 - 0.3, 0.4);
  MM.big(g, '0 ITEMS', x + 360, -560, k, 56);
  MM.label(g, 'YOU BUY NOTHING', x + 360, -160, k, 20, { weight: 800 });
  if (end) MM.pill(g, 'DOING NOTHING IS A CHOICE TOO', x, 0, win(t, T.doing - 0.4, null), 22, true);
}
function stand(g, t, x, a, t0) {
  // awning + table of a tasting stand
  const k = p(t, t0, 0.8);
  MM.path(g, [[x - 360, -520], [x + 360, -520]], k, a, 4, false);
  for (let i = 0; i < 6; i++) { const sx = x - 360 + i * 120; MM.path(g, [[sx, -520], [sx + 60, -460], [sx + 120, -520]], p(t, t0 + 0.2 + i * 0.06, 0.4), a * 0.8, 3, false); }
  MM.path(g, [[x - 340, -520], [x - 340, -40]], k, a * 0.7, 3, false);
  MM.path(g, [[x + 340, -520], [x + 340, -40]], k, a * 0.7, 3, false);
  MM.rr(g, x - 380, -200, 760, 50, 10); MM.stroke(g, a * k, 3); g.stroke();
}
function zoneB(g, t) {
  const x = B;
  MM.pill(g, '2000 · SHEENA IYENGAR & MARK LEPPER', x, -680, win(t, T.y2000 - 0.4, null), 20);
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  stand(g, t, x - 120, 1, T.y2000 - 0.4);
  jars(g, t, 6, 6, x - 120, -270, 0.42, T.jam - 0.3, 0.08);
  MM.big(g, 'FREE JAM TASTING', x - 120, -590, p(t, T.jam - 0.2, 0.4), 40);
  MM.person(g, x - 230, 0, 0.9, p(t, T.y2000 + 0.6, 0.4), true);
  MM.person(g, x + 0, 0, 0.9, p(t, T.y2000 + 1.0, 0.4), true);
  MM.label(g, 'SHEENA', x - 230, 40, p(t, T.iyengar - 0.2, 0.4), 14);
  MM.label(g, 'MARK', x, 40, p(t, T.leper - 0.2, 0.4), 14);
  MM.build(g, t, T.store - 0.8, x + 470, -150, 160, (g2, a) => MM.building(g2, x + 470, 0, 220, 330, a, 0.3));
  MM.label(g, 'GROCERY STORE', x + 470, 40, p(t, T.store - 0.3, 0.4), 18, { weight: 800 });
}
function zoneC(g, t) {
  const x = C;
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  // left: 24 flavours table
  MM.rr(g, x - 680, -160, 620, 40, 10); MM.stroke(g, p(t, T.some - 0.4, 0.5), 3); g.stroke();
  jars(g, t, 24, 8, x - 370, -330, 0.32, T.some, 0.06);
  MM.big(g, String(Math.round(24 * out(clamp((t - T.some) / 1.7)))), x - 370, -560, p(t, T.some - 0.2, 0.4), 64);
  MM.label(g, 'FLAVORS', x - 370, -500, p(t, T.some, 0.4), 18);
  // right: 6 flavours table
  MM.rr(g, x + 120, -160, 520, 40, 10); MM.stroke(g, p(t, T.six1 - 0.9, 0.5), 3); g.stroke();
  jars(g, t, 6, 3, x + 380, -260, 0.42, T.six1 - 0.8, 0.08);
  MM.big(g, '6', x + 380, -560, p(t, T.six1 - 0.3, 0.4), 64);
  MM.label(g, 'FLAVORS', x + 380, -500, p(t, T.six1 - 0.2, 0.4), 18);
  // the crowd goes to the big display
  for (let i = 0; i < 5; i++) { const px = x - 620 + i * 125, wk = MM.walk(t, T.display - 0.4 + i * 0.12, px - 300, px, 1.0); MM.person(g, wk.x, wk.bob, 0.6, p(t, T.display - 0.4 + i * 0.12, 0.3), true); }
  MM.person(g, x + 300, 0, 0.6, p(t, T.display + 0.4, 0.3), true);
  MM.person(g, x + 460, 0, 0.6, p(t, T.display + 0.6, 0.3), true);
  MM.pill(g, 'MORE PEOPLE STOP', x - 370, -700, win(t, T.display, null), 20, true);
}
function zoneD(g, t) {
  const x = D;
  MM.label(g, 'TASTERS WHO BOUGHT A JAR', x, -650, p(t, T.but1 - 0.1, 0.4), 20);
  const a1 = p(t, T.but1 - 0.1, 0.4), a2 = p(t, T.six2 - 0.4, 0.4);
  MM.pctBar(g, x - 330, -100, 460, 3 * out(clamp((t - T.p3 + 0.3) / 0.9)), a1, '24 FLAVORS');
  MM.pctBar(g, x + 330, -100, 460, 30 * out(clamp((t - T.p30 + 0.4) / 1.1)), a2, '6 FLAVORS');
  MM.build(g, t, T.jar - 0.3, x - 170, -160, 80, (g2, a) => MM.jar(g2, x - 170, -100, 0.4, a, 0.7));
  // live calculator: 30 ÷ 3
  const ck = p(t, T.ten - 0.5, 0.4);
  MM.big(g, '30 ÷ 3 =', x - 20, -420, ck, 48);
  MM.big(g, '10×', x, -320, p(t, T.ten - 0.2, 0.4), 96);
  MM.pill(g, 'MORE SALES · FEWER OPTIONS', x, -200, win(t, T.options1 - 0.6, null), 20, true);
  MM.ripple(g, x, -320, t, T.ten, 100, 500, 1.0);
}
function zoneE(g, t) {
  const x = E2;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.person(g, x - 460, 0, 1.3, p(t, T.too1 - 0.3, 0.4), true);
  const opts = 7;
  for (let i = 0; i < opts; i++) {
    const ty = -620 + i * 95, ts = T.too1 - 0.1 + i * 0.12;
    MM.path(g, [[x - 360, -220], [x - 100, -220], [x + 40, ty]], p(t, ts, 0.5), 0.75, 2.5, true);
    MM.rr(g, x + 70, ty - 32, 200, 64, 16); MM.stroke(g, p(t, ts + 0.3, 0.3), 2.5); g.stroke();
    MM.label(g, 'OPTION ' + (i + 1), x + 170, ty, p(t, ts + 0.3, 0.3), 14, { weight: 800 });
  }
  MM.label(g, 'EVERY DECISION FEELS RISKY', x - 460, -320, win(t, T.risky - 0.5, null), 20, { weight: 800 });
  MM.build(g, t, T.delay - 0.5, x + 520, -330, 120, (g2, a) => MM.clock(g2, x + 520, -330, 110, a, t, 3, false));
  MM.pill(g, 'SO WE DELAY', x + 520, -170, win(t, T.delay - 0.2, null), 22, true);
}
function zoneF(g, t) {
  const x = F;
  MM.pill(g, "CHOICE ITSELF ISN'T BAD ✓", x, -680, win(t, T.course - 0.3, null), 22);
  for (let i = 0; i < 12; i++) {
    const c = i % 4, r = Math.floor(i / 4), cx = x - 450 + c * 300, cy = -480 + r * 170;
    MM.card(g, cx, cy, p(t, T.course - 0.4 + i * 0.05, 0.35), { w: 240, h: 130, hot: 0, title: 'PLAN ' + String.fromCharCode(65 + i) });
  }
  MM.label(g, 'FREEDOM · OPTIONS · FIT', x, -20, p(t, T.course + 0.6, 0.4), 18);
}
function zoneG(g, t) {
  const x = G;
  MM.pill(g, 'OVERWHELMED? CUT IT TO 3', x, -640, win(t, T.but2 - 0.3, null), 22, true);
  const ck = inOut(clamp((t - T.three + 0.5) / 0.9));
  const keep = [1, 4, 7];
  for (let i = 0; i < 9; i++) {
    const c = i % 3, r = Math.floor(i / 3);
    const gx = x - 380 + c * 380, gy = -520 + r * 170;
    const k = keep.indexOf(i);
    const fx = k >= 0 ? x - 380 + k * 380 : gx, fy = k >= 0 ? -340 : gy - 200;
    const a = p(t, T.but2 - 0.3 + i * 0.05, 0.35) * (k >= 0 ? 1 : 1 - ck);
    const hot = k === 1 ? p(t, T.pick - 0.2, 0.5) : 0;
    const big = k >= 0 ? lerp(1, 1.5, ck) : 1;
    MM.card(g, lerp(gx, fx, ck), lerp(gy, fy, ck), a, { w: 220 * big, h: 120 * big, hot, title: 'OPTION', price: k >= 0 ? String(k + 1) : '' });
  }
  MM.ripple(g, x, -340, t, T.pick, 120, 500, 0.9);
  MM.pill(g, 'PICK ONE ✓', x, -100, win(t, T.pick - 0.1, null), 24, true);
  MM.label(g, '9 → 3 → 1', x, -20, p(t, T.three, 0.4), 20, { weight: 800 });
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
