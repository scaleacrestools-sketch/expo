import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/brand";

/**
 * Official ScaleAcres logo. Renders the supplied artwork at its original proportions.
 * While the files are missing it renders a plain text fallback with a visible flag,
 * so nobody mistakes it for the real lockup.
 */
export function Logo({ tone = "light", className = "", withLink = true }: { tone?: "light" | "dark"; className?: string; withLink?: boolean }) {
  const src = tone === "light" ? brand.logo.reversed : brand.logo.primary;
  const content = brand.logoFilesPresent ? (
    <Image
      src={src}
      alt="ScaleAcres — Scaling with System and Automation"
      width={brand.logo.width}
      height={brand.logo.height}
      priority
      className={`h-9 w-auto md:h-10 ${className}`}
    />
  ) : (
    <span className={`inline-flex flex-col leading-none ${tone === "light" ? "text-white" : "text-ink"} ${className}`}>
      <span className="text-[1.05rem] font-extrabold uppercase tracking-[0.06em]">
        Scale<span className="text-blue">Acres</span>
      </span>
      <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.2em] opacity-70">{brand.descriptor}</span>
      <span className="sr-only">Logo file pending</span>
    </span>
  );
  if (!withLink) return content;
  return (
    <Link href="/" aria-label="ScaleAcres — Home" className="inline-flex focus-visible:outline-blue">
      {content}
    </Link>
  );
}
