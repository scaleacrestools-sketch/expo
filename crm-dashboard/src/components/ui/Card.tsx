import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'article' | 'div';
  children: ReactNode;
}

export function Card({ as: Tag = 'section', className, children, ...rest }: CardProps) {
  return (
    <Tag className={cn('flex flex-col rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]', className)} {...rest}>
      {children}
    </Tag>
  );
}

interface CardHeaderProps {
  title: string;
  titleId?: string;
  description?: string;
  aside?: ReactNode;
  className?: string;
}

export function CardHeader({ title, titleId, description, aside, className }: CardHeaderProps) {
  return (
    <header className={cn('flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5 pb-3', className)}>
      <div className="min-w-0">
        <h2 id={titleId} className="text-[15px] font-semibold leading-6 text-ink">
          {title}
        </h2>
        {description ? <p className="mt-0.5 text-[13px] leading-5 text-ink-4">{description}</p> : null}
      </div>
      {aside ? <div className="flex shrink-0 flex-wrap items-center gap-2">{aside}</div> : null}
    </header>
  );
}
