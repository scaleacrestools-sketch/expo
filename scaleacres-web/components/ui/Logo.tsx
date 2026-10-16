import Link from "next/link";

/**
 * Brand lockup. The official logo master (Scaleacres-Logo-1024x333.webp / white
 * variant) is listed in docs/asset-checklist.md and should replace the SVG wordmark
 * in /public/brand once exported. The "SA" mark colour (#1CA6DC) comes from the brand kit.
 */
export function Logo({ tone = "light", className = "", withLink = true }: { tone?: "light" | "dark"; className?: string; withLink?: boolean }) {
  const fg = tone === "light" ? "text-ivory" : "text-charcoal";
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${fg} ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 40 40" className="h-8 w-8 shrink-0">
        <rect x="3" y="20" width="10" height="17" rx="1" fill="currentColor" />
        <rect x="15" y="10" width="10" height="27" rx="1" fill="#1CA6DC" />
        <rect x="27" y="3" width="10" height="34" rx="1" fill="currentColor" />
      </svg>
      <span className="text-[1.05rem] font-800 font-extrabold uppercase leading-none tracking-[0.08em]">
        ScaleAcres<sup className="ml-0.5 text-[0.5em] font-semibold">®</sup>
      </span>
    </span>
  );
  if (!withLink) return content;
  return (
    <Link href="/" aria-label="ScaleAcres — Home" className="inline-flex focus-visible:outline-coral">
      {content}
    </Link>
  );
}
