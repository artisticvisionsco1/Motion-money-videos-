// 04 — A raise rarely makes people richer (lifestyle creep, hedonic treadmill)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  raise1: w('raise', 1), richer1: w('richer', 1), most: w('most'), problems: w('problems'), disappear: w('disappear'),
  next1: w('next', 1), level: w('level'), but: w('but'), income2: w('income', 2), spending1: w('spending', 1), quietly: w('quietly'),
  better: w('better'), car: w('car'), bigger: w('bigger'), nicer: w('nicer'), afford: w('afford'),
  economists: w('economists'), lifestyle: w('lifestyle'), creep: w('creep'),
  psychologists: w('psychologists'), hedonic: w('hedonic'), joy: w('joy'), upgrade: w('upgrade'), fades: w('fades'), next2: w('next', 2),
  imagine: w('imagine'), k10: w('$10,000'), spending2: w('spending', 2), all: w('all'),
  earn: w('earn'), freedom: w('freedom'), before1: w('before', 1),
  course: w('course'), enjoying: w('enjoying'), fine: w('fine'),
  so2: w('so', 2), pay: w('pay'), save: w('save'), half: w('half'), before2: w('before', 2),
  because2: w('because', 2), richer2: w('richer', 2), keep: w('keep'), does: w('does'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000;
const OPEN = { x: 0, y: -250, z: 1.2 };
const F_ = (t, x, y, z, d = 0.9) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.45, B, -230, 1.45),
  F_(T.but - 0.45, C, -250, 1.15),
  F_(T.better - 0.45, D, -260, 1.35),
  F_(T.psychologists - 0.45, E2 + 60, -200, 1.6),
  F_(T.imagine - 0.45, F, -260, 1.6),
  F_(T.earn - 0.4, G, -150, 1.5),
  F_(T.course - 0.45, H - 40, -260, 1.4),
  F_(T.because2 - 0.45, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

function axes(g, x, k, a = 0.8) {
  MM.path(g, [[x - 640, -560], [x - 640, 0], [x + 640, 0]], k, a, 2.5, false);
}
function jar(g, x, y, s, a, fill) {
  if (a <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s);
  MM.stroke(g, a, 3);
  g.beginPath(); g.moveTo(-60, -170); g.lineTo(-60, -150); g.quadraticCurveTo(-90, -130, -90, -90); g.lineTo(-90, -10);
  g.quadraticCurveTo(-90, 0, -78, 0); g.lineTo(78, 0); g.quadraticCurveTo(90, 0, 90, -10); g.lineTo(90, -90); g.quadraticCurveTo(90, -130, 60, -150); g.lineTo(60, -170); g.stroke();
  g.strokeRect(-68, -195, 136, 25);
  const fh = 140 * clamp(fill);
  if (fh > 0) { MM.fill(g, a * 0.9); g.fillRect(-80, -8 - fh, 160, fh); }
  g.restore();
}

// ---------- A: chart hook + ending ----------
function zoneA(g, t) {
  const x = A;
  axes(g, x, p(t, -1, 0.5));
  // income line: steps up on "raise"
  const jump = p(t, T.raise1, 0.5);
  const inc = [[x - 620, -180], [x - 120, -180], [x - 120, -180 - 200 * jump], [x + 620, -180 - 200 * jump - 120]];
  MM.path(g, inc, 1, 1, 4, false);
  MM.label(g, 'INCOME', x + 540, -540, 1, 18);
  MM.pill(g, '+ RAISE', x - 120, -440, win(t, T.raise1 + 0.2, T.most), 20, true);
  // wealth line flat
  g.setLineDash([14, 12]);
  const end = t > T.because2;
  const wk = p(t, 0.6, 1.2);
  MM.path(g, [[x - 620, -70], [x + 620, -70]], wk, 0.8, 3, false);
  g.setLineDash([]);
  MM.label(g, 'WEALTH', x + 540, -100, wk, 18);
  MM.pill(g, 'STILL FLAT', x + 200, -20, win(t, T.richer1, T.most), 18);
  if (end) {
    // what you keep: wealth line bends upward
    const kk = p(t, T.keep - 0.6, 1.4);
    MM.path(g, [[x - 120, -70], [x + 150, -120], [x + 380, -230], [x + 620, -420]], kk, 1, 5, true);
    MM.label(g, 'WHAT YOU KEEP', x + 330, -330, win(t, T.keep, null), 24);
    MM.ripple(g, x + 620, -420, t, T.does, 40, 260, 0.9);
  }
}

// ---------- B: income staircase ----------
function zoneB(g, t) {
  const x = B;
  const steps = 4, sw = 260, sh = 110;
  const sk = p(t, T.most - 0.2, 0.9);
  const pts = [[x - 600, 0]];
  for (let i = 0; i < steps; i++) { pts.push([x - 600 + i * sw, -i * sh]); pts.push([x - 600 + (i + 1) * sw, -i * sh]); if (i < steps - 1) pts.push([x - 600 + (i + 1) * sw, -(i + 1) * sh]); }
  MM.path(g, pts, sk, 0.9, 3, true);
  const labels = ['$40K', '$60K', '$80K', '$100K'];
  for (let i = 0; i < steps; i++) MM.label(g, labels[i], x - 600 + i * sw + sw / 2, -i * sh + 34, p(t, T.most + i * 0.15, 0.4), 18);
  // person on step 1, hops to step 2 on "next"
  const hop = p(t, T.next1, 0.5);
  const px = lerp(x - 600 + sw / 2, x - 600 + sw * 1.5, hop), py = -lerp(0, sh, hop) - Math.sin(Math.PI * hop) * 60;
  MM.person(g, px, py, 0.9, p(t, T.most, 0.4), true);
  // problem bubbles appear, then pop on "disappear"
  for (let i = 0; i < 3; i++) {
    const bx = px - 110 + i * 110, by = py - 230 - (i % 2) * 40;
    const a = MM.build(g, t, T.problems - 0.2 + i * 0.12, bx, by, 30, (g2, a2) => {
      const gone = p(t, T.disappear + i * 0.1, 0.3);
      if (gone >= 1) return;
      MM.stroke(g2, a2 * (1 - gone), 3); g2.beginPath(); g2.arc(bx, by, 24 * (1 + gone), 0, 7); g2.stroke();
      MM.label(g2, '!', bx, by, a2 * (1 - gone), 26, { track: 0 });
    }, 0.5);
  }
  MM.pill(g, 'NO MORE PROBLEMS?', x + 300, -520, win(t, T.level - 0.3, null), 20);
}

// ---------- C: income and spending rise together ----------
function zoneC(g, t) {
  const x = C;
  axes(g, x, p(t, T.but - 0.3, 0.5));
  const xs = [-620, -300, 0, 300, 620];
  const ik = p(t, T.income2 - 0.2, 1.2), sk = p(t, T.spending1 - 0.2, 1.2);
  const inc = xs.map((v, i) => [x + v, -120 - i * 95]);
  const spn = xs.map((v, i) => [x + v, -60 - i * 92]);
  MM.path(g, inc, ik, 1, 4, true);
  g.setLineDash([14, 12]); MM.path(g, spn, sk, 0.85, 4, true); g.setLineDash([]);
  MM.label(g, 'INCOME', x + 540, -540, ik, 18);
  MM.label(g, 'SPENDING', x + 520, -300, sk, 18);
  const gk = p(t, T.quietly, 0.5);
  MM.stroke(g, gk * 0.8, 2); g.beginPath(); g.moveTo(x + 300, -405); g.lineTo(x + 300, -336); g.stroke();
  MM.pill(g, 'THE GAP NEVER GROWS', x + 120, -620, win(t, T.quietly, null), 20, true);
}

// ---------- D: upgrades + lifestyle creep ----------
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.build(g, t, T.car - 0.3, x - 420, -60, 130, (g2, a) => MM.car(g2, x - 420, 0, 1.3, a, true));
  MM.build(g, t, T.bigger - 0.2, x, -170, 160, (g2, a) => MM.building(g2, x, 0, 230, 340, a, 0.5));
  MM.build(g, t, T.nicer - 0.2, x + 420, -80, 130, (g2, a) => MM.plate(g2, x + 420, -60, 1.25, a));
  MM.label(g, 'BETTER CAR', x - 420, 40, p(t, T.car, 0.4), 18);
  MM.label(g, 'BIGGER APARTMENT', x, 40, p(t, T.bigger + 0.3, 0.4), 18);
  MM.label(g, 'NICER DINNERS', x + 420, 40, p(t, T.nicer + 0.3, 0.4), 18);
  MM.pill(g, 'BECAUSE YOU CAN', x, -470, win(t, T.afford - 0.3, T.economists + 0.2), 20);
  // creeping line climbs behind the items
  const ck = p(t, T.lifestyle - 0.4, 1.4);
  g.setLineDash([10, 10]); MM.path(g, [[x - 660, -150], [x - 220, -250], [x + 200, -380], [x + 660, -470]], ck, 0.8, 3, true); g.setLineDash([]);
  MM.build(g, t, T.lifestyle - 0.3, x, -600, 280, (g2, a) => MM.big(g2, 'LIFESTYLE CREEP', x, -600, a, 70), 0.8);
}

// ---------- E: hedonic treadmill + joy meter ----------
function zoneE(g, t) {
  const x = E2;
  MM.build(g, t, T.psychologists - 0.2, x - 180, -20, 200, (g2, a) => MM.treadmill(g2, x - 180, 0, 1.3, a, t, 1.4), 0.8);
  const bob = -Math.abs(Math.sin(t * 7)) * 10;
  MM.person(g, x - 230, bob - 2, 1.05, p(t, T.psychologists + 0.2, 0.4), true);
  MM.label(g, 'HEDONIC TREADMILL', x - 180, 90, win(t, T.hedonic, null), 24);
  // joy meter: spikes on upgrade, fades, spikes again on "next"
  const spike = (t0) => t < t0 ? 0 : (t < t0 + 0.4 ? out((t - t0) / 0.4) : Math.exp(-(t - t0 - 0.4) * 1.2));
  const joy = 12 + 88 * Math.max(spike(T.upgrade - 0.2), spike(T.next2 - 0.2));
  MM.pctBar(g, x + 420, 0, 380, joy, p(t, T.joy - 0.3, 0.4), 'JOY');
  MM.build(g, t, T.upgrade - 0.2, x + 160, -470, 70, (g2, a) => MM.car(g2, x + 160, -440, 0.6, a * (1 - 0.7 * p(t, T.fades, 0.8)), true));
  MM.build(g, t, T.next2 - 0.2, x + 160, -470, 70, (g2, a) => MM.car(g2, x + 160, -440, 0.8, a, true));
  MM.pill(g, 'FADES', x + 420, -470, win(t, T.fades, T.next2), 18);
  MM.pill(g, 'NEXT ONE', x + 160, -560, win(t, T.next2, null), 18, true);
}

// ---------- F: the $10,000 raise, all spent ----------
function zoneF(g, t) {
  const x = F;
  const ia = p(t, T.imagine - 0.2, 0.5);
  MM.stroke(g, ia, 3); MM.rr(g, x - 560, -420, 360, 260, 22); g.stroke();
  MM.label(g, 'RAISE', x - 380, -380, ia, 18);
  const flow = clamp((t - T.spending2) / 1.4);
  const raised = 10000 * out(clamp((t - T.k10 + 0.1) / 0.9));
  MM.big(g, '+' + MM.money(raised * (1 - flow)), x - 380, -280, ia, 52);
  MM.stroke(g, ia, 3); MM.rr(g, x + 200, -420, 360, 260, 22); g.stroke();
  MM.label(g, 'SPENT', x + 380, -380, ia, 18);
  MM.big(g, MM.money(10000 * flow), x + 380, -280, ia, 52);
  for (let i = 0; i < 16; i++) {
    const ts = T.spending2 + i * 0.08, k = clamp((t - ts) / 0.6);
    if (k <= 0 || k >= 1) continue;
    const e = inOut(k);
    MM.coin(g, lerp(x - 200, x + 200, e), lerp(-290, -290, e) - Math.sin(Math.PI * e) * 140, 16, Math.sin(Math.PI * k));
  }
  MM.pill(g, 'LEFT: $0', x, -40, win(t, T.all + 0.4, null), 22, true);
}

// ---------- G: same distance from freedom ----------
function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 700, x + 700, 0, 0.7);
  MM.person(g, x - 450, 0, 1.1, p(t, T.earn - 0.3, 0.4), true);
  const fa = p(t, T.earn, 0.6), fg = p(t, T.freedom, 0.6);
  MM.stroke(g, fa, 3); g.beginPath(); g.moveTo(x + 450, 0); g.lineTo(x + 450, -300); g.stroke();
  g.beginPath(); g.moveTo(x + 450, -300); g.lineTo(x + 560, -265); g.lineTo(x + 450, -230); g.closePath();
  MM.fill(g, fa * (0.2 + 0.8 * fg)); g.fill(); g.stroke(); MM.halo(g, x + 500, -265, 200, fg);
  MM.label(g, 'FREEDOM', x + 470, 40, fg, 20);
  const sal = t < T.earn + 0.6 ? '$60K' : '$70K';
  MM.pill(g, sal, x - 450, -330, fa, 20, t >= T.earn + 0.6);
  const dk = p(t, T.freedom + 0.2, 0.8);
  MM.path(g, [[x - 330, -150], [x + 380, -150]], dk, 0.8, 2, false);
  MM.stroke(g, dk, 2); g.beginPath(); g.moveTo(x - 330, -170); g.lineTo(x - 330, -130); g.moveTo(x + 380, -170); g.lineTo(x + 380, -130); g.stroke();
  MM.label(g, 'SAME DISTANCE', x + 25, -190, win(t, T.before1 - 0.2, null), 22);
}

// ---------- H: enjoy some, save half automatically ----------
function zoneH(g, t) {
  const x = H;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.build(g, t, T.enjoying - 0.2, x - 380, -80, 120, (g2, a) => MM.plate(g2, x - 380, -60, 1.3, a));
  MM.pill(g, 'ENJOY SOME ✓', x - 380, -250, win(t, T.fine - 0.4, null), 20);
  // raise coin stack splits: half to SAVE jar, half to SPEND
  const sa = p(t, T.pay - 0.3, 0.5);
  MM.big(g, '+$10,000', x, -480, sa, 54);
  for (let i = 0; i < 10; i++) {
    const toSave = i % 2 === 0;
    const ts = T.half - 0.3 + i * 0.09, k = clamp((t - ts) / 0.6), e = inOut(k);
    const sx = x, sy = -380 + i * 0;
    const tx = toSave ? x + 360 : x - 80, ty = toSave ? -120 : -60;
    if (t < T.pay) continue;
    if (k < 1) MM.coin(g, lerp(sx, tx, e), lerp(sy, ty, e) - Math.sin(Math.PI * e) * 90, 18, Math.min(1, (t - T.pay) * 3) * (k > 0.95 ? 0 : 1));
  }
  const saved = clamp((t - T.half + 0.3) / 1.0);
  jar(g, x + 360, 0, 1.1, p(t, T.pay - 0.3, 0.6), saved * 0.5);
  MM.label(g, 'SAVED', x + 360, 40, p(t, T.pay, 0.4), 20);
  MM.pill(g, '50%', x + 360, -260, win(t, T.half, null), 22, true);
  MM.label(g, 'SPEND', x - 80, 40, p(t, T.half + 0.3, 0.4), 20);
  // auto-transfer before you see it
  const ak = p(t, T.before2 - 0.2, 0.7);
  MM.path(g, [[x + 60, -440], [x + 260, -420], [x + 340, -300]], ak, 1, 3, true);
  MM.pill(g, 'AUTO-SAVE BEFORE YOU SEE IT', x + 200, -600, win(t, T.before2, null), 18, true);
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
  },
};
