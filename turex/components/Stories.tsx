import Image from 'next/image';
import { Quote } from 'lucide-react';
import Reveal from './Reveal';

export default function Stories() {
  return (
    <section id="stories" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1200&q=80&auto=format&fit=crop"
              alt="Wooden boats resting on the Ganges at the Varanasi ghats in early light"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden max-w-xs rounded-3xl bg-white p-6 shadow-2xl shadow-ink/15 sm:block lg:-right-10">
            <Quote className="h-6 w-6 text-violet-mid" />
            <p className="mt-3 text-sm leading-relaxed text-ink">
              &ldquo;We rowed out before sunrise. The city lit its first lamps, and everything I
              thought I knew about travel quietly rearranged itself.&rdquo;
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Priya N. — Varanasi, day 3
            </p>
          </div>
        </Reveal>

        <Reveal delay={150} className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-core">
            Customer Stories
          </span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            The journeys our travellers{' '}
            <span className="accent-serif text-violet-mid">keep retelling</span>
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            Ten days on the Ganges. A monsoon week in Munnar. A first solo trip that turned into an
            annual ritual. We collect our travellers&apos; stories the way they collect
            places&nbsp;— slowly, and with care.
          </p>
          <ul className="mt-2 space-y-4">
            {[
              'A private dawn ceremony with a fifth-generation boat family in Varanasi',
              'Three generations, one houseboat — a family reunion on the backwaters',
              'From Delhi desk job to Chadar trek: one traveller’s winter in Zanskar',
            ].map((story) => (
              <li key={story} className="flex items-start gap-3 text-sm text-ink-soft sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-mid" />
                {story}
              </li>
            ))}
          </ul>
          <a
            href="#cta"
            className="mt-2 w-fit rounded-full border border-ink/15 px-7 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:border-violet-core hover:bg-violet-core hover:text-white"
          >
            Start your own story
          </a>
        </Reveal>
      </div>
    </section>
  );
}
