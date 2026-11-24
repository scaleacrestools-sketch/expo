import ArtisticLabel from '../components/ui/ArtisticLabel';
import Img from '../components/ui/Img';
import { IconLocationOutline } from '../components/ui/Icons';
import { IMAGES } from '../config/images';
import { SITE } from '../config/site';
import { useEnquiry } from '../context/useEnquiry';

export default function LifestyleBanner() {
  const { openEnquiry } = useEnquiry();
  return (
    <section className="relative overflow-hidden bg-sand">
      <Img
        image={IMAGES.WellnessGarden}
        sizes="100vw"
        alt="Wellness garden walkway through lush landscaping at L&T Realty Aravista"
        className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/40 via-transparent to-transparent" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,#f4f2ed_0%,rgba(244,242,237,0.75)_40%,rgba(244,242,237,0)_100%)] md:h-48"
        aria-hidden="true"
      />
      <ArtisticLabel className="right-3 bottom-3" />
      <div className="relative z-10 container mx-auto flex h-[520px] items-end px-4 pt-24 pb-6 md:h-[600px] md:px-10 md:pb-10 xl:px-14">
        <div className="w-full max-w-md rounded-2xl bg-ivory p-6 shadow-[0_20px_50px_rgba(74,59,55,0.2)] sm:p-7">
          <p className="font-sans text-[11px] font-medium tracking-[0.3em] text-bronze uppercase">Your oasis of calm</p>
          <h2 className="mt-2 font-display text-[1.9rem] leading-[1.1] text-cocoa sm:text-[2.2rem]">
            Nature at the heart, with 5 acres of central greens
          </h2>
          <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-umber">
            <IconLocationOutline className="text-base text-bronze" aria-hidden="true" />
            {SITE.location}
          </p>
          <button
            type="button"
            onClick={() => openEnquiry('Connect with Our Advisor')}
            className="mt-6 h-12 w-full cursor-pointer rounded-lg bg-brand font-body text-sm text-ivory transition-colors duration-300 hover:bg-ink"
          >
            Connect with Our Advisor
          </button>
        </div>
      </div>
    </section>
  );
}
