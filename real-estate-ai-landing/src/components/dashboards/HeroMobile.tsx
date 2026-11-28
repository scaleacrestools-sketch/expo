import { CalendarCheck2, CheckCircle2, Megaphone, PhoneOutgoing, TrendingUp, UserRound } from 'lucide-react';
import { story } from '../../data/story';
import { heroMetrics } from '../../data/demo-data';
import { Waveform } from '../animations/Waveform';
import { AgentOrb, Avatar, Status } from './primitives';
import { HERO_STEPS } from './CommandCenter';

/**
 * Mobile-first hero composition (V3). Instead of shrinking the desktop command centre, one lead card
 * morphs through the same 9-stage story: enquiry → call → conversation → qualification → visit → dashboard.
 */
export function HeroMobile({ phase }: { phase: number }) {
  const status = phase >= 7 ? { s: 'Visit requested', t: 'ok' } : phase >= 5 ? { s: 'Qualified · Hot', t: 'hot' } : phase >= 1 ? { s: 'Calling', t: 'brand' } : { s: 'New', t: 'cold' };
  const profile = [
    { k: 'Configuration', v: story.requirement.configuration, at: 4 },
    { k: 'Budget', v: story.requirement.budgetShort, at: 4 },
    { k: 'Purpose', v: story.requirement.purpose, at: 5 },
    { k: 'Timeline', v: story.requirement.timeline, at: 5 },
  ];
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#121329,#0b0b18)] p-3.5 text-left shadow-[0_30px_80px_-30px_rgba(24,86,255,.45),inset_0_-16px_64px_rgba(116,176,253,.06)]" data-testid="hero-mobile">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-white">{story.project.campaign}</p>
        <span className="demo-tag !text-[9px]">Demo data</span>
      </div>

      {/* Lead card */}
      <div className={`mt-3 rounded-2xl border p-3 transition-colors duration-500 ${phase === 0 ? 'border-[#38bdf8]/50 bg-[#38bdf8]/[0.07]' : phase >= 5 ? 'border-[#12b881]/40 bg-[#12b881]/[0.05]' : 'border-white/10 bg-white/[0.03]'}`}>
        <div className="flex items-center gap-2.5">
          <Avatar name={story.buyer.name} size={34} hue={200} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-white">{story.buyer.name}</p>
            <p className="flex items-center gap-1 text-[11px] text-white/55"><Megaphone size={11} />{story.buyer.source} · {story.project.location.split(',')[0]}</p>
          </div>
          <span key={status.s} style={{ animation: 'pop .35s var(--ease-out) both' }}><Status tone={status.t}>{status.s}</Status></span>
        </div>

        {/* Stage area — fixed height so the page never jumps */}
        <div className="mt-3 h-[118px] rounded-xl border border-white/[0.07] bg-black/20 p-3">
          {phase === 0 && (
            <Stage icon={<UserRound size={13} />} title="New enquiry received">
              <p className="text-[12px] text-white/70">{story.requirement.configuration} · {story.requirement.budget} · {story.project.name}</p>
              <p className="mt-2 text-[11px] text-white/45">Queued for an instant AI call…</p>
            </Stage>
          )}
          {(phase === 1 || phase === 2) && (
            <Stage icon={<PhoneOutgoing size={13} className="blink" />} title={phase === 1 ? 'AI agent activated' : 'Calling within permitted hours'}>
              <div className="mt-1 flex items-center gap-3"><AgentOrb size={36} live /><div><p className="text-[12px] text-white/80">{story.agent.name} → {story.buyer.short}</p><p className="text-[11px] text-white/45">{phase === 1 ? 'Preparing context…' : 'Ringing…'}</p></div></div>
            </Stage>
          )}
          {(phase === 3 || phase === 4) && (
            <div style={{ animation: 'rise .35s var(--ease-out) both' }}>
              <Waveform bars={34} active height={22} />
              <p className="mt-2 text-[11.5px] text-white/75"><b className="font-medium text-[var(--brand-accent)]">AI:</b> Which configuration and budget are you considering?</p>
              {phase === 4 && <p className="mt-1 text-[11.5px] text-white/75" style={{ animation: 'rise .35s var(--ease-out) both' }}><b className="font-medium text-white">Buyer:</b> A 3 BHK, around ₹2 Cr, for my family.</p>}
            </div>
          )}
          {(phase === 5 || phase === 6) && (
            <Stage icon={<CheckCircle2 size={13} />} title={`Qualified · score ${story.score}`}>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full origin-left rounded-full bg-gradient-to-r from-[#6a3ff0] to-[#7de3bd]" style={{ animation: 'progress 1.2s var(--ease-out) both', width: `${story.score}%` }} /></div>
              <p className="mt-2 text-[11px] text-white/55">{phase === 6 ? `Assigned to ${story.executive.name}` : 'Intent: high · Ready to visit'}</p>
            </Stage>
          )}
          {phase === 7 && (
            <Stage icon={<CalendarCheck2 size={13} />} title="Site visit requested">
              <p className="text-[12.5px] font-medium text-white">{story.visit.label} · {story.visit.time}</p>
              <p className="mt-1 text-[11px] text-white/50">{story.project.name} · WhatsApp confirmation sent</p>
            </Stage>
          )}
          {phase === 8 && (
            <Stage icon={<TrendingUp size={13} />} title="Dashboard updated">
              <div className="mt-1 grid grid-cols-3 gap-2">
                {[heroMetrics[0], heroMetrics[2], heroMetrics[3]].map((m) => (
                  <div key={m.label}><p className="truncate text-[10px] text-white/45">{m.label}</p><p className="text-[14px] font-semibold tabular-nums text-white" style={{ animation: 'pop .4s var(--ease-out) both' }}>{(m.value + 1).toLocaleString('en-IN')}<span className="ml-1 text-[9.5px] text-[#7de3bd]">+1</span></p></div>
                ))}
              </div>
            </Stage>
          )}
        </div>

        {/* Buyer profile fills in as the conversation progresses */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {profile.map((f) => (
            <div key={f.k} className={`rounded-lg border px-2 py-1.5 transition-all duration-500 ${phase >= f.at ? 'border-brand/40 bg-brand/10' : 'border-white/[0.06] bg-white/[0.02]'}`}>
              <p className="text-[9.5px] uppercase tracking-[0.08em] text-white/40">{f.k}</p>
              <p className={`text-[12px] font-medium transition-colors duration-500 ${phase >= f.at ? 'text-white' : 'text-white/25'}`}>{phase >= f.at ? f.v : '—'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2" aria-hidden="true">
        <div className="flex flex-1 gap-1">{HERO_STEPS.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= phase ? 'bg-[var(--brand-secondary)]' : 'bg-white/10'}`} />)}</div>
        <span className="text-[10.5px] tabular-nums text-white/50">{String(phase + 1).padStart(2, '0')}/09</span>
      </div>
      <p className="mt-1.5 text-[12px] text-white/70">{HERO_STEPS[phase]}</p>
    </div>
  );
}

function Stage({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ animation: 'rise .35s var(--ease-out) both' }}>
      <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-white"><span className="grid h-5 w-5 place-items-center rounded-md bg-brand/25 text-[var(--brand-accent)]">{icon}</span>{title}</p>
      {children}
    </div>
  );
}
