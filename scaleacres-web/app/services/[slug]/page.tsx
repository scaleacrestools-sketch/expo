import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService, serviceHref } from "@/content/services";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/PageHero";
import { SelectedWork } from "@/components/SelectedWork";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";
import { breadcrumbJsonLd } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return { title: s.title, description: s.description, alternates: { canonical: serviceHref(s) } };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const related = projects.filter((p) => p.services.includes(s.slug));
  const idx = services.indexOf(s);
  const next = services[(idx + 1) % services.length];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Services", path: "/services" }, { name: s.title, path: serviceHref(s) }])) }} />
      <PageHero eyebrow={`${s.number} — ${s.title}`} title={s.headline} description={s.description} />
      <Reveal as="section" className="section-y bg-ivory text-charcoal">
        <div className="container-x mx-auto grid max-w-[110rem] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-coral-deep" data-reveal>What&apos;s included</p>
            <h2 className="h2 mt-6" data-split-reveal>Built around your goals.</h2>
          </div>
          <ul className="grid gap-px bg-charcoal/10 sm:grid-cols-2 lg:col-span-7" role="list" data-reveal>
            {s.included.map((item, i) => (
              <li key={item} className="bg-ivory p-8">
                <p className="text-xs font-semibold text-charcoal/50">0{i + 1}</p>
                <p className="mt-3 text-[1.375rem] font-bold leading-tight tracking-[-0.01em]">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      {related.length ? <SelectedWork items={related} /> : null}
      <section className="border-t border-ivory/10 bg-charcoal text-ivory">
        <div className="container-x mx-auto flex max-w-[110rem] flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-grey">Next service</p>
          <Link href={serviceHref(next)} className="group inline-flex items-center gap-4 text-[clamp(1.25rem,1rem+1.2vw,2rem)] font-bold uppercase tracking-[-0.01em] hover:text-coral">
            <span className="text-sm text-grey">{next.number}</span> {next.title} <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
