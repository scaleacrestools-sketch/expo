import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { SITE } from './site.config.js';

const root = import.meta.dirname;
const pub = (p) => resolve(root, 'public', p);
const readJson = (p) => { try { return JSON.parse(readFileSync(pub(p), 'utf8')); } catch { return []; } };
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// 1. Institutional marks: production builds strip them until authorised; preview/dev keep them with a badge.
// 2. Photo/video slots: <!--PHOTO:slug-->…<!--/PHOTO--> is kept only if the licensed file exists.
//    A <!--SECTION:x--> block with no remaining photos is removed entirely (never an empty frame).
// 3. <!--PHOTO-CREDITS--> is replaced with the credit list from public/assets/{photos,video}/credits.json.
function stfeHtml() {
  return {
    name: 'stfe-html',
    transformIndexHtml(html, ctx) {
      const preview = process.env.STFE_PREVIEW === '1' || !!ctx.server;
      if (SITE.institutionalMarksApproved) html = html.replace(/<!--PREVIEW-BADGE-->[\s\S]*?<!--\/PREVIEW-BADGE-->/g, '');
      else if (!preview) html = html.replace(/<!--INSTITUTIONAL-START-->[\s\S]*?<!--INSTITUTIONAL-END-->/g, '');

      html = html.replace(/<!--PHOTO:([\w-]+)-->([\s\S]*?)<!--\/PHOTO-->/g, (_, slug, inner) =>
        existsSync(pub(`assets/photos/${slug}.webp`)) && existsSync(pub(`assets/photos/${slug}-1200.webp`)) ? inner : '');
      html = html.replace(/<!--VIDEO:([\w-]+)-->([\s\S]*?)<!--\/VIDEO-->/g, (_, slug, inner) =>
        existsSync(pub(`assets/video/${slug}.mp4`)) && existsSync(pub(`assets/video/${slug}-poster.webp`)) ? inner : '');
      html = html.replace(/<!--SECTION:([\w-]+)-->([\s\S]*?)<!--\/SECTION:\1-->/g, (_, __, inner) =>
        /\/assets\/photos\//.test(inner) ? inner : '');

      const usedIn = html.includes('<!--PHOTO-CREDITS-->') ? readFileSync(resolve(root, 'index.html'), 'utf8') : html;
      const credits = [...readJson('assets/photos/credits-user.json'), ...readJson('assets/photos/credits.json'), ...readJson('assets/video/credits.json')]
        .filter((c) => c.file && new RegExp(`/assets/(photos|video)/${c.file.replace(/\.(webp|mp4)$/, '')}(-1200)?\\.`).test(usedIn));
      const list = credits.length
        ? `<p>Illustrative and representative trade-exhibition images — not photographs of a previous STFE edition. Venue photograph and floor plans from the official STFE 2027 brochure.</p><ul>${credits.map((c) =>
          `<li>${esc(c.placement || c.file)}: “${esc(c.title || c.file)}” by ${esc(c.author || 'unknown')} — <a href="${esc(c.source_url)}" target="_blank" rel="noopener">${esc(c.source)}</a>, ${c.license_url ? `<a href="${esc(c.license_url)}" target="_blank" rel="noopener">${esc(c.license)}</a>` : esc(c.license)}</li>`).join('')}</ul>`
        : '<p>Venue photograph and floor plans from the official STFE 2027 brochure.</p>';
      return html.replace('<!--PHOTO-CREDITS-->', list);
    },
  };
}

export default defineConfig({
  plugins: [stfeHtml()],
  build: {
    outDir: process.env.STFE_PREVIEW === '1' ? 'dist-preview' : 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        privacy: resolve(root, 'privacy.html'),
        terms: resolve(root, 'terms.html'),
        credits: resolve(root, 'credits.html'),
      },
    },
  },
});
