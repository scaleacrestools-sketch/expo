export type NavItem = { label: string; href: string };

/** Hrefs use the production URLs exactly (trailing slashes, legacy WordPress paths). */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us/" },
  { label: "Services", href: "/our-services/" },
  { label: "Our Work", href: "/our-work/" },
  { label: "Creative Studio", href: "/creative-studio/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact-us/" },
];

/** Positioning descriptor shown top-right in the header. */
export const headerDescriptor = ["A Real Estate Marketing", "& Creative Growth Agency"] as const;

export const ctaNav: NavItem = { label: "Let's Talk", href: "/contact-us/" };
export const routes = {
  home: "/",
  about: "/about-us/",
  team: "/our-team/",
  services: "/our-services/",
  work: "/our-work/",
  caseStudies: "/case-studies/",
  studio: "/creative-studio/",
  insights: "/insights/",
  contact: "/contact-us/",
  privacy: "/privacy-policy/",
  blog: "/blog/",
} as const;
