import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CalendarCheck2, CheckCircle2, MessageCircle, Phone, PhoneCall, Play, UserPlus } from 'lucide-react';
import { hero } from '../data/content';
import { story } from '../data/story';
import { ease, loops } from '../config/motion';
import { Section } from '../components/ui/Section';
import { useApp } from '../components/ui/AppContext';
import { DashboardShell, NotificationCard, VoiceWaveform } from '../components/product';
import { CommandCenter, HERO_STEPS } from '../components/dashboards/CommandCenter';
import { HeroMobile } from '../components/dashboards/HeroMobile';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';

export function Hero() {
  const { openDemo, playSample, openVideo } = useApp();
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [phase] = useLoop(HERO_STEPS.length, loops.hero, inView);
  // Render only the composition this screen uses (the other one was pure main-thread cost).
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.matchMedia('(min-width: 640px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)'); const on = () => setWide(mq.matches);
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  // Text renders immediately (LCP); only a short rise is animated.
  const rise = (d: number) => (reduce ? {} : { initial: { y: 12 }, animate: { y: 0 }, transition: { duration: 0.5, delay: d, ease } });
  const fade = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: d, ease } });

  return (
    <Section id="top" theme="dark" className="overflow-hidden pt-[88px] sm:pt-[100px]" label="Hero">
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
        <motion.h1 {...rise(0.04)} className="h-display text-gradient mx-auto mt-4 max-w-[880px] lg:!text-[68px]">{hero.title}</motion.h1>
        <motion.p {...rise(0.08)} className="lead mx-auto mt-4 max-w-[560px] text-[17px] sm:text-[18px]">{hero.description}</motion.p>
        <motion.div {...fade(0.14)} className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={openDemo} className="btn btn-primary h-12" data-testid="hero-demo">{hero.primaryCta} <ArrowRight size={16} /></button>
          <button type="button" onClick={openVideo} className="btn btn-secondary h-12" data-testid="hero-video"><span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#0d0d1c]"><Play size={9} fill="currentColor" className="translate-x-[0.5px]" /></span>{hero.videoCta}</button>
          <button type="button" onClick={playSample} className="btn-ghost justify-center" data-testid="hero-sample"><Phone size={15} className="text-[var(--brand-accent)]" />{hero.secondaryCta}</button>
        </motion.div>
        <motion.ul {...fade(0.2)} className="mx-auto mt-5 flex max-w-[720px] flex-wrap justify-center gap-x-5 gap-y-2">
          {hero.features.map((f) => <li key={f} className="flex items-center gap-1.5 text-[13.5px] text-[var(--c-text)]"><CheckCircle2 size={14} className="text-[var(--brand-secondary)]" />{f}</li>)}
        </motion.ul>

        {/* Product: white CRM on the dark stage */}
        <motion.div ref={ref} initial={reduce ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }}
          className="relative mx-auto mt-8 max-w-[1080px] pb-12 sm:pb-16" data-testid="hero-dashboard" data-phase={phase}>
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-10 -top-8 bottom-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(128,87,255,.35),transparent_70%)] blur-2xl" />
          {wide ? (
            <div className="relative rounded-[22px] border border-white/15 bg-white/[0.06] p-1.5">
              <DashboardShell path="overview"><CommandCenter phase={phase} /></DashboardShell>
            </div>
          ) : <div className="relative"><HeroMobile phase={phase} /></div>}

          {/* Floating product notifications (desktop). They sit outside the dashboard edge and never cover its data. */}
          <Float className="float-a left-[-84px] top-[54%] xl:block min-[1440px]:left-[-170px] min-[1440px]:top-[18%]" show>
            <NotificationCard icon={UserPlus} tone="info" title="New lead received">
              <Row k="Source" v={story.buyer.source} /><Row k="Looking for" v={story.requirement.configuration} /><Row k="Budget" v={story.requirement.budget} />
            </NotificationCard>
          </Float>
          <Float className="float-b right-[-170px] top-[10%] min-[1440px]:block" show={phase >= 1 && phase <= 6}>
            <NotificationCard icon={PhoneCall} tone="accent" title="AI call in progress">
              <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${phase >= 3 && phase <= 5 ? 'p-live bg-[var(--p-success)]' : 'bg-[#d0d5dd]'}`} />{phase >= 3 && phase <= 5 ? 'Conversation active' : phase >= 6 ? 'Call ended · 1m 12s' : 'Connecting…'}</span>
              <VoiceWaveform bars={20} active={phase >= 3 && phase <= 5} height={20} className="mt-1.5" />
            </NotificationCard>
          </Float>
          <Float className="float-c right-[-170px] top-[44%] min-[1440px]:block" show={phase >= 5}>
            <NotificationCard icon={CheckCircle2} tone="success" title="Buyer qualified">
              <span className="block">Score <b className="font-semibold text-[var(--p-text)]">{story.score}</b> · Hot lead</span>
              <span className="block">{story.requirement.configuration} · {story.requirement.budgetShort} · {story.requirement.timeline}</span>
            </NotificationCard>
          </Float>
          <Float className="float-c bottom-[22%] left-[-170px] min-[1440px]:block" show={phase >= 7}>
            <NotificationCard icon={CalendarCheck2} tone="warning" title="Site visit requested">{story.visit.label} · {story.visit.time}</NotificationCard>
          </Float>
          <Float className="float-a bottom-[12%] right-[-170px] min-[1440px]:block" show={phase >= 8}>
            <NotificationCard icon={MessageCircle} tone="whatsapp" title="WhatsApp follow-up">Brochure sent · delivered ✓✓</NotificationCard>
          </Float>

          {/* Step indicator */}
          <div className="relative mx-auto mt-5 hidden max-w-[640px] items-center justify-center gap-3 sm:flex" aria-hidden="true">
            <div className="flex gap-1">{HERO_STEPS.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all duration-300 ${i === phase ? 'w-6 bg-[var(--brand-secondary)]' : i < phase ? 'w-2 bg-white/40' : 'w-2 bg-white/15'}`} />)}</div>
            <span className="min-w-[230px] text-left text-[12.5px] text-[var(--c-text)]">{String(phase + 1).padStart(2, '0')} · {HERO_STEPS[phase]}</span>
          </div>
          <p className="relative mt-3 text-center text-[12.5px] text-[var(--c-text)] sm:hidden" aria-hidden="true">{HERO_STEPS[phase]}</p>
        </motion.div>
      </div>
    </Section>
  );
}

function Float({ children, className, show }: { children: React.ReactNode; className: string; show: boolean }) {
  return (
    <div className={`absolute z-10 hidden w-[176px] ${className}`} aria-hidden="true">
      <div className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'}`}>{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <span className="flex justify-between"><span className="text-[var(--p-muted)]">{k}</span><span className="font-semibold text-[var(--p-text)]">{v}</span></span>;
}
