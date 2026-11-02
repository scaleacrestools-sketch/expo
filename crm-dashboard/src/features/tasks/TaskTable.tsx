import { CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { PriorityBadge, StageBadge, StatusBadge } from '@/components/ui/Badge';
import { repById } from '@/data/demoTeams';
import { formatCurrency, formatDate } from '@/lib/format';
import { taskStatus } from '@/lib/opportunity';
import type { Opportunity } from '@/types';

interface Props {
  tasks: Opportunity[];
  todayIso: string;
  query: string;
  onQueryChange: (q: string) => void;
  onView: (id: string) => void;
  onComplete: (id: string) => void;
}

const th = 'px-3 py-2.5 text-left text-xs font-medium text-ink-3 first:pl-5 last:pr-5';

export function TaskTable({ tasks, todayIso, query, onQueryChange, onView, onComplete }: Props) {
  return (
    <Card aria-labelledby="tasks-title" data-export-group="activity-tasks" id="tasks">
      <CardHeader
        title="Activity & tasks"
        titleId="tasks-title"
        description={`${tasks.length} demo task${tasks.length === 1 ? '' : 's'} in view · sorted by priority, then due date`}
        aside={
          <>
            <label className="relative block">
              <span className="sr-only">Search tasks by opportunity or account</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-4" />
              <input
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search tasks"
                className="h-9 w-44 rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-[13px] text-ink shadow-sm placeholder:text-ink-4 sm:w-56"
              />
            </label>
            <DemoBadge label="Demo records" />
          </>
        }
      />
      {tasks.length === 0 ? (
        <p className="px-5 pb-6 text-sm text-ink-3">No demo tasks match the current filters.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Demo tasks and follow-ups</caption>
              <thead className="border-y border-line bg-surface-muted">
                <tr>
                  <th scope="col" className={`${th} w-[22%]`}>Opportunity</th>
                  <th scope="col" className={`${th} whitespace-nowrap`}>Owner</th>
                  <th scope="col" className={th}>Stage</th>
                  <th scope="col" className={th}>Priority</th>
                  <th scope="col" className={th}>Next action</th>
                  <th scope="col" className={th}>Due</th>
                  <th scope="col" className={`${th} text-right`}>Value</th>
                  <th scope="col" className={th}>Status</th>
                  <th scope="col" className={`${th} text-right`}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const status = taskStatus(task, todayIso);
                  return (
                    <tr key={task.id} className="group border-b border-line transition-colors last:border-b-0 hover:bg-surface-muted/70">
                      <th scope="row" className="py-3 pl-5 pr-3 text-left font-medium text-ink">
                        <button type="button" onClick={() => onView(task.id)} className="group/name text-left" aria-label={`Open details for ${task.name}`}>
                          <span className="block whitespace-nowrap underline-offset-2 group-hover/name:text-accent group-hover/name:underline">{task.name}</span>
                          <span className="block text-xs font-normal text-ink-4">{task.account}</span>
                        </button>
                      </th>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-2">{repById.get(task.ownerId)?.name}</td>
                      <td className="px-3 py-3"><StageBadge stage={task.stage} /></td>
                      <td className="px-3 py-3"><PriorityBadge priority={task.priority} /></td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-2">{task.nextAction}</td>
                      <td className="tnum whitespace-nowrap px-3 py-3 text-ink-2">{formatDate(task.dueDate)}</td>
                      <td className="tnum whitespace-nowrap px-3 py-3 text-right text-ink-2">{formatCurrency(task.value)}</td>
                      <td className="px-3 py-3"><StatusBadge status={status} /></td>
                      <td className="py-3 pl-3 pr-5">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="secondary" icon={<CheckCircle2 />} onClick={() => onComplete(task.id)} disabled={task.completed} aria-label={task.completed ? `${task.name} already complete` : `Mark ${task.name} complete`}>
                            {task.completed ? 'Done' : 'Complete'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 px-4 pb-4 md:grid-cols-2 lg:hidden" role="list">
            {tasks.map((task) => {
              const status = taskStatus(task, todayIso);
              return (
                <li key={task.id} className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => onView(task.id)} className="min-w-0 text-left" aria-label={`View ${task.name}`}>
                      <span className="block truncate text-sm font-semibold text-ink">{task.name}</span>
                      <span className="block truncate text-xs text-ink-4">{task.account} · {repById.get(task.ownerId)?.name}</span>
                    </button>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StageBadge stage={task.stage} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <dl className="grid grid-cols-3 gap-2 text-xs">
                    <div><dt className="text-ink-4">Next action</dt><dd className="font-medium text-ink">{task.nextAction}</dd></div>
                    <div><dt className="text-ink-4">Due</dt><dd className="tnum font-medium text-ink">{formatDate(task.dueDate)}</dd></div>
                    <div><dt className="text-ink-4">Value</dt><dd className="tnum font-medium text-ink">{formatCurrency(task.value)}</dd></div>
                  </dl>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" icon={<ChevronRight />} onClick={() => onView(task.id)} aria-label={`Open details for ${task.name}`}>
                      Open
                    </Button>
                    <Button variant="secondary" icon={<CheckCircle2 />} onClick={() => onComplete(task.id)} disabled={task.completed} aria-label={task.completed ? `${task.name} already complete` : `Mark ${task.name} complete`}>
                      {task.completed ? 'Done' : 'Complete'}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
}
