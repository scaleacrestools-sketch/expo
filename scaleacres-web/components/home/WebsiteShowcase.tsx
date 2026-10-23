"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { webProjects } from "@/content/home";
import { prefersReducedMotion, useGsap } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { Kicker, MaskLines } from "@/components/home/fx";

const AUTOPLAY_MS = 4500;

/**
 * 05 — Website Design. A curated index of genuine ScaleAcres websites beside one browser frame
 * showing the live site's first screen at a fixed 16:10 ratio (sharp, never stretched or
 * scrolled). Projects change with a quick wipe; the list advances on its own until the
 * visitor picks a project.
 */
export function WebsiteShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);

  const select = (i: number, manual = false) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
    if (manual) setAuto(false);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || prefersReducedMotion()) return;
    const t = window.setTimeout(() => {
      setPrev(active);
      setActive((active + 1) % webProjects.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [auto, inView, active]);

  useGsap(ref, ({ gsap, el }) => {
    const stage = el.querySelector("[data-stage]");
    if (stage) gsap.fromTo(stage, { scale: 0.92, y: 60, rotateX: 6 }, { scale: 1, y: 0, rotateX: 0, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "top 55%", scrub: 0.3 } });
  });

  const p = webProjects[active];

  return (
    <section ref={ref} id="websites" className="relative bg-mist text-ink" aria-labelledby="websites-title">
      <div className="container-x mx-auto max-w-[120rem] py-[var(--section-y)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Kicker tone="light">Selected websites</Kicker>
            <MaskLines
              id="websites-title"
              lines={[["Website"], ["Design."]]}
              accent={["Design."]}
              className="mt-6 h-display"
              lineClassName={["", "lg:pl-[14vw]"]}
            />
          </div>
          <p className="text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.45] text-graphite lg:col-span-4 lg:pb-5">
            A selection of websites developed by ScaleAcres, built to look premium, load fast and turn visits into enquiries.
          </p>
        </div>

        <div className="mt-[clamp(3rem,6vw,6rem)] grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Index */}
          <ol className="-mx-[var(--gutter)] flex snap-x gap-2 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:col-span-4 lg:mx-0 lg:block lg:overflow-visible lg:px-0" role="list" aria-label="Website projects">
            {webProjects.map((w, i) => {
              const on = i === active;
              return (
                <li key={w.name} className="shrink-0 snap-start lg:border-t lg:border-ink/12 lg:last:border-b">
                  <button
                    type="button"
                    onClick={() => select(i, true)}
                    aria-pressed={on}
                    className={`group relative w-full whitespace-nowrap rounded-full border px-5 py-2.5 text-left transition-colors duration-200 lg:whitespace-normal lg:rounded-none lg:border-0 lg:px-0 lg:py-[clamp(0.9rem,1.6vh,1.25rem)] ${on ? "border-ink bg-ink text-white lg:bg-transparent lg:text-ink" : "border-ink/20 text-ink hover:border-ink/40 lg:text-ink/60 lg:hover:text-ink"}`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className={`hidden text-[1rem] font-semibold tabular-nums lg:inline ${on ? "text-blue" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[1.0625rem] font-bold tracking-[-0.01em] transition-transform duration-300 ease-out-expo lg:text-[clamp(1.5rem,1rem+1vw,2.125rem)] lg:tracking-[-0.03em] lg:group-hover:translate-x-1.5">{w.name}</span>
                    </span>
                    <span className={`ml-[2.6rem] mt-1 hidden text-[1rem] leading-snug lg:block ${on ? "text-graphite" : "text-steel"}`}>{w.note}</span>
                    {/* progress */}
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-[2px] overflow-hidden lg:block">
                      {on ? <span key={`${active}-${auto}`} className={`block h-full origin-left bg-blue ${auto ? "ws-progress" : ""}`} style={{ animationDuration: `${AUTOPLAY_MS}ms` }} /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Stage */}
          <div className="lg:col-span-8 [perspective:1600px]">
            <div data-stage className="relative origin-bottom">
              <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_60px_120px_-50px_rgba(11,22,64,0.55)] ring-1 ring-ink/8">
                <div className="flex h-10 items-center gap-3 border-b border-line px-4">
                  <span className="flex gap-1.5">{[0, 1, 2].map((d) => <span key={d} className="h-2.5 w-2.5 rounded-full bg-line" />)}</span>
                  <span className="mx-auto flex h-6 min-w-0 max-w-[60%] flex-1 items-center justify-center truncate rounded-full bg-mist px-4 text-[0.875rem] font-medium text-graphite">{p.name}</span>
                  <span className="w-10" />
                </div>
                <div className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: "16 / 10" }}>
                  {webProjects.map((w, i) => {
                    const state = i === active ? "on" : i === prev ? "prev" : "off";
                    return (
                      <div key={w.name} data-state={state} className="ws-layer absolute inset-0" aria-hidden={i !== active}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={w.screenshot}
                          alt={i === active ? `${w.name} website designed and developed by ScaleAcres` : ""}
                          width={w.w}
                          height={w.h}
                          loading="lazy"
                          decoding="async"
                          className="ws-shot absolute inset-0 h-full w-full object-cover object-top"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-ink/12 pt-6">
              <div aria-live="polite">
                <p className="text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] font-semibold tracking-[-0.03em]">{p.name}</p>
                <p className="mt-1 text-[1.0625rem] text-graphite">{p.note}</p>
              </div>
              <ul className="flex flex-wrap gap-2" role="list">
                {p.meta.map((m) => (
                  <li key={m} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[0.875rem] font-medium text-graphite">{m}</li>
                ))}
              </ul>
            </div>
            <Link href="/our-work/" className="link-u mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-semibold uppercase tracking-[0.16em] text-ink">
              See more of our work <Arrow className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .ws-layer { clip-path: inset(0 0 0 100%); transition: clip-path 0.7s cubic-bezier(0.76,0,0.24,1); z-index: 0; }
        .ws-layer[data-state="prev"] { clip-path: inset(0); z-index: 1; transition: none; }
        .ws-layer[data-state="on"] { clip-path: inset(0); z-index: 2; }
        .ws-shot { transform: scale(1.06); transition: transform 1.1s cubic-bezier(0.16,1,0.3,1); }
        .ws-layer[data-state="on"] .ws-shot, .ws-layer[data-state="prev"] .ws-shot { transform: none; }
        .ws-progress { animation-name: ws-progress; animation-timing-function: linear; animation-fill-mode: both; }
        @keyframes ws-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          .ws-layer { transition: none; }
          .ws-shot { transition: none; transform: none; }
          .ws-progress { animation: none; }
        }
      `}</style>
    </section>
  );
}
