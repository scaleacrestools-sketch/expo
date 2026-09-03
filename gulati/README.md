# Gulati — website

Static site for Gulati (great Indian food, since 1959), built from the studio's
Home and Locations artboards.

- `index.html` — Home (hero, The Legacy, Signature Dishes, Our Locations banner, contact/footer)
- `locations/index.html` — All Locations (Pandara Road, New Delhi · DLF Phase 1, Gurugram)
- `assets/css/style.css` — design tokens, typography, layout
- `assets/js/main.js` — navigation overlay, reveal-on-scroll, AJAX form submit
- `assets/img/` — photography and brand marks extracted from the artwork
- `netlify.toml` — publish directory and cache/security headers

## Typography

Body copy is set in **Cormorant** (self-hosted in `assets/fonts/`), matching the artwork.
Display headings in the artwork use **Valky**, a licensed typeface that is not
bundled. Add the licensed webfont files to `assets/fonts/` and un-comment the
`@font-face` block at the top of `assets/css/style.css`; until then the stack
falls back to **Marcellus**.

## Forms

The contact form uses Netlify Forms (`data-netlify="true"`) with a honeypot
field. Submissions appear under *Forms* in the Netlify project.

## Deploy

The folder is a plain static site: no build step. Publish directory is the
folder root (see `netlify.toml`).
