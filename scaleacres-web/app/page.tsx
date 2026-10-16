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
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name}® — ${site.tagline}`,
  description: "We build unforgettable brands, bold digital experiences and campaigns designed to make an impact. Branding, web, SEO, performance marketing, social, video and technology from Delhi, Agra and Bangalore.",
  alternates: { canonical: "/" },
};

/**
 * Hero media. Replace the placeholder with the ScaleAcres showreel export
 * (see docs/asset-checklist.md). Provide a WebM alongside the MP4 when available.
 */
const heroMedia = {
  sources: [
    { src: "/videos/showreel-placeholder.webm", type: "video/webm" },
    { src: "/videos/showreel-placeholder.mp4", type: "video/mp4" },
  ],
  mobileSources: [
    { src: "/videos/placeholder-portrait.webm", type: "video/webm" },
    { src: "/videos/placeholder-portrait.mp4", type: "video/mp4" },
  ],
  poster: "/images/hero-poster.svg",
  mobilePoster: "/images/hero-poster-mobile.svg",
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
      <ProcessTimeline />
      <CaseStudies />
      <BrandStatement />
      <Insights />
      <ContactCTA />
    </>
  );
}
