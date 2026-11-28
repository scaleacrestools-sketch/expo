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
  await expect(page.getByTestId('footer')).toBeAttached(); // deferred sections mounted
  const missing = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')!)
    .filter((h) => !['#demo', '#privacy', '#terms', '#main'].includes(h) && !document.querySelector(h)));
  expect(missing).toEqual([]);
});

test('navigation anchors scroll to sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Integrations' }).click();
  await expect.poll(() => page.evaluate(() => (document.querySelector('#integrations') ? Math.abs(document.querySelector('#integrations')!.getBoundingClientRect().top) : 99999))).toBeLessThan(120);
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
  const remote = !/localhost|127\.0\.0\.1/.test(page.url());
  let posted = '';
  if (remote) {
    // Never create a real enquiry from tests: capture the Netlify Forms POST and answer it locally.
    await page.route('**/', async (route) => {
      if (route.request().method() === 'POST') { posted = route.request().postData() || ''; await route.fulfill({ status: 200, body: 'ok' }); } else await route.continue();
    });
  }
  await form.getByRole('button', { name: 'Request my demo' }).click();
  if (remote) {
    await expect(page.getByTestId('form-success')).toBeVisible();
    expect(posted).toContain('form-name=demo-request');
    expect(posted).toContain('email=test%40example.com');
  } else {
    await expect(page.getByTestId('form-local')).toBeVisible();
    await expect(page.getByTestId('form-local')).toContainText('enquiry not sent');
  }
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
  await page.getByTestId('voice-lang-hinglish').click();
  await expect(panel.getByTestId('voice-transcript')).toContainText('Aap kaunsi property configuration');
  await page.getByTestId('voice-lang-hi').click();
  await expect(panel.getByTestId('voice-transcript')).toContainText('आप कितने बेडरूम वाला घर देख रहे हैं?');
  await expect(page.getByTestId('voice-lang-hi')).toHaveAttribute('aria-checked', 'true');
  await page.getByTestId('voice-lang-en').click();
  const audio = page.getByTestId('voice-audio');
  // Audio is not fetched until the visitor presses play.
  expect(await audio.getAttribute('preload')).toBe('none');
  await expect(page.getByTestId('voice-duration')).not.toHaveText('0:00');
  await page.getByTestId('voice-play').click();
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime), { timeout: 8000 }).toBeGreaterThan(0.8);
  await expect(page.getByTestId('voice-time')).not.toHaveText('0:00');
  await expect(panel.locator('li[aria-current="true"]')).toHaveCount(1);
  await expect(page.getByTestId('voice-speaker')).toContainText('speaking');
  await expect(page.getByTestId('voice-result')).toBeVisible();
  await page.getByTestId('voice-play').click(); // pause
  const paused = await audio.evaluate((a: HTMLAudioElement) => a.paused);
  expect(paused).toBe(true);
  await page.getByTestId('voice-progress').fill('6');
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(5.5);
  await page.getByTestId('voice-restart').click();
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeLessThan(3);
});

test('hero \"Hear a Sample Call\" jumps to voice section', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('hero-sample').click();
  await expect.poll(() => page.evaluate(() => (document.querySelector('#voice-agents') ? Math.abs(document.querySelector('#voice-agents')!.getBoundingClientRect().top) : 99999))).toBeLessThan(150);
});

test('how it works: steps are selectable', async ({ page }) => {
  await page.goto('/#how-it-works');
  for (let i = 0; i < 5; i++) {
    await page.getByTestId(`step-${i}`).click();
    await expect(page.getByTestId(`step-${i}`)).toHaveAttribute('aria-selected', 'true');
  }
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('step-3')).toHaveAttribute('aria-selected', 'true');
  // Manual selection pauses the tour; the control resumes it.
  await expect(page.getByTestId('hiw-autoplay')).toContainText('Play tour');
  await page.getByTestId('hiw-autoplay').click();
  await expect(page.getByTestId('hiw-autoplay')).toContainText('Pause tour');
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
  await chart.scrollIntoViewIfNeeded();
  const box = (await chart.boundingBox())!;
  await chart.hover({ position: { x: box.width * 0.5, y: box.height * 0.5 } });
  await expect(page.getByRole('tooltip').filter({ hasText: 'Connected' })).toBeVisible();
  await expect(page.getByTestId('campaign-table').locator('tbody tr')).toHaveCount(3);
});

test('features, calendar demo, integrations, comparison and mobile CRM', async ({ page }) => {
  await page.goto('/#features');
  await page.getByRole('button', { name: /Day 18/ }).click();
  await expect(page.getByTestId('features-grid')).toContainText('Nov 18');
  await expect(page.getByTestId('features-grid').locator('article')).toHaveCount(10);
  const cards = page.locator('[data-testid="integration-card"]:visible');
  await expect(cards).toHaveCount(12);
  await cards.nth(3).hover();
  await expect(page.getByTestId('integration-engine').first()).toContainText('Tracing Housing.com');
  await expect(cards.nth(3)).toHaveAttribute('data-active', 'true');
  await expect(page.getByTestId('integrations-disclosure')).toContainText('planned');
  await expect(page.locator('#integrations').getByText('PLANNED', { exact: true })).toHaveCount(0);
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

test('video modal: poster, no autoplay, plays on demand, switches audio, stops on close', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('hero-video').click();
  const video = page.getByTestId('walkthrough-video');
  await expect(video).toBeVisible();
  expect(await video.getAttribute('preload')).toBe('none');
  expect(await video.getAttribute('poster')).toContain('product-walkthrough-poster.webp');
  await page.waitForTimeout(600);
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true); // no autoplay
  await page.getByTestId('video-play-overlay').click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 10000 }).toBeGreaterThan(0.5);
  expect(await video.evaluate((v: HTMLVideoElement) => v.duration)).toBeGreaterThan(60); // V3 walkthrough is 60–90 s
  expect(await video.evaluate((v: HTMLVideoElement) => v.textTracks.length)).toBe(1);
  expect(await video.evaluate((v: HTMLVideoElement) => (v as HTMLVideoElement & { mozHasAudio?: boolean }).currentSrc)).toMatch(/product-walkthrough-v4\.(webm|mp4)$/); // voice-over version is the default
  await page.getByTestId('video-version-silent').click();
  await expect(page.getByTestId('walkthrough-video')).toHaveAttribute('data-version', 'silent');
  await expect.poll(() => page.getByTestId('walkthrough-video').evaluate((v: HTMLVideoElement) => v.currentSrc || v.querySelector('source')!.src)).toContain('-silent');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('video-modal')).toBeHidden();
  expect(await page.locator('video').count()).toBe(0); // unmounted, so playback stopped
});

test('How It Works video preview opens the same walkthrough', async ({ page }) => {
  await page.goto('/#how-it-works');
  await page.getByTestId('hiw-video').click();
  await expect(page.getByTestId('walkthrough-video')).toBeVisible();
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
  await expect(page.getByTestId('hero-dashboard')).toHaveAttribute('data-phase', '8');
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && (a.effect as KeyframeEffect)?.getComputedTiming().iterations === Infinity).length);
  expect(running).toBe(0);
  expect(errors).toEqual([]);
  await ctx.close();
});

test('navigation marks the active section', async ({ page }) => {
  await page.goto('/');
  await page.locator('#integrations').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelector('#integrations')!.scrollIntoView({ block: 'start' }));
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Integrations' })).toHaveAttribute('aria-current', 'location');
});

test('qualification demo reaches the full ten answers and score 86', async ({ page }) => {
  await page.goto('/#qualification');
  await expect(page.getByTestId('qualification-demo')).toHaveAttribute('data-step', '10', { timeout: 15000 });
  await expect(page.getByTestId('qual-score')).toContainText('86');
});

test('demo data is internally consistent', async ({ page }) => {
  await page.goto('/#performance');
  await expect(page.getByTestId('outcome-legend').locator('li')).toHaveCount(4);
  const shares = await page.getByTestId('outcome-legend').locator('li').allTextContents();
  const nums = shares.map((t) => parseInt(t.replace(/[^0-9]/g, ''), 10));
  expect(nums.reduce((a, b) => a + b, 0)).toBe(100);
  expect(nums[3]).toBe(32); // no answer = 100% − 68% connect rate
  await expect(page.locator('#top')).toContainText('68%');
});

test('page still works on a slow 3G-like network', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: (500 * 1024) / 8, uploadThroughput: (500 * 1024) / 8 });
  const t0 = Date.now();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toBeVisible({ timeout: 20000 });
  const h1Ms = Date.now() - t0;
  await expect(page.getByTestId('footer')).toBeAttached({ timeout: 30000 });
  expect(h1Ms).toBeLessThan(20000);
  // Media must not load on page load.
  const media = await page.evaluate(() => performance.getEntriesByType('resource').map((r) => r.name).filter((n) => /\.(mp3|mp4|webm|gif)(\?|$)/.test(n)));
  expect(media).toEqual([]);
  await ctx.close();
});

test('voice: only one recording plays, and switching scenario or language stops it', async ({ page }) => {
  await page.goto('/#voice-agents');
  const audio = page.getByTestId('voice-audio');
  await page.getByTestId('voice-play').click();
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime), { timeout: 8000 }).toBeGreaterThan(0.3);
  await page.getByTestId('voice-tab-2').click();
  await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('audio')].filter((a) => !a.paused).length)).toBe(0);
  await page.getByTestId('voice-play').click();
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => !a.paused)).toBe(true);
  await page.getByTestId('voice-lang-hi').click();
  await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('audio')].filter((a) => !a.paused).length)).toBe(0);
  expect(await page.locator('audio').count()).toBe(1);
  expect(await audio.getAttribute('autoplay')).toBeNull();
});

test('integrations hub: sequential pairs, hover trace, no per-card badges', async ({ page }) => {
  await page.goto('/#integrations');
  const hub = page.getByTestId('integrations');
  const s0 = await hub.getAttribute('data-step');
  await expect.poll(() => hub.getAttribute('data-step'), { timeout: 4000 }).not.toBe(s0);
  await expect(page.getByTestId('integration-card')).toHaveCount(12);
  await expect(hub.locator('svg path[d]').first()).toBeAttached();
  await page.getByTestId('integration-card').nth(0).hover();
  await expect(page.getByTestId('integration-engine').first()).toContainText('Tracing Meta Ads');
});
