# Gulati — website

Static site for Gulati (great Indian food, since 1959), built from the studio's
Home and Locations artboards.

- `index.html` — Home (hero, The Legacy, Signature Dishes, Our Locations banner, contact/footer)
- `story/index.html` — Our Story (from the Our Story artboard)
- `experience/`, `menu/`, `gallery/`, `accolades/` — interim pages built from approved copy and photography, to be replaced by their artboards
- `contact/index.html` — Contact (formerly Locations; `/locations/` redirects here)
- `assets/css/style.css` — design tokens, typography, layout
- `assets/js/main.js` — navigation overlay, reveal-on-scroll, AJAX form submit
- `assets/img/` — photography, brand marks and the two pattern tiles from the artwork
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

Netlify project: **gulati** on team *scaleacres* — https://app.netlify.com/projects/gulati
(live URL https://gulati.netlify.app once deployed). Forms are enabled on the project.

Either of these publishes the folder:

```shell
# one-off upload from this folder (needs `netlify login` once)
npx netlify-cli deploy --dir . --site 014f8bd2-a41b-49d3-bd87-4c4aaf8ca564 --prod
```

or link the project to this repository for continuous deployment:
*Project configuration → Build & deploy → Link repository* → `scaleacrestools-sketch/expo`,
base directory `gulati`, publish directory `gulati`, no build command.
