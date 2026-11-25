// Fails the build if a promised file is missing/empty, a form is absent, or the institutional gate is wrong.
import { existsSync, readFileSync, statSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from '../site.config.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const preview = process.env.STFE_PREVIEW === '1';
const dist = resolve(root, preview ? 'dist-preview' : 'dist');
const errors = [];
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
// Production builds must not ship the government mark files until authorised (they are unreferenced there).
if (!preview && !SITE.institutionalMarksApproved) rmSync(resolve(dist, 'assets/institutional'), { recursive: true, force: true });

// every local asset referenced by the page must exist and be non-empty
const refs = new Set([...html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0])).filter((u) => u.startsWith('/') && !u.startsWith('//')));
for (const u of refs) {
  const f = resolve(dist, u.split('#')[0].split('?')[0].replace(/^\//, '') || 'index.html');
  if (!existsSync(f) || statSync(f).size === 0) errors.push(`missing or empty: ${u}`);
}
['downloads/STFE-2027-Brochure.pdf', 'downloads/STFE-2027-Stall-Pricing-Guide.pdf', 'assets/floor-plans/ground-floor.png', 'assets/floor-plans/first-floor.png', 'assets/brand/stfe-2027-logo.png', 'privacy.html']
  .forEach((p) => { if (!existsSync(resolve(dist, p))) errors.push(`required file missing: ${p}`); });
['exhibitor-enquiry', 'callback-request', 'visitor-registration', 'stall-details'].forEach((n) => { if (!html.includes(`name="${n}"`)) errors.push(`form ${n} missing`); });
const hasMarks = html.includes('assets/institutional/');
if (!SITE.institutionalMarksApproved && !preview && (hasMarks || existsSync(resolve(dist, 'assets/institutional')))) errors.push('institutional marks present in a production build without approval');
if (preview && !hasMarks) errors.push('preview build should show the institutional strip');
if (/plus GST|\+\s?GST|GST extra|government approved|official sponsor/i.test(html)) errors.push('prohibited wording found');

if (errors.length) { errors.forEach((e) => console.error('  ✗ ' + e)); process.exit(1); }
console.log(`[postbuild-check] OK (${preview ? 'preview — institutional marks shown, pending authorisation' : SITE.institutionalMarksApproved ? 'production — marks approved' : 'production — institutional marks withheld until authorised'}) · ${refs.size} local references verified`);
