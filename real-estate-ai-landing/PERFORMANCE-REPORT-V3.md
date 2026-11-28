# Performance Report — V3

**Measured:** 28 Nov 2026, on the V3 production build (`vite build` + `vite preview`, localhost).

**Tools:**
- Lighthouse 12, default simulated throttling: Moto G-class mobile, or the desktop preset.
- Playwright Chromium 1.63.

All figures are lab data. There is no field data from real visitors yet, so re-measure after deploying to Netlify (see the end of this report).

## Targets vs results

| Metric | Target | Run 1 | Run 2 | Result |
|---|---|---|---|---|
| Lighthouse performance, desktop | ≥ 95 | 100 | 100 | **Met** |
| Lighthouse performance, mobile | ≥ 90 | 96 | 98 | **Met** |
| Accessibility / Best practices / SEO (both devices) | — | 100 / 100 / 100 | 100 / 100 / 100 | — |
| LCP, mobile | ≤ 2.5 s | 1.9 s | 2.1 s | **Met** |
| LCP, desktop | ≤ 2.5 s | 0.4 s | 0.4 s | **Met** |
| CLS | ≤ 0.1 | 0 (mobile) / 0.001 (desktop) | 0 / 0.001 | **Met** |
| INP | ≤ 200 ms | see below | | **Met (lab proxy)** |
| TBT, mobile | — | 200 ms | 80 ms | — |
| FCP, mobile | — | 1.6 s | 1.7 s | — |
| Speed Index, mobile | — | 1.6 s | 1.7 s | — |
| Bytes transferred on load | — | 228 KB | 228 KB | V2 was 220 KB |

### Interaction latency (INP proxy)

Lighthouse cannot measure INP, so it was measured directly with an Event Timing observer on an emulated Pixel 7. Each run taps the controls listed below, then takes the worst interaction.

Controls tapped:
- menu open/close
- voice tab, language and play/pause
- use-case tab
- FAQ
- funnel toggle
- phone screen tab
- date range
- comparison toggle
- How It Works step
- demo modal open/close

| | Run 1 | 2 | 3 | 4 | 5 | Median | V2 median |
|---|---|---|---|---|---|---|---|
| 4× CPU throttle | 192 | 168 | 168 | 152 | 176 | **168 ms** | 224 ms |
| No throttle | 120 | 120 | 96 | — | — | **120 ms** | 112 ms |

Under throttling V3 is faster than V2; the run-to-run spread on this shared machine is about ±20 ms, so treat the gain as "no regression" rather than a measured improvement. Every run is under 200 ms.

## What V3 added, and its cost

| Change | Cost | How it is kept cheap |
|---|---|---|
| Integration hub with SVG beams and particles | a few KB of JS (estimated) | SVG `animateMotion` runs on the compositor. The particle group is unmounted when the section is off-screen. One ResizeObserver per hub. |
| Simple Icons brand paths (5 marks) | ~2.5 KB | Inline path strings only; the 3,000-icon package is not bundled. |
| Mobile hero, comparison, omnichannel, campaign cards | a few KB (estimated) | Pure markup and CSS, no new libraries. The desktop compositions are still code-split below the fold. |
| Per-section entrance variants | 0 KB | The Motion library was already loaded for Reveal. |
| Light-section depth layers | 0 requests | Pure CSS gradients on a `::after` pseudo-element; no images. |

No new animation library was added. Motion for React, Lucide and Simple Icons path data remain the only motion and icon dependencies.

## Media and bundle

- **Walkthrough video:**
  - Four files in `dist/assets/videos/`:
    - `product-walkthrough-v3.mp4` (3.6 MB)
    - `product-walkthrough-v3.webm` (3.2 MB)
    - `product-walkthrough-v3-silent.mp4` (2.7 MB)
    - `product-walkthrough-v3-silent.webm` (2.5 MB)
  - They use `preload="none"`, mount only when the modal opens, and never autoplay. A visitor downloads one file only after pressing play.
  - The poster is a 26 KB WebP.
- **Voice samples:** 860 KB of audio across the 12 clips. They use `preload="none"` and are fetched only on play.
- **Not in the site bundle** (these live in `preview/` or `media/` and in `product-media-assets-v3.zip`):
  - `landing-page-desktop-preview-v3.mp4` (16 MB)
  - `landing-page-mobile-preview-v3.mp4` (26 MB)
  - `hero-animation.*`
  - all GIFs
- **`dist/` total:** 14 MB, of which 12 MB is the four on-demand walkthrough files. JS is 162 KB (main) + 161 KB (below-fold chunk, loaded when idle) + 142 KB (React) + 53 KB (Motion), before gzip. CSS is 85 KB.

## Notes on the misses and risks

- No target was missed in the lab.
- Mobile TBT varied from 80 to 200 ms between runs on this shared container. The performance score stayed at 96–98.
- **What to check after deploying to Netlify:**
  - Re-run Lighthouse on the live URL.
  - Watch real-user INP in a RUM tool. CDN latency will add roughly 100–300 ms to LCP compared with localhost.
