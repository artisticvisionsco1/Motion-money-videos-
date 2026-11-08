// 09 — Sunk cost: the Concorde fallacy
const { p, win, clamp, lerp, inOut, out, outBack } = MM;
const w = MM.word;

const T = {
  lost1: w('lost', 1), controlling: w('controlling'), next1: w('next', 1),
  most: w('most'), finish: w('finish'), paid: w('paid'),
  but1: w('but', 1), britain: w('britain'), pouring: w('pouring'), concorde1: w('concorde', 1), never: w('never'), itself: w('itself'),
  concorde2: w('concorde', 2), fallacy: w('fallacy'),
  same: w('same'), movie: w('movie'), ticket: w('ticket'), repairing: w('repairing'), breaking: w('breaking'),
  gone: w('gone'), way: w('way'), choice: w('choice'), yours: w('yours'),
  course: w('course'), sticking: w('sticking'), right: w('right'),
  so: w('so'), question: w('question'), starting: w('starting'), again: w('again'),
  because: w('because', 2), lost2: w('lost', 2), back: w('back'), decision2: w('decision', 2),
};
T.end = MM.words[MM.words.length - 1].e + 0.9;

const A = 0, B = 5000, C = 10000, D = 15000, E2 = 20000, F = 25000, G = 30000;
const OPEN = { x: 0, y: -260, z: 1.25 };
const F_ = (t, x, y, z, d = 0.8) => ({ t, d, x, y, z, focus: true });
const camera = [
  { ...OPEN },
  F_(T.most - 0.4, B, -260, 1.35),
  F_(T.but1 - 0.4, C, -280, 1.05),
  F_(T.same - 0.4, D, -260, 1.3),
  F_(T.gone - 0.6, E2, -260, 1.35),
  F_(T.course - 0.5, F, -260, 1.4),
  F_(T.so - 0.4, G, -280, 1.25),
  F_(T.because - 0.4, OPEN.x, OPEN.y, OPEN.z),
  { t: T.end - 0.8, d: 0.75, x: OPEN.x, y: OPEN.y, z: OPEN.z },
];

// ---------- A: lost money pulling the strings ----------
function zoneA(g, t) {
  const x = A;
  MM.ground(g, x - 700, x + 700, 0, 0.6);
  // pile of grey 'lost' coins
  for (let i = 0; i < 10; i++) MM.build(g, t, -0.4 + i * 0.05, x - 460 + (i % 4) * 38, -10 - Math.floor(i / 4) * 30, 30, (g2, a) => { MM.rr(g2, x - 490 + (i % 4) * 38, -16 - Math.floor(i / 4) * 30, 60, 14, 7); MM.fill(g2, a * 0.45); g2.fill(); }, 0.4);
  MM.label(g, 'ALREADY LOST', x - 410, 40, p(t, T.lost1, 0.4), 18);
  // puppet strings to the person
  const sk = p(t, T.controlling - 0.2, 0.7), tense = 0.5 + 0.5 * Math.sin(t * 4);
  for (let i = 0; i < 3; i++) MM.path(g, [[x - 420 + i * 30, -110], [x - 200, -420 - i * 15 + tense * 10], [x + 20 + i * 18, -190]], sk, 0.6, 2, false);
  MM.person(g, x + 30, 0, 1.1, 1, true);
  // two paths of the next decision
  const dk = p(t, T.next1 - 0.2, 0.7);
  MM.path(g, [[x + 120, -60], [x + 420, -60], [x + 560, -220]], dk, 0.9, 3, true);
  MM.path(g, [[x + 420, -60], [x + 600, -20]], dk, 0.5, 3, true);
  MM.pill(g, 'NEXT DECISION', x + 470, -320, win(t, T.next1, T.most) + (t > T.because ? win(t, T.decision2 - 0.2, null) : 0), 20, true);
  if (t > T.because) MM.label(g, "CAN'T COME BACK", x - 410, -150, win(t, T.back - 0.4, null), 18);
}

// ---------- B: finish what you paid for ----------
function zoneB(g, t) {
  const x = B;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  const bk = p(t, T.most - 0.1, 0.6);
  MM.rr(g, x - 420, -330, 840, 60, 30); MM.stroke(g, bk, 3); g.stroke();
  const fill = 0.15 + 0.6 * clamp((t - T.finish + 0.4) / 1.6);
  if (bk > 0) { MM.rr(g, x - 414, -324, 828 * fill, 48, 24); MM.fill(g, bk); g.fill(); }
  MM.label(g, 'PAID', x - 420, -380, bk, 18); MM.label(g, 'FINISH', x + 420, -380, bk, 18);
  const wk = MM.walk(t, T.most, x - 400, x - 400 + 828 * fill, 0.1);
  MM.person(g, x - 414 + 828 * fill, -2 - Math.abs(Math.sin(t * 7)) * 6, 0.9, bk, true);
  MM.pill(g, 'FINISH WHAT YOU PAID FOR?', x, -500, win(t, T.finish - 0.2, null), 20);
}

// ---------- C: the Concorde ----------
function zoneC(g, t) {
  const x = C;
  const pk = p(t, T.concorde1 - 0.6, 0.6);
  MM.build(g, t, T.but1, x, -280, 300, (g2, a) => MM.plane(g2, x + Math.sin(t * 0.8) * 10, -280 + Math.sin(t * 1.3) * 8, 2.1, a, t > T.concorde1), 1.0);
  MM.pill(g, 'BRITAIN + FRANCE', x - 380, -640, win(t, T.britain - 0.2, null), 20);
  // money pours in
  for (let i = 0; i < 40; i++) {
    const ts = T.pouring + i * 0.12, k = clamp((t - ts) / 0.7); if (k <= 0 || k >= 1) continue;
    MM.coin(g, x - 200 + ((i * 47) % 400), lerp(-760, -300, k * k), 15, Math.sin(Math.PI * k));
  }
  MM.label(g, 'NEVER PAID FOR ITSELF', x, -20, win(t, T.never, null), 22);
  MM.build(g, t, T.concorde2 - 0.3, x, 90, 280, (g2, a) => MM.big(g2, 'THE CONCORDE FALLACY', x, 90, a, 58), 0.8);
}

// ---------- D: bad movie, broken car ----------
function zoneD(g, t) {
  const x = D;
  MM.ground(g, x - 650, x + 650, 0, 0.6);
  MM.build(g, t, T.same - 0.1, x - 330, -330, 140, (g2, a) => MM.ticket(g2, x - 330, -330, 1.5, a, 'BAD MOVIE'));
  MM.build(g, t, T.movie - 0.3, x - 330, -120, 70, (g2, a) => MM.clock(g2, x - 330, -120, 60, a, t, 6, false));
  MM.label(g, 'STILL WATCHING', x - 330, 40, win(t, T.ticket - 0.2, null), 18);
  MM.build(g, t, T.ticket - 0.2, x + 330, -60, 130, (g2, a) => MM.car(g2, x + 330 + (t > T.breaking ? Math.sin(t * 30) * 3 : 0), 0, 1.4, a, false));
  const bills = ['$400', '$650', '$900'];
  for (let i = 0; i < 3; i++) MM.pill(g, bills[i], x + 330, -230 - i * 70, win(t, T.repairing + 0.3 + i * 0.5, null), 18, i === 2);
  MM.label(g, 'KEEPS BREAKING', x + 330, 40, win(t, T.breaking - 0.2, null), 18);
}

// ---------- E: gone either way, only the next choice is yours ----------
function zoneE(g, t) {
  const x = E2;
  MM.ground(g, x - 650, x - 120, 0, 0.6); MM.ground(g, x + 120, x + 650, 0, 0.6);
  // the pit
  const hk = p(t, T.gone - 0.5, 0.6);
  MM.path(g, [[x - 120, 0], [x - 100, 160], [x + 100, 160], [x + 120, 0]], hk, 0.9, 3, false);
  for (let i = 0; i < 12; i++) { const ts = T.gone - 0.3 + i * 0.12, k = clamp((t - ts) / 0.8); if (k <= 0) continue; const e = Math.min(1, k); MM.coin(g, x - 60 + (i % 5) * 30, lerp(-400, 130 - Math.floor(i / 5) * 20, e * e), 14, k < 1 ? 1 : 0.35); }
  MM.label(g, 'GONE EITHER WAY', x, 220, win(t, T.way - 0.3, null), 20);
  // fork: next choice
  const fk = p(t, T.choice - 0.4, 0.8);
  MM.person(g, x + 300, 0, 1.0, p(t, T.gone, 0.4), true);
  MM.path(g, [[x + 380, -80], [x + 560, -80], [x + 640, -260]], fk, 1, 4, true);
  MM.path(g, [[x + 560, -80], [x + 660, -40]], fk, 0.5, 3, true);
  MM.pill(g, 'YOUR NEXT CHOICE', x + 420, -380, win(t, T.choice, null), 20, true);
}

// ---------- F: sometimes sticking is right ----------
function zoneF(g, t) {
  const x = F;
  MM.ground(g, x - 600, x + 600, 0, 0.6);
  const wk = MM.walk(t, T.sticking - 0.4, x - 450, x + 150, 2.0);
  MM.person(g, wk.x, wk.bob, 1.0, p(t, T.course - 0.2, 0.4), true);
  MM.build(g, t, T.right - 0.3, x + 380, -220, 120, (g2, a) => MM.shield(g2, x + 380, -220, 1.2, a, true));
  MM.pill(g, 'SOMETIMES IT IS RIGHT', x, -460, win(t, T.right - 0.2, null), 20);
}

// ---------- G: the question ----------
function zoneG(g, t) {
  const x = G;
  const ck = p(t, T.so - 0.1, 0.6);
  if (ck > 0) { MM.rr(g, x - 640, -560, 1280, 420, 30); MM.fill(g, 0.04 * ck); g.fill(); MM.stroke(g, ck, 3); g.stroke(); }
  MM.label(g, 'ASK ONE QUESTION', x, -500, p(t, T.question - 0.3, 0.4), 20);
  MM.typeText(g, 'IF I WERE STARTING TODAY,', x, -400, clamp((t - T.question + 0.2) / 1.6), 1, 48);
  MM.typeText(g, 'WOULD I CHOOSE THIS AGAIN?', x, -300, clamp((t - T.again + 0.9) / 1.0), 1, 48);
  MM.ripple(g, x, -350, t, T.again + 0.2, 120, 700, 1.0);
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
  },
};
