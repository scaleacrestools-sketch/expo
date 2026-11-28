import { ArrowRight, Headphones } from 'lucide-react';
import { finalCta } from '../data/content';
import { Section } from '../components/ui/Section';
import { Reveal } from '../components/ui/Reveal';
import { useApp } from '../components/ui/AppContext';

export function FinalCTA() {
  const { openDemo, playSample } = useApp();
  const bars = 72;
  return (
    <Section id="cta" theme="dark" label="Get started" className="overflow-hidden">
      <div className="container-x pb-[var(--section-y)] pt-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-24" style={{ background: 'radial-gradient(90% 120% at 50% 0%, rgba(139,92,246,0.42) 0%, rgba(76,29,149,0.22) 38%, rgba(16,16,22,1) 72%)' }}>
            <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,#000_10%,transparent_65%)]" />
            <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[160px] w-full opacity-60" viewBox="0 0 1200 160" preserveAspectRatio="none">
              {Array.from({ length: bars }).map((_, i) => {
                const h = 20 + 110 * Math.abs(Math.sin(i * 0.35) * Math.cos(i * 0.11));
                return <rect key={i} x={i * (1200 / bars) + 4} y={160 - h} width={6} height={h} rx={3} fill="url(#ctaw)" className="wave-bar" style={{ transformOrigin: `center 160px`, animationDelay: `${-(i % 9) * 0.15}s`, animationDuration: `${1.4 + (i % 4) * 0.2}s` }} />;
              })}
              <defs><linearGradient id="ctaw" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c4b5fd" stopOpacity=".7" /><stop offset="1" stopColor="#6d28d9" stopOpacity="0" /></linearGradient></defs>
            </svg>
            <svg aria-hidden="true" className="absolute left-0 top-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none">
              <path d="M-20 420 C 300 300, 520 520, 1220 260" stroke="rgba(196,181,253,.25)" className="flow-dash" />
              <path d="M-20 200 C 380 360, 820 80, 1220 380" stroke="rgba(196,181,253,.15)" className="flow-dash" />
            </svg>
            <div className="relative">
              <span className="eyebrow">{finalCta.eyebrow}</span>
              <h2 className="h-section text-gradient mx-auto mt-6 max-w-[780px] text-[clamp(34px,5.2vw,64px)]">{finalCta.title}</h2>
              <p className="lead mx-auto mt-5 max-w-[560px] text-white/70">{finalCta.description}</p>
              <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <button onClick={openDemo} className="btn btn-primary h-12 px-7 text-[15.5px]" data-testid="cta-demo">{finalCta.primaryCta} <ArrowRight size={16} /></button>
                <button onClick={playSample} className="btn btn-secondary h-12 px-7 text-[15.5px]" data-testid="cta-sample"><Headphones size={16} /> {finalCta.secondaryCta}</button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
