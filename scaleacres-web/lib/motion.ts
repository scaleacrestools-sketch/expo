"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";

let registered = false;
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "expo.out", duration: 1 });
    registered = true;
  }
  return gsap;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scoped GSAP context bound to a container ref. Every tween/ScrollTrigger created in
 * `setup` is reverted on unmount, so no listeners leak between navigations.
 * `setup` is skipped entirely when the user prefers reduced motion; the caller's CSS
 * must render the final state in that case (see `[data-reveal]` rules).
 */
export function useGsap<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; el: T }) => void | (() => void),
  deps: DependencyList = [],
) {
  const cleanupRef = useRef<void | (() => void)>(undefined);
  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.add("reduced-motion");
      return;
    }
    const g = ensureGsap();
    const ctx = g.context(() => {
      cleanupRef.current = setup({ gsap: g, ScrollTrigger, el });
    }, el);
    return () => {
      cleanupRef.current?.();
      ctx.revert();
    };
  }, deps);
}

/** Wrap each word of an element's text in masked spans for staggered reveals. */
export function splitWords(el: HTMLElement) {
  if (el.dataset.split === "true") return Array.from(el.querySelectorAll<HTMLElement>(".word > span"));
  const lines = Array.from(el.childNodes);
  const frag = document.createDocumentFragment();
  lines.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = (node.textContent ?? "").split(/(\s+)/);
      words.forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(" ")); return; }
        const outer = document.createElement("span");
        outer.className = "word";
        const inner = document.createElement("span");
        inner.textContent = w;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
    } else if (node.nodeName === "BR") {
      frag.appendChild(document.createElement("br"));
    } else {
      frag.appendChild(node.cloneNode(true));
    }
  });
  el.replaceChildren(frag);
  el.dataset.split = "true";
  el.classList.add("reveal-words");
  return Array.from(el.querySelectorAll<HTMLElement>(".word > span"));
}
