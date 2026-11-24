import { useState, useEffect } from 'react';
import ArtisticLabel from '../components/ui/ArtisticLabel';
import { IconChevronLeft, IconChevronRight, IconLocationOutline } from '../components/ui/Icons';
import { IMAGES } from '../config/images';
import { SITE } from '../config/site';
import { useEnquiry } from '../context/useEnquiry';

const SLIDES = [
  { src: IMAGES.CentralLandscape, alt: 'Central living canopy and discovery garden at L&T Realty Aravista' },
  { src: IMAGES.WellnessGarden, alt: 'Wellness garden and nature trail at L&T Realty Aravista' },
  { src: IMAGES.OutdoorPool, alt: 'Outdoor swimming pool beside the clubhouse at L&T Realty Aravista' },
  { src: IMAGES.ArenaSports, alt: 'Sports courts at The Arena, L&T Realty Aravista' },
];
const SLIDE_MS = 6000;

export default function LifestyleBanner() {
  const { openEnquiry } = useEnquiry();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index]);
  const step = (d) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative overflow-hidden bg-[#f1eae3]">
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          aria-hidden={i !== index}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,#f8f1ea_0%,#f8f1ea_35%,rgba(248,241,234,0.85)_50%,rgba(248,241,234,0.4)_75%,rgba(248,241,234,0)_100%)] md:h-56"
        aria-hidden="true"
      />
      <ArtisticLabel className="right-3 bottom-3" />
      <div className="relative z-10 container mx-auto flex h-[560px] items-end px-4 pt-24 pb-6 md:h-[600px] md:px-10 md:pb-10 xl:px-14">
        <div className="w-full max-w-md rounded-2xl bg-[#f8f1ea] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:p-7">
          <h2 className="font-display text-[1.9rem] leading-[1.1] text-[#443e36] sm:text-[2.2rem]">
            Nature at the heart, with 5 acres of central greens
          </h2>
          <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-[#443e36]/70">
            <IconLocationOutline className="text-base" aria-hidden="true" />
            {SITE.location}
          </p>
          <button
            type="button"
            onClick={() => openEnquiry('Connect with Our Advisor')}
            className="mt-6 h-11 w-full cursor-pointer rounded-lg bg-[#443e36] font-body text-sm text-[#f1eae3] transition-colors duration-300 hover:bg-[#2f2a24]"
          >
            Connect with Our Advisor
          </button>
          <div className="mt-6 flex items-center gap-4 border-t border-[#443e36]/15 pt-5">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#443e36]/40 text-[#443e36] transition-colors hover:bg-[#443e36] hover:text-[#f1eae3]"
              >
                <IconChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#443e36]/40 text-[#443e36] transition-colors hover:bg-[#443e36] hover:text-[#f1eae3]"
              >
                <IconChevronRight />
              </button>
              <div className="ml-1 flex items-center gap-1">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${i === index ? 'w-5 bg-[#443e36]' : 'w-1.5 bg-[#443e36]/30'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
