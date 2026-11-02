import { useId, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardHeader } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatCurrency, formatCurrencyCompact } from '@/lib/format';
import { isClosed } from '@/lib/opportunity';
import { STAGES, type Opportunity, type Stage } from '@/types';

interface Props {
  /** Filtered demo records. */
  opportunities: Opportunity[];
}

interface StageRow {
  stage: Stage;
  count: number;
  value: number;
}

export function PipelineByStage({ opportunities }: Props) {
  const [mode, setMode] = useState<'demo' | 'empty'>('demo');
  const toggleId = useId();
  const narrow = useMediaQuery('(max-width: 639px)');

  const rows = useMemo<StageRow[]>(
    () =>
      STAGES.map((stage) => {
        const inStage = opportunities.filter((o) => o.stage === stage);
        return { stage, count: inStage.length, value: inStage.reduce((sum, o) => sum + o.value, 0) };
      }),
    [opportunities],
  );
  const openValue = rows.filter((r) => !isClosed(r.stage)).reduce((s, r) => s + r.value, 0);

  return (
    <Card aria-labelledby="pipeline-title" data-export-group="pipeline-by-stage" id="pipeline">
      <CardHeader
        title="Pipeline by stage"
        titleId="pipeline-title"
        description="Stage-wise aggregates were not supplied. Values are derived from the demo records in view."
        aside={
          <>
            <DemoBadge label={mode === 'demo' ? 'Illustrative demo data' : 'No source data'} />
            <label htmlFor={toggleId} className="flex h-6 cursor-pointer items-center gap-2 text-xs font-medium text-ink-3">
              <input id={toggleId} type="checkbox" className="size-4 rounded accent-accent" checked={mode === 'empty'} onChange={(e) => setMode(e.target.checked ? 'empty' : 'demo')} />
              Empty state
            </label>
          </>
        }
      />
      <div className="px-5 pb-5">
        {mode === 'empty' ? (
          <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface-muted p-6 text-center">
            <p className="text-sm font-semibold text-ink">Stage breakdown unavailable</p>
            <p className="mt-1 max-w-sm text-[13px] leading-5 text-ink-3">
              The supplied dataset contains totals only (142 open opportunities, €1,280,000 unweighted). Connect a CRM export with stage data to populate this view.
            </p>
          </div>
        ) : (
          <figure>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-ink-3">
              <span>
                <strong className="tnum font-semibold text-ink">{opportunities.length}</strong> demo records · open value <strong className="tnum font-semibold text-ink">{formatCurrency(openValue)}</strong>
              </span>
              <span className="text-xs text-ink-4">Not the real distribution of the 142 open opportunities</span>
            </div>
            <div className="h-60" role="img" aria-label={rows.map((r) => `${r.stage}: ${r.count} demo records, ${formatCurrency(r.value)}`).join('; ')}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} margin={{ top: 22, right: 4, bottom: narrow ? 24 : 0, left: 0 }} barCategoryGap="28%">
                  <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
                  <XAxis dataKey="stage" tick={{ fontSize: narrow ? 11 : 12, fill: 'var(--color-ink-3)', fontFamily: 'inherit' }} axisLine={false} tickLine={false} interval={0} angle={narrow ? -35 : 0} textAnchor={narrow ? 'end' : 'middle'} height={narrow ? 46 : 28} />
                  <YAxis tickFormatter={formatCurrencyCompact} tick={{ fontSize: 11, fill: 'var(--color-ink-4)', fontFamily: 'inherit' }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip
                    cursor={{ fill: 'var(--color-surface-muted)' }}
                    formatter={(value, _n, item) => [`${formatCurrency(Number(value))} · ${(item?.payload as StageRow | undefined)?.count ?? 0} demo records`, 'Demo value']}
                    contentStyle={{ borderRadius: 10, borderColor: 'var(--color-line)', fontSize: 12, boxShadow: 'var(--shadow-pop)' }}
                  />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]} isAnimationActive={false}>
                    {rows.map((row) => (
                      <Cell key={row.stage} fill={isClosed(row.stage) ? 'var(--color-chart-stage-closed)' : 'var(--color-chart-stage)'} />
                    ))}
                    <LabelList dataKey="count" position="top" formatter={(v: unknown) => `${String(v)}`} style={{ fontSize: 11, fontWeight: 600, fill: 'var(--color-ink-2)', fontFamily: 'inherit' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <figcaption className="mt-2 flex items-center gap-4 text-xs text-ink-4">
              <span className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-sm bg-chart-stage" /> Open stages</span>
              <span className="flex items-center gap-1.5"><span aria-hidden="true" className="size-2.5 rounded-sm bg-chart-stage-closed" /> Closed (won / lost)</span>
              <span className="ml-auto">Bar label = demo record count</span>
            </figcaption>
          </figure>
        )}
      </div>
    </Card>
  );
}
