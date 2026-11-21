// Shared layout: <head> with SEO, header (M3M site header or 100acress project header), mega menu, footer, popups, scripts.
const { esc, icon } = require('./helpers');

function head({ site, page }) {
  const url = site.baseUrl.replace(/\/$/, '') + page.path;
  const title = page.title || site.name;
  const desc = page.description || '';
  const image = site.baseUrl.replace(/\/$/, '') + (page.image || '/assets/video/assetz-hero-poster.webp');
  const ld = (page.jsonLd || []).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const gtm = site.tracking.gtmId ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${esc(site.tracking.gtmId)}');</script>` : '<!-- GTM: set tracking.gtmId in data/site.json to enable -->';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${site.baseUrl ? `<link rel="canonical" href="${esc(url)}">` : ''}
${page.noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow">'}
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${site.baseUrl ? `<meta property="og:url" content="${esc(url)}">` : ''}
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2c191f">
<link rel="icon" href="/assets/img/favicon.png">
<link rel="preload" href="/assets/fonts/figtree-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/${page.bodyClass === 'pdp' ? 'plus-jakarta-sans' : 'libre-caslon-display'}-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styles.css?v=${page.buildId}">
${page.preload || ''}
<script>window.dataLayer=window.dataLayer||[];window.SITE=${JSON.stringify({ leadEndpoint: site.leadEndpoint, whatsapp: site.contact.whatsapp, phone: site.contact.phone, ga4: site.tracking.ga4Id || '', pixel: site.tracking.metaPixelId || '' })};</script>
${gtm}
${ld}
</head>
<body class="${page.bodyClass || ''}">
${site.tracking.gtmId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(site.tracking.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
<a class="skip" href="#main">Skip to content</a>`;
}

const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';

function siteHeader({ site, page }) {
  const nav = site.nav.filter(n => n.href !== '/').map(n => `<a href="${n.href}"${page.path === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');
  return `
<header class="header${page.solidHeader ? ' always-solid' : ''}" id="header">
  <div class="bar">
    <a class="logo" href="/" aria-label="${esc(site.name)} home">
      <img class="light" src="/assets/img/assetz-logo-white.svg" alt="${esc(site.shortName)}" width="95" height="46">
      <img class="dark" src="/assets/img/assetz-logo.svg" alt="${esc(site.shortName)}" width="95" height="46">
    </a>
    <div class="right">
      <nav class="nav" aria-label="Primary">${nav}</nav>
      <div class="actions">
        <button class="enq-link enq-open hide-m" type="button" data-source="header">Enquire Now</button>
        <a class="icon-btn" href="tel:${site.contact.phoneHref}" aria-label="Call ${esc(site.contact.phone)}">${icon('phone')}</a>
        <a class="icon-btn hide-m" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a>
        <button class="icon-btn" id="search-open" type="button" aria-label="Search projects">${icon('search')}</button>
        <button class="icon-btn burger" id="mega-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mega"><span></span><span></span><span></span></button>
      </div>
    </div>
  </div>
</header>`;
}

function projectHeader({ site, page }) {
  const pr = page.project;
  const anchors = [['overview', 'Overview'], ['price', 'Price'], ['highlights', 'Highlights'], ['amenities', 'Amenities'], ['gallery', 'Gallery'], ['location', 'Location'], ['developer', 'Developer']];
  return `
<div class="pdp-progress" id="pdp-progress" aria-hidden="true"></div>
<header class="pdp-header" id="header">
  <div class="bar">
    <a class="plogo" href="/" aria-label="${esc(site.name)} home"><img src="/assets/img/assetz-logo-white.svg" alt="${esc(site.shortName)}" width="62" height="30"><span class="div"></span><b>${esc(pr.name)}</b></a>
    <nav class="anchors" aria-label="Project sections">${anchors.map(([id, l]) => `<a href="#${id}">${l}</a>`).join('')}</nav>
    <div class="right">
      <button class="pill br enq-open" type="button" data-type="Brochure" data-project="${esc(pr.name)}" data-source="pdp-header">${icon('download')} Brochure</button>
      <a class="pill wa" href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hi, I am interested in ' + pr.name)}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a>
      <a class="phone" href="tel:${site.contact.phoneHref}" aria-label="Call ${esc(site.contact.phone)}">${icon('phone')}<span>${esc(site.contact.phone.replace('+91 ', ''))}</span></a>
      <button class="burger" id="mega-open" type="button" aria-label="Open site menu" aria-expanded="false" aria-controls="mega"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

function megaMenu({ site, projects }) {
  return `
<div class="mega" id="mega" aria-hidden="true" role="dialog" aria-label="Site menu">
  <div class="inner">
    <div class="top"><img src="/assets/img/assetz-logo-white.svg" alt="${esc(site.shortName)}"><button class="close" id="mega-close" type="button" aria-label="Close menu">${icon('close')}</button></div>
    <div class="grid">
      <nav class="primary" aria-label="Menu">${site.nav.map(n => `<a href="${n.href}">${esc(n.label)} ${icon('arrow')}</a>`).join('')}</nav>
      <div class="projects-col">
        <h5>Our Projects</h5>
        <div class="plist">${projects.map(p => `<a href="/projects/${p.slug}/"><img src="${p.cover}" alt="${esc(p.name)}" loading="lazy" width="400" height="300"><b>${esc(p.name)}</b><span>${esc(p.locationShort)}</span></a>`).join('')}</div>
      </div>
    </div>
    <div class="bottom">
      <span><a href="tel:${site.contact.phoneHref}">${esc(site.contact.phone)}</a> · <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></span>
      <span><a href="/privacy-policy/">Privacy</a> · <a href="/terms-and-conditions/">Terms</a> · <a href="/disclaimer/">Disclaimer</a></span>
    </div>
  </div>
</div>`;
}

function header({ site, page, projects }) {
  return (page.project ? projectHeader({ site, page }) : siteHeader({ site, page })) + megaMenu({ site, projects }) + '\n<main id="main">';
}

function siteFooter({ site, projects }) {
  const soc = site.social;
  return `
<div class="container disclaimer"><b>DISCLAIMER:</b> ${esc(site.partnerNotice)} Project details, images, plans and specifications are indicative, sourced from the developer's published material and subject to change as per approvals. Images are artist's impressions unless stated otherwise. RERA registration details are published on each project page and should be verified on the Karnataka RERA portal. <a href="/disclaimer/" style="color:var(--brand-dark);text-decoration:underline">Read More</a></div>
<footer class="footer">
  <div class="container">
    <div class="cols">
      <div class="col brand">
        <img src="/assets/img/assetz-logo.svg" alt="${esc(site.name)}" width="153" height="74">
        <p>Assetz is a Bengaluru-based developer of residential and commercial spaces, designing homes around the way people live since 2006.</p>
        <div class="social">
          <a href="${soc.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
          <a href="${soc.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
          <a href="${soc.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
          <a href="${soc.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}</a>
        </div>
      </div>
      <div class="col">
        <h4>Corporate Office</h4>
        <address class="blk">${esc(site.contact.address)}</address>
        <h4>Customer Support</h4>
        <div class="txt blk"><a href="tel:${site.contact.phoneHref}" data-track="call">${esc(site.contact.phone)}</a><a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a><span>${esc(site.contact.hours)}</span></div>
        <h4>Our Projects</h4>
        <ul>${projects.map(p => `<li><a href="/projects/${p.slug}/">${esc(p.name)}</a> · ${esc(p.locationShort)}</li>`).join('')}</ul>
      </div>
      <div class="col">
        <h4>About Us</h4>
        <ul class="blk"><li><a href="/about-us/">Our Story</a></li><li><a href="/about-us/#awards">Awards &amp; Recognition</a></li><li><a href="/projects/">Projects</a></li></ul>
        <h4>Quick Links</h4>
        <ul><li><a href="/blogs/">Blogs</a></li><li><a href="/faqs/">FAQs</a></li><li><a href="/contact-us/">Contact Us</a></li><li><a href="/#guide">Homebuyer's Guide</a></li></ul>
      </div>
    </div>
  </div>
  <div class="bottom"><div class="container"><span>${esc(site.copyright)}</span><nav aria-label="Legal"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-and-conditions/">Terms and Conditions</a><a href="/disclaimer/">Disclaimer</a>${site.baseUrl ? '<a href="/sitemap.xml">Sitemap</a>' : ''}</nav></div></div>
</footer>`;
}

function footer({ site, projects, buildId, page = {} }) {
  return `</main>
${page.project ? '' : siteFooter({ site, projects })}
<div class="rail" aria-label="Quick actions">
  <button class="up" id="to-top" type="button" aria-label="Back to top">${icon('up')}</button>
  <button class="mail enq-open" type="button" data-source="rail" aria-label="Enquire now">${icon('mail')}</button>
  <a class="wa" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_SVG}</a>
</div>
${enquiryPopup({ site, projects })}
${searchPopup({ projects })}
<div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-label="Image viewer"><button class="close" id="lb-close" type="button" aria-label="Close">${icon('close')}</button><button class="nav prev" id="lb-prev" type="button" aria-label="Previous">${icon('left')}</button><img id="lb-img" alt=""><button class="nav next" id="lb-next" type="button" aria-label="Next">${icon('right')}</button><p class="cap" id="lb-cap"></p></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<section class="cookie" id="cookie" aria-label="Privacy notice"><div><b>Your privacy matters.</b> We use cookies for analytics and to improve your experience. See our <a href="/privacy-policy/" style="text-decoration:underline">Privacy Policy</a>.</div><div style="display:flex;gap:.5rem"><button class="btn btn-primary" id="cookie-accept" type="button">Accept</button><button class="btn btn-outline" id="cookie-decline" type="button">Decline</button></div></section>
<script src="/assets/js/main.js?v=${buildId}" defer></script>
</body>
</html>`;
}

function enquiryPopup({ site, projects }) {
  return `<div class="popup" id="popup" aria-hidden="true"><div class="box" role="dialog" aria-modal="true" aria-labelledby="popup-title">
  <button class="x" id="popup-close" type="button" aria-label="Close">${icon('close')}</button>
  <h3 id="popup-title">Get in Touch with us</h3>
  <p class="sub">Fill out the form below and an Assetz advisor will connect shortly.</p>
  ${leadForm({ id: 'popup-form', type: 'Enquiry', projects, compact: true, button: 'Request Callback' })}
  <p class="or">or connect directly</p>
  <div class="alt"><a href="tel:${site.contact.phoneHref}">${icon('phone')} ${esc(site.contact.phone)}</a><a class="wa" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a></div>
</div></div>`;
}

function searchPopup({ projects }) {
  return `<div class="popup" id="search" aria-hidden="true"><div class="box" role="dialog" aria-modal="true" aria-labelledby="search-title">
  <button class="x" id="search-close" type="button" aria-label="Close">${icon('close')}</button>
  <h3 id="search-title">Search projects</h3>
  <label class="field" style="margin-top:12px">Project, location or configuration<input id="search-input" type="search" placeholder="e.g. Sarjapur, 4 BHK, villament" autocomplete="off"></label>
  <div class="search-results" id="search-results">${projects.map(p => `<a href="/projects/${p.slug}/" data-text="${esc((p.name + ' ' + p.location + ' ' + p.configurations.join(' ') + ' ' + p.propertyType).toLowerCase())}"><img src="${p.cover}" alt="" width="64" height="48"><span><b>${esc(p.name)}</b><span>${esc(p.locationShort)} · ${esc(p.configurations.join(', '))}</span></span></a>`).join('')}</div>
</div></div>`;
}

/* Reusable lead form (100acress field geometry).
   type: Enquiry | Brochure | Site Visit | Contact | NRI | Guide
   compact: name, mobile, email, project (hidden when preset), consent — like the 100acress hero card. */
function leadForm({ id, type, projects, project, compact, button, purpose = true, time = true, message = false, nri = false, sub }) {
  const opts = projects.map(p => `<option value="${esc(p.name)}"${project && project.slug === p.slug ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  const projectField = project && compact
    ? `<input type="hidden" name="project" value="${esc(project.name)}">`
    : `<label class="field">Project interested in<select name="project" required><option value="">Select a project</option>${opts}<option value="Not sure yet">Not sure yet</option></select><span class="msg">Please choose a project.</span></label>`;
  const phone = `<label class="field">Mobile number<span class="phone-row"><select name="countryCode" aria-label="Country code"><option value="+91">+91</option><option value="+971">+971</option><option value="+1">+1</option><option value="+44">+44</option><option value="+65">+65</option><option value="+61">+61</option><option value="+966">+966</option><option value="+974">+974</option><option value="+49">+49</option></select><input name="phone" type="tel" required autocomplete="tel-national" inputmode="numeric" placeholder="Enter your mobile number"></span><span class="msg">Please enter a valid mobile number.</span></label>`;
  const email = `<label class="field">Email<input name="email" type="email" required autocomplete="email" maxlength="120" placeholder="Enter your email"><span class="msg">Please enter a valid email address.</span></label>`;
  return `<form class="form" id="${id}" data-type="${esc(type)}" novalidate>
  <input type="hidden" name="type" value="${esc(type)}">
  <input type="hidden" name="sourcePage" value="">
  <input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_medium" value=""><input type="hidden" name="utm_campaign" value=""><input type="hidden" name="utm_content" value=""><input type="hidden" name="utm_term" value="">
  <label class="hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
  <label class="field">Full name<input name="name" type="text" required autocomplete="name" minlength="2" maxlength="80" placeholder="Enter your name"><span class="msg">Please enter your full name.</span></label>
  ${compact ? phone + email + projectField : `<div class="row">${phone}${email}</div>`}
  ${compact ? '' : `<div class="row">${projectField}${purpose ? `<label class="field">${type === 'Guide' ? 'Buying purpose' : 'Property purpose'}<select name="purpose"><option>Self-Use</option><option>Investment</option></select></label>` : ''}</div>`}
  ${!compact && time ? `<label class="field">Preferred contact time<select name="preferredTime"><option>Any time</option><option>Morning (9 am – 12 pm)</option><option>Afternoon (12 – 4 pm)</option><option>Evening (4 – 7 pm)</option></select></label>` : ''}
  ${nri ? `<label class="field">Enquiry type<select name="category"><option>General enquiry</option><option>NRI enquiry</option><option>Site visit</option><option>Brochure request</option><option>Channel partner</option></select></label>` : ''}
  ${message ? `<label class="field">Message<textarea name="message" maxlength="1000" placeholder="Preferred configuration, budget range, or questions"></textarea></label>` : ''}
  <label class="consent"><input type="checkbox" name="consent" required><span>I authorise Assetz representatives to contact me by call, SMS, email or WhatsApp about this enquiry, and have read the <a href="/privacy-policy/">Privacy Policy</a>.</span></label>
  <button type="submit"><span class="spinner" aria-hidden="true"></span><span class="label">${esc(button || 'Submit')}</span></button>
  <p class="status" role="status" aria-live="polite"></p>
</form>`;
}

module.exports = { head, header, footer, leadForm, WA_SVG };
