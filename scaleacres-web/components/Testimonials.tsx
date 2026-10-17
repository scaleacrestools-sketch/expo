"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials, type Testimonial } from "@/content/assets";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Section 07 — client video testimonials. The four videos published on scaleacres.com.
 * Nothing autoplays: a video loads only when its Play button is pressed, opens in a modal
 * dialog (Escape or Close stops it) and only that one video plays. Names appear only where
 * the client names themselves on screen.
 */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState<Testimonial | null>(null);
  const n = testimonials.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  const t = testimonials[i];

  return (
    <Reveal as="section" id="testimonials" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-blue" data-reveal>Client stories</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Trusted by clients.
              <br />
              <span className="text-blue">Backed by real experiences.</span>
            </h2>
          </div>
          <Controls i={i} n={n} go={go} />
        </div>

        <div
          className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-14"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client video testimonials"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          data-reveal
        >
          {/* Active story */}
          <div className="lg:col-span-6 xl:col-span-5" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}: ${t.company}`}>
            <button
              type="button"
              onClick={() => setPlaying(t)}
              className="group relative block aspect-square w-full overflow-hidden rounded-[14px] bg-ink text-left"
              aria-label={`Play video testimonial from ${t.person ? `${t.person}, ` : ""}${t.company} (${t.duration})`}
              data-testimonial-play
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={t.id} src={t.poster} alt="" width={900} height={900} loading="lazy" decoding="async" className="h-full w-full animate-[fade-in_500ms_ease-out] object-cover transition-[scale] duration-[1200ms] ease-out-expo group-hover:scale-[1.03]" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue text-on-accent shadow-[0_10px_40px_rgba(29,78,216,0.45)] transition-transform duration-500 group-hover:scale-110 md:h-24 md:w-24">
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
              <span className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1.5 text-[0.6875rem] font-semibold tabular-nums tracking-[0.1em] text-white backdrop-blur-sm">{t.duration}</span>
            </button>
          </div>

          {/* Details + other stories */}
          <div className="flex flex-col justify-between gap-10 lg:col-span-6 xl:col-span-7">
            <div aria-live="polite">
              <p className="label text-steel">Video testimonial · {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-5 text-[clamp(2rem,1rem+2.6vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.035em]">{t.company}</p>
              {t.person || t.sector ? (
                <p className="mt-4 text-[length:var(--fs-lead)] leading-snug text-graphite">
                  {t.person ? <span className="font-semibold text-ink">{t.person}</span> : null}
                  {t.person && t.sector ? " · " : null}
                  {t.sector}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => setPlaying(t)}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-blue px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-on-accent transition-colors hover:bg-blue-deep"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                Watch the story
              </button>
            </div>

            <ul className="grid grid-cols-4 gap-3 md:gap-4" role="list" aria-label="Choose a testimonial">
              {testimonials.map((s, k) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setI(k)}
                    aria-label={`Show ${s.company}`}
                    aria-current={k === i ? "true" : undefined}
                    className={`relative block aspect-square w-full overflow-hidden rounded-[10px] ring-offset-2 ring-offset-offwhite transition-[opacity,box-shadow] duration-300 ${k === i ? "opacity-100 ring-2 ring-blue" : "opacity-55 hover:opacity-90"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.poster} alt="" width={900} height={900} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-[0.8125rem] text-steel" data-reveal>Client videos as published on scaleacres.com. Figures shown on screen are the clients&apos; own statements.</p>
      </div>

      <TestimonialPlayer video={playing} onClose={() => setPlaying(null)} />
    </Reveal>
  );
}

function Controls({ i, n, go }: { i: number; n: number; go: (d: number) => void }) {
  const btn = "grid h-14 w-14 place-items-center rounded-full border border-ink/20 transition-colors hover:border-blue hover:bg-blue hover:text-on-accent";
  return (
    <div className="flex items-center gap-5" data-reveal>
      <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-steel" aria-hidden="true">
        <span className="text-ink">{String(i + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
      </span>
      <span aria-hidden="true" className="relative hidden h-px w-24 bg-ink/15 sm:block">
        <span className="absolute inset-y-0 left-0 bg-blue transition-[width] duration-500" style={{ width: `${((i + 1) / n) * 100}%` }} />
      </span>
      <button type="button" className={btn} onClick={() => go(-1)} aria-label="Previous testimonial">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" className={btn} onClick={() => go(1)} aria-label="Next testimonial">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

/** Modal player: native controls, plays only after the visitor presses Play, Escape closes and stops it. */
function TestimonialPlayer({ video, onClose }: { video: Testimonial | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (video) {
      if (!d.open) d.showModal();
      vid.current?.play().catch(() => undefined);
    } else if (d.open) {
      d.close();
    }
  }, [video]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const stop = () => {
      vid.current?.pause();
      onClose();
    };
    d.addEventListener("close", stop);
    return () => d.removeEventListener("close", stop);
  }, [onClose]);

  return (
    <dialog
      ref={dialog}
      aria-label={video ? `Video testimonial: ${video.company}` : "Video testimonial"}
      onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
      className="m-auto w-[min(92vw,44rem)] max-w-none overflow-hidden rounded-[14px] border border-white/15 bg-ink p-0 text-white backdrop:bg-ink/90 backdrop:backdrop-blur-sm"
    >
      {video ? (
        <div>
          <video key={video.id} ref={vid} src={video.src} poster={video.poster} controls playsInline preload="metadata" className="aspect-square max-h-[76vh] w-full bg-black" />
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="label text-sky">Client story</p>
              <p className="mt-1 truncate text-lg font-semibold">{video.person ? `${video.person}, ` : ""}{video.company}</p>
            </div>
            <button type="button" onClick={() => dialog.current?.close()} className="rounded-full border border-white/25 px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-sky hover:bg-sky hover:text-ink">
              Close
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
