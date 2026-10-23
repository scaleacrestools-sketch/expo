"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { studioReel, videoTabs, type VideoTab } from "@/content/home";
import { ensureGsap, prefersReducedMotion, useGsap } from "@/lib/motion";
import { VideoModal } from "@/components/VideoModal";
import type { StudioVideo } from "@/content/studio";
import { InViewVideo, Kicker, MaskLines } from "@/components/home/fx";

const REEL: StudioVideo = {
  id: "studio-reel",
  title: studioReel.title,
  category: "Concept film · AI-generated",
  src: studioReel.src,
  description: studioReel.caption,
};

/**
 * 06 — Real Estate Videos That Drive Growth. One large landscape reel (muted preview that
 * opens from a clipped frame as it scrolls in; a play control follows the cursor and opens the
 * full film with sound). Below, the three categories published on scaleacres.com with
 * portrait covers; a video plays only when chosen, one at a time, in a dialog.
 */
export function VideoStudio() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [tab, setTab] = useState<VideoTab["id"]>("ad-videos");
  const [reelOpen, setReelOpen] = useState(false);
  const [short, setShort] = useState<string | null>(null);
  const current = videoTabs.find((t) => t.id === tab) ?? videoTabs[0];
  const order: VideoTab["id"][] = ["ad-videos", "social-media-videos", "ai-videos"];
  const tabs = order.map((id) => videoTabs.find((t) => t.id === id)!).filter(Boolean);

  useGsap(ref, ({ gsap, el }) => {
    const frame = el.querySelector("[data-reel]");
    if (frame) gsap.fromTo(frame, { clipPath: "inset(9% 14% 9% 14% round 32px)" }, { clipPath: "inset(0% 0% 0% 0% round 22px)", ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "center center", scrub: true } });
    const vid = el.querySelector("[data-reel] video");
    if (vid) gsap.fromTo(vid, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Play control follows the pointer inside the reel (fine pointers only).
  useEffect(() => {
    const stage = stageRef.current;
    const c = cursorRef.current;
    if (!stage || !c || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const gsap = ensureGsap();
    const xTo = gsap.quickTo(c, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(c, "y", { duration: 0.7, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      xTo(e.clientX - r.left - r.width / 2);
      yTo(e.clientY - r.top - r.height / 2);
    };
    const leave = () => { xTo(0); yTo(0); };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);
    return () => { stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerleave", leave); };
  }, []);

  const closeReel = useCallback(() => setReelOpen(false), []);

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
              className="mt-6 text-[clamp(3rem,12.5vw,6rem)] font-semibold leading-[0.88] tracking-[-0.055em] lg:text-[clamp(5rem,8.4vw,11.5rem)]"
              lineClassName={["", "lg:pl-[9vw]"]}
            />
          </div>
          <p className="text-[clamp(1.25rem,1rem+0.8vw,2rem)] font-medium leading-[1.3] tracking-[-0.01em] text-white lg:col-span-4 lg:pb-4">
            We turn real estate stories into videos that attract attention and drive growth.
          </p>
        </div>
      </div>

      {/* Reel */}
      <div className="container-x mx-auto mt-[clamp(3rem,6vw,5.5rem)] max-w-[120rem]">
        <button
          ref={stageRef}
          type="button"
          onClick={() => setReelOpen(true)}
          className="group relative block w-full cursor-pointer text-left"
          aria-label="Play the ScaleAcres studio reel with sound"
        >
          <div data-reel className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink-soft sm:aspect-[16/9]">
            <InViewVideo src={studioReel.src} poster={studioReel.poster} className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(var(--ink-rgb)/0.75))]" />
            <span className="absolute inset-0 grid place-items-center">
              <span ref={cursorRef} className="grid h-28 w-28 place-items-center rounded-full bg-white text-ink transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-blue group-hover:text-white md:h-36 md:w-36">
                <span className="flex flex-col items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
                  Play reel
                </span>
              </span>
            </span>
            <span className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3 md:bottom-7 md:left-8 md:right-8">
              <span>
                <span className="block text-[clamp(1.25rem,1rem+0.9vw,2rem)] font-semibold tracking-[-0.02em]">{studioReel.title}</span>
                <span className="mt-1 block text-[0.8125rem] text-white/70">{studioReel.caption}</span>
              </span>
              <span className="rounded-full border border-white/30 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/80">Sound on</span>
            </span>
          </div>
        </button>
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
                  className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-[0.8125rem] font-semibold transition-colors duration-300 md:px-6 ${on ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="max-w-[56ch] text-[0.9375rem] leading-[1.6] text-grey lg:text-right">{current.description}</p>
        </div>

        <Rail key={tab} tab={current} onPlay={setShort} />
      </div>

      <VideoModal video={reelOpen ? REEL : null} onClose={closeReel} />
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
          <li key={s.id} className="vs-card shrink-0 snap-start" style={{ animationDelay: `${i * 70}ms` }}>
            <button type="button" onClick={() => onPlay(s.id)} className="group relative block w-[64vw] overflow-hidden rounded-[18px] bg-ink-soft text-left sm:w-[15rem] lg:w-[16.5rem]" aria-label={`Play ${tab.label.replace(/s$/, "")} ${i + 1}`}>
              <span className="relative block aspect-[9/16]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.07]" />
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgb(var(--ink-rgb)/0.85))] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span aria-hidden="true" className="absolute left-4 top-4 rounded-full bg-ink/60 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink transition-[transform,background-color,color] duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-blue group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <Link href="/creative-studio/" className="link-u text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white">Visit the creative studio</Link>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button key={d} type="button" onClick={() => scroll(d)} aria-label={d < 0 ? "Previous videos" : "Next videos"} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-blue hover:bg-blue">
              <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-4 w-4 ${d < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .js .vs-card { animation: vs-in 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes vs-in { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
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
          <button type="button" onClick={onClose} className="absolute -top-14 right-0 rounded-full border border-white/25 px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white hover:border-blue hover:bg-blue">
            Close
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
