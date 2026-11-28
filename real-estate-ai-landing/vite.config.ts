import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { brand } from './src/config/brand';

/** Injects brand values into index.html and emits robots.txt + sitemap.xml. */
function brandPlugin(): Plugin {
  const map: Record<string, string> = {
    '%PRODUCT_NAME%': brand.productName,
    '%SITE_URL%': brand.siteUrl,
    '%TAGLINE%': brand.tagline,
  };
  return {
    name: 'brand-html',
    transformIndexHtml(html) {
      return Object.entries(map).reduce((acc, [k, v]) => acc.split(k).join(v), html);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${brand.siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${brand.siteUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), brandPlugin()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom'], motion: ['motion'] } },
    },
  },
});
