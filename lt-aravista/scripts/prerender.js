/*
 * Inserts the server-rendered home page into dist/index.html so the hero,
 * headline and CTAs paint before JavaScript loads (faster LCP on mobile).
 * The same file is still served for every route; main.jsx only hydrates on "/".
 */
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);
const file = resolve(root, 'dist/index.html');
const html = readFileSync(file, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('Root marker not found in dist/index.html');
const appHtml = render('/');
let out = html.replace(marker, `<div id="root">${appHtml}</div>`);

// Inline the (small) stylesheet to remove a render-blocking round trip.
const cssFile = readdirSync(resolve(root, 'dist/assets')).find((f) => /^index-.*\.css$/.test(f));
const linkRe = new RegExp(`<link rel="stylesheet"[^>]*href="/assets/${cssFile.replace('.', '\\.')}"[^>]*>`);
if (!linkRe.test(out)) throw new Error('Stylesheet link not found');
const css = readFileSync(resolve(root, 'dist/assets', cssFile), 'utf8');
out = out.replace(linkRe, () => `<style>${css}</style>`);
writeFileSync(file, out);
console.log(`Inlined ${cssFile} (${Math.round(css.length / 1024)} KB)`);
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Prerendered home page (${Math.round(appHtml.length / 1024)} KB of HTML)`);
