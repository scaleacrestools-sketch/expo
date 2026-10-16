export type Service = {
  number: string;
  slug: string;
  title: string;
  shortTitle: string;
  headline: string;
  description: string;
  included: readonly [string, string, string, string];
  ctaLabel: string;
  /** Optional emphasis line shown in the expanded panel. */
  focus?: string;
  /**
   * Production path. Existing indexed service pages keep their exact WordPress URL
   * (protected); new services live under /services/<slug>/ and are flagged as NEW URLs
   * in docs/seo-parity-report.md.
   */
  path: string;
  /** True when the URL already exists and ranks on scaleacres.com. */
  legacy: boolean;
};

/**
 * Eight-category structure adapted for ScaleAcres. Ecommerce and software scope
 * should be confirmed with the delivery team before final publication.
 */
export const services: Service[] = [
  {
    number: "01",
    slug: "website-design-development",
    title: "Website Design & Development",
    shortTitle: "Web",
    headline: "Digital experiences that perform.",
    description:
      "We create modern, responsive websites that combine compelling design, intuitive user experiences and performance-focused development to help brands make a stronger digital impression.",
    included: ["Corporate Websites", "Landing Pages", "UI/UX Design", "Ecommerce Development"],
    ctaLabel: "Explore Web Solutions",
    path: "/real-estate-web-development/",
    legacy: true,
  },
  {
    number: "02",
    slug: "search-engine-optimization",
    title: "Search Engine Optimization",
    shortTitle: "SEO",
    headline: "Be found. Stay ahead.",
    description:
      "We develop search strategies that help businesses increase online visibility, attract relevant organic traffic and establish a stronger presence across search platforms.",
    included: ["Technical SEO", "On-Page SEO", "Local SEO", "Content Optimization"],
    ctaLabel: "Explore SEO Services",
    path: "/services/search-engine-optimization/",
    legacy: false,
  },
  {
    number: "03",
    slug: "performance-marketing",
    title: "Performance Marketing",
    shortTitle: "Performance",
    headline: "Every click has a purpose.",
    description:
      "We create and optimize paid advertising campaigns using audience insights, creative thinking and performance data to support qualified lead generation and measurable business goals.",
    included: ["Google Ads", "Meta Ads", "Lead Generation", "Retargeting"],
    ctaLabel: "Explore Performance Marketing",
    focus: "Targeted Lead Generation · Real Estate Marketing",
    path: "/real-estate-ppc-service/",
    legacy: true,
  },
  {
    number: "04",
    slug: "branding-creative-design",
    title: "Branding & Creative Design",
    shortTitle: "Branding",
    headline: "Make your brand impossible to ignore.",
    description:
      "We develop distinctive brand identities and creative communication systems that reflect your personality, strengthen recognition and create memorable audience experiences.",
    included: ["Logo & Brand Identity", "Brand Guidelines", "Graphic Design", "Marketing Collaterals"],
    ctaLabel: "Explore Creative Services",
    path: "/real-estate-branding-agency/",
    legacy: true,
  },
  {
    number: "05",
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    shortTitle: "Social",
    headline: "Create content that connects.",
    description:
      "We help brands build meaningful digital connections through thoughtful content strategies, engaging creatives and consistent communication across social media platforms.",
    included: ["Content Strategy", "Social Media Creatives", "Account Management", "Campaign Content"],
    ctaLabel: "Explore Social Media",
    path: "/services/social-media-marketing/",
    legacy: false,
  },
  {
    number: "06",
    slug: "video-creative-production",
    title: "Video & Creative Production",
    shortTitle: "Video",
    headline: "Stories built to be seen.",
    description:
      "We bring brand ideas to life through compelling videos, creative storytelling and impactful digital content designed for today's fast-moving platforms.",
    included: ["AI Videos", "Social Media Videos", "Ad Videos", "Video Editing"],
    ctaLabel: "Explore Our Studio",
    path: "/services/video-creative-production/",
    legacy: false,
  },
  {
    number: "07",
    slug: "ecommerce-solutions",
    title: "Ecommerce Solutions",
    shortTitle: "Ecommerce",
    headline: "Built to sell. Designed to scale.",
    description:
      "We build digital storefronts that combine attractive design, user-friendly shopping experiences and dependable ecommerce technology.",
    included: ["Shopify Development", "Product Page Design", "Checkout Experience", "Mobile Commerce"],
    ctaLabel: "Explore Ecommerce",
    path: "/services/ecommerce-solutions/",
    legacy: false,
  },
  {
    number: "08",
    slug: "custom-applications-software",
    title: "Custom Applications & Software",
    shortTitle: "Technology",
    headline: "Technology that moves business forward.",
    description:
      "We develop tailored digital solutions that simplify workflows, improve user experiences and help businesses operate more efficiently.",
    included: ["Web Applications", "Dashboards", "Business Automation", "Custom Integrations"],
    ctaLabel: "Explore Technology",
    path: "/services/custom-applications-software/",
    legacy: false,
  },
];

export const serviceHref = (s: Service) => s.path;
export const getService = (slug: string) => services.find((s) => s.slug === slug);
