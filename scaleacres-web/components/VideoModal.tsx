"use client";

import { useEffect, useRef, useState } from "react";
import type { StudioVideo } from "@/content/studio";

/** Accessible video player dialog: native controls, mute toggle, fullscreen, Escape to close. */
export function VideoModal({ video, onClose }: { video: StudioVideo | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (video) {
      if (!d.open) d.showModal();
      const v = vid.current;
      if (v) { v.muted = true; v.load(); v.play().catch(() => undefined); }
    } else if (d.open) {
      vid.current?.pause();
      d.close();
    }
  }, [video]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCloseEvt = () => onClose();
    d.addEventListener("close", onCloseEvt);
    return () => d.removeEventListener("close", onCloseEvt);
  }, [onClose]);

  const toggleMute = () => { const v = vid.current; if (v) v.muted = !v.muted; };
  const fullscreen = () => { vid.current?.requestFullscreen?.().catch(() => undefined); };

  return (
    <dialog
      ref={dialog}
      aria-label={video ? video.title : "Video player"}
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}
      className="m-auto w-[min(96vw,1280px)] max-w-none rounded-sm border border-white/15 bg-ink p-0 text-white backdrop:bg-ink/90 backdrop:backdrop-blur-sm"
    >
      {video ? (
        <div>
          <video
            key={video.id}
            ref={vid}
            src={video.src}
            controls
            playsInline
            preload="metadata"
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            className="mx-auto max-h-[78vh] w-full bg-black"
          />
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="label text-blue">{video.category}</p>
              <p className="mt-1 truncate text-lg font-semibold">{video.title}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={toggleMute} aria-pressed={!muted} className="rounded-full border border-white/25 px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-blue hover:bg-blue hover:text-on-accent">{muted ? "Unmute" : "Mute"}</button>
              <button type="button" onClick={fullscreen} className="rounded-full border border-white/25 px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-blue hover:bg-blue hover:text-on-accent">Fullscreen</button>
              <button type="button" onClick={onClose} className="rounded-full border border-white/25 px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-blue hover:bg-blue hover:text-on-accent">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
