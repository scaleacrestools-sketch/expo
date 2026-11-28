/**
 * V4 PRODUCT UI SYSTEM — the white CRM.
 * Every software preview on the site (hero, analytics, calling, qualification, calendar, WhatsApp, use cases,
 * integrations, phone screens, walkthrough video) is assembled from these components inside a `.product` scope,
 * so they read as screens of one application. Tokens: `--p-*` in src/styles/globals.css.
 */
import type { CSSProperties, ReactNode } from 'react';
import { BarChart3, Bell, CalendarDays, Check, ChevronDown, LayoutDashboard, Megaphone, PhoneCall, Search, Settings, Users, type LucideIcon } from 'lucide-react';
import { brand } from '../../config/brand';
import { DemoTag } from '../ui/DemoTag';
import { LogoMark } from '../ui/Logo';
import { LineChart } from '../charts/LineChart';
import type { Integration } from '../../data/integrations';
import { IntegrationIcon } from '../ui/IntegrationIcon';

export const productColors = { accent: '#6a3ff0', accent2: '#a48bff', blue: '#3b82f6', success: '#16a34a', warning: '#d97706', error: '#dc2626', grid: '#e5e7eb', muted: '#667085' } as const;
const slug = () => brand.productName.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'app';

/* ---------------- Shell ---------------- */
type ShellProps = { children: ReactNode; path?: string; className?: string; demo?: boolean; compact?: boolean; chrome?: boolean; style?: CSSProperties };
/** Application window: light browser chrome + off-white app background. */
export function DashboardShell({ children, path = 'dashboard', className = '', demo = true, compact = false, chrome = true, style }: ShellProps) {
  return (
    <div className={`product p-shell text-left ${className}`} style={style}>
      {chrome && (
        <div className={`flex items-center gap-3 border-b border-[var(--p-line)] bg-white px-3.5 ${compact ? 'h-8' : 'h-9'}`}>
          <div className="flex gap-1.5" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></div>
          <div className="mx-auto hidden max-w-[320px] flex-1 truncate rounded-md bg-[#f2f4f7] px-3 py-0.5 text-center text-[11px] text-[var(--p-muted)] sm:block">app.{slug()}.ai/{path}</div>
          {demo && <DemoTag className="ml-auto sm:ml-0" />}
        </div>
      )}
      {children}
    </div>
  );
}
/** Backwards-compatible name used across sections. */
export const AppWindow = DashboardShell;

const navItems: { icon: LucideIcon; label: string; count?: string }[] = [
  { icon: LayoutDashboard, label: 'Overview' }, { icon: Users, label: 'Leads', count: '128' }, { icon: PhoneCall, label: 'Calls' }, { icon: Megaphone, label: 'Campaigns' },
  { icon: CalendarDays, label: 'Site Visits', count: '12' }, { icon: BarChart3, label: 'Analytics' }, { icon: Settings, label: 'Settings' },
];
export function DashboardSidebar({ active = 'Overview', footer, className = '' }: { active?: string; footer?: ReactNode; className?: string }) {
  return (
    <aside className={`hidden w-[168px] flex-none flex-col border-r border-[var(--p-line)] bg-white p-2.5 md:flex ${className}`}>
      <div className="flex items-center gap-2 px-2 pb-3 pt-1.5"><LogoMark size={20} /><span className="truncate text-[12.5px] font-semibold tracking-[-0.01em] text-[var(--p-text)]">{brand.productName}</span></div>
      <p className="p-label px-2.5 pb-1.5">Workspace</p>
      <nav className="flex flex-col gap-0.5" aria-hidden="true">
        {navItems.map(({ icon: I, label, count }) => (
          <span key={label} className="p-nav-item" data-active={label === active}><I size={14} strokeWidth={label === active ? 2.2 : 1.8} />{label}{count && <span className="ml-auto rounded-full bg-[#f2f4f7] px-1.5 text-[10px] font-medium tabular-nums text-[var(--p-muted)]">{count}</span>}</span>
        ))}
      </nav>
      {footer && <div className="mt-auto pt-3">{footer}</div>}
    </aside>
  );
}

export function SelectPill({ icon: I, children }: { icon?: LucideIcon; children: ReactNode }) {
  return <span className="p-pill">{I && <I size={12} className="text-[var(--p-muted)]" />}{children}<ChevronDown size={12} className="text-[var(--p-muted)]" /></span>;
}
export function DashboardHeader({ title, subtitle, children, notify = false, className = '' }: { title: ReactNode; subtitle?: ReactNode; children?: ReactNode; notify?: boolean; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 ${className}`}>
      <div className="min-w-0">
        <p className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--p-text)]">{title}</p>
        {subtitle && <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--p-muted)]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        {children}
        <span className="hidden h-[30px] w-[30px] place-items-center rounded-lg border border-[var(--p-line)] bg-white text-[var(--p-muted)] lg:grid"><Search size={13} /></span>
        <span className="relative grid h-[30px] w-[30px] place-items-center rounded-lg border border-[var(--p-line)] bg-white text-[var(--p-muted)]"><Bell size={13} />{notify && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--p-error)]" style={{ animation: 'pop .3s var(--ease-out) both' }} />}</span>
      </div>
    </div>
  );
}

/* ---------------- Building blocks ---------------- */
export function Panel({ title, right, children, className = '', pad = true }: { title?: ReactNode; right?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`ui-surface ${pad ? 'p-3' : ''} ${className}`}>
      {(title || right) && (
        <div className={`mb-2.5 flex items-center justify-between gap-2 ${pad ? '' : 'px-3 pt-3'}`}>
          {title && <p className="truncate text-[12px] font-semibold tracking-[-0.01em] text-[var(--c-head)]">{title}</p>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

type MetricProps = { label: string; value: ReactNode; delta?: string; down?: boolean; icon?: LucideIcon; tone?: 'accent' | 'success' | 'warning' | 'info'; className?: string; flash?: boolean; note?: string };
const toneChip = { accent: 'bg-[var(--p-accent-soft)] text-[var(--p-accent)]', success: 'bg-[var(--p-success-soft)] text-[var(--p-success)]', warning: 'bg-[var(--p-warning-soft)] text-[var(--p-warning)]', info: 'bg-[var(--p-info-soft)] text-[var(--p-info)]' };
export function MetricCard({ label, value, delta, down = false, icon: I, tone = 'accent', className = '', flash = false, note = 'vs last week' }: MetricProps) {
  return (
    <div className={`ui-surface p-3 transition-[border-color,box-shadow] duration-500 ${flash ? '!border-[var(--p-accent-line)] shadow-[0_0_0_3px_var(--p-accent-soft)]' : ''} ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-medium text-[var(--c-muted)]">{label}</p>
        {I && <span className={`grid h-6 w-6 flex-none place-items-center rounded-md ${toneChip[tone]}`}><I size={12} /></span>}
      </div>
      <p className="mt-1 text-[20px] font-semibold leading-tight tabular-nums tracking-[-0.03em] text-[var(--c-head)]">{value}</p>
      {delta && <p className="mt-0.5 truncate text-[10.5px] text-[var(--c-muted)]"><span className={`font-semibold ${down ? 'text-[var(--p-error)]' : 'text-[var(--p-success)]'}`}>{delta}</span> {note}</p>}
    </div>
  );
}
/** Legacy signature kept for existing call sites. */
export function Metric({ label, value, delta, className = '' }: { label: string; value: ReactNode; delta?: string; className?: string }) {
  return (
    <div className={`ui-surface p-3 ${className}`}>
      <p className="truncate text-[11px] font-medium text-[var(--c-muted)]">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-[20px] font-semibold tabular-nums tracking-[-0.03em] text-[var(--c-head)]">{value}</p>
        {delta && <span className="text-[10.5px] font-semibold text-[#16a34a]">{delta}</span>}
      </div>
    </div>
  );
}

const toneClass: Record<string, string> = { ok: 'badge-ok', brand: 'badge-brand', warm: 'badge-warm', cold: 'badge-cold', hot: 'badge-hot', neutral: 'badge-neutral' };
export function StatusBadge({ tone = 'neutral', children, dot = true }: { tone?: string; children: ReactNode; dot?: boolean }) {
  return <span className={`badge whitespace-nowrap ${toneClass[tone] ?? 'badge-neutral'}`}>{dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children}</span>;
}
export const Status = StatusBadge;

export function Avatar({ name, size = 28, hue = 260 }: { name: string; size?: number; hue?: number }) {
  const initials = name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return <span className="grid flex-none place-items-center rounded-full font-semibold text-white" style={{ width: size, height: size, fontSize: Math.max(9, size * 0.36), background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${hue + 30} 65% 42%))` }} aria-hidden="true">{initials}</span>;
}

/** AI agent orb: the product's consistent visual for the voice agent. */
export function AgentOrb({ size = 36, live = true }: { size?: number; live?: boolean }) {
  return (
    <span className="relative inline-grid flex-none place-items-center" style={{ width: size, height: size }} aria-hidden="true">
      {live && <span className="absolute inset-0 rounded-full bg-brand/40" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />}
      <span className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #e9e2ff 0%, #a78bfa 35%, #6d28d9 75%, #3b1a7a 100%)', boxShadow: '0 4px 14px rgba(106,63,240,.35)' }} />
      <svg viewBox="0 0 20 20" width={size * 0.5} height={size * 0.5} className="relative"><g fill="#fff"><rect x="3" y="8" width="2" height="4" rx="1" /><rect x="7" y="5" width="2" height="10" rx="1" /><rect x="11" y="3" width="2" height="14" rx="1" /><rect x="15" y="7" width="2" height="6" rx="1" /></g></svg>
    </span>
  );
}

/** Voice waveform in the product accent. Flattens when idle. */
export function VoiceWaveform({ bars = 28, active = true, className = '', color = productColors.accent, height = 32, seed = 1 }: { bars?: number; active?: boolean; className?: string; color?: string; height?: number; seed?: number }) {
  return (
    <div className={`flex items-center gap-[3px] overflow-hidden ${className}`} style={{ height }} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 0.35 + 0.65 * Math.abs(Math.sin((i + 1) * 1.7 * seed + i * 0.3));
        return <span key={i} className={active ? 'wave-bar' : ''} style={{ width: 3, flex: 'none', borderRadius: 3, background: color, height: `${Math.round(h * 100)}%`, opacity: active ? 0.9 : 0.25, transform: active ? undefined : 'scaleY(0.3)', animationDelay: `${(i % 7) * -0.13 - (i % 3) * 0.2}s`, animationDuration: `${0.8 + (i % 5) * 0.12}s`, transition: 'opacity .3s, transform .3s' }} />;
      })}
    </div>
  );
}

/* ---------------- Data components ---------------- */
export type LeadRow = { name: string; source: string; need: string; status: string; tone: string; flash?: boolean; isNew?: boolean };
export function LeadTable({ rows, className = '', compact = false }: { rows: LeadRow[]; className?: string; compact?: boolean }) {
  return (
    <table className={`w-full text-[11.5px] ${className}`}>
      <caption className="sr-only">Demo CRM leads</caption>
      <thead><tr className="text-left"><th className="p-label pb-2 font-medium">Lead</th>{!compact && <th className="p-label hidden pb-2 font-medium sm:table-cell">Source</th>}<th className="p-label pb-2 font-medium">Requirement</th><th className="p-label pb-2 text-right font-medium">Status</th></tr></thead>
      <tbody>
        {rows.map((l, i) => (
          <tr key={l.name} className={`border-t border-[var(--p-line)] ${l.flash ? 'p-flash' : ''}`}>
            <td className="py-[7px] pr-1"><span className="flex items-center gap-2"><Avatar name={l.name} size={22} hue={200 + i * 30} /><span className="truncate font-medium text-[var(--p-text)]">{l.name}</span>{l.isNew && <span className="rounded bg-[var(--p-accent)] px-1 text-[9px] font-semibold leading-4 text-white">NEW</span>}</span></td>
            {!compact && <td className="hidden py-[7px] sm:table-cell">{l.source}</td>}
            <td className="py-[7px]">{l.need}</td>
            <td className="py-[7px] text-right"><span key={l.status} className="inline-block" style={l.flash ? { animation: 'pop .35s var(--ease-out) both' } : undefined}><StatusBadge tone={l.tone}>{l.status}</StatusBadge></span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type ProfileField = { k: string; v: string; filled: boolean };
export function BuyerProfile({ fields, cols = 2, className = '' }: { fields: ProfileField[]; cols?: 1 | 2 | 3; className?: string }) {
  return (
    <dl className={`grid gap-x-3 gap-y-2 ${cols === 3 ? 'grid-cols-3' : cols === 2 ? 'grid-cols-2' : 'grid-cols-1'} ${className}`}>
      {fields.map((f, i) => (
        <div key={f.k} className="min-w-0">
          <dt className="p-label !text-[9.5px]">{f.k}</dt>
          <dd className="h-[17px] truncate text-[12px]">{f.filled ? <span className="font-semibold text-[var(--p-text)]" style={{ animation: `rise .4s ${i * 60}ms var(--ease-out) both` }}>{f.v}</span> : <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-[#eaecf0]" aria-hidden="true" />}</dd>
        </div>
      ))}
    </dl>
  );
}

export function QualificationChecklist({ items, done, className = '' }: { items: string[]; done: number; className?: string }) {
  return (
    <ul className={`space-y-1.5 ${className}`}>
      {items.map((t, i) => {
        const on = i < done;
        return (
          <li key={t} className="flex items-center gap-2 text-[11.5px]">
            <span className={`grid h-4 w-4 flex-none place-items-center rounded-full border transition-colors duration-300 ${on ? 'border-[var(--p-success)] bg-[var(--p-success)] text-white' : 'border-[var(--p-line-strong)] bg-white text-transparent'}`}><Check size={10} strokeWidth={3} /></span>
            <span className={`truncate transition-colors duration-300 ${on ? 'font-medium text-[var(--p-text)]' : 'text-[var(--p-muted)]'}`}>{t}</span>
          </li>
        );
      })}
    </ul>
  );
}
export function ScoreBar({ value, label = 'Lead score', className = '' }: { value: number; label?: string; className?: string }) {
  const tone = value >= 75 ? 'var(--p-success)' : value >= 40 ? 'var(--p-warning)' : 'var(--p-line-strong)';
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[11px]"><span className="text-[var(--p-muted)]">{label}</span><span className="font-semibold tabular-nums text-[var(--p-text)]">{value}<span className="font-normal text-[var(--p-muted)]">/100</span></span></div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eaecf0]"><div className="h-full origin-left rounded-full transition-[transform,background-color] duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ transform: `scaleX(${value / 100})`, background: tone }} /></div>
    </div>
  );
}

export function AppointmentCalendar({ highlight = -1, booked = [3, 10, 17], className = '', onPick, selected, month }: { highlight?: number; booked?: number[]; className?: string; onPick?: (d: number) => void; selected?: number; month?: string }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className={className}>
      {month && <p className="mb-1.5 text-[11px] font-semibold text-[var(--c-head)]">{month}</p>}
      <div className="grid grid-cols-7 gap-1 text-center text-[9.5px] font-medium text-[var(--c-muted)]">{days.map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }).map((_, i) => {
          const d = i + 1; const hl = d === highlight || d === selected; const b = booked.includes(d);
          const Cmp = onPick ? 'button' : 'span';
          return (
            <Cmp key={i} {...(onPick ? { type: 'button' as const, onClick: () => onPick(d), 'aria-label': `Day ${d}${b ? ', booked' : ''}`, 'aria-pressed': hl } : {})}
              className={`grid aspect-square place-items-center rounded-md text-[10.5px] tabular-nums transition-colors duration-300 ${hl ? 'bg-[var(--brand-solid)] font-semibold text-white shadow-[0_4px_10px_rgba(106,63,240,.4)]' : b ? 'bg-[#f1ecff] font-medium text-[#5b34d6]' : 'text-[var(--c-text)]'} ${onPick ? 'hover:ring-1 hover:ring-[var(--brand-secondary)]' : ''}`}>
              {d}
            </Cmp>
          );
        })}
      </div>
    </div>
  );
}
export const MiniCalendar = AppointmentCalendar;

export type TimelineItem = { text: string; time?: string; color: string; shown: boolean };
export function ActivityTimeline({ items, className = '' }: { items: TimelineItem[]; className?: string }) {
  return (
    <ul className={`relative space-y-2.5 ${className}`}>
      <span aria-hidden="true" className="absolute bottom-1.5 left-[3.5px] top-1.5 w-px bg-[var(--p-line)]" />
      {items.map((a) => (
        <li key={a.text} className="relative flex h-[16px] items-center gap-2.5 text-[11.5px]">
          <span className="relative z-[1] h-2 w-2 flex-none rounded-full ring-2 ring-white transition-colors duration-500" style={{ background: a.shown ? a.color : '#d0d5dd' }} />
          {a.shown ? <><span className="truncate text-[var(--p-text)]" style={{ animation: 'rise .4s var(--ease-out) both' }}>{a.text}</span>{a.time && <span className="ml-auto flex-none text-[10px] text-[var(--p-muted)]">{a.time}</span>}</> : <span className="h-1.5 w-3/5 rounded-full bg-[#eaecf0]" aria-hidden="true" />}
        </li>
      ))}
    </ul>
  );
}

/** Floating / toast notification in the product style. */
export function NotificationCard({ icon: I, tone = 'accent', title, children, className = '', style, time }: { icon: LucideIcon; tone?: 'accent' | 'success' | 'warning' | 'info' | 'whatsapp'; title: ReactNode; children?: ReactNode; className?: string; style?: CSSProperties; time?: string }) {
  const chip = tone === 'whatsapp' ? 'bg-[#dcfce7] text-[#128c7e]' : toneChip[tone];
  return (
    <div className={`product p-float p-3 text-left ${className}`} style={style}>
      <div className="flex items-center gap-2.5">
        <span className={`grid h-7 w-7 flex-none place-items-center rounded-lg ${chip}`}><I size={14} /></span>
        <p className="min-w-0 flex-1 text-[12.5px] font-semibold leading-tight text-[var(--p-text)]">{title}</p>
        {time && <span className="flex-none text-[10px] text-[var(--p-muted)]">{time}</span>}
      </div>
      {children && <div className="mt-2 text-[11.5px] leading-snug text-[var(--p-body)]">{children}</div>}
    </div>
  );
}

/** Line/area chart with the product palette and grey grid. */
export function CampaignChart(props: Omit<Parameters<typeof LineChart>[0], 'series'> & { series: { key: string; label: string; values: number[]; color?: string }[] }) {
  const palette = [productColors.accent, productColors.blue];
  return <LineChart {...props} series={props.series.map((s, i) => ({ ...s, color: s.color ?? palette[i % palette.length] }))} />;
}

export function CallCard({ agent, buyer, meta, state, tone = 'neutral', live, children, className = '' }: { agent: string; buyer: string; meta: string; state?: string; tone?: string; live: boolean; children?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5">
        <AgentOrb size={32} live={live} />
        <div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold text-[var(--p-text)]">{agent} → {buyer}</p><p className="truncate text-[10.5px] text-[var(--p-muted)]">{meta}</p></div>
        {state && <span key={state} style={{ animation: 'pop .3s var(--ease-out) both' }}><StatusBadge tone={tone}>{state}</StatusBadge></span>}
      </div>
      <div className="mt-2.5 rounded-lg border border-[var(--p-line)] bg-[var(--p-bg)] px-2.5 py-2"><VoiceWaveform bars={44} active={live} height={24} /></div>
      {children}
    </div>
  );
}

/** White integration row/tile with a real brand mark (or a neutral icon where no licensed mark exists). */
export function IntegrationCard({ it, active = false, reverse = false, compact = false, className = '' }: { it: Integration; active?: boolean; reverse?: boolean; compact?: boolean; className?: string }) {
  return (
    <div className={`product flex h-full items-center gap-2.5 rounded-xl border bg-white px-2.5 transition-[border-color,box-shadow,transform] duration-200 ${reverse ? 'flex-row-reverse text-right' : ''} ${active ? 'border-[#b9a5ff] shadow-[0_0_0_3px_rgba(128,87,255,.28),0_14px_34px_-12px_rgba(128,87,255,.75)]' : 'border-white/70 shadow-[0_8px_24px_-14px_rgba(8,5,21,.8)]'} ${className}`}>
      <IntegrationIcon it={it} size={compact ? 30 : 34} />
      <span className="min-w-0">
        <span className={`block font-semibold leading-tight text-[var(--p-text)] ${compact ? 'text-[12.5px]' : 'truncate text-[13.5px]'}`}>{it.name}</span>
        {!compact && <span className="block truncate text-[11px] text-[var(--p-muted)]">{it.detail}</span>}
      </span>
    </div>
  );
}
