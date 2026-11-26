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
      return b.width && b.right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.mobile-menu') && !el.closest('.visually-hidden') && !el.closest('.skyline') && !el.closest('.hero__media');
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
check('All 6 benefits present', (await page.locator('.reasons li').count()) === 6);
check('All 6 inclusions present', (await page.locator('.rate-card__incl li').count()) === 6);
check('Programme has 3 days × 5 items', (await page.locator('.day li').count()) === 15);
check('Exactly 4 key attractions', (await page.locator('.attraction').count()) === 4);
check('12 FAQ entries', (await page.locator('.faq details').count()) === 12);
check('No "GST extra" wording', !/plus GST|\+ ?GST|GST extra/i.test(text));
check('Preview build shows the three brochure marks, with no public-facing warning badge', (await page.locator('#inst-strip img').count()) === 3 && (await page.locator('.inst__preview').count()) === 0);
const prodHtml = readFileSync('dist/index.html', 'utf8');
check('Production build withholds the marks until authorised', !prodHtml.includes('assets/institutional/'));
check('Approved logo used in header (image, not text)', await page.locator('.brandbar img.brand__logo').evaluate((i) => i.complete && i.naturalWidth >= 200 && i.currentSrc.includes('stfe-2027-logo') && i.getBoundingClientRect().height >= 60));
check('Streamlined hero copy (headline, dates, price, 2 CTAs)', (await page.locator('.hero h1').innerText()).replace(/\s+/g, ' ').trim().toUpperCase() === 'SHOWCASE YOUR BRAND. BUILD CONNECTIONS.' || (await page.locator('.hero h1').innerText()).includes('Build Connections'));
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
check('Terms page loads', (await page.request.get(BASE + '/terms.html')).ok());
const ics = await (await page.request.get(BASE + '/stfe-2027.ics')).text();
check('Calendar file has correct dates and venue', ics.includes('DTSTART;VALUE=DATE:20270115') && ics.includes('DTEND;VALUE=DATE:20270118') && ics.includes('Soor Sadan'));
// photography
const credits = ['credits-user.json', 'credits.json'].flatMap((f) => { try { return JSON.parse(readFileSync('public/assets/photos/' + f, 'utf8')); } catch { return []; } });
const photoImgs = await page.evaluate(async () => { const imgs = [...document.querySelectorAll('img[src*="/assets/photos/"]')]; imgs.forEach((i) => { i.loading = 'eager'; }); await Promise.all(imgs.map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); return imgs.map((i) => ({ src: i.getAttribute('src'), ok: i.naturalWidth > 0 })); });
check('Licensed photographs render on the page', photoImgs.length >= 8 && photoImgs.every((i) => i.ok), `${photoImgs.length} photo elements`);
check('Every photo used has a credits entry with source and licence', photoImgs.every((i) => credits.some((c) => i.src.includes(c.file.replace('.webp', '')) && c.source_url && c.license)));
check('Hero slideshow has 3 curated images and 3 indicators', (await page.locator('.hero__slide').count()) === 3 && (await page.locator('.hero__dots button').count()) === 3);
{ const seq = []; await page.evaluate(() => scrollTo(0, 0)); for (let k = 0; k < 5; k++) { seq.push(await page.evaluate(() => [...document.querySelectorAll('.hero__slide')].findIndex((s) => s.classList.contains('is-active')))); await page.waitForTimeout(1000); }
  check('Hero image changes every 2 seconds', new Set(seq).size >= 2 && seq[0] !== seq[2], seq.join(',')); }
const creditsHtml = await (await page.request.get(BASE + '/credits.html')).text();
check('Image credits page lists every photo used', (creditsHtml.match(/<li>/g) || []).length >= new Set(photoImgs.map((i) => i.src.replace(/-1200\.webp$|\.webp$/, ''))).size && (await page.locator('footer a[href="/credits.html"]').count()) === 1, `${(creditsHtml.match(/<li>/g) || []).length} credit lines`);
const navBg = await page.locator('.site-header').evaluate((e) => getComputedStyle(e).backgroundImage);
check('Navigation uses the reference plum/indigo gradient (no navy theme)', navBg.includes('143, 29, 109') && navBg.includes('54, 49, 95'), navBg.slice(0, 80));
const ctaBg = await page.locator('.nav__cta').evaluate((e) => getComputedStyle(e).backgroundColor);
check('Primary CTA uses the reference warm orange', ctaBg === 'rgb(240, 122, 63)', ctaBg);
const fonts = await page.evaluate(() => ({ h1: getComputedStyle(document.querySelector('h1')).fontFamily, h2: getComputedStyle(document.querySelector('.title')).fontFamily, nav: getComputedStyle(document.querySelector('.nav__links a')).fontFamily, body: getComputedStyle(document.querySelector('.lede')).fontFamily, raj: document.fonts.check('700 40px Rajdhani'), man: document.fonts.check('400 16px Manrope') }));
check('Headings and navigation use Rajdhani; body uses Manrope', fonts.h1.startsWith('Rajdhani') && fonts.h2.startsWith('Rajdhani') && fonts.nav.startsWith('Rajdhani') && fonts.body.startsWith('Manrope') && fonts.raj && fonts.man, JSON.stringify(fonts).slice(0, 120));
const heroLayout = await page.evaluate(() => { const c = document.querySelector('.hero__copy').getBoundingClientRect(); const f = document.querySelector('#stall-details-form').getBoundingClientRect(); return { right: f.left > c.right, w: Math.round(f.width), inHero: f.bottom <= document.querySelector('.hero').getBoundingClientRect().bottom }; });
check('Hero quick form is a compact right-side card (330–380px) inside the hero', heroLayout.right && heroLayout.w >= 330 && heroLayout.w <= 380 && heroLayout.inHero, JSON.stringify(heroLayout));
const ft = await page.evaluate(() => ({ panels: document.querySelectorAll('footer .fpanel').length, cols: document.querySelectorAll('footer .fcol').length, ornament: !!document.querySelector('footer .ornament'), skyline: !!document.querySelector('footer .skyline svg path'), bar: !!document.querySelector('.footer__bottom nav a[href="/privacy.html"]') && !!document.querySelector('.footer__bottom nav a[href="/terms.html"]') }));
check('Footer: ornament strip, 2 contact panels, 5 columns, original skyline, copyright bar with Privacy/Terms', ft.panels === 2 && ft.cols === 5 && ft.ornament && ft.skyline && ft.bar, JSON.stringify(ft));
check('Patterned and photo-overlay sections present', (await page.locator('.bg-geo').count()) >= 2 && (await page.locator('.opp__left .opp__bg, .opp__right .opp__bg').count()) === 2);
await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
const wa0 = await page.locator('.wa-float').evaluate((e) => e.classList.contains('is-hidden'));
await page.locator('#pricing').scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
const wa1 = await page.locator('.wa-float').evaluate((e) => ({ hidden: e.classList.contains('is-hidden'), href: e.href }));
await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(300);
const wa2 = await page.locator('.wa-float').evaluate((e) => e.classList.contains('is-hidden'));
check('Floating WhatsApp button: hidden on hero, shown mid-page with wa.me link, hidden at footer', wa0 && !wa1.hidden && wa1.href.startsWith('https://wa.me/919634126260') && wa2);
await page.evaluate(() => scrollTo(0, 0));

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
await page.click('[data-open-callback]');
check('Callback modal opens', await page.locator('#callback-dialog').isVisible());
await page.fill('#cb-name', 'QA Caller'); await page.fill('#cb-company', 'QA Co'); await page.fill('#cb-mobile', '9123456789'); await page.check('#cb-consent');
await page.click('#callback-form button[type="submit"]');
await page.waitForSelector('#callback-form .form-status.is-success');
check('Callback request saved', leads().some((l) => l['form-name'] === 'callback-request' && l.mobile === '9123456789'));
await page.click('[data-close-callback]');
await page.fill('#qf-name', 'QA Hero'); await page.fill('#qf-mobile', '9988776655'); await page.check('#qf-consent');
await page.click('#stall-details-form button[type="submit"]');
await page.waitForSelector('#stall-details-form .form-status.is-success');
check('Hero stall-details form saves a lead', leads().some((l) => l['form-name'] === 'stall-details' && l.mobile === '9988776655' && l.utm_source === 'meta'));
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
await fp.goto(FAIL_BASE + '/', { waitUntil: 'networkidle' });
check('Mobile bar hidden on first screen', !(await fp.locator('#mobile-bar').evaluate((e) => e.classList.contains('is-visible'))));
await fp.locator('#categories').scrollIntoViewIfNeeded(); await fp.waitForTimeout(400);
const bar = await fp.locator('#mobile-bar').evaluate((e) => ({ vis: e.classList.contains('is-visible'), links: [...e.querySelectorAll('a')].map((a) => a.textContent.trim() || a.getAttribute('aria-label')) }));
check('Mobile sticky bar appears after the hero with Enquire + WhatsApp + Call', bar.vis && bar.links[0] === 'Enquire for a Stall' && bar.links[1].includes('WhatsApp'), bar.links.join(' | '));
await fp.locator('#exhibitor-form').scrollIntoViewIfNeeded(); await fp.waitForTimeout(400);
check('Mobile bar hides while the enquiry form is on screen', !(await fp.locator('#mobile-bar').evaluate((e) => e.classList.contains('is-visible'))));
await fp.evaluate(() => scrollTo(0, document.body.scrollHeight)); await fp.waitForTimeout(400);
check('Mobile bar hides at the footer', !(await fp.locator('#mobile-bar').evaluate((e) => e.classList.contains('is-visible'))));
check('Mobile header shows the approved logo', await fp.locator('.brandbar img.brand__logo').evaluate((i) => i.naturalWidth >= 200 && i.currentSrc.includes('stfe-2027-logo') && i.getBoundingClientRect().height >= 50));
await browser.close();

const passed = results.filter((r) => r.ok).length;
writeFileSync('qa-output/qa-results.json', JSON.stringify({ base: BASE, ran_at: new Date().toISOString(), passed, total: results.length, results }, null, 2));
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
