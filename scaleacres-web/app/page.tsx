import type { Metadata } from "next";
import { HeroVideo } from "@/components/HeroVideo";
import { EditorialIntro } from "@/components/EditorialIntro";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { WorkShowcase } from "@/components/WorkShowcase";
import { HowWeWork } from "@/components/HowWeWork";
import { ClientLogoShowcase } from "@/components/ClientLogoShowcase";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { ContactBanner } from "@/components/ContactBanner";
import { homepageSeo } from "@/content/seo/homepage";

export const metadata: Metadata = {
  // PROTECTED: identical to the live homepage title. Do not change without SEO approval.
  title: { absolute: homepageSeo.title.value },
  // PROTECTED: identical to the live homepage meta description (captured 17 Oct 2026).
  description: homepageSeo.metaDescription.value,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Section order (approved brief — do not reorder without approval):
          01 Hero · 02 Who we are · 03 Eight services · 04 Creative showcase · 05 How we work ·
          06 Client logo wall · 07 Client video testimonials · 08 FAQs · 09 Contact CTA ·
          10 Footer (site-wide, in the layout) */}
      <HeroVideo />
      <EditorialIntro />
      <ServicesShowcase />
      <WorkShowcase />
      <HowWeWork />
      <ClientLogoShowcase />
      <Testimonials />
      <FAQ />
      <ContactBanner />
    </>
  );
}
