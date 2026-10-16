import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export function ContactCTA({ withForm = true }: { withForm?: boolean }) {
  return (
    <Reveal as="section" id="contact" className="section-y bg-charcoal text-ivory">
      <div className="container-x mx-auto grid max-w-[110rem] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow="Let's make something great" title={<>Got a big idea?<br />Let&apos;s make it happen.</>} description="A new brand, a better digital experience, or your next big campaign—whatever you're building, we'd love to hear about it." />
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <ArrowLink href={withForm ? "#enquiry" : "/contact"} variant="coral" size="lg">Let&apos;s Talk</ArrowLink>
            <ArrowLink href="/work" variant="outline" size="lg" className="text-ivory">View Our Work</ArrowLink>
          </div>
        </div>
        {withForm ? (
          <div id="enquiry" className="lg:col-span-6" data-reveal>
            <ContactForm />
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
