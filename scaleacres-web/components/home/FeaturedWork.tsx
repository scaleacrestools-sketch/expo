"use client";

import Link from "next/link";
import { useRef } from "react";
import { featuredWork } from "@/content/home";
import { useGsap } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { Kicker, MaskLines } from "@/components/home/fx";

/** Rows alternate narrow (portrait) and wide (landscape) tiles. */
const ORDER = [0, 1, 3, 2, 4, 5]; // alternate wide/narrow per row: [P][L] / [L][P] / [P][L]

/**
 * Featured Work. Six genuine projects from scaleacres.com in an editorial grid that alternates
 * narrow (portrait creative) and wide (website / print) tiles. Each tile opens from a clipped
 * frame as it scrolls in; on hover the image eases forward and the project details lift.
 */
export function FeaturedWork() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    el.querySelectorAll<HTMLElement>("[data-tile]").forEach((t) => {
      gsap.fromTo(t, { clipPath: "inset(10% 6% 10% 6% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: t, start: "top bottom", end: "top 65%", scrub: 0.3 } });
      const img = t.querySelector("img");
      if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: t, start: "top bottom", end: "top 30%", scrub: 0.3 } });
    });
  });

  return (
    <section ref={ref} id="featured-work" className="relative bg-mist text-ink" aria-labelledby="work-title">
      <div className="container-x mx-auto max-w-[120rem] py-[var(--section-y)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Kicker tone="light">Selected projects</Kicker>
            <MaskLines id="work-title" lines={[["Featured"], ["Work."]]} accent={["Work."]} className="mt-6 h-display" lineClassName={["", "lg:pl-[10vw]"]} />
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <p className="text-[clamp(1.125rem,1rem+0.45vw,1.4rem)] leading-[1.5] text-graphite">
              Branding, websites and campaigns we have delivered for developers and real estate businesses.
            </p>
            <Link href="/our-work/" className="link-u mt-6 inline-flex items-center gap-2 text-[1rem] font-semibold text-ink">
              View all work <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ul className="mt-[clamp(3rem,6vw,5.5rem)] grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-16" role="list">
          {ORDER.map((idx) => {
            const w = featuredWork[idx];
            const portrait = w.h > w.w;
            return (
              <li key={w.client + w.project} className={portrait ? "lg:col-span-4" : "sm:col-span-2 lg:col-span-8"}>
                <figure className="group m-0">
                  <div data-tile className={`relative overflow-hidden rounded-[18px] bg-white ${portrait ? "aspect-[4/5]" : "aspect-[16/9]"} lg:h-[min(36rem,62vh)] lg:aspect-auto`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.src} alt={w.alt} width={w.w} height={w.h} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full transition-[filter,transform] duration-500 ease-out-expo ${portrait ? "object-cover object-top" : "object-cover"} group-hover:[filter:brightness(1.05)]`} />
                  </div>
                  <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <span>
                      <span className="block text-[clamp(1.375rem,1.1rem+0.7vw,1.875rem)] font-semibold tracking-[-0.025em] transition-transform duration-300 ease-out-expo group-hover:translate-x-1">{w.client}</span>
                      <span className="mt-1 block text-[1.0625rem] text-steel">{w.project}</span>
                    </span>
                    <span className="flex flex-wrap gap-2">
                      {w.work.map((x) => (
                        <span key={x} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[0.875rem] font-medium text-graphite">{x}</span>
                      ))}
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
