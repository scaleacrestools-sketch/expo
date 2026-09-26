import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mediaSources from './media-sources.json';

const root = dirname(fileURLToPath(import.meta.url));

/**
 * The /media/* files live in public/ — run `node scripts/fetch-media.mjs`
 * once to materialize them from the pinned source URLs. Until then, this
 * plugin keeps `vite dev` working by 302-redirecting any /media path that
 * is not yet on disk to its source URL.
 */
function mediaFallback(): Plugin {
  return {
    name: 'media-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0];
        const target = (mediaSources as Record<string, string>)[path];
        if (target && !existsSync(join(root, 'public', path))) {
          res.writeHead(302, { Location: target });
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mediaFallback()],
});
