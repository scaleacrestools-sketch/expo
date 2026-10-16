import Link from "next/link";
import { services, serviceHref } from "@/content/services";
import { site } from "@/content/site";
import { blogIndexHref } from "@/content/insights";
import { Arrow } from "@/components/ui/Arrow";

const explore = [
  { label: "About ScaleAcres", href: "/about-us/" },
  { label: "Our Work", href: "/case-studies/" },
  { label: "Creative Studio", href: "/creative-studio/" },
  { label: "Insights", href: "/insights/" },
  { label: "Blog", href: blogIndexHref },
  { label: "Contact", href: "/contact-us/" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-offwhite">
      <div className="container-x mx-auto max-w-[110rem] pt-20">
        <div className="grid gap-12 border-b border-offwhite/10 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-blue">Let&apos;s make something great</p>
            <p className="h3 mt-5 max-w-[18ch]">Got a big idea? We&apos;d love to hear about it.</p>
            <Link href="/contact-us/" className="group mt-8 inline-flex items-center gap-3 rounded-full bg-offwhite px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-blue">
              Let&apos;s Talk <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <FooterCol title="Services">
              {services.map((s) => (
                <li key={s.slug}><FooterLink href={serviceHref(s)}>{s.title}</FooterLink></li>
              ))}
            </FooterCol>
            <FooterCol title="Explore">
              {explore.map((l) => (
                <li key={l.href}><FooterLink href={l.href}>{l.label}</FooterLink></li>
              ))}
            </FooterCol>
            <FooterCol title="Contact">
              <li><FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink></li>
              {site.phones.slice(0, 2).map((p) => (
                <li key={p.href}><FooterLink href={p.href}>{p.number}</FooterLink></li>
              ))}
              <li className="pt-2 text-sm leading-relaxed text-grey">
                {site.address.lines.map((l) => (<span key={l} className="block">{l}</span>))}
              </li>
              <li className="pt-2 text-xs uppercase tracking-[0.14em] text-grey-soft">{site.offices.join(" · ")}</li>
            </FooterCol>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-8 text-xs text-grey md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold uppercase tracking-[0.14em]" role="list">
            {site.social.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue">{s.label}</a></li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy-policy/" className="hover:text-offwhite">Privacy Policy</Link>
            <span>© {year} {site.legalName}. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden="true" className="container-x mx-auto max-w-[110rem] select-none overflow-hidden pb-2">
        <p className="translate-y-[0.18em] whitespace-nowrap text-[clamp(4rem,17.5vw,19rem)] font-black uppercase leading-none tracking-[-0.045em] text-offwhite/[0.07]">
          ScaleAcres
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue">{title}</p>
      <ul className="mt-5 space-y-2.5" role="list">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:\/\//.test(href);
  const cls = "text-sm text-grey-soft transition-colors hover:text-offwhite";
  return external ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}
