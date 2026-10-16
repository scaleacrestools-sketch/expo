import { NextResponse } from "next/server";
import { contactSchema, type ContactFieldErrors } from "@/lib/contactSchema";
import { services } from "@/content/services";
import { site } from "@/content/site";

export const runtime = "nodejs";

// Simple in-memory rate limit per IP (per server instance). Pair with an edge/WAF rule in production.
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 5, WINDOW_MS = 10 * 60 * 1000;
function rateLimited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { count: 1, reset: now + WINDOW_MS }); return false; }
  h.count += 1;
  return h.count > LIMIT;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, message: "Too many requests. Please try again in a few minutes." }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 }); }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFieldErrors | undefined;
      if (key && !fields[key]) fields[key] = issue.message;
    }
    // Honeypot or timing failures look like success to bots but are silently dropped.
    if (fields.website || fields.startedAt) return NextResponse.json({ ok: false, message: "Submission rejected." }, { status: 400 });
    return NextResponse.json({ ok: false, message: "Please check the highlighted fields.", fields }, { status: 422 });
  }
  const data = parsed.data;
  if (Date.now() - data.startedAt < 3000) return NextResponse.json({ ok: false, message: "Submission rejected." }, { status: 400 });

  const serviceTitle = services.find((s) => s.slug === data.service)?.title ?? data.service;
  const reference = `SA-${Date.now().toString(36).toUpperCase()}`;
  const subject = `New enquiry ${reference} — ${serviceTitle} — ${data.company}`;
  const text = [
    `Reference: ${reference}`, `Name: ${data.fullName}`, `Email: ${data.email}`, `Phone: ${data.phone}`, `Company: ${data.company}`, `Service: ${serviceTitle}`, "", data.message, "", `Received: ${new Date().toISOString()} · IP: ${ip}`,
  ].join("\n");
  const html = `<div style="font-family:Outfit,Segoe UI,Arial,sans-serif;max-width:640px"><h2 style="margin:0 0 16px">New website enquiry <span style="color:#F15A3C">${reference}</span></h2><table cellpadding="6" style="border-collapse:collapse">${[
    ["Name", data.fullName], ["Email", data.email], ["Phone", data.phone], ["Company", data.company], ["Service", serviceTitle],
  ].map(([k, v]) => `<tr><td style="color:#9DA2A6">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`).join("")}</table><p style="white-space:pre-wrap;border-left:3px solid #F15A3C;padding-left:12px">${escapeHtml(data.message)}</p><p style="color:#9DA2A6;font-size:12px">Received ${new Date().toISOString()} · IP ${escapeHtml(ip)}</p></div>`;

  const deliveries: Promise<boolean>[] = [];
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (resendKey && from) {
    deliveries.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, text, html }),
      }).then((r) => r.ok).catch(() => false),
    );
  }
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    deliveries.push(
      fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference, ...data, service: serviceTitle, receivedAt: new Date().toISOString() }) })
        .then((r) => r.ok).catch(() => false),
    );
  }

  if (!deliveries.length) {
    console.error("[contact] No delivery channel configured (RESEND_API_KEY + CONTACT_FROM_EMAIL, or CONTACT_WEBHOOK_URL).");
    return NextResponse.json({ ok: false, message: `The enquiry form isn't connected yet. Please email us at ${site.email}.` }, { status: 503 });
  }
  const results = await Promise.all(deliveries);
  if (!results.some(Boolean)) {
    console.error("[contact] All delivery channels failed for", reference);
    return NextResponse.json({ ok: false, message: `We couldn't deliver your message right now. Please email us at ${site.email}.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true, reference });
}
