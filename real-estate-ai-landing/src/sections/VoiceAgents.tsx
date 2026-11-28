import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Languages, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { voice } from '../data/content';
import timings from '../data/audio-timings.json';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AgentOrb, Avatar } from '../components/dashboards/primitives';

type Lang = 'en' | 'hi';
type Timing = { src: string; duration: number; segments: { start: number; end: number }[] };
const T = timings as Record<string, Timing>;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const BARS = 64;

export function VoiceAgents() {
  const [tab, setTab] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [ended, setEnded] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [fbLine, setFbLine] = useState(-1);
  const audio = useRef<HTMLAudioElement>(null);
  const conv = voice.conversations[tab];
  const timing = T[`${conv.id}-${lang}`];
  const duration = timing?.duration ?? 0;

  const bars = useMemo(() => Array.from({ length: BARS }, (_, i) => {
    const tt = (i / BARS) * duration;
    const inSeg = timing?.segments.find((s) => tt >= s.start && tt <= s.end);
    return inSeg ? 0.3 + 0.7 * Math.abs(Math.sin(i * 2.3 + tab) * Math.cos(i * 0.7)) : 0.08;
  }), [timing, duration, tab]);

  const activeLine = fallback ? fbLine : timing ? timing.segments.findIndex((s) => time >= s.start - 0.05 && time <= s.end + 0.3) : -1;
  const speaker = activeLine >= 0 ? conv.lines[activeLine]?.speaker : null;

  const stopAll = useCallback(() => {
    audio.current?.pause();
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  // Reset when tab or language changes.
  useEffect(() => { stopAll(); setTime(0); setEnded(false); setFbLine(-1); if (audio.current) audio.current.currentTime = 0; }, [tab, lang, stopAll]);

  const speakFallback = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();
    conv.lines.forEach((l, i) => {
      const u = new SpeechSynthesisUtterance(lang === 'en' ? l.en : l.hiTts);
      u.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      u.pitch = l.speaker === 'ai' ? 1.15 : 0.85;
      u.onstart = () => setFbLine(i);
      if (i === conv.lines.length - 1) u.onend = () => { setPlaying(false); setEnded(true); };
      speechSynthesis.speak(u);
    });
    setPlaying(true);
  }, [conv, lang]);

  const play = useCallback(async () => {
    setEnded(false);
    if (fallback) { speakFallback(); return; }
    const a = audio.current; if (!a) return;
    try { await a.play(); } catch { /* autoplay blocked or decode error, handled by onError */ }
  }, [fallback, speakFallback]);

  const toggle = () => (playing ? stopAll() : play());
  const restart = () => { stopAll(); if (audio.current) audio.current.currentTime = 0; setTime(0); setFbLine(-1); setEnded(false); window.setTimeout(play, 50); };

  useEffect(() => {
    const on = () => { setTab(0); setLang('en'); window.setTimeout(() => audio.current?.play().catch(() => undefined), 120); };
    window.addEventListener('voice:play-sample', on);
    return () => window.removeEventListener('voice:play-sample', on);
  }, []);

  const progress = duration ? Math.min(1, time / duration) : 0;

  return (
    <Section id="voice-agents" theme="dark" label="AI voice agents" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent)]" />
      <div className="container-x section-y relative">
        <SectionHeader eyebrow={voice.eyebrow} title={voice.title} description={voice.description} />

        <Reveal className="mt-12">
          <div role="tablist" aria-label="Sample call scenarios" className="no-scrollbar mx-auto flex max-w-full gap-1 overflow-x-auto rounded-full border border-[var(--c-line)] bg-white/[0.03] p-1 sm:w-max"
            onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (tab + (e.key === 'ArrowRight' ? 1 : 3)) % 4; setTab(n); document.getElementById(`voice-tab-${n}`)?.focus(); } }}>
            {voice.conversations.map((c, i) => (
              <button key={c.id} id={`voice-tab-${i}`} role="tab" aria-selected={tab === i} aria-controls="voice-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} data-testid={`voice-tab-${i}`}
                className={`relative min-h-[42px] flex-none whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors ${tab === i ? 'text-white' : 'text-white/55 hover:text-white'}`}>
                {tab === i && <motion.span layoutId="voice-pill" className="absolute inset-0 rounded-full bg-[var(--brand-primary)] shadow-[0_8px_24px_-8px_rgba(139,92,246,.9)]" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
                <span className="relative">{c.tab}</span>
              </button>
            ))}
          </div>

          <div id="voice-panel" role="tabpanel" aria-labelledby={`voice-tab-${tab}`} className="card mt-6 grid overflow-hidden lg:grid-cols-[1.05fr_1fr]" data-testid="voice-panel">
            {/* Player */}
            <div className="relative border-b border-[var(--c-line)] p-5 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AgentOrb size={44} live={playing} />
                  <div><p className="text-[15px] font-semibold text-white">Aria · AI sales agent</p><p className="text-[12.5px] text-white/50">{conv.tab} · sample call</p></div>
                </div>
                <label className="flex items-center gap-2 rounded-full border border-[var(--c-line)] bg-white/[0.03] py-1 pl-3 pr-1 text-[12.5px] text-white/70">
                  <Languages size={14} /><span className="sr-only">Language</span>
                  <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="min-h-[32px] rounded-full bg-[var(--c-card-2)] px-2 text-[12.5px] text-white outline-none" data-testid="voice-lang">
                    <option value="en">English</option><option value="hi">Hindi / Hinglish</option>
                  </select>
                </label>
              </div>

              <div className="mt-8 flex h-[92px] items-center gap-[3px]" aria-hidden="true">
                {bars.map((h, i) => {
                  const done = i / BARS <= progress;
                  return <span key={i} className={playing && Math.abs(i / BARS - progress) < 0.06 ? 'wave-bar' : ''} style={{ flex: 1, height: `${Math.max(6, h * 100)}%`, borderRadius: 3, background: done ? 'linear-gradient(180deg,#c4b5fd,#7c3aed)' : 'rgba(255,255,255,0.14)', transition: 'background .2s' }} />;
                })}
              </div>

              <div className="mt-5">
                <input type="range" min={0} max={duration || 1} step={0.05} value={time} aria-label="Audio progress" data-testid="voice-progress"
                  onChange={(e) => { const v = +e.target.value; setTime(v); if (audio.current) audio.current.currentTime = v; }}
                  className="w-full accent-[var(--brand-primary)]" disabled={fallback} />
                <div className="mt-1 flex justify-between text-[12px] tabular-nums text-white/50"><span data-testid="voice-time">{fmt(time)}</span><span>{fmt(duration)}</span></div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button type="button" onClick={toggle} aria-label={playing ? 'Pause sample call' : 'Play sample call'} data-testid="voice-play"
                  className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#0f0f14] shadow-[0_10px_30px_-8px_rgba(139,92,246,.8)] transition hover:scale-105">
                  {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="translate-x-0.5" />}
                </button>
                <button type="button" onClick={restart} aria-label="Restart sample call" data-testid="voice-restart" className="grid h-11 w-11 place-items-center rounded-full border border-[var(--c-line-strong)] text-white/80 transition hover:border-[var(--brand-secondary)] hover:text-white"><RotateCcw size={17} /></button>
                <div className="ml-auto flex items-center gap-2 text-[12.5px]" aria-live="polite">
                  {speaker ? (<><span className={`live-dot h-2 w-2 rounded-full ${speaker === 'ai' ? 'bg-[var(--brand-secondary)]' : 'bg-sky-400'}`} /><span className="text-white/80">{speaker === 'ai' ? 'AI agent speaking' : 'Buyer speaking'}</span></>)
                    : <span className="flex items-center gap-1.5 text-white/45"><Volume2 size={14} />{ended ? 'Call ended' : playing ? 'Listening…' : 'Ready to play'}</span>}
                </div>
              </div>
              <p className="mt-6 text-[11.5px] leading-relaxed text-white/40">
                {fallback ? 'Audio file unavailable. Playing with your browser’s built-in speech voice instead. ' : ''}
                Simulated conversation with synthetic open-source TTS voices (Flite / eSpeak NG). Not a real customer call.
              </p>
              {timing && (
                <audio ref={audio} src={timing.src} preload="metadata"
                  onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                  onEnded={() => { setPlaying(false); setEnded(true); }} onError={() => setFallback(true)} data-testid="voice-audio" />
              )}
            </div>

            {/* Transcript */}
            <div className="flex flex-col p-5 sm:p-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/40">Live transcript</p>
              <ol className="mt-4 flex-1 space-y-3" data-testid="voice-transcript">
                {conv.lines.map((l, i) => {
                  const on = i === activeLine; const past = activeLine > i || ended;
                  return (
                    <li key={`${conv.id}-${lang}-${i}`} aria-current={on ? 'true' : undefined}
                      className={`flex gap-3 rounded-xl border p-3 transition-all duration-300 ${on ? 'border-brand/50 bg-brand/10' : 'border-transparent'} ${!on && !past && (playing || activeLine >= 0) ? 'opacity-45' : ''}`}>
                      {l.speaker === 'ai' ? <AgentOrb size={28} live={false} /> : <Avatar name="Buyer" size={28} hue={195} />}
                      <div>
                        <p className="text-[11.5px] font-medium text-white/45">{l.speaker === 'ai' ? 'AI Agent' : 'Buyer'}</p>
                        <p className="mt-0.5 text-[15px] leading-snug text-white">{lang === 'en' ? l.en : l.hi}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <AnimatePresence mode="wait">
                <motion.div key={conv.id + String(ended)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`mt-5 rounded-xl border p-4 ${ended ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-[var(--c-line)] bg-white/[0.02]'}`} data-testid="voice-outcome">
                  <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.1em] text-white/50"><CheckCircle2 size={14} className={ended ? 'text-emerald-400' : ''} />Call outcome</p>
                  <p className="mt-1.5 text-[14.5px] text-white">{conv.outcome.en}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
