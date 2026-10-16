/**
 * PROTECTED URL REGISTRY
 * ------------------------------------------------------------------
 * Every known production URL on scaleacres.com, with what we know about its SEO signals
 * and how it is served after the migration.
 *
 *  serveFrom: "wordpress" → the URL is proxied byte-for-byte from the WordPress origin
 *                           (WORDPRESS_ORIGIN). Its title, meta, headings, body, schema
 *                           and links are unchanged. This is the default for every page
 *                           whose content has not yet been exported and verified.
 *  serveFrom: "next"      → the URL is rendered by this app. Only allowed once the page's
 *                           baseline (title, meta, H1-H3, body, canonical, schema) is
 *                           captured and the parity report shows PASS for it.
 *
 * On staging (no WORDPRESS_ORIGIN) the new designs render for review on every route.
 *
 * `title` is the title shown in the search index (Oct 2026). Google may shorten titles,
 * so each one is re-confirmed from the crawl export before launch.
 */
export type ServeFrom = "wordpress" | "next";
export type ProtectedPage = {
  path: string;
  title: string;
  type: "home" | "page" | "service" | "location" | "blog" | "archive";
  serveFrom: ServeFrom;
  /** Next.js route that renders the redesigned version (staging preview / after sign-off). */
  nextRoute?: string;
  notes?: string;
};

export const protectedPages: ProtectedPage[] = [
  { path: "/", title: "Best Real Estate Digital Marketing Agency in India", type: "home", serveFrom: "next", nextRoute: "/", notes: "Redesigned. Protected title/H1/body bound from content/seo/homepage.ts. Meta description pending crawl." },
  { path: "/about-us/", title: "About Scale Acres", type: "page", serveFrom: "wordpress", nextRoute: "/about-us/" },
  { path: "/our-team/", title: "Meet the Scale Acres Team", type: "page", serveFrom: "wordpress", nextRoute: "/our-team/" },
  { path: "/our-services/", title: "Real Estate Lead Generation & Branding Services", type: "page", serveFrom: "wordpress", nextRoute: "/our-services/" },
  { path: "/contact-us/", title: "Contact Scale Acres", type: "page", serveFrom: "wordpress", nextRoute: "/contact-us/" },
  { path: "/case-studies/", title: "Case Studies", type: "page", serveFrom: "wordpress", nextRoute: "/case-studies/" },
  { path: "/real-estate-web-development/", title: "Best Real Estate Web Development Company in India", type: "service", serveFrom: "wordpress", nextRoute: "/real-estate-web-development/" },
  { path: "/real-estate-branding-agency/", title: "Real Estate Branding Agency", type: "service", serveFrom: "wordpress", nextRoute: "/real-estate-branding-agency/" },
  { path: "/real-estate-ppc-service/", title: "PPC for Realtors", type: "service", serveFrom: "wordpress", nextRoute: "/real-estate-ppc-service/" },

  // Location / market landing pages — always WordPress until individually migrated.
  { path: "/real-estate-marketing-delhi/", title: "Real Estate Digital Marketing Agency in Delhi NCR", type: "location", serveFrom: "wordpress" },
  { path: "/real-estate-marketing-mumbai/", title: "Top Real Estate Digital Marketing Agency in Mumbai", type: "location", serveFrom: "wordpress" },
  { path: "/real-estate-marketing-pune/", title: "Best Real Estate Digital Marketing Agency in Pune", type: "location", serveFrom: "wordpress" },
  { path: "/real-estate-marketing-bangalore/", title: "Best Real Estate Digital Marketing Agency in Bangalore", type: "location", serveFrom: "wordpress" },
  { path: "/real-estate-digital-marketing-agency-in-ghaziabad/", title: "Premier Real Estate Digital Marketing Agency in Ghaziabad", type: "location", serveFrom: "wordpress" },
  { path: "/real-estate-digital-marketing-agency-in-ahmedabad/", title: "Best Real Estate Digital Marketing Agency in Ahmedabad", type: "location", serveFrom: "wordpress" },
  { path: "/us/", title: "Reliable Digital Marketing Company for Real Estate in USA", type: "location", serveFrom: "wordpress" },
  { path: "/us/digital-marketing-company-for-real-estate-in-miami/", title: "Top Digital Marketing Company for Real Estate in Miami", type: "location", serveFrom: "wordpress" },
  { path: "/us/digital-marketing-company-for-real-estate-in-new-york/", title: "Elite Digital Marketing Company for Real Estate in New York", type: "location", serveFrom: "wordpress" },
  { path: "/us/digital-marketing-company-for-real-estate-in-texas/", title: "Best Digital Marketing Company for Real Estate in Texas", type: "location", serveFrom: "wordpress" },
  { path: "/uae/real-estate-digital-marketing-agency-in-dubai/", title: "Digital Marketing Company for Real Estate in Dubai", type: "location", serveFrom: "wordpress" },
  { path: "/sa/", title: "Digital Marketing Company for Real Estate in Saudi Arabia", type: "location", serveFrom: "wordpress" },
  { path: "/sa/digital-marketing-company-for-real-estate-in-jeddah/", title: "Best Digital Marketing Company for Real Estate in Jeddah", type: "location", serveFrom: "wordpress" },
  { path: "/au/", title: "Digital Marketing Company for Real Estate in Australia", type: "location", serveFrom: "wordpress" },
  { path: "/au/digital-marketing-company-for-real-estate-in-sydney/", title: "Premier Digital Marketing Company for Real Estate in Sydney", type: "location", serveFrom: "wordpress" },
  { path: "/nz/", title: "Top Digital Marketing Company for Real Estate in New Zealand", type: "location", serveFrom: "wordpress" },
  { path: "/vn/", title: "Leading Digital Marketing Company for Real Estate in Vietnam", type: "location", serveFrom: "wordpress" },
  { path: "/ph/", title: "Digital Marketing Company for Real Estate in Philippines", type: "location", serveFrom: "wordpress" },
  { path: "/id/digital-marketing-company-for-real-estate-in-bali/", title: "Premier Digital Marketing Company for Real Estate in Bali", type: "location", serveFrom: "wordpress" },

  // Blog — always WordPress until the full export is migrated with identical slugs.
  { path: "/blog/", title: "Blog", type: "archive", serveFrom: "wordpress" },
  { path: "/blog/tag/digital-marketing-for-real-estate/", title: "Digital Marketing for Real Estate Archives - scaleacres.com", type: "archive", serveFrom: "wordpress" },
  { path: "/blog/why-your-ad-budget-is-wasted-if-your-website-loads-slow/", title: "Why Your Ad Budget Is Wasted If Your Website Loads Slow", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/custom-vs-template-real-estate-websites/", title: "Custom vs Template Real Estate Websites", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/how-to-create-high-converting-real-estate-landing-pages/", title: "How to Create High-Converting Real Estate Landing Pages?", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/step-by-step-guide-to-building-a-real-estate-website/", title: "Step-by-Step Guide to Building a Real Estate Website", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/a-detailed-guide-to-real-estate-website-development/", title: "Latest Guide to Real Estate Website Development (2026)", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/how-real-estate-developers-can-use-website-analytics-for-better-sales-decisions/", title: "How Real Estate Developers Can Use Website Analytics for Better Sales Decisions?", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/seo-strategy-for-property-developers/", title: "Ultimate SEO Strategy for Property Developers in 2026", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/why-real-estate-websites-should-include-testimonials-reviews-and-rera-information/", title: "Why Real Estate Websites need Testimonials, Reviews & RERA?", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/key-features-to-include-in-a-real-estate-website-for-maximum-lead-conversion/", title: "Key Features to Include in a Real Estate Website for Maximum Lead Conversion - scaleacres.com", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/what-is-nap-consistency-and-why-does-it-matter-for-real-estate-seo/", title: "Why NAP Consistency Is Important for Real Estate SEO?", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/how-to-create-and-optimize-google-my-business-profile-for-real-estate/", title: "How to Create & Optimize Google My Business for Real Estate?", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/common-mistakes-to-avoid-in-local-seo-for-real-estate-business/", title: "Local SEO Mistakes Real Estate Businesses Must Avoid (2026)", type: "blog", serveFrom: "wordpress" },
  { path: "/blog/common-challenges-in-real-estate-digital-marketing/", title: "6 Common Challenges in Real Estate Digital Marketing (Guide)", type: "blog", serveFrom: "wordpress" },
];

/** New URLs introduced by the redesign (no existing ranking to protect; flagged for review). */
export const newPages = [
  "/creative-studio/",
  "/insights/",
  "/privacy-policy/",
  "/services/search-engine-optimization/",
  "/services/social-media-marketing/",
  "/services/video-creative-production/",
  "/services/ecommerce-solutions/",
  "/services/custom-applications-software/",
  "/case-studies/<project-slug>/",
] as const;

export const protectedTitle = (path: string) => protectedPages.find((p) => p.path === path)?.title;
