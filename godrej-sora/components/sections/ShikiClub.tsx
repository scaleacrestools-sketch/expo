import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { CtaButton } from '@/components/ui/CtaButton';
import { TieredRoof } from '@/components/ui/motifs';
import { Parallax } from '@/components/ui/Parallax';

export function ShikiClub({ hero, amenityImages }: { hero: ResolvedAsset; amenityImages: Record<string, ResolvedAsset> }) {
  const a = project.amenities;
  const big = a.slice(0, 2), rest = a.slice(2);
  return (
    <section id="shiki-club" className="relative bg-ivory py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="09" eyebrow="Shiki Clubhouse" title={<>Where Wellness<br /><em>Becomes a Ritual.</em></>}>
          Wellness of the body, clubbed with wellness of the mind. An expansive space filled with amenities curated to rejuvenate your body and revive your mind in a Japanese-wellness-themed clubhouse inspired by Japanese tiered roofs. Beyond the state-of-the-art gym and activity zones, make the Onsen Pool a regular part of your regimen and feel the stresses of city life disappear.
        </SectionHeading>
        <TieredRoof className="mt-10 h-auto w-56 text-sand-deep md:w-80" />
      </div>
      <Reveal className="img-scale container-sora mt-10 aspect-[16/8] overflow-hidden"><Parallax className="h-full w-full" speed={0.12}><SoraImage asset={hero} className="h-full w-full" sizes="100vw" caption /></Parallax></Reveal>
      <div className="container-sora mt-10 grid gap-10 md:grid-cols-2">
        {big.map((x, i) => (
          <Reveal key={x.name} className="img-reveal" delay={i * 120}>
            <div className="aspect-[4/3] overflow-hidden"><SoraImage asset={amenityImages[x.image]} className="h-full w-full" sizes="(min-width:768px) 50vw, 100vw" caption /></div>
            <h3 className="display mt-5 text-2xl md:text-3xl">{x.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{x.copy}</p>
          </Reveal>
        ))}
      </div>
      <div className="container-sora mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] sm:grid sm:gap-x-8 sm:gap-y-10 sm:overflow-visible sm:pb-0 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((x, i) => (
          <Reveal key={x.name} className="reveal group w-[78vw] shrink-0 snap-start sm:w-auto sm:shrink" delay={i * 60}>
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
