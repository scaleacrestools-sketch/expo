"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ndBrandBoards, ndBrands } from "@/content/nd";
import { ArrowUR, Pic, Rules, Tag, Words } from "@/components/nd/ui";

/**
 * 09 — We don't create brands. We create market leaders. Type-led: the line set very large,
 * two branding boards shown big (genuine identity work from the company profile, composed, never
 * whole slides), then an index of identity, print and outdoor work. On desktop a preview of each
 * piece follows the cursor along the index.
 */
export function NdBrands() {
  const list = useRef<HTMLUListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [armed, setArmed] = useState(false); // previews load on first hover only

  useEffect(() => {
    const ul = list.current;
    const pv = preview.current;
    if (!ul || !pv || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; };
    const tick = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      pv.style.transform = `translate3d(${cx + 28}px, ${cy - 110}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    ul.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => { ul.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="branding" className="nd-light relative" aria-labelledby="nd-brand-title">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-cell">
          <Tag>Branding &amp; identity</Tag>
          <Words
            id="nd-brand-title"
            lines={["We don't create brands.", "We create market leaders."]}
            accent={["leaders."]}
            lineClass={["", "lg:text-right"]}
            className="mt-8 text-[clamp(2.6rem,7.2vw,8.75rem)] font-semibold leading-[0.92] tracking-[-0.055em]"
          />
        </div>

        <div className="nd-grid mt-[clamp(3rem,6vw,5rem)] gap-y-8">
          <div className="nd-cell flex flex-col justify-between gap-8">
            <p data-nd="up" className="nd-lead max-w-[26rem]">Identity, print and outdoor work for developers and their projects: logos, stationery, signage, hoardings and launch kits that make a project look as good as it is.</p>
            <Link data-nd="up" href="/real-estate-branding-agency/" className="nd-link nd-label w-fit">Branding services <ArrowUR className="h-3.5 w-3.5" /></Link>
          </div>
          {ndBrandBoards.map((b, i) => (
            <figure key={b.title} className="nd-cell m-0">
              <div data-nd="clip" style={{ "--d": i * 100 } as CSSProperties} className="nd-zoom nd-lift relative aspect-[2200/1238] overflow-hidden rounded-[6px] bg-white shadow-[var(--sh-2)]">
                <Pic image={b.image} alt={b.alt} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" imgClass="absolute inset-0 h-full w-full object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4">
                <span className="text-[1.0625rem] font-semibold tracking-[-0.01em]">{b.title}</span>
                <span className="nd-label nd-muted">{b.client}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Index */}
        <div className="nd-grid mt-[clamp(3.5rem,7vw,6rem)]">
          <p className="nd-cell nd-label">Branding index <span className="nd-muted">({String(ndBrands.length).padStart(2, "0")})</span></p>
          <ul ref={list} className="lg:col-span-2 max-lg:mt-5" role="list" onPointerLeave={() => setHover(null)}>
            {ndBrands.map((b, i) => (
              <li key={b.title} data-nd="up" style={{ "--d": i * 40 } as CSSProperties} onPointerEnter={() => { setArmed(true); setHover(i); }} className="nd-cell group border-t border-[color:var(--line-l)] last:border-b">
                <div className="flex items-center gap-4 py-4 md:gap-6">
                  <span className="nd-label w-8 shrink-0 tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative aspect-[924/522] w-24 shrink-0 overflow-hidden rounded-[3px] bg-white shadow-[var(--sh-1)] lg:hidden">
                    <Pic image={b.image} alt="" sizes="96px" imgClass="absolute inset-0 h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 text-[clamp(1.25rem,1.9vw,2rem)] font-semibold leading-tight tracking-[-0.03em] transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-[color:var(--royal)]">{b.title}</span>
                  <span className="nd-label nd-muted hidden shrink-0 md:block">{b.client}</span>
                  <span className="nd-pill hidden shrink-0 lg:inline-flex">{b.kind}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cursor preview (desktop) */}
      <div ref={preview} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[22rem] lg:block">
        {ndBrands.map((b, i) => (
          <div key={b.title} className="absolute inset-x-0 top-0 aspect-[924/522] overflow-hidden shadow-[var(--sh-3)] transition-[clip-path,opacity] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" style={{ clipPath: hover === i ? "inset(0 0 0 0)" : "inset(50% 0 50% 0)", opacity: hover === i ? 1 : 0 }}>
            {armed ? <Pic image={b.image} alt="" sizes="352px" imgClass="h-full w-full object-cover" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
