"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { clientLogos, clientSprite } from "@/content/assets";
import { ndHero } from "@/content/nd";
import { site } from "@/content/site";
import { useGsap } from "@/lib/motion";
import { Plus, Rules } from "@/components/nd/ui";

const LINES: [string, string][] = [["Built to", "stand out."], ["Designed", "to scale."]];

/**
 * 01 — Hero. Monochrome backdrop with grain, hairline grid, a discipline row, the statement set
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
      {/* Backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div data-bg className="nd-hero-bg absolute inset-0">
          <picture>
            <source media="(max-width: 767px)" type="image/avif" srcSet={ndHero.backdrop.portrait.avif} sizes="100vw" />
            <source media="(max-width: 767px)" type="image/webp" srcSet={ndHero.backdrop.portrait.srcSet} sizes="100vw" />
            <source type="image/avif" srcSet={ndHero.backdrop.landscape.avif} sizes="100vw" />
            <source type="image/webp" srcSet={ndHero.backdrop.landscape.srcSet} sizes="100vw" />
            { }
            <img src={ndHero.backdrop.landscape.src} alt="" width={ndHero.backdrop.landscape.w} height={ndHero.backdrop.landscape.h} fetchPriority="high" decoding="async" className="h-full w-full object-cover object-[50%_40%]" />
          </picture>
        </div>
        <div className="nd-grain absolute inset-0 bg-[linear-gradient(180deg,rgb(11_13_13/0.72)_0%,rgb(11_13_13/0.42)_35%,rgb(11_13_13/0.5)_62%,rgb(11_13_13/0.94)_100%)]" />
        <div className="absolute inset-0 bg-[color:var(--navy)] opacity-30 mix-blend-multiply" />
      </div>
      <Rules />

      <div className="nd-wrap relative z-10 flex flex-1 flex-col">
        {/* Meta row */}
        <div className="nd-grid nd-hero-in pt-5 md:pt-7" style={{ "--d": 250 } as CSSProperties}>
          <p className="nd-cell nd-label">Real estate marketing &amp; creative growth</p>
          <p className="nd-cell nd-label nd-muted hidden md:block">{site.offices.join(" · ")}</p>
          <p className="nd-cell nd-label nd-muted hidden text-right lg:block">{site.markets.join(" · ")}</p>
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
                          <span className={`nd-hw ${word === "scale." ? "text-[color:var(--sky)]" : ""}`} style={{ "--i": w++ } as CSSProperties}>{word}</span>
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

        {/* Support + CTA */}
        <div className="nd-grid nd-hero-in pb-6 md:pb-8" style={{ "--d": 650 } as CSSProperties}>
          <ul className="nd-cell hidden items-end gap-5 lg:flex" role="list" aria-label="ScaleAcres on social media">
            {site.social.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="nd-link nd-label">{s.label}</a></li>
            ))}
          </ul>
          <div className="nd-cell">
            <p className="nd-lead max-w-[30rem] text-white/90">{ndHero.support}</p>
            <Link href="/contact-us/" className="nd-btn nd-btn--royal mt-6 w-full">Start a project <Plus /></Link>
          </div>
          <div className="nd-cell mt-6 flex flex-col justify-end md:mt-0 lg:items-end lg:text-right">
            <a href="#services" className="nd-link nd-label">Explore our services</a>
            <p className="mt-3 max-w-[22rem] text-[1rem] leading-[1.5] text-white/70">Trusted by developers including Adani Realty, Tata Realty and M3M.</p>
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

      <p className="pointer-events-none absolute bottom-[4.75rem] right-[var(--m)] z-10 hidden px-5 text-[0.875rem] text-white/45 md:block">{ndHero.backdrop.credit}</p>

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
