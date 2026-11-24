import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Production leads are handled by the existing /save.php on the hosting
 * server. That file is NOT part of this project and must stay on the host.
 * This dev-only middleware answers POST /save.php locally so the forms can be
 * tested with `npm run dev`. It never ships in the production build.
 */
function devSaveEndpoint() {
  return {
    name: 'dev-save-php',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/save.php', (req, res) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          const data = Object.fromEntries(new URLSearchParams(body));
          console.log('[dev save.php] received', data.event_type, data.form_name || '', data.phone || '');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, dev: true }));
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devSaveEndpoint()],
  build: {
    assetsInlineLimit: 0,
  },
});
