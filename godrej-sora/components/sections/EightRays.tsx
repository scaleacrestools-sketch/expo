'use client';
import { useEffect, useRef, useState } from 'react';
import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';

/** Scroll-driven editorial sequence: the sun emblem stays pinned while each ray is introduced. */
export function EightRays({ emblem }: { emblem: ResolvedAsset }) {
  const rays = project.eightRays;
  const [active, setActive] = useState(0);
  const items = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="philosophy" className="relative bg-ink py-[var(--section-y)] text-ivory">
      <div className="container-sora">
        <SectionHeading index="03" eyebrow="The Eight Rays of Sora" light title={<>Eight Rays.<br /><em className="text-gold-soft">One Way of Living.</em></>}>
          {project.eightRaysIntro}
        </SectionHeading>
        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {emblem.src ? (
                <SoraImage asset={emblem} className="h-full w-full !bg-transparent" sizes="28rem" />
              ) : (
                <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Eight Rays of Sora emblem">
                  <defs><radialGradient id="g" cx="50%" cy="50%"><stop offset="0%" stopColor="#e7c77c" /><stop offset="100%" stopColor="#d5a33c" /></radialGradient></defs>
                  <circle cx="200" cy="200" r="54" fill="url(#g)" />
                  {rays.map((_, i) => {
                    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                    const on = i === active;
                    const x1 = 200 + Math.cos(a) * 74, y1 = 200 + Math.sin(a) * 74, x2 = 200 + Math.cos(a) * (on ? 190 : 150), y2 = 200 + Math.sin(a) * (on ? 190 : 150);
                    const lx = 200 + Math.cos(a) * 118, ly = 200 + Math.sin(a) * 118;
                    // origami ray: a slim kite
                    const px = Math.cos(a + Math.PI / 2) * 9, py = Math.sin(a + Math.PI / 2) * 9;
                    return (
                      <g key={i} style={{ transition: 'all .8s var(--ease-sora)' }}>
                        <polygon points={`${x1 + px},${y1 + py} ${x2},${y2} ${x1 - px},${y1 - py} ${lx},${ly}`} fill={on ? '#e7c77c' : '#d5a33c'} opacity={on ? 1 : 0.45} style={{ transition: 'all .8s var(--ease-sora)' }} />
                      </g>
                    );
                  })}
                  <circle cx="200" cy="200" r="196" fill="none" stroke="#d5a33c" strokeOpacity="0.2" strokeDasharray="2 8" />
                </svg>
              )}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span key={active} className="display text-center text-[clamp(1.4rem,3vw,2.2rem)] text-ink" style={{ animation: 'rayfade .8s var(--ease-sora)' }}>{String(active + 1).padStart(2, '0')}</span>
              </div>
            </div>
            <p className="mt-6 text-center text-[0.62rem] tracking-[0.3em] uppercase text-ivory/50">Ray {String(active + 1).padStart(2, '0')} of 08 — {rays[active].name}</p>
            <style>{`@keyframes rayfade{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}`}</style>
          </div>
          <ol className="grid gap-10 lg:gap-14">
            {rays.map((r, i) => (
              <li key={r.name} ref={(el) => { items.current[i] = el; }} data-i={i} className={`transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-40'}`}>
                <Reveal className="reveal grid grid-cols-[3rem_1fr] gap-4 border-t border-ivory/15 pt-6">
                  <span className="text-[0.7rem] tracking-[0.3em] text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="display text-2xl text-ivory md:text-3xl">The Ray of {r.name}.</h3>
                    <p className="mt-1 text-[0.62rem] tracking-[0.28em] uppercase text-gold">{r.sub}</p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/70 md:text-base">{r.copy}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
