import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AboutIntro } from "@/components/AboutIntro";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "ScaleAcres is an independent creative, digital and growth agency based in Delhi, Agra and Bangalore. Strategy, design, technology and performance under one roof.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About ScaleAcres" title={<>Independent by<br />design.</>} description={site.description} />
      <AboutIntro />
      <Reveal as="section" id="team" className="section-y bg-charcoal text-ivory">
        <div className="container-x mx-auto grid max-w-[110rem] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-coral" data-reveal>The team</p>
            <h2 className="h2 mt-6" data-split-reveal>People who build.</h2>
          </div>
          <div className="space-y-6 text-[1.0625rem] leading-[1.7] text-stone lg:col-span-7" data-reveal>
            <p>ScaleAcres was started by two founders who moved from Agra to Delhi and built the agency from the ground up. Today the team works across strategy, design, development, content and performance from {site.offices.join(", ")}.</p>
            <p>We help ambitious brands create memorable identities, build powerful digital experiences and connect with the right audiences. Real estate is one of our deepest industry strengths, and the same thinking serves businesses across many sectors.</p>
            <p className="text-sm text-grey">Team profiles and photographs will be published here once approved by each team member.</p>
          </div>
        </div>
      </Reveal>
      <ProcessTimeline />
      <ContactCTA withForm={false} />
    </>
  );
}
