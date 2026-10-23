# Hero video: concept 01 (for approval)

Status: **proposal only.** Nothing is in the site yet, and other sections are untouched.

## Files

- **Download all videos** (ZIP, 18.8 MB): https://d2ol7oe51mr4n9.cloudfront.net/user_3CQanTnpSTSldAcnyg2IWvXN786/ea7cb280-93be-4d4e-aa10-2c7a42496390.zip
  - `hero-preview-desktop.mp4` and `hero-preview-mobile.mp4`: the film playing inside the current hero, with the proposed wordmark size and chapter indicator. Recorded in a real browser; nothing is in the site yet.
  - `hero-film-desktop.mp4/.webm` and `hero-film-mobile.mp4/.webm`: the film on its own.
  - `hero-film-storyboard.jpg`: the storyboard.
- **In this folder:**
  - `hero-film-storyboard.jpg`;
  - `hero-preview-desktop-frames.jpg` and `hero-preview-mobile-frames.jpg`: one frame per scene.

## Why the current background is weak

- **It says nothing about ScaleAcres.** An empty concrete corridor reads as "architecture mood", not marketing, branding, websites or video.
- **It's a single static frame.** There's no story and no motion apart from a slow zoom.
- **The black-and-white treatment flattens it.** The image ends up as a grey wash behind the type.
- **The giant wordmark dominates.** At full width it touches both gutters and crowds the bottom of the frame.

## The concept: "From project to pipeline"

A 15.4 s seamless loop that walks through what ScaleAcres does, in the same order a developer experiences it.

| # | Time | Scene | Footage | Source |
|---|---|---|---|---|
| 01 | 0.0–3.0 s | Real estate | Blue-hour residential tower, aerial push-in | ScaleAcres concept film (AI) |
| 02 | 3.0–5.2 s | Brand identity | Identity system on a dark studio table | ScaleAcres concept film (AI) |
| 03 | 5.2–7.8 s | Branding work | Ellington 86 brochure, brand guideline, hoarding | **Genuine:** SID Realtech, scaleacres.com |
| 04 | 7.8–10.6 s | Website design | SID Realtech site scrolling, with Subata and Imperial Sky behind | **Genuine:** scaleacres.com portfolio |
| 05 | 10.6–13.0 s | Performance marketing | Campaign data rising on a boardroom display | ScaleAcres concept film (AI) |
| 06 | 13.0–15.4 s | Video production | Cinema camera and edit suite, then fade to black and loop | ScaleAcres concept film (AI) |

## Transitions

- **Staircase wipes**, the same stepped motif as the hero's intro, so the film and the page feel like one system.
- **Alternating colours:** Brand Black columns, then Royal Blue rows.
- **Pace:** each wipe takes about 0.55 s.
- **Within each scene:** a slow push-in.

## Colour and light

- **Grade:** one grade across every shot, with deep Brand Black shadows, a slight cool push and a soft vignette.
- **Genuine-work scenes:** set on a Brand Black stage with a Royal Deep glow.
- **Palette:** no colours outside the ScaleAcres palette are added.

## Text overlay strategy

Readability is designed into the film, not just patched with gradients.

- **Text-safe zones:**
  - **Desktop:** the statement sits top left, the tagline top right and the wordmark along the bottom, so the genuine work is staged centre-right in the middle band.
  - **Mobile:** the text stacks in the lower half, so the work sits in the top half.
- **Gradients:**
  - **Left-to-right:** keeps the statement column dark.
  - **Bottom:** keeps the wordmark band dark.
- **Chapter indicator:** a new bottom-right label, synced to the film, names each scene (for example "04 / 06 · Website design · SID Realtech"). It marks the AI scenes as "Concept film", so concept footage is never presented as client work.

## Wordmark refinement

- **Desktop:** "ScaleAcres" shrinks from full width to about 74% of the content width, left-aligned, which frees the bottom-right corner for the chapter indicator.
- **Mobile:** the wordmark stays full width, with the chapter label above it.

## Assets used

- **Concept films:** four ScaleAcres films from Higgsfield (tower, identity, performance, production), 1920×1080 and 1080×1920.
- **Genuine work:** from scaleacres.com:
  - SID Realtech: Ellington 86 brochure, brand guideline and hoarding;
  - websites: SID Realtech, Subata Realty and Imperial Sky Realty.

Nothing was generated. The preview was edited with ffmpeg and Python, so no credits were used.

## Delivery once approved

- **Formats:**
  - **Desktop:** WebM (VP9), about 1.6 MB, plus an MP4 (H.264) fallback, about 4.5 MB.
  - **Mobile:** a portrait cut of each.
- **Poster:** a poster frame.
- **Loading:** the video loads after the page, so the headline stays the first paint.
- **Reduced motion:** the poster only.

## Limits of this preview

- **Genuine work resolution:** the branding images are 924 px wide and the website screenshots about 700 px. They are shown as cards, never full-bleed, so they stay sharp. Larger exports would allow bigger cards.
- **Concept footage:** four of the six scenes are AI concept films. A genuine drone shot of a client project and real campaign or production footage would strengthen scenes 01, 05 and 06.
- **What's missing to replace them:**
  - **Scene 01:** a real project aerial in 4K.
  - **Scene 05:** screen recordings of real ad dashboards, with client permission.
  - **Scene 06:** behind-the-scenes footage from a ScaleAcres shoot.
