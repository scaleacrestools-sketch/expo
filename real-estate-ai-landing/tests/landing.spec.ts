import { expect, test, type Page } from '@playwright/test';

const SECTIONS: [string, 'dark' | 'light'][] = [
  ['#top', 'dark'], ['#trusted', 'dark'], ['#problem', 'light'], ['#funnel', 'light'], ['#performance', 'dark'],
  ['#how-it-works', 'light'], ['#voice-agents', 'dark'], ['#omnichannel', 'dark'], ['#features', 'light'], ['#use-cases', 'dark'],
  ['#qualification', 'light'], ['#integrations', 'dark'], ['#mobile', 'light'], ['#compare', 'light'], ['#faq', 'dark'], ['#cta', 'dark'],
];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
  return errors;
}

test('page loads with SEO basics and no console, JS or network errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle(/AI Voice Agents & Real Estate Sales Automation/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /lead qualification/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('From property enquiries to qualified buyers.');
  // Scroll the whole page so lazy media and in-view logic run.
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await page.waitForTimeout(800);
  expect(errors).toEqual([]);
});

test('all 18 sections render in order with the correct theme', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('navbar')).toBeVisible();
  const tops: number[] = [];
  for (const [sel, theme] of SECTIONS) {
    const el = page.locator(sel);
    await expect(el, sel).toHaveCount(1);
    await expect(el).toHaveAttribute('data-theme', theme);
    tops.push(await el.evaluate((n) => n.getBoundingClientRect().top + window.scrollY));
  }
  expect([...tops].sort((a, b) => a - b)).toEqual(tops);
  await expect(page.getByTestId('footer')).toBeVisible();
  const dark = SECTIONS.filter(([, t]) => t === 'dark').length + 2; // + navbar + footer
  expect(dark / 18).toBeGreaterThan(0.5);
});

test('every in-page anchor link points to an existing element', async ({ page }) => {
  await page.goto('/');
  const missing = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')!)
    .filter((h) => !['#demo', '#privacy', '#terms', '#main'].includes(h) && !document.querySelector(h)));
  expect(missing).toEqual([]);
});

test('navigation anchors scroll to sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Integrations' }).click();
  await expect.poll(() => page.evaluate(() => Math.abs(document.querySelector('#integrations')!.getBoundingClientRect().top))).toBeLessThan(120);
});

test('solutions dropdown opens and closes', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('solutions-trigger').click();
  await expect(page.getByTestId('solutions-menu')).toBeVisible();
  await expect(page.getByTestId('solutions-menu').getByRole('link')).toHaveCount(6);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('solutions-menu')).toBeHidden();
});

test('demo modal: validation, local-preview submission and Escape', async ({ page }) => {
  await page.goto('/');
  for (const id of ['nav-demo', 'hero-demo', 'cta-demo']) {
    await page.getByTestId(id).click();
    await expect(page.getByTestId('demo-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('demo-modal')).toBeHidden();
  }
  await page.getByTestId('hero-demo').click();
  const form = page.getByTestId('demo-form');
  await form.getByRole('button', { name: 'Request my demo' }).click();
  await expect(form.getByText('Please enter your full name.')).toBeVisible();
  await expect(form.getByText('Please enter a valid work email.')).toBeVisible();
  await expect(form.getByText('Please agree so we can contact you')).toBeVisible();
  await form.getByLabel('Full Name *').fill('Test Person');
  await form.getByLabel('Work Email *').fill('not-an-email');
  await form.getByLabel('Phone Number *').fill('123');
  await form.getByRole('button', { name: 'Request my demo' }).click();
  await expect(form.getByText('Please enter a valid work email.')).toBeVisible();
  await expect(form.getByText(/valid phone number/)).toBeVisible();
  await form.getByLabel('Work Email *').fill('test@example.com');
  await form.getByLabel('Phone Number *').fill('+91 98765 43210');
  await form.getByLabel('Company Name *').fill('Example Realty');
  await form.getByLabel('Business Type *').selectOption('Channel Partner');
  await form.getByLabel('Monthly Lead Volume *').selectOption('1,000–5,000');
  await form.getByRole('checkbox').check();
  await page.waitForTimeout(2600); // spam time-trap
  await form.getByRole('button', { name: 'Request my demo' }).click();
  await expect(page.getByTestId('form-local')).toBeVisible();
  await expect(page.getByTestId('form-local')).toContainText('enquiry not sent');
});

test('voice agent: tabs, playback, progress and restart', async ({ page }) => {
  await page.goto('/#voice-agents');
  const panel = page.getByTestId('voice-panel');
  for (let i = 0; i < 4; i++) {
    await page.getByTestId(`voice-tab-${i}`).click();
    await expect(page.getByTestId(`voice-tab-${i}`)).toHaveAttribute('aria-selected', 'true');
  }
  await page.getByTestId('voice-tab-1').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('voice-tab-2')).toHaveAttribute('aria-selected', 'true');
  await page.getByTestId('voice-tab-0').click();
  await expect(panel.getByTestId('voice-transcript')).toContainText('Which property configuration are you looking for?');
  await page.getByTestId('voice-lang').selectOption('hi');
  await expect(panel.getByTestId('voice-transcript')).toContainText('Aap kaunsi property configuration');
  await page.getByTestId('voice-lang').selectOption('en');
  const audio = page.getByTestId('voice-audio');
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.readyState)).toBeGreaterThan(0);
  await page.getByTestId('voice-play').click();
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime), { timeout: 8000 }).toBeGreaterThan(0.8);
  await expect(page.getByTestId('voice-time')).not.toHaveText('0:00');
  await expect(panel.locator('li[aria-current="true"]')).toHaveCount(1);
  await page.getByTestId('voice-play').click(); // pause
  const paused = await audio.evaluate((a: HTMLAudioElement) => a.paused);
  expect(paused).toBe(true);
  await page.getByTestId('voice-progress').fill('6');
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(5.5);
  await page.getByTestId('voice-restart').click();
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeLessThan(3);
});

test('hero "Hear a Sample Call" jumps to voice section', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('hero-sample').click();
  await expect.poll(() => page.evaluate(() => Math.abs(document.querySelector('#voice-agents')!.getBoundingClientRect().top))).toBeLessThan(150);
});

test('how it works: steps are selectable', async ({ page }) => {
  await page.goto('/#how-it-works');
  for (let i = 0; i < 5; i++) {
    await page.getByTestId(`step-${i}`).click();
    await expect(page.getByTestId(`step-${i}`)).toHaveAttribute('aria-selected', 'true');
  }
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('step-3')).toHaveAttribute('aria-selected', 'true');
});

test('use-case tabs: click, keyboard and footer deep links', async ({ page }) => {
  await page.goto('/#use-cases');
  await page.getByTestId('uc-tab-2').click();
  await expect(page.getByTestId('uc-panel')).toContainText('Client-wise campaigns');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('uc-tab-3')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('uc-panel')).toContainText('Human agent handoff');
  await page.getByTestId('footer').getByRole('link', { name: 'Channel Partners' }).click();
  await expect(page.getByTestId('uc-tab-1')).toHaveAttribute('aria-selected', 'true');
});

test('funnel toggle and tooltip, performance range and chart tooltip', async ({ page }) => {
  await page.goto('/#funnel');
  await page.getByTestId('funnel-manual').click();
  await expect(page.getByTestId('funnel-manual')).toHaveAttribute('aria-selected', 'true');
  await page.getByTestId('funnel-stage-2').hover();
  await expect(page.getByRole('tooltip').filter({ hasText: 'Qualified Buyers' })).toBeVisible();
  await page.locator('#performance').scrollIntoViewIfNeeded();
  await page.getByTestId('range-30d').click();
  await expect(page.getByTestId('range-30d')).toHaveAttribute('aria-pressed', 'true');
  const chart = page.getByRole('img', { name: /call volume chart/ });
  const box = (await chart.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect(page.getByRole('tooltip').filter({ hasText: 'Connected' })).toBeVisible();
  await expect(page.getByTestId('campaign-table').locator('tbody tr')).toHaveCount(3);
});

test('features, calendar demo, integrations, comparison and mobile CRM', async ({ page }) => {
  await page.goto('/#features');
  await page.getByRole('button', { name: /Day 18/ }).click();
  await expect(page.getByTestId('features-grid')).toContainText('Nov 18');
  await expect(page.getByTestId('features-grid').locator('article')).toHaveCount(10);
  await expect(page.getByTestId('integration-card')).toHaveCount(12);
  await page.getByTestId('integration-card').first().hover();
  await expect(page.getByRole('tooltip').filter({ hasText: 'lead-form' })).toBeVisible();
  await expect(page.getByTestId('comparison-table').locator('tbody tr')).toHaveCount(9);
  await page.locator('#mobile').scrollIntoViewIfNeeded();
  await page.getByTestId('mobile-tab-1').click();
  await expect(page.getByTestId('mobile-phones')).toHaveAttribute('data-screen', '1');
  await expect(page.getByText('Product Preview · Coming Soon')).toBeVisible();
});

test('omnichannel node hover shows description', async ({ page }) => {
  await page.goto('/#omnichannel');
  await page.getByTestId('oc-node-1').hover();
  await expect(page.getByRole('tooltip').filter({ hasText: 'Brochures, confirmations' })).toBeVisible();
});

test('FAQ accordion works with mouse and keyboard', async ({ page }) => {
  await page.goto('/#faq');
  const q2 = page.getByTestId('faq-q-2');
  await q2.click();
  await expect(q2).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-a-2')).toContainText('available calendar slots');
  await expect(page.getByTestId('faq-q-0')).toHaveAttribute('aria-expanded', 'false');
  await page.getByTestId('faq-q-6').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#faq-a-6')).toContainText('closing');
});

test('video modal plays the walkthrough with captions', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('open-video').click();
  const video = page.getByTestId('walkthrough-video');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 10000 }).toBeGreaterThan(0.5);
  expect(await video.evaluate((v: HTMLVideoElement) => v.duration)).toBeGreaterThan(25);
  expect(await video.evaluate((v: HTMLVideoElement) => v.textTracks.length)).toBe(1);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('video-modal')).toBeHidden();
});

test('legal links open dialogs', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('footer').getByRole('link', { name: 'Privacy Policy' }).click();
  await expect(page.getByTestId('legal-modal')).toContainText('Privacy Policy');
  await page.keyboard.press('Escape');
});

test('reduced motion: page renders final states without errors', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(page.getByTestId('hero-dashboard')).toHaveAttribute('data-phase', '6');
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && (a.effect as KeyframeEffect)?.getComputedTiming().iterations === Infinity).length);
  expect(running).toBe(0);
  expect(errors).toEqual([]);
  await ctx.close();
});
