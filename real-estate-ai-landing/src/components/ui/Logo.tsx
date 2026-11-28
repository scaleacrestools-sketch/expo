import { brand } from '../../config/brand';

/** Original temporary logo mark: a waveform inside a rounded signal tile. */
export function LogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B69CFF" />
          <stop offset="1" stopColor="#5B32E0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#lm-g)" />
      <rect x="1.5" y="1.5" width="29" height="29" rx="8.5" fill="none" stroke="#fff" strokeOpacity=".25" />
      <g fill="#fff">
        <rect x="7" y="13" width="2.6" height="6" rx="1.3" opacity=".7" />
        <rect x="11.2" y="9.5" width="2.6" height="13" rx="1.3" />
        <rect x="15.4" y="6.5" width="2.6" height="19" rx="1.3" />
        <rect x="19.6" y="10.5" width="2.6" height="11" rx="1.3" />
        <rect x="23.8" y="14" width="2.6" height="4" rx="1.3" opacity=".7" />
      </g>
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-[var(--c-head)]">{brand.productName}</span>
    </span>
  );
}
