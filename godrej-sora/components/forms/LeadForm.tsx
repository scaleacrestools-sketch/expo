'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { budgets, leadMagnets, timelines, visitSlots, type LeadMagnetId } from '@/content/leads';
import { leadSchema } from '@/lib/lead-schema';
import { captureAttribution, track } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'done' | 'error';

export function LeadForm({ magnet, source, onDone, compact = false, light = false }: { magnet: LeadMagnetId; source: string; onDone?: () => void; compact?: boolean; light?: boolean }) {
  const def = leadMagnets[magnet];
  const fields = def.fields as readonly string[];
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const startedAt = useRef<number>(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const minDate = useMemo(() => new Date(Date.now() + 86_400_000).toISOString().slice(0, 10), []);
  const has = (f: string) => fields.includes(f);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const payload = {
      magnet, source,
      name: raw.name || '', phone: raw.phone || '', email: raw.email || '',
      configuration: raw.configuration || '', budget: raw.budget || '', timeline: raw.timeline || '',
      visitDate: raw.visitDate || '', visitSlot: raw.visitSlot || '', message: raw.message || '',
      consent: raw.consent === 'on',
      website: raw.website || '',
      startedAt: startedAt.current,
      attribution: captureAttribution() as Record<string, string>,
    };
    const check = leadSchema.safeParse(payload);
    if (!check.success) {
      const fe: Record<string, string> = {};
      for (const i of check.error.issues) fe[String(i.path[0])] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({}); setStatus('submitting');
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErrors(json.fieldErrors || {}); setMessage(json.error || 'Something went wrong.'); setStatus('error'); return; }
      track('lead_submitted', { magnet, source, configuration: payload.configuration || undefined });
      setStatus('done');
      onDone?.();
    } catch { setMessage('Network error. Please try again or call us.'); setStatus('error'); }
  }

  if (status === 'done') {
    return (
      <div className={`py-10 text-center ${light ? 'text-ivory' : ''}`} role="status" aria-live="polite">
        <p className="eyebrow mb-4">Thank you</p>
        <h3 className="display text-3xl">We will be in touch <em>shortly.</em></h3>
        <p className={`lede mt-4 ${light ? '!text-ivory/70' : ''}`}>A Godrej Sora advisor will contact you on the number provided to confirm your request.</p>
      </div>
    );
  }

  const inputCls = light ? '!text-ivory !border-ivory/40 placeholder:text-ivory/40' : '';
  const labelCls = light ? '!text-ivory/70' : '';

  return (
    <form onSubmit={submit} noValidate className={`grid gap-6 ${compact ? 'md:grid-cols-2' : ''}`} aria-describedby={`${magnet}-intro`}>
      <p id={`${magnet}-intro`} className="sr-only">{def.intro}</p>
      {/* honeypot */}
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      <Field label="Full Name" name="name" id={`${magnet}-name`} error={errors.name} labelCls={labelCls}>
        <input id={`${magnet}-name`} name="name" autoComplete="name" required aria-invalid={!!errors.name} className={inputCls} placeholder="Your full name" />
      </Field>
      <Field label="Mobile Number" name="phone" id={`${magnet}-phone`} error={errors.phone} labelCls={labelCls}>
        <input id={`${magnet}-phone`} name="phone" type="tel" inputMode="numeric" autoComplete="tel" required aria-invalid={!!errors.phone} className={inputCls} placeholder="+91 98XXX XXXXX" />
      </Field>
      {has('email') && (
        <Field label="Email" name="email" id={`${magnet}-email`} error={errors.email} labelCls={labelCls}>
          <input id={`${magnet}-email`} name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls} placeholder="you@example.com" />
        </Field>
      )}
      {has('configuration') && (
        <Field label="Preferred Residence" name="configuration" id={`${magnet}-configuration`} error={errors.configuration} labelCls={labelCls}>
          <select id={`${magnet}-configuration`} name="configuration" defaultValue="" className={inputCls}>
            <option value="">Select</option>
            <option>3 BHK</option><option>4 BHK</option><option>Undecided</option>
          </select>
        </Field>
      )}
      {has('budget') && (
        <Field label="Budget (optional)" name="budget" id={`${magnet}-budget`} labelCls={labelCls}>
          <select id={`${magnet}-budget`} name="budget" defaultValue="" className={inputCls}><option value="">Select</option>{budgets.map((b) => <option key={b}>{b}</option>)}</select>
        </Field>
      )}
      {has('timeline') && (
        <Field label="Purchase Timeline" name="timeline" id={`${magnet}-timeline`} labelCls={labelCls}>
          <select id={`${magnet}-timeline`} name="timeline" defaultValue="" className={inputCls}><option value="">Select</option>{timelines.map((b) => <option key={b}>{b}</option>)}</select>
        </Field>
      )}
      {has('visitDate') && (
        <Field label="Preferred Visit Date" name="visitDate" id={`${magnet}-visitDate`} error={errors.visitDate} labelCls={labelCls}>
          <input id={`${magnet}-visitDate`} name="visitDate" type="date" min={minDate} className={inputCls} />
        </Field>
      )}
      {has('visitSlot') && (
        <Field label="Preferred Time Slot" name="visitSlot" id={`${magnet}-visitSlot`} labelCls={labelCls}>
          <select id={`${magnet}-visitSlot`} name="visitSlot" defaultValue="" className={inputCls}><option value="">Select</option>{visitSlots.map((b) => <option key={b}>{b}</option>)}</select>
        </Field>
      )}
      {has('message') && (
        <Field label="Message (optional)" name="message" id={`${magnet}-message`} labelCls={labelCls} className="md:col-span-2">
          <textarea id={`${magnet}-message`} name="message" rows={3} className={inputCls} placeholder="Anything we should know?" />
        </Field>
      )}
      <div className={`flex flex-col gap-4 ${compact ? 'md:col-span-2' : ''}`}>
        <label className={`flex items-start gap-3 text-[0.78rem] leading-relaxed ${light ? 'text-ivory/70' : 'text-ink-soft'}`}>
          <input type="checkbox" name="consent" required className="mt-1 accent-sora-red" aria-invalid={!!errors.consent} />
          <span>I agree to be contacted about Godrej Sora via call, SMS, WhatsApp and email, and I have read the <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>. This overrides DND/NDNC registration.</span>
        </label>
        {errors.consent && <p className="text-[0.74rem] text-sora-red">{errors.consent}</p>}
        {status === 'error' && <p className="text-[0.8rem] text-sora-red" role="alert">{message}</p>}
        <button type="submit" disabled={status === 'submitting'} className={`btn ${light ? 'btn-gold' : 'btn-primary'} disabled:opacity-60`}>
          {status === 'submitting' ? 'Sending…' : def.cta}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, error, children, labelCls = '', className = '', id }: { label: string; name: string; error?: string; children: React.ReactNode; labelCls?: string; className?: string; id: string }) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className={labelCls}>{label}</label>
      {children}
      {error && <p className="error" id={`${name}-error`}>{error}</p>}
    </div>
  );
}
