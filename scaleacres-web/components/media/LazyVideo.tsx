"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted, looping background video that only downloads when it approaches the viewport,
 * pauses when it leaves, never autoplays under reduced motion, and reports load failure
 * with a visible label instead of an empty box.
 */
export function LazyVideo({
  src,
  className = "",
  label,
  rootMargin = "300px",
  loop = true,
}: {
  src: string;
  className?: string;
  /** Accessible description of the footage. */
  label: string;
  rootMargin?: string;
  loop?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (!reduce) v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { rootMargin },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      <video
        ref={ref}
        src={active ? src : undefined}
        muted
        loop={loop}
        playsInline
        preload="none"
        aria-label={label}
        onError={() => setFailed(true)}
        onLoadedData={(e) => {
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) e.currentTarget.play().catch(() => undefined);
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {failed ? (
        <span className="absolute inset-0 grid place-items-center p-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          Video unavailable — check the Higgsfield link
        </span>
      ) : null}
    </div>
  );
}
