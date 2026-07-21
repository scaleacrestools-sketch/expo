import { destinations } from '@/lib/data';
import SectionHeading from './SectionHeading';
import DestinationCard from './DestinationCard';
import Reveal from './Reveal';

export default function Destinations() {
  return (
    <section id="destinations" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="Featured Destinations"
        title={
          <>
            Places that stay with you{' '}
            <span className="accent-serif text-violet-mid">forever</span>
          </>
        }
        description="From Himalayan silence to Kerala's slow green waters — six journeys our travellers return to again and again."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {destinations.map((destination, i) => (
          <Reveal key={destination.name} delay={(i % 3) * 100}>
            <DestinationCard destination={destination} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
