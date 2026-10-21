'use client';
import { useState } from 'react';
import { project } from '@/content/project';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SoraImage } from '@/components/ui/SoraImage';
import { Reveal } from '@/components/ui/Reveal';
import { CtaButton } from '@/components/ui/CtaButton';
import { track } from '@/lib/analytics';

/** Click-to-play poster; the iframe/video loads only on demand. Embeds only the official walkthrough once configured. */
export function Walkthrough({ poster }: { poster: ResolvedAsset }) {
  const [play, setPlay] = useState(false);
  const w = project.walkthrough;
  const configured = w.provider !== 'none' && Boolean(w.id);
  const embed = w.provider === 'youtube' ? `https://www.youtube-nocookie.com/embed/${w.id}?autoplay=1&rel=0&modestbranding=1` : w.provider === 'vimeo' ? `https://player.vimeo.com/video/${w.id}?autoplay=1` : w.id;
  return (
    <section id="walkthrough" className="relative bg-ink py-[var(--section-y)] text-ivory">
      <div className="container-sora">
        <Reveal className="reveal max-w-2xl">
          <p className="eyebrow !text-gold">15 — Project walkthrough</p>
          <h2 className="display mt-5 text-[clamp(2.2rem,5vw,4.4rem)]">Step Into the<br /><em className="text-gold-soft">Sora Experience.</em></h2>
        </Reveal>
        <div className="relative mt-12 aspect-video overflow-hidden bg-ink-soft">
          {play && configured ? (
            w.provider === 'file' ? <video src={embed} controls autoPlay className="h-full w-full" /> : <iframe src={embed} title="Godrej Sora official walkthrough" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full" />
          ) : (
            <>
              <SoraImage asset={poster} className="h-full w-full" sizes="100vw" />
              <div className="absolute inset-0 bg-ink/35" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {configured ? (
                  <button onClick={() => { setPlay(true); track('video_play', { source: 'walkthrough' }); }} className="group flex h-20 w-20 items-center justify-center rounded-full border border-ivory/60 backdrop-blur-sm transition-colors hover:bg-ivory hover:text-ink" aria-label="Play the official walkthrough">
                    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-[0.66rem] tracking-[0.3em] uppercase text-gold">Official walkthrough</p>
                    <p className="mt-3 max-w-sm text-sm text-ivory/70">The official Godrej Sora walkthrough will appear here once embed permission is confirmed. Request a private presentation to view it today.</p>
                    <div className="mt-6"><CtaButton magnet="presentation" source="walkthrough" variant="gold">Request Private Presentation</CtaButton></div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
