"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { ensureGsap, prefersReducedMotion, useGsap } from "@/lib/motion";

/**
 * Shared homepage motion primitives. Everything here degrades to a static, fully visible
 * layout without JS or with prefers-reduced-motion.
 */

const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Magnetic hover: the element (and an optional inner label) drift toward the pointer. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [strength]);
  return <span ref={ref} className={`inline-block will-change-transform ${className}`}>{children}</span>;
}

/**
 * Display text whose words rise out of a mask when scrolled into view.
 * `lines` is an array of lines; each line an array of words. Words listed in `accent` get the accent class.
 */
export function MaskLines({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  accent = [],
  accentClassName = "text-blue",
  start = "top 82%",
  stagger = 0.06,
  id,
}: {
  lines: string[][];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** One class string for every line, or one per line. */
  lineClassName?: string | string[];
  accent?: string[];
  accentClassName?: string;
  start?: string;
  stagger?: number;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const words = el.querySelectorAll<HTMLElement>(".mw > span");
    gsap.fromTo(words, { yPercent: 112, y: 0 }, { yPercent: 0, y: 0, duration: 1.25, ease: "power4.out", stagger, scrollTrigger: { trigger: el, start, once: true } });
  });
  return (
    <Tag ref={ref as never} id={id} className={className}>
      {lines.map((line, li) => (
        <span key={li} className={`block ${Array.isArray(lineClassName) ? (lineClassName[li] ?? "") : lineClassName}`}>
          {line.map((w, wi) => (
            <span key={wi} className="mw inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className={`mask-word inline-block ${accent.includes(w) ? accentClassName : ""}`}>{w}</span>
              {wi < line.length - 1 ? " " : null}
            </span>
          ))}
          {li < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Muted looping video that only downloads and plays while on screen. */
export function InViewVideo({ src, poster, className = "", style, label }: { src: string; poster: string; className?: string; style?: CSSProperties; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (prefersReducedMotion()) return; // poster only
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) v.setAttribute("src", src);
          v.play().catch(() => undefined);
        } else v.pause();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      tabIndex={-1}
      className={className}
      style={style}
    />
  );
}

/** Small "° Label" kicker used across the homepage (Arpeggio-style degree mark in Royal). */
export function Kicker({ children, tone = "dark", className = "" }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.22em] ${tone === "dark" ? "text-white/70" : "text-steel"} ${className}`}>
      <span aria-hidden="true" className="relative -top-[0.35em] text-[0.9rem] leading-none text-blue">°</span>
      {children}
    </p>
  );
}
