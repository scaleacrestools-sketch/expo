const { esc, icon } = require('./helpers');
const { leadForm } = require('./layout');

const meta = ({ site }, pr) => ({
  title: `${pr.name} | ${pr.locationShort}, Bengaluru | Assetz`,
  description: `${pr.name}: ${pr.configurations.join(' & ')} ${pr.propertyType.toLowerCase()} in ${pr.location}. ${pr.blurb}`.slice(0, 158),
  image: pr.cover,
  ogType: 'article',
  jsonLd: [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.baseUrl + '/' }, { '@type': 'ListItem', position: 2, name: 'Projects', item: site.baseUrl + '/projects/' }, { '@type': 'ListItem', position: 3, name: pr.name, item: `${site.baseUrl}/projects/${pr.slug}/` }] },
    { '@context': 'https://schema.org', '@type': 'Residence', name: pr.name, description: pr.blurb, url: `${site.baseUrl}/projects/${pr.slug}/`, image: site.baseUrl + pr.cover, address: { '@type': 'PostalAddress', streetAddress: pr.address, addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: pr.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
});

const HL_ICONS = ['home', 'leaf', 'people', 'sun', 'grid', 'shield', 'water', 'road', 'star', 'clock'];

function render({ site, projects, company }, pr) {
  const others = projects.filter(x => x.slug !== pr.slug).slice(0, 3);
  const row = (k, v) => v && v !== 'Not Mentioned' ? `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>` : `<tr><th scope="row">${esc(k)}</th><td><span class="source-note">Not Mentioned</span></td></tr>`;
  const sum = (k, v) => `<div><small>${esc(k)}</small><b>${esc(v || 'Not Mentioned')}</b></div>`;
  const brochureBtn = `<button class="btn btn-bronze enq-open" type="button" data-type="Brochure" data-project="${esc(pr.name)}" data-source="project-hero">Request Brochure</button>`;
  const enquireBtn = `<button class="btn btn-outline enq-open" type="button" data-project="${esc(pr.name)}" data-source="project-hero">Enquire Now</button>`;
  const amenitiesKnown = pr.amenities && pr.amenities.length && pr.amenities[0] !== 'Not Mentioned';
  const plansKnown = pr.floorPlans && pr.floorPlans.length;
  const pricing = pr.pricing && pr.pricing.length ? pr.pricing : pr.configurations.map(c => ({ type: `${c} ${pr.propertyType}`, size: pr.sizes || 'Not Mentioned', price: pr.startingPrice || 'Price on Request' }));

  return `
<!-- 1. Hero & gallery -->
<section class="p-hero">
  <div class="gallery" data-lightbox>${pr.images.map((im, i) => `<img src="${im.src}" alt="${esc(im.alt)}" class="${i === 0 ? 'active' : ''}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'} data-src="${im.src}" data-cap="${esc(im.alt)}">`).join('')}</div>
  <div class="container content">
    <div class="copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span><a href="/projects/">Projects</a></span><span>${esc(pr.name)}</span></nav>
      <div class="tags"><span class="tag status">${esc(pr.status)}</span><span class="tag">${esc(pr.propertyType)}</span><span class="tag">${esc(pr.configurations.join(' & '))}</span></div>
      <h1>${esc(pr.name)}</h1>
      <p class="sub">${esc(pr.headline)}</p>
      ${pr.nameNote ? `<p style="font-size:.78rem;color:rgba(245,242,236,.7);max-width:60ch">Marketed by the developer as ${esc(pr.officialName.replace(/ \(.*\)$/, ''))}. Final project name to be confirmed at launch.</p>` : ''}
      <div class="quick"><span>${icon('pin')} ${esc(pr.location)}</span><span><b>Starting price:</b> ${esc(pr.startingPrice)}</span>${pr.sizes && pr.sizes !== 'Not Mentioned' ? `<span><b>Sizes:</b> ${esc(pr.sizes)}</span>` : ''}</div>
      <div class="ctas">${brochureBtn}${enquireBtn}</div>
    </div>
    <div class="gnav"><span class="count" id="g-count">1 / ${pr.images.length}</span><div class="arrows"><button type="button" id="g-prev" aria-label="Previous image">${icon('left')}</button><button type="button" id="g-next" aria-label="Next image">${icon('right')}</button></div></div>
  </div>
</section>
<div class="thumbs" aria-label="Gallery thumbnails">${pr.images.map((im, i) => `<button type="button" aria-current="${i === 0}" aria-label="Show image ${i + 1}"><img src="${im.src}" alt="" loading="lazy" width="92" height="69"></button>`).join('')}</div>

<section class="band tight">
  <div class="container p-layout">
    <div class="p-main">
      <!-- 2. Summary -->
      <div class="p-section" id="summary">
        <div class="summary">${sum('Project', pr.name)}${sum('Location', pr.locationShort)}${sum('Property type', pr.propertyType)}${sum('Configurations', pr.configurations.join(', '))}${sum('Size range', pr.sizes)}${sum('Total area', pr.landArea)}${sum('Towers / units', [pr.towers, pr.units].filter(x => x && x !== 'Not Mentioned').join(' · ') || 'Not Mentioned')}${sum('Starting price', pr.startingPrice)}</div>
      </div>
      <!-- 3. Overview -->
      <div class="p-section" id="overview">
        <span class="eyebrow">Overview</span><h2>${esc(pr.headline)}</h2>
        <div class="prose">${pr.overview.map(x => `<p>${esc(x)}</p>`).join('')}</div>
      </div>
      <!-- 4. Project details -->
      <div class="p-section" id="details">
        <span class="eyebrow">Project Details</span><h2>Verified project facts</h2>
        <div class="table-wrap"><table class="table"><tbody>
          ${row('Official name', pr.officialName)}${row('Developer', 'Assetz Property Group')}${row('Address', pr.address)}${row('Property type', pr.propertyType)}${row('Configurations', pr.configurations.join(', '))}${row('Unit sizes', pr.sizes)}${row('Land area', pr.landArea)}${row('Towers', pr.towers)}${row('Units', pr.units)}${row('Floors', pr.floors)}${row('Possession', pr.possession)}${row('RERA registration', pr.rera.join(', '))}${row('Starting price', pr.startingPrice)}
        </tbody></table></div>
        <p class="source-note">Source: ${esc(pr.sourceUrl)} · verified ${esc(pr.sourceDate)}. Fields marked "Not Mentioned" are not published by the developer and are deliberately left unstated.</p>
        ${[pr.nameNote, pr.priceNote, pr.statusNote, pr.reraNote, pr.landNote].filter(Boolean).length || (pr.conflicts && pr.conflicts.length) ? `<details class="faq-list" style="border-top:1px solid var(--line)"><summary style="font-size:1.05rem">Data notes and source discrepancies<span class="plus"></span></summary><div class="answer"><ul style="list-style:disc;padding-left:1.2rem;display:grid;gap:.5rem">${[pr.nameNote, pr.priceNote, pr.statusNote, pr.reraNote, pr.landNote].filter(Boolean).concat(pr.conflicts || []).map(n => `<li>${esc(n)}</li>`).join('')}</ul></div></details>` : ''}
      </div>
      <!-- 5. Status -->
      <div class="p-section" id="status"><span class="eyebrow">Project Status</span><div><span class="status-pill">${esc(pr.status)}</span></div>${pr.possession && pr.possession !== 'Not Mentioned' ? `<p class="prose">Possession: ${esc(pr.possession)}</p>` : ''}</div>
      <!-- 6. Enquiry -->
      <div class="p-section" id="enquire-inline">
        <div class="form-card"><span class="eyebrow">Enquire Now</span><h3>Interested in ${esc(pr.name)}?</h3>${leadForm({ id: 'project-form', type: 'Enquiry', projects, project: pr, button: 'Send Enquiry', message: true })}</div>
      </div>
      <!-- 7. Highlights -->
      <div class="p-section" id="highlights">
        <span class="eyebrow">Project Highlights</span><h2>What sets ${esc(pr.name)} apart</h2>
        <div class="highlights">${pr.highlights.map((h, i) => `<div class="hl">${icon(h.icon || HL_ICONS[i % HL_ICONS.length])}<b>${esc(h.title)}</b><p>${esc(h.text)}</p></div>`).join('')}</div>
      </div>
      <!-- 8. Amenities -->
      <div class="p-section" id="amenities">
        <span class="eyebrow">Amenities</span><h2>Everyday life, well provided for</h2>
        ${amenitiesKnown ? `<div class="amenities">${pr.amenities.map(a => `<div class="amenity">${esc(a)}</div>`).join('')}</div>` : `<p class="prose">The developer has not published a detailed amenity list for this project yet. Request the brochure for the complete amenity plan.</p>`}
      </div>
      <!-- 9. Configurations & pricing -->
      <div class="p-section" id="pricing">
        <span class="eyebrow">Configurations &amp; Pricing</span><h2>Choose your configuration</h2>
        <div class="table-wrap"><table class="table"><thead><tr><th>Type</th><th>Size</th><th>Price</th><th></th></tr></thead><tbody>
          ${pricing.map(r => `<tr><td><b>${esc(r.type)}</b></td><td>${esc(r.size || 'Not Mentioned')}</td><td>${esc(r.price || 'Price on Request')}</td><td><button class="link enq-open" type="button" data-project="${esc(pr.name)}" data-source="pricing">Get cost sheet ${icon('arrow')}</button></td></tr>`).join('')}
        </tbody></table></div>
        <p class="source-note">Prices are shown only where published by the developer; otherwise "Price on Request". Final pricing depends on unit, floor and applicable charges as per the official cost sheet.</p>
      </div>
      <!-- 10. Payment plan -->
      <div class="p-section" id="payment">
        <span class="eyebrow">Payment Plan</span><h2>Flexible payment options</h2>
        ${pr.paymentPlan && pr.paymentPlan !== 'Not Mentioned' ? `<div class="prose"><p>${esc(pr.paymentPlan)}</p></div>` : `<div class="prose"><p>The developer has not published a payment schedule for this project on its website. Share your details and an advisor will walk you through the officially available payment plans and current offers, if any.</p></div><div><button class="btn btn-ink enq-open" type="button" data-project="${esc(pr.name)}" data-source="payment">Ask about payment plans</button></div>`}
      </div>
      <!-- 11. Floor plans -->
      <div class="p-section" id="floor-plans">
        <span class="eyebrow">Floor Plans</span><h2>Layouts</h2>
        ${plansKnown ? `<div class="tabs" role="tablist" data-tabs="plans">${pr.floorPlans.map((fp, i) => `<button class="tab" role="tab" aria-selected="${i === 0}" data-tab="plan-${i}">${esc(fp.label)}</button>`).join('')}</div>
        <div data-lightbox>${pr.floorPlans.map((fp, i) => `<div class="plan${i === 0 ? ' active' : ''}" data-panel="plan-${i}" data-scope="plans"><div class="img"><img src="${fp.src}" alt="${esc(fp.label)} floor plan, ${esc(pr.name)}" loading="lazy" data-src="${fp.src}" data-cap="${esc(fp.label)}"><span class="zoom">Zoom</span></div><div class="facts"><span><b>${esc(fp.label)}</b></span>${fp.size ? `<span>${esc(fp.size)}</span>` : ''}</div></div>`).join('')}</div>` : `<div class="prose"><p>Approved floor plans for ${esc(pr.name)} are shared with the brochure. Request it to receive unit layouts for every configuration.</p></div>`}
        <div><button class="btn btn-outline enq-open" type="button" data-type="Brochure" data-project="${esc(pr.name)}" data-source="floor-plans">Request floor plans &amp; brochure</button></div>
      </div>
      <!-- 12. Location -->
      <div class="p-section" id="location">
        <span class="eyebrow">Location &amp; Connectivity</span><h2>${esc(pr.location)}</h2>
        <div class="map"><iframe title="Map of ${esc(pr.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${esc(pr.mapEmbed)}"></iframe></div>
        <p class="prose">${esc(pr.address)}${pr.mapsUrl ? ` · <a class="link" href="${esc(pr.mapsUrl)}" target="_blank" rel="noopener">Open in Google Maps ${icon('arrow')}</a>` : ''}</p>
        ${pr.connectivity && pr.connectivity.length ? `<ul class="conn">${pr.connectivity.map(c => `<li><b>${esc(c.name)}</b><span>${esc(c.note || '')}</span></li>`).join('')}</ul>` : `<p class="source-note">Distances and travel times are not published by the developer and are therefore not stated here.</p>`}
      </div>
      <!-- 13. Gallery -->
      <div class="p-section" id="gallery">
        <span class="eyebrow">Gallery</span><h2>A closer look</h2>
        <div class="gallery-grid" data-lightbox>${pr.images.map(im => `<button type="button" data-src="${im.src}" data-cap="${esc(im.alt)}" aria-label="Open ${esc(im.alt)}"><img src="${im.src}" alt="${esc(im.alt)}" loading="lazy" width="800" height="600"></button>`).join('')}</div>
        <p class="source-note">Images are the developer's published renders and photographs; artist's impressions are indicative.</p>
      </div>
      <!-- 14. About Assetz -->
      <div class="p-section" id="developer">
        <span class="eyebrow">About the Developer</span>
        <div class="dev-card"><img src="/assets/img/assetz-logo-white.svg" alt="Assetz"><p>${esc(company.profile)}</p></div>
      </div>
      <!-- 15. FAQs -->
      <div class="p-section" id="faqs">
        <span class="eyebrow">Project FAQs</span><h2>Questions about ${esc(pr.name)}</h2>
        <div class="faq-list">${pr.faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}<span class="plus"></span></summary><div class="answer"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
      </div>
      <!-- 16. Related -->
      <div class="p-section" id="related">
        <span class="eyebrow">Related Projects</span><h2>You may also like</h2>
        <div class="related">${others.map(o => `<a href="/projects/${o.slug}/"><div class="img"><img src="${o.cover}" alt="${esc(o.name)}" loading="lazy" width="800" height="600"></div><b>${esc(o.name)}</b><span>${esc(o.locationShort)} · ${esc(o.configurations.join(' & '))} ${esc(o.propertyType)}</span></a>`).join('')}</div>
      </div>
    </div>
    <!-- Sticky sidebar -->
    <aside class="p-side">
      <div class="form-card"><h3>Enquire about ${esc(pr.name)}</h3>${leadForm({ id: 'side-form', type: 'Enquiry', projects, project: pr, compact: true, button: 'Request a Call Back', purpose: false })}</div>
      <div class="mini"><a href="tel:${site.contact.phoneHref}">${icon('phone')} ${esc(site.contact.phone)}</a><a href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hi, I am interested in ' + pr.name)}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp us</a><button class="enq-open" type="button" data-type="Site Visit" data-project="${esc(pr.name)}" data-source="sidebar" style="display:flex;align-items:center;gap:.6rem">${icon('pin')} Book a site visit</button></div>
    </aside>
  </div>
</section>

<!-- 17. Final CTA -->
<section class="band dark">
  <div class="container final-cta reveal"><span class="eyebrow" style="color:var(--bronze-2)">${esc(pr.name)}</span><h2>Your Next Chapter Begins Here.</h2><p class="lede">Request the brochure or book a visit, and let us show you ${esc(pr.name)} in person.</p><div class="btns"><button class="btn btn-bronze enq-open" type="button" data-type="Brochure" data-project="${esc(pr.name)}" data-source="final">Request Brochure</button><button class="btn btn-outline enq-open" type="button" data-type="Site Visit" data-project="${esc(pr.name)}" data-source="final">Book a Site Visit</button></div></div>
</section>

<div class="sticky-bar" aria-label="Quick actions"><a href="tel:${site.contact.phoneHref}">${icon('phone')}Call</a><a href="https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent('Hi, I am interested in ' + pr.name)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a><button class="enq-open enq" type="button" data-project="${esc(pr.name)}" data-source="sticky">${icon('mail')}Enquire</button></div>`;
}
module.exports = { meta, render };
