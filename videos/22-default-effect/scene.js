// 22 — The default effect (Madrian & Shea, 2001)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  never1: w('never', 1), decides1: w('decides', 1), most2: w('most', 2), retirement1: w('retirement', 1), but1: w('but', 1), y2001: w('2001'),
  madrian: w('madrian'), shea: w('shea'), company: w('company'), changed: w('changed'), one: w('one', 1), workers: w('workers'), enrolled: w('enrolled'),
  automatically: w('automatically'), unless: w('unless'), opted: w('opted'), participation: w('participation'), p37: w('37%'), eighty: w('eighty'),
  same1: w('same', 1), same2: w('same', 2), different: w('different'), we: w('we'), stick: w('stick'), set1: w('set', 1),
  course: w('course'), subscriptions: w('subscriptions'), renew: w('renew'), so: w('so'), check: w('check'), set2: w('set', 2),
  purpose: w('purpose'), because: w('because'), never2: w('never', 2),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000, I = 40000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most2 - 0.4, B, -280, 1.4), F_(T.but1 - 0.4, C, -300, 1.25), { t: T.changed - 0.6, d: 1.2, x: C, y: -300, z: 1.25 },
  F_(T.workers - 0.5, D, -300, 1.25), F_(T.participation - 0.4, E2, -300, 1.2), F_(T.same1 - 0.4, F, -290, 1.25),
  F_(T.we - 0.4, G, -280, 1.35), F_(T.course - 0.4, H, -300, 1.25), F_(T.so - 0.4, I, -300, 1.2),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
// settings panel row: label + toggle
function row(g, x, y, wd, a, text, on) {
  MM.rr(g, x - wd / 2, y - 45, wd, 90, 20); MM.fill(g, 0.04 * a); g.fill(); MM.stroke(g, a * 0.7, 2.5); g.stroke();
  MM.label(g, text, x - wd / 2 + 40, y, a, 18, { weight: 800, align: 'left' });
  MM.toggle(g, x + wd / 2 - 90, y, 0.9, a, on);
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  MM.label(g, 'SETTINGS · PRE-SELECTED FOR YOU', x - 260, -640, p(t, 0.1, 0.4), 18);
  const rows = ['RETIREMENT PLAN', 'AUTO-RENEW', 'OVERDRAFT', 'INSURANCE ADD-ON'];
  rows.forEach((r, i) => {
    const a = p(t, -0.4 + i * 0.25, 0.4);
    const on = end && i === 0 ? 1 : end && i === 1 ? 1 - p(t, T.because + 0.8, 0.4) : end && i === 2 ? 1 - p(t, T.because + 1.2, 0.4) : 1;
    row(g, x - 260, -520 + i * 130, 620, a, r, on);
  });
  // a cursor that never touches them
  const cx = x + 330 + Math.sin(t * 1.3) * 40, cy = -330 + Math.cos(t * 1.1) * 30, ca = p(t, T.never1 - 0.3, 0.4);
  MM.stroke(g, ca, 3); MM.fill(g, ca * 0.9); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy + 70); g.lineTo(cx + 18, cy + 52); g.lineTo(cx + 34, cy + 82); g.lineTo(cx + 46, cy + 76); g.lineTo(cx + 30, cy + 46); g.lineTo(cx + 54, cy + 46); g.closePath(); g.fill();
  MM.label(g, 'NEVER CLICKED', x + 360, -200, ca, 20, { weight: 800 });
  MM.pill(g, 'STILL DECIDES YOUR MONEY', x + 360, -120, win(t, T.decides1 - 0.3, T.most2) + (end ? win(t, T.never2 - 0.2, null) : 0), 20, true);
  if (end) MM.pill(g, 'SET THE GOOD ONES ON PURPOSE', x - 260, 0, win(t, T.because + 0.6, null), 22);
}
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 280, 0, 1.3, p(t, T.most2 - 0.3, 0.4), true);
  MM.build(g, t, T.most2, x + 220, -280, 150, (g2, a) => MM.sticky(g2, x + 220, -280, 1.0, a, ['MY CHOICES', '✓ RETIREMENT', '✓ SAVINGS', '✓ SPENDING']));
  MM.label(g, 'I DECIDE MY OWN MONEY', x, -560, p(t, T.retirement1 - 0.6, 0.4), 24, { weight: 800 });
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '2001 · BRIGITTE MADRIAN & DENNIS SHEA', x, -660, win(t, T.but1, null), 20);
  MM.typeText(g, 'ECONOMISTS', x, -560, clamp((t - T.y2001) / 0.8), 1, 30);
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.build(g, t, T.but1 + 0.1, x - 300, -200, 170, (g2, a) => MM.building(g2, x - 300, 0, 320, 400, a, 0.3));
  MM.label(g, 'ONE COMPANY', x - 300, 40, p(t, T.company - 0.3, 0.4), 18, { weight: 800 });
  MM.person(g, x + 230, 0, 1.0, p(t, T.madrian - 0.4, 0.4), true);
  MM.person(g, x + 450, 0, 1.0, p(t, T.shea - 0.4, 0.4), true);
  MM.label(g, 'MADRIAN', x + 230, 40, p(t, T.madrian - 0.2, 0.4), 14);
  MM.label(g, 'SHEA', x + 450, 40, p(t, T.shea - 0.2, 0.4), 14);
  MM.build(g, t, T.changed - 0.3, x + 340, -380, 120, (g2, a) => { MM.big(g2, '1', x + 340, -400, a, 110); MM.label(g2, 'CHANGE ONLY', x + 340, -310, a, 18, { weight: 800 }); });
  MM.ripple(g, x + 340, -380, t, T.one, 80, 360, 0.9);
}
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  for (let i = 0; i < 3; i++) { const wk = MM.walk(t, T.workers - 0.5 + i * 0.2, x - 900 - i * 120, x - 560 + i * 120, 1.0); MM.person(g, wk.x, wk.bob, 0.8, p(t, T.workers - 0.5 + i * 0.2, 0.3), true); }
  MM.label(g, 'NEW WORKERS', x - 440, 40, p(t, T.workers, 0.4), 16, { weight: 800 });
  // enrolment form
  const fa = p(t, T.workers - 0.4, 0.5);
  MM.rr(g, x - 160, -620, 640, 560, 26); MM.fill(g, 0.04 * fa); g.fill(); MM.stroke(g, fa, 3); g.stroke();
  MM.label(g, 'RETIREMENT PLAN', x + 160, -560, fa, 22, { weight: 800 });
  const on = p(t, T.automatically - 0.3, 0.5);
  MM.toggle(g, x + 160, -420, 1.6, fa, on);
  MM.label(g, on > 0.5 ? 'ENROLLED' : 'NOT ENROLLED', x + 160, -320, fa, 20, { weight: 800 });
  MM.pill(g, 'AUTOMATICALLY', x + 160, -250, win(t, T.automatically - 0.2, null), 20, true);
  MM.build(g, t, T.unless - 0.3, x + 160, -140, 90, (g2, a) => { MM.rr(g2, x + 40, -180, 240, 70, 18); MM.stroke(g2, a * 0.7, 2.5); g2.stroke(); MM.label(g2, 'OPT OUT', x + 160, -145, a * 0.8, 18); });
  MM.label(g, 'YOU CAN STILL LEAVE', x + 160, -90 + 0, win(t, T.opted, null), 14);
}
function zoneE(g, t) {
  const x = E2;
  MM.label(g, 'WORKERS IN THE PLAN', x, -680, p(t, T.participation - 0.3, 0.4), 20);
  const a1 = p(t, T.participation - 0.3, 0.4), a2 = p(t, T.participation, 0.4);
  MM.pctBar(g, x - 380, -100, 460, 37 * out(clamp((t - T.participation - 0.3) / 2.0)), a1, 'YOU OPT IN');
  MM.pctBar(g, x + 380, -100, 460, 86 * out(clamp((t - T.eighty + 0.4) / 1.2)), a2, 'AUTO-ENROLLED');
  MM.build(g, t, T.participation - 0.2, x - 600, -330, 80, (g2, a) => MM.toggle(g2, x - 600, -330, 1.1, a, 0));
  MM.build(g, t, T.participation + 0.2, x + 600, -330, 80, (g2, a) => MM.toggle(g2, x + 600, -330, 1.1, a, 1));
  MM.label(g, 'DEFAULT OFF', x - 600, -260, p(t, T.participation, 0.4), 14, { weight: 800 });
  MM.label(g, 'DEFAULT ON', x + 600, -260, p(t, T.participation + 0.4, 0.4), 14, { weight: 800 });
  const ck = p(t, T.eighty + 0.9, 0.4);
  MM.label(g, '86 − 37', x, -440, ck, 26, { weight: 800 });
  MM.big(g, '+' + Math.round(49 * out(clamp((t - T.eighty - 0.9) / 1.0))), x, -340, ck, 96);
  MM.label(g, 'POINTS', x, -260, ck, 20, { weight: 800 });
  MM.ripple(g, x, -340, t, T.eighty + 1.9, 100, 500, 1.0);
}
function zoneF(g, t) {
  const x = F;
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  [-1, 1].forEach((sd, j) => {
    const cx = x + sd * 360;
    for (let i = 0; i < 3; i++) MM.person(g, cx - 120 + i * 120, 0, 0.75, p(t, T.same1 - 0.4 + i * 0.1, 0.35), true);
    MM.build(g, t, T.same2 - 0.3 + j * 0.2, cx, -330, 110, (g2, a) => MM.cheque(g2, cx, -330, 0.7, a, '$4,000 / MO', false));
    MM.toggle(g, cx, -520, 1.2, p(t, T.different - 0.5, 0.4), j);
  });
  MM.label(g, 'SAME PEOPLE', x, -160, win(t, T.same1 - 0.2, null), 20, { weight: 800 });
  MM.label(g, 'SAME PAY', x, -330, win(t, T.same2 - 0.2, null), 20, { weight: 800 });
  MM.pill(g, 'ONLY THE DEFAULT CHANGED', x, -650, win(t, T.different - 0.3, null), 22, true);
}
function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.build(g, t, T.we - 0.3, x - 200, -80, 170, (g2, a) => MM.sofa(g2, x - 200, 0, 1.4, a, false));
  MM.person(g, x - 200, -90, 1.0, p(t, T.we - 0.1, 0.4), true, 'rest');
  MM.label(g, 'PATH OF LEAST RESISTANCE', x - 200, 40, p(t, T.stick - 0.3, 0.4), 16);
  MM.build(g, t, T.stick - 0.2, x + 330, -260, 100, (g2, a) => MM.toggle(g2, x + 330, -260, 1.6, a, 1));
  MM.label(g, 'WHATEVER IS ALREADY SET', x + 330, -150, win(t, T.set1 - 0.6, null), 18, { weight: 800 });
  MM.pill(g, 'WE STICK WITH IT', x, -560, win(t, T.stick - 0.3, null), 22, true);
}
function zoneH(g, t) {
  const x = H;
  MM.pill(g, 'DEFAULTS CAN WORK AGAINST YOU', x, -680, win(t, T.course - 0.3, null), 20);
  const subs = [['STREAMING', 15.99], ['MUSIC', 10.99], ['CLOUD', 9.99], ['GYM APP', 12.99]];
  subs.forEach(([n, v], i) => {
    const a = p(t, T.course - 0.2 + i * 0.25, 0.4);
    row(g, x - 230, -560 + i * 120, 600, a, n + '  $' + v + '/MO', 1);
  });
  MM.label(g, 'AUTO-RENEW', x - 2, -640, p(t, T.subscriptions - 0.4, 0.4), 14);
  const tot = subs.reduce((s, [, v]) => s + v, 0) * 12;
  const k = out(clamp((t - T.subscriptions + 0.3) / 2.0));
  MM.big(g, MM.money(Math.round(tot * k)), x + 400, -380, p(t, T.subscriptions - 0.3, 0.4), 64);
  MM.label(g, 'PER YEAR', x + 400, -310, p(t, T.subscriptions - 0.3, 0.4), 18, { weight: 800 });
  MM.pill(g, 'QUIETLY RENEWS', x + 400, -200, win(t, T.renew - 0.3, null), 20, true);
}
function zoneI(g, t) {
  const x = I;
  MM.pill(g, 'CHECK EVERY DEFAULT', x, -680, win(t, T.check - 0.4, null), 22, true);
  const rows = [['AUTO-SAVE 10% OF PAY', 0, 1], ['RETIREMENT MATCH', 0, 1], ['UNUSED SUBSCRIPTIONS', 1, 0], ['PAY CARD IN FULL', 0, 1]];
  rows.forEach(([n, from, to], i) => {
    const a = p(t, T.so - 0.2 + i * 0.25, 0.4);
    const f = p(t, T.set2 - 0.3 + i * 0.35, 0.4);
    row(g, x - 120, -560 + i * 130, 700, a, n, lerp(from, to, f));
    MM.label(g, to ? 'ON ✓' : 'OFF ✓', x + 330, -560 + i * 130, f, 18, { weight: 800 });
  });
  MM.label(g, 'ON PURPOSE', x - 120, -10, p(t, T.purpose - 0.3, 0.4), 22, { weight: 800 });
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH], [I, zoneI]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
