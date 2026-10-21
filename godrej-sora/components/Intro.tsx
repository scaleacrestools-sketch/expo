'use client';
import { useEffect, useState } from 'react';

/** 1.4s sunrise intro on first visit per session. Pointer-events: none throughout, so it never blocks interaction or tests. */
export function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem('sora.intro') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      sessionStorage.setItem('sora.intro', '1');
      setShow(true);
      const t = setTimeout(() => setShow(false), 1700);
      return () => clearTimeout(t);
    } catch {}
  }, []);
  if (!show) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ivory" style={{ animation: 'introFade 1.7s var(--ease-sora) forwards' }}>
      <div className="relative h-40 w-40 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-sora-red" style={{ animation: 'sunrise 1.2s var(--ease-sora) forwards' }} />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-ink/30" />
      </div>
      <p className="absolute bottom-[38%] text-[0.6rem] tracking-[0.42em] uppercase text-ink/70" style={{ animation: 'introText 1.2s var(--ease-sora) .3s both' }}>Godrej Sora</p>
      <style>{`@keyframes sunrise{from{transform:translate(-50%,40%)}to{transform:translate(-50%,-50%)}}@keyframes introText{from{opacity:0;letter-spacing:.6em}to{opacity:1;letter-spacing:.42em}}@keyframes introFade{0%,70%{opacity:1}100%{opacity:0;visibility:hidden}}`}</style>
    </div>
  );
}
