import EnquiryButton from '../components/ui/EnquiryButton';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';

const HIGHLIGHTS = [
  '20 Acres overall development',
  '9.5 Acres open space',
  '5 Acres central green space',
  '3.6 Lakh Sq. Ft. amenity space',
  'The Central Social Club',
  'The Arena Sports Club',
  'Palatial 3 & 4 BHK residences',
  'Lavish sundecks',
  '11.4 Ft. floor-to-floor height',
  'Premium interior finishes',
  'Double-height tower entrance lobbies',
  'Temperature-controlled indoor swimming pool',
  '24/7 multi-tier security',
];

export default function Highlights() {
  return (
    <section id="highlights" className="highlights-pattern relative overflow-hidden py-16 sm:py-20 md:py-28">
      <div className="relative container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="Highlights"
          title="Project Highlights"
          subtitle="Everything that makes L&T Realty Aravista in Sector 86, Gurugram an address of extraordinary living."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((text, i) => (
            <Reveal key={text} delay={(i % 6) * 50}>
              <article className="hover-lift group flex h-full items-center gap-5 rounded-xl bg-stone p-6">
                <span className="font-serif text-4xl leading-none text-brand">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-body text-base leading-7 text-brand">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <EnquiryButton title="Request Project Details">Request Project Details</EnquiryButton>
        </div>
      </div>
    </section>
  );
}
