"use client";

import { useEffect, type CSSProperties, type ElementType, type ReactNode } from "react";
import type { Img } from "@/content/nd";

/** Hairline column rules behind a section (3 columns desktop, 2 tablet, edges only on phones). */
export function Rules() {
  return (
    <div aria-hidden="true" className="nd-rules">
      <div><span /><span /><span /></div>
    </div>
  );
}

/** Section tag: four slanted bars + "[SA® — Label]". */
export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`nd-tag nd-label ${className}`}>
      <i aria-hidden="true"><b /><b /><b /><b /></i>
      <span>[SA® — {children}]</span>
    </p>
  );
}

export function Plus({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1v14M1 8h14" /></svg>
  );
}

export function ArrowUR({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
  );
}

/**
 * Heading whose words rise out of a mask when it enters the viewport.
 * `lines` are rendered as block lines; `accent` words get `accentClass`.
 */
export function Words({
  as: Tag = "h2",
  lines,
  className = "",
  lineClass = [],
  accent = [],
  accentClass = "text-[color:var(--royal)]",
  delay = 0,
  id,
}: {
  as?: ElementType;
  lines: string[];
  className?: string;
  lineClass?: string[];
  accent?: string[];
  accentClass?: string;
  delay?: number;
  id?: string;
}) {
  let i = 0;
  return (
    <Tag id={id} data-nd="words" className={className} style={{ "--d": delay } as CSSProperties}>
      {lines.map((line, li) => (
        <span key={li} className={`block ${lineClass[li] ?? ""}`}>
          {line.split(" ").map((w, wi, arr) => (
            <span key={wi}>
              <span className="nd-w">
                <span style={{ "--i": i++ } as CSSProperties} className={accent.includes(w) ? accentClass : undefined}>{w}</span>
              </span>
              {wi < arr.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Responsive picture (AVIF when available, then WebP). Lazy unless `priority`. */
export function Pic({
  image,
  alt,
  sizes,
  className = "",
  imgClass = "",
  priority = false,
  style,
}: {
  image: Img;
  alt: string;
  sizes: string;
  className?: string;
  imgClass?: string;
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    <picture className={className}>
      {image.avif ? <source type="image/avif" srcSet={image.avif} sizes={sizes} /> : null}
      <source type="image/webp" srcSet={image.srcSet} sizes={sizes} />
      { }
      <img
        src={image.src}
        alt={alt}
        width={image.w}
        height={image.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imgClass}
        style={style}
      />
    </picture>
  );
}

/** One observer for every [data-nd] element on the page: adds `.in` once it enters the viewport. */
export function NdMotion() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".nd [data-nd]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    // A clip-path that hides an element also zeroes its intersection, so clipped reveals are
    // observed through their parent.
    const targets = new Map<Element, HTMLElement[]>();
    els.forEach((e) => {
      const t = e.dataset.nd === "clip" && e.parentElement ? e.parentElement : e;
      targets.set(t, [...(targets.get(t) ?? []), e]);
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { targets.get(e.target)?.forEach((x) => x.classList.add("in")); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    targets.forEach((_, t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return null;
}
