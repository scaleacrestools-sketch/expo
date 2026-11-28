import { AnimatePresence, motion } from 'motion/react';
import { CalendarCheck2, LayoutDashboard, PhoneCall, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { mobile } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { DashboardScreen, PhoneFrame, ProfileScreen } from '../components/dashboards/PhoneScreens';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useLoop } from '../hooks/useLoop';

const screens = [
  { label: 'Dashboard', icon: LayoutDashboard, C: DashboardScreen, alt: 'Mobile CRM dashboard preview showing new leads, qualified buyers, call history and recent activity' },
  { label: 'Buyer Profile', icon: UserRound, C: ProfileScreen, alt: 'Mobile buyer profile preview with property preferences, lead status, site visit calendar, reminder and assign button' },
];

export function MobileCRM() {
  const [s, setS] = useState(0);
  const [touched, setTouched] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [tick] = useLoop(6, 2400, inView, 1);
  useEffect(() => {
    if (!inView || touched || reduced) return;
    const t = window.setInterval(() => setS((v) => (v + 1) % 2), 7200);
    return () => window.clearInterval(t);
  }, [inView, touched, reduced]);

  return (
    <Section id="mobile" theme="light" alt sheet label="Mobile CRM" className="overflow-hidden">
      <div className="container-x section-y">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <SectionHeader align="left" eyebrow={mobile.eyebrow} title={mobile.title} description={mobile.description}>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[12.5px] font-medium text-amber-800">Product Preview · Coming Soon</p>
            </SectionHeader>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[[PhoneCall, 'Call history and AI summaries'], [UserRound, 'Buyer preferences at a glance'], [CalendarCheck2, 'Site visit calendar and reminders'], [LayoutDashboard, 'Assign leads to sales executives']].map(([I, t]) => {
                const Ic = I as typeof PhoneCall;
                return <li key={t as string} className="flex items-center gap-3 text-[15px] text-[var(--c-head)]"><span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white text-[var(--brand-deep)] shadow-sm ring-1 ring-[var(--c-line)]"><Ic size={17} /></span>{t as string}</li>;
              })}
            </ul>
            <div role="tablist" aria-label="Mobile screens" className="mt-8 inline-flex rounded-full border border-[var(--c-line)] bg-white p-1 shadow-sm">
              {screens.map((x, i) => (
                <button key={x.label} role="tab" aria-selected={s === i} onClick={() => { setS(i); setTouched(true); }} data-testid={`mobile-tab-${i}`}
                  className={`flex min-h-[40px] items-center gap-2 rounded-full px-4 text-[14px] font-medium transition ${s === i ? 'bg-[#0f0f14] text-white' : 'text-[var(--c-text)] hover:text-[var(--c-head)]'}`}><x.icon size={15} />{x.label}</button>
              ))}
            </div>
          </div>

          <Reveal variant="right">
            <div ref={ref} className="relative mx-auto flex h-[620px] max-w-[560px] items-center justify-center" data-testid="mobile-phones" data-screen={s}>
              <div aria-hidden="true" className="absolute inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,.22),transparent)]" />
              {/* Desktop: two phones that swap depth */}
              {screens.map((x, i) => {
                const front = s === i;
                return (
                  <motion.div key={x.label} className="absolute hidden sm:block" animate={{ x: i === 0 ? -120 : 120, y: front ? 0 : 26, scale: front ? 1 : 0.9, rotate: i === 0 ? -4 : 4, zIndex: front ? 2 : 1, opacity: front ? 1 : 0.85, filter: front ? 'blur(0px)' : 'blur(0.4px)' }}
                    transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
                    <PhoneFrame label={x.alt}><x.C t={tick} /></PhoneFrame>
                  </motion.div>
                );
              })}
              {/* Mobile: single phone with crossfade */}
              <div className="sm:hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={s} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                    <PhoneFrame label={screens[s].alt}>{s === 0 ? <DashboardScreen t={tick} /> : <ProfileScreen t={tick} />}</PhoneFrame>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
