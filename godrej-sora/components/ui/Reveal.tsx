'use client';
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/** Adds `.is-in` when the element enters the viewport. Works with .reveal, .reveal-mask, .img-reveal, .img-scale, .ink-reveal */
export function Reveal({
  as: Tag = 'div',
  className = '',
  children,
  delay = 0,
  once = true,
  ...rest
}: { as?: ElementType; className?: string; children?: ReactNode; delay?: number; once?: boolean } & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { el.classList.add('is-in'); return; }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.style.transitionDelay = delay ? `${delay}ms` : '';
            el.classList.add('is-in');
            if (once) io.unobserve(el);
          } else if (!once) el.classList.remove('is-in');
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, once]);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
