# Assetz website: editable SVG assets

Every file here is a true vector SVG: paths, shapes and live `<text>`. None of them embeds a PNG or JPG. Open them in Figma, Illustrator, Inkscape, Affinity Designer or any code editor.

All colours are the approved palette from the client's Hostinger reference site:

| Token | Hex | Use |
|---|---|---|
| brand | `#AA7761` | buttons, accents, icons |
| brand-dark | `#2C191F` | headings, dark bands, icon strokes |
| brand-light | `#D4A48C` | accents on dark backgrounds |
| white | `#FFFFFF` | |
| black | `#000000` | |
| whatsapp | `#25D366` | WhatsApp button only |

## Folders

| Folder | Contents |
|---|---|
| `logos/` | The Assetz wordmark and the "Assetz · Life Reimagined" lockup in brand-dark, brand, white and black. They are built from the vector lockup published on assetzproperty.com and recoloured; the paths are unchanged. The website uses `assetz-wordmark-brand-dark.svg` and `assetz-wordmark-white.svg`. |
| `icons/` | All 30 interface icons used on the site, on a 24 px grid (48 px for highlight icons), as editable 1.8 px strokes. Social icons are filled. `_sprite.svg` holds every icon as a `<symbol>` for `<svg><use href="_sprite.svg#icon-arrow"/></svg>`. |
| `ui/` | Website UI pieces: finder pill and search button, primary and outline pill buttons, slider arrows (normal and hover), collection-slide arrow, video play/pause, WhatsApp button, floating enquiry button, FAQ plus/minus, checklist chip, highlight number badge, thank-you check. |
| `graphics/` | Section graphics: project heading underline bar, eyebrow with leading rule, Homebuyer's Guide cover, EMI ring chart, counter divider, hero legibility gradient, location pin. |
| `palette/` | Colour swatch sheet. |

## Editing notes

- **Change a colour:** search for the hex value, e.g. `#AA7761`, and replace it.
- **Icons** use `stroke="#2C191F"`. In code, set `stroke="currentColor"` so the icon follows the text colour.
- **Text in the UI graphics** is live `<text>` in Figtree, Libre Caslon Display or Plus Jakarta Sans. Install those fonts from Google Fonts, or from `website/assets/fonts/`, to see them as designed. Convert text to outlines in your editor before handing files to print.
- **Logo files** are Assetz trademarks. Use them only as Assetz's brand guidelines allow.
- **Regenerate:** `python3 scripts/make-svg-assets.py`, run from `website/`. Icon geometry comes from `src/templates/helpers.js`, so the SVG set and the website stay in sync.

## Original design source files

No Figma, Illustrator or Sketch source files exist for this website: it was designed directly in code. The CSS (`src/css/styles.css`) and these SVGs are the design source. The logos derive from the vector lockup published on assetzproperty.com. The project renders, floor plans and maps are raster images published by the developer, so they are not part of this vector set.
