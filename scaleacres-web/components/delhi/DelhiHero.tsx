"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { showreel, posterForSrc } from "@/content/media";
import { Arrow } from "@/components/ui/Arrow";

const MOBILE_MQ = "(max-width: 767px)";
const REDUCE_MQ = "(prefers-reduced-motion: reduce)";
const subscribeMq = (q: string) => (cb: () => void) => {
  const mq = window.matchMedia(q);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const subscribeMobile = subscribeMq(MOBILE_MQ);
const subscribeReduce = subscribeMq(REDUCE_MQ);
const getMobile = () => window.matchMedia(MOBILE_MQ).matches;
const getReduce = () => window.matchMedia(REDUCE_MQ).matches;
const getFalse = () => false;

export type DelhiHeroProps = {
  h1: string;
  sub: { level: number; text: string };
  cta: { href: string; text: string } | null;
  trust?: { src: string; alt: string; width?: number | null; height?: number | null };
  crumbs: { name: string; url?: string }[];
  ticker: string[];
};

/**
 * Delhi hero, built on the homepage's cinematic showreel (same clips, crossfade, portrait cuts on
 * phones, pause control, sources attached after load). The page's own H1 is the display headline;
 * its words rise in on load and the city name carries the Royal Blue highlight. No form here.
 */
export function DelhiHero({ h1, sub, cta, trust, crumbs, ticker }: DelhiHeroProps) {
  const layerA = useRef<HTMLVideoElement>(null);
  const layerB = useRef<HTMLVideoElement>(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, getFalse);
  const reduceMotion = useSyncExternalStore(subscribeReduce, getReduce, getFalse);
  const [started, setStarted] = useState(false);
  const [front, setFront] = useState(0);
  const [clipIndex, setClipIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const playing = !userPaused && !reduceMotion;
  const layer = (i: number) => (i === 0 ? layerA : layerB).current;

  useEffect(() => {
    const start = () => window.setTimeout(() => setStarted(true), 120);
    if (document.readyState === "complete") {
      const t = start();
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  const srcFor = (i: number) => {
    const c = showreel[i % showreel.length];
    return isMobile ? c.portrait : c.landscape;
  };

  useEffect(() => {
    if (!started) return;
    const cur = layer(front);
    const next = layer(1 - front);
    if (!cur || !next) return;
    if (cur.getAttribute("src") !== srcFor(clipIndex)) cur.setAttribute("src", srcFor(clipIndex));
    next.setAttribute("src", srcFor(clipIndex + 1));
    next.load();
    if (playing) cur.play().catch(() => undefined);
    else cur.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, clipIndex, front, isMobile, playing]);

  const advance = () => {
    const next = layer(1 - front);
    if (playing) next?.play().catch(() => undefined);
    setFront(1 - front);
    setClipIndex((i) => (i + 1) % showreel.length);
  };

  // The H1's own words; the city (last word) takes the brand highlight. Text is unchanged.
  const words = h1.split(" ");
  const SubTag = `h${sub.level}` as "h2";

  return (
    <section className="relative isolate h-[100svh] min-h-[40rem] overflow-hidden bg-ink text-white" aria-labelledby="delhi-hero-title">
      <div className="absolute inset-0 -z-10">
        {[0, 1].map((i) => (
          <video
            key={i}
            ref={i === 0 ? layerA : layerB}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            poster={i === 0 ? posterForSrc(isMobile ? showreel[0].portrait : showreel[0].landscape) : undefined}
            onEnded={i === front ? advance : undefined}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${i === front ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* Cinematic grade: deeper than the homepage so the long SEO headline stays legible */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--ink-rgb)/0.82),rgb(var(--ink-rgb)/0.45)_55%,rgb(var(--ink-rgb)/0.2))]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.75),transparent)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(0deg,rgb(var(--ink-rgb)/0.9),transparent)]" />
      </div>

      {/* Vertical services ticker (decorative; the services are described in full further down) */}
      <div aria-hidden="true" className="vmarquee absolute right-[clamp(0.75rem,1.6vw,1.75rem)] top-1/2 hidden h-[62vh] -translate-y-1/2 md:block">
        <div className="vmarquee__track text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-white/55" style={{ ["--vmarquee-duration" as string]: "9s" }}>
          {[0, 1, 2, 3].map((k) => (
            <span key={k}>{ticker.join(" — ")} —</span>
          ))}
        </div>
      </div>

      <div className="container-x mx-auto flex h-full max-w-[120rem] flex-col justify-end pb-[clamp(2rem,6vh,4.5rem)] pt-[calc(var(--header-h)+2rem)]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="eyebrow text-sky">Real estate marketing · Delhi NCR</p>
          {crumbs.length > 1 ? (
            <nav aria-label="Breadcrumb" className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/55">
              {crumbs.map((c, i) => (
                <span key={i}>
                  {i > 0 ? " / " : ""}
                  {c.url && i < crumbs.length - 1 ? <a href={c.url} className="hover:text-sky">{c.name}</a> : <span aria-current="page" className="text-white/85">{c.name}</span>}
                </span>
              ))}
            </nav>
          ) : null}
        </div>

        <h1 id="delhi-hero-title" className="mt-7 max-w-[13ch] text-[clamp(2.9rem,1rem+6.2vw,8.25rem)] font-black uppercase leading-[0.88] tracking-[-0.045em]">
          {words.map((w, i) => (
            <span key={i} className="hero-rise inline-block overflow-hidden pb-[0.06em] align-bottom">
              <span className={`inline-block ${i === words.length - 1 ? "text-blue" : ""}`} style={{ animationDelay: `${180 + i * 85}ms` }}>
                {w}
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end">
          <SubTag className="hero-fade max-w-[34ch] text-[clamp(1.125rem,0.95rem+0.8vw,1.75rem)] font-medium leading-[1.3] text-white/85 lg:col-span-6" style={{ animationDelay: "900ms" }}>
            {sub.text}
          </SubTag>
          <div className="hero-fade flex flex-wrap items-center gap-5 lg:col-span-6 lg:justify-end" style={{ animationDelay: "1050ms" }}>
            {trust ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={trust.src} alt={trust.alt} width={trust.width ?? undefined} height={trust.height ?? undefined} className="h-11 w-auto" />
            ) : null}
            {cta ? (
              <a
                href={cta.href}
                className="group inline-flex items-center justify-between gap-6 rounded-[4px] bg-blue px-8 py-5 text-[0.875rem] font-bold uppercase tracking-[0.16em] text-on-accent transition-[transform,box-shadow,background-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-[0_18px_50px_-12px_rgb(var(--accent-rgb)/0.55)] md:px-10 md:py-6"
              >
                {cta.text}
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-6 border-t border-white/15 pt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/60">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={!playing}
              aria-label={playing ? "Pause showreel" : "Play showreel"}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/35 text-white transition-colors hover:border-blue hover:text-blue"
            >
              {playing ? (
                <svg aria-hidden="true" viewBox="0 0 8 8" className="h-2.5 w-2.5 fill-current"><rect width="3" height="8" /><rect x="5" width="3" height="8" /></svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 8 8" className="ml-0.5 h-2.5 w-2.5 fill-current"><path d="M0 0l8 4-8 4z" /></svg>
              )}
            </button>
            <span className="tabular-nums">{String(clipIndex + 1).padStart(2, "0")} / {String(showreel.length).padStart(2, "0")}</span>
            {failed ? <span className="text-white/45">· showreel unavailable</span> : null}
          </div>
          <a href="#delhi-intro" className="group flex items-center gap-3 hover:text-white">
            Scroll
            <span aria-hidden="true" className="relative block h-9 w-px overflow-hidden bg-white/25">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-sky" />
            </span>
          </a>
        </div>
      </div>

      <style>{`
        .js .hero-rise > span { transform: translateY(105%); animation: hero-rise 1.1s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes hero-rise { to { transform: none; } }
        .js .hero-fade { opacity: 0; transform: translateY(16px); animation: hero-fade 1s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes hero-fade { to { opacity: 1; transform: none; } }
        .scroll-cue { animation: scroll-cue 2.2s cubic-bezier(0.65,0,0.35,1) infinite; }
        @keyframes scroll-cue { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        @media (prefers-reduced-motion: reduce) {
          .js .hero-rise > span, .js .hero-fade { animation: none !important; opacity: 1; transform: none; }
          .scroll-cue { animation: none; }
        }
      `}</style>
    </section>
  );
}
