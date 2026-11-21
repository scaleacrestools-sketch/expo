# Assetz website: Netlify deployment guide

## The files

| File | Purpose |
|---|---|
| `assetz-netlify-ready.zip` | The finished production website. Unzip it and upload the folder. No build step needed. |
| `assetz-website-source.zip` | Full editable source: templates, data, styles, scripts, lead API, build tools |
| `assetz-hero-video-assets.zip` | Hero videos, posters, the FFmpeg edit project, EDLs, source footage and masters |
| `assetz-editable-svg.zip` | Editable vector logos, icons, UI elements and graphics |

---

## 1. Deploy the ready-made site (fastest, about 2 minutes)

1. Unzip `assetz-netlify-ready.zip`. You get a folder named **`assetz-netlify-ready`**. It contains `index.html`, `_redirects`, `_headers`, `assets/`, `projects/` and the other pages.
2. Sign in at <https://app.netlify.com>, open **Sites**, then choose **Add new site → Deploy manually**.
3. Drag the **`assetz-netlify-ready` folder** (the folder itself, not the ZIP and not a parent folder) onto the upload area.
4. Netlify publishes the site on a `*.netlify.app` address within a minute. Rename it under **Site configuration → Change site name**.

**Enable forms before your first test enquiry:**

5. Go to **Site configuration → Forms** and click **Enable form detection**.
6. **Deploys → drag the same folder again.** Netlify registers a form only on a deploy made after detection is switched on.
7. Under **Forms → Form notifications**, add an email notification so every enquiry is emailed to your team.

Without the Netlify CLI or a Git connection, those are the only steps.

### With the Netlify CLI instead of drag-and-drop

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir assetz-netlify-ready
```

### Settings that do not need changing

- **Page refresh and deep links:** every page is a real `folder/index.html` (for example `/projects/assetz-mizumi-reserve/index.html`), so refreshing any URL works. This is a static multi-page site, not a single-page app, so it needs no SPA fallback rewrite.
- **Unknown URLs:** `_redirects` sends them to the branded `404.html` with a real 404 status.
- **Caching and security headers:** set in `_headers`.
- **Fonts:** self-hosted in `assets/fonts/`. There are no Google or other third-party runtime requests, apart from WhatsApp and Google Maps links the visitor clicks.

---

## 2. Enquiry forms: how leads are captured

Every form (homepage guide download, project hero and contact band, header and floating enquiry popup, Request Brochure, Book a Site Visit, Contact Us, blog sidebar) sends the lead in this order:

1. **Serverless lead API** (`/api/lead`, a Netlify Function). It validates the lead server-side and forwards it to your CRM when `CRM_WEBHOOK_URL` is set.
2. **Netlify Forms**, used if the function is not deployed, or if it has no CRM configured. Leads are stored under **Forms → lead** in the Netlify dashboard and can be emailed to you.
3. If neither confirms the lead was stored, the visitor sees *"We could not send your enquiry right now. Please try again, or call +91 92402 62877."* The site never shows a success message for a lead that was not recorded.

| How you deploy | Where leads go |
|---|---|
| Drag-and-drop / CLI of `assetz-netlify-ready` | Netlify Forms (enable form detection, as in steps 5–6 above) |
| Git or CLI build from source, no CRM variables | Function validates; lead stored in Netlify Forms |
| Git or CLI build from source **with** `CRM_WEBHOOK_URL` | Function validates and delivers to the CRM |

Netlify Forms captures: name, mobile with country code, email, project, enquiry type, purpose, preferred time, enquiry category, message, consent, source page and UTM parameters. A hidden honeypot field filters spam.

Netlify's free plan includes a monthly quota of form submissions. Check your plan's limit under **Forms → Usage**.

### Connecting a CRM (optional, needs a source deploy)

Drag-and-drop deploys **cannot** include serverless functions. To forward leads to a CRM, deploy from source (section 3), then add these under **Site configuration → Environment variables**:

| Variable | Required | Purpose |
|---|---|---|
| `CRM_WEBHOOK_URL` | for CRM delivery | HTTPS endpoint that receives each lead as JSON (for example your CRM's inbound webhook) |
| `CRM_API_KEY` | if your CRM needs it | Sent as `Authorization: Bearer …` |
| `CRM_PROVIDER` | optional | `scaletrack` wraps the payload as `{ lead, source }`; otherwise a flat JSON object is sent. Adjust field names in `api/lead-core.js` → `toCrm()` to match your CRM. |
| `ALLOWED_ORIGINS` | optional | Comma-separated origins allowed to post, e.g. `https://www.yourdomain.com` |
| `RATE_LIMIT_MAX` | optional | Submissions per IP per 10 minutes (default 8) |
| `IP_SALT` | optional | Any random string, used to hash visitor IPs in logs |
| `SITE_URL` | recommended | Your production URL. It sets canonical tags and generates `sitemap.xml` (see section 4). |

**No CRM credentials were provided, so CRM delivery is not active yet.** Until `CRM_WEBHOOK_URL` is set, leads go to Netlify Forms. Never put API keys in the website files; only in Netlify environment variables.

Brochure and guide downloads (the Homebuyer's Guide PDF and the Muse & Maison e-brochure) are shown on the thank-you page only after a successful submission.

---

## 3. Deploy from source (Git or CLI build)

1. Unzip `assetz-website-source.zip` and push the `assetz-website-source` folder to a GitHub, GitLab or Bitbucket repository.
2. In Netlify: **Add new site → Import an existing project**, then pick the repository.
3. Netlify reads `netlify.toml`:
   - Build command: `npm install --no-audit --no-fund && node build.js`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Add the environment variables from section 2, then deploy.

Node 18 or newer is required. The only dependency is `esbuild`, which minifies CSS and JS; without it the build still works but files are left unminified.

**Build locally:**

```bash
npm install
SITE_URL=https://www.yourdomain.com node build.js
node server.js
```

The site is then at <http://localhost:4173>, with a working lead API that stores leads in `leads/leads.jsonl`.

To rebuild the ready-to-upload ZIPs:

```bash
npm run package
```

They are written to `../deliverables/`.

---

## 4. SEO: set your domain

The delivered `assetz-netlify-ready` build does **not** know your final domain. Rather than publish placeholder URLs, it omits the canonical tags and `sitemap.xml`. Every page still has its unique title, description, Open Graph tags, structured data (JSON-LD) and `robots.txt`.

Once the domain is decided, use either option below.

**Option A: Git deploy.** Netlify passes the site URL (`URL`) to the build automatically. To use a custom domain instead, set `SITE_URL` in the environment variables.

**Option B: rebuild the upload folder on your computer** (from the source folder):

```bash
SITE_URL=https://www.yourdomain.com npm run package
```

Then drag the new `assetz-netlify-ready` folder to Netlify again. Submit `https://www.yourdomain.com/sitemap.xml` in Google Search Console.

Also review `data/site.json`:
- `tracking.gtmId`: Google Tag Manager ID. It loads GTM, which then loads GA4 and the Meta Pixel.
- `contact`, `social`: phone, email, address, social links.

---

## 5. Update website content

All text and facts live in `data/*.json`. Edit, run `node build.js`, and deploy `dist/`.

| File | Contents |
|---|---|
| `data/projects.json` | Every project: name, location, configurations, sizes, prices (`"Price on Request"` when not published), RERA, status, overview, highlights, amenities, connectivity, FAQs, image lists, floor plans. Each project keeps its `sourceUrl` and `conflicts` notes. |
| `data/company.json` | Company statistics, milestones, awards |
| `data/blogs.json` | Blog articles (`bodyHtml`) |
| `data/faqs.json` | Site-wide FAQs |
| `data/site.json` | Contact details, navigation, social links, legal notices, tracking IDs |
| `data/about.json`, `data/guide.json` | About page copy; Homebuyer's Guide PDF content (`npm run guide` regenerates the PDF) |

- **Images:** put WebP files in `assets/img/projects/<project-slug>/` and reference them in `projects.json`. For faster phones, also add an 800 px wide copy named `<name>-800.webp`; the build then adds responsive `srcset` automatically. The original JPEGs are kept in `source-assets/original-images/`.
- **Design:** colours are CSS variables at the top of `src/css/styles.css` (`--brand #AA7761`, `--brand-dark #2C191F`, `--brand-light #D4A48C`). Templates are in `src/templates/`; client behaviour is in `src/js/main.js`.
- **Adding a project:** add an object to `projects.json`, with images in `assets/img/projects/<slug>/` and a location map at `assets/img/maps/<slug>.webp`. The project page, listing card, menus, footer and comparison table are generated automatically.

---

## 6. Replace the hero video

1. Export new files with exactly these names, following the specs in the video package README:
   - `assetz-hero-desktop.mp4`: 1920×1080, H.264, no audio, under 6 MB, faststart
   - `assetz-hero-mobile.mp4`: 1080×1920
   - `assetz-hero-poster.webp` and `assetz-hero-mobile-poster.webp`: first frames
2. **Ready-made site:** replace the files in `assetz-netlify-ready/assets/video/` and redeploy the folder. Also delete the two `.webm` files there, or replace them with WebM versions of the new video; browsers that support WebM play it first.
   **Source:** replace them in `assets/video/`, run `node build.js`, and deploy.
3. To re-cut the existing film (different shots, grade or length), edit and run `edit-project/build-hero.sh` from `assetz-hero-video-assets.zip`.

Visitors who have the old video cached may see it for up to 7 days. To show the change immediately, use new file names and update them in `src/templates/home.js`.

---

## 7. Edit the SVG graphics

Open any file from `assetz-editable-svg.zip` in Figma, Illustrator, Inkscape or a code editor. The files are plain vector paths and live text, with no embedded bitmaps.

- **Logos:** `logos/`. The site uses `assetz-wordmark-brand-dark.svg` and `assetz-wordmark-white.svg`, copied to `assets/img/assetz-logo.svg` and `assets/img/assetz-logo-white.svg`.
- **Icons:** the website's icons are inline SVG in `src/templates/helpers.js` (`ICONS`). Edit the path there to change an icon on the site, then run `python3 scripts/make-svg-assets.py` to refresh the SVG set.
- **Colours:** replace the hex values. Keep to the approved palette.

---

## 8. Checklist before going live

- [ ] Confirm the final name of **Naru & Nami**. The developer's site calls this project *Codename Sublime*.
- [ ] Confirm usage rights for Assetz renders, footage and logos, or keep the independent-marketing notice in `data/site.json`.
- [ ] Set up lead capture: enable Netlify form detection and add an email notification, or connect the CRM.
- [ ] Set `SITE_URL` and rebuild, so canonical tags and the sitemap are generated.
- [ ] Add the GTM ID to `data/site.json`, if tracking is wanted.
- [ ] Verify RERA numbers on the Karnataka RERA portal; it could not be reached from the build environment.
- [ ] Send a test enquiry from the live site and confirm it arrives under **Forms** (or in the CRM).
