import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  valueText: string;
  size?: 'sm' | 'md';
  className?: string;
}

/** Accessible meter; the fill is decorative and the value is exposed via aria-valuetext. */
export function ProgressBar({ value, max, label, valueText, size = 'md', className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText}
      className={cn('w-full overflow-hidden rounded-full bg-chart-pipeline', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}
    >
      <div className="h-full rounded-full bg-chart-actual transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
