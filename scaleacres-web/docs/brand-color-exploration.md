# Brand colour exploration: preview guide

**Status: exploration only. Nothing is approved or deployed.** The approved black-and-blue baseline is the default everywhere. On `scaleacres.com` / `www.scaleacres.com` the explorations are switched off completely: no switcher, and `?theme=` is ignored.

## How to preview

### Netlify drag-and-drop (no setup)
1. Unzip `scaleacres-3-themes-static-preview.zip`.
2. Drag the unzipped folder onto <https://app.netlify.com/drop>.
3. Open the URL Netlify gives you. A **Preview** bar sits at the bottom of every page:
   - **Baseline**, **Option 1 · Red** and **Option 2 · Midnight** switch the whole site instantly. The hero video keeps playing and nothing reloads.
   - **Logo: Official / Proposal** shows the recoloured logo proposal for the active option. Official is the default. A "Proposal" tag appears next to the logo while it is on.
   - **Compare ↗** opens the comparison page.
4. The comparison page is at `/theme-lab/`. It has swatches with HEX codes, typography and grounds, CTAs, the service and portfolio UI, logo treatments, contrast checks, a side-by-side comparison and the recommendation.

### Direct links
| Link | Shows |
|---|---|
| `/?theme=baseline` | Approved baseline |
| `/?theme=reddash` | Option 1 — Red Dash Inspired |
| `/?theme=midnight` | Option 2 — Midnight Electric |
| `/?theme=midnight&logo=proposal` | Option 2 with the proposal logo |
| `/theme-lab/` | Comparison page (noindex, not in the sitemap) |

Each browser remembers the last choice. `?theme=baseline` resets it.

### Locally, from the source ZIP
```bash
npm install
npm run dev            # http://localhost:3000/?theme=reddash
```

## How it is built (no site duplication)
- `app/themes.css` holds both options. Each re-maps the **same design tokens** that the whole site already uses: `--color-ink`, `--color-blue`, `--color-blue-deep`, `--color-on-accent`, `--color-offwhite`, the greys, and the overlay and glow tokens. Every section, hover, divider, menu, accordion and portfolio accent follows automatically.
- On top of the tokens, each option has a few **art-directed treatments**:
  - **Red:** a full-red closing band with an inverted black button, red raking light over the contact footage, square poster-style CTAs, and a red hover rule on the client wall.
  - **Midnight:** layered navy depth with a cool light source on dark sections, a cyan glow on primary CTAs, a navy and cyan contact grade, a cyan closing-band glow, and white client tiles in a steel frame.
- Switching only changes attributes on `<html>`, so React does not re-render. The video, GSAP animations and scroll position are untouched (verified by an automated test).
- Content, section order, video, images, client tiles, services, portfolio categories, titles, meta, H1/H2, URLs and internal links are unchanged. The SEO check is still 46 PASS and 0 FAIL.
- Performance is unchanged. Mobile Lighthouse scores 94–98 for all three versions, with CLS 0.

## Logo
The official logo is never replaced. Proposal recolours live in `public/brand/proposals/`, with `-PROPOSAL` in every filename and a README. They change only fill colours: the shapes and proportions are the original artwork.

## Accessibility notes
- **Red:** #E32629 is used for fills (white text on it is 4.59:1, AA).
  - Red text on black uses #F2383B, the same hue, at 4.9:1.
  - Red text on white or light grey uses #C8191C (5.8:1 / 5.0:1).
- **Midnight:** Electric Cyan is 9.46:1 on navy.
  - On ice white it is only 1.96:1, so light sections use Cyan Deep #0B6E92 (5.4–5.7:1).

## To adopt one option later
1. Move the chosen option's token values into the `@theme` block in `app/globals.css`, and its section treatments into the unscoped CSS.
2. Delete `app/themes.css`, `app/theme-lab/`, `components/ThemeSwitcher.tsx`, the `THEME_BOOT` script in `app/layout.tsx` and the proposal `<img>` tags in `components/ui/Logo.tsx`.
3. Update `content/brand.ts`, plus the logo files only if a logo change is approved.

Before any launch, either delete the comparison page or set `THEME_LAB=off`, which makes it return 404.
