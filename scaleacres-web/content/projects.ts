import { showreel, clip } from "@/content/media";

export type ProjectLayout = "feature" | "tall" | "short" | "half" | "wide";

export const workFilters = ["Websites", "Branding", "Social Media", "Campaigns", "Videos", "Real Estate"] as const;
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
  /** Looping video used as the card visual (ScaleAcres-owned footage only). */
  video?: string;
  /** Overrides the default /case-studies/<slug>/ link. */
  href?: string;
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
    slug: "scaleacres-brand-film",
    client: "ScaleAcres",
    title: "ScaleAcres Brand Film",
    category: "Videos · Creative Production",
    summary: "Our own concept showreel: architecture, identity, digital, performance and production in six cinematic shots.",
    video: showreel[0].landscape,
    href: "/creative-studio/",
    tone: "ink",
    layout: "feature",
    services: ["video-creative-production"],
    filters: ["Videos"],
    source: "ScaleAcres concept film (Higgsfield, Oct 2026)",
  },
  {
    slug: "yugen-goa",
    client: "Yugen Infra",
    title: "Yugen",
    location: "North Goa",
    category: "Real Estate Campaigns",
    summary: "A remote project in North Goa, scaled through digital-first strategies to reach buyers nationwide.",
    tone: "blue",
    layout: "tall",
    services: ["performance-marketing", "branding-creative-design"],
    filters: ["Real Estate"],
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
    layout: "short",
    services: ["performance-marketing"],
    filters: ["Real Estate"],
    source: "scaleacres.com/case-studies/",
  },
  {
    slug: "architecture-in-motion",
    client: "ScaleAcres",
    title: "Architecture in Motion",
    category: "AI Video · Real Estate",
    summary: "An AI-produced aerial film of a residential tower at blue hour, made by ScaleAcres to show how cinematic property content can be created for launches.",
    video: clip("architecture").landscape,
    href: "/creative-studio/",
    tone: "ink",
    layout: "wide",
    services: ["video-creative-production"],
    filters: ["Videos", "Real Estate"],
    source: "ScaleAcres AI film (Higgsfield, Oct 2026)",
  },
  {
    slug: "prominent-realty",
    client: "Prominent Realty",
    title: "Prominent Realty",
    category: "Real Estate Marketing",
    summary: "Real estate marketing partner to Prominent Realty. Project scope and visuals follow from the approved case study.",
    tone: "white",
    layout: "half",
    services: ["performance-marketing"],
    filters: ["Real Estate"],
    source: "Client testimonial, scaleacres.com",
  },
  {
    slug: "hometrust-realty",
    client: "Hometrust Realty",
    title: "Hometrust Realty",
    category: "Real Estate Marketing",
    summary: "Real estate marketing partner to Hometrust Realty. Project scope and visuals follow from the approved case study.",
    tone: "ink",
    layout: "half",
    services: ["performance-marketing"],
    filters: ["Real Estate"],
    source: "Client testimonial, scaleacres.com",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
/** Projects that have their own detail page under /case-studies/<slug>/. */
export const caseStudyProjects = projects.filter((p) => !p.href);
