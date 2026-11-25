// Renders public/og-image.png (1200×630) from text only — no logo recreation, no stock imagery.
const { chromium } = require('playwright');
const path = require('path');
const font = (w) => 'file://' + path.resolve(`node_modules/@ibm/plex-sans/fonts/complete/woff2/IBMPlexSans-${w}.woff2`);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(`<style>
    @font-face{font-family:P;src:url(${font('Regular')});font-weight:400}
    @font-face{font-family:P;src:url(${font('SemiBold')});font-weight:600}
    @font-face{font-family:P;src:url(${font('Bold')});font-weight:700}
    body{margin:0;width:1200px;height:630px;background:#0b2545;color:#fff;font-family:P;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;box-sizing:border-box;border-bottom:10px solid #e8701a}
    .k{font-size:20px;letter-spacing:.16em;text-transform:uppercase;color:#e8701a;font-weight:600}
    h1{font-size:66px;line-height:1.05;margin:18px 0 0;font-weight:600;letter-spacing:-.02em;max-width:900px}
    .row{display:flex;gap:48px;font-size:24px;color:rgba(255,255,255,.85)} .row b{display:block;color:#fff;font-size:30px;font-weight:700}
  </style><div><div class="k">STFE 2027 · Smart Trade Fair &amp; Expo</div><h1>Showcase your business. Connect with new opportunities.</h1></div>
  <div class="row"><div><b>15–17 Jan 2027</b>Soor Sadan Auditorium, Agra</div><div><b>₹69,030</b>Stall incl. GST</div><div><b>Free</b>Visitor entry</div></div>`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'public/og-image.png' });
  await b.close();
})();
