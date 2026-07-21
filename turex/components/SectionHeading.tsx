import type { ReactNode } from 'react';
import Reveal from './Reveal';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <Reveal className={`flex flex-col gap-4 ${alignment}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-core">
        {eyebrow}
      </span>
      <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
