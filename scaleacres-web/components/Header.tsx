"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { primaryNav, ctaNav } from "@/content/nav";
import { services, serviceHref } from "@/content/services";
import { Logo } from "@/components/ui/Logo";
import { Arrow } from "@/components/ui/Arrow";
import { MobileMenu } from "@/components/MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const megaId = useId();
  const navRef = useRef<HTMLElement>(null);

  // Light pages (offwhite hero) need a dark header even before scrolling.
  const onDarkHero = pathname === "/";
  const solid = scrolled || menuOpen || !onDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes (state adjusted during render, per React guidance).
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [servicesOpen]);

  const openServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 160);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-expo ${
          solid ? "border-b border-offwhite/10 bg-ink/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"
        }`}
        style={{ height: "var(--header-h)" }}
      >
        <nav ref={navRef} aria-label="Primary" className="container-x mx-auto flex h-full max-w-[110rem] items-center justify-between gap-6">
          <Logo />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex" role="list">
            {primaryNav.map((item) => {
              const active = isActive(item.href);
              if (item.label === "Services") {
                return (
                  <li key={item.href} className="relative" onMouseEnter={openServices} onMouseLeave={scheduleClose}>
                    <div className="flex items-center">
                      <NavLink href={item.href} active={active}>
                        {item.label}
                      </NavLink>
                      <button
                        type="button"
                        aria-expanded={servicesOpen}
                        aria-controls={megaId}
                        aria-label="Open services menu"
                        onClick={() => setServicesOpen((v) => !v)}
                        className="-ml-1 grid h-8 w-6 place-items-center text-offwhite/70 hover:text-blue"
                      >
                        <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 4.5 6 8.5l4-4" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <NavLink href={item.href} active={active}>
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href={ctaNav.href}
              className="group hidden items-center gap-2.5 rounded-full border border-offwhite/25 px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-offwhite transition-colors duration-300 hover:border-blue hover:bg-blue hover:text-ink md:inline-flex"
            >
              {ctaNav.label}
              <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-offwhite/20 text-offwhite lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden="true" className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ease-out-expo ${menuOpen ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span aria-hidden="true" className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ease-out-expo ${menuOpen ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>

          {/* Services mega-dropdown */}
          <div
            id={megaId}
            onMouseEnter={openServices}
            onMouseLeave={scheduleClose}
            className={`absolute inset-x-0 top-full hidden origin-top border-b border-offwhite/10 bg-ink/95 backdrop-blur-xl transition-[opacity,transform] duration-400 ease-out-expo lg:block ${
              servicesOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
            aria-hidden={!servicesOpen}
          >
            <div className="container-x mx-auto grid max-w-[110rem] grid-cols-12 gap-8 py-10">
              <div className="col-span-4">
                <p className="eyebrow text-blue">What we do</p>
                <p className="h3 mt-5 max-w-[16ch] text-offwhite">Eight ways we help brands stand out and scale.</p>
                <Link href="/our-services/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-grey-soft hover:text-blue" tabIndex={servicesOpen ? 0 : -1}>
                  All services <Arrow />
                </Link>
              </div>
              <ul className="col-span-8 grid grid-cols-2 gap-x-10" role="list">
                {services.map((s) => (
                  <li key={s.slug} className="border-t border-offwhite/10">
                    <Link
                      href={serviceHref(s)}
                      tabIndex={servicesOpen ? 0 : -1}
                      className="group flex items-baseline gap-4 py-4 text-offwhite transition-colors hover:text-blue"
                    >
                      <span className="text-xs font-semibold text-grey">{s.number}</span>
                      <span className="flex-1 text-[1.0625rem] font-semibold">{s.title}</span>
                      <Arrow className="translate-y-0.5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative px-3 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${active ? "text-offwhite" : "text-offwhite/70 hover:text-offwhite"}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute inset-x-3 -bottom-0.5 h-[1.5px] origin-left bg-blue transition-transform duration-500 ease-out-expo ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
      />
    </Link>
  );
}
