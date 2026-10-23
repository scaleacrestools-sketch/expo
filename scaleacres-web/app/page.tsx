import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { Manifesto } from "@/components/home/Manifesto";
import { ServicesStack } from "@/components/home/ServicesStack";
import { MarketLeaders } from "@/components/home/MarketLeaders";
import { WebsiteShowcase } from "@/components/home/WebsiteShowcase";
import { VideoStudio } from "@/components/home/VideoStudio";
import { ClientLogoShowcase } from "@/components/ClientLogoShowcase";
import { FeaturedWork } from "@/components/home/FeaturedWork";
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
 * 01 Hero · 02 Who we are · 03 Our Services · 04 Website Design · 05 Real Estate Videos ·
 * 06 We Don't Create Brands · 07 Featured Work · 08 Clients · 09 Testimonials · 10 Contact CTA ·
 * 11 Footer (site-wide)
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Manifesto />
      <ServicesStack />
      <WebsiteShowcase />
      <VideoStudio />
      <MarketLeaders />
      <FeaturedWork />
      <div className="hv2">
        <ClientLogoShowcase />
      </div>
      <div className="hv2">
        <Testimonials />
      </div>
      <FinalCta />
    </>
  );
}
