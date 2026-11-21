/* Assetz homepage replica — interactions */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Toast ----- */
  const toast = $('#toast'); let toastTimer;
  const say = msg => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000); };

  /* ----- Overlays (menu, enquiry popup, disclaimer) ----- */
  function overlay(el, openBtns, closeBtn) {
    const open = () => { el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const close = () => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    openBtns.forEach(b => b && b.addEventListener('click', e => { e.preventDefault(); open(); }));
    closeBtn && closeBtn.addEventListener('click', close);
    el.addEventListener('click', e => { if (e.target === el) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    return { open, close };
  }
  const menu = overlay($('#menu'), [$('#menu-open')], $('#menu-close'));
  $$('#menu nav a').forEach(a => a.addEventListener('click', menu.close));
  $('#menu-open').addEventListener('click', () => $('#menu-open').setAttribute('aria-expanded', 'true'));
  $('#menu-close').addEventListener('click', () => $('#menu-open').setAttribute('aria-expanded', 'false'));
  overlay($('#popup'), [$('#enquire-open'), $('#contact-fold')], $('#popup-close'));
  overlay($('#disclaimer'), [$('#disclaimer-open')], $('#disclaimer-close'));

  /* ----- Hero sound toggle ----- */
  const video = $('#hero-video'), sound = $('#hero-sound');
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    sound.dataset.unmuted = String(!video.muted);
    sound.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    if (!video.muted) video.play().catch(() => {});
  });

  /* ----- Counters (50 Mn+, 50+, 22,000+) ----- */
  const counters = $$('[data-count]');
  function runCounter(el) {
    const target = parseInt(el.dataset.count, 10); const start = performance.now(); const dur = reduce ? 0 : 2500;
    const frame = now => { const p = dur ? Math.min(1, (now - start) / dur) : 1; el.textContent = Math.round(target * p).toLocaleString('en-IN'); if (p < 1) requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { counters.forEach(runCounter); cio.disconnect(); } }), { threshold: 0.5 });
    cio.observe($('#stats'));
  } else counters.forEach(runCounter);

  /* ----- Continuous strips (New Launches, Awards) ----- */
  function marquee(trackId, pxPerSec) {
    const track = document.getElementById(trackId); if (!track) return;
    const items = Array.from(track.children);
    items.forEach(n => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; track.appendChild(c); });
    let x = 0, last = performance.now(), paused = false, half = 0;
    const measure = () => { half = track.scrollWidth / 2; };
    measure(); window.addEventListener('resize', measure);
    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);
    track.addEventListener('focusin', () => paused = true);
    track.addEventListener('focusout', () => paused = false);
    if (reduce) return;
    const step = now => {
      const dt = (now - last) / 1000; last = now;
      if (!paused && half > 0) { x -= pxPerSec * dt; if (-x >= half) x += half; track.style.transform = `translate3d(${x}px,0,0)`; }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  marquee('launch-track', 60);
  marquee('award-track', 45);

  /* ----- Fade-in on scroll (content stays readable at rest) ----- */
  const fades = $$('.fade');
  if ('IntersectionObserver' in window && !reduce) {
    fades.forEach(el => { if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add('pre'); });
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.remove('pre'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
    fades.forEach(el => io.observe(el));
  }

  /* ----- Enquiry form (front-end only in this draft) ----- */
  let enquiryType = 'Enquiry';
  $$('#popup .types button').forEach(b => b.addEventListener('click', () => { $$('#popup .types button').forEach(x => x.classList.toggle('active', x === b)); enquiryType = b.dataset.type; }));
  $('#enquiry-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#q-name').value.trim(), email = $('#q-email').value.trim(), phone = $('#q-phone').value.replace(/\D/g, ''), project = $('#q-project').value;
    if (!name) return say('Please enter your name.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say('Please enter a valid email id.');
    if (phone.length < 10) return say('Please enter a valid contact number.');
    if (!project) return say('Please select a project.');
    if (!$('#q-agree').checked) return say('Please accept the consent to proceed.');
    $('#q-ok').hidden = false; say(`${enquiryType} request received.`); e.target.reset();
  });
})();
