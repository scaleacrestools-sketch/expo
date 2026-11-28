import { Check, Database, MessageCircle, Moon, PhoneCall, PhoneMissed, RefreshCw, UserPlus } from 'lucide-react';
import { Avatar, NotificationCard, StatusBadge } from '../components/product';
import { problem } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';

export function Problem() {
  return (
    <Section id="problem" theme="light" sheet label="The problem">
      <div className="container-x section-y">
        <SectionHeader eyebrow={problem.eyebrow} title={problem.title} description={problem.description} />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {problem.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1} variant="tilt">
              <article className="card card-hover flex h-full flex-col overflow-hidden">
                <div className="product relative h-[326px] border-b border-[var(--c-line)] bg-[radial-gradient(120%_90%_at_50%_0%,#efeaff_0%,#f7f8fc_62%)]">
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
  const { ref, s } = useStep(4, 2400);
  const rows = [
    { t: 'AI call scheduled', d: '10:00 AM · permitted hours', on: s >= 2, i: PhoneCall, c: 'bg-[#f3efff] text-[#6a3ff0]' },
    { t: 'WhatsApp acknowledgement', d: 'Sent · delivered', on: s >= 3, i: MessageCircle, c: 'bg-[#dcfce7] text-[#128c7e]' },
  ];
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col p-5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 rounded-full border border-[var(--p-line)] bg-white px-3 py-1.5 text-[13px] font-semibold text-[var(--p-text)] shadow-[var(--p-shadow-sm)]"><Moon size={14} className="text-[#6a3ff0]" />11:42 PM</span>
        <StatusBadge tone="neutral">Office closed</StatusBadge>
      </div>
      <div className={`mt-4 transition-[opacity,transform] duration-500 ${s >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
        <NotificationCard icon={UserPlus} tone="info" title="New enquiry · Website form" time="now">Ananya S. · 2 BHK · ₹1.2 Cr · asked for a callback</NotificationCard>
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.t} className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition-[opacity,border-color,box-shadow] duration-500 ${r.on ? 'border-[var(--p-accent-line)] opacity-100 shadow-[var(--p-shadow-sm)]' : 'border-[var(--p-line)] opacity-45'}`}>
            <span className={`grid h-8 w-8 flex-none place-items-center rounded-lg ${r.c}`}><r.i size={15} /></span>
            <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold text-[var(--p-text)]">{r.t}</span><span className="block truncate text-[11.5px] text-[var(--p-muted)]">{r.d}</span></span>
            <span className={`grid h-5 w-5 flex-none place-items-center rounded-full transition-colors duration-300 ${r.on ? 'bg-[var(--p-success)] text-white' : 'bg-[#eaecf0] text-transparent'}`}><Check size={11} strokeWidth={3} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline() {
  const { ref, s } = useStep(5, 2200);
  const items = [
    { t: 'Enquiry received', d: 'Day 0 · 99acres', kind: 'done' },
    { t: 'First call missed', d: 'Day 2', kind: 'miss' },
    { t: 'No follow-up logged', d: 'Day 5', kind: 'miss' },
    { t: 'AI follow-up call', d: 'Automated', kind: 'fix' },
  ];
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col p-5" aria-hidden="true">
      <div className="ui-surface flex-1 p-4">
        <div className="flex items-center gap-2.5"><Avatar name="Vikram K" size={30} hue={250} /><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-[var(--p-text)]">Vikram K. · lead timeline</p><p className="text-[11.5px] text-[var(--p-muted)]">Plot · ₹85 L</p></div><span key={String(s >= 4)} style={{ animation: 'pop .3s var(--ease-out) both' }}><StatusBadge tone={s >= 4 ? 'brand' : s >= 2 ? 'hot' : 'cold'}>{s >= 4 ? 'Re-engaged' : s >= 2 ? 'Going cold' : 'New'}</StatusBadge></span></div>
        <div className="relative mt-4 space-y-3 pl-6">
          <span className="absolute bottom-2 left-[7px] top-2 w-px bg-[var(--p-line)]" />
          {items.map((it, i) => {
            const on = s > i;
            const dot = it.kind === 'miss' ? 'bg-[var(--p-error)]' : it.kind === 'fix' ? 'bg-[#6a3ff0]' : 'bg-[var(--p-success)]';
            return (
              <div key={it.t} className={`relative transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-30'}`}>
                <span className={`absolute -left-6 top-1 grid h-[15px] w-[15px] place-items-center rounded-full text-white ring-4 ring-white ${dot}`}>{it.kind === 'miss' ? <PhoneMissed size={8} /> : <Check size={9} strokeWidth={3} />}</span>
                <div className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 ${it.kind === 'fix' && on ? 'bg-[#f3efff] ring-1 ring-[#d9cdff]' : ''}`}>
                  <p className={`text-[13px] font-semibold ${it.kind === 'miss' ? 'text-[#b91c1c]' : 'text-[var(--p-text)]'}`}>{it.t}</p>
                  <span className="flex-none text-[11.5px] text-[var(--p-muted)]">{it.d}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DatabaseViz() {
  const { ref, s } = useStep(6, 1800);
  const rows = [['Neha G.', '9 mo'], ['Karan P.', '7 mo'], ['Sana R.', '11 mo'], ['Dev A.', '6 mo'], ['Meera J.', '8 mo']];
  const n = Math.min(s, 5);
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col p-5" aria-hidden="true">
      <div className="ui-surface flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--p-line)] px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--p-text)]"><Database size={14} className="text-[#6a3ff0]" />leads_2024.csv</span>
          <span className="text-[11.5px] font-medium tabular-nums text-[var(--p-muted)]"><b className="font-semibold text-[#5b34d6]">{n}</b> / 5 re-engaging</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-3.5 py-1.5"><span className="p-label">Lead</span><span className="p-label">Last contact</span><span className="p-label w-[112px] text-right">Status</span></div>
        {rows.map(([r, age], i) => {
          const on = s > i;
          return (
            <div key={r} className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-t border-[var(--p-line)] px-3.5 py-[7px] text-[12.5px] ${on ? 'p-flash' : ''}`}>
              <span className="flex items-center gap-2 font-medium text-[var(--p-text)]"><Avatar name={r} size={20} hue={190 + i * 35} />{r}</span>
              <span className="text-[11.5px] tabular-nums text-[var(--p-muted)]">{age} ago</span>
              <span className="flex w-[112px] justify-end"><StatusBadge tone={on ? 'brand' : 'neutral'} dot={!on}>{on ? <><RefreshCw size={10} />Call scheduled</> : 'Inactive'}</StatusBadge></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
