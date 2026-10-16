"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { themeOptions, type ThemeId } from "@/content/themes";

/**
 * Preview-only colour switcher. Hidden on production hosts (see THEME_BOOT) and never
 * re-renders the page: it only flips attributes on <html>, so the hero video and GSAP
 * animations keep running.
 */
const KEY = "sa-theme";
const LOGO_KEY = "sa-logo";
const noop = () => () => {};
const read = () => (document.documentElement.dataset.themeLab === "on" ? "on" : "off");

export function ThemeSwitcher() {
  const enabled = useSyncExternalStore(noop, read, () => "off") === "on";
  const [theme, setTheme] = useState<ThemeId>(() => (typeof document === "undefined" ? "baseline" : ((document.documentElement.dataset.theme as ThemeId) ?? "baseline")));
  const [logo, setLogo] = useState(() => (typeof document === "undefined" ? "official" : (document.documentElement.dataset.logo ?? "official")));
  const [open, setOpen] = useState(true);
  if (!enabled) return null;

  const apply = (fn: () => void) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(fn);
    else fn();
  };
  const choose = (id: ThemeId) => {
    apply(() => {
      const root = document.documentElement;
      if (id === "baseline") delete root.dataset.theme;
      else root.dataset.theme = id;
    });
    try { localStorage.setItem(KEY, id); } catch {}
    setTheme(id);
  };
  const toggleLogo = () => {
    const next = logo === "proposal" ? "official" : "proposal";
    apply(() => {
      if (next === "proposal") document.documentElement.dataset.logo = "proposal";
      else delete document.documentElement.dataset.logo;
    });
    try { localStorage.setItem(LOGO_KEY, next); } catch {}
    setLogo(next);
  };

  return (
    <div data-theme-switcher className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 text-white">
      {open ? (
        <div role="group" aria-label="Colour exploration preview" className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-[#111]/90 p-1.5 shadow-2xl backdrop-blur-md sm:flex-nowrap sm:rounded-full">
          <span className="hidden px-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/50 lg:inline">Preview</span>
          {themeOptions.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={theme === t.id}
              onClick={() => choose(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors ${theme === t.id ? "bg-white text-[#111]" : "text-white/75 hover:text-white"}`}
            >
              <span aria-hidden="true" className="flex">
                {t.swatches.slice(0, 2).map((s) => (
                  <span key={s.hex} className="-ml-1 h-3 w-3 rounded-full ring-1 ring-white/40 first:ml-0" style={{ background: s.hex }} />
                ))}
              </span>
              {t.short}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={logo === "proposal"}
            disabled={theme === "baseline"}
            onClick={toggleLogo}
            title="Show the recoloured logo proposal for this option (not approved)"
            className="rounded-full px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/75 hover:text-white disabled:opacity-35"
          >
            Logo: {logo === "proposal" ? "Proposal" : "Official"}
          </button>
          <Link href="/theme-lab/" className="rounded-full px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/75 underline-offset-4 hover:text-white hover:underline">
            Compare ↗
          </Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Hide colour preview bar" className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:text-white">×</button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-white/15 bg-[#111]/90 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] shadow-2xl backdrop-blur-md">
          Colour preview
        </button>
      )}
    </div>
  );
}
