import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from './Icons.jsx';

/**
 * Native scroll-snap carousel with arrow controls and a progress rail.
 * Supports touch / trackpad swiping and keyboard arrows out of the box.
 */
export default function Carousel({ label, tone = 'light', children, className = '', controlsPosition = 'bottom' }) {
  const trackRef = useRef(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, progress: 0, visible: 1 });
  const count = Array.isArray(children) ? children.length : 1;

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const progress = max > 0 ? el.scrollLeft / max : 1;
    const visible = Math.min(1, el.clientWidth / el.scrollWidth);
    setState({ atStart: el.scrollLeft <= 4, atEnd: el.scrollLeft >= max - 4, progress, visible });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [measure]);

  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const amount = item ? item.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  const scrollable = state.visible < 0.999;
  const thumbWidth = `${Math.max(state.visible, 0.15) * 100}%`;
  const thumbLeft = `${state.progress * (100 - Math.max(state.visible, 0.15) * 100)}%`;

  const controls = (
    <div className={`carousel__controls carousel__controls--${controlsPosition} ${scrollable ? '' : 'is-static'}`}>
      <div className="carousel__rail" aria-hidden="true">
        <span className="carousel__thumb" style={{ width: thumbWidth, left: thumbLeft }} />
      </div>
      <div className="carousel__buttons">
        <button type="button" className="carousel__btn" onClick={() => step(-1)} disabled={state.atStart} aria-label="Previous slide">
          <ArrowLeft width={18} height={18} />
        </button>
        <button type="button" className="carousel__btn" onClick={() => step(1)} disabled={state.atEnd} aria-label="Next slide">
          <ArrowRight width={18} height={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`carousel carousel--${tone} ${className}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="carousel__track" ref={trackRef} tabIndex={0} onKeyDown={onKeyDown} aria-label={`${label}, ${count} items. Use arrow keys to scroll.`}>
        {children}
      </div>
      {controls}
    </div>
  );
}
