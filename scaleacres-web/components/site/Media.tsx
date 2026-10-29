"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUR } from "@/components/nd/ui";

/**
 * Genuine ScaleAcres videos (YouTube Shorts and Vimeo, as published on scaleacres.com) shown as
 * poster tiles. Nothing loads from the video host until a visitor presses play; the player then
 * opens in a dialog, one video at a time.
 */
export type Clip = { host: "youtube" | "vimeo"; id: string; hash?: string; poster: string; title: string; ratio: "9/16" | "1/1" };

const src = (c: Clip) =>
  c.host === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${c.id}?autoplay=1&playsinline=1&rel=0`
    : `https://player.vimeo.com/video/${c.id}?${c.hash ? `h=${c.hash}&` : ""}autoplay=1&title=0&byline=0&portrait=0`;

export function VideoTiles({ clips, dark = false, cols = 4 }: { clips: Clip[]; dark?: boolean; cols?: 2 | 3 | 4 }) {
  const [open, setOpen] = useState<Clip | null>(null);
  return (
    <>
      <ul role="list" className={`grid grid-cols-2 items-start gap-[clamp(0.6rem,1.4vw,1.25rem)] px-[clamp(0.75rem,1.2vw,1.25rem)] ${cols === 4 ? "lg:grid-cols-4" : cols === 3 ? "md:grid-cols-3" : "max-w-[46rem]"}`}>
        {clips.map((c, i) => (
          <li key={c.id} data-nd="clip" style={{ "--d": (i % cols) * 70 } as CSSProperties}>
            <button
              type="button"
              onClick={() => setOpen(c)}
              aria-label={`Play video: ${c.title}`}
              className={`group relative block w-full overflow-hidden rounded-[10px] text-left ${c.ratio === "1/1" ? "aspect-square" : "aspect-[9/16]"} ${dark ? "bg-[color:var(--charcoal)] ring-1 ring-white/10" : "bg-[color:var(--mist)] shadow-[var(--sh-1)]"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
              <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgb(11_13_13/0.82))]" />
              <span aria-hidden="true" className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center rounded-full bg-white text-[color:var(--ink)] transition-[transform,background-color,color] duration-500 group-hover:scale-110 group-hover:bg-[color:var(--royal)] group-hover:text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
              </span>
              <span className="absolute bottom-4 left-[4.25rem] right-3 truncate text-[1rem] font-semibold text-white">{c.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <ClipDialog clip={open} onClose={() => setOpen(null)} />
    </>
  );
}

function ClipDialog({ clip, onClose }: { clip: Clip | null; onClose: () => void }) {
  const d = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = d.current;
    if (!el) return;
    if (clip && !el.open) el.showModal();
    if (!clip && el.open) el.close();
  }, [clip]);
  useEffect(() => {
    const el = d.current;
    if (!el) return;
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [onClose]);
  return (
    <dialog ref={d} aria-label={clip?.title ?? "Video"} onClick={(e) => { if (e.target === d.current) onClose(); }} className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[rgb(11_13_13/0.9)] backdrop:backdrop-blur-sm">
      {clip ? (
        <div className="relative">
          <div className={`overflow-hidden rounded-[8px] bg-black ${clip.ratio === "1/1" ? "aspect-square h-[min(80svh,44rem)] max-w-[92vw]" : "aspect-[9/16] h-[min(82svh,48rem)]"}`}>
            <iframe src={src(clip)} title={clip.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full" />
          </div>
          <button type="button" onClick={onClose} className="nd-btn nd-btn--white absolute -top-14 right-0 min-h-11">Close</button>
        </div>
      ) : null}
    </dialog>
  );
}

/**
 * The studio on Google Maps. A captured map of the exact listing shows first (with Google's
 * attribution), and the interactive map replaces it when asked for, so the page never shows an
 * empty frame while the embed loads (or where it is blocked).
 */
export function MapEmbed({ embed, title, link }: { embed: string; title: string; link: string }) {
  const [live, setLive] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#e8eaed] shadow-[var(--sh-2)] ring-1 ring-[color:var(--line-l)] sm:aspect-[16/8] lg:aspect-[21/9]">
      {live ? (
        <iframe src={embed} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/ext/map.webp" alt={`Map: ${title}`} width={1600} height={760} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_45%]" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => setLive(true)} className="nd-btn nd-btn--ink min-h-12">Load interactive map <ArrowUR /></button>
            <a href={link} target="_blank" rel="noopener noreferrer" className="nd-btn nd-btn--white min-h-12 shadow-[var(--sh-1)]">Directions in Google Maps <ArrowUR /></a>
          </div>
        </>
      )}
    </div>
  );
}
