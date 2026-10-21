import type { ResolvedAsset } from '@/lib/assets.server';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { CtaButton } from '@/components/ui/CtaButton';
import { site } from '@/content/site';

export function Final({ image, logo }: { image: ResolvedAsset; logo?: ResolvedAsset }) {
  return (
    <section id="final" className="relative isolate flex min-h-[90svh] items-center overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0"><SoraImage asset={image} className="h-full w-full" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" /></div>
      <div className="container-sora relative z-10 py-[var(--section-y)] text-center">
        <Reveal className="reveal mx-auto max-w-3xl">
          {logo?.src ? <div className="relative mx-auto mb-8 h-40 w-28 overflow-hidden shadow-xl"><SoraImage asset={logo} className="h-full w-full" sizes="7rem" /></div> : <p className="eyebrow !text-gold">19</p>}
          <h2 className="display mt-5 text-[clamp(2.6rem,7vw,6.4rem)]">Your Place in the Sun<br /><em className="text-gold-soft">Awaits.</em></h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <CtaButton magnet="presentation" source="final" variant="gold">Request Private Presentation</CtaButton>
            <CtaButton magnet="siteVisit" source="final" variant="ghost-light">Schedule a Site Visit</CtaButton>
          </div>
          {site.contact.phone && <p className="mt-10 text-sm tracking-[0.1em] text-ivory/70">Sales desk: <a className="text-ivory underline underline-offset-4" href={`tel:+${site.contact.phone}`}>+{site.contact.phone}</a></p>}
        </Reveal>
      </div>
    </section>
  );
}
