// Renders brand/avatar.png (1080x1080): glowing ¢ inside a thin ring on black, in the channel's style.
import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const { chromium } = createRequire(import.meta.url)('playwright');
const dir = path.dirname(fileURLToPath(import.meta.url));

const html = `<!doctype html><html><body style="margin:0;background:#000"><canvas id="c" width="1080" height="1080"></canvas><script>
window.draw = () => {
const c = document.getElementById('c'), g = c.getContext('2d'), S = 1080, C = S / 2;
const sc = document.createElement('canvas'); sc.width = sc.height = S; const s = sc.getContext('2d');
s.fillStyle = '#000'; s.fillRect(0, 0, S, S);
// faint dot grid
s.fillStyle = 'rgba(255,255,255,0.05)';
for (let x = 18; x < S; x += 36) for (let y = 18; y < S; y += 36) s.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
// stars
let r = 7; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < 90; i++) { s.fillStyle = 'rgba(255,255,255,' + (0.1 + rnd() * 0.35).toFixed(2) + ')'; s.beginPath(); s.arc(rnd() * S, rnd() * S, 0.8 + rnd() * 1.8, 0, 7); s.fill(); }
// soft halo behind the mark
const h = s.createRadialGradient(C, C, 0, C, C, 380);
h.addColorStop(0, 'rgba(255,255,255,0.22)'); h.addColorStop(0.45, 'rgba(255,255,255,0.06)'); h.addColorStop(1, 'rgba(255,255,255,0)');
s.fillStyle = h; s.fillRect(0, 0, S, S);
// thin ring + small orbit dot
s.strokeStyle = '#fff'; s.lineWidth = 7; s.beginPath(); s.arc(C, C, 330, 0, 7); s.stroke();
s.globalAlpha = 0.35; s.lineWidth = 2.5; s.beginPath(); s.arc(C, C, 372, 0, 7); s.stroke(); s.globalAlpha = 1;
const an = -0.75; s.fillStyle = '#fff'; s.beginPath(); s.arc(C + Math.cos(an) * 372, C + Math.sin(an) * 372, 11, 0, 7); s.fill();
// the cent sign
s.fillStyle = '#fff'; s.textAlign = 'center'; s.textBaseline = 'middle';
s.font = '800 470px Inter'; s.fillText('¢', C, C + 18);
// bloom composite
g.drawImage(sc, 0, 0);
g.globalCompositeOperation = 'lighter';
g.filter = 'blur(14px)'; g.globalAlpha = 0.55; g.drawImage(sc, 0, 0);
g.filter = 'blur(48px)'; g.globalAlpha = 0.35; g.drawImage(sc, 0, 0);
g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
// vignette
const v = g.createRadialGradient(C, C, S * 0.32, C, C, S * 0.75);
v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.85)');
g.fillStyle = v; g.fillRect(0, 0, S, S);
};
</script></body></html>`;

const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1080, height: 1080 } });
pg.on('pageerror', e => console.error('PAGE ERROR', e.message));
await pg.setContent(html);
await pg.evaluate(() => document.fonts.load('800 100px Inter'));
await pg.evaluate(() => window.draw());
const data = await pg.evaluate(() => document.getElementById('c').toDataURL('image/png'));
writeFileSync(path.join(dir, 'avatar.png'), Buffer.from(data.split(',')[1], 'base64'));
await b.close();
console.log('wrote brand/avatar.png');
