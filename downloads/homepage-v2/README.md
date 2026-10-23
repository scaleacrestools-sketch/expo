# ScaleAcres homepage v2: proposal for review

Only the homepage changed. Other pages, the live WordPress site, hosting and DNS are untouched, and the preview is `noindex`.

## Files

| File | What it is |
|---|---|
| `scaleacres-homepage-preview-netlify.zip` | Static build. Drag it onto Netlify Drop. It contains the whole site, so menu links work, but only the homepage is new. |
| `scaleacres-homepage-source.zip` | Next.js source with the new homepage. Run `npm ci && npm run build:static-preview`. |
| `homepage-desktop-full-page.jpg`, `homepage-mobile-full-page.jpg` | Earlier hero; the rest of the page is unchanged. Full-page screenshots taken in a real browser with all media loaded. They show every section in its final state, so the sticky stacks and pinned strip appear laid out flat. |
| `hero-desktop.jpg`, `hero-mobile.jpg` | The new hero, settled. |
| `hero-desktop-animation.mp4`, `hero-mobile-animation.mp4` | Screen recordings of the hero's intro, pointer depth and scroll transition. |
| `hero-vs-arpeggio.jpg` | The hero next to the Arpeggio reference. |
| `homepage-motion-frames.jpg` | Frames recorded while scrolling, showing the animations (earlier hero). |

## Sections

1. **Hero (redesigned after Arpeggio):**
   - **Picture:** a full-bleed black-and-white still from the ScaleAcres "Light sweep" film, with a portrait crop on phones.
   - **Layout:** the statement "Built to stand out. Designed to scale." at top left, a light display tagline at top right, a crosshair grid, and "ScaleAcres" in Royal Blue spanning the full width along the bottom.
   - **Motion:** a stepped staircase reveal (columns on desktop, diagonal rows on phones), then the letters rise one by one, with layered depth when the pointer moves. On scroll the picture contracts into a framed card. No form.
2. **Who we are:** sticky statement with genuine work drifting past.
3. **Our Services:** eight sticky cards that stack, with media that opens from a clipped frame.
4. **We Don't Create Brands. We Create Market Leaders.:** masked type, then a pinned horizontal branding strip.
5. **Website Design:** six real ScaleAcres sites, each scrolling inside a browser frame, with a wipe between projects.
6. **Real Estate Videos That Drive Growth:** a reel that opens from a clipped frame with a cursor-following play button, then Ad/Social/AI tabs that play in a dialog.
7. Client logo wall.
8. How we work.
9. Video testimonials.
10. Start a project.
11. Footer.

## Media

- **Bundled in the ZIP:** the logo and the poster frames.
- **Streamed from where ScaleAcres already hosts them:**
  - client work images from scaleacres.com;
  - concept films from ScaleAcres' Higgsfield CDN;
  - Shorts from YouTube.
- **Labelling:** the concept films are captioned "AI-generated · not client work".

## Missing or limited assets

1. **Website screenshots:** they are about 700 px wide, so they look slightly soft in the large browser frame. Higher-resolution captures would help, and there are no mobile screenshots for a phone mockup.
2. **Website platforms:** stated only where scaleacres.com states them (SID Realtech, Let's Movin).
3. **Social Media Videos:** eight have no portrait cover on YouTube, so a centre crop of the landscape frame is used. One video has no cover at all and is left out.
4. **Performance, Video and Software services:** no genuine work image, so these use the ScaleAcres concept films, labelled as such.
5. **Branding images:** 924 × 522 px. Larger exports would make the branding strip sharper.
