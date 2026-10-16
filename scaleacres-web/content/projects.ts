export type ProjectLayout = "feature" | "tall" | "short" | "wide";

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
  /** Short display location, only when published. */
  location?: string;
  category: string;
  /** Only what scaleacres.com has published about the project. */
  summary: string;
  /** Approved project visual under /public. While absent, an art-directed typographic cover is shown and labelled. */
  image?: string;
  tone: "ink" | "blue" | "white";
  layout: ProjectLayout;
  services: string[];
  filters: WorkFilter[];
  source: string;
};

/**
 * Projects publicly referenced on scaleacres.com. Copy is limited to what the live site states;
 * full descriptions, screenshots and scope come from the approved case studies (see docs/launch-readiness.md).
 */
export const projects: Project[] = [
  {
    slug: "yugen-goa",
    client: "Yugen Infra",
    title: "Yugen",
    location: "North Goa",
    category: "Real Estate Campaigns",
    summary: "A remote project in North Goa, scaled through digital-first strategies to reach buyers nationwide.",
    tone: "blue",
    layout: "feature",
    services: ["performance-marketing", "branding-creative-design"],
    filters: ["Real Estate Campaigns", "Performance Marketing"],
    source: "scaleacres.com/case-studies/",
  },
  {
    slug: "one-goa",
    client: "One Goa",
    title: "One Goa",
    location: "Goa",
    category: "Real Estate Campaigns",
    summary: "Lead volume, nationwide reach and improved brand presence for a Goa real estate brand.",
    tone: "ink",
    layout: "tall",
    services: ["performance-marketing"],
    filters: ["Real Estate Campaigns", "Performance Marketing"],
    source: "scaleacres.com/case-studies/",
  },
  {
    slug: "prominent-realty",
    client: "Prominent Realty",
    title: "Prominent Realty",
    category: "Real Estate Marketing",
    summary: "Real estate marketing partner to Prominent Realty. Project scope and visuals follow from the approved case study.",
    tone: "white",
    layout: "short",
    services: ["performance-marketing"],
    filters: ["Real Estate Campaigns"],
    source: "Client testimonial, scaleacres.com",
  },
  {
    slug: "hometrust-realty",
    client: "Hometrust Realty",
    title: "Hometrust Realty",
    category: "Real Estate Marketing",
    summary: "Real estate marketing partner to Hometrust Realty. Project scope and visuals follow from the approved case study.",
    tone: "ink",
    layout: "wide",
    services: ["performance-marketing"],
    filters: ["Real Estate Campaigns"],
    source: "Client testimonial, scaleacres.com",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
