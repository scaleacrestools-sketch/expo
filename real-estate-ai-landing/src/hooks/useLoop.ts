import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Steps through 0..count-1 on an interval while `active` is true.
 * With reduced motion it jumps to `reducedIndex` (default: last step) and stays.
 */
export function useLoop(count: number, intervalMs: number, active = true, reducedIndex = count - 1) {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) { setI(reducedIndex); return; }
    if (!active) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % count), intervalMs);
    return () => window.clearInterval(t);
  }, [count, intervalMs, active, reduced, reducedIndex]);
  return [i, setI] as const;
}
