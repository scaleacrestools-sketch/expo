/** Pipeline stages supported by the prototype, in funnel order. */
export const STAGES = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] as const;
export type Stage = (typeof STAGES)[number];

export const PRIORITIES = ['High', 'Medium', 'Low'] as const;
export type Priority = (typeof PRIORITIES)[number];

export type TaskStatus = 'Overdue' | 'Due soon' | 'Scheduled' | 'Completed';

export type NextActionKind = 'Call' | 'Email' | 'Meeting' | 'Send proposal' | 'Follow-up';

export interface Rep {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface ActivityEntry {
  id: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  summary: string;
}

/**
 * An illustrative opportunity record. Everything in this shape is fictional demo data —
 * the assessment did not supply individual deal records.
 */
export interface Opportunity {
  id: string;
  name: string;
  account: string;
  ownerId: string;
  stage: Stage;
  /** Deal value in EUR (unweighted). */
  value: number;
  priority: Priority;
  nextAction: NextActionKind;
  /** ISO date (YYYY-MM-DD) the next follow-up is due. */
  dueDate: string;
  /** Explains why the record is considered at risk. */
  riskContext: string;
  activity: ActivityEntry[];
  completed: boolean;
}

export interface DateRange {
  /** ISO date or null for open-ended. */
  from: string | null;
  to: string | null;
}

export type DateRangePreset = 'all' | 'overdue' | 'next7' | 'thisMonth' | 'custom';

export interface Filters {
  datePreset: DateRangePreset;
  customRange: DateRange;
  repId: string | 'all';
  teamId: string | 'all';
  stage: Stage | 'all';
}

/** Supplied source metrics — rendered exactly, never recomputed from demo data. */
export interface SourceMetrics {
  openOpportunities: number;
  salesRepresentatives: number;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  quarterlyTarget: number;
  achievedRevenue: number;
  winRate: number;
  winRateChangePp: number;
  overdueFollowUps: number;
  highPriorityOverdueLeads: number;
  dealsClosingThisMonth: number;
  potentialClosingValue: number;
}

export interface DerivedMetrics {
  quarterlyAchievementPct: number;
  remainingTarget: number;
  unachievedPct: number;
}

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}
