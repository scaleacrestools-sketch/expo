# ScaleAcres hero showreel — Higgsfield production brief

**Goal.** A 15–20 s silent, loop-friendly brand film for the homepage hero. It should show in seconds that ScaleAcres does real estate marketing, branding, websites, performance marketing and creative production.

**Look.** Photoreal commercial cinematography. Deep black, graphite, neutral white and ScaleAcres electric blue `#1CA6DC`. Controlled camera, natural materials, real motion blur. Premium editorial energy, with no copied visuals from any other agency.

**Hard rules for every shot:** no text, letters or digits in frame; no logos or brand names; no watermarks; no surreal architecture; no distorted hands, faces or devices; no invented results. The logo, headline and real website screenshots are added in the edit or as HTML/CSS overlays, never generated.

## Generated clips (already rendered)

Twelve clips were generated with **Kling v3.0, pro mode, 5 s, sound off** on 16 Oct 2026, at 8.75 credits each (105 credits in total). They are in the ScaleAcres Higgsfield account under *Generations*. Download each one and rename it as shown before running `npm run showreel -- <folder>`.

| Shot | 16:9 job ID → rename to | 9:16 job ID → rename to |
|---|---|---|
| 01 Real estate / architecture | `99e030e4-e115-40c0-b671-f1ed843d512b` → `01-architecture-16x9.mp4` | `336116a6-ddde-4b73-92c9-0b3782c1c96e` → `01-architecture-9x16.mp4` |
| 02 Brand identity | `1be4e27b-378b-4c8a-a0b3-2c822a90772d` → `02-brand-16x9.mp4` | `7c7bb683-e39f-4146-b1be-19c3814c9e1c` → `02-brand-9x16.mp4` |
| 03 Website design & dev | `403ad6ab-0286-4361-a2eb-8ed512fd75e9` → `03-web-16x9.mp4` | `54f1f3cc-ca9d-4918-9866-4ee47d53a22e` → `03-web-9x16.mp4` |
| 04 Performance marketing | `64204512-6033-485c-a273-22d8f8e32df8` → `04-performance-16x9.mp4` | `82ccf80e-99a1-4357-adb2-683d728a17ed` → `04-performance-9x16.mp4` |
| 05 Video & creative production | `153e12d6-e10d-4d75-86bc-cf17f283f9df` → `05-video-16x9.mp4` | `7cb91829-31d3-4b5b-bbb3-9cd3d8ad114e` → `05-video-9x16.mp4` |
| 06 Brand finale (logo space) | `bed6c31b-1dc1-4c0b-be07-567c4eb9b64a` → `06-finale-16x9.mp4` | `f6a39dbf-2916-4af1-8ccf-2bab7d33c713` → `06-finale-9x16.mp4` |

**Review each clip before use.** Reject any clip with readable or garbled text on screens, warped hands or devices, or impossible architecture, and regenerate it with the same prompt (or a different seed). Shots 03 and 04 are the most likely to need a second take, because they show screens.

## Shot list and prompts

Each prompt below is the exact text submitted. Re-use it for re-takes.

### SHOT 01 — Real estate / architecture (0:00–0:03)
- **Camera:** aerial descent gliding forward to the facade (16:9); upward tilt along the tower (9:16).
- **Light:** blue hour, warm practicals in a few windows.
- **Prompt (16:9):** Photorealistic commercial cinematography. Slow, controlled aerial drone shot descending and gliding forward toward the facade of a premium contemporary high-rise residential tower at blue hour. Clean glass and dark graphite stone facade, warm interior lights in a few apartments, crisp architectural lines, deep navy-blue sky, subtle city lights below. Realistic materials, natural reflections, gentle motion blur. Colour grade: deep blacks, graphite, cool electric-blue highlights, neutral whites. No text, no logos, no signage, no people close up, no surreal architecture, no watermark.
- **Transition out:** match-cut on the vertical facade line into the card edge of Shot 02.

### SHOT 02 — Brand identity (0:03–0:06)
- **Camera:** slow dolly-in (16:9); top-down crane (9:16).
- **Light:** single soft key from top-left, deep falloff.
- **Prompt (16:9):** Photorealistic high-end creative studio product shot. Slow dolly-in across a dark matte table with premium brand identity mockups: black and white business cards, letterhead, a hardcover brand guidelines book and a tablet, all with clean abstract geometric shapes in electric blue, completely free of readable text or logos. Soft directional studio key light, deep shadows, subtle reflections. Colour grade: black, charcoal, white and electric blue. No text, no letters, no logos, no watermark, no hands.
- **Post:** optionally screen-replace the tablet with an approved ScaleAcres brand board.
- **Transition out:** speed-ramp into Shot 03.

### SHOT 03 — Website design & development (0:06–0:09)
- **Camera:** lateral over-shoulder slide (16:9); push-in on a phone (9:16).
- **Prompt (16:9):** Photorealistic commercial close-up. A designer at a modern desk in a dark studio, seen from behind the shoulder, slow lateral camera slide. Large desktop monitor shows an abstract, blurred website layout with big architectural photography blocks and blue interface accents, deliberately out of focus so no text is readable. Natural hand position on a mouse, realistic anatomy. Shallow depth of field, cinematic bokeh, cool blue monitor glow on the face edge. Colour grade: black, graphite, electric blue. No readable text, no logos, no watermark.
- **Post (required):** corner-pin an **approved ScaleAcres website screenshot** onto the monitor or phone, with slight blur and glow to sit in the shot.

### SHOT 04 — Performance marketing (0:09–0:12)
- **Camera:** slow push-in.
- **Prompt (16:9):** Photorealistic premium technology close-up. Slow push-in on a large dark screen displaying abstract animated data visualisation: flowing electric-blue line graphs, soft glowing bars and particle streams on a black background, no numbers and no readable labels. In soft focus, two professionals in a dark meeting room review the screen. Precise, calm, high-end mood. Colour grade: deep black, charcoal, electric blue highlights. No text, no digits, no logos, no watermark.
- **Rule:** no readable figures. If any appear, blur them or reject the take.

### SHOT 05 — Video & creative production (0:12–0:15)
- **Camera:** slow orbit (16:9); vertical crane down (9:16).
- **Prompt (16:9):** Photorealistic video editing studio at night. Slow orbit around a professional editing desk with a cinema camera on a rig in the foreground, dual monitors showing an abstract colourful video timeline and a blurred architectural film frame, nothing readable. Realistic equipment, cables, a control surface with soft backlit keys. Moody cinematic lighting with blue practical lights and deep shadows, gentle motion blur. Colour grade: black, graphite, electric blue. No text, no logos, no watermark.
- **Post:** optionally replace the monitor with a frame from an approved ScaleAcres project reel.

### SHOT 06 — Brand finale (0:15–0:18)
- **Camera:** locked off, light-sweep motion only.
- **Prompt (16:9):** Minimal premium brand finale. A pure black architectural space with smooth concrete walls. A thin, powerful electric-blue light beam sweeps slowly from left to right across vertical architectural fins, revealing their edges, then settles into a soft blue glow. The centre of the frame stays clean, dark and empty to leave space for a logo added later. Subtle haze, realistic light falloff. Colour grade: deep black and electric blue only. No text, no letters, no logos, no watermark.
- **Post:** composite the **official ScaleAcres logo** (reversed artwork) at the centre after the sweep. The script does this automatically when `logo.png` sits in the clips folder.

## Edit

- **Structure:** 6 × 3 s with 0.5 s cross-dissolves, about 17.5 s in total. The finale should hold on the black-and-blue frame so the loop back to Shot 01 reads as intentional.
- **Transitions:** match cuts on vertical lines (01→02), a speed ramp (02→03), whip-pan blur (03→04), light-leak in blue (04→05) and a hard cut to black (05→06). `scripts/build-showreel.sh` applies dissolves; refine in Premiere or Resolve for the full set.
- **Grade:** lift blacks slightly, keep shadow saturation low, push highlights toward `#1CA6DC`, and keep warm practicals small. The script applies a light base grade (contrast 1.06, saturation 0.92, blue lift in shadows and mids).
- **Speed:** 100% or slower, with no fast-forward look. Use speed ramps only on the cuts.
- **Text:** none burned in. The hero headline is live HTML.

## Sound (for social cut-downs; the website plays muted)
Low sub-bass pulse at about 90 BPM, airy synth pad, subtle whooshes on transitions, and a single low "hit" on the finale. No voice-over. Mix to −14 LUFS for social.

## Export

| Deliverable | Spec |
|---|---|
| Desktop master | 1920×1080, 16:9, H.264 CRF 16, 30 fps, no audio (`showreel-master-16x9.mp4`) |
| Mobile master | 1080×1920, 9:16, subject-centred, same encode |
| Web desktop | `public/videos/showreel.mp4` (H.264 CRF 27, max 3 Mbit/s, faststart) + `showreel.webm` (VP9 CRF 36), target ≤ 6 MB |
| Web mobile | `public/videos/showreel-portrait.mp4` / `.webm`, target ≤ 4 MB |
| Posters | `public/images/hero-poster.jpg` and `hero-poster-mobile.jpg` (first frame) |
| Reduced motion | The site never autoplays when `prefers-reduced-motion` is set and shows the poster instead. A pause control is always visible. |

```bash
# after downloading + renaming the 12 clips into ./clips (and optionally ./clips/logo.png)
npm run showreel -- ./clips
# then in app/page.tsx set heroMedia.placeholder = false
```
