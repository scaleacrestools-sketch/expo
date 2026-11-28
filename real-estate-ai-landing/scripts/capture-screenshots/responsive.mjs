#!/usr/bin/env node
/** Full-page captures + overflow check at the V3 test sizes. Usage: node scripts/capture-screenshots/responsive.mjs [baseUrl] [outDir] */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
const base = process.argv[2] || 'http://localhost:4173/';
const out = process.argv[3] || 'preview/v3/responsive';
mkdirSync(out, { recursive: true });
const sizes = [[320, 568], [360, 800], [375, 812], [390, 844], [430, 932], [768, 1024]];
const b = await chromium.launch();
for (const [w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: true, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); const errors = [];
  p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.body.scrollHeight,
    small: [...document.querySelectorAll('button, a, [role=tab], [role=radio]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 32 && r.width < 32); }).length }));
  await p.screenshot({ path: join(out, `fullpage-${w}x${h}.png`), fullPage: true });
  console.log(`${w}x${h}`, JSON.stringify({ overflow: m.sw > m.cw, pageHeight: m.h, tinyTargets: m.small, errors: errors.length }));
  await ctx.close();
}
await b.close();
