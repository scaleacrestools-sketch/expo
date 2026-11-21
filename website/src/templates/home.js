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
  const pick = (slug, kind, fallbackIdx = 0) => { const pr = p.find(x => x.slug === slug) || p[0]; const im = pr.images.find(i => i.kind === kind) || pr.images[fallbackIdx] || pr.images[0]; return im; };
  const locations = [...new Set(p.map(x => x.locationShort))];
  const types = [...new Set(p.map(x => x.propertyType))];
  const configs = [...new Set(p.flatMap(x => x.configurations))];
  const budgets = [...new Set(p.map(x => x.budget).filter(b => b && b !== 'any'))];
  const stats = company.stats || [];
  const homeFaqs = faqs.filter(f => f.category === 'About Assetz Projects' || f.category === 'Site Visits & Brochures').slice(0, 6);
  const posts = blogs.slice(0, 3);
  const blogImgs = [pick('assetz-trees-and-tandem', 'landscape'), pick('assetz-muse-and-maison', 'architecture', 1), pick('assetz-mizu-and-ki', 'interior', 2)];

  return `
<!-- 2. Cinematic hero -->
<section class="hero" aria-label="Assetz brand film">
  <picture class="media"><source media="(max-width: 767px)" srcset="/assets/video/assetz-hero-mobile-poster.webp"><img class="poster" src="/assets/video/assetz-hero-poster.webp" alt="Assetz residential community at golden hour" fetchpriority="high" width="1920" height="1080"></picture>
  <video id="hero-video" muted loop playsinline preload="none" poster="/assets/video/assetz-hero-poster.webp" data-desktop="/assets/video/assetz-hero-desktop.mp4" data-desktop-webm="/assets/video/assetz-hero-desktop.webm" data-mobile="/assets/video/assetz-hero-mobile.mp4" data-mobile-webm="/assets/video/assetz-hero-mobile.webm" aria-label="Assetz brand film, muted"></video>
  <div class="shade" aria-hidden="true"></div>
  <div class="content"><div class="container">
    <div class="copy">
      <span class="eyebrow" style="color:var(--bronze-2)"><span class="t-reveal"><span style="animation-delay:.1s">Assetz Property Group</span></span></span>
      <h1><span class="t-reveal"><span style="animation-delay:.25s">Life, Beautifully</span></span> <span class="t-reveal"><span style="animation-delay:.4s"><em>Reimagined.</em></span></span></h1>
      <p class="lede fade-up" style="animation-delay:.6s">Discover thoughtfully designed residential communities that bring together architectural excellence, nature, and contemporary living in Bengaluru.</p>
      <div class="cta fade-up" style="animation-delay:.8s"><a class="btn btn-bronze" href="/projects/">Explore Our Projects</a><a class="btn btn-outline" href="/about-us/">Our Philosophy</a></div>
    </div>
  </div></div>
  <button class="play-toggle" id="hero-toggle" type="button" aria-label="Pause video" data-paused="false"><svg class="ic-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg><svg class="ic-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
  <span class="scroll-cue" aria-hidden="true"></span>
</section>

<!-- Premium property finder -->
<div class="container finder">
  <form id="finder" aria-label="Find your home" method="get" action="/projects/">
    <label>Select Location<select name="location"><option value="">All locations</option>${locations.map(l => `<option>${esc(l)}</option>`).join('')}</select></label>
    <label>Property Type<select name="type"><option value="">All types</option>${types.map(t => `<option>${esc(t)}</option>`).join('')}</select></label>
    <label>Configuration<select name="configuration"><option value="">Any configuration</option>${configs.map(c => `<option>${esc(c)}</option>`).join('')}</select></label>
    <label>Budget<select name="budget"><option value="">Any budget</option>${budgets.map(b => `<option value="${esc(b)}">${esc(budgetLabel(b))}</option>`).join('')}</select></label>
    <button class="btn btn-ink" type="submit">Find Your Home</button>
  </form>
</div>

<!-- 3. Introduction -->
<section class="band" id="discover">
  <div class="container intro">
    <figure class="frame reveal"><img src="${pick('assetz-mizumi-reserve', 'architecture').src}" alt="${esc(pick('assetz-mizumi-reserve', 'architecture').alt)}" loading="lazy" width="1200" height="1500"><figcaption><b>${esc(String(company.foundedYear || 2006))}</b><span>Building in Bengaluru since</span></figcaption></figure>
    <div class="copy reveal">
      <span class="eyebrow">Discover Assetz</span>
      <h2>Designed Around Life. Built for Tomorrow.</h2>
      <p>At Assetz, design is more than the way a space looks. It is about the way life unfolds within it. From thoughtfully planned residences to connected landscapes and everyday experiences, each development reflects a commitment to meaningful living, intelligent design and a more sustainable future.</p>
      <div><a class="btn btn-ink" href="/about-us/">Discover Our Story ${icon('arrow')}</a></div>
    </div>
  </div>
</section>

<!-- 4. Legacy & achievements -->
<section class="band legacy" id="legacy">
  <div class="bg parallax"><img src="${pick('assetz-trees-and-tandem', 'architecture').src}" alt="" loading="lazy"></div>
  <div class="container">
    <div class="section-head reveal" style="margin-bottom:0"><span class="eyebrow" style="color:var(--bronze-2)">A Legacy of Better Design</span><h2 style="color:var(--ivory)">Two decades of homes designed around people.</h2><p class="lede">${esc(company.statsIntro || 'Figures as published by Assetz Property Group on its official website.')}</p></div>
    <div class="stats reveal">
      ${stats.map(s => `<div class="stat"><div class="num" data-count="${s.value}" data-decimals="${s.decimals || 0}">0${s.suffix ? `<sup>${esc(s.suffix)}</sup>` : ''}</div><div class="label">${esc(s.label)}</div><span class="src">${esc(s.note || '')}</span></div>`).join('')}
    </div>
  </div>
</section>

<!-- 5. Featured projects slider -->
<section class="band" id="collection">
  <div class="container">
    <div class="section-head split reveal">
      <div><span class="eyebrow">Our Collection</span><h2>Landmark Homes. Distinctive Experiences.</h2><p class="lede" style="margin-top:.6rem">Explore a collection of thoughtfully designed residences across Bengaluru's evolving neighbourhoods.</p></div>
      <div class="arrows"><button type="button" data-dir="-1" aria-label="Previous project">${icon('left')}</button><button type="button" data-dir="1" aria-label="Next project">${icon('right')}</button></div>
    </div>
  </div>
  <div class="container slider" data-slider data-auto="7000">
    <div class="track">
      ${p.map(pr => `<article class="slide">
        <img src="${pr.cover}" alt="${esc(pr.coverAlt || pr.name)}" loading="lazy" width="1600" height="1000">
        ${pr.logo ? `<img class="logo" src="${pr.logo}" alt="${esc(pr.name)} logo">` : ''}
        ${pr.status !== 'Not Mentioned' ? `<span class="status">${esc(pr.status)}</span>` : ''}
        <div class="body">
          <div><span class="loc">${esc(pr.location)}</span><h3>${esc(pr.name)}</h3><div class="meta"><span>${esc(pr.configurations.join(' & '))} ${esc(pr.propertyType)}</span>${pr.sizes && pr.sizes !== 'Not Mentioned' ? `<span>${esc(pr.sizes)}</span>` : ''}<span>${esc(pr.startingPrice)}</span></div></div>
          <div class="ctas"><a class="btn btn-ivory" href="/projects/${pr.slug}/">View Project</a><button class="btn btn-outline enq-open" type="button" data-project="${esc(pr.name)}" data-source="home-slider">Enquire Now</button></div>
        </div>
      </article>`).join('')}
    </div>
    <div class="foot"><div class="dots" aria-label="Slides"></div><a class="link" href="/projects/">All five projects ${icon('arrow')}</a></div>
  </div>
</section>

<!-- 6. Editorial showcase -->
<section class="band ivory2" id="showcase">
  <div class="container">
    <div class="section-head center reveal"><span class="eyebrow">Five Addresses</span><h2>Each community, its own way of living.</h2></div>
    <div class="showcase">
      ${p.map((pr, i) => `<article class="show reveal">
        <a class="media" href="/projects/${pr.slug}/" aria-label="${esc(pr.name)}"><img src="${(pr.images[1] || pr.images[0]).src}" alt="${esc((pr.images[1] || pr.images[0]).alt)}" loading="lazy" width="1200" height="900"><span class="num">0${i + 1}</span></a>
        <div class="copy">
          <span class="eyebrow">${esc(pr.locationShort)} · ${esc(pr.propertyType)}</span>
          <h3>${esc(pr.name)}</h3>
          <div class="meta"><span>${esc(pr.configurations.join(' & '))}</span><span>Status: ${esc(pr.status)}</span>${pr.rera && pr.rera.length && pr.rera[0] !== 'Not Mentioned' ? `<span>RERA ${esc(pr.rera[0])}</span>` : ''}</div>
          <p>${esc(pr.blurb)}</p>
          <div><a class="link" href="/projects/${pr.slug}/">Explore ${esc(pr.name)} ${icon('arrow')}</a></div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<!-- 7. Design philosophy -->
<section class="band" id="philosophy">
  <div class="container">
    <div class="section-head split reveal"><div><span class="eyebrow">The Art of Better Living</span><h2>Thoughtfully Designed. Naturally Extraordinary.</h2></div><p class="lede">Four commitments shape every Assetz community, from the first sketch to the day you move in.</p></div>
    <div class="pillars">
      ${[
        { t: 'Better Design', d: 'Thoughtful planning that puts real lifestyles at the centre of every space.', img: pick('assetz-muse-and-maison', 'architecture') },
        { t: 'Nature & Sustainability', d: 'Environments that encourage a more meaningful connection with the natural world.', img: pick('assetz-trees-and-tandem', 'landscape', 2) },
        { t: 'Lifestyle & Wellbeing', d: 'Spaces that support everyday comfort, recreation and community.', img: pick('assetz-mizumi-reserve', 'amenity', 3) },
        { t: 'Future-Ready Living', d: 'Considered planning that adapts to the changing needs of modern life.', img: pick('assetz-mizu-and-ki', 'architecture', 1) },
      ].map((x, i) => `<div class="pillar${i === 0 ? ' active' : ''}" tabindex="0" role="button" aria-label="${esc(x.t)}"><img src="${x.img.src}" alt="" loading="lazy"><span class="n">0${i + 1}</span><span class="title vertical">${esc(x.t)}</span><div class="desc"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div></div>`).join('')}
    </div>
  </div>
</section>

<!-- 8. Lifestyle storytelling -->
<section class="band dark" id="lifestyle">
  <div class="container">
    <div class="section-head center reveal"><span class="eyebrow" style="color:var(--bronze-2)">Beyond Four Walls</span><h2>More Space for What Matters.</h2><p class="lede">A remarkable home is not simply defined by its interiors. It is shaped by the moments around it: quiet mornings, welcoming green spaces, shared experiences and the freedom to live every day beautifully.</p></div>
    <div class="life">
      ${[[pick('assetz-mizu-and-ki', 'architecture'), 'Contemporary architecture'], [pick('assetz-trees-and-tandem', 'landscape', 1), 'Landscaped outdoor living'], [pick('assetz-muse-and-maison', 'interior', 2), 'Premium interior experience']].map(([im, cap]) => `<figure class="reveal"><img src="${im.src}" alt="${esc(im.alt)}" loading="lazy" width="900" height="1200"><figcaption>${cap}</figcaption></figure>`).join('')}
    </div>
  </div>
</section>

<!-- 9. Lead magnet -->
<section class="band" id="guide">
  <div class="container">
    <div class="lead reveal">
      <div class="copy">
        <span class="eyebrow">The Homebuyer's Edition</span>
        <h2>Your Guide to Better Living in Bengaluru.</h2>
        <p>Explore important considerations for buying a premium home in Bengaluru, from choosing the right location and comparing layouts to understanding project documentation and planning your next steps.</p>
        <ul><li>Location, layout and configuration comparisons</li><li>Carpet area, pricing components and cost sheets explained</li><li>RERA, approvals and the documents to review</li><li>Site-visit checklist and next-step planner</li></ul>
      </div>
      <div class="book-side">
        <div class="book"><small>Assetz · 2026 edition</small><b>Bengaluru Premium Homebuyer's Guide</b></div>
        <h3>Download the Bengaluru Premium Homebuyer's Guide</h3>
        ${leadForm({ id: 'guide-form', type: 'Guide', projects: p, purpose: true, time: false, button: 'Get My Free Guide' })}
      </div>
    </div>
  </div>
</section>

<!-- 10. Blog preview -->
<section class="band ivory2" id="journal">
  <div class="container">
    <div class="section-head split reveal"><div><span class="eyebrow">The Assetz Journal</span><h2>Perspectives on Better Living.</h2><p class="lede" style="margin-top:.6rem">Explore ideas, insights and practical guidance about contemporary homes, thoughtful design and Bengaluru real estate.</p></div><a class="btn btn-outline" href="/blogs/">Explore All Articles</a></div>
    <div class="posts">
      ${posts.map((b, i) => `<a class="post reveal" href="/blogs/${b.slug}/"><div class="img"><img src="${blogImgs[i].src}" alt="${esc(blogImgs[i].alt)}" loading="lazy" width="900" height="600"></div><span class="cat">${esc(b.category)}</span><h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p><span class="date">${fmtDate(b.date)} · ${b.readMinutes} min read</span><span class="link">Read Article ${icon('arrow')}</span></a>`).join('')}
    </div>
  </div>
</section>

<!-- 11. FAQ preview -->
<section class="band" id="faq">
  <div class="container faq-split">
    <div class="side reveal"><span class="eyebrow">Know Before You Explore</span><h2>Questions, Thoughtfully Answered.</h2><p>Quick answers about our projects, configurations, brochures, project status and site visits.</p><div><a class="btn btn-ink" href="/faqs/">View All FAQs</a></div></div>
    <div class="faq-list reveal">${homeFaqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.question)}<span class="plus"></span></summary><div class="answer">${f.answerHtml}</div></details>`).join('')}</div>
  </div>
</section>

<!-- 12. Enquiry -->
<section class="band ivory2" id="enquire">
  <div class="container">
    <div class="section-head center reveal"><span class="eyebrow">Begin Your Journey</span><h2>Let's Find a Home That Feels Right.</h2><p class="lede">Share what you are looking for, and our property advisory team will help you explore the most relevant Assetz developments.</p></div>
    <div class="enquiry">
      <div class="visual reveal"><img src="${pick('assetz-muse-and-maison', 'architecture', 2).src}" alt="${esc(pick('assetz-muse-and-maison', 'architecture', 2).alt)}" loading="lazy"><div class="over"><b>Private consultations</b><span>Site visits across Bengaluru, seven days a week. Call ${esc(site.contact.phone)} or message us on WhatsApp.</span></div></div>
      <div class="form-card reveal"><h3>Request a Private Consultation</h3>${leadForm({ id: 'home-enquiry', type: 'Enquiry', projects: p, button: 'Request a Private Consultation', time: true })}</div>
    </div>
  </div>
</section>`;
}

function budgetLabel(b) {
  return { 'under-1cr': 'Under ₹1 Cr', '1-2cr': '₹1 – 2 Cr', '2-3cr': '₹2 – 3 Cr', '3-5cr': '₹3 – 5 Cr', '5cr-plus': '₹5 Cr and above' }[b] || b;
}

module.exports = { meta, render, budgetLabel };
