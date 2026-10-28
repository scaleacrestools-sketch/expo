"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ndServiceCards } from "@/content/nd";
import { ArrowUR } from "@/components/nd/ui";

/**
 * Index of the eight services: large rows with a number, title and what's included; on desktop
 * the service's editorial still follows the cursor (same interaction as the homepage branding index).
 */
export function ServiceIndex({ dark = false }: { dark?: boolean }) {
  const list = useRef<HTMLUListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const ul = list.current, pv = preview.current;
    if (!ul || !pv || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const tick = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; pv.style.transform = `translate3d(${cx + 28}px, ${cy - 120}px, 0)`; raf = requestAnimationFrame(tick); };
    ul.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => { ul.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  const line = dark ? "border-white/12" : "border-[color:var(--line-l)]";
  return (
    <>
      <ul ref={list} role="list" onPointerLeave={() => setHover(null)} className={`border-t ${line}`}>
        {ndServiceCards.map((s, i) => (
          <li key={s.slug} data-nd="up" style={{ "--d": i * 40 } as CSSProperties} onPointerEnter={() => { setArmed(true); setHover(i); }} className={`border-b ${line}`}>
            <Link href={s.href} className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 px-[clamp(0.75rem,1.2vw,1.25rem)] py-5 md:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:py-6">
              <span className={`nd-label tabular-nums ${dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]"}`}>{s.number}</span>
              <span className={`text-[clamp(1.35rem,2.3vw,2.25rem)] font-semibold leading-tight tracking-[-0.035em] transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 ${dark ? "group-hover:text-[color:var(--sky)]" : "group-hover:text-[color:var(--royal)]"}`}>{s.title}</span>
              <span className={`hidden text-[0.975rem] md:block ${dark ? "text-white/60" : "nd-muted"}`}>{s.tags.join(" · ")}</span>
              <span aria-hidden="true" className={`grid h-10 w-10 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 group-hover:rotate-45 group-hover:border-[color:var(--royal)] group-hover:bg-[color:var(--royal)] group-hover:text-white ${dark ? "border-white/20" : "border-[color:var(--line-l)]"}`}><ArrowUR className="h-3.5 w-3.5" /></span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={preview} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[22rem] lg:block">
        {ndServiceCards.map((s, i) => (
          <div key={s.slug} className="absolute inset-x-0 top-0 aspect-[3/2] overflow-hidden rounded-[8px] bg-[#f4f5f7] shadow-[var(--sh-3)] transition-[clip-path,opacity] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" style={{ clipPath: hover === i ? "inset(0 0 0 0)" : "inset(50% 0 50% 0)", opacity: hover === i ? 1 : 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {armed ? <img src={s.image.src} alt="" className="h-full w-full object-cover" /> : null}
          </div>
        ))}
      </div>
    </>
  );
}
