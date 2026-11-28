import { CalendarCheck2, CheckCircle2, MessageCircle, PhoneCall, Target, UserCheck, UserPlus, type LucideIcon } from 'lucide-react';
import { story } from '../../data/story';
import { heroMetrics, heroTrend } from '../../data/demo-data';
import { Avatar, CampaignChart, DashboardShell, MetricCard, StatusBadge, VoiceWaveform } from '../product';
import { HERO_STEPS, heroState } from './CommandCenter';

/**
 * MobileDashboard (V4): a dedicated phone-width composition of the white CRM — no sidebar, a readable 2×2 metric
 * grid, a compact chart and ONE activity notification that changes as the same 9-stage story plays.
 */
const icons = [PhoneCall, Target, UserCheck, CalendarCheck2] as const;
const tones = ['accent', 'info', 'success', 'warning'] as const;

export function HeroMobile({ phase }: { phase: number }) {
  const { live, lead, updated } = heroState(phase);
  const note: { icon: LucideIcon; tone: 'accent' | 'success' | 'warning' | 'info' | 'whatsapp'; title: string; body: string } =
    phase === 0 ? { icon: UserPlus, tone: 'info', title: 'New lead received', body: `${story.buyer.source} · ${story.requirement.configuration} · ${story.requirement.budget}` }
    : phase <= 2 ? { icon: PhoneCall, tone: 'accent', title: phase === 1 ? 'AI agent activated' : 'Calling Rohan…', body: `${story.agent.name} is calling within permitted hours` }
    : phase <= 4 ? { icon: PhoneCall, tone: 'accent', title: 'AI call in progress', body: phase === 3 ? '“Which configuration and budget suit you?”' : `“A ${story.requirement.configuration}, around ${story.requirement.budgetShort}.”` }
    : phase <= 6 ? { icon: CheckCircle2, tone: 'success', title: `Buyer qualified · score ${story.score}`, body: `${story.requirement.configuration} · ${story.requirement.budgetShort} · ${story.requirement.purpose} · ${story.requirement.timeline}` }
    : phase === 7 ? { icon: CalendarCheck2, tone: 'warning', title: 'Site visit requested', body: `${story.visit.label} · ${story.visit.time} · ${story.project.name}` }
    : { icon: MessageCircle, tone: 'whatsapp', title: 'WhatsApp follow-up sent', body: `Brochure and visit details shared · assigned to ${story.executive.name}` };
  const chip = { accent: 'bg-[var(--p-accent-soft)] text-[var(--p-accent)]', success: 'bg-[var(--p-success-soft)] text-[var(--p-success)]', warning: 'bg-[var(--p-warning-soft)] text-[var(--p-warning)]', info: 'bg-[var(--p-info-soft)] text-[var(--p-info)]', whatsapp: 'bg-[#dcfce7] text-[#128c7e]' }[note.tone];
  return (
    <DashboardShell chrome={false} className="!rounded-[20px]">
      <div className="p-3" data-testid="hero-mobile">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0"><p className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--p-text)]">Overview</p><p className="truncate text-[11.5px] text-[var(--p-muted)]">{story.project.campaign}</p></div>
          <StatusBadge tone="ok">Live</StatusBadge>
        </div>

        {/* 2 × 2 metrics */}
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {heroMetrics.map((m, i) => {
            const bump = updated && i !== 1; const v = m.value + (bump ? 1 : 0);
            return <MetricCard key={m.label} label={m.label} icon={icons[i]} tone={tones[i]} flash={bump} className="!p-2.5"
              value={<span key={v} className="text-[19px]" style={bump ? { animation: 'pop .45s var(--ease-out) both', display: 'inline-block' } : undefined}>{v.toLocaleString('en-IN')}{m.suffix}{bump && <span className="ml-1 align-middle text-[10.5px] font-semibold text-[var(--p-success)]">+1</span>}</span>} />;
          })}
        </div>

        {/* Compact chart */}
        <div className="ui-surface mt-2 p-2.5">
          <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-[var(--p-text)]">Qualified leads · 12 weeks</p><span className="text-[11px] font-semibold text-[#15803d]">{updated ? '847' : '846'}</span></div>
          <CampaignChart ariaLabel="Demo trend of qualified leads over 12 weeks" labels={heroTrend.map((_, i) => `W${i + 1}`)} height={150} showAxis={false} className="mt-1"
            series={[{ key: 'q', label: 'Qualified', values: updated ? [...heroTrend.slice(0, -1), heroTrend[heroTrend.length - 1] + 6] : heroTrend }]} />
        </div>

        {/* One live lead + one notification that tells the story */}
        <div className="ui-surface mt-2 p-2.5">
          <div className="flex items-center gap-2.5">
            <Avatar name={story.buyer.name} size={32} hue={200} />
            <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-[var(--p-text)]">{story.buyer.name}</p><p className="truncate text-[11px] text-[var(--p-muted)]">{story.buyer.source} · {story.requirement.configuration} · {story.requirement.budgetShort}</p></div>
            <span key={lead.s} style={{ animation: 'pop .35s var(--ease-out) both' }}><StatusBadge tone={lead.t}>{lead.s}</StatusBadge></span>
          </div>
          <div key={note.title} className="mt-2.5 flex h-[82px] items-start overflow-hidden gap-2.5 rounded-lg border border-[var(--p-line)] bg-[var(--p-bg)] p-2.5" style={{ animation: 'rise .4s var(--ease-out) both' }}>
            <span className={`grid h-7 w-7 flex-none place-items-center rounded-lg ${chip}`}><note.icon size={14} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-[var(--p-text)]">{note.title}</p>
              {live ? <VoiceWaveform bars={30} height={16} className="my-1" /> : null}
              <p className="text-[11.5px] leading-snug text-[var(--p-body)]">{note.body}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2" aria-hidden="true">
            <div className="flex flex-1 gap-1">{HERO_STEPS.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= phase ? 'bg-[var(--p-accent)]' : 'bg-[#e5e7eb]'}`} />)}</div>
            <span className="text-[10.5px] font-medium tabular-nums text-[var(--p-muted)]">{String(phase + 1).padStart(2, '0')}/09</span>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
export { HeroMobile as MobileDashboard };
