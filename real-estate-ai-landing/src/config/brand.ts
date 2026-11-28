/**
 * Central brand configuration.
 * Change a value here and it updates across the site, the HTML <head>,
 * robots.txt and sitemap.xml (generated at build time by vite.config.ts).
 */
export const brand = {
  productName: '[Product Name]',
  companyName: '[Company Name]',
  tagline: 'AI-Powered Real Estate Sales Operating System',
  shortDescription:
    'AI voice agents that call, qualify and schedule site visits for real estate sales teams, so people can focus on genuine buyers.',
  /** Path inside /public. Replace the SVG file or point to a new one. */
  logo: '/assets/svg/logo.svg',
  logoMark: '/assets/svg/logo-mark.svg',
  favicon: '/favicon.svg',
  colors: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#C4B5FD',
  },
  /** Leave empty strings until real values exist. Empty values are hidden on the site. */
  contactEmail: '',
  contactPhone: '',
  social: {
    linkedin: '',
    x: '',
    instagram: '',
    youtube: '',
  },
  /** Leave empty to hide the Sign In link target (it falls back to the demo modal). */
  loginUrl: '',
  /** Leave empty to use the built-in demo booking modal (Netlify Forms). */
  demoBookingUrl: '',
  /** Production domain, used for canonical URL, Open Graph and sitemap. No trailing slash. */
  siteUrl: 'https://example.com',
} as const;

export type Brand = typeof brand;
