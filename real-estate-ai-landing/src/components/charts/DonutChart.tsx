import { useState } from 'react';

type Props = { data: { label: string; value: number; color: string }[]; run: boolean; ariaLabel: string };

export function DonutChart({ data, run, ariaLabel }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.value, 0);
  const R = 40, C = 2 * Math.PI * R;
  let acc = 0;
  const active = hover ?? 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[120px] w-[120px] flex-none">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={ariaLabel}>
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--c-chip)" strokeWidth="12" />
          {data.map((d, i) => {
            const len = (d.value / total) * C; const off = acc; acc += len;
            return (
              <circle key={d.label} cx="50" cy="50" r={R} fill="none" stroke={d.color} strokeWidth={hover === i ? 15 : 12}
                strokeDasharray={`${run ? Math.max(0, len - 1.5) : 0} ${C}`} strokeDashoffset={-off}
                style={{ transition: `stroke-dasharray 1.1s cubic-bezier(.22,1,.36,1) ${i * 120}ms, stroke-width .2s` }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} tabIndex={0} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
                <title>{`${d.label}: ${d.value}%`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div><p className="text-[20px] font-semibold tabular-nums text-[var(--c-head)]">{data[active].value}%</p><p className="text-[10px] text-[var(--c-muted)]">{data[active].label}</p></div>
        </div>
      </div>
      <ul className="grid flex-1 gap-1.5">
        {data.map((d, i) => (
          <li key={d.label} className={`flex items-center justify-between gap-2 rounded-md px-1.5 py-0.5 text-[11.5px] transition ${hover === i ? 'bg-[var(--c-chip)]' : ''}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="flex items-center gap-2 text-[var(--c-text)]"><span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />{d.label}</span>
            <span className="tabular-nums text-[var(--c-head)]">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
