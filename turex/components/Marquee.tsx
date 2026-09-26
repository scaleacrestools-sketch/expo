import type { ReactNode } from 'react';

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
};

/**
 * Content is rendered twice; the track slides -50% and loops seamlessly.
 * Pauses on hover, disabled entirely under prefers-reduced-motion.
 */
export default function Marquee({ children, duration = 40, className = '' }: MarqueeProps) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
