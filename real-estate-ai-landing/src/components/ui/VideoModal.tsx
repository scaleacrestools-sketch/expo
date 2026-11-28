import { Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import { useApp } from './AppContext';

type Version = 'voiceover' | 'silent';
const SRC: Record<Version, { webm: string; mp4: string }> = {
  voiceover: { webm: '/assets/videos/product-walkthrough-v4.webm', mp4: '/assets/videos/product-walkthrough-v4.mp4' },
  silent: { webm: '/assets/videos/product-walkthrough-v4-silent.webm', mp4: '/assets/videos/product-walkthrough-v4-silent.mp4' },
};

/**
 * Product walkthrough modal. Nothing is downloaded until the modal opens (preload="none"),
 * playback starts only when the visitor presses play, and the video stops when the modal closes.
 */
export function VideoModal() {
  const { videoOpen, closeVideo } = useApp();
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState<Version>('voiceover');

  useEffect(() => { if (videoOpen) { setFailed(false); setStarted(false); } else ref.current?.pause(); }, [videoOpen]);

  const start = () => { setStarted(true); window.setTimeout(() => ref.current?.play().catch(() => undefined), 0); };
  const switchVersion = (v: Version) => {
    const at = ref.current?.currentTime ?? 0; const wasPlaying = !!ref.current && !ref.current.paused;
    setVersion(v);
    window.setTimeout(() => { const el = ref.current; if (!el) return; el.load(); el.currentTime = at; if (wasPlaying) el.play().catch(() => undefined); }, 0);
  };
  const close = () => { ref.current?.pause(); closeVideo(); };

  return (
    <Modal open={videoOpen} onClose={close} title="Product walkthrough video" wide testId="video-modal">
      <div className="p-3 sm:p-4">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#080515]">
          {!failed ? (
            <video key={version} ref={ref} controls={started} playsInline preload="none" poster="/assets/videos/product-walkthrough-poster.webp"
              className="h-full w-full" data-testid="walkthrough-video" data-version={version} onError={() => setFailed(true)} onPlay={() => setStarted(true)}>
              <source src={SRC[version].webm} type="video/webm" />
              <source src={SRC[version].mp4} type="video/mp4" />
              <track kind="captions" src="/assets/videos/product-walkthrough-v4.vtt" srcLang="en" label="English" />
            </video>
          ) : (
            <div className="grid h-full place-items-center p-6 text-center text-[14px] text-white/70">The walkthrough video could not be loaded. Please try again later.</div>
          )}
          {!started && !failed && (
            <button type="button" onClick={start} data-autofocus className="group absolute inset-0 grid place-items-center bg-[radial-gradient(closest-side,rgba(8,5,21,.15),rgba(8,5,21,.55))]" aria-label="Play the product walkthrough" data-testid="video-play-overlay">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-[#0d0d1c] shadow-[0_20px_60px_-10px_rgba(128,87,255,.9)] transition-transform duration-200 group-hover:scale-105">
                <Play size={30} fill="currentColor" className="translate-x-0.5" />
              </span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-1 pt-3">
          <p className="text-[12.5px] text-[var(--c-muted)]">78-second walkthrough with captions. Interface and data are demonstrations.</p>
          <div role="radiogroup" aria-label="Audio" className="flex rounded-full border border-[var(--c-line)] bg-white/[0.03] p-1 text-[12.5px]">
            {([['voiceover', 'Voice-over', Volume2], ['silent', 'Silent', VolumeX]] as const).map(([v, l, I]) => (
              <button key={v} type="button" role="radio" aria-checked={version === v} onClick={() => switchVersion(v)} data-testid={`video-version-${v}`}
                className={`flex min-h-[32px] items-center gap-1.5 rounded-full px-3 font-medium transition-colors ${version === v ? 'bg-white text-[#0d0d1c]' : 'text-[var(--c-text)] hover:text-white'}`}><I size={13} />{l}</button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
