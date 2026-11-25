// Builds STFE-2027-IMAGE-CONTACT-SHEET.pdf/.png: every photograph used, its placement, source and licence.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = path.resolve(process.argv[2] || 'qa-output');
const root = path.resolve(__dirname, '..');
const read = (p) => { try { return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')); } catch { return []; } };
const credits = read('public/assets/photos/credits.json').filter((c) => fs.existsSync(path.join(root, 'public/assets/photos', c.file)));
const video = read('public/assets/video/credits.json');
const uri = (p, t) => `data:${t};base64,${fs.readFileSync(p).toString('base64')}`;
const esc = (s = '') => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const brochure = [
  { img: 'public/assets/venue/soor-sadan-auditorium-cutout.webp', placement: 'About (inset), Venue section, OG image', title: 'Soor Sadan Auditorium, Agra', source: 'Official STFE 2027 brochure, page 1 (organiser-supplied)', license: 'Organiser asset — confirm web reuse rights' },
  { img: 'public/assets/floor-plans/ground-floor-preview.webp', placement: 'Floor plans viewer, downloads', title: 'Ground floor layout plan', source: 'Official STFE 2027 brochure, page 3', license: 'Organiser asset' },
  { img: 'public/assets/floor-plans/first-floor-preview.webp', placement: 'Floor plans viewer', title: 'First floor layout plan', source: 'Official STFE 2027 brochure, page 3', license: 'Organiser asset' },
];
const card = (src, c) => `<div class="c"><img src="${src}"><div class="m"><b>${esc(c.file || c.title)}</b><span class="p">${esc(c.placement)}</span><span>“${esc(c.title)}”${c.author ? ' — ' + esc(c.author) : ''}</span><span>${esc(c.source)} · <i>${esc(c.license)}</i></span>${c.source_url ? `<span class="u">${esc(c.source_url)}</span>` : ''}</div></div>`;
const html = `<style>body{font-family:Arial,sans-serif;margin:24px;color:#1d2131}h1{color:#1b2656;margin:0 0 4px}p{margin:0 0 16px;color:#555;font-size:13px}
.g{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.c{border:1px solid #ddd;border-radius:8px;overflow:hidden;break-inside:avoid}.c img{width:100%;height:170px;object-fit:cover;display:block;background:#f3ece2}
.m{padding:8px 10px;font-size:11px;display:grid;gap:3px}.m b{color:#1b2656;font-size:12px}.p{color:#c9481a;font-weight:bold}.u{color:#127c84;word-break:break-all}h2{color:#1b2656;margin:24px 0 10px;font-size:16px}</style>
<h1>STFE 2027 — Image contact sheet</h1><p>Every photograph used on the website, where it appears, and its source and licence. Trade-exhibition photographs are representative images, not photographs of a previous STFE edition.</p>
<h2>Licensed exhibition photography (${credits.length})</h2><div class="g">${credits.map((c) => card(uri(path.join(root, 'public/assets/photos', c.file.replace('.webp', '-1200.webp')), 'image/webp'), c)).join('')}</div>
${video.length ? `<h2>Showreel footage (${video.length} clips)</h2><div class="g">${video.map((c) => card(fs.existsSync(path.join(root, 'public/assets/video/showreel-poster.webp')) ? uri(path.join(root, 'public/assets/video/showreel-poster.webp'), 'image/webp') : '', c)).join('')}</div>` : ''}
<h2>Organiser assets from the official brochure</h2><div class="g">${brochure.map((b) => card(uri(path.join(root, b.img), 'image/webp'), b)).join('')}</div>`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.setContent(html, { waitUntil: 'load' });
  await p.pdf({ path: path.join(out, 'STFE-2027-IMAGE-CONTACT-SHEET.pdf'), format: 'A4', landscape: true, printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
  await p.screenshot({ path: path.join(out, 'STFE-2027-IMAGE-CONTACT-SHEET.png'), fullPage: true });
  await b.close();
  console.log('contact sheet:', credits.length, 'photos,', video.length, 'clips');
})();
