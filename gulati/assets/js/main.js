/* Gulati — navigation, reveal-on-scroll, form handling */
(function () {
  'use strict';

  /* ---- Navigation overlay ---- */
  var nav = document.getElementById('nav');
  var openBtn = document.querySelector('[data-nav-open]');
  var closeBtn = document.querySelector('[data-nav-close]');
  var lastFocus = null;

  function openNav() {
    lastFocus = document.activeElement;
    nav.classList.add('is-open');
    nav.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    window.setTimeout(function () { closeBtn.focus(); }, 50);
  }
  function closeNav() {
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (nav && openBtn && closeBtn) {
    openBtn.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
    });
  }

  /* ---- Reveal on scroll ---- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Contact form (Netlify Forms, AJAX submit) ---- */
  var form = document.querySelector('form[data-netlify]');
  if (form) {
    var note = form.querySelector('.form__note');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      note.textContent = 'Sending…';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.reset();
        note.textContent = 'Thank you. We will be in touch shortly.';
      }).catch(function () {
        note.textContent = 'Something went wrong. Please call us or try again.';
      }).finally(function () { btn.disabled = false; });
    });
  }
})();
