import { Card, CardHeader } from '@/components/ui/Card';
import { SourceBadge } from '@/components/ui/DemoBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QUARTER_LABEL } from '@/data/sourceMetrics';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';
import type { DerivedMetrics, SourceMetrics } from '@/types';

interface Props {
  source: SourceMetrics;
  derived: DerivedMetrics;
  filtersActive: boolean;
}

interface Row {
  key: string;
  label: string;
  kind: string;
  value: number;
  color: string;
  emphasis?: boolean;
}

/**
 * Quarterly target progress plus a labelled comparison of actual revenue against the
 * weighted, unweighted and potential figures — so the four are never read as one number.
 */
export function TargetCard({ source, derived, filtersActive }: Props) {
  const rows: Row[] = [
    { key: 'achieved', label: 'Achieved revenue', kind: 'Actual · closed won', value: source.achievedRevenue, color: 'var(--color-chart-actual)', emphasis: true },
    { key: 'potential', label: 'Closing this month', kind: 'Potential · 18 deals, not won', value: source.potentialClosingValue, color: 'var(--color-chart-potential)' },
    { key: 'weighted', label: 'Weighted pipeline', kind: 'Probability-adjusted', value: source.weightedPipelineValue, color: 'var(--color-chart-weighted)' },
    { key: 'pipeline', label: 'Total pipeline', kind: 'Unweighted · open', value: source.totalPipelineValue, color: 'var(--color-chart-pipeline)' },
  ];
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <Card aria-labelledby="target-title" data-export-group="target-card">
      <CardHeader title={`${QUARTER_LABEL} target progress`} titleId="target-title" description="Team-wide. Achieved revenue is actual; everything else is pipeline." aside={<SourceBadge />} />
      <div className="flex flex-col gap-6 px-5 pb-5">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="tnum text-[32px] font-semibold leading-9 tracking-[-0.02em] text-ink">
              {derived.quarterlyAchievementPct}%
              <span className="ml-2 text-sm font-medium tracking-normal text-ink-3">of {formatCurrency(source.quarterlyTarget)} target</span>
            </p>
            <p className="text-[13px] text-ink-3">
              <span className="tnum font-semibold text-danger">{formatCurrency(derived.remainingTarget)}</span> remaining ({derived.unachievedPct}%)
            </p>
          </div>
          <div className="mt-3">
            <ProgressBar value={source.achievedRevenue} max={source.quarterlyTarget} label="Quarterly target progress" valueText={`${formatCurrency(source.achievedRevenue)} of ${formatCurrency(source.quarterlyTarget)}`} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink-4">
            <span className="tnum">€0</span>
            <span className="tnum">Achieved {formatCurrency(source.achievedRevenue)}</span>
            <span className="tnum">Target {formatCurrency(source.quarterlyTarget)}</span>
          </div>
        </div>

        <figure>
          <figcaption className="mb-3 text-[13px] font-semibold text-ink">Actual revenue vs pipeline value</figcaption>
          <ul className="flex flex-col gap-3" role="list">
            {rows.map((row) => (
              <li key={row.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[180px_minmax(0,1fr)_112px]">
                <div className="min-w-0">
                  <p className={cn('truncate text-[13px] leading-5', row.emphasis ? 'font-semibold text-ink' : 'font-medium text-ink-2')}>{row.label}</p>
                  <p className="truncate text-xs leading-4 text-ink-4">{row.kind}</p>
                </div>
                <p className="tnum text-right text-sm font-semibold text-ink sm:order-last">{formatCurrency(row.value)}</p>
                <div className="col-span-2 h-2.5 overflow-hidden rounded-full bg-surface-muted sm:col-span-1" aria-hidden="true">
                  <div className="h-full rounded-full" style={{ width: `${(row.value / max) * 100}%`, background: row.color }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-4 text-ink-4">Pipeline, weighted and potential values are not guaranteed revenue and are not forecasts.</p>
        </figure>

        {filtersActive ? (
          <p className="rounded-lg bg-surface-muted px-3 py-2 text-xs leading-4 text-ink-3" role="note">
            Filters apply to the demo records only. Segmented totals for the supplied metrics are not available, so team-wide figures remain.
          </p>
        ) : null}
      </div>
    </Card>
  );
}
