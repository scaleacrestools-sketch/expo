import { FlaskConical, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';

/** Prominent label for every component that renders fictional records. */
export function DemoBadge({ label = 'Illustrative demo data' }: { label?: string }) {
  return (
    <Badge tone="warn" icon={<FlaskConical />}>
      {label}
    </Badge>
  );
}

export function SourceBadge({ label = 'Supplied source data' }: { label?: string }) {
  return (
    <Badge tone="ok" icon={<ShieldCheck />}>
      {label}
    </Badge>
  );
}
