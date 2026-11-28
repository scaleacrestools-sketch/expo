# V2 Audit — Existing Landing Page (V1)

Audit date: 28 Nov 2026. Everything below was observed or measured in a browser (Playwright Chromium 1.63) or with Lighthouse 12, not assumed.

**Audited:** deployed site `https://bespoke-puppy-2fece0.netlify.app/` (V1), its source in this folder, and the two references `https://agenly.framer.ai/` and `https://huvo.ai/`.

Baseline artefacts: `preview/v1-baseline/` (full-page desktop 1440 px and mobile 390 px screenshots, deployed test log).

## 1. Reference analysis (now inspected live)

V1 was built without access to either reference (network blocked). Both were inspected for V2; computed styles were read from the live pages.

### Agenly (primary design reference) — measured
| Property | Agenly value | V1 value |
|---|---|---|
| Page background | `#080515` / `#010513` deep indigo-navy | `#07070A` neutral black |
| Card surface | `#0D0D1C`, `#111225` | `#101016`, `#16161E` |
| Card treatment | Inset blue glow `0 -16px 64px rgba(116,176,253,.06) inset` + top highlight | Flat border + drop shadow |
| Primary accent | Blue `#1856FF → #0946F3` gradient; violet `#8057FF`, `#4826B3` as secondary tokens | Violet `#8B5CF6` |
| Headings | Inter **400**, 80 px / 78 lh, −5 px tracking; H2 64 px; H3 32 px | Inter 600, 78 px, −3.5 px |
| Body text | `#E3E3E3`, muted `#86868E` / `#666` | `#FAFAFA`, `#A1A1AA` |
| Buttons | Pill (`450px` radius), 12×24 px, blue gradient, `0 10px 25px rgba(0,94,252,.32)` + inset top highlight | Pill, violet gradient |
| Signature details | Horizon glow at the bottom of sections, glowing orb dividers, thin grid, light-weight display type, quiet bento cards, logo row, chat cards, central integration orb | Radial glow at hero top only |
| Fonts | Inter + DM Sans | Inter only |

### HUVO (product + white sections) — measured
- Font **Satoshi** 400–700, headings 600 with −2 to −3% tracking; H1 68 px, H2 48 px.
- Ink `#0D1424`, body slate `#536075`/`#5F6E84`, hairlines `#EAF0F6`; accent violet `#4B3B8C`.
- Hero: black with flowing line art and a **light** product dashboard; stats row and logo text row directly under the fold.
- White sections are airy but deliberate: large grey statement heading, three compact problem cards, sticky step list with a dark product panel on the right.

### Decision
Keep the approved purple brand (brief §3), but move V1 onto Agenly's real foundations: indigo-navy backgrounds and surfaces, inset-glow cards, lighter display weight with tight tracking, Agenly button structure, horizon glows. Use HUVO's ink/slate palette for white sections. Details in `DESIGN-NOTES.md`.

## 2. Measured baseline

### Lighthouse (deployed V1, Netlify, two runs each — lab data, simulated throttling)
| | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Speed Index | Transfer |
|---|---|---|---|---|---|---|---|---|---|---|
| Mobile run 1 | 96 | 100 | 100 | 100 | 1.5 s | 1.6 s | 180 ms | 0 | 2.4 s | 279 KB |
| Mobile run 2 | 96 | 100 | 100 | 100 | 1.7 s | 1.9 s | 170 ms | 0 | 2.1 s | 279 KB |
| Desktop run 1 | 100 | 100 | 100 | 100 | 0.5 s | 0.5 s | 0 ms | 0 | 0.8 s | 279 KB |
| Desktop run 2 | 100 | 100 | 100 | 100 | 0.5 s | 0.5 s | 0 ms | 0 | 0.8 s | 279 KB |

No real-user (field) data exists for this site; all figures are lab measurements.

### Network (deployed V1, desktop, after full scroll)
9 requests, ~277 KB transferred: JS ~137 KB (gzip), CSS 12 KB, fonts **133 KB**. Two Inter files load: `latin` (48 KB) and `latin-ext` (85 KB). The 85 KB file is pulled in only because the page uses the **₹** sign (U+20B9 is in the latin-ext range).

### Layout (1440 × 900 and 390 × 844)
| Measure | 1440 px | 390 px |
|---|---|---|
| Hero dashboard top | 669 px | 698 px |
| Dashboard visible in first viewport | **231 px** (top strip only) | **146 px** |
| Page height | 18,803 px | 25,467 px |
| Tallest section | Features 2,445 px | Features 4,439 px |

Section heights at 1440 px: hero 1464, trusted 223, problem 1010, funnel 1155, performance 1464, how-it-works 934, voice 1159, omnichannel 1381, features 2445, use-cases 1011, qualification 1167, integrations 1401, mobile 860, compare 1190, FAQ 854, CTA 693, footer 393.

### Functional tests against the deployed site
Full Playwright suite run with `BASE_URL` set to the live URL: **39 / 39 passed** (log in `preview/v1-baseline/`). The demo form test intercepted the final POST so no enquiry was created.

## 3. Findings

Severity: **High** = broken or misleading; **Medium** = clearly weaker than the references; **Low** = polish.

### Critical / high
1. **Live form submissions fail.** Netlify reports Forms *not enabled* for this project and no registered forms. A POST to `/` returns 404. The UI correctly shows an error (no fake success), but no enquiry can be received until form detection is enabled in Netlify and the site is redeployed.
2. **Sample calls sound robotic.** V1 audio used Flite/eSpeak. Hindi is especially unnatural.
3. **Walkthrough video opens on an empty frame** (scene 1 fades in from 0% opacity at t = 0) and **ends without a call to action**. Product UI fills only about half of the frame; captions appear twice (burned in and in a caption bar).
4. **Dataset contradiction:** connect rate is 68% but the outcome chart shows "No answer 26%". These must add up (not connected = 32%).

### Medium
5. **Hero:** only 231 px of the dashboard is above the fold at 1440 × 900. Spacing between eyebrow, H1, description, CTAs, features and dashboard totals ~460 px. No "Watch Product Demo" button; the demo link is a small pill under the dashboard.
6. **Visual language differs from Agenly:** neutral black instead of indigo-navy, flat cards instead of inset-glow cards, heavy 600-weight headings, no horizon glows or section dividers.
7. **Dark/white transitions** are hard cuts with no connecting treatment.
8. **Navigation** has no active-section indicator.
9. **How It Works** auto-advances with no pause control.
10. **Voice waveform** is synthetic (sine-derived bar heights), not the actual audio; there is no qualification result per call.
11. **Omnichannel** centre card shows only the step name; no lead or project context travels with the workflow.
12. **Features bento:** the four priority features (AI Calling, Lead Qualification, Site Visit Scheduling, WhatsApp) are not consistently emphasised; WhatsApp and Site Visit are tall but leave empty space.
13. **Section rhythm:** fixed 120 px top + bottom padding plus header spacing makes sections such as Features (2,445 px) and Performance (1,464 px) long.
14. **Campaign table** (750 leads total) sits under 2,480 total calls without saying it shows a subset.
15. **13 MB of GIFs and the internal scroll preview** ship inside `public/` and therefore inside every deploy, although the page never loads them.
16. **Fonts:** 85 KB latin-ext download for a single ₹ glyph.

### Low
17. Trusted By label is 14 px muted text: low hierarchy.
18. Video modal autoplays (muted) on open; the brief asks for no unnecessary autoplay.
19. Mobile Features section is 4,439 px tall.
20. Footer is visually detached from the final CTA (hard border).

### Verified as working (no change needed)
- All 18 sections present in the approved order with the approved dark/white themes.
- Navigation anchors, dropdown, mobile menu, demo modal and validation, voice tabs/playback/seek/restart, workflow steps, use-case tabs with keyboard, funnel toggle and tooltips, chart tooltips, comparison table, FAQ keyboard accordion, video modal, legal dialogs, reduced motion: all passed on the live site.
- Story consistency across sections: buyer Rohan Mehta, 3 BHK, ₹2 Crore, self-use, 6 months, score 86, visit Sat 15 Nov 11 AM, executive Kavya Rao.
- No console errors, no broken links, no horizontal overflow at 9 widths.

## 4. Plan for V2 (in priority order)
1. Foundations: Agenly-derived tokens, card glow, type scale, button, horizon transitions; HUVO ink palette for white sections; motion tokens.
2. Hero: tighter stack, Watch Product Demo + Hear a Sample Call, dashboard above the fold, 9-step animation with incoming-call notification and qualification progress.
3. Voice: ElevenLabs Indian English / Hinglish / Hindi recordings, real waveform peaks, qualification result.
4. Dataset fixes; omnichannel lead context; How It Works pause control and animated path; bento emphasis; navbar active indicator.
5. Walkthrough video re-render (meaningful first frame, larger UI, ending CTA) in silent and voice-over versions.
6. Performance: single subset font file with ₹, review media moved out of `public/`, audio and video loaded on demand.
7. Content review (`CONTENT-CHANGES.md`), tests, visual QA and V1 vs V2 comparison.
