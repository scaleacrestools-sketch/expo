import { MotionConfig } from 'motion/react';
import { useEffect, useState } from 'react';
import { CalendarCheck2, Check, CheckCheck, CheckCircle2, FileText, Globe, Sparkles, UserPlus } from 'lucide-react';
import { brand } from '../config/brand';
import { LogoMark } from '../components/ui/Logo';
import { AgentOrb, AppWindow, Avatar, MiniCalendar, Panel } from '../components/dashboards/primitives';
import { CommandCenter } from '../components/dashboards/CommandCenter';
import { LineChart } from '../components/charts/LineChart';
import { callVolume, campaigns } from '../data/demo-data';
import { HERO_LEN, HERO_STEP, walkthrough } from './scenes';
import { story } from '../data/story';
import { HERO_STEPS } from '../components/dashboards/CommandCenter';
import { ArrowRight } from 'lucide-react';

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

function Shell({ children, t, total }: { children: React.ReactNode; t: number; total: number }) {
  return (
    <div className="theme-dark relative h-[1080px] w-[1920px] overflow-hidden" style={{ fontFamily: "'Inter V2', Inter, sans-serif" }}>
      <div className="grid-bg absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_75%)]" />
      <div className="absolute left-1/2 top-[-420px] h-[900px] w-[1600px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(128,87,255,0.40),rgba(72,38,179,0.12)_55%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(55%_100%_at_50%_100%,rgba(24,86,255,0.18),transparent_70%)]" />
      <div className="absolute left-[80px] top-[52px] flex items-center gap-3"><LogoMark size={40} /><span className="text-[26px] font-semibold tracking-[-0.03em] text-white">{brand.productName}</span></div>
      {children}
      <div className="absolute bottom-0 left-0 h-[4px] bg-gradient-to-r from-[#6a3ff0] to-[#cbbdff]" style={{ width: `${(t / total) * 100}%` }} />
      <span className="demo-tag absolute right-[80px] top-[62px] !text-[13px]">Demo · sample data</span>
    </div>
  );
}

function Intro({ p }: { p: number }) {
  const steps = ['Enquiry', 'AI call', 'Qualification', 'Follow-up', 'Site visit', 'Handover', 'Analytics'];
  const lit = Math.floor(seg(p, 0.25, 0.9) * steps.length);
  return (
    <div className="flex w-[1300px] flex-col items-center text-center">
      <div style={{ opacity: seg(p, 0, 0.12), transform: `translateY(${(1 - seg(p, 0, 0.15)) * 16}px)` }}>
        <span className="eyebrow !text-[18px]">AI voice agents for real estate</span>
        <h1 className="mt-8 text-[84px] font-medium leading-[1.02] tracking-[-0.05em] text-white">From property enquiry<br />to booked site visit.</h1>
        <p className="mt-6 text-[26px] text-[var(--dark-text)]">One buyer. One connected journey. No manual follow-up.</p>
      </div>
      <div className="mt-14 flex items-center gap-3">
        {steps.map((st, i) => (
          <div key={st} className="flex items-center gap-3">
            <span className="rounded-full border px-5 py-2.5 text-[19px] font-medium transition-none" style={{ borderColor: i < lit ? 'rgba(164,139,255,.7)' : 'rgba(255,255,255,.12)', background: i < lit ? 'rgba(128,87,255,.22)' : 'rgba(255,255,255,.03)', color: i < lit ? '#fff' : 'rgba(255,255,255,.45)', boxShadow: i === lit - 1 ? '0 0 30px -4px rgba(128,87,255,.9)' : 'none' }}>{st}</span>
            {i < steps.length - 1 && <ArrowRight size={18} className="text-white/30" />}
          </div>
        ))}
      </div>
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
            <div key={k} className="rounded-xl border border-[#e7e7ec] px-4 py-2.5"><p className="text-[12px] text-[#6b6b75]">{k}</p><p className="text-[17px] font-medium">{i === 0 ? v : v.slice(0, Math.round(v.length * seg(p, i * 0.12 - 0.04, 0.1 + i * 0.12)))}</p></div>
          ))}
        </div>
        <div className="mt-5 rounded-xl py-3 text-center text-[16px] font-semibold text-white" style={{ background: p > 0.68 ? '#22c55e' : '#3b82f6' }}>{p > 0.68 ? 'Submitted ✓' : 'Submit'}</div>
      </div>
      <div className="product p-float w-[380px] p-6" style={{ opacity: seg(p, 0.7, 0.85), transform: `translateX(${(1 - seg(p, 0.7, 0.85)) * 40}px)` }}>
        <p className="flex items-center gap-3 text-[19px] font-semibold text-[#171923]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e0f2fe] text-[#0369a1]"><UserPlus size={20} /></span>New lead received</p>
        <p className="mt-4 text-[17px] font-medium text-[#171923]">Rohan Mehta · Meta Ads</p><p className="text-[16px] text-[#667085]">3 BHK · ₹2 Crore · Skyline Residences</p>
        <p className="mt-4 flex items-center gap-2 text-[15px] font-medium text-[#5b34d6]"><span className="h-2 w-2 rounded-full bg-[#6a3ff0]" />Queued for an instant AI call</p>
      </div>
    </div>
  );
}
function S2({ p }: { p: number; t?: number }) {
  return (
    <div className="w-[1120px]">
      <AppWindow path="overview"><CommandCenter phase={p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3} /></AppWindow>
    </div>
  );
}
function S3({ p, t }: { p: number; t: number }) {
  const lines: [string, string][] = [['ai', 'Which configuration and location are you looking for?'], ['b', 'A 3 BHK in Whitefield, close to my office.'], ['ai', 'What budget range are you considering?'], ['b', 'Around ₹2 crore, buying in about six months.']];
  return (
    <div className="product p-shell w-[920px] !bg-white p-8">
      <div className="flex items-center gap-4"><AgentOrb size={56} /><div className="flex-1"><p className="text-[22px] font-semibold text-[#171923]">Aria → Rohan Mehta</p><p className="text-[16px] text-[#667085]">Outbound call · Skyline Residences · 00:{String(14 + Math.floor(p * 30)).padStart(2, '0')}</p></div><span className="badge badge-ok !px-3 !py-1 !text-[15px]"><span className="h-2 w-2 rounded-full bg-current" />Live</span></div>
      <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-[#f7f8fc] px-5 py-4"><TWave t={t} bars={84} height={56} color="#6a3ff0" /></div>
      <p className="mt-5 text-[13px] font-medium uppercase tracking-[0.08em] text-[#667085]">Live transcript</p>
      <div className="mt-3 space-y-3">
        {lines.map(([sp, l], i) => {
          const o = seg(p, 0.04 + i * 0.2, 0.16 + i * 0.2);
          return <div key={i} className={`flex ${sp === 'ai' ? '' : 'justify-end'}`} style={{ opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}><p className={`max-w-[75%] rounded-2xl px-5 py-3 text-[20px] ${sp === 'ai' ? 'rounded-tl-md bg-[#f3efff] text-[#2d1a78]' : 'rounded-tr-md border border-[#e5e7eb] bg-white text-[#171923]'}`}>{l}</p></div>;
        })}
      </div>
    </div>
  );
}
function S4({ p }: { p: number }) {
  const f = [['Configuration', '3 BHK'], ['Budget', '₹2 Crore'], ['Location', 'Whitefield'], ['Purpose', 'Self-use'], ['Timeline', '6 months'], ['Site visit', 'Interested']];
  const n = Math.round(seg(p, 0.05, 0.7) * f.length);
  const score = Math.round(30 + (n / f.length) * 56);
  const col = score >= 75 ? '#16a34a' : '#d97706';
  return (
    <div className="product p-shell flex w-[1020px] gap-5 p-6">
      <div className="ui-surface flex-1 !rounded-[20px] p-6">
        <div className="flex items-center gap-4"><Avatar name="Rohan Mehta" size={56} hue={200} /><div className="flex-1"><p className="text-[22px] font-semibold text-[#171923]">Rohan Mehta</p><p className="text-[16px] text-[#667085]">CRM record · filled from the call</p></div><span className={`badge !px-3 !py-1 !text-[15px] ${n === 6 ? 'badge-ok' : 'badge-warm'}`}><span className="h-2 w-2 rounded-full bg-current" />{n === 6 ? 'Qualified' : 'In progress'}</span></div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {f.map(([k, v], i) => <div key={k} className="rounded-2xl border p-4" style={{ borderColor: i < n ? '#d9cdff' : '#e5e7eb', background: i < n ? '#f8f5ff' : '#fff' }}><p className="flex items-center justify-between text-[13px] font-medium uppercase tracking-[0.06em] text-[#667085]">{k}{i < n && <span className="grid h-5 w-5 place-items-center rounded-full bg-[#16a34a] text-white"><Check size={13} strokeWidth={3} /></span>}</p><p className="mt-1.5 h-[28px] text-[21px] font-semibold text-[#171923]">{i < n ? v : <span className="mt-2.5 block h-2.5 w-24 rounded-full bg-[#eaecf0]" />}</p></div>)}
        </div>
      </div>
      <div className="ui-surface flex w-[270px] flex-col items-center justify-center !rounded-[20px] p-6">
        <div className="relative h-[180px] w-[180px]">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90"><circle cx="40" cy="40" r="34" fill="none" stroke="#eaecf0" strokeWidth="8" /><circle cx="40" cy="40" r="34" fill="none" stroke={col} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * 213.6} 213.6`} /></svg>
          <p className="absolute inset-0 grid place-items-center text-[48px] font-semibold tabular-nums text-[#171923]">{score}</p>
        </div>
        <p className="mt-4 text-[16px] text-[#667085]">Lead score</p>
        <span className={`badge mt-3 !px-3 !py-1 !text-[15px] ${score >= 75 ? 'badge-hot' : 'badge-warm'}`}>{score >= 75 ? 'Hot lead' : 'Warming up'}</span>
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
        {msgs.map((m, i) => { const o = seg(p, 0.03 + i * 0.2, 0.15 + i * 0.2); return (
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
      <div className="product p-shell w-[520px] !bg-white p-7">
        <p className="mb-4 flex items-center gap-2 text-[20px] font-semibold text-[#0f0f14]"><CalendarCheck2 size={22} className="text-[var(--brand-deep)]" />Choose a visit date</p>
        <div className="[&_*]:!text-[16px]"><MiniCalendar highlight={p > 0.25 ? 15 : -1} booked={[6, 8, 13, 20]} /></div>
        <div className="mt-5 grid grid-cols-2 gap-3">{slots.map((s) => <span key={s} className="rounded-xl border py-3 text-center text-[17px]" style={{ background: p > 0.5 && s === '11:00 AM' ? '#6a3ff0' : 'white', color: p > 0.5 && s === '11:00 AM' ? 'white' : '#475467', borderColor: '#e5e7eb' }}>{s}</span>)}</div>
      </div>
      <div className="product p-float flex-1 self-center p-6" style={{ opacity: seg(p, 0.62, 0.78), transform: `translateY(${(1 - seg(p, 0.62, 0.78)) * 16}px)` }}>
        <p className="flex items-center gap-3 text-[20px] font-semibold text-[#171923]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dcfce7] text-[#16a34a]"><CheckCircle2 size={22} /></span>Site visit confirmed</p>
        <p className="mt-4 text-[19px] font-medium text-[#171923]">Sat, 15 Nov · 11:00 AM</p><p className="text-[16px] text-[#667085]">Skyline Residences sales gallery</p>
        <p className="mt-4 text-[15px] font-medium text-[#128c7e]">WhatsApp and email confirmations sent ✓</p>
      </div>
    </div>
  );
}
function S7({ p }: { p: number }) {
  const team = [['Kavya Rao', 'Senior sales executive', 150], ['Arjun Shah', 'Sales executive', 30], ['Meera Iyer', 'Sales executive', 320]] as const;
  return (
    <div className="product p-shell flex w-[1000px] items-center gap-7 p-7">
      <div className="ui-surface w-[440px] !rounded-[20px] p-6">
        <div className="flex items-center gap-4"><Avatar name="Rohan Mehta" size={52} hue={200} /><div><p className="text-[21px] font-semibold text-[#171923]">Rohan Mehta</p><p className="text-[15px] text-[#667085]">Qualified · Score 86 · Visit Sat 11 AM</p></div></div>
        <div className="mt-5 flex flex-wrap gap-2">{['3 BHK', '₹2 Cr', 'Self-use', '6 months'].map((x) => <span key={x} className="rounded-lg bg-[#f3efff] px-3 py-1 text-[15px] font-medium text-[#4c2bc0]">{x}</span>)}</div>
        <div className="mt-5 rounded-2xl border border-[#e5e7eb] bg-[#f7f8fc] p-4" style={{ opacity: seg(p, 0.5, 0.65) }}>
          <p className="flex items-center gap-2 text-[15px] font-semibold text-[#171923]"><Sparkles size={16} className="text-[#6a3ff0]" />AI conversation summary</p>
          <p className="mt-2 text-[15px] leading-snug text-[#475467]">Wants a ready-to-move 3 BHK in Whitefield near his office, ~₹2 Cr, buying within 6 months. Visit booked Sat 15 Nov, 11 AM.</p>
        </div>
      </div>
      <svg width="70" height="20"><path d="M0 10 H70" stroke="#6a3ff0" strokeWidth="3" strokeDasharray="6 8" strokeDashoffset={-p * 200} /></svg>
      <div className="flex-1 space-y-3">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#667085]">Assign to</p>
        {team.map(([n, r, h], i) => { const on = i === 0 && p > 0.4; return (
          <div key={n} className="flex items-center gap-4 rounded-2xl border bg-white p-4" style={{ borderColor: on ? '#86efac' : '#e5e7eb', background: on ? '#f0fdf4' : '#fff', boxShadow: on ? '0 0 0 3px #dcfce7' : '0 1px 2px rgba(16,24,40,.05)' }}>
            <Avatar name={n} size={44} hue={h} /><div className="flex-1"><p className="text-[19px] font-semibold text-[#171923]">{n}</p><p className="text-[14px] text-[#667085]">{r}</p></div>
            {on && <span className="flex items-center gap-1.5 text-[16px] font-semibold text-[#15803d]"><UserPlus size={18} />Assigned</span>}
          </div>); })}
      </div>
    </div>
  );
}
function S8({ p }: { p: number }) {
  return (
    <div className="w-[1060px]">
      <AppWindow path="analytics">
        <div className="grid grid-cols-[1.3fr_1fr] gap-3 p-5">
          <Panel title="Call volume · this week"><LineChart animate={false} ariaLabel="Demo call volume" labels={callVolume.map((d) => d.day)} fixedHeight={250} series={[{ key: 'c', label: 'Calls', color: '#6a3ff0', values: callVolume.map((d) => Math.round(d.calls * (0.4 + 0.6 * seg(p, 0, 0.6)))) }]} height={240} /></Panel>
          <div className="grid grid-cols-2 gap-3">
            {[['Qualified Leads', 846 + (p > 0.5 ? 1 : 0)], ['Site Visits', 124 + (p > 0.5 ? 1 : 0)], ['Total Calls', 2481], ['Connect Rate', '68%']].map(([k, v], i) => <div key={k as string} className="ui-surface p-4" style={p > 0.5 && i < 2 ? { borderColor: '#d9cdff', boxShadow: '0 0 0 3px #f3efff' } : undefined}><p className="text-[14px] font-medium text-[#667085]">{k}</p><p className="mt-1 text-[32px] font-semibold tabular-nums text-[#171923]">{typeof v === 'number' ? v.toLocaleString('en-IN') : v}{p > 0.5 && i < 2 && <span className="ml-2 text-[15px] font-semibold text-[#16a34a]">+1</span>}</p></div>)}
          </div>
          <Panel className="col-span-2" title="Top campaigns this week">
            <table className="w-full text-[16px]"><tbody>{campaigns.map((c) => <tr key={c.name} className="border-t border-[#e5e7eb]"><td className="py-2.5 font-medium text-[#171923]">{c.name}</td><td className="text-right tabular-nums text-[#475467]">{c.leads} leads</td><td className="text-right tabular-nums text-[#475467]">{c.qualified} qualified</td><td className="text-right font-semibold tabular-nums text-[#171923]">{c.visits} visits</td></tr>)}</tbody></table>
          </Panel>
        </div>
      </AppWindow>
    </div>
  );
}
function CTA({ p }: { p: number }) {
  return (
    <div className="flex w-[1200px] flex-col items-center text-center" style={{ opacity: seg(p, 0, 0.2) }}>
      <LogoMark size={88} />
      <h2 className="display mt-10 text-[76px] font-medium leading-[1.04] tracking-[-0.05em] text-white">Transform your real estate<br />sales workflow with AI.</h2>
      <p className="mt-6 text-[28px] text-[var(--dark-text)]">AI calling, qualification and site visit booking for real estate teams.</p>
      <span className="mt-12 inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-[#8f6bff] to-[#6a3ff0] px-12 py-6 text-[30px] font-medium text-white shadow-[0_20px_50px_rgba(106,63,240,.45),inset_0_2px_2px_rgba(255,255,255,.3)]" style={{ transform: `scale(${0.96 + 0.04 * seg(p, 0.15, 0.4)})` }}>Book a Demo <ArrowRight size={30} /></span>
    </div>
  );
}
const sceneComps = [Intro, S1, S2, S3, S4, S5, S6, S7, S8, CTA];
const XFADE = 0.4;
const SCALE = [1, 1.35, 1.02, 1.28, 1.28, 1.28, 1.28, 1.28, 1.14, 1];

function SceneLayer({ i, t, opacity }: { i: number; t: number; opacity: number }) {
  const sc = walkthrough.scenes[i]; const C = sceneComps[i];
  const p = Math.max(0, Math.min(1, (t - sc.start) / sc.len));
  const isCta = i === walkthrough.scenes.length - 1; const isIntro = i === 0;
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      {!isCta && !isIntro && (
        <div className="absolute left-1/2 top-[48px] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-[22px] text-white">
          <span className="tabular-nums text-[var(--brand-accent)]">{String(i).padStart(2, '0')} / {String(walkthrough.scenes.length - 2).padStart(2, '0')}</span><span className="h-5 w-px bg-white/20" /><span className="font-medium">{sc.title}</span>
        </div>
      )}
      <div className="absolute inset-x-0 top-[130px] bottom-[170px] flex items-center justify-center">
        <div className="relative" style={{ transform: `scale(${SCALE[i]})` }}><C p={p} t={t} /></div>
      </div>
      {!isCta && (
        <div className="absolute bottom-[60px] left-1/2 max-w-[1500px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[rgba(8,5,21,0.82)] px-8 py-4 text-center text-[34px] font-medium leading-tight tracking-[-0.01em] text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)]">{sc.caption}</div>
      )}
    </div>
  );
}

function Walkthrough({ t }: { t: number }) {
  const scenes = walkthrough.scenes;
  let i = scenes.findIndex((s) => t < s.start + s.len); if (i < 0) i = scenes.length - 1;
  const into = t - scenes[i].start;
  // Scene 1 is fully visible on the first frame; later scenes cross-fade from the previous one.
  const k = i === 0 ? 1 : ease(into / XFADE);
  return (
    <Shell t={t} total={walkthrough.total}>
      {i > 0 && k < 1 && <SceneLayer i={i - 1} t={t} opacity={1 - k} />}
      <SceneLayer i={i} t={t} opacity={k} />
    </Shell>
  );
}

function HeroAnim({ t }: { t: number }) {
  const phase = Math.min(HERO_STEPS.length - 1, Math.floor(t / HERO_STEP));
  const fl = (k: number) => `translateY(${Math.sin(t * 1.1 + k) * 8}px)`;
  return (
    <Shell t={t} total={HERO_LEN}>
      <div className="absolute left-1/2 top-[130px] w-[1260px] -translate-x-1/2 rounded-[26px] border border-white/15 bg-white/[0.06] p-2.5" style={{ transform: 'translateX(-50%) scale(1.05)', transformOrigin: 'top center' }}>
        <AppWindow path="campaigns/skyline-launch"><CommandCenter phase={phase} /></AppWindow>
      </div>
      <Float x={60} y={420} show title="Incoming Lead" c="#38bdf8" tr={fl(0)}><R k="Source" v={story.buyer.source} /><R k="Configuration" v={story.requirement.configuration} /><R k="Budget" v={story.requirement.budget} /></Float>
      <Float x={1600} y={300} show={phase >= 1} title="AI Call in Progress" c="#6a3ff0" tr={fl(2)}><p className="text-[15px]">{phase >= 3 && phase <= 5 ? 'Conversation active' : phase >= 6 ? 'Call ended · 1m 12s' : 'Connecting…'}</p><div className="mt-2"><TWave t={t} bars={26} height={34} active={phase >= 3 && phase <= 5} color="#6a3ff0" /></div></Float>
      <Float x={1600} y={640} show={phase >= 4} title="Lead Qualified" c="#16a34a" tr={fl(4)}>{['Budget captured', 'Configuration captured', 'Site visit requested'].map((x, i) => <p key={x} className="flex items-center gap-2 text-[15px]" style={{ color: phase >= [4, 4, 7][i] ? '#171923' : '#d0d5dd' }}><CheckCircle2 size={15} className="text-[#16a34a]" />{x}</p>)}</Float>
      <div className="absolute bottom-[56px] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[rgba(8,5,21,.8)] px-7 py-3.5 text-[24px] text-white"><Sparkles size={22} className="text-[var(--brand-accent)]" /><span className="tabular-nums text-[var(--brand-accent)]">{String(phase + 1).padStart(2, '0')}</span>{HERO_STEPS[phase]}</div>
    </Shell>
  );
}
function Float({ x, y, show, title, c, children, tr }: { x: number; y: number; show: boolean; title: string; c: string; children: React.ReactNode; tr: string }) {
  return (
    <div className="product p-float absolute w-[270px] p-5" style={{ left: x, top: y, opacity: show ? 1 : 0, transform: tr }}>
      <p className="mb-3 flex items-center gap-2 text-[17px] font-semibold text-[#171923]"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{title}</p>
      <div className="space-y-1.5 text-[#475467]">{children}</div>
    </div>
  );
}
function R({ k, v }: { k: string; v: string }) { return <p className="flex justify-between text-[15px]"><span className="text-[#667085]">{k}</span><span className="font-semibold text-[#171923]">{v}</span></p>; }

export default function RenderApp({ mode }: { mode: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    window.__setTime = (v) => setT(v);
    window.__duration = mode === 'hero' ? HERO_LEN : walkthrough.total;
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
