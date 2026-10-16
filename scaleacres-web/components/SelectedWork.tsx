"use client";

import Link from "next/link";
import { useRef } from "react";
import { projects, type Project } from "@/content/projects";
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

export function SelectedWork({ items = projects, limit }: { items?: Project[]; limit?: number }) {
  const grid = useRef<HTMLUListElement>(null);
  const list = limit ? items.slice(0, limit) : items;

  useGsap(grid, ({ gsap, el }) => {
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      const img = card.querySelector("img");
      gsap.fromTo(card, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
      if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1.0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } });
    });
  });

  return (
    <Reveal as="section" id="work" className="section-y bg-ivory text-charcoal">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <SectionHeading className="md:col-span-8" tone="light" eyebrow="The work speaks" title={<>Proof is in<br />the work.</>} description="Every brand has a different story. Here's a look at the experiences, identities and campaigns we've helped bring to life." />
          <div className="md:col-span-4 md:justify-self-end" data-reveal>
            <ArrowLink href="/work" variant="ivory">View All Projects</ArrowLink>
          </div>
        </div>

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
    <Link href={`/work/${p.slug}`} className="group relative block h-full w-full overflow-hidden rounded-sm bg-stone focus-visible:outline-coral">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image} alt={`${p.title} — ${p.category}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo will-change-transform group-hover:scale-[1.04]" />
      {p.placeholder ? <DevBadge label="Dev placeholder — add approved project visual" /> : null}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,21,26,0)_45%,rgba(17,21,26,0.78)_100%)] opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-ivory md:p-8">
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-coral">{p.category}</p>
          <p className="mt-2 text-[clamp(1.375rem,1rem+1.6vw,2.5rem)] font-extrabold uppercase leading-[1] tracking-[-0.02em]">{p.title}</p>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ivory/80 md:translate-y-2 md:opacity-0 md:transition-all md:duration-500 md:ease-out-expo md:group-hover:translate-y-0 md:group-hover:opacity-100">{p.summary}</p>
        </div>
        <span className="hidden shrink-0 items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] md:inline-flex">
          View project
          <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory/40 transition-all duration-500 ease-out-expo group-hover:border-coral group-hover:bg-coral group-hover:text-charcoal">
            <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
