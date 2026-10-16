import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site } from "@/content/site";
import { isProductionHost } from "@/lib/env";

/**
 * Host-aware robots.txt. Production hosts allow crawling; any other host (staging,
 * Netlify previews, localhost) disallows everything.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  if (!isProductionHost(host)) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/sitemap_index.xml`],
    host: site.url,
  };
}
