"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { brand } from "@/content/brand";
import { site } from "@/content/site";
import { ndNav } from "@/content/nd";
import { liveLegalLinks } from "@/content/legacy-nav";
import { Plus } from "@/components/nd/ui";

/**
 * Homepage header: official logo on the left, one Menu button on the far right. Nothing else.
 * The white bar tucks away while scrolling down and returns on scroll up; the Menu button stays.
 * The menu opens a Brand Black panel over a blurred page (Esc, the overlay or Close shut it).
 */
export function NdHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    btn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a, button");
    window.setTimeout(() => first?.focus(), 60);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a, button")).concat(btn.current ? [btn.current] : []);
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { root.style.overflow = prev; document.removeEventListener("keydown", key); };
  }, [open, close]);

  return (
    <div className="nd" style={{ background: "transparent" }}>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-[color:var(--line-l)] bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden && !open ? "-translate-y-full" : ""}`}
      >
        <div className="flex h-14 items-center px-[var(--m)] md:h-16">
          <Link href="/" aria-label="ScaleAcres — Home" className="inline-flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo.primaryNoStrapline} alt="ScaleAcres" width={brand.logo.noStraplineWidth} height={brand.logo.height} className="h-[38px] w-auto" fetchPriority="high" decoding="async" />
          </Link>
        </div>
      </header>

      {/* Menu button: fixed on its own so it stays when the bar tucks away */}
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="nd-menu"
        className={`fixed right-[var(--m)] top-[6px] z-[70] flex h-11 items-center gap-3 px-4 text-[0.875rem] font-semibold uppercase tracking-[0.01em] transition-colors duration-300 md:top-[10px] ${open ? "bg-white text-[color:var(--ink)]" : "bg-[color:var(--ink)] text-white hover:bg-[color:var(--royal)]"}`}
      >
        <span>{open ? "Close" : "Menu"}</span>
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span className={`absolute left-0 block h-[2px] w-5 bg-current transition-transform duration-500 ${open ? "top-[5px] rotate-45" : "top-0.5"}`} />
          <span className={`absolute left-0 block h-[2px] bg-current transition-all duration-500 ${open ? "top-[5px] w-5 -rotate-45" : "top-[8px] w-3.5 translate-x-1.5"}`} />
        </span>
      </button>

      {/* Overlay + panel */}
      <div
        aria-hidden={!open}
        onClick={close}
        className={`fixed inset-0 z-[60] bg-[rgb(238_242_251/0.55)] backdrop-blur-md transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        id="nd-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`nd-menu fixed right-[var(--m)] top-[3.75rem] z-[65] max-h-[calc(100svh-4.5rem)] w-[min(46rem,calc(100vw-2*var(--m)))] overflow-y-auto bg-[color:var(--ink)] text-white md:top-[4.25rem] ${open ? "is-open" : "pointer-events-none"}`}
        {...(!open ? { inert: true } : {})}
      >
        <div className="grid gap-10 p-6 md:grid-cols-2 md:p-9">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo.reversedNoStrapline} alt="" width={brand.logo.noStraplineWidth} height={brand.logo.height} className="h-9 w-auto" />
            <p className="nd-label mt-9 text-white/55">Navigation</p>
            <ul className="mt-4" role="list">
              {ndNav.map((n, i) => (
                <li key={n.href} className="overflow-hidden">
                  <Link href={n.href} onClick={() => setOpen(false)} className="nd-menu-link group flex items-baseline gap-3 py-1 text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.15] tracking-[-0.03em] text-white" style={{ "--i": i } as CSSProperties}>
                    <span className="text-[0.875rem] font-semibold tabular-nums text-white/40 transition-colors group-hover:text-[color:var(--sky)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">{n.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="nd-label text-white/55 md:mt-[4.05rem]">Contact</p>
            <ul className="mt-4 space-y-1" role="list">
              {site.phones.slice(0, 2).map((p) => (
                <li key={p.number}><a href={p.href} className="text-[1.5rem] font-medium tracking-[-0.03em] hover:text-[color:var(--sky)]">{p.number}</a></li>
              ))}
            </ul>
            <a href={`mailto:${site.email}`} className="mt-2 text-[1.125rem] hover:text-[color:var(--sky)]">{site.email}</a>
            <p className="mt-4 text-[1rem] leading-[1.55] text-white/66">{site.address.lines.join(", ")}</p>
            <ul className="mt-6 flex gap-5" role="list">
              {site.social.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="nd-link text-[1rem] font-medium">{s.label}</a></li>
              ))}
            </ul>
            <Link href="/contact-us/" onClick={() => setOpen(false)} className="nd-btn nd-btn--white mt-auto w-full max-md:mt-8">
              Start a project <Plus />
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 px-6 py-4 text-[0.875rem] text-white/55 md:px-9">
          {liveLegalLinks.slice(0, 2).map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-white">{l.label}</Link>
          ))}
          <span className="ml-auto">© {new Date().getFullYear()} {site.legalName}</span>
        </div>
      </div>

      <style>{`
        .nd-menu { clip-path: inset(0 0 100% 0); transition: clip-path 0.6s cubic-bezier(0.76,0,0.24,1); }
        .nd-menu.is-open { clip-path: inset(0 0 0 0); }
        .nd-menu .nd-menu-link { transform: translateY(110%); transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .nd-menu.is-open .nd-menu-link { transform: none; transition-delay: calc(180ms + var(--i) * 35ms); }
        @media (prefers-reduced-motion: reduce) { .nd-menu, .nd-menu .nd-menu-link { transition: none; } }
      `}</style>
    </div>
  );
}
