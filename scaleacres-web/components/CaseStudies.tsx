import { caseStudies } from "@/content/caseStudies";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { DevBadge } from "@/components/ui/DevBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CaseStudies() {
  return (
    <Reveal as="section" id="impact" className="section-y bg-ink text-offwhite">
      <div className="container-x mx-auto max-w-[110rem]">
        <SectionHeading eyebrow="Beyond the deliverables" title={<>Work that makes<br />a difference.</>} />

        <div className="mt-16 space-y-24">
          {caseStudies.map((cs, i) => (
            <article key={cs.slug} className="grid gap-10 lg:grid-cols-12 lg:gap-16" data-reveal>
              <div className={`relative lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cs.image} alt={`${cs.client} case study`} className="h-full w-full object-cover" loading="lazy" />
                  {cs.placeholder ? <DevBadge label="Dev placeholder — add approved campaign visuals" /> : null}
                </div>
              </div>
              <div className="lg:col-span-5">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-blue">{cs.industry}</p>
                <h3 className="mt-3 text-[clamp(2rem,1rem+3vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.025em]">{cs.client}</h3>
                <dl className="mt-8 space-y-6 text-[0.975rem] leading-[1.7] text-grey-soft">
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-offwhite">Challenge</dt>
                    <dd className="mt-2">{cs.challenge}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-offwhite">Scope of work</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {cs.scope.map((s) => (<span key={s} className="rounded-full border border-offwhite/20 px-3 py-1 text-xs text-offwhite/85">{s}</span>))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-offwhite">Solution</dt>
                    <dd className="mt-2">{cs.solution}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-offwhite">Creative highlights</dt>
                    <dd className="mt-2">
                      <ul className="space-y-1.5" role="list">
                        {cs.highlights.map((h) => (<li key={h} className="flex gap-3"><span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />{h}</li>))}
                      </ul>
                    </dd>
                  </div>
                  {cs.outcomes.length ? (
                    <div>
                      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-offwhite">Outcomes</dt>
                      <dd className="mt-2">{cs.outcomes.join(" · ")}</dd>
                    </div>
                  ) : (
                    <p className="text-xs text-grey">Performance figures are published only when supporting campaign reports are attached to this case study.</p>
                  )}
                </dl>
                <div className="mt-8">
                  <ArrowLink href={`/case-studies/${cs.slug}`} variant="ghost" className="text-[0.75rem] font-semibold uppercase tracking-[0.16em]">View the project</ArrowLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
