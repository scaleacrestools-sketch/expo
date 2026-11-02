import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

const control =
  'h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-4 hover:border-ink-4/60';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  hideLabel?: boolean;
  children: ReactNode;
}

export function SelectField({ label, id, hideLabel, className, children, ...rest }: SelectFieldProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-xs font-medium text-ink-3', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className="relative">
        <select id={id} className={cn(control, 'appearance-none pr-9')} {...rest}>
          {children}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-4" />
      </div>
    </div>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  hint?: string;
  error?: string;
}

export function InputField({ label, id, hint, error, className, ...rest }: InputFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-medium text-ink-3">
        {label}
      </label>
      <input
        id={id}
        className={cn(control, error && 'border-danger')}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-ink-4">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
