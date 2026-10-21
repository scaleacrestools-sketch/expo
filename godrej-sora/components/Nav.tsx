'use client';
import { useEffect, useState } from 'react';
import { nav } from '@/content/site';
import { CtaButton } from './ui/CtaButton';
import { Wordmark } from './Wordmark';

export function Nav({ logoSrc }: { logoSrc: string | null }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const on = () => { setSolid(window.scrollY > 40); const h = document.documentElement; setProgress(h.scrollHeight > h.clientHeight ? h.scrollTop / (h.scrollHeight - h.clientHeight) : 0); };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.classList.toggle('overlay-open', open); return () => document.body.classList.remove('overlay-open'); }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-[80] transition-[background-color,box-shadow,color] duration-700 ${solid || open ? 'bg-ivory/90 text-ink shadow-[0_1px_0_rgba(36,33,31,0.08)] backdrop-blur-md' : 'text-ivory'}`}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-gold" style={{ transform: `scaleX(${progress})`, opacity: solid ? 1 : 0, transition: 'opacity .5s' }} />
      <div className="container-sora flex h-[4.5rem] items-center justify-between md:h-20">
        <a href="#top" aria-label="Godrej Sora — home" className="flex items-center"><Wordmark logoSrc={logoSrc} light={!(solid || open)} /></a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((n) => (
              <li key={n.href}><a href={n.href} className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase opacity-85 transition-opacity hover:opacity-100">{n.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:block">
          <CtaButton magnet="siteVisit" source="nav" variant={solid ? 'primary' : 'ghost-light'} className="!min-h-11 !px-6 !text-[0.66rem]">Schedule Private Visit</CtaButton>
        </div>
        <button className="lg:hidden flex h-11 w-11 flex-col items-center justify-center gap-1.5" aria-expanded={open} aria-controls="mobile-menu" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <span className={`h-px w-6 bg-current transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-current transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="washi grain fixed inset-0 top-[4.5rem] z-[79] overflow-y-auto px-6 py-10 lg:hidden">
          <ul className="relative z-10 flex flex-col gap-6">
            {nav.map((n, i) => (
              <li key={n.href} style={{ animation: `fadeUp .6s var(--ease-sora) ${i * 60}ms both` }}>
                <a href={n.href} onClick={() => setOpen(false)} className="display block text-3xl text-ink">{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="relative z-10 mt-10"><CtaButton magnet="siteVisit" source="mobile-menu">Schedule Private Visit</CtaButton></div>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </header>
  );
}
