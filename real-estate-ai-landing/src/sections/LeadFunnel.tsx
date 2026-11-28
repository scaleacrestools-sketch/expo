import { useState } from 'react';
import { ArrowDown, Bot, User } from 'lucide-react';
import { funnelCopy } from '../data/content';
import { funnel } from '../data/demo-data';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { DemoTag } from '../components/ui/DemoTag';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';

type Mode = 'ai' | 'manual';

export function LeadFunnel() {
  const [mode, setMode] = useState<Mode>('ai');
  const [hover, setHover] = useState<number | null>(null);
  const { ref, inView: live, seen: inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const vals = funnel[mode];
  const other = funnel[mode === 'ai' ? 'manual' : 'ai'];

  return (
    <Section id="funnel" theme="light" alt label="Lead conversion funnel">
      <div className="container-x section-y">
        <SectionHeader eyebrow={funnelCopy.eyebrow} title={funnelCopy.title} description={funnelCopy.description} />

        <Reveal className="mt-14" variant="tilt">
          <div ref={ref} className="card overflow-hidden p-5 sm:p-8" data-testid="funnel">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div role="tablist" aria-label="Workflow comparison" className="inline-flex rounded-full border border-[var(--c-line)] bg-[var(--light-background-secondary)] p-1">
                {([['ai', 'AI-assisted workflow', Bot], ['manual', 'Manual workflow', User]] as const).map(([k, l, I]) => (
                  <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} data-testid={`funnel-${k}`}
                    className={`flex min-h-[40px] items-center gap-2 rounded-full px-4 text-[14px] font-medium transition ${mode === k ? 'bg-[#0f0f14] text-white shadow' : 'text-[var(--c-text)] hover:text-[var(--c-head)]'}`}>
                    <I size={15} /><span className="hidden sm:inline">{l}</span><span className="sm:hidden">{l.replace(' workflow', '')}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[12.5px]">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--brand-primary)]" />AI-assisted</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-dashed border-[#a1a1aa] bg-[#f1f1f4]" />Manual</span>
                <DemoTag label="Illustrative data" />
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
              {/* Funnel */}
              <div className="relative">
                {funnel.stages.map((stage, i) => {
                  const ai = funnel.ai[i], man = funnel.manual[i];
                  const base = typeof window !== 'undefined' && window.innerWidth < 640 ? 36 : 22;
                  const wAi = base + (ai / 1000) * (100 - base), wMan = base + (man / 1000) * (100 - base);
                  const conv = i > 0 ? Math.round((vals[i] / vals[i - 1]) * 100) : null;
                  return (
                    <div key={stage}>
                      {i > 0 && (
                        <div className="flex h-8 items-center justify-center gap-2 text-[11.5px] text-[var(--c-muted)]">
                          <svg width="10" height="32" viewBox="0 0 10 32" aria-hidden="true"><line x1="5" x2="5" y1="0" y2="32" stroke="var(--brand-secondary)" strokeWidth="2" className="flow-dash" />{live && <circle cx="5" r="3" fill="#6a3ff0"><animate attributeName="cy" from="0" to="32" dur="1.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="1.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" /></circle>}</svg>
                          <span className="rounded-full bg-[var(--light-background-secondary)] px-2 py-0.5 tabular-nums"><ArrowDown size={10} className="mr-0.5 inline" />{conv}% move forward</span>
                        </div>
                      )}
                      <button type="button" className="group relative block w-full text-center focus-visible:outline-none" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                        aria-label={`${stage}: AI-assisted ${ai}, manual ${man} (illustrative)`} data-testid={`funnel-stage-${i}`}>
                        <span className="mb-1.5 block text-[13.5px] font-medium text-[var(--c-head)]">{stage}</span>
                        <span className="relative block h-[46px]">
                          <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-2xl border border-dashed border-[#c4c4cc] bg-[#f4f4f7] transition-all duration-700"
                            style={{ width: inView ? `${wMan}%` : '20%' }} />
                          <span className="absolute inset-y-[5px] left-1/2 -translate-x-1/2 rounded-xl shadow-[0_10px_30px_-12px_rgba(109,40,217,0.6)] transition-all duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-[var(--brand-primary)]"
                            style={{ width: inView ? `${mode === 'ai' ? wAi - 2 : wMan - 2}%` : '10%', transitionDelay: `${i * 110}ms`, background: mode === 'ai' ? 'linear-gradient(90deg, #7c3aed, #a78bfa)' : 'linear-gradient(90deg,#3f3f46,#71717a)' }} />
                          <span className="relative z-[1] flex h-full items-center justify-center text-white"><Counter value={vals[i]} run={inView} /></span>
                        </span>
                        {hover === i && (
                          <span role="tooltip" className="absolute bottom-[calc(100%+6px)] left-1/2 z-20 w-[230px] -translate-x-1/2 rounded-xl border border-[var(--c-line)] bg-white p-3 text-[12px] shadow-xl">
                            <span className="block font-semibold text-[var(--c-head)]">{stage}</span>
                            <span className="mt-1 flex justify-between"><span>AI-assisted</span><b className="tabular-nums text-[var(--brand-deep)]">{ai.toLocaleString('en-IN')}</b></span>
                            <span className="flex justify-between"><span>Manual</span><b className="tabular-nums text-[var(--c-head)]">{man.toLocaleString('en-IN')}</b></span>
                            <span className="mt-1 block text-[10.5px] text-[var(--c-muted)]">Illustrative example, not a measured result.</span>
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Comparison */}
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--c-muted)]">Per 1,000 enquiries · conceptual</p>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-3">
                {funnel.stages.map((s, i) => (
                  <div key={s} className="rounded-xl border border-[var(--c-line)] bg-[var(--light-background-secondary)] p-3 lg:p-3.5">
                    <div className="flex flex-col gap-0.5 text-[13px] lg:flex-row lg:items-center lg:justify-between lg:text-[13.5px]"><span className="font-medium leading-tight text-[var(--c-head)]">{s}</span>
                      <span className="tabular-nums text-[12.5px]"><b className="text-[var(--brand-deep)]">{funnel.ai[i]}</b> <span className="text-[var(--c-muted)]">vs</span> {funnel.manual[i]}</span></div>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-1000" style={{ width: inView ? `${funnel.ai[i] / 10}%` : 0 }} /></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#a1a1aa] transition-all duration-1000" style={{ width: inView ? `${funnel.manual[i] / 10}%` : 0 }} /></div>
                    </div>
                  </div>
                ))}
                </div>
                <p className="text-[12.5px] leading-relaxed text-[var(--c-muted)]">Figures are a conceptual illustration of how faster, consistent follow-up can keep more enquiries moving. They are not product benchmarks. Currently showing <b className="text-[var(--c-head)]">{mode === 'ai' ? 'AI-assisted' : 'manual'}</b> values; the other workflow reaches {other[3]} site visits in this example.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Counter({ value, run }: { value: number; run: boolean }) {
  const v = useCountUp(value, run, 1000);
  return <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[13px] font-semibold tabular-nums">{Math.round(v).toLocaleString('en-IN')}</span>;
}
