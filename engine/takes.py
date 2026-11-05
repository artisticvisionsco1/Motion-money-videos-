# Usage: python3 engine/takes.py <video-name> <model-dir> [--max SECONDS] URL1 URL2 ...
# Downloads each take, runs local ASR, diffs against videos/<name>/script.txt (numbers ignored),
# picks the most accurate take (ties -> shorter), optionally speeds it up (atempo <= 1.08)
# so it fits under --max seconds, and writes voice.mp3 + words.json.
import json, os, re, subprocess, sys, difflib, tempfile
name, model = sys.argv[1], sys.argv[2]
args = sys.argv[3:]
mx = None
if args and args[0] == '--max': mx = float(args[1]); args = args[2:]
urls = args
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
vdir = os.path.join(root, 'videos', name)
tmp = tempfile.mkdtemp()
files = []
for i, u in enumerate(urls):
    f = os.path.join(tmp, f'take{i+1}.mp3')
    subprocess.run(['curl', '-sS', '-o', f, u], check=True)
    files.append(f)
asr = os.path.join(tmp, 'asr.json')
subprocess.run([sys.executable, os.path.join(root, 'engine/asr.py'), model, asr] + files, check=True, capture_output=True)
res = json.load(open(asr))
ref = re.findall(r"[a-z']+", open(os.path.join(vdir, 'script.txt')).read().lower())
NUM = set('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million percent dollar dollars'.split())
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
scores = []
for i, f in enumerate(files):
    hyp = re.findall(r"[a-z']+", res[f]['text'].lower())
    sm = difflib.SequenceMatcher(None, [w for w in ref if w not in NUM], [w for w in hyp if w not in NUM])
    bad = [(' '.join(ref[a:b]), ' '.join(hyp[c:d])) for op, a, b, c, d in difflib.SequenceMatcher(None, ref, hyp).get_opcodes() if op != 'equal' and not set(ref[a:b]) <= NUM]
    scores.append((round(sm.ratio(), 3), -dur(f), i, bad))
    print(f'take{i+1}: ratio {sm.ratio():.3f}  {dur(f):.1f}s  diffs: {bad[:6]}')
best = max(scores)
i = best[2]; src = files[i]; d = dur(src)
out = os.path.join(vdir, 'voice.mp3')
tempo = 1.0
if mx and d > mx:
    tempo = min(1.08, d / mx)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'atempo={tempo:.3f}', '-b:a', '192k', out], check=True)
else:
    subprocess.run(['cp', src, out], check=True)
# words for the final file
asr2 = os.path.join(tmp, 'asr2.json')
subprocess.run([sys.executable, os.path.join(root, 'engine/asr.py'), model, asr2, out], check=True, capture_output=True)
toks = json.load(open(asr2))[out]['tokens']
words = []
for tok, t in toks:
    if tok.startswith(' ') or not words: words.append({'w': tok.strip(), 's': t})
    else: words[-1]['w'] += tok
for k, wd in enumerate(words): wd['e'] = round(words[k + 1]['s'] if k + 1 < len(words) else wd['s'] + 0.4, 2)
json.dump(words, open(os.path.join(vdir, 'words.json'), 'w'), indent=0)
print(json.dumps({'picked': f'take{i+1}', 'source_duration': round(d, 2), 'atempo': round(tempo, 3), 'final_duration': round(dur(out), 2), 'words': len(words)}))
