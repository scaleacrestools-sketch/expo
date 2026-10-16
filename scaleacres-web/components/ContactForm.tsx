"use client";

import { useId, useRef, useState } from "react";
import { serviceOptions, type ContactFieldErrors } from "@/lib/contactSchema";
import { Arrow } from "@/components/ui/Arrow";

type Status = { state: "idle" } | { state: "submitting" } | { state: "success"; reference: string } | { state: "error"; message: string; fields?: ContactFieldErrors };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // Lazy initialiser runs once on the client mount; on the server it is simply unused.
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const payload = { ...data, consent: data.consent === "on", startedAt };
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json()) as { ok: boolean; reference?: string; message?: string; fields?: ContactFieldErrors };
      if (res.ok && json.ok && json.reference) {
        setStatus({ state: "success", reference: json.reference });
        form.reset();
      } else {
        setStatus({ state: "error", message: json.message ?? "We couldn't send your message. Please try again or email us directly.", fields: json.fields });
        // Move focus to the first invalid field for keyboard/screen-reader users.
        const first = json.fields ? Object.keys(json.fields)[0] : undefined;
        if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        else liveRef.current?.focus();
      }
    } catch {
      setStatus({ state: "error", message: "Network error — please check your connection and try again." });
    }
  }

  const errors = status.state === "error" ? status.fields ?? {} : {};
  const inputCls =
    "peer w-full rounded-none border-0 border-b border-ivory/25 bg-transparent px-0 pb-3 pt-6 text-base text-ivory placeholder-transparent outline-none transition-colors focus:border-coral aria-[invalid=true]:border-coral";
  const labelCls =
    "pointer-events-none absolute left-0 top-6 text-base text-grey transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.6875rem] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-coral peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.6875rem] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.16em]";

  if (status.state === "success") {
    return (
      <div role="status" className="rounded-sm border border-coral/40 bg-charcoal-soft p-8">
        <p className="eyebrow text-coral">Message received</p>
        <p className="h3 mt-4">Thanks — we&apos;ve got your enquiry.</p>
        <p className="mt-4 text-stone">Your reference is <span className="font-semibold text-ivory">{status.reference}</span>. A member of the ScaleAcres team will get back to you within one business day.</p>
        <button type="button" onClick={() => { setStatus({ state: "idle" }); setStartedAt(Date.now()); }} className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory hover:text-coral">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${id}-privacy`} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <Field id={`${id}-name`} name="fullName" label="Full Name" autoComplete="name" error={errors.fullName} inputCls={inputCls} labelCls={labelCls} required />
      <Field id={`${id}-email`} name="email" type="email" label="Work Email" autoComplete="email" error={errors.email} inputCls={inputCls} labelCls={labelCls} required />
      <Field id={`${id}-phone`} name="phone" type="tel" label="Phone Number" autoComplete="tel" error={errors.phone} inputCls={inputCls} labelCls={labelCls} required />
      <Field id={`${id}-company`} name="company" label="Company Name" autoComplete="organization" error={errors.company} inputCls={inputCls} labelCls={labelCls} required />

      <div className="relative sm:col-span-2">
        <label htmlFor={`${id}-service`} className="block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-grey">Service Interested In <span aria-hidden="true" className="text-coral">*</span></label>
        <select id={`${id}-service`} name="service" required defaultValue="" aria-invalid={!!errors.service} aria-describedby={errors.service ? `${id}-service-err` : undefined} className="mt-2 w-full appearance-none border-0 border-b border-ivory/25 bg-transparent pb-3 pt-2 text-base text-ivory outline-none focus:border-coral aria-[invalid=true]:border-coral [&>option]:bg-charcoal">
          <option value="" disabled>Choose a service</option>
          {serviceOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-4 right-0 text-grey">▾</span>
        {errors.service ? <p id={`${id}-service-err`} role="alert" className="mt-2 text-sm text-coral">{errors.service}</p> : null}
      </div>

      <div className="relative sm:col-span-2">
        <textarea id={`${id}-message`} name="message" rows={4} required placeholder="Project Description" aria-invalid={!!errors.message} aria-describedby={errors.message ? `${id}-message-err` : undefined} className={`${inputCls} resize-y`} />
        <label htmlFor={`${id}-message`} className={labelCls}>Project Description <span aria-hidden="true" className="text-coral">*</span></label>
        {errors.message ? <p id={`${id}-message-err`} role="alert" className="mt-2 text-sm text-coral">{errors.message}</p> : null}
      </div>

      {/* Honeypot — hidden from humans, tempting for bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-stone">
          <input type="checkbox" name="consent" required aria-invalid={!!errors.consent} className="mt-1 h-4 w-4 shrink-0 accent-coral" />
          <span id={`${id}-privacy`}>
            I agree to ScaleAcres storing my details to respond to this enquiry. We never sell your data. See our <a href="/privacy-policy" className="underline underline-offset-2 hover:text-ivory">Privacy Policy</a>.
          </span>
        </label>
        {errors.consent ? <p role="alert" className="mt-2 text-sm text-coral">{errors.consent}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button type="submit" disabled={status.state === "submitting"} className="group inline-flex items-center gap-3 rounded-full bg-coral px-8 py-5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors hover:bg-ivory disabled:cursor-wait disabled:opacity-70">
          {status.state === "submitting" ? "Sending…" : "Send Enquiry"}
          <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
        <p ref={liveRef} tabIndex={-1} role="alert" aria-live="assertive" className={`text-sm ${status.state === "error" ? "text-coral" : "text-grey"}`}>
          {status.state === "error" ? status.message : "We reply within one business day."}
        </p>
      </div>
    </form>
  );
}

function Field({ id, name, label, type = "text", autoComplete, error, inputCls, labelCls, required }: { id: string; name: string; label: string; type?: string; autoComplete?: string; error?: string; inputCls: string; labelCls: string; required?: boolean }) {
  return (
    <div className="relative">
      <input id={id} name={name} type={type} autoComplete={autoComplete} required={required} placeholder={label} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={inputCls} />
      <label htmlFor={id} className={labelCls}>{label} {required ? <span aria-hidden="true" className="text-coral">*</span> : null}</label>
      {error ? <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-coral">{error}</p> : null}
    </div>
  );
}
