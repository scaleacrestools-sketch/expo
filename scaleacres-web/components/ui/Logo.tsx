import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/brand";
import { proposalLogo } from "@/content/themes";

/**
 * Official ScaleAcres logo at its original proportions (light/reversed version on dark grounds).
 * Until the artwork files are supplied, a typographic stand-in is shown with a visible
 * "logo file pending" tag, so it is never mistaken for the real lockup.
 */
export function Logo({ tone = "light", className = "", withLink = true, size = "md" }: { tone?: "light" | "dark"; className?: string; withLink?: boolean; size?: "md" | "lg" }) {
  const src = tone === "light" ? brand.logo.reversed : brand.logo.primary;
  const h = size === "lg" ? "h-10 sm:h-12 md:h-[3.25rem]" : "h-9 md:h-11";
  const ground = tone === "light" ? "dark" : "light";
  const content = brand.logoFilesPresent ? (
    <span className="relative inline-flex items-center gap-2">
      <Image
        src={src}
        alt="ScaleAcres — Scaling with System and Automation"
        width={brand.logo.width}
        height={brand.logo.height}
        priority
        className={`logo-official ${h} w-auto ${className}`}
      />
      {/* Colour-exploration PROPOSALS (not approved). Hidden unless previewing with logo=proposal; lazy + display:none, so never downloaded otherwise. */}
      {(["reddash", "midnight", "olive"] as const).map((t) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={t} src={proposalLogo(t, ground)} alt="ScaleAcres logo — colour proposal" width={brand.logo.width} height={brand.logo.height} loading="lazy" className={`logo-proposal logo-proposal--${t} ${h} w-auto ${className}`} />
      ))}
      <span className="logo-proposal-tag rounded-sm border border-current px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.14em] opacity-70">Proposal</span>
    </span>
  ) : (
    <span className={`inline-flex items-start gap-3 ${tone === "light" ? "text-white" : "text-ink"} ${className}`}>
      <span className="inline-flex flex-col leading-none">
        <span className={`${size === "lg" ? "text-[clamp(1.375rem,1rem+1vw,2rem)]" : "text-[clamp(1.125rem,1rem+0.5vw,1.5rem)]"} font-black uppercase tracking-[0.02em]`}>
          Scale<span className="text-blue">Acres</span>
        </span>
        <span className="mt-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.22em] opacity-75">{brand.descriptor}</span>
      </span>
      <span className="mt-0.5 hidden rounded-sm border border-current px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.14em] opacity-60 sm:inline">
        Logo file pending
      </span>
    </span>
  );
  if (!withLink) return content;
  return (
    <Link href="/" aria-label="ScaleAcres — Home" className="inline-flex focus-visible:outline-blue">
      {content}
    </Link>
  );
}
