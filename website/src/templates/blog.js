const { esc, icon, fmtDate } = require('./helpers');
const { leadForm } = require('./layout');
const { blogImage } = require('./blogs');

const meta = ({ site, blogs, projects }, b) => {
  const idx = blogs.indexOf(b);
  return {
    title: b.seoTitle + ' | Assetz Journal',
    description: b.metaDescription,
    ogType: 'article',
    image: blogImage(projects, idx).src,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: b.title, description: b.metaDescription, datePublished: b.date, dateModified: b.date, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: site.baseUrl + '/assets/img/assetz-logo.svg' } }, mainEntityOfPage: `${site.baseUrl}/blogs/${b.slug}/`, image: site.baseUrl + blogImage(projects, idx).src, articleSection: b.category },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.baseUrl + '/' }, { '@type': 'ListItem', position: 2, name: 'Blogs', item: site.baseUrl + '/blogs/' }, { '@type': 'ListItem', position: 3, name: b.title, item: `${site.baseUrl}/blogs/${b.slug}/` }] },
    ],
  };
};

function render({ blogs, projects, site }, b) {
  const idx = blogs.indexOf(b); const cover = blogImage(projects, idx);
  const related = b.related.map(s => blogs.find(x => x.slug === s)).filter(Boolean);
  // Internal project links: append a short "explore" block referencing relevant projects
  const links = projects.slice(0, 3);
  const url = `${site.baseUrl}/blogs/${b.slug}/`;
  return `
<section class="page-hero has-img" style="min-height:56vh">
  <div class="bg parallax"><img fetchpriority="high" src="${cover.src}" alt="" width="1920" height="1080"></div>
  <div class="container"><div class="copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span><a href="/blogs/">Blogs</a></span><span>${esc(b.category)}</span></nav><span class="eyebrow" style="color:var(--brand-light)">${esc(b.category)}</span><h1 style="font-size:clamp(2.2rem,4.6vw,4rem)">${esc(b.title)}</h1><div class="meta"><span>${fmtDate(b.date)}</span><span>${b.readMinutes} min read</span><span>By the Assetz editorial team</span></div></div></div>
</section>
<section class="band">
  <div class="container article">
    <article class="body reveal">
      <p style="font-size:1.2rem;color:var(--brand-dark)">${esc(b.excerpt)}</p>
      ${b.bodyHtml}
      <div class="form-card" style="margin-top:2.5rem;background:var(--brand-10);box-shadow:none"><span class="eyebrow">Explore Assetz developments</span><div class="related" style="margin-top:.5rem">${links.map(o => `<a href="/projects/${o.slug}/"><div class="img"><img src="${o.cover}" alt="${esc(o.name)}" loading="lazy" width="800" height="600"></div><b>${esc(o.name)}</b><span>${esc(o.locationShort)} · ${esc(o.configurations.join(' & '))} ${esc(o.propertyType)}</span></a>`).join('')}</div></div>
      <div class="share" style="margin-top:2rem">Share: <a class="link" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" data-share="https://www.linkedin.com/sharing/share-offsite/?url={u}" target="_blank" rel="noopener">LinkedIn</a> <a class="link" href="https://wa.me/?text=${encodeURIComponent(b.title + ' ' + url)}" data-share="https://wa.me/?text=${encodeURIComponent(b.title)}%20{u}" target="_blank" rel="noopener">WhatsApp</a> <a class="link" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" data-share="https://www.facebook.com/sharer/sharer.php?u={u}" target="_blank" rel="noopener">Facebook</a></div>
    </article>
    <aside>
      <div class="form-card"><h3>Speak to an advisor</h3><p style="font-size:.88rem;color:var(--text-3)">Questions about a project or the buying process? We will call you back.</p>${leadForm({ id: 'blog-form', type: 'Enquiry', projects, compact: true, purpose: false, time: false, button: 'Request a Call Back' })}</div>
      <div><span class="eyebrow">Related articles</span><div style="display:grid;gap:1rem;margin-top:1rem">${related.map(r => `<a class="post" href="/blogs/${r.slug}/"><span class="cat">${esc(r.category)}</span><h3 style="font-size:1.25rem">${esc(r.title)}</h3><span class="date">${fmtDate(r.date)}</span></a>`).join('')}</div></div>
    </aside>
  </div>
</section>`;
}
module.exports = { meta, render };
