import { BarChart3, Blocks, Building2, Cloud, FileText, Home, Webhook } from 'lucide-react';
import { brandIcons } from '../../data/brand-icons';
import type { Integration } from '../../data/integrations';

const neutral = { Building2, Home, Blocks, FileText, Cloud, Webhook, BarChart3 };

/** White tile with either a CC0 brand mark in its brand colour or a neutral interface icon. */
export function IntegrationIcon({ it, size = 34 }: { it: Integration; size?: number }) {
  const inner = Math.round(size * 0.55);
  return (
    <span className="grid flex-none place-items-center rounded-[10px] border border-[#e5e7eb] bg-[#f7f8fc]" style={{ width: size, height: size }} aria-hidden="true">
      {it.brand ? (
        <svg viewBox="0 0 24 24" width={inner} height={inner}><path d={brandIcons[it.brand].path} fill={brandIcons[it.brand].hex} /></svg>
      ) : (() => { const I = neutral[it.icon ?? 'FileText']; return <I size={inner} color="#344054" strokeWidth={1.9} />; })()}
    </span>
  );
}
