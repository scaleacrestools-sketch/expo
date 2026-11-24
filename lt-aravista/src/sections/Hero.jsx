import { useEffect, useRef, useState } from 'react';
import ArtisticLabel from '../components/ui/ArtisticLabel';
import { IconArrowRight, IconDownload, IconLocationOutline } from '../components/ui/Icons';
import { HERO } from '../config/images';
import { SITE } from '../config/site';
import { useEnquiry } from '../context/useEnquiry';
import HeroEnquiryForm from './HeroEnquiryForm';

const KEY_FACTS = [
  { value: '20 Acres', label: 'Development' },
  { value: '9.5 Acres', label: 'Open space' },
  { value: '3.6 Lakh', label: 'Sq. Ft. amenities' },
];

/** Ambient video only on large screens, after load, when motion and data allow it. */
function useAmbientVideo() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = navigator.connection;
    const lowData = conn && (conn.saveData || /2g/.test(conn.effectiveType || ''));
    if (!wide || calm || lowData) return undefined;
    let idle;
    const start = () => {
      idle = (window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1500)))(() => setEnabled(true));
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    };
  }, []);
  return enabled;
}

function HeroVideo() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover object-[50%_40%] transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
    >
      <source src={HERO.video.webm} type="video/webm" />
      <source src={HERO.video.mp4} type="video/mp4" />
    </video>
  );
}

export default function Hero() {
  const { openEnquiry } = useEnquiry();
  const showVideo = useAmbientVideo();

  return (
    <section id="home" className="relative isolate overflow-hidden bg-ivory md:flex md:min-h-svh md:items-end md:bg-ink">
      {/* Image layer */}
      <div className="relative h-[46svh] min-h-[230px] max-h-[460px] md:absolute md:inset-0 md:-z-10 md:h-auto md:max-h-none md:min-h-0">
        <picture>
          <source media="(min-width: 768px)" type="image/avif" srcSet={HERO.desktop.avif} sizes="100vw" />
          <source media="(min-width: 768px)" type="image/webp" srcSet={HERO.desktop.webp} sizes="100vw" />
          <source type="image/avif" srcSet={HERO.mobile.avif} sizes="100vw" />
          <source type="image/webp" srcSet={HERO.mobile.webp} sizes="100vw" />
          <img
            src={HERO.desktop.src}
            alt={HERO.alt}
            width={1600}
            height={900}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="absolute inset-0 h-full w-full object-cover object-[50%_58%] md:object-[50%_40%]"
          />
        </picture>
        {showVideo ? <HeroVideo /> : null}
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-ink/60 to-transparent md:h-44 md:from-ink/55" aria-hidden="true" />
        <ArtisticLabel className="right-3 bottom-11 md:top-28 md:right-6 md:bottom-auto" />
      </div>
      {/* Desktop readability overlays: kept light so the architecture stays visible */}
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-[58%] bg-linear-to-t from-ink/75 via-ink/25 to-transparent md:block" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_70%_60%_at_18%_82%,rgba(74,59,55,0.62)_0%,rgba(74,59,55,0.3)_45%,rgba(74,59,55,0)_72%)] md:block"
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto -mt-7 grid w-full gap-8 rounded-t-[1.75rem] bg-ivory px-5 pt-7 pb-10 md:mt-0 md:gap-10 md:rounded-none md:bg-transparent md:px-10 md:pt-32 md:pb-12 [@media(min-width:768px)_and_(max-height:760px)]:pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,370px)] lg:items-end lg:gap-14 xl:px-14">
        <span className="absolute top-2.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-brand/15 md:hidden" aria-hidden="true" />

        <div className="order-1 min-w-0">
          <p className="font-sans text-[11px] font-medium tracking-[0.32em] text-bronze uppercase md:inline-block md:rounded-full md:bg-ink/45 md:px-3.5 md:py-1.5 md:text-[12px] md:font-semibold md:text-ivory md:backdrop-blur-sm">
            {SITE.presenter}
          </p>
          <h1 className="mt-2.5 font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-[1.02] font-semibold text-balance text-cocoa md:mt-3 md:text-6xl md:font-medium md:text-white md:[text-shadow:0_2px_24px_rgba(40,30,26,0.45)] xl:text-7xl 2xl:text-[5.25rem]">
            L&amp;T Realty <br className="md:hidden" />
            Aravista
          </h1>
          <p className="mt-3 flex items-center gap-2 font-body text-base font-medium text-brand md:mt-4 md:text-xl md:font-normal md:text-white">
            <IconLocationOutline className="shrink-0 text-bronze md:text-gold" aria-hidden="true" />
            {SITE.location}
          </p>
          <span className="mt-5 block h-px w-16 bg-bronze/40 md:w-24 md:bg-gold/70 [@media(min-width:768px)_and_(max-height:760px)]:mt-3" aria-hidden="true" />
          <p className="mt-4 font-display text-[1.55rem] leading-tight font-medium text-bronze italic md:text-3xl md:text-champagne md:[text-shadow:0_1px_14px_rgba(40,30,26,0.55)] lg:text-[2.1rem]">
            The Address of <br className="md:hidden" />
            Extraordinary Living
          </p>

          {/* Configuration + price */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-6 md:flex md:items-stretch md:gap-0">
            <div className="rounded-xl bg-sand px-4 py-3.5 md:rounded-none md:bg-transparent md:py-0 md:pr-7 md:pl-0">
              <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-umber uppercase md:text-[11px] md:text-white/80">Luxury Residences</p>
              <p className="mt-1 font-display text-[1.45rem] leading-tight font-semibold text-cocoa md:text-[1.7rem] md:font-medium md:text-white">
                3 &amp; 4 BHK
              </p>
            </div>
            <div className="rounded-xl bg-brand px-4 py-3.5 text-ivory md:rounded-xl md:border md:border-white/20 md:bg-white/10 md:px-6 md:backdrop-blur-md">
              <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-ivory/80 uppercase md:text-[11px]">Starting at</p>
              <p className="mt-1 font-display text-[1.6rem] leading-tight font-semibold md:text-[2rem]">{SITE.startingPrice}</p>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-2 md:mt-5 md:flex md:flex-wrap md:gap-x-3 md:gap-y-1.5 [@media(min-width:768px)_and_(max-height:760px)]:hidden">
            {KEY_FACTS.map((f, i) => (
              <li key={f.label} className="rounded-lg border border-brand/10 px-2 py-2 text-center md:flex md:items-center md:gap-3 md:border-0 md:p-0 md:text-left">
                {i > 0 ? <span className="hidden h-1 w-1 rounded-full bg-gold md:block" aria-hidden="true" /> : null}
                <span className="block font-body text-[12px] leading-4 text-umber md:text-sm md:text-white/90">
                  <strong className="block font-display text-[1.05rem] leading-5 font-semibold text-cocoa md:inline md:font-body md:text-sm md:font-medium md:text-white">
                    {f.value}
                  </strong>{' '}
                  {f.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-8">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openEnquiry('Get Price List')}
                className="h-12 flex-1 cursor-pointer rounded-lg bg-brand px-6 font-body text-[15px] font-medium text-ivory transition-colors duration-300 hover:bg-ink sm:flex-none md:h-14 md:bg-ivory md:px-8 md:text-base md:text-ink md:hover:bg-champagne"
              >
                Get Price List
              </button>
              <button
                type="button"
                aria-label="Get Price List"
                onClick={() => openEnquiry('Get Price List')}
                className="group flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-brand text-ivory transition-colors duration-300 hover:bg-ink md:h-14 md:w-14 md:bg-ivory md:text-ink md:hover:bg-champagne"
              >
                <IconArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => openEnquiry('Download Brochure')}
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand/35 px-6 font-body text-[15px] font-medium text-brand transition-colors duration-300 hover:bg-brand hover:text-ivory md:h-14 md:border-white/60 md:px-7 md:text-base md:font-normal md:text-white md:hover:border-ivory md:hover:bg-ivory md:hover:text-ink"
            >
              <IconDownload className="text-lg" aria-hidden="true" />
              Download Brochure
            </button>
          </div>
        </div>

        <div className="order-2 w-full md:max-w-md lg:max-w-none">
          <HeroEnquiryForm />
        </div>
      </div>
    </section>
  );
}
