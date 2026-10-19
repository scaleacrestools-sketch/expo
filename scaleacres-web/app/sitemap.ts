import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { legacyPages } from "@/lib/legacy";
import { services } from "@/content/services";
import { caseStudyProjects } from "@/content/projects";
import { routes } from "@/content/nav";

/**
 * Every live URL that is indexable on scaleacres.com today (robots index + self-canonical),
 * at its exact path, plus the homepage and the new pages added by the redesign.
 * /sitemap_index.xml (the Yoast URL submitted to Search Console) points here.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const abs = (p: string) => `${site.url}${p}`;
  const legacy = legacyPages().filter((p) => !/noindex/i.test(p.robots ?? "") && (!p.canonical || p.canonical === abs(p.path)));
  const added = [routes.studio, ...services.filter((s) => !s.legacy).map((s) => s.path), ...caseStudyProjects.map((p) => `${routes.caseStudies}${p.slug}/`)];
  const seen = new Set<string>();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    ...legacy.map((p) => ({ url: abs(p.path), lastModified: p.article?.dateModified ? new Date(p.article.dateModified) : now })),
    ...added.map((p) => ({ url: abs(p), lastModified: now })),
  ].filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}
