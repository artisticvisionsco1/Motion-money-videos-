# Video 02 vs @cryothum: measured gaps (2026-11-04)

Same metrics on the first 60–66 s of 10 reference videos and on `renders/02-price-of-time.mp4`.

| metric | @cryothum (range, typical) | ours (02) |
|---|---|---|
| frames with zero change (frozen) | 0–24 %, typ. ~5 % | **42 %** |
| frames where something moves | 69–98 %, typ. ~90 % | **55 %** |
| visual beats per 10 s | 3.9–9.4, typ. ~7.5 (one per ~1.3 s) | **4.8** |
| camera pan frames | 3–5 % | **14 %** (slides sideways) |
| frames with zoom change | 82–91 % (constant slow push-in) | **51 %** |
| content spread (bbox of bright pixels) | 46–72 %, typ. ~62 % of frame | **30 %** (small, centred) |
| mean luma / non-black coverage | ~9 / ~5 % (deep blacks, tight glow) | **16.9 / 11.5 %** (grey haze) |

## Transition (30 fps strips)
- **Reference (v7 @9 s):**
  1. The old scene **defocus-blurs and fades** while the camera keeps pushing in.
  2. New content **assembles itself**: star-dots appear and get connected by lines into "$10K", then the person walks in.
  3. Drifting star particles sit in the background.
- **Ours:** the camera **pans sideways** to a scene that is already drawn. Elements pop in, then the frame sits still for about 1 s. It reads like a slideshow.

## Audio
- **Corrected 2026-11-04** with a proper pitch tracker (librosa pyin) on clean takes. The Charliee voice is **not** monotone: its pitch range is about 17 semitones, as wide as the other candidates (12–16).
- **Speaker match:** the speaker-embedding model (wespeaker ResNet34) scored 47 library voices against the @cryothum narrator.
  - The best preview scores are Robert (Business Book) 0.82, Ken Franson 0.81 and Atlas 0.80.
  - On real eleven_v4 takes the order changes: current Charliee 0.81, Atlas 0.81, Robert 0.77, Ken 0.75.
  - None is a true match. The same narrator across videos scores about 0.98.
- **Brightness:** Atlas is the brightest of the takes (spectral centroid about 2.5 kHz vs 1.3–1.7 kHz for the others). That is closest to the crisp reference sound.
- **Music bed:** the reference bed is loud, about 3–9 dB under the voice in pauses. Ours is about 15 dB under.
- **Whooshes:** ours are full-band white noise.
- **Conclusion:** the voice is probably not the main gap. The visuals (motion, transitions, composition) are.

## Fix list
1. Never freeze:
   - a constant slow push-in (1–2 %/s)
   - drifting star particles
   - breathing glow
   - idle motion on every element
2. Double the beat density: a build or change every ~1.2–1.5 s, tied to words.
3. Transitions:
   - outgoing scene blurs, dims and is zoomed through
   - the new scene builds in place: draw-on lines, dots connecting, the person walking in
   - no long sideways pans.
4. Bigger compositions that fill about 60 % of the frame.
5. Tighter bloom with deeper blacks: less haze, a glow only around white items.
6. Audio:
   - a more expressive narrator
   - music bed about 6–8 dB under the voice
   - soft filtered whooshes, not white noise.
