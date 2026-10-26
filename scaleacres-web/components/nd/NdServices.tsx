"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ndServices, type ServiceMediaItem } from "@/content/nd";
import { ArrowUR, Pic, Plus, Rules, Tag, Words } from "@/components/nd/ui";

/**
 * 03 — Services. A sticky left column ("What we build.") beside the eight disciplines. Each one
 * shows one composed visual of its own genuine work, a short description, what's included and a
 * link to the service page. Frames open from the top as they arrive.
 */
export function NdServices() {
  return (
    <section id="services" className="nd-white relative border-t border-[color:var(--line-l)]" aria-labelledby="nd-services-title">
      <Rules />
      <div className="nd-wrap relative">
        <div className="nd-grid">
          {/* Sticky intro */}
          <div className="nd-cell lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:self-start lg:pb-10 lg:pt-28">
            <div className="pt-[clamp(4.5rem,10vw,9rem)] lg:pt-0">
              <Tag>Services</Tag>
              <Words id="nd-services-title" lines={["What", "we build."]} className="nd-d2 mt-7" />
              <p data-nd="up" className="nd-lead mt-6 max-w-[24rem]">Eight disciplines and one plan, so every part of a project works towards the same result: buyers who enquire.</p>
            </div>
            <div data-nd="up" className="mt-10 lg:mt-auto">
              <p className="nd-label">One team, end to end</p>
              <p className="nd-muted mt-1.5 max-w-[22rem] text-[1rem] leading-[1.5]">Brand, websites, media and technology, planned and delivered together.</p>
              <Link href="/contact-us/" className="nd-btn nd-btn--royal mt-5 w-full max-w-[20rem]">Discuss your project <Plus /></Link>
            </div>
          </div>

          {/* Services */}
          <ol className="lg:col-span-2" role="list">
            {ndServices.map((s, i) => (
              <li key={s.number} className={`py-[clamp(2.5rem,5vw,4rem)] ${i > 0 ? "border-t border-[color:var(--line-l)]" : "lg:pt-28"}`}>
                <article aria-labelledby={`nd-svc-${i}`} className="group">
                  <div className="nd-cell">
                    <p className="nd-label"><span className="text-[color:var(--royal)]">{s.number}.</span> <span className="nd-muted">/ {s.short}</span></p>
                    <h3 id={`nd-svc-${i}`} className="nd-d4 mt-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">{s.title}</h3>
                  </div>
                  <div className={`mt-6 grid gap-0 ${s.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {s.media.map((m, mi) => (
                      <div key={m.src} className="nd-cell">
                        <Frame m={m} wide={s.media.length === 1} delay={mi * 90} />
                      </div>
                    ))}
                  </div>
                  {s.note ? (
                    <p className="nd-cell mt-3 flex items-start gap-2 text-[0.9375rem] leading-[1.45] text-[color:var(--muted-l)]">
                      <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 bg-[color:var(--royal)]" />
                      {s.note}
                    </p>
                  ) : null}
                  <div className="mt-6 grid gap-y-5 md:grid-cols-2">
                    <div className="nd-cell" data-nd="up">
                      <p className="text-[1.0625rem] font-semibold text-[color:var(--royal)]">{s.headline}</p>
                      <p className="nd-body mt-2 max-w-[34rem]">{s.description}</p>
                    </div>
                    <div className="nd-cell flex flex-col gap-5" data-nd="up" style={{ "--d": 80 } as CSSProperties}>
                      <ul className="flex flex-wrap gap-1.5" role="list" aria-label="Included">
                        {s.tags.map((t) => <li key={t} className="nd-pill bg-[color:var(--ice)]">{t}</li>)}
                      </ul>
                      <Link href={s.href} className="nd-link nd-label w-fit">{s.cta} <ArrowUR className="h-3.5 w-3.5" /></Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Frame({ m, wide, delay }: { m: ServiceMediaItem; wide: boolean; delay: number }) {
  const sizes = wide ? "(min-width: 1024px) 62vw, 100vw" : "(min-width: 1024px) 30vw, 50vw";
  const show = m.show ?? "cover";
  return (
    <div data-nd="clip" style={{ "--d": delay } as CSSProperties} className={`nd-zoom nd-lift relative overflow-hidden bg-[color:var(--mist)] ${wide ? "aspect-[16/9]" : "aspect-[4/3]"} ${show === "cover" ? "shadow-[var(--sh-2)]" : "shadow-[var(--sh-1)]"}`}>
      {show === "cover" ? (
        <Pic image={m} alt={m.alt} sizes={sizes} imgClass="absolute inset-0 h-full w-full object-cover" />
      ) : show === "phone" ? (
        <div className="absolute inset-y-[7%] left-1/2 aspect-[9/16] -translate-x-1/2 overflow-hidden rounded-[clamp(10px,1.4vw,20px)] border-[3px] border-[color:var(--ink)] bg-[color:var(--ink)] shadow-[var(--sh-3)]">
          <Pic image={m} alt={m.alt} sizes="(min-width: 1024px) 12vw, 25vw" imgClass="h-full w-full object-cover object-top" />
        </div>
      ) : (
        <div className="absolute inset-y-[7%] left-1/2 -translate-x-1/2 overflow-hidden bg-white shadow-[var(--sh-3)]" style={{ aspectRatio: `${m.w} / ${m.h}` }}>
          <Pic image={m} alt={m.alt} sizes="(min-width: 1024px) 14vw, 30vw" imgClass="h-full w-full object-cover" />
        </div>
      )}
      {m.tag ? <span className="absolute left-3 top-3 bg-white px-2.5 py-1 shadow-[var(--sh-1)] text-[0.875rem] font-semibold text-[color:var(--ink)]">{m.tag}</span> : null}
    </div>
  );
}
