import Link from "next/link";
import { services, serviceHref } from "@/content/services";
import { site } from "@/content/site";
import { blogIndexHref } from "@/content/insights";
import { Arrow } from "@/components/ui/Arrow";
import { Logo } from "@/components/ui/Logo";

const explore = [
  { label: "About ScaleAcres", href: "/about-us/" },
  { label: "Our Team", href: "/our-team/" },
  { label: "Our Work", href: "/case-studies/" },
  { label: "Creative Studio", href: "/creative-studio/" },
  { label: "Insights", href: "/insights/" },
  { label: "Blog", href: blogIndexHref },
  { label: "Contact", href: "/contact-us/" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080A0C] text-white">
      {/* Closing CTA */}
      <div className="border-b border-white/10">
        <div className="container-x mx-auto flex max-w-[120rem] flex-col items-start justify-between gap-10 py-[clamp(4rem,9vw,8rem)] lg:flex-row lg:items-end">
          <p className="max-w-[16ch] text-[clamp(2.75rem,1rem+6vw,8rem)] font-black uppercase leading-[0.88] tracking-[-0.045em]">
            Let&apos;s build something that <span className="text-blue">matters.</span>
          </p>
          <Link href="/contact-us/" className="group inline-flex shrink-0 items-center gap-4 rounded-full bg-blue px-9 py-6 text-[0.875rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:bg-white">
            Let&apos;s Talk
            <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>

      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-14 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="lg" />
            <p className="mt-6 max-w-[34ch] text-[0.975rem] leading-[1.7] text-white/60">{site.description}</p>
            <ul role="list" className="mt-8 flex flex-wrap gap-3">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-blue hover:text-blue">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
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
            <FooterCol title="Studio">
              <li><FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink></li>
              {site.phones.slice(0, 2).map((p) => (
                <li key={p.href}><FooterLink href={p.href}>{p.number}</FooterLink></li>
              ))}
              <li className="pt-3 text-sm leading-relaxed text-white/50">
                {site.address.lines.map((l) => (<span key={l} className="block">{l}</span>))}
              </li>
              <li className="pt-2 text-xs uppercase tracking-[0.16em] text-blue">{site.offices.join(" · ")}</li>
            </FooterCol>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <span>© {year} {site.legalName}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy-policy/" className="hover:text-white">Privacy Policy</Link>
            <a href="#main" className="hover:text-white">Back to top ↑</a>
          </div>
        </div>
      </div>

      <p aria-hidden="true" className="container-x mx-auto max-w-[120rem] select-none overflow-hidden whitespace-nowrap pb-1 text-[clamp(3.5rem,15.4vw,18.5rem)] font-black uppercase leading-[0.78] tracking-[-0.05em] text-white/[0.05]">
        ScaleAcres
      </p>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-white/40">{title}</p>
      <ul className="mt-5 space-y-2.5" role="list">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:\/\//.test(href);
  const cls = "text-[0.975rem] text-white/75 transition-colors hover:text-blue";
  return external ? <a href={href} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}
