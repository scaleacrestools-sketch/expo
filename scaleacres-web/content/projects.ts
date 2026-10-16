export type ProjectLayout = "full" | "half" | "tall" | "wide";

export const workFilters = [
  "Website Development",
  "Branding & Identity",
  "Performance Marketing",
  "Real Estate Campaigns",
  "AI Videos",
  "Social Media Videos",
  "Ad Videos",
] as const;
export type WorkFilter = (typeof workFilters)[number];

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
  /** Portfolio filter tags. Only tag what the project actually included. */
  filters: WorkFilter[];
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
    filters: ["Performance Marketing", "Branding & Identity", "Real Estate Campaigns"],
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
    filters: ["Performance Marketing", "Real Estate Campaigns"],
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
    filters: ["Website Development", "Performance Marketing", "Real Estate Campaigns"],
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
    filters: ["Branding & Identity", "Performance Marketing", "Real Estate Campaigns"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
