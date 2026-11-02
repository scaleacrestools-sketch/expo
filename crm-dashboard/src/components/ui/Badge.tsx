import type { ReactNode } from 'react';
import { AlertTriangle, ArrowDown, CheckCircle2, Clock, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Priority, Stage, TaskStatus } from '@/types';

type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'danger' | 'info';

const toneClass: Record<Tone, string> = {
  neutral: 'bg-surface-muted text-ink-3 ring-line',
  accent: 'bg-accent-soft text-accent-strong ring-accent-ring/60',
  ok: 'bg-ok-soft text-ok ring-ok/20',
  warn: 'bg-warn-soft text-warn ring-warn/20',
  danger: 'bg-danger-soft text-danger ring-danger/20',
  info: 'bg-info-soft text-info ring-info/20',
};

const dotClass: Record<Tone, string> = {
  neutral: 'bg-ink-4',
  accent: 'bg-accent',
  ok: 'bg-ok',
  warn: 'bg-warn',
  danger: 'bg-danger',
  info: 'bg-info',
};

interface BadgeProps {
  tone?: Tone;
  icon?: ReactNode;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

/** Compact status chip. Meaning is always carried by text or an icon, never colour alone. */
export function Badge({ tone = 'neutral', icon, dot, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-xs font-medium ring-1 ring-inset',
        toneClass[tone],
        className,
      )}
    >
      {dot ? <span aria-hidden="true" className={cn('size-1.5 rounded-full', dotClass[tone])} /> : null}
      {icon ? <span aria-hidden="true" className="[&>svg]:size-3.5">{icon}</span> : null}
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { tone: Tone; icon: ReactNode }> = {
    High: { tone: 'danger', icon: <AlertTriangle /> },
    Medium: { tone: 'warn', icon: <Minus /> },
    Low: { tone: 'neutral', icon: <ArrowDown /> },
  };
  const { tone, icon } = map[priority];
  return (
    <Badge tone={tone} icon={icon}>
      {priority}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { tone: Tone; icon: ReactNode }> = {
    Overdue: { tone: 'danger', icon: <AlertTriangle /> },
    'Due soon': { tone: 'warn', icon: <Clock /> },
    Scheduled: { tone: 'info', icon: <Clock /> },
    Completed: { tone: 'ok', icon: <CheckCircle2 /> },
  };
  const { tone, icon } = map[status];
  return (
    <Badge tone={tone} icon={icon}>
      {status}
    </Badge>
  );
}

export function StageBadge({ stage }: { stage: Stage }) {
  const tone: Tone = stage === 'Won' ? 'ok' : stage === 'Lost' ? 'neutral' : 'accent';
  return (
    <Badge tone={tone} dot>
      {stage}
    </Badge>
  );
}
