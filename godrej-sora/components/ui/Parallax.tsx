'use client';
import { useRef, type ReactNode } from 'react';
import { useGsap } from '@/lib/useGsap';

/** Light vertical parallax for an image block. speed 0.1–0.3. No-op under reduced motion. */
export function Parallax({ children, speed = 0.18, className = '' }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(({ gsap, reduced }) => {
    if (reduced || !ref.current) return;
    const inner = ref.current.firstElementChild as HTMLElement | null;
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -speed * 50 }, { yPercent: speed * 50, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="h-full w-full will-change-transform" style={{ transform: 'scale(1.12)' }}>{children}</div>
    </div>
  );
}
