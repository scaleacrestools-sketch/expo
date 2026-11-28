import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { ease, motionTokens } from '../../config/motion';

export type RevealVariant = 'up' | 'scale' | 'left' | 'right' | 'blur' | 'tilt';
type Props = { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li'; variant?: RevealVariant };

const from = (v: RevealVariant, y: number) => {
  switch (v) {
    case 'scale': return { opacity: 0, scale: 0.94, y: 10 };
    case 'left': return { opacity: 0, x: -28 };
    case 'right': return { opacity: 0, x: 28 };
    case 'blur': return { opacity: 0, filter: 'blur(10px)', y: 8 };
    case 'tilt': return { opacity: 0, rotateX: 12, y: 24, transformPerspective: 1200 };
    default: return { opacity: 0, y };
  }
};

/** Scroll-triggered reveal with per-section variants (V3). Respects reduced motion. */
export function Reveal({ children, delay = 0, y = motionTokens.y, className, as = 'div', variant = 'up' }: Props) {
  const reduce = useReducedMotion();
  const C = as === 'li' ? motion.li : motion.div;
  return (
    <C
      className={className}
      initial={reduce ? false : from(variant, y)}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: variant === 'scale' || variant === 'tilt' ? 0.62 : motionTokens.enter, delay, ease }}
    >
      {children}
    </C>
  );
}
