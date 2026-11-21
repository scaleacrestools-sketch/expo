#!/usr/bin/env node
/* Static site generator: data/*.json + src/templates → dist/ (clean URLs: /route/index.html) */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));

const site = read('site.json');
const projects = read('projects.json');
const company = read('company.json');
const blogs = read('blogs.json');
const faqs = read('faqs.json');
const guide = read('guide.json');
const about = read('about.json');
const buildId = Date.now().toString(36);

const T = {
  layout: require('./src/templates/layout'),
  home: require('./src/templates/home'),
  projects: require('./src/templates/projects'),
  project: require('./src/templates/project'),
  about: require('./src/templates/about'),
  contact: require('./src/templates/contact'),
  blogs: require('./src/templates/blogs'),
  blog: require('./src/templates/blog'),
  faqs: require('./src/templates/faqs'),
  legal: require('./src/templates/legal'),
  thankyou: require('./src/templates/thankyou'),
};

const ctx = { site, projects, company, blogs, faqs, guide, about, buildId };

function write(route, html) {
  const dir = path.join(DIST, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
function page(route, meta, body) {
  const p = Object.assign({ path: route, buildId }, meta);
  const html = T.layout.head({ site, page: p }) + T.layout.header({ site, page: p, projects }) + body + T.layout.footer({ site, projects, buildId });
  write(route, html);
  return p;
}

// Clean + copy static assets
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets/js'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'src/css/styles.css'), path.join(DIST, 'assets/css/styles.css'));
fs.copyFileSync(path.join(ROOT, 'src/js/main.js'), path.join(DIST, 'assets/js/main.js'));

const pages = [];
pages.push(page('/', T.home.meta(ctx), T.home.render(ctx)));
pages.push(page('/projects/', T.projects.meta(ctx), T.projects.render(ctx)));
for (const pr of projects) pages.push(page(`/projects/${pr.slug}/`, T.project.meta(ctx, pr), T.project.render(ctx, pr)));
pages.push(page('/about-us/', T.about.meta(ctx), T.about.render(ctx)));
pages.push(page('/contact-us/', T.contact.meta(ctx), T.contact.render(ctx)));
pages.push(page('/blogs/', T.blogs.meta(ctx), T.blogs.render(ctx)));
for (const b of blogs) pages.push(page(`/blogs/${b.slug}/`, T.blog.meta(ctx, b), T.blog.render(ctx, b)));
pages.push(page('/faqs/', T.faqs.meta(ctx), T.faqs.render(ctx)));
for (const key of ['privacy-policy', 'terms-and-conditions', 'disclaimer']) pages.push(page(`/${key}/`, T.legal.meta(ctx, key), T.legal.render(ctx, key)));
pages.push(page('/thank-you/', T.thankyou.meta(ctx), T.thankyou.render(ctx)));

// 404
write('/404/', T.layout.head({ site, page: { path: '/404/', title: 'Page not found | Assetz', description: 'The page you were looking for does not exist.', noindex: true, buildId, solidHeader: true } }) + T.layout.header({ site, page: { path: '/404/', solidHeader: true }, projects }) + `<section class="band thanks" style="padding-top:calc(var(--header-h) + 4rem)"><div class="container"><div class="box"><span class="eyebrow">404</span><h1>We could not find that page.</h1><p class="lede">It may have moved. Explore our projects or return home.</p><div style="display:flex;gap:.7rem;flex-wrap:wrap;justify-content:center"><a class="btn btn-ink" href="/">Go to homepage</a><a class="btn btn-outline" href="/projects/">Explore projects</a></div></div></div></section>` + T.layout.footer({ site, projects, buildId }));
fs.copyFileSync(path.join(DIST, '404/index.html'), path.join(DIST, '404.html'));

// sitemap + robots
const base = site.baseUrl.replace(/\/$/, '');
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` + pages.filter(p => !p.noindex).map(p => `  <url><loc>${base}${p.path}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>${p.path === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${p.path === '/' ? '1.0' : p.path.startsWith('/projects/') ? '0.9' : '0.6'}</priority></url>`).join('\n') + `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sm);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thank-you/\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`);

// Hosting config: clean URLs + API function (Vercel / Netlify)
fs.writeFileSync(path.join(DIST, '_redirects'), `/api/lead  /.netlify/functions/lead  200\n/*  /404.html  404\n`);
console.log(`Built ${pages.length + 1} pages → dist/ (build ${buildId})`);
