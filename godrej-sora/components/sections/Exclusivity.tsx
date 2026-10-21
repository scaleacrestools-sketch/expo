import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { SunRays } from '@/components/ui/motifs';

const facts = [
  { v: '244', l: 'residences in the complete collection' },
  { v: '2', l: 'homes per core, per tower' },
  { v: '0', l: 'overlooking towers' },
  { v: '1', l: 'private lift lobby for every home' },
];

export function Exclusivity({ image }: { image: ResolvedAsset }) {
  return (
    <section id="exclusivity" className="relative isolate overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0"><SoraImage asset={image} className="h-full w-full opacity-60" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" /></div>
      <div className="container-sora relative z-10 py-[var(--section-y)]">
        <Reveal className="reveal max-w-2xl">
          <p className="eyebrow !text-gold">10 — Project exclusivity</p>
          <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5.2rem)]">Reserved for<br /><em className="text-gold-soft">a Select Few.</em></h2>
          <p className="lede mt-6 !text-ivory/75">Sora is a collection of {project.headline.totalResidences.value} residences in total, not a city within a city. With just two homes per core and no overlooking towers, privacy is built into the plan rather than added later.</p>
        </Reveal>
        <dl className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {facts.map((f, i) => (
            <Reveal key={f.l} className="reveal border-t border-ivory/20 pt-6" delay={i * 90}>
              <dt className="display text-5xl md:text-6xl text-gold-soft">{f.v}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-ivory/70">{f.l}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="fine mt-10 max-w-xl !text-ivory/40">244 is the size of the complete Sora collection, not an indication of current availability. Please request current availability for open residences.</p>
        <SunRays className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 text-gold/20" />
      </div>
    </section>
  );
}
