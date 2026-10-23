"use client";

import Link from "next/link";
import { useRef } from "react";
import { collage } from "@/content/home";
import { site } from "@/content/site";
import { useGsap } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { Kicker } from "@/components/home/fx";

/** Where each work image sits in the drifting layer: left (%), top (% of the stage), width (vw), speed. */
const PLACES = [
  { l: 3, t: 62, w: 27, s: 1.0, r: -2 },
  { l: 71, t: 78, w: 15, s: 1.35, r: 3 },
  { l: 55, t: 128, w: 30, s: 0.85, r: 0 },
  { l: 12, t: 150, w: 14, s: 1.25, r: -3 },
  { l: 2, t: 205, w: 25, s: 1.1, r: 2 },
  { l: 74, t: 196, w: 15, s: 0.95, r: -2 },
];

/**
 * 02 — Who we are. A sticky oversized statement while genuine ScaleAcres work drifts past at
 * different speeds (difference blend keeps the type legible over any image). Then the
 * agency introduction.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const stage = el.querySelector<HTMLElement>("[data-stage]");
    const items = el.querySelectorAll<HTMLElement>("[data-drift]");
    if (!stage) return;
    const st = { trigger: stage, start: "top top", end: "bottom bottom", scrub: 1.2 };
    items.forEach((it) => {
      const s = Number(it.dataset.drift);
      gsap.fromTo(it, { y: "20vh" }, { y: `${-230 * s}vh`, ease: "none", scrollTrigger: st });
    });
    gsap.fromTo(el.querySelectorAll("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.09, ease: "power4.out", scrollTrigger: { trigger: stage, start: "top 70%", once: true } });
    gsap.fromTo(el.querySelector("[data-statement]"), { scale: 1.06 }, { scale: 0.94, ease: "none", scrollTrigger: st });
  });

  return (
    <section ref={ref} id="manifesto" className="relative bg-ink text-white" aria-labelledby="manifesto-title">
      <div data-stage className="relative h-[200svh] md:h-[270svh] [.reduced-motion_&]:h-auto">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden [.reduced-motion_&]:relative [.reduced-motion_&]:h-auto [.reduced-motion_&]:py-32">
          {/* Drifting layer */}
          <div aria-hidden="true" className="absolute inset-0 [.reduced-motion_&]:hidden">
            {collage.map((c, i) => {
              const p = PLACES[i];
              return (
                <figure
                  key={c.src}
                  data-drift={p.s}
                  className="absolute m-0 overflow-hidden rounded-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
                  style={{ left: `${p.l}%`, top: `${p.t}%`, width: `max(${p.w}vw, ${c.w > c.h ? 13 : 8.5}rem)`, rotate: `${p.r}deg` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt="" width={c.w} height={c.h} loading="lazy" decoding="async" className="block h-auto w-full" />
                </figure>
              );
            })}
          </div>

          <h2
            id="manifesto-title"
            data-statement
            className="relative z-10 px-5 text-center text-[clamp(3rem,12.5vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em] mix-blend-difference md:text-[clamp(4rem,9.2vw,12.5rem)]"
          >
            {["We build", "real estate brands", "people remember."].map((l) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">{l}</span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Agency introduction */}
      <div className="container-x mx-auto grid max-w-[120rem] gap-12 pb-[var(--section-y)] pt-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <Kicker>Who we are</Kicker>
        </div>
        <div className="lg:col-span-6">
          <p className="text-[clamp(1.5rem,1.1rem+1.6vw,2.75rem)] font-medium leading-[1.18] tracking-[-0.02em] text-white">
            {site.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-[0.9375rem] font-semibold uppercase tracking-[0.16em]">
            <Link href="/about-us/" className="link-u inline-flex items-center gap-2 text-white">About ScaleAcres <Arrow className="h-3.5 w-3.5" /></Link>
            <Link href="/our-team/" className="link-u inline-flex items-center gap-2 text-white/70 hover:text-white">Meet the team <Arrow className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-6 self-end text-[0.9375rem] lg:col-span-3 lg:grid-cols-1">
          <div className="border-t border-white/15 pt-4">
            <dt className="uppercase tracking-[0.18em] text-white/50">Studios</dt>
            <dd className="mt-2 text-lg font-medium text-white">{site.offices.join(" · ")}</dd>
          </div>
          <div className="border-t border-white/15 pt-4">
            <dt className="uppercase tracking-[0.18em] text-white/50">Markets</dt>
            <dd className="mt-2 text-lg font-medium text-white">{site.markets.join(" · ")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
