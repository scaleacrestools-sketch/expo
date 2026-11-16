# ScaleAcres homepage v5

This homepage keeps the reference site's section flow and takes the type and motion style from the creator-agency screen recording. It uses the ScaleAcres colours (Brand Black, Royal, Royal Deep, Sky, White and Mist) and only genuine ScaleAcres content.

## Files

| File | What it is |
| --- | --- |
| `scaleacres-homepage-v5-1440x900.mp4` | Homepage walkthrough video, 52 s, desktop 1440 × 900 |
| `scaleacres-homepage-v5-editable.svg` | The whole homepage as one editable SVG (1440 × 14,300) |
| `scaleacres-homepage-v5-preview-part1.jpg`, `-part2.jpg` | How the SVG renders, top and bottom halves |
| `services-phone-visual-1800x1200.mp4` / `.webm` / `-poster.jpg` | The services visual: the ScaleAcres reel in a phone, ringed by floating UI cards and platform chips. It is an 18 s seamless loop. |
| `fonts/` | Outfit (variable font) and Playfair Display SemiBold Italic |

The live page is at `design/home-v5/index.html` in the repository. Open it in a browser. Adding `?static=1` shows every animation in its finished state.

## Sections, in order

1. **Hero:** the ScaleAcres motion reel plays full-screen behind "Built to Stand Out. Designed to *Scale.*" A chapter bar follows the reel.
2. **Trusted by:** a moving strip of client logos.
3. **Who we are:** the statement lights up word by word as you scroll, followed by studios, markets and focus.
4. **Services:** the heading "Our Full-Service *Real Estate Marketing* Solutions", the phone video, and an accordion of the 8 services.
5. **Ideas that *stop the scroll*:** a banner over ScaleAcres film posters.
6. **Creative showcase:** JBBR Group, TRG The Mall, SID Realtech (Ellington 86), Intech Developers, Yugen Infra, One Goa, Subata Realty and Finsckool.
7. **How we work:** Discovery, Strategy, Creation and Growth, shown with studio photos and real work.
8. **Clients:** the 20 client logos published on scaleacres.com.
9. **Studios and testimonials:** 3 studios (Delhi, Agra, Bangalore), "Eight services, one accountable team", and the four client video testimonials (Let's Movin, NRG India, IPD, TimesPro).
10. **CTA:** "Let's *work / create / build / grow / launch* together.", with the email address and phone number.
11. **FAQ:** the four questions and answers from scaleacres.com.
12. **Footer:** a large faded ScaleAcres wordmark, the logo, quick links, the 8 services, the address, email, phones and social links.

The header, side rail and "Get a quote" button stay fixed on screen.

## Fonts
- **Outfit** for all text. This is the ScaleAcres brand font, and it matches the recording.
- **Playfair Display Italic** for the accent words, such as *Scale.*, *Questions* and *showcase*.

Install both from `fonts/` before editing the SVG. Figma already has them.

## SVG layers
The SVG contains:
- **264 live text layers;**
- **55 image layers,** one per photo and logo, each separately replaceable;
- **vector shapes, icons and the ScaleAcres logo.**

Layer groups follow the sections above: `01-hero` … `12-footer`, plus `header`, `side-rail` and `get-a-quote-button`.

The videos are captured as still frames:
- the reel at 4 s;
- the phone visual at 4 s.

## Waiting on you
- **Channel-partner list and logos:** a new section will be added for these.
- **Project list:** this will replace or extend the 8 showcase projects.
- **Client list:** this will replace or extend the 20 logos.
