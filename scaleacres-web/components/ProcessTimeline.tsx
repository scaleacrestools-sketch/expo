"use client";

import { useRef } from "react";
import { processSteps } from "@/content/process";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useGsap } from "@/lib/motion";

export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const line = el.querySelector<HTMLElement>("[data-line]");
    const steps = el.querySelectorAll<HTMLElement>("[data-step]");
    gsap.fromTo(line, { scaleX: 0, scaleY: 0 }, {
      scaleX: 1, scaleY: 1, ease: "none", transformOrigin: "left top",
      scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
    });
    gsap.fromTo(steps, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 78%", once: true } });
  });

  return (
    <Reveal as="section" id="approach" className="section-y bg-ivory text-charcoal">
      <div className="container-x mx-auto max-w-[110rem]">
        <SectionHeading tone="light" eyebrow="How we make it happen" title={<>Think. Create.<br />Build. Scale.</>} description="Great work comes from combining clear thinking with smart execution. Our approach brings the right ideas, people and technology together." />

        <ol ref={ref} className="relative mt-20 grid gap-12 md:grid-cols-4 md:gap-8" role="list">
          {/* Progress line: horizontal on desktop, vertical on mobile */}
          <span aria-hidden="true" className="absolute left-[0.6875rem] top-0 h-full w-px bg-charcoal/10 md:left-0 md:top-[0.6875rem] md:h-px md:w-full" />
          <span data-line aria-hidden="true" className="absolute left-[0.6875rem] top-0 h-full w-px origin-top bg-coral md:left-0 md:top-[0.6875rem] md:h-px md:w-full md:origin-left" />
          {processSteps.map((s) => (
            <li key={s.number} data-step className="relative pl-10 md:pl-0 md:pt-10">
              <span aria-hidden="true" className="absolute left-0 top-0 grid h-[1.4375rem] w-[1.4375rem] place-items-center rounded-full border border-coral bg-ivory md:left-0 md:top-0">
                <span className="h-2 w-2 rounded-full bg-coral" />
              </span>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-charcoal/50">{s.number} /</p>
              <h3 className="mt-2 text-[clamp(1.75rem,1rem+2vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-4 max-w-[30ch] leading-[1.7] text-charcoal/70">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
