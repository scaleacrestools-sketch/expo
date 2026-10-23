# ScaleAcres homepage v2: proposal for review

Only the homepage changed. Other pages, the live WordPress site, hosting and DNS are untouched, and the preview is `noindex`.

## Files

| File | What it is |
|---|---|
| `scaleacres-homepage-preview-netlify.zip` | Static build. Drag it onto Netlify Drop. It contains the whole site, so menu links work, but only the homepage is new. |
| `scaleacres-homepage-source.zip` | Next.js source with the new homepage. Run `npm ci && npm run build:static-preview`. |
| `homepage-desktop-full-page.jpg`, `homepage-mobile-full-page.jpg` | Full-page screenshots taken in a real browser with all media loaded. They show every section in its final state, so the sticky stacks and pinned strip appear laid out flat. |
| `homepage-motion-frames.jpg` | Frames recorded while scrolling, showing the animations. |

## Sections

1. **Hero:** staircase mask reveal, showreel, masked headline, magnetic CTA, scroll cue. No form.
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
