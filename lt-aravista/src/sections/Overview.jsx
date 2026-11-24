import ArtisticLabel from '../components/ui/ArtisticLabel';
import EnquiryButton from '../components/ui/EnquiryButton';
import Img from '../components/ui/Img';
import { IconDownload } from '../components/ui/Icons';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import { IMAGES } from '../config/images';
import { SITE } from '../config/site';

const STATS = [
  { value: '20', unit: 'Acres', label: 'Overall development' },
  { value: '9.5', unit: 'Acres', label: 'Open space' },
  { value: '5', unit: 'Acres', label: 'Central green space' },
  { value: '3.6', unit: 'Lakh Sq. Ft.', label: 'Amenity space' },
];

const POINTS = [
  'The Central Social Club',
  'The Arena Sports Club',
  '11.4 ft floor-to-floor height',
  'Construction-linked payment plan',
];

export default function Overview() {
  return (
    <section id="overview" className="bg-luxury-light texture-grain relative overflow-hidden py-16 sm:py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-6" variant="fade-right">
            <div className="relative mx-auto max-w-xl pb-8 lg:max-w-none">
              <div className="shadow-luxury hover-lift relative aspect-4/3 overflow-hidden rounded-3xl">
                <Img
                  image={IMAGES.CentralLandscape}
                  sizes="(min-width: 1024px) 46vw, (min-width: 640px) 576px, 92vw"
                  alt="Central landscape with discovery garden, water features and towers at L&T Realty Aravista"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <ArtisticLabel className="top-3 right-3" />
              </div>
              <div className="absolute -bottom-2 -left-3 w-[46%] overflow-hidden rounded-2xl border-4 border-white shadow-luxury sm:-left-8">
                <Img
                  image={IMAGES.OasisOfCalm}
                  alt="Landscaped deck and lawn, Your Oasis of Calm at L&T Realty Aravista (artistic impression)"
                  className="aspect-4/3 h-full w-full object-cover"
                />
              </div>
              <div className="luxury-card animate-float absolute -right-2 -bottom-2 px-6 py-5 sm:-right-6">
                <p className="gradient-text font-serif text-4xl leading-none font-bold">{SITE.startingPrice}</p>
                <p className="mt-2 font-sans text-[10px] tracking-[0.22em] text-brand uppercase">Starting price</p>
              </div>
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2 lg:col-span-6" variant="fade-left" delay={120}>
            <SectionHeading
              align="left"
              eyebrow="Overview"
              title="Experience Extraordinary Living at L&T Realty Aravista"
            />
            <p className="mt-6 font-body text-base leading-8 text-brand">
              L&amp;T Realty Aravista brings thoughtfully planned luxury residences to Sector 86, Gurugram. Spread across an
              approximately 20-acre development, the project combines expansive green spaces, refined residences and premium
              lifestyle amenities.
            </p>
            <p className="mt-4 font-body text-base leading-8 text-brand">
              Featuring 9.5 acres of open space, a 5-acre central green and 3.6 lakh sq. ft. of amenity space, Aravista offers a
              contemporary residential experience centred around nature, wellness and recreation.
            </p>
            <p className="mt-4 font-body text-base leading-8 text-brand">
              Discover palatial 3 and 4 BHK residences with lavish sundecks, an 11.4 ft floor-to-floor height and premium
              specifications.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {POINTS.map((p) => (
                <li
                  key={p}
                  className="group flex items-center gap-3 rounded-xl bg-cream px-4 py-3 font-body text-base text-ink shadow-[0_2px_10px_rgba(60,35,15,0.05)] ring-1 ring-brand/10 transition-colors hover:bg-cream"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand transition-transform group-hover:scale-125" />
                  {p}
                </li>
              ))}
            </ul>
            <EnquiryButton title="Download Brochure" className="mt-8">
              <IconDownload className="h-5 w-5" /> Download Brochure
            </EnquiryButton>
          </Reveal>
        </div>
        <Reveal className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6" delay={80} staggerChildren>
          {STATS.map((s) => (
            <div key={s.label} className="luxury-card hover-lift group relative overflow-hidden px-4 py-7 text-center">
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
              <p className="gradient-text font-serif text-4xl font-bold sm:text-5xl">{s.value}</p>
              <p className="mt-2 font-sans text-xs font-medium tracking-[0.24em] text-ink uppercase">{s.unit}</p>
              <p className="mt-1 font-body text-sm text-brand">{s.label}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-6 text-center font-body text-xs text-bronze">
          Figures relate to the overall development. Phase 1 is registered with HRERA Gurugram as {SITE.registeredProjectName}.
        </p>
      </div>
    </section>
  );
}
