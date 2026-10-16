export type ProjectLayout = "full" | "half" | "tall" | "wide";

export type Project = {
  slug: string;
  client: string;
  title: string;
  category: string;
  summary: string;
  /** Visual under /public. Placeholders are generated SVGs flagged `placeholder: true`. */
  image: string;
  placeholder: boolean;
  layout: ProjectLayout;
  services: string[];
};

/**
 * Only projects publicly referenced on scaleacres.com are listed. Descriptions describe
 * documented scope; no performance figures or technologies are claimed.
 */
export const projects: Project[] = [
  {
    slug: "yugen-goa",
    client: "Yugen Infra",
    title: "Yugen, North Goa",
    category: "Performance Marketing · Branding",
    summary:
      "A remote residential project in North Goa taken to a nationwide audience through a digital-first launch: campaign creatives, paid media and a lead journey built for out-of-state buyers.",
    image: "/images/projects/yugen-goa.svg",
    placeholder: true,
    layout: "full",
    services: ["performance-marketing", "branding-creative-design"],
  },
  {
    slug: "one-goa",
    client: "One Goa",
    title: "One Goa",
    category: "Digital Campaigns",
    summary:
      "Campaign communication and digital outreach for a Goa real estate brand, designed to build brand presence beyond the local market.",
    image: "/images/projects/one-goa.svg",
    placeholder: true,
    layout: "half",
    services: ["performance-marketing", "social-media-marketing"],
  },
  {
    slug: "prominent-realty",
    client: "Prominent Realty",
    title: "Prominent Realty",
    category: "Lead Generation · Web",
    summary:
      "Project landing experiences and campaign infrastructure supporting ongoing residential plot launches in the Delhi NCR region.",
    image: "/images/projects/prominent-realty.svg",
    placeholder: true,
    layout: "half",
    services: ["website-design-development", "performance-marketing"],
  },
  {
    slug: "hometrust-realty",
    client: "Hometrust Realty",
    title: "Hometrust Realty",
    category: "Branding · Performance",
    summary:
      "Brand communication and performance campaigns for a channel-partner business, with creatives tailored to each project it represents.",
    image: "/images/projects/hometrust-realty.svg",
    placeholder: true,
    layout: "wide",
    services: ["branding-creative-design", "performance-marketing"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
