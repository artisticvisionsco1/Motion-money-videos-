// 13 — Anchoring (Tversky & Kahneman, 1974)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  number1: w('number', 1), pay1: w('pay', 1), most: w('most'), judge: w('judge'), but1: w('but', 1), y1974: w('1974'), tversky: w('tversky'),
  wheel: w('wheel'), rigged: w('rigged'), n10a: w('10', 1), n65a: w('65', 1), asked: w('asked'), african: w('african'), nations: w('nations'),
  n10b: w('10', 2), p25: w('25%'), n65b: w('65', 2), p45: w('45%'), random: w('random'), n20: w('20'),
  anchoring: w('anchoring'), everywhere: w('everywhere'), original: w('original'), crossed: w('crossed'), sale: w('sale'), expensive: w('expensive'), wine: w('wine'),
  salary: w('salary'), negotiation: w('negotiation'), course: w('course'), trick: w('trick'), information: w('information'),
  but2: w('but', 2), ignore: w('ignore'), pay2: w('pay', 2), seen: w('seen'), because: w('because'), notice: w('notice'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000;
const OPEN = { x: 0, y: -280, z: 1.25 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -250, 1.4), F_(T.but1 - 0.4, C, -280, 1.2), F_(T.asked - 0.4, D, -290, 1.1),
  F_(T.anchoring - 0.6, E2, -290, 1.1), F_(T.course - 0.4, F, -260, 1.4), F_(T.but2 - 0.4, G, -280, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

function anchor(g, x, y, s, a) {
  if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s); MM.stroke(g, a, 6);
  g.beginPath(); g.arc(0, -150, 26, 0, 7); g.moveTo(0, -124); g.lineTo(0, 60); g.moveTo(-60, -90); g.lineTo(60, -90);
  g.moveTo(-110, 0); g.quadraticCurveTo(-90, 80, 0, 90); g.quadraticCurveTo(90, 80, 110, 0); g.stroke();
  g.beginPath(); g.moveTo(-110, 0); g.lineTo(-130, 25); g.moveTo(110, 0); g.lineTo(130, 25); g.stroke();
  MM.halo(g, 0, -30, 220, a * 0.5); g.restore();
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  const drop = out(clamp((t + 0.2) / 0.9));
  MM.stroke(g, drop, 3); g.setLineDash([6, 8]); g.beginPath(); g.moveTo(x - 300, -900); g.lineTo(x - 300, lerp(-900, -470, drop)); g.stroke(); g.setLineDash([]);
  anchor(g, x - 300, lerp(-720, -290, drop), 1.4, drop);
  MM.big(g, '$999', x - 300, lerp(-560, -130, drop) + 160, drop, 64);
  MM.label(g, 'FIRST NUMBER', x - 300, 80, p(t, T.number1, 0.4), 20);
  MM.build(g, t, T.number1 + 0.3, x + 330, -280, 150, (g2, a) => MM.tag(g2, x + 330, -480, a, 0.1 * Math.sin(t * 2), '$499', 2.6));
  MM.pill(g, 'WHAT YOU PAY', x + 330, 80, win(t, T.pay1 - 0.3, T.most) + (end ? win(t, T.because + 1.5, null) : 0), 20, true);
  MM.path(g, [[x - 150, -350], [x + 200, -330]], p(t, T.decides ?? T.number1 + 0.6, 0.6), 0.8, 3, true);
  if (end) MM.label(g, 'UNLESS YOU NOTICE IT', x, 0, win(t, T.notice - 0.8, null), 24);
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 250, 0, 1.15, p(t, T.most - 0.1, 0.4), true);
  for (let i = 0; i < 3; i++) { const a = p(t, T.most + 0.3 + i * 0.12, 0.3); MM.stroke(g, a, 2.5); g.beginPath(); g.arc(x - 190 + i * 55, -200 - i * 40, 8 + i * 4, 0, 7); g.stroke(); }
  MM.build(g, t, T.judge - 0.3, x + 220, -340, 200, (g2, a) => MM.tag(g2, x + 220, -480, a, 0.1 * Math.sin(t * 2), '$ ?', 2.2));
  MM.pill(g, 'I JUDGE PRICES MYSELF', x + 100, -600, win(t, T.judge, null), 20);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '1974 · TVERSKY & KAHNEMAN', x, -680, win(t, T.but1, null), 20);
  const spin = t < T.wheel ? 0 : (1 - Math.exp(-(t - T.wheel) * 0.9)) * 26;
  const stop = t > T.n65a ? 65 : 10;
  const rot = -spin + (t > T.rigged ? 0 : 0);
  const labels = ['10', '35', '65', '80', '20', '50', '5', '90'];
  MM.build(g, t, T.but1 + 0.1, x - 200, -320, 280, (g2, a) => MM.wheel(g2, x - 200, -320, 260, a, rot, labels), 1.0);
  MM.pill(g, 'RIGGED', x + 330, -520, win(t, T.rigged - 0.2, null), 24, true);
  MM.big(g, '10', x + 260, -340, p(t, T.n10a - 0.2, 0.4), 110);
  MM.label(g, 'OR', x + 380, -340, p(t, T.n10a + 0.3, 0.4), 22);
  MM.big(g, '65', x + 500, -340, p(t, T.n65a - 0.2, 0.4), 110);
}
function zoneD(g, t) {
  const x = D;
  const ck = p(t, T.asked - 0.1, 0.5);
  MM.rr(g, x - 620, -680, 1240, 150, 24); MM.fill(g, 0.04 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke();
  MM.typeText(g, '% OF AFRICAN COUNTRIES IN THE UN?', x, -605, clamp((t - T.asked) / 1.8), 1, 40);
  const groups = [[x - 320, '10', 25, T.n10b, T.p25], [x + 320, '65', 45, T.n65b, T.p45]];
  groups.forEach(([gx, saw, guess, ts, tg]) => {
    const a = p(t, ts - 0.6, 0.5);
    for (let i = 0; i < 5; i++) { g.save(); g.translate(gx - 160 + i * 80, 0); g.scale(0.45, 0.45); MM.person(g, 0, 0, 1, a, i === 2); g.restore(); }
    MM.pill(g, 'SAW ' + saw, gx, -120, a, 20, true);
    const v = guess * out(clamp((t - tg + 0.3) / 0.8));
    MM.pctBar(g, gx, -200, 230, v, p(t, tg - 0.4, 0.4), 'GUESS');
  });
  MM.pill(g, '+20 POINTS', x, -330, win(t, T.n20 - 0.3, null), 26, true);
  MM.label(g, 'FROM A RANDOM NUMBER', x, -260, win(t, T.random, null), 18);
}
function zoneE(g, t) {
  const x = E2;
  MM.build(g, t, T.anchoring - 0.3, x, -640, 260, (g2, a) => MM.big(g2, 'ANCHORING', x, -640, a, 78), 0.8);
  // sale tag
  MM.build(g, t, T.anchoring + 0.7, x - 460, -340, 130, (g2, a) => MM.tag(g2, x - 460, -500, a, 0.08 * Math.sin(t * 2), '$200', 2.0));
  const ck = p(t, T.crossed - 0.1, 0.4); MM.stroke(g, ck, 6); g.beginPath(); g.moveTo(x - 520, -330); g.lineTo(x - 520 + 120 * ck, -230); g.stroke();
  MM.big(g, 'SALE $120', x - 460, -100, p(t, T.sale - 0.2, 0.4), 34);
  // wine list
  MM.build(g, t, T.everywhere - 0.2, x, -300, 150, (g2, a) => { MM.rr(g2, x - 140, -470, 280, 340, 16); MM.stroke(g2, a, 3); g2.stroke(); MM.label(g2, 'WINE LIST', x, -430, a, 16);
    [['RESERVE', '$400', 1], ['HOUSE RED', '$60', 0.6], ['HOUSE WHITE', '$45', 0.6]].forEach(([n, pr, al], i) => { MM.label(g2, n, x - 50, -360 + i * 70, a * al, 14, { align: 'center' }); MM.label(g2, pr, x + 90, -360 + i * 70, a * al, 18, { weight: 800, track: 0 }); }); });
  MM.label(g, 'TOP OF THE LIST', x, -90, win(t, T.wine - 0.2, null), 16);
  // negotiation
  MM.build(g, t, T.salary - 0.4, x + 460, -300, 110, (g2, a) => { MM.person(g2, x + 400, -150, 0.7, a, true); MM.pill(g2, '$90K?', x + 520, -360, a, 26, true); });
  MM.label(g, 'FIRST SALARY NUMBER', x + 460, -90, win(t, T.negotiation - 0.3, null), 16);
}
function zoneF(g, t) {
  const x = F;
  anchor(g, x - 250, -260, 1.0, p(t, T.course - 0.2, 0.5));
  MM.build(g, t, T.information - 0.5, x + 250, -280, 120, (g2, a) => { MM.stroke(g2, a, 4); g2.beginPath(); g2.arc(x + 250, -280, 100, 0, 7); g2.stroke(); MM.big(g2, 'i', x + 250, -280, a, 110); });
  MM.pill(g, 'NOT ALWAYS A TRICK', x - 250, -500, win(t, T.trick - 0.4, null), 20);
  MM.pill(g, 'SOMETIMES JUST INFORMATION', x + 200, -500, win(t, T.information - 0.2, null), 20, true);
}
function zoneG(g, t) {
  const x = G;
  MM.build(g, t, T.but2, x - 360, -320, 150, (g2, a) => MM.tag(g2, x - 360, -500, a, 0.08 * Math.sin(t * 2), '$200', 2.2));
  const cv = inOut(clamp((t - T.ignore + 0.1) / 0.6));
  if (cv > 0) { MM.rr(g, x - 480, -560, 240, 420 * cv, 20); g.fillStyle = '#000'; g.fill(); MM.stroke(g, 1, 3); g.stroke(); if (cv > 0.9) MM.label(g, 'IGNORED', x - 360, -350, 1, 20); }
  MM.label(g, 'BEFORE YOU DECIDE', x - 360, -40, win(t, T.but2 + 0.3, null), 18);
  MM.typeText(g, 'WHAT WOULD I PAY', x + 230, -380, clamp((t - T.pay2 + 0.6) / 0.8), 1, 50);
  MM.typeText(g, "IF I'D NEVER SEEN IT?", x + 230, -300, clamp((t - T.seen + 0.4) / 0.8), 1, 50);
  MM.ripple(g, x + 230, -340, t, T.seen + 0.5, 100, 520, 1.0);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
