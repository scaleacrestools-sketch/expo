import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { qualification } from '../data/content';
import { story } from '../data/story';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AgentOrb, Avatar } from '../components/dashboards/primitives';
import { useInView } from '../hooks/useInView';
import { useLoop } from '../hooks/useLoop';

/** One exchange per approved question: buyer answer → CRM field → example score points (illustrative rules). */
const exchanges = [
  { b: 'For my family, we will live there.', field: 'Purpose', value: story.requirement.purpose, pts: 8 },
  { b: 'Whitefield, close to my office.', field: 'Location', value: 'Whitefield', pts: 8 },
  { b: `A ${story.requirement.configuration}.`, field: 'Configuration', value: story.requirement.configuration, pts: 15 },
  { b: 'Around ₹2 crore.', field: 'Budget', value: story.requirement.budget, pts: 20 },
  { b: 'Within six months.', field: 'Purchase Timeline', value: story.requirement.timeline, pts: 12 },
  { b: 'Ready to move, ideally.', field: 'Property status', value: story.requirement.status, pts: 5 },
  { b: 'Two projects nearby.', field: 'Other visits', value: '2 projects', pts: 3 },
  { b: 'Yes, this Saturday works.', field: 'Site Visit', value: 'Interested', pts: 10 },
  { b: 'My wife will join the visit.', field: 'Decision-makers', value: 'Spouse', pts: 5 },
  { b: 'No, I am not working with a broker.', field: 'Broker', value: 'None', pts: 0 },
];
const PRIMARY = ['Configuration', 'Budget', 'Purpose', 'Purchase Timeline', 'Site Visit'];
const STEPS = exchanges.length + 2; // + hold on the completed profile

export function Qualification() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [s] = useLoop(STEPS, 1000, inView);
  const shown = Math.min(s + 1, exchanges.length);
  const score = exchanges.slice(0, shown).reduce((a, e) => a + e.pts, 0);
  const complete = shown === exchanges.length;
  const last = exchanges[shown - 1];
  const band = score >= 75 ? ['Hot', 'badge-hot'] : score >= 45 ? ['Warm', 'badge-warm'] : ['Cold', 'badge-cold'];

  return (
    <Section id="qualification" theme="light" sheet label="Real estate qualification">
      <div className="container-x section-y">
        <SectionHeader eyebrow={qualification.eyebrow} title={qualification.title} description={qualification.description} />
        <div ref={ref} className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1.1fr_auto_1fr]" data-testid="qualification-demo" data-step={shown}>
          {/* Conversation */}
          <Reveal variant="left" className="card flex flex-col p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-[var(--c-head)]"><AgentOrb size={26} live={!complete} />Buyer conversation</p>
              <span className="badge badge-neutral">Question {shown} of 10</span>
            </div>
            <div className="mt-4 flex min-h-[360px] flex-1 flex-col justify-end gap-3 overflow-hidden" aria-live="off">
              {exchanges.slice(Math.max(0, shown - 3), shown).map((e, k, arr) => {
                const qi = exchanges.indexOf(e);
                const newest = k === arr.length - 1;
                return (
                  <div key={qi} className={`space-y-1.5 transition-opacity duration-300 ${newest ? 'opacity-100' : 'opacity-70'}`} style={newest ? { animation: 'rise .4s var(--ease-out) both' } : undefined}>
                    <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#f1edff] px-3.5 py-2 text-[13.5px] text-[var(--c-head)]"><span className="mr-1.5 text-[11px] font-semibold text-[var(--brand-deep)]">Q{qi + 1}</span>{qualification.questions[qi]}</p>
                    <p className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#0d1424] px-3.5 py-2 text-[13.5px] text-white" style={newest ? { animation: 'rise .4s .25s var(--ease-out) both' } : undefined}>{e.b}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Extraction connector */}
          <div className="hidden items-center lg:flex" aria-hidden="true">
            <div className="flex w-[110px] flex-col items-center gap-2 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--brand-solid)] text-white shadow-[0_0_30px_rgba(128,87,255,.4)]"><Sparkles size={18} /></span>
              <svg width="96" height="14"><path d="M0 7 H90" stroke="#8057ff" strokeWidth="2" className="flow-dash" /><path d="M86 2 l6 5 l-6 5" stroke="#8057ff" strokeWidth="2" fill="none" /></svg>
              <p key={shown} className="rounded-lg border border-[var(--c-line)] bg-white px-2 py-1 text-[11px] text-[var(--c-head)] shadow-sm" style={{ animation: 'pop .3s .45s var(--ease-out) both' }}>{last.field}<br /><b>{last.value}</b></p>
            </div>
          </div>

          {/* Structured CRM profile */}
          <Reveal variant="right" delay={0.08} className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Avatar name={story.buyer.name} size={40} />
              <div className="flex-1"><p className="text-[15px] font-semibold text-[var(--c-head)]">{story.buyer.name}</p><p className="text-[12.5px] text-[var(--c-muted)]">CRM record · {story.project.name}</p></div>
              <span className={`badge ${complete ? 'badge-ok' : 'badge-warm'}`}>{complete ? 'Qualified' : 'In progress'}</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div><p className="text-[11.5px] text-[var(--c-muted)]">Lead score · example rules</p><p className="text-[30px] font-semibold leading-none tabular-nums text-[var(--c-head)]" data-testid="qual-score">{score}<span className="text-[13px] font-normal text-[var(--c-muted)]"> /100</span></p></div>
              <div className="text-right"><span className={`badge ${band[1]}`}>{band[0]}</span><p className="mt-1 text-[11.5px] tabular-nums text-[var(--c-muted)]">+{last.pts} for {last.field.toLowerCase()}</p></div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef1f6]"><div className="h-full origin-left rounded-full bg-gradient-to-r from-[#6a3ff0] to-[#cbbdff] transition-transform duration-500" style={{ transform: `scaleX(${shown / exchanges.length})` }} /></div>
            <dl className="mt-4 grid grid-cols-2 gap-2">
              {exchanges.map((e, i) => {
                const on = i < shown; const primary = PRIMARY.includes(e.field);
                return (
                  <div key={e.field} className={`rounded-xl border px-3 transition-colors duration-300 ${primary ? 'py-2.5' : 'py-1.5'} ${on ? 'border-brand/25 bg-[#faf8ff]' : 'border-[var(--c-line)] bg-white'} ${i === shown - 1 ? 'ring-2 ring-brand/25' : ''}`}>
                    <dt className="flex items-center justify-between text-[11px] text-[var(--c-muted)]">{e.field}{on && <Check size={12} className="text-[#046c4e]" strokeWidth={3} />}</dt>
                    <dd className={`font-semibold ${primary ? 'mt-0.5 text-[14.5px]' : 'text-[12.5px]'} ${on ? 'text-[var(--c-head)]' : 'text-[#c4cbd6]'}`}>{on ? e.value : '—'}</dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-3 flex items-center justify-between text-[12px] text-[var(--c-muted)]"><span>Lead Category: <b className="text-[var(--c-head)]">{complete ? 'Qualified' : 'Pending'}</b></span><span className="flex items-center gap-1">Synced to CRM <ArrowRight size={12} /></span></p>
          </Reveal>
        </div>

        <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-label="Qualification questions">
          {qualification.questions.map((q, i) => {
            const on = i < shown;
            return (
              <li key={q} className={`flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3 transition-[border-color,box-shadow] duration-300 ${i === shown - 1 ? 'border-brand/50 shadow-[0_10px_30px_-18px_rgba(72,38,179,.6)]' : on ? 'border-brand/25' : 'border-[var(--c-line)]'}`}>
                <span className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[11.5px] font-semibold tabular-nums transition-colors ${on ? 'bg-[var(--brand-solid)] text-white' : 'bg-[var(--light-background-secondary)] text-[var(--c-muted)]'}`}>{on ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                <span className="text-[14px] font-medium leading-snug text-[var(--c-head)]">{q}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-center text-[12px] text-[var(--c-muted)]">Scoring rules and answers are an illustrative example. Rules are configurable per campaign.</p>
      </div>
    </Section>
  );
}
