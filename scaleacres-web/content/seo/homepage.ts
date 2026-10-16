/**
 * PROTECTED SEO BASELINE — HOMEPAGE
 * ------------------------------------------------------------------
 * These values reproduce what the live WordPress homepage publishes. They are ranking
 * signals: do not rewrite them for creative reasons. Change only with SEO approval.
 *
 * Provenance (see docs/seo-parity-report.md):
 *  - title: search-index snapshot of https://scaleacres.com/ (Oct 2026)  → verified
 *  - h1, positioning, intro, boilerplate, service headings: ScaleAcres Brand Kit v1.0,
 *    which was compiled from scaleacres.com in Sep 2026 → must be re-confirmed by crawl
 *  - metaDescription: NOT CAPTURED. scaleacres.com is unreachable from the build
 *    environment. Run `npm run seo:audit` against production and paste the value here.
 *
 * Any field with `verified: false` is a launch blocker until checked against the crawl.
 */
export type Protected<T> = { value: T; verified: boolean; source: string };

export const homepageSeo = {
  title: {
    value: "Best Real Estate Digital Marketing Agency in India",
    verified: true,
    source: "Search index title for https://scaleacres.com/ (Oct 2026)",
  },
  metaDescription: {
    value: "",
    verified: false,
    source: "Not captured — production crawl required",
  },
  h1: {
    value: "We Don't Create Brands. We Create Market Leaders.",
    verified: false,
    source: "Brand Kit v1.0 — primary tagline, hero H1 on scaleacres.com",
  },
  positioning: {
    value: "India's Real Estate Marketing Specialist",
    verified: false,
    source: "Brand Kit v1.0 — eyebrow / positioning line",
  },
  intro: {
    value:
      "We're a seasoned real estate marketing agency that acts as your one-stop strategic partner, solving property challenges and closing business gaps with end-to-end creative and performance solutions.",
    verified: false,
    source: "Brand Kit v1.0 — body copy sample taken from the live homepage",
  },
  boilerplate: {
    value:
      "ScaleAcres PromoTech is a 360° real estate branding and performance marketing agency serving developers and channel partners across India. From lead generation and paid media to branding, SEO, and web development, we act as a single strategic partner that turns property projects into market leaders.",
    verified: false,
    source: "Brand Kit v1.0 — boilerplate",
  },
  servicesHeading: {
    value: "Real Estate Lead Generation & Branding Services",
    verified: false,
    source: "Title of /our-services/ in the search index; reused as homepage services H2 pending crawl",
  },
  legacyServices: {
    value: [
      { heading: "Targeted Lead Generation", href: "/real-estate-ppc-service/" },
      { heading: "Real Estate Branding", href: "/real-estate-branding-agency/" },
      { heading: "Real Estate Website Development", href: "/real-estate-web-development/" },
      { heading: "Search Engine Optimization", href: "/our-services/" },
      { heading: "Social Media Marketing", href: "/our-services/" },
    ],
    verified: false,
    source: "Brand Kit v1.0 services list + live service URLs",
  },
} satisfies Record<string, Protected<unknown>>;

/**
 * NEW CREATIVE COPY — free to iterate.
 * Never move these strings into the protected fields above without SEO sign-off.
 */
export const homepageCreative = {
  positioningLine: ["Real Estate Marketing", "Creative", "Digital", "Technology"],
  statement: ["We build brands.", "We drive growth."],
  lead: "From real estate marketing and lead generation to branding, websites, creative production and performance campaigns.",
} as const;
