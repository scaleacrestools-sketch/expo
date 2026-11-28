# V4 Audit — the deployed V3 site, before changes

**Date:** 28 Nov 2026.
**Audited:** https://ubiquitous-monstera-5e8d62.netlify.app/ (confirmed to be the V3 build: same bundle hash as the V3 `dist/`).
**Method:** the live site and both references were opened in Playwright Chromium 1.63 at 1440 × 900 and at 390 × 844 (iPhone 13 emulation). All 18 sections were captured on desktop and mobile and inspected one by one. Lighthouse 12 was run against the live URL.

## 1. Headline finding

Every product interface inside a dark section was itself dark. The hero dashboard, the analytics dashboard, the voice player and transcript, the omnichannel cards, the four use-case dashboards and the integration cards all used near-black surfaces with white text. Three more dark call panels sat inside white sections (How It Works step 3, Instant AI Calling, Call Intelligence). The product therefore looked like part of the marketing background rather than a separate piece of software, and different sections looked like different products.

V4 keeps the dark marketing theme and moves every product interface to one white CRM design system.

## 2. Reference review

| Reference | What was observed | Use in V4 |
|---|---|---|
| HUVO (huvo.ai) | Light dashboards: white cards on an off-white app background, grey hairline borders, dark ink text, one accent colour, soft shadows; floating white status cards around the hero dashboard | The model for the product UI tokens and the floating notification cards |
| Agenly (agenly.framer.ai) | Dark stage (#080515), violet glow behind the hero product, inset-lit cards, orb dividers, restrained motion | Kept for the marketing layer. A violet glow now sits behind the white hero dashboard so it reads as the focal point. |

Nothing was copied from either site: no code, assets, recordings, logos or text.

## 3. Section-by-section observations (V3 live)

| # | Section | Desktop | Mobile | Planned V4 change |
|---|---|---|---|---|
| 01 | Navigation | Works; dropdown, anchors and active state fine | Menu opens and closes; 44 px targets | No structural change; re-test |
| 02 | Hero | Dark dashboard on dark background, low contrast; dashboard starts at about 555 px of a 900 px viewport; chart axis text about 5 px tall; floating cards only above 1400 px; no campaign or date selectors | Dark lead card; no metrics or chart | White command centre with sidebar, header, selectors, 4 metrics, chart, lead table, call activity, qualification, calendar and activity; tighter spacing; dedicated mobile dashboard with 2 × 2 metrics and a chart |
| 03 | Trusted By | Marquee smooth at 48 s; categories only | Static list under reduced motion | Keep |
| 04 | Problem | Visuals small and faint inside 252 px areas; black "11:42 PM" chip | Same | Larger white product visuals: notification, lead timeline, database table |
| 05 | Lead Funnel | Readable | Vertical stages fine | Keep |
| 06 | Performance | Dark dashboard; six metrics in one cramped row; chart axis text tiny | Dark; "Export" pill wraps | White dashboard with sidebar, 3 × 2 metrics, crisp axis labels |
| 07 | How It Works | Step 3 uses a black call panel | Same | White call panel; all five demos on the product tokens |
| 08 | AI Voice Agents | Dark player and transcript; white play button | Dark; "Outbound call" truncated | White calling interface and transcript; violet play button |
| 09 | Omnichannel | Dark chips and centre card | Dark timeline | White channel cards and centre card |
| 10 | Features | Two black call cards; Multilingual card mostly empty | Six features have no illustration | White call cards; fuller Multilingual demo; all ten illustrations shown on mobile |
| 11 | Use Cases | Four dark dashboards | Dark | White dashboards |
| 12 | Qualification | Buyer answers in black bubbles | Same | Light bubbles; four exchanges visible |
| 13 | Integrations | Dark cards with white icon tiles | Dark tiles | Compact white cards with the same brand marks |
| 14 | Mobile CRM | Light phone screens; names truncated ("Rohan …"); black button inside the app | One phone, readable | Shorter names; violet in-app button |
| 15 | Comparison | Readable; product column highlighted | Toggle works | Keep |
| 16 | FAQ | Fine | Fine | Keep |
| 17 | Final CTA | Fine | Fine | Keep |
| 18 | Footer | Fine | Fine | Keep |

## 4. Animations reviewed

| Animation | Observation | V4 |
|---|---|---|
| Hero story | 15.3 s cycle; state changes easy to miss on dark surfaces | 17.1 s cycle; row flash, metric highlight and status pops on white |
| Problem cards | States changed every 1.1–1.8 s, faster than the 2–3 s guide | 1.8–2.4 s |
| Reveal entrances | Varied per section in V3 | Keep |
| Integration beams, omnichannel particles | Work; pause off-screen | Keep; particle colours adjusted for white cards |

## 5. Interactive components

The live site serves the same bundle as the V3 build, whose 52-test Playwright suite passed (see `QA-REPORT-V3.md`). That suite was not re-run against the live URL for this audit; the live site was inspected through the section captures only. One known live-only issue remains: Netlify Forms shows as not enabled on the project, so a real submission cannot succeed until form detection is enabled and the site is redeployed.

## 6. Baseline performance (live V3, Lighthouse 12, two runs)

| | Performance | Accessibility / Best practices / SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|---|
| Mobile run 1 | 95 | 100 / 100 / 100 | 1.5 s | 1.8 s | 230 ms | 0 | 217 KB |
| Mobile run 2 | 98 | 100 / 100 / 100 | 1.6 s | 1.9 s | 110 ms | 0 | 217 KB |
| Desktop run 1 | 100 | 100 / 100 / 100 | 0.4 s | 0.4 s | 0 ms | 0.001 | 217 KB |
| Desktop run 2 | 100 | 100 / 100 / 100 | 0.4 s | 0.4 s | 0 ms | 0.001 | 217 KB |

V4 results are in `PERFORMANCE-REPORT-V4.md`.
