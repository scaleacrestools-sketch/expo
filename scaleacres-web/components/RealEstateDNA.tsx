import Link from "next/link";
import { homepageSeo } from "@/content/seo/homepage";
import { clip } from "@/content/media";
import { Arrow } from "@/components/ui/Arrow";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { LazyVideo } from "@/components/media/LazyVideo";

const capabilities = [
  { title: "Property Marketing", text: "Launch and sustain residential and commercial projects across every channel buyers use." },
  { title: "Lead Generation", text: "Qualified enquiries from people actively looking, routed straight to your sales team." },
  { title: "Developer Branding", text: "Identities that make a developer, and each project, recognisable and trusted." },
  { title: "Website Development", text: "Project and developer websites built to present inventory and convert visits into site visits." },
  { title: "Performance Advertising", text: "Meta and Google campaigns managed against cost per lead and lead quality." },
  { title: "Creative Production", text: "Walkthroughs, launch films, reels and campaign creative produced in-house." },
];

/**
 * Immersive real estate showcase. Carries the protected homepage SEO copy (positioning,
 * intro, boilerplate, legacy service headings + internal links) as visible server HTML.
 */
export function RealEstateDNA() {
  const tower = clip("architecture");
  return (
    <section id="real-estate" className="relative isolate overflow-hidden bg-ink text-white">
      {/* Full-bleed footage */}
      <div className="absolute inset-0 -z-10">
        <LazyVideo src={tower.landscape} label={tower.description} className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,13,0.92)_0%,rgba(11,13,13,0.7)_45%,rgba(11,13,13,0.35)_100%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,#0b0d0d,transparent)]" />
      </div>

      <Reveal className="container-x section-y relative mx-auto max-w-[110rem]">
        <p className="eyebrow text-blue" data-reveal>{homepageSeo.positioning.value}</p>
        <h2 className="display mt-6 max-w-[14ch]" data-split-reveal>
          Real estate marketing.
          <br />
          <span className="text-blue">Reimagined.</span>
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 text-[length:var(--fs-body)] leading-[1.7] text-white/80 lg:col-span-5" data-reveal>
            <p>{homepageSeo.intro.value}</p>
            <p>{homepageSeo.boilerplate.value}</p>
            <div className="pt-4">
              <ArrowLink href="/our-services/" variant="blue" size="lg">Real Estate Services</ArrowLink>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7" role="list" aria-label="Real estate marketing capabilities">
            {capabilities.map((c, i) => (
              <li key={c.title} className="group border-t border-white/20 last:border-b" data-reveal>
                <div className="flex items-baseline gap-5 py-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:py-6">
                  <span className="w-8 shrink-0 text-sm font-semibold tabular-nums text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[clamp(1.25rem,1rem+1.1vw,2.25rem)] font-bold uppercase leading-tight tracking-[-0.015em]">{c.title}</h3>
                    <p className="mt-2 max-w-[48ch] text-[0.975rem] leading-[1.6] text-white/60">{c.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Legacy service headings and internal links from the live homepage (protected). */}
        <div className="mt-24">
          <p className="label text-grey" data-reveal>{homepageSeo.servicesHeading.value}</p>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-sm bg-white/15 sm:grid-cols-2 lg:grid-cols-5" role="list">
            {homepageSeo.legacyServices.value.map((s, i) => (
              <li key={s.heading} className="bg-ink/80 backdrop-blur-sm" data-reveal>
                <Link href={s.href} className="group flex h-full min-h-[12rem] flex-col justify-between gap-8 p-6 transition-colors hover:bg-blue hover:text-ink md:p-8">
                  <span className="text-xs font-semibold text-white/50 group-hover:text-ink/70">0{i + 1}</span>
                  <h3 className="text-[1.375rem] font-bold leading-tight tracking-[-0.01em]">{s.heading}</h3>
                  <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
