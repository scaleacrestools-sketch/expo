import { CalendarDays, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/format';

interface TopBarProps {
  todayIso: string;
  onReset: () => void;
}

export function TopBar({ todayIso, onReset }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur" data-export-group="top-bar">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 xl:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold leading-6 text-ink sm:text-lg">Sales &amp; Customer Pipeline</h1>
          <p className="truncate text-xs text-ink-4">Sales Manager view · 8 representatives</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg border border-line bg-surface-muted px-2.5 py-1.5 text-xs font-medium text-ink-3 md:inline-flex">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            Demo date {formatDate(todayIso)}
          </span>
          <span className="hidden rounded-lg bg-warn-soft px-2.5 py-1.5 text-xs font-semibold text-warn lg:inline">AI-assisted practice prototype</span>
          <Button size="sm" variant="secondary" icon={<RotateCcw />} onClick={onReset}>
            <span className="hidden sm:inline">Reset demo data</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
