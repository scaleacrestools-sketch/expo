import ArtisticLabel from '../components/ui/ArtisticLabel';
import EnquiryButton from '../components/ui/EnquiryButton';
import Img from '../components/ui/Img';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import { IMAGES } from '../config/images';

const SPECS = [
  { image: IMAGES.Specs.Marble, title: 'Imported marble flooring', note: 'Living, dining & master bedroom' },
  { image: IMAGES.Specs.Kitchen, title: 'Modular kitchen', note: 'With hob & chimney' },
  { image: IMAGES.Specs.Sanitary, title: 'Premium sanitaryware', note: 'Top-of-the-line bath fittings' },
  { image: IMAGES.Specs.Lobby, title: 'Double-height lobbies', note: 'Entrance lobby for each tower' },
  { image: IMAGES.Specs.Power, title: '100% power backup', note: 'For every apartment' },
  { image: IMAGES.Specs.Security, title: '24/7 multi-tier security', note: 'Round-the-clock safety' },
];

const RESIDENCE_FEATURES = [
  { value: '11.4 Ft.', label: 'Floor-to-floor height' },
  { value: '3 & 4 BHK', label: 'Palatial residences' },
  { value: 'Lavish', label: 'Sundecks' },
];

const SUSTAINABILITY = [
  { value: '25%', label: 'On-site solar common area lighting' },
  { value: '35%', label: 'Water saving' },
  { value: '15%', label: 'Energy saving' },
  { value: 'EV', label: 'Charging provision' },
];

export default function Specifications() {
  return (
    <section id="specifications" className="bg-luxury-light texture-grain relative overflow-hidden py-16 sm:py-20 md:py-28">
      <div className="relative container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="Apartment Specifications"
          title="Premium Finishes. Exceptional Living."
          subtitle="Top-of-the-line finishes, generous proportions and thoughtful services in every Aravista residence."
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7" variant="fade-right">
            <div className="shadow-luxury relative aspect-16/9 overflow-hidden rounded-3xl">
              <Img
                image={IMAGES.LivingRoom}
                sizes="(min-width: 1024px) 56vw, 92vw"
                alt="Living room with floor-to-ceiling glazing opening onto a lavish sundeck at L&T Realty Aravista"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <ArtisticLabel className="top-3 right-3" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" variant="fade-left" delay={100}>
            <h3 className="font-serif text-3xl leading-tight font-semibold text-cocoa sm:text-4xl">Your canvas of grandeur</h3>
            <p className="mt-4 font-body text-base leading-8 text-brand">
              Palatial 3 and 4 BHK homes open onto lavish sundecks, with an 11.4 ft floor-to-floor height that fills every
              room with light and volume.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {RESIDENCE_FEATURES.map((f) => (
                <div key={f.label} className="luxury-card px-2 py-5 text-center">
                  <p className="gradient-text font-serif text-2xl font-bold sm:text-3xl">{f.value}</p>
                  <p className="mt-1 font-sans text-[10px] tracking-[0.14em] text-brand uppercase">{f.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SPECS.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 80}>
              <figure className="hover-lift group h-full overflow-hidden rounded-xl bg-cream ring-1 ring-brand/10">
                <div className="aspect-[3/4] overflow-hidden">
                  <Img
                    image={{ src: s.image, width: 594, height: 882 }}
                    alt={`${s.title} at L&T Realty Aravista`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="px-3 py-4 text-center">
                  <p className="font-serif text-lg leading-tight font-semibold text-cocoa">{s.title}</p>
                  <p className="mt-1 font-body text-xs leading-5 text-bronze">{s.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="rounded-2xl bg-cream p-6 ring-1 ring-brand/10 sm:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-sans text-[11px] font-medium tracking-[0.3em] text-bronze uppercase">Sustainability</p>
                <h3 className="mt-2 font-serif text-3xl font-semibold text-cocoa">Green by design</h3>
              </div>
              <p className="max-w-md font-body text-sm leading-6 text-brand md:text-right">
                Rooftop solar, rainwater harvesting and 100% wastewater recycling through an advanced MBR sewage treatment
                plant.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {SUSTAINABILITY.map((s) => (
                <div key={s.label} className="rounded-xl bg-sand px-4 py-5 text-center">
                  <p className="font-serif text-3xl font-semibold text-cocoa">{s.value}</p>
                  <p className="mt-1 font-body text-xs leading-5 text-bronze">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 text-center">
          <EnquiryButton title="Request Specifications">Request Full Specifications</EnquiryButton>
        </div>
      </div>
    </section>
  );
}
