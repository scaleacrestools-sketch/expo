import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean; theme?: 'dark' | 'light'; testId?: string };

/** Accessible modal: role=dialog, focus trap, Esc to close, focus restore, scroll lock. */
export function Modal({ open, onClose, title, children, wide, theme = 'dark', testId }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>('[data-autofocus], input, button, video, [tabindex]:not([tabindex="-1"])');
      first?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, video, [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; prev?.focus?.(); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panel}
            role="dialog" aria-modal="true" aria-label={title} data-testid={testId}
            className={`theme-${theme} relative max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] border border-[var(--c-line)] shadow-2xl sm:rounded-[24px] ${wide ? 'max-w-[1040px]' : 'max-w-[620px]'}`}
            initial={reduce ? false : { y: 30, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" onClick={onClose} aria-label="Close dialog" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-[var(--c-line)] bg-[var(--c-card)] text-[var(--c-head)] transition hover:border-[var(--brand-secondary)]">
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
