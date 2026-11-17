# ScaleAcres homepage v8

The full homepage with the new hero (white form) and Clash Display + Satoshi type.

| File | What it is |
| --- | --- |
| `scaleacres-homepage-v8-1440x900.mp4` | Full homepage walkthrough, about 57 s |
| `scaleacres-homepage-v8-full-part1.jpg` / `-part2.jpg` | The whole page at 1440 px wide, top and bottom halves |
| `hero-v8-white-form-1440x900.mp4` / `-phone.mp4` | The hero on desktop and on a phone |
| `hero-v8-white-form-preview.jpg` | A still of the hero |
| `hero-ai-film-wall-1920x1080.mp4` | The background film on its own: a 48 s seamless loop |

The page is `design/home-v8/index.html`. The white form is the default; `?form=dark` shows the dark glass form.

## Type (option 3, approved)
- **Clash Display** for every headline.
- **Satoshi** for text, buttons and the form.
- Both come from Fontshare under the ITF Free Font License, which allows commercial use.
- The text is unchanged. The sizes are re-tuned for the new type, and the hero headline sits on three lines: "Real Estate Marketing / That Builds / Real Demand."
- Highlighted words use colour instead of the old italic serif: Royal on light sections, Sky on dark ones.

## Services section (heading animation in the Red Dash Media style)
- **Left column:** text only: "What we do", the headline and the description, with no video. It stays pinned while the services list scrolls beside it.
- **Scroll motion:** the headline rises line by line out of its mask, then the description slides up and sharpens from a soft blur. The motion follows the scroll position and runs in reverse when you scroll back up.
- **Right column:** the services list is unchanged, with the same eight click-to-open items.
- **Text:** unchanged.

## Client work showcase (custom boards, ScaleAcres Brand Guidelines v1.0)
Every client card is a custom 1600 × 1000 board. Each board pairs:
- the client's official project render, researched from their own website;
- the real ScaleAcres creatives for that client: reels in phones, social posts, hoardings, websites in a browser frame, brand kits and print.

Design (Brand Guidelines v1.0):
- **Ground:** Brand Black (#0B0D0D).
- **Render grade:** cool and clean, with deep black shading.
- **Accents:** Sky for the kicker, and a short gradient rule above it.
- **Type:** the site's existing type; the fonts are unchanged, as requested.

| Client | Project render (official) | ScaleAcres work shown |
| --- | --- | --- |
| SeaBreeze Villas | La Wisteria facade | Roll-up and hoarding print, two La Wisteria reels |
| SID Realtech | Ellington 86 at dusk | Website, "Coming soon" post, hoarding |
| Aarize | The Tessoro entrance plaza | Brand identity and stationery, Tessoro ad |
| Intech Developers | No official site found | Identity board, website, "Creates Value" post |
| TRG The Mall | Mall at dusk | Launch event gate, investor ad |
| JBBR Group | Krystal at night | Brand kit, campaign post, Kanvas reel |
| Sohom Estate (Soham Group) | Pravya rooftop pool | Three Pravya launch reels |
| DTC Group | Sojon at dusk | Three Sojon AI ad film frames |
| Bhatia Group | Auriga 9 tower elevation | Three Auriga 9 launch ads |
| Yugen Infra | La Mandre villas at dusk | Website and reels |

The "Ideas that stop the scroll" banner and the card shadows now use Brand Black shading instead of the blue tint.

The sources of all renders are listed in `scripts/showcase-boards/sources/`.

## "Ideas that stop the scroll" banner
The banner recreates the reference composition:
- a billboard on the left;
- an elevated metro with a train on the right;
- a busy multi-lane road with evening traffic;
- a navy-to-orange dusk sky.

The billboard carries a ScaleAcres site hoarding: the white logo on the signature gradient with "Real estate marketing. Reimagined.", following the guidelines' site-hoarding layout in the site's fonts. Deep Brand Black shading keeps the existing headline and copy clear, and a slow push-in adds motion. The background was generated in Higgsfield, which you approved for this banner; this was the only image generated. The hoarding template is `scripts/showcase-boards/ideas-hoarding.html`.

## "From a plan, to a brand journey" images
These are three custom cinematic visuals at 1210 × 1100 (the section's 1.1:1 ratio). Each is built from ScaleAcres' own AI film library, with no new generation, and finished with brand overlays: Brand Black vignette, Sky highlights and the site fonts. The section's layout and text are unchanged.
- **Strategy:** a JBBR project masterplan render with audience-targeting rings and planning markers (market research, buyer persona, catchment, price band).
- **Execution:** a cinema camera rig at night, with the real La Wisteria ad film by ScaleAcres playing on the edit monitor. Tags: ad films, reels and social, media buying.
- **Growth:** glowing brand "rising bars" over a live performance dashboard. Tags: qualified leads, cost per lead, site visits, ROI.

The composer is `scripts/showcase-boards/journey.html`.

## Content updates
- **Who we are:**
  - Offices: Agra · Delhi
  - Markets: Pan-India · UAE · Australia
  - Focus: Real estate developers and channel partners
- **Services:** "Video & Creative Production" and "Ecommerce Solutions" are removed. Six services remain, in the services list and the footer. The side rail no longer lists Video and Ecommerce.
- **Offices card:** "02 offices, Agra and Delhi, one team". The services card now reads "Six services, one accountable team".

## Hero
- **Copy on the left:**
  - the headline;
  - the paragraph;
  - three service ticks;
  - "Start a Project" and "See Our Work";
  - "250+ Projects worked on".
- **Form on the right:** a larger white card with name, phone, service, "Get a call back" and a one-line consent note.
- **Video:** the background is dimmed and shadowed, so the copy and the form stand out.
- **Removed from the hero:** the platform icons, the client logos, "75+ brands & projects" and "3 studios across India". The "Our studios" section is unchanged.

## Background videos
The wall has 30 tiles.
- **20 from the "Builders AI Videos" Drive folder:**
  - Auriga 9
  - DTC Sojon
  - Kanvas
  - Pravya
  - La Wisteria / Sea Breeze
  - SkyByte (three films)
  - JBBR Krystal
  - JBBR warehouse
- **10 ScaleAcres AI films:**
  - the JBBR Kanvas gate and township;
  - the JBBR warehouse;
  - the tech data film;
  - an AI tower render.

Every reel is cropped clear of captions and logos, and no people appear. "SkyByte Developers 1 min" is a logo reveal and is not used. The page loads a 1280 × 720 version of about 5 MB.

## Brand colours (Brand Guidelines v1.0)
- **Buttons:** Royal, with Royal Deep on hover.
- **Accent text:** Sky on dark, Royal on white.
- **Neutrals:** Brand Black, Silver, Grey-soft, Steel, Line and Mist.
- **Removed:** the purple, off-brand blue and red accents.
