#!/usr/bin/env node
/**
 * Captures browser-rendered screenshots of every section plus full-page shots.
 * Usage: node scripts/capture-screenshots/capture.mjs [baseUrl] [outDir]
 * Default baseUrl http://localhost:4173 (run `npm run preview` first).
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const base = process.argv[2] || 'http://localhost:4173/';
const out = process.argv[3] || 'preview/screenshots';
const only = process.argv[4]; // optional: comma-separated names
mkdirSync(out, { recursive: true });

export const sections = [
  ['navigation', '[data-testid="navbar"]'],
  ['hero-desktop', '#top'],
  ['trusted-by', '#trusted'],
  ['problem-section', '#problem'],
  ['lead-funnel', '#funnel'],
  ['performance-dashboard', '#performance'],
  ['how-it-works', '#how-it-works'],
  ['ai-voice-agents', '#voice-agents'],
  ['omnichannel-automation', '#omnichannel'],
  ['product-features', '#features'],
  ['use-cases', '#use-cases'],
  ['real-estate-qualification', '#qualification'],
  ['integrations', '#integrations'],
  ['mobile-crm', '#mobile'],
  ['feature-comparison', '#compare'],
  ['faq-section', '#faq'],
  ['final-cta', '#cta'],
  ['footer', '[data-testid="footer"]'],
];

async function settle(page) {
  await page.waitForSelector('[data-testid="footer"]', { state: 'attached' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

const browser = await chromium.launch();
// Full-page captures use 1x scale: a 2x mobile page exceeds the 32,767px height many image viewers support.
// Desktop: reduced motion shows every animated demo in its completed state, which suits static screenshots.
for (const [w, tag, scale] of [[1440, 'desktop', 1], [390, 'mobile', 1]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: scale, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page);
  if (!only) {
    await page.screenshot({ path: join(out, `homepage-${tag}.png`), fullPage: true });
    console.log('full', tag);
  }
  if (tag === 'desktop') {
    for (const [name, sel] of sections) {
      if (only && !only.split(',').includes(name)) continue;
      const el = page.locator(sel).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      if (name === 'navigation') {
        await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
        await page.screenshot({ path: join(out, `${name}.png`), clip: { x: 0, y: 0, width: w, height: 80 } });
        continue;
      }
      // Hide the fixed navbar so it does not overlap section captures, then clip from a full-page render.
      await page.addStyleTag({ content: '[data-testid="navbar"]{visibility:hidden!important}' }).catch(() => {});
      const box = await el.evaluate((n) => { const r = n.getBoundingClientRect(); return { x: 0, y: r.top + window.scrollY, width: document.documentElement.clientWidth, height: r.height }; });
      await page.screenshot({ path: join(out, `${name}.png`), fullPage: true, clip: box });
      await page.addStyleTag({ content: '[data-testid="navbar"]{visibility:visible!important}' }).catch(() => {});
      console.log('section', name);
    }
  }
  await ctx.close();
}
await browser.close();
