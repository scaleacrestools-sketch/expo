import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { Blossom } from '@/components/ui/motifs';
import { Parallax } from '@/components/ui/Parallax';

export function Landscape({ images }: { images: ResolvedAsset[] }) {
  const [garden, blossom, sunken] = images;
  return (
    <section id="landscape" className="relative overflow-hidden bg-sage-deep py-[var(--section-y)] text-ivory">
      <Blossom className="pointer-events-none absolute -left-10 top-10 h-40 w-40 text-ivory/10" />
      <Blossom className="pointer-events-none absolute right-8 bottom-16 h-24 w-24 text-ivory/10" />
      <div className="container-sora">
        <SectionHeading index="08" eyebrow="Japanese landscaping" light title={<>Find Your Moment<br /><em className="text-gold-soft">of Stillness.</em></>}>
          Oracles has composed the grounds as a sequence of Japanese-inspired gardens: cherry-blossom-inspired native planting, water that barely moves, and sunken seating for conversation or none at all.
        </SectionHeading>
        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
          <Reveal className="img-reveal md:col-span-2 aspect-[16/10]"><Parallax className="h-full w-full"><SoraImage asset={garden} className="h-full w-full" sizes="(min-width:768px) 66vw, 100vw" caption /></Parallax></Reveal>
          <Reveal className="img-reveal aspect-[16/10] md:aspect-auto" delay={150}><SoraImage asset={blossom} className="h-full w-full" sizes="(min-width:768px) 33vw, 100vw" caption /></Reveal>
          <Reveal className="img-reveal aspect-[16/10] md:aspect-auto" delay={100}><SoraImage asset={sunken} className="h-full w-full" sizes="(min-width:768px) 33vw, 100vw" caption /></Reveal>
          <Reveal className="reveal md:col-span-2 flex flex-col justify-center border-l border-ivory/20 pl-8" delay={200}>
            <p className="display text-2xl md:text-3xl">Zen gardens. Still water. <em className="text-gold-soft">Quiet courts.</em></p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/75 md:text-base">The landscape replaces decoration with intention. Each court is a reason to pause on the way home; each garden, a season to notice.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
