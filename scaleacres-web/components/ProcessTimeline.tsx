"use client";

import { useRef } from "react";
import { processSteps } from "@/content/process";
import { Reveal } from "@/components/ui/Reveal";
import { useGsap } from "@/lib/motion";

export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    gsap.fromTo(el.querySelector("[data-line]"), { scaleX: 0, scaleY: 0 }, {
      scaleX: 1, scaleY: 1, ease: "none",
      scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
    });
    el.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
      gsap.fromTo(step, { opacity: 0.25 }, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: step, start: "top 70%", toggleActions: "play none none reverse" } });
    });
  });

  return (
    <Reveal as="section" id="approach" className="section-y bg-white text-ink">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-blue-deep" data-reveal>How we make it happen</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Think. Create.
              <br />
              Build. <span className="text-blue-deep">Scale.</span>
            </h2>
          </div>
          <p className="text-[length:var(--fs-body)] leading-[1.7] text-grey-dark lg:col-span-4" data-reveal>
            Great work comes from combining clear thinking with smart execution. Our approach brings the right ideas, people and technology together.
          </p>
        </div>

        <ol ref={ref} className="relative mt-20 grid gap-14 md:grid-cols-4 md:gap-6" role="list">
          <span aria-hidden="true" className="absolute left-[1.25rem] top-0 h-full w-px bg-ink/10 md:left-0 md:top-[1.25rem] md:h-px md:w-full" />
          <span data-line aria-hidden="true" className="absolute left-[1.25rem] top-0 h-full w-[2px] origin-top bg-blue md:left-0 md:top-[1.25rem] md:h-[2px] md:w-full md:origin-left" />
          {processSteps.map((s) => (
            <li key={s.number} data-step className="relative pl-16 md:pl-0 md:pt-16">
              <span aria-hidden="true" className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-blue bg-white text-sm font-bold text-ink">
                {s.number}
              </span>
              <h3 className="break-words text-[clamp(2.25rem,1rem+2.4vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em] md:text-[clamp(1.75rem,0.6rem+2.2vw,3.25rem)]">
                {s.title}
              </h3>
              <p className="mt-5 max-w-[30ch] text-[length:var(--fs-body)] leading-[1.6] text-grey-dark">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
