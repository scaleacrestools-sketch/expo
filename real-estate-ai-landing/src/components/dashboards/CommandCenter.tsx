import { AnimatePresence, motion } from 'motion/react';
import { BarChart3, Bell, CalendarDays, CheckCircle2, LayoutDashboard, Megaphone, Phone, PhoneCall, Search, Settings, Users } from 'lucide-react';
import { heroLeads, heroMetrics, heroTrend } from '../../data/demo-data';
import { Waveform } from '../animations/Waveform';
import { LineChart } from '../charts/LineChart';
import { AgentOrb, Avatar, MiniCalendar, Panel, Status } from './primitives';

/**
 * AI Sales Command Center. `phase` drives the 7-step story:
 * 0 lead arrives · 1 AI dials · 2 voice active · 3 requirements · 4 qualified · 5 site visit · 6 CRM updated
 */
export function CommandCenter({ phase }: { phase: number }) {
  const callState = phase <= 0 ? 'Queued' : phase === 1 ? 'Dialing…' : phase <= 4 ? 'Connected · 01:2' + Math.min(9, phase * 2) : 'Call completed';
  const qualified = phase >= 4;
  const updated = phase >= 6;
  const metrics = heroMetrics.map((m, i) => ({ ...m, value: updated ? m.value + [1, 0, 1, 1][i] : m.value }));
  const nav = [
    { i: LayoutDashboard, l: 'Overview', a: true }, { i: Users, l: 'Leads' }, { i: PhoneCall, l: 'Calls' }, { i: Megaphone, l: 'Campaigns' },
    { i: CalendarDays, l: 'Site Visits' }, { i: BarChart3, l: 'Analytics' }, { i: Settings, l: 'Settings' },
  ];

  return (
    <div className="flex min-h-[560px] text-left">
      {/* Sidebar */}
      <aside className="hidden w-[176px] flex-none flex-col gap-1 border-r border-[var(--c-line)] bg-white/[0.02] p-3 md:flex">
        <p className="px-2 pb-2 pt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--c-muted)]">Workspace</p>
        {nav.map(({ i: I, l, a }) => (
          <span key={l} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] ${a ? 'bg-white/[0.06] text-[var(--c-head)]' : 'text-[var(--c-text)]'}`}><I size={15} />{l}</span>
        ))}
        <div className="mt-auto rounded-xl border border-[var(--c-line)] bg-[var(--c-card)] p-2.5">
          <div className="flex items-center gap-2"><AgentOrb size={26} live={phase >= 1 && phase <= 4} /><div><p className="text-[11.5px] font-medium text-[var(--c-head)]">Aria</p><p className="text-[10px] text-[var(--c-muted)]">AI agent · EN / HI</p></div></div>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400"><span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-3 sm:p-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10.5px] text-[var(--c-muted)]">Campaign</p>
            <p className="text-[14px] font-semibold tracking-[-0.02em] text-[var(--c-head)]">Skyline Residences · Launch</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-lg border border-[var(--c-line)] bg-[var(--c-card-2)] px-2.5 py-1.5 text-[11px] text-[var(--c-muted)] sm:flex"><Search size={12} />Search leads</span>
            <span className="relative grid h-7 w-7 place-items-center rounded-lg border border-[var(--c-line)] text-[var(--c-text)]"><Bell size={13} />{phase >= 5 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--brand-primary)]" />}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={m.label} className="ui-surface p-2.5">
              <p className="text-[10.5px] text-[var(--c-muted)]">{m.label}</p>
              <p className="mt-0.5 flex items-baseline gap-1.5 text-[18px] font-semibold tabular-nums tracking-[-0.03em] text-[var(--c-head)]">
                <motion.span key={m.value} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}>{m.value.toLocaleString('en-IN')}{m.suffix}</motion.span>
                {updated && i !== 1 && <span className="text-[10px] font-medium text-emerald-400">+1</span>}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2 grid gap-2 lg:grid-cols-12">
          {/* Live call */}
          <Panel className="lg:col-span-5" title="Live AI call" right={<Status tone={phase >= 5 ? 'ok' : phase >= 1 ? 'brand' : 'neutral'}>{callState}</Status>}>
            <div className="flex items-center gap-3">
              <AgentOrb size={34} live={phase >= 1 && phase <= 4} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-[var(--c-head)]">Aria → Rohan M.</p>
                <p className="text-[10.5px] text-[var(--c-muted)]">+91 98••• ••210 · Meta Ads lead</p>
              </div>
              <span className={`grid h-8 w-8 place-items-center rounded-full ${phase >= 1 && phase <= 4 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-[var(--c-muted)]'}`}><Phone size={14} /></span>
            </div>
            <div className="mt-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-card)] px-3 py-2">
              <Waveform bars={40} active={phase >= 2 && phase <= 4} height={30} />
            </div>
            <div className="mt-2.5 min-h-[86px] space-y-1.5 text-[11.5px]">
              <AnimatePresence>
                {phase >= 2 && <motion.p key="l1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-[var(--c-text)]"><b className="font-medium text-[var(--c-accent-text)]">AI:</b> Which configuration are you looking for?</motion.p>}
                {phase >= 3 && <motion.p key="l2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-[var(--c-text)]"><b className="font-medium text-[var(--c-head)]">Buyer:</b> A 3 BHK, budget around ₹2 crore.</motion.p>}
              </AnimatePresence>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['3 BHK', '₹2 Cr', 'Self-use', '6 months'].map((t, i) => (
                  <span key={t} className={`rounded-md border px-1.5 py-0.5 text-[10.5px] transition-all duration-500 ${phase >= 3 ? 'border-brand/40 bg-brand/10 text-[var(--c-head)] opacity-100' : 'border-transparent opacity-0'}`} style={{ transitionDelay: `${i * 120}ms` }}>{t}</span>
                ))}
              </div>
            </div>
            <div className={`mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11.5px] transition-all duration-500 ${qualified ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/[0.03] text-[var(--c-muted)]'}`}>
              <CheckCircle2 size={14} /> {qualified ? 'Lead qualified · Score 86 / 100' : 'Qualification in progress'}
            </div>
          </Panel>

          {/* CRM table */}
          <Panel className="lg:col-span-7" title="CRM · Recent leads" right={<span className="text-[10.5px] text-[var(--c-muted)]">Synced {updated ? 'just now' : '2 min ago'}</span>} pad>
            <div className="-mx-1 overflow-hidden">
              <table className="w-full text-[11.5px]">
                <caption className="sr-only">Demo CRM leads</caption>
                <thead><tr className="text-left text-[10.5px] text-[var(--c-muted)]"><th className="px-1 pb-1.5 font-normal">Lead</th><th className="hidden px-1 pb-1.5 font-normal sm:table-cell">Source</th><th className="px-1 pb-1.5 font-normal">Requirement</th><th className="px-1 pb-1.5 text-right font-normal">Status</th></tr></thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {(phase >= 0 ? heroLeads : heroLeads.slice(1)).map((l, i) => {
                      const isNew = i === 0;
                      const status = isNew ? (phase >= 6 ? 'Visit booked' : qualified ? 'Qualified' : phase >= 1 ? 'Calling' : 'New') : l.status;
                      const tone = isNew ? (phase >= 6 ? 'ok' : qualified ? 'ok' : phase >= 1 ? 'brand' : 'cold') : l.tone;
                      return (
                        <motion.tr key={l.name} layout initial={{ opacity: 0, backgroundColor: 'rgba(139,92,246,0.18)' }} animate={{ opacity: 1, backgroundColor: isNew && phase >= 6 ? 'rgba(34,197,94,0.07)' : 'rgba(0,0,0,0)' }} className="border-t border-[var(--c-line)]">
                          <td className="px-1 py-1.5"><span className="flex items-center gap-2"><Avatar name={l.name} size={20} hue={200 + i * 30} /><span className="truncate text-[var(--c-head)]">{l.name}</span></span></td>
                          <td className="hidden px-1 py-1.5 text-[var(--c-text)] sm:table-cell">{l.source}</td>
                          <td className="px-1 py-1.5 text-[var(--c-text)]">{l.need}</td>
                          <td className="px-1 py-1.5 text-right"><Status tone={tone}>{status}</Status></td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Performance */}
          <Panel className="hidden sm:block lg:col-span-5" title="Qualified leads · 12 weeks" right={<span className="text-[10.5px] text-emerald-400">▲ trending</span>}>
            <LineChart ariaLabel="Demo trend of qualified leads over 12 weeks" labels={heroTrend.map((_, i) => `W${i + 1}`)} series={[{ key: 'q', label: 'Qualified', color: '#a78bfa', values: heroTrend }]} height={120} showAxis={false} />
          </Panel>

          {/* Calendar */}
          <Panel className="hidden sm:block lg:col-span-3" title="Site visits" right={<span className="text-[10.5px] text-[var(--c-muted)]">Nov</span>}>
            <MiniCalendar highlight={phase >= 5 ? 15 : -1} booked={[3, 8, 10, 17, 19]} />
            <p className={`mt-2 truncate text-[10.5px] transition-colors ${phase >= 5 ? 'text-[var(--c-accent-text)]' : 'text-[var(--c-muted)]'}`}>{phase >= 5 ? 'Sat 15 · 11:00 AM requested' : 'No new requests'}</p>
          </Panel>

          {/* Activity */}
          <Panel className="hidden sm:block lg:col-span-4" title="Recent activity">
            <ul className="space-y-2 text-[11px]">
              {[
                { t: 'New lead from Meta Ads', s: phase >= 0, c: '#38bdf8' },
                { t: 'AI call started with Rohan M.', s: phase >= 1, c: '#a78bfa' },
                { t: 'Lead qualified · score 86', s: phase >= 4, c: '#22c55e' },
                { t: 'Site visit requested · Sat 11 AM', s: phase >= 5, c: '#f59e0b' },
                { t: 'CRM record updated', s: phase >= 6, c: '#22c55e' },
              ].map((a) => (
                <li key={a.t} className="flex h-[16px] items-center gap-2">
                  <span className="h-1.5 w-1.5 flex-none rounded-full transition-opacity duration-500" style={{ background: a.c, opacity: a.s ? 1 : 0.3 }} />
                  {a.s ? <span className="truncate text-[var(--c-text)]" style={{ animation: 'rise .5s cubic-bezier(.22,1,.36,1) both' }}>{a.t}</span>
                    : <span className="h-1.5 w-3/4 rounded-full bg-white/[0.06]" aria-hidden="true" />}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
