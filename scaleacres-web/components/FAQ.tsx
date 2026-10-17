"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Answers use only approved business information: the published service list,
 * company description, offices and contact details. Keep this list and the
 * FAQPage JSON-LD (rendered from the same data) in sync with what is visible.
 */
export const faqs: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "What services does ScaleAcres provide?",
    a: "Eight connected services: Website Design & Development, Search Engine Optimization, Performance Marketing, Branding & Creative Design, Social Media Marketing, Video & Creative Production, Ecommerce Solutions, and Custom Applications & Software.",
    link: { href: "/our-services/", label: "Explore our services" },
  },
  {
    q: "Does ScaleAcres specialize in real estate marketing?",
    a: "Yes. Real estate marketing is at the core of ScaleAcres: property launches, lead generation, developer and project branding, real estate websites, performance advertising and creative production.",
    link: { href: "/case-studies/", label: "See real estate work" },
  },
  {
    q: "Can ScaleAcres manage branding, websites and advertising together?",
    a: "Yes. Brand identity, website development and paid campaigns are planned by one team and measured against the same goals, so the brand, the site and the ads work as one system.",
  },
  {
    q: "Do you provide Google Ads and Meta Ads management?",
    a: "Yes. Our Performance Marketing service covers Google Ads, Meta Ads, lead generation and retargeting.",
    link: { href: "/real-estate-ppc-service/", label: "Performance marketing" },
  },
  {
    q: "Do you develop custom websites and landing pages?",
    a: "Yes. We design and build corporate websites, landing pages and ecommerce sites, with UI/UX design and performance-focused development.",
    link: { href: "/real-estate-web-development/", label: "Website design & development" },
  },
  {
    q: "Does ScaleAcres provide AI videos, social media videos and ad videos?",
    a: "Yes. Video & Creative Production includes AI videos, social media videos, ad videos and video editing.",
    link: { href: "/creative-studio/", label: "Visit the creative studio" },
  },
  {
    q: "Can ScaleAcres work with businesses outside real estate?",
    a: "Yes. ScaleAcres is an independent creative, digital and growth agency. Real estate is our core, and the same services serve ambitious brands in other sectors.",
  },
  {
    q: "How can we discuss a new project with ScaleAcres?",
    a: `Send us a message through the contact page, email ${site.email} or call ${site.phones[0].number}. We work from ${site.offices.join(", ")}.`,
    link: { href: "/contact-us/", label: "Contact us" },
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <Reveal as="section" id="faq" className="section-y bg-white text-ink">
      <div className="container-x mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-blue" data-reveal>FAQs</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Good questions.
              <br />
              <span className="text-blue">Clear answers.</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-[1rem] leading-[1.65] text-steel" data-reveal>
              Something else on your mind? <Link href="/contact-us/" className="font-semibold text-blue underline-offset-4 hover:underline">Ask us directly</Link>.
            </p>
          </div>
        </div>
        <ul className="border-t border-ink/15 lg:col-span-8" role="list">
          {faqs.map((f, i) => {
            const on = open === i;
            const pid = `${id}-a${i}`;
            const bid = `${id}-q${i}`;
            return (
              <li key={f.q} className="border-b border-ink/15">
                <h3 className="m-0">
                  <button
                    id={bid}
                    type="button"
                    aria-expanded={on}
                    aria-controls={pid}
                    onClick={() => setOpen(on ? null : i)}
                    className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 py-6 text-left md:grid-cols-[3.5rem_minmax(0,1fr)_3rem] md:py-7"
                  >
                    <span className={`text-sm font-semibold tabular-nums ${on ? "text-blue" : "text-steel"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[clamp(1.1875rem,1rem+0.7vw,1.625rem)] font-semibold leading-snug tracking-[-0.01em] transition-colors ${on ? "text-blue" : "group-hover:text-blue-deep"}`}>{f.q}</span>
                    <span aria-hidden="true" className={`relative ml-auto grid h-9 w-9 place-items-center rounded-full border transition-colors ${on ? "border-blue bg-blue text-white" : "border-ink/20"}`}>
                      <span className="absolute h-[1.5px] w-3.5 bg-current" />
                      <span className={`absolute h-3.5 w-[1.5px] bg-current transition-transform duration-300 ${on ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div id={pid} role="region" aria-labelledby={bid} className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="min-h-0 overflow-hidden" aria-hidden={!on}>
                    <div className="pb-8 pl-[2.75rem] pr-4 md:pl-[4.25rem] md:pr-16">
                      <p className="max-w-[62ch] text-[length:var(--fs-body)] leading-[1.7] text-graphite">{f.a}</p>
                      {f.link ? (
                        <Link href={f.link.href} tabIndex={on ? 0 : -1} className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-blue hover:text-blue-deep">
                          {f.link.label} ↗
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Reveal>
  );
}
