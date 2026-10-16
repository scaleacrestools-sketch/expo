"use client";

import { useRef, type ReactNode } from "react";
import { splitWords, useGsap } from "@/lib/motion";

/**
 * Wraps a section and animates descendants marked with:
 *  - [data-reveal]        fade/translate in (staggered within the section)
 *  - [data-split-reveal]  staggered word reveal
 * Both are scroll-triggered once, and rendered in final state for reduced motion / no JS.
 */
export function Reveal({ children, className = "", as: Tag = "div", id }: { children: ReactNode; className?: string; as?: "div" | "section"; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, el }) => {
    const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const splits = el.querySelectorAll<HTMLElement>("[data-split-reveal]");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 78%", once: true },
    });
    splits.forEach((s, i) => {
      const words = splitWords(s);
      tl.to(words, { y: 0, duration: 1.1, stagger: 0.045, ease: "expo.out" }, i * 0.1);
    });
    if (items.length) tl.to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" }, 0.15);
  });
  // Pre-render words statically so there is no layout shift before JS runs.
  return (
    <Tag ref={ref as never} className={className} id={id}>
      {children}
    </Tag>
  );
}
