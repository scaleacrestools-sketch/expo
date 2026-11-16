# Reference page → editable SVG

Turns a rendered web page into one editable SVG: live text, vector shapes and icons, and each
picture as its own replaceable image layer, grouped by section. Used for the reddashmedia.com homepage
(`downloads/reference-reddashmedia-home`).

1. `node build.mjs`: `prep.mjs` loads the page (`open`) and flattens it (`flatten`): scroll reveals finished, sticky sections unpinned, one hero frame. `build.mjs` then records every layer with `collect.js` into `out/ops.json`, plus raster snaps for gradients, canvas and rotated pieces.
2. Download the images listed in `out/ops.json` with curl (Playwright's request client does not use the proxy).
3. `python3 -I assemble.py out/page.svg [--embed-fonts]` writes the SVG.
4. `node render.mjs out/page.html out/r/s` renders it in slices for checking against `out/flat.png`.

The URL, hero frame and page-specific fixes are in `prep.mjs` and `build.mjs`. Needs Playwright, Pillow and fontTools.
