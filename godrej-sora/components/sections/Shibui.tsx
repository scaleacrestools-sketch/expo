import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';

const principles = [
  { jp: '自然', en: 'Naturalness', copy: 'Materials that age gracefully; forms that follow the logic of light and wind.' },
  { jp: '簡素', en: 'Restraint', copy: 'Nothing added for effect. What remains is quieter, and more valuable for it.' },
  { jp: '調和', en: 'Balance', copy: 'Towers, gardens and water held in proportion, each giving room to the other.' },
  { jp: '動', en: 'Movement', copy: 'Paths that unfold slowly, so arriving home feels like a walk, not a transit.' },
  { jp: '光', en: 'Light', copy: 'Floor-to-floor heights and deep balconies tuned to the sun, not against it.' },
  { jp: '静', en: 'Contemplation', copy: 'Sunken courts and still water: places designed for doing nothing at all.' },
];

export function Shibui({ images }: { images: ResolvedAsset[] }) {
  return (
    <section id="shibui" className="washi grain relative py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="07" eyebrow="Shibui philosophy" align="center" title={<>The Beauty of Less.<br /><em>The Luxury of More.</em></>}>
          <span className="serif-accent text-ink">Shibui</span> is the Japanese word for a beauty that reveals itself slowly: subtle, unforced, enduring. It is the quiet discipline behind every decision at Sora.
        </SectionHeading>
        <div className="mt-20 grid gap-8 md:grid-cols-12">
          <Reveal className="img-reveal md:col-span-5 aspect-[3/4]"><SoraImage asset={images[0]} className="h-full w-full" sizes="(min-width:768px) 40vw, 100vw" caption /></Reveal>
          <ul className="md:col-span-7 grid content-center gap-x-12 gap-y-8 sm:grid-cols-2 md:pl-10">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.en} className="reveal" delay={i * 70}>
                <span className="serif-accent block text-3xl text-sora-red/80">{p.jp}</span>
                <h3 className="mt-2 text-[0.7rem] font-semibold tracking-[0.26em] uppercase">{p.en}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.copy}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="img-scale md:col-span-12 mt-8 aspect-[21/9] overflow-hidden"><SoraImage asset={images[1]} className="h-full w-full" sizes="100vw" caption /></Reveal>
        </div>
      </div>
    </section>
  );
}
