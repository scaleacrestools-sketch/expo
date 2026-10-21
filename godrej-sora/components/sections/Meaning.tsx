import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SoraImage } from '@/components/ui/SoraImage';
import { Blossom, SunRays } from '@/components/ui/motifs';

export function Meaning({ artwork, blossom }: { artwork: ResolvedAsset; blossom: ResolvedAsset }) {
  return (
    <section id="overview" className="washi grain relative overflow-hidden py-[var(--section-y)]">
      <SunRays className="spin-slow pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] text-gold/25 md:-right-40 md:-top-32 md:h-[40rem] md:w-[40rem]" />
      <div className="container-sora relative z-10 grid gap-16 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading index="02" eyebrow="The meaning of Sora" title={<>The Sky Is Not a Limit.<br /><em>It&rsquo;s a Way of Living.</em></>}>
            In Japanese, <span className="serif-accent text-ink">sora</span> is the sky: the open, the unbounded, the source of light. Godrej Sora takes its name seriously.
            Each residence is oriented toward sunlight and air, each balcony stretched to meet the horizon, each shared space composed for stillness.
          </SectionHeading>
          <Reveal className="reveal mt-10 grid max-w-xl gap-6 border-l border-sand-deep pl-6" delay={240}>
            <p className="lede !text-base">Here, luxury is not an accumulation of things. It is the discipline to leave room: for light, for quiet, for the people you love.</p>
            <p className="lede !text-base">This is a home built on the Japanese idea of <span className="serif-accent text-ink">shibui</span>, the beauty of restraint, and on the simplest of promises: your place in the sun.</p>
          </Reveal>
        </div>
        <div className="relative">
          <Reveal className="img-reveal relative aspect-[4/5] w-full overflow-hidden">
            <SoraImage asset={artwork} className="h-full w-full" sizes="(min-width:768px) 45vw, 100vw" caption />
          </Reveal>
          <Reveal className="reveal absolute -bottom-8 -left-6 hidden w-44 md:block" delay={300}>
            <div className="relative aspect-square overflow-hidden border-[6px] border-ivory shadow-xl">
              {blossom.src ? <SoraImage asset={blossom} className="h-full w-full" sizes="12rem" /> : <div className="washi flex h-full w-full items-center justify-center"><Blossom className="h-16 w-16 text-sora-red/80" /></div>}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
