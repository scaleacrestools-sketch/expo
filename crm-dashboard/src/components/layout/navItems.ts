import { AlertTriangle, BarChart3, LayoutDashboard, ListChecks } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', href: '#main', icon: LayoutDashboard },
  { id: 'followups', label: 'Follow-ups', href: '#followups', icon: AlertTriangle },
  { id: 'pipeline', label: 'Pipeline', href: '#pipeline', icon: BarChart3 },
  { id: 'tasks', label: 'Tasks', href: '#tasks', icon: ListChecks },
];

