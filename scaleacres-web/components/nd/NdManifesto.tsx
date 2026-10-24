"use client";

import Link from "next/link";
import { useRef } from "react";
import { ndManifesto } from "@/content/nd";
import { site } from "@/content/site";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Pic, Rules, Tag } from "@/components/nd/ui";

/**
 * Where each work image sits in the drifting layer: left (%), top (% of the stage), width (vw), speed, tilt.
 * Two side lanes keep the work clear of the statement on desktop; on phones the work sits back.
 */
const PLACES = [
  { l: 2, t: 62, w: 17, s: 1.0, r: -2 },
  { l: 82, t: 74, w: 11, s: 1.35, r: 3 },
  { l: 79, t: 124, w: 18, s: 0.85, r: 0 },
  { l: 6, t: 146, w: 11, s: 1.25, r: -3 },
  { l: 2, t: 196, w: 17, s: 1.1, r: 2 },
  { l: 82, t: 190, w: 11, s: 0.95, r: -2 },
];

/**
 * 02 — Manifesto (from the first homepage design). A sticky statement while genuine
 * ScaleAcres work drifts past at different speeds, then the agency introduction.
 */
export function NdManifesto() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const stage = el.querySelector<HTMLElement>("[data-stage]");
    if (!stage) return;
    const st = { trigger: stage, start: "top top", end: "bottom bottom", scrub: 0.4 };
    el.querySelectorAll<HTMLElement>("[data-drift]").forEach((it) => {
      gsap.fromTo(it, { y: "20vh" }, { y: `${-175 * Number(it.dataset.drift)}vh`, ease: "none", scrollTrigger: st });
    });
    gsap.fromTo(el.querySelectorAll("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 0.75, stagger: 0.06, ease: "power4.out", scrollTrigger: { trigger: stage, start: "top 75%", once: true } });
    gsap.fromTo(el.querySelector("[data-statement]"), { scale: 1.05 }, { scale: 0.95, ease: "none", scrollTrigger: st });
  });

  return (
    <section ref={ref} id="manifesto" className="nd-dark relative" aria-labelledby="nd-manifesto-title">
      <Rules />
      <div data-stage className="relative h-[160svh] md:h-[200svh] [.reduced-motion_&]:h-auto">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden [.reduced-motion_&]:relative [.reduced-motion_&]:h-auto [.reduced-motion_&]:py-32">
          <div aria-hidden="true" className="absolute inset-0 max-md:opacity-60 [.reduced-motion_&]:hidden">
            {ndManifesto.collage.map((c, i) => {
              const p = PLACES[i];
              const portrait = c.h > c.w;
              return (
                <figure key={c.src} data-drift={p.s} className="absolute m-0 overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)]" style={{ left: `${p.l}%`, top: `${p.t}%`, width: `max(${p.w}vw, ${portrait ? 7.5 : 12}rem)`, rotate: `${p.r}deg` }}>
                  <Pic image={c} alt="" sizes="(min-width: 1024px) 26vw, 45vw" imgClass="block h-auto w-full" />
                </figure>
              );
            })}
          </div>
          <h2 id="nd-manifesto-title" data-statement className="relative z-10 px-5 text-center text-[clamp(2.9rem,12vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.05em] [text-shadow:0_8px_40px_rgb(11_13_13/0.6)] md:text-[clamp(4rem,8.6vw,11.5rem)]">
            {ndManifesto.lines.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <span data-line className={`block ${i === 2 ? "text-[color:var(--sky)]" : ""}`}>{l}</span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Agency introduction */}
      <div className="nd-wrap relative pb-[clamp(4.5rem,9vw,8rem)] pt-4">
        <div className="nd-grid gap-y-10">
          <div className="nd-cell"><Tag>Who we are</Tag></div>
          <div className="nd-cell">
            <p data-nd="up" className="text-[clamp(1.375rem,1.1rem+1vw,2.125rem)] font-medium leading-[1.22] tracking-[-0.025em]">{site.description}</p>
            <div data-nd="up" className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/about-us/" className="nd-link nd-label">About ScaleAcres <ArrowUR className="h-3.5 w-3.5" /></Link>
              <Link href="/our-team/" className="nd-link nd-label">Meet the team <ArrowUR className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
          <dl className="nd-cell grid grid-cols-2 gap-6 self-end lg:grid-cols-1">
            {[["Studios", site.offices.join(" · ")], ["Markets", site.markets.join(" · ")]].map(([k, v]) => (
              <div key={k} data-nd="up" className="border-t border-white/15 pt-3">
                <dt className="nd-label nd-muted">{k}</dt>
                <dd className="mt-1.5 text-[1.125rem] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
