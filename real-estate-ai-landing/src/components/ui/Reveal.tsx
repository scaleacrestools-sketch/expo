import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' };

/** Scroll-triggered fade + slide reveal. Respects reduced motion. */
export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const C = as === 'li' ? motion.li : motion.div;
  return (
    <C
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </C>
  );
}
