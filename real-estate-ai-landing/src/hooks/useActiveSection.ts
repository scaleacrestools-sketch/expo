import { useEffect, useState } from 'react';

/** Returns the id of the section currently crossing the upper-middle of the viewport. One observer, no scroll listener. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const seen = new Set<string>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id); });
      const current = ids.find((id) => seen.has(id)) ?? null;
      setActive(current);
    }, { rootMargin: '-35% 0px -60% 0px' });
    const observe = () => ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    observe();
    // Sections below the fold mount after first paint; observe them once they exist.
    const mo = new MutationObserver(() => observe());
    mo.observe(document.getElementById('main') ?? document.body, { childList: true });
    return () => { io.disconnect(); mo.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}
