"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { splitWords, useGsap, prefersReducedMotion } from "@/lib/motion";

export type HeroMedia = {
  /** Desktop (landscape) sources, best-first. */
  sources: { src: string; type: string }[];
  /** Optional portrait sources used below 768px. */
  mobileSources?: { src: string; type: string }[];
  poster: string;
  mobilePoster?: string;
  placeholder?: boolean;
};

export function HeroVideo({ media }: { media: HeroMedia }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Autoplay unless reduced motion is requested; keep the control state in sync.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onCanPlay = () => setReady(true);
    const onError = () => setFailed(true);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onError, true);
    if (!prefersReducedMotion()) v.play().catch(() => setPlaying(false));
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onError, true);
    };
  }, [isMobile]);

  useGsap(root, ({ gsap, el }) => {
    const words = splitWords(el.querySelector<HTMLElement>("[data-hero-title]")!);
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(el.querySelector("[data-hero-media]"), { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" }, 0)
      .fromTo(el.querySelector("[data-hero-eyebrow]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.5)
      .to(words, { y: 0, duration: 1.3, stagger: 0.07 }, 0.65)
      .fromTo(el.querySelectorAll("[data-hero-fade]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 1.2);
    // Gentle parallax on scroll (transform only, GPU friendly).
    gsap.to(el.querySelector("[data-hero-media]"), {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(el.querySelector("[data-hero-copy]"), {
      yPercent: -10, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
  });

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  };

  const sources = isMobile && media.mobileSources?.length ? media.mobileSources : media.sources;
  const poster = isMobile && media.mobilePoster ? media.mobilePoster : media.poster;

  return (
    <section ref={root} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-charcoal text-ivory" aria-labelledby="hero-title">
      <div data-hero-media className="absolute inset-0 -z-10 will-change-transform">
        {!failed ? (
          <video
            key={isMobile ? "m" : "d"}
            ref={video}
            className={`h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          >
            {sources.map((s) => (<source key={s.src} src={s.src} type={s.type} />))}
          </video>
        ) : null}
        {/* Poster shown until the video can play, and as the permanent fallback. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${ready && !failed ? "opacity-0" : "opacity-100"}`}
          style={{ backgroundImage: `url(${poster})` }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,21,26,0.55)_0%,rgba(17,21,26,0.25)_40%,rgba(17,21,26,0.85)_100%)]" />
        {media.placeholder ? (
          <span className="dev-badge" style={{ top: "calc(var(--header-h) + 0.75rem)" }}>Dev placeholder showreel — replace with ScaleAcres footage</span>
        ) : null}
      </div>

      <div data-hero-copy className="container-x mx-auto w-full max-w-[110rem] pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--header-h)+3rem)]">
        <p data-hero-eyebrow className="eyebrow text-coral">Independent Creative, Digital &amp; Growth Agency</p>
        <h1 id="hero-title" data-hero-title className="display mt-6 max-w-[12ch] text-ivory">
          Ideas that move.
          <br />
          Growth that matters.
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p data-hero-fade className="lead max-w-[38ch] text-stone md:col-span-6">
            We build unforgettable brands, bold digital experiences and campaigns designed to make an impact.
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <ArrowLink href="/work" variant="solid" size="lg">Explore Our Work</ArrowLink>
            <ArrowLink href="/contact" variant="outline" size="lg" className="text-ivory">Let&apos;s Talk</ArrowLink>
          </div>
        </div>
        <div data-hero-fade className="mt-14 flex items-center justify-between border-t border-ivory/15 pt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-stone">
          <a href="#clients" className="group inline-flex items-center gap-3 hover:text-ivory">
            Scroll to explore
            <span aria-hidden="true" className="inline-block motion-safe:animate-[scroll-hint_2.2s_ease-in-out_infinite]">↓</span>
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={playing}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-3.5 py-2 hover:border-coral hover:text-ivory"
          >
            <span aria-hidden="true" className="grid h-2 w-2 place-items-center">
              {playing ? (
                <svg viewBox="0 0 8 8" className="h-2 w-2 fill-current"><rect x="0" y="0" width="3" height="8" /><rect x="5" y="0" width="3" height="8" /></svg>
              ) : (
                <svg viewBox="0 0 8 8" className="h-2 w-2 fill-current"><path d="M0 0l8 4-8 4z" /></svg>
              )}
            </span>
            {playing ? "Pause video" : "Play video"}
          </button>
        </div>
      </div>
      <style>{`@keyframes scroll-hint{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}`}</style>
    </section>
  );
}
