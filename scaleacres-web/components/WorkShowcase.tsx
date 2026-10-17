import Link from "next/link";
import { showcaseItems, type ShowcaseItem } from "@/content/showcase";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { LazyVideo } from "@/components/media/LazyVideo";

/**
 * Section 04 — Our Work. Large-format, image-led two-column showcase: the visual is the
 * star, the name sits beneath on the left and the category on the right.
 */
export function WorkShowcase() {
  const { grid, caseStudies } = showcaseItems();
  return (
    <Reveal as="section" id="work" className="bg-white py-[clamp(5.5rem,10vw,9rem)] text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-blue" data-reveal>Our work does the talking</p>
            <h2 className="mt-5 text-[clamp(2.75rem,0.9rem+5.4vw,7.25rem)] font-black uppercase leading-[0.88] tracking-[-0.045em]" data-split-reveal>
              Our work. <span className="text-blue">Our signature.</span>
            </h2>
          </div>
          <Link href="/case-studies/" className="group inline-flex shrink-0 items-center gap-4 pb-2 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:text-blue" data-reveal>
            <span aria-hidden="true" className="h-[2px] w-12 transition-all duration-500 ease-out-expo group-hover:w-16" style={{ background: "var(--grad)" }} />
            Full portfolio
            <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <ul className="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 gap-x-[clamp(1.25rem,2vw,2rem)] gap-y-[clamp(2.5rem,4vw,3.75rem)] md:grid-cols-2" role="list">
          {grid.map((item, i) => (
            <li key={item.slug} data-reveal style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
              <ShowcaseCard item={item} priority={i < 2} />
            </li>
          ))}
        </ul>

        {/* Published client case studies (kept as real links while their visuals are approved) */}
        <div className="mt-[clamp(3.5rem,6vw,5rem)] grid gap-6 border-t border-line pt-8 lg:grid-cols-12 lg:items-start" data-reveal>
          <p className="label text-steel lg:col-span-3">Client case studies</p>
          <ul className="flex flex-wrap gap-x-10 gap-y-4 lg:col-span-6" role="list">
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <Link href={`/case-studies/${c.slug}/`} className="group inline-flex items-baseline gap-2 text-[1.125rem] font-semibold text-ink transition-colors hover:text-blue">
                  {c.title}
                  <Arrow className="h-3 w-3 opacity-40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="lg:col-span-3 lg:justify-self-end">
            <Link href="/case-studies/" className="group inline-flex items-center gap-4 rounded-full bg-blue px-8 py-5 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-blue-deep">
              View all our work
              <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ShowcaseCard({ item, priority }: { item: ShowcaseItem; priority: boolean }) {
  return (
    <Link href={item.href} className="group block rounded-[14px] focus-visible:outline-offset-4" aria-label={`${item.title}, ${item.category}, view project`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-ink md:aspect-[3/2]">
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo will-change-transform group-hover:scale-[1.045] group-focus-visible:scale-[1.045]">
          {item.video ? (
            <LazyVideo src={item.video} label={item.alt} className="h-full w-full" rootMargin={priority ? "600px" : "300px"} />
          ) : item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.alt} loading={priority ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-black/5" />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <p className="flex items-center gap-3 text-[clamp(1.25rem,1rem+0.6vw,1.625rem)] font-bold tracking-[-0.015em] text-ink transition-colors duration-300 group-hover:text-blue">
          {item.title}
          <Arrow className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
        </p>
        <p className="shrink-0 text-right text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-steel">{item.category}</p>
      </div>
    </Link>
  );
}
