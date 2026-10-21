'use client';
import { useRef } from 'react';
import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SoraImage } from '@/components/ui/SoraImage';
import { CtaButton } from '@/components/ui/CtaButton';
import { useGsap } from '@/lib/useGsap';

export function Hero({ image }: { image: ResolvedAsset }) {
  const root = useRef<HTMLDivElement>(null);
  useGsap(({ gsap, reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(root);
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(q('[data-hero-img]'), { scale: 1.12, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 2.4, ease: 'power2.out' })
      .fromTo(q('[data-hero-line]'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.12 }, '-=1.6')
      .fromTo(q('[data-hero-cta]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, '-=0.6');
    gsap.to(q('[data-hero-img]'), { yPercent: 14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(q('[data-hero-copy]'), { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: '30% top', end: 'bottom top', scrub: true } });
  });

  const { configurations, startingPrice } = project.headline;

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-ivory">
      <div data-hero-img className="absolute inset-0 will-change-transform">
        <SoraImage asset={image} className="h-full w-full" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/30" />
      </div>
      <div data-hero-copy className="container-sora relative z-10 grid w-full gap-10 pb-20 pt-40 md:grid-cols-[1.4fr_1fr] md:items-end md:pb-24">
        <div className="flex flex-col gap-6">
          <p data-hero-line className="text-[0.66rem] tracking-[0.34em] uppercase text-gold">{project.descriptor}</p>
          <h1 data-hero-line className="display text-[clamp(2.6rem,7vw,6.6rem)] text-ivory">
            Godrej Sora<br /><em className="text-gold-soft">Your Place in the Sun.</em>
          </h1>
          <p data-hero-line className="max-w-md text-sm leading-relaxed tracking-[0.06em] text-ivory/80 md:text-base">
            {project.address}<span className="mx-3 text-gold">·</span>{project.locality}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span data-hero-cta><CtaButton magnet="floorPlans" source="hero" variant="gold">Explore the Residences</CtaButton></span>
            <span data-hero-cta><CtaButton magnet="brochure" source="hero" variant="ghost-light">Request Private Brochure</CtaButton></span>
          </div>
        </div>
        <dl data-hero-line className="grid grid-cols-2 gap-6 border-l border-ivory/20 pl-6 text-ivory md:grid-cols-1 md:gap-8 md:pl-10">
          <div><dt className="text-[0.62rem] tracking-[0.28em] uppercase text-ivory/55">Residences</dt><dd className="mt-1 text-xl font-light md:text-2xl">{configurations.value}</dd></div>
          <div><dt className="text-[0.62rem] tracking-[0.28em] uppercase text-ivory/55">Starting from</dt><dd className="mt-1 text-xl font-light md:text-2xl">{startingPrice.value}</dd></div>
          <div className="col-span-2 md:col-span-1"><dt className="text-[0.62rem] tracking-[0.28em] uppercase text-ivory/55">Collection</dt><dd className="mt-1 text-xl font-light md:text-2xl">{project.headline.totalResidences.value} residences</dd></div>
        </dl>
      </div>
      <a href="#overview" aria-label="Scroll to overview" className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] uppercase text-ivory/60 md:flex">
        Discover
        <span className="block h-10 w-px overflow-hidden bg-ivory/20"><span className="block h-full w-full origin-top bg-gold" style={{ animation: 'scrollcue 2.4s var(--ease-sora) infinite' }} /></span>
      </a>
      <style>{`@keyframes scrollcue{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}@media(prefers-reduced-motion:reduce){[style*="scrollcue"]{animation:none!important}}`}</style>
    </section>
  );
}
