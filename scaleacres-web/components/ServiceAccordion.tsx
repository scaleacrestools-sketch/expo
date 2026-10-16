"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { services, serviceHref, type Service } from "@/content/services";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useGsap } from "@/lib/motion";

export function ServiceAccordion({ defaultOpen = services[0].slug }: { defaultOpen?: string | null }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();

  useGsap(listRef, ({ gsap, el }) => {
    const rows = el.querySelectorAll<HTMLElement>("[data-row]");
    gsap.fromTo(
      rows,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } },
    );
  });

  return (
    <Reveal as="section" id="services" className="section-y bg-charcoal text-ivory">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeading
            className="lg:col-span-7"
            eyebrow="Our expertise / What we do"
            title={<>Big ideas.<br />Built into action.</>}
            description="From the way a brand looks to the way it performs, we combine creative thinking, technology and marketing to make every interaction matter."
          />
        </div>

        <ul ref={listRef} className="mt-16 border-t border-ivory/15" role="list">
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
  return (
    <li data-row className="border-b border-ivory/15">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group grid w-full grid-cols-[3rem_1fr_3rem] items-center gap-4 py-6 text-left transition-colors duration-300 hover:text-coral md:grid-cols-[5rem_1fr_4rem] md:py-8"
        >
          <span className={`text-sm font-semibold transition-colors ${open ? "text-coral" : "text-grey"}`}>{s.number}</span>
          <span className="text-[clamp(1.375rem,1rem+2.4vw,3.25rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em]">{s.title}</span>
          <span
            aria-hidden="true"
            className={`relative ml-auto grid h-11 w-11 place-items-center rounded-full border transition-[border-color,background-color,transform] duration-500 ease-out-expo ${open ? "rotate-45 border-coral bg-coral text-charcoal" : "border-ivory/25 group-hover:border-coral"}`}
          >
            <svg viewBox="0 0 12 12" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6h10M6 1v10" /></svg>
          </span>
        </button>
      </h3>

      {/* Grid-rows animation: smooth height without measuring, no layout jump. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-600 ease-in-out-quart ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-8 pb-10 pl-0 md:grid-cols-12 md:pl-[5rem] lg:gap-12">
            <div className="md:col-span-6">
              <p className="text-[clamp(1.125rem,1rem+0.8vw,1.75rem)] font-bold uppercase leading-[1.1] tracking-[-0.015em] text-ivory">{s.headline}</p>
              <p className="mt-4 max-w-[48ch] leading-[1.7] text-stone">{s.description}</p>
              <Link
                href={serviceHref(s)}
                tabIndex={open ? 0 : -1}
                className="group/l mt-7 inline-flex items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory hover:text-coral"
              >
                {s.ctaLabel}
                <Arrow className="transition-transform duration-300 group-hover/l:translate-x-0.5 group-hover/l:-translate-y-0.5" />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 self-start md:col-span-6 md:grid-cols-2" role="list" aria-label={`Included in ${s.title}`}>
              {s.included.map((item) => (
                <li key={item} className="flex items-start gap-3 border-t border-ivory/15 pt-3 text-sm text-ivory/85">
                  <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}
