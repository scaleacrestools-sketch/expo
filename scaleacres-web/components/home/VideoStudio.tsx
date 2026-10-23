"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { videoTabs, type VideoTab } from "@/content/home";
import { prefersReducedMotion, useGsap } from "@/lib/motion";
import { Kicker, MaskLines } from "@/components/home/fx";

/** One genuine video per category, shown large; the full category rails sit below. */
const FEATURED = [
  { id: "vODoeG2QEKQ", category: "Ad video", tab: "ad-videos" as const },
  { id: "MdluDjATzgA", category: "Social media video", tab: "social-media-videos" as const },
  { id: "FxO_2KVX4zA", category: "AI video", tab: "ai-videos" as const },
];

/**
 * Real Estate Videos That Drive Growth. Three genuine ScaleAcres videos (one per category)
 * shown large with cinematic covers that open from clipped frames as they scroll in; below,
 * the full Ad / Social / AI rails as published on scaleacres.com. Nothing autoplays: a video
 * plays only when chosen, one at a time, in a dialog.
 */
export function VideoStudio() {
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<VideoTab["id"]>("ad-videos");
  const [short, setShort] = useState<string | null>(null);
  const current = videoTabs.find((t) => t.id === tab) ?? videoTabs[0];
  const order: VideoTab["id"][] = ["ad-videos", "social-media-videos", "ai-videos"];
  const tabs = order.map((id) => videoTabs.find((t) => t.id === id)!).filter(Boolean);

  useGsap(ref, ({ gsap, el }) => {
    el.querySelectorAll<HTMLElement>("[data-feature]").forEach((f, i) => {
      gsap.fromTo(f, { clipPath: "inset(12% 8% 12% 8% round 28px)", y: 40 + i * 24 }, { clipPath: "inset(0% 0% 0% 0% round 22px)", y: 0, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "top 60%", scrub: 0.3 } });
    });
  });

  return (
    <section ref={ref} id="videos" className="relative bg-ink text-white" aria-labelledby="videos-title">
      <div className="container-x mx-auto max-w-[120rem] pt-[var(--section-y)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Kicker>Video production</Kicker>
            <MaskLines
              id="videos-title"
              lines={[["Real", "Estate", "Videos"], ["That", "Drive", "Growth."]]}
              accent={["Growth."]}
              accentClassName="text-sky"
              className="mt-6 h-display"
              lineClassName={["", "lg:pl-[9vw]"]}
            />
          </div>
          <p className="text-[clamp(1.25rem,1rem+0.8vw,2rem)] font-medium leading-[1.3] tracking-[-0.01em] text-white lg:col-span-4 lg:pb-4">
            We turn real estate stories into videos that attract attention and drive growth.
          </p>
        </div>
      </div>

      {/* Featured: one genuine video per category */}
      <div className="container-x mx-auto mt-[clamp(3rem,6vw,5.5rem)] max-w-[120rem]">
        <ul className="grid gap-5 sm:grid-cols-3 md:gap-6" role="list" aria-label="Featured videos">
          {FEATURED.map((f, i) => (
            <li key={f.id} className={i === 1 ? "sm:mt-[6vw]" : ""}>
              <button type="button" onClick={() => setShort(f.id)} className="group block w-full text-left" aria-label={`Play ${f.category}`}>
                <span data-feature className="relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-ink-soft sm:aspect-[9/14]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/home/work/yt-${f.id}.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]" />
                  <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.35)_0%,transparent_30%,transparent_55%,rgb(var(--ink-rgb)/0.85)_100%)]" />
                  <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-3.5 py-1.5 text-[0.875rem] font-semibold text-white backdrop-blur-md">{f.category}</span>
                  <span aria-hidden="true" className="absolute bottom-5 left-5 grid h-16 w-16 place-items-center rounded-full bg-white text-ink transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-blue group-hover:text-white">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.9375rem] text-grey">Videos produced by ScaleAcres and published on the ScaleAcres YouTube channel. AI videos are labelled as AI.</p>
      </div>

      {/* Categories */}
      <div className="container-x mx-auto max-w-[120rem] pb-[var(--section-y)] pt-[clamp(3.5rem,7vw,6rem)]">
        <div className="flex flex-col gap-6 border-t border-white/15 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Video categories" className="relative flex w-max max-w-full gap-1 overflow-x-auto rounded-full border border-white/15 p-1 [scrollbar-width:none]">
            {tabs.map((t) => {
              const on = t.id === tab;
              return (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="video-rail"
                  onClick={() => setTab(t.id)}
                  className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-300 md:px-6 ${on ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="max-w-[56ch] text-[1.0625rem] leading-[1.6] text-grey lg:text-right">{current.description}</p>
        </div>

        <Rail key={tab} tab={current} onPlay={setShort} />
      </div>

      <ShortDialog id={short} onClose={() => setShort(null)} />
    </section>
  );
}

function Rail({ tab, onPlay }: { tab: VideoTab; onPlay: (id: string) => void }) {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => {
    const r = rail.current;
    if (r) r.scrollBy({ left: dir * r.clientWidth * 0.8, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };
  return (
    <div className="relative mt-10">
      <ul ref={rail} id="video-rail" role="tabpanel" aria-label={tab.label} className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:gap-5">
        {tab.shorts.map((s, i) => (
          <li key={s.id} className="vs-card shrink-0 snap-start" style={{ animationDelay: `${i * 35}ms` }}>
            <button type="button" onClick={() => onPlay(s.id)} className="group relative block w-[64vw] overflow-hidden rounded-[18px] bg-ink-soft text-left sm:w-[15rem] lg:w-[16.5rem]" aria-label={`Play ${tab.label.replace(/s$/, "")} ${i + 1}`}>
              <span className="relative block aspect-[9/16]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]" />
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgb(var(--ink-rgb)/0.85))] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span aria-hidden="true" className="absolute left-4 top-4 rounded-full bg-ink/60 px-2.5 py-1 text-[0.8125rem] font-semibold tabular-nums tracking-[0.08em] text-white backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-blue group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <Link href="/creative-studio/" className="link-u text-[0.9375rem] font-semibold uppercase tracking-[0.16em] text-white">Visit the creative studio</Link>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button key={d} type="button" onClick={() => scroll(d)} aria-label={d < 0 ? "Previous videos" : "Next videos"} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-blue hover:bg-blue">
              <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-4 w-4 ${d < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .js .vs-card { animation: vs-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes vs-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .js .vs-card { animation: none; } }
      `}</style>
    </div>
  );
}

/** YouTube Short in a dialog; the iframe exists only while open, so nothing plays in the background. */
function ShortDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const d = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = d.current;
    if (!el) return;
    if (id && !el.open) el.showModal();
    if (!id && el.open) el.close();
  }, [id]);
  useEffect(() => {
    const el = d.current;
    if (!el) return;
    const h = () => onClose();
    el.addEventListener("close", h);
    return () => el.removeEventListener("close", h);
  }, [onClose]);
  return (
    <dialog
      ref={d}
      aria-label="Video"
      onClick={(e) => { if (e.target === d.current) onClose(); }}
      className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-ink/90 backdrop:backdrop-blur-sm"
    >
      {id ? (
        <div className="relative">
          <div className="aspect-[9/16] h-[min(80svh,48rem)] overflow-hidden rounded-[18px] bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
              title="ScaleAcres video"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <button type="button" onClick={onClose} className="absolute -top-14 right-0 rounded-full border border-white/25 px-5 py-2.5 text-[0.875rem] font-semibold uppercase tracking-[0.14em] text-white hover:border-blue hover:bg-blue">
            Close
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
