# ScaleAcres homepage: Sections 1 to 7

This adds **06 Website Design** (Brand Black) and **07 Client Success Stories** (white) after Our Work. Sections 1–5 are unchanged.

No internal pages, live WordPress, DNS or hosting were touched. The preview is set to noindex.

## Files

| File | What it is |
| --- | --- |
| `sections-1-7-desktop-1920x1080.mp4` | A real browser recording of all seven sections, 97 s long. |
| `sections-1-7-mobile-390x844.mp4` | A real browser recording on a phone viewport, 79 s long. |
| `homepage-full-desktop.jpg` | Full-page screenshot at 1440 px wide. |
| `homepage-full-mobile.jpg` | Full-page screenshot at 390 px wide, rendered at 2×. |
| `scaleacres-homepage-netlify-preview.zip` | A working static preview. Drag it into Netlify Drop. |
| `scaleacres-homepage-source.zip` | The complete Next.js source. |

## 06 Website Design

The layout follows the screenshot: Brand Black, thin column rules, numbered projects with metadata rows, and large live-site previews in a minimal browser frame. Each preview widens into place as you scroll and settles from a slight zoom. Two sites play a muted scroll-through of the live site while on screen. A compact "More websites" list follows.

**Heading fixed.** The scrolling "Website design." ticker that clipped at the edges is replaced by a two-line editorial heading: **"Website Design. / Digital Experiences."**, with "Experiences." in Sky. It rises word by word, and the second line drifts into place as the section arrives. The type scales with the viewport and was measured to fit at 1440, 1024, 390 and 320 px, with no cropping or horizontal scroll.

**Content audit** (each live site checked on 28 Oct 2026):

| # | Project | Live URL | Change |
| --- | --- | --- | --- |
| 01 | SID Realtech | sidrealtech.com | **"Node.js" removed.** It can't be confirmed from the live site. Next.js is confirmed by the site's own `/_next/` assets. |
| 02 | Subata Realty | subatarealty.com | Description tightened to match the site (Phuket, Indian and NRI buyers, buying guide). |
| 03 | Imperial Sky Realty | imperialskyrealty.com | None |
| — | Research Capital | researchcapital.in | Linked |
| — | Finsckool | finsckool.com | Linked. "Finsckool" is the spelling the live site uses. |
| — | Jina Cosmetics | not linked | **Flag:** the site's URL couldn't be verified, so it's listed without a link. |

- Each browser frame now shows the site's real domain.
- Each project has a "Visit live site" link that opens in a new tab.
- The "All projects" button links to `/our-work/`.

## 07 Client Success Stories

This section uses the same four genuine testimonials published on scaleacres.com, unedited.

| Client | Shown on screen in the video |
| --- | --- |
| Let's Movin | Sunita Bishnoi |
| Timespro Consulting | 50% lower cost per lead · 350% increase in site visits |
| NRG India | 20× return on marketing · 110% increase in site visits |
| IPD · International Property Desk | "Major efforts in content creation in real estate" |

**Corrections:**
- The logo in the IPD video reads "International Property **Desk**". The old code said "Deal".
- The TimesPro logo reads "**Timespro Consulting**".

Both labels now match the videos.

**Design:**
- The heading "Our Client / Success Stories" rises word by word, with "Success Stories" in Royal Blue.
- The original subtitle is kept word for word.
- Square thumbnails use Wistia's own stills as AVIF/WebP at 480, 720 and 1080 px, with a soft charcoal shadow, a duration chip and a white play button that turns Royal on hover.
- Cards unmask in a stagger, lift on hover, and show a blue focus ring for keyboard users.
- Layout: four across from 1280 px, two across on tablets, and a swipeable row on phones.

**Playback:**
- Nothing autoplays. A video starts only after a visitor picks one, and it opens in a modal player with native controls.
- Escape, the close button or a click outside closes it, which stops playback and returns focus to the card.

**Video hosting:**
- The original CloudFront and Wistia hosts can't be reached from the build environment. The four videos were fetched from their Wistia originals and are now served with the site as 720 × 720 WebM (VP9) and MP4 (H.264), 14 MB in total. They load only when a visitor plays one.
- The original Wistia IDs stay in `content/assets.ts`.
- **Captions:** none of the videos have caption files. Captions would need transcripts approved by the clients.

## Checks (static build)

- **Build.** The typecheck, lint and static export all pass.
- **Section order.** Hero → Creative statement → Who we are → Our services → Our work → Website design → Client success stories, at 1440, 768 and 390 px.
- **Layout.** No horizontal overflow at 1440, 1024, 768, 390 or 320 px. No console errors, no failed requests and no broken images.
- **Mobile viewport fixed.** The new testimonials row initially made phones lay the page out 978 px wide. Clipping that section horizontally fixed it, and it was retested at 390 and 320 px.
- **Speed.** The page first appears in 0.67 s on desktop and 0.62 s on mobile, with zero layout shift. Below-the-fold images are lazy-loaded.
- **Reduced motion.** Respected: the reveals and the drift are skipped.
