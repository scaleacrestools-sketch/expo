import Link from "next/link";
import type { CSSProperties } from "react";
import { clientLogos, clientSprite, type ClientLogo } from "@/content/assets";
import { homepageSeo } from "@/content/seo/homepage";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Section 06 — client logo wall. Only the logos ScaleAcres already publishes on
 * scaleacres.com. Steel at rest, Brand Black on hover; clients with a case study link to it.
 */
export function ClientLogoShowcase() {
  return (
    <Reveal as="section" id="clients" className="section-y bg-white text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-blue" data-reveal>{homepageSeo.positioning.value}</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Brands that trust
              <br />
              <span className="text-blue">our work.</span>
            </h2>
          </div>
          <p className="text-[length:var(--fs-body)] leading-[1.7] text-graphite lg:col-span-5" data-reveal>
            The brands and businesses we&apos;ve collaborated with across real estate, digital experiences, branding and marketing.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3 lg:mt-20 lg:grid-cols-5" role="list" aria-label="Clients" data-reveal>
          {clientLogos.map((c) => (
            <li key={c.name} className="bg-white">
              <LogoTile client={c} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center" data-reveal>
          <p className="max-w-[60ch] text-[0.8125rem] leading-[1.6] text-steel">
            Logos as published on scaleacres.com. Trademarks belong to their owners.
          </p>
          <Link href="/contact-us/" className="group inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-blue hover:text-blue">
            Your brand next? Let&apos;s talk <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function LogoTile({ client: c }: { client: ClientLogo }) {
  const col = c.i % clientSprite.cols;
  const row = Math.floor(c.i / clientSprite.cols);
  const style = {
    "--sprite": `url(${clientSprite.src})`,
    "--mask-size": `${clientSprite.cols * 100}% ${clientSprite.rows * 100}%`,
    "--mask-pos": `${(col / (clientSprite.cols - 1)) * 100}% ${(row / (clientSprite.rows - 1)) * 100}%`,
  } as CSSProperties;
  const mark = <span role="img" aria-label={c.name} className="client-logo" style={style} />;
  const cls = "group relative block aspect-[2/1] transition-colors duration-500";
  if (c.caseStudy) {
    return (
      <Link href={`/case-studies/${c.caseStudy}/`} className={`${cls} hover:bg-offwhite`} aria-label={`${c.name}: view case study`}>
        {mark}
        <span aria-hidden="true" className="absolute right-3 top-3 text-transparent transition-colors duration-500 group-hover:text-blue">
          <Arrow className="h-3.5 w-3.5" />
        </span>
      </Link>
    );
  }
  return <div className={cls}>{mark}</div>;
}
