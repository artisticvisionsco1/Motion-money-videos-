# Motion money videos (new TikTok account)

The owner speaks Hinglish. Reply in Hinglish (Roman Urdu/Hindi), short and clear.

## Separation rule (most important)
This account is **completely separate** from the 3D toon channel (repo `TikTok-ai-videos`).
- **Never mix the two.** Do not take anything from that repo:
  - no styles
  - no characters (the HERO toon)
  - no scripts
  - no rules ("The problems?", comment-bait, word-synced captions)
  - no voice settings
  - no code
- The reverse also holds: nothing from this account goes into that channel.
- Work for this account lives only in this repo.

## Reference style
The reference style is @cryothum. The full breakdown is in `research/cryothum/STUDY.md`, and the 11 reference scripts are in `research/cryothum/transcripts.md`.
In short:
- 2D monochrome line-art on black, with a faint dot grid, bloom glow and volumetric beams. No colour.
- A faceless pictogram person is the protagonist. The key element is filled white; the rest is outline.
- One continuous canvas, with no hard cuts. Camera glides last 0.4–0.8 s and ease in and out. A new visual beat comes every 2–3 s.
- No spoken-word captions, only small uppercase tracked keyword labels and pill tags. Big numbers count up with ease-out.
- A calm male narrator at about 175 wpm, a soft ambient music bed, and subtle whooshes.
- Script:
  - Money and mindset psychology, written in the second person. 155–210 words.
  - Hook paradox → "Most people…" → "But…" → "Imagine…" with real numbers → "This is why…" → "Of course…" → a closer that reuses the hook's words.
  - No jokes, no ending question.

## Voice
- ElevenLabs "Charliee - Calm Cinematic Narrator", voice_id `e70vjI59gG5dZUD6cZTQ`, model `eleven_v4`.
- Generate 2 takes and pick the calmer one.
- Store the pick in `videos/<name>/voice.json`.

## Pipeline per video (`videos/<name>/`)
1. `script.txt` (155–210 words) and `beats.md` (visual plan, one beat every ~3 s).
2. Voice:
   1. Make an ElevenLabs flow and run `creative_generate_speech`.
   2. `curl` the chosen take to `voice.mp3`.
   3. Get word timings with local ASR: `python3 engine/asr.py <model-dir> asr.json voice.mp3`, then `python3 engine/words.py asr.json voice.mp3 words.json`. Parakeet runs through sherpa-onnx; the model comes from GitHub releases (`k2-fsa/sherpa-onnx` `asr-models`). The result goes to `words.json` as `[{w,s,e}]`.
3. `scene.js` defines `SCENE = {duration, camera:[moves], draw(g,t,cam)}` using the `engine/engine.js` helpers (`MM.*`).
   - `MM.word(w, n)` returns the start of the nth occurrence of `w`. Punctuation is ignored, so "value," counts as "value". Always print and check every cue.
4. Stills: `node engine/render.mjs <name> --stills`. Tile them and look at them.
5. Full render: `node engine/render.mjs <name>` produces `out/<name>.silent.mp4` and `out/<name>.cues.json`.
6. Audio: `python3 engine/audio.py <name>` builds the pad and whooshes. Then mix with the voice (loudnorm −15 LUFS, bed at 0.7) and mux into `renders/<name>.mp4`.
7. Verify with a tile sheet. Commit and push.
