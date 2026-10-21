import { project } from '@/content/project';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function Partners() {
  return (
    <section id="partners" className="relative bg-ivory py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="16" eyebrow="Design partners" title={<>Designed by<br /><em>Visionaries.</em></>} />
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {project.partners.map((p, i) => (
            <Reveal key={p.name} className="reveal border-t border-ink/15 pt-8" delay={i * 120}>
              <p className="text-[0.64rem] tracking-[0.28em] uppercase text-sora-red">{p.role}</p>
              <h3 className="display mt-3 text-3xl md:text-4xl">{p.name}</h3>
              <p className="lede mt-5 !text-base">{p.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
