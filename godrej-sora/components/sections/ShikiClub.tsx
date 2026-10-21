import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { CtaButton } from '@/components/ui/CtaButton';

export function ShikiClub({ hero, amenityImages }: { hero: ResolvedAsset; amenityImages: Record<string, ResolvedAsset> }) {
  const a = project.amenities;
  const big = a.slice(0, 2), rest = a.slice(2);
  return (
    <section id="shiki-club" className="relative bg-ivory py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="09" eyebrow="Shiki Clubhouse" title={<>Where Wellness<br /><em>Becomes a Ritual.</em></>}>
          <span className="serif-accent text-ink">Shiki</span> means the four seasons. Beneath its Japanese tiered roof, the clubhouse gathers an indoor onsen-inspired pool, a rooftop pool, spa and courts into a single place for the body to slow down.
        </SectionHeading>
      </div>
      <Reveal className="img-scale container-sora mt-16 aspect-[16/8] overflow-hidden"><SoraImage asset={hero} className="h-full w-full" sizes="100vw" caption /></Reveal>
      <div className="container-sora mt-10 grid gap-10 md:grid-cols-2">
        {big.map((x, i) => (
          <Reveal key={x.name} className="img-reveal" delay={i * 120}>
            <div className="aspect-[4/3] overflow-hidden"><SoraImage asset={amenityImages[x.image]} className="h-full w-full" sizes="(min-width:768px) 50vw, 100vw" caption /></div>
            <h3 className="display mt-5 text-2xl md:text-3xl">{x.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{x.copy}</p>
          </Reveal>
        ))}
      </div>
      <div className="container-sora mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((x, i) => (
          <Reveal key={x.name} className="reveal group" delay={i * 60}>
            <div className={`overflow-hidden ${i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}><SoraImage asset={amenityImages[x.image]} className="h-full w-full transition-transform duration-[1.6s] ease-[var(--ease-sora)] group-hover:scale-[1.03]" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" caption /></div>
            <h3 className="mt-4 text-lg font-medium">{x.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{x.copy}</p>
          </Reveal>
        ))}
      </div>
      <div className="container-sora mt-16"><CtaButton magnet="brochure" source="shiki-club" variant="ghost">Request the Clubhouse Brochure</CtaButton></div>
    </section>
  );
}
