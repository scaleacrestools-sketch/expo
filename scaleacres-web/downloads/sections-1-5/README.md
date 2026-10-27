# ScaleAcres homepage: Sections 1 to 5

This delivery adds **Section 05, Our Work / Creative Showcase**, built with the four approved project covers. Sections 1–4 are unchanged.

No internal pages, live WordPress, DNS or hosting were touched. The preview is set to noindex, and Section 06 has not been started.

## Files

| File | What it is |
| --- | --- |
| `sections-1-5-desktop-1920x1080.mp4` | A real browser recording of all five sections at 1920 × 1080, 64 s long. |
| `sections-1-5-mobile-390x844.mp4` | The same recording on a 390 × 844 phone viewport, 55 s long. |
| `homepage-full-desktop.jpg` | Full-page screenshot at 1440 px wide. |
| `homepage-full-mobile.jpg` | Full-page screenshot at 390 px wide, rendered at 2×. |
| `covers/` | The four portfolio covers at 2400 × 1500. |
| `scaleacres-homepage-netlify-preview.zip` | A working static preview. Drag it into Netlify Drop. |
| `scaleacres-homepage-source.zip` | The Next.js source, including the cover scene scripts and their genuine sources. |

Both recordings show:
- the hero reel;
- the creative statement with its floating creatives;
- the Who We Are panel opening and its text filling in;
- all eight Our Services cards stacking;
- the Creative Showcase: the heading rising, each cover revealing on scroll, hover zoom on desktop, one project preview opened and closed, and the Explore all work link.

## Section 05: Our Work / Creative Showcase

- **Ground.** Warm white (`#f7f6f2`).
- **Heading.** The label "Our work does the talking", then "Our Work (04)", then a large "Creative Showcase" heading that rises word by word.
- **Grid.** Two columns on desktop and tablet, one on phones. Four 16:10 covers in this order:
  1. JBBR Group (Brand Identity & Creative Design)
  2. TRG (Launch Campaign & Event Experience)
  3. Intech Developers (Website Design & Development)
  4. SID Realtech (Branding & Outdoor Campaign)
- **Reveal.** Each cover unmasks upward as it arrives, with the right column a beat later, while the image settles from a slight zoom. The project name and category follow.
- **Hover and keyboard.** Hover zooms the image, deepens the shadow, raises a "View project" pill and turns the + button blue. Keyboard focus shows the same pill with a blue focus ring.
- **Project preview.** None of these projects has a detail page yet, so each cover opens a project preview instead of linking to a page that doesn't exist. The preview shows:
  - the cover, summary and scope of work;
  - links to the related service pages and to `/our-work/`.

  It is a native modal dialog that closes with Escape, the close button or a click outside, and it returns focus to the card.
- **CTA.** "Explore all work" links to `/our-work/`.
- **Images.** AVIF with WebP fallback at 640, 960, 1280 and 1600 px, lazy-loaded with fixed aspect ratios, so nothing shifts as they load. All four covers together weigh 164 KB as AVIF at 1600 px.
- **Reduced motion.** Respected. Covers and text appear in place.

## The four covers

Each cover is a 3D scene rendered in Blender/Cycles. The only images in it are genuine ScaleAcres client work, used unaltered: no stock imagery, no AI-generated pictures and no Higgsfield credits. The scene scripts and sources are in `scripts/nd-work-covers/`.

| Cover | Genuine sources |
| --- | --- |
| JBBR Group | The official JBBR logo (from jbbr.co.in) foiled on a box and cards, plus the "We don't just hand over keys" creative |
| TRG | The TRG The Mall "15 Years of Income" creative, and the TRG and TRG The Mall logos cut from it, on a launch gate |
| Intech Developers | The live Intech website built by ScaleAcres (intech-developers.vercel.app), captured on desktop and mobile |
| SID Realtech | The Ellington 86 "Coming Soon" launch creative on a lit hoarding |

These are presentation mockups of genuine artwork, not photographs of installations.

Both earlier corrections are now in the final covers:
- **TRG:** the two logos sit on one seamless header print, so no rectangles show.
- **SID:** the highway light trails now cross behind the hoarding, and the skyline windows are smaller and dimmer.

**Rhomes and SeaBreeze Villas are not included**, as agreed. Both need their original files before they can be finished.

## Checks (static build, 27 Oct 2026)

- **Build.** The typecheck, lint and static export all pass.
- **Section order.** Hero → Creative statement → Who we are → Our services → Our work, at 1440, 768 and 390 px.
- **Layout.** No horizontal overflow at any width. No console errors and no failed requests.
- **Media.** The hero video loads, and all four covers load as AVIF.
- **Project preview.** It opens with focus on the close button. Escape closes it, and the page scroll lock releases.
- **Speed.** The page first appears in 0.68 s on desktop and 0.60 s on mobile, with zero layout shift. This is unchanged from Sections 1–4.
- **Noindex.** The preview sends `X-Robots-Tag: noindex, nofollow`, and `robots.txt` disallows all crawling.
