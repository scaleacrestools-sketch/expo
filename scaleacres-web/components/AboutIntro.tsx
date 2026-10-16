import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { LazyVideo } from "@/components/media/LazyVideo";
import { clip } from "@/content/media";

const pillars = [
  { title: "Strategy", text: "Positioning, audiences and a plan tied to business goals." },
  { title: "Creativity", text: "Identities, campaigns and content people remember." },
  { title: "Technology", text: "Fast websites, platforms and automation that scale." },
  { title: "Performance", text: "Paid media and SEO measured against real outcomes." },
];

export function AboutIntro() {
  const studio = clip("production");
  const brand = clip("brand");
  return (
    <Reveal as="section" id="about" className="section-y overflow-hidden bg-white text-ink">
      <div className="container-x mx-auto max-w-[110rem]">
        <p className="eyebrow text-blue-deep" data-reveal>A little about us</p>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <h2 className="h2 lg:col-span-8" data-split-reveal>
            We think big.
            <br />
            <span className="outline-text text-ink">We build bigger.</span>
          </h2>
          <div className="space-y-5 self-end text-[length:var(--fs-body)] leading-[1.7] text-grey-dark lg:col-span-4" data-reveal>
            <p>
              At ScaleAcres, creativity isn&apos;t just about making things look good. It&apos;s about giving brands a distinct voice, building meaningful digital experiences and creating marketing that supports real business growth.
            </p>
            <p>From the first idea to the final execution, we bring strategy, design, technology and performance together.</p>
            <div className="pt-3">
              <ArrowLink href="/about-us/" variant="offwhite">More About Us</ArrowLink>
            </div>
          </div>
        </div>

        {/* Editorial media pair: real commissioned studio footage */}
        <div className="mt-16 grid gap-4 md:grid-cols-12 md:gap-6" data-reveal>
          <figure className="md:col-span-8">
            <LazyVideo src={studio.landscape} label={studio.description} className="aspect-[16/9] rounded-sm" />
            <figcaption className="mt-3 flex justify-between text-xs uppercase tracking-[0.14em] text-grey">
              <span>ScaleAcres studio — production</span>
              <span>Concept film</span>
            </figcaption>
          </figure>
          <figure className="md:col-span-4 md:mt-24">
            <LazyVideo src={brand.portrait} label={brand.description} className="aspect-[4/5] rounded-sm" />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.14em] text-grey">Identity systems</figcaption>
          </figure>
        </div>

        <ol className="mt-20 grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {pillars.map((p, i) => (
            <li key={p.title} className="group border-b border-ink/15 py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0" data-reveal>
              <span className="label text-grey">0{i + 1}</span>
              <p className="mt-3 text-[clamp(1.75rem,1rem+1.6vw,2.75rem)] font-extrabold uppercase leading-none tracking-[-0.025em] transition-colors group-hover:text-blue-deep">{p.title}</p>
              <p className="mt-3 max-w-[30ch] text-[0.975rem] leading-[1.6] text-grey-dark">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
