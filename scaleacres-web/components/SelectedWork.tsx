"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { projects, workFilters, type Project, type WorkFilter } from "@/content/projects";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCover } from "@/components/ProjectCover";
import { LazyVideo } from "@/components/media/LazyVideo";
import { useGsap } from "@/lib/motion";

/** Grid span + frame proportion per layout slot (editorial, deliberately not uniform). */
const slot: Record<Project["layout"], { col: string; frame: string }> = {
  feature: { col: "md:col-span-12", frame: "aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9]" },
  tall: { col: "md:col-span-7", frame: "aspect-[4/5]" },
  short: { col: "md:col-span-5 md:mt-40", frame: "aspect-[4/5] md:aspect-[4/5]" },
  half: { col: "md:col-span-6", frame: "aspect-[4/5] sm:aspect-[5/4]" },
  wide: { col: "md:col-span-12", frame: "aspect-[4/5] sm:aspect-[16/9] md:aspect-[2.4/1]" },
};

type Filter = WorkFilter | "All Work";

export function SelectedWork({ items = projects, limit }: { items?: Project[]; limit?: number }) {
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("All Work");
  const filtered = filter === "All Work" ? items : items.filter((p) => p.filters.includes(filter));
  const list = limit ? filtered.slice(0, limit) : filtered;
  const available = new Set(workFilters.filter((f) => items.some((p) => p.filters.includes(f))));
  const filtering = filter !== "All Work";

  useGsap(grid, ({ gsap, el }) => {
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      gsap.fromTo(card, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 90%", once: true } });
    });
  });

  return (
    <Reveal as="section" id="work" className="section-y bg-white text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-blue-deep" data-reveal>Selected work</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Our work.
              <br />
              <span className="text-blue-deep">Our signature.</span>
            </h2>
          </div>
          <p className="text-[length:var(--fs-body)] leading-[1.7] text-grey-dark lg:col-span-4" data-reveal>
            From digital experiences and distinctive brand identities to creative campaigns and performance-focused marketing, explore the work we&apos;ve brought to life.
          </p>
        </div>

        {/* Category filters */}
        <div className="scrollbar-none -mx-[var(--gutter)] mt-14 overflow-x-auto border-y border-ink/10 px-[var(--gutter)] [mask-image:linear-gradient(90deg,#000_85%,transparent)] lg:[mask-image:none]" data-reveal>
          <ul className="flex gap-8 py-5 md:gap-10" role="list" aria-label="Filter work by category">
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
                    className={`relative whitespace-nowrap text-[0.8125rem] font-semibold uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed disabled:text-ink/25 ${active ? "text-ink" : "text-ink/55 hover:text-blue-deep"}`}
                  >
                    {f}
                    {disabled ? <span className="ml-1.5 text-[0.625rem] tracking-[0.1em]">· soon</span> : null}
                    <span aria-hidden="true" className={`absolute -bottom-5 left-0 h-[2px] w-full origin-left bg-blue transition-transform duration-500 ease-out-expo ${active ? "scale-x-100" : "scale-x-0"}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="sr-only" aria-live="polite">{`${list.length} projects shown`}</p>

        <ul ref={grid} className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24" role="list">
          {list.map((p) => {
            const s = filtering ? { col: "md:col-span-6", frame: "aspect-[4/5] sm:aspect-[5/4]" } : slot[p.layout];
            return (
              <li key={p.slug} data-card className={s.col}>
                <WorkCard project={p} frame={s.frame} feature={!filtering && p.layout === "feature"} />
              </li>
            );
          })}
        </ul>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ink/10 pt-10 md:flex-row md:items-center" data-reveal>
          <p className="max-w-[46ch] text-[0.975rem] leading-[1.6] text-grey-dark">
            Websites, brand identities, social and ad creatives are being added to the library as each client approves publication.
          </p>
          <Link href="/case-studies/" className="group inline-flex items-center gap-4 rounded-full bg-ink px-8 py-5 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-blue hover:text-ink">
            View All Our Work
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function WorkCard({ project: p, frame, feature }: { project: Project; frame: string; feature: boolean }) {
  const href = p.href ?? `/case-studies/${p.slug}/`;
  return (
    <Link href={href} className="group block focus-visible:outline-blue" aria-label={`${p.title} — view project`}>
      <div className={`relative overflow-hidden rounded-[6px] bg-ink ${frame}`}>
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.035]">
          {p.video ? (
            <LazyVideo src={p.video} label={p.summary} className="h-full w-full" />
          ) : p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={`${p.title} — ${p.category}`} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <ProjectCover project={p} size={feature ? "lg" : "md"} />
          )}
        </div>
        {p.video ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(11,13,13,0.75),transparent_55%)]" />
        ) : null}
        {p.video ? (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white md:p-10">
            <div>
              <p className="label text-blue">{p.category}</p>
              <p className="mt-3 text-[clamp(2rem,1rem+3.4vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em]">{p.title}</p>
            </div>
          </div>
        ) : null}
        {/* View project disc */}
        <span className="absolute right-5 top-5 grid h-16 w-16 scale-75 place-items-center rounded-full bg-blue text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 md:h-20 md:w-20">
          <Arrow className="h-5 w-5 md:h-6 md:w-6" />
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
        <div className="min-w-0">
          {!p.video ? <p className="label text-blue-deep">{p.category}</p> : null}
          <p className={`${p.video ? "" : "mt-2 "}text-[clamp(1.5rem,1rem+1.4vw,2.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em]`}>{p.video ? p.client : p.title}</p>
          <p className="mt-3 max-w-[60ch] text-[0.975rem] leading-[1.6] text-grey-dark">{p.summary}</p>
        </div>
        <span className="inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors group-hover:border-blue-deep group-hover:text-blue-deep">
          View Project <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
