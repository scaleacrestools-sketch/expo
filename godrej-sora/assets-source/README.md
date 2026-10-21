# Source assets (not committed)

Place the official material here, then run the extraction scripts:

```
assets-source/
  godrej-sora-brochure.pdf      ← the 64-page Godrej Sora brochure
  official/                     ← any renders downloaded from godrejproperties.com (optional, any filename)
  logo/godrej-sora-logo.svg     ← original logo artwork (SVG or high-res PNG)
  logo/godrej-properties-logo.svg
```

Then:

```bash
npm run assets:extract     # renders brochure pages → public/images/godrej-sora/_masters/<id>.jpg (per content/brochure-map.ts)
npm run assets:fetch       # (on a machine that can reach godrejproperties.com) downloads gallery renders → _masters/official/
npm run assets:optimize    # AVIF/WebP/JPG variants + dimension sidecars
npm run assets:check       # what is still missing
```

This folder is git-ignored because the brochure and renders are Godrej Properties' copyright. Keep the written permission alongside it.
