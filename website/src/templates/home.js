// Homepage — section order and geometry follow m3mindia.com (see docs/reference-audit.md).
// Only verified Assetz content is used; M3M sections with no verified Assetz equivalent are omitted (e.g. testimonials).
const { esc, icon, fmtDate } = require('./helpers');
const { leadForm } = require('./layout');

const meta = ({ site, company }) => ({
  title: 'Assetz Property Group | Life, Beautifully Reimagined',
  description: 'Thoughtfully designed homes across Bengaluru. Explore Naru & Nami, Mizumi Reserve, Muse & Maison, Trees & Tandem and Mizu & Ki by Assetz.',
  preload: '<link rel="preload" as="image" href="/assets/video/assetz-hero-poster.webp" media="(min-width: 768px)"><link rel="preload" as="image" href="/assets/video/assetz-hero-mobile-poster.webp" media="(max-width: 767px)">',
  jsonLd: [{
    '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: site.name, url: site.baseUrl, telephone: site.contact.phoneHref, email: site.contact.email,
    address: { '@type': 'PostalAddress', streetAddress: '30, Crescent Road, Madhava Nagar, Seshadripuram', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', postalCode: '560001', addressCountry: 'IN' },
    foundingDate: String(company.foundedYear || 2006), sameAs: Object.values(site.social),
  }],
});

function render({ site, projects, company, blogs, faqs }) {
  const p = projects;
  const img = (slug, kind, i = 0) => { const pr = p.find(x => x.slug === slug) || p[0]; return pr.images.find(x => x.kind === kind) || pr.images[i] || pr.images[0]; };
  const locations = [...new Set(p.map(x => x.locationShort))];
  const types = [...new Set(p.map(x => x.propertyType))];
  const budgets = [...new Set(p.map(x => x.budget).filter(b => b && b !== 'any'))];
  const homeFaqs = faqs.filter(f => f.category === 'About Assetz Projects' || f.category === 'Site Visits & Brochures').slice(0, 6);
  const awards = (company.awards || []).slice(0, 6);
  const blogImgs = [img('assetz-trees-and-tandem', 'landscape'), img('assetz-muse-and-maison', 'architecture', 1), img('assetz-mizu-and-ki', 'interior', 2), img('assetz-mizumi-reserve', 'amenity', 3), img('assetz-naru-and-nami', 'architecture', 1), img('assetz-mizumi-reserve', 'interior', 4)];
  const pillars = [
    { t: 'Better Design', d: 'Thoughtful planning that puts real lifestyles at the centre of every space.', im: img('assetz-muse-and-maison', 'architecture') },
    { t: 'Nature & Sustainability', d: 'Environments that encourage a more meaningful connection with the natural world.', im: img('assetz-trees-and-tandem', 'landscape', 2) },
    { t: 'Lifestyle & Wellbeing', d: 'Spaces that support everyday comfort, recreation and community.', im: img('assetz-mizumi-reserve', 'amenity', 3) },
    { t: 'Future-Ready Living', d: 'Considered planning that adapts to the changing needs of modern life.', im: img('assetz-mizu-and-ki', 'architecture', 1) },
  ];
  const arrows = (id) => `<div class="arrows" data-scroll="${id}"><button type="button" data-dir="-1" aria-label="Previous">${icon('left')}</button><button type="button" data-dir="1" aria-label="Next">${icon('right')}</button></div>`;

  return `
<!-- Hero: full-screen film, centred tagline, finder pills (M3M) -->
<section class="hero" aria-label="Assetz brand film">
  <picture class="media"><source media="(max-width: 767px)" srcset="/assets/video/assetz-hero-mobile-poster.webp"><img class="poster" src="/assets/video/assetz-hero-poster.webp" alt="Assetz residential community at golden hour" fetchpriority="high" width="1920" height="1080"></picture>
  <video id="hero-video" muted loop playsinline preload="none" poster="/assets/video/assetz-hero-poster.webp" data-desktop="/assets/video/assetz-hero-desktop.mp4" data-desktop-webm="/assets/video/assetz-hero-desktop.webm" data-mobile="/assets/video/assetz-hero-mobile.mp4" data-mobile-webm="/assets/video/assetz-hero-mobile.webm" aria-label="Assetz brand film, muted"></video>
  <div class="shade" aria-hidden="true"></div>
  <div class="content"><div class="container">
    <div class="tagline">
      <h1>Life, Beautifully Reimagined.</h1>
      <p>Thoughtfully designed residential communities across Bengaluru.</p>
    </div>
    <form class="finder" id="finder" aria-label="Find your home" method="get" action="/projects/">
      <label class="pill"><span class="sr">Location</span><select name="location"><option value="">Location</option>${locations.map(l => `<option>${esc(l)}</option>`).join('')}</select></label>
      <label class="pill"><span class="sr">Property type</span><select name="type"><option value="">Property Type</option>${types.map(t => `<option>${esc(t)}</option>`).join('')}</select></label>
      <label class="pill"><span class="sr">Budget</span><select name="budget"><option value="">Budget</option>${budgets.map(b => `<option value="${esc(b)}">${esc(budgetLabel(b))}</option>`).join('')}</select></label>
      <button class="search" type="submit">Search</button>
    </form>
  </div></div>
  <button class="play-toggle" id="hero-toggle" type="button" aria-label="Pause video" data-paused="false"><svg class="ic-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg><svg class="ic-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
</section>

<!-- Intro: heading left, copy + pill right (M3M "spaces") -->
<section class="band intro-band" id="discover">
  <div class="container intro">
    <h2 class="reveal">Designed Around Life. Built for Tomorrow.</h2>
    <div class="copy reveal">
      <p>At Assetz, design is more than the way a space looks. It is about the way life unfolds within it. From thoughtfully planned residences to connected landscapes and everyday experiences, each development reflects a commitment to meaningful living, intelligent design and a more sustainable future.</p>
      <a class="btn btn-primary" href="/about-us/">Discover Our Story</a>
    </div>
  </div>
</section>

<!-- Awards: M3M news-card row -->
<section class="band" id="awards">
  <div class="container">
    <div class="iconic-head reveal"><h2 class="heading-lg">Awards &amp; Recognition</h2>${arrows('awards-track')}</div>
    <div class="cards-track" id="awards-track">
      ${awards.map(a => `<a class="news-card" href="/about-us/#awards"><span class="t">${esc(a.title)}</span><span class="d">${esc(a.body)}${a.project ? ` · ${esc(a.project)}` : ''}</span><span class="f"><span>${esc(a.year)}</span>${icon('arrow')}</span></a>`).join('')}
    </div>
    <div class="center-row"><a class="btn btn-outline" href="/about-us/#awards">View More</a></div>
  </div>
</section>

<!-- Counters: 4 verified figures with vertical rules -->
<section class="band alt" id="legacy">
  <div class="container">
    <div class="counters reveal">
      ${(company.stats || []).map(s => `<div class="counter-box"><div class="num" data-count="${s.value}" data-decimals="${s.decimals || 0}" data-suffix="${esc(s.suffix || '')}">0${esc(s.suffix || '')}</div><div class="lbl">${esc(s.label)}</div><span class="src">${esc(s.note || '')}</span></div>`).join('')}
    </div>
  </div>
</section>

<!-- Our Collection: M3M "Iconic Masterpieces" slider -->
<section class="band" id="collection">
  <div class="container"><div class="iconic-head reveal"><div><h2 class="heading-lg">Our Collection</h2><p class="lede" style="margin-top:10px">Five thoughtfully designed communities across Bengaluru.</p></div>${arrows('iconic-track')}</div></div>
  <div class="iconic" data-iconic>
    <div class="track" id="iconic-track">
      ${p.map((pr, i) => `<article class="slide${i === 0 ? ' is-active' : ''}">
        <img class="bg" src="${pr.cover}" alt="${esc(pr.coverAlt || pr.name)}" loading="${i === 0 ? 'eager' : 'lazy'}" width="1600" height="1000">
        <button class="btn btn-outline enq enq-open" type="button" data-project="${esc(pr.name)}" data-source="home-collection">Enquire Now</button>
        <a class="overlay" href="/projects/${pr.slug}/" aria-label="View ${esc(pr.name)}">
          <span class="brandcol">${pr.logo ? `<img class="plogo" src="${pr.logo}" alt="${esc(pr.name)} logo" loading="lazy">` : `<span class="pname">${esc(pr.name)}</span>`}</span>
          <span><span class="cat">${esc(pr.configurations.join(' & '))} ${esc(pr.propertyType)}</span><span class="loc" style="display:block">${esc(pr.location)}</span><span class="meta">${pr.sizes && pr.sizes !== 'Not Mentioned' ? `<span>${esc(pr.sizes)}</span>` : ''}<span>${esc(pr.startingPrice)}</span>${pr.status !== 'Not Mentioned' ? `<span>${esc(pr.status)}</span>` : ''}</span></span>
          <span class="go">${icon('arrow')}</span>
        </a>
        <div class="progress"><span></span></div>
      </article>`).join('')}
    </div>
  </div>
  <div class="container center-row"><a class="btn btn-outline" href="/projects/">View All Projects</a></div>
</section>

<!-- Philosophy: M3M full-bleed accordion -->
<section class="band alt" id="philosophy" style="padding-bottom:0">
  <div class="container"><div class="iconic-head reveal"><div><h2 class="heading-lg">The Art of Better Living</h2><p class="lede" style="margin-top:10px">Four commitments shape every Assetz community.</p></div></div></div>
  <div class="accordion">
    ${pillars.map((x, i) => `<div class="acc${i === 0 ? ' active' : ''}" tabindex="0" role="button" aria-expanded="${i === 0}" aria-label="${esc(x.t)}"><img src="${x.im.src}" alt="" loading="lazy"><span class="top-heading">${esc(x.t)}</span><div class="bottom"><p>${esc(x.d)}</p><a class="btn btn-outline" href="/about-us/" style="color:var(--white);border-color:var(--white)">Know More</a></div></div>`).join('')}
  </div>
</section>

<!-- Journal: M3M "Trending" cards -->
<section class="band" id="journal">
  <div class="container">
    <div class="iconic-head reveal"><h2 class="heading-lg">From the Assetz Journal</h2>${arrows('trend-track')}</div>
    <div class="trend-track" id="trend-track">
      ${blogs.map((b, i) => `<a class="trend" href="/blogs/${b.slug}/"><div class="text"><span class="cat">${esc(b.category)}</span><h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p><span class="date">${fmtDate(b.date)} · ${b.readMinutes} min read</span><span class="btn btn-outline" style="justify-self:start">Read Article</span></div><img src="${blogImgs[i % blogImgs.length].src}" alt="${esc(blogImgs[i % blogImgs.length].alt)}" loading="lazy" width="800" height="600"></a>`).join('')}
    </div>
  </div>
</section>

<!-- Trio cards (M3M Career / Media / Blog row) -->
<section class="band alt">
  <div class="container trio">
    <a href="/about-us/" class="reveal"><div class="row"><h3>About Assetz</h3><span class="ic">${icon('arrow')}</span></div><p>Two decades of homes designed around the way people live in Bengaluru.</p><img src="${img('assetz-mizumi-reserve', 'architecture').src}" alt="" loading="lazy"></a>
    <a href="/blogs/" class="reveal"><div class="row"><h3>Journal</h3><span class="ic">${icon('arrow')}</span></div><p>Ideas and practical guidance on design, neighbourhoods and buying a home.</p><img src="${img('assetz-trees-and-tandem', 'landscape', 1).src}" alt="" loading="lazy"></a>
    <a href="/contact-us/" class="reveal"><div class="row"><h3>Contact Us</h3><span class="ic">${icon('arrow')}</span></div><p>Visit our Bengaluru office or book a site visit to any Assetz community.</p><img src="${img('assetz-muse-and-maison', 'architecture', 2).src}" alt="" loading="lazy"></a>
  </div>
</section>

<!-- Lead magnet: guide + 100acress-style form card -->
<section class="band" id="guide">
  <div class="container lead">
    <div class="copy reveal">
      <h2 class="heading-lg">Bengaluru Premium Homebuyer's Guide</h2>
      <p class="lede">An 11-page guide to choosing a premium home in Bengaluru: locations, layouts, documentation and next steps.</p>
      <ul><li>Location, layout and configuration comparisons</li><li>Carpet area, pricing components and cost sheets explained</li><li>RERA, approvals and the documents to review</li><li>Site-visit checklist and next-step planner</li></ul>
      <div class="cover"><div class="book"><img src="/assets/img/assetz-logo-white.svg" alt=""><b>Bengaluru Premium Homebuyer's Guide</b></div><p style="font-size:14px;color:var(--text-3)">Free PDF, sent to you instantly after you submit the form.</p></div>
    </div>
    <div class="form-card reveal"><h3>Download the Free Guide</h3><p class="sub">Fill in your details to receive the PDF</p>${leadForm({ id: 'guide-form', type: 'Guide', projects: p, compact: true, button: 'Get My Free Guide' })}</div>
  </div>
</section>

<!-- FAQs -->
<section class="band alt" id="faq">
  <div class="container faq-split">
    <div class="side reveal"><h2>Frequently Asked Questions</h2><p>Quick answers about our projects, brochures, project status and site visits.</p><a class="btn btn-outline" href="/faqs/">View All FAQs</a></div>
    <div class="faq-list reveal">${homeFaqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.question)}<span class="plus"></span></summary><div class="answer">${f.answerHtml}</div></details>`).join('')}</div>
  </div>
</section>`;
}

function budgetLabel(b) {
  return { 'under-1cr': 'Under ₹1 Cr', '1-2cr': '₹1 – 2 Cr', '2-3cr': '₹2 – 3 Cr', '3-5cr': '₹3 – 5 Cr', '5cr-plus': '₹5 Cr and above' }[b] || b;
}

module.exports = { meta, render, budgetLabel };
