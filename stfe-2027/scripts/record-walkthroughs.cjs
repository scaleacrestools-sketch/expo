// Records real browser walkthroughs of the built site (served by scripts/qa-server.mjs).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.env.QA_BASE || 'http://localhost:4321';
const OUT = path.resolve(process.argv[2] || 'qa-output/video');

async function glide(page, selector, offset = 0, ms = 1400) {
  await page.evaluate(async ({ selector, offset, ms }) => {
    const el = typeof selector === 'number' ? null : document.querySelector(selector);
    const header = document.querySelector('.site-header').getBoundingClientRect().height;
    const target = el ? el.getBoundingClientRect().top + scrollY - header - 12 + offset : selector;
    const start = scrollY, dist = target - start, t0 = performance.now();
    await new Promise((res) => {
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms); const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        window.scrollTo(0, start + dist * e);
        k < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });
  }, { selector, offset, ms });
  await page.waitForTimeout(250);
}
const type = (page, sel, text) => page.type(sel, text, { delay: 45 });

async function record(name, viewport, script) {
  const dir = path.join(OUT, name);
  fs.rmSync(dir, { recursive: true, force: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, recordVideo: { dir, size: viewport } , ...(viewport.width < 500 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : {}) });
  const page = await ctx.newPage();
  await page.goto(BASE + '/?utm_source=walkthrough&utm_medium=qa', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await script(page);
  await page.waitForTimeout(1200);
  const v = page.video();
  await ctx.close(); await browser.close();
  const file = await v.path();
  console.log(name, '→', file);
  return file;
}

(async () => {
  const desktop = await record('desktop', { width: 1440, height: 900 }, async (p) => {
    await p.hover('#nav-links a[href="#pricing"]'); await p.waitForTimeout(700);
    await p.hover('.nav__actions .btn--primary'); await p.waitForTimeout(900);
    await glide(p, '.facts', -40, 1200); await p.waitForTimeout(1000);
    await glide(p, '#about', 0, 1200); await p.waitForTimeout(1200);
    await glide(p, '#organiser', 0, 1400); await p.waitForTimeout(2000);
        await glide(p, '#why-exhibit', 0, 1400); await p.waitForTimeout(2200);
    await glide(p, '#categories', 0, 1400); await p.waitForTimeout(1800);
    await glide(p, '#pricing', 0, 1400); await p.waitForTimeout(1200);
    await glide(p, '.pricing__grid', -60, 900); await p.waitForTimeout(2400);
    await p.hover('.stall-table__foot .btn--primary'); await p.waitForTimeout(800);
    await glide(p, '#floor-plans', 0, 1400); await p.waitForTimeout(1000);
    await p.click('#tab-first'); await p.waitForTimeout(1200);
    await p.click('#tab-ground'); await p.waitForTimeout(900);
    await p.click('#zoom-in'); await p.waitForTimeout(500); await p.click('#zoom-in'); await p.waitForTimeout(1000); await p.click('#zoom-reset'); await p.waitForTimeout(600);
    await p.click('#fullscreen'); await p.waitForTimeout(1500);
    await p.click('#fullscreen'); await p.waitForTimeout(700);
    await glide(p, '#downloads', 0, 1400); await p.waitForTimeout(2500);
    await glide(p, '#enquire', 0, 1400); await p.waitForTimeout(800);
    await p.click('#exhibitor-form button[type="submit"]'); await p.waitForTimeout(1400);
    await type(p, '#ex-name', 'Ankit Sharma');
    await type(p, '#ex-company', 'Sharma Leather Works');
    await type(p, '#ex-mobile', '9876543210');
    await type(p, '#ex-email', 'ankit@example.com');
    await p.click('label[for="st-3x3"]'); await p.waitForTimeout(400);
    await type(p, '#ex-city', 'Agra');
    await p.selectOption('#ex-category', 'Leather Goods & Footwear'); await p.waitForTimeout(300);
    await glide(p, '#ex-message', -200, 700);
    await type(p, '#ex-message', 'Interested in a stall for our footwear range.');
    await p.check('#ex-consent'); await p.waitForTimeout(400);
    await p.click('#exhibitor-form button[type="submit"]');
    await p.waitForSelector('#exhibitor-form .form-status.is-success');
    await glide(p, '#exhibitor-form', -60, 700); await p.waitForTimeout(2600);
    await glide(p, '#programme', 0, 1400); await p.waitForTimeout(2200);
    await glide(p, '.days', -40, 1200); await p.waitForTimeout(1800);
    await glide(p, '#partners', 0, 1200); await p.waitForTimeout(1500);
    await glide(p, '#venue', 0, 1200); await p.waitForTimeout(1500);
    await glide(p, '#faq', 0, 1200);
    await p.click('.faq details:nth-child(5) summary'); await p.waitForTimeout(1400);
    await glide(p, '#visitor-registration', 0, 1200); await p.waitForTimeout(1500);
    await glide(p, '#venue', 0, 1200); await p.waitForTimeout(1800);
    await glide(p, 99999, 0, 1400); await p.waitForTimeout(2200);
  });

  const mobile = await record('mobile', { width: 390, height: 844 }, async (p) => {
    await p.waitForTimeout(800);
    await glide(p, '.hero__card', -20, 1200); await p.waitForTimeout(1500);
    await glide(p, 0, 0, 800);
    await p.tap('#nav-toggle'); await p.waitForTimeout(1600);
    await p.tap('#mobile-menu a[href="#pricing"]'); await p.waitForTimeout(1500);
    await glide(p, '.rate-card', -20, 900); await p.waitForTimeout(1800);
    await glide(p, '.stall-table', -20, 1200); await p.waitForTimeout(2000);
    await glide(p, '#floor-plans', 0, 1200); await p.waitForTimeout(800);
    await glide(p, '#plan-viewer', -20, 900); await p.waitForTimeout(800);
    await p.tap('#tab-first'); await p.waitForTimeout(900);
    await p.tap('#fullscreen'); await p.waitForTimeout(1500);
    await p.tap('#fullscreen'); await p.waitForTimeout(800);
    await glide(p, '#downloads', 0, 1400); await p.waitForTimeout(1200);
    await glide(p, '#visitor-registration', 0, 2200); await p.waitForTimeout(800);
    await glide(p, '#visitor-form', -10, 700);
    await type(p, '#vr-name', 'Priya Verma');
    await type(p, '#vr-mobile', '9811122233');
    await p.selectOption('#vr-interest', 'Business owner / buyer');
    await p.tap('#vr-consent'); await p.waitForTimeout(300);
    await glide(p, '#visitor-form button[type="submit"]', -300, 600);
    await p.tap('#visitor-form button[type="submit"]');
    await p.waitForSelector('#visitor-form .form-status.is-success'); await p.waitForTimeout(2200);
    await glide(p, '#enquire', 0, 1600); await p.waitForTimeout(800);
    await glide(p, '#exhibitor-form', -10, 700);
    await type(p, '#ex-name', 'Rohit Gupta');
    await type(p, '#ex-company', 'Gupta Organic Foods');
    await type(p, '#ex-mobile', '98', ); await p.waitForTimeout(200);
    await p.tap('#exhibitor-form button[type="submit"]').catch(()=>{}); await p.waitForTimeout(1500);
    await glide(p, '#ex-mobile', -120, 500);
    await p.fill('#ex-mobile', ''); await type(p, '#ex-mobile', '9822233344');
    await type(p, '#ex-email', 'rohit@example.com');
    await p.tap('label[for="st-guide"]');
    await glide(p, '#ex-consent', -200, 600);
    await p.tap('#ex-consent');
    await p.tap('#exhibitor-form button[type="submit"]');
    await p.waitForSelector('#exhibitor-form .form-status.is-success');
    await glide(p, '#exhibitor-form .form-status', -300, 600); await p.waitForTimeout(2200);
    await glide(p, '#programme', 0, 1400); await p.waitForTimeout(1500);
    await p.waitForTimeout(1500); // mobile bar visible
    await glide(p, 99999, 0, 2000); await p.waitForTimeout(1500);
  });
  fs.writeFileSync(path.join(OUT, 'paths.json'), JSON.stringify({ desktop, mobile }));
})();
