"use client";

import { useRef, type ReactNode } from "react";

/** Horizontal scroll-snap rail with previous/next controls. All items stay in the HTML (crawlable). */
export function Rail({ children, label, tone = "light" }: { children: ReactNode; label: string; tone?: "light" | "dark" }) {
  const ref = useRef<HTMLUListElement>(null);
  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 900), behavior: "smooth" });
  };
  const btn = `grid h-12 w-12 place-items-center rounded-full border transition-colors ${tone === "dark" ? "border-white/25 text-white hover:border-sky hover:bg-sky hover:text-ink" : "border-ink/20 hover:border-blue hover:bg-blue hover:text-white"}`;
  return (
    <div>
      <div className="mb-6 flex justify-end gap-3">
        <button type="button" className={btn} onClick={() => go(-1)} aria-label={`Previous ${label}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className={btn} onClick={() => go(1)} aria-label={`Next ${label}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <ul ref={ref} role="list" aria-label={label} className="scrollbar-none -mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-2">
        {children}
      </ul>
    </div>
  );
}
