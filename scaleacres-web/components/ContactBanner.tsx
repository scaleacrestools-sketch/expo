import Link from "next/link";
import { contactBanner } from "@/content/assets";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Section 09 — full-width cinematic contact CTA. Concept image (labelled) under a dark
 * overlay; portrait screens get a crop centred on the towers.
 */
export function ContactBanner() {
  const { desktop, mobile, alt } = contactBanner;
  return (
    <section id="contact-cta" aria-labelledby="contact-cta-title" className="on-dark relative isolate overflow-hidden bg-ink text-white">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobile.src} width={mobile.width} height={mobile.height} />
        <img src={desktop.src} width={desktop.width} height={desktop.height} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]" />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,13,13,0.9)_0%,rgba(11,13,13,0.72)_45%,rgba(11,13,13,0.3)_100%)] max-md:bg-[linear-gradient(180deg,rgba(11,13,13,0.55)_0%,rgba(11,13,13,0.88)_70%)]" />

      <Reveal className="container-x relative mx-auto flex min-h-[clamp(34rem,78vh,50rem)] max-w-[120rem] flex-col justify-end py-[clamp(4.5rem,9vw,8rem)] md:justify-center">
        <h2 id="contact-cta-title" className="max-w-[14ch] text-[clamp(2.75rem,1rem+5.6vw,7.25rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]" data-split-reveal>
          Let&apos;s build something
          <br />
          <span className="text-blue">that matters.</span>
        </h2>
        <p className="mt-8 max-w-[44ch] text-[length:var(--fs-lead)] leading-[1.5] text-grey-soft" data-reveal>
          From your next property launch to your next big brand idea, let&apos;s create something built for impact.
        </p>
        <div className="mt-10" data-reveal>
          <Link href="/contact-us/" className="group inline-flex items-center gap-4 rounded-full bg-blue px-9 py-5 text-[0.875rem] font-bold uppercase tracking-[0.16em] text-on-accent transition-colors duration-500 hover:bg-white hover:text-ink">
            Let&apos;s Talk
            <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </Reveal>
      <span className="dev-badge !left-auto !right-4 !top-4">Concept visual</span>
    </section>
  );
}
