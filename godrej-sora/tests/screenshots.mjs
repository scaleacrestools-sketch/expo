import { chromium } from '@playwright/test';
const base = process.env.BASE_URL || 'http://localhost:3100';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const shots = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 1, isMobile: !!s.mobile, hasTouch: !!s.mobile, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base, { waitUntil: 'networkidle' });
  // scroll through to trigger reveals
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += s.height / 2) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `docs/screenshots/${s.name}-hero.png` });
  await page.screenshot({ path: `docs/screenshots/${s.name}-full.png`, fullPage: true });
  // open drawer
  await page.getByRole('button', { name: 'Request Private Brochure' }).first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `docs/screenshots/${s.name}-drawer.png` });
  // a11y sanity
  const a11y = await page.evaluate(() => {
    const out = {};
    out.imagesWithoutAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length;
    out.buttonsWithoutName = [...document.querySelectorAll('button')].filter((b) => !(b.textContent || '').trim() && !b.getAttribute('aria-label')).length;
    out.h1 = document.querySelectorAll('h1').length;
    out.headings = [...document.querySelectorAll('h1,h2,h3')].map((h) => h.tagName).join(' ');
    out.horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    return out;
  });
  console.log(s.name, JSON.stringify(a11y), 'errors:', errors);
  await ctx.close();
}
await browser.close();
