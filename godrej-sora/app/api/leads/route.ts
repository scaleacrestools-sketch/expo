import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { leadSchema, normalisePhone } from '@/lib/lead-schema';
import { deliver, duplicateKey, findDuplicate, rateLimited, remember, type LeadRecord } from '@/lib/lead-store';

export const runtime = 'nodejs';

const CONSENT_TEXT = 'I agree to be contacted by the advertiser about Godrej Sora via call, SMS, WhatsApp and email, and I have read the Privacy Policy. This overrides DND/NDNC registration.';

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 }); }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return NextResponse.json({ ok: false, error: 'Please check the highlighted fields.', fieldErrors }, { status: 422 });
  }
  const d = parsed.data;

  // spam heuristics: honeypot filled, or submitted faster than a human could type
  if (d.website || (d.startedAt && Date.now() - d.startedAt < 2500)) {
    return NextResponse.json({ ok: true, id: randomUUID() }); // silently accept, do not store
  }

  const phone = normalisePhone(d.phone);
  const key = duplicateKey(phone, d.magnet);
  const dup = findDuplicate(key);
  const lead: LeadRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ip,
    userAgent: req.headers.get('user-agent') || '',
    magnet: d.magnet, source: d.source, name: d.name, phone: d.phone, phoneNormalised: phone,
    email: d.email || '', configuration: d.configuration || '', budget: d.budget || '', timeline: d.timeline || '',
    visitDate: d.visitDate || '', visitSlot: d.visitSlot || '', message: d.message || '',
    attribution: d.attribution || {},
    consent: { marketing: true, text: CONSENT_TEXT, at: new Date().toISOString() },
    ...(dup ? { duplicateOf: dup } : {}),
  };

  const { delivered, errors } = await deliver(lead);
  if (!dup) remember(key, lead.id);
  if (errors.length) console.error('[leads] delivery errors', errors);
  if (!delivered) return NextResponse.json({ ok: false, error: 'We could not record your request. Please call us directly.' }, { status: 502 });
  return NextResponse.json({ ok: true, id: lead.id, duplicate: Boolean(dup) });
}
