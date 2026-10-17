"use client";

import { useEffect, useRef, useState } from "react";
import { clip } from "@/content/media";
import { LazyVideo } from "@/components/media/LazyVideo";

const STEPS = [
  { n: "01", title: "Discover", text: "Understand the business, audience, market and opportunities.", media: "performance" },
  { n: "02", title: "Strategize", text: "Define the roadmap, channels, messaging and measurable objectives.", media: "brand" },
  { n: "03", title: "Create", text: "Build the branding, digital experiences, visuals and campaign assets.", media: "production" },
  { n: "04", title: "Launch", text: "Execute campaigns, deploy digital experiences and bring creative work to market.", media: "web" },
  { n: "05", title: "Optimize & Scale", text: "Measure performance, refine the strategy and strengthen business outcomes.", media: "finale" },
] as const;

/**
 * Section 05 — How we work. Sticky headline, progress rule and a media frame that follows
 * the active step (one video at a time); steps scroll past on the right. Mobile: stacked timeline.
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

  const m = clip(STEPS[active].media);
  const progress = ((active + 1) / STEPS.length) * 100;

  return (
    <section id="approach" aria-labelledby="hww-title" className="bg-ink text-white">
      <div className="container-x mx-auto grid max-w-[120rem] gap-14 py-[clamp(5.5rem,11vw,10rem)] lg:grid-cols-12 lg:gap-16">
        {/* Sticky narrative */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-blue">How we work</p>
            <h2 id="hww-title" className="h2 mt-6">
              From the first idea
              <br />
              <span className="text-blue">to measurable growth.</span>
            </h2>
            <p className="mt-7 max-w-[46ch] text-[length:var(--fs-body)] leading-[1.7] text-grey-soft">
              Every project starts with understanding the business. We combine clear strategy, thoughtful creativity, dependable technology and performance-focused execution.
            </p>
            {/* progress */}
            <div className="mt-10 hidden items-center gap-5 lg:flex" aria-hidden="true">
              <span className="text-sm font-semibold tabular-nums text-sky">{STEPS[active].n}</span>
              <span className="relative h-[2px] flex-1 bg-white/15">
                <span className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-out-expo" style={{ width: `${progress}%`, background: "var(--grad)" }} />
              </span>
              <span className="text-sm font-semibold tabular-nums text-grey">05</span>
            </div>
            <figure className="relative mt-8 hidden overflow-hidden rounded-[10px] lg:block">
              <LazyVideo key={m.id} src={m.landscape} label={m.description} className="aspect-[16/10] animate-[fade-in_700ms_ease-out]" />
              <figcaption className="absolute bottom-3 left-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/80">
                {STEPS[active].title} · ScaleAcres studio
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Steps */}
        <ol className="relative lg:col-span-6 lg:col-start-7" role="list">
          <span aria-hidden="true" className="absolute bottom-6 left-[0.6rem] top-6 w-px bg-white/15 lg:hidden" />
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.n}
                ref={(el) => { refs.current[i] = el; }}
                data-i={i}
                className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-6 py-8 lg:block lg:min-h-[58vh] lg:border-t lg:border-white/12 lg:py-12"
              >
                <span aria-hidden="true" className={`relative z-[1] mt-3 h-[0.75rem] w-[0.75rem] rounded-full border-2 lg:hidden ${on ? "border-sky bg-sky" : "border-white/40 bg-ink"}`} />
                <div>
                  <p
                    aria-hidden="true"
                    className={`font-black leading-[0.8] tracking-[-0.05em] transition-colors duration-700 text-[clamp(4.5rem,2rem+8vw,10rem)] ${on ? "text-sky" : "text-white/10 lg:text-transparent lg:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.25)]"}`}
                  >
                    {s.n}
                  </p>
                  <h3 className={`mt-6 text-[clamp(1.75rem,1rem+1.8vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.03em] transition-colors duration-700 ${on ? "text-white" : "text-white/55"}`}>
                    <span className="sr-only">{s.n} — </span>
                    {s.title}
                  </h3>
                  <p className={`mt-5 max-w-[44ch] text-[length:var(--fs-body)] leading-[1.7] transition-colors duration-700 ${on ? "text-grey-soft" : "text-white/45"}`}>{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
