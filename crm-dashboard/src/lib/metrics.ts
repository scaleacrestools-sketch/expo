import type { DerivedMetrics, SourceMetrics } from '@/types';

/**
 * The only derivations the brief validates. Everything else on the dashboard is either a
 * supplied figure or explicitly labelled demo data.
 */
export function deriveMetrics(source: SourceMetrics): DerivedMetrics {
  const quarterlyAchievementPct = Math.round((source.achievedRevenue / source.quarterlyTarget) * 100);
  const remainingTarget = source.quarterlyTarget - source.achievedRevenue;
  return {
    quarterlyAchievementPct,
    remainingTarget,
    unachievedPct: 100 - quarterlyAchievementPct,
  };
}
