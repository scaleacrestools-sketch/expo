"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { brand } from "@/content/brand";
import { ndNav, ndServices } from "@/content/nd";
import { liveFooterFacts, liveLegalLinks } from "@/content/legacy-nav";
import { site } from "@/content/site";
import { useGsap } from "@/lib/motion";
import { ArrowUR, Rules } from "@/components/nd/ui";

const WORD = "ScaleAcres";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" /></>,
  Facebook: <path d="M14 8.5h2.5V5H14c-2.2 0-3.8 1.7-3.8 3.9V11H8v3.4h2.2V21h3.4v-6.6H16l.5-3.4h-2.9V9.2c0-.4.3-.7.7-.7Z" />,
  LinkedIn: <><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" /><path d="M8 10.5V16M8 7.8v.1M11.5 16v-3.2c0-1.4.9-2.3 2.1-2.3s2 .9 2 2.3V16M11.5 10.5V16" /></>,
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--royal-tint)] text-[color:var(--royal)] transition-colors duration-300 group-hover:bg-[color:var(--royal)] group-hover:text-white">
      <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
    </span>
  );
}

/**
 * 13 — Footer (new design from the combined draft). The name set edge to edge across the
 * hand-over from the black contact section, faded into both grounds; then a white footer with
 * the logo and introduction, navigation, services, contact with Royal icons, and the legal bar.
 * The letters of the name rise one after another as it scrolls into view.
 */
export function NdFooter() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    gsap.fromTo(
      el.querySelectorAll("[data-letter]"),
      { yPercent: 55, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: "power3.out", stagger: 0.035, duration: 0.8, scrollTrigger: { trigger: el, start: "top 85%", once: true } },
    );
  });

  const year = new Date().getFullYear();
  return (
    <footer ref={ref} className="nd-white relative overflow-hidden" aria-label="Footer">
      {/* Wordmark across the black → white hand-over */}
      <div aria-hidden="true" className="relative bg-[linear-gradient(180deg,var(--ink)_0%,var(--ink)_52%,#fff_52%)]">
        <div className="nd-wrap [container-type:inline-size]">
          <p className="nd-cell flex select-none justify-center whitespace-nowrap font-semibold leading-[0.84] tracking-[-0.055em]" style={{ fontSize: "calc(100cqw / 4.7)" }}>
            {WORD.split("").map((ch, i) => (
              <span key={i} data-letter className="nd-fword inline-block" style={{ "--i": i } as CSSProperties}>{ch}</span>
            ))}
          </p>
        </div>
      </div>

      <Rules />
      <div className="nd-wrap relative">
        <div className="grid grid-cols-2 gap-y-12 pb-14 pt-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[1.25fr_0.75fr_0.9fr_1.25fr]">
          {/* Brand */}
          <div className="nd-cell col-span-2 md:col-span-1" data-nd="up">
            <Link href="/" aria-label="ScaleAcres — Home" className="inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo.primary} alt="ScaleAcres — Scaling with System and Automation" width={brand.logo.width} height={brand.logo.height} loading="lazy" className="h-[4.25rem] w-auto" />
            </Link>
            <p className="nd-body nd-muted mt-6 max-w-[24rem]">A real estate marketing and creative growth agency. Branding, websites, performance marketing, video and technology for developers and growth brands.</p>
            <ul className="mt-7 flex gap-3" role="list" aria-label="ScaleAcres on social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`ScaleAcres on ${s.label}`} className="group block">
                    <Icon>{SOCIAL_ICONS[s.label]}</Icon>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <nav className="nd-cell" aria-label="Footer navigation" data-nd="up" style={{ "--d": 60 } as CSSProperties}>
            <p className="nd-label text-[color:var(--ink)]">Navigation</p>
            <ul className="mt-5 space-y-2.5" role="list">
              {ndNav.map((n) => <li key={n.href}><Link href={n.href} className="nd-link text-[1rem] text-[color:var(--muted-l)] transition-colors hover:text-[color:var(--royal)]">{n.label}</Link></li>)}
            </ul>
          </nav>

          {/* Services */}
          <nav className="nd-cell" aria-label="Our services" data-nd="up" style={{ "--d": 120 } as CSSProperties}>
            <p className="nd-label text-[color:var(--ink)]">Our services</p>
            <ul className="mt-5 space-y-2.5" role="list">
              {ndServices.map((s) => <li key={s.href}><Link href={s.href} className="nd-link text-[1rem] leading-snug text-[color:var(--muted-l)] transition-colors hover:text-[color:var(--royal)]">{s.short === "Web" ? "Websites" : s.title.split(" & ")[0]}</Link></li>)}
            </ul>
          </nav>

          {/* Contact */}
          <div className="nd-cell col-span-2 md:col-span-1" data-nd="up" style={{ "--d": 180 } as CSSProperties}>
            <p className="nd-label text-[color:var(--ink)]">Contact</p>
            <ul className="mt-5 space-y-4" role="list">
              <li>
                <a href={site.phones[0].href} className="group flex items-center gap-4">
                  <Icon><path d="M6.6 3.5h2.6l1.4 4-1.9 1.3a11 11 0 0 0 5.5 5.5l1.3-1.9 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" /></Icon>
                  <span className="text-[1rem] leading-[1.45]">
                    {site.phones.slice(0, 2).map((p) => <span key={p.number} className="block font-medium text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--royal)]">{p.number}</span>)}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="group flex items-center gap-4">
                  <Icon><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></Icon>
                  <span className="break-all text-[1rem] font-medium text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--royal)]">{site.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Icon><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></Icon>
                <address className="nd-muted text-[0.9375rem] not-italic leading-[1.55]">{liveFooterFacts.address}</address>
              </li>
            </ul>
            <Link href="/contact-us/" className="nd-link nd-label mt-7 text-[color:var(--royal)]">Start a project <ArrowUR className="h-3.5 w-3.5" /></Link>
          </div>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col gap-3 border-t border-[color:var(--line-l)] px-[clamp(0.75rem,1.2vw,1.25rem)] py-5 text-[0.875rem] text-[color:var(--muted-l)] lg:flex-row lg:items-center lg:justify-between">
          <p>© {year} {site.legalName}. All rights reserved. <span className="max-sm:block">GST No. {liveFooterFacts.gst.replace(/^GST No:\s*-\s*/, "")}</span></p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1" role="list">
            {liveLegalLinks.map((l) => <li key={l.href}><Link href={l.href} className="transition-colors hover:text-[color:var(--royal)]">{l.label}</Link></li>)}
          </ul>
        </div>
      </div>

      <style>{`
        .nd-fword {
          background: linear-gradient(180deg, rgb(255 255 255 / 0.24) 0%, rgb(255 255 255 / 0.08) 52%, rgb(11 13 13 / 0.12) 52%, rgb(29 78 216 / 0.05) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          background-size: 100% 100%;
        }
      `}</style>
    </footer>
  );
}
