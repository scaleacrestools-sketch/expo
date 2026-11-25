// Renders public/og-image.png (1200×630) from the approved logo, the brochure's venue photograph and text.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const f = (w) => 'data:font/woff2;base64,' + fs.readFileSync(path.resolve(`node_modules/@ibm/plex-sans/fonts/complete/woff2/IBMPlexSans-${w}.woff2`)).toString('base64');
const data = (p, t) => `data:${t};base64,${fs.readFileSync(p).toString('base64')}`;
(async () => {
  const logo = data('public/assets/brand/stfe-2027-logo-640.webp', 'image/webp');
  const venue = data('public/assets/venue/soor-sadan-auditorium-cutout.webp', 'image/webp');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(`<style>
    @font-face{font-family:P;src:url(${f('Regular')});font-weight:400}
    @font-face{font-family:P;src:url(${f('Bold')});font-weight:700}
    body{margin:0;width:1200px;height:630px;background:#ffffff;font-family:P;position:relative;overflow:hidden}
    .bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#fdce18,#ec5d24 22%,#c81f3f 42%,#1262ae 66%,#27bdc5)}
    .venue{position:absolute;right:-30px;bottom:8px;width:640px}
    .copy{position:absolute;left:64px;top:52px;width:560px}
    .copy img{height:150px}
    h1{font-size:46px;line-height:1.08;color:#1b2656;margin:26px 0 0;font-weight:700;letter-spacing:-.02em}
    h1 span{color:#ec5d24}
    .row{margin-top:30px;display:flex;gap:28px;color:#3d4356;font-size:21px}
    .row b{display:block;color:#1b2656;font-size:28px}
  </style>
  <img class="venue" src="${venue}">
  <div class="copy"><img src="${logo}"><h1>Showcase Your Brand.<br><span>Connect With Business Opportunities.</span></h1>
  <div class="row"><div><b>15–17 Jan 2027</b>Soor Sadan Auditorium, Agra</div><div><b>₹69,030</b>Stall incl. GST</div></div></div>
  <div class="bar"></div>`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: 'public/og-image.png' });
  await b.close();
})();
