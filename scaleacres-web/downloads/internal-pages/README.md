# ScaleAcres — Internal pages redesign (design preview)

Every internal page now uses the approved homepage design system:
- Outfit type and large editorial headings
- NdHeader (logo left, Menu right)
- The full Brand Black footer
- nd reveal animations
- The official palette

Existing page content is kept as it is. This is a design preview, so no SEO work was done.

## Files

| File | What it is |
| --- | --- |
| `scaleacres-internal-pages-preview.zip` | Static staging preview of the whole site (homepage and all internal pages). Unzip and drag onto Netlify Drop, or run `npx serve` in the folder. Every page carries `noindex, nofollow`, and `robots.txt` disallows all crawling. |
| `scaleacres-internal-pages-desktop-1440x900.mp4` | Recording, 2 min 21 s: About, Team, Services, Work, Case studies, Careers, Blog, Article, Creative studio, a service page and Contact. |
| `scaleacres-internal-pages-mobile-390x844.mp4` | Recording, 1 min 57 s: the same tour on mobile. |
| `scaleacres-internal-pages-screenshots.zip` | Full-page screenshots of 19 page types, in both `desktop/` (1440 px) and `mobile/` (390 px @2x). |
| `*-desktop.jpg`, `*-mobile.jpg` | A few full-page screenshots for quick viewing. |
| `scaleacres-internal-pages-source.zip` | Next.js source code. |

## Pages and their layouts

| Route | Layout |
| --- | --- |
| `/about-us/` | Dark editorial hero with the studio photos. The live About content follows. Then the service index (cursor preview), the creative showcase and the closing CTA. |
| `/our-team/` | Hero with the team photo, then culture sections. The full team grid of 60+ photos uses the real names and roles from the live page. |
| `/contact-us/` | Black "Let's talk." hero with the verified phones, email, studio address, hours, careers line and offices. Then the working enquiry form, the map (`#map`) and a work strip. |
| `/our-services/` | Hero, then the homepage services showcase (all 8). The live solutions appear as alternating image and text rows. Then FAQ, a markets index and a work strip. |
| `/our-work/` | Creative showcase and selected work, followed by the branding boards. Then a website portfolio in browser frames that scroll on hover. The page ends with the creatives masonry, the real-estate video grid and client testimonials. |
| `/case-studies/` and `/case-studies/<slug>/` | Case-study cards linked to the live case studies, the work index and FAQ. Detail pages show client, services, overview and published outcomes. |
| `/careers/` | Hero with culture photos, then life at ScaleAcres. No roles are listed in the source, so the page shows an honest "no roles listed" note plus an apply form and the careers number. FAQ follows. |
| `/blog/` | Editorial index with topic chips, a featured article and grid, and an "Every article" list of all 96 posts. |
| `/blog/<post>/` | Article page:<br>• Hero with author, date, read time and featured image<br>• Sticky contents list<br>• Summarize/share links<br>• Article typography<br>• Enquiry form<br>• Recent posts |
| Category, tag, author and date archives (122) | Archive template with the topic chips. |
| Service pages (7 legacy + 5 under `/services/`) | Hero with the service still. The live content follows, with logo walls, people cards, FAQ, stats and forms. Then the work strip and CTA. |
| `/creative-studio/` | Ad videos, social media videos and AI videos, each labelled, all playable in the homepage video dialog. |
| `/insights/` | The latest articles. |
| Location pages (92) | Shared composed template, which keeps all of each page's existing content. |
| `/privacy-policy/`, `/terms-conditions/` | Legal article layout. |

## Verified

- **Overflow and errors:** 19 page types checked at desktop (1440) and mobile (390). None has horizontal overflow or script errors.
- **Links:** all 166 internal links found on those pages return 200.
- **Menu:** all 10 items open the right page.
- **Footer:** every Quick Links, Our Solutions and service link works. "Map" goes to the map section on the contact page (`/contact-us/#map`), because the live footer has no dedicated map page.
- **Indexing:** the preview is noindex everywhere.

## Open items and missing assets

1. **Embeds blank in screenshots only.** The Google Map and the Vimeo videos on Our Work could not load in our test environment, so they appear as grey boxes in the screenshots. They load normally in a browser.
2. **WordPress images.** 414 of them are now bundled with the preview, resized to 1000 px and compressed. These cover the main pages, the blog cards and the service pages.
   - The rest (mainly on location pages) still load from scaleacres.com, which is fine for staging.
   - Three oversized SVG backgrounds of 2–9 MB were left on the live server.
3. **Headings kept exactly as they are live.** Two examples: "Why Scaleacers ?" (a typo) on Our Services, and "Scaleacres" as the H1 on Our Team. Please tell us whether to correct them.
4. **Company profile.** Internal pages reuse the profile assets already extracted and approved for the homepage: showcase covers, brand boards, service stills and campaign creatives. No full slides are used anywhere.
5. **Two case studies have no visuals.** Prominent Realty and Hometrust Realty need approved project images. Their pages currently show text only.
6. **Careers.** No open roles exist in the source content. Send the roles to list them.
7. **Header change on the homepage too.** The header now detects the section beneath it, so it is legible on white heroes. On the homepage, this means the white header bar also appears over white sections.
