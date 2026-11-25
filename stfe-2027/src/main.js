import { SITE } from '../site.config.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

/* WhatsApp: organiser number with a pre-filled stall enquiry */
const waUrl = (text) => `https://wa.me/${SITE.organiser.phoneE164}?text=${encodeURIComponent(text)}`;
$$('[data-whatsapp]').forEach((a) => { a.href = waUrl(SITE.whatsappMessage); });

/* Header: compact on scroll, mobile menu, active link */
const header = $('.site-header');
const toggle = $('#nav-toggle');
const menu = $('#mobile-menu');
const setHeaderH = () => document.documentElement.style.setProperty('--header-h', `${header.getBoundingClientRect().bottom}px`);
const closeMenu = () => {
  menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
};
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  setHeaderH();
  menu.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); document.body.classList.toggle('menu-open', open);
});
$$('a', menu).forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) closeMenu(); });

const mobileBar = $('#mobile-bar');
const hero = $('.hero');
const footer = $('.footer');
let formInView = false;
const onScroll = () => {
  header.classList.toggle('is-scrolled', header.getBoundingClientRect().top <= 0 && window.scrollY > 40);
  // Mobile conversion bar: after the hero, hidden while a form or the footer is on screen
  const footerVisible = footer.getBoundingClientRect().top < window.innerHeight - 10;
  const show = hero.getBoundingClientRect().bottom < 0 && !formInView && !footerVisible;
  mobileBar.classList.toggle('is-visible', show);
  document.body.classList.toggle('has-bar', show);
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();
const watchedForms = $$('.split form[data-netlify], .quick-form');
const formObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { e.target.dataset.inView = e.isIntersecting ? '1' : ''; });
  formInView = watchedForms.some((f) => f.dataset.inView === '1');
  onScroll();
}, { threshold: 0.05 });
watchedForms.forEach((f) => formObserver.observe(f));

/* Callback modal */
const cbDialog = $('#callback-dialog');
$$('[data-open-callback]').forEach((b) => b.addEventListener('click', () => { cbDialog.showModal(); setTimeout(() => $('#cb-name').focus(), 30); }));
$$('[data-close-callback]').forEach((b) => b.addEventListener('click', () => cbDialog.close()));
cbDialog.addEventListener('click', (e) => { if (e.target === cbDialog) cbDialog.close(); });

const navLinks = $$('#nav-links a');
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
}), { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) io.observe(s); });

/* Floor plan viewer — original brochure plans, zoom/pan/pinch/enlarge */
(() => {
  const viewer = $('#plan-viewer');
  const stage = $('#plan-stage');
  const img = $('#plan-img');
  const tabs = $$('.viewer__tab', viewer);
  const resetBtn = $('#zoom-reset');
  const fsBtn = $('#fullscreen');
  const plans = {
    ground: { src: '/assets/floor-plans/ground-floor.png', alt: 'Ground floor layout plan — STFE 2027, Soor Sadan Auditorium (schematic, not to scale)' },
    first: { src: '/assets/floor-plans/first-floor.png', alt: 'First floor layout plan — STFE 2027, Soor Sadan Auditorium (schematic, not to scale)' },
  };
  let scale = 1, x = 0, y = 0;
  const apply = () => {
    const r = stage.getBoundingClientRect();
    x = Math.min(0, Math.max(r.width - r.width * scale, x));
    y = Math.min(0, Math.max(r.height - r.height * scale, y));
    img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    resetBtn.textContent = `${Math.round(scale * 100)}%`;
  };
  const zoomAt = (f, cx, cy) => {
    const r = stage.getBoundingClientRect(); cx ??= r.width / 2; cy ??= r.height / 2;
    const next = Math.min(5, Math.max(1, scale * f)); const k = next / scale;
    x = cx - (cx - x) * k; y = cy - (cy - y) * k; scale = next; apply();
  };
  const reset = () => { scale = 1; x = 0; y = 0; apply(); };
  const show = (key) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.plan === key)));
    stage.setAttribute('aria-labelledby', `tab-${key}`);
    img.src = plans[key].src; img.alt = plans[key].alt; viewer.dataset.plan = key; reset();
  };
  tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.plan)));
  tabs.forEach((t, i) => t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); n.click();
  }));
  $('#zoom-in').addEventListener('click', () => zoomAt(1.4));
  $('#zoom-out').addEventListener('click', () => zoomAt(1 / 1.4));
  resetBtn.addEventListener('click', reset);
  stage.addEventListener('wheel', (e) => { e.preventDefault(); const r = stage.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  stage.addEventListener('dblclick', (e) => { const r = stage.getBoundingClientRect(); scale > 1.5 ? reset() : zoomAt(2, e.clientX - r.left, e.clientY - r.top); });
  const pts = new Map(); let last = 0;
  stage.addEventListener('pointerdown', (e) => { stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); stage.classList.add('is-dragging'); });
  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) {
      const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (last) { const r = stage.getBoundingClientRect(); zoomAt(d / last, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); }
      last = d;
    } else if (scale > 1) { x += e.clientX - prev.x; y += e.clientY - prev.y; apply(); }
  });
  const end = (e) => { pts.delete(e.pointerId); last = 0; if (!pts.size) stage.classList.remove('is-dragging'); };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  const fsLabel = $('.fs-label', fsBtn);
  const setFs = (on) => {
    viewer.classList.toggle('is-fullscreen', on); document.body.classList.toggle('menu-open', on);
    fsLabel.textContent = on ? 'Close' : 'Enlarge'; fsBtn.setAttribute('aria-label', on ? 'Close enlarged view' : 'Open enlarged view');
    requestAnimationFrame(reset);
  };
  fsBtn.addEventListener('click', () => setFs(!viewer.classList.contains('is-fullscreen')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && viewer.classList.contains('is-fullscreen')) setFs(false); });
  window.addEventListener('resize', apply);
})();

/* Pricing CTAs pre-select the stall configuration */
$$('a[href="#enquire"][data-stall]').forEach((a) => a.addEventListener('click', () => {
  const r = $(`input[name="stall_configuration"][value="${a.dataset.stall}"]`); if (r) r.checked = true;
}));

/* Lead attribution (UTM + landing page) persisted per session */
const store = {
  get(k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } },
};
const attribution = (() => {
  const saved = store.get('stfe_attr');
  const params = new URLSearchParams(location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => { if (params.get(k)) utm[k] = params.get(k).slice(0, 150); });
  if (saved && !Object.keys(utm).length) return saved;
  const a = { ...utm, landing_page: location.pathname + location.search, referrer: document.referrer.slice(0, 300) };
  store.set('stfe_attr', a);
  return a;
})();

/* Forms — validation + real submission to Netlify Forms. Success only on a 2xx response. */
const MOBILE_RE = /^(\+91|91|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normaliseMobile = (v) => v.replace(/[\s\-()]/g, '');
const validate = (el, form) => {
  const field = el.closest('.field'); if (!field) return true;
  let ok = true;
  if (el.type === 'radio') ok = !el.required || $$(`input[name="${el.name}"]`, form).some((r) => r.checked);
  else if (el.type === 'checkbox') ok = !el.required || el.checked;
  else {
    const v = el.value.trim();
    if (el.required && !v) ok = false;
    else if (el.type === 'tel' && v) ok = MOBILE_RE.test(normaliseMobile(v));
    else if (el.type === 'email' && v) ok = EMAIL_RE.test(v);
    else if (el.minLength > 0 && v && v.length < el.minLength) ok = false;
  }
  field.classList.toggle('is-invalid', !ok);
  if (el.type !== 'radio') el.setAttribute('aria-invalid', String(!ok));
  return ok;
};
const SUCCESS = {
  'stall-details': ['Thank you — your request has been received.', "The organiser's team will call you with stall availability and details. A stall is confirmed only after written confirmation from the organiser."],
  'exhibitor-enquiry': ['Thank you — your exhibitor enquiry has been received.', "The organiser's team will contact you about stall availability and next steps. A stall is confirmed only after written confirmation from the organiser."],
  'callback-request': ['Thank you — your callback request has been received.', "The organiser's team will call you on the number provided."],
  'visitor-registration': ['Thank you — your free visitor registration has been received.', 'See you at Soor Sadan Auditorium, Agra, 15–17 January 2027.'],
};
$$('form[data-netlify]').forEach((form) => {
  const formName = form.getAttribute('name'); // not form.name: each form has a field called "name"
  const btn = $('button[type="submit"]', form);
  const status = $('.form-status', form);
  const fields = $$('input:not([type="hidden"]):not([name="bot-field"]), select, textarea', form);
  let sending = false;
  fields.forEach((el) => {
    el.addEventListener('blur', () => { if (el.value && el.type !== 'radio') validate(el, form); });
    el.addEventListener('input', () => { if (el.closest('.field')?.classList.contains('is-invalid')) validate(el, form); });
    el.addEventListener('change', () => { if (['checkbox', 'radio'].includes(el.type) || el.tagName === 'SELECT') validate(el, form); });
  });
  const setStatus = (type, title, body) => {
    status.className = `form-status is-${type}`; status.textContent = '';
    const t = document.createElement('strong'); t.textContent = title;
    const b = document.createElement('span'); b.textContent = body;
    status.append(t, b);
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending || form.dataset.done === 'true') return;
    const invalid = fields.filter((el) => !validate(el, form));
    if (invalid.length) {
      invalid[0].focus();
      setStatus('error', 'Please check the highlighted fields.', 'Some required information is missing or not in the expected format.');
      return;
    }
    const set = (n, v) => { const el = form.querySelector(`input[type="hidden"][name="${n}"]`); if (el) el.value = v ?? ''; };
    Object.entries(attribution).forEach(([k, v]) => set(k, v));
    set('page_url', location.href.slice(0, 300)); set('submitted_at', new Date().toISOString());
    const mobile = form.elements.namedItem('mobile'); if (mobile) mobile.value = normaliseMobile(mobile.value);
    const data = new FormData(form);
    const fp = `${formName}|${data.get('mobile')}|${data.get('email') || ''}|${data.get('stall_configuration') || ''}`;
    const sent = store.get('stfe_sent') || [];
    if (sent.includes(fp)) {
      setStatus('success', 'We already have this submission.', 'Your details were received earlier in this visit, so they were not sent again. To change anything, call +91 96341 26260.');
      form.dataset.done = 'true'; return;
    }
    sending = true; btn.disabled = true; btn.classList.add('is-loading'); status.className = 'form-status';
    let saved = false;
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
      saved = res.ok;
      if (!saved) console.error('[STFE] form backend responded', res.status);
    } catch (err) {
      console.error('[STFE] form submission failed:', err);
    }
    sending = false; btn.disabled = false; btn.classList.remove('is-loading');
    if (!saved) {
      setStatus('error', 'Your submission could not be sent.', 'Please try again in a moment, or contact the organiser on +91 96341 26260 or svepindia@gmail.com.');
      return;
    }
    // Backend confirmed the save; from here on nothing may report a failure.
    store.set('stfe_sent', [...sent, fp].slice(-10));
    const [title, msg] = SUCCESS[formName] || ['Thank you, your details have been received.', ''];
    setStatus('success', title, msg);
    form.dataset.done = 'true';
    try { status.focus({ preventScroll: true }); window.dataLayer?.push({ event: 'lead_submitted', form_name: formName, enquiry_type: data.get('enquiry_type') }); } catch { /* non-critical */ }
  });
});

/* Subtle reveal */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const t = $$('.head-center, .cat, .day, .attraction, .res, .stall-row, .reasons li');
  t.forEach((el) => el.classList.add('reveal'));
  const ro = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px' });
  t.forEach((el) => ro.observe(el));
}
