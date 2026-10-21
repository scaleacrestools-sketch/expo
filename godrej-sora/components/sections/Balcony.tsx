import type { ResolvedAsset } from '@/lib/assets.server';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { CtaButton } from '@/components/ui/CtaButton';

export function Balcony({ image }: { image: ResolvedAsset }) {
  return (
    <section id="balcony" className="relative isolate overflow-hidden bg-ink text-ivory">
      <div className="relative h-[72svh] min-h-[32rem] w-full overflow-hidden md:h-[100svh]">
        <div className="pan-slow absolute inset-0 will-change-transform"><SoraImage asset={image} className="h-full w-full" sizes="100vw" /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        <div className="container-sora absolute inset-0 flex flex-col justify-end pb-16 md:justify-center md:pb-0">
          <Reveal className="reveal max-w-xl">
            <p className="eyebrow !text-gold">06 — Signature balcony experience</p>
            <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5.5rem)]">A Wider View<br /><em className="text-gold-soft">of Life.</em></h2>
            <p className="lede mt-6 !text-ivory/75">Approximately fifty feet of uninterrupted outdoor living. Breakfast at one end, a garden in the middle, the sunset at the other. The balcony is not an afterthought at Sora. It is the room the home is built around.</p>
            <div className="mt-8"><CtaButton magnet="floorPlans" source="balcony" variant="gold">Explore Residence Layouts</CtaButton></div>
          </Reveal>
        </div>
        <p className="absolute bottom-4 right-4 z-10 text-[0.62rem] tracking-[0.12em] uppercase text-ivory/55">{image.kindLabel}</p>
      </div>
    </section>
  );
}
