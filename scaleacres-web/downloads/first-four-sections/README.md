# ScaleAcres homepage: Sections 1 to 4, for approval

The homepage now contains Hero, the Creative statement, Who We Are and Our Services, built as one continuous page. Section 5 onwards is not on the page yet. No internal pages, WordPress, DNS or hosting were touched, and the preview is set to noindex.

## Files

| File | What it is |
| --- | --- |
| `sections-1-4-desktop-1920x1080.mp4` | Real browser recording, about 50 s, covering all four sections and every service card. |
| `sections-1-4-mobile-390x844.mp4` | The same recording on a phone, about 42 s. |
| `screenshots/` | 7 desktop screenshots (1920 × 1080) and 5 mobile screenshots (390 × 844 at 3×). |
| `service-visuals/` | The eight service motion loops as high-quality masters (1440 × 960). |
| `scaleacres-homepage-netlify-preview.zip` | A working preview. Drag it into Netlify Drop. |
| `scaleacres-homepage-source.zip` | The Next.js source. |

## Sections 1 to 3

These are unchanged from the approved build:

- the hero reel;
- the pinned creative statement with drifting work;
- Who We Are on white, opening out of the black section.

## Section 4: Our Services

- **Structure.** This is the stacked-card design from your reference.
  - The section has a white background. Its heading reads "Our Services" with an "(08)" counter in Royal Blue, beside a short introduction and an "All services" link.
  - It holds eight Brand Black cards.
  - On desktop, each card stays fixed a little lower than the one before, so the stack reads as an index. As the next card arrives, the covered card shrinks and darkens slightly, and the new card takes over.
  - On phones, the cards simply follow one another, without the fixed stacking.
- **Each card.**
  - Left side: the "01 / 08" index and short label, the large service title, a Sky subline, a description, four included items and a link to the service page.
  - Right side: the service's own motion visual. It opens from a clipped frame as it arrives, with a small caption saying exactly what it shows.
- **Copy.** The approved list of eight services is kept. The homepage card copy is rewritten for real estate, and the service pages keep their own copy.
- **Visuals.** Each visual is an original 3D motion loop, built in the hero reel's style from genuine ScaleAcres work. These are designed compositions, not pasted screenshots.

| # | Service | What the visual shows |
| --- | --- | --- |
| 01 | Website Design & Development | SID Realtech on a laptop and Subata Realty on a phone, both scrolling, with the Imperial Sky Realty site in a browser behind |
| 02 | SEO | Real Search Console charts in a browser, with a floating card of first-page rankings |
| 03 | Performance Marketing | Real Google search ads for DLF, M3M, Godrej and Signature Global; Meta Ads results; TRG and SID creatives on phones |
| 04 | Branding & Creative Design | The SID guideline, the Ellington 86 brochure, hoarding and launch poster, and brochure spreads on a dark studio table |
| 05 | Social Media Marketing | Three phones playing ScaleAcres reels, between JBBR and Intech post creatives |
| 06 | Video & Creative Production | A turning 3D carousel of ScaleAcres ad films over a dimmed production backdrop (AI concept film) |
| 07 | Ecommerce Solutions | The MW&B store on a laptop and a phone |
| 08 | Custom Applications & Software | The Finsckool platform on a laptop and a phone, with a note that CRM and dashboard projects will be added later |

- **Delivery.** Each loop is 1200 × 800 in VP9 WebM or H.264 MP4, about 0.4 to 1 MB. A WebP poster shows first. Each loop loads only when its card is near the screen and pauses when off-screen. Reduced-motion and Save-Data visitors see the poster only. The renderer is in `scripts/nd-service-reels`.

## Checks

- **Speed.** The page first appears in 0.69 s on desktop and 0.56 s on mobile, with zero layout shift.
- **Layout.** There is no horizontal scrolling at 1440, 768 or 390 px, and no console errors.
- **Reduced motion.** The hero reel stays paused, nothing is pinned, and every section shows in full.
