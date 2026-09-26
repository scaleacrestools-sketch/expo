import Image from 'next/image';
import { Check, Clock, Star } from 'lucide-react';
import { packages } from '@/lib/data';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Packages() {
  return (
    <section id="journeys" className="bg-lavender py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Signature Journeys"
          title={
            <>
              Itineraries designed like{' '}
              <span className="accent-serif text-violet-mid">stories</span>
            </>
          }
          description="Each journey is paced by a regional specialist — with room to breathe, wander, and be surprised."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 120}>
              <article
                className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-ink/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-core/15 ${
                  pkg.featured ? 'ring-2 ring-violet-mid' : ''
                }`}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {pkg.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-violet-core to-violet-bright px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      Most Loved
                    </span>
                  )}
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {pkg.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-core">
                    {pkg.route}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-ink">{pkg.name}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                    <Clock className="h-4 w-4" />
                    {pkg.duration}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {pkg.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-mid" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-6 mt-7">
                    <p className="text-xl font-bold text-ink">
                      {pkg.price}
                      <span className="ml-1 text-xs font-normal text-ink-soft">/ person</span>
                    </p>
                    <a
                      href="#cta"
                      className="rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-violet-core"
                      aria-label={`Book the ${pkg.name} journey`}
                    >
                      Book Journey
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
