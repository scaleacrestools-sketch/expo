/* ============================================================
   SMART VISION NARI UDYAM SUMMIT & EXPO — Interactions v2
   Preloader · split-text reveals · custom cursor · magnetic CTAs
   parallax · tilt · counters · header choreography · CRO widgets
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

  /* ------------------------------------------------------------
     IMAGES — official campaign photography manifest.
     Drop a URL (or relative path like "assets/host.jpg") against any
     slot and the matching frame instantly switches from its
     art-directed state to the photograph, with the brand colour
     grade applied automatically. A failed load silently reverts to
     the art-directed frame, so a broken URL can never break the page.
  ------------------------------------------------------------ */
  var IMAGES = {
    "hero-host": "",          // the recurring female event host — hero invitation panel
    "shakti-ceo": "",
    "shakti-founder": "",
    "shakti-boutique": "",
    "shakti-baker": "",
    "shakti-jewellery": "",
    "shakti-artisan": "",
    "shakti-d2c": "",
    "shakti-msme": "",
    "speaker-1": "",
    "speaker-2": "",
    "speaker-3": "",
    "speaker-4": "",
    "venue-atmosphere": ""    // stage / venue editorial photograph
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Photo-slot hydration ---------- */
  document.querySelectorAll("[data-photo-frame]").forEach(function (frame) {
    var src = IMAGES[frame.getAttribute("data-photo-frame")];
    if (!src) return;
    var img = frame.querySelector(".ph-img");
    if (!img) return;
    img.addEventListener("load", function () { frame.classList.add("has-photo"); });
    img.addEventListener("error", function () { frame.classList.remove("has-photo"); });
    img.loading = "lazy";
    img.src = src;
  });

  /* ---------- WhatsApp / contact wiring ---------- */
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

  /* ---------- Split-text: wrap words in masked spans ---------- */
  function splitElement(el) {
    var wordIndex = 0;
    function process(node) {
      if (node.nodeType === 3) {
        if (!node.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var outer = document.createElement("span");
          outer.className = "sl";
          var inner = document.createElement("span");
          inner.className = "sl-i";
          inner.style.setProperty("--sw", wordIndex++);
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== "BR") {
        Array.prototype.slice.call(node.childNodes).forEach(process);
      }
    }
    Array.prototype.slice.call(el.childNodes).forEach(process);
    el.classList.add("split-ready");
  }
  var splitTargets = document.querySelectorAll("[data-split]");
  if (!reduceMotion) splitTargets.forEach(splitElement);

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById("preloader");
  var seenLoader = false;
  try { seenLoader = sessionStorage.getItem("svSeenLoader") === "1"; } catch (e) { /* private mode */ }
  var motionStarted = false;

  function finishPreloader() {
    if (preloader) preloader.classList.add("done");
    try { sessionStorage.setItem("svSeenLoader", "1"); } catch (e) { /* noop */ }
    if (!motionStarted) { motionStarted = true; initObservers(); }
  }
  if (reduceMotion || seenLoader) {
    if (preloader) preloader.classList.add("done");
    motionStarted = true;
    // DOM is parsed (script is deferred) — start immediately
    setTimeout(initObservers, 0);
  } else {
    var loaderDone = false;
    var finish = function () { if (!loaderDone) { loaderDone = true; setTimeout(finishPreloader, 350); } };
    window.addEventListener("load", finish);
    setTimeout(finish, 1900); // hard cap so slow networks never trap the user
  }

  /* ---------- Observers: reveals, splits, counters ---------- */
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = String(target); return; }
    var t0 = null;
    var dur = 1300;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = String(Math.round(easeOutQuart(p) * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initObservers() {
    var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-group]");
    var countTargets = document.querySelectorAll("[data-count]");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      revealTargets.forEach(function (el) { el.classList.add("in"); });
      splitTargets.forEach(function (el) { el.classList.add("split-in"); });
      countTargets.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          entry.target.querySelectorAll("[data-split]").forEach(function (s) { s.classList.add("split-in"); });
          if (entry.target.hasAttribute("data-split")) entry.target.classList.add("split-in");
          entry.target.querySelectorAll("[data-count]").forEach(animateCount);
          if (entry.target.hasAttribute("data-count")) animateCount(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
    // splits / counters that are not inside a reveal container
    splitTargets.forEach(function (el) { if (!el.closest("[data-reveal], [data-reveal-group]")) io.observe(el); });
    countTargets.forEach(function (el) { if (!el.closest("[data-reveal], [data-reveal-group]")) io.observe(el); });
  }

  /* ---------- Header: scroll state + hide/reveal + progress ---------- */
  var header = document.getElementById("siteHeader");
  var progressBar = document.getElementById("scrollProgress");
  var stickyDesktop = document.getElementById("stickyDesktop");
  var stickyMobile = document.getElementById("stickyMobile");
  var backTop = document.getElementById("backTop");
  var hero = document.getElementById("home");
  var contactSection = document.getElementById("contact");
  var plxEls = document.querySelectorAll("[data-plx]");
  var lastY = 0;
  var ticking = false;

  function onScrollFrame() {
    ticking = false;
    var y = window.scrollY;

    header.classList.toggle("scrolled", y > 24);
    var drawerOpen = document.getElementById("mobileDrawer").classList.contains("open");
    if (y > 480 && y - lastY > 8 && !drawerOpen) header.classList.add("hidden");
    else if (lastY - y > 8 || y <= 480) header.classList.remove("hidden");
    lastY = y;

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }

    var pastHero = y > (hero ? hero.offsetHeight * 0.75 : 600);
    var nearForm = false;
    if (contactSection) {
      var rect = contactSection.getBoundingClientRect();
      nearForm = rect.top < window.innerHeight && rect.bottom > 0;
    }
    stickyDesktop.classList.toggle("visible", pastHero && !nearForm);
    stickyMobile.classList.toggle("visible", pastHero);
    backTop.classList.toggle("visible", y > 1400);

    if (!reduceMotion) {
      plxEls.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-plx")) || 0;
        el.style.transform = "translate3d(0," + (y * f).toFixed(1) + "px,0)";
      });
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
  }
  onScrollFrame();
  window.addEventListener("scroll", onScroll, { passive: true });

  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.body.classList.add("has-cursor");
    document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function cursorLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = "translate(" + (mx - 3.5) + "px," + (my - 3.5) + "px)";
      ring.style.transform = "translate(" + (rx - 19) + "px," + (ry - 19) + "px)";
      requestAnimationFrame(cursorLoop);
    })();
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a, button, summary, select, input, textarea, .eco-chip, .category-chip")) ring.classList.add("is-active");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("a, button, summary, select, input, textarea, .eco-chip, .category-chip")) ring.classList.remove("is-active");
    });
  }

  /* ---------- Magnetic CTAs ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".js-mag").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = "translate(" + (dx * 6).toFixed(1) + "px," + (dy * 5).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });

    /* ---------- Subtle 3D tilt on premium cards ---------- */
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        card.style.transform = "perspective(900px) rotateX(" + (-dy * 3).toFixed(2) + "deg) rotateY(" + (dx * 3.4).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

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
      cdDays.textContent = "00"; cdHours.textContent = "00"; cdMins.textContent = "00";
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
  if (finePointer) {
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
        var field = input.closest(".form-field");
        if (field && field.classList.contains("invalid")) validateInput(input);
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
      success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  }
})();
