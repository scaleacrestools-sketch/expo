"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ndMoreSites, ndSites } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Pic, Rules, Tag, Words } from "@/components/nd/ui";

/**
 * 06 — Website design. An editorial two-line title that rises word by word and drifts into place,
 * then three genuine websites shown large in a minimal browser frame (first-screen captures of the
 * live sites, 2× resolution). Each frame widens from a narrow window to the full grid as it scrolls
 * into place. Three more sites follow as a compact list. Where we recorded a scroll-through of the
 * live site, it plays muted over the still while the frame is on screen.
 */
export function NdWebsites() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    // the second title line slides in from the right as the section arrives (ends at rest, never past the edge)
    const drift = el.querySelector("#nd-web-title > span:nth-child(2)");
    if (drift) gsap.fromTo(drift, { xPercent: 9 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: 0.4 } });
    el.querySelectorAll<HTMLElement>("[data-expand]").forEach((f) => {
      gsap.fromTo(f, { clipPath: "inset(8% 17% 8% 17%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: f, start: "top 95%", end: "top 30%", scrub: 0.3 } });
      const im = f.querySelector("[data-media]");
      if (im) gsap.fromTo(im, { scale: 1.16 }, { scale: 1, ease: "none", scrollTrigger: { trigger: f, start: "top 95%", end: "top 30%", scrub: 0.3 } });
    });
  });

  return (
    <section ref={ref} id="websites" className="nd-dark relative overflow-x-clip" aria-labelledby="nd-web-title">
      <Rules />
      <div className="nd-wrap relative pt-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-grid items-end">
          <div className="nd-cell">
            <Tag>Website design</Tag>
            <p data-nd="up" className="nd-lead nd-muted mt-5 max-w-[24rem]">Websites we&apos;ve designed and built for developers and brands: fast, clear and made to turn visits into enquiries.</p>
          </div>
          <div className="nd-cell lg:col-span-2 max-lg:mt-8">
            <Words
              id="nd-web-title"
              lines={["Website Design.", "Digital Experiences."]}
              accent={["Experiences."]}
              accentClass="text-[color:var(--sky)]"
              lineClass={["", "lg:pl-[0.9em]"]}
              className="text-[clamp(2rem,10vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.05em] [overflow-wrap:normal] lg:text-[min(6.6vw,8.75rem)]"
            />
          </div>
        </div>

        <ol className="mt-[clamp(3rem,7vw,6rem)]" role="list">
          {ndSites.map((s, i) => (
            <li key={s.name} className="pb-[clamp(3.5rem,8vw,7rem)]">
              <div className="nd-grid border-t border-white/12 py-4" data-nd="up">
                <p className="nd-cell nd-label"><span className="text-[color:var(--sky)]">{String(i + 1).padStart(2, "0")}</span> <span className="ml-2">{s.name}</span></p>
                <p className="nd-cell nd-label nd-muted hidden md:block">{s.sector}</p>
                <p className="nd-cell nd-label nd-muted hidden text-right lg:block">{s.tags.join(" · ")}</p>
              </div>
              <div className="nd-cell">
                <div data-expand className="overflow-hidden bg-[color:var(--charcoal)] ring-1 ring-white/10">
                  <div className="flex h-8 items-center gap-1.5 border-b border-white/8 bg-[color:var(--charcoal)] px-3 md:h-9">
                    {[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 rounded-full bg-white/22" />)}
                    <span className="mx-auto truncate px-4 text-[0.875rem] text-white/50">{s.domain ?? s.name}</span>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div data-media className="absolute inset-0">
                      <Pic image={s.image} alt={`${s.name} website, designed and developed by ScaleAcres`} sizes="(min-width: 1024px) 94vw, 100vw" imgClass="absolute inset-0 h-full w-full object-cover object-top" />
                      {s.video ? <SiteVideo src={s.video} /> : null}
                    </div>
                    {s.video ? <span className="absolute bottom-3 left-3 bg-white px-2.5 py-1 text-[0.8125rem] font-semibold text-[color:var(--ink)] shadow-[var(--sh-1)] md:bottom-4 md:left-4">Live site · scroll-through</span> : null}
                  </div>
                </div>
              </div>
              <div className="nd-grid mt-5" data-nd="up">
                <h3 className="nd-cell nd-d4">{s.name}</h3>
                <p className="nd-cell nd-body nd-muted max-w-[30rem] max-md:mt-2">{s.note}</p>
                <div className="nd-cell flex flex-col gap-3 lg:items-end max-lg:mt-3">
                  <p className="nd-label nd-muted">Designed &amp; developed by ScaleAcres</p>
                  {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="nd-link nd-label text-white">Visit live site <ArrowUR className="h-3.5 w-3.5" /><span className="sr-only"> (opens {s.domain} in a new tab)</span></a> : null}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* More websites */}
        <div className="nd-grid border-t border-white/12 pb-[clamp(4.5rem,10vw,9rem)] pt-8">
          <div className="nd-cell">
            <p className="nd-label">More websites</p>
            <Link href="/our-work/" className="nd-btn nd-btn--white mt-6 w-full max-w-[20rem]">All projects <ArrowUR /></Link>
          </div>
          <ul className="lg:col-span-2 max-lg:mt-8" role="list">
            {ndMoreSites.map((s) => (
              <li key={s.name} className="nd-cell border-b border-white/12 py-4 first:pt-0" data-nd="up">
                <SiteRow s={s} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SiteRow({ s }: { s: (typeof ndMoreSites)[number] }) {
  const body = (
    <>
      <div className="nd-zoom relative aspect-[16/10] w-[38%] max-w-[15rem] shrink-0 overflow-hidden bg-[color:var(--charcoal)]">
        <Pic image={s.image} alt={`${s.name} website by ScaleAcres`} sizes="240px" imgClass="absolute inset-0 h-full w-full object-cover object-top" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[clamp(1.25rem,1.6vw,1.75rem)] font-semibold tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1">{s.name}</p>
        <p className="nd-muted mt-1 text-[1rem]">{s.sector}</p>
      </div>
      {s.url ? <ArrowUR className="mr-1 h-4 w-4 shrink-0 text-white/60 transition-[color,transform] duration-500 group-hover:rotate-45 group-hover:text-[color:var(--sky)]" /> : null}
    </>
  );
  return s.url ? (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5" aria-label={`${s.name} — visit the live site (opens ${s.domain} in a new tab)`}>{body}</a>
  ) : (
    <div className="group flex items-center gap-5">{body}</div>
  );
}

/** Muted scroll-through of a live site: loads only near the viewport, plays only while visible. */
function SiteVideo({ src }: { src: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = v.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); if (el.currentSrc) el.play().catch(() => {}); } else el.pause();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || !v.current) return;
    v.current.load();
    v.current.play().catch(() => {});
  }, [on]);
  return (
    <video
      ref={v}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => setShown(true)}
      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}
    >
      {on ? <source src={`${src}.webm`} type="video/webm" /> : null}
      {on ? <source src={`${src}.mp4`} type="video/mp4" /> : null}
    </video>
  );
}
