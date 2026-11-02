import { useId, useState } from 'react';
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InputField, SelectField } from '@/components/ui/Field';
import { demoReps, demoTeams } from '@/data/demoTeams';
import { cn } from '@/lib/cn';
import { DATE_PRESET_LABELS, DEFAULT_FILTERS, isFilterActive } from '@/lib/filters';
import { STAGES, type DateRangePreset, type Filters, type Stage } from '@/types';

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  matchCount: number;
}

/** Toolbar-style global filters. Collapsible below 1024px. */
export function GlobalFilters({ filters, onChange, matchCount }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const active = isFilterActive(filters);
  const repsInTeam = filters.teamId === 'all' ? demoReps : demoReps.filter((r) => r.teamId === filters.teamId);
  const patch = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]" data-export-group="global-filters">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5">
        <h2 id={`${id}-title`} className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal aria-hidden="true" className="size-4 text-ink-3" />
          Filters
          <span className="truncate text-[13px] font-normal text-ink-4">
            <span className="tnum">{matchCount}</span> demo records match
          </span>
          {active ? <span className="hidden rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-accent-strong sm:inline">Active</span> : null}
        </h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={() => onChange(DEFAULT_FILTERS)} disabled={!active}>
            Reset
          </Button>
          <Button size="sm" variant="subtle" className="lg:hidden" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen((v) => !v)} icon={<ChevronDown className={cn('transition-transform', open && 'rotate-180')} />}>
            {open ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
      <div id={`${id}-panel`} className={cn('border-t border-line px-4 py-4 lg:px-5', open ? 'block' : 'hidden lg:block')}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField id={`${id}-date`} label="Date range (due date)" value={filters.datePreset} onChange={(e) => patch({ datePreset: e.target.value as DateRangePreset })}>
            {(Object.keys(DATE_PRESET_LABELS) as DateRangePreset[]).map((key) => (
              <option key={key} value={key}>{DATE_PRESET_LABELS[key]}</option>
            ))}
          </SelectField>
          <SelectField
            id={`${id}-team`}
            label="Team"
            value={filters.teamId}
            onChange={(e) => {
              const teamId = e.target.value;
              const repStillValid = teamId === 'all' || demoReps.some((r) => r.id === filters.repId && r.teamId === teamId);
              patch({ teamId, repId: repStillValid ? filters.repId : 'all' });
            }}
          >
            <option value="all">All teams</option>
            {demoTeams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </SelectField>
          <SelectField id={`${id}-rep`} label="Sales representative" value={filters.repId} onChange={(e) => patch({ repId: e.target.value })}>
            <option value="all">All representatives</option>
            {repsInTeam.map((rep) => (
              <option key={rep.id} value={rep.id}>{rep.name}</option>
            ))}
          </SelectField>
          <SelectField id={`${id}-stage`} label="Deal stage" value={filters.stage} onChange={(e) => patch({ stage: e.target.value as Stage | 'all' })}>
            <option value="all">All stages</option>
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </SelectField>
          {filters.datePreset === 'custom' ? (
            <div className="grid grid-cols-2 gap-3 sm:col-span-2">
              <InputField id={`${id}-from`} label="From" type="date" value={filters.customRange.from ?? ''} onChange={(e) => patch({ customRange: { ...filters.customRange, from: e.target.value || null } })} />
              <InputField id={`${id}-to`} label="To" type="date" value={filters.customRange.to ?? ''} onChange={(e) => patch({ customRange: { ...filters.customRange, to: e.target.value || null } })} />
            </div>
          ) : null}
        </div>
        <p className="mt-3 text-xs leading-4 text-ink-4">Filters act on illustrative demo records only. Supplied global metrics stay team-wide.</p>
      </div>
    </section>
  );
}
