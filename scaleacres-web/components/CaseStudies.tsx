import Link from "next/link";
import { caseStudies } from "@/content/caseStudies";
import { getProject } from "@/content/projects";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCover } from "@/components/ProjectCover";

export function CaseStudies() {
  return (
    <Reveal as="section" id="impact" className="section-y bg-ink text-white">
      <div className="container-x mx-auto max-w-[110rem]">
        <p className="eyebrow text-blue" data-reveal>Beyond the deliverables</p>
        <h2 className="h2 mt-6 max-w-[14ch]" data-split-reveal>
          Work that makes
          <br />
          a <span className="text-blue">difference.</span>
        </h2>

        <div className="mt-20 space-y-24">
          {caseStudies.map((cs) => {
            const project = getProject(cs.slug);
            return (
              <article key={cs.slug} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <Link href={`/case-studies/${cs.slug}/`} className="group block lg:col-span-7" data-reveal aria-label={`${cs.client} case study`}>
                  <div className="aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[4/3]">
                    <div className="h-full transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.03]">
                      {project ? <ProjectCover project={project} size="lg" /> : null}
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col justify-between lg:col-span-5" data-reveal>
                  <div>
                    <p className="label text-blue">{cs.industry}</p>
                    <h3 className="mt-4 text-[clamp(2.5rem,1rem+3.6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em]">{cs.client}</h3>
                    <p className="mt-8 text-[length:var(--fs-lead)] leading-[1.5] text-white">{cs.overview} {cs.approach}</p>
                  </div>
                  <div className="mt-12">
                    <p className="label text-grey">Outcomes, as published</p>
                    <ul className="mt-4" role="list">
                      {cs.outcomes.map((o) => (
                        <li key={o} className="flex items-center gap-4 border-t border-white/15 py-5 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-bold uppercase tracking-[-0.01em] last:border-b">
                          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-blue" />
                          {o}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs text-grey">Source: {cs.source}.{cs.pendingFullCopy ? " Full case study copy to be migrated from the live page." : ""}</p>
                    <Link href={`/case-studies/${cs.slug}/`} className="group mt-10 inline-flex items-center gap-3 border-b-2 border-white pb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] hover:border-blue hover:text-blue">
                      View Case Study <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
