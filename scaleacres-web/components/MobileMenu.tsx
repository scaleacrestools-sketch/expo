"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNav, ctaNav } from "@/content/nav";
import { services, serviceHref } from "@/content/services";
import { site } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const el = panel.current;
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []).filter(
        (n) => n.offsetParent !== null,
      );
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className={`fixed inset-0 z-40 flex flex-col bg-ink text-offwhite transition-[clip-path,opacity] duration-700 ease-in-out-quart lg:hidden ${
        open ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]"
      }`}
      style={{ paddingTop: "var(--header-h)" }}
    >
      <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pb-10 pt-6">
        <ul className="space-y-1" role="list">
          {primaryNav.map((item, i) => {
            const delay = `${80 + i * 50}ms`;
            const anim = `transition-[transform,opacity] duration-600 ease-out-expo ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`;
            if (item.label === "Services") {
              return (
                <li key={item.href} className={anim} style={{ transitionDelay: delay }}>
                  <div className="flex items-center justify-between border-b border-offwhite/10">
                    <Link href={item.href} onClick={onClose} className="py-4 text-[clamp(2rem,9vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.02em]">
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls="mobile-services"
                      aria-label={servicesOpen ? "Collapse services" : "Expand services"}
                      onClick={() => setServicesOpen((v) => !v)}
                      className="grid h-12 w-12 place-items-center rounded-full border border-offwhite/20"
                    >
                      <svg aria-hidden="true" viewBox="0 0 12 12" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 6h10" />
                        <path d="M6 1v10" className={`origin-center transition-transform duration-300 ${servicesOpen ? "scale-y-0" : ""}`} />
                      </svg>
                    </button>
                  </div>
                  <ul
                    id="mobile-services"
                    role="list"
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out-quart ${servicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <li className="min-h-0 overflow-hidden">
                      <ul className="space-y-0 py-2" role="list">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link href={serviceHref(s)} onClick={onClose} className="flex items-center gap-4 py-3 text-base font-medium text-grey-soft hover:text-blue" tabIndex={servicesOpen && open ? 0 : -1}>
                              <span className="text-xs text-grey">{s.number}</span>
                              {s.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </li>
              );
            }
            return (
              <li key={item.href} className={`border-b border-offwhite/10 ${anim}`} style={{ transitionDelay: delay }}>
                <Link href={item.href} onClick={onClose} className="block py-4 text-[clamp(2rem,9vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.02em] hover:text-blue">
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={`mt-8 transition-[transform,opacity] duration-600 ease-out-expo ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: "420ms" }}>
          <Link href={ctaNav.href} onClick={onClose} className="inline-flex w-full items-center justify-between rounded-full bg-blue px-6 py-5 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
            {ctaNav.label} <Arrow />
          </Link>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-grey">
            <a href={`mailto:${site.email}`} className="hover:text-offwhite">{site.email}</a>
            <a href={site.phones[0].href} className="hover:text-offwhite">{site.phones[0].number}</a>
          </div>
          <ul className="mt-4 flex gap-5 text-xs font-semibold uppercase tracking-[0.14em] text-grey-soft" role="list">
            {site.social.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue">{s.label}</a></li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
