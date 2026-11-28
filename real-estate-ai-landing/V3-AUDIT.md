# V3 Audit — before changes

Date: 28 Nov 2026. This audit covers the two references and the V2 build. It was done by viewing each page in Playwright Chromium 1.63 at desktop (1440 × 900) and mobile (iPhone 13, 390 × 844) and capturing screenshots, not from memory. Contact sheets of the reference and V2 captures are in `preview/v3-audit/`.

## 1. Feedback being addressed

- V2's visual quality was not good enough.
- The 16.6-second V2 preview was too short to judge the site.
- The integration section used letter monograms and a yellow "PLANNED" badge on every card.
- Mobile layouts were shrunken desktop layouts.
- Every section entered with the same fade-up.
- The white sections looked flat.

## 2. Reference review

### Agenly (agenly.framer.ai), visual reference

Values below were measured with computed styles.

| Aspect | Observation | How V3 uses it |
|---|---|---|
| Palette | Background #080515; cards #0D0D1C and #111225; violet #8057FF and deep #4826B3; blue #1856FF; text #E3E3E3 and #B1B1C1 | Already adopted in V2 tokens. Kept. |
| Card depth | `inset 0 -16px 64px rgba(116,176,253,.06)` plus a 3 px inner top highlight. Cards read as lit from below. | Used on dark cards and on the new integration engine tile. |
| Horizon glows | Wide blue/violet radial glows at section feet; small "orb" dividers between sections | Kept. V3 adds a radial engine glow in Integrations. |
| Icon rows | Tool icons sit in white rounded tiles around a glowing centre tile | Integration tiles are now white rounded tiles with true brand marks (or a neutral icon) around a glowing AI engine. |
| Mobile | Single column, compositions re-stacked rather than scaled; large tap targets | V3 builds mobile-specific compositions (see §4). |
| Motion | Entrances are short and varied (slide, blur, scale). Nothing loops aggressively. | V3 adds per-section entrance variants and slower, readable product loops. |

### HUVO (huvo.ai), product reference

| Aspect | Observation | How V3 uses it |
|---|---|---|
| Light sections | Satoshi type; ink #0D1424; hairlines #EAF0F6; very soft tinted gradients behind light blocks | Light sections now have a soft violet wash, a fading dot grid, and layered card shadows. |
| Integrations | Compact rows: logo, name, one-line detail. Curves converge on a central wordmark, and one connection is highlighted at a time. | Rebuilt the same way: compact rows, pixel-accurate SVG beams, sequential pairs with travelling particles. |
| Hero | Light dashboard with floating status cards | Floating cards kept, now shown from 1280 px (V2 showed them only from 1400 px). |
| Comparison | Highlighted "us" column; rows are easy to scan on mobile | Desktop: highlighted column with rows that enter one by one. Mobile: a toggle between "vs Manual" and "vs IVR" with two columns per row. |
| FAQ | Two-column layout | Kept (introduced in V2). |

Nothing was copied from either site: no code, recordings, customer logos or testimonials.

## 3. V2 findings, desktop (1440 × 900)

| # | Section | Finding | Severity |
|---|---|---|---|
| 02 | Hero | 9 phases at 1.15 s each gave a 10.4 s cycle, too fast to read. There was no buyer profile, and the chart update was nearly invisible (+1 on one tile). Floating cards were hidden below 1400 px. | High |
| 04, 05, 07, 10, 12, 14, 15 | White sections | Flat white or #F6F7FB with thin borders; cards almost disappear on the alt background. | Medium |
| All | Motion | Every block used the same 16 px fade-up. Loops ran at 0.9–1.5 s per state, below the 1.5–3 s readability guide. | Medium |
| 13 | Integrations | Letter monograms instead of brand marks, a "PLANNED" badge on every card, wide cards, a weak centre and no data flow. | High |
| 15 | Comparison | Static table with no entrance. | Low |

## 4. V2 findings, mobile (390 × 844)

| # | Section | Finding | Severity |
|---|---|---|---|
| 02 | Hero | The full desktop CRM was squeezed in: the status pill "Visit requested" wrapped, the table was cramped, and the composition was about 1,850 px tall. | High |
| 05 | Funnel | The narrowest bar (85) was tiny. The toggle labels wrapped onto two lines. The comparison list was four tall cards. | Medium |
| 06 | Performance | Chart axis labels were small but legible. | Low |
| 07 | How It Works | The import visual truncated labels ("Property po…", "Website for…", "API & webh…"). | High |
| 09 | Omnichannel | A plain 2-column chip grid with no sense of flow. | Medium |
| 10 | Features | The section was 4,767 px tall: every card carried a full visual. | Medium |
| 13 | Integrations | Monogram grid with a PLANNED badge on every tile. | High |
| 15 | Comparison | The highlighted column header was clipped ("Our Planned A…"); the table needed horizontal scroll to compare. | High |
| 16–18 | FAQ, CTA, Footer | No issues. | — |

## 5. V2 media review

- **Preview video (16.6 s):** scrolled the whole page in under 17 seconds, too fast to read anything. V3 replaces it with real-time recordings of 90–150 s or more, with no speed-up, pauses on each section, and visible interactions.
- **Walkthrough video (34 s, 9 scenes):** scenes lasted 3.2–4.6 s with no introduction. V3 is a new 10-scene, 78 s cut with a new narration take; every scene lasts 6.5–8.7 s.

## 6. Baseline numbers (V2 production build)

- **Lighthouse:**
  - Mobile: 96–97 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.1 s; CLS 0; TBT 160 ms.
  - Desktop: 100 / 100 / 100 / 100.
- **INP proxy:** 224 ms median under 4× CPU throttle and 112 ms without throttle.
- **Size:** 220 KB transferred on load; `dist/` was 8.8 MB.
- **Tests:** 44 / 44 Playwright tests passing.

V3 must not regress these figures. Results are in `PERFORMANCE-REPORT-V3.md`.
