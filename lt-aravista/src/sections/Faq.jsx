import { useState } from 'react';
import { IconMinus, IconPlus } from '../components/ui/Icons';
import SectionHeading from '../components/ui/SectionHeading';
import { SITE } from '../config/site';

const FAQS = [
  {
    q: 'What is the starting price of L&T Realty Aravista?',
    a: 'Indicative starting prices are ₹4.75 Cr* for the 3 BHK Majesta, ₹5.23 Cr* for the 3 BHK Regalia, ₹6.73 Cr* for the 4 BHK Royale and ₹7.64 Cr* for the 4 BHK Luxuria. Taxes and applicable charges are extra.',
  },
  {
    q: 'What are the carpet areas of the residences?',
    a: 'Approximate carpet areas start at 1,423 sq. ft. for Majesta, 1,542 sq. ft. for Regalia, 2,007 sq. ft. for Royale and 2,293 sq. ft. for Luxuria.',
  },
  {
    q: 'Where is L&T Realty Aravista located?',
    a: 'Aravista is in Sector 86, Gurugram, on the Dwarka Expressway corridor, with schools, hospitals and retail within about 4 to 15 minutes.',
  },
  {
    q: 'Is L&T Realty Aravista registered with HRERA?',
    a: `Yes. ${SITE.registeredProjectName} is registered with HRERA Gurugram under registration number ${SITE.projectRera}.`,
  },
  {
    q: 'What payment plan is available?',
    a: 'Aravista follows a construction-linked payment plan. Share your details to receive the detailed cost sheet.',
  },
  {
    q: 'What clubs and amenities does Aravista offer?',
    a: 'Aravista offers 3.6 lakh sq. ft. of amenity space with The Central Social Club and The Arena sports club, a temperature-controlled indoor pool, outdoor pool, gym, spa, pickleball and tennis courts, and a 5-acre central green.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-sand py-16 sm:py-20 md:py-24">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <SectionHeading eyebrow="FAQs" title="Questions, Answered" />
        <div className="mt-10 overflow-hidden rounded-xl bg-cream ring-1 ring-brand/10">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-brand/10 last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-8"
                >
                  <span className="font-serif text-xl leading-snug font-semibold text-cocoa sm:text-2xl">{f.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/30 text-brand">
                    {isOpen ? <IconMinus /> : <IconPlus />}
                  </span>
                </button>
                <div id={`faq-${i}`} hidden={!isOpen} className="px-5 pb-5 font-body text-[15px] leading-7 text-brand sm:px-8">
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
