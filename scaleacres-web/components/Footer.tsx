import Link from "next/link";
import { site } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";
import { Logo } from "@/components/ui/Logo";

const explore = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us/" },
  { label: "Services", href: "/our-services/" },
  { label: "Our Work", href: "/case-studies/" },
  { label: "Creative Studio", href: "/creative-studio/" },
  { label: "Insights", href: "/insights/" },
];

const expertise = [
  { label: "Real Estate Marketing", href: "/our-services/" },
  { label: "Web Development", href: "/real-estate-web-development/" },
  { label: "Performance Marketing", href: "/real-estate-ppc-service/" },
  { label: "Branding", href: "/real-estate-branding-agency/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
];

/** Section 10 — Brand Black footer: four columns, a composed SCALEACRES word, copyright strip. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-[var(--footer-bg)] text-white">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-12 pb-14 pt-[clamp(4.5rem,8vw,7rem)] sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo size="lg" />
            <p className="mt-7 max-w-[36ch] text-[0.975rem] leading-[1.7] text-grey-soft">
              <span className="font-semibold text-white">A real estate marketing &amp; creative growth agency.</span> {site.tagline}
            </p>
            <ul role="list" className="mt-8 flex gap-3" aria-label="ScaleAcres on social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-sky hover:bg-sky hover:text-ink">
                    <SocialIcon name={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterCol title="Explore" className="lg:col-span-2 lg:col-start-6">
            {explore.map((l) => (
              <li key={l.href}><FooterLink href={l.href}>{l.label}</FooterLink></li>
            ))}
          </FooterCol>

          <FooterCol title="Expertise" className="lg:col-span-2">
            {expertise.map((l) => (
              <li key={l.label}><FooterLink href={l.href}>{l.label}</FooterLink></li>
            ))}
          </FooterCol>

          <FooterCol title="Contact" className="sm:col-span-2 lg:col-span-3">
            <li><FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink></li>
            {site.phones.slice(0, 2).map((p) => (
              <li key={p.href}><FooterLink href={p.href}>{p.number}</FooterLink></li>
            ))}
            <li className="pt-2 text-[0.9375rem] leading-relaxed text-white/55">
              {site.address.lines.map((l) => (<span key={l} className="block">{l}</span>))}
            </li>
            <li className="pt-5">
              <Link href="/contact-us/" className="group inline-flex items-center gap-3 rounded-full bg-blue px-6 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-on-accent transition-colors hover:bg-white hover:text-ink">
                Start a project <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </li>
          </FooterCol>
        </div>

        {/* Decorative wordmark: SVG text stretched to the container width, so it is never clipped. */}
        <svg aria-hidden="true" focusable="false" viewBox="0 0 1000 132" className="block w-full select-none overflow-visible" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="footer-word-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#142E8C" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="#1D4ED8" stopOpacity="0.4" />
              <stop offset="1" stopColor="#38BDF8" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <text x="2" y="118" textLength="996" lengthAdjust="spacingAndGlyphs" fill="none" stroke="url(#footer-word-grad)" strokeWidth="1.1" fontWeight="900" fontSize="152" style={{ fontFamily: "var(--font-outfit), sans-serif", letterSpacing: "-4px" }}>
            SCALEACRES
          </text>
        </svg>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 py-7 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <span>© {year} {site.legalName}. All rights reserved.</span>
          <div className="flex gap-6">
            <span>{site.offices.join(" · ")}</span>
            <a href="#main" className="hover:text-white">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="label text-white/55">{title}</p>
      <ul className="mt-6 space-y-3" role="list">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const cls = "text-[0.975rem] text-white/80 transition-colors hover:text-sky";
  return external ? <a href={href} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}

function SocialIcon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", className: "h-[1.1rem] w-[1.1rem]", "aria-hidden": true } as const;
  if (name === "Instagram")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg>
    );
  if (name === "Facebook")
    return (
      <svg {...common} fill="currentColor"><path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" /></svg>
    );
  return (
    <svg {...common} fill="currentColor"><path d="M6.9 8.6H3.8V20h3.1V8.6zM5.4 3.8a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.2 13.4c0-3-1.6-4.9-4.2-4.9-1.5 0-2.4.8-2.8 1.5V8.6h-3V20h3.1v-5.8c0-1.5.6-2.6 2-2.6s1.8 1.1 1.8 2.6V20h3.1v-6.6z" /></svg>
  );
}
