import Link from "next/link";
import { clients, type Client } from "@/content/clients";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Section 03 — client logo showcase.
 * Approved logo files render in greyscale (colour on hover) and link to their case study.
 * Until a file is uploaded the tile is a clearly labelled pending slot naming the expected file;
 * it is never presented as a finished logo.
 */
export function ClientLogoShowcase() {
  return (
    <Reveal as="section" id="clients" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-blue-deep" data-reveal>Clients</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Trusted by brands
              <br />
              <span className="text-blue-deep">that think big.</span>
            </h2>
          </div>
          <p className="text-[length:var(--fs-body)] leading-[1.7] text-grey-dark lg:col-span-4" data-reveal>
            We&apos;ve had the opportunity to collaborate with ambitious brands and businesses to bring meaningful digital experiences and creative ideas to life.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-ink/10 bg-ink/10 lg:grid-cols-4" role="list" aria-label="Clients" data-reveal>
          {clients.map((c) => (
            <li key={c.name} className="bg-offwhite">
              <ClientTile client={c} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center" data-reveal>
          <p className="max-w-[56ch] text-[0.875rem] leading-[1.6] text-ink/55">
            Client logos appear once the approved files are uploaded. Client names are as published on scaleacres.com.
          </p>
          <Link href="/contact-us/" className="group inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-blue-deep hover:text-blue-deep">
            Your brand next? Let&apos;s talk <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function ClientTile({ client: c }: { client: Client }) {
  const body = c.logoReady ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={c.logo} alt={c.name} loading="lazy" className="max-h-16 w-auto max-w-[70%] object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-20" />
  ) : (
    <div className="flex flex-col items-center gap-3 text-center">
      <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full border border-dashed border-ink/25 text-ink/30 md:h-16 md:w-16">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 15 5-5 4 4 3-3 6 6" /></svg>
      </span>
      <span className="text-[0.9375rem] font-semibold text-ink/70">{c.name}</span>
      <span className="rounded-full bg-ink/5 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink/45">Logo pending</span>
      <code className="text-[0.6875rem] text-ink/35">{c.logo.replace("/brand/clients/", "")}</code>
    </div>
  );
  const cls = "group relative grid aspect-[4/3] place-items-center p-6 transition-colors duration-500 md:aspect-[3/2]";
  if (c.caseStudy) {
    return (
      <Link href={`/case-studies/${c.caseStudy}/`} className={`${cls} hover:bg-white`} aria-label={`${c.name} — view case study`}>
        {body}
        <span aria-hidden="true" className="absolute right-4 top-4 text-ink/0 transition-colors duration-500 group-hover:text-blue-deep">
          <Arrow />
        </span>
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}
