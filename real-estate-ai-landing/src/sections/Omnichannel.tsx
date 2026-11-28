import { CalendarDays, Database, Mail, MessageCircle, MessageSquareText, PhoneCall, Users, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { brand } from '../config/brand';
import { omnichannel } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AgentOrb } from '../components/dashboards/primitives';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type Node = { label: string; icon: LucideIcon; color: string; desc: string; x: number; y: number };
const W = 1000, H = 560, CX = 500, CY = 280;
const angles = [-90, -38, 14, 66, 114, 166, 218];
const icons: LucideIcon[] = [PhoneCall, MessageCircle, Mail, MessageSquareText, Database, CalendarDays, Users];
const colors = ['#a78bfa', '#22c55e', '#f59e0b', '#38bdf8', '#c084fc', '#f472b6', '#34d399'];
const descs = [
  'Natural outbound and inbound property calls.', 'Brochures, confirmations and follow-ups.', 'Visit confirmations and summaries.',
  'Short reminders within permitted hours.', 'Leads, outcomes and scores kept in sync.', 'Available slots and visit reminders.', 'Qualified buyers routed to the right executive.',
];
const nodes: Node[] = omnichannel.nodes.map((label, i) => {
  const a = (angles[i] * Math.PI) / 180;
  return { label, icon: icons[i], color: colors[i], desc: descs[i], x: CX + Math.cos(a) * 395, y: CY + Math.sin(a) * 215 };
});
// Which node lights up at each sequence step.
const seqNode = [4, 0, 4, 0, 1, 5, 6];

export function Omnichannel() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [step] = useLoop(omnichannel.sequence.length, 1700, inView);
  const [hover, setHover] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const lit = hover ?? seqNode[step];
  const path = (n: Node) => `M${CX},${CY} Q ${(CX + n.x) / 2 + (n.y - CY) * 0.15},${(CY + n.y) / 2 - (n.x - CX) * 0.08} ${n.x},${n.y}`;

  return (
    <Section id="omnichannel" theme="dark" label="Omnichannel automation" className="overflow-hidden">
      <div className="container-x section-y">
        <SectionHeader eyebrow={omnichannel.eyebrow} title={omnichannel.title} description={omnichannel.description} />

        <Reveal className="mt-14">
          <div ref={ref} className="card relative overflow-hidden p-4 sm:p-6" data-testid="omnichannel">
            <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />

            {/* Desktop diagram */}
            <div className="relative hidden md:block" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <radialGradient id="oc-c"><stop stopColor="#8b5cf6" stopOpacity=".45" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
                </defs>
                <ellipse cx={CX} cy={CY} rx="395" ry="215" fill="none" stroke="rgba(255,255,255,.06)" strokeDasharray="2 8" />
                <ellipse cx={CX} cy={CY} rx="230" ry="125" fill="none" stroke="rgba(255,255,255,.05)" />
                <circle cx={CX} cy={CY} r="170" fill="url(#oc-c)" />
                {nodes.map((n, i) => (
                  <g key={n.label}>
                    <path id={`oc-p-${i}`} d={path(n)} fill="none" stroke={i === lit ? n.color : 'rgba(255,255,255,.12)'} strokeWidth={i === lit ? 2 : 1.2} className={i === lit ? 'flow-dash' : ''} style={{ transition: 'stroke .4s' }} />
                    {!reduced && inView && (
                      <circle r={i === lit ? 4 : 2.5} fill={n.color} opacity={i === lit ? 1 : 0.6}>
                        <animateMotion dur={`${2.4 + (i % 3) * 0.6}s`} repeatCount="indefinite" keyPoints={i % 2 ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear">
                          <mpath href={`#oc-p-${i}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                ))}
              </svg>

              {/* Center */}
              <div className="absolute left-1/2 top-1/2 w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-brand/40 bg-[rgba(16,16,22,.9)] p-4 text-center shadow-[0_0_60px_-10px_rgba(139,92,246,.6)] backdrop-blur">
                <div className="flex justify-center"><AgentOrb size={48} /></div>
                <p className="mt-3 text-[14px] font-semibold text-white">{brand.productName} AI Agent</p>
                <p className="mt-1 text-[11.5px] text-white/50" aria-live="polite">{omnichannel.sequence[step]}</p>
              </div>

              {nodes.map((n, i) => {
                const I = n.icon; const on = i === lit;
                return (
                  <button key={n.label} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }} aria-label={`${n.label}: ${n.desc}`} data-testid={`oc-node-${i}`}>
                    <span className={`flex items-center gap-2.5 rounded-xl border bg-[rgba(16,16,22,.92)] py-2 pl-2 pr-3.5 backdrop-blur transition-all duration-300 ${on ? 'scale-105 border-white/25 shadow-[0_10px_40px_-10px_var(--g)]' : 'border-white/10'}`} style={{ ['--g' as string]: n.color }}>
                      <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${n.color}22`, color: n.color }}><I size={16} /></span>
                      <span className="whitespace-nowrap text-[13px] font-medium text-white">{n.label}</span>
                      {on && <span className="live-dot ml-0.5 h-1.5 w-1.5 rounded-full" style={{ background: n.color }} />}
                    </span>
                    {hover === i && <span role="tooltip" className="absolute left-1/2 top-[calc(100%+8px)] z-10 w-[200px] -translate-x-1/2 rounded-lg border border-white/10 bg-[#16161e] px-3 py-2 text-left text-[12px] text-white/75 shadow-xl">{n.desc}</span>}
                  </button>
                );
              })}
            </div>

            {/* Mobile diagram */}
            <div className="relative md:hidden">
              <div className="mx-auto flex w-full max-w-[280px] items-center gap-3 rounded-2xl border border-brand/40 bg-[rgba(16,16,22,.9)] p-3.5 shadow-[0_0_50px_-10px_rgba(139,92,246,.6)]">
                <AgentOrb size={40} /><div><p className="text-[14px] font-semibold text-white">{brand.productName} AI Agent</p><p className="text-[12px] text-white/50">{omnichannel.sequence[step]}</p></div>
              </div>
              <svg viewBox="0 0 300 30" className="mx-auto block h-[30px] w-[300px]" aria-hidden="true"><path d="M150 0 V30" stroke="rgba(167,139,250,.6)" className="flow-dash" /></svg>
              <ul className="grid grid-cols-2 gap-2">
                {nodes.map((n, i) => {
                  const I = n.icon; const on = i === lit;
                  return (
                    <li key={n.label} className={`flex items-center gap-2 rounded-xl border p-2.5 transition-all ${on ? 'border-white/25 bg-white/[0.06]' : 'border-white/10'} ${i === nodes.length - 1 ? 'col-span-2' : ''}`}>
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg" style={{ background: `${n.color}22`, color: n.color }}><I size={15} /></span>
                      <span className="text-[12.5px] font-medium text-white">{n.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Sequence */}
            <ol className="relative mt-6 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-5 sm:grid-cols-4 lg:grid-cols-7" aria-label="Automation sequence">
              {omnichannel.sequence.map((s, i) => (
                <li key={s} className={`relative rounded-xl border px-3 py-2.5 text-[12.5px] transition-all duration-500 ${i === step ? 'border-brand/60 bg-brand/15 text-white' : i < step ? 'border-white/10 text-white/75' : 'border-white/[0.06] text-white/55'}`}>
                  <span className="block text-[10.5px] tabular-nums opacity-70">Step {i + 1}</span>{s}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
