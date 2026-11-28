import { Bell, CalendarDays, ChevronLeft, Home, ListChecks, Phone, PhoneCall, Search, UserPlus, Users } from 'lucide-react';
import { AgentOrb, Avatar, MiniCalendar, Status } from './primitives';

export function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div role="img" aria-label={label} className="relative w-[272px] rounded-[46px] bg-[#0f0f14] p-[10px] shadow-[0_50px_100px_-30px_rgba(36,21,82,.55),0_0_0_1px_rgba(0,0,0,.08),inset_0_0_0_2px_#2a2a33]">
      <div className="relative h-[560px] overflow-hidden rounded-[37px] bg-[#f7f7f9]">
        <div className="absolute left-1/2 top-2 z-10 h-[24px] w-[88px] -translate-x-1/2 rounded-full bg-[#0f0f14]" aria-hidden="true" />
        <div className="flex h-11 items-end justify-between px-6 pb-1 text-[11px] font-semibold text-[#0f0f14]" aria-hidden="true"><span>9:41</span><span className="flex gap-1"><span className="h-2 w-3.5 rounded-[2px] border border-[#0f0f14]" /></span></div>
        <div className="theme-light h-[calc(100%-44px)] !bg-transparent" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

function TabBar({ active }: { active: number }) {
  const items = [Home, Users, PhoneCall, CalendarDays];
  return (
    <div className="absolute inset-x-3 bottom-3 flex justify-around rounded-2xl border border-[var(--c-line)] bg-white/95 py-2.5 shadow-sm backdrop-blur">
      {items.map((I, i) => <I key={i} size={18} className={i === active ? 'text-[var(--brand-primary)]' : 'text-[#a1a1aa]'} />)}
    </div>
  );
}

export function DashboardScreen() {
  return (
    <div className="relative h-full px-4 pt-2 text-[var(--c-head)]">
      <div className="flex items-center justify-between"><div><p className="text-[11px] text-[var(--c-muted)]">Good morning</p><p className="text-[17px] font-semibold tracking-[-0.02em]">Kavya</p></div><span className="relative grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm"><Bell size={16} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" /></span></div>
      <div className="mt-3 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] p-3.5 text-white shadow-[0_14px_30px_-14px_rgba(109,40,217,.8)]">
        <p className="text-[11px] text-white/75">Today · demo data</p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {[['New leads', '18'], ['Qualified', '7'], ['Visits', '3']].map(([k, v]) => <div key={k}><p className="text-[19px] font-semibold tabular-nums">{v}</p><p className="text-[10px] text-white/75">{k}</p></div>)}
        </div>
      </div>
      <p className="mt-4 text-[12px] font-semibold">Qualified buyers</p>
      <div className="mt-1.5 space-y-1.5">
        {[['Rohan Mehta', '3 BHK · ₹2 Cr', 'hot', 'Hot'], ['Priya Desai', '4 BHK · ₹3.5 Cr', 'hot', 'Hot'], ['Vikram K.', 'Plot · ₹85 L', 'warm', 'Warm']].map(([n, d, t, s], i) => (
          <div key={n} className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm"><Avatar name={n} size={28} hue={210 + i * 40} /><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-medium">{n}</p><p className="text-[10.5px] text-[var(--c-muted)]">{d}</p></div><Status tone={t}>{s}</Status></div>
        ))}
      </div>
      <p className="mt-4 text-[12px] font-semibold">Recent activity</p>
      <div className="mt-1.5 space-y-1.5 text-[11px]">
        {[['AI call completed · Rohan M.', '2m'], ['Site visit booked · Priya D.', '18m']].map(([a, t]) => <p key={a} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 shadow-sm"><span className="flex items-center gap-1.5"><Phone size={11} className="text-[var(--brand-deep)]" />{a}</span><span className="text-[var(--c-muted)]">{t}</span></p>)}
      </div>
      <TabBar active={0} />
    </div>
  );
}

export function ProfileScreen() {
  return (
    <div className="relative h-full px-4 pt-2 text-[var(--c-head)]">
      <div className="flex items-center justify-between"><ChevronLeft size={20} /><p className="text-[13px] font-semibold">Buyer profile</p><Search size={16} /></div>
      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <Avatar name="Rohan Mehta" size={42} />
        <div className="flex-1"><p className="whitespace-nowrap text-[14px] font-semibold">Rohan Mehta</p><p className="text-[11px] text-[var(--c-muted)]">Meta Ads lead</p></div>
        <Status tone="ok">Qualified</Status>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {[['Configuration', '3 BHK'], ['Budget', '₹2 Crore'], ['Purpose', 'Self-use'], ['Timeline', '6 months']].map(([k, v]) => <div key={k} className="rounded-xl bg-white p-2.5 shadow-sm"><p className="text-[10px] text-[var(--c-muted)]">{k}</p><p className="text-[12.5px] font-semibold">{v}</p></div>)}
      </div>
      <div className="mt-2 rounded-2xl bg-white p-2.5 shadow-sm">
        <p className="mb-1.5 flex items-center justify-between text-[11.5px] font-semibold">Site visit <span className="font-normal text-[var(--brand-deep)]">Sat 15 · 11 AM</span></p>
        <MiniCalendar highlight={15} booked={[8, 19]} />
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 text-[11px] shadow-sm"><ListChecks size={13} className="text-[var(--brand-deep)]" />Follow-up reminder · Fri 6 PM</div>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#0f0f14] px-3 py-2.5 text-white"><UserPlus size={14} /><span className="flex-1 text-[11.5px] font-medium">Assign to sales executive</span><AgentOrb size={18} live={false} /></div>
    </div>
  );
}
