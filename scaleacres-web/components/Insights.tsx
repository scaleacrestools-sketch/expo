import { articles, blogIndexHref } from "@/content/insights";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Arrow } from "@/components/ui/Arrow";
import { DevBadge } from "@/components/ui/DevBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Insights() {
  return (
    <Reveal as="section" id="insights" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <SectionHeading className="md:col-span-8" tone="light" eyebrow="Thinking out loud" title={<>Ideas worth<br />exploring.</>} />
          <div className="md:col-span-4 md:justify-self-end" data-reveal>
            <ArrowLink href={blogIndexHref} variant="offwhite">Explore All Insights</ArrowLink>
          </div>
        </div>

        <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8" role="list">
          {articles.map((a) => (
            <li key={a.href} data-reveal>
              <a href={a.href} target="_blank" rel="noopener noreferrer" className="group block focus-visible:outline-blue">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-grey-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]" />
                  {a.placeholder ? <DevBadge label="Dev placeholder — use article featured image" /> : null}
                </div>
                <div className="mt-5 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/55">
                  <span className="text-blue-deep">{a.category}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={a.publishedOn}>{a.displayDate}</time>
                </div>
                <h3 className="mt-3 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.01em] transition-colors group-hover:text-blue-deep">{a.title}</h3>
                <p className="mt-3 text-[0.975rem] leading-[1.7] text-ink/70">{a.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em]">
                  Read article <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
