import type { ReactNode } from 'react';
import { brand } from '../../config/brand';
import { DemoTag } from '../ui/DemoTag';

/** Shared product UI primitives. Every dashboard on the page is built from these so they read as one product. */

export function AppWindow({ children, path = 'dashboard', className = '', demo = true, compact = false }: { children: ReactNode; path?: string; className?: string; demo?: boolean; compact?: boolean }) {
  const slug = brand.productName.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'app';
  return (
    <div className={`overflow-hidden rounded-[18px] border border-[var(--c-line-strong)] bg-[var(--c-card)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] ${className}`}>
      <div className={`flex items-center gap-3 border-b border-[var(--c-line)] bg-[var(--c-card-2)] px-4 ${compact ? 'h-9' : 'h-10'}`}>
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="mx-auto hidden max-w-[320px] flex-1 truncate rounded-md border border-[var(--c-line)] bg-[var(--c-card)] px-3 py-0.5 text-center text-[11px] text-[var(--c-muted)] sm:block">app.{slug}.ai/{path}</div>
        {demo && <DemoTag className="ml-auto sm:ml-0" />}
      </div>
      {children}
    </div>
  );
}

export function Panel({ title, right, children, className = '', pad = true }: { title?: ReactNode; right?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`ui-surface ${pad ? 'p-3.5' : ''} ${className}`}>
      {(title || right) && (
        <div className={`mb-2.5 flex items-center justify-between gap-2 ${pad ? '' : 'px-3.5 pt-3.5'}`}>
          {title && <p className="text-[12px] font-medium text-[var(--c-head)]">{title}</p>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Metric({ label, value, delta, className = '' }: { label: string; value: ReactNode; delta?: string; className?: string }) {
  return (
    <div className={`ui-surface p-3 ${className}`}>
      <p className="truncate text-[11px] text-[var(--c-muted)]">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-[20px] font-semibold tabular-nums tracking-[-0.03em] text-[var(--c-head)]">{value}</p>
        {delta && <span className="text-[10.5px] font-medium text-emerald-400">{delta}</span>}
      </div>
    </div>
  );
}

const toneClass: Record<string, string> = { ok: 'badge-ok', brand: 'badge-brand', warm: 'badge-warm', cold: 'badge-cold', hot: 'badge-hot', neutral: 'badge-neutral' };
export function Status({ tone = 'neutral', children, dot = true }: { tone?: string; children: ReactNode; dot?: boolean }) {
  return <span className={`badge ${toneClass[tone] ?? 'badge-neutral'}`}>{dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children}</span>;
}

export function Avatar({ name, size = 28, hue = 260 }: { name: string; size?: number; hue?: number }) {
  const initials = name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span className="grid flex-none place-items-center rounded-full text-[10.5px] font-semibold text-white" style={{ width: size, height: size, background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${hue + 30} 65% 42%))` }} aria-hidden="true">{initials}</span>
  );
}

/** AI agent orb: the product's consistent visual for the voice agent. */
export function AgentOrb({ size = 36, live = true }: { size?: number; live?: boolean }) {
  return (
    <span className="relative inline-grid flex-none place-items-center" style={{ width: size, height: size }} aria-hidden="true">
      {live && <span className="absolute inset-0 rounded-full bg-brand/40" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />}
      <span className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #e9e2ff 0%, #a78bfa 35%, #6d28d9 75%, #3b1a7a 100%)', boxShadow: '0 0 24px rgba(139,92,246,.55)' }} />
      <svg viewBox="0 0 20 20" width={size * 0.5} height={size * 0.5} className="relative"><g fill="#fff"><rect x="3" y="8" width="2" height="4" rx="1" /><rect x="7" y="5" width="2" height="10" rx="1" /><rect x="11" y="3" width="2" height="14" rx="1" /><rect x="15" y="7" width="2" height="6" rx="1" /></g></svg>
    </span>
  );
}

export function MiniCalendar({ highlight = 6, booked = [3, 10, 17], className = '', onPick, selected }: { highlight?: number; booked?: number[]; className?: string; onPick?: (d: number) => void; selected?: number }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className={className}>
      <div className="grid grid-cols-7 gap-1 text-center text-[9.5px] text-[var(--c-muted)]">{days.map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }).map((_, i) => {
          const d = i + 1; const hl = d === highlight || d === selected; const b = booked.includes(d);
          const Cmp = onPick ? 'button' : 'span';
          return (
            <Cmp key={i} {...(onPick ? { type: 'button' as const, onClick: () => onPick(d), 'aria-label': `Day ${d}${b ? ', booked' : ''}`, 'aria-pressed': hl } : {})}
              className={`grid aspect-square place-items-center rounded-md text-[10.5px] tabular-nums transition ${hl ? 'bg-[var(--brand-primary)] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,.6)]' : b ? 'bg-brand/15 text-[var(--c-accent-text)]' : 'text-[var(--c-text)]'} ${onPick ? 'hover:ring-1 hover:ring-[var(--brand-secondary)]' : ''}`}>
              {d}
            </Cmp>
          );
        })}
      </div>
    </div>
  );
}
