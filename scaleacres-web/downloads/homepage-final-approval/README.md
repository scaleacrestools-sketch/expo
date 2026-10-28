# ScaleAcres homepage: final approval version

This is the complete homepage, Hero to Footer, in the approved order and design. No internal pages, live WordPress, hosting or DNS were touched, and the preview is noindexed.

## Files

| File | What it is |
| --- | --- |
| `scaleacres-homepage-desktop-1920x1080.mp4` | A real browser recording of the whole homepage with its animations and interactions, 2 min 30 s. |
| `scaleacres-homepage-mobile-390x844.mp4` | The same on a phone viewport, 2 min 7 s. |
| `scaleacres-homepage-full-desktop.jpg` | Full-page screenshot at 1440 px wide. |
| `scaleacres-homepage-full-mobile.jpg` | Full-page screenshot at 390 px wide. |
| `scaleacres-homepage-netlify-preview.zip` | A working static preview. Drag it into Netlify Drop. |
| `scaleacres-homepage-source.zip` | The complete Next.js source. |

## What changed in this round: the footer

The footer is now Brand Black (`#0B0D0D`) from top to bottom, including the copyright bar, with no white areas anywhere.

- **Wordmark.** The large "ScaleAcres" wordmark is now a subtle charcoal gradient that blends into the black.
- **Logo and text.** The logo is the official reversed version for dark backgrounds. Text is white and light grey.
- **Accents.** Icons, links and hover states use Royal and Sky.
- **Columns.** The four columns now line up with the page's column rules. Before, the rules cut through the Navigation links. The columns are:
  1. Brand, with the social links
  2. Navigation
  3. Services
  4. Contact

Nothing else was redesigned. Animations, layouts and media are as approved.

## Final QA

| Check | Result |
| --- | --- |
| Build | Typecheck, lint and the static export all pass. |
| Section order | Hero → Creative statement → Who we are → Our services → Creative showcase → Website design → Client success stories → Real estate videos → Market leaders → Selected work → FAQ → Let's talk → Footer, at 1440, 768 and 390 px. |
| Overflow and clipping | None at 1920, 1440, 1024, 768 or 390 px. |
| Console | No errors, no failed requests, no broken images. All videos load. |
| Links | All 24 internal links resolve. The external links are ScaleAcres' Instagram, Facebook and LinkedIn, plus five live client sites. |
| Menu | Opens with 18 links, and Escape closes it. Checked on desktop, tablet and mobile. |
| Interactive elements | Creative showcase previews, the website "Visit live site" links, the testimonial player, the video tabs and player, the branding index preview, the FAQ accordion, and form validation. |
| Speed | The page first appears in 0.82 s on desktop and 0.76 s on mobile, with zero layout shift. Media below the fold is lazy-loaded, and videos load only when played. |
| Contact details | Phone, email, address, GST number and social links match `content/site.ts` and the live footer. |
| Internal pages | Unchanged. Only homepage files were edited, and the homepage styles are scoped to `.nd`. About, Services, Contact and Our Work all load with no errors. |
| Media | No full profile slides anywhere on the homepage. All work shown is genuine ScaleAcres work, and AI videos are labelled. |

## Open items (unchanged)

1. **Contact form delivery.** On the Netlify deployment, set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`, or `CONTACT_WEBHOOK_URL`. Until then the form says plainly that it isn't connected and points to scaleacres@gmail.com.
2. **Rhomes and SeaBreeze Villas covers.** These need original files and are not shown on the homepage.
3. **Testimonial captions.** These need transcripts approved by the clients.
4. **Jina Cosmetics.** Its website URL is unverified, so it is listed without a link.
