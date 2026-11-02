import { useState, type FormEvent } from 'react';
import { ArrowRightLeft, CalendarPlus, History, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { InputField, SelectField } from '@/components/ui/Field';
import { PriorityBadge, StageBadge, StatusBadge } from '@/components/ui/Badge';
import { repById, teamById } from '@/data/demoTeams';
import { addDays, describeDue } from '@/lib/dates';
import { formatCurrency, formatDate } from '@/lib/format';
import { suggestNextActions, taskStatus } from '@/lib/opportunity';
import { STAGES, type Opportunity, type Stage } from '@/types';

type Mode = 'view' | 'schedule' | 'stage';

interface Props {
  opportunity: Opportunity | null;
  todayIso: string;
  onClose: () => void;
  onSchedule: (id: string, dueDate: string, note: string) => void;
  onUpdateStage: (id: string, stage: Stage) => void;
}

export function OpportunityDrawer({ opportunity, todayIso, onClose, onSchedule, onUpdateStage }: Props) {
  return (
    <Drawer open={opportunity !== null} onClose={onClose} titleId="opp-drawer-title" descriptionId="opp-drawer-desc">
      {opportunity ? (
        // Keyed by id so all form state resets when a different record opens.
        <OpportunityDetail key={opportunity.id} opportunity={opportunity} todayIso={todayIso} onSchedule={onSchedule} onUpdateStage={onUpdateStage} />
      ) : null}
    </Drawer>
  );
}

interface DetailProps {
  opportunity: Opportunity;
  todayIso: string;
  onSchedule: Props['onSchedule'];
  onUpdateStage: Props['onUpdateStage'];
}

function OpportunityDetail({ opportunity, todayIso, onSchedule, onUpdateStage }: DetailProps) {
  const [mode, setMode] = useState<Mode>('view');
  const [dueDate, setDueDate] = useState(() => addDays(todayIso, 2));
  const [note, setNote] = useState('');
  const [stage, setStage] = useState<Stage>(opportunity.stage);
  const [error, setError] = useState<string | undefined>();

  const owner = repById.get(opportunity.ownerId);
  const team = owner ? teamById.get(owner.teamId) : undefined;
  const overdue = taskStatus(opportunity, todayIso) === 'Overdue';

  const submitSchedule = (event: FormEvent) => {
    event.preventDefault();
    if (!dueDate) return setError('Choose a follow-up date.');
    if (dueDate < todayIso) return setError('The follow-up date cannot be before the demo date.');
    onSchedule(opportunity.id, dueDate, note.trim());
    setMode('view');
  };

  const submitStage = (event: FormEvent) => {
    event.preventDefault();
    if (stage === opportunity.stage) return setError(`Already in ${stage}. Choose a different stage.`);
    onUpdateStage(opportunity.id, stage);
    setMode('view');
  };

  const openForm = (next: Mode) => {
    setError(undefined);
    setMode(next);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <header className="border-b border-line px-6 pb-5 pt-5 pr-14">
          <DemoBadge label="Illustrative fictional opportunity" />
          <h2 id="opp-drawer-title" className="mt-3 text-xl font-semibold leading-7 tracking-[-0.01em] text-ink">
            {opportunity.name}
          </h2>
          <p id="opp-drawer-desc" className="mt-1 text-sm text-ink-3">
            {opportunity.account} · <span className={overdue ? 'font-semibold text-danger' : 'text-ink-2'}>{describeDue(opportunity.dueDate, todayIso)}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <StageBadge stage={opportunity.stage} />
            <PriorityBadge priority={opportunity.priority} />
            <StatusBadge status={taskStatus(opportunity, todayIso)} />
          </div>
        </header>

        <div className="flex flex-col gap-6 px-6 py-5">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-ink-4">Owner</dt>
              <dd className="mt-0.5 font-medium text-ink">{owner?.name ?? 'Unassigned'}</dd>
              <dd className="text-xs text-ink-4">{team?.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-4">Deal value (unweighted)</dt>
              <dd className="tnum mt-0.5 font-medium text-ink">{formatCurrency(opportunity.value)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-4">Stage</dt>
              <dd className="mt-0.5 font-medium text-ink">{opportunity.stage}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-4">Follow-up due</dt>
              <dd className="tnum mt-0.5 font-medium text-ink">{formatDate(opportunity.dueDate)}</dd>
              <dd className="text-xs text-ink-4">Next: {opportunity.nextAction}</dd>
            </div>
          </dl>

          <section aria-labelledby="opp-risk" className="rounded-lg border-l-[3px] border-danger bg-danger-soft px-4 py-3">
            <h3 id="opp-risk" className="text-xs font-semibold uppercase tracking-wide text-danger">Risk context</h3>
            <p className="mt-1 text-sm leading-5 text-ink">{opportunity.riskContext}</p>
          </section>

          <section aria-labelledby="opp-suggest">
            <h3 id="opp-suggest" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <Lightbulb aria-hidden="true" className="size-4 text-warn" /> Suggested next actions
            </h3>
            <ol className="mt-2 flex flex-col gap-1.5 text-sm text-ink-2">
              {suggestNextActions(opportunity, todayIso).map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true" className="tnum flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-semibold text-ink-3">{i + 1}</span>
                  <span className="leading-5">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {mode === 'schedule' ? (
            <form onSubmit={submitSchedule} className="flex flex-col gap-3 rounded-lg border border-accent-ring bg-accent-soft/60 p-4" aria-labelledby="schedule-title">
              <h3 id="schedule-title" className="text-sm font-semibold text-ink">Schedule follow-up</h3>
              <InputField id="schedule-date" label="Follow-up date" type="date" value={dueDate} min={todayIso} onChange={(e) => { setDueDate(e.target.value); setError(undefined); }} error={error} hint={`Demo date is ${formatDate(todayIso)}`} data-autofocus required />
              <InputField id="schedule-note" label="Note (optional)" type="text" value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Confirm revised pricing with procurement" />
              <div className="grid grid-cols-2 gap-2">
                <Button type="submit" variant="primary">Confirm follow-up</Button>
                <Button variant="secondary" onClick={() => setMode('view')}>Cancel</Button>
              </div>
            </form>
          ) : null}

          {mode === 'stage' ? (
            <form onSubmit={submitStage} className="flex flex-col gap-3 rounded-lg border border-accent-ring bg-accent-soft/60 p-4" aria-labelledby="stage-title">
              <h3 id="stage-title" className="text-sm font-semibold text-ink">Update stage</h3>
              <SelectField id="stage-select" label="New stage" value={stage} onChange={(e) => { setStage(e.target.value as Stage); setError(undefined); }} data-autofocus>
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}{s === opportunity.stage ? ' (current)' : ''}</option>
                ))}
              </SelectField>
              {error ? <p role="alert" className="text-xs font-medium text-danger">{error}</p> : null}
              <div className="grid grid-cols-2 gap-2">
                <Button type="submit" variant="primary">Confirm stage</Button>
                <Button variant="secondary" onClick={() => setMode('view')}>Cancel</Button>
              </div>
            </form>
          ) : null}

          <section aria-labelledby="opp-activity">
            <h3 id="opp-activity" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <History aria-hidden="true" className="size-4 text-ink-4" /> Recent activity
            </h3>
            {opportunity.activity.length === 0 ? (
              <p className="mt-2 text-sm text-ink-3">No activity recorded for this demo record.</p>
            ) : (
              <ol className="mt-3 flex flex-col gap-3">
                {opportunity.activity.map((entry) => (
                  <li key={entry.id} className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:size-2 before:rounded-full before:bg-line-strong">
                    <time dateTime={entry.date} className="tnum block text-xs text-ink-4">{formatDate(entry.date)}</time>
                    <span className="text-sm leading-5 text-ink-2">{entry.summary}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>

      {mode === 'view' ? (
        <div className="grid grid-cols-2 gap-2 border-t border-line bg-surface px-6 py-4" data-export-group="drawer-actions">
          <Button variant="primary" icon={<CalendarPlus />} onClick={() => openForm('schedule')} data-autofocus>
            Schedule follow-up
          </Button>
          <Button variant="secondary" icon={<ArrowRightLeft />} onClick={() => openForm('stage')}>
            Update stage
          </Button>
        </div>
      ) : null}
    </>
  );
}
