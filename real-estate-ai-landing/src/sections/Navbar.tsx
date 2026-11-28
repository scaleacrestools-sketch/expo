import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { brand } from '../config/brand';
import { nav } from '../data/content';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import { useApp } from '../components/ui/AppContext';

export function Navbar() {
  const { openDemo } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dd, setDd] = useState(false);
  const ddRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<number>();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!ddRef.current?.contains(e.target as Node)) setDd(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDd(false); setMenu(false); } };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  const signIn = (e: React.MouseEvent) => { if (!brand.loginUrl) { e.preventDefault(); openDemo(); } };

  return (
    <header className="theme-dark fixed inset-x-0 top-0 z-50 !bg-transparent" data-testid="navbar">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
      <div className={`transition-all duration-500 ${scrolled || menu ? 'border-b border-white/[0.07] bg-[rgba(7,7,10,0.78)] backdrop-blur-xl' : 'border-b border-transparent'}`}>
        <nav className="container-x flex h-[68px] items-center justify-between gap-6" aria-label="Primary">
          <a href="#top" aria-label={`${brand.productName} home`} className="flex-none"><Logo /></a>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.links.map((l) => l.dropdown ? (
              <li key={l.label} className="relative" ref={ddRef}
                onMouseEnter={() => { window.clearTimeout(closeTimer.current); setDd(true); }}
                onMouseLeave={() => { closeTimer.current = window.setTimeout(() => setDd(false), 160); }}>
                <button type="button" aria-expanded={dd} aria-haspopup="true" aria-controls="solutions-menu" onClick={() => setDd((v) => !v)}
                  className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[14.5px] text-white/75 transition hover:text-white" data-testid="solutions-trigger">
                  {l.label} <ChevronDown size={15} className={`transition-transform ${dd ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dd && (
                    <motion.div id="solutions-menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3" data-testid="solutions-menu">
                      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-[#0e0e14]/95 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                        {nav.solutions.map((s) => (
                          <a key={s.label} href={s.href} onClick={() => setDd(false)} className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.05]">
                            <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[var(--brand-accent)] transition group-hover:border-brand/50"><Icon name={s.icon} size={17} /></span>
                            <span><span className="block text-[14px] font-medium text-white">{s.label}</span><span className="block text-[12.5px] text-white/50">{s.desc}</span></span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li key={l.label}><a href={l.href} className="rounded-full px-3.5 py-2 text-[14.5px] text-white/75 transition hover:text-white">{l.label}</a></li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <a href={brand.loginUrl || '#demo'} onClick={signIn} className="rounded-full px-4 py-2 text-[14.5px] text-white/80 transition hover:text-white">Sign In</a>
            <button type="button" onClick={openDemo} className="btn btn-primary !min-h-[40px] !px-4 text-[14px]" data-testid="nav-demo">Book a Demo</button>
          </div>

          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white lg:hidden" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((v) => !v)} data-testid="mobile-menu-button">
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div id="mobile-menu" data-testid="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'calc(100dvh - 68px)' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto bg-[rgba(7,7,10,0.97)] backdrop-blur-xl lg:hidden">
            <div className="container-x flex flex-col gap-1 py-6">
              <p className="px-1 pb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-white/55">Solutions</p>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {nav.solutions.map((s, i) => (
                  <motion.a key={s.label} href={s.href} onClick={() => setMenu(false)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                    className="flex items-center gap-3 rounded-xl p-3 text-white/90 hover:bg-white/[0.05]">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[var(--brand-accent)]"><Icon name={s.icon} size={17} /></span>{s.label}
                  </motion.a>
                ))}
              </div>
              <div className="my-4 h-px bg-white/10" />
              {nav.links.filter((l) => !l.dropdown).map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMenu(false)} className="rounded-xl px-3 py-3 text-[18px] font-medium text-white">{l.label}</a>
              ))}
              <div className="mt-6 grid gap-3">
                <button className="btn btn-primary w-full" onClick={() => { setMenu(false); openDemo(); }}>Book a Demo</button>
                <a href={brand.loginUrl || '#demo'} onClick={(e) => { setMenu(false); signIn(e); }} className="btn btn-secondary w-full">Sign In</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
