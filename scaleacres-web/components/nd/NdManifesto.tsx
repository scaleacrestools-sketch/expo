"use client";

import { useRef, type CSSProperties } from "react";
import { ndManifesto } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { Pic } from "@/components/nd/ui";

/**
 * Where each creative sits in the drifting layer and how fast it travels: left / top (% of the
 * stage) and width (vw) for desktop (l, t, w) and phones (lm, tm, wm), speed (s), tilt (r) and the
 * side it glides in from (x: -1 left, 1 right). Same placements and speeds as the approved build.
 */
const PLACES = [
  { l: 1, t: 58, w: 24, lm: -8, tm: 60, wm: 56, s: 1.0, r: -2, x: -1 },
  { l: 77, t: 70, w: 15, lm: 64, tm: 86, wm: 40, s: 1.35, r: 3, x: 1 },
  { l: 70, t: 118, w: 26, lm: 48, tm: 124, wm: 60, s: 0.85, r: 0, x: 1 },
  { l: 6, t: 140, w: 14, lm: -6, tm: 146, wm: 38, s: 1.25, r: -3, x: -1 },
  { l: 1, t: 186, w: 23, lm: 26, tm: 182, wm: 54, s: 1.1, r: 2, x: -1 },
  { l: 79, t: 178, w: 14, lm: 66, tm: 198, wm: 38, s: 0.95, r: -2, x: 1 },
];

/**
 * 02 — Creative statement. A sticky, very large statement on Brand Black while genuine ScaleAcres
 * work drifts past at different speeds, gliding in from the left or right. The lines rise out of
 * a mask once; the statement eases down in scale as the section scrolls. The type always sits above
 * the work (soft shadow, creatives slightly dimmed), so nothing ever covers it.
 */
export function NdManifesto() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const stage = el.querySelector<HTMLElement>("[data-stage]");
    if (!stage) return;
    const st = { trigger: stage, start: "top top", end: "bottom bottom", scrub: 0.8 };
    el.querySelectorAll<HTMLElement>("[data-drift]").forEach((it) => {
      const s = Number(it.dataset.drift), x = Number(it.dataset.x);
      gsap.fromTo(it, { y: "18vh", x: `${x * 7}vw` }, { y: `${-185 * s}vh`, x: 0, ease: "none", scrollTrigger: st });
    });
    gsap.fromTo(el.querySelectorAll("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 0.95, stagger: 0.08, ease: "power4.out", scrollTrigger: { trigger: stage, start: "top 72%", once: true } });
    gsap.fromTo(el.querySelector("[data-statement]"), { scale: 1.06 }, { scale: 0.94, ease: "none", scrollTrigger: st });
  });

  return (
    <section ref={ref} id="manifesto" className="nd-dark relative" aria-labelledby="nd-manifesto-title">
      <div data-stage className="relative h-[150svh] md:h-[175svh] [.reduced-motion_&]:h-auto">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden [.reduced-motion_&]:relative [.reduced-motion_&]:h-auto [.reduced-motion_&]:py-32">
          {/* Drifting creatives */}
          <div aria-hidden="true" className="absolute inset-0 [.reduced-motion_&]:hidden">
            {ndManifesto.collage.map((c, i) => {
              const p = PLACES[i];
              return (
                <figure
                  key={c.src}
                  data-drift={p.s}
                  data-x={p.x}
                  className="nd-drift absolute m-0 overflow-hidden rounded-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] [filter:brightness(0.82)]"
                  style={{ "--l": `${p.l}%`, "--t": `${p.t}%`, "--w": `max(${p.w}vw, ${c.w > c.h ? 13 : 8.5}rem)`, "--lm": `${p.lm}%`, "--tm": `${p.tm}%`, "--wm": `${p.wm}vw`, rotate: `${p.r}deg` } as CSSProperties}
                >
                  <Pic image={c} alt="" sizes={`(min-width: 768px) ${Math.max(p.w, 14)}vw, ${p.wm}vw`} imgClass="block h-auto w-full" />
                </figure>
              );
            })}
          </div>

          <h2 id="nd-manifesto-title" data-statement className="relative z-10 px-5 text-center text-[clamp(3rem,12.5vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white [text-shadow:0_6px_36px_rgb(11_13_13/0.7),0_2px_8px_rgb(11_13_13/0.5)] md:text-[clamp(4rem,9.2vw,12.5rem)]">
            {ndManifesto.lines.map((l) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">{l}</span>
              </span>
            ))}
          </h2>
        </div>
      </div>
      <style>{`
        .nd-drift { left: var(--lm); top: var(--tm); width: var(--wm); }
        @media (min-width: 768px) { .nd-drift { left: var(--l); top: var(--t); width: var(--w); } }
      `}</style>
    </section>
  );
}
