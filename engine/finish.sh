#!/usr/bin/env bash
# Usage: bash engine/finish.sh <video-name>
# Audio bed + mix + mux into renders/<name>.mp4, then report near-empty stretches (>= 0.8 s).
set -e
n=$1; cd "$(dirname "$0")/.."
python3 engine/audio.py "$n" >/dev/null
ffmpeg -v error -y -i videos/$n/voice.mp3 -i out/$n.bed.wav -filter_complex "[0:a]loudnorm=I=-15:TP=-1.5:LRA=9,aresample=44100,pan=stereo|c0=c0|c1=c0[v];[1:a]volume=1.5[b];[v][b]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[m]" -map "[m]" -ar 44100 out/$n.mix.wav
ffmpeg -v error -y -i out/$n.silent.mp4 -i out/$n.mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart renders/$n.mp4
python3 - "$n" <<'PY'
import subprocess, sys, numpy as np
n = sys.argv[1]
b = subprocess.run(["ffmpeg","-v","error","-i",f"renders/{n}.mp4","-vf","fps=10,scale=160:90,format=gray","-f","rawvideo","-"],capture_output=True).stdout
f = np.frombuffer(b, np.uint8).reshape(-1, 90, 160)
empty = [(fr > 90).mean() < 0.004 for fr in f]
runs, s = [], None
for i, e in enumerate(empty + [False]):
    if e and s is None: s = i
    if not e and s is not None:
        if i - s >= 8: runs.append((s / 10, i / 10))
        s = None
d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"renders/{n}.mp4"],capture_output=True,text=True).stdout)
print(f"{n}: {d:.1f}s  near-empty stretches >=0.8s: {runs if runs else 'none'}")
PY
