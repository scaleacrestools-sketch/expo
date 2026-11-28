import { CalendarCheck2, Check, CheckCircle2, Database, FileSpreadsheet, Globe, Keyboard, Link2, MessageCircle, Send, UserPlus, Webhook } from 'lucide-react';
import { Waveform } from '../animations/Waveform';
import { AgentOrb, Avatar, MiniCalendar, Status } from '../dashboards/primitives';

/** Per-step product demonstrations for "How It Works". `t` is a 0..n tick that drives the micro-animation. */

const sources = [
  { l: 'CSV upload', i: FileSpreadsheet, c: '#22c55e' }, { l: 'Manual entry', i: Keyboard, c: '#a1a1aa' },
  { l: 'Meta Ads', i: Globe, c: '#3b82f6' }, { l: 'Google Ads', i: Globe, c: '#22c55e' },
  { l: 'CRM', i: Database, c: '#8b5cf6' }, { l: 'Property portals', i: Globe, c: '#0ea5e9' },
  { l: 'Website forms', i: Link2, c: '#f59e0b' }, { l: 'API & webhooks', i: Webhook, c: '#ec4899' },
];

export function ImportViz({ t }: { t: number }) {
  return (
    <div className="grid h-full items-center gap-2 p-4 sm:grid-cols-[1fr_auto_1fr] sm:p-7" aria-hidden="true">
      <ul className="grid grid-cols-2 gap-1.5 sm:block sm:space-y-1.5">
        {sources.map((s, i) => (
          <li key={s.l} className={`flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-[12px] font-medium text-[var(--c-head)] shadow-sm transition-all duration-500 ${t % 8 === i ? 'border-brand/60 ring-2 ring-brand/15' : 'border-[var(--c-line)]'}`}>
            <s.i size={13} className="flex-none" style={{ color: s.c }} /><span className="leading-tight sm:truncate">{s.l}</span>
          </li>
        ))}
      </ul>
      <div className="relative mx-auto h-8 w-px bg-gradient-to-b from-[#d9d9e0] to-[var(--brand-primary)] sm:hidden"><span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-[var(--brand-primary)]" /></div>
      <svg width="70" height="300" viewBox="0 0 70 300" className="hidden h-full max-h-[320px] w-[70px] sm:block">
        {sources.map((_, i) => {
          const y = 18 + i * 37.5;
          return <path key={i} d={`M0 ${y} C 40 ${y}, 30 150, 70 150`} fill="none" stroke={t % 8 === i ? 'var(--brand-primary)' : '#d9d9e0'} strokeWidth={t % 8 === i ? 2 : 1} className={t % 8 === i ? 'flow-dash' : ''} />;
        })}
      </svg>
      <div className="rounded-2xl border border-[var(--c-line)] bg-white p-4 shadow-[var(--c-shadow)]">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-solid)] text-white"><Database size={18} /></span>
        <p className="mt-3 text-[13px] font-semibold text-[var(--c-head)]">Unified lead database</p>
        <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.03em] text-[var(--c-head)]">{(4218 + t * 7).toLocaleString('en-IN')}</p>
        <p className="text-[11.5px] text-[var(--c-muted)]">leads · deduplicated</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--light-background-secondary)]"><div className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-700" style={{ width: `${40 + ((t * 9) % 60)}%` }} /></div>
      </div>
    </div>
  );
}

export function CampaignViz({ t }: { t: number }) {
  const qs = ['Budget range', 'Preferred location', 'Configuration', 'Purchase timeline', 'Site visit interest'];
  return (
    <div className="h-full p-5 sm:p-7" aria-hidden="true">
      <div className="rounded-2xl border border-[var(--c-line)] bg-white p-4 shadow-[var(--c-shadow)]">
        <div className="flex items-center justify-between"><p className="text-[13px] font-semibold text-[var(--c-head)]">New campaign</p><Status tone="brand">Draft</Status></div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
          {[['Project', 'Skyline Residences'], ['Pricing', '₹1.6 – 3.2 Cr'], ['Inventory', '3 & 4 BHK · 42 units'], ['Calling hours', '10 AM – 7 PM']].map(([k, v], i) => (
            <div key={k} className="rounded-lg border border-[var(--c-line)] bg-[var(--light-background-secondary)] px-2.5 py-2">
              <p className="text-[10.5px] text-[var(--c-muted)]">{k}</p>
              <p className={`font-medium text-[var(--c-head)] transition-opacity duration-500 ${t >= i ? 'opacity-100' : 'opacity-20'}`}>{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] font-medium text-[var(--c-head)]">Qualifying questions</p>
        <ul className="mt-1.5 space-y-1">
          {qs.map((q, i) => {
            const on = t >= i + 1;
            return (
              <li key={q} className="flex items-center justify-between text-[11.5px] text-[var(--c-text)]">{q}
                <span className={`relative h-4 w-7 rounded-full transition-colors duration-300 ${on ? 'bg-[var(--brand-primary)]' : 'bg-[#e4e4e7]'}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all duration-300 ${on ? 'left-3.5' : 'left-0.5'}`} /></span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 rounded-lg border border-dashed border-brand/40 bg-[#f7f4ff] p-2.5 text-[11px] leading-relaxed text-[var(--c-text)]">
          <b className="text-[var(--brand-deep)]">Agent instructions:</b> Warm, professional tone. Answer only from approved project details. Offer a site visit when budget and configuration match.
        </div>
      </div>
    </div>
  );
}

export function ConversationViz({ t }: { t: number }) {
  const lines = [
    ['ai', 'Hello! Thank you for your interest in Skyline Residences.'],
    ['b', 'Hi, is the 3 BHK still available?'],
    ['ai', 'Yes. Which tower and floor range do you prefer?'],
    ['b', 'Higher floors, ideally facing the park.'],
  ];
  return (
    <div className="h-full p-5 sm:p-7" aria-hidden="true">
      <div className="rounded-2xl border border-white/10 bg-[#0f0f14] p-4 text-white shadow-[0_30px_60px_-30px_rgba(36,21,82,0.6)]">
        <div className="flex items-center gap-3"><AgentOrb size={34} /><div className="flex-1"><p className="text-[13px] font-medium">Aria is on a call</p><p className="text-[11px] text-white/50">Outbound · Skyline Residences</p></div><span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">00:{String(12 + t * 4).padStart(2, '0')}</span></div>
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"><Waveform bars={44} height={30} /></div>
        <div className="mt-3 space-y-2">
          {lines.map(([s, l], i) => (
            <div key={i} className={`flex ${s === 'ai' ? '' : 'justify-end'} transition-all duration-500 ${t >= i ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}>
              <p className={`max-w-[85%] rounded-xl px-3 py-1.5 text-[12px] ${s === 'ai' ? 'rounded-tl-sm bg-brand/20 text-white' : 'rounded-tr-sm bg-white/[0.07] text-white/85'}`}>{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/55"><span className="blink h-1.5 w-1.5 rounded-full bg-[var(--brand-secondary)]" />Live transcript · sample conversation</p>
      </div>
    </div>
  );
}

export function ScoreViz({ t }: { t: number }) {
  const items = ['Budget · ₹2 Cr', 'Location · Whitefield', 'Configuration · 3 BHK', 'Timeline · 6 months', 'Intent · Self-use', 'Objection · Possession date', 'Callback · Weekends', 'Site visit · Interested'];
  const done = Math.min(items.length, t + 1);
  const score = Math.round(40 + (done / items.length) * 46);
  const C = 2 * Math.PI * 34;
  return (
    <div className="grid h-full gap-3 p-5 sm:grid-cols-[1fr_150px] sm:p-7" aria-hidden="true">
      <div className="rounded-2xl border border-[var(--c-line)] bg-white p-4 shadow-[var(--c-shadow)]">
        <div className="flex items-center gap-3"><Avatar name="Rohan Mehta" size={34} /><div><p className="text-[13px] font-semibold text-[var(--c-head)]">Rohan Mehta</p><p className="text-[11px] text-[var(--c-muted)]">Meta Ads · Skyline Residences</p></div></div>
        <ul className="mt-3 grid gap-1">
          {items.map((it, i) => (
            <li key={it} className={`flex items-center gap-2 text-[12px] transition-all duration-500 ${i < done ? 'text-[var(--c-head)]' : 'text-[var(--c-muted)] opacity-50'}`}>
              <span className={`grid h-4 w-4 place-items-center rounded-full transition-colors ${i < done ? 'bg-emerald-500 text-white' : 'border border-[#d4d4d8]'}`}>{i < done && <Check size={10} strokeWidth={3} />}</span>{it}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--c-line)] bg-white p-4 shadow-[var(--c-shadow)]">
        <svg viewBox="0 0 80 80" className="h-[110px] w-[110px] -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f1f4" strokeWidth="8" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="url(#sg)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * C} ${C}`} style={{ transition: 'stroke-dasharray .6s cubic-bezier(.22,1,.36,1)' }} />
          <defs><linearGradient id="sg"><stop stopColor="#c4b5fd" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
        </svg>
        <p className="-mt-[72px] text-[26px] font-semibold tabular-nums text-[var(--c-head)]">{score}</p>
        <p className="mt-[38px] text-[11px] text-[var(--c-muted)]">Lead score</p>
        <span className={`mt-2 badge ${score >= 75 ? 'badge-hot' : score >= 55 ? 'badge-warm' : 'badge-cold'}`}>{score >= 75 ? 'Hot' : score >= 55 ? 'Warm' : 'Cold'}</span>
      </div>
    </div>
  );
}

export function ScheduleViz({ t }: { t: number }) {
  const slots = ['10:00 AM', '11:00 AM', '2:30 PM', '4:00 PM'];
  return (
    <div className="grid h-full gap-3 p-5 sm:grid-cols-2 sm:p-7" aria-hidden="true">
      <div className="rounded-2xl border border-[var(--c-line)] bg-white p-4 shadow-[var(--c-shadow)]">
        <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--c-head)]"><CalendarCheck2 size={15} className="text-[var(--brand-deep)]" />Site visits · November</p>
        <MiniCalendar highlight={t >= 1 ? 15 : -1} booked={[6, 8, 13, 20]} />
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {slots.map((s) => <span key={s} className={`rounded-lg border px-2 py-1.5 text-center text-[11.5px] transition-all ${t >= 2 && s === '11:00 AM' ? 'border-[var(--brand-primary)] bg-[var(--brand-solid)] text-white' : 'border-[var(--c-line)] text-[var(--c-text)]'}`}>{s}</span>)}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className={`rounded-2xl border border-[var(--c-line)] bg-white p-3.5 shadow-[var(--c-shadow)] transition-all duration-500 ${t >= 3 ? 'opacity-100' : 'translate-y-2 opacity-0'}`}>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--c-head)]"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white"><MessageCircle size={12} /></span>Confirmation sent</p>
          <p className="mt-1.5 rounded-lg bg-[#effaf3] px-2.5 py-2 text-[11.5px] text-[#14532d]">Your visit to Skyline Residences is confirmed for Sat, 15 Nov at 11:00 AM.</p>
        </div>
        <div className={`rounded-2xl border border-[var(--c-line)] bg-white p-3.5 shadow-[var(--c-shadow)] transition-all duration-500 ${t >= 4 ? 'opacity-100' : 'translate-y-2 opacity-0'}`}>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--c-head)]"><UserPlus size={14} className="text-[var(--brand-deep)]" />Assigned to sales</p>
          <div className="mt-2 flex items-center gap-2"><Avatar name="Kavya Rao" size={26} hue={150} /><div className="text-[11.5px]"><p className="font-medium text-[var(--c-head)]">Kavya Rao</p><p className="text-[var(--c-muted)]">Senior sales executive</p></div><CheckCircle2 size={16} className="ml-auto text-emerald-500" /></div>
        </div>
        <div className={`flex items-center gap-2 rounded-xl border border-dashed border-[var(--c-line-strong)] px-3 py-2 text-[11.5px] text-[var(--c-text)] transition-opacity duration-500 ${t >= 5 ? 'opacity-100' : 'opacity-0'}`}><Send size={13} className="text-[var(--brand-deep)]" />CRM record updated · reminder queued</div>
      </div>
    </div>
  );
}
