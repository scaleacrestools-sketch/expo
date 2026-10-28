"use client";

import { useState, type CSSProperties } from "react";
import { ndVideoTabs } from "@/content/nd";
import { Pic, Tag } from "@/components/nd/ui";
import { VideoDialog } from "@/components/nd/NdVideos";

/**
 * Creative studio library: every ScaleAcres short in its category (ad, social, AI), as the
 * homepage video cards. Nothing autoplays; a video opens in the homepage dialog when chosen.
 */
export function StudioLibrary() {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <>
      {ndVideoTabs.map((t, ti) => (
        <section key={t.id} id={t.id} className={`${ti % 2 ? "nd-white" : "nd-dark"} relative scroll-mt-20`} aria-label={t.label}>
          <div className="nd-wrap relative py-[clamp(4rem,8vw,7rem)]">
            <div className="nd-grid items-end gap-y-6">
              <div className="nd-cell lg:col-span-2">
                <div data-nd="up"><Tag>{`0${ti + 1} · ${t.label}`}</Tag></div>
                <h2 data-nd="up" className="mt-6 text-[clamp(2.2rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.05em]">{t.label}</h2>
              </div>
              <p className="nd-cell nd-muted" data-nd="up">
                {t.description}
                {t.ai ? <span className="ml-2 inline-block bg-[color:var(--sky)] px-2 py-0.5 text-[0.875rem] font-semibold text-[color:var(--ink)]">AI-generated</span> : null}
              </p>
            </div>
            <ul role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 gap-3 px-[clamp(0.75rem,1.2vw,1.25rem)] md:grid-cols-4">
              {t.videos.map((v, k) => (
                <li key={v.id} data-nd="clip" style={{ "--d": (k % 4) * 60 } as CSSProperties}>
                  <button
                    type="button"
                    onClick={() => setPlaying(v.id)}
                    className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[8px] bg-[color:var(--charcoal)] text-left ring-1 ring-black/5"
                    aria-label={`Play ${t.ai ? "AI video" : t.label.replace(/s$/, "")} ${k + 1}`}
                  >
                    <span className="nd-zoom absolute inset-0 block"><Pic image={v.poster} alt="" sizes="(min-width: 768px) 23vw, 46vw" imgClass="h-full w-full object-cover" /></span>
                    <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(11_13_13/0.85))]" />
                    <span aria-hidden="true" className="absolute left-3 top-3 text-[0.875rem] font-semibold tabular-nums text-white">{String(k + 1).padStart(2, "0")}</span>
                    {t.ai ? <span className="absolute right-3 top-3 bg-[color:var(--sky)] px-1.5 py-0.5 text-[0.8125rem] font-bold uppercase text-[color:var(--ink)]">AI</span> : null}
                    <span aria-hidden="true" className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center bg-white text-[color:var(--ink)] transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:bg-[color:var(--royal)] group-hover:text-white">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <VideoDialog id={playing} onClose={() => setPlaying(null)} />
    </>
  );
}
