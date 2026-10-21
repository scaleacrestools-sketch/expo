# Godrej Sora image library

Drop approved files here using the ids in `content/assets.ts`, e.g. `hero/tower-elevation.jpg`.
Masters go in `_masters/<id>.jpg|png`; then run `npm run assets:optimize` to generate AVIF/WebP/JPG variants
and a `.json` sidecar with dimensions. Run `npm run assets:check` to list what is still missing.

Never place images of other projects, hotels or developers here. Until a file exists, the site renders a branded
placeholder that states the artwork is pending approval.
