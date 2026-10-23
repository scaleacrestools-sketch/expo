"use client";

import { useRef } from "react";
import { brandWork, leadersCopy } from "@/content/home";
import { useGsap } from "@/lib/motion";
import { Kicker, MaskLines } from "@/components/home/fx";

/**
 * 04 — We Don't Create Brands. We Create Market Leaders.
 * Very large masked type, then the branding portfolio as a pinned horizontal film strip on
 * desktop (each frame opens from a clipped window and its image drifts inside it). Phones
 * get a native swipe rail.
 */
export function MarketLeaders() {
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
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            if (count) count.textContent = String(Math.min(brandWork.length, 1 + Math.floor(self.progress * brandWork.length))).padStart(2, "0");
          },
        },
      });
      track.querySelectorAll<HTMLElement>("[data-frame]").forEach((f) => {
        gsap.fromTo(f, { clipPath: "inset(10% 0% 10% 18% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none", scrollTrigger: { trigger: f, containerAnimation: tween, start: "left 105%", end: "left 45%", scrub: true } });
        const img = f.querySelector("img");
        if (img) gsap.fromTo(img, { xPercent: -5 }, { xPercent: 5, ease: "none", scrollTrigger: { trigger: f, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
  });

  return (
    <section ref={ref} id="market-leaders" className="relative overflow-hidden bg-ink text-white" aria-labelledby="leaders-title">
      <div className="container-x mx-auto max-w-[120rem] pt-[var(--section-y)]">
        <Kicker>Branding & identity</Kicker>
        <MaskLines
          id="leaders-title"
          lines={[["We", "Don't", "Create", "Brands."], ["We", "Create", "Market", "Leaders."]]}
          accent={["Leaders."]}
          className="mt-8 text-[clamp(3rem,13vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em] md:text-[clamp(4rem,8.6vw,12rem)]"
          lineClassName={["", "md:pl-[10vw]"]}
          stagger={0.07}
        />
        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12">
          <p
            className="text-[clamp(1.125rem,1rem+0.55vw,1.5rem)] leading-[1.5] text-grey-soft lg:col-span-6 lg:col-start-7 [&_strong]:font-semibold [&_strong]:text-white"
            dangerouslySetInnerHTML={{ __html: leadersCopy }}
          />
        </div>
      </div>

      {/* Film strip */}
      <div data-pin className="relative mt-[clamp(3.5rem,7vw,6rem)] lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
        <div
          data-track
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none] lg:w-max lg:snap-none lg:gap-[2.2vw] lg:overflow-visible lg:pb-0 lg:pr-[18vw]"
          role="list"
          aria-label="Branding work"
        >
          {brandWork.map((b, i) => {
            const portrait = b.h > b.w;
            return (
              <figure key={b.src} role="listitem" className={`m-0 shrink-0 snap-start ${portrait ? "w-[62vw] sm:w-[40vw] lg:w-[25vw]" : "w-[86vw] sm:w-[70vw] lg:w-[58vw]"}`}>
                <div data-frame className="relative overflow-hidden rounded-[20px] bg-ink-soft" style={{ aspectRatio: portrait ? "4 / 5" : "16 / 9", maxHeight: "68svh" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.src} alt={`${b.title} — ${b.client}`} width={b.w} height={b.h} loading="lazy" decoding="async" className="absolute inset-y-0 left-[-8%] h-full w-[116%] max-w-none object-cover" />
                </div>
                <figcaption className="mt-4 flex items-baseline gap-4 text-[0.875rem]">
                  <span className="tabular-nums text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold text-white">{b.title}</span>
                  <span className="text-white/50">{b.client}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="container-x mx-auto mt-10 hidden w-full max-w-[120rem] items-center gap-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-white/55 lg:flex">
          <span><span data-count className="tabular-nums text-white">01</span> / {String(brandWork.length).padStart(2, "0")}</span>
          <span className="relative h-px flex-1 bg-white/15">
            <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-blue" />
          </span>
          <span>Scroll</span>
        </div>
      </div>
      <div className="h-[var(--section-y)]" />
    </section>
  );
}
