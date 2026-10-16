"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { projects, workFilters, type Project, type WorkFilter } from "@/content/projects";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCover } from "@/components/ProjectCover";
import { useGsap } from "@/lib/motion";

const frame: Record<Project["layout"], string> = {
  feature: "md:col-span-12 aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9]",
  tall: "md:col-span-7 aspect-[4/5]",
  short: "md:col-span-5 aspect-[4/5] md:aspect-[4/5] md:mt-32",
  wide: "md:col-span-12 aspect-[4/5] sm:aspect-[16/9] md:aspect-[2.4/1]",
};

export function SelectedWork({ items = projects, limit, filterable = false }: { items?: Project[]; limit?: number; filterable?: boolean }) {
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<WorkFilter | "All">("All");
  const filtered = filter === "All" ? items : items.filter((p) => p.filters.includes(filter));
  const list = limit ? filtered.slice(0, limit) : filtered;
  const available = workFilters.filter((f) => items.some((p) => p.filters.includes(f)));

  useGsap(grid, ({ gsap, el }) => {
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      gsap.fromTo(card, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%", once: true } });
      const inner = card.querySelector("[data-cover]");
      if (inner) gsap.fromTo(inner, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 88%", once: true } });
    });
  });

  return (
    <Reveal as="section" id="work" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-blue-deep" data-reveal>The work speaks</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Proof is in
              <br />
              <span className="outline-text">the work.</span>
            </h2>
          </div>
          <div className="space-y-6 md:col-span-4" data-reveal>
            <p className="text-[length:var(--fs-body)] leading-[1.7] text-grey-dark">
              Every brand has a different story. Here&apos;s a look at the experiences, identities and campaigns we&apos;ve helped bring to life.
            </p>
            <ArrowLink href="/case-studies/" variant="offwhite">View All Projects</ArrowLink>
          </div>
        </div>

        {filterable ? (
          <div className="scrollbar-none -mx-[var(--gutter)] mt-14 overflow-x-auto px-[var(--gutter)] [mask-image:linear-gradient(90deg,#000_85%,transparent)] lg:[mask-image:none]" data-reveal>
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
                      className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${active ? "border-ink bg-ink text-white" : "border-ink/20 text-ink hover:border-blue-deep hover:text-blue-deep"}`}
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

        <ul ref={grid} className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24" role="list">
          {list.map((p) => (
            <li key={p.slug} data-card className={filterable && filter !== "All" ? "md:col-span-6" : frame[p.layout].split(" ").filter((c) => c.startsWith("md:col") || c.startsWith("md:mt")).join(" ")}>
              <WorkCard project={p} aspect={filterable && filter !== "All" ? "aspect-[4/5]" : frame[p.layout].split(" ").filter((c) => !c.startsWith("md:col") && !c.startsWith("md:mt")).join(" ")} feature={p.layout === "feature"} />
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function WorkCard({ project: p, aspect, feature }: { project: Project; aspect: string; feature: boolean }) {
  return (
    <Link href={`/case-studies/${p.slug}/`} className="group block focus-visible:outline-blue" aria-label={`${p.title} — view case study`}>
      <div className={`relative overflow-hidden rounded-sm ${aspect}`}>
        <div data-cover className="absolute inset-0 transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.03]">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={`${p.title} — ${p.category}`} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <ProjectCover project={p} size={feature ? "lg" : "md"} />
          )}
        </div>
        {/* Animated case-study button */}
        <span className="absolute bottom-5 right-5 grid h-16 w-16 scale-75 place-items-center rounded-full bg-ink text-white opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 md:h-24 md:w-24">
          <Arrow className="h-5 w-5 md:h-7 md:w-7" />
        </span>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="label text-blue-deep">{p.category}</p>
          <p className="mt-2 text-[clamp(1.75rem,1rem+2vw,3.25rem)] font-extrabold uppercase leading-none tracking-[-0.03em]">{p.title}</p>
          <p className="mt-3 max-w-[56ch] text-[0.975rem] leading-[1.6] text-grey-dark">{p.summary}</p>
        </div>
        <span className="inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-colors group-hover:border-blue-deep group-hover:text-blue-deep">
          View Case Study <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
