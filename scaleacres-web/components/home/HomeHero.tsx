"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { hero, posters } from "@/content/home";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/home/fx";

const MOBILE_MQ = "(max-width: 767px)";
const REDUCE_MQ = "(prefers-reduced-motion: reduce)";
const sub = (q: string) => (cb: () => void) => {
  const mq = window.matchMedia(q);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const subMobile = sub(MOBILE_MQ);
const subReduce = sub(REDUCE_MQ);
const getMobile = () => window.matchMedia(MOBILE_MQ).matches;
const getReduce = () => window.matchMedia(REDUCE_MQ).matches;
const no = () => false;

const STEPS = 8;

/**
 * Homepage hero. On load a stepped staircase mask lifts off the showreel (columns retract
 * left → right), the film settles from a slight zoom, and the headline words rise out of
 * their masks. The showreel crossfades through ScaleAcres' concept clips; no form here.
 */
export function HomeHero() {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const isMobile = useSyncExternalStore(subMobile, getMobile, no);
  const reduce = useSyncExternalStore(subReduce, getReduce, no);
  const [started, setStarted] = useState(false);
  const [front, setFront] = useState(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !paused && !reduce;
  const layer = (i: number) => (i === 0 ? a : b).current;
  const reel = hero.reel;
  const srcFor = (i: number) => (isMobile ? reel[i % reel.length].portrait : reel[i % reel.length].landscape);

  // Film sources attach after the load event so the headline wins the LCP race.
  useEffect(() => {
    const go = () => window.setTimeout(() => setStarted(true), 150);
    if (document.readyState === "complete") {
      const t = go();
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  useEffect(() => {
    if (!started) return;
    const cur = layer(front);
    const next = layer(1 - front);
    if (!cur || !next) return;
    if (cur.getAttribute("src") !== srcFor(index)) cur.setAttribute("src", srcFor(index));
    next.setAttribute("src", srcFor(index + 1));
    next.load();
    if (playing) cur.play().catch(() => undefined);
    else cur.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, index, front, isMobile, playing]);

  const advance = () => {
    const next = layer(1 - front);
    if (playing) next?.play().catch(() => undefined);
    setFront(1 - front);
    setIndex((i) => (i + 1) % reel.length);
  };

  let w = 0;
  const word = (t: string) => {
    const delay = 520 + w++ * 70;
    return (
      <span key={`${t}-${w}`} className="hh-w inline-block overflow-hidden pb-[0.07em] align-bottom">
        <span className={`inline-block ${t === hero.accentWord ? "text-sky" : ""}`} style={{ animationDelay: `${delay}ms` }}>
          {t}
        </span>
      </span>
    );
  };

  return (
    <section className="relative isolate h-[100svh] min-h-[40rem] overflow-hidden bg-ink text-white" aria-labelledby="home-hero-title">
      {/* Film */}
      <div className="hh-media absolute inset-0 -z-10">
        {[0, 1].map((i) => (
          <video
            key={i}
            ref={i === 0 ? a : b}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            poster={i === 0 ? (isMobile ? posters.architecturePortrait : posters.architecture) : undefined}
            onEnded={i === front ? advance : undefined}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${i === front ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.55)_0%,rgb(var(--ink-rgb)/0.05)_32%,rgb(var(--ink-rgb)/0.2)_55%,rgb(var(--ink-rgb)/0.88)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgb(var(--ink-rgb)/0.55),transparent_60%)]" />
      </div>

      {/* Crosshair grid marks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        {[
          ["25%", "34%"], ["50%", "34%"], ["75%", "34%"],
          ["25%", "62%"], ["50%", "62%"], ["75%", "62%"],
        ].map(([l, t]) => (
          <span key={l + t} className="hh-fade absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white/45" style={{ left: l, top: t, animationDelay: "1300ms" }}>
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          </span>
        ))}
      </div>

      <div className="container-x relative mx-auto flex h-full max-w-[120rem] flex-col pb-[clamp(1.25rem,3.5vh,2.5rem)] pt-[calc(var(--header-h)+clamp(1.75rem,6vh,4.5rem))]">
        {/* Upper row: positioning + supporting copy */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <p className="hh-fade flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-white/80" style={{ animationDelay: "1100ms" }}>
            <span aria-hidden="true" className="relative -top-[0.35em] text-[0.9rem] leading-none text-sky">°</span>
            Real estate marketing · Creative growth
          </p>
          <p className="hh-fade max-w-[30ch] text-[clamp(1.0625rem,0.95rem+0.55vw,1.5rem)] font-medium leading-[1.35] text-white/90 md:text-right" style={{ animationDelay: "1250ms" }}>
            {hero.support}
          </p>
        </div>

        {/* Headline */}
        <h1 id="home-hero-title" className="mt-auto text-[clamp(3.6rem,15.5vw,7rem)] font-semibold uppercase leading-[0.86] tracking-[-0.055em] md:text-[clamp(4.5rem,9.4vw,13rem)] md:normal-case md:tracking-[-0.06em]">
          <span className="block">
            <span className="block md:inline">{hero.lines[0].map(word)}</span>
            <span className="hidden md:inline"> </span>
            <span className="block md:inline">{hero.lines[1].map(word)}</span>
          </span>
          <span className="block md:pl-[16vw]">
            <span className="block md:inline">{hero.lines[2].map(word)}</span>
            <span className="hidden md:inline"> </span>
            <span className="block md:inline">
              {hero.lines[3].map(word)}
              <span aria-hidden="true" className="hh-fade ml-[0.08em] inline-block h-[0.14em] w-[0.14em] translate-y-[-0.08em] rounded-full bg-blue align-baseline" style={{ animationDelay: "1250ms" }} />
            </span>
          </span>
        </h1>

        {/* Bottom bar */}
        <div className="hh-fade mt-[clamp(1.5rem,4.5vh,3rem)] grid items-center gap-5 border-t border-white/20 pt-5 md:grid-cols-[1fr_auto_1fr]" style={{ animationDelay: "1400ms" }}>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <Magnetic>
              <Link
                href="/contact-us/"
                className="group inline-flex items-center gap-4 rounded-full bg-blue py-2 pl-6 pr-2 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-on-accent transition-colors duration-300 hover:bg-white hover:text-ink"
              >
                Start a project
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-blue group-hover:text-white">
                  <Arrow className="h-4 w-4" />
                </span>
              </Link>
            </Magnetic>
            <a href="#websites" className="link-u text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white/85 hover:text-white">
              View our work
            </a>
          </div>

          <div className="hidden items-center gap-4 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/65 md:flex">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={!playing}
              aria-label={playing ? "Pause showreel" : "Play showreel"}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/35 text-white transition-colors hover:border-sky hover:text-sky"
            >
              {playing ? (
                <svg aria-hidden="true" viewBox="0 0 8 8" className="h-2.5 w-2.5 fill-current"><rect width="3" height="8" /><rect x="5" width="3" height="8" /></svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 8 8" className="ml-0.5 h-2.5 w-2.5 fill-current"><path d="M0 0l8 4-8 4z" /></svg>
              )}
            </button>
            <span className="tabular-nums text-white">{String(index + 1).padStart(2, "0")}</span>
            <span className="h-px w-10 bg-white/30" />
            <span>{reel[index].title}</span>
            <span className="text-white/40">· Studio reel</span>
          </div>

          <a href="#manifesto" className="group hidden items-center justify-self-end gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white md:flex">
            Scroll to explore
            <span aria-hidden="true" className="relative block h-10 w-6 rounded-full border border-white/40">
              <span className="hh-dot absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky" />
            </span>
          </a>
        </div>
      </div>

      {/* Staircase intro mask */}
      <div aria-hidden="true" className="hh-steps pointer-events-none absolute inset-0 z-30 grid" style={{ gridTemplateColumns: `repeat(${STEPS}, 1fr)` }}>
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className="block h-full bg-ink" style={{ animationDelay: `${120 + i * 65}ms` }} />
        ))}
      </div>

      <style>{`
        .hh-steps > span { transform-origin: 50% 0%; animation: hh-step 0.95s cubic-bezier(0.76,0,0.24,1) forwards; }
        @keyframes hh-step { to { transform: scaleY(0); } }
        .hh-media { animation: hh-zoom 2.4s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes hh-zoom { from { transform: scale(1.18); } to { transform: none; } }
        .js .hh-w > span { transform: translateY(112%); animation: hh-rise 1.25s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes hh-rise { to { transform: none; } }
        .js .hh-fade { opacity: 0; animation: hh-fade 1s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes hh-fade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .hh-dot { animation: hh-dot 2s cubic-bezier(0.65,0,0.35,1) infinite; }
        @keyframes hh-dot { 0% { transform: translate(-50%, 0); opacity: 1; } 70% { transform: translate(-50%, 16px); opacity: 0; } 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .hh-steps { display: none; }
          .hh-media, .hh-dot { animation: none; }
          .js .hh-w > span, .js .hh-fade { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
