import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { howItWorks } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { CampaignViz, ConversationViz, ImportViz, ScheduleViz, ScoreViz } from '../components/illustrations/StepVisuals';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const visuals = [ImportViz, CampaignViz, ConversationViz, ScoreViz, ScheduleViz];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [userPicked, setUserPicked] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useLoop(9, 900, inView, 8);

  // Auto-advance steps while visible, until the visitor picks one.
  useEffect(() => {
    if (!inView || userPicked || reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % 5), 7200);
    return () => window.clearInterval(id);
  }, [inView, userPicked, reduced]);
  useEffect(() => { if (!reduced) setT(0); }, [active, reduced, setT]);

  const pick = (i: number) => { setActive(i); setUserPicked(true); };
  const d = Math.max(0, active); // desktop always shows a step
  const Visual = visuals[d];

  return (
    <Section id="how-it-works" theme="light" label="How it works">
      <div className="container-x section-y">
        <SectionHeader eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        {/* Desktop */}
        <div ref={ref} className="mt-14 hidden gap-10 lg:grid lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="sticky top-28 self-start">
            <div role="tablist" aria-orientation="vertical" aria-label="Workflow steps" className="relative space-y-1.5"
              onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = (d + (e.key === 'ArrowDown' ? 1 : 4)) % 5; pick(n); document.getElementById(`hiw-tab-${n}`)?.focus(); } }}>
              <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-px bg-[var(--c-line)]" />
              <span aria-hidden="true" className="absolute left-[27px] top-6 w-px bg-[var(--brand-primary)] transition-all duration-700" style={{ height: `calc(${d * 25}% - ${d * 12}px)` }} />
              {howItWorks.steps.map((s, i) => {
                const on = i === d;
                return (
                  <button key={s.n} id={`hiw-tab-${i}`} role="tab" aria-selected={on} aria-controls="hiw-panel" tabIndex={on ? 0 : -1} onClick={() => pick(i)} data-testid={`step-${i}`}
                    className={`relative flex w-full gap-4 rounded-2xl p-3.5 text-left transition-all duration-300 ${on ? 'bg-white shadow-[var(--c-shadow)] ring-1 ring-[var(--c-line)]' : 'hover:bg-white/60'}`}>
                    <span className={`relative z-[1] grid h-[28px] w-[28px] flex-none place-items-center rounded-full text-[11.5px] font-semibold transition-colors ${on || i < d ? 'bg-[var(--brand-primary)] text-white' : 'border border-[var(--c-line-strong)] bg-white text-[var(--c-muted)]'}`}>{s.n}</span>
                    <span>
                      <span className={`block text-[16.5px] font-semibold tracking-[-0.02em] ${on ? 'text-[var(--c-head)]' : 'text-[var(--c-text)]'}`}>{s.title}</span>
                      <AnimatePresence initial={false}>
                        {on && <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden"><span className="block pt-1.5 text-[14.5px] leading-relaxed text-[var(--c-text)]">{s.body}</span>
                          {!userPicked && !reduced && <span className="mt-3 block h-0.5 overflow-hidden rounded-full bg-[var(--c-line)]"><span key={d} className="block h-full bg-[var(--brand-primary)]" style={{ animation: 'progress 7.2s linear forwards' }} /></span>}
                        </motion.span>}
                      </AnimatePresence>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div id="hiw-panel" role="tabpanel" aria-labelledby={`hiw-tab-${d}`} className="card relative min-h-[470px] overflow-hidden !bg-[var(--light-background-secondary)]">
            <WorkflowRail active={d} />
            <AnimatePresence mode="wait">
              <motion.div key={d} className="absolute inset-0 top-[60px]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                <Visual t={t} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="mt-10 space-y-3 lg:hidden">
          {howItWorks.steps.map((s, i) => {
            const on = i === active; const V = visuals[i];
            return (
              <div key={s.n} className="card overflow-hidden">
                <h3>
                  <button className="flex w-full items-center gap-3 p-4 text-left" aria-expanded={on} aria-controls={`hiw-m-${i}`} onClick={() => pick(on ? -1 : i)} data-testid={`step-m-${i}`}>
                    <span className={`grid h-8 w-8 flex-none place-items-center rounded-full text-[12px] font-semibold ${on ? 'bg-[var(--brand-primary)] text-white' : 'border border-[var(--c-line-strong)] text-[var(--c-muted)]'}`}>{s.n}</span>
                    <span className="flex-1 text-[16px] font-semibold tracking-[-0.02em] text-[var(--c-head)]">{s.title}</span>
                    <ChevronDown size={18} className={`transition-transform ${on ? 'rotate-180' : ''}`} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`hiw-m-${i}`} initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-4 pb-3 text-[15px] leading-relaxed">{s.body}</p>
                      <div className="border-t border-[var(--c-line)] bg-[var(--light-background-secondary)]"><V t={8} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function WorkflowRail({ active }: { active: number }) {
  const labels = ['Import', 'Configure', 'Converse', 'Qualify', 'Schedule'];
  return (
    <svg viewBox="0 0 600 60" className="absolute inset-x-0 top-0 h-[60px] w-full border-b border-[var(--c-line)] bg-white" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <line x1="60" x2="540" y1="24" y2="24" stroke="#e4e4e7" strokeWidth="2" />
      <line x1="60" x2={60 + active * 120} y1="24" y2="24" stroke="#8b5cf6" strokeWidth="2" style={{ transition: 'all .7s cubic-bezier(.22,1,.36,1)' }} />
      {labels.map((l, i) => (
        <g key={l} transform={`translate(${60 + i * 120} 24)`}>
          <circle r={i === active ? 8 : 5} fill={i <= active ? '#8b5cf6' : '#fff'} stroke={i <= active ? '#8b5cf6' : '#d4d4d8'} strokeWidth="2" style={{ transition: 'all .4s' }} />
          {i === active && <circle r="13" fill="none" stroke="#8b5cf6" strokeOpacity=".3" strokeWidth="2" />}
          <text y="24" textAnchor="middle" fontSize="10.5" fill={i === active ? '#0f0f14' : '#8a8a94'} fontWeight={i === active ? 600 : 400}>{l}</text>
        </g>
      ))}
    </svg>
  );
}
