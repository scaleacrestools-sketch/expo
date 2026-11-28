import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether an element is in the viewport.
 * `inView` toggles (use it to pause loops off-screen); `seen` latches true after the first
 * intersection (use it for one-time reveal animations so content never hides again).
 */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '120px' }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) setSeen(true); }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView, seen };
}
