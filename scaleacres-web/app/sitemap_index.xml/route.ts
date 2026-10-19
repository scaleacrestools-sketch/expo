import { site } from "@/content/site";

/** Keeps the Yoast sitemap URL that Search Console knows; it now indexes the single sitemap. */
export const dynamic = "force-static";

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${site.url}/sitemap.xml</loc></sitemap>\n</sitemapindex>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
