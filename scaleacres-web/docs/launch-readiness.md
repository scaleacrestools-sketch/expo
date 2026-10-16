# Launch readiness — interactions, missing assets, approvals

**Production status: NOT APPROVED.** Do not change DNS, hosting, WordPress or live SEO content until every item in section 3 is signed off.

## 1. Completed and tested interactions

Verified by an automated Playwright run on the staging build (desktop 1440 px, mobile 390 px, and JavaScript disabled):

- **Sticky header:** transparent over the hero, then solid on scroll, with an active-page underline and a blue hover underline.
- **Services mega-dropdown:** opens on hover and on click, closes on Escape or outside click, and lists all eight services with their production URLs.
- **Mobile menu:** full screen, with an expandable services list, focus trap, Escape to close and body scroll lock.
- **Hero video:** deferred loading after the `load` event, muted autoplay, poster fallback, a visible pause/play control, no autoplay under reduced motion, and separate desktop and mobile sources (WebM + MP4).
- **Services accordion:** eight rows, the first open by default, one open at a time, collapsible, smooth height animation with no layout jump, keyboard operable, and panel content present in the HTML.
- **Portfolio:** hover zoom and arrow reveal, project detail pages, and category filters on the work page that narrow the grid (QA: "Website Development" shows one project).
- **Creative Studio:** exactly three tabs (AI Videos / Social Media Videos / Ad Videos), arrow-key navigation, hover video previews on pointer devices only, a modal player with mute/unmute and close, and Escape to close.
- **Process timeline:** horizontal on desktop and vertical on mobile, with a scroll-linked progress line.
- **Brand statement:** staggered oversized text reveal on a blue background.
- **Contact form:** client and server validation (Zod), accessible inline errors with focus moved to the first invalid field, a honeypot plus a 3-second timing gate, rate limiting, and real delivery via Resend or a webhook. It **never shows success unless delivery succeeded**. Unconfigured, it tells the visitor to email directly.
- **Back-to-top button**, skip link, visible focus rings and reduced-motion support throughout.
- **No-JavaScript rendering:** all headings and sections are visible (QA: zero hidden).
- **Zero dead internal links** across 21 crawled staging pages, and no console errors other than the intentional form-validation test responses.

## 2. Missing final assets

| Asset | Where it goes | Status |
|---|---|---|
| **Official ScaleAcres logo** (full-colour PNG/SVG, reversed white version) | `public/brand/scaleacres-logo.png`, `public/brand/scaleacres-logo-white.png`, then set `logoFilesPresent: true` in `content/brand.ts` | **Blocking.** The logo described as supplied was not attached to this session and could not be fetched from scaleacres.com. The header shows a flagged text fallback, never a recreated symbol. |
| Exact brand colours re-sampled from the logo master | `app/globals.css` → `--color-ink`, `--color-blue` | Using the Brand Kit values `#0B0D0D` / `#1CA6DC` (sampled from logo pixels). Confirm against the master file. |
| Hero showreel | 12 Higgsfield clips are rendered in the ScaleAcres account. Download, rename and run `npm run showreel -- ./clips` | **Ready to assemble.** The current hero uses a labelled black/blue placeholder. |
| Client logos (Yugen Infra, One Goa, Prominent Realty, Hometrust Realty) | `public/brand/clients/`, then set `logo` in `content/clients.ts` | Wordmark fallback. Confirm client consent. |
| Project visuals and real project copy | `public/images/projects/`, `content/projects.ts` | Labelled placeholders. Existing case-study descriptions from `/case-studies/` must be carried over verbatim. |
| Creative Studio videos (AI / Social / Ad) | `public/videos/studio/`, `content/studio.ts` | Social reels identified in Drive (see `docs/asset-checklist.md`). AI and Ad videos not identified. |
| Article featured images and exact publish dates | `public/images/insights/`, `content/insights.ts` | Placeholders, with month-level dates only. |
| Team / studio photography | `public/images/about/` | Placeholder. |
| OG share image | `public/images/og-image.jpg` | Not created. |

## 3. Items requiring approval before production

**SEO (release blockers):**
1. Production baseline crawl captured (`npm run seo:baseline`) and Search Console export reviewed.
2. Homepage: the exact live meta description is pasted into `content/seo/homepage.ts`. The H1, intro, boilerplate and service headings are confirmed or corrected from the crawl. Any live homepage sections missing from the redesign are added back as visible HTML.
3. Homepage schema types match or exceed the live homepage.
4. `seo:compare` against the proxy-mode staging build shows **zero FAILED** rows.
5. The WordPress origin hostname is configured to serve without redirecting (see `docs/deployment-netlify.md` §3).
6. Analytics and conversion tracking (GA4, Ads, Meta Pixel, form and call events) are replicated and tested.

**Content and brand:**
7. New creative copy: "We build brands. We drive growth.", "Real Estate Marketing • Creative • Digital • Technology", section headlines and service descriptions.
8. The eight-service structure, especially the **Ecommerce Solutions** and **Custom Applications & Software** scope, confirmed as services ScaleAcres actually delivers.
9. New URLs: `/creative-studio/`, `/insights/`, `/privacy-policy/`, five `/services/<slug>/` pages and four `/case-studies/<slug>/` pages. Check for keyword cannibalisation against existing location and service pages.
10. Client names, logos and project descriptions approved by each client.
11. Each Higgsfield clip reviewed for artefacts. The final showreel cut approved.
12. Privacy policy reviewed by a legal advisor and aligned with the current policy.

**Go-live:**
13. Written approval to change DNS, with the rollback plan acknowledged (`docs/deployment-netlify.md` §5).

## 4. Project structure

```
scaleacres-web/
├── app/
│   ├── about-us/
│   │   └── page.tsx
│   ├── api/
│   │   └── contact/
│   │       └── route.ts
│   ├── case-studies/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── contact-us/
│   │   └── page.tsx
│   ├── creative-studio/
│   │   └── page.tsx
│   ├── insights/
│   │   └── page.tsx
│   ├── our-services/
│   │   └── page.tsx
│   ├── our-team/
│   │   └── page.tsx
│   ├── privacy-policy/
│   │   └── page.tsx
│   ├── real-estate-branding-agency/
│   │   └── page.tsx
│   ├── real-estate-ppc-service/
│   │   └── page.tsx
│   ├── real-estate-web-development/
│   │   └── page.tsx
│   ├── services/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/
│   │   ├── Arrow.tsx
│   │   ├── ArrowLink.tsx
│   │   ├── DevBadge.tsx
│   │   ├── Logo.tsx
│   │   ├── Reveal.tsx
│   │   └── SectionHeading.tsx
│   ├── AboutIntro.tsx
│   ├── Analytics.tsx
│   ├── BackToTop.tsx
│   ├── BrandStatement.tsx
│   ├── CaseStudies.tsx
│   ├── ClientLogoShowcase.tsx
│   ├── ContactCTA.tsx
│   ├── ContactForm.tsx
│   ├── CreativeStudio.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroVideo.tsx
│   ├── Insights.tsx
│   ├── MobileMenu.tsx
│   ├── PageHero.tsx
│   ├── ProcessTimeline.tsx
│   ├── RealEstateDNA.tsx
│   ├── SelectedWork.tsx
│   ├── ServiceAccordion.tsx
│   ├── ServicePage.tsx
│   └── VideoModal.tsx
├── content/
│   ├── seo/
│   │   ├── homepage.ts
│   │   └── pages.ts
│   ├── brand.ts
│   ├── caseStudies.ts
│   ├── clients.ts
│   ├── insights.ts
│   ├── nav.ts
│   ├── process.ts
│   ├── projects.ts
│   ├── services.ts
│   ├── site.ts
│   └── studio.ts
├── docs/
│   ├── asset-checklist.md
│   ├── deployment-netlify.md
│   ├── higgsfield-showreel-brief.md
│   └── seo-parity-report.md
├── lib/
│   ├── contactSchema.ts
│   ├── env.ts
│   ├── motion.ts
│   └── seo.ts
├── public/
│   ├── brand/
│   │   └── scaleacres-mark.svg
│   ├── images/
│   │   ├── about/
│   │   │   └── studio.svg
│   │   ├── insights/
│   │   │   ├── ad-budget-speed.svg
│   │   │   ├── custom-vs-template.svg
│   │   │   └── landing-pages.svg
│   │   ├── projects/
│   │   │   ├── hometrust-realty.svg
│   │   │   ├── one-goa.svg
│   │   │   ├── prominent-realty.svg
│   │   │   └── yugen-goa.svg
│   │   ├── studio/
│   │   │   ├── placeholder-landscape.svg
│   │   │   ├── placeholder-portrait.svg
│   │   │   └── placeholder-square.svg
│   │   ├── hero-poster-mobile.jpg
│   │   ├── hero-poster.jpg
│   │   └── og-image.svg
│   └── videos/
│       ├── placeholder-landscape.mp4
│       ├── placeholder-landscape.webm
│       ├── placeholder-portrait.mp4
│       ├── placeholder-portrait.webm
│       ├── placeholder-square.mp4
│       ├── placeholder-square.webm
│       ├── showreel-portrait.mp4
│       ├── showreel-portrait.webm
│       ├── showreel.mp4
│       └── showreel.webm
├── scripts/
│   ├── build-showreel.sh
│   ├── parity-from-registry.mjs
│   └── seo-audit.mjs
├── .env.example
├── .gitignore
├── README.md
├── eslint.config.mjs
├── netlify.toml
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.ts
└── tsconfig.json```

Key files:
- `content/seo/homepage.ts` holds the **protected** homepage SEO values, kept separate from the creative copy.
- `content/seo/pages.ts` is the **protected URL registry**. Each URL is served from WordPress or Next.js.
- `content/brand.ts` holds the logo file switch and brand colours. `app/globals.css` holds the design tokens.
- `next.config.ts` sets trailing slashes, the WordPress proxy gate and the fallback.
- `proxy.ts`, `app/robots.ts` and `lib/env.ts` provide host-based staging protection.
- `scripts/seo-audit.mjs` handles crawl and compare. `scripts/build-showreel.sh` assembles the showreel.
