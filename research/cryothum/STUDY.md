# @cryothum — style study (11 videos, 2026-11-02)

Source: Drive folder "Cryothm videos for train Claude", 11 mp4s. Each is 1024x576, 30 fps, landscape 16:9, 54–79 s.
Note: v1 carries the watermark **@humandishub**, not @cryothum. It is the same style (probably the same studio or a copycat).
Method:
- Contact sheet every 2.5 s, plus full 30 fps frame strips.
- Per-frame difference energy to find cuts and moves.
- Local ASR (Parakeet) for the scripts.
- Spectrograms for the audio.
Files: `transcripts.md`, `sheets/`.

---

## 1. Look (lighting, contrast, shadows)
- **Pure monochrome.** Black background (#000 to #050505) and white or grey line art. No colour anywhere.
- **Faint dot grid** on the background: tiny grey dots about 24 px apart, at roughly 8% opacity. It gives a "blueprint / infinite canvas" feel.
- **Line icons.** Strokes are 2–3 px with rounded caps. Shapes are simple pictograms: a person (circle head plus pill body), door, rocket, piggy bank, store, phone, scale, envelope.
- **The key element is solid white.** The "hero" object (the person, or the active icon) is filled pure white. Everything else is outline only, at 40–70% grey. Filled versus outline is how they do emphasis.
- **Lighting = bloom, not shadows.** No cast shadows at all. Bright objects have a big soft glow: the radius is 3–6x the object, about 30–40% intensity, with a radial falloff.
- **Volumetric light beams.** Example: an open door throws a soft grey trapezoid beam onto the floor and the person (v8 @12 s). A spotlight or desk lamp throws a cone (v6 @40 s).
- **Vignette.** The centre is slightly lifted, the corners are crushed to black. The frame stays above 90% black pixels.
- **Contrast.** Peaks are pure white (255) inside a near-black frame, which is extreme. Mid-greys are used only for "inactive" or past elements.
- **Depth of field / fade-out.** Old elements fade to 20–30% grey and blur slightly as the camera moves on.

## 2. Text on screen (no word captions!)
- **There are NO word-by-word captions.** The only text is small keyword labels:
  - uppercase, wide letter-spacing (about 0.25 em), geometric sans (Montserrat/Inter style), small (about 12–14 px at 576p).
  - examples: "A REASON TO BELIEVE", "POTENTIAL", "PSYCHOLOGICAL TRAP", "KNOW WHEN TO SPEND."
- **Pill tags.** Rounded-rectangle outlines with uppercase text inside (FUTURE, NOT YET, SOLVED, MAYBE, WORKS).
- **Big numbers** are the only large text: $10,000, $681,400, 38/100, 12,480, 92%. They count up with ease-out. For example, $2,837 → $10,000 in about 26 frames, decelerating, and the last digits tick slowly.
- **Each label appears on the spoken word,** within about 0–3 frames. It fades up and drifts 5–10 px.

## 3. Camera, movement, cuts
- **Almost no hard cuts.** In 10 of 11 videos the only cut is the TikTok outro (the last 4 s). The exception is v6, which has 7 internal cuts, about 1 every 7 s.
- **One infinite canvas.** The camera pans, pushes in and pulls out across a single world. New ideas are placed off-screen, and the camera glides to them.
- **Move timing:**
  - Camera moves last 11–24 frames (0.4–0.8 s) and are strongly **ease-in-out**: the energy curve is a bell that peaks at mid-move.
  - Between moves the frame holds still or drifts slowly. Fully still frames are 15–60% of the runtime.
- **Beat rate.** A new visual change (a move, an element appearing, a morph, or a counter) happens every **2–3 s**. That is faster than our 4–5 s rule.
- **Transitions:**
  1. Glide pan to the next idea, which is already drawn on the canvas.
  2. Fade-to-black dip: about 3 frames down, the new object appears dim, then "switches on" with a bloom flash.
  3. Morph: one icon becomes the next. Examples: idea bulb → product card, piggy bank → jar, crowd → particles.
  4. Push-in "through" an object, such as a thought bubble or a door.
  5. Pull-out reveal: a zoomed-in detail is revealed as part of a bigger diagram (a circle around a group becomes "existing market").
- **Element animation:**
  - Lines **draw on** along their path, with a glowing dot leading the tip.
  - Icons **scale-pop** from 0.8 to 1.0 with a soft overshoot, and the glow flashes once.
  - Crowds of people icons ripple in with stagger.
  - Particles drift slowly, like dust.
  - Counters roll.
  - Progress bars and meters fill.
  - Ripple rings expand from the activated object, then fade.
- **The "person" icon is the protagonist.** He reacts with pose swaps (arms up = success, hand raised = pointing, question mark above the head = confused) and simple hops. He has no face.

## 4. Sound
- The voice is calm, low and confident. It sounds like an AI narrator (male, American, measured). The delivery is continuous with almost no pauses.
  - Speed: 150–195 wpm, average about 175.
- **Music bed** sits under the voice at about −20 to −25 dB. It is soft, ambient and piano/pad-like, and it continues for about 1 s after the voice ends.
- Subtle SFX (soft whooshes and ticks) on the moves and pops. They sit under the voice and are never comedic.

## 5. Script formula (from 11 transcripts)
- **Length:** 155–209 words, average 187. The voice runs 49–75 s. Sentences average 12–17 words.
- **Niche:** money and mindset psychology, in the second person ("you"). No jokes, no characters' names, no real-world "story". The tone is philosophical and calm.
- **Structure:**
  1. **Hook (1 sentence, 9–14 words).** A contrarian aphorism or paradox. The templates:
     - "The most dangerous thing about ___ is that ___."
     - "Money follows systems, not effort."
     - "You don't need to ___ to ___."
     - "Trying to ___ might be the reason you're not ___."
     - "Your future self will regret ___ more than ___."
  2. **Common belief (6 of 11):** "Most people believe / spend years / underestimate…"
  3. **Turn (10 of 11):** "But the problem is… / But there's something most people overlook / But something strange happens when…"
  4. **Scenario (5 of 11):** "Imagine someone who… / Imagine spending years…", with concrete small numbers: 10 hours, $10,000 a month, 5% better, $100, 80 years old.
  5. **Rule of three:** "too expensive, the delivery takes too long, or the customer experience is terrible."
  6. **Mechanism:** "This happens because… / This is why…"
  7. **Concession (4 of 11):** "Of course, ___ doesn't guarantee ___." It builds trust.
  8. **Closer:** "Because ___" plus a reframe that **reuses the hook's words.** For example, v6 opens with "Making money once means nothing…" and closes with "making money once proves that something worked. Understanding why…" This makes a soft loop.
- **No CTA and no question at the end.** The last line is a quotable statement, followed by a 4 s TikTok outro.
