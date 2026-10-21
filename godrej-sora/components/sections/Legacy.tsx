import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SoraImage } from '@/components/ui/SoraImage';

export function Legacy({ logo }: { logo: ResolvedAsset }) {
  return (
    <section id="legacy" className="washi grain relative py-[var(--section-y)]">
      <div className="container-sora grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <SectionHeading index="17" eyebrow="The Godrej legacy" title={<>A Legacy<br /><em>of Trust.</em></>} />
          <div className="relative mt-10 h-16 w-48">{logo.src ? <SoraImage asset={logo} className="h-full w-full !bg-transparent [&_img]:!object-contain [&_img]:!object-left" sizes="12rem" /> : <p className="text-[0.7rem] tracking-[0.34em] uppercase text-ink-soft">Godrej Properties</p>}</div>
        </div>
        <Reveal className="reveal grid gap-5 border-l border-sand-deep pl-8" delay={120}>
          {project.legacy.paragraphs.map((p) => <p key={p} className="lede">{p}</p>)}
          <ul className="mt-4 grid gap-2 text-[0.78rem] leading-relaxed text-ink-soft sm:grid-cols-2">
            {project.legacy.credentials.map((c) => <li key={c} className="flex gap-3"><span className="mt-2 h-px w-4 shrink-0 bg-gold" />{c}</li>)}
          </ul>
          <p className="fine">Source: Godrej Sora brochure, p.2 and p.4 (godrejproperties.com).</p>
        </Reveal>
      </div>
    </section>
  );
}
