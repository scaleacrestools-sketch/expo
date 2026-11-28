# QA Report

Date: 28 Nov 2026 · Build: `npm run build` (Vite 6, production) served by `vite preview` · Browser: Playwright Chromium 1.63 (headless).

## Summary

| Check | Result |
|---|---|
| TypeScript (`tsc -b`) | Pass, 0 errors |
| Production build | Pass |
| Playwright tests (39) | **39 passed, 0 failed**, three consecutive runs |
| Console / JS / network errors during full scroll | None |
| Horizontal overflow at 1920, 1440, 1280, 1024, 768, 430, 390, 375, 320 px | None |
| Lighthouse mobile | Performance 95 · Accessibility 100 · Best Practices 100 · SEO 100 |
| Lighthouse desktop | Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100 |

Full test log: `preview/test-results.txt`. Screenshots: `preview/screenshots/`.

## Important limitation: reference sites

Both reference sites (`agenly.framer.ai`, `huvo.ai`) were **unreachable** from the build environment (network policy refused the connection). Section-by-section comparison against the live references was therefore not possible. Design decisions follow an approximation of the Agenly style documented in `DESIGN-NOTES.md`. A side-by-side check against the live sites is recommended, and the colour tokens should be confirmed with DevTools.

## Section-by-section visual review (1440 px and 390 px)

Each section was rendered, screenshotted and inspected. Issues found are listed with the fix applied.

| # | Section | Theme | Result | Issues found and fixed |
|---|---|---|---|---|
| 01 | Navigation | Dark | Pass | Sticky, blurs on scroll, dropdown and mobile menu verified. |
| 02 | Hero | Dark | Pass | Floating cards covered sidebar items: moved outward. Video button overlapped the mobile story strip: now in normal flow on mobile. Dimmed activity rows failed contrast: now skeleton bars. |
| 03 | Trusted By | Dark | Pass | Marquee pauses on hover, static wrap under reduced motion. |
| 04 | The Problem | White | Pass | Illustrations overflowed their 230 px frame: frame raised to 252 px, rows tightened. |
| 05 | Lead Funnel | White | Pass | Stage labels sat inside narrow bars and became unreadable on mobile: labels moved above bars. |
| 06 | Performance | Dark | Pass | Line chart left half the panel empty: chart height increased. |
| 07 | How It Works | White | Pass | Closed-accordion state on mobile could break desktop index: guarded. |
| 08 | AI Voice Agents | Dark | Pass | Native range slider looked heavy: custom styled. Arrow keys moved from the selected tab, not the focused one: fixed. |
| 09 | Omnichannel | Dark | Pass | Ring diagram replaced by hub + grid on mobile. |
| 10 | Product Features | White | Pass | Tall bento cards showed empty space: visuals now vertically centred. |
| 11 | Use Cases | Dark | Pass | Same keyboard fix as voice tabs. |
| 12 | Qualification | White | Pass | — |
| 13 | Integrations | Dark | Pass | All items marked Planned with disclaimer. |
| 14 | Mobile CRM | White | Pass | Dashboard screen content ran under the tab bar; profile name wrapped: content trimmed. |
| 15 | Comparison | White | Pass | Sticky feature column and horizontal scroll verified at 390 px. |
| 16 | FAQ | Dark | Pass | — |
| 17 | Final CTA | Dark | Pass | — |
| 18 | Footer | Dark | Pass | Single long column on mobile: now two columns. |

### Cross-cutting bug found and fixed
Tailwind does not generate opacity variants for colours written as `var(...)` (for example `bg-[var(--brand-primary)]/20`). Every translucent brand tint and border on the page was silently missing. Brand colours are now exposed as RGB channels (`bg-brand/20`), and every usage was converted.

## Functional tests (Playwright)

All of these were executed and passed:

- SEO basics: title, description, canonical, OG image, exactly one H1.
- All 18 sections present, in order, with the specified dark/white theme; dark share above 50%.
- Every in-page anchor resolves to an element; nav links scroll to their sections.
- Solutions dropdown: opens, lists 6 items, closes on Escape.
- Mobile menu: opens, navigates, closes.
- Demo modal opens from nav, hero and final CTA; Escape closes; required-field, email and phone validation; consent required; spam time-trap; local-preview state shown on localhost.
- Voice agents: 4 tabs by click and keyboard, language switch to Hinglish transcript, audio loads and plays, time display advances, active transcript line highlights, pause, seek with progress bar, restart.
- "Hear a Sample Call" scrolls to the voice section.
- How It Works: all 5 steps selectable, arrow-key navigation.
- Use-case tabs: click, arrow keys, footer deep links select the right tab.
- Funnel workflow toggle and stage tooltip; analytics date-range toggle; chart hover tooltip; campaign table rows.
- Feature calendar demo picks a date; 10 feature cards; 12 integration cards with hover tooltip; 9 comparison rows; mobile screen switch; "Coming Soon" label.
- Omnichannel node tooltip.
- FAQ accordion by mouse and keyboard.
- Video modal: walkthrough plays, duration over 25 s, caption track present, Escape closes.
- Privacy dialog opens from footer.
- Reduced motion: hero shows the completed state and no infinite animations run.
- No horizontal overflow at all nine widths; hero CTAs fully on screen; mobile touch targets at least 40 px.

### Bugs found by tests and fixed
- Early clicks on "Hear a Sample Call" or nav anchors before the deferred sections mounted did nothing. Both now mount the sections and scroll once they exist.

## Performance

Measured with Lighthouse 12 against the production build on localhost (simulated throttling for mobile).

| | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile (before optimisation) | 82 | 97 | 100 | 100 | 2.6 s | 2.8 s | 410 ms | 0 |
| Mobile (final) | 95 | 100 | 100 | 100 | 2.3 s | 2.4 s | 0 ms | 0 |
| Desktop (final) | 100 | 100 | 100 | 100 | 0.5 s | 0.5 s | 0 ms | 0 |

Optimisations applied: below-the-fold sections split into a separate chunk rendered on idle; hero heading no longer fades from transparent (it was delaying LCP); render surface for video capture is code-split and never loads for visitors; off-screen loops paused.

Localhost scores exclude real network latency and CDN behaviour; re-measure on the deployed Netlify URL.

## Media verification

| Asset | Verified |
|---|---|
| `product-walkthrough.mp4` / `.webm` | 1920×1080, 30.0 s, H.264 / VP9, silent, burned-in captions + `product-walkthrough.vtt` |
| `hero-animation.mp4` / `.webm` | 1920×1080, 14.0 s |
| `video-poster.webp` | 1280 px |
| GIFs (7) | 7–12 s each, 0.3–1.7 MB (scroll preview 5.7 MB), loop |
| `preview/landing-page-preview.mp4` | 1440×900, 17 s scroll through the real site |
| Sample audio (8 MP3) | 10–18 s each, English + Hinglish |
| SVG library (16 + favicon) | All parse as valid XML |

## Remaining limitations

1. **Reference sites not inspected** (network blocked). Colours and typography are approximations; see `DESIGN-NOTES.md`.
2. **Voice quality:** sample audio uses open-source TTS (Flite, eSpeak NG). It is intelligible but clearly synthetic, and the Hindi voice is robotic. Replace with a licensed neural TTS before showing customers.
3. **Netlify Forms not tested end to end**: submission to a live Netlify site cannot be exercised locally. The local-preview path and validation are tested; confirm on the first deploy that the `demo-request` form is detected and a test enquiry arrives.
4. **Placeholders:** product name, company name, site URL, contact details and social links are placeholders in `src/config/brand.ts`. Privacy and Terms are short placeholder dialogs, not legal documents.
5. **Integration logos:** shown as neutral monograms, not official marks. All marked Planned.
6. **Browsers:** automated testing covered Chromium only. Safari and Firefox were not tested in this environment.
7. GIFs live in `public/assets/gifs` as requested, so they ship with the deploy (about 13 MB) even though the page itself does not load them.
