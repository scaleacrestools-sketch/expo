import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function SectionHeading({ index, eyebrow, title, children, align = 'left', light = false, className = '' }: {
  index?: string; eyebrow: string; title: ReactNode; children?: ReactNode; align?: 'left' | 'center'; light?: boolean; className?: string;
}) {
  const ctr = align === 'center' ? 'mx-auto text-center items-center' : '';
  return (
    <div className={`relative flex max-w-3xl flex-col gap-5 ${ctr} ${className}`}>
      {index && align === 'left' && <span aria-hidden="true" className={`absolute -left-10 top-1 hidden text-[0.6rem] tracking-[0.4em] xl:block [writing-mode:vertical-rl] ${light ? 'text-ivory/35' : 'text-ink-mute/70'}`}>SECTION {index}</span>}
      <Reveal className="reveal flex items-center gap-4">
        {index && <span className={`text-[0.65rem] tracking-[0.3em] ${light ? 'text-gold' : 'text-ink-mute'}`}>{index}</span>}
        <span className={`eyebrow ${light ? '!text-gold' : ''}`}>{eyebrow}</span>
      </Reveal>
      <Reveal as="h2" className={`display reveal text-[clamp(2.1rem,5vw,4.4rem)] ${light ? 'text-ivory' : 'text-ink'}`} delay={80}>
        {title}
      </Reveal>
      {children && (
        <Reveal className={`lede reveal ${light ? '!text-ivory/75' : ''}`} delay={160}>
          {children}
        </Reveal>
      )}
    </div>
  );
}
