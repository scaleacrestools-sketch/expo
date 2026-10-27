"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ndServiceCards } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Tag, Words } from "@/components/nd/ui";

type Card = (typeof ndServiceCards)[number];

/**
 * 04 — Our services. Eight Brand Black cards stack on a white ground: on desktop each card pins a
 * little lower than the last, so the stack reads as an index, and the card being covered recedes
 * (scale and shade) while the new one becomes dominant. Each card's motion visual opens from a
 * clipped frame and plays only while on screen. Phones get a plain sequence of cards.
 */
export function NdServices() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
      cards.forEach((card, i) => {
        const inner = card.querySelector<HTMLElement>("[data-inner]");
        const shade = card.querySelector<HTMLElement>("[data-shade]");
        const next = cards[i + 1];
        if (!next || !inner || !shade) return;
        const st = { trigger: next, start: "top bottom", end: "top 25%", scrub: 0.3 };
        gsap.to(inner, { scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.to(shade, { opacity: 0.62, ease: "none", scrollTrigger: st });
      });
    });
    el.querySelectorAll<HTMLElement>("[data-media]").forEach((m) => {
      gsap.fromTo(m, { clipPath: "inset(12% 9% 12% 9% round 22px)" }, { clipPath: "inset(0% 0% 0% 0% round 16px)", ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "top 55%", scrub: 0.3 } });
      const z = m.querySelector("[data-zoom]");
      if (z) gsap.fromTo(z, { scale: 1.14 }, { scale: 1, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "top 30%", scrub: 0.3 } });
    });
  });

  return (
    <section ref={ref} id="services" className="nd-white relative border-t border-[color:var(--line-l)]" aria-labelledby="nd-services-title">
      <div className="nd-wrap relative pt-[clamp(4.5rem,9vw,8rem)]">
        <div className="nd-grid items-end gap-y-8">
          <div className="nd-cell lg:col-span-2">
            <Tag>Our services</Tag>
            <div className="relative mt-7 inline-block pr-14 md:pr-20">
              <Words id="nd-services-title" lines={["Our", "Services"]} lineClass={["", "lg:pl-[1.1em]"]} className="text-[clamp(3.2rem,9vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]" />
              <span aria-hidden="true" className="absolute right-0 top-1 text-[clamp(1rem,1.6vw,1.75rem)] font-medium tabular-nums text-[color:var(--royal)]">(08)</span>
            </div>
          </div>
          <div className="nd-cell lg:pb-4" data-nd="up">
            <p className="nd-lead max-w-[26rem]">Everything a project needs to launch and sell: positioning and identity, websites, media and technology, planned and delivered by one team.</p>
            <Link href="/our-services/" className="nd-link nd-label mt-6 w-fit">All services <ArrowUR className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </div>

      <ol className="nd-wrap relative mt-[clamp(3rem,6vw,5.5rem)] space-y-4 pb-[clamp(4.5rem,9vw,8rem)] lg:space-y-8" role="list">
        {ndServiceCards.map((s, i) => (
          <li key={s.slug} data-card className="lg:sticky" style={{ top: `calc(5.75rem + ${i * 0.85}rem)` } as CSSProperties}>
            <ServiceCard s={s} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function ServiceCard({ s }: { s: Card }) {
  return (
    <article data-inner aria-labelledby={`nd-svc-${s.slug}`} className="nd-svc group relative origin-top overflow-hidden rounded-[22px] bg-[color:var(--ink)] text-white shadow-[var(--sh-3)] lg:h-[min(calc(100svh-5.75rem-6.8rem-1.5rem),46rem)] lg:min-h-[33rem]">
      <div className="grid h-full lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)]">
        {/* Copy */}
        <div className="order-2 flex flex-col p-6 sm:p-8 lg:order-1 lg:col-span-5 lg:p-10 xl:p-12">
          <div className="flex items-center justify-between border-b border-white/14 pb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.2em]">
            <span className="tabular-nums text-[color:var(--sky)]">{s.number} <span className="text-white/40">/ 08</span></span>
            <span className="text-white/60">{s.short}</span>
          </div>
          <h3 id={`nd-svc-${s.slug}`} className="mt-6 text-[clamp(2rem,1rem+2.6vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] [text-wrap:balance]">{s.title}</h3>
          <p className="mt-4 text-[clamp(1.0625rem,0.95rem+0.35vw,1.25rem)] font-medium leading-snug text-[color:var(--sky)]">{s.headline}</p>
          <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-[1.6] text-white/72">{s.description}</p>
          <ul className="mt-6 grid grid-cols-2 text-[0.9375rem] text-white/85 lg:mt-auto" role="list" aria-label="Included">
            {s.tags.map((x) => (
              <li key={x} className="flex items-center gap-2 border-t border-white/12 py-2.5 pr-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[color:var(--sky)]" />
                {x}
              </li>
            ))}
          </ul>
          <Link href={s.href} className="group/cta mt-6 inline-flex w-fit items-center gap-4 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[color:var(--royal)] group-hover:bg-[color:var(--royal)] group-hover/cta:rotate-45">
              <ArrowUR className="h-3.5 w-3.5" />
            </span>
            {s.cta}
          </Link>
        </div>

        {/* Motion visual */}
        <div className="order-1 p-2 lg:order-2 lg:col-span-7 lg:h-full lg:p-3">
          <div data-media className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-[16px] bg-[#0e1114] sm:aspect-[3/2] lg:aspect-auto">
            <div data-zoom className="absolute inset-0">
              <ServiceVideo src={s.video} poster={s.poster} />
            </div>
            <p className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-[rgb(11_13_13/0.72)] px-3.5 py-1.5 text-[0.8125rem] font-medium text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-[color:var(--royal)]">{s.caption}</p>
          </div>
          {s.note ? <p className="mt-2 px-1 text-[0.8125rem] leading-[1.45] text-white/50">{s.note}</p> : null}
        </div>
      </div>
      <div data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[color:var(--ink)] opacity-0" />
    </article>
  );
}

/** Poster first; the loop loads near the viewport and plays only while visible. Skipped for reduced motion / Save-Data. */
function ServiceVideo({ src, poster }: { src: string; poster: { src: string; srcSet: string } }) {
  const v = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = v.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); el.play().catch(() => undefined); } else el.pause();
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || !v.current) return;
    v.current.load();
    v.current.play().catch(() => undefined);
  }, [on]);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: pre-sized WebP posters */}
      <img src={poster.src} srcSet={poster.srcSet} sizes="(min-width: 1024px) 56vw, 100vw" alt="" width={1200} height={800} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <video ref={v} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onPlaying={() => setShown(true)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}>
        {on ? <source src={`${src}.webm`} type="video/webm" /> : null}
        {on ? <source src={`${src}.mp4`} type="video/mp4" /> : null}
      </video>
    </>
  );
}
