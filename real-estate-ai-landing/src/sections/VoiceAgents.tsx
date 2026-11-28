import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Languages, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    const tick = () => { if (audio.current) setTime(audio.current.currentTime); raf.current = requestAnimationFrame(tick); };
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

        <Reveal className="mt-10">
          <div role="tablist" aria-label="Sample call scenarios" onKeyDown={onTabKey} className="no-scrollbar mx-auto flex max-w-full gap-1 overflow-x-auto rounded-full border border-[var(--c-line)] bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] sm:w-max">
            {voice.conversations.map((c, i) => (
              <button key={c.id} id={`voice-tab-${i}`} role="tab" aria-selected={tab === i} aria-controls="voice-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} data-testid={`voice-tab-${i}`}
                className={`relative min-h-[42px] flex-none whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors duration-150 ${tab === i ? 'text-white' : 'text-[var(--c-text)] hover:text-white'}`}>
                {tab === i && <motion.span layoutId="voice-pill" className="absolute inset-0 rounded-full bg-gradient-to-b from-[#8f6bff] to-[#6a3ff0] shadow-[0_8px_22px_-8px_rgba(106,63,240,.9),inset_0_1px_1px_rgba(255,255,255,.3)]" transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} />}
                <span className="relative">{c.tab}</span>
              </button>
            ))}
          </div>

          <div id="voice-panel" role="tabpanel" aria-labelledby={`voice-tab-${tab}`} className="card mt-5 grid overflow-hidden lg:grid-cols-[1.05fr_1fr]" data-testid="voice-panel">
            {/* Player */}
            <div className="relative border-b border-[var(--c-line)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AgentOrb size={44} live={playing} />
                  <div><p className="text-[15px] font-semibold text-white">{story.agent.name} · AI Voice Agent</p><p className="text-[12.5px] text-[var(--c-text)]">{conv.tab} · {story.project.name}</p></div>
                </div>
                <div role="radiogroup" aria-label="Call language" className="flex items-center gap-1 rounded-full border border-[var(--c-line)] bg-white/[0.03] p-1" data-testid="voice-lang">
                  <Languages size={14} className="ml-1.5 mr-0.5 text-[var(--c-muted)]" aria-hidden="true" />
                  {LANGS.map((l) => (
                    <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} onClick={() => setLang(l.id)} data-testid={`voice-lang-${l.id}`}
                      className={`min-h-[32px] rounded-full px-2.5 text-[12.5px] font-medium transition-colors duration-150 ${lang === l.id ? 'bg-white text-[#0d0d1c]' : 'text-[var(--c-text)] hover:text-white'}`}>{l.label}</button>
                  ))}
                </div>
              </div>

              {/* Waveform from the real audio (RMS peaks), coloured up to the playhead */}
              <div className="relative mt-7 h-[88px]" data-testid="voice-waveform">
                <div className="flex h-full items-center gap-[2px]" aria-hidden="true">
                  {peaks.map((h, i) => {
                    const at = i / peaks.length;
                    const done = at <= progress;
                    return <span key={`${conv.id}-${lang}-${i}`} style={{ flex: 1, height: `${Math.max(5, h * 100)}%`, borderRadius: 2, background: done ? 'linear-gradient(180deg,#cbbdff,#6a3ff0)' : 'rgba(255,255,255,0.13)', transition: 'background .12s' }} />;
                  })}
                </div>
                <input type="range" min={0} max={duration || 1} step={0.05} value={time} aria-label="Seek within the sample call" aria-valuetext={`${fmt(time)} of ${fmt(duration)}`} data-testid="voice-progress"
                  onChange={(e) => seek(+e.target.value)} className="range absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-white/70 transition-opacity" style={{ left: `${progress * 100}%`, opacity: time > 0 ? 1 : 0 }} />
              </div>
              <div className="mt-2 flex justify-between text-[12px] tabular-nums text-[var(--c-text)]"><span data-testid="voice-time">{fmt(time)}</span><span data-testid="voice-duration">{fmt(duration)}</span></div>

              <div className="mt-5 flex items-center gap-3">
                <button type="button" onClick={toggle} aria-label={playing ? 'Pause sample call' : 'Play sample call'} data-testid="voice-play"
                  className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#0d0d1c] shadow-[0_10px_30px_-8px_rgba(128,87,255,.8)] transition-transform duration-150 hover:scale-105">
                  {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="translate-x-0.5" />}
                </button>
                <button type="button" onClick={restart} aria-label="Restart sample call" data-testid="voice-restart" className="grid h-11 w-11 place-items-center rounded-full border border-[var(--c-line-strong)] text-white/80 transition-colors hover:border-[var(--brand-secondary)] hover:text-white"><RotateCcw size={17} /></button>
                <div className="ml-auto flex min-w-0 items-center gap-2 text-[12.5px]" aria-live="polite" data-testid="voice-speaker">
                  {speaker ? (
                    <><span className={`live-dot h-2 w-2 flex-none rounded-full ${speaker === 'ai' ? 'bg-[var(--brand-secondary)]' : 'bg-sky-400'}`} /><span className="truncate text-white/85">{speaker === 'ai' ? `${story.agent.name} (AI agent) speaking` : `${story.buyer.name.split(' ')[0]} (buyer) speaking`}</span></>
                  ) : <span className="text-[var(--c-muted)]">{failed ? 'Audio unavailable' : ended ? 'Call ended' : playing ? 'Listening…' : time > 0 ? 'Paused' : 'Ready to play'}</span>}
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-2" data-testid="voice-meta">
                {[['Language', LANGS.find((l) => l.id === lang)!.label], ['Duration', fmt(duration)], ['Channel', 'Outbound call']].map(([k, v]) => (
                  <div key={k} className="ui-surface px-3 py-2"><dt className="text-[10.5px] text-[var(--c-muted)]">{k}</dt><dd className="mt-0.5 truncate text-[13px] font-medium text-white">{v}</dd></div>
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
            <div className="flex flex-col p-5 sm:p-7">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--c-muted)]">Live transcript</p>
              <ol className="mt-4 flex-1 space-y-2" data-testid="voice-transcript" lang={LANGS.find((l) => l.id === lang)!.htmlLang}>
                {conv.lines.map((l, i) => {
                  const on = i === activeLine && (playing || time > 0) && !ended; const past = activeLine > i || ended;
                  return (
                    <li key={`${conv.id}-${lang}-${i}`} aria-current={on ? 'true' : undefined}
                      className={`flex gap-3 rounded-xl border p-3 transition-all duration-200 ${on ? 'border-brand/50 bg-brand/10' : 'border-transparent'} ${!on && !past && time > 0 ? 'opacity-45' : ''}`}>
                      {l.speaker === 'ai' ? <AgentOrb size={28} live={false} /> : <Avatar name={story.buyer.name} size={28} hue={195} />}
                      <div>
                        <p className="text-[11.5px] font-medium text-[var(--c-muted)]">{l.speaker === 'ai' ? `${story.agent.name} · AI Agent` : `${story.buyer.name.split(' ')[0]} · Buyer`}</p>
                        <p className="mt-0.5 text-[15px] leading-snug text-white">{lineText(i)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <AnimatePresence mode="wait">
                <motion.div key={conv.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  className={`mt-4 grid gap-3 rounded-xl border p-4 transition-colors duration-300 sm:grid-cols-[1fr_auto] ${ended ? 'border-[#12b881]/40 bg-[#12b881]/10' : 'border-[var(--c-line)] bg-white/[0.02]'}`} data-testid="voice-outcome">
                  <div>
                    <p className="flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.1em] text-[var(--c-muted)]"><CheckCircle2 size={14} className={ended ? 'text-[#12b881]' : ''} />Call outcome</p>
                    <p className="mt-1.5 text-[14.5px] text-white">{conv.outcome}</p>
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
