// Headless verification: screenshots + overflow checks + interaction flow at 1440 / 768 / 390 px.
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

// Playwright is resolved via require so a globally pre-installed copy works from any directory.
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const OUT = process.env.OUT_DIR ?? 'exports/previews';
const widths = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const results = [];

for (const vp of widths) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  const headings = await page.locator('h2').allTextContents();
  await page.screenshot({ path: `${OUT}/crm-dashboard-${vp.name}.png`, fullPage: true });

  // Interaction flow: open first at-risk record, schedule follow-up, confirm toast.
  const firstRisk = page.locator('[data-export-group="overdue-followups"] li button').first();
  const riskName = (await firstRisk.locator('span.font-semibold.text-sm').first().textContent())?.trim();
  await firstRisk.click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  const focusInDialog = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
  await page.screenshot({ path: `${OUT}/crm-opportunity-interaction-${vp.name}.png`, fullPage: false });
  await dialog.getByRole('button', { name: 'Schedule follow-up' }).click();
  await dialog.locator('#schedule-date').fill('2026-11-06');
  await dialog.locator('#schedule-note').fill('Confirm revised pricing');
  await dialog.getByRole('button', { name: 'Confirm follow-up' }).click();
  const toast = await page.getByRole('status').textContent();
  const activityFirst = await dialog.locator('ol li').first().textContent();
  // Update stage
  await dialog.getByRole('button', { name: 'Update stage' }).click();
  await dialog.locator('#stage-select').selectOption('Proposal');
  await dialog.getByRole('button', { name: 'Confirm stage' }).click();
  const stageText = await dialog.locator('dl dd').nth(3).textContent();
  await page.keyboard.press('Escape');
  const dialogGone = (await page.getByRole('dialog').count()) === 0;
  const focusRestored = await page.evaluate(() => document.activeElement?.tagName === 'BUTTON' || document.activeElement?.id === 'main');
  // The record is no longer overdue so it should have left the at-risk list.
  const stillListed = (await page.locator('[data-export-group="overdue-followups"] li button', { hasText: riskName ?? '' }).count()) > 0;
  // Filter check
  await page.getByRole('button', { name: /^Show$/ }).click().catch(() => {});
  await page.locator('select[id$="-stage"]').selectOption('Negotiation');
  const matchText = await page.locator('[data-export-group="global-filters"] h2').textContent();

  results.push({ ...vp, overflow, headings, focusInDialog, toast, activityFirst, stageText, dialogGone, focusRestored, stillListed, matchText, errors });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
