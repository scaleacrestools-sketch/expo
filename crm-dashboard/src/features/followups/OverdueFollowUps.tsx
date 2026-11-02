import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Badge, PriorityBadge } from '@/components/ui/Badge';
import { repById } from '@/data/demoTeams';
import { cn } from '@/lib/cn';
import { describeDue } from '@/lib/dates';
import { formatCurrency } from '@/lib/format';
import type { Opportunity, SourceMetrics } from '@/types';

interface Props {
  source: SourceMetrics;
  /** Filtered, sorted at-risk demo records. */
  atRisk: Opportunity[];
  todayIso: string;
  onSelect: (id: string) => void;
}

function initials(name: string | undefined): string {
  return (name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function OverdueFollowUps({ source, atRisk, todayIso, onSelect }: Props) {
  return (
    <Card aria-labelledby="followups-title" data-export-group="overdue-followups" id="followups" className="h-full">
      <CardHeader title="Overdue follow-ups" titleId="followups-title" description="Highest priority first. Select a record to review and act." aside={<DemoBadge label="Demo records" />} />
      <div className="mx-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-danger/15 bg-danger-soft px-4 py-3">
          <p className="text-xs font-medium text-danger">Overdue follow-ups</p>
          <p className="tnum mt-1 text-2xl font-semibold leading-7 text-ink">{source.overdueFollowUps}</p>
          <p className="mt-0.5 text-[11px] text-ink-4">Supplied source figure</p>
        </div>
        <div className="rounded-lg border border-danger/15 bg-danger-soft px-4 py-3">
          <p className="flex items-center gap-1 text-xs font-medium text-danger">
            <AlertTriangle aria-hidden="true" className="size-3.5" /> High-priority leads
          </p>
          <p className="tnum mt-1 text-2xl font-semibold leading-7 text-ink">{source.highPriorityOverdueLeads}</p>
          <p className="mt-0.5 text-[11px] text-ink-4">Supplied source figure</p>
        </div>
      </div>
      <p className="px-5 pt-4 pb-1 text-xs leading-4 text-ink-4">
        Showing {atRisk.length} fictional at-risk record{atRisk.length === 1 ? '' : 's'} for demonstration, not the actual {source.overdueFollowUps}.
      </p>
      {atRisk.length === 0 ? (
        <p className="px-5 py-6 text-sm text-ink-3">No at-risk demo records match the current filters.</p>
      ) : (
        <ul className="flex flex-col px-2 pb-2" role="list">
          {atRisk.map((opp) => {
            const owner = repById.get(opp.ownerId);
            const high = opp.priority === 'High';
            return (
              <li key={opp.id}>
                <button
                  type="button"
                  onClick={() => onSelect(opp.id)}
                  aria-label={`Open ${opp.name}, ${opp.priority} priority, ${describeDue(opp.dueDate, todayIso)}`}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-surface-muted"
                >
                  <span
                    aria-hidden="true"
                    className={cn('flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold', high ? 'bg-danger-soft text-danger' : 'bg-accent-soft text-accent-strong')}
                  >
                    {initials(owner?.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                      <span className="truncate text-sm font-semibold text-ink">{opp.name}</span>
                      <span className="tnum shrink-0 text-xs font-semibold text-danger">{describeDue(opp.dueDate, todayIso)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-4">
                      {owner?.name ?? 'Unassigned'} · {opp.stage} · <span className="tnum">{formatCurrency(opp.value)}</span>
                    </span>
                    <span className="mt-1.5 flex items-center gap-2">
                      <PriorityBadge priority={opp.priority} />
                      <Badge tone="neutral">Next: {opp.nextAction}</Badge>
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
