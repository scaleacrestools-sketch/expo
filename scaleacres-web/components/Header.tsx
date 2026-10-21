"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { headerDescriptor } from "@/content/nav";
import { Logo } from "@/components/ui/Logo";
import { MenuOverlay } from "@/components/MenuOverlay";

/**
 * Agency header: logo left, minimal hamburger centred, positioning descriptor right,
 * thin rule underneath with a short blue accent. Transparent over the hero, solid on scroll.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Close the menu on navigation (state adjusted during render, per React guidance).
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pages that open on a full-screen video hero: the homepage and the Delhi city page (under review).
  const overHero = (pathname === "/" || pathname.replace(/\/$/, "") === "/real-estate-marketing-delhi") && !scrolled;
  const solid = !overHero && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 text-white transition-[background-color,backdrop-filter,padding] duration-500 ease-out-expo ${
          solid ? "bg-ink/95 py-0 backdrop-blur-md" : "bg-transparent py-2 md:py-4"
        }`}
      >
        <div className="container-x mx-auto grid max-w-[120rem] grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]" style={{ minHeight: "var(--header-h)" }}>
          <div className="justify-self-start">
            <Logo size="lg" strapline={false} />
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="group relative grid h-12 w-14 place-items-center justify-self-end md:justify-self-center"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className={`absolute h-[2px] w-9 bg-current transition-transform duration-500 ease-out-expo ${open ? "rotate-45" : "-translate-y-[6px] group-hover:-translate-y-[8px]"}`} />
            <span aria-hidden="true" className={`absolute h-[2px] bg-current transition-all duration-500 ease-out-expo ${open ? "w-9 -rotate-45" : "w-9 translate-y-[6px] group-hover:w-6 group-hover:translate-y-[8px]"}`} />
          </button>

          <div className="hidden justify-self-end text-right md:block">
            <span aria-hidden="true" className="mb-3 ml-auto block h-[2px] w-10 bg-blue" />
            <p className="text-[0.75rem] font-semibold uppercase leading-[1.7] tracking-[0.24em] text-white/90">
              {headerDescriptor[0]}
              <br />
              {headerDescriptor[1]}
            </p>
          </div>
        </div>

        {/* Thin rule with a short brand-blue accent under the logo */}
        <div className={`container-x mx-auto max-w-[120rem] transition-opacity duration-500 ${solid ? "opacity-0" : "opacity-100"}`}>
          <div className="relative h-px bg-white/20">
            <span className="absolute left-0 top-0 h-[2px] w-14 -translate-y-px bg-blue" />
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
