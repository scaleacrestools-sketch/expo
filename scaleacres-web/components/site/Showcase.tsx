import Link from "next/link";
import type { CSSProperties } from "react";
import { ndServiceCards, ndShowcase, ndWork } from "@/content/nd";
import { ArrowUR, Pic, Rules, Tag, Words } from "@/components/nd/ui";

/** Genuine ScaleAcres work, reused across internal pages from the homepage data. */

const SERVICE_BY_PATH: Record<string, string> = {
  "/real-estate-web-development/": "website-design-development",
  "/real-estate-seo-service/": "search-engine-optimization",
  "/real-estate-ppc-service/": "performance-marketing",
  "/facebook-ads-agency/": "performance-marketing",
  "/real-estate-lead-generation-agency/": "performance-marketing",
  "/real-estate-branding-agency/": "branding-creative-design",
  "/social-media-marketing-agency/": "social-media-marketing",
};

export const serviceSlugFor = (path: string) => SERVICE_BY_PATH[path] ?? path.match(/^\/services\/([^/]+)\//)?.[1] ?? null;

/** The service's editorial still from the homepage (genuine work on a light base), framed large. */
export function ServiceVisual({ path, slug }: { path?: string; slug?: string }) {
  const key = slug ?? (path ? serviceSlugFor(path) : null);
  const s = ndServiceCards.find((c) => c.slug === key);
  if (!s) return null;
  return (
    <figure className="nd-cell m-0">
      <div data-nd="clip" className="nd-zoom relative aspect-[3/2] overflow-hidden rounded-[14px] bg-[#f4f5f7] shadow-[var(--sh-3)] md:aspect-[21/10]">
        <div className="nd-settle absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export: pre-sized WebP */}
          <img src={s.image.src} srcSet={s.image.srcSet} sizes="(min-width: 1024px) 94vw, 100vw" alt="" width={1800} height={1200} loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <figcaption className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-[rgb(11_13_13/0.72)] px-3.5 py-1.5 text-[0.8125rem] font-medium text-white backdrop-blur-md">{s.caption}</figcaption>
      </div>
    </figure>
  );
}

/** "Selected work" strip: the four portfolio covers and the genuine campaign creatives, scrolled sideways. */
export function WorkStrip({ title = "Work that sells projects.", tag = "Selected work", dark = true }: { title?: string; tag?: string; dark?: boolean }) {
  const items = [
    ...ndShowcase.map((p) => ({ key: p.slug, name: p.client, cat: p.category, image: p.cover, alt: p.alt, portrait: false })),
    ...ndWork.filter((w) => w.image.h > w.image.w).map((w) => ({ key: w.client + w.project, name: w.client, cat: w.project, image: w.image, alt: w.alt, portrait: true })),
  ];
  return (
    <section className={`${dark ? "nd-dark" : "nd-white"} relative overflow-hidden`} aria-label={tag}>
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,9vw,8rem)]">
        <div className="nd-grid items-end gap-y-6">
          <div className="nd-cell lg:col-span-2">
            <div data-nd="up"><Tag>{tag}</Tag></div>
            <Words as="p" lines={[title]} className="mt-6 text-[clamp(2.2rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]" />
          </div>
          <div className="nd-cell flex lg:justify-end" data-nd="up">
            <Link href="/our-work/" className={`nd-btn ${dark ? "nd-btn--white" : "nd-btn--ink"} w-full max-w-[18rem]`}>View all work <ArrowUR /></Link>
          </div>
        </div>
        <ul role="list" className="-mx-[var(--m)] mt-[clamp(2.5rem,5vw,4rem)] flex snap-x snap-mandatory gap-[clamp(0.75rem,1.5vw,1.25rem)] overflow-x-auto scroll-px-[var(--m)] px-[var(--m)] pb-3 [scrollbar-width:thin]">
          {items.map((it, i) => (
            <li key={it.key} className={`group shrink-0 snap-start ${it.portrait ? "w-[min(62vw,18rem)]" : "w-[min(84vw,34rem)]"}`}>
              <Link href="/our-work/" className="block">
                <div data-nd="clip" style={{ "--d": (i % 6) * 60 } as CSSProperties} className={`nd-zoom relative overflow-hidden rounded-[8px] bg-[color:var(--charcoal)] ${it.portrait ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
                  <div className="nd-settle absolute inset-0">
                    <Pic image={it.image} alt={it.alt} sizes={it.portrait ? "18rem" : "34rem"} imgClass="absolute inset-0 h-full w-full object-cover object-top" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] transition-transform duration-500 group-hover:translate-x-1">{it.name}</span>
                  <span className={`nd-label truncate text-right ${dark ? "text-white/50" : "nd-muted"}`}>{it.cat}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
