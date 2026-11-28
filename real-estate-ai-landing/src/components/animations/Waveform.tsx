type Props = { bars?: number; active?: boolean; className?: string; color?: string; height?: number; seed?: number };

/** CSS-animated voice waveform. Static (flattened) when inactive. */
export function Waveform({ bars = 28, active = true, className = '', color = 'var(--brand-secondary)', height = 36, seed = 1 }: Props) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} style={{ height }} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 0.35 + 0.65 * Math.abs(Math.sin((i + 1) * 1.7 * seed + i * 0.3));
        return (
          <span
            key={i}
            className={active ? 'wave-bar' : ''}
            style={{
              width: 3, borderRadius: 3, background: color,
              height: `${Math.round(h * 100)}%`,
              opacity: active ? 0.95 : 0.35,
              transform: active ? undefined : 'scaleY(0.3)',
              animationDelay: `${(i % 7) * -0.13 - (i % 3) * 0.2}s`,
              animationDuration: `${0.8 + (i % 5) * 0.12}s`,
              transition: 'opacity .3s, transform .3s',
            }}
          />
        );
      })}
    </div>
  );
}
