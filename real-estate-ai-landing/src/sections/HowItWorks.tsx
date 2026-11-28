import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Pause, Play } from 'lucide-react';
import { loops } from '../config/motion';
import { useApp } from '../components/ui/AppContext';
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
  const [userPicked, setUserPicked] = useState(false); // manual selection pauses auto-advance
  const [hovering, setHovering] = useState(false);     // never advance while the visitor is interacting
  const { openVideo } = useApp();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useLoop(9, 900, inView, 8);

  // Auto-advance steps while visible, until the visitor picks one.
  useEffect(() => {
    if (!inView || userPicked || reduced || hovering) return;
    const id = window.setInterval(() => setActive((a) => (Math.max(0, a) + 1) % 5), loops.howItWorksAdvance);
    return () => window.clearInterval(id);
  }, [inView, userPicked, reduced, hovering]);
  const autoplay = !userPicked && !reduced;
  useEffect(() => { if (!reduced) setT(0); }, [active, reduced, setT]);

  const pick = (i: number) => { setActive(i); setUserPicked(true); };
  const d = Math.max(0, active); // desktop always shows a step
  const Visual = visuals[d];

  return (
    <Section id="how-it-works" theme="light" sheet label="How it works">
      <div className="container-x section-y">
        <SectionHeader eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        {/* Desktop */}
        <div ref={ref} className="mt-12 hidden gap-10 lg:grid lg:grid-cols-[minmax(0,420px)_1fr]" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocusCapture={() => setHovering(true)} onBlurCapture={() => setHovering(false)}>
          <div className="sticky top-28 self-start">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-[var(--c-muted)]">Step {d + 1} of 5</p>
              <button type="button" onClick={() => setUserPicked((v) => !v)} className="btn-ghost !min-h-[36px] rounded-full border border-[var(--c-line)] bg-white !px-3 !text-[12.5px]" aria-pressed={!autoplay} data-testid="hiw-autoplay" disabled={reduced}>
                {autoplay ? <><Pause size={13} /> Pause tour</> : <><Play size={13} /> Play tour</>}
              </button>
            </div>
            <div role="tablist" aria-orientation="vertical" aria-label="Workflow steps" className="relative space-y-1.5"
              onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = (d + (e.key === 'ArrowDown' ? 1 : 4)) % 5; pick(n); document.getElementById(`hiw-tab-${n}`)?.focus(); } }}>
              <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-px bg-[var(--c-line)]" />
              <span aria-hidden="true" className="absolute left-[27px] top-6 w-px bg-[var(--brand-primary)] transition-all duration-700" style={{ height: `calc(${d * 25}% - ${d * 12}px)` }} />
              {howItWorks.steps.map((s, i) => {
                const on = i === d;
                return (
                  <button key={s.n} id={`hiw-tab-${i}`} role="tab" aria-selected={on} aria-controls="hiw-panel" tabIndex={on ? 0 : -1} onClick={() => pick(i)} data-testid={`step-${i}`}
                    className={`relative flex w-full gap-4 rounded-2xl p-3.5 text-left transition-all duration-300 ${on ? 'bg-white shadow-[var(--c-shadow)] ring-1 ring-[var(--c-line)]' : 'hover:bg-white/60'}`}>
                    <span className={`relative z-[1] grid h-[28px] w-[28px] flex-none place-items-center rounded-full text-[11.5px] font-semibold transition-colors ${on || i < d ? 'bg-[var(--brand-solid)] text-white' : 'border border-[var(--c-line-strong)] bg-white text-[var(--c-muted)]'}`}>{s.n}</span>
                    <span>
                      <span className={`block text-[16.5px] font-semibold tracking-[-0.02em] ${on ? 'text-[var(--c-head)]' : 'text-[var(--c-text)]'}`}>{s.title}</span>
                      <AnimatePresence initial={false}>
                        {on && <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden"><span className="block pt-1.5 text-[14.5px] leading-relaxed text-[var(--c-text)]">{s.body}</span>
                          {autoplay && <span className="mt-3 block h-0.5 overflow-hidden rounded-full bg-[var(--c-line)]"><span key={d} className="block h-full origin-left bg-[var(--brand-primary)]" style={{ animation: `progress ${loops.howItWorksAdvance}ms linear forwards`, animationPlayState: hovering ? 'paused' : 'running' }} /></span>}
                        </motion.span>}
                      </AnimatePresence>
                    </span>
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={openVideo} className="group mt-5 flex w-full items-center gap-4 rounded-2xl border border-[var(--c-line)] bg-white p-2.5 text-left shadow-[var(--c-shadow)] transition hover:border-brand/40" data-testid="hiw-video">
              <span className="relative block aspect-video w-[148px] flex-none overflow-hidden rounded-xl bg-[#080515]">
                <img src="/assets/videos/video-poster.webp" alt="" loading="lazy" decoding="async" width="296" height="166" className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 grid place-items-center"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#0d1424] shadow-lg"><Play size={14} fill="currentColor" className="translate-x-[1px]" /></span></span>
              </span>
              <span><span className="block text-[14.5px] font-semibold text-[var(--c-head)]">See all five steps in 30 seconds</span><span className="mt-0.5 block text-[13px] text-[var(--c-text)]">Watch the product walkthrough</span></span>
            </button>
          </div>

          <div id="hiw-panel" role="tabpanel" aria-labelledby={`hiw-tab-${d}`} className="card relative min-h-[470px] overflow-hidden !bg-[var(--light-background-secondary)]">
            <WorkflowRail active={d} />
            <AnimatePresence mode="wait">
              <motion.div key={d} className="absolute inset-0 top-[64px]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
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
                    <span className={`grid h-8 w-8 flex-none place-items-center rounded-full text-[12px] font-semibold ${on ? 'bg-[var(--brand-solid)] text-white' : 'border border-[var(--c-line-strong)] text-[var(--c-muted)]'}`}>{s.n}</span>
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
  const reduced = usePrefersReducedMotion();
  const x = (i: number) => 60 + i * 120;
  return (
    <svg viewBox="0 0 600 64" className="absolute inset-x-0 top-0 h-[64px] w-full border-b border-[var(--c-line)] bg-white" aria-hidden="true" preserveAspectRatio="xMidYMid meet" data-testid="hiw-rail">
      <defs><linearGradient id="hiw-g" x1="0" x2="1"><stop stopColor="#a48bff" /><stop offset="1" stopColor="#6a3ff0" /></linearGradient></defs>
      <line x1="60" x2="540" y1="26" y2="26" stroke="#e6ebf2" strokeWidth="2" strokeDasharray="3 5" />
      <line x1="60" x2={x(active)} y1="26" y2="26" stroke="url(#hiw-g)" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'all .5s cubic-bezier(.22,1,.36,1)' }} />
      {!reduced && active > 0 && (
        <circle key={active} r="3.5" cy="26" fill="#fff" stroke="#6a3ff0" strokeWidth="2">
          <animate attributeName="cx" from="60" to={x(active)} dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}
      {labels.map((l, i) => (
        <g key={l} transform={`translate(${x(i)} 26)`}>
          {i === active && <circle r="15" fill="#8057ff" fillOpacity=".12" />}
          <circle r={i === active ? 9 : 6} fill={i <= active ? '#6a3ff0' : '#fff'} stroke={i <= active ? '#6a3ff0' : '#cfd6e2'} strokeWidth="2" style={{ transition: 'all .3s' }} />
          {i < active && <path d="M-3 0 l2 2 l4 -4" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
          {i === active && <text y="3.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">{i + 1}</text>}
          <text y="28" textAnchor="middle" fontSize="10.5" fill={i === active ? '#0d1424' : '#66748a'} fontWeight={i === active ? 600 : 400}>{l}</text>
        </g>
      ))}
    </svg>
  );
}
