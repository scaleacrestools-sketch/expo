"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { contactSchema, serviceOptions, type ContactFieldErrors } from "@/lib/contactSchema";
import { site } from "@/content/site";
import { ArrowUR } from "@/components/nd/ui";

// Same rules as the server (app/api/contact), minus the anti-spam fields the server checks itself.
const clientSchema = contactSchema.omit({ startedAt: true, website: true });

type Status = { state: "idle" } | { state: "submitting" } | { state: "success"; reference: string } | { state: "error"; message: string; fields?: ContactFieldErrors };

/**
 * The homepage enquiry form, on Brand Black. Validates in the browser and again on the server.
 * It never pretends to send: the static review build says submission is disabled, and the full
 * deployment reports plainly when no delivery channel (Resend or a webhook) is configured yet.
 */
export function NdContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const liveRef = useRef<HTMLParagraphElement>(null);
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const payload = { ...data, consent: data.consent === "on", startedAt };
    const checked = clientSchema.safeParse(payload);
    if (!checked.success) {
      const fields: ContactFieldErrors = {};
      for (const issue of checked.error.issues) {
        const key = issue.path[0] as keyof ContactFieldErrors | undefined;
        if (key && !fields[key]) fields[key] = issue.message;
      }
      setStatus({ state: "error", message: "Please check the highlighted fields.", fields });
      const first = Object.keys(fields)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1") {
      setStatus({ state: "error", message: `Preview build: sending is switched off here. On the live site this form is delivered once email is configured; until then, write to ${site.email}.` });
      liveRef.current?.focus();
      return;
    }
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json()) as { ok: boolean; reference?: string; message?: string; fields?: ContactFieldErrors };
      if (res.ok && json.ok && json.reference) {
        setStatus({ state: "success", reference: json.reference });
        form.reset();
      } else {
        setStatus({ state: "error", message: json.message ?? `We couldn't send your message. Please email ${site.email}.`, fields: json.fields });
        const first = json.fields ? Object.keys(json.fields)[0] : undefined;
        if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        else liveRef.current?.focus();
      }
    } catch {
      setStatus({ state: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="border border-white/15 p-8">
        <p className="nd-label text-[color:var(--sky)]">Message received</p>
        <p className="mt-4 text-[1.5rem] font-semibold tracking-[-0.02em]">Thank you. We&apos;ve got your enquiry.</p>
        <p className="nd-muted mt-3">Your reference is <span className="font-semibold text-white">{status.reference}</span>.</p>
        <button type="button" onClick={() => { setStatus({ state: "idle" }); setStartedAt(Date.now()); }} className="nd-link nd-label mt-6">Send another message</button>
      </div>
    );
  }

  const errors = status.state === "error" ? status.fields ?? {} : {};
  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={`${id}-privacy`} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <Field id={`${id}-name`} name="fullName" label="Full name" autoComplete="name" error={errors.fullName} />
      <Field id={`${id}-email`} name="email" type="email" label="Work email" autoComplete="email" error={errors.email} />
      <Field id={`${id}-phone`} name="phone" type="tel" label="Phone" autoComplete="tel" error={errors.phone} />
      <Field id={`${id}-company`} name="company" label="Company" autoComplete="organization" error={errors.company} />
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-service`} className="nd-label nd-muted block">Service <span aria-hidden="true" className="text-[color:var(--sky)]">*</span></label>
        <div className="relative">
          <select id={`${id}-service`} name="service" required defaultValue="" aria-invalid={!!errors.service} aria-describedby={errors.service ? `${id}-service-err` : undefined} className="nd-input appearance-none pr-8 [&>option]:bg-[color:var(--ink)]">
            <option value="" disabled>Choose a service</option>
            {serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute bottom-4 right-1 h-3.5 w-3.5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m3 6 5 5 5-5" /></svg>
        </div>
        {errors.service ? <p id={`${id}-service-err`} className="mt-2 text-[0.9375rem] text-[color:var(--sky)]">{errors.service}</p> : null}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="nd-label nd-muted block">Project details <span aria-hidden="true" className="text-[color:var(--sky)]">*</span></label>
        <textarea id={`${id}-message`} name="message" rows={4} required aria-invalid={!!errors.message} aria-describedby={errors.message ? `${id}-message-err` : undefined} className="nd-input resize-y" />
        {errors.message ? <p id={`${id}-message-err`} className="mt-2 text-[0.9375rem] text-[color:var(--sky)]">{errors.message}</p> : null}
      </div>
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-[0.9375rem] text-white/70">
          <input type="checkbox" name="consent" required aria-invalid={!!errors.consent} className="mt-1 h-4 w-4 shrink-0 accent-[#1d4ed8]" />
          <span id={`${id}-privacy`}>I agree to ScaleAcres storing my details to respond to this enquiry. See our <Link href="/privacy-policy/" className="underline underline-offset-2 hover:text-white">Privacy Policy</Link>.</span>
        </label>
        {errors.consent ? <p className="mt-2 text-[0.9375rem] text-[color:var(--sky)]">{errors.consent}</p> : null}
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={status.state === "submitting"} className="nd-btn nd-btn--royal w-full sm:w-auto sm:min-w-[16rem] disabled:cursor-wait disabled:opacity-70">
          {status.state === "submitting" ? "Sending…" : "Send enquiry"} <ArrowUR />
        </button>
        <p ref={liveRef} tabIndex={-1} role="status" aria-live="polite" className={`text-[0.9375rem] outline-none ${status.state === "error" ? "text-[color:var(--sky)]" : "nd-muted"}`}>
          {status.state === "error" ? status.message : "All fields are required."}
        </p>
      </div>
    </form>
  );
}

function Field({ id, name, label, type = "text", autoComplete, error }: { id: string; name: string; label: string; type?: string; autoComplete?: string; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="nd-label nd-muted block">{label} <span aria-hidden="true" className="text-[color:var(--sky)]">*</span></label>
      <input id={id} name={name} type={type} autoComplete={autoComplete} required aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className="nd-input" />
      {error ? <p id={`${id}-err`} className="mt-2 text-[0.9375rem] text-[color:var(--sky)]">{error}</p> : null}
    </div>
  );
}
