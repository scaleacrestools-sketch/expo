import { Star } from 'lucide-react';
import { testimonials } from '@/lib/data';
import SectionHeading from './SectionHeading';
import Marquee from './Marquee';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Word of Mouth"
          title={
            <>
              Trusted by travellers who{' '}
              <span className="accent-serif text-violet-mid">notice details</span>
            </>
          }
        />
      </div>

      <Marquee className="mt-14" duration={55}>
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="mx-3 flex w-[320px] shrink-0 flex-col gap-4 rounded-3xl border border-ink/8 bg-white p-7 shadow-sm sm:w-[380px]"
          >
            <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-ink/10 text-ink/10'
                  }`}
                />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed text-ink-soft">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3 pt-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-core to-violet-bright text-xs font-bold text-white">
                {initials(testimonial.name)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{testimonial.name}</span>
                <span className="block text-xs text-ink-soft">{testimonial.place}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
