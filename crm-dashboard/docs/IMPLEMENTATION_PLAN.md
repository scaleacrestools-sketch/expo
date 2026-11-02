# Implementation plan — Pipeline CRM Dashboard (practice prototype)

> AI-assisted practice prototype. Not an assessment submission. See README for the compliance note.

## Supplied data (source of truth, rendered as-is)

| Metric | Value | Where used |
| --- | --- | --- |
| Open opportunities | 142 | Overview tile |
| Sales representatives | 8 | Overview tile, filter list length |
| Total pipeline value | €1,280,000 | Overview tile, "actual vs pipeline" chart |
| Weighted pipeline | €740,000 | Overview tile, chart |
| Quarterly target | €900,000 | Target progress |
| Achieved revenue | €612,000 | Target progress, chart |
| Win rate | 27.4 % | Overview tile |
| Win rate change | +2.1 pp | Overview tile |
| Overdue follow-ups | 23 | Follow-up panel header |
| High-priority overdue leads | 9 | Follow-up panel header |
| Deals closing this month | 18 | Overview tile |
| Potential closing value | €286,000 | Overview tile, chart |

Derived (computed in `src/lib/metrics.ts`, never hard-coded):

- Quarterly achievement = 612,000 / 900,000 = 68 %
- Remaining target = 288,000
- Unachieved target percentage = 32 %

## Illustrative data (clearly labelled in the UI)

The assessment supplies **no** stage-wise counts, deal records, owners, teams, task records or
activity history. Anything of that kind in the prototype lives in `src/data/demo*.ts` and is
rendered with an "Illustrative demo data" badge:

- 14 fictional opportunities (name, owner, team, stage, value, due date, priority, risk note,
  activity log). 10 of them are overdue so the follow-up and task components can be demonstrated.
  The panel header always states that the list is a sample and that the supplied totals (23 / 9)
  are the real figures.
- Stage chart counts/values are derived from those demo records at runtime and are labelled
  as demo-derived. A toggle shows the honest empty-data state instead.
- Reps and teams are fictional names, provided only so the filters have something to act on.

Global metrics are **never** recalculated from demo records, and filters never re-segment them.
When a filter is active the overview shows a "segmented totals unavailable" note.

## Architecture

```
src/
  types/        domain types (Opportunity, Stage, Priority, Filters, SourceMetrics …)
  data/         sourceMetrics.ts (supplied), demoOpportunities.ts (illustrative), reps/teams
  lib/          format.ts (currency/percent/date), metrics.ts (derived values), filters.ts, dates.ts
  hooks/        useOpportunities (state + localStorage), useToast, useFocusTrap, useMediaQuery
  components/   ui primitives: Badge, Button, Card, DemoBadge, Dialog/Drawer, Select, Toast, Progress
  features/     overview/, pipeline/, followups/, tasks/, filters/, opportunity/ (drawer)
  App.tsx       layout + composition
```

State: a single reducer in `useOpportunities` owns the demo records; actions are
`scheduleFollowUp`, `updateStage`, `completeTask`, `reset`. Persisted to `localStorage`
under `crm-prototype:v1` so the demo survives a refresh; "Reset demo data" restores defaults.

## Responsive strategy

- 1440 px: 12-column grid — overview (full width), pipeline chart (7 cols) + follow-ups (5 cols),
  task table (full width). Filters inline in a toolbar.
- 768 px: single column; filters wrap to 2×2; task table collapses to card list to avoid compression.
- 390 px: follow-ups and compact KPI strip come first, filters behind a "Filters" disclosure,
  drawer becomes a full-height bottom sheet, 44 px touch targets.
