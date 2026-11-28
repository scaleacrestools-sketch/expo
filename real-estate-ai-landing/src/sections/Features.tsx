import { features } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { CalendarVisual, CallingVisual, ChecklistVisual, ClockVisual, CrmSyncVisual, IntelligenceVisual, LanguageVisual, ReactivationVisual, ScoringVisual, WhatsAppVisual } from '../components/illustrations/FeatureVisuals';

const visuals = [CallingVisual, ChecklistVisual, WhatsAppVisual, LanguageVisual, CalendarVisual, ReactivationVisual, ClockVisual, CrmSyncVisual, ScoringVisual, IntelligenceVisual];
// Asymmetric bento placement on a 12-column grid (lg). Order matches features.items.
const layout = [
  'lg:col-span-7', 'lg:col-span-5',
  'lg:col-span-4 lg:row-span-2', 'lg:col-span-4', 'lg:col-span-4 lg:row-span-2', 'lg:col-span-4',
  'lg:col-span-5', 'lg:col-span-7',
  'lg:col-span-6', 'lg:col-span-6',
];

export function Features() {
  return (
    <Section id="features" theme="light" alt label="Platform features">
      <div className="container-x section-y">
        <SectionHeader eyebrow={features.eyebrow} title={features.title} />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12" data-testid="features-grid">
          {features.items.map((f, i) => {
            const V = visuals[i];
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.06} className={`${layout[i]} ${i === 0 || i === 7 ? 'md:col-span-2' : ''}`}>
                <article className="card card-hover flex h-full flex-col overflow-hidden">
                  <div className="flex flex-1 flex-col justify-center border-b border-[var(--c-line)] bg-[radial-gradient(120%_80%_at_50%_0%,#f3efff_0%,#f7f7f9_60%)]"><V /></div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[12px] font-medium tabular-nums text-[var(--c-accent-text)]">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="h-card mt-1">{f.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed">{f.body}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
