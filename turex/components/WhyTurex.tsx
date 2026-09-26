import { HeartHandshake, Map, PhoneCall, Wallet } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const reasons = [
  {
    icon: Map,
    title: 'Built by regional specialists',
    copy: 'Every itinerary is designed by someone who has lived the route — not assembled from a catalogue.',
  },
  {
    icon: HeartHandshake,
    title: 'Local hosts, real access',
    copy: 'Home kitchens, artist studios, and family-run stays that never appear on booking sites.',
  },
  {
    icon: PhoneCall,
    title: '24/7 on-trip support',
    copy: 'A real human in your time zone, from airport pickup to the last goodbye.',
  },
  {
    icon: Wallet,
    title: 'Transparent pricing',
    copy: 'The price you see is the price you pay. Free cancellation up to 30 days out.',
  },
];

export default function WhyTurex() {
  return (
    <section className="bg-ink py-24 text-white sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <Reveal className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-bright">
              Why Turex
            </span>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Travel that feels{' '}
              <span className="accent-serif font-medium text-violet-bright">personal</span>, not
              packaged
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              We started Turex because India deserves better than bus-window tourism. Twelve
              thousand travellers later, the principle hasn&apos;t changed: fewer stops, deeper
              stays, real people.
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <p className="text-3xl font-bold sm:text-4xl">98%</p>
              <p className="mt-1 text-sm text-white/60">would travel with us again</p>
            </div>
            <div>
              <p className="text-3xl font-bold sm:text-4xl">4.9<span className="text-violet-bright">★</span></p>
              <p className="mt-1 text-sm text-white/60">average journey rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold sm:text-4xl">180+</p>
              <p className="mt-1 text-sm text-white/60">local hosts &amp; guides</p>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 100}>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-7 transition-colors duration-300 hover:border-violet-bright/40 hover:bg-white/8">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-core/20 text-violet-bright">
                  <reason.icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{reason.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
