import { clip } from "@/content/media";
import { getProject } from "@/content/projects";

/**
 * Homepage Section 4 — Our Work showcase.
 * Only work with real visuals appears in the image grid. Today that is ScaleAcres' own
 * AI films (commissioned by ScaleAcres in Higgsfield, Oct 2026), labelled as such.
 * Client projects join the grid automatically once an approved `image` is set on the
 * project in content/projects.ts; until then they are listed as case-study links.
 */
export type ShowcaseItem = {
  slug: string;
  title: string;
  category: string;
  href: string;
  video?: string;
  image?: string;
  alt: string;
};

const film = (id: string, title: string, category: string): ShowcaseItem => {
  const c = clip(id);
  return { slug: `film-${id}`, title, category, href: "/creative-studio/", video: c.landscape, alt: c.description };
};

export const showcaseFilms: ShowcaseItem[] = [
  film("architecture", "Architecture in Motion", "AI Film · Real Estate"),
  film("brand", "Identity Systems", "AI Film · Branding"),
  film("web", "Digital Experiences", "AI Film · Digital"),
  film("performance", "Performance in Motion", "AI Film · Performance"),
  film("production", "Studio Production", "AI Film · Production"),
  film("finale", "Light Sweep", "AI Film · Brand Film"),
];

/** Published client case studies (scaleacres.com). Visual cards once approved images exist. */
export const caseStudySlugs = ["yugen-goa", "one-goa", "prominent-realty", "hometrust-realty"] as const;

export function showcaseItems(): { grid: ShowcaseItem[]; caseStudies: { slug: string; title: string; category: string }[] } {
  const clients = caseStudySlugs.map((s) => getProject(s)!).filter(Boolean);
  const withImages: ShowcaseItem[] = clients
    .filter((p) => p.image)
    .map((p) => ({ slug: p.slug, title: p.client, category: p.category, href: `/case-studies/${p.slug}/`, image: p.image, alt: `${p.title} — ${p.category}` }));
  return {
    grid: [...withImages, ...showcaseFilms].slice(0, 8),
    caseStudies: clients.map((p) => ({ slug: p.slug, title: p.client, category: p.category })),
  };
}
