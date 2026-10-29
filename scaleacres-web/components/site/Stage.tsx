"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Tag, Words } from "@/components/nd/ui";
import { Crumbs, lines, type Crumb } from "@/components/site/Kit";
import { ndHero } from "@/content/nd";
import { useGsap } from "@/lib/motion";

/**
 * Art-directed page banners. Each internal page opens on a full-bleed composition of genuine
 * ScaleAcres work (rendered banner art in /images/heroes, desktop 16:9 and a separate 2:3 phone cut,
 * or the ScaleAcres reel), with the headline live in HTML on top. The art settles from a slight zoom
 * on load and drifts with scroll (as on the homepage); both switch off for reduced motion.
 */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;
const H = "/images/heroes";

export type Banner = { name: string; alt: string };

/** <picture> for a rendered banner: the phone cut below 768 px, the 16:9 composition above. */
export function BannerPicture({ b, pos = "50% 50%", className = "" }: { b: Banner; pos?: string; className?: string }) {
  return (
    <picture>
      <source media="(max-width: 767px)" type="image/webp" srcSet={`${H}/${b.name}-mobile-720.webp 720w, ${H}/${b.name}-mobile-1080.webp 1080w`} sizes="100vw" />
      <source type="image/webp" srcSet={`${H}/${b.name}-1600.webp 1600w, ${H}/${b.name}-2400.webp 2400w`} sizes="100vw" />
      <img src={`${H}/${b.name}-1600.webp`} alt={b.alt} width={2400} height={1350} fetchPriority="high" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${className}`} style={{ objectPosition: pos }} />
    </picture>
  );
}

/** The ScaleAcres reel, full-bleed: poster first, the cut that suits the screen once the page has loaded. */
function Reel() {
  const vid = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || save) return;
    const start = () => {
      const portrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
      const ext = vid.current?.canPlayType('video/mp4; codecs="avc1.640028"') ? "mp4" : "webm";
      setSrc(`${portrait ? ndHero.reel.portrait : ndHero.reel.landscape}.${ext}`);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);
  useEffect(() => {
    const v = vid.current;
    if (!v || !src) return;
    v.play().catch(() => undefined);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !v.dataset.paused) v.play().catch(() => undefined); else v.pause(); }, { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return (
    <>
      <picture>
        <source media="(max-width: 767px) and (orientation: portrait)" type="image/webp" srcSet={ndHero.reel.poster.portrait} sizes="100vw" />
        <source type="image/webp" srcSet={ndHero.reel.poster.landscapeSet} sizes="100vw" />
        <img src={ndHero.reel.poster.landscape} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <video id="stage-reel" ref={vid} src={src ?? undefined} muted loop playsInline preload="none" tabIndex={-1} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`} />
    </>
  );
}

function ReelToggle() {
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const v = document.getElementById("stage-reel") as HTMLVideoElement | null;
    if (!v) return;
    if (v.paused) { delete v.dataset.paused; v.play().catch(() => undefined); setPaused(false); }
    else { v.dataset.paused = "1"; v.pause(); setPaused(true); }
  };
  return (
    <button type="button" onClick={toggle} className="nd-label inline-flex items-center gap-2 text-white/80 transition-colors hover:text-[color:var(--sky)]" aria-label={paused ? "Play the background reel" : "Pause the background reel"}>
      <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-white/35">
        {paused ? <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-[1px] fill-current"><path d="M7 4.5v15l13-7.5z" /></svg> : <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>}
      </span>
      {paused ? "Play reel" : "Pause reel"}
    </button>
  );
}

export type StageProps = {
  tag: string;
  title: string;
  accent?: string[];
  lead?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
  as?: "h1" | "p";
  /** center: the ALET/Bou composition, type centred over the art. bottom: editorial, type anchored bottom left. */
  layout?: "center" | "bottom";
  banner?: Banner;
  /** Use the ScaleAcres reel instead of a still banner. */
  reel?: boolean;
  /** Short labels set along the bottom edge of the frame (what the art shows). */
  labels?: string[];
  /** Extra content under the copy (contact details, case facts). */
  children?: ReactNode;
  /** A band pinned to the bottom of the frame (filmstrip, index). */
  band?: ReactNode;
  maxChars?: number;
  pos?: string;
};

function size(n: number, center: boolean) {
  if (n <= 22) return "text-[clamp(3rem,8.4vw,9rem)] leading-[0.88] tracking-[-0.06em]";
  if (n <= 40) return center ? "text-[clamp(2.6rem,6.2vw,6.75rem)] leading-[0.9] tracking-[-0.055em]" : "text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.9] tracking-[-0.055em]";
  if (n <= 72) return "text-[clamp(2.3rem,4.6vw,5rem)] leading-[0.95] tracking-[-0.05em]";
  return "text-[clamp(2rem,3.6vw,3.9rem)] leading-[1] tracking-[-0.04em]";
}

export function Stage({ tag, title, accent = [], lead, crumbs, actions, as = "h1", layout = "bottom", banner, reel = false, labels, children, band, maxChars, pos }: StageProps) {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    gsap.to(el.querySelector("[data-stage-bg]"), { yPercent: 9, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.3 } });
    gsap.to(el.querySelector("[data-stage-copy]"), { yPercent: -6, opacity: 0.35, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.3 } });
  });
  const center = layout === "center";
  const n = title.length;
  const mc = maxChars ?? (center ? (n <= 22 ? 12 : n <= 40 ? 18 : n <= 72 ? 26 : 34) : (n <= 22 ? 12 : n <= 40 ? 17 : n <= 72 ? 24 : 34));
  return (
    <section ref={ref} className="nd-dark nd-stage relative isolate overflow-hidden md:flex md:min-h-[max(40rem,100svh)] md:flex-col" aria-label={tag}>
      {/* Art: 2:3 phone cut on top of the black ground on phones, full-bleed above */}
      <div aria-hidden={banner ? undefined : true} className="absolute inset-x-0 top-0 -z-10 aspect-[2/3] overflow-hidden md:inset-0 md:aspect-auto">
        <div data-stage-bg className="absolute inset-0">
          <div className="nd-stage-art absolute inset-0">{reel ? <Reel /> : banner ? <BannerPicture b={banner} pos={pos} /> : null}</div>
        </div>
        {/* Grade: the art fades into Brand Black under the copy */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_13_13/0.78)_0%,rgb(11_13_13/0.2)_16%,rgb(11_13_13/0)_30%,rgb(11_13_13/0)_42%,rgb(11_13_13/0.85)_80%,#0b0d0d_100%)] md:hidden" />
        <div className={`absolute inset-0 hidden md:block ${center ? "bg-[radial-gradient(ellipse_62%_55%_at_50%_52%,rgb(11_13_13/0.7),rgb(11_13_13/0.25)_70%,transparent),linear-gradient(180deg,rgb(11_13_13/0.6),transparent_24%,transparent_70%,rgb(11_13_13/0.75))]" : "bg-[linear-gradient(180deg,rgb(11_13_13/0.85),rgb(11_13_13/0.35)_16%,transparent_30%),linear-gradient(0deg,rgb(11_13_13/0.92),rgb(11_13_13/0.5)_38%,transparent_64%),linear-gradient(90deg,rgb(11_13_13/0.72),rgb(11_13_13/0.25)_42%,transparent_62%)]"}`} />
      </div>

      <div className="nd-wrap relative flex flex-1 flex-col pb-[clamp(2rem,4vw,3rem)] pt-[calc(150vw*0.56)] md:pt-[clamp(6.5rem,10vw,8rem)]">
        <div className="nd-cell hidden flex-wrap items-center justify-between gap-4 [text-shadow:0_1px_10px_rgb(0_0_0/0.7)] md:flex">
          <div data-nd="up"><Tag>{tag}</Tag></div>
          {crumbs ? <div data-nd="up" style={d(60)}><Crumbs items={crumbs} /></div> : null}
        </div>
        <div className="nd-cell md:hidden" data-nd="up"><Tag>{tag}</Tag></div>

        <div data-stage-copy className={`flex flex-1 flex-col ${center ? "md:items-center md:justify-center md:text-center" : "md:justify-end"} mt-5 md:mt-0`}>
          <div className={`px-[clamp(0.75rem,1.2vw,1.25rem)] ${center ? "md:max-w-[min(92vw,74rem)] md:py-[clamp(2rem,5vw,4rem)]" : "md:max-w-[min(100%,82rem)] md:pt-16"}`}>
            <Words as={as} lines={lines(title, mc)} accent={accent} accentClass="text-[color:var(--sky)]" className={`nd-inline-lines font-semibold ${size(n, center)} [overflow-wrap:anywhere]`} />
          </div>
          <div className={`mt-[clamp(1.5rem,3vw,2.5rem)] grid gap-6 px-[clamp(0.75rem,1.2vw,1.25rem)] ${center ? "md:justify-items-center" : "md:grid-cols-[minmax(0,38rem)_auto] md:items-end md:justify-between"}`}>
            {lead ? <div className={`nd-lead max-w-[38rem] text-white/80 [&_br]:hidden ${center ? "md:mx-auto" : ""}`} data-nd="up" style={d(220)}>{lead}</div> : null}
            {actions ? <div className={`flex flex-wrap gap-3 ${center ? "md:justify-center" : "md:justify-end"}`} data-nd="up" style={d(280)}>{actions}</div> : null}
          </div>
          {children ? <div className="mt-[clamp(1.75rem,3vw,2.5rem)] px-[clamp(0.75rem,1.2vw,1.25rem)]">{children}</div> : null}
        </div>

        {labels?.length || reel ? (
          <div className="mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/15 px-[clamp(0.75rem,1.2vw,1.25rem)] pt-4" data-nd="up" style={d(340)}>
            {labels?.length ? <ul role="list" className="nd-label flex flex-wrap gap-x-[clamp(1rem,3vw,3rem)] gap-y-2 text-white/70">{labels.map((l, i) => <li key={l}><span className="tabular-nums text-[color:var(--sky)]">{String(i + 1).padStart(2, "0")}</span> {l}</li>)}</ul> : null}
            {reel ? <ReelToggle /> : null}
          </div>
        ) : null}
      </div>
      {band}
    </section>
  );
}

/** A slow, endless filmstrip of genuine posters (pauses on hover; still for reduced motion). */
export function Filmstrip({ items }: { items: { src: string; alt: string; href?: string }[] }) {
  const row = items.concat(items);
  return (
    <div className="nd-strip relative overflow-hidden pb-[clamp(1.5rem,3vw,2.5rem)]" aria-label="Recent films">
      <ul role="list" className="nd-strip-track flex w-max gap-3">
        {row.map((it, i) => (
          <li key={i} aria-hidden={i >= items.length ? true : undefined} className="relative aspect-[9/16] w-[clamp(6.5rem,9vw,9.5rem)] shrink-0 overflow-hidden rounded-[8px] ring-1 ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt={i >= items.length ? "" : it.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            {it.href && i < items.length ? <Link href={it.href} className="absolute inset-0" aria-label={it.alt} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ services: masked slices */

export type Slice = { n: string; title: string; href: string; src: string; srcSet?: string; alt: string };

/** Our services: an editorial headline over a row of tall masked slices, one per service, each opening on hover. */
export function SliceStage({ tag, title, accent = [], lead, crumbs, actions, as = "h1", items }: Omit<StageProps, "layout" | "banner" | "reel" | "labels" | "band" | "children" | "pos"> & { items: Slice[] }) {
  return (
    <section className="nd-dark relative overflow-hidden" aria-label={tag}>
      <div aria-hidden="true" className="pointer-events-none absolute -left-[10%] top-[30%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(29_78_216/0.22),transparent)] blur-2xl" />
      <div className="nd-wrap relative pb-[clamp(2rem,4vw,3rem)] pt-[clamp(6.5rem,10vw,8rem)]">
        <div className="nd-cell flex flex-wrap items-center justify-between gap-4">
          <div data-nd="up"><Tag>{tag}</Tag></div>
          {crumbs ? <div data-nd="up" style={d(60)}><Crumbs items={crumbs} /></div> : null}
        </div>
        <div className="mt-[clamp(1.5rem,3vw,2.5rem)] grid items-end gap-8 px-[clamp(0.75rem,1.2vw,1.25rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <Words as={as} lines={lines(title, 22)} accent={accent} accentClass="text-[color:var(--sky)]" className={`nd-inline-lines font-semibold ${size(title.length, false)}`} />
          <div className="grid gap-6">
            {lead ? <div className="nd-lead text-white/80 [&_br]:hidden" data-nd="up" style={d(200)}>{lead}</div> : null}
            {actions ? <div className="flex flex-wrap gap-3" data-nd="up" style={d(260)}>{actions}</div> : null}
          </div>
        </div>
      </div>
      <ul role="list" className="nd-slices -mt-1 h-[clamp(24rem,56svh,40rem)] overflow-x-auto px-[clamp(0.75rem,1.2vw,1.25rem)] pb-[clamp(2rem,4vw,3rem)] max-md:snap-x max-md:snap-mandatory">
        {items.map((s, i) => (
          <li key={s.href} className="nd-slice relative h-full overflow-hidden rounded-[10px] max-md:w-[62vw] max-md:flex-none max-md:snap-start" data-nd="clip" style={d(120 + i * 70)}>
            <Link href={s.href} className="group absolute inset-0 block">
              <span className="nd-settle absolute inset-0 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} srcSet={s.srcSet} sizes="(min-width: 768px) 30vw, 62vw" alt={s.alt} loading={i < 4 ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              </span>
              <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_13_13/0.55),rgb(11_13_13/0.2)_40%,rgb(11_13_13/0.88))] transition-opacity duration-700 group-hover:opacity-70" />
              <span className="absolute left-4 top-4 text-[0.9375rem] font-semibold tabular-nums text-[color:var(--sky)]">{s.n}</span>
              <span className="nd-slice-name absolute bottom-5 left-4 hidden text-[clamp(1.1rem,1.4vw,1.4rem)] font-semibold tracking-[-0.02em] text-white transition-opacity duration-500 group-hover:opacity-0 md:block">{s.title}</span>
              <span className="absolute inset-x-4 bottom-5 flex items-end justify-between gap-3 text-white transition-[opacity,transform] duration-700 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                <span className="text-[clamp(1.25rem,1.8vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em]">{s.title}</span>
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[color:var(--ink)]">↗</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ careers: photo-filled type */

/** Careers: white ground, the headline filled with the team's own photos, then a moving strip of team life. */
export function FillStage({ tag, title, lead, crumbs, actions, as = "h1" }: Omit<StageProps, "layout" | "banner" | "reel" | "labels" | "band" | "children" | "pos" | "accent">) {
  return (
    <section className="nd-white relative overflow-hidden" aria-label={tag}>
      <div className="nd-wrap relative pt-[clamp(6.5rem,10vw,8rem)]">
        <div className="nd-cell flex flex-wrap items-center justify-between gap-4">
          <div data-nd="up"><Tag>{tag}</Tag></div>
          {crumbs ? <div data-nd="up" style={d(60)}><Crumbs items={crumbs} dark={false} /></div> : null}
        </div>
        {(() => {
          const T = as;
          return (
            <T data-nd="up" style={{ ...d(80), "--fill": "url(/images/heroes/careers-fill.webp)" } as CSSProperties} className="nd-fill-text mt-[clamp(1.5rem,3vw,2.5rem)] px-[clamp(0.75rem,1.2vw,1.25rem)] text-[clamp(2.5rem,6.3vw,8rem)] font-bold uppercase leading-[0.88] tracking-[-0.055em] [overflow-wrap:anywhere]">
              {lines(title, 24).map((l, i) => <span key={i} className="md:block">{l} </span>)}
            </T>
          );
        })()}
        <div className="mt-[clamp(1.75rem,3.5vw,3rem)] grid gap-6 px-[clamp(0.75rem,1.2vw,1.25rem)] md:grid-cols-[minmax(0,38rem)_auto] md:items-end md:justify-between">
          {lead ? <div className="nd-lead nd-muted [&_br]:hidden" data-nd="up" style={d(200)}>{lead}</div> : null}
          {actions ? <div className="flex flex-wrap gap-3 md:justify-end" data-nd="up" style={d(260)}>{actions}</div> : null}
        </div>
      </div>
      <div className="nd-strip mt-[clamp(2.5rem,5vw,4rem)] overflow-hidden pb-[clamp(2.5rem,5vw,4rem)]" aria-hidden="true">
        <div className="nd-strip-track flex w-max">
          {[0, 1].map((k) => (
            <picture key={k}>
              <source media="(max-width: 767px)" srcSet="/images/heroes/careers-strip-sm.webp" />
              <img src="/images/heroes/careers-strip.webp" alt="" width={3200} height={760} loading="lazy" decoding="async" className="h-[clamp(11rem,22vw,20rem)] w-auto max-w-none pr-[18px]" />
            </picture>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ blog: magazine */

export type Story = { src: string; alt: string; title: string; href: string; meta?: string };

/** Blog and insights: a white publication front page, oversized masthead, then the lead story and two more. */
export function MagazineStage({ tag, title, accent = [], lead, crumbs, actions, as = "h1", stories }: Omit<StageProps, "layout" | "banner" | "reel" | "labels" | "band" | "children" | "pos"> & { stories: Story[] }) {
  const [top, ...rest] = stories;
  return (
    <section className="nd-white relative overflow-hidden" aria-label={tag}>
      <div className="nd-wrap relative pb-[clamp(3rem,6vw,5rem)] pt-[clamp(6.5rem,10vw,8rem)]">
        <div className="nd-cell flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--line-l)] pb-4">
          <div data-nd="up"><Tag>{tag}</Tag></div>
          {crumbs ? <div data-nd="up" style={d(60)}><Crumbs items={crumbs} dark={false} /></div> : null}
        </div>
        <div className="mt-[clamp(1.5rem,3vw,2.5rem)] grid items-end gap-8 px-[clamp(0.75rem,1.2vw,1.25rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <Words as={as} lines={lines(title, 22)} accent={accent} className={`font-semibold ${title.length <= 8 ? "text-[clamp(4.5rem,17vw,17rem)] leading-[0.8] tracking-[-0.07em]" : size(title.length, false)}`} />
          <div className="grid gap-6 lg:pb-4">
            {lead ? <div className="nd-lead nd-muted [&_br]:hidden" data-nd="up" style={d(200)}>{lead}</div> : null}
            {actions ? <div className="flex flex-wrap gap-3" data-nd="up" style={d(260)}>{actions}</div> : null}
          </div>
        </div>
        {top ? (
          <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-x-[clamp(0.75rem,1.6vw,1.5rem)] gap-y-10 px-[clamp(0.75rem,1.2vw,1.25rem)] lg:grid-cols-12">
            <Link href={top.href} className="group lg:col-span-8">
              <div data-nd="clip" className="relative aspect-[16/9] overflow-hidden rounded-[12px] bg-[color:var(--mist)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <span className="nd-settle absolute inset-0 block"><img src={top.src} alt={top.alt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" /></span>
                <span className="absolute left-4 top-4 bg-[color:var(--royal)] px-2.5 py-1 text-[0.8125rem] font-semibold uppercase tracking-wide text-white">Latest</span>
              </div>
              <div data-nd="up" style={d(120)}>
                {top.meta ? <p className="nd-label nd-muted mt-5">{top.meta}</p> : null}
                <p className="mt-2 text-[clamp(1.5rem,2.6vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.035em] transition-colors group-hover:text-[color:var(--royal)]">{top.title}</p>
              </div>
            </Link>
            <ul role="list" className="grid content-start gap-8 lg:col-span-4">
              {rest.map((s, i) => (
                <li key={s.href}>
                  <Link href={s.href} className="group grid grid-cols-[40%_1fr] items-start gap-4 lg:grid-cols-1">
                    <div data-nd="clip" style={d(180 + i * 100)} className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-[color:var(--mist)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <span className="nd-settle absolute inset-0 block"><img src={s.src} alt={s.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]" /></span>
                    </div>
                    <div>
                      {s.meta ? <p className="nd-label nd-muted">{s.meta}</p> : null}
                      <p className="mt-1.5 text-[clamp(1.1rem,1.4vw,1.3rem)] font-semibold leading-[1.2] tracking-[-0.02em] transition-colors group-hover:text-[color:var(--royal)]">{s.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
