"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { clientLogos, clientSprite, testimonials, type Testimonial } from "@/content/assets";
import { Plus, Rules, Tag, Words } from "@/components/nd/ui";

/**
 * 09 — Clients and testimonials. The four client video testimonials published on
 * scaleacres.com (one large, the others selectable), then the client logo wall. Videos play
 * only when chosen, in a dialog. No quotes are invented: the clients speak in their videos.
 */
export function NdClients() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState<Testimonial | null>(null);
  const t = testimonials[i];

  return (
    <section id="clients" className="nd-white relative" aria-labelledby="nd-clients-title">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-grid gap-y-10">
          <div className="nd-cell">
            <Tag>Client stories</Tag>
            <Words id="nd-clients-title" lines={["True", "stories."]} className="nd-d2 mt-7" />
            <p data-nd="up" className="nd-lead mt-6 max-w-[24rem]">Clients describe working with ScaleAcres, in their own words, on video.</p>
          </div>

          <div className="lg:col-span-2 md:col-span-1 grid md:grid-cols-2">
            <div className="nd-cell">
              <button type="button" onClick={() => setPlaying(t)} className="nd-lift group relative block aspect-square w-full overflow-hidden bg-[color:var(--mist)] text-left shadow-[var(--sh-2)]" aria-label={`Play testimonial from ${t.company}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={t.id} src={t.poster} alt="" width={900} height={900} loading="lazy" decoding="async" className="nd-tfade h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                <span className="absolute bottom-4 left-4 flex h-12 items-center gap-3 bg-white pl-4 pr-3 text-[0.875rem] font-semibold uppercase text-[color:var(--ink)] transition-colors group-hover:bg-[color:var(--royal)] group-hover:text-white">
                  Watch the story
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
                </span>
                <span className="absolute right-4 top-4 bg-[color:var(--ink)] px-2.5 py-1 text-[0.875rem] font-semibold tabular-nums text-white">{t.duration}</span>
              </button>
            </div>
            <div className="nd-cell flex flex-col justify-between gap-8 max-md:mt-6">
              <div aria-live="polite">
                <p className="nd-label text-[color:var(--royal)]">Video testimonial · {String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</p>
                <p key={t.id} className="nd-tfade mt-4 text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.company}</p>
                <p className="nd-lead nd-muted mt-3">{[t.person, t.sector].filter(Boolean).join(" · ") || "Client"}</p>
              </div>
              <ul className="grid grid-cols-4 gap-2" role="list" aria-label="Choose a testimonial">
                {testimonials.map((x, k) => (
                  <li key={x.id}>
                    <button type="button" onClick={() => setI(k)} aria-pressed={k === i} aria-label={`Show ${x.company}`} className={`relative block aspect-square w-full overflow-hidden shadow-[var(--sh-1)] outline-offset-2 transition-opacity ${k === i ? "ring-2 ring-[color:var(--royal)]" : "opacity-60 hover:opacity-100"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={x.poster} alt="" width={900} height={900} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="nd-grid mt-[clamp(4rem,8vw,7rem)] gap-y-8">
          <div className="nd-cell">
            <p className="nd-label">Brands that trust our work</p>
            <p className="nd-body nd-muted mt-3 max-w-[22rem]">Real estate developers and brands we&apos;ve worked with. Logos as published on scaleacres.com; trademarks belong to their owners.</p>
          </div>
          <ul className="grid grid-cols-2 border-l border-t border-[color:var(--line-l)] sm:grid-cols-4 lg:col-span-2" role="list" aria-label="Clients">
            {clientLogos.map((c, k) => {
              const col = c.i % clientSprite.cols;
              const row = Math.floor(c.i / clientSprite.cols);
              return (
                <li key={c.name} data-nd="fade" style={{ "--d": (k % 4) * 60 } as CSSProperties} className="aspect-[2/1] border-b border-r border-[color:var(--line-l)] p-[14%] text-[color:var(--muted-l)] transition-colors duration-300 hover:text-[color:var(--royal)]">
                  <span role="img" aria-label={c.name} className="nd-logo" style={{ "--sprite": `url(${clientSprite.src})`, "--mask-size": `${clientSprite.cols * 100}% ${clientSprite.rows * 100}%`, "--mask-pos": `${(col / (clientSprite.cols - 1)) * 100}% ${(row / (clientSprite.rows - 1)) * 100}%` } as CSSProperties} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <TestimonialDialog t={playing} onClose={() => setPlaying(null)} />
      <style>{`
        .nd-tfade { animation: nd-tf 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes nd-tf { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .nd-tfade { animation: none; } }
      `}</style>
    </section>
  );
}

function TestimonialDialog({ t, onClose }: { t: Testimonial | null; onClose: () => void }) {
  const d = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = d.current;
    if (!el) return;
    if (t && !el.open) el.showModal();
    if (!t && el.open) el.close();
  }, [t]);
  useEffect(() => {
    const el = d.current;
    if (!el) return;
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [onClose]);
  return (
    <dialog ref={d} aria-label={t ? `Testimonial from ${t.company}` : "Testimonial"} onClick={(e) => { if (e.target === d.current) onClose(); }} className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[rgb(11_13_13/0.9)] backdrop:backdrop-blur-sm">
      {t ? (
        <div className="relative">
          <video key={t.id} src={t.src} poster={t.poster} controls autoPlay playsInline preload="metadata" className="aspect-square max-h-[78svh] w-[min(78svh,92vw)] bg-black" />
          <button type="button" onClick={onClose} className="nd-btn nd-btn--white absolute -top-14 right-0 min-h-11">Close <Plus className="rotate-45" /></button>
        </div>
      ) : null}
    </dialog>
  );
}
