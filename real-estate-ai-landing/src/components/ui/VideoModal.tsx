import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import { useApp } from './AppContext';

export function VideoModal() {
  const { videoOpen, closeVideo } = useApp();
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { if (videoOpen) setFailed(false); }, [videoOpen]);
  return (
    <Modal open={videoOpen} onClose={closeVideo} title="Product walkthrough video" wide testId="video-modal">
      <div className="p-3 sm:p-4">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
          {!failed ? (
            <video ref={ref} controls autoPlay muted playsInline preload="metadata" poster="/assets/videos/video-poster.webp" className="h-full w-full" data-testid="walkthrough-video" onError={() => setFailed(true)}>
              <source src="/assets/videos/product-walkthrough.webm" type="video/webm" />
              <source src="/assets/videos/product-walkthrough.mp4" type="video/mp4" />
              <track kind="captions" src="/assets/videos/product-walkthrough.vtt" srcLang="en" label="English" />
            </video>
          ) : (
            <div className="grid h-full place-items-center p-6 text-center text-[14px] text-white/70">The walkthrough video could not be loaded. Please try again later.</div>
          )}
        </div>
        <p className="px-1 pb-1 pt-3 text-[12.5px] text-[var(--c-muted)]">30-second product walkthrough. Silent with captions. Interface and data shown are demonstrations.</p>
      </div>
    </Modal>
  );
}
