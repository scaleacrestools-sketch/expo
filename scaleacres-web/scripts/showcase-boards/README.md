# Client work showcase boards

There is one 1600 × 1000 presentation board per client. Each board pairs two things:
- the client's official project render, taken from their own website;
- ScaleAcres' own creatives for that client, such as reels, social posts, hoardings, websites, brand kits and print.

Design (ScaleAcres Brand Guidelines v1.0):
- **Ground:** Brand Black.
- **Render grade:** cool and clean, with deep black shading.
- **Accents:** Sky, and a short gradient rule above the kicker.
- **Type:** the site's type (Clash Display + Satoshi), as requested.

Files:
- `board.html`: the composer. Each config is passed as JSON in the URL hash.
- `boards.json`: one config per client (background, creatives, text).
- `board.mjs`: renders every board, or only the ones named, e.g. `node board.mjs sid,dtc`.
- `sources/<client>.json`: the official website, Instagram handle and source URL of every downloaded render.

Backgrounds:
| Client | Background |
| --- | --- |
| SeaBreeze | La Wisteria facade |
| SID Realtech | Ellington 86 at dusk |
| Aarize | Tessoro entrance plaza |
| TRG | TRG The Mall at dusk |
| JBBR | Krystal at night |
| Soham Group | Pravya rooftop pool |
| DTC | Sojon at dusk |
| Bhatia | Auriga 9 elevation |
| Yugen | La Mandre villas at dusk |
| Intech | none: it has no official website, so its board uses ScaleAcres' Intech identity board as the background |

The ScaleAcres creatives come from `public/images/nd/…`, the Drive reels (Pravya, Sojon, Auriga 9, La Wisteria, Kanvas) and the Aarize ad film (Vimeo). Output goes to `design/home-v8/assets/img/sc-*-1600.webp`.
