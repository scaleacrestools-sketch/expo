import Link from "next/link";
import { homepageSeo } from "@/content/seo/homepage";
import { Arrow } from "@/components/ui/Arrow";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Real estate expertise. Carries the protected homepage SEO copy (intro, boilerplate,
 * legacy service headings and their internal links) as readable, server-rendered HTML.
 */
const capabilities = [
  "Real Estate Lead Generation",
  "Residential Project Marketing",
  "Commercial Project Marketing",
  "Real Estate Website Development",
  "Real Estate Branding",
  "Real Estate Advertising Campaigns",
  "Property Video Marketing",
];

export function RealEstateDNA() {
  return (
    <Reveal as="section" id="real-estate" className="section-y relative overflow-hidden bg-ink text-white">
      {/* Architectural blue light sweep (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-1/4 top-0 h-full w-3/4 bg-[radial-gradient(closest-side,rgba(28,166,220,0.22),transparent)]" />
      <div className="container-x relative mx-auto max-w-[110rem]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-blue" data-reveal>{homepageSeo.positioning.value}</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Real estate is<br />in our DNA.
            </h2>
          </div>
          <div className="space-y-5 self-end text-[1.0625rem] leading-[1.7] text-grey-soft lg:col-span-5" data-reveal>
            <p>{homepageSeo.intro.value}</p>
            <p>{homepageSeo.boilerplate.value}</p>
          </div>
        </div>

        <ul className="mt-16 flex flex-wrap gap-3" role="list" aria-label="Real estate marketing capabilities" data-reveal>
          {capabilities.map((c) => (
            <li key={c} className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:border-blue hover:text-blue">
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-20 border-t border-white/15 pt-10">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-grey" data-reveal>{homepageSeo.servicesHeading.value}</p>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2 lg:grid-cols-5" role="list">
            {homepageSeo.legacyServices.value.map((s, i) => (
              <li key={s.heading} className="bg-ink" data-reveal>
                <Link href={s.href} className="group flex h-full flex-col justify-between gap-10 p-6 transition-colors hover:bg-ink-soft md:p-8">
                  <span className="text-xs font-semibold text-grey">0{i + 1}</span>
                  <h3 className="text-[1.25rem] font-bold leading-tight tracking-[-0.01em] group-hover:text-blue">{s.heading}</h3>
                  <Arrow className="text-blue transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10" data-reveal>
            <ArrowLink href="/our-services/" variant="solid">All Real Estate Services</ArrowLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
