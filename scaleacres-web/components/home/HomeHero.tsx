"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { hero, type HeroScene } from "@/content/home";
import { ensureGsap, prefersReducedMotion, useGsap } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/home/fx";

const COLS = 10; // desktop staircase: columns retract upward, left → right
const ROWS = 12; // phones: rows retract to the right, top → bottom (diagonal steps)
const SCENE_MS = 3200; // time each piece of work stays on screen
const FIRST_SCENE_MS = 420; // first piece opens (in CSS, before hydration) as the staircase clears

/** Natural width of hero.word in Outfit 700 at 1px with -0.04em tracking (4.687, measured in Chromium). */
const WORD_EM = 4.7;

/**
 * Homepage hero, after Arpeggio: one full-bleed monochrome still, the editorial statement top
 * left, a light display tagline top right, crosshair marks and the brand word along the foot.
 * Beside the headline, genuine ScaleAcres work opens one piece at a time (website, brand,
 * social, performance, video), each paired with its own display line. A stepped staircase
 * mask reveals the hero on load; on scroll the picture contracts into a framed card and the
 * type lifts away. The showcase can be paused, and each piece can be picked directly. No form.
 */
export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const word = Array.from(hero.word);
  const scenes = hero.scenes;
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);

  const show = (i: number) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };

  // The first piece is server-rendered and revealed by CSS; under reduced motion nothing cycles.
  useEffect(() => {
    if (!prefersReducedMotion()) return;
    const t = window.setTimeout(() => setPaused(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  // Advance while the hero is visible, the tab is active and the visitor has not paused.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (paused || !inView) return;
    const t = window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      setPrev(active);
      setActive((active + 1) % scenes.length);
    }, SCENE_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, inView, scenes.length]);

  // Scroll: frame contracts, type lifts away.
  useGsap(ref, ({ gsap, el }) => {
    const frame = el.querySelector("[data-frame]");
    const img = el.querySelector("[data-img]");
    const copy = el.querySelectorAll("[data-out]");
    const mm = gsap.matchMedia();
    const build = (inset: string) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.35 } });
      tl.fromTo(frame, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: inset, ease: "none", duration: 1 }, 0)
        .fromTo(img, { scale: 1 }, { scale: 1.14, ease: "none", duration: 1 }, 0)
        .to(copy, { y: -80, opacity: 0, ease: "power1.in", duration: 0.4, stagger: 0.03 }, 0);
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
      x: gsap.quickTo(n, "x", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(n, "y", { duration: 0.9, ease: "power3.out" }),
    }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d); });
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  const current = scenes[active];

  return (
    <section ref={ref} className="sh relative bg-ink text-white" aria-labelledby="home-hero-title">
      <div className="sticky top-0 h-[100svh] min-h-[40rem] overflow-hidden">
        {/* Picture */}
        <div data-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div data-depth="-22" className="absolute -inset-6">
            <div data-img className="sh-img absolute inset-0">
              <picture>
                <source media="(max-width: 767px)" srcSet={hero.image.portrait} width={hero.image.pw} height={hero.image.ph} />
                <img src={hero.image.landscape} alt="" width={hero.image.w} height={hero.image.h} fetchPriority="high" decoding="async" className="h-full w-full object-cover object-center [filter:grayscale(1)_brightness(1.08)_contrast(1.1)]" />
              </picture>
            </div>
          </div>
          {/* Readability: headline zone left, brand word along the foot; a Royal glow behind the work */}
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(48%_55%_at_76%_46%,rgb(20_46_140/0.55)_0%,transparent_70%),linear-gradient(100deg,rgb(var(--ink-rgb)/0.86)_0%,rgb(var(--ink-rgb)/0.55)_38%,rgb(var(--ink-rgb)/0.25)_62%,rgb(var(--ink-rgb)/0.45)_100%),linear-gradient(180deg,rgb(var(--ink-rgb)/0.6)_0%,transparent_22%,transparent_62%,rgb(var(--ink-rgb)/0.88)_100%)] max-md:bg-[radial-gradient(70%_32%_at_50%_26%,rgb(20_46_140/0.5)_0%,transparent_75%),linear-gradient(180deg,rgb(var(--ink-rgb)/0.55)_0%,rgb(var(--ink-rgb)/0.2)_16%,rgb(var(--ink-rgb)/0.35)_40%,rgb(var(--ink-rgb)/0.86)_56%,rgb(var(--ink-rgb)/0.94)_100%)]" />
        </div>

        {/* Crosshair marks */}
        <div aria-hidden="true" data-out className="pointer-events-none absolute inset-0 max-md:hidden">
          {["3.5%", "34.5%", "65.5%", "96.5%"].flatMap((l) => ["10%", "36.7%", "63.3%"].map((t) => [l, t])).map(([l, t]) => (
            <span key={l + t} className="sh-op absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white/40" style={{ left: l, top: t }}>
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </span>
          ))}
        </div>

        <div className="container-x relative mx-auto flex h-full max-w-[120rem] flex-col pb-[clamp(1rem,3vh,2rem)] pt-[calc(var(--header-h)+0.5rem)] md:pt-[calc(var(--header-h)+clamp(0.75rem,5vh,4rem))]">
          <div className="relative flex-1 md:grid md:grid-cols-12 md:gap-x-8">
            {/* Work showcase (right on desktop, top on phones) */}
            <div data-out className="relative h-[clamp(10.5rem,27svh,15rem)] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[41%]">
              <div data-depth="16" className="absolute inset-0">
                {scenes.map((s, i) => (
                  <Scene key={s.label} scene={s} first={i === 0} intro={i === 0 && prev === null} load={i <= active + 1} state={i === active ? "on" : i === prev ? "prev" : "off"} />
                ))}
              </div>
            </div>

            {/* Type */}
            <div data-out className="relative z-10 mt-4 md:col-span-7 md:mt-0">
              <h1 id="home-hero-title" data-depth="7" className="text-[clamp(2.6rem,11.4vw,4rem)] font-bold leading-[0.98] tracking-[-0.045em] md:text-[clamp(3.5rem,5.5vw,7.25rem)] md:leading-[0.95]">
                {hero.statement.map((l, i) => (
                  <span key={l} className="block overflow-hidden pb-[0.08em]">
                    <span className="sh-line block" style={{ animationDelay: `${360 + i * 80}ms` }}>
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

              <div className="sh-fade sh-support mt-4 flex max-w-[36rem] items-start gap-4 md:mt-[clamp(1.5rem,4vh,2.75rem)]" style={{ animationDelay: "560ms" }}>
                <span aria-hidden="true" className="mt-[0.3em] h-5 w-5 shrink-0 rounded-full border-[5px] border-blue md:h-6 md:w-6" />
                <p className="text-[clamp(1.0625rem,4.2vw,1.125rem)] leading-[1.45] text-white md:text-[clamp(1.1875rem,1.3vw,1.5rem)] md:leading-[1.42]">{hero.support}</p>
              </div>

              <div className="sh-fade mt-5 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-[clamp(1.5rem,3.6vh,2.5rem)]" style={{ animationDelay: "640ms" }}>
                <Magnetic>
                  <Link
                    href="/contact-us/"
                    className="group inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-[1rem] font-semibold tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-blue hover:text-white md:text-[1.0625rem]"
                  >
                    Start a project
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blue text-white transition-[transform,background-color] duration-300 ease-out-expo group-hover:rotate-45 group-hover:bg-white group-hover:text-blue md:h-11 md:w-11">
                      <Arrow className="h-4 w-4" />
                    </span>
                  </Link>
                </Magnetic>
                <a href="#websites" className="link-u text-[1rem] font-medium text-white hover:text-white md:text-[1.0625rem]">
                  See our work
                </a>
              </div>
            </div>
          </div>

          {/* Foot: brand word + showcase caption and controls */}
          <div data-out className="mt-4 md:mt-[clamp(1rem,3vh,2rem)] md:grid md:grid-cols-12 md:items-end md:gap-x-8">
            <div className="mb-4 md:order-2 md:col-span-5 md:col-start-8 md:mb-[0.5vw]">
              <p className="sh-fade mb-2 hidden text-[0.875rem] font-semibold uppercase tracking-[0.2em] text-white/70 md:block md:text-right" style={{ animationDelay: "650ms" }}>
                {hero.tagline.join(" ")}
              </p>
              <p aria-live="polite" className="sh-fade min-h-[1.2em] overflow-hidden text-[clamp(1.375rem,5.6vw,1.75rem)] font-light leading-[1.1] tracking-[-0.03em] md:text-right md:text-[clamp(1.5rem,2vw,2.5rem)]" style={{ animationDelay: "700ms" }}>
                <span key={current.line} className="sh-swap block">{current.line}</span>
              </p>
              <p className="sh-fade mt-1.5 truncate text-[0.9375rem] text-white/75 md:text-right" style={{ animationDelay: "700ms" }}>{current.label}</p>
              <div className="sh-fade mt-3 flex items-center gap-3 md:justify-end" style={{ animationDelay: "700ms" }}>
                <ol className="flex flex-1 gap-1.5 md:max-w-[22rem]" role="list" aria-label="Choose work to show">
                  {scenes.map((s, i) => (
                    <li key={s.label} className="flex-1">
                      <button type="button" onClick={() => show(i)} aria-label={`Show ${s.label}`} aria-current={i === active} className="group block w-full py-1.5 md:py-2">
                        <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/45">
                          {i === active ? (
                            <span key={`${active}-${paused}-${inView}`} className={`absolute inset-0 origin-left bg-sky ${paused || !inView ? "" : "sh-bar"}`} style={{ animationDuration: `${SCENE_MS}ms` }} />
                          ) : i < active ? (
                            <span className="absolute inset-0 bg-white/70" />
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
                <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? "Play work showcase" : "Pause work showcase"} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/35 text-white transition-colors hover:border-blue hover:bg-blue">
                  {paused ? (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 translate-x-[1px] fill-current"><path d="M4 2.5v11l9.5-5.5z" /></svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div data-depth="4" className="relative [container-type:inline-size] md:order-1 md:col-span-7">
              <p aria-hidden="true" className="sh-word flex select-none font-bold leading-[0.8] tracking-[-0.04em] text-[color:var(--color-blue)]" style={{ fontSize: `calc(100cqw / ${WORD_EM})` }}>
                {word.map((c, i) => (
                  <span key={i} className="inline-block overflow-hidden pt-[0.06em]">
                    <span className="sh-ch inline-block" style={{ animationDelay: `${220 + i * 28}ms` }}>{c}</span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Staircase intro mask */}
        <div aria-hidden="true" className="sh-cols pointer-events-none absolute inset-0 z-30 grid max-md:hidden" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {Array.from({ length: COLS }, (_, i) => (
            <span key={i} className="block h-full bg-ink" style={{ animationDelay: `${i * 32}ms` }} />
          ))}
        </div>
        <div aria-hidden="true" className="sh-rows pointer-events-none absolute inset-0 z-30 grid md:hidden" style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {Array.from({ length: ROWS }, (_, i) => (
            <span key={i} className="-mb-px block w-full bg-ink" style={{ animationDelay: `${i * 28}ms` }} />
          ))}
        </div>
      </div>

      <style>{`
        .sh { height: 150svh; }
        @media (max-width: 767px) and (max-height: 760px) { .sh-support { display: none !important; } }
        @media (max-width: 767px) { .sh { height: 130svh; } }
        .sh-cols > span { transform-origin: 50% 0%; animation: sh-col 0.6s cubic-bezier(0.76,0,0.24,1) forwards; }
        @keyframes sh-col { to { transform: scaleY(0); } }
        .sh-rows > span { transform-origin: 100% 50%; animation: sh-row 0.55s cubic-bezier(0.76,0,0.24,1) forwards; }
        @keyframes sh-row { to { transform: scaleX(0); } }
        .sh-img { animation: sh-zoom 1.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes sh-zoom { from { transform: scale(1.12); } to { transform: none; } }
        .js .sh-ch { transform: translateY(105%); animation: sh-up 0.85s cubic-bezier(0.16,1,0.3,1) forwards; }
        .js .sh-line { transform: translateY(108%); animation: sh-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes sh-up { to { transform: none; } }
        .js .sh-fade { opacity: 0; animation: sh-fade 0.7s cubic-bezier(0.16,1,0.3,1) 600ms forwards; }
        @keyframes sh-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .js .sh-op { opacity: 0; animation: sh-op 0.8s ease 650ms forwards; }
        @keyframes sh-op { to { opacity: 1; } }
        .sc { contain: layout paint; }
        .sh-swap { animation: sh-swap 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes sh-swap { from { transform: translateY(105%); } to { transform: none; } }
        .sh-bar { animation-name: sh-bar; animation-timing-function: linear; animation-fill-mode: both; }
        @keyframes sh-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        /* Showcase: each piece opens from the bottom edge and closes upward (the staircase motion, in one frame) */
        .sc { visibility: hidden; }
        .sc[data-state="on"], .sc[data-state="prev"] { visibility: visible; }
        .sc-i { clip-path: inset(100% 0 0 0 round 14px); transform: translateY(24px) scale(0.97); transition: clip-path 0.65s cubic-bezier(0.76,0,0.24,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); transition-delay: calc(var(--k) * 70ms); }
        .sc[data-state="on"] .sc-i { clip-path: inset(0 0 0 0 round 14px); transform: none; }
        .sc[data-state="prev"] .sc-i { clip-path: inset(0 0 100% 0 round 14px); transform: translateY(-16px); transition-duration: 0.5s, 0.6s; transition-delay: calc(var(--k) * 40ms); }
        .js .sc-intro .sc-i { animation: sc-in 0.6s cubic-bezier(0.16,1,0.3,1) both; animation-delay: calc(${FIRST_SCENE_MS}ms + var(--k) * 70ms); }
        @keyframes sc-in { from { transform: translateY(36px) scale(0.94); } to { transform: none; } } /* transform only: the staircase mask hides it until then, and the LCP paint is not deferred */
        .sc-i img { transform: scale(1.08); transition: transform 1.6s cubic-bezier(0.16,1,0.3,1); }
        .sc[data-state="on"] .sc-i img { transform: none; }

        @media (prefers-reduced-motion: reduce) {
          .sh { height: auto; }
          .sh-cols, .sh-rows { display: none; }
          .sh-img, .sc { contain: layout paint; }
        .sh-swap { animation: none; }
          .sc-i, .sc-i img { transition: none !important; animation: none !important; }
          .js .sh-ch, .js .sh-line, .js .sh-fade, .js .sh-op { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

/** One piece of work in the hero showcase. Layouts keep each image at its own aspect ratio. */
/** `load`: only the current and next pieces fetch their images, so the hero stays light. */
function Scene({ scene, state, load, first, intro }: { scene: HeroScene; state: "on" | "prev" | "off"; load: boolean; first: boolean; intro: boolean }) {
  const shadow = "shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10";
  const img = (it: HeroScene["items"][number], cls = "") => (
    // eslint-disable-next-line @next/next/no-img-element
    load ? <img src={it.src} alt={state === "on" ? it.alt : ""} width={it.w} height={it.h} decoding="async" fetchPriority={first ? "high" : "low"} className={`block h-full w-full object-cover ${cls}`} /> : null
  );

  return (
    <div className={`sc absolute inset-0 flex items-center justify-center ${intro ? "sc-intro" : ""}`} data-state={state} aria-hidden={state !== "on"}>
      {scene.kind === "browser" ? (
        <div className={`sc-i w-[min(100%,58svh*1.6)] overflow-hidden rounded-[14px] bg-white ${shadow}`} style={{ ["--k" as string]: 0 }}>
          <div className="flex h-7 items-center gap-1.5 bg-mist px-3 md:h-8">
            {[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 rounded-full bg-blue-deep/25" />)}
          </div>
          <div className="aspect-[16/10]">{img(scene.items[0], "object-top")}</div>
        </div>
      ) : scene.kind === "card" ? (
        <div className={`sc-i aspect-[924/522] w-[min(85%,52svh*1.77)] overflow-hidden rounded-[14px] bg-white ${shadow}`} style={{ ["--k" as string]: 0 }}>
          {img(scene.items[0])}
        </div>
      ) : scene.kind === "stack" ? (
        <div className="relative aspect-[16/11] w-[min(100%,58svh*1.45)]">
          <div className={`sc-i absolute left-0 top-0 w-[72%] overflow-hidden rounded-[14px] bg-white ${shadow}`} style={{ ["--k" as string]: 0, aspectRatio: `${scene.items[0].w} / ${scene.items[0].h}` }}>
            {img(scene.items[0])}
          </div>
          <div className={`sc-i absolute bottom-0 right-0 w-[76%] overflow-hidden rounded-[14px] bg-white ${shadow}`} style={{ ["--k" as string]: 1, aspectRatio: `${scene.items[1].w} / ${scene.items[1].h}` }}>
            {img(scene.items[1])}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center gap-[3%]">
          {scene.items.map((it, k) => (
            <div
              key={it.src}
              className={`sc-i max-h-full shrink-0 overflow-hidden rounded-[14px] bg-ink-soft ${shadow}`}
              style={{ ["--k" as string]: k, aspectRatio: `${it.w} / ${it.h}`, width: k === 1 ? "33%" : "29.5%" }}
            >
              {img(it)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
