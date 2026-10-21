'use client';
import { useState } from 'react';
import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { CtaButton } from '@/components/ui/CtaButton';
import { track } from '@/lib/analytics';

export function Collection({ plans }: { plans: Record<string, ResolvedAsset> }) {
  const cfgs = project.configurations;
  const [active, setActive] = useState(cfgs[0].id);
  const c = cfgs.find((x) => x.id === active)!;
  const plan = plans[c.floorPlan];
  return (
    <section id="collection" className="relative bg-ivory-soft py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="12" eyebrow="The residence collection" title={<>Discover Your Place<br /><em>in the Sun.</em></>}>
          Configurations currently confirmed on the official project page. Areas, pricing and payment plans are issued with the cost sheet and may change.
        </SectionHeading>
        <div role="tablist" aria-label="Residence configurations" className="mt-12 flex flex-wrap gap-2 border-b border-sand">
          {cfgs.map((x) => (
            <button key={x.id} role="tab" id={`tab-${x.id}`} aria-selected={active === x.id} aria-controls={`panel-${x.id}`} onClick={() => { setActive(x.id); track('configuration_view', { configuration: x.label }); }}
              className={`-mb-px border-b-2 px-5 py-4 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-colors ${active === x.id ? 'border-sora-red text-ink' : 'border-transparent text-ink-mute hover:text-ink'}`}>
              {x.label}
            </button>
          ))}
        </div>
        <div id={`panel-${c.id}`} role="tabpanel" aria-labelledby={`tab-${c.id}`} className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden border border-sand bg-ivory">
            <SoraImage asset={plan} className="h-full w-full" sizes="(min-width:1024px) 55vw, 100vw" caption />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="display text-3xl md:text-4xl">{c.headline}</h3>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-sand py-6">
              <div><dt className="text-[0.62rem] tracking-[0.26em] uppercase text-ink-mute">Area</dt><dd className="mt-1 text-lg">{c.area.value}</dd></div>
              <div><dt className="text-[0.62rem] tracking-[0.26em] uppercase text-ink-mute">Price</dt><dd className="mt-1 text-lg">{c.price.value}</dd></div>
            </dl>
            <ul className="mt-6 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
              {c.highlights.map((h) => <li key={h} className="flex items-center gap-3"><span className="h-px w-5 bg-sora-red" />{h}</li>)}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton magnet="priceSheet" source={`collection-${c.id}`}>Request Detailed Cost Sheet</CtaButton>
              <CtaButton magnet="floorPlans" source={`collection-${c.id}`} variant="ghost">Enquire About This Residence</CtaButton>
            </div>
            <p className="fine mt-6">{project.disclaimers.pricing}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
