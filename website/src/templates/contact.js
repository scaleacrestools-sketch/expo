const { esc, icon } = require('./helpers');
const { leadForm } = require('./layout');

const meta = ({ site }) => ({
  title: 'Contact Us | Assetz Property Group',
  description: 'Connect with the Assetz team for project information, brochures and site visits across Bengaluru. Call, email or send your enquiry online.',
  jsonLd: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact Assetz', url: site.baseUrl + '/contact-us/' }],
});

function render({ site, projects }) {
  const c = site.contact;
  const img = projects.find(p => p.slug === 'assetz-muse-and-maison') || projects[0];
  return `
<section class="page-hero has-img">
  <div class="bg parallax"><img fetchpriority="high" src="${img.images[2] ? img.images[2].src : img.cover}" alt="" width="1920" height="1080"></div>
  <div class="container"><div class="copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>Contact Us</span></nav><span class="eyebrow" style="color:var(--brand-light)">Contact</span><h1>Every Great Journey Begins with a Conversation.</h1><p class="lede">Whether you are exploring your next home, comparing developments or planning a site visit, connect with our team for more information.</p></div></div>
</section>
<section class="band">
  <div class="container contact">
    <div class="info reveal">
      <span class="eyebrow">Get in touch</span>
      <h2>We are here to help.</h2>
      <div class="block"><small>Corporate office</small><b>${esc(c.address)}</b><a class="link" href="${esc(c.mapsUrl)}" target="_blank" rel="noopener">Open in Google Maps ${icon('arrow')}</a></div>
      <div class="block"><small>Project enquiries</small><a href="tel:${c.phoneHref}"><b>${esc(c.phone)}</b></a></div>
      <div class="block"><small>Email</small><a href="mailto:${c.email}"><b>${esc(c.email)}</b></a></div>
      <div class="block"><small>Business hours</small><b>${esc(c.hours)}</b></div>
      <div class="block"><small>WhatsApp</small><a href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Hi Assetz, I would like to know more about your projects.')}" target="_blank" rel="noopener"><b>Message us on WhatsApp</b></a></div>
      <div class="map-card">${icon('pin')}<b>Corporate Office</b><p>${esc(c.address)}</p><a class="btn btn-primary" href="${esc(c.mapsUrl)}" target="_blank" rel="noopener">Get Directions</a></div>
      <p class="source-note">Contact details as published on the developer's official website (${esc(c.source)}).</p>
    </div>
    <div class="form-card reveal"><span class="eyebrow">Send Your Enquiry</span><h3>Tell us what you are looking for</h3>${leadForm({ id: 'contact-form', type: 'Contact', projects, button: 'Send Your Enquiry', message: true, nri: true, time: true })}</div>
  </div>
</section>`;
}
module.exports = { meta, render };
