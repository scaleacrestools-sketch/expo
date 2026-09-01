import Image from 'next/image';
import { ChevronDown, MapPin, Play, ShieldCheck, Star } from 'lucide-react';
import Reveal from './Reveal';

const heroStats = [
  { value: '120+', label: 'Curated journeys' },
  { value: '28', label: 'Indian states covered' },
  { value: '12k+', label: 'Happy travellers' },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-ink">
      {/* Cinematic background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/img/photo-1564507592333-c60657eea523?w=1920&q=80&auto=format&fit=crop"
        aria-hidden="true"
      >
        <source
          src="/vid/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 pb-24 pt-32 sm:px-8 sm:pt-36 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="flex max-w-2xl flex-col items-start gap-7">
          <Reveal>
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-violet-bright" />
              <span className="text-xs font-medium text-white/90 sm:text-sm">
                Trusted by 12,000+ explorers
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="flex items-center gap-1 text-xs font-semibold text-white sm:text-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                4.9
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Discover the <span className="accent-serif font-medium text-violet-bright">Soul</span>{' '}
              of Incredible India
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Experience breathtaking destinations, unforgettable adventures, vibrant culture, and
              curated journeys designed for modern explorers.
            </p>
          </Reveal>

          <Reveal delay={300} className="flex flex-wrap items-center gap-4">
            <a
              href="#journeys"
              className="rounded-full bg-gradient-to-r from-violet-core to-violet-bright px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-core/40 transition-all duration-300 hover:shadow-violet-core/60 hover:brightness-110 sm:text-base"
            >
              Explore Tours
            </a>
            <a
              href="#stories"
              className="group flex items-center gap-3 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 sm:text-base"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>
              Watch Story
            </a>
          </Reveal>

          <Reveal delay={400} className="mt-4 w-full">
            <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</dd>
                  <dd className="text-xs text-white/60 sm:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Floating destination cards (desktop) */}
        <div className="relative hidden h-[480px] lg:block" aria-hidden="true">
          <Reveal delay={300} className="absolute right-8 top-0 w-64">
            <div className="float-soft overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md">
              <div className="relative h-40">
                <Image
                  src="/img/photo-1602216056096-3b40cc0c9944?w=600&q=80&auto=format&fit=crop"
                  alt=""
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <MapPin className="h-3 w-3" /> Alleppey, Kerala
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Backwater Houseboats</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={500} className="absolute bottom-6 left-0 w-64">
            <div
              className="float-soft overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="relative h-40">
                <Image
                  src="/img/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop"
                  alt=""
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <MapPin className="h-3 w-3" /> Ladakh
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Himalayan Horizons</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#destinations"
        aria-label="Scroll to destinations"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60 transition-colors hover:text-white"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-current p-1.5">
          <span className="scroll-dot block h-1.5 w-1.5 rounded-full bg-current" />
        </span>
        <ChevronDown className="mx-auto mt-1 h-4 w-4" />
      </a>
    </section>
  );
}
