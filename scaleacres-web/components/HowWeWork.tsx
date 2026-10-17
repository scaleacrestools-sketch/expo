"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { processImages } from "@/content/assets";
import { homepageSeo } from "@/content/seo/homepage";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

const STAGES = [
  { n: "01", title: "Discover", text: "Understand the client's market, audience, requirements and objectives.", image: processImages.discover },
  { n: "02", title: "Strategize", text: "Develop the strategy, creative direction, marketing plan and execution roadmap.", image: processImages.strategize },
  { n: "03", title: "Create", text: "Produce branding, websites, campaigns, visuals and video assets.", image: processImages.create },
  { n: "04", title: "Launch", text: "Bring the digital experience, campaigns and approved creatives to market.", image: processImages.launch },
  { n: "05", title: "Optimize & Scale", text: "Review outcomes, improve performance and refine execution.", image: processImages.optimize },
] as const;

/**
 * Section 05 — How we work. Brand Black, alternating media/text stages with thin blue rules.
 * A sticky indicator tracks the stage in view; images drift slightly with scroll (CSS
 * scroll-driven, static under reduced motion). Stage imagery is labelled concept art.
 * Also carries the protected homepage intro and the legacy service headings + links.
 */
export function HowWeWork() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="approach" aria-labelledby="hww-title" className="relative isolate overflow-hidden bg-ink text-white">
      <div className="container-x mx-auto max-w-[120rem] py-[clamp(5.5rem,11vw,10rem)]">
        {/* Header with the oversized outline word behind it */}
        <Reveal className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[0.12em] right-0 -z-10 select-none text-[clamp(3rem,15.5vw,15.5rem)] font-black uppercase leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]"
          >
            Strategy
          </span>
          <p className="eyebrow text-blue" data-reveal>How we work</p>
          <h2 id="hww-title" className="h2 mt-6" data-split-reveal>
            From a plan.
            <br />
            <span className="text-blue">To a brand journey.</span>
          </h2>
          <p className="mt-8 max-w-[52ch] text-[length:var(--fs-body)] leading-[1.7] text-grey-soft" data-reveal>
            {homepageSeo.intro.value}
          </p>
        </Reveal>

        {/* Active-stage indicator (desktop) */}
        <div className="pointer-events-none sticky top-24 z-10 mt-14 hidden h-0 justify-end lg:flex" aria-hidden="true">
          <div className="flex items-center gap-4 rounded-full border border-white/12 bg-ink/80 px-5 py-2.5 backdrop-blur-sm">
            <span className="text-[0.75rem] font-semibold tabular-nums text-sky">{STAGES[active].n}</span>
            <span className="relative h-px w-28 bg-white/15">
              <span className="absolute inset-y-0 left-0 bg-sky transition-[width] duration-700 ease-out-expo" style={{ width: `${((active + 1) / STAGES.length) * 100}%` }} />
            </span>
            <span className="text-[0.75rem] font-semibold tabular-nums text-grey">05</span>
            <span className="min-w-[9.5rem] text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/80">{STAGES[active].title}</span>
          </div>
        </div>

        <ol className="mt-14 lg:mt-24" role="list">
          {STAGES.map((s, i) => {
            const on = i === active;
            const flip = i % 2 === 1;
            return (
              <li key={s.n} ref={(el) => { refs.current[i] = el; }} data-i={i} data-stage={s.title} className="relative py-10 md:py-14 lg:py-16">
                {/* Thin blue rule; fills to Sky on the active stage */}
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-blue/35" />
                <span aria-hidden="true" className={`absolute left-0 top-0 h-px bg-sky transition-[width] duration-1000 ease-out-expo ${on ? "w-full" : "w-0"}`} />
                <Reveal className="grid items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-16">
                  <figure className={`group relative m-0 overflow-hidden rounded-[14px] lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : ""}`} data-reveal>
                    <div className="aspect-[4/3] overflow-hidden md:aspect-[16/11] lg:aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image.src}
                        width={s.image.width}
                        height={s.image.height}
                        alt={s.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="hww-drift h-full w-full object-cover transition-[scale] duration-[1200ms] ease-out-expo"
                      />
                    </div>
                    <figcaption className="dev-badge">Concept visual</figcaption>
                  </figure>
                  <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`} data-reveal>
                    <p
                      aria-hidden="true"
                      className={`text-[clamp(4rem,2rem+6vw,8.5rem)] font-black leading-[0.8] tracking-[-0.05em] transition-colors duration-700 ${on ? "text-sky" : "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.3)]"}`}
                    >
                      {s.n}
                    </p>
                    <h3 className={`mt-6 text-[clamp(1.875rem,1rem+2vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.03em] transition-colors duration-700 ${on ? "text-white" : "text-white/70"}`}>
                      <span className="sr-only">Stage {s.n}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-5 max-w-[40ch] text-[length:var(--fs-body)] leading-[1.7] text-grey-soft">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 border-t border-blue/35 pt-6 text-[0.8125rem] text-white/55">
          Stage imagery is AI-generated concept art for illustration. It is not client work.
        </p>

        {/* Legacy service headings and internal links from the live homepage (protected). */}
        <div className="mt-20 lg:mt-28">
          <h2 className="label text-grey">{homepageSeo.servicesHeading.value}</h2>
          <ul className="mt-6 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5" role="list">
            {homepageSeo.legacyServices.value.map((s, i) => (
              <li key={s.heading} className="border-b border-white/15 lg:border-r lg:last:border-r-0">
                <Link href={s.href} className="group flex h-full min-h-[8.5rem] flex-col justify-between gap-5 py-6 sm:px-5 lg:px-6">
                  <span className="text-xs font-semibold tabular-nums text-white/50">0{i + 1}</span>
                  <h3 className="text-[1.1875rem] font-bold leading-tight tracking-[-0.01em] transition-colors group-hover:text-sky">{s.heading}</h3>
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
