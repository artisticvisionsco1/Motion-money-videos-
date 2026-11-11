// 25 — Spending on others (Dunn, Aknin & Norton, 2008)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  happiest1: w('happiest', 1), give1: w('give', 1), most: w('most'), best: w('best'), but1: w('but', 1), y2008: w('2008'), dunn: w('dunn'),
  acknan: w('acknan'), norton: w('norton'), handed: w('handed'), envelope: w('envelope'), five1: w('five', 1), twenty1: w('twenty', 1), morning: w('morning'),
  half1: w('half', 1), themselves2: w('themselves', 2), half2: w('half', 2), someone1: w('someone', 1), charity: w('charity'), evening: w('evening'),
  others: w('others'), happier: w('happier'), amount: w('amount'), five2: w('five', 2), twenty2: w('twenty', 2), difference: w('difference'),
  what: w('what'), went: w('went'), course: w('course'), needs: w('needs'), but2: w('but', 2), week: w('week'), five3: w('five', 3), someone2: w('someone', 2),
  notice: w('notice'), because: w('because'), away2: w('away', 2),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -280, 1.35), F_(T.but1 - 0.4, C, -300, 1.25), { t: T.handed - 0.4, d: 1.2, x: C, y: -300, z: 1.25 },
  F_(T.half1 - 0.4, D, -290, 1.2), F_(T.evening - 0.5, E2, -300, 1.2), F_(T.what - 0.4, F, -280, 1.35),
  F_(T.course - 0.4, G, -270, 1.4), F_(T.but2 - 0.4, H, -290, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
// envelope icon
function envelope(g, x, y, s, a, text, filled = false) {
  if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s);
  if (filled) MM.halo(g, 0, 0, 200, a * 0.6);
  MM.rr(g, -130, -80, 260, 160, 12); MM.fill(g, filled ? a : 0.06 * a); g.fill(); MM.stroke(g, a, 3); g.stroke();
  MM.stroke(g, a, 3, filled ? 0 : 255); g.beginPath(); g.moveTo(-126, -76); g.lineTo(0, 14); g.lineTo(126, -76); g.stroke();
  g.restore();
  if (text) MM.big(g, text, x, y + 130 * s, a, 48 * s);
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  MM.person(g, x - 360, 0, 1.25, 1, true);
  MM.person(g, x + 360, 0, 1.25, p(t, -0.2, 0.4), false);
  const gk = end ? 1 : inOut(clamp((t - 0.6) / 1.6));
  MM.build(g, t, -0.4, x - 230, -160, 90, (g2, a) => MM.box(g2, lerp(x - 230, x + 230, gk), -160 - Math.sin(Math.PI * gk) * 120, 0.8, a, true));
  MM.build(g, t, T.give1 - 0.2, x + 360, -330, 90, (g2, a) => MM.star(g2, x + 360, -330, 60, a, true));
  MM.label(g, 'GIVE IT AWAY', x, -500, p(t, T.give1 - 0.4, 0.4), 26, { weight: 800 });
  MM.pill(g, 'HAPPIEST MONEY', x, -580, win(t, T.happiest1 - 0.3, T.most) + (end ? win(t, T.because + 0.4, null) : 0), 22, true);
  if (end) MM.label(g, 'TRY IT THIS WEEK · $5', x, 60, win(t, T.away2 - 1.0, null), 20, { weight: 800 });
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 250, 0, 1.3, p(t, T.most - 0.3, 0.4), true);
  MM.build(g, t, T.most + 0.1, x + 230, -100, 150, (g2, a) => MM.cart(g2, x + 230, -40, 1.6, a));
  for (let i = 0; i < 3; i++) MM.build(g, t, T.most + 0.6 + i * 0.25, x + 200 + i * 60, -230, 40, (g2, a) => MM.box(g2, x + 180 + i * 60, -230, 0.45, a, false));
  MM.big(g, 'SPEND ON ME = BEST?', x, -540, p(t, T.best - 0.8, 0.4), 56);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '2008 · ELIZABETH DUNN, LARA AKNIN & MICHAEL NORTON', x, -660, win(t, T.but1 - 0.2, null), 18);
  const nm = [['ELIZABETH DUNN', T.dunn], ['LARA AKNIN', T.acknan], ['MICHAEL NORTON', T.norton]];
  nm.forEach(([n, ts], i) => MM.typeText(g, n, x - 420 + i * 420, -570, clamp((t - ts + 0.3) / 0.8), 1, 28));
  MM.label(g, 'PSYCHOLOGISTS', x, -500, p(t, T.y2008, 0.4), 18);
  MM.build(g, t, T.but1 + 0.5, x - 280, -300, 140, (g2, a) => envelope(g2, x - 280, -300, 1.2, a, '$5'));
  MM.build(g, t, T.but1 + 0.9, x + 280, -300, 140, (g2, a) => envelope(g2, x + 280, -300, 1.2, a, '$20', true));
  MM.ripple(g, x - 280, -300, t, T.five1, 80, 360, 0.8); MM.ripple(g, x + 280, -300, t, T.twenty1, 80, 360, 0.8);
  MM.build(g, t, T.handed - 0.4, x, -300, 80, (g2, a) => MM.clock(g2, x, -300, 70, a, t, 0.4, false));
  MM.label(g, 'IN THE MORNING', x, -190, p(t, T.morning - 0.5, 0.4), 18, { weight: 800 });
  MM.label(g, 'EVERYONE GETS AN ENVELOPE', x, -80, p(t, T.envelope - 0.3, 0.4), 18);
}
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  MM.path(g, [[x, -600], [x, 20]], p(t, T.half1, 0.6), 0.5, 2, false);
  // left: on yourself
  MM.big(g, 'ON YOURSELF', x - 360, -560, p(t, T.half1 - 0.2, 0.4), 44);
  MM.person(g, x - 480, 0, 1.1, p(t, T.half1 - 0.3, 0.4), true);
  MM.build(g, t, T.half1 + 0.4, x - 250, -120, 90, (g2, a) => MM.box(g2, x - 250, -80, 0.9, a, false));
  MM.path(g, [[x - 430, -220], [x - 380, -280], [x - 300, -260], [x - 260, -170]], p(t, T.themselves2 - 0.4, 0.8), 0.8, 3, true);
  // right: on others
  MM.big(g, 'ON OTHERS', x + 360, -560, p(t, T.half1 + 0.5, 0.4), 44);
  MM.person(g, x + 200, 0, 1.1, p(t, T.half1 + 0.6, 0.4), true);
  MM.person(g, x + 430, 0, 1.1, p(t, T.half1 + 0.9, 0.4), false);
  const gk = inOut(clamp((t - T.someone1 + 0.2) / 1.0));
  MM.bill(g, lerp(x + 240, x + 400, gk), -220 - Math.sin(Math.PI * gk) * 60, 0.35, p(t, T.someone1 - 0.4, 0.3), '$', true);
  MM.build(g, t, T.charity - 0.4, x + 620, -100, 90, (g2, a) => MM.jar(g2, x + 620, 0, 0.6, a, 0.5));
  MM.label(g, 'OR CHARITY', x + 620, 40, p(t, T.charity - 0.2, 0.4), 14, { weight: 800 });
}
function zoneE(g, t) {
  const x = E2;
  MM.label(g, 'HAPPINESS BY EVENING', x, -680, p(t, T.evening - 0.4, 0.4), 20);
  MM.build(g, t, T.evening - 0.4, x + 600, -600, 60, (g2, a) => MM.clock(g2, x + 600, -600, 50, a, t, 0.3, false));
  const a = p(t, T.evening - 0.3, 0.4), k1 = out(clamp((t - T.evening) / 1.0)), k2 = out(clamp((t - T.others + 0.4) / 1.2));
  const h1 = 180 * k1, h2 = 330 * k2;
  MM.rr(g, x - 470, -80 - h1, 200, h1, 16); MM.stroke(g, a, 3); g.stroke(); MM.label(g, 'SPENT ON SELF', x - 370, -30, a, 18, { weight: 800 });
  MM.rr(g, x + 270, -80 - h2, 200, h2, 16); MM.fill(g, a); g.fill(); MM.halo(g, x + 370, -80 - h2, 120, a * 0.5); MM.label(g, 'SPENT ON OTHERS', x + 370, -30, a, 18, { weight: 800 });
  MM.build(g, t, T.happier - 0.2, x + 370, -560, 70, (g2, aa) => MM.star(g2, x + 370, -500, 44, aa, true));
  MM.pill(g, 'HAPPIER', x + 370, -590, win(t, T.happier - 0.2, null), 20, true);
  // amount didn't matter
  const ak = p(t, T.amount - 0.3, 0.4);
  envelope(g, x - 170, -380, 0.6, ak, '$5'); MM.big(g, '=', x - 50, -380, p(t, T.five2, 0.4), 60);
  MM.label(g, 'AMOUNT', x - 110, -470, ak, 14, { weight: 800 });
  envelope(g, x + 60, -380, 0.6, p(t, T.twenty2 - 0.2, 0.4), '$20', true);
  MM.label(g, 'NO REAL DIFFERENCE', x - 60, -260, win(t, T.difference - 0.5, null), 16, { weight: 800 });
}
function zoneF(g, t) {
  const x = F;
  MM.big(g, 'WHO IT WENT TO', x, -580, p(t, T.what - 0.3, 0.4), 60);
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 360, 0, 1.2, p(t, T.what - 0.3, 0.4), true);
  MM.person(g, x + 360, 0, 1.2, p(t, T.what, 0.4), false);
  MM.path(g, [[x - 260, -260], [x, -380], [x + 260, -260]], p(t, T.what + 0.5, 0.8), 1, 4, true);
  MM.build(g, t, T.what + 0.9, x, -380, 60, (g2, a) => MM.coin(g2, x, -400, 30, a));
  MM.label(g, 'NOT HOW MUCH', x, -470, p(t, T.what + 0.4, 0.4), 18, { weight: 800 });
}
function zoneG(g, t) {
  const x = G;
  MM.pill(g, 'YOUR NEEDS FIRST ✓', x, -580, win(t, T.course - 0.2, null), 22);
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.build(g, t, T.course, x - 260, -150, 150, (g2, a) => MM.house(g2, x - 260, 0, 1.2, a, 0.3));
  MM.build(g, t, T.course + 0.5, x + 260, -90, 100, (g2, a) => MM.plate(g2, x + 260, -40, 1.2, a));
  MM.label(g, 'RENT · FOOD · BILLS', x, 50, p(t, T.needs - 0.5, 0.4), 18, { weight: 800 });
}
function zoneH(g, t) {
  const x = H;
  MM.pill(g, 'THIS WEEK', x, -680, win(t, T.but2 - 0.2, null), 22, true);
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  MM.person(g, x - 420, 0, 1.2, p(t, T.but2 - 0.2, 0.4), true);
  MM.person(g, x + 420, 0, 1.2, p(t, T.someone2 - 0.5, 0.4), false);
  const gk = inOut(clamp((t - T.five3 + 0.2) / 1.2));
  MM.build(g, t, T.week - 0.2, x - 300, -240, 90, (g2, a) => MM.bill(g2, lerp(x - 300, x + 300, gk), -240 - Math.sin(Math.PI * gk) * 120, 0.55, a, '$5', true));
  MM.big(g, '$5 → SOMEONE ELSE', x, -520, p(t, T.five3 - 0.3, 0.4), 52);
  MM.build(g, t, T.notice - 0.3, x + 420, -320, 80, (g2, a) => MM.star(g2, x + 420, -320, 50, a, true));
  MM.label(g, 'NOTICE HOW IT FEELS', x, -60, win(t, T.notice - 0.2, null), 20, { weight: 800 });
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
