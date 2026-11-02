import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-white shadow-sm hover:bg-accent-strong hover:border-accent-strong',
  secondary: 'border-line-strong bg-surface text-ink-2 shadow-sm hover:bg-surface-muted hover:text-ink',
  ghost: 'border-transparent bg-transparent text-accent hover:bg-accent-soft',
  subtle: 'border-transparent bg-surface-muted text-ink-2 hover:bg-line',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-4 text-sm',
};

export function Button({ variant = 'secondary', size = 'md', icon, className, type = 'button', children, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {icon ? <span aria-hidden="true" className="shrink-0 [&>svg]:size-4">{icon}</span> : null}
      {children}
    </button>
  );
}
