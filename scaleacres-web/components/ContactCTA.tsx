import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { LazyVideo } from "@/components/media/LazyVideo";
import { clip } from "@/content/media";

export function ContactCTA({ withForm = true }: { withForm?: boolean }) {
  const finale = clip("finale");
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10">
        <LazyVideo src={finale.landscape} label={finale.description} className="h-full w-full opacity-70" />
        <div aria-hidden="true" className="contact-overlay absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.6),rgb(var(--ink-rgb)/0.85))]" />
      </div>
      <Reveal className="container-x section-y relative mx-auto grid max-w-[110rem] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-blue" data-reveal>Let&apos;s make something great</p>
          <h2 className="h2 mt-6" data-split-reveal>
            Got a big idea?
            <br />
            <span className="text-blue">Let&apos;s make it happen.</span>
          </h2>
          <p className="lead mt-8 max-w-[44ch] text-white/80" data-reveal>
            A new brand, a better digital experience, or your next big campaign—whatever you&apos;re building, we&apos;d love to hear about it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <ArrowLink href={withForm ? "#enquiry" : "/contact-us/"} variant="blue" size="lg">Let&apos;s Talk</ArrowLink>
            <ArrowLink href="/case-studies/" variant="outline" size="lg" className="text-white">View Our Work</ArrowLink>
          </div>
        </div>
        {withForm ? (
          <div id="enquiry" className="rounded-sm border border-white/15 bg-ink/70 p-6 backdrop-blur-md md:p-10 lg:col-span-6" data-reveal>
            <ContactForm />
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
