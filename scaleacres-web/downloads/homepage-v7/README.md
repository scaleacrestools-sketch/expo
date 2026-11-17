# ScaleAcres homepage v7

## Files

| File | What it is |
| --- | --- |
| `hero-film-wall-1920x1080.mp4` | The hero video: a 48 s seamless loop, 1920 × 1080, made only from ScaleAcres ad, AI and social work |
| `scaleacres-hero-section-1440x900.mp4` | The hero section as it plays on the page, with the headline and buttons, 19 s |
| `services-ad-results-1800x1200.mp4` | Services visual: a real ScaleAcres ad running in a phone, with campaign results above the screen. 24 s loop. |
| `scaleacres-homepage-v7-1440x900.mp4` | Full homepage walkthrough, 58 s |
| `scaleacres-homepage-v7-editable.svg` | The whole homepage as one editable SVG: 292 text layers and 155 image layers |
| `scaleacres-homepage-v7-preview-part1.jpg` / `-part2.jpg` | How the SVG renders |

The live page is at `design/home-v7/index.html`.

## 1. The hero video
- **Ad films (playing):** the eight ScaleAcres property ad films from the ScaleAcres Vimeo library. Each tile plays its strongest 24 s:
  - La Wisteria (SeaBreeze)
  - Signature Global
  - Godrej
  - Karyan
  - Aarize
  - Bhartiya City
  - Dualis (Shapoorji Pallonji)
  - RPS
- **AI and social videos:** the tall tiles show covers of the ScaleAcres AI shorts (JBBR Kanvas, Sky Byte and others), social shorts and ad shorts from the ScaleAcres YouTube channel. They are still frames, not motion. YouTube blocks downloads from this server, so the clips themselves are not available yet. Send the AI and social video files (MP4) and they will play like the ad films.
- **Not used:** client testimonials, the earlier ScaleAcres motion reel, and anything generated.

The wall is rendered once into a single looping film. The page now loads one 6 MB video instead of twenty separate players.

## 2. Services: a running ad with results
- **The ad:** the La Wisteria film (SeaBreeze Villas) plays as a live sponsored post, with the account name, a "Live" tag, the caption, a "Book a site visit" button and a progress bar.
- **Above the screen:** campaign results count up. The figures are the ones ScaleAcres publishes on its case-study cards, each labelled with its campaign:
  - Yugen Infra: 15k+ leads, 37.8% qualification, 200+ plots sold;
  - One Goa: 3.4k leads, 28% qualified, 270+ video meetings.
- **Chips:** Meta, Google, Instagram and YouTube, plus "Ad running on Instagram · Facebook".

Note: the published case-study pages give different lead totals from these cards (16k+ and 9K+). Please confirm which figures to show.

## 3. Optimisation across the homepage
- **Ideas banner:** now plays aerial footage from the Bhartiya City ad film, not a static composite.
- **Loading:**
  - Below-the-fold videos load only when they come near the screen, and pause when off screen.
  - Images lazy-load and carry fixed dimensions, so nothing jumps while loading.
  - The hero poster image is preloaded for a fast first paint.
- **Responsive layouts:**
  - Tablet (≤1100 px): sections stack, logo walls use 4–5 columns, and the brand journey stacks image over text.
  - Phone (≤640 px): single column, larger tap targets, and 2–3 column logo walls.
  - No horizontal scrolling at any width.
- **Accessibility:** visible keyboard focus, labelled videos, and every animation and video stops for visitors who prefer reduced motion.
- **Search and sharing:** a meta description, Open Graph tags and a theme colour.
- **Size:** page assets are 21 MB, down from 31 MB in v6.

## Still to come
- **Showcase images:** for Sohom Estate, DTC Group and Bhatia Group. Their tiles are marked "Add project image".
- **AI and social videos:** the MP4 files, so they can move in the hero.
