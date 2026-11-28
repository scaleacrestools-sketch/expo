#!/usr/bin/env node
/**
 * Captures every section (desktop 1440×900 and mobile 390×844 @2x) plus full-page shots.
 * Usage: node scripts/capture-screenshots/capture.mjs [baseUrl] [outDir] [suffix]
 * Output: <outDir>/desktop/NN-name.png, <outDir>/mobile/NN-name.png, <outDir>/homepage-{desktop,mobile}<suffix>.png
 * Sections are captured in their finished state (reduced motion), so every demo shows its final frame.
 */
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const base = process.argv[2] || 'http://localhost:4173/';
const out = process.argv[3] || 'preview/screenshots';
const suffix = process.argv[4] || '';

export const sections = [
  ['navigation', '[data-testid="navbar"]'], ['hero', '#top'], ['trusted-by', '#trusted'], ['problem', '#problem'],
  ['lead-funnel', '#funnel'], ['performance', '#performance'], ['how-it-works', '#how-it-works'], ['ai-voice-agents', '#voice-agents'],
  ['omnichannel', '#omnichannel'], ['features', '#features'], ['use-cases', '#use-cases'], ['qualification', '#qualification'],
  ['integrations', '#integrations'], ['mobile-crm', '#mobile'], ['comparison', '#compare'], ['faq', '#faq'], ['final-cta', '#cta'], ['footer', '[data-testid="footer"]'],
];

async function settle(page) {
  await page.waitForSelector('[data-testid="footer"]', { state: 'attached' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1200);
}

const browser = await chromium.launch();
for (const tag of ['desktop', 'mobile']) {
  const ctx = tag === 'desktop'
    ? await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
    : await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page);
  // Full page at 1x so tall images stay viewable.
  if (tag === 'mobile') { const p2 = await (await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1, reducedMotion: 'reduce' })).newPage(); await p2.goto(base, { waitUntil: 'networkidle' }); await settle(p2); await p2.screenshot({ path: join(out, `homepage-mobile${suffix}.png`), fullPage: true }); await p2.context().close(); }
  else await page.screenshot({ path: join(out, `homepage-desktop${suffix}.png`), fullPage: true });
  mkdirSync(join(out, tag), { recursive: true });
  const w = page.viewportSize().width;
  for (const [i, [name, sel]] of sections.entries()) {
    const file = join(out, tag, `${String(i + 1).padStart(2, '0')}-${name}.png`);
    if (name === 'navigation') {
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: 72 } });
      continue;
    }
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
    await page.addStyleTag({ content: '[data-testid="navbar"]{visibility:hidden!important}' });
    const box = await el.evaluate((n) => { const r = n.getBoundingClientRect(); return { x: 0, y: r.top + window.scrollY, width: document.documentElement.clientWidth, height: r.height }; });
    await page.screenshot({ path: file, fullPage: true, clip: box });
    await page.addStyleTag({ content: '[data-testid="navbar"]{visibility:visible!important}' });
  }
  console.log(tag, 'done');
  await ctx.close();
}
await browser.close();
