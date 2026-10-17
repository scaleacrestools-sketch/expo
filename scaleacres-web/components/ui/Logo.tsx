import Link from "next/link";
import { brand } from "@/content/brand";

type Variant = "primary" | "reversed" | "white";

/**
 * Official ScaleAcres logo from the brand kit (SVG). Choose the version by background:
 * primary on light, reversed on black/navy, white on royal, photography and video.
 * `tone` is kept for existing call sites: "light" = light-coloured logo for dark grounds.
 * Minimum sizes (guidelines ch. 04): full logo 240 px wide, no-strapline 120 px.
 */
export function Logo({
  tone = "light",
  variant,
  strapline = true,
  className = "",
  withLink = true,
  size = "md",
}: {
  tone?: "light" | "dark";
  variant?: Variant;
  strapline?: boolean;
  className?: string;
  withLink?: boolean;
  size?: "md" | "lg";
}) {
  const v: Variant = variant ?? (tone === "light" ? "reversed" : "primary");
  const src =
    v === "white" ? brand.logo.white
    : v === "reversed" ? (strapline ? brand.logo.reversed : brand.logo.reversedNoStrapline)
    : strapline ? brand.logo.primary : brand.logo.primaryNoStrapline;
  const w = strapline ? brand.logo.width : brand.logo.noStraplineWidth;
  // Full lockup must render ≥ 240 px wide for a legible strapline.
  const h = strapline
    ? size === "lg" ? "h-[4.75rem] md:h-[5.25rem]" : "h-[4.75rem]"
    : size === "lg" ? "h-11 md:h-[3.25rem]" : "h-10 md:h-11";
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="ScaleAcres — Scaling with System and Automation" width={w} height={brand.logo.height} className={`${h} w-auto ${className}`} fetchPriority="high" decoding="async" />
  );
  if (!withLink) return img;
  return (
    <Link href="/" aria-label="ScaleAcres — Home" className="inline-flex focus-visible:outline-blue">
      {img}
    </Link>
  );
}
