import { useId, useState } from 'react';

type Series = { key: string; label: string; color: string; values: number[] };
type Props = { labels: string[]; series: Series[]; height?: number; animate?: boolean; showAxis?: boolean; className?: string; ariaLabel: string; /** Render at this pixel height regardless of width (axis labels stay crisp HTML). */ fixedHeight?: number; /** Show every nth x label. */ labelEvery?: number };

/** Lightweight responsive SVG line/area chart with hover tooltip. */
export function LineChart({ labels, series, height = 180, animate = true, showAxis = true, className = '', ariaLabel, fixedHeight, labelEvery = 1 }: Props) {
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const W = 600, H = height, padL = 4, padR = 4, padT = 10, padB = 6;
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
    <div className={`relative ${showAxis ? 'pb-[18px] pl-7' : ''} ${className}`}>
      {showAxis && (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[18px] left-0 top-0 w-6 text-right text-[10px] tabular-nums leading-none text-[var(--c-muted)]">
          {ticks.map((t) => <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(y(t) / H) * 100}%` }}>{t}</span>)}
        </div>
      )}
      {showAxis && (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-7 right-0 h-[14px] text-[10px] leading-none text-[var(--c-muted)]">
          {labels.map((l, i) => i % labelEvery === 0 && <span key={l + i} className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap" style={{ left: `${(x(i) / W) * 100}%`, transform: i === 0 ? 'none' : i === labels.length - 1 ? 'translateX(-100%)' : undefined }}>{l}</span>)}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className={`block w-full ${fixedHeight ? '' : 'h-auto'}`} style={fixedHeight ? { height: fixedHeight } : undefined} role="img" aria-label={ariaLabel} preserveAspectRatio="none"
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
          <line key={t} x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--c-line)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        ))}
        {series.map((s, si) => (
          <g key={s.key}>
            <path d={`${path(s.values)} L${x(s.values.length - 1)},${H - padB} L${x(0)},${H - padB} Z`} fill={`url(#${id}-${s.key})`} opacity={si === 0 ? 1 : 0.6} />
            <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke"
              pathLength={1} style={animate ? { strokeDasharray: 1, strokeDashoffset: 0, animation: 'chart-draw 1.6s cubic-bezier(.22,1,.36,1) both' } : undefined} />
          </g>
        ))}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="var(--c-line-strong)" vectorEffect="non-scaling-stroke" />

          </g>
        )}
      </svg>
      {hover !== null && series.map((sr) => (
        <span key={sr.key} aria-hidden="true" className="pointer-events-none absolute z-[1] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ background: sr.color, left: `calc(${showAxis ? '28px + ' : ''}(100% - ${showAxis ? 28 : 0}px) * ${x(hover) / W})`, top: `calc((100% - ${showAxis ? 18 : 0}px) * ${y(sr.values[hover]) / H})` }} />
      ))}
      {hover !== null && (
        <div role="tooltip" className="pointer-events-none absolute top-1 z-10 whitespace-nowrap rounded-lg border border-[var(--c-line-strong)] bg-[var(--c-card-2)] px-2.5 py-1.5 text-[11px] shadow-lg"
          style={{ left: `calc(${showAxis ? '28px + ' : ''}(100% - ${showAxis ? 28 : 0}px) * ${x(hover) / W})`, transform: `translateX(${hover > labels.length / 2 ? '-110%' : '10%'})` }}>
          <p className="font-medium text-[var(--c-head)]">{labels[hover]}</p>
          {series.map((s) => <p key={s.key} className="flex items-center gap-1.5 text-[var(--c-text)]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />{s.label}: <b className="tabular-nums text-[var(--c-head)]">{s.values[hover]}</b></p>)}
        </div>
      )}
    </div>
  );
}
