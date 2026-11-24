import EnquiryButton from '../components/ui/EnquiryButton';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import { RESIDENCES } from '../config/residences';
import { SITE } from '../config/site';

export default function Pricing() {
  return (
    <section id="price" className="relative overflow-hidden bg-sand py-16 sm:py-20 md:py-28">
      <div className="relative container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="Price List"
          title="Residence Collections & Pricing"
          subtitle={`Palatial 3 and 4 BHK residences at L&T Realty Aravista, Sector 86 Gurugram, starting at ${SITE.startingPrice}.`}
        />
        <div className="mx-auto mt-14 grid max-w-5xl gap-x-8 gap-y-12 md:grid-cols-2">
          {RESIDENCES.map((r, i) => (
            <Reveal key={r.id} delay={(i % 2) * 100}>
              <article className="hover-lift relative h-full rounded-xl bg-cream px-6 pt-12 pb-10 text-center sm:px-10">
                <span className="btn-luxury absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 font-sans text-[10px] font-medium tracking-[0.24em] whitespace-nowrap text-white uppercase">
                  {r.bhk} · {r.towers}
                </span>
                <h3 className="font-serif text-5xl font-medium text-brand">{r.name}</h3>
                <p className="mx-auto mt-5 inline-flex rounded-full bg-sand px-4 py-2 font-body text-sm text-brand">
                  Carpet Area: Approx. {r.carpet} Sq. Ft.
                </p>
                <div className="mx-auto my-7 h-px w-full max-w-xs bg-brand/15" />
                <p className="font-sans text-[10px] tracking-[0.28em] text-bronze uppercase">Starting price</p>
                <p className="mt-2 font-serif text-5xl font-medium text-brand">
                  {r.price}
                  <span className="ml-2 align-middle font-body text-base font-normal text-bronze">onwards</span>
                </p>
                <EnquiryButton title={`Get Cost Sheet: ${r.bhk} ${r.name}`} className="mt-8">
                  Get Detailed Cost Sheet
                </EnquiryButton>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-12 max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-5 rounded-xl bg-cream px-6 py-6 text-center ring-1 ring-brand/10 sm:px-10 md:flex-row md:text-left">
            <div>
              <p className="font-sans text-[10px] tracking-[0.28em] text-bronze uppercase">Payment Plan</p>
              <p className="mt-1.5 font-serif text-3xl font-semibold text-brand">{SITE.paymentPlan}</p>
            </div>
            <EnquiryButton title="Get Detailed Cost Sheet">Get Detailed Cost Sheet</EnquiryButton>
          </div>
          <p className="mt-5 text-center font-body text-xs leading-6 text-bronze">
            {SITE.priceNote} Carpet areas are approximate starting areas for each collection.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
