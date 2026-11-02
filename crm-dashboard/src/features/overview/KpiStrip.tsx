import { Briefcase, CalendarCheck, Layers, Target, TrendingUp } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency, formatInteger, formatPercent, formatPercentagePoints } from '@/lib/format';
import type { DerivedMetrics, SourceMetrics } from '@/types';
import { StatCard } from './StatCard';

interface Props {
  source: SourceMetrics;
  derived: DerivedMetrics;
}

/** Four supplied headline metrics. Values are rendered exactly as provided. */
export function KpiStrip({ source, derived }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-export-group="kpi-strip">
      <StatCard
        tone="accent"
        label="Quarterly target"
        qualifier="Achieved revenue (actual)"
        icon={<Target />}
        value={formatCurrency(source.achievedRevenue)}
        visual={
          <ProgressBar
            size="sm"
            value={source.achievedRevenue}
            max={source.quarterlyTarget}
            label="Quarterly target progress"
            valueText={`${derived.quarterlyAchievementPct}% of ${formatCurrency(source.quarterlyTarget)}`}
          />
        }
        footer={
          <span className="flex flex-wrap justify-between gap-x-3">
            <span>
              <strong className="font-semibold text-ink">{derived.quarterlyAchievementPct}%</strong> of {formatCurrency(source.quarterlyTarget)}
            </span>
            <span className="tnum text-danger">{formatCurrency(derived.remainingTarget)} to go</span>
          </span>
        }
      />
      <StatCard
        label="Total pipeline"
        qualifier="Unweighted, open"
        icon={<Layers />}
        value={formatCurrency(source.totalPipelineValue)}
        footer={
          <span>
            Weighted <strong className="tnum font-semibold text-ink">{formatCurrency(source.weightedPipelineValue)}</strong> · not guaranteed revenue
          </span>
        }
      />
      <StatCard
        label="Open opportunities"
        qualifier={`${source.salesRepresentatives} sales representatives`}
        icon={<Briefcase />}
        value={formatInteger(source.openOpportunities)}
        footer={
          <span>
            <strong className="tnum font-semibold text-ink">{formatPercent(source.winRate)}</strong> win rate ·{' '}
            <span className="inline-flex items-center gap-0.5 font-medium text-ok">
              <TrendingUp aria-hidden="true" className="size-3.5" />
              {formatPercentagePoints(source.winRateChangePp)}
            </span>
          </span>
        }
      />
      <StatCard
        label="Closing this month"
        qualifier="Potential value, not forecast"
        icon={<CalendarCheck />}
        value={formatCurrency(source.potentialClosingValue)}
        footer={
          <span>
            <strong className="tnum font-semibold text-ink">{formatInteger(source.dealsClosingThisMonth)} deals</strong> expected to close
          </span>
        }
      />
    </div>
  );
}
