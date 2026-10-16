import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { routes } from "@/content/nav";

/**
 * Sitemap for routes implemented in this app. WordPress keeps publishing its own
 * sitemaps for the blog and location pages until those are migrated; both are
 * referenced from robots.txt during the transition (see docs/seo-migration.md).
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = [routes.home, routes.about, routes.team, routes.services, routes.work, routes.studio, routes.insights, routes.contact, routes.privacy];
  return [
    ...statics.map((p) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}${s.path}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}${routes.work}${p.slug}/`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
