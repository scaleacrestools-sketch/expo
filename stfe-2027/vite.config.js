import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { SITE } from './site.config.js';

// Strips the institutional-marks strip from production builds unless authorised.
// Preview builds (STFE_PREVIEW=1, or the dev server) keep it with a "pending authorisation" badge.
function institutionalGate() {
  return {
    name: 'stfe-institutional-gate',
    transformIndexHtml(html, ctx) {
      const preview = process.env.STFE_PREVIEW === '1' || !!ctx.server;
      if (SITE.institutionalMarksApproved) return html.replace(/<!--PREVIEW-BADGE-->[\s\S]*?<!--\/PREVIEW-BADGE-->/g, '');
      if (preview) return html;
      return html.replace(/<!--INSTITUTIONAL-START-->[\s\S]*?<!--INSTITUTIONAL-END-->/g, '');
    },
  };
}

export default defineConfig({
  plugins: [institutionalGate()],
  build: {
    outDir: process.env.STFE_PREVIEW === '1' ? 'dist-preview' : 'dist',
    assetsInlineLimit: 0,
    rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), privacy: resolve(import.meta.dirname, 'privacy.html') } },
  },
});
