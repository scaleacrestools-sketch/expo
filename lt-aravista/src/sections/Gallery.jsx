import { useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '../components/ui/Icons';
import SectionHeading from '../components/ui/SectionHeading';
import { IMAGES } from '../config/images';

const PHOTOS = [
  { src: IMAGES.OutdoorPool, alt: 'Outdoor swimming pool and clubhouse at L&T Realty Aravista' },
  { src: IMAGES.CentralClub, alt: 'The Central Social Club exterior at L&T Realty Aravista' },
  { src: IMAGES.ClubLobby, alt: 'Triple-height club lobby at L&T Realty Aravista' },
  { src: IMAGES.IndoorPool, alt: 'Temperature-controlled indoor swimming pool at L&T Realty Aravista' },
  { src: IMAGES.LivingRoom, alt: 'Luxury living room with sundeck at L&T Realty Aravista' },
  { src: IMAGES.CentralLandscape, alt: 'Central green with discovery garden and water features at L&T Realty Aravista' },
  { src: IMAGES.WellnessGarden, alt: 'Landscaped wellness garden at L&T Realty Aravista' },
  { src: IMAGES.ArenaSports, alt: 'Sports facilities at The Arena, L&T Realty Aravista' },
];

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const strip = useRef(null);
  const step = (d) => setIndex((i) => (i + d + PHOTOS.length) % PHOTOS.length);

  useEffect(() => {
    const el = strip.current;
    const thumb = el?.children[index];
    if (!el || !thumb) return;
    const left = thumb.offsetLeft - (el.clientWidth - thumb.clientWidth) / 2;
    el.scrollTo({ left, behavior: 'smooth' });
  }, [index]);

  return (
    <section id="gallery" className="bg-sand py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-10 xl:px-14">
        <SectionHeading
          eyebrow="Gallery"
          title="Explore L&T Realty Aravista"
          subtitle="A glimpse of the clubhouse, landscapes and residences planned at Aravista, Sector 86 Gurugram. All images are artistic impressions."
        />
        <div className="mx-auto mt-12 max-w-5xl">
          <div
            className="relative aspect-4/3 overflow-hidden rounded-lg bg-black shadow-luxury sm:aspect-16/9"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') step(1);
              if (e.key === 'ArrowLeft') step(-1);
            }}
          >
            {PHOTOS.map((p, i) => (
              <img
                key={p.src}
                src={p.src}
                alt={p.alt}
                aria-hidden={i !== index}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${i === index ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'}`}
              />
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/65 to-transparent" aria-hidden="true" />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/80 sm:left-4"
            >
              <IconChevronLeft className="text-lg" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/80 sm:right-4"
            >
              <IconChevronRight className="text-lg" />
            </button>
            <p className="absolute bottom-4 left-5 font-serif text-base font-bold text-champagne [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] sm:bottom-6 sm:left-6 sm:text-lg">
              {index + 1} of {PHOTOS.length}
            </p>
            <p className="absolute right-4 bottom-4 font-sans text-[9px] tracking-[0.18em] text-white/80 uppercase sm:right-6 sm:bottom-6">
              Artistic impression
            </p>
          </div>
          <div
            ref={strip}
            className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden"
          >
            {PHOTOS.map((p, i) => {
              const isActive = i === index;
              return (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative aspect-square w-24 shrink-0 cursor-pointer overflow-hidden rounded-md p-0.5 transition-all duration-300 sm:w-32 md:w-[9.5rem] ${isActive ? 'bg-brand' : 'bg-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={p.src} alt="" loading="lazy" decoding="async" className="h-full w-full rounded-[5px] object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
