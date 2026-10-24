"use client";

import Link from "next/link";
import { Fragment, useRef } from "react";
import { ndAbout } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Pic, Rules, Tag } from "@/components/nd/ui";

/**
 * 02 — Who we are. One editorial statement across two columns whose words fill in as it
 * scrolls through (with two inline work images), then the agency introduction, key facts and
 * a portfolio overview.
 */
export function NdAbout() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const p = el.querySelector("[data-statement]");
    const words = el.querySelectorAll("[data-fill]");
    gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.06, scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 48%", scrub: 0.3 } });
    el.querySelectorAll("[data-chip]").forEach((c) => gsap.fromTo(c, { width: "0.6em" }, { width: "2.1em", ease: "none", scrollTrigger: { trigger: c, start: "top 85%", end: "top 55%", scrub: 0.3 } }));
  });

  const parts = ndAbout.statement.split(/(\{a\}|\{b\})/);
  return (
    <section ref={ref} id="about" className="nd-white relative" aria-labelledby="nd-about-title">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-grid">
          <div className="nd-cell">
            <Tag>Who we are</Tag>
          </div>
          <div className="nd-cell lg:col-span-2">
            <h2 id="nd-about-title" className="sr-only">Who we are</h2>
            <p data-statement className="nd-d3 max-w-[22em] font-medium max-md:mt-6">
              {parts.map((part, i) =>
                part === "{a}" || part === "{b}" ? (
                  <span key={i} data-chip className="relative mx-[0.12em] inline-block h-[0.82em] w-[2.1em] overflow-hidden rounded-full align-[-0.06em] shadow-[var(--sh-1)]">
                    <Pic image={ndAbout.chips[part === "{a}" ? "a" : "b"]} alt="" sizes="120px" imgClass="absolute inset-0 h-full w-full object-cover" />
                  </span>
                ) : (
                  <Fragment key={i}>
                    {part.trim().split(" ").map((w, wi) => (
                      <Fragment key={wi}>
                        <span data-fill>{w}</span>{" "}
                      </Fragment>
                    ))}
                  </Fragment>
                ),
              )}
            </p>
          </div>
        </div>

        <div className="nd-grid mt-[clamp(3.5rem,8vw,7rem)] gap-y-10">
          <dl className="nd-cell flex flex-col justify-end gap-5 max-lg:order-3">
            {ndAbout.facts.map((f) => (
              <div key={f.k} data-nd="up" className="border-t border-[color:var(--line-l)] pt-3">
                <dt className="nd-label nd-muted">{f.k}</dt>
                <dd className="mt-1.5 text-[1.125rem] font-medium leading-snug tracking-[-0.01em]">{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="nd-cell flex flex-col justify-between gap-8">
            <p data-nd="up" className="nd-lead max-w-[30rem]">{ndAbout.body}</p>
            <div data-nd="up" className="flex flex-wrap gap-x-7 gap-y-3">
              <Link href="/about-us/" className="nd-link nd-label">About ScaleAcres <ArrowUR className="h-3.5 w-3.5" /></Link>
              <Link href="/our-team/" className="nd-link nd-label">Meet the team <ArrowUR className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
          <figure className="nd-cell m-0">
            <div data-nd="clip" className="nd-zoom nd-lift relative aspect-[16/10] bg-white shadow-[var(--sh-2)]">
              <Pic image={ndAbout.image} alt={ndAbout.image.alt} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" imgClass="absolute inset-0 h-full w-full object-cover" />
            </div>
            <figcaption className="nd-label nd-muted mt-3">Website portfolio · six live client sites</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
