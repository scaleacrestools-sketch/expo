import { CalendarDays, Database, Mail, MessageCircle, MessageSquareText, PhoneCall, Users, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { brand } from '../config/brand';
import { omnichannel } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AgentOrb, Avatar } from '../components/dashboards/primitives';
import { story } from '../data/story';
import { loops } from '../config/motion';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type Node = { label: string; icon: LucideIcon; color: string; desc: string; x: number; y: number };
const W = 1000, H = 560, CX = 500, CY = 280;
const angles = [-90, -38, 14, 66, 114, 166, 218];
const icons: LucideIcon[] = [PhoneCall, MessageCircle, Mail, MessageSquareText, Database, CalendarDays, Users];
const colors = ['#6a3ff0', '#16a34a', '#d97706', '#0284c7', '#7c3aed', '#db2777', '#059669'];
const descs = [
  'Natural outbound and inbound property calls.', 'Brochures, confirmations and follow-ups.', 'Visit confirmations and summaries.',
  'Short reminders within permitted hours.', 'Leads, outcomes and scores kept in sync.', 'Available slots and visit reminders.', 'Qualified buyers routed to the right executive.',
];
const nodes: Node[] = omnichannel.nodes.map((label, i) => {
  const a = (angles[i] * Math.PI) / 180;
  return { label, icon: icons[i], color: colors[i], desc: descs[i], x: CX + Math.cos(a) * 395, y: CY + Math.sin(a) * 215 };
});
// Which node lights up at each sequence step, plus the detail shown for the same demo lead.
const seqNode = [4, 0, 4, 0, 1, 5, 6];
const alsoLit: Record<number, number[]> = { 5: [2, 3] }; // visit reminders go out by email and SMS
const seqDetail = [
  `${story.buyer.source} · ${story.requirement.configuration} · ${story.requirement.budgetShort}`,
  `${story.agent.name} calling · connected`,
  `Score ${story.score} · Hot lead`,
  `${story.project.name} brochure requested`,
  'Brochure sent · delivered ✓✓',
  `${story.visit.label} · ${story.visit.time} · reminders queued`,
  `Assigned to ${story.executive.name}`,
];

export function Omnichannel() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [step] = useLoop(omnichannel.sequence.length, loops.omnichannel, inView);
  const [hover, setHover] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const lit = hover ?? seqNode[step];
  const isLit = (i: number) => i === lit || (hover === null && (alsoLit[step] ?? []).includes(i));
  const done = new Set(hover === null ? seqNode.slice(0, step) : []);
  const path = (n: Node) => `M${CX},${CY} Q ${(CX + n.x) / 2 + (n.y - CY) * 0.15},${(CY + n.y) / 2 - (n.x - CX) * 0.08} ${n.x},${n.y}`;

  return (
    <Section id="omnichannel" theme="dark" label="Omnichannel automation" className="overflow-hidden">
      <div className="container-x"><div className="divider-orb" aria-hidden="true" /></div>
      <div className="container-x section-y">
        <SectionHeader eyebrow={omnichannel.eyebrow} title={omnichannel.title} description={omnichannel.description} />

        <Reveal className="mt-14" variant="scale">
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
                    <path id={`oc-p-${i}`} d={path(n)} fill="none" stroke={isLit(i) ? '#cbbdff' : 'rgba(255,255,255,.14)'} strokeWidth={isLit(i) ? 2 : 1.2} className={isLit(i) ? 'flow-dash' : ''} style={{ transition: 'stroke .4s' }} />
                    {!reduced && inView && (
                      <circle r={isLit(i) ? 4.5 : 2.5} fill={isLit(i) ? '#ffffff' : '#a48bff'} opacity={isLit(i) ? 1 : 0.5}>
                        <animateMotion dur={`${2.4 + (i % 3) * 0.6}s`} repeatCount="indefinite" keyPoints={isLit(i) ? '0;1' : i % 2 ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear">
                          <mpath href={`#oc-p-${i}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                ))}
              </svg>

              {/* Center: the same demo lead travels through every channel */}
              <div className="product absolute left-1/2 top-1/2 w-[248px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/80 bg-white p-3.5 text-left shadow-[0_0_0_4px_rgba(128,87,255,.25),0_0_70px_-6px_rgba(128,87,255,.75)]" data-testid="oc-center">
                <div className="flex items-center gap-2.5"><AgentOrb size={34} /><div><p className="text-[13px] font-semibold text-[var(--p-text)]">{brand.productName} AI Agent</p><p className="text-[11px] text-[var(--p-muted)]">{story.project.name}</p></div></div>
                <div className="mt-3 rounded-xl border border-[var(--p-line)] bg-[var(--p-bg)] p-2.5">
                  <div className="flex items-center gap-2"><Avatar name={story.buyer.name} size={22} /><p className="text-[12px] font-semibold text-[var(--p-text)]">{story.buyer.name}</p><span className="ml-auto text-[10.5px] tabular-nums text-[var(--c-muted)]">{step + 1}/{omnichannel.sequence.length}</span></div>
                  <p key={step} className="mt-2 text-[12.5px] font-semibold text-[#5b34d6]" style={{ animation: 'rise .3s var(--ease-out) both' }} aria-live="polite">{omnichannel.sequence[step]}</p>
                  <p key={`d${step}`} className="text-[11.5px] text-[var(--c-text)]" style={{ animation: 'rise .3s var(--ease-out) both' }}>{seqDetail[step]}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e5e7eb]"><div className="h-full origin-left rounded-full bg-gradient-to-r from-[#6a3ff0] to-[#a48bff] transition-transform duration-500" style={{ transform: `scaleX(${(step + 1) / omnichannel.sequence.length})` }} /></div>
                </div>
              </div>

              {nodes.map((n, i) => {
                const I = n.icon; const on = isLit(i);
                return (
                  <button key={n.label} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }} aria-label={`${n.label}: ${n.desc}`} data-testid={`oc-node-${i}`}>
                    <span className={`product flex items-center gap-2.5 rounded-xl border bg-white py-2 pl-2 pr-3.5 transition-[transform,box-shadow,border-color] duration-300 ${on ? 'scale-105 border-white shadow-[0_0_0_3px_var(--g2),0_14px_40px_-8px_var(--g)]' : 'border-white/70 shadow-[0_10px_26px_-14px_rgba(0,0,0,.9)]'}`} style={{ ['--g' as string]: n.color, ['--g2' as string]: `${n.color}55` }}>
                      <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${n.color}1f`, color: n.color }}><I size={16} /></span>
                      <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--p-text)]">{n.label}</span>
                      {on ? <span className="live-dot ml-0.5 h-1.5 w-1.5 rounded-full" style={{ background: n.color }} /> : done.has(i) ? <span className="ml-0.5 text-[11px] font-bold text-[#15803d]" aria-hidden="true">✓</span> : null}
                    </span>
                    {hover === i && <span role="tooltip" className="absolute left-1/2 top-[calc(100%+8px)] z-10 w-[200px] -translate-x-1/2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-left text-[12px] text-[#475467] shadow-xl">{n.desc}</span>}
                  </button>
                );
              })}
            </div>

            {/* Mobile: one lead travelling down a vertical channel timeline */}
            <div className="relative md:hidden" data-testid="oc-mobile">
              <div className="product flex items-center gap-3 rounded-2xl border border-white/80 bg-white p-3 shadow-[0_0_0_3px_rgba(128,87,255,.25),0_0_50px_-10px_rgba(139,92,246,.7)]">
                <AgentOrb size={36} /><div className="min-w-0"><p className="text-[13.5px] font-semibold text-[var(--p-text)]">{brand.productName} AI Agent</p><p className="truncate text-[11.5px] text-[var(--p-muted)]">{story.buyer.name} · {story.project.name}</p></div>
                <span className="ml-auto text-[11px] font-medium tabular-nums text-[var(--p-muted)]">{step + 1}/{omnichannel.sequence.length}</span>
              </div>
              <ol className="relative mt-4 pl-1" aria-label="Automation sequence">
                <span aria-hidden="true" className="absolute bottom-5 left-[21px] top-5 w-px bg-white/10" />
                <span aria-hidden="true" className="absolute left-[21px] top-5 w-px origin-top bg-gradient-to-b from-[#6a3ff0] to-[#cbbdff] transition-[height] duration-700" style={{ height: `calc(${(step / (omnichannel.sequence.length - 1)) * 100}% - ${(step / (omnichannel.sequence.length - 1)) * 40}px)` }} />
                {omnichannel.sequence.map((st, i) => {
                  const n = nodes[seqNode[i]]; const I = n.icon; const on = i === step;
                  return (
                    <li key={st} className="relative flex gap-3 py-1.5">
                      <span className={`relative z-[1] grid h-10 w-10 flex-none place-items-center rounded-xl border border-white/80 bg-white transition-all duration-300 ${on ? 'scale-105' : i < step ? '' : 'opacity-55'}`} style={{ color: n.color, boxShadow: on ? `0 0 0 3px ${n.color}55, 0 0 24px -2px ${n.color}` : undefined }}><I size={16} /></span>
                      <div className={`product min-w-0 flex-1 rounded-xl border px-3 py-2 transition-[background-color,border-color,box-shadow] duration-300 ${on ? 'border-white bg-white shadow-[0_10px_30px_-12px_rgba(128,87,255,.8)]' : 'border-transparent bg-transparent'}`}>
                        <p className={`text-[13px] font-semibold ${on ? 'text-[#171923]' : i < step ? 'text-white/80' : 'text-white/50'}`}>{st}{i < step && <span className="ml-1.5 text-[11px] text-[#7de3bd]">✓</span>}</p>
                        <p className={`text-[11.5px] ${on ? 'text-[#475467]' : 'text-white/40'}`}>{n.label}{on && <> · <span key={step} style={{ animation: 'rise .3s var(--ease-out) both' }}>{seqDetail[i]}</span></>}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Sequence */}
            <ol className="relative mt-6 hidden grid-cols-2 gap-2 border-t md:grid border-white/[0.07] pt-5 md:grid-cols-4 lg:grid-cols-7" aria-label="Automation sequence">
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
