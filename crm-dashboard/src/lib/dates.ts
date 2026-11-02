import { parseIsoDate } from './format';

const MS_PER_DAY = 86_400_000;

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Whole days from `fromIso` to `toIso`; negative when `toIso` is earlier. */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((parseIsoDate(toIso).getTime() - parseIsoDate(fromIso).getTime()) / MS_PER_DAY);
}

export function startOfMonth(iso: string): string {
  const d = parseIsoDate(iso);
  return toIsoDate(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function endOfMonth(iso: string): string {
  const d = parseIsoDate(iso);
  return toIsoDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

/** "12 days overdue" / "due today" / "due in 3 days" */
export function describeDue(dueIso: string, todayIso: string): string {
  const diff = daysBetween(todayIso, dueIso);
  if (diff < 0) return `${Math.abs(diff)} day${diff === -1 ? '' : 's'} overdue`;
  if (diff === 0) return 'Due today';
  return `Due in ${diff} day${diff === 1 ? '' : 's'}`;
}
