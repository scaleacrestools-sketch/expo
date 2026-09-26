# 1 Estate Consultants — Homepage

Premium responsive homepage for **1 Estate Consultants** (*1 Address for Every You.*), built with React + Vite.

## Quick start

```bash
npm install
npm run dev       # local development at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Deploying on Netlify

**Option A: Netlify Drop (no build step)**
1. Go to https://app.netlify.com/drop
2. Drag the **`dist`** folder (or `1estate-consultants-dist.zip`) onto the page.

Netlify Drop only serves files and never runs `npm run build`, so upload the built `dist` folder, not the project root.

**Option B: Git / CLI deploy**
`netlify.toml` is already set up: build command `npm run build`, publish directory `dist`.

### Enquiry form (Netlify Forms)
The "Request a Visit" form posts to Netlify Forms under the form name `site-visit`.
In the Netlify dashboard go to **Site configuration → Forms**, click **Enable form detection**, then redeploy
(drop the `dist` folder again). Submissions then appear under **Forms**, and you can add email notifications there.
Until detection is enabled, the form shows a fallback message with the phone number and a WhatsApp link.

## Editing content
All approved copy, contact details, properties, blogs and FAQs live in **`src/data/content.js`**.
Images are in **`public/images/`**. To swap one, replace the file and keep its name, or update the path in `content.js`.

Before launch:
- **Social links:** in `src/components/Footer.jsx` (`SOCIAL`), replace `#` with the real profile URLs.
- **Blog images:** these currently reuse project photography from the reference design. Replace them with article-specific images when available.
- **Property / blog / legal links:** "View Details", "View All Properties", blog cards, Privacy Policy and Terms point to on-page anchors or `#`. Update them once those pages exist.

## Structure
```
src/
  components/   Header, Hero, SectionHeading, Button, Carousel,
                FeaturedProperties, FeaturedPropertyCard, About,
                Statistics, StatItem, ExploreProperties, PropertyCard,
                Blogs, BlogCard, RequestVisit, VisitForm, FAQ, FAQItem, Footer, Icons
  data/         content.js (all copy and contact data)
  hooks/        useReveal, useInView, usePrefersReducedMotion
  styles/       global.css (design tokens and all component styles)
```

Fonts (Cormorant Garamond and Manrope) are bundled locally through `@fontsource`, so the site makes no external requests.
