import { useEffect, useRef } from 'react';
import { IMAGES } from '../data/content.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

export default function Hero() {
  const mediaRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Very subtle parallax: the image drifts at ~12% of scroll speed while the hero is visible.
  useEffect(() => {
    const el = mediaRef.current;
    if (!el || reduced) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) el.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      el.style.transform = '';
    };
  }, [reduced]);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__media" ref={mediaRef}>
        <img
          className="hero__img"
          src={IMAGES.hero}
          alt="Aerial view of a landscaped residential development surrounded by greenery in Bangalore"
          fetchpriority="high"
          width="1920"
          height="1080"
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="container hero__content">
        <p className="hero__tagline">1 Address for Every You.</p>
        <h1 className="hero__title" id="hero-title">
          <span className="hero__line hero__line--1">Invest in</span>
          <span className="hero__line hero__line--2">Happiness</span>
        </h1>
        <div className="hero__foot">
          <a href="#featured" className="hero__scroll">
            <span className="hero__scroll-line" aria-hidden="true" />
            Explore Properties
          </a>
        </div>
      </div>
    </section>
  );
}
