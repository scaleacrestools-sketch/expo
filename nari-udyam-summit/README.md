# Smart Vision Nari Udyam Summit & Expo — Landing Page

Premium, conversion-focused landing page for **Smart Vision Nari Udyam Summit & Expo**
(Delhi | 19–20 September 2026 | 5-Star Hotel).

**Live site:** https://smart-vision-nari-udyam-summit-expo.netlify.app
(Netlify project: `smart-vision-nari-udyam-summit-expo` on the `scaleacres` team)

Fully static — no build step, no dependencies. Deploy the files anywhere
(Netlify, Vercel, GitHub Pages, cPanel, S3):

```
nari-udyam-summit/
├── index.html       # All 24 content sections, SEO meta, JSON-LD event schema
├── styles.css       # Design system (burgundy/wine/plum + royal gold palette)
├── script.js        # Interactions, motion system, form, CRO widgets + CONFIG block
├── og-image.png     # Social share image (regenerate after major hero changes)
├── netlify.toml     # Publish config + security/cache headers
└── site-bundle.html # Single-file build (styles + script inlined) used for the
                     # current Netlify deploy; regenerate after edits (see below)
```

## Updating the live Netlify site

The current deploy was imported from `site-bundle.html` (a self-contained
single file). After editing `index.html` / `styles.css` / `script.js`,
regenerate the bundle and redeploy:

```bash
python3 - << 'EOF'
html = open("index.html").read()
html = html.replace('<link rel="stylesheet" href="styles.css" />', "<style>\n" + open("styles.css").read() + "\n</style>")
html = html.replace('<script src="script.js" defer></script>', "<script>\n" + open("script.js").read() + "\n</script>")
open("site-bundle.html", "w").write(html)
EOF
```

Then redeploy via the Netlify dashboard (drag-and-drop the folder onto the
project's Deploys page) or `netlify deploy --prod` with the Netlify CLI.
Deploying the full folder (instead of the single bundle) is preferred once
you have CLI/dashboard access — it serves `index.html` + assets with the
`netlify.toml` headers and a working relative `og-image.png`.

## Before going live — fill in the CONFIG block

Open `script.js` and set the values at the top:

```js
var CONFIG = {
  whatsappNumber: "",   // e.g. "919876543210" (country code + number, digits only)
  phone: "",            // e.g. "+91 98765 43210"
  email: "",            // e.g. "hello@smartvision.example"
  ...
};
```

- Every **WhatsApp button** (floating button, sticky mobile bar, WhatsApp CTAs)
  automatically deep-links to `wa.me` with a pre-filled message once
  `whatsappNumber` is set. Until then, those buttons gracefully scroll to the
  enquiry form so no click is lost.
- The footer's `[Phone Number]`, `[Email ID]` and `[WhatsApp Number]`
  placeholders are replaced automatically from the same CONFIG.

## Connect the enquiry form

The form currently validates, shows the premium thank-you state and logs the
data in the browser console. To capture leads for real, wire the `submit`
handler in `script.js` (search for `NOTE: connect this handler`) to your
backend, CRM, Google Sheet (Apps Script) or a service such as Formspree —
a single `fetch()` call is enough.

## Dropping in real campaign photography (IMAGES manifest)

Every photo position on the page is a pre-wired frame with the brand's
colour grade, veil and captions already applied. To activate one, open
`script.js` and fill the matching entry in the `IMAGES` manifest at the top:

```js
var IMAGES = {
  "hero-host": "assets/host-portrait.jpg",   // the recurring female event host
  "shakti-ceo": "assets/ceo.jpg",            // Nari Shakti roll-call portraits …
  ...
  "venue-atmosphere": "assets/stage.jpg"     // visitor-section venue photograph
};
```

Use relative paths (put files in an `assets/` folder next to `index.html`)
or absolute URLs. The frame switches from its art-directed state to the
photograph automatically; a URL that fails to load silently reverts to the
art-directed state, so a broken image can never break the page. Recommended:
portrait crops around 900×1200, WebP/JPEG quality ~75.

Photography brief (per the approved creative direction): realistic,
confident Indian women entrepreneurs — corporate CEO, startup founder,
boutique owner, home baker, jewellery business owner, artisan/potter, D2C
brand owner, MSME businesswoman — plus one recurring event-host portrait
and a 5-star stage/venue atmosphere shot. Avoid AI-looking faces and
posed stock compositions.

## SEO

- Title, meta description and keywords are set from the approved copy.
- `BusinessEvent` JSON-LD (with all four stall offers) is embedded for rich results.
- `og-image.png` is referenced for social sharing — replace with the official
  creative when finalised, keeping the 1200×630 size.
- Set a `<link rel="canonical">` once the final domain is confirmed.
