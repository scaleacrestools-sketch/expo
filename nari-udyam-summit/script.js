/* ============================================================
   SMART VISION NARI UDYAM SUMMIT & EXPO — Interactions
   ============================================================ */
(function () {
  "use strict";

  /* ------------------------------------------------------------
     CONFIG — fill these in once contact details are confirmed.
     whatsappNumber: digits only with country code, e.g. "919876543210".
     While empty, every WhatsApp button gracefully falls back to the
     enquiry form (#contact) so no click is ever wasted.
  ------------------------------------------------------------ */
  var CONFIG = {
    whatsappNumber: "",
    phone: "",
    email: "",
    whatsappMessage:
      "Hello Smart Vision team! I am interested in Smart Vision Nari Udyam Summit & Expo (Delhi, 19-20 September 2026). Please share the details.",
    eventDate: "2026-09-19T09:00:00+05:30"
  };

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- WhatsApp wiring ---------- */
  var waLinks = document.querySelectorAll(".js-wa");
  if (CONFIG.whatsappNumber) {
    var waHref =
      "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(CONFIG.whatsappMessage);
    waLinks.forEach(function (a) {
      a.href = waHref;
      a.target = "_blank";
      a.rel = "noopener";
    });
    var waNum = document.querySelector(".js-wa-number");
    if (waNum) waNum.textContent = "+" + CONFIG.whatsappNumber;
  }
  if (CONFIG.phone) {
    var phoneEl = document.querySelector(".js-phone");
    if (phoneEl) phoneEl.innerHTML = '<a href="tel:' + CONFIG.phone + '">' + CONFIG.phone + "</a>";
  }
  if (CONFIG.email) {
    var emailEl = document.querySelector(".js-email");
    if (emailEl) emailEl.innerHTML = '<a href="mailto:' + CONFIG.email + '">' + CONFIG.email + "</a>";
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  var onScrollHeader = function () {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile drawer ---------- */
  var drawer = document.getElementById("mobileDrawer");
  var navToggle = document.getElementById("navToggle");
  var drawerClose = document.getElementById("drawerClose");

  function setDrawer(open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  navToggle.addEventListener("click", function () { setDrawer(true); });
  drawerClose.addEventListener("click", function () { setDrawer(false); });
  drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setDrawer(false); });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  var sectionsById = {};
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) sectionsById[id] = a;
  });
  if ("IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove("active"); });
            var link = sectionsById[entry.target.id];
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.keys(sectionsById).forEach(function (id) {
      navIo.observe(document.getElementById(id));
    });
  }

  /* ---------- Countdown ---------- */
  var cdDays = document.getElementById("cdDays");
  var cdHours = document.getElementById("cdHours");
  var cdMins = document.getElementById("cdMins");
  var eventTime = new Date(CONFIG.eventDate).getTime();

  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tickCountdown() {
    var diff = eventTime - Date.now();
    if (diff <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMins.textContent = "00";
      return;
    }
    cdDays.textContent = pad(Math.floor(diff / 86400000));
    cdHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    cdMins.textContent = pad(Math.floor((diff % 3600000) / 60000));
  }
  if (cdDays) {
    tickCountdown();
    setInterval(tickCountdown, 30000);
  }

  /* ---------- Sticky CTA bars ---------- */
  var stickyDesktop = document.getElementById("stickyDesktop");
  var stickyMobile = document.getElementById("stickyMobile");
  var hero = document.getElementById("home");
  var contactSection = document.getElementById("contact");

  function updateSticky() {
    var pastHero = window.scrollY > (hero ? hero.offsetHeight * 0.75 : 600);
    var nearForm = false;
    if (contactSection) {
      var rect = contactSection.getBoundingClientRect();
      nearForm = rect.top < window.innerHeight && rect.bottom > 0;
    }
    var show = pastHero && !nearForm;
    stickyDesktop.classList.toggle("visible", show);
    stickyMobile.classList.toggle("visible", pastHero);
  }
  updateSticky();
  window.addEventListener("scroll", updateSticky, { passive: true });

  /* ---------- Exit intent popup (desktop, once per session) ---------- */
  var exitModal = document.getElementById("exitModal");
  var exitClose = document.getElementById("exitClose");
  var exitCta = document.getElementById("exitCta");
  var exitShown = false;
  try { exitShown = sessionStorage.getItem("svExitShown") === "1"; } catch (e) { /* private mode */ }

  function openExit() {
    if (exitShown) return;
    exitShown = true;
    try { sessionStorage.setItem("svExitShown", "1"); } catch (e) { /* noop */ }
    exitModal.classList.add("open");
    exitModal.setAttribute("aria-hidden", "false");
    exitClose.focus();
  }
  function closeExit() {
    exitModal.classList.remove("open");
    exitModal.setAttribute("aria-hidden", "true");
  }
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY <= 8 && window.scrollY > 400) openExit();
    });
  }
  exitClose.addEventListener("click", closeExit);
  exitModal.addEventListener("click", function (e) { if (e.target === exitModal) closeExit(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeExit();
      setDrawer(false);
    }
  });
  exitCta.addEventListener("click", function () {
    closeExit();
    var interest = document.getElementById("fInterest");
    if (interest) interest.value = "Stall Booking";
  });

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById("enquiryForm");
  var success = document.getElementById("formSuccess");

  function setInvalid(input, invalid) {
    var field = input.closest(".form-field");
    if (field) field.classList.toggle("invalid", invalid);
  }
  function validateInput(input) {
    var ok = input.checkValidity();
    setInvalid(input, !ok);
    return ok;
  }
  if (form) {
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validateInput(input); });
      input.addEventListener("input", function () {
        if (input.closest(".form-field") && input.closest(".form-field").classList.contains("invalid")) {
          validateInput(input);
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* Honeypot: silently drop bot submissions */
      var hp = form.querySelector("[name='company_website']");
      if (hp && hp.value) return;

      var firstInvalid = null;
      form.querySelectorAll("input:not([name='company_website']), select, textarea").forEach(function (input) {
        if (!validateInput(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      /* NOTE: connect this handler to your backend / CRM / Google Sheet /
         Formspree endpoint. Until then the enquiry data is logged locally
         and the premium thank-you state is shown. */
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      delete data.company_website;
      console.info("Enquiry captured:", data);

      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    });
  }
})();
