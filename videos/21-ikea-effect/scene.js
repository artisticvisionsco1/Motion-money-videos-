// 21 — The IKEA effect (Norton, Mochon & Ariely, 2012)
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;
const T = {
  built1: w('built', 1), most: w('most'), good1: w('good', 1), but1: w('but', 1), study: w('study'), y2012: w('2012'), norton: w('norton'),
  motion: w('motion'), arieli: w('arieli'), assemble: w('assemble'), boxes: w('boxes'), asked: w('asked'), builders: w('builders'),
  p63: w('63%'), assembled: w('assembled'), ikea2: w('ikea', 2), effort: w('effort'), valuable: w('valuable'), business: w('business'),
  stock: w('stock'), judge: w('judge'), course: w('course'), pride: w('pride'), but2: w('but', 2), friend: w('friend'), build: w('build'),
  because: w('because'), worth: w('worth'),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;
const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000, H = 35000, I = 40000;
const OPEN = { x: 0, y: -300, z: 1.3 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -300, 1.35), F_(T.but1 - 0.4, C, -300, 1.25), F_(T.assemble - 0.5, D, -300, 1.25),
  F_(T.builders - 0.5, E2, -300, 1.2), F_(T.ikea2 - 0.6, F, -300, 1.3), F_(T.business - 0.6, G, -290, 1.25),
  F_(T.course - 0.4, H, -280, 1.35), F_(T.but2 - 0.4, I, -290, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z), { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];
// flat-pack box: faces fly in from scattered flat positions, k = 0..1 per face via t0/gap
function flatBox(g, t, cx, cy, S, t0, gap, a = 1, filled = 0) {
  const d = S * 0.42;
  const faces = [
    { pts: [[-S / 2, -S / 2], [S / 2, -S / 2], [S / 2, S / 2], [-S / 2, S / 2]], off: [-S * 1.4, S * 0.9], rot: -0.6 },
    { pts: [[-S / 2, -S / 2], [-S / 2 + d, -S / 2 - d], [S / 2 + d, -S / 2 - d], [S / 2, -S / 2]], off: [S * 0.2, -S * 1.2], rot: 0.5 },
    { pts: [[S / 2, -S / 2], [S / 2 + d, -S / 2 - d], [S / 2 + d, S / 2 - d], [S / 2, S / 2]], off: [S * 1.5, S * 0.6], rot: 0.7 },
  ];
  faces.forEach((f, i) => {
    const k = inOut(clamp((t - t0 - i * gap) / 0.8)), al = a * clamp((t - t0 - i * gap) / 0.3 + 0.01);
    if (al <= 0) return;
    g.save(); g.translate(cx + f.off[0] * (1 - k), cy + f.off[1] * (1 - k)); g.rotate(f.rot * (1 - k));
    g.beginPath(); f.pts.forEach(([px, py], j) => j ? g.lineTo(px, py) : g.moveTo(px, py)); g.closePath();
    MM.fill(g, al * (i === 0 ? 0.06 + 0.8 * filled : 0.04 + 0.25 * filled)); g.fill(); MM.stroke(g, al, 3); g.stroke();
    g.restore();
  });
  const done = clamp((t - t0 - 2 * gap - 0.8) / 0.3);
  if (done > 0 && done < 1) MM.ripple(g, cx, cy, t, t0 + 2 * gap + 0.8, S * 0.4, S * 1.4, 0.8);
}
function zoneA(g, t) {
  const x = A, end = t > T.because - 0.5;
  flatBox(g, t, x - 300, -290, 260, -0.5, 0.25, 1, end ? 1 : 0.5 * p(t, T.built1, 0.5));
  const v = 10 + 6 * (end ? 1 : out(clamp((t - 0.6) / 2.0)));
  MM.build(g, t, 0.1, x + 330, -320, 130, (g2, a) => MM.tag(g2, x + 330, -520, a, 0.1 * Math.sin(t * 2), '$' + v.toFixed(0), 2.6));
  MM.label(g, 'YOU BUILT IT', x - 300, -60, p(t, T.built1 - 0.3, 0.4), 22, { weight: 800 });
  MM.label(g, 'SO IT FEELS WORTH MORE', x + 330, -90, p(t, T.built1, 0.4), 18);
  if (end) MM.pill(g, "EVEN WHEN IT ISN'T WORTH MORE", x, 20, win(t, T.worth - 0.8, null), 22, true);
}
function zoneB(g, t) {
  const x = B;
  MM.build(g, t, T.most - 0.3, x - 300, -300, 130, (g2, a) => MM.box(g2, x - 300, -300, 1.7, a, false));
  for (let i = 0; i < 5; i++) MM.build(g, t, T.most + 0.1 + i * 0.15, x + 120 + i * 110, -340, 40, (g2, a) => MM.star(g2, x + 120 + i * 110, -340, 40, a, i < 4));
  MM.label(g, 'QUALITY', x + 340, -260, p(t, T.most + 0.6, 0.4), 20, { weight: 800 });
  MM.big(g, 'VALUE = HOW GOOD IT IS?', x, -560, p(t, T.good1 - 0.6, 0.4), 52);
  MM.label(g, 'WHAT MOST PEOPLE THINK', x, -100, p(t, T.most + 0.3, 0.4), 18);
}
function zoneC(g, t) {
  const x = C;
  MM.pill(g, '2012 · PUBLISHED STUDY', x, -660, win(t, T.study - 0.3, null), 22, true);
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  const ppl = [['MICHAEL NORTON', T.norton], ['DANIEL MOCHON', T.motion], ['DAN ARIELY', T.arieli]];
  ppl.forEach(([n, ts], i) => {
    const px = x - 420 + i * 420;
    MM.person(g, px, 0, 1.15, p(t, T.but1 - 0.1 + i * 0.25, 0.4), i === 0 ? ts < t + 0.3 && t < T.motion - 0.2 : i === 1 ? t > ts - 0.3 && t < T.arieli - 0.2 : t > ts - 0.3);
    MM.label(g, n, px, 40, p(t, ts - 0.3, 0.4), 18, { weight: 800 });
  });
  MM.big(g, 'RESEARCHERS', x, -470, p(t, T.y2012, 0.4), 44);
  MM.build(g, t, T.study, x + 520, -380, 80, (g2, a) => MM.book(g2, x + 560, -380, 0.9, a));
}
function zoneD(g, t) {
  const x = D;
  MM.pill(g, 'PLAIN IKEA STORAGE BOX', x, -660, win(t, T.assemble - 0.2, null), 22, true);
  flatBox(g, t, x - 280, -300, 280, T.assemble - 0.1, 0.45);
  MM.person(g, x - 620, 0, 1.0, p(t, T.assemble - 0.4, 0.4), true);
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  MM.label(g, 'ASSEMBLE IT YOURSELF', x - 280, -60, p(t, T.assemble + 0.8, 0.4), 18);
  // the bid
  MM.build(g, t, T.asked - 0.4, x + 330, -300, 130, (g2, a) => MM.tag(g2, x + 330, -480, a, 0.1 * Math.sin(t * 2), '$ ?', 2.4));
  MM.label(g, 'HOW MUCH WOULD YOU PAY?', x + 330, -90, win(t, T.asked - 0.1, null), 20, { weight: 800 });
}
function zoneE(g, t) {
  const x = E2;
  MM.label(g, 'AVERAGE BID FOR THE SAME BOX', x, -680, p(t, T.builders - 0.4, 0.4), 20);
  const a1 = p(t, T.builders - 0.4, 0.4), a2 = p(t, T.assembled - 1.6, 0.4);
  const k1 = out(clamp((t - T.builders) / 1.6)), k2 = out(clamp((t - T.assembled + 1.4) / 1.0));
  const H0 = 480, b1 = H0 * k1, b2 = H0 * (48 / 78) * k2;
  MM.rr(g, x - 460, -80 - b1, 200, b1, 16); MM.fill(g, a1); g.fill(); MM.halo(g, x - 360, -80 - b1, 120, a1 * 0.5);
  MM.big(g, Math.round(78 * k1) + '¢', x - 360, -120 - b1, a1, 60);
  MM.label(g, 'BUILT IT', x - 360, -30, a1, 18, { weight: 800 });
  MM.rr(g, x + 260, -80 - b2, 200, b2, 16); MM.stroke(g, a2, 3); g.stroke();
  MM.big(g, Math.round(48 * k2) + '¢', x + 360, -120 - b2, a2, 60);
  MM.label(g, 'ALREADY ASSEMBLED', x + 360, -30, a2, 18, { weight: 800 });
  // live calculator
  const ck = p(t, T.p63 - 0.4, 0.4);
  MM.label(g, '78 ÷ 48', x, -440, ck, 26, { weight: 800 });
  MM.big(g, '+' + Math.round(63 * out(clamp((t - T.p63 + 0.3) / 1.2))) + '%', x, -340, ck, 92);
  MM.ripple(g, x, -340, t, T.p63 + 0.9, 100, 500, 1.0);
}
function zoneF(g, t) {
  const x = F;
  MM.build(g, t, T.ikea2 - 0.4, x, -600, 260, (g2, a) => MM.big(g2, 'THE IKEA EFFECT', x, -600, a, 80), 0.8);
  MM.build(g, t, T.ikea2 + 0.3, x - 360, -300, 120, (g2, a) => { MM.person(g2, x - 360, -200, 1.0, a, true); MM.label(g2, 'EFFORT', x - 360, -150, a, 22, { weight: 800 }); });
  MM.path(g, [[x - 200, -300], [x + 200, -300]], p(t, T.effort - 0.2, 0.7), 1, 4, true);
  MM.build(g, t, T.ikea2 + 0.7, x + 360, -300, 140, (g2, a) => { MM.star(g2, x + 360, -300, 110, a, true); MM.label(g2, 'FEELS VALUABLE', x + 360, -150, a, 22, { weight: 800 }); });
  MM.label(g, 'EFFORT → VALUE', x, -40, p(t, T.valuable, 0.4), 20);
}
function zoneG(g, t) {
  const x = G;
  MM.ground(g, x - 720, x + 720, 0, 0.6);
  MM.build(g, t, T.business - 0.5, x - 380, -170, 170, (g2, a) => MM.building(g2, x - 380, 0, 300, 380, a, 0.35));
  MM.label(g, 'YOUR BUSINESS', x - 380, 40, p(t, T.business - 0.2, 0.4), 18, { weight: 800 });
  const sp = [[x + 120, -120], [x + 220, -220], [x + 320, -170], [x + 420, -320], [x + 520, -280], [x + 640, -420]];
  MM.path(g, [[x + 100, -480], [x + 100, -80], [x + 680, -80]], p(t, T.stock - 0.6, 0.4), 0.6, 2.5, false);
  MM.path(g, sp, p(t, T.stock - 0.4, 1.0), 1, 4, true);
  MM.label(g, 'YOUR STOCK PICK', x + 390, -40, p(t, T.stock - 0.2, 0.4), 18, { weight: 800 });
  MM.pill(g, 'HARD TO JUDGE HONESTLY', x, -620, win(t, T.judge - 0.6, null), 24, true);
}
function zoneH(g, t) {
  const x = H;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  MM.person(g, x - 200, 0, 1.4, p(t, T.course - 0.4, 0.4), true);
  flatBox(g, t, x + 230, -150, 200, T.course - 0.4, 0.15, 1, 0.3);
  MM.build(g, t, T.pride - 0.3, x - 200, -360, 80, (g2, a) => MM.star(g2, x - 200, -360, 60, a, true));
  MM.pill(g, 'PRIDE IN YOUR WORK ✓', x, -560, win(t, T.pride - 0.2, null), 22);
}
function zoneI(g, t) {
  const x = I;
  MM.pill(g, 'BEFORE A BIG MONEY DECISION', x, -660, win(t, T.but2 - 0.2, null), 22, true);
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  MM.person(g, x - 470, 0, 1.1, p(t, T.but2 - 0.3, 0.4), true);
  MM.build(g, t, T.but2, x - 470, -340, 90, (g2, a) => MM.tag(g2, x - 470, -470, a, 0.08 * Math.sin(t * 2), 'MY PRICE: $78', 1.3));
  flatBox(g, t, x, -160, 170, T.but2 - 0.2, 0.12, 1, 0.3);
  const fk = p(t, T.friend - 0.4, 0.5);
  const wk = MM.walk(t, T.friend - 0.6, x + 800, x + 470, 1.0);
  MM.person(g, wk.x, wk.bob, 1.1, fk, false);
  MM.label(g, "A FRIEND WHO DIDN'T BUILD IT", x + 470, 40, win(t, T.friend - 0.2, null), 16, { weight: 800 });
  MM.build(g, t, T.build - 0.1, x + 470, -340, 90, (g2, a) => MM.tag(g2, x + 470, -470, a, -0.08 * Math.sin(t * 2), 'FAIR PRICE: $48', 1.3));
}
const SCENE = { duration: T.end, camera, draw(g, t, cam) {
  const near = x => Math.abs(cam.x - x) < 2600 / cam.z;
  [[A, zoneA], [B, zoneB], [C, zoneC], [D, zoneD], [E2, zoneE], [F, zoneF], [G, zoneG], [H, zoneH], [I, zoneI]].forEach(([zx, fn]) => near(zx) && fn(g, t));
} };
