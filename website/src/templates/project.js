// Project detail template — section order and geometry follow 100acress.com/godrej-verano (see docs/reference-audit.md).
// All facts come from data/projects.json (verified against assetzproperty.com). Missing facts render as "Not Mentioned".
const { esc, icon } = require('./helpers');
const { leadForm } = require('./layout');

const meta = ({ site }, pr) => ({
  title: `${pr.name} | ${pr.locationShort}, Bengaluru | Assetz`,
  description: `${pr.name}: ${pr.configurations.join(' & ')} ${pr.propertyType.toLowerCase()} in ${pr.location}. ${pr.blurb}`.slice(0, 158),
  image: pr.cover,
  ogType: 'article',
  bodyClass: 'pdp',
  project: pr,
  jsonLd: [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.baseUrl + '/' }, { '@type': 'ListItem', position: 2, name: 'Projects', item: site.baseUrl + '/projects/' }, { '@type': 'ListItem', position: 3, name: pr.name, item: `${site.baseUrl}/projects/${pr.slug}/` }] },
    { '@context': 'https://schema.org', '@type': 'Residence', name: pr.name, description: pr.blurb, url: `${site.baseUrl}/projects/${pr.slug}/`, image: site.baseUrl + pr.cover, address: { '@type': 'PostalAddress', streetAddress: pr.address, addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: pr.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
});

const NM = 'Not Mentioned';
const known = v => v && v !== NM;
const val = v => known(v) ? esc(v) : NM;

function head(eyebrow, title, center = true) {
  return `<div class="${center ? 'pdp-head-c' : ''}"><span class="pdp-eyebrow">${esc(eyebrow)}</span><h2 class="pdp-h2">${title}</h2><div class="pdp-bar"></div></div>`;
}

function render({ site, projects, company }, pr) {
  const others = projects.filter(x => x.slug !== pr.slug);
  const wa = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hi, I am interested in ' + pr.name)}`;
  const pricing = pr.pricing && pr.pricing.length ? pr.pricing : pr.configurations.map(c => ({ type: `${c} ${pr.propertyType}`, size: pr.sizes || NM, price: pr.startingPrice || 'Price on Request' }));
  const amenitiesKnown = pr.amenities && pr.amenities.length && pr.amenities[0] !== NM;
  const plans = pr.floorPlans || [];
  const notes = [pr.nameNote, pr.priceNote, pr.statusNote, pr.reraNote, pr.landNote].filter(Boolean).concat(pr.conflicts || []);
  const ovImg = pr.images.find(i => i.kind === 'architecture') || pr.images[1] || pr.images[0];
  const featImg = pr.images.find(i => i.kind === 'landscape') || pr.images[2] || pr.images[0];
  const facts = [
    ['Developer', 'Assetz Property Group'], ['Address', pr.address], ['Property type', pr.propertyType], ['Configurations', pr.configurations.join(', ')],
    ['Unit sizes', pr.sizes], ['Land area', pr.landArea], ['Towers', pr.towers], ['Units', pr.units], ['Floors', pr.floors], ['Status', pr.status],
    ['Possession', pr.possession], ['RERA registration', (pr.rera || []).join(', ')],
  ];
  const cmpSet = [pr, ...others.slice(0, 2)];
  const cmpRows = [
    ['Location', x => esc(x.locationShort)], ['Type', x => `<span class="chip">${esc(x.configurations.join(' & '))}</span>`], ['Sizes', x => val(x.sizes)],
    ['Land area', x => val(x.landArea)], ['Status', x => val(x.status)], ['Starting price', x => esc(x.startingPrice)],
    ['', x => x.slug === pr.slug ? `<div class="acts"><button class="enq-open" type="button" data-type="Brochure" data-project="${esc(x.name)}" data-source="compare">Brochure</button></div>` : `<div class="acts"><a href="/projects/${x.slug}/">View</a><button class="enq-open" type="button" data-project="${esc(x.name)}" data-source="compare">Enquire</button></div>`],
  ];

  return `
<!-- Hero: full-bleed slides, info card left, enquiry card right -->
<section class="pdp-hero" aria-label="${esc(pr.name)}">
  <div class="slides" id="pdp-slides">${pr.images.map((im, i) => `<img src="${im.src}" alt="${esc(im.alt)}" class="${i === 0 ? 'active' : ''}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'} width="1920" height="1080">`).join('')}</div>
  <div class="inner">
    <div class="info-card">
      <div class="top">
        <span class="st">${known(pr.status) ? esc(pr.status) : 'Status: Not Mentioned'}</span>
        <h1>${esc(pr.name)}</h1>
        <span class="loc">${esc(pr.location)}</span>
      </div>
      <div class="facts">
        <div><small>Configuration</small><b>${esc(pr.configurations.join(' & '))}</b></div>
        <div><small>Unit sizes</small><b>${val(pr.sizes)}</b></div>
        <div><small>Land area</small><b>${val(pr.landArea)}</b></div>
        <div><small>Units</small><b>${val(pr.units)}</b></div>
        <div class="price"><small>Starting price</small><b>${esc(pr.startingPrice)}</b></div>
      </div>
    </div>
    <div class="form-card"><h3>Get in Touch</h3><p class="sub">Request a callback for ${esc(pr.name)}</p>${leadForm({ id: 'hero-form', type: 'Enquiry', projects, project: pr, compact: true, button: 'Request Callback' })}</div>
  </div>
  <div class="gnav"><button type="button" id="g-prev" aria-label="Previous image">${icon('left')}</button><span id="g-count">1 / ${pr.images.length}</span><button type="button" id="g-next" aria-label="Next image">${icon('right')}</button></div>
  <p class="note">Images are the developer's renders (artist's impressions)</p>
</section>

<!-- Overview -->
<section class="pdp-sec" id="overview">
  <div class="pdp-wrap ov">
    <div class="text">
      <span class="pdp-eyebrow">About Project</span><h2 class="pdp-h2">${esc(pr.name)}</h2><div class="pdp-bar"></div>
      <div class="clamp" id="ov-text">${pr.overview.map(x => `<p>${esc(x)}</p>`).join('')}</div>
      <button class="read-more" type="button" data-clamp="ov-text">Read more ${icon('right')}</button>
      ${pr.nameNote ? `<p class="fine">${icon('info')}<span>Marketed by the developer as ${esc(pr.officialName.replace(/ \(.*\)$/, ''))}. Final project name to be confirmed at launch.</span></p>` : ''}
      <button class="btn-pdp enq-open" type="button" data-type="Brochure" data-project="${esc(pr.name)}" data-source="overview">${icon('download')} Download Brochure</button>
    </div>
    <div class="img"><img src="${ovImg.src}" alt="${esc(ovImg.alt)}" loading="lazy" width="1184" height="666"></div>
  </div>
</section>

<!-- Highlights -->
<section class="pdp-sec gray" id="highlights">
  <div class="pdp-wrap">
    ${head('Why choose this project', `${esc(pr.name)} <em>Highlights</em>`)}
    <div class="hl-grid">${pr.highlights.map((h, i) => `<div class="hl"><div class="row"><h3>${esc(h.title)}</h3><span class="n">${i + 1}</span></div><p>${esc(h.text)}</p></div>`).join('')}</div>
  </div>
</section>

<!-- Price list -->
<section class="pdp-sec" id="price">
  <div class="pdp-wrap">
    ${head('Price list', `${esc(pr.name)} <em>Price</em>`)}
    <div class="table-scroll"><table class="ptable">
      <thead><tr><th scope="col">Unit type</th><th scope="col">Size</th><th scope="col">Price</th><th scope="col">Cost sheet</th></tr></thead>
      <tbody>${pricing.map(r => `<tr><td><span class="type"><i>${icon('home')}</i>${esc(r.type)}</span></td><td class="size">${val(r.size)}</td><td class="price">${esc(r.price || 'Price on Request')}</td><td><button class="plan enq-open" type="button" data-project="${esc(pr.name)}" data-source="price-table">Request ${icon('right')}</button></td></tr>`).join('')}</tbody>
    </table></div>
    <div class="cta-row">
      <button class="big enq-open" type="button" data-project="${esc(pr.name)}" data-source="price-cta">${icon('download')} Get Detailed Price Sheet</button>
      <span class="or">or</span>
      <a class="expert" href="tel:${site.contact.phoneHref}"><i>${icon('phone')}</i><span><small>Talk to an advisor</small><b>${esc(site.contact.phone)}</b></span></a>
    </div>
    <p class="fine">${icon('info')}<span>${pr.priceNote ? esc(pr.priceNote) + ' ' : ''}Prices are shown only where published by the developer; otherwise "Price on Request". Final pricing depends on unit, floor and applicable charges as per the official cost sheet.</span></p>
  </div>
</section>

<!-- Project details (features checklist) -->
<section class="pdp-sec gray" id="details">
  <div class="pdp-wrap feat">
    <div class="img"><img src="${featImg.src}" alt="${esc(featImg.alt)}" loading="lazy" width="1184" height="1280"></div>
    <div>
      <span class="pdp-eyebrow line">Project details</span>
      <h2 class="pdp-h2">Verified <em>facts</em></h2>
      <ul>${facts.map(([k, v]) => `<li><span class="chk">${icon('check')}</span><span><b>${esc(k)}:</b> ${val(v)}</span></li>`).join('')}</ul>
      <p class="fine">${icon('info')}<span>Source: ${esc(pr.sourceUrl)}, checked ${esc(pr.sourceDate)}. "Not Mentioned" means the developer has not published that detail.</span></p>
    </div>
  </div>
</section>

${notes.length ? `<!-- Source notes -->
<section class="pdp-sec" id="notes">
  <div class="pdp-wrap"><div class="story"><h3>Before you book: notes from the developer's sources</h3><div class="clamp" id="notes-text"><ul style="list-style:disc;padding-left:18px;display:grid;gap:8px">${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></div><button class="read-more" type="button" data-clamp="notes-text">Read more ${icon('right')}</button></div></div>
</section>` : ''}

<!-- Amenities -->
<section class="pdp-sec dark" id="amenities">
  <div class="pdp-wrap">
    ${head('Lifestyle', `${esc(pr.name)} <em>Amenities</em>`)}
    ${amenitiesKnown ? `<div class="am-grid">${pr.amenities.map(a => `<div class="am">${icon('check')}<span>${esc(a)}</span></div>`).join('')}</div><p class="am-note">Amenities as published by the developer; final specifications as per the approved plan.</p>` : `<p class="am-note">The developer has not published a detailed amenity list yet. Request the brochure for the complete amenity plan.</p>`}
  </div>
</section>

<!-- Gallery -->
<section class="pdp-sec" id="gallery">
  <div class="pdp-wrap">
    ${head('Gallery', `${esc(pr.name)} <em>Gallery</em>`)}
    <div class="gal" data-lightbox>${pr.images.map(im => `<button type="button" data-src="${im.src}" data-cap="${esc(im.alt)}" aria-label="Open ${esc(im.alt)}"><img src="${im.src}" alt="${esc(im.alt)}" loading="lazy" width="800" height="500"></button>`).join('')}</div>
  </div>
</section>

<!-- Floor plans -->
<section class="pdp-sec gray" id="floor-plans">
  <div class="pdp-wrap">
    <div class="fp-head"><div><span class="pdp-eyebrow">Layouts</span><h2 class="pdp-h2">Floor <em>Plans</em></h2><div class="pdp-bar"></div></div><span class="badge">${plans.length} plan${plans.length === 1 ? '' : 's'}${pr.masterPlan ? ' + master plan' : ''}</span></div>
    ${plans.length || pr.masterPlan ? (() => {
      const all = plans.map(fp => ({ src: fp.src, label: fp.label, size: fp.size || '' })).concat(pr.masterPlan ? [{ src: pr.masterPlan, label: 'Master plan', size: 'As published by the developer' }] : []);
      return `<div class="fp-box" data-fp data-lightbox>
      <span class="count" id="fp-count">1 / ${all.length}</span>
      <button class="nav l" type="button" data-fp-dir="-1" aria-label="Previous plan">${icon('left')}</button>
      <div class="fp-track" id="fp-track">${all.map(f => `<button class="fp" type="button" data-src="${f.src}" data-cap="${esc(f.label)}"><b>${esc(f.label)}</b><img src="${f.src}" alt="${esc(f.label)}, ${esc(pr.name)}" loading="lazy" width="800" height="600"><span>${esc(f.size)}</span></button>`).join('')}</div>
      <button class="nav r" type="button" data-fp-dir="1" aria-label="Next plan">${icon('right')}</button>
    </div>
    <div class="fp-thumbs">${all.map((f, i) => `<button type="button" data-fp-go="${i}" aria-current="${i === 0}" aria-label="Show ${esc(f.label)}"><img src="${f.src}" alt="" loading="lazy" width="80" height="48"></button>`).join('')}</div>`;
    })() : `<p class="fine">Approved floor plans are shared with the brochure.</p>`}
    <div class="cta-row"><button class="btn-pdp enq-open" type="button" data-type="Brochure" data-project="${esc(pr.name)}" data-source="floor-plans">${icon('download')} Request Floor Plans</button></div>
  </div>
</section>

<!-- Location -->
<section class="pdp-sec" id="location">
  <div class="pdp-wrap">
    <div class="loc-head"><div><span class="pdp-eyebrow">Location</span><h2 class="pdp-h2">${esc(pr.name)} <em>Location</em></h2><div class="pdp-bar"></div><p><b>${esc(pr.address)}</b></p></div>${pr.mapsUrl ? `<a class="btn-pdp" href="${esc(pr.mapsUrl)}" target="_blank" rel="noopener">${icon('pin')} Open in Google Maps</a>` : ''}</div>
    <div class="loc-grid">
      <button class="loc-map" type="button" data-lightbox-single data-src="/assets/img/maps/${pr.slug}.jpg" data-cap="${esc(pr.name)} location map (developer)"><img src="/assets/img/maps/${pr.slug}.jpg" alt="Location map of ${esc(pr.name)}, published by the developer" loading="lazy" width="1200" height="800"><span class="tag">Location map · developer</span></button>
      <div class="near"><h3>Nearby Essentials</h3><small>Travel times as stated by the developer</small>
        ${pr.connectivity && pr.connectivity.length ? `<ul>${pr.connectivity.map(c => `<li><span class="chk">${icon('pin')}</span><div>${esc(c.name)}<span>${esc(c.note || '')}</span></div></li>`).join('')}</ul>` : `<p class="fine">Distances are not published by the developer.</p>`}
      </div>
    </div>
  </div>
</section>

<!-- Get in touch band -->
<section class="gt" id="contact">
  <div class="pdp-wrap">
    <span class="pdp-eyebrow">Get in touch</span>
    <a class="num" href="tel:${site.contact.phoneHref}" data-track="call">${esc(site.contact.phone)}</a>
    <div class="bar2"></div>
    ${leadForm({ id: 'gt-form', type: 'Enquiry', projects, project: pr, compact: true, button: 'Request Callback' })}
  </div>
</section>

<!-- Developer -->
<section class="pdp-sec" id="developer">
  <div class="pdp-wrap">
    <div class="dev">
      <div class="top">
        <div class="logo"><div><img src="/assets/img/assetz-logo.svg" alt="Assetz Property Group" width="84" height="34"></div><small>Established<b>${esc(String(company.foundedYear || 2006))}</b></small></div>
        <div><span class="pdp-eyebrow">About the developer</span><h3>Assetz Property Group</h3><p>${esc(company.profile)}</p></div>
      </div>
      <div class="more"><span class="pdp-eyebrow">More projects by Assetz</span>
        <div class="mtrack">${others.map(o => `<a href="/projects/${o.slug}/"><img src="${o.cover}" alt="${esc(o.name)}" loading="lazy" width="400" height="400"><b>${esc(o.name)}</b><span>View Project</span></a>`).join('')}</div>
      </div>
    </div>
  </div>
</section>

<!-- Compare + EMI -->
<section class="pdp-sec gray" id="compare">
  <div class="pdp-wrap">
    <div class="cmp-head"><div><span class="pdp-eyebrow">Compare</span><h2 class="pdp-h2">Compare <em>projects</em></h2><div class="pdp-bar"></div></div></div>
    <div class="cmp">
      <div class="cmp-table"><table>
        <thead><tr><th scope="col">Attribute</th>${cmpSet.map(x => `<th scope="col"><div class="p"><img src="${x.cover}" alt="" loading="lazy" width="52" height="52"><div>${x.slug === pr.slug ? '<span class="cur">This project</span>' : ''}<b>${esc(x.name)}</b><span>${esc(x.locationShort)}</span></div></div></th>`).join('')}</tr></thead>
        <tbody>${cmpRows.map(([k, f]) => `<tr><td>${esc(k)}</td>${cmpSet.map(x => `<td>${f(x)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
      <div class="emi" id="emi">
        <div class="box">
          <b style="font-size:16px">EMI Calculator</b>
          <label>Loan amount<span class="money">₹<input id="emi-amt" type="text" inputmode="numeric" value="1,50,00,000" aria-label="Loan amount in rupees"></span></label>
          <label>Interest rate (% p.a.)<span class="rng"><input id="emi-rate" type="range" min="6" max="14" step="0.05" value="8.5" aria-label="Interest rate"><output id="emi-rate-o">8.50%</output></span></label>
          <label>Tenure (years)<span class="rng"><input id="emi-yrs" type="range" min="5" max="30" step="1" value="20" aria-label="Tenure in years"><output id="emi-yrs-o">20 yrs</output></span></label>
        </div>
        <div class="box result">
          <small>Monthly EMI</small><b id="emi-out">₹0</b>
          <div class="ring" id="emi-ring"><div><small>Total payable</small><span id="emi-total">₹0</span></div></div>
          <div class="legend"><span><i style="background:var(--ink)"></i>Principal</span><span><i style="background:var(--slate)"></i>Interest</span></div>
          <p class="disc">Illustrative calculation only; not an offer of finance. Actual EMI depends on your lender.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQs -->
<section class="pdp-sec" id="faqs">
  <div class="pdp-wrap">
    ${head('FAQs', `Frequently Asked <em>Questions</em>`)}
    <div class="faq-list">${pr.faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}<span class="plus"></span></summary><div class="answer"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
  </div>
</section>

<section class="pdp-disc"><div class="pdp-wrap"><b>DISCLAIMER</b><p>${esc(site.partnerNotice)} Images are artist's impressions published by the developer. Specifications, plans and prices are indicative and subject to change as per approvals. RERA: ${esc((pr.rera || []).join(', ') || NM)}, to be verified on the Karnataka RERA portal.</p><p>${esc(site.copyright)}</p></div></section>
<footer class="pdp-foot"><nav aria-label="Footer"><a href="/">Home</a><span>|</span><a href="/projects/">Projects</a><span>|</span><a href="/about-us/">About Us</a><span>|</span><a href="/contact-us/">Contact</a><span>|</span><a href="/privacy-policy/">Privacy Policy</a><span>|</span><a href="/terms-and-conditions/">Terms</a><span>|</span><a href="/disclaimer/">Disclaimer</a></nav></footer>

<div class="sticky-bar" aria-label="Quick actions"><a href="tel:${site.contact.phoneHref}">${icon('phone')}Call</a><a href="${wa}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a><button class="enq-open enq" type="button" data-project="${esc(pr.name)}" data-source="sticky">${icon('mail')}Enquire</button></div>`;
}
module.exports = { meta, render };
