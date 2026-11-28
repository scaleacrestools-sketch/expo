import { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { brand } from '../config/brand';
import { integrationsCopy } from '../data/content';
import { destinations, leadSources, type Integration } from '../data/integrations';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { LogoMark } from '../components/ui/Logo';
import { IntegrationIcon } from '../components/ui/IntegrationIcon';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';
import { useElementSize } from '../hooks/useElementSize';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { loops } from '../config/motion';

const ROW = 56, GAP = 12, N = 6;
const H = N * ROW + (N - 1) * GAP; // 396
const rowY = (i: number) => i * (ROW + GAP) + ROW / 2;

/**
 * Integration hub. One source → engine → destination pair lights up at a time (≈1.5 s each, 9 s cycle):
 * a particle travels along the source beam into the engine, then out along the destination beam.
 */
export function Integrations() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [step] = useLoop(N, loops.integration, inView, 0);
  const [hover, setHover] = useState<{ side: 'l' | 'r'; i: number } | null>(null);
  const activeL = hover ? (hover.side === 'l' ? hover.i : -1) : step;
  const activeR = hover ? (hover.side === 'r' ? hover.i : -1) : step;
  const pairLabel = `${leadSources[step].name} → ${destinations[step].name}`;

  return (
    <Section id="integrations" theme="dark" sheet horizon label="Integrations" className="overflow-hidden">
      <div className="container-x section-y relative">
        <SectionHeader eyebrow={integrationsCopy.eyebrow} title={integrationsCopy.title} description={integrationsCopy.description} />

        <Reveal className="mt-12" variant="scale">
          <div ref={ref} className="card relative overflow-hidden px-4 py-8 sm:px-8 lg:px-10 lg:py-12" data-testid="integrations" data-step={step}>
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(128,87,255,0.28),transparent)]" />
            <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_70%)]" />

            {/* Desktop hub */}
            <div className="relative hidden lg:grid lg:grid-cols-[236px_1fr_236px] lg:items-start">
              <Column title="Lead sources" items={leadSources} active={activeL} side="l" onHover={setHover} />
              <Beams activeL={activeL} activeR={activeR} step={step} hover={!!hover} animate={inView && !reduced} label={hover ? '' : pairLabel} />
              <Column title="Outcome destinations" items={destinations} active={activeR} side="r" onHover={setHover} />
            </div>

            {/* Mobile / tablet: compact grid → engine → grid, with a vertical data flow */}
            <div className="relative lg:hidden" data-testid="integrations-mobile">
              <p className="mb-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--c-muted)]">Lead sources</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">{leadSources.map((it, i) => <Tile key={it.name} it={it} on={i === step} />)}</ul>
              <Flow animate={inView && !reduced} k={`a${step}`} />
              <Engine label={pairLabel} compact />
              <Flow animate={inView && !reduced} k={`b${step}`} delay />
              <p className="mb-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--c-muted)]">Outcome destinations</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">{destinations.map((it, i) => <Tile key={it.name} it={it} on={i === step} />)}</ul>
            </div>

            <p className="relative mx-auto mt-8 flex max-w-[760px] items-start gap-2 text-left text-[12.5px] lg:justify-center lg:text-center leading-relaxed text-[var(--c-muted)]" data-testid="integrations-disclosure">
              <Info size={14} className="mt-0.5 flex-none text-[var(--brand-accent)]" />
              <span><b className="font-medium text-[var(--c-head)]">All integrations shown are planned</b> and illustrate intended compatibility; none are live in this preview. Brand names and logos belong to their owners; no partnership or endorsement is implied.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Column({ title, items, active, side, onHover }: { title: string; items: Integration[]; active: number; side: 'l' | 'r'; onHover: (v: { side: 'l' | 'r'; i: number } | null) => void }) {
  return (
    <div>
      <p className={`mb-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--c-muted)] ${side === 'r' ? 'text-right' : ''}`}>{title}</p>
      <ul className="flex flex-col" style={{ gap: GAP }}>
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.name} style={{ height: ROW }}>
              <div tabIndex={0} role="group" aria-label={`${it.name}: ${it.detail} (planned)`} data-testid="integration-card"
                onMouseEnter={() => onHover({ side, i })} onMouseLeave={() => onHover(null)} onFocus={() => onHover({ side, i })} onBlur={() => onHover(null)}
                className={`flex h-full items-center gap-3 rounded-2xl border px-3 transition-[border-color,background-color,box-shadow,transform] duration-200 ${side === 'r' ? 'flex-row-reverse text-right' : ''} ${on ? 'border-brand/60 bg-brand/[0.12] shadow-[0_0_0_1px_rgba(128,87,255,.25),0_14px_40px_-16px_rgba(128,87,255,.8)]' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}>
                <IntegrationIcon it={it} />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium text-white">{it.name}</span>
                  <span className="block truncate text-[11.5px] text-[var(--c-muted)]">{it.detail}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Engine({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className={`relative z-[2] mx-auto flex flex-col items-center text-center ${compact ? 'w-full max-w-[300px]' : ''}`} data-testid="integration-engine">
      <div className={`relative grid place-items-center rounded-[30px] border border-brand/50 bg-[linear-gradient(180deg,#1a1640,#0d0d1c)] shadow-[0_0_90px_-10px_rgba(128,87,255,.9),inset_0_1px_0_rgba(255,255,255,.12),inset_0_-16px_64px_rgba(116,176,253,.08)] ${compact ? 'h-[96px] w-[96px]' : 'h-[132px] w-[132px]'}`}>
        <span aria-hidden="true" className="absolute -inset-3 rounded-[36px] border border-brand/25" />
        <span aria-hidden="true" className="absolute -inset-8 rounded-full border border-dashed border-white/[0.07] [animation:spin-slow_40s_linear_infinite]" />
        <LogoMark size={compact ? 44 : 60} />
      </div>
      <p className="mt-4 text-[15px] font-semibold text-white">{brand.productName} AI engine</p>
      <p className="mt-1 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-[var(--c-text)]"><span className="live-dot h-1.5 w-1.5 rounded-full bg-[#12b881]" />{label ? <span key={label} style={{ animation: 'rise .3s var(--ease-out) both' }}>{label}</span> : 'Hover a tool to trace it'}</p>
    </div>
  );
}

function Beams({ activeL, activeR, step, hover, animate, label }: { activeL: number; activeR: number; step: number; hover: boolean; animate: boolean; label: string }) {
  const { ref, width: W } = useElementSize<HTMLDivElement>();
  const cy = H / 2 + 6; const inL = W / 2 - 76, outR = W / 2 + 76;
  const pathL = (i: number) => `M0 ${rowY(i) + 30} C ${W * 0.22} ${rowY(i) + 30}, ${inL - W * 0.12} ${cy}, ${inL} ${cy}`;
  const pathR = (i: number) => `M${outR} ${cy} C ${outR + W * 0.12} ${cy}, ${W - W * 0.22} ${rowY(i) + 30}, ${W} ${rowY(i) + 30}`;
  return (
    <div ref={ref} className="relative" style={{ height: H + 30 }} data-testid="integration-beams">
      {W > 0 && (
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H + 30}`} aria-hidden="true">
          <defs>
            <linearGradient id="beam-l" x1="0" x2="1"><stop stopColor="#8057ff" stopOpacity="0" /><stop offset=".5" stopColor="#a48bff" /><stop offset="1" stopColor="#cbbdff" /></linearGradient>
            <linearGradient id="beam-r" x1="0" x2="1"><stop stopColor="#cbbdff" /><stop offset=".5" stopColor="#a48bff" /><stop offset="1" stopColor="#8057ff" stopOpacity="0" /></linearGradient>
          </defs>
          {Array.from({ length: N }).map((_, i) => (
            <g key={i}>
              <path id={`ib-l-${i}`} d={pathL(i)} fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1.2" />
              <path id={`ib-r-${i}`} d={pathR(i)} fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1.2" />
            </g>
          ))}
          {activeL >= 0 && <><path d={pathL(activeL)} fill="none" stroke="#8057ff" strokeOpacity=".35" strokeWidth="7" style={{ filter: 'blur(4px)' }} /><path d={pathL(activeL)} fill="none" stroke="url(#beam-l)" strokeWidth="2" /></>}
          {activeR >= 0 && <><path d={pathR(activeR)} fill="none" stroke="#8057ff" strokeOpacity=".35" strokeWidth="7" style={{ filter: 'blur(4px)' }} /><path d={pathR(activeR)} fill="none" stroke="url(#beam-r)" strokeWidth="2" /></>}
          {animate && !hover && (
            <g key={step}>
              {[0, 0.12, 0.24].map((d, k) => (
                <circle key={`l${k}`} r={k === 0 ? 4 : 2.5} fill="#fff" opacity="0">
                  <animateMotion dur="0.8s" begin={`${d}s`} fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .2 1"><mpath href={`#ib-l-${step}`} /></animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="0.8s" begin={`${d}s`} fill="freeze" />
                </circle>
              ))}
              {[0, 0.12, 0.24].map((d, k) => (
                <circle key={`r${k}`} r={k === 0 ? 4 : 2.5} fill="#fff" opacity="0">
                  <animateMotion dur="0.8s" begin={`${0.75 + d}s`} fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .2 1"><mpath href={`#ib-r-${step}`} /></animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="0.8s" begin={`${0.75 + d}s`} fill="freeze" />
                </circle>
              ))}
            </g>
          )}
        </svg>
      )}
      <div className="absolute inset-x-0" style={{ top: H / 2 + 6 - 66 }}><Engine label={label} /></div>
    </div>
  );
}

function Tile({ it, on }: { it: Integration; on: boolean }) {
  return (
    <li data-testid="integration-tile" className={`flex min-h-[52px] items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-[border-color,background-color] duration-200 ${on ? 'border-brand/60 bg-brand/[0.14]' : 'border-white/10 bg-white/[0.03]'}`}>
      <IntegrationIcon it={it} size={30} />
      <span className="min-w-0 text-[13px] font-medium leading-tight text-white">{it.name}</span>
    </li>
  );
}

function Flow({ animate, k, delay = false }: { animate: boolean; k: string; delay?: boolean }) {
  return (
    <div className="relative mx-auto my-3 h-14 w-px bg-gradient-to-b from-white/5 via-brand/60 to-white/5" aria-hidden="true">
      {animate && <span key={k} className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(164,139,255,.8)]" style={{ animation: `flow-down .8s ${delay ? '.75s' : '0s'} cubic-bezier(.4,0,.2,1) both` }} />}
      <ArrowRight size={12} className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-90 text-[var(--brand-accent)]" />
    </div>
  );
}
