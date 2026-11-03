// Usage: node engine/render.mjs <video-folder-name> [--stills] [--from s] [--to s]
// Renders videos/<name>/scene.js to out/<name>.silent.mp4 (or stills sheet).
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
const args = process.argv.slice(3);
const stills = args.includes('--stills');
const opt = k => { const i = args.indexOf(k); return i >= 0 ? parseFloat(args[i + 1]) : null; };
const dir = path.join(root, 'videos', name);
const words = existsSync(path.join(dir, 'words.json')) ? readFileSync(path.join(dir, 'words.json'), 'utf8') : '[]';
const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}canvas{display:block}</style></head><body>
<script>${readFileSync(path.join(root, 'engine/engine.js'), 'utf8')}</script>
<script>MM.words=${words};</script>
<script>${readFileSync(path.join(dir, 'scene.js'), 'utf8')}</script>
<script>MM.init(); window.renderAt=(t,q)=>{MM.frame(SCENE,t);return MM.canvas.toDataURL('image/jpeg',q)};</script>
</body></html>`;

const FPS = 30;
const outDir = path.join(root, 'out'); mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
await page.setContent(html);
await page.evaluate(() => document.fonts.load('600 20px Inter').then(() => document.fonts.load('700 20px Inter')));
const dur = await page.evaluate(() => SCENE.duration);
const { writeFileSync: wf } = await import('fs');
wf(path.join(outDir, name + '.cues.json'), JSON.stringify(await page.evaluate(() => ({ duration: SCENE.duration, moves: SCENE.camera.slice(1).map(m => m.t) }))));

if (stills) {
  // 12 stills -> contact sheet
  const times = Array.from({ length: 12 }, (_, i) => +(0.5 + i * (dur - 1) / 11).toFixed(2));
  const sdir = path.join(outDir, name + '-stills'); mkdirSync(sdir, { recursive: true });
  const { writeFileSync } = await import('fs');
  for (const [i, t] of times.entries()) {
    const d = await page.evaluate(([t]) => renderAt(t, 0.9), [t]);
    writeFileSync(path.join(sdir, `s${String(i).padStart(2, '0')}_${t}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
  }
  console.log('stills in', sdir);
  await browser.close();
  process.exit(0);
}

const t0 = opt('--from') ?? 0, t1 = opt('--to') ?? dur;
const outFile = path.join(outDir, `${name}.silent.mp4`);
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-tune', 'animation', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
const n = Math.round((t1 - t0) * FPS);
const start = Date.now();
for (let f = 0; f < n; f++) {
  const t = t0 + f / FPS;
  const d = await page.evaluate(([t]) => renderAt(t, 0.95), [t]);
  const buf = Buffer.from(d.split(',')[1], 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 150 === 0) console.log(`frame ${f}/${n}  ${((Date.now() - start) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', outFile);
