"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { img } from "@/content/nd";
import { site } from "@/content/site";
import { ArrowUR, Pic, Plus, Rules, Tag, Words } from "@/components/nd/ui";

const STRIP = ["cr-sid", "slide-2", "web-subata", "cr-jbbr", "slide-4", "web-imperial", "cr-trg", "slide-1"].map((n) => img(n));

/**
 * 10 — Contact. "Let's talk." set very large, direct contact details and the two ways to
 * start, over a slow strip of genuine work.
 */
export function NdContact() {
  return (
    <section id="contact" className="nd-dark relative overflow-hidden" aria-labelledby="nd-contact-title">
      <Rules />
      <div className="nd-wrap relative pt-[clamp(4.5rem,10vw,9rem)]">
        <div className="nd-cell">
          <Tag>Contact</Tag>
          <Words id="nd-contact-title" lines={["Let's talk."]} accent={["talk."]} accentClass="text-[color:var(--sky)]" className="mt-8 text-[clamp(3.5rem,13vw,15rem)] font-semibold leading-[0.85] tracking-[-0.06em]" />
        </div>

        <div className="nd-grid mt-[clamp(2.5rem,6vw,5rem)] gap-y-10">
          <div className="nd-cell" data-nd="up">
            <p className="nd-label nd-muted">Call</p>
            <ul className="mt-3 space-y-1" role="list">
              {site.phones.slice(0, 2).map((p) => (
                <li key={p.number}><a href={p.href} className="text-[clamp(1.5rem,2.2vw,2.25rem)] font-medium tracking-[-0.03em] hover:text-[color:var(--sky)]">{p.number}</a></li>
              ))}
            </ul>
            <p className="nd-label nd-muted mt-7">Email</p>
            <a href={`mailto:${site.email}`} className="mt-2 inline-block text-[1.25rem] font-medium hover:text-[color:var(--sky)]">{site.email}</a>
          </div>
          <div className="nd-cell" data-nd="up" style={{ "--d": 80 } as CSSProperties}>
            <p className="nd-label nd-muted">Studio</p>
            <address className="mt-3 text-[1.0625rem] not-italic leading-[1.6] text-white/85">
              {site.address.lines.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <p className="nd-label nd-muted mt-7">Offices</p>
            <p className="mt-2 text-[1.0625rem] text-white/85">{site.offices.join(" · ")}</p>
          </div>
          <div className="nd-cell flex flex-col gap-3 lg:justify-end" data-nd="up" style={{ "--d": 160 } as CSSProperties}>
            <p className="nd-lead text-white/85">Tell us about your project. We&apos;ll come back with a clear plan for branding, launch and lead generation.</p>
            <Link href="/contact-us/" className="nd-btn nd-btn--royal mt-3 w-full">Start a project <Plus /></Link>
            <a href={`mailto:${site.email}`} className="nd-btn nd-btn--white w-full">Email us <ArrowUR /></a>
          </div>
        </div>
      </div>

      {/* Work strip */}
      <div aria-hidden="true" className="nd-marquee-host relative mt-[clamp(3.5rem,7vw,6rem)] overflow-hidden border-y border-white/12 py-5">
        <div className="nd-marquee" style={{ "--dur": "70s" } as CSSProperties}>
          {[...STRIP, ...STRIP].map((im, i) => (
            <div key={i} className="relative mr-4 h-[clamp(9rem,16vw,14rem)] shrink-0 overflow-hidden bg-[color:var(--navy)]" style={{ aspectRatio: im.h > im.w ? "4 / 5" : "16 / 10" }}>
              <Pic image={im} alt="" sizes="280px" imgClass="absolute inset-0 h-full w-full object-cover object-top" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
