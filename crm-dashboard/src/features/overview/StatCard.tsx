import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: string;
  /** Short qualifier rendered next to the label, e.g. "Unweighted". */
  qualifier?: string;
  icon: ReactNode;
  /** Secondary line under the value. */
  footer?: ReactNode;
  /** Optional visual (progress bar etc.) between value and footer. */
  visual?: ReactNode;
  tone?: 'default' | 'accent';
}

export function StatCard({ label, value, qualifier, icon, footer, visual, tone = 'default' }: StatCardProps) {
  return (
    <article
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-xl border bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]',
        tone === 'accent' ? 'border-accent-ring/70' : 'border-line',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-5 text-ink-3">{label}</p>
          {qualifier ? <p className="text-xs leading-4 text-ink-4">{qualifier}</p> : null}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg [&>svg]:size-[18px]',
            tone === 'accent' ? 'bg-accent text-white' : 'bg-accent-soft text-accent',
          )}
        >
          {icon}
        </span>
      </div>
      <p className="tnum text-[28px] font-semibold leading-8 tracking-[-0.02em] text-ink">{value}</p>
      {visual}
      {footer ? <div className="text-[13px] leading-5 text-ink-3">{footer}</div> : null}
    </article>
  );
}
