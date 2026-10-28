"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { ArrowUR, Plus, Rules, Tag, Words } from "@/components/nd/ui";
import { NdContactForm } from "@/components/nd/NdContactForm";

/**
 * 12 — Contact. "Let's talk." set very large, direct contact details, the two ways to start and
 * the enquiry form. The footer's wordmark picks up directly below, across the black → white hand-over.
 */
export function NdContact() {
  return (
    <section id="contact" className="nd-dark relative overflow-hidden" aria-labelledby="nd-contact-title">
      <Rules />
      <div className="nd-wrap relative pb-[clamp(3rem,6vw,5rem)] pt-[clamp(4.5rem,10vw,9rem)]">
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

        <div className="nd-grid mt-[clamp(3rem,6vw,5rem)] gap-y-8 border-t border-white/12 pt-[clamp(2.5rem,5vw,4rem)]">
          <div className="nd-cell" data-nd="up">
            <p className="nd-label">Send an enquiry</p>
            <p className="nd-body nd-muted mt-4 max-w-[22rem]">Share a few details about the project and the help you need. A member of the team will reply by email or phone.</p>
          </div>
          <div className="nd-cell lg:col-span-2" data-nd="up" style={{ "--d": 80 } as CSSProperties}>
            <NdContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
