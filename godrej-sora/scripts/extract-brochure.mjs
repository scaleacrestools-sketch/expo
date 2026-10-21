// Renders mapped brochure pages to masters, and dumps every embedded raster for manual picking.
// Usage: node scripts/extract-brochure.mjs [path/to/brochure.pdf]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const pdf = process.argv[2] || 'assets-source/godrej-sora-brochure.pdf';
if (!fs.existsSync(pdf)) {
  console.error(`Brochure not found at ${pdf}. Place the 64-page PDF at assets-source/godrej-sora-brochure.pdf`);
  process.exit(1);
}
const mapSrc = fs.readFileSync('content/brochure-map.ts', 'utf8');
const entries = [...mapSrc.matchAll(/\{ id: '([^']+)', page: (\d+)(?:, crop: \[([^\]]+)\])?/g)].map((m) => ({
  id: m[1], page: Number(m[2]), crop: m[3] ? m[3].split(',').map(Number) : null,
}));
const masters = path.resolve('public/images/godrej-sora/_masters');
const pagesDir = path.resolve('assets-source/_pages');
const rasterDir = path.resolve('assets-source/_embedded');
fs.mkdirSync(pagesDir, { recursive: true }); fs.mkdirSync(rasterDir, { recursive: true });

// 1) every embedded raster at native resolution (JPEGs copied out losslessly) — skipped when already present
if (!fs.readdirSync(rasterDir).length) {
  try { execFileSync('pdfimages', ['-j', '-p', pdf, path.join(rasterDir, 'img')], { stdio: 'inherit' }); } catch (e) { console.warn('pdfimages failed', e.message); }
}

// 2) mapped pages rendered at 250 dpi, cropped if a crop is set
for (const e of entries) {
  const out = path.join(pagesDir, `p-${String(e.page).padStart(2, '0')}`);
  if (!fs.existsSync(`${out}.jpg`)) execFileSync('pdftoppm', ['-r', '220', '-f', String(e.page), '-l', String(e.page), '-jpeg', '-jpegopt', 'quality=95', '-singlefile', pdf, out]);
  const target = path.join(masters, `${e.id}.jpg`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  let img = sharp(`${out}.jpg`);
  if (e.crop) {
    const { width, height } = await img.metadata();
    const [x, y, w, h] = e.crop.map((v) => v / 100);
    img = img.extract({ left: Math.round(width * x), top: Math.round(height * y), width: Math.round(width * w), height: Math.round(height * h) });
  }
  await img.jpeg({ quality: 95 }).toFile(target);
  console.log(`page ${e.page} → _masters/${e.id}.jpg${e.crop ? ' (cropped)' : ''}`);
}
console.log(`\nEmbedded rasters: ${rasterDir}. Page renders: ${pagesDir}. Review crops in content/brochure-map.ts, then run npm run assets:optimize.`);
