'use client';
import { useLeadDrawer } from '@/components/forms/LeadDrawerContext';
import type { LeadMagnetId } from '@/content/leads';
import { track } from '@/lib/analytics';

export function CtaButton({ magnet, source, children, variant = 'primary', className = '' }: {
  magnet: LeadMagnetId; source: string; children: React.ReactNode; variant?: 'primary' | 'ghost' | 'ghost-light' | 'gold'; className?: string;
}) {
  const { open } = useLeadDrawer();
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${className}`}
      onClick={() => { track('cta_click', { magnet, source }); open(magnet, source); }}
    >
      {children}
    </button>
  );
}
