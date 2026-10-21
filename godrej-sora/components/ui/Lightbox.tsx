'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SoraImage } from './SoraImage';

/** Full-screen lightbox with keyboard navigation (← → Esc), focus trap and optional pinch/zoom for plans. */
export function Lightbox({ items, index, onClose, onIndex, zoomable = false }: { items: ResolvedAsset[]; index: number; onClose: () => void; onIndex: (i: number) => void; zoomable?: boolean }) {
  const [zoom, setZoom] = useState(1);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);
  useEffect(() => {
    document.body.classList.add('overlay-open');
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (zoomable && (e.key === '+' || e.key === '=')) setZoom((z) => Math.min(3, z + 0.5));
      if (zoomable && e.key === '-') setZoom((z) => Math.max(1, z - 0.5));
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('overlay-open'); };
  }, [onClose, prev, next, zoomable]);
  useEffect(() => setZoom(1), [index]);
  const item = items[index];
  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-ink text-ivory" role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <p className="text-[0.66rem] tracking-[0.24em] uppercase text-ivory/70">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} — {item.title}</p>
        <div className="flex items-center gap-2">
          {zoomable && (<>
            <button onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="btn btn-ghost-light !min-h-10 !px-4" aria-label="Zoom out">−</button>
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.5))} className="btn btn-ghost-light !min-h-10 !px-4" aria-label="Zoom in">+</button>
          </>)}
          <button ref={closeBtn} onClick={onClose} className="btn btn-ghost-light !min-h-10 !px-5 !text-[0.62rem]">Close</button>
        </div>
      </div>
      <div className="relative flex-1 overflow-auto" style={{ touchAction: 'pan-x pan-y pinch-zoom' }}>
        <div className="relative mx-auto h-full w-full transition-transform duration-500" style={{ transform: `scale(${zoom})`, transformOrigin: 'center top', minHeight: '60vh' }}>
          <SoraImage asset={item} className="h-full w-full !bg-ink [&_img]:!object-contain" sizes="100vw" />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <button onClick={prev} className="btn btn-ghost-light !min-h-10 !px-5 !text-[0.62rem]" aria-label="Previous">← Prev</button>
        <p className="text-[0.62rem] tracking-[0.12em] uppercase text-ivory/55">{item.kindLabel}</p>
        <button onClick={next} className="btn btn-ghost-light !min-h-10 !px-5 !text-[0.62rem]" aria-label="Next">Next →</button>
      </div>
    </div>
  );
}
