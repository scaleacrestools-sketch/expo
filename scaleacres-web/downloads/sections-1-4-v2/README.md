# ScaleAcres homepage, Sections 1 to 4 (update 2)

This update changes two things:
- Our Services now uses light editorial images.
- Who We Are has been tightened.

The Hero, the Creative statement, the animation style, the typography and the blue accents are unchanged. No internal pages, WordPress, DNS or hosting were touched, and the preview is set to noindex.

## Files

| File | What it is |
| --- | --- |
| `sections-1-4-desktop-1920x1080.mp4` | Real browser recording of all four sections, about 48 s. |
| `sections-1-4-mobile-390x844.mp4` | The same recording on a phone, about 43 s. |
| `screenshots/` | 7 desktop and 7 mobile screenshots. |
| `service-images/` | The eight service images at full size (2400 × 1600). |
| `scaleacres-homepage-netlify-preview.zip` | A working preview. Drag it into Netlify Drop. |
| `scaleacres-homepage-source.zip` | The Next.js source. |

## Our Services: light editorial images

Each card's dark motion loop is replaced by one designed still on a white base, with soft charcoal shadows. Each still is a 3:2 WebP at 800, 1200 and 1800 px, about 1.7 MB for all sizes of all eight together. Each image settles from a slight zoom as its card arrives.

| # | Service | What the image shows |
| --- | --- | --- |
| 01 | Website Design & Development | SID Realtech on a laptop, the Subata mobile site, and full-page sheets of Subata, Imperial Sky and Aevora |
| 02 | SEO | Search Console growth charts with a floating card of first-page rankings |
| 03 | Performance Marketing | Google search ads, typeset cost-per-lead results, the Rhomes influencer reels and a TRG creative |
| 04 | Branding & Creative Design | A collage of identity work for Ottimo, Karyan, Aarize, TRG and JBBR |
| 05 | Social Media Marketing | Feeds for JBBR and SID with JBBR, SID and Intech posts on phones |
| 06 | Video & Creative Production | ScaleAcres ad-film reels |
| 07 | Ecommerce Solutions | The MW&B store on a laptop and a phone |
| 08 | Custom Applications & Software | The Finsckool platform on a laptop and a phone |

## How the company profile was used

- **No slides on the site.** No full slide, slide background, heading or page number appears on the site.
- **Resolution.** Each profile page is a single 614 × 345 px image. I cut out individual pieces only: the identity work, the social feeds and the influencer reels.
- **Upscaling.** The cut pieces were upscaled 4× with Real-ESRGAN, running locally with no Higgsfield credits. Each is shown no larger than it can hold.
- **Results.** The cost-per-lead results were re-typeset as clean text instead of cropped.
- **Mismatched percentages.** Two percentages on the profile slides don't match their own figures:
  - Sea Breeze Villas, ₹478 → ₹298, is 38% lower, but the slide says 50%.
  - Aarize, ₹666 → ₹320, is 52% lower, but its badge says 38%.

  The site shows only the before → after values. The deck may need correcting.
- **High-resolution sources still preferred.** Website, SEO, ads, video and ecommerce visuals use the high-resolution captures and screenshots from scaleacres.com, since those are sharper than the profile.

## Who We Are: tighter layout

- **Left column.** The label and the Studios, Markets and Focus facts now sit beside the statement instead of leaving empty space.
- **Second row.**
  - Two genuine ScaleAcres studio photographs, of the team and of leadership at work, from scaleacres.com. They reveal like the other images, and the larger one drifts slightly as you scroll.
  - The introduction, with a "What we do" list of four disciplines and the links.
  - The six-site portfolio collage.
- **Spacing.** The section padding is reduced. The animations are the same as before: the grid lines draw down, the words fill in with the blue emphasis, and the work chips widen.

## Checks

- **Speed.** The page first appears in 0.64 s on desktop and 0.61 s on mobile, with zero layout shift.
- **Layout.** There is no horizontal scrolling at 1440, 768 or 390 px, and no console errors.
- **Reduced motion.** The reel stays paused, nothing is pinned, and every section shows in full.
