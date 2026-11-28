import { expect, test } from '@playwright/test';

const widths = [1920, 1440, 1280, 1024, 768, 430, 390, 375, 360, 320];

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

// V4: overflow-x clipping hides content that is wider than the screen from the scrollWidth check above,
// so also assert that no text element extends past the viewport edge.
for (const w of [320, 360, 390, 768]) {
  test(`no content clipped past the viewport at ${w}px`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce' }) /* final layout, not mid-entrance */;
    const page = await ctx.newPage();
    await page.goto('/');
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } await new Promise((r) => setTimeout(r, 1500)); });
    const clipped = await page.evaluate((vw) => {
      const out: string[] = [];
      for (const e of Array.from(document.querySelectorAll('section h2, section h3, section p, section li, section td, section th, section dd, section button, section a'))) {
        if (e.closest('[data-testid="marquee"], .thin-scroll, [aria-hidden="true"]')) continue;
        const r = e.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
        if (r.right > vw + 1 || r.left < -1) out.push(`${e.closest('section')?.id}: "${(e.textContent || '').trim().slice(0, 30)}" right=${Math.round(r.right)}`);
      }
      return out.slice(0, 5);
    }, w);
    expect(clipped).toEqual([]);
    await ctx.close();
  });
}
