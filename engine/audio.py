# Usage: python3 engine/audio.py <name>
# Builds out/<name>.bed.wav: soft ambient pad + whooshes on camera moves.
import json, sys, wave, numpy as np
name = sys.argv[1]
cues = json.load(open(f"out/{name}.cues.json"))
SR = 44100; dur = cues["duration"] + 0.5; n = int(SR * dur)
t = np.arange(n) / SR
rng = np.random.default_rng(7)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
# Am - F - C - G, 8 s per chord, 1.5 s crossfades
chords = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]
pad = np.zeros(n)
L = 8.0
for k in range(int(dur // L) + 2):
    c = chords[k % 4]; t0 = k * L - 1.5
    env = np.clip((t - t0) / 1.5, 0, 1) * np.clip((t0 + L + 3.0 - t) / 1.5, 0, 1)
    if env.max() == 0: continue
    for m in c:
        f = midi(m)
        for det in (-0.12, 0.12):
            pad += env * np.sin(2 * np.pi * (f + det) * t + rng.uniform(0, 6)) * (0.6 if m > 60 else 1.0)
    pad += env * 0.5 * np.sin(2 * np.pi * midi(c[0] - 12) * t)
# gentle lowpass (one-pole) and slow swell
a = np.exp(-2 * np.pi * 900 / SR); y = np.zeros(n); acc = 0.0
from scipy.signal import lfilter  # type: ignore
y = lfilter([1 - a], [1, -a], pad)
y *= 0.85 + 0.15 * np.sin(2 * np.pi * t / 11)
y /= np.abs(y).max() + 1e-9
bed = 0.16 * y
# whooshes: bandpassed noise swell, 0.7 s, centred on move start
noise = rng.standard_normal(n)
for m in cues["moves"]:
    s0 = int((m - 0.15) * SR); ln = int(0.75 * SR)
    if s0 < 0 or s0 + ln > n: continue
    seg = noise[s0:s0 + ln].copy()
    x = np.linspace(0, 1, ln)
    env = np.sin(np.pi * x) ** 2
    # sweep a lowpass from 600 -> 3500 Hz by blending two filtered copies
    lo = lfilter([1 - np.exp(-2*np.pi*250/SR)], [1, -np.exp(-2*np.pi*250/SR)], seg)
    hi = lfilter([1 - np.exp(-2*np.pi*1400/SR)], [1, -np.exp(-2*np.pi*1400/SR)], seg)
    w = (lo * (1 - x) + hi * x) * env
    bed[s0:s0 + ln] += 0.07 * w / (np.abs(w).max() + 1e-9)
fade = np.clip((dur - 0.5 - t) / 0.4, 0, 1) * np.clip(t / 0.3, 0, 1)
bed *= fade
out = (np.clip(bed, -1, 1) * 32767).astype(np.int16)
st = np.repeat(out[:, None], 2, axis=1)
with wave.open(f"out/{name}.bed.wav", "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(st.tobytes())
print("bed", dur, "s,", len(cues["moves"]), "whooshes")
