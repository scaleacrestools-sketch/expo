import { ArrowRightLeft, Building, Headphones, PhoneForwarded, PhoneOutgoing } from 'lucide-react';
import { AgentOrb, Avatar, Metric, Panel, Status } from './primitives';
import { Waveform } from '../animations/Waveform';

/** Four audience-specific dashboards, built from the shared product primitives. All data is demo data. */

export function DeveloperDash() {
  const floors = 8, units = 6;
  const state = (f: number, u: number) => ((f * 7 + u * 3) % 10 < 4 ? 'sold' : (f * 5 + u) % 7 === 0 ? 'hold' : 'open');
  return (
    <div className="grid gap-2.5 p-3 sm:grid-cols-[1.1fr_1fr] sm:p-4">
      <Panel title="Tower B · inventory" right={<span className="text-[10.5px] text-[var(--c-muted)]">48 units</span>}>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${units}, 1fr)` }} aria-hidden="true">
          {Array.from({ length: floors * units }).map((_, i) => {
            const s = state(Math.floor(i / units), i % units);
            return <span key={i} className={`h-4 rounded-[4px] ${s === 'sold' ? 'bg-[var(--brand-primary)]' : s === 'hold' ? 'bg-amber-400/70' : 'bg-white/10'}`} />;
          })}
        </div>
        <div className="mt-2.5 flex gap-3 text-[10.5px] text-[var(--c-muted)]"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[var(--brand-primary)]" />Booked</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-400/70" />On hold</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-white/20" />Unsold</span></div>
      </Panel>
      <div className="grid gap-2.5">
        <div className="grid grid-cols-2 gap-2.5"><Metric label="Launch enquiries" value="1,240" /><Metric label="Visits booked" value="96" /></div>
        <Panel title="Active campaigns">
          {[['New launch · Tower B', 'ok', 'Live'], ['Unsold units · Tower A', 'brand', 'Calling'], ['Open house · Sunday', 'warm', 'Scheduled'], ['Payment reminders', 'cold', 'Queued']].map(([n, t, s]) => (
            <p key={n} className="flex items-center justify-between border-t border-[var(--c-line)] py-1.5 text-[11.5px] first:border-0"><span className="flex items-center gap-2 text-[var(--c-head)]"><Building size={12} className="text-[var(--c-muted)]" />{n}</span><Status tone={t}>{s}</Status></p>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function PartnerDash() {
  const cols = [
    { t: 'New', c: '#38bdf8', items: [['Aditi S.', 'Skyline · 2 BHK'], ['Farhan K.', 'Green Acres · Plot']] },
    { t: 'Qualified', c: '#a78bfa', items: [['Rohan M.', 'Skyline · 3 BHK'], ['Isha P.', 'Lakeview · 3 BHK']] },
    { t: 'Visit set', c: '#f59e0b', items: [['Priya D.', 'Sat · 11 AM']] },
    { t: 'Callback', c: '#22c55e', items: [['Arjun T.', 'Tomorrow · 6 PM']] },
  ];
  return (
    <div className="p-3 sm:p-4">
      <div className="mb-2.5 flex flex-wrap gap-1.5">{['All projects', 'Skyline Residences', 'Green Acres', 'Lakeview'].map((p, i) => <span key={p} className={`rounded-full border px-2.5 py-1 text-[11px] ${i === 0 ? 'border-[var(--brand-primary)] bg-brand/20 text-white' : 'border-[var(--c-line)] text-[var(--c-text)]'}`}>{p}</span>)}</div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {cols.map((c) => (
          <div key={c.t} className="ui-surface p-2">
            <p className="mb-2 flex items-center justify-between text-[11.5px] font-medium text-[var(--c-head)]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c.c }} />{c.t}</span><span className="text-[var(--c-muted)]">{c.items.length}</span></p>
            <div className="space-y-1.5">
              {c.items.map(([n, d], i) => (
                <div key={n} className="rounded-lg border border-[var(--c-line)] bg-[var(--c-card)] p-2"><div className="flex items-center gap-1.5"><Avatar name={n} size={18} hue={180 + i * 40} /><p className="truncate text-[11.5px] font-medium text-[var(--c-head)]">{n}</p></div><p className="mt-1 truncate text-[10.5px] text-[var(--c-muted)]">{d}</p></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgencyDash() {
  const rows = [
    { c: 'Client · Horizon Homes', src: 'Meta Ads', leads: 420, q: 38 },
    { c: 'Client · Urban Nest', src: 'Google Ads', leads: 310, q: 44 },
    { c: 'Client · Coastal Villas', src: 'Meta + Google', leads: 260, q: 29 },
  ];
  return (
    <div className="grid gap-2.5 p-3 sm:p-4">
      <div className="grid grid-cols-3 gap-2.5"><Metric label="Ad leads synced" value="990" /><Metric label="Avg. first call" value="38s" /><Metric label="Reports sent" value="12" /></div>
      <Panel title="Client-wise lead quality" pad>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[420px] text-[11.5px]">
            <caption className="sr-only">Demo client lead quality</caption>
            <thead><tr className="text-left text-[10.5px] text-[var(--c-muted)]"><th className="pb-1.5 font-normal">Client</th><th className="pb-1.5 font-normal">Source</th><th className="pb-1.5 text-right font-normal">Leads</th><th className="w-[34%] pb-1.5 pl-3 font-normal">Qualified share</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.c} className="border-t border-[var(--c-line)]">
                  <td className="py-2 text-[var(--c-head)]">{r.c}</td><td className="py-2 text-[var(--c-text)]">{r.src}</td><td className="py-2 text-right tabular-nums text-[var(--c-text)]">{r.leads}</td>
                  <td className="py-2 pl-3"><div className="flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#6d28d9] to-[#c4b5fd]" style={{ width: `${r.q * 2}%` }} /></div><span className="tabular-nums text-[var(--c-head)]">{r.q}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export function CallCentreDash() {
  return (
    <div className="grid gap-2.5 p-3 sm:grid-cols-[1fr_1.1fr] sm:p-4">
      <Panel title="Bulk campaign · Lakeview" right={<Status tone="brand">Running</Status>}>
        <div className="grid grid-cols-2 gap-2">
          {[['Dialled', '3,120', PhoneOutgoing], ['Connected', '2,046', Headphones], ['Callbacks', '412', ArrowRightLeft], ['Handed off', '138', PhoneForwarded]].map(([l, v, I]) => {
            const Ic = I as typeof Headphones;
            return <div key={l as string} className="rounded-lg border border-[var(--c-line)] bg-[var(--c-card)] p-2"><p className="flex items-center gap-1 text-[10.5px] text-[var(--c-muted)]"><Ic size={11} />{l as string}</p><p className="text-[16px] font-semibold tabular-nums text-[var(--c-head)]">{v as string}</p></div>;
          })}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">{['EN', 'HI', 'Hinglish', 'MR', 'TA'].map((l) => <span key={l} className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10.5px] text-[var(--c-text)]">{l}</span>)}</div>
      </Panel>
      <Panel title="Live lines & human handoff">
        <ul className="space-y-1.5">
          {[['Line 01', 'Qualifying · 3 BHK', true], ['Line 02', 'Callback booked', false], ['Line 03', 'Transferring to Kavya R.', true], ['Line 04', 'Outcome logged', false]].map(([l, s, live], i) => (
            <li key={l as string} className="flex items-center gap-2 rounded-lg border border-[var(--c-line)] bg-[var(--c-card)] px-2 py-1.5">
              <AgentOrb size={20} live={!!live} />
              <span className="w-[46px] text-[11px] text-[var(--c-muted)]">{l as string}</span>
              <span className="flex-1 truncate text-[11.5px] text-[var(--c-head)]">{s as string}</span>
              {live ? <Waveform bars={8} height={14} seed={i + 1} /> : <span className="text-[10.5px] text-emerald-400">Done</span>}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
