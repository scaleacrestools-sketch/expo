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
      gsap.fromTo(media, { yPercent: -parallax }, { yPercent: parallax, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }
  });
  return (
    <div ref={ref} className={`overflow-hidden rounded-[18px] ${className}`}>
      {children}
    </div>
  );
}

/**
 * Oversized display line whose letter-spacing tightens and opacity rises as it scrolls into view.
 * Purely decorative chapter title (the section's real heading follows it).
 */
export function TrackingTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    gsap.fromTo(el, { letterSpacing: "0.32em", opacity: 0.15 }, { letterSpacing: "-0.04em", opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: 0.6 } });
  });
  return (
    <p ref={ref} aria-hidden="true" className={`select-none whitespace-nowrap font-black uppercase leading-[0.85] tracking-[-0.04em] ${className}`}>
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

export type Capability = { title: string; href: string; img: { src: string; alt: string } };

/**
 * "What we deliver" index: large numbered rows; on pointer devices the matching project image
 * follows the cursor, on touch the image sits inline in each row. Rows are in-page links.
 */
export function CapabilityIndex({ items }: { items: Capability[] }) {
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  useEffect(() => {
    const p = pos.current;
    return () => cancelAnimationFrame(p.raf);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const p = pos.current;
    const host = e.currentTarget.getBoundingClientRect();
    p.tx = e.clientX - host.left;
    p.ty = e.clientY - host.top;
    if (!p.raf) {
      const tick = () => {
        p.x += (p.tx - p.x) * 0.16;
        p.y += (p.ty - p.y) * 0.16;
        if (box.current) box.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        p.raf = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.5 ? requestAnimationFrame(tick) : 0;
      };
      p.raf = requestAnimationFrame(tick);
    }
  };

  return (
    <div className="relative" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <ol className="border-t border-line">
        {items.map((c, i) => (
          <li key={c.title} className="border-b border-line">
            <a
              href={c.href}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 transition-colors duration-500 hover:text-blue focus-visible:text-blue md:grid-cols-[4.5rem_1fr_auto] md:py-8"
            >
              <span className="text-[0.8125rem] font-bold tabular-nums tracking-[0.14em] text-blue">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(1.5rem,0.9rem+2.6vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.035em] transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                {c.title}
              </span>
              {/* Touch: thumbnail inline; pointer: arrow */}
              <span className="block h-14 w-20 overflow-hidden rounded-[8px] md:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </span>
              <span aria-hidden="true" className="hidden h-12 w-12 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:border-blue group-hover:bg-blue group-hover:text-white md:grid">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 17L17 7M9 7h8v8" /></svg>
              </span>
            </a>
          </li>
        ))}
      </ol>
      {/* Cursor-following preview (pointer devices only, decorative) */}
      <div
        ref={box}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-10 hidden h-[15rem] w-[22rem] overflow-hidden rounded-[14px] shadow-[0_40px_90px_-30px_rgba(11,13,13,0.55)] transition-[opacity,scale] duration-500 ease-out-expo md:block ${active === null ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
      >
        {items.map((c, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={c.title} src={c.img.src} alt="" loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`} />
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
