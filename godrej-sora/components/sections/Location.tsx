import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { CtaButton } from '@/components/ui/CtaButton';

export function Location({ map }: { map: ResolvedAsset }) {
  const loc = project.location;
  return (
    <section id="location" className="washi grain relative py-[var(--section-y)]">
      <div className="container-sora grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading index="11" eyebrow="Location advantage" title={<>An Extraordinary<br /><em>Address.</em></>}>
            Sector 53, Gurugram: a prime residential and commercial hub with abundant green zones, steps from Golf Course Road, where prosperity touches the sky. Near everything you need under the sky.
          </SectionHeading>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {loc.groups.map((g, gi) => (
              <Reveal key={g.category} className="reveal" delay={gi * 60}>
                <h3 className="text-[0.66rem] font-semibold tracking-[0.26em] uppercase text-sora-red">{g.category}</h3>
                <ul className="mt-3 divide-y divide-sand">
                  {g.items.map((it) => (
                    <li key={it.name} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                      <span className="text-ink">{it.name}</span>
                      <span className="shrink-0 tabular-nums text-ink-mute">{it.km != null ? `${it.km} km · ${it.min} min` : ('note' in it ? 'On map' : '')}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <p className="fine mt-8 max-w-xl">{loc.caveat}</p>
          <div className="mt-8"><CtaButton magnet="locationGuide" source="location">Request Location Guide</CtaButton></div>
        </div>
        <Reveal className="img-reveal self-start lg:sticky lg:top-24">
          <div className="relative aspect-[4/4.4] overflow-hidden border border-sand bg-ivory-soft">
            <SoraImage asset={map} className="h-full w-full" sizes="(min-width:1024px) 50vw, 100vw" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="relative block h-4 w-4 rounded-full bg-sora-red shadow-[0_0_0_6px_rgba(189,30,45,0.18)]"><span className="absolute inset-0 animate-ping rounded-full bg-sora-red/50" /></span>
              <span className="mt-3 block whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[0.6rem] tracking-[0.2em] uppercase text-ivory">Godrej Sora · Sector 53</span>
            </div>
          </div>
          <p className="fine mt-3">Map is indicative and not to scale. Replace with the brochure location map once approved.</p>
        </Reveal>
      </div>
    </section>
  );
}
