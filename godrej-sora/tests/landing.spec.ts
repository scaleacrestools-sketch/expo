import { test, expect } from '@playwright/test';

test('renders all 19 sections, nav and legal disclosures', async ({ page }) => {
  await page.goto('/');
  for (const id of ['top', 'overview', 'philosophy', 'architecture', 'residences', 'balcony', 'shibui', 'landscape', 'shiki-club', 'exclusivity', 'location', 'collection', 'plans', 'gallery', 'walkthrough', 'partners', 'legacy', 'visit', 'final']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Godrej Sora');
  await expect(page.locator('footer')).toContainText('RC/REP/HARERA/GGM/976/708/2025/79');
  await expect(page.locator('footer')).toContainText("artist's impressions");
});

test('lead drawer validates and submits', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Request Private Brochure' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Request Private Brochure' }).click();
  await expect(dialog.getByText('Please enter your full name')).toBeVisible();
  await expect(dialog.getByText('Enter a valid 10-digit Indian mobile number')).toBeVisible();
  await dialog.getByLabel('Full Name', { exact: true }).fill('Playwright Tester');
  await dialog.getByLabel('Mobile Number', { exact: true }).fill('9876501234');
  await dialog.getByLabel('Email', { exact: true }).fill('pw@example.com');
  await dialog.getByRole('checkbox').check();
  await page.waitForTimeout(2600); // human-speed guard
  await dialog.getByRole('button', { name: 'Request Private Brochure' }).click();
  await expect(dialog.getByText('We will be in touch')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('gallery lightbox supports keyboard navigation', async ({ page }) => {
  await page.goto('/#gallery');
  await page.locator('#gallery button[aria-label^="Open"]').first().click();
  const lb = page.getByRole('dialog');
  await expect(lb).toBeVisible();
  await expect(lb).toContainText('01 / 16');
  await page.keyboard.press('ArrowRight');
  await expect(lb).toContainText('02 / 16');
  await page.keyboard.press('Escape');
  await expect(lb).toBeHidden();
});

test('configuration tabs switch', async ({ page }) => {
  await page.goto('/#collection');
  await page.getByRole('tab', { name: '4 BHK' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('The 4 BHK Residence');
});
