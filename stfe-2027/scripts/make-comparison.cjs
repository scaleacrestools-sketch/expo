// Builds STFE-2027-REFERENCE-COMPARISON.pdf: UPITS reference captures beside the redesigned STFE site.
// Reference captures are used for internal design review only.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.resolve(process.argv[2] || 'qa-output');
const shots = path.resolve(process.argv[3] || 'qa-output/shots');
const ref = (f) => path.join(root, 'source-assets/reference', f);
const uri = (p) => fs.existsSync(p) ? `data:image/png;base64,${fs.readFileSync(p).toString('base64')}` : '';
const notes = fs.existsSync(ref('NOTES.md')) ? fs.readFileSync(ref('NOTES.md'), 'utf8') : '';
const esc = (s = '') => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const rows = [
  ['Header & logo hierarchy', 'Institutional identity strip above a large event logo, organised navigation and a prominent registration CTA.', 'Brochure marks (MSME, Make in India, Digital India) at 58–62 px in a white strip; approved STFE logo at 104 px; eight-item navigation; orange “Enquire for a Stall” plus “Visitor Registration”.'],
  ['Hero', 'Full-width exhibition imagery carrying event identity, dates and venue.', 'Full-bleed trade-fair photograph (or muted showreel) with navy overlay; headline, tagline, brochure CTA, and a ticket card with dates 15–16–17, venue, ₹69,030 incl. GST and add-to-calendar.'],
  ['Event facts', 'Counters for scale.', 'Navy overview band: 50+ exhibitors, 4,000 expected visitors, 3 days, 17 categories, free-entry CTA, with an honest planning-figures note.'],
  ['Photography & storytelling', 'Image-rich sections and galleries convey the exhibition atmosphere.', 'Photography in About, Why Exhibit, the categories band, the four-image Exhibition Experience mosaic, four photographic attraction tiles, a six-image gallery and the final CTA — all licensed, credited and labelled representative.'],
  ['Exhibitor pathway', 'Exhibitor information, brochure and layout access, registration.', 'Why exhibit → 17 categories → transparent pricing table → working ground/first-floor plans → downloads → enquiry form, with contextual CTAs throughout.'],
  ['Visitor pathway', 'Separate visitor registration.', 'Free visitor registration section, overview CTA, header link and mobile menu entry — separate from paid-stall leads.'],
  ['Partners & organiser', 'Branded partner presentation.', 'Organiser credentials band plus partner name plates (official logos pending supply).'],
  ['Colour', 'Strong institutional palette.', 'Navy #1b2656 and orange #ec5d24 sampled from the approved logo, with teal/blue/crimson/yellow ribbon accents — alternating photo, navy, cream and white sections.'],
];
const img = (label, p) => p ? `<figure><figcaption>${label}</figcaption><img src="${p}"></figure>` : `<figure><figcaption>${label}</figcaption><div class="na">Capture not available</div></figure>`;
const html = `<style>body{font-family:Arial,sans-serif;margin:24px;color:#1d2131}h1{color:#1b2656;margin:0}h2{color:#1b2656;font-size:17px;margin:26px 0 10px}p.s{color:#555;font-size:13px;margin:4px 0 16px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;break-inside:avoid}figure{margin:0;border:1px solid #ddd;border-radius:8px;overflow:hidden}figcaption{background:#1b2656;color:#fff;font-size:12px;font-weight:bold;padding:6px 10px}figure img{width:100%;display:block}
.na{padding:40px;text-align:center;color:#999}table{width:100%;border-collapse:collapse;font-size:11.5px}th,td{border:1px solid #ddd;padding:7px 9px;vertical-align:top;text-align:left}th{background:#f3ece2;color:#1b2656}td:first-child{font-weight:bold;color:#1b2656;width:16%}
pre{white-space:pre-wrap;font-size:11px;background:#fbf7f1;border:1px solid #eee;padding:10px;border-radius:6px}.mob{display:grid;grid-template-columns:repeat(2,240px);gap:16px}</style>
<h1>STFE 2027 — Reference comparison</h1><p class="s">UP International Trade Show (primary reference) beside the redesigned STFE 2027 website at 1440 px. Reference captures are for internal design review only; no UPITS imagery, logo or artwork is used on the STFE site.</p>
<h2>Desktop first screen</h2><div class="pair">${img('UP International Trade Show', uri(ref('upits-desktop-first-screen.png')))}${img('STFE 2027 (redesign)', uri(path.join(shots, 'stfe-desktop-first-screen.png')))}</div>
<h2>Mobile first screen</h2><div class="mob">${img('UPITS', uri(ref('upits-mobile-first-screen.png')))}${img('STFE 2027', uri(path.join(shots, 'stfe-mobile-first-screen.png')))}</div>
<h2>Page rhythm (upper page)</h2><div class="pair">${img('UPITS — full page (cropped)', uri(path.join(shots, 'upits-desktop-full-crop.png')))}${img('STFE 2027 — full page (cropped)', uri(path.join(shots, 'stfe-desktop-full-crop.png')))}</div>
<h2>How the redesign follows the reference approach</h2><table><tr><th>Aspect</th><th>Reference approach (UPITS)</th><th>STFE 2027 implementation</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>
${notes ? `<h2>Reference design notes (from the capture session)</h2><pre>${esc(notes)}</pre>` : ''}
<h2>Secondary references</h2><div class="pair">${img('INDEX Dubai', uri(ref('index-desktop-first-screen.png')))}${img('MIPIM', uri(ref('mipim-desktop-first-screen.png')))}</div>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.setContent(html, { waitUntil: 'load' });
  await p.pdf({ path: path.join(out, 'STFE-2027-REFERENCE-COMPARISON.pdf'), format: 'A4', landscape: true, printBackground: true, margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' } });
  await p.screenshot({ path: path.join(out, 'STFE-2027-REFERENCE-COMPARISON.png'), fullPage: true });
  await b.close();
  console.log('comparison written');
})();
