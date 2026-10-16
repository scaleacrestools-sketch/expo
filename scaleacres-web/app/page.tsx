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

/**
 * Hero media. Replace the placeholder with the ScaleAcres showreel export
 * (see docs/asset-checklist.md). Provide a WebM alongside the MP4 when available.
 */
const heroMedia = {
  sources: [
    { src: "/videos/showreel.webm", type: "video/webm" },
    { src: "/videos/showreel.mp4", type: "video/mp4" },
  ],
  mobileSources: [
    { src: "/videos/showreel-portrait.webm", type: "video/webm" },
    { src: "/videos/showreel-portrait.mp4", type: "video/mp4" },
  ],
  poster: "/images/hero-poster.jpg",
  mobilePoster: "/images/hero-poster-mobile.jpg",
  placeholder: true,
};

export default function HomePage() {
  return (
    <>
      <HeroVideo media={heroMedia} />
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
