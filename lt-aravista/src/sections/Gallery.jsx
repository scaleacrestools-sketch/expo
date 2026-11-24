import { useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '../components/ui/Icons';
import Img from '../components/ui/Img';
import SectionHeading from '../components/ui/SectionHeading';
import { FILM, IMAGES } from '../config/images';

const PHOTOS = [
  { image: IMAGES.OutdoorPool, alt: 'Outdoor swimming pool and clubhouse at L&T Realty Aravista' },
  { image: IMAGES.CentralClub, alt: 'The Central Social Club exterior at L&T Realty Aravista' },
  { image: IMAGES.ClubLobby, alt: 'Triple-height club lobby at L&T Realty Aravista' },
  { image: IMAGES.IndoorPool, alt: 'Temperature-controlled indoor swimming pool at L&T Realty Aravista' },
  { image: IMAGES.LivingRoom, alt: 'Luxury living room with sundeck at L&T Realty Aravista' },
  { image: IMAGES.CentralLandscape, alt: 'Central green with discovery garden and water features at L&T Realty Aravista' },
  { image: IMAGES.WellnessGarden, alt: 'Landscaped wellness garden at L&T Realty Aravista' },
  { image: IMAGES.ArenaSports, alt: 'Sports facilities at The Arena, L&T Realty Aravista' },
];

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

/** Click-to-play film. Nothing is downloaded until the visitor presses play. */
function Film({ src, poster, className, aspect, label }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative overflow-hidden rounded-xl bg-ink shadow-luxury ${aspect} ${className}`}>
      {playing ? (
        <video className="absolute inset-0 h-full w-full bg-ink object-cover" src={src} poster={poster} controls autoPlay playsInline preload="auto">
          <track kind="captions" />
        </video>
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 cursor-pointer" aria-label={`Play ${label}`}>
          <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/10" aria-hidden="true" />
          <span className="absolute top-1/2 left-1/2 flex h-18 w-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/95 text-brand shadow-luxury transition-transform duration-300 group-hover:scale-105">
            <PlayIcon />
          </span>
          <span className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3.5 py-1.5 font-sans text-[11px] tracking-[0.16em] text-ivory uppercase backdrop-blur-sm">
            {label}
          </span>
        </button>
      )}
    </div>
  );
}

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
          subtitle="The clubhouse, landscapes and residences planned at Aravista, Sector 86 Gurugram. All images are artistic impressions."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <div
            className="relative aspect-4/3 overflow-hidden rounded-xl bg-ink shadow-luxury sm:aspect-16/9"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') step(1);
              if (e.key === 'ArrowLeft') step(-1);
            }}
          >
            {PHOTOS.map((p, i) =>
              Math.abs(i - index) <= 1 || (index === 0 && i === PHOTOS.length - 1) || (index === PHOTOS.length - 1 && i === 0) ? (
                <Img
                  key={p.image.src}
                  image={p.image}
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  alt={i === index ? p.alt : ''}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${i === index ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'}`}
                />
              ) : null,
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink/70 to-transparent" aria-hidden="true" />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-ink/60 text-ivory backdrop-blur-sm transition-colors hover:bg-ink sm:left-4"
            >
              <IconChevronLeft className="text-lg" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-ink/60 text-ivory backdrop-blur-sm transition-colors hover:bg-ink sm:right-4"
            >
              <IconChevronRight className="text-lg" />
            </button>
            <p className="absolute bottom-4 left-5 font-serif text-base font-bold text-champagne [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:bottom-6 sm:left-6 sm:text-lg" aria-live="polite">
              {index + 1} of {PHOTOS.length}
            </p>
            <p className="absolute right-4 bottom-4 font-sans text-[10px] tracking-[0.18em] text-white/85 uppercase sm:right-6 sm:bottom-6">
              Artistic impression
            </p>
          </div>
          <div ref={strip} className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden">
            {PHOTOS.map((p, i) => {
              const isActive = i === index;
              return (
                <button
                  key={p.image.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative aspect-square w-20 shrink-0 cursor-pointer overflow-hidden rounded-md p-0.5 transition-all duration-300 sm:w-28 md:w-32 ${isActive ? 'bg-brand' : 'bg-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={p.image.thumb} alt="" width={160} height={160} loading="lazy" decoding="async" className="h-full w-full rounded-[5px] object-cover" />
                </button>
              );
            })}
          </div>

          <div className="mt-14 grid items-center gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] md:gap-10">
            <div className="text-center md:text-left">
              <p className="font-sans text-[11px] font-medium tracking-[0.3em] text-bronze uppercase">Project film</p>
              <h3 className="mt-2 font-serif text-3xl leading-tight font-semibold text-cocoa sm:text-4xl">See Aravista in motion</h3>
              <p className="mt-3 font-body text-[15px] leading-7 text-brand">
                A short film of the clubhouse, landscapes and residences, created from the official brochure renders.
              </p>
            </div>
            <Film
              src={FILM.vertical}
              poster={FILM.verticalPoster}
              aspect="aspect-[9/16]"
              className="mx-auto w-full max-w-[300px] md:hidden"
              label="Watch film · 0:35"
            />
            <Film src={FILM.landscape} poster={FILM.poster} aspect="aspect-16/9" className="hidden md:block" label="Watch film · 0:41" />
          </div>
        </div>
      </div>
    </section>
  );
}
