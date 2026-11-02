import type { SourceMetrics } from '@/types';

/**
 * Figures supplied by the assessment brief. These are the only "real" numbers in the prototype
 * and must be preserved exactly. Nothing here is derived from the demo records.
 */
export const sourceMetrics: SourceMetrics = {
  openOpportunities: 142,
  salesRepresentatives: 8,
  totalPipelineValue: 1_280_000,
  weightedPipelineValue: 740_000,
  quarterlyTarget: 900_000,
  achievedRevenue: 612_000,
  winRate: 27.4,
  winRateChangePp: 2.1,
  overdueFollowUps: 23,
  highPriorityOverdueLeads: 9,
  dealsClosingThisMonth: 18,
  potentialClosingValue: 286_000,
};

/** Label shown wherever supplied figures appear. */
export const SOURCE_LABEL = 'Supplied source data';

/**
 * Fixed reference date used for overdue / due-soon calculations so the demo is deterministic.
 * Displayed in the UI as "Demo date".
 */
export const DEMO_TODAY = '2026-11-02';

/** Quarter the supplied target applies to (for display only). */
export const QUARTER_LABEL = 'Q4 2026';
