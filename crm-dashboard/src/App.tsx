import { useCallback, useMemo, useState } from 'react';
import { BottomNav, Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ToastViewport } from '@/components/ui/Toast';
import { DEMO_TODAY, sourceMetrics } from '@/data/sourceMetrics';
import { demoReps } from '@/data/demoTeams';
import { GlobalFilters } from '@/features/filters/GlobalFilters';
import { OverdueFollowUps } from '@/features/followups/OverdueFollowUps';
import { OpportunityDrawer } from '@/features/opportunity/OpportunityDrawer';
import { KpiStrip } from '@/features/overview/KpiStrip';
import { TargetCard } from '@/features/overview/TargetCard';
import { PipelineByStage } from '@/features/pipeline/PipelineByStage';
import { TaskTable } from '@/features/tasks/TaskTable';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useToast } from '@/hooks/useToast';
import { applyFilters, DEFAULT_FILTERS, isFilterActive } from '@/lib/filters';
import { formatDate } from '@/lib/format';
import { deriveMetrics } from '@/lib/metrics';
import { isAtRisk, sortByUrgency } from '@/lib/opportunity';
import type { Filters, Stage } from '@/types';

export default function App() {
  const todayIso = DEMO_TODAY;
  const derived = useMemo(() => deriveMetrics(sourceMetrics), []);
  const { opportunities, scheduleFollowUp, updateStage, completeTask, reset } = useOpportunities(todayIso);
  const { toasts, notify, dismiss } = useToast();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('overview');
  const isMobile = useMediaQuery('(max-width: 639px)');

  const filtered = useMemo(() => applyFilters(opportunities, filters, demoReps, todayIso), [opportunities, filters, todayIso]);
  const atRisk = useMemo(() => sortByUrgency(filtered.filter((o) => isAtRisk(o, todayIso)), todayIso), [filtered, todayIso]);
  const tasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? filtered.filter((o) => `${o.name} ${o.account}`.toLowerCase().includes(q)) : filtered;
    return sortByUrgency(list, todayIso);
  }, [filtered, query, todayIso]);
  const selected = useMemo(() => opportunities.find((o) => o.id === selectedId) ?? null, [opportunities, selectedId]);

  const closeDrawer = useCallback(() => setSelectedId(null), []);

  const handleSchedule = (id: string, dueDate: string, note: string) => {
    const opp = opportunities.find((o) => o.id === id);
    scheduleFollowUp(id, dueDate, note);
    notify('success', 'Follow-up scheduled', `${opp?.name ?? 'Opportunity'} is now due ${formatDate(dueDate)}.`);
  };

  const handleStage = (id: string, stage: Stage) => {
    const opp = opportunities.find((o) => o.id === id);
    updateStage(id, stage);
    notify('success', 'Stage updated', `${opp?.name ?? 'Opportunity'} moved from ${opp?.stage} to ${stage}.`);
  };

  const handleComplete = (id: string) => {
    const opp = opportunities.find((o) => o.id === id);
    if (!opp || opp.completed) {
      notify('error', 'Nothing to complete', 'This demo task is already marked complete.');
      return;
    }
    completeTask(id);
    notify('success', 'Task completed', `${opp.nextAction} for ${opp.name} marked complete.`);
  };

  const handleReset = () => {
    reset();
    setFilters(DEFAULT_FILTERS);
    setQuery('');
    setSelectedId(null);
    notify('info', 'Demo data reset', 'All illustrative records restored to their defaults.');
  };

  const kpis = <KpiStrip source={sourceMetrics} derived={derived} />;
  const target = <TargetCard source={sourceMetrics} derived={derived} filtersActive={isFilterActive(filters)} />;
  const followUps = <OverdueFollowUps source={sourceMetrics} atRisk={atRisk} todayIso={todayIso} onSelect={setSelectedId} />;
  const filterBar = <GlobalFilters filters={filters} onChange={setFilters} matchCount={filtered.length} />;
  const pipeline = <PipelineByStage opportunities={filtered} />;
  const taskTable = <TaskTable tasks={tasks} todayIso={todayIso} query={query} onQueryChange={setQuery} onView={setSelectedId} onComplete={handleComplete} />;

  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow-[var(--shadow-pop)]">
        Skip to dashboard
      </a>
      <Sidebar activeId={activeNav} onNavigate={setActiveNav} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar todayIso={todayIso} onReset={handleReset} />
        <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:pb-8 xl:px-8">
          {isMobile ? (
            <>
              {followUps}
              {kpis}
              {filterBar}
              {taskTable}
              {target}
              {pipeline}
            </>
          ) : (
            <>
              {filterBar}
              {kpis}
              <div className="grid gap-5 xl:grid-cols-12">
                <div className="flex flex-col gap-5 xl:col-span-7">
                  {target}
                  {pipeline}
                </div>
                <div className="xl:col-span-5">{followUps}</div>
              </div>
              {taskTable}
            </>
          )}
          <footer className="pt-2 text-center text-xs leading-4 text-ink-4">
            Supplied metrics are shown exactly as provided. All opportunity, task, owner and stage-level records are fictional illustrative demo data. AI-assisted practice prototype; not an assessment submission.
          </footer>
        </main>
      </div>
      <BottomNav activeId={activeNav} onNavigate={setActiveNav} />
      <OpportunityDrawer opportunity={selected} todayIso={todayIso} onClose={closeDrawer} onSchedule={handleSchedule} onUpdateStage={handleStage} />
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
