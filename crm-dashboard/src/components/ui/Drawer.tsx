import { useCallback, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId?: string;
  children: ReactNode;
}

/**
 * Accessible side panel (bottom sheet below 640px): role="dialog", aria-modal, focus trap,
 * Escape to close, focus restored on close.
 */
export function Drawer({ open, onClose, titleId, descriptionId, children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(panelRef, open, close);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40" data-export-group="drawer">
      <div className="absolute inset-0 bg-sidebar/55 backdrop-blur-[2px]" aria-hidden="true" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="absolute inset-x-0 bottom-0 flex max-h-[94dvh] flex-col rounded-t-2xl bg-surface shadow-[var(--shadow-pop)] sm:inset-y-3 sm:left-auto sm:right-3 sm:max-h-none sm:w-[500px] sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close opportunity details"
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-lg text-ink-4 transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line-strong sm:hidden" aria-hidden="true" />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
