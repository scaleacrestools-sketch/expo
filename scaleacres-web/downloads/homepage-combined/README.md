# ScaleAcres homepage: combined draft (staging review)

This is the combined draft, rebuilt from the two original homepage designs in the order the draft shows. It is a noindex staging preview and must not be published to production.

## Files

| File | What it is |
| --- | --- |
| `homepage-desktop-walkthrough.mp4` | Desktop recording at 1440 × 900, about 100 s, covering the hero through to the footer. It includes the menu, hovers, the pinned strip, video tabs and the branding preview. |
| `homepage-mobile-walkthrough.mp4` | Mobile recording at 390 × 844. |
| `homepage-desktop-fullpage.jpg` / `homepage-mobile-fullpage.jpg` | Full-page screenshots. They were taken with reduced motion, so every reveal shows as complete and the Manifesto collage is hidden; the recordings show the motion. |
| `scaleacres-homepage-netlify-preview.zip` | A static export with `index.html` at the root. Drag it into Netlify Drop. `_headers` sets `X-Robots-Tag: noindex`. |
| `scaleacres-homepage-source.zip` | Next.js source without `downloads/` and `dist/`. Run `npm ci && npm run build:static-preview`. |

## Latest corrections

- **Hero.** The hero now uses the reference reel from spectacular-florentine-9c90fa.netlify.app: five ScaleAcres concept films (a blue-hour tower, an identity table, a web studio, a production suite and a light sweep).
  - The films play in turn with a 1.4 s crossfade, under a Brand Black grade, with the headline and CTAs laid over them.
  - The files are served locally (`public/videos/nd/hero`). Each film has a 1600 px landscape cut and a 720 × 1280 portrait cut for phones, in both H.264 MP4 and VP9 WebM, about 7 MB in total.
  - Only the current and next films load. Playback starts after page load and pauses when the hero is off-screen.
  - The poster image stays visible for reduced-motion and Save-Data visitors.
  - The credit line labels the films as AI-generated concept films.
- **Logo grid removed.** The "Brands that trust our work" logo grid has been taken out of True stories.
- **Service visuals.** Every service visual has been replaced with one composed 16:9 image, built only from genuine ScaleAcres work:
  - Website design: the SID Realtech site on a laptop, the Imperial Sky Realty browser and the Subata Realty mobile site.
  - SEO: Search Console growth charts and first-page rankings.
  - Performance: Google search ads for DLF Privana, M3M, Godrej and Signature Global, Meta Ads results and a TRG creative.
  - Branding: the SID guideline, the Ellington 86 brochure and hoarding, and the launch poster.
  - Social: reels and post creatives for JBBR Group and Intech Developers.
  - Video: frames from ScaleAcres ad films.
  - Ecommerce: the MW&B store on desktop and mobile.
  - Custom software: the Finsckool platform.
  - The high-resolution campaign screenshots come from the scaleacres.com media library.
  - The composer is in `scripts/nd-service-visuals/`.

## Colour and depth

- The cinematic dark sections from the draft (Hero, Manifesto, Website design, Selected work and Let's talk) use Brand Black `#0B0D0D`. Navy has been removed everywhere, and no blue ground replaces black.
- The other sections are white or Mist. Market Leaders moved from Mist to white.
- Blue appears only as an accent: headline words, CTAs, links, hovers, small badges and thin rules.
- Media and cards on white sit on a charcoal shadow scale (`--sh-1` to `--sh-3` in `nd.css`), with a slightly deeper shadow on hover. This applies to:
  - the About portfolio image;
  - the Market Leaders strip;
  - service mockups, which now float on Mist instead of sitting in dark boxes;
  - video cards;
  - branding pieces;
  - the testimonial video;
  - Process cards.
- The "reveal from above" animations now open slightly beyond the frame, so the shadows aren't clipped.
- The active step in "From brief to launch" is Brand Black again.

## Section order (from the draft)

1. Header: logo, plus a Royal Menu button. The header is transparent over the hero and turns white after it.
2. Hero (black): "Built to Stand Out. / Designed to Scale."
3. Manifesto (black), from the first design: "We build real estate brands people remember."
4. Who we are (white), from the Neiden design.
5. "We Don't Create Brands. We Create Market Leaders." (white), from the first design. The strip is pinned horizontally on desktop and swipes on phones.
6. What we build (white): the services.
7. Website design (black). SID Realtech and Subata Realty now play muted scroll-through videos of their live sites.
8. Real estate videos that drive growth (white).
9. Branding index (mist).
10. True stories (white).
11. Selected work (black).
12. From brief to launch (mist). The active step is Brand Black.
13. Let's talk (black).
14. New footer: a "ScaleAcres" wordmark faded across the black-to-white change, then a white footer with navigation, services, contact icons and a legal bar.

## Notes

- **Duplicate headline.** Sections 5 and 9 both use the "We don't create brands. We create market leaders." headline, as the draft does. Only the paragraph in section 9 was changed so it doesn't repeat section 5 word for word.
- **Website videos.** These were recorded from full-page captures of the live sites. They are not generated footage. Some parts were cut from the recordings:
  - unloaded counters and an empty "Featured Projects" carousel on the SID site;
  - an empty slider band on the Subata site.
- **Imperial Sky Realty.** Its capture failed, so it stays as a still.
- **Video loading.** The videos load only near the viewport and play only while visible. They are skipped when reduced motion or Save-Data is on.
- **Performance.** Measured on the extracted ZIP, LCP was about 0.7 s and CLS was 0 on desktop and mobile. The initial transfer is about 1.9 MB.
- **Scope.** No internal pages, live WordPress, DNS or hosting were touched.
