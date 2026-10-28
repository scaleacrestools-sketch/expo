# ScaleAcres homepage: complete, Hero to Footer

All 13 sections are integrated in one homepage. Sections 1–7 are as approved. Sections 8–13 reuse the components already built for the earlier combined draft (`NdVideos`, `NdBrands`, `NdWork`, `NdContact`, `NdFooter`), updated to match the reference, with a new FAQ.

No internal pages, live WordPress, hosting or DNS were touched. The preview is noindexed.

## Files

| File | What it is |
| --- | --- |
| `homepage-complete-desktop-1920x1080.mp4` | A real browser recording of all 13 sections, 2 min 29 s. |
| `homepage-complete-mobile-390x844.mp4` | A real browser recording on a phone viewport, 2 min 7 s. |
| `homepage-full-desktop.jpg` | Full-page screenshot at 1440 px wide. |
| `homepage-full-mobile.jpg` | Full-page screenshot at 390 px wide. |
| `scaleacres-homepage-netlify-preview.zip` | A working static preview. Drag it into Netlify Drop. |
| `scaleacres-homepage-source.zip` | The complete Next.js source. |

## Section order

1. Hero
2. We build real estate brands people remember
3. Who we are
4. Our services
5. Our work / Creative showcase
6. Website design
7. Client success stories
8. **Real estate videos that drive growth** (Brand Black)
9. **We don't create brands. We create market leaders.** (Mist)
10. **Selected work** (Brand Black)
11. **FAQ** (white)
12. **Let's talk** (Brand Black, with a form)
13. **Footer** (the wordmark spans the black-to-white transition)

## No profile slides on the homepage

The built homepage now references no profile slide images. Everything that used one was replaced with an individual piece of artwork:

| Where | Change |
| --- | --- |
| Hero reel | The hoarding shot used the slide image with its "Hording mockups" label. The 18 s reel was re-rendered (both formats) with the clean crop of just the hoarding. |
| Creative statement | The drifting collage had two brochure slides. They are replaced by the JBBR brand kit and the Ottimo billboard. |
| Who we are | The inline work chip that used a slide now uses the TRG creative. |
| Branding | Both large visuals were slides. They are replaced by two boards: the Intech identity system, and an applications board composing six individual pieces (TRG bag, Ottimo signage, Karyan facade and truck, JBBR brand kit, Aarize stationery). The index lists eight pieces of real work. |

## The new sections

**08 Videos**
- Turned Brand Black, with "growth." in Sky.
- The Ad / Social Media / AI tabs show genuine ScaleAcres YouTube videos with their own YouTube thumbnails.
- Nothing autoplays. A video plays in a dialog only when chosen.
- AI videos carry an "AI" label.

**09 Branding**
- The headline and cursor-following preview index are kept.
- Visuals: see the table above.

**10 Selected work** (7 projects, none empty):

| Project | What's shown |
| --- | --- |
| SID Realtech | Ellington 86 launch creative |
| Intech Developers | "Creates Value" creative |
| Subata Realty | Website |
| Rhomes Miraabilis | Website, newly captured from miraabilis.com. The profile credits this site to ScaleAcres. |
| JBBR Group | "We don't just hand over keys" creative |
| TRG | "15 Years of Income" creative |
| Finsckool | Website |

- The creatives are the original 1350 px files from scaleacres.com.
- Websites are shown in a browser frame with their real domain.
- Images unmask as they arrive and settle from a slight zoom. The right column drifts.

**11 FAQ**
- Eight questions written only from approved ScaleAcres information: the service list, company facts and the four-stage process.
- Topics: real estate marketing, websites, branding and creative, Meta and Google Ads, SEO, video, working with builders, developers and channel partners, and onboarding.
- No awards, guarantees or figures.
- The accordion is fully keyboard-operable, and the FAQ data is also published to search engines.

**12 Let's talk**
- Phone, email, studio address and offices come from `content/site.ts`.
- A new enquiry form reuses the existing validation and anti-spam setup. It checks fields in the browser and again on the server.

**13 Footer**
- Kept as approved: the wordmark, logo, description, navigation, services, contact, social links, GST number and legal links.

## Checks

- **Build.** Typecheck, lint and the static export all pass.
- **Layout.** No horizontal overflow at 1440, 768 or 390 px. No console errors, failed requests or broken images.
- **Links.** All 24 internal links resolve to pages in the build.
- **Speed.** The page first appears in 0.80 s on desktop and 0.78 s on mobile, with zero layout shift. All below-the-fold media is lazy-loaded, and videos load only on play.

## Remaining blockers

1. **Contact form delivery.** On the real Netlify deployment, set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`, or `CONTACT_WEBHOOK_URL`. Until then the form says plainly that it isn't connected and points to scaleacres@gmail.com. The static preview says sending is switched off. It never shows a fake success.
2. **Rhomes and SeaBreeze Villas covers.** These still need their original post and reel exports or print files. The profile versions are only 614 px wide.
3. **Testimonial captions.** These need transcripts approved by the clients.
4. **Jina Cosmetics.** Its website URL is unverified, so it is listed without a link.
