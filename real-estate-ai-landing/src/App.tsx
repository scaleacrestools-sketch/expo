import { Suspense, lazy, useEffect, useState } from 'react';
import { AppProvider, useApp } from './components/ui/AppContext';
import { Modal } from './components/ui/Modal';
import { DemoForm } from './components/forms/DemoForm';
import { VideoModal } from './components/ui/VideoModal';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { TrustedBy } from './sections/TrustedBy';

const BelowFold = lazy(() => import('./BelowFold'));

function DemoModal() {
  const { demoOpen, closeDemo } = useApp();
  return <Modal open={demoOpen} onClose={closeDemo} title="Book a demo" testId="demo-modal"><DemoForm /></Modal>;
}

export default function App() {
  // Render below-the-fold sections once the browser is idle after first paint (immediately for deep links).
  const [rest, setRest] = useState(() => window.location.hash.length > 1);
  useEffect(() => {
    if (rest) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const go = () => setRest(true);
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 600 }); else window.setTimeout(go, 200);
  }, [rest]);
  // In-page links clicked before the deferred sections exist: mount them, then scroll to the target.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const h = a?.getAttribute('href');
      if (!h || h.length < 2 || document.querySelector(h)) return;
      e.preventDefault();
      setRest(true);
      const start = Date.now();
      const go = () => {
        const el = document.querySelector(h);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState(null, '', h); }
        else if (Date.now() - start < 4000) window.setTimeout(go, 50);
      };
      go();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  const placeholder = <div style={{ minHeight: '100vh' }} aria-hidden="true" />;
  return (
    <AppProvider>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustedBy />
        {rest ? <Suspense fallback={placeholder}><BelowFold /></Suspense> : placeholder}
      </main>
      <DemoModal />
      <VideoModal />
    </AppProvider>
  );
}
