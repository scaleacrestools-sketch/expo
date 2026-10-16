import type { Metadata } from "next";
import { protectedTitle } from "@/content/seo/pages";
import { PageHero } from "@/components/PageHero";
import { ServiceAccordion } from "@/components/ServiceAccordion";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: { absolute: protectedTitle("/our-services/")! },
  description: "Website design & development, SEO, performance marketing, branding, social media, video production, ecommerce and custom software — eight ways ScaleAcres helps brands stand out and scale.",
  alternates: { canonical: "/our-services/" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Our expertise" title={<>Eight ways to<br />stand out.</>} description="From the way a brand looks to the way it performs, we combine creative thinking, technology and marketing to make every interaction matter." />
      <ServiceAccordion defaultOpen={null} />
      <ContactCTA />
    </>
  );
}
