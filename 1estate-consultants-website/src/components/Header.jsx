import { useEffect, useRef, useState } from 'react';
import { CONTACT, IMAGES, NAV_LEFT, NAV_RIGHT, telHref } from '../data/content.js';
import { ArrowRight, Close, Menu, Phone } from './Icons.jsx';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (panelRef.current) panelRef.current.inert = !open;
    if (!open) return undefined;
    const firstLink = panelRef.current?.querySelector('a');
    firstLink?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  const solid = scrolled || open;

  return (
    <>
      <header className={`site-header ${solid ? 'is-solid' : ''}`}>
        <div className="container site-header__inner">
          <button
            ref={toggleRef}
            type="button"
            className="site-header__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}>
            {open ? <Close width={24} height={24} /> : <Menu width={24} height={24} />}
          </button>

          <nav className="site-nav site-nav--left" aria-label="Primary">
            <ul>
              {NAV_LEFT.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="nav-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#top" className="site-logo" aria-label="1 Estate Consultants — Home">
            <img src={IMAGES.logo} alt="1 Estate Consultants" width="560" height="457" />
          </a>

          <div className="site-header__right">
            <nav className="site-nav" aria-label="Secondary">
              <ul>
                {NAV_RIGHT.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="nav-link">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <a href="#contact" className="header-cta">
              Request A Site Visit
              <ArrowRight width={14} height={14} />
            </a>
          </div>

          <a
            href={telHref(CONTACT.phones[0])}
            className="site-header__call"
            aria-label={`Call ${CONTACT.phones[0]}`}>
            <Phone width={20} height={20} />
          </a>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise clip this fixed panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`mobile-menu ${open ? 'is-open' : ''} ${solid ? 'is-compact' : ''}`}
        aria-hidden={!open}>
        <nav aria-label="Mobile">
          <ul className="mobile-menu__links">
            {[...NAV_LEFT, ...NAV_RIGHT].map((l, i) => (
              <li key={l.label} style={{ '--i': i }}>
                <a href={l.href} onClick={close}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <a href="#contact" className="btn btn--secondary" onClick={close}>
            <span>Request A Site Visit</span>
            <ArrowRight className="btn__arrow" width={16} height={16} />
          </a>
          <div className="mobile-menu__contact">
            <a href={telHref(CONTACT.phones[0])}>{CONTACT.phones[0]}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
