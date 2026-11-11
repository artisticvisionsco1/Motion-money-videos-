// 17 — The endowment effect (Kahneman, Knetsch & Thaler, 1990)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  yours1: w('yours', 1), most: w('most'), price2: w('price', 2), but1: w('but', 1), y1990: w('1990'), mugs: w('mugs'), trade: w('trade'),
  mug1: w('mug', 1), d7: w('$7'), without: w('without'), d3: w('$3'), same1: w('same', 1), owning: w('owning'), doubled: w('doubled'),
  this1: w('this'), endowment: w('endowment'), cars: w('cars'), homes: w('homes'), free: w('free'), trials: w('trials'), loss: w('loss'),
  closets: w('closets'), course: w('course'), memories: w('memories'), but3: w('but', 3), keep: w('keep'), own: w('own'), today: w('today'),
  because: w('because'), sellers: w('sellers'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -260, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -260, 1.4), F_(T.but1 - 0.4, C, -270, 1.1), F_(T.mug1 - 0.6, D, -290, 1.15),
  F_(T.this1 - 0.4, E2, -280, 1.1), F_(T.free - 0.6, F, -260, 1.3), F_(T.course - 0.4, G, -260, 1.35),
  F_(T.but3 - 0.4, H, -280, 1.25), F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  MM.person(g, x - 380, 0, 1.15, 1, true);
  const own = end ? 1 : p(t, T.yours1 - 0.6, 0.6);
  MM.build(g, t, -0.4, x - 60, -120, 110, (g2, a) => MM.mug(g2, lerp(x + 60, x - 230, own), -60 * own, 1.0, a, own > 0.5));
  const v = 3 + 4 * (end ? 1 : out(clamp((t - 0.6) / 2.2)));
  MM.build(g, t, 0.2, x + 330, -300, 130, (g2, a) => MM.tag(g2, x + 330, -500, a, 0.1 * Math.sin(t * 2), '$' + v.toFixed(2), 2.6));
  MM.label(g, 'MINE = WORTH MORE', x, 70, win(t, T.yours1 - 0.3, T.most) + (end ? win(t, T.because + 0.6, null) : 0), 22);
  if (end) MM.pill(g, 'SELLERS KNOW IT', x + 330, -600, win(t, T.sellers - 0.4, null), 22, true);
}
function zoneB(g, t) {
  const x = B;
  MM.build(g, t, T.most - 0.2, x - 250, -280, 150, (g2, a) => MM.tag(g2, x - 250, -470, a, 0.08 * Math.sin(t * 2), '$5', 2.4));
  MM.big(g, '=', x, -280, p(t, T.most + 0.6, 0.4), 120);
  MM.build(g, t, T.price2 - 0.5, x + 250, -280, 150, (g2, a) => MM.tag(g2, x + 250, -470, a, -0.08 * Math.sin(t * 2), '$5', 2.4));
  MM.label(g, 'A PRICE IS JUST A PRICE?', x, -40, win(t, T.most + 0.3, null), 22);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '1990 · KAHNEMAN, KNETSCH & THALER', x, -680, win(t, T.but1, null), 20);
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  for (let i = 0; i < 8; i++) {
    const px = x - 595 + i * 170, hasMug = i % 2 === 0;
    MM.person(g, px, 0, 1.0, p(t, T.but1 + 0.1 + i * 0.07, 0.4), hasMug && t > T.mugs);
    if (hasMug) MM.build(g, t, T.mugs - 0.2 + i * 0.05, px + 60, -150, 40, (g2, a) => MM.mug(g2, px + 70, -90, 0.42, a, true));
  }
  MM.pill(g, 'HALF GET A MUG', x, -470, win(t, T.mugs, T.trade), 20, true);
  const nm = [['DANIEL KAHNEMAN', T.but1 + 1.1], ['JACK KNETSCH', T.but1 + 2.6], ['RICHARD THALER', T.but1 + 3.3]];
  nm.forEach(([n, ts], i) => MM.typeText(g, n, x - 420 + i * 420, -580, clamp((t - ts) / 0.8), 1 - p(t, T.mugs - 0.4, 0.4), 34));
  MM.label(g, 'ECONOMISTS', x, -480, win(t, T.but1 + 0.6, T.mugs - 0.4), 20);
  MM.rr(g, x - 700, -400, 1400, 400, 24); MM.stroke(g, 0.35 * p(t, T.but1, 0.6), 2); g.stroke();
  MM.label(g, 'ONE CLASSROOM', x + 560, -370, p(t, T.but1 + 0.4, 0.4), 14);
  for (let i = 0; i < 4; i++) { const k = p(t, T.trade - 0.2 + i * 0.1, 0.6); MM.path(g, [[x - 520 + i * 340, -250], [x - 435 + i * 340, -320], [x - 350 + i * 340, -250]], k, 0.8, 3, true); }
  MM.label(g, 'NOW TRADE', x, -470, win(t, T.trade, null), 22);
}
function zoneD(g, t) {
  const x = D;
  MM.build(g, t, T.mug1 - 0.3, x, -560, 100, (g2, a) => MM.mug(g2, x, -500, 0.8, a, true));
  MM.label(g, 'SAME MUG', x, -430, win(t, T.same1 - 0.2, null), 18);
  const sa = p(t, T.mug1 - 0.1, 0.5), ba = p(t, T.without - 0.3, 0.5);
  const hs = 420 * out(clamp((t - T.d7 + 0.4) / 0.8)), hb = 180 * out(clamp((t - T.d3 + 0.4) / 0.8));
  MM.rr(g, x - 380, -40 - hs, 200, hs, 16); MM.fill(g, sa); g.fill();
  MM.big(g, '$7', x - 280, -80 - hs, p(t, T.d7 - 0.3, 0.4), 64);
  MM.label(g, 'OWNERS WANT', x - 280, 10, sa, 18, { weight: 800 });
  MM.rr(g, x + 180, -40 - hb, 200, hb, 16); MM.stroke(g, ba, 3); g.stroke();
  MM.big(g, '$3', x + 280, -80 - hb, p(t, T.d3 - 0.3, 0.4), 64);
  MM.label(g, 'BUYERS PAY', x + 280, 10, ba, 18, { weight: 800 });
  MM.pill(g, '× 2+', x, -250, win(t, T.doubled - 0.3, null), 30, true);
  MM.label(g, 'JUST FROM OWNING IT', x, -180, win(t, T.owning, null), 18);
}
function zoneE(g, t) {
  const x = E2;
  MM.build(g, t, T.this1 - 0.2, x, -640, 260, (g2, a) => MM.big(g2, 'THE ENDOWMENT EFFECT', x, -640, a, 62), 0.8);
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.build(g, t, T.endowment + 0.3, x - 320, -60, 130, (g2, a) => MM.car(g2, x - 320, 0, 1.6, a, true));
  MM.build(g, t, T.cars - 0.6, x - 320, -290, 100, (g2, a) => MM.tag(g2, x - 320, -420, a, 0.1 * Math.sin(t * 2), 'MY PRICE', 1.6));
  MM.build(g, t, T.homes - 0.5, x + 330, -150, 150, (g2, a) => MM.house(g2, x + 330, 0, 1.3, a, 0.4));
  MM.pill(g, 'OVERPRICED', x, -470, win(t, T.cars - 0.4, null), 22, true);
}
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.free - 0.3, x - 300, -250, 140, (g2, a) => MM.phone(g2, x - 300, -250, 1.5, a, 'FREE TRIAL'));
  MM.label(g, '30 DAYS', x - 300, -30, p(t, T.trials, 0.4), 20);
  const yk = p(t, T.free + 1.6, 0.6);
  MM.pill(g, 'FEELS LIKE YOURS', x + 280, -420, yk, 22, true);
  MM.build(g, t, T.loss - 0.6, x + 280, -230, 120, (g2, a) => { MM.rr(g2, x + 140, -290, 280, 110, 20); MM.stroke(g2, a, 3); g2.stroke(); MM.label(g2, 'CANCEL?', x + 280, -235, a, 26, { weight: 800 }); });
  MM.label(g, 'GIVING IT BACK = A LOSS', x + 280, -100, win(t, T.loss - 0.2, null), 18);
}
function zoneG(g, t) {
  const x = G;
  // closet full of unused things
  const ck = p(t, T.closets - 0.6 - (T.closets > T.course ? 0 : 0), 0.6);
  const ca = p(t, T.course - 0.4, 0.6);
  MM.rr(g, x - 620, -620, 520, 620, 14); MM.stroke(g, ca, 3); g.stroke();
  for (let s = 0; s < 4; s++) { MM.stroke(g, ca, 2.5); g.beginPath(); g.moveTo(x - 620, -470 + s * 150); g.lineTo(x - 100, -470 + s * 150); g.stroke();
    for (let i = 0; i < 5; i++) { const k = p(t, T.course - 0.2 + (s * 5 + i) * 0.04, 0.3); MM.rr(g, x - 600 + i * 98, -470 + s * 150 - 70, 80, 66, 8); MM.stroke(g, k * 0.7, 2); g.stroke(); } }
  MM.label(g, 'NEVER USED, NEVER LET GO', x - 360, 50, ca, 16);
  MM.build(g, t, T.memories - 0.4, x + 320, -300, 140, (g2, a) => MM.star(g2, x + 320, -300, 110, a, true));
  MM.pill(g, 'MEMORIES = REAL VALUE ✓', x + 320, -100, win(t, T.memories, null), 20);
}
function zoneH(g, t) {
  const x = H;
  const ck = p(t, T.but3, 0.5);
  MM.rr(g, x - 620, -560, 1240, 420, 30); MM.fill(g, 0.04 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke();
  MM.label(g, 'KEEP · BUY · SELL — FIRST ASK:', x, -500, ck, 20);
  MM.typeText(g, "IF I DIDN'T OWN THIS,", x, -400, clamp((t - T.keep + 0.4) / 1.4), 1, 50);
  MM.typeText(g, 'WOULD I PAY THIS TODAY?', x, -300, clamp((t - T.own + 0.2) / 1.4), 1, 50);
  MM.ripple(g, x, -350, t, T.today, 120, 700, 1.0);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
