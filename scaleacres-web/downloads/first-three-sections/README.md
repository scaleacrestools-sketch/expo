# ScaleAcres homepage: Sections 1 to 3, for approval

The homepage now contains only the first three sections, built as one continuous page. Sections 4 onwards are not on the page yet; their components are kept in `components/nd/` and will come back once each is approved. No internal pages, WordPress, DNS or hosting were touched, and the preview is set to noindex.

## Files

| File | What it is |
| --- | --- |
| `sections-1-3-desktop-1920x1080.mp4` | Real browser recording, about 23 s: the hero reel, the creative statement and the black-to-white change into Who We Are. |
| `sections-1-3-mobile-390x844.mp4` | The same recording on a phone. |
| `screenshots/` | Desktop (1920 × 1080) and mobile (390 × 844 at 3×) screenshots of each section and both transitions. |
| `scaleacres-homepage-netlify-preview.zip` | A working preview. Drag it into Netlify Drop. |
| `scaleacres-homepage-source.zip` | The Next.js source. |

## Section 1: Hero

- **Kept from the approved hero.** The six-chapter ScaleAcres reel, the logo on the left and the menu on the far right, "Built to Stand Out. / Designed to Scale.", the CTA pill, and the reel controls that follow the chapters.
- **Changes in this round.**
  - "View our work" now goes to `/our-work/`, because the work sections aren't on the page yet.
  - Once the header tucks away while scrolling, the menu button gets a frosted backing so it stays readable over any section.
  - The header turns white only over white sections. It stays transparent over the hero and the black statement.

## Section 2: We build real estate brands people remember.

This uses the original animation from the first build: the statement is pinned while genuine creatives drift past at different speeds.

- **Headline.** Each line rises out of a mask once, with a quick stagger. The whole statement then eases from 106% to 94% scale as you scroll.
- **Creatives.** Six genuine ScaleAcres pieces drift past at speeds from 0.85× to 1.35×:
  - the Ellington 86 brochure;
  - the SID launch creative;
  - the Ellington 86 hoarding;
  - the JBBR creative;
  - the Nirvana County brochure;
  - the Intech creative.
- **Entry direction.** Each piece glides in from its own side, left or right.
- **Tuning.**
  - The scroll distance is shorter than the original (175 svh on desktop, 150 svh on phones), so there is no long empty stretch.
  - The pieces are placed in side lanes and slightly dimmed. The type has a soft shadow and always sits above them, so nothing covers the words.
  - Phones get their own placements, not a shrunken desktop layout.

## Section 3: Who We Are (white)

- **Black to white.** The white panel opens out of the black section. It starts inset with rounded corners and widens to full bleed as it arrives.
- **Grid lines.** The thin column dividers draw down once.
- **Statement.**
  - The words fill in as you scroll.
  - "launch, position" and "sell out" finish in Royal Blue.
  - The two inline work chips widen from slivers into pills.
- **Supporting content.** The studios, markets and focus details, the introduction and the About ScaleAcres and Meet the team links rise in turn.
- **Portfolio.** The collage now shows six real client-site screenshots in place of the earlier single slide image:
  - Finsckool
  - SID Realtech
  - Research Capital
  - Subata Realty
  - Jina Cosmetics
  - Imperial Sky Realty

  Each is a 2400 px capture of the live site with its name underneath. The tiles open with an image reveal, and the two columns drift gently against each other.

## Checks

- **Speed.** The page first appears in 0.61 s on desktop and 0.57 s on mobile, with zero layout shift.
- **Layout.** There is no horizontal scrolling at 1440, 768 or 390 px, and no console errors.
- **Reduced motion.** The reel stays paused on its poster, and every section is shown in full without any scroll pinning.
