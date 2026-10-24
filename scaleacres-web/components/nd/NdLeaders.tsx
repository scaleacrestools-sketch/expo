"use client";

import { useRef, type CSSProperties } from "react";
import { ndLeaders } from "@/content/nd";
import { leadersCopy } from "@/content/home";
import { useGsap } from "@/lib/motion";
import { Pic, Rules, Tag, Words } from "@/components/nd/ui";

/**
 * 04 — We Don't Create Brands. We Create Market Leaders. (from the first homepage design).
 * Very large masked type, then genuine branding work as a pinned horizontal strip on desktop:
 * each frame opens from a clipped window and its image drifts inside it. Phones swipe.
 */
export function NdLeaders() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const pin = el.querySelector<HTMLElement>("[data-pin]");
      const track = el.querySelector<HTMLElement>("[data-track]");
      const bar = el.querySelector<HTMLElement>("[data-bar]");
      const count = el.querySelector<HTMLElement>("[data-count]");
      if (!pin || !track) return;
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin, start: "top top", end: () => `+=${distance() * 0.85}`, pin: true, scrub: 0.35, invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            if (count) count.textContent = String(Math.min(ndLeaders.length, 1 + Math.floor(self.progress * ndLeaders.length))).padStart(2, "0");
          },
        },
      });
      track.querySelectorAll<HTMLElement>("[data-frame]").forEach((f) => {
        gsap.fromTo(f, { clipPath: "inset(8% 0% 8% 16%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: f, containerAnimation: tween, start: "left 100%", end: "left 60%", scrub: 0.3 } });
        const im = f.querySelector("img");
        if (im) gsap.fromTo(im, { xPercent: -4 }, { xPercent: 4, ease: "none", scrollTrigger: { trigger: f, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
  });

  return (
    <section ref={ref} id="market-leaders" className="nd-light relative overflow-hidden" aria-labelledby="nd-leaders-title">
      <Rules />
      <div className="nd-wrap relative pt-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-cell">
          <Tag>Branding &amp; positioning</Tag>
          <Words
            id="nd-leaders-title"
            lines={["We Don't Create Brands.", "We Create Market Leaders."]}
            accent={["Leaders."]}
            lineClass={["", "lg:pl-[16%]"]}
            className="mt-8 text-[clamp(2.6rem,7vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]"
          />
        </div>
        <div className="nd-grid mt-[clamp(2rem,4vw,3.5rem)]">
          <p data-nd="up" className="nd-cell nd-lead max-w-[36rem] md:col-start-2 lg:col-span-2 lg:col-start-2 [&_strong]:font-semibold [&_strong]:text-[color:var(--navy)]" dangerouslySetInnerHTML={{ __html: leadersCopy }} />
        </div>
      </div>

      {/* Strip */}
      <div data-pin className="relative mt-[clamp(2.5rem,5vw,4.5rem)] pb-[clamp(4rem,8vw,7rem)] lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:pb-0">
        <div data-track className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--m)] pb-4 [scrollbar-width:none] lg:w-max lg:snap-none lg:gap-[2vw] lg:overflow-visible lg:pb-0 lg:pr-[14vw]" role="list" aria-label="Branding work">
          {ndLeaders.map((b, i) => {
            const portrait = b.image.h > b.image.w;
            return (
              <figure key={b.title} role="listitem" className={`group m-0 shrink-0 snap-start ${portrait ? "w-[62vw] sm:w-[38vw] lg:w-[24vw]" : "w-[86vw] sm:w-[66vw] lg:w-[54vw]"}`}>
                <div data-frame className="relative overflow-hidden bg-white shadow-[0_30px_70px_-40px_rgb(11_22_64/0.45)]" style={{ aspectRatio: portrait ? "4 / 5" : "16 / 9", maxHeight: "66svh" } as CSSProperties}>
                  <Pic image={b.image} alt={`${b.title} for ${b.client}`} sizes={portrait ? "(min-width: 1024px) 26vw, 62vw" : "(min-width: 1024px) 56vw, 86vw"} imgClass={`absolute inset-y-0 left-[-6%] h-full w-[112%] max-w-none object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${portrait ? "object-top" : ""}`} />
                </div>
                <figcaption className="mt-4 flex items-baseline gap-4">
                  <span className="nd-label tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.0625rem] font-semibold tracking-[-0.01em]">{b.title}</span>
                  <span className="nd-label nd-muted">{b.client}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <div className="mt-10 hidden items-center gap-6 px-[var(--m)] lg:flex">
          <span className="nd-label"><span data-count className="tabular-nums text-[color:var(--royal)]">01</span> / {String(ndLeaders.length).padStart(2, "0")}</span>
          <span className="relative h-px flex-1 bg-[color:var(--line-l)]"><span data-bar className="absolute inset-0 origin-left scale-x-0 bg-[color:var(--royal)]" /></span>
          <span className="nd-label nd-muted">Scroll</span>
        </div>
      </div>
    </section>
  );
}
