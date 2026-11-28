import { useId, useState } from 'react';

type Series = { key: string; label: string; color: string; values: number[] };
type Props = { labels: string[]; series: Series[]; height?: number; animate?: boolean; showAxis?: boolean; className?: string; ariaLabel: string };

/** Lightweight responsive SVG line/area chart with hover tooltip. */
export function LineChart({ labels, series, height = 180, animate = true, showAxis = true, className = '', ariaLabel }: Props) {
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const W = 600, H = height, padL = showAxis ? 34 : 6, padR = 8, padT = 10, padB = showAxis ? 22 : 6;
  const max = Math.max(...series.flatMap((s) => s.values)) * 1.12;
  const x = (i: number) => padL + (i * (W - padL - padR)) / (labels.length - 1);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);
  const path = (vals: number[]) => vals.map((v, i) => {
    if (i === 0) return `M${x(0)},${y(v)}`;
    const cx = (x(i - 1) + x(i)) / 2;
    return `C${cx},${y(vals[i - 1])} ${cx},${y(v)} ${x(i)},${y(v)}`;
  }).join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round((max / 1.12) * t));

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={ariaLabel} preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - padL) / (W - padL - padR)) * (labels.length - 1));
          setHover(Math.max(0, Math.min(labels.length - 1, i)));
        }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.32" /><stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {showAxis && ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--c-line)" strokeDasharray="3 4" />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--c-muted)">{t}</text>
          </g>
        ))}
        {showAxis && labels.map((l, i) => <text key={l + i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--c-muted)">{l}</text>)}
        {series.map((s, si) => (
          <g key={s.key}>
            <path d={`${path(s.values)} L${x(s.values.length - 1)},${H - padB} L${x(0)},${H - padB} Z`} fill={`url(#${id}-${s.key})`} opacity={si === 0 ? 1 : 0.6} />
            <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke"
              pathLength={1} style={animate ? { strokeDasharray: 1, strokeDashoffset: 0, animation: 'chart-draw 1.6s cubic-bezier(.22,1,.36,1) both' } : undefined} />
          </g>
        ))}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="var(--c-line-strong)" />
            {series.map((s) => <circle key={s.key} cx={x(hover)} cy={y(s.values[hover])} r={4} fill={s.color} stroke="var(--c-card)" strokeWidth={2} />)}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div role="tooltip" className="pointer-events-none absolute top-1 z-10 rounded-lg border border-[var(--c-line-strong)] bg-[var(--c-card)] px-2.5 py-1.5 text-[11px] shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > labels.length / 2 ? '-110%' : '10%'})` }}>
          <p className="font-medium text-[var(--c-head)]">{labels[hover]}</p>
          {series.map((s) => <p key={s.key} className="flex items-center gap-1.5 text-[var(--c-text)]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />{s.label}: <b className="tabular-nums text-[var(--c-head)]">{s.values[hover]}</b></p>)}
        </div>
      )}
    </div>
  );
}
