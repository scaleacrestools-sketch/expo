const { esc } = require('./helpers');

const meta = ({ site, faqs }) => ({
  title: 'FAQs | Assetz Property Group',
  description: 'Helpful answers to common questions about Assetz projects, buying a home in Bengaluru, brochures, site visits, RERA and NRI enquiries.',
  jsonLd: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answerHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() } })) }],
});

function render({ faqs, projects }) {
  const cats = [...new Set(faqs.map(f => f.category))];
  return `
<section class="page-hero">
  <div class="container"><div class="copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>FAQs</span></nav><span class="eyebrow" style="color:var(--bronze-2)">Frequently Asked Questions</span><h1>Everything You Need to Know.</h1><p class="lede">Find helpful answers to common questions about Assetz projects, buying a home and planning a property visit.</p></div></div>
</section>
<section class="band">
  <div class="container faq-split">
    <div class="side reveal">
      <label class="field faq-search">Search questions<input id="faq-search" type="search" placeholder="e.g. brochure, RERA, NRI"></label>
      <div class="tabs" role="tablist" data-tabs="faq" style="flex-direction:column;align-items:flex-start"><button class="tab" role="tab" aria-selected="true" data-tab="all">All questions</button>${cats.map(c => `<button class="tab" role="tab" aria-selected="false" data-tab="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="form-card" style="padding:1.4rem"><b style="font-family:var(--font-display);font-size:1.3rem;font-weight:500">Still have a question?</b><p style="font-size:.88rem;color:var(--stone)">Our advisors answer project-specific questions and can arrange a site visit.</p><button class="btn btn-ink enq-open" type="button" data-source="faqs" style="width:100%">Ask an advisor</button></div>
    </div>
    <div class="reveal">
      ${cats.map(c => `<div data-panel="${esc(c)}" data-scope="faq" data-filterable class="active" style="margin-bottom:2.5rem"><span class="eyebrow">${esc(c)}</span><div class="faq-list" style="margin-top:.6rem">${faqs.filter(f => f.category === c).map(f => `<details><summary>${esc(f.question)}<span class="plus"></span></summary><div class="answer">${f.answerHtml}</div></details>`).join('')}</div></div>`).join('')}
      <div data-panel="Project FAQs" data-scope="faq" data-filterable class="active"><span class="eyebrow">Project-specific questions</span><p class="lede" style="margin:.6rem 0 1rem;font-size:.95rem">Each project page carries its own FAQs with verified facts.</p><div class="related">${projects.map(o => `<a href="/projects/${o.slug}/#faqs"><div class="img"><img src="${o.cover}" alt="${esc(o.name)}" loading="lazy" width="800" height="600"></div><b>${esc(o.name)} FAQs</b><span>${esc(o.locationShort)}</span></a>`).join('')}</div></div>
    </div>
  </div>
</section>`;
}
module.exports = { meta, render };
