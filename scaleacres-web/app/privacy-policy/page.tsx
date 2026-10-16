import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy/" }, robots: { index: true, follow: true } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero tone="light" eyebrow="Legal" title="Privacy Policy" description="How ScaleAcres handles the information you share with us through this website." />
      <section className="bg-offwhite pb-[var(--section-y)] text-ink">
        <div className="container-x mx-auto max-w-[110rem]">
          <div className="max-w-[70ch] space-y-8 text-[1.0625rem] leading-[1.75] text-ink/80">
            <p className="text-sm text-ink/50">This is a working draft for the new website. Please have it reviewed by a legal advisor and align it with the policy currently published on scaleacres.com before launch.</p>
            <H>What we collect</H>
            <p>When you submit the enquiry form we collect your name, work email, phone number, company name, the service you are interested in and your project description. We also record the time of submission and the IP address the request came from, which we use only for spam prevention.</p>
            <H>How we use it</H>
            <p>We use your details to respond to your enquiry and, where you ask us to, to prepare a proposal. We do not sell personal data and we do not share it with third parties except service providers who deliver our email and form handling.</p>
            <H>Analytics</H>
            <p>If analytics is enabled on this site, it is configured with IP anonymisation and used only to understand how the site is used in aggregate.</p>
            <H>Your rights</H>
            <p>You can ask us to access, correct or delete your personal data at any time by emailing <a href={`mailto:${site.email}`} className="underline underline-offset-2">{site.email}</a>.</p>
            <H>Contact</H>
            <address className="not-italic">{site.legalName}<br />{site.address.lines.map((l) => (<span key={l}>{l}<br /></span>))}</address>
          </div>
        </div>
      </section>
    </>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="pt-4 text-[1.5rem] font-bold tracking-[-0.01em]">{children}</h2>;
}
