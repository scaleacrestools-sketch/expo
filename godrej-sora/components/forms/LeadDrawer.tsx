'use client';
import { useEffect, useRef } from 'react';
import { leadMagnets } from '@/content/leads';
import { useLeadDrawer } from './LeadDrawerContext';
import { LeadForm } from './LeadForm';
import { SunRays } from '@/components/ui/motifs';

export function LeadDrawer() {
  const { magnet, source, close } = useLeadDrawer();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!magnet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    panel.current?.querySelector<HTMLElement>('input, button')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [magnet, close]);
  if (!magnet) return null;
  const def = leadMagnets[magnet];
  return (
    <div className="fixed inset-0 z-[90] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button className="backdrop absolute inset-0" aria-label="Close" onClick={close} />
      <div ref={panel} className="washi grain relative h-full w-full max-w-lg overflow-y-auto px-6 py-8 shadow-2xl md:px-12 md:py-12" style={{ animation: 'drawer .6s var(--ease-sora)' }}>
        <style>{`@keyframes drawer{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}`}</style>
        <div className="relative z-10">
          <div className="mb-8 flex items-start justify-between">
            <SunRays className="h-10 w-10 text-sora-red" />
            <button onClick={close} className="btn btn-ghost !min-h-10 !px-4 !text-[0.65rem]">Close</button>
          </div>
          <p className="eyebrow mb-3">Private enquiry</p>
          <h2 id="drawer-title" className="display mb-3 text-3xl">{def.title}</h2>
          <p className="lede mb-8 !text-base">{def.intro}</p>
          <LeadForm magnet={magnet} source={source} />
        </div>
      </div>
    </div>
  );
}
