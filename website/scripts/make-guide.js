#!/usr/bin/env node
/* Generates assets/downloads/bengaluru-premium-homebuyers-guide.pdf from data/guide.json using Chromium print. */
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const g = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/guide.json'), 'utf8'));
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/site.json'), 'utf8'));
const b64 = f => 'data:' + (f.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg') + ';base64,' + fs.readFileSync(path.join(ROOT, f)).toString('base64');
const cover = b64('source-assets/original-images/projects/assetz-trees-and-tandem/04-tree-lined-boulevard-render.jpg');
const logo = b64('assets/img/assetz-logo-white.svg');
const logoDark = b64('assets/img/assetz-logo.svg');
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Manrope:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Manrope, Arial, sans-serif; color: #1f2422; font-size: 10.5pt; line-height: 1.65; }
.page { width: 210mm; min-height: 297mm; padding: 22mm 20mm 24mm; position: relative; page-break-after: always; }
.cover { padding: 0; background: #1f2422; color: #f5f2ec; display: grid; grid-template-rows: 1fr auto; }
.cover .img { height: 170mm; background: url(${cover}) center/cover; position: relative; }
.cover .img::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(31,36,34,.15), rgba(31,36,34,.95)); }
.cover .logo { position: absolute; top: 18mm; left: 20mm; height: 11mm; z-index: 2; }
.cover .txt { padding: 0 20mm 24mm; margin-top: -60mm; position: relative; z-index: 2; }
.eyebrow { font-size: 8pt; letter-spacing: .24em; text-transform: uppercase; font-weight: 700; color: #b08d57; }
h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: 40pt; line-height: 1.02; margin: 4mm 0 5mm; }
h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: 24pt; line-height: 1.1; margin: 2mm 0 5mm; }
.cover p { color: rgba(245,242,236,.8); max-width: 140mm; font-size: 11pt; }
.cover .foot { display: flex; justify-content: space-between; padding: 8mm 20mm; border-top: 1px solid rgba(245,242,236,.18); font-size: 8pt; color: rgba(245,242,236,.65); }
.num { font-family: 'Cormorant Garamond', serif; font-size: 48pt; color: #d2b682; line-height: 1; }
.chapter p { margin: 0 0 3.5mm; max-width: 165mm; }
.chapter ul { margin: 4mm 0; padding: 5mm 6mm 5mm 11mm; background: #f5f2ec; border-left: 2px solid #b08d57; }
.chapter li { margin-bottom: 1.6mm; }
.pfoot { position: absolute; left: 20mm; right: 20mm; bottom: 12mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: #8b8f88; border-top: 1px solid #e3dfd6; padding-top: 3mm; }
.pfoot img { height: 5mm; }
.toc li { display: flex; justify-content: space-between; border-bottom: 1px solid #e3dfd6; padding: 3mm 0; list-style: none; font-size: 11pt; }
.toc { padding: 0; }
.intro { font-size: 12pt; color: #3a403d; }
.back { background: #2f4a3f; color: #f5f2ec; }
.back p { color: rgba(245,242,236,.82); }
</style></head><body>
<section class="page cover"><div class="img"><img class="logo" src="${logo}"></div>
<div class="txt"><span class="eyebrow">The Homebuyer's Edition · 2026</span><h1>${esc(g.title)}</h1><p>${esc(g.subtitle)}</p></div>
<div class="foot"><span>${esc(site.name)}</span><span>Bengaluru, Karnataka</span></div></section>

<section class="page"><span class="eyebrow">Introduction</span><h2>Before you begin</h2><p class="intro">${esc(g.intro)}</p>
<h2 style="margin-top:12mm">Contents</h2><ol class="toc">${g.chapters.map((c, i) => `<li><span>${String(i + 1).padStart(2, '0')} · ${esc(c.title)}</span><span>${i + 3}</span></li>`).join('')}</ol>
<div class="pfoot"><img src="${logoDark}"><span>Bengaluru Premium Homebuyer's Guide</span></div></section>

${g.chapters.map((c, i) => `<section class="page chapter"><div class="num">${String(i + 1).padStart(2, '0')}</div><span class="eyebrow">Chapter ${i + 1}</span><h2>${esc(c.title)}</h2>${c.bodyHtml}<div class="pfoot"><img src="${logoDark}"><span>${i + 3}</span></div></section>`).join('')}

<section class="page back"><span class="eyebrow" style="color:#d2b682">Next steps</span><h2>Explore Assetz developments</h2>
<p>Five communities across Bengaluru: Naru &amp; Nami in Hoskote, Mizumi Reserve off HSR Layout, Muse &amp; Maison off Hosa Road, Trees &amp; Tandem off Sarjapur Road and Mizu &amp; Ki on Hennur Main Road. Visit the website for verified project details, floor plans and to book a site visit.</p>
<p style="margin-top:6mm">${esc(site.contact.phone)} · ${esc(site.contact.email)}<br>${esc(site.contact.address)}</p>
<h2 style="margin-top:14mm;font-size:16pt">Disclaimer</h2><p style="font-size:8.5pt">${esc(g.disclaimer)}</p></section>
</body></html>`;

(async () => {
  const out = path.join(ROOT, 'assets/downloads/bengaluru-premium-homebuyers-guide.pdf');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(html, { waitUntil: 'networkidle' }).catch(() => p.setContent(html));
  await p.waitForTimeout(800);
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log('Wrote', out, (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
})();
