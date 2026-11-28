import { expect, test } from '@playwright/test';

const widths = [1920, 1440, 1280, 1024, 768, 430, 390, 375, 320];

for (const w of widths) {
  test(`no horizontal overflow at ${w}px`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
    const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    expect(sw).toBeLessThanOrEqual(cw);
    // CTAs are fully on screen.
    const box = await page.getByTestId('hero-demo').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(w);
    await ctx.close();
  });
}

test('mobile menu opens, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByTestId('mobile-menu-button').click();
  await expect(page.getByTestId('mobile-menu')).toBeVisible();
  await page.getByTestId('mobile-menu').getByRole('link', { name: 'How It Works' }).click();
  await expect(page.getByTestId('mobile-menu')).toBeHidden();
  await expect.poll(() => page.evaluate(() => (document.querySelector('#how-it-works') ? Math.abs(document.querySelector('#how-it-works')!.getBoundingClientRect().top) : 99999))).toBeLessThan(120);
});

test('mobile touch targets on primary controls are at least 40px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const id of ['mobile-menu-button', 'hero-demo', 'hero-sample']) {
    const b = (await page.getByTestId(id).boundingBox())!;
    expect(b.height, id).toBeGreaterThanOrEqual(40);
  }
});
