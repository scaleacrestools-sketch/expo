import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/cn';
import { NAV_ITEMS } from './navItems';

interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

/** Desktop sidebar (≥1280px full width, 1024–1279px icon rail). Hidden below 1024px. */
export function Sidebar({ activeId, onNavigate }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[72px] shrink-0 flex-col bg-sidebar text-sidebar-ink lg:flex xl:w-60" data-export-group="sidebar">
      <div className="flex h-16 items-center gap-3 px-4 xl:px-5">
        <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
          <LayoutDashboard className="size-5" />
        </span>
        <span className="hidden min-w-0 xl:block">
          <span className="block truncate text-sm font-semibold text-white">Pipeline CRM</span>
          <span className="block truncate text-[11px] text-sidebar-ink/80">Practice prototype</span>
        </span>
      </div>
      <nav aria-label="Dashboard sections" className="mt-2 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeId;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              title={item.label}
              className={cn(
                'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                active ? 'bg-sidebar-active text-white' : 'text-sidebar-ink hover:bg-sidebar-active/70 hover:text-white',
              )}
            >
              <Icon aria-hidden="true" className="size-[18px] shrink-0" />
              <span className="hidden xl:inline">{item.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="mt-auto hidden px-5 pb-5 xl:block">
        <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-[11px] leading-4 text-sidebar-ink/90">
          AI-assisted practice prototype. Not an assessment submission. Records are illustrative.
        </p>
      </div>
    </aside>
  );
}

/** Mobile bottom navigation (<1024px). */
export function BottomNav({ activeId, onNavigate }: SidebarProps) {
  return (
    <nav aria-label="Dashboard sections" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur lg:hidden" data-export-group="bottom-nav">
      <ul className="grid grid-cols-4" role="list">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={cn('flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors', active ? 'text-accent' : 'text-ink-3 hover:text-ink')}
              >
                <Icon aria-hidden="true" className="size-5" />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
