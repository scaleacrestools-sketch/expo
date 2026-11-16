# Reference homepage: editable SVG (reddashmedia.com)

`reddashmedia-home-editable.svg` is the full homepage of reddashmedia.com as one editable vector file. It is 1440 px wide (the desktop layout) and 12,559 px tall. It opens in Figma, Illustrator, Inkscape or Affinity Designer.

## What's editable

| Layer type | Count | How to edit |
| --- | --- | --- |
| Text | 287 lines | Live text: retype it, restyle it or move it |
| Images | 59 layers | Each photo, logo and client logo is its own image layer. Replace it with your own image. |
| Shapes | Backgrounds, cards, buttons, rules, borders | Vector shapes: change colour, size or corner radius |
| Icons | Menu, social icons, arrows, the CTA cable and stars | Vector |

Layers are grouped by section, in page order:
1. `01-hero`
2. `02-intro-statement`
3. `03-services`
4. `04-ideas-banner`
5. `05-creative-showcase`
6. `06-how-we-work`
7. `07-clients`
8. `08-team-and-chat-cards`
9. `09-cta-lets-work-together`
10. `10-footer`

On top of these sit `header-logo-and-menu`, `side-rail` and `get-a-quote-button`. Inside each group, images are named `image-…` and text layers carry their opening words.

## Fonts
Install these before opening, or text falls back to a default font. All are free Google Fonts.
- **Anton** for headlines. It is in `fonts/`.
- **Chivo** for body text. It is in `fonts/` as a variable font with weights 300–700.
- **IBM Plex Mono** for the small labels. The live site uses the system monospace font, so IBM Plex Mono is the closest free match. Get it from Google Fonts.

Figma already has all three, so nothing needs installing there.

## How the live page was flattened
The live homepage is scroll-animated, so I flattened it into one static layout:
- **Hero:** the 9,000 px scroll film is shown as a single frame, the stadium shot with "A Leading Digital Marketing Agency in Delhi" and "Every one of them needs to be seen."
- **Reveals:** every scroll reveal is shown finished. The intro paragraph is fully lit, and the CTA shows "Let's **Work** Together."
- **Sticky sections:** the Strategy, Execution and Growth panels are laid out one after another instead of pinned.
- **Accordions:** these show their default state, with the first item open.
- **Fixed chrome:** the header, side rail and "Get a quote" button sit in the first screen.

`reddashmedia-home-preview.jpg` shows how the SVG renders.

## Before you use it
The Red Dash Media logo, photos, client logos and copy in this file belong to Red Dash Media. They are only placeholders for layout. Replace them all with ScaleAcres work, logo and copy.
