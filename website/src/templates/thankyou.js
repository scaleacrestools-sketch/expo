const { esc, icon } = require('./helpers');

const meta = () => ({ title: 'Thank You | Assetz', description: 'Your enquiry has been received. An Assetz advisor will be in touch shortly.', noindex: true, solidHeader: true });

function render({ projects, site }) {
  return `<section class="band thanks" id="thanks" style="padding-top:calc(var(--header-h) + 3rem)">
  <div class="container"><div class="box">
    <span class="check">${icon('check')}</span>
    <span class="eyebrow">Thank you</span>
    <h1 style="font-size:clamp(2.2rem,4.5vw,3.6rem)">We have received your enquiry.</h1>
    <p class="lede" id="ty-msg">An Assetz advisor will contact you within one working day at the number and email you shared.</p>
    <a class="btn btn-bronze" id="ty-download" href="/assets/downloads/bengaluru-premium-homebuyers-guide.pdf" hidden download>Open the Homebuyer's Guide (PDF)</a>
    <div style="display:flex;gap:.7rem;flex-wrap:wrap;justify-content:center"><a class="btn btn-ink" href="/projects/">Explore Projects</a><a class="btn btn-outline" href="/">Back to Home</a></div>
    <p style="font-size:.85rem;color:var(--text-3)">Need something sooner? Call <a href="tel:${site.contact.phoneHref}" style="text-decoration:underline">${esc(site.contact.phone)}</a> or <a href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener" style="text-decoration:underline">message us on WhatsApp</a>.</p>
  </div></div>
</section>
<section class="band ivory2"><div class="container"><div class="section-head"><span class="eyebrow">While you wait</span><h2>Explore the collection.</h2></div><div class="related" style="grid-template-columns:repeat(5,1fr)">${projects.map(o => `<a href="/projects/${o.slug}/"><div class="img"><img src="${o.cover}" alt="${esc(o.name)}" loading="lazy" width="800" height="600"></div><b>${esc(o.name)}</b><span>${esc(o.locationShort)}</span></a>`).join('')}</div></div></section>`;
}
module.exports = { meta, render };
