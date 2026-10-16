import { articles, blogIndexHref } from "@/content/insights";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/** Editorial article index: real posts from scaleacres.com/blog/, typography-led (no stock images). */
export function Insights() {
  return (
    <Reveal as="section" id="insights" className="section-y bg-white text-ink">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-blue-deep" data-reveal>Thinking out loud</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Ideas worth
              <br />
              <span className="outline-text">exploring.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:justify-self-end" data-reveal>
            <ArrowLink href={blogIndexHref} variant="offwhite">Explore All Insights</ArrowLink>
          </div>
        </div>

        <ul className="mt-16 border-t border-ink/15" role="list">
          {articles.map((a, i) => (
            <li key={a.href} className="border-b border-ink/15" data-reveal>
              <a href={a.href} className="group relative grid gap-4 py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-10">
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-offwhite transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                <span className="relative flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.14em] text-grey md:col-span-3">
                  <span className="tabular-nums text-blue-deep">0{i + 1}</span>
                  <time dateTime={a.publishedOn}>{a.displayDate}</time>
                </span>
                <span className="relative md:col-span-7">
                  <span className="label text-blue-deep">{a.category}</span>
                  <h3 className="mt-2 text-[clamp(1.5rem,1rem+1.6vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">{a.title}</h3>
                  <p className="mt-3 max-w-[60ch] text-[0.975rem] leading-[1.6] text-grey-dark">{a.excerpt}</p>
                </span>
                <span className="relative md:col-span-2 md:justify-self-end">
                  <span className="inline-flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.14em]">
                    Read article
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors group-hover:border-blue group-hover:bg-blue">
                      <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
