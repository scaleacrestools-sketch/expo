"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { services, serviceHref, type Service } from "@/content/services";
import { clip, serviceClip } from "@/content/media";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { LazyVideo } from "@/components/media/LazyVideo";

/**
 * Section 03 — the eight services as an editorial 4 × 2 grid.
 * Selecting a service opens one detail panel (offerings, CTA and the service film):
 * below the grid on desktop, in place under the service on mobile.
 * Only the selected service's media is mounted, and it loads only when visible.
 */
export function ServicesShowcase() {
  const [active, setActive] = useState<string>(services[0].slug);
  const id = useId();
  const current = services.find((s) => s.slug === active) ?? services[0];

  return (
    <Reveal as="section" id="services" className="section-y bg-white text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-blue" data-reveal>Our expertise</p>
            <h2 className="h2 mt-6" data-split-reveal>
              What we do.
              <br />
              <span className="text-blue">What we deliver.</span>
            </h2>
          </div>
          <p className="text-[length:var(--fs-lead)] leading-[1.55] text-graphite lg:col-span-5" data-reveal>
            From the way your brand looks to the way it performs, we bring strategy, creativity, technology and marketing together.
          </p>
        </div>

        <ul className="mt-[clamp(3rem,5vw,4.5rem)] grid grid-cols-1 border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {services.map((s) => {
            const on = s.slug === active;
            return (
              <li key={s.slug} className={`group/svc relative border-b border-ink/12 transition-colors duration-500 sm:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0 ${on ? "bg-[#f6f8fd]" : ""}`}>
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`${id}-panel`}
                    onClick={() => setActive(s.slug)}
                    className="relative flex h-full w-full flex-col gap-6 px-1 py-7 text-left sm:px-6 sm:py-9 lg:min-h-[17.5rem] lg:px-8 lg:py-10"
                  >
                    {/* top rule grows on hover / stays for the selected service */}
                    <span aria-hidden="true" className={`absolute left-0 top-[-1px] h-[2px] origin-left transition-transform duration-700 ease-out-expo ${on ? "w-full scale-x-100" : "w-full scale-x-0 group-hover/svc:scale-x-100"}`} style={{ background: "var(--grad)" }} />
                    <span className="flex items-center justify-between gap-4">
                      <span className={`text-[0.75rem] font-semibold tabular-nums tracking-[0.2em] transition-colors duration-500 ${on ? "text-blue" : "text-steel"}`}>{s.number}<span className="text-ink/25"> / 08</span></span>
                      <span aria-hidden="true" className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-500 ease-out-expo ${on ? "rotate-45 border-blue bg-blue text-white" : "border-ink/15 text-ink group-hover/svc:border-blue group-hover/svc:text-blue"}`}>
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 6h10M6 1v10" /></svg>
                      </span>
                    </span>
                    <span className={`block text-[clamp(1.5rem,1rem+1.1vw,2.125rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.025em] transition-[color,transform] duration-500 ease-out-expo [text-wrap:balance] ${on ? "text-blue" : "text-ink group-hover/svc:translate-x-1 group-hover/svc:text-blue-deep"}`}>{s.title}</span>
                    <span className="mt-auto block max-w-[30ch] text-[0.975rem] leading-[1.55] text-graphite/80">{s.headline}</span>
                  </button>
                </h3>
                {/* Mobile / tablet: details open in place */}
                {on ? (
                  <div className="px-1 pb-10 sm:px-6 lg:hidden" role="region" aria-label={`${s.title} details`}>
                    <ServiceDetail service={s} compact />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        {/* Desktop: one detail panel below the grid */}
        <div id={`${id}-panel`} role="region" aria-live="polite" aria-label={`${current.title} details`} className="hidden border-b border-ink/12 py-14 lg:block">
          <ServiceDetail key={current.slug} service={current} />
        </div>
      </div>
    </Reveal>
  );
}

function ServiceDetail({ service: s, compact = false }: { service: Service; compact?: boolean }) {
  const media = serviceClip[s.slug] ? clip(serviceClip[s.slug]!) : undefined;
  return (
    <div className={`grid gap-8 animate-[fade-in_600ms_ease-out] ${compact ? "" : "grid-cols-12 items-stretch gap-12"}`}>
      <div className={`flex flex-col ${compact ? "" : "col-span-5 py-2"}`}>
        {!compact ? (
          <>
            <p className="label text-blue">{s.number} / 08 · Service</p>
            <p className="mt-4 text-[clamp(2rem,1rem+2vw,3.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">{s.title}</p>
          </>
        ) : null}
        <p className={`${compact ? "" : "mt-6 "}max-w-[52ch] text-[length:var(--fs-body)] leading-[1.7] text-graphite`}>{s.description}</p>
        <ul className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2" role="list" aria-label={`Included in ${s.title}`}>
          {s.included.map((item, i) => (
            <li key={item} className="flex items-baseline gap-4 border-t border-ink/15 py-4 text-[1.0625rem] font-medium text-ink">
              <span className="text-xs font-semibold tabular-nums text-blue">0{i + 1}</span>
              {item}
            </li>
          ))}
        </ul>
        <Link href={serviceHref(s)} className="group/l mt-auto inline-flex w-fit items-center gap-4 rounded-full bg-blue px-7 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-deep max-lg:mt-8">
          {s.ctaLabel}
          <Arrow className="transition-transform duration-300 group-hover/l:translate-x-0.5 group-hover/l:-translate-y-0.5" />
        </Link>
      </div>
      {media ? (
        <figure className={`m-0 ${compact ? "" : "col-span-7"}`}>
          <div className="relative overflow-hidden rounded-[14px] ring-1 ring-inset ring-black/5"><LazyVideo src={media.landscape} label={media.description} className="aspect-[16/10]" /></div>
          <figcaption className="mt-3 text-xs uppercase tracking-[0.14em] text-steel">ScaleAcres studio film — {media.title}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}
