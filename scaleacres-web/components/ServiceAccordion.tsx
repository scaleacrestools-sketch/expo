"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { services, serviceHref, type Service } from "@/content/services";
import { clip, serviceClip } from "@/content/media";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { LazyVideo } from "@/components/media/LazyVideo";
import { useGsap } from "@/lib/motion";

export function ServiceAccordion({ defaultOpen = services[0].slug }: { defaultOpen?: string | null }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();

  useGsap(listRef, ({ gsap, el }) => {
    gsap.fromTo(
      el.querySelectorAll("[data-row]"),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.06, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 82%", once: true } },
    );
  });

  return (
    <Reveal as="section" id="services" className="section-y bg-ink text-white">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-blue" data-reveal>Our expertise / What we do</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Big ideas.
              <br />
              Built into <span className="text-blue">action.</span>
            </h2>
          </div>
          <p className="lead text-grey-soft lg:col-span-4" data-reveal>
            From the way a brand looks to the way it performs, we combine creative thinking, technology and marketing to make every interaction matter.
          </p>
        </div>

        <ul ref={listRef} className="mt-20 border-t border-white/15" role="list">
          {services.map((s) => (
            <ServiceRow key={s.slug} service={s} open={open === s.slug} baseId={baseId} onToggle={() => setOpen(open === s.slug ? null : s.slug)} />
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function ServiceRow({ service: s, open, onToggle, baseId }: { service: Service; open: boolean; onToggle: () => void; baseId: string }) {
  const panelId = `${baseId}-${s.slug}-panel`;
  const buttonId = `${baseId}-${s.slug}-button`;
  const media = serviceClip[s.slug] ? clip(serviceClip[s.slug]!) : undefined;
  return (
    <li data-row className="group/row relative border-b border-white/15">
      {/* Blue sweep on hover / when open */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-full origin-bottom bg-blue transition-transform duration-700 ease-out-expo ${open ? "scale-y-0" : "scale-y-0 group-hover/row:scale-y-100"}`}
      />
      <h3 className="relative m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_2.75rem] items-center gap-3 py-7 text-left transition-colors duration-500 group-hover/row:text-ink sm:grid-cols-[4rem_minmax(0,1fr)_3.5rem] sm:gap-5 md:grid-cols-[7rem_minmax(0,1fr)_4.5rem] md:py-10"
        >
          <span className={`text-[clamp(1rem,0.8rem+0.8vw,1.75rem)] font-bold tabular-nums transition-colors ${open ? "text-blue" : "text-white/45 group-hover/row:text-ink"}`}>{s.number}</span>
          <span
            lang="en"
            className={`min-w-0 break-words text-[length:var(--fs-h3)] font-extrabold uppercase leading-[1] tracking-[-0.025em] transition-transform duration-500 ease-out-expo [hyphens:auto] md:group-hover/row:translate-x-4 ${open ? "text-blue" : ""}`}
          >
            {s.title}
          </span>
          <span
            aria-hidden="true"
            className={`ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-out-expo md:h-14 md:w-14 ${
              open ? "rotate-45 border-blue bg-blue text-ink" : "border-white/30 group-hover/row:border-ink group-hover/row:bg-ink group-hover/row:text-white"
            }`}
          >
            <svg viewBox="0 0 12 12" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M6 1v10" /></svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className={`relative grid transition-[grid-template-rows,opacity] duration-700 ease-in-out-quart ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-10 pb-14 md:grid-cols-12 md:pl-[7rem] lg:gap-14">
            <div className={media ? "md:col-span-6" : "md:col-span-7"}>
              <p className="text-[clamp(1.375rem,1rem+1.2vw,2.25rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em] text-white">{s.headline}</p>
              {s.focus ? <p className="label mt-5 text-blue">{s.focus}</p> : null}
              <p className="mt-5 max-w-[50ch] text-[length:var(--fs-body)] leading-[1.7] text-grey-soft">{s.description}</p>
              <ul className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2" role="list" aria-label={`Included in ${s.title}`}>
                {s.included.map((item, i) => (
                  <li key={item} className="flex items-baseline gap-4 border-t border-white/15 py-4 text-[1.0625rem] font-medium text-white">
                    <span className="text-xs font-semibold text-blue">0{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={serviceHref(s)}
                tabIndex={open ? 0 : -1}
                className="group/l mt-9 inline-flex items-center gap-4 rounded-full bg-white px-7 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-blue"
              >
                {s.ctaLabel}
                <Arrow className="transition-transform duration-300 group-hover/l:translate-x-0.5 group-hover/l:-translate-y-0.5" />
              </Link>
            </div>
            {media ? (
              <div className="md:col-span-6">
                {open ? <LazyVideo src={media.landscape} label={media.description} className="aspect-[16/10] rounded-sm" /> : <div className="aspect-[16/10]" />}
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-grey">ScaleAcres studio — {media.title}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
