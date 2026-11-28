import { useState } from 'react';
import { brand } from '../config/brand';
import { integrationsCopy } from '../data/content';
import { destinations, leadSources, type Integration } from '../data/integrations';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { LogoMark } from '../components/ui/Logo';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const W = 1000, H = 600, ROWS = 6;
const rowY = (i: number) => 50 + i * ((H - 100) / (ROWS - 1));

export function Integrations() {
  const [hover, setHover] = useState<string | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const pathL = (i: number) => `M262 ${rowY(i)} C 380 ${rowY(i)}, 380 300, 440 300`;
  const pathR = (i: number) => `M560 300 C 620 300, 620 ${rowY(i)}, 738 ${rowY(i)}`;

  return (
    <Section id="integrations" theme="dark" label="Integrations" className="overflow-hidden">
      <div className="container-x section-y">
        <SectionHeader eyebrow={integrationsCopy.eyebrow} title={integrationsCopy.title} description={integrationsCopy.description} />
        <Reveal className="mt-14">
          <div ref={ref} className="card relative overflow-hidden p-4 sm:p-8" data-testid="integrations">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.3),transparent)]" />
            <div className="relative mb-6 flex flex-wrap items-center justify-between gap-2 text-[12px] text-white/50">
              <span className="font-medium uppercase tracking-[0.12em]">Lead sources</span>
              <span className="hidden font-medium uppercase tracking-[0.12em] md:inline">Outcome destinations</span>
            </div>

            {/* Desktop */}
            <div className="relative hidden md:block" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                {leadSources.map((s, i) => {
                  const on = hover === s.name;
                  return (
                    <g key={s.name}>
                      <path id={`in-l-${i}`} d={pathL(i)} fill="none" stroke={on ? s.color : 'rgba(255,255,255,.12)'} strokeWidth={on ? 2 : 1.2} />
                      {inView && !reduced && <circle r="3" fill={s.color}><animateMotion dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite"><mpath href={`#in-l-${i}`} /></animateMotion></circle>}
                    </g>
                  );
                })}
                {destinations.map((s, i) => {
                  const on = hover === s.name;
                  return (
                    <g key={s.name}>
                      <path id={`in-r-${i}`} d={pathR(i)} fill="none" stroke={on ? s.color : 'rgba(255,255,255,.12)'} strokeWidth={on ? 2 : 1.2} />
                      {inView && !reduced && <circle r="3" fill={s.color}><animateMotion dur={`${2.4 + i * 0.2}s`} begin={`${i * 0.3}s`} repeatCount="indefinite"><mpath href={`#in-r-${i}`} /></animateMotion></circle>}
                    </g>
                  );
                })}
              </svg>
              {leadSources.map((s, i) => <Card key={s.name} it={s} style={{ left: 0, top: `${(rowY(i) / H) * 100}%`, width: '26.2%' }} hover={hover} setHover={setHover} />)}
              {destinations.map((s, i) => <Card key={s.name} it={s} style={{ right: 0, top: `${(rowY(i) / H) * 100}%`, width: '26.2%' }} hover={hover} setHover={setHover} align="right" />)}
              <Center />
            </div>

            {/* Mobile */}
            <div className="relative md:hidden">
              <ul className="grid grid-cols-2 gap-2">{leadSources.map((s) => <li key={s.name}><Card it={s} hover={hover} setHover={setHover} static /></li>)}</ul>
              <svg viewBox="0 0 20 40" className="mx-auto my-1 block h-10 w-5" aria-hidden="true"><path d="M10 0 V40" stroke="rgba(167,139,250,.7)" strokeWidth="1.5" className="flow-dash" /></svg>
              <div className="mx-auto w-max"><Center inline /></div>
              <svg viewBox="0 0 20 40" className="mx-auto my-1 block h-10 w-5" aria-hidden="true"><path d="M10 0 V40" stroke="rgba(167,139,250,.7)" strokeWidth="1.5" className="flow-dash" /></svg>
              <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-white/50">Outcome destinations</p>
              <ul className="grid grid-cols-2 gap-2">{destinations.map((s) => <li key={s.name}><Card it={s} hover={hover} setHover={setHover} static /></li>)}</ul>
            </div>

            <p className="relative mt-6 border-t border-white/[0.07] pt-5 text-center text-[12.5px] leading-relaxed text-white/45">
              All integrations shown are <b className="font-medium text-white/70">planned</b> and not yet available. Product names and trademarks belong to their respective owners and are used only to describe compatibility goals. No partnership, endorsement or certification is implied.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Center({ inline = false }: { inline?: boolean }) {
  return (
    <div className={`${inline ? '' : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'} z-[2] flex flex-col items-center`}>
      <div className="relative grid h-[96px] w-[96px] place-items-center rounded-[28px] border border-brand/50 bg-[#121219] shadow-[0_0_80px_-10px_rgba(139,92,246,.8)] lg:h-[120px] lg:w-[120px]">
        <span aria-hidden="true" className="absolute -inset-3 rounded-[34px] border border-white/[0.06]" />
        <span aria-hidden="true" className="absolute -inset-6 rounded-[40px] border border-dashed border-white/[0.05] [animation:spin-slow_40s_linear_infinite]" />
        <LogoMark size={52} />
      </div>
      <p className="mt-3 whitespace-nowrap text-[14px] font-semibold text-white">{brand.productName} AI</p>
    </div>
  );
}

function Card({ it, style, hover, setHover, align = 'left', static: isStatic = false }: { it: Integration; style?: React.CSSProperties; hover: string | null; setHover: (s: string | null) => void; align?: 'left' | 'right'; static?: boolean }) {
  const on = hover === it.name;
  return (
    <div tabIndex={0} role="group" aria-label={`${it.name}, ${it.status}: ${it.description}`} data-testid="integration-card"
      onMouseEnter={() => setHover(it.name)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(it.name)} onBlur={() => setHover(null)}
      className={`${isStatic ? 'relative' : 'absolute -translate-y-1/2'} z-[1] rounded-2xl border bg-[rgba(18,18,25,.92)] p-2.5 backdrop-blur transition-all duration-300 lg:p-3 ${on ? 'border-white/25 shadow-[0_10px_40px_-12px_var(--g)]' : 'border-white/10'}`}
      style={{ ...style, ['--g' as string]: it.color }}>
      <div className={`flex items-center gap-2.5 ${align === 'right' ? 'lg:flex-row' : ''}`}>
        <span className="grid h-9 w-9 flex-none place-items-center rounded-xl text-[12px] font-bold tracking-tight text-white" style={{ background: `linear-gradient(135deg, ${it.color}, ${it.color}99)` }} aria-hidden="true">{it.monogram}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-white">{it.name}</span>
          <span className="block text-[10.5px] font-medium uppercase tracking-[0.08em] text-amber-300/80">{it.status}</span>
        </span>
      </div>
      {on && !isStatic && <p role="tooltip" className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 rounded-lg border border-white/10 bg-[#16161e] px-3 py-2 text-[11.5px] text-white/75 shadow-xl">{it.description}</p>}
      {isStatic && <p className="mt-1.5 text-[11px] leading-snug text-white/50">{it.description}</p>}
    </div>
  );
}
