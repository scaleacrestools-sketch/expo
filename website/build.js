#!/usr/bin/env node
/* Static site generator: data/*.json + src/templates → dist/ (clean URLs: /route/index.html) */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));

const site = read('site.json');
// Production URL for canonical tags, Open Graph and the sitemap. Netlify sets URL automatically on Git/CLI builds;
// otherwise pass SITE_URL (e.g. SITE_URL=https://www.yourdomain.com node build.js). Placeholder domains are ignored,
// so a build without a known domain emits no absolute URLs (and no sitemap) rather than wrong ones.
site.baseUrl = (process.env.SITE_URL || process.env.URL || (/example\.com/.test(site.baseUrl) ? '' : site.baseUrl)).replace(/\/$/, '');
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

// Optional minifier: esbuild (devDependency). The build still works without it (files are copied as-is).
let esbuild = null; try { esbuild = require('esbuild'); } catch (e) { /* not installed: skip minification */ }

// HTML post-processing: responsive srcset for images that have an -800.webp variant, lazy/async decoding.
function optimizeHtml(html) {
  return html.replace(/<img\b([^>]*?)>/g, (tag, attrs) => {
    const src = (attrs.match(/\ssrc="([^"]+)"/) || [])[1] || '';
    let a = attrs;
    if (/\.webp$/.test(src) && !/srcset=/.test(a) && fs.existsSync(path.join(ROOT, src.replace(/\.webp$/, '-800.webp')))) {
      const w = parseInt((a.match(/\swidth="(\d+)"/) || [])[1] || '0', 10);
      const sizes = w && w <= 420 ? `${w}px` : '100vw';
      a += ` srcset="${src.replace(/\.webp$/, '-800.webp')} 800w, ${src} 1920w" sizes="${sizes}"`;
    }
    if (!/\sloading=/.test(a) && !/fetchpriority=/.test(a) && !/\.svg$/.test(src)) a += ' loading="lazy"';
    if (!/decoding=/.test(a)) a += ' decoding="async"';
    return `<img${a}>`;
  });
}

function write(route, html) {
  const dir = path.join(DIST, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), optimizeHtml(html));
}
function page(route, meta, body) {
  const p = Object.assign({ path: route, buildId }, meta);
  const html = T.layout.head({ site, page: p }) + T.layout.header({ site, page: p, projects }) + body + T.layout.footer({ site, projects, buildId, page: p });
  write(route, html);
  return p;
}

// Clean + copy static assets
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets/js'), { recursive: true });
{
  const css = fs.readFileSync(path.join(ROOT, 'src/css/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'src/css/styles.css'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'src/js/main.js'), 'utf8');
  fs.writeFileSync(path.join(DIST, 'assets/css/styles.css'), esbuild ? esbuild.transformSync(css, { loader: 'css', minify: true, target: ['chrome90', 'safari14', 'firefox90'] }).code : css);
  fs.writeFileSync(path.join(DIST, 'assets/js/main.js'), esbuild ? esbuild.transformSync(js, { loader: 'js', minify: true, target: ['es2019'] }).code : js);
  if (!esbuild) console.log('(esbuild not installed: CSS/JS copied unminified — run `npm install` to enable minification)');
}

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

// Netlify Forms detection page (static form with every lead field). The browser falls back to it when the
// serverless lead API is not deployed (e.g. drag-and-drop deploys) or has no CRM configured.
const NF = ['type', 'sourcePage', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'name', 'countryCode', 'phone', 'email', 'project', 'purpose', 'preferredTime', 'category', 'message', 'consent', 'submittedAt'];
fs.mkdirSync(path.join(DIST, 'forms'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'forms/lead.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Lead form</title></head><body><!-- assetz-form-detection-page -->
<form name="lead" method="POST" data-netlify="true" netlify-honeypot="website" hidden>
<input type="hidden" name="form-name" value="lead"><input name="website">
${NF.map(n => n === 'message' ? `<textarea name="message"></textarea>` : `<input name="${n}">`).join('\n')}
</form></body></html>`);

// sitemap + robots (sitemap requires absolute URLs, so it is written only when the production URL is known)
const base = site.baseUrl;
if (base) {
  const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` + pages.filter(p => !p.noindex).map(p => `  <url><loc>${base}${p.path}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>${p.path === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${p.path === '/' ? '1.0' : p.path.startsWith('/projects/') ? '0.9' : '0.6'}</priority></url>`).join('\n') + `\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sm);
}
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thank-you/\nDisallow: /api/\nDisallow: /forms/\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`);
fs.writeFileSync(path.join(DIST, 'routes.txt'), pages.map(p => p.path).join('\n') + '\n'); // route list used by the QA scripts
if (!base) console.log('Note: no SITE_URL/URL set — canonical URLs and sitemap.xml omitted. Rebuild with SITE_URL=https://your-domain for production SEO.');

// Hosting config: clean URLs + API function (Vercel / Netlify)
fs.writeFileSync(path.join(DIST, '_redirects'), `/api/lead  /.netlify/functions/lead  200\n/*  /404.html  404\n`);
fs.writeFileSync(path.join(DIST, '_headers'), `/assets/*\n  Cache-Control: public, max-age=604800\n/assets/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/assets/css/*\n  Cache-Control: public, max-age=31536000, immutable\n/assets/js/*\n  Cache-Control: public, max-age=31536000, immutable\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n`);
console.log(`Built ${pages.length + 1} pages → dist/ (build ${buildId})`);
