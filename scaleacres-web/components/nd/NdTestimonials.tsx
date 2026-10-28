"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ndStories, type ClientStory } from "@/content/nd";
import { Pic, Plus, Tag, Words } from "@/components/nd/ui";

/**
 * 07 — Client success stories. The four genuine client video testimonials from scaleacres.com on a
 * white ground: large square thumbnails (Wistia's own stills) that unmask in a stagger, with the
 * company, the person where the video names them, and the result line shown on screen in the video.
 * Nothing plays until a visitor picks a story; it then opens in a modal player with native controls
 * (Escape, the close button or a click outside closes it and stops playback, focus returns to the card).
 * Four across from 1280 px, two across on tablets, a swipeable row on phones.
 */
export function NdTestimonials() {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<ClientStory | null>(null);

  const open = (s: ClientStory, btn: HTMLButtonElement) => {
    opener.current = btn;
    setActive(s);
  };
  const close = useCallback(() => dialog.current?.close(), []);

  useEffect(() => {
    const d = dialog.current;
    if (!active || !d) return;
    if (!d.open) d.showModal();
    document.documentElement.style.overflow = "hidden";
    video.current?.play().catch(() => undefined);
  }, [active]);

  const onClose = () => {
    video.current?.pause();
    document.documentElement.style.overflow = "";
    setActive(null);
    opener.current?.focus();
  };

  return (
    <section id="testimonials" className="nd-white relative overflow-x-clip border-t border-[color:var(--line-l)]" aria-labelledby="nd-stories-title">
      <div className="nd-wrap relative py-[clamp(4.5rem,9vw,8rem)]">
        <div className="nd-grid items-end gap-y-8">
          <div className="nd-cell lg:col-span-2">
            <div data-nd="up"><Tag>Success stories</Tag></div>
            <Words
              id="nd-stories-title"
              lines={["Our Client", "Success Stories"]}
              accent={["Success", "Stories"]}
              lineClass={["", "lg:pl-[1.1em]"]}
              delay={100}
              className="mt-7 text-[clamp(2.4rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]"
            />
          </div>
          <div className="nd-cell lg:pb-3" data-nd="up" style={{ "--d": 160 } as CSSProperties}>
            <p className="nd-lead max-w-[26rem]">Our proven strategies empower clients to achieve remarkable growth, increased visibility, and a strong market presence effortlessly.</p>
            <p className="nd-label nd-muted mt-5">Four clients, in their own words</p>
          </div>
        </div>

        <ul
          role="list"
          aria-label="Client video testimonials"
          className="-mx-[var(--m)] mt-[clamp(3rem,6vw,5rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--m)] px-[var(--m)] pb-4 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-x-[clamp(1rem,2vw,1.75rem)] md:gap-y-12 md:overflow-visible md:px-[clamp(0.75rem,1.2vw,1.25rem)] md:pb-0 xl:grid-cols-4"
        >
          {ndStories.map((s, i) => (
            <li key={s.id} className="w-[min(78vw,22rem)] shrink-0 snap-start md:w-auto">
              <StoryCard s={s} delay={(i % 4) * 90} onOpen={open} />
            </li>
          ))}
        </ul>
        <p className="nd-label nd-muted mt-4 md:hidden" aria-hidden="true">Swipe for more stories →</p>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="nd-story-title"
        onClose={onClose}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="nd-dialog nd-dialog--video"
      >
        {active ? (
          <div className="bg-[color:var(--ink)] text-white">
            <video
              key={active.id}
              ref={video}
              poster={active.poster.src}
              controls
              playsInline
              preload="metadata"
              className="block aspect-square max-h-[min(78dvh,44rem)] w-full bg-black object-contain"
            >
              <source src={`${active.video}.webm`} type="video/webm" />
              <source src={`${active.video}.mp4`} type="video/mp4" />
            </video>
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="nd-label text-[color:var(--sky)]">Client story · {active.duration}</p>
                <p id="nd-story-title" className="mt-1 truncate text-[1.125rem] font-semibold tracking-[-0.01em]">
                  {active.person ? `${active.person}, ` : ""}{active.company}
                </p>
              </div>
              <button type="button" onClick={close} aria-label="Close video" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 transition-colors hover:border-[color:var(--royal)] hover:bg-[color:var(--royal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--sky)]">
                <Plus className="h-3.5 w-3.5 rotate-45" />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}

function StoryCard({ s, delay, onOpen }: { s: ClientStory; delay: number; onOpen: (s: ClientStory, b: HTMLButtonElement) => void }) {
  const who = `${s.person ? `${s.person}, ` : ""}${s.company}`;
  return (
    <button type="button" aria-haspopup="dialog" onClick={(e) => onOpen(s, e.currentTarget)} className="group block w-full text-left focus-visible:outline-none">
      <div data-nd="clip" style={{ "--d": delay } as CSSProperties} className="nd-zoom relative aspect-square overflow-hidden rounded-[16px] bg-[color:var(--mist)] shadow-[var(--sh-2)] transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[var(--sh-3)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[color:var(--royal)]">
        <div className="nd-settle absolute inset-0">
          <Pic image={s.poster} alt="" sizes="(min-width: 1280px) 23vw, (min-width: 768px) 46vw, 78vw" imgClass="absolute inset-0 h-full w-full object-cover" />
        </div>
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(11_13_13/0.42))] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[color:var(--ink)] shadow-[0_10px_30px_-8px_rgb(11_13_13/0.55)] backdrop-blur-sm transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:bg-[color:var(--royal)] group-hover:text-white">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
        </span>
        <span aria-hidden="true" className="absolute bottom-3 left-3 rounded-full bg-[rgb(11_13_13/0.72)] px-3 py-1 text-[0.8125rem] font-semibold tabular-nums text-white backdrop-blur-md">{s.duration}</span>
      </div>
      <div data-nd="up" style={{ "--d": delay + 120 } as CSSProperties} className="mt-4 md:mt-5">
        <h3 className="text-[clamp(1.125rem,0.95rem+0.5vw,1.375rem)] font-semibold leading-tight tracking-[-0.025em] text-[color:var(--ink)]">{s.company}</h3>
        {s.person ?? s.sector ? <p className="mt-1 text-[0.9375rem] text-[color:var(--muted-l)]">{s.person ?? s.sector}</p> : null}
        {s.onScreen ? <p className="mt-3 border-t border-[color:var(--line-l)] pt-3 text-[0.875rem] font-medium leading-snug text-[color:var(--ink)]">{s.onScreen}</p> : null}
      </div>
      <span className="sr-only">: play the video testimonial from {who} ({s.duration})</span>
    </button>
  );
}
