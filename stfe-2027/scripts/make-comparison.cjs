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
  ['Colour system (sampled)', 'Plum #8f1d6d → indigo #36315f gradient bars; orange #f07a3f → lilac #9c6bb3 CTAs; two-tone indigo/plum headings; white and pale-plum (8%) section backgrounds; #333 body text.', 'Same sampled tokens as CSS variables: gradient top bar and nav, orange→lilac CTAs, two-tone uppercase headings, white / #f6edf3 alternating sections. No navy section backgrounds.'],
  ['Header', 'Gradient utility bar (email pill, CTA, socials) → white logo strip with edition badge and CTA tile → gradient uppercase nav with home icon.', 'Gradient utility bar (email pill, phone, dates, Visitor Registration, Enquire) → white strip with final STFE logo, 15th–17th edition badge, brochure identity marks (preview only) → sticky gradient uppercase nav with home icon and orange CTA.'],
  ['Hero', 'Full-width exhibition imagery.', 'Full-width licensed exhibition-hall photograph with a light left-side shade; short uppercase title, tagline pill, dates, venue, price chip, two CTAs and a compact 3-field lead form.'],
  ['Statistics', 'Gradient pill with four counters under the hero.', 'Orange → plum gradient band with 50+ exhibitors, 4,000 expected visitors, 3 days, 17 categories and a planning-figures note.'],
  ['Content blocks', 'Dashed-border two-column checklist; violet category tabs; Event-at-a-Glance photo cards with orange outline; exhibitors (purple) / visitors (orange) split.', 'Dashed-border six-benefit checklist with photo; violet-tab category directory; photo collage + orange-outlined attraction cards + gradient day tabs; plum exhibitor-enquiry / orange visitor-registration split panels.'],
  ['Footer', 'Light footer columns, then gradient copyright bar.', 'Compact light footer (logo, event, organiser) and gradient bottom bar with Privacy, Terms and Image credits.'],
];
const img = (label, p) => p ? `<figure><figcaption>${label}</figcaption><img src="${p}"></figure>` : `<figure><figcaption>${label}</figcaption><div class="na">Capture not available</div></figure>`;
const html = `<style>body{font-family:Arial,sans-serif;margin:24px;color:#1d2131}h1{color:#36315f;margin:0}h2{color:#36315f;font-size:17px;margin:26px 0 10px}p.s{color:#555;font-size:13px;margin:4px 0 16px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;break-inside:avoid}figure{margin:0;border:1px solid #ddd;border-radius:8px;overflow:hidden}figcaption{background:#8f1d6d;color:#fff;font-size:12px;font-weight:bold;padding:6px 10px}figure img{width:100%;display:block}
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
