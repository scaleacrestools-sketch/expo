"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ndHero } from "@/content/nd";
import { useGsap } from "@/lib/motion";

const LINES: [string, string][] = [["Built to", "Stand Out."], ["Designed", "to Scale."]];
const MARKS = [[25, 30], [50, 30], [75, 30], [25, 64], [75, 64]];

/**
 * 01 — Hero. Full-screen ScaleAcres motion reel (six chapters, 18 s seamless loop) under a Brand
 * Black grade. Kicker top left, supporting copy top right, the two-line statement set large at the
 * bottom (second line indented), then a hairline bar with the CTAs, the reel controls (pause,
 * chapter number, progress, chapter name) and the scroll cue. The statement rises once on load and
 * then stays still; only the chapter indicator follows the reel.
 */
export function NdHero() {
  const ref = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(true); // false for reduced motion / Save-Data until the visitor presses play
  const [src, setSrc] = useState<string | null>(null);
  const userPaused = useRef(false);

  useGsap(ref, ({ gsap, el }) => {
    gsap.to(el.querySelector("[data-bg]"), { yPercent: 10, scale: 1.06, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.3 } });
  });

  // Choose the cut (portrait on phones) and the codec once, after the page has loaded.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let t = 0;
    const start = () => {
      t = window.setTimeout(() => {
        const v = vid.current;
        const portrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
        const ext = v?.canPlayType('video/mp4; codecs="avc1.640028"') ? "mp4" : "webm";
        setSrc(`${portrait ? ndHero.reel.portrait : ndHero.reel.landscape}.${ext}`);
        if (reduce || save) { setCanPlay(false); userPaused.current = true; }
      }, 120);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => { window.clearTimeout(t); window.removeEventListener("load", start); };
  }, []);

  // Play when loaded and on screen; pause off-screen. Respect the visitor's pause.
  useEffect(() => {
    const v = vid.current;
    const host = ref.current;
    if (!v || !host || !src) return;
    if (canPlay && !userPaused.current) v.play().catch(() => undefined);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) v.play().catch(() => undefined);
      else v.pause();
    }, { threshold: 0.1 });
    io.observe(host);
    return () => io.disconnect();
  }, [src, canPlay]);

  // Chapter indicator and progress follow the reel time.
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    let raf = 0;
    const chs = ndHero.reel.chapters;
    const tick = () => {
      const t = v.currentTime % ndHero.reel.duration;
      let i = chs.length - 1;
      while (i > 0 && t < chs[i].at) i--;
      setChapter((c) => (c === i ? c : i));
      const end = i < chs.length - 1 ? chs[i + 1].at : ndHero.reel.duration;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - chs[i].at) / (end - chs[i].at)))})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = useCallback(() => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; setCanPlay(true); v.play().catch(() => undefined); }
    else { userPaused.current = true; v.pause(); }
  }, []);

  const ch = ndHero.reel.chapters[chapter];
  let w = 0;
  return (
    <section ref={ref} className="nd-dark nd-hero relative isolate flex h-[100svh] min-h-[38rem] flex-col overflow-hidden" aria-labelledby="nd-hero-title">
      {/* Reel */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[color:var(--ink)]">
        <div data-bg className="nd-hero-bg absolute inset-0">
          <picture>
            <source media="(max-width: 767px) and (orientation: portrait)" type="image/webp" srcSet={ndHero.reel.poster.portrait} sizes="100vw" />
            <source type="image/webp" srcSet={ndHero.reel.poster.landscapeSet} sizes="100vw" />
            { }
            <img src={ndHero.reel.poster.landscape} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          <video
            ref={vid}
            src={src ?? undefined}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        {/* Grade: keeps every chapter behind the type; heavier on phones, where text covers more of the frame */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_13_13/0.74)_0%,rgb(11_13_13/0.58)_30%,rgb(11_13_13/0.62)_55%,rgb(11_13_13/0.8)_75%,rgb(11_13_13/0.95)_100%)] md:bg-[linear-gradient(180deg,rgb(11_13_13/0.62)_0%,rgb(11_13_13/0.28)_26%,rgb(11_13_13/0.48)_48%,rgb(11_13_13/0.78)_72%,rgb(11_13_13/0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgb(11_13_13/0.62),transparent_60%)]" />
        {/* Registration marks */}
        <div className="nd-hero-in absolute inset-0 hidden md:block" style={{ "--d": 900 } as CSSProperties}>
          {MARKS.map(([x, y]) => (
            <span key={`${x}-${y}`} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white/35" style={{ left: `${x}%`, top: `${y}%` }}>
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-[var(--m)] pt-16 md:pt-20">
        {/* Top row: kicker and supporting copy */}
        <div className="flex flex-col gap-5 pt-6 md:flex-row md:items-start md:justify-between md:pt-10">
          <p className="nd-hero-in flex items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-white/85 md:text-[0.8125rem]" style={{ "--d": 450 } as CSSProperties}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[color:var(--sky)]" />
            Real estate marketing · Creative growth
          </p>
          <p className="nd-hero-in max-w-[30rem] text-[1.0625rem] font-medium leading-[1.42] tracking-[-0.01em] text-white/92 md:text-right md:text-[clamp(1.125rem,1.35vw,1.5rem)]" style={{ "--d": 600 } as CSSProperties}>
            {ndHero.support}
          </p>
        </div>

        {/* Statement */}
        <div className="mt-auto pb-6 md:pb-8">
          <h1 id="nd-hero-title" className="text-[clamp(3.2rem,16vw,5.6rem)] font-semibold leading-[0.9] tracking-[-0.055em] md:text-[clamp(4.5rem,9.6vw,12.5rem)]">
            {LINES.map((pair, li) => (
              <span key={li} className={`block ${li === 1 ? "md:pl-[17%]" : ""}`}>
                {/* phones: four lines (Built to / Stand Out. / Designed / to Scale.); wider: two */}
                {pair.map((chunk, ci) => (
                  <span key={ci} className="block md:inline">
                    {chunk.split(" ").map((word, wi, arr) => (
                      <span key={wi}>
                        <span className="nd-w"><span className={`nd-hw ${word === "Scale." ? "text-[color:var(--sky)]" : ""}`} style={{ "--i": w++ } as CSSProperties}>{word}</span></span>
                        {wi < arr.length - 1 || ci === 0 ? " " : null}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        {/* Bottom bar */}
        <div className="relative pb-5 md:pb-7">
          <span aria-hidden="true" className="nd-hero-rule absolute inset-x-0 top-0 h-px origin-left bg-white/15" />
          <div className="grid grid-cols-1 items-center gap-y-4 pt-5 md:grid-cols-[1fr_auto_1fr] md:pt-6">
            <div className="nd-hero-in flex flex-wrap items-center gap-x-7 gap-y-3" style={{ "--d": 820 } as CSSProperties}>
              <Link href="/contact-us/" className="nd-cta group inline-flex h-14 items-center gap-5 rounded-full bg-[color:var(--royal)] pl-6 pr-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[color:var(--deep)]">
                Start a project
                <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-white text-[color:var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
                </span>
              </Link>
              <a href="#work" className="nd-link text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white">View our work</a>
            </div>

            {/* Reel controls */}
            <div className="nd-hero-in flex items-center gap-4 md:justify-center" style={{ "--d": 960 } as CSSProperties}>
              <button
                type="button"
                onClick={toggle}
                aria-pressed={!playing}
                aria-label={playing ? "Pause background video" : "Play background video"}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35 text-white transition-colors duration-300 hover:border-[color:var(--sky)] hover:text-[color:var(--sky)]"
              >
                {playing ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M4 3h3v10H4zM9 3h3v10H9z" /></svg>
                ) : (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
                )}
              </button>
              <span className="w-6 text-[0.8125rem] font-semibold tabular-nums text-white">{ch.n}</span>
              <span aria-hidden="true" className="relative h-px w-12 bg-white/25 md:w-16">
                <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-[color:var(--sky)]" />
              </span>
              <span className="min-w-0 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-white/80" aria-live="off">
                <span key={ch.n} className="nd-chap inline-block">{ch.label}</span>
                <span className="hidden text-white/45 lg:inline"> · ScaleAcres reel</span>
              </span>
            </div>

            <div className="nd-hero-in hidden items-center justify-end gap-4 md:flex" style={{ "--d": 1080 } as CSSProperties}>
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-white/80">Scroll to explore</span>
              <span aria-hidden="true" className="relative h-10 w-6 rounded-full border border-white/40">
                <span className="nd-scroll-dot absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[color:var(--sky)]" />
              </span>
            </div>
          </div>
          <p className="nd-hero-in mt-3 text-[0.6875rem] text-white/40 md:absolute md:right-0 md:top-[-1.75rem] md:mt-0" style={{ "--d": 1080 } as CSSProperties}>{ndHero.reel.credit}</p>
        </div>
      </div>

      <style>{`
        .nd-hero-bg { animation: ndh-bg 1.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes ndh-bg { from { transform: scale(1.08); opacity: 0.35; } to { transform: none; opacity: 1; } }
        .js .nd-hw { display: inline-block; transform: translateY(105%); animation: ndh-up 0.95s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: calc(150ms + var(--i) * 65ms); }
        @keyframes ndh-up { to { transform: none; } }
        .js .nd-hero-in { opacity: 0; transform: translateY(12px); animation: ndh-in 0.8s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: calc(var(--d) * 1ms); }
        @keyframes ndh-in { to { opacity: 1; transform: none; } }
        .js .nd-hero-rule { transform: scaleX(0); animation: ndh-rule 1.1s cubic-bezier(0.76,0,0.24,1) 0.35s forwards; }
        @keyframes ndh-rule { to { transform: scaleX(1); } }
        .nd-chap { animation: ndh-chap 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes ndh-chap { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .nd-scroll-dot { animation: ndh-dot 1.8s cubic-bezier(0.65,0,0.35,1) infinite; }
        @keyframes ndh-dot { 0% { transform: translate(-50%, 0); opacity: 0; } 25% { opacity: 1; } 70% { transform: translate(-50%, 14px); opacity: 0; } 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .nd-hero-bg, .js .nd-hw, .js .nd-hero-in, .js .nd-hero-rule, .nd-chap, .nd-scroll-dot { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
