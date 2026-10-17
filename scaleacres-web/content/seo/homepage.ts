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
 *  - metaDescription, title: captured from the live https://scaleacres.com/ HTML on
 *    17 Oct 2026 (read-only fetch) → verified
 *
 * Any field with `verified: false` is a launch blocker until checked against the crawl.
 */
export type Protected<T> = { value: T; verified: boolean; source: string };

export const homepageSeo = {
  title: {
    value: "Best Real Estate Digital Marketing Agency in India",
    verified: true,
    source: "Live https://scaleacres.com/ <title>, captured 17 Oct 2026",
  },
  metaDescription: {
    value:
      "Scale your real estate business with Scale Acres – A leading real estate digital marketing agency offering expert lead generation & branding solutions.",
    verified: true,
    source: "Live https://scaleacres.com/ <meta name=description>, captured 17 Oct 2026",
  },
  h1: {
    value: "We Don't Create Brands. We Create Market Leaders.",
    verified: false,
    // Live check 17 Oct 2026: this line is an H2 on scaleacres.com; the live H1 is the
    // positioning line below. Decide which one the new hero should carry before launch.
    source: "Brand Kit v1.0 tagline; live page uses it as an H2 (live H1 = positioning)",
  },
  positioning: {
    value: "India’s Real Estate Marketing Specialist",
    verified: true,
    source: "Live https://scaleacres.com/ H1, captured 17 Oct 2026",
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
  /** Cinematic hero statements (original ScaleAcres lines). Each entry is one or two lines. */
  statements: [
    ["Some brands get noticed."],
    ["We make them matter."],
    ["Creative thinking.", "Measurable growth."],
    ["Built to stand out.", "Designed to scale."],
  ],
  /** Vertical descriptor on the hero's left edge. */
  verticalDescriptor: ["Real Estate Marketing", "Branding", "Digital", "Creative", "Technology"],
} as const;
