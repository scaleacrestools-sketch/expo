import { Bot, CalendarCheck2, Clock3, Database, Gauge, Languages, ListChecks, MessageCircle, RefreshCw, ScrollText, type LucideIcon } from 'lucide-react';
import { features } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { CalendarVisual, CallingVisual, ChecklistVisual, ClockVisual, CrmSyncVisual, IntelligenceVisual, LanguageVisual, ReactivationVisual, ScoringVisual, WhatsAppVisual } from '../components/illustrations/FeatureVisuals';

/** Index into features.items → visual, icon and bento placement. Priority features get the large tiles. */
const cfg: Record<number, { V: () => JSX.Element; icon: LucideIcon; cls: string; primary?: boolean; wide?: boolean }> = {
  0: { V: CallingVisual, icon: Bot, cls: 'lg:col-span-7', primary: true },
  1: { V: ChecklistVisual, icon: ListChecks, cls: 'lg:col-span-5', primary: true },
  2: { V: WhatsAppVisual, icon: MessageCircle, cls: 'lg:col-span-5', primary: true },
  4: { V: CalendarVisual, icon: CalendarCheck2, cls: 'lg:col-span-7', primary: true },
  3: { V: LanguageVisual, icon: Languages, cls: 'lg:col-span-4' },
  5: { V: ReactivationVisual, icon: RefreshCw, cls: 'lg:col-span-4' },
  6: { V: ClockVisual, icon: Clock3, cls: 'lg:col-span-4' },
  7: { V: CrmSyncVisual, icon: Database, cls: 'lg:col-span-6' },
  8: { V: ScoringVisual, icon: Gauge, cls: 'lg:col-span-6' },
  9: { V: IntelligenceVisual, icon: ScrollText, cls: 'lg:col-span-12', wide: true },
};
const order = [0, 1, 2, 4, 3, 5, 6, 7, 8, 9];

export function Features() {
  return (
    <Section id="features" theme="light" alt sheet label="Platform features">
      <div className="container-x section-y">
        <SectionHeader eyebrow={features.eyebrow} title={features.title} />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12" data-testid="features-grid">
          {order.map((idx, k) => {
            const f = features.items[idx]; const c = cfg[idx]; const I = c.icon;
            return (
              <Reveal key={f.title} variant={c.primary ? 'scale' : 'up'} delay={(k % 3) * 0.07} className={`${c.cls} ${idx === 0 || c.wide ? 'md:col-span-2' : ''}`}>
                <article className={`card card-hover flex h-full overflow-hidden ${c.wide ? 'flex-col lg:flex-row-reverse' : 'flex-col'} ${c.primary ? 'ring-1 ring-brand/15' : ''}`} data-feature={f.title}>
                  <div className={`relative flex flex-col justify-center border-[var(--c-line)] bg-[radial-gradient(120%_90%_at_50%_0%,#efeaff_0%,#f6f7fb_62%)] ${c.wide ? 'border-b lg:w-[60%] lg:border-b-0 lg:border-l' : 'flex-1 border-b'} ${c.primary ? '' : 'max-sm:hidden'}`}>
                    <c.V />
                  </div>
                  <div className={`p-5 sm:p-6 ${c.primary ? '' : 'max-sm:flex max-sm:gap-3 max-sm:p-4'} ${c.wide ? 'flex justify-center max-sm:flex-row sm:flex-col lg:w-[40%] lg:p-10' : ''}`}>
                    {!c.primary && <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#efeaff] text-[var(--c-accent-text)] sm:hidden" aria-hidden="true"><I size={18} /></span>}
                    <div>
                    <p className={`flex items-center gap-2 text-[12px] font-medium text-[var(--c-accent-text)] ${c.primary ? '' : 'max-sm:hidden'}`}><span className="grid h-6 w-6 place-items-center rounded-md bg-[#efeaff]"><I size={13} /></span>{c.primary ? 'Core capability' : 'Platform'}</p>
                    <h3 className={`h-card mt-2.5 ${c.primary ? '' : 'max-sm:mt-0'} ${c.primary || c.wide ? 'lg:text-[24px]' : ''}`}>{f.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed max-sm:text-[14px]">{f.body}</p>
                    </div>
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
