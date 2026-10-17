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
    <section id="real-estate" className="relative isolate overflow-hidden bg-navy text-white">
      <Reveal className="container-x section-y relative mx-auto max-w-[120rem]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Narrative + protected SEO copy */}
          <div className="flex flex-col lg:col-span-6">
            <p className="eyebrow text-blue" data-reveal>{homepageSeo.positioning.value}</p>
            <h2 className="mt-6 text-[clamp(2.75rem,1rem+5.2vw,6.25rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]" data-split-reveal>
              Real estate marketing.
              <br />
              <span className="text-blue">Reimagined.</span>
            </h2>
            <div className="mt-10 space-y-5 text-[length:var(--fs-body)] leading-[1.7] text-grey-soft" data-reveal>
              <p>{homepageSeo.intro.value}</p>
              <p>{homepageSeo.boilerplate.value}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              <ArrowLink href="/case-studies/" variant="blue" size="lg">View real estate work</ArrowLink>
              <ArrowLink href="/our-services/" variant="outline" size="lg" className="text-white">Real Estate Services</ArrowLink>
            </div>
          </div>
          {/* Architectural film as the hero image */}
          <figure className="relative m-0 lg:col-span-6" data-reveal>
            <LazyVideo src={tower.portrait} label={tower.description} className="aspect-[4/5] rounded-[14px] md:aspect-[5/6]" />
            <figcaption className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/85">
              <span>ScaleAcres AI film</span>
              <span>Architecture in motion</span>
            </figcaption>
          </figure>
        </div>

        {/* Capabilities */}
        <ol className="mt-20 grid gap-px overflow-hidden rounded-[14px] bg-white/12 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Real estate marketing capabilities">
          {capabilities.map((c, i) => (
            <li key={c.title} className="group bg-navy p-7 transition-colors duration-500 hover:bg-[#0f1d52] md:p-9" data-reveal>
              <span className="text-sm font-semibold tabular-nums text-blue">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-[clamp(1.375rem,1rem+0.8vw,1.875rem)] font-extrabold uppercase leading-tight tracking-[-0.02em]">{c.title}</h3>
              <p className="mt-3 max-w-[40ch] text-[0.975rem] leading-[1.6] text-grey-soft">{c.text}</p>
            </li>
          ))}
        </ol>

        {/* Legacy service headings and internal links from the live homepage (protected). */}
        <div className="mt-20">
          <p className="label text-grey" data-reveal>{homepageSeo.servicesHeading.value}</p>
          <ul className="mt-6 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5" role="list">
            {homepageSeo.legacyServices.value.map((s, i) => (
              <li key={s.heading} className="border-b border-white/15 lg:border-r lg:last:border-r-0" data-reveal>
                <Link href={s.href} className="group flex h-full min-h-[10rem] flex-col justify-between gap-6 py-6 transition-colors sm:px-5 lg:px-6">
                  <span className="text-xs font-semibold text-white/50">0{i + 1}</span>
                  <h3 className="text-[1.25rem] font-bold leading-tight tracking-[-0.01em] transition-colors group-hover:text-sky">{s.heading}</h3>
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
