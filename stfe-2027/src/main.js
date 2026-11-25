import { SITE } from '../site.config.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

/* ------------------------------------------------------------------
   1. Logo: use the supplied original file; if it is missing, show a
      neutral text name (never a redrawn logo).
------------------------------------------------------------------- */
$$('.brand__logo').forEach((img) => {
  const fail = () => img.closest('.brand')?.classList.add('is-fallback');
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener('error', fail);
});

/* ------------------------------------------------------------------
   2. WhatsApp links (real organiser number, pre-filled message)
------------------------------------------------------------------- */
const waUrl = (text) => `https://wa.me/${SITE.organiser.phoneE164}?text=${encodeURIComponent(text)}`;
$$('[data-whatsapp]').forEach((a) => { a.href = waUrl(SITE.whatsappMessage); });

/* ------------------------------------------------------------------
   3. Brochure: direct download only when the original PDF is present.
      Otherwise the button becomes an honest "request" via WhatsApp —
      never a broken link, never a fake download.
------------------------------------------------------------------- */
if (!SITE.brochureAvailable) {
  $$('[data-brochure]').forEach((a) => {
    a.removeAttribute('download');
    a.href = waUrl('Hello, please share the STFE 2027 exhibitor brochure.');
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Request Exhibitor Brochure';
    const meta = a.parentElement?.querySelector('.magnet__meta');
    if (meta) meta.textContent = 'Shared by the organiser on WhatsApp';
  });
}

/* ------------------------------------------------------------------
   4. Institutional identity strip — only when authorised.
------------------------------------------------------------------- */
if (SITE.institutionalMarksApproved && Array.isArray(SITE.institutionalMarks)) {
  const strip = $('#inst-strip');
  const marks = $('#inst-marks');
  SITE.institutionalMarks.forEach((m) => {
    const img = new Image();
    img.src = m.src; img.alt = m.alt; img.height = 40; img.decoding = 'async';
    marks.appendChild(img);
  });
  if (SITE.institutionalLabel) $('#inst-label').textContent = SITE.institutionalLabel;
  strip.hidden = false;
}

/* ------------------------------------------------------------------
   5. Partner logos — approved files only, else the name is shown.
------------------------------------------------------------------- */
if (SITE.partnerLogosAvailable) {
  $$('.partner[data-slug]').forEach((li) => {
    const img = $('img', li);
    img.src = `/assets/partners/${li.dataset.slug}.png`;
    img.onload = () => { img.hidden = false; li.classList.add('has-logo'); };
  });
}

/* ------------------------------------------------------------------
   6. Photography slots — licensed / organiser-owned files only.
------------------------------------------------------------------- */
if (SITE.photographyAvailable) {
  $$('[data-photo]').forEach((fig) => {
    const name = fig.dataset.photo;
    const img = new Image();
    img.alt = fig.dataset.alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = `/assets/photos/${name}.jpg`;
    img.onload = () => {
      fig.classList.remove('photo--placeholder', 'photo--light');
      fig.innerHTML = '';
      fig.appendChild(img);
      if (fig.dataset.credit) {
        const c = document.createElement('figcaption');
        c.className = 'photo__credit';
        c.textContent = fig.dataset.credit;
        fig.appendChild(c);
      }
    };
  });
}

/* ------------------------------------------------------------------
   7. Header: scroll state, mobile menu, active section
------------------------------------------------------------------- */
const header = $('.site-header');
const toggle = $('#nav-toggle');
const menu = $('#mobile-menu');
const setHeaderH = () => document.documentElement.style.setProperty('--header-h', `${header.getBoundingClientRect().height}px`);
setHeaderH();
window.addEventListener('resize', setHeaderH);

const closeMenu = () => {
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
};
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  setHeaderH();
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
});
$$('a', menu).forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) closeMenu(); });

const mobileBar = $('#mobile-bar');
const hero = $('.hero');
const enquire = $('#enquire');
const visitor = $('#visitor-registration');
let formInView = false;
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
  const pastHero = hero.getBoundingClientRect().bottom < 0;
  mobileBar.classList.toggle('is-visible', pastHero && !formInView);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Hide the mobile bar while a form is on screen so it never covers fields.
const formObserver = new IntersectionObserver((entries) => {
  formInView = entries.some((e) => e.isIntersecting);
  onScroll();
}, { threshold: 0.05 });
[enquire, visitor, $('#callback')].forEach((el) => el && formObserver.observe(el));

const navLinks = $$('#nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) sectionObserver.observe(s); });

/* ------------------------------------------------------------------
   8. Pricing CTAs pre-select the stall configuration in the form
------------------------------------------------------------------- */
$$('[data-stall]').forEach((a) => a.addEventListener('click', () => {
  const sel = $('#ex-stall');
  if (sel) sel.value = a.dataset.stall;
}));

/* ------------------------------------------------------------------
   9. Floor plan viewer (zoom, pan, pinch, enlarged view)
------------------------------------------------------------------- */
(() => {
  const viewer = $('#plan-viewer');
  if (!viewer) return;
  const stage = $('#plan-stage');
  const img = $('#plan-img');
  const pending = $('#plan-pending');
  const tabs = $$('.viewer__tab', viewer);
  const resetBtn = $('#zoom-reset');
  const fsBtn = $('#fullscreen');
  const plans = {
    ground: { src: '/assets/floor-plans/ground-floor.png', alt: 'Ground floor schematic layout — STFE 2027 (not to scale)' },
    first: { src: '/assets/floor-plans/first-floor.png', alt: 'First floor schematic layout — STFE 2027 (not to scale)' },
  };
  let scale = 1, x = 0, y = 0;
  const MIN = 1, MAX = 5;

  const apply = () => {
    const r = stage.getBoundingClientRect();
    const maxX = 0, minX = r.width - r.width * scale;
    const maxY = 0, minY = r.height - r.height * scale;
    x = Math.min(maxX, Math.max(minX, x));
    y = Math.min(maxY, Math.max(minY, y));
    img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    resetBtn.textContent = `${Math.round(scale * 100)}%`;
  };
  const zoomAt = (factor, cx, cy) => {
    const r = stage.getBoundingClientRect();
    cx ??= r.width / 2; cy ??= r.height / 2;
    const next = Math.min(MAX, Math.max(MIN, scale * factor));
    const k = next / scale;
    x = cx - (cx - x) * k;
    y = cy - (cy - y) * k;
    scale = next;
    apply();
  };
  const reset = () => { scale = 1; x = 0; y = 0; apply(); };

  const show = (key) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.plan === key)));
    stage.setAttribute('aria-labelledby', `tab-${key}`);
    reset();
    if (!SITE.floorPlansAvailable) { img.hidden = true; pending.hidden = false; return; }
    img.alt = plans[key].alt;
    img.onload = () => { img.hidden = false; pending.hidden = true; };
    img.onerror = () => { img.hidden = true; pending.hidden = false; };
    img.src = plans[key].src;
  };
  tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.plan)));
  tabs.forEach((t, i) => t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    n.focus(); n.click();
  }));

  $('#zoom-in').addEventListener('click', () => zoomAt(1.4));
  $('#zoom-out').addEventListener('click', () => zoomAt(1 / 1.4));
  resetBtn.addEventListener('click', reset);
  stage.addEventListener('wheel', (e) => {
    if (img.hidden) return;
    e.preventDefault();
    const r = stage.getBoundingClientRect();
    zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  stage.addEventListener('dblclick', (e) => {
    const r = stage.getBoundingClientRect();
    scale > 1.5 ? reset() : zoomAt(2, e.clientX - r.left, e.clientY - r.top);
  });

  // Pointer pan + pinch
  const pointers = new Map();
  let lastDist = 0;
  stage.addEventListener('pointerdown', (e) => {
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastDist) {
        const r = stage.getBoundingClientRect();
        zoomAt(dist / lastDist, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      }
      lastDist = dist;
    } else if (scale > 1) {
      x += e.clientX - prev.x; y += e.clientY - prev.y; apply();
    }
  });
  const end = (e) => { pointers.delete(e.pointerId); lastDist = 0; if (!pointers.size) stage.classList.remove('is-dragging'); };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  const fsLabel = $('.fs-label', fsBtn);
  const setFs = (on) => {
    viewer.classList.toggle('is-fullscreen', on);
    document.body.classList.toggle('menu-open', on);
    fsLabel.textContent = on ? 'Close' : 'Enlarge';
    fsBtn.setAttribute('aria-label', on ? 'Close enlarged view' : 'Enlarged view');
    requestAnimationFrame(reset);
  };
  fsBtn.addEventListener('click', () => setFs(!viewer.classList.contains('is-fullscreen')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && viewer.classList.contains('is-fullscreen')) setFs(false); });
  window.addEventListener('resize', apply);
  show('ground');
})();

/* ------------------------------------------------------------------
   10. Lead attribution (UTM + landing page), persisted per session
------------------------------------------------------------------- */
const ATTR_KEY = 'stfe_attr';
const store = {
  get(k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
const attribution = (() => {
  const saved = store.get(ATTR_KEY);
  const params = new URLSearchParams(location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => { if (params.get(k)) utm[k] = params.get(k).slice(0, 150); });
  if (saved && !Object.keys(utm).length) return saved;
  const a = { ...utm, landing_page: location.pathname + location.search, referrer: document.referrer.slice(0, 300) };
  store.set(ATTR_KEY, a);
  return a;
})();

/* ------------------------------------------------------------------
   11. Forms — validation + REAL submission to Netlify Forms.
       Success is shown only when the backend responds 2xx.
------------------------------------------------------------------- */
const MOBILE_RE = /^(\+91[\-\s]?|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normaliseMobile = (v) => v.replace(/[\s\-()]/g, '');

const validateField = (el) => {
  const field = el.closest('.field');
  if (!field) return true;
  let ok = true;
  const v = el.type === 'checkbox' ? el.checked : el.value.trim();
  if (el.required && !v) ok = false;
  else if (el.type === 'tel' && v) ok = MOBILE_RE.test(normaliseMobile(v));
  else if (el.type === 'email' && v) ok = EMAIL_RE.test(v);
  else if (el.minLength > 0 && v && v.length < el.minLength) ok = false;
  field.classList.toggle('is-invalid', !ok);
  el.setAttribute('aria-invalid', String(!ok));
  return ok;
};

const SUCCESS = {
  'exhibitor-enquiry': ['Thank you — your exhibitor enquiry has been received.', 'The organiser\'s team will contact you about stall availability and next steps. Please note that a stall is confirmed only after written confirmation from the organiser.'],
  'callback-request': ['Thank you — your callback request has been received.', 'The organiser\'s team will call you on the number provided.'],
  'visitor-registration': ['Thank you — your visitor registration has been received.', 'Entry is free. Please carry a valid ID when you visit Soor Sadan Auditorium, Agra on 15–17 January 2027.'],
};

$$('form[data-netlify]').forEach((form) => {
  const btn = $('button[type="submit"]', form);
  const status = $('.form-status', form);
  const fields = $$('input:not([type="hidden"]):not([name="bot-field"]), select, textarea', form);
  let sending = false;

  fields.forEach((el) => {
    el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') validateField(el); });
    el.addEventListener('input', () => { if (el.closest('.field')?.classList.contains('is-invalid')) validateField(el); });
    el.addEventListener('change', () => { if (el.type === 'checkbox' || el.tagName === 'SELECT') validateField(el); });
  });

  const setStatus = (type, title, body) => {
    status.className = `form-status is-${type}`;
    status.innerHTML = '';
    const t = document.createElement('strong'); t.textContent = title;
    const b = document.createElement('span'); b.textContent = body;
    status.append(t, b);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending || form.dataset.done === 'true') return;

    const invalid = fields.filter((el) => !validateField(el));
    if (invalid.length) {
      invalid[0].focus();
      setStatus('error', 'Please check the highlighted fields.', 'Some required information is missing or not in the expected format.');
      return;
    }

    // Attribution & context
    const set = (n, v) => { const el = form.elements.namedItem(n); if (el) el.value = v ?? ''; };
    Object.entries(attribution).forEach(([k, v]) => set(k, v));
    set('page_url', location.href.slice(0, 300));
    set('submitted_at', new Date().toISOString());
    const mobile = form.elements.namedItem('mobile');
    if (mobile) mobile.value = normaliseMobile(mobile.value);

    const data = new FormData(form);
    const body = new URLSearchParams(data).toString();

    // Duplicate protection: identical payload already sent in this session
    const fingerprint = `${form.name}|${data.get('mobile')}|${data.get('email') || ''}|${data.get('stall_configuration') || ''}`;
    const sent = store.get('stfe_sent') || [];
    if (sent.includes(fingerprint)) {
      setStatus('success', 'We already have this submission.', 'Your details were received earlier in this visit, so we have not sent them again. To change anything, call +91 96341 26260.');
      form.dataset.done = 'true';
      return;
    }

    sending = true;
    btn.disabled = true;
    btn.classList.add('is-loading');
    status.className = 'form-status';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      store.set('stfe_sent', [...sent, fingerprint].slice(-10));
      const [title, msg] = SUCCESS[form.name] || ['Thank you — received.', ''];
      setStatus('success', title, msg);
      form.dataset.done = 'true';
      status.focus?.();
      window.dataLayer?.push({ event: 'lead_submitted', form_name: form.name, enquiry_type: data.get('enquiry_type') });
    } catch (err) {
      setStatus('error', 'Your submission could not be sent.', 'Please try again in a moment, or contact the organiser directly on +91 96341 26260 or svepindia@gmail.com.');
      console.error('[STFE] form submission failed:', err);
    } finally {
      sending = false;
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  });
});

/* ------------------------------------------------------------------
   12. Subtle reveal on scroll
------------------------------------------------------------------- */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const targets = $$('.section-head, .benefit, .price-card, .inclusions, .day, .attraction, .magnet, .credential');
  targets.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => io.observe(el));
}
