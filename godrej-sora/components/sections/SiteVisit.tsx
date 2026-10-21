import { LeadForm } from '@/components/forms/LeadForm';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SunRays } from '@/components/ui/motifs';

export function SiteVisit() {
  return (
    <section id="visit" className="relative overflow-hidden bg-ivory-soft py-[var(--section-y)]">
      <SunRays className="spin-slow pointer-events-none absolute -left-32 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 text-gold/15" />
      <div className="container-sora relative z-10 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeading index="18" eyebrow="Private site visit" title={<>An Invitation to<br /><em>Experience Sora.</em></>}>
          Choose a date and a time. A Sora advisor will confirm your appointment personally and arrange an unhurried, private walkthrough.
        </SectionHeading>
        <Reveal className="reveal rounded-sm border border-sand bg-ivory p-6 md:p-10" delay={150}>
          <LeadForm magnet="siteVisit" source="site-visit-section" compact />
        </Reveal>
      </div>
    </section>
  );
}
