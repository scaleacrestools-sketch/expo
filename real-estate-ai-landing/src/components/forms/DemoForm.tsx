import { useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2, ShieldCheck } from 'lucide-react';
import { brand } from '../../config/brand';

export const BUSINESS_TYPES = ['Real Estate Developer', 'Channel Partner', 'Brokerage', 'Marketing Agency', 'Call Centre', 'Other'] as const;
export const LEAD_VOLUMES = ['Below 500', '500–1,000', '1,000–5,000', '5,000–10,000', 'Above 10,000'] as const;
const TIMES = ['Morning (9 AM – 12 PM)', 'Afternoon (12 PM – 4 PM)', 'Evening (4 PM – 7 PM)', 'Any time'];

type Values = Record<'fullName' | 'email' | 'phone' | 'company' | 'businessType' | 'leadVolume' | 'preferredTime' | 'requirements', string> & { consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'loading' | 'success' | 'local' | 'error';

const empty: Values = { fullName: '', email: '', phone: '', company: '', businessType: '', leadVolume: '', preferredTime: '', requirements: '', consent: false };

export function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid work email.';
  const digits = v.phone.replace(/[^\d]/g, '');
  if (!/^\+?[\d\s\-()]{7,20}$/.test(v.phone.trim()) || digits.length < 10 || digits.length > 15) e.phone = 'Please enter a valid phone number (10–15 digits).';
  if (v.company.trim().length < 2) e.company = 'Please enter your company name.';
  if (!v.businessType) e.businessType = 'Please select a business type.';
  if (!v.leadVolume) e.leadVolume = 'Please select your monthly lead volume.';
  if (!v.consent) e.consent = 'Please agree so we can contact you about your demo.';
  return e;
}

const isLocalHost = () => ['localhost', '127.0.0.1', '0.0.0.0', ''].includes(window.location.hostname);

export function DemoForm() {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const openedAt = useRef(Date.now());
  const honey = useRef<HTMLInputElement>(null);

  const set = (k: keyof Values) => (ev: { target: { value: string; checked?: boolean; type?: string } }) => {
    const val = ev.target.type === 'checkbox' ? !!ev.target.checked : ev.target.value;
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    // Spam protection: honeypot + minimum fill time.
    if (honey.current?.value || Date.now() - openedAt.current < 2500) {
      setStatus('error'); setServerMsg('Submission blocked by spam protection. Please wait a moment and try again.');
      return;
    }
    setStatus('loading');
    const body = new URLSearchParams({ 'form-name': 'demo-request', 'bot-field': '', ...Object.fromEntries(Object.entries(v).map(([k, val]) => [k, String(val)])) });
    if (isLocalHost()) {
      await new Promise((r) => setTimeout(r, 700));
      setStatus('local');
      return;
    }
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (!res.ok) throw new Error(`The form service responded with status ${res.status}.`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerMsg(err instanceof Error ? err.message : 'Network error.');
    }
  }

  if (status === 'success' || status === 'local') {
    const local = status === 'local';
    return (
      <div className="px-6 pb-8 pt-12 text-center sm:px-10" role="status" data-testid={local ? 'form-local' : 'form-success'}>
        <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${local ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
          {local ? <Info size={26} /> : <CheckCircle2 size={26} />}
        </div>
        <h3 className="h-card mt-5">{local ? 'Local preview: enquiry not sent' : 'Thank you. Your demo request was received.'}</h3>
        <p className="lead mx-auto mt-3 max-w-[440px] text-[15px]">
          {local
            ? 'You are running the site locally, so no data left your browser. Deploy to Netlify to receive real submissions in Netlify Forms.'
            : `Our team will contact you at ${v.email} to arrange a time.`}
        </p>
        <button className="btn btn-secondary mt-7" onClick={() => { setStatus('idle'); setV(empty); }}>Submit another request</button>
      </div>
    );
  }

  const field = 'mt-1.5 w-full rounded-xl border bg-[var(--c-card-2)] px-3.5 py-3 text-[15px] text-[var(--c-head)] placeholder:text-[var(--c-muted)] outline-none transition focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[rgba(139,92,246,0.25)]';
  const border = (k: keyof Values) => (errors[k] ? 'border-red-400/70' : 'border-[var(--c-line)]');
  const label = 'text-[13px] font-medium text-[var(--c-head)]';
  const Err = ({ k }: { k: keyof Values }) => (errors[k] ? <p id={`e-${k}`} className="mt-1.5 flex items-center gap-1 text-[12.5px] text-red-300"><AlertCircle size={13} />{errors[k]}</p> : null);
  const aria = (k: keyof Values) => ({ id: `f-${k}`, name: k, 'aria-invalid': !!errors[k] || undefined, 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  return (
    <form name="demo-request" method="POST" data-netlify="true" netlify-honeypot="bot-field" noValidate onSubmit={onSubmit} className="px-6 pb-7 pt-8 sm:px-9" data-testid="demo-form">
      <input type="hidden" name="form-name" value="demo-request" />
      <p className="hidden" aria-hidden="true"><label>Leave this field empty <input ref={honey} name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <span className="eyebrow">Book a Demo</span>
      <h2 className="h-card mt-4 text-[26px]">See {brand.productName} on your own sales workflow</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--c-text)]">Tell us a little about your team. Fields marked * are required.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="f-fullName" className={label}>Full Name *</label><input {...aria('fullName')} autoComplete="name" className={`${field} ${border('fullName')}`} value={v.fullName} onChange={set('fullName')} placeholder="Your name" data-autofocus /><Err k="fullName" /></div>
        <div><label htmlFor="f-email" className={label}>Work Email *</label><input {...aria('email')} type="email" autoComplete="email" className={`${field} ${border('email')}`} value={v.email} onChange={set('email')} placeholder="name@company.com" /><Err k="email" /></div>
        <div><label htmlFor="f-phone" className={label}>Phone Number *</label><input {...aria('phone')} type="tel" autoComplete="tel" inputMode="tel" className={`${field} ${border('phone')}`} value={v.phone} onChange={set('phone')} placeholder="+91 98xxx xxxxx" /><Err k="phone" /></div>
        <div><label htmlFor="f-company" className={label}>Company Name *</label><input {...aria('company')} autoComplete="organization" className={`${field} ${border('company')}`} value={v.company} onChange={set('company')} placeholder="Company" /><Err k="company" /></div>
        <div><label htmlFor="f-businessType" className={label}>Business Type *</label>
          <select {...aria('businessType')} className={`${field} ${border('businessType')}`} value={v.businessType} onChange={set('businessType')}>
            <option value="">Select…</option>{BUSINESS_TYPES.map((b) => <option key={b}>{b}</option>)}
          </select><Err k="businessType" /></div>
        <div><label htmlFor="f-leadVolume" className={label}>Monthly Lead Volume *</label>
          <select {...aria('leadVolume')} className={`${field} ${border('leadVolume')}`} value={v.leadVolume} onChange={set('leadVolume')}>
            <option value="">Select…</option>{LEAD_VOLUMES.map((b) => <option key={b}>{b}</option>)}
          </select><Err k="leadVolume" /></div>
        <div className="sm:col-span-2"><label htmlFor="f-preferredTime" className={label}>Preferred Communication Time</label>
          <select {...aria('preferredTime')} className={`${field} border-[var(--c-line)]`} value={v.preferredTime} onChange={set('preferredTime')}>
            <option value="">No preference</option>{TIMES.map((b) => <option key={b}>{b}</option>)}
          </select></div>
        <div className="sm:col-span-2"><label htmlFor="f-requirements" className={label}>Additional Requirements</label>
          <textarea {...aria('requirements')} rows={3} className={`${field} border-[var(--c-line)] resize-y`} value={v.requirements} onChange={set('requirements')} placeholder="Projects, CRM you use, languages, lead sources…" /></div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-[var(--c-text)]">
        <input {...aria('consent')} type="checkbox" checked={v.consent} onChange={set('consent')} className="mt-0.5 h-5 w-5 flex-none accent-[#6a3ff0]" />
        <span>I agree to be contacted about this demo request. My details are used only to respond to this enquiry and are not sold or shared for marketing. *</span>
      </label>
      <Err k="consent" />

      {status === 'error' && (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-[13.5px] text-red-200" data-testid="form-error">
          <AlertCircle size={16} className="mt-0.5 flex-none" /> <span>We could not send your request. {serverMsg} Please try again.</span>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-[12.5px] text-[var(--c-muted)]"><ShieldCheck size={14} /> Protected by spam filtering. No payment required.</p>
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'} aria-busy={status === 'loading'}>
          {status === 'loading' ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>) : 'Request my demo'}
        </button>
      </div>
    </form>
  );
}
