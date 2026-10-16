import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DevBadge } from "@/components/ui/DevBadge";

const strip = ["Strategy", "Creativity", "Technology", "Performance"];

export function AboutIntro() {
  return (
    <Reveal as="section" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto grid max-w-[110rem] gap-14 lg:grid-cols-[55fr_45fr] lg:gap-20">
        <div>
          <SectionHeading tone="light" eyebrow="A little about us" title={<>We think big.<br />We build bigger.</>} />
          <div className="mt-10 max-w-[52ch] space-y-5 text-[1.0625rem] leading-[1.7] text-ink/75" data-reveal>
            <p>
              At ScaleAcres, creativity isn&apos;t just about making things look good. It&apos;s about giving brands a distinct voice, building meaningful digital experiences and creating marketing that supports real business growth.
            </p>
            <p>From the first idea to the final execution, we bring strategy, design, technology and performance together.</p>
          </div>
          <div className="mt-10" data-reveal>
            <ArrowLink href="/about-us/" variant="offwhite">More About Us</ArrowLink>
          </div>
        </div>

        <div className="relative" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-grey-soft lg:mt-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about/studio.svg" alt="" className="h-full w-full object-cover" loading="lazy" />
            <DevBadge label="Dev placeholder — add team / studio photograph" />
          </div>
          <div className="pointer-events-none absolute -left-6 top-10 hidden rotate-180 [writing-mode:vertical-rl] lg:block">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-ink/50">Delhi · Agra · Bangalore</span>
          </div>
        </div>
      </div>

      <div className="mt-20 border-y border-ink/10" data-reveal>
        <ul className="marquee py-6" role="list" aria-label="What we bring together">
          <li className="marquee__track items-center text-[clamp(1.5rem,4vw,3.5rem)] font-extrabold uppercase tracking-[-0.02em] text-ink/80" style={{ "--marquee-duration": "28s", "--marquee-gap": "3rem" } as React.CSSProperties}>
            {[...strip, ...strip, ...strip].map((s, i) => (
              <span key={i} className="inline-flex items-center gap-12" aria-hidden={i >= strip.length}>
                {s}
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-blue" />
              </span>
            ))}
          </li>
        </ul>
      </div>
    </Reveal>
  );
}
