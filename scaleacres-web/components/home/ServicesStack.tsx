"use client";

import Link from "next/link";
import { useRef } from "react";
import { homeServices, type ServiceMedia } from "@/content/home";
import { useGsap } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { InViewVideo, Kicker, Magnetic, MaskLines } from "@/components/home/fx";

/**
 * 03 — Our Services. Adapted from the reference's sticky card stack: eight full-width cards
 * pin one over the other (each offset a little lower, so the stack reads as an index). As a
 * card is covered it recedes (scale + shade) and each card's media opens from a clipped frame.
 * Phones get a plain sequence of cards (no sticky stacking).
 */
export function ServicesStack() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
      cards.forEach((card, i) => {
        const inner = card.querySelector<HTMLElement>("[data-inner]");
        const shade = card.querySelector<HTMLElement>("[data-shade]");
        const next = cards[i + 1];
        if (next && inner && shade) {
          const st = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
          gsap.to(inner, { scale: 0.9, ease: "none", scrollTrigger: st });
          gsap.to(shade, { opacity: 0.7, ease: "none", scrollTrigger: st });
        }
      });
    });
    el.querySelectorAll<HTMLElement>("[data-media]").forEach((m) => {
      gsap.fromTo(
        m,
        { clipPath: "inset(14% 10% 14% 10% round 22px)" },
        { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "top 35%", scrub: true } },
      );
      const img = m.querySelector("[data-zoom]");
      if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  return (
    <section ref={ref} id="services" className="relative bg-white text-ink" aria-labelledby="services-title">
      <div className="container-x mx-auto max-w-[120rem] pt-[var(--section-y)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Kicker tone="light">What we do</Kicker>
            <div className="relative mt-6 inline-block">
              <MaskLines
                id="services-title"
                lines={[["Our"], ["Services"]]}
                className="text-[clamp(4.25rem,17vw,8rem)] font-semibold leading-[0.84] tracking-[-0.06em] lg:text-[clamp(7rem,13.5vw,15.5rem)]"
                lineClassName={["", "lg:pl-[8vw]"]}
              />
              <span aria-hidden="true" className="absolute -right-10 top-2 text-[clamp(1rem,1.6vw,1.75rem)] font-medium text-blue md:-right-16">(08)</span>
            </div>
          </div>
          <div className="lg:col-span-4 lg:pb-6">
            <p className="text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.45] text-graphite">
              Everything your project needs to sell out: strategy, design, technology and performance under one roof.
            </p>
            <Link href="/our-services/" className="link-u mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-ink">
              All services <Arrow className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <ol className="container-x mx-auto mt-[clamp(3.5rem,7vw,7rem)] max-w-[120rem] space-y-5 pb-[var(--section-y)] lg:space-y-8" role="list">
        {homeServices.map((s, i) => (
          <li
            key={s.slug}
            data-card
            className="lg:sticky"
            style={{ top: `calc(var(--header-h) + 1.25rem + ${i * 0.9}rem)` }}
          >
            <article data-inner className="relative origin-top overflow-hidden rounded-[22px] bg-ink text-white lg:h-[min(calc(100svh-var(--header-h)-4rem-7rem),46rem)] lg:min-h-[34rem]">
              <div className="grid h-full lg:grid-cols-12">
                {/* Copy */}
                <div className="order-2 flex flex-col p-6 sm:p-8 lg:order-1 lg:col-span-5 lg:p-10 xl:p-12">
                  <div className="flex items-center justify-between border-b border-white/15 pb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em]">
                    <span className="tabular-nums text-sky">{s.number} <span className="text-white/40">/ 08</span></span>
                    <span className="text-white/55">{s.shortTitle}</span>
                  </div>
                  <h3 className="mt-7 text-[clamp(2.1rem,1.2rem+3.4vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.045em]">{s.title}</h3>
                  <p className="mt-4 text-[clamp(1rem,0.9rem+0.35vw,1.2rem)] font-medium text-sky">{s.headline}</p>
                  <p className="mt-4 max-w-[46ch] text-[0.98rem] leading-[1.65] text-grey-soft">{s.description}</p>
                  <ul className="mt-6 grid grid-cols-2 text-[0.9rem] text-white/85 lg:mt-auto" role="list">
                    {s.included.map((x) => (
                      <li key={x} className="flex items-center gap-2 border-t border-white/12 py-2.5 pr-2">
                        <span aria-hidden="true" className="text-blue">+</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <Magnetic strength={0.25}>
                      <Link href={s.path} className="group inline-flex items-center gap-4 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white">
                        <span className="grid h-12 w-12 place-items-center rounded-full border border-white/30 transition-[background-color,border-color,transform] duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-blue group-hover:bg-blue">
                          <Arrow className="h-4 w-4" />
                        </span>
                        {s.ctaLabel}
                      </Link>
                    </Magnetic>
                  </div>
                </div>

                {/* Media */}
                <div className="order-1 p-2.5 lg:order-2 lg:col-span-7 lg:h-full lg:p-3">
                  <div data-media className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-[18px] bg-ink-soft sm:aspect-[16/10] lg:aspect-auto">
                    <MediaView m={s.media} />
                    <p className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3.5 py-1.5 text-[0.6875rem] font-medium tracking-[0.04em] text-white/85 backdrop-blur-md">{s.media.caption}</p>
                  </div>
                </div>
              </div>
              <div data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

function MediaView({ m }: { m: ServiceMedia }) {
  if (m.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img data-zoom src={m.src} alt={m.alt} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${m.fit === "top" ? "object-top" : "object-center"}`} />
    );
  }
  if (m.kind === "video") {
    return <InViewVideo src={m.src} poster={m.poster} className="absolute inset-0 h-full w-full object-cover" />;
  }
  if (m.kind === "posters") {
    return (
      <div className="group/p absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#142e8c_0%,#0b1640_55%,#0b0d0d_100%)]">
        {m.items.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            loading="lazy"
            decoding="async"
            className="absolute w-[30%] rounded-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] transition-transform duration-700 ease-out-expo"
            style={{
              transform: `translateX(${(i - 1) * 62}%) rotate(${(i - 1) * 7}deg) translateY(${i === 1 ? -4 : 6}%)`,
              zIndex: i === 1 ? 2 : 1,
              ["--hx" as string]: `${(i - 1) * 92}%`,
            }}
          />
        ))}
        <style>{`.group\\/p:hover img { transform: translateX(var(--hx)) rotate(0deg) translateY(0) !important; }`}</style>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-[4%] bg-mist px-[6%] pt-[7%]">
      {m.items.map((p) => (
        <div key={p.src} className="group/s relative h-[92%] w-[42%] overflow-hidden rounded-t-[12px] bg-white shadow-[0_30px_60px_-24px_rgba(11,22,64,0.45)]">
          <div className="flex h-6 items-center gap-1.5 border-b border-line bg-white px-3">
            {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-line" />)}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="block w-full transition-transform duration-[6s] ease-in-out group-hover/s:-translate-y-[60%]" />
        </div>
      ))}
    </div>
  );
}
