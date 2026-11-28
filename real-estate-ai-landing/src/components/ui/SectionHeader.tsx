import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  id?: string;
  className?: string;
  children?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, align = 'center', id, className = '', children }: Props) {
  const center = align === 'center';
  return (
    <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-[760px] ${className}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id} className="h-section mt-5">{title}</h2>
      {description && <p className={`lead mt-5 ${center ? 'mx-auto' : ''} max-w-[640px]`}>{description}</p>}
      {children}
    </Reveal>
  );
}
