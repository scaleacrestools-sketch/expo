"use client";

import { useRef, useState, type CSSProperties } from "react";
import { ndProcess } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { Rules, Tag, Words } from "@/components/nd/ui";

/**
 * 08 — How we work. Four steps as cards on the grid; as the section scrolls through, the
 * current step turns Brand Black (hover or focus also selects a step).
 */
export function NdProcess() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useGsap(ref, ({ ScrollTrigger, el }) => {
    ScrollTrigger.create({
      trigger: el.querySelector("[data-cards]"),
      start: "top 70%",
      end: "bottom 45%",
      onUpdate: (self) => setActive(Math.min(ndProcess.length - 1, Math.floor(self.progress * ndProcess.length))),
    });
  });

  return (
    <section ref={ref} id="process" className="nd-light relative" aria-labelledby="nd-proc-title">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-grid gap-y-10">
          <div className="nd-cell flex flex-col justify-between gap-10">
            <div>
              <Tag>How we work</Tag>
              <Words id="nd-proc-title" lines={["From brief", "to launch."]} className="nd-d2 mt-7" />
              <p data-nd="up" className="nd-lead mt-6 max-w-[24rem]">From the first conversation to live campaigns, one process and one accountable team.</p>
            </div>
            <figure data-nd="up" className="m-0 max-w-[24rem] border-l-2 border-[color:var(--royal)] pl-5">
              <blockquote className="text-[1.25rem] font-medium leading-[1.4] tracking-[-0.015em]">We don&apos;t start with deliverables. We start with the buyer, the market and the number the project needs to hit.</blockquote>
              <figcaption className="nd-label nd-muted mt-3">How every ScaleAcres project begins</figcaption>
            </figure>
          </div>
          <ol data-cards className="grid gap-3 md:grid-cols-2 lg:col-span-2 lg:gap-0" role="list">
            {ndProcess.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.n} className="nd-cell lg:py-1.5" data-nd="up" style={{ "--d": i * 70 } as CSSProperties}>
                  <article
                    tabIndex={0}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`flex min-h-[18rem] flex-col justify-between p-6 transition-[background-color,color,box-shadow] duration-500 md:min-h-[21rem] md:p-7 ${on ? "bg-[color:var(--ink)] text-white shadow-[var(--sh-3)]" : "bg-white text-[color:var(--ink)] shadow-[var(--sh-1)]"}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`grid h-11 w-11 place-items-center text-[1rem] font-semibold tabular-nums transition-colors duration-500 ${on ? "bg-[color:var(--royal)] text-white" : "bg-[color:var(--mist)] text-[color:var(--royal)]"}`}>{p.n}</span>
                      <span className={`nd-label ${on ? "text-white/70" : "nd-muted"}`}>{p.key}</span>
                    </div>
                    <div>
                      <h3 className="text-[clamp(1.5rem,1.9vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">{p.title}</h3>
                      <p className={`nd-body mt-3 max-w-[28rem] ${on ? "text-white/85" : "nd-muted"}`}>{p.body}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
