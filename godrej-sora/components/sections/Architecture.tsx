'use client';
import { useRef } from 'react';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { ToriiLines } from '@/components/ui/motifs';
import { useGsap } from '@/lib/useGsap';

const frames = [
  { k: 'torii', title: 'A gate, not a wall.', copy: 'The façade borrows from the Torii: a threshold that marks the passage from the everyday into the sacred. Its frames hold the balconies like brushstrokes on paper.' },
  { k: 'closeup', title: 'Material honesty.', copy: 'Timber tones, stone and glass meet without ornament. Light does the decorating, changing the building hour by hour.' },
  { k: 'elevation', title: 'Towers that breathe.', copy: 'Slender massing and generous setbacks keep air moving through the site, so every home opens to sky rather than to a neighbour.' },
];

/** Sticky storytelling: images crossfade in a pinned frame as copy scrolls. */
export function Architecture({ images }: { images: ResolvedAsset[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGsap(({ gsap, ScrollTrigger, reduced }) => {
    const q = gsap.utils.selector(root);
    const imgs = q('[data-arch-img]');
    const steps = q('[data-arch-step]');
    const dots = q('[data-arch-dot]');
    if (reduced || window.innerWidth < 1024) return;
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step, start: 'top 55%', end: 'bottom 55%',
        onToggle: (self) => {
          if (!self.isActive) return;
          imgs.forEach((img, j) => gsap.to(img, { opacity: j === i ? 1 : 0, scale: j === i ? 1 : 1.04, duration: 1.1, ease: 'power2.out' }));
          dots.forEach((d, j) => gsap.to(d, { scaleX: j === i ? 1 : 0.35, opacity: j === i ? 1 : 0.4, duration: 0.6 }));
        },
      });
    });
  });

  return (
    <section id="architecture" ref={root} className="washi grain relative py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="04" eyebrow="Architecture" title={<>An Icon of<br /><em>Quiet Distinction.</em></>}>
          Designed by Hafeez Contractor, Sora&rsquo;s architecture speaks in a Japanese-inspired language: proportion over spectacle, nature over noise.
        </SectionHeading>
        <ToriiLines className="mt-12 h-auto w-64 text-sand-deep md:w-96" />
      </div>
      <div className="container-sora mt-12 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <div className="relative aspect-[4/5] overflow-hidden lg:h-full lg:w-full">
            {images.map((img, i) => (
              <div key={img.id} data-arch-img className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                <SoraImage asset={img} className="h-full w-full" sizes="(min-width:1024px) 55vw, 100vw" caption />
              </div>
            ))}
            <div className="absolute right-4 top-4 z-10 hidden gap-1.5 lg:flex" aria-hidden="true">
              {frames.map((f, i) => <span key={f.k} data-arch-dot className="block h-px w-8 origin-left bg-ivory" style={{ transform: i === 0 ? 'scaleX(1)' : 'scaleX(0.35)', opacity: i === 0 ? 1 : 0.4, mixBlendMode: 'difference' }} />)}
            </div>
          </div>
        </div>
        <ol className="flex flex-col gap-10 lg:gap-[40vh] lg:py-[20vh]">
          {frames.map((f, i) => (
            <li key={f.k} data-arch-step className="max-w-md">
              <div className="lg:hidden mb-6 aspect-[4/3] overflow-hidden">{i > 0 && <SoraImage asset={images[i]} className="h-full w-full" sizes="100vw" caption />}</div>
              <div className="mb-5 flex items-center gap-4"><span className="rule-red block" /><span className="text-[0.62rem] tracking-[0.3em] text-ink-mute">0{i + 1}</span></div>
              <h3 className="display text-3xl md:text-4xl">{f.title}</h3>
              <p className="lede mt-4 !text-base">{f.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
