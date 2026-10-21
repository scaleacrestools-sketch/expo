'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LeadMagnetId } from '@/content/leads';

interface Ctx { magnet: LeadMagnetId | null; source: string; open: (m: LeadMagnetId, source: string) => void; close: () => void }
const LeadDrawerCtx = createContext<Ctx>({ magnet: null, source: '', open: () => {}, close: () => {} });

export function LeadDrawerProvider({ children }: { children: ReactNode }) {
  const [magnet, setMagnet] = useState<LeadMagnetId | null>(null);
  const [source, setSource] = useState('');
  const open = useCallback((m: LeadMagnetId, s: string) => { setMagnet(m); setSource(s); document.body.classList.add('overlay-open'); }, []);
  const close = useCallback(() => { setMagnet(null); document.body.classList.remove('overlay-open'); }, []);
  const value = useMemo(() => ({ magnet, source, open, close }), [magnet, source, open, close]);
  return <LeadDrawerCtx.Provider value={value}>{children}</LeadDrawerCtx.Provider>;
}
export const useLeadDrawer = () => useContext(LeadDrawerCtx);
