import { CalendarCheck2, CalendarDays, PhoneCall, Target, UserCheck } from 'lucide-react';
import { heroLeads, heroMetrics, heroTrend } from '../../data/demo-data';
import { story } from '../../data/story';
import { ActivityTimeline, AgentOrb, AppointmentCalendar, BuyerProfile, CallCard, CampaignChart, DashboardHeader, DashboardSidebar, LeadTable, MetricCard, Panel, QualificationChecklist, ScoreBar, SelectPill, StatusBadge, productColors, type LeadRow } from '../product';

/**
 * AI Sales Command Center (white CRM). `phase` (0–8) drives the hero story:
 * 0 enquiry received · 1 AI agent active · 2 call connecting · 3 conversation · 4 requirements captured
 * 5 qualified · 6 lead status changes · 7 site visit requested · 8 dashboard updated
 */
export const HERO_STEPS = [
  'New property enquiry received',
  'AI calling agent activated',
  'Outbound call connecting',
  'Conversation in progress',
  'Buyer requirements captured',
  'Qualification complete · score 86',
  'Lead status changed to Qualified',
  'Site visit request generated',
  'Sales dashboard updated',
] as const;

const metricMeta = [
  { icon: PhoneCall, tone: 'accent', delta: '+12%' }, { icon: Target, tone: 'info', delta: '+4 pts' },
  { icon: UserCheck, tone: 'success', delta: '+15%' }, { icon: CalendarCheck2, tone: 'warning', delta: '+7%' },
] as const;

export function heroState(phase: number) {
  const live = phase >= 3 && phase <= 5;
  const onCall = phase >= 1 && phase <= 5;
  const call = phase === 0 ? { s: 'Queued', t: 'neutral' } : phase === 1 ? { s: 'Dialling', t: 'brand' } : phase === 2 ? { s: 'Ringing', t: 'brand' } : phase <= 5 ? { s: `Live · 00:${String(14 + phase * 9).padStart(2, '0')}`, t: 'ok' } : { s: 'Completed · 1m 12s', t: 'neutral' };
  const lead = phase >= 7 ? { s: 'Visit requested', t: 'ok' } : phase >= 5 ? { s: 'Qualified · Hot', t: 'hot' } : phase >= 1 ? { s: 'AI calling', t: 'brand' } : { s: 'New', t: 'cold' };
  const score = phase < 4 ? 0 : phase === 4 ? 48 : story.score;
  const done = phase < 4 ? 0 : phase === 4 ? 2 : phase < 7 ? 4 : 5;
  const updated = phase >= 8;
  return { live, onCall, call, lead, score, done, updated };
}

export function CommandCenter({ phase }: { phase: number }) {
  const { live, onCall, call, lead, score, done, updated } = heroState(phase);
  const rows: LeadRow[] = heroLeads.map((l, i) => i === 0 ? { ...l, status: lead.s, tone: lead.t, flash: true, isNew: phase === 0 } : { ...l });
  const profile = [
    { k: 'Config.', v: story.requirement.configuration, filled: phase >= 4 },
    { k: 'Budget', v: story.requirement.budgetShort, filled: phase >= 4 },
    { k: 'Purpose', v: story.requirement.purpose, filled: phase >= 5 },
    { k: 'Timeline', v: story.requirement.timeline, filled: phase >= 5 },
  ];
  return (
    <div className="relative flex min-h-[560px]">
      <DashboardSidebar footer={
        <div className={`rounded-xl border p-2.5 transition-colors duration-500 ${onCall ? 'border-[var(--p-accent-line)] bg-[var(--p-accent-soft)]' : 'border-[var(--p-line)] bg-[var(--p-bg)]'}`}>
          <div className="flex items-center gap-2"><AgentOrb size={26} live={onCall} /><div className="min-w-0"><p className="text-[11.5px] font-semibold text-[var(--p-text)]">{story.agent.name}</p><p className="truncate text-[10px] text-[var(--p-body)]">AI voice agent</p></div></div>
          <p className="mt-2 flex items-center gap-1.5 text-[10.5px] font-medium text-[#166534]"><span className="p-live h-1.5 w-1.5 rounded-full bg-[var(--p-success)]" />{onCall ? `On a call · ${story.buyer.short}` : 'Ready for calls'}</p>
        </div>
      } />

      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <DashboardHeader title="Overview" notify={phase >= 7}
          subtitle={<><StatusBadge tone="ok">Live</StatusBadge>{story.project.campaign} · {updated ? 'synced just now' : 'synced 2 min ago'}</>}>
          <SelectPill>{story.project.name}</SelectPill>
          <SelectPill icon={CalendarDays}>Last 7 days</SelectPill>
        </DashboardHeader>

        {/* Metrics */}
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {heroMetrics.map((m, i) => {
            const bump = updated && i !== 1; const v = m.value + (bump ? 1 : 0);
            return <MetricCard key={m.label} label={m.label} icon={metricMeta[i].icon} tone={metricMeta[i].tone} delta={metricMeta[i].delta} flash={bump}
              value={<span key={v} style={bump ? { animation: 'pop .45s var(--ease-out) both', display: 'inline-block' } : undefined}>{v.toLocaleString('en-IN')}{m.suffix}{bump && <span className="ml-1.5 align-middle text-[10.5px] font-semibold text-[#15803d]">+1</span>}</span>} />;
          })}
        </div>

        <div className="mt-2 grid gap-2 lg:grid-cols-12">
          {/* Performance chart */}
          <Panel className="hidden sm:block lg:col-span-5" title="Qualified leads" right={<span className="flex items-center gap-3 text-[10.5px] text-[var(--p-muted)]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--p-accent)]" />12 weeks</span><b key={String(updated)} className="font-semibold text-[#15803d]" style={updated ? { animation: 'pop .4s var(--ease-out) both' } : undefined}>{updated ? '847 · +1 now' : '846 total'}</b></span>}>
            <CampaignChart ariaLabel="Demo trend of qualified leads over 12 weeks" labels={heroTrend.map((_, i) => `W${i + 1}`)} height={200} fixedHeight={196} labelEvery={2}
              series={[{ key: 'q', label: 'Qualified', values: updated ? [...heroTrend.slice(0, -1), heroTrend[heroTrend.length - 1] + 6] : heroTrend }]} />
          </Panel>

          {/* Lead management */}
          <Panel className="lg:col-span-7" title="Lead management" right={<span className="text-[10.5px] text-[var(--p-muted)]">5 of 128 leads</span>}>
            <LeadTable rows={rows} />
          </Panel>

        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.95fr_1.05fr]">
          {/* AI call activity */}
          <Panel title="AI call activity" right={<span key={call.s} style={{ animation: 'pop .3s var(--ease-out) both' }}><StatusBadge tone={call.t}>{call.s}</StatusBadge></span>}>
            <CallCard agent={story.agent.name} buyer={story.buyer.name} meta={`${story.buyer.phone} · ${story.buyer.source}`} live={live}>
              <div className="mt-2 h-[52px] space-y-1 text-[11px] leading-snug">
                {phase < 3 && <p className="text-[var(--p-muted)]">{phase === 0 ? 'New enquiry queued for an instant call.' : 'Calling within permitted hours…'}</p>}
                {phase >= 3 && <p style={{ animation: 'rise .4s var(--ease-out) both' }}><b className="font-semibold text-[#5b34d6]">Aria:</b> Which configuration and budget suit you?</p>}
                {phase >= 4 && <p style={{ animation: 'rise .4s var(--ease-out) both' }}><b className="font-semibold text-[var(--p-text)]">Rohan:</b> A {story.requirement.configuration}, around {story.requirement.budgetShort}.</p>}
              </div>
            </CallCard>
          </Panel>

          {/* Qualification status */}
          <Panel className="hidden sm:block" title="Qualification" right={<span key={score} style={{ animation: 'pop .3s var(--ease-out) both' }}><StatusBadge tone={score >= 75 ? 'hot' : score > 0 ? 'warm' : 'neutral'} dot={false}>{score >= 75 ? 'Hot lead' : score > 0 ? 'In progress' : 'Pending'}</StatusBadge></span>}>
            <ScoreBar value={score} />
            <BuyerProfile className="mt-2.5" fields={profile} />
            <QualificationChecklist className="mt-2.5 hidden" items={['Budget', 'Configuration', 'Purpose', 'Timeline', 'Site visit']} done={done} />
          </Panel>

          {/* Site visit calendar */}
          <Panel className="hidden sm:block" title="Site visits" right={<span className="text-[10.5px] text-[var(--p-muted)]">Nov</span>}>
            <AppointmentCalendar className="mx-auto max-w-[220px]" highlight={phase >= 7 ? story.visit.day : -1} booked={[3, 8, 10, 17, 19]} />
            <p key={String(phase >= 7)} className={`mt-1.5 truncate text-[10.5px] ${phase >= 7 ? 'font-semibold text-[#5b34d6]' : 'text-[var(--p-muted)]'}`} style={phase >= 7 ? { animation: 'rise .4s var(--ease-out) both' } : undefined}>{phase >= 7 ? story.visit.short : '5 booked'}</p>
          </Panel>

          {/* Recent activity */}
          <Panel className="hidden sm:block" title="Recent activity">
            <ActivityTimeline items={[
              { text: `${story.buyer.source} enquiry`, time: '10:02', color: productColors.blue, shown: true },
              { text: `Aria called ${story.buyer.short}`, time: '10:02', color: productColors.accent, shown: phase >= 2 },
              { text: `Qualified · score ${story.score}`, time: '10:04', color: productColors.success, shown: phase >= 5 },
              { text: `Visit · ${story.visit.short}`, time: '10:04', color: productColors.warning, shown: phase >= 7 },
              { text: `Assigned to ${story.executive.name.split(' ')[0]}`, time: '10:05', color: productColors.success, shown: phase >= 8 },
            ]} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
