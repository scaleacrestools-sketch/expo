import { ArrowLeftRight, Check, CheckCheck, Clock, Database, Phone, PhoneIncoming, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Waveform } from '../animations/Waveform';
import { AgentOrb, Avatar, MiniCalendar } from '../dashboards/primitives';
import { useInView } from '../../hooks/useInView';
import { useLoop } from '../../hooks/useLoop';

function useTick(n: number, ms: number) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [t] = useLoop(n, ms, inView);
  return { ref, t };
}

export function CallingVisual() {
  const { ref, t } = useTick(4, 1600);
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-3 p-5 sm:flex-row sm:items-center sm:p-7" aria-hidden="true">
      <div className={`flex-1 rounded-2xl border border-[var(--c-line)] bg-white p-3.5 shadow-[var(--c-shadow)] transition-all duration-500 ${t >= 0 ? 'opacity-100' : 'opacity-0'}`}>
        <p className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--c-head)]"><span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-100 text-sky-600"><PhoneIncoming size={14} /></span>New enquiry</p>
        <p className="mt-2 text-[12px] text-[var(--c-text)]">Rohan Mehta · Meta Ads</p>
        <p className="text-[11.5px] text-[var(--c-muted)]">3 BHK · ₹2 Cr · Received just now</p>
      </div>
      <svg width="60" height="20" viewBox="0 0 60 20" className="mx-auto rotate-90 sm:rotate-0"><path d="M0 10 H60" stroke="#8b5cf6" strokeWidth="2" className="flow-dash" /></svg>
      <div className="flex-[1.3] rounded-2xl bg-[#0f0f14] p-4 text-white shadow-[0_24px_50px_-24px_rgba(36,21,82,.7)]">
        <div className="flex items-center gap-2.5"><AgentOrb size={32} live={t >= 1} /><div className="flex-1"><p className="text-[13px] font-medium">{t >= 2 ? 'Connected' : 'Calling Rohan…'}</p><p className="text-[11px] text-white/50">Auto-dialled within permitted hours</p></div><span className={`grid h-8 w-8 place-items-center rounded-full ${t >= 2 ? 'bg-emerald-500' : 'bg-white/10'}`}><Phone size={14} /></span></div>
        <div className="mt-3"><Waveform bars={34} active={t >= 2} height={26} /></div>
      </div>
    </div>
  );
}

export function ChecklistVisual() {
  const items = ['Budget', 'Configuration', 'Location', 'Timeline', 'Purpose'];
  const [on, setOn] = useState<boolean[]>([true, true, true, false, false]);
  const n = on.filter(Boolean).length;
  return (
    <div className="p-5 sm:p-6">
      <div className="rounded-2xl border border-[var(--c-line)] bg-white p-4 shadow-[var(--c-shadow)]">
        <div className="flex items-center justify-between text-[12px]"><span className="font-semibold text-[var(--c-head)]">Qualification</span><span className="tabular-nums text-[var(--c-muted)]">{n}/5 captured</span></div>
        <div className="mt-2 h-1.5 rounded-full bg-[var(--light-background-secondary)]"><div className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-500" style={{ width: `${n * 20}%` }} /></div>
        <ul className="mt-3 grid gap-1.5">
          {items.map((it, i) => (
            <li key={it}>
              <button type="button" aria-pressed={on[i]} onClick={() => setOn((p) => p.map((v, j) => (j === i ? !v : v)))} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition hover:bg-[var(--light-background-secondary)]">
                <span className={`grid h-[18px] w-[18px] place-items-center rounded-md transition ${on[i] ? 'bg-[var(--brand-solid)] text-white' : 'border border-[#d4d4d8]'}`}>{on[i] && <Check size={11} strokeWidth={3} />}</span>
                <span className={on[i] ? 'text-[var(--c-head)]' : 'text-[var(--c-muted)]'}>{it}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function WhatsAppVisual() {
  const { ref, t } = useTick(7, 1300);
  // 0 compose · 1 brochure text · 2 attachment · 3 delivered · 4 buyer typing · 5 reply · 6 confirmation
  const tick = (read: boolean) => <CheckCheck size={12} className={`ml-1 inline ${read ? 'text-sky-500' : 'text-[#8696a0]'}`} />;
  return (
    <div ref={ref} className="h-full p-5 sm:p-6" aria-hidden="true">
      <div className="mx-auto max-w-[310px] overflow-hidden rounded-[22px] border border-[var(--c-line)] bg-[#efeae2] shadow-[var(--c-shadow)]">
        <div className="flex items-center gap-2 bg-[#0b5c4f] px-3 py-2.5 text-white"><Avatar name="Rohan Mehta" size={26} hue={190} /><div><p className="text-[12.5px] font-medium">Rohan Mehta</p><p className="text-[10px] text-white/75">{t === 4 ? 'typing…' : 'online'}</p></div></div>
        <div className="space-y-1.5 p-2.5" style={{ minHeight: 248 }}>
          <Bubble me show={t >= 1}>Hi Rohan, here is the Skyline Residences brochure you asked for.{tick(t >= 3)}</Bubble>
          <Bubble me show={t >= 2}><span className="flex items-center gap-2"><span className="grid h-8 w-7 place-items-center rounded bg-red-500/90 text-[8px] font-bold text-white">PDF</span><span><span className="block font-medium">Skyline-Residences.pdf</span><span className="block text-[10px] text-[#667781]">12 pages · 2.4 MB</span></span></span>{tick(t >= 3)}</Bubble>
          {t === 4 && <div className="flex"><p className="flex gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm">{[0, 1, 2].map((i) => <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-[#8696a0]" />)}</p></div>}
          <Bubble show={t >= 5}>Thanks! Can I visit on Saturday?</Bubble>
          <Bubble me show={t >= 6}>Done. Your visit is confirmed for Sat, 15 Nov at 11:00 AM.{tick(false)}</Bubble>
        </div>
      </div>
      <p className="mt-2 text-center text-[10.5px] text-[var(--c-muted)]">WhatsApp-style preview · demonstration only</p>
    </div>
  );
}
function Bubble({ me = false, show, children }: { me?: boolean; show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div className={`flex ${me ? 'justify-end' : ''}`} style={{ animation: 'pop .3s var(--ease-out) both' }}>
      <p className={`max-w-[86%] rounded-lg px-2.5 py-1.5 text-[11.5px] leading-snug text-[#111b21] shadow-sm ${me ? 'rounded-tr-none bg-[#d9fdd3]' : 'rounded-tl-none bg-white'}`}>{children}</p>
    </div>
  );
}

export function LanguageVisual() {
  const langs = [
    { l: 'English', s: 'Which configuration are you looking for?' },
    { l: 'Hindi', s: 'आप कौन सी कॉन्फ़िगरेशन देख रहे हैं?' },
    { l: 'Hinglish', s: 'Aap kaunsi configuration dekh rahe hain?' },
    { l: 'Regional', s: 'Configurable per campaign' },
  ];
  const { ref, t } = useTick(4, 2200);
  const [pick, setPick] = useState<number | null>(null);
  const a = pick ?? t;
  return (
    <div ref={ref} className="p-5 sm:p-6">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preview language">
        {langs.map((x, i) => <button key={x.l} type="button" aria-pressed={a === i} onClick={() => setPick(i)} className={`min-h-[34px] rounded-full border px-3 text-[12px] font-medium transition ${a === i ? 'border-[var(--brand-primary)] bg-[var(--brand-solid)] text-white' : 'border-[var(--c-line)] bg-white text-[var(--c-text)] hover:border-[var(--brand-secondary)]'}`}>{x.l}</button>)}
      </div>
      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[var(--c-line)] bg-white p-3 shadow-sm">
        <AgentOrb size={26} live={false} />
        <p key={a} className="text-[13px] leading-snug text-[var(--c-head)]" style={{ animation: 'float-y .001s' }}>{langs[a].s}</p>
      </div>
    </div>
  );
}

export function CalendarVisual() {
  const [day, setDay] = useState(15);
  const [slot, setSlot] = useState('11:00');
  return (
    <div className="p-5 sm:p-6">
      <div className="grid gap-4 rounded-2xl border border-[var(--c-line)] bg-white p-4 shadow-[var(--c-shadow)] sm:grid-cols-[1fr_200px]">
        <div>
          <p className="mb-2 text-[12.5px] font-semibold text-[var(--c-head)]">Pick a visit date · November</p>
          <MiniCalendar booked={[6, 9, 13, 20]} selected={day} highlight={-1} onPick={setDay} className="max-w-[300px]" />
        </div>
        <div className="flex flex-col">
          <p className="mb-2 text-[12.5px] font-semibold text-[var(--c-head)]">Available slots</p>
          <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Available time slots">
            {['10:00', '11:00', '12:30', '14:00', '16:00', '17:30'].map((s) => (
              <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)} className={`min-h-[34px] rounded-lg border text-[12px] tabular-nums transition-colors duration-150 ${slot === s ? 'border-[var(--brand-solid)] bg-[var(--brand-solid)] text-white' : 'border-[var(--c-line)] text-[var(--c-text)] hover:border-[var(--brand-secondary)]'}`}>{s}</button>
            ))}
          </div>
          <p className="mt-auto rounded-lg bg-[#f1edff] px-2.5 py-2 text-[11.5px] text-[var(--brand-deep)]" aria-live="polite">Nov {day} · {slot} · Sales team notified</p>
        </div>
      </div>
    </div>
  );
}

export function ReactivationVisual() {
  const { ref, t } = useTick(5, 1200);
  const rows = ['Karan P.', 'Sana R.', 'Dev A.', 'Meera J.'];
  return (
    <div ref={ref} className="p-5 sm:p-6" aria-hidden="true">
      <ul className="space-y-1.5">
        {rows.map((r, i) => {
          const on = t > i;
          return (
            <li key={r} className="flex items-center justify-between rounded-xl border border-[var(--c-line)] bg-white px-3 py-2 text-[12px] shadow-sm">
              <span className="flex items-center gap-2"><Avatar name={r} size={22} hue={220 + i * 25} /><span className="text-[var(--c-head)]">{r}</span></span>
              <span className={`badge transition-all duration-300 ${on ? 'badge-brand' : 'badge-neutral'}`}>{on ? <><RefreshCw size={10} />Call · {['Tue', 'Tue', 'Wed', 'Wed'][i]} {['10:30', '11:15', '10:00', '12:30'][i]}</> : 'Inactive · 9 months'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ClockVisual() {
  const { ref, t } = useTick(24, 380);
  const hour = t;
  const allowed = hour >= 10 && hour < 19;
  const events = [
    { h: 2, l: 'Enquiry captured · reply queued', ok: false },
    { h: 10, l: 'AI call placed', ok: true },
    { h: 13, l: 'Site visit booked', ok: true },
    { h: 21, l: 'Follow-up held until 10 AM', ok: false },
  ];
  return (
    <div ref={ref} className="p-5 sm:p-6" aria-hidden="true">
      <div className="flex items-center gap-4">
        <div className="relative h-[92px] w-[92px] flex-none rounded-full border border-[var(--c-line)] bg-white shadow-[var(--c-shadow)]">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} className="absolute left-1/2 top-1/2 h-[40px] w-px origin-bottom" style={{ transform: `translate(-50%,-100%) rotate(${i * 30}deg)` }}><span className="block h-1.5 w-px bg-[#c4cbd6]" /></span>)}
          <span className="absolute left-1/2 top-1/2 h-[30px] w-[2px] origin-bottom rounded bg-[var(--brand-solid)] transition-transform duration-300" style={{ transform: `translate(-50%,-100%) rotate(${hour * 15}deg)` }} />
          <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-solid)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[22px] font-semibold tabular-nums text-[var(--c-head)]">{String(hour).padStart(2, '0')}:00</p>
          <span className={`badge ${allowed ? 'badge-ok' : 'badge-warm'}`}>{allowed ? 'Calling permitted' : 'Outside calling hours'}</span>
        </div>
      </div>
      <div className="relative mt-4 h-2 rounded-full bg-[#eef1f6]">
        <span className="absolute inset-y-0 rounded-full bg-[#dcf8ee]" style={{ left: `${(10 / 24) * 100}%`, width: `${(9 / 24) * 100}%` }} />
        <span className="absolute -top-1 h-4 w-0.5 rounded bg-[var(--brand-solid)] transition-all duration-300" style={{ left: `${(hour / 24) * 100}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-[var(--c-muted)]"><span>00:00</span><span>10 AM – 7 PM calls</span><span>24:00</span></div>
      <ul className="mt-3 space-y-1">
        {events.map((e) => (
          <li key={e.l} className={`flex items-center gap-2 text-[11.5px] transition-opacity duration-300 ${hour >= e.h ? 'opacity-100' : 'opacity-30'}`}>
            <Clock size={11} className={e.ok ? 'text-[#046c4e]' : 'text-[#8a5a00]'} /><span className="tabular-nums text-[var(--c-muted)]">{String(e.h).padStart(2, '0')}:00</span><span className="text-[var(--c-head)]">{e.l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CrmSyncVisual() {
  const { ref, t } = useTick(4, 1500);
  return (
    <div ref={ref} className="flex items-center justify-center gap-2 p-5 sm:gap-4 sm:p-7" aria-hidden="true">
      <div className="w-[44%] rounded-2xl border border-[var(--c-line)] bg-white p-3 shadow-[var(--c-shadow)]">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--c-head)]"><Sparkles size={13} className="text-[var(--brand-deep)]" />AI platform</p>
        {['Lead score · 86', 'Outcome · Visit booked', 'Summary attached'].map((r, i) => <p key={r} className={`mt-1.5 rounded-md bg-[var(--light-background-secondary)] px-2 py-1 text-[11px] text-[var(--c-text)] ${t === i + 1 ? 'ring-1 ring-[var(--brand-primary)]' : ''}`}>{r}</p>)}
      </div>
      <div className="relative grid h-11 w-11 flex-none place-items-center rounded-full bg-[var(--brand-solid)] text-white shadow-[0_0_24px_rgba(139,92,246,.5)]"><ArrowLeftRight size={17} className={t % 2 ? 'scale-x-[-1] transition' : 'transition'} /></div>
      <div className="w-[44%] rounded-2xl border border-[var(--c-line)] bg-white p-3 shadow-[var(--c-shadow)]">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--c-head)]"><Database size={13} className="text-sky-600" />Your CRM</p>
        {['Contact updated', 'Activity logged', 'Owner assigned'].map((r, i) => <p key={r} className={`mt-1.5 flex items-center justify-between rounded-md bg-[var(--light-background-secondary)] px-2 py-1 text-[11px] text-[var(--c-text)]`}>{r}{t > i && <Check size={11} className="text-emerald-500" />}</p>)}
      </div>
    </div>
  );
}

export function ScoringVisual() {
  const rules = [
    { k: 'Budget matches project', pts: 25 },
    { k: 'Configuration available', pts: 20 },
    { k: 'Buying within 6 months', pts: 20 },
    { k: 'Wants a site visit', pts: 21 },
  ];
  const { ref, t } = useTick(rules.length + 3, 1200);
  const n = Math.min(rules.length, t);
  const score = rules.slice(0, n).reduce((a, r) => a + r.pts, 0);
  const band = score >= 75 ? ['Hot', 'badge-hot', '#ff4a4d'] : score >= 45 ? ['Warm', 'badge-warm', '#febc2e'] : ['Cold', 'badge-cold', '#38bdf8'];
  return (
    <div ref={ref} className="p-5 sm:p-6" aria-hidden="true">
      <div className="flex items-end justify-between">
        <div><p className="text-[11px] text-[var(--c-muted)]">Rohan Mehta · lead score</p><p className="text-[34px] font-semibold leading-none tabular-nums text-[var(--c-head)]">{score}<span className="text-[14px] font-normal text-[var(--c-muted)]">/100</span></p></div>
        <span className={`badge ${band[1]}`}>{band[0]}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eef1f6]"><div className="h-full origin-left rounded-full transition-all duration-500" style={{ width: `${score}%`, background: band[2] }} /></div>
      <ul className="mt-3 space-y-1.5">
        {rules.map((r, i) => (
          <li key={r.k} className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11.5px] transition-all duration-300 ${i < n ? 'border-[var(--c-line)] bg-white text-[var(--c-head)]' : 'border-transparent text-[var(--c-muted)] opacity-50'}`}>
            <span className="flex items-center gap-1.5">{i < n ? <Check size={12} className="text-[#046c4e]" /> : <span className="h-3 w-3 rounded-full border border-[#cfd6e2]" />}{r.k}</span><span className="tabular-nums">+{r.pts}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IntelligenceVisual() {
  const { ref, t } = useTick(4, 1800);
  return (
    <div ref={ref} className="grid gap-2.5 p-5 sm:grid-cols-2 sm:p-6" aria-hidden="true">
      <div className="rounded-2xl bg-[#0f0f14] p-3.5 text-white">
        <p className="text-[11px] text-white/50">Call · 03:42</p>
        <Waveform bars={30} height={28} className="mt-2" active={t < 3} />
        <p className="mt-2 text-[11.5px] text-white/75"><b className="text-[var(--brand-accent)]">Buyer:</b> Possession timeline matters, we move in June.</p>
      </div>
      <div className="rounded-2xl border border-[var(--c-line)] bg-white p-3.5 shadow-[var(--c-shadow)]">
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--c-head)]"><Sparkles size={13} className="text-[var(--brand-deep)]" />AI summary</p>
        <ul className="mt-1.5 space-y-1 text-[11.5px] text-[var(--c-text)]">
          {['Wants 3 BHK, ₹2 Cr budget', 'Concern: possession date', 'Next step: site visit Sat'].map((s, i) => <li key={s} className={`flex gap-1.5 transition-opacity duration-500 ${t > i ? 'opacity-100' : 'opacity-20'}`}><Check size={12} className="mt-0.5 flex-none text-emerald-500" />{s}</li>)}
        </ul>
      </div>
    </div>
  );
}
