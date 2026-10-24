"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ndVideoTabs } from "@/content/nd";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Pic, Rules, Tag, Words } from "@/components/nd/ui";

const PER_TAB = 6;

/**
 * 05 — Real estate videos that drive growth. Ad, social and AI videos from the ScaleAcres
 * YouTube channel, two per column so the grid holds; the middle column drifts against the
 * scroll. Nothing autoplays: a video plays only when chosen, in a dialog, one at a time.
 */
export function NdVideos() {
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const t = ndVideoTabs[tab];
  const vids = t.videos.slice(0, PER_TAB);

  useGsap(ref, ({ gsap, el }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const mid = el.querySelector("[data-col='1']");
      if (mid) gsap.fromTo(mid, { yPercent: 8 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: el.querySelector("[data-reel]"), start: "top bottom", end: "bottom top", scrub: 0.3 } });
    });
  });

  return (
    <section ref={ref} id="videos" className="nd-white relative" aria-labelledby="nd-vid-title">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-grid">
          <div className="nd-cell">
            <Tag>Video production</Tag>
            <p data-nd="up" className="nd-lead nd-muted mt-5 max-w-[24rem]">We turn real estate stories into videos that attract attention and drive growth.</p>
          </div>
          <div className="nd-cell lg:col-span-2 max-lg:mt-6">
            <Words id="nd-vid-title" lines={["Real estate videos", "that drive growth."]} accent={["growth."]} className="nd-d2" />
          </div>
        </div>

        <div className="nd-grid mt-[clamp(2.5rem,5vw,4rem)] items-end gap-y-5">
          <div className="nd-cell">
            <div role="tablist" aria-label="Video categories" className="grid grid-cols-3 border border-[color:var(--line-l)]">
              {ndVideoTabs.map((x, i) => (
                <button
                  key={x.id}
                  role="tab"
                  type="button"
                  aria-selected={i === tab}
                  aria-controls="nd-reel"
                  onClick={() => setTab(i)}
                  className={`min-h-12 px-2 text-[0.875rem] font-semibold uppercase leading-tight transition-colors duration-300 ${i === tab ? "bg-[color:var(--ink)] text-white" : "text-[color:var(--muted-l)] hover:bg-[color:var(--ice)] hover:text-[color:var(--ink)]"}`}
                >
                  {x.label.replace(" Videos", "")}
                </button>
              ))}
            </div>
          </div>
          <p className="nd-cell nd-body nd-muted lg:col-span-2" aria-live="polite">
            {t.description}
            {t.ai ? <span className="ml-2 inline-block bg-[color:var(--sky)] px-2 py-0.5 text-[0.875rem] font-semibold text-[color:var(--ink)]">AI-generated</span> : null}
          </p>
        </div>

        <div data-reel id="nd-reel" role="tabpanel" aria-label={t.label} className="nd-grid mt-8 gap-y-3">
          {[0, 1, 2].map((col) => (
            <div key={col} data-col={col} className={`nd-cell grid grid-cols-2 gap-3 ${col === 2 ? "md:max-lg:hidden" : ""}`}>
              {vids.slice(col * 2, col * 2 + 2).map((v, k) => (
                <button
                  key={`${t.id}-${v.id}`}
                  type="button"
                  onClick={() => setPlaying(v.id)}
                  className="nd-vcard nd-lift group relative block aspect-[9/16] overflow-hidden bg-[color:var(--ink)] text-left shadow-[var(--sh-2)]"
                  style={{ "--k": col * 2 + k } as CSSProperties}
                  aria-label={`Play ${t.ai ? "AI video" : t.label.replace(/s$/, "")} ${col * 2 + k + 1}`}
                >
                  <span className="nd-zoom absolute inset-0 block">
                    <Pic image={v.poster} alt="" sizes="(min-width: 1024px) 16vw, 45vw" imgClass="h-full w-full object-cover" />
                  </span>
                  <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(11_13_13/0.85))]" />
                  <span aria-hidden="true" className="absolute left-3 top-3 text-[0.875rem] font-semibold tabular-nums text-white">{String(col * 2 + k + 1).padStart(2, "0")}</span>
                  {t.ai ? <span className="absolute right-3 top-3 bg-[color:var(--sky)] px-1.5 py-0.5 text-[0.8125rem] font-bold uppercase text-[color:var(--ink)]">AI</span> : null}
                  <span aria-hidden="true" className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center bg-white text-[color:var(--ink)] transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:bg-[color:var(--royal)] group-hover:text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="nd-grid mt-8">
          <p className="nd-cell nd-label nd-muted">Videos produced by ScaleAcres · published on the ScaleAcres YouTube channel</p>
          <div className="nd-cell lg:col-start-3 lg:text-right max-md:mt-4">
            <Link href="/creative-studio/" className="nd-link nd-label">Visit the creative studio <ArrowUR className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </div>

      <VideoDialog id={playing} onClose={() => setPlaying(null)} />

      <style>{`
        .js .nd-vcard { animation: nd-v 0.55s cubic-bezier(0.16,1,0.3,1) both; animation-delay: calc(var(--k) * 45ms); }
        @keyframes nd-v { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .js .nd-vcard { animation: none; } }
      `}</style>
    </section>
  );
}

/** YouTube player in a dialog; the iframe exists only while open. */
export function VideoDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
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
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [onClose]);
  return (
    <dialog ref={d} aria-label="Video" onClick={(e) => { if (e.target === d.current) onClose(); }} className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[rgb(11_13_13/0.9)] backdrop:backdrop-blur-sm">
      {id ? (
        <div className="relative">
          <div className="aspect-[9/16] h-[min(82svh,48rem)] overflow-hidden bg-black">
            <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`} title="ScaleAcres video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full" />
          </div>
          <button type="button" onClick={onClose} className="nd-btn nd-btn--white absolute -top-14 right-0 min-h-11">Close</button>
        </div>
      ) : null}
    </dialog>
  );
}
