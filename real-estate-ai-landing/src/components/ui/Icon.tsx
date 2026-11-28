import {
  BarChart3, Building2, CalendarCheck, Handshake, ListChecks, Megaphone, Mic, RefreshCw, UserRoundCheck, Users, Workflow, type LucideIcon,
} from 'lucide-react';

const map: Record<string, LucideIcon> = { BarChart3, Building2, CalendarCheck, Handshake, ListChecks, Megaphone, Mic, RefreshCw, UserRoundCheck, Users, Workflow };

export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const C = map[name] ?? Workflow;
  return <C size={size} className={className} aria-hidden="true" />;
}
