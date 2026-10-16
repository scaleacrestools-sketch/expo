# ScaleAcres brand colour comparison

**Status: exploration only. Nothing is approved or deployed.** The approved black-and-blue baseline stays the default, and the explorations are switched off on scaleacres.com.

All three options run on the complete existing website: hero, header, menu, client logos, portfolio, services and their videos, real estate, Creative Studio, process, case studies, insights, contact and footer. Each option re-maps the same design tokens and adds a few art-directed section treatments. Nothing else changes: content, section order, video, imagery, animations, SEO titles and meta, H1/H2, URLs and internal links are all untouched.

---

## How to preview

| File | What it is |
|---|---|
| `scaleacres-red-dash-preview.zip` | Full site, opens in **Option 1** |
| `scaleacres-midnight-electric-preview.zip` | Full site, opens in **Option 2** |
| `scaleacres-luxury-olive-preview.zip` | Full site, opens in **Option 3** |
| `scaleacres-3-themes-static-preview.zip` | Full site, opens in the approved baseline; switch to any option |
| `scaleacres-3-themes-source.zip` | Complete Next.js project |
| `scaleacres-3-themes-screenshots.zip` | Six full-page screenshots (desktop and mobile for each option) |

1. Unzip one preview ZIP. `index.html` is at the top level of the folder.
2. Drag the unzipped folder onto **https://app.netlify.com/drop**.
3. On the site, use the switcher bar at the bottom of the screen: **RED DASH INSPIRED | MIDNIGHT ELECTRIC | LUXURY OLIVE | Baseline**.
   - Switching is instant. The video keeps playing and nothing reloads.
   - **Logo: Official / Proposal** shows the recoloured logo proposal for the active option. Official is the default.
   - **Compare ↗** opens `/theme-lab/`, a side-by-side page with swatches, CTAs, logo treatments and contrast checks.
4. Direct links: `/?theme=reddash`, `/?theme=midnight`, `/?theme=olive`, `/?theme=baseline`. Add `&logo=proposal` to see the proposal logo.

---

## Option 1 — Red Dash Inspired

High-voltage creative-agency energy. Black and white throughout, with Creative Red as decisive punctuation: rules, numerals, service hover sweeps, square CTAs, red light over the contact footage, and one full-red closing band with an inverted black button.

| Role | Name | HEX |
|---|---|---|
| Dark grounds, header, menu, footer | Primary Black | `#101010` |
| CTAs, rules, hover sweeps, closing band | Creative Red | `#E32629` |
| Light sections, type on black and red | White | `#FFFFFF` |
| Alternate light sections, client wall | Light Grey | `#EDEDED` |
| *Support:* red text on white / grey | Red Deep | `#C8191C` |
| *Support:* red text on black (same hue) | Signal Red Text | `#F2383B` |

## Option 2 — Midnight Electric

International premium. Deep navy with a cool light source on dark sections, ice-white daylight sections, and Electric Cyan used as light rather than paint: glows on primary CTAs, cyan highlights, a navy and cyan contact grade.

| Role | Name | HEX |
|---|---|---|
| Dark grounds, header, menu | Midnight Navy | `#0A1421` |
| CTAs, highlights, glows on dark | Electric Cyan | `#36C8F5` |
| Light sections, type on navy | Ice White | `#F7F9FA` |
| Dividers, supporting text on navy | Steel Grey | `#AAB8C4` |
| *Support:* cyan text on light grounds | Cyan Deep | `#0B6E92` |
| *Support:* footer ground | Navy Abyss | `#060D17` |
| *Support:* body text on light | Slate | `#34495E` |

## Option 3 — Luxury Olive & Champagne

Quiet luxury for premium real estate. Deep olive grounds with warm low light, warm ivory daylight sections, and Champagne Gold as fine metal detailing: hairlines, numerals, square-cornered CTAs with a hairline inset, and a gold hairline over the closing band.

| Role | Name | HEX |
|---|---|---|
| Dark grounds, header, menu | Dark Olive | `#171C17` |
| CTAs, highlights, hairlines on dark | Champagne Gold | `#C7AB75` |
| Light sections, type on olive | Warm Ivory | `#F5F1E7` |
| Supporting text on olive, dividers | Soft Sage | `#879181` |
| *Support:* gold text on ivory | Antique Gold | `#7A6230` |
| *Support:* alternate light sections | Warm White | `#FBF9F4` |
| *Support:* footer ground | Olive Abyss | `#11150F` |

---

## Logo treatments

The **official logo is never replaced**. In every option the site shows the approved artwork by default. The recoloured versions below are **proposals only**: they live in `public/brand/proposals/` with `-PROPOSAL` in every filename, and the site tags them "Proposal" when they are switched on. Only fill colours change. Shapes, proportions and lettering are the original artwork.

| Option | On dark grounds (proposal) | On light grounds (proposal) | Official logo fit |
|---|---|---|---|
| 1 · Red | White wordmark; symbol and strapline in `#E32629` | `#101010` wordmark; red symbol | Blue symbol clashes with red; the option only resolves with a recoloured logo |
| 2 · Midnight | `#F7F9FA` wordmark; symbol and strapline in `#36C8F5` | `#0A1421` wordmark; official blue `#1CA6DC` symbol (cyan is too light on white) | Official logo works unchanged; same blue family |
| 3 · Olive | `#F5F1E7` wordmark; symbol and strapline in `#C7AB75` | `#171C17` wordmark; deeper gold `#9C8048` symbol (champagne is too light on ivory) | Cool blue sits apart from warm gold; works best with the champagne proposal |

---

## Contrast and accessibility (WCAG 2.2)

| Pair | Option 1 · Red | Option 2 · Midnight | Option 3 · Olive |
|---|---|---|---|
| Body text on dark | 16.25:1 AAA | 17.52:1 AAA | 15.33:1 AAA |
| Muted text on dark | 6.76:1 AA | 9.13:1 AAA | 5.27:1 AA |
| Accent text on dark | 4.90:1 AA (`#F2383B`) | 9.46:1 AAA | 7.83:1 AAA |
| Accent text on white | 5.81:1 AA (`#C8191C`) | 5.74:1 AA (`#0B6E92`) | 5.52:1 AA (`#7A6230`) |
| Accent text on alternate light | 4.97:1 AA | 5.43:1 AA | 5.15:1 AA |
| Button label on accent fill | 4.59:1 AA (white on red) | 9.46:1 AAA (navy on cyan) | 7.83:1 AAA (olive on gold) |
| Raw accent on white (never used for text) | 4.59:1 | 1.96:1 | 2.10:1 |

In all three options every text pairing used on the site passes AA. The last row shows why each option needs a deeper "support" shade of its accent for text on light grounds.

The preview builds score 94–98 on mobile Lighthouse performance in every option, with zero layout shift. Switching themes costs nothing at runtime: it changes one attribute, with no re-render and no extra downloads.

---

## Side by side

| | Option 1 · Red Dash Inspired | Option 2 · Midnight Electric | Option 3 · Luxury Olive |
|---|---|---|---|
| Personality | Loud, confident, creative-agency attitude | Calm authority: premium, international, technical | Quiet luxury: refined, warm, exclusive |
| Fit with the official logo | Needs a recoloured logo | Works unchanged | Best with the champagne proposal |
| Real estate audience | Red reads as urgency or offer in property ads | Trust, architecture and technology | Speaks directly to luxury developers and high-value buyers |
| Digital / growth positioning | Strong creative energy | Strongest: technology and performance | Weaker: reads as boutique hospitality |
| Distinctiveness | Close to the reference agency; risk of looking derivative | Original to ScaleAcres | Original, but common in luxury real estate itself |
| Photography and video | Strong with high-contrast black footage | Complements blue-hour architecture and the showreel grade | Flatters warm interiors; cooler blue-hour footage feels slightly off-tone |

---

## Recommendation: Option 2, Midnight Electric

1. **It keeps the logo you already own.** Electric Cyan sits beside the official blue symbol, so no logo change is needed. Options 1 and 3 each look resolved only with a recoloured logo, which is a brand change, not a website change.
2. **It is unmistakably ScaleAcres.** Option 1 is deliberately close to the Red Dash reference. For an agency whose product is originality, that resemblance is a reputational risk.
3. **It carries both halves of the business.** Navy and cyan say trust and architecture to property buyers, and technology and performance to digital clients. Option 3 is beautiful for luxury property but reads as a boutique real estate brand rather than a creative, digital and growth agency.
4. **It is the most accessible system.** Accent on dark scores 9.46:1. Red needs three shades to stay compliant, and champagne needs a separate antique gold on light grounds.

**Worth borrowing:** Option 1's bold full-bleed closing band, and Option 3's champagne hairlines for luxury-developer campaign pages.

---

## After you choose

Tell me which option, and whether you want the proposal logo or the official one. Making it permanent means:
1. Moving its token values into `app/globals.css`.
2. Removing the switcher, the comparison page and the proposal logo hooks.

The full checklist is in `docs/brand-color-exploration.md` in the source. Nothing goes to production without your approval.
