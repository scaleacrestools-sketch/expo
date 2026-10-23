"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { hero } from "@/content/home";
import { ensureGsap, prefersReducedMotion, useGsap } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/home/fx";

const COLS = 10; // desktop staircase: columns retract upward, left → right
const ROWS = 14; // phones: rows retract to the right, top → bottom (diagonal steps)

/**
 * Natural width of hero.word in Outfit 700 at 1px with -0.04em tracking (4.687, measured in Chromium).
 * The giant word is sized in container units so it always spans the full content width.
 */
const WORD_EM = 4.7;

/**
 * Homepage hero, after Arpeggio: one full-bleed art-directed still, an editorial statement
 * top-left, a light display tagline top-right, crosshair marks, and the brand name set
 * edge to edge along the foot. A stepped staircase mask reveals it on load; on scroll the
 * picture contracts into a framed card and the type lifts away, handing over to the next
 * section. Pointer movement adds a little depth between the layers. No form.
 */
export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const word = Array.from(hero.word);

  // Scroll: frame contracts, type lifts away.
  useGsap(ref, ({ gsap, el }) => {
    const frame = el.querySelector("[data-frame]");
    const img = el.querySelector("[data-img]");
    const copy = el.querySelectorAll("[data-out]");
    const mm = gsap.matchMedia();
    const build = (inset: string) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      tl.fromTo(frame, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: inset, ease: "none", duration: 1 }, 0)
        .fromTo(img, { scale: 1 }, { scale: 1.16, ease: "none", duration: 1 }, 0)
        .to(copy, { y: -90, opacity: 0, ease: "power1.in", duration: 0.45, stagger: 0.04 }, 0);
    };
    mm.add("(min-width: 768px)", () => build("inset(13% 21% 24% 21% round 28px)"));
    mm.add("(max-width: 767px)", () => build("inset(9% 7% 30% 7% round 22px)"));
  });

  // Pointer depth (fine pointers only).
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const gsap = ensureGsap();
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((n) => ({
      d: Number(n.dataset.depth),
      x: gsap.quickTo(n, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(n, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d); });
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <section ref={ref} className="sh relative bg-ink text-white" aria-labelledby="home-hero-title">
      <div className="sticky top-0 h-[100svh] min-h-[40rem] overflow-hidden">
        {/* Picture */}
        <div data-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div data-depth="-26" className="absolute -inset-6">
            <div data-img className="sh-img absolute inset-0">
              <picture>
                <source media="(max-width: 767px)" srcSet={hero.image.portrait} width={hero.image.pw} height={hero.image.ph} />
                <img src={hero.image.landscape} alt="" width={hero.image.w} height={hero.image.h} fetchPriority="high" decoding="async" className="h-full w-full object-cover object-center [filter:grayscale(1)_brightness(1.22)_contrast(1.08)]" />
              </picture>
            </div>
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.6)_0%,rgb(var(--ink-rgb)/0.05)_28%,transparent_55%)] max-md:bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.55)_0%,rgb(var(--ink-rgb)/0)_25%,rgb(var(--ink-rgb)/0.45)_45%,rgb(var(--ink-rgb)/0.6)_78%,rgb(var(--ink-rgb)/0.25)_100%)]" />
        </div>

        {/* Crosshair marks */}
        <div aria-hidden="true" data-out className="pointer-events-none absolute inset-0">
          {["3.5%", "34.5%", "65.5%", "96.5%"].flatMap((l) => ["10%", "36.7%", "63.3%", "90%"].map((t) => [l, t])).map(([l, t]) => (
            <span key={l + t} className="sh-op absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white/60 max-md:hidden" style={{ left: l, top: t }}>
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </span>
          ))}
          {["5.6%", "50%", "94.4%"].flatMap((l) => ["10.7%", "39%", "67.8%", "96.2%"].map((t) => [l, t])).map(([l, t]) => (
            <span key={`m${l}${t}`} className="sh-op absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white/50 md:hidden" style={{ left: l, top: t }}>
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </span>
          ))}
        </div>

        {/* Type */}
        <div className="container-x relative mx-auto flex h-full max-w-[120rem] flex-col pb-[clamp(0.75rem,2.6vh,1.6rem)] pt-[calc(var(--header-h)+clamp(1.25rem,6.5vh,4.5rem))]">
          <div data-out className="mt-auto grid gap-y-5 md:mt-0 md:grid-cols-12 md:gap-x-8 md:gap-y-0 md:pl-[clamp(0rem,4.2vw,4rem)]">
            <h1 id="home-hero-title" data-depth="8" className="text-[clamp(1.85rem,7.6vw,2.4rem)] font-medium leading-[1.12] tracking-[-0.04em] md:col-span-7 md:row-start-1 md:text-[clamp(2.25rem,3.2vw,3.75rem)] md:leading-[1.18]">
              {hero.statement.map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]">
                  <span className="sh-line block" style={{ animationDelay: `${640 + i * 90}ms` }}>{l}</span>
                </span>
              ))}
            </h1>

            <p data-depth="14" aria-hidden="true" className="text-[clamp(2.2rem,10.6vw,3.2rem)] font-light leading-[0.94] tracking-[-0.045em] text-white md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1 md:mt-[clamp(1.5rem,4vh,3rem)] md:text-right md:text-[clamp(2.5rem,3.7vw,4.4rem)]">
              {hero.tagline.map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.08em]">
                  <span className={`sh-line block ${i === 1 ? "pl-[10%] md:pl-0" : ""}`} style={{ animationDelay: `${760 + i * 90}ms` }}>{l}</span>
                </span>
              ))}
            </p>

            <div className="sh-fade flex max-w-[34rem] items-start gap-4 md:col-span-6 md:row-start-2 md:mt-[clamp(1.5rem,5vh,3.25rem)] md:pl-[clamp(0rem,2.8vw,2.5rem)]" style={{ animationDelay: "980ms" }}>
              <span aria-hidden="true" className="mt-[0.3em] h-5 w-5 shrink-0 rounded-full border-[5px] border-blue md:h-6 md:w-6" />
              <p className="text-[clamp(1rem,4.2vw,1.125rem)] font-medium leading-[1.35] tracking-[-0.015em] text-white/90 md:text-[clamp(1.125rem,1.5vw,1.5rem)]">{hero.support}</p>
            </div>

            <div className="sh-fade flex flex-wrap items-center gap-x-6 gap-y-4 md:col-span-6 md:row-start-3 md:mt-[clamp(1.25rem,4vh,2.5rem)] md:pl-[clamp(0rem,2.8vw,2.5rem)]" style={{ animationDelay: "1080ms" }}>
              <Magnetic>
                <Link
                  href="/contact-us/"
                  className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[0.875rem] font-semibold tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-blue hover:text-white"
                >
                  Start a project
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-blue text-white transition-[transform,background-color] duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-white group-hover:text-blue">
                    <Arrow className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Magnetic>
              <a href="#manifesto" className="group inline-flex items-center gap-3 text-[0.8125rem] font-medium text-white/80 hover:text-white">
                <span aria-hidden="true" className="relative block h-8 w-[1.15rem] rounded-full border border-white/50">
                  <span className="sh-dot absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-white" />
                </span>
                Scroll to explore
              </a>
            </div>
          </div>

          {/* Brand word, edge to edge */}
          <div data-out className="mt-[clamp(1.5rem,4vh,2.5rem)] md:mt-auto">
            <div data-depth="5" className="relative [container-type:inline-size]">
              <p aria-hidden="true" className="sh-word flex select-none font-bold leading-[0.8] tracking-[-0.04em] text-[color:var(--color-blue)]" style={{ fontSize: `calc(100cqw / ${WORD_EM})` }}>
                {word.map((ch, i) => (
                  <span key={i} className="inline-block overflow-hidden pt-[0.06em]">
                    <span className="sh-ch inline-block" style={{ animationDelay: `${300 + i * 45}ms` }}>{ch}</span>
                  </span>
                ))}
              </p>
              <span aria-hidden="true" className="sh-fade absolute right-0 top-0 hidden -translate-y-full pb-2 text-[0.75rem] font-medium tracking-[0.02em] text-white/70 md:block" style={{ animationDelay: "1150ms" }}>
                Delhi · Agra · Bangalore
              </span>
            </div>
          </div>
        </div>

        {/* Staircase intro mask */}
        <div aria-hidden="true" className="sh-cols pointer-events-none absolute inset-0 z-30 grid max-md:hidden" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {Array.from({ length: COLS }, (_, i) => (
            <span key={i} className="block h-full bg-ink" style={{ animationDelay: `${80 + i * 55}ms` }} />
          ))}
        </div>
        <div aria-hidden="true" className="sh-rows pointer-events-none absolute inset-0 z-30 grid md:hidden" style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {Array.from({ length: ROWS }, (_, i) => (
            <span key={i} className="-mb-px block w-full bg-ink" style={{ animationDelay: `${80 + i * 45}ms` }} />
          ))}
        </div>
      </div>

      <style>{`
        .sh { height: 175svh; }
        @media (max-width: 767px) { .sh { height: 150svh; } }
        .sh-cols > span { transform-origin: 50% 0%; animation: sh-col 0.75s cubic-bezier(0.76,0,0.24,1) forwards; }
        @keyframes sh-col { to { transform: scaleY(0); } }
        .sh-rows > span { transform-origin: 100% 50%; animation: sh-row 0.7s cubic-bezier(0.76,0,0.24,1) forwards; }
        @keyframes sh-row { to { transform: scaleX(0); } }
        .sh-img { animation: sh-zoom 2.2s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes sh-zoom { from { transform: scale(1.14); } to { transform: none; } }
        .js .sh-ch { transform: translateY(105%); animation: sh-up 1.15s cubic-bezier(0.16,1,0.3,1) forwards; }
        .js .sh-line { transform: translateY(108%); animation: sh-up 1.1s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes sh-up { to { transform: none; } }
        .js .sh-fade { opacity: 0; animation: sh-fade 1s cubic-bezier(0.16,1,0.3,1) 1000ms forwards; }
        @keyframes sh-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .js .sh-op { opacity: 0; animation: sh-op 1.2s ease 1100ms forwards; }
        @keyframes sh-op { to { opacity: 1; } }
        .sh-dot { animation: sh-dot 1.8s cubic-bezier(0.65,0,0.35,1) infinite; }
        @keyframes sh-dot { 0% { transform: translate(-50%, 0); opacity: 1; } 75% { transform: translate(-50%, 10px); opacity: 0; } 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .sh { height: auto; }
          .sh-cols, .sh-rows { display: none; }
          .sh-img, .sh-dot { animation: none; }
          .js .sh-ch, .js .sh-line, .js .sh-fade, .js .sh-op { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
