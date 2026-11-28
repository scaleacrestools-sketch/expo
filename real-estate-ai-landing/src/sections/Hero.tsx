import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, Play, Phone } from 'lucide-react';
import { hero } from '../data/content';
import { Section } from '../components/ui/Section';
import { useApp } from '../components/ui/AppContext';
import { AppWindow } from '../components/dashboards/primitives';
import { CommandCenter } from '../components/dashboards/CommandCenter';
import { Waveform } from '../components/animations/Waveform';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';

const PHASES = 7; // 7 × 2s = 14s loop

export function Hero() {
  const { openDemo, playSample, openVideo } = useApp();
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [phase] = useLoop(PHASES, 2000, inView);
  const fade = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] as const } });

  return (
    <Section id="top" theme="dark" className="overflow-hidden pt-[120px] sm:pt-[150px]" label="Hero">
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-[-260px] h-[720px] w-[1100px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.45),rgba(109,40,217,0.18)_55%,transparent)] blur-2xl" style={{ animation: 'glow-drift 14s ease-in-out infinite', transform: 'translateX(-50%)' }} />
        <svg className="absolute left-1/2 top-[90px] w-[1400px] -translate-x-1/2 opacity-40" viewBox="0 0 1400 600" fill="none">
          <path d="M0 520 C 350 380, 1050 380, 1400 520" stroke="url(#arc)" />
          <path d="M100 600 C 420 430, 980 430, 1300 600" stroke="url(#arc)" />
          <defs><linearGradient id="arc" x1="0" x2="1400" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#8b5cf6" stopOpacity="0" /><stop offset=".5" stopColor="#c4b5fd" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>
        </svg>
      </div>

      <div className="container-x relative text-center">
        <motion.a href="#voice-agents" {...fade(0)} className="eyebrow !pr-2 hover:border-brand/50">
          {hero.eyebrow}
          <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-white/10"><ArrowRight size={11} /></span>
        </motion.a>
        <motion.h1 {...(reduce ? {} : { initial: { y: 14 }, animate: { y: 0 }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } })} className="h-display text-gradient mx-auto mt-6 max-w-[920px]">{hero.title}</motion.h1>
        <motion.p {...(reduce ? {} : { initial: { y: 14 }, animate: { y: 0 }, transition: { duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const } })} className="lead mx-auto mt-6 max-w-[580px] text-[17px] sm:text-[19px]">{hero.description}</motion.p>
        <motion.div {...fade(0.24)} className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={openDemo} className="btn btn-primary h-12 px-6 text-[15.5px]" data-testid="hero-demo">{hero.primaryCta} <ArrowRight size={16} /></button>
          <button type="button" onClick={playSample} className="btn btn-secondary h-12 px-6 text-[15.5px]" data-testid="hero-sample"><Phone size={15} /> {hero.secondaryCta}</button>
        </motion.div>
        <motion.ul {...fade(0.32)} className="mx-auto mt-8 flex max-w-[720px] flex-wrap justify-center gap-x-6 gap-y-2.5">
          {hero.features.map((f) => <li key={f} className="flex items-center gap-2 text-[14px] text-white/70"><CheckCircle2 size={15} className="text-[var(--brand-secondary)]" />{f}</li>)}
        </motion.ul>

        {/* Product */}
        <motion.div ref={ref} initial={reduce ? false : { opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-[1120px] pb-16 sm:mt-20 sm:pb-24" data-testid="hero-dashboard" data-phase={phase}>
          <div aria-hidden="true" className="absolute -inset-x-10 top-10 -z-0 h-[70%] rounded-[40px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),transparent)] blur-3xl" />
          <div className="relative rounded-[22px] border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur sm:p-2">
            <AppWindow path="campaigns/skyline-launch">
              <CommandCenter phase={phase} />
            </AppWindow>
          </div>

          {/* Floating cards */}
          <FloatCard className="float-a left-[-64px] top-[30%] hidden xl:block" show={phase >= 0} title="Incoming Lead" tone="#38bdf8">
            <Row k="Source" v="Meta Ads" /><Row k="Configuration" v="3 BHK" /><Row k="Budget" v="₹2 Crore" />
          </FloatCard>
          <FloatCard className="float-b right-[-64px] top-[18%] hidden xl:block" show={phase >= 1} title="AI Call in Progress" tone="#a78bfa">
            <div className="flex items-center gap-2"><span className="live-dot h-2 w-2 rounded-full bg-emerald-400" /><span className="text-[11.5px] text-white/70">{phase >= 2 && phase <= 4 ? 'Conversation active' : phase >= 5 ? 'Call ended' : 'Connecting…'}</span></div>
            <Waveform bars={22} active={phase >= 2 && phase <= 4} height={26} className="mt-2" />
          </FloatCard>
          <FloatCard className="float-c bottom-[12%] right-[-40px] hidden xl:block" show={phase >= 4} title="Lead Qualified" tone="#22c55e">
            {['Budget captured', 'Configuration captured', 'Site visit requested'].map((t, i) => (
              <p key={t} className={`flex items-center gap-1.5 text-[11.5px] transition-opacity duration-500 ${phase >= 4 + (i === 2 ? 1 : 0) ? 'text-white/80' : 'text-white/25'}`}><CheckCircle2 size={12} className="text-emerald-400" />{t}</p>
            ))}
          </FloatCard>

          {/* Mobile story strip */}
          <div className="mt-4 grid gap-2 text-left sm:grid-cols-3 xl:hidden">
            {[
              { t: 'Incoming Lead', d: 'Meta Ads · 3 BHK · ₹2 Crore', on: phase >= 0, c: '#38bdf8' },
              { t: 'AI Call in Progress', d: phase >= 2 && phase <= 4 ? 'Conversation active' : 'Live waveform', on: phase >= 1, c: '#a78bfa' },
              { t: 'Lead Qualified', d: 'Budget · Configuration · Visit', on: phase >= 4, c: '#22c55e' },
            ].map((c) => (
              <div key={c.t} className={`card flex items-center gap-3 p-3 transition-opacity duration-500 ${c.on ? 'opacity-100' : 'opacity-40'}`}>
                <span className="h-8 w-1 rounded-full" style={{ background: c.c }} />
                <div><p className="text-[13px] font-medium text-white">{c.t}</p><p className="text-[12px] text-white/55">{c.d}</p></div>
              </div>
            ))}
          </div>

          <button type="button" onClick={openVideo} className="relative mx-auto mt-5 flex w-max items-center gap-2 rounded-full sm:absolute sm:bottom-8 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2 border border-white/10 bg-black/40 px-4 py-2 text-[13px] text-white/80 backdrop-blur transition hover:border-[var(--brand-primary)] hover:text-white" data-testid="open-video">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--brand-primary)]"><Play size={11} fill="currentColor" /></span> Watch the 30-second product walkthrough
          </button>
        </motion.div>
      </div>
    </Section>
  );
}

function FloatCard({ title, children, className, show, tone }: { title: string; children: React.ReactNode; className: string; show: boolean; tone: string }) {
  return (
    <div className={`absolute z-10 w-[210px] ${className}`} aria-hidden="true">
      <div className={`rounded-2xl border border-white/10 bg-[rgba(16,16,22,0.82)] p-3.5 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-700 ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        <p className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-white"><span className="h-2 w-2 rounded-full" style={{ background: tone, boxShadow: `0 0 10px ${tone}` }} />{title}</p>
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <p className="flex justify-between text-[11.5px]"><span className="text-white/50">{k}</span><span className="font-medium text-white/90">{v}</span></p>;
}
