import type { Metadata } from "next";
import { homepageSeo } from "@/content/seo/homepage";
import "@/components/nd/nd.css";
import { NdMotion } from "@/components/nd/ui";
import { NdHero } from "@/components/nd/NdHero";
import { NdManifesto } from "@/components/nd/NdManifesto";
import { NdAbout } from "@/components/nd/NdAbout";
import { NdLeaders } from "@/components/nd/NdLeaders";
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
 * Homepage — the combined draft: sections chosen from the first (editorial) homepage and the
 * Neiden-inspired homepage, in the order set by the draft, with the new white footer.
 * The previous homepages are recoverable from git (1a7a591a, e041c532).
 *
 * 01 Hero · 02 Manifesto · 03 Who we are · 04 Market leaders · 05 What we build ·
 * 06 Website design · 07 Videos · 08 Branding · 09 True stories · 10 Selected work ·
 * 11 From brief to launch · 12 Let's talk · 13 Footer
 * Header: components/nd/NdHeader (logo left, Menu right), chosen by components/Header on "/".
 */
export default function HomePage() {
  return (
    <div className="nd">
      <NdMotion />
      <NdHero />
      <NdManifesto />
      <NdAbout />
      <NdLeaders />
      <NdServices />
      <NdWebsites />
      <NdVideos />
      <NdBrands />
      <NdClients />
      <NdWork />
      <NdProcess />
      <NdContact />
      <NdFooter />
    </div>
  );
}
