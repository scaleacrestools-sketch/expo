# Interaction walkthrough — at-risk opportunity flow

> AI-assisted practice prototype. Every opportunity, owner, task and activity record in this flow
> is fictional and labelled "Illustrative demo data" in the UI. Supplied metrics (23 overdue
> follow-ups, 9 high-priority leads, etc.) are shown exactly and are never recomputed.

Reference date in the prototype is fixed at **2 Nov 2026** ("Demo date" chip in the top bar) so
overdue calculations are deterministic.

## 1. Initial dashboard state

- Desktop (1440 px): sidebar, top bar, filter toolbar, four KPI cards (supplied figures), then a
  two-column area — *Q4 2026 target progress* and *Pipeline by stage* on the left, *Overdue
  follow-ups* on the right — followed by the *Activity & tasks* table.
- The overdue panel shows the supplied totals (23 / 9) and a list of 10 fictional at-risk records,
  sorted high priority first, then most overdue first.
- Mobile (390 px) puts the overdue panel first, then KPIs, filters, tasks, target and pipeline.
  A bottom navigation bar jumps between sections.

## 2. Selecting an at-risk opportunity

- Click (or Tab to and press Enter on) a row in *Overdue follow-ups*, e.g. **Warehouse automation
  rollout** (12 days overdue, High priority). Rows in the task table also open the same drawer via
  the opportunity name.
- A detail drawer opens on the right (bottom sheet on mobile). It uses `role="dialog"`,
  `aria-modal="true"`, is labelled by the opportunity name, traps focus, closes on **Escape** or the
  close button, and returns focus to the opener (or to the main region if the opener has
  disappeared from the list).

## 3. Reviewing opportunity context

The drawer shows: name and account, stage / priority / status chips, owner and team, unweighted
deal value, follow-up due date and next action, a *Risk context* note, up to three rule-based
*Suggested next actions*, and the *Recent activity* timeline.

## 4. Selecting an action

Two buttons sit in a sticky footer:

- **Schedule follow-up** reveals an inline form: date (defaults to demo date + 2 days, cannot be
  earlier than the demo date) and an optional note. *Confirm follow-up* submits; *Cancel* returns
  to the summary. Validation errors render inline with `role="alert"`.
- **Update stage** reveals a stage select (New → Lost; the current stage is marked). Choosing the
  same stage shows an inline error; *Confirm stage* submits.

## 5. Updated state and confirmation

- The demo record updates immediately in local state (persisted to `localStorage`):
  - rescheduling sets the new due date, clears the overdue status, logs an activity entry and
    removes the record from the overdue queue;
  - a stage change updates the chip in the drawer, the task table and the stage chart, and logs an
    activity entry.
- A success toast appears bottom-right (`role="status"`, `aria-live="polite"`), e.g.
  *"Follow-up scheduled — Warehouse automation rollout is now due 6 Nov 2026."*
- *Mark complete* in the task table sets status to **Completed**; pressing it again shows an error
  toast ("Nothing to complete").
- **Reset demo data** in the top bar restores every record and clears filters.

## Manual demonstration script

1. `npm run dev`, open http://localhost:5173 at 1440 px wide.
2. In *Overdue follow-ups*, click **Warehouse automation rollout**.
3. Read the risk context and suggested actions; press **Schedule follow-up**.
4. Pick 6 Nov 2026, type a note, press **Confirm follow-up** → toast appears, activity entry added.
5. Press **Update stage**, choose **Proposal**, press **Confirm stage** → chips update.
6. Press **Escape** → drawer closes; the record is no longer in the overdue queue; the task table
   shows it as *Due soon* with stage *Proposal*.
7. Change *Deal stage* filter to **Negotiation** → list, chart and table narrow to matching demo
   records; the KPI cards stay team-wide and the target card shows the "segmented totals
   unavailable" note.
8. Resize to 768 px and 390 px and repeat steps 2–6 using touch-sized controls.
