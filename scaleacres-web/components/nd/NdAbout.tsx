"use client";

import Link from "next/link";
import { Fragment, useRef, type CSSProperties } from "react";
import { ndAbout } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Pic, Rules, Tag } from "@/components/nd/ui";

/** Words that finish in Royal as the statement fills in. */
const EMPHASIS = new Set(["launch,", "position", "sell", "out"]);

/**
 * 03 — Who we are. White editorial grid. The panel opens out of the black statement section
 * (rounded, inset → full bleed), the column rules draw down, the statement's words fill in as it
 * scrolls (a few finish in Royal) while two inline work chips widen; the label and key facts sit
 * beside it. Below: genuine studio photographs, the introduction with what we do and links, and a
 * labelled collage of six live client sites that drifts gently.
 */
export function NdAbout() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    // black → white: the panel widens and squares off as it arrives
    gsap.fromTo(el, { clipPath: "inset(0% 3.5% 0% 3.5% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: 0.4 } });
    const rules = el.querySelector(".nd-rules");
    if (rules) gsap.fromTo(rules, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 70%", once: true } });
    const p = el.querySelector("[data-statement]");
    gsap.fromTo(el.querySelectorAll("[data-fill]"), { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: 0.06, scrollTrigger: { trigger: p, start: "top 85%", end: "bottom 52%", scrub: 0.3 } });
    gsap.fromTo(el.querySelectorAll("[data-em]"), { color: "#0b0d0d" }, { color: "#1d4ed8", ease: "none", scrollTrigger: { trigger: p, start: "center 62%", end: "bottom 50%", scrub: 0.3 } });
    el.querySelectorAll("[data-chip]").forEach((c) => gsap.fromTo(c, { width: "0.6em" }, { width: "2.1em", ease: "none", scrollTrigger: { trigger: c, start: "top 88%", end: "top 58%", scrub: 0.3 } }));
    const photo = el.querySelector("[data-photo]");
    if (photo) gsap.fromTo(photo, { yPercent: -6 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    // collage columns drift against each other
    el.querySelectorAll<HTMLElement>("[data-col]").forEach((c) => {
      const d = Number(c.dataset.col);
      gsap.fromTo(c, { yPercent: 5 * d }, { yPercent: -5 * d, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    });
  });

  const parts = ndAbout.statement.split(/(\{a\}|\{b\})/);
  const cols = [ndAbout.portfolio.filter((_, i) => i % 2 === 0), ndAbout.portfolio.filter((_, i) => i % 2 === 1)];
  return (
    <section ref={ref} id="about" className="nd-white relative will-change-[clip-path]" aria-labelledby="nd-about-title">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4rem,7vw,6.5rem)]">
        {/* Row 1: label and facts beside the statement */}
        <div className="nd-grid gap-y-8">
          <div className="nd-cell flex flex-col gap-8 max-lg:order-2 lg:justify-between">
            <div data-nd="up" className="max-lg:hidden"><Tag>Who we are</Tag></div>
            <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {ndAbout.facts.map((f, i) => (
                <div key={f.k} data-nd="up" style={{ "--d": i * 90 } as CSSProperties} className="border-t border-[color:var(--line-l)] pt-3">
                  <dt className="nd-label nd-muted">{f.k}</dt>
                  <dd className="mt-1.5 text-[1.0625rem] font-medium leading-snug tracking-[-0.01em]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="nd-cell md:col-span-2 lg:col-span-2">
            <div data-nd="up" className="mb-6 lg:hidden"><Tag>Who we are</Tag></div>
            <h2 id="nd-about-title" className="sr-only">Who we are</h2>
            <p data-statement className="nd-d3 font-medium text-[color:var(--ink)]">
              {parts.map((part, i) =>
                part === "{a}" || part === "{b}" ? (
                  <span key={i} data-chip className="relative mx-[0.12em] inline-block h-[0.82em] w-[2.1em] overflow-hidden rounded-full align-[-0.06em] shadow-[var(--sh-1)]">
                    <Pic image={ndAbout.chips[part === "{a}" ? "a" : "b"]} alt="" sizes="120px" imgClass="absolute inset-0 h-full w-full object-cover" />
                  </span>
                ) : (
                  <Fragment key={i}>
                    {part.trim().split(" ").map((w, wi) => (
                      <Fragment key={wi}>
                        <span data-fill {...(EMPHASIS.has(w) ? { "data-em": "" } : {})}>{w}</span>{" "}
                      </Fragment>
                    ))}
                  </Fragment>
                ),
              )}
            </p>
          </div>
        </div>

        {/* Row 2: studio, introduction, portfolio */}
        <div className="nd-grid mt-[clamp(2.75rem,5vw,4.5rem)] items-start gap-y-10">
          <figure className="nd-cell m-0 max-lg:order-3">
            <div className="relative">
              <div data-nd="clip" className="nd-zoom relative aspect-[15/16] overflow-hidden rounded-[8px] bg-[color:var(--mist)] shadow-[var(--sh-2)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export: pre-sized WebP */}
                <img data-photo src={ndAbout.studio.team.src} srcSet={ndAbout.studio.team.srcSet} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw" alt={ndAbout.studio.team.alt} width={ndAbout.studio.team.w} height={ndAbout.studio.team.h} loading="lazy" decoding="async" className="absolute inset-0 h-[110%] w-full object-cover" />
              </div>
              <div data-nd="clip" style={{ "--d": 160 } as CSSProperties} className="nd-zoom absolute -bottom-6 right-4 w-[38%] overflow-hidden rounded-[8px] border-4 border-white bg-[color:var(--mist)] shadow-[var(--sh-3)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export: pre-sized WebP */}
                <img src={ndAbout.studio.founders.src} srcSet={ndAbout.studio.founders.srcSet} sizes="(min-width: 1024px) 12vw, 36vw" alt={ndAbout.studio.founders.alt} width={ndAbout.studio.founders.w} height={ndAbout.studio.founders.h} loading="lazy" decoding="async" className="block aspect-[15/16] w-full object-cover" />
              </div>
            </div>
            <figcaption data-nd="up" className="nd-label nd-muted mt-9">Inside the ScaleAcres studio · Delhi</figcaption>
          </figure>

          <div className="nd-cell flex flex-col gap-8">
            <p data-nd="up" className="nd-lead max-w-[30rem]">{ndAbout.body}</p>
            <div data-nd="up" style={{ "--d": 80 } as CSSProperties}>
              <p className="nd-label">What we do</p>
              <ul className="mt-3" role="list">
                {ndAbout.disciplines.map((d, i) => (
                  <li key={d} className="flex items-center gap-4 border-t border-[color:var(--line-l)] py-3 text-[1.0625rem] font-medium tracking-[-0.01em] last:border-b">
                    <span className="nd-label tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")}</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div data-nd="up" style={{ "--d": 140 } as CSSProperties} className="flex flex-wrap gap-x-7 gap-y-3">
              <Link href="/about-us/" className="nd-link nd-label">About ScaleAcres <ArrowUR className="h-3.5 w-3.5" /></Link>
              <Link href="/our-team/" className="nd-link nd-label">Meet the team <ArrowUR className="h-3.5 w-3.5" /></Link>
            </div>
          </div>

          {/* Website portfolio: six live client sites */}
          <figure className="nd-cell m-0 md:col-span-2 lg:col-span-1" aria-labelledby="nd-about-portfolio">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {cols.map((col, ci) => (
                <div key={ci} data-col={ci === 0 ? 1 : -1} className={`flex flex-col gap-3 md:gap-4 ${ci === 1 ? "mt-[12%]" : ""}`}>
                  {col.map((site, k) => (
                    <div key={site.name}>
                      <div data-nd="clip" style={{ "--d": (k * 2 + ci) * 90 } as CSSProperties} className="nd-zoom nd-lift relative aspect-[16/10] overflow-hidden rounded-[6px] bg-[color:var(--mist)] shadow-[var(--sh-2)]">
                        <Pic image={site.image} alt={`${site.name} website, designed and developed by ScaleAcres`} sizes="(min-width: 1024px) 15vw, (min-width: 768px) 46vw, 46vw" imgClass="absolute inset-0 h-full w-full object-cover object-top" />
                      </div>
                      <p className="mt-2 text-[0.8125rem] font-semibold tracking-[-0.005em] text-[color:var(--ink)]">{site.name}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <figcaption id="nd-about-portfolio" data-nd="up" className="nd-label nd-muted mt-5">Website portfolio · six live client sites</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
