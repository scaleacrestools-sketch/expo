"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ndWork } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Pic, Rules, Tag, Words } from "@/components/nd/ui";

type W = (typeof ndWork)[number];

/**
 * 10 — Selected work. Sticky introduction beside a staggered two-column gallery of genuine
 * projects (campaign creatives and live websites in a browser frame); each image opens from the
 * top as it arrives, settles from a slight zoom, and the right column drifts a little slower.
 */
export function NdWork() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const right = el.querySelector("[data-slow]");
      if (right) gsap.fromTo(right, { y: 0 }, { y: -120, ease: "none", scrollTrigger: { trigger: right, start: "top bottom", end: "bottom top", scrub: 0.3 } });
    });
  });

  const left = ndWork.filter((_, i) => i % 2 === 0);
  const right = ndWork.filter((_, i) => i % 2 === 1);
  return (
    <section ref={ref} id="selected-work" className="nd-dark relative" aria-labelledby="nd-selected-title">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-grid">
          <div className="nd-cell lg:sticky lg:top-24 lg:self-start">
            <Tag>Portfolio</Tag>
            <Words id="nd-selected-title" lines={["Selected", "work."]} className="nd-d2 mt-7" />
            <p data-nd="up" className="nd-lead nd-muted mt-6 max-w-[24rem]">Launches, identities, websites and campaigns delivered for developers and growth brands.</p>
            <p data-nd="up" className="nd-label mt-6 text-white/80">{String(ndWork.length).padStart(2, "0")} projects</p>
            <Link data-nd="up" href="/our-work/" className="nd-btn nd-btn--white mt-8 w-full max-w-[20rem]">View all work <ArrowUR /></Link>
          </div>
          <div className="lg:col-span-2 max-lg:mt-12 md:col-span-2 grid gap-y-14 md:grid-cols-2">
            <div className="grid content-start gap-y-14">{left.map((w, i) => <Item key={w.client} w={w} i={i} />)}</div>
            <div data-slow className="grid content-start gap-y-14 md:pt-40">{right.map((w, i) => <Item key={w.client} w={w} i={i} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ w, i }: { w: W; i: number }) {
  const portrait = w.image.h > w.image.w;
  return (
    <figure className="nd-cell group m-0">
      <div data-nd="clip" style={{ "--d": i * 60 } as CSSProperties} className="nd-lift relative overflow-hidden rounded-[4px] bg-[color:var(--charcoal)] ring-1 ring-white/10">
        {w.domain ? (
          <div className="flex h-8 items-center gap-1.5 border-b border-white/8 px-3">
            {[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 rounded-full bg-white/22" />)}
            <span className="mx-auto truncate px-4 text-[0.8125rem] text-white/50">{w.domain}</span>
          </div>
        ) : null}
        <div className={`nd-zoom relative overflow-hidden ${portrait ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
          <div className="nd-settle absolute inset-0">
            <Pic image={w.image} alt={w.alt} sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw" imgClass="absolute inset-0 h-full w-full object-cover object-top" />
          </div>
        </div>
      </div>
      <figcaption data-nd="up" className="mt-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="shrink-0 whitespace-nowrap text-[clamp(1.25rem,1.6vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">{w.client}</span>
          <span className="nd-label nd-muted text-right">{w.project}</span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5" role="list">
          {w.tags.map((t) => <li key={t} className="nd-pill text-white/80">{t}</li>)}
        </ul>
      </figcaption>
    </figure>
  );
}
