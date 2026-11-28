import { useState } from 'react';

type Props = { data: { label: string; value: number }[]; run: boolean; max?: number; suffix?: string; ariaLabel: string };

/** Vertical bar chart with per-bar tooltips. Bars grow in when `run` becomes true. */
export function BarChart({ data, run, max = 100, suffix = '%', ariaLabel }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div role="img" aria-label={ariaLabel} className="flex h-[150px] items-end gap-2.5 pt-6">
      {data.map((d, i) => (
        <div key={d.label} className="relative flex h-full flex-1 flex-col items-center justify-end gap-2" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          {hover === i && <span role="tooltip" className="absolute -top-1 z-10 whitespace-nowrap rounded-md border border-[var(--c-line-strong)] bg-[var(--c-card-2)] px-2 py-0.5 text-[11px] text-[var(--c-head)] shadow">{d.label}: {d.value}{suffix}</span>}
          <div className="relative w-full flex-1 overflow-hidden rounded-md bg-[var(--c-chip)]">
            <div className="absolute inset-x-0 bottom-0 rounded-md transition-[height] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ height: run ? `${(d.value / max) * 100}%` : '0%', transitionDelay: `${i * 90}ms`, background: hover === i ? 'linear-gradient(180deg,#8f6bff,#5b34d6)' : 'linear-gradient(180deg,#a48bff,#6a3ff0)' }} />
          </div>
          <span className="truncate text-[10.5px] text-[var(--c-muted)]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
