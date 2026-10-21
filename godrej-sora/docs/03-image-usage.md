# Deliverable 2 & 8 — Image library and section-by-section image usage

**Status (phase 2, 21 Oct 2026): 0 of 38 manifest assets are present; approval status of every id is `not-supplied`.** The brochure and the official site were not reachable from this environment (see `01-source-audit.md`), so no project image has been extracted. Every image slot currently renders a branded placeholder that names the asset and its source page. No substitute imagery of other projects was used.

Intake: put the brochure at `assets-source/godrej-sora-brochure.pdf` and run `npm run assets:extract` (page map in `content/brochure-map.ts`), or `npm run assets:fetch` on an unrestricted machine for website renders. Then: place masters at `public/images/godrej-sora/_masters/<id>.jpg|png`, run `npm run assets:optimize` (writes AVIF/WebP/JPG + dimension sidecar), then `npm run assets:check`. Update `approval` in `content/assets.ts` to `approved` once permission is on file.

| Section | Asset id | Expected source | Kind |
|---|---|---|---|
| Nav / Footer | `brand/godrej-sora-logo` | Brochure p.10 / p.64 (original logo file) | Brand |
| 01 Hero, 15 Walkthrough poster | `hero/tower-elevation` | Brochure p.55 (full tower elevation) | Artist's impression |
| 02 Meaning of Sora | `brand/red-sun-blossom` | Brochure p.10–11 / p.24 red sun + blossom illustration | Brand |
| 02 Meaning (inset), 08 Landscape | `landscape/cherry-blossom-court` | Brochure p.24 | Artist's impression |
| 03 Eight Rays | `brand/eight-rays-sun` | Brochure p.11 golden origami sun | Brand (SVG fallback built in) |
| 04 Architecture (3 frames) | `architecture/torii-facade`, `architecture/facade-closeup`, `architecture/exterior-elevation-2` | Brochure p.23, p.54, p.56 | Artist's impression |
| 05 Residences | `residences/living-dining`, `residences/interior-natural-light`, `residences/bedroom` | Brochure p.44, p.21–22, p.46–47 | Artist's impression |
| 06 Balcony | `balconies/fifty-foot-balcony` | Brochure p.45 | Artist's impression |
| 07 Shibui | `landscape/shibui-01`, `landscape/shibui-02` | Brochure p.18–20 | Artist's impression |
| 08 Landscaping | `landscape/japanese-garden`, `landscape/sunken-seating` | Brochure p.28, p.25 | Artist's impression |
| 09 Shiki Clubhouse | `clubhouse/shiki-elevation`, `clubhouse/onsen-pool`, `clubhouse/rooftop-pool`, `amenities/*` (6) | Brochure p.33, p.35, p.36, p.33–36 | Artist's impression |
| 10 Exclusivity, 19 Final | `hero/aerial-render` | Brochure p.63 | Artist's impression |
| 11 Location | `location/map` | Brochure location map | Map (not to scale) |
| 12 Collection, 13 Plans | `floor-plans/3bhk-typical`, `floor-plans/4bhk-typical`, `floor-plans/master-plan` | Official website floor-plan tab | Plan |
| 14 Gallery | the above plus `architecture/exterior-elevation-3` (p.57), `architecture/triple-height-lobby`, `balconies/balcony-view`, `residences/kitchen` (p.48), `residences/bathroom` (p.49), `gallery/lifestyle-01/02` | Brochure / official gallery | Artist's impression; lifestyle = stock, labelled |
| 17 Legacy, Footer | `brand/godrej-properties-logo` | Official website | Brand |

Every rendered image carries an automatic disclosure chip from `kindLabel` ("Artist's impression", "Illustrative stock photograph", "AI-generated representation", "Indicative plan", "Indicative map, not to scale").
