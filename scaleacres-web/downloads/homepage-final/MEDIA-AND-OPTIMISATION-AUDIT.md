# ScaleAcres homepage: media and optimisation audit

Staging preview only. It is `noindex` via `X-Robots-Tag: noindex, nofollow` (`_headers`) and `robots.txt: Disallow: /`. Nothing has been published to production, and live WordPress, DNS and hosting are untouched.

## Section order (verified in the browser)

1. Hero
2. Who We Are
3. Our Services (8)
4. Website Design
5. Real Estate Videos (Ad / Social / AI)
6. We Don't Create Brands. We Create Market Leaders.
7. Featured Work (6)
8. Clients
9. Testimonials
10. Contact CTA
11. Footer

## Media relevance audit

| Section | Media | Source | Status |
|---|---|---|---|
| Hero film | Branding (SID Realtech), websites (SID, Subata, Imperial Sky), social creatives (JBBR, SID, Intech, TRG), Meta/Google/SEO results | scaleacres.com portfolio | Genuine |
| Hero film | Opening tower and closing edit-suite scenes | ScaleAcres AI concept film stills | Labelled on screen as "ScaleAcres concept film" |
| Who We Are | Portfolio slides, 3 video covers, Google Ads result | scaleacres.com, ScaleAcres YouTube | Genuine |
| Services | Each card shows that service's own work: website, SEO result, Meta result, brand guideline, social creatives, ad-film covers, ecommerce sites, Finsckool platform | scaleacres.com, ScaleAcres YouTube | Genuine, captioned |
| Website Design | 6 full-page site captures | scaleacres.com | Genuine |
| Real Estate Videos | 3 featured (Ad, Social, AI) plus rails: Ad 8, Social 8, AI 7 | ScaleAcres YouTube | Genuine. AI videos sit under the "AI Videos" tab, with the note "AI videos are labelled as AI" |
| Market Leaders | 7 branding pieces (SID, TRG, Nirvana County) | scaleacres.com | Genuine |
| Featured Work | SID, Subata, JBBR, Intech, TRG, Finsckool | scaleacres.com | Genuine |
| Clients | Existing client logo sprite | Already published on scaleacres.com | Genuine, unchanged |
| Testimonials | 4 published video testimonials | scaleacres.com (Wistia CDN) | Genuine, unchanged |
| Contact CTA | Brand-colour gradient, no imagery | n/a | n/a |

No logos, testimonials, projects or stats were invented. No concept footage is presented as client work.

## Unavailable or limited media (reported, not retried)

- **Blocked hosts.** This cloud environment's network policy blocks `scaleacres.com`, `i.ytimg.com` and the media CloudFront hosts (HTTP 403 from the proxy). All 57 genuine stills were exported once through the sandbox, checked by MD5, and bundled in `public/images/home/work/`.
- **Hero live footage.** The concept-film video clips couldn't be moved out of the sandbox, so the two concept scenes in the hero film are slow push-ins on stills instead of moving footage.
- **Low-resolution sources.** Portfolio slides are about 924×522 and YouTube covers are 540×960 or 405×720. That is fine at their display sizes, but the source files on scaleacres.com are the limit.
- **Shorts left out.** Social short `qEaDnpK8Eko` (cover not exported) and `XfgdunDbBzE` (no usable cover) are omitted from the rails.
- **Remote media loaded only on click.** YouTube players (youtube-nocookie, created only while the dialog is open) and testimonial MP4s (Wistia) load only when a visitor presses Play. On page load there are no third-party image or video requests (QA-verified).

## Optimisation

- **Hero film.**
  - Desktop: 1920×1080 at 24 fps, 16.3 s seamless loop, no audio. VP9 WebM is 0.90 MB; the H.264 MP4 fallback is 1.49 MB.
  - Mobile: 720×1280. WebM is 0.72 MB; MP4 is 0.93 MB.
  - JPEG posters are included.
  - Sources attach after `window.load`, so the headline wins LCP. The film pauses once the hero scrolls out of view.
  - Under reduced motion, only the poster is shown.
- **Images.** Every image below the hero is `loading="lazy"` with `decoding="async"` and explicit `width`/`height`. The bundled work images total 6.2 MB across 57 files, fetched on demand.
- **Measured.** Local throttled run: 10 Mbps and 40 ms latency, plus 4× CPU slowdown on mobile.

  | Device | LCP | CLS | FCP |
  |---|---|---|---|
  | Desktop | 0.95 s | 0.000 | 0.95 s |
  | Mobile | 0.76 s | 0.000 | 0.76 s |

- **Layout.** No horizontal overflow at 1440 or 390 px.
- **Accessibility.** One H1. The keyboard reaches every section. Dialogs close with Esc and remove their iframe. Under reduced motion: no intro mask, no sticky stage, and no video playback.
- **QA.** 69/69 automated checks pass on the local build and again on the extracted Netlify ZIP. The source ZIP builds cleanly from a fresh extract (`npm ci && npm run build:static-preview`).

## Files

| File | What it is |
|---|---|
| `scaleacres-full-homepage-desktop-preview.mp4` | 1440×900, 80 s real-browser recording |
| `scaleacres-full-homepage-mobile-preview.mp4` | 390×844, 75 s real-browser recording |
| `scaleacres-full-homepage-desktop.jpg` | Full-page screenshot, 1440×21734 |
| `scaleacres-full-homepage-mobile.jpg` | Full-page screenshot, 390 px at 2×, 780×49870 |
| `scaleacres-homepage-netlify-preview.zip` | Drag-and-drop to Netlify; `index.html` sits at the zip root |
| `scaleacres-homepage-source.zip` | `scaleacres-web` source at commit `b0a010fa` |

The recordings use full motion. The full-page screenshots use reduced motion so that sticky and pinned sections lay out flat. Video dialogs were not opened in the recordings because YouTube is blocked in this environment. Dialog behaviour is covered by the QA checks instead.
