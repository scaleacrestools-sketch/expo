// Full-page and first-screen screenshots for review, comparison and delivery.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [url, shots, out] = process.argv.slice(2);
const { execFileSync } = require('child_process');
(async () => {
  const b = await chromium.launch();
  async function cap(w, h, dpr, full, file) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
    await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' + (full ? '.mobile-bar{display:none!important}' : '') });
    if (full) await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } scrollTo(0, 0); });
    await p.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    await p.waitForTimeout(500);
    await p.screenshot({ path: file, fullPage: full });
    await p.close();
  }
  await cap(1440, 900, 1, false, path.join(shots, 'stfe-desktop-first-screen.png'));
  await cap(390, 844, 1, false, path.join(shots, 'stfe-mobile-first-screen.png'));
  await cap(1440, 900, 1, true, path.join(shots, 'stfe-desktop-full.png'));
  await cap(768, 1024, 1, true, path.join(shots, 'stfe-tablet-full.png'));
  await cap(1440, 900, 1, true, path.join(out, 'STFE-2027-FINAL-DESKTOP.png'));
  await cap(390, 844, 2, true, path.join(out, 'STFE-2027-FINAL-MOBILE.png'));
  {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.locator('footer').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
    await p.addStyleTag({ content: '.wa-float{display:none!important}' });
    await p.locator('footer').screenshot({ path: path.join(out, 'STFE-2027-FOOTER-CLOSEUP.png') });
    await p.close();
  }
  await b.close();
  // crops for the comparison board
  const py = `
from PIL import Image
import sys, os
s=sys.argv[1]
for src,dst in [('stfe-desktop-full.png','stfe-desktop-full-crop.png')]:
    im=Image.open(os.path.join(s,src)); im.crop((0,0,im.width,min(im.height,4200))).save(os.path.join(s,dst))
ref=sys.argv[2]
if os.path.exists(ref):
    im=Image.open(ref); im.crop((0,0,im.width,min(im.height,4200))).save(os.path.join(s,'upits-desktop-full-crop.png'))
`;
  execFileSync('python3', ['-I', '-c', py, shots, path.resolve(__dirname, '../source-assets/reference/upits-desktop-full.png')], { stdio: 'inherit' });
  console.log('screenshots done');
})();
