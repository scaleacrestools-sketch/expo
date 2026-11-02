import type { DateRange, DateRangePreset, Filters, Opportunity, Rep } from '@/types';
import { addDays, endOfMonth, startOfMonth } from './dates';

export const DEFAULT_FILTERS: Filters = {
  datePreset: 'all',
  customRange: { from: null, to: null },
  repId: 'all',
  teamId: 'all',
  stage: 'all',
};

export const DATE_PRESET_LABELS: Record<DateRangePreset, string> = {
  all: 'All dates',
  overdue: 'Overdue only',
  next7: 'Next 7 days',
  thisMonth: 'This month',
  custom: 'Custom range',
};

/** Resolve a preset to an inclusive ISO range (null bounds are open-ended). */
export function resolveDateRange(filters: Filters, todayIso: string): DateRange {
  switch (filters.datePreset) {
    case 'all':
      return { from: null, to: null };
    case 'overdue':
      return { from: null, to: addDays(todayIso, -1) };
    case 'next7':
      return { from: todayIso, to: addDays(todayIso, 7) };
    case 'thisMonth':
      return { from: startOfMonth(todayIso), to: endOfMonth(todayIso) };
    case 'custom':
      return filters.customRange;
  }
}

export function isFilterActive(filters: Filters): boolean {
  return (
    filters.datePreset !== 'all' ||
    filters.repId !== 'all' ||
    filters.teamId !== 'all' ||
    filters.stage !== 'all'
  );
}

export function applyFilters(
  list: Opportunity[],
  filters: Filters,
  reps: Rep[],
  todayIso: string,
): Opportunity[] {
  const range = resolveDateRange(filters, todayIso);
  const repTeam = new Map(reps.map((r) => [r.id, r.teamId]));
  return list.filter((opp) => {
    if (filters.repId !== 'all' && opp.ownerId !== filters.repId) return false;
    if (filters.teamId !== 'all' && repTeam.get(opp.ownerId) !== filters.teamId) return false;
    if (filters.stage !== 'all' && opp.stage !== filters.stage) return false;
    if (range.from && opp.dueDate < range.from) return false;
    if (range.to && opp.dueDate > range.to) return false;
    return true;
  });
}
