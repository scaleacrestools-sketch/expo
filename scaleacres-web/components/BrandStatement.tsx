"use client";

import { useRef } from "react";
import { splitWords, useGsap } from "@/lib/motion";

const lines = ["Create different.", "Build smarter.", "Scale further."];

export function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-line]")).flatMap((l) => splitWords(l));
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", once: true } })
      .to(words, { y: 0, duration: 1.3, stagger: 0.08, ease: "expo.out" })
      .fromTo(el.querySelector("[data-sub]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.8");
    // Slow drift of the statement for depth (transform only).
    gsap.fromTo(el.querySelector("[data-block]"), { yPercent: 6 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });

  return (
    <section ref={ref} className="section-y relative overflow-hidden bg-blue text-on-accent" aria-labelledby="brand-statement">
      <div className="container-x mx-auto max-w-[110rem]">
        <div data-block className="grid gap-12 lg:grid-cols-12">
          <h2 id="brand-statement" className="lg:col-span-9">
            {lines.map((l, i) => (
              <span key={l} data-line className={`display block ${i === 1 ? "lg:pl-[12vw]" : i === 2 ? "lg:pl-[6vw]" : ""}`}>
                {l}
              </span>
            ))}
          </h2>
          <p data-sub className="lead self-end border-l-2 border-ink/40 pl-6 text-ink/85 lg:col-span-3 lg:max-w-[22ch]">
            Good ideas create attention. Great execution turns that attention into momentum.
          </p>
        </div>
      </div>
    </section>
  );
}
