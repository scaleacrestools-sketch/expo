import type { Metadata } from "next";
import { HeroVideo } from "@/components/HeroVideo";
import { ClientLogoShowcase } from "@/components/ClientLogoShowcase";
import { AboutIntro } from "@/components/AboutIntro";
import { ServiceAccordion } from "@/components/ServiceAccordion";
import { SelectedWork } from "@/components/SelectedWork";
import { CreativeStudio } from "@/components/CreativeStudio";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { CaseStudies } from "@/components/CaseStudies";
import { BrandStatement } from "@/components/BrandStatement";
import { Insights } from "@/components/Insights";
import { ContactCTA } from "@/components/ContactCTA";
import { RealEstateDNA } from "@/components/RealEstateDNA";
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
      <HeroVideo />
      <ClientLogoShowcase />
      <AboutIntro />
      <ServiceAccordion />
      <SelectedWork />
      <CreativeStudio />
      <RealEstateDNA />
      <ProcessTimeline />
      <CaseStudies />
      <BrandStatement />
      <Insights />
      <ContactCTA />
    </>
  );
}
