const { esc, icon, paras } = require('./helpers');

const meta = ({ site }) => ({
  title: 'About Assetz | Designing Spaces. Enriching Lives.',
  description: 'Discover the philosophy behind Assetz Property Group: thoughtful design, better communities and environments built around the way people live in Bengaluru since 2006.',
  jsonLd: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About Assetz', url: site.baseUrl + '/about-us/' }],
});

function render({ about, company, projects }) {
  const img = (slug, idx) => { const p = projects.find(x => x.slug === slug) || projects[0]; return p.images[idx] || p.images[0]; };
  const stats = company.stats || [];
  return `
<section class="page-hero has-img">
  <div class="bg parallax"><img fetchpriority="high" src="${img('assetz-mizu-and-ki', 0).src}" alt="" width="1920" height="1080"></div>
  <div class="container"><div class="copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>About Us</span></nav><span class="eyebrow" style="color:var(--brand-light)">About Assetz</span><h1>${esc(about.heroHeading)}</h1><p class="lede">Discover the philosophy behind Assetz and its commitment to thoughtful design, better communities and environments built around the way people live.</p></div></div>
</section>

<section class="band">
  <div class="container two-col">
    <div class="media reveal"><img src="${img('assetz-mizumi-reserve', 2).src}" alt="${esc(img('assetz-mizumi-reserve', 2).alt)}" loading="lazy"></div>
    <div class="copy reveal"><span class="eyebrow">The Assetz Story</span><h2>Homes designed around the way people live.</h2>${paras(about.story)}</div>
  </div>
</section>

<section class="band ivory2">
  <div class="container two-col flip">
    <div class="media reveal"><img src="${img('assetz-muse-and-maison', 1).src}" alt="${esc(img('assetz-muse-and-maison', 1).alt)}" loading="lazy"></div>
    <div class="copy reveal"><span class="eyebrow">Design Philosophy</span><h2>Better Design, as a daily practice.</h2>${paras(about.philosophy)}</div>
  </div>
</section>

<section class="band forest">
  <div class="container two-col">
    <div class="media reveal"><img src="${img('assetz-trees-and-tandem', 1).src}" alt="${esc(img('assetz-trees-and-tandem', 1).alt)}" loading="lazy"></div>
    <div class="copy reveal"><span class="eyebrow" style="color:var(--brand-light)">Nature &amp; Sustainability</span><h2>Communities that grow with their landscape.</h2>${paras(about.sustainability).replace(/<p>/g, '<p style="color:rgba(245,242,236,.8)">')}</div>
  </div>
</section>

<section class="band">
  <div class="container two-col flip">
    <div class="media reveal"><img src="${img('assetz-mizu-and-ki', 2).src}" alt="${esc(img('assetz-mizu-and-ki', 2).alt)}" loading="lazy"></div>
    <div class="copy reveal"><span class="eyebrow">Innovation &amp; Future-Ready Living</span><h2>Planning for the decades ahead.</h2>${paras(about.innovation)}</div>
  </div>
</section>

<section class="band dark">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow" style="color:var(--brand-light)">Milestones</span><h2>Verified company milestones</h2><p class="lede">${esc(company.statsIntro || '')}</p></div>
    <div class="stats reveal" style="margin-top:0">${stats.map(s => `<div class="stat"><div class="num" data-count="${s.value}" data-decimals="${s.decimals || 0}" data-suffix="${esc(s.suffix || '')}">0${esc(s.suffix || '')}</div><div class="label">${esc(s.label)}</div><span class="src">${esc(s.note || '')}</span></div>`).join('')}</div>
    ${company.milestones && company.milestones.length ? `<div class="timeline reveal" style="margin-top:3rem">${company.milestones.map(m => `<div><b>${esc(m.year)}</b><span>${esc(m.text)}</span></div>`).join('')}</div>` : ''}
  </div>
</section>

${company.awards && company.awards.length ? `<section class="band">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Awards &amp; Recognition</span><h2>Recognition that followed the work.</h2><p class="lede">As listed on the developer's official website (verified ${esc(company.sourceDate)}).</p></div>
    <div class="awards reveal">${company.awards.map(a => `<div class="award"><small>${esc(a.year)} · ${esc(a.body)}</small><b>${esc(a.title)}</b><span>${esc(a.project || '')}</span></div>`).join('')}</div>
  </div>
</section>` : ''}

<section class="band ivory2">
  <div class="container">
    <div class="section-head split reveal"><div><span class="eyebrow">Featured Projects</span><h2>Five communities across Bengaluru.</h2></div><a class="btn btn-outline" href="/projects/">All Projects</a></div>
    <div class="related reveal" style="grid-template-columns:repeat(5,1fr)">${projects.map(o => `<a href="/projects/${o.slug}/"><div class="img"><img src="${o.cover}" alt="${esc(o.name)}" loading="lazy" width="800" height="600"></div><b>${esc(o.name)}</b><span>${esc(o.locationShort)} · ${esc(o.configurations.join(' & '))}</span></a>`).join('')}</div>
  </div>
</section>

<section class="band dark">
  <div class="container final-cta reveal"><span class="eyebrow" style="color:var(--brand-light)">Let's Talk</span><h2>${esc(about.closingCta)}</h2><div class="btns"><a class="btn btn-bronze" href="/contact-us/">Contact Us</a><button class="btn btn-outline enq-open" type="button" data-source="about">Enquire Now</button></div></div>
</section>`;
}
module.exports = { meta, render };
