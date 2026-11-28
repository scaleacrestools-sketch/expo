# QA Report — V2

Date: 28 Nov 2026. V2 tested as a production build (`vite build` + `vite preview`) in Playwright Chromium 1.63. V1 tested on the live Netlify site. Baseline details are in `V2-AUDIT.md`.

## Summary

| Check | V1 (deployed) | V2 (production build, local) |
|---|---|---|
| Playwright tests | 39 / 39 pass | **44 / 44 pass** (two consecutive runs) |
| Lighthouse mobile (perf / a11y / BP / SEO) | 96 / 100 / 100 / 100 | **96–97 / 100 / 100 / 100** |
| Lighthouse desktop | 100 / 100 / 100 / 100 | **100 / 100 / 100 / 100** |
| Mobile LCP | 1.6–1.9 s | 2.1 s |
| CLS | 0 | 0 (mobile), 0.001 (desktop) |
| Mobile TBT | 170–180 ms | 160 ms |
| Page weight on load | 279 KB | **220 KB** |
| Font download | 133 KB (2 files) | **54 KB** (2 subset files) |
| Deploy size (`dist/`) | ~20 MB | **8.8 MB** (review GIFs/videos moved out) |
| Hero dashboard visible at 1440 × 900 | 231 px | **346 px** |
| Console / JS / network errors | none | none |
| Horizontal overflow (9 widths) | none | none |

**Lab vs field.** All figures are lab measurements (Lighthouse simulated throttling, Playwright). There is no real-user data yet. V1 numbers come from Netlify (real network); V2 numbers come from `localhost`, so V2 has no network latency advantage or penalty applied by a CDN. Re-measure V2 after deploying.

### Interaction latency (INP proxy, lab)
Worst interaction per run across 9–13 real taps (menu, voice tabs and language, play, use-case tab, FAQ, funnel toggle, phone screens, date range, demo modal) on an emulated Pixel 7:

| | Run 1 | 2 | 3 | 4 | 5 | Median |
|---|---|---|---|---|---|---|
| V1, 4× CPU throttle | 216 | 264 | 248 | 200 | 208 | **216 ms** |
| V2, 4× CPU throttle | 224 | 280 | 160 | 256 | 208 | **224 ms** |
| V2, no throttle | 104 | 112 | 112 | — | — | **112 ms** |

Under heavy 4× throttling both versions sit slightly above the 200 ms target, with large run-to-run noise on this shared machine. V2 changes made to keep it level with V1 despite richer content: voice waveform rendered as one SVG path with a moving clip (instead of 96 elements), playback updates throttled to ~25/s, tab pills without layout animations, modal content mounted one frame after the dialog paints. True INP needs field data from real visitors.

## Section-by-section (V1 → V2)

| # | Section | Theme | V2 result | What changed / verified |
|---|---|---|---|---|
| 01 | Navigation | Dark | Pass | Agenly glass bar on `#080515`; active-section underline (`aria-current`) driven by one IntersectionObserver; dropdown, mobile menu, 44 px targets verified; anchor offset fixed (V2 bug found by tests: double 168 px offset). |
| 02 | Hero | Dark | Pass | Spacing tightened; dashboard 346 px above the fold; Book a Demo · Watch Product Demo · Hear a Sample Call; 9-step story with call/qualified/visit notifications, qualification progress, status changes, dashboard +1 update; floating cards moved fully outside the dashboard; step caption. |
| 03 | Trusted By | Dark | Pass | Heading raised to display size; marquee slowed to 48 s, wider edge fade, pause on hover; categories only (no client logos). |
| 04 | The Problem | White | Pass | Three distinct animated illustrations kept; sheet transition from dark. |
| 05 | Lead Funnel | White | Pass | Particles flow between stages; labels above bars (readable on mobile); tooltips; "Illustrative data" tag. |
| 06 | Performance | Dark | Pass | Live status feed, row entrance, chart draw, count-ups, donut animation; outcome shares corrected to match the 68% connect rate; table retitled "Top campaigns this week". Reveal state now latches (V2 bug found in QA: content re-hid when scrolled away). |
| 07 | How It Works | White | Pass | Pause/Play tour control, auto-advance pauses on hover/focus and after manual selection; animated rail with moving data dot; walkthrough preview card opens the same video. |
| 08 | AI Voice Agents | Dark | Pass | ElevenLabs recordings in English, Hinglish and Hindi; waveform from real audio peaks; seek, restart, duration, speaker identification, synced transcript, outcome + qualification result; audio `preload="none"`. Mobile tabs changed to a 2×2 grid (V2 QA finding: tabs were clipped). |
| 09 | Omnichannel | Dark | Pass | Centre card follows Rohan Mehta through all 7 stages with stage detail and progress; lit and completed nodes; email + SMS light for visit reminders; particles reverse toward the active channel. |
| 10 | Features | White | Pass | Asymmetric bento with AI Calling, Lead Qualification, WhatsApp and Site Visit as large "Core capability" cards; new demos for scoring, 24/7 permitted hours, reactivation scheduling, WhatsApp typing and delivery ticks; calendar demo re-laid out (V2 QA finding: oversized cells). |
| 11 | Use Cases | Dark | Pass | Icon tabs, four distinct dashboards, arrow/Home/End keys. |
| 12 | Qualification | White | Pass | Ten-question sequence: question → answer → CRM field → progress → score (example rules sum to 86). |
| 13 | Integrations | Dark | Pass | Unchanged structure; all items labelled Planned with no-partnership note; horizon glow. |
| 14 | Mobile CRM | White | Pass | Live notifications and status changes on both screens; "Product Preview · Coming Soon" kept. |
| 15 | Comparison | White | Pass | Unchanged rows; sticky feature column and horizontal scroll verified at 390 px. |
| 16 | FAQ | Dark | Pass | Sheet transition; keyboard accordion verified. |
| 17 | Final CTA | Dark | Pass | Agenly-style card glow; divider orb joins it to the footer. |
| 18 | Footer | Dark | Pass | Two-column mobile layout kept; connected to CTA. |

## Comparison with the references

| Aspect | Agenly | V2 |
|---|---|---|
| Background / surfaces | `#080515`, `#0D0D1C`, `#111225` | Same values |
| Card depth | Inset blue glow + hairline | Same treatment |
| Headline type | Inter 400, −5 px, display sizes | Inter Display 500, −0.05 em (slightly heavier for legibility on white) |
| Buttons | Pill, gradient, 10/25 glow, inset highlight | Same structure in brand violet |
| Section rhythm | Horizon glows, orb dividers | Horizon glows, orb dividers, plus rounded sheet transitions for dark/white changes |
| Accent | Blue `#1856FF` | Violet `#8057FF` (Agenly's own violet token); blue used only for data accents |

| Aspect | HUVO | V2 |
|---|---|---|
| White sections | Ink `#0D1424`, slate text, `#EAF0F6` hairlines | Same palette (slate darkened for AA) |
| Product story | Live dashboard in hero, sticky How It Works, problem cards, mobile app | All present, with interactive demos instead of static mockups |
| Voice | Real calls (proprietary) | Original ElevenLabs recordings, clearly labelled as simulated |

Visual comparison images: `preview/compare-fold-v1-v2.png` (first viewport) and `preview/compare-fullpage-v1-v2.png`.

## Functional tests (all executed, all passing)
SEO basics · 18 sections in order with correct themes · every anchor resolves · nav anchors scroll correctly · active nav indicator · Solutions dropdown · mobile menu · demo modal from three CTAs, validation, spam time-trap, local-preview message · **form POST against the live site** (intercepted, verifies `form-name=demo-request` and fields) · voice tabs (click and keys), Hinglish and Hindi transcripts, no audio preload, playback, speaker label, seek, pause, restart, result card · sample-call CTA scrolls to voice · How It Works steps, keys, pause/play tour · video preview card · video modal: poster, no autoplay, plays on demand, >25 s, caption track, voice-over default, switch to silent, Escape closes and unmounts · use-case tabs and footer deep links · funnel toggle and tooltip · chart tooltip and range toggle · campaign rows · feature calendar · 12 visible integration cards and tooltip · comparison rows · mobile CRM screen switch · omnichannel tooltip · FAQ by mouse and keyboard · legal dialog · qualification reaches 10/10 and score 86 · outcome shares sum to 100 and "no answer" = 32% · reduced motion (final states, no infinite animations) · **slow network** (400 ms latency, 500 kbps: H1 renders, page completes, no audio/video/GIF requested) · no horizontal overflow at 1920–320 px · touch targets ≥ 40 px.

## Media verification
| Asset | Result |
|---|---|
| `product-walkthrough(-voiceover).mp4/.webm` | 1920×1080, 33.9 s; voice-over versions have AAC/Opus audio, −16.6 dB mean, −1.0 dB peak; silent versions have no audio track |
| Opening frame | Shows the Meta Ads form with the buyer's name already filled (V1 opened on an empty frame) |
| Ending | 3.2 s call-to-action card with "Book a Demo" |
| Captions | `product-walkthrough.vtt`, generated from the same timings as the narration |
| Sample calls | 12 MP3 (4 scenarios × 3 languages), 10–17 s each, 860 KB total, waveform peaks precomputed |
| GIFs | 6 in `media/gifs/`, 0.3–1.2 MB, 6.6–12 s |
| Previews | `preview/landing-page-preview-v2.mp4` (16.6 s, 1440×900), `.gif` (13.8 s), `homepage-desktop-v2.png`, `homepage-mobile-v2.png` |

## Remaining limitations
1. **Netlify Forms is disabled on the live project.** Enable form detection in Netlify and redeploy; until then real enquiries fail (the form says so).
2. **V2 is not deployed.** Lighthouse and interaction numbers for V2 are from `localhost`. Re-run on the deployed URL (`BASE_URL=… npm test` works against any URL).
3. **Audio quality was checked technically, not by ear.** Durations, levels and line timing were verified; I cannot listen to playback in this environment. Please review the 12 calls and the narration before publishing.
4. **ElevenLabs credits were used**: 45 call lines + 9 narration lines (each generated with ElevenLabs' default two takes; the first take was used).
5. **INP** is a lab proxy, slightly above 200 ms only under 4× CPU throttling (V1 is the same); no field data exists.
6. **Mobile Features** is long (4,767 px at 390 px) because every feature keeps its own demo; consider collapsing secondary feature demos on phones if the page feels long.
7. Only Chromium was automated; Safari and Firefox were not tested.
8. Placeholders remain for product name, company, domain, contact details and legal pages.
