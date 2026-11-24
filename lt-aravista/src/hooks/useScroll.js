import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS } from '../config/routes';

const ACTIVE_OFFSET = 100;

export function useActiveSection() {
  const [active, setActive] = useState('');
  const current = useRef('');
  const frame = useRef(0);
  useEffect(() => {
    const update = () => {
      let next = '';
      for (const link of NAV_LINKS) {
        const el = document.querySelector(link.href);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) next = link.href;
      }
      if (next !== current.current) {
        current.current = next;
        setActive(next);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return active;
}

export function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  const current = useRef(false);
  const frame = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const next = window.scrollY > threshold;
        if (next !== current.current) {
          current.current = next;
          setScrolled(next);
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);
  return scrolled;
}
