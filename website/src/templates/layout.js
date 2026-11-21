// Shared layout: <head> with SEO, header, mega menu, footer, popups, scripts.
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
<link rel="canonical" href="${esc(url)}">
${page.noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow">'}
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1f2422">
<link rel="icon" href="/assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css?v=${page.buildId}">
${page.preload || ''}
<script>window.dataLayer=window.dataLayer||[];window.SITE=${JSON.stringify({ leadEndpoint: site.leadEndpoint, whatsapp: site.contact.whatsapp, phone: site.contact.phoneHref, ga4: site.tracking.ga4Id || '', pixel: site.tracking.metaPixelId || '' })};</script>
${gtm}
${ld}
</head>
<body class="${page.bodyClass || ''}">
${site.tracking.gtmId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(site.tracking.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
<a class="skip" href="#main">Skip to content</a>`;
}

function header({ site, page, projects }) {
  const nav = site.nav.map(n => `<a href="${n.href}"${page.path === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');
  return `
<header class="header${page.solidHeader ? ' always-solid' : ''}" id="header">
  <div class="bar">
    <a class="logo" href="/" aria-label="${esc(site.name)} home">
      <img class="light" src="/assets/img/assetz-logo-white.svg" alt="${esc(site.shortName)}" width="130" height="40">
      <img class="dark" src="/assets/img/assetz-logo.svg" alt="${esc(site.shortName)}" width="130" height="40">
    </a>
    <nav class="nav" aria-label="Primary">${nav}</nav>
    <div class="actions">
      <button class="btn btn-bronze enq-open" type="button" data-source="header">Enquire Now</button>
      <button class="icon-btn" id="search-open" type="button" aria-label="Search projects">${icon('search')}</button>
      <button class="icon-btn burger" id="mega-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mega"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
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
</div>
<main id="main">`;
}

function footer({ site, projects, buildId }) {
  const soc = site.social;
  return `</main>
<footer class="footer">
  <div class="container">
    <div class="top">
      <div class="brand">
        <img src="/assets/img/assetz-logo-footer.svg" alt="${esc(site.name)}" width="180" height="42">
        <p>Assetz is a Bengaluru-based developer of residential and commercial spaces, designing homes around the way people live since 2006.</p>
        <div class="social">
          <a href="${soc.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
          <a href="${soc.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
          <a href="${soc.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
          <a href="${soc.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}</a>
        </div>
      </div>
      <div><h4>Quick Links</h4><ul>${site.nav.map(n => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}<li><a href="/thank-you/" hidden>Thank you</a></li></ul></div>
      <div><h4>Featured Projects</h4><ul>${projects.map(p => `<li><a href="/projects/${p.slug}/">${esc(p.name)}</a></li>`).join('')}</ul></div>
      <div>
        <h4>Contact</h4>
        <address>
          <span>${esc(site.contact.address)}</span>
          <a href="tel:${site.contact.phoneHref}" data-track="call">${esc(site.contact.phone)}</a>
          <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>
          <span>${esc(site.contact.hours)}</span>
        </address>
      </div>
    </div>
    <div class="legal">
      <p>${esc(site.partnerNotice)} Project details, images and plans are indicative and subject to change as per approvals. RERA registration details are published on each project page and on the Karnataka RERA portal.</p>
      <div class="row">
        <span>${esc(site.copyright)}</span>
        <nav aria-label="Legal"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms-and-conditions/">Terms and Conditions</a><a href="/disclaimer/">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></nav>
      </div>
    </div>
  </div>
</footer>
<button class="to-top" id="to-top" type="button" aria-label="Back to top">${icon('up')}</button>
${enquiryPopup({ site, projects })}
${searchPopup({ projects })}
<div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-label="Image viewer"><button class="close" id="lb-close" type="button" aria-label="Close">${icon('close')}</button><button class="nav prev" id="lb-prev" type="button" aria-label="Previous">${icon('left')}</button><img id="lb-img" alt=""><button class="nav next" id="lb-next" type="button" aria-label="Next">${icon('right')}</button><p class="cap" id="lb-cap"></p></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<section class="cookie" id="cookie" aria-label="Privacy notice"><div><b>Your privacy matters.</b> We use cookies for analytics and to improve your experience. See our <a href="/privacy-policy/" style="text-decoration:underline">Privacy Policy</a>.</div><div style="display:flex;gap:.5rem"><button class="btn btn-ink" id="cookie-accept" type="button">Accept</button><button class="btn btn-outline" id="cookie-decline" type="button">Decline</button></div></section>
<script src="/assets/js/main.js?v=${buildId}" defer></script>
</body>
</html>`;
}

function enquiryPopup({ projects }) {
  return `<div class="popup" id="popup" aria-hidden="true"><div class="box" role="dialog" aria-modal="true" aria-labelledby="popup-title">
  <button class="x" id="popup-close" type="button" aria-label="Close">${icon('close')}</button>
  <h3 id="popup-title">Enquire Now</h3>
  <p class="lede" style="font-size:.92rem">Share a few details and an Assetz advisor will get in touch.</p>
  ${leadForm({ id: 'popup-form', type: 'Enquiry', projects, compact: true, button: 'Submit Enquiry' })}
</div></div>`;
}

function searchPopup({ projects }) {
  return `<div class="popup" id="search" aria-hidden="true"><div class="box" role="dialog" aria-modal="true" aria-labelledby="search-title">
  <button class="x" id="search-close" type="button" aria-label="Close">${icon('close')}</button>
  <h3 id="search-title">Search projects</h3>
  <label class="field">Project, location or configuration<input id="search-input" type="search" placeholder="e.g. Sarjapur, 4 BHK, villament" autocomplete="off"></label>
  <div class="search-results" id="search-results">${projects.map(p => `<a href="/projects/${p.slug}/" data-text="${esc((p.name + ' ' + p.location + ' ' + p.configurations.join(' ') + ' ' + p.propertyType).toLowerCase())}"><img src="${p.cover}" alt="" width="64" height="48"><span><b>${esc(p.name)}</b><span>${esc(p.locationShort)} · ${esc(p.configurations.join(', '))}</span></span></a>`).join('')}</div>
</div></div>`;
}

// Reusable lead form. type: Enquiry | Brochure | Site Visit | Contact | NRI | Guide
function leadForm({ id, type, projects, project, compact, button, purpose = true, time = true, message = false, nri = false }) {
  const opts = projects.map(p => `<option value="${esc(p.name)}"${project && project.slug === p.slug ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  return `<form class="form" id="${id}" data-type="${esc(type)}" novalidate>
  <input type="hidden" name="type" value="${esc(type)}">
  <input type="hidden" name="sourcePage" value="">
  <input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_medium" value=""><input type="hidden" name="utm_campaign" value=""><input type="hidden" name="utm_content" value=""><input type="hidden" name="utm_term" value="">
  <label class="hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
  <label class="field">Full name<input name="name" type="text" required autocomplete="name" minlength="2" maxlength="80"><span class="msg">Please enter your full name.</span></label>
  <div class="row">
    <label class="field">Mobile number<span class="phone-row"><select name="countryCode" aria-label="Country code"><option value="+91">🇮🇳 +91</option><option value="+971">🇦🇪 +971</option><option value="+1">🇺🇸 +1</option><option value="+44">🇬🇧 +44</option><option value="+65">🇸🇬 +65</option><option value="+61">🇦🇺 +61</option><option value="+966">🇸🇦 +966</option><option value="+974">🇶🇦 +974</option><option value="+49">🇩🇪 +49</option><option value="other">Other</option></select><input name="phone" type="tel" required autocomplete="tel-national" inputmode="numeric" placeholder="10-digit number"></span><span class="msg">Please enter a valid mobile number.</span></label>
    <label class="field">Email<input name="email" type="email" required autocomplete="email" maxlength="120"><span class="msg">Please enter a valid email address.</span></label>
  </div>
  <div class="row">
    <label class="field">Project interested in<select name="project" required><option value="">Select a project</option>${opts}<option value="Not sure yet">Not sure yet</option></select><span class="msg">Please choose a project.</span></label>
    ${purpose ? `<label class="field">${type === 'Guide' ? 'Buying purpose' : 'Property purpose'}<select name="purpose"><option>Self-Use</option><option>Investment</option>${type === 'Guide' ? '' : '<option>Not decided</option>'}</select></label>` : ''}
  </div>
  ${time ? `<label class="field">Preferred contact time<select name="preferredTime"><option>Any time</option><option>Morning (9 am – 12 pm)</option><option>Afternoon (12 – 4 pm)</option><option>Evening (4 – 7 pm)</option></select></label>` : ''}
  ${nri ? `<label class="field">Enquiry type<select name="category"><option>General enquiry</option><option>NRI enquiry</option><option>Site visit</option><option>Brochure request</option><option>Channel partner</option></select></label>` : ''}
  ${message ? `<label class="field">Message<textarea name="message" maxlength="1000" placeholder="Preferred configuration, budget range, or questions"></textarea></label>` : ''}
  <label class="consent"><input type="checkbox" name="consent" required><span>I agree to be contacted by Assetz about this enquiry and have read the <a href="/privacy-policy/">Privacy Policy</a>.</span></label>
  <button class="btn btn-bronze" type="submit"><span class="spinner" aria-hidden="true"></span><span class="label">${esc(button || 'Submit')}</span></button>
  <p class="status" role="status" aria-live="polite"></p>
</form>`;
}

module.exports = { head, header, footer, leadForm };
