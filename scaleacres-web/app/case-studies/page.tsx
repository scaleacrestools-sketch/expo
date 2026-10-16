import type { Metadata } from "next";
import { protectedTitle } from "@/content/seo/pages";
import { PageHero } from "@/components/PageHero";
import { SelectedWork } from "@/components/SelectedWork";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: { absolute: protectedTitle("/case-studies/")! },
  description: "Selected ScaleAcres projects: brand identities, digital experiences and campaigns for ambitious brands.",
  alternates: { canonical: "/case-studies/" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="The work speaks" title={<>Proof is in<br />the work.</>} description="Every brand has a different story. Here's a look at the experiences, identities and campaigns we've helped bring to life." />
      <SelectedWork />
      <CaseStudies />
      <ContactCTA withForm={false} />
    </>
  );
}
