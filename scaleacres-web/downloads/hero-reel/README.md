# ScaleAcres homepage hero, for approval

This folder covers the hero section only. No other homepage section changed, and nothing outside the homepage was touched. It is a noindex staging preview.

## Files

| File | What it is |
| --- | --- |
| `scaleacres-hero-reel-desktop-1920x1080.mp4` | The reel master: 1920 × 1080, 18 s, 30 fps, a seamless loop, no audio. |
| `scaleacres-hero-reel-mobile-1080x1920.mp4` | A separately composed 9:16 cut, not a crop of the desktop cut. |
| `hero-desktop-recording-1920x1080.mp4` | The hero recorded in the browser. It shows the full loop, the chapter indicator following the reel, CTA hover, pause and play, and the menu. |
| `hero-mobile-recording-390x844.mp4` | The same recording on a phone. |
| `scaleacres-hero-reel-storyboard.jpg` | The six chapters, with their start times. |
| `scaleacres-hero-reel-mobile-frames.jpg` | The same six moments in the portrait cut. |
| `scaleacres-hero-reel-poster-1920x1080.jpg` | The poster frame, which is also the loop frame. |
| `scaleacres-homepage-netlify-preview.zip` | A static export. Drag it into Netlify Drop. It sends `X-Robots-Tag: noindex`. |
| `scaleacres-homepage-source.zip` | The Next.js source. |

## The reel

The reel is original motion design built in code (`scripts/nd-hero-reel`). It uses 3D staging, camera moves and push-through transitions inspired by the quality of Orbix Studio's work. None of Orbix Studio's footage or designs are used.

| # | Chapter | Starts | What it shows |
| --- | --- | --- | --- |
| 01 | Brand identity | 0 s | The ScaleAcres stationery system on a dark studio table. |
| 02 | Real estate marketing | 3.1 s | Blue-hour architecture with genuine launch creatives. |
| 03 | Website design | 6.0 s | Genuine SID Realtech, Subata Realty and Imperial Sky sites on devices. |
| 04 | Performance marketing | 9.1 s | Genuine JBBR, Intech, TRG and SID campaign creatives. |
| 05 | Video production | 11.9 s | A carousel of ScaleAcres ad and social films. |
| 06 | ScaleAcres finale | 14.7 s | The mark and wordmark, resolving back to the opening frame. |

- No analytics numbers or campaign results appear.
- The architecture, studio and light-sweep backdrops are frames from ScaleAcres' existing AI concept films. They are labelled in the hero credit, and no new generation was run.

## Web delivery

- **Formats.**
  - Desktop: H.264 MP4, 3.9 MB, and VP9 WebM, 3.0 MB.
  - Phones: H.264 MP4, 3.3 MB, and VP9 WebM, 2.7 MB.
- **Loading.**
  - The reel loads after the page and is muted, inline and looped.
  - It pauses when the hero is off-screen.
  - The poster appears instantly.
  - Reduced-motion and Save-Data visitors keep the poster and can press play.
- **Measured.** First paint takes about 0.7 s on desktop and 0.6 s on mobile, with zero layout shift. All 63 homepage checks pass.

## Instagram reference

- `instagram.com/orbixstudiollc/reels` requires a login, and its API returned "require_login", so the reels could not be viewed.
- I used Orbix Studio's public YouTube channel instead (`@orbixstudiollc`, Shorts that mirror the reels). Video downloads were blocked by YouTube's bot check, so the study used published frame thumbnails from 10 Shorts.
