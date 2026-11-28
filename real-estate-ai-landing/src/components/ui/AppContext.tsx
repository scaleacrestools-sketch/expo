import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { brand } from '../../config/brand';

type Ctx = {
  demoOpen: boolean; videoOpen: boolean;
  openDemo: () => void; closeDemo: () => void;
  openVideo: () => void; closeVideo: () => void;
  playSample: () => void;
};
const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [demoOpen, setDemo] = useState(false);
  const [videoOpen, setVideo] = useState(false);
  const openDemo = useCallback(() => {
    if (brand.demoBookingUrl) { window.open(brand.demoBookingUrl, '_blank', 'noopener'); return; }
    setDemo(true);
  }, []);
  const playSample = useCallback(() => {
    // The voice section is in the deferred chunk; wait briefly for it if the click comes very early.
    const start = Date.now();
    const go = () => {
      const el = document.getElementById('voice-agents');
      if (!el) { if (Date.now() - start < 4000) window.setTimeout(go, 50); return; }
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('voice:play-sample')), 700);
    };
    go();
  }, []);
  const value = useMemo(() => ({
    demoOpen, videoOpen, openDemo, closeDemo: () => setDemo(false),
    openVideo: () => setVideo(true), closeVideo: () => setVideo(false), playSample,
  }), [demoOpen, videoOpen, openDemo, playSample]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
