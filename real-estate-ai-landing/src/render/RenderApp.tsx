import { MotionConfig } from 'motion/react';
import { useEffect, useState } from 'react';
import { CalendarCheck2, Check, CheckCheck, CheckCircle2, FileText, Globe, Phone, Sparkles, UserPlus } from 'lucide-react';
import { brand } from '../config/brand';
import { LogoMark } from '../components/ui/Logo';
import { AgentOrb, AppWindow, Avatar, MiniCalendar, Panel, Status } from '../components/dashboards/primitives';
import { CommandCenter } from '../components/dashboards/CommandCenter';
import { LineChart } from '../components/charts/LineChart';
import { callVolume, campaigns } from '../data/demo-data';
import { HERO_LEN, SCENE_LEN, walkthroughScenes } from './scenes';

/**
 * Deterministic render surface for video capture. Visit /?render=walkthrough or /?render=hero.
 * The capture script calls window.__setTime(seconds) for every frame, so output does not depend on real time.
 */
declare global { interface Window { __setTime?: (t: number) => void; __renderReady?: boolean; __duration?: number } }

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const seg = (p: number, a: number, b: number) => ease((p - a) / (b - a));

function TWave({ t, bars = 48, height = 44, active = true, color = '#a78bfa' }: { t: number; bars?: number; height?: number; active?: boolean; color?: string }) {
  return (
    <div className="flex items-center gap-[4px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = active ? 0.2 + 0.8 * Math.abs(Math.sin(t * 7 + i * 0.6) * Math.cos(t * 3.1 + i * 0.27)) : 0.12;
        return <span key={i} style={{ width: 4, height: `${h * 100}%`, borderRadius: 3, background: color, opacity: active ? 0.95 : 0.35 }} />;
      })}
    </div>
  );
}

function Shell({ children, t, total, sceneIndex }: { children: React.ReactNode; t: number; total: number; sceneIndex?: number }) {
  return (
    <div className="theme-dark relative h-[1080px] w-[1920px] overflow-hidden" style={{ fontFamily: 'Inter Variable, Inter, sans-serif' }}>
      <div className="grid-bg absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_75%)]" />
      <div className="absolute left-1/2 top-[-380px] h-[900px] w-[1500px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.42),rgba(109,40,217,0.14)_55%,transparent)]" style={{ transform: `translateX(-50%) scale(${1 + 0.04 * Math.sin(t * 0.6)})` }} />
      <div className="absolute left-[96px] top-[64px] flex items-center gap-3"><LogoMark size={40} /><span className="text-[26px] font-semibold tracking-[-0.03em] text-white">{brand.productName}</span></div>
      {sceneIndex !== undefined && (
        <div className="absolute right-[96px] top-[74px] flex gap-2">
          {walkthroughScenes.map((_, i) => <span key={i} className="h-[6px] rounded-full" style={{ width: i === sceneIndex ? 48 : 18, background: i <= sceneIndex ? '#a78bfa' : 'rgba(255,255,255,.15)' }} />)}
        </div>
      )}
      {children}
      <div className="absolute bottom-0 left-0 h-[4px] bg-[var(--brand-primary)]" style={{ width: `${(t / total) * 100}%` }} />
      <span className="demo-tag absolute bottom-[28px] right-[96px] !text-[13px]">Demo · sample data</span>
    </div>
  );
}

/* ---------- Walkthrough scene visuals (p = 0..1 progress within the scene) ---------- */
function S1({ p }: { p: number }) {
  const fields = [['Full name', 'Rohan Mehta'], ['Phone', '+91 98••• ••210'], ['Looking for', '3 BHK apartment'], ['Budget', '₹2 Crore']];
  return (
    <div className="flex items-center gap-10">
      <div className="w-[460px] rounded-[28px] border border-white/10 bg-white p-7 text-[#0f0f14] shadow-2xl">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-[#3b82f6]"><Globe size={18} />Meta Ads · Lead form</p>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.02em]">Skyline Residences</p>
        <div className="mt-5 space-y-3">
          {fields.map(([k, v], i) => (
            <div key={k} className="rounded-xl border border-[#e7e7ec] px-4 py-2.5"><p className="text-[12px] text-[#6b6b75]">{k}</p><p className="text-[17px] font-medium">{v.slice(0, Math.round(v.length * seg(p, 0.05 + i * 0.12, 0.2 + i * 0.12)))}</p></div>
          ))}
        </div>
        <div className="mt-5 rounded-xl py-3 text-center text-[16px] font-semibold text-white" style={{ background: p > 0.68 ? '#22c55e' : '#3b82f6' }}>{p > 0.68 ? 'Submitted ✓' : 'Submit'}</div>
      </div>
      <div className="w-[380px] rounded-[24px] border border-white/10 bg-[rgba(18,18,25,.95)] p-6" style={{ opacity: seg(p, 0.7, 0.85), transform: `translateX(${(1 - seg(p, 0.7, 0.85)) * 40}px)` }}>
        <p className="flex items-center gap-2 text-[18px] font-semibold text-white"><span className="h-3 w-3 rounded-full bg-sky-400" />New lead received</p>
        <p className="mt-3 text-[16px] text-white/70">Rohan Mehta · Meta Ads</p><p className="text-[16px] text-white/50">3 BHK · ₹2 Crore</p>
      </div>
    </div>
  );
}
function S2({ p, t }: { p: number; t: number }) {
  return (
    <div className="w-[1000px] origin-top-left" style={{ transform: 'scale(1.0)' }}>
      <AppWindow path="campaigns/skyline-launch"><CommandCenter phase={p < 0.35 ? 1 : 2} /></AppWindow>
      <div className="absolute -right-6 top-24 w-[300px] rounded-2xl border border-white/10 bg-[rgba(16,16,22,.92)] p-5 shadow-2xl">
        <p className="flex items-center gap-2 text-[16px] font-semibold text-white"><Phone size={16} className="text-emerald-400" />{p < 0.35 ? 'Dialling Rohan…' : 'Call connected'}</p>
        <div className="mt-3"><TWave t={t} bars={30} height={36} active={p >= 0.35} /></div>
      </div>
    </div>
  );
}
function S3({ p, t }: { p: number; t: number }) {
  const lines: [string, string][] = [['ai', 'Which configuration and location are you looking for?'], ['b', 'A 3 BHK near the north corridor.'], ['ai', 'What budget range are you considering?'], ['b', 'Around ₹2 crore, buying in about six months.']];
  return (
    <div className="w-[900px] rounded-[28px] border border-white/10 bg-[#101016] p-8 shadow-2xl">
      <div className="flex items-center gap-4"><AgentOrb size={56} /><div className="flex-1"><p className="text-[22px] font-semibold text-white">Aria · AI sales agent</p><p className="text-[16px] text-white/50">Live call · 00:{String(14 + Math.floor(p * 30)).padStart(2, '0')}</p></div><Status tone="ok">Connected</Status></div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"><TWave t={t} bars={80} height={56} /></div>
      <div className="mt-6 space-y-3">
        {lines.map(([s, l], i) => {
          const o = seg(p, i * 0.2, i * 0.2 + 0.12);
          return <div key={i} className={`flex ${s === 'ai' ? '' : 'justify-end'}`} style={{ opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}><p className={`max-w-[75%] rounded-2xl px-5 py-3 text-[20px] ${s === 'ai' ? 'bg-brand/25 text-white' : 'bg-white/10 text-white/90'}`}>{l}</p></div>;
        })}
      </div>
    </div>
  );
}
function S4({ p }: { p: number }) {
  const f = [['Configuration', '3 BHK'], ['Budget', '₹2 Crore'], ['Location', 'North corridor'], ['Purpose', 'Self-use'], ['Timeline', '6 months'], ['Site visit', 'Interested']];
  const n = Math.round(seg(p, 0.05, 0.75) * f.length);
  const score = Math.round(30 + (n / f.length) * 56);
  return (
    <div className="flex w-[1000px] gap-6">
      <div className="flex-1 rounded-[28px] border border-white/10 bg-[#101016] p-7">
        <div className="flex items-center gap-4"><Avatar name="Rohan Mehta" size={56} /><div className="flex-1"><p className="text-[22px] font-semibold text-white">Rohan Mehta</p><p className="text-[16px] text-white/50">CRM record · auto-filled</p></div><Status tone={n === 6 ? 'ok' : 'warm'}>{n === 6 ? 'Qualified' : 'In progress'}</Status></div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {f.map(([k, v], i) => <div key={k} className="rounded-2xl border p-4" style={{ borderColor: i < n ? 'rgba(139,92,246,.5)' : 'rgba(255,255,255,.08)', background: i < n ? 'rgba(139,92,246,.1)' : 'transparent' }}><p className="flex items-center justify-between text-[14px] text-white/50">{k}{i < n && <Check size={16} className="text-emerald-400" />}</p><p className="mt-1 text-[20px] font-semibold text-white" style={{ opacity: i < n ? 1 : 0 }}>{v}</p></div>)}
        </div>
      </div>
      <div className="flex w-[280px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#101016] p-6">
        <svg viewBox="0 0 80 80" className="h-[180px] w-[180px] -rotate-90"><circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" /><circle cx="40" cy="40" r="34" fill="none" stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * 213.6} 213.6`} /></svg>
        <p className="-mt-[118px] text-[44px] font-semibold tabular-nums text-white">{score}</p>
        <p className="mt-[64px] text-[16px] text-white/50">Lead score</p>
        <span className={`badge mt-3 !text-[14px] ${score >= 75 ? 'badge-hot' : 'badge-warm'}`}>{score >= 75 ? 'Hot lead' : 'Warm'}</span>
      </div>
    </div>
  );
}
function S5({ p }: { p: number }) {
  const msgs = [{ me: true, t: 'Hi Rohan, sharing the Skyline Residences brochure as discussed.' }, { me: true, doc: true, t: 'Skyline-Residences.pdf · 2.4 MB' }, { me: false, t: 'Thank you! This looks great.' }];
  return (
    <div className="w-[520px] overflow-hidden rounded-[36px] border-[10px] border-[#1d1d24] bg-[#efeae2] shadow-2xl">
      <div className="flex items-center gap-3 bg-[#0b5c4f] px-5 py-4 text-white"><Avatar name="Rohan M" size={40} hue={190} /><div><p className="text-[18px] font-medium">Rohan Mehta</p><p className="text-[13px] text-white/70">online</p></div></div>
      <div className="min-h-[420px] space-y-3 p-5">
        {msgs.map((m, i) => { const o = seg(p, 0.1 + i * 0.22, 0.25 + i * 0.22); return (
          <div key={i} className={`flex ${m.me ? 'justify-end' : ''}`} style={{ opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
            <p className={`max-w-[85%] rounded-xl px-4 py-2.5 text-[18px] leading-snug text-[#111b21] shadow-sm ${m.me ? 'bg-[#d9fdd3]' : 'bg-white'}`}>{m.doc ? <span className="flex items-center gap-2"><FileText size={22} className="text-red-500" />{m.t}</span> : m.t}{m.me && <CheckCheck size={16} className="ml-1 inline text-sky-500" />}</p>
          </div>); })}
      </div>
    </div>
  );
}
function S6({ p }: { p: number }) {
  const slots = ['10:00 AM', '11:00 AM', '2:30 PM', '4:00 PM'];
  return (
    <div className="flex w-[960px] gap-6">
      <div className="theme-light w-[520px] rounded-[28px] p-7 shadow-2xl">
        <p className="mb-4 flex items-center gap-2 text-[20px] font-semibold text-[#0f0f14]"><CalendarCheck2 size={22} className="text-[var(--brand-deep)]" />Choose a visit date</p>
        <div className="origin-top-left scale-[1.0] [&_*]:!text-[16px]"><MiniCalendar highlight={p > 0.25 ? 15 : -1} booked={[6, 8, 13, 20]} /></div>
        <div className="mt-5 grid grid-cols-2 gap-3">{slots.map((s) => <span key={s} className="rounded-xl border py-3 text-center text-[17px]" style={{ background: p > 0.5 && s === '11:00 AM' ? '#8b5cf6' : 'white', color: p > 0.5 && s === '11:00 AM' ? 'white' : '#52525b', borderColor: '#e7e7ec' }}>{s}</span>)}</div>
      </div>
      <div className="flex-1 self-center rounded-[24px] border border-emerald-400/40 bg-emerald-500/10 p-6" style={{ opacity: seg(p, 0.65, 0.8) }}>
        <p className="flex items-center gap-2 text-[20px] font-semibold text-white"><CheckCircle2 className="text-emerald-400" />Site visit confirmed</p>
        <p className="mt-2 text-[18px] text-white/75">Sat, 15 Nov · 11:00 AM</p><p className="text-[16px] text-white/50">Skyline Residences sales gallery</p>
      </div>
    </div>
  );
}
function S7({ p }: { p: number }) {
  const team = [['Kavya Rao', 'Senior sales executive', 150], ['Arjun Shah', 'Sales executive', 30], ['Meera Iyer', 'Sales executive', 320]] as const;
  return (
    <div className="flex w-[960px] items-center gap-8">
      <div className="w-[420px] rounded-[28px] border border-white/10 bg-[#101016] p-7">
        <div className="flex items-center gap-4"><Avatar name="Rohan Mehta" size={52} /><div><p className="text-[21px] font-semibold text-white">Rohan Mehta</p><p className="text-[15px] text-white/50">Qualified · Score 86 · Visit Sat 11 AM</p></div></div>
        <div className="mt-5 flex flex-wrap gap-2">{['3 BHK', '₹2 Cr', 'Self-use', '6 months'].map((x) => <span key={x} className="rounded-lg bg-brand/20 px-3 py-1 text-[15px] text-white">{x}</span>)}</div>
      </div>
      <svg width="90" height="20"><path d="M0 10 H90" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6 8" strokeDashoffset={-p * 200} /></svg>
      <div className="flex-1 space-y-3">
        {team.map(([n, r, h], i) => { const on = i === 0 && p > 0.45; return (
          <div key={n} className="flex items-center gap-4 rounded-2xl border p-4" style={{ borderColor: on ? '#22c55e' : 'rgba(255,255,255,.1)', background: on ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.02)' }}>
            <Avatar name={n} size={44} hue={h} /><div className="flex-1"><p className="text-[19px] font-medium text-white">{n}</p><p className="text-[14px] text-white/50">{r}</p></div>
            {on && <span className="flex items-center gap-1.5 text-[16px] text-emerald-300"><UserPlus size={18} />Assigned</span>}
          </div>); })}
      </div>
    </div>
  );
}
function S8({ p }: { p: number }) {
  return (
    <div className="w-[1040px]">
      <AppWindow path="analytics">
        <div className="grid grid-cols-[1.3fr_1fr] gap-3 p-5">
          <Panel title="Call volume · this week"><LineChart animate={false} ariaLabel="Demo call volume" labels={callVolume.map((d) => d.day)} series={[{ key: 'c', label: 'Calls', color: '#a78bfa', values: callVolume.map((d) => Math.round(d.calls * (0.4 + 0.6 * seg(p, 0, 0.6)))) }]} height={240} /></Panel>
          <div className="grid grid-cols-2 gap-3">
            {[['Qualified Leads', 846 + (p > 0.5 ? 1 : 0)], ['Site Visits', 124 + (p > 0.5 ? 1 : 0)], ['Total Calls', 2481], ['Connect Rate', '68%']].map(([k, v]) => <div key={k as string} className="ui-surface p-4"><p className="text-[14px] text-[var(--c-muted)]">{k}</p><p className="mt-1 text-[30px] font-semibold tabular-nums text-white">{typeof v === 'number' ? v.toLocaleString('en-IN') : v}</p></div>)}
          </div>
          <Panel className="col-span-2" title="Campaign performance">
            <table className="w-full text-[16px]"><tbody>{campaigns.map((c) => <tr key={c.name} className="border-t border-[var(--c-line)]"><td className="py-2.5 text-white">{c.name}</td><td className="text-right tabular-nums text-white/70">{c.leads} leads</td><td className="text-right tabular-nums text-white/70">{c.qualified} qualified</td><td className="text-right tabular-nums text-white">{c.visits} visits</td></tr>)}</tbody></table>
          </Panel>
        </div>
      </AppWindow>
    </div>
  );
}
const sceneComps = [S1, S2, S3, S4, S5, S6, S7, S8];

function Walkthrough({ t }: { t: number }) {
  const i = Math.min(walkthroughScenes.length - 1, Math.floor(t / SCENE_LEN));
  const p = (t - i * SCENE_LEN) / SCENE_LEN;
  const fadeIn = seg(p, 0, 0.1), fadeOut = 1 - seg(p, 0.92, 1);
  const o = i === walkthroughScenes.length - 1 ? fadeIn : Math.min(fadeIn, fadeOut);
  const s = walkthroughScenes[i]; const C = sceneComps[i];
  return (
    <Shell t={t} total={walkthroughScenes.length * SCENE_LEN} sceneIndex={i}>
      <div className="absolute left-[96px] top-[300px] w-[560px]" style={{ opacity: o, transform: `translateY(${(1 - fadeIn) * 16}px)` }}>
        <p className="text-[20px] font-medium tabular-nums text-[var(--brand-accent)]">{String(i + 1).padStart(2, '0')} / 08</p>
        <h1 className="mt-3 text-[68px] font-semibold leading-[1.02] tracking-[-0.045em] text-white">{s.title}</h1>
        <p className="mt-6 text-[26px] leading-[1.45] text-white/65">{s.caption}</p>
      </div>
      <div className="absolute left-[760px] right-[80px] top-[170px] bottom-[150px] flex items-center justify-center" style={{ opacity: o, transform: `scale(${0.97 + 0.03 * fadeIn})` }}>
        <div className="relative"><C p={p} t={t} /></div>
      </div>
      <div className="absolute bottom-[70px] left-1/2 -translate-x-1/2 rounded-xl bg-black/70 px-6 py-3 text-[24px] text-white" style={{ opacity: o }}>{s.caption}</div>
    </Shell>
  );
}

function HeroAnim({ t }: { t: number }) {
  const phase = Math.min(6, Math.floor(t / 2));
  const fl = (k: number) => `translateY(${Math.sin(t * 1.1 + k) * 8}px)`;
  return (
    <Shell t={t} total={HERO_LEN}>
      <div className="absolute left-1/2 top-[150px] w-[1240px] -translate-x-1/2 rounded-[26px] border border-white/10 bg-white/[0.03] p-2.5">
        <AppWindow path="campaigns/skyline-launch"><CommandCenter phase={phase} /></AppWindow>
      </div>
      <Float x={110} y={330} show={phase >= 0} title="Incoming Lead" c="#38bdf8" tr={fl(0)}><R k="Source" v="Meta Ads" /><R k="Configuration" v="3 BHK" /><R k="Budget" v="₹2 Crore" /></Float>
      <Float x={1560} y={260} show={phase >= 1} title="AI Call in Progress" c="#a78bfa" tr={fl(2)}><p className="text-[15px] text-white/70">{phase >= 2 && phase <= 4 ? 'Conversation active' : phase >= 5 ? 'Call ended' : 'Connecting…'}</p><div className="mt-2"><TWave t={t} bars={28} height={34} active={phase >= 2 && phase <= 4} /></div></Float>
      <Float x={1580} y={720} show={phase >= 4} title="Lead Qualified" c="#22c55e" tr={fl(4)}>{['Budget captured', 'Configuration captured', 'Site visit requested'].map((x, i) => <p key={x} className="flex items-center gap-2 text-[15px]" style={{ color: phase >= 4 + (i === 2 ? 1 : 0) ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.25)' }}><CheckCircle2 size={15} className="text-emerald-400" />{x}</p>)}</Float>
      <div className="absolute bottom-[60px] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/50 px-6 py-3 text-[20px] text-white/85"><Sparkles size={20} className="text-[var(--brand-accent)]" />{['New Meta Ads lead arrives', 'AI agent initiates the call', 'Voice conversation in progress', 'Buyer requirements captured', 'Lead qualified', 'Site visit requested', 'CRM dashboard updated'][phase]}</div>
    </Shell>
  );
}
function Float({ x, y, show, title, c, children, tr }: { x: number; y: number; show: boolean; title: string; c: string; children: React.ReactNode; tr: string }) {
  return (
    <div className="absolute w-[270px] rounded-2xl border border-white/10 bg-[rgba(16,16,22,.9)] p-5 shadow-2xl backdrop-blur" style={{ left: x, top: y, opacity: show ? 1 : 0, transform: tr }}>
      <p className="mb-3 flex items-center gap-2 text-[17px] font-semibold text-white"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c, boxShadow: `0 0 10px ${c}` }} />{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
function R({ k, v }: { k: string; v: string }) { return <p className="flex justify-between text-[15px]"><span className="text-white/50">{k}</span><span className="font-medium text-white/90">{v}</span></p>; }

export default function RenderApp({ mode }: { mode: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    window.__setTime = (v) => setT(v);
    window.__duration = mode === 'hero' ? HERO_LEN : walkthroughScenes.length * SCENE_LEN;
    window.__renderReady = true;
    document.documentElement.classList.add('reduce-motion');
    document.body.style.margin = '0';
  }, [mode]);
  return (
    <MotionConfig transition={{ duration: 0 }} reducedMotion="always">
      {mode === 'hero' ? <HeroAnim t={t} /> : <Walkthrough t={t} />}
    </MotionConfig>
  );
}
