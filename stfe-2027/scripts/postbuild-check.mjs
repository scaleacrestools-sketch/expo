// Fails the build if the page advertises a file that does not exist in dist,
// or if a feature flag is on without its asset. Prevents broken downloads shipping.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from '../site.config.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const errors = [];
const warn = [];
const must = (p, why) => {
  const f = resolve(dist, p.replace(/^\//, ''));
  if (!existsSync(f) || statSync(f).size === 0) errors.push(`${why}: missing or empty ${p}`);
};

must('/downloads/STFE-2027-Stall-Pricing-Guide.pdf', 'Pricing guide');
must('/privacy.html', 'Privacy page');
if (SITE.brochureAvailable) must('/downloads/STFE-2027-Brochure.pdf', 'brochureAvailable=true');
else warn.push('Brochure PDF not supplied: brochure buttons fall back to "Request Exhibitor Brochure" via WhatsApp.');
if (SITE.floorPlansAvailable) { must('/assets/floor-plans/ground-floor.png', 'floorPlansAvailable=true'); must('/assets/floor-plans/first-floor.png', 'floorPlansAvailable=true'); }
else warn.push('Floor plans not supplied: viewer shows "Floor plan to be published".');
if (!existsSync(resolve(dist, 'assets/brand/stfe-2027-logo.png'))) warn.push('Approved logo not supplied at public/assets/brand/stfe-2027-logo.png: header shows a plain text name.');
if (SITE.institutionalMarksApproved) {
  if (!Array.isArray(SITE.institutionalMarks) || !SITE.institutionalMarks.length) errors.push('institutionalMarksApproved=true but SITE.institutionalMarks is empty');
  else SITE.institutionalMarks.forEach((m) => must(m.src, 'institutional mark'));
} else warn.push('Institutional (government) marks are NOT published (authorisation not confirmed).');

const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
['exhibitor-enquiry', 'callback-request', 'visitor-registration'].forEach((n) => {
  if (!html.includes(`name="${n}"`) || !html.includes('data-netlify="true"')) errors.push(`Netlify form "${n}" not found in built HTML`);
});
if (/GST\s*extra|\+\s*GST|plus GST/i.test(html)) errors.push('Found wording that implies GST is added on top');

warn.forEach((w) => console.log('  ! ' + w));
if (errors.length) { errors.forEach((e) => console.error('  ✗ ' + e)); process.exit(1); }
console.log('[postbuild-check] OK');
