# Phase 2 report — asset integration, verification and design refinement

**Date:** 21 October 2026

## 1. Official imagery: status and exactly what to supply

Re-checked at the start of this phase:

| Where I looked | Result |
|---|---|
| Repository (all paths), `/mnt/user-data/uploads`, `/mnt/attach`, scratchpad | No PDF, no Sora renders |
| Google Drive (`Sora`/`Godrej` in title or full text; every PDF/image/zip modified since 20 Oct) | Only the previously rejected 1080×1080 pre-launch creative; no brochure |
| `www.godrejproperties.com` (direct and via WebFetch) | Still refused by this session's egress policy (HTTP 403 on CONNECT) |

**No official image was integrated and no substitute imagery was created.** All 38 manifest slots remain `not-supplied` and render the branded placeholder.

### What you need to supply (and where)

1. `godrej-sora/assets-source/godrej-sora-brochure.pdf` — the 64-page brochure.
2. `godrej-sora/assets-source/logo/godrej-sora-logo.svg` (or high-res PNG) and `godrej-properties-logo.svg`.
3. Optional: any renders downloaded from the official gallery into `godrej-sora/assets-source/official/`.
4. Written permission from Godrej Properties (or your channel-partner agreement) covering republication of the above — keep it in the same folder.

The folder is git-ignored; nothing copyrighted will be committed by accident.

### What happens once the PDF is there

```bash
cd godrej-sora
npm run assets:extract    # pdfimages dumps every embedded raster; pdftoppm renders the 23 mapped pages at 250 dpi → _masters/<id>.jpg
npm run assets:optimize   # AVIF + WebP + JPG (≤2560px) + dimension sidecar per id
npm run assets:check      # confirms 23/38 present; placeholders disappear automatically
```

- The page→id map is `content/brochure-map.ts` (built from the brief's page table: 10, 11, 18–25, 28, 33, 35, 36, 44–49, 54–57, 63). Each entry accepts an optional `crop: [x%, y%, w%, h%]` to trim brochure headings; set crops after viewing the first render.
- The remaining 15 ids (floor plans, master plan, map, triple-height lobby, balcony view, lifestyle stock, Godrej Properties logo) come from the official website. `npm run assets:fetch` downloads every gallery image with a `report.json` of URL/alt/size when run from a machine that can reach godrejproperties.com; rename the files to manifest ids and optimise.
- Set `approval: 'approved'` in `content/assets.ts` once permission is on file. Stock lifestyle images must keep `kind: 'stock'` so the "Illustrative stock photograph" chip renders.

The pipeline was validated end to end in this session with a synthetic 64-page PDF (extract → optimise → check → clean).

## 2. Brand identity

- Palette unchanged (Sora red #BD1E2D, washi ivory #F5EFE5, origami gold #D5A33C, ink #24211F, sage) — pending refinement by sampling the real logo/brochure once supplied.
- Typography: Manrope Variable (modern, widely tracked sans, matching the brochure's precise sans character described in the brief) with Instrument Serif italic reserved for the second line of headings. The brochure's actual typeface could not be inspected; when the PDF arrives, `pdffonts` will list the embedded fonts so the closest licensed match can be confirmed.
- Shibui: more negative space in the hero, vertical section numerals, hairline rules, and a single accent motif per section.

## 3. Content verification (this phase)

New findings, now logged in `content/project.ts → conflicts[]` and shown nowhere on the page:

- Four towers (listings agree) but G+30 vs G+31 floors — **not displayed**.
- Possession: Sept 2032 (most common), Sept 2031–Aug 2032, and an outlier 2029–30 — shown as Sept 2032 with `verified: false`.
- Price: ₹8.31 Cr (official page, at audit time) vs ₹7.99–11.40 Cr aggregators; 4 BHK L/XL at ₹10.55 / 11.51 Cr on some sites — only the official-page figure is shown, asterisked.
- "Genkan-style private lift lobbies" — one listing; wording adopted as "Genkan-inspired" under the brochure-sourced feature.
- Floor-to-floor 3.4 m is corroborated by one listing; another says 11.5 ft floor-to-ceiling.
- **Eight Rays of Sora**: no public source repeats the eight names. They remain exactly as supplied in the brief (brochure p.11) and are flagged `verified: false` until the PDF is checked. The descriptive lines under each ray are marketing copy, not brochure text.

Nothing was guessed; every unverified value remains configurable.

## 4. Design improvements made

| Area | Change |
|---|---|
| Intro | 1.7 s "sunrise" intro on first visit per session (red sun rises over a hairline horizon, wordmark letter-spacing settles). Pointer-events none, skipped under reduced motion. |
| Hero | Masked line reveals for the two headline lines; scroll-driven gold sun that rises on load and lifts away as you scroll, over a double hairline horizon; vertical 空・そら watermark at 6% ivory; stat column retained. |
| Nav | Gold scroll-progress hairline across the top once the bar turns solid. |
| Section headings | Vertical "SECTION 0N" label in the left margin on ≥1280 px. |
| Architecture | Numbered frames (01–03) with red hairline; a three-bar progress indicator on the pinned image that extends as each frame activates. |
| Residences / Landscape / Shiki | GSAP light parallax (`Parallax`) on the lead image of each section; 12% overscan so edges never show. |
| Shiki Clubhouse | Tiered-roof line motif under the heading; on phones the six secondary amenities become a horizontal snap-scroll rail (78 vw cards) instead of a long stack. |
| Exclusivity | Numerals count up (244 / 2 / 0 / 1) when the section enters view. |
| Gallery | Hover caption now carries the category eyebrow in gold above the title. |
| Placeholders | Title/source label moved to the bottom-right so it never collides with the nav or hero copy; hidden on tiles under 18 rem. |

All motion honours `prefers-reduced-motion`; nothing was added that blocks interaction.

## 5. Preserved functionality — test results

| Check | Result |
|---|---|
| `next build` | ✓ (home route 62 kB; static) |
| `tsc --noEmit`, `next lint` | ✓ clean |
| Playwright e2e, desktop + mobile | **8/8 passed** (sections, disclosures, drawer validation/submit/Escape, lightbox keys, configuration tabs) |
| Scripted a11y sanity at 1440/768/390 | 0 images without alt, 0 unnamed buttons, 1 h1, no horizontal overflow, no console errors |
| Lead API, spam, duplicates, rate limit | Unchanged from phase 1 (re-exercised via the e2e submit test) |

Screenshots refreshed in `docs/screenshots/` (hero, drawer, full page × 3 viewports).

## 6. Remaining items requiring verification

See `docs/04-unverified.md` (updated) — in short: price, possession, configuration naming, areas, brochure specifications, Eight Rays wording, tower/floor count, amenities beyond the two pools, location table, Godrej heritage copy, walkthrough URL, image permissions, advertiser identity/contact/analytics.

Deployment was intentionally not performed.
