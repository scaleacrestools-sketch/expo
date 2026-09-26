import { Compass, Landmark, Umbrella, TreePine, Sparkles, UtensilsCrossed } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const categories = [
  {
    icon: Compass,
    name: 'Adventure',
    copy: 'Treks, rafting, and high passes across the Himalaya and Western Ghats.',
  },
  {
    icon: Landmark,
    name: 'Culture & Heritage',
    copy: 'Forts, palaces, and living history from Rajasthan to Hampi.',
  },
  {
    icon: Umbrella,
    name: 'Coast & Islands',
    copy: 'Goa, Gokarna, and the far blue waters of the Andamans.',
  },
  {
    icon: TreePine,
    name: 'Wildlife',
    copy: 'Tiger country in Ranthambore, Kaziranga rhinos, quiet jungle lodges.',
  },
  {
    icon: Sparkles,
    name: 'Spiritual',
    copy: 'Varanasi at dawn, Rishikesh ashrams, monastery mornings in Ladakh.',
  },
  {
    icon: UtensilsCrossed,
    name: 'Food Trails',
    copy: 'Old Delhi streets, Lucknowi kitchens, Kerala sadya feasts.',
  },
];

export default function Categories() {
  return (
    <section id="experiences" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="Travel Your Way"
        title={
          <>
            One country, a{' '}
            <span className="accent-serif text-violet-mid">thousand</span> ways in
          </>
        }
        description="Pick a thread that pulls you — our designers weave it into a journey that fits how you travel."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <Reveal key={category.name} delay={(i % 3) * 100}>
            <a
              href="#cta"
              className="group flex h-full flex-col gap-4 rounded-3xl border border-ink/8 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-mid/40 hover:shadow-xl hover:shadow-violet-core/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender text-violet-core transition-colors duration-300 group-hover:bg-violet-core group-hover:text-white">
                <category.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-ink">{category.name}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{category.copy}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
