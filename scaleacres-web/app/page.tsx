import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { Manifesto } from "@/components/home/Manifesto";
import { ServicesStack } from "@/components/home/ServicesStack";
import { MarketLeaders } from "@/components/home/MarketLeaders";
import { WebsiteShowcase } from "@/components/home/WebsiteShowcase";
import { VideoStudio } from "@/components/home/VideoStudio";
import { ClientLogoShowcase } from "@/components/ClientLogoShowcase";
import { HowWeWork2 } from "@/components/home/HowWeWork2";
import { Testimonials } from "@/components/Testimonials";
import { FinalCta } from "@/components/home/FinalCta";
import { homepageSeo } from "@/content/seo/homepage";

export const metadata: Metadata = {
  // PROTECTED: identical to the live homepage title. Do not change without SEO approval.
  title: { absolute: homepageSeo.title.value },
  // PROTECTED: identical to the live homepage meta description (captured 17 Oct 2026).
  description: homepageSeo.metaDescription.value,
  alternates: { canonical: "/" },
};

/**
 * Homepage v2 — "editorial cinematic" direction (proposal, awaiting approval).
 * The previous homepage (HeroVideo, EditorialIntro, ServicesShowcase, WorkShowcase, HowWeWork,
 * FAQ, ContactBanner) is untouched in /components and recoverable from git (commit fb724e0f).
 *
 * 01 Hero · 02 Who we are · 03 Our Services · 04 We Don't Create Brands · 05 Website Design ·
 * 06 Real Estate Videos · 07 Clients · 08 How we work · 09 Client stories · 10 Start a project ·
 * Footer (site-wide)
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Manifesto />
      <ServicesStack />
      <MarketLeaders />
      <WebsiteShowcase />
      <VideoStudio />
      <div className="hv2">
        <ClientLogoShowcase />
      </div>
      <HowWeWork2 />
      <div className="hv2">
        <Testimonials />
      </div>
      <FinalCta />
    </>
  );
}
