// Usage: node engine/checkcues.js <video-name>  — prints every T cue with the words it lands on
const name = process.argv[2], fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'videos', name);
const words = JSON.parse(fs.readFileSync(path.join(dir, 'words.json'), 'utf8'));
global.window = {}; global.document = {};
eval(fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8'));
const MM = window.MM; MM.words = words;
const src = fs.readFileSync(path.join(dir, 'scene.js'), 'utf8');
const head = src.slice(0, src.indexOf('T.end =')).replace(/^const \{[^}]*\} = MM;/m, '').replace('const T =', 'global.T =');
eval(head);
let bad = 0;
for (const [k, v] of Object.entries(T)) {
  const i = words.findIndex(x => x.s === v);
  if (typeof v !== 'number' || i < 0) { bad++; console.log('BAD', k, v); continue; }
  process.stdout.write(`${k}=${v.toFixed(1)}[${words.slice(i, i + 3).map(x => x.w).join(' ')}]  `);
}
console.log(bad ? `\n${bad} BAD CUES` : '\nall cues ok');
