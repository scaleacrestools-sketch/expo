import { BarChart3, Bell, CalendarDays, CheckCircle2, LayoutDashboard, Megaphone, Phone, PhoneCall, PhoneOutgoing, Search, Settings, Sparkles, Users } from 'lucide-react';
import { heroLeads, heroMetrics, heroTrend } from '../../data/demo-data';
import { story } from '../../data/story';
import { Waveform } from '../animations/Waveform';
import { LineChart } from '../charts/LineChart';
import { AgentOrb, Avatar, MiniCalendar, Panel, Status } from './primitives';

/**
 * AI Sales Command Center. `phase` (0–8) drives the hero story:
 * 0 enquiry received · 1 AI agent active · 2 call notification · 3 voice starts · 4 requirements captured
 * 5 qualification progress · 6 lead status changes · 7 site visit requested · 8 dashboard updated
 */
export const HERO_STEPS = [
  'New property enquiry received',
  'AI calling agent activated',
  'Outbound call connecting',
  'Conversation in progress',
  'Buyer requirements captured',
  'Qualification complete · score 86',
  'Lead status changed to Qualified',
  'Site visit request generated',
  'Sales dashboard updated',
] as const;

export function CommandCenter({ phase }: { phase: number }) {
  const live = phase >= 3 && phase <= 5;
  const callState = phase === 0 ? 'Queued' : phase === 1 ? 'Dialling…' : phase === 2 ? 'Ringing…' : phase <= 5 ? `Connected · 00:${String(14 + phase * 9).padStart(2, '0')}` : 'Call completed';
  const callTone = phase >= 6 ? 'ok' : phase >= 1 ? 'brand' : 'neutral';
  const qualPct = phase < 4 ? 0 : phase === 4 ? 45 : 100;
  const updated = phase >= 8;
  const metrics = heroMetrics.map((m, i) => ({ ...m, value: updated ? m.value + [1, 0, 1, 1][i] : m.value }));
  const newStatus = phase >= 7 ? { s: 'Visit requested', t: 'ok' } : phase >= 6 ? { s: 'Qualified · Hot', t: 'hot' } : phase >= 1 ? { s: 'Calling', t: 'brand' } : { s: 'New', t: 'cold' };
  const nav = [
    { i: LayoutDashboard, l: 'Overview', a: true }, { i: Users, l: 'Leads' }, { i: PhoneCall, l: 'Calls' }, { i: Megaphone, l: 'Campaigns' },
    { i: CalendarDays, l: 'Site Visits' }, { i: BarChart3, l: 'Analytics' }, { i: Settings, l: 'Settings' },
  ];

  return (
    <div className="relative flex min-h-[540px] text-left">
      {/* Sidebar */}
      <aside className="hidden w-[172px] flex-none flex-col gap-0.5 border-r border-[var(--c-line)] bg-white/[0.015] p-3 md:flex">
        <p className="px-2 pb-2 pt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--c-muted)]">Workspace</p>
        {nav.map(({ i: I, l, a }) => (
          <span key={l} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12.5px] ${a ? 'bg-white/[0.07] text-[var(--c-head)] shadow-[inset_0_1px_0_rgba(255,255,255,.06)]' : 'text-[var(--c-text)]'}`}><I size={15} />{l}</span>
        ))}
        <div className={`mt-auto rounded-xl border p-2.5 transition-colors duration-500 ${phase >= 1 && phase <= 5 ? 'border-brand/40 bg-brand/10' : 'border-[var(--c-line)] bg-[var(--c-card)]'}`}>
          <div className="flex items-center gap-2"><AgentOrb size={26} live={phase >= 1 && phase <= 5} /><div><p className="text-[11.5px] font-medium text-[var(--c-head)]">{story.agent.name}</p><p className="text-[10px] text-[var(--c-muted)]">AI voice agent · {story.agent.languages}</p></div></div>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#7de3bd]"><span className="live-dot h-1.5 w-1.5 rounded-full bg-[#12b881]" />{phase >= 1 && phase <= 5 ? 'On a call' : 'Ready'}</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-3 sm:p-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10.5px] text-[var(--c-muted)]">Campaign</p>
            <p className="flex items-center gap-2 text-[14px] font-semibold tracking-[-0.02em] text-[var(--c-head)]">{story.project.campaign}<span className="badge badge-ok !py-0 !text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-current" />Live</span></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-lg border border-[var(--c-line)] bg-[var(--c-card-2)] px-2.5 py-1.5 text-[11px] text-[var(--c-muted)] sm:flex"><Search size={12} />Search leads</span>
            <span className="relative grid h-7 w-7 place-items-center rounded-lg border border-[var(--c-line)] text-[var(--c-text)]"><Bell size={13} />{phase >= 7 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand shadow-[0_0_8px_rgba(128,87,255,.9)]" />}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={m.label} className="ui-surface p-2.5">
              <p className="text-[10.5px] text-[var(--c-muted)]">{m.label}</p>
              <p className="mt-0.5 flex items-baseline gap-1.5 text-[18px] font-semibold tabular-nums tracking-[-0.03em] text-[var(--c-head)]">
                <span key={m.value} style={updated ? { animation: 'pop .4s var(--ease-out) both' } : undefined}>{m.value.toLocaleString('en-IN')}{m.suffix}</span>
                {updated && i !== 1 && <span className="text-[10px] font-medium text-[#7de3bd]">+1</span>}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2 grid gap-2 lg:grid-cols-12">
          {/* Live call */}
          <Panel className="lg:col-span-5" title="Live AI call" right={<Status tone={callTone}>{callState}</Status>}>
            <div className="flex items-center gap-3">
              <AgentOrb size={34} live={phase >= 1 && phase <= 5} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-[var(--c-head)]">{story.agent.name} → {story.buyer.name}</p>
                <p className="text-[10.5px] text-[var(--c-muted)]">{story.buyer.phone} · {story.buyer.source} lead</p>
              </div>
              <span className={`grid h-8 w-8 place-items-center rounded-full transition-colors duration-300 ${live ? 'bg-[#12b881]/20 text-[#7de3bd]' : phase >= 1 && phase <= 2 ? 'bg-brand/20 text-[var(--brand-accent)]' : 'bg-white/5 text-[var(--c-muted)]'}`}>{phase >= 1 && phase <= 2 ? <PhoneOutgoing size={14} className="blink" /> : <Phone size={14} />}</span>
            </div>
            <div className="mt-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-card)] px-3 py-2">
              <Waveform bars={40} active={live} height={28} />
            </div>
            <div className="mt-2.5 min-h-[66px] space-y-1.5 text-[11.5px]">
              {phase >= 3 && <p className="text-[var(--c-text)]" style={{ animation: 'rise .4s var(--ease-out) both' }}><b className="font-medium text-[var(--c-accent-text)]">AI:</b> Which configuration and budget are you considering?</p>}
              {phase >= 4 && <p className="text-[var(--c-text)]" style={{ animation: 'rise .4s var(--ease-out) both' }}><b className="font-medium text-[var(--c-head)]">Buyer:</b> A {story.requirement.configuration}, around {story.requirement.budgetShort}, for my family.</p>}
              {phase < 3 && <p className="text-[var(--c-muted)]">{phase === 0 ? 'New Meta Ads enquiry queued for instant follow-up.' : 'Calling within permitted hours…'}</p>}
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {[story.requirement.configuration, story.requirement.budgetShort, story.requirement.purpose, story.requirement.timeline].map((t, i) => (
                <span key={t} className={`rounded-md border px-1.5 py-0.5 text-[10.5px] transition-all duration-300 ${phase >= 4 ? 'border-brand/40 bg-brand/10 text-[var(--c-head)] opacity-100' : 'border-transparent opacity-0'}`} style={{ transitionDelay: `${i * 80}ms` }}>{t}</span>
              ))}
            </div>
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[10.5px]"><span className="text-[var(--c-muted)]">Qualification</span><span className="tabular-nums text-[var(--c-head)]">{phase >= 5 ? `Score ${story.score} · Hot` : `${qualPct}%`}</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full origin-left rounded-full bg-gradient-to-r from-[#6a3ff0] to-[#cbbdff] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ transform: `scaleX(${qualPct / 100})` }} /></div>
            </div>
          </Panel>

          {/* CRM table */}
          <Panel className="lg:col-span-7" title="CRM · Recent leads" right={<span className="text-[10.5px] text-[var(--c-muted)]">{updated ? 'Synced just now' : 'Synced 2 min ago'}</span>}>
            <table className="w-full text-[11.5px]">
              <caption className="sr-only">Demo CRM leads</caption>
              <thead><tr className="text-left text-[10.5px] text-[var(--c-muted)]"><th className="pb-1.5 font-normal">Lead</th><th className="hidden pb-1.5 font-normal sm:table-cell">Source</th><th className="pb-1.5 font-normal">Requirement</th><th className="pb-1.5 text-right font-normal">Status</th></tr></thead>
              <tbody>
                {heroLeads.map((l, i) => {
                  const isNew = i === 0; const st = isNew ? newStatus : { s: l.status, t: l.tone };
                  return (
                    <tr key={l.name} className={`border-t border-[var(--c-line)] transition-colors duration-500 ${isNew && phase === 0 ? 'bg-brand/[0.12]' : isNew && phase >= 6 ? 'bg-[#12b881]/[0.06]' : ''}`}>
                      <td className="py-1.5 pr-1"><span className="flex items-center gap-2"><Avatar name={l.name} size={20} hue={200 + i * 30} /><span className="truncate text-[var(--c-head)]">{l.name}</span>{isNew && phase === 0 && <span className="rounded bg-brand px-1 text-[9px] font-semibold text-white">NEW</span>}</span></td>
                      <td className="hidden py-1.5 text-[var(--c-text)] sm:table-cell">{l.source}</td>
                      <td className="py-1.5 text-[var(--c-text)]">{l.need}</td>
                      <td className="py-1.5 text-right"><span key={st.s} style={isNew ? { animation: 'pop .35s var(--ease-out) both' } : undefined} className="inline-block"><Status tone={st.t}>{st.s}</Status></span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>

          <Panel className="hidden sm:block lg:col-span-5" title="Qualified leads · 12 weeks" right={<span key={String(updated)} className="text-[10.5px] text-[#7de3bd]" style={updated ? { animation: 'pop .4s var(--ease-out) both' } : undefined}>▲ {updated ? '847 total · +1 now' : '846 total'}</span>}>
            <LineChart ariaLabel="Demo trend of qualified leads over 12 weeks" labels={heroTrend.map((_, i) => `W${i + 1}`)} series={[{ key: 'q', label: 'Qualified', color: '#a48bff', values: updated ? [...heroTrend.slice(0, -1), heroTrend[heroTrend.length - 1] + 1] : heroTrend }]} height={110} showAxis={false} />
          </Panel>
          <Panel className="hidden sm:block lg:col-span-3" title="Site visits" right={<span className="text-[10.5px] text-[var(--c-muted)]">Nov</span>}>
            <MiniCalendar highlight={phase >= 7 ? story.visit.day : -1} booked={[3, 8, 10, 17, 19]} />
            <p className={`mt-2 truncate text-[10.5px] transition-colors ${phase >= 7 ? 'text-[var(--c-accent-text)]' : 'text-[var(--c-muted)]'}`}>{phase >= 7 ? `${story.visit.short} requested` : 'No new requests'}</p>
          </Panel>
          <Panel className="hidden sm:block lg:col-span-4" title="Buyer profile" right={<span className="text-[10.5px] text-[var(--c-muted)]">{phase >= 8 ? `Owner · ${story.executive.name.split(' ')[0]}` : phase >= 4 ? 'Updating…' : 'Awaiting call'}</span>}>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]" data-testid="hero-profile">
              {[
                { k: 'Configuration', v: story.requirement.configuration, at: 4 },
                { k: 'Budget', v: story.requirement.budgetShort, at: 4 },
                { k: 'Purpose', v: story.requirement.purpose, at: 4 },
                { k: 'Timeline', v: story.requirement.timeline, at: 4 },
                { k: 'Intent score', v: `${story.score} · Hot`, at: 5 },
                { k: 'Next step', v: phase >= 7 ? story.visit.short : 'Site visit', at: 6 },
              ].map((f, i) => (
                <div key={f.k} className="min-w-0">
                  <dt className="text-[9.5px] uppercase tracking-[0.08em] text-[var(--c-muted)]">{f.k}</dt>
                  <dd className="h-[16px] truncate">{phase >= f.at ? <span className="font-medium text-[var(--c-head)]" style={{ animation: `rise .4s ${i * 70}ms var(--ease-out) both` }}>{f.v}</span> : <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-white/[0.06]" aria-hidden="true" />}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        {/* Call notification toast (step 2–3) and site-visit toast (step 7) */}
        <div aria-hidden="true" className={`pointer-events-none absolute right-3 top-2 z-10 w-[250px] rounded-xl border border-white/10 bg-[rgba(17,18,37,.96)] px-3 py-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,.9)] backdrop-blur transition-all duration-300 ${phase === 2 || phase === 3 ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <p className="flex items-center gap-2 text-[11.5px] font-semibold text-white"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#12b881]"><Phone size={12} /></span>{phase === 2 ? 'Outbound call' : 'Call connected'}</p>
          <p className="mt-1 text-[10.5px] text-white/60">{story.agent.name} is calling {story.buyer.name} about {story.project.name}</p>
        </div>
        <div aria-hidden="true" className={`pointer-events-none absolute right-3 top-2 z-10 w-[250px] rounded-xl border border-white/10 bg-[rgba(17,18,37,.96)] px-3 py-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,.9)] backdrop-blur transition-all duration-300 ${phase === 7 ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <p className="flex items-center gap-2 text-[11.5px] font-semibold text-white"><span className="grid h-6 w-6 place-items-center rounded-full bg-brand"><CalendarDays size={12} /></span>Site visit requested</p>
          <p className="mt-1 text-[10.5px] text-white/60">{story.buyer.name} · {story.visit.label}, {story.visit.time}</p>
        </div>
        <div aria-hidden="true" className={`pointer-events-none absolute right-3 top-2 z-10 w-[250px] rounded-xl border border-white/10 bg-[rgba(17,18,37,.96)] px-3 py-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,.9)] backdrop-blur transition-all duration-300 ${phase === 5 ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <p className="flex items-center gap-2 text-[11.5px] font-semibold text-white"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#12b881]"><CheckCircle2 size={12} /></span>Lead qualified</p>
          <p className="mt-1 flex items-center gap-1 text-[10.5px] text-white/60"><Sparkles size={10} />Score {story.score} · {story.requirement.configuration} · {story.requirement.budgetShort}</p>
        </div>
      </div>
    </div>
  );
}
