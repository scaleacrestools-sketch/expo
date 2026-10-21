import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url || 'http://localhost:3000';
  return [{ url: `${base}/`, lastModified: new Date(), priority: 1 }, { url: `${base}/privacy`, lastModified: new Date(), priority: 0.2 }];
}
