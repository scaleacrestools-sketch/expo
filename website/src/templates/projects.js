const { esc, icon } = require('./helpers');
const { budgetLabel } = require('./home');

const meta = ({ site }) => ({
  title: 'Projects | Assetz Property Group',
  description: 'Discover five distinctive Assetz developments across Bengaluru: Naru & Nami, Mizumi Reserve, Muse & Maison, Trees & Tandem and Mizu & Ki. Filter by location, configuration, property type, budget and status.',
  image: '/assets/video/assetz-hero-poster.webp',
  jsonLd: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.baseUrl + '/' }, { '@type': 'ListItem', position: 2, name: 'Projects', item: site.baseUrl + '/projects/' }] }],
});

function render({ projects }) {
  const p = projects;
  const uniq = arr => [...new Set(arr)];
  const hero = p.find(x => x.slug === 'assetz-mizumi-reserve') || p[0];
  return `
<section class="page-hero has-img">
  <div class="bg parallax"><img src="${hero.cover}" alt="" width="1920" height="1080"></div>
  <div class="container"><div class="copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>Projects</span></nav><span class="eyebrow" style="color:var(--bronze-2)">Our Projects</span><h1>Explore Homes Designed for Better Living.</h1><p class="lede">Discover five distinctive Assetz developments across Bengaluru, each created around its own vision of contemporary life.</p></div></div>
</section>
<section class="band tight">
  <div class="container">
    <form class="filters" id="filters" aria-label="Filter projects" onsubmit="return false">
      <label class="field">Location<select name="location"><option value="">All</option>${uniq(p.map(x => x.locationShort)).map(l => `<option>${esc(l)}</option>`).join('')}</select></label>
      <label class="field">Configuration<select name="configuration"><option value="">All</option>${uniq(p.flatMap(x => x.configurations)).map(c => `<option>${esc(c)}</option>`).join('')}</select></label>
      <label class="field">Property Type<select name="type"><option value="">All</option>${uniq(p.map(x => x.propertyType)).map(t => `<option>${esc(t)}</option>`).join('')}</select></label>
      <label class="field">Budget<select name="budget"><option value="">All</option>${uniq(p.map(x => x.budget).filter(b => b && b !== 'any')).map(b => `<option value="${esc(b)}">${esc(budgetLabel(b))}</option>`).join('')}</select></label>
      <label class="field">Project Status<select name="status"><option value="">All</option>${uniq(p.map(x => x.status)).map(s => `<option>${esc(s)}</option>`).join('')}</select></label>
      <button class="btn btn-outline" id="clear-filters" type="button">Clear Filters</button>
    </form>
    <div class="results-head"><span id="result-count">${p.length} projects</span><span>Prices and sizes shown only where published by the developer</span></div>
    <div class="cards" id="results">
      ${p.map(pr => `<article class="card" data-location="${esc(pr.locationShort)}" data-type="${esc(pr.propertyType)}" data-configurations="${esc(pr.configurations.join('|'))}" data-budget="${esc(pr.budget || 'any')}" data-status="${esc(pr.status)}">
        <a class="img" href="/projects/${pr.slug}/"><img src="${pr.cover}" alt="${esc(pr.coverAlt || pr.name)}" loading="lazy" width="1200" height="750">${pr.status !== 'Not Mentioned' ? `<span class="status">${esc(pr.status)}</span>` : ''}</a>
        <div class="body">
          <span class="loc">${esc(pr.location)}</span>
          <h3><a href="/projects/${pr.slug}/">${esc(pr.name)}</a></h3>
          <p style="color:var(--stone);font-size:.92rem">${esc(pr.blurb)}</p>
          <div class="facts"><span>Configuration<b>${esc(pr.configurations.join(', '))} ${esc(pr.propertyType)}</b></span><span>Size<b>${esc(pr.sizes || 'Not Mentioned')}</b></span><span>Starting price<b>${esc(pr.startingPrice)}</b></span><span>Status<b>${esc(pr.status)}</b></span></div>
          <div class="ctas"><a class="btn btn-ink" href="/projects/${pr.slug}/">View Details</a><button class="btn btn-outline enq-open" type="button" data-project="${esc(pr.name)}" data-source="projects-list">Enquire Now</button></div>
        </div>
      </article>`).join('')}
    </div>
    <div class="empty" id="empty" hidden><h3>No projects match these filters.</h3><p>Try widening your search. All five developments are listed above, and our advisors can suggest the closest match.</p><div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center"><button class="btn btn-ink" id="empty-clear" type="button">Clear Filters</button><button class="btn btn-outline enq-open" type="button" data-source="projects-empty">Talk to an advisor</button></div></div>
  </div>
</section>`;
}
module.exports = { meta, render };
