import { useState } from 'react';
import { CalendarDays, ChevronDown, Download } from 'lucide-react';
import { performanceCopy } from '../data/content';
import { callVolume, campaigns, outcomeDistribution, performanceMetrics, qualificationBars } from '../data/demo-data';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { AppWindow, Panel, Status } from '../components/dashboards/primitives';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { DemoTag } from '../components/ui/DemoTag';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { useLoop } from '../hooks/useLoop';
import { story } from '../data/story';

function fmt(v: number, f: string) {
  if (f === 'sec') return `${Math.round(v)}s`;
  if (f === 'inr') return `₹${Math.round(v).toLocaleString('en-IN')}`;
  return Math.round(v).toLocaleString('en-IN');
}

export function Performance() {
  const { ref, inView, seen } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const scale = range === '7d' ? 1 : 4.1;
  const feed = [
    `${story.buyer.short} qualified · score ${story.score} · ${story.project.name}`,
    'Ananya S. connected · Premium Apartments',
    `Site visit booked · ${story.visit.short}`,
    'Vikram K. callback set · Residential Plots',
    'Priya D. assigned to sales · Luxury Residences',
  ];
  const [fi] = useLoop(feed.length, 2600, inView, 0);
  return (
    <Section id="performance" theme="dark" sheet horizon label="Performance and results" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.18),transparent)]" />
      <div className="container-x section-y relative">
        <SectionHeader eyebrow={performanceCopy.eyebrow} title={performanceCopy.title} description={performanceCopy.description} />
        <Reveal className="mt-14">
          <div ref={ref}>
            <AppWindow path="analytics">
              <div className="p-3 sm:p-5" data-testid="performance-dashboard">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--c-head)]">Sales performance</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[12px] text-[var(--c-muted)]" aria-live="off" data-testid="perf-live"><span className="live-dot h-1.5 w-1.5 flex-none rounded-full bg-[#12b881]" /><span key={fi} className="truncate" style={{ animation: 'rise .35s var(--ease-out) both' }}>Live · {feed[fi]}</span></p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div role="group" aria-label="Date range" className="flex rounded-lg border border-[var(--c-line)] bg-[var(--c-card-2)] p-0.5 text-[12px]">
                      {(['7d', '30d'] as const).map((r) => (
                        <button key={r} onClick={() => setRange(r)} aria-pressed={range === r} className={`flex min-h-[32px] items-center gap-1.5 rounded-md px-3 transition ${range === r ? 'bg-white/10 text-white' : 'text-[var(--c-muted)] hover:text-white'}`} data-testid={`range-${r}`}>
                          {r === '7d' && <CalendarDays size={12} />}{r === '7d' ? 'Last 7 days' : 'Last 30 days'}
                        </button>
                      ))}
                    </div>
                    <span className="hidden items-center gap-1.5 rounded-lg border border-[var(--c-line)] px-3 py-1.5 text-[12px] text-[var(--c-text)] sm:flex">All projects <ChevronDown size={12} /></span>
                    <span className="hidden items-center gap-1.5 rounded-lg border border-[var(--c-line)] px-3 py-1.5 text-[12px] text-[var(--c-text)] sm:flex"><Download size={12} /> Export</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
                  {performanceMetrics.map((m) => <MetricCount key={m.label + range} label={m.label} target={m.format === 'int' ? m.value * scale : m.value} format={m.format} delta={m.delta} run={seen} />)}
                </div>

                <div className="mt-2.5 grid gap-2.5 lg:grid-cols-12">
                  <Panel className="lg:col-span-7" title="Call volume" right={<span className="flex items-center gap-3 text-[11px] text-[var(--c-muted)]"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#a48bff]" />Calls</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#4f7dff]" />Connected</span></span>}>
                    <LineChart key={range} animate={seen} ariaLabel="Demo call volume chart, calls and connected calls per day" labels={callVolume.map((d) => d.day)}
                      series={[{ key: 'c', label: 'Calls', color: '#a48bff', values: callVolume.map((d) => Math.round(d.calls * scale)) }, { key: 'k', label: 'Connected', color: '#4f7dff', values: callVolume.map((d) => Math.round(d.connected * scale)) }]} height={300} />
                  </Panel>
                  <Panel className="lg:col-span-5" title="Lead qualification · fields captured" right={<DemoTag />}>
                    <BarChart ariaLabel="Demo share of calls where each qualification field was captured" data={qualificationBars} run={seen} />
                    <div className="my-3 h-px bg-[var(--c-line)]" />
                    <p className="mb-2 text-[12px] font-medium text-[var(--c-head)]">Lead outcome distribution</p>
                    <DonutChart ariaLabel="Demo distribution of lead outcomes" data={outcomeDistribution} run={seen} />
                  </Panel>
                </div>

                <Panel className="mt-2.5" pad={false} title="Top campaigns this week" right={<DemoTag />}>
                  <div className="thin-scroll overflow-x-auto" tabIndex={0} aria-label="Campaign performance table, scroll horizontally on small screens">
                    <table className="w-full min-w-[640px] text-[13px]" data-testid="campaign-table">
                      <caption className="sr-only">Campaign performance (demonstration data)</caption>
                      <thead>
                        <tr className="border-y border-[var(--c-line)] text-left text-[11.5px] uppercase tracking-[0.06em] text-[var(--c-muted)]">
                          <th scope="col" className="px-4 py-2.5 font-medium">Campaign</th>
                          <th scope="col" className="px-4 py-2.5 text-right font-medium">Leads</th>
                          <th scope="col" className="px-4 py-2.5 text-right font-medium">Connected</th>
                          <th scope="col" className="px-4 py-2.5 text-right font-medium">Qualified</th>
                          <th scope="col" className="px-4 py-2.5 text-right font-medium">Site Visits</th>
                          <th scope="col" className="px-4 py-2.5 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((c, ri) => (
                          <tr key={c.name} className="border-b border-[var(--c-line)] transition-[background-color,opacity,transform] duration-500 last:border-0 hover:bg-white/[0.035]" style={seen ? { animation: `rise .45s ${300 + ri * 80}ms var(--ease-out) both` } : undefined}>
                            <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--c-head)]">
                              <span className="flex items-center gap-2.5"><span className="h-7 w-1 rounded-full bg-gradient-to-b from-[#c4b5fd] to-[#6d28d9]" />{c.name}</span>
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums text-[var(--c-text)]">{c.leads}</td>
                            <td className="px-4 py-3 text-right tabular-nums text-[var(--c-text)]">{c.connected} <span className="text-[11px] text-[var(--c-muted)]">({Math.round((c.connected / c.leads) * 100)}%)</span></td>
                            <td className="px-4 py-3 text-right tabular-nums text-[var(--c-head)]">{c.qualified}</td>
                            <td className="px-4 py-3 text-right tabular-nums text-[var(--c-head)]">{c.visits}</td>
                            <td className="px-4 py-3 text-right"><Status tone={c.status === 'Active' ? 'ok' : 'cold'}>{c.status}</Status></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </div>
            </AppWindow>
          </div>
        </Reveal>
        <p className="mt-4 text-center text-[12.5px] text-[var(--c-muted)]">All figures are sample demonstration data, not product results. Outcome shares are of all 2,480 calls; the 68% connect rate equals qualified + callback + not interested.</p>
      </div>
    </Section>
  );
}

function MetricCount({ label, target, format, delta, run }: { label: string; target: number; format: string; delta: string; run: boolean }) {
  const v = useCountUp(target, run);
  return (
    <div className="ui-surface p-3.5 transition hover:border-[var(--c-line-strong)]">
      <p className="truncate text-[11.5px] text-[var(--c-muted)]">{label}</p>
      <p className="mt-1 text-[22px] font-semibold tabular-nums tracking-[-0.03em] text-[var(--c-head)]">{fmt(v, format)}</p>
      <p className="mt-0.5 text-[11px] font-medium text-[#7de3bd]">{delta} <span className="font-normal text-[var(--c-muted)]">vs prev.</span></p>
    </div>
  );
}
