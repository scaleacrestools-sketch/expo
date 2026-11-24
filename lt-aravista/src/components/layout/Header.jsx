import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_LINKS, ROUTES } from '../../config/routes';
import { useEnquiry } from '../../context/useEnquiry';
import { useActiveSection, useScrolled } from '../../hooks/useScroll';
import { navigateToSection, scrollToTop } from '../../lib/scroll';
import { IconArrowRight, IconCloseLarge, IconPhone } from '../ui/Icons';
import Logo from './Logo';

const MENU_LINKS = [{ label: 'Home', href: '#home' }, ...NAV_LINKS];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === ROUTES.home;
  const solid = useScrolled() || !isHome;
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    if (!open) return undefined;
    const y = window.scrollY;
    const { style } = document.body;
    const prev = { position: style.position, top: style.top, width: style.width, overflow: style.overflow };
    style.position = 'fixed';
    style.top = `-${y}px`;
    style.width = '100%';
    style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      style.overflow = prev.overflow;
      document.documentElement.style.overflow = '';
      window.scrollTo(0, y);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const requestCallback = () => {
    closeMenu();
    openEnquiry('Request A Callback');
  };
  const goTo = (href) => {
    const wasOpen = open;
    closeMenu();
    window.setTimeout(
      () => {
        if (href === '#home') {
          if (!isHome) {
            navigate(ROUTES.home);
            return;
          }
          scrollToTop();
          return;
        }
        navigateToSection(href, navigate, ROUTES.home, isHome);
      },
      wasOpen ? 320 : 0,
    );
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? 'bg-brand/90 shadow-[0_10px_30px_rgba(47,42,36,0.2)] backdrop-blur-xl' : 'bg-transparent'} ${isHome ? 'eloria-header-in' : ''}`}
      >
        <div
          className={`relative container mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 transition-all duration-500 md:px-10 xl:px-14 ${solid ? 'py-2.5' : 'py-4 md:py-7'}`}
        >
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="group flex w-fit cursor-pointer items-center gap-3 text-white"
          >
            <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
              <span className="h-[1.5px] w-full bg-white transition-all duration-300 group-hover:w-4/5" />
              <span className="h-[1.5px] w-full bg-white" />
              <span className="h-[1.5px] w-full bg-white transition-all duration-300 group-hover:w-3/5" />
            </span>
            <span className="hidden font-body text-[15px] sm:inline">Menu</span>
          </button>
          <div className="justify-self-center">
            <Logo
              variant="light"
              className={`w-auto object-contain transition-all duration-500 ${solid ? 'h-9 sm:h-10' : 'h-10 sm:h-12'}`}
            />
          </div>
          <div className="flex items-center gap-1.5 justify-self-end">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                goTo('#contact');
              }}
              className="hidden h-10 items-center rounded-md bg-white px-4 font-body text-sm text-ink transition-colors duration-300 hover:bg-champagne sm:flex"
            >
              Contact Us
            </a>
            <a
              href="#contact"
              aria-label="Contact Us"
              onClick={(e) => {
                e.preventDefault();
                goTo('#contact');
              }}
              className="group flex h-10 w-10 items-center justify-center rounded-md bg-white text-ink transition-colors duration-300 hover:bg-champagne"
            >
              <IconArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </header>

      <button
        type="button"
        aria-label="Close menu overlay"
        onClick={closeMenu}
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed top-0 left-0 z-70 flex h-full w-[320px] max-w-[85vw] flex-col overflow-hidden bg-ink px-7 pt-6 pb-16 transition-transform md:pb-6 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[380px] ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="flex cursor-pointer items-center gap-3 text-white transition-colors hover:text-champagne"
          >
            <IconCloseLarge className="text-2xl" />
            <span className="font-body text-[15px]">Close</span>
          </button>
          <Logo variant="light" className="h-9 w-auto max-w-[150px] object-contain object-right" />
        </div>
        <nav className="mt-8 flex min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex min-h-full w-full flex-col justify-evenly gap-2 py-1">
            {MENU_LINKS.map((link, i) => {
              const isActive = link.href === '#home' ? !active && isHome : active === link.href;
              return (
                <li
                  key={link.label}
                  className="transition-all duration-500"
                  style={{
                    transitionDelay: open ? `${120 + i * 40}ms` : '0ms',
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translateX(-16px)',
                  }}
                >
                  <a
                    href={link.href === '#home' ? ROUTES.home : link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(link.href);
                    }}
                    aria-current={isActive ? 'true' : undefined}
                    className={`group flex items-baseline gap-4 font-display text-[1.6rem] leading-none transition-colors ${isActive ? 'text-champagne' : 'text-white hover:text-champagne'}`}
                  >
                    <span className="font-body text-[11px] text-white/40">{String(i + 1).padStart(2, '0')}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          type="button"
          onClick={requestCallback}
          className="mt-4 flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-white font-body text-sm text-ink transition-colors hover:bg-champagne"
        >
          <IconPhone aria-hidden="true" />
          Request A Callback
        </button>
      </aside>
    </>
  );
}
