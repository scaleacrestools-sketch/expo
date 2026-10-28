import type { Metadata } from "next";
import { homepageSeo } from "@/content/seo/homepage";
import "@/components/nd/nd.css";
import { NdMotion } from "@/components/nd/ui";
import { NdHero } from "@/components/nd/NdHero";
import { NdManifesto } from "@/components/nd/NdManifesto";
import { NdAbout } from "@/components/nd/NdAbout";
import { NdServices } from "@/components/nd/NdServices";
import { NdShowcase } from "@/components/nd/NdShowcase";
import { NdWebsites } from "@/components/nd/NdWebsites";
import { NdTestimonials } from "@/components/nd/NdTestimonials";
import { NdVideos } from "@/components/nd/NdVideos";
import { NdBrands } from "@/components/nd/NdBrands";
import { NdWork } from "@/components/nd/NdWork";
import { NdFaq } from "@/components/nd/NdFaq";
import { NdContact } from "@/components/nd/NdContact";
import { NdFooter } from "@/components/nd/NdFooter";

export const metadata: Metadata = {
  // PROTECTED: identical to the live homepage title. Do not change without SEO approval.
  title: { absolute: homepageSeo.title.value },
  // PROTECTED: identical to the live homepage meta description (captured 17 Oct 2026).
  description: homepageSeo.metaDescription.value,
  alternates: { canonical: "/" },
};

/**
 * Homepage — complete, in the approved order:
 * 01 Hero (Brand Black, motion reel) → 02 Creative statement (Brand Black) → 03 Who we are (white,
 * opening out of the black section) → 04 Our services (white, stacked Brand Black cards) → 05 Our
 * work (warm white, four project covers) → 06 Website design (Brand Black, live sites) → 07 Client
 * success stories (white, video testimonials) → 08 Real estate videos (Brand Black) → 09 Branding /
 * market leaders (Mist) → 10 Selected work (Brand Black) → 11 FAQ (white) → 12 Let's talk (Brand
 * Black, enquiry form) → 13 Footer (white, wordmark across the hand-over).
 * Header: components/nd/NdHeader, chosen by components/Header on "/".
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
      <NdServices />
      <NdShowcase />
      <NdWebsites />
      <NdTestimonials />
      <NdVideos />
      <NdBrands />
      <NdWork />
      <NdFaq />
      <NdContact />
      <NdFooter />
    </div>
  );
}
