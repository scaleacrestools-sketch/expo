"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { hero } from "@/content/home";
import { ensureGsap, prefersReducedMotion, useGsap } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/home/fx";

const COLS = 10; // desktop staircase: columns retract upward, left → right
const ROWS = 14; // phones: rows retract to the right, top → bottom (diagonal steps)

/** Natural width of hero.word in Outfit 700 at 1px with -0.04em tracking (4.687, measured in Chromium). */
const WORD_EM = 4.7;

const MOBILE_MQ = "(max-width: 767px)";
const subMobile = (cb: () => void) => {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMobile = () => window.matchMedia(MOBILE_MQ).matches;
const no = () => false;

/**
 * Homepage hero, after Arpeggio: a full-bleed film of ScaleAcres work, a large editorial H1,
 * readable supporting copy and the brand word along the foot. A stepped staircase mask reveals
 * it on load; on scroll the film contracts into a framed card and the type lifts away. A
 * chapter label, synced to the film, names each scene (concept scenes are labelled). No form.
 */
export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const isMobile = useSyncExternalStore(subMobile, getMobile, no);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const word = Array.from(hero.word);
  const film = isMobile ? hero.film.portrait : hero.film.landscape;

  // Film: sources attach after the load event (the headline wins LCP); poster only for reduced motion.
  useEffect(() => {
    const v = video.current;
    if (!v || prefersReducedMotion()) return;
    const start = () => {
      v.replaceChildren();
      for (const [src, type] of [[film.webm, "video/webm"], [film.mp4, "video/mp4"]]) {
        const s = document.createElement("source");
        s.src = src;
        s.type = type;
        v.appendChild(s);
      }
      v.load();
      v.play().catch(() => undefined);
    };
    if (document.readyState === "complete") {
      const t = window.setTimeout(start, 150);
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [film.webm, film.mp4]);

  // Chapter label follows the film.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      const t = v.currentTime;
      let k = 0;
      hero.chapters.forEach((c, i) => { if (t >= c.at) k = i; });
      const next = hero.chapters[k + 1]?.at ?? (v.duration || 16.3);
      setChapter(k);
      setProgress(Math.min(1, Math.max(0, (t - hero.chapters[k].at) / (next - hero.chapters[k].at))));
      raf = requestAnimationFrame(tick);
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    const off = () => cancelAnimationFrame(raf);
    v.addEventListener("play", on);
    v.addEventListener("pause", off);
    if (!v.paused) on();
    return () => { off(); v.removeEventListener("play", on); v.removeEventListener("pause", off); };
  }, [film.poster]); // the <video> is keyed by poster, so re-bind when it is replaced

  // Scroll: frame contracts, type lifts away; the film pauses once the hero is gone.
  useGsap(ref, ({ gsap, ScrollTrigger, el }) => {
    const frame = el.querySelector("[data-frame]");
    const media = el.querySelector("[data-img]");
    const copy = el.querySelectorAll("[data-out]");
    const mm = gsap.matchMedia();
    const build = (inset: string) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      tl.fromTo(frame, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: inset, ease: "none", duration: 1 }, 0)
        .fromTo(media, { scale: 1 }, { scale: 1.12, ease: "none", duration: 1 }, 0)
        .to(copy, { y: -90, opacity: 0, ease: "power1.in", duration: 0.45, stagger: 0.04 }, 0);
    };
    mm.add("(min-width: 768px)", () => build("inset(13% 21% 24% 21% round 28px)"));
    mm.add("(max-width: 767px)", () => build("inset(9% 7% 30% 7% round 22px)"));
    ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      onLeave: () => video.current?.pause(),
      onEnterBack: () => video.current?.play().catch(() => undefined),
    });
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

  const ch = hero.chapters[chapter];

  return (
    <section ref={ref} className="sh relative bg-ink text-white" aria-labelledby="home-hero-title">
      <div className="sticky top-0 h-[100svh] min-h-[40rem] overflow-hidden">
        {/* Film */}
        <div data-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div data-depth="-22" className="absolute -inset-6">
            <div data-img className="sh-img absolute inset-0">
              <video
                key={film.poster}
                ref={video}
                muted
                loop
                playsInline
                preload="none"
                poster={film.poster}
                aria-hidden="true"
                tabIndex={-1}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {/* Readability: left/top for the headline, foot for the brand word */}
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(100deg,rgb(var(--ink-rgb)/0.82)_0%,rgb(var(--ink-rgb)/0.5)_36%,rgb(var(--ink-rgb)/0.1)_62%,rgb(var(--ink-rgb)/0.2)_100%),linear-gradient(180deg,rgb(var(--ink-rgb)/0.55)_0%,transparent_22%,transparent_64%,rgb(var(--ink-rgb)/0.85)_100%)] max-md:bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.5)_0%,transparent_18%,transparent_34%,rgb(var(--ink-rgb)/0.78)_52%,rgb(var(--ink-rgb)/0.92)_100%)]" />
        </div>

        {/* Crosshair marks */}
        <div aria-hidden="true" data-out className="pointer-events-none absolute inset-0 max-md:hidden">
          {["3.5%", "34.5%", "65.5%", "96.5%"].flatMap((l) => ["10%", "36.7%", "63.3%"].map((t) => [l, t])).map(([l, t]) => (
            <span key={l + t} className="sh-op absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white/45" style={{ left: l, top: t }}>
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </span>
          ))}
        </div>

        {/* Type */}
        <div className="container-x relative mx-auto flex h-full max-w-[120rem] flex-col pb-[clamp(1rem,3vh,2rem)] pt-[calc(var(--header-h)+clamp(1.5rem,7vh,5rem))]">
          <div data-out className="mt-auto md:mt-0">
            <div className="md:grid md:grid-cols-12 md:gap-x-8">
              <h1 id="home-hero-title" data-depth="7" className="text-[clamp(2.75rem,12.4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.05em] md:col-span-9 md:text-[clamp(3.75rem,6.6vw,8.25rem)] md:leading-[0.94]">
                {hero.statement.map((l, i) => (
                  <span key={l} className="block overflow-hidden pb-[0.08em]">
                    <span className="sh-line block" style={{ animationDelay: `${620 + i * 110}ms` }}>
                      {l.split(" ").map((w, wi, arr) => (
                        <span key={wi} className={w === hero.accent ? "text-sky" : undefined}>
                          {w}
                          {wi < arr.length - 1 ? " " : null}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </h1>
              <p data-depth="12" aria-hidden="true" className="hidden text-right text-[clamp(1.5rem,2.2vw,2.6rem)] font-light leading-[1.02] tracking-[-0.035em] text-white/90 md:col-span-3 md:block md:pt-[0.6vw]">
                {hero.tagline.map((l, i) => (
                  <span key={l} className="block overflow-hidden pb-[0.08em]">
                    <span className="sh-line block" style={{ animationDelay: `${760 + i * 90}ms` }}>{l}</span>
                  </span>
                ))}
              </p>
            </div>

            <div className="sh-fade mt-6 flex max-w-[40rem] items-start gap-4 md:mt-[clamp(1.75rem,4.5vh,3rem)] md:pl-[0.35vw]" style={{ animationDelay: "980ms" }}>
              <span aria-hidden="true" className="mt-[0.32em] h-5 w-5 shrink-0 rounded-full border-[5px] border-blue md:h-6 md:w-6" />
              <p className="text-[1.125rem] font-normal leading-[1.45] text-white/90 md:text-[clamp(1.25rem,1.45vw,1.625rem)] md:leading-[1.4]">{hero.support}</p>
            </div>

            <div className="sh-fade mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-[clamp(1.75rem,4vh,2.75rem)] md:pl-[0.35vw]" style={{ animationDelay: "1080ms" }}>
              <Magnetic>
                <Link
                  href="/contact-us/"
                  className="group inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-[1rem] font-semibold tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-blue hover:text-white md:text-[1.0625rem]"
                >
                  Start a project
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-blue text-white transition-[transform,background-color] duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-white group-hover:text-blue md:h-11 md:w-11">
                    <Arrow className="h-4 w-4" />
                  </span>
                </Link>
              </Magnetic>
              <a href="#websites" className="link-u text-[1rem] font-medium text-white/90 hover:text-white md:text-[1.0625rem]">
                See our work
              </a>
            </div>
          </div>

          {/* Foot: brand word + film chapter */}
          <div data-out className="mt-7 md:mt-auto md:grid md:grid-cols-12 md:items-end md:gap-x-8">
            <div className="mb-4 md:order-2 md:col-span-4 md:col-start-9 md:mb-[0.55vw]" aria-live="off">
              <p className="sh-fade flex items-baseline gap-3 text-[0.9375rem] font-medium text-white md:justify-end" style={{ animationDelay: "1150ms" }}>
                <span className="tabular-nums text-sky">{String(chapter + 1).padStart(2, "0")} / {String(hero.chapters.length).padStart(2, "0")}</span>
                <span>{ch.label}</span>
              </p>
              <p className="sh-fade mt-1 truncate text-[0.8125rem] text-white/60 md:text-right" style={{ animationDelay: "1150ms" }}>{ch.note}</p>
              <span aria-hidden="true" className="sh-fade relative mt-3 block h-[2px] overflow-hidden bg-white/20" style={{ animationDelay: "1150ms" }}>
                <span className="absolute inset-0 origin-left bg-blue" style={{ transform: `scaleX(${progress})` }} />
              </span>
            </div>
            <div data-depth="4" className="relative [container-type:inline-size] md:order-1 md:col-span-7">
              <p aria-hidden="true" className="sh-word flex select-none font-bold leading-[0.8] tracking-[-0.04em] text-[color:var(--color-blue)]" style={{ fontSize: `calc(100cqw / ${WORD_EM})` }}>
                {word.map((c, i) => (
                  <span key={i} className="inline-block overflow-hidden pt-[0.06em]">
                    <span className="sh-ch inline-block" style={{ animationDelay: `${300 + i * 45}ms` }}>{c}</span>
                  </span>
                ))}
              </p>
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
        @keyframes sh-zoom { from { transform: scale(1.12); } to { transform: none; } }
        .js .sh-ch { transform: translateY(105%); animation: sh-up 1.15s cubic-bezier(0.16,1,0.3,1) forwards; }
        .js .sh-line { transform: translateY(108%); animation: sh-up 1.1s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes sh-up { to { transform: none; } }
        .js .sh-fade { opacity: 0; animation: sh-fade 1s cubic-bezier(0.16,1,0.3,1) 1000ms forwards; }
        @keyframes sh-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .js .sh-op { opacity: 0; animation: sh-op 1.2s ease 1100ms forwards; }
        @keyframes sh-op { to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .sh { height: auto; }
          .sh-cols, .sh-rows { display: none; }
          .sh-img { animation: none; }
          .js .sh-ch, .js .sh-line, .js .sh-fade, .js .sh-op { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
