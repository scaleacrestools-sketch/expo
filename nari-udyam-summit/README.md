# Smart Vision Nari Udyam Summit & Expo — Landing Page

Premium, conversion-focused landing page for **Smart Vision Nari Udyam Summit & Expo**
(Delhi | 19–20 September 2026 | 5-Star Hotel).

Fully static — no build step, no dependencies. Deploy the three files anywhere
(Netlify, Vercel, GitHub Pages, cPanel, S3):

```
nari-udyam-summit/
├── index.html    # All 24 content sections, SEO meta, JSON-LD event schema
├── styles.css    # Design system (burgundy/wine/plum + royal gold palette)
├── script.js     # Interactions, countdown, form, CRO widgets + CONFIG block
└── og-image.png  # Social share image (regenerate after major hero changes)
```

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

## Replacing placeholder visuals with photography

The design intentionally ships with elegant art-directed placeholders
(cameo portraits in "Nari Shakti", speaker cards, the atmosphere frame in the
visitor section, the Chief Guest medallion). When official editorial
photography and confirmed names are available, swap the SVG blocks for
`<img>` tags (use WebP/AVIF, add `width`/`height` and `loading="lazy"`) —
the frames, captions and layouts already accommodate them.

## SEO

- Title, meta description and keywords are set from the approved copy.
- `BusinessEvent` JSON-LD (with all four stall offers) is embedded for rich results.
- `og-image.png` is referenced for social sharing — replace with the official
  creative when finalised, keeping the 1200×630 size.
- Set a `<link rel="canonical">` once the final domain is confirmed.
