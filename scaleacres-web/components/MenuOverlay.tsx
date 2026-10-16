"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/content/nav";
import { services, serviceHref } from "@/content/services";
import { site } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";

/** Full-screen navigation overlay: large staggered links, services list, contact details. */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const el = panel.current;
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((n) => n.offsetParent !== null);
    const t = window.setTimeout(() => focusables()[0]?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      // Keep focus inside the overlay + header toggle.
      const toggle = document.querySelector<HTMLElement>('[aria-controls="site-menu"]');
      const f = [...focusables(), ...(toggle ? [toggle] : [])];
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const reveal = (i: number) => ({
    className: `transition-[transform,opacity] duration-700 ease-out-expo ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`,
    style: { transitionDelay: open ? `${180 + i * 60}ms` : "0ms" },
  });

  return (
    <div
      id="site-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-40 overflow-y-auto bg-ink text-white transition-[clip-path] duration-[900ms] ease-in-out-quart ${
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
      }`}
    >
      {/* Slow-moving brand glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-1/4 top-1/3 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.22),transparent)] motion-safe:animate-[menu-glow_14s_ease-in-out_infinite_alternate]" />

      <div className="container-x relative mx-auto grid min-h-full max-w-[120rem] gap-12 pb-12 pt-[calc(var(--header-h)+5rem)] lg:grid-cols-12">
        <nav aria-label="Primary" className="lg:col-span-7">
          <ol role="list" className="space-y-1">
            {primaryNav.map((item, i) => (
              <li key={item.href} {...reveal(i)}>
                <div className="flex items-center gap-4">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group flex items-baseline gap-5 py-1.5"
                  >
                    <span className="w-8 text-sm font-semibold tabular-nums text-blue">0{i + 1}</span>
                    <span className={`text-[clamp(2.25rem,1rem+4.6vw,5.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.035em] transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-blue ${isActive(item.href) ? "text-blue" : ""}`}>
                      {item.label}
                    </span>
                  </Link>
                  {item.label === "Services" ? (
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls="menu-services"
                      onClick={() => setServicesOpen((v) => !v)}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:border-blue lg:hidden"
                    >
                      <span className="sr-only">{servicesOpen ? "Hide services" : "Show services"}</span>
                      <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-45" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M6 1v10" /></svg>
                    </button>
                  ) : null}
                </div>
                {item.label === "Services" ? (
                  <ul id="menu-services" role="list" className={`grid overflow-hidden pl-[3.25rem] transition-[grid-template-rows] duration-500 lg:hidden ${servicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <li className="min-h-0">
                      <ul role="list" className="py-2">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link href={serviceHref(s)} onClick={onClose} tabIndex={servicesOpen ? 0 : -1} className="block py-2 text-base text-white/75 hover:text-blue">{s.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>

        <aside className="flex flex-col justify-between gap-12 lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-12">
          <div {...reveal(3)} className={`hidden lg:block ${reveal(3).className}`}>
            <p className="label text-blue">Services</p>
            <ul role="list" className="mt-6">
              {services.map((s) => (
                <li key={s.slug} className="border-t border-white/10 last:border-b">
                  <Link href={serviceHref(s)} onClick={onClose} className="group flex items-center justify-between gap-4 py-3.5 text-[1.0625rem] font-medium text-white/80 transition-colors hover:text-white">
                    <span className="flex items-baseline gap-4"><span className="text-xs text-white/40">{s.number}</span>{s.title}</span>
                    <Arrow className="text-blue opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div {...reveal(6)}>
            <p className="label text-blue">Get in touch</p>
            <a href={`mailto:${site.email}`} className="mt-4 block text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-semibold hover:text-blue">{site.email}</a>
            <a href={site.phones[0].href} className="mt-1 block text-lg text-white/75 hover:text-white">{site.phones[0].number}</a>
            <ul role="list" className="mt-6 flex gap-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              {site.social.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue">{s.label}</a></li>
              ))}
            </ul>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">{site.offices.join(" · ")}</p>
          </div>
        </aside>
      </div>
      <style>{`@keyframes menu-glow{from{transform:translate(0,0) scale(1)}to{transform:translate(40vw,-20vh) scale(1.2)}}`}</style>
    </div>
  );
}
