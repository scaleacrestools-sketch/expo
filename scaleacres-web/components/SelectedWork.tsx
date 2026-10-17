"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { projects, workFilters, type Project, type WorkFilter } from "@/content/projects";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCover } from "@/components/ProjectCover";
import { LazyVideo } from "@/components/media/LazyVideo";
import { useGsap } from "@/lib/motion";

type Filter = WorkFilter | "All Work";

/**
 * Section 04 — Our Work. Image-led editorial portfolio: full-width features, then a
 * two-column grid. The visual is the star; title left, categories right underneath.
 * Only ScaleAcres' own work is shown; projects awaiting approved visuals say so.
 */
export function SelectedWork({ items = projects, limit }: { items?: Project[]; limit?: number }) {
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("All Work");
  const filtered = filter === "All Work" ? items : items.filter((p) => p.filters.includes(filter));
  const list = limit ? filtered.slice(0, limit) : filtered;
  const available = new Set(workFilters.filter((f) => items.some((p) => p.filters.includes(f))));
  const filtering = filter !== "All Work";

  useGsap(grid, ({ gsap, el }) => {
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      gsap.fromTo(card, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 92%", once: true } });
    });
  });

  return (
    <Reveal as="section" id="work" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[60rem]">
            <p className="eyebrow text-blue" data-reveal>Our work does the talking</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Our work.
              <br />
              <span className="text-blue">Our signature.</span>
            </h2>
            <p className="mt-6 max-w-[54ch] text-[length:var(--fs-lead)] leading-[1.55] text-graphite" data-reveal>
              A look at the digital experiences, brands, campaigns and creative ideas we&apos;ve brought to life.
            </p>
          </div>
          <Link href="/case-studies/" className="group inline-flex shrink-0 items-center gap-4 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-ink" data-reveal>
            <span aria-hidden="true" className="h-[2px] w-12 transition-all duration-500 group-hover:w-16" style={{ background: "var(--grad)" }} />
            Full portfolio
          </Link>
        </div>

        {/* Filters */}
        <div className="scrollbar-none -mx-[var(--gutter)] mt-12 overflow-x-auto px-[var(--gutter)] [mask-image:linear-gradient(90deg,#000_85%,transparent)] lg:[mask-image:none]" data-reveal>
          <ul className="flex gap-2" role="list" aria-label="Filter work by category">
            {(["All Work", ...workFilters] as Filter[]).map((f) => {
              const disabled = f !== "All Work" && !available.has(f as WorkFilter);
              const active = filter === f;
              return (
                <li key={f} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    disabled={disabled}
                    onClick={() => setFilter(f)}
                    title={disabled ? "Approved projects for this category are being added" : undefined}
                    className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/30 ${
                      active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-graphite hover:border-blue hover:text-blue"
                    }`}
                  >
                    {f}
                    {disabled ? <span className="ml-1.5 text-[0.625rem] tracking-[0.08em]">· soon</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="sr-only" aria-live="polite">{`${list.length} projects shown`}</p>

        <ul ref={grid} key={filter} className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20" role="list">
          {list.map((p) => {
            const full = !filtering && (p.layout === "feature" || p.layout === "wide");
            return (
              <li key={p.slug} data-card className={`animate-[fade-in_500ms_ease-out] ${full ? "md:col-span-2" : ""}`}>
                <WorkCard project={p} full={full} />
              </li>
            );
          })}
        </ul>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 md:flex-row md:items-center" data-reveal>
          <p className="max-w-[52ch] text-[0.975rem] leading-[1.6] text-steel">
            More websites, brand identities, social and ad creatives join the library as each client approves publication.
          </p>
          <Link href="/case-studies/" className="group inline-flex items-center gap-4 rounded-full bg-blue px-8 py-5 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-blue-deep">
            Explore all our work
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function WorkCard({ project: p, full }: { project: Project; full: boolean }) {
  const href = p.href ?? `/case-studies/${p.slug}/`;
  const frame = full ? "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" : "aspect-[4/5] sm:aspect-[4/3]";
  return (
    <Link href={href} className="group block focus-visible:outline-blue" aria-label={`${p.title} — view project`}>
      <div className={`relative overflow-hidden rounded-[10px] bg-ink ${frame}`}>
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]">
          {p.video ? (
            <LazyVideo src={p.video} label={p.summary} className="h-full w-full" />
          ) : p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={`${p.title} — ${p.category}`} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <ProjectCover project={p} size={full ? "lg" : "md"} />
          )}
        </div>
        <span className="absolute bottom-5 right-5 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink opacity-0 shadow-lg transition-all duration-500 ease-out-expo group-hover:opacity-100 group-focus-visible:opacity-100 md:translate-y-3 md:group-hover:translate-y-0">
          View project <Arrow className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <p className="text-[clamp(1.375rem,1rem+0.9vw,2rem)] font-bold leading-tight tracking-[-0.02em] transition-colors group-hover:text-blue">{p.title}</p>
        <p className="label text-steel">{p.category}</p>
      </div>
      <p className="mt-2 max-w-[62ch] text-[0.975rem] leading-[1.6] text-steel">{p.summary}</p>
    </Link>
  );
}
