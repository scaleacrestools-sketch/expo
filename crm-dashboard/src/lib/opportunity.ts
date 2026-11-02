import type { Opportunity, Stage, TaskStatus } from '@/types';
import { daysBetween } from './dates';

export const CLOSED_STAGES: readonly Stage[] = ['Won', 'Lost'];

export const isClosed = (stage: Stage): boolean => CLOSED_STAGES.includes(stage);

export function taskStatus(opp: Opportunity, todayIso: string): TaskStatus {
  if (opp.completed) return 'Completed';
  const diff = daysBetween(todayIso, opp.dueDate);
  if (diff < 0) return 'Overdue';
  if (diff <= 7) return 'Due soon';
  return 'Scheduled';
}

export const isOverdue = (opp: Opportunity, todayIso: string): boolean =>
  taskStatus(opp, todayIso) === 'Overdue';

/** Overdue AND still open — the records surfaced in the risk panel. */
export const isAtRisk = (opp: Opportunity, todayIso: string): boolean =>
  isOverdue(opp, todayIso) && !isClosed(opp.stage);

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 } as const;

/** High priority first, then most overdue first. */
export function sortByUrgency(list: Opportunity[], todayIso: string): Opportunity[] {
  return [...list].sort((a, b) => {
    const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (p !== 0) return p;
    return daysBetween(todayIso, a.dueDate) - daysBetween(todayIso, b.dueDate);
  });
}

/** Suggested next actions shown in the drawer — rule-based, demo only. */
export function suggestNextActions(opp: Opportunity, todayIso: string): string[] {
  const suggestions: string[] = [];
  const overdueDays = -daysBetween(todayIso, opp.dueDate);
  if (overdueDays > 0) suggestions.push(`Reschedule the ${opp.nextAction.toLowerCase()} — ${overdueDays} days past due.`);
  if (opp.stage === 'Negotiation') suggestions.push('Confirm decision date and remaining blockers with the buyer.');
  if (opp.stage === 'Proposal') suggestions.push('Ask for feedback on the proposal and clarify pricing questions.');
  if (opp.stage === 'Qualified') suggestions.push('Book a solution walkthrough to move to Proposal.');
  if (opp.stage === 'New') suggestions.push('Make first contact and qualify budget, authority, need and timing.');
  if (opp.priority === 'High') suggestions.push('Flag to the sales manager for a joint call.');
  return suggestions.slice(0, 3);
}
