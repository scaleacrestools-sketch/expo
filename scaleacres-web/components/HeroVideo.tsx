"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { homepageSeo, homepageCreative } from "@/content/seo/homepage";
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

const STATEMENT_MS = 4600;

/**
 * Cinematic hero. Full-viewport showreel (the six commissioned clips, crossfading; portrait
 * cuts on phones) with timed creative statements. The protected SEO H1 stays visible and
 * crawlable in the lower-left; the statements are supplementary display text.
 */
export function HeroVideo() {
  const layerA = useRef<HTMLVideoElement>(null);
  const layerB = useRef<HTMLVideoElement>(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, getFalse);
  const reduceMotion = useSyncExternalStore(subscribeReduce, getReduce, getFalse);
  const [started, setStarted] = useState(false);
  const [front, setFront] = useState(0);
  const [clipIndex, setClipIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [statement, setStatement] = useState(0);
  const playing = !userPaused && !reduceMotion;
  const layer = (i: number) => (i === 0 ? layerA : layerB).current;

  // Video sources attach after the load event so text, fonts and CSS win the LCP race.
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

  // Statement timeline (paused together with the showreel).
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setStatement((s) => (s + 1) % homepageCreative.statements.length), STATEMENT_MS);
    return () => window.clearInterval(t);
  }, [playing]);

  const advance = () => {
    const next = layer(1 - front);
    if (playing) next?.play().catch(() => undefined);
    setFront(1 - front);
    setClipIndex((i) => (i + 1) % showreel.length);
  };

  const lines = homepageCreative.statements[statement];

  return (
    <section className="relative isolate h-[100svh] min-h-[38rem] overflow-hidden bg-ink text-white" aria-labelledby="hero-title">
      {/* Showreel */}
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
        {/* Light vignette only: the footage is the star */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.7),transparent)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(0deg,rgb(var(--ink-rgb)/0.85),rgb(var(--ink-rgb)/0.35)_55%,transparent)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/10" />
      </div>

      {/* Vertical descriptor: seamless linear loop (four identical copies, track moves one copy per cycle). */}
      <div aria-hidden="true" className="vmarquee absolute left-[clamp(0.75rem,1.6vw,1.75rem)] top-1/2 hidden h-[62vh] -translate-y-1/2 md:block">
        <div className="vmarquee__track text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-white/55">
          {[0, 1, 2, 3].map((k) => (
            <span key={k}>{homepageCreative.verticalDescriptor.join(" — ")} —</span>
          ))}
        </div>
      </div>

      {/* Timed creative statements */}
      <div className="absolute inset-x-0 bottom-[clamp(17rem,38vh,21rem)] px-5 text-center md:bottom-[clamp(9rem,22vh,14rem)]">
        <p key={statement} className="mx-auto max-w-[18ch] text-[clamp(2.125rem,1rem+4.4vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]" aria-live="off">
          {lines.map((line, li) => (
            <span key={li} className={`block ${li === 1 ? "text-blue" : ""}`}>
              {line.split(" ").map((w, wi) => (
                <span
                  key={wi}
                  className="hero-word inline-block"
                  style={{ animationDelay: `${(li * 3 + wi) * 90}ms`, animationDuration: `${STATEMENT_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                >
                  {w}&nbsp;
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      {/* Bottom bar: protected H1 + controls (left), primary CTA (right) */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="container-x mx-auto flex max-w-[120rem] flex-col gap-6 pb-[clamp(1.5rem,4vh,2.75rem)] md:flex-row md:items-end md:justify-between">
          <div className="max-w-[34rem]">
            <h1 id="hero-title" className="text-[clamp(1rem,0.9rem+0.45vw,1.3rem)] font-semibold leading-snug tracking-[-0.005em] text-white">
              {homepageSeo.h1.value}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/65">
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
              <span className="hidden sm:inline">{showreel[clipIndex].title}</span>
              {failed ? <span className="text-white/45">· showreel unavailable</span> : null}
              <a href="#about" className="ml-2 hidden items-center gap-2 hover:text-white lg:inline-flex">Scroll <span aria-hidden="true">↓</span></a>
            </div>
          </div>

          <Link
            href="/contact-us/"
            className="group inline-flex w-full items-center justify-between gap-6 rounded-[4px] bg-blue px-8 py-5 text-[0.875rem] font-bold uppercase tracking-[0.16em] text-on-accent shadow-[0_0_0_rgb(var(--accent-rgb)/0)] transition-[transform,box-shadow,background-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-[0_18px_50px_-12px_rgb(var(--accent-rgb)/0.55)] md:w-auto md:px-10 md:py-6"
          >
            Let&apos;s Talk
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <style>{`
        .js .hero-word { opacity: 0; transform: translateY(0.45em); filter: blur(8px); animation-name: hero-word; animation-timing-function: cubic-bezier(0.16,1,0.3,1); animation-fill-mode: both; }
        @keyframes hero-word {
          0% { opacity: 0; transform: translateY(0.45em); filter: blur(8px); }
          14% { opacity: 1; transform: none; filter: blur(0); }
          84% { opacity: 1; transform: none; filter: blur(0); }
          100% { opacity: 0; transform: translateY(-0.25em); filter: blur(6px); }
        }
        @media (prefers-reduced-motion: reduce) { .js .hero-word { animation: none !important; opacity: 1; transform: none; filter: none; } }
      `}</style>
    </section>
  );
}
