import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { qualification } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AgentOrb, Avatar } from '../components/dashboards/primitives';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';

// Each exchange answers some questions and fills some profile fields.
const exchanges = [
  { ai: 'Are you buying for yourself or as an investment?', b: 'For my family, we will live there.', q: [0], f: [2] },
  { ai: 'Which configuration and location do you prefer?', b: 'A 3 BHK, close to the north corridor.', q: [1, 2], f: [0] },
  { ai: 'What budget range are you considering?', b: 'Around ₹2 crore.', q: [3], f: [1] },
  { ai: 'When are you planning to buy? Ready or under construction?', b: 'In about six months. Ready-to-move preferred.', q: [4, 5], f: [3] },
  { ai: 'Have you seen other projects? Would you like a site visit?', b: 'Saw two nearby. Yes, I would like to visit.', q: [6, 7], f: [4] },
  { ai: 'Will anyone else be part of the decision? Working with a broker?', b: 'My wife will join. No broker.', q: [8, 9], f: [5] },
];
const STEPS = exchanges.length + 2;

export function Qualification() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [s] = useLoop(STEPS, 1900, inView);
  const shown = Math.min(s, exchanges.length);
  const answered = new Set(exchanges.slice(0, shown).flatMap((e) => e.q));
  const filled = new Set(exchanges.slice(0, shown).flatMap((e) => e.f));

  return (
    <Section id="qualification" theme="light" label="Real estate qualification">
      <div className="container-x section-y">
        <SectionHeader eyebrow={qualification.eyebrow} title={qualification.title} description={qualification.description} />
        <div ref={ref} className="mt-14 grid items-stretch gap-4 lg:grid-cols-[1.15fr_auto_1fr]" data-testid="qualification-demo">
          {/* Conversation */}
          <Reveal className="card flex flex-col p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-[var(--c-head)]"><AgentOrb size={26} live={s < exchanges.length} />Buyer conversation</p>
              <span className="badge badge-neutral">Sample</span>
            </div>
            <div className="mt-4 flex min-h-[380px] flex-1 flex-col justify-end gap-2 overflow-hidden" aria-live="off">
              {exchanges.slice(Math.max(0, shown - 3), shown).map((e) => (
                <div key={e.ai} className="space-y-1.5" style={{ animation: 'rise .5s cubic-bezier(.22,1,.36,1) both' }}>
                  <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#f3efff] px-3.5 py-2 text-[13.5px] text-[var(--c-head)]">{e.ai}</p>
                  <p className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#0f0f14] px-3.5 py-2 text-[13.5px] text-white">{e.b}</p>
                </div>
              ))}
              {shown === 0 && <p className="text-center text-[13px] text-[var(--c-muted)]">Starting conversation…</p>}
            </div>
          </Reveal>

          <div className="hidden items-center lg:flex" aria-hidden="true">
            <div className="flex flex-col items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--brand-primary)] text-white shadow-[0_0_30px_rgba(139,92,246,.45)]"><Sparkles size={18} /></span>
              <svg width="60" height="16"><path d="M0 8 H56" stroke="#8b5cf6" strokeWidth="2" className="flow-dash" /></svg>
              <ArrowRight size={14} className="-mt-5 ml-12 text-[var(--brand-primary)]" />
              <span className="text-[11px] text-[var(--c-muted)]">Structured</span>
            </div>
          </div>

          {/* Profile */}
          <Reveal delay={0.1} className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Avatar name="Rohan Mehta" size={40} />
              <div className="flex-1"><p className="text-[15px] font-semibold text-[var(--c-head)]">Rohan Mehta</p><p className="text-[12.5px] text-[var(--c-muted)]">Buyer profile · auto-filled</p></div>
              <span className={`badge ${filled.size === 6 ? 'badge-ok' : 'badge-warm'}`}>{filled.size === 6 ? 'Qualified' : 'In progress'}</span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--light-background-secondary)]"><div className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#c4b5fd] transition-all duration-700" style={{ width: `${(filled.size / 6) * 100}%` }} /></div>
            <dl className="mt-4 grid grid-cols-2 gap-2">
              {qualification.profile.map((p, i) => {
                const on = filled.has(i);
                return (
                  <div key={p.k} className={`rounded-xl border p-3 transition-all duration-500 ${on ? 'border-brand/30 bg-[#faf8ff]' : 'border-[var(--c-line)] bg-white'}`}>
                    <dt className="flex items-center justify-between text-[11.5px] text-[var(--c-muted)]">{p.k}{on && <Check size={13} className="text-emerald-500" strokeWidth={3} />}</dt>
                    <dd className={`mt-1 text-[15px] font-semibold transition-all duration-500 ${on ? 'text-[var(--c-head)]' : 'text-transparent'}`}>
                      {on ? p.v : <span className="block h-4 w-16 animate-pulse rounded bg-[var(--light-background-secondary)]" />}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-4 text-[12px] text-[var(--c-muted)]">Synced to CRM · {answered.size}/10 questions answered</p>
          </Reveal>
        </div>

        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-label="Qualification questions">
          {qualification.questions.map((q, i) => {
            const on = answered.has(i);
            return (
              <li key={q} className={`flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3 transition-all duration-500 ${on ? 'border-brand/40 shadow-[0_10px_30px_-18px_rgba(109,40,217,.6)]' : 'border-[var(--c-line)]'}`}>
                <span className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[11.5px] font-semibold tabular-nums transition-colors ${on ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--light-background-secondary)] text-[var(--c-muted)]'}`}>{on ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                <span className="text-[14px] font-medium leading-snug text-[var(--c-head)]">{q}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
