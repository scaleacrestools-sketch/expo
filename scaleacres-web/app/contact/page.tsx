import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Let's Talk",
  description: `Start a project with ScaleAcres. Call ${site.phones[0].number}, email ${site.email} or send us a brief.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Let's make something great" title={<>Got a big idea?<br />Let&apos;s make it happen.</>} description="A new brand, a better digital experience, or your next big campaign—whatever you're building, we'd love to hear about it." />
      <Reveal as="section" className="section-y bg-charcoal pt-0 text-ivory">
        <div className="container-x mx-auto grid max-w-[110rem] gap-16 lg:grid-cols-12">
          <aside className="space-y-10 lg:col-span-4" data-reveal>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-coral">Email</p>
              <a href={`mailto:${site.email}`} className="mt-2 block text-lg font-semibold hover:text-coral">{site.email}</a>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-coral">Phone</p>
              {site.phones.map((p) => (<a key={p.href} href={p.href} className="mt-2 block text-lg font-semibold hover:text-coral">{p.number} <span className="text-xs font-normal uppercase tracking-[0.14em] text-grey">{p.label}</span></a>))}
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-coral">Studio</p>
              <address className="mt-2 not-italic leading-relaxed text-stone">{site.address.lines.map((l) => (<span key={l} className="block">{l}</span>))}</address>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-grey">{site.offices.join(" · ")}</p>
            </div>
          </aside>
          <div id="enquiry" className="lg:col-span-8" data-reveal>
            <ContactForm />
          </div>
        </div>
      </Reveal>
    </>
  );
}
