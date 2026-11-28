import { CalendarClock, Clock3, Database, PhoneMissed, RefreshCw } from 'lucide-react';
import { problem } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';

export function Problem() {
  return (
    <Section id="problem" theme="light" label="The problem">
      <div className="container-x section-y">
        <SectionHeader eyebrow={problem.eyebrow} title={problem.title} description={problem.description} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {problem.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <article className="card card-hover flex h-full flex-col overflow-hidden">
                <div className="relative h-[252px] border-b border-[var(--c-line)] bg-[var(--light-background-secondary)]">
                  {i === 0 ? <LateNight /> : i === 1 ? <Timeline /> : <DatabaseViz />}
                </div>
                <div className="p-6">
                  <h3 className="h-card">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">{c.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function useStep(n: number, ms: number) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [s] = useLoop(n, ms, inView);
  return { ref, s };
}

function LateNight() {
  const { ref, s } = useStep(4, 1800);
  return (
    <div ref={ref} className="absolute inset-0 p-5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 rounded-full bg-[#0f0f14] px-3 py-1.5 text-[12px] font-medium text-white"><Clock3 size={13} className="text-[var(--brand-secondary)]" /> 11:42 PM</span>
        <span className="text-[11px] text-[var(--c-muted)]">Office closed</span>
      </div>
      <div className={`mt-4 rounded-xl border border-[var(--c-line)] bg-white p-3 shadow-sm transition-all duration-500 ${s >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
        <p className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--c-head)]"><span className="h-2 w-2 rounded-full bg-sky-500" />New enquiry · Website form</p>
        <p className="mt-1 text-[11.5px] text-[var(--c-muted)]">2 BHK · Wants a callback</p>
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          { t: 'Follow-up scheduled', d: '9:05 AM', on: s >= 2, i: CalendarClock },
          { t: 'WhatsApp reply', d: 'Queued', on: s >= 3, i: CalendarClock },
        ].map((r) => (
          <div key={r.t} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[11.5px] transition-all duration-500 ${r.on ? 'border-brand/30 bg-[#f5f1ff] opacity-100' : 'border-transparent opacity-30'}`}>
            <span className="flex items-center gap-2 font-medium text-[var(--c-head)]"><r.i size={13} className="text-[var(--brand-deep)]" />{r.t}</span><span className="text-[var(--c-muted)]">{r.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline() {
  const { ref, s } = useStep(5, 1500);
  const items = [
    { t: 'Enquiry received', d: 'Day 0', kind: 'done' },
    { t: 'First call missed', d: 'Day 2', kind: 'miss' },
    { t: 'No follow-up', d: 'Day 5', kind: 'miss' },
    { t: 'Scheduled follow-up', d: 'Auto · Day 0', kind: 'fix' },
  ];
  return (
    <div ref={ref} className="absolute inset-0 px-6 py-5" aria-hidden="true">
      <div className="relative ml-2 border-l border-dashed border-[var(--c-line-strong)] pl-5">
        {items.map((it, i) => {
          const on = s > i;
          const color = it.kind === 'miss' ? 'bg-red-500' : it.kind === 'fix' ? 'bg-[var(--brand-primary)]' : 'bg-emerald-500';
          return (
            <div key={it.t} className={`relative mb-3.5 transition-all duration-500 ${on ? 'opacity-100' : 'opacity-25'}`}>
              <span className={`absolute -left-[27px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-[var(--light-background-secondary)] ${color}`}>
                {it.kind === 'miss' && <PhoneMissed size={8} className="text-white" />}
              </span>
              <div className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 ${it.kind === 'fix' && on ? 'bg-[#f5f1ff] ring-1 ring-brand/30' : ''}`}>
                <p className={`text-[12.5px] font-medium ${it.kind === 'miss' ? 'text-red-600' : 'text-[var(--c-head)]'}`}>{it.t}</p>
                <span className="text-[11px] text-[var(--c-muted)]">{it.d}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DatabaseViz() {
  const { ref, s } = useStep(6, 1100);
  const rows = ['Neha G.', 'Karan P.', 'Sana R.', 'Dev A.', 'Meera J.'];
  return (
    <div ref={ref} className="absolute inset-0 p-5" aria-hidden="true">
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="flex items-center gap-1.5 font-medium text-[var(--c-head)]"><Database size={13} /> leads_2024.csv</span>
        <span className="text-[var(--c-muted)]">{Math.min(s, 5)} / 5 re-engaging</span>
      </div>
      <div className="mt-2.5 overflow-hidden rounded-xl border border-[var(--c-line)] bg-white">
        {rows.map((r, i) => {
          const on = s > i;
          return (
            <div key={r} className="flex items-center justify-between border-b border-[var(--c-line)] px-3 py-[6px] text-[11.5px] last:border-0">
              <span className={`transition-colors duration-500 ${on ? 'text-[var(--c-head)]' : 'text-[var(--c-muted)]'}`}>{r}</span>
              <span className={`badge transition-all duration-500 ${on ? 'badge-brand' : 'badge-neutral'}`}>{on ? <><RefreshCw size={10} />Re-engage scheduled</> : 'Inactive · 9 mo'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
