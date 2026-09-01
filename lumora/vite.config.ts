import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mediaSources from './media-sources.json';

/**
 * In production (Netlify) the /media/* paths are proxied to the source CDNs
 * via netlify.toml redirects so all media is served same-origin. This plugin
 * gives `vite dev` the same paths by 302-redirecting to the source URLs.
 */
function mediaRedirect(): Plugin {
  return {
    name: 'media-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0];
        const target = (mediaSources as Record<string, string>)[path];
        if (target) {
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
  plugins: [react(), tailwindcss(), mediaRedirect()],
});
