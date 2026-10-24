import Link from "next/link";
import { brand } from "@/content/brand";
import { ndNav, ndServices } from "@/content/nd";
import { liveFooterFacts, liveLegalLinks } from "@/content/legacy-nav";
import { site } from "@/content/site";
import { Rules } from "@/components/nd/ui";

/** 11 — Footer: logo and introduction, navigation, services, contact; the name set edge to edge; legal line. */
export function NdFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="nd-dark relative overflow-hidden border-t border-white/12" aria-label="Footer">
      <Rules />
      <div className="nd-wrap relative">
        <div className="nd-grid gap-y-12 pb-12 pt-[clamp(3.5rem,7vw,6rem)]">
          <div className="nd-cell">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo.reversed} alt="ScaleAcres — Scaling with System and Automation" width={brand.logo.width} height={brand.logo.height} loading="lazy" className="h-[4.75rem] w-auto" />
            <p className="nd-body nd-muted mt-6 max-w-[24rem]">A real estate marketing and creative growth agency. Branding, websites, performance marketing, video and technology for developers and growth brands.</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2" role="list" aria-label="ScaleAcres on social media">
              {site.social.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="nd-link nd-label">{s.label}</a></li>
              ))}
            </ul>
          </div>
          <nav className="nd-cell grid grid-cols-2 gap-8" aria-label="Footer">
            <div>
              <p className="nd-label nd-muted">Navigation</p>
              <ul className="mt-4 space-y-2" role="list">
                {ndNav.map((n) => <li key={n.href}><Link href={n.href} className="nd-link text-[1rem] text-white/85 hover:text-white">{n.label}</Link></li>)}
              </ul>
            </div>
            <div>
              <p className="nd-label nd-muted">Services</p>
              <ul className="mt-4 space-y-2" role="list">
                {ndServices.map((s) => <li key={s.href}><Link href={s.href} className="nd-link text-[1rem] leading-snug text-white/85 hover:text-white">{s.short === "Web" ? "Websites" : s.title.split(" & ")[0]}</Link></li>)}
              </ul>
            </div>
          </nav>
          <div className="nd-cell">
            <p className="nd-label nd-muted">Contact</p>
            <ul className="mt-4 space-y-1" role="list">
              {site.phones.map((p) => (
                <li key={p.number} className="text-[1rem] text-white/85"><span className="nd-muted mr-2">{p.label}</span><a href={p.href} className="hover:text-[color:var(--sky)]">{p.number}</a></li>
              ))}
            </ul>
            <a href={`mailto:${site.email}`} className="mt-3 inline-block text-[1rem] text-white/85 hover:text-[color:var(--sky)]">{site.email}</a>
            <p className="nd-body nd-muted mt-4 max-w-[22rem]">{liveFooterFacts.address}</p>
          </div>
        </div>

        <div className="nd-cell [container-type:inline-size]" aria-hidden="true">
          <p className="select-none whitespace-nowrap font-semibold leading-[0.8] tracking-[-0.055em] text-white" style={{ fontSize: "calc(100cqw / 4.95)" }}>ScaleAcres</p>
        </div>

        <div className="nd-grid border-t border-white/12 py-5 text-[0.875rem] text-white/60">
          <p className="nd-cell">© {year} {site.legalName}. All rights reserved.</p>
          <p className="nd-cell max-md:mt-2">{liveFooterFacts.gst}</p>
          <ul className="nd-cell flex flex-wrap gap-x-5 gap-y-1 lg:justify-end max-lg:mt-2" role="list">
            {liveLegalLinks.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
