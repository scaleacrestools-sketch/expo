'use client';
import { useEffect, useRef, useState } from 'react';

/** Counts from 0 to `value` once in view; renders the final value immediately under reduced motion. */
export function CountUp({ value, className = '', duration = 1600 }: { value: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setN(value); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => { const p = Math.min(1, (t - t0) / duration); const eased = 1 - Math.pow(1 - p, 4); setN(Math.round(value * eased)); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref} className={className}>{n}</span>;
}
