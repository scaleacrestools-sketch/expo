# Performance & SEO validation — homepage (16 Oct 2026)

Measured on the production build (`next build && next start`) with Lighthouse 12.8.2, headless Chromium.
Higgsfield clips are blocked inside the build sandbox, so the videos were not part of these lab runs. The hero
attaches its video only after the `load` event, so it does not affect LCP. Real-device numbers must be re-checked
on the Netlify preview.

## Lighthouse

| Run | Performance | LCP | CLS | TBT (INP proxy) | FCP | Accessibility | Best practices | SEO* |
|---|---|---|---|---|---|---|---|---|
| Mobile (Moto G Power, 4× CPU, slow 4G) — before | 76 | 3.7 s | 0 | 510 ms | 1.1 s | 97 | 96 | 69 |
| **Mobile — after** | **95–96** | **2.6–2.9 s** | **0** | **80–90 ms** | 1.1 s | 97 | 96 | 69 |
| **Desktop** | **100** | **0.6 s** | **0.001** | **0 ms** | 0.3 s | 97 | 96 | 69 |

\* The only failed SEO audit is `is-crawlable`. It fails on purpose: staging sends `X-Robots-Tag: noindex`. Production hosts index normally.

LCP element: the protected H1. A real (not simulated) trace under 4× CPU throttling paints it at **340 ms**.

## What was done for speed
- **Hero video.** Sources attach after `load`, so text and fonts win LCP. Only the current clip plus the next one are fetched. Phones get portrait cuts. There is a `preconnect` to the showreel CDN.
- **Below-the-fold video.** `LazyVideo` uses `preload="none"`. A clip downloads only within 300 px of the viewport and pauses off-screen.
- **Services.** One clip loads on desktop (the active service). On mobile, a clip loads only when its panel is open.
- **GSAP.** Scroll animation set-up moved to idle time (`requestIdleCallback`, 400 ms cap). This cut mobile TBT from 510 ms to 80 ms. Hero motion is pure CSS (transform/opacity).
- **Hero vertical text.** CSS-only seamless loop, 11 s per cycle, linear, `translate3d`, paused for reduced-motion users.
- **Images.** Logo served through `next/image` (AVIF/WebP, intrinsic size, no layout shift). Posters are wired in (`postersReady`) for when the clips are self-hosted.
- **CLS.** Every media frame has a fixed aspect ratio. Fonts load through `next/font` (self-hosted Outfit).

## Functional QA (Playwright, 42 checks, 0 failures)
- Menu, Escape, mobile menu, 8 services, accordion, studio tabs (3, exact labels, keyboard), video modal.
- Work filters, client tiles, strict section order, contact form (honest "not connected" message), no-JS visibility.
- 13 key pages return 200, and the homepage has no dead internal links.
- No horizontal overflow on mobile. No page errors.

Homepage section order verified: hero › about › clients › work › services › real-estate › creative-studio › approach › impact (case studies) › insights › contact › footer.

## SEO preservation (`scripts/seo-check-known.mjs`)
**PASS 46 · UNVERIFIED 5 · MISSING 2 · FAIL 0**. Unchanged from the previous run.
- Protected title, H1, canonicals, schema, internal links and legacy service URLs are unchanged.
- UNVERIFIED and MISSING items need the live-site crawl export (meta description, etc.). See `docs/seo-parity-report.md`.

**Not claimed:** zero SEO risk, or a completed migration. Those need a full crawl comparison against the live site before any launch.
