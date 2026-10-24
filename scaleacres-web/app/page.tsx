import type { Metadata } from "next";
import { homepageSeo } from "@/content/seo/homepage";
import "@/components/nd/nd.css";
import { NdMotion } from "@/components/nd/ui";
import { NdHero } from "@/components/nd/NdHero";
import { NdAbout } from "@/components/nd/NdAbout";
import { NdServices } from "@/components/nd/NdServices";
import { NdWebsites } from "@/components/nd/NdWebsites";
import { NdVideos } from "@/components/nd/NdVideos";
import { NdBrands } from "@/components/nd/NdBrands";
import { NdWork } from "@/components/nd/NdWork";
import { NdProcess } from "@/components/nd/NdProcess";
import { NdClients } from "@/components/nd/NdClients";
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
 * Homepage — Neiden-inspired direction (proposal under review).
 * The previous homepage (components/home/*) is untouched and recoverable from git (1a7a591a).
 *
 * 01 Hero · 02 Who we are · 03 Services · 04 Website design · 05 Videos · 06 Branding ·
 * 07 Selected work · 08 How we work · 09 Clients & testimonials · 10 Contact · 11 Footer
 * Header: components/nd/NdHeader (logo left, Menu right), chosen by components/Header on "/".
 */
export default function HomePage() {
  return (
    <div className="nd">
      <NdMotion />
      <NdHero />
      <NdAbout />
      <NdServices />
      <NdWebsites />
      <NdVideos />
      <NdBrands />
      <NdWork />
      <NdProcess />
      <NdClients />
      <NdContact />
      <NdFooter />
    </div>
  );
}
