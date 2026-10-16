"use client";

import { useEffect, useRef, useState } from "react";
import type { StudioVideo } from "@/content/studio";

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
      // Setting muted fires `volumechange`, which keeps the button state in sync.
      if (v) { v.muted = true; v.load(); v.play().catch(() => undefined); }
    } else if (d.open) {
      vid.current?.pause();
      d.close();
    }
  }, [video]);

  // native <dialog> handles Escape + focus trapping; sync close back to state.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCloseEvt = () => onClose();
    d.addEventListener("close", onCloseEvt);
    return () => d.removeEventListener("close", onCloseEvt);
  }, [onClose]);

  const toggleMute = () => {
    const v = vid.current;
    if (v) v.muted = !v.muted;
  };

  return (
    <dialog
      ref={dialog}
      aria-label={video ? video.title : "Video player"}
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}
      className="m-auto w-[min(96vw,1100px)] max-w-none rounded-sm border border-offwhite/15 bg-ink p-0 text-offwhite shadow-none backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
    >
      {video ? (
        <div className="relative">
          <video
            key={video.id}
            ref={vid}
            poster={video.poster}
            controls
            playsInline
            preload="metadata"
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            className={`mx-auto max-h-[80vh] w-full bg-black ${video.aspect === "9/16" ? "max-w-[min(90vw,420px)]" : ""}`}
          >
            {video.sources.map((s) => (<source key={s.src} src={s.src} type={s.type} />))}
          </video>
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-blue">{video.category}</p>
              <p className="truncate text-sm font-semibold">{video.title}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={toggleMute} aria-pressed={!muted} className="rounded-full border border-offwhite/25 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] hover:border-blue hover:text-blue">
                {muted ? "Unmute" : "Mute"}
              </button>
              <button type="button" onClick={onClose} className="rounded-full border border-offwhite/25 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] hover:border-blue hover:text-blue">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
