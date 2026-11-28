import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Languages, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { voice } from '../data/content';
import { story } from '../data/story';
import timings from '../data/audio-timings.json';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AgentOrb, Avatar, Status } from '../components/dashboards/primitives';

type Lang = 'en' | 'hinglish' | 'hi';
type Timing = { src: string; duration: number; segments: { start: number; end: number }[]; peaks: number[] };
const T = timings as Record<string, Timing>;
const LANGS: { id: Lang; label: string; htmlLang: string }[] = [
  { id: 'en', label: 'English', htmlLang: 'en-IN' },
  { id: 'hinglish', label: 'Hinglish', htmlLang: 'hi-Latn' },
  { id: 'hi', label: 'हिन्दी', htmlLang: 'hi' },
];
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function VoiceAgents() {
  const [tab, setTab] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const raf = useRef(0);
  const conv = voice.conversations[tab];
  const timing = T[`${conv.id}-${lang}`];
  const duration = timing?.duration ?? 0;
  const progress = duration ? Math.min(1, time / duration) : 0;
  const activeLine = timing ? timing.segments.findIndex((s) => time >= s.start - 0.05 && time <= s.end + 0.25) : -1;
  const speaker = playing && activeLine >= 0 ? conv.lines[activeLine]?.speaker : null;

  // Smooth time updates while playing (timeupdate fires only ~4×/s).
  useEffect(() => {
    if (!playing) return;
    let last = -1;
    const tick = () => { const a = audio.current; if (a && Math.abs(a.currentTime - last) >= 0.04) { last = a.currentTime; setTime(last); } raf.current = requestAnimationFrame(tick); };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const stop = useCallback(() => { audio.current?.pause(); setPlaying(false); }, []);
  useEffect(() => { stop(); setTime(0); setEnded(false); setFailed(false); if (audio.current) audio.current.currentTime = 0; }, [tab, lang, stop]);

  const play = useCallback(async () => {
    const a = audio.current; if (!a) return;
    setEnded(false);
    if (a.ended || a.currentTime >= duration - 0.05) a.currentTime = 0;
    try { await a.play(); } catch { /* handled by onError */ }
  }, [duration]);
  const toggle = () => (playing ? stop() : play());
  const restart = () => { if (audio.current) audio.current.currentTime = 0; setTime(0); setEnded(false); play(); };
  const seek = (v: number) => { setTime(v); if (audio.current) audio.current.currentTime = v; setEnded(false); };

  useEffect(() => {
    const on = () => { setTab(0); setLang('en'); window.setTimeout(() => audio.current?.play().catch(() => undefined), 150); };
    window.addEventListener('voice:play-sample', on);
    return () => window.removeEventListener('voice:play-sample', on);
  }, []);

  const lineText = (i: number) => conv.lines[i][lang === 'en' ? 'en' : lang === 'hi' ? 'hi' : 'hinglish'];
  const peaks = timing?.peaks ?? [];
  const onTabKey = (e: React.KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const cur = Number((document.activeElement?.id || '').replace('voice-tab-', '')) || 0;
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? 3 : (cur + (e.key === 'ArrowRight' ? 1 : 3)) % 4;
    setTab(n); document.getElementById(`voice-tab-${n}`)?.focus();
  };

  return (
    <Section id="voice-agents" theme="dark" sheet horizon label="AI voice agents" className="overflow-hidden">
      <div className="container-x section-y relative">
        <SectionHeader eyebrow={voice.eyebrow} title={voice.title} description={voice.description} />

        <Reveal className="mt-10" variant="scale">
          <div role="tablist" aria-label="Sample call scenarios" onKeyDown={onTabKey} className="mx-auto grid max-w-full grid-cols-2 gap-1 rounded-[22px] border border-[var(--c-line)] bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] sm:flex sm:w-max sm:rounded-full">
            {voice.conversations.map((c, i) => (
              <button key={c.id} id={`voice-tab-${i}`} role="tab" aria-selected={tab === i} aria-controls="voice-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} data-testid={`voice-tab-${i}`}
                className={`relative min-h-[44px] flex-none rounded-full px-3 text-[13px] font-medium leading-tight sm:whitespace-nowrap sm:px-4 sm:text-[14px] transition-[color,background-color,box-shadow] duration-150 ${tab === i ? 'bg-gradient-to-b from-[#8f6bff] to-[#6a3ff0] text-white shadow-[0_8px_22px_-8px_rgba(106,63,240,.9),inset_0_1px_1px_rgba(255,255,255,.3)]' : 'text-[var(--c-text)] hover:text-white'}`}>
                {c.tab}
              </button>
            ))}
          </div>

          <div id="voice-panel" role="tabpanel" aria-labelledby={`voice-tab-${tab}`} className="product p-shell mt-5 grid !bg-white lg:grid-cols-[1.05fr_1fr]" data-testid="voice-panel">
            {/* Player */}
            <div className="relative border-b border-[var(--p-line)] bg-white p-4 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AgentOrb size={44} live={playing} />
                  <div><p className="text-[15px] font-semibold text-[var(--p-text)]">{story.agent.name} · AI Voice Agent</p><p className="text-[12.5px] text-[var(--p-muted)]">{conv.tab} · {story.project.name}</p></div>
                </div>
                <div role="radiogroup" aria-label="Call language" className="flex items-center gap-1 rounded-full border border-[var(--p-line)] bg-[#f2f4f7] p-1" data-testid="voice-lang">
                  <Languages size={14} className="ml-1.5 mr-0.5 text-[var(--c-muted)]" aria-hidden="true" />
                  {LANGS.map((l) => (
                    <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} onClick={() => setLang(l.id)} data-testid={`voice-lang-${l.id}`}
                      className={`min-h-[32px] rounded-full px-2.5 text-[12.5px] font-medium transition-colors duration-150 ${lang === l.id ? 'bg-white font-semibold text-[var(--p-text)] shadow-[0_1px_2px_rgba(16,24,40,.14)]' : 'text-[var(--p-muted)] hover:text-[var(--p-text)]'}`}>{l.label}</button>
                  ))}
                </div>
              </div>

              {/* Waveform from the real audio (RMS peaks), coloured up to the playhead */}
              <div className="relative mt-6 h-[96px] rounded-xl border border-[var(--p-line)] bg-[var(--p-bg)] px-3 py-2" data-testid="voice-waveform">
                <Wave peaks={peaks} progress={progress} id={`${conv.id}-${lang}`} />
                <input type="range" min={0} max={duration || 1} step={0.05} value={time} aria-label="Seek within the sample call" aria-valuetext={`${fmt(time)} of ${fmt(duration)}`} data-testid="voice-progress"
                  onChange={(e) => seek(+e.target.value)} className="range absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-2 w-[2px] rounded bg-[var(--p-accent)] transition-opacity" style={{ left: `calc(12px + (100% - 24px) * ${progress})`, opacity: time > 0 ? 1 : 0 }} />
              </div>
              <div className="mt-2 flex justify-between text-[12px] font-medium tabular-nums text-[var(--p-muted)]"><span data-testid="voice-time">{fmt(time)}</span><span data-testid="voice-duration">{fmt(duration)}</span></div>

              <div className="mt-5 flex items-center gap-3">
                <button type="button" onClick={toggle} aria-label={playing ? 'Pause sample call' : 'Play sample call'} data-testid="voice-play"
                  className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-[#8f6bff] to-[#6a3ff0] text-white shadow-[0_10px_24px_-8px_rgba(106,63,240,.8),inset_0_1.5px_1px_rgba(255,255,255,.3)] transition-transform duration-200 hover:scale-105">
                  {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="translate-x-0.5" />}
                </button>
                <button type="button" onClick={restart} aria-label="Restart sample call" data-testid="voice-restart" className="grid h-11 w-11 place-items-center rounded-full border border-[var(--p-line-strong)] bg-white text-[var(--p-body)] shadow-[var(--p-shadow-sm)] transition-colors duration-200 hover:border-[var(--p-accent)] hover:text-[var(--p-accent)]"><RotateCcw size={17} /></button>
                <div className="ml-auto flex min-w-0 items-center gap-2 text-[12.5px]" aria-live="polite" data-testid="voice-speaker">
                  {speaker ? (
                    <><span className={`h-2 w-2 flex-none rounded-full ${speaker === 'ai' ? 'bg-[var(--p-accent)]' : 'bg-sky-500'}`} style={{ animation: 'blink 1.2s ease-in-out infinite' }} /><span className="truncate font-medium text-[var(--p-text)]">{speaker === 'ai' ? `${story.agent.name} (AI agent) speaking` : `${story.buyer.name.split(' ')[0]} (buyer) speaking`}</span></>
                  ) : <span className="text-[var(--c-muted)]">{failed ? 'Audio unavailable' : ended ? 'Call ended' : playing ? 'Listening…' : time > 0 ? 'Paused' : 'Ready to play'}</span>}
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-2" data-testid="voice-meta">
                {[['Language', LANGS.find((l) => l.id === lang)!.label], ['Duration', fmt(duration)], ['Channel', 'Outbound']].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-[var(--p-line)] bg-[var(--p-bg)] px-3 py-2"><dt className="p-label !text-[9.5px]">{k}</dt><dd className="mt-0.5 truncate text-[13px] font-semibold text-[var(--p-text)]">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-4 text-[11.5px] leading-relaxed text-[var(--c-muted)]">
                {failed ? 'The audio file could not be loaded. The transcript and outcome below are still accurate. ' : ''}
                Simulated conversation voiced with licensed ElevenLabs text-to-speech voices. Not a real customer call.
              </p>
              {timing && (
                <audio ref={audio} src={timing.src} preload="none"
                  onPlay={() => setPlaying(true)} onPause={() => { setPlaying(false); if (audio.current) setTime(audio.current.currentTime); }}
                  onEnded={() => { setPlaying(false); setEnded(true); setTime(duration); }} onError={() => { setFailed(true); setPlaying(false); }} data-testid="voice-audio" />
              )}
            </div>

            {/* Transcript */}
            <div className="flex flex-col bg-[var(--p-bg)] p-4 sm:p-7">
              <p className="p-label flex items-center justify-between">Live transcript<span className="normal-case tracking-normal">{conv.lines.length} turns</span></p>
              <ol className="mt-4 flex-1 space-y-2" data-testid="voice-transcript" lang={LANGS.find((l) => l.id === lang)!.htmlLang}>
                {conv.lines.map((l, i) => {
                  const on = i === activeLine && (playing || time > 0) && !ended; const past = activeLine > i || ended;
                  return (
                    <li key={`${conv.id}-${lang}-${i}`} aria-current={on ? 'true' : undefined}
                      className={`flex gap-3 rounded-xl border bg-white p-3 transition-[border-color,box-shadow,opacity] duration-300 ${on ? 'border-[var(--p-accent)] shadow-[0_0_0_3px_var(--p-accent-soft)]' : 'border-[var(--p-line)]'} ${!on && !past && time > 0 ? 'opacity-50' : ''}`}>
                      {l.speaker === 'ai' ? <AgentOrb size={28} live={false} /> : <Avatar name={story.buyer.name} size={28} hue={195} />}
                      <div>
                        <p className="text-[11.5px] font-medium text-[var(--c-muted)]">{l.speaker === 'ai' ? `${story.agent.name} · AI Agent` : `${story.buyer.name.split(' ')[0]} · Buyer`}</p>
                        <p className="mt-0.5 text-[15px] leading-snug text-[var(--p-text)]">{lineText(i)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <AnimatePresence mode="wait">
                <motion.div key={conv.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  className={`mt-4 grid gap-3 rounded-xl border p-4 transition-colors duration-300 sm:grid-cols-[1fr_auto] ${ended ? 'border-[#86efac] bg-[#f0fdf4]' : 'border-[var(--p-line)] bg-white'}`} data-testid="voice-outcome">
                  <div>
                    <p className="flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.1em] text-[var(--c-muted)]"><CheckCircle2 size={14} className={ended ? 'text-[var(--p-success)]' : ''} />Call outcome</p>
                    <p className="mt-1.5 text-[14.5px] font-medium text-[var(--p-text)]">{conv.outcome}</p>
                  </div>
                  <div className="sm:text-right" data-testid="voice-result">
                    <p className="flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.1em] text-[var(--c-muted)] sm:justify-end"><Sparkles size={12} />{conv.result.label}</p>
                    <div className="mt-1.5"><Status tone={conv.result.tone}>{conv.result.value}</Status></div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Real-audio waveform as one SVG path; playback only moves a clip rectangle, so updates stay cheap. */
const WavePath = memo(function WavePath({ peaks, fill }: { peaks: number[]; fill: string }) {
  const n = peaks.length || 1; const w = 1000 / n; const gap = w * 0.28;
  const d = peaks.map((h, i) => { const bh = Math.max(5, h * 100); const y = (100 - bh) / 2; return `M${(i * w + gap / 2).toFixed(1)} ${y.toFixed(1)}h${(w - gap).toFixed(1)}v${bh.toFixed(1)}h-${(w - gap).toFixed(1)}z`; }).join('');
  return <path d={d} fill={fill} />;
});
function Wave({ peaks, progress, id }: { peaks: number[]; progress: number; id: string }) {
  const clip = `wave-clip-${id}`;
  return (
    <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8f6bff" /><stop offset="1" stopColor="#5b34d6" /></linearGradient>
        <clipPath id={clip}><rect x="0" y="0" height="100" width={1000 * progress} /></clipPath>
      </defs>
      <WavePath peaks={peaks} fill="#d0d5dd" />
      <g clipPath={`url(#${clip})`}><WavePath peaks={peaks} fill="url(#wave-fill)" /></g>
    </svg>
  );
}
