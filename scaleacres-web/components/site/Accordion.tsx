"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { Plus } from "@/components/nd/ui";

/** The homepage FAQ accordion, reusable with any content (answers arrive pre-rendered). */
export function Accordion({ items, dark = false, startOpen = 0 }: { items: { q: string; a: ReactNode }[]; dark?: boolean; startOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(startOpen);
  const id = useId();
  const line = dark ? "border-white/12" : "border-[color:var(--line-l)]";
  return (
    <ul className={`border-t ${line}`} role="list">
      {items.map((f, i) => {
        const on = open === i;
        return (
          <li key={i} data-nd="up" style={{ "--d": i * 40 } as CSSProperties} className={`border-b ${line}`}>
            <h3 className="m-0">
              <button id={`${id}-q${i}`} type="button" aria-expanded={on} aria-controls={`${id}-a${i}`} onClick={() => setOpen(on ? null : i)} className="group flex w-full items-center gap-4 py-5 text-left md:gap-6 md:py-6">
                <span className={`nd-label w-8 shrink-0 tabular-nums transition-colors ${on ? (dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]") : dark ? "text-white/45" : "nd-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`min-w-0 flex-1 text-[clamp(1.125rem,0.95rem+0.6vw,1.5rem)] font-semibold leading-snug tracking-[-0.02em] transition-colors duration-300 ${on ? (dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]") : dark ? "group-hover:text-[color:var(--sky)]" : "group-hover:text-[color:var(--royal)]"}`}>{f.q}</span>
                <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "rotate-45 border-[color:var(--royal)] bg-[color:var(--royal)] text-white" : dark ? "border-white/20 group-hover:border-[color:var(--sky)]" : "border-[color:var(--line-l)] group-hover:border-[color:var(--royal)]"}`}>
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </button>
            </h3>
            <div id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="min-h-0 overflow-hidden" inert={!on}>
                <div className={`pb-7 pl-12 pr-4 md:pl-14 md:pr-16 ${dark ? "text-white/72" : "text-[color:var(--muted-l)]"}`}>{f.a}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
