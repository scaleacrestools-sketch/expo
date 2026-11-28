import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

type Props = {
  id?: string;
  theme: 'dark' | 'light';
  alt?: boolean;
  className?: string;
  children: ReactNode;
  label?: string;
  as?: 'section' | 'header' | 'footer';
};

/** Themed page section. Sets semantic color variables and pauses animations when off-screen. */
export function Section({ id, theme, alt, className = '', children, label, as = 'section' }: Props) {
  const { ref, inView } = useInView<HTMLElement>();
  const Tag = as;
  return (
    <Tag
      id={id}
      ref={ref as never}
      aria-label={label}
      data-theme={theme}
      data-inview={inView ? 'true' : 'false'}
      className={`theme-${theme} ${alt ? 'alt' : ''} relative ${className}`}
    >
      {children}
    </Tag>
  );
}
