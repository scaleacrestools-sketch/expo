# Internal-page hero banners

The art behind each internal page's hero (`public/images/heroes`). Every banner is an HTML layout of genuine ScaleAcres material, rendered in Chromium and exported as WebP:
- client creatives;
- website and dashboard captures;
- brand pieces;
- film posters;
- studio and team photos.

Nothing is generated. No headline text is baked in, because the page sets the headline in live HTML over the art.

- `scenes.mjs` holds one composition per page. The `m` flag gives the separate phone composition.
- `assets.json` lists the team portraits and culture photos (from the live site's media library).
- `render.mjs` writes these files:

| Output | Size |
| --- | --- |
| `<name>-2400.webp`, `<name>-1600.webp` | Desktop, 16:9 |
| `<name>-mobile-1080.webp`, `<name>-mobile-720.webp` | Phone, 2:3. The work sits at the top over a Brand Black base for the headline. |
| `careers-fill.webp`, `careers-strip.webp` | Careers: the photo fill for the headline, and the team strip |

```
node scripts/hero-banners/render.mjs            # all banners
node scripts/hero-banners/render.mjs web seo    # just these
```

`components/site/banners.ts` maps the banners to pages, and `components/site/Stage.tsx` lays them out.
