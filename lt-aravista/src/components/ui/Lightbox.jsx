import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconClose, IconMinus, IconPlus } from './Icons';

const ZOOM_LEVELS = [1, 1.6, 2.4, 3.2];

/**
 * Full-screen image viewer with zoom. Uses the same backdrop and panel
 * animations and colours as the enquiry popup.
 */
export default function Lightbox({ image, onClose }) {
  const [zoom, setZoom] = useState(0);
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!image) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 1, ZOOM_LEVELS.length - 1));
      if (e.key === '-') setZoom((z) => Math.max(z - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [image, close]);

  if (!image) return null;
  const scale = ZOOM_LEVELS[zoom];

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex animate-popup-backdrop flex-col bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate font-serif text-lg text-white sm:text-xl">{image.title ?? image.alt}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Zoom out"
            disabled={zoom === 0}
            onClick={() => setZoom((z) => Math.max(z - 1, 0))}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconMinus />
          </button>
          <span className="w-12 text-center font-sans text-xs text-white/80 tabular-nums">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoom === ZOOM_LEVELS.length - 1}
            onClick={() => setZoom((z) => Math.min(z + 1, ZOOM_LEVELS.length - 1))}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconPlus />
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="group ml-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand/20 bg-white text-brand shadow-md transition-all duration-300 hover:bg-brand hover:text-white"
          >
            <IconClose className="text-xl transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 animate-popup-panel overflow-auto px-3 pb-4 sm:px-6">
        <div
          className="mx-auto flex min-h-full items-center justify-center"
          style={{ width: `${scale * 100}%` }}
        >
          <img
            src={image.src}
            alt={image.alt}
            onClick={() => setZoom((z) => (z === ZOOM_LEVELS.length - 1 ? 0 : z + 1))}
            className={`h-auto rounded-lg bg-white ${zoom === ZOOM_LEVELS.length - 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${zoom === 0 ? 'max-h-[calc(100svh-6rem)] w-auto max-w-full' : 'w-full'}`}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
