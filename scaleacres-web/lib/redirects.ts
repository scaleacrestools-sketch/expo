/**
 * 301 map from the current WordPress URLs to the new Next.js routes.
 * Location / SEO landing pages and the blog are intentionally NOT redirected:
 * they are preserved at their existing URLs (see docs/seo-migration.md).
 */
export const legacyRedirects = [
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/our-team", destination: "/about#team", permanent: true },
  { source: "/our-services", destination: "/services", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },
  { source: "/case-studies", destination: "/work", permanent: true },
  { source: "/real-estate-web-development", destination: "/services/website-design-development", permanent: true },
  { source: "/real-estate-branding-agency", destination: "/services/branding-creative-design", permanent: true },
  { source: "/real-estate-ppc-service", destination: "/services/performance-marketing", permanent: true },
];
