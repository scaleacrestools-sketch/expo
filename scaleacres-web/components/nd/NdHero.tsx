"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { clientLogos, clientSprite } from "@/content/assets";
import { ndHero } from "@/content/nd";
import { site } from "@/content/site";
import { useGsap } from "@/lib/motion";
import { Plus, Rules } from "@/components/nd/ui";

const LINES: [string, string][] = [["Built to", "Stand Out."], ["Designed", "to Scale."]];

/**
 * 01 — Hero. The reference hero reel (five concept films crossfading in turn) under grain and a
 * Brand Black grade, hairline grid, a discipline row, the statement set
 * edge to edge in two lines (second line set right), supporting copy with a Royal CTA bar and a
 * client-logo strip. Opens with a fast word rise; on scroll the type drifts up over the picture.
 */
export function NdHero() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const st = { trigger: el, start: "top top", end: "bottom top", scrub: 0.3 };
    gsap.to(el.querySelector("[data-bg]"), { yPercent: 12, scale: 1.08, ease: "none", scrollTrigger: st });
    gsap.to(el.querySelector("h1"), { yPercent: -18, ease: "none", scrollTrigger: st });
  });

  let w = 0;
  return (
    <section ref={ref} className="nd-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-14 md:pt-16" aria-labelledby="nd-hero-title">
      {/* Backdrop: the reference hero reel over its poster */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div data-bg className="nd-hero-bg absolute inset-0">
          <picture>
            <source media="(max-width: 767px)" type="image/webp" srcSet={ndHero.poster.portrait} />
            <source type="image/webp" srcSet={ndHero.poster.landscapeSet} sizes="100vw" />
            { }
            <img src={ndHero.poster.landscape} alt="" width={1600} height={900} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
          </picture>
          <HeroReel />
        </div>
        <div className="nd-grain absolute inset-0 bg-[linear-gradient(180deg,rgb(11_13_13/0.66)_0%,rgb(11_13_13/0.22)_30%,rgb(11_13_13/0.34)_56%,rgb(11_13_13/0.93)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_100%,rgb(11_13_13/0.6),transparent_62%)]" />
      </div>
      <Rules />

      <div className="nd-wrap relative z-10 flex flex-1 flex-col">
        {/* Meta row */}
        <div className="nd-grid nd-hero-in pt-5 md:pt-7" style={{ "--d": 250 } as CSSProperties}>
          <p className="nd-cell nd-label">Real estate marketing &amp; creative growth</p>
          <p className="nd-cell nd-label nd-muted hidden md:block">{site.offices.join(" · ")}</p>
          <div className="nd-cell hidden text-right lg:block">
            <p className="nd-label nd-muted">{site.markets.join(" · ")}</p>
            <p className="mt-2 text-[0.875rem] text-white/45">{ndHero.backdrop.credit}</p>
          </div>
        </div>

        {/* Disciplines */}
        <ul className="nd-grid nd-hero-in mt-8 hidden md:grid md:mt-[clamp(2rem,7vh,4.5rem)]" role="list" style={{ "--d": 320 } as CSSProperties}>
          {ndHero.disciplines.map((d, i) => (
            <li key={d} className={`nd-cell nd-label border-t border-white/20 pt-3 ${i === 2 ? "hidden lg:block" : ""}`}>
              <span className="mr-2 text-white/45">{String(i + 1).padStart(2, "0")}.</span>{d}
            </li>
          ))}
        </ul>

        {/* Statement */}
        <div className="flex flex-1 items-center py-[clamp(1.5rem,5vh,3rem)]">
          <h1 id="nd-hero-title" className="nd-d1 nd-cell w-full will-change-transform">
            {LINES.map((pair, li) => (
              <span key={li} className={`block ${li === 1 ? "md:text-right" : ""}`}>
                {pair.map((chunk, ci) => (
                  <span key={ci} className="block md:inline">
                    {chunk.split(" ").map((word, wi, arr) => (
                      <span key={wi}>
                        <span className="nd-w">
                          <span className={`nd-hw ${word === "Scale." ? "text-[color:var(--sky)]" : ""}`} style={{ "--i": w++ } as CSSProperties}>{word}</span>
                        </span>
                        {wi < arr.length - 1 || ci === 0 ? " " : null}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        {/* CTA + support (draft: actions under the headline on the left) */}
        <div className="nd-grid nd-hero-in items-end gap-y-6 pb-7 md:pb-9" style={{ "--d": 620 } as CSSProperties}>
          <div className="nd-cell flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/contact-us/" className="nd-btn nd-btn--royal min-w-[15rem]">Start a project <Plus /></Link>
            <a href="#work" className="nd-link nd-label">See our work</a>
          </div>
          <p className="nd-cell nd-lead max-w-[30rem] text-white/90">{ndHero.support}</p>
          <div className="nd-cell flex flex-col gap-3 lg:items-end lg:text-right">
            <p className="max-w-[22rem] text-[1rem] leading-[1.5] text-white/72">Trusted by developers including Adani Realty, Tata Realty and M3M.</p>
            <ul className="flex gap-5" role="list" aria-label="ScaleAcres on social media">
              {site.social.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="nd-link nd-label">{s.label}</a></li>
              ))}
            </ul>
            <p className="text-[0.875rem] text-white/45 lg:hidden">{ndHero.backdrop.credit}</p>
          </div>
        </div>
      </div>

      {/* Client strip */}
      <div className="nd-hero-in relative z-10 border-t border-white/12 bg-[rgb(11_13_13/0.35)] backdrop-blur-[2px]" style={{ "--d": 760 } as CSSProperties}>
        <div className="nd-marquee-host overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="nd-marquee" style={{ "--dur": "55s" } as CSSProperties} role="list" aria-label="Clients">
            {[...clientLogos, ...clientLogos].map((c, i) => {
              const col = c.i % clientSprite.cols;
              const row = Math.floor(c.i / clientSprite.cols);
              return (
                <li key={i} className="h-9 w-[8.5rem] shrink-0 px-5 text-white/70 md:h-10 md:w-[10rem]" aria-hidden={i >= clientLogos.length}>
                  <span
                    role="img"
                    aria-label={c.name}
                    className="nd-logo"
                    style={{ "--sprite": `url(${clientSprite.src})`, "--mask-size": `${clientSprite.cols * 100}% ${clientSprite.rows * 100}%`, "--mask-pos": `${(col / (clientSprite.cols - 1)) * 100}% ${(row / (clientSprite.rows - 1)) * 100}%` } as CSSProperties}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <style>{`
        .nd-hero-bg { animation: ndh-bg 1.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes ndh-bg { from { transform: scale(1.14); opacity: 0.2; } to { transform: none; opacity: 1; } }
        .js .nd-hw { display: inline-block; transform: translateY(105%); animation: ndh-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: calc(120ms + var(--i) * 70ms); }
        @keyframes ndh-up { to { transform: none; } }
        .js .nd-hero-in { opacity: 0; transform: translateY(14px); animation: ndh-in 0.8s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: calc(var(--d) * 1ms); }
        @keyframes ndh-in { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .nd-hero-bg, .js .nd-hw, .js .nd-hero-in { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

/**
 * Two stacked videos: the front one plays, the back one preloads the next film; when the front
 * ends they swap with a slow crossfade. Starts after page load, pauses off-screen, and is skipped
 * for reduced motion and Save-Data (the poster stays).
 */
function HeroReel() {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [front, setFront] = useState(0);
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const n = ndHero.reel.length;
  const el = (k: number) => (k === 0 ? a : b).current;
  const src = (i: number) => (portrait ? ndHero.reel[i % n].portrait : ndHero.reel[i % n].landscape);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    let t = 0;
    const start = () => {
      t = window.setTimeout(() => { setPortrait(window.matchMedia("(max-width: 767px)").matches); setOn(true); }, 150);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => { window.clearTimeout(t); window.removeEventListener("load", start); };
  }, []);

  useEffect(() => {
    if (!on) return;
    const f = el(front);
    const back = el(1 - front);
    if (!f || !back) return;
    if (f.getAttribute("src") !== src(idx)) f.setAttribute("src", src(idx));
    back.setAttribute("src", src(idx + 1));
    back.load();
    f.play().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, idx, front, portrait]);

  // Pause while the hero is off-screen
  useEffect(() => {
    if (!on) return;
    const host = a.current?.closest("section");
    if (!host) return;
    const io = new IntersectionObserver(([e]) => {
      const f = el(front);
      if (!f) return;
      if (e.isIntersecting) f.play().catch(() => undefined); else f.pause();
    });
    io.observe(host);
    return () => io.disconnect();
  }, [on, front]);

  const next = () => {
    el(1 - front)?.play().catch(() => undefined);
    setFront(1 - front);
    setIdx((i) => (i + 1) % n);
  };

  return (
    <>
      {[0, 1].map((k) => (
        <video
          key={k}
          ref={k === 0 ? a : b}
          muted
          playsInline
          preload="none"
          tabIndex={-1}
          onPlaying={k === front ? () => setReady(true) : undefined}
          onEnded={k === front ? next : undefined}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${k === front && ready ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </>
  );
}
