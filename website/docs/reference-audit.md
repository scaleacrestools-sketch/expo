# Reference audit (21 Nov 2026)

Rendered with Playwright at 1440×900 and 390×844. Screenshots are in the session's audit folder; measurements below come from computed styles.

## Colour palette (client's Hostinger reference site)

Extracted from the reference site's compiled Tailwind stylesheet (`--color-*` tokens). No other colours are used anywhere on the site; tints are these colours at reduced opacity, exactly as the reference does.

| CSS variable | Hex | Reference token | Used for |
|---|---|---|---|
| `--brand` | `#AA7761` | `brand`, `sand` | buttons, eyebrows, icons, links, active states, progress |
| `--brand-dark` | `#2C191F` | `brand-dark`, `espresso`, `ink` | headings, text, dark bands, hover state of buttons, award cards |
| `--brand-light` | `#D4A48C` | list-icon colour | accents on dark backgrounds |
| `--white` | `#FFFFFF` | `cream`, `ivory` | page background, text on dark |
| `--black` | `#000000` | `stone` | body text at 55–80 % opacity, counters |
| `--whatsapp` | `#25D366` | WhatsApp button | WhatsApp only |
| `--brand-10` … `--brand-35` | brand mixed with white at 10–35 % | `bg-brand/10`, `border-brand/25` | light bands, form fields, borders |

Hover states follow the reference: brand → brand-dark backgrounds, brand text and borders on links and outline buttons.

The earlier monochrome/slate palette (`#181818`, `#1C1C1C`, `#2E2E2E`, `#94AAAE` and greys) has been removed.

## M3M homepage (m3mindia.com)

| Element | Measurement |
|---|---|
| Container | 1224 px, 12 px padding → content x 120–1320 |
| Header | transparent over hero, 95 px tall; nav 12 px uppercase, letter-spacing 2.2 px |
| Hero | 100 vh video; centred serif tagline; four 280×56 pills (radius 30, 1 px white border) + 180×56 search pill |
| Section rhythm | 70 px top/bottom padding; bands alternate `#F9F9F9` / white |
| Display type | Austin News Headline Light: h1 43.2/50, h2 40/48, section h4 48/57.6 |
| Body type | Euclid Circular A 16/24 weight 500 |
| Intro | two columns: heading left, 690 px paragraph right, pill button 221×45 radius 30 |
| News cards | 386×242, padding 22, title 16/24 700, body 16/24.8 |
| Counters | 5 columns, 1 px vertical dividers, number 48 px 500 |
| Featured slider | 975×515 slide starting at x = 60, next slide peeking, logo + category + location + circular arrow overlay, progress bar |
| Verticals | full-bleed accordion 606 px tall, labels 14.4 px ls 3 px, inactive panels greyscale |
| Buttons | primary pill padding 10×20 radius 30; outline pill 1 px, 14 px 500 ls .5 px |
| Footer | white, three columns divided by 1 px rules, 24 px column headings, 14 px links; bottom bar `#F9F9F9` |
| Mobile | stacked finder pills, single-column intro, counters stacked with rules, slider full width, accordion stacked |

Free substitutes chosen by side-by-side render test: Libre Caslon Display (Austin News Headline Light), Figtree (Euclid Circular A).

## 100acress Godrej Verano (project template)

| Element | Measurement |
|---|---|
| Font | Plus Jakarta Sans throughout |
| Header | 57 px solid bar; pill group of section anchors (9 px 700 uppercase); brochure pill, WhatsApp pill, phone 18 px 700 |
| Hero | full-bleed image 900 px; left info card 384 px (status, name 26 px, location, 2×2 facts, starting price); right enquiry card 384 px, radius 12 |
| Form | labels 9 px 700 uppercase; inputs 38 px, 14 px, radius 4, 1 px light border; consent 9 px; submit 36 px uppercase 12 px 700 |
| Section heads | eyebrow 10 px 700 ls 4 px; h2 48/48 400 ls −2.4 px; 96×3 underline bar |
| Overview | two columns: 576 px text (16/26 justified) + 592×333 image radius 8 |
| Highlights | 3-column cards, radius 12, numbered circle badge, 2-line clamp, "Read more" |
| Price table | 1280 px, header row 10 px uppercase with icons; rows 65 px; type icon chip; price 20 px 700 |
| Features | image left, checklist right |
| Amenities | dark band, 3-column tiles 416×64 with icon |
| Gallery | 2 + 3 image mosaic, radius 6 |
| Floor plans | carousel showing two plans, counter, expand/download, thumbnail strip |
| Location | map left (856 px) + "Nearby Essentials" card right |
| Contact band | dark band, large phone number, inline name/phone/callback form |
| Developer | logo tile + description + "More projects" carousel |
| Comparison | attribute table vs other projects + EMI calculator |
| FAQ | full-width rows, 18 px questions, thin plus icons |
| Disclaimer | dark band, then centred uppercase legal links |
