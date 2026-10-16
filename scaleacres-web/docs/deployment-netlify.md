# Local preview, Netlify staging and rollback

> The live WordPress site stays in production until SEO sign-off. Nothing in this guide touches scaleacres.com DNS, hosting or WordPress.


## 0. Recommended: connect the GitHub branch once (auto-updating staging)

This builds the **full** site, including the contact form API and host-based noindex, and rebuilds on every push to the branch.

1. Netlify → **Add new project → Import an existing project → GitHub**, then pick `scaleacrestools-sketch/expo`.
2. **Branch to deploy:** `claude/funny-pascal-2vnisf`. **Base directory:** `scaleacres-web`. Leave the build command (`npm run build`) and publish directory (`.next`) as read from `netlify.toml`.
3. Do **not** add a custom domain. The `*.netlify.app` address is automatically noindex, because only scaleacres.com is listed in `PRODUCTION_HOSTS`.
4. Click **Deploy**. Every later push to the branch updates the same staging URL.

Quick alternative: drag the unzipped `scaleacres-static-preview` folder onto https://app.netlify.com/drop. That is a visual review only, and the contact form shows a "preview build" message.

## 1. Local preview

```bash
unzip scaleacres-web.zip && cd scaleacres-web
npm install                 # Node 20.9+ (22 recommended)
cp .env.example .env.local  # optional: contact delivery, GA4
npm run dev                 # http://localhost:3000 (hot reload)
# production-like:
npm run build && npm start
```

Local hosts are never indexable, so `robots.txt` disallows everything and every response carries `X-Robots-Tag: noindex`.

## 2. Netlify staging preview

**Option A — Git (recommended).**
1. Push this folder to a GitHub repository, or use the existing repo with *Base directory* = `scaleacres-web`.
2. In Netlify, go to **Add new site → Import an existing project**, pick the repo, and set *Base directory* to `scaleacres-web`. The build command and publish directory come from `netlify.toml` (`npm run build`, `.next`). Netlify detects Next.js and applies its runtime automatically.
3. Under **Site configuration → Environment variables**, add:
   - `PRODUCTION_HOSTS` = `scaleacres.com,www.scaleacres.com` (the default). Leave it unchanged. Because the staging host is not listed, staging is noindex.
   - Leave `WORDPRESS_ORIGIN` **unset** so the redesigned pages render for review.
   - Optional: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` or `CONTACT_WEBHOOK_URL` to test real form delivery. Without them the form honestly reports that it isn't connected.
4. Deploy. You get a temporary `https://<name>.netlify.app` URL.
5. Optional extra protection: **Site configuration → Access & security → Visitor access → Password protection**. This is available on paid plans.

**Option B — CLI.**
```bash
npm i -g netlify-cli
netlify login
netlify init            # create a new site, base dir = this folder
netlify deploy --build  # draft URL; add --prod only for the staging site's own main URL
```

**Do not** add a custom domain to the staging site.

**Verify the staging protection:**
```bash
curl -sI https://<name>.netlify.app/ | grep -i x-robots-tag   # → noindex, nofollow
curl -s  https://<name>.netlify.app/robots.txt                # → Disallow: /
```

## 3. Proxy-mode staging (SEO parity run)

To check what production will actually serve, create a second staging site (or a branch deploy) with `WORDPRESS_ORIGIN=https://<wordpress-origin-host>` set **at build time**. Then:

```bash
CANDIDATE_URL=https://<proxy-staging>.netlify.app npm run seo:candidate && npm run seo:compare
```

The WordPress origin must answer on its own hostname without redirecting to scaleacres.com. WordPress' `redirect_canonical` and the `home`/`siteurl` options will otherwise send a 301 that the browser follows. Ask the hosting team to either:
- keep `home`/`siteurl` = `https://scaleacres.com`, and add a small mu-plugin that disables `redirect_canonical` when `$_SERVER['HTTP_HOST']` is the origin host; or
- run the origin behind the same hostname through the CDN with path-based routing.

Test with `curl -sI https://<origin>/about-us/`. It must return `200`, not `301`.

## 4. Production cut-over (only after written approval)

1. Final `seo:compare` against the proxy-mode staging site with zero **FAILED** rows, and every **REVIEW REQUIRED** row signed off.
2. Lower the DNS TTL for scaleacres.com to 300 s, 24 h ahead.
3. Point the domain at the Netlify production site, which is built with `WORDPRESS_ORIGIN` set.
4. Immediately check:
   - the homepage and five protected URLs return 200 with the expected titles;
   - `robots.txt` allows crawling;
   - there is no `x-robots-tag` header on scaleacres.com;
   - forms, analytics and conversion tags fire.
5. Submit `/sitemap.xml` and `/sitemap_index.xml` in Search Console. Use URL Inspection on the homepage and run a live test.
6. Monitor Search Console coverage, rankings for the top queries, and 404s daily for two weeks, then weekly for eight weeks.

## 5. Rollback plan

| Trigger | Action | Time |
|---|---|---|
| Any protected URL returns non-200, wrong title or noindex | Revert DNS to the WordPress host (keep the old record values written down before cut-over) | minutes; TTL 300 s |
| Problem limited to one page | Set that page to `serveFrom: "wordpress"` in `content/seo/pages.ts` and redeploy | ~5 min build |
| Problem in a new deploy | Netlify → Deploys → pick the previous deploy → **Publish deploy** | instant |
| Ranking drop on specific URLs over 2–4 weeks | Compare against the baseline crawl, restore the missing content or headings, and request re-indexing | as needed |

Keep the WordPress installation, database and hosting unchanged and paid up for at least 90 days after cut-over.
