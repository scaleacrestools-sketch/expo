import { useEffect, useRef, useState } from 'react';
import EnquiryButton from '../components/ui/EnquiryButton';
import { IconArrowLeft, IconArrowRight } from '../components/ui/Icons';
import Img from '../components/ui/Img';
import Reveal from '../components/ui/Reveal';
import { IMAGES } from '../config/images';

const SLIDES = [
  {
    title: 'The Central Social Club',
    description: 'Three levels of leisure, wellness and celebration, from a banquet hall and library to a restaurant, gym and spa.',
    image: IMAGES.CentralClub,
    alt: 'Exterior of The Central Social Club with landscaped approach at L&T Realty Aravista',
  },
  {
    title: 'Triple-Height Club Lobby',
    description: 'A grand triple-height arrival lobby that sets the tone for the club, with a patisserie and tea lounge on the same level.',
    image: IMAGES.ClubLobby,
    alt: 'Triple-height clubhouse lobby with sculptural chandelier at L&T Realty Aravista',
  },
  {
    title: 'Temperature-Controlled Indoor Pool',
    description: 'A temperature-controlled indoor swimming pool for year-round laps and leisure inside The Central Social Club.',
    image: IMAGES.IndoorPool,
    alt: 'Temperature-controlled indoor swimming pool at L&T Realty Aravista',
  },
  {
    title: 'The Arena Sports Club',
    description: 'A dedicated sports club for an active lifestyle, complemented by courts, a cricket net, climbing wall and roller-skating loop.',
    image: IMAGES.ArenaSports,
    alt: 'Indoor court at The Arena sports club, L&T Realty Aravista',
  },
  {
    title: 'Outdoor Swimming Pool',
    description: "A resort-style pool beside the clubhouse, with a kids' pool and water splash, kids' play area, pet corner and skating park nearby.",
    image: IMAGES.OutdoorPool,
    alt: 'Outdoor swimming pool with loungers in front of the clubhouse at L&T Realty Aravista',
  },
];

const CATEGORIES = [
  {
    title: 'Nature & Wellness',
    items: ['Wellness Garden', 'Discovery Garden', 'Nature Trail', 'Central Water Spine', 'Cascading Water Features', 'Amphilawn', 'Central Living Canopy'],
  },
  {
    title: 'Family & Recreation',
    items: ['Outdoor Swimming Pool', "Kids' Pool with Water Splash", "Kids' Play Area", 'Pet Corner', 'Skating Park'],
  },
  {
    title: 'Sports & Fitness',
    items: ['Pickleball Courts', 'Tennis Court', 'Multi-Purpose Court', 'Jogging Track', 'Cricket Net', 'Climbing Wall', 'Roller-Skating Loop'],
  },
];

const CENTRAL_CLUB = [
  'Triple-Height Club Lobby',
  'Temperature-Controlled Indoor Swimming Pool',
  'Gymnasium',
  'Spa & Treatment Room',
  'Yoga & Meditation Room',
  'Yoga & Dance Studio',
  'Restaurant',
  'Patisserie & Tea Lounge',
  'Private Dining & Party Lounge',
  'Banquet Hall',
  'Business Centre & Co-working Space',
  'Library',
  'Salon',
  'Indoor Games',
  "Kids' Digital Games Lounge",
  'AV Room',
  'Guest Room with Open Lawn',
];

const AUTOPLAY_MS = 5000;
const COUNT = SLIDES.length;
const LOOP = [...SLIDES, ...SLIDES, ...SLIDES];

function ListCard({ title, items, columns = false, children }) {
  return (
    <article className="hover-lift h-full rounded-xl bg-sand p-6 ring-1 ring-brand/10 sm:p-7">
      <h3 className="font-serif text-2xl leading-tight font-semibold text-cocoa sm:text-[1.7rem]">{title}</h3>
      <span className="mt-3 block h-px w-10 bg-brand/30" aria-hidden="true" />
      {children}
      <ul className={`mt-4 grid gap-x-6 gap-y-2.5 ${columns ? 'sm:grid-cols-2' : ''}`}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 font-body text-[15px] leading-6 text-brand">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Amenities() {
  const [pos, setPos] = useState(COUNT + 1);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const current = pos % COUNT;

  const goTo = (i) => {
    if (i < 0 || i >= LOOP.length) return;
    setAnimate(true);
    setPos(i);
  };
  const step = (d) => goTo(pos + d);

  useEffect(() => {
    if (pos >= COUNT && pos < COUNT * 2) return undefined;
    const t = window.setTimeout(() => {
      setAnimate(false);
      setPos(COUNT + (pos % COUNT));
    }, 720);
    return () => window.clearTimeout(t);
  }, [pos]);

  useEffect(() => {
    if (animate) return undefined;
    const f = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(f);
  }, [animate]);

  useEffect(() => {
    if (paused) return undefined;
    const t = window.setTimeout(() => goTo(pos + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [pos, paused]);

  return (
    <section id="amenities" className="overflow-hidden bg-cream py-16 sm:py-20 md:py-24">
      <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-10 xl:px-14">
        <Reveal>
          <p className="font-body text-xs tracking-[0.3em] text-brand/60 uppercase">Amenities &amp; Clubhouses</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] text-cocoa sm:text-5xl md:text-6xl">
            3.6 Lakh Sq. Ft. of Extraordinary Living
          </h2>
        </Reveal>
        <div className="flex items-center gap-4">
          <p className="font-body text-sm text-umber tabular-nums">
            <span className="text-brand">{String(current + 1).padStart(2, '0')}</span> / {String(COUNT).padStart(2, '0')}
          </p>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous amenity"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-brand/30 text-brand transition-colors hover:bg-brand hover:text-ivory"
          >
            <IconArrowLeft />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next amenity"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-brand text-ivory transition-colors hover:bg-ink"
          >
            <IconArrowRight />
          </button>
        </div>
      </div>

      <div
        className="mt-10 [--gap:12px] [--w:82%] md:mt-14 md:[--gap:20px] md:[--w:52%]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          setPaused(false);
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
      >
        <div
          className={`flex gap-(--gap) ${animate ? 'transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : ''}`}
          style={{ transform: `translateX(calc(50% - var(--w) / 2 - ${pos} * (var(--w) + var(--gap))))` }}
        >
          {LOOP.map((slide, i) => {
            const isActive = i === pos;
            const noAnim = animate ? '' : 'transition-none!';
            return (
              <article key={`${i}-${slide.title}`} className="w-(--w) shrink-0" aria-hidden={!isActive}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  tabIndex={-1}
                  className={`group relative block aspect-4/5 w-full overflow-hidden text-left sm:aspect-16/9 md:aspect-[2.2/1] ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <Img
                    image={slide.image}
                    sizes="(min-width: 768px) 52vw, 82vw"
                    alt={slide.alt}
                    className={`h-full w-full object-cover transition-transform duration-[1200ms] ${noAnim} ${isActive ? 'scale-100' : 'scale-110'}`}
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" aria-hidden="true" />
                  <span
                    className={`absolute inset-0 bg-black transition-opacity duration-700 ${noAnim} ${isActive ? 'opacity-0' : 'opacity-25 group-hover:opacity-10'}`}
                    aria-hidden="true"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-black/35 px-2.5 py-1 font-sans text-[10px] tracking-[0.16em] text-white/85 uppercase backdrop-blur-sm">
                    Artistic impression
                  </span>
                  <span
                    className={`absolute inset-x-0 bottom-0 grid gap-2 p-5 transition-all duration-700 sm:p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-10 md:p-9 ${noAnim} ${isActive ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-4 opacity-0'}`}
                  >
                    <span className="block font-display text-3xl leading-tight text-white md:text-5xl">{slide.title}</span>
                    <span className="block max-w-md font-body text-sm leading-6 text-white/95 md:text-[15px] md:leading-7">
                      {slide.description}
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto mt-14 px-4 md:mt-20 md:px-10 xl:px-14">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <ListCard title={c.title} items={c.items} />
            </Reveal>
          ))}
          <Reveal className="md:col-span-2" delay={80}>
            <ListCard title="The Central Social Club" items={CENTRAL_CLUB} columns>
              <p className="mt-4 font-body text-[15px] leading-7 text-brand">
                Three levels of leisure, wellness and celebration, opening from a triple-height club lobby.
              </p>
            </ListCard>
          </Reveal>
          <Reveal delay={160}>
            <article className="bg-luxury-dark relative flex h-full flex-col overflow-hidden rounded-xl p-6 text-white sm:p-7">
              <p className="font-sans text-[11px] font-medium tracking-[0.3em] text-champagne/80 uppercase">Sports Club</p>
              <h3 className="mt-2 font-serif text-3xl leading-tight font-semibold">The Arena</h3>
              <span className="mt-3 block h-px w-10 bg-champagne/40" aria-hidden="true" />
              <p className="mt-4 font-body text-[15px] leading-7 text-white/90">
                Aravista&apos;s dedicated sports club anchors an active lifestyle, alongside pickleball and tennis courts, a
                multi-purpose court, cricket net, climbing wall, jogging track and roller-skating loop.
              </p>
              <div className="mt-auto pt-6">
                <EnquiryButton title="Book a Club Preview">Book a Club Preview</EnquiryButton>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
