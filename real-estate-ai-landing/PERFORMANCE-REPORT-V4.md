# Performance Report — V4

**Measured:** 28 Nov 2026.
**Tools:** Lighthouse 12 (default simulated throttling) and Playwright Chromium 1.63.
**Before:** the deployed V3 site (https://ubiquitous-monstera-5e8d62.netlify.app/).
**After:** the V4 production build served locally (`vite build` + `vite preview`).

All figures are lab data. "Before" was measured over the real network and "after" on localhost, so the comparison slightly favours V4 on network timing. Re-measure after deploying V4.

## Targets vs results

| Metric | Target | Before (V3 live) | After (V4) | Result |
|---|---|---|---|---|
| Lighthouse performance, desktop | ≥ 95 | 100, 100 | 100, 99 | **Met** |
| Lighthouse performance, mobile | ≥ 90 | 95, 98 | 92, 94, 97 | **Met** |
| Accessibility / Best practices / SEO | — | 100 / 100 / 100 | 100 / 100 / 100 | — |
| LCP, mobile | ≤ 2.5 s | 1.8 s, 1.9 s | 2.6 s, 2.1 s, 2.1 s | **Met in 2 of 3 runs** |
| LCP, desktop | ≤ 2.5 s | 0.4 s | 0.4 s, 0.5 s | **Met** |
| CLS | ≤ 0.1 | 0 / 0.001 | 0 (mobile) / 0.001 (desktop) | **Met** |
| INP (lab proxy, 4× CPU throttle) | ≤ 200 ms | 168 ms median (V3 build) | 184 ms median | **Met** |
| TBT, mobile | — | 230 ms, 110 ms | 210 ms, 230 ms, 150 ms | — |
| FCP, mobile | — | 1.5 s, 1.6 s | 1.9 s, 1.7 s, 1.7 s | — |
| Bytes transferred on load | — | 217 KB | 231 KB | +14 KB |

### What the numbers say

- Every target is met, but mobile is a little slower than V3: the score is 92–97 against 95–98, and one of three runs had an LCP of 2.6 s, just over the 2.5 s target. The other two runs were 2.1 s.
- The cause is the richer hero. The V3 mobile hero was one card; the V4 mobile dashboard has four metric cards, a chart and a lead card, which is more to render before the page settles.
- Desktop is unchanged at 99–100.

### Interaction latency (INP proxy)

Lighthouse cannot measure INP, so it was measured with an Event Timing observer on an emulated Pixel 7. Each run taps the menu, voice tab, language and play, a use-case tab, an FAQ, the funnel toggle, a phone tab, the date range, the comparison toggle, a workflow step and the demo modal, then takes the worst interaction.

| | Run 1 | 2 | 3 | 4 | 5 | Median |
|---|---|---|---|---|---|---|
| V4, 4× CPU throttle | 304 | 184 | 168 | 184 | 168 | **184 ms** |
| V4, no throttle (measured before the last optimisation below) | 112 | 112 | 96 | — | — | 112 ms |

Run 1 is an outlier on a control the script could not name; the other four runs are under 200 ms. Before the last optimisation the throttled median was 200 ms, with the date-range toggle the slowest control at 248–264 ms.

## Optimisations made in V4

| Change | Effect |
|---|---|
| Only one hero dashboard renders per device (desktop or mobile), chosen at first render with `matchMedia` | Mobile TBT fell from 280–310 ms to 150–230 ms. Before this, both compositions rendered and one was hidden with CSS. |
| The date-range toggle updates its pressed state at once and defers the metric and chart re-render (`useDeferredValue`) | That tap fell from 248–264 ms to 72–176 ms under throttle. |
| Chart axis labels are HTML instead of scaled SVG text | No performance cost; labels are now crisp at every width. |
| Product colours come from CSS variables in one `.product` scope | No extra JavaScript for theming; CSS grew from 85 KB to 94 KB before compression. |
| Walkthrough video still loads only when the modal opens and play is pressed | 0 bytes of video on page load. |

Unchanged from V3: below-the-fold sections load when the browser is idle, loops pause off-screen, voice clips load on play, and fonts are two self-hosted subsets.

## Bundle and media

| Asset | Size (before compression) |
|---|---|
| Main JS (`index`) | 172 KB |
| Below-the-fold JS (loaded when idle) | 159 KB |
| React | 142 KB |
| Motion | 53 KB |
| CSS | 94 KB |
| `dist/` total | 15 MB, of which about 13 MB is the four on-demand walkthrough files |

- **In the site bundle, loaded on demand:** `product-walkthrough-v4.mp4` (3.9 MB), `.webm` (3.6 MB), and the two silent versions (3.0 MB and 2.9 MB); the poster (34 KB WebP); the 12 voice clips (860 KB in total).
- **Not in the site bundle:** `landing-page-desktop-preview-v4.mp4` (17 MB), `landing-page-mobile-preview-v4.mp4` (27 MB), the hero animation video and all GIFs. They live in `preview/` and `media/`.
- No GIF is used on the live site.

## Remaining bottlenecks

1. **Mobile LCP headroom is thin.** The lab range is 2.1–2.6 s on localhost. A CDN adds latency, so the live figure may sit at or just above 2.5 s on slow phones. The LCP element is the hero description paragraph, which already renders without waiting for animation. The next step, if field data shows a problem, is to inline the critical CSS for the first screen.
2. **Main-thread work on mobile** (TBT 150–230 ms) comes mostly from React rendering the hero and starting the story loop. Delaying the story loop until the first idle period would lower it further.
3. **No field data exists yet.** INP in particular should be confirmed with real-user monitoring after launch.
