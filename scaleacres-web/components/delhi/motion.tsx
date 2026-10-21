"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGsap } from "@/lib/motion";

/**
 * Motion primitives for the Delhi city page. Every effect is progressive: the server HTML is
 * the final, readable state; motion is layered on after hydration and skipped entirely for
 * prefers-reduced-motion (useGsap does not run, CSS shows the final state).
 */

/** Masked image entrance: the frame opens from the bottom while the image settles from a slight zoom; optional parallax after. */
export function ImageReveal({ children, className = "", parallax = 0 }: { children: ReactNode; className?: string; parallax?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const media = el.querySelector<HTMLElement>("[data-media]");
    gsap.fromTo(el, { clipPath: "inset(18% 0% 0% 0% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    if (media) gsap.fromTo(media, { scale: 1.14 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    if (media && parallax) {
      gsap.fromTo(media, { yPercent: -parallax }, { yPercent: parallax, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 2.5 } });
    }
  });
  return (
    <div ref={ref} className={`overflow-hidden rounded-[18px] ${className}`}>
      {children}
    </div>
  );
}

/**
 * Oversized chapter line: starts wide-tracked and offset, then drifts left and tightens as the
 * section scrolls through (smoothed scrub). Decorative; the section's real heading follows it.
 */
export function TrackingTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    gsap.fromTo(
      el,
      { letterSpacing: "0.22em", xPercent: 8, opacity: 0.35 },
      { letterSpacing: "-0.04em", xPercent: -4, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: 2.5 } },
    );
  });
  return (
    <p ref={ref} aria-hidden="true" className={`select-none whitespace-nowrap font-black uppercase leading-[0.85] tracking-[-0.04em] will-change-transform ${className}`}>
      {children}
    </p>
  );
}

/**
 * Scroll-linked reading highlight for an existing paragraph (its HTML is rendered on the
 * server unchanged). Words brighten as the paragraph moves up the viewport.
 */
export function ScrollWords({ html, className = "" }: { html: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Wrap each word of every text node in a span; inline tags (<strong>, links) are kept.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode as Text);
    texts.forEach((t) => {
      const parts = (t.textContent ?? "").split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
        else {
          const s = document.createElement("span");
          s.className = "sw";
          s.textContent = p;
          frag.appendChild(s);
        }
      });
      t.replaceWith(frag);
    });
    const words = Array.from(el.querySelectorAll<HTMLElement>(".sw"));
    el.dataset.ready = "true";
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.5 + r.height * 0.8)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.toggleAttribute("data-on", i < n));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <p ref={ref} className={`scroll-words legacy-rich ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export type Capability = { title: string; href: string; note: string; img: { src: string; alt: string } };

/**
 * "What we deliver": eight expanding panels. The active panel opens to show its real project
 * image; the others collapse to vertical titles. Hover, focus or tap opens a panel; each panel
 * links to where that work sits on this page. Phones get a swipeable rail of full cards.
 */
export function CapabilityPanels({ items }: { items: Capability[] }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <ul role="list" className="hidden h-[clamp(28rem,40vw,38rem)] gap-2 md:flex">
        {items.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.title} className={`relative min-w-0 overflow-hidden rounded-[18px] bg-ink transition-[flex-grow] duration-700 ease-out-expo ${on ? "grow-[7]" : "grow"}`} style={{ flexBasis: 0 }} onPointerEnter={() => setActive(i)}>
              <a href={c.href} onFocus={() => setActive(i)} className="group absolute inset-0 block text-white outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img.src} alt="" loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover transition-[filter,scale,opacity] duration-[1200ms] ease-out-expo ${on ? "scale-100 opacity-100 grayscale-0" : "scale-110 opacity-45 grayscale"}`} />
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgb(var(--ink-rgb)/0.92),rgb(var(--ink-rgb)/0.15)_60%,transparent)]" />
                <span className={`absolute left-5 top-5 text-[0.75rem] font-bold tabular-nums tracking-[0.14em] ${on ? "text-sky" : "text-white/70"}`}>{String(i + 1).padStart(2, "0")}</span>
                {/* Collapsed: vertical title */}
                <span aria-hidden={on} className={`absolute bottom-6 left-1/2 origin-center -translate-x-1/2 whitespace-nowrap text-[0.9375rem] font-bold uppercase tracking-[0.14em] transition-opacity duration-500 [writing-mode:vertical-rl] rotate-180 ${on ? "opacity-0" : "opacity-100"}`}>
                  {c.title}
                </span>
                {/* Open: title, note, action */}
                <span className={`absolute inset-x-0 bottom-0 p-7 transition-[opacity,transform] duration-700 ease-out-expo ${on ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0"}`}>
                  <span className="block max-w-[16ch] text-[clamp(1.75rem,1rem+1.8vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]">{c.title}</span>
                  <span className="mt-4 block max-w-[46ch] text-[0.9375rem] leading-[1.6] text-white/75">{c.note}</span>
                  <span className="mt-6 inline-flex items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-sky">
                    See the work
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {/* Phones: swipeable full cards */}
      <ul role="list" className="scrollbar-none -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] scroll-px-[var(--gutter)] md:hidden">
        {items.map((c, i) => (
          <li key={c.title} className="w-[78vw] shrink-0 snap-start">
            <a href={c.href} className="relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-ink text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgb(var(--ink-rgb)/0.92),transparent_65%)]" />
              <span className="absolute left-5 top-5 text-[0.75rem] font-bold tracking-[0.14em] text-sky">{String(i + 1).padStart(2, "0")}</span>
              <span className="absolute inset-x-0 bottom-0 p-6">
                <span className="block text-[1.75rem] font-black uppercase leading-[0.92] tracking-[-0.03em]">{c.title}</span>
                <span className="mt-3 block text-[0.875rem] leading-[1.55] text-white/75">{c.note}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Cinematic film moment: a framed clip opens to full bleed as the visitor scrolls (sticky stage,
 * smoothed scrub), while an oversized line widens and fades behind it. The clip loads only near
 * the viewport and never plays for reduced motion.
 */
export function FilmMoment({ src, poster, line, caption }: { src: string; poster?: string; line: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    const v = video.current;
    if (!el || !v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.getAttribute("src")) v.setAttribute("src", src);
        if (!reduce) v.play().catch(() => undefined);
      } else v.pause();
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [src]);
  useGsap(ref, ({ gsap, el }) => {
    const frame = el.querySelector<HTMLElement>("[data-frame]");
    const text = el.querySelector<HTMLElement>("[data-line]");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 2.8 } });
    if (frame) tl.fromTo(frame, { clipPath: "inset(24% 30% 24% 30% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" }, 0);
    if (text) tl.fromTo(text, { letterSpacing: "-0.04em", opacity: 1 }, { letterSpacing: "0.3em", opacity: 0, ease: "none" }, 0);
  });
  return (
    <div ref={ref} className="relative h-[220vh] bg-ink md:h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <p data-line aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center text-[min(15vw,15rem)] font-black uppercase leading-none tracking-[-0.04em] text-white">
          {line}
        </p>
        <div data-frame className="absolute inset-0 z-[1] [clip-path:inset(0%_0%_0%_0%)]">
          <video ref={video} muted loop playsInline preload="none" poster={poster} aria-hidden="true" tabIndex={-1} className="h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgb(var(--ink-rgb)/0.6),transparent_45%)]" />
          <p className="absolute bottom-6 left-[var(--gutter)] text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/70">{caption}</p>
        </div>
      </div>
    </div>
  );
}

/** Services marquee: rows of the page's own service lines, alternating direction, over a dimmed image. */
export function ServiceMarquee({ rows, image }: { rows: string[][]; image?: string }) {
  return (
    <div aria-hidden="true" className="relative isolate overflow-hidden bg-ink py-[clamp(3rem,6vw,5rem)]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(var(--ink-rgb)),transparent_25%,transparent_75%,rgb(var(--ink-rgb)))]" />
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex overflow-hidden whitespace-nowrap">
            <div className={`marquee-row flex shrink-0 gap-10 pr-10 text-[clamp(1.5rem,0.9rem+2.4vw,3.5rem)] font-extrabold uppercase leading-none tracking-[-0.02em] ${i % 2 ? "marquee-row--rev text-sky" : "text-white"}`}>
              {[...r, ...r].map((t, j) => <span key={j} className="flex items-center gap-10">{t}<span className="text-blue">✦</span></span>)}
            </div>
            <div className={`marquee-row flex shrink-0 gap-10 pr-10 text-[clamp(1.5rem,0.9rem+2.4vw,3.5rem)] font-extrabold uppercase leading-none tracking-[-0.02em] ${i % 2 ? "marquee-row--rev text-sky" : "text-white"}`}>
              {[...r, ...r].map((t, j) => <span key={j} className="flex items-center gap-10">{t}<span className="text-blue">✦</span></span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Funnel progress: the left rail fills as the stages scroll past. */
export function FunnelProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const bar = el.querySelector<HTMLElement>("[data-progress]");
    if (bar) gsap.fromTo(bar, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 60%", scrub: true } });
  });
  return <div ref={ref} className="relative">{children}</div>;
}

/** Count-up for a captured key figure ("1500+"): the number is in the HTML; motion only animates it. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const m = value.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[2].replace(/,/g, ""));
    const o = { v: 0 };
    gsap.to(o, {
      v: target,
      duration: 2,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => { el.textContent = `${m[1]}${Math.round(o.v)}${m[3]}`; },
    });
  });
  return <p ref={ref} className={className}>{value}</p>;
}
