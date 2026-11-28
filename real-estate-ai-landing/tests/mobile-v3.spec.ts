import { expect, test } from '@playwright/test';

// V3 mobile-specific compositions. Runs in the "mobile" project (Pixel 7); skipped on desktop widths.
test.beforeEach(async ({ page }) => { test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'mobile compositions only'); });

test('hero uses the mobile lead-card composition and advances through the story', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-mobile')).toBeVisible();
  const first = await page.getByTestId('hero-dashboard').getAttribute('data-phase');
  await expect.poll(() => page.getByTestId('hero-dashboard').getAttribute('data-phase'), { timeout: 5000 }).not.toBe(first);
});

test('integrations show brand tiles, an engine and one disclosure', async ({ page }) => {
  await page.goto('/#integrations');
  const m = page.getByTestId('integrations-mobile');
  await expect(m).toBeVisible();
  await expect(m.getByTestId('integration-tile')).toHaveCount(12);
  await expect(m.getByTestId('integration-engine')).toBeVisible();
  await expect(page.getByTestId('integrations-disclosure')).toContainText('planned');
});

test('comparison toggles between Manual and IVR without a sideways table', async ({ page }) => {
  await page.goto('/#compare');
  const list = page.getByTestId('comparison-mobile');
  await expect(list).toBeVisible();
  await expect(page.getByTestId('comparison-table')).toBeHidden();
  await expect(list).toContainText('Manual Sales Team');
  await page.getByTestId('compare-vs-2').click();
  await expect(page.getByTestId('compare-vs-2')).toHaveAttribute('aria-selected', 'true');
  await expect(list).toContainText('Basic IVR');
  await expect(list.locator('li')).toHaveCount(9);
});

test('omnichannel timeline, campaign cards and compact features', async ({ page }) => {
  await page.goto('/#omnichannel');
  await expect(page.getByTestId('oc-mobile').locator('li')).toHaveCount(7);
  await page.goto('/#performance');
  await expect(page.getByTestId('campaign-cards').locator('li')).toHaveCount(3);
  await page.goto('/#features');
  // V4: every feature keeps its product illustration on mobile.
  await expect(page.getByTestId('features-grid').locator('article .product')).toHaveCount(10);
});
