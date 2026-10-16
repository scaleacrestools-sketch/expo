"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { projects, workFilters, type Project, type WorkFilter } from "@/content/projects";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Arrow } from "@/components/ui/Arrow";
import { DevBadge } from "@/components/ui/DevBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useGsap } from "@/lib/motion";

const span: Record<Project["layout"], string> = {
  full: "md:col-span-12 aspect-[16/9] md:aspect-[21/9]",
  half: "md:col-span-6 aspect-[4/5] md:aspect-[4/5]",
  tall: "md:col-span-5 aspect-[3/4]",
  wide: "md:col-span-12 lg:col-span-7 aspect-[16/10]",
};

export function SelectedWork({ items = projects, limit, filterable = false }: { items?: Project[]; limit?: number; filterable?: boolean }) {
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<WorkFilter | "All">("All");
  const filtered = filter === "All" ? items : items.filter((p) => p.filters.includes(filter));
  const list = limit ? filtered.slice(0, limit) : filtered;
  const available = workFilters.filter((f) => items.some((p) => p.filters.includes(f)));

  useGsap(grid, ({ gsap, el }) => {
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      const img = card.querySelector("img");
      gsap.fromTo(card, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
      if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1.0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
    });
  });

  return (
    <Reveal as="section" id="work" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <SectionHeading className="md:col-span-8" tone="light" eyebrow="The work speaks" title={<>Proof is in<br />the work.</>} description="Every brand has a different story. Here's a look at the experiences, identities and campaigns we've helped bring to life." />
          <div className="md:col-span-4 md:justify-self-end" data-reveal>
            <ArrowLink href="/case-studies/" variant="offwhite">View All Projects</ArrowLink>
          </div>
        </div>

        {filterable ? (
          <div className="scrollbar-none -mx-[var(--gutter)] mt-12 overflow-x-auto px-[var(--gutter)]" data-reveal>
            <ul className="flex gap-2" role="list" aria-label="Filter projects by category">
              {(["All", ...workFilters] as const).map((f) => {
                const disabled = f !== "All" && !available.includes(f);
                const active = filter === f;
                return (
                  <li key={f}>
                    <button
                      type="button"
                      aria-pressed={active}
                      disabled={disabled}
                      onClick={() => setFilter(f)}
                      title={disabled ? "No published projects in this category yet" : undefined}
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${active ? "border-ink bg-ink text-white" : "border-ink/20 text-ink hover:border-blue hover:text-blue-deep"}`}
                    >
                      {f}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="sr-only" aria-live="polite">{`${list.length} projects shown`}</p>
          </div>
        ) : null}

        <ul ref={grid} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8" role="list">
          {list.map((p, i) => (
            <li key={p.slug} data-card className={`${span[p.layout]} ${p.layout === "wide" ? "lg:col-start-6" : ""} relative`} style={{ transitionDelay: `${i * 40}ms` }}>
              <WorkCard project={p} />
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function WorkCard({ project: p }: { project: Project }) {
  return (
    <Link href={`/case-studies/${p.slug}`} className="group relative block h-full w-full overflow-hidden rounded-sm bg-grey-soft focus-visible:outline-blue">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image} alt={`${p.title} — ${p.category}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo will-change-transform group-hover:scale-[1.04]" />
      {p.placeholder ? <DevBadge label="Dev placeholder — add approved project visual" /> : null}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,13,0)_45%,rgba(11,13,13,0.78)_100%)] opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-offwhite md:p-8">
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-blue">{p.category}</p>
          <p className="mt-2 text-[clamp(1.375rem,1rem+1.6vw,2.5rem)] font-extrabold uppercase leading-[1] tracking-[-0.02em]">{p.title}</p>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-offwhite/80 md:translate-y-2 md:opacity-0 md:transition-all md:duration-500 md:ease-out-expo md:group-hover:translate-y-0 md:group-hover:opacity-100">{p.summary}</p>
        </div>
        <span className="hidden shrink-0 items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] md:inline-flex">
          View project
          <span className="grid h-10 w-10 place-items-center rounded-full border border-offwhite/40 transition-all duration-500 ease-out-expo group-hover:border-blue group-hover:bg-blue group-hover:text-ink">
            <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
