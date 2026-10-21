'use client';
import { useState } from 'react';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { CtaButton } from '@/components/ui/CtaButton';
import { Lightbox } from '@/components/ui/Lightbox';
import { track } from '@/lib/analytics';

export function Plans({ items }: { items: ResolvedAsset[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="plans" className="relative bg-ivory py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="13" eyebrow="Master plan & floor plans" title={<>Space, Beautifully<br /><em>Considered.</em></>}>
          Official plans as published by the developer. Tap any plan to study it at full size; the download delivers the complete set.
        </SectionHeading>
        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {items.map((p, i) => (
            <li key={p.id}>
              <button type="button" onClick={() => { setOpen(i); track('plan_zoom', { plan: p.id }); }} className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-gold" aria-label={`Open ${p.title} at full size`}>
                <div className="relative aspect-[4/3] overflow-hidden border border-sand bg-ivory-soft">
                  <SoraImage asset={p} className="h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-sora)] group-hover:scale-[1.03]" sizes="(min-width:768px) 33vw, 100vw" caption />
                  <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[0.6rem] tracking-[0.2em] uppercase text-ivory">Zoom</span>
                </div>
                <h3 className="mt-4 text-base font-medium">{p.title}</h3>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <CtaButton magnet="floorPlans" source="plans">Download Floor Plans</CtaButton>
          <CtaButton magnet="presentation" source="plans" variant="ghost">Request Private Consultation</CtaButton>
        </div>
        <p className="fine mt-6 max-w-2xl">Plans are indicative, not to scale, and subject to change as per the sanctioned drawings and the Agreement for Sale.</p>
      </div>
      {open !== null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} zoomable />}
    </section>
  );
}
