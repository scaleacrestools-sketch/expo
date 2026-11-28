import { AnimatePresence, motion } from 'motion/react';
import { Building2, Check, Handshake, Headphones, Megaphone } from 'lucide-react';
const tabIcons = [Building2, Handshake, Megaphone, Headphones];
import { useEffect, useState } from 'react';
import { useCases } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AppWindow } from '../components/dashboards/primitives';
import { AgencyDash, CallCentreDash, DeveloperDash, PartnerDash } from '../components/dashboards/UseCaseDashboards';

const dashes = [DeveloperDash, PartnerDash, AgencyDash, CallCentreDash];
const paths = ['projects/tower-b', 'pipeline', 'clients', 'campaigns/bulk'];

export function UseCases() {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    const on = (e: Event) => { const id = (e as CustomEvent<string>).detail; const i = useCases.tabs.findIndex((t) => t.id === id); if (i >= 0) setTab(i); };
    window.addEventListener('usecase:select', on);
    return () => window.removeEventListener('usecase:select', on);
  }, []);
  const t = useCases.tabs[tab]; const D = dashes[tab];
  const onKey = (e: React.KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const cur = Number((document.activeElement?.id || '').replace('uc-tab-', '')); const from = Number.isNaN(cur) ? tab : cur;
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (from + (e.key === 'ArrowRight' ? 1 : 3)) % 4;
    setTab(n); document.getElementById(`uc-tab-${n}`)?.focus();
  };

  return (
    <Section id="use-cases" theme="dark" sheet label="Use cases">
      <div className="container-x section-y">
        <SectionHeader eyebrow={useCases.eyebrow} title={useCases.title} />
        <Reveal className="mt-12" variant="blur">
          <div role="tablist" aria-label="Audiences" onKeyDown={onKey} className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {useCases.tabs.map((x, i) => (
              <button key={x.id} id={`uc-tab-${i}`} role="tab" aria-selected={tab === i} aria-controls="uc-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} data-testid={`uc-tab-${i}`}
                className={`relative flex min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[14px] font-medium transition-colors duration-200 ${tab === i ? 'border-brand/50 bg-brand/[0.12] text-white shadow-[inset_0_-16px_64px_rgba(116,176,253,.06)]' : 'border-[var(--c-line)] text-[var(--c-text)] hover:border-white/20 hover:text-white'}`}>
                {(() => { const I = tabIcons[i]; return <span className={`grid h-8 w-8 flex-none place-items-center rounded-lg ${tab === i ? 'bg-[var(--brand-solid)] text-white' : 'bg-white/[0.05] text-[var(--brand-accent)]'}`}><I size={16} /></span>; })()}
                <span>{x.label}</span>
                {tab === i && <span className="absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-[#cbbdff] to-transparent" />}
              </button>
            ))}
          </div>

          <div id="uc-panel" role="tabpanel" aria-labelledby={`uc-tab-${tab}`} className="card mt-4 overflow-hidden" data-testid="uc-panel">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.26 }} className="grid lg:grid-cols-[minmax(0,380px)_1fr]">
                <div className="border-b border-[var(--c-line)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                  <h3 className="h-card text-[24px]">{t.label}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">{t.intro}</p>
                  <ul className={`mt-6 grid gap-2.5 ${t.items.length > 6 ? 'sm:grid-cols-2 lg:grid-cols-1' : ''}`}>
                    {t.items.map((it) => <li key={it} className="flex items-start gap-2.5 text-[14.5px] text-white/85"><span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand/20 text-[var(--brand-accent)]"><Check size={12} strokeWidth={3} /></span>{it}</li>)}
                  </ul>
                </div>
                <div className="bg-[radial-gradient(80%_80%_at_70%_0%,rgba(128,87,255,0.16),transparent)] p-4 sm:p-8">
                  <AppWindow path={paths[tab]} compact><D /></AppWindow>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
