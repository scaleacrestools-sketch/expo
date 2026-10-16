import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CreativeStudio } from "@/components/CreativeStudio";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Creative Studio",
  description: "ScaleAcres Creative Studio: AI videos, social media videos and ad videos that turn ideas into visual stories.",
  alternates: { canonical: "/creative-studio/" },
};

export default function CreativeStudioPage() {
  return (
    <>
      <PageHero eyebrow="The creative lab" title={<>Made to<br />be seen.</>} description="Ideas don't have to stay on paper. We turn concepts into compelling visual stories through creative production, AI-powered content and videos that get noticed." />
      <CreativeStudio showCta={false} />
      <ContactCTA withForm={false} />
    </>
  );
}
