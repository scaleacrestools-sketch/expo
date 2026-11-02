// Renders each exported SVG through Chromium (as an <img>) to verify it parses and to produce
// a preview of the SVG itself (not of the live app). Usage: node scripts/render-svg-previews.mjs
import { createRequire } from 'node:module';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = path.join(ROOT, 'exports/svg');
const PNG_DIR = path.join(ROOT, 'exports/previews');

const browser = await chromium.launch();
const results = [];
for (const name of (await readdir(SVG_DIR)).filter((f) => f.endsWith('.svg'))) {
  const file = path.join(SVG_DIR, name);
  const svg = await readFile(file, 'utf8');
  const [, w, h] = svg.match(/<svg[^>]*\swidth="(\d+(?:\.\d+)?)"\s+height="(\d+(?:\.\d+)?)"/) ?? [];
  const width = Math.ceil(Number(w));
  const height = Math.ceil(Number(h));
  const page = await browser.newPage({ viewport: { width, height: Math.min(height, 2000) }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.setContent(`<!doctype html><html><body style="margin:0"><img id="i" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" width="${width}" height="${height}" style="display:block"></body></html>`);
  const loaded = await page.evaluate(() => new Promise((res) => { const i = document.getElementById('i'); if (i.complete) res(i.naturalWidth > 0); i.onload = () => res(true); i.onerror = () => res(false); }));
  await page.locator('#i').screenshot({ path: path.join(PNG_DIR, name.replace('.svg', '.svg-render.png')), timeout: 120000 });
  // Strict XML parse inside the browser too.
  const parse = await page.evaluate((src) => { const doc = new DOMParser().parseFromString(src, 'image/svg+xml'); const err = doc.querySelector('parsererror'); return err ? err.textContent : 'ok'; }, svg);
  results.push({ name, width, height, loaded, parse, errors });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
