const { esc, icon, fmtDate } = require('./helpers');

const meta = ({ site }) => ({
  title: 'The Assetz Journal | Blogs',
  description: 'Ideas, perspectives and useful guidance for making informed property and lifestyle decisions in Bengaluru, from the Assetz Journal.',
  jsonLd: [{ '@context': 'https://schema.org', '@type': 'Blog', name: 'The Assetz Journal', url: site.baseUrl + '/blogs/' }],
});

const CATEGORIES = ['Homebuying Guides', 'Bengaluru Real Estate', 'Architecture & Design', 'Sustainable Living', 'Lifestyle'];

function blogImage(projects, i) {
  const order = ['assetz-mizumi-reserve', 'assetz-trees-and-tandem', 'assetz-muse-and-maison', 'assetz-mizu-and-ki', 'assetz-trees-and-tandem', 'assetz-naru-and-nami'];
  const p = projects.find(x => x.slug === order[i % order.length]) || projects[0];
  return p.images[(i + 1) % p.images.length] || p.images[0];
}

function render({ blogs, projects }) {
  const featured = blogs.find(b => b.featured) || blogs[0];
  const rest = blogs.filter(b => b !== featured);
  return `
<section class="page-hero">
  <div class="container"><div class="copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>Blogs</span></nav><span class="eyebrow" style="color:var(--brand-light)">The Assetz Journal</span><h1>The Art of Better Living.</h1><p class="lede">Ideas, perspectives and useful guidance for making informed property and lifestyle decisions.</p></div></div>
</section>
<section class="band">
  <div class="container">
    <div class="cat-tabs" role="tablist" data-tabs="blog"><button class="tab" role="tab" aria-selected="true" data-tab="all">All</button>${CATEGORIES.map(c => `<button class="tab" role="tab" aria-selected="false" data-tab="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <div class="posts">
      <a class="post featured reveal" href="/blogs/${featured.slug}/" data-panel="${esc(featured.category)}" data-scope="blog" data-filterable><div class="img"><img src="${blogImage(projects, 0).src}" alt="${esc(blogImage(projects, 0).alt)}" width="1200" height="750"></div><div><span class="cat">Featured · ${esc(featured.category)}</span><h3>${esc(featured.title)}</h3><p>${esc(featured.excerpt)}</p><span class="date">${fmtDate(featured.date)} · ${featured.readMinutes} min read</span><div style="margin-top:.8rem"><span class="link">Read Article ${icon('arrow')}</span></div></div></a>
      ${rest.map((b, i) => `<a class="post reveal" href="/blogs/${b.slug}/" data-panel="${esc(b.category)}" data-scope="blog" data-filterable><div class="img"><img src="${blogImage(projects, i + 1).src}" alt="${esc(blogImage(projects, i + 1).alt)}" loading="lazy" width="900" height="600"></div><span class="cat">${esc(b.category)}</span><h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p><span class="date">${fmtDate(b.date)} · ${b.readMinutes} min read</span><span class="link">Read Article ${icon('arrow')}</span></a>`).join('')}
    </div>
  </div>
</section>
<section class="band dark"><div class="container final-cta reveal"><span class="eyebrow" style="color:var(--brand-light)">Ready to explore?</span><h2>See how these ideas take shape at Assetz.</h2><div class="btns"><a class="btn btn-bronze" href="/projects/">Explore Projects</a><button class="btn btn-outline enq-open" type="button" data-source="blogs">Talk to an advisor</button></div></div></section>`;
}
module.exports = { meta, render, blogImage, CATEGORIES };
