import type { Metadata } from "next";
import { HeroVideo } from "@/components/HeroVideo";
import { EditorialIntro } from "@/components/EditorialIntro";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { SelectedWork } from "@/components/SelectedWork";
import { HowWeWork } from "@/components/HowWeWork";
import { ClientLogoShowcase } from "@/components/ClientLogoShowcase";
import { AdvantageBento } from "@/components/AdvantageBento";
import { RealEstateDNA } from "@/components/RealEstateDNA";
import { FAQ } from "@/components/FAQ";
import { homepageSeo } from "@/content/seo/homepage";

export const metadata: Metadata = {
  // PROTECTED: identical to the live homepage title. Do not change without SEO approval.
  title: { absolute: homepageSeo.title.value },
  // LAUNCH BLOCKER: replace with the exact live meta description from the crawl export.
  // Until then this uses existing homepage body copy, never new marketing copy.
  description: homepageSeo.metaDescription.value || homepageSeo.intro.value,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Section order (brief): 01 Hero · 02 Intro · 03 Services · 04 Work · 05 How we work ·
          06 Clients · 07 Advantage · 08 Real estate · 09 FAQs · 10 Contact CTA + footer (layout) */}
      <HeroVideo />
      <EditorialIntro />
      <ServicesShowcase />
      <SelectedWork limit={6} />
      <HowWeWork />
      <ClientLogoShowcase />
      <AdvantageBento />
      <RealEstateDNA />
      <FAQ />
    </>
  );
}
