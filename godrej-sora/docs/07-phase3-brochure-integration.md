# Phase 3 — Official brochure integration and final verification

**Date:** 21 October 2026. Source: the official 64-page Godrej Sora brochure supplied by the client
(`Godrej Sora Opp Doc Verticle-30-08-25 v1`, Adobe Illustrator master, Godrej Properties Limited, Sept 2025; 720×1440 pt pages).

## What the brochure settled

| Item | Brochure finding | Page |
|---|---|---|
| Eight Rays of Sora | Confirmed, with the brochure's own sub-lines: Accessibility (Prime location: Sector 53), Inspiration (The Shibui philosophy), Influence (Japanese-themed design), Mindfulness (Your mind space to soar), Wellness (The Shiki Clubhouse), Luxury (The sheer bliss of space), Exclusiveness (Limited-edition landmark), Partnership (Leading design partners) | 11 |
| Residence specifications | ~50 ft balconies (45), private lift lobbies (46), luxury floor finish (47), 3.4 m floor-to-floor (48), 380–600 sq ft living/dining (49), Villeroy & Boch or equivalent CP fittings (50), Schüco or equivalent double glazing (51), only 244 residences (55), just 2 units per core per tower (56), no overlooking towers (57), 5 serving high-speed lifts per tower (58), dual sunrise/sunset views (30), triple-height lobby (29) | as listed |
| Amenities | Shiki Clubhouse inspired by Japanese tiered roofs (33), indoor Onsen pool (35), outdoor rooftop pool (36), gymnasium (37), spa (38), sculpted staircase (39), squash (40), padel (41), badminton/multi-purpose hall (42) | as listed |
| Location table | Full km / minute table for schools, hospitals, business centres and malls, "as per Google Maps, actuals may differ; commuting time may vary" | 14–15 |
| Design partners | Hafeez Contractor and Oracles Landscape Architecture, with the brochure's descriptions and sources | 60 |
| Godrej legacy | 1897 origin, 128+ years, 1.1 billion lives, 116 projects, plus the ESG credentials (UNGC, SBTi, DJSI 2025, FTSE India, GRESB 5-star, ISO 14001) | 2, 4 |
| Legal | Plot GH-21, 14,569.20 sq m, Village Wazirabad, Sector 53; land acquired from HSVP by conveyance deed dated 26 June 2025; RERA RC/REP/HARERA/GGM/976/708/2025/79 dated 25 Aug 2025; "Japan" usage note; official website disclaimer | 64, every page |

**Still not in the brochure, so still configurable and unverified:** starting price, carpet/super areas, possession date, configuration naming (3 & 4 BHK vs 3.5 & 4.5 BHK), tower/floor count, floor plans and master plan, the walkthrough video. These remain exactly as flagged in `docs/04-unverified.md`.

## Imagery disclosures — read before approving

The brochure labels its own imagery, and the site now mirrors those labels exactly:

- **Artist's impression, not an actual site image:** Torii façade (23), sunken seating (25), Shiki Clubhouse (33), tower renders (54–57), aerial (63). These are the only visuals of the actual project.
- **Stock image for representation purpose only:** every interior, amenity, landscape, lifestyle and the origami-sun pages. They are presented as representational, with a "Stock image" chip, never as Sora photographs.
- **AI generated image:** the lift-lobby visual (58). Labelled as such.
- **"Japan" footnote:** "The use of the term Japan is a mere representation of the essence of a Japanese lifestyle." Reproduced in the hero line and footer.

## Pipeline used

`pdfimages -j` (491 embedded JPEGs copied losslessly for reference) → `pdftoppm -r 220` (all 64 pages, JPEG q95) → crop per `content/brochure-map.ts` → `sharp` AVIF/WebP/JPG ≤2560 px + dimension sidecars. Re-runnable with `npm run assets:extract && npm run assets:optimize && npm run assets:report`.

## Typography

`pdffonts` on the brochure: TheFuture Extralight/Regular/Bold (geometric), Helvetica Light, Raleway, Myriad Pro, Gill Sans, M PLUS 1p (Japanese). Commercial faces are not redistributed. Display headings and eyebrows now use **Jost Variable** (OFL), the closest licensed geometric match; body/UI stays Manrope Variable (OFL); Instrument Serif italic remains for accents.
