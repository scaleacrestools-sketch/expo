"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ClipDialog, type Clip } from "@/components/site/Media";

/**
 * Hero art for the internal pages: compositions of genuine ScaleAcres material (studio and team
 * photographs, client project covers, website captures, campaign creatives, the motion reel and
 * film posters). Layers drift at slightly different speeds as the page scrolls (desktop only,
 * never with reduced motion).
 */

export type ArtImg = { src: string; srcSet?: string; w: number; h: number; alt: string; label?: string; sub?: string; href?: string; pos?: string };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(min-width: 1024px)").matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-speed]"));
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      for (const l of layers) l.style.transform = `translate3d(0, ${(-y * Number(l.dataset.speed)).toFixed(1)}px, 0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", on, { passive: true });
    tick();
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className={`relative ${className}`}>{children}</div>;
}

function Frame({ im, className = "", sizes, eager = false, delay = 0, children }: { im: ArtImg; className?: string; sizes: string; eager?: boolean; delay?: number; children?: ReactNode }) {
  const body = (
    <div data-nd="clip" style={d(delay)} className={`nd-zoom relative h-full w-full overflow-hidden rounded-[14px] bg-[color:var(--charcoal)] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/10 ${className}`}>
      <div className="nd-settle absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={im.src} srcSet={im.srcSet} sizes={sizes} alt={im.alt} width={im.w} height={im.h} loading={eager ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: im.pos ?? "50% 40%" }} />
      </div>
      {im.label ? (
        <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-full bg-[rgb(11_13_13/0.72)] px-3.5 py-1.5 text-[0.875rem] font-medium leading-tight text-white backdrop-blur-md">
          {im.label}{im.sub ? <span className="text-white/60"> · {im.sub}</span> : null}
        </span>
      ) : null}
      {children}
    </div>
  );
  return im.href ? <Link href={im.href} className="block h-full w-full" aria-label={im.label ?? im.alt}>{body}</Link> : body;
}

/** A large image with a second one overlapping its lower-left corner and a small third chip. */
export function ArtStack({ main, side, chip, mainRatio = "aspect-[4/5]" }: { main: ArtImg; side?: ArtImg; chip?: ArtImg; mainRatio?: string }) {
  return (
    <Parallax className="pb-[12%] lg:pl-[10%]">
      <div className={`relative ml-auto w-[86%] ${mainRatio}`} data-speed="0.04"><Frame im={main} eager sizes="(min-width: 1024px) 40vw, 86vw" /></div>
      {side ? <div className="absolute bottom-0 left-0 aspect-[4/3] w-[48%]" data-speed="0.12"><Frame im={side} delay={180} sizes="(min-width: 1024px) 22vw, 48vw" /></div> : null}
      {chip ? <div className="absolute right-[-2%] top-[8%] hidden aspect-[16/10] w-[38%] sm:block" data-speed="0.18"><Frame im={chip} delay={300} sizes="(min-width: 1024px) 18vw, 38vw" /></div> : null}
    </Parallax>
  );
}

/** Two columns of tiles, the second set lower, so the grid reads as a montage rather than a table. */
export function ArtMosaic({ items, ratio = "aspect-[16/11]" }: { items: ArtImg[]; ratio?: string }) {
  const cols = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];
  return (
    <Parallax className="grid grid-cols-2 gap-[clamp(0.6rem,1.2vw,1rem)]">
      {cols.map((col, c) => (
        <div key={c} className={`grid content-start gap-[clamp(0.6rem,1.2vw,1rem)] ${c ? "pt-[14%]" : ""}`} data-speed={c ? "0.12" : "0.04"}>
          {col.map((im, i) => <div key={im.src} className={ratio}><Frame im={im} eager={i === 0} delay={(i * 2 + c) * 90} sizes="(min-width: 1024px) 22vw, 46vw" /></div>)}
        </div>
      ))}
    </Parallax>
  );
}

/** A looping, muted film in a dark frame (the ScaleAcres reel, or a website scroll capture). */
export function ArtVideo({ src, poster, ratio = "aspect-video", label, chips }: { src: string; poster: string; ratio?: string; label?: string; chips?: string[] }) {
  const ref = useRef<HTMLVideoElement>(null);
  // reduced motion: keep the poster frame still
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause(); }, []);
  return (
    <Parallax>
      <div data-nd="clip" className={`relative overflow-hidden rounded-[16px] bg-black shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] ring-1 ring-white/10 ${ratio}`} data-speed="0.05">
        <video ref={ref} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-label={label}>
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
        {label ? <span className="absolute bottom-3 left-3 rounded-full bg-[rgb(11_13_13/0.72)] px-3.5 py-1.5 text-[0.875rem] font-medium text-white backdrop-blur-md">{label}</span> : null}
      </div>
      {chips?.length ? (
        <ul role="list" className="mt-4 flex flex-wrap gap-2" data-speed="0.02">
          {chips.map((c, i) => <li key={c} data-nd="up" style={d(200 + i * 60)} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.875rem] text-white/80">{c}</li>)}
        </ul>
      ) : null}
    </Parallax>
  );
}

/** Website on a laptop-style browser frame, playing its scroll capture, with a phone screen beside it. */
export function ArtDevice({ video, poster, domain, phone }: { video: string; poster: string; domain: string; phone?: ArtImg }) {
  return (
    <Parallax className="pb-[8%]">
      <div data-nd="clip" className="relative overflow-hidden rounded-[14px] bg-white shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] ring-1 ring-white/10" data-speed="0.04">
        <div className="flex h-8 items-center gap-2 border-b border-black/10 bg-[#f4f5f7] px-3">
          {[0, 1, 2].map((k) => <span key={k} className="h-2.5 w-2.5 rounded-full bg-[#d1d5dc]" />)}
          <span className="ml-3 truncate rounded-full bg-white px-3 py-0.5 text-[0.75rem] text-black/60">{domain}</span>
        </div>
        <div className="relative aspect-[16/10]">
          <video className="absolute inset-0 h-full w-full object-cover object-top" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-label={`${domain}, designed and built by ScaleAcres`}>
            <source src={`${video}.webm`} type="video/webm" />
            <source src={`${video}.mp4`} type="video/mp4" />
          </video>
        </div>
      </div>
      {phone ? (
        <div className="absolute -bottom-2 right-[-3%] w-[26%] overflow-hidden rounded-[22px] border-[5px] border-[#1a1d1f] bg-black shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]" data-speed="0.14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={phone.src} srcSet={phone.srcSet} sizes="12vw" alt={phone.alt} width={phone.w} height={phone.h} className="block aspect-[9/19] w-full object-cover object-top" />
        </div>
      ) : null}
    </Parallax>
  );
}

/** Three film posters, staggered, each playable in the dialog. */
export function ArtReel({ clips, labels }: { clips: Clip[]; labels: string[] }) {
  const [open, setOpen] = useState<Clip | null>(null);
  return (
    <>
      <Parallax className="grid grid-cols-3 gap-[clamp(0.5rem,1vw,0.9rem)]">
        {clips.slice(0, 3).map((c, i) => (
          <div key={c.id} className={i === 1 ? "pt-[22%]" : i === 2 ? "pt-[8%]" : ""} data-speed={["0.05", "0.14", "0.09"][i]}>
            <button type="button" onClick={() => setOpen(c)} aria-label={`Play ${labels[i]}: ${c.title}`} data-nd="clip" style={d(i * 110)} className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[12px] bg-[color:var(--charcoal)] text-left ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.poster} alt="" loading="eager" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]" />
              <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(11_13_13/0.85))]" />
              <span className="absolute left-3 top-3 rounded-full bg-[color:var(--sky)] px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[color:var(--ink)]">{labels[i]}</span>
              <span aria-hidden="true" className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center rounded-full bg-white text-[color:var(--ink)] transition-[transform,background-color,color] duration-500 group-hover:scale-110 group-hover:bg-[color:var(--royal)] group-hover:text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg>
              </span>
            </button>
          </div>
        ))}
      </Parallax>
      <ClipDialog clip={open} onClose={() => setOpen(null)} />
    </>
  );
}

/** Editorial composition: a featured article image with its title, and two more beneath. */
export function ArtFeature({ lead, more }: { lead: ArtImg & { meta: string }; more: (ArtImg & { meta: string })[] }) {
  return (
    <Parallax>
      <Link href={lead.href ?? "#"} className="group block" data-speed="0.04">
        <div data-nd="clip" className="nd-zoom relative aspect-[19/10] overflow-hidden rounded-[14px] bg-[color:var(--charcoal)] ring-1 ring-white/10">
          <div className="nd-settle absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.src} alt={lead.alt} width={lead.w} height={lead.h} loading="eager" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
        <p data-nd="up" style={d(160)} className="nd-label mt-4 text-[color:var(--sky)]">Featured · {lead.meta}</p>
        <p data-nd="up" style={d(200)} className="mt-2 text-[clamp(1.25rem,1.8vw,1.6rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-white transition-colors group-hover:text-[color:var(--sky)]">{lead.label}</p>
      </Link>
      <ul role="list" className="mt-6 grid gap-4 border-t border-white/12 pt-5 sm:grid-cols-2" data-speed="0.08">
        {more.slice(0, 2).map((m, i) => (
          <li key={m.src} data-nd="up" style={d(260 + i * 80)}>
            <Link href={m.href ?? "#"} className="group flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt="" width={m.w} height={m.h} loading="lazy" className="aspect-square w-16 shrink-0 rounded-[8px] object-cover" />
              <span className="min-w-0"><span className="nd-label block text-white/50">{m.meta}</span><span className="mt-1 line-clamp-2 block text-[0.9375rem] font-medium leading-snug text-white/90 group-hover:text-[color:var(--sky)]">{m.label}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </Parallax>
  );
}
