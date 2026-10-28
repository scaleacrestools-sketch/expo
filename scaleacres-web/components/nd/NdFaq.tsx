"use client";

import Link from "next/link";
import { useId, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import { ArrowUR, Plus, Tag, Words } from "@/components/nd/ui";

/**
 * Answers use only approved ScaleAcres information: the published service list (content/services),
 * company facts (content/site) and the delivery process. No awards, guarantees or figures.
 * The FAQPage JSON-LD is rendered from the same list, so what search engines read matches the page.
 */
const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "What does ScaleAcres do for real estate businesses?",
    a: "We're a real estate marketing and creative growth agency. One team plans and delivers branding, websites, performance marketing, social media, video and technology for a project, so everything is built to the same plan and measured against the same goal: qualified enquiries and site visits.",
    link: { href: "/our-services/", label: "Our services" },
  },
  {
    q: "Do you design and develop real estate websites?",
    a: "Yes. We design and build corporate websites, project websites and landing pages, covering UI/UX design and performance-focused development, plus ecommerce development where it's needed.",
    link: { href: "/real-estate-web-development/", label: "Website design & development" },
  },
  {
    q: "Can you handle branding and creative production for a launch?",
    a: "Yes. Branding & Creative Design covers logo and brand identity, brand guidelines, graphic design and marketing collaterals such as brochures and hoardings. One team can take a launch from project branding to the website, creatives, video and campaigns.",
    link: { href: "/real-estate-branding-agency/", label: "Branding & creative design" },
  },
  {
    q: "Do you manage Meta Ads and Google Ads?",
    a: "Yes. Our Performance Marketing service covers Google Ads, Meta Ads, lead generation and retargeting, with enquiries tracked to their source.",
    link: { href: "/real-estate-ppc-service/", label: "Performance marketing" },
  },
  {
    q: "Do you offer SEO?",
    a: "Yes. Search Engine Optimization covers technical SEO, on-page SEO, local SEO and content optimization, so buyers searching for your location and project can find you.",
    link: { href: "/services/search-engine-optimization/", label: "Search engine optimization" },
  },
  {
    q: "Do you produce real estate videos?",
    a: "Yes. Video & Creative Production includes ad videos, social media videos such as reels, AI videos and video editing. AI videos are always labelled as AI.",
    link: { href: "/creative-studio/", label: "Visit the creative studio" },
  },
  {
    q: "Do you work with builders, developers and channel partners?",
    a: `Yes. We work with real estate developers, builders and channel partners, from our studios in ${site.offices.join(", ")}, for projects in ${site.markets.join(", ")}.`,
  },
  {
    q: "How does a project start, and how do we work together?",
    a: `It starts with a conversation about the project. We then work in four stages: discovery (the project, the buyer and the competition), strategy (one direction for brand, message and media), creation (identity, website, creatives, films and campaigns) and growth (campaigns go live, enquiries are tracked and we keep improving what brings qualified buyers). Write to ${site.email} or call ${site.phones[0].number} to begin.`,
    link: { href: "/contact-us/", label: "Contact us" },
  },
];

/**
 * 11 — FAQ. White ground: the heading, a short note and an intro-call card on the left; an
 * accordion on the right with thin rules. Questions open with a smooth height transition and are
 * full keyboard buttons (aria-expanded / aria-controls).
 */
export function NdFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section id="faq" className="nd-white relative border-t border-[color:var(--line-l)]" aria-labelledby="nd-faq-title">
      <div className="nd-wrap relative py-[clamp(4.5rem,9vw,8rem)]">
        <div className="nd-grid gap-y-12">
          <div className="nd-cell lg:sticky lg:top-28 lg:self-start">
            <div data-nd="up"><Tag>FAQ</Tag></div>
            <Words id="nd-faq-title" lines={["Got questions?", "We've got answers."]} accent={["answers."]} className="mt-7 text-[clamp(2.25rem,4.6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em]" />
            <p data-nd="up" style={{ "--d": 120 } as CSSProperties} className="nd-lead nd-muted mt-6 max-w-[26rem]">If you&apos;re planning a launch or want to see how we&apos;d approach your project, talk to us and we&apos;ll walk you through it.</p>

            <Link data-nd="up" style={{ "--d": 200 } as CSSProperties} href="/contact-us/" className="group mt-9 flex max-w-[26rem] items-center gap-4 rounded-[14px] border border-[color:var(--line-l)] bg-white p-4 shadow-[var(--sh-1)] transition-[box-shadow,border-color] duration-500 hover:border-[color:var(--royal)] hover:shadow-[var(--sh-2)]">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[10px] bg-[color:var(--ink)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export: tiny SVG */}
                <img src="/brand/scaleacres-symbol-gradient.svg" alt="" width={28} height={28} className="h-7 w-auto" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="nd-label nd-muted block">Let&apos;s talk</span>
                <span className="mt-1 block text-[1.125rem] font-semibold tracking-[-0.01em]">Book an intro call</span>
                <span className="mt-0.5 block text-[0.9375rem] text-[color:var(--muted-l)]">{site.phones[0].number}</span>
              </span>
              <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color:var(--line-l)] transition-[background-color,border-color,color,transform] duration-500 group-hover:rotate-45 group-hover:border-[color:var(--royal)] group-hover:bg-[color:var(--royal)] group-hover:text-white">
                <ArrowUR className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          <ul className="nd-cell border-t border-[color:var(--line-l)] lg:col-span-2" role="list">
            {FAQS.map((f, i) => {
              const on = open === i;
              const pid = `${id}-a${i}`;
              const bid = `${id}-q${i}`;
              return (
                <li key={f.q} data-nd="up" style={{ "--d": i * 50 } as CSSProperties} className="border-b border-[color:var(--line-l)]">
                  <h3 className="m-0">
                    <button id={bid} type="button" aria-expanded={on} aria-controls={pid} onClick={() => setOpen(on ? null : i)} className="group flex w-full items-center gap-4 py-5 text-left md:gap-6 md:py-6">
                      <span className={`nd-label w-8 shrink-0 tabular-nums transition-colors ${on ? "text-[color:var(--royal)]" : "nd-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={`min-w-0 flex-1 text-[clamp(1.125rem,0.95rem+0.6vw,1.5rem)] font-semibold leading-snug tracking-[-0.02em] transition-colors duration-300 ${on ? "text-[color:var(--royal)]" : "group-hover:text-[color:var(--royal)]"}`}>{f.q}</span>
                      <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "rotate-45 border-[color:var(--royal)] bg-[color:var(--royal)] text-white" : "border-[color:var(--line-l)] group-hover:border-[color:var(--royal)]"}`}>
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </h3>
                  <div id={pid} role="region" aria-labelledby={bid} className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="min-h-0 overflow-hidden" inert={!on}>
                      <div className="pb-7 pl-12 pr-4 md:pl-14 md:pr-16">
                        <p className="max-w-[62ch] text-[1.0625rem] leading-[1.65] text-[color:var(--muted-l)]">{f.a}</p>
                        {f.link ? <Link href={f.link.href} className="nd-link nd-label mt-4 text-[color:var(--royal)]">{f.link.label} <ArrowUR className="h-3.5 w-3.5" /></Link> : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
