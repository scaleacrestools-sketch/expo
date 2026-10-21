'use client';
import { useMemo, useState } from 'react';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { Lightbox } from '@/components/ui/Lightbox';
import { track } from '@/lib/analytics';

export type GalleryItem = { asset: ResolvedAsset; category: string; span?: 'wide' | 'tall' };
const categories = ['All', 'Architecture', 'Residences', 'Shiki Clubhouse', 'Wellness', 'Landscape', 'Lifestyle'];

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<number | null>(null);
  const shown = useMemo(() => (cat === 'All' ? items : items.filter((i) => i.category === cat)), [cat, items]);
  return (
    <section id="gallery" className="washi grain relative py-[var(--section-y)]">
      <div className="container-sora">
        <SectionHeading index="14" eyebrow="Cinematic gallery" title={<>A Closer Look<br /><em>at Sora.</em></>} />
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3" role="tablist" aria-label="Gallery categories">
          {categories.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`text-[0.68rem] font-semibold tracking-[0.2em] uppercase transition-colors ${cat === c ? 'text-sora-red' : 'text-ink-mute hover:text-ink'}`}>{c}</button>
          ))}
        </div>
        <ul className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-5">
          {shown.map((it, i) => (
            <Reveal as="li" key={it.asset.id} className={`reveal ${it.span === 'wide' ? 'col-span-2' : ''} ${it.span === 'tall' ? 'row-span-2' : ''}`} delay={(i % 4) * 60}>
              <button type="button" onClick={() => { setOpen(i); track('gallery_open', { image: it.asset.id }); }} className="group relative block h-full w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-gold" aria-label={`Open ${it.asset.title}`}>
                <SoraImage asset={it.asset} className="h-full w-full transition-transform duration-[1.6s] ease-[var(--ease-sora)] group-hover:scale-[1.04]" sizes="(min-width:768px) 25vw, 50vw" caption />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-10 text-left text-[0.7rem] tracking-[0.12em] text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"><span className="mb-1 block text-[0.56rem] tracking-[0.3em] uppercase text-gold">{it.category}</span>{it.asset.title}</span>
              </button>
            </Reveal>
          ))}
        </ul>
        <p className="fine mt-6">Artist&rsquo;s impressions and illustrative images; stock photographs are labelled. Not an actual representation of the finished project.</p>
      </div>
      {open !== null && <Lightbox items={shown.map((s) => s.asset)} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </section>
  );
}
