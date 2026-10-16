"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { homepageSeo, homepageCreative } from "@/content/seo/homepage";
import { showreel } from "@/content/media";
import { splitWords, useGsap } from "@/lib/motion";

/**
 * Cinematic hero: plays the six commissioned showreel clips back to back with crossfades
 * (two stacked <video> layers), landscape on desktop and portrait on phones.
 * Sources attach only after the page has loaded so the headline is always the LCP.
 */
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

export function HeroVideo() {
  const root = useRef<HTMLElement>(null);
  const layerA = useRef<HTMLVideoElement>(null);
  const layerB = useRef<HTMLVideoElement>(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, getFalse);
  const reduceMotion = useSyncExternalStore(subscribeReduce, getReduce, getFalse);
  const [started, setStarted] = useState(false);
  const [front, setFront] = useState(0);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const playing = !userPaused && !reduceMotion;

  const layer = (i: number) => (i === 0 ? layerA : layerB).current;

  // Attach sources only after the load event so the headline stays the LCP.
  useEffect(() => {
    const start = () => window.setTimeout(() => setStarted(true), 150);
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

  // Current clip on the front layer, next clip pre-loading on the back layer.
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
    setIndex((i) => (i + 1) % showreel.length);
  };

  useGsap(root, ({ gsap, el }) => {
    const words = splitWords(el.querySelector<HTMLElement>("[data-hero-statement]")!);
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .fromTo(el.querySelector("[data-hero-stage]"), { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.4, ease: "power2.out" }, 0)
      .fromTo(el.querySelectorAll("[data-hero-line]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, 0.4)
      .to(words, { y: 0, duration: 1.3, stagger: 0.08 }, 0.6)
      .fromTo(el.querySelectorAll("[data-hero-fade]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 1.3);
    gsap.to(el.querySelector("[data-hero-stage]"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  });

  const clipNow = showreel[index];

  return (
    <section ref={root} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white" aria-labelledby="hero-title">
      <div data-hero-stage className="absolute inset-0 -z-10 will-change-transform">
        {[0, 1].map((i) => (
          <video
            key={i}
            ref={i === 0 ? layerA : layerB}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onEnded={i === front ? advance : undefined}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${i === front ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* Readability: soft vignette, heavier at the bottom where the copy sits. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,13,0.55)_0%,rgba(11,13,13,0.08)_35%,rgba(11,13,13,0.25)_60%,rgba(11,13,13,0.9)_100%)]" />
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-2/3 bg-[linear-gradient(90deg,rgba(11,13,13,0.55),transparent)]" />
        {failed ? (
          <span className="absolute right-4 top-[calc(var(--header-h)+1rem)] rounded-sm bg-ink/70 px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/70">
            Showreel could not load
          </span>
        ) : null}
      </div>

      <div className="container-x mx-auto w-full max-w-[110rem] pb-[clamp(2.5rem,7vh,5rem)] pt-[calc(var(--header-h)+4rem)]">
        <p data-hero-line className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-white">
          {homepageCreative.positioningLine.map((item, i) => (
            <span key={item} className="inline-flex items-center gap-3">
              {i > 0 ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-blue" /> : null}
              {item}
            </span>
          ))}
        </p>

        <p data-hero-statement className="display mt-6 max-w-[11ch] text-white">
          {homepageCreative.statement[0]}
          <br />
          <span className="text-blue">{homepageCreative.statement[1]}</span>
        </p>

        <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 lg:grid-cols-12 lg:items-end">
          {/* Protected SEO H1 from the live homepage, kept as the page's semantic heading. */}
          <div className="lg:col-span-7">
            <h1 id="hero-title" data-hero-fade className="max-w-[26ch] text-[clamp(1.25rem,1rem+1vw,2rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-white">
              {homepageSeo.h1.value}
            </h1>
            <p data-hero-fade className="mt-3 max-w-[52ch] text-[length:var(--fs-body)] leading-[1.6] text-white/75">
              {homepageCreative.lead}
            </p>
          </div>
          <div data-hero-fade className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <ArrowLink href="/case-studies/" variant="blue" size="lg">Explore Our Work</ArrowLink>
            <ArrowLink href="/contact-us/" variant="outline" size="lg" className="text-white">Let&apos;s Talk</ArrowLink>
          </div>
        </div>

        <div data-hero-fade className="mt-10 flex items-center justify-between gap-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/70">
          <a href="#about" className="inline-flex items-center gap-3 hover:text-white">
            <span aria-hidden="true" className="relative block h-9 w-[1.375rem] rounded-full border border-white/40">
              <span className="absolute left-1/2 top-1.5 h-2 w-[2px] -translate-x-1/2 rounded bg-white motion-safe:animate-[scroll-dot_1.8s_ease-in-out_infinite]" />
            </span>
            Scroll to explore
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(showreel.length).padStart(2, "0")} — {clipNow.title}
            </span>
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={!playing}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2.5 hover:border-blue hover:text-white"
            >
              {playing ? (
                <svg aria-hidden="true" viewBox="0 0 8 8" className="h-2 w-2 fill-current"><rect width="3" height="8" /><rect x="5" width="3" height="8" /></svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 8 8" className="h-2 w-2 fill-current"><path d="M0 0l8 4-8 4z" /></svg>
              )}
              {playing ? "Pause" : "Play"} showreel
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes scroll-dot{0%{opacity:0;transform:translate(-50%,0)}40%{opacity:1}100%{opacity:0;transform:translate(-50%,12px)}}`}</style>
    </section>
  );
}
