import { useEffect, useState } from 'react';
import ArtisticLabel from '../components/ui/ArtisticLabel';
import { IconArrowRight, IconLocationOutline } from '../components/ui/Icons';
import { HERO_SLIDES } from '../config/images';
import { SITE } from '../config/site';
import { useEnquiry } from '../context/useEnquiry';
import HeroEnquiryForm from './HeroEnquiryForm';

const SLIDE_MS = 6000;
const HERO_HIGHLIGHTS = [
  { value: '20', label: 'Acres Development' },
  { value: '9.5', label: 'Acres Open Space' },
  { value: '5', label: 'Acres Central Greens' },
  { value: '3.6 Lakh', label: 'Sq. Ft. Amenities' },
];

function RevealLine({ children, delay }) {
  return (
    <span className="block overflow-hidden pb-[0.08em] md:whitespace-nowrap">
      <span className="eloria-line block" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

export default function Hero() {
  const { openEnquiry } = useEnquiry();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index]);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-cream md:flex md:min-h-svh md:items-end md:bg-ink"
    >
      <div className="eloria-image relative h-[62svh] min-h-[380px] md:absolute md:inset-0 md:-z-10 md:h-auto md:min-h-0">
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={i === index ? slide.alt : ''}
            aria-hidden={i !== index}
            fetchPriority={i === 0 ? 'high' : 'low'}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${i === index ? 'hero-slide-zoom opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/55 to-transparent md:hidden" aria-hidden="true" />
        <ArtisticLabel className="right-3 bottom-12 md:top-28 md:right-6 md:bottom-auto" />
      </div>
      <div className="absolute inset-0 -z-10 hidden bg-linear-to-t from-black/85 via-black/30 to-black/45 md:block" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 hidden bg-linear-to-r from-black/55 via-black/10 to-transparent md:block" aria-hidden="true" />

      <div className="relative z-10 container mx-auto -mt-8 grid w-full gap-10 rounded-t-[2rem] bg-cream px-5 pt-9 pb-14 md:mt-0 md:rounded-none md:bg-transparent md:px-10 md:pt-28 md:pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-end lg:gap-16 xl:px-14">
        <span className="absolute top-3 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-brand/15 md:hidden" aria-hidden="true" />
        <div className="order-2 w-full max-w-md">
          <HeroEnquiryForm />
        </div>
        <div className="order-1 max-w-3xl md:max-w-none">
          <p
            className="eloria-fade font-body text-xs font-medium tracking-[0.3em] text-bronze uppercase sm:text-sm md:text-base md:tracking-[0.25em] md:text-white"
            style={{ animationDelay: '700ms' }}
          >
            {SITE.presenter}
          </p>
          <h1 className="mt-3 font-display text-[3.2rem] leading-[0.95] font-semibold text-brand sm:text-6xl md:mt-2 md:text-7xl md:font-medium md:text-white lg:text-[5.25rem] [@media(min-width:1024px)_and_(min-height:860px)]:text-8xl">
            <span className="sr-only">{SITE.name}</span>
            <span aria-hidden="true">
              <RevealLine delay={850}>L&amp;T Realty</RevealLine>
              <RevealLine delay={950}>Aravista</RevealLine>
            </span>
          </h1>
          <p
            className="eloria-fade mt-4 flex items-center gap-2 font-body text-lg font-medium text-brand md:mt-3 md:text-2xl md:font-normal md:text-white"
            style={{ animationDelay: '1100ms' }}
          >
            <IconLocationOutline className="shrink-0 md:hidden" aria-hidden="true" />
            {SITE.location}
          </p>

          {/* Mobile summary */}
          <div className="eloria-fade mt-6 md:hidden" style={{ animationDelay: '1300ms' }}>
            <p className="font-display text-2xl leading-tight font-semibold text-brand">{SITE.tagline}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-sand p-4">
                <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-bronze uppercase">Residences</p>
                <p className="mt-1.5 font-display text-2xl leading-tight font-semibold text-brand">3 &amp; 4 BHK</p>
                <p className="font-body text-xs font-medium text-brand">Luxury Residences</p>
              </div>
              <div className="rounded-xl bg-brand p-4 text-cream">
                <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-cream/75 uppercase">Starting at</p>
                <p className="mt-1.5 font-display text-2xl leading-tight font-semibold">{SITE.startingPrice}</p>
                <p className="font-body text-xs font-medium text-cream/85">onwards</p>
              </div>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {HERO_HIGHLIGHTS.map((h) => (
                <li key={h.label} className="rounded-xl border border-brand/10 bg-cream px-3 py-2.5">
                  <p className="font-display text-xl leading-none font-semibold text-brand">{h.value}</p>
                  <p className="mt-1 font-sans text-[10px] font-medium tracking-[0.12em] text-bronze uppercase">{h.label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop summary */}
          <div className="eloria-fade hidden max-w-2xl font-body text-white md:block" style={{ animationDelay: '1300ms' }}>
            <span className="mt-3 block h-px w-56 bg-white/70" aria-hidden="true" />
            <p className="mt-3 font-display text-3xl font-semibold text-[#e6c88f] lg:text-4xl">{SITE.tagline}</p>
            <span className="mt-3 block h-px w-8 bg-white/70" aria-hidden="true" />
            <p className="mt-3 text-xl font-normal">{SITE.configuration}</p>
            <p className="mt-2 text-xl font-normal">
              Starting at <span className="font-medium">{SITE.startingPrice}</span>
            </p>
            <ul className="mt-4 grid max-w-xl grid-cols-4 divide-x divide-white/25 border-y border-white/25 py-3">
              {HERO_HIGHLIGHTS.map((h) => (
                <li key={h.label} className="px-3 first:pl-0">
                  <p className="font-display text-2xl leading-none font-semibold text-white lg:text-3xl">{h.value}</p>
                  <p className="mt-1.5 font-sans text-[10px] leading-4 tracking-[0.14em] text-white/85 uppercase">{h.label}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="eloria-fade mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-8" style={{ animationDelay: '1450ms' }}>
            <div className="flex flex-1 items-center gap-1.5 md:flex-none md:gap-2">
              <button
                type="button"
                onClick={() => openEnquiry('Get Price List')}
                className="h-12 flex-1 cursor-pointer rounded-md bg-brand px-5 font-body text-sm font-medium text-cream transition-colors duration-300 hover:bg-ink md:h-14 md:flex-none md:rounded-lg md:bg-white md:px-7 md:text-base md:font-normal md:text-ink md:hover:bg-champagne"
              >
                Get Price List
              </button>
              <button
                type="button"
                aria-label="Get Price List"
                onClick={() => openEnquiry('Get Price List')}
                className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-brand text-cream transition-colors duration-300 hover:bg-ink md:h-14 md:w-14 md:rounded-lg md:bg-white md:text-ink md:hover:bg-champagne"
              >
                <IconArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => openEnquiry('Download Brochure')}
              className="relative w-full cursor-pointer pb-1 text-center font-body text-sm font-medium text-brand after:absolute after:inset-x-0 after:bottom-0 after:mx-auto after:h-px after:w-36 after:origin-left after:bg-brand after:transition-transform after:duration-500 hover:after:scale-x-0 md:ml-4 md:w-auto md:text-left md:text-base md:font-normal md:text-white md:after:w-auto md:after:bg-white"
            >
              Download Brochure
            </button>
          </div>

          <div className="eloria-fade mt-10 hidden md:block [@media(max-height:860px)]:md:hidden" style={{ animationDelay: '1700ms' }} aria-hidden="true">
            <div className="flex h-11 w-6.5 justify-center rounded-full border-[1.5px] border-white/80">
              <span className="animate-scroll-dot mt-1.5 h-2 w-[3px] rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
