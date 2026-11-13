// 27 — Scarcity taxes the mind (Mani, Mullainathan, Shafir & Zhao, 2013)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  wallet1: w('wallet', 1), fills1: w('fills', 1), most: w('most'), character: w('character'), but1: w('but', 1), y2013: w('2013'), mani: w('mani'),
  mull: w('malainathan'), sugarcane: w('sugarcane'), india: w('india'), paid: w('paid'), harvest1: w('harvest', 1), before: w('before'), tight: w('tight'),
  worse: w('worse'), after: w('after'), drop: w('drop'), n9: w('9'), iq: w('iq'), same2: w('same', 2), balance: w('balance'), worries: w('worries'),
  space: w('space'), course: w('course'), harder: w('harder'), cushion: w('cushion'), start: w('start'), week: w('week'), automatically: w('automatically'),
  because: w('because'), mind2: w('mind', 2),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -290, 1.4), F_(T.but1 - 0.4, C, -300, 1.2), { t: T.india - 0.4, d: 1.2, x: C, y: -300, z: 1.2 },
  F_(T.before - 0.4, D, -300, 1.2), F_(T.same2 - 0.4, E2, -300, 1.25), F_(T.course - 0.4, F, -280, 1.35),
  F_(T.start - 0.4, G, -300, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
// a head in profile with a "mind" area that fills with worry blocks (k 0..1)
function head(g, x, y, s, a, k, t) {
  if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s);
  MM.stroke(g, a, 3.5); g.beginPath(); g.arc(0, -150, 120, Math.PI * 0.75, Math.PI * 2.25); g.lineTo(90, -40); g.lineTo(60, -20); g.lineTo(60, 40); g.lineTo(-50, 40); g.lineTo(-60, -60); g.stroke();
  const n = Math.floor(k * 12);
  for (let i = 0; i < n; i++) { const c = i % 4, r = Math.floor(i / 4); MM.rr(g, -80 + c * 42, -230 + r * 42, 34, 34, 8); MM.fill(g, a * 0.85); g.fill(); }
  g.restore();
}
function wallet(g, x, y, s, a, coins) {
  if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s);
  MM.rr(g, -140, -90, 280, 180, 22); MM.fill(g, 0.05 * a); g.fill(); MM.stroke(g, a, 3); g.stroke();
  MM.rr(g, 60, -30, 90, 60, 14); MM.stroke(g, a, 3); g.stroke();
  g.restore();
  for (let i = 0; i < coins; i++) MM.coin(g, x - 90 * s + i * 45 * s, y - 130 * s, 22 * s, a);
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  const ek = end ? 1 : clamp((t - 0.2) / 2.2);
  MM.build(g, t, -0.4, x - 330, -300, 150, (g2, a) => wallet(g2, x - 330, -300, 1.3, a, Math.round(5 * (1 - ek))));
  MM.label(g, 'YOUR WALLET', x - 330, -150, p(t, 0.2, 0.4), 18, { weight: 800 });
  MM.big(g, 'EMPTIES', x - 330, -600, p(t, T.wallet1 - 0.6, 0.4), 48);
  head(g, x + 330, -190, 1.3, p(t, 0.0, 0.5), end ? 1 : clamp((t - T.fills1 + 0.8) / 1.6), t);
  MM.label(g, 'YOUR MIND', x + 330, -100, p(t, 0.4, 0.4), 18, { weight: 800 });
  MM.big(g, 'FILLS', x + 330, -620, p(t, T.fills1 - 0.3, 0.4), 48);
  if (end) MM.pill(g, 'BUILD A SMALL CUSHION', x, 10, win(t, T.because + 0.6, null), 22, true);
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 380, 0, 1.3, p(t, T.most - 0.3, 0.4), true);
  MM.build(g, t, T.most + 0.2, x + 60, -260, 110, (g2, a) => MM.receipt(g2, x + 60, -260, 0.8, a, [['IMPULSE', '$60'], ['LATE FEE', '$35'], ['OVERDRAFT', '$34']], '$129'));
  MM.big(g, 'BAD CHOICES = BAD CHARACTER?', x, -580, p(t, T.most + 0.4, 0.4), 46);
  MM.build(g, t, T.character - 0.2, x + 360, -300, 120, (g2, a) => { MM.stroke(g2, a, 8); g2.beginPath(); g2.moveTo(x + 280, -380); g2.lineTo(x + 440, -220); g2.moveTo(x + 440, -380); g2.lineTo(x + 280, -220); g2.stroke(); });
  MM.label(g, 'NOT SO FAST', x + 360, -160, p(t, T.character + 0.4, 0.4), 18, { weight: 800 });
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '2013 · ANANDI MANI, SENDHIL MULLAINATHAN ET AL.', x, -680, win(t, T.but1 - 0.2, null), 20);
  MM.typeText(g, 'ANANDI MANI', x - 330, -580, clamp((t - T.mani + 0.4) / 0.8), 1, 34);
  MM.typeText(g, 'SENDHIL MULLAINATHAN', x + 300, -580, clamp((t - T.mull + 0.4) / 0.9), 1, 34);
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  // sugarcane stalks
  for (let i = 0; i < 14; i++) {
    const sx = x - 680 + i * 50, h = 300 + (i * 37) % 90, k = p(t, T.but1 + 0.4 + i * 0.05, 0.6);
    MM.path(g, [[sx, 0], [sx + 6, -h]], k, 0.8, 3, false);
    MM.path(g, [[sx + 3, -h * 0.6], [sx + 40, -h * 0.75]], k, 0.6, 2, false);
  }
  MM.label(g, 'SUGARCANE · INDIA', x - 360, 40, p(t, T.india - 0.4, 0.4), 16, { weight: 800 });
  MM.person(g, x - 250, 0, 0.9, p(t, T.but1 + 1.0, 0.4), true);
  // a year calendar with one payday
  const ck = p(t, T.but1 + 1.4, 0.5);
  for (let m = 0; m < 12; m++) {
    const cx = x + 80 + (m % 6) * 100, cy = -460 + Math.floor(m / 6) * 110;
    const pay = m === 11;
    MM.rr(g, cx - 40, cy - 40, 80, 80, 12); MM.fill(g, ck * (pay ? 0.9 * p(t, T.harvest1 - 0.3, 0.4) : 0.04)); g.fill(); MM.stroke(g, ck, 2.5); g.stroke();
    MM.label(g, 'JFMAMJJASOND'[m], cx, cy, ck, 16, { weight: 800, v: pay && t > T.harvest1 ? 0 : 255 });
  }
  MM.pill(g, 'PAID ONCE A YEAR · AT HARVEST', x + 330, -230, win(t, T.harvest1 - 0.5, null), 18, true);
}
function zoneD(g, t) {
  const x = D;
  MM.label(g, 'SAME FARMERS · THINKING TEST', x, -680, p(t, T.before - 0.3, 0.4), 20);
  const a1 = p(t, T.before - 0.3, 0.4), a2 = p(t, T.after - 0.5, 0.4);
  MM.label(g, 'BEFORE HARVEST', x - 380, -600, a1, 18, { weight: 800 });
  MM.label(g, 'MONEY TIGHT', x - 380, -560, p(t, T.tight - 0.3, 0.4), 14);
  MM.label(g, 'AFTER HARVEST', x + 380, -600, a2, 18, { weight: 800 });
  const h1 = 230 * out(clamp((t - T.tight + 0.2) / 1.2)), h2 = 360 * out(clamp((t - T.after + 0.3) / 1.0));
  MM.rr(g, x - 480, -100 - h1, 200, h1, 16); MM.stroke(g, a1, 3); g.stroke();
  MM.rr(g, x + 280, -100 - h2, 200, h2, 16); MM.fill(g, a2); g.fill(); MM.halo(g, x + 380, -100 - h2, 120, a2 * 0.5);
  MM.person(g, x - 620, -100, 0.8, a1, true); MM.person(g, x + 620, -100, 0.8, a2, true);
  MM.label(g, 'SCORE', x - 380, 30, a1, 14); MM.label(g, 'SCORE', x + 380, 30, a2, 14);
  const dk = p(t, T.drop - 0.3, 0.4);
  MM.big(g, '9 – 10 IQ POINTS', x, -400, p(t, T.n9 - 0.3, 0.4), 54);
  MM.label(g, 'THE DROP WAS LIKE LOSING', x, -470, dk, 16, { weight: 800 });
  MM.label(g, 'FROM MONEY STRESS ALONE', x, -330, p(t, T.iq, 0.4), 16, { weight: 800 });
  MM.ripple(g, x, -400, t, T.iq, 100, 480, 1.0);
}
function zoneE(g, t) {
  const x = E2;
  MM.pill(g, 'SAME PEOPLE · ONLY THE BALANCE CHANGED', x, -680, win(t, T.same2 - 0.2, null), 20, true);
  head(g, x - 300, -190, 1.5, p(t, T.same2 - 0.3, 0.4), 0.3 + 0.7 * p(t, T.worries - 0.3, 1.2), t);
  MM.label(g, 'MONEY WORRIES', x - 300, -60, p(t, T.worries - 0.2, 0.4), 18, { weight: 800 });
  // mental bandwidth bar
  const bk = p(t, T.same2, 0.4), used = 0.25 + 0.55 * p(t, T.worries - 0.2, 1.0);
  MM.label(g, 'MENTAL SPACE', x + 340, -520, bk, 18, { weight: 800 });
  MM.rr(g, x + 120, -470, 440, 60, 30); MM.stroke(g, bk, 3); g.stroke();
  MM.rr(g, x + 126, -464, 428 * used, 48, 24); MM.fill(g, bk); g.fill();
  MM.label(g, 'WORRY', x + 126 + 428 * used / 2, -440, bk, 14, { weight: 800, v: 0 });
  MM.label(g, 'LEFT FOR LIFE', x + 340, -360, p(t, T.space - 0.4, 0.4), 16);
  MM.big(g, MM.money(Math.round(80 + 2920 * p(t, T.balance - 0.4, 1.0))), x + 340, -230, p(t, T.balance - 0.6, 0.4), 60);
  MM.label(g, 'BANK BALANCE', x + 340, -160, p(t, T.balance - 0.6, 0.4), 16, { weight: 800 });
}
function zoneF(g, t) {
  const x = F;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.build(g, t, T.course - 0.3, x - 300, -200, 120, (g2, a) => { MM.person(g2, x - 300, 0, 1.1, a, true, 'up'); });
  MM.label(g, 'TRY HARDER ✗', x - 300, 40, p(t, T.harder - 0.3, 0.4), 20, { weight: 800 });
  const ck = p(t, T.harder + 0.3, 0.5);
  MM.rr(g, x + 120, -90, 360, 90, 45); MM.fill(g, ck * 0.85); g.fill(); MM.halo(g, x + 300, -45, 200, ck * 0.5);
  MM.person(g, x + 300, -90, 1.0, ck, false, 'rest');
  MM.label(g, 'A SMALL CUSHION ✓', x + 300, 40, ck, 20, { weight: 800 });
  MM.big(g, 'THE FIX', x, -560, p(t, T.course, 0.4), 60);
}
function zoneG(g, t) {
  const x = G;
  MM.pill(g, 'START: ONE WEEK OF EXPENSES', x, -680, win(t, T.start - 0.2, null), 22, true);
  for (let i = 0; i < 7; i++) {
    const cx = x - 560 + i * 140, a = p(t, T.start - 0.2 + i * 0.08, 0.35);
    MM.rr(g, cx - 55, -560, 110, 130, 14); MM.stroke(g, a, 2.5); g.stroke();
    MM.label(g, ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], cx, -530, a, 14, { weight: 800 });
    const ck = clamp((t - T.week - i * 0.25) / 0.6), e = inOut(ck);
    if (ck > 0 && ck < 1) MM.coin(g, lerp(cx, x + 420, e), lerp(-470, -260, e) - Math.sin(Math.PI * e) * 120, 16, 1);
    MM.coin(g, cx, -470, 20, a * (1 - (ck > 0 ? 1 : 0)) + a * 0.25);
  }
  MM.jar(g, x + 420, -90, 1.2, p(t, T.week - 0.3, 0.4), clamp((t - T.week) / 2.2) * 0.75);
  MM.build(g, t, T.automatically - 0.5, x - 200, -230, 80, (g2, a) => MM.toggle(g2, x - 200, -230, 1.3, a, p(t, T.automatically - 0.2, 0.4)));
  MM.label(g, 'SET ASIDE AUTOMATICALLY', x - 200, -140, p(t, T.automatically - 0.3, 0.4), 18, { weight: 800 });
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
