# Sales & Customer Pipeline — CRM Dashboard (practice prototype)

> **AI-assisted practice prototype.** This application, its layout, copy and the SVG exports were
> produced with AI assistance for learning and technical prototyping. The related Lead UI/UX
> Designer assessment prohibits submitting AI-generated layouts, screens, copy, icons or design
> assets, so **nothing in this folder is eligible as an independently designed assessment
> submission.** If you have your own Figma design, implement that instead.

A responsive React + TypeScript dashboard for a Sales Manager supervising 8 representatives:
quarterly target progress, pipeline health, overdue follow-ups, at-risk opportunities and a
task list with working follow-up scheduling, stage changes and task completion.

## Installation

Requires Node 20+ (tested on Node 22).

```bash
cd crm-dashboard
npm install
```

## Development server

```bash
npm run dev
```

Opens http://localhost:5173.

## Build, type-check, lint

```bash
npm run build        # tsc -b && vite build → dist/
npm run typecheck
npm run lint
npm run preview      # serves dist/ on http://localhost:4173
```

## Dashboard features

| Area | What it does |
| --- | --- |
| KPI cards | Achieved revenue vs quarterly target (with progress bar), total vs weighted pipeline, open opportunities + win rate, deals closing this month + potential value. Supplied figures only. |
| Target card | 68 % achievement, €288,000 remaining, and a labelled bar list that separates *actual* revenue from *potential*, *weighted* and *unweighted* pipeline. |
| Pipeline by stage | New → Lost bar chart derived from the demo records in view, with a toggle to the honest empty-data state (stage aggregates were not supplied). |
| Overdue follow-ups | Supplied totals (23 overdue, 9 high-priority) plus a demo at-risk queue sorted by priority and lateness. Opens the detail drawer. |
| Activity & tasks | Sortable-by-urgency task list (table ≥1024 px, cards below) with search, *Open* and *Mark complete*. |
| Global filters | Date range (presets + custom), team, representative, deal stage. Apply to demo records only; global metrics stay team-wide and say so. |
| Opportunity drawer | Accessible dialog with owner, stage, value, due date, risk context, suggested next actions, activity; *Schedule follow-up* and *Update stage* forms; success/error toasts. |
| Persistence | Demo state is kept in `localStorage` (`crm-prototype:v1`). *Reset demo data* restores defaults. |

## Supplied data vs illustrative data

Supplied by the brief and rendered exactly (`src/data/sourceMetrics.ts`): 142 open opportunities,
8 reps, €1,280,000 total pipeline, €740,000 weighted pipeline, €900,000 target, €612,000 achieved,
27.4 % win rate (+2.1 pp), 23 overdue follow-ups, 9 high-priority overdue leads, 18 deals closing
this month, €286,000 potential closing value. Derived in `src/lib/metrics.ts`: 68 % achievement,
€288,000 remaining, 32 % unachieved.

Everything else — 14 opportunities, 8 named reps, 2 teams, stage counts, activity history — is
fictional (`src/data/demo*.ts`) and is labelled **Illustrative demo data** wherever it appears.
Demo records are never summed into the supplied metrics, filters never re-segment the supplied
metrics, and no forecast is shown or implied.

## Responsive behaviour

| Width | Layout |
| --- | --- |
| 1440 px | 240 px sidebar, sticky top bar, filter toolbar, 4 KPI cards, 7/5 grid (target + pipeline / overdue queue), full-width task table. |
| 768 px | Sidebar hidden, bottom section nav, collapsible filters, 2×2 KPI cards, stacked panels, task list as two-column cards (no compressed table). |
| 390 px | Overdue queue first, single-column KPIs, filters behind a disclosure, one-column task cards, drawer becomes a bottom sheet, 44 px-high controls, no horizontal overflow. |

Verified headlessly with Playwright (`npm run verify:responsive` against a running preview):
no horizontal overflow at any width, drawer focus management, schedule/stage/complete flows and
filter behaviour. Real-device, screen-reader and touch testing have **not** been performed.

## Interaction walkthrough

See [`docs/INTERACTION_WALKTHROUGH.md`](docs/INTERACTION_WALKTHROUGH.md). Implementation notes and
the data audit are in [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md).

## SVG and PNG exports

Files live in `exports/svg/` and `exports/previews/`:

| File | Size | Content |
| --- | --- | --- |
| `exports/svg/crm-dashboard-desktop.svg` | 1440 × full page | Complete desktop dashboard |
| `exports/svg/crm-dashboard-tablet.svg` | 768 × full page | Tablet-adapted dashboard |
| `exports/svg/crm-dashboard-mobile.svg` | 390 × full page | Mobile-adapted dashboard |
| `exports/svg/crm-opportunity-interaction.svg` | 1860 × 900 | Desktop viewport with the drawer open + numbered annotation panel |
| `exports/previews/*.png` | 2× | Screenshots of the live app (`crm-dashboard-*.png`, `crm-opportunity-interaction*.png`) |
| `exports/previews/*.svg-render.png` | 1× | The SVG files themselves rendered back through Chromium, for checking the export |

### How the SVGs are produced

They are **not** renamed screenshots. `scripts/export-svg.mjs` loads the production build in
headless Chromium (Playwright, pre-installed in this environment) and runs `scripts/dom-to-svg.js`,
which walks the rendered DOM and emits:

- `<rect>` for backgrounds and borders (radius, per-side borders, dashed borders);
- one `<text>` element per rendered line, with font family/size/weight/colour and letter-spacing
  — all text is editable;
- Lucide icons and Recharts charts copied as native SVG with `currentColor` and CSS variables
  resolved to literal colours;
- `<g data-name="…">` groups for every section, card, list item, table row, button and dialog
  (Figma shows these as layer names);
- `<clipPath>` for scrolling/overflow containers.

Regenerate after a design change:

```bash
npm run build
npx vite preview --port 4173          # in one terminal
npm run export:svg                    # writes exports/svg/*.svg and app PNGs
npm run export:previews               # renders each SVG back to PNG and validates parsing
```

or in one go: `npm run export:all`.

### Known export limitations

- Box shadows, backdrop blur and CSS transitions are not exported (flat fills and borders only).
- Native form-control chrome (select arrows, checkbox, date pickers) is drawn as simple shapes
  and text; the search input shows its placeholder.
- Text baselines are estimated from line boxes (`top + 0.8 × line height`), so glyph positions
  can differ by about 1 px from the browser.
- The font is referenced as `Inter` (Figma includes it). If Inter is unavailable the viewer falls
  back to a system sans-serif and line lengths may change slightly.
- The full-page exports place sticky/fixed elements (top bar, bottom nav) where they sit when the
  page is fully expanded, i.e. top bar at the top and bottom nav at the very bottom.

## Attribution

- [React](https://react.dev) 19, [Vite](https://vite.dev) 7, [TypeScript](https://www.typescriptlang.org) 5.9 — MIT
- [Tailwind CSS](https://tailwindcss.com) 4 — MIT
- [Recharts](https://recharts.org) 3 — MIT (stage chart)
- [Lucide React](https://lucide.dev) — ISC (icons)
- [Inter](https://rsms.me/inter/) via Google Fonts — SIL Open Font License
- [Playwright](https://playwright.dev) — Apache-2.0 (verification and export scripts only)

No UI kit or template was used; all components are hand-written in `src/components` and
`src/features`.
