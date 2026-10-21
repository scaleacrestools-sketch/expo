# Final test results — 2026-10-21

Production build of the final package (brochure imagery integrated).

| Check | Command | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | ✔ no errors |
| Lint | `npm run lint` | ✔ No ESLint warnings or errors |
| Production build | `npm run build` | ✔ Compiled; `/` static, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/icon.svg`, `/api/leads` (dynamic) |
| Playwright end-to-end (desktop 1440 + mobile 390) | `npm run test:e2e` | ✔   8 passed (12.1s) |
| Lead API (manual) | POST `/api/leads` | ✔ 200 + stored on valid input; 422 with field errors; duplicate flagged; honeypot silently dropped; 429 after rate limit |
| Routes | curl | ✔ `/` 200, `/privacy` 200, `/robots.txt` 200, `/sitemap.xml` 200 |
| Assets | `npm run assets:check` | 39 / 43 manifest ids present (missing: master plan, 3 BHK and 4 BHK floor plans, Godrej Properties vector logo — not in the brochure) |

## Scripted accessibility and layout sanity (per viewport)

```
desktop-1440 {"imagesWithoutAlt":0,"buttonsWithoutName":0,"h1":1,"headings":"H1 H2 H2 H3 H3 H3 H3 H3 H3 H3 H3 H2 H3 H3 H3 H2 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H2 H3 H2 H3 H3 H3 H2 H2 H2 H3 H3 H2 H2 H2 H2","horizontalOverflow":false}
tablet-768 {"imagesWithoutAlt":0,"buttonsWithoutName":0,"h1":1,"headings":"H1 H2 H2 H3 H3 H3 H3 H3 H3 H3 H3 H2 H3 H3 H3 H2 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H2 H3 H2 H3 H3 H3 H2 H2 H2 H3 H3 H2 H2 H2 H2","horizontalOverflow":false}
mobile-390 {"imagesWithoutAlt":0,"buttonsWithoutName":0,"h1":1,"headings":"H1 H2 H2 H3 H3 H3 H3 H3 H3 H3 H3 H2 H3 H3 H3 H2 H3 H3 H3 H3 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H3 H3 H3 H2 H2 H3 H3 H3 H3 H3 H2 H3 H2 H3 H3 H3 H2 H2 H2 H3 H3 H2 H2 H2 H2","horizontalOverflow":false}
```

Console errors: none at any viewport. Horizontal overflow: none. Reduced-motion: every animation disabled under `prefers-reduced-motion: reduce`.

## Playwright suite (8 tests × 2 projects)

1. renders all 19 sections, nav and legal disclosures
2. lead drawer validates and submits (client + server validation, success state, Escape closes)
3. gallery lightbox supports keyboard navigation (← → Esc)
4. configuration tabs switch

Screenshots: `docs/screenshots/` — hero, drawer and full page at 1440, 768 and 390.
