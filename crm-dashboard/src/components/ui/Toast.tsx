import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastMessage, ToastTone } from '@/types';
import { cn } from '@/lib/cn';

const toneStyle: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: 'text-ok' },
  error: { icon: AlertCircle, className: 'text-danger' },
  info: { icon: Info, className: 'text-info' },
};

interface ToastViewportProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-20 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const { icon: Icon, className } = toneStyle[toast.tone];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-[var(--shadow-pop)]"
          >
            <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', className)} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{toast.title}</p>
              {toast.description ? <p className="mt-0.5 text-[13px] leading-5 text-ink-3">{toast.description}</p> : null}
            </div>
            <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification" className="-m-1 rounded-md p-1 text-ink-4 hover:bg-surface-muted hover:text-ink">
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
