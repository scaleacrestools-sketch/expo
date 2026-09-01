import Image from 'next/image';
import Reveal from './Reveal';

export default function CTA() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink">
          <Image
            src="/img/photo-1506905925346-21bda4d32df4?w=1800&q=80&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-core/70 via-ink/70 to-ink/90" />
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
            <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Your India story starts with a{' '}
              <span className="accent-serif font-medium text-violet-bright">single step</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Tell us how you like to travel. A journey designer will shape an itinerary around
              you — free, no obligation, usually within a day.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:scale-[1.03] hover:bg-violet-bright hover:text-white sm:text-base"
              >
                Plan My Journey
              </a>
              <a
                href="#destinations"
                className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10 sm:text-base"
              >
                Browse Destinations
              </a>
            </div>
            <p className="text-xs text-white/50">
              Free cancellation up to 30 days · No hidden fees · 4.9★ from 12,000+ travellers
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
