import type { Metadata } from "next";
import { protectedTitle } from "@/content/seo/pages";
import { PageHero } from "@/components/PageHero";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: protectedTitle("/our-team/")! },
  description: "The people behind ScaleAcres: strategists, designers, developers and performance marketers working from Delhi, Agra and Bangalore.",
  alternates: { canonical: "/our-team/" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero eyebrow="The team" title={<>People who<br />build.</>} description="Strategists, designers, developers and performance marketers who move brands from idea to execution." />
      <Reveal as="section" className="section-y bg-white text-ink">
        <div className="container-x mx-auto grid max-w-[110rem] gap-10 lg:grid-cols-12">
          <div className="space-y-6 text-[1.0625rem] leading-[1.7] text-grey-dark lg:col-span-7" data-reveal>
            <p>ScaleAcres was started by two founders who moved from Agra to Delhi and built the agency from the ground up. Today the team works across {site.offices.join(", ")}.</p>
            <p className="text-sm text-grey">Team profiles from the current page are migrated through the content parity process, once each team member approves publication.</p>
          </div>
        </div>
      </Reveal>
      <ContactCTA withForm={false} />
    </>
  );
}
