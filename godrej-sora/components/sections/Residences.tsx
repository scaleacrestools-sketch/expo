import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { CtaButton } from '@/components/ui/CtaButton';

export function Residences({ images }: { images: ResolvedAsset[] }) {
  const f = project.residenceFeatures;
  const [a, b, c] = images;
  return (
    <section id="residences" className="relative bg-ivory-soft py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="05" eyebrow="Exclusive residences" title={<>A World of<br /><em>Your Own.</em></>}>
          Every Sora residence is drawn around two ideas: privacy and proportion. Only two homes share each core, and every one opens onto an approximately 50-foot balcony.
        </SectionHeading>

        {/* Editorial sequence 1 */}
        <div className="mt-20 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="img-reveal md:col-span-7 aspect-[16/11]"><SoraImage asset={a} className="h-full w-full" sizes="(min-width:768px) 60vw, 100vw" caption /></Reveal>
          <div className="md:col-span-5 md:pb-6">
            <Feature n="01" title={f[0].title} detail={f[0].detail} />
            <Feature n="02" title={f[1].title} detail={f[1].detail} />
            <Feature n="03" title={f[2].title} detail={f[2].detail} />
          </div>
        </div>

        {/* Editorial sequence 2 */}
        <div className="mt-24 grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5 md:order-1 md:pt-16">
            <Feature n="04" title={f[3].title} detail={f[3].detail} />
            <Feature n="05" title={f[4].title} detail={f[4].detail} />
            <Feature n="06" title={f[5].title} detail={f[5].detail} />
          </div>
          <Reveal className="img-reveal md:col-span-6 md:col-start-7 md:order-2 aspect-[4/5]"><SoraImage asset={b} className="h-full w-full" sizes="(min-width:768px) 50vw, 100vw" caption /></Reveal>
        </div>

        {/* Specification band */}
        <div className="mt-24 grid gap-10 md:grid-cols-12">
          <Reveal className="img-scale md:col-span-4 aspect-[3/4] overflow-hidden"><SoraImage asset={c} className="h-full w-full" sizes="(min-width:768px) 33vw, 100vw" caption /></Reveal>
          <div className="md:col-span-8 grid content-center gap-x-10 sm:grid-cols-2">
            <Feature n="07" title={f[6].title} detail={f[6].detail} />
            <Feature n="08" title={f[7].title} detail={f[7].detail} />
            <Feature n="09" title={f[8].title} detail={f[8].detail} />
            <Feature n="10" title={f[9].title} detail={f[9].detail} />
          </div>
        </div>

        <Reveal className="reveal mt-16 flex flex-wrap items-center gap-4" delay={100}>
          <CtaButton magnet="floorPlans" source="residences">Request Complete Floor Plans</CtaButton>
          <CtaButton magnet="availability" source="residences" variant="ghost">Check Current Availability</CtaButton>
        </Reveal>
        <p className="fine mt-6 max-w-2xl">Specifications are indicative, from the project brochure, and subject to change as per approvals and the Agreement for Sale. &ldquo;Or equivalent&rdquo; brands may be substituted.</p>
      </div>
    </section>
  );
}

function Feature({ n, title, detail }: { n: string; title: string; detail: string }) {
  return (
    <Reveal className="reveal border-t border-sand py-6">
      <div className="grid grid-cols-[2.5rem_1fr] gap-4">
        <span className="pt-1 text-[0.65rem] tracking-[0.3em] text-ink-mute">{n}</span>
        <div>
          <h3 className="text-lg font-medium leading-snug md:text-xl">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{detail}</p>
        </div>
      </div>
    </Reveal>
  );
}
