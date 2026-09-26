import Image from 'next/image';
import { Clock, MapPin, Star } from 'lucide-react';
import type { Destination } from '@/lib/data';

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-ink shadow-lg shadow-ink/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-core/20">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />

        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {destination.rating.toFixed(1)}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
            <MapPin className="h-3.5 w-3.5" />
            {destination.location}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">{destination.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/70">
            {destination.tagline}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
            <div>
              <p className="text-lg font-bold text-white">
                {destination.price}
                <span className="ml-1 text-xs font-normal text-white/60">/ person</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/60">
                <Clock className="h-3 w-3" />
                {destination.duration}
              </p>
            </div>
            <a
              href="#cta"
              className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-ink transition-all duration-300 hover:bg-violet-bright hover:text-white"
              aria-label={`Book a trip to ${destination.name}`}
            >
              Book
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
