"use client";

import { Fragment, useEffect, useRef } from "react";

/**
 * Section 02 — editorial brand introduction.
 * The paragraph is ordinary server-rendered text. As the section scrolls through the
 * viewport, words switch from light grey to Brand Black (phrases in `em` to Royal),
 * driven by one passive scroll listener and a CSS custom property — no re-renders.
 * Without JS, or with reduced motion, every word is shown fully revealed.
 */
type Run = { t: string; em?: boolean };
const PARAGRAPHS: Run[][] = [
  [
    { t: "At ScaleAcres, we turn ambitious ideas into" },
    { t: "brands people remember,", em: true },
    { t: "digital experiences people enjoy, and marketing that drives" },
    { t: "real business growth.", em: true },
  ],
  [
    { t: "From real estate launches and lead generation to branding, websites, content and technology, we bring" },
    { t: "creative thinking and systematic execution", em: true },
    { t: "together." },
  ],
  [
    { t: "Every strategy has a purpose. Every experience has a story. Every campaign is built to" },
    { t: "move business forward.", em: true },
  ],
];

export function EditorialIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    el.dataset.ready = "true";
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the text enters the lower part of the viewport and finishes while it is
      // still comfortably in view, so readers never wait for the last words.
      const start = vh * 0.9;
      const end = vh * 0.38;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.85)));
      const x = p * words.length;
      const n = Math.floor(x);
      if (n !== last) {
        words.forEach((w, i) => {
          w.toggleAttribute("data-on", i < n);
          if (i !== n) w.style.removeProperty("--r");
        });
        last = n;
      }
      // The word at the reveal front blends continuously with scroll position.
      words[n]?.style.setProperty("--r", (x - n).toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="about" aria-labelledby="intro-label" className="bg-offwhite text-ink">
      <div className="container-x py-[clamp(6rem,12vw,11rem)]">
        <div className="mx-auto w-full max-w-[78rem]">
          <div className="mb-[clamp(2.75rem,5vw,4.5rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <p id="intro-label" className="eyebrow text-blue">Who we are</p>
            <p className="label text-steel">A real estate marketing &amp; creative growth agency</p>
          </div>
          <div
            ref={ref}
            className="editorial-intro grid gap-[0.62em] text-[clamp(1.625rem,0.9rem+2.45vw,3.25rem)] font-normal leading-[1.24] tracking-[-0.018em] [text-wrap:pretty]"
          >
            {PARAGRAPHS.map((runs, pi) => {
              const words = runs.flatMap((run) => run.t.split(" ").map((w) => ({ w, em: !!run.em })));
              const tail = words.length - 2; // keep the last two words together: no single-word last line
              return (
                <p key={pi}>
                  {words.map(({ w, em }, wi) =>
                    wi === tail ? (
                      <span key={wi} className="whitespace-nowrap">
                        <span data-w className={em ? "em" : undefined}>{w}</span>{" "}
                        <span data-w className={words[wi + 1].em ? "em" : undefined}>{words[wi + 1].w}</span>
                      </span>
                    ) : wi > tail ? null : (
                      <Fragment key={wi}>
                        <span data-w className={em ? "em" : undefined}>{w}</span>{" "}
                      </Fragment>
                    ),
                  )}
                </p>
              );
            })}
          </div>
          <div className="mt-[clamp(3.5rem,6vw,5.5rem)] flex flex-wrap items-end justify-between gap-8 border-t border-line pt-8">
            <p className="max-w-[46ch] text-[length:var(--fs-body)] leading-[1.7] text-steel">
              ScaleAcres is an independent creative, digital and growth agency, with real estate marketing at its core. Built to stand out. Designed to scale.
            </p>
            <div className="flex items-end gap-2" aria-hidden="true">
              {[22, 40, 58, 78, 100].map((h) => (
                <span key={h} className="block w-3 rounded-t-[2px] md:w-4" style={{ height: `${h * 0.56}px`, background: "var(--grad-rise)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
