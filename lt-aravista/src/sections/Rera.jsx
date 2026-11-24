import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import { SITE } from '../config/site';

const DETAILS = [
  ['Registered project', SITE.registeredProjectName],
  ['HRERA registration no.', SITE.projectRera],
  ['Promoter', SITE.promoter],
  ['DTCP licences', 'No. 47 of 2009, No. 104 of 2012 and No. 24 of 2026'],
  ['Payment plan', SITE.paymentPlan],
];

export default function Rera() {
  return (
    <section id="rera" className="bg-cream py-16 sm:py-20 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Project Status & RERA"
          title="Registered with HRERA Gurugram"
          subtitle="L&T Realty Aravista Phase 1 is registered with the Haryana Real Estate Regulatory Authority, Gurugram."
        />
        <Reveal className="mt-10">
          <dl className="overflow-hidden rounded-xl bg-sand ring-1 ring-brand/10">
            {DETAILS.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 border-b border-brand/10 px-5 py-4 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-6 sm:px-8"
              >
                <dt className="font-sans text-[11px] font-medium tracking-[0.2em] text-bronze uppercase sm:pt-1">{label}</dt>
                <dd className="font-body text-[15px] leading-7 break-words text-brand">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-center font-body text-sm text-brand">
            Verify the registration at{' '}
            <a
              href={SITE.reraWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 transition-colors hover:text-bronze"
            >
              haryanarera.gov.in
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
