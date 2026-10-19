"use client";

import { useId, useRef, useState } from "react";
import { studioShorts, type StudioShortTab } from "@/content/studio-shorts";

/**
 * Creative Studio: AI VIDEOS | SOCIAL MEDIA VIDEOS | AD VIDEOS with the real ScaleAcres shorts.
 * Each card shows the YouTube thumbnail; the player iframe is created only when a visitor
 * presses play, so the page stays light and nothing autoplays.
 */
export function StudioShorts() {
  const [active, setActive] = useState<StudioShortTab["id"]>(studioShorts[0].id);
  const [playing, setPlaying] = useState<string | null>(null);
  const tabsId = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = studioShorts.findIndex((t) => t.id === active);
    const next = e.key === "ArrowRight" ? (i + 1) % 3 : e.key === "ArrowLeft" ? (i + 2) % 3 : e.key === "Home" ? 0 : e.key === "End" ? 2 : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(studioShorts[next].id);
    refs.current[studioShorts[next].id]?.focus();
  };

  return (
    <section id="studio-work" className="on-dark section-y bg-ink text-white">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="border-b border-white/15">
          <div role="tablist" aria-label="Creative Studio categories" onKeyDown={onKeyDown} className="scrollbar-none -mb-px flex gap-8 overflow-x-auto md:gap-12">
            {studioShorts.map((t) => {
              const on = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => { refs.current[t.id] = el; }}
                  role="tab"
                  id={`${tabsId}-t-${t.id}`}
                  aria-selected={on}
                  aria-controls={`${tabsId}-p-${t.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => { setActive(t.id); setPlaying(null); }}
                  className={`relative shrink-0 whitespace-nowrap pb-5 pt-2 text-[clamp(1rem,0.8rem+0.9vw,1.75rem)] font-bold uppercase tracking-[0.04em] transition-colors ${on ? "text-white" : "text-white/40 hover:text-white"}`}
                >
                  {t.label}
                  <span className="ml-2 align-top text-xs font-semibold text-sky">{String(t.youtubeIds.length).padStart(2, "0")}</span>
                  <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-blue transition-transform duration-500 ease-out-expo ${on ? "scale-x-100" : "scale-x-0"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {studioShorts.map((t) => (
          <div key={t.id} role="tabpanel" id={`${tabsId}-p-${t.id}`} aria-labelledby={`${tabsId}-t-${t.id}`} hidden={t.id !== active} className="pt-10">
            <p className="max-w-[60ch] text-[length:var(--fs-body)] leading-[1.7] text-grey-soft">{t.description}</p>
            <ul role="list" className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {t.youtubeIds.map((id, i) => (
                <li key={id} className="relative aspect-[9/16] overflow-hidden rounded-[14px] bg-white/5">
                  {playing === id ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
                      title={`${t.label} ${i + 1}`}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <button type="button" onClick={() => setPlaying(id)} className="group absolute inset-0 text-left" aria-label={`Play ${t.label.toLowerCase().replace(/s$/, "")} ${i + 1}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://i.ytimg.com/vi/${id}/oardefault.jpg`} onError={(e) => { e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; }} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-[scale] duration-[1200ms] ease-out-expo group-hover:scale-[1.05]" />
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                      <span aria-hidden="true" className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-full bg-blue text-white transition-transform duration-500 group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                      </span>
                      <span aria-hidden="true" className="absolute right-4 top-4 text-[0.6875rem] font-semibold tabular-nums text-white/80">{String(i + 1).padStart(2, "0")}</span>
                    </button>
                  )}
                  <a href={`https://youtube.com/shorts/${id}`} target="_blank" rel="noopener noreferrer" className="sr-only">Watch {t.label.toLowerCase()} {i + 1} on YouTube</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
