# QA Report — V3

**Date:** 28 Nov 2026.
**Build:** the V3 production build (`vite build` + `vite preview`), tested in Playwright Chromium 1.63.
**Related:** `V3-AUDIT.md` (baseline) and `PERFORMANCE-REPORT-V3.md` (speed).

## Summary

| Check | Result |
|---|---|
| Automated tests | **52 passed, 4 skipped by design** (V2: 44). The skipped tests are the mobile-only tests, which skip themselves in the desktop project. Run twice, same result. |
| Lighthouse desktop / mobile performance | 100 / 96–98. Accessibility, best practices and SEO are all 100. |
| LCP / CLS / INP (lab) | 1.9–2.1 s / 0–0.001 / 168 ms median under 4× throttle |
| Horizontal overflow | None at 1920, 1440, 1280, 1024, 768, 430, 390, 375, 360 or 320 px |
| Console, JS or network errors | None at any of the six mobile test sizes |
| Visual review | All 18 sections captured on desktop and mobile, inspected, fixed, and captured again (see §4) |
| Walkthrough video | 77.5 s, 10 scenes, 1920×1080, 30 fps; voice-over and silent versions; captions; poster |
| Review recordings | Desktop 192 s at 1920×1080, 30 fps. Mobile 218 s at 780×1688 (390×844 at 2×), 30 fps. Both real time. |

## 1. New tests in V3

| Test | What it proves |
|---|---|
| Integrations hub | Pairs advance on their own; there are 12 tool cards; the beams render; hovering a tool makes the engine say "Tracing Meta Ads"; the disclosure contains "planned"; no "PLANNED" badge appears anywhere. |
| Voice exclusivity | Only one `<audio>` element exists. Switching scenario stops playback; switching language stops playback. No autoplay attribute. |
| Video modal (updated) | Duration is over 60 s. The default source is the v3 voice-over file; the silent toggle changes the source to `-silent`. Closing the modal unmounts the video, which stops playback. The poster is `product-walkthrough-poster.webp`. |
| Mobile hero | The lead-card composition is visible and its stage advances. |
| Mobile integrations | 12 brand tiles, the engine and the disclosure are visible. |
| Mobile comparison | The table is hidden; the "vs Basic IVR" toggle switches the list, which keeps all 9 rows. |
| Mobile omnichannel, campaigns, features | The 7-step timeline and the 3 campaign cards are present; Features is under 4,000 px tall (V2: 4,767 px). |
| Overflow at 360 px | Added to the width list. |
| Reduced motion (existing) | The page renders final states without errors. |

## 2. Mobile test sizes

Each size was tested with a full-page capture (`preview/v3/responsive/`), an overflow check, and console and JS error capture.

| Size | Overflow | Errors | Page height | Targets under 32 px |
|---|---|---|---|---|
| 320 × 568 | none | 0 | 25,098 px | 21 calendar cells (30 × 30) and the skip link |
| 360 × 800 | none | 0 | 24,091 px | same |
| 375 × 812 | none | 0 | 23,809 px | skip link only |
| 390 × 844 | none | 0 | 23,578 px | skip link only |
| 430 × 932 | none | 0 | 22,868 px | skip link only |
| 768 × 1024 | none | 0 | 20,494 px | 21 calendar cells (30 × 30) |

The 30 × 30 px calendar cells in the Site Visit Scheduling demo pass WCAG 2.2 AA target size (24 px minimum). The skip link is 1 × 1 px until it receives keyboard focus, which is intended. Primary controls are 40 px or larger, and an existing test enforces this.

## 3. Voice player checks

| Check | Result |
|---|---|
| Play / pause | Pass (automated) |
| Progress and seek | Pass (automated: seek to 6 s, restart) |
| Transcript follows the audio | Pass: the active line is marked `aria-current` and moves with playback (automated). Segment timings come from each clip's measured silences (`audio-timings.json`). |
| Waveform | Drawn from the real audio peaks; one SVG path with a moving clip |
| Language switching | Pass: English, Hinglish and Hindi transcripts swap and playback stops (automated) |
| No overlap; stops when another starts | Pass: one shared `<audio>` element; switching scenario or language pauses it (automated) |
| No autoplay | Pass: `preload="none"`, no `autoplay` attribute (automated) |
| Licensing | All clips are ElevenLabs text-to-speech made with licensed stock voices on the account: agent "Palak M", buyer "Neeraj", narrator "Amit Gupta – Confident Sales Advisor". No voice was cloned. |

**Limits:**
- The voice clips were not regenerated in V3, so they are the V2 recordings.
- Hindi and Hinglish naturalness depends on the TTS model. A native-speaker review before launch is recommended.

## 4. Section-by-section visual QA

Screenshots are in `preview/v3/screenshots/desktop/` and `preview/v3/screenshots/mobile/` (01–18). Each section was captured, inspected, fixed where needed and captured again.

| # | Section | Desktop | Mobile | Issues found and fixed in V3 |
|---|---|---|---|---|
| 01 | Navigation | Pass | Pass | — (menu open and close shown in the mobile recording) |
| 02 | Hero | Pass | Pass | 15.3 s cycle (was 10.4 s). Buyer profile panel; the chart badge shows "847 total · +1 now". Floating cards now appear from 1280 px. **Mobile:** new lead-card composition (the V2 CRM was cramped and "Visit requested" wrapped). |
| 03 | Trusted By | Pass | Pass | — |
| 04 | Problem | Pass | Pass | Light-section depth (wash, dot grid, layered shadows); tilt entrance |
| 05 | Lead Funnel | Pass | Pass | **Mobile:** bars widened; toggle labels shortened so they don't wrap at 320 px; compact 2 × 2 comparison tiles |
| 06 | Performance | Pass | Pass | **Mobile:** campaign cards replace the sideways table. **Bug found in QA:** with reduced motion, table rows could stay hidden; fixed (delays are now zeroed and off-screen pausing is disabled under reduced motion). |
| 07 | How It Works | Pass | Pass | **Mobile:** import chips no longer truncate ("Property po…"). Video card copy corrected (it said 30 s). |
| 08 | AI Voice Agents | Pass | Pass | Scale entrance |
| 09 | Omnichannel | Pass | Pass | **Mobile:** vertical channel timeline that follows Rohan through all 7 steps |
| 10 | Features | Pass | Pass | Primary cards scale in. **Mobile:** secondary cards are compact (the section was 4,767 px tall, now under 4,000 px). The calling demo now uses the shared story. |
| 11 | Use Cases | Pass | Pass | Blur entrance |
| 12 | Qualification | Pass | Pass | Columns enter from the left and right |
| 13 | Integrations | Pass | Pass | Full redesign (see `CONTENT-CHANGES.md` V3-1 to V3-4): brand marks, glowing engine, sequential beams with particles, hover trace, one disclosure. **Mobile:** grid → engine → grid with a vertical flow line. |
| 14 | Mobile CRM | Pass | Pass | Right entrance |
| 15 | Comparison | Pass | Pass | Rows enter in sequence. **Mobile:** "vs Manual / vs IVR" toggle (the V2 header was clipped). |
| 16 | FAQ | Pass | Pass | — |
| 17 | Final CTA | Pass | Pass | Scale entrance |
| 18 | Footer | Pass | Pass | — |

**Regression caught during QA:** side-entering reveals (±28 px) widened the page at 320 px and failed 8 overflow tests. Fixed with `overflow-x: clip` on sections; sticky positioning is unaffected.

## 5. Motion timing (V3 guide → implementation)

| Guide | Implemented |
|---|---|
| Hover 150–250 ms | 200 ms (`motionTokens.fast`, `.card-hover`) |
| Card transitions 200–350 ms | 300 ms |
| Entrances 400–650 ms | 560 ms; 620 ms for scale and tilt |
| Product states 1.5–3 s | Qualification 1.5 s, features 2 s, How It Works 1.3–10 s |
| Workflow stages 2–4 s | Omnichannel 2.2 s per stage |
| Integration cycle 6–10 s | 9 s (6 pairs × 1.5 s) |
| Hero 12–18 s | 15.3 s (9 × 1.7 s) |
| Mobile demos 8–12 s | The hero uses the same 15.3 s story; the omnichannel timeline runs 13 s |

All loops pause off-screen. Reduced motion shows final states (automated test, plus the screenshots, which are taken with reduced motion).

## 6. Media QA

- **`product-walkthrough-v3.mp4` / `.webm`:**
  - 77.5 s, 1920 × 1080, 30 fps, H.264 + AAC / VP9 + Opus.
  - Ten scenes in this order: Introduction, Incoming Enquiry, AI Calling, Buyer Conversation, Lead Qualification, WhatsApp Follow-up, Site Visit Booking, CRM Handover, Performance Dashboard, Book a Demo.
  - Each scene lasts 6.5–8.7 s. The video ends on the CTA.
  - Silent versions are `-silent.*`. Captions are `product-walkthrough-v3.vtt`. The poster is `product-walkthrough-poster.webp`.
  - Frames were checked at 2, 20, 30, 42, 48, 70 and 76 s. In the first render, two scenes needed fixes and were re-rendered: the dashboard scale was too small, and the first WhatsApp message arrived late.
- **Narration:**
  - A new take for V3 from ElevenLabs `eleven_v4` with the licensed stock voice "Amit Gupta – Confident Sales Advisor".
  - 10 lines; the exact text is in `CONTENT-CHANGES.md`.
  - Not time-stretched (tempo 1.0).
- **Review recordings:**
  - Captured from Chrome's compositor at the real time each frame appeared on screen, then rebuilt at a constant 30 fps from those timestamps. Nothing is sped up.
  - Desktop: 192 s, covering every section with pauses and visible interactions:
    - the demo modal plays the video;
    - the funnel toggle;
    - a How It Works step;
    - voice tab, language and play;
    - use-case tabs;
    - integration hover;
    - phone tabs;
    - FAQ;
    - the full footer.
  - Mobile: 218 s, real 390 × 844 viewport at 2× (not a shrunk desktop), covering:
    - menu open and close;
    - all 18 sections;
    - integration animation;
    - voice tabs;
    - workflow steps;
    - bento grid;
    - the comparison toggle in place of table scrolling;
    - FAQ;
    - the demo modal;
    - the footer.
  - Audio is not recorded in these review videos.
- **Hero animation** (`media/videos/hero-animation.*`): re-rendered at 15.8 s to match the site's cycle.

## 7. Known limitations

- **Netlify Forms:** still shows as not enabled on the live project. The form posts to Netlify only after form detection is enabled and the site is redeployed. Locally, the form shows its success state.
- **Integrations:** every integration is planned. Brand marks are used only to show intended compatibility, with a no-endorsement disclosure.
- **Lab-only performance:** all performance figures are lab data. Measure field data after deploying.
- **Mobile comparison:** on mobile the comparison is a toggle rather than a scrolling table. The brief's "comparison table scrolling" item is covered by that toggle in the mobile recording, because the toggle replaced the clipped table.
