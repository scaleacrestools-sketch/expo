// Functional QA against the local QA server (scripts/qa-server.mjs).
// Usage: start `node scripts/qa-server.mjs` (port 4321) and a failing one with QA_FAIL=1 PORT=4322, then `npm run qa`.
import { createRequire } from 'node:module';
import { readFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.QA_BASE || 'http://localhost:4321';
const FAIL_BASE = process.env.QA_FAIL_BASE || 'http://localhost:4322';
const LEADS = 'qa-output/leads.jsonl';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };
const leads = () => existsSync(LEADS) ? readFileSync(LEADS, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];

if (existsSync(LEADS)) rmSync(LEADS);
const browser = await chromium.launch();

// 1. Layout: no horizontal overflow at required widths
for (const w of [375, 390, 430, 768, 1024, 1440]) {
  const p = await browser.newPage({ viewport: { width: w, height: 900 } });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const over = [...document.querySelectorAll('body *')].filter((el) => {
      const b = el.getBoundingClientRect();
      return b.width && b.right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.mobile-menu') && !el.closest('.visually-hidden');
    }).map((el) => el.className || el.tagName).slice(0, 3);
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, over };
  });
  check(`No horizontal overflow at ${w}px`, r.sw <= r.cw && !r.over.length, `scrollWidth ${r.sw} / ${r.cw}${r.over.length ? ' offenders: ' + r.over.join(', ') : ''}`);
  check(`No JS errors at ${w}px`, !errors.length, errors.join('; '));
  await p.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + '/?utm_source=meta&utm_medium=paid_social&utm_campaign=stfe_exhibitors&utm_content=video_a', { waitUntil: 'networkidle' });

// 2. Content facts
const text = await page.evaluate(() => document.body.innerText);
check('Price ₹69,030 shown', text.includes('₹69,030'));
check('Rate ₹7,670 per sq. metre shown', text.includes('₹7,670'));
check('All 17 categories present', (await page.locator('li.cat').count()) === 17);
check('All 6 benefits present', (await page.locator('.benefit').count()) === 6);
check('All 6 inclusions present', (await page.locator('.rate-card__incl li').count()) === 6);
check('Programme has 3 days × 5 items', (await page.locator('.day li').count()) === 15);
check('Exactly 4 key attractions', (await page.locator('.attraction').count()) === 4);
check('12 FAQ entries', (await page.locator('.faq details').count()) === 12);
check('No "GST extra" wording', !/plus GST|\+ ?GST|GST extra/i.test(text));
check('Preview build shows the three brochure marks with a pending-authorisation badge', (await page.locator('#inst-strip img').count()) === 3 && (await page.locator('.inst-strip__preview').isVisible()));
const prodHtml = readFileSync('dist/index.html', 'utf8');
check('Production build withholds the marks until authorised', !prodHtml.includes('assets/institutional/'));
check('Approved logo used in header (image, not text)', await page.locator('.site-header img.brand__logo').evaluate((i) => i.complete && i.naturalWidth >= 200 && i.currentSrc.includes('stfe-2027-logo') && i.getBoundingClientRect().height >= 60));
check('Tagline from brochure present', text.includes("India's Innovation, Global Impact"));
check('No engineering notes in hero', !(await page.locator('.hero').innerText()).includes('brochure figure'));
check('No endorsement wording', !/government approved|official sponsor|government partner/i.test(text));

// 3. Links
const wa = await page.locator('[data-whatsapp]').first().getAttribute('href');
check('WhatsApp link uses organiser number + prefilled message', wa.startsWith('https://wa.me/919634126260?text=') && decodeURIComponent(wa).includes('interested in exhibiting at STFE 2027'), wa.slice(0, 60) + '…');
check('tel: link', (await page.locator('a[href="tel:+919634126260"]').count()) > 0);
check('mailto: link', (await page.locator('a[href="mailto:svepindia@gmail.com"]').count()) > 0);
check('Organiser website link', (await page.locator('a[href="https://www.svepindia.com"]').count()) > 0);
check('Google Maps directions link', (await page.locator('a[href*="google.com/maps/search"]').count()) > 0);
const anchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1));
const missing = await page.evaluate((hs) => hs.filter((h) => !document.querySelector(h)), [...new Set(anchors)]);
check('All in-page anchors resolve', !missing.length, missing.join(', '));

// 4. Downloads
const guide = await page.request.get(BASE + '/downloads/STFE-2027-Stall-Pricing-Guide.pdf');
const gbuf = await guide.body();
check('Pricing guide PDF downloads', guide.ok() && gbuf.slice(0, 5).toString() === '%PDF-', `${gbuf.length} bytes`);
const dl = page.waitForEvent('download');
await page.locator('a[href="/downloads/STFE-2027-Stall-Pricing-Guide.pdf"]').first().click();
const d = await dl;
check('Pricing guide button triggers a real browser download', !!d && d.suggestedFilename().endsWith('.pdf'), d.suggestedFilename());
const brochureFile = await page.request.get(BASE + '/downloads/STFE-2027-Brochure.pdf');
const bb = await brochureFile.body();
check('Original brochure PDF downloads (unmodified, 3 pages)', brochureFile.ok() && bb.slice(0, 5).toString() === '%PDF-' && bb.length === 13339333, `${bb.length} bytes`);
const dl2 = page.waitForEvent('download');
await page.locator('.hero a[href="/downloads/STFE-2027-Brochure.pdf"]').click();
check('Hero brochure button triggers a real download', (await dl2).suggestedFilename() === 'STFE-2027-Brochure.pdf');
// floor plans
await page.locator('#floor-plans').scrollIntoViewIfNeeded();
const g = await page.locator('#plan-img').evaluate((i) => ({ src: i.currentSrc, w: i.naturalWidth, h: i.naturalHeight }));
await page.click('#tab-first'); await page.waitForTimeout(400);
const f = await page.locator('#plan-img').evaluate((i) => ({ src: i.currentSrc, w: i.naturalWidth, h: i.naturalHeight }));
check('Ground floor plan image loads', g.w > 1000 && g.src.includes('ground-floor'), `${g.w}×${g.h}`);
check('First floor plan image loads and differs', f.w > 1000 && f.src.includes('first-floor') && f.h !== g.h, `${f.w}×${f.h}`);
await page.click('#zoom-in');
check('Zoom in scales the plan', (await page.locator('#plan-img').evaluate((i) => i.style.transform)).includes('scale(1.4)'));
await page.click('#zoom-reset');
check('Reset returns to 100%', (await page.locator('#zoom-reset').innerText()) === '100%');
check('Privacy page loads', (await page.request.get(BASE + '/privacy.html')).ok());

// 5. Exhibitor form: validation
await page.locator('#enquire').scrollIntoViewIfNeeded();
await page.click('#exhibitor-form button[type="submit"]');
check('Empty submit shows field errors', (await page.locator('#exhibitor-form .field.is-invalid').count()) >= 5);
check('Empty submit does not save a lead', leads().length === 0);
await page.fill('#ex-name', 'QA Tester');
await page.fill('#ex-company', 'QA Industries');
await page.fill('#ex-mobile', '12345');
await page.fill('#ex-email', 'not-an-email');
await page.check('#st-3x3', { force: true });
await page.check('#ex-consent');
await page.click('#exhibitor-form button[type="submit"]');
check('Invalid Indian mobile rejected', await page.locator('#ex-mobile').evaluate((el) => el.closest('.field').classList.contains('is-invalid')));
check('Invalid email rejected', await page.locator('#ex-email').evaluate((el) => el.closest('.field').classList.contains('is-invalid')));
check('Invalid data does not save a lead', leads().length === 0);
await page.fill('#ex-mobile', '+91 98765 43210');
await page.fill('#ex-email', 'qa@example.com');
await page.fill('#ex-city', 'Agra');
await page.selectOption('#ex-category', 'Startups & MSMEs');
await page.fill('#ex-message', 'QA test submission');
// double click quickly to test duplicate protection
await Promise.all([page.click('#exhibitor-form button[type="submit"]'), page.click('#exhibitor-form button[type="submit"]').catch(() => {})]);
await page.waitForSelector('#exhibitor-form .form-status.is-success', { timeout: 5000 });
const ex = leads().filter((l) => l['form-name'] === 'exhibitor-enquiry');
check('Valid exhibitor enquiry saved by backend', ex.length === 1, `${ex.length} record(s)`);
check('Double-click produced exactly one lead', ex.length === 1);
const L = ex[0] || {};
check('Lead has UTM source/medium/campaign/content', L.utm_source === 'meta' && L.utm_medium === 'paid_social' && L.utm_campaign === 'stfe_exhibitors' && L.utm_content === 'video_a');
check('Lead has landing page + enquiry type', L.landing_page?.startsWith('/?utm_source') && L.enquiry_type === 'Exhibitor Enquiry');
check('Lead mobile normalised', L.mobile === '+919876543210', L.mobile);
check('Lead has stall configuration + consent', L.stall_configuration === '3 × 3 metres' && L.consent === 'yes');
check('Success message shown only after save', (await page.locator('#exhibitor-form .form-status').innerText()).includes('exhibitor enquiry has been received'));
check('No error state after a confirmed save', (await page.locator('#exhibitor-form .form-status.is-error').count()) === 0);

// 6. Callback + visitor forms
await page.fill('#cb-name', 'QA Caller'); await page.fill('#cb-company', 'QA Co'); await page.fill('#cb-mobile', '9123456789'); await page.check('#cb-consent');
await page.click('#callback-form button[type="submit"]');
await page.waitForSelector('#callback-form .form-status.is-success');
check('Callback request saved', leads().some((l) => l['form-name'] === 'callback-request' && l.mobile === '9123456789'));
await page.fill('#vr-name', 'QA Visitor'); await page.fill('#vr-mobile', '8123456789'); await page.check('#vr-consent');
await page.click('#visitor-form button[type="submit"]');
await page.waitForSelector('#visitor-form .form-status.is-success');
check('Visitor registration saved separately', leads().some((l) => l['form-name'] === 'visitor-registration' && l.enquiry_type === 'Visitor Registration'));

// 7. FAQ accordion
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.locator('.faq details').nth(3).locator('summary').click();
check('FAQ accordion opens', await page.locator('.faq details').nth(3).evaluate((d) => d.open));
await page.close();

// 8. Backend failure → error state, no false success
const fp = await browser.newPage({ viewport: { width: 390, height: 844 } });
await fp.goto(FAIL_BASE + '/', { waitUntil: 'networkidle' });
await fp.fill('#vr-name', 'Fail Test'); await fp.fill('#vr-mobile', '9000000001'); await fp.check('#vr-consent');
await fp.click('#visitor-form button[type="submit"]');
await fp.waitForSelector('#visitor-form .form-status.is-error');
check('Backend failure shows error, not success', (await fp.locator('#visitor-form .form-status.is-success').count()) === 0);
check('Button re-enabled after failure', await fp.locator('#visitor-form button[type="submit"]').isEnabled());

// 9. Mobile menu + floor plan viewer controls
await fp.goto(FAIL_BASE + '/', { waitUntil: 'networkidle' });
await fp.click('#nav-toggle');
check('Mobile menu opens', await fp.locator('#mobile-menu').isVisible());
await fp.click('#mobile-menu a[href="#pricing"]');
check('Mobile menu closes after navigation', !(await fp.locator('#mobile-menu').isVisible()));
await fp.click('#tab-first');
check('Floor plan tabs switch', (await fp.getAttribute('#tab-first', 'aria-selected')) === 'true');
await fp.click('#fullscreen');
check('Enlarged view opens', await fp.locator('#plan-viewer.is-fullscreen').isVisible());
await fp.keyboard.press('Escape');
check('Enlarged view closes with Escape', (await fp.locator('#plan-viewer.is-fullscreen').count()) === 0);
const tap = await fp.evaluate(() => [...document.querySelectorAll('.btn, .viewer__btn, .viewer__tab, .nav__toggle')].filter((el) => el.offsetParent).map((el) => el.getBoundingClientRect().height).filter((h) => h < 40).length);
check('Tap targets ≥ 40px tall on mobile', tap === 0, `${tap} smaller`);
check('Mobile header shows the approved logo', await fp.locator('.site-header img.brand__logo').evaluate((i) => i.naturalWidth >= 200 && i.currentSrc.includes('stfe-2027-logo') && i.getBoundingClientRect().height >= 50));
await browser.close();

const passed = results.filter((r) => r.ok).length;
writeFileSync('qa-output/qa-results.json', JSON.stringify({ base: BASE, ran_at: new Date().toISOString(), passed, total: results.length, results }, null, 2));
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
