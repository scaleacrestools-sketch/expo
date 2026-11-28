import { useEffect, useRef, useState } from 'react';

/** Tracks whether an element is in the viewport. Used to pause off-screen loops. */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '120px' }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView };
}
