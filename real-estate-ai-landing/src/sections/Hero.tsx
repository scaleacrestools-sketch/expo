import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, Phone, Play } from 'lucide-react';
import { hero } from '../data/content';
import { story } from '../data/story';
import { ease, loops } from '../config/motion';
import { Section } from '../components/ui/Section';
import { useApp } from '../components/ui/AppContext';
import { AppWindow } from '../components/dashboards/primitives';
import { CommandCenter, HERO_STEPS } from '../components/dashboards/CommandCenter';
import { Waveform } from '../components/animations/Waveform';
import { HeroMobile } from '../components/dashboards/HeroMobile';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';

export function Hero() {
  const { openDemo, playSample, openVideo } = useApp();
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [phase] = useLoop(HERO_STEPS.length, loops.hero, inView);
  // Text renders immediately (LCP); only a short rise is animated.
  const rise = (d: number) => (reduce ? {} : { initial: { y: 12 }, animate: { y: 0 }, transition: { duration: 0.5, delay: d, ease } });
  const fade = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: d, ease } });

  return (
    <Section id="top" theme="dark" className="overflow-hidden pt-[96px] sm:pt-[112px]" label="Hero">
      {/* Static background: Agenly-style grid, top glow and horizon behind the product */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_65%_50%_at_50%_0%,#000_25%,transparent_75%)]" />
        <div className="absolute left-1/2 top-[-320px] h-[640px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(128,87,255,0.38),rgba(72,38,179,0.12)_60%,transparent)]" />
        <div className="absolute inset-x-0 top-[520px] h-[520px] bg-[radial-gradient(50%_60%_at_50%_40%,rgba(24,86,255,0.16),transparent_70%)]" />
        <svg className="absolute left-1/2 top-[300px] w-[1500px] -translate-x-1/2 opacity-50" viewBox="0 0 1500 400" fill="none">
          <path d="M0 330 C 380 210, 1120 210, 1500 330" stroke="url(#arc)" />
          <defs><linearGradient id="arc" x1="0" x2="1500" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#8057ff" stopOpacity="0" /><stop offset=".5" stopColor="#cbbdff" stopOpacity=".8" /><stop offset="1" stopColor="#8057ff" stopOpacity="0" /></linearGradient></defs>
        </svg>
      </div>

      <div className="container-x relative text-center">
        <motion.a href="#voice-agents" {...fade(0)} className="eyebrow hover:border-brand/50">
          {hero.eyebrow}<ArrowRight size={12} className="opacity-60" />
        </motion.a>
        <motion.h1 {...rise(0.04)} className="h-display text-gradient mx-auto mt-5 max-w-[880px]">{hero.title}</motion.h1>
        <motion.p {...rise(0.08)} className="lead mx-auto mt-5 max-w-[560px] text-[17px] sm:text-[18px]">{hero.description}</motion.p>
        <motion.div {...fade(0.14)} className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={openDemo} className="btn btn-primary h-12" data-testid="hero-demo">{hero.primaryCta} <ArrowRight size={16} /></button>
          <button type="button" onClick={openVideo} className="btn btn-secondary h-12" data-testid="hero-video"><span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#0d0d1c]"><Play size={9} fill="currentColor" className="translate-x-[0.5px]" /></span>{hero.videoCta}</button>
          <button type="button" onClick={playSample} className="btn-ghost justify-center" data-testid="hero-sample"><Phone size={15} className="text-[var(--brand-accent)]" />{hero.secondaryCta}</button>
        </motion.div>
        <motion.ul {...fade(0.2)} className="mx-auto mt-6 flex max-w-[720px] flex-wrap justify-center gap-x-5 gap-y-2">
          {hero.features.map((f) => <li key={f} className="flex items-center gap-1.5 text-[13.5px] text-[var(--c-text)]"><CheckCircle2 size={14} className="text-[var(--brand-secondary)]" />{f}</li>)}
        </motion.ul>

        {/* Product */}
        <motion.div ref={ref} initial={reduce ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }}
          className="relative mx-auto mt-10 max-w-[1080px] pb-12 sm:pb-16" data-testid="hero-dashboard" data-phase={phase}>
          <div className="sm:hidden"><HeroMobile phase={phase} /></div>
          <div className="relative hidden rounded-[22px] border border-white/10 bg-white/[0.025] p-1.5 shadow-[0_40px_120px_-40px_rgba(24,86,255,0.35)] sm:block sm:p-2">
            <AppWindow path="campaigns/skyline-launch">
              <CommandCenter phase={phase} />
            </AppWindow>
          </div>

          {/* Floating layered cards (desktop) */}
          <FloatCard className="float-a left-[-96px] top-[30%] hidden xl:block min-[1400px]:left-[-188px]" show title="Incoming Lead" tone="#38bdf8" active={phase === 0}>
            <Row k="Source" v={story.buyer.source} /><Row k="Configuration" v={story.requirement.configuration} /><Row k="Budget" v={story.requirement.budget} />
          </FloatCard>
          <FloatCard className="float-b right-[-96px] top-[14%] hidden xl:block min-[1400px]:right-[-188px]" show={phase >= 1} title="AI Call in Progress" tone="#a48bff" active={phase >= 2 && phase <= 4}>
            <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${phase >= 3 && phase <= 5 ? 'live-dot bg-[#12b881]' : 'bg-white/30'}`} /><span className="text-[11.5px] text-white/70">{phase >= 3 && phase <= 5 ? 'Conversation active' : phase >= 6 ? 'Call ended · 1m 12s' : 'Connecting…'}</span></div>
            <Waveform bars={22} active={phase >= 3 && phase <= 5} height={24} className="mt-2" />
          </FloatCard>
          <FloatCard className="float-c bottom-[22%] right-[-96px] hidden xl:block min-[1400px]:right-[-188px]" show={phase >= 4} title="Lead Qualified" tone="#12b881" active={phase >= 5 && phase <= 7}>
            {['Budget captured', 'Configuration captured', 'Site visit requested'].map((t, i) => (
              <p key={t} className={`flex items-center gap-1.5 text-[11.5px] transition-opacity duration-300 ${phase >= [4, 4, 7][i] ? 'text-white/85' : 'text-white/25'}`}><CheckCircle2 size={12} className="text-[#12b881]" />{t}</p>
            ))}
          </FloatCard>

          {/* Step indicator */}
          <div className="mx-auto mt-5 hidden max-w-[640px] sm:flex items-center justify-center gap-3" aria-hidden="true">
            <div className="flex gap-1">{HERO_STEPS.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all duration-300 ${i === phase ? 'w-6 bg-[var(--brand-secondary)]' : i < phase ? 'w-2 bg-white/40' : 'w-2 bg-white/15'}`} />)}</div>
            <span className="min-w-[220px] text-left text-[12.5px] text-[var(--c-text)]">{String(phase + 1).padStart(2, '0')} · {HERO_STEPS[phase]}</span>
          </div>

          {/* Mobile story strip */}
          <div className="mt-4 hidden gap-2 text-left sm:grid sm:grid-cols-3 xl:hidden">
            {[
              { t: 'Incoming Lead', d: `${story.buyer.source} · ${story.requirement.configuration} · ${story.requirement.budget}`, on: true, c: '#38bdf8' },
              { t: 'AI Call in Progress', d: phase >= 3 && phase <= 5 ? 'Conversation active' : phase >= 6 ? 'Call ended' : 'Connecting', on: phase >= 1, c: '#a48bff' },
              { t: 'Lead Qualified', d: `Score ${story.score} · visit requested`, on: phase >= 5, c: '#12b881' },
            ].map((c) => (
              <div key={c.t} className={`card flex items-center gap-3 p-3 transition-opacity duration-300 ${c.on ? 'opacity-100' : 'opacity-40'}`}>
                <span className="h-8 w-1 rounded-full" style={{ background: c.c }} />
                <div><p className="text-[13px] font-medium text-white">{c.t}</p><p className="text-[12px] text-[var(--c-text)]">{c.d}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function FloatCard({ title, children, className, show, tone, active }: { title: string; children: React.ReactNode; className: string; show: boolean; tone: string; active: boolean }) {
  return (
    <div className={`absolute z-10 w-[172px] ${className}`} aria-hidden="true">
      <div className={`rounded-2xl border bg-[rgba(17,18,37,0.86)] p-3.5 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9),inset_0_-16px_64px_rgba(116,176,253,.06)] backdrop-blur-xl transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} ${active ? 'border-white/25' : 'border-white/10'}`}>
        <p className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-white"><span className="h-2 w-2 rounded-full" style={{ background: tone }} />{title}</p>
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <p className="flex justify-between text-[11.5px]"><span className="text-white/55">{k}</span><span className="font-medium text-white/90">{v}</span></p>;
}
