import { useState } from 'react';
import EnquiryButton from '../components/ui/EnquiryButton';
import Lightbox from '../components/ui/Lightbox';
import { IconExternal, IconLocation, IconPlus } from '../components/ui/Icons';
import Reveal from '../components/ui/Reveal';
import { IMAGES } from '../config/images';
import { SITE } from '../config/site';

const CATEGORIES = [
  {
    tabLabel: 'Schools',
    title: 'Schools',
    points: [
      { label: 'Heritage Pride', distance: '7 min' },
      { label: 'St. Andrew World', distance: '7 min' },
      { label: 'DPS', distance: '8 min' },
      { label: "St. Xavier's High", distance: '9 min' },
    ],
  },
  {
    tabLabel: 'Retail',
    title: 'Shopping & Retail',
    points: [
      { label: 'Sapphire', distance: '5 min' },
      { label: 'Iris Broadway', distance: '7 min' },
      { label: 'Elan Miracle', distance: '10 min' },
      { label: 'SS Omnia', distance: '15 min' },
    ],
  },
  {
    tabLabel: 'Healthcare',
    title: 'Healthcare',
    points: [
      { label: 'Miracle Apollo', distance: '4 min' },
      { label: 'Artemis Lite', distance: '10 min' },
    ],
  },
  {
    tabLabel: 'Infrastructure',
    title: 'Infrastructure Advantages',
    points: [
      { label: 'Dwarka Expressway connectivity', tag: 'Existing' },
      { label: 'Metro line, Sector 56 Golf Course Road to Panchgaon', tag: 'Upcoming' },
      { label: 'Namo Bharat RRTS, Delhi to Alwar', tag: 'Upcoming' },
      { label: 'Sector 85–86 flyover at Dadi Sati Chowk, multi-utility corridor', tag: 'Proposed' },
      { label: '1,000-acre Global City', tag: 'Upcoming' },
      { label: 'Green Belt with 1,000 acres of open spaces', tag: 'Nearby' },
    ],
  },
];

const MAP_EMBED = 'https://maps.google.com/maps?q=Sector+86,+Gurugram&hl=en&z=13&output=embed';
const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=Sector+86+Gurugram';

export default function Location() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const cat = CATEGORIES[active];

  return (
    <section id="location" className="overflow-hidden bg-cream py-16 sm:py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="font-sans text-[11px] font-medium tracking-[0.3em] text-bronze uppercase sm:text-xs">
              Location &amp; Connectivity
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-[1.1] font-semibold text-brand sm:text-[2.5rem] md:text-5xl">
              Seamlessly Connected to Everything That Matters
            </h2>
          </div>
          <p className="max-w-md font-body text-base leading-7 font-medium text-brand md:justify-self-end md:text-right md:text-lg">
            Sector 86, Gurugram, on the Dwarka Expressway corridor, with schools, hospitals and retail minutes away.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-4" variant="fade-right">
            <p className="hidden font-sans text-[11px] font-medium tracking-[0.3em] text-bronze uppercase lg:block">
              Explore the neighbourhood
            </p>
            <div
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:mt-6 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Location categories"
            >
              {CATEGORIES.map((c, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={c.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`location-panel-${i}`}
                    id={`location-tab-${i}`}
                    onClick={() => setActive(i)}
                    className={`group flex shrink-0 cursor-pointer items-center gap-3 rounded-full px-4 py-2 text-left transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:rounded-none lg:border-b lg:border-brand/10 lg:px-0 lg:py-3 ${isActive ? 'bg-brand text-cream lg:bg-transparent lg:text-brand' : 'bg-sand text-brand lg:bg-transparent lg:text-brand/55 lg:hover:text-brand'}`}
                  >
                    <span className={`hidden h-px bg-brand transition-all duration-500 lg:block ${isActive ? 'w-8' : 'w-0'}`} aria-hidden="true" />
                    <span className="font-sans text-xs font-medium whitespace-nowrap lg:hidden">{c.tabLabel}</span>
                    <span className="hidden font-serif text-xl leading-snug font-semibold lg:inline xl:text-2xl">{c.title}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() =>
                setLightbox({ src: IMAGES.LocationMap, alt: 'L&T Realty Aravista location map, Sector 86 Gurugram', title: 'Location Map' })
              }
              className="group relative mt-8 block w-full cursor-zoom-in overflow-hidden rounded-xl bg-sand ring-1 ring-brand/10"
              aria-label="Enlarge location map"
            >
              <img
                src={IMAGES.LocationMap}
                alt="L&T Realty Aravista location map showing nearby schools, retail and hospitals"
                width={2880}
                height={1620}
                loading="lazy"
                decoding="async"
                className="aspect-16/9 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 font-sans text-[10px] tracking-[0.18em] text-white uppercase">
                <IconPlus className="text-xs" /> Location map
              </span>
            </button>
          </Reveal>

          <Reveal className="min-w-0 lg:col-span-8" delay={80}>
            <div key={active} id={`location-panel-${active}`} role="tabpanel" aria-labelledby={`location-tab-${active}`} className="eloria-fade">
              <div className="flex items-baseline justify-between gap-4 border-b border-brand/15 pb-4">
                <h3 className="font-serif text-3xl font-semibold text-brand sm:text-4xl">{cat.title}</h3>
                <span className="shrink-0 font-sans text-xs font-medium text-bronze tabular-nums">
                  {String(active + 1).padStart(2, '0')} / {String(CATEGORIES.length).padStart(2, '0')}
                </span>
              </div>
              <ul>
                {cat.points.map((p, i) => (
                  <li key={p.label} className="group flex items-baseline gap-4 border-b border-brand/10 py-4 sm:gap-6">
                    <span className="shrink-0 font-sans text-xs font-medium text-bronze tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1 font-body text-[15px] leading-relaxed font-medium text-brand transition-transform duration-300 group-hover:translate-x-1 sm:text-base">
                      {p.label}
                    </span>
                    {p.distance ? (
                      <span className="shrink-0 font-serif text-lg font-semibold text-brand sm:text-xl">{p.distance}</span>
                    ) : null}
                    {p.tag ? (
                      <span className="shrink-0 rounded-full bg-sand px-3 py-1 font-sans text-[10px] font-medium tracking-[0.16em] text-bronze uppercase">
                        {p.tag}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-body text-xs text-bronze">
                Travel times are approximate and may vary with traffic. Upcoming and proposed infrastructure is subject to
                approvals and completion by the respective authorities.
              </p>
              <EnquiryButton title="Book a Site Visit" className="mt-8">
                Book a Site Visit
              </EnquiryButton>
            </div>
            <div className="relative mt-10 h-72 overflow-hidden rounded-xl bg-sand sm:h-96">
              <iframe
                title={`${SITE.name} location, ${SITE.location}`}
                src={MAP_EMBED}
                className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[15%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl bg-cream/95 py-2.5 pr-2.5 pl-4 shadow-luxury backdrop-blur-sm sm:bottom-6 sm:left-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-cream">
                  <IconLocation />
                </span>
                <span>
                  <span className="block font-serif text-lg leading-tight font-semibold text-brand">{SITE.name}</span>
                  <span className="block font-body text-xs font-medium text-brand">{SITE.location}</span>
                </span>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Google Maps"
                  className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg bg-sand text-brand transition-colors hover:bg-brand hover:text-cream"
                >
                  <IconExternal />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
