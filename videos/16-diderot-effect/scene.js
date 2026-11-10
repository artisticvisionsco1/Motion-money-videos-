// 16 — The Diderot effect
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  purchase1: w('purchase', 1), old1: w('old', 1), y1769: w('1769'), diderot1: w('diderot', 1), robe: w('robe'), suddenly: w('suddenly'), furniture: w('furniture'), shabby: w('shabby'),
  so: w('so'), chair: w('chair'), desk: w('desk'), tapestry: w('tapestry'), surrounded: w('surrounded'), poorer: w('poorer'),
  wrote: w('wrote'), essay: w('essay'), regrets: w('regrets'), gown: w('gown'), today: w('today'), diderot2: w('diderot', 2), effect: w('effect'),
  phone: w('phone'), case_: w('case'), sofa: w('sofa'), rug: w('rug'), course: w('course'), wrong: w('wrong'), but: w('but'), ask: w('ask'), want: w('want'),
  because: w('because'), starts: w('starts'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000;
const OPEN = { x: 0, y: -240, z: 1.2 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.y1769 - 0.4, B, -260, 1.2), { t: T.so - 0.1, d: 0.8, x: B, y: -250, z: 1.1 }, F_(T.wrote - 0.4, D, -280, 1.25),
  F_(T.phone - 0.5, E2, -260, 1.25), F_(T.course - 0.4, F, -280, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.ground(g, x - 750, x + 750, 0, 0.6);
  const oldK = p(t, T.old1 - 0.4, 0.8);
  const chain = end ? clamp((t - T.because - 0.3) / 4.5) : 0;
  const items = [[x - 560, (g2, a, f) => MM.chair(g2, x - 560, 0, 1.0, a, f)], [x - 290, (g2, a, f) => MM.desk(g2, x - 290, 0, 0.9, a, f)], [x + 300, (g2, a, f) => MM.sofa(g2, x + 300, 0, 0.75, a, f)], [x + 580, (g2, a, f) => MM.phone(g2, x + 580, -130, 0.9, a, '')]];
  items.forEach(([ix, fn], i) => { const lit = clamp(chain * 4 - i); fn(g, (1 - 0.6 * oldK) + 0.6 * oldK * lit, lit > 0.5); if (lit > 0.5) MM.ripple(g, ix, -100, t, T.because + 0.3 + i * 1.1, 30, 200, 0.8); });
  MM.build(g, t, -0.4, x, -150, 120, (g2, a) => MM.box(g2, x, -150, 1.3, a, true));
  MM.pill(g, 'ONE NEW PURCHASE', x, -330, win(t, T.purchase1 - 0.2, T.y1769), 20, true);
  MM.label(g, 'EVERYTHING ELSE LOOKS OLD', x, 60, win(t, T.old1 - 0.2, T.y1769), 20);
  if (end) MM.pill(g, 'THE REAL SPENDING STARTS', x, -330, win(t, T.starts - 1.4, null), 22, true);
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.pill(g, '1769 · DENIS DIDEROT', x, -660, win(t, T.y1769 - 0.2, null), 20);
  MM.build(g, t, T.y1769 + 0.1, x, -150, 200, (g2, a) => MM.robe(g2, x, 0, 1.3, a, t > T.robe - 0.4), 0.9);
  MM.label(g, 'A NEW SCARLET ROBE', x, 60, win(t, T.scarlet ?? T.robe - 0.4, null), 18);
  const rep = (ts) => p(t, ts - 0.2, 0.5);
  const sh = p(t, T.y1769 + 0.4, 0.6);
  MM.chair(g, x - 500, 0, 1.0, (0.35 + 0.65 * rep(T.chair)) * sh, rep(T.chair) > 0.5);
  MM.desk(g, x + 450, 0, 0.9, (0.35 + 0.65 * rep(T.desk)) * sh, rep(T.desk) > 0.5);
  const tk = rep(T.tapestry);
  if (sh > 0) { MM.rr(g, x + 280, -620, 340, 200, 10); MM.fill(g, sh * (0.05 + 0.8 * tk)); g.fill(); MM.stroke(g, sh * (0.4 + 0.6 * tk), 3); g.stroke(); for (let i = 0; i < 5; i++) { MM.stroke(g, sh * 0.5, 2, tk > 0.5 ? 0 : 255); g.beginPath(); g.moveTo(x + 300, -600 + i * 40); g.lineTo(x + 600, -600 + i * 40 + 20); g.stroke(); } }
  MM.label(g, 'SHABBY', x - 500, 60, win(t, T.shabby - 0.2, T.chair), 18);
  // money draining
  const wallet = 1 - clamp((t - T.chair) / (T.poorer - T.chair + 0.3));
  MM.big(g, MM.money(5000 * Math.max(0.05, wallet)), x - 450, -560, p(t, T.so - 0.2, 0.4), 52);
  MM.pill(g, 'MUCH POORER', x - 450, -480, win(t, T.poorer - 0.3, null), 20, true);
}
function zoneD(g, t) {
  const x = D;
  const ck = p(t, T.wrote - 0.1, 0.5);
  MM.rr(g, x - 480, -600, 960, 280, 20); MM.fill(g, 0.05 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke();
  MM.label(g, 'HIS ESSAY', x, -560, ck, 18);
  MM.typeText(g, 'REGRETS ON PARTING WITH', x, -480, clamp((t - T.essay + 0.3) / 1.2), 1, 42);
  MM.typeText(g, 'MY OLD DRESSING GOWN', x, -410, clamp((t - T.regrets + 0.8) / 1.3), 1, 42);
  MM.build(g, t, T.today - 0.3, x, -180, 300, (g2, a) => MM.big(g2, 'THE DIDEROT EFFECT', x, -180, a, 70), 0.8);
  MM.ripple(g, x, -180, t, T.effect, 100, 600, 1.0);
}
function zoneE(g, t) {
  const x = E2;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.build(g, t, T.phone - 0.3, x - 500, -150, 120, (g2, a) => MM.phone(g2, x - 500, -150, 1.1, a, 'NEW'));
  MM.path(g, [[x - 400, -150], [x - 260, -150]], p(t, T.case_ - 0.5, 0.4), 1, 3, true);
  MM.build(g, t, T.case_ - 0.3, x - 170, -150, 120, (g2, a) => { MM.phone(g2, x - 170, -150, 1.1, a * 0.5, ''); MM.rr(g2, x - 245, -290, 150, 280, 26); MM.stroke(g2, a, 5); g2.stroke(); });
  MM.label(g, 'NEEDS A CASE', x - 170, 50, p(t, T.case_, 0.4), 16);
  MM.build(g, t, T.sofa - 0.3, x + 220, -60, 140, (g2, a) => MM.sofa(g2, x + 220, -20, 0.8, a, true));
  MM.path(g, [[x + 380, -80], [x + 470, -80]], p(t, T.rug - 0.5, 0.4), 1, 3, true);
  MM.build(g, t, T.rug - 0.3, x + 560, -20, 100, (g2, a) => { MM.stroke(g2, a, 3); g2.beginPath(); g2.ellipse(x + 560, -20, 110, 26, 0, 0, 7); g2.stroke(); g2.beginPath(); g2.ellipse(x + 560, -20, 80, 16, 0, 0, 7); g2.stroke(); });
  MM.label(g, 'NEEDS A RUG', x + 560, 50, p(t, T.rug, 0.4), 16);
}
function zoneF(g, t) {
  const x = F;
  MM.pill(g, "UPGRADING ISN'T ALWAYS WRONG", x, -620, win(t, T.course - 0.1, null), 20);
  const ck = p(t, T.course + 0.2, 0.5);
  MM.rr(g, x - 600, -500, 1200, 360, 28); MM.fill(g, 0.04 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke();
  MM.label(g, 'BEFORE YOU BUY, ASK:', x, -440, ck, 20);
  MM.typeText(g, 'WHAT ELSE WILL THIS', x, -350, clamp((t - T.but - 0.2) / 1.4), 1, 54);
  MM.typeText(g, 'MAKE ME WANT?', x, -260, clamp((t - T.want + 0.8) / 0.8), 1, 54);
  MM.ripple(g, x, -310, t, T.want + 0.1, 120, 700, 1.0);
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [D, zoneD], [E2, zoneE], [F, zoneF]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
