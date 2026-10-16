import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { caseStudies } from "@/content/caseStudies";
import { services, serviceHref } from "@/content/services";
import { PageHero } from "@/components/PageHero";
import { ContactCTA } from "@/components/ContactCTA";
import { ProjectCover } from "@/components/ProjectCover";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.title} — ${p.category}`, description: p.summary, alternates: { canonical: `/case-studies/${p.slug}` } };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const cs = caseStudies.find((c) => c.slug === p.slug);
  const used = services.filter((s) => p.services.includes(s.slug));
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <PageHero eyebrow={p.category} title={p.title} description={p.summary} />
      <section className="bg-ink">
        <div className="container-x mx-auto max-w-[110rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[16/9]">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={`${p.title} featured visual`} className="h-full w-full object-cover" />
            ) : (
              <ProjectCover project={p} size="lg" />
            )}
          </div>
        </div>
      </section>
      <Reveal as="section" className="section-y bg-offwhite text-ink">
        <div className="container-x mx-auto grid max-w-[110rem] gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4" data-reveal>
            <dl className="space-y-6 text-sm">
              <div><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/50">Client</dt><dd className="mt-1 text-lg font-semibold">{p.client}</dd></div>
              <div><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/50">Services</dt>
                <dd className="mt-2 flex flex-wrap gap-2">{used.map((s) => (<Link key={s.slug} href={serviceHref(s)} className="rounded-full border border-ink/20 px-3 py-1 text-xs hover:border-blue hover:text-blue-deep">{s.title}</Link>))}</dd></div>
              {cs ? <div><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/50">Industry</dt><dd className="mt-1">{cs.industry}</dd></div> : null}
            </dl>
          </aside>
          <div className="space-y-10 lg:col-span-8">
            {cs ? (
              <>
                <Block title="Overview">{cs.overview} {cs.approach}</Block>
                <Block title="Outcomes, as published">{cs.outcomes.join(" · ")}</Block>
                <p className="text-sm text-ink/50">Source: {cs.source}.{cs.pendingFullCopy ? " The full case study (challenge, scope, creative and visuals) will be migrated from the live page." : ""}</p>
              </>
            ) : (
              <Block title="About the project">{p.summary}</Block>
            )}
          </div>
        </div>
      </Reveal>
      <section className="border-t border-offwhite/10 bg-ink text-offwhite">
        <div className="container-x mx-auto flex max-w-[110rem] flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-grey">Next project</p>
          <Link href={`/case-studies/${next.slug}/`} className="group inline-flex items-center gap-4 text-[clamp(1.25rem,1rem+1.2vw,2rem)] font-bold uppercase tracking-[-0.01em] hover:text-blue">
            {next.title} <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
      <ContactCTA withForm={false} />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div data-reveal>
      <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-blue-deep">{title}</h2>
      <div className="mt-3 max-w-[64ch] text-[1.0625rem] leading-[1.75] text-ink/80">{children}</div>
    </div>
  );
}
