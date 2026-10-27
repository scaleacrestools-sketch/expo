import type { Metadata } from "next";
import { homepageSeo } from "@/content/seo/homepage";
import "@/components/nd/nd.css";
import { NdMotion } from "@/components/nd/ui";
import { NdHero } from "@/components/nd/NdHero";
import { NdManifesto } from "@/components/nd/NdManifesto";
import { NdAbout } from "@/components/nd/NdAbout";

export const metadata: Metadata = {
  // PROTECTED: identical to the live homepage title. Do not change without SEO approval.
  title: { absolute: homepageSeo.title.value },
  // PROTECTED: identical to the live homepage meta description (captured 17 Oct 2026).
  description: homepageSeo.metaDescription.value,
  alternates: { canonical: "/" },
};

/**
 * Homepage — built section by section for approval. This stage: the first three sections as one
 * continuous introduction. The remaining sections (components/nd/*) return as each is approved.
 *
 * 01 Hero (Brand Black, motion reel) → 02 Creative statement (Brand Black) → 03 Who we are (white,
 * opening out of the black section). Header: components/nd/NdHeader, chosen by components/Header on "/".
 */
export default function HomePage() {
  return (
    <div className="nd">
      <NdMotion />
      <NdHero />
      <NdManifesto />
      {/* Brand Black behind the white panel so it opens out of the statement section */}
      <div className="bg-[color:var(--ink)]">
        <NdAbout />
      </div>
    </div>
  );
}
