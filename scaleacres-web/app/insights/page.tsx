import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Insights } from "@/components/Insights";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Insights",
  description: "Ideas, guides and opinions from the ScaleAcres team on branding, websites, SEO and performance marketing.",
  alternates: { canonical: "/insights/" },
};

export default function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="Thinking out loud" title={<>Ideas worth<br />exploring.</>} description="Our latest articles live on the ScaleAcres blog, which continues at its existing address so nothing you've bookmarked or found in search goes missing." />
      <Insights />
      <ContactCTA withForm={false} />
    </>
  );
}
