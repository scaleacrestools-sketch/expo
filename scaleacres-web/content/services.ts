export type Service = {
  number: string;
  slug: string;
  title: string;
  shortTitle: string;
  headline: string;
  description: string;
  included: readonly [string, string, string, string];
  ctaLabel: string;
  /** Existing WordPress URL this service page replaces (for 301 mapping). */
  legacyPaths: string[];
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
    legacyPaths: ["/real-estate-web-development/"],
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
    legacyPaths: [],
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
    legacyPaths: ["/real-estate-ppc-service/"],
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
    legacyPaths: ["/real-estate-branding-agency/"],
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
    legacyPaths: [],
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
    legacyPaths: [],
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
    legacyPaths: [],
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
    legacyPaths: [],
  },
];

export const serviceHref = (s: Service) => `/services/${s.slug}`;
export const getService = (slug: string) => services.find((s) => s.slug === slug);
